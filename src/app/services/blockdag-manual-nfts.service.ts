import { Injectable } from "@angular/core";

import { ChromeService } from "app/chrome.service";

const STORAGE_KEY = "blockdagManualNftImports";

export interface ManualNftKey {
    contract: string;
    tokenId: string;
}

@Injectable({
    providedIn: "root",
})
export class BlockdagManualNftsService {
    constructor(private _chrome: ChromeService) {}

    async list(): Promise<ManualNftKey[]> {
        const raw = await this._chrome.getItem<any>(STORAGE_KEY);
        if (raw == null || raw === "") return [];
        if (Array.isArray(raw)) {
            return raw.map((x) => ({ contract: String(x.contract).toLowerCase(), tokenId: String(x.tokenId) }));
        }
        try {
            const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
            return Array.isArray(parsed)
                ? parsed.map((x: any) => ({ contract: String(x.contract).toLowerCase(), tokenId: String(x.tokenId) }))
                : [];
        } catch {
            return [];
        }
    }

    async add(contract: string, tokenId: string): Promise<void> {
        const c = contract.trim().toLowerCase();
        const t = tokenId.trim();
        const list = await this.list();
        if (list.some((x) => x.contract === c && x.tokenId === t)) return;
        list.push({ contract: c, tokenId: t });
        await this._chrome.setItem(STORAGE_KEY, list);
    }

    async remove(contract: string, tokenId: string): Promise<void> {
        const c = contract.trim().toLowerCase();
        const t = tokenId.trim();
        const list = (await this.list()).filter((x) => !(x.contract === c && x.tokenId === t));
        await this._chrome.setItem(STORAGE_KEY, list);
    }

    async has(contract: string, tokenId: string): Promise<boolean> {
        const c = contract.trim().toLowerCase();
        const t = tokenId.trim();
        return (await this.list()).some((x) => x.contract === c && x.tokenId === t);
    }
}
