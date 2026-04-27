import { EaCBaseClient } from "@fathym/eac/steward/clients";
import type { SampleRecord } from "../data/types/SampleRecord.ts";
import type { ManifestRecord } from "../data/types/ManifestRecord.ts";
import type { StudyRecord } from "../data/types/StudyRecord.ts";
import type { AuditEventRecord } from "../data/types/AuditEventRecord.ts";
import type { EthicsApprovalRecord } from "../data/types/EthicsApprovalRecord.ts";
import type { TransferRecord } from "../data/types/TransferRecord.ts";
import type { ReturnRecord } from "../data/types/ReturnRecord.ts";
import type { ReconciliationRecord } from "../data/types/ReconciliationRecord.ts";
import type { DispositionRecord } from "../data/types/DispositionRecord.ts";
import type { ReviewRecord } from "../data/types/ReviewRecord.ts";
import type { CustodyTimelineRecord } from "../data/types/CustodyTimelineRecord.ts";
import type { NotificationRecord } from "../data/types/NotificationRecord.ts";
import type { ApprovalRecord } from "../data/types/ApprovalRecord.ts";
import type { StudyRoleMappingRecord } from "../data/types/StudyRoleMappingRecord.ts";
import type { PaneViewData } from "../data/types/PaneViewData.ts";
import type { ManagementOverlayData } from "../data/types/ManagementOverlayData.ts";

export interface SampleMgmtClientOptions {
  apiToken?: string;
  basePath?: string;
  baseUrl?: string | URL;
}

function resolveBaseUrl(options: SampleMgmtClientOptions): URL {
  const { baseUrl, basePath } = options;

  if (baseUrl instanceof URL) return new URL(baseUrl.href);

  if (typeof baseUrl === "string" && baseUrl.trim().length > 0) {
    try {
      return new URL(baseUrl);
    } catch {
      return new URL(baseUrl, "http://localhost:5418");
    }
  }

  return new URL(basePath ?? "/", "http://localhost:5418");
}

export class SampleMgmtAPIClient extends EaCBaseClient {
  constructor(options: SampleMgmtClientOptions = {}) {
    const baseUrl = resolveBaseUrl(options);
    super(baseUrl, options.apiToken ?? "");
  }

