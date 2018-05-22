import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { TeachertagService } from './teachertag.service';
import { teacherInfo } from '../home.model'

@Component({
  selector: 'app-teachertag',
  templateUrl: './teachertag.component.html',
  styleUrls: ['./teachertag.component.less']
})
export class TeachertagComponent implements OnInit {
	teacherInfo:teacherInfo
	teacherName:string
	tid: number
	uid: number
  count: number
  teacherTagList = []
  stageList = []
  subjectList = []
  editType: number //1-阶段年级；2-科目
  publicStageList = []
  publicSubjectList = []
  selectedTag: number
  selectedTags = []
  constructor(
  	private http: TeachertagService,
  	private Route: ActivatedRoute,
  	private Router: Router
  ) { }

  ngOnInit() {
  	this.teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));
  	this.tid = this.teacherInfo.tid;
  	this.uid = this.teacherInfo.userId;
    this.getTeacherTagList();
  }

  // 返回
  return(){
  	this.Router.navigate(['my/home']);
  }

  // 获取教师标签集合
  getTeacherTagList(){
    // 先置为空
    this.subjectList = [];
    this.stageList = [];
    this.http.getTeacherTagList(this.tid).subscribe(
      data =>{
        if(!data.status){
          this.teacherTagList = data.tagList;
          this.count = data.count;
          if(this.count){
            for(let i = 0; i < this.teacherTagList.length;i++){
              // 1-阶段；2-年级；3-课程；
              if(this.teacherTagList[i]['tagType']===3){
                this.subjectList.push(this.teacherTagList[i]);
              } else if(this.teacherTagList[i]['tagType']===1){
                this.stageList.push(this.teacherTagList[i]);
              }
            }
          } else {
            this.subjectList = [];
            this.stageList = [];
          }
          // console.log(this.subjectList);
          // console.log(this.stageList);
        } else {
          alert(data.info);
        }
      }
    )
  }

  // 获取教学阶段标签
  addStage(){
    this.editType = 1;
    this.http.getStageTagList({}).subscribe(
      data =>{
        if(!data.status){
          this.publicStageList = data.stageList;
          for(let i = 0; i < this.stageList.length; i++){
            for(let m = 0; m < this.publicStageList.length; m++){
              if(this.stageList[i]['tagId']===this.publicStageList[m]['tagId']){
                // 如果阶段存在，需要标记子集
                for(let q = 0; q<this.stageList[i]['childList'].length; q++){
                  for(let n = 0; n<this.publicStageList[m]['gradeList'].length; n++){
                    if(this.stageList[i]['childList'][q]['tagId']===this.publicStageList[m]['gradeList'][n]['tagId']){
                      this.publicStageList[m]['gradeList'][n]['isChoose'] = 1;
                    }
                  }
                }
              }
            }
          }
        } else {
          alert(data.info);
        }
      }
    )
  }
  selectStageTag(k,b){
    if(!this.publicStageList[k]['gradeList'][b]['isChoose']){
      let tagIdFather = this.publicStageList[k]['tagId'];
      let tagId = this.publicStageList[k]['gradeList'][b]['tagId'];
      // console.log(tagId,tagIdFather);
      // 如果父级存在已选数据中，父级不会被增加和减少
      for(let n = 0; n<this.stageList.length; n++){
        if(tagIdFather==this.stageList[n]['tagId']){
          // 需要看子集有没有在远端已选
          if(this.selectedTags.indexOf(tagId) != -1){
            // 子集在本地已选，删除本地子集
            this.selectedTags.splice(this.selectedTags.indexOf(tagId),1);
            // console.log(this.selectedTags,'父级在远端，子集在本地')
            return;
          } else {
            this.selectedTags.push(tagId);
            // console.log(this.selectedTags,'父级在远端，子集不在本地')
            return;
          }
        }
      }
      // 无法循环出来父级不在远端已选
      if(this.selectedTags.indexOf(tagIdFather) != -1){
        // 父级在本地
        if(this.selectedTags.indexOf(tagId) != -1){
          // 子集在本地已选，删除本地子集
          this.selectedTags.splice(this.selectedTags.indexOf(tagId),1);
          // console.log(this.selectedTags,'父级在本地，子集在本地')
          // 计算父级是否需要删除
          for(let i=0; i< this.selectedTags.length; i++){
            for(let m=0; m< this.publicStageList[k]['gradeList'].length; m++){
              if(this.selectedTags[i] == this.publicStageList[k]['gradeList'][m]['tagId']){
                // 已选中有该父级的子集，则该父级不需要删除
                // console.log(this.selectedTags,'父级在本地，子集在本地')
                return;
              }
            }
          }
          // 父级在本地，子集在本地不存在
          this.selectedTags.splice(this.selectedTags.indexOf(tagIdFather),1);
          // console.log(this.selectedTags,'父级在本地，子集在本地不存在')
          return;
        } else {
          this.selectedTags.push(tagId);
          return;
        }
      } else {
        this.selectedTags.push(tagId);
        this.selectedTags.push(tagIdFather);
        // console.log(this.selectedTags,'父级不在本地和远端')
        return;
      }
    } else {
      // console.log(this.selectedTags);
      return;
    }
  }

  deleteStageTag(i,m){
    let idFather = this.stageList[i]['id'];
    let id = this.stageList[i]['childList'][m]['id']; 
    let obj = [];
    if(this.stageList[i]['childList'].length>1){
      obj = [id];
    } else {
      obj = [id,idFather];
    }
    this.http.deleteTeacherTag(obj).subscribe(
      data =>{
        if(!data.status){
          this.editType = null;
          this.getTeacherTagList();
        } else {
          alert(data.info);
        }
      }
    )
  }
  addStageNow(){
    if(this.selectedTags.length>0){
      let obj = {
        "tagId":this.selectedTags,
        "tid":[this.tid]
      }
      this.http.addTeacherTag(obj).subscribe(
        data =>{
          if(!data.status){
            this.editType = null;
            this.getTeacherTagList();
          } else {
            alert(data.info);
          }
        }
      )
    } else {
      alert('您还未选择标签');
      return;
    }
  }
  // 获取教学科目标签
  addSubject(){
    this.editType = 2;
    this.http.getSubjectTagList(3).subscribe(
      data =>{
        if(!data.status){
          this.publicSubjectList = data.tagList;
          // console.log(this.publicSubjectList);
          for(let h=0; h < this.subjectList.length; h++){
            for(let i=0; i < this.publicSubjectList.length; i++){
              if(this.subjectList[h]['tagId']===this.publicSubjectList[i]['tagId']){
                this.publicSubjectList[i]['isChoose'] = 1;
              }
            }
          }
          // console.log(this.publicSubjectList);
        } else {
          alert(data.info);
        }
      }
    )
  }
  deleteSubjectTag(i){
    let obj = [this.subjectList[i]['id']];
    this.http.deleteTeacherTag(obj).subscribe(
      data =>{
        if(!data.status){
          this.editType = null;
          this.getTeacherTagList();
        } else {
          alert(data.info);
        }
      }
    )
  }
  selectSubject(d){
    if(!this.publicSubjectList[d]['isChoose']){
      let tagId = this.publicSubjectList[d]['tagId'];
      if(this.selectedTags.indexOf(tagId) != -1){
        this.selectedTags.splice(this.selectedTags.indexOf(tagId),1);
      } else {
        this.selectedTags.push(tagId);
      }
      // console.log(this.selectedTags);
    } else {
      return;
    }
  }
  addSubjectNow(){
    if(this.selectedTags.length>0){
      let obj = {
        "tagId":this.selectedTags,
        "tid":[this.tid]
      }
      this.http.addTeacherTag(obj).subscribe(
        data =>{
          if(!data.status){
            this.editType = null;
            this.getTeacherTagList();
          } else {
            alert(data.info);
          }
        }
      )
    } else {
      alert('您还未选择标签');
      return;
    }
  }
  cancelAdd(){
    this.editType = null;
    this.selectedTags = [];
  }


}
