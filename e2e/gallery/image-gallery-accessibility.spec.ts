import { expect, test } from '@playwright/test';

test('should expose accessible gallery list semantics and image alt text', async ({ page }) => {
  // ARRANGE
  await page.goto('/tabs/tab2');

  const galleryList = page.locator('ion-list.gallery-list[role="list"]');
  const galleryItems = page.locator('.gallery-card[role="listitem"]');
  const firstImage = page.getByRole('img', { name: /Photo by|Foto de/ }).first();

  // ACT
  await expect(galleryList).toBeVisible({ timeout: 15000 });
  await expect(galleryItems.first()).toBeVisible();

  // ASSERT
  expect(await galleryItems.count()).toBeGreaterThan(0);
  await expect(galleryList).toHaveAttribute('aria-label', /Image gallery|Galeria de imagenes/);
  await expect(firstImage).toBeVisible();
});

test('should localize gallery accessibility labels after language switch', async ({ page }) => {
  // ARRANGE
  await page.goto('/tabs/tab2');
  const englishLanguageTrigger = page.locator('ion-button[aria-label="Language selector"]');

  // ACT
  await englishLanguageTrigger.click();
  await page.locator('ion-popover ion-item', { hasText: 'ES' }).click();

  // ASSERT
  await expect(page.locator('ion-list[aria-label="Galeria de imagenes"]')).toBeVisible();
  await expect(page.getByRole('img', { name: /^Foto de/ }).first()).toBeVisible();
});
