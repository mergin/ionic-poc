import { expect, test } from '@playwright/test';

test('should switch language and update tab labels', async ({ page }) => {
  // ARRANGE
  await page.goto('/');

  const tabOneLabel = page.locator('ion-tab-button[tab="tab1"] ion-label');
  const englishLanguageTrigger = page.locator('ion-button[aria-label="Language selector"]');

  // ACT
  await expect(tabOneLabel).toContainText('Tab 1');

  await expect(englishLanguageTrigger).toBeVisible();
  await englishLanguageTrigger.click();
  await page.locator('ion-popover ion-item', { hasText: 'ES' }).click();

  // ASSERT
  await expect(tabOneLabel).toContainText('Pestaña 1');

  // ACT
  const spanishLanguageTrigger = page.locator('ion-button[aria-label="Selector de idioma"]');
  await expect(spanishLanguageTrigger).toBeVisible();
  await spanishLanguageTrigger.click();
  await page.locator('ion-popover ion-item', { hasText: 'EN' }).click();

  // ASSERT
  await expect(tabOneLabel).toContainText('Tab 1');
});
