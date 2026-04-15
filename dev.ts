import "preact/compat";
import { start } from "@fathym/eac/runtime/server";
import { config, configure } from "./configs/eac-runtime.config.ts";

Deno.env.set("EAC_RUNTIME_DEV", "true");
Deno.env.set("PORT", Deno.env.get("PORT") || "5418");

// deno-lint-ignore no-explicit-any
await start((await config) as any, { configure });
