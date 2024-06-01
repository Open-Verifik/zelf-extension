import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { HttpWrapperService } from "./http-wrapper.service";
import { environment } from "environments/environment";
import * as openpgp from "openpgp";
import { WalletService } from "./wallet.service";

@Component({
	selector: "app-root",
	template: `<!-- Wrapper -->
		<div class="flex flex-col flex-auto w-full main-div">
			<!-- Content -->
			<div class="flex flex-col flex-auto">
				<router-outlet *ngIf="true"></router-outlet>
			</div>
		</div>`,
	styleUrls: ["./app.component.scss", "./main.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
	apiUrl: string = environment.apiUrl;
	private publicKey!: string;
	private secretkey!: string;

	constructor(private _httpWrapperService: HttpWrapperService, private _walletService: WalletService) {}

	ngOnInit(): void {
		this._getPublicKey();
	}

	_getPublicKey(): void {
		this._httpWrapperService.sendRequest("get", `${this.apiUrl}/api/sessions/yek-cilbup`).subscribe(async (response) => {
			this.publicKey = response.publicKey;

			this._httpWrapperService.setPublicKey(this.publicKey);

			this.secretkey = response.privateKey; // might not be used...

			this.encryptAndSend(this.publicKey);
		});
	}

	async encryptAndSend(publicKey: any): Promise<void> {
		const message = "ifjidjf idifjdi jfidj 111122";

		const encryptedMessage = await this._httpWrapperService.encryptMessage(JSON.stringify(message));

		// Send encrypted data to backend
		this._httpWrapperService
			.sendRequest("post", `${this.apiUrl}/api/sessions/decrypt-content`, {
				encryption: true,
				message: encryptedMessage,
			})
			.subscribe((response) => {
				console.log({ response });

				this._sampleDecrypt(response.encryptSomethingBack);
			});
	}

	_sampleDecrypt(encryptedMessage: string): void {}
}
