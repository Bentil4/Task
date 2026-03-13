import { IBoard } from '../models/board.model';

export const BOARDS: IBoard[] = [
  { id: 1, name: 'Platform Launch' },
  { id: 2, name: 'Marketing Plan' },
  { id: 3, name: 'Roadmap' },
];

export const STORAGE_KEYS = {
  AUTH: 'isAuthenticated',
  THEME: 'theme',
  BOARDS: 'kanban_boards_data',
} as const;
