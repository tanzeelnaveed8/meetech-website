
import React from 'react';
import { ScrollText, ShieldCheck, Settings, Info, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';
/**
 * CookiesPage Component for Meetech website.
 * Designed with a focus on enterprise-grade UI/UX, clarity, and accessibility.
 * Uses semantic color variables from the provided global.css.
 */
export default function TermsPage() {
     const termsData = {
          id: "terms-of-service",
          title: "Terms of Service",
          subtitle: "The legal framework for our partnership.",
          icon: FileText,
          lastUpdated: "January 27, 2026",
          content: `
      <h4>Acceptance of Terms</h4>
      <p>By accessing and using Meetech Development website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

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
      <p>Meetech Development liability is limited to the total amount paid for the specific project. We are not liable for:</p>
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
    `};

     return (
          <div className="min-h-screen bg-bg-page transition-colors duration-300">
               {/* Hero Section */}
               <header className="relative py-16 md:py-24 overflow-hidden border-b border-border-subtle bg-bg-subtle/50">
                    <div className="container mx-auto px-page-x relative z-10 max-w-5xl">
                         <div className="flex flex-col md:flex-row md:items-center gap-6">
                              <div className="p-4 rounded-2xl bg-accent-muted inline-flex items-center justify-center">
                                   <ScrollText className="w-10 h-10 lg:w-16 lg:h-16 text-accent" strokeWidth={1.5} />
                              </div>
                              <div>
                                   <h1 className="text-4xl font-bold text-text-primary tracking-tight leading-tight">
                                        {termsData.title}
                                   </h1>
                                   <p className="mt-2 text-subheading text-text-muted max-w-2xl font-medium">
                                        {termsData.subtitle}
                                   </p>
                                   <div className="mt-2 flex items-center gap-2 text-ui text-text-disabled">
                                        <Calendar className="w-4 h-4" />
                                        <span>Last updated: {termsData.lastUpdated}</span>
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Subtle Background Decoration */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-accent-secondary/5 rounded-full blur-3xl pointer-events-none" />
               </header>

               {/* Main Content */}
               <main className="container mx-auto px-page-x py-12 md:py-20 max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                         {/* Sidebar Navigation / Summary Icons */}
                         <aside className="lg:col-span-4 space-y-8">
                              <div className="sticky top-8 space-y-6">
                                   <div className="p-6 rounded-2xl border border-border-default bg-bg-surface shadow-sm">
                                        <h3 className="text-ui font-bold text-text-primary uppercase tracking-wider mb-6">
                                             Key Information
                                        </h3>
                                        <ul className="space-y-6">
                                             <li className="flex gap-4">
                                                  <div className="mt-1 flex-shrink-0">
                                                       <ShieldCheck className="w-5 h-5 text-accent-secondary" />
                                                  </div>
                                                  <div>
                                                       <p className="text-ui font-semibold text-text-primary">Safe Environment</p>
                                                       <p className="text-caption text-text-muted mt-1 leading-relaxed">
                                                            Secure sessions and verified server communication.
                                                       </p>
                                                  </div>
                                             </li>
                                             <li className="flex gap-4">
                                                  <div className="mt-1 flex-shrink-0">
                                                       <Settings className="w-5 h-5 text-accent" />
                                                  </div>
                                                  <div>
                                                       <p className="text-ui font-semibold text-text-primary">User Control</p>
                                                       <p className="text-caption text-text-muted mt-1 leading-relaxed">
                                                            Full transparency on how to manage your data via browser.
                                                       </p>
                                                  </div>
                                             </li>
                                             <li className="flex gap-4">
                                                  <div className="mt-1 flex-shrink-0">
                                                       <Info className="w-5 h-5 text-accent" />
                                                  </div>
                                                  <div>
                                                       <p className="text-ui font-semibold text-text-primary">Policy Clarity</p>
                                                       <p className="text-caption text-text-muted mt-1 leading-relaxed">
                                                            Written for users, not just legal departments.
                                                       </p>
                                                  </div>
                                             </li>
                                        </ul>
                                   </div>


                              </div>
                         </aside>

                         {/* Article Content */}
                         <article className="lg:col-span-8 prose-custom pb-24">
                              <div
                                   className="rich-text-content"
                                   dangerouslySetInnerHTML={{ __html: termsData.content }}
                              />

                              <div className="mt-12 pt-12 border-t border-border-subtle">
                                   <p className="text-caption text-text-muted italic">
                                        By using our website, you agree to our cookie policy as outlined above.
                                        We reserve the right to update this policy periodically to reflect changes in legal or operational requirements.
                                   </p>
                              </div>
                         </article>
                    </div>
               </main>

               {/* Custom Styles for Rendered Content */}
               <style>{`
        .rich-text-content h4 {
          color: var(--text-primary);
          font-family: var(--font-primary);
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          letter-spacing: -0.01em;
        }
        .rich-text-content h4:first-child {
          margin-top: 0;
        }
        .rich-text-content p {
          color: var(--text-body);
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }
        .prose-custom {
          max-width: none;
        }
      `}</style>
          </div>
     );
}