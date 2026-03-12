import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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

  it('should load and render images from picsum service', () => {
    // ARRANGE
    const expectedImageCount = 2;

    // ACT
    fixture.detectChanges();

    // ASSERT
    expect(picsumServiceSpy.setUseMockMsw).toHaveBeenCalledWith(component['useMockPicsumApi']);
    expect(picsumServiceSpy.getImageList).toHaveBeenCalled();
    const imageElements = fixture.nativeElement.querySelectorAll('ion-img');
    expect(imageElements.length).toBe(expectedImageCount);
  });

  it('should show gallery load error when service fails', () => {
    // ARRANGE
    picsumServiceSpy.getImageList.and.returnValue(
      throwError(() => new Error('Failed to load images')),
    );

    // ACT
    fixture.detectChanges();

    // ASSERT
    expect(component['errorMessageKey']()).toBe('gallery.loadError');
    expect(component['loading']()).toBeFalse();
  });
});
