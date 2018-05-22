import { Component, OnInit ,Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ClassService } from '../class.service';
import { teacherInfo } from '../../home.model'
import * as qrcode from 'qrcode-generator'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
	titleName: string
	teacherInfo: teacherInfo
	tid: number
	cid: number
  @Input() navType: number
  constructor(
  	private http: ClassService,
  	private Route: ActivatedRoute,
  	private Router: Router
  ) { }

  ngOnInit() {
  	// this.teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));
  	// this.tid = this.teacherInfo.tid;
  	this.cid = this.Route.snapshot.params['cid']
  	// console.log(this.cid)
  }
  // 查看班级学生
  goToClassStudent(){
  	this.Router.navigate(['my/class/student/'+this.cid]);
  }
  // 查看班级教师
  goToClassTeacher(){
  	this.Router.navigate(['my/class/teacher/'+this.cid]);
  }
  // 查看班级作业
  goToClassWork(){
  	this.Router.navigate(['my/class/work/'+this.cid]);
  }
  // 查看班级题库
  goToClassQuestionBank(){
    alert('暂未开放');
  	// this.Router.navigate(['my/class/questionbank/'+this.cid]);
  }
  // 查看班级助教
  goToClassTutor(){
    alert('暂未开放');
  	// this.Router.navigate(['my/class/tutor/'+this.cid]);
  }
  // 查看班级信息
  goToClassInfo(){
  	this.Router.navigate(['my/class/info/'+this.cid]);
  }
  // 返回
  return(){
		this.Router.navigate(['my/class/list']);
  }
}
