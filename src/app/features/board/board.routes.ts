import { Routes } from '@angular/router';
import { LayoutComponent } from '../../core/components/layout/layout.component';
import { unsavedChangesGuard, taskExistsGuard } from '../../core/guards';
import { authGuard } from '../auth';
import { NewTaskPageComponent } from './pages/new-task-page/new-task-page.component';
import { EditTaskPageComponent } from './pages/edit-task-page/edit-task-page.component';

export const BOARD_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
  },
  {
    path: ':id',
    component: LayoutComponent,
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: ':id/new-task',
    component: NewTaskPageComponent,
    title: 'Add New Task',
    canActivate: [authGuard],
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: ':id/edit/:taskId',
    component: EditTaskPageComponent,
    title: 'Edit Task',
    canActivate: [authGuard, taskExistsGuard],
    canDeactivate: [unsavedChangesGuard],
  },
];