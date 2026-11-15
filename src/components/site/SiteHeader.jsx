import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Logo from "@/components/app/Logo";
import { Button } from "@/components/ui/button";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#how" className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground">
            How it works
          </a>
          <Link to="/dashboard" className="text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden rounded-full px-4 text-[13px] font-semibold sm:inline-flex">
            <Link to="/dashboard">Open app</Link>
          </Button>
          <Button asChild className="rounded-full px-4 text-[13px] font-semibold shadow-soft">
            <Link to="/materials">
              Upload notes
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
