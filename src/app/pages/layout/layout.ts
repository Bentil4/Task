import { Component, ChangeDetectionStrategy, signal, OnInit, inject, OnDestroy } from '@angular/core';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Header } from '../../components/header/header';
import { Board } from '../../components/board/board';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout',
  imports: [Sidebar, Header, Board],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class layout implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private subscription?: Subscription;
  
  boardId = signal<number>(1);
  boardTitle = signal<string>('Platform Launch');
  filterStatus = signal<string | null>(null);
  sortBy = signal<string | null>(null);

  private boards = [
    { id: 1, name: 'Platform Launch' },
    { id: 2, name: 'Marketing Plan' },
    { id: 3, name: 'Roadmap' },
  ];

  ngOnInit() {
    this.subscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const boardId = Number(id);
        this.boardId.set(boardId);
        const board = this.boards.find(b => b.id === boardId);
        if (board) {
          this.boardTitle.set(board.name);
        }
      }
    });

    this.route.queryParamMap.subscribe(queryParams => {
      this.filterStatus.set(queryParams.get('filter'));
      this.sortBy.set(queryParams.get('sort'));
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onHideSidebar() {}
  onAddNewTask(event: Event) {}
  onAddNewColumn(event: Event) {}
  
  onFilterChange(status: string) {
    this.filterStatus.set(status || null);
  }
}
