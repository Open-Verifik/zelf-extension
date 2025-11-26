import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup } from "@angular/forms";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { TranslocoModule } from "@jsverse/transloco";

import { DomainLicense } from "app/core/models/domain.type";

export interface DomainSelectionData {
    domains: DomainLicense[];
    selectedDomain: string;
}

@Component({
    imports: [CommonModule, MatButtonModule, ReactiveFormsModule, TranslocoModule],
    selector: "domain-selection-modal",
    styleUrls: ["./domain-selection-modal.component.scss"],
    templateUrl: "./domain-selection-modal.component.html",
})
export class DomainSelectionModalComponent implements OnInit {
    domainForm!: UntypedFormGroup;

    constructor(
        public _bottomSheetRef: MatBottomSheetRef<DomainSelectionModalComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: DomainSelectionData,
        private _formBuilder: FormBuilder
    ) {}

    ngOnInit(): void {
        this._initForm();
    }

    private _initForm(): void {
        this.domainForm = this._formBuilder.group({
            selectedDomain: [this.data.selectedDomain],
        });
    }

    get selectedDomain(): string {
        return this.domainForm.get("selectedDomain")?.value || this.data.selectedDomain;
    }

    onConfirm(): void {
        const selectedDomain = this.domainForm.get("selectedDomain")?.value;

        this._bottomSheetRef.dismiss(selectedDomain);
    }

    onCancel(): void {
        this._bottomSheetRef.dismiss();
    }

    getDomainIcon(domainName: string): string {
        const iconMap: { [key: string]: string } = {
            zelf: "assets/icons/zelf_logo.svg",
            avax: "assets/icons/avax_logo.svg",
            bdag: "assets/icons/bdag_logo.png",
            eth: "assets/icons/eth-icon.svg",
            sol: "assets/icons/sol-icon.svg",
            sui: "assets/icons/sui_logo.svg",
            wal: "assets/icons/walrus_logo.jpg",
        };

        return iconMap[domainName] || "assets/icons/default-icon.svg";
    }

    getDomainIconBackground(domainName: string): string {
        const bgMap: { [key: string]: string } = {
            zelf: "#181818",
            avax: "#E84142",
            bdag: "#030C43",
            eth: "#627EEA",
            sol: "#F5F2FF",
        };

        return bgMap[domainName] || "#181818";
    }
}
