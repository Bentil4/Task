import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Header } from '../../components/header/header';
import { Board } from '../../components/board/board';

@Component({
  selector: 'app-home',
  imports: [Sidebar, Header, Board],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class layout {
  public handleClick(event: Event) {}

  onHideSidebar() {}
  onAddTask(event: Event) {}
  onAddColumn(event: Event) {}
}
