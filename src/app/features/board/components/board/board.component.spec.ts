import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BoardComponent } from './board.component';
import { BoardService } from '../../../../core/services';
import { signal } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import * as BoardActions from '../../../../core/store/board/actions/board.actions';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let mockRouter: jest.Mocked<Router>;
  let mockBoardService: jest.Mocked<Partial<BoardService>>;
  let mockStore: { dispatch: jest.Mock };

  const mockBoardData = {
    id: 1,
    name: 'Test Board',
    columns: [
      {
        name: 'Todo',
        tasks: [
          { id: 'task-1', title: 'Task 1', description: 'Desc', status: 'Todo', subtasks: [] },
          { id: 'task-2', title: 'Task 2', description: 'Desc', status: 'Todo', subtasks: [{ title: 'Sub', isCompleted: false }] }
        ]
      },
      {
        name: 'Done',
        tasks: []
      }
    ]
  };

  beforeEach(async () => {
    mockRouter = { navigate: jest.fn() } as any;
    mockStore = { dispatch: jest.fn() };
    mockBoardService = {
      getBoardDataByIndex: jest.fn().mockReturnValue(mockBoardData),
      allBoardsData: signal([mockBoardData])
    };

    await TestBed.configureTestingModule({
      imports: [BoardComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: BoardService, useValue: mockBoardService },
        { provide: Store, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load board data on init', () => {
    component.ngOnInit();
    expect(mockStore.dispatch).toHaveBeenCalledWith(BoardActions.loadBoards());
  });

  it('should filter tasks by status', () => {
    const tasks = [
      { id: '1', title: 'Task 1', status: 'Todo', description: '', subtasks: [] },
      { id: '2', title: 'Task 2', status: 'Done', description: '', subtasks: [] }
    ];

    const filtered = component.filterAndSortTasks(tasks, 'Todo', null);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].status).toBe('Todo');
  });

  it('should sort tasks by title', () => {
    const tasks = [
      { id: '1', title: 'Zebra', status: 'Todo', description: '', subtasks: [] },
      { id: '2', title: 'Apple', status: 'Todo', description: '', subtasks: [] }
    ];

    const sorted = component.filterAndSortTasks(tasks, null, 'title');
    expect(sorted[0].title).toBe('Apple');
    expect(sorted[1].title).toBe('Zebra');
  });

  it('should sort tasks by subtasks count', () => {
    const tasks = [
      { id: '1', title: 'Task 1', status: 'Todo', description: '', subtasks: [{ title: 'Sub1', isCompleted: false }, { title: 'Sub2', isCompleted: false }] },
      { id: '2', title: 'Task 2', status: 'Todo', description: '', subtasks: [] }
    ];

    const sorted = component.filterAndSortTasks(tasks, null, 'subtasks');
    expect(sorted[0].subtasks).toHaveLength(0);
    expect(sorted[1].subtasks).toHaveLength(2);
  });

  it('should navigate to task on click', () => {
    component.onTaskClick('task-1');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/board', 1, 'edit', 'task-1']);
  });

  it('should handle column creation', () => {
    component.onCreateColumn();
    expect(component.isCreatingColumn()).toBe(true);

    component.onColumnCreated({ name: 'New Column', tasks: [] });
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      BoardActions.addColumn({ boardId: 1, columnName: 'New Column' })
    );
    expect(component.isCreatingColumn()).toBe(false);
  });

  it('should cancel column creation', () => {
    component.isCreatingColumn.set(true);
    component.onColumnFormCanceled();
    expect(component.isCreatingColumn()).toBe(false);
  });

  it('should handle drag and drop within same column', () => {
    component.loadBoardData(1, null, null);
    const event = {
      previousContainer: { data: component.columns[0].tasks },
      container: { data: component.columns[0].tasks },
      previousIndex: 0,
      currentIndex: 1
    } as CdkDragDrop<any[]>;

    component.drop(event);
    expect(component.columns[0].tasks).toBeDefined();
  });
});
