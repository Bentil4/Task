import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { BoardEffects } from './board.effects';
import { BoardService } from '../../../services/board.service';
import { NotificationService } from '../../../services/notification.service';
import * as BoardActions from '../actions/board.actions';

describe('BoardEffects', () => {
  let actions$: Observable<any>;
  let effects: BoardEffects;
  let boardService: jest.Mocked<BoardService>;
  let notificationService: jest.Mocked<NotificationService>;

  beforeEach(() => {
    const boardServiceMock = {
      loadBoardsData: jest.fn(),
      addTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      addBoard: jest.fn(),
      updateBoard: jest.fn(),
      deleteBoard: jest.fn(),
      addColumn: jest.fn(),
      deleteColumn: jest.fn()
    };
    const notificationServiceMock = {
      error: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        BoardEffects,
        provideMockActions(() => actions$),
        { provide: BoardService, useValue: boardServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock }
      ]
    });

    effects = TestBed.inject(BoardEffects);
    boardService = TestBed.inject(BoardService) as jest.Mocked<BoardService>;
    notificationService = TestBed.inject(NotificationService) as jest.Mocked<NotificationService>;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
