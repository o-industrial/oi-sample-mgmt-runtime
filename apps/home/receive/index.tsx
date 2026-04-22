import { PageProps } from '@fathym/eac-applications/preact';
import { EaCRuntimeHandlerSet } from '@fathym/eac/runtime/pipelines';
import { OISampleMgmtWebState } from '../../../src/state/OISampleMgmtWebState.ts';
import { useTranslation } from '../../../src/utils/useTranslation.ts';
import ReceptionTabs from '../../components/ReceptionTabs.tsx';
import { createClientFromRequest } from '../../../src/client/createClientFromRequest.ts';

// --- Types (TitleCase for server data) ---

type GateStatus = 'ready' | 'attention' | 'volume-hold' | 'problem';

type RecentManifestItem = {
  ManifestId: string;
  Study: string;
  ExpectedSamples: number;
  Status: GateStatus;
  StatusLabel: string;
  ReceivedAt: string;
  SamplesLabel: string;
};

type ChecklistItem = {
  Id: string;
  Label: string;
};

type ReceiveData = {
  Heading: string;
  TabLabels: string[];
  ManifestForm: {
    ManifestIdLabel: string;
    ManifestIdPlaceholder: string;
    StudyLabel: string;
    StudyPlaceholder: string;
    StudyOptions: Array<{ Value: string; Label: string }>;
    ShipmentIdLabel: string;
    ShipmentIdPlaceholder: string;
    ExpectedSamplesLabel: string;
    ExpectedSamplesPlaceholder: string;
    OriginSiteLabel: string;
    OriginSitePlaceholder: string;
    DestinationSiteLabel: string;
    DestinationSitePlaceholder: string;
    WaybillNumberLabel: string;
    WaybillNumberPlaceholder: string;
    CarrierLabel: string;
    CarrierPlaceholder: string;
    PeriodLabel: string;
    PeriodPlaceholder: string;
    SubmitLabel: string;
  };
  RecentManifests: {
    Heading: string;
    Items: RecentManifestItem[];
    EmptyLabel: string;
  };
  ParcelReception: {
    Heading: string;
    Checklist: ChecklistItem[];
    ConfirmReceiptLabel: string;
    ScannedByLabel: string;
    ScannedByValue: string;
    VerifiedByLabel: string;
    VerifiedByPlaceholder: string;
  };
  TemperatureLogs: {
    Heading: string;
    DateRangeLabel: string;
    Columns: { Col1: string; Col2: string; Col3: string; Col4: string };
    EmptyLabel: string;
  };
  BarcodeScanning: {
    Heading: string;
    ScannerPlaceholder: string;
    ScanButtonLabel: string;
    StartBatchLabel: string;
    Columns: { Col1: string; Col2: string; Col3: string; Col4: string };
    EmptyLabel: string;
  };
};

// --- Handler ---

export const handler: EaCRuntimeHandlerSet<
  OISampleMgmtWebState,
  ReceiveData
