import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { EchartsComponent } from './echarts/echarts.component';

@NgModule({
  imports: [
    CommonModule,
    NgxEchartsModule
  ],
  declarations: [EchartsComponent],
  exports: [EchartsComponent]
})
export class EchartsModule { }
