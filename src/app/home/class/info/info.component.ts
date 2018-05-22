import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ClassService } from '../class.service';
import { teacherInfo } from '../../home.model'
import { classInfo } from '../class.model'
import * as qrcode from 'qrcode-generator'

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit {
	navType: number=6 //1-班级学生；2-班级教师；3-班级作业；4班级题库；5-班级助教；6-班级信息；
	teacherInfo:teacherInfo
	tid: number
	cid: number
	classInfo: classInfo
  maxNumber: number
  userNumber: number
  type: number
  className: string
  qrcodeImg: string
  photo: string
  remarkName: string
  constructor(
  	private http: ClassService,
  	private Route: ActivatedRoute,
  	private Router: Router
  ) { }
  ngOnInit() {
  	this.teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));
  	this.tid = this.teacherInfo.tid;
  	this.cid = +this.Route.snapshot.params['cid'];
  	// console.log(cid,typeof(cid));
    // let cid = this.cid;
  	this.getClassInfo();
    this.getQrcode();
  }

  // 获取班级信息
  getClassInfo(){
  	this.http.getClassInfo(this.cid).subscribe(
  		data =>{
  			if(!data.status){
  				this.classInfo = data;
          this.className = data.className;
          this.maxNumber = data.maxNumber;
          this.userNumber = data.userNumber;
          this.photo = data.photo;
          this.remarkName = data.remarkName;
          // this.type = data.type; 
          if(data.ownerTid === this.tid){
            this.type = 2;
          } else {
            this.type = 1;
          }
          // console.log(this.classInfo);
  			} else {
  				alert(data.info);
  			}
  		}
  	)
  }

  // 获取二维码
  getQrcode(){
    // 地址为群二维码地址http://t.cn/RRZfn1e
    let typeNumber = 0;  //键入数字（1〜40），或者0表示自动检测。
    let errorCorrectionLevel = 'H'; //纠错等级（'L'，'M'，'Q'，'H'）
    let qr = qrcode(typeNumber, errorCorrectionLevel);
    let url = 'http://www.maixuexi.cn/student/#/my/joinclass/info/' + this.cid;
    qr.addData( url );
    qr.make();
    let cellSize = 4;
    let margin = 8;
    this.qrcodeImg = qr.createImgTag(cellSize, margin); //default: 2
  }

  updateClassInfo(){
    this.Router.navigate(['my/class/create/'+this.cid]);
  }

}
