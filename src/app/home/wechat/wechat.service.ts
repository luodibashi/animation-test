import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { 
	Http, 
	Response, 
	RequestOptions, 
	URLSearchParams 
} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class WechatService {
  private options: RequestOptions;
  constructor(
  	private http: Http
  ) { }

  // 微信绑定查询接口
  getWxList():Observable<any>{
    return this.http.get(`personal/wx/qcCode/list`)
    .map(this.extractData)
  }
  // 个人账号待绑定微信二维码生成接口
  createWxQrcode(obj:Object):Observable<any>{
    return this.http.post(`personal/wx/qcCode`,obj)
    .map(this.extractData)
  }
  // 删除二维码
  deleteWx(id:number):Observable<any>{
    this.options = new RequestOptions({
      "body": { "id": id }
    })
  	return this.http.delete(`personal/wx/qcCode/delete`,this.options)
  	.map(this.extractData)
  }
  // 解除绑定
  removeWx(obj:Object):Observable<any>{
  	return this.http.put(`personal/wx/unbound`,obj)
  	.map(this.extractData)
  }


  private extractData(res: Response) {
    return res;
  }

}
