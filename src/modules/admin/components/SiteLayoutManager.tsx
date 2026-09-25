import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchAdminSections,
  upsertAdminSection,
  uploadMediaFile,
  seedAdminLayoutSections,
  PageSectionData,
} from "@/common/services/cms.service";
import {
  DEFAULT_NAVBAR,
  DEFAULT_TOP_BAR,
  DEFAULT_CTA,
  DEFAULT_FOOTER,
  NavbarLayoutData,
  TopBarLayoutData,
  CtaLayoutData,
  FooterLayoutData,
  NavbarLink,
  DropdownGroup,
  ActionButton,
  FooterColumn,
  SocialLink,
  useSiteLayout,
} from "@/common/components/SiteLayoutContext";
import { ToastType } from "@/common/components/Toast";
import ConfirmationModal from "./ConfirmationModal";

interface SiteLayoutManagerProps {
  token: string;
  onShowToast: (message: string, type: ToastType) => void;
}

type SubTab = "branding" | "navbar" | "cta" | "footer";

export function SiteLayoutManager({ token, onShowToast }: SiteLayoutManagerProps) {
  const { refetch: refetchGlobalLayout } = useSiteLayout();
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("branding");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});
  const [pendingPreviews, setPendingPreviews] = useState<Record<string, string>>({});
  const [uploadStatusText, setUploadStatusText] = useState<string | null>(null);

  // Form states
  const [topBar, setTopBar] = useState<TopBarLayoutData>(DEFAULT_TOP_BAR);
  const [navbar, setNavbar] = useState<NavbarLayoutData>(DEFAULT_NAVBAR);
  const [cta, setCta] = useState<CtaLayoutData>(DEFAULT_CTA);
  const [footer, setFooter] = useState<FooterLayoutData>(DEFAULT_FOOTER);

  // Load existing sections from backend
  const applySectionsData = useCallback((sections: PageSectionData[]) => {
    if (!Array.isArray(sections)) return;
    for (const sec of sections) {
      const key = sec.sectionKey;
      const meta = (sec.metadata as Record<string, unknown>) || {};

      if (key === "top_bar") {
        setTopBar({
          phone: (meta.phone as string) ?? DEFAULT_TOP_BAR.phone,
          email: (meta.email as string) ?? DEFAULT_TOP_BAR.email,
          address: (meta.address as string) ?? DEFAULT_TOP_BAR.address,
          tagline: (meta.tagline as string) ?? sec.title ?? DEFAULT_TOP_BAR.tagline,
          isVisible: meta.isVisible !== undefined ? Boolean(meta.isVisible) : (sec.isActive ?? true),
        });
      } else if (key === "navbar") {
        const metaLogo = (meta.logo as Record<string, unknown>) || {};
        setNavbar({
          logo: {
            url: (metaLogo.url as string) || sec.bgImage || DEFAULT_NAVBAR.logo.url,
            alt: (metaLogo.alt as string) || sec.title || DEFAULT_NAVBAR.logo.alt,
            href: (metaLogo.href as string) || DEFAULT_NAVBAR.logo.href || "/",
            height: (metaLogo.height as number) ?? DEFAULT_NAVBAR.logo.height ?? 56,
            fit: (metaLogo.fit as "auto" | "zoom" | "contain") || "auto",
          },
          navLinks: Array.isArray(meta.navLinks) ? (meta.navLinks as NavbarLink[]) : DEFAULT_NAVBAR.navLinks,
          dropdownGroups: Array.isArray(meta.dropdownGroups)
            ? (meta.dropdownGroups as DropdownGroup[])
            : DEFAULT_NAVBAR.dropdownGroups,
          actionButtons: Array.isArray(meta.actionButtons)
            ? (meta.actionButtons as ActionButton[])
            : DEFAULT_NAVBAR.actionButtons,
        });
      } else if (key === "cta") {
        const secBtn = (meta.secondaryButton as Record<string, string>) || {};
        setCta({
          badge: sec.badge ?? DEFAULT_CTA.badge,
          title: sec.title ?? DEFAULT_CTA.title,
          subtitle: sec.subtitle ?? DEFAULT_CTA.subtitle,
          bgImage: sec.bgImage ?? DEFAULT_CTA.bgImage,
          actionText: sec.actionText ?? DEFAULT_CTA.actionText,
          actionUrl: sec.actionUrl ?? DEFAULT_CTA.actionUrl,
          secondaryButton: {
            text: secBtn.text ?? DEFAULT_CTA.secondaryButton.text,
            url: secBtn.url ?? DEFAULT_CTA.secondaryButton.url,
          },
        });
      } else if (key === "footer") {
        const metaNews = (meta.newsletter as Record<string, string>) || {};
        const metaInfo = (meta.meta as Record<string, string>) || {};
        const metaLegal = (meta.legal as Record<string, unknown>) || {};
        setFooter({
          logoUrl: sec.bgImage || DEFAULT_FOOTER.logoUrl,
          watermarkUrl: (meta.watermarkLogo as string) || DEFAULT_FOOTER.watermarkUrl,
          address: sec.bodyContent || (meta.address as string) || DEFAULT_FOOTER.address,
          socialLinks: Array.isArray(meta.socialLinks)
            ? (meta.socialLinks as SocialLink[])
            : DEFAULT_FOOTER.socialLinks,
          columns: Array.isArray(meta.columns) ? (meta.columns as FooterColumn[]) : DEFAULT_FOOTER.columns,
          newsletter: {
            title: metaNews.title || DEFAULT_FOOTER.newsletter.title,
            description: metaNews.description || DEFAULT_FOOTER.newsletter.description,
            placeholder: metaNews.placeholder || DEFAULT_FOOTER.newsletter.placeholder,
            buttonText: metaNews.buttonText || DEFAULT_FOOTER.newsletter.buttonText,
          },
          meta: {
            email: metaInfo.email || DEFAULT_FOOTER.meta.email,
            established: metaInfo.established || DEFAULT_FOOTER.meta.established,
            status: metaInfo.status || DEFAULT_FOOTER.meta.status,
          },
          legal: {
            copyright: (metaLegal.copyright as string) || DEFAULT_FOOTER.legal.copyright,
            links: Array.isArray(metaLegal.links)
              ? (metaLegal.links as Array<{ label: string; href: string }>)
              : DEFAULT_FOOTER.legal.links,
          },
        });
      }
    }
  }, []);

  const onShowToastRef = useRef(onShowToast);
  useEffect(() => {
    onShowToastRef.current = onShowToast;
  }, [onShowToast]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const sections: PageSectionData[] = await fetchAdminSections(token, "layout");
      applySectionsData(sections);
    } catch (err: unknown) {
      console.warn("Could not load backend layout data (will use defaults):", err);
      onShowToastRef.current("Loaded default layout structure (Save to sync to database)", "info");
    } finally {
      setLoading(false);
    }
  }, [token, applySectionsData]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(pendingPreviews).forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [pendingPreviews]);

  // Image file select handler (does NOT upload immediately; stores locally for preview)
  const handleFileSelect = (
    fieldKey: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      onShowToast("Image size must be less than 25MB", "error");
      return;
    }

    if (pendingPreviews[fieldKey]) {
      URL.revokeObjectURL(pendingPreviews[fieldKey]);
    }

    const previewUrl = URL.createObjectURL(file);
    setPendingFiles((prev) => ({ ...prev, [fieldKey]: file }));
    setPendingPreviews((prev) => ({ ...prev, [fieldKey]: previewUrl }));

    onShowToast(`Selected "${file.name}". Click 'Save Changes' to upload and apply.`, "info");
    e.target.value = "";
  };

  const handleRemovePendingFile = (fieldKey: string) => {
    if (pendingPreviews[fieldKey]) {
      URL.revokeObjectURL(pendingPreviews[fieldKey]);
    }
    setPendingFiles((prev) => {
      const copy = { ...prev };
      delete copy[fieldKey];
      return copy;
    });
    setPendingPreviews((prev) => {
      const copy = { ...prev };
      delete copy[fieldKey];
      return copy;
    });
  };

  const uploadFieldIfPending = async (
    fieldKey: string,
    folder: string
  ): Promise<string | null> => {
    const file = pendingFiles[fieldKey];
    if (!file) return null;

    setUploadStatusText(`Uploading ${file.name}...`);
    const res = await uploadMediaFile(token, file, folder);
    if (res && res.url) {
      if (pendingPreviews[fieldKey]) {
        URL.revokeObjectURL(pendingPreviews[fieldKey]);
      }
      setPendingFiles((prev) => {
        const copy = { ...prev };
        delete copy[fieldKey];
        return copy;
      });
      setPendingPreviews((prev) => {
        const copy = { ...prev };
        delete copy[fieldKey];
        return copy;
      });
      return res.url;
    }
    return null;
  };

  // Reset to default layout seeder
  const handleResetDefaults = async () => {
    setSeeding(true);
    try {
      await seedAdminLayoutSections(token);
      onShowToast("Layout reset to default seed successfully!", "success");
      await loadData();
      await refetchGlobalLayout();
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to reset layout", "error");
    } finally {
      setSeeding(false);
    }
  };

  // Save current active tab (uploads pending image files first, then saves section content)
  const handleSaveActiveTab = async () => {
    setSaving(true);
    setUploadStatusText(null);
    try {
      if (activeSubTab === "branding") {
        let headerLogoUrl = navbar.logo.url;
        let footerLogoUrl = footer.logoUrl;
        let footerWatermarkUrl = footer.watermarkUrl;

        // 1. Upload any pending logo/watermark files
        if (pendingFiles.headerLogo) {
          const uploaded = await uploadFieldIfPending("headerLogo", "layout/branding");
          if (uploaded) {
            headerLogoUrl = uploaded;
            setNavbar((p) => ({ ...p, logo: { ...p.logo, url: uploaded } }));
          }
        }

        if (pendingFiles.footerLogo) {
          const uploaded = await uploadFieldIfPending("footerLogo", "layout/branding");
          if (uploaded) {
            footerLogoUrl = uploaded;
            setFooter((p) => ({ ...p, logoUrl: uploaded }));
          }
        }

        if (pendingFiles.footerWatermark) {
          const uploaded = await uploadFieldIfPending("footerWatermark", "layout/branding");
          if (uploaded) {
            footerWatermarkUrl = uploaded;
            setFooter((p) => ({ ...p, watermarkUrl: uploaded }));
          }
        }

        setUploadStatusText("Saving settings to database...");

        // 2. Save top_bar
        await upsertAdminSection(token, "layout", "top_bar", {
          title: topBar.tagline,
          isActive: topBar.isVisible,
          sortOrder: 0,
          metadata: {
            phone: topBar.phone,
            email: topBar.email,
            address: topBar.address,
            tagline: topBar.tagline,
            isVisible: topBar.isVisible,
          },
        });

        // 3. Save navbar with updated header logo URL
        await upsertAdminSection(token, "layout", "navbar", {
          title: navbar.logo.alt,
          bgImage: headerLogoUrl,
          metadata: {
            ...navbar,
            logo: {
              ...navbar.logo,
              url: headerLogoUrl,
            },
          },
        });

        // 4. Save footer with updated footer logo and watermark URLs
        await upsertAdminSection(token, "layout", "footer", {
          bgImage: footerLogoUrl,
          metadata: {
            ...footer,
            logoUrl: footerLogoUrl,
            watermarkUrl: footerWatermarkUrl,
            watermarkLogo: footerWatermarkUrl,
          },
        });

        onShowToast("Branding & Top Bar saved successfully!", "success");
      } else if (activeSubTab === "navbar") {
        let headerLogoUrl = navbar.logo.url;
        if (pendingFiles.headerLogo) {
          const uploaded = await uploadFieldIfPending("headerLogo", "layout/navbar");
          if (uploaded) {
            headerLogoUrl = uploaded;
            setNavbar((p) => ({ ...p, logo: { ...p.logo, url: uploaded } }));
          }
        }

        setUploadStatusText("Saving navigation menu...");
        await upsertAdminSection(token, "layout", "navbar", {
          title: navbar.logo.alt,
          bgImage: headerLogoUrl,
          actionText: navbar.actionButtons?.[0]?.name || "Apply Now",
          actionUrl: navbar.actionButtons?.[0]?.href || "/fellowships#apply",
          sortOrder: 1,
          metadata: {
            ...navbar,
            logo: {
              ...navbar.logo,
              url: headerLogoUrl,
            },
          },
        });
        onShowToast("Navbar & Navigation Menu saved successfully!", "success");
      } else if (activeSubTab === "cta") {
        let ctaBg = cta.bgImage;
        if (pendingFiles.ctaBgImage) {
          const uploaded = await uploadFieldIfPending("ctaBgImage", "layout/cta");
          if (uploaded) {
            ctaBg = uploaded;
            setCta((p) => ({ ...p, bgImage: uploaded }));
          }
        }

        setUploadStatusText("Saving Call to Action banner...");
        await upsertAdminSection(token, "layout", "cta", {
          badge: cta.badge,
          title: cta.title,
          subtitle: cta.subtitle,
          bgImage: ctaBg,
          actionText: cta.actionText,
          actionUrl: cta.actionUrl,
          sortOrder: 2,
          metadata: {
            ...cta,
            bgImage: ctaBg,
            secondaryButton: cta.secondaryButton,
          },
        });
        onShowToast("Call To Action section saved successfully!", "success");
      } else if (activeSubTab === "footer") {
        let footerLogoUrl = footer.logoUrl;
        let footerWatermarkUrl = footer.watermarkUrl;

        if (pendingFiles.footerLogo) {
          const uploaded = await uploadFieldIfPending("footerLogo", "layout/footer");
          if (uploaded) {
            footerLogoUrl = uploaded;
            setFooter((p) => ({ ...p, logoUrl: uploaded }));
          }
        }

        if (pendingFiles.footerWatermark) {
          const uploaded = await uploadFieldIfPending("footerWatermark", "layout/footer");
          if (uploaded) {
            footerWatermarkUrl = uploaded;
            setFooter((p) => ({ ...p, watermarkUrl: uploaded }));
          }
        }

        setUploadStatusText("Saving footer content...");
        await upsertAdminSection(token, "layout", "footer", {
          title: "International Institute for Law and Politics (IILP)",
          bgImage: footerLogoUrl,
          bodyContent: footer.address,
          sortOrder: 3,
          metadata: {
            ...footer,
            logoUrl: footerLogoUrl,
            watermarkUrl: footerWatermarkUrl,
            watermarkLogo: footerWatermarkUrl,
          },
        });
        onShowToast("Footer content saved successfully!", "success");
      }

      await loadData();
      await refetchGlobalLayout();
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to save section", "error");
    } finally {
      setSaving(false);
      setUploadStatusText(null);
    }
  };

  // ==================== NAV LINK HELPERS ====================
  const handleAddNavLink = () => {
    setNavbar((prev) => ({
      ...prev,
      navLinks: [...prev.navLinks, { name: "New Page", href: "/new-page" }],
    }));
  };

  const handleUpdateNavLink = (idx: number, field: "name" | "href", val: string) => {
    setNavbar((prev) => {
      const updated = [...prev.navLinks];
      updated[idx] = { ...updated[idx], [field]: val };
      return { ...prev, navLinks: updated };
    });
  };

  const handleRemoveNavLink = (idx: number) => {
    setNavbar((prev) => ({
      ...prev,
      navLinks: prev.navLinks.filter((_, i) => i !== idx),
    }));
  };

  // ==================== ACTION BUTTON HELPERS ====================
  const handleAddActionButton = () => {
    setNavbar((prev) => ({
      ...prev,
      actionButtons: [...prev.actionButtons, { name: "New Action", href: "#", variant: "default" }],
    }));
  };

  const handleUpdateActionButton = (
    idx: number,
    field: "name" | "href" | "variant",
    val: string
  ) => {
    setNavbar((prev) => {
      const updated = [...prev.actionButtons];
      updated[idx] = { ...updated[idx], [field]: val } as ActionButton;
      return { ...prev, actionButtons: updated };
    });
  };

  const handleRemoveActionButton = (idx: number) => {
    setNavbar((prev) => ({
      ...prev,
      actionButtons: prev.actionButtons.filter((_, i) => i !== idx),
    }));
  };

  // ==================== DROPDOWN GROUP HELPERS ====================
  const handleAddDropdownGroup = () => {
    setNavbar((prev) => ({
      ...prev,
      dropdownGroups: [
        ...prev.dropdownGroups,
        {
          category: "New Category",
          items: [
            {
              name: "Sample Link",
              href: "/sample",
              description: "Short description of this page",
            },
          ],
        },
      ],
    }));
  };

  const handleRemoveDropdownGroup = (gIdx: number) => {
    setNavbar((prev) => ({
      ...prev,
      dropdownGroups: prev.dropdownGroups.filter((_, i) => i !== gIdx),
    }));
  };

  const handleUpdateDropdownCategory = (gIdx: number, category: string) => {
    setNavbar((prev) => {
      const updated = [...prev.dropdownGroups];
      updated[gIdx] = { ...updated[gIdx], category };
      return { ...prev, dropdownGroups: updated };
    });
  };

  const handleAddDropdownItem = (gIdx: number) => {
    setNavbar((prev) => {
      const updated = [...prev.dropdownGroups];
      updated[gIdx] = {
        ...updated[gIdx],
        items: [
          ...updated[gIdx].items,
          { name: "New Item", href: "/page", description: "Item description" },
        ],
      };
      return { ...prev, dropdownGroups: updated };
    });
  };

  const handleUpdateDropdownItem = (
    gIdx: number,
    iIdx: number,
    field: "name" | "href" | "description",
    val: string
  ) => {
    setNavbar((prev) => {
      const updated = [...prev.dropdownGroups];
      const items = [...updated[gIdx].items];
      items[iIdx] = { ...items[iIdx], [field]: val };
      updated[gIdx] = { ...updated[gIdx], items };
      return { ...prev, dropdownGroups: updated };
    });
  };

  const handleRemoveDropdownItem = (gIdx: number, iIdx: number) => {
    setNavbar((prev) => {
      const updated = [...prev.dropdownGroups];
      updated[gIdx] = {
        ...updated[gIdx],
        items: updated[gIdx].items.filter((_, i) => i !== iIdx),
      };
      return { ...prev, dropdownGroups: updated };
    });
  };

  // ==================== FOOTER COLUMNS HELPERS ====================
  const handleUpdateColumnTitle = (cIdx: number, title: string) => {
    setFooter((prev) => {
      const columns = [...prev.columns];
      columns[cIdx] = { ...columns[cIdx], title };
      return { ...prev, columns };
    });
  };

  const handleAddColumnLink = (cIdx: number) => {
    setFooter((prev) => {
      const columns = [...prev.columns];
      columns[cIdx] = {
        ...columns[cIdx],
        links: [...columns[cIdx].links, { label: "New Link", href: "/link" }],
      };
      return { ...prev, columns };
    });
  };

  const handleUpdateColumnLink = (
    cIdx: number,
    lIdx: number,
    field: "label" | "href",
    val: string
  ) => {
    setFooter((prev) => {
      const columns = [...prev.columns];
      const links = [...columns[cIdx].links];
      links[lIdx] = { ...links[lIdx], [field]: val };
      columns[cIdx] = { ...columns[cIdx], links };
      return { ...prev, columns };
    });
  };

  const handleRemoveColumnLink = (cIdx: number, lIdx: number) => {
    setFooter((prev) => {
      const columns = [...prev.columns];
      columns[cIdx] = {
        ...columns[cIdx],
        links: columns[cIdx].links.filter((_, i) => i !== lIdx),
      };
      return { ...prev, columns };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00bfff]"></div>
        <span className="ml-3 text-gray-500 font-sans">Loading layout settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Global Action Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <span>🌐</span> Dynamic Layout &amp; Branding CMS
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage Navbar, Logo, Top Contact Strip, Call-to-Action Banner, and Footer dynamically across the entire website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            disabled={seeding || saving}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            title="Restore default initial design and links"
          >
            {seeding ? "Resetting..." : "🔄 Reset to Defaults"}
          </button>

          <button
            type="button"
            onClick={handleSaveActiveTab}
            disabled={saving || seeding}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-[#00bfff] hover:bg-[#009ecc] rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>{uploadStatusText || "Saving..."}</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab("branding")}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeSubTab === "branding"
              ? "bg-[#e6f9ff] text-[#00698c] shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span>🏷️</span> Branding &amp; Top Bar
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("navbar")}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeSubTab === "navbar"
              ? "bg-[#e6f9ff] text-[#00698c] shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span>🧭</span> Navbar &amp; Menu
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("cta")}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeSubTab === "cta"
              ? "bg-[#e6f9ff] text-[#00698c] shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span>📣</span> Call to Action (CTA)
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("footer")}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeSubTab === "footer"
              ? "bg-[#e6f9ff] text-[#00698c] shadow-xs"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span>👣</span> Footer Content
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: BRANDING & TOP BAR                                             */}
      {/* ========================================================================= */}
      {activeSubTab === "branding" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Header & Footer Logos */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span>🖼️</span> Site Logos &amp; Identity
            </h3>

            {/* Header Logo */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Header Main Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-16 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 p-2 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pendingPreviews.headerLogo || navbar.logo.url || "/assets/logo.png"}
                    alt="Logo Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                  {pendingFiles.headerLogo && (
                    <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full">
                      New
                    </span>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={navbar.logo.url}
                    onChange={(e) =>
                      setNavbar((p) => ({
                        ...p,
                        logo: { ...p.logo, url: e.target.value },
                      }))
                    }
                    placeholder="/assets/logo.png or https://..."
                    className="w-full text-xs font-mono px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="cursor-pointer px-3.5 py-1.5 text-xs font-semibold text-[#00698c] bg-[#e6f9ff] hover:bg-[#d6f4ff] rounded-lg transition-colors inline-flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      {pendingFiles.headerLogo ? "Change Selected Logo" : "Choose Logo File"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileSelect("headerLogo", e)}
                      />
                    </label>
                    <span className="text-[11px] text-gray-400">PNG, SVG, or WEBP (Uploads on Save)</span>
                  </div>
                  {pendingFiles.headerLogo && (
                    <div className="flex items-center justify-between text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg mt-1">
                      <span className="truncate max-w-[240px] font-medium flex items-center gap-1">
                        <span>📎</span> {pendingFiles.headerLogo.name} (Ready to upload)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePendingFile("headerLogo")}
                        className="text-red-600 hover:underline font-semibold ml-2 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Alt Text</label>
                  <input
                    type="text"
                    value={navbar.logo.alt}
                    onChange={(e) =>
                      setNavbar((p) => ({
                        ...p,
                        logo: { ...p.logo, alt: e.target.value },
                      }))
                    }
                    className="w-full text-xs px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Logo Destination Link</label>
                  <input
                    type="text"
                    value={navbar.logo.href || "/"}
                    onChange={(e) =>
                      setNavbar((p) => ({
                        ...p,
                        logo: { ...p.logo, href: e.target.value },
                      }))
                    }
                    className="w-full text-xs px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                  />
                </div>
              </div>

              {/* Logo Display Sizing Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Display Height (px)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={32}
                      max={120}
                      value={navbar.logo.height ?? 56}
                      onChange={(e) =>
                        setNavbar((p) => ({
                          ...p,
                          logo: { ...p.logo, height: Number(e.target.value) || 56 },
                        }))
                      }
                      className="w-20 text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff] bg-white font-mono"
                    />
                    <div className="flex items-center gap-1">
                      {[48, 56, 64, 72].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() =>
                            setNavbar((p) => ({
                              ...p,
                              logo: { ...p.logo, height: h },
                            }))
                          }
                          className={`text-[11px] px-2 py-1 rounded-md transition-colors ${
                            (navbar.logo.height ?? 56) === h
                              ? "bg-[#00bfff] text-white font-bold"
                              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {h}px
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Fit &amp; Zoom Mode
                  </label>
                  <select
                    value={navbar.logo.fit || "auto"}
                    onChange={(e) =>
                      setNavbar((p) => ({
                        ...p,
                        logo: { ...p.logo, fit: e.target.value as "auto" | "zoom" | "contain" },
                      }))
                    }
                    className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff] bg-white"
                  >
                    <option value="auto">Auto (Smart detect square vs horizontal)</option>
                    <option value="zoom">Zoom &amp; Crop Margins (Best for square logo)</option>
                    <option value="contain">Contain (Full canvas without zoom)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer Logo */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Footer Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-16 rounded-xl border border-gray-700 bg-[#000036] flex items-center justify-center overflow-hidden shrink-0 p-2 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pendingPreviews.footerLogo || footer.logoUrl || "/assets/footer-logo.png"}
                    alt="Footer Logo Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                  {pendingFiles.footerLogo && (
                    <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full">
                      New
                    </span>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={footer.logoUrl}
                    onChange={(e) =>
                      setFooter((p) => ({ ...p, logoUrl: e.target.value }))
                    }
                    placeholder="/assets/footer-logo.png"
                    className="w-full text-xs font-mono px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="cursor-pointer px-3.5 py-1.5 text-xs font-semibold text-[#00698c] bg-[#e6f9ff] hover:bg-[#d6f4ff] rounded-lg transition-colors inline-flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      {pendingFiles.footerLogo ? "Change Selected Footer Logo" : "Choose Footer Logo File"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileSelect("footerLogo", e)}
                      />
                    </label>
                    <span className="text-[11px] text-gray-400">Uploads on Save</span>
                  </div>
                  {pendingFiles.footerLogo && (
                    <div className="flex items-center justify-between text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg mt-1">
                      <span className="truncate max-w-[240px] font-medium flex items-center gap-1">
                        <span>📎</span> {pendingFiles.footerLogo.name} (Ready to upload)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePendingFile("footerLogo")}
                        className="text-red-600 hover:underline font-semibold ml-2 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Watermark Logo */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Footer Background Watermark Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-16 rounded-xl border border-gray-700 bg-[#000036] flex items-center justify-center overflow-hidden shrink-0 p-2 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pendingPreviews.footerWatermark || footer.watermarkUrl || "/assets/footer-logo.png"}
                    alt="Watermark Preview"
                    className="max-h-full max-w-full object-contain opacity-50"
                  />
                  {pendingFiles.footerWatermark && (
                    <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full">
                      New
                    </span>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={footer.watermarkUrl}
                    onChange={(e) =>
                      setFooter((p) => ({ ...p, watermarkUrl: e.target.value }))
                    }
                    placeholder="/assets/footer-logo.png"
                    className="w-full text-xs font-mono px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                  />
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="cursor-pointer px-3.5 py-1.5 text-xs font-semibold text-[#00698c] bg-[#e6f9ff] hover:bg-[#d6f4ff] rounded-lg transition-colors inline-flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      {pendingFiles.footerWatermark ? "Change Selected Watermark" : "Choose Watermark File"}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileSelect("footerWatermark", e)}
                      />
                    </label>
                    <span className="text-[11px] text-gray-400">Uploads on Save</span>
                  </div>
                  {pendingFiles.footerWatermark && (
                    <div className="flex items-center justify-between text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg mt-1">
                      <span className="truncate max-w-[240px] font-medium flex items-center gap-1">
                        <span>📎</span> {pendingFiles.footerWatermark.name} (Ready to upload)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePendingFile("footerWatermark")}
                        className="text-red-600 hover:underline font-semibold ml-2 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Top Contact Strip Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>📞</span> Top Header Contact Strip
              </h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={topBar.isVisible}
                  onChange={(e) =>
                    setTopBar((p) => ({ ...p, isVisible: e.target.checked }))
                  }
                  className="rounded text-[#00bfff] focus:ring-0 w-4 h-4"
                />
                <span className="text-xs font-semibold text-gray-700">Display Strip</span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={topBar.phone}
                  onChange={(e) =>
                    setTopBar((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="+1 (800) 123-4567"
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00bfff]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={topBar.email}
                  onChange={(e) =>
                    setTopBar((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="info@iilp.org"
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00bfff]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Campus Address / Location
                </label>
                <input
                  type="text"
                  value={topBar.address}
                  onChange={(e) =>
                    setTopBar((p) => ({ ...p, address: e.target.value }))
                  }
                  placeholder="123 University Lane, New City, California, USA"
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00bfff]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Header Tagline / Slogan (Right Side)
                </label>
                <input
                  type="text"
                  value={topBar.tagline}
                  onChange={(e) =>
                    setTopBar((p) => ({ ...p, tagline: e.target.value }))
                  }
                  placeholder="Empowering Futures Since 1890"
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00bfff]"
                />
              </div>

              <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100 text-xs text-blue-900 leading-relaxed">
                💡 <strong>Preview Note:</strong> When enabled, this blue bar appears at the very top of the desktop screen showing your direct phone, official email, physical campus location, and institute slogan.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: NAVBAR & MENU                                                  */}
      {/* ========================================================================= */}
      {activeSubTab === "navbar" && (
        <div className="space-y-6">
          {/* Primary Nav Links */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Primary Navigation Links
                </h3>
                <p className="text-xs text-gray-500">
                  Main horizontal menu items shown in the header on desktop and mobile.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddNavLink}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#00bfff] hover:bg-[#009ecc] rounded-lg transition-colors flex items-center gap-1"
              >
                + Add Link
              </button>
            </div>

            <div className="space-y-2">
              {navbar.navLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <span className="text-xs font-bold text-gray-400 w-6">#{idx + 1}</span>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => handleUpdateNavLink(idx, "name", e.target.value)}
                      placeholder="Link Label (e.g. About IILP)"
                      className="text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => handleUpdateNavLink(idx, "href", e.target.value)}
                      placeholder="Destination URL (e.g. /about)"
                      className="text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveNavLink(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                    title="Remove Link"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action / CTA Buttons */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Header Action Buttons (Right Side)
                </h3>
                <p className="text-xs text-gray-500">
                  CTA buttons on the top right (e.g. Donate, Contact, Apply Now).
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddActionButton}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#00bfff] hover:bg-[#009ecc] rounded-lg transition-colors flex items-center gap-1"
              >
                + Add Button
              </button>
            </div>

            <div className="space-y-2">
              {navbar.actionButtons.map((btn, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <span className="text-xs font-bold text-gray-400 w-6">#{idx + 1}</span>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={btn.name}
                      onChange={(e) => handleUpdateActionButton(idx, "name", e.target.value)}
                      placeholder="Button Label"
                      className="text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                    />
                    <input
                      type="text"
                      value={btn.href}
                      onChange={(e) => handleUpdateActionButton(idx, "href", e.target.value)}
                      placeholder="Target URL (e.g. /donate)"
                      className="text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                    />
                    <select
                      value={btn.variant || "default"}
                      onChange={(e) => handleUpdateActionButton(idx, "variant", e.target.value)}
                      className="text-xs px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                    >
                      <option value="primary">Primary (Cyan Fill)</option>
                      <option value="outline">Outline (White / Gray Border)</option>
                      <option value="default">Text Link (No Border)</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveActionButton(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Others Mega-Dropdown Groups */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  &quot;Others&quot; Mega-Menu Dropdown Groups
                </h3>
                <p className="text-xs text-gray-500">
                  Sub-categories and deep links displayed inside the expandable &quot;Others&quot; dropdown menu.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddDropdownGroup}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#00698c] hover:bg-[#00506b] rounded-lg transition-colors flex items-center gap-1"
              >
                + Add Category Group
              </button>
            </div>

            <div className="space-y-6">
              {navbar.dropdownGroups.map((group, gIdx) => (
                <div
                  key={gIdx}
                  className="bg-gray-50/80 rounded-2xl border border-gray-200 p-5 space-y-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400">Category #{gIdx + 1}</span>
                      <input
                        type="text"
                        value={group.category}
                        onChange={(e) => handleUpdateDropdownCategory(gIdx, e.target.value)}
                        placeholder="Category Name"
                        className="text-sm font-bold text-[#00698c] px-3 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff] max-w-sm w-full"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddDropdownItem(gIdx)}
                        className="px-3 py-1 text-xs font-semibold text-[#00698c] bg-white border border-[#b0ebff] hover:bg-[#e6f9ff] rounded-lg transition-colors"
                      >
                        + Add Item
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveDropdownGroup(gIdx)}
                        className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove Category
                      </button>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                    {group.items.map((item, iIdx) => (
                      <div
                        key={iIdx}
                        className="bg-white p-3 rounded-xl border border-gray-200 flex items-start gap-3"
                      >
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              handleUpdateDropdownItem(gIdx, iIdx, "name", e.target.value)
                            }
                            placeholder="Item Title"
                            className="text-xs font-semibold px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                          />
                          <input
                            type="text"
                            value={item.href}
                            onChange={(e) =>
                              handleUpdateDropdownItem(gIdx, iIdx, "href", e.target.value)
                            }
                            placeholder="URL (/publications)"
                            className="text-xs px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                          />
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) =>
                              handleUpdateDropdownItem(gIdx, iIdx, "description", e.target.value)
                            }
                            placeholder="Short description..."
                            className="text-xs text-gray-500 px-2.5 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDropdownItem(gIdx, iIdx)}
                          className="p-1 text-gray-300 hover:text-red-500"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: CALL TO ACTION (CTA)                                           */}
      {/* ========================================================================= */}
      {activeSubTab === "cta" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Text & Buttons */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span>📣</span> CTA Texts &amp; Badges
            </h3>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                Pill Badge Text
              </label>
              <input
                type="text"
                value={cta.badge}
                onChange={(e) => setCta((p) => ({ ...p, badge: e.target.value }))}
                placeholder="Start Your Journey"
                className="w-full text-sm px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00bfff]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                Main Headline / Title
              </label>
              <input
                type="text"
                value={cta.title}
                onChange={(e) => setCta((p) => ({ ...p, title: e.target.value }))}
                placeholder="Join the IILP Community Today"
                className="w-full text-sm font-semibold px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00bfff]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                Subtitle Copy
              </label>
              <textarea
                rows={4}
                value={cta.subtitle}
                onChange={(e) => setCta((p) => ({ ...p, subtitle: e.target.value }))}
                placeholder="Whether you are a scholar, practitioner..."
                className="w-full text-sm px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00bfff]"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-gray-100 space-y-3">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Action Buttons
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Primary Button Label</label>
                  <input
                    type="text"
                    value={cta.actionText}
                    onChange={(e) => setCta((p) => ({ ...p, actionText: e.target.value }))}
                    placeholder="Partner with Us"
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Primary Destination URL</label>
                  <input
                    type="text"
                    value={cta.actionUrl}
                    onChange={(e) => setCta((p) => ({ ...p, actionUrl: e.target.value }))}
                    placeholder="/partner"
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Secondary Button Label</label>
                  <input
                    type="text"
                    value={cta.secondaryButton?.text || ""}
                    onChange={(e) =>
                      setCta((p) => ({
                        ...p,
                        secondaryButton: {
                          ...p.secondaryButton,
                          text: e.target.value,
                        },
                      }))
                    }
                    placeholder="Donate to Support IILP"
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Secondary Destination URL</label>
                  <input
                    type="text"
                    value={cta.secondaryButton?.url || ""}
                    onChange={(e) =>
                      setCta((p) => ({
                        ...p,
                        secondaryButton: {
                          ...p.secondaryButton,
                          url: e.target.value,
                        },
                      }))
                    }
                    placeholder="/donate"
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Background Image & Live Preview */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-5">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span>🖼️</span> Background Graphic &amp; Live Card
            </h3>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Background Graphic URL
              </label>
              <input
                type="text"
                value={cta.bgImage}
                onChange={(e) => setCta((p) => ({ ...p, bgImage: e.target.value }))}
                placeholder="/assets/cta-bg.png"
                className="w-full text-xs font-mono px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
              />
              <div className="flex items-center gap-2 flex-wrap">
                <label className="inline-flex items-center gap-1.5 cursor-pointer px-4 py-2 text-xs font-semibold text-[#00698c] bg-[#e6f9ff] hover:bg-[#d6f4ff] rounded-xl transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {pendingFiles.ctaBgImage ? "Change Selected CTA Graphic" : "Choose New CTA Background"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect("ctaBgImage", e)}
                  />
                </label>
                <span className="text-[11px] text-gray-400">Uploads when you click &apos;Save Changes&apos;</span>
              </div>
              {pendingFiles.ctaBgImage && (
                <div className="flex items-center justify-between text-xs bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg mt-1">
                  <span className="truncate max-w-[240px] font-medium flex items-center gap-1">
                    <span>📎</span> {pendingFiles.ctaBgImage.name} (Ready to upload)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemovePendingFile("ctaBgImage")}
                    className="text-red-600 hover:underline font-semibold ml-2 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Visual Box Preview */}
            <div 
              className="rounded-2xl overflow-hidden border border-gray-700 bg-[#000036] bg-cover bg-center p-6 text-center text-white relative flex flex-col items-center justify-center gap-4 min-h-[220px]"
              style={{
                backgroundImage: (pendingPreviews.ctaBgImage || cta.bgImage)
                  ? `linear-gradient(rgba(0,0,54,0.7), rgba(0,0,54,0.7)), url(${pendingPreviews.ctaBgImage || cta.bgImage})`
                  : undefined
              }}
            >
              {cta.badge && (
                <span className="px-3 py-1 rounded-full border border-[#33ccff] bg-[#e6f9ff]/10 text-[11px] font-semibold tracking-wider uppercase text-white">
                  {cta.badge}
                </span>
              )}
              <h4 className="text-lg font-bold text-white max-w-sm">{cta.title}</h4>
              <p className="text-xs text-[#e4e3fc] line-clamp-2 max-w-xs">{cta.subtitle}</p>
              <div className="flex items-center gap-2 pt-2">
                <span className="px-3 py-1.5 rounded-full bg-[#1e2939] text-[11px] font-semibold text-white">
                  {cta.actionText || "Primary Button"}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white text-gray-900 text-[11px] font-semibold">
                  {cta.secondaryButton?.text || "Secondary Button"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: FOOTER CONTENT                                                 */}
      {/* ========================================================================= */}
      {activeSubTab === "footer" && (
        <div className="space-y-6">
          {/* Address, Socials & Meta */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <span>📍</span> Contact &amp; Physical Address
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                  Physical Campus / Office Address
                </label>
                <textarea
                  rows={2}
                  value={footer.address}
                  onChange={(e) => setFooter((p) => ({ ...p, address: e.target.value }))}
                  className="w-full text-sm px-3.5 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#00bfff]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Official Public Email</label>
                  <input
                    type="email"
                    value={footer.meta?.email || ""}
                    onChange={(e) =>
                      setFooter((p) => ({
                        ...p,
                        meta: { ...p.meta, email: e.target.value },
                      }))
                    }
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Established Date</label>
                  <input
                    type="text"
                    value={footer.meta?.established || ""}
                    onChange={(e) =>
                      setFooter((p) => ({
                        ...p,
                        meta: { ...p.meta, established: e.target.value },
                      }))
                    }
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Institution Legal Status Note</label>
                <input
                  type="text"
                  value={footer.meta?.status || ""}
                  onChange={(e) =>
                    setFooter((p) => ({
                      ...p,
                      meta: { ...p.meta, status: e.target.value },
                    }))
                  }
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                />
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <span>📱</span> Social Media Channels
              </h3>

              <div className="space-y-3">
                {footer.socialLinks.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <label className="w-24 text-xs font-bold capitalize text-gray-700 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.isActive}
                        onChange={(e) => {
                          const updated = [...footer.socialLinks];
                          updated[idx] = { ...updated[idx], isActive: e.target.checked };
                          setFooter((p) => ({ ...p, socialLinks: updated }));
                        }}
                        className="rounded text-[#00bfff] focus:ring-0"
                      />
                      {item.platform}
                    </label>
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => {
                        const updated = [...footer.socialLinks];
                        updated[idx] = { ...updated[idx], url: e.target.value };
                        setFooter((p) => ({ ...p, socialLinks: updated }));
                      }}
                      placeholder={`https://${item.platform}.com/...`}
                      className="flex-1 text-xs px-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4 Footer Columns of Links */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <span>📑</span> 4-Column Navigation Links
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {footer.columns.map((col, cIdx) => (
                <div key={cIdx} className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400">Column {cIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleAddColumnLink(cIdx)}
                      className="text-xs text-[#00698c] font-semibold hover:underline"
                    >
                      + Add Link
                    </button>
                  </div>

                  <input
                    type="text"
                    value={col.title}
                    onChange={(e) => handleUpdateColumnTitle(cIdx, e.target.value)}
                    placeholder="Column Header"
                    className="w-full text-xs font-bold text-gray-900 px-3 py-1.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                  />

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {col.links.map((link, lIdx) => (
                      <div key={lIdx} className="bg-white p-2 rounded-lg border border-gray-100 flex items-center gap-2">
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) =>
                              handleUpdateColumnLink(cIdx, lIdx, "label", e.target.value)
                            }
                            placeholder="Link Title"
                            className="w-full text-[11px] px-2 py-1 border border-gray-100 rounded focus:outline-none focus:border-[#00bfff]"
                          />
                          <input
                            type="text"
                            value={link.href}
                            onChange={(e) =>
                              handleUpdateColumnLink(cIdx, lIdx, "href", e.target.value)
                            }
                            placeholder="URL (/path)"
                            className="w-full text-[11px] px-2 py-1 border border-gray-100 rounded focus:outline-none focus:border-[#00bfff]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveColumnLink(cIdx, lIdx)}
                          className="text-gray-300 hover:text-red-500 p-1"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter & Legal Copyright */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Newsletter Settings */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <span>📧</span> Newsletter Subscription Block
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={footer.newsletter?.title || ""}
                  onChange={(e) =>
                    setFooter((p) => ({
                      ...p,
                      newsletter: { ...p.newsletter, title: e.target.value },
                    }))
                  }
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={footer.newsletter?.description || ""}
                  onChange={(e) =>
                    setFooter((p) => ({
                      ...p,
                      newsletter: { ...p.newsletter, description: e.target.value },
                    }))
                  }
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Input Placeholder</label>
                  <input
                    type="text"
                    value={footer.newsletter?.placeholder || ""}
                    onChange={(e) =>
                      setFooter((p) => ({
                        ...p,
                        newsletter: { ...p.newsletter, placeholder: e.target.value },
                      }))
                    }
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Button Label</label>
                  <input
                    type="text"
                    value={footer.newsletter?.buttonText || ""}
                    onChange={(e) =>
                      setFooter((p) => ({
                        ...p,
                        newsletter: { ...p.newsletter, buttonText: e.target.value },
                      }))
                    }
                    className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                  />
                </div>
              </div>
            </div>

            {/* Copyright & Legal Links */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <span>⚖️</span> Copyright &amp; Legal Notice
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Copyright Statement</label>
                <textarea
                  rows={3}
                  value={footer.legal?.copyright || ""}
                  onChange={(e) =>
                    setFooter((p) => ({
                      ...p,
                      legal: { ...p.legal, copyright: e.target.value },
                    }))
                  }
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#00bfff]"
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs text-gray-600">
                Bottom legal row automatically links to <strong>/privacy-policy</strong>, <strong>/terms-of-use</strong>, and <strong>/contact</strong>.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        title="Reset Layout Defaults"
        message="Are you sure you want to reset all Layout, Navbar, Logo, CTA and Footer settings to default initial seed? Custom changes will be overwritten."
        confirmLabel="Reset Defaults"
        cancelLabel="Cancel"
        isConfirming={seeding}
        variant="warning"
        onConfirm={async () => {
          await handleResetDefaults();
          setIsResetModalOpen(false);
        }}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
}

export default SiteLayoutManager;
