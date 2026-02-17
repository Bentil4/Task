import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { ISelectOption } from '../../../core/models';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  imports: [FormsModule],
})
export class SelectComponent {
  label = input<string>('');
  options = input<ISelectOption[]>([]);
  value = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  error = input<string>('');

  valueChange = output<string>();
  
  private readonly errorId = `error-${Math.random().toString(36).substr(2, 9)}`;

  onValueChange(newValue: string) {
    this.valueChange.emit(newValue);
  }
  
  getErrorId(): string {
    return this.errorId;
  }
}
