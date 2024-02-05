import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AfterLoginComponent } from './after-login/after-login.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  {
    path: '',
    component: AfterLoginComponent,
    children: [{ path: 'customer', loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule) },
  ]

  },
  { path: 'change-password', loadChildren: () => import('./change-password/change-password.module').then(m => m.ChangePasswordModule) },
  { path: 'myprofile', loadChildren: () => import('./myprofile/myprofile.module').then(m => m.MyprofileModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
