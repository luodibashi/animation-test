import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
// 路由控制模块
import { RouterModule } from '@angular/router';
// 路由守卫
import { MyGuard } from './myguard';
import { Auth } from './auth';

// service
// import { HomeService } from './home.service';
// import { WechatService } from './wechat/wechat.service';
// import { TeachertagService } from './teachertag/teachertag.service';
// import { ArrangeService } from './arrange/arrange.service';
// import { ClassService } from './class/class.service';
// import { WorkService } from './work/work.service';

// routes
import { HomeRoutes } from './home.routes';

// module
// import { ClassModule }  from './class/class.module';
// import { WorkModule }  from './work/work.module';

// component
import { HomeComponent } from './home/home.component';
// import { PersonalComponent } from './personal/personal.component';
// import { WechatComponent } from './wechat/wechat.component';
// import { TeachertagComponent } from './teachertag/teachertag.component';
// import { ArrangeComponent } from './arrange/arrange.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    // ClassModule,
    // WorkModule,
    RouterModule.forChild(HomeRoutes)
  ],
  declarations: [
  	// PersonalComponent,
  	// WechatComponent,
  	// TeachertagComponent,
  	// ArrangeComponent,
  	HomeComponent
  ],
  providers: [
  	MyGuard,
    Auth,
    // HomeService,
    // WechatService,
    // TeachertagService,
    // ArrangeService,
    // ClassService,
    // WorkService
  ]
})
export class HomeModule { }
