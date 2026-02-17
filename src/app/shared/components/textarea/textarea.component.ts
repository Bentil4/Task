import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.css',
  imports: [FormsModule],
})
export class TextareaComponent {
  label = input<string>('');
  placeholder = input<string>('');
  value = input<string>('');
  rows = input<number>(4);
  required = input<boolean>(false);
  disabled = input<boolean>(false);
  
  valueChange = output<string>();

  onValueChange(newValue: string) {
    this.valueChange.emit(newValue);
  }
}
