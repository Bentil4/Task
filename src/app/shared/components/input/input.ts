import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.html',
  styleUrl: './input.css',
  imports: [FormsModule],
})
export class InputComponent {
  label = input<string>('');
  placeholder = input<string>('');
  value = input<string>('');
  type = input<'text' | 'email' | 'password'>('text');
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  
  valueChange = output<string>();

  onValueChange(newValue: string) {
    this.valueChange.emit(newValue);
  }
}
