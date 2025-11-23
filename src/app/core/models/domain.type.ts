export interface DomainPricingTable {
    [length: string]: {
        [years: string]: number;
        lifetime: number;
    };
}

export interface DomainPaymentDiscounts {
    lifetime: number;
    yearly: number;
}

export interface DomainPayment {
    currencies: string[];
    discounts?: DomainPaymentDiscounts;
    methods: string[];
    pricingTable: DomainPricingTable;
    rewardPrice: number;
    whitelist: Record<string, unknown>;
}

export interface DomainStorage {
    arweaveEnabled: boolean;
    backupEnabled: boolean;
    ipfsEnabled: boolean;
    keyPrefix: string;
    walrusEnabled: boolean;
}

export interface DomainTags {
    allowedChars: Record<string, unknown>;
    customRules: unknown[];
    maxLength: number;
    minLength: number;
    payment: DomainPayment;
    reserved: string[];
    storage: DomainStorage;
}

export interface ZelfkeysPayment {
    pricingTable: Record<string, unknown>;
    whitelist: Record<string, unknown>;
}

export interface Zelfkeys {
    payment: ZelfkeysPayment;
    plans: unknown[];
    storage: DomainStorage;
}

export interface DomainMetadata {
    documentation: string;
    launchDate: string;
    support: string;
    version: string;
}

export interface DomainLimits {
    tags: number;
    zelfkeys: number;
    zelfProofs: number;
}

export interface DomainStripe {
    amountPaid: number;
    customerId?: string;
    latestInvoiceId: string;
    paidAt: string;
    priceId?: string;
    productId: string;
    status?: string;
    subscriptionId?: string;
}

export interface ThemeColors {
    background: string;
    backgroundSecondary: string;
    border: string;
    borderHover: string;
    button: string;
    buttonHover: string;
    buttonSecondary: string;
    buttonSecondaryText: string;
    buttonText: string;
    card: string;
    cardBorder: string;
    error: string;
    errorText: string;
    header: string;
    headerText: string;
    primary: string;
    secondary: string;
    shadow: string;
    success: string;
    successText: string;
    text: string;
    textMuted: string;
    textSecondary: string;
    warning: string;
    warningText: string;
}

export interface ThemeMode {
    colors: ThemeColors;
}

export interface ThemeSettings {
    currentMode: "light" | "dark";
    darkMode: ThemeMode;
    enabled: boolean;
    lightMode: ThemeMode;
}

export interface DomainThemeSettings {
    zns: ThemeSettings;
}

export interface DomainLicense {
    description: string;
    domain?: string;
    endDate: string;
    expiresAt?: string;
    features: unknown[];
    holdSuffix: string;
    licenseType?: string;
    limits?: DomainLimits;
    metadata?: DomainMetadata;
    name: string;
    owner: string;
    previousDomain?: string;
    startDate: string;
    status: string;
    storage: DomainStorage;
    stripe?: DomainStripe;
    subscriptionId?: string;
    tags: DomainTags;
    themeSettings?: DomainThemeSettings;
    type: string;
    updatedAt?: string;
    zelfkeys: Zelfkeys;
    zelfProof?: string;
}
