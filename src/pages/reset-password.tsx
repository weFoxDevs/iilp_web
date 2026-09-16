import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Toast, { ToastType } from "@/common/components/Toast";

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
      setToast({ message: "Password reset successful! Redirecting to login...", type: "success" });

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setToast({ message: err.message || "Something went wrong.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // If no token is provided in the URL, show warning screen
  if (!token) {
    return (
      <div className="bg-white border border-red-200 shadow-xl rounded-2xl p-8 sm:p-10 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="font-playfair font-bold text-2xl text-[#0a0d12]">Invalid Reset Link</h3>
        <p className="font-sans text-sm text-[#4a5565] leading-relaxed">
          No verification token was found in the URL. Please request a new password recovery link.
        </p>
        <div className="pt-2">
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-[#00698c] hover:text-[#000080] transition-colors"
          >
            Request New Reset Link →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#b0ebff] shadow-xl shadow-[#00bfff]/5 rounded-2xl p-6 sm:p-10 transition-all duration-300">
      {!isSuccess ? (
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-[#0a0d12] font-sans">
              New Password <span className="text-[#c70036]">*</span>
            </label>
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
            {passwordError && <p className="text-xs text-red-600 font-sans mt-1">{passwordError}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#0a0d12] font-sans">
              Confirm New Password <span className="text-[#c70036]">*</span>
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full bg-[#f9fafb] border px-4 py-3 text-sm sm:text-base font-sans text-[#0a0d12] placeholder-[#6a7282] focus:bg-white outline-none rounded-xl transition-all ${
                confirmPasswordError
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-[#d5d5ed] focus:border-[#00bfff] focus:ring-2 focus:ring-[#00bfff]/20"
              }`}
              placeholder="••••••••"
            />
            {confirmPasswordError && (
              <p className="text-xs text-red-600 font-sans mt-1">{confirmPasswordError}</p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00bfff] hover:bg-[#009ecc] active:bg-[#0088b3] text-white font-sans font-semibold text-base py-3.5 px-6 rounded-full shadow-[0px_4px_14px_rgba(0,191,255,0.35)] transition-all cursor-pointer flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              ) : (
                "Save & Reset Password"
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-4 py-4">
          <div className="w-14 h-14 rounded-full bg-[#e6f9ff] border border-[#b0ebff] text-[#00698c] flex items-center justify-center mx-auto">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-playfair font-bold text-2xl text-[#000080]">Password Updated</h2>
          <p className="font-sans text-sm text-[#4a5565] leading-relaxed">
            Your password has been successfully reset. Redirecting to login...
          </p>

          <div className="pt-3">
            <Link
              href="/login"
              className="w-full inline-flex justify-center bg-[#00bfff] hover:bg-[#009ecc] text-white font-sans font-semibold text-base py-3.5 px-6 rounded-full shadow-[0px_4px_14px_rgba(0,191,255,0.35)] transition-colors"
            >
              Go to Login Immediately
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
              Security Reset
            </span>
          </div>

          <h1 className="font-playfair font-medium text-3xl sm:text-4xl text-[#0a0d12] tracking-[-0.72px] leading-tight">
            Create New Password
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#4a5565] mt-2 max-w-sm leading-relaxed">
            Enter a secure new password for your administrator account
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <Suspense
          fallback={
            <div className="bg-white border border-[#b0ebff] shadow-xl rounded-2xl py-12 px-6 text-center">
              <div className="w-10 h-10 border-2 border-[#00bfff] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
