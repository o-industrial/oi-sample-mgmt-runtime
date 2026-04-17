import { PageProps } from '@fathym/eac-applications/preact';
import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../../../src/state/OISampleMgmtWebState.ts';
import { useTranslation } from '../../../../src/utils/useTranslation.ts';

// --- Types (TitleCase for server data) ---

type AuditEventStatus = 'success' | 'failed';

type AuditEvent = {
  EventId: string;
  Timestamp: string;
  UserId: string;
  ActionType: string;
  EntityType: string;
  EntityId: string;
  AlcoaPrinciple: string;
  Status: AuditEventStatus;
  StatusLabel: string;
};

type AuditTrailData = {
  Heading: string;
  Subtitle: string;
  SubNavLabels: { AuditTrail: string; EthicsApproval: string };
  FilterLabels: {
    AllUsers: string;
    AllActions: string;
    Actions: Array<{ Value: string; Label: string }>;
    ExportCsv: string;
  };
  ColumnHeaders: {
    Timestamp: string;
    UserId: string;
    Action: string;
    Entity: string;
    Alcoa: string;
    Status: string;
  };
  Events: AuditEvent[];
  TotalCount: number;
  EmptyLabel: string;
};

// --- Handler ---

export const handler: EaCRuntimeHandlerSet<
  OISampleMgmtWebState,
  AuditTrailData
> = {
  GET: (_req, ctx) => {
    const { t } = useTranslation(ctx.State.Strings);

    const events: AuditEvent[] = [
      {
        EventId: 'EVT-0001',
        Timestamp: '2026-04-16 09:15:22',
        UserId: 'elena.martinez',
        ActionType: 'Scan',
        EntityType: 'Sample',
        EntityId: 'SMP-2026-88421-001',
        AlcoaPrinciple: 'Contemporaneous',
        Status: 'success',
        StatusLabel: t('report.auditTrail.status.success'),
      },
      {
        EventId: 'EVT-0002',
        Timestamp: '2026-04-16 09:12:05',
        UserId: 'elena.martinez',
        ActionType: 'Create',
        EntityType: 'Manifest',
        EntityId: 'MAN-2026-0412',
        AlcoaPrinciple: 'Original',
        Status: 'success',
        StatusLabel: t('report.auditTrail.status.success'),
      },
      {
        EventId: 'EVT-0003',
        Timestamp: '2026-04-16 09:10:00',
        UserId: 'system',
        ActionType: 'Create',
        EntityType: 'TemperatureLog',
        EntityId: 'TMP-SENSOR-04-2026-0416',
        AlcoaPrinciple: 'Contemporaneous',
        Status: 'success',
        StatusLabel: t('report.auditTrail.status.success'),
      },
      {
        EventId: 'EVT-0004',
        Timestamp: '2026-04-15 16:30:11',
        UserId: 'sarah.chen',
        ActionType: 'Approve',
        EntityType: 'EthicsApproval',
        EntityId: 'BEACON-3',
        AlcoaPrinciple: 'Attributable',
        Status: 'success',
        StatusLabel: t('report.auditTrail.status.success'),
      },
      {
        EventId: 'EVT-0005',
        Timestamp: '2026-04-15 14:22:33',
        UserId: 'james.wilson',
        ActionType: 'Approve',
        EntityType: 'Transfer',
        EntityId: 'TRF-2026-0087',
        AlcoaPrinciple: 'Attributable',
        Status: 'success',
        StatusLabel: t('report.auditTrail.status.success'),
      },
      {
        EventId: 'EVT-0006',
        Timestamp: '2026-04-15 11:05:47',
        UserId: 'system',
        ActionType: 'Update',
        EntityType: 'Manifest',
        EntityId: 'MAN-2026-0409',
        AlcoaPrinciple: 'Accurate',
        Status: 'failed',
        StatusLabel: t('report.auditTrail.status.failed'),
      },
    ];

    return ctx.Render({
      ...ctx.Data,
      Heading: t('report.auditTrail.heading'),
      Subtitle: t('report.auditTrail.subtitle'),
      SubNavLabels: {
        AuditTrail: t('report.auditTrail.heading'),
        EthicsApproval: t('report.ethics.heading'),
      },
      FilterLabels: {
        AllUsers: t('report.auditTrail.filter.allUsers'),
        AllActions: t('report.auditTrail.filter.allActions'),
        Actions: [
          { Value: 'scan', Label: t('report.auditTrail.filter.actionScan') },
          {
            Value: 'create',
            Label: t('report.auditTrail.filter.actionCreate'),
          },
          {
            Value: 'update',
            Label: t('report.auditTrail.filter.actionUpdate'),
          },
          {
            Value: 'approve',
            Label: t('report.auditTrail.filter.actionApprove'),
          },
        ],
        ExportCsv: t('report.auditTrail.filter.exportCsv'),
      },
      ColumnHeaders: {
        Timestamp: t('report.auditTrail.col.timestamp'),
        UserId: t('report.auditTrail.col.userId'),
        Action: t('report.auditTrail.col.action'),
        Entity: t('report.auditTrail.col.entity'),
        Alcoa: t('report.auditTrail.col.alcoa'),
        Status: t('report.auditTrail.col.status'),
      },
      Events: events,
      TotalCount: events.length,
      EmptyLabel: t('report.auditTrail.empty'),
    });
  },
};

