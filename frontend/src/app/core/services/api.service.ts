import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { catchError } from 'rxjs/operators';

@Injectable()
export class ApiService {
	constructor(private http: HttpClient) {}

	public createBaseUrl(type: string): string {
		return environment.USER_API_URL;
	}

	get(path: string, params: HttpParams = new HttpParams(), service: string): Observable<any> {
		const URL: string = this.createBaseUrl(service);
		return this.http.get(`${URL}${path}`, { params }).pipe(catchError(this.formatErrors));
	}

	put(path: string, body: Object = {}, service: string): Observable<any> {
		const URL: string = this.createBaseUrl(service);
		return this.http.put(`${URL}${path}`, JSON.stringify(body)).pipe(catchError(this.formatErrors));
	}

	patch(path: string, body: Object = {}, service: string): Observable<any> {
		const URL: string = this.createBaseUrl(service);
		return this.http.patch(`${URL}${path}`, JSON.stringify(body)).pipe(catchError(this.formatErrors));
	}

	post(path: string, body: Object = {}, service: string): Observable<any> {
		const URL: string = this.createBaseUrl(service);
		return this.http.post(`${URL}${path}`, JSON.stringify(body)).pipe(catchError(this.formatErrors));
	}

	delete(path: string, service: string): Observable<any> {
		const URL: string = this.createBaseUrl(service);
		return this.http.delete(`${URL}${path}`).pipe(catchError(this.formatErrors));
	}

	bulkExport(path: string, params: HttpParams = new HttpParams(), service: string): Observable<any> {
		const URL: string = this.createBaseUrl(service);
		return this.http.get(`${URL}${path}`, { params, responseType: 'blob' }).pipe(catchError(this.formatErrors));
	}
	postBulkExport(path: string, body: Object = {}, service: string): Observable<any> {
		const URL: string = this.createBaseUrl(service);
		return this.http.post(`${URL}${path}`, body, { responseType: 'blob' }).pipe(catchError(this.formatErrors));
	}
	public formatErrors(error: any) {
		if (error && (error.status === 403 || error.status === 401)) {
			location.reload();
		}
		let err = error.error;
		if (err.error) {
			err = err.error;
			if (err && err.error_params && err.error_params.length > 0) {
				const errors = err.error_params.map((e: any) => e.message);
				return throwError(errors || ['Oops something went wrong!']);
			} else if (err && err.errors && err.errors.length > 0) {
				return throwError(err.errors || ['Oops something went wrong!']);
			} else {
				return throwError(['Oops something went wrong!']);
			}
		} else {
			return throwError(
				err ? (err.errors ? err.errors : 'Oops something went wrong!') : 'Oops something went wrong!'
			);
		}
	}
}
