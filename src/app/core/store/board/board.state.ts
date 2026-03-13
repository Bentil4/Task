import { IBoard } from '../../models';

export interface BoardState {
  boards: IBoard[];
  selectedBoardId: number | null;
  loading: boolean;
  error: string | null;
}

export const initialBoardState: BoardState = {
  boards: [],
  selectedBoardId: null,
  loading: false,
  error: null
};
