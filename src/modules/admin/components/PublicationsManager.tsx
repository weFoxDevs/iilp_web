import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  fetchAdminPublications,
  createAdminPublication,
  updateAdminPublication,
  deleteAdminPublication,
  PublicationItem,
} from "@/common/services/publications.service";
import { uploadMediaFile } from "@/common/services/cms.service";
import { ToastType } from "@/common/components/Toast";
import ConfirmationModal from "./ConfirmationModal";

interface PublicationsManagerProps {
  token: string;
  onShowToast: (message: string, type: ToastType) => void;
}

const CATEGORY_OPTIONS = [
  "All Publications",
  "Policy Briefs",
  "Research Papers",
  "Working Papers",
  "Research Reports",
  "Discussion Papers",
  "Book Reviews",
  "Case Studies",
  "Research Repository",
];

export function PublicationsManager({ token, onShowToast }: PublicationsManagerProps) {
  const [publications, setPublications] = useState<PublicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Publications");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<PublicationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState<Partial<PublicationItem>>({
    title: "",
    slug: "",
    category: "Policy Briefs",
    field: "Refugee & Displacement Studies",
    publicationDate: "August 2026",
    description: "",
    authorName: "IILP Team",
    authorRole: "Author",
    authorInitials: "MM",
    image: "/assets/department-faculty-member.png",
    highlighted: false,
    overview: "",
    purpose: "",
    researchAreas: [],
    documentUrl: "",
    sortOrder: 0,
    isActive: true,
  });

  const [newAreaInput, setNewAreaInput] = useState("");

  // Media upload state
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const onShowToastRef = useRef(onShowToast);
  useEffect(() => {
    onShowToastRef.current = onShowToast;
  }, [onShowToast]);

  const loadPublications = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminPublications(token, {
        category: categoryFilter !== "All Publications" ? categoryFilter : undefined,
        search: searchQuery.trim() || undefined,
      });
      setPublications(data);
    } catch (err: unknown) {
      onShowToastRef.current(
        err instanceof Error ? err.message : "Failed to load publications",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [token, categoryFilter, searchQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPublications();
  }, [loadPublications]);

  const closeModal = () => {
    if (localImagePreview) {
      URL.revokeObjectURL(localImagePreview);
    }
    setPendingImageFile(null);
    setLocalImagePreview(null);
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      category: "Policy Briefs",
      field: "Refugee & Displacement Studies",
      publicationDate: "August 2026",
      description: "",
      authorName: "IILP Team",
      authorRole: "Author",
      authorInitials: "MM",
      image: "/assets/department-faculty-member.png",
      highlighted: false,
      overview: "",
      purpose: "",
      researchAreas: [
        "Provide strategic advice on institutional growth and long-term development.",
        "Support the advancement of academic excellence and research quality.",
        "Strengthen the Institute's international reputation and visibility.",
      ],
      documentUrl: "",
      sortOrder: publications.length,
      isActive: true,
    });
    setPendingImageFile(null);
    setLocalImagePreview(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PublicationItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      slug: item.slug,
      category: item.category,
      field: item.field,
      publicationDate: item.publicationDate,
      description: item.description,
      authorName: item.authorName,
      authorRole: item.authorRole,
      authorInitials: item.authorInitials,
      image: item.image,
      highlighted: item.highlighted,
      overview: item.overview || "",
      purpose: item.purpose || "",
      researchAreas: Array.isArray(item.researchAreas) ? [...item.researchAreas] : [],
      documentUrl: item.documentUrl || "",
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true,
    });
    setPendingImageFile(null);
    setLocalImagePreview(null);
    setIsModalOpen(true);
  };

  const handleSlugify = () => {
    if (!formData.title) return;
    const generated = formData.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
    setFormData((prev) => ({ ...prev, slug: generated }));
  };

  const handleAuthorInitials = (name: string) => {
    const initials = name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
    setFormData((prev) => ({
      ...prev,
      authorName: name,
      authorInitials: initials || "MM",
    }));
  };

  const handleAddArea = () => {
    if (!newAreaInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      researchAreas: [...(prev.researchAreas || []), newAreaInput.trim()],
    }));
    setNewAreaInput("");
  };

  const handleRemoveArea = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      researchAreas: (prev.researchAreas || []).filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPendingImageFile(file);
      setLocalImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      onShowToast("Publication title is required", "error");
      return;
    }
    if (!formData.description?.trim()) {
      onShowToast("Description / Abstract is required", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.image || "/assets/department-faculty-member.png";

      if (pendingImageFile) {
        setIsUploadingImage(true);
        try {
          const uploadRes = await uploadMediaFile(token, pendingImageFile);
          finalImageUrl = uploadRes.url;
        } catch {
          onShowToast("Image upload failed, saving with existing URL", "info");
        } finally {
          setIsUploadingImage(false);
        }
      }

      const payload = {
        ...formData,
        image: finalImageUrl,
      };

      if (editingId) {
        await updateAdminPublication(token, editingId, payload);
        onShowToast("Publication updated successfully", "success");
      } else {
        await createAdminPublication(token, payload);
        onShowToast("Publication created successfully", "success");
      }

      closeModal();
      loadPublications();
    } catch (err: unknown) {
      onShowToast(
        err instanceof Error ? err.message : "Failed to save publication",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteAdminPublication(token, deleteTarget.id);
      onShowToast("Publication deleted successfully", "success");
      setPublications((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: unknown) {
      onShowToast(
        err instanceof Error ? err.message : "Failed to delete publication",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (item: PublicationItem) => {
    try {
      const updated = await updateAdminPublication(token, item.id, {
        isActive: !item.isActive,
      });
      setPublications((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, isActive: updated.isActive } : p))
      );
      onShowToast(
        `Publication is now ${updated.isActive ? "Active (Public)" : "Draft (Hidden)"}`,
        "info"
      );
    } catch (err: unknown) {
      onShowToast(
        err instanceof Error ? err.message : "Failed to toggle status",
        "error"
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-gray-100">
        <div>
          <h2 className="text-xl font-serif font-bold text-gray-900">
            Research Publications Repository
          </h2>
          <p className="text-sm text-gray-500 font-sans">
            Manage research papers, policy briefs, reports, and monographs displayed on the Research &amp; Publications page.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00bfff] hover:bg-[#009ecc] text-white font-sans font-semibold text-sm rounded-xl shadow-xs transition-colors shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Publication
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORY_OPTIONS.slice(0, 5).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? "bg-[#1e2939] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
          {/* Dropdown for remaining categories if needed */}
          <select
            value={CATEGORY_OPTIONS.slice(5).includes(categoryFilter) ? categoryFilter : ""}
            onChange={(e) => {
              if (e.target.value) setCategoryFilter(e.target.value);
            }}
            className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1.5 border-none outline-none font-semibold"
          >
            <option value="">More categories...</option>
            {CATEGORY_OPTIONS.slice(5).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <input
            type="text"
            placeholder="Search by title, author, field..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00bfff]/20 focus:border-[#00bfff]"
          />
          <svg
            className="absolute left-3 top-2.5 text-gray-400 w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Publications List */}
      {isLoading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="w-8 h-8 border-3 border-[#00bfff] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-sans">Loading publications repository...</p>
        </div>
      ) : publications.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-sky-50 text-[#00698c] flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <h3 className="font-serif font-bold text-gray-800 text-lg">No Publications Found</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            {searchQuery || categoryFilter !== "All Publications"
              ? "No items match your search or filter criteria. Try adjusting the query."
              : "No research publications created yet. Click 'Add Publication' to add your first scholarly work."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {publications.map((pub) => (
            <div
              key={pub.id}
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
                pub.isActive ? "border-gray-200" : "border-gray-200 opacity-60 bg-gray-50/50"
              }`}
            >
              {/* Image banner */}
              <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden">
                <Image
                  src={pub.image || "/assets/department-faculty-member.png"}
                  alt={pub.title}
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="bg-white/90 backdrop-blur-xs text-[#00698c] font-bold text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                    {pub.category}
                  </span>
                  {pub.highlighted && (
                    <span className="bg-[#00bfff] text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      Featured
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(pub)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs transition-colors ${
                      pub.isActive
                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                        : "bg-gray-700 text-gray-200 hover:bg-gray-800"
                    }`}
                  >
                    {pub.isActive ? "Active" : "Draft"}
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{pub.field}</span>
                    <span>·</span>
                    <span>{pub.publicationDate}</span>
                  </div>

                  <h3 className="font-serif font-bold text-gray-900 text-base leading-snug line-clamp-2">
                    {pub.title}
                  </h3>

                  <p className="text-xs text-gray-600 font-sans line-clamp-2 leading-relaxed">
                    {pub.description}
                  </p>
                </div>

                {/* Footer with Author and Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#000080] to-[#00bfff] text-white flex items-center justify-center text-xs font-bold font-serif">
                      {pub.authorInitials || "MM"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-800 leading-tight">
                        {pub.authorName}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {pub.authorRole}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={pub.slug ? `/publications/${encodeURIComponent(pub.slug)}` : `/publication-details?id=${encodeURIComponent(pub.id)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-[#00698c] hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                      title="View Live Publication"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(pub)}
                      className="p-2 text-gray-600 hover:text-[#00698c] hover:bg-sky-50 rounded-lg transition-colors"
                      title="Edit Publication"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(pub)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Publication"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0 bg-white">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00698c]" />
                  <h3 className="text-base font-bold text-[#0a0d12]">
                    {editingId ? "Edit Research Publication" : "Create Research Publication"}
                  </h3>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 ml-4.5">
                  {editingId
                    ? "Update publication metadata, author information, and research content."
                    : "Add a new paper, brief, or scholarly article to the repository."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto modal-scroll p-6 space-y-4 text-xs">
                {/* Title & Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Publication Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title || ""}
                      onChange={(e) => {
                        const newTitle = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          title: newTitle,
                          slug: !editingId && !prev.slug
                            ? newTitle.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-")
                            : prev.slug,
                        }));
                      }}
                      placeholder="e.g. Refugee Protection in a Fragmented Global Order"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#00698c] outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-700">Slug (URL identifier)</label>
                      <button
                        type="button"
                        onClick={handleSlugify}
                        className="text-[10px] text-[#00698c] hover:underline font-semibold cursor-pointer"
                      >
                        Auto-generate
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formData.slug || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="e.g. refugee-protection-in-a-fragmented-global-order"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 font-mono focus:border-[#00698c] outline-hidden"
                    />
                  </div>
                </div>

                {/* Category, Field, Date */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Category *</label>
                    <select
                      value={formData.category || "Policy Briefs"}
                      onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#00698c] outline-hidden bg-white"
                    >
                      {CATEGORY_OPTIONS.filter((c) => c !== "All Publications").map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Research Field</label>
                    <input
                      type="text"
                      value={formData.field || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, field: e.target.value }))}
                      placeholder="e.g. Refugee & Displacement Studies"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#00698c] outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Publication Date</label>
                    <input
                      type="text"
                      value={formData.publicationDate || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, publicationDate: e.target.value }))}
                      placeholder="e.g. August 2026"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#00698c] outline-hidden"
                    />
                  </div>
                </div>

                {/* Abstract / Summary */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Summary / Abstract (Card snippet) *</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.description || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief 1-2 sentence description displayed on repository cards..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#00698c] outline-hidden"
                  />
                </div>

                {/* Author Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Author Name</label>
                    <input
                      type="text"
                      value={formData.authorName || ""}
                      onChange={(e) => handleAuthorInitials(e.target.value)}
                      placeholder="e.g. IILP Team or Dr. John Doe"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#00698c] outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Author Role</label>
                    <input
                      type="text"
                      value={formData.authorRole || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, authorRole: e.target.value }))}
                      placeholder="e.g. Author or Lead Researcher"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#00698c] outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Author Initials</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={formData.authorInitials || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, authorInitials: e.target.value.toUpperCase() }))}
                      placeholder="MM"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 font-mono uppercase focus:border-[#00698c] outline-hidden"
                    />
                  </div>
                </div>

                {/* Cover Image Upload / URL */}
                <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="text-xs font-bold text-gray-700">Cover / Featured Image</label>
                  <div className="flex items-center gap-4">
                    {(localImagePreview || formData.image) && (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-white shrink-0">
                        <Image
                          src={localImagePreview || formData.image || "/assets/department-faculty-member.png"}
                          alt="Preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5 flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#e6f9ff] file:text-[#00698c] hover:file:bg-[#cbf2ff] cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.image || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                        placeholder="Or enter image URL path..."
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:border-[#00698c] outline-hidden bg-white"
                      />
                      <p className="text-[10px] text-gray-500">
                        Uploads directly to storage. PNG, JPG, or WebP. Max 15MB.
                      </p>
                    </div>

                    {(localImagePreview || formData.image) && (
                      <button
                        type="button"
                        onClick={() => {
                          setLocalImagePreview(null);
                          setPendingImageFile(null);
                          setFormData((prev) => ({ ...prev, image: "" }));
                        }}
                        className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Details Page Overview & Purpose Section */}
                <div className="space-y-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#00698c]" />
                      <h4 className="text-xs font-bold text-gray-800">
                        Details Page Content (Shown when card is clicked)
                      </h4>
                    </div>
                    <span className="text-[10px] text-gray-400">Public research view</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Detailed Overview / Research Body</label>
                    <textarea
                      rows={3}
                      value={formData.overview || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, overview: e.target.value }))}
                      placeholder="Full research paper overview or introduction..."
                      className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-gray-300 focus:border-[#00698c] outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Purpose / Department Mission</label>
                    <textarea
                      rows={2}
                      value={formData.purpose || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, purpose: e.target.value }))}
                      placeholder="Purpose statement..."
                      className="w-full px-3 py-2 text-xs bg-white rounded-lg border border-gray-300 focus:border-[#00698c] outline-hidden"
                    />
                  </div>

                  {/* Research Areas tags */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Key Research Areas / Focus Points</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newAreaInput}
                        onChange={(e) => setNewAreaInput(e.target.value)}
                        placeholder="Add a research focus point (press Enter)..."
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:border-[#00698c] outline-hidden"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddArea();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddArea}
                        className="px-3 py-1.5 bg-[#00698c] hover:bg-[#00506b] text-white rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Add
                      </button>
                    </div>

                    {formData.researchAreas && formData.researchAreas.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {formData.researchAreas.map((area, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-gray-200 text-xs text-gray-700 shadow-2xs"
                          >
                            <span>• {area}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveArea(idx)}
                              className="text-gray-400 hover:text-red-500 font-bold ml-1 cursor-pointer"
                            >
                              ✕
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* External Document Link, Sort Order, Flags */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">External PDF / Paper Link</label>
                    <input
                      type="text"
                      value={formData.documentUrl || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, documentUrl: e.target.value }))}
                      placeholder="https://example.com/paper.pdf"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#00698c] outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Display Order</label>
                    <input
                      type="number"
                      value={formData.sortOrder ?? 0}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, sortOrder: parseInt(e.target.value, 10) || 0 }))
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#00698c] outline-hidden"
                    />
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.highlighted || false}
                        onChange={(e) => setFormData((prev) => ({ ...prev, highlighted: e.target.checked }))}
                        className="w-4 h-4 rounded text-[#00698c] focus:ring-[#00698c]"
                      />
                      <span className="text-xs font-bold text-gray-700">Featured</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive ?? true}
                        onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-600"
                      />
                      <span className="text-xs font-bold text-gray-700">Active</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-[#fcfdff] shrink-0">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#00698c] hover:bg-[#00506b] rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting || isUploadingImage ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Publication...</span>
                    </>
                  ) : editingId ? (
                    "Update Publication"
                  ) : (
                    "Create Publication"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteTarget}
        title="Delete Publication"
        message={
          <>
            Are you sure you want to delete the publication{" "}
            <strong className="text-gray-900 font-semibold">{deleteTarget?.title}</strong>? This action cannot be undone.
          </>
        }
        confirmLabel="Confirm Delete"
        cancelLabel="Cancel"
        isConfirming={isDeleting}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
