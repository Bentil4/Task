import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  private nextId = 1;

  public readonly notifications$ = this.notifications.asReadonly();

  public show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000): void {
    const notification: Notification = {
      id: this.nextId++,
      message,
      type,
    };

    this.notifications.update((notify) => [...notify, notification]);

    if (duration > 0) {
      setTimeout(() => this.remove(notification.id), duration);
    }
  }

  public success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  public error(message: string, duration = 4000): void {
    this.show(message, 'error', duration);
  }

  public remove(id: number): void {
    this.notifications.update((notify) => notify.filter((notification) => notification.id !== id));
  }

  public clear(): void {
    this.notifications.set([]);
  }
}
