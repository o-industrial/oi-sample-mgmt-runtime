const VALID_THEMES = ['oi', 'gsk', 'fathym-light'] as const;

export type AppTheme = (typeof VALID_THEMES)[number];

export function resolveTheme(req: Request): AppTheme {
  const url = new URL(req.url);
  const param = url.searchParams.get('theme');
  if (param && VALID_THEMES.includes(param as AppTheme)) {
    return param as AppTheme;
  }

  const envTheme = Deno.env.get('SM_THEME');
  if (envTheme && VALID_THEMES.includes(envTheme as AppTheme)) {
    return envTheme as AppTheme;
  }

  return 'oi';
}
