import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class NetworkService {
    constructor() {}

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
}
