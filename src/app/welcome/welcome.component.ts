import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";

import { LanguageComponent } from "app/language/language.component";

@Component({
    selector: "welcome",
    standalone: true,
    imports: [CommonModule, RouterModule, LanguageComponent, TranslocoModule, RouterModule],
    templateUrl: "./welcome.component.html",
    styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent {
    links = {
        documentation: "https://docs.zelf.world/",
        invest: "https://www.pinksale.finance/solana/launchpad/HUCo6xdcGSpiDQxhrN8emvLwnkJAAdJbcACncMnU9MmF",
        termsAndConditions: "https://docs.zelf.world/zelf-legal/terms-of-use",
        privacy: "https://docs.zelf.world/zelf-legal/privacy-policy",
        pricing: "https://docs.zelf.world/airdrop/pricing-per-domain",
    };
}
