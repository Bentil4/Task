import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  public readonly variant = input<'primary' | 'secondary' | 'danger'>('primary');
  public readonly size = input<'sm' | 'md' | 'lg'>('md');
  public readonly disabled = input<boolean>(false);
  public readonly type = input<'button' | 'submit' | 'reset'>('button');
  public readonly ariaLabel = input<string | null>(null);
  public readonly clicked = output<Event>();

  public onButtonClick(event: Event): void {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    this.clicked.emit(event);
  }
}
