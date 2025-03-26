import { inject } from "@angular/core";
import { Router, type CanActivateFn } from "@angular/router";
import { TransactionService } from "app/transaction.service";

export const SendTransactionGuard: CanActivateFn = (route, state) => {
    const _transactionService = inject(TransactionService);
    const _router = inject(Router);

    if (!_transactionService.fromAddress || !_transactionService.token) {
        _router.navigate(["/send"]);

        return false;
    }

    return true;
};
