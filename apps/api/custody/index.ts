import { EaCRuntimeHandlers } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../../src/state/OISampleMgmtWebState.ts';
import { getOIHooks, getWorkflowHooks } from '../../../src/data/hooks.ts';
import type {
  CustodyEvent,
  CustodyTimelineRecord,
} from '../../../src/data/types/CustodyTimelineRecord.ts';

export default {
  async GET(req, _ctx) {
    const url = new URL(req.url);
    const sampleId = url.searchParams.get('sampleId') || undefined;

    if (!sampleId) {
      return Response.json(
        { error: 'sampleId query parameter required' },
        { status: 400 },
      );
    }

    const oiHooks = await getOIHooks();
    const wfHooks = await getWorkflowHooks();

    // Find the sample from OI warm query data
    const allSamples = await oiHooks.AllBarcodes();
    const sample = allSamples.find((s) => s.SampleId === sampleId);

    if (!sample) {
      return Response.json(
        { error: `Sample ${sampleId} not found` },
        { status: 404 },
      );
    }

    const events: CustodyEvent[] = [];

    // 1. Reception event from sample itself
    events.push({
      EventId: `custody-received-${sample.SampleId}`,
      Timestamp: sample.ReceivedAt,
      EventType: 'received',
      Description: `Sample received from ${sample.OriginSite}`,
      PerformedBy: 'system',
      EvidenceLinks: [],
      AlcoaPrinciples: ['Contemporaneous', 'Original'],
    });

    // 2. Audit events matching this sample (filter by EntityId)
    const auditEvents = await wfHooks.ListAuditEvents();

    for (const evt of auditEvents) {
      if (evt.EntityId === sampleId) {
        events.push({
          EventId: evt.EventId,
          Timestamp: evt.Timestamp,
          EventType: evt.ActionType.toLowerCase(),
          Description: `${evt.ActionType} on ${evt.EntityType} ${evt.EntityId}`,
          PerformedBy: evt.UserId,
          EvidenceLinks: [],
          AlcoaPrinciples: [evt.AlcoaPrinciple],
        });
      }
    }

    // 3. Transfers involving this sample (SampleIds is an array)
    const transfers = await wfHooks.ListTransfers();

    for (const t of transfers) {
      if (t.SampleIds.includes(sampleId)) {
        events.push({
          EventId: `custody-transfer-${t.TransferId}`,
          Timestamp: t.RequestedAt,
          EventType: 'transferred',
          Description:
            `${t.Type} transfer: ${t.Source} \u2192 ${t.Destination}`,
          PerformedBy: t.RequestedBy,
          EvidenceLinks: [],
          AlcoaPrinciples: ['Attributable', 'Contemporaneous'],
        });
      }
    }

    // 4. Returns involving this sample (SampleIds is an array)
    const returns = await wfHooks.ListReturns();

    for (const r of returns) {
      if (r.SampleIds.includes(sampleId)) {
        const eventType = r.Outcome === 'depleted' ? 'depleted' : 'returned';

        events.push({
          EventId: `custody-return-${r.ReturnId}`,
          Timestamp: r.RequestedAt,
          EventType: eventType,
          Description: r.Reason,
          PerformedBy: r.RequestedBy,
          EvidenceLinks: [],
          AlcoaPrinciples: ['Attributable', 'Contemporaneous'],
        });
      }
    }

    // 5. Dispositions for this sample (SampleId is singular)
    const dispositions = await wfHooks.ListDispositions();

    for (const d of dispositions) {
      if (d.SampleId === sampleId) {
        events.push({
          EventId: `custody-disposition-${d.DispositionId}`,
          Timestamp: d.CustodianSignoff?.SignedAt ?? d.FinalReportDate,
          EventType: 'disposed',
          Description: `Disposition: ${d.Decision} \u2014 ${d.LastAction}`,
          PerformedBy: d.CustodianSignoff?.SignedBy ?? 'pending',
          EvidenceLinks: d.EvidenceDocuments.map((e) => e.Url),
          AlcoaPrinciples: ['Attributable', 'Complete'],
        });
      }
    }

    // Sort by timestamp descending (most recent first)
    events.sort(
      (a, b) =>
        new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime(),
    );

    const record: CustodyTimelineRecord = {
      Sample: {
        SampleId: sample.SampleId,
        StudyId: sample.StudyId,
        OriginSite: sample.OriginSite,
        ReceivedAt: sample.ReceivedAt,
        Status: sample.Status,
        StorageLocation: sample.StorageLocation,
      },
      Events: events,
      CurrentState: sample.Status,
    };

    return Response.json(record);
  },
} as EaCRuntimeHandlers<OISampleMgmtWebState>;
