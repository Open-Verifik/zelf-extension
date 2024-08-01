import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry, finalize, from, switchMap } from "rxjs";
import * as openpgp from "openpgp";
import { ChromeService } from "./chrome.service";
@Injectable({
	providedIn: "root",
})
export class HttpWrapperService {
	public tail: Array<any> = [];
	private publicKey!: string;

	get progress(): boolean {
		return !!this.tail.length;
	}

	constructor(private _http: HttpClient, private _chromeService: ChromeService) {}

	// /**
	//  * send request
	//  * @param method - to determinate which function we will be using
	//  * @param url - url that we will requesting information
	//  * @param params - params that can go into the body or the query string param
	//  * @param options - headers or some other sort of params
	//  */
	// // tslint:disable-next-line:typedef
	// sendRequest(method: string, url: string, params: any = {}, options: any = {}) {
	// 	method = method.toLocaleLowerCase();

	// 	const authToken: string = localStorage.getItem("accessToken") || "";

	// 	let headers: any = {
	// 		timeout: 20,
	// 	};

	// 	if (authToken) {
	// 		headers["Authorization"] = `Bearer ${authToken}`;
	// 	}

	// 	if (params.encryption) {
	// 	}

	// 	switch (method) {
	// 		case "get":
	// 			return this.request(
	// 				this._http.get(url, {
	// 					params,
	// 					headers,
	// 					...options,
	// 				})
	// 			);
	// 		case "post":
	// 			return this.request(
	// 				this._http.post(url, params, {
	// 					headers,
	// 					...options,
	// 				})
	// 			);
	// 		case "put":
	// 			return this.request(
	// 				this._http.put(url, params, {
	// 					headers,
	// 					...options,
	// 				})
	// 			);
	// 		case "delete":
	// 			return this.request(
	// 				this._http.delete(url, {
	// 					headers,
	// 					...options,
	// 				})
	// 			);
	// 		default:
	// 			throw "method not provided";
	// 	}
	// }

	/**
	 * Send request
	 * @param method - to determine which function we will be using
	 * @param url - URL that we will be requesting information from
	 * @param params - params that can go into the body or the query string param
	 * @param options - headers or some other sort of params
	 */
	async sendRequest(method: string, url: string, params: any = {}, options: any = {}): Promise<any> {
		method = method.toLocaleLowerCase();

		const authToken: string = (await this._chromeService.getItem("accessToken")) || "";

		let headers: any = {
			timeout: 20,
		};

		if (authToken) {
			headers["Authorization"] = `Bearer ${authToken}`;
		}

		// Additional header or options logic here
		if (params.encryption) {
			// Handle encryption
		}

		try {
			switch (method) {
				case "get":
					return this.request(this._http.get(url, { params, headers, ...options }));
				case "post":
					return this.request(this._http.post(url, params, { headers, ...options }));
				case "put":
					return this.request(this._http.put(url, params, { headers, ...options }));
				case "delete":
					return this.request(this._http.delete(url, { headers, ...options }));
				default:
					throw new Error("Method not provided or unsupported");
			}
		} catch (error) {
			console.error("Error in sendRequest:", error);
			throw error;
		}
	}

	// // Helper method to process HTTP requests (just an example of what it might look like)
	private request(httpCall: any): Promise<any> {
		return httpCall
			.toPromise()
			.then((response: any) => response)
			.catch((error: any) => {
				throw error;
			});
	}

	// private request(a: Observable<any>): Observable<any> {
	// 	this.tail.push(a);
	// 	return a.pipe(
	// 		retry(0),
	// 		finalize(() => {
	// 			const index = this.tail.indexOf(a);
	// 			this.tail.splice(index, 1);
	// 		})
	// 	);
	// }

	setPublicKey(publicKey: string): void {
		this.publicKey = publicKey;
	}

	async encryptMessage(data: string): Promise<any> {
		if (!this.publicKey) throw new Error("cannot_encrypt_message");

		const publicKey = await openpgp.readKey({ armoredKey: this.publicKey });

		const encryptedMessage = await openpgp.encrypt({
			message: await openpgp.createMessage({ text: data }),
			encryptionKeys: publicKey,
		});

		return encryptedMessage;
	}

	// async decryptMessage(encryptedMessage: string, privateKeyArmored: string, passphrase: string): Promise<string> {
	// 	// const privateKey = await openpgp.readKey({ armoredKey: privateKeyArmored });
	// 	// await privateKey.decrypt(passphrase);
	// 	// const message = await openpgp.readMessage({
	// 	// 	armoredMessage: encryptedMessage,
	// 	// });
	// 	// const { data: decrypted } = await openpgp.decrypt({
	// 	// 	message,
	// 	// 	decryptionKeys: privateKey,
	// 	// });
	// 	// return decrypted;
	// }
}
