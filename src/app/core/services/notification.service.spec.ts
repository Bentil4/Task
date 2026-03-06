import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show notification', () => {
    service.show('Test message', 'info');
    expect(service.notifications$().length).toBe(1);
    expect(service.notifications$()[0].message).toBe('Test message');
    expect(service.notifications$()[0].type).toBe('info');
  });

  it('should show success notification', () => {
    service.success('Success message');
    expect(service.notifications$()[0].type).toBe('success');
  });

  it('should show error notification', () => {
    service.error('Error message');
    expect(service.notifications$()[0].type).toBe('error');
  });

  it('should auto-remove notification after duration', () => {
    service.show('Test', 'info', 3000);
    expect(service.notifications$().length).toBe(1);

    jest.advanceTimersByTime(3000);
    expect(service.notifications$().length).toBe(0);
  });

  it('should not auto-remove notification when duration is 0', () => {
    service.show('Test', 'info', 0);
    expect(service.notifications$().length).toBe(1);

    jest.advanceTimersByTime(5000);
    expect(service.notifications$().length).toBe(1);
  });

  it('should remove notification by id', () => {
    service.show('Test 1', 'info', 0);
    service.show('Test 2', 'info', 0);
    const firstId = service.notifications$()[0].id;

    service.remove(firstId);
    expect(service.notifications$().length).toBe(1);
    expect(service.notifications$()[0].message).toBe('Test 2');
  });

  it('should clear all notifications', () => {
    service.show('Test 1', 'info', 0);
    service.show('Test 2', 'info', 0);
    
    service.clear();
    expect(service.notifications$().length).toBe(0);
  });

  it('should handle multiple notifications with different durations', () => {
    service.show('Short', 'info', 1000);
    service.show('Long', 'info', 3000);
    
    expect(service.notifications$().length).toBe(2);

    jest.advanceTimersByTime(1000);
    expect(service.notifications$().length).toBe(1);
    expect(service.notifications$()[0].message).toBe('Long');

    jest.advanceTimersByTime(2000);
    expect(service.notifications$().length).toBe(0);
  });
});
