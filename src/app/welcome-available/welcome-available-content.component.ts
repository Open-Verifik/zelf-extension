import { CommonModule } from "@angular/common";
import { Component, Input, OnDestroy, Output, EventEmitter } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TranslocoModule } from "@jsverse/transloco";

@Component({
    imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule, TranslocoModule, MatButtonModule],
    selector: "welcome-available-content",
    styleUrls: ["./welcome-available-content.component.scss"],
    templateUrl: "./welcome-available-content.component.html",
})
export class WelcomeAvailableContentComponent implements OnDestroy {
    private _invalidTimeout!: ReturnType<typeof setTimeout>;

    @Input() form!: FormGroup;
    @Input() loading: boolean = false;
    @Input() loadingReferral: boolean = false;
    @Input() invalidReferral: boolean = false;
    @Input() zelfNameObject: any;

    @Output() searchZelfName = new EventEmitter<any>();
    @Output() expandReferralChange = new EventEmitter<void>();
    @Output() clearInvalidReferralEvent = new EventEmitter<void>();
    @Output() sanitizeZelfNameEvent = new EventEmitter<void>();

    referralExpanded: boolean = false;

    constructor() {}

    ngOnDestroy(): void {
        clearTimeout(this._invalidTimeout);
    }

    expandReferral(): void {
        this.referralExpanded = !this.referralExpanded;
    }

    clearInvalidReferral(): void {
        this.clearInvalidReferralEvent.emit();
    }

    sanitizeZelfName(): void {
        this.sanitizeZelfNameEvent.emit();
    }

    onSearchZelfName(event: any): void {
        this.searchZelfName.emit(event);
    }
}
