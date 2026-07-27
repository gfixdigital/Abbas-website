import type { Metadata } from "next";
import { profile } from "@/content";
import { absoluteUrl } from "@/lib/utils";
import { PageHeader, Section } from "@/components/shared/Section";
import { LegalBody } from "@/components/shared/LegalBody";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How this website handles personal data: what is collected through the contact form and newsletter, where it is stored, and how to have it deleted.",
  alternates: { canonical: absoluteUrl("/privacy") },
  robots: { index: true, follow: true },
};

const UPDATED = "27 July 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Privacy"
        title="Privacy notice."
        description={`What this site collects, why, and how to have it removed. Last updated ${UPDATED}.`}
      />

      <Section containerClassName="max-w-3xl py-16 sm:py-20">
        <LegalBody
          sections={[
            {
              heading: "Who is responsible",
              paragraphs: [
                `This website is operated by ${profile.name}, ${profile.title} of ${profile.company}, based in ${profile.location}. For any question about your data, contact ${profile.email}.`,
              ],
            },
            {
              heading: "What is collected",
              paragraphs: [
                "Two things, both of which you provide deliberately:",
              ],
              list: [
                "Contact form submissions: your name, email address, optional company name, the enquiry type and budget range you select, and your message.",
                "Newsletter signups: your email address only.",
              ],
              after: [
                "Nothing else is collected. There is no advertising network on this site, no third-party tracking pixel, no session recording, and no behavioural profiling.",
              ],
            },
            {
              heading: "Why it is collected",
              paragraphs: [
                "Contact form data is used to reply to your enquiry and, if a project follows, to correspond about it. Newsletter addresses are used only to send occasional posts.",
                "Neither is sold, rented, or shared with third parties for their own purposes.",
              ],
            },
            {
              heading: "Where it is stored",
              paragraphs: [
                "Submissions are stored in a Supabase PostgreSQL database and delivered by email through Resend. Both are processors acting on instruction, and both hold data on infrastructure outside Pakistan.",
                "Access to the stored records is restricted to a single authenticated administrator account.",
              ],
            },
            {
              heading: "How long it is kept",
              paragraphs: [
                "Enquiries are retained for as long as the commercial relationship or its record is relevant, and reviewed periodically. Newsletter addresses are kept until you unsubscribe.",
              ],
            },
            {
              heading: "Cookies",
              paragraphs: [
                "This site sets no analytics or advertising cookies. Your colour theme preference is stored in your browser's local storage, and whether you have already seen the intro animation is stored for the duration of your browser session. Neither is transmitted anywhere.",
                "If you sign in to the administration area, a session cookie is set. That applies to the site owner only.",
              ],
            },
            {
              heading: "Your rights",
              paragraphs: [
                "You can ask what data is held about you, ask for it to be corrected, or ask for it to be deleted. Send the request to the email address above and it will be actioned, normally within a few working days.",
              ],
            },
            {
              heading: "Changes",
              paragraphs: [
                `This notice may be updated if the site's functionality changes. The date at the top reflects the current version, presently ${UPDATED}.`,
              ],
            },
          ]}
        />
      </Section>
    </>
  );
}
