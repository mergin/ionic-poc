import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

import type { CurrentWeatherView, WeatherTemperatureUnit } from '@app/weather/models';

@Component({
  selector: 'app-current-weather',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss'],
  imports: [DecimalPipe, NgOptimizedImage, TranslatePipe],
})
export class CurrentWeatherComponent {
  /** Current weather details rendered at the top of the weather tab. */
  readonly weather = input.required<CurrentWeatherView>();

  /** Temperature unit used to format values shown in this section. */
  readonly unit = input.required<WeatherTemperatureUnit>();
}
