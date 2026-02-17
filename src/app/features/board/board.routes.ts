import { Routes } from '@angular/router';
import { Layout } from '../../core/components/layout/layout';
import { unsavedChangesGuard } from '../../core/guards';

export const BOARD_ROUTES: Routes = [
  {
    path: '',
    component: Layout,
  },
  {
    path: ':id',
    component: Layout,
    canDeactivate: [unsavedChangesGuard],
  },
];
