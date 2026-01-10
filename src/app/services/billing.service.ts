import { Injectable } from "@angular/core";
import { HttpWrapperService } from "./../http-wrapper.service";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth.service";
import { Observable, Subject } from "rxjs";

export interface PricingPlan {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: string;
    description: string;
    features?: string[];
    buttonText: string;
    buttonClass: string;
    isPopular?: boolean;
    isCurrent?: boolean;
    priceId?: string; // Stripe price ID
}

export interface ApiPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: string;
    priceId?: string; // Stripe price ID
}

export interface ApiResponse {
    success: boolean;
    plans: ApiPlan[];
}

export interface CheckoutResponse {
    success: boolean;
    checkoutUrl: string;
    sessionId: string;
}

export interface CryptoPaymentData {
    success: boolean;
    paymentAddress: string;
    amount: number;
    currency: string;
    usdAmount: number;
    avaxPrice?: number;
    lockedPriceToken?: string;
    expiresAt: string;
    isDemoMode?: boolean;
    originalAmount?: {
        usd: number;
        avax: number;
    };
    zkPay?: {
        url: string;
        ipfs_pin_hash: string;
        name: string;
        publicData?: any;
    };
}

export interface CryptoPaymentResponse {
    data: CryptoPaymentData;
}

export interface SubscriptionData {
    id: string;
    url: string;
    ipfs_pin_hash: string;
    name: string;
    type: string;
    endDate: string;
    zelfName: string;
    startDate: string;
    status?: string;
    stripeData?: {
        id: string;
        latestInvoice: string;
        customer: string;
        status: string;
        plan: string;
        cancelledAt: string;
        cancelAtPeriodEnd: boolean;
    } | null;
    cryptoData?: {
        customer: string;
        status: string;
        plan: string;
        price: number;
        paymentMethod: string;
        transactionHash: string;
        isDemoMode: boolean;
    } | null;
    revenueCatData?: {
        id: string;
        transactionId: string;
        price: string;
        type: string;
        purchasedAt: string;
        expirationAt: string;
        status?: string;
        cancelledAt?: string;
        cancellationEventId?: string;
        plan?: string;
    } | null;
    paymentMethod: string;
}

export interface SubscriptionResponse {
    success: boolean;
    data: SubscriptionData | null;
    message: string;
}

@Injectable({
    providedIn: "root",
})
export class BillingService {
    private baseUrl: string = environment.apiUrl;
    private _currentPlan: string = "free";
    private _currentPlan$: Subject<string> = new Subject<string>();

    constructor(
        private _httpWrapper: HttpWrapperService,
        private _authService: AuthService
    ) {}

    get currentPlan$(): Observable<string> {
        return this._currentPlan$.asObservable();
    }

    get currentPlan(): string {
        return this._currentPlan;
    }

    set currentPlan(plan: string) {
        this._currentPlan = plan;
        this._currentPlan$.next(plan);
    }

