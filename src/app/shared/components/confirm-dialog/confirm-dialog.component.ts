import { Component, input, output, viewChild, effect, ElementRef } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
  host: {
    '(document:keydown.escape)': 'onCancel()'
  }
})
export class ConfirmDialogComponent {
  title = input<string>('Confirm');
  message = input<string>('Are you sure?');
  confirmText = input<string>('Confirm');
  cancelText = input<string>('Cancel');
  
  confirmed = output<void>();
  canceled = output<void>();
  
  confirmBtn = viewChild<ElementRef<HTMLButtonElement>>('confirmButton');
  
  constructor() {
    effect(() => {
      setTimeout(() => this.confirmBtn()?.nativeElement.focus(), 0);
    });
  }

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.canceled.emit();
  }
}
