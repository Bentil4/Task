import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Button } from '../../components/shared/button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [Button],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Settings {
  private router = inject(Router);

  onSaveSettings() {
    console.log('Settings saved');
  }

  onLogout() {
    localStorage.removeItem('isAuthenticated');
    this.router.navigate(['/login']);
  }
}