import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ClassService } from '../class.service';
import { teacherInfo,searchTeacherInfo } from '../../home.model'

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.less']
})
export class TeacherComponent implements OnInit {
	navType: number=2 //1-班级学生；2-班级教师；3-班级作业；4班级题库；5-班级助教；6-班级信息；
	teacherInfo:teacherInfo
	tid: number
	cid: number
	showTeacherInfo: boolean = false
	page: number = 1
	size: number = 20
	count: number
	teacherList = []
	isOwner: number
	isCheck: number
	isShow: number
	isAgree: number
	account: string
	searchErr: string
	searchTeacherInfo: searchTeacherInfo
  constructor(
  	private http: ClassService,
  	private Route: ActivatedRoute,
  	private Router: Router
  ) { }

  ngOnInit() {
  	this.teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));
  	this.tid = this.teacherInfo.tid;
  	this.cid = +this.Route.snapshot.params['cid'];

  	this.getClassTeacherList();
  }

  // 搜索教师
  searchTeacher(){
  	console.log(this.account)
  	this.searchErr = '';
  	let obj ={};
    // 正则匹配
    let accountRegexp = /^[a-zA-Z]\w+$/;
    let phoneRegexp = /^1[345678]\d{9}$/;
    let emailRegexp = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    if(accountRegexp.test(this.account)){
    	// 账号为用户名
    	obj['account'] = this.account;
    } else if(phoneRegexp.test(this.account)){
    	// 账号为手机号
    	obj['phone'] = this.account;
    } else if(emailRegexp.test(this.account)){
    	// 账号为邮箱
    	obj['email'] = this.account;
    } else{
    	// alert('账号不存在');
    	this.searchErr = '您输入的账号不存在';
    	return;
    }
    // 调用接口服务
    this.http.searchClassTeacher(obj).subscribe(
    	data =>{
    		if(!data.status){
    			this.searchTeacherInfo = data;
    			if(this.searchTeacherInfo.tid){
    				this.showTeacherInfo = true;
    			}
    			console.log(this.searchTeacherInfo);
    		} else{
    			alert(data.info);
    		}
    	}
   	)

  }

  // 发送邀请
  sendLaunch(tid){
  	// console.log(tid);
  	for(let i=0;i<this.teacherList.length; i++){
  		if(tid === this.teacherList[i]['tid']){
				this.searchErr = '账号已在班级中，不能重复邀请';
				this.account = '';
				this.showTeacherInfo = false;
  			return;
  		}
  	}
  	let obj={
  		"cid":this.cid,
  		"tid":tid
  	}
  	this.http.inviteTeacher(obj).subscribe(
  		data =>{
  			if(!data.status){
  				this.searchErr = '邀请已发送';
  				this.account = '';
  				this.showTeacherInfo = false;
  				this.getClassTeacherList();
  			} else {
  				alert(data.info);
  			}
  		}
  	)
  }

  // 获取班级教师
  getClassTeacherList(){
  	this.http.getClassTeacherList(this.cid,this.page,this.size).subscribe(
  		data =>{
  			if(!data.status){
  				this.teacherList = data.teacherList;
  				this.count = data.count;
  				for(let i=0;i<this.teacherList.length; i++){
  					if(this.teacherList[i]['tid']===this.tid){
  						this.isAgree = this.teacherList[i]['isAgree'];
  						this.isShow = this.teacherList[i]['isShow'];
  						this.isCheck = this.teacherList[i]['isCheck'];
  						this.isOwner = this.teacherList[i]['isOwner'];
  						return;
  					}
  				}
  			} else {
  				alert(data.info);
  			}
  		}
  	)
  }

  // 转让
  attorn(tid){
  	let obj={
  		"cid":this.cid,
  		"tid":tid
  	};
  	if(this.isOwner){
  		this.http.classOwnerUpdate(obj).subscribe(
  			data =>{
  				if(!data.status){
  					this.getClassTeacherList();
  				} else {
  					alert(data.info);
  				}
  			}
  		)
  	}else{
  		alert('您无权限执行该操作');
  		return;
  	}
  }
  // 踢出
  kickOut(tid){
  	let obj={
  		"cid":this.cid,
  		"tid":tid
  	};
  	if(this.isOwner){
	  	this.http.managementTeacher(this.cid,tid).subscribe(
	  		data =>{
	  			if(!data.status){
	  				this.getClassTeacherList();
	  			} else {
	  				alert(data.info);
	  			}
	  		}
	  	)
  	}else{
  		alert('您无权限执行该操作');
  		return;
  	}
  }
  // 退出
  quit(tid){
  	let obj={
  		"cid":this.cid,
  		"tid":tid
  	};
  	this.http.managementTeacher(this.cid,tid).subscribe(
  		data =>{
  			if(!data.status){
  				this.getClassTeacherList();
  			} else {
  				alert(data.info);
  			}
  		}
  	)
  }


  // 布置作业可见设置
  changeShowWorkType(){
  	let obj ={
  		"cid":this.cid
  	}
  	if(this.isShow===1){
  		obj['isShow'] = 0;
  	} else {
  		obj['isShow'] = 1;
  	}
  	this.http.classTeacherPowerSet(obj).subscribe(
  		data =>{
  			if(!data.status){
	  		  this.isShow = obj['isShow'];
  			} else{
  				alert(data.info)
  			}
  		}
  	)
  }

}