> = {
  GET: async (req, ctx) => {
    if (!ctx.State.AccessRights.includes('samples:receive')) {
      return new Response('Forbidden', { status: 403 });
    }

    const { t } = useTranslation(ctx.State.Strings);

    const client = await createClientFromRequest(req);
    const [studies, manifests] = await Promise.all([
      client.Studies.List(),
      client.Manifests.List(),
    ]);

    return ctx.Render({
      ...ctx.Data,
      Heading: t('receive.heading'),

      TabLabels: [
        t('receive.tab.manifestUpload'),
        t('receive.tab.parcelReception'),
        t('receive.tab.temperatureLogs'),
        t('receive.tab.barcodeScanning'),
      ],

      ManifestForm: {
        ManifestIdLabel: t('receive.form.manifestId'),
        ManifestIdPlaceholder: t('receive.form.manifestIdPlaceholder'),
        StudyLabel: t('receive.form.study'),
        StudyPlaceholder: t('receive.form.studyPlaceholder'),
        StudyOptions: studies.map((s) => ({
          Value: s.StudyId,
          Label: s.Label,
        })),
        ShipmentIdLabel: t('receive.form.shipmentId'),
        ShipmentIdPlaceholder: t('receive.form.shipmentIdPlaceholder'),
        ExpectedSamplesLabel: t('receive.form.expectedSamples'),
        ExpectedSamplesPlaceholder: t(
          'receive.form.expectedSamplesPlaceholder',
        ),
        OriginSiteLabel: t('receive.form.originSite'),
        OriginSitePlaceholder: t('receive.form.originSitePlaceholder'),
        DestinationSiteLabel: t('receive.form.destinationSite'),
        DestinationSitePlaceholder: t(
          'receive.form.destinationSitePlaceholder',
        ),
        WaybillNumberLabel: t('receive.form.waybillNumber'),
        WaybillNumberPlaceholder: t('receive.form.waybillNumberPlaceholder'),
        CarrierLabel: t('receive.form.carrier'),
        CarrierPlaceholder: t('receive.form.carrierPlaceholder'),
        PeriodLabel: t('receive.form.period'),
        PeriodPlaceholder: t('receive.form.periodPlaceholder'),
        SubmitLabel: t('receive.form.submit'),
      },

      RecentManifests: {
        Heading: t('receive.recentManifests.heading'),
        Items: manifests.map((m) => ({
          ManifestId: m.ManifestId,
          Study: m.StudyId,
          ExpectedSamples: m.ExpectedSamples,
          Status: m.Status as GateStatus,
          StatusLabel: t(
            `receive.status.${
              m.Status === 'volume-hold' ? 'volumeHold' : m.Status
            }`,
          ),
          ReceivedAt: m.ReceivedAt,
          SamplesLabel: t('receive.recentManifests.samples'),
        })),
        EmptyLabel: t('receive.recentManifests.empty'),
      },

      ParcelReception: {
        Heading: t('receive.parcel.heading'),
        Checklist: [
          {
            Id: 'sample-condition',
            Label: t('receive.parcel.sampleCondition'),
          },
          { Id: 'seal-intact', Label: t('receive.parcel.sealIntact') },
          { Id: 'temp-indicator', Label: t('receive.parcel.tempIndicator') },
          { Id: 'courier-name', Label: t('receive.parcel.courierName') },
        ],
        ConfirmReceiptLabel: t('receive.parcel.confirmReceipt'),
        ScannedByLabel: t('receive.parcel.scannedBy'),
        ScannedByValue: 'Dr. Liora Vasquez',
        VerifiedByLabel: t('receive.parcel.verifiedBy'),
        VerifiedByPlaceholder: t('receive.parcel.verifiedByPlaceholder'),
      },

      TemperatureLogs: {
        Heading: t('receive.temp.heading'),
        DateRangeLabel: t('receive.temp.dateRange'),
        Columns: {
          Col1: t('receive.temp.col.timestamp'),
          Col2: t('receive.temp.col.sensorId'),
          Col3: t('receive.temp.col.temperature'),
          Col4: t('receive.temp.col.thresholdStatus'),
        },
        EmptyLabel: t('receive.temp.empty'),
      },

      BarcodeScanning: {
        Heading: t('receive.scan.heading'),
        ScannerPlaceholder: t('receive.scan.scannerPlaceholder'),
        ScanButtonLabel: t('receive.scan.scanButton'),
        StartBatchLabel: t('receive.scan.startBatch'),
        Columns: {
          Col1: t('receive.scan.col.sampleId'),
          Col2: t('receive.scan.col.timestamp'),
          Col3: t('receive.scan.col.operator'),
          Col4: t('receive.scan.col.status'),
        },
        EmptyLabel: t('receive.scan.empty'),
      },
    });
  },
};

// --- Component ---

