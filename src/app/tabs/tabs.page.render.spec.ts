import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

import { TabsPage } from './tabs.page';

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
});
