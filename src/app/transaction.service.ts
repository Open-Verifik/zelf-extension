import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class TransactionService {
	transactionData!: any;

	constructor() {}

	setTransactionData(data: any, key?: string): void {
		if (!key) {
			this.transactionData = data;

			console.log({ transactionData: this.transactionData });

			return;
		}

		this.transactionData[key] = data;
	}

	getTransactionData(): any {
		return this.transactionData;
	}
}
