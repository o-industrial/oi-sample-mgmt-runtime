import { PageProps } from '@fathym/eac-applications/preact';
import { OISampleMgmtWebState } from '../../src/state/OISampleMgmtWebState.ts';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/receive', label: 'Receive' },
  { href: '/track', label: 'Track' },
  { href: '/report', label: 'Report' },
];

export default function HomeLayout({
  Component,
  Revision,
  Data,
}: PageProps<Record<string, unknown>, OISampleMgmtWebState>) {
  const theme = (Data as { theme?: string } | undefined)?.theme ?? 'oi';

  return (
    <html data-theme={theme}>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>GSK Human Biological Sample Management</title>
        <link
          rel="stylesheet"
          href={`/tailwind/styles.css?Revision=${Revision}`}
          data-eac-bypass-base
        />
      </head>
      <body class="bg-surface text-on-surface min-h-screen flex">
        <nav class="w-56 shrink-0 border-r border-border bg-surface-elevated flex flex-col p-4 gap-1">
          <div class="text-lg font-bold text-primary mb-6">
            Sample Mgmt
          </div>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              class="px-3 py-2 rounded text-sm text-on-surface hover:bg-surface-card transition-colors"
              data-eac-bypass-base
            >
              {link.label}
            </a>
          ))}
        </nav>

        <main class="flex-1 overflow-y-auto p-6">
          <Component />
        </main>
      </body>
    </html>
  );
}
