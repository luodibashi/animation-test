import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-echarts',
  templateUrl: './echarts.component.html',
  styleUrls: ['./echarts.component.less']
})
export class EchartsComponent implements OnInit {
  @Input() workId:number
  showloading:boolean = true;
  Baroptions = {
    title : {
        text: '某地区蒸发量和降水量',
        subtext: '纯属虚构'
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['蒸发量','降水量']
    },
    xAxis: {
        type: 'category',
        data: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [12, 1, 0, 5, 2, 2, 5],
        type: 'bar'
    }]
  }

  constructor() {
    setTimeout(()=> {
      this.showloading = false;
    }, 3000); 
  }

  ngOnInit() {
  	console.log(this.workId);
      // Or you can:
      // this.es.registerMap('HK', HK_GEO_JSON);
  }

  


}
