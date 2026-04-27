import { expect, Page, test as base } from "@playwright/test";
import { resetSeedData } from "../helpers/seed-reset";

export type PersonaKey =
  | "elena"
  | "labManager"
  | "scientist"
  | "custodian"
  | "qaAuditor"
  | "studyCoordinator"
  | "csvGroupHead";

export const PERSONA_LANDING: Record<PersonaKey, string> = {
  elena: "/receive",
  labManager: "/",
  scientist: "/return",
  custodian: "/disposition",
  qaAuditor: "/report/audit-trail",
  studyCoordinator: "/track/samples",
  csvGroupHead: "/",
};

export function personaTest(persona: PersonaKey) {
  return base.extend<{ personaPage: Page }>({
    personaPage: async ({ page, context }, use) => {
      // Reset seed data to known state
      await resetSeedData(page);

      // Set persona cookie
      await context.addCookies([
        {
          name: "demo_persona",
          value: persona,
          domain: "localhost",
          path: "/",
        },
      ]);

      // Navigate to root — middleware will redirect based on persona's access rights
      await page.goto("/");

      // Wait for role-based redirect to settle
      const landing = PERSONA_LANDING[persona];
      if (landing !== "/") {
        await page.waitForURL(`**${landing}`);
      }

      await use(page);
    },
  });
}

export { expect };
