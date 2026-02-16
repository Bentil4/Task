import { Injectable, signal, inject } from '@angular/core';
import { IBoard, ITask, IColumn } from '../models/board.model';
import { BOARDS, DATA_URL } from '../constants/app.constants';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'kanban_boards_data';

interface IBoardData {
  boards?: IBoard[];
}

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private storageService = inject(StorageService);
  public readonly boards = signal<IBoard[]>(BOARDS);
  public readonly allBoardsData = signal<IBoard[]>([]);
  public readonly isLoading = signal<boolean>(false);

  public async loadBoardsData(): Promise<void> {
    this.isLoading.set(true);
    try {
      const cached = this.storageService.getItem(STORAGE_KEY);
      if (cached) {
        this.allBoardsData.set(JSON.parse(cached));
        this.isLoading.set(false);
        return;
      }

      const response = await fetch(DATA_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: IBoardData = await response.json();
      const boardsWithIds = data.boards?.map((board: IBoard) => ({
        ...board,
        columns: board.columns?.map((column: IColumn) => ({
          ...column,
          tasks: column.tasks.map((task: ITask) => ({
            ...task,
            id: task.id || this.generateTaskId()
          }))
        }))
      })) ?? [];
      this.allBoardsData.set(boardsWithIds);
      this.saveToStorage();
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
      const task = column.tasks.find((t) => t.id === taskId);
      if (task) return task;
    }
    return undefined;
  }

  public addTask(boardId: number, taskData: Partial<ITask>): boolean {
    const boards = this.allBoardsData();
    const board = boards[boardId - 1];

    if (!board?.columns) return false;

    const statusColumn = board.columns.find(
      (column) => column.name.toLowerCase() === taskData.status?.toLowerCase(),
    );

    if (!statusColumn) return false;

    const newTask: ITask = {
      id: this.generateTaskId(),
      title: taskData.title || '',
      description: taskData.description || '',
      status: taskData.status || '',
      dueDate: taskData.dueDate,
      subtasks: taskData.subtasks || []
    };

    statusColumn.tasks.push(newTask);
    this.allBoardsData.set([...boards]);
    this.saveToStorage();
    return true;
  }

  public updateTask(boardId: number, taskId: string, taskData: Partial<ITask>): boolean {
    const boards = this.allBoardsData();
    const board = boards[boardId - 1];

    if (!board?.columns) return false;

    let taskFound = false;
    let oldColumn: IColumn | null = null;
    let taskIndex = -1;

    for (const column of board.columns) {
      const idx = column.tasks.findIndex((task) => task.id === taskId);
      if (idx !== -1) {
        oldColumn = column;
        taskIndex = idx;
        taskFound = true;
        break;
      }
    }

    if (!taskFound || !oldColumn) return false;

    const existingTask = oldColumn.tasks[taskIndex];
    const updatedTask: ITask = {
      ...existingTask,
      ...taskData,
      id: existingTask.id
    };

    const newColumn = board.columns.find(
      (column) => column.name.toLowerCase() === updatedTask.status.toLowerCase(),
    );

    if (!newColumn) return false;

    oldColumn.tasks.splice(taskIndex, 1);

    if (oldColumn.name.toLowerCase() === updatedTask.status.toLowerCase()) {
      oldColumn.tasks.splice(taskIndex, 0, updatedTask);
    } else {
      newColumn.tasks.push(updatedTask);
    }

    this.allBoardsData.set([...boards]);
    this.saveToStorage();
    return true;
  }

  public deleteTask(boardId: number, taskId: string): boolean {
    const boards = this.allBoardsData();
    const board = boards[boardId - 1];

    if (!board?.columns) return false;

    for (const column of board.columns) {
      const taskIndex = column.tasks.findIndex((task) => task.id === taskId);
      if (taskIndex !== -1) {
        column.tasks.splice(taskIndex, 1);
        this.allBoardsData.set([...boards]);
        this.saveToStorage();
        return true;
      }
    }

    return false;
  }

  private generateTaskId(): string {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveToStorage(): void {
    try {
      this.storageService.setItem(STORAGE_KEY, JSON.stringify(this.allBoardsData()));
    } catch (error) {
      console.error('Failed to save boards to storage:', error);
    }
  }
}
