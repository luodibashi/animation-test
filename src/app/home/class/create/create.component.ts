import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ClassService } from '../class.service';
import { teacherInfo } from '../../home.model'
import * as qrcode from 'qrcode-generator'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.less']
})
export class CreateComponent implements OnInit {
	titleName:string = '创建班级'
	teacherInfo:teacherInfo
	tid: number
	cid: number
	className: string
	maxUserNumber: number
	password: number
	message: string
	pageType: number //1-创建；2-更新；
  constructor(
  	private http: ClassService,
  	private Route: ActivatedRoute,
  	private Router: Router
  ) { }

  ngOnInit() {
  	this.teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));
  	this.tid = this.teacherInfo.tid;
  	this.cid = this.Route.snapshot.params['cid']
  	// console.log(this.cid);
  	if(Number(this.cid)===99999){
  		// 创建
  		this.pageType = 1;
  	} else {
  		// 更新
  		this.titleName = '更新班级';
  		this.pageType = 2;
      this.getClassInfo();
  	}
  }

  // 获取班级信息
  getClassInfo(){
    this.http.getClassInfo(this.cid).subscribe(
      data =>{
        if(!data.status){
          this.className = data.className;
          this.maxUserNumber = data.maxNumber;
          this.message = data.remarkName;
          this.password = data.password;
          // this.type = data.type; 
          // console.log(this.classInfo);
        } else {
          alert(data.info);
        }
      }
    )
  }

  validMaxNumber(){
  	if(isNaN(this.maxUserNumber)){
  		// 非数字
  		alert('请输入数字，范围为0-200');
			this.maxUserNumber = null;
  		return;
  	} else {
  		if(this.maxUserNumber>200||this.maxUserNumber<1){
  			alert('请输入合法的数字，范围为0-200');
  			this.maxUserNumber = null;
  			return;
  		}
  	}
  }
  validPassword(){
  	if(isNaN(this.password)){
  		// 非数字
  		alert('密码输入范围为0-200');
			this.password = null;
  		return;
  	} else {
  		if(String(this.password).length>8||String(this.password).length<6){
  			alert('请输入合法的密码，范围为6-8位数字');
  			this.password = null;
  			return;
  		}
  	}
  }

  createCancel(){
  	if(this.pageType ===1){
			this.Router.navigate(['my/class/list']);
  	} else if(this.pageType === 2){
			this.Router.navigate(['my/class/info'+this.cid]);
  	}
  }

  createClass(){
  	if(!this.className||!this.maxUserNumber){
  		alert('请输入完整信息');
  		return;
  	}
  	let obj = {
	    "createTid":this.tid,
	    "className":this.className,
	    "maxNumber":this.maxUserNumber,
	    "password":this.password,
	    "remarkName":this.message,
	    "classType":1
		}
		// console.log(obj);
		this.http.createClass(obj).subscribe(
			data =>{
				if(!data.status){
					alert('创建成功');
					this.Router.navigate(['my/class/list']);
				} else {
					alert(data.info);
				}
			}
		)
  }

  // 更新班级信息
  updateClass(){
    if(!this.className||!this.maxUserNumber){
      alert('请输入完整信息');
      return;
    }
    let obj = {
      "cid":this.cid,
      "className":this.className,
      "maxNumber":this.maxUserNumber,
      "password":this.password,
      "remarkName":this.message
    }
    // console.log(obj);
    this.http.updateClass(obj).subscribe(
      data =>{
        if(!data.status){
          alert('更新成功');
          this.Router.navigate(['my/class/info/'+this.cid]);
        } else {
          alert(data.info);
        }
      }
    )
  }

    // 返回
  return(){
		this.Router.navigate(['my/class/list']);
  }

}
