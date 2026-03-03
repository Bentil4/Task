import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components';

@Component({
  selector: 'app-header',
  imports: [ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  public readonly title = input<string>('Platform Launch');
  public readonly currentFilter = input<string>('');
  public readonly filterChange = output<string>();
  public readonly addTask = output<void>();
  public readonly menuToggle = output<void>();

  public onFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filterChange.emit(select.value);
  }

  public onAddTask(): void {
    this.addTask.emit();
  }
}
