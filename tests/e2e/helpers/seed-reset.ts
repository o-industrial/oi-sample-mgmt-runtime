import { Page } from "@playwright/test";

export async function resetSeedData(page: Page): Promise<void> {
  const baseURL = page.url() || "http://localhost:5418";
  const origin = new URL(baseURL).origin || "http://localhost:5418";

  const response = await page.request.post(`${origin}/api/seed`);

  if (!response.ok()) {
    throw new Error(
      `Seed reset failed: ${response.status()} ${response.statusText()}`,
    );
  }
}
