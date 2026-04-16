import { EaCRuntimeHandler } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../src/state/OISampleMgmtWebState.ts';
import { resolveAccessRights } from '../../src/utils/demoAccess.ts';
import { resolveTheme } from '../../src/utils/resolveTheme.ts';
import { isValidLocale, resolveLocale } from '../../src/utils/resolveLocale.ts';
import { loadStrings } from '../../src/utils/loadStrings.ts';

export default [
  async (req, ctx) => {
    // Handle ?setLocale= — set cookie and redirect to clean URL
    const url = new URL(req.url);
    const setLocale = url.searchParams.get('setLocale');
    if (setLocale && isValidLocale(setLocale)) {
      url.searchParams.delete('setLocale');
      return new Response(null, {
        status: 302,
        headers: {
          'Location': url.pathname + url.search,
          'Set-Cookie':
            `sm-locale=${setLocale}; Path=/; SameSite=Lax; Max-Age=31536000`,
        },
      });
    }

    ctx.State.AccessRights = resolveAccessRights(req, undefined);
    ctx.State.Theme = resolveTheme(req);
    ctx.State.Locale = resolveLocale(req);
    ctx.State.Strings = await loadStrings(ctx.State.Locale);
    return ctx.Next();
  },
] as EaCRuntimeHandler<OISampleMgmtWebState>[];
