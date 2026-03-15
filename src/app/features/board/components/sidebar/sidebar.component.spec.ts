import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { ThemeService, BoardService, DialogService, NotificationService } from '../../../../core/services';
import { signal } from '@angular/core';

describe('SidebarComponent', () => {
  let mockRouter: jest.Mocked<Router>;
  let mockBoardService: jest.Mocked<Partial<BoardService>>;
  let mockThemeService: jest.Mocked<Partial<ThemeService>>;
  let mockNotificationService: jest.Mocked<Partial<NotificationService>>;

  beforeEach(() => {
    mockRouter = { navigate: jest.fn() } as any;
    mockBoardService = {
      boards: signal([{ id: 1, name: 'Board 1' }, { id: 2, name: 'Board 2' }]),
      addBoard: jest.fn(),
      deleteBoard: jest.fn()
    };
    mockThemeService = {
      theme: signal('light' as 'light' | 'dark'),
      setTheme: jest.fn()
    };
    mockNotificationService = {
      success: jest.fn(),
      error: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: BoardService, useValue: mockBoardService },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: DialogService, useValue: {} },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    });
  });

  it('should create board and navigate', () => {
    TestBed.runInInjectionContext(() => {
      const component = new SidebarComponent();
      mockBoardService.addBoard = jest.fn().mockReturnValue(true);
      component.onBoardCreated('New Board');
      expect(mockBoardService.addBoard).toHaveBeenCalledWith('New Board');
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
      mockBoardService.deleteBoard = jest.fn().mockReturnValue(true);
      component.onDeleteBoard(1);
      expect(mockBoardService.deleteBoard).toHaveBeenCalledWith(1);
      expect(mockNotificationService.success).toHaveBeenCalled();
    });
  });
});
