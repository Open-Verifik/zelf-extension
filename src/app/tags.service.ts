import { Injectable } from "@angular/core";

import { environment } from "../environments/environment";
import { HttpWrapperService } from "./http-wrapper.service";
import { ChromeService } from "./chrome.service";
import { VaultService } from "./vault.service";
import { WalletService } from "./wallet.service";

export type TagFlow = "create" | "import" | "unlock" | "recover" | "";
export type TagType = "create" | "import";
export type OperatingSystem = "DESKTOP" | "ANDROID" | "IOS";
export type StorageSystem = "IPFS" | "Arweave" | "Walrus";

export interface TagSearchRequest {
    tagName?: string;
    domain?: string;
    key?: string;
    value?: string;
    os?: OperatingSystem;
    captchaToken?: string;
}

export interface TagLeaseRequest {
    tagName: string;
    domain?: string;
    faceBase64: string;
    type: TagType;
    os: OperatingSystem;
    captchaToken?: string;
    password?: string;
    mnemonic?: string;
    wordsCount?: number;
    addServerPassword?: boolean;
}

export interface TagLeaseRecoveryRequest {
    zelfProof: string;
    newTagName: string;
    domain?: string;
    faceBase64: string;
    password: string;
    os: OperatingSystem;
    captchaToken?: string;
}

export interface TagPreviewRequest {
    tagName: string;
    domain?: string;
    os: OperatingSystem;
    captchaToken?: string;
}

export interface TagDecryptRequest {
    faceBase64: string;
    tagName: string;
    domain?: string;
    password?: string;
    addServerPassword?: boolean;
    os: OperatingSystem;
    captchaToken?: string;
}

export interface TagOfflineLeaseRequest {
    tagName: string;
    domain?: string;
    zelfProof: string;
    zelfProofQRCode: string;
}

export interface ZelfProofPreviewRequest {
    zelfProof: string;
    os: OperatingSystem;
    captchaToken?: string;
}

export interface TagDeleteRequest {
    domain: string;
    tagName: string;
    faceBase64: string;
    password?: string;
}

export interface TagTransferRequest {
    tagName: string;
    domain?: string;
    newOwnerEmail: string;
    faceBase64: string;
    os: OperatingSystem;
    captchaToken?: string;
}

export interface TagRenewRequest {
    tagName: string;
    domain?: string;
    duration: "1" | "2" | "3" | "4" | "5" | "lifetime";
    os: OperatingSystem;
    captchaToken?: string;
}

export interface DomainConfiguration {
    name: string;
    owner: string;
    status: "active" | "inactive" | "maintenance";
    type: "official" | "community" | "partner";
    description: string;
    limits: {
        tags: number;
        zelfkeys: number;
        maxTagsPerUser: number;
        maxRenewalPerDay: number;
        maxTransferPerDay: number;
    };
    features: Array<{
        name: string;
        code: string;
        description: string;
        enabled: boolean;
    }>;
    validation: {
        minLength: number;
        maxLength: number;
        allowedChars: any;
        reserved: string[];
        customRules: string[];
    };
    storage: {
        keyPrefix: string;
        ipfsEnabled: boolean;
        arweaveEnabled: boolean;
        walrusEnabled: boolean;
        backupEnabled: boolean;
    };
    payment: {
        methods: string[];
        currencies: string[];
        discounts: {
            yearly: number;
            lifetime: number;
        };
        pricingTable: any;
        rewardPrice: number;
        whitelist: any;
    };
    metadata: {
        version: string;
        documentation: string;
        launchDate: string;
    };
}

export interface TagPublicData {
    btcAddress: string;
    domain: string;
    ethAddress: string;
    solanaAddress: string;
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
}

export interface TagStorageData {
    id: string;
    url: string;
    ipfs_pin_hash: string;
    ipfsHash: string;
    cid: string;
    size: number;
    date_pinned: string;
    publicData: TagPublicData;
    saved: boolean;
    name: string;
    created_at: string;
    ipfsId?: string;
    zelfProofQRCode?: string;
    zelfProof?: string;
}

export interface PGP {
    encryptedMessage: string;
    privateKey: string;
}
export interface TagSearchResponse {
    ipfs: TagStorageData[];
    arweave: TagStorageData[];
    available: boolean;
    tagName: string;
    tagObject?: TagStorageData;
}

export class TagPublicDataModel {
    btcAddress: string;
    domain: string;
    ethAddress: string;
    solanaAddress: string;
    suiAddress: string;
    tagName: string;
    hasPassword: string;
    type: "mainnet" | "hold" | "";
    origin: "offline" | "online" | "";
    registeredAt: string;
    expiresAt?: string;
    gracePeriod?: Date | null;
    blockDAGAddress: string;
    avalancheAddress: string;

