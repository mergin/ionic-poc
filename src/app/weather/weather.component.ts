import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonToggle,
} from '@ionic/angular/standalone';
import type { RefresherCustomEvent, SearchbarCustomEvent, ToggleCustomEvent } from '@ionic/core';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize, forkJoin, map } from 'rxjs';

import type {
  CurrentWeatherView,
  OpenWeatherCurrentWeatherResponse,
  OpenWeatherForecastResponse,
  OpenWeatherMeasurementUnit,
  WeatherForecastEntry,
  WeatherTemperatureUnit,
  WeatherViewModel,
} from '@app/weather/models';
import { CurrentWeatherComponent } from '@app/weather/current-weather/current-weather.component';
import { DailyForecastComponent } from '@app/weather/daily-forecast/daily-forecast.component';
import { HourlyForecastComponent } from '@app/weather/hourly-forecast/hourly-forecast.component';
import { OpenWeatherApiService } from '@app/weather/services';

const HOURS_PER_DAY = 24;
const FORECAST_STEP_HOURS = 3;
const HOURLY_ENTRY_LIMIT = HOURS_PER_DAY / FORECAST_STEP_HOURS;
const DAILY_ENTRY_LIMIT = 5;
const MILLISECONDS_PER_SECOND = 1000;

@Component({
  selector: 'app-weather',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  imports: [
    IonRefresherContent,
    IonRefresher,
    IonContent,
    IonItem,
    IonLabel,
    IonSearchbar,
    IonToggle,
    TranslatePipe,
    CurrentWeatherComponent,
    HourlyForecastComponent,
    DailyForecastComponent,
  ],
})
export class WeatherComponent {
  private readonly openWeatherApiService = inject(OpenWeatherApiService);
  private readonly refreshNonce = signal(0);
  private readonly refreshCompleteByNonce = signal(new Map<number, () => Promise<void>>());

  protected readonly cityName = signal('Madrid');
  private readonly temperatureUnitSelection = signal<WeatherTemperatureUnit>('celsius');

  private readonly weatherResource = rxResource({
    params: () => ({
      cityName: this.cityName(),
      refreshNonce: this.refreshNonce(),
      unit: this.toOpenWeatherMeasurementUnit(this.temperatureUnitSelection()),
    }),
    stream: ({ params }) => {
      const requestNonce = params.refreshNonce;

      return forkJoin({
        current: this.openWeatherApiService.getCurrentWeather(params.cityName, params.unit),
        forecast: this.openWeatherApiService.getForecast(params.cityName, params.unit),
      }).pipe(
        map(({ current, forecast }) => this.toWeatherViewModel(current, forecast)),
        finalize(() => {
          const completeRefresh = this.refreshCompleteByNonce().get(requestNonce);

          if (completeRefresh !== undefined) {
            void completeRefresh();
            this.refreshCompleteByNonce.update(previousMap => {
              const nextMap = new Map(previousMap);
              nextMap.delete(requestNonce);
              return nextMap;
            });
          }
        }),
      );
    },
  });

  protected readonly currentWeather = computed(() => this.weatherResource.value()?.current);
  protected readonly hourlyForecast = computed(() => this.weatherResource.value()?.hourly ?? []);
  protected readonly dailyForecast = computed(() => this.weatherResource.value()?.daily ?? []);
  protected readonly isFahrenheitSelected = computed(
    () => this.temperatureUnitSelection() === 'fahrenheit',
  );
  protected readonly temperatureUnit = computed(() => this.temperatureUnitSelection());
  protected readonly loading = computed(() => this.weatherResource.isLoading());
  protected readonly errorMessageKey = computed(() =>
    this.weatherResource.status() === 'error' ? 'weather.loadError' : null,
  );

  /**
   * Handles pull-to-refresh by requesting a new weather fetch.
   * @param event Custom refresher event emitted by ion-refresher.
   */
  protected handleRefresh(event: RefresherCustomEvent): void {
    const nextNonce = this.refreshNonce() + 1;

    this.refreshCompleteByNonce.update(previousMap => {
      const nextMap = new Map(previousMap);
      nextMap.set(nextNonce, () => event.target.complete());
      return nextMap;
    });

    this.refreshNonce.set(nextNonce);
  }

  /**
   * Updates city search query and triggers weather refetch.
   * @param event Searchbar change event.
   */
  protected handleCitySearchChange(event: SearchbarCustomEvent): void {
    const nextCityName = event.detail.value?.trim() ?? '';

    if (nextCityName.length === 0 || nextCityName === this.cityName()) {
      return;
    }

    this.cityName.set(nextCityName);
  }

  /**
   * Switches between celsius and fahrenheit weather units.
   * @param event Toggle change event.
   */
  protected handleTemperatureUnitChange(event: ToggleCustomEvent): void {
    this.temperatureUnitSelection.set(event.detail.checked ? 'fahrenheit' : 'celsius');
  }

  /**
   * Maps raw API responses into UI-focused weather view models.
   * @param current Current weather API response.
   * @param forecast Forecast API response.
   * @returns View model consumed by weather tab components.
   */
  private toWeatherViewModel(
    current: OpenWeatherCurrentWeatherResponse,
    forecast: OpenWeatherForecastResponse,
  ): WeatherViewModel {
    return {
      current: this.toCurrentWeatherView(current),
      hourly: this.toHourlyForecastEntries(forecast),
      daily: this.toDailyForecastEntries(forecast),
    };
  }

