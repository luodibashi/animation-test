import { Component, OnInit, Input } from '@angular/core';
// import { ClassService } from '../../../home/class/class.service';
// import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-chartjs',
  templateUrl: './chartjs.component.html',
  styleUrls: ['./chartjs.component.less']
})
export class ChartjsComponent implements OnInit {
	@Input() questionData={}
	option=['A','B','C','D','E','F','G','H','I','J']
	type = 'bar';
	data ={}
	// data = {
	//   labels: ["A", "B", "C", "D", "E", "F", "G"],
	//   datasets: [
	//     {
	//       label: "选择人数",
	//       data: [65, 59, 80, 81, 56, 55, 40,0],
	//       backgroundColor: "#4CAF50"
	//     }
	//   ]
	// };
	options = {
	  responsive: true,
	  maintainAspectRatio: false
	};
  constructor(
  ) { }

  ngOnInit() {
  	// 'key':        如果客观题型：意思为选项序号（如：0(A)、1(B)、2(C)、3(D)）;如果主观题型：意思为分数（如该题分数为5分则默认给出0,5两个key值，如果有其他分值那么就再加其他分值和对应的value即可；）
    // - 'value':      表示为key值对应的人数；
    let labels =[];
    let datasets =[
    	{
    		label:"作答人数",
    		backgroundColor: "#4CAF50",
    		data:[]
    	}
    ];
    // let data = [];
  	// console.log(this.questionData);
  	if(this.questionData['qType']===1){
  		// 客观题
  		let keyList = this.questionData['keyList'];
  		for(let i=0;i<keyList.length;i++){
  			labels.push(this.option[keyList[i]['key']]);
  			datasets[0]['data'].push(keyList[i]['value']);
  		}
  		this.data['labels'] = labels;
  		this.data['datasets'] = datasets;
  	} else if(this.questionData['qType']===2) {
  		// 主观题
  		let keyList = this.questionData['keyList'];
  		for(let i=0;i<keyList.length;i++){
  			labels.push(keyList[i]['key']);
  			datasets[0]['data'].push(keyList[i]['value']);
  		}
  		this.data['labels'] = labels;
  		this.data['datasets'] = datasets;
  	}
  }

}
