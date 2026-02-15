import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.html',
  styleUrl: './select.css',
  imports: [FormsModule],
})
export class SelectComponent {
  label = input<string>('');
  options = input<SelectOption[]>([]);
  value = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);

  valueChange = output<string>();

  onValueChange(newValue: string) {
    this.valueChange.emit(newValue);
  }
}
