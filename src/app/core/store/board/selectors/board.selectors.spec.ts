import { selectAllBoards, selectBoardLoading, selectBoardError, selectBoardById } from './board.selectors';
import { BoardState } from './board.state';

describe('Board Selectors', () => {
  const mockState: BoardState = {
    boards: [
      { id: 1, name: 'Board 1', columns: [] },
      { id: 2, name: 'Board 2', columns: [] }
    ],
    selectedBoardId: 1,
    loading: false,
    error: null
  };

  it('should select all boards', () => {
    const result = selectAllBoards.projector(mockState);
    expect(result).toEqual(mockState.boards);
  });

  it('should select loading state', () => {
    const result = selectBoardLoading.projector(mockState);
    expect(result).toBe(false);
  });

  it('should select error state', () => {
    const result = selectBoardError.projector(mockState);
    expect(result).toBe(null);
  });

  it('should select board by id', () => {
    const selector = selectBoardById(1);
    const result = selector.projector(mockState.boards);
    expect(result).toEqual(mockState.boards[0]);
  });
});
