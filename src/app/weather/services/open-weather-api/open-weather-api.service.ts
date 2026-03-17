import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import type {
  OpenWeatherCurrentWeatherResponse,
  OpenWeatherForecastResponse,
  OpenWeatherMeasurementUnit,
} from '@app/weather/models';
import { environment } from '@env/environment';

const OPEN_WEATHER_BASE_URL = environment.apiUrls.openWeatherBaseUrl;

/** Provides typed access to OpenWeather endpoints used by the weather tab. */
@Injectable({ providedIn: 'root' })
export class OpenWeatherApiService {
  private readonly httpClient = inject(HttpClient);

  /**
   * Fetches current weather data for a city.
   * @param cityName City query used by OpenWeather.
   * @param unit Unit system sent to OpenWeather.
   * @returns Stream containing current weather response.
   */
  getCurrentWeather(
    cityName: string,
    unit: OpenWeatherMeasurementUnit = 'metric',
  ): Observable<OpenWeatherCurrentWeatherResponse> {
    return this.httpClient.get<OpenWeatherCurrentWeatherResponse>(
      `${OPEN_WEATHER_BASE_URL}/weather`,
      {
        params: this.createCommonQueryParams(cityName, unit),
      },
    );
  }

  /**
   * Fetches 5-day / 3-hour forecast data for a city.
   * @param cityName City query used by OpenWeather.
   * @param unit Unit system sent to OpenWeather.
   * @returns Stream containing forecast response.
   */
  getForecast(
    cityName: string,
    unit: OpenWeatherMeasurementUnit = 'metric',
  ): Observable<OpenWeatherForecastResponse> {
    return this.httpClient.get<OpenWeatherForecastResponse>(`${OPEN_WEATHER_BASE_URL}/forecast`, {
      params: this.createCommonQueryParams(cityName, unit),
    });
  }

  /**
   * Creates query params shared by weather and forecast endpoints.
   * @param cityName City query used by OpenWeather.
   * @param unit Unit system sent to OpenWeather.
   * @returns Common request query params.
   */
  private createCommonQueryParams(cityName: string, unit: OpenWeatherMeasurementUnit): HttpParams {
    return new HttpParams()
      .set('q', cityName)
      .set('units', unit)
      .set('appid', environment.apiKeys.openWeatherApiKey);
  }
}
