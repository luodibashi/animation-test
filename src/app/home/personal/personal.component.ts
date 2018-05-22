import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
import { HomeService } from '../home.service';
import { teacherInfo } from '../home.model'
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.less']
})
export class PersonalComponent implements OnInit {
	teacherInfo:teacherInfo
	teacherName:string
	tid: number
	uid: number
	email:string
	phone:string
	account:string
	editType: number //1-修改名字；2-修改用户名；3-修改邮箱；4-修改手机号；5-修改密码；6-退出
  password: string
  showValidate: boolean = false;
  captcha: string
  codeKey: string
  base64Img: string
  phoneCaptcha: string
  oldPassword: string
  newPassword: string
  repeatPassword: string
  emailOk: boolean = false
  second: number
  forbidGet: boolean = false
  sendWait: boolean = false
  phoneOk: boolean = false
  oldPasswordOk: boolean = false
  newPasswordOk: boolean = false
  messageErr: string
  constructor(
  	private http: HomeService,
  	private Route: ActivatedRoute,
  	private Router: Router,
  	private AccountService: AccountService
  ) { }

  ngOnInit() {
  	this.teacherInfo = JSON.parse(localStorage.getItem('teacherInfo'));
  	this.tid = this.teacherInfo.tid;
  	this.uid = this.teacherInfo.userId;
  }

  // 返回
  return(){
  	this.Router.navigate(['my/home']);
  }

  // 更换头像
  changePhoto(){
    let ele = < HTMLElement > document.querySelector('#avator')
    let form = < HTMLFormElement > document.querySelector("#fd")
    ele.click()
    ele.onchange = () => {
      let fd = new FormData(form)

      let photo: string;
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let res = JSON.parse(xhr.responseText)
          if (!res.status) {
            photo = res.data.url;
            let obj = {
              "tid": this.tid,
              "photo": photo
            }
            this.http.updateTeacherInfo(obj).subscribe(
              data => {
                this.teacherInfo['photo'] = photo;
                try{
                  window.localStorage.setItem('teacherInfo',JSON.stringify(this.teacherInfo));
                } catch(e){
                  alert('您处于无痕浏览，无法为您跳转')
                }
              }
            )
          }
        }
      }



      let uploadFailed = (evt) => {
        alert('wow,upload failed!!!')
      }

      let uploadCanceled = (evt) => {
        // console.log('upload canceled...')
      }

      // upload file start
      xhr.addEventListener("error", uploadFailed, false);
      xhr.addEventListener("abort", uploadCanceled, false);

      // listen upload progress
      xhr.upload.onprogress = (evt) => {
        // console.log(evt)
        if (evt.lengthComputable) {
          let percentComplete = Math.round(evt.loaded * 100 / evt.total);
          // console.log(percentComplete)
        }
      }

