import type { CSSProperties, ReactNode } from "react";

interface AlertProps {
  icon: ReactNode;
  title?: ReactNode;
  children: ReactNode;
  variant?: "default" | "destructive";
  style?: CSSProperties;
}

export function Alert({ icon, title, children, variant = "default", style }: AlertProps) {
  const classes = ["ds-alert", variant === "destructive" ? "ds-alert--destructive" : ""].filter(Boolean).join(" ");
  return (
    <div className={classes} style={style}>
      {icon}
      {title ? <div className="ds-alert__title">{title}</div> : null}
      <div className="ds-alert__desc" style={title ? undefined : { marginTop: 0 }}>
        {children}
      </div>
    </div>
  );
}
