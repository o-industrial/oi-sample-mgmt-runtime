export function useTranslation(strings: Record<string, string>) {
  const t = (key: string): string => strings[key] ?? key;
  return { t };
}
