import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchAdminPageSlugs,
  fetchAdminSections,
  upsertAdminSection,
  deleteAdminSection,
  uploadMediaFile,
  deleteMediaFile,
  PageSectionData,
} from "@/common/services/cms.service";
import { ToastType } from "@/common/components/Toast";

interface AdminSectionItem extends PageSectionData {
  sectionKey?: string;
}

interface PageContentManagerProps {
  token: string;
  onShowToast: (message: string, type: ToastType) => void;
}

const COMMON_PAGES = [
  { slug: "home", label: "Home Page (/)" },
  { slug: "about", label: "About Page (/about)" },
  { slug: "academics", label: "Academics (/academics)" },
  { slug: "fellowships", label: "Fellowships (/fellowships)" },
  { slug: "governance", label: "Governance (/governance)" },
  { slug: "leadership-directory", label: "Leadership (/leadership-directory)" },
  { slug: "research-publications", label: "Research (/research-publications)" },
  { slug: "news-media", label: "News & Media (/news-media)" },
  { slug: "partnerships", label: "Partnerships (/partnerships)" },
  { slug: "careers", label: "Careers (/careers)" },
  { slug: "contact", label: "Contact (/contact)" },
  { slug: "donate", label: "Donate (/donate)" },
  { slug: "privacy-policy", label: "Privacy Policy (/privacy-policy)" },
  { slug: "terms-of-use", label: "Terms of Use (/terms-of-use)" },
];

export interface SectionDefinition {
  key: string;
  label: string;
  defaultTitle?: string;
  defaultBadge?: string;
  defaultSubtitle?: string;
  defaultBgImage?: string;
  defaultMetadata?: Record<string, any>;
}

