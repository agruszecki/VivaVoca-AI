import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductVisual from "./ProductVisual";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 12%, rgba(37,99,235,0.10), transparent 45%), radial-gradient(circle at 82% 8%, rgba(124,58,237,0.10), transparent 42%), radial-gradient(circle at 60% 78%, rgba(6,182,212,0.08), transparent 45%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(15,23,42,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.045) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black 10%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 0%, black 10%, transparent 72%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-28 lg:pt-24">
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 shadow-soft backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-secondary" />
            <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-slate-600">
              Voice-first oral exam training
            </span>
          </span>

          <h1 className="mt-6 font-heading text-[40px] font-extrabold leading-[1.03] tracking-[-0.035em] text-slate-900 sm:text-[54px] lg:text-[62px]">
            Walk into your{" "}
            <span className="font-display text-[1.12em] font-normal italic brand-text-gradient">viva</span>{" "}
            actually able to answer.
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-slate-600 sm:text-base">
            Upload your lecture notes. VivaAI reads them, finds the 5–7 topics your exam will really test, then sits you
            down for a spoken oral exam — one question at a time, on your own material, with no easy way out.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="rounded-full px-6 text-sm font-semibold shadow-lift">
              <Link to="/materials">
                Upload your notes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-border bg-white px-6 text-sm font-semibold">
              <Link to="/results">See a sample report</Link>
            </Button>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            {["PDF · DOCX · PPTX · TXT · RTF", "Speaks & listens in real time", "Scored on your own topics"].map((item) => (
              <span key={item} className="flex items-center gap-2 text-[11.5px] font-medium text-slate-500">
                <span className="h-1 w-1 rounded-full bg-accent" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="animate-rise [animation-delay:120ms] lg:pl-4">
          <ProductVisual />
        </div>
      </div>
    </section>
  );
}
