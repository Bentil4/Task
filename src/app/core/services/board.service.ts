import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { IBoard, ITask, IColumn } from '../models/board.model';
import { BOARDS, STORAGE_KEYS } from '../constants/app.constants';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private storageService = inject(StorageService);
  private http = inject(HttpClient);
  public readonly boards = signal<IBoard[]>(BOARDS);
  public readonly allBoardsData = signal<IBoard[]>([]);
  public readonly isLoading = signal<boolean>(false);

  public async loadBoardsData(): Promise<void> {
    this.isLoading.set(true);
    try {
      const cached = this.storageService.getItem(STORAGE_KEYS.BOARDS);
      if (cached) {
        const data = JSON.parse(cached);
        this.allBoardsData.set(data);
        this.boards.set(data.map((b: IBoard) => ({ id: b.id, name: b.name })));
        this.isLoading.set(false);
        return;
      }

      const data = await firstValueFrom(this.http.get<{ boards: IBoard[] }>(environment.apiUrl));
      const boardsWithIds =
        data?.boards?.map((board: IBoard, index: number) => ({
          ...board,
          id: board.id || index + 1,
          columns: board.columns?.map((column: IColumn) => ({
            ...column,
            tasks: column.tasks.map((task: ITask) => ({
              ...task,
              id: task.id || this.generateTaskId(),
            })),
          })),
        })) ?? [];
      this.allBoardsData.set(boardsWithIds);
      this.boards.set(boardsWithIds.map((b) => ({ id: b.id, name: b.name })));
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
      subtasks: taskData.subtasks || [],
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
      id: existingTask.id,
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

  public updateBoard(boardId: number, newName: string): boolean {
    const boards = this.allBoardsData();
    const board = boards.find((b) => b.id === boardId);
    if (!board) return false;

    board.name = newName;
    this.allBoardsData.set([...boards]);
    this.boards.set(boards.map((b) => ({ id: b.id, name: b.name })));
    this.saveToStorage();
    return true;
  }

  public deleteBoard(boardId: number): boolean {
    const boards = this.allBoardsData();
    const index = boards.findIndex((b) => b.id === boardId);
    if (index === -1) return false;

    boards.splice(index, 1);
    this.allBoardsData.set([...boards]);
    this.boards.set(boards.map((b) => ({ id: b.id, name: b.name })));
    this.saveToStorage();
    return true;
  }

  public deleteColumn(boardId: number, columnName: string): boolean {
    const boards = this.allBoardsData();
    const board = boards.find((b) => b.id === boardId);
    if (!board?.columns) return false;

    const index = board.columns.findIndex((c) => c.name === columnName);
    if (index === -1) return false;

    board.columns.splice(index, 1);
    this.allBoardsData.set([...boards]);
    this.saveToStorage();
    return true;
  }

  public addBoard(boardName: string): boolean {
    const boards = this.allBoardsData();
    const newBoardId = Math.max(...boards.map((b) => b.id), 0) + 1;

    const newBoard: IBoard = {
      id: newBoardId,
      name: boardName,
      columns: [
        { name: 'Todo', tasks: [] },
        { name: 'Doing', tasks: [] },
        { name: 'Done', tasks: [] },
      ],
    };

    boards.push(newBoard);
    this.allBoardsData.set([...boards]);
    this.boards.set(boards.map((b) => ({ id: b.id, name: b.name })));
    this.saveToStorage();
    return true;
  }

  public addColumn(boardId: number, columnName: string): boolean {
    const boards = this.allBoardsData();
    const board = boards[boardId - 1];

    if (!board?.columns) return false;

    const newColumn: IColumn = {
      name: columnName,
      tasks: [],
    };

    board.columns.push(newColumn);
    this.allBoardsData.set([...boards]);
    this.saveToStorage();
    return true;
  }

  private generateTaskId(): string {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private saveToStorage(): void {
    try {
      this.storageService.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(this.allBoardsData()));
    } catch (error) {
      console.error('Failed to save boards to storage:', error);
    }
  }
}
