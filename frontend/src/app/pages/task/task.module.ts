import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
	declarations: [
		TaskListComponent,
		TaskDetailsComponent,
	],
	imports: [CommonModule, TaskRoutingModule, SharedModule],
})
export class TaskModule {}
