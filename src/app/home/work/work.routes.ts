import { Route } from '@angular/router'
// 路由守卫
// import { MyGuard } from './myguard'

import { ListComponent } from './list/list.component';
import { CorrectComponent } from './correct/correct.component';
import { Correct2Component } from './correct2/correct2.component';
import { WaitcorrectionComponent } from './waitcorrection/waitcorrection.component';


export const WorkRoutes: Route[] = [{
	path: 'work',
	children:[
		{
			path: 'list',
			component: ListComponent
		},
		{
			path: 'correct/question/:workId/:studentId',
			component: CorrectComponent
		},
		{
			path: 'correct/student/:workId',
			component: Correct2Component
		},
		{
			path: 'correct/waiting',
			component: WaitcorrectionComponent
		}
	]
}]
