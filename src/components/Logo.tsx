import Link from "next/link";

// The Seagrass logo — each letter alternates between brand blue and green,
// matching the actual storefront branding. "BOUTIQUE" sits below in green.
const letters = [
  { char: "S", color: "text-brand-blue" },
  { char: "E", color: "text-brand-green" },
  { char: "A", color: "text-brand-blue" },
  { char: "G", color: "text-brand-green" },
  { char: "R", color: "text-brand-blue" },
  { char: "A", color: "text-brand-green" },
  { char: "S", color: "text-brand-blue" },
  { char: "S", color: "text-brand-green" },
];

interface LogoProps {
  size?: "sm" | "md" | "lg";
  light?: boolean;
}

export function Logo({ size = "md", light = false }: LogoProps) {
  const sizeClasses = {
    sm: { heading: "text-[18px]", sub: "text-[8px] tracking-[0.35em]" },
    md: { heading: "text-[22px] sm:text-[26px]", sub: "text-[9px] sm:text-[10px] tracking-[0.4em]" },
    lg: { heading: "text-[28px] sm:text-[34px]", sub: "text-[10px] sm:text-[12px] tracking-[0.4em]" },
  };

  const s = sizeClasses[size];

  return (
    <Link href="/" className="flex flex-col items-center group">
      <span className={`font-serif ${s.heading} tracking-[0.12em] leading-none`}>
        {letters.map((l, i) => (
          <span
            key={i}
            className={`${light ? "text-white/90 group-hover:text-white" : l.color} transition-colors duration-300 inline-block`}
            style={light ? undefined : { color: l.color === "text-brand-blue" ? "var(--sg-brand-blue)" : "var(--sg-brand-green)" }}
          >
            {l.char}
          </span>
        ))}
      </span>
      <span
        className={`${s.sub} uppercase -mt-0.5 transition-colors duration-300 ${
          light ? "text-white/40" : "text-brand-green/60"
        }`}
        style={light ? undefined : { color: "var(--sg-brand-green)", opacity: 0.7 }}
      >
        Boutique
      </span>
    </Link>
  );
}
