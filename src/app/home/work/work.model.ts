export interface workInfo {
  workId:number
  workName:string
  cid:number
  className:string
  pid:number
  startTime:string
  endTime?:string
  durationTime:number
  allNumber:number
  getNumber:number
  submitNumber:number
  workStatus:number
}
export interface paperInfo{
  copyCode: string
  createTid: number
  dataStatus: number
  isFinish: number
  isQuestionBank: number
  isVideo: number
  objNumber: number
  objScore: number
  ownerTid: number
  paperName: string
  paperStruct: string
  paperStructJson: any
  paperType: number
  parentPid?: number
  pid: number
  subNumber: number
  subScore: number
  teacherName: string
  word?: string
}

export interface studentQuestionAnswer{
  studentAnswerId:number
  studentId:number
  studentName:string
  remarkName?:string
  photo?:string
  workId:number
  qid:number
  qType:number
  answer?:Object
  submitTime:string
  answerDuration:number
  tid?:number
  tutorId?:number
  correctTime?:string
  correct?:Object
  score:number
  isRight:number
  isMaster:number
  correctType?:string
}
