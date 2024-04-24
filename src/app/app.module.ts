import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { CreateWalletComponent } from './create-wallet/create-wallet.component';
import { ImportWalletTraditionalComponent } from './import-wallet-traditional/import-wallet-traditional.component';
import { ImportWalletComponent } from './import-wallet/import-wallet.component';
import { BiometricsVerificationComponent } from './biometrics-verification/biometrics-verification.component';
import { HeaderComponent } from './header/header.component';
import { LanguagePickerComponent } from './language-picker/language-picker.component';
import { TransactionAuthComponent } from './transaction-auth/transaction-auth.component';
import { UnlockWalletComponent } from './unlock-wallet/unlock-wallet.component';

@NgModule({
	declarations: [AppComponent, HomeComponent, AboutComponent, OnboardingComponent, CreateWalletComponent, ImportWalletTraditionalComponent, ImportWalletComponent, BiometricsVerificationComponent, HeaderComponent, LanguagePickerComponent, TransactionAuthComponent, UnlockWalletComponent],
	imports: [BrowserModule, AppRoutingModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
