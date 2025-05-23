import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-notfound',
	templateUrl: './notfound.component.html',
	styleUrls: ['./notfound.component.scss'],
})
export class NotfoundComponent implements OnInit {
	constructor(private location: Location) {}

	ngOnInit(): void {}

	goBack(): void {
		this.location.back();
	}
}
