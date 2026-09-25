import React from "react";

interface TermsSection {
  id: string;
  nodeId: string;
  headingNodeId: string;
  paragraphNodeId: string;
  heading: string;
  content: string;
}

const termsSections: TermsSection[] = [
  {
    id: "acceptance-of-terms",
    nodeId: "155:75212",
    headingNodeId: "155:75214",
    paragraphNodeId: "155:75216",
    heading: "1. Acceptance of Terms",
    content:
      "By accessing and using the IILP website (www.iilp.org), you accept and agree to be bound by these Terms of Use. If you do not agree with these terms, please discontinue use of the website.",
  },
  {
    id: "use-of-content",
    nodeId: "155:75217",
    headingNodeId: "155:75219",
    paragraphNodeId: "155:75221",
    heading: "2. Use of Content",
    content:
      "All content on this website — including text, research publications, images, and graphics — is the intellectual property of the International Institute for Law and Politics or its contributors. You may access and use this content for personal, non-commercial, and educational purposes, with proper attribution to IILP. Reproduction for commercial purposes requires prior written consent from IILP.",
  },
  {
    id: "academic-integrity",
    nodeId: "155:75222",
    headingNodeId: "155:75224",
    paragraphNodeId: "155:75226",
    heading: "3. Academic Integrity",
    content:
      "Users who access IILP's research publications and academic content are expected to uphold standards of academic integrity, including proper citation and attribution of IILP's work.",
  },
  {
    id: "user-conduct",
    nodeId: "155:75227",
    headingNodeId: "155:75229",
    paragraphNodeId: "155:75231",
    heading: "4. User Conduct",
    content:
      "You agree not to use the IILP website for any unlawful purpose; to upload malicious content; to misrepresent your identity or affiliation with IILP; or to engage in conduct that could harm IILP's reputation, mission, or institutional integrity.",
  },
  {
    id: "disclaimer",
    nodeId: "155:75232",
    headingNodeId: "155:75234",
    paragraphNodeId: "155:75236",
    heading: "5. Disclaimer",
    content:
      "The information on this website is provided in good faith for informational and educational purposes. IILP makes no warranties, expressed or implied, about the completeness, accuracy, or reliability of the content.",
  },
  {
    id: "third-party-links",
    nodeId: "155:75237",
    headingNodeId: "155:75239",
    paragraphNodeId: "155:75241",
    heading: "6. Links to Third-Party Websites",
    content:
      "The IILP website may contain links to external websites. IILP is not responsible for the content, accuracy, or privacy practices of third-party websites.",
  },
  {
    id: "changes-to-terms",
    nodeId: "155:75242",
    headingNodeId: "155:75244",
    paragraphNodeId: "155:75246",
    heading: "7. Changes to Terms",
    content:
      "IILP reserves the right to update these Terms of Use at any time. Continued use of the website following any changes constitutes acceptance of the updated terms.",
  },
  {
    id: "contact",
    nodeId: "155:75247",
    headingNodeId: "155:75249",
    paragraphNodeId: "155:75251",
    heading: "8. Contact",
    content:
      "For questions about these Terms of Use, please contact IILP at info@iilp.org.",
  },
];

import { PageSectionData } from "@/common/services/cms.service";

interface TermsContentProps {
  data?: Partial<PageSectionData>;
}

export function TermsContent({ data }: TermsContentProps = {}) {
  const rawLastUpdated =
    (data?.metadata?.lastUpdated as string) ||
    (data?.subtitle as string) ||
    "January 2026";
  const lastUpdated = rawLastUpdated.toLowerCase().startsWith("last updated")
    ? rawLastUpdated
    : `Last updated: ${rawLastUpdated}`;
  const sections =
    Array.isArray(data?.metadata?.sections) && data?.metadata?.sections.length > 0
      ? (data.metadata.sections as { heading: string; content: string; id?: string }[])
      : termsSections;

  return (
    <section
      className="bg-white flex items-start justify-center px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px] py-16 sm:py-24 lg:py-[140px] relative w-full"
      data-node-id="155:75208"
    >
      <div
        className="flex flex-col items-start max-w-[768px] w-full mx-auto relative shrink-0"
        data-node-id="155:75209"
        data-name="Container"
      >
        {/* Last updated timestamp (Figma node 155:75210) */}
        <div
          className="flex flex-col items-start relative shrink-0 w-full"
          data-node-id="155:75210"
          data-name="Paragraph"
        >
          <p
            className="font-sans font-normal leading-[20px] text-[#717680] text-[14px] whitespace-nowrap"
            data-node-id="155:75211"
          >
            {lastUpdated}
          </p>
        </div>

        {/* Terms Sections */}
        {sections.map((sec, idx) => (
          <article
            key={sec.id || idx}
            id={sec.id}
            className="flex flex-col items-start pt-[24px] relative shrink-0 w-full"
            data-node-id={(sec as any).nodeId}
            data-name="Container"
          >
            {/* Heading */}
            <div className="flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
              <h2
                className="font-serif font-bold leading-normal text-[#000080] text-[22px] sm:text-[24px]"
                data-node-id={(sec as any).headingNodeId}
              >
                {sec.heading}
              </h2>
            </div>

            {/* Paragraph Body */}
            <div
              className="flex flex-col items-start pt-[8px] relative shrink-0 w-full"
              data-name="Paragraph"
            >
              <p
                className="font-sans font-normal leading-[28px] text-[#374151] text-[18px] w-full"
                data-node-id={(sec as any).paragraphNodeId}
              >
                {sec.id === "contact" ? (
                  <>
                    For questions about these Terms of Use, please contact IILP at{" "}
                    <a
                      href="mailto:info@iilp.org"
                      className="text-[#000080] hover:underline font-medium"
                    >
                      info@iilp.org
                    </a>
                    .
                  </>
                ) : sec.id === "acceptance-of-terms" ? (
                  <>
                    By accessing and using the IILP website (
                    <a
                      href="https://www.iilp.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#000080] hover:underline"
                    >
                      www.iilp.org
                    </a>
                    ), you accept and agree to be bound by these Terms of Use. If you do not agree with these terms, please discontinue use of the website.
                  </>
                ) : (
                  sec.content
                )}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
