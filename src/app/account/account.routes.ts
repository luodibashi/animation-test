import { Route } from '@angular/router'

import { LoginComponent } from './login/login.component';

export const AccountRoutes: Route[] = [{
  path: '',
  children:[
    {
      path: 'login',
      component: LoginComponent
    }
  ]
}]
