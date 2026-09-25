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
import ConfirmationModal from "./ConfirmationModal";

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
  defaultActionText?: string;
  defaultActionUrl?: string;
  defaultMetadata?: Record<string, any>;
}

export interface FellowshipPathwayItem {
  id: string;
  name: string;
  icon: string;
  title: string;
  description: string;
  eligibility: string[];
  benefits: string[];
}

export interface PathwaysIntroMetadata {
  pathways: FellowshipPathwayItem[];
}

export const defaultPathwaysIntroMetadata: PathwaysIntroMetadata = {
  pathways: [
    {
      id: "research",
      icon: "/assets/tab-planet.svg",
      name: "Research Fellows",
      title: "Research Fellows",
      benefits: [
        "Institutional affiliation with IILP",
        "Access to IILP's research network and resources",
        "Co-authorship opportunities on IILP publications",
        "Participation in IILP conferences and events",
        "Recognition in IILP's Global Fellowship Directory",
      ],
      description:
        "For established researchers and academics advancing IILP's scholarly agenda. Research Fellows lead institutional research initiatives, contribute to publications, and participate in academic governance.",
      eligibility: [
        "PhD or equivalent in a relevant field",
        "Established research record with publications",
        "Demonstrated expertise in IILP's areas of focus",
        "Commitment to advancing evidence-based policy",
      ],
    },
    {
      id: "junior",
      icon: "/assets/tab-hat.svg",
      name: "Junior Fellows",
      title: "Junior Fellows",
      benefits: [
        "Mentorship from senior IILP researchers",
        "Institutional affiliation and profile",
        "Research support and publishing opportunities",
        "Training and capacity development programs",
        "Access to IILP's academic network",
      ],
      description:
        "For emerging scholars and early-career professionals committed to impactful research. Junior Fellows contribute to research projects under senior mentorship and develop their scholarly profile.",
      eligibility: [
        "Master's degree or equivalent in a relevant field",
        "Strong academic record and research potential",
        "Interest in IILP's thematic areas",
        "Commitment to interdisciplinary scholarship",
      ],
    },
    {
      id: "honorary",
      icon: "/assets/tab-trophy.svg",
      name: "Honorary Fellows",
      title: "Honorary Fellows",
      benefits: [
        "Recognition as an Honorary Fellow of IILP",
        "Listing in IILP's Official Fellowship Directory",
        "Invitation to IILP events and dialogues",
        "Association with IILP's global institutional network",
      ],
      description:
        "Recognizing distinguished individuals who have made exceptional contributions to the fields IILP serves. Honorary Fellows receive recognition without service obligations.",
      eligibility: [
        "Distinguished record of contributions to law, politics, human rights, or related fields",
        "National or international recognition in their domain",
        "Alignment with IILP's values and mission",
        "Nomination by IILP leadership or existing fellows",
      ],
    },
  ],
};

export interface LeadershipTierItem {
  title: string;
  desc: string;
}

export interface StructureIntroMetadata {
  tiers: LeadershipTierItem[];
}

export const defaultLeadershipTiers: LeadershipTierItem[] = [
  {
    title: "Founding Authority",
    desc: "Founder & President — visionary and strategic authority",
  },
  {
    title: "Governing Council",
    desc: "Highest governing and decision-making body",
  },
  {
    title: "Executive Directorate Board",
    desc: "Operational leadership and program delivery",
  },
  {
    title: "Academic Senate",
    desc: "Principal academic and intellectual authority",
  },
  {
    title: "ICT & Media Cell",
    desc: "Digital presence, media and communications",
  },
  {
    title: "Advisory Board",
    desc: "External strategic and intellectual guidance",
  },
  {
    title: "Global Fellowship Network",
    desc: "International scholarly community",
  },
  {
    title: "Ethics & Accountability Commission",
    desc: "Institutional integrity and ethical governance",
  },
  {
    title: "Youth Leadership Assembly",
    desc: "Youth participation and leadership development",
  },
];

export const defaultStructureIntroMetadata: StructureIntroMetadata = {
  tiers: defaultLeadershipTiers,
};

export interface GoverningCouncilResponsibilityItem {
  number: string;
  text: string;
}

export interface GoverningCouncilMetadata {
  responsibilities: GoverningCouncilResponsibilityItem[];
}

export const defaultCouncilResponsibilities: GoverningCouncilResponsibilityItem[] = [
  {
    number: "01",
    text: "Approves institutional policies, regulations, and governance frameworks.",
  },
  {
    number: "02",
    text: "Provides strategic direction and long-term institutional planning.",
  },
  {
    number: "03",
    text: "Ensures accountability, transparency, and responsible institutional management.",
  },
  {
    number: "04",
    text: "Oversees organizational growth, development, and sustainability.",
  },
  {
    number: "05",
    text: "Safeguards academic quality, professional standards, and ethical integrity.",
  },
  {
    number: "06",
    text: "Reviews major programs, partnerships, projects, and institutional initiatives.",
  },
  {
    number: "07",
    text: "Supports resource mobilization and institutional capacity development.",
  },
  {
    number: "08",
    text: "Monitors institutional performance and strategic progress.",
  },
];

export const defaultGoverningCouncilMetadata: GoverningCouncilMetadata = {
  responsibilities: defaultCouncilResponsibilities,
};

export interface EthicsCommissionMetadata {
  functions: string[];
  cardTitle?: string;
  ratingValue?: string;
  ratingLabel?: string;
}

export const defaultEthicsCommissionFunctions: string[] = [
  "Monitor compliance with institutional ethics and professional standards.",
  "Review matters relating to institutional conduct, integrity, and accountability.",
  "Promote transparency, fairness, and responsible governance practices.",
  "Safeguard academic independence and intellectual freedom.",
  "Address internal concerns, grievances, and ethical matters through appropriate procedures.",
  "Encourage a culture of professionalism, respect, and ethical leadership.",
  "Protect the credibility, legitimacy, and reputation of the Institute.",
];

export const defaultEthicsCommissionMetadata: EthicsCommissionMetadata = {
  cardTitle: "Accountability Functions",
  ratingValue: "5000",
  ratingLabel: "Student ratings",
  functions: defaultEthicsCommissionFunctions,
};

export interface YouthLeadershipMetadata {
  functions: string[];
  cardTitle?: string;
  ratingValue?: string;
  ratingLabel?: string;
}

export const defaultYouthLeadershipFunctions: string[] = [
  "Represent youth perspectives within institutional discussions and initiatives.",
  "Organize leadership development programs, workshops, and training activities.",
  "Promote youth participation in research, policy dialogue, and public engagement.",
  "Support community service and civic engagement initiatives.",
  "Encourage innovation, critical thinking, and responsible leadership among young people.",
  "Develop pathways for future scholars, researchers, professionals, and institutional leaders.",
];

export const defaultYouthLeadershipMetadata: YouthLeadershipMetadata = {
  cardTitle: "Assembly Functions",
  ratingValue: "5000",
  ratingLabel: "Student ratings",
  functions: defaultYouthLeadershipFunctions,
};

export interface FoundingMemberItem {
  name: string;
  role: string;
  image: string;
}

export interface FoundingMembersMetadata {
  members: FoundingMemberItem[];
}

export const defaultFoundingMembersList: FoundingMemberItem[] = [
  {
    name: "Mohammed Siraj",
    role: "Founding Member",
    image: "/assets/governance-founding-member.png",
  },
  {
    name: "Mujibur Rahman",
    role: "Founding Member",
    image: "/assets/governance-founding-member.png",
  },
  {
    name: "MD. Mahamudun Noby Rupok",
    role: "Founding Member",
    image: "/assets/governance-founding-member.png",
  },
];

export const defaultFoundingMembersMetadata: FoundingMembersMetadata = {
  members: defaultFoundingMembersList,
};

export interface PartnershipTrackItem {
  icon: string;
  title: string;
  description: string;
}

export interface PartnershipTracksMetadata {
  tracks: PartnershipTrackItem[];
}

export const defaultPartnershipTracksList: PartnershipTrackItem[] = [
  {
    icon: "🎓",
    title: "University Partnerships",
    description:
      "Collaborative academic programs, joint research initiatives, student and faculty exchanges, and shared educational resources with universities worldwide.",
  },
  {
    icon: "🔬",
    title: "Research Collaborations",
    description:
      "Co-authorship of research publications, joint research projects, shared methodologies, and collaborative grant applications with research institutions.",
  },
  {
    icon: "🌐",
    title: "International Organizations",
    description:
      "Engagement with UN agencies, regional organizations, and international bodies to advance policy dialogue, advocacy, and institutional reform.",
  },
  {
    icon: "🤝",
    title: "NGO Partnerships",
    description:
      "Strategic partnerships with non-governmental organizations working on human rights, humanitarian affairs, development, and civic society engagement.",
  },
  {
    icon: "🏛️",
    title: "Government Partnerships",
    description:
      "Advisory and policy engagement with government ministries, agencies, and institutions committed to evidence-based governance and policy reform.",
  },
];

export const defaultPartnershipTracksMetadata: PartnershipTracksMetadata = {
  tracks: defaultPartnershipTracksList,
};

export interface ContactInfoCardItem {
  title: string;
  value: string;
  timing: string;
  iconAlt?: string;
  iconSrc?: string;
  link?: string;
}

export interface ContactInfoCardsMetadata {
  [key: string]: unknown;
  cards: ContactInfoCardItem[];
}

export const defaultContactInfoCardsList: ContactInfoCardItem[] = [
  {
    title: "Email",
    value: "info@iilp.org",
    timing: "Online Support",
    iconAlt: "Email Icon",
    iconSrc: "/images/contact-icon-email.svg",
  },
  {
    title: "Phone",
    value: "+880 1819-254425",
    timing: "Sunday to Thursday 9am to 5pm",
    iconAlt: "Phone Icon",
    iconSrc: "/images/contact-icon-phone.svg",
  },
  {
    title: "Office",
    value: "Dhaka, Bangladesh",
    timing: "Visit Our Head Office",
    iconAlt: "Office Icon",
    iconSrc: "/images/contact-icon-office.svg",
  },
  {
    title: "Media Relations",
    value: "media@iilp.org",
    timing: "Press and Communications",
    iconAlt: "Media Icon",
    iconSrc: "/images/contact-icon-media.svg",
  },
];

export const defaultContactInfoCardsMetadata: ContactInfoCardsMetadata = {
  cards: defaultContactInfoCardsList,
};

export interface ContactMapMetadata {
  mapType: "embed" | "image";
  embedUrl: string;
  mapImage: string;
  address: string;
  phone: string;
  email: string;
  officeHours: string;
}

export const defaultContactMapMetadata: ContactMapMetadata = {
  mapType: "embed",
  embedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116834.00977789308!2d90.3492857469792!3d23.78077772076043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd",
  mapImage: "/images/contact-map.png",
  address: "Dhaka, Bangladesh",
  phone: "+880 1819-254425",
  email: "info@iilp.org",
  officeHours: "Sunday to Thursday 9am to 5pm",
};

export interface PolicySectionItem {
  id: string;
  heading: string;
  content: string;
}

export interface PolicySectionsMetadata {
  lastUpdated: string;
  sections: PolicySectionItem[];
}

export const defaultPolicySectionsList: PolicySectionItem[] = [
  {
    id: "information-we-collect",
    heading: "1. Information We Collect",
    content:
      "IILP collects personal information that you voluntarily provide when completing contact forms, fellowship applications, event registrations, donation forms, careers applications, and newsletter subscriptions. This may include your name, email address, phone number, institution, country of residence, and supporting documents you upload.",
  },
  {
    id: "how-we-use-information",
    heading: "2. How We Use Your Information",
    content:
      "We use your information to respond to your inquiries, process applications and registrations, send communications you have requested (such as newsletters and event confirmations), improve our website and services, and fulfill our institutional mission. We do not sell or share your personal information with third parties for commercial purposes.",
  },
  {
    id: "academic-integrity",
    heading: "3. Academic Integrity",
    content:
      "Users who access IILP's research publications and academic content are expected to uphold standards of academic integrity, including proper citation and attribution of IILP's work.",
  },
  {
    id: "user-conduct",
    heading: "4. User Conduct",
    content:
      "You agree not to use the IILP website for any unlawful purpose; to upload malicious content; to misrepresent your identity or affiliation with IILP; or to engage in conduct that could harm IILP's reputation, mission, or institutional integrity.",
  },
  {
    id: "disclaimer",
    heading: "5. Disclaimer",
    content:
      "The information on this website is provided in good faith for informational and educational purposes. IILP makes no warranties, expressed or implied, about the completeness, accuracy, or reliability of the content.",
  },
  {
    id: "third-party-links",
    heading: "6. Links to Third-Party Websites",
    content:
      "The IILP website may contain links to external websites. IILP is not responsible for the content, accuracy, or privacy practices of third-party websites.",
  },
  {
    id: "changes-to-terms",
    heading: "7. Changes to Terms",
    content:
      "IILP reserves the right to update these Terms of Use at any time. Continued use of the website following any changes constitutes acceptance of the updated terms.",
  },
  {
    id: "contact",
    heading: "8. Contact",
    content:
      "For questions about these Terms of Use, please contact IILP at info@iilp.org.",
  },
];

