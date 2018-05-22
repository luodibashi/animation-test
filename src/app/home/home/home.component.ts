import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { ActivatedRoute, Router, Params } from '@angular/router'
import { teacherInfo } from '../home.model'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
	teacherInfo: teacherInfo
  constructor(
  	private http: HomeService,
  	private Router: Router,
  	private Route: ActivatedRoute
 	) { }

  ngOnInit() {
		this.teacherInfo = JSON.parse(window.localStorage.getItem('teacherInfo'));
  	// console.log(this.teacherInfo);
    // test
    // let url = 'http://www.maixuexi.cn/phone/?code=003tHEnY1GTVDT0ZHFoY1pCmnY1tHEnl&state=TeacherWeChatLogin&appid=wxf305ea0876e9955e';
    // console.log(url.indexOf('&appid='));
    // console.log(url.match(/appid=(\S*)#/));
    // console.log(url.substr(url.indexOf('&appid='),-1));
    // console.log(url.split('&appid='));
    // console.log(url.split('&appid=')[1])
  }

  // 已布置作业列表
  gotoWorkList(){
    // let tid = Number(this.teacherInfo.tid);
    // if(tid === 100000){
    //   this.Router.navigate(['my/work/list']);
    // } else {
    //   alert('功能升级中');
    // }
    this.Router.navigate(['my/work/list']);
  }

  // 我的班级
  gotoMyClass(){
    // let tid = Number(this.teacherInfo.tid);
    // if(tid === 100000){
    //   this.Router.navigate(['my/class/list']);
    // } else {
    //   alert('功能升级中');
    // }
    this.Router.navigate(['my/class/list']);
    // alert('功能升级中');
  }

  // 个人中心
  gotoPersonal(){
  	this.Router.navigate(['my/personal']);
  }

  // 微信中心
  gotoWechat(){
    this.Router.navigate(['my/wx']);
  }
  // 布置作业
  gotoArrange(){
    this.Router.navigate(['my/arrange']);
  }

  // 待批改作业中心
  gotoWaitCorrection(){
    this.Router.navigate(['my/work/correct/waiting']);
  }

}
