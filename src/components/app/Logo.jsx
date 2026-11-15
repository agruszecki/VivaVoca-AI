import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Logo({ to = "/", compact = false, className }) {
  const content = (
    <span className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="brand-gradient flex h-9 w-9 items-center justify-center rounded-xl shadow-soft">
        <Sparkles className="h-[18px] w-[18px] text-white" strokeWidth={2.2} />
      </span>
      {!compact && (
        <span className="font-heading text-[17px] font-extrabold tracking-tight text-foreground">
          Viva<span className="brand-text-gradient">AI</span>
        </span>
      )}
    </span>
  );

  if (!to) return content;
  return <Link to={to}>{content}</Link>;
}
