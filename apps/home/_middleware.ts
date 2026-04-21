import { loadJwtConfig } from '@fathym/common/jwt';
import { EaCRuntimeHandler } from '@fathym/eac/runtime/pipelines';
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

    // Dev-mode persona override for Playwright demos
    const devMode = Deno.env.get('EAC_RUNTIME_DEV') === 'true';
    const demoCookie = req.headers.get('cookie')?.match(
      /demo_persona=([^;]+)/,
    )?.[1];

    if (devMode && demoCookie) {
      const PERSONA_MAP: Record<
        string,
        { username: string; rights: string[] }
      > = {
        elena: {
          username: 'elena.martinez',
          rights: ['samples:receive'],
        },
        labManager: {
          username: 'dr.sarah.chen',
          rights: ['admin:access', 'review:approve'],
        },
        scientist: {
          username: 'dr.james.chen',
          rights: ['scientist:request'],
        },
        custodian: {
          username: 'james.wilson',
          rights: ['custody:approve'],
        },
        qaAuditor: {
          username: 'sarah.patel',
          rights: ['compliance:export'],
        },
        studyCoordinator: {
          username: 'maria.garcia',
          rights: ['study:view'],
        },
        csvGroupHead: {
          username: 'dr.richard.hayes',
          rights: ['config:admin', 'review:approve'],
        },
      };
      const persona = PERSONA_MAP[demoCookie];
      if (persona) {
        ctx.State.Username = persona.username;
        ctx.State.AccessRights = persona.rights;
        ctx.State.Theme = resolveTheme(req);
        ctx.State.Locale = resolveLocale(req);
        ctx.State.Strings = await loadStrings(ctx.State.Locale as 'en' | 'fr');
        return ctx.Next();
      }
    }

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

          ctx.State.AccessRights = await wsClient.Workspaces
            .ResolveUserAccessRights(username);
        }
      } catch (_err) {
        // Workspace access rights resolution failed — continue with empty rights
      }
    }

    // Default pilot username when no upstream auth provides one
    if (!ctx.State.Username) {
      ctx.State.Username = 'elena.martinez';
    }

    ctx.State.Theme = resolveTheme(req);
    ctx.State.Locale = resolveLocale(req);
    ctx.State.Strings = await loadStrings(ctx.State.Locale as 'en' | 'fr');
    return ctx.Next();
  },
] as EaCRuntimeHandler<OISampleMgmtWebState>[];
