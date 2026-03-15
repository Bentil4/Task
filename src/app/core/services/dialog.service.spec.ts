import { TestBed } from '@angular/core/testing';
import { DialogService } from './dialog.service';

describe('DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DialogService]
    });
    service = TestBed.inject(DialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set dialog config on confirm', () => {
    const config = {
      title: 'Test Dialog',
      message: 'Are you sure?'
    };

    service.confirm(config);

    expect(service.config()).toEqual({
      title: 'Test Dialog',
      message: 'Are you sure?',
      confirmText: 'Confirm',
      cancelText: 'Cancel'
    });
  });

  it('should use custom button texts', () => {
    const config = {
      title: 'Delete',
      message: 'Delete this item?',
      confirmText: 'Yes, Delete',
      cancelText: 'No, Keep'
    };

    service.confirm(config);

    expect(service.config()?.confirmText).toBe('Yes, Delete');
    expect(service.config()?.cancelText).toBe('No, Keep');
  });

  it('should resolve true on confirm', async () => {
    const promise = service.confirm({
      title: 'Test',
      message: 'Confirm?'
    });

    service.handleConfirm();
    const result = await promise;

    expect(result).toBe(true);
    expect(service.config()).toBeNull();
  });

  it('should resolve false on cancel', async () => {
    const promise = service.confirm({
      title: 'Test',
      message: 'Confirm?'
    });

    service.handleCancel();
    const result = await promise;

    expect(result).toBe(false);
    expect(service.config()).toBeNull();
  });

  it('should clear config after confirm', () => {
    service.confirm({ title: 'Test', message: 'Test' });
    expect(service.config()).not.toBeNull();

    service.handleConfirm();
    expect(service.config()).toBeNull();
  });

  it('should clear config after cancel', () => {
    service.confirm({ title: 'Test', message: 'Test' });
    expect(service.config()).not.toBeNull();

    service.handleCancel();
    expect(service.config()).toBeNull();
  });
});
