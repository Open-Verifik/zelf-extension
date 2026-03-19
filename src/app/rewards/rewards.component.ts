import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { WalletService } from "../wallet.service";
import { SolanaService } from "../solana.service";
import { TagsService } from "../tags.service";
import { ChromeService } from "../chrome.service";
import { RewardsService, RouletteWheelResponse } from "../services/rewards.service";

/** ZNS token mint on Solana (for reference; balance is fetched via backend /api/solana/address) */
const ZNS_TOKEN_SYMBOL = "ZNS";

interface Task {
    id: string;
    titleKey: string;
    rewardKey: string;
    rewardParams?: Record<string, unknown>;
    comingSoon?: boolean;
    completed: boolean;
    action?: () => void;
}

@Component({
    imports: [CommonModule, MatButtonModule, RouterModule, TranslocoModule],
    selector: "rewards",
    styleUrls: ["./rewards.component.scss", "../main.scss"],
    templateUrl: "./rewards.component.html",
})
export class RewardsComponent implements OnInit, OnDestroy {
    znsBalance: number = 0;
    znsBalanceLoading: boolean = false;
    invitedFriends: number = 0;
    referralsLoading: boolean = false;
    maxInvites: number = 10;

    dailyRewardLoading: boolean = false;
    dailyRewardAvailable: boolean = true;
    nextClaimAvailable: string | null = null;
    countdownHours: number = 0;
    countdownMinutes: number = 0;
    countdownSeconds: number = 0;
    private countdownInterval: any = null;

    /**
     * Toggle to test ZNS balance source: false = backend API (/api/solana/address), true = Solana RPC (getTokenAccountBalance).
     * Switch and compare latency/accuracy; leave false for production (backend) unless you prefer RPC.
     */
    useRpcForZnsBalance: boolean = true;

    tasks: Task[] = [
        {
            id: "invite-friend",
            titleKey: "rewards.tasks.invite_first_friend.title",
            rewardKey: "rewards.tasks.invite_first_friend.reward",
            completed: false,
        },
        {
            id: "first-transaction",
            titleKey: "rewards.tasks.first_transaction.title",
            rewardKey: "rewards.tasks.first_transaction.reward",
            completed: false,
        },
        {
            id: "join-discord",
            titleKey: "rewards.tasks.join_discord.title",
            rewardKey: "rewards.tasks.join_discord.reward",
            comingSoon: true,
            completed: false,
        },
        {
            id: "join-telegram",
            titleKey: "rewards.tasks.join_telegram.title",
            rewardKey: "rewards.tasks.join_telegram.reward",
            comingSoon: true,
            completed: false,
        },
        {
            id: "join-x",
            titleKey: "rewards.tasks.join_x.title",
            rewardKey: "rewards.tasks.join_x.reward",
            comingSoon: true,
            completed: false,
        },
    ];

    constructor(
        private _walletService: WalletService,
        private _solanaService: SolanaService,
        private _tagsService: TagsService,
        private _chromeService: ChromeService,
        private _rewardsService: RewardsService,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this._loadZnsBalance();
        this._loadInvites();
        this._checkFirstTransactionCache();
        this._loadDailyRewardsStatus();
    }

