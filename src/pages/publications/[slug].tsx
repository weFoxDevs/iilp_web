import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import PublicationDetailsHero from "@/modules/research/components/PublicationDetailsHero";
import PublicationDetailsOverview from "@/modules/research/components/PublicationDetailsOverview";
import ReadMoreResearch from "@/modules/research/components/ReadMoreResearch";
import {
  fetchPublicPublicationByIdentifier,
  PublicationItem,
} from "@/common/services/publications.service";

const fallbackPublicationsMap: Record<string, PublicationItem> = {
  "refugee-protection-in-a-fragmented-global-order-policy-priorities-for-2026": {
    id: "pub-1",
    slug: "refugee-protection-in-a-fragmented-global-order-policy-priorities-for-2026",
    category: "Policy Briefs",
    field: "Refugee & Displacement Studies",
    publicationDate: "August 2026",
    title: "Refugee Protection in a Fragmented Global Order: Policy Priorities for 2026",
    description:
      "This brief examines emerging protection gaps and proposes evidence-based recommendations for strengthening refugee protection mechanisms in the current global context.",
    authorName: "IILP Research Directorate",
    authorRole: "Policy Brief",
    authorInitials: "RD",
    image: "/assets/department-details-hero.png",
    highlighted: false,
    overview:
      "As global displacement reaches unprecedented levels amidst shifting international norms, traditional refugee protection architectures face critical strain. This policy brief provides an analytical assessment of emerging protection gaps across key transit routes, the impact of externalized border regimes, and the challenges confronting the 1951 Refugee Convention in contemporary multi-crises.\n\nDrawing on empirical fieldwork and international humanitarian jurisprudence, this study highlights structural deficiencies in burden-sharing agreements and outlines immediate policy interventions required by regional and multilateral bodies to uphold non-refoulement, guarantee procedural fairness in asylum determinations, and foster durable, dignified integration pathways.",
    purpose:
      "To offer policymakers, legal advocates, and international organizations actionable legal and institutional recommendations to reinforce international refugee protection standards, address systemic vulnerabilities, and ensure resilient multilateral cooperation in times of geopolitical fragmentation.",
    researchAreas: [
      "Comprehensive analysis of contemporary international legal protection frameworks under the 1951 Convention",
      "Critical evaluation of externalized border controls and their human rights implications",
      "Assessment of equitable responsibility-sharing models across regional transit and destination states",
      "Development of actionable policy protocols to safeguard vulnerable displaced populations and asylum seekers",
      "Strategic recommendations for international human rights tribunals and humanitarian agencies",
    ],
    documentUrl: "https://example.com/papers/refugee-protection-2026.pdf",
    sortOrder: 0,
    isActive: true,
  },
  "international-humanitarian-law-in-emerging-conflicts-challenges-and-modern-frameworks": {
    id: "pub-2",
    slug: "international-humanitarian-law-in-emerging-conflicts-challenges-and-modern-frameworks",
    category: "Research Papers",
    field: "Human Rights & Conflict Resolution",
    publicationDate: "August 2026",
    title:
      "International Humanitarian Law in Emerging Conflicts: Challenges and Modern Frameworks",
    description:
      "A comprehensive analysis of international humanitarian law compliance and enforcement dilemmas in non-international armed conflicts.",
    authorName: "Dr. Elena Rostova",
    authorRole: "Senior Fellow",
    authorInitials: "ER",
    image: "/assets/department-details-hero.png",
    highlighted: true,
    overview:
      "Non-international armed conflicts (NIACs) have become the predominant form of modern warfare, posing profound challenges to the Geneva Conventions and Additional Protocols. This research paper evaluates the application of customary international humanitarian law (IHL) in asymmetric combat environments, urban warfare contexts, and the deployment of autonomous weapon systems.\n\nThrough rigorous case evaluations and comparative jurisprudence from international criminal courts, the authors articulate the urgent need for harmonized interpretative guidelines that govern non-state armed actors and reinforce civilian protection norms.",
    purpose:
      "To bridge doctrinal gaps between traditional IHL codifications and modern conflict dynamics, providing military legal advisors, diplomats, and international jurists with rigorous legal clarity on combatant accountability and humanitarian compliance.",
    researchAreas: [
      "Application of the principle of distinction in asymmetric urban warfare environments",
      "Legal accountability and customary obligations binding non-state armed entities",
      "Emerging regulatory frameworks for algorithmic decision-making and autonomous weapons in combat",
      "Prosecutorial strategies and evidentiary standards before international criminal tribunals",
    ],
    documentUrl: "https://example.com/papers/ihl-emerging-conflicts.pdf",
    sortOrder: 1,
    isActive: true,
  },
  "constitutional-transformations-and-democratic-resilience-in-comparative-perspective": {
    id: "pub-3",
    slug: "constitutional-transformations-and-democratic-resilience-in-comparative-perspective",
    category: "Working Papers",
    field: "Comparative Politics & Governance",
    publicationDate: "July 2026",
    title:
      "Constitutional Transformations and Democratic Resilience in Comparative Perspective",
    description:
      "Examining institutional counterbalances and constitutional judiciary performance amidst rising polarization and democratic erosion.",
    authorName: "Prof. Marcus Thorne",
    authorRole: "Principal Investigator",
    authorInitials: "MT",
    image: "/assets/department-details-hero.png",
    highlighted: false,
    overview:
      "This working paper interrogates the institutional mechanisms that enable constitutional democracies to withstand systemic stress, partisan capture, and subtle executive aggrandizement. Comparative data across twelve jurisdictions in the Global South and North provides evidence on judicial independence, electoral integrity commissions, and civic counter-weights.\n\nThe findings demonstrate that constitutional courts alone cannot preserve democratic stability without robust structural separation of powers and participatory civic engagement.",
    purpose:
      "To examine constitutional engineering strategies that enhance institutional resilience against autocratization and safeguard democratic values across diverse constitutional jurisdictions.",
    researchAreas: [
      "Comparative structural analysis of constitutional courts and judicial review efficacy",
      "Safeguards against unconstitutional constitutional amendments and executive overreach",
      "Institutional design of independent electoral commissions and integrity oversight bodies",
      "The role of subnational governance in buffering central democratic regressions",
    ],
    documentUrl: "https://example.com/papers/constitutional-transformations-2026.pdf",
    sortOrder: 2,
    isActive: true,
  },
  "geopolitical-realignments-and-multilateral-treaties-negotiating-global-climate-action": {
    id: "pub-4",
    slug: "geopolitical-realignments-and-multilateral-treaties-negotiating-global-climate-action",
    category: "Research Reports",
    field: "International Environmental Law",
    publicationDate: "June 2026",
    title:
      "Geopolitical Realignments and Multilateral Treaties: Negotiating Global Climate Action",
    description:
      "A strategic policy report on multilateral treaty mechanisms, compliance incentives, and state accountability in transboundary environmental agreements.",
    authorName: "IILP Climate Law Working Group",
    authorRole: "Research Report",
    authorInitials: "CL",
    image: "/assets/department-details-hero.png",
    highlighted: false,
    overview:
      "Global climate treaties are increasingly mediated by shifting geopolitical alliances, economic sanctions, and green industrial policies. This report synthesizes multilateral negotiations under the UNFCCC framework with international trade and investment regimes to identify pathways for enforceable transboundary environmental compliance.\n\nIt assesses loss-and-damage mechanisms, carbon border adjustments, and the burgeoning advisory jurisdiction of the International Court of Justice on state climate responsibilities.",
    purpose:
      "To provide state delegations, international negotiators, and civil society observers with an analytical roadmap for reconciling international trade law with ambitious multilateral climate treaty commitments.",
    researchAreas: [
      "Jurisprudential analysis of international advisory opinions on state climate responsibilities",
      "Interactions between WTO trade disciplines and transboundary carbon border adjustments",
      "Financing frameworks and dispute resolution under international loss-and-damage agreements",
      "Multilateral environmental agreement enforcement and dispute settlement mechanisms",
    ],
    documentUrl: "https://example.com/papers/climate-action-treaties-2026.pdf",
    sortOrder: 3,
    isActive: true,
  },
};

export default function PublicationDynamicDetailsPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [publication, setPublication] = useState<PublicationItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug || typeof slug !== "string") return;

    let isMounted = true;
    setIsLoading(true);

    fetchPublicPublicationByIdentifier(slug)
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setPublication(data);
        } else {
          // Check fallback map
          const fallback =
            fallbackPublicationsMap[slug] ||
            Object.values(fallbackPublicationsMap).find(
              (p) => p.id === slug || p.slug === slug
            );
          setPublication(fallback || null);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        const fallback =
          fallbackPublicationsMap[slug] ||
          Object.values(fallbackPublicationsMap).find(
            (p) => p.id === slug || p.slug === slug
          );
        setPublication(fallback || null);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const pageTitle = publication
    ? `${publication.title} | IILP Research & Publications`
    : "Publication Details | IILP Research & Publications";

  const pageDescription =
    publication?.description ||
    "Read IILP's detailed research publication including overview, abstract, and policy briefs.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />
        <main className="flex-grow">
          {isLoading ? (
            <div className="min-h-[500px] flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-[#00bfff] border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Loading publication details...</p>
            </div>
          ) : !publication ? (
            <div className="min-h-[500px] flex flex-col items-center justify-center gap-4 text-center px-6">
              <div className="w-16 h-16 rounded-full bg-sky-50 text-[#00698c] flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">
                Publication Not Found
              </h2>
              <p className="text-gray-600 text-sm max-w-md">
                The research paper or publication you requested could not be located. It may have been moved or unpublished.
              </p>
              <Link
                href="/publications"
                className="mt-2 px-6 py-2.5 bg-[#00bfff] hover:bg-[#009ecc] text-white text-sm font-semibold rounded-full shadow-xs"
              >
                Back to Research &amp; Publications
              </Link>
            </div>
          ) : (
            <>
              <PublicationDetailsHero publication={publication} />
              <PublicationDetailsOverview publication={publication} />
              <ReadMoreResearch currentId={publication.id} />
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
