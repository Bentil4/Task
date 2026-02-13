import { Injectable, signal } from '@angular/core';
import { IBoard } from '../models/board.model';
import { BOARDS, DATA_URL } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  public readonly boards = signal<IBoard[]>(BOARDS);
  public readonly allBoardsData = signal<IBoard[]>([]);
  public readonly isLoading = signal<boolean>(false);

  public async loadBoardsData(): Promise<void> {
    this.isLoading.set(true);
    try {
      const response = await fetch(DATA_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.allBoardsData.set(data.boards ?? []);
    } catch (error) {
      console.error('Failed to load boards:', error);
      this.allBoardsData.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  public getBoardById(id: number): IBoard | undefined {
    return this.boards().find(board => board.id === id);
  }

  public getBoardDataByIndex(index: number): IBoard | undefined {
    const data = this.allBoardsData();
    if (index < 0 || index >= data.length) return undefined;
    return data[index];
  }
}
