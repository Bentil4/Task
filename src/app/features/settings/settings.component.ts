import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ButtonComponent } from '../../shared/components';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-settings',
  imports: [ButtonComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
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