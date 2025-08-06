import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { CtaSheetComponent } from "../../cta-sheet/cta-sheet.component";
import { WalletModel } from "app/wallet";

@Component({
    selector: "sheet-test",
    imports: [CommonModule, MatButtonModule],
    template: `
        <div class="cta-sheet-test-container">
            <h1>Bottom Sheet Test</h1>
            <button id="open-cta-sheet" (click)="openCTASheet()">CTA Sheet</button>
        </div>
    `,
    styles: [
        `
            .cta-sheet-test-container {
                padding: 20px;
                text-align: center;
            }

            button {
                padding: 10px 20px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
        `,
    ],
    styleUrls: ["../../main.scss"],
})
export class SheetTestComponent {
    constructor(private _bottomSheet: MatBottomSheet) {}

    openCTASheet(): void {
        const expiresAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString();
        const registeredAt = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

        let mockWalletData: Partial<WalletModel> = {};

        if (window.localStorage.getItem("e2e-test-wallet")) {
            mockWalletData = JSON.parse(window.localStorage.getItem("e2e-test-wallet") as string);
        } else {
            mockWalletData = {
                publicData: {
                    _id: "test-wallet-id",
                    btcAddress: "mock-btc-address",
                    ethAddress: "mock-eth-address",
                    expiresAt: expiresAt,
                    gracePeriod: null,
                    isExpired: false,
                    isExpiringSoon: true,
                    isFullyExpired: false,
                    isInGracePeriod: false,
                    origin: "online",
                    registeredAt: registeredAt,
                    solanaAddress: "mock-solana-address",
                    suiAddress: "mock-sui-address",
                    type: "mainnet",
                    zelfName: "test.zelf",
                    timeLeftInGracePeriodSeconds: () => 0,
                },
            };
        }

        this._bottomSheet.open(CtaSheetComponent, {
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet",
            height: "100vh",
            maxHeight: "100vh",
            data: { wallet: mockWalletData },
        });
    }
}
