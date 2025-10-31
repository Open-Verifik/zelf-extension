import { Component, Inject } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { Router } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import { environment } from "environments/environment";

@Component({
    imports: [TranslocoModule, MatButtonModule],
    selector: "reserve-done-sheet",
    styleUrls: ["./reserve-done-sheet.component.scss"],
    templateUrl: "./reserve-done-sheet.component.html",
})
export class ReserveDoneSheetComponent {
    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
        private _bottomSheetRef: MatBottomSheetRef<ReserveDoneSheetComponent>,
        private _router: Router
    ) {}

    goToWelcomeComplete(): void {
        this._router.navigate(["/welcome/complete"]);

        this._bottomSheetRef.dismiss();
    }

    async purchaseNow(): Promise<void> {
        const name = this.data?.zelfName || "";
        const domain = this.data?.domain || "zelf";
        const duration = 1;

        await this._router.navigate([
            "/external-link",
            {
                extraParams: {
                    externalUrl: `${environment.paymentDomainUrl}/portfolio/payment?tagname=${name}&domain=${domain}&duration=${duration}`,
                },
            },
        ]);

        this.goToWelcomeComplete();
    }
}
