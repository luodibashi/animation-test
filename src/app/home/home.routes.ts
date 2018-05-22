import { Route } from '@angular/router'
// 路由守卫
import { MyGuard } from './myguard'

import { HomeComponent } from './home/home.component';
// import { PersonalComponent } from './personal/personal.component';
// import { WechatComponent } from './wechat/wechat.component';
// import { TeachertagComponent } from './teachertag/teachertag.component';
// import { ArrangeComponent } from './arrange/arrange.component';

// import { ClassRoutes } from './class/class.routes';
// import { WorkRoutes } from './work/work.routes';


export const HomeRoutes: Route[] = [{
	path: 'my',
	canActivateChild: [ MyGuard ],
	children:[
		{
			path: 'home',
			component: HomeComponent
		},
		// {
		// 	path: 'personal',
		// 	component: PersonalComponent
		// },
		// {
		// 	path: 'wx',
		// 	component: WechatComponent
		// },
		// {
		// 	path: 'tag',
		// 	component: TeachertagComponent
		// },
		// {
		// 	path: 'arrange',
		// 	component: ArrangeComponent
		// },
		// ...ClassRoutes,
		// ...WorkRoutes
	]
}]
