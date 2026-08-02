"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthContext";

export default function AdminDashboard() {
  const { user, token, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-app flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-app flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-main">Access Denied</h2>
          <p className="text-sm text-text-muted">
            You must be logged in to access the administrator panel. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-surface flex">
      {/* Sidebar Mockup */}
      <aside className="w-64 bg-bg-card border-r border-border-default hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border-default">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center font-bold">
              I
            </div>
            <span className="font-extrabold text-text-main">IILP Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 dark:bg-primary-950/30 text-primary-600 font-semibold text-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
            </svg>
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-bg-app hover:text-text-main transition-colors text-sm font-medium">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Users
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-bg-app hover:text-text-main transition-colors text-sm font-medium">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Departments
          </a>
        </nav>
        <div className="p-4 border-t border-border-default">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-sm font-semibold cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-bg-card border-b border-border-default flex items-center justify-between px-6">
          <h1 className="text-xl font-bold text-text-main">Executive Console</h1>
          <div className="flex items-center gap-4">
            {/* User Profile Summary */}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-text-main">{user?.name}</p>
              <p className="text-xs text-text-muted">{user?.role || "Administrator"}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-600 flex items-center justify-center font-bold">
              {user?.name.charAt(0)}
            </div>
            <button
              onClick={logout}
              className="md:hidden p-2 rounded-xl text-text-muted hover:bg-bg-surface hover:text-text-main transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        {/* Dashboard Panels */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-950/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-2xl font-extrabold text-text-main">Welcome back, {user?.name}!</h2>
              <p className="text-sm text-text-muted max-w-lg">
                Your session is active. You have executive privileges to manage roles, users, and department records.
              </p>
            </div>
            <div className="flex-shrink-0 px-4 py-2 rounded-full bg-accent-100 dark:bg-accent-950 text-accent-700 dark:text-accent-400 text-xs font-bold uppercase tracking-wider">
              System Administrator Active
            </div>
          </div>

          {/* User Details Details Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-bg-card border border-border-default rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-1">
              <h3 className="text-lg font-bold text-text-main">Session Profile</h3>
              <hr className="border-border-default" />
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-text-muted block">Full Name</span>
                  <span className="text-sm font-semibold text-text-main">{user?.name}</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">Registered Email</span>
                  <span className="text-sm font-semibold text-text-main">{user?.email}</span>
                </div>
                <div>
                  <span className="text-xs text-text-muted block">Assigned Role</span>
                  <span className="text-sm font-semibold text-text-main">{user?.role}</span>
                </div>
              </div>
            </div>

            <div className="bg-bg-card border border-border-default rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-2">
              <h3 className="text-lg font-bold text-text-main">Auth Token Detail</h3>
              <hr className="border-border-default" />
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-text-muted block">Bearer Access Token</span>
                  <div className="mt-1 p-3 bg-bg-surface border border-border-default rounded-xl font-mono text-xs text-text-muted break-all select-all h-24 overflow-y-auto">
                    {token}
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs text-text-muted">
                  <span>Bearer token format (valid for 24h)</span>
                  <span className="font-semibold text-accent-600 dark:text-accent-400">Authenticated Session</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
