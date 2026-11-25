import React from "react";

/** Multifoil arch edge, drawn in a 619 x 318 box taken from the approved reference proportions. */
const EDGE =
  "M158 0C134 4 116 15 112 36C80 31 53 53 57 84C35 95 33 126 40 139C37 157 23 166 6 173C22 181 37 192 39 207C35 238 50 263 68 272C68 292 84 310 106 318";

/**
 * Clips its children to the arch and lays metallic gold strokes along the edge.
 * Strokes use non-scaling-stroke so they stay crisp and even at every width.
 */
export function GoldenIslamicArch({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <clipPath id="hero-arch-clip" clipPathUnits="objectBoundingBox">
          <path d={`${EDGE}L619 318L619 0Z`} transform="scale(0.00161551 0.00314465)" />
        </clipPath>
      </svg>

      <div className="absolute inset-0" style={{ clipPath: "url(#hero-arch-clip)" }}>
        {children}
      </div>

      <svg viewBox="0 0 619 318" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" fill="none" aria-hidden>
        <defs>
          <linearGradient id="arch-gold" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="120" y2="318">
            <stop offset="0" stopColor="#8C5A0A" />
            <stop offset="0.18" stopColor="#E9BC52" />
            <stop offset="0.3" stopColor="#FFF2C2" />
            <stop offset="0.5" stopColor="#C69532" />
            <stop offset="0.66" stopColor="#F6D77A" />
            <stop offset="0.82" stopColor="#B47B19" />
            <stop offset="1" stopColor="#E9BC52" />
          </linearGradient>
        </defs>
        <path d={EDGE} stroke="#001c13" strokeOpacity="0.55" strokeWidth="16" transform="translate(-4 0)" vectorEffect="non-scaling-stroke" style={{ filter: "blur(3px)" }} />
        <path d={EDGE} stroke="#5c3a06" strokeWidth="9" vectorEffect="non-scaling-stroke" />
        <path d={EDGE} stroke="url(#arch-gold)" strokeWidth="6" vectorEffect="non-scaling-stroke" />
        <path d={EDGE} stroke="#FFF2C2" strokeOpacity="0.9" strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
        <path d={EDGE} stroke="url(#arch-gold)" strokeWidth="1.6" transform="translate(10 0)" vectorEffect="non-scaling-stroke" />
        <path d={EDGE} stroke="url(#arch-gold)" strokeOpacity="0.55" strokeWidth="1" transform="translate(-11 0)" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
