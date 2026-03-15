import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { taskExistsGuard } from './task-exists.guard';
import { BoardService, NotificationService } from '../services';

describe('taskExistsGuard', () => {
  let mockRouter: jest.Mocked<Router>;
  let mockBoardService: jest.Mocked<Partial<BoardService>>;
  let mockNotificationService: jest.Mocked<Partial<NotificationService>>;
  let mockRoute: Partial<ActivatedRouteSnapshot>;

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn()
    } as any;

    mockBoardService = {
      getTaskById: jest.fn()
    };

    mockNotificationService = {
      error: jest.fn()
    };

    mockRoute = {
      paramMap: {
        get: jest.fn()
      } as any
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: BoardService, useValue: mockBoardService },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    });
  });

  it('should allow activation when task exists', () => {
    (mockRoute.paramMap!.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'id') return '1';
      if (key === 'taskId') return 'task-1';
      return null;
    });

    mockBoardService.getTaskById = jest.fn().mockReturnValue({
      id: 'task-1',
      title: 'Test Task',
      status: 'Todo'
    });

    TestBed.runInInjectionContext(() => {
      const result = taskExistsGuard(mockRoute as ActivatedRouteSnapshot, {} as any);
      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  it('should prevent activation when task does not exist', () => {
    (mockRoute.paramMap!.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'id') return '1';
      if (key === 'taskId') return 'invalid-task';
      return null;
    });

    mockBoardService.getTaskById = jest.fn().mockReturnValue(undefined);

    TestBed.runInInjectionContext(() => {
      const result = taskExistsGuard(mockRoute as ActivatedRouteSnapshot, {} as any);
      
      expect(result).toBe(false);
      expect(mockNotificationService.error).toHaveBeenCalledWith('Task not found');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/board', 1], { replaceUrl: true });
    });
  });

  it('should allow activation when no taskId is provided', () => {
    (mockRoute.paramMap!.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'id') return '1';
      if (key === 'taskId') return null;
      return null;
    });

    TestBed.runInInjectionContext(() => {
      const result = taskExistsGuard(mockRoute as ActivatedRouteSnapshot, {} as any);
      expect(result).toBe(true);
      expect(mockBoardService.getTaskById).not.toHaveBeenCalled();
    });
  });
});
