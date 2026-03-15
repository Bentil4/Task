import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LayoutComponent } from './layout.component';
import { BoardService } from '../../services';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import * as BoardActions from '../../store/board/actions/board.actions';

describe('LayoutComponent', () => {
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockBoardService: jest.Mocked<Partial<BoardService>>;
  let mockStore: { dispatch: jest.Mock };

  beforeEach(async () => {
    mockRouter = { navigate: jest.fn() } as any;
    mockActivatedRoute = {
      paramMap: of(new Map([['id', '1']])) as any,
      queryParamMap: of(new Map()) as any,
    };
    mockStore = { dispatch: jest.fn() };
    mockBoardService = {
      getBoardById: jest.fn().mockReturnValue({ id: 1, name: 'Test Board' }),
      boards: signal([{ id: 1, name: 'Test Board' }]),
    };

    await TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Store, useValue: mockStore },
        { provide: BoardService, useValue: mockBoardService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should navigate on filter change', () => {
    TestBed.runInInjectionContext(() => {
      const component = new LayoutComponent();
      component.onFilterChange('Todo');
      expect(mockRouter.navigate).toHaveBeenCalled();
    });
  });

  it('should navigate to new task page', () => {
    TestBed.runInInjectionContext(() => {
      const component = new LayoutComponent();
      component.onAddTask();
      expect(mockRouter.navigate).toHaveBeenCalled();
    });
  });

  it('should reload boards on board update', () => {
    TestBed.runInInjectionContext(() => {
      const component = new LayoutComponent();
      component.onBoardUpdated();
      expect(mockStore.dispatch).toHaveBeenCalledWith(BoardActions.loadBoards());
    });
  });

  it('should return false for unsaved changes', () => {
    TestBed.runInInjectionContext(() => {
      const component = new LayoutComponent();
      expect(component.hasUnsavedChanges()).toBe(false);
    });
  });

  it('should navigate to first board when boards exist after delete', () => {
    TestBed.runInInjectionContext(() => {
      const component = new LayoutComponent();
      component.onBoardDeleted();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/board', 1]);
    });
  });

  it('should navigate to board root when no boards exist after delete', () => {
    TestBed.runInInjectionContext(() => {
      mockBoardService.boards?.set([]);
      const component = new LayoutComponent();
      component.onBoardDeleted();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/board']);
    });
  });

  it('should use fallback board title when board is missing', () => {
    TestBed.runInInjectionContext(() => {
      mockBoardService.getBoardById = jest.fn().mockReturnValue(undefined);
      const component = new LayoutComponent();
      expect(component.boardTitle()).toBe('Platform Launch');
    });
  });
});
