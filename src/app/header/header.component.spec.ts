import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let translateService: TranslateService;

  const HEADER_TITLE = 'Header title';
  const STORAGE_LANGUAGE_KEY = 'app.lang';
  const SPANISH_LANGUAGE = 'es';
  const ENGLISH_LANGUAGE = 'en';

  beforeEach(async () => {
    // ARRANGE
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
    fixture.componentRef.setInput('title', HEADER_TITLE);
    fixture.detectChanges();
  });

  afterEach(() => {
    // CLEANUP
    localStorage.removeItem(STORAGE_LANGUAGE_KEY);
  });

  it('should create', () => {
    // ARRANGE

    // ACT

    // ASSERT
    expect(component).toBeTruthy();
  });

  it('should initialize language from localStorage when available', () => {
    // ARRANGE
    const translateUseSpy = spyOn(translateService, 'use');
    localStorage.setItem(STORAGE_LANGUAGE_KEY, SPANISH_LANGUAGE);

    // ACT
    component.ngOnInit();

    // ASSERT
    expect(translateUseSpy).toHaveBeenCalledWith(SPANISH_LANGUAGE);
  });

  it('should persist selected language and close popover', () => {
    // ARRANGE
    const translateUseSpy = spyOn(translateService, 'use');
    const popoverElement = fixture.nativeElement.querySelector(
      'ion-popover',
    ) as HTMLIonPopoverElement;
    const popoverDismissSpy = spyOn(popoverElement, 'dismiss').and.resolveTo(true);

    // ACT
    (component as unknown as { setLanguage: (language: 'en' | 'es') => void }).setLanguage(
      ENGLISH_LANGUAGE,
    );

    // ASSERT
    expect(translateUseSpy).toHaveBeenCalledWith(ENGLISH_LANGUAGE);
    expect(localStorage.getItem(STORAGE_LANGUAGE_KEY)).toBe(ENGLISH_LANGUAGE);
    expect(popoverDismissSpy).toHaveBeenCalled();
  });

  it('should render title input', () => {
    // ARRANGE

    // ACT
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('ion-title');

    // ASSERT
    expect(titleElement?.textContent).toContain(HEADER_TITLE);
  });
});
