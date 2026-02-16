import { Injectable, signal, Component } from '@angular/core';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog';

export interface DialogConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialogConfig = signal<DialogConfig | null>(null);
  private resolvePromise?: (value: boolean) => void;

  get config() {
    return this.dialogConfig;
  }

  confirm(config: DialogConfig): Promise<boolean> {
    this.dialogConfig.set({
      ...config,
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel',
    });

    return new Promise<boolean>((resolve) => {
      this.resolvePromise = resolve;
    });
  }

  handleConfirm(): void {
    this.resolvePromise?.(true);
    this.close();
  }

  handleCancel(): void {
    this.resolvePromise?.(false);
    this.close();
  }

  private close(): void {
    this.dialogConfig.set(null);
    this.resolvePromise = undefined;
  }
}
