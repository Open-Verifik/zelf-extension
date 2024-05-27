/// <reference types="chrome"/>
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EthereumService } from "app/eth.service";
import { WalletService } from "app/wallet.service";
import { environment } from "environments/environment";
@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["../main.scss", "./home.component.scss"],
})
export class HomeComponent implements OnInit {
	title: string = "something";
	wallet: any;
	balances: any;

	constructor(private _router: Router, private _walletService: WalletService, private _ethService: EthereumService) {
		this.balances = {};
	}

	openFullPage(): void {
		// Use chrome.runtime.getURL to get the full URL of the extension page
		const url = chrome.runtime.getURL("index.html");
		chrome.tabs.create({ url });
	}

	ngOnInit(): void {
		const walletId = localStorage.getItem("walletId") || "663ab8c316f85d1b95b02cb3";

		if (!walletId) {
			this._router.navigate(["/onboarding"]);
			return;
		}

		this._getWallet(walletId);

		this._testing();
	}

	async _testing(): Promise<any> {
		const fakeAccount = this._ethService.createAccount();

		this._ethService.importAccount(fakeAccount.privateKey);

		const _getAccount = this._ethService.getAccount();

		// const transaction = await this._ethService.sendTransaction("0x6A4D2A478E5F3274c0De97903c7D4B75032Bd9a8", 0.001);

		const balance = await this._ethService.getBalance();

		_getAccount.subscribe(async (value) => {
			const _balance = await this._ethService.getBalanceByAddress(value);
			console.log({ value, balance, _balance });

			this.balances = {
				eth: parseFloat(_balance).toFixed(5),
			};
		});
	}

	_getWallet(walletId: string): void {
		this._walletService.requestWallet(walletId).subscribe({
			next: (response) => {
				this.wallet = response.data;

				console.log({
					responseWallet: this.wallet,
				});
			},
			error: (error) => {},
			complete: () => {},
		});
	}

	_redirectToOnboarding(): void {
		this._router.navigate(["/onboarding"]);
	}

	getAddress(): string {
		const address = this.wallet?.publicData?.ethAddress || "";

		if (!address) return "";

		const firstPart = address.slice(0, 8);
		const lastPart = address.slice(-6);
		return `${firstPart}...${lastPart}`;
	}
}
