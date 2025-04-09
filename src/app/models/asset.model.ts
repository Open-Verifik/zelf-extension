export type AssetIntervalOptions = Array<{ label: string; range: AssetRange }>;
export type AssetRange = "1d" | "7d" | "1M" | "1y";
export type AssetInterval = "5m" | "15m" | "1h" | "1d";

export interface AssetChart {
    close: number;
    dateTime: string;
    high: number;
    index: number;
    low: number;
    open: number;
    time: number;
    type: string;
}

export class AssetChart implements AssetChart {
    close: number;
    dateTime: string;
    high: number;
    index: number;
    low: number;
    open: number;
    time: number;
    type: string;

    constructor(data: AssetChart) {
        this.close = data.close || 0;
        this.dateTime = data.dateTime || "";
        this.high = data.high || 0;
        this.index = data.index || 0;
        this.low = data.low || 0;
        this.open = data.open || 0;
        this.time = data.time || 0;
        this.type = data.type || "";
    }
}

export interface AssetPrice {
    price: number;
    priceChangePercentage1h: number;
    priceChangePercentage1y: number;
    priceChangePercentage24h: number;
    priceChangePercentage30d: number;
    priceChangePercentage60d: number;
    priceChangePercentage7d: number;
    priceChangePercentage90d: number;
    priceChangePercentageAll: number;
    priceChangePercentageYesterday: number;
}

export class AssetPrice implements AssetPrice {
    price: number;
    priceChangePercentage1h: number;
    priceChangePercentage1y: number;
    priceChangePercentage24h: number;
    priceChangePercentage30d: number;
    priceChangePercentage60d: number;
    priceChangePercentage7d: number;
    priceChangePercentage90d: number;
    priceChangePercentageAll: number;
    priceChangePercentageYesterday: number;

    constructor(data: AssetPrice) {
        this.price = data.price || 0;
        this.priceChangePercentage1h = data.priceChangePercentage1h || 0;
        this.priceChangePercentage1y = data.priceChangePercentage1y || 0;
        this.priceChangePercentage24h = data.priceChangePercentage24h || 0;
        this.priceChangePercentage30d = data.priceChangePercentage30d || 0;
        this.priceChangePercentage60d = data.priceChangePercentage60d || 0;
        this.priceChangePercentage7d = data.priceChangePercentage7d || 0;
        this.priceChangePercentage90d = data.priceChangePercentage90d || 0;
        this.priceChangePercentageAll = data.priceChangePercentageAll || 0;
        this.priceChangePercentageYesterday = data.priceChangePercentageYesterday || 0;
    }
}

export interface AssetAbout {
    description: string;
    network: string;
    symbol: string;
    urls: {
        [key: string]: string[];
        chat: string[];
        explorer: string[];
        facebook: string[];
        reddit: string[];
        source_code: string[];
        technical_doc: string[];
        twitter: string[];
        website: string[];
    };
    information: {
        circulatingSupply: number;
        holders: number;
        marketCap: number;
        marketCapChangePercentage24h: number;
        totalSupply: number;
        volume: number;
        volumeChangePercentage24h: number;
    };
    performance24h: {
        traders: number;
        volume: number;
        volumePriceChangePercentage: number;
    };
}

export class AssetAbout implements AssetAbout {
    description: string;
    network: string;
    symbol: string;
    urls: {
        [key: string]: string[];
        chat: string[];
        explorer: string[];
        facebook: string[];
        reddit: string[];
        source_code: string[];
        technical_doc: string[];
        twitter: string[];
        website: string[];
    };
    information: {
        circulatingSupply: number;
        holders: number;
        marketCap: number;
        marketCapChangePercentage24h: number;
        totalSupply: number;
        volume: number;
        volumeChangePercentage24h: number;
    };
    performance24h: {
        traders: number;
        volume: number;
        volumePriceChangePercentage: number;
    };

    constructor(data: AssetAbout) {
        this.description = data.description || "";
        this.network = data.network || "";
        this.symbol = data.symbol || "";

        this.urls = {
            chat: data.urls?.chat || [],
            explorer: data.urls?.explorer || [],
            facebook: data.urls?.facebook || [],
            reddit: data.urls?.reddit || [],
            source_code: data.urls?.source_code || [],
            technical_doc: data.urls?.technical_doc || [],
            twitter: data.urls?.twitter || [],
            website: data.urls?.website || [],
        };

        this.information = {
            circulatingSupply: data.information?.circulatingSupply || 0,
            holders: data.information?.holders || 0,
            marketCap: data.information?.marketCap || 0,
            marketCapChangePercentage24h: data.information?.marketCapChangePercentage24h || 0,
            totalSupply: data.information?.totalSupply || 0,
            volume: data.information?.volume || 0,
            volumeChangePercentage24h: data.information?.volumeChangePercentage24h || 0,
        };

        this.performance24h = {
            traders: data.performance24h?.traders || 0,
            volume: data.performance24h?.volume || 0,
            volumePriceChangePercentage: data.performance24h?.volumePriceChangePercentage || 0,
        };
    }
}

export interface AssetDetails {
    about: AssetAbout;
    chart: AssetChart[];
    price: AssetPrice;
}

export class AssetDetails implements AssetDetails {
    about: AssetAbout;
    chart: AssetChart[];
    price: AssetPrice;

    constructor(data: AssetDetails) {
        this.about = new AssetAbout(data.about || ({} as AssetAbout));
        this.chart = (data.chart || []).map((chart) => new AssetChart(chart));
        this.price = new AssetPrice(data.price || ({} as AssetPrice));
    }
}
