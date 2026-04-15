import "preact/compat";
import { start } from "@fathym/eac/runtime/server";
import { config, configure } from "./configs/eac-runtime.config.ts";

// deno-lint-ignore no-explicit-any
await start((await config) as any, { configure });
