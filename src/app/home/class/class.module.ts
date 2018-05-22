import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

//pipe
import { PipeModule } from '../../pipe/pipe.module'
// EchartsModule
// import { EchartsModule } from '../../plug/echarts/echarts.module'
import { ChartjsModule } from '../../plug/chartjs/chartjs.module'

import { ClassComponent } from './class/class.component';
import { CreateComponent } from './create/create.component';
import { StudentComponent } from './student/student.component';
import { TutorComponent } from './tutor/tutor.component';
import { WorkComponent } from './work/work.component';
import { TeacherComponent } from './teacher/teacher.component';
import { QuestionbankComponent } from './questionbank/questionbank.component';
import { HeaderComponent } from './header/header.component';
import { InfoComponent } from './info/info.component';
import { ReportComponent } from './report/report.component';
import { StudentreportComponent } from './studentreport/studentreport.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    PipeModule,
    // EchartsModule,
    ChartjsModule
  ],
  declarations: [
  	ClassComponent,
  	CreateComponent,
  	StudentComponent,
  	TutorComponent,
  	WorkComponent,
  	TeacherComponent,
  	QuestionbankComponent,
  	HeaderComponent,
  	InfoComponent,
  	ReportComponent,
  	StudentreportComponent
  ]
})
export class ClassModule { }
