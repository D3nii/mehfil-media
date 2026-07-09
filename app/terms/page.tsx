import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { DISCORD_INVITE_URL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Terms of Service | Mehfil Media",
  description:
    "Terms governing Mehfil Media’s AI content studio services, deliverables, and client engagements.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="These Terms of Service (“Terms”) govern your use of the Mehfil Media website and your engagement of our AI-assisted creative services. By contacting us for work, joining our Discord for services, or using this website, you agree to these Terms."
      effectiveDate="9 July 2026"
      sections={[
        {
          title: "About our services",
          content: (
            <>
              <p>
                Mehfil Media provides creative production services, including
                AI-assisted image and video generation, lifestyle compositing,
                product visualization, campaign asset creation, and related
                editorial support for brands and partners.
              </p>
              <p>
                Project scope, timelines, deliverable formats, revision rounds,
                and fees are confirmed in a written brief, proposal, invoice, or
                Discord/project agreement before production begins.
              </p>
            </>
          ),
        },
        {
          title: "Eligibility and authority",
          content: (
            <>
              <p>
                You represent that you are at least 18 years old and, if acting
                for a brand or company, that you have authority to bind that
                entity to these Terms and any project agreement.
              </p>
            </>
          ),
        },
        {
          title: "Client responsibilities",
          content: (
            <>
              <p>You agree to:</p>
              <ul>
                <li>
                  Provide accurate briefs, brand guidelines, and reference
                  materials needed for production
                </li>
                <li>
                  Confirm that you own or have licensed all assets, trademarks,
                  product designs, music, logos, and likenesses you supply
                </li>
                <li>
                  Obtain any required model, talent, or property releases before
                  asking us to use a real person’s likeness
                </li>
                <li>
                  Review drafts promptly and provide clear feedback within
                  agreed timelines
                </li>
                <li>
                  Use deliverables only for the purposes and territories
                  permitted in the project agreement
                </li>
              </ul>
              <p>
                You are responsible for the legal and commercial use of final
                assets in advertising, social media, packaging, or other
                channels.
              </p>
            </>
          ),
        },
        {
          title: "AI-generated and composite content",
          content: (
            <>
              <p>
                Our work may include AI-generated imagery, synthetic creators,
                digitally composited scenes, and hybrid edits combining client
                assets with generated elements. Unless otherwise agreed in
                writing:
              </p>
              <ul>
                <li>
                  Deliverables are creative interpretations produced for
                  marketing and storytelling purposes
                </li>
                <li>
                  AI outputs can contain imperfections, inconsistencies, or
                  unintended artifacts
                </li>
                <li>
                  You should review all assets carefully before public release
                </li>
                <li>
                  We do not guarantee that generated content will be unique
                  across the entire internet or free from stylistic similarity
                  to other AI outputs
                </li>
              </ul>
              <p>
                If a campaign requires disclosure that content is AI-assisted or
                synthetic, you are responsible for complying with applicable
                advertising, platform, and consumer-protection rules in your
                markets.
              </p>
            </>
          ),
        },
        {
          title: "Intellectual property",
          content: (
            <>
              <p>
                <strong>Your materials.</strong> You retain ownership of brand
                assets, product photography, trademarks, and other materials you
                provide. You grant Mehfil Media a limited license to use those
                materials solely to perform the project.
              </p>
              <p>
                <strong>Deliverables.</strong> Upon full payment, and unless a
                project agreement states otherwise, you receive a commercial
                license to use the final approved deliverables for your brand’s
                marketing and promotional purposes. Ownership transfer, extended
                exclusivity, resale rights, or white-label redistribution must
                be expressly agreed in writing.
              </p>
              <p>
                <strong>Studio materials.</strong> We retain ownership of our
                pre-existing tools, prompts, workflows, templates, internal
                models, know-how, and unused concepts. We may reuse general
                techniques and non-confidential process knowledge across
                projects.
              </p>
              <p>
                Portfolio use of completed work is permitted only with your
                consent, or as otherwise agreed in the project terms.
              </p>
            </>
          ),
        },
        {
          title: "Confidentiality",
          content: (
            <>
              <p>
                We treat non-public project materials and unreleased campaigns
                as confidential and use them only to deliver the engagement.
                You agree not to publicly share unpublished drafts, pricing, or
                internal process details without our consent, except as required
                by law or to your advisors under confidentiality.
              </p>
            </>
          ),
        },
        {
          title: "Fees, revisions, and payment",
          content: (
            <>
              <p>
                Fees, deposits, revision allowances, and payment schedules are
                set out in the relevant proposal or invoice. Work may pause if
                payment is late. Additional revision rounds, rush delivery,
                expanded usage rights, or scope changes may incur extra fees.
              </p>
              <p>
                Unless otherwise stated, deposits are non-refundable once
                production has started, because creative capacity and tooling
                costs are committed at kickoff.
              </p>
            </>
          ),
        },
        {
          title: "Acceptable use",
          content: (
            <>
              <p>You may not use our services or deliverables to:</p>
              <ul>
                <li>
                  Infringe intellectual property, privacy, publicity, or other
                  rights
                </li>
                <li>
                  Create deceptive deepfakes of real people without lawful
                  authorization
                </li>
                <li>
                  Produce unlawful, hateful, exploitative, or fraudulent content
                </li>
                <li>
                  Misrepresent AI-assisted content as documentary evidence or
                  unaltered photography when that would be misleading in context
                </li>
              </ul>
              <p>
                We may refuse or terminate projects that conflict with these
                standards or with our studio values.
              </p>
            </>
          ),
        },
        {
          title: "Third-party platforms",
          content: (
            <>
              <p>
                Project communication may occur on Discord or other tools. Those
                platforms are governed by their own terms and privacy policies.
                We are not responsible for outages, account issues, or data
                handling by third-party platforms outside our control.
              </p>
              <p>
                Service inquiries and community access are available via our{" "}
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord invite
                </a>
                .
              </p>
            </>
          ),
        },
        {
          title: "Disclaimers",
          content: (
            <>
              <p>
                The website and services are provided on an “as available”
                basis. Creative outcomes depend on briefs, references, feedback,
                and the evolving nature of AI tools. We do not warrant that
                deliverables will achieve specific commercial results, platform
                reach, conversion rates, or uninterrupted availability of any
                demo or preview feature on the website.
              </p>
            </>
          ),
        },
        {
          title: "Limitation of liability",
          content: (
            <>
              <p>
                To the fullest extent permitted by law, Mehfil Media is not
                liable for indirect, incidental, special, consequential, or lost
                profit damages arising from the website or services. Our total
                liability for a project is limited to the fees you paid us for
                that project in the three months preceding the claim.
              </p>
              <p>
                Nothing in these Terms excludes liability that cannot be limited
                under applicable law.
              </p>
            </>
          ),
        },
        {
          title: "Indemnity",
          content: (
            <>
              <p>
                You agree to indemnify and hold Mehfil Media harmless from
                claims arising out of materials you supply, your use of
                deliverables, your failure to secure necessary rights or
                disclosures, or your breach of these Terms.
              </p>
            </>
          ),
        },
        {
          title: "Termination",
          content: (
            <>
              <p>
                Either party may end an engagement as described in the project
                agreement. We may suspend or terminate services immediately for
                non-payment, rights issues, abusive conduct, or unlawful
                requests. Provisions on IP, confidentiality, payment,
                liability, and indemnity survive termination.
              </p>
            </>
          ),
        },
        {
          title: "Governing law",
          content: (
            <>
              <p>
                These Terms are governed by the laws of Pakistan, without regard
                to conflict-of-law principles. Courts located in Pakistan shall
                have exclusive jurisdiction, unless a project agreement
                specifies otherwise.
              </p>
            </>
          ),
        },
        {
          title: "Changes",
          content: (
            <>
              <p>
                We may update these Terms periodically. The effective date will
                be revised when changes are posted. Continued use of the website
                or services after updates constitutes acceptance of the revised
                Terms for future engagements.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
