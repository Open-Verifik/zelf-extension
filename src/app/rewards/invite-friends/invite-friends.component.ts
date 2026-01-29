import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";

import { WalletService } from "../../wallet.service";
import { TagsService } from "../../tags.service";

/** Status of a referred friend: created a ZelfName with your code, or purchased their tag (reward redeemable). */
export type InviteFriendStatus = "tag_name_created" | "tag_name_purchased";

export interface InvitedFriend {
    id: string;
    name: string;
    status: InviteFriendStatus;
    rewardZns: number;
}

const MAX_INVITES = 10;
const REWARD_ZNS_PER_FRIEND = 5;
const COPY_FEEDBACK_MS = 2000;

@Component({
    imports: [CommonModule, MatButtonModule, RouterModule],
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

    /** Show check icon after copy; reset after COPY_FEEDBACK_MS. */
    copied: boolean = false;
    private _copyFeedbackTimeout: ReturnType<typeof setTimeout> | null = null;

    invitedCount: number = 0;
    maxInvites: number = MAX_INVITES;
    rewardZnsPerFriend: number = REWARD_ZNS_PER_FRIEND;

    /** List of friends invited via this user's tag name. Backend can replace this later. */
    friends: InvitedFriend[] = [];

    constructor(
        private _walletService: WalletService,
        private _tagsService: TagsService
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

        try {
            const response = await this._tagsService.getMyReferrals(this.referralTagName, this.referralDomain);
            this.friends = response.data || [];
            this.invitedCount = this.friends.length;
        } catch (error) {
            console.error("Error loading invites:", error);
            this.friends = [];
        }
    }

    get isCompleted(): boolean {
        return this.invitedCount >= this.maxInvites;
    }

    getStatusLabel(status: InviteFriendStatus): string {
        return status === "tag_name_purchased" ? "Tag name purchased" : "Tag name created";
    }

    isRewardRedeemable(status: InviteFriendStatus): boolean {
        return status === "tag_name_purchased";
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
