import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatStepperModule } from "@angular/material/stepper";

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Router } from "@angular/router";

import { environment } from "environments/environment";
import { WebcamModule } from "ngx-webcam";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BiometricsGeneralComponent } from "./biometrics-general/biometrics.component";
import { BiometricsVerificationComponent } from "./biometrics-verification/biometrics-verification.component";
import { BiometricsComponent } from "./biometrics/biometrics.component";
import { BiometricInstructionsComponent } from "./common-steps/biometric-instructions/biometric-instructions.component";
import { PasswordStepComponent } from "./common-steps/password-step/password-step.component";
import { TranslocoRootModule } from "./core/transloco-root.module";
import { CreateWalletComponent } from "./create-wallet/create-wallet.component";
import { ViewCreatedWalletQrCodeComponent } from "./create-wallet/view-created-wallet-qr-code/view-created-wallet-qr-code.component";
import { WordsPickerStepComponent } from "./create-wallet/words-picker-step/words-picker-step.component";
import { ExtensionInstructionsComponent } from "./extension-instructions/extension-instructions.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { ActivityCardComponent } from "./home/activity-card/activity-card.component";
import { HomeActiveWalletComponent } from "./home/home-active-wallet/home-active-wallet.component";
import { HomeHeaderComponent } from "./home/home-header/home-header.component";
import { HomeWalletActivityComponent } from "./home/home-wallet-activity/home-wallet-activity.component";
import { HomeWalletAssetsComponent } from "./home/home-wallet-assets/home-wallet-assets.component";
import { HomeWalletSendAssetsComponent } from "./home/home-wallet-send-assets/home-wallet-send-assets.component";
import { HomeWalletsConnectedComponent } from "./home/home-wallets-connected/home-wallets-connected.component";
import { HomeComponent } from "./home/home.component";
import { NetworkPickerComponent } from "./home/network-picker/network-picker.component";
import { NftCardComponent } from "./home/nft-card/nft-card.component";
import { TokenCardComponent } from "./home/token-card/token-card.component";
import { ImportWalletTraditionalComponent } from "./import-wallet-traditional/import-wallet-traditional.component";
import { ImportPhraseStepComponent } from "./import-wallet/import-phrase-step/import-phrase-step.component";
import { ImportQrCodeStepComponent } from "./import-wallet/import-qr-code-step/import-qr-code-step.component";
import { ImportWalletComponent } from "./import-wallet/import-wallet.component";
import { LanguagePickerComponent } from "./language-picker/language-picker.component";
import { LoaderComponent } from "./loader/loader.component";
import { NewNameCardComponent } from "./new-name-card/new-name-card.component";
import { NewZelfNameComponent } from "./new-zelf-name/new-zelf-name.component";
import { OnboardingComponent } from "./onboarding/onboarding.component";
import { DiscountPipe } from "./pipes/discount.pipe";
import { SendTransactionBridgeComponent } from "./send-transaction/send-transaction-bridge/send-transaction-bridge.component";
import { SendTransactionConfirmationComponent } from "./send-transaction/send-transaction-confirmation/send-transaction-confirmation.component";
import { SendTransactionPreviewComponent } from "./send-transaction/send-transaction-preview/send-transaction-preview.component";
import { SendTransactionComponent } from "./send-transaction/send-transaction.component";
import { StSearchWalletComponent } from "./send-transaction/st-search-wallet/st-search-wallet.component";
import { StepComponent } from "./step/step.component";
import { StepperComponent } from "./stepper/stepper.component";
import { TransactionAuthComponent } from "./transaction-auth/transaction-auth.component";
import { TransactionDetailsComponent } from "./transaction-details/transaction-details.component";
import { UnlockWalletComponent } from "./unlock-wallet/unlock-wallet.component";
import { UwPasswordStepComponent } from "./unlock-wallet/uw-password-step/uw-password-step.component";
import { UwSearchWalletComponent } from "./unlock-wallet/uw-search-wallet/uw-search-wallet.component";
import { WalletCardComponent } from "./wallet-common/wallet-card/wallet-card.component";

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		OnboardingComponent,
		CreateWalletComponent,
		ImportWalletTraditionalComponent,
		ImportWalletComponent,
		BiometricsVerificationComponent,
		HeaderComponent,
		LanguagePickerComponent,
		TransactionAuthComponent,
		UnlockWalletComponent,
		FooterComponent,
		StepperComponent,
		StepComponent,
		ExtensionInstructionsComponent,
		SendTransactionComponent,
		ImportPhraseStepComponent,
		PasswordStepComponent,
		BiometricInstructionsComponent,
		ImportQrCodeStepComponent,
		WordsPickerStepComponent,
		ViewCreatedWalletQrCodeComponent,
		UwSearchWalletComponent,
		UwPasswordStepComponent,
		HomeWalletsConnectedComponent,
		HomeActiveWalletComponent,
		HomeWalletAssetsComponent,
		HomeWalletActivityComponent,
		HomeWalletSendAssetsComponent,
		HomeHeaderComponent,
		StSearchWalletComponent,
		LoaderComponent,
		WalletCardComponent,
		SendTransactionPreviewComponent,
		SendTransactionConfirmationComponent,
		SendTransactionBridgeComponent,
		ActivityCardComponent,
		TokenCardComponent,
		NftCardComponent,
		NetworkPickerComponent,
		NewZelfNameComponent,
		TransactionDetailsComponent,
		NewNameCardComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FlexLayoutModule,
		CommonModule,
		MatButtonModule,
		MatMenuModule,
		HttpClientModule,
		TranslocoRootModule,
		NoopAnimationsModule,
		BrowserAnimationsModule, // Ensure animations are enabled for testing
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatSelectModule,
		BiometricsComponent,
		BiometricsGeneralComponent,
		WebcamModule,
		MatBottomSheetModule,
		MatCardModule,
		MatIconModule,
		MatCheckboxModule,
		MatStepperModule,
		MatInputModule,
		MatSnackBarModule,
		MatDividerModule,
		MatProgressBarModule,
		DiscountPipe,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {
	constructor(private router: Router) {
		if (this.isMobileDevice() && environment.production) {
			this.router.navigate(["/mobile-restricted"]); // Redirect to warning page
		}
	}

	private isMobileDevice(): boolean {
		const userAgent = navigator.userAgent || navigator.vendor;
		return /android|iphone|ipad|ipod/i.test(userAgent);
	}
}
