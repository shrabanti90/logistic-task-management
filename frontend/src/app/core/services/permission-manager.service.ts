import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionType, ROLES } from 'src/app/helpers';
import { UserService } from './user.service';

@Injectable({
	providedIn: 'root',
})
export class PermissionManagerService {
	constructor(private userService: UserService, private router: Router,) {}

	isGranted(permission: PermissionType) {
		let activePage = '';
		activePage = this.router.url.split('/')[1];
		const index = this.getActivePagePermissionIndex(activePage);
		const currentUser = this.userService.getCurrentUser();
		if (
			[ROLES.PROTO_SUPER_ADMIN].includes(
				currentUser.role
			) 
		) {
			if (index > -1) {
				return currentUser.accessManagement[index][permission.toLowerCase()];
			}
			return false;
		}
		 else {
			return false;
		}
	}

	getActivePagePermissionIndex(activeRoute) {
		const currentUser = this.userService.getCurrentUser();
		let index = -1;
		 if (activeRoute === 'tasks') {
			index = currentUser.accessManagement.findIndex((o) => o.type === 'task_management');
		}
		return index;
	}
}
