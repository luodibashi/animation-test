import { 
	Component, 
	OnChanges,  //@input属性(输入属性)发生变化时，会调用。非此属性，不会调用。当输入属性为对象时，当对象的属性值发生变化时，不会调用，当对象的引用变化时会触发。先于ngOnInit调用。
	DoCheck, //每次发生变更检测时会被调用ngDoCheck() 是Angular中的变更检测机制.它由 zone.js 来实现的.其行为是只要你的Angular中的某个组件发生异步事件.就会检查整个组件树,以保证组件属性的变化或页面的变化是同步的.所以 ngDoCheck() 的触发相当频繁的.并且是我们无法预料到的.也许我们在页面上的一个无意识操作,就会触发几个甚至几十个的 ngDoCheck() 生命周期钩子.
	OnInit, //只执行一次，dom操作可放在其中。（最常用）
	AfterContentInit, //在组件内容初始化之后调用
	AfterContentChecked, //内容投影：父组件写在子标签之间的内容会被渲染到子模板的ng-content中去，类似vue的slot组件及子组件每次检查内容时调用当父子组件都有该钩子时，父组件先执行。
	AfterViewInit, //组件相应的视图初始化之后调用
	AfterViewChecked  //组件及子组件每次检查视图时调用当父子组件都有该钩子时，子组件先执行。ngAfterViewChecked与ngAfterViewInt中不允许修改绑定的属性（@input属性），否则抛出异常
} from '@angular/core';

// //这个顺序是按照执行的先后排列的
// constructor：构造器函数，一般用于注入服务
// ngOnChanges：检测到输入数据变化，首次触发发生在ngOnInit前。注意对象的属性发生变化时监听不到
// ngOnInit：组件初始化，通常会设置一些初始值
// ngDoCheck：手动触发更新检查 
// ngAfterContentInit：内容初始化到组件之后
// ngAfterContentChecked：内容变更检测之后
// ngAfterViewInit：视图 初始化之后
// ngAfterViewChecked：视图发生变化检测之后，这个可以用来保证用户视图的及时更新
// ngOnDestroy：组件注销时的清理工作，通常用于移除事件监听，退订可观察对象等

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.less']
})
export class LiveComponent implements OnInit {

  constructor() { 
  	console.log('构造器函数');
  }

  ngOnChanges(){
  	console.log('ngOnChanges');
  }

  ngOnInit() {
  	console.log('1ngOnInit')
  	console.log('2ngOnInit')
  	let ddd: string;
  	ddd = '111';
  	let newd = {
  		"1":1,
  		"2":ddd
  	}
  	console.log(newd)
  }

  ngDoCheck(){
  	console.log('手动触发更新');
  }

  ngAfterContentInit(){
  	console.log('ngAfterContentInit')
  }

  ngAfterContentChecked(){
  	console.log('ngAfterContentChecked')
  }

  ngAfterViewInit(){
  	console.log('ngAfterViewInit')
  }

  ngAfterViewChecked(){
  	console.log('ngAfterViewChecked')
  }

  // ngOnDestory(){
	// 销毁，事件解绑。
  // }

}
