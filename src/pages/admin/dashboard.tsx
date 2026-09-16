import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/common/components/AuthContext";

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
  departmentsSummary: {
    total: number;
    preview: Array<{ id: string; name: string; code: string }>;
  };
  systemInfo: SystemInfo;
}

interface DepartmentItem {
  id: string;
  number?: string;
  name: string;
  code: string;
  description?: string;
  mission?: string;
  researchAreas?: string[];
}

type TabType = "overview" | "departments" | "rbac" | "token";

export default function AdminDashboard() {
  const { user, token, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  const fetchDashboardData = useCallback(async () => {
    if (!token) return;
    setIsDataLoading(true);
    setFetchError(null);

    try {
      // 1. Fetch Dashboard Aggregated Summary
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

      // 2. Fetch Departments List
      const deptRes = await fetch(`${apiUrl}/departments`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (deptRes.ok) {
        const deptJson = await deptRes.json();
        setDepartments(Array.isArray(deptJson) ? deptJson : deptJson.items || []);
      }
    } catch (err: any) {
      setFetchError(err.message || "Failed to connect to backend server.");
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
      fetchDashboardData();
    }
  }, [isAuthenticated, token, fetchDashboardData]);

  const copyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

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
          <h2 className="text-2xl font-serif font-bold text-[#0a0d12]">Access Denied</h2>
          <p className="text-sm font-sans text-[#4a5565]">
            You must be logged in to access the administrator panel. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4faff] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-[#e5e7eb] flex flex-col shrink-0">
        {/* Sidebar Header with Official Logo */}
        <div className="h-18 flex items-center justify-between px-6 border-b border-[#e5e7eb]">
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

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto font-sans">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left cursor-pointer ${
              activeTab === "overview"
                ? "bg-[#e6f9ff] text-[#00698c] font-semibold border border-[#b0ebff]/60"
                : "text-[#4a5565] hover:bg-[#f9fafb] hover:text-[#0a0d12]"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            Dashboard Overview
          </button>

          <button
            onClick={() => setActiveTab("departments")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left cursor-pointer ${
              activeTab === "departments"
                ? "bg-[#e6f9ff] text-[#00698c] font-semibold border border-[#b0ebff]/60"
                : "text-[#4a5565] hover:bg-[#f9fafb] hover:text-[#0a0d12]"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Academic Departments
            {summary && (
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[#e6f9ff] text-[#00698c] font-semibold border border-[#b0ebff]">
                {summary.metrics.totalDepartments}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("rbac")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left cursor-pointer ${
              activeTab === "rbac"
                ? "bg-[#e6f9ff] text-[#00698c] font-semibold border border-[#b0ebff]/60"
                : "text-[#4a5565] hover:bg-[#f9fafb] hover:text-[#0a0d12]"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            RBAC &amp; Security
          </button>

          <button
            onClick={() => setActiveTab("token")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left cursor-pointer ${
              activeTab === "token"
                ? "bg-[#e6f9ff] text-[#00698c] font-semibold border border-[#b0ebff]/60"
                : "text-[#4a5565] hover:bg-[#f9fafb] hover:text-[#0a0d12]"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Session Token
          </button>
        </nav>

        {/* User Session Footer */}
        <div className="p-4 border-t border-[#e5e7eb] space-y-3 font-sans">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-[#e6f9ff] border border-[#b0ebff] text-[#000080] font-bold flex items-center justify-center text-sm shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#101828] truncate">{user?.name}</p>
              <p className="text-[11px] text-[#4a5565] truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full text-red-600 hover:bg-red-50 transition-colors text-xs font-semibold cursor-pointer border border-transparent hover:border-red-200"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-18 bg-white border-b border-[#e5e7eb] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-playfair font-bold text-[#0a0d12] capitalize">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "departments" && "Academic Departments"}
              {activeTab === "rbac" && "Role-Based Access Control"}
              {activeTab === "token" && "Active Session & Security"}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Live API Connected
            </span>
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
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
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
                    Your authenticated session is active. You have executive access to manage CMS content, academic departments, and platform roles.
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
                {/* Stat 1: Departments */}
                <div className="bg-white border border-[#b0ebff] rounded-2xl p-6 shadow-xs space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#00698c] uppercase tracking-wider">
                      Departments
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
                    <span className="text-xs text-[#4a5565]">Academic units</span>
                  </div>
                </div>

                {/* Stat 2: Registered Users */}
                <div className="bg-white border border-[#b0ebff] rounded-2xl p-6 shadow-xs space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#00698c] uppercase tracking-wider">
                      User Accounts
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#e6f9ff] text-[#00698c] flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-playfair font-bold text-[#000080]">
                      {summary?.metrics.totalUsers ?? (isDataLoading ? "..." : 0)}
                    </span>
                    <span className="text-xs text-[#4a5565]">Admin accounts</span>
                  </div>
                </div>

                {/* Stat 3: Security Roles */}
                <div className="bg-white border border-[#b0ebff] rounded-2xl p-6 shadow-xs space-y-3 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#00698c] uppercase tracking-wider">
                      Active Roles
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#e6f9ff] text-[#00698c] flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-playfair font-bold text-[#000080]">
                      {summary?.metrics.totalRoles ?? (isDataLoading ? "..." : 0)}
                    </span>
                    <span className="text-xs text-[#4a5565]">RBAC tiers</span>
                  </div>
                </div>

                {/* Stat 4: Permissions */}
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
                      {summary?.metrics.totalPermissions ?? (isDataLoading ? "..." : 0)}
                    </span>
                    <span className="text-xs text-[#4a5565]">Access rules</span>
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
                    <span className="text-xs text-[#00698c] font-semibold bg-[#e6f9ff] px-2.5 py-1 rounded-full border border-[#b0ebff]">
                      Total: {summary?.metrics.totalUsers || 0}
                    </span>
                  </div>
                  <hr className="border-[#e5e7eb]" />

                  {summary?.recentUsers && summary.recentUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#e5e7eb] text-[#4a5565]">
                            <th className="pb-3 font-semibold">Administrator Name</th>
                            <th className="pb-3 font-semibold">Email</th>
                            <th className="pb-3 font-semibold">Role</th>
                            <th className="pb-3 font-semibold">Registered</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f4f4fa]">
                          {summary.recentUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-[#f9fafb] transition-colors">
                              <td className="py-3 font-semibold text-[#0a0d12]">{u.name}</td>
                              <td className="py-3 text-[#4a5565] font-mono">{u.email}</td>
                              <td className="py-3">
                                <span className="px-2.5 py-1 rounded-full bg-[#e6f9ff] text-[#00698c] font-semibold text-[11px] border border-[#b0ebff]">
                                  {u.role}
                                </span>
                              </td>
                              <td className="py-3 text-[#4a5565]">
                                {new Date(u.joinedAt).toLocaleDateString()}
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

          {/* TAB 2: DEPARTMENTS */}
          {activeTab === "departments" && (
            <div className="space-y-6 font-sans">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-playfair font-bold text-[#000080]">Academic Departments</h2>
                  <p className="text-xs sm:text-sm text-[#4a5565] mt-1">
                    Live department entities registered in PostgreSQL via TypeORM.
                  </p>
                </div>
                <Link
                  href="/academics"
                  target="_blank"
                  className="px-5 py-2.5 rounded-full bg-[#00bfff] hover:bg-[#009ecc] text-white text-xs font-semibold transition-colors shadow-[0px_2px_8px_rgba(0,191,255,0.35)] flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>View Public Academics</span>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>

              {departments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {departments.map((dept) => (
                    <div
                      key={dept.id}
                      className="bg-white border border-[#b0ebff] rounded-2xl p-6 shadow-xs space-y-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#00698c] bg-[#e6f9ff] px-2.5 py-1 rounded-md border border-[#b0ebff]">
                          Code: {dept.code}
                        </span>
                        <span className="text-[11px] text-[#4a5565] font-mono">
                          ID: {dept.id.substring(0, 8)}...
                        </span>
                      </div>
                      <h3 className="text-lg font-playfair font-bold text-[#0a0d12]">{dept.name}</h3>
                      {dept.description && (
                        <p className="text-xs text-[#4a5565] leading-relaxed line-clamp-2">
                          {dept.description}
                        </p>
                      )}
                      {dept.mission && (
                        <div className="p-3.5 rounded-xl bg-[#f4faff] text-xs text-[#000080] border border-[#e5e7eb] italic font-playfair">
                          &ldquo;{dept.mission}&rdquo;
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-white border border-[#b0ebff] rounded-2xl">
                  <p className="text-sm text-[#4a5565]">
                    {isDataLoading ? "Loading academic departments..." : "No departments currently found in database."}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RBAC & SECURITY */}
          {activeTab === "rbac" && (
            <div className="space-y-6 font-sans">
              <div className="bg-white border border-[#b0ebff] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
                <div>
                  <h3 className="text-xl font-playfair font-bold text-[#000080]">Active Role &amp; Permissions</h3>
                  <p className="text-xs text-[#4a5565] mt-1">
                    Your administrative account permissions enforced through NestJS PermissionsGuard and Role entities.
                  </p>
                </div>
                <hr className="border-[#e5e7eb]" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-xl bg-[#f4faff] border border-[#e5e7eb] space-y-3">
                      <div>
                        <span className="text-[#4a5565] block font-medium">Administrator Name</span>
                        <span className="text-base font-bold text-[#0a0d12]">{user?.name}</span>
                      </div>
                      <div>
                        <span className="text-[#4a5565] block font-medium">Registered Email</span>
                        <span className="text-sm font-semibold text-[#0a0d12] font-mono">{user?.email}</span>
                      </div>
                      <div>
                        <span className="text-[#4a5565] block font-medium">Assigned System Role</span>
                        <span className="inline-block mt-1 px-3 py-1 rounded-full bg-[#000080] text-white font-bold text-xs shadow-xs">
                          {user?.role || "Admin"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-[#00698c] block uppercase tracking-wider">
                      Granted Granular Permissions
                    </span>
                    <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-4 rounded-xl bg-[#f4faff] border border-[#e5e7eb]">
                      {[
                        "user:create",
                        "user:update",
                        "user:view",
                        "user:delete",
                        "department:create",
                        "department:update",
                        "department:delete",
                        "role:create",
                        "role:update",
                        "role:view",
                        "role:delete",
                        "permission:view",
                      ].map((perm) => (
                        <span
                          key={perm}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white border border-[#b0ebff] text-[#000080] font-medium shadow-2xs"
                        >
                          ✓ {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SESSION TOKEN */}
          {activeTab === "token" && (
            <div className="space-y-6 font-sans">
              <div className="bg-white border border-[#b0ebff] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-playfair font-bold text-[#000080]">Bearer Session Token</h3>
                    <p className="text-xs text-[#4a5565] mt-1">
                      JSON Web Token (JWT) issued by backend to authorize requests to <code className="font-mono text-[#00698c]">/api/v1/admin/*</code>.
                    </p>
                  </div>
                  <button
                    onClick={copyToken}
                    className="px-4 py-2 rounded-full bg-[#00bfff] hover:bg-[#009ecc] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-[0px_2px_8px_rgba(0,191,255,0.35)]"
                  >
                    {copiedToken ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        <span>Copy Token</span>
                      </>
                    )}
                  </button>
                </div>
                <hr className="border-[#e5e7eb]" />

                <div className="p-4 bg-[#f4faff] border border-[#b0ebff] rounded-xl font-mono text-xs text-[#000080] break-all select-all max-h-48 overflow-y-auto leading-relaxed">
                  {token}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
