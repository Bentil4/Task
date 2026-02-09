import { Component, ChangeDetectionStrategy, signal, OnInit, inject, effect } from '@angular/core';
import { Sidebar } from '../../../features/board/components/sidebar/sidebar';
import { Header } from '../../../features/board/components/header/header';
import { Board } from '../../../features/board/components/board/board';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BoardService } from '../../services';
import { ShowSidebarButton } from '../../../shared/components';
import { HasUnsavedChanges } from '../../guards';

@Component({
  selector: 'app-layout',
  imports: [Sidebar, Header, Board, ShowSidebarButton],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout implements OnInit, HasUnsavedChanges {
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  
  public readonly sidebarHidden = signal(false);
  public readonly boardId = signal<number>(1);
  public readonly boardTitle = signal<string>('Platform Launch');
  public readonly filterStatus = signal<string | null>(null);
  public readonly sortBy = signal<string | null>(null);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      const id = params.get('id');
      if (id) {
        const boardId = Number(id);
        if (!isNaN(boardId)) {
          this.boardId.set(boardId);
          const board = this.boardService.getBoardById(boardId);
          if (board) {
            this.boardTitle.set(board.name);
          }
        }
      }
    });

    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe(queryParams => {
      this.filterStatus.set(queryParams.get('filter'));
      this.sortBy.set(queryParams.get('sort'));
    });
  }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  public onFilterChange(status: string): void {
    this.filterStatus.set(status || null);
  }

  public hasUnsavedChanges(): boolean {
    return false;
  }
}
