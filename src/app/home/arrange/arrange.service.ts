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
export class ArrangeService {
  private options: RequestOptions;
  constructor(
  	private http: Http
  ) { }

  // 3.10 查询指定班级所有正常用户列表接口
  getClassStudentList(cid:number,page:number,size:number):Observable<any>{
  	this.options = new RequestOptions({
  		search: new URLSearchParams(`cid=${cid}&page=${page}&size=${size}`)
  	})
  	return this.http.get(`class/student/list`,this.options)
  	.map(this.extractData)
  }

  // 3.20.1 获取教师的所有已加入班级列表接口
  getTeacherClassList(tid:number,page:number,size:number):Observable<any>{
  	this.options = new RequestOptions({
  		search: new URLSearchParams(`tid=${tid}&page=${page}&size=${size}`)
  	})
  	return this.http.get(`teacher/class/list`,this.options)
  	.map(this.extractData)
  }

  // 布置作业5.1 教师布置一份作业接口
  publishAssignments(obj:Object):Observable<any>{
  	return this.http.post(`work`,obj)
  	.map(this.extractData)
  }
  
  // 5.7 修改班级作业接口
  // 5.8 教师获取班级作业详情接口

  // 4.13 查询教师的试卷列表接口
  // test/paper/teacher?page=[page]&size=[size]&token=[token]
  getTeacherPaperList(page:number,size:number):Observable<any>{
    this.options = new RequestOptions({
      search: new URLSearchParams(`page=${page}&size=${size}`)
    })
    return this.http.get(`test/paper/teacher`,this.options)
    .map(this.extractData)
  }

  // 4.14 根据试卷名称搜索教师试卷接口
  searchTeacherPaper(obj:Object,page:number,size:number):Observable<any>{
    this.options = new RequestOptions({
      search: new URLSearchParams(`page=${page}&size=${size}`)
    })
    return this.http.put('test/paper/search',obj,this.options)
    .map(this.extractData);
  }

  private extractData(res: Response) {
    return res;
  }
}
