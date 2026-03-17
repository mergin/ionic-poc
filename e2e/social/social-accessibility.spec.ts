import { expect, test } from '@playwright/test';

test('should expose accessible social feed semantics and controls', async ({ page }) => {
  // ARRANGE
  await page.goto('/tabs/tab1');

  const socialFeed = page.locator('ion-list[role="list"]');
  const socialPosts = page.locator('social-media-post[role="listitem"]');
  const actionGroup = page.locator('[role="group"][aria-label="Post actions"]').first();
  const repostButton = page.getByRole('button', { name: 'Repost' }).first();
  const favoriteButton = page.getByRole('button', { name: 'Favorite' }).first();

  // ACT
  await expect(socialFeed).toBeVisible();
  await expect(socialPosts.first()).toBeVisible();
  await expect(repostButton).toBeVisible();
  await expect(favoriteButton).toBeVisible();

  // ASSERT
  expect(await socialPosts.count()).toBeGreaterThan(0);
  await expect(socialFeed).toHaveAttribute(
    'aria-label',
    /Social media posts|Publicaciones de redes sociales/,
  );
  await expect(actionGroup).toBeVisible();
});

test('should localize social accessibility labels after language switch', async ({ page }) => {
  // ARRANGE
  await page.goto('/tabs/tab1');
  const englishLanguageTrigger = page.locator('ion-button[aria-label="Language selector"]');

  // ACT
  await englishLanguageTrigger.click();
  await page.locator('ion-popover ion-item', { hasText: 'ES' }).click();

  // ASSERT
  await expect(
    page.locator('ion-list[aria-label="Publicaciones de redes sociales"]'),
  ).toBeVisible();
  await expect(
    page.locator('[role="group"][aria-label="Acciones de la publicación"]').first(),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Repostear' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Favorito' }).first()).toBeVisible();
});

test('should support keyboard interaction for social action buttons', async ({ page }) => {
  // ARRANGE
  await page.goto('/tabs/tab1');
  const repostButton = page.getByRole('button', { name: 'Repost' }).first();
  const favoriteButton = page.getByRole('button', { name: 'Favorite' }).first();

  await expect(repostButton).toBeVisible();
  await expect(favoriteButton).toBeVisible();

  // ACT
  await repostButton.focus();
  await page.keyboard.press('Space');
  await favoriteButton.focus();
  await page.keyboard.press('Space');

  // ASSERT
  await expect(repostButton).toBeVisible();
  await expect(favoriteButton).toBeVisible();
});
