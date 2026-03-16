import { expect, test } from '@playwright/test';

test('should switch language and update tab labels', async ({ page }) => {
  // ARRANGE
  await page.goto('/');

  const tabOneLabel = page.locator('ion-tab-button[tab="tab1"] ion-label');
  const tabTwoLabel = page.locator('ion-tab-button[tab="tab2"] ion-label');
  const englishLanguageTrigger = page.locator('ion-button[aria-label="Language selector"]');

  // ACT
  await expect(tabOneLabel).toContainText('Social Media');
  await expect(tabTwoLabel).toContainText('Image Gallery');

  await expect(englishLanguageTrigger).toBeVisible();
  await englishLanguageTrigger.click();
  await page.locator('ion-popover ion-item', { hasText: 'ES' }).click();

  // ASSERT
  await expect(tabOneLabel).toContainText('Red Social');
  await expect(tabTwoLabel).toContainText('Galería de Imágenes');

  // ACT
  const spanishLanguageTrigger = page.locator('ion-button[aria-label="Selector de idioma"]');
  await expect(spanishLanguageTrigger).toBeVisible();
  await spanishLanguageTrigger.click();
  await page.locator('ion-popover ion-item', { hasText: 'EN' }).click();

  // ASSERT
  await expect(tabOneLabel).toContainText('Social Media');
  await expect(tabTwoLabel).toContainText('Image Gallery');
});
