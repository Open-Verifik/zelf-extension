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

import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { HttpClientModule } from "@angular/common/http";
import { TranslocoRootModule } from "./core/transloco-root.module";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; // Use BrowserAnimationsModule for testing
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { BiometricsComponent } from "./biometrics/biometrics.component";
import { BiometricsGeneralComponent } from "./biometrics-general/biometrics.component";
import { WebcamModule } from "ngx-webcam";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FooterComponent } from "./footer/footer.component";
import { MatStepperModule } from "@angular/material/stepper";
import { StepperComponent } from "./stepper/stepper.component";
import { StepComponent } from "./step/step.component";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ExtensionInstructionsComponent } from "./extension-instructions/extension-instructions.component";
import { SendTransactionComponent } from "./send-transaction/send-transaction.component";
import { ImportPhraseStepComponent } from "./import-wallet/import-phrase-step/import-phrase-step.component";
import { PasswordStepComponent } from "./common-steps/password-step/password-step.component";
import { BiometricInstructionsComponent } from "./common-steps/biometric-instructions/biometric-instructions.component";
import { ImportQrCodeStepComponent } from "./import-wallet/import-qr-code-step/import-qr-code-step.component";
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
		FooterComponent,
		StepperComponent,
		StepComponent,
		ExtensionInstructionsComponent,
		SendTransactionComponent,
		ImportPhraseStepComponent,
		PasswordStepComponent,
		BiometricInstructionsComponent,
		ImportQrCodeStepComponent,
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
		MatCardModule,
		MatIconModule,
		MatCheckboxModule,
		MatStepperModule,
		MatInputModule,
		MatSnackBarModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
