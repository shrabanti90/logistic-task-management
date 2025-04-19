import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core';
import { ToastService } from 'src/app/core/services/toast.service';
import { ROLES,  verificationStatus } from 'src/app/helpers';
import { Router } from '@angular/router';

@Component({
	selector: 'app-dashboard-stats',
	templateUrl: './dashboard-stats.component.html',
	styleUrls: ['./dashboard-stats.component.scss'],
})
export class DashboardStatsComponent implements OnInit {
	
	
	statsCards: any = [];
	userWallet: any = {};
	userBill: any = {};
	currentUser: any;
	isRoleAccess: boolean = false;

	constructor(
		private toastService: ToastService,
		private userService: UserService,
		private route: Router
	) {
		this.currentUser = this.userService.getCurrentUser();
		
			
	}

	ngOnInit(): void {
		this.statsCards ;
		
	}
	
	

	

	navigateTo(path) {
		if (path) {
			this.route.navigateByUrl(path);
		}
	}
}
