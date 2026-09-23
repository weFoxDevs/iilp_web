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
        if (isMounted) {
          setPublication(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPublication(null);
          setIsLoading(false);
        }
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
