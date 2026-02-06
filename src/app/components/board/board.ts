import { Component, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { Button } from '../shared/button/button';
import { BoardCard } from './board-card';
import { NgForOf, NgIf } from '@angular/common';
import { output } from '@angular/core';

@Component({
  selector: 'app-board',
  imports: [Button, BoardCard, NgForOf, NgIf],
  templateUrl: './board.html',
  styleUrl: './board.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Board {
  private cdr = inject(ChangeDetectorRef);
  readonly addColumn = output<Event>();
  public columns: any[] = [];
  public loading = true;

  constructor() {
    void this.load();
  }

  async load() {
    try {
      const response = await fetch('/data.json');
      if (response.ok) {
        const data = await response.json();
        this.columns = data.boards?.[0]?.columns ?? [];
      }
    } catch (e) {
      // ignore - keep empty state
    }
    this.loading = false;
    this.cdr.markForCheck();
  }

  onAddColumn(event: Event) {
    this.addColumn.emit(event);
  }
}
