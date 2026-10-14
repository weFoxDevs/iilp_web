import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  fetchAdminLeadershipMembers,
  createAdminLeadershipMember,
  updateAdminLeadershipMember,
  deleteAdminLeadershipMember,
  LeadershipMemberItem,
  LEADERSHIP_TYPES,
  getLeadershipTypeConfig,
} from "@/common/services/leadership.service";
import { uploadMediaFile } from "@/common/services/cms.service";
import { ToastType } from "@/common/components/Toast";
import ConfirmationModal from "./ConfirmationModal";
import { RichTextEditor } from "./RichTextEditor";

interface LeadershipManagerProps {
  token: string;
  onShowToast: (message: string, type: ToastType) => void;
}

export function LeadershipManager({ token, onShowToast }: LeadershipManagerProps) {
  const [members, setMembers] = useState<LeadershipMemberItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // 9 members per page (3x3 grid)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete Confirmation State
  const [memberToDelete, setMemberToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<Partial<LeadershipMemberItem>>({
    name: "",
    role: "Vice President",
    type: "founding-members",
    initials: "",
    image: "/assets/governance-founding-member.png",
    about: "",
    accountabilityFunctions: [],
    sortOrder: 0,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null);
  const [localPhotoPreview, setLocalPhotoPreview] = useState<string | null>(null);

  const onShowToastRef = useRef(onShowToast);
  useEffect(() => {
    onShowToastRef.current = onShowToast;
  }, [onShowToast]);

  const loadMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminLeadershipMembers(token);
      setMembers(data);
    } catch (err: unknown) {
      onShowToastRef.current(err instanceof Error ? err.message : "Failed to load leadership members", "error");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMembers();
  }, [loadMembers]);

  const closeModal = () => {
    if (localPhotoPreview) {
      URL.revokeObjectURL(localPhotoPreview);
    }
    setPendingPhotoFile(null);
    setLocalPhotoPreview(null);
    setIsModalOpen(false);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: "",
      role: "Vice President",
      type: "founding-members",
      initials: "",
      image: "/assets/governance-founding-member.png",
      about: "",
      accountabilityFunctions: [],
      sortOrder: members.length,
      isActive: true,
    });
    setPendingPhotoFile(null);
    setLocalPhotoPreview(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: LeadershipMemberItem) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      role: item.role,
      type: item.type || "founding-members",
      initials: item.initials || "",
      image: item.image || "/assets/governance-founding-member.png",
      about: item.about || "",
      accountabilityFunctions: Array.isArray(item.accountabilityFunctions)
        ? [...item.accountabilityFunctions]
        : [],
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true,
    });
    setPendingPhotoFile(null);
    setLocalPhotoPreview(null);
    setIsModalOpen(true);
  };

  const handlePhotoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      onShowToast("Image file must be less than 10MB", "error");
      return;
    }

    if (localPhotoPreview) {
      URL.revokeObjectURL(localPhotoPreview);
    }

    setPendingPhotoFile(file);
    setLocalPhotoPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleRemovePhoto = () => {
    if (localPhotoPreview) {
      URL.revokeObjectURL(localPhotoPreview);
    }
    setPendingPhotoFile(null);
    setLocalPhotoPreview(null);
    setFormData((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => {
      const computedInitials = name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      return {
        ...prev,
        name,
        initials: prev.initials && prev.initials !== computedInitials ? prev.initials : computedInitials,
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      onShowToast("Member name is required", "error");
      return;
    }
    if (!formData.role?.trim()) {
      onShowToast("Role/Title is required", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.image || "/assets/governance-founding-member.png";

      if (pendingPhotoFile) {
        setIsUploadingPhoto(true);
        try {
          const res = await uploadMediaFile(token, pendingPhotoFile, "leadership");
          finalImageUrl = res.url;
        } finally {
          setIsUploadingPhoto(false);
        }
      }

      const payload: Partial<LeadershipMemberItem> = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        type: formData.type || "founding-members",
        initials: formData.initials?.trim() || undefined,
        image: finalImageUrl,
        about: formData.about?.trim() || undefined,
        accountabilityFunctions: (formData.accountabilityFunctions || []).filter(Boolean),
        sortOrder: Number(formData.sortOrder) || 0,
        isActive: formData.isActive ?? true,
      };

      if (editingId) {
        await updateAdminLeadershipMember(token, editingId, payload);
        onShowToast("Leadership member updated successfully!", "success");
      } else {
        await createAdminLeadershipMember(token, payload);
        onShowToast("New leadership member added successfully!", "success");
      }

      closeModal();
      loadMembers();
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to save member", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;

    setIsDeleting(true);
    try {
      await deleteAdminLeadershipMember(token, memberToDelete.id);
      onShowToast("Leadership member deleted successfully", "success");
      setMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));
      setMemberToDelete(null);
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to delete member", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (item: LeadershipMemberItem) => {
    try {
      const updated = await updateAdminLeadershipMember(token, item.id, {
        isActive: !item.isActive,
      });
      setMembers((prev) => prev.map((m) => (m.id === item.id ? updated : m)));
      onShowToast(
        `Member marked as ${updated.isActive ? "active" : "hidden"}`,
        "info"
      );
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to update status", "error");
    }
  };

  // Filtered members list
  const roles = Array.from(new Set(members.map((m) => m.role))).filter(Boolean);
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.type && m.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.about && m.about.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === "all" || m.role === roleFilter;
    const matchesType = typeFilter === "all" || (m.type || "founding-members") === typeFilter;
    return matchesSearch && matchesRole && matchesType;
  });

  // Reset page when filter or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, typeFilter, pageSize]);

  // Paginated members slice
  const totalFiltered = filteredMembers.length;
  const effectivePageSize = pageSize === 0 ? totalFiltered || 1 : pageSize;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / effectivePageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedMembers =
    pageSize === 0
      ? filteredMembers
      : filteredMembers.slice((safePage - 1) * effectivePageSize, safePage * effectivePageSize);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Leadership Directory Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage officers, deans, vice presidents, and founding members displayed on the Leadership Directory page.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={loadMembers}
            disabled={isLoading}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition cursor-pointer"
            title="Refresh list"
          >
            <svg className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00698c] hover:bg-[#00506b] text-white font-medium rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Leader</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, or bio..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:bg-white focus:outline-hidden focus:border-[#00698c]"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Body / Tier:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-hidden focus:border-[#00698c]"
            >
              <option value="all">All Bodies ({members.length})</option>
              {LEADERSHIP_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({members.filter((m) => (m.type || "founding-members") === t.id).length})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:bg-white focus:outline-hidden focus:border-[#00698c]"
            >
              <option value="all">All Roles ({members.length})</option>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r} ({members.filter((m) => m.role === r).length})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Members Grid / Cards */}
      {isLoading ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-[#00698c] border-t-transparent rounded-full mb-2"></div>
          <p className="text-sm">Loading leadership directory...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
          <p className="text-base font-semibold text-gray-700">No leadership members found</p>
          <p className="text-sm text-gray-500 mt-1">
            {searchQuery || roleFilter !== "all"
              ? "Try adjusting your search query or role filter."
              : "Click '+ Add Leader' above to register the first leadership profile."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedMembers.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between shadow-xs hover:shadow-md ${
                item.isActive ? "border-gray-200" : "border-gray-200 opacity-60 bg-gray-50/50"
              }`}
            >
              <div>
                {/* Card Top: Photo, Name, Badge, Status */}
                <div className="flex items-start gap-4">
                  <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#00698c] text-white font-bold text-lg font-mono">
                        {item.initials || "LP"}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-[#00698c] border border-sky-200">
                          {getLeadershipTypeConfig(item.type).badge}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#e6f9ff] text-[#00506b] border border-[#b0ebff]">
                          {item.role}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition ${
                          item.isActive
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                        title="Click to toggle visibility"
                      >
                        {item.isActive ? "Active" : "Hidden"}
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 mt-1 truncate" title={item.name}>
                      {item.name}
                    </h3>
                    {item.initials && (
                      <p className="text-xs text-gray-400 font-mono">Initials: {item.initials}</p>
                    )}
                  </div>
                </div>

                {/* Bio Snippet */}
                {item.about && (
                  <p className="text-xs text-gray-600 mt-3 line-clamp-2 leading-relaxed">
                    {item.about}
                  </p>
                )}

                {/* Functions Count */}
                {Array.isArray(item.accountabilityFunctions) && item.accountabilityFunctions.length > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#00698c] font-medium">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{item.accountabilityFunctions.length} Accountability Functions</span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                <span className="text-xs font-mono text-gray-400">Order: #{item.sortOrder}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    title="Edit Member"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setMemberToDelete({ id: item.id, name: item.name })}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    title="Delete Member"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {!isLoading && totalFiltered > 0 && (
        <div className="bg-white px-5 py-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <span>
              Showing{" "}
              <span className="font-bold text-gray-900">
                {totalFiltered === 0 ? 0 : (safePage - 1) * effectivePageSize + 1}
              </span>
              {" – "}
              <span className="font-bold text-gray-900">
                {Math.min(safePage * effectivePageSize, totalFiltered)}
              </span>{" "}
              of <span className="font-bold text-gray-900">{totalFiltered}</span> leaders
            </span>

            <div className="flex items-center gap-1.5 pl-3 border-l border-gray-200">
              <label htmlFor="per-page-select" className="text-gray-500">Per page:</label>
              <select
                id="per-page-select"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-800 font-semibold focus:bg-white focus:outline-hidden focus:border-[#00698c] cursor-pointer"
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={0}>All</option>
              </select>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 7) return true;
                    if (p === 1 || p === totalPages) return true;
                    if (Math.abs(p - safePage) <= 1) return true;
                    return false;
                  })
                  .reduce<Array<number | string>>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                      acc.push(`dots-${p}`);
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item) => {
                    if (typeof item === "string") {
                      return (
                        <span key={item} className="px-2 text-xs text-gray-400">
                          …
                        </span>
                      );
                    }
                    const num = item;
                    const isActive = safePage === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCurrentPage(num)}
                        className={`min-w-8 h-8 px-2.5 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                          isActive
                            ? "bg-[#00698c] text-white shadow-xs"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
              </div>

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
              >
                <span>Next</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal: Add or Edit Leadership Member */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-gray-100 my-8">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-gray-900 text-lg">
                {editingId ? "Edit Leadership Profile" : "Add New Leadership Profile"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition cursor-pointer p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form
              onSubmit={handleSave}
              data-lenis-prevent="true"
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto modal-scroll"
            >
              {/* Name & Initials */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Mohammed Siraj"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-hidden focus:border-[#00698c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Initials
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    value={formData.initials || ""}
                    onChange={(e) => setFormData({ ...formData, initials: e.target.value.toUpperCase() })}
                    placeholder="MS"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-mono focus:outline-hidden focus:border-[#00698c]"
                  />
                </div>
              </div>

              {/* Governance Body / Leadership Type */}
              <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#00506b] uppercase tracking-wider">
                    Governance Body / Leadership Type *
                  </label>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-[#00698c] border border-sky-200">
                    {getLeadershipTypeConfig(formData.type).badge}
                  </span>
                </div>
                <select
                  value={formData.type || "founding-members"}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-sky-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:border-[#00698c] focus:ring-2 focus:ring-[#00698c]/20"
                >
                  {LEADERSHIP_TYPES.map((tier) => (
                    <option key={tier.id} value={tier.id}>
                      {tier.title} — ({tier.subtitle})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-600 mt-1.5 leading-normal">
                  Determines which dedicated governance body and page this leader appears under on the website (e.g. Founding Authority, Board of Founding Members, Governing Council, etc.).
                </p>
              </div>

              {/* Role & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Role / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role || ""}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Vice President, Founding Member, Dean"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-hidden focus:border-[#00698c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder ?? 0}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-hidden focus:border-[#00698c]"
                  />
                </div>
              </div>

              {/* Photo Upload & Preview */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-200 border border-gray-300 shrink-0">
                    {localPhotoPreview || formData.image ? (
                      <img
                        src={localPhotoPreview || formData.image || ""}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-gray-400 text-center flex items-center justify-center h-full">No photo</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 bg-[#00698c] hover:bg-[#00506b] text-white text-xs font-semibold rounded-lg cursor-pointer transition">
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoSelected}
                        />
                      </label>
                      {(localPhotoPreview || formData.image) && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={formData.image || ""}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="/assets/governance-founding-member.png or https://..."
                      className="w-full px-2.5 py-1 text-xs font-mono bg-white border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#00698c]"
                    />
                  </div>
                </div>
              </div>

              {/* About / Bio – Rich Text Editor */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  About / Bio (Detailed Profile Overview)
                  <span className="ml-1.5 font-normal text-gray-400 capitalize">
                    (Rich Text Editor)
                  </span>
                </label>
                <RichTextEditor
                  value={formData.about || ""}
                  onChange={(html) =>
                    setFormData((prev) => ({ ...prev, about: html }))
                  }
                  placeholder="The Vice President supports the President in providing institutional leadership..."
                  minHeight={220}
                />
              </div>

              {/* Dynamic Accountability Functions */}
              <div className="bg-[#f0f9ff] border border-[#bae6fd] p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#0369a1] uppercase tracking-wider">
                    Accountability Functions ({formData.accountabilityFunctions?.length || 0})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        accountabilityFunctions: [...(prev.accountabilityFunctions || []), ""],
                      }));
                    }}
                    className="px-2.5 py-1 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold rounded-lg shadow-2xs transition cursor-pointer"
                  >
                    + Add Function
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(formData.accountabilityFunctions || []).map((fn, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-md bg-white text-[#0369a1] border border-[#bae6fd] flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={fn}
                        onChange={(e) => {
                          const updated = [...(formData.accountabilityFunctions || [])];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, accountabilityFunctions: updated });
                        }}
                        placeholder="e.g. Represents the Institute nationally and internationally..."
                        className="flex-1 px-2.5 py-1 text-xs bg-white border border-gray-300 rounded-lg focus:outline-hidden focus:border-[#0284c7]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(formData.accountabilityFunctions || [])];
                          updated.splice(idx, 1);
                          setFormData({ ...formData, accountabilityFunctions: updated });
                        }}
                        className="p-1 text-red-500 hover:text-red-700 cursor-pointer mt-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {(formData.accountabilityFunctions || []).length === 0 && (
                    <p className="text-xs text-gray-400 italic">No functions added. (Optional, click "+ Add Function" to include responsibilities)</p>
                  )}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive ?? true}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#00698c] rounded focus:ring-0 cursor-pointer"
                />
                <label htmlFor="isActiveToggle" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Display this member on the public website (Active)
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingPhoto}
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#00698c] hover:bg-[#00506b] rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting || isUploadingPhoto ? "Saving..." : editingId ? "Save Changes" : "Add Leader"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!memberToDelete}
        title="Delete Leadership Profile"
        message={
          <>
            Are you sure you want to delete <strong className="text-gray-900 font-semibold">{memberToDelete?.name}</strong> from the Leadership Directory? This action cannot be undone.
          </>
        }
        confirmLabel="Confirm Delete"
        cancelLabel="Cancel"
        isConfirming={isDeleting}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setMemberToDelete(null)}
      />
    </div>
  );
}
