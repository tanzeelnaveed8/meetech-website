"use client";

import { useState } from "react";
import { AccordionItem } from "@/components/ui/AccordionItem";

const LEGAL_SECTIONS = [
  {
    id: "privacy-policy",
    type: "privacy",
    heading: "Privacy Policy",
    lastUpdated: "2026-01-27",
    content: `
      <h4>Last updated: January 27, 2026</h4>

      <h5>Introduction</h5>
      <p>MEETECH Development ("we", "our", "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our website and services.</p>

      <h5>Data Collection</h5>
      <p>We collect the following information when you use our contact form:</p>
      <ul>
        <li>Name and email address</li>
        <li>Project details and messages</li>
        <li>Optional file attachments</li>
        <li>Technical data (IP address, browser type, device information)</li>
      </ul>

      <h5>Data Usage</h5>
      <p>Your information is used solely to:</p>
      <ul>
        <li>Respond to your inquiries and provide project quotes</li>
        <li>Communicate about potential projects and services</li>
        <li>Improve our website and services</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h5>Data Storage and Security</h5>
      <p>Your data is stored securely using industry-standard encryption and security measures. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>

      <h5>Data Sharing</h5>
      <p>We do not sell, trade, or rent your personal information to third parties. We may share your data with:</p>
      <ul>
        <li>Service providers who assist in our operations (under strict confidentiality agreements)</li>
        <li>Legal authorities when required by law</li>
      </ul>

      <h5>Your Rights</h5>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal data</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Opt out of marketing communications</li>
        <li>Lodge a complaint with a supervisory authority</li>
      </ul>

      <h5>Cookies and Tracking</h5>
      <p>We use essential cookies to ensure our website functions properly. We do not use tracking cookies or third-party analytics without your consent.</p>

      <h5>Data Retention</h5>
      <p>We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, typically for the duration of our business relationship and for a reasonable period thereafter for legal and accounting purposes.</p>

      <h5>Contact</h5>
      <p>For privacy concerns or to exercise your rights, contact us at: <a href="mailto:privacy@meetech.dev">privacy@meetech.dev</a></p>
    `,
  },
  {
    id: "terms-of-service",
    type: "terms",
    heading: "Terms of Service",
    lastUpdated: "2026-01-27",
    content: `
      <h4>Last updated: January 27, 2026</h4>

      <h5>Acceptance of Terms</h5>
      <p>By accessing and using MEETECH Development's website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

      <h5>Services</h5>
      <p>We provide professional software development services including:</p>
      <ul>
        <li>Website and web application development</li>
        <li>Mobile application development (iOS and Android)</li>
        <li>E-commerce platform development</li>
        <li>Custom software solutions</li>
        <li>MVP (Minimum Viable Product) development</li>
      </ul>

      <h5>Client Responsibilities</h5>
      <p>Clients agree to:</p>
      <ul>
        <li>Provide accurate and complete project requirements</li>
        <li>Respond to communications in a timely manner</li>
        <li>Provide necessary assets, content, and access credentials</li>
        <li>Review deliverables and provide feedback within agreed timeframes</li>
        <li>Make payments according to the agreed schedule</li>
      </ul>

      <h5>Project Scope and Changes</h5>
      <p>Project scope is defined in individual project agreements. Changes to scope may result in adjusted timelines and costs. All scope changes must be documented and agreed upon in writing.</p>

      <h5>Payment Terms</h5>
      <p>Payment terms are specified in individual project agreements. Typical payment structures include:</p>
      <ul>
        <li>Milestone-based payments</li>
        <li>Upfront deposit (typically 30-50%)</li>
        <li>Final payment upon project completion</li>
      </ul>
      <p>Late payments may result in project suspension and interest charges.</p>

      <h5>Intellectual Property</h5>
      <p>Upon full payment, all custom work products and deliverables become the property of the client. We retain the right to:</p>
      <ul>
        <li>Use the project in our portfolio (with client permission)</li>
        <li>Reuse general knowledge, techniques, and methodologies</li>
        <li>Retain ownership of pre-existing intellectual property and tools</li>
      </ul>

      <h5>Warranties and Disclaimers</h5>
      <p>We warrant that our services will be performed in a professional and workmanlike manner. However, we do not guarantee:</p>
      <ul>
        <li>Uninterrupted or error-free operation of delivered software</li>
        <li>Specific business results or outcomes</li>
        <li>Compatibility with all third-party services or platforms</li>
      </ul>

      <h5>Limitation of Liability</h5>
      <p>MEETECH Development's liability is limited to the total amount paid for the specific project. We are not liable for:</p>
      <ul>
        <li>Indirect, incidental, or consequential damages</li>
        <li>Loss of profits, data, or business opportunities</li>
        <li>Third-party claims or damages</li>
      </ul>

      <h5>Confidentiality</h5>
      <p>We maintain strict confidentiality of all client information and project details. Both parties agree not to disclose confidential information without prior written consent.</p>

      <h5>Termination</h5>
      <p>Either party may terminate a project agreement with written notice. Upon termination:</p>
      <ul>
        <li>Client pays for work completed to date</li>
        <li>We deliver all completed work products</li>
        <li>Confidentiality obligations continue</li>
      </ul>

      <h5>Governing Law</h5>
      <p>These terms are governed by the laws of the United Arab Emirates. Any disputes will be resolved through arbitration in Dubai.</p>

      <h5>Changes to Terms</h5>
      <p>We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date.</p>

      <h5>Contact</h5>
      <p>For questions about these terms, contact us at: <a href="mailto:legal@meetech.dev">legal@meetech.dev</a></p>
    `,
  },
] as const;

export function LegalAccordion() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section
      aria-labelledby="legal-sections-heading"
      className="border-t border-border-default py-16 md:py-20"
    >
      <h2 id="legal-sections-heading" className="sr-only">
        Legal Sections
      </h2>

      <div className="space-y-4">
        {LEGAL_SECTIONS.map((section) => (
          <AccordionItem
            key={section.id}
            id={section.id}
            heading={section.heading}
            content={section.content}
            isExpanded={expandedId === section.id}
            onToggle={toggleAccordion}
          />
        ))}
      </div>
    </section>
  );
}
