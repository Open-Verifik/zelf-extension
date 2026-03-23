import { NgFor, NgIf } from "@angular/common";
import {
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { RouterLink } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { BlockdagManualNftsService } from "app/services/blockdag-manual-nfts.service";
import { BlockdagNftService, NftItem } from "app/services/blockdag-nft.service";
import { SettingsService } from "app/services/settings.service";
import { TagModel } from "app/tags.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";

import { HomeNftItemComponent } from "../home-nft-item/home-nft-item.component";

type CollectiblesState = "idle" | "loading" | "ready" | "error" | "no_address" | "network_disabled";

@Component({
    imports: [
        FlexLayoutModule,
        HomeNftItemComponent,
        MatButtonModule,
        NgFor,
        NgIf,
        RouterLink,
        TranslocoModule,
        ZelfLoaderComponent,
    ],
    selector: "home-collectibles",
    styleUrls: ["./home-collectibles.component.scss"],
    templateUrl: "./home-collectibles.component.html",
})
export class HomeCollectiblesComponent implements OnInit, OnChanges {
    @Input() wallet!: TagModel;
    @Input() active = false;
    @Input() reloadKey = 0;

    nfts: NftItem[] = [];
    state: CollectiblesState = "idle";
    /** Avoid duplicate GET when `ngOnInit` and `ngOnChanges` fire with the same inputs. */
    private _lastSuccessKey = "";

    constructor(
        private _blockdagNft: BlockdagNftService,
        private _manualNfts: BlockdagManualNftsService,
        private _cdr: ChangeDetectorRef,
        private _settingsService: SettingsService
    ) {}

    ngOnInit(): void {
        this._scheduleLoad();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["active"] || changes["wallet"] || changes["reloadKey"]) {
            this._scheduleLoad();
        }
    }

    retry(): void {
        this._lastSuccessKey = "";
        this._fetch();
    }

    private _scheduleLoad(): void {
        if (!this.active) return;
        this._fetch();
    }

    private _ownerAddress(): string {
        const pd = this.wallet?.publicData;
        return (pd?.blockDAGAddress || pd?.ethAddress || "").trim();
    }

    private _isBlockdagNetworkEnabled(): boolean {
        const nets = this._settingsService.settings?.networks;
        if (!nets?.length) return true;
        const bdag = nets.find((n) => n.id === "blockdag");
        if (!bdag) return true;
        return bdag.enabled;
    }

    private async _fetch(): Promise<void> {
        if (!this.active) return;

        const owner = this._ownerAddress();
        if (!owner) {
            this.nfts = [];
            this.state = "no_address";
            this._lastSuccessKey = "";
            this._cdr.markForCheck();
            return;
        }

        if (!this._isBlockdagNetworkEnabled()) {
            this.nfts = [];
            this.state = "network_disabled";
            this._lastSuccessKey = "";
            this._cdr.markForCheck();
            return;
        }

        const cacheKey = `${this.reloadKey}|${owner}|${this.wallet?.tagName || ""}`;
        if (this.state === "ready" && this._lastSuccessKey === cacheKey) {
            return;
        }

        this.state = "loading";
        this._cdr.markForCheck();

        try {
            const items = await this._blockdagNft.getItemsByOwner(owner);
            const lower = owner.toLowerCase();
            const fromOwner = items.filter((n) => !n.owner || n.owner.toLowerCase() === lower);
            this.nfts = await this._mergeManualImports(fromOwner, lower);
            this.state = "ready";
            this._lastSuccessKey = cacheKey;
        } catch (err) {
            console.error("BlockDAG NFT fetch failed:", err);
            this.nfts = [];
            this.state = "error";
        } finally {
            this._cdr.markForCheck();
        }
    }

    private _nftDedupeKey(n: NftItem): string {
        const cid = n.cid || n.ipfsId;
        if (cid) return `cid:${cid}`;
        const c = (n.collectionAddress || n.contractAddress || "").toLowerCase();
        return `tok:${c}:${n.tokenId}`;
    }

    private async _mergeManualImports(fromOwner: NftItem[], _ownerLower: string): Promise<NftItem[]> {
        const merged = [...fromOwner];
        const keys = new Set(merged.map((n) => this._nftDedupeKey(n)));
        const manual = await this._manualNfts.list();

        for (const m of manual) {
            const tokKey = `tok:${m.contract}:${m.tokenId}`;
            if (keys.has(tokKey)) continue;

            try {
                const n = await this._blockdagNft.getNftByContractAndToken(m.contract, m.tokenId);
                const k = this._nftDedupeKey(n);
                if (keys.has(k)) continue;
                merged.push(n);
                keys.add(k);
                keys.add(tokKey);
            } catch {
                /* indexer lag — user can open detail via contract_tokenId after import */
            }
        }

        return merged;
    }
}
