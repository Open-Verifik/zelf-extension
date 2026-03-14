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

    getDomainIcon(domain: DomainLicense): string {
        const logoUrl = domain.metadata?.logo || (domain as any).logo;
        if (logoUrl && (logoUrl.startsWith("http://") || logoUrl.startsWith("https://"))) {
            return logoUrl;
        }

        const iconMap: { [key: string]: string } = {
            zelf: "assets/icons/zelf_logo.svg",
            avax: "assets/icons/avax_logo.svg",
            bdag: "assets/icons/bdag_logo.png",
            eth: "assets/icons/eth-icon.svg",
            sol: "assets/icons/sol-icon.svg",
            sui: "assets/icons/sui_logo.svg",
            wal: "assets/icons/walrus_logo.png",
        };

        return iconMap[domain.name] || "assets/icons/zelf_logo.svg";
    }
}