    constructor(data: any) {
        this.btcAddress = data.btcAddress || "";
        this.domain = data.domain || "";
        this.ethAddress = data.ethAddress || "";
        this.solanaAddress = data.solanaAddress || "";
        this.suiAddress = data.suiAddress || "";
        this.tagName = data.tagName || "";
        this.hasPassword = data.hasPassword || "false";
        this.type = data.type || "";
        this.origin = data.origin || "";
        this.registeredAt = data.registeredAt || "";
        this.expiresAt = data.expiresAt || "";
        this.blockDAGAddress = data.blockDAGAddress || "";
        this.avalancheAddress = data.avalancheAddress || "";

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
    publicData: TagPublicDataModel;
    zelfProof: string;
    zelfProofQRCode: string;
    pgp?: PGP = { encryptedMessage: "", privateKey: "" };

    constructor(data: any = {}) {
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
            if (parts.length >= 2) {
                return parts[parts.length - 1]; // Get the last part (domain)
            }

            return "zelf"; // Default domain
        };

        const explicitDomain = data.publicData?.domain;
        const extractedDomain = explicitDomain || extractDomain(rawTagName);

        this.publicData = new TagPublicDataModel({
            btcAddress: data.publicData?.btcAddress || "",
            domain: extractedDomain,
            ethAddress: data.publicData?.ethAddress || "",
            solanaAddress: data.publicData?.solanaAddress || "",
            suiAddress: data.publicData?.suiAddress || "",
            tagName: rawTagName,
            hasPassword: data.publicData?.hasPassword || "false",
            type: data.publicData?.type || "",
            origin: data.publicData?.origin || "",
            registeredAt: data.publicData?.registeredAt || "",
            expiresAt: data.publicData?.expiresAt || "",
            blockDAGAddress: data.publicData?.blockDAGAddress || "",
            avalancheAddress: data.publicData?.avalancheAddress || "",
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

    get displayBlockDAGAddress(): string {
        return this._parseAddress(this.publicData?.blockDAGAddress);
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
        if (parts.length >= 2) {
            return parts[parts.length - 1];
        }

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

@Injectable({
    providedIn: "root",
})
export class TagsService {
    baseUrl: String = environment.apiUrl;
    variables: any;

    constructor(
        private _httpWrapper: HttpWrapperService,
        private _chromeService: ChromeService,
        private _vaultService: VaultService,
        private _walletService: WalletService
    ) {
        this.variables = {
            duration: 1,
            price: 0,
            tagFile: null,
            tagName: null,
            zelfProof: null,
            tagResponse: null,
        };
    }

    async cleanVariables(): Promise<void> {
        const keys = ["ZelfProof", "tagFile", "tagName", "tagPrice", "tagReward", "duration", "accessToken", "tagResponse"];

        await Promise.all(
            keys.map(async (key) => {
                return this._chromeService.removeItem(key);
            })
        );
    }

    // Domain Configuration Endpoints
    getTagDomains(): Promise<{ data: Record<string, DomainConfiguration> }> {
        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/tags/domains`);
    }

    getTagDomain(domain: string): Promise<{ data: DomainConfiguration }> {
        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/tags/domains/${domain}`);
    }

    // Search Endpoints
    searchTag(request: TagSearchRequest): Promise<{ data: TagSearchResponse }> {
        const query: any = {};

        if (request.tagName) query.tagName = request.tagName;
        if (request.domain) query.domain = request.domain;
        if (request.key) query.key = request.key;
        if (request.value) query.value = request.value;
        if (request.os) query.os = request.os;
        if (request.captchaToken) query.captchaToken = request.captchaToken;

        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/tags/search`, query);
    }

    searchTagPost(request: TagSearchRequest): Promise<{ data: TagSearchResponse }> {
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/tags/search`, request);
    }

    searchTagsByDomain(domain: string, storage: StorageSystem): Promise<any> {
        const query = { domain, storage };
        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/tags/search-by-domain`, query);
    }

    previewTag(request: TagPreviewRequest): Promise<any> {
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/tags/preview`, request);
    }

    // Lease Endpoints
    leaseTag(request: TagLeaseRequest): Promise<any> {
        const promise = this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/tags/lease`, request);
        promise.then(() => this._vaultService.setLastVerified());
        return promise;
    }

    leaseRecovery(request: TagLeaseRecoveryRequest): Promise<any> {
        const promise = this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/tags/lease-recovery`, request);
        promise.then(() => this._vaultService.setLastVerified());
        return promise;
    }

    leaseOfflineTag(request: TagOfflineLeaseRequest): Promise<any> {
        const promise = this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/tags/lease-offline`, request);
        promise.then(() => this._vaultService.setLastVerified());
        return promise;
    }

    // Management Endpoints
    deleteTag(request: TagDeleteRequest): Promise<any> {
        return this._httpWrapper.sendRequest("delete", `${this.baseUrl}/api/tags/delete`, request);
    }

    decryptTag(request: TagDecryptRequest): Promise<any> {
        const promise = this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/tags/decrypt`, request);
        promise.then(() => this._vaultService.setLastVerified());
        return promise;
    }

