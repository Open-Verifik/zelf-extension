import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { PaymentCardDataService } from "../services/payment-card-data.service";

export const ZelfKeysPaymentCardGuard: () => boolean = () => {
    const _paymentCardDataService = inject(PaymentCardDataService);
    const _router = inject(Router);

    const currentPaymentCard = _paymentCardDataService.getCurrentPaymentCard();

    if (!currentPaymentCard) {
        _router.navigate(["/zelf-keys/vault"]);
        return false;
    }

    return true;
};
