import type { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Card({ children, className, style }: CardProps) {
  return (
    <div className={["ds-card", className].filter(Boolean).join(" ")} style={style}>
      {children}
    </div>
  );
}

export function CardHead({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="ds-card__head" style={style}>
      {children}
    </div>
  );
}

export function CardBody({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="ds-card__body" style={style}>
      {children}
    </div>
  );
}
