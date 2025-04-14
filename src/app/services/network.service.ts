import { Injectable } from "@angular/core";
import { ChromeService } from "app/chrome.service";

export type NetworkName = "ethereum" | "sui" | "avalanche" | "solana";

@Injectable({
    providedIn: "root",
})
export class NetworkService {
    constructor(private _chromeService: ChromeService) {}

    getNetworkCurrency(network: string): string {
        switch (network) {
            case "ethereum":
                return "ETH";
            case "sui":
                return "SUI";
            case "tron":
                return "TRX";
            case "polygon":
                return "MATIC";
            case "avalanche":
                return "AVAX";
            case "bitcoin":
                return "BTC";
            case "solana":
                return "SOL";
            case "ripple":
                return "XRP";
            default:
                return "";
        }
    }

    async getNetworkToken(network: NetworkName): Promise<any> {
        const tokens = await this._chromeService.getItemSession("tokens");

        if (!tokens || !tokens.length) return null;

        return tokens.find((token: any) => token.name.toLowerCase() === network);
    }
}
