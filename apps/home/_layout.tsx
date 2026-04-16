import { PageProps } from '@fathym/eac-applications/preact';
import { OISampleMgmtWebState } from '../../src/state/OISampleMgmtWebState.ts';
import SidebarNav from '../components/SidebarNav.tsx';

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
        <title>Human Biological Sample Management</title>
        <link
          rel="stylesheet"
          href={`/tailwind/styles.css?Revision=${Revision}`}
          data-eac-bypass-base
        />
      </head>
      <body class="bg-surface text-on-surface min-h-screen flex flex-col md:flex-row">
        <SidebarNav links={navLinks} />

        <main class="flex-1 overflow-y-auto p-6">
          <Component />
        </main>
      </body>
    </html>
  );
}
