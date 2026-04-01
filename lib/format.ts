const CURRENCY = "EUR";
const LOCALE = "fr-FR";

const FORMATTER = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY
});

export function formatPrice(value: number): string {
  return FORMATTER.format(value);
}

export function formatQuantity(value: number, unit = ""): string {
  if (!unit) return value.toLocaleString(LOCALE);
  return `${value.toLocaleString(LOCALE)}\u00a0${unit}`;
}
