import { Route } from '@angular/router'
// 路由守卫
// import { MyGuard } from './myguard'

import { ClassComponent } from './class/class.component';
import { CreateComponent } from './create/create.component';
import { StudentComponent } from './student/student.component';
import { TutorComponent } from './tutor/tutor.component';
import { WorkComponent } from './work/work.component';
import { TeacherComponent } from './teacher/teacher.component';
import { QuestionbankComponent } from './questionbank/questionbank.component';
import { InfoComponent } from './info/info.component';
import { ReportComponent } from './report/report.component';
import { StudentreportComponent } from './studentreport/studentreport.component';


export const ClassRoutes: Route[] = [{
	path: 'class',
	children:[
		{
			path: 'list',
			component: ClassComponent
		},
		{
			path: 'create/:cid',
			component: CreateComponent
		},
		{
			path: 'student/:cid',
			component: StudentComponent
		},
		{
			path: 'tutor/:cid',
			component: TutorComponent
		},
		{
			path: 'work/:cid',
			component: WorkComponent
		},
		{
			path: 'teacher/:cid',
			component: TeacherComponent
		},
		{
			path: 'questionbank/:cid',
			component: QuestionbankComponent
		},
		{
			path: 'info/:cid',
			component: InfoComponent
		},
		{
			path: 'report/:cid/:workId',
			component: ReportComponent
		},
		{
			path: 'student/report/:cid/:studentId',
			component: StudentreportComponent
		}
	]
}]
