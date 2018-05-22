import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'angular2-chartjs';
import { ChartjsComponent } from './chartjs/chartjs.component';
import { LineComponent } from './line/line.component';

@NgModule({
  imports: [
    CommonModule,
    ChartModule
  ],
  declarations: [ChartjsComponent, LineComponent],
  exports: [ChartjsComponent, LineComponent]
})
export class ChartjsModule { }
