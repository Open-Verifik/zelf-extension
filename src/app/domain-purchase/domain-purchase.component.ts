import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, RouterLink, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { ChromeService } from "app/chrome.service";
import { ZelfNamePipe } from "app/pipes/zelf-name.pipe";
import { WalletModel } from "app/wallet";
import { WalletService } from "app/wallet.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { Subject, takeUntil } from "rxjs";

@Component({
    selector: "domain-purchase",
    imports: [TranslocoModule, CommonModule, MatButtonModule, RouterLink, RouterModule, ZelfNamePipe, FormsModule, ZelfLoaderComponent],
    templateUrl: "./domain-purchase.component.html",
    styleUrls: ["./domain-purchase.component.scss"],
})
export class DomainPurchaseComponent implements OnInit, OnDestroy {
    private unsubscriber$ = new Subject<void>();
    private _selectedZelfName: string = "";

    durationToken: string = "";
    agreement: boolean = false;
    yearCount: number = 1;
    loading: boolean = false;
    wallet: Partial<WalletModel> = {};

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _chromeService: ChromeService,
        private _walletService: WalletService
    ) {
        this._selectedZelfName = this._activatedRoute.snapshot.queryParams.zelfName;

        this._activatedRoute.queryParams.pipe(takeUntil(this.unsubscriber$)).subscribe((params) => {
            this._selectedZelfName = params.zelfName;
        });
    }

    async ngOnInit(): Promise<void> {
        await this._setWallets();

        this.durationToken = await this._chromeService.getItem("durationToken");
        this.loading = false;
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

    decrementYearCount(): void {
        this.yearCount--;
    }

    incrementYearCount(): void {
        this.yearCount++;
    }
}
