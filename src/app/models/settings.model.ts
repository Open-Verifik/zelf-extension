export interface NetworkConfig {
    id: string;
    name: string;
    symbol: string;
    enabled: boolean;
    /**
     * False when the network is visible for product/QA tracking but cannot be
     * enabled safely with the currently deployed backend capabilities.
     */
    available?: boolean;
    availabilityReasonKey?: string;
}

export interface NotificationSettings {
    news: boolean;
    push: boolean;
    sendReceive: boolean;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
    news: true,
    push: true,
    sendReceive: true,
};

export interface Settings {
    security: {
        biometricVerificationInterval: number;
        passwordAttempts: number;
    };
    networks?: NetworkConfig[];
    notifications?: NotificationSettings;
}
