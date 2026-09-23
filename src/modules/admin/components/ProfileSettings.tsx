import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchCurrentUserProfile,
  updateCurrentUserProfile,
  changeCurrentUserPassword,
  UserProfileResponse,
} from "@/common/services/auth.service";
import { ToastType } from "@/common/components/Toast";
import { useAuth } from "@/common/components/AuthContext";

interface ProfileSettingsProps {
  token: string;
  onShowToast: (message: string, type: ToastType) => void;
}

type ActiveSubTab = "info" | "password" | "permissions";

export function ProfileSettings({ token, onShowToast }: ProfileSettingsProps) {
  const { user: authUser, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveSubTab>("info");
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);

  // Profile Edit State
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileErrors, setProfileErrors] = useState<{ name?: string; email?: string }>({});

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Permissions filter
  const [permissionSearch, setPermissionSearch] = useState("");

  // Load Profile
  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchCurrentUserProfile(token);
      setProfile(data);
      setNameInput(data.name || "");
      setEmailInput(data.email || "");
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to load profile details", "error");
    } finally {
      setIsLoading(false);
    }
  }, [token, onShowToast]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Password strength calculator
  const passwordStrength = useMemo(() => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 6) score += 1;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword) || /[^A-Za-z0-9]/.test(newPassword)) score += 1;
    return score; // 0 to 4
  }, [newPassword]);

  const strengthLabel = useMemo(() => {
    if (passwordStrength === 0) return { text: "Too short", color: "text-gray-400", bar: "bg-gray-300", width: "10%" };
    if (passwordStrength <= 1) return { text: "Weak", color: "text-red-500", bar: "bg-red-500", width: "30%" };
    if (passwordStrength <= 3) return { text: "Medium", color: "text-amber-500", bar: "bg-amber-500", width: "65%" };
    return { text: "Strong", color: "text-emerald-500", bar: "bg-emerald-500", width: "100%" };
  }, [passwordStrength]);

  // Handle Profile Update
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { name?: string; email?: string } = {};
    if (!nameInput.trim()) {
      errors.name = "Full name cannot be empty.";
    }
    if (!emailInput.trim()) {
      errors.email = "Email address cannot be empty.";
    } else if (!/\S+@\S+\.\S+/.test(emailInput)) {
      errors.email = "Please enter a valid email address.";
    }

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }
    setProfileErrors({});

    setIsSavingProfile(true);
    try {
      const updated = await updateCurrentUserProfile(token, {
        name: nameInput.trim(),
        email: emailInput.trim(),
      });
      setProfile(updated);
      updateUser({
        name: updated.name,
        email: updated.email,
        role: updated.role,
      });
      onShowToast("Profile information updated successfully!", "success");
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to update profile", "error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }
    if (!newPassword) {
      setPasswordError("Please enter a new password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation password do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changeCurrentUserPassword(token, {
        currentPassword,
        newPassword,
      });
      onShowToast(res.message || "Password changed successfully!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : "Failed to update password");
      onShowToast(err instanceof Error ? err.message : "Failed to update password", "error");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Filtered Permissions
  const filteredPermissions = useMemo(() => {
    if (!profile?.permissions) return [];
    if (!permissionSearch.trim()) return profile.permissions;
    const q = permissionSearch.toLowerCase();
    return profile.permissions.filter((p) => p.toLowerCase().includes(q));
  }, [profile?.permissions, permissionSearch]);

  const hasProfileChanges =
    profile && (nameInput !== profile.name || emailInput !== profile.email);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-10 h-10 border-4 border-[#00bfff] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-[#00698c]">Loading authenticated profile...</p>
      </div>
    );
  }

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  const memberSinceFormatted = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently joined";

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Hero Profile Banner Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#000080] via-[#002b66] to-[#00698c] shadow-lg border border-[#00698c]/30 text-white p-6 sm:p-8">
        {/* Background Decorative Circles */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-[#00bfff]/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Big Avatar */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#00bfff] to-[#000080] border-2 border-white/40 shadow-xl flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold font-serif tracking-wider">
                {initials}
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#000080] flex items-center justify-center text-white shadow-xs"
                title="Active Account"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-playfair font-bold text-white tracking-wide">
                  {profile?.name || authUser?.name || "Administrator"}
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#00bfff]/25 text-[#b0ebff] border border-[#00bfff]/40 backdrop-blur-xs">
                  <svg className="w-3 h-3 text-[#00bfff]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                  </svg>
                  {profile?.role || authUser?.role || "Authorized Staff"}
                </span>
                {profile?.verifiedAt ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/20 text-amber-200 border border-amber-400/30">
                    Active
                  </span>
                )}
              </div>

              <p className="text-sm text-[#b0ebff] font-sans flex items-center gap-2">
                <svg className="w-4 h-4 text-[#00bfff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {profile?.email || authUser?.email}
              </p>

              <p className="text-xs text-white/70 font-sans flex items-center gap-1.5 pt-0.5">
                <svg className="w-3.5 h-3.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Member since {memberSinceFormatted}
              </p>
            </div>
          </div>

          {/* Quick Stat Badges */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 self-stretch sm:self-auto justify-around">
            <div className="text-center px-2">
              <div className="text-xs text-[#b0ebff] font-sans">User ID</div>
              <div className="text-lg font-bold text-white font-mono">#{profile?.id || authUser?.id}</div>
            </div>
            <div className="w-[1px] h-8 bg-white/20" />
            <div className="text-center px-2">
              <div className="text-xs text-[#b0ebff] font-sans">Permissions</div>
              <div className="text-lg font-bold text-[#00bfff]">
                {profile?.permissions ? profile.permissions.length : 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-[#b0ebff] rounded-2xl w-fit shadow-xs">
        <button
          onClick={() => setActiveTab("info")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "info"
              ? "bg-[#000080] text-white shadow-xs"
              : "text-[#00698c] hover:bg-[#f4faff] hover:text-[#000080]"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Personal Information</span>
        </button>

        <button
          onClick={() => setActiveTab("password")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "password"
              ? "bg-[#000080] text-white shadow-xs"
              : "text-[#00698c] hover:bg-[#f4faff] hover:text-[#000080]"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Password & Security</span>
        </button>

        <button
          onClick={() => setActiveTab("permissions")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "permissions"
              ? "bg-[#000080] text-white shadow-xs"
              : "text-[#00698c] hover:bg-[#f4faff] hover:text-[#000080]"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Role & Permissions</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === "permissions"
                ? "bg-white/20 text-white"
                : "bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff]"
            }`}
          >
            {profile?.permissions?.length || 0}
          </span>
        </button>
      </div>

      {/* TAB 1: PERSONAL INFORMATION */}
      {activeTab === "info" && (
        <div className="bg-white rounded-2xl border border-[#b0ebff] shadow-xs p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#e5e7eb] pb-4">
            <h3 className="text-lg font-playfair font-bold text-[#0a0d12]">
              Profile Information
            </h3>
            <p className="text-xs text-[#4a5565] mt-1 font-sans">
              Update your account details and contact information. Your name will be shown on actions performed in the portal.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl font-sans">
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4a5565]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#fcfdff] border rounded-xl text-sm text-[#0a0d12] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00bfff]/30 transition-all ${
                      profileErrors.name ? "border-red-500 focus:border-red-500" : "border-[#d5d5ed] focus:border-[#00bfff]"
                    }`}
                  />
                </div>
                {profileErrors.name && (
                  <p className="text-xs text-red-600 mt-1">{profileErrors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#4a5565]">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@iilp.org"
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#fcfdff] border rounded-xl text-sm text-[#0a0d12] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00bfff]/30 transition-all ${
                      profileErrors.email ? "border-red-500 focus:border-red-500" : "border-[#d5d5ed] focus:border-[#00bfff]"
                    }`}
                  />
                </div>
                {profileErrors.email && (
                  <p className="text-xs text-red-600 mt-1">{profileErrors.email}</p>
                )}
                <p className="text-[11px] text-[#4a5565] mt-1">
                  Changing your email address will update your login credentials for future sessions.
                </p>
              </div>

              {/* Readonly Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-[#f4faff] border border-[#b0ebff]/60">
                  <div className="text-[11px] font-bold text-[#00698c] flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>System Role</span>
                  </div>
                  <div className="mt-1 text-sm font-bold text-[#000080]">
                    {profile?.role || "Administrator"}
                  </div>
                  <div className="text-[10px] text-[#4a5565] mt-0.5">
                    Managed by System Administrators
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f4faff] border border-[#b0ebff]/60">
                  <div className="text-[11px] font-bold text-[#00698c] flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Account Verification</span>
                  </div>
                  <div className="mt-1 text-sm font-bold text-emerald-700 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{profile?.verifiedAt ? "Verified & Active" : "Active"}</span>
                  </div>
                  <div className="text-[10px] text-[#4a5565] mt-0.5 font-mono">
                    ID: #{profile?.id}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-[#e5e7eb]">
              <button
                type="submit"
                disabled={isSavingProfile || !hasProfileChanges}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-xs ${
                  isSavingProfile || !hasProfileChanges
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#000080] hover:bg-[#002b66] text-white"
                }`}
              >
                {isSavingProfile ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>

              {hasProfileChanges && (
                <button
                  type="button"
                  onClick={() => {
                    if (profile) {
                      setNameInput(profile.name);
                      setEmailInput(profile.email);
                      setProfileErrors({});
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#4a5565] hover:text-[#0a0d12] hover:bg-[#f4faff] transition-colors cursor-pointer"
                >
                  Reset Changes
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: PASSWORD & SECURITY */}
      {activeTab === "password" && (
        <div className="bg-white rounded-2xl border border-[#b0ebff] shadow-xs p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#e5e7eb] pb-4">
            <h3 className="text-lg font-playfair font-bold text-[#0a0d12]">
              Change Account Password
            </h3>
            <p className="text-xs text-[#4a5565] mt-1 font-sans">
              Update your administrative password. You must provide your current password for security verification.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6 max-w-2xl font-sans">
            {passwordError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{passwordError}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1.5">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full pl-4 pr-11 py-2.5 bg-[#fcfdff] border border-[#d5d5ed] rounded-xl text-sm text-[#0a0d12] placeholder-gray-400 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#000080] cursor-pointer"
                    title={showCurrentPassword ? "Hide password" : "Show password"}
                  >
                    {showCurrentPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1.5">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min. 6 characters)"
                    className="w-full pl-4 pr-11 py-2.5 bg-[#fcfdff] border border-[#d5d5ed] rounded-xl text-sm text-[#0a0d12] placeholder-gray-400 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#000080] cursor-pointer"
                    title={showNewPassword ? "Hide password" : "Show password"}
                  >
                    {showNewPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Real-time Password Strength Meter */}
                {newPassword && (
                  <div className="mt-2.5 p-3 bg-[#f8fbfe] border border-[#b0ebff]/60 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#4a5565] font-medium">Strength:</span>
                      <span className={`font-bold ${strengthLabel.color}`}>{strengthLabel.text}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strengthLabel.bar} transition-all duration-300`}
                        style={{ width: strengthLabel.width }}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-[#4a5565] pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 6 ? "bg-emerald-500" : "bg-gray-300"}`} />
                        <span>Min 6 characters</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPassword) ? "bg-emerald-500" : "bg-gray-300"}`} />
                        <span>Uppercase letter</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(newPassword) ? "bg-emerald-500" : "bg-gray-300"}`} />
                        <span>Number digit (0-9)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${newPassword === confirmPassword && confirmPassword.length > 0 ? "bg-emerald-500" : "bg-gray-300"}`} />
                        <span>Passwords match</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold text-[#101828] mb-1.5">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full pl-4 pr-11 py-2.5 bg-[#fcfdff] border border-[#d5d5ed] rounded-xl text-sm text-[#0a0d12] placeholder-gray-400 focus:outline-none focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#000080] cursor-pointer"
                    title={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-[#e5e7eb]">
              <button
                type="submit"
                disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-xs ${
                  isChangingPassword || !currentPassword || !newPassword || !confirmPassword
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#000080] hover:bg-[#002b66] text-white"
                }`}
              >
                {isChangingPassword ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Best Practices Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#f4faff] to-[#e6f9ff] border border-[#b0ebff] flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#000080] text-white flex items-center justify-center shrink-0 shadow-xs">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1 font-sans text-xs">
              <h4 className="font-bold text-[#000080]">Security Recommendation</h4>
              <p className="text-[#4a5565] leading-relaxed">
                Always use a password with a mix of uppercase letters, numbers, and symbols. Never share your credentials with colleagues or third parties.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ROLE & PERMISSIONS */}
      {activeTab === "permissions" && (
        <div className="bg-white rounded-2xl border border-[#b0ebff] shadow-xs p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#e5e7eb] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-playfair font-bold text-[#0a0d12]">
                Assigned Role & RBAC Permissions
              </h3>
              <p className="text-xs text-[#4a5565] mt-1 font-sans">
                Review permissions granted to your role ({profile?.role || "Administrator"}). Permissions determine which actions you can execute.
              </p>
            </div>

            {/* Search permissions */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={permissionSearch}
                onChange={(e) => setPermissionSearch(e.target.value)}
                placeholder="Filter permissions..."
                className="w-full pl-9 pr-3 py-2 bg-[#fcfdff] border border-[#d5d5ed] rounded-xl text-xs text-[#0a0d12] placeholder-gray-400 focus:outline-none focus:border-[#00bfff]"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Permissions Grid */}
          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between text-xs text-[#4a5565]">
              <span>Active Permissions ({filteredPermissions.length})</span>
              <span className="text-[11px] text-[#00698c] bg-[#e6f9ff] px-2.5 py-0.5 rounded-full border border-[#b0ebff]">
                Role: {profile?.role || "Administrator"}
              </span>
            </div>

            {filteredPermissions.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                No permissions found matching &quot;{permissionSearch}&quot;
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {filteredPermissions.map((perm) => (
                  <div
                    key={perm}
                    className="p-3 rounded-xl bg-[#f8fbfe] border border-[#b0ebff]/60 flex items-center gap-2.5 hover:border-[#00bfff] transition-colors"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#000080] truncate">
                      {perm}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
