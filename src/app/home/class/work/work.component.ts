import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ClassService } from '../class.service';
import { teacherInfo,searchTeacherInfo } from '../../home.model'

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.less']
})
export class WorkComponent implements OnInit {
	navType: number=3 //1-班级学生；2-班级教师；3-班级作业；4班级题库；5-班级助教；6-班级信息；
  workStatus = ['未开始','准备中','进行中','待批改','长期作业中','客观题自动批改','已完成','已撤销'];
  // 0-未开始；1-准备中；2-进行中；3-批改中；4-长期作业中；5-客观题自动批改；6-结束；7-已撤销
	teacherInfo:teacherInfo
	tid: number
	cid: number
	page: number = 1
	size: number =12
	count: number
	loadMore: boolean = false
	workList = []
  workName: string
  showType: number = 1 //1-班级作业列表；2-搜索；
  constructor(
  	private http: ClassService,
  	private Route: ActivatedRoute,
  	private Router: Router
  ) { }

  ngOnInit() {
  	this.teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));
  	this.tid = this.teacherInfo.tid;
  	this.cid = +this.Route.snapshot.params['cid'];
  	this.getClassWorkList();
  }

  // 获取班级作业列表
  getClassWorkList(){
    this.showType = 1;
    this.page = 1;
  	this.http.getClassWorkList(this.cid,this.page,this.size).subscribe(
  		data =>{
  			if(!data.status){
  				this.count = data.count;
  				this.workList = data.workList;
  				if(this.count > this.size){
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
  // 获取更多作业
  getMoreWork(){
    if(this.showType===1){
      this.page++;
      this.http.getClassWorkList(this.cid,this.page,this.size).subscribe(
        data =>{
          if(!data.status){
            this.count = data.count;
            this.workList = this.workList.concat(data.workList);
            if(this.count > this.size*this.page){
              this.loadMore = true;
            } else {
              this.loadMore = false;
            }
          } else {
            alert(data.info);
          }
        }
      )
    } else if(this.showType === 2) {
      this.page ++;
      let obj={
        "cid":this.cid,
        "workName":this.workName
      }
      // console.log(obj)
      this.http.searchClassWork(obj,this.page,this.size).subscribe(
        data =>{
          if(!data.status){
            this.workList = this.workList.concat(data.workList);
            this.count = data.count;
            if(this.count > this.size*this.page){
              this.loadMore = true;
            } else {
              this.loadMore = false;
            }
          } else {
            alert(data.info)
          }
        }
      )
    }
  }
  // 根据作业名字搜索班级作业
  searchClassWork(){
    if(this.workName){
      this.showType = 2;
      this.page = 1;
      let obj={
        "cid":this.cid,
        "workName":this.workName
      }
      // console.log(obj)
      this.http.searchClassWork(obj,this.page,this.size).subscribe(
        data =>{
          if(!data.status){
            this.workList = data.workList;
            this.count = data.count;
            if(this.count > this.size){
              this.loadMore = true;
            } else {
              this.loadMore = false;
            }
          } else {
            alert(data.info)
          }
        }
      )
    } else {
      alert('请输入作业名字');
      if(this.showType===2){
        this.getClassWorkList();
      }
      return;
    }
  }

  // 查看成绩报告
  viewReport(cid,workId){
    // 写入路由地址缓存便于跳转
    let workRouter = 'my/class/work/'+cid;
    try{
      window.localStorage.setItem('workRouter',JSON.stringify(workRouter));
    } catch(e){
      alert("您处于无痕浏览，无法为您跳转");
    }
    this.Router.navigate(['my/class/report/'+cid+'/'+workId]);
  }
  // 批改
  correct(workId){
    // 写入路由地址缓存便于跳转
    let workRouter = 'my/class/work/'+this.cid;
    try{
      window.localStorage.setItem('workRouter',JSON.stringify(workRouter));
    } catch(e){
      alert("您处于无痕浏览，无法为您跳转");
    }
    // alert('暂未开放');
    this.Router.navigate(['my/work/correct/question/'+workId+'/0']);
  }

}
