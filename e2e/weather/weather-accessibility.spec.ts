import { expect, test } from '@playwright/test';

test('should expose accessible weather controls and semantic forecast sections', async ({
  page,
}) => {
  // ARRANGE
  await page.goto('/tabs/tab3');

  const searchbar = page.locator('ion-searchbar[aria-label="Search city weather"]');
  const unitGroup = page.locator(
    '[role="group"][aria-label="Switch between Celsius and Fahrenheit"]',
  );
  const unitToggle = page.locator('ion-toggle[aria-label="Switch between Celsius and Fahrenheit"]');
  const celsiusUnitLabel = page
    .locator('.weather-controls__toggle-group .weather-controls__unit')
    .nth(0);
  const fahrenheitUnitLabel = page
    .locator('.weather-controls__toggle-group .weather-controls__unit')
    .nth(1);

  // ACT
  await expect(searchbar).toBeVisible();
  await expect(unitGroup).toBeVisible();
  await expect(unitToggle).toBeVisible();

  const forecastLists = page.locator('ul.forecast-row');
  const forecastListItems = page.locator('ul.forecast-row li.forecast-row__item');

  // ASSERT
  await expect(forecastLists).toHaveCount(2);
  expect(await forecastListItems.count()).toBeGreaterThan(0);
  await expect(celsiusUnitLabel).toHaveClass(/weather-controls__unit--selected/);
  await expect(fahrenheitUnitLabel).toHaveClass(/weather-controls__unit--unselected/);

  // ACT
  await unitToggle.click();

  // ASSERT
  await expect(celsiusUnitLabel).toHaveClass(/weather-controls__unit--unselected/);
  await expect(fahrenheitUnitLabel).toHaveClass(/weather-controls__unit--selected/);
});
