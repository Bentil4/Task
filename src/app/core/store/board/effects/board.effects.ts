import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import * as BoardActions from '../actions/board.actions';
import { BoardService } from '../../../services/board.service';
import { NotificationService } from '../../../services/notification.service';

@Injectable()
export class BoardEffects {
  private actions$ = inject(Actions);
  private boardService = inject(BoardService);
  private notificationService = inject(NotificationService);

  loadBoards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.loadBoards),
      switchMap(() => {
        this.boardService.loadBoardsData();
        const boards = this.boardService.allBoardsData();
        return of(BoardActions.loadBoardsSuccess({ boards }));
      }),
      catchError((error: Error) =>
        of(BoardActions.loadBoardsFailure({ error: error.message }))
      )
    )
  );

  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.addTask),
      tap(({ boardId, taskData }) => {
        this.boardService.addTask(boardId, taskData);
      }),
      map(() => BoardActions.addTaskSuccess()),
      catchError((error: Error) => {
        this.notificationService.error('Failed to add task');
        return of(BoardActions.loadBoardsFailure({ error: error.message }));
      })
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.updateTask),
      tap(({ boardId, taskId, taskData }) => {
        this.boardService.updateTask(boardId, taskId, taskData);
      }),
      map(() => BoardActions.updateTaskSuccess()),
      catchError((error: Error) => {
        this.notificationService.error('Failed to update task');
        return of(BoardActions.loadBoardsFailure({ error: error.message }));
      })
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.deleteTask),
      tap(({ boardId, taskId }) => {
        this.boardService.deleteTask(boardId, taskId);
      }),
      map(() => BoardActions.deleteTaskSuccess()),
      catchError((error: Error) => {
        this.notificationService.error('Failed to delete task');
        return of(BoardActions.loadBoardsFailure({ error: error.message }));
      })
    )
  );

  addBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.addBoard),
      tap(({ boardName }) => {
        this.boardService.addBoard(boardName);
      }),
      map(() => BoardActions.addBoardSuccess()),
      catchError((error: Error) => {
        this.notificationService.error('Failed to add board');
        return of(BoardActions.loadBoardsFailure({ error: error.message }));
      })
    )
  );

  updateBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.updateBoard),
      tap(({ boardId, newName }) => {
        this.boardService.updateBoard(boardId, newName);
      }),
      map(() => BoardActions.updateBoardSuccess()),
      catchError((error: Error) => {
        this.notificationService.error('Failed to update board');
        return of(BoardActions.loadBoardsFailure({ error: error.message }));
      })
    )
  );

  deleteBoard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.deleteBoard),
      tap(({ boardId }) => {
        this.boardService.deleteBoard(boardId);
      }),
      map(() => BoardActions.deleteBoardSuccess()),
      catchError((error: Error) => {
        this.notificationService.error('Failed to delete board');
        return of(BoardActions.loadBoardsFailure({ error: error.message }));
      })
    )
  );

  addColumn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.addColumn),
      tap(({ boardId, columnName }) => {
        this.boardService.addColumn(boardId, columnName);
      }),
      map(() => BoardActions.addColumnSuccess()),
      catchError((error: Error) => {
        this.notificationService.error('Failed to add column');
        return of(BoardActions.loadBoardsFailure({ error: error.message }));
      })
    )
  );

  deleteColumn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BoardActions.deleteColumn),
      tap(({ boardId, columnName }) => {
        this.boardService.deleteColumn(boardId, columnName);
      }),
      map(() => BoardActions.deleteColumnSuccess()),
      catchError((error: Error) => {
        this.notificationService.error('Failed to delete column');
        return of(BoardActions.loadBoardsFailure({ error: error.message }));
      })
    )
  );
}
