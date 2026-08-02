"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Toast, { ToastType } from "../components/Toast";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form Validation
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const validate = () => {
    let isValid = true;

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !token) return;

    setIsLoading(true);
    setToast(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    try {
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password. The link may have expired.");
      }

      setIsSuccess(true);
      setToast({ message: "Password reset successful!", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message || "Something went wrong.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // If no token is provided in the URL, show warning screen
  if (!token) {
    return (
      <div className="bg-bg-card/70 border border-red-500/20 backdrop-blur-xl py-8 px-4 shadow-2xl rounded-2xl sm:px-10 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-text-main">Invalid Reset Link</h3>
        <p className="text-sm text-text-muted">
          No verification token was found in the URL. Please request a new password reset link.
        </p>
        <div className="pt-2">
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-500 transition-colors"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-card/70 border border-border-default backdrop-blur-xl py-8 px-4 shadow-2xl rounded-2xl sm:px-10 hover:border-primary-500/30 transition-all duration-300">
      {!isSuccess ? (
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-text-main">
              New Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`appearance-none block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-bg-app text-text-main ${
                  passwordError ? "border-red-500 focus:ring-red-500" : "border-border-default"
                }`}
                placeholder="••••••••"
              />
            </div>
            {passwordError && <p className="mt-1 text-xs text-red-500 font-medium">{passwordError}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-text-main">
              Confirm New Password
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`appearance-none block w-full px-4 py-3 border rounded-xl shadow-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-bg-app text-text-main ${
                  confirmPasswordError ? "border-red-500 focus:ring-red-500" : "border-border-default"
                }`}
                placeholder="••••••••"
              />
            </div>
            {confirmPasswordError && (
              <p className="mt-1 text-xs text-red-500 font-medium">{confirmPasswordError}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all duration-200 cursor-pointer shadow-primary-500/20"
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-4 py-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-100 dark:bg-accent-950 text-accent-600 dark:text-accent-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-text-main">Password Updated</h3>
          <p className="text-sm text-text-muted">
            Your password has been successfully reset. You can now login with your new credentials.
          </p>

          <div className="pt-4">
            <Link
              href="/login"
              className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 transition-colors shadow-primary-500/20"
            >
              Go to Login
            </Link>
          </div>
        </div>
      )}

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

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-bg-app flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent-500/10 blur-[120px] pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500 text-white shadow-xl shadow-primary-500/30 mb-4 font-bold text-2xl">
            *
          </div>
          <h2 className="text-3xl font-extrabold text-text-main tracking-tight">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Create a secure new password for your user account
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <Suspense fallback={
          <div className="bg-bg-card/70 border border-border-default backdrop-blur-xl py-12 px-4 shadow-2xl rounded-2xl text-center">
            <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
