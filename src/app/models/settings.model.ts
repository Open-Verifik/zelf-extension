export interface NetworkConfig {
    id: string;
    name: string;
    symbol: string;
    enabled: boolean;
}

export interface Settings {
    security: {
        biometricVerificationInterval: number;
        passwordAttempts: number;
    };
    networks?: NetworkConfig[];
}
