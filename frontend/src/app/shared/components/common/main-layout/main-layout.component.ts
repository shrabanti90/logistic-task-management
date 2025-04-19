import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';
import {
	verificationList,
	ROLES,
	adminSideBarItems,
} from 'src/app/helpers';
import { SideBar } from 'src/app/models/shared.mode';
import { User } from 'src/app/models/user.model';

@Component({
	selector: 'app-main-layout',
	templateUrl: './main-layout.component.html',
	styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit, OnDestroy {
	collapsedNav: boolean = true;
	mobileQuery: MediaQueryList;
	sideBarList: Array<SideBar> = [];
	public user: User;
	private _mobileQueryListener: () => void;
	private iconsList: string[] = [
		'dashboard',
		'tasks',
	];
	currentUser: User;
	checkList = [];
	public userPlanItems = [];
	verificationList = verificationList;
	showGettingSubItem: boolean = false;
	currentPlan: any = [];
	ROLES = ROLES;
	constructor(
		changeDetectorRef: ChangeDetectorRef,
		media: MediaMatcher,
		private userService: UserService,
		public router: Router,
		private matIconRegistry: MatIconRegistry,
		private domSanitizer: DomSanitizer,
	) {
		this.mobileQuery = media.matchMedia('(max-width: 600px)');
		this.collapsedNav = this.mobileQuery.matches;
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.registerIcons();
		this.setSubMenuItem();
		
	}

	setSubMenuItem() {
		this.router.events
			.pipe(
				filter((event: any) => event instanceof NavigationEnd),
				distinctUntilChanged()
			)
			.subscribe((data) => {
					this.checkList = [];
					this.showGettingSubItem = false;
			});
	}

	ngOnInit(): void {
		this.userService.currentUser.subscribe((data) => {
			this.currentUser = data;
			this.setSideBar();
			
		});
	}

	setSideBar() {
		this.sideBarList = adminSideBarItems;
	}

	

	viewSideBarItem(item): boolean {
			 if (!['dashboard'].includes(item.path)) {
				let index = this.checkAccess(item.path);
				if (index > -1) {
					return this.currentUser.accessManagement[index]['view'];
				}
				return false;
			}
			return true;
	}

	disableItems(item): boolean {
		return false;
	}

	checkAccess(path: string): number {
		switch (path) {
			case 'tasks':
				return this.currentUser.accessManagement.findIndex((e) => e.type === 'task_management');
			default:
				return 0;
		}
	}

	getRoleAccess() {
		if (
			
			
			[ROLES.PROTO_SUPER_ADMIN].includes(
				this.currentUser.role
			)
		) {
			return true;
		} 
		return false;
	}

	

	setUser(): void {
		this.user = this.userService.getCurrentUser();
	}

	toggleSideBar($event: any): void {
		this.collapsedNav = $event;
	}

	linkActive(url: string) {
		return this.router.url.includes(url) ? 'is-active' : '';
	}

	ngOnDestroy(): void {
		this.mobileQuery.removeListener(this._mobileQueryListener);
	}

	registerIcons(): void {
		this.iconsList.map((icons) => {
			this.matIconRegistry.addSvgIcon(
				icons,
				this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icons}.svg`)
			);
		});
	}
	navigateTo(path: string): void {
		this.router.navigate([path]);
	}
}
