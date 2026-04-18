import { EaCBaseClient } from '@fathym/eac/steward/clients';
import type {
  SampleRecord,
  ManifestRecord,
  StudyRecord,
  AuditEventRecord,
  EthicsApprovalRecord,
  TransferRecord,
  ReturnRecord,
  ReconciliationRecord,
  PaneViewData,
  ManagementOverlayData,
} from '../data/types/mod.ts';

export interface SampleMgmtClientOptions {
  apiToken?: string;
  basePath?: string;
  baseUrl?: string | URL;
}

function resolveBaseUrl(options: SampleMgmtClientOptions): URL {
  const { baseUrl, basePath } = options;

  if (baseUrl instanceof URL) return new URL(baseUrl.href);

  if (typeof baseUrl === 'string' && baseUrl.trim().length > 0) {
    try {
      return new URL(baseUrl);
    } catch {
      return new URL(baseUrl, 'http://localhost:5418');
    }
  }

  return new URL(basePath ?? '/', 'http://localhost:5418');
}

export class SampleMgmtAPIClient extends EaCBaseClient {
  constructor(options: SampleMgmtClientOptions = {}) {
    const baseUrl = resolveBaseUrl(options);
    super(baseUrl, options.apiToken ?? '');
  }

  public async Seed(): Promise<{ Seeded: number; OI: number; Workflow: number }> {
    const res = await fetch(this.loadClientUrl('/api/seed'), {
      method: 'POST',
      headers: this.loadHeaders(),
    });

    return this.json(res);
  }

  public get Dashboard() {
    return {
      Load: async (): Promise<{
        Panes: PaneViewData[];
        ManagementOverlay: ManagementOverlayData;
      }> => {
        const res = await fetch(this.loadClientUrl('/api/dashboard'), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
    };
  }

  public get Samples() {
    return {
      List: async (): Promise<SampleRecord[]> => {
        const res = await fetch(this.loadClientUrl('/api/samples'), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
    };
  }

  public get Manifests() {
    return {
      List: async (): Promise<ManifestRecord[]> => {
        const res = await fetch(this.loadClientUrl('/api/manifests'), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
    };
  }

  public get Studies() {
    return {
      List: async (): Promise<StudyRecord[]> => {
        const res = await fetch(this.loadClientUrl('/api/studies'), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
    };
  }

  public get AuditEvents() {
    return {
      List: async (): Promise<AuditEventRecord[]> => {
        const res = await fetch(this.loadClientUrl('/api/audit-events'), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
    };
  }

  public get EthicsApprovals() {
    return {
      List: async (): Promise<EthicsApprovalRecord[]> => {
        const res = await fetch(this.loadClientUrl('/api/ethics-approvals'), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
    };
  }

  public get Transfers() {
    return {
      List: async (filter?: {
        type?: string;
        status?: string;
      }): Promise<TransferRecord[]> => {
        const params = new URLSearchParams();
        if (filter?.type) params.set('type', filter.type);
        if (filter?.status) params.set('status', filter.status);
        const qs = params.toString();
        const path = qs ? `/api/transfers?${qs}` : '/api/transfers';
        const res = await fetch(this.loadClientUrl(path), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
    };
  }

  public get Returns() {
    return {
      List: async (): Promise<ReturnRecord[]> => {
        const res = await fetch(this.loadClientUrl('/api/returns'), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
    };
  }

  public get Reconciliations() {
    return {
      List: async (): Promise<ReconciliationRecord[]> => {
        const res = await fetch(this.loadClientUrl('/api/reconciliations'), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
    };
  }
}
