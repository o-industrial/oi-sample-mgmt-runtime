import { merge } from '@fathym/common/merge';
import { PageProps } from '@fathym/eac-applications/preact';
import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../src/state/OISampleMgmtWebState.ts';
import { useTranslation } from '../../src/utils/useTranslation.ts';
import SidebarNav from '../components/SidebarNav.tsx';
import NotificationBell from '../components/NotificationBell.tsx';

export type LayoutData = {
  Theme: string;
  AppTitle: string;
  Brand: string;
  NavLinks: { href: string; label: string }[];
  Locales: { code: string; label: string; active: boolean }[];
  Username: string;
  ApiBase: string;
  NotificationLabels: {
    AriaLabel: string;
    PanelTitle: string;
    EmptyLabel: string;
    MarkReadLabel: string;
    ViewLabel: string;
    UnreadLabel: string;
    TypeLabels: {
      ApprovalRequest: string;
      StatusChange: string;
      DeadlineApproaching: string;
      Escalation: string;
    };
    TimeAgoLabels: {
      JustNow: string;
      MinutesAgo: string;
      HoursAgo: string;
      DaysAgo: string;
    };
  };
};

export const handler: EaCRuntimeHandlerSet<
  OISampleMgmtWebState,
  LayoutData
> = {
  GET: (req, ctx) => {
    const { t } = useTranslation(ctx.State.Strings);
    const currentLocale = ctx.State.Locale;

    const data: LayoutData = {
      Theme: ctx.State.Theme ?? 'oi',
      AppTitle: t('app.title'),
      Brand: t('nav.brand'),
      Username: ctx.State.Username ?? 'liora.vasquez',
      ApiBase: new URL(req.url).origin,
      NotificationLabels: {
        AriaLabel: t('notification.bell.ariaLabel'),
        PanelTitle: t('notification.panel.title'),
        EmptyLabel: t('notification.bell.empty'),
        MarkReadLabel: t('notification.bell.markRead'),
        ViewLabel: t('notification.action.view'),
        UnreadLabel: t('notification.unread'),
        TypeLabels: {
          ApprovalRequest: t('notification.type.approvalRequest'),
          StatusChange: t('notification.type.statusChange'),
          DeadlineApproaching: t('notification.type.deadlineApproaching'),
          Escalation: t('notification.type.escalation'),
        },
        TimeAgoLabels: {
          JustNow: t('notification.timeAgo.justNow'),
          MinutesAgo: t('notification.timeAgo.minutesAgo'),
          HoursAgo: t('notification.timeAgo.hoursAgo'),
          DaysAgo: t('notification.timeAgo.daysAgo'),
        },
      },
      NavLinks: ([
        { href: '/', label: t('nav.home'), right: 'samples:view' },
        { href: '/dashboard', label: t('nav.dashboard'), right: 'samples:view' },
        { href: '/receive', label: t('nav.receive'), right: 'samples:receive' },
        { href: '/transfer', label: t('nav.transfer'), right: 'samples:receive' },
        { href: '/return', label: t('nav.return'), right: 'samples:view' },
        { href: '/reconciliation', label: t('nav.reconciliation'), right: 'samples:receive' },
        { href: '/disposition', label: t('nav.disposition'), right: 'custody:approve' },
        { href: '/track', label: t('nav.track'), right: 'samples:view' },
        { href: '/report', label: t('nav.report'), right: 'compliance:view' },
      ] as { href: string; label: string; right: string }[])
        .filter((item) => ctx.State.AccessRights.includes(item.right))
        .map(({ href, label }) => ({ href, label })),
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

        <div class='flex-1 flex flex-col overflow-hidden'>
          {/* Top bar with notification bell */}
          <header class='flex items-center justify-end px-6 py-2 border-b border-border bg-surface-elevated print:hidden'>
            <NotificationBell
              userId={Data!.Username}
              apiBase={Data!.ApiBase}
              ariaLabel={Data!.NotificationLabels.AriaLabel}
              panelTitle={Data!.NotificationLabels.PanelTitle}
              emptyLabel={Data!.NotificationLabels.EmptyLabel}
              markReadLabel={Data!.NotificationLabels.MarkReadLabel}
              viewLabel={Data!.NotificationLabels.ViewLabel}
              unreadLabel={Data!.NotificationLabels.UnreadLabel}
              typeLabels={{
                approvalRequest:
                  Data!.NotificationLabels.TypeLabels.ApprovalRequest,
                statusChange: Data!.NotificationLabels.TypeLabels.StatusChange,
                deadlineApproaching:
                  Data!.NotificationLabels.TypeLabels.DeadlineApproaching,
                escalation: Data!.NotificationLabels.TypeLabels.Escalation,
              }}
              timeAgoLabels={{
                justNow: Data!.NotificationLabels.TimeAgoLabels.JustNow,
                minutesAgo: Data!.NotificationLabels.TimeAgoLabels.MinutesAgo,
                hoursAgo: Data!.NotificationLabels.TimeAgoLabels.HoursAgo,
                daysAgo: Data!.NotificationLabels.TimeAgoLabels.DaysAgo,
              }}
            />
          </header>

          <main class='flex-1 overflow-y-auto p-6'>
            <Component />
          </main>
        </div>
      </body>
    </html>
  );
}
