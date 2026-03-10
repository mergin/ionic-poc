import { expect, test } from '@playwright/test';

test('should render app shell with header and tabs', async ({ page }) => {
  // ARRANGE
  await page.goto('/');

  // ACT
  const header = page.locator('app-header');
  const tabs = page.locator('ion-tabs');
  const firstTabButton = page.locator('ion-tab-button[tab="tab1"]');

  // ASSERT
  await expect(header).toBeVisible();
  await expect(tabs).toBeVisible();
  await expect(firstTabButton).toBeVisible();
});
