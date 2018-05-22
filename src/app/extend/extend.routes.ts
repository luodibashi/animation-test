import { Route } from '@angular/router'

// 路由守卫
import { ExtendGuard } from './extend.guard'
import { TestComponent } from './test/test.component';
import { LiveComponent } from './live/live.component';
import { AnimationComponent } from './animation/animation.component';

export const ExtendRoutes: Route[] = [{
  path: 'extend',
	canActivateChild: [ ExtendGuard ],
  children:[
    {
      path: 'test',
      component: TestComponent
    },
    {
      path: 'live',
      component: LiveComponent
    },
    {
      path: 'animation',
      component: AnimationComponent
    }
  ]
}]