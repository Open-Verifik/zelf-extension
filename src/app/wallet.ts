export type AddressBook = {
    address: string;
    lastUsed?: Date | string;
    network: string;
    tokenType: string;
    zelfName?: string;
};

export type Token = {
    address: string;
    amount: number;
    decimals?: number;
    fiatBalance: number;
    name: string;
    network: string;
    price: number;
    symbol: string;
    tokenType: string;
};

export class Asset {
    asset: string;
    balance: number;
    fiatBalance: number;
    price: number;

    constructor(data: any) {
        this.asset = data.asset || "NA";
        this.balance =
            data.balance !== undefined && data.balance !== null
                ? Number(parseFloat(data.balance).toFixed(7))
                : Number((data.fiatBalance / data.price).toFixed(6));

        this.fiatBalance = data.fiatBalance;
        this.price = data.price || 0; // hardcoded price
    }
}

export interface Transaction {
    age: string;
    amount: number; // 0.01
    asset: string; // ETH
    balance: number; // 0.05
    block: string;
    confirmations?: number;
    date: string;
    fiatAmount: number;
    fiatBalance?: number; // 199 usd
    fiatTotal?: number; // 38.28
    from?: string;
    gasFee: number; // 0.28
    hash: string;
    image?: string;
    method: string;
    network: string; // Ethereum
    price: number; // 3800
    receiver?: any;
    sender?: any;
    status?: string;
    to?: string;
    type: string;
    tokenType: string; // ERC-20
    traffic: string;

    targetAddress?: string;
    targetAmount?: number;
    targetImage?: string;
    targetNetwork?: string;
    targetSymbol?: string;
    targetToken?: string;
}

export class TransactionModel implements Transaction {
    age: string;
    amount: number; // 0.01
    asset: string; // ETH
    balance: number; // 0.05
    block: string;
    confirmations?: number;
    date: string;
    fiatAmount: number;
    fiatBalance?: number; // 199 usd
    fiatTotal?: number; // 38.28
    from?: string;
    gasFee: number; // 0.28
    hash: string;
    image?: string;
    method: string;
    network: string; // Ethereum
    price: number; // 3800
    receiver?: any;
    sender?: any;
    status?: string;
    symbol?: string;
    to?: string;
    tokenType: string; // ERC-20
    traffic: string;
    type: string;

    targetAddress?: string;
    targetAmount?: number;
    targetImage?: string;
    targetNetwork?: string;
    targetSymbol?: string;
    targetToken?: string;

    constructor(data: any) {
        this.age = data.age || "";
        this.amount = Number(data.amount || 0);
        this.asset = data.asset || data.symbol || data.token?.symbol || "";
        this.balance = data.balance || data.token?.amount || 0;
        this.block = data.block || "";
        this.confirmations = data.confirmations || "";
        this.date = data.date || "";
        this.fiatAmount = Number(data.fiatAmount || 0);
        this.fiatBalance = data.fiatBalance || data.token?.fiatBalance || 0;
        this.fiatTotal = data.fiatTotal || 0;
        this.from = data.from || data.sender || "";
        this.gasFee = data.gasFee || 0;
        this.hash = data.hash || "";
        this.image = data.image || "";
        this.method = data.method || "";
        this.network = data.network || data.token?.network || "";
        this.price = data.price || data.token?.price || 0;
        this.receiver = data.receiver || data.to || null;
        this.sender = data.sender || data.from || null;
        this.status = data.status || "";
        this.to = data.to || data.receiver || "";
        this.tokenType = data.tokenType || data.token?.tokenType || "";
        this.traffic = data.traffic || "";
        this.type = data.type || "";

        this.targetAddress = data.targetAddress || data.targetToken || "";
        this.targetAmount = data.targetAmount || data.token?.amount || 0;
        this.targetImage = data.targetImage || data.token?.image || "";
        this.targetNetwork = data.targetNetwork || data.token?.network || "";
        this.targetSymbol = data.targetSymbol || data.token?.symbol || "";
    }

