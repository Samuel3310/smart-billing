import dayjs from "dayjs";

export function formatCurrency(value: number, currency = "USD") {
  const amount = Number(value || 0).toFixed(2);

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount));
  } catch {
    return `$${amount}`;
  }
}

export const formatSubscriptionDateTime = (value: string) => {
  if (!value) return "Not provided";
  const parsedDate = dayjs(value);

  return parsedDate.isValid()
    ? parsedDate.format("MMM D, YYYY")
    : "Not provided";
};

export const formatStatusLabel = (value?: string) => {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
};
