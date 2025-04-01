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
    tokenType: string; // ERC-20
    traffic: string;
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
    to?: string;
    tokenType: string; // ERC-20
    traffic: string;

    constructor(data: any) {
        this.age = data.age || "";
        this.amount = Number(data.amount || 0);
        this.block = data.block || "";
        this.confirmations = data.confirmations || "";
        this.date = data.date || "";
        this.fiatAmount = Number(data.fiatAmount || 0);
        this.fiatTotal = data.fiatTotal || 0;
        this.from = data.from || data.sender || "";
        this.gasFee = data.gasFee || 0;
        this.hash = data.hash || "";
        this.method = data.method || "";
        this.receiver = data.receiver || data.to || null;
        this.sender = data.sender || data.from || null;
        this.status = data.status || "";
        this.to = data.to || data.receiver || "";
        this.traffic = data.traffic || "";

        this.asset = data.asset || data.symbol || data.token?.symbol || "";
        this.balance = data.balance || data.token?.amount || 0;
        this.fiatBalance = data.fiatBalance || data.token?.fiatBalance || 0;
        this.network = data.network || data.token?.network || "";
        this.price = data.price || data.token?.price || 0;
        this.tokenType = data.tokenType || data.token?.tokenType || "";
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
            asset: "ETH",
            block: this.block,
            date: this.timestamp?.split("(")[1].split(")")[0].trim(),
            fiatAmount: Number(this.valueDolar),
            from: this.from,
            hash: this.id,
            status: this.status.toLowerCase(),
            to: this.to,
            tokenType: "ERC-20",
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
    anonymous: boolean;
    assets: Array<Asset>;
    btcAddress: string;
    displayBtcAddress: string;
    displayEthAddress: string;
    displaySolanaAddress: string;
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
}

export class WalletModel implements Wallet {
    private _displayBtcAddress?: string;
    private _displayEthAddress?: string;
    private _displaySolanaAddress?: string;
    private _displaySuiAddress?: string;

    _id: string;
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
    pgp?: PGP = {} as PGP;
    publicData: WalletPublicData;
    solanaAddress: string;
    suiAddress: string;
    zelfProof: string;
    zkProof: string;

    constructor(data: any = {}) {
        this._id = data._id;

        this.anonymous = data.anonymous || true;
        this.ipfs = (data.ipfs as IPFS) || ({} as IPFS);
        this.pgp = (data.pgp as PGP) || ({} as PGP);

        const secondaryStorage = data.publicData || {};

        this.publicData = new WalletPublicDataModel(secondaryStorage);

        this.durationToken = data.durationToken;
        this.hasPassword = Boolean(data.hasPassword || data.passwordLayer === "WithPassword" || secondaryStorage.hasPassword === "true");
        this.image = data.image || data.url || data.zelfProofQRCode;
        this.metadata = data.metadata;
        this.name = data.name || data.zelfName || secondaryStorage.zelfName;
        this.zelfProof = data.zelfProof || secondaryStorage.zelfProof;
        this.zkProof = data.zkProof;

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
        return this._displaySolanaAddress || "";
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
        const firstPart = value.slice(0, 4);
        const lastPart = value.slice(-4);

        return `${firstPart}...${lastPart}`;
    }
}

export interface WalletPublicData {
    _id: string;
    btcAddress: string;
    ethAddress: string;
    expiresAt: string;
    isExpired: boolean;
    isExpiringSoon: boolean;
    isExpiringWithinMonth: boolean;
    registeredAt: string;
    solanaAddress: string;
    type: "mainnet" | "hold" | "";
    zelfName: string;
}

export class WalletPublicDataModel {
    private _isExpired: boolean;
    private _isExpiringSoon: boolean;
    private _isExpiringWithinMonth: boolean;

    _id: string;
    btcAddress: string;
    ethAddress: string;
    expiresAt: string;
    registeredAt: string;
    solanaAddress: string;
    type: "mainnet" | "hold" | "";
    zelfName: string;

    constructor(data: any) {
        this._id = data._id || "offline";
        this._isExpired = false;
        this._isExpiringSoon = false;
        this._isExpiringWithinMonth = false;

        this.btcAddress = data.btcAddress || "";
        this.ethAddress = data.ethAddress || "";
        this.expiresAt = data.expiresAt || "";
        this.registeredAt = data.registeredAt || "";
        this.solanaAddress = data.solanaAddress || "";
        this.type = data.type || "";
        this.zelfName = data.zelfName || "";

        if (!this.type) data.zelfName?.includes(".hold") ? (this.type = "hold") : (this.type = "mainnet");
        if (this.zelfName) this.zelfName = this.zelfName.replace(".hold", "");

        this.isExpired = this._checkIsExpired(this.expiresAt);
        this.isExpiringSoon = this._checkIsExpiringSoon(this.expiresAt);
        this.isExpiringWithinMonth = this._checkIsExpiringWithinMonth(this.expiresAt);
    }

    get isExpired(): boolean {
        return this._isExpired;
    }

    set isExpired(value: boolean) {
        this._isExpired = value;
    }

    get isExpiringSoon(): boolean {
        return this._isExpiringSoon;
    }

    set isExpiringSoon(value: boolean) {
        this._isExpiringSoon = value;
    }

    get isExpiringWithinMonth(): boolean {
        return this._isExpiringWithinMonth;
    }

    set isExpiringWithinMonth(value: boolean) {
        this._isExpiringWithinMonth = value;
    }

    private _timeRemaining(expiresAt: string): number {
        const expiresAtTime = new Date(expiresAt).getTime();

        return expiresAtTime - Date.now();
    }

    private _checkIsExpired(expiresAt: string): boolean {
        const timeLeft = this._timeRemaining(expiresAt);

        return timeLeft <= 0;
    }

    private _checkIsExpiringSoon(expiresAt: string): boolean {
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const timeLeft = this._timeRemaining(expiresAt);

        return timeLeft > 0 && timeLeft <= oneDayInMs;
    }

    private _checkIsExpiringWithinMonth(expiresAt: string): boolean {
        const oneDayInMs = 24 * 60 * 60 * 1000;
        const oneMonthInMs = 30 * oneDayInMs;

        const timeLeft = this._timeRemaining(expiresAt);

        return timeLeft > 0 && timeLeft <= oneMonthInMs;
    }
}

export type TokenData = {
    amount: number | string;
    decimals?: number;
    fiatBalance: number | string;
    image: string;
    name: string;
    network: string;
    price: string | number;
    symbol: string;
    tokenType: string;
};

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

    get isAvaxToken(): boolean {
        return this.tokenType === "AVAX";
    }

    get isSolToken(): boolean {
        return this.tokenType === "SOL";
    }

    get isBtcToken(): boolean {
        return this.tokenType === "BTC";
    }
}
