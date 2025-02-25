import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { HttpWrapperService } from "./http-wrapper.service";
import { environment } from "environments/environment";
import { WalletService } from "./wallet.service";
import { ChromeService } from "./chrome.service";

@Component({
	selector: "app-root",
	template: `<div class="flex flex-col flex-auto main-div" [ngClass]="isPopOut ? 'main-div--popout' : ''">
		<div class="flex flex-col flex-auto">
			<router-outlet></router-outlet>
		</div>
	</div>`,
	styleUrls: ["./app.component.scss", "./main.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
	private publicKey!: string;

	apiUrl: string = environment.apiUrl;
	isPopOut: boolean = false;

	constructor(private _httpWrapperService: HttpWrapperService, private _walletService: WalletService, private _chromeService: ChromeService) {
		this.isPopOut = this._chromeService.isPopOut;
	}

	ngOnInit(): void {
		this._getPublicKey();
	}

	_getPublicKey(): void {
		let { hash } = this._walletService.generateUniqueId();

		const url = `${this.apiUrl}/api/sessions/yek-cilbup`;

		this._httpWrapperService
			.sendRequest("get", url, {
				identifier: hash,
			})
			.then((response) => {
				this.publicKey = response.data;

				this._chromeService.setItem("publicKey", this.publicKey);
				this._httpWrapperService.setPublicKey(this.publicKey);
			});
	}

	async encryptAndSend(publicKey: any): Promise<void> {
		const message = "Test test";

		const encryptedMessage = await this._httpWrapperService.encryptMessage(JSON.stringify(message));

		// Send encrypted data to backend
		this._httpWrapperService
			.sendRequest("post", `${this.apiUrl}/api/sessions/decrypt-content`, {
				encryption: true,
				message: encryptedMessage,
			})
			.then((response) => {});
	}
}
