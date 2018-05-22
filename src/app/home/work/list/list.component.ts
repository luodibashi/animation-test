import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WorkService } from '../work.service';
import { ClassService } from '../../class/class.service';
import { teacherInfo } from '../../home.model'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {
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
  showType: number =1 //1我的作业；2-搜索我的作业
  constructor(
  	private http: WorkService,
  	private ClassService: ClassService,
  	private Route: ActivatedRoute,
  	private Router: Router
  ) { }

  ngOnInit() {
  	this.teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));
  	this.tid = this.teacherInfo.tid;
  	this.getTeacherWorkList()
  }

  // 获取我的作业列表
  getTeacherWorkList(){
  	this.showType =1;
  	this.page = 1;
  	let obj ={};
  	this.ClassService.searchClassWork(obj,this.page,this.size).subscribe(
  		data =>{
  			if(!data.status){
  				this.workList = data.workList;
  				this.count = data.count;
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

  //getMore
  getMoreWork(){
  	if(this.showType ===1){
  		this.page++;
  		let obj ={};
	  	this.ClassService.searchClassWork(obj,this.page,this.size).subscribe(
	  		data =>{
	  			if(!data.status){
	  				this.workList = this.workList.concat(data.workList);
	  				this.count = data.count;
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
  	} else if(this.showType ===2){
  		this.page++;
  		let obj = {
  			"workName": this.workName
  		}
  		this.ClassService.searchClassWork(obj,this.page,this.size).subscribe(
  			data =>{
	  			if(!data.status){
	  				this.workList = this.workList.concat(data.workList);
	  				this.count = data.count;
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

  // 搜索
  searchWork(){
  	if(this.workName){
  		this.showType = 2;
  		this.page = 1;
  		let obj = {
  			"workName": this.workName
  		}
  		this.ClassService.searchClassWork(obj,this.page,this.size).subscribe(
  			data =>{
	  			if(!data.status){
	  				this.workList = data.workList;
	  				this.count = data.count;
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
  			this.getTeacherWorkList();
  		}
  		return;
  	}
  }
  // 返回
  return(){
  	this.Router.navigate(['my/home']);
  }
  // 布置作业
  arrangeWork(){
  	this.Router.navigate(['my/arrange'])
  }

  // 查看成绩报告
  viewReport(cid,workId){
    // 写入路由地址缓存便于跳转
    let workRouter = 'my/work/list';
    try{
      window.localStorage.setItem('workRouter',JSON.stringify(workRouter));
    } catch(e){
      alert("您处于无痕浏览，无法为您跳转");
    }
  	this.Router.navigate(['my/class/report/'+cid+'/'+workId]);
  }

  // 批改
  correct(workId){
    // alert('暂未开放');
    // let router = 'my/work/correct/question/'+workId+'/0';
    // console.log(router);
  	this.Router.navigate(['my/work/correct/question/'+workId+'/0']);
  }

}
