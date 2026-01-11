import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { JWTInterceptor } from "./jwt.interceptor";
import { EncryptionKeyInterceptor } from "./encryption-key.interceptor";

export const HttpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: EncryptionKeyInterceptor, multi: true },
];
