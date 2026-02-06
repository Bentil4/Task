import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.html',
  styleUrl: './board-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardCard {
  public readonly card = input<any>(null);

  get completedSubtasksCount() {
    const cardData = this.card();
    return cardData?.subtasks?.filter((subtask: any) => subtask.isCompleted).length ?? 0;
  }

  get totalSubtasksCount() {
    const cardData = this.card();
    return cardData?.subtasks?.length ?? 0;
  }
}
