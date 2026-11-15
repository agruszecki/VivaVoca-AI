import { cn } from "@/lib/utils";

export default function PageHeader({ eyebrow, title, description, actions, className }) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 font-heading text-[26px] font-extrabold leading-tight tracking-[-0.03em] text-slate-900 sm:text-[32px]">
          {title}
        </h1>
        {description && <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-slate-600">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
