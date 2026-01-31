import { Injectable } from "@angular/core";

import { environment } from "../../environments/environment";
import { HttpWrapperService } from "../http-wrapper.service";

export interface WheelSegment {
    value: number;
    label: string;
    color: string;
}

export interface RouletteWheelResponse {
    success: boolean;
    tagName: string;
    type: "hold" | "mainnet";
    segments: number[];
    segmentCount: number;
    canSpin: boolean;
    alreadyClaimedToday: boolean;
    nextClaimAvailable: string;
    todayReward: {
        amount: number;
        currency: string;
        claimedAt: string;
        source: string;
    } | null;
}

export interface DailyRewardResponse {
    success: boolean;
    message: string;
    reward: {
        rewardPrimaryKey: string;
        amount: number;
        winningIndex: number;
        segments: number[];
        currency: string;
        type: string;
        zelfNameType: "hold" | "mainnet";
        claimedAt: string;
        nextClaimAvailable: string;
        ipfsCid: string | null;
        mongoId: string;
        tokenTransfer: any;
        storage: {
            mongodb: string;
            ipfs: string;
        };
    };
    tokenTransferStatus: "success" | "failed";
    tokenTransferMessage: string;
}

export interface RewardHistoryResponse {
    rewards: any[];
    totalEarned: number;
    rewardsCount: number;
}

export interface RewardStatsResponse {
    dailyStreak: number;
    weeklyTotal: number;
    monthlyTotal: number;
    canClaimToday: boolean;
    nextClaimAvailable: string;
}

@Injectable({
    providedIn: "root",
})
export class RewardsService {
    private baseUrl: string = environment.apiUrl;

    constructor(private _httpWrapper: HttpWrapperService) {}

    /**
     * Get the roulette wheel configuration based on the user's tag type
     * Returns the wheel segments and whether the user can spin today
     */
    async getRouletteWheel(tagName: string, domain: string): Promise<RouletteWheelResponse> {
        const query = { tagName, domain };
        const response = await this._httpWrapper.sendRequest<RouletteWheelResponse>("get", `${this.baseUrl}/api/rewards/roulette-wheel`, query);
        return response;
    }

    /**
     * Claim daily reward by spinning the wheel
     * The backend determines the winning value and returns the winning index
     */
    async claimDailyReward(tagName: string, domain: string): Promise<DailyRewardResponse> {
        const body = { tagName, domain };
        const response = await this._httpWrapper.sendRequest<DailyRewardResponse>("post", `${this.baseUrl}/api/rewards/daily`, body);
        return response;
    }

    /**
     * Get reward history for a tag
     */
    async getRewardHistory(tagName: string, domain: string, limit: number = 10): Promise<RewardHistoryResponse> {
        const query = { domain, limit };
        const response = await this._httpWrapper.sendRequest<RewardHistoryResponse>(
            "get",
            `${this.baseUrl}/api/rewards/history/${encodeURIComponent(tagName)}`,
            query
        );
        return response;
    }

    /**
     * Get reward statistics for a tag
     */
    async getRewardStats(tagName: string, domain: string): Promise<RewardStatsResponse> {
        const query = { domain };
        const response = await this._httpWrapper.sendRequest<RewardStatsResponse>(
            "get",
            `${this.baseUrl}/api/rewards/stats/${encodeURIComponent(tagName)}`,
            query
        );
        return response;
    }

    /**
     * Convert backend segments array to WheelSegment objects for the UI
     */
    convertToWheelSegments(segments: number[], type: "hold" | "mainnet"): WheelSegment[] {
        return segments.map((value, index) => ({
            value,
            label: value.toString(),
            color: index === 0 ? "#FF8622" : "#FF5721",
        }));
    }

    /**
     * Claim first transaction reward
     * User gets a random 1-100 ZNS reward for their first ZNS transaction
     */
    async claimFirstTransaction(params: { tagName: string; domain: string }): Promise<any> {
        const body = { tagName: params.tagName, domain: params.domain };
        const response = await this._httpWrapper.sendRequest<any>("post", `${this.baseUrl}/api/rewards/first-transaction`, body);
        return response;
    }
}
