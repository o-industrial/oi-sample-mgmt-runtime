import { PageProps } from "@fathym/eac-applications/preact";

export default function PilotLayout(
  { Component, Revision }: PageProps,
) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>OI Sample Management — Pilot</title>
        <link
          rel="stylesheet"
          href={`/tailwind/styles.css?Revision=${Revision}`}
          data-eac-bypass-base
        />
      </head>
      <body class="bg-slate-950 text-white min-h-screen">
        <nav class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-slate-900/90 backdrop-blur print:hidden">
          <span class="text-white font-semibold text-sm">
            OI Sample Management
          </span>
          <div class="flex gap-4 text-sm">
            <a
              href="/pilot/one-pager"
              data-eac-bypass-base
              class="text-slate-300 hover:text-white transition-colors"
            >
              One-Pager
            </a>
            <a
              href="/pilot/deck"
              data-eac-bypass-base
              class="text-slate-300 hover:text-white transition-colors"
            >
              Deck
            </a>
            <a
              href="/"
              data-eac-bypass-base
              class="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
            >
              Demo App
            </a>
          </div>
        </nav>

        <main class="pt-14">
          <Component />
        </main>
      </body>
    </html>
  );
}
