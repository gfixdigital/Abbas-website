import type { Metadata } from "next";
import { profile } from "@/content";
import { absoluteUrl } from "@/lib/utils";
import { PageHeader, Section } from "@/components/shared/Section";
import { LegalBody } from "@/components/shared/LegalBody";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms of use for this website, covering content ownership, accuracy, third-party links and the status of any enquiry made through the contact form.",
  alternates: { canonical: absoluteUrl("/terms") },
};

const UPDATED = "27 July 2026";

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Terms"
        title="Terms of use."
        description={`The terms on which this website is made available. Last updated ${UPDATED}.`}
      />

      <Section containerClassName="max-w-3xl py-16 sm:py-20">
        <LegalBody
          sections={[
            {
              heading: "About this site",
              paragraphs: [
                `This is the personal professional website of ${profile.name}, ${profile.title} of ${profile.company}. It exists to present professional work and to let people get in touch.`,
              ],
            },
            {
              heading: "Content and ownership",
              paragraphs: [
                "The written content, layout, code and design of this site belong to its owner. You are welcome to link to any page, quote a reasonable extract with attribution, or share it.",
                "Republishing substantial portions, or reusing the design or code as the basis of another site, requires permission.",
              ],
            },
            {
              heading: "Client work shown here",
              paragraphs: [
                "Project images, client names and logos remain the property of those clients and appear here to illustrate work delivered. Their inclusion is not an endorsement by them of anything else on this site.",
                "If you are a client and would like a project removed or amended, email the address below and it will be done.",
              ],
            },
            {
              heading: "Accuracy",
              paragraphs: [
                "Project descriptions, figures and biographical details are presented in good faith and kept current. Figures such as project and learner totals are approximate and rounded.",
                "Nothing on this site is professional advice, and no outcome shown here is a guarantee of a similar outcome on another project.",
              ],
            },
            {
              heading: "Enquiries are not contracts",
              paragraphs: [
                "Submitting the contact form starts a conversation. It does not create a contract, reserve capacity, or commit either party to anything. Any engagement is governed by a separate written agreement covering scope, fees, timelines and ownership of deliverables.",
              ],
            },
            {
              heading: "External links",
              paragraphs: [
                "This site links to client sites, partner organisations and social profiles that it does not control. Those destinations have their own terms and privacy practices, and no responsibility is accepted for their content.",
              ],
            },
            {
              heading: "Availability",
              paragraphs: [
                "The site is provided as it is. Reasonable effort goes into keeping it available and working, but no guarantee of uninterrupted access is offered.",
              ],
            },
            {
              heading: "Governing law and contact",
              paragraphs: [
                "These terms are governed by the laws of Pakistan.",
                `Questions about anything on this page: ${profile.email}.`,
              ],
            },
          ]}
        />
      </Section>
    </>
  );
}
