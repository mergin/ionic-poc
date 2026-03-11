import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-explore-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
  imports: [TranslatePipe],
})
export class ExploreContainerComponent {
  /**
   * Label shown inside the explore container content area.
   */
  @Input() name?: string;
}
