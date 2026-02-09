import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Button } from '../../../../shared/components';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  imports: [Button],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private authService = inject(AuthService);

  public onUserLogin(event: Event): void {
    event.preventDefault();
    this.authService.login();
  }
}