import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  it('should create the app', async () => {
    // ARRANGE
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    // ACT
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // ASSERT
    expect(app).toBeTruthy();
  });
});
