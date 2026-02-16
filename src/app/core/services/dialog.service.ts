import { Injectable, signal } from '@angular/core';
import { IDialogConfig } from '../models';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialogConfig = signal<IDialogConfig | null>(null);
  private resolvePromise?: (value: boolean) => void;

  get config() {
    return this.dialogConfig;
  }

  confirm(config: IDialogConfig): Promise<boolean> {
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
