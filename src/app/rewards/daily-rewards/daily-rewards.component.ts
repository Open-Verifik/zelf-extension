import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { RewardsService, WheelSegment, RouletteWheelResponse, DailyRewardResponse } from "../../services/rewards.service";
import { WalletService } from "../../wallet.service";
import { TagsService } from "../../tags.service";

@Component({
    imports: [CommonModule, MatButtonModule, RouterModule, TranslocoModule],
    selector: "daily-rewards",
    styleUrls: ["./daily-rewards.component.scss", "../../main.scss"],
    templateUrl: "./daily-rewards.component.html",
})
export class DailyRewardsComponent implements OnInit, OnDestroy {
    isLoading: boolean = true;
    isSpinning: boolean = false;
    hasSpunToday: boolean = false;
    currentRotation: number = 0;
    wonAmount: number | null = null;
    errorMessage: string | null = null;
    nextClaimAvailable: string | null = null;

    // Countdown timer
    countdownHours: number = 0;
    countdownMinutes: number = 0;
    countdownSeconds: number = 0;
    private countdownInterval: any = null;

    // Wheel configuration from backend
    segments: WheelSegment[] = [];
    tagType: "hold" | "mainnet" = "hold";

    // Current tag info
    private tagName: string = "";
    private domain: string = "zelf";

    constructor(
        private _rewardsService: RewardsService,
        private _walletService: WalletService,
        private _tagsService: TagsService
    ) {}

    async ngOnInit(): Promise<void> {
        await this.loadWheelConfiguration();
    }

    ngOnDestroy(): void {
        this.stopCountdown();
        this.stopContinuousSpin();
    }

