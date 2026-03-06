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

  ngOnInit(): void {
    const storedLang = localStorage.getItem('app.lang');
    const initialLang: SupportedLang = storedLang === 'es' ? 'es' : 'en';
    this.setLanguage(initialLang, false);
  }

  protected setLanguage(language: SupportedLang, persist = true): void {
    this.activeLang.set(language);
    this.translateService.use(language);

    if (persist) {
      localStorage.setItem('app.lang', language);
    }
  }
}
