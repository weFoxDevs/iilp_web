import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/common/components/AuthContext";
import Toast, { ToastType } from "@/common/components/Toast";
import { PageContentManager } from "@/modules/admin/components/PageContentManager";
import { SiteMetricsManager } from "@/modules/admin/components/SiteMetricsManager";
import { TestimonialsManager } from "@/modules/admin/components/TestimonialsManager";
import { DepartmentsManager } from "@/modules/admin/components/DepartmentsManager";
import { EventsManager } from "@/modules/admin/components/EventsManager";
import { SiteLayoutManager } from "@/modules/admin/components/SiteLayoutManager";
import { NewsManager } from "@/modules/admin/components/NewsManager";
import { FellowshipApplicationsManager } from "@/modules/admin/components/FellowshipApplicationsManager";

interface DashboardMetrics {
  totalUsers: number;
  totalDepartments: number;
  totalRoles: number;
  totalPermissions: number;
  systemStatus: string;
}

interface RecentUser {
  id: number;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

interface SystemInfo {
  platform: string;
  version: string;
  uptimeSeconds: number;
  nodeEnv: string;
  serverTime: string;
}

interface DashboardSummary {
  metrics: DashboardMetrics;
  recentUsers: RecentUser[];
  systemInfo: SystemInfo;
}

interface PermissionItem {
  id: number;
  name: string;
  description?: string;
}

interface RoleItem {
  id: number;
  name: string;
  permissions?: PermissionItem[];
  users?: unknown[];
}

interface AdminUserItem {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  verifiedAt: string | null;
  role?: {
    id: number;
    name: string;
    permissions?: PermissionItem[];
  } | null;
}

const VALID_TABS = [
  "overview",
  "admin-manage",
  "role-manage",
  "events",
  "fellowship-applications",
  "news",
  "site-layout",
  "page-content",
  "departments",
  "site-metrics",
  "testimonials",
] as const;

type TabType = (typeof VALID_TABS)[number];

const isTabType = (val: unknown): val is TabType => {
  return typeof val === "string" && (VALID_TABS as readonly string[]).includes(val);
};

const getInitialTab = (): TabType => {
  if (typeof window !== "undefined") {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlTab = searchParams.get("tab");
      if (isTabType(urlTab)) return urlTab;

      const savedTab = localStorage.getItem("admin_active_tab");
      if (isTabType(savedTab)) return savedTab;
    } catch {
      // ignore window or localStorage issues
    }
  }
  return "overview";
};

