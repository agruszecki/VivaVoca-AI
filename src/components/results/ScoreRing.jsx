export default function ScoreRing({ score = 0, label = "Overall score", size = 132 }) {
  const value = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);

  return (
    <div className="flex items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id="score-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(221 83% 53%)" />
              <stop offset="55%" stopColor="hsl(262 83% 58%)" />
              <stop offset="100%" stopColor="hsl(189 94% 43%)" />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="hsl(220 22% 93%)" strokeWidth={stroke} fill="none" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#score-ring-gradient)"
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-[26px] font-extrabold leading-none tracking-tight text-slate-900">{value}</span>
          <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div>
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="mt-1 font-heading text-[14px] font-bold tracking-tight text-slate-900">
          {value >= 85 ? "Viva ready" : value >= 70 ? "Almost there" : value >= 50 ? "Needs another pass" : "Not yet — keep going"}
        </p>
        <p className="mt-1 max-w-[190px] text-[11.5px] leading-relaxed text-muted-foreground">
          Scored on how precisely you answered against your own notes.
        </p>
      </div>
    </div>
  );
}
