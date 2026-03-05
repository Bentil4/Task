import { createReducer, on } from '@ngrx/store';
import * as BoardActions from '../actions/board.actions';
import { BoardState, initialBoardState } from '../board.state';
import { IBoard } from '../../../models';

export const boardReducer = createReducer(
  initialBoardState,
  on(BoardActions.loadBoards, (state: BoardState) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(BoardActions.loadBoardsSuccess, (state: BoardState, { boards }: { boards: IBoard[] }) => ({
    ...state,
    boards,
    loading: false
  })),
  on(BoardActions.loadBoardsFailure, (state: BoardState, { error }: { error: string }) => ({
    ...state,
    loading: false,
    error
  })),
  on(BoardActions.addBoardSuccess, (state: BoardState) => ({
    ...state,
    loading: false
  })),
  on(BoardActions.updateBoardSuccess, (state: BoardState) => ({
    ...state,
    loading: false
  })),
  on(BoardActions.deleteBoardSuccess, (state: BoardState) => ({
    ...state,
    loading: false
  }))
);
