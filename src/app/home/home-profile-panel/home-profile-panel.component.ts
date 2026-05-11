import { NgFor } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { TranslocoModule } from "@jsverse/transloco";

import { TagModel } from "app/tags.service";

@Component({
    selector: "home-profile-panel",
    standalone: true,
    imports: [NgFor, TranslocoModule],
    templateUrl: "./home-profile-panel.component.html",
    styleUrls: ["./home-profile-panel.component.scss"],
})
export class HomeProfilePanelComponent implements OnChanges {
    @Input({ required: true }) wallets: TagModel[] = [];
    @Input({ required: true }) currentWallet: Partial<TagModel> = {};
    @Input() visible = false;

    @Output() readonly closed = new EventEmitter<void>();
    @Output() readonly walletSelected = new EventEmitter<TagModel>();
    @Output() readonly openSettings = new EventEmitter<void>();
    @Output() readonly addAccount = new EventEmitter<void>();

    allWallets: TagModel[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["wallets"] || changes["currentWallet"]) {
            this._buildWalletList();
        }
    }

    private _buildWalletList(): void {
        const current = this.currentWallet?.fullTagName;
        const currentAsTagModel = this.currentWallet as TagModel;

        const others = (this.wallets || []).filter((w) => w.fullTagName !== current);

        this.allWallets = current ? [currentAsTagModel, ...others] : others;
    }

    close(): void {
        this.closed.emit();
    }

    selectWallet(wallet: TagModel): void {
        this.walletSelected.emit(wallet);
    }

    onSettings(): void {
        this.openSettings.emit();
    }

    onAddAccount(): void {
        this.addAccount.emit();
    }

    isCurrentWallet(wallet: TagModel): boolean {
        return !!wallet.fullTagName && wallet.fullTagName === this.currentWallet?.fullTagName;
    }

    truncateName(name: string | undefined): string {
        if (!name) return "";
        return name.length > 12 ? name.slice(0, 11) + ".." : name;
    }
}
