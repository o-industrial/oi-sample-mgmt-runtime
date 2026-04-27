import { EaCRuntimeHandlers } from "@fathym/eac/runtime/pipelines";
import { OISampleMgmtWebState } from "../../../src/state/OISampleMgmtWebState.ts";
import { getOIHooks, getWorkflowHooks } from "../../../src/data/hooks.ts";
import type { TurboTaxStatus } from "../../../src/data/types/TurboTaxStatus.ts";
import type { PaneViewData } from "../../../src/data/types/PaneViewData.ts";
import type { ManagementOverlayData } from "../../../src/data/types/ManagementOverlayData.ts";

function countByStatus(
  items: Array<{ Status: TurboTaxStatus }>,
): Omit<PaneViewData, "Id"> {
  let Ready = 0, Attention = 0, VolumeHold = 0, Problem = 0;

  for (const item of items) {
    if (item.Status === "ready") Ready++;
    else if (item.Status === "attention") Attention++;
    else if (item.Status === "volume-hold") VolumeHold++;
    else if (item.Status === "problem") Problem++;
  }

  return { Total: items.length, Ready, Attention, VolumeHold, Problem };
}

export default {
  async GET(_req, _ctx) {
    const oiHooks = await getOIHooks();
    const workflowHooks = await getWorkflowHooks();

    const [
      manifests,
      transfers,
      returns,
      reconciliations,
      dispositions,
      effortData,
      capacityData,
    ] = await Promise.all([
      oiHooks.LatestManifest(),
      workflowHooks.ListTransfers(),
      workflowHooks.ListReturns(),
      workflowHooks.ListReconciliations(),
      workflowHooks.ListDispositions(),
      oiHooks.EffortTracking(),
      oiHooks.CapacityForecasting(),
    ]);

    const Panes: PaneViewData[] = [
      { Id: "incoming", ...countByStatus(manifests) },
      { Id: "transfers", ...countByStatus(transfers) },
      { Id: "returns", ...countByStatus(returns) },
      { Id: "reconciliations", ...countByStatus(reconciliations) },
      { Id: "dispositions", ...countByStatus(dispositions) },
    ];

    const ManagementOverlay: ManagementOverlayData = {
      EffortData: effortData,
      CapacityData: capacityData,
    };

    return Response.json({ Panes, ManagementOverlay });
  },
} as EaCRuntimeHandlers<OISampleMgmtWebState>;
