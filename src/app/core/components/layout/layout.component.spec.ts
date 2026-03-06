import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { BoardService } from '../../services';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LayoutComponent', () => {
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockBoardService: jest.Mocked<Partial<BoardService>>;

  beforeEach(async () => {
    mockRouter = { navigate: jest.fn() } as any;
    mockActivatedRoute = {
      paramMap: of(new Map([['id', '1']])) as any,
      queryParamMap: of(new Map()) as any
    };
    mockBoardService = {
      getBoardById: jest.fn().mockReturnValue({ id: 1, name: 'Test Board' }),
      loadBoardsData: jest.fn().mockResolvedValue(undefined),
      boards: signal([{ id: 1, name: 'Test Board' }])
    };

    await TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: BoardService, useValue: mockBoardService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
      expect(mockBoardService.loadBoardsData).toHaveBeenCalled();
    });
  });

  it('should return false for unsaved changes', () => {
    TestBed.runInInjectionContext(() => {
      const component = new LayoutComponent();
      expect(component.hasUnsavedChanges()).toBe(false);
    });
  });
});
