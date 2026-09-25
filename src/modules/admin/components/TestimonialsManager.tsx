import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  fetchAdminTestimonials,
  createAdminTestimonial,
  updateAdminTestimonial,
  deleteAdminTestimonial,
  uploadMediaFile,
  TestimonialItem,
} from "@/common/services/cms.service";
import { ToastType } from "@/common/components/Toast";
import ConfirmationModal from "./ConfirmationModal";

interface TestimonialsManagerProps {
  token: string;
  onShowToast: (message: string, type: ToastType) => void;
}

export function TestimonialsManager({ token, onShowToast }: TestimonialsManagerProps) {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<TestimonialItem>>({
    authorName: "",
    authorTitle: "",
    institution: "",
    quote: "",
    avatarUrl: "/assets/testimonial-avatar.png",
    sortOrder: 0,
    isPublished: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Delete Confirmation State
  const [testimonialToDelete, setTestimonialToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [localAvatarPreview, setLocalAvatarPreview] = useState<string | null>(null);

  const closeTestimonialModal = () => {
    if (localAvatarPreview) {
      URL.revokeObjectURL(localAvatarPreview);
    }
    setPendingAvatarFile(null);
    setLocalAvatarPreview(null);
    setIsModalOpen(false);
  };

  const handleAvatarSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      onShowToast("Avatar image must be less than 10MB", "error");
      return;
    }

    if (localAvatarPreview) {
      URL.revokeObjectURL(localAvatarPreview);
    }

    setPendingAvatarFile(file);
    setLocalAvatarPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleRemoveAvatar = () => {
    if (localAvatarPreview) {
      URL.revokeObjectURL(localAvatarPreview);
    }
    setPendingAvatarFile(null);
    setLocalAvatarPreview(null);
    setFormData((prev) => ({
      ...prev,
      avatarUrl: "",
    }));
  };

  const onShowToastRef = useRef(onShowToast);
  useEffect(() => {
    onShowToastRef.current = onShowToast;
  }, [onShowToast]);

  const loadTestimonials = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminTestimonials(token);
      setTestimonials(data);
    } catch (err: unknown) {
      onShowToastRef.current(err instanceof Error ? err.message : "Failed to load testimonials", "error");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTestimonials();
  }, [loadTestimonials]);

  const handleOpenCreate = () => {
    if (localAvatarPreview) {
      URL.revokeObjectURL(localAvatarPreview);
    }
    setPendingAvatarFile(null);
    setLocalAvatarPreview(null);
    setEditingId(null);
    setFormData({
      authorName: "",
      authorTitle: "",
      institution: "",
      quote: "",
      avatarUrl: "/assets/testimonial-avatar.png",
      sortOrder: testimonials.length,
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: TestimonialItem) => {
    if (localAvatarPreview) {
      URL.revokeObjectURL(localAvatarPreview);
    }
    setPendingAvatarFile(null);
    setLocalAvatarPreview(null);
    setEditingId(t.id);
    setFormData({
      authorName: t.authorName,
      authorTitle: t.authorTitle,
      institution: t.institution,
      quote: t.quote,
      avatarUrl: t.avatarUrl || "/assets/testimonial-avatar.png",
      sortOrder: t.sortOrder,
      isPublished: t.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.authorName?.trim() || !formData.quote?.trim()) {
      onShowToast("Author Name and Quote are required.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalAvatarUrl = formData.avatarUrl;

      if (pendingAvatarFile) {
        setIsUploadingAvatar(true);
        const res = await uploadMediaFile(token, pendingAvatarFile, "testimonials");
        finalAvatarUrl = res.url;
        setIsUploadingAvatar(false);
      }

      const payload = {
        ...formData,
        avatarUrl: finalAvatarUrl,
      };

      if (editingId) {
        await updateAdminTestimonial(token, editingId, payload);
        onShowToast("Testimonial updated successfully!", "success");
      } else {
        await createAdminTestimonial(token, payload);
        onShowToast("New testimonial created!", "success");
      }

      if (localAvatarPreview) {
        URL.revokeObjectURL(localAvatarPreview);
      }
      setPendingAvatarFile(null);
      setLocalAvatarPreview(null);

      setIsModalOpen(false);
      loadTestimonials();
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to save testimonial", "error");
    } finally {
      setIsUploadingAvatar(false);
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!testimonialToDelete) return;

    setIsDeleting(true);
    try {
      await deleteAdminTestimonial(token, testimonialToDelete.id);
      onShowToast(`Testimonial from '${testimonialToDelete.name}' deleted.`, "info");
      setTestimonialToDelete(null);
      loadTestimonials();
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to delete testimonial", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#101828]">Student &amp; Scholar Testimonials</h2>
          <p className="text-xs text-[#4a5565] mt-1">
            Quotes and stories highlighting experiences of fellows, students, and global partners.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto justify-center inline-flex items-center gap-2 bg-[#00bfff] hover:bg-[#00a6e0] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Testimonial
        </button>
      </div>

      {/* Testimonials List */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#e5e7eb]">
          <div className="w-8 h-8 border-3 border-[#00bfff] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-[#4a5565]">Loading testimonials...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#e5e7eb] text-[#4a5565] text-xs">
          No testimonials found. Click &lsquo;Add Testimonial&rsquo; to create your first story.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-xs flex flex-col justify-between hover:border-[#b0ebff] transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#b0ebff] shrink-0 bg-[#e6f9ff]">
                      {t.avatarUrl ? (
                        <Image
                          src={t.avatarUrl}
                          alt={t.authorName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-[#00698c] text-sm">
                          {t.authorName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#101828]">{t.authorName}</h4>
                      <p className="text-[11px] text-[#00698c] font-medium">{t.authorTitle}</p>
                      {t.institution && (
                        <p className="text-[10px] text-[#4a5565]">{t.institution}</p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      t.isPublished
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    {t.isPublished ? "Published" : "Draft"}
                  </span>
                </div>

                <p className="text-xs text-[#344054] italic leading-relaxed bg-[#f9fafb] p-3 rounded-xl border border-[#f2f4f7]">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#f2f4f7] text-[11px]">
                <span className="text-[#4a5565]">Order: {t.sortOrder}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="px-3 py-1 rounded-lg border border-[#d0d5dd] hover:bg-[#f9fafb] font-bold text-[#344054] cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setTestimonialToDelete({ id: t.id, name: t.authorName })}
                    className="px-3 py-1 rounded-lg border border-red-200 hover:bg-red-50 font-bold text-red-600 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-xl border border-[#e5e7eb] flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4 shrink-0">
              <div>
                <h3 className="text-base font-bold text-[#101828]">
                  {editingId ? "Edit Testimonial" : "Add Testimonial"}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Add author details, quote, and upload their photo.</p>
              </div>
              <button
                onClick={closeTestimonialModal}
                className="text-[#98a2b3] hover:text-[#101828] text-lg font-bold cursor-pointer p-1 rounded-lg hover:bg-gray-100"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto modal-scroll p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Author Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="e.g. Elena Rostova"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Title / Position / Degree
                  </label>
                  <input
                    type="text"
                    value={formData.authorTitle || ""}
                    onChange={(e) => setFormData({ ...formData, authorTitle: e.target.value })}
                    placeholder="e.g. Master of International Law '23"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#344054] mb-1">
                  Institution / Organization / Affiliation
                </label>
                <input
                  type="text"
                  value={formData.institution || ""}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g. IILP Scholar / Harvard University"
                  className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                />
              </div>

              {/* Avatar Photo & Storage Upload */}
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#1e293b]">
                    Author Avatar Photo
                  </label>
                  {(formData.avatarUrl || pendingAvatarFile) && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="text-[11px] font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      Remove photo
                    </button>
                  )}
                </div>

                {/* Staged Avatar Banner */}
                {pendingAvatarFile && (
                  <div className="mb-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-2">
                    <p className="text-[11px] text-emerald-800 font-medium truncate">
                      Selected: <span className="font-bold">{pendingAvatarFile.name}</span> — will upload on save
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (localAvatarPreview) URL.revokeObjectURL(localAvatarPreview);
                        setPendingAvatarFile(null);
                        setLocalAvatarPreview(null);
                      }}
                      className="text-[10px] font-bold text-gray-500 hover:text-gray-800 underline shrink-0 cursor-pointer"
                    >
                      Discard
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-3">
                  {/* Avatar Preview */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#e2e8f0] bg-white shrink-0 flex items-center justify-center">
                    {(localAvatarPreview || formData.avatarUrl) ? (
                      <img
                        src={localAvatarPreview || formData.avatarUrl || undefined}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/assets/testimonial-avatar.png";
                        }}
                      />
                    ) : (
                      <span className="text-[10px] text-gray-400">No Photo</span>
                    )}
                  </div>

                  {/* Upload Button */}
                  <label
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed text-xs font-medium cursor-pointer transition-all ${
                      isUploadingAvatar || isSubmitting
                        ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                        : "bg-white border-[#00bfff] text-[#008cb3] hover:bg-[#f0f9ff]"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    <span>
                      {isUploadingAvatar
                        ? "Uploading to Storage..."
                        : pendingAvatarFile
                        ? "Change Avatar File"
                        : formData.avatarUrl
                        ? "Replace Avatar File"
                        : "Upload Avatar (uploads on save)"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingAvatar || isSubmitting}
                      onChange={handleAvatarSelected}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Direct URL Input */}
                <div>
                  <input
                    type="text"
                    value={formData.avatarUrl || ""}
                    onChange={(e) => {
                      if (localAvatarPreview) URL.revokeObjectURL(localAvatarPreview);
                      setPendingAvatarFile(null);
                      setLocalAvatarPreview(null);
                      setFormData({ ...formData, avatarUrl: e.target.value });
                    }}
                    placeholder="http://localhost:9000/iilp-media/... or /assets/..."
                    className="w-full bg-white border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#344054] mb-1">
                  Quote Statement <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.quote || ""}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="The experience provided me with a solid foundation in..."
                  className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center pt-2">
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder ?? 0}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828]"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={formData.isPublished ?? true}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 text-[#00bfff] rounded-sm focus:ring-[#00bfff]"
                  />
                  <span className="text-xs font-bold text-[#344054]">Publish on Website</span>
                </label>
              </div>

              </div>

              {/* Sticky Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e5e7eb] bg-[#fcfdff] shrink-0">
                <button
                  type="button"
                  onClick={closeTestimonialModal}
                  className="px-4 py-2 text-xs font-bold text-[#4a5565] hover:bg-[#f3f4f6] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#00bfff] hover:bg-[#00a6e0] rounded-xl shadow-xs transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : "Save Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!testimonialToDelete}
        title="Delete Testimonial"
        message={
          <>
            Are you sure you want to delete testimonial from <strong className="text-gray-900 font-semibold">{testimonialToDelete?.name}</strong>? This action cannot be undone.
          </>
        }
        confirmLabel="Confirm Delete"
        cancelLabel="Cancel"
        isConfirming={isDeleting}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setTestimonialToDelete(null)}
      />
    </div>
  );
}
