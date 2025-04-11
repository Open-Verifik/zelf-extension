import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "app/services/auth.service";
import { from, lastValueFrom } from "rxjs";
import { DISABLE_GLOBAL_EXCEPTION_HANDLING } from "./interceptor.model";

@Injectable()
export class JWTInterceptor implements HttpInterceptor {
    constructor(private _authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (this._ignoreErrorHandling(req)) return next.handle(req);

        return from(this.handle(req, next));
    }

    private _ignoreErrorHandling(request: HttpRequest<any>) {
        return request.context.get(DISABLE_GLOBAL_EXCEPTION_HANDLING);
    }

    async handle(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = await this._authService.checkAccessToken();

        const newReq = req.clone({
            setHeaders: {
                timeout: "20",
                Authorization: `Bearer ${authToken}`,
            },
        });

        return lastValueFrom(next.handle(newReq));
    }
}
