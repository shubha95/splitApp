export const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const isValidPhone = (phone: string): boolean =>
  /^\+?[\d\s\-()]{7,15}$/.test(phone.trim());

export const isNonEmpty = (value: string): boolean =>
  value.trim().length > 0;

export const isMinLength = (value: string, min: number): boolean =>
  value.trim().length >= min;

export const isValidAmount = (value: number): boolean =>
  Number.isFinite(value) && value > 0;
