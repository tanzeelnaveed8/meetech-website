"use client";

import { LEGAL_CONTENT } from "./legalContent";
import Image from "next/image";

export default function LegalLayout({ type }: { type: keyof typeof LEGAL_CONTENT }) {
     const doc = LEGAL_CONTENT[type];
     const Icon = doc.icon;

     return (
          <article className="bg-bg-surface rounded-[3rem] border border-border-subtle shadow-2xl overflow-hidden">
               {/* Header */}
               <div className="relative h-64 bg-text-primary p-12 flex flex-col justify-end 
                            before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:to-bg-surface before:rounded-t-[3rem]">
                    <div className="flex items-center gap-4">
                         {Icon && <Icon className="w-10 h-10 text-accent" />}
                         <h2 className="text-5xl font-bold text-blue-800 uppercase tracking-wide">
                              {doc.title}
                         </h2>
                    </div>
                    <p className="text-text-muted mt-4 text-sm">
                         Updated {doc.lastUpdated}
                    </p>
               </div>

               {/* Body */}
               <div className="p-12 space-y-6">
                    <div
                         className="legal-hub-content prose prose-lg prose-headings:text-accent prose-p:text-text-base"
                         dangerouslySetInnerHTML={{ __html: doc.content }}
                    />
               </div>
          </article>
     );
}
