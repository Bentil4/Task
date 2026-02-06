import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Button } from '../shared/button/button';
import { output, input } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [Button],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly title = input<string>('Platform Launch');
  readonly addTask = output<Event>();

  onAddTask(event: Event) {
    this.addTask.emit(event);
  }
}
