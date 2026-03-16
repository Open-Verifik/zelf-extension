import { debounce, DebouncedFunc } from "lodash";
import { Subject, take, takeUntil } from "rxjs";

import { CommonModule, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, RouterLink, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { ChromeService } from "app/chrome.service";
import { ConfirmationDialogComponent } from "app/confirmation-dialog/confirmation-dialog.component";
import { CtaSheetComponent } from "app/cta-sheet/cta-sheet.component";
import { FirstLetterPipe } from "app/pipes/first-letter.pipe";
import { TimerPipe } from "app/pipes/timer.pipe";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { TagModel, TagsService, TagSearchResponse } from "app/tags.service";
import { environment } from "environments/environment";

@Component({
    imports: [
        CommonModule,
        FirstLetterPipe,
        MatIconModule,
        MatMenuModule,
        NgFor,
        NgIf,
        NgTemplateOutlet,
        RouterLink,
        RouterModule,
        TimerPipe,
        TranslocoModule,
        ZelfLoaderComponent,
    ],
    selector: "manage-domains",
    styleUrls: ["./manage-domains.component.scss"],
    templateUrl: "./manage-domains.component.html",
})
export class ManageDomainsComponent implements OnInit, OnDestroy {
    private unsubscriber$ = new Subject<void>();
    private _loadWalletsDebounced: DebouncedFunc<() => void>;

    loading: boolean = false;
    deleting: boolean = false;
    wallets: Partial<TagModel>[] = [];
    currentWallet: Partial<TagModel> = {};

    constructor(
        private _bottomSheet: MatBottomSheet,
        private _changeDetectorRef: ChangeDetectorRef,
        private _chromeService: ChromeService,
        private _dialog: MatDialog,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private _translocoService: TranslocoService,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService,
        private _tagsService: TagsService
    ) {
        this._loadWalletsDebounced = debounce(this._loadWallets, 1000);
    }

    ngOnInit(): void {
        this._chromeService.onWalletChanged$.pipe(take(1)).subscribe(this._initLoadWallets);
        this._chromeService.onWalletsChanged$.pipe(take(1)).subscribe(this._initLoadWallets);
    }

    ngOnDestroy(): void {
        this._loadWalletsDebounced?.cancel();

        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private _initLoadWallets = async (): Promise<void> => {
        if (this.loading) return;

        this.loading = true;

        await this._setWallets();

        await this._refreshWallets();

        this._chromeService.onWalletChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe(this._loadWalletsDebounced);
        this._chromeService.onWalletsChanged$.pipe(takeUntil(this.unsubscriber$)).subscribe(this._loadWalletsDebounced);
    };

    private _loadWallets = () => {
        if (this.loading) return;

        this.loading = true;

        this._setWallets().finally(() => {
            this.loading = false;

            this._changeDetectorRef.detectChanges();
        });
    };

    private _openDeleteConfirmationDialog(isLastWallet: boolean, wallet: Partial<TagModel> = {}): void {
        let message = "";

        if (wallet?.publicData?.isFullyExpired || wallet?.publicData?.isExpiringSoon) {
            message = this._translocoService.translate("manage_domains.expired_wallet_logout_message");
        } else {
            message = this._translocoService.translate("manage_domains.logout_of_wallet_message");
        }

        const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            data: {
                cancel: this._translocoService.translate("common.cancel"),
                confirm: this._translocoService.translate("common.remove"),
                destructiveButton: true,
                message,
                title: this._translocoService.translate("manage_domains.are_you_sure_you_want_to_delete"),
            },
        });

        dialogRef.afterClosed().subscribe(async (confirmed) => {
            if (!confirmed) return;

            if (isLastWallet) {
                this._chromeService.clearLocalStorage();
                this._chromeService.clearSessionStorage();

                this._router.navigate(["/welcome"], { replaceUrl: true });

                return;
            }

            // Prevent multiple simultaneous deletions
            if (this.deleting) return;

            // Delete the wallet
            try {
                this.deleting = true;
                this._changeDetectorRef.detectChanges();

                await this._walletService.deleteZelfProof(wallet as TagModel);

                // Refresh the wallets list
                await this._setWallets();

                // Show success message
                this._snackBar.open(
                    this._translocoService.translate("manage_domains.zelfproof_removed_successfully"),
                    this._translocoService.translate("common.close"),
                    {
                        duration: 3000,
                        panelClass: "zelf-snackbar",
                        verticalPosition: "top",
                    }
                );
            } catch (error) {
                console.error("Error deleting ZelfProof:", error);

                // Show error message
                this._snackBar.open(
                    this._translocoService.translate("errors.something_went_wrong"),
                    this._translocoService.translate("common.close"),
                    {
                        duration: 5000,
                        panelClass: "zelf-snackbar",
                        verticalPosition: "top",
                    }
                );
            } finally {
                this.deleting = false;
                this._changeDetectorRef.detectChanges();
            }
        });
    }

    private _openCTASheet(wallet: Partial<TagModel>): void {
        const bottomSheetRef = this._bottomSheet.open(CtaSheetComponent, {
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet",
            height: "100vh",
            maxHeight: "100vh",
            data: { wallet },
        });

        bottomSheetRef.afterDismissed().subscribe((confirmed) => {
            if (!confirmed) return;

            this._router.navigate(["/domain"], { queryParams: { zelfName: wallet.tagName } });
        });
    }

    private _refreshWallets = async (): Promise<void> => {
        await this._tagsService.refreshAllTagsPublicData(this.wallets as TagModel[], true);
    };

    private async _setWallets(): Promise<void> {
        const { wallet, wallets } = await this._walletService.getAllWalletsFromStorage();
        const seenWallets = new Set<string>();

        // Filter out empty wallets and guard against duplicates between `wallet` and `wallets`.
        const validWallets = [wallet, ...wallets].filter((w) => {
            if (!w || (!w.tagName && !w.name && !w.publicData?.tagName)) return false;

            const walletKey = w.fullTagName || w.publicData?.tagName || w.name || w.tagName;

            if (!walletKey || seenWallets.has(walletKey)) return false;

            seenWallets.add(walletKey);

            return true;
        }) as TagModel[];

        this.currentWallet = wallet && (wallet.tagName || wallet.name || wallet.publicData?.tagName) ? wallet : validWallets[0] || ({} as TagModel);
        this.wallets = validWallets;
        this.loading = false;

        this._changeDetectorRef.detectChanges();
    }

    downloadZelfProof(wallet: Partial<TagModel>): void {
        if (!wallet.name) return;

        const link = document.createElement("a");

        link.href = wallet?.image as string;
        link.download = `zelfproof_${wallet?.tagName}.png`;
        link.click();
    }

    goToDomain(wallet: Partial<TagModel>): void {
        if (this.showDetails(wallet)) {
            this._openCTASheet(wallet);

            return;
        }

        this._router.navigate(["/domain"], { queryParams: { zelfName: wallet.tagName } });
    }

    goToPurchase(wallet: Partial<TagModel>): void {
        const name = wallet?.tagName || wallet?.publicData?.tagName || wallet?.name || "";
        const domain = wallet.publicData?.domain || "zelf";
        const duration = 1;

        this._router.navigate(["/external-link"], {
            queryParams: {
                externalUrl: `${environment.paymentDomainUrl}?tagname=${name}&domain=${domain}&duration=${duration}`,
            },
        });
    }

    async goToRecovery(wallet: Partial<TagModel>): Promise<void> {
        const tagModel = wallet as TagModel;

        // Get tagName (just the name part, without domain)
        const tagName = tagModel?.tagName || wallet?.publicData?.tagName?.split(".")[0] || wallet?.name?.split(".")[0] || "";

        // Get domain separately
        const domain = tagModel?.domain || wallet?.publicData?.domain || "zelf";

        // Check if tag is available (doesn't exist in IPFS/Arweave)
        // The available property is already set during wallet refresh, no need for additional API call
        const isAvailable = (tagModel as TagModel)?.available === true;

        await this._tagsService.setTagName(tagName);
        await this._tagsService.setDomain(domain);

        await this._tagsService.setZelfProof(wallet.zelfProof || "");

        await this._walletService.setWalletsToColdStorage();

        if (isAvailable) {
            this._router.navigate(["/welcome/find"]);

            return;
        }

        // Create tagResponse from wallet data for welcome-grace
        if (wallet) {
            const tagResponse: TagSearchResponse = {
                ipfs: [],
                arweave: [],
                available: false,
                tagName: tagModel?.tagName,
                tagObject: wallet as any,
            };

            await this._tagsService.setTagResponse(tagResponse);
        }

        this._router.navigate(["/welcome/grace"]);
    }

    async deleteZelfProof(wallet: Partial<TagModel>): Promise<void> {
        if (!wallet.name) return;

        const isLastWallet = await this._walletService.checkIfLastWallet();

        if (!isLastWallet) return this._openDeleteConfirmationDialog(isLastWallet, wallet as TagModel);

        this._openDeleteConfirmationDialog(isLastWallet);
    }

    showDetails(wallet: Partial<TagModel>): boolean {
        return Boolean(
            wallet.publicData?.isFullyExpired ||
            wallet.publicData?.isExpiringSoon ||
            wallet.publicData?.isInGracePeriod ||
            wallet.publicData?.isExpired
        );
    }
}
