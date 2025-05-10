import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { HttpWrapperService } from "../http-wrapper.service";

@Injectable({
    providedIn: "root",
})
export class AvaxService {
    baseUrl: String = environment.apiUrl;

    constructor(private _httpWrapper: HttpWrapperService) {}

    requestTransactionDetails(transactionHash: string): Promise<any> {
        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/avalanche/transaction/${transactionHash}`);
    }
}
