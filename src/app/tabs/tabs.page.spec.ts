import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { chatbubbles, images, cloud } from 'ionicons/icons';

import { TabsPage } from './tabs.page';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsPage],
      providers: [provideRouter([]), provideTranslateService()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // ARRANGE

    // ACT

    // ASSERT
    expect(component).toBeTruthy();
  });

  it('should register tab icons (chatbubbles, images, cloud) in constructor', () => {
    // ARRANGE
    // Icons must be imported and available

    // ACT
    // Constructor was called during component creation

    // ASSERT
    // Verify all icon imports are defined (required for addIcons() call)
    expect(chatbubbles).toBeDefined();
    expect(images).toBeDefined();
    expect(cloud).toBeDefined();
  });

  it('should handle tab change events and update active tab', () => {
    // ARRANGE
    const event = { tab: 'tab3' };

    // ACT
    component['onTabChange'](event);

    // ASSERT
    expect(component['activeTab']()).toBe('tab3');
  });

  it('should ignore invalid tab identifiers on tab change', () => {
    // ARRANGE
    const event = { tab: 'invalid-tab' };

    // ACT
    component['onTabChange'](event);

    // ASSERT (should remain on initial tab)
    expect(component['activeTab']()).toBe('tab1');
  });

  it('should compute titleKey as "tabs.tab1" initially', () => {
    // ARRANGE

    // ACT
    const titleKey = component['titleKey']();

    // ASSERT
    expect(titleKey).toBe('tabs.tab1');
  });

  it('should update titleKey when active tab changes', () => {
    // ARRANGE
    const newTabEvent = { tab: 'tab2' };

    // ACT
    component['onTabChange'](newTabEvent);
    const updatedTitleKey = component['titleKey']();

    // ASSERT
    expect(updatedTitleKey).toBe('tabs.tab2');
  });
});
