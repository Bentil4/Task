import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public readonly theme = signal<'light' | 'dark'>(localStorage.getItem('theme') as 'light' | 'dark' || 'light');

  setTheme(value: 'light' | 'dark') {
    this.theme.set(value);
    document.documentElement.classList.toggle('theme-dark', value === 'dark');
    localStorage.setItem('theme', value);
  }

  toggleTheme() {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }
}
