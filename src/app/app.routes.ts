import { Routes, RouterModule } from '@angular/router'
import { AccountRoutes } from './account/account.routes'
import { ModuleWithProviders } from "@angular/core";
import { ExtendRoutes } from './extend/extend.routes';

const ROUTER_CONFIG: Routes = [
	...ExtendRoutes,
	{
		path: '',
		redirectTo: 'my/home',
		pathMatch: 'full'
	},
	...AccountRoutes,   //需要放在空值之后
	{
		path: '**',
		redirectTo: 'my/home'
	}
]
// console.log('123',ROUTER_CONFIG);

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(ROUTER_CONFIG,{useHash: true});
