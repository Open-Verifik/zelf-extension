export interface NetworkConfig {
    id: string;
    name: string;
    symbol: string;
    enabled: boolean;
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
