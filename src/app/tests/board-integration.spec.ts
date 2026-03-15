import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { BoardComponent } from '../features/board/components/board/board.component';
import { BoardService } from '../core/services/board.service';
import { StorageService } from '../core/services/storage.service';

/**
 * Integration Test Suite
 * Tests the interaction between BoardComponent and BoardService
 * Validates that component updates reflect changes in the service
 */
describe('BoardComponent Integration Tests', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let boardService: BoardService;

  const mockBoardData = {
    id: 1,
    name: 'Integration Test Board',
    columns: [
      {
        name: 'Todo',
        tasks: [
          {
            id: 'task-1',
            title: 'Integration Task 1',
            description: 'Test Description',
            status: 'Todo',
            subtasks: [
              { title: 'Subtask 1', isCompleted: false },
              { title: 'Subtask 2', isCompleted: true }
            ]
          }
        ]
      },
      {
        name: 'Done',
        tasks: []
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardComponent, HttpClientTestingModule],
      providers: [BoardService, StorageService, provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    boardService = TestBed.inject(BoardService);

    boardService.allBoardsData.set([mockBoardData]);
    jest.spyOn(boardService, 'getBoardDataByIndex').mockReturnValue(mockBoardData);
    
    fixture.detectChanges();
  });

  it('should load board data from service on initialization', () => {
    component.loadBoardData(1, null, null);
    
    expect(component.columns).toHaveLength(2);
    expect(component.columns[0].name).toBe('Todo');
    expect(component.columns[0].tasks).toHaveLength(1);
  });

  it('should update component when service data changes', () => {
    component.loadBoardData(1, null, null);
    expect(component.columns[0].tasks).toHaveLength(1);

    const updatedData = {
      ...mockBoardData,
      columns: [
        {
          name: 'Todo',
          tasks: [
            ...mockBoardData.columns[0].tasks,
            { id: 'task-2', title: 'New Task', description: 'New', status: 'Todo', subtasks: [] }
          ]
        },
        mockBoardData.columns[1]
      ]
    };

    jest.spyOn(boardService, 'getBoardDataByIndex').mockReturnValue(updatedData);
    component.loadBoardData(1, null, null);

    expect(component.columns[0].tasks).toHaveLength(2);
    expect(component.columns[0].tasks[1].title).toBe('New Task');
  });

  it('should call service method when adding column', () => {
    const addColumnSpy = jest.spyOn(boardService, 'addColumn').mockReturnValue(true);
    
    component.onColumnCreated({ name: 'In Progress', tasks: [] });

    expect(addColumnSpy).toHaveBeenCalledWith(1, 'In Progress');
  });

  it('should maintain data consistency between component and service', () => {
    component.loadBoardData(1, null, null);
    
    const componentTask = component.columns[0].tasks[0];
    const serviceTask = boardService.getTaskById(1, 'task-1');

    expect(componentTask.id).toBe(serviceTask?.id);
    expect(componentTask.title).toBe(serviceTask?.title);
  });

  it('should reflect filtered data correctly', () => {
    component.loadBoardData(1, 'Todo', null);
    
    const allTasks = component.columns.flatMap(col => col.tasks);
    const nonTodoTasks = allTasks.filter(task => task.status !== 'Todo');
    
    expect(nonTodoTasks).toHaveLength(0);
  });

  it('should handle missing board data gracefully', () => {
    jest.spyOn(boardService, 'getBoardDataByIndex').mockReturnValue(undefined);
    
    expect(() => component.loadBoardData(999, null, null)).not.toThrow();
  });
});
