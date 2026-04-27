import { Crown } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
};

export function Logo({ size = "md", showText = true }: Props) {
  const dims = {
    sm: { box: "h-8 w-8", icon: 16, text: "text-base" },
    md: { box: "h-10 w-10", icon: 20, text: "text-lg" },
    lg: { box: "h-14 w-14", icon: 28, text: "text-2xl" },
  }[size];

  return (
    <Link to="/" className="group flex items-center gap-3">
      <span
        className={`${dims.box} relative grid place-items-center rounded-sm bg-gradient-gold shadow-inset-gold shadow-gold transition-all duration-300 group-hover:scale-105 group-hover:shadow-gold-lg`}
      >
        <Crown size={dims.icon} className="text-primary-foreground drop-shadow" strokeWidth={2.4} />
      </span>
      {showText && (
        <span className={`font-display ${dims.text} font-bold leading-none tracking-widest`}>
          <span className="text-gold-gradient">MU</span>
          <span className="text-foreground"> ETERNIA</span>
        </span>
      )}
    </Link>
  );
}
