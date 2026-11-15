import { Link } from "react-router-dom";
import Logo from "@/components/app/Logo";

const links = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Materials", to: "/materials" },
  { label: "Voice exam", to: "/exam" },
  { label: "Results", to: "/results" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">
            Oral exam training built on your own course notes. Speak, get questioned, and walk in knowing you can answer.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-border/60 px-5 py-6 text-[11px] font-mono uppercase tracking-[0.16em] text-muted-foreground md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} VivaAI</span>
        <span>Voice by ElevenLabs</span>
      </div>
    </footer>
  );
}
