import { expect, test } from '@playwright/test';

test('should render social feed on tab1', async ({ page }) => {
  // ARRANGE
  await page.goto('/tabs/tab1');

  // ACT
  const feed = page.locator('ion-list[aria-label="Social media posts"]');

  // ASSERT
  await expect(feed).toBeVisible();
  await expect(feed.locator('ion-item').first()).toBeVisible();
});