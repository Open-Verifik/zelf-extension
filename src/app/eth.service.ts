import { Injectable } from "@angular/core";
import Web3 from "web3";
import { isAddress } from "web3-validator";
import { BehaviorSubject, Observable } from "rxjs";
import * as bip39 from "bip39";
import { HDNodeWallet, ethers } from "ethers";
import { HttpClient } from "@angular/common/http";

@Injectable({
	providedIn: "root",
})
export class EthereumService {
	private web3: Web3;

	private account: BehaviorSubject<string> = new BehaviorSubject("");

	constructor(private http: HttpClient) {
		this.web3 = new Web3(new Web3.providers.HttpProvider("https://sepolia.infura.io/v3/0714254b0de84112a865096da1050ae5"));
	}

	changeNetwork(production?: boolean): void {
		const url = production
			? "https://mainnet.infura.io/v3/0714254b0de84112a865096da1050ae5"
			: "https://sepolia.infura.io/v3/0714254b0de84112a865096da1050ae5";

		this.web3 = new Web3(new Web3.providers.HttpProvider(url));
	}

	createAccount(): any {
		// return {
		// 	privateKey: "0x39179c1618f02fff134aa70df439b7bd86757d6beb82af6d1304a48d4fe14f6b",
		// };
		const account = this.web3.eth.accounts.create();
		this.account.next(account.address);

		return account; // Be extremely cautious with how you handle the private key
	}

	validateMnemonic(mnemonic: string): boolean {
		return bip39.validateMnemonic(mnemonic);
	}

	generateAddressFromMnemonic(mnemonic: string): HDNodeWallet | null {
		try {
			const wallet = ethers.Wallet.fromPhrase(mnemonic);

			return wallet;
		} catch (exception) {
			return null;
		}
	}

	importAccount(privateKey: string): void {
		const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
		this.web3.eth.accounts.wallet.add(account);
		this.account.next(account.address);
	}

	getAccount(): BehaviorSubject<string> {
		return this.account;
	}

	async getBalance(): Promise<string> {
		const balance = await this.web3.eth.getBalance(this.account.value);
		return this.web3.utils.fromWei(balance, "ether");
	}

	async getBalanceByAddress(address: string): Promise<string> {
		try {
			const balanceWei = await this.web3.eth.getBalance(address);

			const balanceEth = this.web3.utils.fromWei(balanceWei, "ether");

			console.log({ balanceEth, address });

			return balanceEth;
		} catch (error) {
			console.error("Error getting balance:", { error });

			throw error;
		}
	}

	checkIfValidAddress(address: string): boolean {
		return isAddress(address);
	}

	// async sendTransaction(to: string, value: number): Promise<void> {
	// 	const valueWei = this.web3.utils.toWei(value.toString(), "ether");
	// 	const gasPrice = await this.web3.eth.getGasPrice(); // Get current gas price
	// 	const gasEstimate = await this.web3.eth.estimateGas({
	// 		from: this.account.value,
	// 		to: to,
	// 		value: valueWei,
	// 	});

	// 	// Calculate the total cost (gas * gasPrice + value)
	// 	const totalCost = this.web3.utils.toBigInt(gasEstimate).mul(this.web3.utils.toBigInt(gasPrice)).add(this.web3.utils.toBigInt(valueWei));

	// 	// Check if the balance is sufficient
	// 	const balance = await this.web3.eth.getBalance(this.account.value);

	//     console.log({totalCost: this.web3.utils.toBigInt(balance).lt(totalCost)});

	// 	if (false) {
	// 		throw new Error("Insufficient funds: Balance is too low for this transaction.");
	// 	}

	// 	const tx = {
	// 		from: this.account.value,
	// 		to: to,
	// 		value: valueWei,
	// 		gas: gasEstimate,
	// 		gasPrice: gasPrice,
	// 	};

	// 	await this.web3.eth.sendTransaction(tx);
	// }

	async sendTransaction(to: string, value: number): Promise<any> {
		const valueWei = this.web3.utils.toWei(value.toString(), "ether");
		const gasPrice = await this.web3.eth.getGasPrice();
		const gasEstimate = await this.web3.eth.estimateGas({
			from: this.account.value,
			to: to,
			value: valueWei,
		});

		// Convert using BigInt
		const valueWeiBN = BigInt(valueWei);
		const gasPriceBN = BigInt(gasPrice);
		const gasEstimateBN = BigInt(gasEstimate);

		// Perform arithmetic using BigInt
		const totalCost = gasEstimateBN * gasPriceBN + valueWeiBN;

		const balance = await this.web3.eth.getBalance(this.account.value);
		const balanceBN = BigInt(balance);

		if (balanceBN < totalCost) {
			throw new Error("Insufficient funds: Balance is too low for this transaction.");
		}

		const tx = {
			from: this.account.value,
			to: to,
			value: valueWei,
			gas: Number(gasEstimate), // BigInt to number for gas, ensure it's safe to convert
			gasPrice: gasPrice,
		};

		return await this.web3.eth.sendTransaction(tx);
	}

	getGasPrices(): Observable<any> {
		const params = {
			module: "gastracker",
			action: "gasoracle",
			apikey: "ZEAEI2GIZ3ARATBHPXB6P2RZTJW38CXG3V",
		};
		return this.http.get(`https://api.etherscan.io/api`, { params });
	}
}