// --- Component ---

export default function AuditTrail({ Data }: PageProps<AuditTrailData>) {
  const d = Data!;

  return (
    <div class='space-y-6'>
      {/* Sub-navigation */}
      <div class='flex gap-1'>
        <a
          href='/report/audit-trail'
          data-eac-bypass-base
          class='px-4 py-2 rounded-md text-sm font-medium bg-primary text-on-primary'
        >
          {d.SubNavLabels.AuditTrail}
        </a>
        <a
          href='/report/ethics-approval'
          data-eac-bypass-base
          class='px-4 py-2 rounded-md text-sm font-medium text-on-surface-secondary hover:bg-surface-card transition-colors'
        >
          {d.SubNavLabels.EthicsApproval}
        </a>
      </div>

      {/* Header */}
      <div>
        <h1 class='text-xl font-bold text-primary'>{d.Heading}</h1>
        <p class='text-sm text-on-surface-secondary mt-1'>{d.Subtitle}</p>
      </div>

      {/* Filter bar */}
      <div class='flex flex-wrap gap-4 rounded-lg border border-border bg-surface-card p-4'>
        <input
          type='date'
          class='border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface'
        />
        <input
          type='date'
          class='border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface'
        />
        <select class='border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface'>
          <option value=''>{d.FilterLabels.AllUsers}</option>
        </select>
        <select class='border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface'>
          <option value=''>{d.FilterLabels.AllActions}</option>
          {d.FilterLabels.Actions.map((a) => (
            <option key={a.Value} value={a.Value}>{a.Label}</option>
          ))}
        </select>
        <button
          type='button'
          class='px-4 py-2 border border-border rounded-md text-sm text-on-surface hover:bg-surface-elevated transition-colors ml-auto'
        >
          {d.FilterLabels.ExportCsv}
        </button>
      </div>

      {/* Audit table */}
      <div class='rounded-lg border border-border bg-surface-card overflow-hidden'>
        <table class='w-full text-sm'>
          <thead class='bg-surface-elevated border-b border-border'>
            <tr class='text-left text-on-surface-secondary'>
              <th class='px-4 py-3 font-medium'>
                {d.ColumnHeaders.Timestamp}
              </th>
              <th class='px-4 py-3 font-medium'>{d.ColumnHeaders.UserId}</th>
              <th class='px-4 py-3 font-medium'>{d.ColumnHeaders.Action}</th>
              <th class='px-4 py-3 font-medium'>{d.ColumnHeaders.Entity}</th>
              <th class='px-4 py-3 font-medium'>{d.ColumnHeaders.Alcoa}</th>
              <th class='px-4 py-3 font-medium'>{d.ColumnHeaders.Status}</th>
            </tr>
          </thead>
          <tbody class='divide-y divide-border-subtle'>
            {d.Events.length === 0
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
              : d.Events.map((event) => (
                <tr key={event.EventId} class='hover:bg-surface-elevated'>
                  <td class='px-4 py-3 font-mono text-xs text-on-surface'>
                    {event.Timestamp}
                  </td>
                  <td class='px-4 py-3 text-on-surface'>{event.UserId}</td>
                  <td class='px-4 py-3 text-on-surface'>
                    {event.ActionType}
                  </td>
                  <td class='px-4 py-3 text-on-surface-secondary'>
                    {event.EntityType}: {event.EntityId}
                  </td>
                  <td class='px-4 py-3'>
                    <span class='px-2 py-1 bg-surface-elevated text-link rounded text-xs font-medium'>
                      {event.AlcoaPrinciple}
                    </span>
                  </td>
                  <td class='px-4 py-3'>
                    <span
                      class={`px-2 py-1 rounded text-xs font-medium ${
                        event.Status === 'success'
                          ? 'bg-status-ready-bg text-status-ready-text'
                          : 'bg-status-problem-bg text-status-problem-text'
                      }`}
                    >
                      {event.StatusLabel}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