      xhr.open("post", `http://115.29.177.200:8080/upload?w=66&h=66&type=1&token=${this.teacherInfo.token}`, true)
      xhr.send(fd)
    }
  }

  // 编辑名字
  editName(){
  	this.editType = 1;
  	this.teacherName = this.teacherInfo.teacherName;
  }
  // 确定
  updateName(){
  	if(!this.teacherName){
  		// alert('请输入姓名后修改');
  		this.messageErr = '请输入姓名后修改';
  		return;
  	};
  	if(this.teacherName == this.teacherInfo.teacherName){
  		// alert('名字并未修改哦');
  		this.messageErr = '名字并未修改哦';
  		return;
  	}
  	let obj = {
  		"tid":this.tid,
  		"teacherName":this.teacherName
  	}
  	this.http.updateTeacherInfo(obj).subscribe(
  		data =>{
  			if(!data.status){
  				this.teacherInfo['teacherName'] = this.teacherName;
  				// console.log(this.teacherInfo);
					this.editType = null;
					this.messageErr = '';
  				// 修改成功更新缓存
  				try{
  					window.localStorage.setItem('teacherInfo',JSON.stringify(this.teacherInfo));
  				} catch(e){
  					alert('您处于无痕浏览，无法为您跳转')
  				}
  			} else {
  				alert(data.info);
  				return;
  			}
  		}
  	)
  	// debugger;
  	// console.log(this.teacherName);
  }
  // 编辑账号
  editAccount(){
  	this.editType = 2;
  	this.password = '';
  	this.showValidate = true;
  }

  // 更新账号
  updateAccount(){
  	// 调用更新服务
  	if(!this.account){
  		// alert('账号必填哦');
			this.messageErr = '账号必填哦';
  		return;
  	} else {
	  	if(this.account == this.teacherInfo.account){
	  		// alert('请输入新的账号');
				this.messageErr = '请输入新的账号';
	  		return;
	  	}
	  	// 验证账号格式
	  	let accountRegexp = /^[a-zA-Z]\w+$/;
	  	if(!accountRegexp.test(this.account)){
	  		// alert('账号不合法');
				this.messageErr = '账号不合法';
	  		return;
	  	}
	  	// 验证账号唯一
	  	this.http.validateUserOnly({"account":this.account}).subscribe(
	  		data =>{
	  			if(!data.status){
		  			this.messageErr = '';
	  				return;
	  			} else {
	  				alert(data.info);
	  				return;
	  			}
	  		}
	  	)
  	}
  	// 调用服务更新账号
  	let obj = {
  		"uid": this.uid,
  		"account": this.account
  	}
  	this.http.updateAccount(obj).subscribe(
  		data =>{
  			if(!data.status){
  				this.teacherInfo['account'] = this.account;
  				// console.log(this.teacherInfo);
					this.editType = null;
		  		this.messageErr = '';
  				// 修改成功更新缓存
  				try{
  					window.localStorage.setItem('teacherInfo',JSON.stringify(this.teacherInfo));
  				} catch(e){
  					alert('您处于无痕浏览，无法为您跳转')
  				}
  			} else {
  				alert(data.info);
  				return;
  			}
  		}
  	)
  }

  // 编辑邮箱
  editEmail(){
  	this.editType = 3;
  	this.password = '';
  	this.showValidate = true;
  }
  // 验证邮箱格式
  validateEmailForm(){
  	if(!this.email){
  		// alert('请输入邮箱账号');
			this.messageErr = '请输入邮箱账号';
  		this.emailOk = false;
  		return;
  	} else {
  		if(this.email == this.teacherInfo.email){
  			// alert('请填写不同的邮箱');
				this.messageErr = '请填写不同的邮箱';
  			this.emailOk = false;
  			return;
  		}
	  	let emailRegexp = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
	  	if(!emailRegexp.test(this.email)){
	  		// alert('账号不合法');
				this.messageErr = '账号不合法';
  			this.emailOk = false;
	  		return;
	  	} else {
		  	// 验证账号唯一
		  	this.http.validateUserOnly({"email":this.email}).subscribe(
		  		data =>{
		  			if(!data.status){
  						this.emailOk = true;
		  				this.messageErr = '';
		  				return;
		  			} else {
		  				alert(data.info);
  						this.emailOk = false;
		  				return;
		  			}
		  		}
		  	)
	  	}
  	}
  }
  // 获取邮箱验证码
  getEmailCaptcha(){
  	if(this.forbidGet||this.sendWait){
  		return;
  	}
  	if(this.emailOk){
  		this.sendWait = true;
	  	this.messageErr = '';
  		this.http.createEmailCaptcha({"email":this.email}).subscribe(
  			data =>{
  				if(!data.status){
  					// alert('验证码已发送至您的邮箱');
						this.messageErr = '验证码已发送至您的邮箱';
  					this.sendWait = false;
  					this.forbidGet = true;
			  		let timer = null;
			  		this.second = 60000;
			  		timer = setInterval(()=>{
			  			this.second = this.second-1000;
			  			if(this.second==0){
			  				clearInterval(timer);
			  				this.forbidGet = false;
			  			}
			  		},1000)
  				} else {
  					alert(data.info);
  					return;
  				}
  			}
  		)  
  	} else {
  		// alert('请输入合法邮箱');
			this.messageErr = '请输入合法邮箱';
  		return;
  	}
  }
  // 确定修改邮箱
  updateEmail(){
  	if(!this.captcha){
  		// alert('请输入邮箱验证码');
			this.messageErr = '请输入邮箱验证码';
  		return;
  	}
  	if(this.emailOk){
  		let obj = {
  			"uid": this.uid,
  			"email": this.email,
  			"captcha": this.captcha
  		}
  		this.http.updateEmail(obj).subscribe(
  			data =>{
  				if(!data.status){
	  				this.teacherInfo['email'] = this.email;
	  				// console.log(this.teacherInfo);
						this.editType = null;
            this.captcha = '';
		  			this.messageErr = '';
	  				// 修改成功更新缓存
	  				try{
	  					window.localStorage.setItem('teacherInfo',JSON.stringify(this.teacherInfo));
	  				} catch(e){
	  					alert('您处于无痕浏览，无法为您跳转')
	  				}
  				} else {
  					alert(data.info);
  				}
  			}
  		)
  	}else{
  		// alert('请输入合法邮箱');
			this.messageErr = '请输入合法邮箱';
  		return;
  	}
  }

  // 编辑手机号
  editPhone(){
  	this.editType = 4;
  	this.password = '';
  	this.showValidate = true;
  }
  // 验证手机号码唯一并未注册
  validatePhoneForm(){
  	if(!this.phone){
  		// alert('请输入手机号码');
			this.messageErr = '请输入手机号码';
      this.phoneOk = false;
  		return;
  	} else {
      if(this.phone == this.teacherInfo.phone){
        // alert('请输入新手机号')
				this.messageErr = '请输入新手机号';
        this.phoneOk = false;
        return;
      }
      let phoneRegexp = /^1[345678]\d{9}$/;
      if(!phoneRegexp.test(this.phone)){
        // alert('手机号不合法');
				this.messageErr = '手机号不合法';
        this.phoneOk = false;
        return;
      } else {
        // 验证账号唯一
        this.http.validateUserOnly({"phone":this.phone}).subscribe(
          data =>{
            if(!data.status){
              this.phoneOk = true;
		  				this.messageErr = '';
              return;
            } else {
              alert(data.info);
              this.phoneOk = false;
              return;
            }
          }
        )
      }
    }
  }
  // 获取手机验证码
  getPhoneCaptcha(){
    if(this.phoneOk){
      // 验证图片验证码必填
      if(!this.captcha){
        // alert('请填写图片验证码');
				this.messageErr = '请填写图片验证码';
        return;
      } else {

        if(this.forbidGet||this.sendWait){
          return;
        }
        // 发送短信
        let obj = {
          "isRegister":1,
          "phone":this.phone,
          "code":this.captcha,
          "codeKey":this.codeKey
        }
        this.sendWait = true;
		  	this.messageErr = '';
        // 调用接口
        this.http.createMessageCaptcha(obj).subscribe(
          data =>{
            if(!data.status){
              // alert('验证码已发送至您的手机')
    					this.messageErr = '验证码已发送至您的手机';
              this.sendWait = false;
              this.forbidGet = true;
              let timer = null;
              this.second = 60000;
              timer = setInterval(()=>{
                this.second = this.second-1000;
                if(this.second==0){
                  clearInterval(timer);
                  this.forbidGet = false;
                }
              },1000)
            } else {
              alert(data.info);
            }
          }
        )
      }
    } else {
      // alert('请输入手机号码');
    	this.messageErr = '请输入手机号码';
      return;
    }

  }
  // 更新手机号
  updatePhone(){
    if(this.phoneOk){
      if(!this.phoneCaptcha){
        // alert('请输入短信验证码');
      	this.messageErr = '请输入短信验证码';
        return;
      }
      let obj = {
        "uid":this.uid,
        "phone":this.phone,
        "captcha":this.phoneCaptcha
      }
      // 调用服务
      this.http.updatePhone(obj).subscribe(
        data =>{
          if(!data.status){
            this.teacherInfo['phone'] = this.phone;
            // console.log(this.teacherInfo);
            this.editType = null;
            this.captcha = '';
            this.phoneCaptcha = '';
		  			this.messageErr = '';
            // 修改成功更新缓存
            try{
              window.localStorage.setItem('teacherInfo',JSON.stringify(this.teacherInfo));
            } catch(e){
              alert('您处于无痕浏览，无法为您跳转')
            }
          } else {
            alert(data.info);
            return;
          }
        }
      )
    } else {
      // alert('请输入合法手机号')
      this.messageErr = '请输入合法手机号';
      return;
    }
  }

  // 获取图片验证码
  getCaptcha(){
  	this.AccountService.captcha().subscribe(
  		data =>{
        this.base64Img = "data:image/jpeg;base64," + data.image;
        this.codeKey = data.codeKey;
  		}
  	)
  }

  // 更新图片验证码
  updateCaptcha(){
		this.getCaptcha();
  }

  // 编辑密码
  editPassword(){
  	this.editType = 5;
  }
  // 验证密码格式
  validatePasswordForm(type){
    if(type==1){
      if(this.oldPassword&&!(this.oldPassword.length<6||this.oldPassword.length>20)){
        this.oldPasswordOk = true;
		  	this.messageErr = '';
      } else {
        // alert('密码需要6-20位哦');
        this.messageErr = '密码需要6-20位哦';
        this.oldPasswordOk = false;
        return;
      }
    } else if (type ==2){
      if(this.newPassword&&!(this.newPassword.length<6||this.newPassword.length>20)){
        if(this.repeatPassword&&this.newPassword==this.repeatPassword){
          this.newPasswordOk = true;
		  		this.messageErr = '';
        } else if(this.repeatPassword&&this.newPassword!=this.repeatPassword){
          // alert('两次输入密码不一致');
          this.messageErr = '两次输入密码不一致';
          return;
        }
      } else {
        // alert('密码需要6-20位哦');
        this.messageErr = '密码需要6-20位哦';
        return;
      }
    } else if (type ==3){
      if(this.repeatPassword&&!(this.repeatPassword.length<6||this.repeatPassword.length>20)){
        if(this.newPassword&&this.newPassword==this.repeatPassword){
          this.newPasswordOk = true;
		  		this.messageErr = '';
        } else if(this.newPassword&&this.newPassword!=this.repeatPassword){
          // alert('两次输入密码不一致');
          this.messageErr = '两次输入密码不一致';
          return;
        }
      } else {
        // alert('密码需要6-20位哦');
        this.messageErr = '密码需要6-20位哦';
        return;
      }
    }
  }
  // 修改密码
  updatePassword(){
    if(this.oldPasswordOk&&this.newPasswordOk){
 
      // 使用密码算法设置新密码
      let oldPasswordMd5 = (Md5.hashStr(this.oldPassword)).toString();
      let hash = oldPasswordMd5.split('');
      hash[5] = this.oldPassword.charAt(0);
      hash[10] = this.oldPassword.charAt(1);
      hash[15] = this.oldPassword.charAt(2);
      let oldPassword = hash.join('');
      // 设置新密码
      let newPasswordMd5 = (Md5.hashStr(this.newPassword)).toString();
      let newhash = newPasswordMd5.split('');
      newhash[5] = this.newPassword.charAt(0);
      newhash[10] = this.newPassword.charAt(1);
      newhash[15] = this.newPassword.charAt(2);
      let newPassword = newhash.join('');
      // 配置参数
      let obj = {
        "oldpassword": oldPassword,
        "newpassword": newPassword
      }
      this.http.updatePassword(obj).subscribe(
        data =>{
          if(!data.status){
            alert('密码修改成功');
            this.editType = null;
            this.oldPassword = '';
            this.newPassword = '';
            this.repeatPassword = '';
          } else{
            alert(data.info);
            return;
          }
        }
      )
    } else {
      alert('请输入旧密码或新密码');
      this.messageErr = '请输入旧密码或新密码';
      return;
    }
  }

  // 验证密码
  validatePassword(){
  	// 调用密码验证接口验证
  	if(!this.password){
  		// alert('请输入账号密码');
  		this.messageErr = '请输入账号密码';
  		return;
  	}
  	if(this.password.length<6||this.password.length>20){
  		// alert('密码长度为6-20位');
  		this.messageErr = '密码长度为6-20位';
  		return;
  	}
  	// 使用密码算法设置新密码
  	let passwordMd5 = (Md5.hashStr(this.password)).toString();
  	let hash = passwordMd5.split('');
    hash[5] = this.password.charAt(0);
    hash[10] = this.password.charAt(1);
    hash[15] = this.password.charAt(2);
    let password = hash.join('');
    // 合成验证数据
  	let obj = {
  		"uid": this.uid,
  		"password": password
  	}
  	// 调用服务
  	this.http.validatePassword(obj).subscribe(
  		data =>{
  			if(!data.status){
  				// 验证数据成功
			  	this.showValidate = false;
			  	this.messageErr = '';
			  	if(this.editType === 2){
			  		// 修改账号
				  	if(this.teacherInfo.account){
				  		this.account = this.teacherInfo.account;
				  	} else {
				  		this.account = '您暂时还没有设置';
				  	}
			  	} else if(this.editType === 3){
			  		// 修改邮箱
			  	} else if(this.editType === 4){
			  		// 修改手机号
			  		this.getCaptcha();
			  	}
  			} else {
  				alert(data.info);
  				return;
  			}
  		}
  	)
  }
  // 取消验证密码
  cancelValidate(){
  	this.showValidate = false;
  	this.editType = null;
  	this.phone = '';
  	this.email = '';
  	this.account = '';
  	this.messageErr = '';
  }
  // 取消修改
  cancelUpdate(){
  	this.editType = null;
  	this.teacherName = '';
  	this.account = '';
  	this.email = '';
  	this.phone = '';
  	this.oldPassword = '';
  	this.newPassword = '';
  	this.repeatPassword = '';
    this.captcha = '';
  	this.messageErr = '';
  }

  // 教学阶段及科目
  editTag(){
    this.Router.navigate(['my/tag']);
  }

  // 微信绑定管理
  editWechat(){
    this.Router.navigate(['my/wx']);
  }

  //退出
  quit(){
    this.editType = 6;
  }
  // 确定退出
  imSure(){
    window.localStorage.removeItem('teacherInfo');
    window.localStorage.removeItem('workRouter');
    this.Router.navigate(['login']);
  }
  // 不退出
  noThanks(){
    this.editType = null;
  }

}
