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
import { DecodedTransaction, getChainConfig } from "@shared/types/dapp.types";
import { ethers } from "ethers";

@Component({
    imports: [CommonModule, MatButtonModule, MatProgressSpinnerModule, ReactiveFormsModule, RouterModule, TranslocoModule, ZelfLoaderComponent],
    selector: "dapp-sign",
    templateUrl: "./dapp-sign.component.html",
    styleUrls: ["./dapp-sign.component.scss"],
})
export class DappSignComponent implements OnInit {
    loading = true;
    signing = false;
    requestId = "";
    origin = "";
    hostname = "";
    favicon = "";
    faviconError = false;
    method = "";
    requiresBiometrics = false;
    passwordSet = false;
    showPassword = false;
    passwordError = false;
    remainingAttempts = 0;

    isPinUnlock = false;
    pinDigits: string[] = ["", "", "", "", "", ""];

    form!: UntypedFormGroup;
    wallet?: TagModel;
    decoded: DecodedTransaction | null = null;

    txTo = "";
    txValue = "";
    txValueFormatted = "";
    txData = "";
    txChainId = 1;
    txNetwork = "ethereum";
    txNetworkName = "Ethereum";
    txChainSymbol = "ETH";

    messageToSign = "";
    isMessageSign = false;

    private _password = "";
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
        const urlParams = new URLSearchParams(window.location.search);
        this.requestId =
            urlParams.get("requestId") ||
            this._activatedRoute.snapshot.queryParams?.requestId ||
            sessionStorage.getItem("pending_sign_request_id") ||
            "";

        if (!this.requestId) {
            this._router.navigate(["/home"]);
            return;
        }

        sessionStorage.removeItem("pending_sign_request_id");

        this.form = this._formBuilder.group({
            password: ["", [Validators.required]],
        });

