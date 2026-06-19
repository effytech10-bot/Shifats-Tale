/**
 * Central currency formatter for Bangladeshi Taka (BDT).
 * Formats numeric values to the standard notation, e.g. ৳1,500
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined) {
    return "৳0";
  }
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(value)) {
    return "৳0";
  }

  // Format using Indian locale grouping (used in Bangladesh)
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);

  return `৳${formatted}`;
}
