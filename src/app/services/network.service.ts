import { Injectable } from "@angular/core";
import { ChromeService } from "app/chrome.service";

export type NetworkName = "ethereum" | "sui" | "avalanche" | "solana" | "bitcoin";
export type NetworkSymbol = "ETH" | "SUI" | "AVAX" | "SOL" | "BTC";

@Injectable({
    providedIn: "root",
})
export class NetworkService {
    constructor(private _chromeService: ChromeService) {}

    getNetworkSymbol(network: string): string {
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

    getNetworkName(network: NetworkSymbol): NetworkName | "" {
        switch (network) {
            case "ETH":
                return "ethereum";
            case "SUI":
                return "sui";
            case "AVAX":
                return "avalanche";
            case "SOL":
                return "solana";
            default:
                return "";
        }
    }

    async getNetworkToken(network: NetworkName): Promise<any> {
        const tokens = await this._chromeService.getItemSession("tokens");

        if (!tokens || !tokens.length) return null;

        return tokens.find((token: any) => token.name.toLowerCase() === network);
    }

    getChainId(network: string): number {
        switch (network.toLowerCase()) {
            case "ethereum":
                return 1;
            case "avalanche":
                return 43114;
            case "solana":
                return 1399811149;
            case "sui":
                return 784;
            default:
                return 1;
        }
    }

    getNetworkImage(network: NetworkName | NetworkSymbol): string {
        switch (network) {
            case "ethereum":
            case "ETH":
                return "./assets/networks/eth.png";
            case "sui":
            case "SUI":
                return "./assets/networks/sui.png";
            case "avalanche":
            case "AVAX":
                return "./assets/networks/avax.png";
            case "solana":
            case "SOL":
                return "./assets/networks/sol.png";
            case "bitcoin":
            case "BTC":
                return "./assets/networks/btc.png";
            default:
                return "";
        }
    }
}
