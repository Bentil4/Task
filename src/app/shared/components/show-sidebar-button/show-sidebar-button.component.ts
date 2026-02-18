import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'button[app-show-sidebar-button]',
  templateUrl: './show-sidebar-button.component.html',
  styleUrl: './show-sidebar-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShowSidebarButtonComponent {}
