import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ListComponent } from './list/list.component';
import { CorrectComponent } from './correct/correct.component';
import { Correct2Component } from './correct2/correct2.component';
//pipe
import { PipeModule } from '../../pipe/pipe.module';
import { WaitcorrectionComponent } from './waitcorrection/waitcorrection.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    PipeModule
  ],
  declarations: [
	  ListComponent, 
	  CorrectComponent, 
	  Correct2Component,
    WaitcorrectionComponent
  ]
})
export class WorkModule { }
