import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './core/auth/login/login.component';

import { AuthGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'members',
    loadComponent: () =>
      import('./components/member/member.component').then(
        (m) => m.MemberComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-member',
    loadComponent: () =>
      import('./components/member/add-member/add-member.component').then(
        (m) => m.AddMemberComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-member/:id',
    loadComponent: () =>
      import('./components/member/edit-member/edit-member.component').then(
        (m) => m.EditMemberComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'member-details/:id',
    loadComponent: () =>
      import(
        './components/member/member-details/member-details.component'
      ).then((m) => m.MemberDetailsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'member-id',
    loadComponent: () =>
      import('./components/memberId/member-id.component').then(
        (m) => m.MemberIdComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-member-id',
    loadComponent: () =>
      import(
        './components/memberId/add-member-id/add-member-id.component'
      ).then((m) => m.AddMemberIdComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-member-id/:id',
    loadComponent: () =>
      import(
        './components/memberId/edit-member-id/edit-member-id.component'
      ).then((m) => m.EditMemberIdComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'member-id-details/:id',
    loadComponent: () =>
      import(
        './components/memberId/member-id-details/member-id-details.component'
      ).then((m) => m.MemberIdDetailsComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'ministries',
    loadComponent: () =>
      import('./components/ministry/ministry.component').then(
        (m) => m.MinistryComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'providers',
    loadComponent: () =>
      import('./components/provider/provider.component').then(
        (m) => m.ProviderComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-provider',
    loadComponent: () =>
      import('./components/provider/add-provider/add-provider.component').then(
        (m) => m.AddProviderComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-provider/:id',
    loadComponent: () =>
      import(
        './components/provider/edit-provider/edit-provider.component'
      ).then((m) => m.EditProviderComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'provider-details/:id',
    loadComponent: () =>
      import(
        './components/provider/provider-details/provider-details.component'
      ).then((m) => m.ProviderDetailsComponent),
    canActivate: [AuthGuard],
  },
];
