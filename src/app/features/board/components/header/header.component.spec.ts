import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { BoardService, NotificationService } from '../../../../core/services';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockBoardService: jest.Mocked<Partial<BoardService>>;
  let mockNotificationService: jest.Mocked<Partial<NotificationService>>;

  beforeEach(async () => {
    mockBoardService = {
      updateBoard: jest.fn(),
      deleteBoard: jest.fn()
    };

    mockNotificationService = {
      success: jest.fn(),
      error: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: BoardService, useValue: mockBoardService },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filterChange on filter change', () => {
    const emitSpy = jest.spyOn(component.filterChange, 'emit');
    const event = { target: { value: 'Todo' } } as any;
    component.onFilterChange(event);
    expect(emitSpy).toHaveBeenCalledWith('Todo');
  });

  it('should emit addTask on add task', () => {
    const emitSpy = jest.spyOn(component.addTask, 'emit');
    component.onAddTask();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should toggle menu', () => {
    expect(component.isMenuOpen()).toBe(false);
    component.toggleMenu();
    expect(component.isMenuOpen()).toBe(true);
    component.toggleMenu();
    expect(component.isMenuOpen()).toBe(false);
  });

  it('should close menu', () => {
    component.isMenuOpen.set(true);
    component.closeMenu();
    expect(component.isMenuOpen()).toBe(false);
  });

  it('should open edit board', () => {
    fixture.componentRef.setInput('title', 'Test Board');
    component.openEditBoard();
    expect(component.isEditingBoard()).toBe(true);
    expect(component.editBoardName()).toBe('Test Board');
    expect(component.isMenuOpen()).toBe(false);
  });

  it('should cancel edit board', () => {
    component.isEditingBoard.set(true);
    component.editBoardName.set('Test');
    component.cancelEditBoard();
    expect(component.isEditingBoard()).toBe(false);
    expect(component.editBoardName()).toBe('');
  });

  it('should save edit board successfully', () => {
    mockBoardService.updateBoard = jest.fn().mockReturnValue(true);
    const emitSpy = jest.spyOn(component.boardUpdated, 'emit');
    fixture.componentRef.setInput('boardId', 1);
    component.editBoardName.set('New Name');
    
    component.saveEditBoard();
    
    expect(mockBoardService.updateBoard).toHaveBeenCalledWith(1, 'New Name');
    expect(mockNotificationService.success).toHaveBeenCalledWith('Board updated successfully');
    expect(component.isEditingBoard()).toBe(false);
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should show error when board name is empty', () => {
    component.editBoardName.set('   ');
    component.saveEditBoard();
    expect(mockNotificationService.error).toHaveBeenCalledWith('Board name cannot be empty');
  });

  it('should show error when update fails', () => {
    mockBoardService.updateBoard = jest.fn().mockReturnValue(false);
    component.editBoardName.set('New Name');
    component.saveEditBoard();
    expect(mockNotificationService.error).toHaveBeenCalledWith('Failed to update board');
  });

  it('should delete board successfully', () => {
    global.confirm = jest.fn().mockReturnValue(true);
    mockBoardService.deleteBoard = jest.fn().mockReturnValue(true);
    const emitSpy = jest.spyOn(component.boardDeleted, 'emit');
    fixture.componentRef.setInput('boardId', 1);
    
    component.deleteBoard();
    
    expect(mockBoardService.deleteBoard).toHaveBeenCalledWith(1);
    expect(mockNotificationService.success).toHaveBeenCalledWith('Board deleted successfully');
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not delete board when user cancels', () => {
    global.confirm = jest.fn().mockReturnValue(false);
    component.deleteBoard();
    expect(mockBoardService.deleteBoard).not.toHaveBeenCalled();
  });

  it('should show error when delete fails', () => {
    global.confirm = jest.fn().mockReturnValue(true);
    mockBoardService.deleteBoard = jest.fn().mockReturnValue(false);
    component.deleteBoard();
    expect(mockNotificationService.error).toHaveBeenCalledWith('Failed to delete board');
  });
});
