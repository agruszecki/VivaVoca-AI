import { cn } from "@/lib/utils";

export default function VoiceOrb({ speaking, listening, size = "lg" }) {
  const dimensions = size === "lg" ? "h-32 w-32" : "h-20 w-20";
  const core = size === "lg" ? "h-16 w-16" : "h-11 w-11";

  return (
    <div className={cn("relative flex items-center justify-center", dimensions)}>
      <span
        className={cn(
          "absolute inset-0 rounded-full brand-gradient blur-md transition-opacity duration-500",
          speaking ? "animate-orb opacity-80" : listening ? "opacity-40" : "opacity-20",
        )}
      />
      <span
        className={cn(
          "absolute inset-2 rounded-full border transition-colors duration-500",
          speaking ? "border-white/70" : "border-white/40",
        )}
      />
      <span
        className={cn(
          "relative flex items-center justify-center rounded-full bg-white shadow-soft transition-transform duration-500",
          core,
          speaking && "scale-105",
        )}
      >
        <span className={cn("h-2.5 w-2.5 rounded-full", speaking ? "bg-secondary" : "bg-primary/70")} />
      </span>
    </div>
  );
}
