import { Injectable } from "@angular/core";
import { ChromeService } from "app/chrome.service";

export type NetworkName = "ethereum" | "sui" | "avalanche" | "solana" | "bitcoin" | "binance" | "polygon" | "Bitcoin" | "bitcoinTestnet";
export type NetworkSymbol =
    | "eth"
    | "sol"
    | "avax"
    | "sui"
    | "btc"
    | "bnb"
    | "polygon"
    | "ETH"
    | "SOL"
    | "AVAX"
    | "SUI"
    | "BTC"
    | "BNB"
    | "POL"
    | "BTCTEST";

@Injectable({
    providedIn: "root",
})
export class NetworkService {
    constructor(private _chromeService: ChromeService) {}

    getNetworkSymbol(network: NetworkName): string {
        switch (network) {
            case "ethereum":
                return "ETH";
            case "sui":
                return "SUI";
            case "polygon":
                return "POL";
            case "avalanche":
                return "AVAX";
            case "bitcoin":
                return "BTC";
            case "binance":
                return "BNB";
            case "solana":
                return "SOL";
            default:
                return "";
        }
    }

    getNetworkName(symbol: NetworkSymbol | string): NetworkName | string {
        if (!symbol) return "";

        const upperSymbol = symbol.toUpperCase();

        switch (upperSymbol) {
            case "ETH":
                return "ethereum";
            case "SOL":
                return "solana";
            case "AVAX":
                return "avalanche";
            case "SUI":
                return "sui";
            case "BTC":
                return "bitcoin";
            case "BNB":
                return "binance";
            case "POL":
                return "polygon";
            default:
                console.warn(`NetworkService: No name mapping for symbol: ${symbol}`);
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
            case "polygon":
                return 137;
            case "bitcoin":
                return 0;
            case "binance":
                return 56;
            default:
                return 1;
        }
    }

    getNetworkImage(network: NetworkName | string): string {
        switch (network) {
            case "ethereum":
            case "ETH":
                return "./assets/networks/eth.png";
            case "sui":
            case "SUI":
                return "./assets/networks/sui.svg";
            case "avalanche":
            case "AVAX":
                return "./assets/networks/avax.png";
            case "solana":
            case "SOL":
                return "./assets/networks/sol.svg";
            case "bitcoin":
            case "BTC":
                return "./assets/networks/btc.png";
            case "binance":
            case "BNB":
                return "./assets/networks/bnb.png";
            case "polygon":
            case "POL":
                return "./assets/networks/pol.png";
            default:
                return "";
        }
    }
}
