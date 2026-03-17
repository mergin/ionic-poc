import { expect, test } from '@playwright/test';

test('should update current city when searching weather by city name', async ({ page }) => {
  // ARRANGE
  await page.goto('/tabs/tab3');
  const searchInput = page.locator('ion-searchbar input');
  const cityLabel = page.locator('.current-weather__city');

  // ACT
  await searchInput.fill('Barcelona');
  await searchInput.press('Enter');

  // ASSERT
  await expect(cityLabel).toHaveText('Barcelona');
});

test('should switch weather values and units when toggling fahrenheit', async ({ page }) => {
  // ARRANGE
  await page.goto('/tabs/tab3');
  const unitToggle = page.locator('ion-toggle[aria-label="Switch between Celsius and Fahrenheit"]');
  const currentTemperature = page.locator('.current-weather__temp');
  const windMeta = page.locator('.current-weather__meta').first();

  await expect(currentTemperature).toContainText('C');
  await expect(windMeta).toContainText('m/s');
  const temperatureInCelsius = await currentTemperature.textContent();

  // ACT
  await unitToggle.click();

  // ASSERT
  await expect(currentTemperature).toContainText('F');
  await expect(windMeta).toContainText('mph');
  expect(await currentTemperature.textContent()).not.toEqual(temperatureInCelsius);
});

test('should show loading status while weather request is in progress', async ({ page }) => {
  // ARRANGE
  await page.goto('/tabs/tab3');
  const searchInput = page.locator('ion-searchbar input');

  // ACT
  await searchInput.fill('Slowville');
  await searchInput.press('Enter');

  // ASSERT
  await expect(page.getByText('Loading weather...')).toBeVisible();
  await expect(page.getByText('Loading weather...')).toHaveCount(1);
});

test('should show error alert semantics when weather request fails', async ({ page }) => {
  // ARRANGE
  await page.goto('/tabs/tab3');
  const searchInput = page.locator('ion-searchbar input');

  // ACT
  await searchInput.fill('error-city');
  await searchInput.press('Enter');

  // ASSERT
  await expect(page.getByText('Unable to load weather data.')).toBeVisible();
  await expect(page.getByText('Unable to load weather data.')).toHaveCount(1);
});

test('should localize weather controls and section labels after language switch', async ({
  page,
}) => {
  // ARRANGE
  await page.goto('/tabs/tab3');
  const englishLanguageTrigger = page.locator('ion-button[aria-label="Language selector"]');

  // ACT
  await englishLanguageTrigger.click();
  await page.locator('ion-popover ion-item', { hasText: 'ES' }).click();

  // ASSERT
  await expect(page.locator('ion-searchbar[aria-label="Buscar clima por ciudad"]')).toBeVisible();
  await expect(
    page.locator('[role="group"][aria-label="Cambiar entre Celsius y Fahrenheit"]'),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Pronóstico por Hora' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Pronóstico Diario' })).toBeVisible();
});

test('should support keyboard interaction for temperature unit toggle', async ({ page }) => {
  // ARRANGE
  await page.goto('/tabs/tab3');
  const unitToggle = page.locator('ion-toggle[aria-label="Switch between Celsius and Fahrenheit"]');
  const celsiusUnitLabel = page
    .locator('.weather-controls__toggle-group .weather-controls__unit')
    .nth(0);
  const fahrenheitUnitLabel = page
    .locator('.weather-controls__toggle-group .weather-controls__unit')
    .nth(1);

  await expect(celsiusUnitLabel).toHaveClass(/weather-controls__unit--selected/);
  await expect(fahrenheitUnitLabel).toHaveClass(/weather-controls__unit--unselected/);

  // ACT
  await unitToggle.focus();
  await page.keyboard.press('Space');

  // ASSERT
  await expect(celsiusUnitLabel).toHaveClass(/weather-controls__unit--unselected/);
  await expect(fahrenheitUnitLabel).toHaveClass(/weather-controls__unit--selected/);
});
