import {
  Component,
  ChangeDetectionStrategy,
  computed,
  OnInit,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ThemeService,
  BoardService,
  DialogService,
  NotificationService,
} from '../../../../core/services';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CreateBoardFormComponent } from '../create-board-form/create-board-form.component';
import * as BoardActions from '../../../../core/store/board/actions/board.actions';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CreateBoardFormComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  private router = inject(Router);
  private store = inject(Store);
  private boardService = inject(BoardService);
  private dialogService = inject(DialogService);
  public readonly themeService = inject(ThemeService);

  public readonly hidden = input(false);
  public readonly hide = output<void>();

  public readonly isCreatingBoard = signal(false);

  public readonly logoSource = computed(() =>
    this.themeService.theme() === 'dark' ? 'assets/logo-light.svg' : 'assets/logo-dark.svg',
  );

  public readonly boards = this.boardService.boards;

  ngOnInit(): void {}

  public onCreateNewBoard(): void {
    this.isCreatingBoard.set(true);
  }

  public onBoardCreated(boardName: string): void {
    this.isCreatingBoard.set(false);
    const boards = this.boardService.boards();
    const nextBoardId = Math.max(...boards.map((board) => board.id), 0) + 1;

    this.store.dispatch(
      BoardActions.addBoard({
        boardName,
      }),
    );

    this.router.navigate(['/board', nextBoardId]);
  }

  public onBoardFormCanceled(): void {
    this.isCreatingBoard.set(false);
  }

  public onThemeToggle(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.themeService.setTheme(input.checked ? 'dark' : 'light');
  }

  private notificationService = inject(NotificationService);

  public onDeleteBoard(boardId: number): void {
    this.store.dispatch(
      BoardActions.deleteBoard({
        boardId,
      }),
    );

    this.notificationService.success('Board deleted successfully');
    this.router.navigate(['/board', 1]);
  }

  public onNavigateWithFilter(status: string): void {
    this.router.navigate([], {
      queryParams: { filter: status },
      queryParamsHandling: 'merge',
    });
  }
}
