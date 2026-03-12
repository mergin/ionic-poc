import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import type { PicsumImage } from '@app/image-gallery/models';
import { PicsumService } from '@app/image-gallery/services/picsum/picsum.service';

describe('PicsumService', () => {
  let service: PicsumService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(PicsumService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch image list with default real mode', () => {
    // ARRANGE
    const responseMock: PicsumImage[] = [
      {
        id: '10',
        author: 'Alejandro Escamilla',
        width: 2500,
        height: 1667,
        url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
        download_url: '/picsum/id/10/2500/1667',
      },
    ];

    // ACT
    service.getImageList().subscribe(images => {
      // ASSERT
      expect(images).toEqual(responseMock);
    });

    const req = httpMock.expectOne(request => request.url === '/picsum/v2/list');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('__msw')).toBe('real');
    expect(req.request.params.keys().length).toBe(1);
    req.flush(responseMock);
  });

  it('should set mock api mode query param when mock is enabled', () => {
    // ARRANGE
    const responseMock: PicsumImage[] = [];
    service.setUseMockMsw(true);

    // ACT
    service.getImageList().subscribe(images => {
      // ASSERT
      expect(images).toEqual(responseMock);
    });

    const req = httpMock.expectOne(request => request.url === '/picsum/v2/list');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('__msw')).toBe('mock');
    req.flush(responseMock);
  });

  it('should fetch image list with page and limit', () => {
    // ARRANGE
    const responseMock: PicsumImage[] = [];
    service.setUseMockMsw(true);

    // ACT
    service.getImageList({ page: 2, limit: 15 }).subscribe(images => {
      // ASSERT
      expect(images).toEqual(responseMock);
    });

    const req = httpMock.expectOne(
      request =>
        request.url === '/picsum/v2/list' &&
        request.params.get('page') === '2' &&
        request.params.get('limit') === '15' &&
        request.params.get('__msw') === 'mock',
    );
    expect(req.request.method).toBe('GET');
    req.flush(responseMock);
  });

  it('should fetch image info by id', () => {
    // ARRANGE
    const imageId = '101';
    service.setUseMockMsw(true);
    const responseMock: PicsumImage = {
      id: imageId,
      author: 'Alejandro Escamilla',
      width: 5184,
      height: 3456,
      url: 'https://unsplash.com/photos/LNRyGwIJr5c',
      download_url: '/picsum/id/101/5184/3456',
    };

    // ACT
    service.getImageInfoById(imageId).subscribe(image => {
      // ASSERT
      expect(image).toEqual(responseMock);
    });

    const req = httpMock.expectOne(`/picsum/id/${imageId}/info?__msw=mock`);
    expect(req.request.method).toBe('GET');
    req.flush(responseMock);
  });

  it('should fetch image info by seed', () => {
    // ARRANGE
    const seed = 'seed value';
    service.setUseMockMsw(true);
    const responseMock: PicsumImage = {
      id: '102',
      author: 'Paul Jarvis',
      width: 4320,
      height: 3240,
      url: 'https://unsplash.com/photos/6J--NXulQCs',
      download_url: '/picsum/id/102/4320/3240',
    };

    // ACT
    service.getImageInfoBySeed(seed).subscribe(image => {
      // ASSERT
      expect(image).toEqual(responseMock);
    });

    const req = httpMock.expectOne('/picsum/seed/seed%20value/info?__msw=mock');
    expect(req.request.method).toBe('GET');
    req.flush(responseMock);
  });

  it('should request random image as blob', () => {
    // ARRANGE
    service.setUseMockMsw(true);
    const blobMock = new Blob(['random-image-bytes'], { type: 'image/webp' });

    // ACT
    service
      .getRandomImage({
        width: 300,
        height: 200,
        format: 'webp',
        grayscale: true,
        blur: 2,
        random: 9,
      })
      .subscribe(imageBlob => {
        // ASSERT
        expect(imageBlob).toEqual(blobMock);
      });

    const req = httpMock.expectOne('/picsum/300/200.webp?grayscale&blur=2&random=9&__msw=mock');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(blobMock);
  });

  it('should request image by id as blob', () => {
    // ARRANGE
    const imageId = 237;
    service.setUseMockMsw(true);
    const blobMock = new Blob(['image-id-bytes'], { type: 'image/jpeg' });

    // ACT
    service
      .getImageById(imageId, { width: 400, height: 250, format: 'jpg', grayscale: true })
      .subscribe(imageBlob => {
        // ASSERT
        expect(imageBlob).toEqual(blobMock);
      });

    const req = httpMock.expectOne(`/picsum/id/${imageId}/400/250.jpg?grayscale&__msw=mock`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(blobMock);
  });

  it('should request image by seed as blob', () => {
    // ARRANGE
    service.setUseMockMsw(true);
    const blobMock = new Blob(['image-seed-bytes'], { type: 'image/jpeg' });

    // ACT
    service.getImageBySeed('gallery', { width: 500, blur: 4 }).subscribe(imageBlob => {
      // ASSERT
      expect(imageBlob).toEqual(blobMock);
    });

    const req = httpMock.expectOne('/picsum/seed/gallery/500?blur=4&__msw=mock');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(blobMock);
  });

  it('should build random image URL with optional format and query options', () => {
    // ARRANGE

    // ACT
    const url = service.buildRandomImageUrl({
      width: 200,
      height: 300,
      format: 'jpg',
      grayscale: true,
      blur: 3,
      random: 12,
    });

    // ASSERT
    expect(url).toBe('/picsum/200/300.jpg?grayscale&blur=3&random=12');
  });

  it('should build id image URL with encoded query options', () => {
    // ARRANGE

    // ACT
    const url = service.buildImageByIdUrl('42', {
      width: 640,
      format: 'webp',
    });

    // ASSERT
    expect(url).toBe('/picsum/id/42/640.webp');
  });

  it('should build seed image URL with encoded seed value', () => {
    // ARRANGE

    // ACT
    const url = service.buildImageBySeedUrl('my seed', {
      width: 720,
      height: 480,
      blur: 1,
    });

    // ASSERT
    expect(url).toBe('/picsum/seed/my%20seed/720/480?blur=1');
  });
});
