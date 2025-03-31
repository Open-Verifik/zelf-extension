import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { TransactionService } from "app/transaction.service";

export const SendTransactionGuard: CanActivateFn = () => {
    const _transactionService = inject(TransactionService);
    const router = inject(Router);

    if (!_transactionService.fromAddress || !_transactionService.token) {
        router.navigate(["/send"], { replaceUrl: true });

        return false;
    }

    return true;
};
