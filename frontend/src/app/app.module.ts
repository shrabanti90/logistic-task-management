import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './core';
import { SharedModule } from './shared/shared.module';
import { VerifyMobileComponent } from './pages/auth/verify-mobile/verify-mobile.component';
import { VerifyEmailComponent } from './pages/auth/verify-email/verify-email.component';
import { HeaderComponent } from './shared/components/common/header/header.component';
import { MainLayoutComponent } from './shared/components/common/main-layout/main-layout.component';
import { AdminLoginComponent } from './pages/auth/admin-login/admin-login.component';
import { NotfoundComponent } from './shared/components/common/notfound/notfound.component';
import { VerifyAdminMobileComponent } from './pages/auth/verify-admin-mobile/verify-admin-mobile.component';

import { OtpInputModule } from './pages/otp-input/otp-input.module';

const COMPONENTS = [
	NotfoundComponent,
	HeaderComponent,
	MainLayoutComponent,
	AdminLoginComponent,
	VerifyMobileComponent,
	VerifyEmailComponent,
	VerifyAdminMobileComponent
];

@NgModule({
	declarations: [
		AppComponent,
		...COMPONENTS,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		NgbModule,
		BrowserAnimationsModule,
		HttpClientModule,
		CoreModule,
		SharedModule,
		OtpInputModule,
	],
	providers: [],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
