import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Header } from "@/common/components/Header";
import { Footer } from "@/common/components/Footer";
import { usePageContent } from "@/common/hooks/usePageContent";
import { SeoHead } from '@/common/components/SeoHead';
import { fetchPageContent, PageContentResponse } from '@/common/services/cms.service';

export const getStaticProps = (async () => {
  const pageContent = await fetchPageContent('terms-of-use').catch(() => null);
  return { props: { pageContent }, revalidate: 86400 };
}) satisfies GetStaticProps<{ pageContent: PageContentResponse | null }>;
import { TermsHero, TermsContent } from "@/modules/terms";

import { GenericPageSkeleton } from "@/common/components/PageSkeletons";

export default function TermsOfUsePage({ pageContent }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { getSection, isLoading } = usePageContent('terms-of-use', pageContent);

  return (
    <>
      <SeoHead
        title="Terms of Use | IILP - International Institute for Law and Politics"
        description="Review the Terms and Conditions governing your use of the International Institute for Law and Politics (IILP) website and digital publications."
        canonicalPath="/terms-of-use"
      />

      <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-[#00bfff]/20 selection:text-[#000080]">
        {/* Navigation Bar */}
        <Header />

        {/* Main Content */}
        <main className="flex-grow">
          {isLoading ? (
            <GenericPageSkeleton title="Terms of Use" />
          ) : (
            <>
              {/* Hero Section (Figma node 155:75196) */}
              <TermsHero data={getSection("hero")} />

              {/* Terms Body Content (Figma node 155:75208) */}
              <TermsContent
                data={
                  getSection("policy_sections") ||
                  getSection("terms_sections") ||
                  getSection("content")
                }
              />
            </>
          )}
        </main>

        {/* Institutional Footer (Figma Frame 155:75195 renders Footer without CTA) */}
        <Footer withCta={false} />
      </div>
    </>
  );
}
