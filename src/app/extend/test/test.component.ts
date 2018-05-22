import { Component, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.less']
})
export class TestComponent implements OnInit,OnChanges {
	showBox: boolean = true
  constructor() { }

// ngOnChanges - 当数据绑定输入属性的值发生变化时调用

// ngOnInit - 在第一次 ngOnChanges 后调用

// ngDoCheck - 自定义的方法，用于检测和处理值的改变

// ngAfterContentInit - 在组件内容初始化之后调用

// ngAfterContentChecked - 组件每次检查内容时调用

// ngAfterViewInit - 组件相应的视图初始化之后调用

// ngAfterViewChecked - 组件每次检查视图时调用

// ngOnDestroy - 指令销毁前调用
	ngOnChanges(){
		alert('sss')
		// this.ngOnInit();
	}

  ngOnInit() {
  	// 监听窗口变化
  	window.onresize = function(){
  		if(window.innerWidth>720){
  			console.log('111');
  			window.location.href = "";
  		}
  	}
  	console.log(window.innerHeight);
  	console.log(window.outerHeight); 
  	console.log(window.innerWidth);  //浏览器内部宽度
  	console.log(window.outerWidth);  //整个浏览器宽度
  }

  showBoxImg(){
  	this.showBox = false;
  }

  closeImg(){
  	this.showBox = true;
  }

}
