import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ClassService } from '../class.service';
import { teacherInfo } from '../../home.model'
import { classInfo } from '../class.model'
import * as qrcode from 'qrcode-generator'

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.less']
})
export class StudentComponent implements OnInit {
	navType: number=1 //1-班级学生；2-班级教师；3-班级作业；4班级题库；5-班级助教；6-班级信息；
	teacherInfo:teacherInfo
	tid: number
	cid: number
	studentList= []
	page:number = 1
	size:number = 12
	count: number
	loadMore: boolean
  constructor(
  	private http: ClassService,
  	private Route: ActivatedRoute,
  	private Router: Router
  ) { }

  ngOnInit() {
  	this.teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));
  	this.tid = this.teacherInfo.tid;
  	this.cid = +this.Route.snapshot.params['cid'];
  	// console.log(this.navType);
  	this.getClassStudent();
  }

  // 获取班级学生列表
  getClassStudent(){
  	this.http.getClassStudentList(this.cid,this.page,this.size).subscribe(
  		data =>{
  			if(!data.status){
  				this.studentList = data.studentList;
  				this.count = data.count;
  				if(this.count>this.size){
  					this.loadMore = true;
  				} else {
  					this.loadMore = false;
  				}
  			} else{
  				alert(data.info);
  			}
  		}
  	)
  }
  // 获取更多
  getMoreStudent(){
  	this.page ++;
  	this.http.getClassStudentList(this.cid,this.page,this.size).subscribe(
  		data =>{
  			if(!data.status){
  				this.studentList = this.studentList.concat(data.studentList);
  				this.count = data.count;
  				if(this.count>this.size*this.page){
  					this.loadMore = true;
  				} else {
  					this.loadMore = false;
  				}
  			} else{
  				alert(data.info);
  			}
  		}
  	)
  }

  // 查看学生详情
  goToStudentClassInfo(studentId){
  	// console.log(studentId);
    this.Router.navigate(['my/class/student/report/'+this.cid+'/'+studentId]);
  }

}
