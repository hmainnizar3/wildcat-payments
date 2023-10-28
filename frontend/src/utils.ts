export function formattedAmount(amount: number, currencyCode: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

export function deduceFlag(currency: string) {
  switch (currency) {
    case "DKK":
      return "🇩🇰";
    case "EUR":
      return "🇪🇺";
    default:
      break;
  }
}