export const PAGE_SECTIONS_REGISTRY: Record<string, SectionDefinition[]> = {
  home: [
    { key: "hero", label: "Hero Banner", defaultTitle: "International Institute for Law and Politics (IILP)", defaultBadge: "Global Academic Network", defaultBgImage: "/assets/home-hero-v2.png" },
    {
      key: "our_mission",
      label: "Our Mission",
      defaultTitle: "Our Mission & Commitment",
      defaultBadge: "Our Mission",
      defaultSubtitle:
        "To cultivate a dynamic international ecosystem of legal scholars, political analysts, and policy innovators dedicated to academic rigor, institutional integrity, and transformative scholarship that impacts societies worldwide.",
      defaultBgImage: "/assets/about-mission-law.png",
    },
    {
      key: "our_vision",
      label: "Our Vision",
      defaultTitle: "Our Global Vision",
      defaultBadge: "Our Vision",
      defaultSubtitle:
        "To become a globally respected center of excellence for research, education, policy innovation, and leadership development — advancing justice, human dignity, democratic governance, responsible public leadership, and sustainable peace.",
      defaultBgImage: "/assets/about-mission-student.png",
      defaultMetadata: {
        studentRatingsCount: "5000",
        studentRatingsLabel: "Student ratings",
        stats: [
          { number: "6+", label: "Academic Departments", progress: "58%" },
          { number: "18+", label: "Leadership Positions", progress: "58%" },
          { number: "3+", label: "Fellowship Types", progress: "58%" },
          { number: "5+", label: "Partnership Tracks", progress: "58%" },
        ],
      },
    },
    { key: "academic_programs", label: "Academic Programs", defaultTitle: "Six Academic Departments", defaultBadge: "Academic Programs" },
    { key: "events", label: "Upcoming Events", defaultTitle: "Upcoming Events & Activities", defaultBadge: "Stay Updated" },
    { key: "testimonials", label: "Student Testimonials", defaultTitle: "Happy students sharing experiences", defaultBadge: "Testimonials" },
    {
      key: "image_gallery",
      label: "Campus Image Gallery",
      defaultTitle: "Campus Life & Global Academic Engagement",
      defaultMetadata: {
        images: [
          { src: "/assets/gallery-student-stairs.png", alt: "Students walking down campus stairs", size: "lg" },
          { src: "/assets/gallery-students-park.png", alt: "Students walking in campus park", size: "sm" },
          { src: "/assets/gallery-walking-stairs.png", alt: "Students walking down brick steps on campus", size: "lg" },
          { src: "/assets/gallery-sunset-campus.png", alt: "Campus park bench at sunset", size: "sm" },
        ],
      },
    },
    { key: "fellowship_network", label: "Global Fellowship Network", defaultTitle: "Join the IILP Fellowship Network", defaultBadge: "Global Fellowship Network" },
    { key: "founder_message", label: "Founder's Message", defaultTitle: "Founder's Message", defaultBadge: "From the Founder" },
    {
      key: "news_media",
      label: "News & Media Center",
      defaultTitle: "News & Media Center",
      defaultBadge: "Stay Updated",
      defaultSubtitle:
        "Interdisciplinary programs advancing law, governance, human rights, and development through rigorous research and scholarship.",
      defaultMetadata: {
        tabs: ["Programs", "News", "Events"],
        featured: {
          id: "featured",
          category: "News",
          date: "May 20, 2025",
          title: "Technological Advancements",
          image: "/assets/news-main.png",
          link: "/news",
        },
        articles: [
          {
            id: 1,
            category: "News",
            date: "May 20, 2025",
            title: "Technological Advancements",
            image: "/assets/news-small-1.png",
            link: "/news",
          },
          {
            id: 2,
            category: "News",
            date: "May 20, 2025",
            title: "Technological Advancements",
            image: "/assets/news-small-2.png",
            link: "/news",
          },
          {
            id: 3,
            category: "News",
            date: "May 20, 2025",
            title: "Technological Advancements",
            image: "/assets/news-small-3.png",
            link: "/news",
          },
          {
            id: 4,
            category: "News",
            date: "May 20, 2025",
            title: "Technological Advancements",
            image: "/assets/news-small-4.png",
            link: "/news",
          },
        ],
      },
    },
  ],
  about: [
    { key: "hero", label: "About Hero Banner", defaultTitle: "About the Institute" },
    { key: "institutional_profile", label: "Institutional Profile", defaultTitle: "Our Institutional Profile" },
    { key: "mission_vision", label: "Mission & Vision Statement", defaultTitle: "Mission, Vision & Core Purpose" },
    { key: "strategic_objectives", label: "Strategic Objectives", defaultTitle: "Strategic Goals & Priorities" },
    { key: "institutional_values", label: "Institutional Values", defaultTitle: "Core Values & Principles" },
    { key: "global_engagement", label: "Global Engagement & Impact", defaultTitle: "Global Engagement & Impact" },
    { key: "founder_message", label: "President & Founder Message", defaultTitle: "Message from the Leadership" },
    {
      key: "gallery",
      label: "About Photo Gallery",
      defaultTitle: "Institutional Photo Gallery",
      defaultMetadata: {
        images: [
          { src: "/assets/gallery-1.png", alt: "Campus life 1", size: "lg" },
          { src: "/assets/gallery-2.png", alt: "Campus life 2", size: "sm" },
          { src: "/assets/gallery-3.png", alt: "Campus life 3", size: "lg" },
          { src: "/assets/gallery-4.png", alt: "Campus life 4", size: "sm" },
        ],
      },
    },
  ],
  academics: [
    { key: "hero", label: "Academics Hero Banner", defaultTitle: "Academic Programs & Rigor" },
    { key: "departments", label: "Academic Departments", defaultTitle: "Our Academic Departments" },
    { key: "apply", label: "Apply to Academic Programs", defaultTitle: "Admissions & Applications" },
  ],
  fellowships: [
    { key: "hero", label: "Fellowship Hero Banner", defaultTitle: "Global Fellowship Opportunities" },
    { key: "categories", label: "Fellowship Categories", defaultTitle: "Fellowship Tracks & Eligibility" },
    { key: "application", label: "Fellowship Application", defaultTitle: "How to Apply" },
    { key: "cta", label: "Call to Action Banner", defaultTitle: "Ready to Apply for Fellowship?" },
  ],
  governance: [
    { key: "hero", label: "Governance Hero", defaultTitle: "Institutional Governance & Integrity" },
    { key: "leadership_structure", label: "Leadership Structure", defaultTitle: "Structure & Oversight" },
    { key: "founding_authority", label: "Founding Authority", defaultTitle: "Founding Charter & Authority" },
    { key: "founding_members", label: "Founding Members", defaultTitle: "Distinguished Founding Members" },
    { key: "governing_council", label: "Governing Council", defaultTitle: "Governing Council" },
    { key: "executive_directorate", label: "Executive Directorate", defaultTitle: "Executive Directorate Board" },
    { key: "academic_senate", label: "Academic Senate", defaultTitle: "Academic Senate" },
    { key: "advisory_board", label: "Advisory Board", defaultTitle: "International Advisory Board" },
    { key: "ethics_commission", label: "Ethics Commission", defaultTitle: "Ethics Commission" },
    { key: "youth_assembly", label: "Youth Leadership Assembly", defaultTitle: "Youth Leadership Assembly" },
    { key: "get_involved", label: "Get Involved CTA", defaultTitle: "Engage with Governance" },
  ],
  "leadership-directory": [
    { key: "hero", label: "Leadership Directory Hero", defaultTitle: "Institutional Leadership Directory" },
    { key: "institutional_leadership", label: "Leadership Grid", defaultTitle: "Officers, Deans & Resident Scholars" },
    { key: "join_team", label: "Join Leadership Team", defaultTitle: "Join Our Team" },
  ],
  "research-publications": [
    { key: "hero", label: "Publications Hero", defaultTitle: "Research & Publications" },
    { key: "featured", label: "Featured Publications", defaultTitle: "Key Scholarly Papers" },
    { key: "publications_list", label: "Publications Archive", defaultTitle: "Monographs, Policy Briefs & Journals" },
    { key: "call_for_papers", label: "Call for Papers", defaultTitle: "Submissions & Peer Review" },
  ],
  "news-media": [
    { key: "hero", label: "News & Media Hero", defaultTitle: "News & Media Center" },
    { key: "press_releases", label: "Press Releases & News", defaultTitle: "Press Releases & Announcements" },
    { key: "photo_gallery", label: "Media Photo Gallery", defaultTitle: "Photo Highlights" },
    { key: "newsletter", label: "Newsletter Subscription", defaultTitle: "Subscribe to Our Dispatch" },
  ],
  partnerships: [
    { key: "hero", label: "Partnerships Hero", defaultTitle: "Strategic Global Partnerships" },
    { key: "framework_tracks", label: "Partnership Framework Tracks", defaultTitle: "Collaborative Tracks" },
    { key: "become_partner", label: "Become a Partner", defaultTitle: "Partner With Us" },
  ],
  careers: [
    { key: "hero", label: "Careers Hero", defaultTitle: "Careers & Opportunities" },
    { key: "openings", label: "Current Openings", defaultTitle: "Open Positions" },
    { key: "work_culture", label: "Work Culture", defaultTitle: "Life at IILP" },
  ],
  contact: [
    { key: "hero", label: "Contact Hero", defaultTitle: "Contact IILP" },
    { key: "info_grid", label: "Offices & Information", defaultTitle: "Global Contact Details" },
    { key: "form", label: "Inquiry Form", defaultTitle: "Send an Inquiry" },
  ],
  donate: [
    { key: "hero", label: "Donation Hero", defaultTitle: "Support IILP" },
    { key: "impact_funds", label: "Impact Funds", defaultTitle: "Endowment & Scholarship Funds" },
    { key: "ways_to_give", label: "Ways to Give", defaultTitle: "Donation Channels" },
  ],
  "privacy-policy": [
    { key: "content", label: "Privacy Policy Content", defaultTitle: "Privacy Policy" },
  ],
  "terms-of-use": [
    { key: "content", label: "Terms of Use Content", defaultTitle: "Terms of Use" },
  ],
};

