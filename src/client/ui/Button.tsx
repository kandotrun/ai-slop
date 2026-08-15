import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
type Size = "sm" | "md" | "lg" | "icon";

const VARIANT_CLASS: Record<Variant, string> = {
  primary: "ds-btn--default-v",
  secondary: "ds-btn--secondary",
  outline: "ds-btn--outline",
  ghost: "ds-btn--ghost",
  destructive: "ds-btn--destructive",
  link: "ds-btn--link"
};

const SIZE_CLASS: Record<Size, string> = {
  sm: "ds-btn--sm",
  md: "ds-btn--default",
  lg: "ds-btn--lg",
  icon: "ds-btn--icon"
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = "primary", size = "md", className, type = "button", ...props }: ButtonProps) {
  const classes = ["ds-btn", VARIANT_CLASS[variant], SIZE_CLASS[size], className].filter(Boolean).join(" ");
  return <button type={type} className={classes} {...props} />;
}
