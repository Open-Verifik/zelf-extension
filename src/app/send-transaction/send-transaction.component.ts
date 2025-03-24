import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { Network, RecentAddress, TransactionService } from "app/transaction.service";
import { WalletService } from "app/wallet.service";

@Component({
    imports: [CommonModule, MatButtonModule, RouterModule, ReactiveFormsModule, TranslocoModule, MatProgressSpinnerModule],
    selector: "send-transaction",
    standalone: true,
    styleUrls: ["./send-transaction.component.scss"],
    templateUrl: "./send-transaction.component.html",
})
export class SendTransactionComponent {
    balance: number = 0;
    form!: UntypedFormGroup;
    fromAddress: string = "";
    network: Network = "";
    recentAddresses: RecentAddress[] = [];
    searching: boolean = false;
    withdrawStep: boolean = false;

    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _transactionService: TransactionService,
        private _walletService: WalletService
    ) {
        this._transactionService.toAddress = "";
        this._transactionService.withdrawalAmount = 0;

        this.balance = this._transactionService.fromBalance;
        this.fromAddress = this._transactionService.fromAddress;
        this.network = this._transactionService.network;
        this.recentAddresses = this._transactionService.findRecentAddressesByCurrentNetwork();

        this._initForm();
    }

    private _getAddressPattern(): RegExp {
        let pattern: RegExp = /.*/;

        if (this.network === "Ethereum") pattern = this._walletService.ETHRegex;
        if (this.network === "Solana") pattern = this._walletService.SOLRegex;
        if (this.network === "Bitcoin") pattern = this._walletService.BTCRegex;

        return pattern;
    }

    private _greaterThanValidator(minValue: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            return value > minValue ? null : { greaterThan: { requiredValue: minValue, actualValue: value } };
        };
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            amount: [
                0,
                [Validators.required, Validators.min(0), Validators.max(this._transactionService.fromBalance), this._greaterThanValidator(0)],
            ],
            toAddress: ["", [Validators.required]],
        });
    }

    continueToConfirmation(): void {
        // if (this.form.invalid) return;

        this._transactionService.toAddress = this.form.get("toAddress")?.value;
        this._transactionService.withdrawalAmount = this.form.get("amount")?.value;

        this._router.navigate(["/send/confirmation"]);
    }

    async pastedAddress(event: ClipboardEvent): Promise<void> {
        if (this.searching) return;

        const query = event.clipboardData?.getData("text");

        if (!query) return;

        const pattern = this._getAddressPattern();

        if (!pattern.test(query)) return;

        this.form.get("toAddress")?.patchValue(query, { emitEvent: false });
    }

    setToInput(address: RecentAddress) {
        this.form.get("toAddress")?.patchValue(address, { emitEvent: false });
    }

    withdrawAll(): void {
        this.form.get("amount")?.patchValue(this.balance, { emitEvent: false });
    }
}
