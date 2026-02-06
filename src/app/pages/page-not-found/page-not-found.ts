import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Button } from '../../components/shared/button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [Button],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFound {
  private router = inject(Router)

  onGoHome(event: Event) {
    this.router.navigate(['/']);
  }
}