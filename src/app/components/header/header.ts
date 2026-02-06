import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Button } from '../shared/button/button';

@Component({
  selector: 'app-header',
  imports: [Button],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  readonly title = input<string>('Platform Launch');
  readonly currentFilter = input<string>('');
  readonly addTask = output<Event>();
  readonly filterChange = output<string>();

  onAddTask(event: Event) {
    this.addTask.emit(event);
  }

  onFilterChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.filterChange.emit(select.value);
  }
}
