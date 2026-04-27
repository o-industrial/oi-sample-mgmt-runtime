import { useState } from "preact/hooks";
import TurboTaxStatus from "./TurboTaxStatus.tsx";

export const IsIsland = true;

// --- Prop types (camelCase for island props) ---

type StudyOption = {
  value: string;
  label: string;
};

type RecentManifestItem = {
  manifestId: string;
  study: string;
  expectedSamples: number;
  status: "ready" | "attention" | "volume-hold" | "problem";
  statusLabel: string;
  receivedAt: string;
  samplesLabel: string;
};

type ChecklistItem = {
  id: string;
  label: string;
};

type ManifestFormProps = {
  manifestIdLabel: string;
  manifestIdPlaceholder: string;
  studyLabel: string;
  studyPlaceholder: string;
  studyOptions: StudyOption[];
  shipmentIdLabel: string;
  shipmentIdPlaceholder: string;
  expectedSamplesLabel: string;
  expectedSamplesPlaceholder: string;
  originSiteLabel: string;
  originSitePlaceholder: string;
  destinationSiteLabel: string;
  destinationSitePlaceholder: string;
  waybillNumberLabel: string;
  waybillNumberPlaceholder: string;
  carrierLabel: string;
  carrierPlaceholder: string;
  periodLabel: string;
  periodPlaceholder: string;
  submitLabel: string;
};

type RecentManifestsProps = {
  heading: string;
  items: RecentManifestItem[];
  emptyLabel: string;
};

type ParcelReceptionProps = {
  heading: string;
  checklist: ChecklistItem[];
  confirmReceiptLabel: string;
  scannedByLabel: string;
  scannedByValue: string;
  verifiedByLabel: string;
  verifiedByPlaceholder: string;
};

type ColumnHeaders = {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
};

type TemperatureLogsProps = {
  heading: string;
  dateRangeLabel: string;
  columns: ColumnHeaders;
  emptyLabel: string;
};

type BarcodeScanningProps = {
  heading: string;
  scannerPlaceholder: string;
  scanButtonLabel: string;
  startBatchLabel: string;
  columns: ColumnHeaders;
  emptyLabel: string;
};

type ReceptionTabsProps = {
  tabLabels: string[];
  manifestForm: ManifestFormProps;
  recentManifests: RecentManifestsProps;
  parcelReception: ParcelReceptionProps;
  temperatureLogs: TemperatureLogsProps;
  barcodeScanning: BarcodeScanningProps;
};

// --- Helpers ---

function FormField(
  { label, type, name, placeholder }: {
    label: string;
    type: string;
    name: string;
    placeholder?: string;
  },
) {
  return (
    <div>
      <label class="block text-sm font-medium text-on-surface mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        class="w-full border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:ring-2 focus:ring-focus"
      />
    </div>
  );
}

// --- Tab Content Components ---

