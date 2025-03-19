import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { ChromeService } from "./chrome.service";

declare var grecaptcha: any;

@Injectable({
    providedIn: "root",
})
export class CaptchaService {
    captchaToken: string = "";

    constructor(private _chromeService: ChromeService) {}

    executeRecaptcha(action: string): Promise<string> {
        if (this._chromeService.isExtension) return Promise.resolve("");

        return new Promise((resolve, reject) => {
            if (typeof grecaptcha !== "undefined") {
                grecaptcha.enterprise.ready(() => {
                    grecaptcha.enterprise
                        .execute(environment?.captchaKey, { action })
                        .then((token: string) => resolve(token))
                        .catch((err: any) => reject(err));
                });
            } else {
                reject("reCAPTCHA not loaded");
            }
        });
    }

    retainCaptchaToken(token: string): void {
        this.captchaToken = token;
    }

    getCaptchaToken() {
        return this.captchaToken;
    }
}
