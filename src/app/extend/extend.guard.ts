import { Injectable } from '@angular/core';
import {
	Router,
	CanActivateChild,   //等同 canActivate，只不过针对是所有子路由
	RouterStateSnapshot,
	ActivatedRouteSnapshot,
	ActivatedRoute
} from '@angular/router';
declare var md5: Function;

@Injectable()
export class ExtendGuard implements CanActivateChild{
	constructor(
		private router : Router,
		private route: ActivatedRoute
	) {}

	//等同 canActivate，只不过针对是所有子路由
  canActivateChild(
  	childRoute: ActivatedRouteSnapshot, 
  	state: RouterStateSnapshot
  ): boolean {

		let path = window.location.hash;
		// console.log(path);
		let mobile = !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/); //判断是否手机终端
		let url = window.location.href;
		// console.log(url);
		if(url.indexOf('state=center')!=-1){
			return false;
		} else {
			return true;
		}

  }
}