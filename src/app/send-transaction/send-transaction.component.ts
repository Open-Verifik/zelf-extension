import { CommonModule } from "@angular/common";
import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
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
    imports: [
        CommonModule,
        MatButtonModule,
        RouterModule,
        ReactiveFormsModule,
        TranslocoModule,
        MatProgressSpinnerModule,
        AddressMaskPipe,
        MatRippleModule,
    ],
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
    foundAddress?: WalletModel;
    fromAddress: string = "";
    token: Token;
    recentAddresses: AddressBook[] = [];
    searching: boolean = false;
    withdrawStep: boolean = false;
    isZelfNameNotFound: boolean = false;

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
            if (!control.value) return null;
            const value = Number(control.value);
            const MIN_VALUE = 1e-18; // 0.000000000000000001

            if (isNaN(value)) return null;
            return value >= MIN_VALUE ? null : { greaterThan: true };
        };
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            amount: [
                0,
                [Validators.required, Validators.min(0), Validators.max(this._transactionService.fromBalance), this._greaterThanValidator(0)],
            ],
            toAddress: ["", [Validators.required, Validators.maxLength(42), this._addressValidator()]],
        });

        this.form
            .get("toAddress")
            ?.valueChanges.pipe(takeUntil(this.unsubcriber$), debounceTime(500))
            .subscribe((value: string) => {
                this._handleToAddressChange(value);
            });
    }

    private _addressValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) return null;

            // Check if it matches the pattern for the current token type
            const pattern = this._getAddressPattern();
            if (!pattern.test(value)) {
                return { invalidFormat: true };
            }

            // For ETH addresses, do additional validation
            if (this.token.tokenType === "ETH") {
                if (!this._walletService.isValidEVMAddress(value)) {
                    return { invalidEVM: true };
                }
            }

            return null;
        };
    }

    private async _handleToAddressChange(text?: string): Promise<any> {
        if (!text || !text.trim()) {
            this.isZelfNameNotFound = false;
            return;
        }

        this.searching = true;
        this.isZelfNameNotFound = false;
        await this._captchaGeneration();

        try {
            // First check if it's a valid EVM address format
            const isValidEVMFormat = this._walletService.isValidEVMAddress(text);

            // Always query ZNS first
            await this._queryZNS("zelfName", text);

            // If no result found and input is valid EVM address, try as address
            if (!this.foundAddress && isValidEVMFormat) {
                await this._queryZNS("ethAddress", text);

                // If still no result, validate on-chain
                if (!this.foundAddress) {
                    const isValidOnChain = await this._walletService.validateEVMAddressOnChain(text);
                    if (isValidOnChain) {
                        this.foundAddress = new WalletModel({
                            ethAddress: text,
                            publicData: {},
                        });
                    } else {
                        this.foundAddress = undefined;
                    }
                }
            }

            // Set error state if searching by zelfName and no result found
            if (!this.foundAddress && !this._getAddressPattern().test(text)) {
                this.isZelfNameNotFound = true;
            }
        } catch (error) {
            console.error("Error in address search:", error);
            if (!this._getAddressPattern().test(text)) {
                this.isZelfNameNotFound = true;
            }
            this.foundAddress = undefined;
        }

        this.searching = false;
    }

    async _queryZNS(key: string, value: string): Promise<void> {
        try {
            const response = await this._zelfNameService.searchZelfNameV2(key, value, this._captchaToken);

            if (!response.data) {
                // Si no hay datos pero es una dirección válida, creamos un objeto básico
                if (key === "ethAddress" && this._getAddressPattern().test(value)) {
                    this.foundAddress = new WalletModel({
                        ethAddress: value,
                        publicData: {},
                    });
                } else {
                    this.foundAddress = undefined;
                }
                return;
            }

            this.foundAddress = new WalletModel(response.data.ipfs?.length ? response.data.ipfs[0] : response.data.arweave[0]);
        } catch (error) {
            console.error("Error in _queryZNS:", error);

            if (key === "ethAddress" && this._getAddressPattern().test(value)) {
                this.foundAddress = new WalletModel({
                    ethAddress: value,
                    publicData: {},
                });
            } else {
                this.foundAddress = undefined;
            }
            throw error;
        }
    }

    continueToWithdraw(): void {
        this.withdrawStep = true;
    }

    continueToConfirmation(): void {
        if (this.form.invalid || !this.foundAddress || this.isZelfNameNotFound) {
            return;
        }

        const toAddress = this.form.get("toAddress")?.value;

        // Double check the address is valid before proceeding
        if (!this._getAddressPattern().test(toAddress) || (this.token.tokenType === "ETH" && !this._walletService.isValidEVMAddress(toAddress))) {
            return;
        }

        this._transactionService.receiver = this.foundAddress;
        this._transactionService.toAddress = toAddress;
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
            return `${minutes}min`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours}h`;
        } else if (diffInSeconds < 2592000) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days}d`;
        } else {
            const months = Math.floor(diffInSeconds / 2592000);
            return `${months}mnth`;
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

    selectRecentAddress(address: AddressBook): void {
        this.form.get("toAddress")?.patchValue(address.address);
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
