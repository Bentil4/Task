import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  imports: [ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private authService = inject(AuthService);

  public onUserLogin(event: Event): void {
    event.preventDefault();
    this.authService.login();
  }
}