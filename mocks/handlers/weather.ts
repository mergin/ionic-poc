import { delay, http, HttpResponse } from 'msw';

const OPEN_WEATHER_BASE = 'https://api.openweathermap.org/data/2.5';

const WEATHER_DELAY_MS = 120;

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

export const weatherHandlers = [
  http.get(`${OPEN_WEATHER_BASE}/weather`, async () => {
    await delay(WEATHER_DELAY_MS);
    return HttpResponse.json(currentWeatherResponse);
  }),

  http.get(`${OPEN_WEATHER_BASE}/forecast`, async () => {
    await delay(WEATHER_DELAY_MS);
    return HttpResponse.json(forecastResponse);
  }),
];
