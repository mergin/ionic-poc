import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';

import type { WeatherForecastEntry, WeatherTemperatureUnit } from '@app/weather/models';

@Component({
  selector: 'app-forecast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
  imports: [DecimalPipe, NgOptimizedImage],
})
export class ForecastComponent {
  /** Forecast card content rendered by the component. */
  readonly entry = input.required<WeatherForecastEntry>();

  /** Temperature unit used to format forecast values. */
  readonly unit = input.required<WeatherTemperatureUnit>();
}
