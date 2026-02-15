import { Injectable, signal } from '@angular/core';
import { IBoard, ITask } from '../models/board.model';
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

  public getTaskById(boardId: number, taskId: string): ITask | undefined {
    const board = this.getBoardDataByIndex(boardId - 1);
    if (!board?.columns) return undefined;
    
    for (const column of board.columns) {
      const task = column.tasks.find((t, idx) => `${idx}` === taskId);
      if (task) return task;
    }
    return undefined;
  }

  public addTask(boardId: number, taskData: any): void {
    console.log('Adding task to board', boardId, taskData);
  }

  public updateTask(boardId: number, taskId: string, taskData: any): void {
    console.log('Updating task', taskId, 'in board', boardId, taskData);
  }
}
