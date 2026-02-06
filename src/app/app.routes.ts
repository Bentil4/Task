import { Routes } from '@angular/router';
import { layout } from './pages/layout/layout';
import { Login } from './pages/login/login';
import { Settings } from './pages/settings/settings';
import { PageNotFound } from './pages/page-not-found/page-not-found';

export const routes: Routes = [
  {
    path: '',
    component: layout,
    title: 'Home',
  },
  {
    path: 'settings',
    component: Settings,
    title: 'Settings',
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
