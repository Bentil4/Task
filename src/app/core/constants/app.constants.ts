import { Board } from '../models/board.model';

export const BOARDS: Board[] = [
  { id: 1, name: 'Platform Launch' },
  { id: 2, name: 'Marketing Plan' },
  { id: 3, name: 'Roadmap' },
];

export const STORAGE_KEYS = {
  AUTH: 'isAuthenticated',
  THEME: 'theme',
} as const;

export const DATA_URL = '/data.json';
