import { Component } from '@angular/core';
import { UserService } from './core';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [],
})
export class AppComponent {
	title = 'ps-admin-ui';
	constructor(private userService: UserService) {}

	ngOnInit(): void {
		this.userService.populate();
	}
}
