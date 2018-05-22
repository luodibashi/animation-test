export interface classInfo {
  cid:number;
  sid:number;
  createTid:number;
  ownerTid:number;
  teacherName:string;
  photo:string;
  className:string;
  maxNumber:number;
  password:string;
  remarkName ?:string;
  qrCode ?:string;
  sort ?:number;
  takeOverTime ?:string;
  userNumber:number;
  classType:number;
  isPumping:number;
  goodsId ?:number;
  goodsSnapshotId ?:number;
  classPrice ?:number;
  liveType ?:number;
  liveName ?:string;
  livePic ?:string;
  liveExplain ?:string;
  liveUrl ?:string;
  interlocutionName ?:string;
  interlocutionPic ?:string;
  interlocutionExplain ?:string;
  isAllowedQuit ?:number;
  dataStatus:number;
  createTime:string;
  updateTime:string;
}
export interface workBaseInfo{
  workId :number
  workName?: string
  tid :number
  pid :number
  displayTime: string
  startTime: string
  endTime?: string
  showAnswerType :number
  totalDuration:number
  isMixed :number
  isWholeWork :number
  workStatus :number
  totalScore :number
  minScore :number
  maxScore :number
  avgScore :number
  totalNumber :number
  submitNumber :number
  subNumber :number
  objNumber :number
  avgAnswerTime :number
}

export interface StudentClassReport{
  cid:number
  className:string
  maxNumber:number
  userNumber:number
  studentId:number
  studentName:string
  remarkName?:string
  photo?:string
  overallScore:number
  overallRanking:number
  answerQuestionNumber:number
  totalQuestionNumber:number
  totalWorkNumber:number
  mineWorkNumber:number
  getWorkStatus:number
}

export interface StudentClassWorkReport{
  studentId:number
  studentName:string
  remarkName:string
  photo:string
  workId:number
  workName:string
  durationTime:number
  uDurationTime:number
  totalNumber:number
  uesrScore:number
  rank:number
  totalScore:number
  avgScore:number
  maxScore:number
  minScore:number
  questionList:questionList
}
export interface questionList{
  qNumber:string
  qid:number
  qType:number
  score:number
  qScore:number
  isRight:number
}
