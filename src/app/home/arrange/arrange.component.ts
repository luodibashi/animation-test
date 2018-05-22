import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ArrangeService } from './arrange.service';
import { teacherInfo } from '../home.model'
import * as qrcode from 'qrcode-generator'

@Component({
  selector: 'app-arrange',
  templateUrl: './arrange.component.html',
  styleUrls: ['./arrange.component.less']
})
export class ArrangeComponent implements OnInit {
	teacherInfo:teacherInfo
	teacherName:string
	tid: number
	uid: number
  showMore: boolean = false
  classList = []
  classCount: number
  studentCount: number
  page: number = 1
  size: number = 12;
  showStudent: boolean = false
  showStudentClass = []  //用于是否显示学生列表
  cids = []
  showPaper: boolean = false
  targetPid: number
  paperCount: number
  paperPage: number = 1
  paperSize: number = 12
  paperList= []
  targetPaperName: string
  targetShortPaperName: string
  showMorePaper: boolean = false
  workName: string
  noticeTime: string
  startTime: string
  endTime: string
  noticeTimeShow: string
  startTimeShow: string
  endTimeShow: string
  durationTimeShow: string
  durationTime: number
  isMixed: number = 0 //客观题是否乱序:0-否；1-是；
  isWholeWork: number = 1 //是否全班作业:0-否；1-是；
  isJoinStatistics: number = 1 //是否加入班级统计：0-否；1-是；
  showAnswerType: number = 1 //答案解析查看方式:1-交卷后立即查看；2-作业结束后查看
  workType: number = 1 //作业类型：1-普通作业；2-推荐商品作业；3-普通商品作业;
  searchPaperName: string
  searchPaperCount: number
  searchPaperPage: number = 1
  searchPaperSize: number = 100
  searchPaperNow: boolean = false 
  constructor(
  	private http: ArrangeService,
  	private Route: ActivatedRoute,
  	private Router: Router
  ) { }

