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
export class WorkService {
  private options: RequestOptions;
  constructor(
  	private http: Http
  ) { }

  // 获取作业列表5.3 查询教师作业列表接口
  getTeacherWorkList(tid:number,startTime:string,endTime:string,page:number,size:number):Observable<any>{
  	this.options = new RequestOptions({
  		search:new URLSearchParams(`tid=${tid}&startTime=${startTime}&endTime=${endTime}&page=${page}&size=${size}`)
  	})
  	return this.http.get(`work/teacher/list`,this.options)
  	.map(this.extractData);
  }

  // 获取教师待批改作业列表
  getWaitingCorrectionWorkList(obj:Object):Observable<any>{
    return this.http.put(`teacher/work/to/be/corrected`,obj)
    .map(this.extractData);
  }

  // 、7.1 班级作业批改基础信息查询接口
  getClassWorkCorrectBaseInfo(workId:number):Observable<any>{
    this.options = new RequestOptions({
      search: new URLSearchParams(`workId=${workId}`)
    })
    return this.http.get(`correct/base`,this.options)
    .map(this.extractData)
  }
  // 4.10  试卷预览接口test/paper/preview?pid=[pid]&token=[token]
  getPaperPreview(pid:number):Observable<any>{
    this.options = new RequestOptions({
      search:new URLSearchParams(`pid=${pid}`)
    })
    return this.http.get(`test/paper/preview`,this.options)
    .map(this.extractData)
  }

  // 获取试题基本信息

  // 7.1.1 班级作业学生基础信息查询接口
  getWorkStudentBaseInfo(workId:number,qid:number):Observable<any>{
    this.options = new RequestOptions({
      search: new URLSearchParams(`workId=${workId}&qid=${qid}`)
    })
    return this.http.get(`correct/base/student`,this.options)
    .map(this.extractData)
  }

  // 7.2 批改媒体文件上传接口


  // 7.8  主观题小题批改提交接口
  correctStudentAnswer(obj:Object):Observable<any>{
    return this.http.put(`answer/correct/crosshead`,obj)
    .map(this.extractData)
  }
  // 6.5 查询指定用户指定作业指定试题的答题及批改记录接口
  getStudentWorkQuestionAnswer(studentId:number,workId:number,qid:number):Observable<any>{
    this.options = new RequestOptions({
      search: new URLSearchParams(`studentId=${studentId}&workId=${workId}&qid=${qid}`)
    })
    return this.http.get(`answer`,this.options)
    .map(this.extractData)
  }

  // 10.2.1 获取微信JS-SDK权限验证配置config接口
  getWeixinConfig(obj:Object):Observable<any>{
    return this.http.post(`wx/config`,obj)
    .map(this.extractData)
  }

  // 10.2.8 持久化存储微信多媒体文件
  wxMultimediaStorage(obj:Object):Observable<any>{
    return this.http.post(`wx/multimedia/storage`,obj)
    .map(this.extractData)
  }

  private extractData(res: Response) {
    return res;
  }
}
