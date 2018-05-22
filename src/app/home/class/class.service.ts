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
export class ClassService {
  private options: RequestOptions;
  constructor(
  	private http: Http
  ) { }

  // 获取班级列表
  // 3.20.1 获取教师的所有已加入班级列表接口
  getTeacherClassList(tid:number,page:number,size:number):Observable<any>{
  	this.options = new RequestOptions({
  		search: new URLSearchParams(`tid=${tid}&page=${page}&size=${size}`)
  	})
  	return this.http.get('teacher/class/list',this.options)
  	.map(this.extractData)
  }

  // 搜索班级3.21 教师通过班级名字搜索班级接口
  searchTeacherClass(obj:Object):Observable<any>{
  	return this.http.put(`teacher/class/search`,obj)
  	.map(this.extractData)
  }

  // 获取班级信息3.1 查询指定班级详细信息接口
	// /mstudy/class/info?cid=[cid]&token=[token]
	getClassInfo(cid:number):Observable<any>{
		this.options = new RequestOptions({
			search: new URLSearchParams(`cid=${cid}`)
		})
		return this.http.get(`class/info`,this.options)
		.map(this.extractData)
	}

  // 查询公共班级邀请记录
  // 3.20.2 获取教师的所有被邀请待处理班级列表接口
  getTeacherClassPendingList(tid:number,page:number,size:number):Observable<any>{
  	this.options = new RequestOptions({
  		search: new URLSearchParams(`tid=${tid}&page=${page}&size=${size}`)
  	})
  	return this.http.get('teacher/class/pending',this.options)
  	.map(this.extractData)
  }

  // 创建班级3.2 初始化一个班级接口
  createClass(obj:Object):Observable<any>{
  	return this.http.post(`class`,obj)
  	.map(this.extractData)
  }

  // 更新班级
  updateClass(obj:Object):Observable<any>{
  	return this.http.put(`class`,obj)
  	.map(this.extractData)
  }

  // 查询班级学生3.10 查询指定班级所有正常用户列表接口
  getClassStudentList(cid:number,page:number,size:number):Observable<any>{
  	this.options = new RequestOptions({
  		search: new URLSearchParams(`cid=${cid}&page=${page}&size=${size}`)
  	})
  	return this.http.get(`class/student/list`,this.options)
  	.map(this.extractData)
	}	

	// 3.11 根据姓名搜索指定班级的班级学生接口
	searchClassStudent(obj:Object):Observable<any>{
		return this.http.put(`class/student/search`,obj)
		.map(this.extractData)
	}

	// 3.13 修改班级学生信息接口
	updateStudentRemarkName(obj:Object):Observable<any>{
		return this.http.put(`class/student`,obj)
		.map(this.extractData)
	}

	// 3.14 班级黑名单学生管理接口
	classStudentManagement(obj:Object):Observable<any>{
		return this.http.put(`class/student/blackList`,obj)
		.map(this.extractData)
	}

	// 3.15 班级黑名单学生列表查询接口
	classStudentBlankList(cid:number,page:number,size:number):Observable<any>{
		this.options = new RequestOptions({
			search: new URLSearchParams(`cid=${cid}&page=${page}&size=${size}`)
		})
		return this.http.get(`class/student/blackList`,this.options)
		.map(this.extractData)
	}

  // 查询班级助教
  // 3.24 查询班级教师的助教信息接口
  getClassTutorList(cid:number,tid:number):Observable<any>{
  	this.options = new RequestOptions({
  		search: new URLSearchParams(`cid=${cid}&tid=${tid}`)
  	})
  	return this.http.get(`class/teacher/tutor`,this.options)
  	.map(this.extractData)
  }
  // 3.25 生成班级助教二维码接口
  createTutor(obj:Object):Observable<any>{
		return this.http.post(`class/tutor`,obj)
		.map(this.extractData)
	}
	// 3.27 解除用户班级助教身份接口
	removeClassTutor(obj:Object):Observable<any>{
		return this.http.put(`class/tutor/remove`,obj)
		.map(this.extractData)
	}
	// 3.28 删除班级助教数据接口
	deleteClassTutor(tutorId:Object):Observable<any>{
		this.options = new RequestOptions({
			"body":{
				"tutorId":tutorId
			}
		})
		return this.http.delete(`class/tutor`,this.options)
		.map(this.extractData)
	}
  // 查询班级作业记录

  // 查询班级教师3.16 查询班级教师列表接口
  getClassTeacherList(cid:number,page:number,size:number):Observable<any>{
		this.options = new RequestOptions({
			search: new URLSearchParams(`cid=${cid}&page=${page}&size=${size}`)
		})
		return this.http.get(`class/teacher/list`,this.options)
		.map(this.extractData)
	}

	// 3.16.1 根据教师账号搜索教师信息接口
	searchClassTeacher(obj:Object):Observable<any>{
		return this.http.put(`teacher/info`,obj)
		.map(this.extractData)
	}

	// 3.17 邀请教师加入班级接口
	inviteTeacher(obj:Object):Observable<any>{
		return this.http.put(`class/teacher/invite`,obj)
		.map(this.extractData)
	}

