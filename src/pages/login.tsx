import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/common/components/AuthContext";
import Toast, { ToastType } from "@/common/components/Toast";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Form Validation
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/admin/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  const validate = () => {
    let isValid = true;
    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setToast(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to login. Please try again.");
      }

      // Successful login
      login(data.access_token, data.user);
      setToast({ message: "Login successful! Redirecting...", type: "success" });

      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 800);
    } catch (err: any) {
      setToast({ message: err.message || "Something went wrong.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading && isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f4faff] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#00bfff] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4faff] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#00bfff]/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[550px] h-[550px] rounded-full bg-[#000080]/10 blur-[130px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="text-center flex flex-col items-center">
          {/* Official IILP Logo */}
          <Link
            href="/"
            className="inline-block mb-3 transition-transform duration-300 hover:scale-105"
            aria-label="IILP Home"
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto drop-shadow-sm">
              <Image
                src="/assets/logo.png"
                alt="Institute for International Law & Public Policy Logo"
                fill
                className="object-contain select-none"
                priority
              />
            </div>
          </Link>

          {/* Badge */}
          <div className="inline-flex items-center border border-[#b0ebff] rounded-full px-3 py-1 mb-3 bg-[#e6f9ff]">
            <span className="font-sans font-semibold text-xs text-[#00698c] uppercase tracking-wider">
              Executive Console
            </span>
          </div>

          <h1 className="font-playfair font-medium text-3xl sm:text-4xl text-[#0a0d12] tracking-[-0.72px] leading-tight">
            IILP Portal Login
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#4a5565] mt-2 max-w-sm leading-relaxed">
            Sign in with authorized administrator credentials to manage institutional content
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-white border border-[#b0ebff] shadow-xl shadow-[#00bfff]/5 rounded-2xl p-6 sm:p-10 transition-all duration-300">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-[#0a0d12] font-sans">
                Email address <span className="text-[#c70036]">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-[#f9fafb] border px-4 py-3 text-sm sm:text-base font-sans text-[#0a0d12] placeholder-[#6a7282] focus:bg-white outline-none rounded-xl transition-all ${
                  emailError
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-[#d5d5ed] focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20"
                }`}
                placeholder="admin@iilp.org"
              />
              {emailError && <p className="text-xs text-red-600 font-sans mt-1">{emailError}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-[#0a0d12] font-sans">
                  Password <span className="text-[#c70036]">*</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="font-sans text-xs font-semibold text-[#00698c] hover:text-[#000080] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-[#f9fafb] border px-4 py-3 text-sm sm:text-base font-sans text-[#0a0d12] placeholder-[#6a7282] focus:bg-white outline-none rounded-xl transition-all ${
                  passwordError
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-[#d5d5ed] focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20"
                }`}
                placeholder="••••••••"
              />
              {passwordError && (
                <p className="text-xs text-red-600 font-sans mt-1">{passwordError}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#00bfff] hover:bg-[#009ecc] active:bg-[#0088b3] text-white font-sans font-semibold text-base py-3.5 px-6 rounded-full shadow-[0px_4px_14px_rgba(0,191,255,0.35)] transition-all cursor-pointer flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                ) : (
                  "Sign In to Console"
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Info */}
          <div className="mt-6 pt-5 border-t border-[#e5e7eb] text-center">
            <div className="bg-[#f4faff] border border-[#b0ebff] rounded-xl p-3.5 text-xs text-[#4a5565] font-sans">
              Default Credentials: <code className="font-mono text-[#000080] font-semibold">admin@iilp.org</code> / <code className="font-mono text-[#000080] font-semibold">adminpassword</code>
            </div>
          </div>

          {/* Back to Portal */}
          <div className="mt-6 border-t border-[#e5e7eb] pt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-[#00698c] hover:text-[#000080] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Main Portal
            </Link>
          </div>
        </div>
      </div>

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
