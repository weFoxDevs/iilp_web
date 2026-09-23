import React, { useState, useEffect, useCallback } from "react";
import { RichTextEditor } from "./RichTextEditor";
import Image from "next/image";
import {
  fetchAdminNews,
  createAdminNews,
  updateAdminNews,
  deleteAdminNews,
  seedAdminNews,
  NewsArticleItem,
} from "@/common/services/news.service";
import { uploadMediaFile } from "@/common/services/cms.service";
import { ToastType } from "@/common/components/Toast";
import ConfirmationModal from "./ConfirmationModal";

interface NewsManagerProps {
  token: string;
  onShowToast: (message: string, type: ToastType) => void;
}

const CATEGORY_OPTIONS = [
  { id: "news", label: "News" },
  { id: "programs", label: "Programs" },
  { id: "events", label: "Events" },
  { id: "press-releases", label: "Press Releases" },
];

export function NewsManager({ token, onShowToast }: NewsManagerProps) {
  const [articles, setArticles] = useState<NewsArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete & Action Modal States
  const [articleToDelete, setArticleToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSeedModalOpen, setIsSeedModalOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState<Partial<NewsArticleItem>>({
    title: "",
    slug: "",
    categoryId: "news",
    categoryName: "News",
    summary: "",
    content: "",
    featuredImage: "/assets/news-main.png",
    publishedDate: new Date().toISOString().split("T")[0],
    readTimeMinutes: 3,
    status: "PUBLISHED",
    isHighlighted: false,
    sortOrder: 0,
  });

  // Image Upload State
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchAdminNews(token, {
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        search: searchQuery.trim() || undefined,
        limit: 50,
      });
      setArticles(res.items || []);
    } catch (err: unknown) {
      onShowToast(
        err instanceof Error ? err.message : "Failed to load news articles",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedCategory, searchQuery, onShowToast]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const closeModal = () => {
    if (localImagePreview) {
      URL.revokeObjectURL(localImagePreview);
    }
    setPendingImageFile(null);
    setLocalImagePreview(null);
    setIsModalOpen(false);
    setEditingId(null);
  };

  const openCreateModal = () => {
    if (localImagePreview) {
      URL.revokeObjectURL(localImagePreview);
    }
    setPendingImageFile(null);
    setLocalImagePreview(null);
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      categoryId: "news",
      categoryName: "News",
      summary: "",
      content: "",
      featuredImage: "/assets/news-main.png",
      publishedDate: new Date().toISOString().split("T")[0],
      readTimeMinutes: 3,
      status: "PUBLISHED",
      isHighlighted: false,
      sortOrder: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (article: NewsArticleItem) => {
    if (localImagePreview) {
      URL.revokeObjectURL(localImagePreview);
    }
    setPendingImageFile(null);
    setLocalImagePreview(null);
    setEditingId(article.id);
    setFormData({
      title: article.title,
      slug: article.slug,
      categoryId: article.categoryId,
      categoryName: article.categoryName,
      summary: article.summary,
      content: article.content,
      featuredImage: article.featuredImage,
      publishedDate: article.publishedDate,
      readTimeMinutes: article.readTimeMinutes,
      status: article.status,
      isHighlighted: article.isHighlighted,
      sortOrder: article.sortOrder,
    });
    setIsModalOpen(true);
  };

  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      onShowToast("Featured image must be less than 15MB", "error");
      return;
    }

    if (localImagePreview) {
      URL.revokeObjectURL(localImagePreview);
    }

    setPendingImageFile(file);
    setLocalImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleRemoveImage = () => {
    if (localImagePreview) {
      URL.revokeObjectURL(localImagePreview);
    }
    setPendingImageFile(null);
    setLocalImagePreview(null);
    setFormData((prev) => ({ ...prev, featuredImage: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      onShowToast("Article title is required.", "error");
      return;
    }

    if (!formData.summary?.trim()) {
      onShowToast("Article summary is required.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.featuredImage || "/assets/news-main.png";

      // Upload new file if selected
      if (pendingImageFile) {
        setIsUploadingImage(true);
        const uploadRes = await uploadMediaFile(token, pendingImageFile, "news");
        finalImageUrl = uploadRes.url;
        setIsUploadingImage(false);
      }

      const payload: Partial<NewsArticleItem> = {
        ...formData,
        featuredImage: finalImageUrl,
        readTimeMinutes: Number(formData.readTimeMinutes) || 3,
        sortOrder: Number(formData.sortOrder) || 0,
      };

      if (editingId) {
        await updateAdminNews(token, editingId, payload);
        onShowToast("News article updated successfully!", "success");
      } else {
        await createAdminNews(token, payload);
        onShowToast("News article created successfully!", "success");
      }

      closeModal();
      await loadArticles();
    } catch (err: unknown) {
      onShowToast(
        err instanceof Error ? err.message : "Failed to save news article",
        "error"
      );
    } finally {
      setIsSubmitting(false);
      setIsUploadingImage(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;

    setIsDeleting(true);
    try {
      await deleteAdminNews(token, articleToDelete.id);
      onShowToast("News article deleted successfully.", "success");
      setArticleToDelete(null);
      await loadArticles();
    } catch (err: unknown) {
      onShowToast(
        err instanceof Error ? err.message : "Failed to delete article",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmSeed = async () => {
    setIsSeeding(true);
    try {
      const res = await seedAdminNews(token);
      onShowToast(`Successfully seeded ${res.count} articles!`, "success");
      setIsSeedModalOpen(false);
      await loadArticles();
    } catch (err: unknown) {
      onShowToast(
        err instanceof Error ? err.message : "Failed to seed default articles",
        "error"
      );
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0a0d12]">News &amp; Media Articles</h2>
          <p className="text-xs text-[#6a7282] mt-1">
            Manage public news stories, policy briefs, symposium announcements, and publications for the Institute.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSeedModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-[#00698c] bg-[#e6f9ff] border border-[#b0ebff] rounded-xl hover:bg-[#cbf2ff] transition-all cursor-pointer"
          >
            ↺ Seed Default Articles
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 text-xs font-bold text-white bg-[#000080] hover:bg-[#000060] rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>+</span>
            <span>Add New Article</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e5e7eb] shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="w-full md:w-72 relative">
          <input
            type="text"
            placeholder="Search articles by title or summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#d0d5dd] focus:border-[#000080] focus:ring-1 focus:ring-[#000080] outline-hidden"
          />
          <svg
            className="w-4 h-4 text-[#98a2b3] absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          {["All", "News", "Programs", "Events", "Press Releases"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#000080] text-white"
                  : "bg-[#f4f5f7] text-[#4a5565] hover:bg-[#e5e7eb]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles List Table */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#6a7282]">
            Loading news articles...
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-sm font-semibold text-[#0a0d12]">No news articles found.</p>
            <p className="text-xs text-[#6a7282]">
              Click &quot;Seed Default Articles&quot; or create your first news story.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb] text-[11px] font-bold text-[#475467] uppercase tracking-wider">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Home Featured</th>
                  <th className="py-3 px-4">Date / Read Time</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2f4f7] text-xs">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-[#fcfcfd] transition-colors">
                    {/* Article Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          {article.featuredImage ? (
                            <Image
                              src={article.featuredImage}
                              alt={article.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400">
                              No Img
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#0a0d12] truncate max-w-xs sm:max-w-md">
                            {article.title}
                          </p>
                          <p className="text-[11px] text-[#667085] truncate max-w-xs sm:max-w-md">
                            /{article.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-[#e6f9ff] text-[#00698c] font-semibold rounded-md text-[11px]">
                        {article.categoryName}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          article.status === "PUBLISHED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : article.status === "DRAFT"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>

                    {/* Home Featured */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {article.isHighlighted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600">
                          ★ Featured
                        </span>
                      ) : (
                        <span className="text-[11px] text-gray-400">—</span>
                      )}
                    </td>

                    {/* Date / Read Time */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-[#475467]">
                      <div>{article.publishedDate}</div>
                      <div className="text-[10px] text-[#98a2b3]">{article.readTimeMinutes} min read</div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => openEditModal(article)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#000080] hover:bg-[#eef4ff] rounded-md transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setArticleToDelete({ id: article.id, title: article.title })}
                        className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-md transition-all cursor-pointer"
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
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 shrink-0">
              <div>
                <h3 className="text-base font-bold text-[#0a0d12]">
                  {editingId ? "Edit News Article" : "Create New News Article"}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Fill in article details, upload media, and set content.</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto modal-scroll p-6 space-y-4 text-xs">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title || ""}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        title: newTitle,
                        // auto populate slug if empty or in create mode
                        slug: !editingId && !prev.slug ? newTitle.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-') : prev.slug,
                      }));
                    }}
                    placeholder="e.g. Technological Advancements in International Law"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#000080] outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Slug (URL identifier)</label>
                  <input
                    type="text"
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. technological-advancements-in-international-law"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#000080] outline-hidden"
                  />
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Category *</label>
                  <select
                    value={formData.categoryId || "news"}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const opt = CATEGORY_OPTIONS.find((c) => c.id === selectedId);
                      setFormData({
                        ...formData,
                        categoryId: selectedId,
                        categoryName: opt ? opt.label : selectedId,
                      });
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#000080] outline-hidden bg-white"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Status</label>
                  <select
                    value={formData.status || "PUBLISHED"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED",
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#000080] outline-hidden bg-white"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Published Date</label>
                  <input
                    type="date"
                    value={formData.publishedDate || ""}
                    onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#000080] outline-hidden bg-white"
                  />
                </div>
              </div>

              {/* Read Time & Highlighted & Sort Order */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Read Time (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.readTimeMinutes ?? 3}
                    onChange={(e) =>
                      setFormData({ ...formData, readTimeMinutes: parseInt(e.target.value, 10) || 1 })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#000080] outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Display Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder ?? 0}
                    onChange={(e) =>
                      setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#000080] outline-hidden"
                  />
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isHighlighted ?? false}
                      onChange={(e) =>
                        setFormData({ ...formData, isHighlighted: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-[#000080] focus:ring-[#000080]"
                    />
                    <span className="text-xs font-bold text-gray-700">
                      Feature on Home Page
                    </span>
                  </label>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Summary (Card snippet) *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary || ""}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Brief 1-2 sentence description displayed on preview cards..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-300 focus:border-[#000080] outline-hidden"
                />
              </div>

              {/* Featured Image Uploader */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <label className="text-xs font-bold text-gray-700">Featured Image</label>
                <div className="flex items-center gap-4">
                  {(localImagePreview || formData.featuredImage) && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-white shrink-0">
                      <Image
                        src={localImagePreview || formData.featuredImage || "/assets/news-main.png"}
                        alt="Preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-1 flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelected}
                      className="text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#e6f9ff] file:text-[#00698c] hover:file:bg-[#cbf2ff] cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-500">
                      Uploads directly to storage (`news` folder). PNG, JPG, or WebP. Max 15MB.
                    </p>
                  </div>

                  {(localImagePreview || formData.featuredImage) && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Full Content – Rich Text Editor */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Full Content
                  <span className="ml-1.5 font-normal text-gray-400">(Rich Text Editor – outputs HTML)</span>
                </label>
                <RichTextEditor
                  value={formData.content || ""}
                  onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                  placeholder="Write the full article body here. Use headings, lists, blockquotes…"
                  minHeight={280}
                />
              </div>

              </div>

              {/* Sticky Footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-[#fcfdff] shrink-0">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#000080] hover:bg-[#000060] rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting || isUploadingImage
                    ? "Saving Article..."
                    : editingId
                    ? "Update Article"
                    : "Create Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!articleToDelete}
        title="Delete News Article"
        message={
          <>
            Are you sure you want to delete <strong className="text-gray-900 font-semibold">{articleToDelete?.title}</strong>? Associated uploaded media will also be removed.
          </>
        }
        confirmLabel="Confirm Delete"
        cancelLabel="Cancel"
        isConfirming={isDeleting}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setArticleToDelete(null)}
      />

      {/* Seed Confirmation Modal */}
      <ConfirmationModal
        isOpen={isSeedModalOpen}
        title="Seed Default Articles"
        message="Seed default articles from the Module specification? This will generate initial articles in the database."
        confirmLabel="Confirm Seed"
        cancelLabel="Cancel"
        isConfirming={isSeeding}
        variant="info"
        onConfirm={handleConfirmSeed}
        onCancel={() => setIsSeedModalOpen(false)}
      />
    </div>
  );
}
