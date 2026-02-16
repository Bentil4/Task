import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialogComponent {
  title = input<string>('Confirm');
  message = input<string>('Are you sure?');
  confirmText = input<string>('Confirm');
  cancelText = input<string>('Cancel');
  
  confirmed = output<void>();
  canceled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.canceled.emit();
  }
}
