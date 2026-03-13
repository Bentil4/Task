import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { BoardEffects } from '../board.effects';
import { BoardService } from '../../../services/board.service';
import { NotificationService } from '../../../services/notification.service';
import * as BoardActions from './board.actions';

describe('BoardEffects', () => {
  let actions$: Observable<any>;
  let effects: BoardEffects;
  let boardService: jasmine.SpyObj<BoardService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    const boardServiceSpy = jasmine.createSpyObj('BoardService', [
      'loadBoardsData',
      'addTask',
      'updateTask',
      'deleteTask',
      'addBoard',
      'updateBoard',
      'deleteBoard',
      'addColumn',
      'deleteColumn'
    ]);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        BoardEffects,
        provideMockActions(() => actions$),
        { provide: BoardService, useValue: boardServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    });

    effects = TestBed.inject(BoardEffects);
    boardService = TestBed.inject(BoardService) as jasmine.SpyObj<BoardService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
