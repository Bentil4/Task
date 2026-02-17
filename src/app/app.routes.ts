import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/components/login/login.component';
import { SettingsComponent } from './features/settings/settings.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { authGuard, guestGuard } from './features/auth';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'board',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
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
    component: SettingsComponent,
    title: 'Settings',
    canActivate: [authGuard],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
