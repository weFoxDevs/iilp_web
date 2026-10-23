import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Header } from '@/common/components/Header';
import { Footer } from '@/common/components/Footer';
import { usePageContent } from '@/common/hooks/usePageContent';
import {
  ContactHero,
  ContactFormSection,
  ContactInfoGrid,
} from '@/modules/contact';
import { GenericPageSkeleton } from '@/common/components/PageSkeletons';
import { SeoHead, breadcrumbJsonLd } from '@/common/components/SeoHead';
import { fetchPageContent, PageContentResponse } from '@/common/services/cms.service';

export const getStaticProps = (async () => {
  const pageContent = await fetchPageContent('contact').catch(() => null);
  return {
    props: { pageContent },
    revalidate: 3600,
  };
}) satisfies GetStaticProps<{ pageContent: PageContentResponse | null }>;

export default function ContactPage({ pageContent }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { getSection, isLoading } = usePageContent('contact', pageContent);

  return (
    <>
      <SeoHead
        title="Contact Us | IILP - International Institute for Law and Politics"
        description="Get in touch with the International Institute for Law and Politics (IILP). Contact our team for academic inquiries, fellowship programs, institutional partnerships, or visit our campus."
        canonicalPath="/contact"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' },
        ])}
      />

      <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-[#00bfff]/20 selection:text-[#00506b]">
        <Header />
        <main className="flex-grow">
          {isLoading ? (
            <GenericPageSkeleton title="Contact Us" />
          ) : (
            <>
              <ContactHero data={getSection('hero')} />
              <ContactFormSection
                data={getSection('contact_form') || getSection('form')}
                mapData={getSection('contact_map')}
              />
              <ContactInfoGrid
                data={getSection('contact_info_cards') || getSection('info_grid')}
              />
            </>
          )}
        </main>
        <Footer withCta={true} />
      </div>
    </>
  );
}
