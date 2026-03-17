import { expect, test, type Page } from '@playwright/test';

const MAX_DOM_CONTENT_LOADED_MS = 2_500;
const MAX_LOAD_EVENT_MS = 4_000;
const MAX_TAB_SWITCH_MS = 2_200;

const GALLERY_TAB = 'tab2';
const WEATHER_TAB = 'tab3';

interface NavigationTimingSummary {
  domContentLoadedMs: number;
  loadEventMs: number;
}

/**
 * Reads browser navigation timing values for the current page.
 * @param page Playwright page instance.
 * @returns Navigation timing values in milliseconds.
 */
async function getNavigationTimingSummary(page: Page): Promise<NavigationTimingSummary> {
  return page.evaluate(() => {
    const [navigationEntry] = performance.getEntriesByType(
      'navigation',
    ) as PerformanceNavigationTiming[];

    if (!navigationEntry) {
      return {
        domContentLoadedMs: Number.NaN,
        loadEventMs: Number.NaN,
      };
    }

    return {
      domContentLoadedMs: navigationEntry.domContentLoadedEventEnd,
      loadEventMs: navigationEntry.loadEventEnd,
    };
  });
}

/**
 * Measures the time from a tab click until the expected page signal is visible.
 * @param page Playwright page instance.
 * @param tabId Ionic tab id.
 * @param assertionLocator Locator that confirms destination tab rendered.
 * @returns Duration in milliseconds.
 */
async function measureTabSwitchMs(
  page: Page,
  tabId: string,
  assertionLocator: string,
): Promise<number> {
  const startedAt = Date.now();

  await page.locator(`ion-tab-button[tab="${tabId}"]`).click();
  await expect(page.locator(assertionLocator)).toBeVisible();

  return Date.now() - startedAt;
}

test.describe('Tabs performance smoke', () => {
  test('should keep initial load and tab-switch timings within budget', async ({ page }) => {
    // ARRANGE
    await page.goto('/tabs/tab1');

    // ACT
    const navigationTiming = await getNavigationTimingSummary(page);
    const gallerySwitchMs = await measureTabSwitchMs(
      page,
      GALLERY_TAB,
      'ion-list[aria-label="Image gallery"]',
    );
    const weatherSwitchMs = await measureTabSwitchMs(page, WEATHER_TAB, 'app-current-weather');

    // ASSERT
    expect(navigationTiming.domContentLoadedMs).toBeLessThan(MAX_DOM_CONTENT_LOADED_MS);
    expect(navigationTiming.loadEventMs).toBeLessThan(MAX_LOAD_EVENT_MS);
    expect(gallerySwitchMs).toBeLessThan(MAX_TAB_SWITCH_MS);
    expect(weatherSwitchMs).toBeLessThan(MAX_TAB_SWITCH_MS);
  });
});
