import { Routes } from '@angular/router';
import { layout } from './pages/layout/layout';
import { Login } from './pages/login/login';
import { Settings } from './pages/settings/settings';
import { PageNotFound } from './pages/page-not-found/page-not-found';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: layout,
    title: 'Home',
    canActivate: [authGuard],
  },
  {
    path: 'board/:id',
    component: layout,
    title: 'Board',
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    component: Settings,
    title: 'Settings',
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: Login,
    title: 'Login',
  },
  {
    path: '**',
    component: PageNotFound,
  },
];
