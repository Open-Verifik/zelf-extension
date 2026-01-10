import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslocoService } from "@jsverse/transloco";

@Component({
    imports: [CommonModule, RouterModule],
    selector: "subscription-banner",
    styleUrls: ["./subscription-banner.component.scss"],
    templateUrl: "./subscription-banner.component.html",
})
export class SubscriptionBannerComponent implements OnInit {
    @Input() title: string = "";
    @Input() description: string = "";
    @Input() route: string[] = ["/zelf-keys/billing"];

    constructor(private _translocoService: TranslocoService) {}

    ngOnInit(): void {
        if (!this.title) {
            this.title = this._translocoService.translate("zelf_keys.subscription_banner.title");
        }
        if (!this.description) {
            this.description = this._translocoService.translate("zelf_keys.subscription_banner.description");
        }
    }
}
