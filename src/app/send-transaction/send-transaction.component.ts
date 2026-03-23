import { debounceTime, Subject, takeUntil } from "rxjs";

import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { AbstractControl, FormBuilder, ReactiveFormsModule, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatRippleModule } from "@angular/material/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { AssetService } from "app/asset.service";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";
import { BitcoinService } from "app/services/bitcoin.service";
import { BlockDAGService } from "app/services/blockdag.service";
import { TransactionParams } from "app/core/models/transaction-fee.model";
import { StellarService } from "app/services/stellar.service";
import { SuiService } from "app/services/sui.service";
import { SolanaService } from "app/solana.service";
import { EthereumService } from "app/eth.service";
import { TransactionService } from "app/transaction.service";
import { VaultService } from "app/vault.service";
import { AddressBook, TransactionData } from "@shared/types/wallet.types";
import { WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { TagModel, TagsService } from "app/tags.service";

@Component({
    imports: [
        AddressMaskPipe,
        CommonModule,
        MatButtonModule,
        MatSlideToggleModule,
        MatProgressSpinnerModule,
        MatRippleModule,
        ReactiveFormsModule,
        FormsModule,
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
    foundAddress?: TagModel;
    isFromRecentAddress: boolean = false;
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
        private _blockDAGService: BlockDAGService,
        private _changeDetectionRef: ChangeDetectorRef,
        private _ethService: EthereumService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private _solanaService: SolanaService,
        private _stellarService: StellarService,
        private _suiService: SuiService,
        private _tagsService: TagsService,
        private _transactionService: TransactionService,
        private _translocoService: TranslocoService,
        private _vaultService: VaultService,
        private _walletService: WalletService
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

    get addressKey(): "ethAddress" | "solanaAddress" | "btcAddress" | "suiAddress" | "blockDAGAddress" | "xlmAddress" {
        if (this.transactionData.isBscToken) return "ethAddress";
        if (this.transactionData.isBDAGToken) return "ethAddress";
        if (this.transactionData.isBtcToken) return "btcAddress";
        if (this.transactionData.isEthToken || this.transactionData.isAvaxToken) return "ethAddress";
        if (this.transactionData.isPolToken) return "ethAddress";
        if (this.transactionData.isSolToken) return "solanaAddress";
        if (this.transactionData.isSuiToken) return "suiAddress";
        if (this.transactionData.isXlmToken) return "xlmAddress";

        throw new Error("Network address key unavailable");
    }

    get fiatPrice(): number {
        const amount = this.form.get("amount")?.value || 0;
        const fiatPrice = this.price || 0;

        return amount * fiatPrice || 0;
    }

    /** Matches truncated max used for validation and "withdraw all". */
    get displaySendableBalance(): string {
        return this._getMaxSendableAmount();
    }

    /** Smallest amount we allow without treating as dust (matches ~8 leading fractional zeros). */
    private static readonly _MIN_SENDABLE_AMOUNT = 1e-8;

    /** Red border + inline row: only dust / max / bad number — not empty or zero. */
    get showAmountFieldErrorState(): boolean {
        const c = this.form?.get("amount");
        if (!c?.touched || !c.invalid) return false;
        const e = c.errors;
        return !!(e?.dustTooSmall || e?.lessThan || e?.invalidNumber);
    }

    /** Up to 8 decimal places for inline validation copy. */
    formatAmountForInlineError(value: unknown): string {
        const n = parseFloat(String(value ?? ""));
        if (!Number.isFinite(n)) return String(value ?? "");

        const s = n.toFixed(8).replace(/\.?0+$/, "");
        return s || "0";
    }

    dustMinAmountDisplay(): string {
        return this.formatAmountForInlineError(this._getMinSendableAmount());
    }

    private _getMinSendableAmount(): number {
        if (this.transactionData.isXlmToken) return 1e-7;

        return SendTransactionComponent._MIN_SENDABLE_AMOUNT;
    }

    onAmountBlur(): void {
        this.form.get("amount")?.markAsTouched();
    }

    onWithdrawPrimaryClick(): void {
        if (this.isConfirmationDisabled()) {
            this.form.get("amount")?.markAsTouched();
            return;
        }

        void this.continueToConfirmation();
    }

    get filteredAddresses(): AddressBook[] {
        const searchValue = this.form.get("toAddress")?.value;

        return this.recentAddresses.filter((address) => {
            if (!searchValue || !searchValue.trim()) return true;

            return new RegExp(searchValue, "i").test(address.address) || (address.tagName && new RegExp(searchValue, "i").test(address.tagName));
        });
    }

    private _addressValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            if (!value) return null;

            if (control.value === this.transactionData.sender.address) return { sameAddress: true };

            const pattern = this._getAddressPattern();

            const isValidZelfName = this._walletService.TagRegex.test(value) || this._walletService.TagRegexNoPostfix.test(value);

            if (!pattern.test(value) && !isValidZelfName) return { invalidFormat: true };

            if (isValidZelfName) return null;

            if (
                (this.transactionData.isEthToken || this.transactionData.isAvaxToken || this.transactionData.isBDAGToken) &&
                !this._walletService.isValidEVMAddress(value)
            ) {
                return { invalidFormat: true };
            }

            if (this.transactionData.isSuiToken && !this._suiService.isValidSuiAddress(value)) {
                return { invalidFormat: true };
            }

            if (this.transactionData.isSolToken && !this._solanaService.isValidSolanaAddress(value)) {
                return { invalidFormat: true };
            }

            if (this.transactionData.isXlmToken && !this._stellarService.isValidStellarAddress(value)) {
                return { invalidFormat: true };
            }

            if (this.transactionData.isBtcToken && !this._bitcoinService.isValidBTCAddress(value)) {
                return { invalidBTC: true };
            }

            return null;
        };
    }

    private _amountValidation(maxValue: number | string): ValidatorFn {
        const minSend = this._getMinSendableAmount();

        return (control: AbstractControl): ValidationErrors | null => {
            const raw = control.value;
            const str = raw === null || raw === undefined ? "" : String(raw).trim();

            if (str === "") return { noAmount: true };

            const value = +str.replace(/,/g, "");
            if (isNaN(value)) return { invalidNumber: true };
            if (value <= 0) return { noAmount: true };

            if (value < minSend) return { dustTooSmall: true };

            const cap = parseFloat(String(maxValue));
            if (!Number.isFinite(cap) || value > cap) return { lessThan: { value: maxValue } };

            return null;
        };
    }

    private _getSendDecimals(): number {
        const raw = this.transactionData?.token?.decimals;
        const parsed = raw !== undefined && raw !== null ? Number(raw) : NaN;

        if (Number.isFinite(parsed) && parsed >= 0) return Math.min(36, Math.floor(parsed));

        if (this.transactionData.isSuiToken) return 9;
        if (this.transactionData.isSolToken) return 9;
        if (this.transactionData.isXlmToken) return 7;
        if (this.transactionData.isBtcToken) return 8;
        if (
            this.transactionData.isEthToken ||
            this.transactionData.isAvaxToken ||
            this.transactionData.isPolToken ||
            this.transactionData.isBscToken ||
            this.transactionData.isBDAGToken
        ) {
            return 18;
        }

        return 18;
    }

    /**
     * Balance truncated to token decimals (floor) so max validation, "withdraw all", and error copy stay aligned.
     */
    private _getMaxSendableAmount(): string {
        const decimals = this._getSendDecimals();
        const raw = this.transactionData.balance;
        let s = String(raw ?? 0)
            .replace(/,/g, "")
            .trim();

        if (!s || /^nan$/i.test(s)) return "0";

        const negative = s.startsWith("-");
        if (negative) s = s.slice(1);

        if (/e/i.test(s)) {
            const n = Number((negative ? "-" : "") + s);
            if (!Number.isFinite(n) || n < 0) return "0";
            const factor = 10 ** decimals;
            const floored = Math.floor(n * factor + 1e-12) / factor;
            return this._trimAmountFraction(floored.toFixed(decimals));
        }

        const parts = s.split(".");
        const intDigits = (parts[0] || "").replace(/\D/g, "") || "0";
        const intPart = intDigits.replace(/^0+(?=\d)/, "") || "0";
        const fracDigits = (parts[1] || "").replace(/\D/g, "");
        const truncatedFrac = fracDigits.slice(0, decimals);
        const joined = truncatedFrac.length ? `${intPart}.${truncatedFrac}` : intPart;
        const signed = negative && joined !== "0" && parseFloat(joined) !== 0 ? `-${joined}` : joined;

        return this._trimAmountFraction(signed);
    }

    private _trimAmountFraction(amount: string): string {
        if (!amount.includes(".")) return amount;

        return amount.replace(/\.?0+$/, "") || "0";
    }

    private _checkEVMAddress(text: string): boolean {
        const isValidFormat = this._walletService.isValidEVMAddress(text);
        const isValidWeb3 = this._ethService.checkIfValidAddress(text.toLowerCase());

        return isValidFormat && isValidWeb3;
    }

    async _fetchTokenPrice(): Promise<void> {
        try {
            if (this.transactionData.isBDAGToken) {
                this.price = await this._blockDAGService.getCurrentPrice();
                return;
            }

            const response = await this._assetService.fetchAssetPrice(this.transactionData.symbol);

            if (!response?.data || !response?.data?.length) return;

            this.price = response.data[0].open;
        } catch (error: any) {}
    }

    private _getAddressPattern(): RegExp {
        let pattern: RegExp = /.*/;

        if (this.transactionData.isEthToken || this.transactionData.isAvaxToken || this.transactionData.isBDAGToken)
            pattern = this._walletService.ETHRegex;
        if (this.transactionData.isSolToken) pattern = this._walletService.SOLRegex;
        if (this.transactionData.isBtcToken) pattern = this._walletService.BTCRegex;
        if (this.transactionData.isSuiToken) pattern = this._walletService.SUIRegex;
        if (this.transactionData.isXlmToken) pattern = /^G[A-Z2-7]{54}$/;

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

        this.isFromRecentAddress = false;

        if (!text || !text.trim()) {
            this.isZelfNameNotFound = false;
            this.foundAddress = undefined;

            return;
        }

        this.searching = true;
        this.isZelfNameNotFound = false;

        const isEVM =
            this.transactionData.isEthToken ||
            this.transactionData.isAvaxToken ||
            this.transactionData.isPolToken ||
            this.transactionData.isBscToken ||
            this.transactionData.isBDAGToken;

        try {
            const { name: tagName, domain } = this._tagsService.parseTagName(text);

            const finalDomain = domain || this.transactionData?.sender?.domain || "zelf";

            if (this._walletService.TagRegex.test(text) || this._walletService.TagRegexNoPostfix.test(text))
                await this._searchTag("tagName", tagName, finalDomain);

            if (!this.foundAddress) {
                if (this.transactionData.isSuiToken && this._suiService.isValidSuiAddress(text)) {
                    await this._searchTag("suiAddress", text);

                    if (!this.foundAddress) this._setRawAddressToFoundAddress(text, "suiAddress");
                } else if (isEVM && this._checkEVMAddress(text)) {
                    await this._searchTag("ethAddress", text);

                    if (!this.foundAddress) this._setRawAddressToFoundAddress(text, "ethAddress");
                } else if (this.transactionData.isSolToken && this._solanaService.isValidSolanaAddress(text)) {
                    await this._searchTag("solanaAddress", text);

                    if (!this.foundAddress) this._setRawAddressToFoundAddress(text, "solanaAddress");
                } else if (this.transactionData.isXlmToken && this._stellarService.isValidStellarAddress(text)) {
                    await this._searchTag("xlmAddress", text);

                    if (!this.foundAddress) this._setRawAddressToFoundAddress(text, "xlmAddress");
                } else if (this.transactionData.isBtcToken && this._bitcoinService.isValidBTCAddress(text)) {
                    await this._searchTag("btcAddress", text);

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
            } else if (this.transactionData.isXlmToken && this._stellarService.isValidStellarAddress(text)) {
                this._setRawAddressToFoundAddress(text, "xlmAddress");
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
        const maxSend = this._getMaxSendableAmount();
        const maxAddrLen = this.transactionData.isXlmToken ? 56 : 66;

        const controls: Record<string, unknown> = {
            amount: [this.transactionData?.amount || "", [this._amountValidation(maxSend)]],
            toAddress: [
                this.transactionData?.receiver?.address || "",
                [Validators.required, Validators.maxLength(maxAddrLen), this._addressValidator()],
            ],
            fromAddress: [this.transactionData?.sender?.address || ""],
        };

        if (this.transactionData.isXlmToken) {
            controls.memo = [this.transactionData.memo || "", [Validators.maxLength(28)]];
        }

        this.form = this._formBuilder.group(controls);

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

    async _searchTag(key: string, value: string, domain: string = "zelf"): Promise<void> {
        try {
            const response = await this._tagsService.searchTag(
                key === "tagName" ? { tagName: value, domain, os: "DESKTOP" } : { key, value, domain, os: "DESKTOP" }
            );

            if (!response.data) {
                this.foundAddress = undefined;

                return;
            }

            const foundAddress = new TagModel(response.data.tagObject || (key !== "tagName" ? { publicData: { [this.addressKey]: value } } : {}));

            const zelfObjectContainsAddress = !!foundAddress.publicData[this.addressKey];

            this.foundAddress = zelfObjectContainsAddress ? foundAddress : undefined;
        } catch (error) {
            console.error("Error querying ZNS:", error);
            this.foundAddress = undefined;
        }
    }

    private _setRawAddressToFoundAddress(text: string, addressKey: string): void {
        this.searching = false;
        this.isZelfNameNotFound = false;

        this.foundAddress = new TagModel({
            publicData: {
                [addressKey]: text,
                tagName: this.transactionData?.receiver?.tagName?.replace(".hold", ""),
                domain: this.transactionData?.receiver?.domain,
            },
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

            const memoCtrl = this.form.get("memo");

            if (memoCtrl) {
                this.transactionData.memo = (memoCtrl.value && String(memoCtrl.value).trim()) || undefined;
            }

            this.transactionData.receiver.address = (this.foundAddress && this.foundAddress.publicData[this.addressKey]) || "";
            this.transactionData.receiver.tagName = this.foundAddress?.tagName || "";
            this.transactionData.receiver.domain = this.foundAddress?.domain || "";

            await this._transactionService.setCurrentTransactionData(this.transactionData);
        } catch (exception) {
            console.error("Error setting transaction data", exception);
            this.openErrorSnackBar("send-transaction.error-setting-transaction-data");
        }
    }

    async continueToWithdraw(): Promise<void> {
        const address = this.form.get("toAddress")?.value;

        const isEVM =
            this.transactionData.isEthToken ||
            this.transactionData.isAvaxToken ||
            this.transactionData.isPolToken ||
            this.transactionData.isBscToken ||
            this.transactionData.isBDAGToken;
        if (this.foundAddress) {
            const toAddressCtrl = this.form.get("toAddress");

            if (toAddressCtrl) {
                toAddressCtrl.setValue(this.foundAddress.publicData[this.addressKey] || "");

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
                // Type assertion needed due to TypeScript control flow analysis
                const foundAddressWithBtc = this.foundAddress as TagModel | undefined;
                const btcAddress = foundAddressWithBtc?.publicData?.btcAddress;
                if (btcAddress) {
                    const btcBalance = await this._bitcoinService.getBitcoinBalance(btcAddress);

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
        } else if (this.transactionData.isXlmToken && this._stellarService.isValidStellarAddress(address)) {
            this._setRawAddressToFoundAddress(address, "xlmAddress");
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
            this.transactionData.isEthToken ||
            this.transactionData.isAvaxToken ||
            this.transactionData.isPolToken ||
            this.transactionData.isBscToken ||
            this.transactionData.isBDAGToken;

        if (!this.foundAddress) {
            if (this.transactionData.isSuiToken && this._suiService.isValidSuiAddress(address)) {
                this._setRawAddressToFoundAddress(address, "suiAddress");
            } else if (isEVM && this._checkEVMAddress(address)) {
                this._setRawAddressToFoundAddress(address, "ethAddress");
            } else if (this.transactionData.isSolToken && this._solanaService.isValidSolanaAddress(address)) {
                this._setRawAddressToFoundAddress(address, "solanaAddress");
            } else if (this.transactionData.isBtcToken && this._bitcoinService.isValidBTCAddress(address)) {
                this._setRawAddressToFoundAddress(address, "btcAddress");
            } else if (this.transactionData.isXlmToken && this._stellarService.isValidStellarAddress(address)) {
                this._setRawAddressToFoundAddress(address, "xlmAddress");
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
        this.transactionData.receiver.tagName = "";
        this.transactionData.memo = undefined;

        if (this.withdrawStep) {
            this.foundAddress = undefined;

            this.form.get("toAddress")?.patchValue(this.transactionData.receiver.address);
            this.form.get("amount")?.patchValue(this.transactionData.amount);
            this.form.get("memo")?.patchValue("");

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
        if (this.searching) return;

        const currentValue = this.form.get("toAddress")?.value;

        if (currentValue === address.address) {
            // Deselect: clear without triggering the debounced search
            this.form.get("toAddress")?.patchValue("", { emitEvent: false });
            this.foundAddress = undefined;
            this.isFromRecentAddress = false;
            this.isZelfNameNotFound = false;
            this._setToCurrentTransactionData();
            return;
        }

        // Patch without emitting so valueChanges / debounced search never fires
        this.form.get("toAddress")?.patchValue(address.address, { emitEvent: false });

        // Build foundAddress directly from the address book entry
        this._setRawAddressToFoundAddress(address.address, this.addressKey);

        this.isFromRecentAddress = true;
        this._setToCurrentTransactionData();
    }

    async sendTransaction(): Promise<void> {
        if (this.form.invalid) return;

        this.loading = true;

        try {
            const walletData = await this._walletService.getCurrentWallet();
            const mnemonic = this._vaultService.mnemonic;

            if (!walletData || !mnemonic) throw new Error("No wallet data or mnemonic available");

            const amount = parseFloat(this.form.get("amount")?.value || "0");
            const toAddress = this.form.get("toAddress")?.value;

            if (this.transactionData.isBtcToken) {
                await this._handleBitcoinTransaction(amount, toAddress, mnemonic);
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

    private async _handleBitcoinTransaction(amount: number, toAddress: string, mnemonic: string): Promise<void> {
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
    }

    setToInput(address: AddressBook): void {
        this.form.get("toAddress")?.patchValue(address.address);
    }

    onAmountKeydown(event: KeyboardEvent): void {
        if (event.isComposing) return;
        if (event.ctrlKey || event.metaKey || event.altKey) return;

        const nav = ["Backspace", "Delete", "Tab", "Escape", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
        if (nav.includes(event.key)) return;

        if (/^[0-9]$/.test(event.key)) return;

        if (event.key === ".") {
            const input = event.target as HTMLInputElement;
            if (input.value.includes(".")) event.preventDefault();
            return;
        }

        event.preventDefault();
    }

    onAmountInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const sanitized = this._sanitizeAmountValue(input.value);

        if (sanitized !== input.value) {
            input.value = sanitized;
        }
        this.form.get("amount")?.setValue(sanitized, { emitEvent: true });
    }

    onAmountPaste(event: ClipboardEvent): void {
        event.preventDefault();

        const pasted = event.clipboardData?.getData("text") || "";
        const sanitized = this._sanitizeAmountValue(pasted);

        this.form.get("amount")?.setValue(sanitized, { emitEvent: true });
        this.form.get("amount")?.markAsTouched();
    }

    withdrawAll(): void {
        const c = this.form.get("amount");
        c?.patchValue(this._getMaxSendableAmount());
        c?.markAsTouched();
    }

    private _sanitizeAmountValue(value: string): string {
        if (!value) return "";

        const filtered = value.replace(/[^0-9.]/g, "");
        const parts = filtered.split(".");

        if (parts.length <= 1) return filtered;

        return parts[0] + "." + parts.slice(1).join("");
    }
}
