import { Routes } from '@angular/router';
import { Login } from './features/auth';
import { Settings } from './features/settings/settings';
import { PageNotFound } from './core/components/page-not-found/page-not-found';
import { authGuard, guestGuard } from './features/auth';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'board',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
    title: 'Login',
    canActivate: [guestGuard],
  },
  {
    path: 'board',
    loadChildren: () => import('./features/board/board.routes').then((m) => m.BOARD_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    component: Settings,
    title: 'Settings',
    canActivate: [authGuard],
  },
  {
    path: '**',
    component: PageNotFound,
  },
];
