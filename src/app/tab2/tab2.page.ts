import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ImageGalleryComponent } from '@app/image-gallery/image-gallery.component';

@Component({
  selector: 'app-tab2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [ImageGalleryComponent],
})
export class Tab2Page {}
