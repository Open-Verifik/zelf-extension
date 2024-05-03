import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { OnboardingComponent } from "./onboarding/onboarding.component";
import { CreateWalletComponent } from "./create-wallet/create-wallet.component";

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
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
