import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isConfirming?: boolean;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm Delete",
  cancelLabel = "Cancel",
  isConfirming = false,
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const isDanger = variant === "danger";
  const isWarning = variant === "warning";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-sans">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5 ${
            isDanger
              ? "bg-red-50 text-red-500"
              : isWarning
              ? "bg-amber-50 text-amber-500"
              : "bg-sky-50 text-[#00698c]"
          }`}
        >
          {isDanger || isWarning ? (
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          ) : (
            <svg
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold text-2xl text-gray-900 mb-3 tracking-tight">
          {title}
        </h3>

        {/* Message */}
        <div className="text-sm text-gray-500 leading-relaxed mb-8 max-w-sm mx-auto">
          {message}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 w-full">
          <button
            type="button"
            onClick={onCancel}
            disabled={isConfirming}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 text-center"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isConfirming}
            onClick={onConfirm}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-full text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${
              isDanger
                ? "bg-[#e60000] hover:bg-[#cc0000]"
                : isWarning
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-[#00698c] hover:bg-[#00506b]"
            }`}
          >
            {isConfirming ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
