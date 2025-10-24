import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './guards';
import { LoginComponent, DashboardComponent, UsersComponent, RolesComponent } from './components';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredPage: 'dashboard' }
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredPage: 'users' }
  },
  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [authGuard, roleGuard],
    data: { requiredPage: 'roles' }
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