export function PageContentManager({ token, onShowToast }: PageContentManagerProps) {
  const [selectedPage, setSelectedPage] = useState("home");
  const [availablePages, setAvailablePages] = useState<string[]>([]);
  const [sections, setSections] = useState<AdminSectionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewSection, setIsNewSection] = useState(false);
  const [isCustomKey, setIsCustomKey] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [formData, setFormData] = useState<Partial<PageSectionData>>({
    title: "",
    subtitle: "",
    badge: "",
    bgImage: "",
    bodyContent: "",
    actionText: "",
    actionUrl: "",
    sortOrder: 0,
    isActive: true,
    metadata: {},
  });
  const [metadataJson, setMetadataJson] = useState("{}");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);

  const closeModal = () => {
    if (localImagePreview) {
      URL.revokeObjectURL(localImagePreview);
    }
    setPendingImageFile(null);
    setLocalImagePreview(null);
    setIsModalOpen(false);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      onShowToast("Image size must be less than 25MB", "error");
      return;
    }

    if (localImagePreview) {
      URL.revokeObjectURL(localImagePreview);
    }

    setPendingImageFile(file);
    setLocalImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  // Gallery Visual Manager Helpers
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const galleryFileInputRef = useRef<HTMLInputElement | null>(null);

  const getGalleryImages = (): Array<{ src: string; alt?: string; size?: string }> => {
    try {
      const parsed = JSON.parse(metadataJson || "{}");
      if (Array.isArray(parsed.images)) {
        return parsed.images;
      }
    } catch {}
    return [];
  };

  const updateGalleryImages = (
    newImages: Array<{ src: string; alt?: string; size?: string }>
  ) => {
    try {
      const cur = JSON.parse(metadataJson || "{}");
      cur.images = newImages;
      setMetadataJson(JSON.stringify(cur, null, 2));
    } catch {
      setMetadataJson(JSON.stringify({ images: newImages }, null, 2));
    }
  };

  const handleGalleryFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    try {
      const currentList = [...getGalleryImages()];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadMediaFile(token, file, "gallery");
        currentList.push({
          src: res.url,
          alt: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          size: currentList.length % 2 === 0 ? "lg" : "sm",
        });
      }
      updateGalleryImages(currentList);
      onShowToast(`${files.length} image(s) uploaded and added to gallery!`, "success");
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to upload image", "error");
    } finally {
      setIsUploadingGallery(false);
      if (e.target) e.target.value = "";
    }
  };

  // News & Media Visual Helpers
  const [uploadingNewsKey, setUploadingNewsKey] = useState<string | null>(null);

  const getNewsMetadata = () => {
    try {
      const parsed = JSON.parse(metadataJson || "{}");
      return {
        tabs: Array.isArray(parsed.tabs) ? parsed.tabs : ["Programs", "News", "Events"],
        featured: parsed.featured || {
          category: "News",
          date: "May 20, 2025",
          title: "Technological Advancements",
          image: "/assets/news-main.png",
          link: "/news",
        },
        articles: Array.isArray(parsed.articles) ? parsed.articles : [],
      };
    } catch {
      return {
        tabs: ["Programs", "News", "Events"],
        featured: {
          category: "News",
          date: "May 20, 2025",
          title: "Technological Advancements",
          image: "/assets/news-main.png",
          link: "/news",
        },
        articles: [],
      };
    }
  };

  const updateNewsMetadata = (updater: (prev: any) => any) => {
    try {
      const cur = JSON.parse(metadataJson || "{}");
      const updated = updater(cur);
      setMetadataJson(JSON.stringify(updated, null, 2));
    } catch {
      const base = getNewsMetadata();
      const updated = updater(base);
      setMetadataJson(JSON.stringify(updated, null, 2));
    }
  };

  const handleNewsImageUpload = async (file: File, onUploaded: (url: string) => void, uploadKey: string) => {
    setUploadingNewsKey(uploadKey);
    try {
      const res = await uploadMediaFile(token, file, "news");
      onUploaded(res.url);
      onShowToast("Image uploaded to news media!", "success");
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to upload image", "error");
    } finally {
      setUploadingNewsKey(null);
    }
  };

  const handleRemoveImage = async () => {
    if (localImagePreview) {
      URL.revokeObjectURL(localImagePreview);
    }
    const currentBgImage = formData.bgImage;
    setPendingImageFile(null);
    setLocalImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      bgImage: "",
    }));

    if (
      currentBgImage &&
      (currentBgImage.includes('/storage/') ||
        currentBgImage.includes(':9000') ||
        currentBgImage.includes('amazonaws.com') ||
        currentBgImage.startsWith('pages/'))
    ) {
      try {
        await deleteMediaFile(token, currentBgImage);
        onShowToast("Image removed from storage.", "info");
      } catch {
        // Quiet fallback
      }
    }
  };

  // Load unique slugs from DB
  const loadPageSlugs = useCallback(async () => {
    try {
      const slugs = await fetchAdminPageSlugs(token);
      setAvailablePages(slugs);
    } catch {
      // Fallback
    }
  }, [token]);

  // Load sections for current page
  const loadSections = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminSections(token, selectedPage);
      setSections(data as AdminSectionItem[]);
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to load sections", "error");
    } finally {
      setIsLoading(false);
    }
  }, [token, selectedPage, onShowToast]);

  useEffect(() => {
    let active = true;
    fetchAdminPageSlugs(token)
      .then((slugs) => {
        if (active) setAvailablePages(slugs);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    let active = true;
    fetchAdminSections(token, selectedPage)
      .then((data) => {
        if (active) setSections(data as AdminSectionItem[]);
      })
      .catch((err: unknown) => {
        if (active) {
          onShowToast(err instanceof Error ? err.message : "Failed to load sections", "error");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, selectedPage, onShowToast]);

  const handleOpenEdit = (section: AdminSectionItem) => {
    if (localImagePreview) {
      URL.revokeObjectURL(localImagePreview);
    }
    setPendingImageFile(null);
    setLocalImagePreview(null);
    setIsNewSection(false);
    setIsCustomKey(false);
    setEditingKey(section.sectionKey || "");
    setFormData({
      title: section.title || "",
      subtitle: section.subtitle || "",
      badge: section.badge || "",
      bgImage: section.bgImage || "",
      bodyContent: section.bodyContent || "",
      actionText: section.actionText || "",
      actionUrl: section.actionUrl || "",
      sortOrder: section.sortOrder ?? 0,
      isActive: section.isActive ?? true,
    });
    setMetadataJson(JSON.stringify(section.metadata || {}, null, 2));
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    if (localImagePreview) {
      URL.revokeObjectURL(localImagePreview);
    }
    setPendingImageFile(null);
    setLocalImagePreview(null);
    setIsNewSection(true);
    setIsCustomKey(false);

    const pageDefs = PAGE_SECTIONS_REGISTRY[selectedPage] || [
      { key: "hero", label: "Hero Banner" },
      { key: "content", label: "Main Content" },
      { key: "cta", label: "Call to Action" },
    ];
    const unusedDef = pageDefs.find((def) => !sections.some((s) => s.sectionKey === def.key));
    const initialDef = unusedDef || pageDefs[0];
    const initialKey = initialDef ? initialDef.key : "hero";

    setEditingKey(initialKey);
    setFormData({
      title: initialDef?.defaultTitle || "",
      subtitle: initialDef?.defaultSubtitle || "",
      badge: initialDef?.defaultBadge || "",
      bgImage: initialDef?.defaultBgImage || "",
      bodyContent: "",
      actionText: "",
      actionUrl: "",
      sortOrder: sections.length * 10,
      isActive: true,
    });
    setMetadataJson(initialDef?.defaultMetadata ? JSON.stringify(initialDef.defaultMetadata, null, 2) : "{}");
    setIsModalOpen(true);
  };

  const handleSectionKeySelect = (keyVal: string) => {
    if (keyVal === "__custom__") {
      setIsCustomKey(true);
      setEditingKey("");
    } else {
      setIsCustomKey(false);
      setEditingKey(keyVal);
      const pageDefs = PAGE_SECTIONS_REGISTRY[selectedPage] || [];
      const match = pageDefs.find((d) => d.key === keyVal);
      if (match) {
        setFormData((prev) => ({
          ...prev,
          title: prev.title || match.defaultTitle || "",
          badge: prev.badge || match.defaultBadge || "",
          subtitle: prev.subtitle || match.defaultSubtitle || "",
          bgImage: prev.bgImage || match.defaultBgImage || "",
        }));
        if (match.defaultMetadata && (metadataJson === "{}" || !metadataJson.trim())) {
          setMetadataJson(JSON.stringify(match.defaultMetadata, null, 2));
        }
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKey.trim()) {
      onShowToast("Section Key is required (e.g. hero, founder_message)", "error");
      return;
    }

    let parsedMeta: Record<string, unknown> = {};
    try {
      if (metadataJson.trim()) {
        parsedMeta = JSON.parse(metadataJson);
      }
    } catch {
      onShowToast("Invalid JSON in Metadata field", "error");
      return;
    }

    setIsSaving(true);
    try {
      let finalBgImage = formData.bgImage;

      // Only upload the file to storage when the admin confirms and saves the section!
      if (pendingImageFile) {
        setIsUploadingImage(true);
        const res = await uploadMediaFile(token, pendingImageFile, `pages/${selectedPage}`);
        finalBgImage = res.url;
        setIsUploadingImage(false);
      }

      await upsertAdminSection(token, selectedPage, editingKey.trim(), {
        ...formData,
        bgImage: finalBgImage,
        metadata: parsedMeta,
      });

      if (localImagePreview) {
        URL.revokeObjectURL(localImagePreview);
      }
      setPendingImageFile(null);
      setLocalImagePreview(null);

      onShowToast(`Section '${editingKey}' saved successfully!`, "success");
      setIsModalOpen(false);
      loadSections();
      loadPageSlugs();
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to save section", "error");
    } finally {
      setIsUploadingImage(false);
      setIsSaving(false);
    }
  };

  const handleDelete = async (sectionKey: string) => {
    if (!confirm(`Are you sure you want to delete section '${sectionKey}' from '${selectedPage}'?`)) {
      return;
    }

    try {
      await deleteAdminSection(token, selectedPage, sectionKey);
      onShowToast(`Section '${sectionKey}' deleted.`, "info");
      loadSections();
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to delete section", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#101828]">Page Content &amp; Dynamic Block Engine</h2>
          <p className="text-xs text-[#4a5565] mt-1">
            Universal headless CMS for hero banners, headlines, rich body copy, and button CTAs across all pages.
          </p>
        </div>

        {/* Page Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            aria-label="Select Page to Manage"
            className="bg-[#f8fafc] border border-[#d0d5dd] text-[#101828] text-xs font-semibold rounded-xl px-3.5 py-2 focus:ring-2 focus:ring-[#00bfff] focus:border-transparent transition-all outline-hidden cursor-pointer"
          >
            {COMMON_PAGES.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.label}
              </option>
            ))}
            {availablePages
              .filter((slug) => !COMMON_PAGES.some((p) => p.slug === slug))
              .map((slug) => (
                <option key={slug} value={slug}>
                  Custom: /{slug}
                </option>
              ))}
          </select>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-[#00bfff] hover:bg-[#00a6e0] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Section Block
          </button>
        </div>
      </div>

      {/* Sections List */}
      {isLoading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#e5e7eb]">
          <div className="w-8 h-8 border-3 border-[#00bfff] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-medium text-[#4a5565]">Loading sections for /{selectedPage}...</p>
        </div>
      ) : sections.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[#d0d5dd]">
          <div className="w-12 h-12 rounded-full bg-[#e6f9ff] text-[#00698c] flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#101828]">No Sections Defined Yet</h3>
          <p className="text-xs text-[#4a5565] max-w-md mx-auto mt-1 mb-4">
            /{selectedPage} currently has no stored blocks in the CMS. Create the first section to make this page dynamically customizable.
          </p>
          <button
            onClick={handleOpenCreate}
            className="bg-[#00bfff] hover:bg-[#00a6e0] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Create Initial &lsquo;hero&rsquo; Block
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sections.map((sec) => {
            const sKey = sec.sectionKey || "section";
            return (
              <div
                key={sec.id || sKey}
                className="bg-white rounded-2xl border border-[#e5e7eb] p-6 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-6 hover:border-[#b0ebff] transition-all"
              >
                {/* Left Column: Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="px-3 py-1 rounded-md bg-[#000080]/5 text-[#000080] font-mono text-xs font-bold border border-[#000080]/10">
                      key: {sKey}
                    </span>
                    {sec.badge && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#e6f9ff] text-[#00698c] text-[11px] font-semibold border border-[#b0ebff]">
                        {sec.badge}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        sec.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}
                    >
                      {sec.isActive ? "Active" : "Inactive Draft"}
                    </span>
                    <span className="text-[11px] text-[#4a5565]">
                      Order: {sec.sortOrder}
                    </span>
                  </div>

                  {sec.title && (
                    <h3 className="text-lg font-bold text-[#101828] font-playfair">
                      {sec.title}
                    </h3>
                  )}

                  {sec.subtitle && (
                    <p className="text-xs text-[#4a5565] leading-relaxed line-clamp-2">
                      {sec.subtitle}
                    </p>
                  )}

                  {/* Body or Action details */}
                  <div className="flex items-center gap-4 text-xs text-[#4a5565] flex-wrap pt-1">
                    {sec.actionText && (
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-[#101828]">CTA:</span>
                        <span className="px-2 py-0.5 bg-[#f3f4f6] rounded-md font-medium">
                          {sec.actionText} &rarr; {sec.actionUrl || "#"}
                        </span>
                      </div>
                    )}
                    {sec.bgImage && (
                      <div className="flex items-center gap-1 truncate max-w-xs">
                        <span className="font-semibold text-[#101828]">Image:</span>
                        <span className="truncate text-[#00698c]">{sec.bgImage}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(sec)}
                    className="px-3.5 py-1.5 rounded-xl border border-[#d0d5dd] hover:bg-[#f9fafb] text-xs font-bold text-[#344054] transition-colors cursor-pointer"
                  >
                    Edit Block
                  </button>
                  <button
                    onClick={() => handleDelete(sKey)}
                    className="px-3.5 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 text-xs font-bold text-red-600 transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-[#e5e7eb] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#e5e7eb]">
              <h3 className="text-base font-bold text-[#101828]">
                {isNewSection ? `Add New Section for /${selectedPage}` : `Edit Section '${editingKey}'`}
              </h3>
              <button
                onClick={closeModal}
                className="text-[#98a2b3] hover:text-[#101828] text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Section Key */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[#344054]">
                      Section Key <span className="text-red-500">*</span>
                    </label>
                    {isNewSection && isCustomKey && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomKey(false);
                          const pageDefs = PAGE_SECTIONS_REGISTRY[selectedPage] || [];
                          const unusedDef = pageDefs.find((def) => !sections.some((s) => s.sectionKey === def.key)) || pageDefs[0];
                          if (unusedDef) setEditingKey(unusedDef.key);
                        }}
                        className="text-[11px] font-medium text-[#00bfff] hover:underline cursor-pointer"
                      >
                        ← Choose from presets
                      </button>
                    )}
                  </div>

                  {!isNewSection ? (
                    <div>
                      <input
                        type="text"
                        disabled
                        value={editingKey}
                        className="w-full bg-[#f2f4f7] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs font-mono text-[#475467] cursor-not-allowed"
                      />
                      <p className="text-[10px] text-[#4a5565] mt-0.5">
                        Key cannot be modified after creation.
                      </p>
                    </div>
                  ) : !isCustomKey ? (
                    <div>
                      <select
                        value={editingKey}
                        onChange={(e) => handleSectionKeySelect(e.target.value)}
                        className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs font-mono text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                        required
                      >
                        <optgroup label={`Preset Sections for "${selectedPage}"`}>
                          {(PAGE_SECTIONS_REGISTRY[selectedPage] || [
                            { key: "hero", label: "Hero Banner" },
                            { key: "content", label: "Main Content" },
                            { key: "cta", label: "Call to Action" },
                          ]).map((def) => {
                            const alreadyExists = sections.some((s) => s.sectionKey === def.key);
                            return (
                              <option key={def.key} value={def.key}>
                                {def.label} ({def.key}) {alreadyExists ? "— [Already Added]" : ""}
                              </option>
                            );
                          })}
                        </optgroup>
                        <optgroup label="Custom / Other">
                          <option value="__custom__">+ Enter Custom Section Key...</option>
                        </optgroup>
                      </select>
                      <p className="text-[10px] text-[#4a5565] mt-0.5">
                        Select predefined section block or enter a custom key.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={editingKey}
                        onChange={(e) => setEditingKey(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "_"))}
                        placeholder="e.g. custom_highlights, alumni_quote"
                        className="w-full bg-[#f9fafb] border border-[#00bfff] rounded-xl px-3 py-2 text-xs font-mono text-[#101828] focus:outline-hidden"
                        required
                        autoFocus
                      />
                      <p className="text-[10px] text-[#4a5565] mt-0.5">
                        Lowercase alphanumeric and underscore/hyphen only.
                      </p>
                    </div>
                  )}
                </div>

                {/* Badge Tag */}
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Badge / Tagline Pill
                  </label>
                  <input
                    type="text"
                    value={formData.badge || ""}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Global Network"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[#344054] mb-1">
                  Main Headline / Title
                </label>
                <input
                  type="text"
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Primary header copy"
                  className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-bold text-[#344054] mb-1">
                  Subtitle / Catchphrase
                </label>
                <textarea
                  rows={2}
                  value={formData.subtitle || ""}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Secondary descriptive copy"
                  className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                />
              </div>

              {/* Background Image & Storage Upload */}
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#1e293b]">
                    Section Image / Hero Banner
                  </label>
                  {(formData.bgImage || pendingImageFile) && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-[11px] font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      Remove image
                    </button>
                  )}
                </div>

                {/* Staged File Banner */}
                {pendingImageFile && (
                  <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                      <p className="text-[11px] text-emerald-800 font-medium truncate">
                        Selected: <span className="font-bold">{pendingImageFile.name}</span> ({(pendingImageFile.size / 1024).toFixed(0)} KB) — will upload to storage upon clicking Save Section.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (localImagePreview) URL.revokeObjectURL(localImagePreview);
                        setPendingImageFile(null);
                        setLocalImagePreview(null);
                      }}
                      className="text-[11px] font-bold text-gray-500 hover:text-gray-800 underline shrink-0 cursor-pointer"
                    >
                      Discard
                    </button>
                  </div>
                )}

                {/* Upload / Select Button */}
                <div className="mb-3">
                  <label
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed text-xs font-medium cursor-pointer transition-all ${
                      isUploadingImage || isSaving
                        ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                        : "bg-white border-[#00bfff] text-[#008cb3] hover:bg-[#f0f9ff] hover:border-[#0099cc]"
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
                      {isUploadingImage
                        ? "Uploading to MinIO / S3 Storage..."
                        : pendingImageFile
                        ? "Choose Different Image"
                        : formData.bgImage
                        ? "Replace Image with New Upload"
                        : "Select Image File (uploads on save)"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploadingImage || isSaving}
                      onChange={handleFileSelected}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Live Image Preview */}
                {(localImagePreview || formData.bgImage) && (
                  <div className="relative mb-3 rounded-xl overflow-hidden border border-[#e2e8f0] bg-[#f1f5f9] max-h-[160px] flex items-center justify-center">
                    <img
                      src={localImagePreview || formData.bgImage || undefined}
                      alt="Section Preview"
                      className="w-full h-[140px] object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md truncate max-w-[90%]">
                      {localImagePreview ? `Local Preview: ${pendingImageFile?.name}` : formData.bgImage}
                    </div>
                  </div>
                )}

                {/* Direct URL / Path input */}
                <div>
                  <span className="block text-[11px] font-medium text-gray-500 mb-1">
                    Or specify image path / URL:
                  </span>
                  <input
                    type="text"
                    value={formData.bgImage || ""}
                    onChange={(e) => {
                      if (localImagePreview) URL.revokeObjectURL(localImagePreview);
                      setPendingImageFile(null);
                      setLocalImagePreview(null);
                      setFormData({ ...formData, bgImage: e.target.value });
                    }}
                    placeholder="http://localhost:9000/iilp-media/... or /assets/..."
                    className="w-full bg-white border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>
              </div>

              {/* CTA Action */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Button CTA Text
                  </label>
                  <input
                    type="text"
                    value={formData.actionText || ""}
                    onChange={(e) => setFormData({ ...formData, actionText: e.target.value })}
                    placeholder="e.g. Apply for Fellowship"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1">
                    Button CTA Destination URL
                  </label>
                  <input
                    type="text"
                    value={formData.actionUrl || ""}
                    onChange={(e) => setFormData({ ...formData, actionUrl: e.target.value })}
                    placeholder="e.g. /fellowships or #apply"
                    className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                  />
                </div>
              </div>

              {/* Rich Body Content */}
              <div>
                <label className="block text-xs font-bold text-[#344054] mb-1">
                  Rich Body Content (Markdown / Text)
                </label>
                <textarea
                  rows={4}
                  value={formData.bodyContent || ""}
                  onChange={(e) => setFormData({ ...formData, bodyContent: e.target.value })}
                  placeholder="Comprehensive section body text or policy paragraph..."
                  className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-2 text-xs text-[#101828] focus:outline-hidden focus:border-[#00bfff]"
                />
              </div>

              {/* Vision Specific Helper for our_vision */}
              {editingKey === "our_vision" && (
                <div className="bg-[#f0f9ff] border border-[#b9e6fe] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00bfff]"></span>
                    <h4 className="text-xs font-bold text-[#00698c] uppercase tracking-wider">
                      Vision Floating Ratings Card
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#344054] mb-1">
                        Student Ratings Count
                      </label>
                      <input
                        type="text"
                        value={(() => {
                          try {
                            return JSON.parse(metadataJson || "{}").studentRatingsCount ?? "5000";
                          } catch {
                            return "5000";
                          }
                        })()}
                        onChange={(e) => {
                          try {
                            const cur = JSON.parse(metadataJson || "{}");
                            cur.studentRatingsCount = e.target.value;
                            setMetadataJson(JSON.stringify(cur, null, 2));
                          } catch {
                            setMetadataJson(JSON.stringify({ studentRatingsCount: e.target.value }, null, 2));
                          }
                        }}
                        placeholder="5000"
                        className="w-full bg-white border border-[#d0d5dd] rounded-xl px-3 py-1.5 text-xs text-[#101828]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#344054] mb-1">
                        Student Ratings Label
                      </label>
                      <input
                        type="text"
                        value={(() => {
                          try {
                            return JSON.parse(metadataJson || "{}").studentRatingsLabel ?? "Student ratings";
                          } catch {
                            return "Student ratings";
                          }
                        })()}
                        onChange={(e) => {
                          try {
                            const cur = JSON.parse(metadataJson || "{}");
                            cur.studentRatingsLabel = e.target.value;
                            setMetadataJson(JSON.stringify(cur, null, 2));
                          } catch {
                            setMetadataJson(JSON.stringify({ studentRatingsLabel: e.target.value }, null, 2));
                          }
                        }}
                        placeholder="Student ratings"
                        className="w-full bg-white border border-[#d0d5dd] rounded-xl px-3 py-1.5 text-xs text-[#101828]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Gallery Specific Visual Manager for image_gallery or gallery */}
              {(editingKey === "image_gallery" || editingKey === "gallery") && (
                <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]"></span>
                      <h4 className="text-xs font-bold text-[#166534] uppercase tracking-wider">
                        Gallery Photos Manager ({getGalleryImages().length} Images)
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={galleryFileInputRef}
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleGalleryFileUpload}
                      />
                      <button
                        type="button"
                        onClick={() => galleryFileInputRef.current?.click()}
                        disabled={isUploadingGallery}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-semibold rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer"
                      >
                        {isUploadingGallery ? (
                          <>
                            <span className="animate-spin text-xs">⏳</span> Uploading...
                          </>
                        ) : (
                          <>
                            <span>+</span> Upload New Images
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt("Enter image URL or asset path (e.g. /assets/gallery-1.png or https://...):");
                          if (!url || !url.trim()) return;
                          const currentList = [...getGalleryImages()];
                          currentList.push({
                            src: url.trim(),
                            alt: "Campus Photo",
                            size: currentList.length % 2 === 0 ? "lg" : "sm",
                          });
                          updateGalleryImages(currentList);
                        }}
                        className="px-2.5 py-1.5 bg-white border border-[#bbf7d0] hover:bg-[#dcfce7] text-[#166534] text-xs font-medium rounded-xl transition cursor-pointer"
                      >
                        + Add by URL
                      </button>
                    </div>
                  </div>

                  {/* List of images */}
                  {getGalleryImages().length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-[#bbf7d0] rounded-xl bg-white/60">
                      <p className="text-xs text-[#166534] font-medium">No images in this gallery yet.</p>
                      <p className="text-[11px] text-[#4b5563] mt-1">Click &quot;Upload New Images&quot; above to add photos directly from your device.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                      {getGalleryImages().map((img, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-[#dcfce7] shadow-2xs hover:border-[#86efac] transition"
                        >
                          {/* Thumbnail */}
                          <div className="w-16 h-16 shrink-0 bg-[#f3f4f6] rounded-lg overflow-hidden relative border border-[#e5e7eb]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.src}
                              alt={img.alt || "preview"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/assets/gallery-student-stairs.png";
                              }}
                            />
                            <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-white text-center font-bold uppercase py-0.5">
                              {img.size === "sm" ? "Small" : "Large"}
                            </span>
                          </div>

                          {/* Inputs: Alt and Size */}
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={img.alt || ""}
                                onChange={(e) => {
                                  const list = [...getGalleryImages()];
                                  list[idx] = { ...list[idx], alt: e.target.value };
                                  updateGalleryImages(list);
                                }}
                                placeholder="Photo alt text / caption"
                                className="flex-1 bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1 text-xs text-[#101828]"
                              />
                              <select
                                value={img.size || "lg"}
                                onChange={(e) => {
                                  const list = [...getGalleryImages()];
                                  list[idx] = { ...list[idx], size: e.target.value };
                                  updateGalleryImages(list);
                                }}
                                className="w-28 bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2 py-1 text-xs text-[#101828]"
                              >
                                <option value="lg">Large (lg)</option>
                                <option value="sm">Small (sm)</option>
                              </select>
                            </div>

                            <p className="text-[10px] font-mono text-[#6b7280] truncate" title={img.src}>
                              {img.src}
                            </p>
                          </div>

                          {/* Actions: Reorder & Delete */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                if (idx === 0) return;
                                const list = [...getGalleryImages()];
                                const temp = list[idx - 1];
                                list[idx - 1] = list[idx];
                                list[idx] = temp;
                                updateGalleryImages(list);
                              }}
                              className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-30 rounded hover:bg-gray-100 cursor-pointer"
                              title="Move Up"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              disabled={idx === getGalleryImages().length - 1}
                              onClick={() => {
                                const list = [...getGalleryImages()];
                                if (idx >= list.length - 1) return;
                                const temp = list[idx + 1];
                                list[idx + 1] = list[idx];
                                list[idx] = temp;
                                updateGalleryImages(list);
                              }}
                              className="p-1 text-gray-500 hover:text-gray-800 disabled:opacity-30 rounded hover:bg-gray-100 cursor-pointer"
                              title="Move Down"
                            >
                              ▼
                            </button>
                            <button
                              type="button"
                              onClick={async () => {
                                const list = [...getGalleryImages()];
                                const targetImg = list[idx];
                                list.splice(idx, 1);
                                updateGalleryImages(list);

                                if (
                                  targetImg?.src &&
                                  (targetImg.src.includes('/storage/') ||
                                    targetImg.src.includes(':9000') ||
                                    targetImg.src.includes('amazonaws.com') ||
                                    targetImg.src.startsWith('gallery/'))
                                ) {
                                  try {
                                    await deleteMediaFile(token, targetImg.src);
                                    onShowToast("Image removed from gallery and storage.", "info");
                                  } catch {
                                    // Quiet fallback
                                  }
                                }
                              }}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                              title="Remove"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* News & Media Specific Visual Manager for news_media */}
              {editingKey === "news_media" && (
                <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></span>
                    <h4 className="text-xs font-bold text-[#0369a1] uppercase tracking-wider">
                      News & Media Center Content Manager
                    </h4>
                  </div>

                  {/* Filter Tabs Config */}
                  <div>
                    <label className="block text-[11px] font-semibold text-[#344054] mb-1">
                      Filter Tabs (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={getNewsMetadata().tabs.join(", ")}
                      onChange={(e) => {
                        const tabs = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                        updateNewsMetadata((prev: any) => ({ ...prev, tabs }));
                      }}
                      placeholder="e.g. Programs, News, Events"
                      className="w-full bg-white border border-[#d0d5dd] rounded-xl px-3 py-1.5 text-xs text-[#101828]"
                    />
                  </div>

                  {/* Featured Main Story (Left Big Card) */}
                  <div className="bg-white border border-[#e0f2fe] rounded-xl p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-[#0284c7]">
                        Featured Main Story (Left Large Card)
                      </h5>
                      <span className="text-[10px] bg-[#e0f2fe] text-[#0369a1] font-semibold px-2 py-0.5 rounded-full">
                        Hero Story
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#475467] mb-1">Headline / Title</label>
                        <input
                          type="text"
                          value={getNewsMetadata().featured.title || ""}
                          onChange={(e) => {
                            updateNewsMetadata((prev: any) => ({
                              ...prev,
                              featured: { ...(prev.featured || {}), title: e.target.value },
                            }));
                          }}
                          placeholder="e.g. Technological Advancements"
                          className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1 text-xs text-[#101828]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#475467] mb-1">Category Badge</label>
                        <input
                          type="text"
                          value={getNewsMetadata().featured.category || ""}
                          onChange={(e) => {
                            updateNewsMetadata((prev: any) => ({
                              ...prev,
                              featured: { ...(prev.featured || {}), category: e.target.value },
                            }));
                          }}
                          placeholder="e.g. News or Programs"
                          className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1 text-xs text-[#101828]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#475467] mb-1">Date</label>
                        <input
                          type="text"
                          value={getNewsMetadata().featured.date || ""}
                          onChange={(e) => {
                            updateNewsMetadata((prev: any) => ({
                              ...prev,
                              featured: { ...(prev.featured || {}), date: e.target.value },
                            }));
                          }}
                          placeholder="e.g. May 20, 2025"
                          className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1 text-xs text-[#101828]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#475467] mb-1">Target Link</label>
                        <input
                          type="text"
                          value={getNewsMetadata().featured.link || ""}
                          onChange={(e) => {
                            updateNewsMetadata((prev: any) => ({
                              ...prev,
                              featured: { ...(prev.featured || {}), link: e.target.value },
                            }));
                          }}
                          placeholder="e.g. /news or /news-details"
                          className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1 text-xs text-[#101828]"
                        />
                      </div>
                    </div>

                    {/* Featured Image Upload */}
                    <div className="flex items-center gap-3 pt-2 border-t border-[#f1f5f9]">
                      <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-[#e2e8f0] bg-gray-50 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getNewsMetadata().featured.image || "/assets/news-main.png"}
                          alt="featured preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/assets/news-main.png";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-medium rounded-lg cursor-pointer transition">
                          {uploadingNewsKey === "featured" ? "Uploading..." : "Upload Featured Image"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingNewsKey === "featured"}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              handleNewsImageUpload(
                                file,
                                (url) => {
                                  updateNewsMetadata((prev: any) => ({
                                    ...prev,
                                    featured: { ...(prev.featured || {}), image: url },
                                  }));
                                },
                                "featured"
                              );
                              e.target.value = "";
                            }}
                          />
                        </label>
                        <p className="text-[10px] font-mono text-gray-500 truncate mt-1">
                          {getNewsMetadata().featured.image || "/assets/news-main.png"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Smaller Grid Articles */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-[#0369a1]">
                        Articles Grid ({getNewsMetadata().articles.length} Stories)
                      </h5>
                      <button
                        type="button"
                        onClick={() => {
                          const data = getNewsMetadata();
                          data.articles.push({
                            id: Date.now(),
                            category: "News",
                            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                            title: "New Article Story",
                            image: "/assets/news-small-1.png",
                            link: "/news",
                          });
                          updateNewsMetadata(() => data);
                        }}
                        className="px-2.5 py-1 bg-white border border-[#bae6fd] hover:bg-[#e0f2fe] text-[#0369a1] text-xs font-semibold rounded-lg transition cursor-pointer"
                      >
                        + Add Article
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                      {getNewsMetadata().articles.map((item: any, idx: number) => (
                        <div
                          key={item.id || idx}
                          className="bg-white p-2.5 rounded-xl border border-[#e0f2fe] shadow-2xs space-y-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.image || "/assets/news-small-1.png"}
                                alt="article preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/assets/news-small-1.png";
                                }}
                              />
                            </div>

                            <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={item.title || ""}
                                onChange={(e) => {
                                  const data = getNewsMetadata();
                                  data.articles[idx].title = e.target.value;
                                  updateNewsMetadata(() => data);
                                }}
                                placeholder="Article Title"
                                className="bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2 py-1 text-xs text-[#101828]"
                              />
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={item.category || ""}
                                  onChange={(e) => {
                                    const data = getNewsMetadata();
                                    data.articles[idx].category = e.target.value;
                                    updateNewsMetadata(() => data);
                                  }}
                                  placeholder="Category (e.g. News, Programs)"
                                  className="w-1/2 bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2 py-1 text-xs text-[#101828]"
                                />
                                <input
                                  type="text"
                                  value={item.date || ""}
                                  onChange={(e) => {
                                    const data = getNewsMetadata();
                                    data.articles[idx].date = e.target.value;
                                    updateNewsMetadata(() => data);
                                  }}
                                  placeholder="Date"
                                  className="w-1/2 bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2 py-1 text-xs text-[#101828]"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <label
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-medium rounded cursor-pointer"
                                title="Change photo"
                              >
                                {uploadingNewsKey === `article-${idx}` ? "..." : "Photo"}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  disabled={uploadingNewsKey === `article-${idx}`}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    handleNewsImageUpload(
                                      file,
                                      (url) => {
                                        const data = getNewsMetadata();
                                        data.articles[idx].image = url;
                                        updateNewsMetadata(() => data);
                                      },
                                      `article-${idx}`
                                    );
                                    e.target.value = "";
                                  }}
                                />
                              </label>

                              <button
                                type="button"
                                onClick={async () => {
                                  const data = getNewsMetadata();
                                  const removed = data.articles[idx];
                                  data.articles.splice(idx, 1);
                                  updateNewsMetadata(() => data);

                                  if (
                                    removed?.image &&
                                    (removed.image.includes('/storage/') ||
                                      removed.image.includes(':9000') ||
                                      removed.image.includes('amazonaws.com') ||
                                      removed.image.startsWith('news/'))
                                  ) {
                                    try {
                                      await deleteMediaFile(token, removed.image);
                                      onShowToast("Image removed from storage.", "info");
                                    } catch {}
                                  }
                                }}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                                title="Delete article"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Metadata JSON */}
              <div>
                <label className="block text-xs font-bold text-[#344054] mb-1">
                  JSON Metadata (Cards, Items, Figma IDs)
                </label>
                <textarea
                  rows={3}
                  value={metadataJson}
                  onChange={(e) => setMetadataJson(e.target.value)}
                  className="w-full bg-[#1e293b] text-[#38bdf8] font-mono text-xs rounded-xl p-3 focus:outline-hidden"
                />
              </div>

              {/* Sequence & Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-[#e5e7eb]">
                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#344054] mb-1">
                      Sort Order
                    </label>
                    <input
                      type="number"
                      value={formData.sortOrder ?? 0}
                      onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })}
                      className="w-24 bg-[#f9fafb] border border-[#d0d5dd] rounded-xl px-3 py-1.5 text-xs text-[#101828]"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer mt-4">
                    <input
                      type="checkbox"
                      checked={formData.isActive ?? true}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-[#00bfff] rounded-sm focus:ring-[#00bfff]"
                    />
                    <span className="text-xs font-bold text-[#344054]">Active on Public Website</span>
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-xs font-bold text-[#4a5565] hover:bg-[#f3f4f6] rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#00bfff] hover:bg-[#00a6e0] rounded-xl shadow-xs transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {isSaving ? "Saving..." : "Save Section"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
