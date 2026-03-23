import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

import { AuthService } from "app/services/auth.service";
import { environment } from "environments/environment";

/** Public BlockDAG NFT marketplace (Next.js) — asset detail routes. */
export const BLOCKDAG_NFT_APP_ORIGIN = "https://blockdag.zelf.world";

export interface NftItem {
    tokenId: string;
    collectionAddress: string;
    name: string;
    description: string;
    image: string;
    attributes: { trait_type: string; value: string }[];
    owner: string;
    metadataURI: string;
    contractAddress: string;
    collectionName: string;
    isListed: boolean;
    traits: any[];
    createdAt: string;
    price?: number | null;
    ipfsId?: string;
    cid?: string;
    collection?: string;
    category?: string;
}

export function parseNftImageUrl(url: string): string {
    if (!url) return "";
    const u = url.trim();
    if (u.startsWith("ipfs://")) return `https://ipfs.io/ipfs/${u.replace("ipfs://", "")}`;
    return u;
}

export function formatNftItem(n: any, idx: number): NftItem {
    return {
        contractAddress: n.collection || n.collectionAddress || "unknown",
        collectionAddress: n.collection || n.collectionAddress || "unknown",
        tokenId: n.tokenId != null ? String(n.tokenId) : "",
        ipfsId: n.ipfsId,
        cid: n.cid,
        collectionName: n.collectionName || n.name || "BlockDAG NFT",
        name: n.name || `NFT #${idx + 1}`,
        description: n.description ?? "",
        image: parseNftImageUrl(n.image ?? ""),
        category: n.nftCategory || n.category || "Art",
        owner: n.owner ?? "",
        traits: [],
        attributes: n.attributes ?? [],
        metadataURI: n.metadataURI ?? "",
        isListed: false,
        price: undefined,
        createdAt: new Date().toISOString(),
    };
}

@Injectable({
    providedIn: "root",
})
export class BlockdagNftService {
    constructor(
        private _http: HttpClient,
        private _authService: AuthService
    ) {}

    private async _headers(): Promise<HttpHeaders> {
        let headers = new HttpHeaders({ "Content-Type": "application/json" });
        try {
            const token = await this._authService.checkAccessToken();
            if (token) {
                headers = headers.set("Authorization", `Bearer ${token}`);
            }
        } catch {
            /* optional */
        }
        return headers;
    }

    /**
     * GET /api/blockdag/nft/item/:itemId — same as landing NFT detail (CID / ipfs file id).
     */
    async getItemDetailByFileId(itemId: string): Promise<any> {
        const url = `${environment.apiUrl}/api/blockdag/nft/item/${encodeURIComponent(itemId)}`;
        const headers = await this._headers();
        const res = await firstValueFrom(this._http.get<any>(url, { headers }));
        return res?.data ?? res;
    }

    /**
     * GET /api/blockdag/nft/items/:collection/:tokenId — landing BlockDagNftService.getNFT
     */
    async getNftByContractAndToken(collectionAddress: string, tokenId: string): Promise<NftItem> {
        const url = `${environment.apiUrl}/api/blockdag/nft/items/${encodeURIComponent(collectionAddress)}/${encodeURIComponent(tokenId)}`;
        const headers = await this._headers();
        const res = await firstValueFrom(this._http.get<any>(url, { headers }));
        const raw = res?.data ?? res;
        const row = Array.isArray(raw) ? raw[0] : raw;
        if (!row || typeof row !== "object") {
            throw new Error("NFT not found");
        }
        return formatNftItem(row, 0);
    }

    /**
     * GET /api/blockdag/nft/items?owner=0x...
     * Optional Bearer token (same as landing BlockDagNftService).
     */
    async getItemsByOwner(ownerAddress: string): Promise<NftItem[]> {
        const url = `${environment.apiUrl}/api/blockdag/nft/items`;
        const headers = await this._headers();

        const res = await firstValueFrom(this._http.get<any>(url, { params: { owner: ownerAddress }, headers }));
        const raw: any[] = Array.isArray(res) ? res : res?.data ?? [];
        return raw.map((item, i) => formatNftItem(item, i));
    }
}
