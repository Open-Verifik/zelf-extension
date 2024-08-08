import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { OnboardingComponent } from "./onboarding/onboarding.component";
import { CreateWalletComponent } from "./create-wallet/create-wallet.component";
import { ExtensionInstructionsComponent } from "./extension-instructions/extension-instructions.component";
import { ImportWalletComponent } from "./import-wallet/import-wallet.component";
import { UnlockWalletComponent } from "./unlock-wallet/unlock-wallet.component";
import { SendTransactionComponent } from "./send-transaction/send-transaction.component";
import { SendTransactionPreviewComponent } from "./send-transaction/send-transaction-preview/send-transaction-preview.component";
import { SendTransactionConfirmationComponent } from "./send-transaction/send-transaction-confirmation/send-transaction-confirmation.component";
import { SendTransactionBridgeComponent } from "./send-transaction/send-transaction-bridge/send-transaction-bridge.component";

const routes: Routes = [
	{ path: "", redirectTo: "/home", pathMatch: "full" }, // Redirect default route to Home
	{ path: "home", component: HomeComponent }, // Home route
	{ path: "about", component: AboutComponent }, // About route
	{
		path: "onboarding",
		component: OnboardingComponent,
	},
	{
		path: "create-wallet",
		component: CreateWalletComponent,
	},
	{
		path: "import-wallet",
		component: ImportWalletComponent,
	},
	{
		path: "find-wallet",
		component: UnlockWalletComponent,
	},
	{
		path: "extension-instructions",
		component: ExtensionInstructionsComponent,
	},
	{
		path: "send-transaction",
		component: SendTransactionComponent,
	},
	{
		path: "send-transaction-preview",
		component: SendTransactionPreviewComponent,
	},
	{
		path: "send-transaction-confirm",
		component: SendTransactionConfirmationComponent,
	},
	{
		path: "send-transaction-bridge",
		component: SendTransactionBridgeComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
