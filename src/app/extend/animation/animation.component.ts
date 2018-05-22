import { Component, OnInit } from '@angular/core';
import { boxAnimate,clearBox,boxAnimate2,KeyframesAnimate,GroupAnimate,QueryAnimate,RouteAnimate } from '../../animation/animation.module'

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.less'],
	animations: [
    boxAnimate,
    clearBox,
    boxAnimate2,
    KeyframesAnimate,
    GroupAnimate,
    QueryAnimate,
    RouteAnimate
  ]
})
export class AnimationComponent implements OnInit {
  // 定义开始的状态
  private boxState: String = 'left';
  private _isTrue: Boolean = true;
  private boxState1: String = 'left';
  private _isTrue1: Boolean = true;
    // 状态
  private boxStateNew='';
  //显示么
  private show= true;
  private num = 123;
  private Keyframes= true;
  private Group = true;
  constructor() { }

  ngOnInit() {
  }
  start(): void {
    // console.log('开始运动');
    if (this._isTrue) {
      this.boxState = 'right';
    } else {
      this.boxState = 'left';
    }
    this._isTrue = !this._isTrue;
  }
  start1(): void {
    // console.log('开始运动');
    if (this._isTrue1) {
      this.boxState1 = 'right';
    } else {
      this.boxState1 = 'left';
    }
    this._isTrue1 = !this._isTrue1;
  }

  changState(state){
    this.boxStateNew = state;
  }
  changShow(){
    this.show=!this.show;
  }
  add(f:boolean){
    const n = Math.round(Math.random()*100);
    this.num= f?this.num + n:this.num -n;
  }
  KeyframesShow(){
    this.Keyframes = !this.Keyframes;
  }
  GroupShow(){
    this.Group = !this.Group;
  }
  Callback(f:boolean){
    if(f){
      console.log("动画开始");
    }else {
      console.log("动画结束");
    }
  }
}
