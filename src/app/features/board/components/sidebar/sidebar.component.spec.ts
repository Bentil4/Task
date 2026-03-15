import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SidebarComponent } from './sidebar.component';
import {
  ThemeService,
  BoardService,
  DialogService,
  NotificationService,
} from '../../../../core/services';
import { signal } from '@angular/core';
import * as BoardActions from '../../../../core/store/board/actions/board.actions';

describe('SidebarComponent', () => {
  let mockRouter: jest.Mocked<Router>;
  let mockBoardService: jest.Mocked<Partial<BoardService>>;
  let mockStore: { dispatch: jest.Mock };
  let mockThemeService: jest.Mocked<Partial<ThemeService>>;
  let mockNotificationService: jest.Mocked<Partial<NotificationService>>;

  beforeEach(() => {
    mockRouter = { navigate: jest.fn() } as any;
    mockStore = { dispatch: jest.fn() };
    mockBoardService = {
      boards: signal([
        { id: 1, name: 'Board 1' },
        { id: 2, name: 'Board 2' },
      ]),
    };
    mockThemeService = {
      theme: signal('light' as 'light' | 'dark'),
      setTheme: jest.fn(),
    };
    mockNotificationService = {
      success: jest.fn(),
      error: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore },
        { provide: BoardService, useValue: mockBoardService },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: DialogService, useValue: {} },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    });
  });

  it('should create board and navigate', () => {
    TestBed.runInInjectionContext(() => {
      const component = new SidebarComponent();
      component.onBoardCreated('New Board');
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        BoardActions.addBoard({ boardName: 'New Board' }),
      );
      expect(component.isCreatingBoard()).toBe(false);
    });
  });

  it('should toggle theme', () => {
    TestBed.runInInjectionContext(() => {
      const component = new SidebarComponent();
      const event = { target: { checked: true } } as any;
      component.onThemeToggle(event);
      expect(mockThemeService.setTheme).toHaveBeenCalledWith('dark');
    });
  });

  it('should delete board successfully', () => {
    TestBed.runInInjectionContext(() => {
      const component = new SidebarComponent();
      component.onDeleteBoard(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith(BoardActions.deleteBoard({ boardId: 1 }));
      expect(mockNotificationService.success).toHaveBeenCalled();
    });
  });

  it('should compute light logo for light theme', () => {
    TestBed.runInInjectionContext(() => {
      const component = new SidebarComponent();
      expect(component.logoSource()).toBe('assets/logo-dark.svg');
    });
  });

  it('should compute dark logo for dark theme', () => {
    TestBed.runInInjectionContext(() => {
      mockThemeService.theme?.set('dark');
      const component = new SidebarComponent();
      expect(component.logoSource()).toBe('assets/logo-light.svg');
    });
  });

  it('should navigate with filter query param', () => {
    TestBed.runInInjectionContext(() => {
      const component = new SidebarComponent();
      component.onNavigateWithFilter('Done');
      expect(mockRouter.navigate).toHaveBeenCalledWith([], {
        queryParams: { filter: 'Done' },
        queryParamsHandling: 'merge',
      });
    });
  });
});
