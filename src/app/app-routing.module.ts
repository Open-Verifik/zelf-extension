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
import { ZelfKeysDataResolver } from "./resolvers/zelf-keys-data.resolver";
import { SecurityBiometricsComponent } from "./security-biometrics/security-biometrics.component";
import { ZelfKeysResultGuard } from "./guards/zelf-keys-result.guard";
import { ZelfKeysPasswordGuard } from "./guards/zelf-keys-password.guard";
import { ZelfKeysNoteGuard } from "./guards/zelf-keys-note.guard";
import { ZelfKeysPaymentCardGuard } from "./guards/zelf-keys-payment-card.guard";
import { ZelfKeysStartGuard } from "./guards/zelf-keys-start.guard";
import { PopoutOnlyGuard } from "./guards/popout-only.guard";

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
                canDeactivate: [(component: SecurityBiometricsComponent) => component.canNavigateAway()],
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
        path: "zelf-authenticator",
        loadComponent: () => import("./zelf-app/zelf-app.component").then((m) => m.ZelfAppComponent),
        canActivate: [LoginGuard],
        resolve: {
            auth: JWTResolver,
        },
        children: [
            {
                path: "",
                loadComponent: () => import("./zelf-authenticator/zelf-authenticator.component").then((m) => m.ZelfAuthenticatorComponent),
            },
        ],
    },
    {
        path: "zelf-keys",
        loadComponent: () => import("./zelf-app/zelf-app.component").then((m) => m.ZelfAppComponent),
        canActivate: [LoginGuard],
        resolve: {
            auth: JWTResolver,
        },
        children: [
            {
                path: "",
                loadComponent: () => import("./zelf-keys/zelf-keys-dashboard.component").then((m) => m.ZelfKeysDashboardComponent),
                resolve: {
                    zelfKeysData: ZelfKeysDataResolver,
                },
                children: [
                    { path: "", redirectTo: "start", pathMatch: "full" },
                    {
                        path: "start",
                        loadComponent: () => import("./zelf-keys/zelf-keys-start/zelf-keys-start.component").then((m) => m.ZelfKeysStartComponent),
                        canActivate: [ZelfKeysStartGuard],
                    },
                    {
                        path: "passwords",
                        loadComponent: () =>
                            import("./zelf-keys/zelf-keys-passwords/zelf-keys-passwords.component").then((m) => m.ZelfKeysPasswordsComponent),
                    },
                    {
                        path: "passwords/new",
                        loadComponent: () =>
                            import("./zelf-keys/zelf-keys-passwords/zelf-keys-password-form/zelf-keys-password-form.component").then(
                                (m) => m.PasswordFormComponent
                            ),
                    },
                    {
                        path: "passwords/result",
                        loadComponent: () =>
                            import("./zelf-keys/zelf-keys-passwords/zelf-keys-password-result/zelf-keys-password-result.component").then(
                                (m) => m.ZelfKeysPasswordResultComponent
                            ),
                        canActivate: [ZelfKeysResultGuard],
                    },
                    {
                        path: "passwords/detail",
                        loadComponent: () =>
                            import("./zelf-keys/zelf-keys-passwords/zelf-keys-password-detail/zelf-keys-password-detail.component").then(
                                (m) => m.ZelfKeysPasswordDetailComponent
                            ),
                        canActivate: [ZelfKeysPasswordGuard],
                    },
                    {
                        path: "notes",
                        loadComponent: () => import("./zelf-keys/zelf-keys-notes/zelf-keys-notes.component").then((m) => m.ZelfKeysNotesComponent),
                    },
                    {
                        path: "notes/new",
                        loadComponent: () =>
                            import("./zelf-keys/zelf-keys-notes/zelf-keys-note-form/zelf-keys-note-form.component").then((m) => m.NoteFormComponent),
                    },
                    {
                        path: "notes/result",
                        loadComponent: () =>
                            import("./zelf-keys/zelf-keys-notes/zelf-keys-note-result/zelf-keys-note-result.component").then(
                                (m) => m.ZelfKeysNoteResultComponent
                            ),
                        canActivate: [ZelfKeysResultGuard],
                    },
                    {
                        path: "notes/detail",
                        loadComponent: () =>
                            import("./zelf-keys/zelf-keys-notes/zelf-keys-note-detail/zelf-keys-note-detail.component").then(
                                (m) => m.ZelfKeysNoteDetailComponent
                            ),
                        canActivate: [ZelfKeysNoteGuard],
                    },
                    {
                        path: "payment-cards",
                        loadComponent: () =>
                            import("./zelf-keys/zelf-keys-payment-cards/zelf-keys-payment-cards.component").then(
                                (m) => m.ZelfKeysPaymentCardsComponent
                            ),
                    },
                    {
                        path: "payment-cards/new",
                        loadComponent: () =>
                            import("./zelf-keys/zelf-keys-payment-cards/zelf-keys-payment-card-form/zelf-keys-payment-card-form.component").then(
                                (m) => m.ZelfKeysPaymentCardFormComponent
                            ),
                    },
                    {
                        path: "payment-cards/result",
                        loadComponent: () =>
                            import("./zelf-keys/zelf-keys-payment-cards/zelf-keys-payment-card-result/zelf-keys-payment-card-result.component").then(
                                (m) => m.ZelfKeysPaymentCardResultComponent
                            ),
                        canActivate: [ZelfKeysResultGuard],
                    },
                    {
                        path: "payment-cards/detail",
                        loadComponent: () =>
                            import("./zelf-keys/zelf-keys-payment-cards/zelf-keys-payment-card-detail/zelf-keys-payment-card-detail.component").then(
                                (m) => m.ZelfKeysPaymentCardDetailComponent
                            ),
                        canActivate: [ZelfKeysPaymentCardGuard],
                    },
                    {
                        path: "billing",
                        loadComponent: () =>
                            import("./zelf-keys/zelf-keys-billing/zelf-keys-billing.component").then((m) => m.ZelfKeysBillingComponent),
                    },
                ],
            },
        ],
    },
    {
        path: "popout-decryptor",
        loadComponent: () => import("./popout-decryptor/popout-decryptor.component").then((m) => m.PopoutDecryptorComponent),
        canActivate: [PopoutOnlyGuard],
    },
    {
        path: "session-error",
        loadComponent: () => import("./session-error/session-error.component").then((m) => m.SessionErrorComponent),
    },
    {
        path: "external-link",
        data: { externalUrl: `${environment.paymentDomainUrl}/portfolio/payment` },
        canActivate: [ExternalRedirectGuard],
    },
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
