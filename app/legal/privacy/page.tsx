
import React from 'react';
import { Lock, ShieldCheck, Settings, Info, Calendar } from 'lucide-react';
import Link from 'next/link';
/**
 * CookiesPage Component for Meetech website.
 * Designed with a focus on enterprise-grade UI/UX, clarity, and accessibility.
 * Uses semantic color variables from the provided global.css.
 */
export default function PrivacyPage() {
     const cookieData = {
          id: "privacy-policy",
          title: "Privacy Policy",
          subtitle: "How we handle and protect your digital footprint.",
          icon: ShieldCheck,
          lastUpdated: "January 27, 2026",
          content: `
      <h4>Introduction</h4>
      <p>Meetech Development ("we", "our", "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our website and services.</p>

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
     };

     return (
          <div className="min-h-screen bg-bg-page transition-colors duration-300">
               {/* Hero Section */}
               <header className="relative py-16 md:py-24 overflow-hidden border-b border-border-subtle bg-bg-subtle/50">
                    <div className="container mx-auto px-page-x relative z-10 max-w-5xl">
                         <div className="flex flex-col md:flex-row md:items-center gap-6">
                              <div className="p-4 rounded-2xl bg-accent-muted inline-flex items-center justify-center">
                                   <Lock className="w-10 h-10 lg:w-16 lg:h-16 text-accent" strokeWidth={1.5} />
                              </div>
                              <div>
                                   <h1 className="text-4xl font-bold text-text-primary tracking-tight leading-tight">
                                        {cookieData.title}
                                   </h1>
                                   <p className="mt-2 text-subheading text-text-muted max-w-2xl font-medium">
                                        {cookieData.subtitle}
                                   </p>
                                   <div className="mt-2 flex items-center gap-2 text-ui text-text-disabled">
                                        <Calendar className="w-4 h-4" />
                                        <span>Last updated: {cookieData.lastUpdated}</span>
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
                                   dangerouslySetInnerHTML={{ __html: cookieData.content }}
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