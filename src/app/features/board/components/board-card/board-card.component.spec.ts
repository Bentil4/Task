import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardCardComponent } from './board-card.component';
import { ComponentRef } from '@angular/core';

describe('BoardCardComponent', () => {
  let component: BoardCardComponent;
  let fixture: ComponentFixture<BoardCardComponent>;
  let componentRef: ComponentRef<BoardCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate completed subtasks count', () => {
    componentRef.setInput('card', {
      id: 'task-1',
      title: 'Test Task',
      description: 'Test',
      status: 'Todo',
      subtasks: [
        { title: 'Subtask 1', isCompleted: true },
        { title: 'Subtask 2', isCompleted: false },
        { title: 'Subtask 3', isCompleted: true }
      ]
    });
    fixture.detectChanges();

    expect(component.completedSubtasksCount()).toBe(2);
  });

  it('should calculate total subtasks count', () => {
    componentRef.setInput('card', {
      id: 'task-1',
      title: 'Test Task',
      description: 'Test',
      status: 'Todo',
      subtasks: [
        { title: 'Subtask 1', isCompleted: true },
        { title: 'Subtask 2', isCompleted: false }
      ]
    });
    fixture.detectChanges();

    expect(component.totalSubtasksCount()).toBe(2);
  });

  it('should return 0 for completed subtasks when card is null', () => {
    componentRef.setInput('card', null);
    fixture.detectChanges();

    expect(component.completedSubtasksCount()).toBe(0);
  });

  it('should return 0 for total subtasks when card is null', () => {
    componentRef.setInput('card', null);
    fixture.detectChanges();

    expect(component.totalSubtasksCount()).toBe(0);
  });

  it('should emit cardClick event with task id', () => {
    const emitSpy = jest.spyOn(component.cardClick, 'emit');
    componentRef.setInput('card', {
      id: 'task-123',
      title: 'Test Task',
      description: 'Test',
      status: 'Todo',
      subtasks: []
    });
    fixture.detectChanges();

    component.onCardClick();

    expect(emitSpy).toHaveBeenCalledWith('task-123');
  });

  it('should not emit cardClick when card is null', () => {
    const emitSpy = jest.spyOn(component.cardClick, 'emit');
    componentRef.setInput('card', null);
    fixture.detectChanges();

    component.onCardClick();

    expect(emitSpy).not.toHaveBeenCalled();
  });
});
