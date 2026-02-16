import { Injectable, signal } from '@angular/core';
import { IBoard, ITask } from '../models/board.model';
import { BOARDS, DATA_URL } from '../constants/app.constants';

@Injectable({
  providedIn: 'root',
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
    return this.boards().find((board) => board.id === id);
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

  public addTask(boardId: number, taskData: ITask): boolean {
    const boards = this.allBoardsData();
    const board = boards[boardId - 1];

    if (!board?.columns) return false;

    const statusColumn = board.columns.find(
      (column) => column.name.toLowerCase() === taskData.status.toLowerCase(),
    );

    if (!statusColumn) return false;

    statusColumn.tasks.push(taskData);
    this.allBoardsData.set([...boards]);
    return true;
  }

  public updateTask(boardId: number, taskId: string, taskData: ITask): boolean {
    const boards = this.allBoardsData();
    const board = boards[boardId - 1];

    if (!board?.columns) return false;

    let taskFound = false;
    let oldColumn: any = null;
    let taskIndex = -1;

    for (const column of board.columns) {
      const idx = column.tasks.findIndex((task, idx) => `${idx}` === taskId);
      if (idx !== -1) {
        oldColumn = column;
        taskIndex = idx;
        taskFound = true;
        break;
      }
    }

    if (!taskFound || !oldColumn) return false;

    const newColumn = board.columns.find(
      (column) => column.name.toLowerCase() === taskData.status.toLowerCase(),
    );

    if (!newColumn) return false;

    oldColumn.tasks.splice(taskIndex, 1);

    if (oldColumn.name.toLowerCase() === taskData.status.toLowerCase()) {
      oldColumn.tasks.splice(taskIndex, 0, taskData);
    } else {
      newColumn.tasks.push(taskData);
    }

    this.allBoardsData.set([...boards]);
    return true;
  }
}
