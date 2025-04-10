import { debounceTime, Subject, takeUntil } from "rxjs";
import { Web3 } from "web3";

import { CommonModule } from "@angular/common";
import { Component, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";

import { CaptchaService } from "app/captcha.service";
import { ChromeService } from "app/chrome.service";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { TransactionService } from "app/transaction.service";
import { AddressBook, TransactionData, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";
import { SuiService } from "app/services/sui.service";
import { AssetService } from "app/asset.service";

@Component({
    imports: [
        AddressMaskPipe,
        CommonModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatRippleModule,
        ReactiveFormsModule,
        RouterModule,
        TranslocoModule,
    ],
    selector: "send-transaction",
    standalone: true,
    styleUrls: ["./send-transaction.component.scss"],
    templateUrl: "./send-transaction.component.html",
})
export class SendTransactionComponent implements OnDestroy {
    private _captchaToken: string = "";
    private _priceInterval!: ReturnType<typeof setInterval>;
    private unsubcriber$: Subject<void> = new Subject<void>();

    form!: UntypedFormGroup;
    foundAddress?: WalletModel;
    isZelfNameNotFound: boolean = false;
    loading: boolean = true;
    price: number = 0;
    recentAddresses: AddressBook[] = [];
    searching: boolean = false;
    transactionData!: TransactionData;
    withdrawStep: boolean = false;

    constructor(
        private _assetService: AssetService,
        private _captchaService: CaptchaService,
        private _changeDetectionRef: ChangeDetectorRef,
        private _chromeService: ChromeService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private _suiService: SuiService,
        private _transactionService: TransactionService,
        private _translocoService: TranslocoService,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService
    ) {
        this.loading = true;
    }

    async ngOnInit(): Promise<void> {
        this.transactionData = await this._transactionService.getCurrentTransactionData();

        if (this.transactionData && this.transactionData.hasTransactionData) {
            this._initTransactionData()
                .catch(() => this.goBack())
                .finally(() => (this.loading = false));

            return;
        }

        this._transactionService.transactionData$.pipe(takeUntil(this.unsubcriber$)).subscribe((transactionData) => {
            this.transactionData = transactionData;

            if (!this.transactionData || !this.transactionData.hasTransactionData) {
                this._router.navigate(["/send"]);

                return;
            }

            this._initTransactionData()
                .catch(() => this.goBack())
                .finally(() => (this.loading = false));
        });
    }

    ngOnDestroy(): void {
        clearInterval(this._priceInterval);

        this.unsubcriber$.next();
        this.unsubcriber$.complete();
    }

    get fiatPrice(): number {
        const amount = this.form.get("amount")?.value || 0;
        const fiatPrice = this.price || 0;

        return amount * fiatPrice || 0;
    }

    get filteredAddresses(): AddressBook[] {
        const searchValue = this.form.get("toAddress")?.value;

        return this.recentAddresses.filter((address) => {
            if (!searchValue || !searchValue.trim()) return true;

            return new RegExp(searchValue, "i").test(address.address) || (address.zelfName && new RegExp(searchValue, "i").test(address.zelfName));
        });
    }

    private _addressValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            if (!value) return null;

            const pattern = this._getAddressPattern();
            const isValidZelfName = this._walletService.ZelfRegex.test(value);

            if (!pattern.test(value) && !isValidZelfName) return { invalidFormat: true };

            if (isValidZelfName) return null;

            if ((this.transactionData.isEthToken || this.transactionData.isAvaxToken) && !this._walletService.isValidEVMAddress(value)) {
                return { invalidEVM: true };
            }

            if (this.transactionData.isSuiToken && !this._suiService.isValidSuiAddress(value)) {
                return { invalidSUI: true };
            }

            return null;
        };
    }

    private async _captchaGeneration(): Promise<any> {
        if (this._chromeService.isExtension) return;

        try {
            this._captchaToken = await this._captchaService.executeRecaptcha(this.form.get("toAddress")?.value || "");
        } catch (error) {}
    }

    private _getAddressPattern(): RegExp {
        let pattern: RegExp = /.*/;

        if (this.transactionData.isEthToken || this.transactionData.isAvaxToken) pattern = this._walletService.ETHRegex;
        if (this.transactionData.isSolToken) pattern = this._walletService.SOLRegex;
        if (this.transactionData.isBtcToken) pattern = this._walletService.BTCRegex;
        if (this.transactionData.isSuiToken) pattern = this._walletService.SUIRegex;

        return pattern;
    }

    private _amountValidation(maxValue: number | string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return { greaterThan: true };

            const MIN_VALUE = 1e-18; // 0.000000000000000001
            const value = +control.value;

            if (isNaN(value)) return { invalidNumber: true };
            if (value < MIN_VALUE) return { greaterThan: { value: "0.000000000000000001" } };
            if (value > +maxValue) return { lessThan: { value: maxValue } };

            return null;
        };
    }

    private _handlePaste(text: string): void {
        if (!text) return;

        const pattern = this._getAddressPattern();

        if (!pattern.test(text) && !this._walletService.ZelfRegex.test(text)) return;

        this.form.get("toAddress")?.patchValue(text);
    }

    private async _handleToAddressChange(text?: string): Promise<any> {
        if (this.searching) return;

        if (!text || !text.trim()) {
            this.isZelfNameNotFound = false;
            this.foundAddress = undefined;

            return;
        }

        this.searching = true;
        this.isZelfNameNotFound = false;

        const isSuiTokenOrNetwork = this.transactionData.isSuiToken || this.transactionData.tokenType === "SUI_TOKEN";
        const isEthereumToken = this.transactionData.isEthToken || this.transactionData.isAvaxToken;

        await this._captchaGeneration();

        try {
            if (this._walletService.ZelfRegex.test(text)) await this._queryZNS("zelfName", text);

            if (!this.foundAddress) {
                if (isSuiTokenOrNetwork && this._suiService.isValidSuiAddress(text)) {
                    await this._queryZNS("suiAddress", text);

                    if (!this.foundAddress) this._setRawAddressToFoundAddress(text, "suiAddress");
                } else if (isEthereumToken && this._checkEVMAddress(text)) {
                    await this._queryZNS("ethAddress", text);

                    if (!this.foundAddress) this._setRawAddressToFoundAddress(text, "ethAddress");
                }
            }

            if (this.foundAddress) return;

            this.isZelfNameNotFound = true;
        } catch (error) {
            if (isSuiTokenOrNetwork && this._suiService.isValidSuiAddress(text)) {
                this._setRawAddressToFoundAddress(text, "suiAddress");
            } else if (isEthereumToken && this._checkEVMAddress(text)) {
                this._setRawAddressToFoundAddress(text, "ethAddress");
            } else {
                this.isZelfNameNotFound = true;
                this.foundAddress = undefined;
            }
        } finally {
            this.searching = false;

            if (this.foundAddress) this._setToCurrentTransactionData();

            this._changeDetectionRef.detectChanges();
        }
    }

    private _setRawAddressToFoundAddress(text: string, addressKey: string): void {
        this.searching = false;
        this.isZelfNameNotFound = false;

        this.foundAddress = new WalletModel({
            [addressKey]: text,
            publicData: {},
        });

        const toAddressCtrl = this.form.get("toAddress");

        if (toAddressCtrl) toAddressCtrl.updateValueAndValidity({ emitEvent: false });
    }

    private async _setToCurrentTransactionData(): Promise<void> {
        if (this.withdrawStep) {
            const amount = Number(String(this.form.get("amount")?.value || "0").replace(",", "."));

            this.transactionData.amount = amount;
        }

        const isSuiTokenOrNetwork = this.transactionData.isSuiToken || this.transactionData.tokenType === "SUI_TOKEN";
        const isEthereumToken = this.transactionData.isEthToken || this.transactionData.isAvaxToken;

        if (isEthereumToken) {
            this.transactionData.receiver.address = this.foundAddress?.ethAddress || "";
        } else if (this.transactionData.isSolToken) {
            this.transactionData.receiver.address = this.foundAddress?.solanaAddress || "";
        } else if (this.transactionData.isBtcToken) {
            this.transactionData.receiver.address = this.foundAddress?.btcAddress || "";
        } else if (isSuiTokenOrNetwork) {
            this.transactionData.receiver.address = this.foundAddress?.suiAddress || "";
        }

        this.transactionData.receiver.zelfName = this.foundAddress?.publicData?.zelfName || "";

        await this._transactionService.setCurrentTransactionData(this.transactionData);
    }

    private _checkEVMAddress(text: string): boolean {
        const isValidFormat = this._walletService.isValidEVMAddress(text);
        const isValidWeb3 = Web3.utils.isAddress(text.toLowerCase());

        return isValidFormat && isValidWeb3;
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            amount: [
                this.transactionData?.amount || 0,
                [
                    Validators.required,
                    Validators.min(0),
                    Validators.max(this.transactionData.balance as number),
                    this._amountValidation(this.transactionData.balance as number),
                ],
            ],
            toAddress: [this.transactionData?.receiver?.address || "", [Validators.required, Validators.maxLength(66), this._addressValidator()]],
        });

        const toAddressCtrl = this.form?.get("toAddress");

        if (!toAddressCtrl) return;

        toAddressCtrl.valueChanges.pipe(takeUntil(this.unsubcriber$), debounceTime(1000)).subscribe((value: string) => {
            this._handleToAddressChange(value);
        });

        if (!toAddressCtrl.value || !toAddressCtrl.value.trim()) return;

        if (this.transactionData?.receiver?.address) {
            this._setRawAddressToFoundAddress(this.transactionData.receiver.address, "suiAddress");

            this.withdrawStep = true;

            return;
        }

        toAddressCtrl.updateValueAndValidity();
    }

    private async _initTransactionData(): Promise<void> {
        this.recentAddresses = this._transactionService.findAddressInRecentAddresses("network", this.transactionData.network);

        clearInterval(this._priceInterval);

        this._assetService.fetchAssetPrice(this.transactionData.symbol).then((response) => {
            this.price = response.data[0].open;
        });

        this._priceInterval = setInterval(() => {
            this._assetService.fetchAssetPrice(this.transactionData.symbol).then((response) => {
                this.price = response.data[0].open;
            });
        }, 5000);

        this._initForm();
    }

    async _queryZNS(key: string, value: string): Promise<void> {
        try {
            const response = await this._zelfNameService.searchZelfNameV2(key, value);

            if (!response.data) {
                this.foundAddress = undefined;

                return;
            }

            const foundAddress = new WalletModel(response.data.ipfs?.length ? response.data.ipfs[0] : response.data.arweave[0]);

            let zelfObjectContainsAddress = false;

            if ((this.transactionData.isEthToken || this.transactionData.isAvaxToken) && foundAddress.ethAddress) {
                zelfObjectContainsAddress = true;
            } else if (this.transactionData.isSolToken && foundAddress.solanaAddress) {
                zelfObjectContainsAddress = true;
            } else if (this.transactionData.isBtcToken && foundAddress.btcAddress) {
                zelfObjectContainsAddress = true;
            } else if (this.transactionData.isSuiToken && foundAddress.suiAddress) {
                zelfObjectContainsAddress = true;
            }

            this.foundAddress = zelfObjectContainsAddress ? foundAddress : undefined;
        } catch (error) {
            this.foundAddress = undefined;

            throw error;
        }
    }

    async continueToWithdraw(): Promise<void> {
        const address = this.form.get("toAddress")?.value;
        const isSuiTokenOrNetwork = this.transactionData.isSuiToken || this.transactionData.tokenType === "SUI_TOKEN";
        const isEthereumToken = this.transactionData.isEthToken || this.transactionData.isAvaxToken;

        if (this.foundAddress) {
            const toAddressCtrl = this.form.get("toAddress");

            if (toAddressCtrl) {
                toAddressCtrl.setValue(
                    this.foundAddress[isSuiTokenOrNetwork ? "suiAddress" : isEthereumToken ? "ethAddress" : "solanaAddress"] || ""
                );

                toAddressCtrl.updateValueAndValidity({ emitEvent: false });
            }

            await this._setToCurrentTransactionData();

            this.withdrawStep = true;

            return;
        }

        if (isSuiTokenOrNetwork && this._suiService.isValidSuiAddress(address)) {
            this._setRawAddressToFoundAddress(address, "suiAddress");
        } else if (isEthereumToken && this._checkEVMAddress(address)) {
            this._setRawAddressToFoundAddress(address, "ethAddress");
        }

        await this._setToCurrentTransactionData();

        this.withdrawStep = true;
    }

    async continueToConfirmation(): Promise<void> {
        if (!this.form.valid) return;

        const address = this.form.get("toAddress")?.value;
        const isSuiTokenOrNetwork = this.transactionData.isSuiToken || this.transactionData.tokenType === "SUI_TOKEN";
        const isEthereumToken = this.transactionData.isEthToken || this.transactionData.isAvaxToken;

        if (!this.foundAddress) {
            if (isSuiTokenOrNetwork && this._suiService.isValidSuiAddress(address)) {
                this._setRawAddressToFoundAddress(address, "suiAddress");
            } else if (isEthereumToken && this._checkEVMAddress(address)) {
                this._setRawAddressToFoundAddress(address, "ethAddress");
            }
        }

        if (!this.foundAddress) return;

        await this._setToCurrentTransactionData();

        this._router.navigate(["/send/confirmation"]);
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

    goBack(): void {
        this.transactionData.amount = 0;
        this.transactionData.receiver.address = "";
        this.transactionData.receiver.zelfName = "";

        if (this.withdrawStep) {
            this.foundAddress = undefined;

            this.form.get("toAddress")?.patchValue(this.transactionData.receiver.address);
            this.form.get("amount")?.patchValue(this.transactionData.amount);

            this._transactionService.setCurrentTransactionData(this.transactionData);

            this.withdrawStep = false;

            return;
        }

        this._transactionService.setCurrentTransactionData(this.transactionData);

        this._router.navigate(["/send"]);
    }

    isConfirmationDisabled(): boolean {
        if (!this.foundAddress) return true;
        if (this.form.invalid) return true;

        return false;
    }

    isWithdrawDisabled(): boolean {
        if (!this.foundAddress) return true;
        if (this.searching) return true;
        if (this.form.get("amount")?.value && this.form.get("amount")?.invalid) return true;

        return false;
    }

    openErrorSnackBar(message: string): void {
        this._snackBar.open(this._translocoService.translate(message), this._translocoService.translate("common.close"), {
            duration: 5000,
            panelClass: "zelf-snackbar",
            verticalPosition: "top",
        });
    }

    onKeydown(event: KeyboardEvent): void {
        if (event.key !== "Enter") return;

        event.preventDefault();
        event.stopPropagation();
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
        if (this.searching || this.form.get("toAddress")?.value === address) return;

        this.form.get("toAddress")?.patchValue(address.address);
    }

    setToInput(address: AddressBook): void {
        this.form.get("toAddress")?.patchValue(address.address);
    }

    withdrawAll(): void {
        this.form.get("amount")?.patchValue(this.transactionData.balance);
    }
}
