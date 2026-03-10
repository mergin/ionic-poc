import { render, screen } from '@testing-library/angular';
import { provideTranslateService } from '@ngx-translate/core';

import { HeaderComponent } from './header.component';

describe('HeaderComponent rendering', () => {
  it('should render title and language selector', async () => {
    // ARRANGE
    await render(HeaderComponent, {
      providers: [provideTranslateService()],
      componentInputs: {
        title: 'tabs.tab1',
      },
    });

    // ACT
    const title = screen.getByText('tabs.tab1');
    const languageButton = screen.getByLabelText('common.languageSelector', {
      selector: 'ion-button',
    });

    // ASSERT
    expect(title).toBeTruthy();
    expect(languageButton).toBeTruthy();
  });
});
