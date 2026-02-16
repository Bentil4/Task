import { Routes } from '@angular/router';
import { Layout } from '../../core/components/layout/layout';
import { unsavedChangesGuard, taskExistsGuard } from '../../core/guards';
import { authGuard } from '../auth';
import { NewTaskPage } from './pages/new-task-page/new-task-page';
import { EditTaskPage } from './pages/edit-task-page/edit-task-page';

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
  {
    path: ':id/new-task',
    component: NewTaskPage,
    title: 'Add New Task',
    canActivate: [authGuard],
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: ':id/edit/:taskId',
    component: EditTaskPage,
    title: 'Edit Task',
    canActivate: [authGuard, taskExistsGuard],
    canDeactivate: [unsavedChangesGuard],
  },
];