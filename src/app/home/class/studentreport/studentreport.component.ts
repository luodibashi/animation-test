import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ClassService } from '../class.service';
import { teacherInfo } from '../../home.model'
import { classInfo,StudentClassReport,StudentClassWorkReport,questionList } from '../class.model'

@Component({
  selector: 'app-studentreport',
  templateUrl: './studentreport.component.html',
  styleUrls: ['./studentreport.component.less']
})
export class StudentreportComponent implements OnInit {
	teacherInfo:teacherInfo
	tid: number
	cid: number
  className: string
	studentId:number
  // number: number = 5
  page:number=1
  size:number=12
  count:number
  // scoreList =[]
  finishWorkList=[]
  loadMore: boolean = false
  classInfo:classInfo
  StudentClassReport:StudentClassReport
  StudentClassWorkReport:StudentClassWorkReport
  questionList:questionList
  showWorkReport:boolean = false;
  constructor(
  	private http: ClassService,
  	private Route: ActivatedRoute,
  	private Router: Router
  ) { }

  ngOnInit() {
  	this.teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));
  	this.tid = this.teacherInfo.tid;
  	this.cid = +this.Route.snapshot.params['cid'];
  	this.studentId = +this.Route.snapshot.params['studentId'];
    this.getClassInfo();
    this.getStudentClassReport();
    // this.getStudentClassScore();
    this.getStudentClassFinishWork();
  }

  // 获取班级信息
  getClassInfo(){
    this.http.getClassInfo(this.cid).subscribe(
      data =>{
        if(!data.status){
          this.classInfo = data;
        } else {
          alert(data.info)
        }
      }
    )
  }
  // 获取学生指定班级中的统计报告接口
  getStudentClassReport(){
    this.http.getStudentClassReport(this.studentId,this.cid).subscribe(
      data =>{
        this.StudentClassReport = data;
      }
    )
  }
  // 获取班级的用户已完成作业列表接口
  getStudentClassFinishWork(){
    this.http.getStudentClassFinishWork(this.cid,this.studentId,this.page,this.size).subscribe(
      data =>{
        this.finishWorkList = data.workList;
        this.count = data.count;
        if(this.count> this.size){
          this.loadMore = true;
        } else {
          this.loadMore = false;
        }
      }
    )
  }
  // 获取更多
  getMore(){
    this.page ++;
    this.http.getStudentClassFinishWork(this.cid,this.studentId,this.page,this.size).subscribe(
      data =>{
        this.finishWorkList = this.finishWorkList.concat(data.workList);
        this.count = data.count;
        if(this.count> this.size*this.page){
          this.loadMore = true;
        } else {
          this.loadMore = false;
        }
      }
    )
  }

  getWorkDetail(workId){
    this.getStudentClassWorkReport(workId);
  }
  // 获取学生指定班级指定作业详细统计接口
  getStudentClassWorkReport(workId){
    this.http.getStudentClassWorkReport(this.studentId,workId).subscribe(
      data =>{
        this.showWorkReport = true;
        this.StudentClassWorkReport = data;
      }
    )
  }

  closeWorkReport(){
    this.showWorkReport = false;
  }

  // 返回
  return(){
  	this.Router.navigate(['my/class/student/'+this.cid]);
  }
}
