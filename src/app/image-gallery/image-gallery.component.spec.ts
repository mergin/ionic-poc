/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { provideTranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { ImageGalleryComponent } from '@app/image-gallery/image-gallery.component';
import { PicsumService } from '@app/image-gallery/services';
import { PicsumServiceSpy } from '@app/image-gallery/services/picsum/picsum.service.spy';

describe('ImageGalleryComponent', () => {
  let component: ImageGalleryComponent;
  let fixture: ComponentFixture<ImageGalleryComponent>;
  let picsumServiceSpy: jasmine.SpyObj<PicsumService>;

  beforeEach(waitForAsync(() => {
    picsumServiceSpy = PicsumServiceSpy.create();
    picsumServiceSpy.getImageList.and.returnValue(
      of([
        {
          id: '10',
          author: 'Alejandro Escamilla',
          width: 2500,
          height: 1667,
          url: 'https://unsplash.com/photos/example-10',
          download_url: 'https://picsum.photos/id/10/2500/1667',
        },
        {
          id: '11',
          author: 'Paul Jarvis',
          width: 2500,
          height: 1667,
          url: 'https://unsplash.com/photos/example-11',
          download_url: 'https://picsum.photos/id/11/2500/1667',
        },
      ]),
    );

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), ImageGalleryComponent],
      providers: [
        provideTranslateService(),
        { provide: PicsumService, useValue: picsumServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageGalleryComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    // ARRANGE

    // ACT
    fixture.detectChanges();

    // ASSERT
    expect(component).toBeTruthy();
  });

  it('should load and render images from picsum service', fakeAsync(() => {
    // ARRANGE
    const expectedImageCount = 2;

    // ACT
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    // ASSERT
    expect(picsumServiceSpy.setUseMockMsw).toHaveBeenCalledWith(component['useMockPicsumApi']);
    expect(picsumServiceSpy.getImageList).toHaveBeenCalled();
    const imageElements = fixture.nativeElement.querySelectorAll('ion-img');
    expect(imageElements.length).toBe(expectedImageCount);
  }));

  it('should show gallery load error when service fails', fakeAsync(() => {
    // ARRANGE
    picsumServiceSpy.getImageList.and.returnValue(
      throwError(() => new Error('Failed to load images')),
    );

    // ACT
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    // ASSERT
    expect(component['errorMessageKey']()).toBe('gallery.loadError');
    expect(component['loading']()).toBeFalse();
  }));

  it('should render gallery load error item when service fails', fakeAsync(() => {
    // ARRANGE
    picsumServiceSpy.getImageList.and.returnValue(
      throwError(() => new Error('Failed to load images')),
    );

    // ACT
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    // ASSERT
    const errorItem = fixture.nativeElement.querySelector('ion-item[role="alert"]');
    expect(errorItem).toBeTruthy();
  }));

  it('should refresh gallery data and complete refresher event', fakeAsync(() => {
    // ARRANGE
    const completeSpy = jasmine.createSpy('complete').and.returnValue(Promise.resolve());
    const refreshEvent = {
      target: { complete: completeSpy },
    } as unknown as import('@ionic/core').RefresherCustomEvent;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    // ACT
    (
      component as unknown as {
        handleRefresh: (event: import('@ionic/core').RefresherCustomEvent) => void;
      }
    ).handleRefresh(refreshEvent);

    // Refresh should complete after the API call settles, not immediately.
    expect(completeSpy).not.toHaveBeenCalled();

    tick();
    fixture.detectChanges();

    // ASSERT
    expect(completeSpy).toHaveBeenCalled();
    expect(picsumServiceSpy.getImageList).toHaveBeenCalledTimes(2);
  }));
});
