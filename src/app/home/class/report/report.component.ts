import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ClassService } from '../class.service';
import { teacherInfo } from '../../home.model'
import { workBaseInfo,classInfo } from '../class.model'

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.less']
})
export class ReportComponent implements OnInit {
	teacherInfo:teacherInfo
	tid: number
	cid: number
	workId: number
	classInfo:classInfo
	workBaseInfo:workBaseInfo
  workStatus = ['未开始','准备中','进行中','待批改','长期作业中','客观题自动批改','已完成','已撤销'];
	option=['A','B','C','D','E','F','G','H','I','J']
  page: number = 1
  size: number =12
  count: number
  loadMore: boolean
  studentList=[]
  showType: number = 1//1-成绩排名；2-时间排名
  showSendMessage: boolean = false
  showTable: boolean = false
  questionList=[]
  questionCount:number
  sendMessageTime: boolean = false
  timeLast:number
  private timer: any
  constructor(
  	private http: ClassService,
  	private Route: ActivatedRoute,
  	private Router: Router
  ) { }

  ngOnInit() {
  	this.teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));
  	this.tid = this.teacherInfo.tid;
  	this.cid = +this.Route.snapshot.params['cid'];
  	this.workId = +this.Route.snapshot.params['workId'];
  	// console.log(this.cid,this.workId);
  	this.getWorkBaseInfo();
  	this.getClassInfo();
  	this.getWorkRankInfo();
  }

  // 获取作业基本信息
  getWorkBaseInfo(){
  	this.http.getWorkAnswerResult(this.workId).subscribe(
  		workBaseInfo =>{
  			this.workBaseInfo = workBaseInfo;
  			// console.log(this.workBaseInfo.workStatus);
  			if(this.workBaseInfo.workStatus===0||this.workBaseInfo.workStatus===1||this.workBaseInfo.workStatus===2||this.workBaseInfo.workStatus===7){
  				this.showSendMessage = false;
  			} else {
  				this.showSendMessage = true;
  			}
  		}
  	)
  }
  // 获取班级基础信息
  getClassInfo(){
  	this.http.getClassInfo(this.cid).subscribe(
  		classInfo =>{
  			this.classInfo = classInfo;
  			// console.log(this.classInfo);
  		}
  	)
  }
  // 获取班级学生作业排名
  getWorkRankInfo(){
  	this.http.getWorkRankInfo(this.workId,this.showType,this.page,this.size).subscribe(
  		data =>{
  			if(!data.status){
  				this.count = data.count;
  				this.studentList = data.rankList;
  				if(this.count>this.size){
  					this.loadMore = true;
  				} else {
  					this.loadMore = false;
  				}
  			} else {
  				alert(data.info);
  			}
  		}
  	)
  }
  // 切换排名类型 
  changeShowType(type){
  	if(type===this.showType){
  		return;
  	} else {
  		this.showType = type;
  		this.page = 1;
  		this.getWorkRankInfo();
  	}
  }
  // 获取更多排名
  getMore(){
  	this.page++;
  	this.http.getWorkRankInfo(this.workId,this.showType,this.page,this.size).subscribe(
  		data =>{
  			if(!data.status){
  				this.count = data.count;
  				this.studentList = this.studentList.concat(data.rankList);
  				if(this.count>this.size*this.page){
  					this.loadMore = true;
  				} else {
  					this.loadMore = false;
  				}
  			} else {
  				alert(data.info);
  			}
  		}
  	)
  }

  // 切换图表是否显示
  changeShowTable(){
  	this.showTable = !this.showTable;
  	if(this.showTable){
  		this.getWorkQuestionAnswerInfo();
  	}
  }
  // 获取排名数据
  getWorkQuestionAnswerInfo(){
  	this.http.getWorkQuestionAnswerInfo(this.workId).subscribe(
  		data =>{
  			if(!data.status){
  				this.questionCount = data.count;
  				this.questionList = data.workList;
  			} else {
  				alert(data.info);
  			}
  		}
  	)
  }
  // 批改
  correct(studentId,workId){
    // alert('暂未开放');
    if(studentId){
      this.Router.navigate(['my/work/correct/question/'+workId+'/'+studentId]);
    } else {
      this.Router.navigate(['my/work/correct/question/'+workId+'/0']);
    }
  	// console.log(studentId,workId);
  }
  // 发送成绩通知
  sendMessage(){
    // alert('暂未开放');
    if(this.workBaseInfo.workStatus===0||this.workBaseInfo.workStatus===1||this.workBaseInfo.workStatus===2||this.workBaseInfo.workStatus===7){
      alert('作业还还在进行中或未开始，不允许发送成绩通知');
      return;
    }
    if(this.sendMessageTime){
      alert('成绩通知已发送，请稍后');
      return;
    }
    // workStatus = ['未开始','准备中','进行中','待批改','长期作业中','客观题自动批改','已完成','已撤销'];
    // 1、作业为长期作业，处于长期作业中，可以大保存
    // 2、作业为有限期作业，包含主观题：待批改，已完成
    // 2、作业为有限期作业，没有主观题：客观题自动批改，已完成
  	let obj={
  		"workId":this.workId,
  		"sendAll":1 //是否给全体人员发送通知：1-是；2-给未收到通知的人发送；该参数为选填，不填则给全体人员发送
  	}
  	// console.log(obj);
    this.timeLast = 60;
    this.http.correctDone(obj).subscribe(
      data =>{
        if(!data.status){
          this.sendMessageTime = true;
          this.timer = setInterval(()=>{
            this.timeLast--;
            if(this.timeLast===1){
              clearInterval(this.timer);
              this.sendMessageTime = false;
            }
          },1000)
        } else {
          alert(data.info);
        }
      }
    )
  }

  // 返回
  return(){
    let workRouter = JSON.parse(localStorage.getItem('workRouter'));
    if(workRouter){
      this.Router.navigate([workRouter]);
    } else {
      this.Router.navigate(['my/work/list']);
    }
  }
}
