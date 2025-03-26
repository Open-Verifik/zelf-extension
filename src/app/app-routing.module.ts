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
    // {
    //     path: "onboarding",
    //     component: OnboardingComponent,
    //     canActivate: [OnboardingGuard],
    // },
    {
        path: "welcome",
        loadComponent: () => import("./welcome/welcome.component").then((m) => m.WelcomeComponent),
        canActivate: [OnboardingGuard],
        children: [
            {
                path: "",
                loadComponent: () => import("./welcome-onboarding/welcome-onboarding.component").then((m) => m.WelcomeOnboardingComponent),
                // Loads the default zelf name search screen (welcome carousel)
            },
            {
                path: "find",
                loadComponent: () => import("./welcome-find/welcome-find.component").then((m) => m.WelcomeFindComponent),
                canActivate: [],
                // Alternative route to "welcome", for users looking to purchase an additional domain
            },
            {
                path: "available",
                loadComponent: () => import("./welcome-available/welcome-available.component").then((m) => m.WelcomeAvailableComponent),
                canActivate: [ZelfNameGuard],
                // Name is available and user can provide referral code if applicable
            },
            {
                path: "registered",
                loadComponent: () => import("./welcome-registered/welcome-registered.component").then((m) => m.WelcomeRegisteredComponent),
                canActivate: [ZelfNameGuard],
                // Has two states: wallet is registered and not available, and wallet is registered and available (redirects to /safety/password)
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
                // Final screen. Shows mnemonic unlock, continue, or pay options
            },
        ],
    },
    {
        path: "security",
        loadComponent: () => import("./welcome/welcome.component").then((m) => m.WelcomeComponent),
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
    // {
    //     path: "create-wallet",
    //     loadComponent: () => import("./create-wallet/create-wallet.component").then((m) => m.CreateWalletComponent),
    // },
    // {
    //     path: "import-wallet",
    //     loadComponent: () => import("./import-wallet/import-wallet.component").then((m) => m.ImportWalletComponent),
    // },
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
    {
        path: "mobile-restricted",
        loadComponent: () => import("./core/mobile-restricted/mobile-restricted.component").then((m) => m.MobileRestrictedComponent),
    },
    {
        path: "external-link",
        data: { externalUrl: "https://payment.zelf.world/purchase" },
        canActivate: [ExternalRedirectGuard],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
