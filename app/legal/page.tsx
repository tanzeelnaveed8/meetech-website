"use client";

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  FileText,
  Cookie,
  ArrowLeft,
  Printer,
  Mail,
  Scale,
  Clock,
  ChevronRight,
  Download,
  Share2,
  ExternalLink,
  Lock,
  CheckCircle2,
  Info
} from 'lucide-react';

const LEGAL_CONTENT = {
  privacy: {
    id: "privacy-policy",
    title: "Privacy Policy",
    subtitle: "How we handle and protect your digital footprint.",
    icon: ShieldCheck,
    lastUpdated: "January 27, 2026",
    content: `
      <h4>Introduction</h4>
      <p>MEETECH Development ("we", "our", "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our website and services.</p>

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
      <p>For privacy concerns or to exercise your rights, contact us at: <a href="mailto:privacy@meetech.dev">privacy@meetech.dev</a></p>
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
      <p>By accessing and using MEETECH Development's website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

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
      <p>MEETECH Development's liability is limited to the total amount paid for the specific project. We are not liable for:</p>
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
      <p>For questions about these terms, contact us at: <a href="mailto:legal@meetech.dev">legal@meetech.dev</a></p>
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
      <p>MEETECH uses cookies to improve your experience on our website. Cookies are small text files stored on your device that help us provide a secure and functional environment.</p>
      
      <h4>Technical Necessity</h4>
      <p>We use essential cookies to maintain secure sessions and load-balancing across our global server nodes. These are strictly necessary for the website to function.</p>
      
      <h4>Management</h4>
      <p>You can manage cookie preferences through your browser settings. However, disabling essential cookies may affect the availability of certain features on our site.</p>
    `
  }
};

type LegalTab = keyof typeof LEGAL_CONTENT;

