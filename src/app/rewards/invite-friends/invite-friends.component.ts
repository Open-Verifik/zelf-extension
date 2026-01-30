import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule, Router } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { WalletService } from "../../wallet.service";
import { TagModel, TagsService } from "../../tags.service";

/** Status of a referred friend: created a ZelfName with your code, or purchased their tag (reward redeemable). */
export type InviteFriendStatus = "tag_name_created" | "tag_name_purchased";

export interface InvitedFriend {
    id: string;
    name: string;
    status: InviteFriendStatus;
    rewardZNS: number;
    claimed: boolean;
    claimStatus: string;
    rewardAmount: number;
    tagObject: TagModel;
    rewardType?: string;
}

const MAX_INVITES = 10;
const COPY_FEEDBACK_MS = 2000;

@Component({
    imports: [CommonModule, MatButtonModule, RouterModule, TranslocoModule],
    selector: "app-invite-friends",
    styleUrls: ["./invite-friends.component.scss", "../../main.scss"],
    templateUrl: "./invite-friends.component.html",
})
export class InviteFriendsComponent implements OnInit, OnDestroy {
    /** Referral code = user's tag name (e.g. miguel.ui, john.zelf, nic.bdag). */
    referralCode: string = "";
    /** Tag name and domain for API (e.g. tagName=miguel, domain=zelf). */
    referralTagName: string = "";
    referralDomain: string = "";
    referralCodeLoading: boolean = true;
    referralsLoading: boolean = false;

    /** Show check icon after copy; reset after COPY_FEEDBACK_MS. */
    copied: boolean = false;
    private _copyFeedbackTimeout: ReturnType<typeof setTimeout> | null = null;

    invitedCount: number = 0;
    maxInvites: number = MAX_INVITES;
    totalEarned: number = 0;

    /** List of friends invited via this user's tag name. Backend can replace this later. */
    friends: InvitedFriend[] = [];

    constructor(
        private _walletService: WalletService,
        private _tagsService: TagsService,
        private _router: Router
    ) {}

    async ngOnInit(): Promise<void> {
        await this._loadReferralCode();
        this._loadInvites();
    }

    ngOnDestroy(): void {
        if (this._copyFeedbackTimeout != null) {
            clearTimeout(this._copyFeedbackTimeout);
        }
    }

    private async _loadReferralCode(): Promise<void> {
        this.referralCodeLoading = true;
        this.referralCode = "";
        this.referralTagName = "";
        this.referralDomain = "";
        try {
            const wallet = await this._walletService.getCurrentWallet();

            if (wallet?.fullTagName) {
                this.referralCode = wallet.fullTagName;
                const lastDot = wallet.fullTagName.lastIndexOf(".");
                this.referralTagName = lastDot >= 0 ? wallet.fullTagName.slice(0, lastDot) : wallet.fullTagName;
                this.referralDomain = lastDot >= 0 ? wallet.fullTagName.slice(lastDot + 1) : "";
            } else if (wallet?.publicData?.tagName && wallet?.publicData?.domain) {
                this.referralCode = `${wallet.publicData.tagName}.${wallet.publicData.domain}`;
                this.referralTagName = wallet.publicData.tagName;
                this.referralDomain = wallet.publicData.domain;
            }
        } catch (error) {
            console.error("Error loading referral code:", error);
        } finally {
            this.referralCodeLoading = false;
        }
    }

    private async _loadInvites(): Promise<void> {
        if (!this.referralTagName || !this.referralDomain) return;

        this.referralsLoading = true;
        try {
            const response = await this._tagsService.getMyReferrals(this.referralTagName, this.referralDomain);
            const data = response.data || {};
            this.friends = [];

            for (let index = 0; index < data.referrals.length; index++) {
                const friend = data.referrals[index];

                this.friends.push({
                    id: friend.id,
                    name: friend.name,
                    status: friend.status,
                    rewardZNS: friend.rewardZNS,
                    claimed: friend.claimed,
                    claimStatus: friend.claimStatus,
                    rewardAmount: friend.rewardAmount,
                    tagObject: new TagModel(friend),
                    rewardType: friend.rewardType,
                });
            }

            const uniqueFriends = new Set(this.friends.map((f) => f.tagObject.fullTagName.replace(/\.hold$/, "")));
            this.invitedCount = uniqueFriends.size;

            this.totalEarned = data.totalEarnedInZNS || 0;
        } catch (error) {
            console.error("Error loading invites:", error);
            this.friends = [];
        } finally {
            this.referralsLoading = false;
        }
    }

    get isCompleted(): boolean {
        return this.invitedCount >= this.maxInvites;
    }

    getStatusLabel(status: InviteFriendStatus): string {
        return status === "tag_name_purchased" ? "Tag name purchased" : "Tag name created";
    }

    isRewardRedeemable(friend: InvitedFriend): boolean {
        return !friend.claimed;
    }

    /** Navigate to claim-reward component to handle the claim flow */
    claimReward(friend: InvitedFriend): void {
        if (friend.claimed) return;

        // Navigate to claim-reward component with all necessary params.
        // Use rewardZNS when rewardAmount is 0 (backend only sets rewardAmount after claim).
        const amountToShow = friend.rewardAmount > 0 ? friend.rewardAmount : friend.rewardZNS;

        this._router.navigate(["/rewards/claim"], {
            queryParams: {
                tagName: this.referralTagName,
                domain: this.referralDomain,
                friendTagName: friend.tagObject.tagName,
                friendDomain: friend.tagObject.domain,
                rewardType: friend.rewardType,
                rewardAmount: amountToShow,
            },
        });
    }

    copyReferralCode(): void {
        if (!this.referralCode) return;
        if (this._copyFeedbackTimeout != null) {
            clearTimeout(this._copyFeedbackTimeout);
        }
        navigator.clipboard.writeText(this.referralCode).then(
            () => {
                this.copied = true;
                this._copyFeedbackTimeout = setTimeout(() => {
                    this.copied = false;
                    this._copyFeedbackTimeout = null;
                }, COPY_FEEDBACK_MS);
            },
            () => {}
        );
    }
}