    get total(): number {
        return Number(this.amount) + Number(this.gasFee);
    }
}

export type SuiTransaction = {
    age: string;
    amount: number;
    block: string;
    computationCostFee: number;
    confirmedNumber: number;
    date: string;
    from: string;
    gasBudget: number;
    gasPayment: string;
    gasPrice: number;
    hash: string;
    nonRefundableStorageFee: number;
    status: string;
    symbol: string;
    to: string[];
    tokenTransferNum: number;
    txFee: number;
};

export type BitcoinTransaction = {
    hash: string;
    amount: string;
    amountSats: number;
    fiatAmount: string;
    from: string;
    to: string[];
    txnFee: string;
    txnFeeSats: string;
    networkFeePayer: string;
    status: string;
    block: string;
    logoURI: string;
    asset: string;
    decimals: number;
    date: string;
    age: string;
    traffic: string;
};

export class BitcoinTransactionModel implements BitcoinTransaction {
    age: string;
    amount: string;
    amountSats: number;
    asset: string;
    block: string;
    date: string;
    decimals: number;
    fiatAmount: string;
    from: string;
    hash: string;
    logoURI: string;
    networkFeePayer: string;
    status: string;
    to: string[];
    traffic: string;
    txnFee: string;
    txnFeeSats: string;

    constructor(data: any) {
        this.age = data.age || "";
        this.amount = data.amount || "";
        this.amountSats = data.amountSats || 0;
        this.asset = data.asset || "";
        this.block = data.block || "";
        this.date = data.date || "";
        this.decimals = data.decimals || 0;
        this.fiatAmount = data.fiatAmount || "";
        this.from = data.from || "";
        this.hash = data.hash || "";
        this.logoURI = data.logoURI || "";
        this.networkFeePayer = data.networkFeePayer || "";
        this.status = data.status || "";
        this.to = data.to || [];
        this.traffic = data.traffic || "";
        this.txnFee = data.txnFee || "";
        this.txnFeeSats = data.txnFeeSats || "";
    }

    toTransaction(): TransactionModel {
        return new TransactionModel({
            age: this.age,
            amount: Number(this.amount),
            asset: this.asset,
            date: new Date(this.date),
            network: "bitcoin",
            fiatAmount: 0,
            from: this.from,
            gasFee: this.txnFee,
            hash: this.hash,
            status: this.status.toLowerCase(),
            to: this.to[0],
            tokenType: "BTC",
            type: this.traffic === "IN" ? "receive" : "send",
        });
    }
}

export class SuiTransactionModel implements SuiTransaction {
    age: string;
    amount: number;
    block: string;
    computationCostFee: number;
    confirmedNumber: number;
    date: string;
    from: string;
    gasBudget: number;
    gasPayment: string;
    gasPrice: number;
    hash: string;
    nonRefundableStorageFee: number;
    status: string;
    symbol: string = "SUI";
    to: string[];
    tokenTransferNum: number;
    txFee: number;

    constructor(data: any) {
        this.age = data.age || "";
        this.amount = Number(data.amount) || 0;
        this.block = data.block || "";
        this.computationCostFee = Number(data.computationCostFee) || 0;
        this.confirmedNumber = Number(data.confirmedNumber) || 0;
        this.date = data.date || "";
        this.from = data.from || "";
        this.gasBudget = Number(data.gasBudget) || 0;
        this.gasPayment = data.gasPayment || "";
        this.gasPrice = Number(data.gasPrice) || 0;
        this.hash = data.hash || "";
        this.nonRefundableStorageFee = Number(data.nonRefundableStorageFee) || 0;
        this.status = data.status || "";
        this.symbol = data.symbol || "SUI";
        this.to = data.to?.length ? data.to[0] : [];
        this.tokenTransferNum = Number(data.tokenTransferNum) || 0;
        this.txFee = Number(data.txFee) || 0;
    }

