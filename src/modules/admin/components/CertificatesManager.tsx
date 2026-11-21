import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ConfirmationModal from "./ConfirmationModal";
import {
  fetchCertificatesAdmin,
  createCertificateAdmin,
  updateCertificateAdmin,
  deleteCertificateAdmin,
  CertificateData,
  CertificatesListResponse,
} from "@/common/services/certificates.service";

interface CertificatesManagerProps {
  token: string;
  onShowToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function CertificatesManager({
  token,
  onShowToast,
}: CertificatesManagerProps) {
  const [data, setData] = useState<CertificatesListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<CertificateData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [regNo, setRegNo] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [certificateTitle, setCertificateTitle] = useState("Certificate of Fellowship");
  const [programName, setProgramName] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [natureOfProgram, setNatureOfProgram] = useState("Part Time");
  const [authorizedSignatory, setAuthorizedSignatory] = useState("");
  const [status, setStatus] = useState<"VALID" | "REVOKED" | "EXPIRED">("VALID");
  const [remarks, setRemarks] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Preview Modal
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load Certificates
  const loadCertificates = async () => {
    try {
      setLoading(true);
      const res = await fetchCertificatesAdmin(token, {
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        page,
        limit: 10,
      });
      setData(res);
    } catch (err: any) {
      onShowToast(err.message || "Failed to load certificates", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, [token, page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadCertificates();
  };

  const handleOpenCreate = () => {
    setEditingCert(null);
    setRegNo("");
    setRecipientName("");
    setCertificateTitle("Certificate of Fellowship");
    setProgramName("");
    setIssueDate(new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }));
    setStartDate("");
    setEndDate("");
    setNatureOfProgram("");
    setAuthorizedSignatory("");
    setStatus("VALID");
    setRemarks("");
    setSelectedFile(null);
    setFilePreview(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: CertificateData) => {
    setEditingCert(cert);
    setRegNo(cert.regNo);
    setRecipientName(cert.recipientName);
    setCertificateTitle(cert.certificateTitle || "Certificate of Fellowship");
    setProgramName(cert.programName);
    setIssueDate(cert.issueDate);
    setStartDate(cert.startDate || "");
    setEndDate(cert.endDate || "");
    setNatureOfProgram(cert.natureOfProgram || "Part Time");
    setAuthorizedSignatory(cert.authorizedSignatory || "");
    setStatus(cert.status);
    setRemarks(cert.remarks || "");
    setSelectedFile(null);
    setFilePreview(cert.certificateFileUrl || null);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNo.trim() || !recipientName.trim() || !programName.trim() || !issueDate.trim()) {
      onShowToast("Please fill in all required fields (Regd No, Recipient Name, Program, Issue Date).", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("regNo", regNo.trim());
      formData.append("recipientName", recipientName.trim());
      formData.append("certificateTitle", certificateTitle.trim());
      formData.append("programName", programName.trim());
      formData.append("issueDate", issueDate.trim());
      if (startDate.trim()) formData.append("startDate", startDate.trim());
      if (endDate.trim()) formData.append("endDate", endDate.trim());
      formData.append("natureOfProgram", natureOfProgram.trim());
      if (authorizedSignatory.trim()) formData.append("authorizedSignatory", authorizedSignatory.trim());
      formData.append("status", status);
      if (remarks.trim()) formData.append("remarks", remarks.trim());

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      if (editingCert) {
        await updateCertificateAdmin(token, editingCert.id, formData);
        onShowToast(`Certificate ${regNo} updated successfully!`, "success");
      } else {
        await createCertificateAdmin(token, formData);
        onShowToast(`Certificate ${regNo} created and issued successfully!`, "success");
      }

      setIsModalOpen(false);
      loadCertificates();
    } catch (err: any) {
      onShowToast(err.message || "Failed to save certificate.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await deleteCertificateAdmin(token, deletingId);
      onShowToast("Certificate deleted successfully.", "success");
      setDeletingId(null);
      loadCertificates();
    } catch (err: any) {
      onShowToast(err.message || "Failed to delete certificate", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner / Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00698c]">
              Institutional Credential Registry
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#000080]">
            Certificates &amp; Verification Management
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Upload certificates, issue official credentials with unique Regd No., and manage public verification records for institutions and employers.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/verify"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 text-[#00698c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Public Verify Page
          </a>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-[#00bfff] hover:bg-[#00a3db] active:scale-95 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-sm transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Upload / Issue Certificate
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Issued</span>
          <div className="text-2xl font-bold text-[#000080] mt-1">{data?.stats.total ?? "—"}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Valid &amp; Active</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{data?.stats.valid ?? "—"}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-500">Revoked</span>
          <div className="text-2xl font-bold text-red-600 mt-1">{data?.stats.revoked ?? "—"}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Expired</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">{data?.stats.expired ?? "—"}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Regd No. or recipient name..."
              className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl pl-10 pr-4 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
            />
          </div>
          <button
            type="submit"
            className="bg-[#000080] hover:bg-[#000066] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden"
          >
            <option value="">All Statuses</option>
            <option value="VALID">Valid</option>
            <option value="REVOKED">Revoked</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      {/* Certificates Data Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-400">Loading certificate registry...</div>
        ) : !data || data.items.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
              📜
            </div>
            <h4 className="text-sm font-bold text-gray-900">No Certificates Found</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              No certificate records match your query. Click &ldquo;Upload / Issue Certificate&rdquo; above to register a new certificate.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead className="bg-[#f8fafc] text-gray-400 uppercase text-[10px] tracking-wider border-b border-gray-100 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Regd No.</th>
                  <th className="py-3.5 px-4">Recipient Name</th>
                  <th className="py-3.5 px-4">Certificate Award / Program</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Nature</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Document</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {data.items.map((item) => (
                  <tr key={item.id} className="hover:bg-sky-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#000080]">
                      {item.regNo}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      {item.recipientName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900 line-clamp-1">{item.certificateTitle}</div>
                      <div className="text-[11px] text-gray-500 line-clamp-1">{item.programName}</div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-gray-600">
                      {item.issueDate}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-gray-600">
                      {item.natureOfProgram || "Part Time"}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === "VALID"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : item.status === "REVOKED"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {item.certificateFileUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewDocUrl(item.certificateFileUrl || null)}
                          className="inline-flex items-center gap-1 text-[11px] text-[#00698c] hover:underline font-semibold cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Preview
                        </button>
                      ) : (
                        <span className="text-[11px] text-gray-400">No file</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                      <a
                        href={`/verify?regNo=${encodeURIComponent(item.regNo)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 bg-sky-50 text-[#00698c] hover:bg-sky-100 rounded-md font-semibold text-[11px] transition-colors"
                        title="Verify Certificate on Public Page"
                      >
                        Verify
                      </a>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(item)}
                        className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-md font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(item.id)}
                        className="inline-flex items-center px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {data && data.totalPages > 1 && (
          <div className="bg-[#f8fafc] px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>
              Page {data.page} of {data.totalPages} ({data.total} total)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={data.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded-md border border-gray-200 bg-white disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={data.page >= data.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-2.5 py-1 rounded-md border border-gray-200 bg-white disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Certificate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-[#000080]">
                  {editingCert ? `Edit Certificate (${editingCert.regNo})` : "Upload / Issue Certificate"}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Official credential details will be publicly verifiable by the Registration Number.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Registration Number (Regd No.) *
                  </label>
                  <input
                    type="text"
                    required
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    placeholder="e.g. IILP-FEL-2026-001"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs font-mono text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Recipient Full Name"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Certificate Award Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={certificateTitle}
                    onChange={(e) => setCertificateTitle(e.target.value)}
                    placeholder="e.g. Certificate of Fellowship"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Academic Program / Fellowship Track *
                  </label>
                  <input
                    type="text"
                    required
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    placeholder="e.g. Academic Program or Fellowship"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Date of Issue *
                  </label>
                  <input
                    type="text"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    placeholder="e.g. February 24, 2026"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Program Start Date
                  </label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="e.g. October 15, 2025"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Program End Date
                  </label>
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="e.g. December 30, 2025"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Nature of Study
                  </label>
                  <input
                    type="text"
                    value={natureOfProgram}
                    onChange={(e) => setNatureOfProgram(e.target.value)}
                    placeholder="e.g. Part Time, Full Time"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Authorized Signatory
                  </label>
                  <input
                    type="text"
                    value={authorizedSignatory}
                    onChange={(e) => setAuthorizedSignatory(e.target.value)}
                    placeholder="e.g. Registrar, IILP"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Verification Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  >
                    <option value="VALID">VALID (Verified &amp; Active)</option>
                    <option value="REVOKED">REVOKED (Invalidated)</option>
                    <option value="EXPIRED">EXPIRED</option>
                  </select>
                </div>
              </div>

              {/* Certificate File Upload Drag & Drop */}
              <div>
                <label className="block text-xs font-bold text-[#344054] mb-1">
                  Upload Certificate Document / Image (PDF, PNG, JPG up to 50MB)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#b9e6fe] hover:border-[#00bfff] bg-[#f0f9ff]/60 hover:bg-[#f0f9ff] rounded-2xl p-6 text-center cursor-pointer transition-colors"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-white shadow-xs mx-auto flex items-center justify-center text-[#00698c] mb-2">
                    📁
                  </div>
                  <p className="text-xs font-bold text-gray-800">
                    {selectedFile ? selectedFile.name : "Click to select certificate image or PDF"}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Supports high-resolution PNG, JPG, or PDF documents
                  </p>
                </div>

                {filePreview && (
                  <div className="mt-3 flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="relative w-12 h-14 bg-white rounded-md overflow-hidden border border-gray-200 shrink-0">
                      <Image src={filePreview} alt="Preview" fill className="object-cover" />
                    </div>
                    <div className="text-xs text-gray-600">
                      <div className="font-semibold text-gray-900">Certificate Image Attached</div>
                      <div className="text-[10px] text-gray-400">Ready for digital verification viewing</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold text-[#344054] mb-1">
                  Commendation / Internal Notes
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. We commend the dedication, hard work, and valuable contributions..."
                  className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 text-xs font-bold text-white bg-[#000080] hover:bg-[#000066] rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? "Saving..." : editingCert ? "Save Changes" : "Create & Issue Certificate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Preview Lightbox Modal */}
      {previewDocUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h4 className="text-sm font-bold text-gray-900">Certificate Document Preview</h4>
              <div className="flex items-center gap-3">
                <a
                  href={previewDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#00698c] hover:underline"
                >
                  Open in New Tab
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewDocUrl(null)}
                  className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-50 rounded-xl my-2">
              <img
                src={previewDocUrl}
                alt="Certificate Document"
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deletingId)}
        title="Delete Certificate Record"
        message="Are you sure you want to delete this certificate? Once deleted, public verification lookups for this registration number will return Not Found."
        confirmLabel="Yes, Delete Record"
        isConfirming={isDeleting}
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
