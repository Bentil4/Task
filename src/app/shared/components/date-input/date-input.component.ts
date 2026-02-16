import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrl: './date-input.component.css',
  imports: [FormsModule],
})
export class DateInputComponent {
  label = input<string>('');
  value = input<string>('');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  
  valueChange = output<string>();

  onValueChange(newValue: string) {
    this.valueChange.emit(newValue);
  }
}
