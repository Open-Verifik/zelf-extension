import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { HttpWrapperService } from "./http-wrapper.service";
import { environment } from "environments/environment";
import { WalletService } from "./wallet.service";
import { ChromeService } from "./chrome.service";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "app-root",
    template: `<div class="flex flex-col flex-auto main-div" [ngClass]="isPopout ? 'main-div--popout' : ''">
        <div class="flex flex-col flex-auto">
            <router-outlet></router-outlet>
        </div>
    </div>`,
    styleUrls: ["./app.component.scss", "./main.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit, OnDestroy {
    private unsubscriber$ = new Subject<void>();
    private publicKey!: string;

    apiUrl: string = environment.apiUrl;
    isPopout: boolean = false;

    constructor(private _httpWrapperService: HttpWrapperService, private _walletService: WalletService, private _chromeService: ChromeService) {
        this.isPopout = this._chromeService.isPopout;

        this._chromeService.isPopout$.pipe(takeUntil(this.unsubscriber$)).subscribe((isPopout) => {
            this.isPopout = isPopout;
        });
    }

    ngOnInit(): void {
        this._getPublicKey();
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    _getPublicKey(): void {
        let { hash } = this._walletService.getUserFingerprint();

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
