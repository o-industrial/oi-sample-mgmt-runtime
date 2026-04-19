import { PageProps } from '@fathym/eac-applications/preact';
import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../../../src/state/OISampleMgmtWebState.ts';
import { useTranslation } from '../../../../src/utils/useTranslation.ts';
import { createClientFromRequest } from '../../../../src/client/createClientFromRequest.ts';

// --- Types (TitleCase for server data) ---

type EthicsStatus = 'active' | 'expiring' | 'expired';

type EthicsApproval = {
  StudyId: string;
  Protocol: string;
  ApprovalDate: string;
  ExpiryDate: string;
  Status: EthicsStatus;
  StatusLabel: string;
  DaysUntilExpiry: number;
};

type EthicsApprovalData = {
  Heading: string;
  Subtitle: string;
  SubNavLabels: { AuditTrail: string; EthicsApproval: string; Custody: string };
  ColumnHeaders: {
    StudyId: string;
    Protocol: string;
    ApprovalDate: string;
    ExpiryDate: string;
    Status: string;
    Action: string;
  };
  RenewLabel: string;
  Approvals: EthicsApproval[];
  EmptyLabel: string;
};

// --- Status badge class helper ---

function ethicsStatusClass(status: EthicsStatus): string {
  switch (status) {
    case 'active':
      return 'bg-status-ready-bg text-status-ready-text';
    case 'expiring':
      return 'bg-status-problem-bg text-status-problem-text';
    case 'expired':
      return 'bg-surface-inset text-on-surface-muted';
  }
}

// --- Handler ---

export const handler: EaCRuntimeHandlerSet<
  OISampleMgmtWebState,
  EthicsApprovalData
> = {
  GET: async (req, ctx) => {
    const { t } = useTranslation(ctx.State.Strings);

    const buildStatusLabel = (
      status: EthicsStatus,
      daysUntilExpiry: number,
    ): string => {
      if (status === 'expiring') {
        return `${
          t('report.ethics.status.expiringPrefix')
        } ${daysUntilExpiry} ${t('report.ethics.status.days')}`;
      }
      return t(`report.ethics.status.${status}`);
    };

    const client = await createClientFromRequest(req);
    const rawApprovals = await client.EthicsApprovals.List();

    return ctx.Render({
      ...ctx.Data,
      Heading: t('report.ethics.heading'),
      Subtitle: t('report.ethics.subtitle'),
      SubNavLabels: {
        AuditTrail: t('report.auditTrail.heading'),
        EthicsApproval: t('report.ethics.heading'),
        Custody: t('report.custody.heading'),
      },
      ColumnHeaders: {
        StudyId: t('report.ethics.col.studyId'),
        Protocol: t('report.ethics.col.protocol'),
        ApprovalDate: t('report.ethics.col.approvalDate'),
        ExpiryDate: t('report.ethics.col.expiryDate'),
        Status: t('report.ethics.col.status'),
        Action: t('report.ethics.col.action'),
      },
      RenewLabel: t('report.ethics.renew'),
      Approvals: rawApprovals.map((a) => ({
        ...a,
        StatusLabel: buildStatusLabel(a.Status, a.DaysUntilExpiry),
      })),
      EmptyLabel: t('report.ethics.empty'),
    });
  },
};

// --- Component ---

export default function EthicsApprovalPage(
  { Data }: PageProps<EthicsApprovalData>,
) {
  const d = Data!;

  return (
    <div class='space-y-6'>
      {/* Sub-navigation */}
      <div class='flex gap-1'>
        <a
          href='/report/audit-trail'
          data-eac-bypass-base
          class='px-4 py-2 rounded-md text-sm font-medium text-on-surface-secondary hover:bg-surface-card transition-colors'
        >
          {d.SubNavLabels.AuditTrail}
        </a>
        <a
          href='/report/ethics-approval'
          data-eac-bypass-base
          class='px-4 py-2 rounded-md text-sm font-medium bg-primary text-on-primary'
        >
          {d.SubNavLabels.EthicsApproval}
        </a>
        <a
          href='/report/custody'
          data-eac-bypass-base
          class='px-4 py-2 rounded-md text-sm font-medium text-on-surface-secondary hover:bg-surface-card transition-colors'
        >
          {d.SubNavLabels.Custody}
        </a>
      </div>

      {/* Header */}
      <div>
        <h1 class='text-xl font-bold text-primary'>{d.Heading}</h1>
        <p class='text-sm text-on-surface-secondary mt-1'>{d.Subtitle}</p>
      </div>

      {/* Ethics approval table */}
      <div class='rounded-lg border border-border bg-surface-card overflow-hidden'>
        <table class='w-full text-sm'>
          <thead class='bg-surface-elevated border-b border-border'>
            <tr class='text-left text-on-surface-secondary'>
              <th class='px-4 py-3 font-medium'>{d.ColumnHeaders.StudyId}</th>
              <th class='px-4 py-3 font-medium'>
                {d.ColumnHeaders.Protocol}
              </th>
              <th class='px-4 py-3 font-medium'>
                {d.ColumnHeaders.ApprovalDate}
              </th>
              <th class='px-4 py-3 font-medium'>
                {d.ColumnHeaders.ExpiryDate}
              </th>
              <th class='px-4 py-3 font-medium'>{d.ColumnHeaders.Status}</th>
              <th class='px-4 py-3 font-medium'>{d.ColumnHeaders.Action}</th>
            </tr>
          </thead>
          <tbody class='divide-y divide-border-subtle'>
            {d.Approvals.length === 0
              ? (
                <tr>
                  <td
                    colSpan={6}
                    class='px-4 py-8 text-center text-on-surface-muted'
                  >
                    {d.EmptyLabel}
                  </td>
                </tr>
              )
              : d.Approvals.map((approval) => (
                <tr
                  key={approval.StudyId}
                  class='hover:bg-surface-elevated'
                >
                  <td class='px-4 py-3 font-medium text-on-surface'>
                    {approval.StudyId}
                  </td>
                  <td class='px-4 py-3 text-on-surface-secondary'>
                    {approval.Protocol}
                  </td>
                  <td class='px-4 py-3 font-mono text-xs text-on-surface'>
                    {approval.ApprovalDate}
                  </td>
                  <td class='px-4 py-3 font-mono text-xs text-on-surface'>
                    {approval.ExpiryDate}
                  </td>
                  <td class='px-4 py-3'>
                    <span
                      class={`px-2 py-1 rounded text-xs font-semibold ${
                        ethicsStatusClass(approval.Status)
                      }`}
                    >
                      {approval.StatusLabel}
                    </span>
                  </td>
                  <td class='px-4 py-3'>
                    <button
                      type='button'
                      class='px-3 py-1 border border-border rounded text-xs text-on-surface hover:bg-surface-elevated transition-colors'
                    >
                      {d.RenewLabel}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
