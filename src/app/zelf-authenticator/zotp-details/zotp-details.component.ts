import { CommonModule, DecimalPipe, NgIf } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { TranslocoModule } from "@jsverse/transloco";
import { ZOTP } from "app/models/zotp.model";

export interface ZOTPDetailsData {
    zotp: ZOTP;
}

@Component({
    imports: [CommonModule, DecimalPipe, MatButtonModule, MatDialogModule, NgIf, TranslocoModule],
    selector: "zotp-details",
    styleUrls: ["./zotp-details.component.scss"],
    templateUrl: "./zotp-details.component.html",
})
export class ZotpDetailsComponent {
    zotp: ZOTP;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ZOTPDetailsData,
        public dialogRef: MatDialogRef<ZotpDetailsComponent>
    ) {
        this.zotp = data.zotp;
    }

    close(): void {
        this.dialogRef.close();
    }

    get publicData(): any {
        return this.zotp.ipfs?.publicData || {};
    }

    get ipfsData(): any {
        return this.zotp.ipfs || {};
    }

    get walrusData(): any {
        // If we have full Walrus data, use it
        if (this.zotp.walrus) {
            return this.zotp.walrus;
        }

        // Otherwise, try to reconstruct from IPFS publicData
        const blobId = this.zotp.ipfs?.publicData?.walrus;
        if (blobId && typeof blobId === "string") {
            return {
                success: true,
                blobId: blobId,
                publicUrl: `https://walrus-mainnet.mystenlabs.com/${blobId}`,
                explorerUrl: `https://walruscan.com/mainnet/blob/${blobId}`,
            };
        }

        return {};
    }

    formatDate(dateString: string | undefined): string {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleString();
        } catch {
            return dateString;
        }
    }
}
