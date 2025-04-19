import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { ROLES } from 'src/app/helpers';
import { User } from 'src/app/models';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
	@Output() collapsedEvent = new EventEmitter();
	@Input() collapsedNav: boolean = false;
	@Input() currentUser: User;

	organizationList: any = [];
	role = ROLES;
	collectionSize: number = 0;
	page: number = 1;
	pageSize: number = 10;
	selectedClient: any = { id: 0, name: 'My Client' };
	isRoleAccess: boolean = false;
	organizationName: string;
	user: any;
	constructor(
		private userService: UserService,
		private router: Router,
		private spinnerService: SpinnerService,
		private toastService: ToastService
	) {
		
	}

	ngOnInit(): void {
		this.isRoleAccess = this.userService.switchRoleAccess();
		this.user = this.userService.getCurrentUser();
		
		
	}

	toggleSideBar(): void {
		this.collapsedEvent.emit(!this.collapsedNav);
	}

	logout(): void {
		this.userService.purgeAuth();
		window.sessionStorage.removeItem('clientId');
		let path = '/login';
		if (this.currentUser?.role === ROLES.PROTO_SUPER_ADMIN) path = '/admin-login';
		this.router.navigate([path]);
	}

	
	onSearch($event) {
		this.page = 1;
		this.organizationList = [];
		this.collectionSize = 0;
	}
	onScrollClient() {
		if (
			this.organizationList.length - (window.sessionStorage.getItem('clientId') ? 2 : 1) ===
			this.collectionSize
		) {
			return;
		}
		this.page++;
	}

	changeClient($event): void {
		if ($event.id) {
			window.sessionStorage['clientId'] = $event.id;
		} else {
			window.sessionStorage.removeItem('clientId');
		}
		this.router.navigate(['/dashboard'], { replaceUrl: true }).then(() => {
			window.location.reload();
			this.toastService.success(`Switch to ${$event.registeredName} successfully`);
		});
	}
}
