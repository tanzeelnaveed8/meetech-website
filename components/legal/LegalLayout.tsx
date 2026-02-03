// components/legal/LegalLayout.tsx
"use client";

import { LEGAL_CONTENT } from "./legalContent";

export default function LegalLayout({ type }: { type: keyof typeof LEGAL_CONTENT }) {
     const doc = LEGAL_CONTENT[type];
     const Icon = doc.icon;

     return (
          <article className="bg-bg-surface rounded-[3rem] border border-border-subtle shadow-2xl overflow-hidden">
               {/* Header */}
               <div className="relative h-64 bg-text-primary p-12 flex flex-col justify-end">
                    <h2 className="text-5xl font-bold text-accent uppercase">
                         {doc.title}
                    </h2>
                    <p className="text-text-muted mt-4">
                         Updated {doc.lastUpdated}
                    </p>
               </div>

               {/* Body */}
               <div className="p-12">
                    <div
                         className="legal-hub-content"
                         dangerouslySetInnerHTML={{ __html: doc.content }}
                    />
               </div>
          </article>
     );
}
