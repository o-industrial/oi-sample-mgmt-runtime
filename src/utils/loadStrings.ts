import type { AppLocale } from './resolveLocale.ts';

const cache = new Map<string, Record<string, string>>();

export async function loadStrings(
  locale: AppLocale,
): Promise<Record<string, string>> {
  if (cache.has(locale)) return cache.get(locale)!;

  const path = new URL(`../../locales/${locale}.json`, import.meta.url);
  const text = await Deno.readTextFile(path);
  const strings = JSON.parse(text) as Record<string, string>;

  cache.set(locale, strings);
  return strings;
}
