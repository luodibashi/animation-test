import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WorkService } from '../work.service';
import { ClassService } from '../../class/class.service';
import { teacherInfo } from '../../home.model'
import { workInfo,paperInfo,studentQuestionAnswer } from '../work.model'
import { DomSanitizer } from '@angular/platform-browser'
import wx from 'weixin-js-sdk'

@Component({
  selector: 'app-correct',
  templateUrl: './correct.component.html',
  styleUrls: ['./correct.component.less']
})
export class CorrectComponent implements OnInit {
  workStatus = ['未开始','准备中','进行中','待批改','长期作业中','客观题自动批改','已完成','已撤销'];
  teacherInfo:teacherInfo
	teacherName:string;
  teacherShortName:string;
  tid: number
	cid: number
  pid: number
  workId: number
  checkType: number //1-单题；2-单人；
  showStudentBox: boolean = false;
  workInfo:workInfo
  showQuestionBox: boolean = false
  showMoreWorkInfo: boolean = false
  questionList = []
  mContent: string
  sourceData = []
  stemList = []
  paperInfo:paperInfo
  orderList = []
  nowOrder: number = 1
  totalNumber:number = 0
  questionBox = []
  qid: number
  mid: number
  mOrder: number
  qOrder: number
  qType: number
  qScore: number
  choices =[]
  qContent: string
  qAnswer=[]
  qResolve={}
  answerType = ['','填空','文本','图片','音频']
  option = ['A','B','C','D','E','F','G','H','I','J','K','L']
  studentList = []  //作业已取卷
  studentList2 = [] //作业未取卷
  studentId: number
  studentName: string;
  photo: string
  isSubmit: number
  isAnswer: number
  isCheck: number
  score: number
  getStatus: number //1-已取卷;2-未取卷;
  count: number
  studentQuestionAnswer:studentQuestionAnswer
  answer=[]
  correct=[]
  wxBrowser:boolean
  appId: string
  nonceStr: string
  signature: string
  timestamp: string
  showWatchImg:boolean = false
  watchUrl: string
  audio: any
  playing: boolean = false
  private timer: any //setInterval
  startIndex:number
  endIndex:number
  recording:boolean = false
  targetQuestion: number
  targetChild: string
  nowAudioUrl = []
  showCorrectToolOrder: string;
  constructor(
  	private http: WorkService,
  	private ClassService: ClassService,
  	private Route: ActivatedRoute,
  	private Router: Router,
    private sanitizer: DomSanitizer
  ) { 
    this.audio = new Audio();
  }

