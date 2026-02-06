import { Component, ChangeDetectionStrategy, computed, OnInit, inject, output } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar implements OnInit {
  private router = inject(Router);
  public readonly hideSidebar = output<void>();
  public readonly logoSource = computed(() =>
    this.themeService.theme() === 'dark' ? 'assets/logo-light.svg' : 'assets/logo-dark.svg',
  );

  public readonly themeService = inject(ThemeService);
  
  public boards = [
    { id: 1, name: 'Platform Launch' },
    { id: 2, name: 'Marketing Plan' },
    { id: 3, name: 'Roadmap' },
  ];

  ngOnInit() {
    this.themeService.setTheme(this.themeService.theme());
  }

  onToggleSidebarVisibility() {
    this.hideSidebar.emit();
  }
  
  onCreateNewBoard() {
    console.log('Create new board');
  }

  onThemeToggle(event: Event) {
    const input = event.target as HTMLInputElement;
    this.themeService.setTheme(input.checked ? 'dark' : 'light');
  }

  onNavigateWithFilter(status: string) {
    this.router.navigate([], {
      queryParams: { filter: status },
      queryParamsHandling: 'merge'
    });
  }
}