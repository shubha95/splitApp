export const formatCurrency = (
  amount: number,
  currency = 'INR',
  locale = 'en-IN',
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const splitAmount = (total: number, count: number): number => {
  if (count <= 0) return 0;
  return parseFloat((total / count).toFixed(2));
};
