import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import type { WeatherForecastEntry, WeatherTemperatureUnit } from '@app/weather/models';
import { ForecastComponent } from '@app/weather/forecast/forecast.component';

@Component({
  selector: 'app-daily-forecast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './daily-forecast.component.html',
  styleUrls: ['./daily-forecast.component.scss'],
  imports: [ForecastComponent, TranslatePipe],
})
export class DailyForecastComponent {
  /** Next 5 days represented as forecast cards. */
  readonly entries = input.required<WeatherForecastEntry[]>();

  /** Temperature unit shared by all forecast cards in this section. */
  readonly unit = input.required<WeatherTemperatureUnit>();
}
