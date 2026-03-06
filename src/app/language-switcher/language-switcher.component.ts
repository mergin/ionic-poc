import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { IonButton, IonButtons } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';

type SupportedLang = 'en' | 'es';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonButtons, IonButton, TranslatePipe],
})
export class LanguageSwitcherComponent implements OnInit {
  private readonly translateService = inject(TranslateService);

  protected readonly activeLang = signal<SupportedLang>('en');

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
  }
}
