import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DurationTime } from './durationTime';
import { SafeHtmlPipe } from './safeHtml';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
	  DurationTime,
	  SafeHtmlPipe
  ],
  exports: [
	  DurationTime,
	  SafeHtmlPipe
  ]
})
export class PipeModule { }
