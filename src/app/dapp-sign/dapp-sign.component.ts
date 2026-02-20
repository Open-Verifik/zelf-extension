import { CommonModule } from "@angular/common";
import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { ChromeService } from "app/chrome.service";
import { SigningService, DappTransactionParams } from "app/services/signing.service";
import { TxDecoderService } from "app/services/tx-decoder.service";
import { VaultService } from "app/vault.service";
import { WalletService } from "app/wallet.service";
import { TagsService } from "app/tags.service";
import { TagModel } from "app/tags.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { DecodedTransaction, PendingDappRequest, getChainConfig } from "@shared/types/dapp.types";

@Component({
    imports: [
        CommonModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        RouterModule,
        TranslocoModule,
        ZelfLoaderComponent,
    ],
    selector: "dapp-sign",
    templateUrl: "./dapp-sign.component.html",
    styleUrls: ["./dapp-sign.component.scss"],
})
export class DappSignComponent implements OnInit {
    loading = true;
    signing = false;
    requestId = "";
    origin = "";
    method = "";
    requiresBiometrics = false;
    passwordSet = false;
    showPassword = false;
    passwordError = false;
    remainingAttempts = 0;

    form!: UntypedFormGroup;
    wallet?: TagModel;
    decoded: DecodedTransaction | null = null;

    txTo = "";
    txValue = "";
    txData = "";
    txChainId = 1404;
    txNetwork = "blockdag";
    txNetworkName = "BlockDAG";

    messageToSign = "";
    isMessageSign = false;

