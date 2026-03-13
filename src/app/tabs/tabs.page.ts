import {
  ChangeDetectionStrategy,
  Component,
  EnvironmentInjector,
  computed,
  inject,
  signal,
} from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square } from 'ionicons/icons';

import { HeaderComponent } from '@app/header/header.component';
import type { AppTab } from '@app/tabs/models';

@Component({
  selector: 'app-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, TranslatePipe, HeaderComponent],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  protected readonly titleKey = computed(() => `tabs.${this.activeTab()}`);

  private readonly activeTab = signal<AppTab>('tab1');

  /**
   * Registers tab icons used by the bottom tab bar.
   */
  constructor() {
    addIcons({ triangle, ellipse, square });
  }

  /**
   * Updates the active tab state when IonTabs emits tab-change events.
   * @param event IonTabs change event containing selected tab id.
   * @param event.tab
   */
  protected onTabChange(event: { tab: string }): void {
    const selectedTab = event.tab;

    if (isAppTab(selectedTab)) {
      this.activeTab.set(selectedTab);
    }
  }
}

/**
 * Type guard for supported tab identifiers.
 * @param tab Tab identifier to validate.
 * @returns True when value is a known app tab.
 */
function isAppTab(tab: string): tab is AppTab {
  return tab === 'tab1' || tab === 'tab2' || tab === 'tab3';
}
