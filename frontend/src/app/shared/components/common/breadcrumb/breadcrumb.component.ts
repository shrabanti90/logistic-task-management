import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { Breadcrumb } from 'src/app/models';

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
	public breadcrumbs: Breadcrumb[];

	constructor(private router: Router, private activatedRoute: ActivatedRoute) {
		this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
	}

	ngOnInit() {
		this.router.events
			.pipe(
				filter((event: any) => event instanceof NavigationEnd),
				distinctUntilChanged()
			)
			.subscribe(() => {
				this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
			});
	}

	/**
	 * Recursively build breadcrumb according to activated route.
	 * @param route
	 * @param url
	 * @param breadcrumbs
	 */
	buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
		//If no routeConfig is avalailable we are on the root path
		let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data['breadcrumb'] : '';
		let isClickable = route.routeConfig && route.routeConfig.data && route.routeConfig.data['isClickable'];
		let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';

		// If the route is dynamic route such as ':id', remove it
		const lastRoutePart = path.split('/').pop();
		const isDynamicRoute = lastRoutePart.startsWith(':');
		if (isDynamicRoute && !!route.snapshot) {
			const paramName = lastRoutePart.split(':')[1];
			path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
			label = route.snapshot.params[paramName];
		}

		//In the routeConfig the complete path is not available,
		//so we rebuild it each time
		const nextUrl = path ? `${url}/${path}` : url;

		const breadcrumb: Breadcrumb = {
			label: label,
			url: nextUrl,
		};
		// Only adding route with non-empty label
		const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
		if (route.firstChild) {
			//If we are not on our current path yet,
			//there will be more children to look after, to build our breadcumb
			return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
		}
		return newBreadcrumbs;
	}

	navigateToPage(breadcrumb) {
		this.router.navigateByUrl(breadcrumb.url);
	}

	linkActive(url: string) {
		console.log(url);
		console.log(this.router.url);
		return this.router.url.includes(url) ? true : false;
	}
}
