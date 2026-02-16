import { Component, ChangeDetectionStrategy, input, computed, output } from '@angular/core';
import { ITask } from '../../../../core/models';

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.component.html',
  styleUrl: './board-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardCardComponent {
  public readonly card = input<ITask | null>(null);
  public readonly cardClick = output<string>();

  public readonly completedSubtasksCount = computed(() => {
    const cardData = this.card();
    return cardData?.subtasks?.filter((subtask) => subtask.isCompleted).length ?? 0;
  });

  readonly totalSubtasksCount = computed(() => {
    const cardData = this.card();
    return cardData?.subtasks?.length ?? 0;
  });

  onCardClick(): void {
    const taskId = this.card()?.id;
    if (taskId) {
      this.cardClick.emit(taskId);
    }
  }
}
