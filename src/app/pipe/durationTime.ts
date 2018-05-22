import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'DurationTime',
  pure: true // 如果你的管道不受外界影响，只受参数的影响请遵守FP原则，设置为纯管道
})
export class DurationTime implements PipeTransform {

  transform(value: string, args?: any): string {
    if(!value){
    	return '不限时';
    } else if(value&&Number(value)<3600){
    	let time = parseInt(String(Number(value) / 60))+'分';
    	return time;
    } else if(value&&Number(value)>3599){
    	let hour = parseInt(String(Number(value) / 3600))+'小时';
    	let time;
    	if(Number(value)===3600){
    		time = hour;
    	} else {
	    	let leave = parseInt(String(Number(value) % 3600));
	    	let minute = parseInt(String(Number(leave) / 60)) + '分';
	    	time = hour+minute;
    	}
    	return time;
    }
  }
}
