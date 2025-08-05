import { debounceTime, Subject, takeUntil } from "rxjs";

import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { AbstractControl, FormBuilder, ReactiveFormsModule, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { AssetService } from "app/asset.service";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { BitcoinService } from "app/services/bitcoin.service";
import { TransactionParams } from "app/core/models/transaction-fee.model";
import { SuiService } from "app/services/sui.service";
import { SolanaService } from "app/solana.service";
import { EthereumService } from "app/eth.service";
import { TransactionService } from "app/transaction.service";
import { VaultService } from "app/vault.service";
import { AddressBook, TransactionData, WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { ZelfNameService } from "app/zelf-name-service.service";

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
        ZelfLoaderComponent,
    ],
    selector: "send-transaction",
    styleUrls: ["./send-transaction.component.scss"],
    templateUrl: "./send-transaction.component.html",
})
export class SendTransactionComponent implements OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();

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
        private _bitcoinService: BitcoinService,
        private _changeDetectionRef: ChangeDetectorRef,
        private _ethService: EthereumService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private _solanaService: SolanaService,
        private _suiService: SuiService,
        private _transactionService: TransactionService,
        private _translocoService: TranslocoService,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService,
        private _vaultService: VaultService
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

        this._transactionService.transactionData$.pipe(takeUntil(this.unsubscriber$)).subscribe((transactionData) => {
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
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    get addressKey(): "ethAddress" | "solanaAddress" | "btcAddress" | "suiAddress" {
        if (this.transactionData.isBscToken) return "ethAddress";
        if (this.transactionData.isBtcToken) return "btcAddress";
        if (this.transactionData.isEthToken || this.transactionData.isAvaxToken) return "ethAddress";
        if (this.transactionData.isPolToken) return "ethAddress";
        if (this.transactionData.isSolToken) return "solanaAddress";
        if (this.transactionData.isSuiToken) return "suiAddress";

        throw new Error("Network address key unavailable");
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

            if (control.value === this.transactionData.sender.address) return { sameAddress: true };

            const pattern = this._getAddressPattern();
            const isValidZelfName = this._walletService.ZelfRegex.test(value);

            if (!pattern.test(value) && !isValidZelfName) return { invalidFormat: true };

            if (isValidZelfName) return null;

            if ((this.transactionData.isEthToken || this.transactionData.isAvaxToken) && !this._walletService.isValidEVMAddress(value)) {
                return { invalidFormat: true };
            }

            if (this.transactionData.isSuiToken && !this._suiService.isValidSuiAddress(value)) {
                return { invalidFormat: true };
            }

            if (this.transactionData.isSolToken && !this._solanaService.isValidSolanaAddress(value)) {
                return { invalidFormat: true };
            }

            if (this.transactionData.isBtcToken && !this._bitcoinService.isValidBTCAddress(value)) {
                return { invalidBTC: true };
            }

            return null;
        };
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

    private _checkEVMAddress(text: string): boolean {
        const isValidFormat = this._walletService.isValidEVMAddress(text);
        const isValidWeb3 = this._ethService.checkIfValidAddress(text.toLowerCase());

        return isValidFormat && isValidWeb3;
    }

    async _fetchTokenPrice(): Promise<void> {
        try {
            const response = await this._assetService.fetchAssetPrice(this.transactionData.symbol);

            if (!response?.data || !response?.data?.length) return;

            this.price = response.data[0].open;
        } catch (error: any) {}
    }

    private _getAddressPattern(): RegExp {
        let pattern: RegExp = /.*/;

        if (this.transactionData.isEthToken || this.transactionData.isAvaxToken) pattern = this._walletService.ETHRegex;
        if (this.transactionData.isSolToken) pattern = this._walletService.SOLRegex;
        if (this.transactionData.isBtcToken) pattern = this._walletService.BTCRegex;
        if (this.transactionData.isSuiToken) pattern = this._walletService.SUIRegex;

        return pattern;
    }

    private _handlePaste(text: string): void {
        if (!text) return;

        const toAddressCtrl = this.form.get("toAddress");

        if (!toAddressCtrl) return;

        toAddressCtrl.patchValue(text, { emitEvent: true, onlySelf: false });
        toAddressCtrl.markAsDirty();
        toAddressCtrl.updateValueAndValidity({ emitEvent: true, onlySelf: false });
    }

    private async _handleToAddressChange(text?: string): Promise<any> {
        if (this.searching || this.form.get("toAddress")?.invalid) return;

        if (!text || !text.trim()) {
            this.isZelfNameNotFound = false;
            this.foundAddress = undefined;

            return;
        }

        this.searching = true;
        this.isZelfNameNotFound = false;

        const isEVM =
            this.transactionData.isEthToken || this.transactionData.isAvaxToken || this.transactionData.isPolToken || this.transactionData.isBscToken;

        try {
            if (this._walletService.ZelfRegex.test(text)) await this._queryZNS("zelfName", text);

            if (!this.foundAddress) {
                if (this.transactionData.isSuiToken && this._suiService.isValidSuiAddress(text)) {
                    await this._queryZNS("suiAddress", text);

                    if (!this.foundAddress) this._setRawAddressToFoundAddress(text, "suiAddress");
                } else if (isEVM && this._checkEVMAddress(text)) {
                    await this._queryZNS("ethAddress", text);

                    if (!this.foundAddress) this._setRawAddressToFoundAddress(text, "ethAddress");
                } else if (this.transactionData.isSolToken && this._solanaService.isValidSolanaAddress(text)) {
                    await this._queryZNS("solanaAddress", text);

                    if (!this.foundAddress) this._setRawAddressToFoundAddress(text, "solanaAddress");
                } else if (this.transactionData.isBtcToken && this._bitcoinService.isValidBTCAddress(text)) {
                    await this._queryZNS("btcAddress", text);

                    if (!this.foundAddress) this._setRawAddressToFoundAddress(text, "btcAddress");
                }
            }

            if (this.foundAddress) return;

            this.isZelfNameNotFound = true;
        } catch (error) {
            if (this.transactionData.isSuiToken && this._suiService.isValidSuiAddress(text)) {
                this._setRawAddressToFoundAddress(text, "suiAddress");
            } else if (isEVM && this._checkEVMAddress(text)) {
                this._setRawAddressToFoundAddress(text, "ethAddress");
            } else if (this.transactionData.isSolToken && this._solanaService.isValidSolanaAddress(text)) {
                this._setRawAddressToFoundAddress(text, "solanaAddress");
            } else if (this.transactionData.isBtcToken && this._bitcoinService.isValidBTCAddress(text)) {
                this._setRawAddressToFoundAddress(text, "btcAddress");
            } else {
                this.isZelfNameNotFound = true;
                this.foundAddress = undefined;
            }
        } finally {
            this.searching = false;

            if (this.foundAddress) await this._setToCurrentTransactionData();

            this._changeDetectionRef.detectChanges();
        }
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            amount: [
                this.transactionData?.amount || "",
                [
                    Validators.required,
                    Validators.min(0),
                    Validators.max(this.transactionData.balance as number),
                    this._amountValidation(this.transactionData.balance as number),
                ],
            ],
            toAddress: [this.transactionData?.receiver?.address || "", [Validators.required, Validators.maxLength(66), this._addressValidator()]],
            fromAddress: [this.transactionData?.sender?.address || ""],
        });

        const toAddressCtrl = this.form?.get("toAddress");

        if (!toAddressCtrl) return;

        toAddressCtrl.valueChanges.pipe(takeUntil(this.unsubscriber$), debounceTime(1000)).subscribe((value: string) => {
            if (!value || !value.trim() || this.form.get("toAddress")?.invalid) {
                this.foundAddress = undefined;
                this.isZelfNameNotFound = false;
                this._setToCurrentTransactionData();

                return;
            }

            this._handleToAddressChange(value);
        });

        if (!toAddressCtrl.value || !toAddressCtrl.value.trim()) return;

        if (this.transactionData?.receiver?.address) {
            this._setRawAddressToFoundAddress(this.transactionData.receiver.address, this.addressKey);

            this.withdrawStep = true;

            return;
        }

        toAddressCtrl.updateValueAndValidity();
    }

    private async _initTransactionData(): Promise<void> {
        this.recentAddresses = this._transactionService.findAddressInRecentAddresses("network", this.transactionData.network);

        await this._fetchTokenPrice();

        this._initForm();
    }

    async _queryZNS(key: string, value: string): Promise<void> {
        try {
            if (key === "zelfName") value = value.toLowerCase();

            const response = await this._zelfNameService.searchZelfNameV2(key, value);

            if (!response.data) {
                this.foundAddress = undefined;

                return;
            }

            const foundAddress = new WalletModel(response.data.ipfs?.length ? response.data.ipfs[0] : response.data.arweave[0]);
            const zelfObjectContainsAddress = !!foundAddress[this.addressKey];

            this.foundAddress = zelfObjectContainsAddress ? foundAddress : undefined;
        } catch (error) {
            this.foundAddress = undefined;

            throw error;
        }
    }

    private _setRawAddressToFoundAddress(text: string, addressKey: string): void {
        this.searching = false;
        this.isZelfNameNotFound = false;

        this.foundAddress = new WalletModel({
            [addressKey]: text,
            publicData: { zelfName: this.transactionData?.receiver?.zelfName },
        });

        if (this.withdrawStep) return;

        const toAddressCtrl = this.form.get("toAddress");

        if (toAddressCtrl) toAddressCtrl.updateValueAndValidity({ emitEvent: false });
    }

    private async _setToCurrentTransactionData(): Promise<void> {
        try {
            if (this.withdrawStep) {
                const amount = Number(String(this.form.get("amount")?.value || "0").replace(",", "."));

                this.transactionData.amount = amount;
            }

            this.transactionData.receiver.address = (this.foundAddress && this.foundAddress[this.addressKey]) || "";
            this.transactionData.receiver.zelfName = this.foundAddress?.publicData?.zelfName || "";

            await this._transactionService.setCurrentTransactionData(this.transactionData);
        } catch (exception) {
            console.error("Error setting transaction data", exception);
            this.openErrorSnackBar("send-transaction.error-setting-transaction-data");
        }
    }

    async continueToWithdraw(): Promise<void> {
        const address = this.form.get("toAddress")?.value;

        const isEVM =
            this.transactionData.isEthToken || this.transactionData.isAvaxToken || this.transactionData.isPolToken || this.transactionData.isBscToken;
        const isSuiTokenOrNetwork = this.transactionData.isSuiToken;

        if (this.foundAddress) {
            const toAddressCtrl = this.form.get("toAddress");

            if (toAddressCtrl) {
                toAddressCtrl.setValue(
                    this.foundAddress[
                        isSuiTokenOrNetwork
                            ? "suiAddress"
                            : isEVM
                              ? "ethAddress"
                              : this.transactionData.isSolToken
                                ? "solanaAddress"
                                : this.transactionData.isBtcToken
                                  ? "btcAddress"
                                  : "solanaAddress"
                    ] || ""
                );

                toAddressCtrl.updateValueAndValidity({ emitEvent: false });
            }

            await this._setToCurrentTransactionData();

            this.withdrawStep = true;

            return;
        }

        if (this.transactionData.isSuiToken && this._suiService.isValidSuiAddress(address)) {
            this._setRawAddressToFoundAddress(address, "suiAddress");
        } else if (isEVM && this._checkEVMAddress(address)) {
            this._setRawAddressToFoundAddress(address, "ethAddress");
        } else if (this.transactionData.isSolToken && this._solanaService.isValidSolanaAddress(address)) {
            this._setRawAddressToFoundAddress(address, "solanaAddress");
        } else if (this.transactionData.isBtcToken && this._bitcoinService.isValidBTCAddress(address)) {
            this._setRawAddressToFoundAddress(address, "btcAddress");

            try {
                if (this.foundAddress && "btcAddress" in this.foundAddress) {
                    const address = (this.foundAddress as any).btcAddress || "";
                    const btcBalance = await this._bitcoinService.getBitcoinBalance(address);

                    if (btcBalance.balance < parseFloat(this.form.get("amount")?.value || "0")) {
                        this._snackBar.open(this._translocoService.translate("INSUFFICIENT_FUNDS"), this._translocoService.translate("CLOSE"), {
                            duration: 5000,
                        });
                        return;
                    }
                }
            } catch (error) {
                console.error("Error checking Bitcoin balance:", error);
            }
        }

        await this._setToCurrentTransactionData();

        this.withdrawStep = true;
    }

    async continueToConfirmation(): Promise<void> {
        if (!this.form.valid) return;

        const address = this.form.get("toAddress")?.value;

        if (!address) {
            console.error("No address provided");
            return;
        }

        const isEVM =
            this.transactionData.isEthToken || this.transactionData.isAvaxToken || this.transactionData.isPolToken || this.transactionData.isBscToken;

        if (!this.foundAddress) {
            if (this.transactionData.isSuiToken && this._suiService.isValidSuiAddress(address)) {
                this._setRawAddressToFoundAddress(address, "suiAddress");
            } else if (isEVM && this._checkEVMAddress(address)) {
                this._setRawAddressToFoundAddress(address, "ethAddress");
            } else if (this.transactionData.isSolToken && this._solanaService.isValidSolanaAddress(address)) {
                this._setRawAddressToFoundAddress(address, "solanaAddress");
            } else if (this.transactionData.isBtcToken && this._bitcoinService.isValidBTCAddress(address)) {
                this._setRawAddressToFoundAddress(address, "btcAddress");
            }
        }

        if (!this.foundAddress) {
            console.error("No valid address found");
            return;
        }

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
        if (!this.foundAddress || this.searching || this.form.invalid || this.form.get("amount")?.invalid) return true;

        return false;
    }

    isWithdrawDisabled(): boolean {
        if (!this.foundAddress || this.searching) return true;

        return false;
    }

    openErrorSnackBar(message: string): void {
        this._snackBar.open(this._translocoService.translate(message), this._translocoService.translate("common.close"), {
            duration: 5000,
            panelClass: "zelf-snackbar",
            verticalPosition: "top",
        });
    }

    async pasteAddress(): Promise<void> {
        if (this.withdrawStep || this.searching) return;

        const text = await navigator.clipboard.readText();

        this._handlePaste(text);
    }

    async pastedAddress(event: ClipboardEvent): Promise<void> {
        event.preventDefault();

        if (this.withdrawStep || this.searching) return;

        const text = event.clipboardData?.getData("text") as string;

        this._handlePaste(text);
    }

    selectRecentAddress(address: AddressBook): void {
        if (this.searching || this.form.get("toAddress")?.value === address) return;

        this.form.get("toAddress")?.patchValue(address.address);
    }

    async sendTransaction(): Promise<void> {
        if (this.form.invalid) return;

        this.loading = true;

        try {
            const walletData = await this._walletService.getCurrentWallet();
            const mnemonic = this._vaultService.mnemonic;

            if (!walletData || !mnemonic) {
                throw new Error("No wallet data or mnemonic available");
            }

            const amount = parseFloat(this.form.get("amount")?.value || "0");
            const toAddress = this.form.get("toAddress")?.value;

            if (this.transactionData.isBtcToken) {
                const transactionParams: TransactionParams = {
                    from: "", // Will be derived from mnemonic in Bitcoin service
                    to: toAddress,
                    value: String(amount),
                    network: "bitcoin",
                    mnemonic: mnemonic,
                };

                const result = await this._bitcoinService.sendTransaction(transactionParams);

                this._snackBar.open(this._translocoService.translate("TRANSACTION_SENT"), this._translocoService.translate("CLOSE"), {
                    duration: 5000,
                });

                this._router.navigate(["/transaction-confirmation"], {
                    state: {
                        hash: result.hash,
                        network: "bitcoin",
                        amount: amount,
                        to: toAddress,
                        symbol: "BTC",
                    },
                });
            } else {
            }
        } catch (error) {
            console.error("Error sending transaction:", error);
            this._snackBar.open(this._translocoService.translate("TRANSACTION_FAILED"), this._translocoService.translate("CLOSE"), {
                duration: 5000,
            });
        } finally {
            this.loading = false;
        }
    }

    setToInput(address: AddressBook): void {
        this.form.get("toAddress")?.patchValue(address.address);
    }

    withdrawAll(): void {
        this.form.get("amount")?.patchValue(this.transactionData.balance);
    }
}