    private _password = "";
    private _mnemonics = "";
    private _pendingParams: any = null;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _chromeService: ChromeService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _signingService: SigningService,
        private _snackBar: MatSnackBar,
        private _tagsService: TagsService,
        private _translocoService: TranslocoService,
        private _txDecoder: TxDecoderService,
        private _vaultService: VaultService,
        private _walletService: WalletService
    ) {
        this.remainingAttempts = this._vaultService.remainingAttempts;
        this._password = this._vaultService.password;
        this._vaultService.mnemonic = "";
        this._vaultService.password = "";

        if (this._password?.trim()) {
            this.passwordSet = true;
        }
    }

    async ngOnInit(): Promise<void> {
        this.requestId = this._activatedRoute.snapshot.queryParams?.requestId || "";

        if (!this.requestId) {
            this._router.navigate(["/home"]);
            return;
        }

        this.form = this._formBuilder.group({
            password: ["", [Validators.required]],
        });

        try {
            this.wallet = (await this._walletService.getCurrentWallet()) as TagModel;

            const pendingData = await this._chromeService.getItem<any>("pending_dapp_request_" + this.requestId);
            if (pendingData) {
                this.origin = pendingData.origin || "";
                this.method = pendingData.method || "";
                this._pendingParams = pendingData.params;

                if (this.method === "personal_sign" || this.method === "eth_sign" || this.method.startsWith("eth_signTypedData")) {
                    this.isMessageSign = true;
                    this._parseMessage();
                } else {
                    this._parseTransaction();
                }
            }

            await this._checkPasswordlessWallet();
            await this._checkBiometrics();
        } catch (error) {
            console.error("Error loading signing data:", error);
        }

        this.loading = false;
    }

    get hasCredentials(): boolean {
        return this.passwordSet || !!this.form.get("password")?.value;
    }

    private _parseTransaction(): void {
        if (!this._pendingParams) return;

        const params = Array.isArray(this._pendingParams) ? this._pendingParams[0] : this._pendingParams;

        this.txTo = params.to || "";
        this.txValue = params.value || "0";
        this.txData = params.data || "0x";
        this.txChainId = params.chainId ? parseInt(params.chainId, 16) : 1404;

        const chainConfig = getChainConfig(this.txChainId);
        this.txNetwork = chainConfig?.network || "blockdag";
        this.txNetworkName = chainConfig?.name || "BlockDAG";

        this.decoded = this._txDecoder.decode(this.txTo, this.txData, this.txValue);
    }

    private _parseMessage(): void {
        if (!this._pendingParams) return;

        const params = Array.isArray(this._pendingParams) ? this._pendingParams : [this._pendingParams];

        if (this.method === "personal_sign") {
            this.messageToSign = params[0] || "";
            if (this.messageToSign.startsWith("0x")) {
                try {
                    const bytes = [];
                    for (let i = 2; i < this.messageToSign.length; i += 2) {
                        bytes.push(parseInt(this.messageToSign.substring(i, i + 2), 16));
                    }
                    this.messageToSign = new TextDecoder().decode(new Uint8Array(bytes));
                } catch {
                    // Keep hex if can't decode
                }
            }
        } else if (this.method.startsWith("eth_signTypedData")) {
            const typedData = typeof params[1] === "string" ? params[1] : JSON.stringify(params[1], null, 2);
            this.messageToSign = typedData;
        }
    }

    private async _checkPasswordlessWallet(): Promise<void> {
        if (!this.wallet?.publicData) return;

        const publicData = this.wallet.publicData as any;

        if (String(publicData.hasPassword) === "false") {
            this._password = "NO_PASSWORD_PLACEHOLDER";
            this._vaultService.password = "NO_PASSWORD_PLACEHOLDER";
            this._vaultService.securityType = "withoutPassword";
            this.passwordSet = true;
        }
    }

    private async _checkBiometrics(): Promise<void> {
        const biometricsRequired = await this._vaultService.biometricsRequired();

        if (!this.wallet?.pgp?.encryptedMessage || !this.wallet?.pgp?.privateKey || biometricsRequired) {
            this.requiresBiometrics = true;
            return;
        }

        this.requiresBiometrics = false;
    }

    async goToBiometrics(): Promise<void> {
        if (!this.hasCredentials || !this.wallet) return;

        if (!this._vaultService.password || this._vaultService.password.trim() === "") {
            this._vaultService.password = this.form.get("password")?.value || this._password;
        }

        const tagName = this.wallet?.publicData?.tagName || this.wallet?.fullTagName || "";
        await this._tagsService.setTagName(tagName);
        await this._tagsService.setFlow("unlock");

        this._router.navigate(["security/biometrics"], { queryParams: { return: `/dapp/sign?requestId=${this.requestId}` } });
    }

    async confirmSigning(): Promise<void> {
        if (this.signing) return;

        if (this.requiresBiometrics) {
            await this.goToBiometrics();
            return;
        }

        if (!this._password && !this.form.get("password")?.value) {
            this._openErrorSnackBar("Enter your password");
            return;
        }

        this.signing = true;

        try {
            const passphrase = this._password || this.form.get("password")?.value;
            const mnemonic = await this._signingService.decryptMnemonic(this.wallet as TagModel, passphrase);

            if (!mnemonic) {
                this._openErrorSnackBar("Failed to decrypt wallet");
                this.signing = false;
                return;
            }

            let result: any;

            if (this.isMessageSign) {
                const signResult = await this._signingService.signMessage(mnemonic, {
                    method: this.method as any,
                    message: Array.isArray(this._pendingParams) ? this._pendingParams[0] : this._pendingParams,
                });
                result = signResult.signature;
            } else {
                const params = Array.isArray(this._pendingParams) ? this._pendingParams[0] : this._pendingParams;

                if (this.method === "eth_signTransaction") {
                    result = await this._signingService.signRawTransaction(mnemonic, {
                        to: params.to,
                        value: params.value,
                        data: params.data,
                        gasLimit: params.gas || params.gasLimit,
                        gasPrice: params.gasPrice,
                        maxFeePerGas: params.maxFeePerGas,
                        maxPriorityFeePerGas: params.maxPriorityFeePerGas,
                        nonce: params.nonce ? parseInt(params.nonce, 16) : undefined,
                        chainId: this.txChainId,
                        network: this.txNetwork,
                    });
                } else {
                    const txResult = await this._signingService.signEvmTransaction(mnemonic, {
                        to: params.to,
                        value: params.value,
                        data: params.data,
                        chainId: this.txChainId,
                        network: this.txNetwork,
                    });
                    result = txResult.hash;
                }
            }

            await chrome.runtime.sendMessage({
                type: "DAPP_SIGNING_RESULT",
                payload: {
                    requestId: this.requestId,
                    result,
                },
                requestId: this.requestId,
            });

            window.close();
        } catch (error: any) {
            console.error("Signing error:", error);

            if (error?.message === "expired") {
                this.requiresBiometrics = true;
                this._changeDetectorRef.detectChanges();
            } else if (/incorrect/i.test(error?.message)) {
                this.passwordError = true;
                this.remainingAttempts = this._vaultService.remainingAttempts;
            } else {
                this._openErrorSnackBar(error?.message || "Signing failed");
            }

            this.signing = false;
        }
    }

    async reject(): Promise<void> {
        try {
            await chrome.runtime.sendMessage({
                type: "DAPP_SIGNING_RESULT",
                payload: {
                    requestId: this.requestId,
                    error: { code: 4001, message: "User rejected the request" },
                },
                requestId: this.requestId,
            });
        } catch (error) {
            console.error("Error sending rejection:", error);
        }

        window.close();
    }

    toggleShowPassword(): void {
        this.showPassword = !this.showPassword;
    }

    shortAddress(address: string): string {
        if (!address || address.length < 12) return address;
        return `${address.slice(0, 8)}...${address.slice(-6)}`;
    }

    private _openErrorSnackBar(message: string): void {
        this._snackBar.open(message, this._translocoService.translate("common.close"), {
            duration: 5000,
            panelClass: "zelf-snackbar",
            verticalPosition: "top",
        });
    }
}
