import { useMemo } from "react";
import { Toaster, toast } from "sonner";

export type ToastType = "error" | "success" | "info";
export type ToastId = string | number;

export interface ToastController {
  push: (message: string, type?: ToastType) => ToastId;
  loading: (message: string) => ToastId;
  success: (message: string, id?: ToastId) => ToastId;
  error: (message: string, id?: ToastId) => ToastId;
  dismiss: (id?: ToastId) => void;
}

function toastOptions(id?: ToastId) {
  return id === undefined ? undefined : { id };
}

export function useToasts(): ToastController {
  return useMemo(
    () => ({
      push: (message, type = "info") => {
        if (type === "success") return toast.success(message);
        if (type === "error") return toast.error(message);
        return toast(message);
      },
      loading: (message) => toast.loading(message),
      success: (message, id) => toast.success(message, toastOptions(id)),
      error: (message, id) => toast.error(message, toastOptions(id)),
      dismiss: (id) => toast.dismiss(id)
    }),
    []
  );
}

export function ToastViewport() {
  return (
    <Toaster
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        duration: 4500,
        classNames: {
          toast: "gs-sonner-toast",
          title: "gs-sonner-title",
          description: "gs-sonner-description",
          actionButton: "gs-sonner-action",
          cancelButton: "gs-sonner-cancel",
          closeButton: "gs-sonner-close"
        }
      }}
    />
  );
}
