import { render, screen } from '@testing-library/angular';
import { provideTranslateService } from '@ngx-translate/core';

import { ExploreContainerComponent } from './explore-container.component';

describe('ExploreContainerComponent rendering', () => {
  it('should render title and docs link', async () => {
    // ARRANGE
    await render(ExploreContainerComponent, {
      providers: [provideTranslateService()],
      componentInputs: {
        name: 'tabs.tab2Page',
      },
    });

    // ACT
    const title = screen.getByText('tabs.tab2Page');
    const docsLink = screen.getByRole('link', {
      name: 'explore.uiComponentsLinkAria',
    });

    // ASSERT
    expect(title).toBeTruthy();
    expect(docsLink).toBeTruthy();
  });
});
