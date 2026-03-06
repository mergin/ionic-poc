import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { ExploreContainerComponent } from './explore-container.component';

describe('ExploreContainerComponent', () => {
  let component: ExploreContainerComponent;
  let fixture: ComponentFixture<ExploreContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreContainerComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(ExploreContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // ARRANGE

    // ACT

    // ASSERT
    expect(component).toBeTruthy();
  });
});
