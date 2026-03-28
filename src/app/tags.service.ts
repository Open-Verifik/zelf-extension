import { Injectable } from "@angular/core";

import { TagModel, TagPublicData, TagPublicDataModel, PGP } from "@shared/types/tag.types";
import { environment } from "../environments/environment";
import { ChromeService } from "./chrome.service";
import { HttpWrapperService } from "./http-wrapper.service";
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

// TagPublicData, TagPublicDataModel, TagModel, and PGP are now imported from @shared/types/tag.types
// Re-export for backward compatibility
export { TagModel, TagPublicDataModel };
export type { PGP, TagPublicData };

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

export interface TagSearchResponse {
    ipfs: TagStorageData[];
    arweave: TagStorageData[];
    available: boolean;
    tagName: string;
    domain?: string;
    tagObject?: TagStorageData | TagModel;
}

@Injectable({
    providedIn: "root",
})
export class TagsService {
    baseUrl: String = environment.apiUrl;
    variables: any;

    /** Lowercase TLDs with status active from GET /api/tags/domains; undefined = not loaded yet */
    private _activeDomainKeys?: Set<string>;
    private _activeDomainsPromise: Promise<Set<string>> | null = null;

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

    /**
     * Resolves `domain` for tag search: if the TLD is not active per /api/tags/domains, uses `zelf` to avoid repeated 409s.
     * On domains fetch failure, returns the requested domain unchanged.
     */
    private async resolveDomainForTagSearch(domain: string | undefined): Promise<string | undefined> {
        if (!domain) return domain;
        const keys = await this.loadActiveDomainKeys();
        if (keys.size === 0) return domain;
        const d = domain.toLowerCase();
        if (keys.has(d)) return d;
        return "zelf";
    }

    private loadActiveDomainKeys(): Promise<Set<string>> {
        if (this._activeDomainsPromise) return this._activeDomainsPromise;
        if (this._activeDomainKeys !== undefined) return Promise.resolve(this._activeDomainKeys!);

        this._activeDomainsPromise = (async () => {
            try {
                const res = await this.getTagDomains();
                const data = res?.data ?? {};
                const keys = new Set<string>();
                for (const name of Object.keys(data)) {
                    const cfg = data[name] as DomainConfiguration;
                    if (cfg?.status === "active") keys.add(name.toLowerCase());
                }
                this._activeDomainKeys = keys;
                return keys;
            } catch {
                this._activeDomainKeys = new Set();
                return this._activeDomainKeys;
            } finally {
                this._activeDomainsPromise = null;
            }
        })();

        return this._activeDomainsPromise;
    }

    /** Search Endpoints */
    async searchTag(request: TagSearchRequest): Promise<{ data: TagSearchResponse }> {
        const query: any = {};
        let domain = request.domain;

        if (request.tagName && domain) {
            domain = await this.resolveDomainForTagSearch(domain);
        }

        if (request.tagName) query.tagName = request.tagName;
        if (domain) query.domain = domain;
        if (request.key) query.key = request.key;
        if (request.value) query.value = request.value;
        if (request.os) query.os = request.os;
        if (request.captchaToken) query.captchaToken = request.captchaToken;

        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/tags/search`, query);
    }

    async searchTagPost(request: TagSearchRequest): Promise<{ data: TagSearchResponse }> {
        let domain = request.domain;

        if (request.tagName && domain) {
            domain = await this.resolveDomainForTagSearch(domain);
        }

        const body = {
            ...request,
            ...(domain !== undefined ? { domain } : {}),
        };

        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/tags/search`, body);
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

    getMyReferrals(tagName: string, domain: string): Promise<any> {
        return this._httpWrapper.sendRequest("get", `${this.baseUrl}/api/my-tags/referrals`, { tagName, domain });
    }

    claimReferralReward(data: { tagName: string; domain: string; friendTagName: string; friendDomain: string; rewardType?: string }): Promise<any> {
        return this._httpWrapper.sendRequest("post", `${this.baseUrl}/api/my-tags/referrals/claim`, data);
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
        if (!tagName) return;

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
        const zelfProof = this.variables.zelfProof || (await this._chromeService.getItem("zelfProof"));

        if (!zelfProof) {
            const wallet = await this._walletService.getFirstWalletFromStorage();

            if (!wallet) throw new Error("No wallet found. Please create or unlock a wallet first.");

            return wallet.zelfProof || "";
        }

        return zelfProof;
    }

    async getDomain(): Promise<string> {
        return this.variables.domain || (await this._chromeService.getItem("domain")) || "zelf";
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
        if (!tag) return null;

        const fullTagName = tag.publicData?.tagName || tag.fullTagName || tag.name || "";
        const { name: derivedTagName, domain: derivedDomain } = this.parseTagName(fullTagName);
        const tagName = tag.tagName || derivedTagName;
        const domain = tag.publicData?.domain || derivedDomain || "zelf";

        if (!tagName) return null;

        const response = await this.searchTag({ tagName, domain });

        const tagObject = response.data.tagObject;

        // this is when the tag is available for purchase, not longer in IPFS or Arweave
        if (response.data?.available) {
            tag.updatePublicData({
                ...tagObject?.publicData,
                expiresAt: new Date(new Date().setHours(0, 0, 0, 0)).toString(),
                gracePeriod: new Date(new Date().setHours(0, 0, 0, 0)).toString(),
            });

            tag.available = true;

            await this._walletService.updateWallet(tag);

            return tag;
        }

        if (!tagObject?.publicData || !tag) return null;

        tag.updatePublicData(tagObject?.publicData as Partial<TagPublicData>);

        await this._walletService.updateWallet(tag);

        return tag;
    }

    // Helper Methods for Domain Parsing
    parseTagName(tagName: string): { name: string; domain: string } {
        const parts = tagName.split(".");

        if (parts.length < 2) {
            return { name: tagName, domain: "" }; // Default to zelf domain
        }

        const domain = parts.pop() || "";

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
