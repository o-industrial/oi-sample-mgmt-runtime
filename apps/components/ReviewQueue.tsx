import { useState } from "preact/hooks";

export const IsIsland = true;

type ReviewRow = {
  reviewId: string;
  typeLabel: string;
  entityId: string;
  submittedBy: string;
  submittedAt: string;
  validationResult: string;
  validationLabel: string;
  exceptionFlags: string[];
  overdue: boolean;
};

type ReviewQueueProps = {
  reviews: ReviewRow[];
  heading: string;
  subtitle: string;
  columnHeaders: {
    type: string;
    entityId: string;
    submittedBy: string;
    submittedAt: string;
    validation: string;
    exceptions: string;
    actions: string;
  };
  actionLabels: {
    approve: string;
    reject: string;
    escalate: string;
  };
  emptyLabel: string;
  overdueLabel: string;
  apiBase: string;
};

export default function ReviewQueue({
  reviews: initialReviews,
  heading,
  subtitle,
  columnHeaders,
  actionLabels,
  emptyLabel,
  overdueLabel,
  apiBase,
}: ReviewQueueProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [acting, setActing] = useState<string | null>(null);

  async function handleDecide(
    reviewId: string,
    decision: "approved" | "rejected" | "escalated",
  ) {
    let reason: string | undefined;

    if (decision === "rejected") {
      const input = globalThis.prompt("Rejection reason:");
      if (input === null) return;
      reason = input;
    }

    setActing(reviewId);

    try {
      const res = await fetch(`${apiBase}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ReviewId: reviewId,
          Decision: decision,
          UserId: "current-user",
          Reason: reason,
        }),
      });

      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
      }
    } finally {
      setActing(null);
    }
  }

  function validationColor(result: string): string {
    if (result === "passed") return "text-status-ready-text";
    if (result === "warnings") return "text-status-attention-text";
    return "text-status-problem-text";
  }

  if (reviews.length === 0) {
    return (
      <div class="rounded-lg border border-border bg-surface-card p-4">
        <h3 class="text-sm font-semibold text-on-surface mb-1">{heading}</h3>
        <p class="text-xs text-on-surface-muted">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div class="rounded-lg border border-border bg-surface-card p-4">
      <div class="mb-4">
        <h3 class="text-sm font-semibold text-on-surface">{heading}</h3>
        <p class="text-xs text-on-surface-secondary mt-1">{subtitle}</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-border text-left text-xs text-on-surface-secondary">
              <th class="pb-2 pr-3">{columnHeaders.type}</th>
              <th class="pb-2 pr-3">{columnHeaders.entityId}</th>
              <th class="pb-2 pr-3">{columnHeaders.submittedBy}</th>
              <th class="pb-2 pr-3">{columnHeaders.submittedAt}</th>
              <th class="pb-2 pr-3">{columnHeaders.validation}</th>
              <th class="pb-2 pr-3">{columnHeaders.exceptions}</th>
              <th class="pb-2">{columnHeaders.actions}</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr
                key={r.reviewId}
                class={`border-b border-border/50 ${
                  r.overdue ? "bg-status-attention/10" : ""
                }`}
              >
                <td class="py-2 pr-3">
                  <span class="text-xs font-medium">{r.typeLabel}</span>
                </td>
                <td class="py-2 pr-3 font-mono text-xs">{r.entityId}</td>
                <td class="py-2 pr-3">{r.submittedBy}</td>
                <td class="py-2 pr-3 text-xs">
                  {r.submittedAt}
                  {r.overdue && (
                    <span class="ml-1 text-status-attention-text font-medium">
                      {overdueLabel}
                    </span>
                  )}
                </td>
                <td
                  class={`py-2 pr-3 text-xs font-medium ${
                    validationColor(r.validationResult)
                  }`}
                >
                  {r.validationLabel}
                </td>
                <td class="py-2 pr-3">
                  <span class="text-xs">
                    {r.exceptionFlags.join("; ")}
                  </span>
                </td>
                <td class="py-2">
                  <div class="flex gap-1">
                    <button
                      type="button"
                      disabled={acting === r.reviewId}
                      onClick={() => handleDecide(r.reviewId, "approved")}
                      class="px-2 py-1 text-xs rounded bg-status-ready text-white hover:opacity-80 disabled:opacity-50"
                    >
                      {actionLabels.approve}
                    </button>
                    <button
                      type="button"
                      disabled={acting === r.reviewId}
                      onClick={() => handleDecide(r.reviewId, "rejected")}
                      class="px-2 py-1 text-xs rounded bg-status-problem text-white hover:opacity-80 disabled:opacity-50"
                    >
                      {actionLabels.reject}
                    </button>
                    <button
                      type="button"
                      disabled={acting === r.reviewId}
                      onClick={() => handleDecide(r.reviewId, "escalated")}
                      class="px-2 py-1 text-xs rounded bg-status-attention text-white hover:opacity-80 disabled:opacity-50"
                    >
                      {actionLabels.escalate}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
