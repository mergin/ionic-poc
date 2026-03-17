import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { TabsPage } from './tabs.page';

const EXPECTED_TAB_COUNT = 3;
const SOCIAL_TAB_INDEX = 0;
const GALLERY_TAB_INDEX = 1;
const WEATHER_TAB_INDEX = 2;

describe('TabsPage rendering', () => {
  it('should render translated tab labels', async () => {
    // ARRANGE
    await render(TabsPage, {
      providers: [provideRouter([]), provideTranslateService()],
    });

    // ACT
    const tab1Labels = screen.getAllByText('tabs.tab1');
    const tab2Labels = screen.getAllByText('tabs.tab2');
    const tab3Labels = screen.getAllByText('tabs.tab3');

    // ASSERT
    expect(tab1Labels.length).toBeGreaterThan(0);
    expect(tab2Labels.length).toBeGreaterThan(0);
    expect(tab3Labels.length).toBeGreaterThan(0);
  });

  it('should render language selector action in the header', async () => {
    // ARRANGE
    await render(TabsPage, {
      providers: [provideRouter([]), provideTranslateService()],
    });

    // ACT
    const languageButton = screen.getByLabelText('common.languageSelector', {
      selector: 'ion-button',
    });

    // ASSERT
    expect(languageButton).toBeTruthy();
  });

  it('should render correct icons for all three tabs', async () => {
    // ARRANGE
    await render(TabsPage, {
      providers: [provideRouter([]), provideTranslateService()],
    });

    // ACT
    const tabButtons = document.querySelectorAll('ion-tab-button');

    // ASSERT
    expect(tabButtons.length).toBe(EXPECTED_TAB_COUNT);

    // Tab 1 (Social Media) - chatbubbles icon
    const tab1Icon = tabButtons[SOCIAL_TAB_INDEX]?.querySelector('ion-icon');
    expect(tab1Icon?.getAttribute('name')).toBe('chatbubbles');

    // Tab 2 (Image Gallery) - images icon
    const tab2Icon = tabButtons[GALLERY_TAB_INDEX]?.querySelector('ion-icon');
    expect(tab2Icon?.getAttribute('name')).toBe('images');

    // Tab 3 (Weather) - cloud icon
    const tab3Icon = tabButtons[WEATHER_TAB_INDEX]?.querySelector('ion-icon');
    expect(tab3Icon?.getAttribute('name')).toBe('cloud');
  });

  it('should mark tab icons as aria-hidden (decorative)', async () => {
    // ARRANGE
    await render(TabsPage, {
      providers: [provideRouter([]), provideTranslateService()],
    });

    // ACT
    const tabIcons = document.querySelectorAll('ion-tab-button ion-icon');

    // ASSERT
    expect(tabIcons.length).toBe(EXPECTED_TAB_COUNT);
    tabIcons.forEach(icon => {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
