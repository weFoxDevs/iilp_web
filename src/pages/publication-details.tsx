import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import PublicationDetailsHero from "@/modules/research/components/PublicationDetailsHero";
import PublicationDetailsOverview from "@/modules/research/components/PublicationDetailsOverview";
import ReadMoreResearch from "@/modules/research/components/ReadMoreResearch";
import {
  fetchPublicPublicationByIdentifier,
  fetchPublicPublications,
  PublicationItem,
} from "@/common/services/publications.service";

export default function PublicationDetailsPage() {
  const router = useRouter();
  const { id, slug } = router.query;
  const [publication, setPublication] = useState<PublicationItem | null>(null);

  useEffect(() => {
    let isMounted = true;
    const target = (slug as string) || (id as string);

    if (target) {
      fetchPublicPublicationByIdentifier(target)
        .then((data) => {
          if (isMounted && data) {
            setPublication(data);
          }
        })
        .catch(() => {});
    } else {
      // Default: load the first active publication
      fetchPublicPublications()
        .then((items) => {
          if (isMounted && items && items.length > 0) {
            setPublication(items[0]);
          }
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, [id, slug]);

  const pageTitle = publication
    ? `${publication.title} | IILP Research & Publications`
    : "Publication Details | IILP Research & Publications";

  const pageDescription =
    publication?.description ||
    "Read IILP's detailed research publication including overview, abstract, and related research papers in law, governance, and human rights.";

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Head>

      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />
        <main className="flex-grow">
          <PublicationDetailsHero publication={publication} />
          <PublicationDetailsOverview publication={publication} />
          <ReadMoreResearch currentId={publication?.id} />
        </main>
        <Footer />
      </div>
    </>
  );
}
