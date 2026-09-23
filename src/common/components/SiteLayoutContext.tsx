import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { fetchPageContent, PageContentResponse, PageSectionData } from "../services/cms.service";

export interface NavbarLink {
  name: string;
  href: string;
}

export interface DropdownItem {
  name: string;
  href: string;
  description: string;
  badge?: string;
}

export interface DropdownGroup {
  category: string;
  items: DropdownItem[];
}

export interface ActionButton {
  name: string;
  href: string;
  variant?: "default" | "outline" | "primary";
}

export interface LogoConfig {
  url: string;
  alt: string;
  href?: string;
  height?: number;
  fit?: "auto" | "zoom" | "contain";
}

export interface NavbarLayoutData {
  logo: LogoConfig;
  navLinks: NavbarLink[];
  dropdownGroups: DropdownGroup[];
  actionButtons: ActionButton[];
}

export interface TopBarLayoutData {
  phone: string;
  email: string;
  address: string;
  tagline: string;
  isVisible: boolean;
}

export interface CtaLayoutData {
  badge: string;
  title: string;
  subtitle: string;
  bgImage: string;
  actionText: string;
  actionUrl: string;
  secondaryButton: {
    text: string;
    url: string;
  };
}

export interface FooterColumnLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterColumnLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  isActive: boolean;
}

export interface FooterLayoutData {
  logoUrl: string;
  watermarkUrl: string;
  address: string;
  socialLinks: SocialLink[];
  columns: FooterColumn[];
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
  };
  meta: {
    email: string;
    established: string;
    status: string;
  };
  legal: {
    copyright: string;
    links: Array<{ label: string; href: string }>;
  };
}

