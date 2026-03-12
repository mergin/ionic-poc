import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { PicsumService } from '@app/image-gallery/services';
import { PicsumServiceSpy } from '@app/image-gallery/services/picsum/picsum.service.spy';

import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;
  let picsumServiceSpy: jasmine.SpyObj<PicsumService>;

  beforeEach(async () => {
    // ARRANGE
    picsumServiceSpy = PicsumServiceSpy.create();
    picsumServiceSpy.getImageList.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [Tab2Page],
      providers: [
        provideTranslateService(),
        { provide: PicsumService, useValue: picsumServiceSpy },
      ],
    }).compileComponents();

    // ACT
    fixture = TestBed.createComponent(Tab2Page);
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
