import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Button } from '../../components/shared/button/button';
import { output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [Button],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private router = inject(Router)
  readonly loginSubmit = output<Event>();

  onLogin(event: Event) {
    this.router.navigate(['/']);  
  }
}