function ManifestUploadTab(
  { form, recent }: { form: ManifestFormProps; recent: RecentManifestsProps },
) {
  return (
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT: 9-field form */}
      <div class="lg:col-span-2 rounded-lg border border-border bg-surface-card p-6">
        <h2 class="text-base font-semibold text-on-surface mb-4">
          {form.submitLabel}
        </h2>
        <form class="space-y-4">
          <FormField
            label={form.manifestIdLabel}
            type="text"
            name="manifestId"
            placeholder={form.manifestIdPlaceholder}
          />
          <div>
            <label class="block text-sm font-medium text-on-surface mb-1">
              {form.studyLabel}
            </label>
            <select
              name="studyId"
              class="w-full border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-focus"
            >
              <option value="">{form.studyPlaceholder}</option>
              {form.studyOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <FormField
            label={form.shipmentIdLabel}
            type="text"
            name="shipmentId"
            placeholder={form.shipmentIdPlaceholder}
          />
          <FormField
            label={form.expectedSamplesLabel}
            type="number"
            name="expectedSamples"
            placeholder={form.expectedSamplesPlaceholder}
          />
          <FormField
            label={form.originSiteLabel}
            type="text"
            name="originSite"
            placeholder={form.originSitePlaceholder}
          />
          <FormField
            label={form.destinationSiteLabel}
            type="text"
            name="destinationSite"
            placeholder={form.destinationSitePlaceholder}
          />
          <FormField
            label={form.waybillNumberLabel}
            type="text"
            name="waybillNumber"
            placeholder={form.waybillNumberPlaceholder}
          />
          <FormField
            label={form.carrierLabel}
            type="text"
            name="carrier"
            placeholder={form.carrierPlaceholder}
          />
          <FormField
            label={form.periodLabel}
            type="text"
            name="period"
            placeholder={form.periodPlaceholder}
          />
          <button
            type="submit"
            class="w-full px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            {form.submitLabel}
          </button>
        </form>
      </div>

      {/* RIGHT: Recent Manifests */}
      <div class="rounded-lg border border-border bg-surface-card p-6">
        <h2 class="text-base font-semibold text-on-surface mb-4">
          {recent.heading}
        </h2>
        {recent.items.length === 0
          ? <p class="text-sm text-on-surface-muted">{recent.emptyLabel}</p>
          : (
            <div class="space-y-3">
              {recent.items.map((m) => (
                <div
                  key={m.manifestId}
                  class="p-3 border border-border-subtle rounded-lg"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <div class="text-sm font-medium text-on-surface">
                        {m.manifestId}
                      </div>
                      <div class="text-xs text-on-surface-secondary">
                        {m.study} · {m.expectedSamples} {m.samplesLabel}
                      </div>
                      <div class="text-xs text-on-surface-muted mt-1">
                        {m.receivedAt}
                      </div>
                    </div>
                    <TurboTaxStatus status={m.status} label={m.statusLabel} />
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

function ParcelReceptionTab({ data }: { data: ParcelReceptionProps }) {
  const [checked, setChecked] = useState<boolean[]>(
    () => data.checklist.map(() => false),
  );

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <div class="max-w-xl space-y-6">
      <div class="rounded-lg border border-border bg-surface-card p-6">
        <h2 class="text-base font-semibold text-on-surface mb-4">
          {data.heading}
        </h2>
        <div class="space-y-3">
          {data.checklist.map((item, i) => (
            <label
              key={item.id}
              class="flex items-center gap-3 text-sm text-on-surface cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => toggle(i)}
                class="w-4 h-4 rounded border-border-input accent-primary"
              />
              {item.label}
            </label>
          ))}
        </div>

        {/* Two-person authentication */}
        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-on-surface mb-1">
              {data.scannedByLabel}
            </label>
            <input
              type="text"
              value={data.scannedByValue}
              disabled
              class="w-full border border-border bg-surface-inset rounded-md px-3 py-2 text-sm text-on-surface-muted"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-on-surface mb-1">
              {data.verifiedByLabel}
            </label>
            <input
              type="text"
              placeholder={data.verifiedByPlaceholder}
              class="w-full border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:ring-2 focus:ring-focus"
            />
          </div>
        </div>

        <button
          type="button"
          class="mt-6 px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          {data.confirmReceiptLabel}
        </button>
      </div>
    </div>
  );
}

function TemperatureLogsTab({ data }: { data: TemperatureLogsProps }) {
  return (
    <div class="rounded-lg border border-border bg-surface-card p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-semibold text-on-surface">
          {data.heading}
        </h2>
        <div class="flex items-center gap-2 text-sm">
          <span class="text-on-surface-secondary">{data.dateRangeLabel}</span>
          <input
            type="date"
            class="border border-border-input bg-surface rounded px-2 py-1 text-sm text-on-surface"
          />
          <span class="text-on-surface-muted">—</span>
          <input
            type="date"
            class="border border-border-input bg-surface rounded px-2 py-1 text-sm text-on-surface"
          />
        </div>
      </div>
      <table class="w-full text-sm">
        <thead>
          <tr class="text-left text-on-surface-secondary border-b border-border">
            <th class="pb-2 font-medium">{data.columns.col1}</th>
            <th class="pb-2 font-medium">{data.columns.col2}</th>
            <th class="pb-2 font-medium">{data.columns.col3}</th>
            <th class="pb-2 font-medium">{data.columns.col4}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              colSpan={4}
              class="py-8 text-center text-on-surface-muted"
            >
              {data.emptyLabel}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function BarcodeScanningTab({ data }: { data: BarcodeScanningProps }) {
  return (
    <div class="space-y-4">
      <div class="rounded-lg border border-border bg-surface-card p-6">
        <h2 class="text-base font-semibold text-on-surface mb-4">
          {data.heading}
        </h2>
        <div class="flex gap-3 mb-4">
          <input
            type="text"
            placeholder={data.scannerPlaceholder}
            class="flex-1 border border-border-input bg-surface rounded-md px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-muted focus:outline-none focus:ring-2 focus:ring-focus"
          />
          <button
            type="button"
            class="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            {data.scanButtonLabel}
          </button>
        </div>
        <button
          type="button"
          class="px-4 py-2 border border-border rounded-md text-sm text-on-surface hover:bg-surface-elevated transition-colors"
        >
          {data.startBatchLabel}
        </button>
      </div>

      <div class="rounded-lg border border-border bg-surface-card p-6">
        <table class="w-full text-sm">
          <thead>
            <tr class="text-left text-on-surface-secondary border-b border-border">
              <th class="pb-2 font-medium">{data.columns.col1}</th>
              <th class="pb-2 font-medium">{data.columns.col2}</th>
              <th class="pb-2 font-medium">{data.columns.col3}</th>
              <th class="pb-2 font-medium">{data.columns.col4}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={4}
                class="py-8 text-center text-on-surface-muted"
              >
                {data.emptyLabel}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Main Island ---

export default function ReceptionTabs({
  tabLabels,
  manifestForm,
  recentManifests,
  parcelReception,
  temperatureLogs,
  barcodeScanning,
}: ReceptionTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      {/* Tab bar */}
      <div class="flex border-b border-border mb-6">
        {tabLabels.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => setActiveTab(i)}
            class={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === i
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-secondary hover:text-on-surface"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 0 && (
        <ManifestUploadTab form={manifestForm} recent={recentManifests} />
      )}
      {activeTab === 1 && <ParcelReceptionTab data={parcelReception} />}
      {activeTab === 2 && <TemperatureLogsTab data={temperatureLogs} />}
      {activeTab === 3 && <BarcodeScanningTab data={barcodeScanning} />}
    </div>
  );
}
