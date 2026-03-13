import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BoardService } from './board.service';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';
import { IBoard, ITask } from '../models/board.model';

describe('BoardService', () => {
  let service: BoardService;
  let httpMock: HttpTestingController;
  let storageService: StorageService;

  const mockBoardData = {
    boards: [
      {
        id: 1,
        name: 'Test Board',
        columns: [
          {
            name: 'Todo',
            tasks: [{ id: 'task-1', title: 'Test Task', description: '', status: 'Todo', subtasks: [] }]
          }
        ]
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BoardService, StorageService]
    });
    service = TestBed.inject(BoardService);
    httpMock = TestBed.inject(HttpTestingController);
    storageService = TestBed.inject(StorageService);
    spyOn(storageService, 'getItem').and.returnValue(null);
    spyOn(storageService, 'setItem');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load boards from API', async () => {
    const promise = service.loadBoardsData();
    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockBoardData);
    await promise;
    expect(service.allBoardsData().length).toBe(1);
  });

  it('should add task to board', () => {
    service.allBoardsData.set([mockBoardData.boards[0]]);
    const result = service.addTask(1, { title: 'New Task', status: 'Todo' });
    expect(result).toBe(true);
    expect(service.allBoardsData()[0].columns[0].tasks.length).toBe(2);
  });

  it('should update task', () => {
    service.allBoardsData.set([mockBoardData.boards[0]]);
    const result = service.updateTask(1, 'task-1', { title: 'Updated Task' });
    expect(result).toBe(true);
    expect(service.allBoardsData()[0].columns[0].tasks[0].title).toBe('Updated Task');
  });

  it('should delete task', () => {
    service.allBoardsData.set([mockBoardData.boards[0]]);
    const result = service.deleteTask(1, 'task-1');
    expect(result).toBe(true);
    expect(service.allBoardsData()[0].columns[0].tasks.length).toBe(0);
  });

  it('should add board', () => {
    service.allBoardsData.set([]);
    service.addBoard('New Board');
    expect(service.allBoardsData().length).toBe(1);
    expect(service.allBoardsData()[0].name).toBe('New Board');
  });

  it('should delete board', () => {
    service.allBoardsData.set([mockBoardData.boards[0]]);
    const result = service.deleteBoard(1);
    expect(result).toBe(true);
    expect(service.allBoardsData().length).toBe(0);
  });
});
