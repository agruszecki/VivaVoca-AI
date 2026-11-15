import { Link } from "react-router-dom";
import { ArrowRight, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CtaBand() {
  return (
    <section className="px-5 pb-20">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-slate-900 px-6 py-14 sm:px-12 sm:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 20%, rgba(37,99,235,0.55), transparent 45%), radial-gradient(circle at 88% 80%, rgba(124,58,237,0.45), transparent 50%), radial-gradient(circle at 60% 10%, rgba(6,182,212,0.30), transparent 40%)",
          }}
          aria-hidden
        />
        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/60">Ready when you are</p>
            <h2 className="mt-4 font-heading text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-white sm:text-[36px]">
              The first question is the hardest. Practise it tonight.
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-white/70">
              Your notes are already enough. Upload one lecture and hear what a real examiner would ask.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full bg-white px-6 text-sm font-semibold text-slate-900 hover:bg-white/90">
              <Link to="/materials">
                Upload notes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/25 bg-white/5 px-6 text-sm font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              <Link to="/exam">
                <Mic className="mr-2 h-4 w-4" />
                Start a viva
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
