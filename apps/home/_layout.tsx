import { merge } from '@fathym/common/merge';
import { PageProps } from '@fathym/eac-applications/preact';
import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../src/state/OISampleMgmtWebState.ts';
import { useTranslation } from '../../src/utils/useTranslation.ts';
import SidebarNav from '../components/SidebarNav.tsx';

export type LayoutData = {
  Theme: string;
  AppTitle: string;
  Brand: string;
  NavLinks: { href: string; label: string }[];
  Locales: { code: string; label: string; active: boolean }[];
};

export const handler: EaCRuntimeHandlerSet<
  OISampleMgmtWebState,
  LayoutData
> = {
  GET: (_req, ctx) => {
    const { t } = useTranslation(ctx.State.Strings);
    const currentLocale = ctx.State.Locale;

    const data: LayoutData = {
      Theme: ctx.State.Theme ?? 'oi',
      AppTitle: t('app.title'),
      Brand: t('nav.brand'),
      NavLinks: [
        { href: '/', label: t('nav.home') },
        { href: '/dashboard', label: t('nav.dashboard') },
        { href: '/receive', label: t('nav.receive') },
        { href: '/transfer', label: t('nav.transfer') },
        { href: '/return', label: t('nav.return') },
        { href: '/reconciliation', label: t('nav.reconciliation') },
        { href: '/track', label: t('nav.track') },
        { href: '/report', label: t('nav.report') },
      ],
      Locales: [
        {
          code: 'en',
          label: t('locale.switchTo.en'),
          active: currentLocale === 'en',
        },
        {
          code: 'fr',
          label: t('locale.switchTo.fr'),
          active: currentLocale === 'fr',
        },
      ],
    };

    ctx.Data = merge(ctx.Data, data);

    return ctx.Next();
  },
};

export default function HomeLayout({
  Component,
  Revision,
  Data,
}: PageProps<LayoutData>) {
  return (
    <html data-theme={Data!.Theme}>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>{Data!.AppTitle}</title>
        <link
          rel='stylesheet'
          href={`/tailwind/styles.css?Revision=${Revision}`}
          data-eac-bypass-base
        />
      </head>
      <body class='bg-surface text-on-surface min-h-screen flex flex-col md:flex-row'>
        <SidebarNav
          links={Data!.NavLinks}
          brand={Data!.Brand}
          locales={Data!.Locales}
        />

        <main class='flex-1 overflow-y-auto p-6'>
          <Component />
        </main>
      </body>
    </html>
  );
}
