// components/legal/legalContent.ts
import { ShieldCheck, FileText, Cookie } from "lucide-react";

export const LEGAL_CONTENT = {
  privacy: {
    id: "privacy-policy",
    title: "Privacy Policy",
    subtitle: "How we handle and protect your digital footprint.",
    icon: ShieldCheck,
    lastUpdated: "January 27, 2026",
    content: `
      <h4>Introduction</h4>
      <p>MEETECH LABs ("we", "our", "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our website and services.</p>

      <h4>Data Collection</h4>
      <p>We collect the following information when you use our contact form:</p>
      <ul>
        <li>Name and email address</li>
        <li>Project details and messages</li>
        <li>Optional file attachments</li>
        <li>Technical data (IP address, browser type, device information)</li>
      </ul>

      <h4>Data Usage</h4>
      <p>Your information is used solely to:</p>
      <ul>
        <li>Respond to your inquiries and provide project quotes</li>
        <li>Communicate about potential projects and services</li>
        <li>Improve our website and services</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h4>Data Storage and Security</h4>
      <p>Your data is stored securely using industry-standard encryption and security measures. We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>

      <h4>Data Sharing</h4>
      <p>We do not sell, trade, or rent your personal information to third parties. We may share your data with:</p>
      <ul>
        <li>Service providers who assist in our operations (under strict confidentiality agreements)</li>
        <li>Legal authorities when required by law</li>
      </ul>

      <h4>Your Rights</h4>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal data</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Opt out of marketing communications</li>
        <li>Lodge a complaint with a supervisory authority</li>
      </ul>

      <h4>Cookies and Tracking</h4>
      <p>We use essential cookies to ensure our website functions properly. We do not use tracking cookies or third-party analytics without your consent.</p>

      <h4>Data Retention</h4>
      <p>We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, typically for the duration of our business relationship and for a reasonable period thereafter for legal and accounting purposes.</p>

      <h4>Contact</h4>
      <p>For privacy concerns or to exercise your rights, contact us at: <a href="mailto:meetechdevelopment@gmail.com">meetechdevelopment@gmail.com</a></p>
    `
  },
  terms: {
    id: "terms-of-service",
    title: "Terms of Service",
    subtitle: "The legal framework for our partnership.",
    icon: FileText,
    lastUpdated: "January 27, 2026",
    content: `
      <h4>Acceptance of Terms</h4>
      <p>By accessing and using MEETECH LABs website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

      <h4>Services</h4>
      <p>We provide professional software development services including:</p>
      <ul>
        <li>Website and web application development</li>
        <li>Mobile application development (iOS and Android)</li>
        <li>E-commerce platform development</li>
        <li>Custom software solutions</li>
        <li>MVP (Minimum Viable Product) development</li>
      </ul>

      <h4>Client Responsibilities</h4>
      <p>Clients agree to:</p>
      <ul>
        <li>Provide accurate and complete project requirements</li>
        <li>Respond to communications in a timely manner</li>
        <li>Provide necessary assets, content, and access credentials</li>
        <li>Review deliverables and provide feedback within agreed timeframes</li>
        <li>Make payments according to the agreed schedule</li>
      </ul>

      <h4>Project Scope and Changes</h4>
      <p>Project scope is defined in individual project agreements. Changes to scope may result in adjusted timelines and costs. All scope changes must be documented and agreed upon in writing.</p>

      <h4>Payment Terms</h4>
      <p>Payment terms are specified in individual project agreements. Typical payment structures include:</p>
      <ul>
        <li>Milestone-based payments</li>
        <li>Upfront deposit (typically 30-50%)</li>
        <li>Final payment upon project completion</li>
      </ul>
      <p>Late payments may result in project suspension and interest charges.</p>

      <h4>Intellectual Property</h4>
      <p>Upon full payment, all custom work products and deliverables become the property of the client. We retain the right to:</p>
      <ul>
        <li>Use the project in our portfolio (with client permission)</li>
        <li>Reuse general knowledge, techniques, and methodologies</li>
        <li>Retain ownership of pre-existing intellectual property and tools</li>
      </ul>

      <h4>Warranties and Disclaimers</h4>
      <p>We warrant that our services will be performed in a professional and workmanlike manner. However, we do not guarantee:</p>
      <ul>
        <li>Uninterrupted or error-free operation of delivered software</li>
        <li>Specific business results or outcomes</li>
        <li>Compatibility with all third-party services or platforms</li>
      </ul>

      <h4>Limitation of Liability</h4>
      <p>MEETECH LABs liability is limited to the total amount paid for the specific project. We are not liable for:</p>
      <ul>
        <li>Indirect, incidental, or consequential damages</li>
        <li>Loss of profits, data, or business opportunities</li>
        <li>Third-party claims or damages</li>
      </ul>

      <h4>Confidentiality</h4>
      <p>We maintain strict confidentiality of all client information and project details. Both parties agree not to disclose confidential information without prior written consent.</p>

      <h4>Termination</h4>
      <p>Either party may terminate a project agreement with written notice. Upon termination:</p>
      <ul>
        <li>Client pays for work completed to date</li>
        <li>We deliver all completed work products</li>
        <li>Confidentiality obligations continue</li>
      </ul>

      <h4>Governing Law</h4>
      <p>These terms are governed by the laws of the United Arab Emirates. Any disputes will be resolved through arbitration in Dubai.</p>

      <h4>Changes to Terms</h4>
      <p>We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date.</p>

      <h4>Contact</h4>
      <p>For questions about these terms, contact us at: <a href="mailto:meetechdevelopment@gmail.com">meetechdevelopment@gmail.com</a></p>
    `
  },
  cookies: {
    id: "cookie-policy",
    title: "Cookie Policy",
    subtitle: "Our use of storage technologies.",
    icon: Cookie,
    lastUpdated: "January 27, 2026",
    content: `
      <h4>Cookie Usage</h4>
      <p>MEETECH LABs uses cookies to improve your experience on our website. Cookies are small text files stored on your device that help us provide a secure and functional environment.</p>
      
      <h4>Technical Necessity</h4>
      <p>We use essential cookies to maintain secure sessions and load-balancing across our global server nodes. These are strictly necessary for the website to function.</p>
      
      <h4>Management</h4>
      <p>You can manage cookie preferences through your browser settings. However, disabling essential cookies may affect the availability of certain features on our site.</p>
    `
  }
} as const;