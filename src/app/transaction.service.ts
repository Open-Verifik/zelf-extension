import { Injectable } from "@angular/core";
import { Transaction, TransactionModel } from "./wallet";

@Injectable({
	providedIn: "root",
})
export class TransactionService {
	transactionData!: Transaction;

	constructor() {
		const temp = localStorage.getItem("temp_transactionData");

		if (temp) this.transactionData = new TransactionModel(JSON.parse(temp));
	}

	setTransactionData(data: Partial<Transaction>, syncInStorage?: boolean): void {
		console.log({ initial: this.transactionData });
		// If transactionData is not initialized, initialize it first
		if (!this.transactionData) {
			this.transactionData = new TransactionModel(data);
		} else {
			// Update each key-value pair in the transactionData object
			Object.assign(this.transactionData, data);
		}

		console.log({ final: this.transactionData });

		if (!syncInStorage) return;

		localStorage.setItem("temp_transactionData", JSON.stringify(this.transactionData));
	}

	getTransactionData(): any {
		return this.transactionData;
	}
}
