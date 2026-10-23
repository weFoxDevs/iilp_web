import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { usePageContent } from "@/common/hooks/usePageContent";
import { SeoHead } from '@/common/components/SeoHead';
import { fetchPageContent, PageContentResponse } from '@/common/services/cms.service';

export const getStaticProps = (async () => {
  const pageContent = await fetchPageContent('privacy-policy').catch(() => null);
  return { props: { pageContent }, revalidate: 86400 };
}) satisfies GetStaticProps<{ pageContent: PageContentResponse | null }>;
import {
  PrivacyPolicyHero,
  PrivacyPolicyContent,
} from "@/modules/privacy";

import { GenericPageSkeleton } from "@/common/components/PageSkeletons";

export default function PrivacyPolicyPage({ pageContent }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { getSection, isLoading } = usePageContent('privacy-policy', pageContent);

  return (
    <>
      <SeoHead
        title="Privacy Policy | IILP - International Institute for Law and Politics"
        description="Learn how the International Institute for Law and Politics (IILP) collects, uses, and protects your personal information."
        canonicalPath="/privacy-policy"
      />

      <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-[#00bfff]/20 selection:text-[#000080]">
        {/* Navigation Bar */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">
          {isLoading ? (
            <GenericPageSkeleton title="Privacy Policy" />
          ) : (
            <>
              {/* Hero Section (Figma node 150:74268) */}
              <PrivacyPolicyHero data={getSection("hero")} />

              {/* Policy Body Content (Figma node 150:74280) */}
              <PrivacyPolicyContent
                data={getSection("policy_sections") || getSection("content")}
              />
            </>
          )}
        </main>

        {/* Institutional Footer (Figma Frame 150:74267 renders Footer without CTA) */}
        <Footer withCta={false} />
      </div>
    </>
  );
}
