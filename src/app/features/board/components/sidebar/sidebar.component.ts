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
import { ThemeService, BoardService, DialogService } from '../../../../core/services';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CreateBoardFormComponent } from '../create-board-form/create-board-form.component';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CreateBoardFormComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  private router = inject(Router);
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

  ngOnInit(): void {
  }

  public onCreateNewBoard(): void {
    this.isCreatingBoard.set(true);
  }

  public onBoardCreated(boardName: string): void {
    this.isCreatingBoard.set(false);
    const success = this.boardService.addBoard(boardName);
    if (success) {
      this.router.navigate(['/board', this.boardService.boards().length]);
    }
  }

  public onBoardFormCanceled(): void {
    this.isCreatingBoard.set(false);
  }

  public onThemeToggle(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.themeService.setTheme(input.checked ? 'dark' : 'light');
  }

  public onNavigateWithFilter(status: string): void {
    this.router.navigate([], {
      queryParams: { filter: status },
      queryParamsHandling: 'merge',
    });
  }
}
