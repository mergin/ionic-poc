import { expect, test } from '@playwright/test';

test('should navigate between tabs and render each page title', async ({ page }) => {
  // ARRANGE
  await page.goto('/');

  // ACT
  await page.locator('ion-tab-button[tab="tab2"]').click();

  // ASSERT
  await expect(page).toHaveURL(/\/tabs\/tab2/);
  await expect(page.getByText('Tab 2 page', { exact: true })).toBeVisible();

  // ACT
  await page.locator('ion-tab-button[tab="tab3"]').click();

  // ASSERT
  await expect(page).toHaveURL(/\/tabs\/tab3/);
  await expect(page.getByText('Tab 3 page', { exact: true })).toBeVisible();

  // ACT
  await page.locator('ion-tab-button[tab="tab1"]').click();

  // ASSERT
  await expect(page).toHaveURL(/\/tabs\/tab1/);
});
