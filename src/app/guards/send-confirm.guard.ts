import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { TransactionService } from "app/transaction.service";

export const SendConfirmGuard: CanActivateFn = async () => {
    const _transactionService = inject(TransactionService);
    const router = inject(Router);

    const transactionData = await _transactionService.getCurrentTransactionData();

    if (!transactionData.hasReceiver || !transactionData.hasAmount) {
        router.navigate(["/send/transaction"], { replaceUrl: true });

        return false;
    }

    return true;
};
