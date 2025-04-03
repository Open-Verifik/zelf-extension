import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginGuard } from "./guards/login.guard";
import { HomeComponent } from "./home/home.component";

import { ExternalRedirectGuard } from "./guards/external-redirect.guard";
import { PasswordGuard } from "./guards/password.guard";
import { ZelfNameGuard } from "./guards/zelf-name.guard";
import { WalletGuard } from "./guards/wallet.guard";
import { MnemonicGuard } from "./guards/mnemonic.guard";
import { OnboardingGuard } from "./guards/onboarding.guard";

const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full", canActivate: [LoginGuard] },
    { path: "home", component: HomeComponent, canActivate: [LoginGuard] },
    {
        path: "welcome",
        loadComponent: () => import("./zelf-app/zelf-app.component").then((m) => m.ZelfAppComponent),
        canActivate: [OnboardingGuard],
        children: [
            {
                path: "",
                loadComponent: () => import("./welcome-onboarding/welcome-onboarding.component").then((m) => m.WelcomeOnboardingComponent),
            },
            {
                path: "find",
                loadComponent: () => import("./welcome-find/welcome-find.component").then((m) => m.WelcomeFindComponent),
                canActivate: [],
            },
            {
                path: "available",
                loadComponent: () => import("./welcome-available/welcome-available.component").then((m) => m.WelcomeAvailableComponent),
                canActivate: [ZelfNameGuard],
            },
            {
                path: "registered",
                loadComponent: () => import("./welcome-registered/welcome-registered.component").then((m) => m.WelcomeRegisteredComponent),
                canActivate: [ZelfNameGuard],
            },
            {
                path: "import",
                loadComponent: () => import("./welcome-import/welcome-import.component").then((m) => m.WelcomeImportComponent),
                canActivate: [ZelfNameGuard],
            },
            {
                path: "complete",
                loadComponent: () => import("./welcome-complete/welcome-complete.component").then((m) => m.WelcomeCompleteComponent),
                canActivate: [ZelfNameGuard, WalletGuard],
            },
        ],
    },
    {
        path: "security",
        loadComponent: () => import("./zelf-app/zelf-app.component").then((m) => m.ZelfAppComponent),
        canActivate: [ZelfNameGuard],
        children: [
            {
                path: "",
                loadComponent: () => import("./security/security.component").then((m) => m.SecurityComponent),
            },
            {
                path: "password",
                loadComponent: () => import("./security-password/security-password.component").then((m) => m.SecurityPasswordComponent),
                canActivate: [MnemonicGuard],
            },
            {
                path: "biometrics",
                loadComponent: () => import("./security-biometrics/security-biometrics.component").then((m) => m.SecurityBiometricsComponent),
                canActivate: [PasswordGuard, MnemonicGuard],
            },
        ],
    },
    {
        path: "activity",
        loadComponent: () => import("./zelf-app/zelf-app.component").then((m) => m.ZelfAppComponent),
        canActivate: [LoginGuard],
        children: [
            {
                path: "",
                loadComponent: () => import("./zelf-activity/zelf-activity.component").then((m) => m.ZelfActivityComponent),
            },
        ],
    },
    {
        path: "send",
        loadComponent: () => import("./zelf-app/zelf-app.component").then((m) => m.ZelfAppComponent),
        canActivate: [LoginGuard],
        children: [
            {
                path: "",
                loadComponent: () => import("./send-currency/send-currency.component").then((m) => m.SendCurrencyComponent),
            },
            {
                path: "transaction",
                loadComponent: () => import("./send-transaction/send-transaction.component").then((m) => m.SendTransactionComponent),
            },
            {
                path: "confirmation",
                loadComponent: () => import("./send-confirm/send-confirm.component").then((m) => m.SendConfirmComponent),
            },
        ],
    },
    {
        path: "receive",
        loadComponent: () => import("./zelf-app/zelf-app.component").then((m) => m.ZelfAppComponent),
        canActivate: [LoginGuard],
        children: [
            {
                path: "",
                loadComponent: () => import("./receive-currency/receive-currency.component").then((m) => m.ReceiveCurrencyComponent),
            },
            {
                path: "qr/:symbol/:tokenType/:name",
                loadComponent: () => import("./receive-qr/receive-qr.component").then((m) => m.ReceiveQrComponent),
            },
        ],
    },
    {
        path: "transaction",
        loadComponent: () => import("./zelf-app/zelf-app.component").then((m) => m.ZelfAppComponent),
        children: [
            {
                path: ":hash",
                loadComponent: () => import("./transaction-receipt/transaction-receipt.component").then((m) => m.TransactionReceiptComponent),
            },
        ],
    },
    {
        path: "settings",
        loadComponent: () => import("./zelf-app/zelf-app.component").then((m) => m.ZelfAppComponent),
        canActivate: [LoginGuard],
        children: [
            {
                path: "",
                loadComponent: () => import("./zelf-settings/zelf-settings.component").then((m) => m.ZelfSettingsComponent),
            },
        ],
    },
    {
        path: "manage-domains",
        loadComponent: () => import("./manage-domains/manage-domains.component").then((m) => m.ManageDomainsComponent),
    },
    {
        path: "domain",
        pathMatch: "prefix",
        loadComponent: () => import("./manage-domain/manage-domain.component").then((m) => m.ManageDomainComponent),
    },
    {
        path: "domain-purchase",
        pathMatch: "prefix",
        loadComponent: () => import("./domain-purchase/domain-purchase.component").then((m) => m.DomainPurchaseComponent),
    },
    {
        path: "wallet",
        loadComponent: () => import("./wallet/wallet.component").then((m) => m.WalletComponent),
    },
    {
        path: "mobile-restricted",
        loadComponent: () => import("./core/mobile-restricted/mobile-restricted.component").then((m) => m.MobileRestrictedComponent),
    },
    {
        path: "external-link",
        data: { externalUrl: "https://payment.zelf.world/purchase" },
        canActivate: [ExternalRedirectGuard],
    },
    // DEPRECATED ROUTES: Ensure all translations are also removed before deleting these components!
    // {
    //     path: "create-wallet",
    //     loadComponent: () => import("./create-wallet/create-wallet.component").then((m) => m.CreateWalletComponent),
    // },
    // {
    //     path: "import-wallet",
    //     loadComponent: () => import("./import-wallet/import-wallet.component").then((m) => m.ImportWalletComponent),
    // },
    // {
    //     path: "onboarding",
    //     component: OnboardingComponent,
    //     canActivate: [OnboardingGuard],
    // },
    // {
    //     path: "find-wallet",
    //     loadComponent: () => import("./unlock-wallet/unlock-wallet.component").then((m) => m.UnlockWalletComponent),
    // },
    // {
    //     path: "extension-instructions",
    //     loadComponent: () => import("./extension-instructions/extension-instructions.component").then((m) => m.ExtensionInstructionsComponent),
    //     canActivate: [ExtensionGuard],
    // },
    // {
    //     path: "send-transaction",
    //     loadComponent: () => import("./send-transaction/send-transaction.component").then((m) => m.SendTransactionComponent),
    // },
    // {
    //     path: "send-transaction-preview",
    //     loadComponent: () =>
    //         import("./send-transaction/send-transaction-preview/send-transaction-preview.component").then((m) => m.SendTransactionPreviewComponent),
    // },
    // {
    //     path: "send-transaction-confirm",
    //     loadComponent: () =>
    //         import("./send-transaction/send-transaction-confirmation/send-transaction-confirmation.component").then(
    //             (m) => m.SendTransactionConfirmationComponent
    //         ),
    // },
    // {
    //     path: "send-transaction-bridge",
    //     loadComponent: () =>
    //         import("./send-transaction/send-transaction-bridge/send-transaction-bridge.component").then((m) => m.SendTransactionBridgeComponent),
    // },
    // {
    //     path: "network-picker",
    //     loadComponent: () => import("./home/network-picker/network-picker.component").then((m) => m.NetworkPickerComponent),
    // },
    // {
    //     path: "new-zelf-name",
    //     loadComponent: () => import("./new-zelf-name/new-zelf-name.component").then((m) => m.NewZelfNameComponent),
    // },
    // {
    //     path: "open-zelf-name",
    //     loadComponent: () => import("./open-zelf-name/open-zelf-name.component").then((m) => m.OpenZelfNameComponent),
    // },
    // {
    //     path: "transaction",
    //     loadComponent: () => import("./transaction-details/transaction-details.component").then((m) => m.TransactionDetailsComponent),
    // },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
