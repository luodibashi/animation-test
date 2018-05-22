import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { teacherInfo, LoginInfo } from './account.model';
import { 
	Http, 
	Response, 
	RequestOptions, 
	URLSearchParams 
} from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AccountService {
  private options: RequestOptions;
  constructor(
  	private http: Http
  ) { }

  // 获取验证码
  public captcha(w = 100, h = 40): Observable < any > {
  this.options = new RequestOptions({
    search: new URLSearchParams(`w=${w}&h=${h}`)
  })
  return this.http.get(`image/code`, this.options)
    .map(this.extractData)
    .catch(this.handleError)
  }

  // 获取机构信息
  getSchoolInfo(sid:number):Observable<any>{
    this.options = new RequestOptions({
      search: new URLSearchParams(`sid=${sid}`)
    })
    return this.http.get(`school/public/info`,this.options)
    .map(this.extractData)
    .catch(this.handleError)
  }

  // 第一步登录接口
  loginFirst(obj:Object):Observable<any>{
    return this.http.post(`login`,obj)
    .map(this.extractData)
    .catch(this.handleError)
  }
  // 第二步完成登录
  loginDone(obj:Object):Observable<any>{
    return this.http.post(`login/in`,obj)
    .map(this.extractData)
    .catch(this.handleError)
  }
  // 微信登录接口
  wxLogin(obj: Object): Observable < any > {
    return this.http.post(`login/wx/code`, obj)
    .map(this.extractData)
    .catch(this.handleError)
  }

  // 微信绑定接口
  wxBingLogin(obj:Object):Observable<any>{
    return this.http.post(`personal/wx/binding`,obj)
    .map(this.extractData)
  }

  private extractData(res: Response) {
    return res;
  }
  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }

}
