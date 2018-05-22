import { trigger, state, style, transition, animate, keyframes,group,query } from '@angular/animations';

// 定义一个鼠标点击运动的动画
export const boxAnimate = trigger('box', [
  // 定义一个状态left
  state('left', style({ transform: 'translate3d(0,0,0)' })),
  // 定义另外一个状态right
  state('right', style({ transform: 'translate3d(200%,0,0)' })),
  // 定义运动过程(从left到right状态)
  transition('left=>right', animate(2000, keyframes([
    style({ transform: 'translate3d(300%,0,0)' })
  ]))),
  // 定义运动过程(从right到left)
  transition('right=>left', animate(1000, keyframes([
    style({ transform: 'translate3d(-100%,0,0)' }),
  ]))),
]);

// 定义一个鼠标点击运动的动画
export const clearBox = trigger('box1', [
  // 定义一个状态left
  // state('left', style({ transform: 'translate3d(0,0,0)' })),
  // // 定义另外一个状态right
  // state('right', style({ transform: 'translate3d(200%,0,0)' })),
  // // 定义运动过程(从left到right状态)
  // transition('left=>right', animate(2000, keyframes([
  //   style({ transform: 'translate3d(300%,0,0)' })
  // ]))),
  // // 定义运动过程(从right到left)
  // transition('right=>left', animate(1000, keyframes([
  //   style({ transform: 'translate3d(-100%,0,0)' }),
  // ]))),
    // 定义一个状态left
  state('left', style({ opacity:1,transform: 'scale(1.0)' })),
  // 定义另外一个状态right
  state('right', style({ opacity:0, transform: 'scale(0.5)' })),
  // 定义运动过程(从left到right状态)
  transition('left=>right', animate(100)),
  // 定义运动过程(从right到left)
  transition('right=>left', animate(100)),
]);

/*
1、定义一个动画，左右两个状态加上颜色变化更容易理解吧
2、添加transition * => *
3、添加transition void => *
*/
export const boxAnimate2 = trigger('box2', [
  // 定义一个状态left
  state('left', style({ transform: 'translate3d(0,0,0) ',background:'red' })),
  // 定义另外一个状态right
  state('right', style({ transform: 'translate3d(200%,0,0)',background:'blue' })),
  //入场动画
  transition(":enter", [
    style({ opacity: 0,transform: 'translate3d(200%,200%,0)'}),
    animate(500 )
  ]),
  // 出场动画
  transition(":leave", [
    style({ opacity: 1}),
    animate(500, style({ opacity: 0,transform: 'translate3d(200%,200%,0)'}))
  ]),

  // 定义运动过程(从left到right状态)
  transition('left=>right', animate(1000)),
  // 定义运动过程(从right到left)
  transition('right=>left', animate(2000)),
  transition(":increment", group([
    query(':enter', [
      style({ left: '100%' }),
      animate('0.5s ease-out', style('*'))
    ]),
    query(':leave', [
      animate('0.5s ease-out', style({ left: '-100%' }))
    ])
  ])),
  transition(":decrement", group([
    query(':enter', [
      style({ left: '-100%' }),
      animate('0.5s ease-out', style('*'))
    ]),
    query(':leave', [
      animate('0.5s ease-out', style({ left: '100%' }))
    ])
  ])),

/*
  // 入场动画
  transition("void => *", [
    style({ opacity: 0,transform: 'translate3d(200%,200%,0)'}),
    animate(500)
  ]),
*/
  // 定义运动过程(从任意到任意)
  transition('* => *', animate(500)),

]);
/*
基于关键帧(Keyframes)的多阶段动画演示

 */
export const KeyframesAnimate = trigger('KeyframesAnimate',[
  //入场动画
  transition(":enter", [
    animate(500, keyframes([
      style({opacity: 0, transform: 'translate3d(-400%,0,0)', offset: 0}),
      style({opacity: 0.5, transform: 'translate3d(-150%,-50%,0)',  offset: 0.3}),
      style({opacity: 1, transform: 'translate3d(0,10%,0)',  offset: 0.7}),
      style({opacity: 1, transform: 'translate3d(0,0,0)',     offset: 1.0})
    ]))
  ]),
  // 出场动画
  transition(":leave", [
    animate(500, keyframes([
      style({opacity: 1, transform: 'translate3d(0,0,0)',     offset: 0}),
      style({opacity: 1, transform: 'translate3d(0,10%,0)', offset: 0.3}),
      style({opacity: 0.5, transform: 'translate3d(150%,-50%,0)',  offset: 0.7}),
      style({opacity: 0, transform: 'translate3d(400%,0,0)',  offset: 1.0})
    ]))
  ]),

]);
/*
并行动画组(Group)演示
 */
export const GroupAnimate = trigger('GroupAnimate',[
  //入场动画
  transition(":enter", [
    style({ opacity: 0,width: '0px',height: '0px',transform: 'translateX(-200%)'}),
    group([
      animate('1s ease', style({transform: 'translateX(0)'})),
      animate('1s 200ms ease', style({width: '100px'})),
      animate('1s 200ms ease', style({height: '100px'})),
      animate('0.5s', style({opacity: 1})),
    ])
  ]),
]);

/*
query选择器演示
用法和css选择器大致相同
 */
export const QueryAnimate = trigger('QueryAnimate',[
    transition('off=>on', [
      // 先全部隐藏
      query('div', style({ opacity: 0 })),
      // 再执行动画
      query('.box-top', animate('500ms',keyframes([
        style({opacity: 0, transform: 'translateY(-400%)', offset: 0}),
        style({opacity: 1, transform: 'translateY(0)',     offset: 1.0})
      ]) )),
      query('.box-center', animate('500ms',keyframes([
        style({opacity: 0, transform: 'translateX(-400%)', offset: 0}),
        style({opacity: 1, transform: 'translateX(0)',     offset: 1.0})
      ]) )),
      query('.box-foot', animate('500ms',keyframes([
        style({opacity: 0, transform: 'translateY(400%)', offset: 0}),
        style({opacity: 1, transform: 'translateY(0)',     offset: 1.0})
      ]) )),
      query('h2', animate('500ms',keyframes([
        style({transform:'scale(0.5)'}),
        style({transform: 'scale(1)'})
      ]) )),
    ]),
    transition('on=>off', [
      query('.box-top', animate('500ms',keyframes([
        style({opacity: 1, transform: 'translateY(0)'}),
        style({opacity: 0, transform: 'translateY(-400%)'})
      ]) )),
      query('.box-center', animate('500ms',keyframes([
        style({opacity: 1, transform: 'translateX(0)'}),
        style({opacity: 0, transform: 'translateX(-400%)'})
      ]) )),
      query('.box-foot', animate('500ms',keyframes([
        style({opacity: 1, transform: 'translateY(0)'}),
        style({opacity: 0, transform: 'translateY(400%)'})
      ]) )),
      query('h2', animate('500ms',keyframes([
        style({transform:'scale(1)'}),
        style({transform: 'scale(0.5)'})
      ]) )),
    ])
  ]);



/*
1、定义一个动画，左右两个状态加上颜色变化更容易理解吧
2、添加transition * => *
3、添加transition void => *
*/
export const RouteAnimate = trigger('RouteAnimate', [
  //入场动画
  transition(":enter", [
    style({ opacity: 0,transform: 'translate3d(200%,200%,0)'}),
    animate(500 )
  ]),
  // 出场动画
  transition(":leave", [
    style({ opacity: 1}),
    animate(500, style({ opacity: 0,transform: 'translate3d(200%,200%,0)'}))
  ]),
  ]);
