import React, { useState, useEffect, useCallback, useRef } from "react";
import { ToastType } from "@/common/components/Toast";
import {
  AdmissionApplicationItem,
  AdmissionApplicationStatus,
  ADMISSION_STATUS_LABELS,
  getAdminAdmissionApplications,
  updateAdminAdmissionStatus,
  updateAdminAdmissionNotes,
  deleteAdminAdmissionApplication,
} from "@/common/services/admission-application.service";

interface AdmissionsManagerProps {
  token: string;
  onShowToast: (message: string, type: ToastType) => void;
}

export function AdmissionsManager({
  token,
  onShowToast,
}: AdmissionsManagerProps) {
  const onShowToastRef = useRef(onShowToast);
  useEffect(() => {
    onShowToastRef.current = onShowToast;
  }, [onShowToast]);

  const [applications, setApplications] = useState<AdmissionApplicationItem[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    underReview: 0,
    additionalInfoRequired: 0,
    accepted: 0,
    waitlisted: 0,
    notSelected: 0,
    enrollment: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedProgramType, setSelectedProgramType] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Detail Modal
  const [selectedApp, setSelectedApp] = useState<AdmissionApplicationItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailTab, setDetailTab] = useState<"dossier" | "statement" | "documents" | "action">("dossier");
  const [modalAdminNotes, setModalAdminNotes] = useState("");
  const [modalTargetStatus, setModalTargetStatus] = useState<AdmissionApplicationStatus>("SUBMITTED");
  const [notifyApplicant, setNotifyApplicant] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Delete Dialog
  const [appToDelete, setAppToDelete] = useState<AdmissionApplicationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getAdminAdmissionApplications(token, {
        search: searchQuery || undefined,
        status: selectedStatus,
        programType: selectedProgramType,
        page,
        limit: 10,
      });
      setApplications(res.data || []);
      setStats(
        res.stats || {
          total: 0,
          submitted: 0,
          underReview: 0,
          additionalInfoRequired: 0,
          accepted: 0,
          waitlisted: 0,
          notSelected: 0,
          enrollment: 0,
        }
      );
      setTotalPages(res.meta?.totalPages || 1);
      setTotalCount(res.meta?.total || 0);
    } catch (err: unknown) {
      onShowToastRef.current(
        err instanceof Error ? err.message : "Failed to load admission applications",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [token, searchQuery, selectedStatus, selectedProgramType, page]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleOpenDetail = (app: AdmissionApplicationItem) => {
    setSelectedApp(app);
    setModalAdminNotes(app.adminNotes || "");
    setModalTargetStatus(app.status);
    setNotifyApplicant(false);
    setNotificationMessage("");
    setDetailTab("dossier");
    setIsDetailModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedApp) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await updateAdminAdmissionStatus(token, selectedApp.id, {
        status: modalTargetStatus,
        adminNotes: modalAdminNotes || undefined,
        notifyApplicant,
        notificationMessage: notificationMessage || undefined,
      });

      setSelectedApp(updated);
      setApplications((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      onShowToastRef.current("Application status updated successfully", "success");
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

  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    setIsSavingNotes(true);
    try {
      const updated = await updateAdminAdmissionNotes(
        token,
        selectedApp.id,
        modalAdminNotes
      );
      setSelectedApp(updated);
      setApplications((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      onShowToastRef.current("Internal notes saved", "success");
    } catch (err: unknown) {
      onShowToastRef.current(
        err instanceof Error ? err.message : "Failed to save notes",
        "error"
      );
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDelete = async () => {
    if (!appToDelete) return;
    setIsDeleting(true);
    try {
      await deleteAdminAdmissionApplication(token, appToDelete.id);
      setApplications((prev) => prev.filter((a) => a.id !== appToDelete.id));
      onShowToastRef.current("Application deleted successfully", "success");
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

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: "Total Apps", count: stats.total, color: "text-[#000080]", bg: "bg-blue-50 border-blue-200" },
          { label: "Submitted", count: stats.submitted, color: "text-sky-700", bg: "bg-sky-50 border-sky-200" },
          { label: "Under Review", count: stats.underReview, color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
          { label: "Needs Info", count: stats.additionalInfoRequired, color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
          { label: "Accepted", count: stats.accepted, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
          { label: "Waitlisted", count: stats.waitlisted, color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
          { label: "Not Selected", count: stats.notSelected, color: "text-rose-700", bg: "bg-rose-50 border-rose-200" },
          { label: "Enrolled", count: stats.enrollment, color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200" },
        ].map((stat, i) => (
          <div key={i} className={`p-3.5 rounded-2xl border ${stat.bg} flex flex-col justify-between`}>
            <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">{stat.label}</span>
            <span className={`text-xl font-extrabold mt-1 ${stat.color}`}>{stat.count}</span>
          </div>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="w-full lg:w-96 relative">
          <input
            type="text"
            placeholder="Search by name, email, ref #, or institution..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00bfff]"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#00bfff]"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ADDITIONAL_INFO_REQUIRED">Additional Info Required</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="WAITLISTED">Waitlisted</option>
            <option value="NOT_SELECTED">Not Selected</option>
            <option value="ENROLLMENT">Enrollment</option>
          </select>

          {/* Program Type Dropdown */}
          <select
            value={selectedProgramType}
            onChange={(e) => {
              setSelectedProgramType(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#00bfff]"
          >
            <option value="ALL">All Program Categories</option>
            <option value="Diploma Program">Diploma Program</option>
            <option value="Certificate Program">Certificate Program</option>
            <option value="Professional Training Program">Professional Training</option>
            <option value="Short Course">Short Course</option>
            <option value="Other">Other</option>
          </select>

          <button
            type="button"
            onClick={fetchApplications}
            className="p-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-600 transition-colors"
            title="Refresh List"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center text-gray-500 text-sm">
            <svg className="animate-spin w-8 h-8 text-[#000080] mx-auto mb-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>Loading admission applications...</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            <p className="text-sm font-semibold">No admission applications found.</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Ref #</th>
                  <th className="px-5 py-3.5 font-semibold">Applicant</th>
                  <th className="px-5 py-3.5 font-semibold">Program</th>
                  <th className="px-5 py-3.5 font-semibold">Area of Study</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold">Date</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-[#000080]">
                      {app.referenceNumber}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-gray-900">{app.fullName}</div>
                      <div className="text-xs text-gray-500">{app.email}</div>
                    </td>
                    <td className="px-5 py-3.5 max-w-[200px]">
                      <div className="truncate font-medium text-gray-900" title={app.programName}>
                        {app.programName}
                      </div>
                      <span className="text-[11px] text-gray-500">{app.programType}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 max-w-[180px] truncate" title={app.areaOfStudy}>
                      {app.areaOfStudy}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          ADMISSION_STATUS_LABELS[app.status]?.bg || "bg-gray-100"
                        } ${ADMISSION_STATUS_LABELS[app.status]?.color || "text-gray-700"}`}
                      >
                        {ADMISSION_STATUS_LABELS[app.status]?.label || app.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(app)}
                          className="px-3 py-1.5 bg-[#000080] hover:bg-[#000066] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
                        >
                          Review
                        </button>
                        <button
                          type="button"
                          onClick={() => setAppToDelete(app)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete Application"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing {applications.length} of {totalCount} applications
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-white transition-colors"
            >
              Previous
            </button>
            <span className="font-medium text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-white transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL / DRAWER */}
      {isDetailModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#000080] to-[#00698c] text-white flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-sm bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                    {selectedApp.referenceNumber}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      ADMISSION_STATUS_LABELS[selectedApp.status]?.bg || "bg-white/20"
                    } ${ADMISSION_STATUS_LABELS[selectedApp.status]?.color || "text-white"}`}
                  >
                    {ADMISSION_STATUS_LABELS[selectedApp.status]?.label || selectedApp.status}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold mt-2">{selectedApp.fullName}</h3>
                <p className="text-sky-200 text-xs mt-0.5">
                  Applied for <strong>{selectedApp.programName}</strong> ({selectedApp.programType}) &bull; Submitted {new Date(selectedApp.createdAt).toLocaleDateString()}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-200 px-6 bg-gray-50 text-xs sm:text-sm font-semibold">
              {[
                { id: "dossier", label: "Applicant Dossier" },
                { id: "statement", label: "Statement & Research" },
                { id: "documents", label: `Documents (${(selectedApp.academicDocuments?.length || 0) + (selectedApp.resumeDocuments?.length || 0) + (selectedApp.additionalDocuments?.length || 0)})` },
                { id: "action", label: "Decision & Actions" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setDetailTab(t.id as any)}
                  className={`py-3.5 px-4 border-b-2 font-medium transition-colors ${
                    detailTab === t.id
                      ? "border-[#000080] text-[#000080] font-bold bg-white"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm text-gray-800">
              {/* TAB 1: DOSSIER */}
              {detailTab === "dossier" && (
                <div className="space-y-6">
                  {/* Personal Details */}
                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200">
                    <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-3">
                      Section 1 & 2: Program & Personal Profile
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs sm:text-sm">
                      <div>
                        <span className="text-gray-500 block">Preferred Name:</span>
                        <strong className="text-gray-900">{selectedApp.preferredName || "N/A"}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Date of Birth:</span>
                        <span className="text-gray-900">{selectedApp.dateOfBirth}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Gender:</span>
                        <span className="text-gray-900">{selectedApp.gender}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Nationality:</span>
                        <span className="text-gray-900">{selectedApp.nationality}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Residence:</span>
                        <span className="text-gray-900">{selectedApp.city}, {selectedApp.countryOfResidence}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Phone / WhatsApp:</span>
                        <span className="text-gray-900 font-mono">{selectedApp.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Email Address:</span>
                        <span className="text-gray-900">{selectedApp.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Preferred Language:</span>
                        <span className="text-gray-900">{selectedApp.preferredLanguage}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Study Format:</span>
                        <span className="text-gray-900 font-semibold">{selectedApp.studyFormat}</span>
                      </div>
                    </div>
                  </div>

                  {/* Education */}
                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200">
                    <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-3">
                      Section 3: Educational Background
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs sm:text-sm">
                      <div>
                        <span className="text-gray-500 block">Highest Degree:</span>
                        <strong className="text-gray-900">{selectedApp.highestEducationLevel}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Institution:</span>
                        <span className="text-gray-900">{selectedApp.institutionName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Field of Study:</span>
                        <span className="text-gray-900">{selectedApp.fieldOfStudy}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Graduation Year / Status:</span>
                        <span className="text-gray-900">{selectedApp.graduationYear} ({selectedApp.currentEducationalStatus})</span>
                      </div>
                    </div>
                  </div>

                  {/* Professional Experience */}
                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200">
                    <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-3">
                      Section 4: Professional Experience
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm mb-3">
                      <div>
                        <span className="text-gray-500 block">Current Role:</span>
                        <strong className="text-gray-900">{selectedApp.currentOccupation || "N/A"}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Organization:</span>
                        <span className="text-gray-900">{selectedApp.organization || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Experience Duration:</span>
                        <span className="text-gray-900">{selectedApp.yearsOfExperience || "N/A"}</span>
                      </div>
                    </div>

                    {selectedApp.areasOfExperience && selectedApp.areasOfExperience.length > 0 && (
                      <div className="mb-3">
                        <span className="text-gray-500 block text-xs mb-1">Areas of Experience:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedApp.areasOfExperience.map((area, i) => (
                            <span key={i} className="px-2.5 py-0.5 bg-blue-100 text-[#000080] rounded-full text-xs font-semibold">
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedApp.experienceSummary && (
                      <div className="mt-2 text-xs text-gray-700 bg-white p-3 rounded-xl border border-gray-200">
                        <span className="font-semibold block text-gray-500 mb-1">Experience Description:</span>
                        <p className="whitespace-pre-wrap">{selectedApp.experienceSummary}</p>
                      </div>
                    )}
                  </div>

                  {/* Section 9 Accommodations & Declaration */}
                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200">
                    <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Section 9 & 10: Accommodations & Electronic Signature
                    </h4>
                    <div className="text-xs space-y-2">
                      <p>
                        <strong>Accommodation requested:</strong> {selectedApp.requiresAccommodation}
                        {selectedApp.accommodationDetails && ` - ${selectedApp.accommodationDetails}`}
                      </p>
                      <p>
                        <strong>Electronic Signature:</strong>{" "}
                        <span className="font-serif italic text-sm font-bold text-[#000080]">
                          {selectedApp.electronicSignature}
                        </span>{" "}
                        (Signed on: {selectedApp.signedDate})
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: STATEMENT & RESEARCH */}
              {detailTab === "statement" && (
                <div className="space-y-6">
                  {/* SOP Questions */}
                  <div className="space-y-4">
                    <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100">
                      <h5 className="font-semibold text-xs text-[#00698c] uppercase mb-1">
                        26. Why do you want to study at IILP?
                      </h5>
                      <p className="text-xs sm:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {selectedApp.whyIilp || "No response provided."}
                      </p>
                    </div>

                    <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100">
                      <h5 className="font-semibold text-xs text-[#00698c] uppercase mb-1">
                        27. What are your academic or professional goals?
                      </h5>
                      <p className="text-xs sm:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {selectedApp.academicProfessionalGoals || "No response provided."}
                      </p>
                    </div>

                    <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100">
                      <h5 className="font-semibold text-xs text-[#00698c] uppercase mb-1">
                        28. Expected program contribution to future work / career?
                      </h5>
                      <p className="text-xs sm:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {selectedApp.careerContribution || "No response provided."}
                      </p>
                    </div>

                    <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-100">
                      <h5 className="font-semibold text-xs text-[#00698c] uppercase mb-1">
                        29. Interest in law, politics, human rights, or related fields?
                      </h5>
                      <p className="text-xs sm:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {selectedApp.fieldInterest || "No response provided."}
                      </p>
                    </div>
                  </div>

                  {/* Section 6 Research */}
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                    <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider">
                      Section 6: Research Interests & Publications
                    </h4>
                    {selectedApp.primaryResearchInterests && (
                      <div>
                        <span className="text-xs font-semibold text-gray-600 block">Primary Research Interests:</span>
                        <p className="text-xs sm:text-sm text-gray-800">{selectedApp.primaryResearchInterests}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-semibold text-gray-600 block">Currently involved in research?</span>
                      <p className="text-xs sm:text-sm text-gray-800">
                        {selectedApp.currentlyInResearch ? "Yes" : "No"}
                        {selectedApp.currentResearchDetails && ` - ${selectedApp.currentResearchDetails}`}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-600 block">Published research or articles?</span>
                      <p className="text-xs sm:text-sm text-gray-800">
                        {selectedApp.hasPublications ? "Yes" : "No"}
                        {selectedApp.publicationDetails && ` - ${selectedApp.publicationDetails}`}
                      </p>
                    </div>
                  </div>

                  {/* Section 7 Skills */}
                  {selectedApp.skills && selectedApp.skills.length > 0 && (
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                      <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">
                        Section 7: Relevant Skills & Languages
                      </h4>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {selectedApp.skills.map((s, i) => (
                          <span key={i} className="px-2.5 py-0.5 bg-gray-200 text-gray-800 rounded-full text-xs font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                      {selectedApp.languagesSpoken && (
                        <p className="text-xs text-gray-700 mt-2">
                          <strong>Languages Spoken:</strong> {selectedApp.languagesSpoken}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DOCUMENTS */}
              {detailTab === "documents" && (
                <div className="space-y-6">
                  {/* CV / Resume */}
                  <div>
                    <h5 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">
                      CV / Resume Documents ({selectedApp.resumeDocuments?.length || 0})
                    </h5>
                    {selectedApp.resumeDocuments && selectedApp.resumeDocuments.length > 0 ? (
                      <div className="space-y-2">
                        {selectedApp.resumeDocuments.map((doc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-sky-50/70 border border-sky-200 rounded-xl">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">📄</span>
                              <div>
                                <p className="font-semibold text-xs sm:text-sm text-gray-900">{doc.name}</p>
                                {doc.size && <span className="text-[11px] text-gray-500">{(doc.size / 1024 / 1024).toFixed(1)} MB</span>}
                              </div>
                            </div>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-white border border-sky-300 hover:bg-sky-100 text-[#00698c] text-xs font-semibold rounded-lg transition-colors"
                            >
                              View / Download
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No CV document uploaded.</p>
                    )}
                  </div>

                  {/* Academic Documents */}
                  <div>
                    <h5 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Academic Certificates & Transcripts ({selectedApp.academicDocuments?.length || 0})
                    </h5>
                    {selectedApp.academicDocuments && selectedApp.academicDocuments.length > 0 ? (
                      <div className="space-y-2">
                        {selectedApp.academicDocuments.map((doc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">🎓</span>
                              <div>
                                <p className="font-semibold text-xs sm:text-sm text-gray-900">{doc.name}</p>
                                {doc.size && <span className="text-[11px] text-gray-500">{(doc.size / 1024 / 1024).toFixed(1)} MB</span>}
                              </div>
                            </div>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                            >
                              View / Download
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No academic certificates attached.</p>
                    )}
                  </div>

                  {/* Additional Documents */}
                  <div>
                    <h5 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2">
                      Additional Supporting Documents ({selectedApp.additionalDocuments?.length || 0})
                    </h5>
                    {selectedApp.additionalDocuments && selectedApp.additionalDocuments.length > 0 ? (
                      <div className="space-y-2">
                        {selectedApp.additionalDocuments.map((doc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">📎</span>
                              <div>
                                <p className="font-semibold text-xs sm:text-sm text-gray-900">{doc.name}</p>
                                {doc.size && <span className="text-[11px] text-gray-500">{(doc.size / 1024 / 1024).toFixed(1)} MB</span>}
                              </div>
                            </div>
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
                            >
                              View / Download
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic">No additional documents uploaded.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: DECISION & ACTIONS */}
              {detailTab === "action" && (
                <div className="space-y-6">
                  {/* Status Changer Card */}
                  <div className="bg-[#f0faff] p-5 rounded-2xl border border-sky-200 space-y-4">
                    <h4 className="font-semibold text-sm text-[#000080]">Update Application Status</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Select Decision Status:
                        </label>
                        <select
                          value={modalTargetStatus}
                          onChange={(e) => setModalTargetStatus(e.target.value as AdmissionApplicationStatus)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00bfff]"
                        >
                          <option value="SUBMITTED">Application Submitted</option>
                          <option value="UNDER_REVIEW">Under Review</option>
                          <option value="ADDITIONAL_INFO_REQUIRED">Additional Information Required</option>
                          <option value="ACCEPTED">Accepted</option>
                          <option value="WAITLISTED">Waitlisted</option>
                          <option value="NOT_SELECTED">Not Selected</option>
                          <option value="ENROLLMENT">Enrollment</option>
                        </select>
                      </div>

                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm text-gray-800 font-semibold">
                          <input
                            type="checkbox"
                            checked={notifyApplicant}
                            onChange={(e) => setNotifyApplicant(e.target.checked)}
                            className="w-4 h-4 text-[#000080] rounded border-gray-300 focus:ring-[#00bfff]"
                          />
                          <span>Dispatch Status Notification Email to Applicant</span>
                        </label>
                      </div>
                    </div>

                    {notifyApplicant && (
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Custom Instructions / Message in Email (Optional):
                        </label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Please provide an updated scanned copy of your bachelor degree certificate..."
                          value={notificationMessage}
                          onChange={(e) => setNotificationMessage(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00bfff]"
                        />
                      </div>
                    )}

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleStatusUpdate}
                        disabled={isUpdatingStatus}
                        className="px-6 py-2.5 bg-[#000080] hover:bg-[#000066] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50"
                      >
                        {isUpdatingStatus ? "Updating Status..." : "Save Status & Send Notification"}
                      </button>
                    </div>
                  </div>

                  {/* Internal Notes Notepad */}
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-3">
                    <h4 className="font-semibold text-sm text-gray-800">Internal Committee Notes</h4>
                    <p className="text-xs text-gray-500">
                      Private administrative notes visible only to IILP admissions officers and reviewers.
                    </p>
                    <textarea
                      rows={3}
                      placeholder="Enter remarks, academic review comments, interview notes..."
                      value={modalAdminNotes}
                      onChange={(e) => setModalAdminNotes(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00bfff] bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      disabled={isSavingNotes}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
                    >
                      {isSavingNotes ? "Saving Notes..." : "Save Notes"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setAppToDelete(selectedApp)}
                className="px-4 py-2 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl transition-colors"
              >
                Delete Application
              </button>

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {appToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">Delete Application?</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-6">
              Are you sure you want to delete application <strong>{appToDelete.referenceNumber}</strong> ({appToDelete.fullName})? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setAppToDelete(null)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
