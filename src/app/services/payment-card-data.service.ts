import { Injectable } from "@angular/core";
import { PaymentCardItem } from "../models/zelf-key-item.model";

@Injectable({
    providedIn: "root",
})
export class PaymentCardDataService {
    private _currentPaymentCard: PaymentCardItem | null = null;

    setCurrentPaymentCard(paymentCard: PaymentCardItem): void {
        this._currentPaymentCard = paymentCard;
    }

    getCurrentPaymentCard(): PaymentCardItem | null {
        return this._currentPaymentCard;
    }

    clearCurrentPaymentCard(): void {
        this._currentPaymentCard = null;
    }
}
