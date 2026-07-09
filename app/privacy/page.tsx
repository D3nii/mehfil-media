import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { DISCORD_INVITE_URL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Privacy Policy | Mehfil Media",
  description:
    "How Mehfil Media collects, uses, and protects information when you engage our AI content studio.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This Privacy Policy explains how Mehfil Media (“we”, “us”, or “our”) collects, uses, stores, and shares information when you visit our website, join our Discord community, or engage us for AI-assisted creative services."
      effectiveDate="9 July 2026"
      sections={[
        {
          title: "Who we are",
          content: (
            <>
              <p>
                Mehfil Media is a creative studio that produces AI-assisted
                lifestyle, fashion, beauty, and product content for brands,
                especially those rooted in South Asian aesthetics and
                storytelling.
              </p>
              <p>
                For privacy-related requests, contact us through our{" "}
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord server
                </a>
                .
              </p>
            </>
          ),
        },
        {
          title: "Information we collect",
          content: (
            <>
              <p>Depending on how you interact with us, we may collect:</p>
              <ul>
                <li>
                  <strong>Contact and identity details</strong> — such as your
                  name, brand name, email address, Discord username, and
                  business role.
                </li>
                <li>
                  <strong>Project materials</strong> — brand guidelines, product
                  photos, packaging references, mood boards, campaign briefs,
                  and other creative assets you share with us.
                </li>
                <li>
                  <strong>Creator or likeness materials</strong> — reference
                  images, approved model assets, or likeness rights
                  documentation when relevant to a production.
                </li>
                <li>
                  <strong>Communication records</strong> — messages, feedback,
                  approvals, and delivery notes exchanged during a project.
                </li>
                <li>
                  <strong>Technical data</strong> — basic website usage
                  information such as browser type, device type, pages visited,
                  and approximate location derived from IP address, if analytics
                  are enabled.
                </li>
              </ul>
              <p>
                We do not intentionally collect sensitive personal data unless
                you choose to provide it for a specific project and we have a
                clear need to process it.
              </p>
            </>
          ),
        },
        {
          title: "How we use your information",
          content: (
            <>
              <p>We use information to:</p>
              <ul>
                <li>Respond to inquiries and qualify project requests</li>
                <li>
                  Produce, revise, and deliver AI-assisted creative assets
                </li>
                <li>
                  Communicate about timelines, approvals, invoices, and support
                </li>
                <li>
                  Maintain confidentiality and quality control across
                  productions
                </li>
                <li>
                  Improve our studio workflows, website experience, and service
                  offerings
                </li>
                <li>Comply with legal obligations and enforce our Terms</li>
              </ul>
              <p>
                Client project materials are used only to fulfill the agreed
                engagement, unless you give us separate permission for portfolio,
                case study, or marketing use.
              </p>
            </>
          ),
        },
        {
          title: "AI processing and creative assets",
          content: (
            <>
              <p>
                Our services involve AI-assisted generation, compositing, and
                editing. When you provide brand assets, product imagery, or
                creator references, we may process those materials through
                internal tools and carefully selected third-party AI or
                production platforms solely to create deliverables for your
                project.
              </p>
              <p>
                We do not sell your confidential brand assets. We also do not
                use private client materials to publicly train open models or to
                create unrelated commercial work for other clients without your
                permission.
              </p>
              <p>
                Because AI systems may involve external processors, we take
                reasonable steps to choose providers and workflows that support
                confidentiality for commercial creative work. Absolute secrecy
                cannot be guaranteed for every third-party tool, so we discuss
                sensitive productions with clients when needed.
              </p>
            </>
          ),
        },
        {
          title: "Discord and community interactions",
          content: (
            <>
              <p>
                If you join our Discord community, Discord collects and
                processes information under its own privacy policy. Messages you
                send in public channels may be visible to other members.
                Sensitive project details should be shared only through private
                channels or agreed project workflows.
              </p>
            </>
          ),
        },
        {
          title: "Cookies and website analytics",
          content: (
            <>
              <p>
                Our website may use essential cookies required for basic
                functionality and, where enabled, privacy-conscious analytics to
                understand aggregate traffic and improve the site. We do not use
                advertising trackers for behavioral ad targeting on this site.
              </p>
              <p>
                You can control cookies through your browser settings. Blocking
                some cookies may affect site performance.
              </p>
            </>
          ),
        },
        {
          title: "How we share information",
          content: (
            <>
              <p>We may share information with:</p>
              <ul>
                <li>
                  Service providers who help us host the website, process
                  payments, store files, or generate creative assets
                </li>
                <li>
                  Collaborators or contractors working on your project under
                  confidentiality expectations
                </li>
                <li>
                  Professional advisors, or authorities, when required by law or
                  to protect our rights and users
                </li>
              </ul>
              <p>
                We do not sell personal information. Any portfolio or public
                showcase use of client work requires your approval unless
                otherwise agreed in writing.
              </p>
            </>
          ),
        },
        {
          title: "Data retention",
          content: (
            <>
              <p>
                We retain project files, communications, and account details for
                as long as needed to deliver services, maintain business
                records, resolve disputes, and meet legal or accounting
                requirements. When materials are no longer needed, we delete or
                de-identify them within a reasonable period, subject to backup
                and archival systems.
              </p>
              <p>
                You may request deletion of project materials after delivery,
                subject to any retention needed for legal, billing, or
                contractual reasons.
              </p>
            </>
          ),
        },
        {
          title: "Security",
          content: (
            <>
              <p>
                We use reasonable administrative, technical, and organizational
                measures to protect information against unauthorized access,
                loss, or misuse. No method of transmission or storage is
                completely secure, so we cannot guarantee absolute security.
              </p>
            </>
          ),
        },
        {
          title: "Your choices and rights",
          content: (
            <>
              <p>
                Depending on your location, you may have rights to access,
                correct, delete, or restrict certain personal information, or to
                object to particular processing. To make a request, contact us
                via Discord with enough detail for us to verify and respond.
              </p>
              <p>
                If your request relates to assets owned by a brand or employer,
                we may need authorization from the account holder before acting.
              </p>
            </>
          ),
        },
        {
          title: "Children",
          content: (
            <>
              <p>
                Our services are intended for businesses and adults. We do not
                knowingly collect personal information from children under 16.
                If you believe a child has provided us information, contact us
                and we will take appropriate steps to delete it.
              </p>
            </>
          ),
        },
        {
          title: "International transfers",
          content: (
            <>
              <p>
                We operate with collaborators and tools that may process data in
                Pakistan and other countries. Where information is transferred
                across borders, we take steps appropriate to the nature of the
                data and the service providers involved.
              </p>
            </>
          ),
        },
        {
          title: "Changes to this policy",
          content: (
            <>
              <p>
                We may update this Privacy Policy from time to time. The
                effective date above will change when we do. Continued use of
                our website or services after an update means you acknowledge
                the revised policy.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