    toTransaction(): TransactionModel {
        return new TransactionModel({
            age: this.age,
            amount: Number(this.amount),
            asset: this.symbol,
            date: new Date(this.date),
            fiatAmount: 0,
            from: this.from,
            gasFee: this.gasPrice,
            hash: this.hash,
            status: this.status.toLowerCase(),
            to: this.to,
            tokenType: "SUI",
        });
    }
}

export type EthTransaction = {
    block: string;
    from: string;
    gasPrice: string;
    gweiETH: string;
    id: string;
    observation: string;
    status: string;
    symbol: string;
    timestamp: string;
    to: string;
    transactionFeeDolar: string;
    transactionFeeETH: string;
    valueDolar: string;
    valueETH: string;
};

export class EthTransactionModel implements EthTransaction {
    block: string;
    from: string;
    gasPrice: string;
    gweiETH: string;
    id: string;
    observation: string;
    status: string;
    symbol: string = "ETH";
    timestamp: string;
    to: string;
    transactionFeeDolar: string;
    transactionFeeETH: string;
    valueDolar: string;
    valueETH: string;

    constructor(data: EthTransaction) {
        this.block = data.block || "";
        this.from = data.from || "";
        this.gasPrice = data.gasPrice || "";
        this.gweiETH = data.gweiETH || "";
        this.id = data.id || "";
        this.observation = data.observation || "";
        this.status = data.status || "";
        this.symbol = data.symbol || "ETH";
        this.timestamp = data.timestamp || "";
        this.to = data.to || "";
        this.transactionFeeDolar = data.transactionFeeDolar || "";
        this.transactionFeeETH = data.transactionFeeETH || "";
        this.valueDolar = data.valueDolar || "";
        this.valueETH = data.valueETH || "";
    }

    toTransaction(): TransactionModel {
        return new TransactionModel({
            age: this.timestamp?.split("(")[0].trim(),
            amount: Number(this.valueETH),
            asset: this.symbol,
            block: this.block,
            date: this.timestamp?.split("(")[1].split(")")[0].trim(),
            fiatAmount: Number(this.valueDolar),
            from: this.from,
            gasFee: this.transactionFeeETH,
            hash: this.id,
            status: this.status.toLowerCase(),
            to: this.to,
            tokenType: "ERC-20",
        });
    }
}

export interface TransactionDetail {
    age: string;
    amount: string;
    block: string;
    date: string;
    fiatAmount: number;
    from: string;
    gasPrice: string;
    gwei: string;
    hash: string;
    id: string;
    image: string;
    network: string;
    observation: string;
    status: string;
    symbol: string;
    timestamp: string;
    to: string;
    transactionFee: string;
    transactionFeeFiat: string;
    transactionType: "swap" | "transfer" | "call" | "";
    tokensTransferred: {
        amount: string;
        from: string;
        icon: string;
        network: string;
        symbol: string;
        to: string;
        token: string;
    }[];
}

export class TransactionDetailModel implements TransactionDetail {
    age: string;
    amount: string;
    block: string;
    date: string;
    fiatAmount: number;
    from: string;
    gasPrice: string;
    gwei: string;
    hash: string;
    id: string;
    image: string;
    network: string;
    observation: string;
    status: string;
    symbol: string;
    timestamp: string;
    to: string;
    transactionFee: string;
    transactionFeeFiat: string;
    transactionType: "swap" | "transfer" | "call" | "";
    tokensTransferred: {
        from: string;
        to: string;
        amount: string;
        token: string;
        network: string;
        symbol: string;
        icon: string;
    }[];

