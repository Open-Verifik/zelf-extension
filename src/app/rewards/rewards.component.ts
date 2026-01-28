import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { WalletService } from "../wallet.service";
import { SolanaService } from "../solana.service";

/** ZNS token mint on Solana (for reference; balance is fetched via backend /api/solana/address) */
const ZNS_TOKEN_SYMBOL = "ZNS";

interface Task {
    id: string;
    title: string;
    reward: string;
    completed: boolean;
    action?: () => void;
}

@Component({
    imports: [CommonModule, MatButtonModule, RouterModule, TranslocoModule],
    selector: "rewards",
    styleUrls: ["./rewards.component.scss", "../main.scss"],
    templateUrl: "./rewards.component.html",
})
export class RewardsComponent implements OnInit {
    znsBalance: number = 0;
    znsBalanceLoading: boolean = false;
    invitedFriends: number = 0;
    maxInvites: number = 10;

    /**
     * Toggle to test ZNS balance source: false = backend API (/api/solana/address), true = Solana RPC (getTokenAccountBalance).
     * Switch and compare latency/accuracy; leave false for production (backend) unless you prefer RPC.
     */
    useRpcForZnsBalance: boolean = true;

    tasks: Task[] = [
        {
            id: "invite-friend",
            title: "Invite your first friend",
            reward: "Win 100 $ZNS",
            completed: false,
        },
        {
            id: "first-transaction",
            title: "Send your first ZNS transaction",
            reward: "Win up-to 100 $ZNS",
            completed: false,
        },
        {
            id: "join-discord",
            title: "Join our Discord",
            reward: "Win 25 $ZNS",
            completed: false,
        },
        {
            id: "join-telegram",
            title: "Join our telegram community",
            reward: "Win 25 $ZNS",
            completed: false,
        },
        {
            id: "join-x",
            title: "Join us on X",
            reward: "Win 5 $ZNS",
            completed: false,
        },
    ];

    constructor(
        private _walletService: WalletService,
        private _solanaService: SolanaService
    ) {}

    ngOnInit(): void {
        this._loadZnsBalance();
    }

    /**
     * Load ZNS balance for the current wallet's Solana address.
     * Source depends on useRpcForZnsBalance: backend API vs Solana RPC.
     */
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
                console.log("ZNS balance via RPC:", this.znsBalance, { solanaAddress });
                return;
            }

            const response = await this._solanaService.getWalletDetails(solanaAddress, { source: "oklink" });

            const tokens = response?.data?.tokenHoldings?.tokens ?? response?.tokenHoldings?.tokens ?? [];

            const znsToken = Array.isArray(tokens) ? tokens.find((t: any) => (t.symbol || "").toUpperCase() === ZNS_TOKEN_SYMBOL) : null;

            const amount = znsToken?.amount ?? znsToken?.balance ?? 0;

            this.znsBalance = typeof amount === "number" ? amount : parseFloat(String(amount)) || 0;
        } catch (error) {
            console.error("Error loading ZNS balance:", error);
        } finally {
            this.znsBalanceLoading = false;
        }
    }

    onInviteFriends(): void {
        // TODO: Implement invite friends functionality
        console.log("Invite friends clicked");
    }

    onDailyRewards(): void {
        // TODO: Navigate to daily rewards/roulette
        console.log("Daily rewards clicked");
    }

    onRedeemZNS(): void {
        // TODO: Implement redeem functionality
        console.log("Redeem ZNS clicked");
    }

    onTaskClick(task: Task): void {
        if (task.completed) return;

        switch (task.id) {
            case "invite-friend":
                this.onInviteFriends();
                break;
            case "first-transaction":
                // Navigate to send
                break;
            case "join-discord":
                window.open("https://discord.gg/zelf", "_blank");
                break;
            case "join-telegram":
                window.open("https://t.me/zelfworld", "_blank");
                break;
            case "join-x":
                window.open("https://x.com/AZelfName", "_blank");
                break;
        }
    }
}
