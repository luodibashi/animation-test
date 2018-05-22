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
export class TeachertagService {
  private options: RequestOptions;
  constructor(
  	private http: Http
  ) { }

  // 教师阶段年级标签列表查询
  getTeacherTagList(tid:number):Observable<any>{
  	this.options = new RequestOptions({
  		search: new URLSearchParams(`tid=${tid}`)
  	})
  	return this.http.get(`tag/teacher`,this.options)
  	.map(this.extractData)
  }

  // 获取科目列表
  getSubjectTagList(tagType: number):Observable<any>{
  	this.options = new RequestOptions({
  		search: new URLSearchParams(`tagType=${tagType}`)
  	})
  	return this.http.get(`tag/public`,this.options)
  }

  // 获取阶段年级列表
  getStageTagList(obj:Object):Observable<any>{
  	return this.http.get(`tag/public/stage/grade`,obj)
  }

  // 教师标签新增
  addTeacherTag(obj:Object):Observable<any>{
  	return this.http.post(`tag/teacher`,obj)
  	.map(this.extractData)
  }

  // 教师标签删除
  deleteTeacherTag(obj:Object):Observable<any>{
  	this.options = new RequestOptions({
  		"body":{
  			"id":obj
  		}
  	})
  	return this.http.delete(`tag/teacher`,this.options)
  	.map(this.extractData)
  }

  private extractData(res: Response) {
    return res;
  }
}
