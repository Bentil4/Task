import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Button } from '../../shared/components';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-settings',
  imports: [Button],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Settings {
  private authService = inject(AuthService);
  private location = inject(Location);

  public onGoBack(): void {
    this.location.back();
  }

  onSaveSettings(): void {
  }

  public onLogout(): void {
    this.authService.logout();
  }
}