import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { TranslocoModule } from "@jsverse/transloco";

import { WalletService } from "../../wallet.service";
import { RewardsService } from "../../services/rewards.service";

type ComponentState = "loading" | "success" | "not_eligible" | "already_claimed" | "error";

import { ChromeService } from "../../chrome.service";

@Component({
    imports: [CommonModule, MatButtonModule, RouterModule, TranslocoModule],
    selector: "app-first-transaction",
    styleUrls: ["./first-transaction.component.scss", "../../main.scss"],
    templateUrl: "./first-transaction.component.html",
})
export class FirstTransactionComponent implements OnInit {
    // ... existing properties ...
    state: ComponentState = "loading";
    tagName: string = "";
    domain: string = "";
    rewardAmount: number = 0;
    errorMessage: string = "";
    confettiParticles: { x: number; delay: number; duration: number; color: string }[] = [];
    instructions = {
        action: "Send ZNS tokens",
        description: "Make your first ZNS token transaction to unlock this reward",
    };

    constructor(
        private _router: Router,
        private _walletService: WalletService,
        private _rewardsService: RewardsService,
        private _chromeService: ChromeService
    ) {}

    ngOnInit(): void {
        this._loadWalletAndCheck();
    }

    private async _loadWalletAndCheck(): Promise<void> {
        this.state = "loading";

        try {
            // Check cache first
            const cachedStatus = await this._chromeService.getItem("zns_first_transaction_status");
            if (cachedStatus && (cachedStatus.status === "success" || cachedStatus.status === "already_claimed")) {
                this.state = cachedStatus.status;
                this.rewardAmount = cachedStatus.amount || 0;
                if (this.state === "success") {
                    this._triggerConfetti();
                }
                return;
            }

            const wallet = await this._walletService.getCurrentWallet();

            if (!wallet) {
                this.errorMessage = "rewards.first_transaction.error_no_wallet";
                this.state = "error";
                return;
            }
            // ... rest of the function ...

            // Extract tagName and domain
            if (wallet.fullTagName) {
                const lastDot = wallet.fullTagName.lastIndexOf(".");
                this.tagName = lastDot >= 0 ? wallet.fullTagName.slice(0, lastDot) : wallet.fullTagName;
                this.domain = lastDot >= 0 ? wallet.fullTagName.slice(lastDot + 1) : "";
            } else if (wallet.publicData?.tagName && wallet.publicData?.domain) {
                this.tagName = wallet.publicData.tagName;
                this.domain = wallet.publicData.domain;
            }

            if (!this.tagName || !this.domain) {
                this.errorMessage = "rewards.first_transaction.error_invalid_config";
                this.state = "error";
                return;
            }

            await this._checkAndClaim();
        } catch (error: any) {
            console.error("Error loading wallet:", error);
            this.errorMessage = error?.message || "Failed to load wallet";
            this.state = "error";
        }
    }

    private async _checkAndClaim(): Promise<void> {
        try {
            const result = await this._rewardsService.claimFirstTransaction({
                tagName: this.tagName,
                domain: this.domain,
            });

            if (result.success) {
                // Successfully claimed reward
                this.rewardAmount = result.reward?.amount || 0;
                this._triggerConfetti();
                this.state = "success";

                // Cache success
                await this._chromeService.setItem("zns_first_transaction_status", {
                    status: "success",
                    amount: this.rewardAmount,
                });
            } else if (result.alreadyClaimed) {
                // Already claimed - show the amount they won
                this.rewardAmount = result.reward?.amount || 0;
                this.state = "already_claimed";

                // Cache already claimed
                await this._chromeService.setItem("zns_first_transaction_status", {
                    status: "already_claimed",
                    amount: this.rewardAmount,
                });
            } else if (result.eligible === false) {
                // Not eligible - show instructions
                this.instructions = result.requirements || this.instructions;
                this.state = "not_eligible";
            } else {
                this.errorMessage = result.message || "Unknown error";
                this.state = "error";
            }
        } catch (error: any) {
            console.error("Error checking first transaction:", error);

            // Check if it's an API error with specific message
            const errorData = error?.error;
            if (errorData?.alreadyClaimed) {
                this.rewardAmount = errorData.reward?.amount || 0;
                this.state = "already_claimed";
            } else if (errorData?.eligible === false) {
                this.instructions = errorData.requirements || this.instructions;
                this.state = "not_eligible";
            } else {
                this.errorMessage = errorData?.message || error?.message || "Failed to check eligibility";
                this.state = "error";
            }
        }
    }

    /** Generate confetti particles for celebration */
    private _triggerConfetti(): void {
        const colors = ["#ff6b35", "#ffb347", "#34c759", "#007aff", "#ff2d55", "#af52de", "#ffcc00"];
        this.confettiParticles = [];

        for (let i = 0; i < 60; i++) {
            this.confettiParticles.push({
                x: Math.random() * 100,
                delay: Math.random() * 0.8,
                duration: 2 + Math.random() * 2.5,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }
    }

    /** Navigate to send page to make a transaction */
    goToSend(): void {
        this._router.navigate(["/send"]);
    }

    /** Navigate back to rewards */
    goBack(): void {
        this._router.navigate(["/rewards"]);
    }

    /** Retry the check */
    retry(): void {
        this._loadWalletAndCheck();
    }
}
