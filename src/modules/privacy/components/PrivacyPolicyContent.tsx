import React from "react";

interface PolicySection {
  id: string;
  nodeId: string;
  headingNodeId: string;
  paragraphNodeId: string;
  heading: string;
  content: string;
}

const policySections: PolicySection[] = [
  {
    id: "information-we-collect",
    nodeId: "150:75154",
    headingNodeId: "150:75156",
    paragraphNodeId: "150:75158",
    heading: "1. Information We Collect",
    content:
      "IILP collects personal information that you voluntarily provide when completing contact forms, fellowship applications, event registrations, donation forms, careers applications, and newsletter subscriptions. This may include your name, email address, phone number, institution, country of residence, and supporting documents you upload.",
  },
  {
    id: "how-we-use-information",
    nodeId: "150:75159",
    headingNodeId: "150:75161",
    paragraphNodeId: "150:75163",
    heading: "2. How We Use Your Information",
    content:
      "We use your information to respond to your inquiries, process applications and registrations, send communications you have requested (such as newsletters and event confirmations), improve our website and services, and fulfill our institutional mission. We do not sell or share your personal information with third parties for commercial purposes.",
  },
  {
    id: "academic-integrity",
    nodeId: "150:75164",
    headingNodeId: "150:75166",
    paragraphNodeId: "150:75168",
    heading: "3. Academic Integrity",
    content:
      "Users who access IILP's research publications and academic content are expected to uphold standards of academic integrity, including proper citation and attribution of IILP's work.",
  },
  {
    id: "user-conduct",
    nodeId: "150:75169",
    headingNodeId: "150:75171",
    paragraphNodeId: "150:75173",
    heading: "4. User Conduct",
    content:
      "You agree not to use the IILP website for any unlawful purpose; to upload malicious content; to misrepresent your identity or affiliation with IILP; or to engage in conduct that could harm IILP's reputation, mission, or institutional integrity.",
  },
  {
    id: "disclaimer",
    nodeId: "150:75174",
    headingNodeId: "150:75176",
    paragraphNodeId: "150:75178",
    heading: "5. Disclaimer",
    content:
      "The information on this website is provided in good faith for informational and educational purposes. IILP makes no warranties, expressed or implied, about the completeness, accuracy, or reliability of the content.",
  },
  {
    id: "third-party-links",
    nodeId: "150:75179",
    headingNodeId: "150:75181",
    paragraphNodeId: "150:75183",
    heading: "6. Links to Third-Party Websites",
    content:
      "The IILP website may contain links to external websites. IILP is not responsible for the content, accuracy, or privacy practices of third-party websites.",
  },
  {
    id: "changes-to-terms",
    nodeId: "150:75184",
    headingNodeId: "150:75185",
    paragraphNodeId: "150:75188",
    heading: "7. Changes to Terms",
    content:
      "IILP reserves the right to update these Terms of Use at any time. Continued use of the website following any changes constitutes acceptance of the updated terms.",
  },
  {
    id: "contact",
    nodeId: "150:75189",
    headingNodeId: "150:75191",
    paragraphNodeId: "150:75193",
    heading: "8. Contact",
    content:
      "For questions about these Terms of Use, please contact IILP at info@iilp.org.",
  },
];

import { PageSectionData } from "@/common/services/cms.service";

interface PrivacyPolicyContentProps {
  data?: Partial<PageSectionData>;
}

export function PrivacyPolicyContent({ data }: PrivacyPolicyContentProps = {}) {
  const lastUpdated =
    (data?.metadata?.lastUpdated as string) || "Last updated: January 2026";
  const sections =
    Array.isArray(data?.metadata?.sections) && data?.metadata?.sections.length > 0
      ? (data.metadata.sections as { heading: string; content: string; id?: string }[])
      : policySections;

  return (
    <section
      className="bg-white flex items-start justify-center px-6 sm:px-12 md:px-16 lg:px-20 xl:px-[240px] py-16 sm:py-24 lg:py-[140px] relative w-full"
      data-node-id="150:74280"
    >
      <div
        className="flex flex-col items-start max-w-[768px] w-full mx-auto relative shrink-0"
        data-node-id="150:75151"
        data-name="Container"
      >
        {/* Last updated timestamp (Figma node 150:75152) */}
        <div
          className="flex flex-col items-start relative shrink-0 w-full"
          data-node-id="150:75152"
          data-name="Paragraph"
        >
          <p
            className="font-sans font-normal leading-[20px] text-[#717680] text-[14px] whitespace-nowrap"
            data-node-id="150:75153"
          >
            {lastUpdated}
          </p>
        </div>

        {/* Policy Sections */}
        {sections.map((sec, idx) => (
          <article
            key={sec.id || idx}
            className="flex flex-col items-start pt-[24px] relative shrink-0 w-full"
            data-name="Container"
          >
            {/* Heading */}
            <div className="flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
              <h2
                className="font-serif font-bold leading-normal text-[#000080] text-[24px] whitespace-nowrap"
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
