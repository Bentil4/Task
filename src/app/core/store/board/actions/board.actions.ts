import { createAction, props } from '@ngrx/store';
import { ITask, IBoard } from '../../../models';

export const loadBoards = createAction('[Board] Load Boards');
export const loadBoardsSuccess = createAction(
  '[Board] Load Boards Success',
  props<{ boards: IBoard[] }>()
);
export const loadBoardsFailure = createAction(
  '[Board] Load Boards Failure',
  props<{ error: string }>()
);

export const addTask = createAction(
  '[Board] Add Task',
  props<{ boardId: number; taskData: Partial<ITask> }>()
);
export const addTaskSuccess = createAction('[Board] Add Task Success');

export const updateTask = createAction(
  '[Board] Update Task',
  props<{ boardId: number; taskId: string; taskData: Partial<ITask> }>()
);
export const updateTaskSuccess = createAction('[Board] Update Task Success');

export const deleteTask = createAction(
  '[Board] Delete Task',
  props<{ boardId: number; taskId: string }>()
);
export const deleteTaskSuccess = createAction('[Board] Delete Task Success');

export const addBoard = createAction(
  '[Board] Add Board',
  props<{ boardName: string }>()
);
export const addBoardSuccess = createAction('[Board] Add Board Success');

export const updateBoard = createAction(
  '[Board] Update Board',
  props<{ boardId: number; newName: string }>()
);
export const updateBoardSuccess = createAction('[Board] Update Board Success');

export const deleteBoard = createAction(
  '[Board] Delete Board',
  props<{ boardId: number }>()
);
export const deleteBoardSuccess = createAction('[Board] Delete Board Success');

export const addColumn = createAction(
  '[Board] Add Column',
  props<{ boardId: number; columnName: string }>()
);
export const addColumnSuccess = createAction('[Board] Add Column Success');

export const deleteColumn = createAction(
  '[Board] Delete Column',
  props<{ boardId: number; columnName: string }>()
);
export const deleteColumnSuccess = createAction('[Board] Delete Column Success');
