import { NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { Router, RouterLink } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";

import { BlockdagNftService } from "app/services/blockdag-nft.service";
import { BlockdagManualNftsService } from "app/services/blockdag-manual-nfts.service";

@Component({
    imports: [MatButtonModule, MatFormFieldModule, MatInputModule, NgIf, ReactiveFormsModule, RouterLink, TranslocoModule],
    selector: "nft-import",
    styleUrls: ["./nft-import.component.scss"],
    templateUrl: "./nft-import.component.html",
})
export class NftImportComponent {
    private readonly _fb = inject(FormBuilder);
    readonly form = this._fb.group({
        contract: ["", [Validators.required, Validators.pattern(/^0x[a-fA-F0-9]{40}$/)]],
        tokenId: ["", [Validators.required, Validators.pattern(/^\d+$/)]],
    });

    submitting = false;
    apiError = "";

    constructor(
        private _nft: BlockdagNftService,
        private _manual: BlockdagManualNftsService,
        private _router: Router,
        private _transloco: TranslocoService,
        private _cdr: ChangeDetectorRef
    ) {}

    async submit(): Promise<void> {
        this.apiError = "";
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const contract = this.form.value.contract!.trim();
        const tokenId = this.form.value.tokenId!.trim();

        this.submitting = true;
        this._cdr.markForCheck();

        try {
            await this._nft.getNftByContractAndToken(contract, tokenId);
        } catch {
            /* MetaMask-style: still save so user can retry / indexer lag */
        }

        try {
            await this._manual.add(contract, tokenId);
        } catch (e) {
            console.error(e);
            this.apiError = this._transloco.translate("home.nft_import_save_error");
            this.submitting = false;
            this._cdr.markForCheck();
            return;
        }

        const routeId = `${contract.toLowerCase()}_${tokenId}`;
        await this._router.navigate(["/nft-asset", routeId]);
    }
}
