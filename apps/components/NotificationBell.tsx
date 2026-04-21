import { useEffect, useState } from 'preact/hooks';

export const IsIsland = true;

type NotificationRow = {
  notificationId: string;
  type: string;
  typeLabel: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
};

type NotificationBellProps = {
  userId: string;
  apiBase: string;
  ariaLabel: string;
  panelTitle: string;
  emptyLabel: string;
  markReadLabel: string;
  viewLabel: string;
  unreadLabel: string;
  typeLabels: {
    approvalRequest: string;
    statusChange: string;
    deadlineApproaching: string;
    escalation: string;
  };
  timeAgoLabels: {
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
  };
};

const TYPE_COLORS: Record<string, string> = {
  'approval-request': 'bg-status-attention',
  'status-change': 'bg-link',
  'deadline-approaching': 'bg-status-hold',
  'escalation': 'bg-status-problem',
};

const TYPE_KEY_MAP: Record<string, string> = {
  'approval-request': 'approvalRequest',
  'status-change': 'statusChange',
  'deadline-approaching': 'deadlineApproaching',
  'escalation': 'escalation',
};

function timeAgo(
  dateStr: string,
  labels: NotificationBellProps['timeAgoLabels'],
): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return labels.justNow;
  if (mins < 60) return `${mins} ${labels.minutesAgo}`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ${labels.hoursAgo}`;
  const days = Math.floor(hrs / 24);
  return `${days} ${labels.daysAgo}`;
}

export default function NotificationBell({
  userId,
  apiBase,
  ariaLabel,
  panelTitle,
  emptyLabel,
  markReadLabel,
  viewLabel,
  unreadLabel,
  typeLabels,
  timeAgoLabels,
}: NotificationBellProps) {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch(
          `${apiBase}/api/notifications?userId=${encodeURIComponent(userId)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setNotifications(
            // deno-lint-ignore no-explicit-any
            data.map((n: any) => ({
              notificationId: n.NotificationId as string,
              type: n.Type as string,
              typeLabel: typeLabels[
                TYPE_KEY_MAP[n.Type as string] as keyof typeof typeLabels
              ] ?? (n.Type as string),
              message: n.Message as string,
              createdAt: n.CreatedAt as string,
              read: n.Read as boolean,
              actionUrl: n.ActionUrl as string | undefined,
            })),
          );
        }
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, [userId, apiBase]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleMarkRead(notificationId: string) {
    const res = await fetch(`${apiBase}/api/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'mark-read',
        NotificationId: notificationId,
      }),
    });
    if (res.ok) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === notificationId ? { ...n, read: true } : n
        )
      );
    }
  }

  return (
    <div class='relative'>
      {/* Bell button */}
      <button
        type='button'
        onClick={() => setOpen((o) => !o)}
        class='relative p-2 rounded text-on-surface hover:bg-surface-card transition-colors'
        aria-label={ariaLabel}
      >
        <svg
          class='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width={2}
            d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
          />
        </svg>

        {/* Badge */}
        {!loading && unreadCount > 0 && (
          <span class='absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-status-problem text-white'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            class='fixed inset-0 z-40'
            onClick={() => setOpen(false)}
          />
          <div
            data-testid='notification-panel'
            class='absolute right-0 top-full mt-1 z-50 w-80 max-h-96 overflow-y-auto rounded-lg border border-border bg-surface-elevated shadow-xl'
          >
            {/* Panel header */}
            <div class='flex items-center justify-between px-4 py-3 border-b border-border'>
              <h3 class='text-sm font-semibold text-on-surface'>
                {panelTitle}
              </h3>
              {unreadCount > 0 && (
                <span class='text-xs text-on-surface-muted'>
                  {unreadCount} {unreadLabel}
                </span>
              )}
            </div>

            {/* Notification list */}
            {notifications.length === 0
              ? (
                <div class='px-4 py-6 text-center text-sm text-on-surface-muted'>
                  {emptyLabel}
                </div>
              )
              : (
                <div class='divide-y divide-border-subtle'>
                  {notifications.map((n) => (
                    <div
                      key={n.notificationId}
                      data-testid={`notification-${n.notificationId}`}
                      class={`px-4 py-3 ${
                        n.read ? 'opacity-60' : 'bg-surface-card/30'
                      }`}
                    >
                      <div class='flex items-start gap-2'>
                        <span
                          class={`mt-1 shrink-0 w-2 h-2 rounded-full ${
                            n.read
                              ? 'bg-on-surface-muted'
                              : (TYPE_COLORS[n.type] ?? 'bg-link')
                          }`}
                        />
                        <div class='flex-1 min-w-0'>
                          <div class='flex items-center gap-2 mb-0.5'>
                            <span class='text-xs font-medium text-on-surface'>
                              {n.typeLabel}
                            </span>
                            <span class='text-xs text-on-surface-muted'>
                              {timeAgo(n.createdAt, timeAgoLabels)}
                            </span>
                          </div>
                          <p class='text-xs text-on-surface-secondary truncate'>
                            {n.message}
                          </p>
                          <div class='flex gap-2 mt-1'>
                            {n.actionUrl && (
                              <a
                                href={n.actionUrl}
                                data-eac-bypass-base
                                class='text-xs text-link hover:underline'
                                onClick={() => setOpen(false)}
                              >
                                {viewLabel}
                              </a>
                            )}
                            {!n.read && (
                              <button
                                type='button'
                                onClick={() => handleMarkRead(n.notificationId)}
                                class='text-xs text-on-surface-muted hover:text-on-surface'
                              >
                                {markReadLabel}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </>
      )}
    </div>
  );
}
