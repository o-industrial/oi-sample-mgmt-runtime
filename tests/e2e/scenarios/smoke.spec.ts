import { expect, test } from "@playwright/test";

test("smoke: homepage loads and redirects", async ({ page }) => {
  await page.goto("/");

  // The default dev user (liora.vasquez / samples:receive) redirects to /receive
  await page.waitForURL("**/receive");
  await expect(page).toHaveURL(/\/receive/);
});

test("smoke: page has content", async ({ page }) => {
  await page.goto("/receive");

  // The receive page should render with recognizable content
  await expect(page.locator("body")).not.toBeEmpty();
});