    ngOnDestroy(): void {
        this.stopCountdown();
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

    /**
     * Load referral data to count unique friends invited.
     */
    private async _loadInvites(): Promise<void> {
        this.referralsLoading = true;
        try {
            // Check cache first
            const cachedInvites = await this._chromeService.getItem("zns_invites_cache");
            // Cache valid for 30 minutes
            if (cachedInvites && cachedInvites.timestamp > Date.now() - 30 * 60 * 1000) {
                this.invitedFriends = cachedInvites.count;
                this.referralsLoading = false;
                return;
            }

            const wallet = await this._walletService.getCurrentWallet();
            // Fallback to searching if tagName/domain not in publicData (sometimes in metadata)
            const tagName = wallet?.tagName || wallet?.publicData?.tagName;
            const domain = wallet?.domain || wallet?.publicData?.domain;

            if (!tagName || !domain) return;

            const response = await this._tagsService.getMyReferrals(tagName, domain);
            const referrals = response?.data?.referrals || [];

            // Group by unique friend (stripping .hold)
            const uniqueFriends = new Set(referrals.map((r: any) => (r.name || r.tagName).replace(/\.hold$/, "")));
            this.invitedFriends = uniqueFriends.size;

            // Cache the result
            await this._chromeService.setItem("zns_invites_cache", {
                timestamp: Date.now(),
                count: this.invitedFriends,
            });
        } catch (error) {
            console.error("Error loading referral count:", error);
            this.invitedFriends = 0;
        } finally {
            this.referralsLoading = false;
        }
    }

    private async _checkFirstTransactionCache(): Promise<void> {
        try {
            const cachedStatus = await this._chromeService.getItem("zns_first_transaction_status");
            if (cachedStatus && (cachedStatus.status === "success" || cachedStatus.status === "already_claimed")) {
                const task = this.tasks.find((t) => t.id === "first-transaction");
                if (task) {
                    task.completed = true;
                    task.rewardKey = "rewards.tasks.first_transaction.reward_completed";
                    task.rewardParams = { amount: cachedStatus.amount || 0 };
                }
            }
        } catch (error) {
            console.error("Error checking first transaction cache:", error);
        }
    }

    private async _loadDailyRewardsStatus(): Promise<void> {
        this.dailyRewardLoading = true;
        try {
            const wallet = await this._walletService.getCurrentWallet();
            if (!wallet) return;

            const tagName = wallet.tagName || wallet.publicData?.tagName || wallet.name || "";
            const domain = wallet.domain || wallet.publicData?.domain || (await this._tagsService.getDomain()) || "zelf";

            if (!tagName) return;

            const wheelConfig: RouletteWheelResponse = await this._rewardsService.getRouletteWheel(tagName, domain);

            if (wheelConfig && !wheelConfig.canSpin && wheelConfig.alreadyClaimedToday && wheelConfig.nextClaimAvailable) {
                this.dailyRewardAvailable = false;
                this.nextClaimAvailable = wheelConfig.nextClaimAvailable;
                this.startCountdown();
            } else {
                this.dailyRewardAvailable = true;
            }
        } catch (error) {
            console.error("Error loading daily rewards status:", error);
            // Default to available if there's an error so the module handles it
            this.dailyRewardAvailable = true;
        } finally {
            this.dailyRewardLoading = false;
        }
    }

    private startCountdown(): void {
        if (!this.nextClaimAvailable) return;

        this.updateCountdown();
        this.countdownInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    private updateCountdown(): void {
        if (!this.nextClaimAvailable) return;

        const now = new Date().getTime();
        const target = new Date(this.nextClaimAvailable).getTime();
        const diff = target - now;

        if (diff <= 0) {
            this.stopCountdown();
            this.countdownHours = 0;
            this.countdownMinutes = 0;
            this.countdownSeconds = 0;
            return;
        }

        this.countdownHours = Math.floor(diff / (1000 * 60 * 60));
        this.countdownMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        this.countdownSeconds = Math.floor((diff % (1000 * 60)) / 1000);
    }

    private stopCountdown(): void {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }

    onDailyRewardsClick(): void {
        if (this.dailyRewardLoading) return;
        if (!this.dailyRewardAvailable) return;
        this._router.navigate(["/rewards/daily"]);
    }

    onInviteFriends(): void {
        this._router.navigate(["/rewards/invite"]);
    }

    onRedeemZNS(): void {
        this._router.navigate(["/rewards/redeem"]);
    }

    onTaskClick(task: Task): void {
        if (task.comingSoon) return;

        switch (task.id) {
            case "invite-friend":
                this.onInviteFriends();
                break;
            case "first-transaction":
                this._router.navigate(["/rewards/first-transaction"]);
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