	// 3.18 被邀请教师同意/拒绝邀请操作接口
	teacherReply(obj:Object):Observable<any>{
		return this.http.put(`class/teacher/reply`,obj)
		.map(this.extractData)
	}
	// 3.18.1 权限设置班级教师删除接口
	managementTeacher(cid:number,tid:number):Observable<any>{
		this.options = new RequestOptions({
			"body":{
				"cid":cid,
				"tid":tid
			}
		})
		return this.http.delete(`class/teacher/delete`,this.options)
		.map(this.extractData)
	}

	// 3.22 班级拥有权限转给指定教师接口
	classOwnerUpdate(obj:Object):Observable<any>{
		return this.http.put(`class/teacher/owner`,obj)
		.map(this.extractData)
	}

	// 3.23 班级教师权限设置接口
	classTeacherPowerSet(obj:Object):Observable<any>{
		return this.http.put(`class/teacher/set`,obj)
		.map(this.extractData)
	}
  // 查询班级题库

  // 开通、关闭班级题库

  // 更新班级题库

  // 5.2  查询班级作业列表接口
  getClassWorkList(cid:number,page:number,size:number):Observable<any>{
  	this.options = new RequestOptions({
  		search: new URLSearchParams(`cid=${cid}&page=${page}&size=${size}`)
  	})
  	return this.http.get(`work/class/list`,this.options)
  	.map(this.extractData)
  }

  // 5.4 根据作业名搜索教师作业列表接口
  public searchClassWork(obj:Object,page:number,size:number):Observable<any>{
  	this.options = new RequestOptions({
  		search: new URLSearchParams(`page=${page}&size=${size}`)
  	})
  	return this.http.put(`work/teacher/name`,obj,this.options)
  	.map(this.extractData)
  }

  // 8.3 获取指定的作业作答情况基本信息接口
  getWorkAnswerResult(workId:number):Observable<any>{
  	this.options = new RequestOptions({
  		search:new URLSearchParams(`workId=${workId}`)
  	})
  	return this.http.get(`work/statistics`,this.options)
  	.map(this.extractData)
  }
  // 获取指定作业排名信息8.1 获取指定的作业用户排名基本信息接口
  // work/rank?workId=[workId]&type=[type]&page=[]&size=[]
  getWorkRankInfo(workId:number,type:number,page:number,size:number):Observable<any>{
  	this.options = new RequestOptions({
  		search: new URLSearchParams(`workId=${workId}&type=${type}&page=${page}&size=${size}`)
  	})
  	return this.http.get(`work/rank`,this.options)
  }

  // 8.2 获取指定的作业相关题目答题统计信息接口
  // work/question/answer?workId=[workId]
  getWorkQuestionAnswerInfo(workId:number):Observable<any>{
  	this.options = new RequestOptions({
  		search: new URLSearchParams(`workId=${workId}`)
  	})
  	return this.http.get(`work/question/answer`,this.options)
  	.map(this.extractData)
  }

  // 7.6 班级作业批改完成接口(大保存)work/correct/finish?
//   {
//     "workId":1,
//     "sendAll":1是否给全体人员发送通知：1-是；2-否；该参数为选填，不填则给全体人员发送
// }
	correctDone(obj:Object):Observable<any>{
		return this.http.put(`work/correct/finish`,obj)
		.map(this.extractData)
	}

	// 8.5 获取学生指定班级中的统计报告接口
	// student/class/report?studentId=[studentId]&cid=[cid]&token=[token]
	getStudentClassReport(studentId:number,cid:number):Observable<any>{
		this.options=new RequestOptions({
			search: new URLSearchParams(`studentId=${studentId}&cid=${cid}`)
		})
		return this.http.get(`student/class/report`,this.options)
		.map(this.extractData)
	}
	// 8.4 获取学生在班级中最近数次得分统计接口
	// /mstudy/student/class/score?studentId=[studentId]&cid=[cid]&number=[number]&token=[token]
	getStudentClassScore(studentId:number,cid:number,number:number):Observable<any>{
		this.options=new RequestOptions({
			search: new URLSearchParams(`studentId=${studentId}&cid=${cid}&number=${number}`)
		})
		return this.http.get(`student/class/score`,this.options)
		.map(this.extractData)
	}

	// 5.13 获取班级的用户已完成作业列表接口
	// /mstudy/work/class/student/finish?cid=[cid]&studentId=[studentId]&page=[page]&size=[size]&token=[token]
	getStudentClassFinishWork(cid:number,studentId:number,page:number,size:number):Observable<any>{
		this.options=new RequestOptions({
			search: new URLSearchParams(`cid=${cid}&studentId=${studentId}&page=${page}&size=${size}`)
		})
		return this.http.get(`work/class/student/finish`,this.options)
		.map(this.extractData)
	}
	// /mstudy/student/class/work/report?studentId=[studentId]&workId=[workId]&token=[token]
	// 8.6 获取学生指定班级指定作业详细统计接口
	getStudentClassWorkReport(studentId:number,workId:number):Observable<any>{
		this.options=new RequestOptions({
			search: new URLSearchParams(`studentId=${studentId}&workId=${workId}`)
		})
		return this.http.get(`student/class/work/report`,this.options)
		.map(this.extractData)
	}


  private extractData(res: Response) {
    return res;
  }

}
