import { Component, input, output, viewChild, effect, ElementRef } from '@angular/core';
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
  error = input<string>('');
  autoFocus = input<boolean>(false);
  
  valueChange = output<string>();
  
  inputEl = viewChild<ElementRef<HTMLInputElement>>('inputField');
  
  private readonly errorId = `error-${Math.random().toString(36).substr(2, 9)}`;
  
  constructor() {
    effect(() => {
      if (this.autoFocus() && this.inputEl()) {
        setTimeout(() => this.inputEl()?.nativeElement.focus(), 0);
      }
    });
  }

  onValueChange(newValue: string) {
    this.valueChange.emit(newValue);
  }
  
  getErrorId(): string {
    return this.errorId;
  }
}
