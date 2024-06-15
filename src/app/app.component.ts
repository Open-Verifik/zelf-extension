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

	constructor(private _httpWrapperService: HttpWrapperService, private _walletService: WalletService) {}

	ngOnInit(): void {
		this._getPublicKey();
	}

	_getPublicKey(): void {
		this._httpWrapperService.sendRequest("get", `${this.apiUrl}/api/sessions/yek-cilbup`).subscribe(async (response) => {
			this.publicKey = response.data.publicKey;

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
			.subscribe((response) => {
				console.log({ response });
			});
	}
}
