import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationComponent } from './core/components/notification/notification';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog';
import { DialogService } from './core/services/dialog.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationComponent, ConfirmDialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  dialogService = inject(DialogService);
}
