import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import type {
  OpenWeatherCurrentWeatherResponse,
  OpenWeatherForecastResponse,
} from '@app/weather/models';
import { OpenWeatherApiService } from '@app/weather/services/open-weather-api/open-weather-api.service';

describe('OpenWeatherApiService', () => {
  let service: OpenWeatherApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(OpenWeatherApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch current weather by city', () => {
    // ARRANGE
    const cityName = 'Madrid';
    const responseMock: OpenWeatherCurrentWeatherResponse = {
      weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
      main: {
        temp: 24,
        feels_like: 25,
        temp_min: 19,
        temp_max: 27,
        pressure: 1012,
        humidity: 45,
      },
      wind: { speed: 4.2, deg: 240 },
      dt: 1_763_615_400,
      name: cityName,
      timezone: 3_600,
    };

    // ACT
    service.getCurrentWeather(cityName).subscribe(currentWeather => {
      // ASSERT
      expect(currentWeather).toEqual(responseMock);
    });

    const request = httpMock.expectOne(
      req => req.url === 'https://api.openweathermap.org/data/2.5/weather',
    );

    // ASSERT
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('q')).toBe(cityName);
    expect(request.request.params.get('units')).toBe('metric');
    expect(request.request.params.get('appid')).toBe('demo-open-weather-key');
    request.flush(responseMock);
  });

  it('should fetch forecast by city', () => {
    // ARRANGE
    const cityName = 'Madrid';
    const responseMock: OpenWeatherForecastResponse = {
      city: {
        id: 3_117_734,
        name: cityName,
        country: 'ES',
        timezone: 3_600,
      },
      list: [
        {
          dt: 1_763_615_400,
          dt_txt: '2026-03-16 12:00:00',
          weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
          main: {
            temp: 24,
            feels_like: 24,
            temp_min: 23,
            temp_max: 25,
            pressure: 1012,
            humidity: 45,
          },
          wind: { speed: 4.5, deg: 220 },
        },
      ],
    };

    // ACT
    service.getForecast(cityName).subscribe(forecast => {
      // ASSERT
      expect(forecast).toEqual(responseMock);
    });

    const request = httpMock.expectOne(
      req => req.url === 'https://api.openweathermap.org/data/2.5/forecast',
    );

    // ASSERT
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('q')).toBe(cityName);
    expect(request.request.params.get('units')).toBe('metric');
    expect(request.request.params.get('appid')).toBe('demo-open-weather-key');
    request.flush(responseMock);
  });
});
