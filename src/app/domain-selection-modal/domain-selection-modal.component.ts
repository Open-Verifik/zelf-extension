import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatRadioModule } from "@angular/material/radio";
import { FormsModule } from "@angular/forms";

import { DomainLicense } from "app/core/models/domain.type";

export interface DomainSelectionData {
    domains: DomainLicense[];
    selectedDomain: string;
}

@Component({
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatRadioModule, FormsModule],
    selector: "domain-selection-modal",
    standalone: true,
    styleUrls: ["./domain-selection-modal.component.scss"],
    templateUrl: "./domain-selection-modal.component.html",
})
export class DomainSelectionModalComponent {
    selectedDomain: string;

    constructor(
        public dialogRef: MatDialogRef<DomainSelectionModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DomainSelectionData
    ) {
        this.selectedDomain = data.selectedDomain;
    }

    onConfirm(): void {
        this.dialogRef.close(this.selectedDomain);
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    getDomainIcon(domainName: string): string {
        const iconMap: { [key: string]: string } = {
            zelf: "assets/icons/zelf_logo.svg",
            avax: "assets/icons/avax_logo.svg",
            bdag: "assets/icons/bdag_logo.png",
            eth: "assets/icons/eth-icon.svg",
            sol: "assets/icons/sol-icon.svg",
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
