import {
  Http,
  Headers,
  Request,
  Response,
  RequestOptions,
  RequestOptionsArgs,
  ConnectionBackend
} from '@angular/http'
import { Observable } from 'rxjs/Observable'
import { Injectable } from '@angular/core'
// Operators
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';
// import 'rxjs/add/operator/debounceTime';
// import 'rxjs/add/operator/distinctUntilChanged';
// import 'rxjs/add/operator/switchMap';
// import 'rxjs/add/operator/toPromise';

// import { environment } from '../environments/environment'
import { teacherInfo } from './home/home.model'

@Injectable()
export class HttpProvideService extends Http {
  publicInfo: string
  constructor(
    private backend: ConnectionBackend, 
    private defaultOptions: RequestOptions
  ) {
    super(backend, defaultOptions);
  }

  request(req: string | Request | any, options ? : RequestOptionsArgs): Observable < Response > {
    let headers = req.headers || new Headers()
    let teacherInfo = < teacherInfo > JSON.parse(localStorage.getItem('teacherInfo'))
    let token: string

    if (teacherInfo) {
      token = teacherInfo.token;
    }

    if (!headers.get('Content-Type')) {
      headers.append('Content-Type', 'application/json; charset=utf-8');
    }
    req.headers = headers;

    if (req.url.indexOf('http') !== 0) {
      // req.url = environment.apiHost + req.url;
      req.url = 'http://115.29.177.200:8080/' + req.url;
    }

    if (req.url.indexOf('/login') === -1 && req.url.indexOf('image/code') === -1 && req.url.indexOf('school/public/info') === -1 && req.url.indexOf('get/group/answer/img') === -1 && req.url.indexOf('weixin/share/img/get') === -1) {
      if (req.url.indexOf('?') === -1) {
        req.url += '?token=' + token;
      } else {
        req.url += '&token=' + token;
      }
    }

    return super.request(req, options)
      .map(this.extractData)
      .catch(this.handleError)
  }

  post(url: string, body: string, options ? : RequestOptionsArgs): Observable < Response > {
    body = JSON.stringify(body)
    return super.post(url, body, options)
  }

  put(url: string, body: string, options ? : RequestOptionsArgs): Observable < Response > {
    body = JSON.stringify(body)
    return super.put(url, body, options)
  }

  private extractData(res: Response) {
    let body = res.json();

    if (body.status) {
      if (body.status === 11 || body.status === 12) {
        // token失效
        let mobile = !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/); //判断是否手机终端
        window.localStorage.removeItem('teacherInfo');
        if (mobile) {
          window.location.hash = '#/login';
        } else {
          window.location.href = 'http://www.maixuexi.cn/teacher';
        }
      } else {
        // console.log('kk');
        if(body.info == undefined || !body.info){

        } else {
          alert(body.info)
        }
        // this.publicInfo = body.info;
        // console.log(this.publicInfo);
      }
    } else {
      body = body.data;
    }
    return body;
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    alert('服务器维护中，请稍后重试！')
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
