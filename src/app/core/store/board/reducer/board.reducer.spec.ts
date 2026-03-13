import { boardReducer } from './board.reducer';
import { initialBoardState } from './board.state';
import * as BoardActions from './board.actions';

describe('BoardReducer', () => {
  it('should return the initial state', () => {
    const action = { type: 'UNKNOWN' };
    const result = boardReducer(initialBoardState, action as any);
    expect(result).toBe(initialBoardState);
  });

  it('should handle loadBoards', () => {
    const action = BoardActions.loadBoards();
    const result = boardReducer(initialBoardState, action);
    expect(result.loading).toBe(true);
    expect(result.error).toBe(null);
  });

  it('should handle loadBoardsSuccess', () => {
    const boards = [{ id: 1, name: 'Test Board', columns: [] }];
    const action = BoardActions.loadBoardsSuccess({ boards });
    const result = boardReducer(initialBoardState, action);
    expect(result.boards).toEqual(boards);
    expect(result.loading).toBe(false);
  });

  it('should handle loadBoardsFailure', () => {
    const error = 'Test error';
    const action = BoardActions.loadBoardsFailure({ error });
    const result = boardReducer(initialBoardState, action);
    expect(result.error).toBe(error);
    expect(result.loading).toBe(false);
  });
});
