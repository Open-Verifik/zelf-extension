import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, finalize } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class HttpWrapperService {
	public tail: Array<any> = [];

	get progress(): boolean {
		return !!this.tail.length;
	}

	constructor(private _http: HttpClient) {}
	/**
	 * send request
	 * @param method - to determinate which function we will be using
	 * @param url - url that we will requesting information
	 * @param params - params that can go into the body or the query string param
	 * @param options - headers or some other sort of params
	 */
	// tslint:disable-next-line:typedef
	sendRequest(method: string, url: string, params: any = {}, options: any = {}) {
		method = method.toLocaleLowerCase();

		const authToken: string = localStorage.getItem("accessToken") || "";

		let headers: any = {
			timeout: 20,
		};

		if (authToken) {
			headers["Authorization"] = `Bearer ${authToken}`;
		}

		switch (method) {
			case "get":
				return this.request(
					this._http.get(url, {
						params,
						headers,
						...options,
					})
				);
			case "post":
				return this.request(
					this._http.post(url, params, {
						headers,
						...options,
					})
				);
			case "put":
				return this.request(
					this._http.put(url, params, {
						headers,
						...options,
					})
				);
			case "delete":
				return this.request(
					this._http.delete(url, {
						headers,
						...options,
					})
				);
			default:
				throw "method not provided";
		}
	}

	private request(a: Observable<any>): Observable<any> {
		this.tail.push(a);
		return a.pipe(
			retry(0),
			finalize(() => {
				const index = this.tail.indexOf(a);
				this.tail.splice(index, 1);
			})
		);
	}
}
