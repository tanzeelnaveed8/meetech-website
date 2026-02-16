/**
 * Technology icons for Web Development Technologies section.
 * Uses Simple Icons CDN (cdn.simpleicons.org) for most logos;
 * inline SVGs for CSS3 (fixed) and JavaScript (professional variant).
 */

export type TechItem = {
  name: string;
  slug: string;
  color: string;
  customIcon?: "css3" | "javascript";
};

export const TECH_ITEMS: TechItem[] = [
  { name: "HTML 5", slug: "html5", color: "E34F26" },
  { name: "Angular", slug: "angular", color: "DD0031" },
  { name: "Vue Js", slug: "vuedotjs", color: "4FC08D" },
  { name: "Php", slug: "php", color: "777BB4" },
  { name: "Laravel", slug: "laravel", color: "FF2D20" },
  { name: "MySQL", slug: "mysql", color: "4479A1" },
  { name: "JavaScript", slug: "javascript", color: "F7DF1E", customIcon: "javascript" },
  { name: "CSS 3", slug: "css3", color: "1572B6", customIcon: "css3" },
  { name: "Node Js", slug: "nodedotjs", color: "339933" },
  { name: "React Js", slug: "react", color: "61DAFB" },
  { name: "Ruby On Rails", slug: "rubyonrails", color: "CC0000" },
  { name: "MongoDB", slug: "mongodb", color: "47A248" },
  { name: "BootStrap", slug: "bootstrap", color: "7952B3" },
  { name: "Next.Js", slug: "nextdotjs", color: "000000" },
];

function CSS3Icon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 md:h-11 md:w-11"
      aria-hidden
    >
      <path
        d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"
        fill="#1572B6"
      />
    </svg>
  );
}

function JavaScriptIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 md:h-11 md:w-11"
      aria-hidden
    >
      <rect width="24" height="24" rx="5" fill="#323330" />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fill="#F7F7F7"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="10"
        fontWeight="700"
      >
        JS
      </text>
    </svg>
  );
}

function IconBox({ name, slug, color, customIcon }: TechItem) {
  const useCdn = !customIcon;
  const src = useCdn ? `https://cdn.simpleicons.org/${slug}/${color}` : "";

  return (
    <div
      className="group flex cursor-default flex-col items-center gap-3 rounded-2xl p-3 transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-xl md:p-4"
      style={{
        fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-bg-subtle transition-all duration-200 ease-out group-hover:bg-bg-surface group-hover:shadow-lg group-hover:ring-1 group-hover:ring-border-default md:h-20 md:w-20">
        {customIcon === "css3" && <CSS3Icon />}
        {customIcon === "javascript" && <JavaScriptIcon />}
        {useCdn && (
          <img
            src={src}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            className="h-10 w-10 object-contain md:h-11 md:w-11"
          />
        )}
      </div>
      <span className="text-center font-medium text-[0.9375rem] text-text-primary">
        {name}
      </span>
    </div>
  );
}

export { IconBox };
