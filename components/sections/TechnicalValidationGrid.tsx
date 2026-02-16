
import React from 'react'
import { ArrowRight, Globe, Shield, Zap, Server, ChevronRight } from 'lucide-react';

const TechnicalValidationGrid = () => {
  return (
       <div className="pt-16 mt-16 border-t border-border-subtle grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
                 { icon: <Shield />, label: "Security", val: "Enterprise-Grade" },
                 { icon: <Zap />, label: "Performance", val: "Ultra-Low Latency" },
                 { icon: <Server />, label: "Infra", val: "Global Architecture" },
                 { icon: <Globe />, label: "Compliance", val: "US / MENA Standards" }
            ].map((item, idx) => (
                 <div
                      key={idx}
                      className="flex flex-col items-center text-center"
                 >
                      <div className="mb-5 p-4 rounded-2xl bg-accent-muted text-accent transition-colors duration-200 hover:bg-accent hover:text-text-inverse">
                           {React.cloneElement(item.icon, { size: 22 })}
                      </div>

                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1.5">
                           {item.label}
                      </span>

                      <span className="text-xs font-bold text-text-primary">
                           {item.val}
                      </span>
                 </div>
            ))}
       </div>
  )
}

export default TechnicalValidationGrid

