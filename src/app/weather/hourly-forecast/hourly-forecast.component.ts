import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import type { WeatherForecastEntry, WeatherTemperatureUnit } from '@app/weather/models';
import { ForecastComponent } from '@app/weather/forecast/forecast.component';

@Component({
  selector: 'app-hourly-forecast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hourly-forecast.component.html',
  styleUrls: ['./hourly-forecast.component.scss'],
  imports: [ForecastComponent, TranslatePipe],
})
export class HourlyForecastComponent {
  /** Next 24 hours represented as 8 forecast cards. */
  readonly entries = input.required<WeatherForecastEntry[]>();

  /** Temperature unit shared by all forecast cards in this section. */
  readonly unit = input.required<WeatherTemperatureUnit>();
}
