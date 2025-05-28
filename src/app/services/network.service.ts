import { Injectable } from "@angular/core";
import { ChromeService } from "app/chrome.service";
import { TokenData } from "app/wallet";
import { environment } from "environments/environment";

export type NetworkName = "ethereum" | "sui" | "avalanche" | "solana" | "bitcoin" | "binance" | "polygon" | "Bitcoin" | "bitcoinTestnet";
export type NetworkSymbol =
    | "eth"
    | "sol"
    | "avax"
    | "sui"
    | "btc"
    | "bsc"
    | "polygon"
    | "ETH"
    | "SOL"
    | "AVAX"
    | "SUI"
    | "BTC"
    | "BSC"
    | "POLYGON"
    | "BTCTEST";

@Injectable({
    providedIn: "root",
})
export class NetworkService {
    private readonly _networkData = {
        eth: { name: "ethereum", image: "assets/networks/eth.png", symbol: "ETH", chainId: 1, canSwap: true },
        sol: { name: "solana", image: "assets/networks/sol.png", symbol: "SOL", chainId: "SOLANA_MAINNET", canSwap: true },
        avax: { name: "avalanche", image: "assets/networks/avax.png", symbol: "AVAX", chainId: 43114, canSwap: true },
        sui: { name: "sui", image: "assets/networks/sui.png", symbol: "SUI", chainId: "SUI_MAINNET", canSwap: false },
        btc: { name: "bitcoin", image: "assets/networks/btc.png", symbol: "BTC", chainId: 0, canSwap: false },
        bsc: { name: "binance", image: "assets/networks/bsc.png", symbol: "BSC", chainId: 56, canSwap: true },
        polygon: { name: "polygon", image: "assets/networks/polygon.png", symbol: "POLYGON", chainId: 137, canSwap: true },
    };

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
            case "BSC":
                return "binance";
            case "POLYGON":
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

    getNetworkData(symbolOrName: NetworkSymbol | NetworkName | string): any {
        return undefined;
    }

    getExplorerUrl(networkNameOrSymbol: NetworkName | NetworkSymbol | string): string | undefined {
        return undefined;
    }

    getNativeTokenSymbol(networkNameOrSymbol: NetworkName | NetworkSymbol | string): string | undefined {
        return undefined;
    }

    canSwap(networkNameOrSymbol: NetworkName | NetworkSymbol | string): boolean {
        return false;
    }

    isNetworkSupported(networkNameOrSymbol: NetworkName | NetworkSymbol | string): boolean {
        return false;
    }
}
