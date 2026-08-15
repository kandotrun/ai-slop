import type { ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Dialog({ open, onClose, children }: DialogProps) {
  if (!open) {
    return null;
  }
  return (
    <div className="forge">
      <div className="gs-overlay" onClick={onClose} />
      <div className="gs-dialog" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>
  );
}