  public async Seed(): Promise<
    { Seeded: number; OI: number; Workflow: number }
  > {
    const res = await fetch(this.loadClientUrl("/api/seed"), {
      method: "POST",
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
        const res = await fetch(this.loadClientUrl("/api/dashboard"), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
    };
  }

  public get Samples() {
    return {
      List: async (): Promise<SampleRecord[]> => {
        const res = await fetch(this.loadClientUrl("/api/samples"), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
    };
  }

  public get Manifests() {
    return {
      List: async (): Promise<ManifestRecord[]> => {
        const res = await fetch(this.loadClientUrl("/api/manifests"), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
    };
  }

  public get Studies() {
    return {
      List: async (): Promise<StudyRecord[]> => {
        const res = await fetch(this.loadClientUrl("/api/studies"), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
    };
  }

  public get AuditEvents() {
    return {
      List: async (): Promise<AuditEventRecord[]> => {
        const res = await fetch(this.loadClientUrl("/api/audit-events"), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
    };
  }

  public get EthicsApprovals() {
    return {
      List: async (): Promise<EthicsApprovalRecord[]> => {
        const res = await fetch(this.loadClientUrl("/api/ethics-approvals"), {
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
        if (filter?.type) params.set("type", filter.type);
        if (filter?.status) params.set("status", filter.status);
        const qs = params.toString();
        const path = qs ? `/api/transfers?${qs}` : "/api/transfers";
        const res = await fetch(this.loadClientUrl(path), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
      Create: async (data: {
        Type: string;
        SampleIds: string[];
        Source: string;
        Destination: string;
        RequestedBy: string;
        StudyRef: string;
        StatusReason?: string;
        SlaDeadline: string;
      }): Promise<TransferRecord> => {
        const headers = new Headers(this.loadHeaders());
        headers.set("Content-Type", "application/json");
        const res = await fetch(this.loadClientUrl("/api/transfers"), {
          method: "POST",
          headers,
          body: JSON.stringify({ action: "create", ...data }),
        });
        return this.json(res);
      },
      UpdateStatus: async (
        transferId: string,
        status: string,
        statusReason: string,
        userId: string,
      ): Promise<TransferRecord> => {
        const headers = new Headers(this.loadHeaders());
        headers.set("Content-Type", "application/json");
        const res = await fetch(this.loadClientUrl("/api/transfers"), {
          method: "POST",
          headers,
          body: JSON.stringify({
            action: "update-status",
            TransferId: transferId,
            Status: status,
            StatusReason: statusReason,
            UserId: userId,
          }),
        });
        return this.json(res);
      },
    };
  }

  public get Returns() {
    return {
      List: async (): Promise<ReturnRecord[]> => {
        const res = await fetch(this.loadClientUrl("/api/returns"), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
      Create: async (data: {
        SampleIds: string[];
        Destination: string;
        Reason: string;
        RequestedBy: string;
        PackagingInstructions: string;
        StudyRef: string;
      }): Promise<ReturnRecord> => {
        const headers = new Headers(this.loadHeaders());
        headers.set("Content-Type", "application/json");
        const res = await fetch(this.loadClientUrl("/api/returns"), {
          method: "POST",
          headers,
          body: JSON.stringify({ action: "create", ...data }),
        });
        return this.json(res);
      },
      UpdateStatus: async (
        returnId: string,
        status: string,
        userId: string,
        outcome?: string,
        depletionContext?: string,
      ): Promise<ReturnRecord> => {
        const headers = new Headers(this.loadHeaders());
        headers.set("Content-Type", "application/json");
        const res = await fetch(this.loadClientUrl("/api/returns"), {
          method: "POST",
          headers,
          body: JSON.stringify({
            action: "update-status",
            ReturnId: returnId,
            Status: status,
            UserId: userId,
            Outcome: outcome,
            DepletionContext: depletionContext,
          }),
        });
        return this.json(res);
      },
    };
  }

  public get Reconciliations() {
    return {
      List: async (): Promise<ReconciliationRecord[]> => {
        const res = await fetch(this.loadClientUrl("/api/reconciliations"), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
      Create: async (data: {
        ManifestId: string;
        DiscrepancyType: string;
        ExpectedCount: number;
        ActualCount: number;
        MissingFields?: string[];
        SlaDeadline: string;
        UserId: string;
      }): Promise<ReconciliationRecord> => {
        const headers = new Headers(this.loadHeaders());
        headers.set("Content-Type", "application/json");
        const res = await fetch(this.loadClientUrl("/api/reconciliations"), {
          method: "POST",
          headers,
          body: JSON.stringify({ action: "create", ...data }),
        });
        return this.json(res);
      },
      Resolve: async (
        reconciliationId: string,
        resolution: string,
        correctionReason: string,
        userId: string,
      ): Promise<ReconciliationRecord> => {
        const headers = new Headers(this.loadHeaders());
        headers.set("Content-Type", "application/json");
        const res = await fetch(this.loadClientUrl("/api/reconciliations"), {
          method: "POST",
          headers,
          body: JSON.stringify({
            action: "resolve",
            ReconciliationId: reconciliationId,
            Resolution: resolution,
            CorrectionReason: correctionReason,
            UserId: userId,
          }),
        });
        return this.json(res);
      },
    };
  }

  public get Dispositions() {
    return {
      List: async (): Promise<DispositionRecord[]> => {
        const res = await fetch(this.loadClientUrl("/api/dispositions"), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
    };
  }

  public get Reviews() {
    return {
      List: async (
        filter?: { Status?: string },
      ): Promise<ReviewRecord[]> => {
        const params = new URLSearchParams();
        if (filter?.Status) params.set("status", filter.Status);
        const qs = params.toString();
        const path = qs ? `/api/reviews?${qs}` : "/api/reviews";
        const res = await fetch(this.loadClientUrl(path), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
      Decide: async (
        reviewId: string,
        decision: string,
        userId: string,
        reason?: string,
      ): Promise<ReviewRecord> => {
        const headers = new Headers(this.loadHeaders());
        headers.set("Content-Type", "application/json");
        const res = await fetch(this.loadClientUrl("/api/reviews"), {
          method: "POST",
          headers,
          body: JSON.stringify({
            ReviewId: reviewId,
            Decision: decision,
            UserId: userId,
            Reason: reason,
          }),
        });
        return this.json(res);
      },
    };
  }

  public get Custody() {
    return {
      Get: async (
        sampleId: string,
      ): Promise<CustodyTimelineRecord | null> => {
        const res = await fetch(
          this.loadClientUrl(
            `/api/custody?sampleId=${encodeURIComponent(sampleId)}`,
          ),
          { headers: this.loadHeaders() },
        );

        if (res.status === 404) return null;

        return this.json(res);
      },
    };
  }

  public get Notifications() {
    return {
      List: async (userId: string): Promise<NotificationRecord[]> => {
        const res = await fetch(
          this.loadClientUrl(
            `/api/notifications?userId=${encodeURIComponent(userId)}`,
          ),
          { headers: this.loadHeaders() },
        );
        return this.json(res);
      },
      MarkRead: async (
        notificationId: string,
      ): Promise<NotificationRecord> => {
        const headers = new Headers(this.loadHeaders());
        headers.set("Content-Type", "application/json");
        const res = await fetch(this.loadClientUrl("/api/notifications"), {
          method: "POST",
          headers,
          body: JSON.stringify({
            action: "mark-read",
            NotificationId: notificationId,
          }),
        });
        return this.json(res);
      },
    };
  }

  public get Approvals() {
    return {
      List: async (
        filter?: { status?: string; type?: string },
      ): Promise<ApprovalRecord[]> => {
        const params = new URLSearchParams();
        if (filter?.status) params.set("status", filter.status);
        if (filter?.type) params.set("type", filter.type);
        const qs = params.toString();
        const path = qs ? `/api/approvals?${qs}` : "/api/approvals";
        const res = await fetch(this.loadClientUrl(path), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
      Initiate: async (data: {
        Type: string;
        RecordId: string;
        StudyRef: string;
        InitiatedBy: string;
        Context?: Record<string, unknown>;
      }): Promise<ApprovalRecord> => {
        const headers = new Headers(this.loadHeaders());
        headers.set("Content-Type", "application/json");
        const res = await fetch(this.loadClientUrl("/api/approvals"), {
          method: "POST",
          headers,
          body: JSON.stringify({ action: "initiate", ...data }),
        });
        return this.json(res);
      },
      Decide: async (
        approvalId: string,
        decision: string,
        userId: string,
        reason?: string,
      ): Promise<ApprovalRecord> => {
        const headers = new Headers(this.loadHeaders());
        headers.set("Content-Type", "application/json");
        const res = await fetch(this.loadClientUrl("/api/approvals"), {
          method: "POST",
          headers,
          body: JSON.stringify({
            action: "decide",
            ApprovalId: approvalId,
            Decision: decision,
            UserId: userId,
            Reason: reason,
          }),
        });
        return this.json(res);
      },
    };
  }

  public get StudyRoleMappings() {
    return {
      List: async (
        studyId?: string,
      ): Promise<StudyRoleMappingRecord[]> => {
        const path = studyId
          ? `/api/study-role-mappings?studyId=${encodeURIComponent(studyId)}`
          : "/api/study-role-mappings";
        const res = await fetch(this.loadClientUrl(path), {
          headers: this.loadHeaders(),
        });
        return this.json(res);
      },
    };
  }
}
