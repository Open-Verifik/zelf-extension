import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { Router } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

import { MnemonicComponent } from "app/mnemonic/mnemonic.component";
import { TagModel, TagsService } from "app/tags.service";

export interface WalletSeedPhraseSheetData {
    wallet?: Partial<TagModel>;
}

@Component({
    selector: "wallet-seed-phrase-sheet",
    imports: [CommonModule, TranslocoModule, MatButtonModule, MnemonicComponent],
    styleUrls: ["./wallet-seed-phrase-sheet.component.scss"],
    templateUrl: "./wallet-seed-phrase-sheet.component.html",
})
export class WalletSeedPhraseSheetComponent {
    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: WalletSeedPhraseSheetData,
        private _bottomSheetRef: MatBottomSheetRef<WalletSeedPhraseSheetComponent>,
        private _router: Router,
        private _tagsService: TagsService
    ) {}

    cancel(): void {
        this._bottomSheetRef.dismiss();
    }

    async onMnemonicRedirect(): Promise<void> {
        this._bottomSheetRef.dismiss();

        await this._tagsService.setFlow("unlock");

        await this._tagsService.setTagName(this.data?.wallet?.name as string);

        await this._router.navigate(["/security/biometrics"], { queryParams: { return: "/wallet-manage" } });
    }
}
