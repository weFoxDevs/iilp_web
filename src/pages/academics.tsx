import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import { Header } from '@/common/components/Header';
import { Footer } from '@/common/components/Footer';
import AcademicProgramsHero from '@/modules/academics/components/AcademicProgramsHero';
import AcademicDepartments from '@/modules/academics/components/AcademicDepartments';
import ApplyAcademicProgram from '@/modules/academics/components/ApplyAcademicProgram';
import { usePageContent } from '@/common/hooks/usePageContent';
import { useGetDepartmentsQuery } from '@/store/api/cmsApi';
import AcademicsSkeleton from '@/modules/academics/components/AcademicsSkeleton';
import { SeoHead, breadcrumbJsonLd } from '@/common/components/SeoHead';
import { fetchPageContent, PageContentResponse } from '@/common/services/cms.service';
import { fetchDepartments, DepartmentItem } from '@/common/services/departments.service';

export const getStaticProps = (async () => {
  const [pageContent, departments] = await Promise.all([
    fetchPageContent('academics').catch(() => null),
    fetchDepartments({ activeOnly: true }).catch(() => []),
  ]);
  return {
    props: { pageContent, initialDepartments: departments },
    revalidate: 600,
  };
}) satisfies GetStaticProps<{
  pageContent: PageContentResponse | null;
  initialDepartments: DepartmentItem[];
}>;

export default function AcademicsPage({
  pageContent,
  initialDepartments,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { getSection, isLoading: isContentLoading } = usePageContent('academics', pageContent);
  const { data: departments = initialDepartments, isLoading: isDeptsLoading } =
    useGetDepartmentsQuery({ activeOnly: true }, { skip: initialDepartments.length > 0 });

  const isLoading = isContentLoading || (initialDepartments.length === 0 && isDeptsLoading);

  return (
    <>
      <SeoHead
        title="Academic Programs | International Institute for Law and Politics"
        description="Explore IILP's academic programs, departments, and courses in law, governance, human rights, and international policy."
        canonicalPath="/academics"
        jsonLd={breadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Academics', url: '/academics' },
        ])}
      />

      <div className="flex flex-col min-h-screen bg-white font-sans">
        <Header />
        <main className="flex-grow">
          {isLoading ? (
            <AcademicsSkeleton />
          ) : (
            <>
              <AcademicProgramsHero data={getSection('hero')} />
              <AcademicDepartments
                data={getSection('departments_intro')}
                departments={departments}
              />
              <ApplyAcademicProgram data={getSection('apply_program_banner')} />
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
