import { Component, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
import { SidebarComponent } from '../../../features/board/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../features/board/components/header/header.component';
import { BoardComponent } from '../../../features/board/components/board/board.component';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BoardService } from '../../services';
import { ShowSidebarButtonComponent } from '../../../shared/components/show-sidebar-button/show-sidebar-button.component';
import { IHasUnsavedChanges } from '../../models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, HeaderComponent, BoardComponent, ShowSidebarButtonComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements IHasUnsavedChanges {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private boardService = inject(BoardService);
  
  public readonly sidebarHidden = signal(false);
  
  public readonly boardId = toSignal(
    this.route.paramMap.pipe(
      map(params => {
        const id = params.get('id');
        return id ? Number(id) : 1;
      })
    ),
    { initialValue: 1 }
  );
  
  public readonly boardTitle = computed(() => {
    const board = this.boardService.getBoardById(this.boardId());
    return board?.name ?? 'Platform Launch';
  });
  
  public readonly filterStatus = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('filter'))),
    { initialValue: null }
  );
  
  public readonly sortBy = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('sort'))),
    { initialValue: null }
  );

  public onFilterChange(status: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { filter: status || null },
      queryParamsHandling: 'merge'
    });
  }

  public onAddTask(): void {
    this.router.navigate(['/board', this.boardId(), 'new-task']);
  }

  public hasUnsavedChanges(): boolean {
    return false;
  }
}