  ngOnInit() {
  	this.teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));
  	this.tid = this.teacherInfo.tid;
  	this.uid = this.teacherInfo.userId;
    this.getMyClassList();
    // this.noticeTimeShow = '2018-04-09T12:00'
    // console.log(new Date().getTime());
    // let date = '2018-04-09 12:50:00'
    // let newTime = new Date(date.replace(/-/g, '/'))
    // let timestamp = newTime.getTime();
    // console.log(timestamp);
  }


  // 获取我的班级（包括公共班级和我的班级）
  getMyClassList(){
    this.size = 1000;
    this.http.getTeacherClassList(this.tid,this.page,this.size).subscribe(
      data =>{
        if(!data.status){
          this.classCount = data.count;
          this.classList = data.classList;
        }
      }
    )
  }

  // 获取学生列表
  getClassStudentList(cid,i,type){
    this.size = 1000;
    this.classList[i]['studentList'] = [];
    this.http.getClassStudentList(cid,this.page,this.size).subscribe(
      data =>{
        this.studentCount = data.count;
        // 展开查看班级学生
        let studentList = [];
        if(!this.studentCount){
          if(type===1){
            this.showStudentClass.splice(this.showStudentClass.indexOf(cid),1);
          } else if(type===2) {
            this.classList[i]['isMake'] = 1;
          }
        } else {
          studentList = data.studentList;
          for(let u=0;u<studentList.length; u++){
            if(studentList[u]['dataStatus']===1){
              this.classList[i]['studentList'].push(studentList[u]);
              if(type ===2){
                for(let x=0; x<this.classList[i]['studentList'].length;x++){
                  this.classList[i]['studentList'][x]['isMake'] = 1;
                }
              }
            }
          }
        }
      }
      // console.log(this.classList);
    )
  }

  // 显示班级学生（用于展开收起）
  showStudentList(i){
    let cid = this.classList[i]['cid'];
    if(this.showStudentClass.indexOf(cid)!=-1){
      this.showStudentClass.splice(this.showStudentClass.indexOf(cid),1);
    } else {
      this.showStudentClass.push(cid);
      // console.log(!this.classList[i]['studentList']);
      if(this.classList[i]['studentList']&&this.classList[i]['studentList'].length>0){
        return;
      } else{
        // 如果班级数据中有学生数据就不需要重新请求了
        this.getClassStudentList(cid,i,1);
      }
    }
  }

  // 选则班级
  chooseClass(i){
    let cid = this.classList[i]['cid'];

    if(this.showStudentClass.indexOf(cid)!=-1){
      if(this.classList[i]['isMake']===1){
        this.classList[i]['isMake'] = 0;
        if(this.classList[i]['studentList']&&this.classList[i]['studentList'].length>0){
          for(let a=0; a<this.classList[i]['studentList'].length;a++){
            this.classList[i]['studentList'][a]['isMake'] = 0;
          }
          // return;
        }
      } else {
        this.classList[i]['isMake'] = 1;
        if(this.classList[i]['studentList']&&this.classList[i]['studentList'].length>0){
          for(let b=0; b<this.classList[i]['studentList'].length;b++){
            this.classList[i]['studentList'][b]['isMake'] = 1;
          }
          // return;
        } else {
          // 如果班级数据中没有学生数据
          this.getClassStudentList(cid,i,2);
        }
      }
    } else {
      this.showStudentClass.push(cid);
      // console.log('到这里')
      if(this.classList[i]['isMake']===1){
        this.classList[i]['isMake'] = 0;
        if(this.classList[i]['studentList']&&this.classList[i]['studentList'].length>0){
          for(let a=0; a<this.classList[i]['studentList'].length;a++){
            this.classList[i]['studentList'][a]['isMake'] = 0;
          }
          // return;
        }
      } else {
        // console.log('111')
        this.classList[i]['isMake'] = 1;
        if(this.classList[i]['studentList']&&this.classList[i]['studentList'].length>0){
          for(let b=0; b<this.classList[i]['studentList'].length;b++){
            this.classList[i]['studentList'][b]['isMake'] = 1;
          }
          // return;
        } else {
          // 如果班级数据中没有学生数据
          this.getClassStudentList(cid,i,2);
        }
      }
    }
    // console.log(this.classList);
  }
  // 选择班级学生
  chooseStudent(i,m){
    // 如果班级未选
    if(this.classList[i]['isMake'] ===1){
      if(this.classList[i]['studentList'][m]['isMake']===1){
        this.classList[i]['studentList'][m]['isMake'] = 0;
      } else {
        this.classList[i]['studentList'][m]['isMake'] = 1;
      }
    } else {
      this.classList[i]['isMake'] = 1;
      this.classList[i]['studentList'][m]['isMake'] = 1;
    }
  }

  // 选择习题模块显示choosePaper()
  choosePaper(){
    this.paperPage = 1;
    this.showPaper = true;
    this.getPaperList();
  }

  // 获取习题列表
  getPaperList(){
    this.http.getTeacherPaperList(this.paperPage,this.paperSize).subscribe(
      data =>{
        if(!data.status){
          this.paperCount = data.count;
          if(this.paperCount){
            if(this.paperCount > this.paperSize){
              this.showMorePaper = true;
            }
            this.paperList = data.paperList;
          }
        } else {
          alert(data.info)
        }
      }
    )
  }

  // 搜索习题
  searchPaper(){
    this.searchPaperNow = true;
    if(this.searchPaperName){
      let obj ={
        "paperName":this.searchPaperName
      }
      this.http.searchTeacherPaper(obj,this.searchPaperPage,this.searchPaperSize).subscribe(
        data =>{
          if(!data.status){
            this.searchPaperCount = data.count;
            this.paperList = data.paperList;
          } else {
            alert(data.info);
          }
        }
      )
    } else {
      // alert('请输入习题名字');
      this.getPaperList();
    }
  }

  // 获取更多习题
  getMorePaper(){
    this.paperPage++;
    this.http.getTeacherPaperList(this.paperPage,this.paperSize).subscribe(
      data =>{
        if(!data.status){
          this.paperCount = data.count;
          this.paperList = this.paperList.concat(data.paperList);
          if(this.paperCount > this.paperPage*this.paperSize){
            this.showMorePaper = true;
          }
          // console.log(this.paperList);
        } else {
          alert(data.info)
        }
      }
    )
  }
  // 选择习题
  secletedPaper(i){
    if(this.paperList[i]['isFinish']===1){
      this.targetPid = this.paperList[i]['pid'];
      this.targetPaperName = this.paperList[i]['paperName'];
      if(this.targetPaperName.length>15){
        this.targetShortPaperName = this.targetPaperName.substr(0,15)+'...';
      } else {
        this.targetShortPaperName = this.targetPaperName;
      }
    } else {
      return;
    }
  }
  // 确定选择习题
  yesIamSure(){
    if(this.targetPid){
      this.showPaper = false;
      this.workName = this.targetPaperName;
    } else {
      alert('请选择习题');
    }
  }
  // 取消选择习题
  cancelChoose(){
    this.showPaper = false;
    this.targetPid = null;
    this.targetPaperName = '';
    this.targetShortPaperName = '';
  }

  vaildNoticeTime(){
    // console.log(this.noticeTimeShow);
    // 2018-04-09T12:00
    if(this.noticeTimeShow){
      this.noticeTime = this.noticeTimeShow.substr(0,10) + ' ' + this.noticeTimeShow.substr(11,5) + ':00';
    }
    // console.log(this.noticeTime);
  }

  vaildStartTime(){
    // console.log(this.startTimeShow)
    if(this.startTimeShow){
      this.startTime = this.startTimeShow.substr(0,10) + ' ' + this.startTimeShow.substr(11,5) + ':00';
    }
    // console.log(this.startTime);
  }

  vaildEndTime(){
    // console.log(this.endTimeShow)
    if(this.endTimeShow){
      this.endTime = this.endTimeShow.substr(0,10) + ' ' + this.endTimeShow.substr(11,5) + ':00';
    }
    // console.log(this.endTime);
  }
  
  vaildDurationTime(){
    // console.log(this.durationTimeShow);
    if(this.durationTimeShow){
      let hour = this.durationTimeShow.substr(0,2);
      let minutes = this.durationTimeShow.substr(3,2);
      let one: number;
      let two: number;
      if(Number(hour)>0){
        one = Number(hour)*60;
      } else {
        one = 0;
      }

      if(Number(minutes)>0){
        two = Number(minutes);
      } else {
        two = 0;
      }

      this.durationTime = (one + two)*60;
      // console.log(this.durationTime);
    }
  }

  // 切换全班作业属性
  changeWholeWorkType(type){
    // console.log(this.isWholeWork,type);
    this.isWholeWork = type;
  }

  // 切换客观题乱序
  changeIsMixedType(type){
    this.isMixed = type;
  }
  // 切换作业提交后公布答案
  changeShowAnswerType(type){
    this.showAnswerType = type;
  }
  // 切换作业是否加入班级统计
  changeJoinStatisticsType(type){
    this.isJoinStatistics = type;
  }

  // 发布作业
  publishWork(){
    if(!this.targetPid){
      alert('请选择习题');
      return;
    }
    if(this.classList.length<1){
      alert('您还没有班级哦');
      return
    } else{
      this.cids = [];
      for (let i = 0; i<this.classList.length; i++) {
        // console.log('2')
        let cids = {}
        let students = [];
        if(this.classList[i]['isMake']===1){
          cids['cid'] = this.classList[i]['cid'];
          let b=0;
          if(this.classList[i]['studentList'].length>0){
            // console.log('1');
            for(let p=0;p<this.classList[i]['studentList'].length; p++){
              // console.log(this.classList[i]['studentList'][p]['studentId'],this.classList[i]['studentList'][p]['isMake']);
              let student = {};
              student['studentId'] = this.classList[i]['studentList'][p]['studentId'];
              student['isMake'] = this.classList[i]['studentList'][p]['isMake'];
              students.push(student);
              // console.log(students);
            }
            cids['students'] = students;
            this.cids.push(cids);
          } else {
            cids['students'] = [];
            this.cids.push(cids);
          }
        }
        // console.log(students);
      }
      // console.log(this.cids);
      // console.log(this.classList);
      if(this.cids.length<1){
        alert('请选择班级学生');
        return;
      }
    }
    // 获取当前时间
    // let year = new Date().getFullYear().toString();
    // let month = (new Date().getMonth()+1).toString();
    // if(Number(month)<10){
    //   month = '0' + month;
    // }
    // let day = new Date().getDate().toString();
    // if(Number(day)<10){
    //   day = '0'+day;
    // }
    // let hour = new Date().getHours().toString();
    // if(Number(hour)<10){
    //   hour = '0' + hour;
    // }
    // let minute = new Date().getMinutes().toString();
    // if(Number(minute)<10){
    //   minute = '0' + minute;
    // }
    // let nowTime = year + '-' + month +'-' + day + ' ' + hour + ':' + minute + ':' + '59';
    // console.log(nowTime);
    // let second = new Date().getSeconds().toString();

    // console.log(new Date().getTime());
    // let date = '2018-04-09 12:50:00'
    // let newTime = new Date(date.replace(/-/g, '/'))
    // let timestamp = newTime.getTime();
    // console.log(timestamp);
    // 作业名字
    // 所选习题
    // 所选班级学生
    // 作业通知时间
    // 作业开始结束时间
    // 作业时长
    // 是否为全班作业
    // 客观题乱序
    // 作业提交后公布答案
    let obj = {
      "pid":this.targetPid,
      "workName": this.workName,
      "endTime": this.endTime,
      "showAnswerType": this.showAnswerType,
      "isMixed":this.isMixed,
      "isWholeWork": this.isWholeWork,
      "isJoinStatistics": this.isJoinStatistics,
      "workType": this.workType,
      "cids": this.cids
    }
    // // 配置时间
    let now = new Date().getTime();
    if(this.noticeTime){
      // 通知时间小于开始时间，大于当前时间
      let noticeTime = (new Date(this.noticeTime.replace(/-/g,'/'))).getTime();
      if(noticeTime < now || noticeTime === now){
        alert('通知时间必须在当前时间之后');
        return;
      } else {
        obj['displayTime'] = this.noticeTime;
      }
    }

    if(this.startTime){
      // 开始时间大于通知时间，小于结束时间
      let startTime = (new Date(this.startTime.replace(/-/g,'/'))).getTime();
      if(this.noticeTime){
        let noticeTime = (new Date(this.noticeTime.replace(/-/g,'/'))).getTime();
        if(noticeTime > startTime){
          alert('通知时间必须在开始时间之前');
          return;
        } else {
          obj['startTime'] = this.startTime;
        }
      }
    }

    if(this.endTime){
      // 结束时间大于开始时间，大于当前时间
      let endTime = (new Date(this.endTime.replace(/-/g,'/'))).getTime();
      if(this.startTime){
        let startTime = (new Date(this.startTime.replace(/-/g,'/'))).getTime();
        if(endTime < startTime||endTime === startTime){
          alert('结束时间必须在开始时间之后');
          return;
        } else {
          obj['endTime'] = this.endTime;
        }
      }
    }

    if(this.durationTime){
      obj['durationTime'] = this.durationTime;
    } else {
      obj['durationTime'] = 0;
    }

    // console.log(obj);
    this.http.publishAssignments(obj).subscribe(
      data =>{
        if(!data.status){
          // alert('布置完成，跳转至作业列表')
          this.Router.navigate(['my/home']);
        }else{
          alert(data.info);
        }
      }
    )
  }

  // 返回
  return(){
  	this.Router.navigate(['my/home']);
  }

  // 显示更多选项
  showMoreChoose(){
    this.showMore = !this.showMore;
  }

}