    constructor(data: any) {
        this.age = data.age || "";
        this.amount = data.amount || "";
        this.block = data.block || "";
        this.date = data.date || "";
        this.fiatAmount = data.fiatAmount || "";
        this.from = data.from || "";
        this.gasPrice = data.gasPrice || "";
        this.gwei = data.gwei || "";
        this.hash = data.hash || "";
        this.id = data.id || "";
        this.image = data.image || "";
        this.network = data.network || "";
        this.observation = data.observation || "";
        this.status = `${data.status}`.toLowerCase();
        this.symbol = data.symbol || "";
        this.timestamp = data.timestamp || "";
        this.to = data.to || "";
        this.tokensTransferred = data.tokensTransferred || [];
        this.transactionFee = data.transactionFee || "";
        this.transactionFeeFiat = data.transactionFeeFiat || "";
        this.transactionType = (data.transactionType || "").toLowerCase() as "swap" | "transfer" | "call" | "";
    }

    toTransaction(): TransactionModel {
        const transactionData = {
            age: this.age,
            amount: Number(this.amount),
            asset: this.symbol,
            block: this.block,
            date: this.date,
            fiatAmount: Number(this.fiatAmount),
            from: this.from,
            gasFee: this.transactionFee,
            hash: this.id,
            image: this.image,
            network: this.network,
            status: this.status.toLowerCase(),
            to: this.to,
            tokenType: "ERC-20",
            type: this.transactionType,
        };

        let additionalData = {};

        if (this.transactionType === "swap" || this.transactionType === "call") {
            transactionData.type = "swap";

            const firstTokenTransfer = this.tokensTransferred[0];
            const lastTokenTransfer = this.tokensTransferred[this.tokensTransferred.length - 1];

            additionalData = {
                ...(firstTokenTransfer.network === "solana"
                    ? {
                          amount: firstTokenTransfer.amount,
                          asset: firstTokenTransfer.symbol,
                          image: firstTokenTransfer.icon,
                          network: firstTokenTransfer.network,
                          to: firstTokenTransfer.to,
                      }
                    : {}),
                targetAddress: lastTokenTransfer.to,
                targetAmount: lastTokenTransfer.amount,
                targetImage: lastTokenTransfer.icon,
                targetNetwork: lastTokenTransfer.network,
                targetSymbol: lastTokenTransfer.symbol,
                targetToken: lastTokenTransfer.token,
            };
        } else if (this.tokensTransferred.length > 0) {
            const lastTokenTransfer = this.tokensTransferred[this.tokensTransferred.length - 1];

            additionalData = {
                amount: lastTokenTransfer.amount,
                asset: lastTokenTransfer.symbol,
                image: lastTokenTransfer.icon,
                network: lastTokenTransfer.network,
                to: lastTokenTransfer.to,
            };
        }

        return new TransactionModel({
            ...transactionData,
            ...additionalData,
        });
    }
}

export interface IPFS {
    GroupId: string | null;
    ID: string;
    IpfsHash: string;
    MimeType: boolean;
    name: string;
    Name: string;
    NumberOfFiles: number;
    pinned: boolean;
    PinSize: number;
    Timestamp: string;
    url: string;
    web3: boolean;
    zelfName: string;
    Keyvalues: {
        addresses: string;
        expiresAt: string;
        hasPassword: string;
        payment: string;
        type: string;
        zelfName: string;
        zelfProof: string;
    };
    publicData: {
        btcAddress: string;
        duration: number;
        ethAddress: string;
        expiresAt: string;
        hasPassword: string;
        name: string;
        referralSolanaAddress: string;
        referralZelfName: string;
        solanaAddress: string;
        type: string;
        zelfName: string;
    };
}

export interface PGP {
    encryptedMessage: string;
    privateKey: string;
}

export interface Wallet {
    _id: string;
    available: boolean;
    anonymous: boolean;
    assets: Array<Asset>;
    btcAddress: string;
    displayBtcAddress: string;
    displayEthAddress: string;
    displaySolanaAddress: string;
    displaySuiAddress: string;
    durationToken: string;
    ethAddress: string;
    hasPassword: boolean;
    image: string;
    metadata: any;
    name: string;
    pgp?: { encryptedMessage: string; privateKey: string };
    publicData: WalletPublicData;
    solanaAddress: string;
    suiAddress: string;
    zelfProof: string;
    zkProof: string;

