import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { environment } from "../environments/environment";

import { LoginGuard } from "./guards/login.guard";

import { ExternalRedirectGuard } from "./guards/external-redirect.guard";
import { PasswordGuard } from "./guards/password.guard";
import { ZelfNameGuard } from "./guards/zelf-name.guard";
import { WalletGuard } from "./guards/wallet.guard";
import { MnemonicGuard } from "./guards/mnemonic.guard";
import { OnboardingGuard } from "./guards/onboarding.guard";
import { JWTResolver } from "./resolvers/jwt.resolver";

const routes: Routes = [
    {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
        canActivate: [LoginGuard],
        resolve: {
            auth: JWTResolver,
        },
    },
    {
        path: "",
        canActivate: [LoginGuard],
        loadComponent: () => import("./zelf-app/zelf-app.component").then((m) => m.ZelfAppComponent),
        resolve: {
            auth: JWTResolver,
        },
        children: [
            {
                path: "home",
                loadComponent: () => import("./home/home.component").then((m) => m.HomeComponent),
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
                path: "asset",
                loadComponent: () => import("./token-detail/token-detail.component").then((m) => m.TokenDetailComponent),
            },
        ],
    },
    // {
    //     path: "swap",
    //     loadComponent: () => import("./zelf-app/zelf-app.component").then((m) => m.ZelfAppComponent),
    //     canActivate: [LoginGuard],
    //     resolve: {
    //         auth: JWTResolver,
    //     },
    //     children: [{ path: "", loadComponent: () => import("./swap/swap.component").then((m) => m.SwapComponent) }],
    // },
    {
        path: "welcome",
        loadComponent: () => import("./zelf-app/zelf-app.component").then((m) => m.ZelfAppComponent),
        canActivate: [OnboardingGuard],
        resolve: {
            auth: JWTResolver,
        },
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
                path: "offline-import",
                loadComponent: () => import("./welcome-offline-import/welcome-offline-import.component").then((m) => m.WelcomeOfflineImportComponent),
                canActivate: [ZelfNameGuard],
            },
            {
                path: "grace",
                loadComponent: () => import("./welcome-grace/welcome-grace.component").then((m) => m.WelcomeGraceComponent),
                canActivate: [ZelfNameGuard],
            },
            {
                path: "recover",
                loadComponent: () => import("./welcome-recover/welcome-recover.component").then((m) => m.WelcomeRecoverComponent),
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
        resolve: {
            auth: JWTResolver,
        },
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
        resolve: {
            auth: JWTResolver,
        },
        children: [
            {
                path: "",
                loadComponent: () => import("./zelf-activity/zelf-activity.component").then((m) => m.ZelfActivityComponent),
            },
        ],
    },
    {
        path: "swap",
        loadComponent: () => import("./zelf-app/zelf-app.component").then((m) => m.ZelfAppComponent),
        canActivate: [LoginGuard],
        resolve: {
            auth: JWTResolver,
        },
        children: [{ path: "", loadComponent: () => import("./swap/swap.component").then((m) => m.SwapComponent) }],
    },
    {
        path: "send",
        loadComponent: () => import("./zelf-app/zelf-app.component").then((m) => m.ZelfAppComponent),
        canActivate: [LoginGuard],
        resolve: {
            auth: JWTResolver,
        },
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
        resolve: {
            auth: JWTResolver,
        },
        children: [
            {
                path: "",
                loadComponent: () => import("./receive-currency/receive-currency.component").then((m) => m.ReceiveCurrencyComponent),
            },
            {
                path: "qr/:network",
                loadComponent: () => import("./receive-qr/receive-qr.component").then((m) => m.ReceiveQrComponent),
            },
        ],
    },
    {
        path: "transaction",
        loadComponent: () => import("./zelf-app/zelf-app.component").then((m) => m.ZelfAppComponent),
        resolve: {
            auth: JWTResolver,
        },
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
        resolve: {
            auth: JWTResolver,
        },
        children: [
            {
                path: "",
                loadComponent: () => import("./zelf-settings/zelf-settings.component").then((m) => m.ZelfSettingsComponent),
            },
        ],
    },
    {
        path: "external-link",
        data: { externalUrl: "https://payment.zelf.world/purchase" },
        canActivate: [ExternalRedirectGuard],
    },
    // DEPRECATED ROUTES: Ensure all translations are also removed before deleting these components!
    // {
    //     path: "extension-instructions",
    //     loadComponent: () => import("./extension-instructions/extension-instructions.component").then((m) => m.ExtensionInstructionsComponent),
    //     canActivate: [ExtensionGuard],
    // },
];

if (environment.production) {
    routes.push({
        path: "e2e-test",
        loadChildren: () => import("./testing/e2e-test-helpers/e2e-test-helpers.module").then((m) => m.E2ETestHelpersModule),
    });
}

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
