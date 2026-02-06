import { Component, ChangeDetectionStrategy } from '@angular/core';
import { input } from '@angular/core';

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.html',
  styleUrl: './board-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.board-card]': 'true',
  },
})
export class BoardCard {
  public readonly card = input<any>(null);

  get completedCount() {
    const c = this.card();
    return c?.subtasks?.filter((s: any) => s.isCompleted).length ?? 0;
  }

  get totalCount() {
    const c = this.card();
    return c?.subtasks?.length ?? 0;
  }
}