    updatePublicData(data: any): void;
}

export class WalletModel implements Wallet {
    private _displayBtcAddress?: string;
    private _displayEthAddress?: string;
    private _displaySolanaAddress?: string;
    private _displaySuiAddress?: string;

    _id: string;
    available: boolean = false;
    anonymous: boolean;
    assets: Array<Asset>;
    btcAddress: string;
    durationToken: string;
    ethAddress: string;
    hasPassword: boolean;
    image: string;
    ipfs: IPFS = {} as IPFS;
    metadata: any;
    name: string;
    pgp?: PGP = undefined;
    publicData: WalletPublicData;
    solanaAddress: string;
    suiAddress: string;
    zelfProof: string;
    zkProof: string;

    constructor(data: any = {}) {
        this._id = data._id;

        this.available = data.available || false;
        this.anonymous = data.anonymous || true;
        this.ipfs = (data.ipfs as IPFS) || ({} as IPFS);
        this.pgp = (data.pgp as PGP) || undefined;

        const secondaryStorage = data.publicData || {};

        this.publicData = new WalletPublicDataModel(secondaryStorage);

        this.durationToken = data.durationToken;
        this.hasPassword = Boolean(data.hasPassword || data.passwordLayer === "WithPassword" || secondaryStorage.hasPassword === "true");
        this.image = data.image || data.url || data.zelfProofQRCode;
        this.metadata = data.metadata;
        this.zelfProof = data.zelfProof || secondaryStorage.zelfProof;
        this.zkProof = data.zkProof;

        this.name =
            data.name || data.zelfName || secondaryStorage.zelfName ? `${data.name || data.zelfName || secondaryStorage.zelfName}`.toLowerCase() : "";

        if (!this.publicData.zelfName) this.publicData.zelfName = this.name;

        this.btcAddress = data.btcAddress || secondaryStorage.btcAddress;
        if (this.btcAddress) this.displayBtcAddress = this.btcAddress;

        this.ethAddress = data.ethAddress || secondaryStorage.ethAddress;
        if (this.ethAddress) this.displayEthAddress = this.ethAddress;

        this.solanaAddress = data.solanaAddress || secondaryStorage.solanaAddress;
        if (this.solanaAddress) this.displaySolanaAddress = this.solanaAddress;

        this.suiAddress = data.suiAddress || secondaryStorage.suiAddress;
        if (this.suiAddress) this.displaySuiAddress = this.suiAddress;

        this.assets = [];
    }

    get displayBtcAddress(): string {
        return this._displayBtcAddress || "";
    }

    get displayEthAddress(): string {
        return this._displayEthAddress || "";
    }

    get displaySolanaAddress(): string {
        return this._displaySolanaAddress || "";
    }

    get displaySuiAddress(): string {
        return this._displaySuiAddress || "";
    }

    set displayBtcAddress(value: string) {
        this._displayBtcAddress = this._parseAddress(value);
    }

    set displayEthAddress(value: string) {
        this._displayEthAddress = this._parseAddress(value);
    }

    set displaySolanaAddress(value: string) {
        this._displaySolanaAddress = this._parseAddress(value);
    }

    set displaySuiAddress(value: string) {
        this._displaySuiAddress = this._parseAddress(value);
    }

    private _parseAddress(value: string): string {
        const firstPart = value.slice(0, 8);
        const lastPart = value.slice(-8);

        return `${firstPart}...${lastPart}`;
    }

    updatePublicData(data: any) {
        this.publicData = new WalletPublicDataModel({ ...this.publicData, ...data });
    }
}

