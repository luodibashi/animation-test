import { Injectable } from '@angular/core';
import {
	Router,
	CanActivateChild,   //等同 canActivate，只不过针对是所有子路由
	RouterStateSnapshot,
	ActivatedRouteSnapshot,
	ActivatedRoute
} from '@angular/router';
import { Md5 } from 'ts-md5/dist/md5';
// import { AccountService } from '../account/account.service'
import { Auth } from './auth';


@Injectable()
export class MyGuard implements CanActivateChild{
	constructor(
		private router : Router,
		private route: ActivatedRoute,
		private Auth: Auth,
		// private AccountService: AccountService
	) {}

	//等同 canActivate，只不过针对是所有子路由
  canActivateChild(
  	childRoute: ActivatedRouteSnapshot, 
  	state: RouterStateSnapshot
  ): boolean {
  	// 返回值 true: 跳转到当前路由 false: 不跳转到当前路由
		// console.log('here')
		let path = window.location.hash;
    // debugger;
		// console.log(path);
		let mobile = !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/); //判断是否手机终端
		// console.log(mobile);
		let url = window.location.href;
    // debugger;
		// console.log(url);
		if(!this.Auth.isLogdedin()){
			// 如果没有登录权限,则跳转至登录页面
      // alert('进来了么？')
      if (path === '#/my/home' || !path || path.indexOf('#/login') != -1) {
        if (mobile) {
          this.router.navigate(['/login']);
        } else {
        	// 跳转至pc端地址c
        	// console.log('电脑端')
        	window.location.href = 'http://www.maixuexi.cn/teacher';
        }
      } else {
        // console.log('到这里来了',path);
        if (mobile) {
          this.router.navigate(['/login'], { queryParams: { path: path } });
        } else {
        	// 跳转至pc端地址
        	// console.log('电脑端')
        	window.location.href = 'http://www.maixuexi.cn/teacher';
        }
      }
      return false;
		} else {
			return true;
		}

	}	

}