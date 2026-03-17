/** Weather condition descriptor from OpenWeather API. */
export interface OpenWeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

/** Main temperature and pressure values from OpenWeather API. */
export interface OpenWeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

/** Wind values from OpenWeather API. */
export interface OpenWeatherWind {
  speed: number;
  deg?: number;
}

/** City metadata returned with forecast responses. */
export interface OpenWeatherCity {
  id: number;
  name: string;
  country: string;
  timezone: number;
}

/** Current weather endpoint response shape. */
export interface OpenWeatherCurrentWeatherResponse {
  weather: OpenWeatherCondition[];
  main: OpenWeatherMain;
  wind: OpenWeatherWind;
  dt: number;
  name: string;
  timezone: number;
}

/** One 3-hour forecast entry from OpenWeather forecast endpoint. */
export interface OpenWeatherForecastItem {
  dt: number;
  main: OpenWeatherMain;
  weather: OpenWeatherCondition[];
  wind: OpenWeatherWind;
  dt_txt: string;
}

/** Forecast endpoint response shape. */
export interface OpenWeatherForecastResponse {
  list: OpenWeatherForecastItem[];
  city: OpenWeatherCity;
}

/** Supported OpenWeather API measurement units. */
export type OpenWeatherMeasurementUnit = 'metric' | 'imperial';

/** Temperature units exposed by weather UI controls. */
export type WeatherTemperatureUnit = 'celsius' | 'fahrenheit';

/** Current-weather summary displayed in the weather hero card. */
export interface CurrentWeatherView {
  cityName: string;
  localTimeLabel: string;
  temperature: number;
  weatherLabel: string;
  iconUrl: string;
  windSpeed: number;
  feelsLike: number;
  highTemp: number;
  lowTemp: number;
}

/** Normalized weather card item used by hourly and daily forecast UI components. */
export interface WeatherForecastEntry {
  timeLabel: string;
  weatherLabel: string;
  iconUrl: string;
  temperature: number;
}

/** Aggregated weather view model consumed by the WeatherComponent template. */
export interface WeatherViewModel {
  current: CurrentWeatherView;
  hourly: WeatherForecastEntry[];
  daily: WeatherForecastEntry[];
}
