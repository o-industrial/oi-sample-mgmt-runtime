import { loadJwtConfig } from '@fathym/common';
import { EaCRuntimeHandler } from '@fathym/eac/runtime/pipelines';
import type { EverythingAsCodeIdentity } from '@fathym/eac-identity';
import { OpenIndustrialAPIClient } from '@o-industrial/common/api';
import { OpenIndustrialJWTPayload } from '@o-industrial/common/types';
import { OISampleMgmtWebState } from '../../src/state/OISampleMgmtWebState.ts';
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

    // Resolve workspace-scoped access rights
    ctx.State.AccessRights = [];

    const username = ctx.State.Username;

    if (username) {
      try {
        const oiApiRoot = Deno.env.get('OPEN_INDUSTRIAL_API_ROOT')!;
        const apiBaseUrl = new URL(oiApiRoot);

        const listJwt = await loadJwtConfig().Create({
          Username: username,
          WorkspaceLookup: '',
        } as OpenIndustrialJWTPayload);

        const listClient = new OpenIndustrialAPIClient(apiBaseUrl, listJwt);
        const workspaces = await listClient.Workspaces.ListForUser();
        const wsLookup = workspaces[0]?.EnterpriseLookup;

        if (wsLookup) {
          const wsJwt = await loadJwtConfig().Create({
            Username: username,
            WorkspaceLookup: wsLookup,
          } as OpenIndustrialJWTPayload);

          const wsClient = new OpenIndustrialAPIClient(apiBaseUrl, wsJwt);

          const [cards, workspace] = await Promise.all([
            wsClient.Workspaces.ListUserAccessCards(username),
            wsClient.Workspaces.Get(),
          ]);

          if (cards?.length > 0 && workspace) {
            const acDefs = (workspace as unknown as EverythingAsCodeIdentity)
              ?.AccessConfigurations || {};
            const rights = new Set<string>();

            for (const card of cards) {
              const cfg = acDefs[card.AccessConfigurationLookup];
              for (const r of cfg?.AccessRightLookups || []) rights.add(r);
            }

            ctx.State.AccessRights = [...rights];
          }
        }
      } catch (_err) {
        // Workspace access rights resolution failed — continue with empty rights
      }
    }

    ctx.State.Theme = resolveTheme(req);
    ctx.State.Locale = resolveLocale(req);
    ctx.State.Strings = await loadStrings(ctx.State.Locale);
    return ctx.Next();
  },
] as EaCRuntimeHandler<OISampleMgmtWebState>[];