export default function Receive({ Data }: PageProps<ReceiveData>) {
  const d = Data!;

  return (
    <div class='space-y-6'>
      <div>
        <h1 class='text-xl font-bold text-primary'>{d.Heading}</h1>
      </div>

      <ReceptionTabs
        tabLabels={d.TabLabels}
        manifestForm={{
          manifestIdLabel: d.ManifestForm.ManifestIdLabel,
          manifestIdPlaceholder: d.ManifestForm.ManifestIdPlaceholder,
          studyLabel: d.ManifestForm.StudyLabel,
          studyPlaceholder: d.ManifestForm.StudyPlaceholder,
          studyOptions: d.ManifestForm.StudyOptions.map((s) => ({
            value: s.Value,
            label: s.Label,
          })),
          shipmentIdLabel: d.ManifestForm.ShipmentIdLabel,
          shipmentIdPlaceholder: d.ManifestForm.ShipmentIdPlaceholder,
          expectedSamplesLabel: d.ManifestForm.ExpectedSamplesLabel,
          expectedSamplesPlaceholder: d.ManifestForm.ExpectedSamplesPlaceholder,
          originSiteLabel: d.ManifestForm.OriginSiteLabel,
          originSitePlaceholder: d.ManifestForm.OriginSitePlaceholder,
          destinationSiteLabel: d.ManifestForm.DestinationSiteLabel,
          destinationSitePlaceholder: d.ManifestForm.DestinationSitePlaceholder,
          waybillNumberLabel: d.ManifestForm.WaybillNumberLabel,
          waybillNumberPlaceholder: d.ManifestForm.WaybillNumberPlaceholder,
          carrierLabel: d.ManifestForm.CarrierLabel,
          carrierPlaceholder: d.ManifestForm.CarrierPlaceholder,
          periodLabel: d.ManifestForm.PeriodLabel,
          periodPlaceholder: d.ManifestForm.PeriodPlaceholder,
          submitLabel: d.ManifestForm.SubmitLabel,
        }}
        recentManifests={{
          heading: d.RecentManifests.Heading,
          items: d.RecentManifests.Items.map((m) => ({
            manifestId: m.ManifestId,
            study: m.Study,
            expectedSamples: m.ExpectedSamples,
            status: m.Status,
            statusLabel: m.StatusLabel,
            receivedAt: m.ReceivedAt,
            samplesLabel: m.SamplesLabel,
          })),
          emptyLabel: d.RecentManifests.EmptyLabel,
        }}
        parcelReception={{
          heading: d.ParcelReception.Heading,
          checklist: d.ParcelReception.Checklist.map((c) => ({
            id: c.Id,
            label: c.Label,
          })),
          confirmReceiptLabel: d.ParcelReception.ConfirmReceiptLabel,
          scannedByLabel: d.ParcelReception.ScannedByLabel,
          scannedByValue: d.ParcelReception.ScannedByValue,
          verifiedByLabel: d.ParcelReception.VerifiedByLabel,
          verifiedByPlaceholder: d.ParcelReception.VerifiedByPlaceholder,
        }}
        temperatureLogs={{
          heading: d.TemperatureLogs.Heading,
          dateRangeLabel: d.TemperatureLogs.DateRangeLabel,
          columns: {
            col1: d.TemperatureLogs.Columns.Col1,
            col2: d.TemperatureLogs.Columns.Col2,
            col3: d.TemperatureLogs.Columns.Col3,
            col4: d.TemperatureLogs.Columns.Col4,
          },
          emptyLabel: d.TemperatureLogs.EmptyLabel,
        }}
        barcodeScanning={{
          heading: d.BarcodeScanning.Heading,
          scannerPlaceholder: d.BarcodeScanning.ScannerPlaceholder,
          scanButtonLabel: d.BarcodeScanning.ScanButtonLabel,
          startBatchLabel: d.BarcodeScanning.StartBatchLabel,
          columns: {
            col1: d.BarcodeScanning.Columns.Col1,
            col2: d.BarcodeScanning.Columns.Col2,
            col3: d.BarcodeScanning.Columns.Col3,
            col4: d.BarcodeScanning.Columns.Col4,
          },
          emptyLabel: d.BarcodeScanning.EmptyLabel,
        }}
      />
    </div>
  );
}
