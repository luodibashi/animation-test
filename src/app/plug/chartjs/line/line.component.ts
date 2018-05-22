import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ClassService } from '../../../home/class/class.service';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.less']
})
export class LineComponent implements OnInit {
	// @Input() scoreReportList=[]
	cid: number
	studentId:number
  number: number = 5
  scoreList=[]
	type = 'line';
	data = {};
	options = {
	  responsive: true,
	  maintainAspectRatio: false
	};
  constructor(
  	private http: ClassService,
  	private Route: ActivatedRoute,
  	private Router: Router
  ) { }

  ngOnInit() {
  	this.cid = +this.Route.snapshot.params['cid'];
  	this.studentId = +this.Route.snapshot.params['studentId'];
  	// console.log(this.cid,this.studentId)
  	this.getStudentClassScore();
  }
  // 获取学生在班级中最近数次得分统计接口
  getStudentClassScore(){
  	let targetData = {
  		labels: ["第一次", "第二次", "第三次", "第四次", "第五次"]
  	}
  	let datasets = [
	    {
	      label: "个人成绩",
	      borderColor: "#4CAF50",
	      borderWidth: "1px"
	    },
	    {
	      label: "平均成绩",
	      borderColor: "#FF9800",
	      borderWidth: "1px",
	      borderDash: [3, 5]
	    }
	  ]
  	let childData1 = [];
  	let childData2 = [];
  	datasets[0]['data'] = childData1;
  	datasets[1]['data'] = childData2;
	  targetData['datasets'] = datasets
  	// console.log(data.datasets[0].data);
    this.http.getStudentClassScore(this.studentId,this.cid,this.number).subscribe(
      data =>{
        this.scoreList = data.scoreList;
        for(let i=0;i<this.scoreList.length;i++){
        	childData1.push(this.scoreList[i]['score']);
        	childData2.push(this.scoreList[i]['avgScore']);
        }
        // data.datasets[0].data = childData1;
        // data.datasets[1].data = childData2;
        this.data = targetData;
        // console.log(childData1,childData2);
        // console.log(datasets,targetData)
      }
    )
  }

}
