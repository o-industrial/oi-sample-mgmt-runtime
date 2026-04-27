import type { JSX } from "preact";
import { PageProps } from "@fathym/eac-applications/preact";
import { EaCRuntimeHandlerSet } from "@fathym/eac/runtime/pipelines";
import { sampleMgmtDiscoverySummary } from "../../../src/marketing/sample-mgmt-one-pager.ts";

export const IsIsland = true;

type OnePagerPageData = Record<string, never>;

export const handler: EaCRuntimeHandlerSet<
  Record<string, never>,
  OnePagerPageData
> = {
  GET: (_req, ctx) => ctx.Render({}),
};

export default function SampleMgmtOnePagerPage(
  {}: PageProps<OnePagerPageData>,
): JSX.Element {
  const {
    eyebrow,
    headline,
    personas,
    workflows,
    builtFromScott,
    openQuestions,
    closingNote,
  } = sampleMgmtDiscoverySummary;

  return (
    <div class="min-h-screen bg-white text-neutral-900 print:bg-white">
      <div class="mx-auto max-w-4xl px-8 py-12 print:px-0 print:py-0">
        {/* Header */}
        <div class="mb-8 border-b border-neutral-200 pb-6">
          <div class="text-xs uppercase tracking-widest text-purple-600 font-semibold">
            {eyebrow}
          </div>
        </div>

        <div class="mb-8">
          <h1 class="text-3xl font-bold text-neutral-900">{headline}</h1>
        </div>

        {/* Persona Table */}
        <h2 class="text-xl font-bold text-neutral-900 mt-10 mb-4">Personas</h2>
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-neutral-300">
              <th class="py-2 text-left font-semibold text-neutral-700">
                Name
              </th>
              <th class="py-2 text-left font-semibold text-neutral-700">
                Role
              </th>
              <th class="py-2 text-left font-semibold text-neutral-700">
                Responsibility
              </th>
              <th class="py-2 text-left font-semibold text-neutral-700">
                Landing Page
              </th>
            </tr>
          </thead>
          <tbody>
            {personas.map((p) => (
              <tr class="border-b border-neutral-200">
                <td class="py-2 font-medium">{p.name}</td>
                <td class="py-2 text-neutral-600">{p.role}</td>
                <td class="py-2 text-neutral-600 text-xs">
                  {p.responsibility}
                </td>
                <td class="py-2 font-mono text-purple-600 text-xs">
                  {p.landingPage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Workflow Matrix */}
        <h2 class="text-xl font-bold text-neutral-900 mt-10 mb-4">Workflows</h2>
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-neutral-300">
              <th class="py-2 text-left font-semibold text-neutral-700">
                Persona
              </th>
              <th class="py-2 text-left font-semibold text-neutral-700">
                Workflow
              </th>
              <th class="py-2 text-left font-semibold text-neutral-700">
                Pages
              </th>
              <th class="py-2 text-left font-semibold text-neutral-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((w) => (
              <tr class="border-b border-neutral-200">
                <td class="py-2 font-medium">{w.persona}</td>
                <td class="py-2 text-neutral-600">{w.workflow}</td>
                <td class="py-2 text-neutral-600 text-xs">
                  {w.pages.join(", ")}
                </td>
                <td class="py-2">
                  <span
                    class={`px-2 py-0.5 rounded text-xs font-medium ${
                      w.status === "seeded"
                        ? "bg-blue-100 text-blue-700"
                        : w.status === "live"
                        ? "bg-green-100 text-green-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {w.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Built From What You Said */}
        <h2 class="text-xl font-bold text-neutral-900 mt-10 mb-4">
          Built From What You Said
        </h2>
        <div class="space-y-4">
          {builtFromScott.map((b) => (
            <blockquote class="border-l-4 border-purple-200 pl-4">
              <p class="text-neutral-600 italic">
                "{b.quote}"{" "}
                <span class="text-neutral-400 text-xs">({b.source})</span>
              </p>
              <p class="text-neutral-900 text-sm mt-1">{b.feature}</p>
            </blockquote>
          ))}
        </div>

        {/* Open Questions */}
        <h2 class="text-xl font-bold text-neutral-900 mt-10 mb-4">
          Open Questions
        </h2>
        <ol class="space-y-3 list-decimal list-inside">
          {openQuestions.map((q) => (
            <li>
              <span class="font-medium text-neutral-900">{q.question}</span>
              <p class="text-neutral-500 text-sm ml-5">{q.context}</p>
            </li>
          ))}
        </ol>

        {/* Closing Note */}
        <p class="text-neutral-500 text-sm italic text-center mt-8">
          {closingNote}
        </p>

        {/* Footer */}
        <div class="mt-8 border-t border-neutral-200 pt-4 text-center text-xs text-neutral-400">
          &copy; {new Date().getFullYear()}{" "}
          Open Industrial. Built on MCP. Azure-native. Open architecture.
        </div>
      </div>

      {/* Print button (hidden when printing) */}
      <div class="fixed bottom-8 right-8 print:hidden">
        <button
          type="button"
          onClick={() => globalThis.print()}
          class="rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-lg hover:from-purple-700 hover:to-cyan-700"
        >
          Print / Save as PDF
        </button>
      </div>
    </div>
  );
}