  /**
   * Maps current weather response into the top section view model.
   * @param current Current weather API response.
   * @returns Current weather view model.
   */
  private toCurrentWeatherView(current: OpenWeatherCurrentWeatherResponse): CurrentWeatherView {
    const weatherCondition = current.weather[0];

    return {
      cityName: current.name,
      localTimeLabel: this.formatTimeLabel(current.dt, current.timezone),
      temperature: current.main.temp,
      weatherLabel: weatherCondition?.description ?? 'N/A',
      iconUrl: this.getIconUrl(weatherCondition?.icon),
      windSpeed: current.wind.speed,
      feelsLike: current.main.feels_like,
      highTemp: current.main.temp_max,
      lowTemp: current.main.temp_min,
    };
  }

  /**
   * Maps forecast response into the next 24-hour card entries.
   * @param forecast Forecast API response.
   * @returns Hourly forecast card entries.
   */
  private toHourlyForecastEntries(forecast: OpenWeatherForecastResponse): WeatherForecastEntry[] {
    return forecast.list.slice(0, HOURLY_ENTRY_LIMIT).map(item => {
      const condition = item.weather[0];

      return {
        timeLabel: this.formatHourLabel(item.dt, forecast.city.timezone),
        weatherLabel: condition?.main ?? 'N/A',
        iconUrl: this.getIconUrl(condition?.icon),
        temperature: item.main.temp,
      };
    });
  }

  /**
   * Maps forecast response into 5 daily card entries.
   * @param forecast Forecast API response.
   * @returns Daily forecast card entries.
   */
  private toDailyForecastEntries(forecast: OpenWeatherForecastResponse): WeatherForecastEntry[] {
    const entriesByDay = forecast.list.reduce((accumulator, item) => {
      const dayKey = this.getLocalDateKey(item.dt, forecast.city.timezone);

      if (!accumulator.has(dayKey)) {
        accumulator.set(dayKey, item);
      }

      return accumulator;
    }, new Map<string, OpenWeatherForecastResponse['list'][number]>());

    return Array.from(entriesByDay.values())
      .slice(0, DAILY_ENTRY_LIMIT)
      .map(item => {
        const condition = item.weather[0];

        return {
          timeLabel: this.formatDayLabel(item.dt, forecast.city.timezone),
          weatherLabel: condition?.main ?? 'N/A',
          iconUrl: this.getIconUrl(condition?.icon),
          temperature: item.main.temp,
        };
      });
  }

  /**
   * Formats a local-time label from timestamp and timezone offset.
   * @param timestampUtc Unix timestamp in seconds.
   * @param timezoneOffsetSeconds Timezone offset in seconds from UTC.
   * @returns Time label in HH:mm format.
   */
  private formatTimeLabel(timestampUtc: number, timezoneOffsetSeconds: number): string {
    return this.formatWithUtcTimezone(timestampUtc, timezoneOffsetSeconds, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  /**
   * Formats an hour label for hourly forecast cards.
   * @param timestampUtc Unix timestamp in seconds.
   * @param timezoneOffsetSeconds Timezone offset in seconds from UTC.
   * @returns Hour label in HH:mm format.
   */
  private formatHourLabel(timestampUtc: number, timezoneOffsetSeconds: number): string {
    return this.formatTimeLabel(timestampUtc, timezoneOffsetSeconds);
  }

  /**
   * Formats a day label for daily forecast cards.
   * @param timestampUtc Unix timestamp in seconds.
   * @param timezoneOffsetSeconds Timezone offset in seconds from UTC.
   * @returns Day label in short weekday format.
   */
  private formatDayLabel(timestampUtc: number, timezoneOffsetSeconds: number): string {
    return this.formatWithUtcTimezone(timestampUtc, timezoneOffsetSeconds, {
      weekday: 'short',
    });
  }

  /**
   * Builds a local date key from timestamp and timezone offset.
   * @param timestampUtc Unix timestamp in seconds.
   * @param timezoneOffsetSeconds Timezone offset in seconds from UTC.
   * @returns ISO-like local date key.
   */
  private getLocalDateKey(timestampUtc: number, timezoneOffsetSeconds: number): string {
    return this.formatWithUtcTimezone(timestampUtc, timezoneOffsetSeconds, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  /**
   * Formats a timestamp by shifting timezone and rendering it in UTC.
   * @param timestampUtc Unix timestamp in seconds.
   * @param timezoneOffsetSeconds Timezone offset in seconds from UTC.
   * @param options Intl date formatting options.
   * @returns Formatted date string.
   */
  private formatWithUtcTimezone(
    timestampUtc: number,
    timezoneOffsetSeconds: number,
    options: Intl.DateTimeFormatOptions,
  ): string {
    const timestampWithTimezoneOffsetMs =
      (timestampUtc + timezoneOffsetSeconds) * MILLISECONDS_PER_SECOND;

    return new Intl.DateTimeFormat('en-US', {
      ...options,
      timeZone: 'UTC',
    }).format(new Date(timestampWithTimezoneOffsetMs));
  }

  /**
   * Maps view-level unit state to the OpenWeather unit query parameter.
   * @param temperatureUnit Unit state selected in weather controls.
   * @returns OpenWeather-compatible measurement unit.
   */
  private toOpenWeatherMeasurementUnit(
    temperatureUnit: WeatherTemperatureUnit,
  ): OpenWeatherMeasurementUnit {
    return temperatureUnit === 'fahrenheit' ? 'imperial' : 'metric';
  }

  /**
   * Builds OpenWeather icon URL from icon code.
   * @param iconCode OpenWeather icon code.
   * @returns Icon URL for the weather condition.
   */
  private getIconUrl(iconCode: string | undefined): string {
    return `https://openweathermap.org/img/wn/${iconCode ?? '01d'}@2x.png`;
  }
}
