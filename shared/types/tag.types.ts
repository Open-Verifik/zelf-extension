export interface TagPublicData {
    btcAddress: string;
    domain: string;
    ethAddress: string;
    solanaAddress: string;
    stellarAddress: string;
    suiAddress: string;
    tagName: string;
    hasPassword: string;
    type: "mainnet" | "hold" | "";
    origin: "offline" | "online" | "";
    registeredAt: string;
    expiresAt: string;
    gracePeriod?: string;
    blockDAGAddress: string;
    avalancheAddress: string;
    binanceAddress: string;
    st?: string;
}

export interface PGP {
    encryptedMessage: string;
    privateKey: string;
}

export class TagPublicDataModel {
    avalancheAddress: string;
    binanceAddress: string;
    blockDAGAddress: string;
    btcAddress: string;
    domain: string;
    ethAddress: string;
    solanaAddress: string;
    stellarAddress: string;
    suiAddress: string;
    tagName: string;
    hasPassword: string;
    type: "mainnet" | "hold" | "";
    origin: "offline" | "online" | "";
    registeredAt: string;
    expiresAt?: string;
    gracePeriod?: Date | null;
    st?: string;

    constructor(data: any) {
        this.avalancheAddress = data.avalancheAddress || data.ethAddress || "";
        this.binanceAddress = data.binanceAddress || data.ethAddress || "";
        this.blockDAGAddress = data.blockDAGAddress || data.ethAddress || "";
        this.btcAddress = data.btcAddress || "";
        this.domain = data.domain || "";
        this.ethAddress = data.ethAddress || "";
        this.solanaAddress = data.solanaAddress || "";
        this.stellarAddress = data.stellarAddress || data.xlmAddress || "";
        this.suiAddress = data.suiAddress || "";
        this.tagName = data.tagName || "";
        this.hasPassword = data.hasPassword || "false";
        this.type = data.type || "";
        this.origin = data.origin || "";
        this.registeredAt = data.registeredAt || "";
        this.expiresAt = data.expiresAt || "";
        this.st = data.st || "";

        this.gracePeriod = this._calculateGracePeriod();
    }

    get isExpired(): boolean {
        if (!this.expiresAt) return false;
        return new Date(this.expiresAt) < new Date();
    }

    get isExpiringSoon(): boolean {
        if (!this.expiresAt) return false;
        const oneMonthInMs = 24 * 60 * 60 * 1000 * 30;
        const timeLeft = this._timeRemaining();
        return timeLeft > 0 && timeLeft <= oneMonthInMs;
    }

    get isFullyExpired(): boolean {
        return this.isExpired && !this.isInGracePeriod;
    }

    get isInGracePeriod(): boolean {
        if (this.type !== "mainnet" || !this.gracePeriod) return false;
        const now = new Date();
        return now < this.gracePeriod && now > new Date(this.expiresAt || "");
    }

    private _calculateGracePeriod(): Date | null {
        if (this.type !== "mainnet") return null;

        const gracePeriod = new Date(this.expiresAt || "");
        gracePeriod.setDate(gracePeriod.getDate() + 30);

        return gracePeriod;
    }

    private _timeRemaining(): number {
        if (!this.expiresAt) return 0;
        const expiresAtTime = new Date(this.expiresAt || "").getTime();
        return expiresAtTime - Date.now();
    }

    timeLeftInGracePeriodSeconds(): number {
        if (this.type !== "mainnet" || !this.gracePeriod) return 0;

        const now = new Date().getTime();
        const gracePeriodEnd = this.gracePeriod.getTime();

        return Math.max(0, Math.floor((gracePeriodEnd - now) / 1000));
    }
}

export class TagModel {
    _id: string;
    available: boolean = false;
    hasPassword: boolean;
    image: string;
    metadata: any;
    name: string;
    pgp?: PGP = { encryptedMessage: "", privateKey: "" };
    publicData: TagPublicDataModel;
    zelfProof: string;
    zelfProofQRCode: string;

