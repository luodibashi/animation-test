import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'

// service
// import { AccountService } from './account.service'

import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule
  ],
  declarations: [
    LoginComponent
  ],
  providers: [
    // AccountService
  ]
})
export class AccountModule { }
