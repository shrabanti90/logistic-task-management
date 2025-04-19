import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core';
import {ROLES } from './helpers';
import { AdminLoginComponent } from './pages/auth/admin-login/admin-login.component';
import { VerifyAdminMobileComponent } from './pages/auth/verify-admin-mobile/verify-admin-mobile.component';
import { VerifyEmailComponent } from './pages/auth/verify-email/verify-email.component';
import { VerifyMobileComponent } from './pages/auth/verify-mobile/verify-mobile.component';
import { MainLayoutComponent } from './shared/components/common/main-layout/main-layout.component';
import { NotfoundComponent } from './shared/components/common/notfound/notfound.component';

const routes: Routes = [
	{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
	{
		path: 'admin-login',
		data: { title: 'Admin Login' },
		component: AdminLoginComponent,
	},
	
	{
		path: ':phone/verify-admin-mobile',
		data: { title: 'Verify-Admin-mobile' },
		component: VerifyAdminMobileComponent,
	},
	{
		path: ':phone/verify-mobile',
		data: { title: 'Verify-mobile' },
		component: VerifyMobileComponent,
	},
	{
		path: 'verify-email',
		data: { title: 'Verify-email' },
		component: VerifyEmailComponent,
	},
	
	
	
	
	{
		path: '',
		component: MainLayoutComponent,
		children: [
			{
				path: 'dashboard',
				canLoad: [AuthGuard],
				data: {
					breadcrumb: 'Dashboard',
					role: ROLES.getWebArray(),
				},
				loadChildren: () => import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
			},
			
			
			{
				path: 'tasks',
				canLoad: [AuthGuard],
				data: {
					breadcrumb: 'Tasks',
					role: [...ROLES.getWebArray()],
				},
				loadChildren: () => import('./pages/task/task.module').then((m) => m.TaskModule),
			},
			
		],
	},
	{ path: '404', component: NotfoundComponent, data: { title: 'Page 404' } },
	{ path: '**', component: NotfoundComponent },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			preloadingStrategy: PreloadAllModules,
			scrollPositionRestoration: 'enabled',
		}),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
