import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  styleUrl: './button.css',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  public readonly variant = input<'primary' | 'secondary' | 'danger'>('primary');
  public readonly size = input<'sm' | 'md' | 'lg'>('md');
  public readonly disabled = input<boolean>(false);
  public readonly type = input<'button' | 'submit' | 'reset'>('button');
  public readonly ariaLabel = input<string | null>(null);
  public readonly clicked = output<Event>();

  onButtonClick(event: Event) {
    if (this.disabled()) {
      event.preventDefault();
    }
    this.clicked.emit(event);
  }
}
