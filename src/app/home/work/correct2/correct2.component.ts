import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WorkService } from '../work.service';
import { ClassService } from '../../class/class.service';
import { teacherInfo } from '../../home.model'

@Component({
  selector: 'app-correct2',
  templateUrl: './correct2.component.html',
  styleUrls: ['./correct2.component.less']
})
export class Correct2Component implements OnInit {
	teacherInfo:teacherInfo
	tid: number
	cid: number
  constructor(
  	private http: WorkService,
  	private ClassService: ClassService,
  	private Route: ActivatedRoute,
  	private Router: Router
  ) { }

  ngOnInit() {
  	this.teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));
  	this.tid = this.teacherInfo.tid;
  }
  changeType(){
    
  }
  // 返回
  return(){
  	this.Router.navigate(['my/home']);
  }

}