export const defaultPolicySectionsMetadata: PolicySectionsMetadata = {
  lastUpdated: "January 2026",
  sections: defaultPolicySectionsList,
};

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
    {
      key: "profile",
      label: "Institutional Profile",
      defaultTitle: "Our Institutional Profile",
      defaultMetadata: {
        image1: "/assets/about-institutional-1.png",
        image2: "/assets/about-institutional-2.png",
        badgeIcon: "/assets/about-badge-icon.svg",
        badgeText: "/assets/about-badge-text.png",
        profileDetails: [
          {
            label: "Established",
            value: "1 January 2026",
          },
          {
            label: "Type",
            value: "Independent, Non-Profit",
          },
          {
            label: "Focus",
            value: "Law, Politics & Governance",
          },
          {
            label: "Motto",
            value: '"Knowledge, Justice, and Leadership for Global Change."',
          },
        ],
        secondaryActionUrl: "/about",
        secondaryActionText: "Learn More",
      },
    },
    {
      key: "institutional_profile",
      label: "Institutional Profile (Alt Key)",
      defaultTitle: "Our Institutional Profile",
      defaultMetadata: {
        image1: "/assets/about-institutional-1.png",
        image2: "/assets/about-institutional-2.png",
        badgeIcon: "/assets/about-badge-icon.svg",
        badgeText: "/assets/about-badge-text.png",
        profileDetails: [
          {
            label: "Established",
            value: "1 January 2026",
          },
          {
            label: "Type",
            value: "Independent, Non-Profit",
          },
          {
            label: "Focus",
            value: "Law, Politics & Governance",
          },
          {
            label: "Motto",
            value: '"Knowledge, Justice, and Leadership for Global Change."',
          },
        ],
        secondaryActionUrl: "/about",
        secondaryActionText: "Learn More",
      },
    },
    {
      key: "our_mission",
      label: "Our Mission",
      defaultTitle: "Advancing Interdisciplinary Scholarship",
      defaultBadge: "Our Mission",
      defaultSubtitle:
        "The mission of the International Institute for Law and Politics is to advance interdisciplinary scholarship, strengthen evidence-based policymaking, foster ethical leadership, and contribute to the development of informed and resilient institutions capable of addressing contemporary global challenges.",
      defaultBgImage: "/assets/about-vision-students.png",
    },
    {
      key: "our_vision",
      label: "Our Vision",
      defaultTitle: "A Globally Respected Centre of Excellence",
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
    {
      key: "objectives",
      label: "Strategic Objectives",
      defaultTitle: "A Globally Respected Centre of Excellence",
      defaultBadge: "Our Vision",
      defaultSubtitle:
        "To become a globally respected center of excellence for research, education, policy innovation, and leadership development — advancing justice, human dignity, democratic governance, responsible public leadership, and sustainable peace.",
      defaultBgImage: "/assets/about-objectives-graduation.png",
      defaultMetadata: {
        objectives: [
          {
            num: "01",
            text: "Provide academic programs, training programs, and certificate courses, and establish partnerships with universities, international organizations, and civil society organizations.",
          },
          {
            num: "02",
            text: "Advance high-quality academic and policy research in law, politics, governance, human rights, forced displacement and statelessness, humanitarian affairs, and social development.",
          },
          {
            num: "03",
            text: "Promote intellectual inquiry and critical thinking through rigorous scholarship and interdisciplinary collaboration.",
          },
          {
            num: "04",
            text: "Develop future scholars, researchers, policymakers, public servants, and leaders committed to ethical responsibility and public service.",
          },
          {
            num: "05",
            text: "Encourage evidence-based policymaking and informed public dialogue on issues of national, regional, and global significance.",
          },
          {
            num: "06",
            text: "Promote human rights, justice, accountability, inclusion, and democratic values.",
          },
          {
            num: "07",
            text: "Strengthen collaboration among universities, research institutions, civil society organizations, international organizations, and policy networks.",
          },
          {
            num: "08",
            text: "Support innovative approaches to addressing complex legal, political, and humanitarian challenges.",
          },
          {
            num: "09",
            text: "Bridge the gap between research and practice by transforming knowledge into practical policy recommendations and institutional solutions.",
          },
          {
            num: "10",
            text: "Foster international cooperation and intellectual exchange across cultures, disciplines, and regions.",
          },
        ],
      },
    },
    {
      key: "strategic_objectives",
      label: "Strategic Objectives (Alt Key)",
      defaultTitle: "Strategic Goals & Priorities",
    },
    {
      key: "values",
      label: "Institutional Values",
      defaultTitle: "Institutional Values",
      defaultBadge: "What We Stand For",
      defaultMetadata: {
        values: [
          {
            desc: "Commitment to the highest standards of scholarship, research, and intellectual inquiry.",
            icon: "🎓",
            title: "Academic Excellence",
          },
          {
            desc: "Dedication to honesty, transparency, professionalism, and responsible institutional conduct.",
            icon: "🔍",
            title: "Integrity and Accountability",
          },
          {
            desc: "Respect for the inherent worth, rights, and dignity of all individuals.",
            icon: "⚖️",
            title: "Justice and Human Dignity",
          },
          {
            desc: "Promotion of leadership grounded in responsibility, service, integrity, and ethical principles.",
            icon: "🏅",
            title: "Ethical Leadership",
          },
          {
            desc: "Recognition of diverse perspectives, experiences, and backgrounds as sources of intellectual strength.",
            icon: "🌈",
            title: "Inclusiveness and Diversity",
          },
          {
            desc: "Commitment to academic freedom and objective inquiry free from undue influence.",
            icon: "🧠",
            title: "Intellectual Independence",
          },
          {
            desc: "Support for rigorous, methodologically sound, and policy-relevant scholarship.",
            icon: "📊",
            title: "Evidence-Based Research",
          },
          {
            desc: "Encouragement of constructive dialogue, civic participation, and respect for democratic principles.",
            icon: "🗳️",
            title: "Democratic Engagement",
          },
          {
            desc: "Commitment to collaboration across borders in pursuit of shared knowledge and common solutions.",
            icon: "🌐",
            title: "International Cooperation",
          },
          {
            desc: "Recognition of the responsibility of academic institutions to contribute positively to society and the public good.",
            icon: "🤲",
            title: "Social Responsibility",
          },
        ],
      },
    },
    {
      key: "institutional_values",
      label: "Institutional Values (Alt Key)",
      defaultTitle: "Institutional Values",
      defaultBadge: "What We Stand For",
    },
    {
      key: "global_engagement",
      label: "Global Engagement & Impact",
      defaultTitle: "Global Engagement",
      defaultBadge: "Our Global Reach",
      defaultBgImage: "/assets/about-mission-student.png",
      defaultMetadata: {
        commitmentTitle: "Institutional Commitment",
        commitmentContent:
          "The International Institute for Law and Politics is committed to serving as a platform where ideas are transformed into knowledge, knowledge is translated into policy, and policy contributes to positive social change.\n\nBy bringing together scholarship, leadership, and public engagement, the Institute seeks to make a meaningful contribution to the advancement of justice, responsible governance, human rights, humanitarian values, and sustainable development for present and future generations.",
        studentRatingsCount: "5000",
        studentRatingsLabel: "Student ratings",
        ratingAvatars: [
          "/assets/about-rating-avatar-1.png",
          "/assets/about-rating-avatar-2.png",
          "/assets/about-rating-avatar-3.png",
        ],
      },
    },
    {
      key: "founder_message",
      label: "President & Founder Message",
      defaultTitle: "Founder's Message",
      defaultBadge: "From the Founder",
      defaultBgImage: "/assets/about-institutional-2.png",
      defaultMetadata: {
        founderName: "Mohammed Siraj",
        founderRole: "Founder & President, IILP",
        founderInitials: "MS",
        signatureImage: "/assets/about-founder-signature.png",
        paragraphs: [
          "It is with profound pleasure and immense honor that I welcome you to the International Institute for Law and Politics (IILP) — a vibrant community committed to the creation of knowledge, rigorous scholarship, profound insights, and impactful engagement with the critical legal, political, humanitarian, and socio-economic issues defining our times. IILP was established upon a straightforward yet ambitious principle: knowledge must serve humanity. Knowledge is power, and that power cannot be siloed within academia or confined to intellectual discussions alone. It must be applied effectively to fight injustice, foster democracy, uphold human dignity, and seek solutions to the global challenges impacting communities across the globe, with a dedicated focus on displaced and refugee populations.",
          "My own experience — having lived through the Rohingya genocide and experienced life as a refugee — impelled me to create IILP. I profoundly understand the consequences of institution failure to protect the vulnerable, and the transformative potential of knowledge in service of justice. We live in times of immense change and uncertainty. Conflict, war, genocide, persecution, political violence, displacement, statelessness, inequity, failed governance, humanitarian crises, and violations of basic human rights continue to challenge communities worldwide. Addressing these complexities cannot be solely a matter of good intentions; it demands rigorous scholarship, responsible leadership, data-driven policies, interdisciplinary approaches, and an unyielding dedication to ethical public service. IILP serves as a central hub where scholars, researchers, students, policymakers, practitioners, and leaders, including young activists and future leaders, come together to exchange knowledge, build capacity, and contribute to a more just, equitable, and sustainable global future for all, particularly for those displaced or seeking refuge.",
          "IILP operates under the highest standards of research, intellectual inquiry, and academic integrity, complemented by an unwavering commitment to professionalism and excellence. We foster a culture that celebrates learning, creativity, collaboration, and civic engagement through our programs, publications, conferences, workshops, policy dialogues, training sessions, and partnerships. We firmly believe that law, politics, governance, human rights, and societal development are inextricably linked and that lasting change arises from integrative strategies that draw upon diverse perspectives and dialogue across academic disciplines, geographic regions, and cultural diversities.",
          "I encourage you to join our collective mission. Whether you are an esteemed professor, an aspiring scholar or student, a dedicated researcher, a seasoned policy practitioner, a grassroots activist, a collaborating organization or institution, a funding partner, or simply a concerned individual passionate about making a difference in the world, your involvement is invaluable to creating a better, more informed, more equitable, and more compassionate future. Together, we will convert knowledge into impactful action, bright ideas into lasting solutions, and devoted leadership into transformative and sustainable change.",
        ],
      },
    },
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
    {
      key: "hero",
      label: "Fellowship Hero Banner",
      defaultTitle: "Connecting Scholars & Leaders Worldwide",
      defaultBadge: "Global Fellowship Network",
      defaultSubtitle:
        "Join the IILP Global Fellowship Network — connecting researchers, professionals, and emerging leaders around the world committed to advancing justice, governance, and human rights.",
      defaultBgImage: "/assets/fellowship-hero-bg.png",
    },
    {
      key: "pathways_intro",
      label: "Three Fellowship Pathways",
      defaultTitle: "Three Fellowship Pathways",
      defaultBadge: "Fellowship Categories",
      defaultSubtitle:
        "IILP offers three fellowship categories designed to engage scholars and professionals at different stages of their careers.",
      defaultMetadata: defaultPathwaysIntroMetadata,
    },
    {
      key: "application_cta",
      label: "Fellowship Application & CTA",
      defaultTitle: "Apply for Fellowship",
      defaultBadge: "Fellowship Application",
      defaultSubtitle:
        "Complete the form below to apply for the IILP Global Fellowship Network.",
    },
  ],
  governance: [
    { key: "hero", label: "Governance Hero", defaultTitle: "Institutional Governance & Integrity" },
    {
      key: "structure_intro",
      label: "Leadership Structure",
      defaultTitle: "Multi-Tiered Leadership Structure",
      defaultBadge: "How We Are Governed",
      defaultSubtitle:
        "The Institute is governed through a multi-tiered leadership structure that combines strategic oversight, operational management, academic leadership, and institutional development.",
      defaultMetadata: defaultStructureIntroMetadata,
    },
    { key: "founding_authority", label: "Founding Authority", defaultTitle: "Founding Charter & Authority" },
    {
      key: "founding_members",
      label: "Board of Founding Members",
      defaultTitle: "Board of Founding Members",
      defaultBadge: "Founding Members",
      defaultSubtitle:
        "The Board of Founding Members comprises the individuals who supported the founder during the establishment process of the International Institute for Law and Politics and provided guidance on institutional, strategic, and organizational foundation.",
      defaultActionText: "View Leadership Directory",
      defaultActionUrl: "/leadership-directory",
      defaultMetadata: defaultFoundingMembersMetadata,
    },
    {
      key: "governing_council",
      label: "Governing Council",
      defaultTitle: "Governing Council",
      defaultBadge: "Highest Governing Body",
      defaultSubtitle:
        "The Governing Council serves as the highest governing and decision-making body of the Institute. It provides strategic leadership, policy oversight, and institutional accountability while ensuring that the Institute operates in accordance with its mission, objectives, and ethical principles.",
      defaultBgImage: "/assets/governance-council-student.png",
      defaultMetadata: defaultGoverningCouncilMetadata,
    },
    { key: "executive_directorate", label: "Executive Directorate", defaultTitle: "Executive Directorate Board" },
    { key: "academic_senate", label: "Academic Senate", defaultTitle: "Academic Senate" },
    { key: "advisory_board", label: "Advisory Board", defaultTitle: "International Advisory Board" },
    {
      key: "ethics_commission",
      label: "Ethics Commission",
      defaultTitle: "Ethics and Accountability Commission",
      defaultBadge: "Integrity & Accountability",
      defaultSubtitle:
        "The Ethics and Accountability Commission serves as the guardian of institutional integrity, ethical governance, transparency, and professional conduct.",
      defaultBgImage: "/assets/governance-advisory-student.png",
      defaultMetadata: defaultEthicsCommissionMetadata,
    },
    {
      key: "youth_leadership",
      label: "Youth Leadership Assembly",
      defaultTitle: "Youth Leadership Assembly",
      defaultBadge: "Youth Engagement",
      defaultSubtitle:
        "The Youth Leadership Assembly serves as the Institute's primary platform for youth participation, leadership development, and civic engagement.",
      defaultBgImage: "/assets/governance-advisory-student.png",
      defaultMetadata: defaultYouthLeadershipMetadata,
    },
    { key: "get_involved_banner", label: "Get Involved CTA", defaultTitle: "Engage with Governance" },
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
    {
      key: "hero",
      label: "Partnerships Hero",
      defaultTitle: "Partnerships With Organization",
      defaultBadge: "Partnerships",
      defaultBgImage: "/assets/fellowship-hero-bg.png",
    },
    {
      key: "tracks_intro",
      label: "Partnership Framework Tracks",
      defaultTitle: "Partnership Framework",
      defaultBadge: "Global Network",
      defaultSubtitle:
        "IILP actively seeks partnerships across five tracks, each designed to amplify the impact of collaborative knowledge-building and policy engagement.",
      defaultMetadata: defaultPartnershipTracksMetadata,
    },
    {
      key: "become_partner_banner",
      label: "Become an IILP Partner",
      defaultTitle: "Become an IILP Partner",
      defaultSubtitle:
        "IILP welcomes new partnerships with institutions, organizations, and governments aligned with its mission. Contact us to discuss collaboration opportunities.",
      defaultActionText: "Initiate Partnership Inquiry",
      defaultActionUrl: "/contact",
    },
  ],
  careers: [
    { key: "hero", label: "Careers Hero", defaultTitle: "Careers & Opportunities" },
    { key: "openings", label: "Current Openings", defaultTitle: "Open Positions" },
    { key: "work_culture", label: "Work Culture", defaultTitle: "Life at IILP" },
  ],
  contact: [
    {
      key: "hero",
      label: "Contact Hero",
      defaultTitle: "Contact IILP",
      defaultBadge: "Contact Us",
      defaultSubtitle:
        "We welcome inquiries from students, scholars, partner institutions, policymakers, and media organizations. Reach out to our dedicated team below.",
      defaultBgImage: "/images/contact-hero-bg.png",
    },
    {
      key: "contact_info_cards",
      label: "Contact Information Cards",
      defaultTitle: "Contact Information",
      defaultBadge: "Reach Us",
      defaultMetadata: defaultContactInfoCardsMetadata,
    },
    {
      key: "info_grid",
      label: "Offices & Information (Legacy Key)",
      defaultTitle: "Contact Information",
      defaultBadge: "Reach Us",
      defaultMetadata: defaultContactInfoCardsMetadata,
    },
    {
      key: "contact_map",
      label: "Campus & Location Map",
      defaultTitle: "Dhaka Campus & Head Office",
      defaultBadge: "Location & Directions",
      defaultSubtitle:
        "Dhaka, Bangladesh — Sunday to Thursday 9am to 5pm",
      defaultActionUrl: "https://maps.google.com/?q=Dhaka,+Bangladesh",
      defaultActionText: "Open in Google Maps",
      defaultBgImage: "/images/contact-map.png",
      defaultMetadata: {
        mapType: "embed",
        embedUrl:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116834.00977789308!2d90.3492857469792!3d23.78077772076043!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd",
        mapImage: "/images/contact-map.png",
        address: "Dhaka, Bangladesh",
        phone: "+880 1819-254425",
        email: "info@iilp.org",
        officeHours: "Sunday to Thursday 9am to 5pm",
      },
    },
    { key: "form", label: "Inquiry Form", defaultTitle: "Send an Inquiry" },
  ],
  donate: [
    { key: "hero", label: "Donation Hero", defaultTitle: "Support IILP" },
    { key: "impact_funds", label: "Impact Funds", defaultTitle: "Endowment & Scholarship Funds" },
    { key: "ways_to_give", label: "Ways to Give", defaultTitle: "Donation Channels" },
  ],
  "privacy-policy": [
    {
      key: "hero",
      label: "Privacy Policy Hero Banner",
      defaultTitle: "Your Privacy, Our Priority",
      defaultBadge: "Privacy Policy",
      defaultSubtitle:
        "How IILP collects, uses, and protects your personal information.",
      defaultBgImage: "/images/contact-hero-bg.png",
    },
    {
      key: "policy_sections",
      label: "Privacy Policy Articles & Sections",
      defaultTitle: "Privacy Policy",
      defaultSubtitle: "Last updated: January 2026",
      defaultMetadata: defaultPolicySectionsMetadata,
    },
    {
      key: "content",
      label: "Privacy Policy Content (Legacy Key)",
      defaultTitle: "Privacy Policy",
      defaultSubtitle: "Last updated: January 2026",
      defaultMetadata: defaultPolicySectionsMetadata,
    },
  ],
  "terms-of-use": [
    {
      key: "hero",
      label: "Terms of Use Hero Banner",
      defaultTitle: "Agreement to Terms",
      defaultBadge: "Terms of Use",
      defaultSubtitle:
        "Terms and conditions governing your use of the IILP website.",
      defaultBgImage: "/images/contact-hero-bg.png",
    },
    {
      key: "policy_sections",
      label: "Terms of Use Articles & Sections",
      defaultTitle: "Terms of Use",
      defaultSubtitle: "Last updated: January 2026",
      defaultMetadata: defaultPolicySectionsMetadata,
    },
    {
      key: "terms_sections",
      label: "Terms Sections (Legacy Key)",
      defaultTitle: "Terms of Use",
      defaultSubtitle: "Last updated: January 2026",
      defaultMetadata: defaultPolicySectionsMetadata,
    },
    {
      key: "content",
      label: "Terms of Use Content (Legacy Key)",
      defaultTitle: "Terms of Use",
      defaultSubtitle: "Last updated: January 2026",
      defaultMetadata: defaultPolicySectionsMetadata,
    },
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

  // Delete Confirmation State
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [isDeletingSection, setIsDeletingSection] = useState(false);
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

  // Institutional Profile Visual Helpers (About Page)
  const [uploadingProfileKey, setUploadingProfileKey] = useState<string | null>(null);

  const getProfileMetadata = () => {
    try {
      const parsed = JSON.parse(metadataJson || "{}");
      return {
        image1: parsed.image1 ?? "/assets/about-institutional-1.png",
        image2: parsed.image2 ?? "/assets/about-institutional-2.png",
        badgeIcon: parsed.badgeIcon ?? "/assets/about-badge-icon.svg",
        badgeText: parsed.badgeText ?? "/assets/about-badge-text.png",
        profileDetails: Array.isArray(parsed.profileDetails)
          ? parsed.profileDetails
          : [
              { label: "Established", value: "1 January 2026" },
              { label: "Type", value: "Independent, Non-Profit" },
              { label: "Focus", value: "Law, Politics & Governance" },
              { label: "Motto", value: '"Knowledge, Justice, and Leadership for Global Change."' },
            ],
        secondaryActionUrl: parsed.secondaryActionUrl ?? "/about",
        secondaryActionText: parsed.secondaryActionText ?? "Learn More",
      };
    } catch {
      return {
        image1: "/assets/about-institutional-1.png",
        image2: "/assets/about-institutional-2.png",
        badgeIcon: "/assets/about-badge-icon.svg",
        badgeText: "/assets/about-badge-text.png",
        profileDetails: [
          { label: "Established", value: "1 January 2026" },
          { label: "Type", value: "Independent, Non-Profit" },
          { label: "Focus", value: "Law, Politics & Governance" },
          { label: "Motto", value: '"Knowledge, Justice, and Leadership for Global Change."' },
        ],
        secondaryActionUrl: "/about",
        secondaryActionText: "Learn More",
      };
    }
  };

  const updateProfileMetadata = (updater: (prev: any) => any) => {
    try {
      const cur = JSON.parse(metadataJson || "{}");
      const updated = updater({ ...getProfileMetadata(), ...cur });
      setMetadataJson(JSON.stringify(updated, null, 2));
    } catch {
      const base = getProfileMetadata();
      const updated = updater(base);
      setMetadataJson(JSON.stringify(updated, null, 2));
    }
  };

  const defaultObjectivesList: Array<{ num: string; text: string }> = [
    {
      num: "01",
      text: "Provide academic programs, training programs, and certificate courses, and establish partnerships with universities, international organizations, and civil society organizations.",
    },
    {
      num: "02",
      text: "Advance high-quality academic and policy research in law, politics, governance, human rights, forced displacement and statelessness, humanitarian affairs, and social development.",
    },
    {
      num: "03",
      text: "Promote intellectual inquiry and critical thinking through rigorous scholarship and interdisciplinary collaboration.",
    },
    {
      num: "04",
      text: "Develop future scholars, researchers, policymakers, public servants, and leaders committed to ethical responsibility and public service.",
    },
    {
      num: "05",
      text: "Encourage evidence-based policymaking and informed public dialogue on issues of national, regional, and global significance.",
    },
    {
      num: "06",
      text: "Promote human rights, justice, accountability, inclusion, and democratic values.",
    },
    {
      num: "07",
      text: "Strengthen collaboration among universities, research institutions, civil society organizations, international organizations, and policy networks.",
    },
    {
      num: "08",
      text: "Support innovative approaches to addressing complex legal, political, and humanitarian challenges.",
    },
    {
      num: "09",
      text: "Bridge the gap between research and practice by transforming knowledge into practical policy recommendations and institutional solutions.",
    },
    {
      num: "10",
      text: "Foster international cooperation and intellectual exchange across cultures, disciplines, and regions.",
    },
  ];

  const getObjectivesMetadata = (): Array<{ num: string; text: string }> => {
    try {
      const parsed = JSON.parse(metadataJson || "{}");
      if (Array.isArray(parsed.objectives)) {
        return parsed.objectives;
      }
      return defaultObjectivesList;
    } catch {
      return defaultObjectivesList;
    }
  };

  const updateObjectivesMetadata = (newObjectives: Array<{ num: string; text: string }>) => {
    try {
      const cur = JSON.parse(metadataJson || "{}");
      cur.objectives = newObjectives;
      setMetadataJson(JSON.stringify(cur, null, 2));
    } catch {
      setMetadataJson(JSON.stringify({ objectives: newObjectives }, null, 2));
    }
  };

  const defaultValuesList: Array<{ icon: string; title: string; desc: string }> = [
    {
      desc: "Commitment to the highest standards of scholarship, research, and intellectual inquiry.",
      icon: "🎓",
      title: "Academic Excellence",
    },
    {
      desc: "Dedication to honesty, transparency, professionalism, and responsible institutional conduct.",
      icon: "🔍",
      title: "Integrity and Accountability",
    },
    {
      desc: "Respect for the inherent worth, rights, and dignity of all individuals.",
      icon: "⚖️",
      title: "Justice and Human Dignity",
    },
    {
      desc: "Promotion of leadership grounded in responsibility, service, integrity, and ethical principles.",
      icon: "🏅",
      title: "Ethical Leadership",
    },
    {
      desc: "Recognition of diverse perspectives, experiences, and backgrounds as sources of intellectual strength.",
      icon: "🌈",
      title: "Inclusiveness and Diversity",
    },
    {
      desc: "Commitment to academic freedom and objective inquiry free from undue influence.",
      icon: "🧠",
      title: "Intellectual Independence",
    },
    {
      desc: "Support for rigorous, methodologically sound, and policy-relevant scholarship.",
      icon: "📊",
      title: "Evidence-Based Research",
    },
    {
      desc: "Encouragement of constructive dialogue, civic participation, and respect for democratic principles.",
      icon: "🗳️",
      title: "Democratic Engagement",
    },
    {
      desc: "Commitment to collaboration across borders in pursuit of shared knowledge and common solutions.",
      icon: "🌐",
      title: "International Cooperation",
    },
    {
      desc: "Recognition of the responsibility of academic institutions to contribute positively to society and the public good.",
      icon: "🤲",
      title: "Social Responsibility",
    },
  ];

  const getValuesMetadata = (): Array<{ icon: string; title: string; desc: string }> => {
    try {
      const parsed = JSON.parse(metadataJson || "{}");
      if (Array.isArray(parsed.values)) {
        return parsed.values;
      }
      return defaultValuesList;
    } catch {
      return defaultValuesList;
    }
  };

  const updateValuesMetadata = (newValues: Array<{ icon: string; title: string; desc: string }>) => {
    try {
      const cur = JSON.parse(metadataJson || "{}");
      cur.values = newValues;
      setMetadataJson(JSON.stringify(cur, null, 2));
    } catch {
      setMetadataJson(JSON.stringify({ values: newValues }, null, 2));
    }
  };

  interface GlobalEngagementMetadata {
    commitmentTitle: string;
    commitmentContent: string;
    studentRatingsCount: string;
    studentRatingsLabel: string;
    ratingAvatars: string[];
  }

  const defaultGlobalEngagementMetadata: GlobalEngagementMetadata = {
    commitmentTitle: "Institutional Commitment",
    commitmentContent:
      "The International Institute for Law and Politics is committed to serving as a platform where ideas are transformed into knowledge, knowledge is translated into policy, and policy contributes to positive social change.\n\nBy bringing together scholarship, leadership, and public engagement, the Institute seeks to make a meaningful contribution to the advancement of justice, responsible governance, human rights, humanitarian values, and sustainable development for present and future generations.",
    studentRatingsCount: "5000",
    studentRatingsLabel: "Student ratings",
    ratingAvatars: [
      "/assets/about-rating-avatar-1.png",
      "/assets/about-rating-avatar-2.png",
      "/assets/about-rating-avatar-3.png",
    ],
  };

  const [uploadingAvatarIdx, setUploadingAvatarIdx] = useState<number | null>(null);

  const getGlobalEngagementMetadata = (): GlobalEngagementMetadata => {
    try {
      const parsed = JSON.parse(metadataJson || "{}");
      return {
        commitmentTitle: parsed.commitmentTitle ?? defaultGlobalEngagementMetadata.commitmentTitle,
        commitmentContent: parsed.commitmentContent ?? defaultGlobalEngagementMetadata.commitmentContent,
        studentRatingsCount: parsed.studentRatingsCount ?? defaultGlobalEngagementMetadata.studentRatingsCount,
        studentRatingsLabel: parsed.studentRatingsLabel ?? defaultGlobalEngagementMetadata.studentRatingsLabel,
        ratingAvatars: Array.isArray(parsed.ratingAvatars)
          ? parsed.ratingAvatars
          : defaultGlobalEngagementMetadata.ratingAvatars,
      };
    } catch {
      return defaultGlobalEngagementMetadata;
    }
  };

  const updateGlobalEngagementMetadata = (updater: (prev: GlobalEngagementMetadata) => GlobalEngagementMetadata) => {
    try {
      const cur = JSON.parse(metadataJson || "{}");
      const base = getGlobalEngagementMetadata();
      const updated = updater({ ...base, ...cur });
      setMetadataJson(JSON.stringify(updated, null, 2));
    } catch {
      const base = getGlobalEngagementMetadata();
      const updated = updater(base);
      setMetadataJson(JSON.stringify(updated, null, 2));
    }
  };

  const handleAvatarUpload = async (file: File, idx: number) => {
    setUploadingAvatarIdx(idx);
    try {
      const res = await uploadMediaFile(token, file, "about");
      updateGlobalEngagementMetadata((prev) => {
        const nextAvatars = [...prev.ratingAvatars];
        nextAvatars[idx] = res.url;
        return { ...prev, ratingAvatars: nextAvatars };
      });
      onShowToast("Avatar image uploaded successfully!", "success");
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to upload avatar", "error");
    } finally {
      setUploadingAvatarIdx(null);
    }
  };

  interface FounderMessageMetadata {
    founderName: string;
    founderRole: string;
    founderInitials: string;
    signatureImage: string;
    paragraphs: string[];
  }

  const defaultFounderMessageMetadata: FounderMessageMetadata = {
    founderName: "Mohammed Siraj",
    founderRole: "Founder & President, IILP",
    founderInitials: "MS",
    signatureImage: "/assets/about-founder-signature.png",
    paragraphs: [
      "It is with profound pleasure and immense honor that I welcome you to the International Institute for Law and Politics (IILP) — a vibrant community committed to the creation of knowledge, rigorous scholarship, profound insights, and impactful engagement with the critical legal, political, humanitarian, and socio-economic issues defining our times. IILP was established upon a straightforward yet ambitious principle: knowledge must serve humanity. Knowledge is power, and that power cannot be siloed within academia or confined to intellectual discussions alone. It must be applied effectively to fight injustice, foster democracy, uphold human dignity, and seek solutions to the global challenges impacting communities across the globe, with a dedicated focus on displaced and refugee populations.",
      "My own experience — having lived through the Rohingya genocide and experienced life as a refugee — impelled me to create IILP. I profoundly understand the consequences of institution failure to protect the vulnerable, and the transformative potential of knowledge in service of justice. We live in times of immense change and uncertainty. Conflict, war, genocide, persecution, political violence, displacement, statelessness, inequity, failed governance, humanitarian crises, and violations of basic human rights continue to challenge communities worldwide. Addressing these complexities cannot be solely a matter of good intentions; it demands rigorous scholarship, responsible leadership, data-driven policies, interdisciplinary approaches, and an unyielding dedication to ethical public service. IILP serves as a central hub where scholars, researchers, students, policymakers, practitioners, and leaders, including young activists and future leaders, come together to exchange knowledge, build capacity, and contribute to a more just, equitable, and sustainable global future for all, particularly for those displaced or seeking refuge.",
      "IILP operates under the highest standards of research, intellectual inquiry, and academic integrity, complemented by an unwavering commitment to professionalism and excellence. We foster a culture that celebrates learning, creativity, collaboration, and civic engagement through our programs, publications, conferences, workshops, policy dialogues, training sessions, and partnerships. We firmly believe that law, politics, governance, human rights, and societal development are inextricably linked and that lasting change arises from integrative strategies that draw upon diverse perspectives and dialogue across academic disciplines, geographic regions, and cultural diversities.",
      "I encourage you to join our collective mission. Whether you are an esteemed professor, an aspiring scholar or student, a dedicated researcher, a seasoned policy practitioner, a grassroots activist, a collaborating organization or institution, a funding partner, or simply a concerned individual passionate about making a difference in the world, your involvement is invaluable to creating a better, more informed, more equitable, and more compassionate future. Together, we will convert knowledge into impactful action, bright ideas into lasting solutions, and devoted leadership into transformative and sustainable change.",
    ],
  };

  const [isUploadingSignature, setIsUploadingSignature] = useState(false);

  const getFounderMessageMetadata = (): FounderMessageMetadata => {
    try {
      const parsed = JSON.parse(metadataJson || "{}");
      return {
        founderName: parsed.founderName ?? defaultFounderMessageMetadata.founderName,
        founderRole: parsed.founderRole ?? defaultFounderMessageMetadata.founderRole,
        founderInitials: parsed.founderInitials ?? defaultFounderMessageMetadata.founderInitials,
        signatureImage: parsed.signatureImage ?? defaultFounderMessageMetadata.signatureImage,
        paragraphs: Array.isArray(parsed.paragraphs)
          ? parsed.paragraphs
          : defaultFounderMessageMetadata.paragraphs,
      };
    } catch {
      return defaultFounderMessageMetadata;
    }
  };

  const updateFounderMessageMetadata = (updater: (prev: FounderMessageMetadata) => FounderMessageMetadata) => {
    try {
      const cur = JSON.parse(metadataJson || "{}");
      const base = getFounderMessageMetadata();
      const updated = updater({ ...base, ...cur });
      setMetadataJson(JSON.stringify(updated, null, 2));
    } catch {
      const base = getFounderMessageMetadata();
      const updated = updater(base);
      setMetadataJson(JSON.stringify(updated, null, 2));
    }
  };

  const handleSignatureUpload = async (file: File) => {
    setIsUploadingSignature(true);
    try {
      const res = await uploadMediaFile(token, file, "about");
      updateFounderMessageMetadata((prev) => ({
        ...prev,
        signatureImage: res.url,
      }));
      onShowToast("Founder signature uploaded successfully!", "success");
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to upload signature", "error");
    } finally {
      setIsUploadingSignature(false);
    }
  };

  const [uploadingPathwayIdx, setUploadingPathwayIdx] = useState<number | null>(null);
  const [uploadingFoundingMemberIdx, setUploadingFoundingMemberIdx] = useState<number | null>(null);

  const getPathwaysMetadata = (): PathwaysIntroMetadata => {
    try {
      const parsed = JSON.parse(metadataJson || "{}");
      if (Array.isArray(parsed.pathways)) {
        return {
          pathways: parsed.pathways.map((p: any, idx: number) => ({
            id: String(p.id || `pathway-${idx + 1}`),
            name: String(p.name || `Pathway ${idx + 1}`),
            icon: String(p.icon || "/assets/tab-planet.svg"),
            title: String(p.title || p.name || ""),
            description: String(p.description || ""),
            eligibility: Array.isArray(p.eligibility) ? p.eligibility.map(String) : [],
            benefits: Array.isArray(p.benefits) ? p.benefits.map(String) : [],
          })),
        };
      }
      return defaultPathwaysIntroMetadata;
    } catch {
      return defaultPathwaysIntroMetadata;
    }
  };

  const updatePathwaysMetadata = (
    updater: (prev: PathwaysIntroMetadata) => PathwaysIntroMetadata
  ) => {
    try {
      const cur = JSON.parse(metadataJson || "{}");
      const base = getPathwaysMetadata();
      const updated = updater({ ...base, ...cur });
      setMetadataJson(JSON.stringify(updated, null, 2));
    } catch {
      const base = getPathwaysMetadata();
      const updated = updater(base);
      setMetadataJson(JSON.stringify(updated, null, 2));
    }
  };

  const getStructureIntroMetadata = (): StructureIntroMetadata => {
    try {
      const parsed = JSON.parse(metadataJson || "{}");
      if (Array.isArray(parsed.tiers)) {
        return {
          tiers: parsed.tiers.map((t: any) => ({
            title: String(t.title || ""),
            desc: String(t.desc || ""),
          })),
        };
      }
      return defaultStructureIntroMetadata;
    } catch {
      return defaultStructureIntroMetadata;
    }
  };

  const updateStructureIntroMetadata = (
    updater: (prev: StructureIntroMetadata) => StructureIntroMetadata
  ) => {
    try {
      const cur = JSON.parse(metadataJson || "{}");
      const base = getStructureIntroMetadata();
      const updated = updater({ ...base, ...cur });
      setMetadataJson(JSON.stringify(updated, null, 2));
    } catch {
      const base = getStructureIntroMetadata();
      const updated = updater(base);
      setMetadataJson(JSON.stringify(updated, null, 2));
    }
  };

  const getGoverningCouncilMetadata = (): GoverningCouncilMetadata => {
    try {
      const parsed = JSON.parse(metadataJson || "{}");
      if (Array.isArray(parsed.responsibilities)) {
        return {
          responsibilities: parsed.responsibilities.map((r: any, idx: number) => ({
            number: String(r.number || String(idx + 1).padStart(2, "0")),
            text: String(r.text || ""),
          })),
        };
      }
      return defaultGoverningCouncilMetadata;
    } catch {
      return defaultGoverningCouncilMetadata;
    }
  };

  const updateGoverningCouncilMetadata = (
    updater: (prev: GoverningCouncilMetadata) => GoverningCouncilMetadata
  ) => {
    try {
      const cur = JSON.parse(metadataJson || "{}");
      const base = getGoverningCouncilMetadata();
      const updated = updater({ ...base, ...cur });
      setMetadataJson(JSON.stringify(updated, null, 2));
    } catch {
      const base = getGoverningCouncilMetadata();
      const updated = updater(base);
      setMetadataJson(JSON.stringify(updated, null, 2));
    }
  };

  const getEthicsCommissionMetadata = (): EthicsCommissionMetadata => {
    try {
      const parsed = JSON.parse(metadataJson || "{}");
      return {
        cardTitle: String(parsed.cardTitle || defaultEthicsCommissionMetadata.cardTitle || "Accountability Functions"),
        ratingValue: String(parsed.ratingValue || defaultEthicsCommissionMetadata.ratingValue || "5000"),
        ratingLabel: String(parsed.ratingLabel || defaultEthicsCommissionMetadata.ratingLabel || "Student ratings"),
        functions: Array.isArray(parsed.functions)
          ? parsed.functions.map(String)
          : defaultEthicsCommissionMetadata.functions,
      };
    } catch {
      return defaultEthicsCommissionMetadata;
    }
  };

  const updateEthicsCommissionMetadata = (
    updater: (prev: EthicsCommissionMetadata) => EthicsCommissionMetadata
  ) => {
    try {
      const cur = JSON.parse(metadataJson || "{}");
      const base = getEthicsCommissionMetadata();
      const updated = updater({ ...base, ...cur });
      setMetadataJson(JSON.stringify(updated, null, 2));
    } catch {
      const base = getEthicsCommissionMetadata();
      const updated = updater(base);
      setMetadataJson(JSON.stringify(updated, null, 2));
    }
  };

  const getYouthLeadershipMetadata = (): YouthLeadershipMetadata => {
    try {
      const parsed = JSON.parse(metadataJson || "{}");
      return {
        cardTitle: String(parsed.cardTitle || defaultYouthLeadershipMetadata.cardTitle || "Assembly Functions"),
        ratingValue: String(parsed.ratingValue || defaultYouthLeadershipMetadata.ratingValue || "5000"),
        ratingLabel: String(parsed.ratingLabel || defaultYouthLeadershipMetadata.ratingLabel || "Student ratings"),
        functions: Array.isArray(parsed.functions)
          ? parsed.functions.map(String)
          : defaultYouthLeadershipMetadata.functions,
      };
    } catch {
      return defaultYouthLeadershipMetadata;
    }
  };

  const updateYouthLeadershipMetadata = (
    updater: (prev: YouthLeadershipMetadata) => YouthLeadershipMetadata
  ) => {
    try {
      const cur = JSON.parse(metadataJson || "{}");
      const base = getYouthLeadershipMetadata();
      const updated = updater({ ...base, ...cur });
      setMetadataJson(JSON.stringify(updated, null, 2));
    } catch {
      const base = getYouthLeadershipMetadata();
      const updated = updater(base);
      setMetadataJson(JSON.stringify(updated, null, 2));
    }
  };

  const getFoundingMembersMetadata = (): FoundingMembersMetadata => {
    try {
      const parsed = JSON.parse(metadataJson || "{}");
      if (Array.isArray(parsed.members)) {
        return {
          members: parsed.members.map((m: any) => ({
            name: String(m?.name ?? ""),
            role: String(m?.role ?? "Founding Member"),
            image: String(m?.image ?? "/assets/governance-founding-member.png"),
          })),
        };
      }
      return defaultFoundingMembersMetadata;
    } catch {
      return defaultFoundingMembersMetadata;
    }
  };

  const updateFoundingMembersMetadata = (
    updater: (prev: FoundingMembersMetadata) => FoundingMembersMetadata
  ) => {
    try {
      const cur = JSON.parse(metadataJson || "{}");
      const base = getFoundingMembersMetadata();
      const updated = updater({ ...base, ...cur });
      setMetadataJson(JSON.stringify(updated, null, 2));
    } catch {
      const base = getFoundingMembersMetadata();
      const updated = updater(base);
      setMetadataJson(JSON.stringify(updated, null, 2));
    }
  };

  const getPartnershipTracksMetadata = (): PartnershipTracksMetadata => {
    try {
      const parsed = JSON.parse(metadataJson || "{}");
      if (Array.isArray(parsed.tracks)) {
        return {
          tracks: parsed.tracks.map((t: any) => ({
            icon: String(t?.icon ?? "🤝"),
            title: String(t?.title ?? ""),
            description: String(t?.description ?? ""),
          })),
        };
      }
      return defaultPartnershipTracksMetadata;
    } catch {
      return defaultPartnershipTracksMetadata;
    }
  };

  const updatePartnershipTracksMetadata = (
    updater: (prev: PartnershipTracksMetadata) => PartnershipTracksMetadata
  ) => {
    try {
      const cur = JSON.parse(metadataJson || "{}");
      const base = getPartnershipTracksMetadata();
      const updated = updater({ ...base, ...cur });
      setMetadataJson(JSON.stringify(updated, null, 2));
    } catch {
      const base = getPartnershipTracksMetadata();
      const updated = updater(base);
      setMetadataJson(JSON.stringify(updated, null, 2));
    }
  };

  const getContactInfoCardsMetadata = (): ContactInfoCardsMetadata => {
    try {
      const parsed = JSON.parse(metadataJson || "{}");
      if (Array.isArray(parsed?.cards) && parsed.cards.length > 0) {
        return {
          cards: parsed.cards.map((c: any) => ({
            title: String(c?.title ?? ""),
            value: String(c?.value ?? ""),
            timing: String(c?.timing ?? ""),
            iconAlt: String(c?.iconAlt ?? ""),
            iconSrc: String(c?.iconSrc ?? ""),
            link: c?.link ? String(c.link) : undefined,
          })),
        };
      }
      return defaultContactInfoCardsMetadata;
    } catch {
      return defaultContactInfoCardsMetadata;
    }
  };

  const updateContactInfoCardsMetadata = (
    updater: (prev: ContactInfoCardsMetadata) => ContactInfoCardsMetadata
  ) => {
    try {
      const cur = JSON.parse(metadataJson || "{}");
      const base = getContactInfoCardsMetadata();
      const updated = updater({ ...base, ...cur });
      setMetadataJson(JSON.stringify(updated, null, 2));
      setFormData((prev) => ({
        ...prev,
        metadata: updated as Record<string, unknown>,
      }));
    } catch {
      const base = getContactInfoCardsMetadata();
      const updated = updater(base);
      setMetadataJson(JSON.stringify(updated, null, 2));
      setFormData((prev) => ({
        ...prev,
        metadata: updated as Record<string, unknown>,
      }));
    }
  };

  const handleContactCardIconUpload = async (file: File, cardIdx: number) => {
    try {
      const res = await uploadMediaFile(token, file, "icons");
      if (res?.url) {
        updateContactInfoCardsMetadata((prev) => {
          const list = [...prev.cards];
          list[cardIdx] = { ...list[cardIdx], iconSrc: res.url };
          return { ...prev, cards: list };
        });
        onShowToast("Icon uploaded successfully!", "success");
      }
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to upload icon", "error");
    }
  };

  const getContactMapMetadata = (): ContactMapMetadata => {
    try {
      const parsed = JSON.parse(metadataJson || "{}");
      return {
        mapType: parsed?.mapType === "image" || parsed?.map_type === "image" ? "image" : "embed",
        embedUrl: String(parsed?.embedUrl || parsed?.embed_url || defaultContactMapMetadata.embedUrl),
        mapImage: String(parsed?.mapImage || parsed?.map_image || defaultContactMapMetadata.mapImage),
        address: String(parsed?.address || defaultContactMapMetadata.address),
        phone: String(parsed?.phone || defaultContactMapMetadata.phone),
        email: String(parsed?.email || defaultContactMapMetadata.email),
        officeHours: String(parsed?.officeHours || parsed?.office_hours || defaultContactMapMetadata.officeHours),
      };
    } catch {
      return defaultContactMapMetadata;
    }
  };

  const updateContactMapMetadata = (
    updater: (prev: ContactMapMetadata) => ContactMapMetadata
  ) => {
    try {
      const base = getContactMapMetadata();
      const cur = JSON.parse(metadataJson || "{}");
      const updated = updater({ ...base, ...cur });
      setMetadataJson(JSON.stringify(updated, null, 2));
      setFormData((prev) => ({
        ...prev,
        metadata: updated as unknown as Record<string, unknown>,
      }));
    } catch {
      const base = getContactMapMetadata();
      const updated = updater(base);
      setMetadataJson(JSON.stringify(updated, null, 2));
      setFormData((prev) => ({
        ...prev,
        metadata: updated as unknown as Record<string, unknown>,
      }));
    }
  };

  const getPolicySectionsMetadata = (): PolicySectionsMetadata => {
    try {
      const parsed = JSON.parse(metadataJson || "{}");
      const lastUpdated = String(
        parsed?.lastUpdated || parsed?.last_updated || "January 2026"
      );
      if (Array.isArray(parsed?.sections) && parsed.sections.length > 0) {
        return {
          lastUpdated,
          sections: parsed.sections.map((s: any, idx: number) => ({
            id: String(s?.id || `section-${idx + 1}`),
            heading: String(s?.heading || `Section ${idx + 1}`),
            content: String(s?.content || ""),
          })),
        };
      }
      return defaultPolicySectionsMetadata;
    } catch {
      return defaultPolicySectionsMetadata;
    }
  };

  const updatePolicySectionsMetadata = (
    updater: (prev: PolicySectionsMetadata) => PolicySectionsMetadata
  ) => {
    try {
      const base = getPolicySectionsMetadata();
      const cur = JSON.parse(metadataJson || "{}");
      const updated = updater({ ...base, ...cur });
      setMetadataJson(JSON.stringify(updated, null, 2));
      setFormData((prev) => ({
        ...prev,
        metadata: updated as unknown as Record<string, unknown>,
      }));
    } catch {
      const base = getPolicySectionsMetadata();
      const updated = updater(base);
      setMetadataJson(JSON.stringify(updated, null, 2));
      setFormData((prev) => ({
        ...prev,
        metadata: updated as unknown as Record<string, unknown>,
      }));
    }
  };

  const handleFoundingMemberImageUpload = async (file: File, memberIdx: number) => {
    setUploadingFoundingMemberIdx(memberIdx);
    try {
      const res = await uploadMediaFile(token, file, "governance");
      updateFoundingMembersMetadata((prev) => {
        const list = [...prev.members];
        list[memberIdx] = { ...list[memberIdx], image: res.url };
        return { ...prev, members: list };
      });
      onShowToast("Member photo uploaded successfully!", "success");
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to upload image", "error");
    } finally {
      setUploadingFoundingMemberIdx(null);
    }
  };

  const handlePathwayIconUpload = async (file: File, pathwayIdx: number) => {
    setUploadingPathwayIdx(pathwayIdx);
    try {
      const res = await uploadMediaFile(token, file, "fellowships");
      updatePathwaysMetadata((prev) => {
        const list = [...prev.pathways];
        list[pathwayIdx] = { ...list[pathwayIdx], icon: res.url };
        return { ...prev, pathways: list };
      });
      onShowToast("Pathway icon uploaded successfully!", "success");
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to upload icon", "error");
    } finally {
      setUploadingPathwayIdx(null);
    }
  };

  const handleProfileImageUpload = async (
    file: File,
    fieldKey: "image1" | "image2" | "badgeIcon" | "badgeText"
  ) => {
    setUploadingProfileKey(fieldKey);
    try {
      const res = await uploadMediaFile(token, file, "about");
      updateProfileMetadata((prev: any) => ({
        ...prev,
        [fieldKey]: res.url,
      }));
      onShowToast("Image uploaded to institutional profile!", "success");
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to upload image", "error");
    } finally {
      setUploadingProfileKey(null);
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
    const pageDefs = PAGE_SECTIONS_REGISTRY[selectedPage] || [];
    const matchDef = pageDefs.find((d) => d.key === section.sectionKey);
    let initialMeta = section.metadata;
    if ((!initialMeta || Object.keys(initialMeta).length === 0) && matchDef?.defaultMetadata) {
      initialMeta = matchDef.defaultMetadata;
    }
    setMetadataJson(JSON.stringify(initialMeta || {}, null, 2));
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
      actionText: initialDef?.defaultActionText || "",
      actionUrl: initialDef?.defaultActionUrl || "",
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
          actionText: prev.actionText || match.defaultActionText || "",
          actionUrl: prev.actionUrl || match.defaultActionUrl || "",
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

  const handleConfirmDeleteSection = async () => {
    if (!sectionToDelete) return;

    setIsDeletingSection(true);
    try {
      await deleteAdminSection(token, selectedPage, sectionToDelete);
      onShowToast(`Section '${sectionToDelete}' deleted.`, "info");
      setSectionToDelete(null);
      loadSections();
    } catch (err: unknown) {
      onShowToast(err instanceof Error ? err.message : "Failed to delete section", "error");
    } finally {
      setIsDeletingSection(false);
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
                    onClick={() => setSectionToDelete(sKey)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl border border-[#e5e7eb] flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-4 shrink-0">
              <div>
                <h3 className="text-base font-bold text-[#101828]">
                  {isNewSection ? `Add New Section for /${selectedPage}` : `Edit Section '${editingKey}'`}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Configure section content, layout, and visibility settings.</p>
              </div>
              <button
                onClick={closeModal}
                className="text-[#98a2b3] hover:text-[#101828] text-lg font-bold cursor-pointer p-1 rounded-lg hover:bg-gray-100"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto modal-scroll p-6 space-y-4 text-xs">
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

                  <div className="pt-3 border-t border-[#b9e6fe]/60">
                    <label className="block text-[11px] font-bold text-[#00698c] uppercase tracking-wider mb-2">
                      Key Metrics / Stats Cards
                    </label>
                    <div className="space-y-2">
                      {(() => {
                        let currentStats: Array<{ number: string; label: string; progress: string }> = [];
                        try {
                          const parsed = JSON.parse(metadataJson || "{}");
                          currentStats = parsed.stats || [
                            { number: "6+", label: "Academic Departments", progress: "58%" },
                            { number: "18+", label: "Leadership Positions", progress: "58%" },
                            { number: "3+", label: "Fellowship Types", progress: "58%" },
                            { number: "5+", label: "Partnership Tracks", progress: "58%" },
                          ];
                        } catch {
                          currentStats = [];
                        }
                        return currentStats.map((stat, idx) => (
                          <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white/70 p-2.5 rounded-xl border border-[#b9e6fe]/50">
                            <div>
                              <span className="text-[10px] text-[#475467] font-semibold block mb-0.5">Value (e.g. 6+)</span>
                              <input
                                type="text"
                                value={stat.number || ""}
                                onChange={(e) => {
                                  try {
                                    const cur = JSON.parse(metadataJson || "{}");
                                    const list = [...(cur.stats || currentStats)];
                                    list[idx] = { ...list[idx], number: e.target.value };
                                    cur.stats = list;
                                    setMetadataJson(JSON.stringify(cur, null, 2));
                                  } catch {}
                                }}
                                className="w-full bg-white border border-[#d0d5dd] rounded-lg px-2 py-1 text-xs text-[#101828]"
                                placeholder="6+"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-[#475467] font-semibold block mb-0.5">Label</span>
                              <input
                                type="text"
                                value={stat.label || ""}
                                onChange={(e) => {
                                  try {
                                    const cur = JSON.parse(metadataJson || "{}");
                                    const list = [...(cur.stats || currentStats)];
                                    list[idx] = { ...list[idx], label: e.target.value };
                                    cur.stats = list;
                                    setMetadataJson(JSON.stringify(cur, null, 2));
                                  } catch {}
                                }}
                                className="w-full bg-white border border-[#d0d5dd] rounded-lg px-2 py-1 text-xs text-[#101828]"
                                placeholder="Academic Departments"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-[#475467] font-semibold block mb-0.5">Progress Bar (e.g. 58%)</span>
                              <input
                                type="text"
                                value={stat.progress || ""}
                                onChange={(e) => {
                                  try {
                                    const cur = JSON.parse(metadataJson || "{}");
                                    const list = [...(cur.stats || currentStats)];
                                    list[idx] = { ...list[idx], progress: e.target.value };
                                    cur.stats = list;
                                    setMetadataJson(JSON.stringify(cur, null, 2));
                                  } catch {}
                                }}
                                className="w-full bg-white border border-[#d0d5dd] rounded-lg px-2 py-1 text-xs text-[#101828]"
                                placeholder="58%"
                              />
                            </div>
                          </div>
                        ));
                      })()}
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

              {/* Institutional Profile Specific Visual Manager */}
              {(editingKey === "profile" || editingKey === "institutional_profile") && (
                <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></span>
                    <h4 className="text-xs font-bold text-[#0369a1] uppercase tracking-wider">
                      Institutional Profile Media &amp; Metadata Manager
                    </h4>
                  </div>

                  {/* 4 Images & Badges Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* image1 */}
                    <div className="bg-white p-3 rounded-xl border border-[#e0f2fe] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#344054]">
                          Main Showcase Image (Left)
                        </label>
                        <span className="text-[10px] text-gray-400 font-mono">image1</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getProfileMetadata().image1 || "/assets/about-institutional-1.png"}
                            alt="image1 preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/assets/about-institutional-1.png";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[11px] font-medium rounded-lg cursor-pointer transition">
                            {uploadingProfileKey === "image1" ? "Uploading..." : "Upload Image"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingProfileKey === "image1"}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                handleProfileImageUpload(file, "image1");
                                e.target.value = "";
                              }}
                            />
                          </label>
                          <input
                            type="text"
                            value={getProfileMetadata().image1 || ""}
                            onChange={(e) => {
                              updateProfileMetadata((prev) => ({ ...prev, image1: e.target.value }));
                            }}
                            placeholder="/assets/about-institutional-1.png"
                            className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2 py-1 text-[11px] font-mono text-[#101828]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* image2 */}
                    <div className="bg-white p-3 rounded-xl border border-[#e0f2fe] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#344054]">
                          Overlapping Image (Right)
                        </label>
                        <span className="text-[10px] text-gray-400 font-mono">image2</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getProfileMetadata().image2 || "/assets/about-institutional-2.png"}
                            alt="image2 preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/assets/about-institutional-2.png";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[11px] font-medium rounded-lg cursor-pointer transition">
                            {uploadingProfileKey === "image2" ? "Uploading..." : "Upload Image"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingProfileKey === "image2"}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                handleProfileImageUpload(file, "image2");
                                e.target.value = "";
                              }}
                            />
                          </label>
                          <input
                            type="text"
                            value={getProfileMetadata().image2 || ""}
                            onChange={(e) => {
                              updateProfileMetadata((prev) => ({ ...prev, image2: e.target.value }));
                            }}
                            placeholder="/assets/about-institutional-2.png"
                            className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2 py-1 text-[11px] font-mono text-[#101828]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* badgeIcon */}
                    <div className="bg-white p-3 rounded-xl border border-[#e0f2fe] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#344054]">
                          Badge Center Emblem (SVG / Icon)
                        </label>
                        <span className="text-[10px] text-gray-400 font-mono">badgeIcon</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-[#f8fafc] flex items-center justify-center relative p-1.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getProfileMetadata().badgeIcon || "/assets/about-badge-icon.svg"}
                            alt="badgeIcon preview"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/assets/about-badge-icon.svg";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[11px] font-medium rounded-lg cursor-pointer transition">
                            {uploadingProfileKey === "badgeIcon" ? "Uploading..." : "Upload Icon"}
                            <input
                              type="file"
                              accept="image/*,.svg"
                              className="hidden"
                              disabled={uploadingProfileKey === "badgeIcon"}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                handleProfileImageUpload(file, "badgeIcon");
                                e.target.value = "";
                              }}
                            />
                          </label>
                          <input
                            type="text"
                            value={getProfileMetadata().badgeIcon || ""}
                            onChange={(e) => {
                              updateProfileMetadata((prev) => ({ ...prev, badgeIcon: e.target.value }));
                            }}
                            placeholder="/assets/about-badge-icon.svg"
                            className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2 py-1 text-[11px] font-mono text-[#101828]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* badgeText */}
                    <div className="bg-white p-3 rounded-xl border border-[#e0f2fe] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#344054]">
                          Badge Circular Text
                        </label>
                        <span className="text-[10px] text-gray-400 font-mono">badgeText</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-[#f8fafc] flex items-center justify-center relative p-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getProfileMetadata().badgeText || "/assets/about-badge-text.png"}
                            alt="badgeText preview"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/assets/about-badge-text.png";
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[11px] font-medium rounded-lg cursor-pointer transition">
                            {uploadingProfileKey === "badgeText" ? "Uploading..." : "Upload Stamp"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingProfileKey === "badgeText"}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                handleProfileImageUpload(file, "badgeText");
                                e.target.value = "";
                              }}
                            />
                          </label>
                          <input
                            type="text"
                            value={getProfileMetadata().badgeText || ""}
                            onChange={(e) => {
                              updateProfileMetadata((prev) => ({ ...prev, badgeText: e.target.value }));
                            }}
                            placeholder="/assets/about-badge-text.png"
                            className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2 py-1 text-[11px] font-mono text-[#101828]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details List */}
                  <div className="bg-white p-3 rounded-xl border border-[#e0f2fe] space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#0369a1]">
                        Profile Key Details ({getProfileMetadata().profileDetails.length} facts)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const data = getProfileMetadata();
                          data.profileDetails.push({ label: "Key", value: "Value" });
                          updateProfileMetadata(() => data);
                        }}
                        className="px-2.5 py-1 bg-white border border-[#bae6fd] hover:bg-[#e0f2fe] text-[#0369a1] text-xs font-semibold rounded-lg transition cursor-pointer"
                      >
                        + Add Fact Row
                      </button>
                    </div>

                    <div className="space-y-2">
                      {getProfileMetadata().profileDetails.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.label || ""}
                            onChange={(e) => {
                              const data = getProfileMetadata();
                              data.profileDetails[idx].label = e.target.value;
                              updateProfileMetadata(() => data);
                            }}
                            placeholder="Label (e.g. Established)"
                            className="w-1/3 bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1 text-xs text-[#101828]"
                          />
                          <input
                            type="text"
                            value={item.value || ""}
                            onChange={(e) => {
                              const data = getProfileMetadata();
                              data.profileDetails[idx].value = e.target.value;
                              updateProfileMetadata(() => data);
                            }}
                            placeholder="Value (e.g. 1 January 2026)"
                            className="flex-1 bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1 text-xs text-[#101828]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const data = getProfileMetadata();
                              data.profileDetails.splice(idx, 1);
                              updateProfileMetadata(() => data);
                            }}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer"
                            title="Remove row"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Secondary Action */}
                  <div className="bg-white p-3 rounded-xl border border-[#e0f2fe] space-y-2">
                    <label className="block text-xs font-bold text-[#0369a1]">
                      Secondary Action Button
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#475467] mb-1">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={getProfileMetadata().secondaryActionText || ""}
                          onChange={(e) => {
                            updateProfileMetadata((prev) => ({ ...prev, secondaryActionText: e.target.value }));
                          }}
                          placeholder="e.g. Learn More"
                          className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1 text-xs text-[#101828]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#475467] mb-1">
                          Target URL / Link
                        </label>
                        <input
                          type="text"
                          value={getProfileMetadata().secondaryActionUrl || ""}
                          onChange={(e) => {
                            updateProfileMetadata((prev) => ({ ...prev, secondaryActionUrl: e.target.value }));
                          }}
                          placeholder="e.g. /about"
                          className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1 text-xs text-[#101828]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Strategic Objectives Specific Visual Manager */}
              {(editingKey === "objectives" || editingKey === "strategic_objectives") && (
                <div className="bg-[#f0fdfa] border border-[#99f6e4] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488]"></span>
                      <h4 className="text-xs font-bold text-[#0f766e] uppercase tracking-wider">
                        Strategic Objectives Manager ({getObjectivesMetadata().length} Goals)
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const list = getObjectivesMetadata();
                          const nextNum = String(list.length + 1).padStart(2, "0");
                          updateObjectivesMetadata([...list, { num: nextNum, text: "" }]);
                        }}
                        className="px-3 py-1 bg-[#0d9488] hover:bg-[#0f766e] text-white text-[11px] font-semibold rounded-lg shadow-sm transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>+ Add Objective</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#134e4a]/80">
                    Each objective card displays a numbered sequence and descriptive institutional mission text on the About page.
                  </p>

                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {getObjectivesMetadata().map((obj, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-xl border border-[#ccfbf1] shadow-xs flex flex-col sm:flex-row gap-3 items-start"
                      >
                        {/* Number Input & Reorder Controls */}
                        <div className="flex sm:flex-col items-center gap-1 shrink-0 w-full sm:w-20">
                          <div className="w-full">
                            <label className="block text-[9px] font-bold text-[#475467] uppercase mb-0.5">
                              Number
                            </label>
                            <input
                              type="text"
                              value={obj.num}
                              onChange={(e) => {
                                const list = [...getObjectivesMetadata()];
                                list[idx] = { ...list[idx], num: e.target.value };
                                updateObjectivesMetadata(list);
                              }}
                              placeholder="01"
                              className="w-full bg-[#f0fdfa] border border-[#99f6e4] text-[#0f766e] font-bold text-center rounded-lg px-1.5 py-1 text-xs"
                            />
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                if (idx === 0) return;
                                const list = [...getObjectivesMetadata()];
                                const temp = list[idx - 1];
                                list[idx - 1] = list[idx];
                                list[idx] = temp;
                                updateObjectivesMetadata(list);
                              }}
                              className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              disabled={idx === getObjectivesMetadata().length - 1}
                              onClick={() => {
                                const list = [...getObjectivesMetadata()];
                                if (idx >= list.length - 1) return;
                                const temp = list[idx + 1];
                                list[idx + 1] = list[idx];
                                list[idx] = temp;
                                updateObjectivesMetadata(list);
                              }}
                              className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              ▼
                            </button>
                          </div>
                        </div>

                        {/* Description Textarea */}
                        <div className="flex-1 w-full">
                          <label className="block text-[10px] font-semibold text-[#344054] mb-1">
                            Objective Description
                          </label>
                          <textarea
                            rows={2}
                            value={obj.text}
                            onChange={(e) => {
                              const list = [...getObjectivesMetadata()];
                              list[idx] = { ...list[idx], text: e.target.value };
                              updateObjectivesMetadata(list);
                            }}
                            placeholder="Enter detailed objective statement..."
                            className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] focus:bg-white focus:outline-hidden focus:border-[#0d9488]"
                          />
                        </div>

                        {/* Delete Button */}
                        <div className="shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              const list = [...getObjectivesMetadata()];
                              list.splice(idx, 1);
                              updateObjectivesMetadata(list);
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition"
                            title="Delete Objective"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {getObjectivesMetadata().length === 0 && (
                    <div className="text-center py-6 bg-white rounded-xl border border-dashed border-[#99f6e4]">
                      <p className="text-xs text-gray-500 mb-2">No objectives currently configured.</p>
                      <button
                        type="button"
                        onClick={() => updateObjectivesMetadata(defaultObjectivesList)}
                        className="text-xs text-[#0d9488] font-semibold hover:underline cursor-pointer"
                      >
                        Reset to Default 10 Objectives
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Institutional Values Specific Visual Manager */}
              {(editingKey === "values" || editingKey === "institutional_values") && (
                <div className="bg-[#eef2ff] border border-[#c7d2fe] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#4f46e5]"></span>
                      <h4 className="text-xs font-bold text-[#3730a3] uppercase tracking-wider">
                        Institutional Values Manager ({getValuesMetadata().length} Values)
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const list = getValuesMetadata();
                          updateValuesMetadata([...list, { icon: "⭐", title: "", desc: "" }]);
                        }}
                        className="px-3 py-1 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-[11px] font-semibold rounded-lg shadow-sm transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>+ Add Value</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#312e81]/80">
                    Define the core institutional principles, icons, and descriptions displayed on the About page values grid.
                  </p>

                  <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
                    {getValuesMetadata().map((val, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3.5 rounded-xl border border-[#e0e7ff] shadow-xs flex flex-col gap-2.5"
                      >
                        <div className="flex items-center justify-between gap-3 border-b border-[#f1f5f9] pb-2">
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            {/* Icon picker / preview */}
                            <div className="w-10 h-10 shrink-0 bg-[#f5f3ff] border border-[#ddd6fe] rounded-lg flex items-center justify-center text-xl">
                              {val.icon || "🏛️"}
                            </div>
                            <div className="w-24 shrink-0">
                              <label className="block text-[9px] font-bold text-[#475467] uppercase mb-0.5">
                                Icon / Emoji
                              </label>
                              <input
                                type="text"
                                value={val.icon}
                                onChange={(e) => {
                                  const list = [...getValuesMetadata()];
                                  list[idx] = { ...list[idx], icon: e.target.value };
                                  updateValuesMetadata(list);
                                }}
                                placeholder="🎓"
                                className="w-full bg-[#f8fafc] border border-[#d0d5dd] text-center rounded-lg px-2 py-1 text-xs"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <label className="block text-[9px] font-bold text-[#475467] uppercase mb-0.5">
                                Title
                              </label>
                              <input
                                type="text"
                                value={val.title}
                                onChange={(e) => {
                                  const list = [...getValuesMetadata()];
                                  list[idx] = { ...list[idx], title: e.target.value };
                                  updateValuesMetadata(list);
                                }}
                                placeholder="Value Title"
                                className="w-full bg-[#f8fafc] border border-[#d0d5dd] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#1e1b4b]"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                if (idx === 0) return;
                                const list = [...getValuesMetadata()];
                                const temp = list[idx - 1];
                                list[idx - 1] = list[idx];
                                list[idx] = temp;
                                updateValuesMetadata(list);
                              }}
                              className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                              title="Move Up"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              disabled={idx === getValuesMetadata().length - 1}
                              onClick={() => {
                                const list = [...getValuesMetadata()];
                                if (idx >= list.length - 1) return;
                                const temp = list[idx + 1];
                                list[idx + 1] = list[idx];
                                list[idx] = temp;
                                updateValuesMetadata(list);
                              }}
                              className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                              title="Move Down"
                            >
                              ▼
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const list = [...getValuesMetadata()];
                                list.splice(idx, 1);
                                updateValuesMetadata(list);
                              }}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer ml-1"
                              title="Delete Value"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-[#344054] mb-1">
                            Description
                          </label>
                          <textarea
                            rows={2}
                            value={val.desc}
                            onChange={(e) => {
                              const list = [...getValuesMetadata()];
                              list[idx] = { ...list[idx], desc: e.target.value };
                              updateValuesMetadata(list);
                            }}
                            placeholder="Detailed description of this core value..."
                            className="w-full bg-[#f8fafc] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] focus:bg-white focus:outline-hidden focus:border-[#4f46e5]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {getValuesMetadata().length === 0 && (
                    <div className="text-center py-6 bg-white rounded-xl border border-dashed border-[#c7d2fe]">
                      <p className="text-xs text-gray-500 mb-2">No institutional values currently configured.</p>
                      <button
                        type="button"
                        onClick={() => updateValuesMetadata(defaultValuesList)}
                        className="text-xs text-[#4f46e5] font-semibold hover:underline cursor-pointer"
                      >
                        Reset to Default 10 Values
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Global Engagement Specific Visual Manager */}
              {editingKey === "global_engagement" && (
                <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></span>
                    <h4 className="text-xs font-bold text-[#0369a1] uppercase tracking-wider">
                      Global Engagement Card &amp; Ratings Manager
                    </h4>
                  </div>

                  <p className="text-[11px] text-[#0c4a6e]/80">
                    Configure the Institutional Commitment card and the Floating Student Ratings counter displayed on the Global Engagement section.
                  </p>

                  {/* Institutional Commitment Card Settings */}
                  <div className="bg-white p-3.5 rounded-xl border border-[#e0f2fe] space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0284c7]"></span>
                      <h5 className="text-[11px] font-bold text-[#0369a1] uppercase tracking-wider">
                        Institutional Commitment Card
                      </h5>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#344054] mb-1">
                        Commitment Title
                      </label>
                      <input
                        type="text"
                        value={getGlobalEngagementMetadata().commitmentTitle}
                        onChange={(e) => {
                          updateGlobalEngagementMetadata((prev) => ({
                            ...prev,
                            commitmentTitle: e.target.value,
                          }));
                        }}
                        placeholder="Institutional Commitment"
                        className="w-full bg-[#f8fafc] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#344054] mb-1">
                        Commitment Paragraphs (Separate paragraphs with double newlines)
                      </label>
                      <textarea
                        rows={4}
                        value={getGlobalEngagementMetadata().commitmentContent}
                        onChange={(e) => {
                          updateGlobalEngagementMetadata((prev) => ({
                            ...prev,
                            commitmentContent: e.target.value,
                          }));
                        }}
                        placeholder="The International Institute for Law and Politics is committed to..."
                        className="w-full bg-[#f8fafc] border border-[#d0d5dd] rounded-lg px-2.5 py-2 text-xs text-[#101828] leading-relaxed focus:bg-white focus:outline-hidden focus:border-[#0284c7]"
                      />
                    </div>
                  </div>

                  {/* Floating Student Ratings Card Settings */}
                  <div className="bg-white p-3.5 rounded-xl border border-[#e0f2fe] space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0284c7]"></span>
                      <h5 className="text-[11px] font-bold text-[#0369a1] uppercase tracking-wider">
                        Floating Student Ratings Card
                      </h5>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#344054] mb-1">
                          Student Ratings Count
                        </label>
                        <input
                          type="text"
                          value={getGlobalEngagementMetadata().studentRatingsCount}
                          onChange={(e) => {
                            updateGlobalEngagementMetadata((prev) => ({
                              ...prev,
                              studentRatingsCount: e.target.value,
                            }));
                          }}
                          placeholder="5000"
                          className="w-full bg-[#f8fafc] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#344054] mb-1">
                          Student Ratings Label
                        </label>
                        <input
                          type="text"
                          value={getGlobalEngagementMetadata().studentRatingsLabel}
                          onChange={(e) => {
                            updateGlobalEngagementMetadata((prev) => ({
                              ...prev,
                              studentRatingsLabel: e.target.value,
                            }));
                          }}
                          placeholder="Student ratings"
                          className="w-full bg-[#f8fafc] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828]"
                        />
                      </div>
                    </div>

                    {/* Rating Avatars Manager */}
                    <div className="pt-2 border-t border-[#f1f5f9] space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#344054]">
                          Reviewer Avatars ({getGlobalEngagementMetadata().ratingAvatars.length} Avatars)
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            updateGlobalEngagementMetadata((prev) => ({
                              ...prev,
                              ratingAvatars: [...prev.ratingAvatars, "/assets/about-rating-avatar-1.png"],
                            }));
                          }}
                          className="text-[11px] text-[#0284c7] font-semibold hover:underline cursor-pointer"
                        >
                          + Add Avatar
                        </button>
                      </div>

                      <div className="space-y-2">
                        {getGlobalEngagementMetadata().ratingAvatars.map((avatarUrl, aIdx) => (
                          <div key={aIdx} className="flex items-center gap-2.5 bg-[#f8fafc] p-2 rounded-lg border border-[#e2e8f0]">
                            <div className="w-9 h-9 shrink-0 rounded-full overflow-hidden border border-gray-300 bg-gray-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={avatarUrl || "/assets/about-rating-avatar-1.png"}
                                alt={`Avatar ${aIdx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/assets/about-rating-avatar-1.png";
                                }}
                              />
                            </div>

                            <input
                              type="text"
                              value={avatarUrl}
                              onChange={(e) => {
                                updateGlobalEngagementMetadata((prev) => {
                                  const list = [...prev.ratingAvatars];
                                  list[aIdx] = e.target.value;
                                  return { ...prev, ratingAvatars: list };
                                });
                              }}
                              placeholder="/assets/about-rating-avatar-1.png"
                              className="flex-1 min-w-0 bg-white border border-[#d0d5dd] rounded-lg px-2 py-1 text-xs font-mono text-[#101828]"
                            />

                            <label className="px-2.5 py-1 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[11px] font-semibold rounded-lg cursor-pointer transition shrink-0">
                              {uploadingAvatarIdx === aIdx ? "..." : "Upload"}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingAvatarIdx === aIdx}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  handleAvatarUpload(file, aIdx);
                                  e.target.value = "";
                                }}
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => {
                                updateGlobalEngagementMetadata((prev) => {
                                  const list = [...prev.ratingAvatars];
                                  list.splice(aIdx, 1);
                                  return { ...prev, ratingAvatars: list };
                                });
                              }}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer shrink-0"
                              title="Delete Avatar"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Founder's Message Specific Visual Manager */}
              {editingKey === "founder_message" && (
                <div className="bg-[#faf5ff] border border-[#e9d5ff] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9333ea]"></span>
                    <h4 className="text-xs font-bold text-[#6b21a8] uppercase tracking-wider">
                      President &amp; Founder Message Settings
                    </h4>
                  </div>

                  <p className="text-[11px] text-[#581c87]/80">
                    Manage the founder attribution details, signature overlay image, and the full multi-paragraph letter.
                  </p>

                  {/* Founder Profile Details Card */}
                  <div className="bg-white p-3.5 rounded-xl border border-[#f3e8ff] space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#9333ea]"></span>
                      <h5 className="text-[11px] font-bold text-[#6b21a8] uppercase tracking-wider">
                        Author Attribution &amp; Signature
                      </h5>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#344054] mb-1">
                          Founder Name
                        </label>
                        <input
                          type="text"
                          value={getFounderMessageMetadata().founderName}
                          onChange={(e) => {
                            updateFounderMessageMetadata((prev) => ({
                              ...prev,
                              founderName: e.target.value,
                            }));
                          }}
                          placeholder="Mohammed Siraj"
                          className="w-full bg-[#fcfaff] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#344054] mb-1">
                          Role / Title
                        </label>
                        <input
                          type="text"
                          value={getFounderMessageMetadata().founderRole}
                          onChange={(e) => {
                            updateFounderMessageMetadata((prev) => ({
                              ...prev,
                              founderRole: e.target.value,
                            }));
                          }}
                          placeholder="Founder & President, IILP"
                          className="w-full bg-[#fcfaff] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#344054] mb-1">
                          Badge Initials
                        </label>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs text-white text-xs font-serif font-bold"
                            style={{ background: 'linear-gradient(135deg, rgb(0, 0, 128) 0%, rgb(0, 191, 255) 100%)' }}
                          >
                            {getFounderMessageMetadata().founderInitials || "MS"}
                          </div>
                          <input
                            type="text"
                            maxLength={4}
                            value={getFounderMessageMetadata().founderInitials}
                            onChange={(e) => {
                              updateFounderMessageMetadata((prev) => ({
                                ...prev,
                                founderInitials: e.target.value,
                              }));
                            }}
                            placeholder="MS"
                            className="w-full bg-[#fcfaff] border border-[#d0d5dd] text-center font-serif font-bold rounded-lg px-2 py-1 text-xs text-[#101828]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Signature Image */}
                    <div className="pt-2 border-t border-[#f3e8ff]">
                      <label className="block text-[11px] font-semibold text-[#344054] mb-1">
                        Signature Overlay Image
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-12 shrink-0 bg-[#f8fafc] border border-gray-300 rounded-lg flex items-center justify-center p-1 relative overflow-hidden">
                          {getFounderMessageMetadata().signatureImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={getFounderMessageMetadata().signatureImage}
                              alt="Signature preview"
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-[10px] text-gray-400">No Signature</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <input
                            type="text"
                            value={getFounderMessageMetadata().signatureImage}
                            onChange={(e) => {
                              updateFounderMessageMetadata((prev) => ({
                                ...prev,
                                signatureImage: e.target.value,
                              }));
                            }}
                            placeholder="/assets/about-founder-signature.png"
                            className="w-full bg-[#fcfaff] border border-[#d0d5dd] rounded-lg px-2 py-1 text-xs font-mono text-[#101828]"
                          />
                        </div>

                        <label className="px-3 py-1.5 bg-[#9333ea] hover:bg-[#7e22ce] text-white text-[11px] font-semibold rounded-lg cursor-pointer transition shrink-0">
                          {isUploadingSignature ? "Uploading..." : "Upload Signature"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isUploadingSignature}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              handleSignatureUpload(file);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Letter Paragraphs Manager */}
                  <div className="bg-white p-3.5 rounded-xl border border-[#f3e8ff] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#9333ea]"></span>
                        <h5 className="text-[11px] font-bold text-[#6b21a8] uppercase tracking-wider">
                          Letter Paragraphs ({getFounderMessageMetadata().paragraphs.length} Paragraphs)
                        </h5>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          updateFounderMessageMetadata((prev) => ({
                            ...prev,
                            paragraphs: [...prev.paragraphs, ""],
                          }));
                        }}
                        className="px-3 py-1 bg-[#9333ea] hover:bg-[#7e22ce] text-white text-[11px] font-semibold rounded-lg shadow-sm transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>+ Add Paragraph</span>
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {getFounderMessageMetadata().paragraphs.map((pText, pIdx) => (
                        <div key={pIdx} className="bg-[#faf5ff] p-2.5 rounded-xl border border-[#e9d5ff] space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#6b21a8] uppercase tracking-wider">
                              Paragraph {pIdx + 1}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={pIdx === 0}
                                onClick={() => {
                                  if (pIdx === 0) return;
                                  const list = [...getFounderMessageMetadata().paragraphs];
                                  const temp = list[pIdx - 1];
                                  list[pIdx - 1] = list[pIdx];
                                  list[pIdx - 1] = list[pIdx];
                                  const swap = list[pIdx - 1];
                                  list[pIdx - 1] = list[pIdx];
                                  list[pIdx] = swap;
                                  updateFounderMessageMetadata((prev) => ({ ...prev, paragraphs: list }));
                                }}
                                className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                                title="Move Up"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                disabled={pIdx === getFounderMessageMetadata().paragraphs.length - 1}
                                onClick={() => {
                                  const list = [...getFounderMessageMetadata().paragraphs];
                                  if (pIdx >= list.length - 1) return;
                                  const temp = list[pIdx + 1];
                                  list[pIdx + 1] = list[pIdx];
                                  list[pIdx] = temp;
                                  updateFounderMessageMetadata((prev) => ({ ...prev, paragraphs: list }));
                                }}
                                className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                                title="Move Down"
                              >
                                ▼
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const list = [...getFounderMessageMetadata().paragraphs];
                                  list.splice(pIdx, 1);
                                  updateFounderMessageMetadata((prev) => ({ ...prev, paragraphs: list }));
                                }}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded cursor-pointer ml-1"
                                title="Delete Paragraph"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          <textarea
                            rows={3}
                            value={pText}
                            onChange={(e) => {
                              const list = [...getFounderMessageMetadata().paragraphs];
                              list[pIdx] = e.target.value;
                              updateFounderMessageMetadata((prev) => ({ ...prev, paragraphs: list }));
                            }}
                            placeholder="Enter paragraph text..."
                            className="w-full bg-white border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] leading-relaxed focus:outline-hidden focus:border-[#9333ea]"
                          />
                        </div>
                      ))}
                    </div>

                    {getFounderMessageMetadata().paragraphs.length === 0 && (
                      <div className="text-center py-6 bg-white rounded-xl border border-dashed border-[#e9d5ff]">
                        <p className="text-xs text-gray-500 mb-2">No paragraphs configured.</p>
                        <button
                          type="button"
                          onClick={() => {
                            updateFounderMessageMetadata((prev) => ({
                              ...prev,
                              paragraphs: defaultFounderMessageMetadata.paragraphs,
                            }));
                          }}
                          className="text-xs text-[#9333ea] font-semibold hover:underline cursor-pointer"
                        >
                          Reset to Default 4 Paragraphs
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fellowship Pathways Intro Specific Visual Manager */}
              {(editingKey === "pathways_intro" ||
                editingKey === "categories" ||
                editingKey === "pathways") && (
                <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></span>
                      <h4 className="text-xs font-bold text-[#0369a1] uppercase tracking-wider">
                        Fellowship Pathways, Eligibility &amp; Benefits Manager
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-[#0284c7] bg-white px-2.5 py-0.5 rounded-full border border-[#bae6fd]">
                      {getPathwaysMetadata().pathways.length} Pathways Configured
                    </span>
                  </div>

                  <p className="text-[11px] text-[#075985]/80">
                    Manage fellowship tracks (Research Fellows, Junior Fellows, Honorary Fellows), including role descriptions, SVG/image icons, eligibility requirements, and institutional benefits.
                  </p>

                  {/* Pathway Cards */}
                  <div className="space-y-4">
                    {getPathwaysMetadata().pathways.map((pathway, pIdx) => {
                      const iconPresets = [
                        { label: "Planet", url: "/assets/tab-planet.svg" },
                        { label: "Hat", url: "/assets/tab-hat.svg" },
                        { label: "Trophy", url: "/assets/tab-trophy.svg" },
                      ];

                      return (
                        <div
                          key={`pathway-${pIdx}`}
                          className="bg-white p-4 rounded-xl border border-[#e0f2fe] shadow-xs space-y-3 relative group"
                        >
                          {/* Card Header with reorder/delete */}
                          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-[#0284c7] text-white flex items-center justify-center text-[11px] font-bold">
                                {pIdx + 1}
                              </span>
                              <div className="w-6 h-6 relative shrink-0 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-md p-0.5">
                                {pathway.icon ? (
                                  <img
                                    src={pathway.icon}
                                    alt={pathway.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLElement).style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <span className="text-[10px] text-gray-400">?</span>
                                )}
                              </div>
                              <span className="text-xs font-bold text-[#101828]">
                                {pathway.name || `Pathway #${pIdx + 1}`}
                              </span>
                              <span className="text-[10px] text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                                id: {pathway.id}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                title="Move Pathway Up"
                                disabled={pIdx === 0}
                                onClick={() => {
                                  const list = [...getPathwaysMetadata().pathways];
                                  const temp = list[pIdx - 1];
                                  list[pIdx - 1] = list[pIdx];
                                  list[pIdx] = temp;
                                  updatePathwaysMetadata((prev) => ({ ...prev, pathways: list }));
                                }}
                                className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                title="Move Pathway Down"
                                disabled={pIdx === getPathwaysMetadata().pathways.length - 1}
                                onClick={() => {
                                  const list = [...getPathwaysMetadata().pathways];
                                  const temp = list[pIdx + 1];
                                  list[pIdx + 1] = list[pIdx];
                                  list[pIdx] = temp;
                                  updatePathwaysMetadata((prev) => ({ ...prev, pathways: list }));
                                }}
                                className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 cursor-pointer"
                              >
                                ▼
                              </button>
                              <button
                                type="button"
                                title="Delete Pathway"
                                onClick={() => {
                                  if (confirm(`Delete fellowship pathway "${pathway.name}"?`)) {
                                    const list = getPathwaysMetadata().pathways.filter((_, i) => i !== pIdx);
                                    updatePathwaysMetadata((prev) => ({ ...prev, pathways: list }));
                                  }
                                }}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer ml-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* Fields Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#344054] mb-1">
                                Unique ID / Slug (e.g. research)
                              </label>
                              <input
                                type="text"
                                value={pathway.id}
                                onChange={(e) => {
                                  const list = [...getPathwaysMetadata().pathways];
                                  list[pIdx] = { ...list[pIdx], id: e.target.value };
                                  updatePathwaysMetadata((prev) => ({ ...prev, pathways: list }));
                                }}
                                placeholder="research"
                                className="w-full bg-[#f8fafc] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-[#344054] mb-1">
                                Tab / Category Name
                              </label>
                              <input
                                type="text"
                                value={pathway.name}
                                onChange={(e) => {
                                  const list = [...getPathwaysMetadata().pathways];
                                  list[pIdx] = { ...list[pIdx], name: e.target.value };
                                  updatePathwaysMetadata((prev) => ({ ...prev, pathways: list }));
                                }}
                                placeholder="Research Fellows"
                                className="w-full bg-[#f8fafc] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] font-semibold"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-[#344054] mb-1">
                                Title in Details Card
                              </label>
                              <input
                                type="text"
                                value={pathway.title}
                                onChange={(e) => {
                                  const list = [...getPathwaysMetadata().pathways];
                                  list[pIdx] = { ...list[pIdx], title: e.target.value };
                                  updatePathwaysMetadata((prev) => ({ ...prev, pathways: list }));
                                }}
                                placeholder="Research Fellows"
                                className="w-full bg-[#f8fafc] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828]"
                              />
                            </div>
                          </div>

                          {/* Icon Selector with Presets & Upload */}
                          <div className="bg-[#f8fafc] p-2.5 rounded-lg border border-gray-200 space-y-2">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                              <label className="text-[11px] font-semibold text-[#344054]">
                                Pathway Icon (SVG / Image)
                              </label>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-gray-500">Presets:</span>
                                {iconPresets.map((preset) => (
                                  <button
                                    key={preset.url}
                                    type="button"
                                    onClick={() => {
                                      const list = [...getPathwaysMetadata().pathways];
                                      list[pIdx] = { ...list[pIdx], icon: preset.url };
                                      updatePathwaysMetadata((prev) => ({ ...prev, pathways: list }));
                                    }}
                                    className={`px-2 py-0.5 text-[10px] font-medium rounded border transition-colors cursor-pointer ${
                                      pathway.icon === preset.url
                                        ? "bg-[#0284c7] text-white border-[#0284c7]"
                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                                    }`}
                                  >
                                    {preset.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={pathway.icon}
                                onChange={(e) => {
                                  const list = [...getPathwaysMetadata().pathways];
                                  list[pIdx] = { ...list[pIdx], icon: e.target.value };
                                  updatePathwaysMetadata((prev) => ({ ...prev, pathways: list }));
                                }}
                                placeholder="/assets/tab-planet.svg"
                                className="flex-1 bg-white border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs font-mono text-gray-700"
                              />

                              <label className="shrink-0 px-2.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-lg text-[11px] font-medium cursor-pointer transition-colors shadow-2xs">
                                {uploadingPathwayIdx === pIdx ? "Uploading..." : "Upload Icon"}
                                <input
                                  type="file"
                                  accept="image/svg+xml,image/png,image/jpeg,image/webp"
                                  className="hidden"
                                  disabled={uploadingPathwayIdx === pIdx}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      handlePathwayIconUpload(file, pIdx);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-[11px] font-semibold text-[#344054] mb-1">
                              Role Overview / Description
                            </label>
                            <textarea
                              rows={2}
                              value={pathway.description}
                              onChange={(e) => {
                                const list = [...getPathwaysMetadata().pathways];
                                list[pIdx] = { ...list[pIdx], description: e.target.value };
                                updatePathwaysMetadata((prev) => ({ ...prev, pathways: list }));
                              }}
                              placeholder="Role overview for this fellowship track..."
                              className="w-full bg-[#f8fafc] border border-[#d0d5dd] rounded-lg p-2 text-xs text-[#101828]"
                            />
                          </div>

                          {/* 2-Column: Eligibility and Benefits */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                            {/* Eligibility List */}
                            <div className="bg-[#fcfaff] p-3 rounded-lg border border-[#ede9fe] space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-[#6d28d9] uppercase tracking-wide">
                                  Eligibility ({pathway.eligibility?.length || 0})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const list = [...getPathwaysMetadata().pathways];
                                    const currentEl = Array.isArray(list[pIdx].eligibility) ? [...list[pIdx].eligibility] : [];
                                    currentEl.push("");
                                    list[pIdx] = { ...list[pIdx], eligibility: currentEl };
                                    updatePathwaysMetadata((prev) => ({ ...prev, pathways: list }));
                                  }}
                                  className="text-[10px] font-semibold text-[#7c3aed] hover:text-[#6d28d9] cursor-pointer"
                                >
                                  + Add Criterion
                                </button>
                              </div>

                              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                {(pathway.eligibility || []).map((elItem, elIdx) => (
                                  <div key={`el-${elIdx}`} className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-gray-400 w-4 text-right">{elIdx + 1}.</span>
                                    <input
                                      type="text"
                                      value={elItem}
                                      onChange={(e) => {
                                        const list = [...getPathwaysMetadata().pathways];
                                        const elList = [...(list[pIdx].eligibility || [])];
                                        elList[elIdx] = e.target.value;
                                        list[pIdx] = { ...list[pIdx], eligibility: elList };
                                        updatePathwaysMetadata((prev) => ({ ...prev, pathways: list }));
                                      }}
                                      placeholder="e.g. PhD in relevant field"
                                      className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-800"
                                    />
                                    <button
                                      type="button"
                                      title="Remove"
                                      onClick={() => {
                                        const list = [...getPathwaysMetadata().pathways];
                                        const elList = (list[pIdx].eligibility || []).filter((_, i) => i !== elIdx);
                                        list[pIdx] = { ...list[pIdx], eligibility: elList };
                                        updatePathwaysMetadata((prev) => ({ ...prev, pathways: list }));
                                      }}
                                      className="text-gray-400 hover:text-red-500 text-xs px-1 cursor-pointer"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}

                                {(!pathway.eligibility || pathway.eligibility.length === 0) && (
                                  <p className="text-[10px] text-gray-400 italic py-1">No eligibility criteria added.</p>
                                )}
                              </div>
                            </div>

                            {/* Benefits List */}
                            <div className="bg-[#f0fdf4] p-3 rounded-lg border border-[#bbf7d0] space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-[#15803d] uppercase tracking-wide">
                                  Benefits ({pathway.benefits?.length || 0})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const list = [...getPathwaysMetadata().pathways];
                                    const currentBen = Array.isArray(list[pIdx].benefits) ? [...list[pIdx].benefits] : [];
                                    currentBen.push("");
                                    list[pIdx] = { ...list[pIdx], benefits: currentBen };
                                    updatePathwaysMetadata((prev) => ({ ...prev, pathways: list }));
                                  }}
                                  className="text-[10px] font-semibold text-[#16a34a] hover:text-[#15803d] cursor-pointer"
                                >
                                  + Add Benefit
                                </button>
                              </div>

                              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                {(pathway.benefits || []).map((benItem, benIdx) => (
                                  <div key={`ben-${benIdx}`} className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-gray-400 w-4 text-right">{benIdx + 1}.</span>
                                    <input
                                      type="text"
                                      value={benItem}
                                      onChange={(e) => {
                                        const list = [...getPathwaysMetadata().pathways];
                                        const benList = [...(list[pIdx].benefits || [])];
                                        benList[benIdx] = e.target.value;
                                        list[pIdx] = { ...list[pIdx], benefits: benList };
                                        updatePathwaysMetadata((prev) => ({ ...prev, pathways: list }));
                                      }}
                                      placeholder="e.g. Institutional affiliation"
                                      className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-800"
                                    />
                                    <button
                                      type="button"
                                      title="Remove"
                                      onClick={() => {
                                        const list = [...getPathwaysMetadata().pathways];
                                        const benList = (list[pIdx].benefits || []).filter((_, i) => i !== benIdx);
                                        list[pIdx] = { ...list[pIdx], benefits: benList };
                                        updatePathwaysMetadata((prev) => ({ ...prev, pathways: list }));
                                      }}
                                      className="text-gray-400 hover:text-red-500 text-xs px-1 cursor-pointer"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ))}

                                {(!pathway.benefits || pathway.benefits.length === 0) && (
                                  <p className="text-[10px] text-gray-400 italic py-1">No benefits added.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add Pathway & Reset Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const list = [...getPathwaysMetadata().pathways];
                        const nextNum = list.length + 1;
                        list.push({
                          id: `pathway-${nextNum}`,
                          name: `Pathway ${nextNum}`,
                          title: `Pathway ${nextNum}`,
                          icon: "/assets/tab-planet.svg",
                          description: "",
                          eligibility: ["Eligibility criterion 1"],
                          benefits: ["Benefit item 1"],
                        });
                        updatePathwaysMetadata((prev) => ({ ...prev, pathways: list }));
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      + Add Fellowship Pathway
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Reset to the 3 standard fellowship pathways (Research, Junior, Honorary)?")) {
                          updatePathwaysMetadata(() => defaultPathwaysIntroMetadata);
                        }
                      }}
                      className="text-xs text-[#0284c7] hover:underline font-semibold cursor-pointer"
                    >
                      Reset to Default 3 Pathways
                    </button>
                  </div>
                </div>
              )}

              {/* Governance Structure Intro (Leadership Tiers) Specific Visual Manager */}
              {(editingKey === "structure_intro" || editingKey === "leadership_structure") && (
                <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]"></span>
                      <h4 className="text-xs font-bold text-[#15803d] uppercase tracking-wider">
                        Leadership Tiers Manager ({getStructureIntroMetadata().tiers.length} Tiers)
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          updateStructureIntroMetadata((prev) => ({
                            ...prev,
                            tiers: [...prev.tiers, { title: "", desc: "" }],
                          }));
                        }}
                        className="px-3 py-1 bg-[#16a34a] hover:bg-[#15803d] text-white text-[11px] font-semibold rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>+ Add Tier</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#166534]/80">
                    Configure the multi-tiered leadership cards displayed on the Governance page under &quot;How We Are Governed&quot; (e.g. Founding Authority, Governing Council, Academic Senate).
                  </p>

                  {/* Tiers List */}
                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                    {getStructureIntroMetadata().tiers.map((tier, idx) => (
                      <div
                        key={`tier-${idx}`}
                        className="bg-white p-3.5 rounded-xl border border-[#dcfce7] shadow-xs flex flex-col sm:flex-row gap-3 items-start"
                      >
                        {/* Number Index & Order Controls */}
                        <div className="flex sm:flex-col items-center gap-1 shrink-0 w-full sm:w-16">
                          <span className="w-7 h-7 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] flex items-center justify-center text-xs font-bold font-mono">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                updateStructureIntroMetadata((prev) => {
                                  const list = [...prev.tiers];
                                  const temp = list[idx - 1];
                                  list[idx - 1] = list[idx];
                                  list[idx] = temp;
                                  return { ...prev, tiers: list };
                                });
                              }}
                              className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                              title="Move Tier Up"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              disabled={idx === getStructureIntroMetadata().tiers.length - 1}
                              onClick={() => {
                                updateStructureIntroMetadata((prev) => {
                                  const list = [...prev.tiers];
                                  const temp = list[idx + 1];
                                  list[idx + 1] = list[idx];
                                  list[idx] = temp;
                                  return { ...prev, tiers: list };
                                });
                              }}
                              className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                              title="Move Tier Down"
                            >
                              ▼
                            </button>
                          </div>
                        </div>

                        {/* Title & Description Fields */}
                        <div className="flex-1 w-full space-y-2">
                          <div>
                            <label className="block text-[10px] font-bold text-[#344054] uppercase tracking-wider mb-1">
                              Tier Title
                            </label>
                            <input
                              type="text"
                              value={tier.title}
                              onChange={(e) => {
                                updateStructureIntroMetadata((prev) => {
                                  const list = [...prev.tiers];
                                  list[idx] = { ...list[idx], title: e.target.value };
                                  return { ...prev, tiers: list };
                                });
                              }}
                              placeholder="e.g. Governing Council"
                              className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#101828] focus:bg-white focus:outline-hidden focus:border-[#16a34a]"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-[#344054] mb-1">
                              Tier Description
                            </label>
                            <textarea
                              rows={2}
                              value={tier.desc}
                              onChange={(e) => {
                                updateStructureIntroMetadata((prev) => {
                                  const list = [...prev.tiers];
                                  list[idx] = { ...list[idx], desc: e.target.value };
                                  return { ...prev, tiers: list };
                                });
                              }}
                              placeholder="Brief summary of authority and mandate..."
                              className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] focus:bg-white focus:outline-hidden focus:border-[#16a34a]"
                            />
                          </div>
                        </div>

                        {/* Delete Action */}
                        <div className="shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              updateStructureIntroMetadata((prev) => {
                                const list = [...prev.tiers];
                                list.splice(idx, 1);
                                return { ...prev, tiers: list };
                              });
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition"
                            title="Delete Tier"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Empty State */}
                  {getStructureIntroMetadata().tiers.length === 0 && (
                    <div className="text-center py-6 bg-white rounded-xl border border-dashed border-[#bbf7d0]">
                      <p className="text-xs text-gray-500 mb-2">No leadership tiers currently configured.</p>
                      <button
                        type="button"
                        onClick={() => {
                          updateStructureIntroMetadata(() => defaultStructureIntroMetadata);
                        }}
                        className="text-xs text-[#16a34a] font-semibold hover:underline cursor-pointer"
                      >
                        Reset to Default 9 Leadership Tiers
                      </button>
                    </div>
                  )}

                  {/* Bottom Reset Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#dcfce7]">
                    <button
                      type="button"
                      onClick={() => {
                        updateStructureIntroMetadata((prev) => ({
                          ...prev,
                          tiers: [
                            ...prev.tiers,
                            {
                              title: `Tier ${prev.tiers.length + 1}`,
                              desc: "Institutional role and mandate description",
                            },
                          ],
                        }));
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      + Add Leadership Tier
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Reset to the default 9 governance leadership tiers?")) {
                          updateStructureIntroMetadata(() => defaultStructureIntroMetadata);
                        }
                      }}
                      className="text-xs text-[#16a34a] hover:underline font-semibold cursor-pointer"
                    >
                      Reset to Default 9 Tiers
                    </button>
                  </div>
                </div>
              )}

              {/* Governing Council Specific Visual Manager */}
              {editingKey === "governing_council" && (
                <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00506b]"></span>
                      <h4 className="text-xs font-bold text-[#00506b] uppercase tracking-wider">
                        Governing Council Responsibilities ({getGoverningCouncilMetadata().responsibilities.length} Items)
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          updateGoverningCouncilMetadata((prev) => {
                            const nextNum = String(prev.responsibilities.length + 1).padStart(2, "0");
                            return {
                              ...prev,
                              responsibilities: [
                                ...prev.responsibilities,
                                { number: nextNum, text: "" },
                              ],
                            };
                          });
                        }}
                        className="px-3 py-1 bg-[#00506b] hover:bg-[#003b4f] text-white text-[11px] font-semibold rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>+ Add Responsibility</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#0369a1]/80">
                    Configure the core responsibilities and governance duties of the Governing Council displayed on the Governance page.
                  </p>

                  {/* Responsibilities List */}
                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                    {getGoverningCouncilMetadata().responsibilities.map((item, idx) => (
                      <div
                        key={`resp-${idx}`}
                        className="bg-white p-3.5 rounded-xl border border-[#e0f2fe] shadow-xs flex flex-col sm:flex-row gap-3 items-start"
                      >
                        {/* Number Index & Order Controls */}
                        <div className="flex sm:flex-col items-center gap-1 shrink-0 w-full sm:w-16">
                          <input
                            type="text"
                            value={item.number}
                            onChange={(e) => {
                              updateGoverningCouncilMetadata((prev) => {
                                const list = [...prev.responsibilities];
                                list[idx] = { ...list[idx], number: e.target.value };
                                return { ...prev, responsibilities: list };
                              });
                            }}
                            className="w-8 h-8 rounded-lg bg-[#f0f9ff] border border-[#bae6fd] text-[#00506b] text-center text-xs font-bold font-mono focus:bg-white focus:outline-hidden focus:border-[#00506b]"
                          />
                          <div className="flex items-center gap-1 mt-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                updateGoverningCouncilMetadata((prev) => {
                                  const list = [...prev.responsibilities];
                                  const temp = list[idx - 1];
                                  list[idx - 1] = list[idx];
                                  list[idx] = temp;
                                  return { ...prev, responsibilities: list };
                                });
                              }}
                              className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                              title="Move Item Up"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              disabled={idx === getGoverningCouncilMetadata().responsibilities.length - 1}
                              onClick={() => {
                                updateGoverningCouncilMetadata((prev) => {
                                  const list = [...prev.responsibilities];
                                  const temp = list[idx + 1];
                                  list[idx + 1] = list[idx];
                                  list[idx] = temp;
                                  return { ...prev, responsibilities: list };
                                });
                              }}
                              className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                              title="Move Item Down"
                            >
                              ▼
                            </button>
                          </div>
                        </div>

                        {/* Responsibility Statement Textarea */}
                        <div className="flex-1 w-full space-y-1">
                          <label className="block text-[10px] font-bold text-[#344054] uppercase tracking-wider">
                            Responsibility Statement #{idx + 1}
                          </label>
                          <textarea
                            rows={2}
                            value={item.text}
                            onChange={(e) => {
                              updateGoverningCouncilMetadata((prev) => {
                                const list = [...prev.responsibilities];
                                list[idx] = { ...list[idx], text: e.target.value };
                                return { ...prev, responsibilities: list };
                              });
                            }}
                            placeholder="Enter institutional governance duty or responsibility..."
                            className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] focus:bg-white focus:outline-hidden focus:border-[#00506b]"
                          />
                        </div>

                        {/* Delete Action */}
                        <div className="shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              updateGoverningCouncilMetadata((prev) => {
                                const list = [...prev.responsibilities];
                                list.splice(idx, 1);
                                return { ...prev, responsibilities: list };
                              });
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition"
                            title="Delete Responsibility"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Empty State */}
                  {getGoverningCouncilMetadata().responsibilities.length === 0 && (
                    <div className="text-center py-6 bg-white rounded-xl border border-dashed border-[#bae6fd]">
                      <p className="text-xs text-gray-500 mb-2">No council responsibilities currently configured.</p>
                      <button
                        type="button"
                        onClick={() => {
                          updateGoverningCouncilMetadata(() => defaultGoverningCouncilMetadata);
                        }}
                        className="text-xs text-[#00506b] font-semibold hover:underline cursor-pointer"
                      >
                        Reset to Default 8 Responsibilities
                      </button>
                    </div>
                  )}

                  {/* Bottom Reset Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#e0f2fe]">
                    <button
                      type="button"
                      onClick={() => {
                        updateGoverningCouncilMetadata((prev) => {
                          const nextNum = String(prev.responsibilities.length + 1).padStart(2, "0");
                          return {
                            ...prev,
                            responsibilities: [
                              ...prev.responsibilities,
                              {
                                number: nextNum,
                                text: "",
                              },
                            ],
                          };
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00506b] hover:bg-[#003b4f] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      + Add Responsibility
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Reset to the default 8 Governing Council responsibilities?")) {
                          updateGoverningCouncilMetadata(() => defaultGoverningCouncilMetadata);
                        }
                      }}
                      className="text-xs text-[#00506b] hover:underline font-semibold cursor-pointer"
                    >
                      Reset to Default 8 Responsibilities
                    </button>
                  </div>
                </div>
              )}

              {/* Ethics Commission Specific Visual Manager */}
              {editingKey === "ethics_commission" && (
                <div className="bg-[#f0fdfa] border border-[#99f6e4] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0d9488]"></span>
                      <h4 className="text-xs font-bold text-[#0f766e] uppercase tracking-wider">
                        Ethics &amp; Accountability Commission Functions ({getEthicsCommissionMetadata().functions.length} Items)
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          updateEthicsCommissionMetadata((prev) => ({
                            ...prev,
                            functions: [...prev.functions, ""],
                          }));
                        }}
                        className="px-3 py-1 bg-[#0d9488] hover:bg-[#0f766e] text-white text-[11px] font-semibold rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>+ Add Function</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#115e59]/80">
                    Configure institutional ethics, accountability standards, and integrity mandates displayed on the Governance page.
                  </p>

                  {/* Card Title & Floating Badge Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-[#ccfbf1] shadow-2xs">
                    <div>
                      <label className="block text-[10px] font-bold text-[#344054] uppercase tracking-wider mb-1">
                        Functions Box Heading
                      </label>
                      <input
                        type="text"
                        value={getEthicsCommissionMetadata().cardTitle}
                        onChange={(e) => {
                          updateEthicsCommissionMetadata((prev) => ({
                            ...prev,
                            cardTitle: e.target.value,
                          }));
                        }}
                        placeholder="Accountability Functions"
                        className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] focus:bg-white focus:outline-hidden focus:border-[#0d9488]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#344054] uppercase tracking-wider mb-1">
                        Badge Stat / Number
                      </label>
                      <input
                        type="text"
                        value={getEthicsCommissionMetadata().ratingValue}
                        onChange={(e) => {
                          updateEthicsCommissionMetadata((prev) => ({
                            ...prev,
                            ratingValue: e.target.value,
                          }));
                        }}
                        placeholder="5000"
                        className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] focus:bg-white focus:outline-hidden focus:border-[#0d9488]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#344054] uppercase tracking-wider mb-1">
                        Badge Label / Subtitle
                      </label>
                      <input
                        type="text"
                        value={getEthicsCommissionMetadata().ratingLabel}
                        onChange={(e) => {
                          updateEthicsCommissionMetadata((prev) => ({
                            ...prev,
                            ratingLabel: e.target.value,
                          }));
                        }}
                        placeholder="Student ratings"
                        className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] focus:bg-white focus:outline-hidden focus:border-[#0d9488]"
                      />
                    </div>
                  </div>

                  {/* Functions List */}
                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                    {getEthicsCommissionMetadata().functions.map((fnItem, idx) => (
                      <div
                        key={`ethics-fn-${idx}`}
                        className="bg-white p-3.5 rounded-xl border border-[#ccfbf1] shadow-xs flex flex-col sm:flex-row gap-3 items-start"
                      >
                        {/* Number Index & Order Controls */}
                        <div className="flex sm:flex-col items-center gap-1 shrink-0 w-full sm:w-16">
                          <span className="w-8 h-8 rounded-lg bg-[#f0fdfa] border border-[#99f6e4] text-[#0f766e] flex items-center justify-center text-xs font-bold font-mono">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                updateEthicsCommissionMetadata((prev) => {
                                  const list = [...prev.functions];
                                  const temp = list[idx - 1];
                                  list[idx - 1] = list[idx];
                                  list[idx] = temp;
                                  return { ...prev, functions: list };
                                });
                              }}
                              className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                              title="Move Item Up"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              disabled={idx === getEthicsCommissionMetadata().functions.length - 1}
                              onClick={() => {
                                updateEthicsCommissionMetadata((prev) => {
                                  const list = [...prev.functions];
                                  const temp = list[idx + 1];
                                  list[idx + 1] = list[idx];
                                  list[idx] = temp;
                                  return { ...prev, functions: list };
                                });
                              }}
                              className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                              title="Move Item Down"
                            >
                              ▼
                            </button>
                          </div>
                        </div>

                        {/* Function Statement Textarea */}
                        <div className="flex-1 w-full space-y-1">
                          <label className="block text-[10px] font-bold text-[#344054] uppercase tracking-wider">
                            Institutional Function #{idx + 1}
                          </label>
                          <textarea
                            rows={2}
                            value={fnItem}
                            onChange={(e) => {
                              updateEthicsCommissionMetadata((prev) => {
                                const list = [...prev.functions];
                                list[idx] = e.target.value;
                                return { ...prev, functions: list };
                              });
                            }}
                            placeholder="Enter institutional compliance, oversight, or accountability mandate..."
                            className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] focus:bg-white focus:outline-hidden focus:border-[#0d9488]"
                          />
                        </div>

                        {/* Delete Action */}
                        <div className="shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              updateEthicsCommissionMetadata((prev) => {
                                const list = [...prev.functions];
                                list.splice(idx, 1);
                                return { ...prev, functions: list };
                              });
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition"
                            title="Delete Function"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Empty State */}
                  {getEthicsCommissionMetadata().functions.length === 0 && (
                    <div className="text-center py-6 bg-white rounded-xl border border-dashed border-[#99f6e4]">
                      <p className="text-xs text-gray-500 mb-2">No ethics commission functions currently configured.</p>
                      <button
                        type="button"
                        onClick={() => {
                          updateEthicsCommissionMetadata(() => defaultEthicsCommissionMetadata);
                        }}
                        className="text-xs text-[#0d9488] font-semibold hover:underline cursor-pointer"
                      >
                        Reset to Default 7 Functions
                      </button>
                    </div>
                  )}

                  {/* Bottom Reset Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#ccfbf1]">
                    <button
                      type="button"
                      onClick={() => {
                        updateEthicsCommissionMetadata((prev) => ({
                          ...prev,
                          functions: [
                            ...prev.functions,
                            "",
                          ],
                        }));
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      + Add Function
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Reset to the default 7 Ethics & Accountability Commission functions?")) {
                          updateEthicsCommissionMetadata(() => defaultEthicsCommissionMetadata);
                        }
                      }}
                      className="text-xs text-[#0d9488] hover:underline font-semibold cursor-pointer"
                    >
                      Reset to Default 7 Functions
                    </button>
                  </div>
                </div>
              )}

              {/* Youth Leadership Assembly Specific Visual Manager */}
              {(editingKey === "youth_leadership" || editingKey === "youth_assembly") && (
                <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></span>
                      <h4 className="text-xs font-bold text-[#0369a1] uppercase tracking-wider">
                        Youth Leadership Assembly Functions ({getYouthLeadershipMetadata().functions.length} Items)
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          updateYouthLeadershipMetadata((prev) => ({
                            ...prev,
                            functions: [...prev.functions, ""],
                          }));
                        }}
                        className="px-3 py-1 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[11px] font-semibold rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>+ Add Function</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#075985]/80">
                    Configure youth perspectives, leadership development programs, and civic engagement initiatives displayed on the Governance page.
                  </p>

                  {/* Card Title & Floating Badge Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-[#e0f2fe] shadow-2xs">
                    <div>
                      <label className="block text-[10px] font-bold text-[#344054] uppercase tracking-wider mb-1">
                        Functions Box Heading
                      </label>
                      <input
                        type="text"
                        value={getYouthLeadershipMetadata().cardTitle}
                        onChange={(e) => {
                          updateYouthLeadershipMetadata((prev) => ({
                            ...prev,
                            cardTitle: e.target.value,
                          }));
                        }}
                        placeholder="Assembly Functions"
                        className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] focus:bg-white focus:outline-hidden focus:border-[#0284c7]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#344054] uppercase tracking-wider mb-1">
                        Badge Stat / Number
                      </label>
                      <input
                        type="text"
                        value={getYouthLeadershipMetadata().ratingValue}
                        onChange={(e) => {
                          updateYouthLeadershipMetadata((prev) => ({
                            ...prev,
                            ratingValue: e.target.value,
                          }));
                        }}
                        placeholder="5000"
                        className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] focus:bg-white focus:outline-hidden focus:border-[#0284c7]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#344054] uppercase tracking-wider mb-1">
                        Badge Label / Subtitle
                      </label>
                      <input
                        type="text"
                        value={getYouthLeadershipMetadata().ratingLabel}
                        onChange={(e) => {
                          updateYouthLeadershipMetadata((prev) => ({
                            ...prev,
                            ratingLabel: e.target.value,
                          }));
                        }}
                        placeholder="Student ratings"
                        className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] focus:bg-white focus:outline-hidden focus:border-[#0284c7]"
                      />
                    </div>
                  </div>

                  {/* Functions List */}
                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                    {getYouthLeadershipMetadata().functions.map((fnItem, idx) => (
                      <div
                        key={`youth-fn-${idx}`}
                        className="bg-white p-3.5 rounded-xl border border-[#e0f2fe] shadow-xs flex flex-col sm:flex-row gap-3 items-start"
                      >
                        {/* Number Index & Order Controls */}
                        <div className="flex sm:flex-col items-center gap-1 shrink-0 w-full sm:w-16">
                          <span className="w-8 h-8 rounded-lg bg-[#f0f9ff] border border-[#bae6fd] text-[#0284c7] flex items-center justify-center text-xs font-bold font-mono">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                updateYouthLeadershipMetadata((prev) => {
                                  const list = [...prev.functions];
                                  const temp = list[idx - 1];
                                  list[idx - 1] = list[idx];
                                  list[idx] = temp;
                                  return { ...prev, functions: list };
                                });
                              }}
                              className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                              title="Move Item Up"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              disabled={idx === getYouthLeadershipMetadata().functions.length - 1}
                              onClick={() => {
                                updateYouthLeadershipMetadata((prev) => {
                                  const list = [...prev.functions];
                                  const temp = list[idx + 1];
                                  list[idx + 1] = list[idx];
                                  list[idx] = temp;
                                  return { ...prev, functions: list };
                                });
                              }}
                              className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                              title="Move Item Down"
                            >
                              ▼
                            </button>
                          </div>
                        </div>

                        {/* Function Statement Textarea */}
                        <div className="flex-1 w-full space-y-1">
                          <label className="block text-[10px] font-bold text-[#344054] uppercase tracking-wider">
                            Youth Initiative Function #{idx + 1}
                          </label>
                          <textarea
                            rows={2}
                            value={fnItem}
                            onChange={(e) => {
                              updateYouthLeadershipMetadata((prev) => {
                                const list = [...prev.functions];
                                list[idx] = e.target.value;
                                return { ...prev, functions: list };
                              });
                            }}
                            placeholder="Enter youth leadership, research participation, or training mandate..."
                            className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] focus:bg-white focus:outline-hidden focus:border-[#0284c7]"
                          />
                        </div>

                        {/* Delete Action */}
                        <div className="shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              updateYouthLeadershipMetadata((prev) => {
                                const list = [...prev.functions];
                                list.splice(idx, 1);
                                return { ...prev, functions: list };
                              });
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition"
                            title="Delete Function"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Empty State */}
                  {getYouthLeadershipMetadata().functions.length === 0 && (
                    <div className="text-center py-6 bg-white rounded-xl border border-dashed border-[#bae6fd]">
                      <p className="text-xs text-gray-500 mb-2">No youth leadership functions currently configured.</p>
                      <button
                        type="button"
                        onClick={() => {
                          updateYouthLeadershipMetadata(() => defaultYouthLeadershipMetadata);
                        }}
                        className="text-xs text-[#0284c7] font-semibold hover:underline cursor-pointer"
                      >
                        Reset to Default 6 Functions
                      </button>
                    </div>
                  )}

                  {/* Bottom Reset Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#bae6fd]">
                    <button
                      type="button"
                      onClick={() => {
                        updateYouthLeadershipMetadata((prev) => ({
                          ...prev,
                          functions: [
                            ...prev.functions,
                            "",
                          ],
                        }));
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      + Add Function
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Reset to the default 6 Youth Leadership Assembly functions?")) {
                          updateYouthLeadershipMetadata(() => defaultYouthLeadershipMetadata);
                        }
                      }}
                      className="text-xs text-[#0284c7] hover:underline font-semibold cursor-pointer"
                    >
                      Reset to Default 6 Functions
                    </button>
                  </div>
                </div>
              )}

              {/* Board of Founding Members Specific Visual Manager */}
              {editingKey === "founding_members" && (
                <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></span>
                      <h4 className="text-xs font-bold text-[#1d4ed8] uppercase tracking-wider">
                        Board of Founding Members ({getFoundingMembersMetadata().members.length} Members)
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          updateFoundingMembersMetadata((prev) => ({
                            ...prev,
                            members: [
                              ...prev.members,
                              {
                                name: "",
                                role: "Founding Member",
                                image: "/assets/governance-founding-member.png",
                              },
                            ],
                          }));
                        }}
                        className="px-3 py-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[11px] font-semibold rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>+ Add Member</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#1e40af]/80">
                    Configure the founding board members displayed in the Board of Founding Members grid.
                  </p>

                  {/* Members List */}
                  <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                    {getFoundingMembersMetadata().members.map((mItem, idx) => (
                      <div
                        key={`founding-member-${idx}`}
                        className="bg-white p-3.5 rounded-xl border border-[#dbeafe] shadow-xs flex flex-col md:flex-row gap-4 items-start"
                      >
                        {/* Index & Order Controls */}
                        <div className="flex md:flex-col items-center gap-1 shrink-0">
                          <span className="w-8 h-8 rounded-lg bg-[#eff6ff] border border-[#bfdbfe] text-[#2563eb] flex items-center justify-center text-xs font-bold font-mono">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                updateFoundingMembersMetadata((prev) => {
                                  const list = [...prev.members];
                                  const temp = list[idx - 1];
                                  list[idx - 1] = list[idx];
                                  list[idx] = temp;
                                  return { ...prev, members: list };
                                });
                              }}
                              className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                              title="Move Member Up"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              disabled={idx === getFoundingMembersMetadata().members.length - 1}
                              onClick={() => {
                                updateFoundingMembersMetadata((prev) => {
                                  const list = [...prev.members];
                                  const temp = list[idx + 1];
                                  list[idx + 1] = list[idx];
                                  list[idx] = temp;
                                  return { ...prev, members: list };
                                });
                              }}
                              className="p-1 rounded text-gray-400 hover:text-gray-700 disabled:opacity-30 cursor-pointer"
                              title="Move Member Down"
                            >
                              ▼
                            </button>
                          </div>
                        </div>

                        {/* Photo Thumbnail & Upload/URL */}
                        <div className="shrink-0 flex flex-col items-center gap-2">
                          <div className="relative w-20 h-24 rounded-lg overflow-hidden border border-[#d0d5dd] bg-gray-100 flex items-center justify-center shadow-xs">
                            {mItem.image ? (
                              <img
                                src={mItem.image}
                                alt={mItem.name || "Member Photo"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] text-gray-400 text-center px-1">No Photo</span>
                            )}
                          </div>
                          <label className="px-2 py-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[11px] font-semibold rounded-md cursor-pointer transition text-center w-full">
                            {uploadingFoundingMemberIdx === idx ? "Uploading..." : "Upload Photo"}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploadingFoundingMemberIdx === idx}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                handleFoundingMemberImageUpload(file, idx);
                                e.target.value = "";
                              }}
                            />
                          </label>
                        </div>

                        {/* Info Inputs (Name, Role, Image URL) */}
                        <div className="flex-1 w-full space-y-2.5">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[10px] font-bold text-[#344054] uppercase tracking-wider mb-1">
                                Full Name
                              </label>
                              <input
                                type="text"
                                value={mItem.name}
                                onChange={(e) => {
                                  updateFoundingMembersMetadata((prev) => {
                                    const list = [...prev.members];
                                    list[idx] = { ...list[idx], name: e.target.value };
                                    return { ...prev, members: list };
                                  });
                                }}
                                placeholder="e.g. Mohammed Siraj"
                                className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] focus:bg-white focus:outline-hidden focus:border-[#2563eb]"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-[#344054] uppercase tracking-wider mb-1">
                                Role / Designation
                              </label>
                              <input
                                type="text"
                                value={mItem.role}
                                onChange={(e) => {
                                  updateFoundingMembersMetadata((prev) => {
                                    const list = [...prev.members];
                                    list[idx] = { ...list[idx], role: e.target.value };
                                    return { ...prev, members: list };
                                  });
                                }}
                                placeholder="e.g. Founding Member"
                                className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs text-[#101828] focus:bg-white focus:outline-hidden focus:border-[#2563eb]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-[#344054] uppercase tracking-wider mb-1">
                              Image URL / Storage Path
                            </label>
                            <input
                              type="text"
                              value={mItem.image}
                              onChange={(e) => {
                                updateFoundingMembersMetadata((prev) => {
                                  const list = [...prev.members];
                                  list[idx] = { ...list[idx], image: e.target.value };
                                  return { ...prev, members: list };
                                });
                              }}
                              placeholder="/assets/governance-founding-member.png or https://..."
                              className="w-full bg-[#f9fafb] border border-[#d0d5dd] rounded-lg px-2.5 py-1.5 text-xs font-mono text-[#101828] focus:bg-white focus:outline-hidden focus:border-[#2563eb]"
                            />
                          </div>
                        </div>

                        {/* Delete Member */}
                        <div className="shrink-0 self-end md:self-center">
                          <button
                            type="button"
                            onClick={() => {
                              updateFoundingMembersMetadata((prev) => {
                                const list = [...prev.members];
                                list.splice(idx, 1);
                                return { ...prev, members: list };
                              });
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition"
                            title="Delete Member"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Empty State */}
                  {getFoundingMembersMetadata().members.length === 0 && (
                    <div className="text-center py-6 bg-white rounded-xl border border-dashed border-[#bfdbfe]">
                      <p className="text-xs text-gray-500 mb-2">No founding members currently configured.</p>
                      <button
                        type="button"
                        onClick={() => {
                          updateFoundingMembersMetadata(() => defaultFoundingMembersMetadata);
                        }}
                        className="text-xs text-[#2563eb] font-semibold hover:underline cursor-pointer"
                      >
                        Reset to Default 3 Founding Members
                      </button>
                    </div>
                  )}

                  {/* Bottom Reset Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#bfdbfe]">
                    <button
                      type="button"
                      onClick={() => {
                        updateFoundingMembersMetadata((prev) => ({
                          ...prev,
                          members: [
                            ...prev.members,
                            {
                              name: "",
                              role: "Founding Member",
                              image: "/assets/governance-founding-member.png",
                            },
                          ],
                        }));
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
                    >
                      + Add Member
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Reset to the default 3 Board of Founding Members?")) {
                          updateFoundingMembersMetadata(() => defaultFoundingMembersMetadata);
                        }
                      }}
                      className="text-xs text-[#2563eb] hover:underline font-semibold cursor-pointer"
                    >
                      Reset to Default 3 Founding Members
                    </button>
                  </div>
                </div>
              )}

              {/* Partnership Framework Tracks Visual Manager */}
              {(editingKey === "tracks_intro" ||
                editingKey === "framework_tracks" ||
                (selectedPage === "partnerships" &&
                  (editingKey === "tracks_intro" ||
                    editingKey === "framework_tracks" ||
                    formData.sectionKey === "tracks_intro"))) && (
                <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></span>
                      <h4 className="text-xs font-bold text-[#0369a1] uppercase tracking-wider">
                        Partnership Framework Tracks ({getPartnershipTracksMetadata().tracks.length} Tracks)
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          updatePartnershipTracksMetadata((prev) => ({
                            ...prev,
                            tracks: [
                              ...prev.tracks,
                              {
                                icon: "🤝",
                                title: "",
                                description: "",
                              },
                            ],
                          }));
                        }}
                        className="px-3 py-1 bg-[#0284c7] hover:bg-[#0369a1] text-white text-[11px] font-semibold rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>+ Add Track</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#0369a1]/80">
                    Configure the partnership tracks displayed in the Partnership Framework section of the Partnerships page.
                  </p>

                  {/* Tracks List */}
                  <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                    {getPartnershipTracksMetadata().tracks.map((trackItem, idx) => (
                      <div
                        key={`partnership-track-${idx}`}
                        className="bg-white p-3.5 rounded-xl border border-[#bae6fd] shadow-xs flex flex-col md:flex-row gap-4 items-start"
                      >
                        {/* Index & Order Controls */}
                        <div className="flex md:flex-col items-center gap-1 shrink-0">
                          <span className="w-8 h-8 rounded-lg bg-[#f0f9ff] border border-[#7dd3fc] text-[#0284c7] flex items-center justify-center text-xs font-bold font-mono">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                updatePartnershipTracksMetadata((prev) => {
                                  const list = [...prev.tracks];
                                  const temp = list[idx - 1];
                                  list[idx - 1] = list[idx];
                                  list[idx] = temp;
                                  return { ...prev, tracks: list };
                                });
                              }}
                              className="w-6 h-6 rounded bg-[#f8fafc] border border-[#e2e8f0] text-gray-600 hover:bg-[#e2e8f0] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs cursor-pointer"
                              title="Move Up"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              disabled={idx === getPartnershipTracksMetadata().tracks.length - 1}
                              onClick={() => {
                                updatePartnershipTracksMetadata((prev) => {
                                  const list = [...prev.tracks];
                                  const temp = list[idx + 1];
                                  list[idx + 1] = list[idx];
                                  list[idx] = temp;
                                  return { ...prev, tracks: list };
                                });
                              }}
                              className="w-6 h-6 rounded bg-[#f8fafc] border border-[#e2e8f0] text-gray-600 hover:bg-[#e2e8f0] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-xs cursor-pointer"
                              title="Move Down"
                            >
                              ▼
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove "${trackItem.title || `Track #${idx + 1}`}"?`)) {
                                updatePartnershipTracksMetadata((prev) => ({
                                  ...prev,
                                  tracks: prev.tracks.filter((_, i) => i !== idx),
                                }));
                              }
                            }}
                            className="mt-2 text-xs text-red-500 hover:text-red-700 hover:underline cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>

                        {/* Fields */}
                        <div className="flex-1 w-full space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="md:col-span-1">
                              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                Icon / Emoji
                              </label>
                              <div className="flex items-center gap-2">
                                <span className="text-xl w-8 h-8 flex items-center justify-center bg-[#f0f9ff] border border-[#bae6fd] rounded-lg shrink-0">
                                  {trackItem.icon || "🤝"}
                                </span>
                                <input
                                  type="text"
                                  value={trackItem.icon}
                                  placeholder="e.g. 🎓 or 🔬"
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updatePartnershipTracksMetadata((prev) => {
                                      const list = [...prev.tracks];
                                      list[idx] = { ...list[idx], icon: val };
                                      return { ...prev, tracks: list };
                                    });
                                  }}
                                  className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 focus:border-[#0284c7] focus:outline-hidden"
                                />
                              </div>
                            </div>

                            <div className="md:col-span-3">
                              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                Track Title
                              </label>
                              <input
                                type="text"
                                value={trackItem.title}
                                placeholder="e.g. University Partnerships"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updatePartnershipTracksMetadata((prev) => {
                                    const list = [...prev.tracks];
                                    list[idx] = { ...list[idx], title: val };
                                    return { ...prev, tracks: list };
                                  });
                                }}
                                className="w-full text-xs font-semibold border border-gray-300 rounded-lg px-2.5 py-1.5 focus:border-[#0284c7] focus:outline-hidden"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-gray-700 mb-1">
                              Track Description
                            </label>
                            <textarea
                              rows={2}
                              value={trackItem.description}
                              placeholder="Brief description of collaborative opportunities and scope..."
                              onChange={(e) => {
                                const val = e.target.value;
                                updatePartnershipTracksMetadata((prev) => {
                                  const list = [...prev.tracks];
                                  list[idx] = { ...list[idx], description: val };
                                  return { ...prev, tracks: list };
                                });
                              }}
                              className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 focus:border-[#0284c7] focus:outline-hidden"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {getPartnershipTracksMetadata().tracks.length === 0 && (
                    <div className="text-center py-6 border border-dashed border-[#bae6fd] rounded-xl bg-white">
                      <p className="text-xs text-gray-500 mb-2">No partnership tracks configured yet.</p>
                      <button
                        type="button"
                        onClick={() => {
                          updatePartnershipTracksMetadata(() => defaultPartnershipTracksMetadata);
                        }}
                        className="text-xs text-[#0284c7] font-semibold hover:underline cursor-pointer"
                      >
                        Load Default 5 Partnership Tracks
                      </button>
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between border-t border-[#bae6fd]/60">
                    <button
                      type="button"
                      onClick={() => {
                        updatePartnershipTracksMetadata((prev) => ({
                          ...prev,
                          tracks: [
                            ...prev.tracks,
                            {
                              icon: "🤝",
                              title: "",
                              description: "",
                            },
                          ],
                        }));
                      }}
                      className="text-xs text-[#0284c7] hover:underline font-semibold cursor-pointer"
                    >
                      + Add Another Track
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Reset all tracks to the default 5 framework tracks?")) {
                          updatePartnershipTracksMetadata(() => defaultPartnershipTracksMetadata);
                        }
                      }}
                      className="text-xs text-[#0284c7] hover:underline font-semibold cursor-pointer"
                    >
                      Reset to Default 5 Tracks
                    </button>
                  </div>
                </div>
              )}

              {/* Contact Information Cards Visual Manager */}
              {(editingKey === "contact_info_cards" ||
                editingKey === "info_grid" ||
                (selectedPage === "contact" &&
                  (editingKey === "contact_info_cards" ||
                    editingKey === "info_grid" ||
                    formData.sectionKey === "contact_info_cards" ||
                    formData.sectionKey === "info_grid"))) && (
                <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00506b]"></span>
                      <h4 className="text-xs font-bold text-[#00506b] uppercase tracking-wider">
                        Contact Information Cards ({getContactInfoCardsMetadata().cards.length} Cards)
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          updateContactInfoCardsMetadata((prev) => ({
                            ...prev,
                            cards: [
                              ...prev.cards,
                              {
                                title: "New Contact",
                                value: "info@iilp.org",
                                timing: "Support Hours",
                                iconAlt: "Contact Icon",
                                iconSrc: "/images/contact-icon-email.svg",
                              },
                            ],
                          }));
                        }}
                        className="px-3 py-1 bg-[#00506b] hover:bg-[#00384a] text-white text-[11px] font-semibold rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>+ Add Card</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#00506b]/80">
                    Configure the contact information cards (Email, Phone, Office, Media Relations, etc.) displayed on the Contact page.
                  </p>

                  {/* Cards List */}
                  <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                    {getContactInfoCardsMetadata().cards.map((cardItem, idx) => (
                      <div
                        key={`contact-card-${idx}`}
                        className="bg-white p-3.5 rounded-xl border border-[#bae6fd] shadow-xs flex flex-col md:flex-row gap-4 items-start"
                      >
                        {/* Index & Order Controls */}
                        <div className="flex md:flex-col items-center gap-1 shrink-0">
                          <span className="w-8 h-8 rounded-lg bg-[#f0f9ff] border border-[#7dd3fc] text-[#00506b] flex items-center justify-center text-xs font-bold font-mono">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div className="flex md:flex-col gap-0.5">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                if (idx === 0) return;
                                updateContactInfoCardsMetadata((prev) => {
                                  const list = [...prev.cards];
                                  const temp = list[idx - 1];
                                  list[idx - 1] = list[idx];
                                  list[idx] = temp;
                                  return { ...prev, cards: list };
                                });
                              }}
                              className="w-6 h-5 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[10px] cursor-pointer"
                              title="Move Up"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              disabled={idx === getContactInfoCardsMetadata().cards.length - 1}
                              onClick={() => {
                                if (idx >= getContactInfoCardsMetadata().cards.length - 1) return;
                                updateContactInfoCardsMetadata((prev) => {
                                  const list = [...prev.cards];
                                  const temp = list[idx + 1];
                                  list[idx + 1] = list[idx];
                                  list[idx] = temp;
                                  return { ...prev, cards: list };
                                });
                              }}
                              className="w-6 h-5 rounded bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[10px] cursor-pointer"
                              title="Move Down"
                            >
                              ▼
                            </button>
                          </div>
                        </div>

                        {/* Card Inputs */}
                        <div className="flex-1 space-y-3 w-full">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                Card Title (e.g. Email, Phone, Office)
                              </label>
                              <input
                                type="text"
                                value={cardItem.title}
                                placeholder="e.g. Email"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateContactInfoCardsMetadata((prev) => {
                                    const list = [...prev.cards];
                                    list[idx] = { ...list[idx], title: val };
                                    return { ...prev, cards: list };
                                  });
                                }}
                                className="w-full text-xs font-semibold border border-gray-300 rounded-lg px-2.5 py-1.5 focus:border-[#00506b] focus:outline-hidden"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                Value (e.g. info@iilp.org, +880 1819-254425)
                              </label>
                              <input
                                type="text"
                                value={cardItem.value}
                                placeholder="e.g. info@iilp.org"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateContactInfoCardsMetadata((prev) => {
                                    const list = [...prev.cards];
                                    list[idx] = { ...list[idx], value: val };
                                    return { ...prev, cards: list };
                                  });
                                }}
                                className="w-full text-xs font-semibold border border-gray-300 rounded-lg px-2.5 py-1.5 focus:border-[#00506b] focus:outline-hidden"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                Timing / Hours / Subtitle
                              </label>
                              <input
                                type="text"
                                value={cardItem.timing}
                                placeholder="e.g. Online Support / Sun-Thu 9am-5pm"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  updateContactInfoCardsMetadata((prev) => {
                                    const list = [...prev.cards];
                                    list[idx] = { ...list[idx], timing: val };
                                    return { ...prev, cards: list };
                                  });
                                }}
                                className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 focus:border-[#00506b] focus:outline-hidden"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-gray-700 mb-1">
                                Icon Path or Upload SVG
                              </label>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  value={cardItem.iconSrc || ""}
                                  placeholder="/images/contact-icon-email.svg"
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateContactInfoCardsMetadata((prev) => {
                                      const list = [...prev.cards];
                                      list[idx] = { ...list[idx], iconSrc: val };
                                      return { ...prev, cards: list };
                                    });
                                  }}
                                  className="w-full text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 focus:border-[#00506b] focus:outline-hidden font-mono"
                                />
                                <label className="shrink-0 px-2 py-1.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-[10px] font-semibold text-gray-700 cursor-pointer transition">
                                  Upload
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if (f) handleContactCardIconUpload(f, idx);
                                    }}
                                  />
                                </label>
                                {cardItem.iconSrc && (
                                  <div className="size-8 rounded bg-[#00506b] flex items-center justify-center shrink-0 p-1">
                                    <img
                                      src={cardItem.iconSrc}
                                      alt="Preview"
                                      className="size-5 object-contain"
                                      onError={(e) => {
                                        (e.target as HTMLElement).style.display = "none";
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Delete Button */}
                        <div className="shrink-0 self-center md:self-start">
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove "${cardItem.title || "this card"}"?`)) {
                                updateContactInfoCardsMetadata((prev) => ({
                                  ...prev,
                                  cards: prev.cards.filter((_, i) => i !== idx),
                                }));
                              }
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                            title="Delete Card"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[#bae6fd]/60">
                    <button
                      type="button"
                      onClick={() => {
                        updateContactInfoCardsMetadata((prev) => ({
                          ...prev,
                          cards: [
                            ...prev.cards,
                            {
                              title: "New Contact",
                              value: "contact@iilp.org",
                              timing: "Support Hours",
                              iconAlt: "Contact Icon",
                              iconSrc: "/images/contact-icon-email.svg",
                            },
                          ],
                        }));
                      }}
                      className="text-xs text-[#00506b] hover:underline font-semibold cursor-pointer"
                    >
                      + Add Another Card
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Reset to default 4 contact cards (Email, Phone, Office, Media)?")) {
                          updateContactInfoCardsMetadata(() => defaultContactInfoCardsMetadata);
                        }
                      }}
                      className="text-xs text-[#00506b] hover:underline font-semibold cursor-pointer"
                    >
                      Reset to Default 4 Cards
                    </button>
                  </div>
                </div>
              )}

              {/* Contact Campus & Location Map Visual Manager */}
              {(editingKey === "contact_map" ||
                (selectedPage === "contact" &&
                  (editingKey === "contact_map" ||
                    formData.sectionKey === "contact_map"))) && (
                <div className="bg-[#f0f9ff] border border-[#bae6fd] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00698c]"></span>
                      <h4 className="text-xs font-bold text-[#00698c] uppercase tracking-wider">
                        Dynamic Campus &amp; Location Map Configuration
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-500">
                      Displayed on /contact next to the form
                    </span>
                  </div>

                  {/* Mode Selector */}
                  <div className="grid grid-cols-2 gap-2 bg-white/80 p-1.5 rounded-xl border border-[#bae6fd]/60">
                    <button
                      type="button"
                      onClick={() =>
                        updateContactMapMetadata((prev) => ({
                          ...prev,
                          mapType: "embed",
                        }))
                      }
                      className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        getContactMapMetadata().mapType === "embed"
                          ? "bg-[#000080] text-white shadow-2xs"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Interactive Google Map (Embed Iframe)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateContactMapMetadata((prev) => ({
                          ...prev,
                          mapType: "image",
                        }))
                      }
                      className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        getContactMapMetadata().mapType === "image"
                          ? "bg-[#000080] text-white shadow-2xs"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Static Photo / Graphic Map
                    </button>
                  </div>

                  {/* Embed Iframe URL */}
                  {getContactMapMetadata().mapType === "embed" && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-[#344054]">
                          Google Maps Embed URL (iframe src)
                        </label>
                        <a
                          href="https://www.google.com/maps"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[#00698c] hover:underline"
                        >
                          Find on Google Maps &rarr; Share &rarr; Embed
                        </a>
                      </div>
                      <textarea
                        rows={2}
                        value={getContactMapMetadata().embedUrl}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          const srcMatch = val.match(/src=["'](.*?)["']/);
                          const urlToSet = srcMatch ? srcMatch[1] : val;
                          updateContactMapMetadata((prev) => ({
                            ...prev,
                            embedUrl: urlToSet,
                          }));
                        }}
                        placeholder="https://www.google.com/maps/embed?pb=..."
                        className="w-full text-xs font-mono p-2.5 border border-gray-200 rounded-xl bg-white focus:outline-hidden focus:border-[#000080]"
                      />
                    </div>
                  )}

                  {/* Static Map Image URL */}
                  {getContactMapMetadata().mapType === "image" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#344054]">
                        Map Image URL (or upload custom graphic)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={getContactMapMetadata().mapImage}
                          onChange={(e) =>
                            updateContactMapMetadata((prev) => ({
                              ...prev,
                              mapImage: e.target.value,
                            }))
                          }
                          placeholder="/images/contact-map.png"
                          className="flex-1 text-xs p-2.5 border border-gray-200 rounded-xl bg-white focus:outline-hidden focus:border-[#000080]"
                        />
                        <label className="px-3 py-2 text-xs font-bold bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 cursor-pointer shadow-2xs shrink-0">
                          Upload Image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              try {
                                const res = await uploadMediaFile(token, file, "maps");
                                if (res?.url) {
                                  updateContactMapMetadata((prev) => ({
                                    ...prev,
                                    mapImage: res.url,
                                  }));
                                  onShowToast("Map image uploaded!", "success");
                                }
                              } catch (err: unknown) {
                                onShowToast(
                                  err instanceof Error
                                    ? err.message
                                    : "Upload failed",
                                  "error"
                                );
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Campus Address & Contacts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] font-bold text-gray-600 block mb-1">
                        Campus / Head Office Address
                      </label>
                      <input
                        type="text"
                        value={getContactMapMetadata().address}
                        onChange={(e) =>
                          updateContactMapMetadata((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        placeholder="Dhaka, Bangladesh"
                        className="w-full text-xs p-2.5 border border-gray-200 rounded-xl bg-white focus:outline-hidden focus:border-[#000080]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-600 block mb-1">
                        Office Support Hours
                      </label>
                      <input
                        type="text"
                        value={getContactMapMetadata().officeHours}
                        onChange={(e) =>
                          updateContactMapMetadata((prev) => ({
                            ...prev,
                            officeHours: e.target.value,
                          }))
                        }
                        placeholder="Sunday to Thursday 9am to 5pm"
                        className="w-full text-xs p-2.5 border border-gray-200 rounded-xl bg-white focus:outline-hidden focus:border-[#000080]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-600 block mb-1">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        value={getContactMapMetadata().phone}
                        onChange={(e) =>
                          updateContactMapMetadata((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="+880 1819-254425"
                        className="w-full text-xs p-2.5 border border-gray-200 rounded-xl bg-white focus:outline-hidden focus:border-[#000080]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-600 block mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={getContactMapMetadata().email}
                        onChange={(e) =>
                          updateContactMapMetadata((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="info@iilp.org"
                        className="w-full text-xs p-2.5 border border-gray-200 rounded-xl bg-white focus:outline-hidden focus:border-[#000080]"
                      />
                    </div>
                  </div>

                  {/* Reset to Default */}
                  <div className="pt-2 flex items-center justify-end border-t border-[#bae6fd]/60">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Reset map configuration to defaults?")) {
                          updateContactMapMetadata(() => defaultContactMapMetadata);
                        }
                      }}
                      className="text-xs text-[#00698c] hover:underline font-semibold cursor-pointer"
                    >
                      Reset Map to Defaults
                    </button>
                  </div>
                </div>
              )}

              {/* Policy & Terms Sections Visual Manager */}
              {(editingKey === "policy_sections" ||
                formData.sectionKey === "policy_sections" ||
                editingKey === "terms_sections" ||
                formData.sectionKey === "terms_sections" ||
                ((selectedPage === "privacy-policy" ||
                  selectedPage === "terms-of-use") &&
                  (editingKey === "content" ||
                    formData.sectionKey === "content"))) && (
                <div className="bg-[#f8f9fc] border border-[#d8dce8] rounded-2xl p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e2e6f0] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#000080]"></span>
                      <h4 className="text-xs font-bold text-[#000080] uppercase tracking-wider">
                        Policy &amp; Terms Articles (
                        {getPolicySectionsMetadata().sections.length} Sections)
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-bold text-gray-500 whitespace-nowrap">
                        Last Updated:
                      </label>
                      <input
                        type="text"
                        value={getPolicySectionsMetadata().lastUpdated}
                        onChange={(e) =>
                          updatePolicySectionsMetadata((prev) => ({
                            ...prev,
                            lastUpdated: e.target.value,
                          }))
                        }
                        placeholder="January 2026"
                        className="px-2.5 py-1 text-xs font-semibold border border-gray-300 rounded-lg bg-white focus:outline-hidden focus:border-[#000080]"
                      />
                    </div>
                  </div>

                  {/* Section List */}
                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                    {getPolicySectionsMetadata().sections.map((sec, idx) => (
                      <div
                        key={`policy-sec-${idx}`}
                        className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-2.5 shadow-2xs hover:border-[#000080]/30 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="w-6 h-6 rounded-md bg-[#000080]/10 text-[#000080] text-xs font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={sec.heading}
                              onChange={(e) =>
                                updatePolicySectionsMetadata((prev) => {
                                  const list = [...prev.sections];
                                  list[idx] = {
                                    ...list[idx],
                                    heading: e.target.value,
                                  };
                                  return { ...prev, sections: list };
                                })
                              }
                              placeholder="e.g. 1. Information We Collect"
                              className="w-full text-xs sm:text-sm font-bold text-gray-900 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-[#000080] bg-gray-50/40"
                            />
                          </div>

                          {/* Reorder and Delete Controls */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                if (idx <= 0) return;
                                updatePolicySectionsMetadata((prev) => {
                                  const list = [...prev.sections];
                                  const temp = list[idx - 1];
                                  list[idx - 1] = list[idx];
                                  list[idx] = temp;
                                  return { ...prev, sections: list };
                                });
                              }}
                              className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Move Up"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 15l7-7 7 7"
                                />
                              </svg>
                            </button>

                            <button
                              type="button"
                              disabled={
                                idx ===
                                getPolicySectionsMetadata().sections.length - 1
                              }
                              onClick={() => {
                                if (
                                  idx >=
                                  getPolicySectionsMetadata().sections.length - 1
                                )
                                  return;
                                updatePolicySectionsMetadata((prev) => {
                                  const list = [...prev.sections];
                                  const temp = list[idx + 1];
                                  list[idx + 1] = list[idx];
                                  list[idx] = temp;
                                  return { ...prev, sections: list };
                                });
                              }}
                              className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="Move Down"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  confirm(
                                    `Delete article "${sec.heading || `Section ${idx + 1}`}"?`
                                  )
                                ) {
                                  updatePolicySectionsMetadata((prev) => ({
                                    ...prev,
                                    sections: prev.sections.filter(
                                      (_, i) => i !== idx
                                    ),
                                  }));
                                }
                              }}
                              className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                              title="Delete Section"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* ID slug and content */}
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center gap-2">
                            <label className="text-[11px] font-bold text-gray-500 whitespace-nowrap">
                              Anchor ID:
                            </label>
                            <input
                              type="text"
                              value={sec.id}
                              onChange={(e) =>
                                updatePolicySectionsMetadata((prev) => {
                                  const list = [...prev.sections];
                                  list[idx] = {
                                    ...list[idx],
                                    id: e.target.value,
                                  };
                                  return { ...prev, sections: list };
                                })
                              }
                              placeholder="e.g. information-we-collect"
                              className="flex-1 text-xs font-mono text-gray-600 border border-gray-200 rounded-md px-2 py-1 focus:outline-hidden focus:border-[#000080]"
                            />
                          </div>

                          <textarea
                            rows={3}
                            value={sec.content}
                            onChange={(e) =>
                              updatePolicySectionsMetadata((prev) => {
                                const list = [...prev.sections];
                                list[idx] = {
                                  ...list[idx],
                                  content: e.target.value,
                                };
                                return { ...prev, sections: list };
                              })
                            }
                            placeholder="Detailed policy clause text..."
                            className="w-full text-xs text-gray-700 leading-relaxed border border-gray-200 rounded-lg p-2.5 focus:outline-hidden focus:border-[#000080] resize-y"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Visual Manager Footer */}
                  <div className="pt-2 flex items-center justify-between border-t border-[#d8dce8]">
                    <button
                      type="button"
                      onClick={() => {
                        updatePolicySectionsMetadata((prev) => ({
                          ...prev,
                          sections: [
                            ...prev.sections,
                            {
                              id: `section-${prev.sections.length + 1}`,
                              heading: `${prev.sections.length + 1}. New Policy Article`,
                              content: "",
                            },
                          ],
                        }));
                      }}
                      className="text-xs text-[#000080] font-bold hover:underline cursor-pointer"
                    >
                      + Add New Policy Section
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (
                          confirm(
                            "Reset to standard 8 policy articles (Information, Use, Integrity, Conduct, Disclaimer, Links, Changes, Contact)?"
                          )
                        ) {
                          updatePolicySectionsMetadata(
                            () => defaultPolicySectionsMetadata
                          );
                        }
                      }}
                      className="text-xs text-gray-500 hover:text-gray-800 font-semibold cursor-pointer"
                    >
                      Reset to Default 8 Articles
                    </button>
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

              </div>

              {/* Sticky Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[#e5e7eb] bg-[#fcfdff] shrink-0">
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

      {/* Section Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!sectionToDelete}
        title="Delete Page Section"
        message={
          <>
            Are you sure you want to delete section <strong className="text-gray-900 font-semibold">{sectionToDelete}</strong> from <strong className="text-gray-900 font-semibold">{selectedPage}</strong>? This action cannot be undone.
          </>
        }
        confirmLabel="Confirm Delete"
        cancelLabel="Cancel"
        isConfirming={isDeletingSection}
        variant="danger"
        onConfirm={handleConfirmDeleteSection}
        onCancel={() => setSectionToDelete(null)}
      />
    </div>
  );
}