  ngOnInit() {
    this.teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));
    this.tid = this.teacherInfo.tid;
    this.teacherName = this.teacherInfo.teacherName;
    if(this.teacherName.length>3){
      this.teacherShortName = this.teacherName.substr(0,3)+'.';
    }
    this.workId = +this.Route.snapshot.params['workId'];
    if(+this.Route.snapshot.params['studentId']){
      this.studentId = +this.Route.snapshot.params['studentId'];
    }
    // console.log(this.workId);
    // this.getClassWorkCorrectBaseInfo();
    // 判断微信浏览器
      // let url = window.location.href;
      // console.log(url)
    let ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) != null) {
      this.wxBrowser = true;
      let url = window.location.href.split('#')[0];
      // console.log(url)
        // 获取微信jssdk
      let obj={
        'url':url
      }
      // console.log(obj);
      this.http.getWeixinConfig(obj).subscribe(
        data =>{
          if(!data.status){
            this.appId = data.appId;
            this.nonceStr = data.nonceStr;
            this.signature = data.signature;
            this.timestamp = data.timestamp;
            wx.config({
              debug: false,
              appId: this.appId,
              timestamp: this.timestamp,
              nonceStr: this.nonceStr,
              signature: this.signature,
              jsApiList: [
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'onVoicePlayEnd',
                'uploadVoice',
                'downloadVoice'
              ]
            });
          } else {
            alert(data.info);
          }
        }
      )
    }else{
      this.wxBrowser = false;
    }
    // 根据作业id获取作业基本信息及学生信息
    this.http.getClassWorkCorrectBaseInfo(this.workId).subscribe(
      data =>{
        if(!data.status){
          this.workInfo = data;
          // console.log(this.workInfo);
          this.pid = data.pid;
          // this.getPaperPreview();
          // 获取试卷基础信息
          this.http.getPaperPreview(this.pid).subscribe(
            data =>{
              if(!data.status){
                this.paperInfo = data.paper;
                this.stemList = data.stem;
                this.questionList = data.questions;
                let paperStructJson = data.paper.paperStructJson;
                // console.log(paperStructJson[5].mid);
                for(let i=0;i<paperStructJson.length; i++){
                  // console.log('11')
                  if(paperStructJson[i].mid){
                    // console.log('here')
                    this.totalNumber = this.totalNumber + paperStructJson[i].stem.length;
                    // 复合题
                    let child = [];
                    for(let m=0;m<paperStructJson[i].stem.length;m++){
                      // console.log('there')
                      let childQuesiton ={};
                      childQuesiton['qid'] = paperStructJson[i].stem[m];
                      // console.log(childQuesiton);
                      child.push(childQuesiton);
                      this.questionBox.push(paperStructJson[i].stem[m]);
                    }
                    paperStructJson[i]['child'] = child;
                  }
                  // 处理试题数量及试题顺序
                  if(paperStructJson[i].qid){
                    this.totalNumber++;
                    this.questionBox.push(paperStructJson[i].qid);
                  }
                }
                this.orderList = paperStructJson;
                if(this.orderList[0].mid){
                  this.mid = this.orderList[0].mid;
                  // 处理视频
                  this.mContent = this.questionList[0].mContent;
                  // 匹配获取<img>开头，之后第一个>结尾以标签内容
                  let reg = /<img[^>]*>/gi;
                  let resource = this.mContent.match(reg);
                  // console.log(resource);
                  if(resource){
                    // 获取资源类型
                    for(let p=0; p<resource.length;p++){
                      let startIndex = resource[p].indexOf('_src');
                      let endIndex = resource[p].indexOf('"',startIndex+6);
                      let newSource = {};
                      if(resource[p].indexOf('type="vedio"')!=-1){
                        // console.log(resource[p].indexOf('type="vedio"'),'视频')
                        newSource['type'] = 1; //1-视频；2-音频
                        newSource['url'] = this.sanitizer.bypassSecurityTrustResourceUrl(resource[p].substring(startIndex+6,endIndex)+'?v=1002');
                        // this.sourceData[p]
                      } else if(resource[p].indexOf('type="mp3"')!=-1){
                        // console.log(resource[p].indexOf('type="mp3"'),'音频')
                        newSource['type'] = 2;
                        newSource['url'] = resource[p].substring(startIndex+6,endIndex);
                      }
                      this.sourceData[p] = newSource;
                      this.mContent = this.mContent.replace(resource[p],'');
                    }
                  }
                  // console.log(this.sourceData);
                  // 获取资源地址
                  // 将img标签替换为空
                  this.qid = this.orderList[0].stem[0];
                  this.mOrder = 1;
                  this.qOrder = 1;
                  // 根据材料id获取试题及信息
                  this.qType = this.stemList[this.mid][0].qType;
                  this.qScore = this.stemList[this.mid][0].qScore;
                  this.choices = this.stemList[this.mid][0].choices;
                  this.qContent = this.stemList[this.mid][0].qContent;
                  this.qAnswer = this.stemList[this.mid][0].qAnswer;
                  this.qResolve = this.stemList[this.mid][0].qResolve;
                } else {
                  this.qid = this.orderList[0].qid;
                  this.qOrder = 1;
                  this.qType = this.questionList[0].qType;
                  this.qScore = this.questionList[0].qScore;
                  this.choices = this.questionList[0].choices;
                  this.qContent = this.questionList[0].qContent;
                  this.qAnswer = this.questionList[0].qAnswer;
                  this.qResolve = this.questionList[0].qResolve;
                }
                // 获取学生作答信息列表
                this.getWorkStudentBaseInfo();
                // console.log(this.questionBox,this.orderList);
              } else {
                alert(data.info);
              }
            }
          )
        } else {
          alert(data.info);
        }
      }
    )
  }

  // 获取学生作答信息
  getWorkStudentBaseInfo(){
    this.http.getWorkStudentBaseInfo(this.workId,this.qid).subscribe(
      data =>{
        if(!data.status){
          this.count = data.count;
          this.studentList = data.studentList;
          // 获取学生数据
          let submitStudent = [];
          for(let i=0;i<this.studentList.length;i++){
            submitStudent.push(this.studentList[i].studentId);
          }
          this.studentList2 = data.studentList2;
          let noSubmitStudent = [];
          for(let i=0;i<this.studentList2.length;i++){
            noSubmitStudent.push(this.studentList2[i].studentId);
          }
          if(this.studentId){
            // 如果学生存在，则不设置默认
            if(submitStudent.indexOf(this.studentId)!=-1){
              this.studentName = this.studentList[submitStudent.indexOf(this.studentId)].studentName;
              this.photo = this.studentList[submitStudent.indexOf(this.studentId)].photo;
              this.score = this.studentList[submitStudent.indexOf(this.studentId)].score;
              this.isAnswer = this.studentList[submitStudent.indexOf(this.studentId)].isAnswer;
              this.isCheck = this.studentList[submitStudent.indexOf(this.studentId)].isCheck;
              this.isSubmit = this.studentList[submitStudent.indexOf(this.studentId)].isSubmit;
              this.getStatus = 1;
              if(!this.studentQuestionAnswer){
                
              }
            } else if(noSubmitStudent.indexOf(this.studentId)!=-1){
              this.studentName = this.studentList[noSubmitStudent.indexOf(this.studentId)].studentName;
              this.photo = this.studentList[noSubmitStudent.indexOf(this.studentId)].photo;
              this.score = this.studentList2[noSubmitStudent.indexOf(this.studentId)].score;
              this.isAnswer = this.studentList2[noSubmitStudent.indexOf(this.studentId)].isAnswer;
              this.isCheck = this.studentList2[noSubmitStudent.indexOf(this.studentId)].isCheck;
              this.isSubmit = this.studentList[noSubmitStudent.indexOf(this.studentId)].isSubmit;
              this.getStatus = 2;
              return;
            }
          } else {
            if(this.studentList.length>0){
              this.studentId = this.studentList[0].studentId;
              this.studentName = this.studentList[0].studentName;
              this.photo = this.studentList[0].photo;
              this.isSubmit = this.studentList[0].isSubmit;
              this.score = this.studentList[0].score;
              this.isAnswer = this.studentList[0].isAnswer;
              this.isCheck = this.studentList[0].isCheck;
              this.getStatus = 1;
            } else {
              this.getStatus = 2;
              if(this.studentList2.length>0){
                this.studentId = this.studentList2[0].studentId;
                this.studentName = this.studentList2[0].studentName;
                this.photo = this.studentList2[0].photo;
              } 
              return;
            }
          }
          this.getStudentWorkQuestionAnswer();
        } else {
          alert(data.info);
        }
      }
    )
  }

  // 获取学生指定作业指定试题作答及批改记录
  getStudentWorkQuestionAnswer(){
    this.http.getStudentWorkQuestionAnswer(this.studentId,this.workId,this.qid).subscribe(
      data =>{
        if(!data.status){
          this.studentQuestionAnswer = data;
          // console.log(this.studentQuestionAnswer);
          if(data.answer){
            this.answer = data.answer;
          } else {
            this.answer = [];
          }
          if(data.correct&&data.qType===2){
            this.correct = data.correct;
            // console.log('存在'+this.correct);
          } else if(!data.correct&&data.qType===2) {
            // console.log('不存在')
            // console.log(this.choices[0]);
            this.correct = [];
            let correctJson = {
              'correct':{
                'audio':'',
                'picture':'',
                'text':'',
                'textarea':''
              },
              'score':0,
              'correcterType':1
            }
            for(let i=0;i<this.choices[0].length;i++){
              // correctJson['qOrder'] = i+1;
              // console.log(correctJson,i);
              this.correct.push(correctJson);
              // this.correct[i] = correctJson;
              // correctJson['qOrder'] = i+1;
            }
            // this.correct = []
            // console.log(this.correct);
          }
        } else {
          alert(data.info);
        }
      }
    )
  }

  // 显示作业详情
  getMoreWorkInfo(){
    this.showMoreWorkInfo = !this.showMoreWorkInfo;
  }

  // 展开学生面板
  chooseStudent(){
    this.showStudentBox = !this.showStudentBox;
  }
  // 选择学生
  selectStudent(...studentInfo){
    // console.log(studentInfo);
    if(this.studentId===studentInfo[0]){
      return;
    } else {
      this.studentId = studentInfo[0];
      this.studentName = studentInfo[1];
      this.photo = studentInfo[2];
      this.isSubmit = studentInfo[3];
      this.score = studentInfo[4];
      this.getStatus = studentInfo[5];
      this.isAnswer = studentInfo[6];
      this.isCheck = studentInfo[7];
      if(this.getStatus === 2){
        return;
      } else if(this.getStatus === 1){
        // this.getWorkStudentBaseInfo();
        // 获取学生列表
        this.http.getWorkStudentBaseInfo(this.workId,this.qid).subscribe(
          data =>{
            if(!data.status){
              this.count = data.count;
              this.studentList = data.studentList;
              this.studentList2 = data.studentList2;
              this.getStudentWorkQuestionAnswer();
            } else {
              alert(data.info);
            }
          }
        )
      }
    }
  }

  // 选择试题
  showQuestion(){
    this.showQuestionBox = !this.showQuestionBox;
  }
  // 选择试题
  chooseQuestion(mid,qid,i,m){
    // console.log(this.orderList);
    // console.log(mid,qid,i,m)
    if(this.qid===qid){
      return;
    } else {
      this.nowOrder = 0;
      // console.log(this.qid,this.nowOrder);
      if(!mid){
        // 单题
        this.mid = null;
        this.qid = qid;
        // 设置当前题号
        this.nowOrder = this.questionBox.indexOf(this.qid)+1;
        this.qType = this.questionList[i].qType;
        this.qScore = this.questionList[i].qScore;
        this.qOrder = i+1;
        this.choices = this.questionList[i].choices;
        this.qContent = this.questionList[i].qContent;
        this.qAnswer = this.questionList[i].qAnswer;
        this.qResolve = this.questionList[i].qResolve;
      } else {
        let proving:boolean;
        if(this.mid===mid){
          proving = true;
        } else {
          proving = false;
        }
        this.mid = mid;
        this.qid = qid;
        // 设置当前题号及试题信息
        this.mOrder = i+1;
        this.nowOrder = this.questionBox.indexOf(this.qid)+1;
        this.qType = this.stemList[this.mid][m].qType;
        this.qScore = this.stemList[this.mid][m].qScore;
        this.qOrder = m+1;
        this.choices = this.stemList[this.mid][m].choices;
        this.qContent = this.stemList[this.mid][m].qContent;
        this.qAnswer = this.stemList[this.mid][m].qAnswer;
        this.qResolve = this.stemList[this.mid][m].qResolve;
        // 如果材料不变并且资源已获取，则不重新获取
        if(this.sourceData.length<0||!proving){
          this.mContent = this.questionList[i].mContent;
          // 匹配获取<img>开头，之后第一个>结尾以标签内容
          let reg = /<img[^>]*>/gi;
          let resource = this.mContent.match(reg);
          // console.log(resource);
          if(resource){
            // 获取资源类型
            for(let p=0; p<resource.length;p++){
              let startIndex = resource[p].indexOf('_src');
              let endIndex = resource[p].indexOf('"',startIndex+6);
              let newSource = {};
              if(resource[p].indexOf('type="vedio"')!=-1){
                // console.log(resource[p].indexOf('type="vedio"'),'视频')
                newSource['type'] = 1;
                newSource['url'] = this.sanitizer.bypassSecurityTrustResourceUrl(resource[p].substring(startIndex+6,endIndex)+'?v=1002');
                // this.sourceData[p]
              } else if(resource[p].indexOf('type="mp3"')!=-1){
                // console.log(resource[p].indexOf('type="mp3"'),'音频')
                newSource['type'] = 2;
                newSource['url'] = resource[p].substring(startIndex+6,endIndex);
              }
              this.sourceData[p] = newSource;
              this.mContent = this.mContent.replace(resource[p],'');
            }
          }
        }
        
        // console.log(this.sourceData);
      }
      // 获取作答详情
      this.getWorkStudentBaseInfo();
    }
  }

  // 上一题
  preQuestion(){
    // mid,qid,i,m
    let today = this.questionBox.indexOf(this.qid);
    let yesterday = today-1; 
    // console.log(today);
    let nowQid = this.questionBox[yesterday];
    // console.log(nowQid);
    let i:number; //大题题序
    let m:number; //子题题序
    // console.log(this.paperInfo.paperStructJson);
    let paperStructJson = this.paperInfo.paperStructJson;
    for(let a=0; a<paperStructJson.length; a++){
      if(paperStructJson[a].qid === nowQid){
        i=a;
        m=null;
        this.chooseQuestion(0,nowQid,i,m);
        return;
      }
      if(paperStructJson[a].mid){
        let mid = paperStructJson[a].mid;
        for(let b=0;b<paperStructJson[a].stem.length;b++){
          if(paperStructJson[a].stem[b] === nowQid){
            i=a;
            m=b;
            this.chooseQuestion(mid,nowQid,i,m);
            return;
          }
        }
      }
    }
  }
  // 下一题
  nextQuestion(){
    let today = this.questionBox.indexOf(this.qid);
    let tomorrow = today+1; 
    // console.log(today);
    let nowQid = this.questionBox[tomorrow];
    // console.log(nowQid);
    let i:number; //大题题序
    let m:number; //子题题序
    // console.log(this.paperInfo.paperStructJson);
    let paperStructJson = this.paperInfo.paperStructJson;
    for(let a=0; a<paperStructJson.length; a++){
      if(paperStructJson[a].qid === nowQid){
        i=a;
        m=null;
        this.chooseQuestion(0,nowQid,i,m);
        return;
      }
      if(paperStructJson[a].mid){
        let mid = paperStructJson[a].mid;
        for(let b=0;b<paperStructJson[a].stem.length;b++){
          if(paperStructJson[a].stem[b] === nowQid){
            i=a;
            m=b;
            this.chooseQuestion(mid,nowQid,i,m);
            return;
          }
        }
      }
    }
  }

  // watchImg看图片
  watchImg(img){
    // let start = img.indexOf('mini_');
    this.watchUrl = img.replace('mini_','')
    // console.log(this.watchUrl);
    // this.watchUrl.replace(\/d)
    this.showWatchImg = true;
  }

  // 关闭图片预览窗口
  closeWatchImgBox(){
    this.showWatchImg = false;
    this.watchUrl = '';
  }

  // listen(answer[i])
  listen(audio){
    // console.log('原始'+this.audio.src)
    // console.log('原始'+this.audio.ended)
    // console.log('原始'+this.audio.paused)
    // this.audio.pause();
    clearInterval(this.timer);
    if(!this.audio.ended){
      let a=0;
      this.timer = setInterval(
        ()=>{
          a++;
          // console.log(a+'-'+this.audio.ended);
          if(this.audio.ended){
            clearInterval(this.timer);
          }
        }
      ,1000)
    }
    if(this.audio.src != audio){
      this.audio.pause();
      this.audio.src = audio;
      this.audio.play();
      return;
    }
    if(this.audio.paused){
      // 停止的
      this.audio.src = audio;
      // console.log('已经停止了,开始播放'+this.audio.src)
      this.audio.play();
    } else {
      this.audio.src = audio;
      // console.log('正在播放中,停止'+this.audio.src)
      this.audio.pause();
      clearInterval(this.timer);
    }

    // clearInterval(this.timer);
    // if(!this.audio.ended){
    //   let a=0;
    //   this.timer = setInterval(
    //     ()=>{
    //       a++;
    //       console.log(a+'-'+this.audio.ended);
    //       if(this.audio.ended){
    //         clearInterval(this.timer);
    //       }
    //     }
    //   ,1000)
    // }

  }
  pause(audio){
    this.audio.src = audio;
    this.audio.pause();
  }


  showCorrectBox(i,order){
    let newCorrectToolOrder = this.qid + '' + i + '' + order;
    if(this.showCorrectToolOrder){
      if(this.showCorrectToolOrder===newCorrectToolOrder){
        this.showCorrectToolOrder = '';
      } else {
        this.showCorrectToolOrder = newCorrectToolOrder;
      }
    } else {
      this.showCorrectToolOrder = newCorrectToolOrder;
    }
  }

  //tapeAudio录音
  tapeAudio(i){
    // 如果微信浏览器
    if(this.wxBrowser){
      // 调用微信jssdk接口获取资源id
      // 将资源id转换为MP3
      // 将MP3文件上传服务器获取资源地址
      // 如果正在录音先暂停，然后开始录音
      if(this.targetQuestion === i){
        // 判断目标录音是否为现在点击的目标--是
        // console.log('这里是相同的子题')
        if(this.recording){
          // 结束录音
          this.recording = false;
          clearInterval(this.timer);
          // 上传音频
          this.uploadWxMedia(i);
        } else {
          // 如果已经存在音频，则直接播放
          if(this.correct[i].correct['audio'].length>1){
            // 音频已存在，直接播放
            this.listen(this.correct[i].correct['audio']);
          } else{
            // 开始录音
            this.recording = true;
            // let timeLast = 60;
            // 调用微信开始录音接口
            wx.startRecord();
            // 配置初始项，控制显示时间
            this.endIndex = 1;
            this.timer = setInterval(()=>{
              this.endIndex++;
              if(this.endIndex===60){
                this.recording = false;
                clearInterval(this.timer);
                // 上传音频
                this.uploadWxMedia(i);
              }
            },1000)
          }
        }
      } else {
        if(this.recording){
          this.recording = false;
          clearInterval(this.timer);
          // 先上传其他的录音
          // 上传音频
          this.uploadWxMedia(i);
        }
        // 否，停止然后再开始录音
        // console.log('这里不是相同的子题')
        // this.recording = false;
        this.targetQuestion = i;
        this.recording = true;
        // let timeLast = 60;
        // 调用微信开始录音接口
        wx.startRecord();
        this.endIndex = 1;
        this.timer = setInterval(()=>{
          this.endIndex++;
          if(this.endIndex===60){
            this.recording = false;
            clearInterval(this.timer);
            // 上传音频
            this.uploadWxMedia(i);
          }
        },1000)
      }
    } else {
      // 上传文件
      // console.log('上传文件')
      alert('请在微信中使用语音');
    }
  }

  // 微信上传音频
  uploadWxMedia(i){
    let me = this;
    wx.stopRecord({
      success: function (res) {
      let localId = res.localId;
        //上传语音接口 
        wx.uploadVoice({
          localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            let serverId = res.serverId; // 返回音频的服务器端ID
            // me.wxMultimediaStorage(serverId,i);
            let obj={
              'mediaId':serverId
            }
            me.http.wxMultimediaStorage(obj).subscribe(
              data =>{
                if(!data.status){
                  // 主观题小题批改接口
                  me.correct[i].correct['audio'] = data.url;
                  me.nowAudioUrl = [data.url,i];
                  me.correctChild(4,i);
                } else{
                  alert(data.info);
                }
              }
            )
          }
        });
      }
    });
  }

  // 持久化存储微信多媒体信息
  // wxMultimediaStorage(mediaId,i){
  //   let obj={
  //     'mediaId':mediaId
  //   }
  //   this.http.wxMultimediaStorage(obj).subscribe(
  //     data =>{
  //       if(!data.status){
  //         // 主观题小题批改接口
  //         this.correct[i].correct['audio'] = data.url;
  //         this.correctChild(4,i);
  //       } else{
  //         alert(data.info);
  //       }
  //     }
  //   )
  // }

  // 上传资源文件


  // 批改子题内容及分数 
  correctChild(type,i){
    let obj={
      "studentId":this.studentId,
      "workId":this.workId,
      "qid":this.qid,
      "tid":this.tid,
      // "uid":20,
      "userType":1, //改助教用户类型：1-教师；2-家长；3-学生
      "qOrder": i+1,
      "correct":{
          "text":"",
          "textarea":"",
          "picture":"",
          "audio":""
      }
    }
    // 因为默认添加的批改选项有一个空格，所以这里提交时需要去掉空格
    if(type===0){
      // 批改分数
      obj['score'] = this.correct[i].score;
      // 配置批改参数
      if(this.correct[i].correct['text']){
        obj['correct']['text'] = this.correct[i].correct['text'];
      }
      if(this.correct[i].correct['textarea']){
        obj['correct']['textarea'] = this.correct[i].correct['textarea'];
      }
      if(this.correct[i].correct['picture']){
        obj['correct']['picture'] = this.correct[i].correct['picture'];
      }
      if(this.correct[i].correct['audio']){
        obj['correct']['audio'] = this.correct[i].correct['audio'];
      }
    } else if (type===1){
      // 批改填空
      obj['correct']['text'] = this.correct[i].correct['text'].substr(1,this.correct[i].correct['text'].length-1);
      // 判定如果其中有值,则需要取出并放置进去
      if(this.correct[i].correct['textarea']){
        obj['correct']['textarea'] = this.correct[i].correct['textarea'];
      }
      if(this.correct[i].correct['picture']){
        obj['correct']['picture'] = this.correct[i].correct['picture'];
      }
      if(this.correct[i].correct['audio']){
        obj['correct']['audio'] = this.correct[i].correct['audio'];
      }
    } else if (type ===2){
      // 批改文本框
      obj['correct']['textarea'] = this.correct[i].correct['textarea'].substr(1,this.correct[i].correct['textarea'].length-1);
      // 判定如果其中有值,则需要取出并放置进去
      if(this.correct[i].correct['text']){
        obj['correct']['text'] = this.correct[i].correct['text'];
      }
      if(this.correct[i].correct['picture']){
        obj['correct']['picture'] = this.correct[i].correct['picture'];
      }
      if(this.correct[i].correct['audio']){
        obj['correct']['audio'] = this.correct[i].correct['audio'];
      }
    } else if (type ===3){
      // 批改图片
      obj['correct']['picture'] = this.correct[i].correct['picture'].substr(1,this.correct[i].correct['picture'].length-1);
      // 判定如果其中有值,则需要取出并放置进去
      if(this.correct[i].correct['text']){
        obj['correct']['text'] = this.correct[i].correct['text'];
      }
      if(this.correct[i].correct['textarea']){
        obj['correct']['textarea'] = this.correct[i].correct['textarea'];
      }
      if(this.correct[i].correct['audio']){
        obj['correct']['audio'] = this.correct[i].correct['audio'];
      }
    } else if (type ===4){
      // 批改音频
      // obj['correct']['audio'] = this.correct[i].correct['audio'].substr(1,this.correct[i].correct['audio'].length-1);
      obj['correct']['audio'] = this.correct[i].correct['audio'];
      // 判定如果其中有值,则需要取出并放置进去
      if(this.correct[i].correct['text']){
        obj['correct']['text'] = this.correct[i].correct['text'];
      }
      if(this.correct[i].correct['textarea']){
        obj['correct']['textarea'] = this.correct[i].correct['textarea'];
      }
      if(this.correct[i].correct['picture']){
        obj['correct']['picture'] = this.correct[i].correct['picture'];
      }
    }
    // 调用小题批改接口
    // console.log(obj);
    this.publicCorrect(type,obj);
  }

  // 公共批改服务
  publicCorrect(type,obj){
    // 调用小题批改接口
    this.http.correctStudentAnswer(obj).subscribe(
      data =>{
        if(!data.status){
          if(type===0){
            // 批改分数
            this.studentQuestionAnswer['correctType'] = '1';
          } else if (type===1){
            // 批改填空
          } else if (type ===2){
            // 批改文本框
          } else if (type ===3){
            // 批改图片
          } else if (type ===4){
            // 批改音频
            // this.correct[this.nowAudioUrl[1]].correct['audio'] = this.nowAudioUrl[0];
            this.targetChild = '';
            this.getStudentWorkQuestionAnswer();
          }
        } else {
          alert(data.info);
        }
      }
    )
  }


  // 新增批改类型
  addCorrectType(type,i){
    // console.log(type,i);
    // console.log(this.correct);
    // console.log(this.correct[i]);
    this.targetChild = this.qid+''+i+''+type;
    if(type===1){
      // console.log(this.correct[i].correct)
      // 填空
      if(this.correct[i].correct['text']&&this.correct[i].correct['text'].length>0){
        return;
      }
      this.correct[i].correct['text'] = ' ';
      // console.log(this.correct[i].correct)
      // console.log(this.correct);
      return;
    } else if(type === 2){
      // 文本
      if(this.correct[i].correct['textarea']&&this.correct[i].correct['textarea'].length>0){
        return;
      }
      this.correct[i].correct['textarea'] = ' ';
      return;
    } else if (type === 3){
      // 图片
      if(this.correct[i].correct['picture']&&this.correct[i].correct['picture'].length>0){
        return;
      }
      this.correct[i].correct['picture'] = ' ';
      return;
    } else if (type===4){
      // 音频
      if(this.correct[i].correct['audio']&&this.correct[i].correct['audio'].length>0){
        return;
      }
      this.correct[i].correct['audio'] = ' ';
      console.log(this.correct);
      return;
    }
    // console.log(this.correct);
  }

  // 删除批改项目
  deleteCorrect(type,i){
    // console.log(type,i);
    // 设定目标批改项为空
    this.targetChild = '';
    // 配置参数
    let obj={
      "studentId":this.studentId,
      "workId":this.workId,
      "qid":this.qid,
      "tid":this.tid,
      // "uid":20,
      "userType":1, //改助教用户类型：1-教师；2-家长；3-学生
      "qOrder": i+1,
      "correct":this.correct[i].correct
    }
    // 设置匹配为空格
    let regu = /^[ ]+$/;
    if(type===1){
      // 填空
      if(regu.test(this.correct[i].correct['text'])){
        // console.log(true);
        // 判断字段中所有的字符都是空格，则临时的
        this.correct[i].correct['text'] = '';
        // delete this.correct[i].correct.text;
      } else {
        // console.log(false);
        // 调用服务接口服务端删除
        obj.correct['text'] = '';
        // console.log(type,obj);
        this.publicCorrect(type,obj);
      }
    } else if(type === 2){
      // 文本
      if(regu.test(this.correct[i].correct['textarea'])){
        // console.log(true);
        // delete this.correct[i].correct.textarea;
        this.correct[i].correct['textarea'] = '';
      } else {
        // console.log(false);
        obj['correct']['textarea'] = '';
        this.publicCorrect(type,obj);
      }
    } else if (type === 3){
      // 图片
      if(regu.test(this.correct[i].correct['picture'])){
        // console.log(true);
        // delete this.correct[i].correct.picture;
        this.correct[i].correct['picture'] = '';
      } else {
        // console.log(false);
        obj['correct']['picture'] = '';
        this.publicCorrect(type,obj);
      }
    } else if (type===4){
      // 音频
      if(regu.test(this.correct[i].correct['audio'])){
        // console.log(true);
        // delete this.correct[i].correct.audio;
        this.correct[i].correct['audio'] = '';
        this.recording = false;
      } else {
        // console.log(false);
        // obj['correct']['audio'] = '';
        this.correct[i].correct['audio'] = '';
        this.publicCorrect(type,obj);
      }
    }
  }

  // 上传图片
  uploadImg(i){
    let obj={
      "studentId":this.studentId,
      "workId":this.workId,
      "qid":this.qid,
      "tid":this.tid,
      // "uid":20,
      "userType":1, //改助教用户类型：1-教师；2-家长；3-学生
      "qOrder": i+1,
      "correct":this.correct[i].correct
    }
    // 异步加载
    let pic = < any > document.querySelector("#picture");
    pic.click();
    let form = < HTMLFormElement > document.querySelector("#fd")
    let teacherInfo: any = JSON.parse(localStorage.getItem('teacherInfo'))

    pic.onchange = () => {
            // alert(pic.files)
      if (pic.files[0].size / (1024 * 1024) > 10) {
        alert("图片体积不能超过10M!")
        return
      }
      // flag 
      // image is uploading or not

      let fd = new FormData(form)
      let xhr = new XMLHttpRequest()

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let res = JSON.parse(xhr.responseText)
          if (!res.status) {
            // console.log(res)
            // alert(res.data.url)
            this.correct[i].correct.picture = res.data.url;
            obj.correct['picture'] = res.data.url;
            this.publicCorrect(3,obj);
          } else {
            alert('wow,upload failed!!!')
          }
        }
      }

      // upload progress event
      let uploadStart = (evt) => {
        let tartget = < NodeList > document.querySelectorAll('.uploading')
      }

      let uploadFailed = (evt) => {
        alert('wow,upload failed!!!')
      }

      let uploadCanceled = (evt) => {
        // console.log('upload canceled...')
      }

      let uploadComplete = (evt) => {
        // this.answerList[qid][i] = false
        // console.log('upload completed...')
      }

      // upload file start
      xhr.addEventListener("loadstart", uploadStart, false);
      xhr.addEventListener("error", uploadFailed, false);
      xhr.addEventListener("abort", uploadCanceled, false);
      xhr.addEventListener("load", uploadComplete, false);


      // listen upload progress
      xhr.upload.onprogress = (evt) => {
        // console.log(evt)
        if (evt.lengthComputable) {
          let percentComplete = Math.round(evt.loaded * 100 / evt.total);
          // console.log(percentComplete)
            //document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
        } else {
          //document.getElementById('progressNumber').innerHTML = 'unable to compute';
        }
      }

      xhr.open("post", `http://115.29.177.200:8080/upload?type=1&token=${teacherInfo.token}`, true)
      xhr.send(fd)

    }
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
