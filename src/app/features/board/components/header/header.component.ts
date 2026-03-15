import { Component, ChangeDetectionStrategy, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonComponent } from '../../../../shared/components';
import { NotificationService } from '../../../../core/services';
import * as BoardActions from '../../../../core/store/board/actions/board.actions';

@Component({
  selector: 'app-header',
  imports: [ButtonComponent, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private store = inject(Store);
  private notificationService = inject(NotificationService);

  public readonly title = input<string>('Platform Launch');
  public readonly boardId = input<number>(1);
  public readonly currentFilter = input<string>('');
  public readonly filterChange = output<string>();
  public readonly addTask = output<void>();
  public readonly menuToggle = output<void>();
  public readonly boardUpdated = output<void>();
  public readonly boardDeleted = output<void>();

  public isMenuOpen = signal(false);
  public isEditingBoard = signal(false);
  public editBoardName = signal('');

  public onFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filterChange.emit(select.value);
  }

  public onAddTask(): void {
    this.addTask.emit();
  }

  public toggleMenu(): void {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  public closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  public openEditBoard(): void {
    this.editBoardName.set(this.title());
    this.isEditingBoard.set(true);
    this.closeMenu();
  }

  public cancelEditBoard(): void {
    this.isEditingBoard.set(false);
    this.editBoardName.set('');
  }

  public saveEditBoard(): void {
    const newName = this.editBoardName().trim();
    if (!newName) {
      this.notificationService.error('Board name cannot be empty');
      return;
    }

    this.store.dispatch(
      BoardActions.updateBoard({
        boardId: this.boardId(),
        newName,
      }),
    );

    this.notificationService.success('Board updated successfully');
    this.isEditingBoard.set(false);
    this.boardUpdated.emit();
  }

  public deleteBoard(): void {
    if (
      !confirm(`Are you sure you want to delete "${this.title()}"? This action cannot be undone.`)
    ) {
      return;
    }

    this.store.dispatch(
      BoardActions.deleteBoard({
        boardId: this.boardId(),
      }),
    );

    this.notificationService.success('Board deleted successfully');
    this.boardDeleted.emit();
  }
}
