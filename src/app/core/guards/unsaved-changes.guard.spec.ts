import { TestBed } from '@angular/core/testing';
import { unsavedChangesGuard } from './unsaved-changes.guard';
import { DialogService } from '../services/dialog.service';
import { IHasUnsavedChanges } from '../models';

describe('unsavedChangesGuard', () => {
  let dialogService: jest.Mocked<DialogService>;
  let mockComponent: IHasUnsavedChanges;

  beforeEach(() => {
    const dialogServiceMock = {
      confirm: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: DialogService, useValue: dialogServiceMock }
      ]
    });

    dialogService = TestBed.inject(DialogService) as jest.Mocked<DialogService>;
    mockComponent = {
      hasUnsavedChanges: jest.fn()
    };
  });

  it('should allow navigation when no unsaved changes', () => {
    mockComponent.hasUnsavedChanges = jest.fn().mockReturnValue(false);

    TestBed.runInInjectionContext(() => {
      const result = unsavedChangesGuard(mockComponent, {} as any, {} as any, {} as any);
      expect(result).toBe(true);
      expect(dialogService.confirm).not.toHaveBeenCalled();
    });
  });

  it('should show confirmation dialog when there are unsaved changes', () => {
    mockComponent.hasUnsavedChanges = jest.fn().mockReturnValue(true);
    dialogService.confirm.mockReturnValue(Promise.resolve(true));

    TestBed.runInInjectionContext(() => {
      const result = unsavedChangesGuard(mockComponent, {} as any, {} as any, {} as any);
      
      expect(dialogService.confirm).toHaveBeenCalledWith({
        title: 'Unsaved Changes',
        message: 'You have unsaved changes. Are you sure you want to leave?',
        confirmText: 'Leave',
        cancelText: 'Stay'
      });
      expect(result).toBeInstanceOf(Promise);
    });
  });

  it('should allow navigation when user confirms', async () => {
    mockComponent.hasUnsavedChanges = jest.fn().mockReturnValue(true);
    dialogService.confirm.mockResolvedValue(true);

    await TestBed.runInInjectionContext(async () => {
      const result = await unsavedChangesGuard(mockComponent, {} as any, {} as any, {} as any);
      expect(result).toBe(true);
    });
  });

  it('should prevent navigation when user cancels', async () => {
    mockComponent.hasUnsavedChanges = jest.fn().mockReturnValue(true);
    dialogService.confirm.mockResolvedValue(false);

    await TestBed.runInInjectionContext(async () => {
      const result = await unsavedChangesGuard(mockComponent, {} as any, {} as any, {} as any);
      expect(result).toBe(false);
    });
  });
});
