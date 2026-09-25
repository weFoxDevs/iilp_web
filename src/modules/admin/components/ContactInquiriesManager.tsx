import React, { useState, useEffect, useCallback, useRef } from "react";
import { ToastType } from "@/common/components/Toast";
import {
  ContactInquiryItem,
  ContactInquiryStatus,
  getAdminContactInquiries,
  updateAdminContactInquiry,
  deleteAdminContactInquiry,
} from "@/common/services/contact.service";

interface ContactInquiriesManagerProps {
  token: string;
  onShowToast: (message: string, type: ToastType) => void;
}

const STATUS_BADGE_STYLES: Record<ContactInquiryStatus, string> = {
  UNREAD: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20",
  READ: "bg-gray-100 text-gray-700 border-gray-200 ring-gray-500/20",
  REPLIED: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20",
  ARCHIVED: "bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/20",
};

const STATUS_LABELS: Record<ContactInquiryStatus, string> = {
  UNREAD: "Unread",
  READ: "Read",
  REPLIED: "Replied",
  ARCHIVED: "Archived",
};

export function ContactInquiriesManager({
  token,
  onShowToast,
}: ContactInquiriesManagerProps) {
  const onShowToastRef = useRef(onShowToast);
  useEffect(() => {
    onShowToastRef.current = onShowToast;
  }, [onShowToast]);

  const [inquiries, setInquiries] = useState<ContactInquiryItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
    replied: 0,
    archived: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Detail Modal
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiryItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalAdminNotes, setModalAdminNotes] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Delete Dialog
  const [inquiryToDelete, setInquiryToDelete] = useState<ContactInquiryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchInquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAdminContactInquiries(token, {
        search: searchQuery || undefined,
        status: selectedStatus,
        page,
        limit: 10,
        sortBy: "createdAt",
        order: "DESC",
      });
      const items = res.data || (res as any).items || [];
      setInquiries(items);
      setStats(
        res.stats || {
          total: items.length,
          unread: 0,
          read: 0,
          replied: 0,
          archived: 0,
        }
      );
      setTotalPages(res.meta?.totalPages || (res as any).totalPages || 1);
      setTotalCount(res.meta?.total ?? (res as any).total ?? items.length);
    } catch (err: unknown) {
      onShowToastRef.current(
        err instanceof Error ? err.message : "Failed to load contact inquiries",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [token, searchQuery, selectedStatus, page]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleOpenDetail = async (inquiry: ContactInquiryItem) => {
    setSelectedInquiry(inquiry);
    setModalAdminNotes(inquiry.adminNotes || "");
    setIsDetailModalOpen(true);

    // If unread, automatically mark as read
    if (inquiry.status === "UNREAD") {
      try {
        const updated = await updateAdminContactInquiry(token, inquiry.id, {
          status: "READ",
        });
        setSelectedInquiry(updated);
        setInquiries((prev) =>
          prev.map((item) => (item.id === inquiry.id ? updated : item))
        );
        setStats((prev) => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1),
          read: prev.read + 1,
        }));
      } catch {
        // silent fail on auto-read
      }
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: ContactInquiryStatus,
    notes?: string
  ) => {
    setIsUpdatingStatus(true);
    try {
      const updated = await updateAdminContactInquiry(token, id, {
        status: newStatus,
        adminNotes: notes !== undefined ? notes : undefined,
      });

      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(updated);
      }
      onShowToastRef.current(
        `Inquiry marked as ${STATUS_LABELS[newStatus]}`,
        "success"
      );
      fetchInquiries();
    } catch (err: unknown) {
      onShowToastRef.current(
        err instanceof Error ? err.message : "Failed to update inquiry status",
        "error"
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await updateAdminContactInquiry(token, selectedInquiry.id, {
        adminNotes: modalAdminNotes,
      });
      setSelectedInquiry(updated);
      setInquiries((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      onShowToastRef.current("Notes saved successfully", "success");
    } catch (err: unknown) {
      onShowToastRef.current(
        err instanceof Error ? err.message : "Failed to save notes",
        "error"
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!inquiryToDelete) return;
    setIsDeleting(true);
    try {
      await deleteAdminContactInquiry(token, inquiryToDelete.id);
      onShowToastRef.current("Inquiry deleted successfully", "success");
      setInquiryToDelete(null);
      if (selectedInquiry?.id === inquiryToDelete.id) {
        setIsDetailModalOpen(false);
        setSelectedInquiry(null);
      }
      fetchInquiries();
    } catch (err: unknown) {
      onShowToastRef.current(
        err instanceof Error ? err.message : "Failed to delete inquiry",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Stats Header */}
      <div className="bg-gradient-to-r from-[#000080] via-[#003366] to-[#00698c] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold uppercase tracking-wider text-[#b0ebff] mb-2 border border-white/10">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Public Submissions
          </div>
          <h2 className="text-2xl font-bold font-serif tracking-tight">
            Contact Inquiries &amp; Messages
          </h2>
          <p className="text-[#d8f4ff] text-xs sm:text-sm mt-1 max-w-xl">
            Messages and inquiries submitted from the website&apos;s contact form with automatic rate limiting protection.
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl px-3.5 py-2 text-center min-w-[70px]">
            <div className="text-xs text-white/70 font-medium">Total</div>
            <div className="text-lg font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-blue-500/20 backdrop-blur-xs border border-blue-400/30 rounded-xl px-3.5 py-2 text-center min-w-[70px]">
            <div className="text-xs text-blue-200 font-medium">Unread</div>
            <div className="text-lg font-bold text-blue-100">{stats.unread}</div>
          </div>
          <div className="bg-emerald-500/20 backdrop-blur-xs border border-emerald-400/30 rounded-xl px-3.5 py-2 text-center min-w-[70px]">
            <div className="text-xs text-emerald-200 font-medium">Replied</div>
            <div className="text-lg font-bold text-emerald-100">
              {stats.replied}
            </div>
          </div>
          <div className="bg-purple-500/20 backdrop-blur-xs border border-purple-400/30 rounded-xl px-3.5 py-2 text-center min-w-[70px]">
            <div className="text-xs text-purple-200 font-medium">Archived</div>
            <div className="text-lg font-bold text-purple-100">
              {stats.archived}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
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
              placeholder="Search sender, email, subject..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#000080] focus:ring-2 focus:ring-[#000080]/10 bg-gray-50/50"
            />
          </div>

          {/* Status Dropdown */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-auto px-3.5 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#000080] bg-white font-medium text-gray-700 cursor-pointer"
            >
              <option value="ALL">All Statuses ({stats.total})</option>
              <option value="UNREAD">Unread ({stats.unread})</option>
              <option value="READ">Read ({stats.read})</option>
              <option value="REPLIED">Replied ({stats.replied})</option>
              <option value="ARCHIVED">Archived ({stats.archived})</option>
            </select>
          </div>
        </div>

        {/* Refresh & Reset Buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {(searchQuery || selectedStatus !== "ALL") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedStatus("ALL");
                setPage(1);
              }}
              className="px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Reset Filters
            </button>
          )}

          <button
            onClick={() => fetchInquiries()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#000080] bg-[#e6f9ff] border border-[#b0ebff] rounded-xl hover:bg-[#b0ebff]/40 transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh Inquiries"
          >
            <svg
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
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

      {/* Inquiries Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-2xs overflow-hidden">
        {isLoading && inquiries.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="inline-block w-8 h-8 border-3 border-[#000080] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 font-medium">
              Loading contact inquiries...
            </p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900">
              No inquiries found
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
              {searchQuery || selectedStatus !== "ALL"
                ? "Try adjusting your search keywords or status filter."
                : "No messages have been submitted through the contact form yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm min-w-[760px]">
              <thead className="bg-gray-50/75 border-b border-gray-200 text-gray-600 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-4 sm:px-6 py-3.5">Sender</th>
                  <th className="px-4 py-3.5">Organization</th>
                  <th className="px-4 py-3.5">Subject &amp; Snippet</th>
                  <th className="px-4 py-3.5">Date &amp; Source</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 sm:px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.map((inquiry) => {
                  const isUnread = inquiry.status === "UNREAD";
                  return (
                    <tr
                      key={inquiry.id}
                      onClick={() => handleOpenDetail(inquiry)}
                      className={`hover:bg-[#f8fcff] cursor-pointer transition-colors ${
                        isUnread ? "bg-[#f0f9ff]/50 font-medium" : ""
                      }`}
                    >
                      {/* Sender */}
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase shrink-0 ${
                              isUnread
                                ? "bg-[#000080] text-white ring-2 ring-[#00bfff]/40"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {inquiry.firstName[0]}
                            {inquiry.lastName[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-gray-900 truncate">
                                {inquiry.firstName} {inquiry.lastName}
                              </span>
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {inquiry.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Organization */}
                      <td className="px-4 py-4">
                        <div className="text-gray-900 font-medium truncate max-w-[160px]">
                          {inquiry.organization}
                        </div>
                        {inquiry.phoneNumber && (
                          <div className="text-[11px] text-gray-400">
                            {inquiry.phoneCode} {inquiry.phoneNumber}
                          </div>
                        )}
                      </td>

                      {/* Subject & Snippet */}
                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-900 truncate max-w-[240px]">
                          {inquiry.subject}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-1 max-w-[280px]">
                          {inquiry.message}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-900">
                          {new Date(inquiry.createdAt).toLocaleDateString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {new Date(inquiry.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {inquiry.ipAddress && ` • ${inquiry.ipAddress}`}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ring-1 ${
                            STATUS_BADGE_STYLES[inquiry.status]
                          }`}
                        >
                          {STATUS_LABELS[inquiry.status]}
                        </span>
                      </td>

                      {/* Actions */}
                      <td
                        className="px-4 sm:px-6 py-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(inquiry)}
                            className="p-1.5 text-gray-500 hover:text-[#000080] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title="View Message"
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

                          <a
                            href={`mailto:${inquiry.email}?subject=${encodeURIComponent(
                              `Re: ${inquiry.subject}`
                            )}`}
                            className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Reply via Email"
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
                                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                              />
                            </svg>
                          </a>

                          <button
                            type="button"
                            onClick={() => setInquiryToDelete(inquiry)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Inquiry"
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
        {totalPages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-gray-500">
              Showing page <span className="font-bold text-gray-800">{page}</span>{" "}
              of{" "}
              <span className="font-bold text-gray-800">{totalPages}</span> (
              {totalCount} total inquiries)
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {isDetailModalOpen && selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#000080] text-white flex items-center justify-center font-bold text-sm uppercase">
                  {selectedInquiry.firstName[0]}
                  {selectedInquiry.lastName[0]}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {selectedInquiry.firstName} {selectedInquiry.lastName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedInquiry.organization}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ring-1 ${
                    STATUS_BADGE_STYLES[selectedInquiry.status]
                  }`}
                >
                  {STATUS_LABELS[selectedInquiry.status]}
                </span>
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              {/* Contact Information Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#f8fbff] border border-[#d6ecff] rounded-xl p-4">
                <div>
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                    Email Address
                  </div>
                  <div className="text-gray-900 font-medium mt-0.5 break-all flex items-center gap-1.5">
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="text-[#00698c] hover:underline"
                    >
                      {selectedInquiry.email}
                    </a>
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                    Phone Number
                  </div>
                  <div className="text-gray-900 font-medium mt-0.5">
                    {selectedInquiry.phoneNumber ? (
                      <a
                        href={`tel:${selectedInquiry.phoneCode}${selectedInquiry.phoneNumber}`}
                        className="text-[#00698c] hover:underline"
                      >
                        {selectedInquiry.phoneCode} {selectedInquiry.phoneNumber}
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                    Submitted Date &amp; Time
                  </div>
                  <div className="text-gray-900 font-medium mt-0.5">
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                    IP Address
                  </div>
                  <div className="text-gray-900 font-medium mt-0.5 font-mono text-xs">
                    {selectedInquiry.ipAddress || "Unknown"}
                  </div>
                </div>
              </div>

              {/* Subject & Full Message */}
              <div className="space-y-2">
                <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                  Subject
                </div>
                <div className="text-base font-bold text-gray-900 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200">
                  {selectedInquiry.subject}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                  Message Content
                </div>
                <div className="text-gray-800 bg-gray-50/70 p-4 rounded-xl border border-gray-200 whitespace-pre-wrap leading-relaxed text-sm">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Workflow Status Change */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                  Change Workflow Status
                </div>
                <div className="flex flex-wrap gap-2">
                  {(
                    ["UNREAD", "READ", "REPLIED", "ARCHIVED"] as ContactInquiryStatus[]
                  ).map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={isUpdatingStatus || selectedInquiry.status === st}
                      onClick={() => handleStatusChange(selectedInquiry.id, st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                        selectedInquiry.status === st
                          ? "bg-[#000080] text-white border-[#000080]"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {STATUS_LABELS[st]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal Admin Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                    Internal Staff Notes
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={isUpdatingStatus}
                    className="text-xs font-bold text-[#000080] hover:underline disabled:opacity-50 cursor-pointer"
                  >
                    Save Notes
                  </button>
                </div>
                <textarea
                  value={modalAdminNotes}
                  onChange={(e) => setModalAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this inquiry, assigned officer, follow-ups..."
                  rows={3}
                  className="w-full p-3 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-hidden focus:border-[#000080] bg-white resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setInquiryToDelete(selectedInquiry)}
                className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
              >
                Delete this inquiry
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent(
                    `Re: ${selectedInquiry.subject}`
                  )}`}
                  onClick={() => {
                    if (selectedInquiry.status !== "REPLIED") {
                      handleStatusChange(selectedInquiry.id, "REPLIED");
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Reply via Email
                </a>

                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold text-xs hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {inquiryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-gray-900">
                Delete Contact Inquiry?
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Are you sure you want to permanently delete the inquiry from{" "}
                <strong className="text-gray-800">
                  {inquiryToDelete.firstName} {inquiryToDelete.lastName}
                </strong>{" "}
                ({inquiryToDelete.email})? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setInquiryToDelete(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
