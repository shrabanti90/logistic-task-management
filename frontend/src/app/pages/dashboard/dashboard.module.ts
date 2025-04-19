import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { DashboardStatsComponent } from './dashboard-stats/dashboard-stats.component';
import { DashboardContentComponent } from './dashboard-content/dashboard-content.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
	declarations: [
		DashboardComponent,
		DashboardStatsComponent,
		DashboardContentComponent,
	],
	imports: [CommonModule, DashboardRoutingModule, SharedModule, InfiniteScrollModule],
})
export class DashboardModule {}