export interface WalletPublicData {
    _id: string;
    btcAddress: string;
    ethAddress: string;
    expiresAt: string;
    gracePeriod: Date | null;
    isExpired: boolean;
    isExpiringSoon: boolean;
    isFullyExpired: boolean;
    isInGracePeriod: boolean;
    origin: "offline" | "online" | "";
    registeredAt: string;
    solanaAddress: string;
    suiAddress: string;
    type: "mainnet" | "hold" | "";
    zelfName: string;

    timeLeftInGracePeriodSeconds(): number;
}

export class WalletPublicDataModel {
    _id: string;
    btcAddress: string;
    ethAddress: string;
    expiresAt: string;
    gracePeriod: Date | null;
    origin: "offline" | "online" | "";
    registeredAt: string;
    solanaAddress: string;
    suiAddress: string;
    type: "mainnet" | "hold" | "";
    zelfName: string;

    constructor(data: any) {
        this._id = data._id || "offline";

        this.btcAddress = data.btcAddress || "";
        this.ethAddress = data.ethAddress || "";
        this.expiresAt = data.expiresAt || "";
        this.origin = data.origin || "";
        this.registeredAt = data.registeredAt || "";
        this.solanaAddress = data.solanaAddress || "";
        this.suiAddress = data.suiAddress || "";
        this.type = data.type || "";
        this.zelfName = data.zelfName || "";

        if (!this.type) data.zelfName ? (data.zelfName?.includes(".hold") ? (this.type = "hold") : (this.type = "mainnet")) : "";
        if (this.zelfName) this.zelfName = this.zelfName.replace(".hold", "");

        this.gracePeriod = this._calculateGracePeriod();
    }

    get isExpired(): boolean {
        return this._checkIsExpired();
    }

    get isExpiringSoon(): boolean {
        return this._checkIsExpiringSoon();
    }

    get isFullyExpired(): boolean {
        return this._checkIsFullyExpired();
    }

    get isInGracePeriod(): boolean {
        if (this.type !== "mainnet" || !this.gracePeriod) return false;

        const now = new Date();

        return now < this.gracePeriod && now > new Date(this.expiresAt);
    }

    private _calculateGracePeriod(): Date | null {
        if (this.type !== "mainnet") return null;

        const gracePeriod = new Date(this.expiresAt);

        gracePeriod.setDate(gracePeriod.getDate() + 30);

        return gracePeriod;
    }

    private _checkIsExpired(): boolean {
        const timeLeft = this._timeRemaining();

        return timeLeft <= 0;
    }

    private _checkIsExpiringSoon(): boolean {
        const oneMonthInMs = 24 * 60 * 60 * 1000 * 30;

        const timeLeft = this._timeRemaining();

        return timeLeft > 0 && timeLeft <= oneMonthInMs;
    }

    private _checkIsFullyExpired(): boolean {
        return this.isExpired && !this.isInGracePeriod;
    }

    private _timeRemaining(): number {
        const expiresAtTime = new Date(this.expiresAt).getTime();

        return expiresAtTime - Date.now();
    }

    timeLeftInGracePeriodSeconds(): number {
        if (this.type !== "mainnet" || !this.gracePeriod) return 0;

        const now = new Date().getTime();
        const gracePeriodEnd = this.gracePeriod.getTime() * 24 * 60 * 60 * 1000;

        return Math.max(0, Math.floor((gracePeriodEnd - now) / 1000));
    }
}

export interface TokenData {
    address_token?: string;
    address?: string;
    priceUSD?: string;
    amount: number | string;
    balance?: number | string;
    balanceUsd?: number | string;
    chainId?: number | string;
    contractAddress?: string;
    decimals?: number;
    fiatBalance: number | string;
    image: string;
    mint?: string;
    name: string;
    network: string;
    price: string | number;
    symbol: string;
    tokenAddress?: string;
    tokenType: string;
}

export type Sender = {
    address: string;
    zelfName: string;
};

