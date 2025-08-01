import { NgClass } from "@angular/common";
import { Component, Inject, OnDestroy, AfterViewInit, ElementRef, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from "@angular/forms";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { TranslocoModule } from "@jsverse/transloco";
import { NetworkName, NetworkService } from "app/services/network.service";
import { Subject, takeUntil } from "rxjs";

export interface SlippageSheetData {
    commission: number;
    commissionToggle: string;
    network: string;
    slippage: number;
    slippageToggle: string;
}

@Component({
    imports: [NgClass, ReactiveFormsModule, FormsModule, MatButtonModule, TranslocoModule],
    selector: "slippage-sheet",
    styleUrls: ["./slippage-sheet.component.scss"],
    templateUrl: "./slippage-sheet.component.html",
})
export class SlippageSheetComponent implements OnDestroy, AfterViewInit {
    @ViewChild("slippageSlider") slippageSlider?: ElementRef<HTMLInputElement>;

    private unsubscriber$: Subject<void> = new Subject<void>();

    form!: UntypedFormGroup;

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: SlippageSheetData,
        private _formBuilder: FormBuilder,
        private _bottomSheetRef: MatBottomSheetRef<SlippageSheetComponent>,
        private _networkService: NetworkService
    ) {
        this._initForm();
    }

    ngAfterViewInit(): void {
        this._updateRangeProgress();
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    get networkSymbol(): string {
        return this._networkService.getNetworkSymbol(this.data.network.toLowerCase() as NetworkName);
    }

    private _initForm(): void {
        this.form = this._formBuilder.group({
            commission: [this.data.commission || 0.1, [Validators.min(0), this._requiredIfManual("commissionToggle")]],
            commissionToggle: [this.data.commissionToggle || "automatic", [Validators.required]],
            slippage: [this.data.slippage || 0.5, [Validators.required, Validators.min(0), Validators.max(0.8)]],
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
                this._updateRangeProgress();
            });

        this.form
            .get("slippage")
            ?.valueChanges.pipe(takeUntil(this.unsubscriber$))
            .subscribe(() => {
                this._updateRangeProgress();
            });
    }

    private _requiredIfManual = (formControlName: string) => {
        return (control: AbstractControl) => {
            const toggle = this.form?.get(formControlName)?.value;

            if (toggle === "manual") return Validators.required(control);

            return null;
        };
    };

    private _updateRangeProgress(): void {
        requestAnimationFrame(() => {
            const slider = this.slippageSlider?.nativeElement;

            if (!slider) return;

            try {
                const value = parseFloat(this.form.get("slippage")?.value) || 0;

                const min = parseFloat(slider.min) || 0.1;
                const max = parseFloat(slider.max) || 0.8;

                if (isNaN(value) || isNaN(min) || isNaN(max)) return;

                const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

                slider.style.setProperty("--progress", `${percentage}%`);
            } catch (error) {
                console.error("Error updating range progress:", error);
            }
        });
    }

    close(): void {
        this._bottomSheetRef.dismiss();
    }

    async confirm(): Promise<void> {
        if (!this.form.valid || this.form.pristine) return;

        this._bottomSheetRef.dismiss(this.form.value);
    }

    toggleMode(controlName: string): void {
        if (!this.form) return;

        const control = this.form.get(controlName);

        if (!control) return;

        const currentValue = control.value;
        const newValue = currentValue === "automatic" ? "manual" : "automatic";

        control.setValue(newValue);

        this.form.markAsDirty();

        if (controlName === "slippageToggle") {
            requestAnimationFrame(() => this._updateRangeProgress());
        }
    }
}