    /**
     * Get available subscription plans
     * @returns Promise with the list of available plans
     */
    async getAvailablePlans(): Promise<ApiResponse> {
        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/subscription/plans`);
    }

    /**
     * Get active subscription for the current user
     * @returns Promise with the active subscription data
     */
    async getActiveSubscription(): Promise<SubscriptionResponse> {
        const apiKeysSessionJWT = await this._authService.checkAccessToken();

        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/subscription/active`, null, {
            headers: {
                Authorization: `Bearer ${apiKeysSessionJWT}`,
            },
        });
    }

    /**
     * Initialize current plan based on active subscription
     * This method should be called when the app starts to set the correct current plan
     */
    async initializeCurrentPlan(): Promise<void> {
        try {
            console.log("🔄 Initializing current plan...");
            const response = await this.getActiveSubscription();

            if (response.success && response.data) {
                const subscription = response.data;
                console.log("📋 Subscription data:", {
                    paymentMethod: subscription.paymentMethod,
                    cryptoData: subscription.cryptoData,
                    stripeData: subscription.stripeData,
                    revenueCatData: subscription.revenueCatData,
                });

                // Check for crypto payment first
                if (subscription.paymentMethod === "crypto" && subscription.cryptoData) {
                    this.currentPlan = subscription.cryptoData.plan || "basic";
                    console.log("💰 Crypto payment detected, plan:", this.currentPlan);
                }
                // Check for Stripe payment
                else if (subscription.paymentMethod === "stripe" && subscription.stripeData) {
                    const stripeData = subscription.stripeData;
                    if (stripeData.plan) {
                        // For now, we'll set it to a default premium plan
                        // In a real implementation, you'd want to map the Stripe price ID to the actual plan ID
                        this.currentPlan = "pro"; // or "basic" or "enterprise" based on the price ID
                        console.log("💳 Stripe payment detected, plan:", this.currentPlan);
                    } else {
                        this.currentPlan = "free";
                        console.log("💳 Stripe payment but no plan found, setting to free");
                    }
                }
                // Check for RevenueCat payment
                else if (subscription.paymentMethod === "revenuecat" && subscription.revenueCatData) {
                    // RevenueCat subscriptions - get plan from entitlement_ids
                    const plan = subscription.revenueCatData.plan || "pro"; // Default to "pro" if not found
                    this.currentPlan = plan;
                    console.log("📱 RevenueCat payment detected, plan:", this.currentPlan);
                }
                // Fallback for other payment methods or missing data
                else {
                    this.currentPlan = "free";
                    console.log("❌ No valid payment method found, setting to free");
                }
            } else {
                this.currentPlan = "free";
                console.log("❌ No active subscription found, setting to free");
            }

            console.log("✅ Current plan initialized:", this.currentPlan);
        } catch (error) {
            console.error("❌ Error initializing current plan:", error);
            this.currentPlan = "free";
        }
    }

    /**
     * Create a Stripe checkout session
     * @param planId - The ID of the plan to subscribe to
     * @returns Promise with the checkout session data
     */
    async createCheckoutSession(planId: string): Promise<CheckoutResponse> {
        const apiKeysSessionJWT = await this._authService.checkAccessToken();

        return this._httpWrapper.sendRequest(
            "post",
            `${this.baseUrl}/api/subscription/checkout`,
            {
                planId: planId,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKeysSessionJWT}`,
                },
            }
        );
    }

    /**
     * Cancel the current subscription
     * @returns Promise with the cancellation result
     */
    async cancelSubscription(): Promise<{ success: boolean; message: string }> {
        const apiKeysSessionJWT = await this._authService.checkAccessToken();
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/subscription/cancel`, null, {
            headers: {
                Authorization: `Bearer ${apiKeysSessionJWT}`,
            },
        });
    }

    /**
     * Create Stripe customer portal session for subscription management
     * @returns Promise with the portal session data
     */
    async createCustomerPortalSession(): Promise<{ success: boolean; portalUrl: string; sessionId: string }> {
        const apiKeysSessionJWT = await this._authService.checkAccessToken();
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/subscription/portal`, null, {
            headers: {
                Authorization: `Bearer ${apiKeysSessionJWT}`,
            },
        });
    }

    /**
     * Create crypto payment for subscription
     * @param planId - The ID of the plan to subscribe to
     * @returns Promise with the crypto payment data
     */
    async createCryptoPayment(planId: string): Promise<CryptoPaymentResponse> {
        const apiKeysSessionJWT = await this._authService.checkAccessToken();
        return this._httpWrapper.sendRequest(
            "post",
            `${this.baseUrl}/api/subscription/crypto-payment`,
            {
                planId: planId,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKeysSessionJWT}`,
                },
            }
        );
    }

    /**
     * Check crypto payment status
     * @param paymentId - The payment ID (IPFS hash)
     * @returns Promise with payment status
     */
    async checkCryptoPaymentStatus(paymentId: string): Promise<{ success: boolean; paymentConfirmed: boolean; transactionHash?: string }> {
        const apiKeysSessionJWT = await this._authService.checkAccessToken();
        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/subscription/crypto-payment-status/${paymentId}`, null, {
            headers: {
                Authorization: `Bearer ${apiKeysSessionJWT}`,
            },
        });
    }

    /**
     * Confirm crypto payment by checking blockchain transactions
     * @param lockedPriceToken - The JWT token containing payment details
     * @returns Promise with payment confirmation result
     */
    async confirmCryptoPayment(lockedPriceToken: string): Promise<{
        success: boolean;
        paymentConfirmed: boolean;
        transactionHash?: string;
        subscriptionCreated?: boolean;
        message?: string;
    }> {
        const apiKeysSessionJWT = await this._authService.checkAccessToken();

        return this._httpWrapper.sendRequest(
            "post",
            `${this.baseUrl}/api/subscription/confirm-crypto-payment`,
            {
                lockedPriceToken: lockedPriceToken,
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKeysSessionJWT}`,
                },
            }
        );
    }

    /**
     * Transform API plans to pricing plans with additional UI properties
     * @param apiPlans - Plans from the API
     * @returns Transformed pricing plans
     */
    transformApiPlansToPricingPlans(apiPlans: ApiPlan[]): PricingPlan[] {
        return apiPlans.map((plan) => ({
            id: plan.id,
            name: plan.name,
            price: plan.price,
            currency: plan.currency.toUpperCase(),
            interval: plan.interval,
            description: plan.description,
            features: this.getPlanFeatures(plan.id),
            buttonText: this.getPlanButtonText(plan.id),
            buttonClass: this.getPlanButtonClass(plan.id),
            isPopular: plan.id === "pro",
            isCurrent: false, // Will be updated based on current subscription
            priceId: plan.priceId, // Pass through Stripe price ID
        }));
    }

    /**
     * Get features for a specific plan
     * @param planId - The plan ID
     * @returns Array of feature strings
     */
    private getPlanFeatures(planId: string): string[] {
        const featuresMap: { [key: string]: string[] } = {
            basic: ["Up to 20 new encryptions every month", "Community support"],
            pro: ["Up to 50 new encryptions every month", "Priority support"],
            enterprise: ["Up to 100 new encryptions every month", "24/7 premium support"],
        };
        return featuresMap[planId] || [];
    }

    /**
     * Get button text for a specific plan
     * @param planId - The plan ID
     * @returns Button text string
     */
    private getPlanButtonText(planId: string): string {
        const buttonTextMap: { [key: string]: string } = {
            basic: "Get Basic",
            pro: "Get Pro",
            enterprise: "Get Enterprise",
        };
        return buttonTextMap[planId] || "Get Plan";
    }

    /**
     * Get button CSS class for a specific plan
     * @param planId - The plan ID
     * @returns CSS class string
     */
    private getPlanButtonClass(planId: string): string {
        const buttonClassMap: { [key: string]: string } = {
            basic: "upgrade-button",
            pro: "upgrade-button pro",
            enterprise: "upgrade-button enterprise",
        };
        return buttonClassMap[planId] || "upgrade-button";
    }
}
