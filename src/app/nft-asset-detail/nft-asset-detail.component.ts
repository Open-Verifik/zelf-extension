import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { Subscription } from "rxjs";

import { ChromeService } from "app/chrome.service";
import {
    BlockdagNftService,
    BLOCKDAG_NFT_APP_ORIGIN,
    NftItem,
    parseNftImageUrl,
} from "app/services/blockdag-nft.service";
import { BlockdagManualNftsService } from "app/services/blockdag-manual-nfts.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";

@Component({
    imports: [MatButtonModule, NgFor, NgIf, RouterLink, TranslocoModule, ZelfLoaderComponent],
    selector: "nft-asset-detail",
    styleUrls: ["./nft-asset-detail.component.scss"],
    templateUrl: "./nft-asset-detail.component.html",
})
export class NftAssetDetailComponent implements OnInit, OnDestroy {
    loading = true;
    error = "";
    detail: Record<string, any> | null = null;
    displayImage = "";
    imageFailed = false;
    showRemoveManual = false;

    private _sub!: Subscription;
    private _routeContract = "";
    private _routeTokenId = "";

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _nft: BlockdagNftService,
        private _chrome: ChromeService,
        private _manual: BlockdagManualNftsService,
        private _transloco: TranslocoService,
        private _cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this._sub = this._route.paramMap.subscribe((pm) => {
            const id = pm.get("id");
            if (!id) {
                this.error = this._transloco.translate("home.nft_detail_missing_id");
                this.loading = false;
                this._cdr.markForCheck();
                return;
            }
            this._load(id);
        });
    }

    ngOnDestroy(): void {
        this._sub?.unsubscribe();
    }

    onImageError(): void {
        this.imageFailed = true;
    }

    private async _load(routeId: string): Promise<void> {
        this.loading = true;
        this.error = "";
        this.detail = null;
        this.imageFailed = false;
        this._routeContract = "";
        this._routeTokenId = "";
        this._cdr.markForCheck();

        const composite = routeId.match(/^(0x[a-fA-F0-9]{40})_(.+)$/);
        try {
            if (composite) {
                this._routeContract = composite[1].toLowerCase();
                this._routeTokenId = composite[2];
                const item = await this._nft.getNftByContractAndToken(composite[1], composite[2]);
                this.detail = this._fromListItem(item);
                this.showRemoveManual = await this._manual.has(this._routeContract, this._routeTokenId);
            } else {
                const raw = await this._nft.getItemDetailByFileId(routeId);
                this.detail = this._normalizeDetail(raw);
                const c = String(this.detail.collection || this.detail.collectionAddress || "").toLowerCase();
                const tid = String(this.detail.tokenId ?? "");
                this.showRemoveManual = !!(c && tid && (await this._manual.has(c, tid)));
            }
            this.displayImage = parseNftImageUrl(String(this.detail?.image || "")) || "";
        } catch (e) {
            console.error("NFT detail load failed:", e);
            this.error = this._transloco.translate("home.nft_detail_error");
            this.detail = null;
        } finally {
            this.loading = false;
            this._cdr.markForCheck();
        }
    }

    private _fromListItem(item: NftItem): Record<string, any> {
        const coll = item.collectionAddress || item.contractAddress || "";
        return {
            name: item.name,
            description: item.description,
            image: item.image,
            tokenId: item.tokenId,
            owner: item.owner,
            collection: coll,
            collectionAddress: coll,
            collectionName: item.collectionName,
            attributes: item.attributes || [],
            ipfsId: item.ipfsId,
            cid: item.cid,
        };
    }

    private _normalizeDetail(raw: any): Record<string, any> {
        if (!raw || typeof raw !== "object") return {};
        return {
            name: raw.name || "NFT",
            description: raw.description ?? "",
            image: raw.image ?? "",
            tokenId: raw.tokenId != null ? String(raw.tokenId) : "",
            owner: raw.owner ?? "",
            collection: raw.collection || raw.collectionAddress || "",
            collectionAddress: raw.collectionAddress || raw.collection || "",
            collectionName: raw.collectionName ?? "",
            attributes: Array.isArray(raw.attributes) ? raw.attributes : [],
            ipfsId: raw.ipfsId || raw.cid,
            cid: raw.cid || raw.ipfsId,
        };
    }

    async openInMarketplace(): Promise<void> {
        const id = this.detail?.cid || this.detail?.ipfsId || this.detail?.tokenId;
        if (!id) return;
        const locale = this._marketplaceLocale(this._transloco.getActiveLang());
        const url = `${BLOCKDAG_NFT_APP_ORIGIN}/${locale}/nft/asset/${encodeURIComponent(String(id))}`;
        await this._chrome.openExternalUrl(url);
    }

    async removeManual(): Promise<void> {
        const c =
            this._routeContract ||
            String(this.detail?.collection || this.detail?.collectionAddress || "").toLowerCase();
        const t = this._routeTokenId || String(this.detail?.tokenId ?? "");
        if (!c || !t) return;
        await this._manual.remove(c, t);
        await this._router.navigate(["/wallet"], { queryParams: { tab: "nfts" } });
    }

    private _marketplaceLocale(lang: string): string {
        const map: Record<string, string> = { cn: "zh", br: "pt", in: "en" };
        const normalized = (lang || "en").toLowerCase();
        return map[normalized] || normalized || "en";
    }
}
