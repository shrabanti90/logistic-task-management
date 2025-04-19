import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbAccordionModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { MaterialModule } from './material.module';
import { CapitalizePipe, TruncatePipe } from '../pipes';
import { VerificationAutoTabDirective } from '../directives/auto-focus.directive';
import { InputIntegerDirective } from '../directives/inputInteger.directive';
import { NgbdSortableHeader } from '../directives/sortable.directive';

import { LoadingComponent } from './components/common/loading/loading.component';
import { ToastComponent } from './components/common/toast/toast.component';
import { MobileNumberComponent } from './components/common/mobile-number/mobile-number.component';
import { AlertModalComponent } from './components/modals/alert-modal';

import {
	MatSnackBarHorizontalPosition,
	MatSnackBarVerticalPosition,
	MAT_SNACK_BAR_DATA,
	MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import { BreadcrumbComponent } from './components/common/breadcrumb/breadcrumb.component';
import { IsGrantedDirective } from '../directives/is-granted.directive';

import { PaginationComponent } from './components/common/pagination/pagination.component';

const horizontalPosition: MatSnackBarHorizontalPosition = 'center';
const verticalPosition: MatSnackBarVerticalPosition = 'top';

const DIRECTIVES = [InputIntegerDirective, VerificationAutoTabDirective, NgbdSortableHeader, IsGrantedDirective];

const PIPES = [TruncatePipe, CapitalizePipe];

const COMPONENTS = [
	ToastComponent,
	AlertModalComponent,
	LoadingComponent,
	MobileNumberComponent,
	BreadcrumbComponent,
	PaginationComponent,
];

const MODULE = [
	CommonModule,
	NgbAccordionModule,
	NgbModule,
	NgSelectModule,
	MaterialModule,
	FormsModule,
	ReactiveFormsModule,
];

@NgModule({
	imports: [...MODULE],
	declarations: [...PIPES, ...DIRECTIVES, ...COMPONENTS],
	exports: [...PIPES, ...DIRECTIVES, ...MODULE, ...COMPONENTS],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
	providers: [
		{
			provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
			useValue: {
				duration: 2500,
				horizontalPosition: horizontalPosition,
				verticalPosition: verticalPosition,
			},
		},
		{ provide: MAT_SNACK_BAR_DATA, useValue: {} },
	],
})
export class SharedModule {}
