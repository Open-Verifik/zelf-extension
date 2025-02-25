import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { TranslocoModule } from "@ngneat/transloco";
import { MnemonicComponent } from "../mnemonic/mnemonic.component";
import { Wallet } from "app/wallet";

@Component({
    selector: "private-key",
    standalone: true,
    imports: [CommonModule, TranslocoModule, MnemonicComponent],
    templateUrl: "./private-key.component.html",
    styleUrls: ["./private-key.component.scss"],
})
export class PrivateKeyComponent {
    blurMnemonic: boolean = false;
    wallet: Wallet;

    constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private _bottomSheetRef: MatBottomSheetRef<PrivateKeyComponent>) {
        this.wallet = data.wallet;
    }

    close(): void {
        this._bottomSheetRef.dismiss();
    }
}