    /**
     * Start countdown timer to next claim
     */
    private startCountdown(): void {
        if (!this.nextClaimAvailable) return;

        this.updateCountdown();
        this.countdownInterval = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    /**
     * Update countdown values
     */
    private updateCountdown(): void {
        if (!this.nextClaimAvailable) return;

        const now = new Date().getTime();
        const target = new Date(this.nextClaimAvailable).getTime();
        const diff = target - now;

        if (diff <= 0) {
            // Countdown finished - user can spin again!
            this.stopCountdown();
            this.hasSpunToday = false;
            this.countdownHours = 0;
            this.countdownMinutes = 0;
            this.countdownSeconds = 0;
            return;
        }

        this.countdownHours = Math.floor(diff / (1000 * 60 * 60));
        this.countdownMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        this.countdownSeconds = Math.floor((diff % (1000 * 60)) / 1000);
    }

    /**
     * Stop countdown timer
     */
    private stopCountdown(): void {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }

    /**
     * Load the wheel configuration from the backend
     * This determines the segments based on the user's tag type (hold vs mainnet)
     */
    private async loadWheelConfiguration(): Promise<void> {
        this.isLoading = true;
        this.errorMessage = null;

        try {
            // Get current wallet to determine tag info
            const currentWallet = await this._walletService.getCurrentWallet();

            if (!currentWallet) {
                this.errorMessage = "No wallet found. Please connect a wallet first.";
                this.isLoading = false;
                return;
            }

            this.tagName = currentWallet.tagName || currentWallet.name || "";
            this.domain = currentWallet.publicData?.domain || (await this._tagsService.getDomain()) || "zelf";

            // Pre-populate wheel segments immediately based on wallet type
            // This provides instant visual feedback while backend loads
            const walletType = currentWallet.publicData?.type || "hold";
            this.tagType = walletType === "mainnet" ? "mainnet" : "hold";
            this.segments = this._getSegmentsForType(this.tagType);

            // Fetch wheel configuration from backend (may update segments if different)
            const wheelConfig: RouletteWheelResponse = await this._rewardsService.getRouletteWheel(this.tagName, this.domain);

            if (!wheelConfig.success) {
                this.errorMessage = "Failed to load wheel configuration.";
                this.isLoading = false;
                return;
            }

            // Update with backend data (in case it differs)
            this.tagType = wheelConfig.type;
            this.segments = this._rewardsService.convertToWheelSegments(wheelConfig.segments, wheelConfig.type);
            this.nextClaimAvailable = wheelConfig.nextClaimAvailable;

            // Check if already claimed today
            if (wheelConfig.alreadyClaimedToday) {
                this.hasSpunToday = true;

                if (wheelConfig.todayReward) {
                    this.wonAmount = wheelConfig.todayReward.amount;
                }

                // Start countdown to next claim
                this.startCountdown();
            }

            this.isLoading = false;
        } catch (error: any) {
            console.error("Error loading wheel configuration:", error);
            this.errorMessage = error.message || "Failed to load wheel configuration.";
            this.isLoading = false;
        }
    }

    /**
     * Get segments for a specific type (for pre-population)
     */
    private _getSegmentsForType(type: "hold" | "mainnet"): WheelSegment[] {
        if (type === "mainnet") {
            // Purchased domains: 2, 4, 6, ... 24
            return Array.from({ length: 12 }, (_, i) => ({
                value: (i + 1) * 2,
                label: ((i + 1) * 2).toString(),
                color: i === 0 ? "#FF8622" : "#FF5721",
            }));
        }
        // .hold domains: 1-12
        return Array.from({ length: 12 }, (_, i) => ({
            value: i + 1,
            label: (i + 1).toString(),
            color: i === 0 ? "#FF8622" : "#FF5721",
        }));
    }


    // Pending reward data from backend
    private pendingWinningIndex: number | null = null;
    private pendingWinningAmount: number | null = null;
    private pendingNextClaimAvailable: string | null = null;
    private backendResponseReceived: boolean = false;
    private spinStartTime: number = 0;

    /**
     * Spin the wheel - starts spinning immediately and calls backend in background
     */
    async spinWheel(): Promise<void> {
        if (this.isSpinning || this.hasSpunToday) return;

        this.isSpinning = true;
        this.wonAmount = null;
        this.errorMessage = null;
        this.backendResponseReceived = false;
        this.pendingWinningIndex = null;
        this.pendingWinningAmount = null;
        this.pendingNextClaimAvailable = null;
        this.spinStartTime = Date.now();

        // Start spinning immediately with continuous rotation
        this.startContinuousSpin();

        // Call backend in the background
        this.fetchRewardFromBackend();
    }

    /**
     * Start continuous spinning animation while waiting for backend
     */
    private startContinuousSpin(): void {
        this.animationPhase = "spinning";

        // Add initial rotations to start the wheel spinning fast
        // This creates the visual effect of spinning while we wait for backend
        const initialRotations = 3;
        this.currentRotation += initialRotations * 360;

        // Keep adding rotations while waiting
        this.continuousSpinInterval = setInterval(() => {
            if (this.animationPhase === "spinning") {
                this.currentRotation += 360; // Add one full rotation per second
            }
        }, 1000);

        // Check periodically if backend has responded
        this.checkAndFinalizeSpintrue();
    }

    private continuousSpinInterval: any = null;

    /**
     * Fetch the reward from the backend
     */
    private async fetchRewardFromBackend(): Promise<void> {
        try {
            const response: DailyRewardResponse = await this._rewardsService.claimDailyReward(this.tagName, this.domain);

            if (!response.success) {
                // Handle already claimed today
                this.backendResponseReceived = true;
                this.pendingWinningIndex = -1; // Signal error
                this.errorMessage = response.message || "Could not claim reward.";
                return;
            }

            // Store the winning data
            this.pendingWinningIndex = response.reward.winningIndex;
            this.pendingWinningAmount = response.reward.amount;
            this.pendingNextClaimAvailable = response.reward.nextClaimAvailable;
            this.backendResponseReceived = true;
        } catch (error: any) {
            console.error("Error claiming reward:", error);
            this.backendResponseReceived = true;
            this.pendingWinningIndex = -1; // Signal error

            if (error?.error?.includes("already claimed") || error?.message?.includes("already claimed")) {
                this.hasSpunToday = true;
                this.errorMessage = "You have already claimed your daily reward today. Come back tomorrow!";
            } else {
                this.errorMessage = error?.error || error?.message || "Failed to spin the wheel. Please try again.";
            }
        }
    }

    /**
     * Check if backend responded and finalize the spin
     */
    private checkAndFinalizeSpintrue(): void {
        const checkInterval = setInterval(() => {
            const elapsedTime = Date.now() - this.spinStartTime;
            const minimumSpinTime = 2000; // Minimum 2 seconds of spinning before we can land

            if (this.backendResponseReceived && elapsedTime >= minimumSpinTime) {
                clearInterval(checkInterval);
                this.stopContinuousSpin();

                if (this.pendingWinningIndex !== null && this.pendingWinningIndex >= 0) {
                    // Backend returned a valid winning index - land on it
                    this.landOnSegment(this.pendingWinningIndex, this.pendingWinningAmount!);
                } else {
                    // Error occurred - stop spinning
                    this.animationPhase = "idle";
                    this.isSpinning = false;
                    if (this.pendingWinningIndex === -1) {
                        this.hasSpunToday = true;
                    }
                }
            } else if (elapsedTime >= 10000) {
                // Timeout - backend took too long
                clearInterval(checkInterval);
                this.stopContinuousSpin();
                this.animationPhase = "idle";
                this.isSpinning = false;
                this.errorMessage = "Request timed out. Please try again.";
            }
        }, 100);
    }

    /**
     * Stop the continuous spin interval
     */
    private stopContinuousSpin(): void {
        if (this.continuousSpinInterval) {
            clearInterval(this.continuousSpinInterval);
            this.continuousSpinInterval = null;
        }
    }

    /**
     * Land the wheel on the winning segment
     */
    private landOnSegment(winningIndex: number, winningAmount: number): void {
        // Switch to landing animation (smooth deceleration)
        this.animationPhase = "landing";

        const segmentAngle = 360 / this.segments.length;

        // Calculate the final rotation to land on the winning segment
        // Add more full rotations for dramatic effect, then land precisely
        const additionalRotations = 2 + Math.floor(Math.random() * 2);
        const extraRotation = 360 - winningIndex * segmentAngle - segmentAngle / 2;

        // Normalize current rotation to find where we are
        const currentAngle = this.currentRotation % 360;

        // Calculate how much more we need to rotate to land on the target
        let targetAngle = extraRotation;
        if (targetAngle < currentAngle) {
            targetAngle += 360;
        }
        const angleToTarget = targetAngle - currentAngle;

        // Use setTimeout to allow the animation phase change to take effect
        setTimeout(() => {
            this.currentRotation += additionalRotations * 360 + angleToTarget;
        }, 50);

        // After final spin animation completes (3 seconds for the landing)
        setTimeout(() => {
            this.animationPhase = "idle";
            this.isSpinning = false;
            this.hasSpunToday = true;
            this.wonAmount = winningAmount;

            // Set next claim time and start countdown
            if (this.pendingNextClaimAvailable) {
                this.nextClaimAvailable = this.pendingNextClaimAvailable;
                this.startCountdown();
            }
        }, 3100);
    }

    // Track animation phase: 'idle' | 'spinning' | 'landing'
    private animationPhase: "idle" | "spinning" | "landing" = "idle";

    get wheelStyle(): Record<string, string> {
        if (this.animationPhase === "spinning") {
            // Fast continuous spin while waiting for backend
            return {
                transform: `rotate(${this.currentRotation}deg)`,
                transition: "transform 1s linear",
            };
        } else if (this.animationPhase === "landing") {
            // Smooth deceleration when landing on final segment
            return {
                transform: `rotate(${this.currentRotation}deg)`,
                transition: "transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)",
            };
        }
        return {
            transform: `rotate(${this.currentRotation}deg)`,
            transition: "none",
        };
    }

    /**
     * Get fill (gradient URL) for a segment based on its value.
     * Higher values use more appealing gradients (golden/warm).
     */
    getSegmentFill(index: number): string {
        const tier = this.getSegmentTier(index);
        return `url(#segment-grad-${tier})`;
    }

    /**
     * Map segment value to a tier 0–3 (0 = lowest, 3 = highest / most appealing).
     */
    private getSegmentTier(index: number): number {
        const seg = this.segments[index];
        if (!seg) return 0;
        const v = seg.value;
        if (this.tagType === "hold") {
            // 1–12: tier 0 = 1–3, 1 = 4–6, 2 = 7–9, 3 = 10–12
            if (v <= 3) return 0;
            if (v <= 6) return 1;
            if (v <= 9) return 2;
            return 3;
        }
        // Mainnet 2–24: tier 0 = 2–8, 1 = 10–14, 2 = 16–20, 3 = 22–24
        if (v <= 8) return 0;
        if (v <= 14) return 1;
        if (v <= 20) return 2;
        return 3;
    }

    getSegmentPath(index: number): string {
        const centerX = 200;
        const centerY = 200;
        const radius = 190;
        const segmentAngle = 360 / this.segments.length;
        const startAngle = index * segmentAngle - 90;
        const endAngle = startAngle + segmentAngle;

        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        const x1 = centerX + radius * Math.cos(startRad);
        const y1 = centerY + radius * Math.sin(startRad);
        const x2 = centerX + radius * Math.cos(endRad);
        const y2 = centerY + radius * Math.sin(endRad);

        const largeArc = segmentAngle > 180 ? 1 : 0;

        return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    }

    getTextTransform(index: number): string {
        const segmentAngle = 360 / this.segments.length;
        const angle = index * segmentAngle + segmentAngle / 2 - 90;
        const radius = 130;
        const rad = (angle * Math.PI) / 180;
        const x = 200 + radius * Math.cos(rad);
        const y = 200 + radius * Math.sin(rad);
        return `translate(${x}, ${y}) rotate(${angle + 90})`;
    }

    getZnsTransform(index: number): string {
        const segmentAngle = 360 / this.segments.length;
        const angle = index * segmentAngle + segmentAngle / 2 - 90;
        const radius = 155;
        const rad = (angle * Math.PI) / 180;
        const x = 200 + radius * Math.cos(rad);
        const y = 200 + radius * Math.sin(rad);
        return `translate(${x}, ${y}) rotate(${angle + 90})`;
    }

    /**
     * Get the spin button text based on current state
     */
    get spinButtonText(): string {
        if (this.isLoading) return "Loading...";
        if (this.isSpinning) return "Spinning...";
        if (this.hasSpunToday) return "Come back tomorrow!";
        return "Spin the wheel!";
    }

    /**
     * Check if the spin button should be disabled
     */
    get isSpinDisabled(): boolean {
        return this.isLoading || this.isSpinning || this.hasSpunToday || this.segments.length === 0;
    }
}
