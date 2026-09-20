import React, { useState, useEffect, useCallback, useRef } from "react";
import { ToastType } from "@/common/components/Toast";
import {
  FellowshipApplicationItem,
  FellowshipApplicationStatus,
  getAdminFellowshipApplications,
  updateFellowshipApplicationStatus,
  deleteFellowshipApplication,
} from "@/common/services/fellowship-application.service";

interface FellowshipApplicationsManagerProps {
  token: string;
  onShowToast: (message: string, type: ToastType) => void;
}

const TRACK_LABELS: Record<string, string> = {
  research: "Research Fellows",
  junior: "Junior Fellows",
  honorary: "Honorary Fellows",
};

export function FellowshipApplicationsManager({
  token,
  onShowToast,
}: FellowshipApplicationsManagerProps) {
  const onShowToastRef = useRef(onShowToast);
  useEffect(() => {
    onShowToastRef.current = onShowToast;
  }, [onShowToast]);

  const [applications, setApplications] = useState<FellowshipApplicationItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    underReview: 0,
    accepted: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedTrack, setSelectedTrack] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Detail Modal
  const [selectedApp, setSelectedApp] = useState<FellowshipApplicationItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalAdminNotes, setModalAdminNotes] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Delete Dialog
  const [appToDelete, setAppToDelete] = useState<FellowshipApplicationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAdminFellowshipApplications(token, {
        search: searchQuery || undefined,
        status: selectedStatus,
        fellowshipType: selectedTrack,
        page,
        limit: 10,
      });
      setApplications(res.data || []);
      setStats(res.stats || { total: 0, pending: 0, underReview: 0, accepted: 0, rejected: 0 });
      setTotalPages(res.meta?.totalPages || 1);
      setTotalCount(res.meta?.total || 0);
    } catch (err: unknown) {
      onShowToastRef.current(
        err instanceof Error ? err.message : "Failed to load fellowship applications",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [token, searchQuery, selectedStatus, selectedTrack, page]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleOpenDetail = (app: FellowshipApplicationItem) => {
    setSelectedApp(app);
    setModalAdminNotes(app.adminNotes || "");
    setIsDetailModalOpen(true);
  };

  const handleStatusChange = async (
    id: string,
    newStatus: FellowshipApplicationStatus,
    notes?: string
  ) => {
    setIsUpdatingStatus(true);
    try {
      const updated = await updateFellowshipApplicationStatus(
        token,
        id,
        newStatus,
        notes !== undefined ? notes : modalAdminNotes
      );
      setApplications((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(updated);
      }
      onShowToastRef.current(`Application marked as ${newStatus}`, "success");
      fetchApplications();
    } catch (err: unknown) {
      onShowToastRef.current(
        err instanceof Error ? err.message : "Failed to update status",
        "error"
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!appToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFellowshipApplication(token, appToDelete.id);
      onShowToastRef.current("Fellowship application deleted successfully", "success");
      setAppToDelete(null);
      if (selectedApp?.id === appToDelete.id) {
        setIsDetailModalOpen(false);
        setSelectedApp(null);
      }
      fetchApplications();
    } catch (err: unknown) {
      onShowToastRef.current(
        err instanceof Error ? err.message : "Failed to delete application",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: FellowshipApplicationStatus) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Pending
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Under Review
          </span>
        );
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Accepted
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#101828]">Fellowship Applications</h2>
          <p className="text-xs text-gray-500 mt-1">
            Review candidate qualifications, statements of purpose, and manage admission statuses.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchApplications}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-2xs disabled:opacity-60 cursor-pointer self-start sm:self-auto"
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
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>{isLoading ? "Refreshing..." : "Refresh"}</span>
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col">
          <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            Total Submissions
          </span>
          <span className="text-2xl font-bold text-[#101828] mt-1">{stats.total}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs flex flex-col">
          <span className="text-[11px] font-medium text-amber-600 uppercase tracking-wider">
            Pending Review
          </span>
          <span className="text-2xl font-bold text-amber-700 mt-1">{stats.pending}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200/80 shadow-2xs flex flex-col">
          <span className="text-[11px] font-medium text-blue-600 uppercase tracking-wider">
            Under Review
          </span>
          <span className="text-2xl font-bold text-blue-700 mt-1">{stats.underReview}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-2xs flex flex-col">
          <span className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider">
            Accepted
          </span>
          <span className="text-2xl font-bold text-emerald-700 mt-1">{stats.accepted}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-2xs flex flex-col col-span-2 sm:col-span-1">
          <span className="text-[11px] font-medium text-rose-600 uppercase tracking-wider">
            Rejected
          </span>
          <span className="text-2xl font-bold text-rose-700 mt-1">{stats.rejected}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by candidate name, email, institution, or degree..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#f8fafc] border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#00bfff] focus:border-[#00bfff]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Fellowship Track Filter */}
          <select
            value={selectedTrack}
            onChange={(e) => {
              setSelectedTrack(e.target.value);
              setPage(1);
            }}
            className="text-xs bg-[#f8fafc] border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#00bfff] cursor-pointer"
          >
            <option value="ALL">All Tracks</option>
            <option value="research">Research Fellows</option>
            <option value="junior">Junior Fellows</option>
            <option value="honorary">Honorary Fellows</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="text-xs bg-[#f8fafc] border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#00bfff] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Track</th>
                <th className="py-3 px-4">Institution / Country</th>
                <th className="py-3 px-4">Degree</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-6 w-6 text-[#00bfff]"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      <span>Loading applications...</span>
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <span className="text-2xl">🎓</span>
                      <p className="font-semibold text-gray-600">No fellowship applications found</p>
                      <p className="text-[11px] text-gray-400">
                        {searchQuery || selectedStatus !== "ALL" || selectedTrack !== "ALL"
                          ? "Try clearing filters to view all submissions."
                          : "Submitted applications from the website will appear here."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const initials = `${app.firstName?.[0] || ""}${app.lastName?.[0] || ""}`.toUpperCase();
                  const trackName = TRACK_LABELS[app.fellowshipType] || app.fellowshipType;

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-[#fcfaff] transition-colors group cursor-pointer"
                      onClick={() => handleOpenDetail(app)}
                    >
                      {/* Applicant */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#000080] to-[#00bfff] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            {initials || "U"}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#101828]">
                              {app.firstName} {app.lastName}
                            </span>
                            <span className="text-[11px] text-gray-500 font-mono">
                              {app.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Track */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#e6f9ff] text-[#00698c] border border-[#b0ebff]">
                          {trackName}
                        </span>
                      </td>

                      {/* Institution / Country */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {app.institution || "Independent Scholar"}
                          </span>
                          <span className="text-[11px] text-gray-500">{app.country}</span>
                        </div>
                      </td>

                      {/* Degree */}
                      <td className="py-3.5 px-4">
                        <span className="text-gray-700 truncate max-w-[180px] block" title={app.degree}>
                          {app.degree}
                        </span>
                      </td>

                      {/* Status */}
                      <td
                        className="py-3.5 px-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {getStatusBadge(app.status)}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-[11px] text-gray-500 whitespace-nowrap">
                        {app.createdAt
                          ? new Date(app.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-3.5 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(app)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#00bfff] hover:bg-[#e6f9ff] rounded-lg transition-colors cursor-pointer"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => setAppToDelete(app)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Application"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-[#f8fafc] text-xs text-gray-500">
          <span>
            Showing {applications.length} of {totalCount} applications
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-2.5 py-1 border border-gray-200 rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <span className="font-semibold text-gray-700">
              Page {page} of {totalPages || 1}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-2.5 py-1 border border-gray-200 rounded-lg bg-white disabled:opacity-40 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Application Detail Modal */}
      {isDetailModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#f8fafc]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#000080] to-[#00bfff] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  {`${selectedApp.firstName?.[0] || ""}${selectedApp.lastName?.[0] || ""}`.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#101828]">
                    {selectedApp.firstName} {selectedApp.lastName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{selectedApp.email}</span>
                    <span>•</span>
                    <span>
                      {selectedApp.countryCode} {selectedApp.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(selectedApp.status)}
                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Profile Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f8fafc] p-3.5 rounded-2xl border border-gray-100 text-xs">
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">
                    Fellowship Track
                  </span>
                  <span className="font-semibold text-[#00698c]">
                    {TRACK_LABELS[selectedApp.fellowshipType] || selectedApp.fellowshipType}
                  </span>
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">
                    Residence Country
                  </span>
                  <span className="font-semibold text-gray-800">{selectedApp.country}</span>
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">
                    Highest Degree
                  </span>
                  <span className="font-semibold text-gray-800">{selectedApp.degree}</span>
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">
                    Current Institution
                  </span>
                  <span className="font-semibold text-gray-800">
                    {selectedApp.institution || "Not specified"}
                  </span>
                </div>
              </div>

              {/* Research Interest */}
              {selectedApp.researchInterest && (
                <div>
                  <span className="block text-xs font-bold text-gray-600 mb-1">
                    Primary Research Interest
                  </span>
                  <p className="text-xs text-gray-800 bg-gray-50 border border-gray-100 p-2.5 rounded-xl">
                    {selectedApp.researchInterest}
                  </p>
                </div>
              )}

              {/* Statement of Purpose */}
              <div>
                <span className="block text-xs font-bold text-gray-600 mb-1">
                  Statement of Purpose / Motivation
                </span>
                <div className="bg-[#faf5ff] border border-[#f3e8ff] p-4 rounded-2xl text-xs text-[#1e1b4b] leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto font-sans">
                  {selectedApp.statement}
                </div>
              </div>

              {/* Uploaded Documents */}
              <div>
                <span className="block text-xs font-bold text-gray-600 mb-2">
                  Supporting Documents &amp; CV (
                  {selectedApp.documents?.length || 0})
                </span>
                {selectedApp.documents && selectedApp.documents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedApp.documents.map((doc, dIdx) => (
                      <div
                        key={dIdx}
                        className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="text-xl">📄</span>
                          <div className="flex flex-col truncate">
                            <span className="text-xs font-semibold text-gray-800 truncate">
                              {doc.name || `Document #${dIdx + 1}`}
                            </span>
                            {doc.size && (
                              <span className="text-[10px] text-gray-400">
                                {(doc.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            )}
                          </div>
                        </div>

                        {doc.url && (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00bfff] hover:bg-[#009ecc] text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
                          >
                            <span>Download / View</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No document attachments uploaded.</p>
                )}
              </div>

              {/* Internal Review Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Internal Review Notes / Feedback
                </label>
                <textarea
                  rows={2}
                  value={modalAdminNotes}
                  onChange={(e) => setModalAdminNotes(e.target.value)}
                  placeholder="Add private review remarks or next steps here..."
                  className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl p-3 text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00bfff]"
                />
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 bg-[#f8fafc]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500">Set Status:</span>
                <button
                  type="button"
                  disabled={isUpdatingStatus || selectedApp.status === "ACCEPTED"}
                  onClick={() => handleStatusChange(selectedApp.id, "ACCEPTED")}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  ✓ Accept
                </button>
                <button
                  type="button"
                  disabled={isUpdatingStatus || selectedApp.status === "UNDER_REVIEW"}
                  onClick={() => handleStatusChange(selectedApp.id, "UNDER_REVIEW")}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  🔍 Under Review
                </button>
                <button
                  type="button"
                  disabled={isUpdatingStatus || selectedApp.status === "REJECTED"}
                  onClick={() => handleStatusChange(selectedApp.id, "REJECTED")}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  ✕ Reject
                </button>
                <button
                  type="button"
                  disabled={isUpdatingStatus || selectedApp.status === "PENDING"}
                  onClick={() => handleStatusChange(selectedApp.id, "PENDING")}
                  className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  ⏳ Pending
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange(selectedApp.id, selectedApp.status, modalAdminNotes)
                  }
                  disabled={isUpdatingStatus}
                  className="px-4 py-1.5 bg-[#000080] hover:bg-[#000066] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-60 shadow-xs"
                >
                  {isUpdatingStatus ? "Saving..." : "Save Notes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {appToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-gray-900">Delete Application</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to permanently delete the application for{" "}
              <strong className="text-gray-900">
                {appToDelete.firstName} {appToDelete.lastName}
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAppToDelete(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
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
