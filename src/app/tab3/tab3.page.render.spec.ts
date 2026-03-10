import { render, screen } from '@testing-library/angular';
import { provideTranslateService } from '@ngx-translate/core';

import { Tab3Page } from './tab3.page';

describe('Tab3Page rendering', () => {
  it('should render explore container content', async () => {
    // ARRANGE
    await render(Tab3Page, {
      providers: [provideTranslateService()],
    });

    // ACT
    const title = screen.getByText('tabs.tab3Page');
    const explorePrefix = screen.getByText('explore.prefix');

    // ASSERT
    expect(title).toBeTruthy();
    expect(explorePrefix).toBeTruthy();
  });
});