export default function App() {
  const [activeTab, setActiveTab] = useState<LegalTab>('privacy');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentDoc = LEGAL_CONTENT[activeTab];

  return (
    <div className="min-h-screen bg-bg-page text-text-body font-sans selection:bg-accent/10 selection:text-accent">
      

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-8 sticky top-32">
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-4 px-2">
                Core Documents
              </p>
              {Object.entries(LEGAL_CONTENT).map(([key, doc]) => {
                const Icon = doc.icon;
                const isActive = activeTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as LegalTab)}
                    className={`w-full group flex items-start gap-4 p-4 rounded-2xl transition-all relative overflow-hidden ${isActive
                        ? 'bg-bg-surface shadow-xl border border-border-subtle shadow-accent/5'
                        : 'hover:bg-bg-subtle border border-transparent'
                      }`}
                  >
                    {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-accent rounded-r-full" />}
                    <div className={`mt-1 p-2 rounded-lg transition-colors ${isActive ? 'bg-accent text-text-inverse' : 'bg-bg-subtle text-text-muted group-hover:text-accent'
                      }`}>
                      <Icon size={18} />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-bold tracking-tight ${isActive ? 'text-text-primary' : 'text-text-muted'}`}>
                        {doc.title}
                      </p>
                      <p className="text-[10px] font-medium text-text-muted mt-0.5 line-clamp-1">
                        {doc.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Verification Badge */}
            <div className="p-6 rounded-[2rem] bg-text-primary text-text-inverse relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Lock size={80} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-accent mb-4">
                  <CheckCircle2 size={20} />
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest">Enterprise Ready</span>
                </div>
                <h4 className="font-bold text-sm mb-2 text-accent">GDPR & UAE Data Compliant</h4>
                <p className="text-[11px] text-text-muted leading-relaxed mb-6">
                  MEETECH strictly adheres to international data protection frameworks for our global client base.
                </p>
                <button className="w-full py-3 bg-accent hover:bg-accent-hover rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                  Verify Credentials
                </button>
              </div>
            </div>
          </aside>

          {/* Document Display Area */}
          <article className="lg:col-span-9 bg-bg-surface rounded-[3rem] border border-border-subtle shadow-2xl shadow-accent/5 overflow-hidden">
            {/* Document Header */}
            <div className="relative h-64 bg-text-primary p-12 lg:p-16 flex flex-col justify-end overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/20 to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-accent mb-6">
                  <div className="h-[1px] w-8 bg-accent" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Official Publication</span>
                </div>
                <h2 className="font-bold text-4xl lg:text-6xl text-accent uppercase leading-none">
                  {currentDoc.title}
                </h2>
                <div className="flex items-center gap-6 mt-8">
                  <div className="flex items-center gap-2 text-text-muted">
                    <Clock size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Updated {currentDoc.lastUpdated}</span>
                  </div>
                  <div className="h-1 w-1 rounded-full bg-border-strong" />
                  <div className="flex items-center gap-2 text-text-muted">
                    <Info size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">v2.4.0-Stable</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Body */}
            <div className="p-12 lg:p-16 ">
              <div
                className="legal-hub-content"
                dangerouslySetInnerHTML={{ __html: currentDoc.content }}
              />

              {/* Action Bar Footer */}
              <div className="mt-20 pt-12 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-accent uppercase tracking-widest">Questions?</span>
                  <p className="text-sm font-bold text-text-primary">Contact our legal department</p>
                </div>
                <div className="flex items-center gap-4">
                  <a href="mailto:legal@meetech.dev" className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-bg-subtle hover:bg-border-subtle text-text-primary font-bold text-xs transition-all">
                    <Mail size={16} /> Email Legal
                  </a>
                  <button className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-accent text-text-inverse font-bold text-xs shadow-lg shadow-accent/30 hover:scale-105 transition-all active:scale-95">
                    <Download size={16} /> Download PDF
                  </button>
                </div>
              </div>
            </div>
          </article>

        </div>
      </main>

   

      <style jsx global>{`
        .legal-hub-content h4 {
          font-weight: 800;
          font-size: 1.75rem;
          color: var(--text-primary);
          margin-top: 4rem;
          margin-bottom: 1.5rem;
          letter-spacing: -0.03em;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .legal-hub-content h4::before {
          content: "";
          width: 32px;
          height: 4px;
          background: var(--accent-primary);
          border-radius: 99px;
          display: inline-block;
        }
        .legal-hub-content p {
          color: var(--text-body);
          font-size: 1.125rem;
          line-height: 1.85;
          margin-bottom: 1.5rem;
          font-weight: 400;
        }
        .legal-hub-content ul {
          margin: 2rem 0;
          display: grid;
          gap: 1rem;
          padding-left: 0;
        }
        .legal-hub-content li {
          list-style: none;
          padding: 1rem 1.5rem;
          background: var(--bg-subtle);
          border-radius: 1rem;
          color: var(--text-primary);
          font-size: 1rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1px solid var(--border-subtle);
          transition: all 0.2s ease;
        }
        .legal-hub-content li:hover {
          border-color: var(--accent-primary);
          background: var(--bg-surface);
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .legal-hub-content li::before {
          content: "→";
          color: var(--accent-primary);
          font-weight: 900;
        }
        .legal-hub-content a {
          color: var(--accent-primary);
          font-weight: 700;
          text-decoration: none;
          box-shadow: inset 0 -2px 0 var(--accent-muted);
          transition: box-shadow 0.2s;
        }
        .legal-hub-content a:hover {
          box-shadow: inset 0 -4px 0 var(--accent-muted);
        }

        @media print {
          header, aside, footer, button, .action-bar-footer { display: none !important; }
          main { padding-top: 0 !important; }
          article { border: none !important; box-shadow: none !important; width: 100% !important; }
          .lg\:col-span-9 { grid-column: span 12 / span 12 !important; }
          .h-64 { height: auto !important; background: white !important; padding: 0 !important; color: black !important; }
          .h-64 h2 { color: black !important; font-size: 24pt !important; }
          .legal-hub-content p, .legal-hub-content li { font-size: 11pt !important; }
        }
      `}</style>
    </div>
  );
}