import { render, screen } from '@testing-library/angular';
import { provideTranslateService } from '@ngx-translate/core';
import { NEVER, of, throwError } from 'rxjs';

import type {
  OpenWeatherCurrentWeatherResponse,
  OpenWeatherForecastResponse,
} from '@app/weather/models';
import { OpenWeatherApiServiceSpy } from '@app/weather/services/open-weather-api/open-weather-api.service.spy';
import { OpenWeatherApiService } from '@app/weather/services/open-weather-api/open-weather-api.service';
import { WeatherComponent } from '@app/weather/weather.component';

const EXPECTED_FORECAST_LIST_COUNT = 2;

describe('WeatherComponent rendering', () => {
  it('should render accessible weather controls and semantic forecast lists', async () => {
    // ARRANGE
    const openWeatherApiServiceSpy = OpenWeatherApiServiceSpy.create();
    openWeatherApiServiceSpy.getCurrentWeather.and.returnValue(of(buildCurrentWeatherResponse()));
    openWeatherApiServiceSpy.getForecast.and.returnValue(of(buildForecastResponse()));

    await render(WeatherComponent, {
      providers: [
        provideTranslateService(),
        { provide: OpenWeatherApiService, useValue: openWeatherApiServiceSpy },
      ],
    });

    // ACT
    const searchbar = document.querySelector('ion-searchbar[aria-label="weather.searchAriaLabel"]');
    const unitToggle = document.querySelector(
      'ion-toggle[aria-label="weather.unitToggleAriaLabel"]',
    );
    const unitGroup = document.querySelector(
      '[role="group"][aria-label="weather.unitToggleAriaLabel"]',
    );
    await screen.findByText('weather.hourlyTitle');
    await screen.findByText('weather.dailyTitle');
    const forecastLists = document.querySelectorAll('ul.forecast-row');
    const forecastItems = document.querySelectorAll('ul.forecast-row li.forecast-row__item');

    // ASSERT
    expect(searchbar).toBeTruthy();
    expect(unitToggle).toBeTruthy();
    expect(unitGroup).toBeTruthy();
    expect(forecastLists.length).toBe(EXPECTED_FORECAST_LIST_COUNT);
    expect(forecastItems.length).toBeGreaterThan(0);
  });

  it('should render status semantics while weather is loading', async () => {
    // ARRANGE
    const openWeatherApiServiceSpy = OpenWeatherApiServiceSpy.create();
    openWeatherApiServiceSpy.getCurrentWeather.and.returnValue(NEVER);
    openWeatherApiServiceSpy.getForecast.and.returnValue(NEVER);

    await render(WeatherComponent, {
      providers: [
        provideTranslateService(),
        { provide: OpenWeatherApiService, useValue: openWeatherApiServiceSpy },
      ],
    });

    // ACT
    const loadingMessage = screen.getByText('weather.loading');
    const politeStatusRegion = document.querySelector(
      'ion-item[role="status"][aria-live="polite"]',
    );

    // ASSERT
    expect(loadingMessage).toBeTruthy();
    expect(politeStatusRegion).toBeTruthy();
  });

  it('should render alert semantics when weather loading fails', async () => {
    // ARRANGE
    const openWeatherApiServiceSpy = OpenWeatherApiServiceSpy.create();
    openWeatherApiServiceSpy.getCurrentWeather.and.returnValue(
      throwError(() => new Error('Failed to load weather')),
    );
    openWeatherApiServiceSpy.getForecast.and.returnValue(
      throwError(() => new Error('Failed to load forecast')),
    );

    await render(WeatherComponent, {
      providers: [
        provideTranslateService(),
        { provide: OpenWeatherApiService, useValue: openWeatherApiServiceSpy },
      ],
    });

    // ACT
    const errorMessage = await screen.findByText('weather.loadError');
    const assertiveAlertRegion = document.querySelector(
      'ion-item[role="alert"][aria-live="assertive"]',
    );

    // ASSERT
    expect(errorMessage).toBeTruthy();
    expect(assertiveAlertRegion).toBeTruthy();
  });
});

/**
 * Builds a valid current-weather response fixture.
 * @returns Current weather fixture.
 */
function buildCurrentWeatherResponse(): OpenWeatherCurrentWeatherResponse {
  return {
    weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
    main: {
      temp: 25,
      feels_like: 24,
      temp_min: 22,
      temp_max: 27,
      pressure: 1013,
      humidity: 40,
    },
    wind: { speed: 4.5, deg: 235 },
    dt: 1_763_653_200,
    name: 'Madrid',
    timezone: 3_600,
  };
}

/**
 * Builds a valid forecast response fixture with enough entries for weather sections.
 * @returns Forecast fixture.
 */
function buildForecastResponse(): OpenWeatherForecastResponse {
  return {
    city: {
      id: 3_117_734,
      name: 'Madrid',
      country: 'ES',
      timezone: 3_600,
    },
    list: [
      {
        dt: 1_763_653_200,
        dt_txt: '2026-03-16 12:00:00',
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        main: {
          temp: 25,
          feels_like: 24,
          temp_min: 24,
          temp_max: 26,
          pressure: 1011,
          humidity: 43,
        },
        wind: { speed: 4.8, deg: 238 },
      },
      {
        dt: 1_763_664_000,
        dt_txt: '2026-03-16 15:00:00',
        weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
        main: {
          temp: 23,
          feels_like: 22,
          temp_min: 22,
          temp_max: 24,
          pressure: 1012,
          humidity: 45,
        },
        wind: { speed: 4.2, deg: 230 },
      },
      {
        dt: 1_763_674_800,
        dt_txt: '2026-03-16 18:00:00',
        weather: [{ id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
        main: {
          temp: 21,
          feels_like: 20,
          temp_min: 20,
          temp_max: 22,
          pressure: 1013,
          humidity: 48,
        },
        wind: { speed: 4.1, deg: 225 },
      },
      {
        dt: 1_763_685_600,
        dt_txt: '2026-03-16 21:00:00',
        weather: [{ id: 803, main: 'Clouds', description: 'broken clouds', icon: '04n' }],
        main: {
          temp: 18,
          feels_like: 17,
          temp_min: 17,
          temp_max: 19,
          pressure: 1014,
          humidity: 53,
        },
        wind: { speed: 3.8, deg: 215 },
      },
      {
        dt: 1_763_739_600,
        dt_txt: '2026-03-17 12:00:00',
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        main: {
          temp: 21,
          feels_like: 21,
          temp_min: 20,
          temp_max: 22,
          pressure: 1015,
          humidity: 47,
        },
        wind: { speed: 3.9, deg: 230 },
      },
    ],
  };
}
