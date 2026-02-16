import { Component, input, output, viewChild, effect, ElementRef, HostListener } from '@angular/core';

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
  
  confirmBtn = viewChild<ElementRef<HTMLButtonElement>>('confirmButton');
  
  constructor() {
    effect(() => {
      setTimeout(() => this.confirmBtn()?.nativeElement.focus(), 0);
    });
  }
  
  @HostListener('document:keydown.escape')
  onEscape() {
    this.onCancel();
  }

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.canceled.emit();
  }
}
