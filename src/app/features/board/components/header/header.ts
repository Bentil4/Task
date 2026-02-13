import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Button } from '../../../../shared/components';

@Component({
  selector: 'app-header',
  imports: [Button],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  public readonly title = input<string>('Platform Launch');
  public readonly currentFilter = input<string>('');
  public readonly filterChange = output<string>();
  public readonly addTask = output<void>();

  public onFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filterChange.emit(select.value);
  }

  public onAddTask(): void {
    this.addTask.emit();
  }
}
