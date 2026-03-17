import { delay, http, HttpResponse } from 'msw';

const OPEN_WEATHER_BASE = 'https://api.openweathermap.org/data/2.5';

const WEATHER_DELAY_MS = 120;
const SLOW_WEATHER_DELAY_MS = 900;
const CELSIUS_TO_FAHRENHEIT_SCALE_NUMERATOR = 9;
const CELSIUS_TO_FAHRENHEIT_SCALE_DENOMINATOR = 5;
const CELSIUS_TO_FAHRENHEIT_OFFSET = 32;
const MPS_TO_MPH_FACTOR = 2.236_936_29;

const currentWeatherResponse = {
  weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
  main: {
    temp: 25.3,
    feels_like: 24.8,
    temp_min: 20.1,
    temp_max: 27.9,
    pressure: 1011,
    humidity: 43,
  },
  wind: {
    speed: 4.7,
    deg: 238,
  },
  dt: 1_763_653_200,
  name: 'Madrid',
  timezone: 3600,
};

const forecastResponse = {
  city: {
    id: 3_117_734,
    name: 'Madrid',
    country: 'ES',
    timezone: 3600,
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
      dt: 1_763_696_400,
      dt_txt: '2026-03-17 00:00:00',
      weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10n' }],
      main: {
        temp: 16,
        feels_like: 15,
        temp_min: 15,
        temp_max: 17,
        pressure: 1014,
        humidity: 63,
      },
      wind: { speed: 4.5, deg: 205 },
    },
    {
      dt: 1_763_707_200,
      dt_txt: '2026-03-17 03:00:00',
      weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10n' }],
      main: {
        temp: 15,
        feels_like: 14,
        temp_min: 14,
        temp_max: 16,
        pressure: 1015,
        humidity: 65,
      },
      wind: { speed: 5, deg: 200 },
    },
    {
      dt: 1_763_718_000,
      dt_txt: '2026-03-17 06:00:00',
      weather: [{ id: 804, main: 'Clouds', description: 'overcast clouds', icon: '04d' }],
      main: {
        temp: 15,
        feels_like: 14,
        temp_min: 14,
        temp_max: 16,
        pressure: 1016,
        humidity: 66,
      },
      wind: { speed: 4.7, deg: 210 },
    },
    {
      dt: 1_763_728_800,
      dt_txt: '2026-03-17 09:00:00',
      weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
      main: {
        temp: 18,
        feels_like: 17,
        temp_min: 17,
        temp_max: 19,
        pressure: 1016,
        humidity: 58,
      },
      wind: { speed: 4.3, deg: 220 },
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
    {
      dt: 1_763_826_000,
      dt_txt: '2026-03-18 12:00:00',
      weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
      main: {
        temp: 22,
        feels_like: 22,
        temp_min: 21,
        temp_max: 23,
        pressure: 1014,
        humidity: 49,
      },
      wind: { speed: 3.7, deg: 228 },
    },
    {
      dt: 1_763_912_400,
      dt_txt: '2026-03-19 12:00:00',
      weather: [{ id: 802, main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
      main: {
        temp: 20,
        feels_like: 19,
        temp_min: 19,
        temp_max: 21,
        pressure: 1012,
        humidity: 54,
      },
      wind: { speed: 4.6, deg: 215 },
    },
    {
      dt: 1_763_998_800,
      dt_txt: '2026-03-20 12:00:00',
      weather: [{ id: 500, main: 'Rain', description: 'light rain', icon: '10d' }],
      main: {
        temp: 18,
        feels_like: 17,
        temp_min: 17,
        temp_max: 19,
        pressure: 1010,
        humidity: 64,
      },
      wind: { speed: 5.4, deg: 208 },
    },
    {
      dt: 1_764_085_200,
      dt_txt: '2026-03-21 12:00:00',
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      main: {
        temp: 23,
        feels_like: 23,
        temp_min: 22,
        temp_max: 24,
        pressure: 1013,
        humidity: 45,
      },
      wind: { speed: 3.5, deg: 240 },
    },
  ],
};

/**
 * Converts celsius to fahrenheit.
 * @param celsius Temperature value in celsius.
 * @returns Temperature value in fahrenheit.
 */
function toFahrenheit(celsius: number): number {
  return (
    celsius * (CELSIUS_TO_FAHRENHEIT_SCALE_NUMERATOR / CELSIUS_TO_FAHRENHEIT_SCALE_DENOMINATOR) +
    CELSIUS_TO_FAHRENHEIT_OFFSET
  );
}

/**
 * Converts meters per second to miles per hour.
 * @param metersPerSecond Wind speed in meters per second.
 * @returns Wind speed in miles per hour.
 */
function toMph(metersPerSecond: number): number {
  return metersPerSecond * MPS_TO_MPH_FACTOR;
}

/**
 * Resolves query city with a stable default.
 * @param cityQuery Raw city query parameter from request.
 * @returns Normalized city string.
 */
function resolveCityName(cityQuery: string | null): string {
  const normalizedCity = cityQuery?.trim();
  return normalizedCity && normalizedCity.length > 0 ? normalizedCity : 'Madrid';
}

/**
 * Creates current-weather payload using requested city and unit system.
 * @param cityName City name requested by the client.
 * @param units Unit system requested by the client.
 * @returns Current weather payload.
 */
function buildCurrentWeatherResponse(
  cityName: string,
  units: string | null,
): typeof currentWeatherResponse {
  const isImperial = units === 'imperial';

  return {
    ...currentWeatherResponse,
    name: cityName,
    main: {
      ...currentWeatherResponse.main,
      temp: isImperial
        ? toFahrenheit(currentWeatherResponse.main.temp)
        : currentWeatherResponse.main.temp,
      feels_like: isImperial
        ? toFahrenheit(currentWeatherResponse.main.feels_like)
        : currentWeatherResponse.main.feels_like,
      temp_min: isImperial
        ? toFahrenheit(currentWeatherResponse.main.temp_min)
        : currentWeatherResponse.main.temp_min,
      temp_max: isImperial
        ? toFahrenheit(currentWeatherResponse.main.temp_max)
        : currentWeatherResponse.main.temp_max,
    },
    wind: {
      ...currentWeatherResponse.wind,
      speed: isImperial
        ? toMph(currentWeatherResponse.wind.speed)
        : currentWeatherResponse.wind.speed,
    },
  };
}

/**
 * Creates forecast payload using requested city and unit system.
 * @param cityName City name requested by the client.
 * @param units Unit system requested by the client.
 * @returns Forecast payload.
 */
function buildForecastResponse(cityName: string, units: string | null): typeof forecastResponse {
  const isImperial = units === 'imperial';

  return {
    ...forecastResponse,
    city: {
      ...forecastResponse.city,
      name: cityName,
    },
    list: forecastResponse.list.map(item => ({
      ...item,
      main: {
        ...item.main,
        temp: isImperial ? toFahrenheit(item.main.temp) : item.main.temp,
        feels_like: isImperial ? toFahrenheit(item.main.feels_like) : item.main.feels_like,
        temp_min: isImperial ? toFahrenheit(item.main.temp_min) : item.main.temp_min,
        temp_max: isImperial ? toFahrenheit(item.main.temp_max) : item.main.temp_max,
      },
      wind: {
        ...item.wind,
        speed: isImperial ? toMph(item.wind.speed) : item.wind.speed,
      },
    })),
  };
}

/**
 * Returns true when request should return simulated API error.
 * @param cityName Requested city name.
 * @returns Whether response should fail.
 */
function shouldReturnError(cityName: string): boolean {
  return cityName.toLowerCase() === 'error-city';
}

/**
 * Resolves a deterministic response delay for a given city.
 * @param cityName Requested city name.
 * @returns Delay value in milliseconds.
 */
function resolveDelay(cityName: string): number {
  return cityName.toLowerCase() === 'slowville' ? SLOW_WEATHER_DELAY_MS : WEATHER_DELAY_MS;
}

export const weatherHandlers = [
  http.get(`${OPEN_WEATHER_BASE}/weather`, async ({ request }) => {
    const url = new URL(request.url);
    const cityName = resolveCityName(url.searchParams.get('q'));
    const units = url.searchParams.get('units');

    await delay(resolveDelay(cityName));

    if (shouldReturnError(cityName)) {
      return HttpResponse.json({ message: 'City not found' }, { status: 404 });
    }

    return HttpResponse.json(buildCurrentWeatherResponse(cityName, units));
  }),

  http.get(`${OPEN_WEATHER_BASE}/forecast`, async ({ request }) => {
    const url = new URL(request.url);
    const cityName = resolveCityName(url.searchParams.get('q'));
    const units = url.searchParams.get('units');

    await delay(resolveDelay(cityName));

    if (shouldReturnError(cityName)) {
      return HttpResponse.json({ message: 'City not found' }, { status: 404 });
    }

    return HttpResponse.json(buildForecastResponse(cityName, units));
  }),
];
