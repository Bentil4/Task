import { Component, ChangeDetectionStrategy, computed, OnInit, inject } from '@angular/core';
import { output } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar implements OnInit {
  public readonly hide = output<void>();
  public readonly logo = computed(() =>
    this.themeService.theme() === 'dark' ? 'assets/logo-light.svg' : 'assets/logo-dark.svg',
  );

  public readonly themeService = inject(ThemeService);

  ngOnInit() {
    this.themeService.setTheme(this.themeService.theme());
  }

  onToggleHide() {
    this.hide.emit();
  }
  onCreateBoard() {}
}
