import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BoardService } from './board.service';
import { StorageService } from './storage.service';
import { IBoard, ITask } from '../models/board.model';
import { environment } from '../../../environments/environment';

describe('BoardService', () => {
  let service: BoardService;
  let httpMock: HttpTestingController;
  let storageService: jest.Mocked<StorageService>;

  const mockBoards: IBoard[] = [
    {
      id: 1,
      name: 'Test Board',
      columns: [
        {
          name: 'Todo',
          tasks: [
            { id: 'task-1', title: 'Task 1', description: 'Desc 1', status: 'Todo', subtasks: [] }
          ]
        }
      ]
    }
  ];

  beforeEach(() => {
    const storageServiceMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BoardService,
        { provide: StorageService, useValue: storageServiceMock }
      ]
    });

    service = TestBed.inject(BoardService);
    httpMock = TestBed.inject(HttpTestingController);
    storageService = TestBed.inject(StorageService) as jest.Mocked<StorageService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadBoardsData', () => {
    it('should load boards from cache if available', async () => {
      storageService.getItem.mockReturnValue(JSON.stringify(mockBoards));

      await service.loadBoardsData();

      expect(storageService.getItem).toHaveBeenCalled();
      expect(service.allBoardsData()).toEqual(mockBoards);
      expect(service.isLoading()).toBe(false);
    });

    it('should fetch boards from API when cache is empty', async () => {
      storageService.getItem.mockReturnValue(null);

      const promise = service.loadBoardsData();
      const req = httpMock.expectOne(environment.apiUrl);
      req.flush({ boards: mockBoards });
      await promise;

      expect(service.allBoardsData().length).toBeGreaterThan(0);
      expect(storageService.setItem).toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      storageService.getItem.mockReturnValue(null);

      const promise = service.loadBoardsData();
      const req = httpMock.expectOne(environment.apiUrl);
      req.error(new ProgressEvent('error'));
      await promise;

      expect(service.allBoardsData()).toEqual([]);
      expect(service.isLoading()).toBe(false);
    });
  });

  describe('getBoardById', () => {
    it('should return board by id', () => {
      service.boards.set([{ id: 1, name: 'Test' }]);
      const board = service.getBoardById(1);
      expect(board).toEqual({ id: 1, name: 'Test' });
    });

    it('should return undefined for non-existent board', () => {
      service.boards.set([]);
      expect(service.getBoardById(999)).toBeUndefined();
    });
  });

  describe('addTask', () => {
    beforeEach(() => {
      service.allBoardsData.set(mockBoards);
    });

    it('should add task to correct column', () => {
      const result = service.addTask(1, {
        title: 'New Task',
        status: 'Todo',
        description: 'Test',
        subtasks: []
      });

      expect(result).toBe(true);
      expect(storageService.setItem).toHaveBeenCalled();
    });

    it('should return false for invalid board', () => {
      const result = service.addTask(999, { title: 'Task', status: 'Todo' });
      expect(result).toBe(false);
    });
  });

  describe('updateTask', () => {
    beforeEach(() => {
      service.allBoardsData.set(mockBoards);
    });

    it('should update task successfully', () => {
      const result = service.updateTask(1, 'task-1', { title: 'Updated' });
      expect(result).toBe(true);
    });

    it('should return false for non-existent task', () => {
      const result = service.updateTask(1, 'invalid-id', { title: 'Updated' });
      expect(result).toBe(false);
    });
  });

  describe('deleteTask', () => {
    beforeEach(() => {
      service.allBoardsData.set(mockBoards);
    });

    it('should delete task successfully', () => {
      const result = service.deleteTask(1, 'task-1');
      expect(result).toBe(true);
    });

    it('should return false for non-existent task', () => {
      const result = service.deleteTask(1, 'invalid-id');
      expect(result).toBe(false);
    });
  });
});
