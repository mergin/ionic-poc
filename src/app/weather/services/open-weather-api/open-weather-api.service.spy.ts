import { OpenWeatherApiService } from '@app/weather/services/open-weather-api/open-weather-api.service';

/** Factory for a fully-spied OpenWeatherApiService test double. */
export class OpenWeatherApiServiceSpy {
  /**
   * Creates a Jasmine spy object for OpenWeatherApiService public methods.
   * @returns Typed service spy instance.
   */
  static create(): jasmine.SpyObj<OpenWeatherApiService> {
    return jasmine.createSpyObj<OpenWeatherApiService>('OpenWeatherApiService', [
      'getCurrentWeather',
      'getForecast',
    ]);
  }
}
