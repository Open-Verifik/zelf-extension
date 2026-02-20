import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { ChromeService } from "app/chrome.service";
import { SigningService } from "app/services/signing.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { DappApprovalRequest, PendingDappRequest, VerifyStatus, getChainConfig, chainIdToHex } from "@shared/types/dapp.types";

@Component({
    imports: [CommonModule, MatButtonModule, TranslocoModule, ZelfLoaderComponent],
    selector: "dapp-connect",
    templateUrl: "./dapp-connect.component.html",
    styleUrls: ["./dapp-connect.component.scss"],
})
export class DappConnectComponent implements OnInit {
    loading = true;
    requestId = "";
    origin = "";
    accounts: { tagName: string; address: string; selected: boolean }[] = [];
    verifyStatus: VerifyStatus = "UNKNOWN";
    chainName = "BlockDAG";
    pendingRequest: PendingDappRequest | null = null;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _chromeService: ChromeService,
        private _router: Router,
        private _signingService: SigningService
    ) {}

    async ngOnInit(): Promise<void> {
        this.requestId = this._activatedRoute.snapshot.queryParams?.requestId || "";

        if (!this.requestId) {
            this._router.navigate(["/home"]);
            return;
        }

        try {
            const allAccounts = await this._signingService.getAllWalletAccounts();

            this.accounts = allAccounts.map((acc, index) => ({
                tagName: acc.tagName,
                address: acc.address,
                selected: index === 0,
            }));

            const pendingData = await this._chromeService.getItem<any>("pending_dapp_request_" + this.requestId);
            if (pendingData) {
                this.origin = pendingData.origin || "";
                this.verifyStatus = pendingData.verifyStatus || "UNKNOWN";
            }
        } catch (error) {
            console.error("Error loading dApp connect data:", error);
        }

        this.loading = false;
    }

    get selectedAccounts(): string[] {
        return this.accounts.filter((a) => a.selected).map((a) => a.address);
    }

    get verifyLabel(): string {
        switch (this.verifyStatus) {
            case "VALID":
                return "Verified dApp";
            case "INVALID":
                return "Domain mismatch";
            case "THREAT":
                return "Flagged as malicious";
            default:
                return "Unverified";
        }
    }

    get verifyClass(): string {
        switch (this.verifyStatus) {
            case "VALID":
                return "verify--valid";
            case "INVALID":
                return "verify--invalid";
            case "THREAT":
                return "verify--threat";
            default:
                return "verify--unknown";
        }
    }

    get isThreat(): boolean {
        return this.verifyStatus === "THREAT";
    }

    toggleAccount(index: number): void {
        this.accounts[index].selected = !this.accounts[index].selected;
    }

    shortAddress(address: string): string {
        if (!address || address.length < 12) return address;
        return `${address.slice(0, 8)}...${address.slice(-6)}`;
    }

    async approve(): Promise<void> {
        if (this.isThreat || this.selectedAccounts.length === 0) return;

        try {
            await chrome.runtime.sendMessage({
                type: "DAPP_APPROVAL_RESULT",
                payload: {
                    requestId: this.requestId,
                    approved: true,
                    accounts: this.selectedAccounts,
                    chainId: 1404,
                },
                requestId: this.requestId,
            });
        } catch (error) {
            console.error("Error sending approval:", error);
        }

        window.close();
    }

    async reject(): Promise<void> {
        try {
            await chrome.runtime.sendMessage({
                type: "DAPP_APPROVAL_RESULT",
                payload: {
                    requestId: this.requestId,
                    approved: false,
                },
                requestId: this.requestId,
            });
        } catch (error) {
            console.error("Error sending rejection:", error);
        }

        window.close();
    }
}
