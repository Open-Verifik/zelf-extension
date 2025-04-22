import { NgIf } from "@angular/common";
import { Component, Inject, OnDestroy } from "@angular/core";
import { AbstractControl, FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { TranslocoModule } from "@ngneat/transloco";
import { Subject, takeUntil } from "rxjs";

export interface SlippageSheetData {
    commission: number;
    commissionToggle: string;
    network: string;
    slippage: number;
    slippageToggle: string;
}

@Component({
    imports: [NgIf, ReactiveFormsModule, MatButtonModule, TranslocoModule],
    selector: "slippage-sheet",
    standalone: true,
    styleUrls: ["./slippage-sheet.component.scss"],
    templateUrl: "./slippage-sheet.component.html",
})
export class SlippageSheetComponent implements OnDestroy {
    private unsubscriber$: Subject<void> = new Subject<void>();

    form!: UntypedFormGroup;

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: SlippageSheetData,
        private _formBuilder: FormBuilder,
        private _bottomSheetRef: MatBottomSheetRef<SlippageSheetComponent>
    ) {
        this._initForm();
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            commission: [this.data.commission || 0.1, [Validators.min(0), this._requiredIfManual("commissionToggle")]],
            commissionToggle: [this.data.commissionToggle || "automatic", [Validators.required]],
            slippage: [this.data.slippage || 0.5, [Validators.required, Validators.min(0), Validators.max(100)]],
            slippageToggle: [this.data.slippageToggle || "automatic", [this._requiredIfManual("slippageToggle")]],
        });

        this.form
            .get("commissionToggle")
            ?.valueChanges.pipe(takeUntil(this.unsubscriber$))
            .subscribe(() => {
                this.form.get("commission")?.updateValueAndValidity();
            });

        this.form
            .get("slippageToggle")
            ?.valueChanges.pipe(takeUntil(this.unsubscriber$))
            .subscribe(() => {
                this.form.get("slippage")?.updateValueAndValidity();
            });
    }

    private _requiredIfManual = (formControlName: string) => {
        return (control: AbstractControl) => {
            const toggle = this.form?.get(formControlName)?.value;

            if (toggle === "manual") return Validators.required(control);

            return null;
        };
    };

    async confirm(): Promise<void> {
        if (!this.form.valid || this.form.pristine) return;

        this._bottomSheetRef.dismiss(this.form.value);
    }

    close(): void {
        this._bottomSheetRef.dismiss();
    }
}
