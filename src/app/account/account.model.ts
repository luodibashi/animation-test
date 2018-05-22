export interface teacherInfo {
  id: string;
  uid: number;
  token: string;
  userType: number;
  school: School[];
}

export interface Account {
  user: string;
  password: string
  captcha: string
}

export interface School {
  sid: number;
  isUse: number;
  schoolName: string
}

export interface LoginInfo {
  token: string;
  phone ? : number;
  loginTime ? : number;
  voucher ? : string;
  schoolName: string;
  email ? : string;
  loginStatus: number;
  uid: number;
  studentId ? : number;
  schoolId: number;
  studentName ? : string;
  userType: number;
  idType: number;
  photo ? : string;
}