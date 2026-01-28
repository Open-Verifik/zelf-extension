import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";

import { WalletService } from "../../wallet.service";
import { SolanaService } from "../../solana.service";

const ZNS_TOKEN_SYMBOL = "ZNS";

export interface RedeemOption {
    id: string;
    title: string;
    costZns: number;
    disabled?: boolean;
}

@Component({
    imports: [CommonModule, MatButtonModule, RouterModule],
    selector: "app-redeem-zns",
    styleUrls: ["./redeem-zns.component.scss", "../../main.scss"],
    templateUrl: "./redeem-zns.component.html",
})
export class RedeemZnsComponent implements OnInit {
    znsBalance: number = 0;
    znsBalanceLoading: boolean = false;
    useRpcForZnsBalance: boolean = true;

    readonly options: RedeemOption[] = [
        { id: "zelfname-1m", title: "Get one month for your ZelfName", costZns: 100 },
        { id: "zelfname-2m", title: "Get two months for your ZelfName", costZns: 200 },
        { id: "zelfname-5m", title: "Get five months for your ZelfName", costZns: 500 },
        { id: "zns-3y-6-15", title: "Buy an ZNS (3 years) of 6 - 15 length", costZns: 3000 },
        { id: "zns-1y-6-15", title: "Buy an ZNS (1 year) of 6 - 15 length", costZns: 1000 },
        { id: "zns-2y-6-15", title: "Buy an ZNS (2 years) of 6 - 15 length", costZns: 2000 },
        { id: "zns-3y-6-15-b", title: "Buy an ZNS (3 years) of 6 - 15 length", costZns: 3000 },
    ];

    constructor(
        private _walletService: WalletService,
        private _solanaService: SolanaService
    ) {}

    ngOnInit(): void {
        this._loadZnsBalance();
    }

    private async _loadZnsBalance(): Promise<void> {
        this.znsBalanceLoading = true;
        this.znsBalance = 0;

        try {
            const wallet = await this._walletService.getCurrentWallet();
            const solanaAddress = wallet?.publicData?.solanaAddress;

            if (!solanaAddress) {
                return;
            }

            if (this.useRpcForZnsBalance) {
                this.znsBalance = await this._solanaService.getZnsBalanceViaRpc(solanaAddress);
            } else {
                const response = await this._solanaService.getWalletDetails(solanaAddress, { source: "oklink" });
                const tokens = response?.data?.tokenHoldings?.tokens ?? response?.tokenHoldings?.tokens ?? [];
                const znsToken = Array.isArray(tokens)
                    ? tokens.find((t: any) => (t.symbol || "").toUpperCase() === ZNS_TOKEN_SYMBOL)
                    : null;
                const amount = znsToken?.amount ?? znsToken?.balance ?? 0;
                this.znsBalance = typeof amount === "number" ? amount : parseFloat(String(amount)) || 0;
            }
        } catch (error) {
            console.error("Error loading ZNS balance:", error);
        } finally {
            this.znsBalanceLoading = false;
        }
    }

    isOptionDisabled(opt: RedeemOption): boolean {
        return this.znsBalance < opt.costZns;
    }

    onOptionClick(opt: RedeemOption): void {
        if (this.isOptionDisabled(opt)) return;
        // TODO: Implement redemption flow
        console.log("Redeem option clicked:", opt);
    }
}
