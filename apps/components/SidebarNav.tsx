import { useState } from 'preact/hooks';

export const IsIsland = true;

type NavLink = {
  href: string;
  label: string;
};

type SidebarNavProps = {
  links: NavLink[];
};

export default function SidebarNav({ links }: SidebarNavProps) {
  const [open, setOpen] = useState(false);

  const navContent = (
    <>
      <div class="text-lg font-bold text-primary mb-6">Sample Mgmt</div>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          class="px-3 py-2 rounded text-sm text-on-surface hover:bg-surface-card transition-colors"
          data-eac-bypass-base
          onClick={() => setOpen(false)}
        >
          {link.label}
        </a>
      ))}
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <nav class="hidden md:flex w-56 shrink-0 border-r border-border bg-surface-elevated flex-col p-4 gap-1">
        {navContent}
      </nav>

      {/* Mobile top bar */}
      <div class="md:hidden flex items-center justify-between border-b border-border bg-surface-elevated px-4 py-3">
        <span class="text-lg font-bold text-primary">Sample Mgmt</span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          class="p-2 rounded text-on-surface hover:bg-surface-card transition-colors"
          aria-label="Toggle navigation"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div class="md:hidden fixed inset-0 z-40 flex">
          <div
            class="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <nav class="relative z-50 w-64 bg-surface-elevated flex flex-col p-4 gap-1 shadow-xl">
            {navContent}
          </nav>
        </div>
      )}
    </>
  );
}