export type Receiver = {
    address: string;
    tokenType?: string; // Can be left blank if same as sender currency
    symbol?: string; // Can be left blank if same as sender currency
    zelfName?: string;
};

export interface TransactionData {
    amount?: number | string;
    fee?: number | string;
    fiatAmount?: number | string;
    fiatFee?: number | string;
    receiver: Receiver;
    sender: Sender;
    token: TokenData;
    total?: number | string;
}

export class TransactionData implements TransactionData {
    amount?: number | string = 0;
    fee?: number | string = 0;
    fiatAmount?: number | string = 0;
    fiatFee?: number | string = 0;
    receiver: Receiver = {} as Receiver;
    sender: Sender = {} as Sender;
    token: TokenData = {} as TokenData;
    total?: number | string = 0;

    constructor(data: any = {}) {
        this.amount = data.amount || 0;
        this.fee = data.fee || 0;
        this.fiatAmount = data.fiatAmount || 0;
        this.fiatFee = data.fiatFee || 0;
        this.receiver = data.receiver || ({} as Receiver);
        this.sender = data.sender || ({} as Sender);
        this.token = data.token || ({} as TokenData);
        this.total = data.total || 0;
    }

    get hasCompletePaymentData(): boolean {
        return this.hasAmount && this.hasReceiver && this.hasSender && this.hasToken;
    }

    get hasTransactionData(): boolean {
        return this.hasToken && this.hasSender;
    }

    get hasToken(): boolean {
        return !!this.token && Object.keys(this.token).length > 0;
    }

    get hasSender(): boolean {
        return !!this.sender && !!this.sender?.address;
    }

    get hasAmount(): boolean {
        return (
            !!this.amount &&
            (typeof this.amount === "number" ? this.amount > 0 : typeof this.amount === "string" ? parseFloat(this.amount) > 0 : false)
        );
    }

    get hasReceiver(): boolean {
        return !!this.receiver && Object.keys(this.receiver).length > 0;
    }

    get balance(): number | string | bigint {
        return this.token?.amount || 0;
    }

    get fiatBalance(): number | string {
        return this.token?.fiatBalance || 0;
    }

    get network(): string {
        return (this.token?.network || "").toLowerCase();
    }

    get tokenType(): string {
        return this.token?.tokenType || "";
    }

    get symbol(): string {
        return this.token?.symbol || "";
    }

    get tokenName(): string {
        return this.token?.name || "";
    }

    get receiverSymbol(): string {
        return this.receiver?.symbol || this.token?.symbol || "";
    }

    get receiverTokenType(): string {
        return this.receiver?.tokenType || this.token?.tokenType || "";
    }

    get isEthToken(): boolean {
        return this.tokenType === "ETH" || this.tokenType === "ERC-20";
    }

    get isPolToken(): boolean {
        return this.tokenType === "POL" || this.tokenType === "MATIC";
    }

    get isBscToken(): boolean {
        return this.tokenType === "BSC" || this.tokenType === "BNB" || this.tokenType === "BEP-20";
    }

    get isAvaxToken(): boolean {
        return this.tokenType === "AVAX";
    }

    get isSolToken(): boolean {
        return this.tokenType === "SOL" || this.tokenType === "SPL";
    }

    get isBtcToken(): boolean {
        return this.tokenType === "BTC";
    }

    get isSuiToken(): boolean {
        return this.tokenType === "SUI" || this.tokenType === "SUI_TOKEN";
    }
}

