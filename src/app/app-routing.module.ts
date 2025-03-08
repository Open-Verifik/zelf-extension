import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginGuard } from "./login.guard";
import { OnboardingGuard } from "./onboarding.guard";

import { HomeComponent } from "./home/home.component";
import { OnboardingComponent } from "./onboarding/onboarding.component";
import { RedirectGuard } from "./Redirect.guard";
import { OutletComponent } from "./outlet/outlet.component";

const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full", canActivate: [LoginGuard] },
    { path: "home", component: HomeComponent, canActivate: [LoginGuard] },
    {
        path: "onboarding",
        component: OnboardingComponent,
        canActivate: [OnboardingGuard],
    },
    {
        path: "welcome",
        loadComponent: () => import("./welcome/welcome.component").then((m) => m.WelcomeComponent),
        children: [
            {
                path: "",
                loadComponent: () => import("./welcome-onboarding/welcome-onboarding.component").then((m) => m.WelcomeOnboardingComponent),
                // Loads the default zelf name search screen (welcome carousel)
            },
            {
                path: "available",
                loadComponent: () => import("./welcome-available/welcome-available.component").then((m) => m.WelcomeAvailableComponent),
                // Name is available and user can provide referral code if applicable
            },
            {
                path: "registered",
                loadComponent: () => import("./welcome-registered/welcome-registered.component").then((m) => m.WelcomeRegisteredComponent),
                // Has two states: wallet is registered and not available, and wallet is registered and available (redirects to /safety/password)
            },
            {
                path: "import",
                loadComponent: () => import("./welcome-import/welcome-import.component").then((m) => m.WelcomeImportComponent),
            },
            {
                path: "find",
                loadComponent: () => import("./welcome-find/welcome-find.component").then((m) => m.WelcomeFindComponent),
                // Alternative route to "welcome", for users looking to purchase an additional domain
            },
            {
                path: "complete",
                loadComponent: () => import("./welcome-complete/welcome-complete.component").then((m) => m.WelcomeCompleteComponent),
                // Final screen. Shows mnemonic unlock, continue, or pay options
            },
            {
                path: "security",
                component: OutletComponent,
                children: [
                    {
                        path: "",
                        pathMatch: "full",
                        redirectTo: "password",
                    },
                    {
                        path: "password",
                        loadComponent: () => import("./security-password/security-password.component").then((m) => m.SecurityPasswordComponent),
                        // password screen will have two states: creating password, and logging in
                    },
                    {
                        path: "biometrics",
                        loadComponent: () => import("./security-biometrics/security-biometrics.component").then((m) => m.SecurityBiometricsComponent),
                        // unlocks/decrypts wallet
                    },
                ],
            },
        ],
    },
    {
        path: "create-wallet",
        loadComponent: () => import("./create-wallet/create-wallet.component").then((m) => m.CreateWalletComponent),
    },
    {
        path: "import-wallet",
        loadComponent: () => import("./import-wallet/import-wallet.component").then((m) => m.ImportWalletComponent),
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
        path: "find-wallet",
        loadComponent: () => import("./unlock-wallet/unlock-wallet.component").then((m) => m.UnlockWalletComponent),
    },
    {
        path: "extension-instructions",
        loadComponent: () => import("./extension-instructions/extension-instructions.component").then((m) => m.ExtensionInstructionsComponent),
    },
    {
        path: "send-transaction",
        loadComponent: () => import("./send-transaction/send-transaction.component").then((m) => m.SendTransactionComponent),
    },
    {
        path: "send-transaction-preview",
        loadComponent: () =>
            import("./send-transaction/send-transaction-preview/send-transaction-preview.component").then((m) => m.SendTransactionPreviewComponent),
    },
    {
        path: "send-transaction-confirm",
        loadComponent: () =>
            import("./send-transaction/send-transaction-confirmation/send-transaction-confirmation.component").then(
                (m) => m.SendTransactionConfirmationComponent
            ),
    },
    {
        path: "send-transaction-bridge",
        loadComponent: () =>
            import("./send-transaction/send-transaction-bridge/send-transaction-bridge.component").then((m) => m.SendTransactionBridgeComponent),
    },
    {
        path: "network-picker",
        loadComponent: () => import("./home/network-picker/network-picker.component").then((m) => m.NetworkPickerComponent),
    },
    {
        path: "new-zelf-name",
        loadComponent: () => import("./new-zelf-name/new-zelf-name.component").then((m) => m.NewZelfNameComponent),
    },
    {
        path: "open-zelf-name",
        loadComponent: () => import("./open-zelf-name/open-zelf-name.component").then((m) => m.OpenZelfNameComponent),
    },
    {
        path: "transaction",
        loadComponent: () => import("./transaction-details/transaction-details.component").then((m) => m.TransactionDetailsComponent),
    },
    {
        path: "mobile-restricted",
        loadComponent: () => import("./core/mobile-restricted/mobile-restricted.component").then((m) => m.MobileRestrictedComponent),
    },
    {
        path: "zelf-domain-purchase",
        data: { externalUrl: "https://payment.zelf.world/purchase" },
        canActivate: [RedirectGuard],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