export interface SiteLayoutContextType {
  navbar: NavbarLayoutData;
  topBar: TopBarLayoutData;
  cta: CtaLayoutData;
  footer: FooterLayoutData;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

// ==================== DEFAULT FALLBACKS ====================
export const DEFAULT_TOP_BAR: TopBarLayoutData = {
  phone: "+1 (800) 123-4567",
  email: "info@demo.edu",
  address: "123 University Lane, New City, California, USA",
  tagline: "Empowering Futures Since 1890",
  isVisible: true,
};

export const DEFAULT_NAVBAR: NavbarLayoutData = {
  logo: {
    url: "/assets/logo.png",
    alt: "IILP Logo",
    href: "/",
    height: 56,
    fit: "auto",
  },
  navLinks: [
    { name: "About IILP", href: "/about" },
    { name: "Governance", href: "/governance" },
    { name: "Academics", href: "/academics" },
    { name: "Fellowships", href: "/fellowships" },
  ],
  dropdownGroups: [
    {
      category: "Research & Academics",
      items: [
        {
          name: "Research & Publications",
          href: "/publications",
          description: "Repository of policy briefs, papers & reports",
        },
        {
          name: "Leadership Directory",
          href: "/leadership-directory",
          description: "Executive leadership & distinguished faculty profiles",
        },
      ],
    },
    {
      category: "Media & Partnerships",
      items: [
        {
          name: "Events & Conferences",
          href: "/events",
          description: "Conferences, seminars, workshops & webinars",
        },
        {
          name: "News & Media Center",
          href: "/news-media",
          description: "Press releases, events & photo gallery",
        },
        {
          name: "Partnership Framework",
          href: "/partnership-framework",
          description: "Collaborative engagement across five strategic tracks",
        },
      ],
    },
  ],
  actionButtons: [
    { name: "Donate", href: "/donate", variant: "default" },
    { name: "Contact", href: "/contact", variant: "outline" },
    { name: "Apply Now", href: "/fellowships#apply", variant: "primary" },
  ],
};

export const DEFAULT_CTA: CtaLayoutData = {
  badge: "Start Your Journey",
  title: "Join the IILP Community Today",
  subtitle:
    "Whether you are a scholar, practitioner, policymaker, or supporter — your involvement is invaluable to creating a better, more informed, and more equitable future.",
  bgImage: "/assets/cta-bg.png",
  actionText: "Partner with Us",
  actionUrl: "/partner",
  secondaryButton: {
    text: "Donate to Support IILP",
    url: "/donate",
  },
};

export const DEFAULT_FOOTER: FooterLayoutData = {
  logoUrl: "/assets/footer-logo.png",
  watermarkUrl: "/assets/footer-logo.png",
  address: "123 University Lane, Knowledge City, State, ZIP",
  socialLinks: [
    { platform: "facebook", url: "https://facebook.com", isActive: true },
    { platform: "twitter", url: "https://twitter.com", isActive: true },
    { platform: "instagram", url: "https://instagram.com", isActive: true },
    { platform: "linkedin", url: "https://linkedin.com", isActive: true },
  ],
  columns: [
    {
      title: "About IILP",
      links: [
        { label: "Institutional Profile", href: "/about" },
        { label: "Vision & Mission", href: "/about#mission" },
        { label: "Founder's Message", href: "/about#founder" },
        { label: "Governance", href: "/governance" },
        { label: "Leadership Directory", href: "/leadership-directory" },
      ],
    },
    {
      title: "Academic",
      links: [
        { label: "All Departments", href: "/academics" },
        { label: "Law & Legal Studies", href: "/department-details?dept=law" },
        { label: "Political Science", href: "/department-details?dept=politics" },
        { label: "Human Rights", href: "/department-details?dept=human-rights" },
        { label: "Refugee Studies", href: "/department-details?dept=refugee" },
        { label: "Peace & Conflict", href: "/department-details?dept=peace" },
      ],
    },
    {
      title: "Research & Programs",
      links: [
        { label: "Research & Publications", href: "/publications" },
        { label: "Global Fellowship Network", href: "/fellowships" },
        { label: "Partnerships", href: "/partnerships" },
        { label: "News & Media Center", href: "/news-media" },
        { label: "Events & Conferences", href: "/events" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Support & Connect",
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "Donate / Support IILP", href: "/donate" },
        { label: "Careers / Work With Us", href: "/careers" },
        { label: "FAQ", href: "/faq" },
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms of Use", href: "/terms-of-use" },
      ],
    },
  ],
  newsletter: {
    title: "Stay Informed",
    description: "Subscribe to the IILP newsletter for research, events, and updates.",
    placeholder: "YOUR EMAIL...",
    buttonText: "SUBSCRIBE",
  },
  meta: {
    email: "info@iilp.org",
    established: "1 January 2026",
    status: "Independent, Non-Profit Academic Institute",
  },
  legal: {
    copyright: "© 2026 International Institute for Law and Politics (IILP). All rights reserved.",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Use", href: "/terms-of-use" },
      { label: "Contact", href: "/contact" },
    ],
  },
};

const SiteLayoutContext = createContext<SiteLayoutContextType>({
  navbar: DEFAULT_NAVBAR,
  topBar: DEFAULT_TOP_BAR,
  cta: DEFAULT_CTA,
  footer: DEFAULT_FOOTER,
  isLoading: true,
  refetch: async () => {},
});

