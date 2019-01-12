import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { AuthGuard } from './auth/auth-guard.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NgxLoginComponent } from './pages/login/login.component';

const routes: Routes = [
  // { path: '', loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule' },
  {
    path: '', 
    canActivate: [AuthGuard], // here we tell Angular to check the access with our AuthGuard
    loadChildren: 'app/pages/pages.module#PagesModule',
  },
  { path: 'auth', loadChildren: './auth/auth.module#NgxAuthModule' },
  // {
  //   path: 'auth',
  //   component: NbAuthComponent,
  //   children: [
  //     {
  //       path: '',
  //       component: NbLoginComponent,
  //     },
  //     {
  //       path: 'login',
  //       component: NbLoginComponent,
  //     },
  //     {
  //       path: 'register',
  //       component: NbRegisterComponent,
  //     },
  //     {
  //       path: 'logout',
  //       component: NbLogoutComponent,
  //     },
  //     {
  //       path: 'request-password',
  //       component: NbRequestPasswordComponent,
  //     },
  //     {
  //       path: 'reset-password',
  //       component: NbResetPasswordComponent,
  //     },
  //   ],
  // },
  // { path: '', redirectTo: 'pages', pathMatch: 'full' },
  // { path: '', loadChildren: 'app/pages/pages.module#PagesModule'},
  { path: '**', redirectTo: 'pages' },
];

// const routes: Routes = [
//   {
//     path: 'dashboard',
//     // component: DashboardComponent,
//     loadChildren: 'app/pages/pages.module#PagesModule',
//     canActivate: [AuthGuard],
//   },
//   { path: 'login', loadChildren: './auth/auth.module#NgxAuthModule' },
//   // {
//   //   path: 'auth',
//   //   component: NbAuthComponent,
//   //   children: [
//   //     {
//   //       path: 'login',
//   //       component: NgxLoginComponent,
//   //     },
//   //   ],
//   // },
//   { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
// ];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
