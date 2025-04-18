import { CommonModule, NgIf } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router, RouterLink, RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "manage-domain",
    standalone: true,
    imports: [CommonModule, NgIf, MatButtonModule, TranslocoModule, RouterLink, RouterModule],
    templateUrl: "./manage-domain.component.html",
    styleUrls: ["./manage-domain.component.scss"],
})
export class ManageDomainComponent implements OnInit, OnDestroy {
    private unsubscriber$ = new Subject<void>();
    private _selectedZelfName: string = "";

    loading: boolean = false;
    wallet?: Partial<WalletModel> = {};
    wallets: WalletModel[] = [];

    constructor(private _activatedRoute: ActivatedRoute, private _router: Router, private _walletService: WalletService) {
        this._selectedZelfName = this._activatedRoute.snapshot.queryParams.zelfName;

        this._activatedRoute.queryParams.pipe(takeUntil(this.unsubscriber$)).subscribe((params) => {
            this._selectedZelfName = params.zelfName;
        });
    }

    ngOnInit(): void {
        this._setWallets().then(() => {
            this.loading = false;
        });
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private async _setWallets(): Promise<void> {
        this.loading = true;

        const { wallet, wallets } = await this._walletService.getAllWalletsFromStorage();

        if (this._selectedZelfName) {
            this.wallet = wallets.find((w) => w.publicData.zelfName.toLowerCase() === this._selectedZelfName.toLowerCase()) || wallet || {};

            return;
        }

        this.wallet = wallet || {};
    }

    async extendRegistration(): Promise<void> {
        this._router.navigate(["/external-link"], {
            queryParams: {
                externalUrl: `https://payment.zelf.world/purchase?zelfName=${this.wallet?.publicData?.zelfName}`,
            },
        });
    }

    getWalletStatus(): string {
        if (this.wallet?.publicData?.isExpired) return "expired";

        return this.wallet?.publicData?.type === "mainnet" ? "active" : "hold";
    }

    isExpired(): boolean {
        return !!this.wallet?.publicData?.isExpired;
    }
}
