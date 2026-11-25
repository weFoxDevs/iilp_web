import React, { useState, useEffect, useCallback, useRef } from "react";
import { RichTextEditor } from "./RichTextEditor";
import {
  fetchAdminBlogs,
  createAdminBlog,
  updateAdminBlog,
  deleteAdminBlog,
  BlogPostItem,
} from "@/common/services/blogs.service";
import { uploadMediaFile } from "@/common/services/cms.service";
import { ToastType } from "@/common/components/Toast";
import ConfirmationModal from "./ConfirmationModal";

interface BlogsManagerProps {
  token: string;
  onShowToast: (message: string, type: ToastType) => void;
}

const BLOG_CATEGORIES = [
  { id: "legal-insights", label: "Legal Insights" },
  { id: "research", label: "Research & Policy" },
  { id: "opinion", label: "Opinion & Commentary" },
  { id: "faculty-voices", label: "Faculty Voices" },
  { id: "student-perspectives", label: "Student Perspectives" },
  { id: "general", label: "General" },
];

export function BlogsManager({ token, onShowToast }: BlogsManagerProps) {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | "DRAFT" | "PUBLISHED" | "ARCHIVED">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Modal State
  const [postToDelete, setPostToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [tagsInput, setTagsInput] = useState("");
  const [formData, setFormData] = useState<Partial<BlogPostItem>>({
    title: "",
    slug: "",
    categoryId: "legal-insights",
    categoryName: "Legal Insights",
    tags: [],
    summary: "",
    content: "",
    featuredImage: "",
    authorName: "",
    authorRole: "",
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

  const onShowToastRef = useRef(onShowToast);
  useEffect(() => {
    onShowToastRef.current = onShowToast;
  }, [onShowToast]);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetchAdminBlogs(token, {
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        status: selectedStatus !== "ALL" ? selectedStatus : undefined,
        search: searchQuery.trim() || undefined,
        limit: 50,
      });
      setPosts(res.items || []);
    } catch (err: unknown) {
      onShowToastRef.current(
        err instanceof Error ? err.message : "Failed to load blog posts",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPosts();
  }, [loadPosts]);

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
    setTagsInput("");
    setFormData({
      title: "",
      slug: "",
      categoryId: "legal-insights",
      categoryName: "Legal Insights",
      tags: [],
      summary: "",
      content: "",
      featuredImage: "",
      authorName: "",
      authorRole: "",
      publishedDate: new Date().toISOString().split("T")[0],
      readTimeMinutes: 3,
      status: "PUBLISHED",
      isHighlighted: false,
      sortOrder: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPostItem) => {
    if (localImagePreview) {
      URL.revokeObjectURL(localImagePreview);
    }
    setPendingImageFile(null);
    setLocalImagePreview(null);
    setEditingId(post.id);
    setTagsInput((post.tags || []).join(", "));
    setFormData({
      title: post.title,
      slug: post.slug,
      categoryId: post.categoryId,
      categoryName: post.categoryName,
      tags: post.tags || [],
      summary: post.summary,
      content: post.content,
      featuredImage: post.featuredImage || "",
      authorName: post.authorName || "",
      authorRole: post.authorRole || "",
      publishedDate: post.publishedDate,
      readTimeMinutes: post.readTimeMinutes,
      status: post.status,
      isHighlighted: post.isHighlighted,
      sortOrder: post.sortOrder,
    });
    setIsModalOpen(true);
  };

  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      onShowToast("Cover image must be less than 15MB", "error");
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
      onShowToast("Blog title is required.", "error");
      return;
    }

    if (!formData.content?.trim()) {
      onShowToast("Blog content is required.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.featuredImage || "";

      if (pendingImageFile) {
        setIsUploadingImage(true);
        const uploadRes = await uploadMediaFile(token, pendingImageFile, "blogs");
        finalImageUrl = uploadRes.url;
        setIsUploadingImage(false);
      }

      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: Partial<BlogPostItem> = {
        ...formData,
        featuredImage: finalImageUrl || undefined,
        tags: parsedTags,
        readTimeMinutes: Number(formData.readTimeMinutes) || 3,
        sortOrder: Number(formData.sortOrder) || 0,
      };

      if (editingId) {
        await updateAdminBlog(token, editingId, payload);
        onShowToast("Blog post updated successfully!", "success");
      } else {
        await createAdminBlog(token, payload);
        onShowToast("Blog post created successfully!", "success");
      }

      closeModal();
      await loadPosts();
    } catch (err: unknown) {
      onShowToast(
        err instanceof Error ? err.message : "Failed to save blog post",
        "error"
      );
    } finally {
      setIsSubmitting(false);
      setIsUploadingImage(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      await deleteAdminBlog(token, postToDelete.id);
      onShowToast("Blog post deleted successfully.", "success");
      setPostToDelete(null);
      await loadPosts();
    } catch (err: unknown) {
      onShowToast(
        err instanceof Error ? err.message : "Failed to delete blog post",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const displayedImage = localImagePreview || formData.featuredImage;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-playfair font-bold text-[#0a0d12]">
              Blog Posts Management
            </h2>
            <p className="text-xs text-[#6a7282] mt-1">
              Create, edit, and publish blog articles shown on the public{" "}
              <span className="font-mono text-[#000080]">/blogs</span> page.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#000080] text-white text-xs font-bold hover:bg-[#000066] transition-all cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Blog Post
          </button>
        </div>

        {/* Filters */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, summary, or author..."
            className="w-full px-3.5 py-2 rounded-xl border border-[#d1d5db] text-xs focus:outline-none focus:ring-2 focus:ring-[#000080]/20 focus:border-[#000080]"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-[#d1d5db] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#000080]/20 focus:border-[#000080]"
          >
            <option value="All">All Categories</option>
            {BLOG_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(
                e.target.value as "ALL" | "DRAFT" | "PUBLISHED" | "ARCHIVED"
              )
            }
            className="w-full px-3.5 py-2 rounded-xl border border-[#d1d5db] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#000080]/20 focus:border-[#000080]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-[#6a7282]">
            Loading blog posts...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-[#101828]">No blog posts found</p>
            <p className="text-xs text-[#6a7282] mt-1">
              Click &ldquo;New Blog Post&rdquo; to publish your first article.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb] text-[11px] font-bold uppercase tracking-wider text-[#6a7282]">
                  <th className="py-3.5 px-4">Post</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb] text-xs">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {post.featuredImage ? (
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-12 h-12 rounded-lg object-cover border border-[#e5e7eb] shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-[#f3f4f6] border border-[#e5e7eb] flex items-center justify-center text-[#9ca3af] shrink-0 text-[10px]">
                            No Img
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-[#101828] line-clamp-1">
                            {post.title}
                            {post.isHighlighted && (
                              <span className="ml-2 inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#6a7282] font-mono truncate max-w-xs">
                            /blogs/{post.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#4a5565] font-medium">
                      {post.categoryName}
                    </td>
                    <td className="py-3.5 px-4 text-[#4a5565]">
                      {post.authorName || "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          post.status === "PUBLISHED"
                            ? "bg-emerald-100 text-emerald-800"
                            : post.status === "DRAFT"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#6a7282] whitespace-nowrap">
                      {post.publishedDate}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        {post.status === "PUBLISHED" && (
                          <a
                            href={`/blogs/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg border border-[#d1d5db] text-[#374151] hover:bg-[#f3f4f6] font-semibold"
                          >
                            View
                          </a>
                        )}
                        <button
                          onClick={() => openEditModal(post)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#e6f9ff] text-[#00698c] hover:bg-[#ccf2ff] font-semibold cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setPostToDelete({ id: post.id, title: post.title })}
                          className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl border border-[#e5e7eb]">
            <div className="sticky top-0 z-10 bg-white border-b border-[#e5e7eb] px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-playfair font-bold text-[#0a0d12]">
                {editingId ? "Edit Blog Post" : "Create New Blog Post"}
              </h3>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg text-[#6a7282] hover:bg-[#f3f4f6] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#374151] mb-1.5">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="Enter blog post title"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-[#000080]/20 focus:border-[#000080]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#374151] mb-1.5">
                    Slug (optional, auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    value={formData.slug || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="custom-url-slug"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d1d5db] font-mono focus:outline-none focus:ring-2 focus:ring-[#000080]/20 focus:border-[#000080]"
                  />
                </div>
              </div>

              {/* Category, Author, Role */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[#374151] mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.categoryId || "legal-insights"}
                    onChange={(e) => {
                      const found = BLOG_CATEGORIES.find((c) => c.id === e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                        categoryName: found?.label || "General",
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d1d5db] bg-white focus:outline-none focus:ring-2 focus:ring-[#000080]/20 focus:border-[#000080]"
                  >
                    {BLOG_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#374151] mb-1.5">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.authorName || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, authorName: e.target.value }))
                    }
                    placeholder="e.g. Dr. Elena Rostova"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-[#000080]/20 focus:border-[#000080]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#374151] mb-1.5">
                    Author Role / Title
                  </label>
                  <input
                    type="text"
                    value={formData.authorRole || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, authorRole: e.target.value }))
                    }
                    placeholder="e.g. Senior Research Fellow"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-[#000080]/20 focus:border-[#000080]"
                  />
                </div>
              </div>

              {/* Status, Date, Read Time, Tags */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-[#374151] mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status || "PUBLISHED"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED",
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d1d5db] bg-white focus:outline-none focus:ring-2 focus:ring-[#000080]/20 focus:border-[#000080]"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#374151] mb-1.5">
                    Published Date
                  </label>
                  <input
                    type="date"
                    value={formData.publishedDate || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, publishedDate: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-[#000080]/20 focus:border-[#000080]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#374151] mb-1.5">
                    Read Time (mins)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.readTimeMinutes ?? 3}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        readTimeMinutes: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-[#000080]/20 focus:border-[#000080]"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-[#374151]">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isHighlighted)}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isHighlighted: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded border-[#d1d5db] text-[#000080]"
                    />
                    Featured Post
                  </label>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block font-bold text-[#374151] mb-1.5">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="International Law, AI Governance, Policy"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-[#000080]/20 focus:border-[#000080]"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block font-bold text-[#374151] mb-1.5">
                  Excerpt / Summary
                </label>
                <textarea
                  rows={2}
                  value={formData.summary || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, summary: e.target.value }))
                  }
                  placeholder="Short summary for blog cards and SEO..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#d1d5db] focus:outline-none focus:ring-2 focus:ring-[#000080]/20 focus:border-[#000080]"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block font-bold text-[#374151] mb-1.5">
                  Cover Image
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {displayedImage && (
                    <div className="relative w-36 h-24 rounded-xl overflow-hidden border border-[#e5e7eb] shrink-0">
                      <img
                        src={displayedImage}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <div className="flex flex-col gap-2 w-full">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelected}
                      className="text-xs file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#e6f9ff] file:text-[#00698c] hover:file:bg-[#ccf2ff] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.featuredImage || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          featuredImage: e.target.value,
                        }))
                      }
                      placeholder="Or paste image URL..."
                      className="w-full px-3 py-2 rounded-xl border border-[#d1d5db] text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Rich Text Content */}
              <div>
                <label className="block font-bold text-[#374151] mb-1.5">
                  Content <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  value={formData.content || ""}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, content: val }))
                  }
                  placeholder="Write your blog post content..."
                />
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e5e7eb]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl border border-[#d1d5db] text-[#374151] font-bold hover:bg-[#f9fafb] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="px-5 py-2.5 rounded-xl bg-[#000080] text-white font-bold hover:bg-[#000066] disabled:opacity-50 cursor-pointer"
                >
                  {isUploadingImage
                    ? "Uploading Image..."
                    : isSubmitting
                    ? "Saving..."
                    : editingId
                    ? "Update Blog Post"
                    : "Create Blog Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={Boolean(postToDelete)}
        onCancel={() => setPostToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${postToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isConfirming={isDeleting}
        variant="danger"
      />
    </div>
  );
}
