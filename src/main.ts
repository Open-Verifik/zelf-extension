import "@angular/compiler";

import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

if (Storage?.prototype?.setItem && Proxy && Reflect && CustomEvent) {
    Storage.prototype.setItem = new Proxy(Storage.prototype.setItem, {
        apply(target, thisArg, argumentList) {
            const event = new CustomEvent("localstorage", {
                detail: {
                    key: argumentList[0],
                    oldValue: thisArg.getItem(argumentList[0]),
                    newValue: argumentList[1],
                },
            });

            window.dispatchEvent(event);

            return Reflect.apply(target, thisArg, argumentList);
        },
    });
}

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