        try {
            this.wallet = (await this._walletService.getCurrentWallet()) as TagModel;

            const pendingData = await this._loadPendingData();
            if (pendingData) {
                this.origin = pendingData.origin || "";
                this.hostname = pendingData.hostname || this._extractHostname(this.origin);
                this.favicon = pendingData.favicon || "";
                this.method = pendingData.method || "";
                this._pendingParams = pendingData.params;

                if (!this.favicon && this.hostname) {
                    this.favicon = `https://www.google.com/s2/favicons?domain=${this.hostname}&sz=64`;
                }

                const resolvedChainId = pendingData.chainId || 1;
                this.txChainId = resolvedChainId;
                const chainConfig = getChainConfig(resolvedChainId);
                if (chainConfig) {
                    this.txNetwork = chainConfig.network;
                    this.txNetworkName = chainConfig.name;
                    this.txChainSymbol = chainConfig.symbol;
                }

                if (this._isMessageMethod(this.method)) {
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
        if (this.isPinUnlock) {
            return this.passwordSet || this.pinDigits.join("").length === 6;
        }
        return this.passwordSet || !!this.form.get("password")?.value;
    }

    get hostnameInitial(): string {
        return this.hostname ? this.hostname.charAt(0).toUpperCase() : "?";
    }

    onFaviconError(): void {
        this.faviconError = true;
    }

    shortAddress(address: string): string {
        if (!address || address.length < 12) return address;
        return `${address.slice(0, 8)}...${address.slice(-6)}`;
    }

    toggleShowPassword(): void {
        this.showPassword = !this.showPassword;
    }

    async goToBiometrics(): Promise<void> {
        if (!this.hasCredentials || !this.wallet) return;

        if (!this._vaultService.password || this._vaultService.password.trim() === "") {
            this._vaultService.password = this.isPinUnlock ? this.pinDigits.join("") : this.form.get("password")?.value || this._password;
        }

        const tagName = this.wallet?.publicData?.tagName || this.wallet?.fullTagName || "";
        await this._tagsService.setTagName(tagName);
        await this._tagsService.setFlow("unlock");

        sessionStorage.setItem("pending_sign_request_id", this.requestId);
        this._router.navigate(["security/biometrics"], { queryParams: { return: "/dapp/sign" } });
    }

    async confirmSigning(): Promise<void> {
        if (this.signing) return;

        if (this.requiresBiometrics) {
            await this.goToBiometrics();
            return;
        }

        if (!this.isPinUnlock && !this._password && !this.form.get("password")?.value) {
            this._openErrorSnackBar("Enter your password");
            return;
        }

        if (this.isPinUnlock && !this._password && this.pinDigits.join("").length !== 6) {
            this._openErrorSnackBar("Enter your PIN");
            return;
        }

        this.signing = true;

        try {
            const passphrase = this._password || (this.isPinUnlock ? this.pinDigits.join("") : this.form.get("password")?.value);

            // Use oneTimeDecryptMessage (no biometrics timer check) since:
            // 1. We already verified biometrics within this popup flow, and
            // 2. The signing popup is a separate Chrome window whose VaultService
            //    instance may have a stale _lastVerified causing false "expired" errors.
            let mnemonic = await this._signingService.decryptMnemonicOnce(this.wallet as TagModel, passphrase);

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
                    const txResult = await this._signingService.sendEvmTransactionNative(mnemonic, {
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
                    result = txResult.hash;
                }
            }

            await chrome.runtime.sendMessage({
                type: "DAPP_SIGNING_RESULT",
                payload: { requestId: this.requestId, result },
                requestId: this.requestId,
            });

            window.close();
        } catch (error: any) {
            console.error("Signing error:", error);

            if (/incorrect/i.test(error?.message)) {
                await this._handleInvalidCredentials();
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

    private async _handleInvalidCredentials(): Promise<void> {
        this.wallet = (await this._walletService.getCurrentWallet()) as TagModel;
        this.remainingAttempts = this._vaultService.remainingAttempts;
        this.passwordSet = false;
        this._password = "";
        this._vaultService.password = "";

        if (this.isPinUnlock) {
            this.pinDigits = ["", "", "", "", "", ""];
        } else {
            this.form.get("password")?.setValue("");
        }

        await this._checkBiometrics();

        const missingVaultSecrets = !this.wallet?.pgp?.encryptedMessage || !this.wallet?.pgp?.privateKey;
        this.passwordError = !this.requiresBiometrics && !missingVaultSecrets;

        this._changeDetectorRef.detectChanges();
    }

    private _isMessageMethod(method: string): boolean {
        return method === "personal_sign" || method === "eth_sign" || method.startsWith("eth_signTypedData");
    }

    private _parseTransaction(): void {
        if (!this._pendingParams) return;

        const params = Array.isArray(this._pendingParams) ? this._pendingParams[0] : this._pendingParams;

        this.txTo = params.to || "";
        this.txValue = params.value || "0";
        this.txData = params.data || "0x";

        if (params.chainId) {
            const parsed = typeof params.chainId === "string" ? parseInt(params.chainId, 16) : params.chainId;
            if (parsed) {
                this.txChainId = parsed;
                const chainConfig = getChainConfig(parsed);
                if (chainConfig) {
                    this.txNetwork = chainConfig.network;
                    this.txNetworkName = chainConfig.name;
                    this.txChainSymbol = chainConfig.symbol;
                }
            }
        }

        try {
            if (this.txValue && this.txValue !== "0" && this.txValue !== "0x0") {
                this.txValueFormatted = ethers.formatEther(this.txValue);
            }
        } catch {
            this.txValueFormatted = this.txValue;
        }

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
        } else if (publicData.st === "pin") {
            this.isPinUnlock = true;
            this._vaultService.securityType = "pin";
        } else {
            this._vaultService.securityType = "securePassword";
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

    private async _loadPendingData(): Promise<any> {
        try {
            const response = await chrome.runtime.sendMessage({
                type: "DAPP_GET_PENDING",
                requestId: this.requestId,
            });
            if (response?.success && response.data) {
                return response.data;
            }
        } catch {
            // Background might not support this message yet
        }

        const stored = await this._chromeService.getItem<any>("pending_dapp_request_" + this.requestId);
        if (stored && typeof stored === "object" && stored.origin) {
            return stored;
        }

        return null;
    }

    private _extractHostname(origin: string): string {
        if (!origin) return "";
        try {
            return new URL(origin).hostname;
        } catch {
            return origin;
        }
    }

    private _parseRpcError(raw: string): string {
        if (!raw) return "Transaction failed. Please try again.";
        const msg = raw.toLowerCase();

        if (msg.includes("insufficient funds")) {
            return `Not enough ${this.txChainSymbol} to cover gas fees. Add funds to your wallet and try again.`;
        }
        if (msg.includes("execution reverted") || msg.includes("reverted")) {
            if (msg.includes("slippage") || msg.includes("price impact")) {
                return "Swap failed: price moved too much. Try increasing slippage tolerance.";
            }
            return "Transaction reverted on-chain. The swap may have expired — please try again.";
        }
        if (msg.includes("nonce too low") || msg.includes("replacement transaction underpriced")) {
            return "Transaction conflict. Please wait a moment and try again.";
        }
        if (msg.includes("gas required exceeds allowance") || msg.includes("gas limit")) {
            return "Gas limit too low. Try increasing slippage or gas settings.";
        }
        if (msg.includes("user rejected") || msg.includes("rejected by user")) {
            return "Transaction cancelled.";
        }
        if (msg.includes("incorrect_passphrase") || msg.includes("incorrect passphrase")) {
            return "Incorrect password. Please try again.";
        }
        if (msg.includes("network") || msg.includes("connection")) {
            return "Network error. Check your connection and try again.";
        }

        return "Transaction failed. Please try again.";
    }

    private _openErrorSnackBar(rawMessage: string): void {
        const friendlyMessage = this._parseRpcError(rawMessage);
        this._snackBar.open(friendlyMessage, this._translocoService.translate("common.close"), {
            duration: 7000,
            panelClass: "zelf-snackbar",
            verticalPosition: "top",
        });
    }

    onInputFocus(event: Event): void {
        (event.target as HTMLInputElement).select();
    }

    onPinInput(event: Event, index: number): void {
        const input = event.target as HTMLInputElement;
        const value = input.value;
        this.passwordError = false;

        if (value.length > 1) {
            const digits = value.slice(0, 6).split("");
            this.pinDigits = [...digits, ...Array(6 - digits.length).fill("")].slice(0, 6);
            const lastIndex = Math.min(digits.length - 1, 5);
            setTimeout(() => {
                const inputs = this._getPinInputs();
                if (inputs[lastIndex]) inputs[lastIndex].focus();
            }, 0);
            return;
        }

        this.pinDigits[index] = value;

        if (value && index < 5) {
            setTimeout(() => {
                const inputs = this._getPinInputs();
                if (inputs[index + 1]) inputs[index + 1].focus();
            }, 0);
        }
    }

    onPinKeyDown(event: KeyboardEvent, index: number): void {
        const input = event.target as HTMLInputElement;

        if (event.key === "Backspace" && !input.value && index > 0) {
            setTimeout(() => {
                const inputs = this._getPinInputs();
                if (inputs[index - 1]) {
                    inputs[index - 1].focus();
                    this.pinDigits[index - 1] = "";
                }
            }, 0);
        } else if (event.key === "Enter") {
            if (this.hasCredentials && !this.signing) {
                this.requiresBiometrics ? this.goToBiometrics() : this.confirmSigning();
            }
        }
    }

    private _getPinInputs(): HTMLInputElement[] {
        return Array.from(document.querySelectorAll<HTMLInputElement>(".dapp-sign__pin-input"));
    }

    trackByIndex(index: number): number {
        return index;
    }

    clearCredentialError(): void {
        this.passwordError = false;
    }
}
