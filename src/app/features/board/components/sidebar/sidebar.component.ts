import {
  Component,
  ChangeDetectionStrategy,
  computed,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';
import { ThemeService, BoardService } from '../../../../core/services';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  private router = inject(Router);
  private boardService = inject(BoardService);
  public readonly themeService = inject(ThemeService);

  public readonly hidden = input(false);
  public readonly hide = output<void>();

  public readonly logoSource = computed(() =>
    this.themeService.theme() === 'dark' ? 'assets/logo-light.svg' : 'assets/logo-dark.svg',
  );

  public readonly boards = this.boardService.boards;

  ngOnInit(): void {
  }

  public onCreateNewBoard(): void {
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
