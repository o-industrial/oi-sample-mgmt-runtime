/**
 * Shared selectors for Playwright E2E scenarios.
 *
 * Strategy: Prefer Playwright semantic selectors (getByRole, getByText).
 * These constants cover elements that are hard to target semantically.
 */

// --- Notification Bell ---
export const NOTIFICATION_BELL =
  'button[aria-label*="notification" i], button[aria-label*="Notification" i]';
export const NOTIFICATION_PANEL = '[data-testid="notification-panel"]';
export const notificationItem = (id: string) =>
  `[data-testid="notification-${id}"]`;

// --- Navigation ---
export const SIDEBAR_NAV = "nav";
export const sidebarLink = (href: string) => `nav a[href="${href}"]`;

// --- TurboTax Status ---
export const STATUS_READY = '.bg-status-ready-bg, [class*="status-ready"]';
export const STATUS_ATTENTION =
  '.bg-status-attention-bg, [class*="status-attention"]';
export const STATUS_HOLD = '.bg-status-hold-bg, [class*="status-hold"]';
export const STATUS_PROBLEM =
  '.bg-status-problem-bg, [class*="status-problem"]';

// --- Dashboard ---
export const MANAGEMENT_OVERLAY_TOGGLE =
  'button:has-text("Management"), button:has-text("management")';
export const REVIEW_QUEUE = '[class*="review"], section:has-text("Review")';

// --- Tabs (Receive page) ---
export const tab = (label: string) =>
  `button:has-text("${label}"), [role="tab"]:has-text("${label}")`;
