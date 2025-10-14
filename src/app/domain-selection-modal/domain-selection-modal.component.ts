import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatRadioModule } from "@angular/material/radio";
import { FormsModule } from "@angular/forms";
import { DomainConfig } from "../domain.service";

export interface DomainSelectionData {
    domains: DomainConfig[];
    selectedDomain: string;
}

@Component({
    selector: "domain-selection-modal",
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatRadioModule, FormsModule],
    templateUrl: "./domain-selection-modal.component.html",
    styleUrls: ["./domain-selection-modal.component.scss"],
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
        // First check if domain config has an icon/metadata with logo
        const domain = this.data.domains.find((d) => d.name === domainName);

        // If domain config has a logo URL, use it
        if (domain?.metadata?.logo) {
            return domain.metadata.logo;
        }

        // Otherwise, use local assets
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
        // Return appropriate background color based on domain
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
