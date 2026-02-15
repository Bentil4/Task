import { Component, ChangeDetectionStrategy, input, computed, output } from '@angular/core';
import { ITask } from '../../../../core/models';

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.html',
  styleUrl: './board-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardCard {
  public readonly card = input<ITask | null>(null);
  public readonly taskIndex = input<number>(0);
  public readonly cardClick = output<number>();

  public readonly completedSubtasksCount = computed(() => {
    const cardData = this.card();
    return cardData?.subtasks?.filter((subtask) => subtask.isCompleted).length ?? 0;
  });

  readonly totalSubtasksCount = computed(() => {
    const cardData = this.card();
    return cardData?.subtasks?.length ?? 0;
  });

  onCardClick(): void {
    this.cardClick.emit(this.taskIndex());
  }
}
