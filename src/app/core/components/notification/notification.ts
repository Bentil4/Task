import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class NotificationComponent {
  private notificationService = inject(NotificationService);
  
  public notifications = this.notificationService.notifications$;

  public close(id: number): void {
    this.notificationService.remove(id);
  }
}
