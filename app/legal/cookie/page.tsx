
import React from 'react';
import { Cookie, ShieldCheck, Settings, Info, Calendar } from 'lucide-react';
import Link from 'next/link';
/**
 * CookiesPage Component for Meetech website.
 * Designed with a focus on enterprise-grade UI/UX, clarity, and accessibility.
 * Uses semantic color variables from the provided global.css.
 */
export default function CookiesPage() {
     const cookieData = {
          id: "cookie-policy",
          title: "Cookie Policy",
          subtitle: "Our use of storage technologies.",
          icon: Cookie,
          lastUpdated: "January 27, 2026",
          content: `
      <h4>Cookie Usage</h4>
      <p>Meetech Development uses cookies to improve your experience on our website. Cookies are small text files stored on your device that help us provide a secure and functional environment.</p>
      
      <h4>Technical Necessity</h4>
      <p>We use essential cookies to maintain secure sessions and load-balancing across our global server nodes. These are strictly necessary for the website to function.</p>
      
      <h4>Management</h4>
      <p>You can manage cookie preferences through your browser settings. However, disabling essential cookies may affect the availability of certain features on our site.</p>
    `
     };

     return (
          <div className="min-h-screen bg-bg-page transition-colors duration-300">
               {/* Hero Section */}
               <header className="relative py-16 md:py-24 overflow-hidden border-b border-border-subtle bg-bg-subtle/50">
                    <div className="container mx-auto px-page-x relative z-10 max-w-5xl">
                         <div className="flex flex-col md:flex-row md:items-center gap-6">
                              <div className="p-4 rounded-2xl bg-accent-muted inline-flex items-center justify-center">
                                   <Cookie className="w-10 h-10 lg:w-16 lg:h-16 text-accent" strokeWidth={1.5} />
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

                                   <div className="p-6 rounded-2xl bg-accent p-8 text-text-inverse overflow-hidden relative group">
                                        <div className="relative z-10">
                                             <h4 className="font-bold text-subheading mb-2">Need Help?</h4>
                                             <p className="text-ui opacity-90 mb-4">Questions about your privacy at Meetech Development?</p>
                                             <Link
                                                  href="/legal/policy" className="px-5 py-2.5 bg-text-inverse text-accent font-semibold rounded-lg text-ui hover:bg-opacity-90 transition-all active:scale-95">
                                                  Read  Privacy Policy
                                             </Link>
                                        </div>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-500" />
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