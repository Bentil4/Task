import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { DialogService } from '../services/dialog.service';
import { IHasUnsavedChanges } from '../models';

export const unsavedChangesGuard: CanDeactivateFn<IHasUnsavedChanges> = (component) => {
  if (component.hasUnsavedChanges()) {
    const dialogService = inject(DialogService);
    return dialogService.confirm({
      title: 'Unsaved Changes',
      message: 'You have unsaved changes. Are you sure you want to leave?',
      confirmText: 'Leave',
      cancelText: 'Stay',
    });
  }
  return true;
};
