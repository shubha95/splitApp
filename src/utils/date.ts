export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const todayISO = (): string =>
  new Date().toISOString().split('T')[0] as string;

export const isToday = (iso: string): boolean =>
  iso.startsWith(todayISO());
