import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { OnboardingComponent } from "./onboarding/onboarding.component";
import { CreateWalletComponent } from "./create-wallet/create-wallet.component";
import { ImportWalletTraditionalComponent } from "./import-wallet-traditional/import-wallet-traditional.component";
import { ImportWalletComponent } from "./import-wallet/import-wallet.component";
import { BiometricsVerificationComponent } from "./biometrics-verification/biometrics-verification.component";
import { HeaderComponent } from "./header/header.component";
import { LanguagePickerComponent } from "./language-picker/language-picker.component";
import { TransactionAuthComponent } from "./transaction-auth/transaction-auth.component";
import { UnlockWalletComponent } from "./unlock-wallet/unlock-wallet.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { CommonModule } from "@angular/common";
import { TranslocoModule } from "@ngneat/transloco";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { HttpClientModule } from "@angular/common/http";
import { TranslocoRootModule } from "./transloco-root.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; // Use BrowserAnimationsModule for testing

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		AboutComponent,
		OnboardingComponent,
		CreateWalletComponent,
		ImportWalletTraditionalComponent,
		ImportWalletComponent,
		BiometricsVerificationComponent,
		HeaderComponent,
		LanguagePickerComponent,
		TransactionAuthComponent,
		UnlockWalletComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FlexLayoutModule,
		CommonModule,
		TranslocoModule,
		MatButtonModule,
		MatMenuModule,
		HttpClientModule,
		TranslocoRootModule,
		NoopAnimationsModule,
		BrowserAnimationsModule, // Ensure animations are enabled for testing
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
