import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WechatService } from './wechat.service';
import { teacherInfo } from '../home.model'
import * as qrcode from 'qrcode-generator'

@Component({
  selector: 'app-wechat',
  templateUrl: './wechat.component.html',
  styleUrls: ['./wechat.component.less']
})
export class WechatComponent implements OnInit {
	teacherInfo:teacherInfo
	teacherName:string
	tid: number
	uid: number
	wexinList = []
	count: number;
	qrcodeImg: string = 'http://www.maixuexi.cn/images/me_logo_03.png'
  constructor(
  	private http: WechatService,
  	private Route: ActivatedRoute,
  	private Router: Router
  ) { }

  ngOnInit() {
  	this.teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));
  	this.tid = this.teacherInfo.tid;
  	this.uid = this.teacherInfo.userId;
  	this.getWxList();
  }

 	//获取微信绑定列表
 	getWxList(){
 		this.http.getWxList().subscribe(
 			data =>{
 				if(!data.status){
 					this.count = data.count;
 					this.wexinList = data.wxList;
 					for(let i = 0; i < this.wexinList.length ;i++){
 						if(this.wexinList[i]['url']){
						  let typeNumber = 12;  //键入数字（1〜40），或者0表示自动检测。
						  let errorCorrectionLevel = 'L'; //纠错等级（'L'，'M'，'Q'，'H'）
						  let qr = qrcode(typeNumber, errorCorrectionLevel);
						  let url = this.wexinList[i]['url'];
						  qr.addData( url );
						  qr.make();
						  let cellSize = 2;
						  let margin = 2;
						  this.wexinList[i]['qrcodeImg'] = qr.createImgTag(cellSize, margin); //default: 2
 						}
 					}
 					// console.log(this.wexinList);
 				} else {
 					alert(data.info);
 				}
 			}
 		)
 	} 

  // let typeNumber = 0;  //键入数字（1〜40），或者0表示自动检测。
  // let errorCorrectionLevel = 'H'; //纠错等级（'L'，'M'，'Q'，'H'）
  // let qr = qrcode(typeNumber, errorCorrectionLevel);
  // let url = this.shareAddress;
  // qr.addData( url );
  // qr.make();
  // let cellSize = 4;
  // let margin = 8;
  // this.qrcodeImg = qr.createImgTag(cellSize, margin); //default: 2

 	addQrcode(){
 		this.http.createWxQrcode({}).subscribe(
 			data =>{
 				this.getWxList();
 			}
 		)
 	}

 	delete(i){
		let id = this.wexinList[i]['id'];
 		this.http.deleteWx(id).subscribe(
 			data =>{
 				if(!data.status){
 					this.getWxList();
 				}
 			}
 		)
 	}
 	remove(i){
 		let obj = {
 			"id": this.wexinList[i]['id']
 		}
 		this.http.removeWx(obj).subscribe(
 			data =>{
 				if(!data.status){
 					this.getWxList();
 				}
 			}
 		)
 	}

  // 返回
  return(){
  	this.Router.navigate(['my/home']);
  }
}
