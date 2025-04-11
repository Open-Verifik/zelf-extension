import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { JWTInterceptor } from "./JWT.interceptor";

export const HttpInterceptorProviders = [{ provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true }];
