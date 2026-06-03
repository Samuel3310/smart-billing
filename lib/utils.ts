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
