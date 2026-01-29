import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { TranslocoModule } from "@jsverse/transloco";

import { TagsService } from "../../tags.service";

type ClaimState = "loading" | "success" | "error";

@Component({
    imports: [CommonModule, MatButtonModule, RouterModule, TranslocoModule],
    selector: "app-claim-reward",
    styleUrls: ["./claim-reward.component.scss", "../../main.scss"],
    templateUrl: "./claim-reward.component.html",
})
export class ClaimRewardComponent implements OnInit, OnDestroy {
    state: ClaimState = "loading";

    // Claim parameters from route
    tagName: string = "";
    domain: string = "";
    friendTagName: string = "";
    friendDomain: string = "";
    friendFullName: string = "";
    expectedReward: number = 0;

    // Result data
    claimedRewardAmount: number = 0;
    signature: string = "";

    /**
     * The error translation key.
     * If the backend returns "reward_already_claimed", we map it to "claim_reward.error.messages.reward_already_claimed".
     */
    errorKey: string = "claim_reward.error.messages.generic";
    // Fallback error message if no key is mapped
    fallbackErrorMessage: string = "";

    // Confetti particles for celebration
    confettiParticles: { x: number; delay: number; duration: number; color: string }[] = [];

    /** Flag to hide retry button if the reward was already claimed */
    isAlreadyClaimed: boolean = false;

    constructor(
        private _router: Router,
        private _route: ActivatedRoute,
        private _tagsService: TagsService
    ) {}

    ngOnInit(): void {
        // Get parameters from route query params
        this._route.queryParams.subscribe((params) => {
            this.tagName = params["tagName"] || "";
            this.domain = params["domain"] || "";
            this.friendTagName = params["friendTagName"] || "";
            this.friendDomain = params["friendDomain"] || "";
            this.expectedReward = Number(params["reward"]) || 0;
            this.friendFullName = `${this.friendTagName}.${this.friendDomain}`;

            if (!this.tagName || !this.domain || !this.friendTagName || !this.friendDomain) {
                this.state = "error";
                this.errorKey = "claim_reward.error.messages.generic";
                this.fallbackErrorMessage = "Missing required parameters";
                return;
            }

            this._claimReward();
        });
    }

    ngOnDestroy(): void {
        // Cleanup if needed
    }

    private async _claimReward(): Promise<void> {
        this.state = "loading";

        try {
            const result = await this._tagsService.claimReferralReward({
                tagName: this.tagName,
                domain: this.domain,
                friendTagName: this.friendTagName,
                friendDomain: this.friendDomain,
            });

            // Success!
            this.claimedRewardAmount = result?.data?.rewardAmount || this.expectedReward;
            this.signature = result?.data?.signature || "";
            this._triggerConfetti();
            this.state = "success";
        } catch (error: any) {
            console.error("Error claiming reward:", error);

            // Extract error message from backend response
            const backendMessage = error?.error?.message || error?.message;

            // Map specific backend errors to translation keys
            const errorMappings: Record<string, string> = {
                reward_already_claimed: "claim_reward.error.messages.reward_already_claimed",
            };

            this.errorKey = errorMappings[backendMessage] || "";
            this.fallbackErrorMessage = backendMessage || "Failed to claim reward";
            this.isAlreadyClaimed = backendMessage === "reward_already_claimed";

            this.state = "error";
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

    /** Navigate back to invite friends list */
    goBack(): void {
        this._router.navigate(["/rewards/invite"]);
    }

    /** Retry the claim */
    retry(): void {
        this._claimReward();
    }
}
