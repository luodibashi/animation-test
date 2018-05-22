import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WorkService } from '../work.service';
import { ClassService } from '../../class/class.service';
import { teacherInfo } from '../../home.model'

@Component({
  selector: 'app-waitcorrection',
  templateUrl: './waitcorrection.component.html',
  styleUrls: ['./waitcorrection.component.less']
})
export class WaitcorrectionComponent implements OnInit {
  workStatus = ['未开始','准备中','进行中','待批改','长期作业中','客观题自动批改','已完成','已撤销']
	teacherInfo:teacherInfo
	tid: number
	page: number = 1
	size: number = 12
	count: number
	loadMore: boolean = false
	workList = []
  workName: string
  showType: number =1 //1我的作业；2-搜索作业
  constructor(
  	private http: WorkService,
  	private ClassService: ClassService,
  	private Route: ActivatedRoute,
  	private Router: Router
  ) { }

  ngOnInit() {
  	this.teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));
  	this.tid = this.teacherInfo.tid;
  	this.getWaitingCorrectionWorkList();
  }

  // 获取待批改作业列表
  getWaitingCorrectionWorkList(){
  	this.showType =1;
  	this.page = 1;
  	let obj={
  		"page":this.page,
  		"size":this.size
  	}
  	this.http.getWaitingCorrectionWorkList(obj).subscribe(
  		data =>{
  			if(!data.status){
  				this.count = data.count;
  				this.workList = data.workList;
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

  // 搜索待批改作业
  searchWork(){
  	if(this.workName){
	  	this.showType =2;
	  	this.page = 1;
	  	let obj={
	  		"page":this.page,
	  		"size":this.size,
	  		"workName":this.workName
	  	}
	  	this.http.getWaitingCorrectionWorkList(obj).subscribe(
	  		data =>{
	  			if(!data.status){
	  				this.count = data.count;
	  				this.workList = data.workList;
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
  	} else {
  		alert('请输入作业名字');
  		if(this.showType===2){
  			this.getWaitingCorrectionWorkList();
  		}
  		return;
  	}
  }

  // 加载更多
  getMoreWork(){
  	if(this.showType === 1){
	  	this.page++;
	  	let obj={
	  		"page":this.page,
	  		"size":this.size
	  	}
	  	this.http.getWaitingCorrectionWorkList(obj).subscribe(
	  		data =>{
	  			if(!data.status){
	  				this.count = data.count;
	  				this.workList = this.workList.concat(data.workList);
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
  	} else if(this.showType === 2) {
  		this.page++;
	  	let obj={
	  		"page":this.page,
	  		"size":this.size,
	  		"workName":this.workName
	  	}
	  	this.http.getWaitingCorrectionWorkList(obj).subscribe(
	  		data =>{
	  			if(!data.status){
	  				this.count = data.count;
	  				this.workList = this.workList.concat(data.workList);
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
  }

  // 查看成绩报告
  viewReport(cid,workId){
    // 写入路由地址缓存便于跳转
    let workRouter = 'my/work/correct/waiting';
    try{
      window.localStorage.setItem('workRouter',JSON.stringify(workRouter));
    } catch(e){
      alert("您处于无痕浏览，无法为您跳转");
    }
  	this.Router.navigate(['my/class/report/'+cid+'/'+workId]);
  }

  // 批改
  correct(workId){
  	this.Router.navigate(['my/work/correct/question/'+workId+'/0']);
  }

  // 返回
  return(){
  	this.Router.navigate(['my/home']);
  }
}