    previewZelfProof(request: ZelfProofPreviewRequest): Promise<any> {
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/tags/preview-zelfproof`, request);
    }

    // User-specific Tag Management (My Tags)
    transferTag(request: TagTransferRequest): Promise<any> {
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/my-tags/transfer`, request);
    }

    getPaymentOptions(tagName: string, domain?: string): Promise<any> {
        const query: any = { tagName };
        if (domain) query.domain = domain;
        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/my-tags/payment-options`, query);
    }

    confirmPayment(request: any): Promise<any> {
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/my-tags/payment-confirmation`, request);
    }

    // Rewards and Webhooks
    revenueCatWebhook(event: any): Promise<any> {
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/tags/revenue-cat`, { event });
    }

    purchaseRewards(): Promise<any> {
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/tags/purchase-rewards`);
    }

    referralRewards(): Promise<any> {
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/tags/referral-rewards`);
    }

    // Utility Methods
    generateArNS(tagName: string): string {
        return `https://${tagName.replace(".", "_")}.arweave.zelf.world`;
    }

    createTagModelFromSearchResponse(response: TagSearchResponse): TagModel | null {
        if (!response.tagObject) return null;

        // tagObject contains the selected/best record (Arweave priority)
        return new TagModel(response.tagObject);
    }

    // Variable Management Methods
    async setTagName(tagName: string, priceObject: any = {}): Promise<void> {
        const sanitizedTagName = tagName.split(".")[0];

        this.variables.tagName = sanitizedTagName;

        const setPromise = sanitizedTagName ? this._chromeService.setItem("tagName", sanitizedTagName) : this._chromeService.removeItem("tagName");

        setPromise.then(() => {
            if (!priceObject) return;

            this.variables.price = priceObject.price;

            this.variables.reward = priceObject.reward;

            this._chromeService.setItem("tagPrice", priceObject.price);

            this._chromeService.setItem("tagReward", priceObject.reward);
        });
    }

    setTagFile(tagNameObject: any): void {
        this.variables.tagFile = tagNameObject;
    }

    getTagFile(): string {
        return this.variables.tagFile;
    }

    async setTagNameObject(tagNameObject: any): Promise<void> {
        this.variables.tagNameObject = tagNameObject;
        await this._chromeService.setItem("tagNameObject", tagNameObject);
    }

    async setTagResponse(tagResponse: TagSearchResponse): Promise<void> {
        this.variables.tagResponse = tagResponse;
        await this._chromeService.setItem("tagResponse", tagResponse);
    }

    async setNewTagName(newTagName: string): Promise<void> {
        this.variables.newTagName = newTagName;
        await this._chromeService.setItem("newTagName", newTagName);
    }

    async setMnemonicCount(value: 12 | 24 | 0): Promise<void> {
        this.variables.mnemonicCount = value;
        await this._chromeService.setItem("mnemonicCount", value);
    }

    async setFlow(flow: TagFlow): Promise<void> {
        this.variables.flow = flow;
        await this._chromeService.setItem("flow", flow);
    }

    async setZelfProof(zelfProof: string): Promise<void> {
        this.variables.zelfProof = zelfProof;
        await this._chromeService.setItem("zelfProof", zelfProof);
    }

    async setDuration(duration: any): Promise<void> {
        this.variables.duration = duration;
        await this._chromeService.setItem("duration", duration);
    }

    async setReferral(referralTagName: string): Promise<void> {
        this.variables.referralTagName = referralTagName;
        await this._chromeService.setItem("referralTagName", referralTagName);
    }

    async setDomain(domain: string): Promise<void> {
        this.variables.domain = domain;

        await this._chromeService.setItem("domain", domain);
    }

    // Getter Methods
    async getMnemonicCount(): Promise<12 | 24 | 0> {
        return this.variables.mnemonicCount || (await this._chromeService.getItem("mnemonicCount"));
    }

    async getTagNameObject(): Promise<any> {
        return this.variables.tagNameObject || (await this._chromeService.getItem("tagNameObject")) || null;
    }

    async getTagResponse(): Promise<TagSearchResponse | null> {
        return this.variables.tagResponse || (await this._chromeService.getItem("tagResponse")) || null;
    }

    async getNewTagName(): Promise<any> {
        return this.variables.newTagName || (await this._chromeService.getItem("newTagName")) || "";
    }

    async getFlow(): Promise<TagFlow> {
        return this.variables.flow || (await this._chromeService.getItem("flow")) || "";
    }

    async getReferral(): Promise<any> {
        return this.variables.referralTagName || (await this._chromeService.getItem("referralTagName"));
    }

    async getTagName(): Promise<string> {
        return this.variables.tagName || (await this._chromeService.getItem("tagName"));
    }

    async getTagPrice(): Promise<any> {
        return this.variables.price || (await this._chromeService.getItem("tagPrice"));
    }

    async getTagReward(): Promise<any> {
        return this.variables.reward || (await this._chromeService.getItem("tagReward"));
    }

    async getDuration(): Promise<any> {
        return this.variables.duration || (await this._chromeService.getItem("duration"));
    }

    async getZelfProof(): Promise<string> {
        return this.variables.zelfProof || (await this._chromeService.getItem("zelfProof"));
    }

    async getDomain(): Promise<string> {
        return this.variables.domain || (await this._chromeService.getItem("domain"));
    }

    // Wallet Data Refresh Methods
    private _shouldRefreshWallets = async (): Promise<boolean> => {
        const walletTtl = await this._chromeService.getItemSession("walletTtl");

        if (!walletTtl || walletTtl < Date.now()) {
            this._chromeService.setItemSession("walletTtl", Date.now() + 1000 * 60 * 30);
            return true;
        }

        return false;
    };

    async refreshAllTagsPublicData(tags: TagModel[], forceRefresh = false): Promise<boolean> {
        const shouldRefreshTags = forceRefresh || (await this._shouldRefreshWallets());

        if (!shouldRefreshTags) return false;

        for (const tag of tags) {
            await this.refreshTagPublicData(tag);
        }

        return true;
    }

    async refreshTagPublicData(tag: TagModel): Promise<TagModel | null> {
        if (!tag || !tag.publicData?.tagName) return null;

        const response = await this.searchTag({ tagName: tag.publicData.tagName });

        if (!response.data.ipfs?.length && !response.data.arweave?.length) {
            tag.updatePublicData({
                ...tag.publicData,
                expiresAt: new Date(new Date().setHours(0, 0, 0, 0)).toString(),
                gracePeriod: new Date(new Date().setHours(0, 0, 0, 0)).toString(),
            });

            return tag;
        }

        const publicData = response.data.ipfs?.length ? response.data.ipfs[0]?.publicData : response.data.arweave?.[0]?.publicData;

        if (!publicData || !tag) return null;

        tag.updatePublicData(publicData);

        return tag;
    }

    // Helper Methods for Domain Parsing
    parseTagName(tagName: string): { name: string; domain: string } {
        const parts = tagName.split(".");
        if (parts.length < 2) {
            return { name: tagName, domain: "zelf" }; // Default to zelf domain
        }
        const domain = parts.pop() || "zelf";
        const name = parts.join(".");
        return { name, domain };
    }

    formatTagName(name: string, domain: string): string {
        return `${name}.${domain}`;
    }

    // Validation Methods
    isValidTagName(tagName: string, domainConfig?: DomainConfiguration): boolean {
        if (!tagName || !tagName.includes(".")) return false;

        const { name, domain } = this.parseTagName(tagName);

        if (!domainConfig) return true; // If no config provided, basic validation

        const { validation } = domainConfig;

        if (name.length < validation.minLength || name.length > validation.maxLength) {
            return false;
        }

        if (validation.reserved.includes(name.toLowerCase())) {
            return false;
        }

        return true;
    }

    // Pricing Methods
    getTagPricing(tagName: string, domainConfig: DomainConfiguration, duration: string): number {
        const { name } = this.parseTagName(tagName);
        const nameLength = name.length;

        const pricingTable = domainConfig.payment.pricingTable;

        // Find the appropriate pricing tier based on name length
        let tier = "6-15"; // Default tier
        if (nameLength <= 5) {
            tier = nameLength.toString();
        } else if (nameLength <= 15) {
            tier = "6-15";
        } else if (nameLength <= 27) {
            tier = nameLength.toString();
        }

        const tierPricing = pricingTable[tier];
        if (!tierPricing) return 0;

        return tierPricing[duration] || 0;
    }
}
