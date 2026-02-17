import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private storage = inject(StorageService);

  readonly theme = signal<'light' | 'dark'>(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.theme());
  }

  private getInitialTheme(): 'light' | 'dark' {
    const stored = this.storage.getItem(STORAGE_KEYS.THEME);
    return stored === 'dark' || stored === 'light' ? stored : 'light';
  }

  private applyTheme(value: 'light' | 'dark'): void {
    document.documentElement.classList.toggle('theme-dark', value === 'dark');
  }

  public setTheme(value: 'light' | 'dark'): void {
    this.theme.set(value);
    this.applyTheme(value);
    this.storage.setItem(STORAGE_KEYS.THEME, value);
  }

  public toggleTheme(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }
}