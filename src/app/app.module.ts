import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Http,
  HttpModule,
  RequestOptions,
  ResponseOptions,
  XHRBackend
} from '@angular/http';


import { AppComponent } from './app.component';

// routes
import { ROUTING } from './app.routes';

// 引入动画
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
// service
// import { HttpProvideService } from './http.provide.service';

//module
import { HomeModule } from './home/home.module';
import { AccountModule } from './account/account.module';
import { ExtendModule } from './extend/extend.module';

// export function HttpInterceptor(backend: XHRBackend, defaultOptions: RequestOptions) {
//   return new HttpProvideService(backend, defaultOptions);
// }

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ROUTING,
    HttpModule,
    FormsModule,
    HomeModule,
    AccountModule,
    ExtendModule,
    BrowserAnimationsModule
  ],
  providers: [
  	// {
   //    provide: Http,
   //    useFactory: HttpInterceptor,
   //    deps: [XHRBackend, RequestOptions]
   //  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
