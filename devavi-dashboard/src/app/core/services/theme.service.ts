// theme.service.ts
import { Injectable, signal, effect } from '@angular/core';
import { gsap } from 'gsap';

type Theme = 'light' | 'dark' | 'professional' | 'creative' | 'terminal';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _currentTheme = signal<Theme>(this.getSystemPreference());
  private _themes: Theme[] = ['light', 'dark', 'professional', 'creative', 'terminal'];
  
  currentTheme = this._currentTheme.asReadonly();
  availableThemes = this._themes;

  constructor() {
    effect(() => {
      this.applyTheme(this._currentTheme());
      this.animateThemeChange();
    });
  }

  private getSystemPreference(): Theme {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme) {
    document.documentElement.className = theme;
    localStorage.setItem('devavi-theme', theme);
  }

  private animateThemeChange() {
    gsap.fromTo('body', 
      { opacity: 0.8, scale: 0.99 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
    );
  }

  setTheme(theme: Theme) {
    this._currentTheme.set(theme);
  }

  cycleTheme() {
    const currentIndex = this._themes.indexOf(this._currentTheme());
    const nextIndex = (currentIndex + 1) % this._themes.length;
    this._currentTheme.set(this._themes[nextIndex]);
  }
}