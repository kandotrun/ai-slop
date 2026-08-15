export const PAID_CHECKOUT_PREPARING_ERROR = "paid_checkout_preparing";
export const PAID_CHECKOUT_PREPARING_TOOLTIP = "現在準備中";

export function paidCheckoutEnabledFromFlag(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return false;
  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes" || normalized === "enabled";
}
