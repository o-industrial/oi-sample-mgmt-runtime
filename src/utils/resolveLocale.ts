const SUPPORTED_LOCALES = ["en", "fr"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export function isValidLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}

export function resolveLocale(req: Request): AppLocale {
  // 1. sm-locale cookie (persistent user preference)
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:^|;\s*)sm-locale=([^;]+)/);
    if (match && isValidLocale(match[1])) {
      return match[1];
    }
  }

  // 2. ?locale= query param (demo/dev override)
  const url = new URL(req.url);
  const param = url.searchParams.get("locale");
  if (param && isValidLocale(param)) {
    return param;
  }

  // 3. Accept-Language header
  const accept = req.headers.get("accept-language");
  if (accept) {
    for (const locale of SUPPORTED_LOCALES) {
      if (accept.toLowerCase().includes(locale)) return locale;
    }
  }

  // 4. Default
  return "en";
}
