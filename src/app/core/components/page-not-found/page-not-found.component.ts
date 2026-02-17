import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [ButtonComponent],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFoundComponent {
  private router = inject(Router);

  public onNavigateToHome(): void {
    this.router.navigate(['/']);
  }
}