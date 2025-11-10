import { CommonModule, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectorRef, Component, HostListener, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { TransactionData } from "@shared/types/wallet.types";
import { AssetService } from "app/asset.service";
import { ChromeService } from "app/chrome.service";
import { AvaxService } from "app/services/avax.service";
import { NetworkService } from "app/services/network.service";
import { TagModel } from "app/tags.service";
import { TransactionService } from "app/transaction.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { BillingService, PricingPlan } from "../../services/billing.service";
import { WalletService } from "../../wallet.service";

interface CryptoPaymentDisplayData {
    amount: number;
    avaxPrice?: number;
    currency: string;
    expiresAt: string;
    isDemoMode?: boolean;
    lockedPriceToken?: string;
    paymentAddress: string;
    planId: string;
    selectedPlan?: PricingPlan;
    usdAmount: number;
    zkPay?: any;
    originalAmount?: {
        usd: number;
        avax: number;
    };
}

@Component({
    imports: [CommonModule, FormsModule, TranslocoModule, ZelfLoaderComponent, MatProgressSpinnerModule, MatButtonModule, NgTemplateOutlet],
    selector: "zelf-keys-billing",
    styleUrls: ["./zelf-keys-billing.component.scss"],
    templateUrl: "./zelf-keys-billing.component.html",
})
export class ZelfKeysBillingComponent implements OnInit {
    activationMessage: string = "";
    activeSubscription: any = null;
    cryptoPaymentData: CryptoPaymentDisplayData | null = null;
    currentPlan: string = "free";
    error: string | null = null;
    hasActiveSubscription: boolean = false;
    loading: boolean = true;
    loadingAvaxPayment: boolean = false;
    loadingCurrentPlan: boolean = true;
    loadingPayment: { planId: string; method: "stripe" | "crypto" } | null = null;
    loadingPlans: boolean = true;
    paymentPollingInterval: any = null;
    plans: PricingPlan[] = [];
    redirectState: string = "";
    selectedWallet: Partial<TagModel> | null = null;
    shareables: any = null;
    showActivationMessage: boolean = false;
    showCryptoPayment: boolean = false;
    showWalletMenu: boolean = false;
    wallets: (TagModel | Partial<TagModel>)[] = [];

    constructor(
        private _assetService: AssetService,
        private _avaxService: AvaxService,
        private _billingService: BillingService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _chromeService: ChromeService,
        private _networkService: NetworkService,
        private _router: Router,
        private _transactionService: TransactionService,
        private _translocoService: TranslocoService,
        private _walletService: WalletService
    ) {
        this.shareables = {
            wallet: {},
        };
    }

    async ngOnInit(): Promise<void> {
        await this._setWallet();
        await this._loadWallets();

        this._loadPlans();
        this._loadCurrentPlan();
    }

    private async _setWallet(): Promise<any> {
        const wallet = await this._walletService.getFirstWalletFromStorage();

        if (!wallet?.name) {
            this._router.navigate(["/welcome"]);

            return;
        }

        this.shareables.wallet = wallet;

        this._changeDetectorRef.detectChanges();
    }

    private async _loadWallets(): Promise<void> {
        const { wallet, wallets } = await this._walletService.getAllWalletsFromStorage();

        this.wallets = [wallet as TagModel, ...wallets];
        this.selectedWallet = this.wallets[0] as TagModel;

        this._changeDetectorRef.detectChanges();
    }

    @HostListener("document:click", ["$event"])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        if (this.showWalletMenu && !target.closest(".billing__wallet-dropdown")) {
            this.closeWalletMenu();
        }
    }

    getWalletDisplayName(wallet: Partial<TagModel> | null): string {
        if (!wallet) return "";

        return wallet.fullTagName || (wallet.domain ? `${wallet.tagName || wallet.name}.${wallet.domain}` : wallet.tagName || wallet.name || "");
    }

    toggleWalletMenu(): void {
        this.showWalletMenu = !this.showWalletMenu;
    }

    closeWalletMenu(): void {
        this.showWalletMenu = false;
    }

    selectWallet(wallet: Partial<TagModel>): void {
        this.selectedWallet = wallet as TagModel;

        this.closeWalletMenu();
    }

    private _loadPlans(): void {
        this.error = null;

        this._billingService
            .getAvailablePlans()
            .then((response) => {
                this.loadingPlans = false;
                this.updateLoadingState();

                if (response.success && response.plans) {
                    this.plans = this._billingService.transformApiPlansToPricingPlans(response.plans);

                    return;
                }

                this.error = this._translocoService.translate("zelf_keys.billing_ui.error.load_plans");
            })
            .catch((error) => {
                console.error("Error loading plans:", error);

                this.error = this._translocoService.translate("zelf_keys.billing_ui.error.load_plans");
                this.loadingPlans = false;

                this.updateLoadingState();
            });
    }

    private _loadCurrentPlan(): void {
        this._billingService
            .getActiveSubscription()
            .then((response) => {
                this.loadingCurrentPlan = false;
                this.updateLoadingState();

                if (!response.success || !response.data) {
                    this._billingService.currentPlan = "free";
                    this.currentPlan = "free";
                    this.hasActiveSubscription = false;
                    this.activeSubscription = null;

                    return;
                }

                this.hasActiveSubscription = true;
                this.activeSubscription = response.data;

                const subscription = response.data;

                let planId: string | null = null;

                if (subscription.paymentMethod === "crypto" && subscription.cryptoData) {
                    planId = subscription.cryptoData.plan || "basic";
                } else if (subscription.paymentMethod === "stripe" && subscription.stripeData) {
                    const stripeData = subscription.stripeData;

                    if (stripeData.plan) {
                        const currentPlan = this.plans.find((plan) => plan.priceId === stripeData.plan);

                        planId = currentPlan?.id || "basic";
                    }
                }

                if (planId) {
                    this._billingService.currentPlan = planId;
                    this.currentPlan = planId;

                    this.plans = this.plans.map((plan) => ({
                        ...plan,
                        isCurrent: plan.id === this.currentPlan,
                    }));

                    return;
                }

                this._billingService.currentPlan = "free";
                this.currentPlan = "free";
            })
            .catch(() => {
                this._billingService.currentPlan = "free";
                this.currentPlan = "free";
                this.hasActiveSubscription = false;
                this.activeSubscription = null;
                this.loadingCurrentPlan = false;

                this.updateLoadingState();
            });
    }

    private updateLoadingState(): void {
        this.loading = this.loadingPlans || this.loadingCurrentPlan;
    }

    public retryLoadPlans(): void {
        this.loadingPlans = true;
        this.loadingCurrentPlan = true;
        this.loading = true;
        this.error = null;

        this._loadPlans();
        this._loadCurrentPlan();
    }

    selectPlan(planId: string, paymentMethod: "stripe" | "crypto"): void {
        if (planId === this.currentPlan) return;
        if (this.loadingPayment) return;

        this.loadingPayment = { planId, method: paymentMethod };
        this.error = null;

        if (paymentMethod === "stripe") {
            this._createCheckoutSession(planId);
        } else if (paymentMethod === "crypto") {
            this._createCryptoPayment(planId);
        }
    }

    isPaymentLoading(planId: string, method: "stripe" | "crypto"): boolean {
        return this.loadingPayment?.planId === planId && this.loadingPayment?.method === method;
    }

    isAnyPaymentLoading(): boolean {
        return this.loadingPayment !== null;
    }

    /**
     * Create crypto payment for the selected plan
     * @param planId - The ID of the plan to subscribe to
     */
    private _createCryptoPayment(planId: string): void {
        this._billingService
            .createCryptoPayment(planId)
            .then((response) => {
                this.loadingPayment = null;

                if (response.data && response.data.success && response.data.paymentAddress) {
                    this.cryptoPaymentData = {
                        planId,
                        paymentAddress: response.data.paymentAddress,
                        amount: response.data.amount,
                        currency: response.data.currency,
                        usdAmount: response.data.usdAmount,
                        avaxPrice: response.data.avaxPrice,
                        lockedPriceToken: response.data.lockedPriceToken,
                        expiresAt: response.data.expiresAt,
                        zkPay: response.data.zkPay,
                        selectedPlan: this.plans.find((plan) => plan.id === planId),
                        isDemoMode: response.data.isDemoMode,
                        originalAmount: response.data.originalAmount,
                    };

                    this.showCryptoPayment = true;
                    this.startPaymentMonitoring();
                } else {
                    this.error = this._translocoService.translate("zelf_keys.billing_ui.error.create_crypto_payment");
                }
            })
            .catch((error) => {
                console.error("Error creating crypto payment:", error);
                this.loadingPayment = null;
                this.error = this._translocoService.translate("zelf_keys.billing_ui.error.create_crypto_payment");
            });
    }

    /**
     * Start monitoring for crypto payment confirmation
     */
    private startPaymentMonitoring(): void {
        if (this.paymentPollingInterval) {
            clearInterval(this.paymentPollingInterval);
        }

        // Check payment status every 30 seconds
        this.paymentPollingInterval = setInterval(() => {
            this.checkPaymentStatus();
        }, 30000);

        // Also check immediately
        this.checkPaymentStatus();
    }

    /**
     * Check if crypto payment has been confirmed
     */
    private checkPaymentStatus(): void {
        if (!this.cryptoPaymentData?.lockedPriceToken) return;

        this._billingService
            .confirmCryptoPayment(this.cryptoPaymentData.lockedPriceToken)
            .then((response) => {
                if (response.success && response.paymentConfirmed) {
                    this.stopPaymentMonitoring();

                    // Show success message
                    if (response.subscriptionCreated) {
                        console.log("🎉 Subscription activated!");

                        // Show activation message and loading
                        this.showActivationMessage = true;
                        this.activationMessage = this._translocoService.translate("billing.activation.message");

                        setTimeout(() => {
                            // Hide crypto payment interface
                            this.showCryptoPayment = false;
                            this.cryptoPaymentData = null;
                            this.showActivationMessage = false;

                            // Reload the whole component
                            this.ngOnInit();
                        }, 5000);
                    }
                } else {
                    console.log("⏳ Payment not confirmed yet:", response.message);
                }
            })
            .catch((error) => {
                console.error("Error checking payment status:", error);
            });
    }

    /**
     * Stop payment monitoring
     */
    private stopPaymentMonitoring(): void {
        if (this.paymentPollingInterval) {
            clearInterval(this.paymentPollingInterval);
            this.paymentPollingInterval = null;
        }
    }

    /**
     * Cancel crypto payment and return to plan selection
     */
    cancelCryptoPayment(): void {
        this.stopPaymentMonitoring();
        this.showCryptoPayment = false;
        this.cryptoPaymentData = null;
    }

    /**
     * Go back to plan selection from crypto payment interface
     */
    goBackToPlans(): void {
        this.stopPaymentMonitoring();
        this.showCryptoPayment = false;
        this.cryptoPaymentData = null;
    }

    /**
     * Generate QR code data URL for the payment address
     * @returns string data URL for QR code
     */
    generatePaymentQR(): string {
        if (!this.cryptoPaymentData?.paymentAddress) return "";

        // For now, return a simple QR code URL (you can use a QR library later)
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${this.cryptoPaymentData.paymentAddress}`;
    }

    /**
     * Copy payment address to clipboard
     */
    async copyPaymentAddress(): Promise<void> {
        if (this.cryptoPaymentData?.paymentAddress) {
            await this._chromeService.copyToClipboard(this.cryptoPaymentData.paymentAddress);
        }
    }

    /**
     * Calculate the demo discount percentage
     * @returns Discount percentage as a string
     */
    getDemoDiscount(): string {
        if (!this.cryptoPaymentData?.isDemoMode || !this.cryptoPaymentData?.originalAmount) {
            return "0";
        }

        const originalPrice = this.cryptoPaymentData.originalAmount.usd;
        const demoPrice = this.cryptoPaymentData.usdAmount;
        const discountPercentage = ((originalPrice - demoPrice) / originalPrice) * 100;

        return discountPercentage.toFixed(1);
    }

    /**
     * Get crypto payment data from active subscription
     * @returns Crypto payment data or null
     */
    getCryptoData(): any {
        if (this.activeSubscription?.paymentMethod === "crypto" && this.activeSubscription?.cryptoData) {
            try {
                return typeof this.activeSubscription.cryptoData === "string"
                    ? JSON.parse(this.activeSubscription.cryptoData)
                    : this.activeSubscription.cryptoData;
            } catch (error) {
                console.error("Error parsing crypto data:", error);
                return null;
            }
        }

        return null;
    }

    /**
     * Get subscription status based on payment method
     * @returns Status string
     */
    getSubscriptionStatus(): string {
        if (this.activeSubscription?.paymentMethod === "crypto") {
            const cryptoData = this.getCryptoData();
            return cryptoData?.status || this._translocoService.translate("billing.subscription.active");
        } else {
            // Stripe subscription status
            return this.isCancelledActive()
                ? this._translocoService.translate("billing.subscription.cancelled_active")
                : this.activeSubscription?.stripeData?.status || this._translocoService.translate("billing.subscription.active");
        }
    }

    /**
     * Get transaction URL for blockchain explorer
     * @returns Transaction URL
     */
    getTransactionUrl(): string {
        const cryptoData = this.getCryptoData();
        if (cryptoData?.transactionHash) {
            return `https://snowtrace.io/tx/${cryptoData.transactionHash}`;
        }
        return "#";
    }

    /**
     * Get appropriate end date label based on payment method
     * @returns Label string
     */
    getEndDateLabel(): string {
        if (this.activeSubscription?.paymentMethod === "crypto") {
            return this._translocoService.translate("billing.subscription.expires_on");
        } else {
            return this.isCancelledActive()
                ? this._translocoService.translate("billing.subscription.access_ends")
                : this._translocoService.translate("billing.subscription.next_billing");
        }
    }

    /**
     * Get management note text based on subscription status
     * @returns Management note string
     */
    getManagementNote(): string {
        return this.isCancelledActive()
            ? this._translocoService.translate("billing.subscription.manage_note_cancelled")
            : this._translocoService.translate("billing.subscription.manage_note_active");
    }

    /**
     * Get crypto subscription info text
     * @returns Crypto info string
     */
    getCryptoSubscriptionInfo(): string {
        return this._translocoService.translate("billing.subscription.crypto_subscription_info");
    }

    /**
     * Get transaction verified text
     * @returns Transaction verified string
     */
    getTransactionVerifiedText(): string {
        return this._translocoService.translate("billing.subscription.transaction_verified");
    }

    /**
     * Get crypto subscription active title
     * @returns Crypto subscription title
     */
    getCryptoSubscriptionTitle(): string {
        return this._translocoService.translate("billing.subscription.crypto_subscription_title");
    }

    private _createCheckoutSession(planId: string): void {
        this._billingService
            .createCheckoutSession(planId)
            .then((response) => {
                this.loadingPayment = null;

                if (response.success && response.checkoutUrl) {
                    window.open(response.checkoutUrl, "_blank");
                } else {
                    this.error = this._translocoService.translate("zelf_keys.billing_ui.error.create_checkout");
                }
            })
            .catch((error) => {
                console.error("Error creating checkout session:", error);
                this.loadingPayment = null;
                this.error = this._translocoService.translate("zelf_keys.billing_ui.error.create_checkout");
            });
    }

    getPlanButtonText(plan: PricingPlan): string {
        if (plan.isCurrent) {
            return this._translocoService.translate("zelf_keys.billing_ui.plan.current_plan");
        }
        return plan.buttonText;
    }

    getPlanButtonClass(plan: PricingPlan): string {
        if (plan.isCurrent) {
            return "current-plan";
        }
        return plan.buttonClass;
    }

    isPlanDisabled(plan: PricingPlan): boolean {
        return plan.isCurrent || false;
    }

    /**
     * Check if the subscription is cancelled but still active
     * @returns boolean indicating if subscription is cancelled but active
     */
    isCancelledActive(): boolean {
        if (!this.activeSubscription) return false;

        // Check both the main status and stripeData for cancelled status
        const mainStatus = this.activeSubscription.stripeData?.status === "cancelled_active";
        const stripeStatus = this.activeSubscription.stripeData?.status === "cancelled_active";
        const cancelAtPeriodEnd = this.activeSubscription.stripeData?.cancelAtPeriodEnd === true;

        return mainStatus || stripeStatus || cancelAtPeriodEnd;
    }

    /**
     * Get the current plan details by matching with available plans
     * @returns PricingPlan object with name, price, etc.
     */
    getCurrentPlanDetails(): PricingPlan | null {
        if (!this.activeSubscription || !this.plans.length) return null;

        // Try to match by price ID first (most reliable)
        const priceId = this.activeSubscription.stripeData?.plan;

        if (priceId) {
            const matchedPlan = this.plans.find((plan) => plan.priceId === priceId);

            if (matchedPlan) return matchedPlan;
        }

        // Fallback: try to match by plan name from metadata
        const planName = this.activeSubscription.stripeData?.metadata?.plan;

        if (planName) {
            const matchedPlan = this.plans.find((plan) => plan.id === planName);

            if (matchedPlan) return matchedPlan;
        }

        // Last fallback: return the current plan if marked as current
        const currentPlan = this.plans.find((plan) => plan.isCurrent);
        return currentPlan || null;
    }

    /**
     * Get the display name for the current subscription plan
     * @returns string plan name
     */
    getCurrentPlanName(): string {
        const planDetails = this.getCurrentPlanDetails();
        if (planDetails) return planDetails.name;

        // Fallback to backend data
        return (
            this.activeSubscription?.stripeData?.planName ||
            this.activeSubscription?.name ||
            this._translocoService.translate("zelf_keys.billing_ui.plan.premium_plan")
        );
    }

    /**
     * Get the price for the current subscription plan
     * @returns string formatted price
     */
    getCurrentPlanPrice(): string {
        const planDetails = this.getCurrentPlanDetails();

        if (planDetails) return `$${planDetails.price}/${planDetails.interval}`;

        // Fallback to backend data (convert from cents if needed)
        const backendPrice = this.activeSubscription?.stripeData?.planPrice || this.activeSubscription?.stripeData?.amount;

        if (backendPrice) {
            const priceInDollars = backendPrice > 100 ? backendPrice / 100 : backendPrice;
            return `$${priceInDollars.toFixed(2)}/${this._translocoService.translate("zelf_keys.billing_ui.plan.month")}`;
        }

        return this._translocoService.translate("zelf_keys.billing_ui.plan.not_available");
    }

    /**
     * Prepare transaction data and navigate to send-confirm
     */
    async payWithAvax(): Promise<void> {
        if (this.loadingAvaxPayment) return;

        this.loadingAvaxPayment = true;

        if (!this.selectedWallet || !this.cryptoPaymentData?.paymentAddress || !this.cryptoPaymentData?.amount) {
            this.error = this._translocoService.translate("zelf_keys.billing_ui.error.missing_payment_data");
            this.loadingAvaxPayment = false;

            return;
        }

        try {
            const avaxAddress = this.selectedWallet.publicData?.ethAddress;

            if (!avaxAddress) {
                this.error = this._translocoService.translate("zelf_keys.billing_ui.error.no_avax_address");
                this.loadingAvaxPayment = false;

                return;
            }

            let avaxToken = await this._networkService.getNetworkToken("avalanche");

            // Fallback if not cached
            if (!avaxToken) {
                try {
                    const response = await this._avaxService.getWalletDetails(avaxAddress);
                    const result = await this._assetService.processTokensFromResponse({ avalanche: response });

                    avaxToken = result.tokens.find((token: any) => token.name.toLowerCase() === "avalanche");
                } catch (error) {
                    avaxToken = null;
                }
            }

            if (!avaxToken) {
                this.error = this._translocoService.translate("zelf_keys.billing_ui.error.no_avax_token");
                this.loadingAvaxPayment = false;

                return;
            }

            // Prepare transaction data
            const transactionData = new TransactionData({
                amount: String(this.cryptoPaymentData.amount),
                token: {
                    ...avaxToken,
                    network: "avalanche",
                    symbol: "AVAX",
                    tokenType: "AVAX",
                },
                sender: {
                    address: avaxAddress,
                    domain: this.selectedWallet.domain || "",
                    fullTagName: this.selectedWallet.fullTagName || "",
                    tagName: this.selectedWallet.tagName || this.selectedWallet.name || "",
                },
                receiver: {
                    address: this.cryptoPaymentData.paymentAddress,
                },
            });

            if (this.selectedWallet && (this.selectedWallet.tagName || this.selectedWallet.name)) {
                await this._walletService.switchWallet(new TagModel(this.selectedWallet));
            }

            // Store transaction data
            await this._transactionService.setCurrentTransactionData(transactionData);

            // Open send-confirm route in a new tab
            if (typeof browser !== "undefined" && browser.runtime && browser.tabs) {
                const extensionUrl = browser.runtime.getURL("index.html");
                const routePath = "/send/confirmation";

                await browser.tabs.create({ url: `${extensionUrl}#${routePath}`, active: true });
            } else {
                // Fallback for non-extension environments
                this._router.navigate(["/send/confirmation"]);
            }
        } catch (error) {
            console.error("Error preparing transaction:", error);

            this.error = this._translocoService.translate("zelf_keys.billing_ui.error.prepare_transaction");
            this.loadingAvaxPayment = false;
        }
    }

    openCustomerPortal(): void {
        this._billingService
            .createCustomerPortalSession()
            .then((response) => {
                if (response.success && response.portalUrl) {
                    window.open(response.portalUrl, "_blank");
                } else {
                    console.error("Portal creation failed:", response);

                    this.error = this._translocoService.translate("zelf_keys.billing_ui.error.open_portal");
                }
            })
            .catch((error) => {
                console.error("Error opening customer portal:", error);

                // Provide more specific error messages
                if (error.message?.includes("Customer ID not found")) {
                    this.error = this._translocoService.translate("zelf_keys.billing_ui.error.customer_not_found");
                } else if (error.message?.includes("No active subscription")) {
                    this.error = this._translocoService.translate("zelf_keys.billing_ui.error.no_subscription");
                } else {
                    this.error = this._translocoService.translate("zelf_keys.billing_ui.error.open_portal_generic", {
                        error: error.message || this._translocoService.translate("errors.unknown"),
                    });
                }
            });
    }
}
