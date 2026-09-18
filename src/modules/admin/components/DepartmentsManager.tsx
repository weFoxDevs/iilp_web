import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  DepartmentItem,
  fetchAdminDepartments,
  createAdminDepartment,
  updateAdminDepartment,
  deleteAdminDepartment,
} from "@/common/services/departments.service";
import { uploadMediaFile } from "@/common/services/cms.service";
import { ToastType } from "@/common/components/Toast";

interface DepartmentsManagerProps {
  token: string;
  onShowToast: (message: string, type: ToastType) => void;
}

export function DepartmentsManager({ token, onShowToast }: DepartmentsManagerProps) {
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<DepartmentItem>>({
    number: "01",
    name: "",
    code: "",
    slug: "",
    description: "",
    mission: "",
    image: "/assets/academic-thumbnail-1.png",
    hasActionButton: true,
    isHighlighted: false,
    isActive: true,
    sortOrder: 0,
    researchAreas: [],
  });
  const [researchAreasInput, setResearchAreasInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image Upload State
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);

  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<DepartmentItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadDepartments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminDepartments(token);
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      onShowToast(
        err instanceof Error ? err.message : "Failed to load academic departments",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [token, onShowToast]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const handleOpenCreate = () => {
    if (localImagePreview) URL.revokeObjectURL(localImagePreview);
    setPendingImageFile(null);
    setLocalImagePreview(null);
    setEditingId(null);
    const nextNumber = String(departments.length + 1).padStart(2, "0");
    setFormData({
      number: nextNumber,
      name: "",
      code: "",
      slug: "",
      description: "",
      mission: "",
      image: "/assets/academic-thumbnail-1.png",
      hasActionButton: true,
      isHighlighted: false,
      isActive: true,
      sortOrder: departments.length + 1,
      researchAreas: [],
    });
    setResearchAreasInput("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dept: DepartmentItem) => {
    if (localImagePreview) URL.revokeObjectURL(localImagePreview);
    setPendingImageFile(null);
    setLocalImagePreview(null);
    setEditingId(dept.id);
    setFormData({
      number: dept.number,
      name: dept.name,
      code: dept.code,
      slug: dept.slug,
      description: dept.description,
      mission: dept.mission,
      image: dept.image || "/assets/academic-thumbnail-1.png",
      hasActionButton: dept.hasActionButton ?? true,
      isHighlighted: dept.isHighlighted ?? false,
      isActive: dept.isActive ?? true,
      sortOrder: dept.sortOrder ?? 0,
      researchAreas: dept.researchAreas || [],
    });
    setResearchAreasInput((dept.researchAreas || []).join(", "));
    setIsModalOpen(true);
  };

  const handleImageFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      onShowToast("Image size must be less than 10MB", "error");
      return;
    }

    if (localImagePreview) URL.revokeObjectURL(localImagePreview);
    setPendingImageFile(file);
    setLocalImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    if (localImagePreview) URL.revokeObjectURL(localImagePreview);
    setPendingImageFile(null);
    setLocalImagePreview(null);
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData((prev) => {
      const generatedSlug = !editingId
        ? newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        : prev.slug;
      return { ...prev, name: newName, slug: generatedSlug };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      onShowToast("Department Name is required", "error");
      return;
    }
    if (!formData.code?.trim()) {
      onShowToast("Department Code is required (e.g. LAW, GOV)", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.image || "/assets/academic-thumbnail-1.png";

      if (pendingImageFile) {
        setIsUploadingImage(true);
        try {
          const uploadRes = await uploadMediaFile(token, pendingImageFile);
          finalImageUrl = uploadRes.url;
        } finally {
          setIsUploadingImage(false);
        }
      }

      const parsedResearchAreas = researchAreasInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload: Partial<DepartmentItem> = {
        ...formData,
        image: finalImageUrl,
        researchAreas: parsedResearchAreas,
      };

      if (editingId) {
        await updateAdminDepartment(token, editingId, payload);
        onShowToast("Department updated successfully", "success");
      } else {
        await createAdminDepartment(token, payload);
        onShowToast("Department created successfully", "success");
      }

      setIsModalOpen(false);
      await loadDepartments();
    } catch (err: unknown) {
      onShowToast(
        err instanceof Error ? err.message : "Failed to save department",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!departmentToDelete) return;
    setIsDeleting(true);
    try {
      await deleteAdminDepartment(token, departmentToDelete.id);
      onShowToast(`Department ${departmentToDelete.name} deleted`, "success");
      setIsDeleteDialogOpen(false);
      setDepartmentToDelete(null);
      await loadDepartments();
    } catch (err: unknown) {
      onShowToast(
        err instanceof Error ? err.message : "Failed to delete department",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredDepartments = departments.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.name?.toLowerCase().includes(q) ||
      d.code?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q) ||
      d.number?.includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00bfff]"></span>
            <h2 className="text-xl font-bold text-[#101828]">Academic Departments</h2>
            <span className="px-2 py-0.5 rounded-full bg-[#e6f9ff] text-[#00698c] text-xs font-bold border border-[#b0ebff]">
              {departments.length}
            </span>
          </div>
          <p className="text-xs text-[#4a5565] mt-1">
            Manage degree departments, research areas, and display order across the public website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff] w-48 sm:w-60"
          />

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-[#00bfff] hover:bg-[#00a6e0] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Department
          </button>
        </div>
      </div>

      {/* Grid listing */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#e5e7eb]">
          <div className="w-8 h-8 border-3 border-[#00bfff] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-[#4a5565]">Loading academic departments...</p>
        </div>
      ) : filteredDepartments.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[#d0d5dd]">
          <div className="w-12 h-12 rounded-full bg-[#e6f9ff] text-[#00698c] flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#101828]">No Departments Found</h3>
          <p className="text-xs text-[#4a5565] max-w-sm mx-auto mt-1 mb-4">
            {searchQuery ? "No department matches your search filter." : "Get started by adding the first academic department."}
          </p>
          <button
            onClick={handleOpenCreate}
            className="bg-[#00bfff] hover:bg-[#00a6e0] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Create Department
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden shadow-xs hover:border-[#b0ebff] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Image Header */}
                <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
                  <Image
                    src={dept.image || "/assets/academic-thumbnail-1.png"}
                    alt={dept.name}
                    fill
                    className="object-cover"
                  />
                  {/* Number Badge */}
                  <div
                    className={`absolute top-3 left-3 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow-md ${
                      dept.isHighlighted
                        ? "bg-[#00bfff] text-white"
                        : "bg-white/90 backdrop-blur-xs text-[#00698c]"
                    }`}
                  >
                    {dept.number}
                  </div>

                  {/* Code Tag */}
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono font-bold">
                    {dept.code}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        dept.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      {dept.isActive ? "Active" : "Inactive Draft"}
                    </span>
                    {dept.isHighlighted && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                        ★ Highlighted
                      </span>
                    )}
                    <span className="text-[11px] text-gray-400 font-mono">
                      Order: {dept.sortOrder}
                    </span>
                  </div>

                  <h3 className="font-playfair font-bold text-lg text-[#101828] line-clamp-1">
                    {dept.name}
                  </h3>

                  <p className="text-xs text-[#4a5565] leading-relaxed line-clamp-2">
                    {dept.description || "No description provided."}
                  </p>

                  {/* Research Areas */}
                  {Array.isArray(dept.researchAreas) && dept.researchAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {dept.researchAreas.slice(0, 3).map((ra, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#f1f5f9] text-[#334155] text-[10px] font-medium"
                        >
                          {ra}
                        </span>
                      ))}
                      {dept.researchAreas.length > 3 && (
                        <span className="text-[10px] text-gray-400 self-center">
                          +{dept.researchAreas.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-4 bg-[#f9fafb] border-t border-[#e5e7eb] flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-mono truncate max-w-[140px]">
                  /{dept.slug}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(dept)}
                    className="p-1.5 rounded-lg border border-[#d0d5dd] hover:bg-white text-[#344054] hover:text-[#00698c] transition-colors cursor-pointer"
                    title="Edit Department"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => {
                      setDepartmentToDelete(dept);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-500 transition-colors cursor-pointer"
                    title="Delete Department"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-[#e5e7eb] my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e7eb] mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00bfff]"></span>
                <h3 className="text-lg font-bold text-[#101828]">
                  {editingId ? "Edit Department" : "Create New Academic Department"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Row 1: Number, Code, Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Display Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.number || ""}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="01"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Short Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code || ""}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="LAW"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs font-mono text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Sort Order Priority
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder ?? 0}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>
              </div>

              {/* Row 2: Name & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={handleNameChange}
                    placeholder="Law & International Legal Studies"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                    placeholder="law-international-legal-studies"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs font-mono text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>
              </div>

              {/* Overview Description */}
              <div>
                <label className="block text-xs font-bold text-[#344054] mb-1">
                  Overview Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Advancing legal scholarship, international law, and justice systems in a changing global order."
                  className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                />
              </div>

              {/* Mission Statement */}
              <div>
                <label className="block text-xs font-bold text-[#344054] mb-1">
                  Mission Statement
                </label>
                <textarea
                  rows={2}
                  value={formData.mission || ""}
                  onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                  placeholder="To foster advanced legal scholarship and train global leaders in international legal jurisprudence."
                  className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                />
              </div>

              {/* Research Areas */}
              <div>
                <label className="block text-xs font-bold text-[#344054] mb-1">
                  Research Areas (comma-separated)
                </label>
                <input
                  type="text"
                  value={researchAreasInput}
                  onChange={(e) => setResearchAreasInput(e.target.value)}
                  placeholder="International Law, Human Rights, Trade & Corporate Law"
                  className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                />
              </div>

              {/* Banner Image & Upload */}
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#1e293b]">
                    Thumbnail / Card Photo
                  </label>
                  {(formData.image || pendingImageFile) && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-[11px] font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      Remove photo
                    </button>
                  )}
                </div>

                {/* Live Preview */}
                {(localImagePreview || formData.image) && (
                  <div className="relative mb-3 rounded-xl overflow-hidden border border-[#e2e8f0] bg-[#f1f5f9] h-28 flex items-center justify-center">
                    <img
                      src={localImagePreview || formData.image || undefined}
                      alt="Department Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-[#00bfff] bg-white hover:bg-[#f0f9ff] text-[#008cb3] text-xs font-medium cursor-pointer transition-all">
                    <span>{pendingImageFile ? "Change File" : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileSelected}
                      className="hidden"
                    />
                  </label>

                  <input
                    type="text"
                    value={formData.image || ""}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/assets/academic-thumbnail-1.png"
                    className="flex-1 bg-white border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#00bfff] rounded-sm focus:ring-[#00bfff]"
                  />
                  <span className="text-xs font-bold text-[#344054]">Active &amp; Published</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isHighlighted ?? false}
                    onChange={(e) => setFormData({ ...formData, isHighlighted: e.target.checked })}
                    className="w-4 h-4 text-[#00bfff] rounded-sm focus:ring-[#00bfff]"
                  />
                  <span className="text-xs font-bold text-[#344054]">Highlighted Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasActionButton ?? true}
                    onChange={(e) => setFormData({ ...formData, hasActionButton: e.target.checked })}
                    className="w-4 h-4 text-[#00bfff] rounded-sm focus:ring-[#00bfff]"
                  />
                  <span className="text-xs font-bold text-[#344054]">Show Card Arrow</span>
                </label>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5e7eb]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#344054] hover:bg-[#f3f4f6] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="bg-[#00bfff] hover:bg-[#00a6e0] text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Save Changes" : "Create Department"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && departmentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#e5e7eb]">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#101828] text-center mb-2">Delete Department</h3>
            <p className="text-xs text-[#4a5565] text-center mb-6">
              Are you sure you want to delete <strong>{departmentToDelete.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-[#344054] hover:bg-[#f3f4f6] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
