import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { Task } from '../../../../core/models';

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.html',
  styleUrl: './board-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardCard {
  public readonly card = input<Task | null>(null);

  public readonly completedSubtasksCount = computed(() => {
    const cardData = this.card();
    return cardData?.subtasks?.filter((subtask) => subtask.isCompleted).length ?? 0;
  });

  readonly totalSubtasksCount = computed(() => {
    const cardData = this.card();
    return cardData?.subtasks?.length ?? 0;
  });
}
