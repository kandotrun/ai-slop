import type { CSSProperties, ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  background?: string;
  color?: string;
  style?: CSSProperties;
  className?: string;
}

export function Badge({ children, background, color, style, className }: BadgeProps) {
  return (
    <span className={["ds-badge", className].filter(Boolean).join(" ")} style={{ background, color, ...style }}>
      {children}
    </span>
  );
}
