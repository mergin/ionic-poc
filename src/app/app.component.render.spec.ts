import { render } from '@testing-library/angular';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';

describe('AppComponent rendering', () => {
  it('should render app shell', async () => {
    // ARRANGE
    await render(AppComponent, {
      providers: [provideRouter([])],
    });

    // ACT
    const appShell = document.querySelector('ion-app');

    // ASSERT
    expect(appShell).not.toBeNull();
  });
});
