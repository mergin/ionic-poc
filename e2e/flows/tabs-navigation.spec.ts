import { expect, test } from '@playwright/test';

test('should navigate between tabs and render each page title', async ({ page }) => {
  // ARRANGE
  await page.goto('/');
  const pageTitle = page.locator('ion-title');

  // ACT
  await page.locator('ion-tab-button[tab="tab2"]').click();

  // ASSERT
  await expect(page).toHaveURL(/\/tabs\/tab2/);
  await expect(pageTitle).toContainText('Image Gallery');
  await expect(page.locator('ion-list[aria-label="Image gallery"]')).toBeVisible();

  // ACT
  await page.locator('ion-tab-button[tab="tab3"]').click();

  // ASSERT
  await expect(page).toHaveURL(/\/tabs\/tab3/);
  await expect(pageTitle).toContainText('Tab 3');
  await expect(page.getByText('Tab 3 page', { exact: true })).toBeVisible();

  // ACT
  await page.locator('ion-tab-button[tab="tab1"]').click();

  // ASSERT
  await expect(page).toHaveURL(/\/tabs\/tab1/);
  await expect(pageTitle).toContainText('Social Media');
});
