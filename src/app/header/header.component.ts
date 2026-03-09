import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonContent,
  IonPopover,
  IonLabel,
  IonItem,
  IonList,
} from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { language } from 'ionicons/icons';

type SupportedLang = 'en' | 'es';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonList,
    IonItem,
    IonLabel,
    IonPopover,
    IonContent,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonIcon,
    IonButtons,
    IonButton,
    TranslatePipe,
  ],
})
export class HeaderComponent implements OnInit {
  /**
   * Title text to display in the header, passed as an input property.
   */
  title = input.required<string>();

  private readonly translateService = inject(TranslateService);

  protected readonly activeLang = signal<SupportedLang>('en');

  private _popover = viewChild.required<IonPopover>('popover');

  /**
   *
   */
  constructor() {
    this.registerIcons();
  }

  /**
   * Initializes the language selector from persisted user preference.
   * @returns void
   */
  ngOnInit(): void {
    const storedLang = localStorage.getItem('app.lang');
    const initialLang: SupportedLang = storedLang === 'es' ? 'es' : 'en';
    this.setLanguage(initialLang, false);
  }

  /**
   * Updates the active language and optionally persists user preference.
   * @param language Language code to apply.
   * @param persist Whether to persist the selected language in localStorage.
   * @returns void
   */
  protected setLanguage(language: SupportedLang, persist = true): void {
    this.activeLang.set(language);
    this.translateService.use(language);

    if (persist) {
      localStorage.setItem('app.lang', language);
    }

    this._popover().dismiss();
  }

  /**
   * Registers icon assets used by this component.
   * @returns void
   */
  private registerIcons(): void {
    addIcons({ language });
  }
}
