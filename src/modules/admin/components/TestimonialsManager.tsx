import React, { useState, useEffect, useCallback } from "react";
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      onShowToast("Avatar image must be less than 10MB", "error");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const res = await uploadMediaFile(token, file, "testimonials");
      setFormData((prev) => ({
        ...prev,
        avatarUrl: res.url,
      }));
      onShowToast("Avatar uploaded to Object Storage!", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload avatar";
      onShowToast(msg, "error");
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const loadTestimonials = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminTestimonials(token);
      setTestimonials(data);
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to load testimonials", "error");
    } finally {
      setIsLoading(false);
    }
  }, [token, onShowToast]);

  useEffect(() => {
    let active = true;
    fetchAdminTestimonials(token)
      .then((data) => {
        if (active) setTestimonials(data);
      })
      .catch((err: unknown) => {
        if (active) {
          onShowToast(err instanceof Error ? err.message : "Failed to load testimonials", "error");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, onShowToast]);

  const handleOpenCreate = () => {
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
      if (editingId) {
        await updateAdminTestimonial(token, editingId, formData);
        onShowToast("Testimonial updated successfully!", "success");
      } else {
        await createAdminTestimonial(token, formData);
        onShowToast("New testimonial created!", "success");
      }
      setIsModalOpen(false);
      loadTestimonials();
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to save testimonial", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete testimonial from '${name}'?`)) {
      return;
    }

    try {
      await deleteAdminTestimonial(token, id);
      onShowToast(`Testimonial from '${name}' deleted.`, "info");
      loadTestimonials();
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to delete testimonial", "error");
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
          className="inline-flex items-center gap-2 bg-[#00bfff] hover:bg-[#00a6e0] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
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
                    onClick={() => handleDelete(t.id, t.authorName)}
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#e5e7eb]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e5e7eb]">
              <h3 className="text-base font-bold text-[#101828]">
                {editingId ? "Edit Testimonial" : "Add Testimonial"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#98a2b3] hover:text-[#101828] text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Author Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.authorName || ""}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="e.g. Sophia Lee"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Title / Cohort
                  </label>
                  <input
                    type="text"
                    value={formData.authorTitle || ""}
                    onChange={(e) => setFormData({ ...formData, authorTitle: e.target.value })}
                    placeholder="e.g. BBA, Class of 2022"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#344054] mb-1">
                  Institution / Affiliation
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
                  {formData.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, avatarUrl: "" })}
                      className="text-[11px] font-medium text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove photo
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 mb-3">
                  {/* Avatar Preview */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#e2e8f0] bg-white flex-shrink-0 flex items-center justify-center">
                    {formData.avatarUrl ? (
                      <img
                        src={formData.avatarUrl}
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
                      isUploadingAvatar
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
                        ? "Uploading to MinIO / S3..."
                        : "Upload Avatar (MinIO / S3)"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingAvatar}
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Direct URL Input */}
                <div>
                  <input
                    type="text"
                    value={formData.avatarUrl || ""}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
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

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5e7eb]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
    </div>
  );
}
