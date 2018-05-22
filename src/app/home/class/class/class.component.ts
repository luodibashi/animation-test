import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ClassService } from '../class.service';
import { teacherInfo } from '../../home.model'
import * as qrcode from 'qrcode-generator'

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.less']
})
export class ClassComponent implements OnInit {
	teacherInfo:teacherInfo
	tid: number
	classList = []
	pendingList = []
	havaInvitation: boolean = false
	loadMore: boolean = false
	page: number = 1
	size: number = 12
	count: number
	pageType: number = 1 //1-班级列表；2-邀请列表；
  constructor(
  	private http: ClassService,
  	private Route: ActivatedRoute,
  	private Router: Router
  ) { }

  ngOnInit() {
  	this.teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));
  	this.tid = this.teacherInfo.tid;
  	// console.log(this.tid);
  	this.getTeacherClassList();
  	// 查看是否有邀请信息
  	this.getInvitationStatus();
  }
  // 获取班级列表
  getTeacherClassList(){
  	this.http.getTeacherClassList(this.tid,this.page,this.size).subscribe(
  		data => {
  			if(!data.status){
  				this.classList = data.classList;
  				this.count = data.count;
  				if(this.count>this.size){
  					this.loadMore = true;
  				}
  			} else {
  				alert(data.info);
  			}
  		}
  	)
  }
  // 获取更多班级
  getMoreClass(){
  	this.page ++;
  	this.http.getTeacherClassList(this.tid,this.page,this.size).subscribe(
  		data => {
  			if(!data.status){
  				this.classList = this.classList.concat(data.classList);
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

  // 获取公共班级邀请
  getInvitationStatus(){
  	let size = 100;
  	this.http.getTeacherClassPendingList(this.tid,this.page,size).subscribe(
  		data =>{
  			if(!data.status){
  				this.pendingList = data.classList;
  				if(data.count>0){
  					this.havaInvitation = true;
  				}
  			}else {
  				alert(data.info);
  			}
  		}
  	)
  }

  // 创建班级
  createClass(){
  	this.Router.navigate(['my/class/create/99999']);
  }

  // 处理邀请
  dealWithInvitation(){
  	this.pageType = 2;
  }

  // 同意 
  agree(cid){
  	let obj={
  		"cid":cid,
  		"isAgree":1
  	}
  	// console.log(obj);
  	this.http.teacherReply(obj).subscribe(
  		data =>{
  			if(!data.status){
  				alert('恭喜你成功加入班级');
  				this.Router.navigate(['my/class/teacher/'+cid]);
  			} else {
  				alert(data.info);
  			}
  		}
  	)
  }
  // 拒绝
  refuse(cid){
  	let result = window.confirm('确定拒绝公共班级邀请么？');
  	if(result){
	  	let obj={
	  		"cid":cid,
	  		"isAgree":2
	  	}
	  	// console.log(obj);
	  	this.http.teacherReply(obj).subscribe(
	  		data =>{
	  			if(!data.status){
	  				this.return();
	  			} else {
	  				alert(data.info);
	  			}
	  		}
	  	)
  	}
  }

  // 返回
  return(){
  	if(this.pageType===1){
  		this.Router.navigate(['my/home']);
  	} else if (this.pageType===2){
  		this.pageType = 1;
  		// 重新请求获取公共班级邀请
  		this.havaInvitation = false;
  		this.getInvitationStatus();
  	}
  }

  // 进入班级
  enterTheClass(cid){
  	this.Router.navigate(['my/class/info/'+cid]);
  }

}
