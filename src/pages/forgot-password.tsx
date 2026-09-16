import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Toast, { ToastType } from "@/common/components/Toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [emailError, setEmailError] = useState("");
  const [devToken, setDevToken] = useState<string | null>(null);

  const validate = () => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setToast(null);
    setDevToken(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    try {
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to process request. Please try again.");
      }

      setEmailSent(true);
      if (data.resetToken) {
        setDevToken(data.resetToken);
      }
      setToast({ message: "Password reset link sent successfully!", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message || "Something went wrong.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4faff] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-[-15%] right-[-10%] w-[550px] h-[550px] rounded-full bg-[#00bfff]/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-10%] w-[550px] h-[550px] rounded-full bg-[#000080]/10 blur-[130px] pointer-events-none"></div>

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
              Security Recovery
            </span>
          </div>

          <h1 className="font-playfair font-medium text-3xl sm:text-4xl text-[#0a0d12] tracking-[-0.72px] leading-tight">
            Forgot Password
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#4a5565] mt-2 max-w-sm leading-relaxed">
            Enter your registered administrator email to receive a password recovery link
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-white border border-[#b0ebff] shadow-xl shadow-[#00bfff]/5 rounded-2xl p-6 sm:p-10 transition-all duration-300">
          {!emailSent ? (
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-[#0a0d12] font-sans">
                  Registered Email <span className="text-[#c70036]">*</span>
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

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#00bfff] hover:bg-[#009ecc] active:bg-[#0088b3] text-white font-sans font-semibold text-base py-3.5 px-6 rounded-full shadow-[0px_4px_14px_rgba(0,191,255,0.35)] transition-all cursor-pointer flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-full bg-[#e6f9ff] border border-[#b0ebff] text-[#00698c] flex items-center justify-center mx-auto">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                </svg>
              </div>
              <h2 className="font-playfair font-bold text-2xl text-[#000080]">Check Your Inbox</h2>
              <p className="font-sans text-sm text-[#4a5565] leading-relaxed">
                We have dispatched a password reset token to <strong>{email}</strong>. It will remain valid for 15 minutes.
              </p>

              {devToken && (
                <div className="mt-4 p-3.5 rounded-xl bg-[#e6f9ff] border border-[#b0ebff] text-left text-xs font-sans space-y-1.5">
                  <span className="font-semibold text-[#00698c] block">Development Recovery Shortcut:</span>
                  <Link
                    href={`/reset-password?token=${devToken}`}
                    className="text-[#000080] font-mono break-all underline hover:text-[#00bfff]"
                  >
                    Click to Reset Password Immediately →
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 border-t border-[#e5e7eb] pt-5 text-center flex items-center justify-center gap-4 text-xs font-sans font-semibold">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-[#00698c] hover:text-[#000080] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Login
            </Link>
            <span className="text-[#d5d5ed]">•</span>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[#4a5565] hover:text-[#000080] transition-colors"
            >
              Main Portal
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
