import { Injectable } from '@angular/core'

@Injectable()
export class Auth {
	account: string;
	constructor() {
		this.account = <string> localStorage.getItem('teacherInfo');
		// console.log('111',this.account);
	}

	isLogdedin(): boolean {
		let account = <string> localStorage.getItem('teacherInfo');
		return !!account
	}

}
