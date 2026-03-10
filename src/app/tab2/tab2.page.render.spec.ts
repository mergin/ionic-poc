import { render, screen } from '@testing-library/angular';
import { provideTranslateService } from '@ngx-translate/core';

import { Tab2Page } from './tab2.page';

describe('Tab2Page rendering', () => {
  it('should render explore container content', async () => {
    // ARRANGE
    await render(Tab2Page, {
      providers: [provideTranslateService()],
    });

    // ACT
    const title = screen.getByText('tabs.tab2Page');
    const explorePrefix = screen.getByText('explore.prefix');

    // ASSERT
    expect(title).toBeTruthy();
    expect(explorePrefix).toBeTruthy();
  });
});