function AdminRoleSubNav({
  active,
  onSelect,
  adminCount,
  roleCount,
}: {
  active: "admin-manage" | "role-manage";
  onSelect: (tab: "admin-manage" | "role-manage") => void;
  adminCount: number;
  roleCount: number;
}) {
  return (
    <div className="flex items-center gap-1.5 p-1.5 bg-white border border-[#b0ebff] rounded-2xl w-fit shadow-xs">
      <button
        onClick={() => onSelect("admin-manage")}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          active === "admin-manage"
            ? "bg-[#000080] text-white shadow-xs"
            : "text-[#00698c] hover:bg-[#f4faff] hover:text-[#000080]"
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>Administrator Accounts</span>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
            active === "admin-manage"
              ? "bg-white/20 text-white"
              : "bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff]"
          }`}
        >
          {adminCount}
        </span>
      </button>

      <button
        onClick={() => onSelect("role-manage")}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          active === "role-manage"
            ? "bg-[#000080] text-white shadow-xs"
            : "text-[#00698c] hover:bg-[#f4faff] hover:text-[#000080]"
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>Roles &amp; Permissions</span>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
            active === "role-manage"
              ? "bg-white/20 text-white"
              : "bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff]"
          }`}
        >
          {roleCount}
        </span>
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, token, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  // Navigation state (restores tab from URL query or localStorage on initial render)
  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab);
  const [adminMenuOpen, setAdminMenuOpen] = useState(true);
  const [cmsMenuOpen, setCmsMenuOpen] = useState(true);

  // Data states
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [adminUsers, setAdminUsers] = useState<AdminUserItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Modals state - Admin User
  const [createAdminModalOpen, setCreateAdminModalOpen] = useState(false);
  const [editAdminModalOpen, setEditAdminModalOpen] = useState(false);
  const [deleteAdminModalOpen, setDeleteAdminModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserItem | null>(null);
  const [adminFormData, setAdminFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
  });
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);

  // Modals state - Role
  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);
  const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
  const [deleteRoleModalOpen, setDeleteRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleItem | null>(null);
  const [roleFormData, setRoleFormData] = useState<{
    name: string;
    permissionIds: number[];
  }>({
    name: "",
    permissionIds: [],
  });
  const [isSubmittingRole, setIsSubmittingRole] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  // Fetch all dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!token) return;

    try {
      // 1. Fetch Dashboard Summary
      const summaryRes = await fetch(`${apiUrl}/admin/dashboard/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!summaryRes.ok) {
        if (summaryRes.status === 401) {
          logout();
          return;
        }
        throw new Error(`Failed to load dashboard summary (${summaryRes.status})`);
      }
      const summaryJson: DashboardSummary = await summaryRes.json();
      setSummary(summaryJson);

      // 2. Fetch Admin Users
      const usersRes = await fetch(`${apiUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (usersRes.ok) {
        const usersJson = await usersRes.json();
        setAdminUsers(Array.isArray(usersJson) ? usersJson : []);
      }

      // 3. Fetch Roles
      const rolesRes = await fetch(`${apiUrl}/roles`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (rolesRes.ok) {
        const rolesJson = await rolesRes.json();
        setRoles(Array.isArray(rolesJson) ? rolesJson : []);
      }

      // 4. Fetch Permissions
      const permsRes = await fetch(`${apiUrl}/permissions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (permsRes.ok) {
        const permsJson = await permsRes.json();
        setPermissions(Array.isArray(permsJson) ? permsJson : []);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to connect to backend server.";
      setFetchError(msg);
    } finally {
      setIsDataLoading(false);
    }
  }, [token, apiUrl, logout]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchDashboardData();
    }
  }, [isAuthenticated, token, fetchDashboardData]);

  // Handle tab change with shallow URL update and localStorage persistence
  const handleTabChange = useCallback(
    (newTab: TabType) => {
      setActiveTab(newTab);
      try {
        localStorage.setItem("admin_active_tab", newTab);
      } catch {
        // ignore storage errors
      }

      if (newTab === "admin-manage" || newTab === "role-manage") {
        setAdminMenuOpen(true);
      } else if (
        newTab === "site-layout" ||
        newTab === "page-content" ||
        newTab === "news" ||
        newTab === "departments" ||
        newTab === "site-metrics" ||
        newTab === "testimonials"
      ) {
        setCmsMenuOpen(true);
      }

      // Shallow route update to preserve tab across page reloads without re-triggering remount
      if (router.isReady) {
        void router.replace(
          {
            pathname: router.pathname,
            query: { ...router.query, tab: newTab },
          },
          undefined,
          { shallow: true }
        );
      }
    },
    [router]
  );

  // Synchronize active tab when browser back/forward or navigation events occur
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      try {
        const urlObj = new URL(url, window.location.origin);
        const queryTab = urlObj.searchParams.get("tab");
        if (isTabType(queryTab)) {
          setActiveTab(queryTab);
          localStorage.setItem("admin_active_tab", queryTab);
          if (queryTab === "admin-manage" || queryTab === "role-manage") {
            setAdminMenuOpen(true);
          } else if (
            queryTab === "site-layout" ||
            queryTab === "page-content" ||
            queryTab === "news" ||
            queryTab === "departments" ||
            queryTab === "site-metrics" ||
            queryTab === "testimonials"
          ) {
            setCmsMenuOpen(true);
          }
        }
      } catch {
        // ignore url parsing error
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // Keep URL query in sync if user navigates to /admin/dashboard directly without ?tab=
  useEffect(() => {
    if (!router.isReady) return;

    if (!router.query.tab) {
      const currentTab = getInitialTab();
      void router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, tab: currentTab },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [router.isReady, router.query.tab, router.pathname, router]);

  // Uptime formatter
  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(" ");
  };

  // ================= ADMIN USER CRUD HANDLERS =================
  const openCreateAdminModal = () => {
    setAdminFormData({
      name: "",
      email: "",
      password: "",
      roleId: roles.length > 0 ? String(roles[0].id) : "",
    });
    setCreateAdminModalOpen(true);
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmittingAdmin(true);

    try {
      const res = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: adminFormData.name,
          email: adminFormData.email,
          password: adminFormData.password,
          roleId: adminFormData.roleId ? Number(adminFormData.roleId) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create administrator");
      }

      setToast({ message: `Administrator ${data.name} created successfully!`, type: "success" });
      setCreateAdminModalOpen(false);
      fetchDashboardData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error creating admin";
      setToast({ message: msg, type: "error" });
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  const openEditAdminModal = (item: AdminUserItem) => {
    setSelectedUser(item);
    setAdminFormData({
      name: item.name,
      email: item.email,
      password: "",
      roleId: item.role ? String(item.role.id) : "",
    });
    setEditAdminModalOpen(true);
  };

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedUser) return;
    setIsSubmittingAdmin(true);

    try {
      const payload: { name: string; email: string; password?: string; roleId?: number } = {
        name: adminFormData.name,
        email: adminFormData.email,
      };
      if (adminFormData.password) {
        payload.password = adminFormData.password;
      }
      if (adminFormData.roleId) {
        payload.roleId = Number(adminFormData.roleId);
      }

      const res = await fetch(`${apiUrl}/users/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update administrator");
      }

      setToast({ message: `Administrator ${data.name} updated successfully!`, type: "success" });
      setEditAdminModalOpen(false);
      setSelectedUser(null);
      fetchDashboardData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating admin";
      setToast({ message: msg, type: "error" });
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  const openDeleteAdminModal = (item: AdminUserItem) => {
    setSelectedUser(item);
    setDeleteAdminModalOpen(true);
  };

  const handleDeleteAdmin = async () => {
    if (!token || !selectedUser) return;
    setIsSubmittingAdmin(true);

    try {
      const res = await fetch(`${apiUrl}/users/${selectedUser.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete administrator");
      }

      setToast({ message: "Administrator successfully deleted.", type: "success" });
      setDeleteAdminModalOpen(false);
      setSelectedUser(null);
      fetchDashboardData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error deleting admin";
      setToast({ message: msg, type: "error" });
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  // ================= ROLE CRUD HANDLERS =================
  const openCreateRoleModal = () => {
    setRoleFormData({
      name: "",
      permissionIds: [],
    });
    setCreateRoleModalOpen(true);
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmittingRole(true);

    try {
      const res = await fetch(`${apiUrl}/roles`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleFormData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create role");
      }

      setToast({ message: `Role "${data.name}" created successfully!`, type: "success" });
      setCreateRoleModalOpen(false);
      fetchDashboardData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error creating role";
      setToast({ message: msg, type: "error" });
    } finally {
      setIsSubmittingRole(false);
    }
  };

  const openEditRoleModal = (r: RoleItem) => {
    setSelectedRole(r);
    setRoleFormData({
      name: r.name,
      permissionIds: r.permissions ? r.permissions.map((p) => p.id) : [],
    });
    setEditRoleModalOpen(true);
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedRole) return;
    setIsSubmittingRole(true);

    try {
      const res = await fetch(`${apiUrl}/roles/${selectedRole.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleFormData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update role");
      }

      setToast({ message: `Role "${data.name}" updated successfully!`, type: "success" });
      setEditRoleModalOpen(false);
      setSelectedRole(null);
      fetchDashboardData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error updating role";
      setToast({ message: msg, type: "error" });
    } finally {
      setIsSubmittingRole(false);
    }
  };

  const openDeleteRoleModal = (r: RoleItem) => {
    setSelectedRole(r);
    setDeleteRoleModalOpen(true);
  };

  const handleDeleteRole = async () => {
    if (!token || !selectedRole) return;
    setIsSubmittingRole(true);

    try {
      const res = await fetch(`${apiUrl}/roles/${selectedRole.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete role");
      }

      setToast({ message: `Role deleted successfully.`, type: "success" });
      setDeleteRoleModalOpen(false);
      setSelectedRole(null);
      fetchDashboardData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error deleting role";
      setToast({ message: msg, type: "error" });
    } finally {
      setIsSubmittingRole(false);
    }
  };

  const togglePermission = (id: number) => {
    setRoleFormData((prev) => {
      const exists = prev.permissionIds.includes(id);
      return {
        ...prev,
        permissionIds: exists
          ? prev.permissionIds.filter((pId) => pId !== id)
          : [...prev.permissionIds, id],
      };
    });
  };

  const toggleAllPermissions = () => {
    if (roleFormData.permissionIds.length === permissions.length) {
      setRoleFormData((prev) => ({ ...prev, permissionIds: [] }));
    } else {
      setRoleFormData((prev) => ({
        ...prev,
        permissionIds: permissions.map((p) => p.id),
      }));
    }
  };

  // Filtered users for search
  const filteredUsers = adminUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.role?.name && u.role.name.toLowerCase().includes(userSearch.toLowerCase())),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4faff] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#00bfff] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f4faff] flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-playfair font-bold text-[#0a0d12]">Access Denied</h2>
          <p className="text-sm font-sans text-[#4a5565]">
            You must be logged in to access the administrator panel. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f4faff] flex flex-col md:flex-row">
      {/* Sidebar Navigation - Fixed Height on Screen */}
      <aside className="w-full md:w-72 bg-white border-r border-[#e5e7eb] flex flex-col shrink-0 h-auto md:h-full z-20 select-none shadow-xs">
        {/* Sidebar Header with Official Logo */}
        <div className="h-18 flex items-center justify-between px-6 border-b border-[#e5e7eb] shrink-0 bg-white">
          <Link href="/" className="flex items-center gap-3 group" aria-label="IILP Home">
            <div className="relative w-11 h-11 shrink-0 drop-shadow-xs">
              <Image
                src="/assets/logo.png"
                alt="Institute for International Law & Public Policy Logo"
                fill
                className="object-contain select-none transition-transform group-hover:scale-105"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-playfair font-bold text-base text-[#0a0d12] leading-tight group-hover:text-[#000080] transition-colors">
                IILP Executive
              </span>
              <span className="text-[10px] text-[#00698c] font-semibold uppercase tracking-wider font-sans">
                CMS Console
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-1.5" title="System Online">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
        </div>

        {/* Sidebar Nav Items with Independent Scrolling */}
        <nav
          className="flex-1 px-3 py-4 space-y-4 overflow-y-auto font-sans min-h-0"
          data-lenis-prevent="true"
        >
          {/* Section: Overview */}
          <div className="space-y-1">
            <div className="px-2.5 text-[11px] font-bold uppercase tracking-wider text-[#6a7282]">
              Overview
            </div>
            <button
              onClick={() => handleTabChange("overview")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#000080] text-white shadow-xs font-bold"
                  : "text-[#4a5565] hover:bg-[#f4faff] hover:text-[#000080]"
              }`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              <span className="truncate whitespace-nowrap">Dashboard Overview</span>
            </button>
          </div>

          {/* Section: Access & Role Management */}
          <div className="space-y-1 pt-1">
            <div className="px-2.5 text-[11px] font-bold uppercase tracking-wider text-[#6a7282]">
              Access &amp; Security
            </div>
            
            {/* Collapsible Group Header */}
            <button
              onClick={() => setAdminMenuOpen(!adminMenuOpen)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "admin-manage" || activeTab === "role-manage"
                  ? "bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff]"
                  : "text-[#4a5565] hover:bg-[#f4faff] hover:text-[#000080]"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                  activeTab === "admin-manage" || activeTab === "role-manage"
                    ? "bg-[#00bfff] text-white"
                    : "bg-[#f0f4f8] text-[#4a5565]"
                }`}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <span className="font-bold truncate whitespace-nowrap">Admin &amp; Role Management</span>
              </div>
              
              <div className="flex items-center gap-1 shrink-0 ml-1.5">
                <span className="px-1.5 py-0.5 rounded-full bg-white/90 border border-[#b0ebff] text-[10px] font-extrabold text-[#00698c] leading-none">
                  {adminUsers.length + roles.length}
                </span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    adminMenuOpen ? "rotate-180 text-[#00698c]" : "text-[#4a5565]"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Sub-items */}
            {adminMenuOpen && (
              <div className="pl-2 pr-0 py-1 space-y-1 ml-2.5 border-l-2 border-[#b0ebff]">
                {/* Sub-item: Admin Accounts */}
                <button
                  onClick={() => handleTabChange("admin-manage")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "admin-manage"
                      ? "bg-[#000080] text-white shadow-xs font-bold"
                      : "text-[#4a5565] hover:bg-[#f4faff] hover:text-[#000080]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="truncate whitespace-nowrap">Admin Accounts</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ml-1.5 leading-none ${
                    activeTab === "admin-manage"
                      ? "bg-white/20 text-white"
                      : "bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff]"
                  }`}>
                    {adminUsers.length}
                  </span>
                </button>

                {/* Sub-item: Role Management */}
                <button
                  onClick={() => handleTabChange("role-manage")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "role-manage"
                      ? "bg-[#000080] text-white shadow-xs font-bold"
                      : "text-[#4a5565] hover:bg-[#f4faff] hover:text-[#000080]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="truncate whitespace-nowrap">Role Management</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ml-1.5 leading-none ${
                    activeTab === "role-manage"
                      ? "bg-white/20 text-white"
                      : "bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff]"
                  }`}>
                    {roles.length}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Section: Academic Programs & Events */}
          <div className="space-y-1 pt-1">
            <div className="px-2.5 text-[11px] font-bold uppercase tracking-wider text-[#6a7282]">
              Academic Programs
            </div>

            <button
              onClick={() => handleTabChange("events")}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "events"
                  ? "bg-[#000080] text-white shadow-xs font-bold"
                  : "text-[#4a5565] hover:bg-[#f4faff] hover:text-[#000080]"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                  activeTab === "events"
                    ? "bg-[#00bfff] text-white"
                    : "bg-[#f0f4f8] text-[#4a5565]"
                }`}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-bold truncate whitespace-nowrap">Events &amp; Symposia</span>
              </div>
            </button>

            <button
              onClick={() => handleTabChange("fellowship-applications")}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "fellowship-applications"
                  ? "bg-[#000080] text-white shadow-xs font-bold"
                  : "text-[#4a5565] hover:bg-[#f4faff] hover:text-[#000080]"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                  activeTab === "fellowship-applications"
                    ? "bg-[#00bfff] text-white"
                    : "bg-[#f0f4f8] text-[#4a5565]"
                }`}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <span className="font-bold truncate whitespace-nowrap">Fellowships</span>
              </div>
            </button>
          </div>

          {/* Section: Dynamic Content Management (CMS) */}
          <div className="space-y-1 pt-1">
            <div className="px-2.5 text-[11px] font-bold uppercase tracking-wider text-[#6a7282]">
              Website &amp; Content
            </div>
            
            <button
              onClick={() => setCmsMenuOpen(!cmsMenuOpen)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "site-layout" ||
                activeTab === "page-content" ||
                activeTab === "news" ||
                activeTab === "departments" ||
                activeTab === "site-metrics" ||
                activeTab === "testimonials"
                  ? "bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff]"
                  : "text-[#4a5565] hover:bg-[#f4faff] hover:text-[#000080]"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                  activeTab === "site-layout" || activeTab === "page-content" || activeTab === "news" || activeTab === "departments" || activeTab === "site-metrics" || activeTab === "testimonials"
                    ? "bg-[#00bfff] text-white"
                    : "bg-[#f0f4f8] text-[#4a5565]"
                }`}>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className="font-bold truncate whitespace-nowrap">CMS &amp; Page Blocks</span>
              </div>
              
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ml-1.5 ${
                  cmsMenuOpen ||
                  activeTab === "site-layout" ||
                  activeTab === "page-content" ||
                  activeTab === "news" ||
                  activeTab === "departments" ||
                  activeTab === "site-metrics" ||
                  activeTab === "testimonials"
                    ? "rotate-180 text-[#00698c]"
                    : "text-[#4a5565]"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {cmsMenuOpen && (
              <div className="pl-2 pr-0 py-1 space-y-1 ml-2.5 border-l-2 border-[#b0ebff]">
                <button
                  onClick={() => handleTabChange("site-layout")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "site-layout"
                      ? "bg-[#000080] text-white shadow-xs font-bold"
                      : "text-[#4a5565] hover:bg-[#f4faff] hover:text-[#000080]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeTab === "site-layout" ? "bg-[#00bfff]" : "bg-purple-500"}`}></span>
                    <span className="truncate whitespace-nowrap">Site Layout &amp; Branding</span>
                  </div>
                </button>

                <button
                  onClick={() => handleTabChange("page-content")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "page-content"
                      ? "bg-[#000080] text-white shadow-xs font-bold"
                      : "text-[#4a5565] hover:bg-[#f4faff] hover:text-[#000080]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeTab === "page-content" ? "bg-[#00bfff]" : "bg-[#00698c]"}`}></span>
                    <span className="truncate whitespace-nowrap">Page Content (CMS)</span>
                  </div>
                </button>

                <button
                  onClick={() => handleTabChange("news")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "news"
                      ? "bg-[#000080] text-white shadow-xs font-bold"
                      : "text-[#4a5565] hover:bg-[#f4faff] hover:text-[#000080]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeTab === "news" ? "bg-[#00bfff]" : "bg-amber-500"}`}></span>
                    <span className="truncate whitespace-nowrap">News &amp; Media Articles</span>
                  </div>
                </button>

                <button
                  onClick={() => handleTabChange("site-metrics")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "site-metrics"
                      ? "bg-[#000080] text-white shadow-xs font-bold"
                      : "text-[#4a5565] hover:bg-[#f4faff] hover:text-[#000080]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeTab === "site-metrics" ? "bg-[#00bfff]" : "bg-[#00698c]"}`}></span>
                    <span className="truncate whitespace-nowrap">Site Impact Metrics</span>
                  </div>
                </button>

                <button
                  onClick={() => handleTabChange("testimonials")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "testimonials"
                      ? "bg-[#000080] text-white shadow-xs font-bold"
                      : "text-[#4a5565] hover:bg-[#f4faff] hover:text-[#000080]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeTab === "testimonials" ? "bg-[#00bfff]" : "bg-emerald-500"}`}></span>
                    <span className="truncate whitespace-nowrap">Testimonials</span>
                  </div>
                </button>

                <button
                  onClick={() => handleTabChange("departments")}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "departments"
                      ? "bg-[#000080] text-white shadow-xs font-bold"
                      : "text-[#4a5565] hover:bg-[#f4faff] hover:text-[#000080]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeTab === "departments" ? "bg-[#00bfff]" : "bg-purple-500"}`}></span>
                    <span className="truncate whitespace-nowrap">Academic Departments</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* User Session Footer - Fixed at Bottom */}
        <div className="p-4 border-t border-[#e5e7eb] space-y-3 font-sans shrink-0 bg-white">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#e6f9ff] border border-[#b0ebff] text-[#000080] font-bold flex items-center justify-center text-sm shrink-0 shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#101828] truncate">{user?.name}</p>
              <p className="text-[11px] text-[#4a5565] truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-xs font-semibold cursor-pointer border border-transparent hover:border-red-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area - Independently Scrollable */}
      <div className="flex-1 flex flex-col h-full min-h-0 min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-18 bg-white border-b border-[#e5e7eb] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-playfair font-bold text-[#0a0d12] capitalize">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "admin-manage" && "Administrator Management"}
              {activeTab === "role-manage" && "Role & RBAC Security"}
              {activeTab === "events" && "Events & Conferences Management"}
              {activeTab === "fellowship-applications" && "Fellowship Applications & Admissions"}
              {activeTab === "site-layout" && "Global Layout, Navbar & Footer Branding"}
              {activeTab === "page-content" && "Page Content (CMS) Engine"}
              {activeTab === "news" && "News & Media Articles"}
              {activeTab === "site-metrics" && "Site Impact Metrics"}
              {activeTab === "testimonials" && "Student & Scholar Testimonials"}
              {activeTab === "departments" && "Academic Departments & Disciplines"}
            </h1>
          </div>

          <div className="flex items-center gap-3 font-sans">
            <button
              onClick={fetchDashboardData}
              disabled={isDataLoading}
              className="px-3.5 py-2 rounded-full border border-[#d5d5ed] text-[#4a5565] hover:text-[#0a0d12] hover:bg-[#f9fafb] transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1.5"
              title="Refresh Data"
            >
              <svg
                className={`w-3.5 h-3.5 ${isDataLoading ? "animate-spin text-[#00bfff]" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 rounded-full bg-[#00bfff] hover:bg-[#009ecc] text-white transition-colors text-xs font-semibold flex items-center gap-1.5 shadow-[0px_2px_8px_rgba(0,191,255,0.35)]"
            >
              <span>View Portal</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        </header>

        {/* Error Notification */}
        {fetchError && (
          <div className="m-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between text-xs text-red-700 font-sans">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{fetchError}</span>
            </div>
            <button
              onClick={fetchDashboardData}
              className="font-bold underline hover:no-underline cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Scrollable Dashboard Body */}
        <main
          className="flex-1 overflow-y-auto min-h-0 p-6 sm:p-8 space-y-8"
          data-lenis-prevent="true"
        >
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Welcome Banner with Official Seal */}
              <div className="relative overflow-hidden rounded-2xl border border-[#b0ebff] bg-gradient-to-r from-[#e6f9ff] via-[#e6f9ff]/50 to-white p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
                {/* Watermark Emblem in Background */}
                <div className="absolute -right-8 -bottom-10 w-52 h-52 opacity-[0.06] pointer-events-none select-none">
                  <Image src="/assets/logo.png" alt="" fill className="object-contain" />
                </div>

                <div className="space-y-2 text-center sm:text-left z-10">
                  <div className="inline-flex items-center border border-[#b0ebff] rounded-full px-3 py-1 bg-white">
                    <span className="font-sans font-semibold text-xs text-[#00698c] uppercase tracking-wider">
                      Welcome Back
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-[#000080]">
                    Greetings, {user?.name || "Administrator"}
                  </h2>
                  <p className="text-sm font-sans text-[#4a5565] max-w-xl leading-relaxed">
                    Your authenticated session is active. You have executive access to manage CMS content, admin accounts, and security roles.
                  </p>
                </div>

                {/* Official Institutional Badge Card with Logo */}
                <div className="flex items-center gap-4 bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-[#b0ebff] shadow-xs shrink-0 z-10 font-sans">
                  <div className="relative w-14 h-14 shrink-0 drop-shadow-xs">
                    <Image
                      src="/assets/logo.png"
                      alt="IILP Official Seal"
                      fill
                      className="object-contain select-none"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-[#0a0d12]">Institute for International Law &amp; Public Policy</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#000080] text-white text-[11px] font-bold uppercase tracking-wider">
                        {user?.role || "Super Admin"}
                      </span>
                      <span className="text-[11px] text-[#4a5565]">
                        Env: <code className="font-mono text-[#00698c] font-semibold">{summary?.systemInfo?.nodeEnv || "production"}</code>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Metric Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
                {/* Stat 1: Registered Admins */}
                <div className="bg-white border border-[#b0ebff] rounded-2xl p-6 shadow-xs space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#00698c] uppercase tracking-wider">
                      Admins &amp; Users
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#e6f9ff] text-[#00698c] flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-playfair font-bold text-[#000080]">
                      {adminUsers.length || summary?.metrics.totalUsers || (isDataLoading ? "..." : 0)}
                    </span>
                    <span className="text-xs text-[#4a5565]">Registered accounts</span>
                  </div>
                </div>

                {/* Stat 2: Security Roles */}
                <div className="bg-white border border-[#b0ebff] rounded-2xl p-6 shadow-xs space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#00698c] uppercase tracking-wider">
                      Security Roles
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#e6f9ff] text-[#00698c] flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-playfair font-bold text-[#000080]">
                      {roles.length || summary?.metrics.totalRoles || (isDataLoading ? "..." : 0)}
                    </span>
                    <span className="text-xs text-[#4a5565]">RBAC tiers</span>
                  </div>
                </div>

                {/* Stat 3: Permissions */}
                <div className="bg-white border border-[#b0ebff] rounded-2xl p-6 shadow-xs space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#00698c] uppercase tracking-wider">
                      Permissions
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#e6f9ff] text-[#00698c] flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-playfair font-bold text-[#000080]">
                      {permissions.length || summary?.metrics.totalPermissions || (isDataLoading ? "..." : 0)}
                    </span>
                    <span className="text-xs text-[#4a5565]">Dynamic privileges</span>
                  </div>
                </div>

                {/* Stat 4: Departments */}
                <div className="bg-white border border-[#b0ebff] rounded-2xl p-6 shadow-xs space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#00698c] uppercase tracking-wider">
                      Academic Units
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#e6f9ff] text-[#00698c] flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-playfair font-bold text-[#000080]">
                      {summary?.metrics.totalDepartments ?? (isDataLoading ? "..." : 0)}
                    </span>
                    <span className="text-xs text-[#4a5565]">Departments</span>
                  </div>
                </div>
              </div>

              {/* Two Column Layout: System Runtime & Recent Users */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
                {/* System Info Box */}
                <div className="bg-white border border-[#b0ebff] rounded-2xl p-6 shadow-xs space-y-4 lg:col-span-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-playfair font-bold text-[#0a0d12]">System Health</h3>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Operational
                    </span>
                  </div>
                  <hr className="border-[#e5e7eb]" />
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#f4f4fa]">
                      <span className="text-[#4a5565]">Backend Engine</span>
                      <span className="font-semibold text-[#0a0d12]">NestJS + TypeORM</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f4f4fa]">
                      <span className="text-[#4a5565]">Server Uptime</span>
                      <span className="font-mono text-[#00698c] font-semibold">
                        {summary?.systemInfo ? formatUptime(summary.systemInfo.uptimeSeconds) : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#f4f4fa]">
                      <span className="text-[#4a5565]">Database Engine</span>
                      <span className="font-semibold text-[#0a0d12]">PostgreSQL 15+</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#4a5565]">API Gateway URI</span>
                      <span className="font-mono text-[#000080] font-semibold">/api/v1</span>
                    </div>
                  </div>
                </div>

                {/* Recent Accounts Table */}
                <div className="bg-white border border-[#b0ebff] rounded-2xl p-6 shadow-xs space-y-4 lg:col-span-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-playfair font-bold text-[#0a0d12]">Registered System Accounts</h3>
                    <button
                      onClick={() => handleTabChange("admin-manage")}
                      className="text-xs text-[#00698c] font-semibold hover:text-[#000080] transition-colors"
                    >
                      Manage All →
                    </button>
                  </div>
                  <hr className="border-[#e5e7eb]" />

                  {adminUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#e5e7eb] text-[#4a5565]">
                            <th className="pb-3 font-semibold">Administrator</th>
                            <th className="pb-3 font-semibold">Email</th>
                            <th className="pb-3 font-semibold">Role</th>
                            <th className="pb-3 font-semibold">Registered</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f4f4fa]">
                          {adminUsers.slice(0, 5).map((u) => (
                            <tr key={u.id} className="hover:bg-[#f9fafb] transition-colors">
                              <td className="py-3 font-semibold text-[#0a0d12] flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-[#e6f9ff] text-[#000080] font-bold text-[10px] flex items-center justify-center">
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                                {u.name}
                              </td>
                              <td className="py-3 text-[#4a5565] font-mono">{u.email}</td>
                              <td className="py-3">
                                <span className="px-2.5 py-1 rounded-full bg-[#e6f9ff] text-[#00698c] font-semibold text-[11px] border border-[#b0ebff]">
                                  {u.role?.name || "Unassigned"}
                                </span>
                              </td>
                              <td className="py-3 text-[#4a5565]">
                                {new Date(u.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-[#4a5565] py-4 text-center">
                      {isDataLoading ? "Loading accounts..." : "No accounts found."}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADMIN MANAGEMENT */}
          {activeTab === "admin-manage" && (
            <div className="space-y-6 font-sans">
              {/* Sub-Navigation Switcher for Admin & Role Management */}
              <AdminRoleSubNav
                active="admin-manage"
                onSelect={handleTabChange}
                adminCount={adminUsers.length}
                roleCount={roles.length}
              />

              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#b0ebff] rounded-2xl p-6 shadow-xs">
                <div>
                  <h2 className="text-2xl font-playfair font-bold text-[#000080]">Administrator Management</h2>
                  <p className="text-xs sm:text-sm text-[#4a5565] mt-1">
                    Create, configure, and manage administrative accounts with assigned security roles.
                  </p>
                </div>
                <button
                  onClick={openCreateAdminModal}
                  className="px-5 py-2.5 rounded-full bg-[#00bfff] hover:bg-[#009ecc] text-white text-xs font-semibold transition-all shadow-[0px_4px_14px_rgba(0,191,255,0.35)] flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Administrator</span>
                </button>
              </div>

              {/* Search Bar */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name, email, or role..."
                    className="w-full bg-white border border-[#d5d5ed] rounded-xl px-4 py-2.5 pl-10 text-xs font-sans text-[#0a0d12] placeholder-[#6a7282] focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20 transition-all"
                  />
                  <svg
                    className="w-4 h-4 text-[#6a7282] absolute left-3.5 top-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {userSearch && (
                  <button
                    onClick={() => setUserSearch("")}
                    className="text-xs text-[#00698c] hover:underline cursor-pointer"
                  >
                    Clear Filter
                  </button>
                )}
              </div>

              {/* Administrators Table */}
              <div className="bg-white border border-[#b0ebff] rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f9fafb] border-b border-[#e5e7eb] text-[#4a5565]">
                      <tr>
                        <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-[11px]">Administrator</th>
                        <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-[11px]">Email Address</th>
                        <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-[11px]">Assigned Role</th>
                        <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-[11px]">Date Registered</th>
                        <th className="py-3.5 px-6 font-semibold uppercase tracking-wider text-[11px] text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f4f4fa]">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((u) => {
                          const isCurrentUser = user?.email === u.email;
                          return (
                            <tr key={u.id} className="hover:bg-[#f9fafb] transition-colors">
                              <td className="py-4 px-6 font-semibold text-[#0a0d12]">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-[#e6f9ff] border border-[#b0ebff] text-[#000080] font-bold text-xs flex items-center justify-center shrink-0">
                                    {u.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <span className="block">{u.name}</span>
                                    {isCurrentUser && (
                                      <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                                        (You)
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-6 font-mono text-[#00698c]">{u.email}</td>
                              <td className="py-4 px-6">
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#e6f9ff] text-[#000080] border border-[#b0ebff] font-semibold text-xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#00bfff]"></span>
                                  {u.role?.name || "No Role"}
                                </span>
                              </td>
                              <td className="py-4 px-6 text-[#4a5565]">
                                {new Date(u.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </td>
                              <td className="py-4 px-6 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => openEditAdminModal(u)}
                                    className="p-1.5 text-[#00698c] hover:text-[#000080] hover:bg-[#e6f9ff] rounded-lg transition-colors cursor-pointer"
                                    title="Edit Administrator"
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>

                                  <button
                                    onClick={() => openDeleteAdminModal(u)}
                                    disabled={isCurrentUser}
                                    className={`p-1.5 rounded-lg transition-colors ${
                                      isCurrentUser
                                        ? "text-gray-300 cursor-not-allowed"
                                        : "text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                    }`}
                                    title={isCurrentUser ? "Cannot delete own account" : "Delete Administrator"}
                                  >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-10 text-center text-[#4a5565]">
                            {isDataLoading ? "Loading administrators..." : "No administrators matching query."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ROLE MANAGEMENT */}
          {activeTab === "role-manage" && (
            <div className="space-y-6 font-sans">
              {/* Sub-Navigation Switcher for Admin & Role Management */}
              <AdminRoleSubNav
                active="role-manage"
                onSelect={handleTabChange}
                adminCount={adminUsers.length}
                roleCount={roles.length}
              />

              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#b0ebff] rounded-2xl p-6 shadow-xs">
                <div>
                  <h2 className="text-2xl font-playfair font-bold text-[#000080]">Role &amp; RBAC Management</h2>
                  <p className="text-xs sm:text-sm text-[#4a5565] mt-1">
                    Configure institutional user roles and associate fine-grained API permission matrices.
                  </p>
                </div>
                <button
                  onClick={openCreateRoleModal}
                  className="px-5 py-2.5 rounded-full bg-[#00bfff] hover:bg-[#009ecc] text-white text-xs font-semibold transition-all shadow-[0px_4px_14px_rgba(0,191,255,0.35)] flex items-center gap-2 cursor-pointer self-start sm:self-auto"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Create New Role</span>
                </button>
              </div>

              {/* Roles Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roles.map((r) => {
                  const isProtected = r.name.toLowerCase() === "admin" || r.name.toLowerCase() === "super admin";
                  const rolePerms = r.permissions || [];

                  return (
                    <div
                      key={r.id}
                      className="bg-white border border-[#b0ebff] rounded-2xl p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-playfair font-bold text-lg text-[#0a0d12]">{r.name}</span>
                            {isProtected && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                                Core System Role
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-[#00698c] bg-[#e6f9ff] px-2.5 py-1 rounded-md border border-[#b0ebff]">
                            ID: {r.id}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-[#4a5565] font-semibold">Granted Permissions</span>
                            <span className="text-[#00698c] font-bold">{rolePerms.length} privileges</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-3 bg-[#f4faff] rounded-xl border border-[#e5e7eb]">
                            {rolePerms.length > 0 ? (
                              rolePerms.map((p) => (
                                <span
                                  key={p.id}
                                  className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-white border border-[#b0ebff] text-[#000080] font-medium"
                                >
                                  ✓ {p.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-[#6a7282] italic">No permissions assigned</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Role Actions */}
                      <div className="pt-4 border-t border-[#e5e7eb] flex items-center justify-between text-xs">
                        <span className="text-[11px] text-[#4a5565]">
                          Assigned to admins with {r.name} authority
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditRoleModal(r)}
                            className="px-3 py-1.5 rounded-lg border border-[#b0ebff] text-[#00698c] hover:text-[#000080] hover:bg-[#e6f9ff] font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>

                          <button
                            onClick={() => openDeleteRoleModal(r)}
                            disabled={isProtected}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                              isProtected
                                ? "text-gray-300 border border-gray-200 cursor-not-allowed"
                                : "text-red-600 border border-red-200 hover:bg-red-50 cursor-pointer"
                            }`}
                            title={isProtected ? "Core Admin role cannot be deleted" : "Delete Role"}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: EVENTS & CONFERENCES */}
          {activeTab === "events" && token && (
            <EventsManager
              token={token}
              onShowToast={(msg, type) => setToast({ message: msg, type })}
            />
          )}

          {/* TAB: SITE LAYOUT & BRANDING */}
          {activeTab === "site-layout" && token && (
            <SiteLayoutManager
              token={token}
              onShowToast={(msg, type) => setToast({ message: msg, type })}
            />
          )}

          {/* TAB: FELLOWSHIP APPLICATIONS */}
          {activeTab === "fellowship-applications" && token && (
            <FellowshipApplicationsManager
              token={token}
              onShowToast={(msg, type) => setToast({ message: msg, type })}
            />
          )}

          {/* TAB 4: PAGE CONTENT (CMS) */}
          {activeTab === "page-content" && token && (
            <PageContentManager
              token={token}
              onShowToast={(msg, type) => setToast({ message: msg, type })}
            />
          )}

          {/* TAB: NEWS & ARTICLES */}
          {activeTab === "news" && token && (
            <NewsManager
              token={token}
              onShowToast={(msg, type) => setToast({ message: msg, type })}
            />
          )}

          {/* TAB 5: SITE METRICS */}
          {activeTab === "site-metrics" && token && (
            <SiteMetricsManager
              token={token}
              onShowToast={(msg, type) => setToast({ message: msg, type })}
            />
          )}

          {/* TAB 6: TESTIMONIALS */}
          {activeTab === "testimonials" && token && (
            <TestimonialsManager
              token={token}
              onShowToast={(msg, type) => setToast({ message: msg, type })}
            />
          )}

          {/* TAB 7: DEPARTMENTS */}
          {activeTab === "departments" && token && (
            <DepartmentsManager
              token={token}
              onShowToast={(msg, type) => setToast({ message: msg, type })}
            />
          )}
        </main>
      </div>

      {/* ================= MODAL: CREATE ADMIN ================= */}
      {createAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-sans">
          <div className="bg-white border border-[#b0ebff] rounded-2xl shadow-2xl max-w-md w-full flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 sm:px-8 py-5 shrink-0">
              <div>
                <h3 className="text-xl font-playfair font-bold text-[#000080]">Create Administrator</h3>
                <p className="text-xs text-[#4a5565] mt-0.5">Add an authorized institutional account</p>
              </div>
              <button
                onClick={() => setCreateAdminModalOpen(false)}
                className="text-[#6a7282] hover:text-[#0a0d12] p-1 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto modal-scroll px-6 sm:px-8 py-5 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0a0d12]">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={adminFormData.name}
                    onChange={(e) => setAdminFormData({ ...adminFormData, name: e.target.value })}
                    placeholder="e.g. Dr. Sarah Ahmed"
                    className="w-full bg-[#f9fafb] border border-[#d5d5ed] rounded-xl px-3.5 py-2.5 text-xs text-[#0a0d12] placeholder-[#6a7282] focus:bg-white focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0a0d12]">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={adminFormData.email}
                    onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                    placeholder="sarah.ahmed@iilp.org"
                    className="w-full bg-[#f9fafb] border border-[#d5d5ed] rounded-xl px-3.5 py-2.5 text-xs text-[#0a0d12] placeholder-[#6a7282] focus:bg-white focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0a0d12]">
                    Initial Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={adminFormData.password}
                    onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#f9fafb] border border-[#d5d5ed] rounded-xl px-3.5 py-2.5 text-xs text-[#0a0d12] placeholder-[#6a7282] focus:bg-white focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0a0d12]">Assigned Role</label>
                  <select
                    value={adminFormData.roleId}
                    onChange={(e) => setAdminFormData({ ...adminFormData, roleId: e.target.value })}
                    className="w-full bg-[#f9fafb] border border-[#d5d5ed] rounded-xl px-3.5 py-2.5 text-xs text-[#0a0d12] focus:bg-white focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="flex items-center justify-end gap-3 px-6 sm:px-8 py-4 border-t border-[#e5e7eb] bg-[#fcfdff] shrink-0">
                <button
                  type="button"
                  onClick={() => setCreateAdminModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#d5d5ed] text-xs font-semibold text-[#4a5565] hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdmin}
                  className="px-5 py-2 rounded-full bg-[#00bfff] hover:bg-[#009ecc] text-white text-xs font-semibold shadow-[0px_2px_8px_rgba(0,191,255,0.35)] cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingAdmin ? "Creating..." : "Create Administrator"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT ADMIN ================= */}
      {editAdminModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-sans">
          <div className="bg-white border border-[#b0ebff] rounded-2xl shadow-2xl max-w-md w-full flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 sm:px-8 py-5 shrink-0">
              <div>
                <h3 className="text-xl font-playfair font-bold text-[#000080]">Edit Administrator</h3>
                <p className="text-xs text-[#4a5565] mt-0.5">Update credentials and access tier</p>
              </div>
              <button
                onClick={() => setEditAdminModalOpen(false)}
                className="text-[#6a7282] hover:text-[#0a0d12] p-1 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateAdmin} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto modal-scroll px-6 sm:px-8 py-5 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0a0d12]">Full Name</label>
                  <input
                    type="text"
                    required
                    value={adminFormData.name}
                    onChange={(e) => setAdminFormData({ ...adminFormData, name: e.target.value })}
                    className="w-full bg-[#f9fafb] border border-[#d5d5ed] rounded-xl px-3.5 py-2.5 text-xs text-[#0a0d12] focus:bg-white focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0a0d12]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={adminFormData.email}
                    onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                    className="w-full bg-[#f9fafb] border border-[#d5d5ed] rounded-xl px-3.5 py-2.5 text-xs text-[#0a0d12] focus:bg-white focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0a0d12]">
                    New Password <span className="text-[#6a7282] font-normal">(Leave blank to keep current)</span>
                  </label>
                  <input
                    type="password"
                    minLength={6}
                    value={adminFormData.password}
                    onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-[#f9fafb] border border-[#d5d5ed] rounded-xl px-3.5 py-2.5 text-xs text-[#0a0d12] placeholder-[#6a7282] focus:bg-white focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0a0d12]">Assigned Role</label>
                  <select
                    value={adminFormData.roleId}
                    onChange={(e) => setAdminFormData({ ...adminFormData, roleId: e.target.value })}
                    className="w-full bg-[#f9fafb] border border-[#d5d5ed] rounded-xl px-3.5 py-2.5 text-xs text-[#0a0d12] focus:bg-white focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="flex items-center justify-end gap-3 px-6 sm:px-8 py-4 border-t border-[#e5e7eb] bg-[#fcfdff] shrink-0">
                <button
                  type="button"
                  onClick={() => setEditAdminModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#d5d5ed] text-xs font-semibold text-[#4a5565] hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdmin}
                  className="px-5 py-2 rounded-full bg-[#00bfff] hover:bg-[#009ecc] text-white text-xs font-semibold shadow-[0px_2px_8px_rgba(0,191,255,0.35)] cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingAdmin ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE ADMIN CONFIRMATION ================= */}
      {deleteAdminModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40 backdrop-blur-xs font-sans">
          <div className="bg-white border border-red-200 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 text-center my-8 overflow-y-auto max-h-[calc(100vh-4rem)] modal-scroll">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-playfair font-bold text-[#0a0d12]">Delete Administrator</h3>
            <p className="text-xs text-[#4a5565] leading-relaxed">
              Are you sure you want to delete administrator <strong>{selectedUser.name}</strong> ({selectedUser.email})? This action cannot be reversed.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteAdminModalOpen(false)}
                className="px-4 py-2 rounded-full border border-[#d5d5ed] text-xs font-semibold text-[#4a5565] hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingAdmin}
                onClick={handleDeleteAdmin}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {isSubmittingAdmin ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE ROLE ================= */}
      {createRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-sans">
          <div className="bg-white border border-[#b0ebff] rounded-2xl shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 sm:px-8 py-5 shrink-0">
              <div>
                <h3 className="text-xl font-playfair font-bold text-[#000080]">Create New Role</h3>
                <p className="text-xs text-[#4a5565] mt-0.5">Define security level and check authorized permissions</p>
              </div>
              <button
                onClick={() => setCreateRoleModalOpen(false)}
                className="text-[#6a7282] hover:text-[#0a0d12] p-1 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto modal-scroll px-6 sm:px-8 py-5 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0a0d12]">
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={roleFormData.name}
                    onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                    placeholder="e.g. Academic Officer, Media Manager"
                    className="w-full bg-[#f9fafb] border border-[#d5d5ed] rounded-xl px-3.5 py-2.5 text-xs text-[#0a0d12] placeholder-[#6a7282] focus:bg-white focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-[#0a0d12]">Associated Permissions</label>
                    <button
                      type="button"
                      onClick={toggleAllPermissions}
                      className="text-xs text-[#00698c] hover:text-[#000080] font-semibold cursor-pointer underline"
                    >
                      {roleFormData.permissionIds.length === permissions.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-3 bg-[#f4faff] rounded-xl border border-[#e5e7eb] modal-scroll">
                    {permissions.map((p) => {
                      const isChecked = roleFormData.permissionIds.includes(p.id);
                      return (
                        <label
                          key={p.id}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? "bg-white border-[#b0ebff] text-[#000080] font-semibold shadow-2xs"
                              : "bg-transparent border-transparent text-[#4a5565] hover:bg-white/60"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(p.id)}
                            className="rounded text-[#00bfff] focus:ring-[#00bfff]"
                          />
                          <span className="font-mono text-[11px] truncate">{p.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="flex items-center justify-end gap-3 px-6 sm:px-8 py-4 border-t border-[#e5e7eb] bg-[#fcfdff] shrink-0">
                <button
                  type="button"
                  onClick={() => setCreateRoleModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#d5d5ed] text-xs font-semibold text-[#4a5565] hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRole}
                  className="px-5 py-2 rounded-full bg-[#00bfff] hover:bg-[#009ecc] text-white text-xs font-semibold shadow-[0px_2px_8px_rgba(0,191,255,0.35)] cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingRole ? "Creating..." : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT ROLE ================= */}
      {editRoleModalOpen && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-sans">
          <div className="bg-white border border-[#b0ebff] rounded-2xl shadow-2xl max-w-lg w-full flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 sm:px-8 py-5 shrink-0">
              <div>
                <h3 className="text-xl font-playfair font-bold text-[#000080]">Edit Role: {selectedRole.name}</h3>
                <p className="text-xs text-[#4a5565] mt-0.5">Modify permission scope and privileges</p>
              </div>
              <button
                onClick={() => setEditRoleModalOpen(false)}
                className="text-[#6a7282] hover:text-[#0a0d12] p-1 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateRole} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto modal-scroll px-6 sm:px-8 py-5 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0a0d12]">Role Name</label>
                  <input
                    type="text"
                    required
                    value={roleFormData.name}
                    onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                    className="w-full bg-[#f9fafb] border border-[#d5d5ed] rounded-xl px-3.5 py-2.5 text-xs text-[#0a0d12] focus:bg-white focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-[#0a0d12]">Associated Permissions</label>
                    <button
                      type="button"
                      onClick={toggleAllPermissions}
                      className="text-xs text-[#00698c] hover:text-[#000080] font-semibold cursor-pointer underline"
                    >
                      {roleFormData.permissionIds.length === permissions.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-3 bg-[#f4faff] rounded-xl border border-[#e5e7eb] modal-scroll">
                    {permissions.map((p) => {
                      const isChecked = roleFormData.permissionIds.includes(p.id);
                      return (
                        <label
                          key={p.id}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                            isChecked
                              ? "bg-white border-[#b0ebff] text-[#000080] font-semibold shadow-2xs"
                              : "bg-transparent border-transparent text-[#4a5565] hover:bg-white/60"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(p.id)}
                            className="rounded text-[#00bfff] focus:ring-[#00bfff]"
                          />
                          <span className="font-mono text-[11px] truncate">{p.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="flex items-center justify-end gap-3 px-6 sm:px-8 py-4 border-t border-[#e5e7eb] bg-[#fcfdff] shrink-0">
                <button
                  type="button"
                  onClick={() => setEditRoleModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#d5d5ed] text-xs font-semibold text-[#4a5565] hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRole}
                  className="px-5 py-2 rounded-full bg-[#00bfff] hover:bg-[#009ecc] text-white text-xs font-semibold shadow-[0px_2px_8px_rgba(0,191,255,0.35)] cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingRole ? "Saving..." : "Save Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE ROLE CONFIRMATION ================= */}
      {deleteRoleModalOpen && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40 backdrop-blur-xs font-sans">
          <div className="bg-white border border-red-200 rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 text-center my-8 overflow-y-auto max-h-[calc(100vh-4rem)] modal-scroll">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-playfair font-bold text-[#0a0d12]">Delete Role</h3>
            <p className="text-xs text-[#4a5565] leading-relaxed">
              Are you sure you want to delete the role <strong>{selectedRole.name}</strong>? Administrators assigned to this role will lose its permissions.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteRoleModalOpen(false)}
                className="px-4 py-2 rounded-full border border-[#d5d5ed] text-xs font-semibold text-[#4a5565] hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingRole}
                onClick={handleDeleteRole}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                {isSubmittingRole ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
