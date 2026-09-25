import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string | null;
  permissions?: string[];
  createdAt?: string;
  verifiedAt?: string | null;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  updateUser: (updatedUser: Partial<User>) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  useEffect(() => {
    // Perform only on client side
    const storedToken = localStorage.getItem("iilp_token");
    const storedUser = localStorage.getItem("iilp_user");

    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);

        // Fetch fresh profile & permissions from backend in background
        fetch(`${apiUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        })
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error("Failed to fetch fresh profile");
          })
          .then((fresh) => {
            if (fresh && fresh.id) {
              const updatedUser: User = {
                ...parsedUser,
                name: fresh.name || parsedUser.name,
                email: fresh.email || parsedUser.email,
                role: fresh.role || parsedUser.role,
                permissions: Array.isArray(fresh.permissions) ? fresh.permissions : parsedUser.permissions,
              };
              setUser(updatedUser);
              localStorage.setItem("iilp_user", JSON.stringify(updatedUser));
            }
          })
          .catch(() => {
            // keep existing stored profile on transient network error
          });
      } catch (e) {
        // Clear corrupt storage
        localStorage.removeItem("iilp_token");
        localStorage.removeItem("iilp_user");
      }
    }
    setIsLoading(false);
  }, [apiUrl]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("iilp_token", newToken);
    localStorage.setItem("iilp_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem("iilp_user", JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem("iilp_token");
    localStorage.removeItem("iilp_user");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      const role = (user.role || "").toLowerCase();
      if (role === "admin" || role === "super admin") return true;
      if (user.permissions?.includes("*")) return true;
      return Boolean(user.permissions?.includes(permission));
    },
    [user]
  );

  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      if (!user) return false;
      const role = (user.role || "").toLowerCase();
      if (role === "admin" || role === "super admin") return true;
      if (user.permissions?.includes("*")) return true;
      return permissions.some((p) => user.permissions?.includes(p));
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isLoading,
        login,
        updateUser,
        logout,
        hasPermission,
        hasAnyPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
