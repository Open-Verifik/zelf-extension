import { NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { AfterViewInit, Component, OnDestroy, TemplateRef, ViewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ChromeService } from "app/chrome.service";
import { ConfirmationDialogComponent } from "app/confirmation-dialog/confirmation-dialog.component";
import { WalletConnectService } from "app/services/walletconnect.service";
import { Subject, takeUntil } from "rxjs";
import { ZelfSettingsNetworksComponent } from "./zelf-settings-networks/zelf-settings-networks.component";
import { ZelfSettingsSecurityComponent } from "./zelf-settings-security/zelf-settings-security.component";
import { ZelfSettingsLanguageComponent } from "./zelf-settings-language/zelf-settings-language.component";
import { ZelfSettingsDappsComponent } from "./zelf-settings-dapps/zelf-settings-dapps.component";

@Component({
    imports: [
        NgFor,
        NgIf,
        FormsModule,
        TranslocoModule,
        MatButtonModule,
        RouterLink,
        NgTemplateOutlet,
        ZelfSettingsNetworksComponent,
        ZelfSettingsSecurityComponent,
        ZelfSettingsLanguageComponent,
        ZelfSettingsDappsComponent,
    ],
    selector: "zelf-settings",
    styleUrls: ["./zelf-settings.component.scss"],
    templateUrl: "./zelf-settings.component.html",
})
export class ZelfSettingsComponent implements AfterViewInit, OnDestroy {
    @ViewChild("networksIcon", { static: true }) networksIcon: TemplateRef<HTMLDivElement> = {} as TemplateRef<HTMLDivElement>;
    @ViewChild("securityIcon", { static: true }) securityIcon: TemplateRef<HTMLDivElement> = {} as TemplateRef<HTMLDivElement>;
    @ViewChild("languageIcon", { static: true }) languageIcon: TemplateRef<HTMLDivElement> = {} as TemplateRef<HTMLDivElement>;
    @ViewChild("subscriptionIcon", { static: true }) subscriptionIcon: TemplateRef<HTMLDivElement> = {} as TemplateRef<HTMLDivElement>;
    @ViewChild("dappsConnectionsIcon", { static: true }) dappsConnectionsIcon: TemplateRef<HTMLDivElement> = {} as TemplateRef<HTMLDivElement>;

    private unsubscriber$: Subject<void> = new Subject<void>();

    selectedSettings: "networks" | "security" | "language" | "dapps" | "" = "";
    settingsItems: {
        title: string;
        icon: string;
        routerLink: string[];
        queryParams: Record<string, string>;
    }[] = [];

    footerLinks = [
        {
            url: "https://docs.zelf.world/",
            text: "common.documentation",
        },
        {
            url: "https://docs.zelf.world/docs/legal/terms-of-use",
            text: "common.terms_and_conditions",
        },
        {
            url: "https://docs.zelf.world/docs/legal/privacy-policy",
            text: "common.privacy",
        },
        {
            url: "https://docs.zelf.world/docs/airdrop/pricing-per-domain",
            text: "common.pricing",
        },
    ];

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _chromeService: ChromeService,
        private _dialog: MatDialog,
        private _router: Router,
        private _translocoService: TranslocoService
    ) {
        this._setSelectedSettings();
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    ngAfterViewInit(): void {
        setTimeout(() => this._setSettingItems());
    }

    private _createDialogRef(): MatDialogRef<ConfirmationDialogComponent> {
        return this._dialog.open(ConfirmationDialogComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            data: {
                message: this._translocoService.translate("logout_message"),
                confirm: this._translocoService.translate("common.confirm"),
                cancel: this._translocoService.translate("common.cancel"),
                title: this._translocoService.translate("logout_title"),
                destructiveButton: true,
            },
        });
    }

    private _setSettingItems() {
        this.settingsItems = [
            {
                title: this._translocoService.translate("settings.networks_label"),
                icon: "networksIcon",
                routerLink: ["./"],
                queryParams: {
                    edit: "networks",
                },
            },
            {
                title: this._translocoService.translate("settings.security_label"),
                icon: "securityIcon",
                routerLink: ["./"],
                queryParams: {
                    edit: "security",
                },
            },
            {
                title: this._translocoService.translate("settings.language_label"),
                icon: "languageIcon",
                routerLink: ["./"],
                queryParams: {
                    edit: "language",
                },
            },
            {
                title: this._translocoService.translate("settings.dapps_label"),
                icon: "dappsConnectionsIcon",
                routerLink: ["./"],
                queryParams: {
                    edit: "dapps",
                },
            },
            {
                title: this._translocoService.translate("settings.subscription_label"),
                icon: "subscriptionIcon",
                routerLink: ["/zelf-keys/billing"],
                queryParams: {
                    redirect: "/settings",
                },
            },
        ];
    }

    private _setSelectedSettings() {
        this.selectedSettings = this._activatedRoute.snapshot.queryParams?.edit ? this._activatedRoute.snapshot.queryParams.edit : "";

        this._activatedRoute.queryParams.pipe(takeUntil(this.unsubscriber$)).subscribe((queryParams) => {
            this.selectedSettings = queryParams.edit ? queryParams.edit : "";
        });
    }

    getTemplateIcon(settingItem: { icon: string }): TemplateRef<any> | null {
        return (this[settingItem.icon as keyof ZelfSettingsComponent] as TemplateRef<any>) || null;
    }

    get pageTitle(): string {
        switch (this.selectedSettings) {
            case "networks":
                return "settings.networks.title";
            case "security":
                return "settings.security_label";
            case "language":
                return "settings.language_label";
            case "dapps":
                return "settings.dapps.title";
            default:
                return "common.settings";
        }
    }

    logout() {
        const dialogRef = this._createDialogRef();

        dialogRef.afterClosed().subscribe((result) => {
            if (!result) return;

            this._chromeService.clearLocalStorage();
            this._chromeService.clearSessionStorage();

            this._router.navigate(["/welcome"], { replaceUrl: true });
        });
    }
}
