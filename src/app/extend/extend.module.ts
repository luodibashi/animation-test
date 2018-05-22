import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
// 路由控制模块
import { RouterModule } from '@angular/router';
// 路由守卫
import { ExtendGuard } from './extend.guard'

// service
// import { ExtendService } from './extend.service'

// routes
import { ExtendRoutes } from './extend.routes';

// component
import { TestComponent } from './test/test.component';
import { LiveComponent } from './live/live.component';
import { AnimationComponent } from './animation/animation.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    RouterModule.forChild(ExtendRoutes)
  ],
  declarations: [
  	LiveComponent,
  	AnimationComponent,
  	TestComponent
  ],
  providers: [
  	ExtendGuard,
  	// ExtendService
  ]
})
export class ExtendModule { }