    constructor(data: any = {}) {
        if (data instanceof TagModel) {
            this._id = data._id;
            this.available = data.available;
            this.hasPassword = data.hasPassword;
            this.image = data.image;
            this.metadata = data.metadata;
            this.name = data.name;
            this.pgp = data.pgp;
            this.publicData = data.publicData;
            this.zelfProof = data.zelfProof;
            this.zelfProofQRCode = data.zelfProofQRCode;

            return;
        }

        this._id = data.id || data._id || "";

        this.available = data.available || false;
        this.hasPassword = Boolean(data.publicData?.hasPassword === "true" || data.hasPassword);
        this.image = data.url || data.zelfProofQRCode || "";
        this.metadata = data.metadata || {};
        this.zelfProof = data.zelfProof || "";
        this.zelfProofQRCode = data.zelfProofQRCode || "";
        this.pgp = (data.pgp as PGP) || { encryptedMessage: "", privateKey: "" };

        // Get the tag name from various possible sources
        const rawTagName = data.name || data.publicData?.tagName || data.publicData?.zelfName || "";
        this.name = rawTagName ? rawTagName.replace(".hold", "") : "";

        // Extract domain from tag name if not explicitly provided
        const extractDomain = (tagName: string): string => {
            if (!tagName) return "";

            // Remove .hold suffix first if present
            const cleanTagName = tagName.replace(".hold", "");

            // Split by dots and get the last part as domain
            const parts = cleanTagName.split(".");

            if (parts.length >= 2) return parts[parts.length - 1]; // Get the last part (domain)

            return "zelf"; // Default domain
        };

        const explicitDomain = data.publicData?.domain;
        const extractedDomain = explicitDomain || extractDomain(rawTagName);

        this.publicData = new TagPublicDataModel({
            avalancheAddress: data.publicData?.avalancheAddress || data.publicData?.ethAddress || "",
            binanceAddress: data.publicData?.binanceAddress || data.publicData?.ethAddress || "",
            blockDAGAddress: data.publicData?.blockDAGAddress || "",
            btcAddress: data.publicData?.btcAddress || "",
            domain: extractedDomain,
            ethAddress: data.publicData?.ethAddress || "",
            expiresAt: data.publicData?.expiresAt || "",
            hasPassword: data.publicData?.hasPassword || "false",
            origin: data.publicData?.origin || "",
            registeredAt: data.publicData?.registeredAt || "",
            solanaAddress: data.publicData?.solanaAddress || "",
            stellarAddress: data.publicData?.stellarAddress || data.publicData?.xlmAddress || "",
            suiAddress: data.publicData?.suiAddress || "",
            tagName: rawTagName,
            type: data.publicData?.type || "",
            st: data.publicData?.st || "",
        });
    }

    get displayBtcAddress(): string {
        return this._parseAddress(this.publicData?.btcAddress);
    }

    get displayEthAddress(): string {
        return this._parseAddress(this.publicData?.ethAddress);
    }

    get displaySolanaAddress(): string {
        return this._parseAddress(this.publicData?.solanaAddress);
    }

    get displaySuiAddress(): string {
        return this._parseAddress(this.publicData?.suiAddress);
    }

    get displayAvalancheAddress(): string {
        return this._parseAddress(this.publicData?.avalancheAddress);
    }

    get displayBinanceAddress(): string {
        return this._parseAddress(this.publicData?.binanceAddress);
    }

    get displayBlockDAGAddress(): string {
        return this._parseAddress(this.publicData?.blockDAGAddress || this.publicData?.ethAddress);
    }

    get displayStellarAddress(): string {
        return this._parseAddress(this.publicData?.stellarAddress);
    }

    private _parseAddress(value: string): string {
        if (!value || value.length <= 16) return value;

        const firstPart = value.slice(0, 8);
        const lastPart = value.slice(-8);

        return `${firstPart}...${lastPart}`;
    }

    updatePublicData(data: Partial<TagPublicData>): void {
        this.publicData = new TagPublicDataModel({ ...this.publicData, ...data });
    }

    get isExpired(): boolean {
        return this.publicData.isExpired;
    }

    get isExpiringSoon(): boolean {
        return this.publicData.isExpiringSoon;
    }

    get isFullyExpired(): boolean {
        return this.publicData.isFullyExpired;
    }

    get isInGracePeriod(): boolean {
        return this.publicData.isInGracePeriod;
    }

    get isHold(): boolean {
        return this.publicData?.type === "hold";
    }

    get isMainnet(): boolean {
        return this.publicData?.type === "mainnet";
    }

    get domain(): string {
        const domain = this.publicData?.domain;

        if (domain) return domain;

        const parts = this.publicData?.tagName.split(".");

        if (parts.length >= 2) return parts[parts.length - 1];

        return "zelf";
    }

    get tagName(): string {
        let tagName = this.publicData?.tagName || this.name;

        if (tagName.includes(this.publicData.domain)) tagName = tagName.split(".")[0];

        return tagName;
    }

    get fullTagName(): string {
        const fullTagName = this.publicData.tagName || this.name;

        if (fullTagName.includes(this.publicData.domain)) return fullTagName.replace(".hold", "");

        return `${fullTagName}.${this.publicData.domain}`;
    }
}
