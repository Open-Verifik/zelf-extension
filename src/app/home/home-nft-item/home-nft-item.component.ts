import { NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { NftItem } from "app/services/blockdag-nft.service";

@Component({
    imports: [NgIf, TranslocoModule],
    selector: "home-nft-item",
    styleUrls: ["./home-nft-item.component.scss"],
    templateUrl: "./home-nft-item.component.html",
})
export class HomeNftItemComponent {
    @Input({ required: true }) nft!: NftItem;

    imageFailed = false;

    constructor(private _router: Router) {}

    onImageError(): void {
        this.imageFailed = true;
    }

    openDetail(): void {
        const cid = this.nft.cid || this.nft.ipfsId;
        if (cid) {
            this._router.navigate(["/nft-asset", String(cid)]);
            return;
        }

        const c = (this.nft.collectionAddress || this.nft.contractAddress || "").toLowerCase();
        const t = this.nft.tokenId;
        if (c && /^0x[a-fA-F0-9]{40}$/.test(c) && t) {
            this._router.navigate(["/nft-asset", `${c}_${t}`]);
        }
    }

    get canOpenDetail(): boolean {
        if (this.nft.cid || this.nft.ipfsId) return true;
        const c = (this.nft.collectionAddress || this.nft.contractAddress || "").toLowerCase();
        return !!(c && /^0x[a-fA-F0-9]{40}$/.test(c) && this.nft.tokenId);
    }
}
