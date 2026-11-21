import React, { useState, useEffect } from "react";
import ConfirmationModal from "./ConfirmationModal";
import {
  fetchDonationsAdmin,
  updateDonationStatusAdmin,
  deleteDonationAdmin,
  downloadDonationsCsv,
  DonationData,
  DonationsListResponse,
  DonationStatus,
  PaymentMethod,
  DonationFrequency,
} from "@/common/services/donations.service";

interface DonationsManagerProps {
  token: string;
  onShowToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function DonationsManager({
  token,
  onShowToast,
}: DonationsManagerProps) {
  const [data, setData] = useState<DonationsListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [methodFilter, setMethodFilter] = useState<string>("");
  const [frequencyFilter, setFrequencyFilter] = useState<string>("");
  const [page, setPage] = useState(1);

  // Selected Donation for View / Edit Modal
  const [selectedDonation, setSelectedDonation] = useState<DonationData | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<DonationStatus>("COMPLETED");
  const [adminNotes, setAdminNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Modal State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // CSV Export Loading
  const [isExporting, setIsExporting] = useState(false);

  const loadDonations = async () => {
    try {
      setLoading(true);
      const res = await fetchDonationsAdmin(token, {
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        paymentMethod: methodFilter || undefined,
        frequency: frequencyFilter || undefined,
        page,
        limit: 10,
      });
      setData(res);
    } catch (err: any) {
      onShowToast(err.message || "Failed to load donations", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, [token, page, statusFilter, methodFilter, frequencyFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadDonations();
  };

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      await downloadDonationsCsv(token, {
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        paymentMethod: methodFilter || undefined,
        frequency: frequencyFilter || undefined,
      });
      onShowToast("Donations exported successfully", "success");
    } catch (err: any) {
      onShowToast(err.message || "Failed to export CSV", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenStatusModal = (donation: DonationData) => {
    setSelectedDonation(donation);
    setUpdatingStatus(donation.status);
    setAdminNotes(donation.paymentDetails?.adminNotes || "");
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonation) return;

    try {
      setIsUpdating(true);
      await updateDonationStatusAdmin(
        token,
        selectedDonation.id,
        updatingStatus,
        adminNotes.trim() || undefined
      );
      onShowToast("Donation status updated successfully", "success");
      setIsStatusModalOpen(false);
      setSelectedDonation(null);
      loadDonations();
    } catch (err: any) {
      onShowToast(err.message || "Failed to update donation status", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await deleteDonationAdmin(token, deletingId);
      onShowToast("Donation record deleted", "success");
      setDeletingId(null);
      loadDonations();
    } catch (err: any) {
      onShowToast(err.message || "Failed to delete donation", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const stats = data?.stats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">💝</span>
            <h1 className="text-2xl font-serif font-bold text-[#0a0d12]">
              Donations &amp; Philanthropy
            </h1>
          </div>
          <p className="text-sm text-[#4a5565] mt-1">
            Track, reconcile, and manage online financial gifts processed via Stripe and PayPal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#0a0d12] hover:bg-gray-50 transition-colors shadow-xs cursor-pointer disabled:opacity-60"
          >
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>

          <button
            onClick={loadDonations}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#000080] text-white text-sm font-semibold hover:bg-[#000066] transition-colors shadow-xs cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Raised */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Raised
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              $
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-serif font-bold text-[#000080]">
              ${stats ? stats.totalRaised.toLocaleString() : "0"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats?.completedCount || 0} completed gifts
            </p>
          </div>
        </div>

        {/* Monthly Recurring */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Monthly Active
            </span>
            <span className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              🔄
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-serif font-bold text-purple-900">
              ${stats ? stats.monthlyRaised.toLocaleString() : "0"}
            </p>
            <p className="text-xs text-purple-700 mt-1">Recurring sustainers</p>
          </div>
        </div>

        {/* One-Time Total */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              One-Time Gifts
            </span>
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#00bfff] flex items-center justify-center font-bold">
              ⚡
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-serif font-bold text-[#00698c]">
              ${stats ? stats.oneTimeRaised.toLocaleString() : "0"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Single contributions</p>
          </div>
        </div>

        {/* Stripe Volume */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Stripe Volume
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#635BFF]/10 text-[#635BFF]">
              Stripe
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-serif font-bold text-[#0a0d12]">
              ${stats ? stats.stripeRaised.toLocaleString() : "0"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Cards / Apple Pay</p>
          </div>
        </div>

        {/* PayPal Volume */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              PayPal Volume
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#003087]/10 text-[#003087]">
              PayPal
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-serif font-bold text-[#0a0d12]">
              ${stats ? stats.paypalRaised.toLocaleString() : "0"}
            </p>
            <p className="text-xs text-gray-500 mt-1">PayPal / Wallet</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row items-center gap-3"
        >
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by donor name, email, or transaction ID..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]/20 focus:border-[#000080] transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-44 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#0a0d12] focus:outline-none focus:ring-2 focus:ring-[#000080]/20 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => {
              setMethodFilter(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-36 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#0a0d12] focus:outline-none focus:ring-2 focus:ring-[#000080]/20 cursor-pointer"
          >
            <option value="">All Gateways</option>
            <option value="STRIPE">Stripe</option>
            <option value="PAYPAL">PayPal</option>
          </select>

          {/* Frequency Filter */}
          <select
            value={frequencyFilter}
            onChange={(e) => {
              setFrequencyFilter(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-36 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-[#0a0d12] focus:outline-none focus:ring-2 focus:ring-[#000080]/20 cursor-pointer"
          >
            <option value="">All Frequencies</option>
            <option value="MONTHLY">Monthly</option>
            <option value="ONE_TIME">One-Time</option>
          </select>

          <button
            type="submit"
            className="w-full md:w-auto px-5 py-2 bg-[#000080] text-white text-sm font-semibold rounded-xl hover:bg-[#000066] transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#000080] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 font-medium">Loading donations...</p>
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl">🎁</span>
            <h3 className="text-lg font-serif font-bold text-[#0a0d12] mt-2">
              No Donations Found
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
              {search || statusFilter || methodFilter || frequencyFilter
                ? "Try clearing your filters or search terms."
                : "No donor contributions have been recorded yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Donor</th>
                  <th className="py-3 px-4">Contribution</th>
                  <th className="py-3 px-4">Gateway</th>
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.items.map((donation) => {
                  const isMonthly = donation.frequency === "MONTHLY";
                  const isStripe = donation.paymentMethod === "STRIPE";

                  return (
                    <tr
                      key={donation.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Donor */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#0a0d12]">
                              {donation.donorName}
                            </span>
                            {donation.isAnonymous && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-gray-100 text-gray-600">
                                Anon
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {donation.donorEmail}
                          </span>
                        </div>
                      </td>

                      {/* Contribution */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#000080] text-base">
                            ${Number(donation.amount).toFixed(2)}
                          </span>
                          <span
                            className={`text-[11px] font-semibold ${
                              isMonthly ? "text-purple-700" : "text-[#00698c]"
                            }`}
                          >
                            {isMonthly ? "🔄 Monthly" : "⚡ One-Time"}
                          </span>
                        </div>
                      </td>

                      {/* Gateway */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isStripe
                              ? "bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20"
                              : "bg-[#003087]/10 text-[#003087] border border-[#003087]/20"
                          }`}
                        >
                          {isStripe ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#635BFF]" />
                              Stripe
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#003087]" />
                              PayPal
                            </>
                          )}
                        </span>
                      </td>

                      {/* Transaction Ref */}
                      <td className="py-3.5 px-4 font-mono text-xs text-gray-600 max-w-[160px] truncate">
                        {donation.transactionId ? (
                          <span
                            title={donation.transactionId}
                            className="bg-gray-100 px-2 py-0.5 rounded text-[11px]"
                          >
                            {donation.transactionId.length > 18
                              ? `${donation.transactionId.substring(0, 16)}...`
                              : donation.transactionId}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">None</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            donation.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : donation.status === "PENDING"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : donation.status === "REFUNDED"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {donation.status === "COMPLETED" && "✓ Completed"}
                          {donation.status === "PENDING" && "⏳ Pending"}
                          {donation.status === "REFUNDED" && "↩ Refunded"}
                          {donation.status === "FAILED" && "✕ Failed"}
                          {donation.status === "CANCELLED" && "✕ Cancelled"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-gray-500">
                        {new Date(donation.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View & Update Status Button */}
                          <button
                            onClick={() => handleOpenStatusModal(donation)}
                            title="Manage & View Details"
                            className="p-1.5 text-gray-600 hover:text-[#000080] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeletingId(donation.id)}
                            title="Delete Record"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <span className="text-xs text-gray-500">
              Showing {(page - 1) * 10 + 1} to{" "}
              {Math.min(page * 10, data.total)} of {data.total} records
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-xs font-bold text-[#000080]">
                {page} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail & Status Modal */}
      {isStatusModalOpen && selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 relative animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => {
                setIsStatusModalOpen(false);
                setSelectedDonation(null);
              }}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 p-1"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#e6f9ff] text-[#00698c] flex items-center justify-center text-lg font-bold">
                💝
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-[#0a0d12]">
                  Donation Record Details
                </h3>
                <p className="text-xs text-gray-500 font-mono">
                  {selectedDonation.id}
                </p>
              </div>
            </div>

            {/* Donation Quick Specs */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2.5 text-xs text-gray-700 mb-5 border border-gray-100">
              <div className="flex justify-between">
                <span className="text-gray-500">Donor Name:</span>
                <span className="font-semibold text-gray-900">
                  {selectedDonation.donorName}{" "}
                  {selectedDonation.isAnonymous ? "(Anonymous)" : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Donor Email:</span>
                <span className="font-medium text-gray-900">
                  {selectedDonation.donorEmail}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount &amp; Frequency:</span>
                <span className="font-bold text-[#000080]">
                  ${Number(selectedDonation.amount).toFixed(2)}{" "}
                  {selectedDonation.currency} (
                  {selectedDonation.frequency === "MONTHLY"
                    ? "Monthly Ongoing"
                    : "One-Time"}
                  )
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Gateway:</span>
                <span className="font-semibold text-gray-900">
                  {selectedDonation.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-mono text-gray-900">
                  {selectedDonation.transactionId || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Received Date:</span>
                <span>{new Date(selectedDonation.createdAt).toLocaleString()}</span>
              </div>
              {selectedDonation.message && (
                <div className="pt-2 border-t border-gray-200">
                  <span className="text-gray-500 block mb-1">
                    Dedication / Note:
                  </span>
                  <p className="text-gray-800 italic bg-white p-2 rounded border border-gray-200">
                    &ldquo;{selectedDonation.message}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Reconciliation Status
                </label>
                <select
                  value={updatingStatus}
                  onChange={(e) =>
                    setUpdatingStatus(e.target.value as DonationStatus)
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#000080]/20"
                >
                  <option value="COMPLETED">COMPLETED (Confirmed Settled)</option>
                  <option value="PENDING">PENDING (Awaiting settlement)</option>
                  <option value="REFUNDED">REFUNDED (Refund issued)</option>
                  <option value="CANCELLED">CANCELLED (Checkout dropped)</option>
                  <option value="FAILED">FAILED (Gateway decline)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Internal Admin Notes
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any internal accounting or reconciliation notes..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#000080]/20 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsStatusModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl bg-[#000080] text-white text-sm font-semibold hover:bg-[#000066] transition-colors disabled:opacity-60 shadow-xs"
                >
                  {isUpdating ? "Saving..." : "Update Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deletingId)}
        title="Delete Donation Record"
        message="Are you sure you want to delete this donation record? This action cannot be undone."
        confirmLabel="Delete Record"
        cancelLabel="Cancel"
        isConfirming={isDeleting}
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
