import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Button } from '../../components/shared/button/button';
import { output } from '@angular/core';

@Component({
  selector: 'app-settings',
  imports: [Button],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Settings {
  readonly saveSettings = output<Event>();

  onSave(event: Event) {
    this.saveSettings.emit(event);
  }
}