import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BoardState } from '../board.state';
import { IBoard } from '../../../models';

export const selectBoardState = createFeatureSelector<BoardState>('board');

export const selectAllBoards = createSelector(
  selectBoardState,
  (state: BoardState) => state.boards
);

export const selectBoardLoading = createSelector(
  selectBoardState,
  (state: BoardState) => state.loading
);

export const selectBoardError = createSelector(
  selectBoardState,
  (state: BoardState) => state.error
);

export const selectBoardById = (boardId: number) =>
  createSelector(
    selectAllBoards,
    (boards: IBoard[]) => boards.find((b: IBoard) => b.id === boardId)
  );
