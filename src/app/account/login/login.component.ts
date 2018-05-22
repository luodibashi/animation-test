import { Component, OnInit } from '@angular/core';
// service
// import { AccountService } from '../account.service'
import { Md5 } from 'ts-md5/dist/md5';
// import { Account, School, LoginInfo } from '../account.model'
import { ActivatedRoute, Router, Params } from '@angular/router'
import { DomSanitizer } from '@angular/platform-browser'
// import { UtilsService } from '../../home/utils.service'
import * as qrcode from 'qrcode-generator'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
	codeKey: string;
	base64Img: string;
  sid: number
  userName: string
  account: string
  phone: string
  email: string
  password: string
  newPassword: string
  captcha: string
  userNameErr: string
  passwordErr: string
  captchaErr: string
  schoolLogo: string
  schoolName: string
  schoolPic: string
  isAllowRegister: number
  appid: string
  wxBrowser: boolean
  loginType: number //1-微信；2-用户名
  clientType: number //1-手机号、邮箱、用户名密码方式登录;2-手机验证码登录;3-微信登录;4-支付宝登录;
  loginInfo: string
  userType: number = 1  //1-教师；2-家长；3-学生；4-管理员；5-商城管理员
  uid: number
  tid: number
  schoolList = []
  temporaryToken: string
  loginStatus: string = '登录'
  isDirectEnter: boolean
  showSelectSchool: boolean = false
  choosedSid: number
  constructor(
  	// private http: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    let mobile = !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/); //判断是否手机终端
    let path = window.location.hash;
    // 判断微信浏览器
    let ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) != null) {
      this.wxBrowser = true;
    } else {
      this.wxBrowser = false;
      // 非微信浏览器则只能是账号登录模式，显示为微信
      this.loginType = 2;
    }
    // 判断是否为移动端
    if(mobile){
      // 获取sid信息
      if (Number(window.location.href.split("=")[1])) {
        this.sid = Number(window.location.href.split("=")[1]);
        this.isDirectEnter = true;
      } else if (JSON.parse(localStorage.getItem('targetSid'))){
        this.sid = JSON.parse(localStorage.getItem('targetSid'));
        this.isDirectEnter = true;
        // console.log(this.sid)
      } else {
        this.sid = 100000;
        this.isDirectEnter = false;
      }
      // 获取机构信息
      // this.getSchoolInfo();
      // 获取验证码信息
  		// this.getCaptcha();
  		// console.log((Md5.hashStr('123456')).toString())
    } else {
      window.location.href = 'http://www.maixuexi.cn/teacher';
    }
  }

  // 获取机构信息debugger
  // getSchoolInfo(){
  //   this.http.getSchoolInfo(this.sid).subscribe(
  //     data =>{
  //       if(!data.status){
  //         this.schoolLogo = data.schoolLogo;
  //         this.schoolName = data.schoolName;
  //         if(!this.schoolLogo){
  //           this.schoolPic = data.headImgLocal;
  //         } else {
  //           this.schoolPic = data.schoolLogo;
  //         }
  //         this.appid = data.appid;
  //         if(this.wxBrowser&&this.appid){
  //           this.loginType = 1;
  //         } else {
  //           this.loginType = 2;
  //         }
  //         this.isAllowRegister = data.isAllowRegister;
  //       } else {
  //         alert(data.info);
  //       }
  //     }
  //   )
  // }

  // 验证用户名
  validateAccount(){
    // console.log(this.userName);
    if(!this.userName){
      this.userNameErr = '请输入账号';
      return;
    }
    // 正则匹配
    let accountRegexp = /^[a-zA-Z]\w+$/;
    let phoneRegexp = /^1[345678]\d{9}$/;
    let emailRegexp = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
    if(accountRegexp.test(this.userName)||phoneRegexp.test(this.userName)||emailRegexp.test(this.userName)){
      this.userNameErr = '';
      if(accountRegexp.test(this.userName)){
        this.account = this.userName;
      } else if(phoneRegexp.test(this.userName)) {
        this.phone = this.userName;
      } else if(emailRegexp.test(this.userName)){
        this.email = this.userName;
      }
    } else {
      this.userNameErr = '账号不合法';
      return;
    }
  }
  // 验证密码
  validatePassword(){
    // console.log(this.password);
    // 长度在6-20位之间
    if(this.password){
      if(this.password.length<6||this.password.length>20){
        this.passwordErr = '密码长度为6-20位';
        return;
      } else {
        this.passwordErr = '';
        // 计算密码算法
        let passwordMd5 = (Md5.hashStr(this.password)).toString();
        // console.log((Md5.hashStr(this.password)).toString());
        let hash = passwordMd5.split('');
        hash[5] = this.password.charAt(0);
        hash[10] = this.password.charAt(1);
        hash[15] = this.password.charAt(2);
        let lastPassword = hash.join('');
        this.newPassword = lastPassword;
        // console.log(this.newPassword);
      }
    } else{
      this.passwordErr = '请输入密码';
      return;
    }
  }
  // 验证图片验证码
  validateCaptcha(){
    // console.log(this.captcha);
    if(this.captcha){
      if(this.captcha.length===4){
        this.captchaErr = '';
      } else {
        this.captchaErr = '验证码错误';
        // this.getCaptcha();
        return
      }
    } else {
      this.captchaErr = '请输入';
      return;
    }
  }
  // 刷新图片验证码 
  refreshCode(){
    // this.getCaptcha();
  }
  // 登录
  signIn(){
    // 验证账号是否存在
    if(!this.userName){
      this.userNameErr = '请输入账号';
      return;
    }
    // 验证密码是否存在
    if(!this.password){
      this.passwordErr = '请输入密码';
      return;
    }
    // 验证验证码是否存在
    if(!this.captcha){
      this.captchaErr = '请输入';
      return;
    }
    // 验证是否合法
    if(this.userNameErr||this.passwordErr||this.captchaErr){
      return;
    }
    // 验证完成开始正常开展登录
    this.loginStatus = '登录中...'
    this.clientType = 1;
    let signData = {
      "clientType": this.clientType,
      "sid": this.sid,
      "userType": this.userType, //1-教师
      "password": this.newPassword,
      "code": this.captcha,
      "codeKey": this.codeKey
    };
    // 获取登录数据
    if(this.account){
      signData['account'] = this.account;
    } else if(this.phone){
      signData['phone'] = this.phone;
    } else if(this.email){
      signData['email'] = this.email;
    }
    // console.log(this.isDirectEnter);
    // 调用登录接口
    // this.http.loginFirst(signData).subscribe(
    //   data =>{
    //     if(!data.status){
    //       this.loginStatus = '登录'
    //       this.loginInfo = '';
    //       this.uid = data.uid;
    //       this.schoolList = data.school;
    //       this.temporaryToken = data.token;
    //       // console.log(this.isDirectEnter);
    //       if(this.isDirectEnter){
    //         // 默认有sid不需要选择
    //         this.signInDone()
    //       } else {
    //         // 默认没有sid则需要选择
    //         this.showSelectSchool = true;
    //         this.choosedSid = this.sid;
    //       }
    //     } else {
    //       this.loginInfo = data.info;
    //       this.getCaptcha();
    //       this.loginStatus = '登录'
    //     }
    //   }
    // )
  }

  // 选择登录机构
  chooseSchool(sid){
    this.choosedSid = sid;
    this.sid = sid;
  }
  // 第二步完成登录系统
  signInDone(){
    let signObj={
      "sid":this.sid,
      "userType": this.userType,
      "uid": this.uid,
      "token": this.temporaryToken
    }
    // 调用登录服务
    // this.http.loginDone(signObj).subscribe(
    //   data =>{
    //     if(!data.status){
    //       // 判断是否需要补全
    //       if(data.voucher){
    //         window.location.href = "http://www.maixuexi.cn/completion.html?tid=" + data.tid + "&voucher=" + data.voucher;
    //       } else {
    //         let teacherInfo = data;
    //         // console.log(teacherInfo);
    //         // 开始写入localstorage缓存进入首页
    //         try{
    //           window.localStorage.setItem('teacherInfo',JSON.stringify(teacherInfo));
    //         } catch(e){
    //           alert("您处于无痕浏览，无法为您跳转");
    //         }
    //         this.router.navigate(['my/home']);
    //       }
    //     } else {
    //       this.loginInfo = data.info;
    //     }
    //   }
    // )
  }
  // 快速注册
  fastRegistration(){
    window.location.href = 'http://www.maixuexi.cn/register.html?userType=1?sid='+this.sid;
  }
  // 忘记密码
  forgotPassword(){
    window.location.href = 'http://www.maixuexi.cn/forget.html?uerType=1';
  }
  // 微信登录
  weChatSignIn(){
    if(this.wxBrowser&&this.appid){
      let targetSid = this.sid;
      // 缓存sid
      try{
        window.localStorage.setItem('targetSid',JSON.stringify(targetSid))
      } catch(e){
        alert('您处于无痕浏览，无法为您跳转')
      }
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf305ea0876e9955e&redirect_uri=http%3A%2F%2Fwww.maixuexi.cn%2Fphone%2F&response_type=code&scope=snsapi_base&state=TeacherWeChatLogin&component_appid=wxadd06c23643a76c8#wechat_redirect';
    } else {
      alert('该机构不支持微信登录');
    }
  }

  // 获取验证码
  // getCaptcha(){
  // 	this.http.captcha().subscribe(
  // 		data =>{
  // 			this.codeKey = data.codeKey;
  // 			// console.log(this.codeKey);
  //       this.base64Img = "data:image/jpeg;base64," + data.image;
  // 		}
  // 	)
  // }
  // 切换登录方式
  checkLoginType(type){
    // console.log(this.loginType,type)
    if(!this.wxBrowser){
      alert('请在微信中使用微信登录模式');
      return;
    }
    if(!this.appid){
      alert('您要登录的机构不支持微信登录');
      return;
    }
    this.loginType = type;
  }
}
