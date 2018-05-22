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
export class HomeService {
  private options: RequestOptions;
  constructor(
  	private http: Http
  ) { }

  // 更新教师名字
  updateTeacherInfo(obj:Object):Observable<any>{
  	return this.http.put(`teacher`,obj)
  	.map(this.extractData)
  	// .map(this.handleError)
  }

  // 验证账户密码
  validatePassword(obj:Object):Observable<any>{
  	return this.http.post(`user/confirmation`,obj)
  	.map(this.extractData)
  }
  // 账号唯一
  validateUserOnly(obj:Object):Observable<any>{
  	return this.http.put(`user/only`,obj)
  	.map(this.extractData)
  }
  // 用户名修改接口
  updateAccount(obj:Object):Observable<any>{
  	return this.http.put(`modify/account`,obj)
  	.map(this.extractData)
  }
  // 生成邮箱验证码
  createEmailCaptcha(obj:Object):Observable<any>{
  	return this.http.post(`email/captcha/create`,obj)
  	.map(this.extractData)
  }
  // 邮箱修改接口
  updateEmail(obj:Object):Observable<any>{
  	return this.http.put(`modify/email`,obj)
  	.map(this.extractData)
  }
  // 生成短信验证码接口
  createMessageCaptcha(obj:Object):Observable<any>{
    return this.http.post(`captcha/create`,obj)
    .map(this.extractData)
  }
  // 手机号修改接口
  updatePhone(obj:Object):Observable<any>{
    return this.http.put(`modify/phone`,obj)
    .map(this.extractData)
  }
  // 手机号修改接口
  updatePassword(obj:Object):Observable<any>{
    return this.http.put(`changePassword`,obj)
    .map(this.extractData)
  }

  private extractData(res: Response) {
    return res;
  }
  // private handleError(error: Response | any) {
  //   let errMsg: string;
  //   if (error instanceof Response) {
  //     const body = error.json() || '';
  //     const err = body.error || JSON.stringify(body);
  //     errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  //   } else {
  //     errMsg = error.message ? error.message : error.toString();
  //   }
  //   return Observable.throw(errMsg);
  // }
}
