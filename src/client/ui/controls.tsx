import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={["ds-input", className].filter(Boolean).join(" ")} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={["ds-input", "ds-textarea", className].filter(Boolean).join(" ")} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="ds-select-wrap">
      <select className={["ds-select", className].filter(Boolean).join(" ")} {...props}>
        {children}
      </select>
    </span>
  );
}

export function Switch({ className, checked, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="checkbox" role="switch" aria-checked={Boolean(checked)} checked={checked} className={["ds-switch", className].filter(Boolean).join(" ")} {...props} />;
}

export function Label({ className, children, ...props }: LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode }) {
  return (
    <label className={["ds-label", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </label>
  );
}
