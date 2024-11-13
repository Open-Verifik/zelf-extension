import { Injectable } from "@angular/core";

import { environment } from "../environments/environment";
import { HttpWrapperService } from "./http-wrapper.service";

@Injectable({
	providedIn: "root",
})
export class ZelfNameService {
	baseUrl: String = environment.apiUrl;
	variables: any;

	constructor(private _httpWrapper: HttpWrapperService) {
		this.variables = {
			zelfName: null,
			price: 0,
			zelfFile: null,
		};
	}

	searchZelfName(zelfName: string): Promise<any> {
		return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/zelf-name-service/search?zelfName=${zelfName}`);
	}

	setZelfName(zelfName: string, price: number, saveInStorage: boolean): void {
		this.variables.zelfName = zelfName;
		this.variables.price = price;

		zelfName && saveInStorage ? localStorage.setItem("zelfName", zelfName) : localStorage.removeItem("zelfName");
	}

	setZelfFile(zelfNameObject: any): void {
		this.variables.zelfFile = zelfNameObject;
	}

	getZelfName(): string {
		return this.variables.zelfName;
	}

	getZelfFile(): string {
		return this.variables.zelfFile;
	}
}