export function SiteLayoutProvider({ children }: { children: React.ReactNode }) {
  const [navbar, setNavbar] = useState<NavbarLayoutData>(DEFAULT_NAVBAR);
  const [topBar, setTopBar] = useState<TopBarLayoutData>(DEFAULT_TOP_BAR);
  const [cta, setCta] = useState<CtaLayoutData>(DEFAULT_CTA);
  const [footer, setFooter] = useState<FooterLayoutData>(DEFAULT_FOOTER);
  const [isLoading, setIsLoading] = useState(true);

  const applyLayoutData = useCallback((sections: Record<string, PageSectionData>) => {
    // 1. Top Bar
    if (sections.top_bar) {
      const sec = sections.top_bar;
      const meta = sec.metadata || {};
      setTopBar({
        phone: (meta.phone as string) || DEFAULT_TOP_BAR.phone,
        email: (meta.email as string) || DEFAULT_TOP_BAR.email,
        address: (meta.address as string) || DEFAULT_TOP_BAR.address,
        tagline: (meta.tagline as string) || sec.title || DEFAULT_TOP_BAR.tagline,
        isVisible: meta.isVisible !== undefined ? Boolean(meta.isVisible) : (sec.isActive ?? true),
      });
    }

    // 2. Navbar
    if (sections.navbar) {
      const sec = sections.navbar;
      const meta = sec.metadata || {};
      const metaLogo = (meta.logo as LogoConfig) || {};
      setNavbar({
        logo: {
          url: metaLogo.url || sec.bgImage || DEFAULT_NAVBAR.logo.url,
          alt: metaLogo.alt || sec.title || DEFAULT_NAVBAR.logo.alt,
          href: metaLogo.href || DEFAULT_NAVBAR.logo.href || "/",
          height: metaLogo.height ?? DEFAULT_NAVBAR.logo.height ?? 56,
          fit: metaLogo.fit || "auto",
        },
        navLinks: Array.isArray(meta.navLinks) ? (meta.navLinks as NavbarLink[]) : DEFAULT_NAVBAR.navLinks,
        dropdownGroups: Array.isArray(meta.dropdownGroups)
          ? (meta.dropdownGroups as DropdownGroup[])
          : DEFAULT_NAVBAR.dropdownGroups,
        actionButtons: Array.isArray(meta.actionButtons)
          ? (meta.actionButtons as ActionButton[])
          : DEFAULT_NAVBAR.actionButtons,
      });
    }

    // 3. CTA
    if (sections.cta) {
      const sec = sections.cta;
      const meta = sec.metadata || {};
      const secBtn = (meta.secondaryButton as { text: string; url: string }) || {};
      setCta({
        badge: sec.badge || DEFAULT_CTA.badge,
        title: sec.title || DEFAULT_CTA.title,
        subtitle: sec.subtitle || DEFAULT_CTA.subtitle,
        bgImage: sec.bgImage || DEFAULT_CTA.bgImage,
        actionText: sec.actionText || DEFAULT_CTA.actionText,
        actionUrl: sec.actionUrl || DEFAULT_CTA.actionUrl,
        secondaryButton: {
          text: secBtn.text || DEFAULT_CTA.secondaryButton.text,
          url: secBtn.url || DEFAULT_CTA.secondaryButton.url,
        },
      });
    }

    // 4. Footer
    if (sections.footer) {
      const sec = sections.footer;
      const meta = sec.metadata || {};
      const metaNews = (meta.newsletter as FooterLayoutData["newsletter"]) || {};
      const metaInfo = (meta.meta as FooterLayoutData["meta"]) || {};
      const metaLegal = (meta.legal as FooterLayoutData["legal"]) || {};

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
          copyright: metaLegal.copyright || DEFAULT_FOOTER.legal.copyright,
          links: Array.isArray(metaLegal.links) ? metaLegal.links : DEFAULT_FOOTER.legal.links,
        },
      });
    }
  }, []);

  const loadLayoutData = useCallback(async () => {
    try {
      const res: PageContentResponse | null = await fetchPageContent("layout");
      if (res && res.sections) {
        applyLayoutData(res.sections);
      }
    } catch (err) {
      console.warn("[SiteLayout] Failed to fetch layout from backend, using defaults:", err);
    } finally {
      setIsLoading(false);
    }
  }, [applyLayoutData]);

  useEffect(() => {
    let active = true;
    fetchPageContent("layout")
      .then((res) => {
        if (!active || !res || !res.sections) return;
        applyLayoutData(res.sections);
      })
      .catch((err) => {
        console.warn("[SiteLayout] Failed to fetch layout from backend, using defaults:", err);
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [applyLayoutData]);

  return (
    <SiteLayoutContext.Provider
      value={{
        navbar,
        topBar,
        cta,
        footer,
        isLoading,
        refetch: loadLayoutData,
      }}
    >
      {children}
    </SiteLayoutContext.Provider>
  );
}

export function useSiteLayout() {
  return useContext(SiteLayoutContext);
}
export default SiteLayoutContext;