export type SOLSource = {
    trans_id: string;
    block_id: number;
    trans_time: number;
    fee: number;
    reward: any[];
    sol_bal_change: Array<{
        address: string;
        pre_balance: number;
        post_balance: number;
        change_amount: number;
    }>;
    token_bal_change: any[];
    tokens_involved: any[];
    parsed_instructions: Array<{
        ins_index: number;
        parsed_type: string;
        type: string;
        program_id: string;
        program: string;
        outer_program_id: string | null;
        outer_ins_index: number;
        data_raw: {
            info: {
                destination: string;
                lamports: number;
                source: string;
            };
            type: string;
        };
        accounts: any[];
        activities: any[];
        transfers: Array<{
            source_owner: string;
            source: string;
            destination: string;
            destination_owner: string;
            transfer_type: string;
            token_address: string;
            decimals: number;
            amount_str: string;
            amount: number;
            program_id: string;
            outer_program_id: string | null;
            ins_index: number;
            outer_ins_index: number;
            event: string;
            fee: Record<string, any>;
        }>;
        program_invoke_level: number;
        display: {
            accounts: any[];
            input_args: any | null;
            data: {
                source: string;
                destination: string;
                amount: {
                    token_amount: {
                        number: number;
                        decimals: number;
                        token_address: string;
                    };
                };
            };
            events: any | null;
        };
        render_actions: any[];
    }>;
    accounts_involved: string[];
    programs_involved: string[];
    index_block: number;
    signer: string[];
    list_signer: string[];
    status: number;
    metadata: {
        token_metadata: Record<string, any>;
        account_metadata: Record<
            string,
            {
                account_address: string;
                signer: boolean;
                writable: boolean;
            }
        >;
        init_token_account_metadata: Record<string, any>;
    };
    source_store_tx: string;
    account_keys: Array<{
        pubkey: string;
        writable: boolean;
        signer: boolean;
        source: string;
    }>;
    compute_units_consumed: number;
    render_legacy_main_actions: Array<{
        title: Array<
            Array<{
                text?: string;
                instruction?: string;
                account?: string;
                origin_data?: {
                    program_id: string;
                    parsed_type: string;
                    activity_type: string;
                };
                index?: {
                    ins_index: number;
                    outer_ins_index: number;
                };
            }>
        >;
        body: Array<
            Array<{
                icon?: string;
                text?: string;
                account?: string;
                token_amount?: {
                    number: number;
                    decimals: number;
                    token_address: string;
                };
                origin_data?: {
                    source_owner: string;
                    source: string;
                    destination: string;
                    destination_owner: string;
                    transfer_type: string;
                    token_address: string;
                    decimals: number;
                    amount_str: string;
                    amount: number;
                    program_id: string;
                    outer_program_id: string | null;
                    ins_index: number;
                    outer_ins_index: number;
                    event: string;
                    fee: Record<string, any>;
                    activity_type: string;
                };
                index?: {
                    ins_index: number;
                    outer_ins_index: number;
                };
            }>
        >;
    }>;
    render_summary_main_actions: any[];
    txStatus: string;
    confirmations: number | null;
    version: string;
    logMessage: string[];
    recentBlockhash: string;
    priority_fee: number;
};

export type SwapSource = "source" | "target" | "";

export class SwapData {
    bridge: string;
    commission: number;
    commissionToggle: boolean;
    fee: number;
    password: string;
    slippage: number;
    slippageToggle: boolean;
    sourceAmount: number;
    sourceAsset: TokenData;
    targetAmount: number;
    targetAsset: TokenData;
    targetSwapValue: number;

    constructor(data: any = {}) {
        this.bridge = data.bridge || "";
        this.commission = data.commission || 0;
        this.commissionToggle = data.commissionToggle || false;
        this.fee = data.fee || 0;
        this.password = data.password || "";
        this.slippage = data.slippage || 0;
        this.slippageToggle = data.slippageToggle || false;
        this.sourceAmount = data.sourceAmount || 0;
        this.sourceAsset = data.sourceAsset || ({} as TokenData);
        this.targetAmount = data.targetAmount || 0;
        this.targetAsset = data.targetAsset || ({} as TokenData);
        this.targetSwapValue = data.targetSwapValue || 0;
    }

    get hasSwapData(): boolean {
        return Object.keys(this.sourceAsset).length > 0 && Object.keys(this.targetAsset).length > 0;
    }
}
