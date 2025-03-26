import { CommonModule } from "@angular/common";
import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { CaptchaService } from "app/captcha.service";
import { ChromeService } from "app/chrome.service";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { TransactionService } from "app/transaction.service";
import { AddressBook, Token, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";
import { debounceTime, Subject, takeUntil } from "rxjs";

@Component({
    imports: [CommonModule, MatButtonModule, RouterModule, ReactiveFormsModule, TranslocoModule, MatProgressSpinnerModule, AddressMaskPipe],
    selector: "send-transaction",
    standalone: true,
    styleUrls: ["./send-transaction.component.scss"],
    templateUrl: "./send-transaction.component.html",
})
export class SendTransactionComponent implements OnDestroy {
    private unsubcriber$: Subject<void> = new Subject<void>();
    private _captchaToken: string = "";

    balance: number = 0;
    form!: UntypedFormGroup;
    foundAddress!: WalletModel;
    fromAddress: string = "";
    token: Token;
    recentAddresses: AddressBook[] = [];
    searching: boolean = false;
    withdrawStep: boolean = false;

    constructor(
        private _captchaService: CaptchaService,
        private _chromeService: ChromeService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _transactionService: TransactionService,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService
    ) {
        this._transactionService.toAddress = "";
        this._transactionService.withdrawalAmount = 0;

        this.token = this._transactionService.token;

        this.balance = this._transactionService.fromBalance;
        this.fromAddress = this._transactionService.fromAddress;
        this.recentAddresses = this._transactionService.findAddressInRecentAddresses("tokenType", this.token.tokenType);

        this._initForm();
    }

    ngOnDestroy(): void {
        this.unsubcriber$.next();
        this.unsubcriber$.complete();
    }

    private async _captchaGeneration(): Promise<any> {
        if (this._chromeService.isExtension) return;

        try {
            this._captchaToken = await this._captchaService.executeRecaptcha("preview");
        } catch (error) {
            console.error("reCAPTCHA failed:", error);
        }
    }

    private _getAddressPattern(): RegExp {
        let pattern: RegExp = /.*/;

        if (this.token.tokenType === "ETH") pattern = this._walletService.ETHRegex;
        if (this.token.tokenType === "SOL") pattern = this._walletService.SOLRegex;
        if (this.token.tokenType === "BTC") pattern = this._walletService.BTCRegex;

        return pattern;
    }

    private _greaterThanValidator(minValue: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            return value > minValue ? null : { greaterThan: { requiredValue: minValue, actualValue: value } };
        };
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            amount: [
                0,
                [Validators.required, Validators.min(0), Validators.max(this._transactionService.fromBalance), this._greaterThanValidator(0)],
            ],
            toAddress: ["", [Validators.required]],
        });

        this.form
            .get("toAddress")
            ?.valueChanges.pipe(takeUntil(this.unsubcriber$), debounceTime(500))
            .subscribe((value: string) => {
                this._handleToAddressChange(value);
            });
    }

    private async _handleToAddressChange(text?: string): Promise<any> {
        if (this.searching || !text || !text.trim()) return;

        this.searching = true;

        await this._captchaGeneration();

        if (this._getAddressPattern().test(text)) {
            await this._queryZNS("ethAddress", text);
        } else {
            await this._queryZNS("zelfName", text);
        }
    }

    async _queryZNS(key: string, value: string): Promise<void> {
        try {
            const response = await this._zelfNameService.searchZelfNameV2(key, value, this._captchaToken);

            if (!response.data) {
                this.searching = false;

                return;
            }

            this.foundAddress = new WalletModel(response.data.ipfs?.length ? response.data.ipfs[0] : response.data.arweave[0]);

            this.searching = false;
        } catch (error) {
            console.error({ error });

            this.searching = false;
        }
    }

    continueToWithdraw(): void {
        this.withdrawStep = true;
    }

    continueToConfirmation(): void {
        // if (this.form.invalid) return;

        this._transactionService.receiver = this.foundAddress;
        this._transactionService.toAddress = this.form.get("toAddress")?.value;
        this._transactionService.withdrawalAmount = this.form.get("amount")?.value;

        this._router.navigate(["/send/confirmation"]);
    }

    goBack(): void {
        if (this.withdrawStep) {
            this.withdrawStep = false;
            return;
        }

        this._router.navigate(["/send"]);
    }

    getTimeDiff(lastUsed: Date | string | undefined): string {
        if (!lastUsed) return "";

        const now = new Date();
        const lastUsedDate = new Date(lastUsed);
        const diffInSeconds = Math.floor((now.getTime() - lastUsedDate.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return `${diffInSeconds}s`;
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes}mins`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}hrs`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}ds`;
        } else {
            const months = Math.floor(diffInSeconds / 2592000);
            return `${months}mo`;
        }
    }

    async pasteAddress(): Promise<void> {
        if (this.withdrawStep || this.searching) return;

        const text = await navigator.clipboard.readText();

        this._handlePaste(text);
    }

    async pastedAddress(event: ClipboardEvent): Promise<void> {
        event.preventDefault();
        event.stopPropagation();

        if (this.withdrawStep || this.searching) return;

        const text = event.clipboardData?.getData("text") as string;

        this._handlePaste(text);
    }

    private _handlePaste(text: string): void {
        if (!text) return;

        const pattern = this._getAddressPattern();

        if (!pattern.test(text)) return;

        this.form.get("toAddress")?.patchValue(text);
    }

    setToInput(address: AddressBook): void {
        this.form.get("toAddress")?.patchValue(address.address);
    }

    withdrawAll(): void {
        this.form.get("amount")?.patchValue(this.balance);
    }
}
