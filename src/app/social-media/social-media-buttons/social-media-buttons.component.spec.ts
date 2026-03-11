/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { SocialMediaButtonsComponent } from '@app/social-media/social-media-buttons/social-media-buttons.component';

describe('SocialMediaButtonsComponent', () => {
  let component: SocialMediaButtonsComponent;
  let fixture: ComponentFixture<SocialMediaButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialMediaButtonsComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialMediaButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // ARRANGE

    // ACT

    // ASSERT
    expect(component).toBeTruthy();
  });

  it('should render repost and favorite buttons', () => {
    // ARRANGE

    // ACT
    const buttons = fixture.nativeElement.querySelectorAll('ion-button');

    // ASSERT
    expect(buttons.length).toBe(2);
  });
});
