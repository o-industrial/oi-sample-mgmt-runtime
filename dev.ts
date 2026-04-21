import "preact/compat";
import { start } from "@fathym/eac/runtime/server";
import { config, configure } from "./configs/eac-runtime.config.ts";
import { getOIHooks, getWorkflowHooks } from "./src/data/hooks.ts";

Deno.env.set("EAC_RUNTIME_DEV", "true");
Deno.env.set("PORT", Deno.env.get("PORT") || "5418");

// Auto-seed demo data if KV is empty
const oiHooks = await getOIHooks();
const samples = await oiHooks.LIMSDataSync();

if (samples.length === 0) {
  const workflowHooks = await getWorkflowHooks();
  const oiResult = await oiHooks.Seed();
  const workflowResult = await workflowHooks.Seed();

  console.log(
    `Auto-seeded ${oiResult.Seeded + workflowResult.Seeded} demo records`,
  );
}

await start(await config, { configure });
