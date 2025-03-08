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

export interface Transaction {
    amount: number;
    asset: string;
    balance: number;
    fiatAmount: number;
    fiatBalance: number;
    fiatTotal: number;
    gasFee: number;
    network: string;
    price: number;
    receiver: any;
    sender: any;
    tokenType: string;
}

export interface Wallet {
    _id: string;
    anonymous: boolean;
    assets: Array<Asset>;
    btcAddress: string;
    displayBtcAddress: string;
    displayEthAddress: string;
    displaySolanaAddress: string;
    ethAddress: string;
    hasPassword: boolean;
    image: string;
    metadata: any;
    name: string;
    pgp?: { encryptedMessage: string; privateKey: string };
    publicData: WalletPublicData;
    solanaAddress: string;
    zelfProof: string;
    zkProof: string;
}

export interface WalletPublicData {
    _id: string;
    btcAddress: string;
    ethAddress: string;
    expiresAt: string;
    isExpiringSoon: boolean;
    isExpired: boolean;
    registeredAt: string;
    solanaAddress: string;
    type: "mainnet" | "hold" | "";
    zelfName: string;
}

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

export class ETHTransaction {
    _from: string;
    _to: string;
    _transactionId: string;
    age: string;
    amount: string;
    asset: string;
    block: string;
    fiatAmount: string;
    from: string;
    method: string;
    to: string;
    traffic: string;
    transactionId: string;
    txnFee: string;
    zelfProof: string;

    constructor(data: any) {
        this._from = "";
        this._to = "";
        this._transactionId = "";
        this.age = data.age;
        this.amount = data.amount;
        this.asset = data.asset;
        this.block = data.block;
        this.fiatAmount = data.fiatAmount;
        this.from = data.from;
        this.method = data.method;
        this.to = data.to;
        this.traffic = data.traffic;
        this.transactionId = data.hash;
        this.txnFee = data.txnFee;
        this.zelfProof = data.zelfProof;

        if (this.to) this._to = this._parseAddress(this.to);
        if (this.from) this._from = this._parseAddress(this.from);
        if (this.transactionId) this._transactionId = this._parseAddress(this.transactionId);
    }

    private _parseAddress(value: string): string {
        const firstPart = value.slice(0, 4);
        const lastPart = value.slice(-4);

        return `${firstPart}...${lastPart}`;
    }
}

export class TransactionModel implements Transaction {
    amount: number; // 0.01
    asset: string; //ETH
    balance: number; // 0.05
    fiatAmount: number; // 38.00
    fiatBalance: number; // 199 usd
    fiatTotal: number; // 38.28
    gasFee: number; // 0.28
    network: string; // Ethereum
    price: number; // 3800
    receiver: any;
    sender: any;
    tokenType: string; // ERC-20

    constructor(data: any) {
        this.amount = Number(data.amount || 0);
        this.fiatAmount = Number(data.fiatAmount || 0);
        this.fiatTotal = data.fiatTotal || 0;
        this.gasFee = data.gasFee || 0;
        this.receiver = data.receiver || null;
        this.sender = data.sender || null;

        this.asset = data.asset || data.symbol || data.token.symbol || "";
        this.balance = data.balance || data.token?.amount || 0;
        this.fiatBalance = data.fiatBalance || data.token?.fiatBalance || 0;
        this.network = data.network || data.token.network || "";
        this.price = data.price || data.token?.price || 0;
        this.tokenType = data.tokenType || data.token?.tokenType || "";
    }
}

export class WalletModel implements Wallet {
    private _displayBtcAddress?: string;
    private _displayEthAddress?: string;
    private _displaySolanaAddress?: string;

    _id: string;
    anonymous: boolean;
    assets: Array<Asset>;
    btcAddress: string;
    ethAddress: string;
    hasPassword: boolean;
    image: string;
    ipfs: IPFS = {} as IPFS;
    metadata: any;
    name: string;
    pgp: PGP = {} as PGP;
    publicData: WalletPublicData;
    solanaAddress: string;
    zelfProof: string;
    zkProof: string;

    constructor(data: any = {}) {
        this._id = data._id;

        this.anonymous = data.anonymous || true;
        this.ipfs = (data.ipfs as IPFS) || ({} as IPFS);
        this.pgp = (data.pgp as PGP) || ({} as PGP);

        const secondaryStorage = data.publicData || {};

        if (this.ipfs.Timestamp) secondaryStorage.registeredAt = this.ipfs.Timestamp;

        this.publicData = new WalletPublicDataModel(secondaryStorage);

        this.hasPassword = Boolean(data.hasPassword || data.passwordLayer === "WithPassword" || secondaryStorage.hasPassword === "true");
        this.image = data.image || data.zelfProofQRCode || data.url;
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

    set displayBtcAddress(value: string) {
        this._displayBtcAddress = this._parseAddress(value);
    }

    set displayEthAddress(value: string) {
        this._displayEthAddress = this._parseAddress(value);
    }

    set displaySolanaAddress(value: string) {
        this._displaySolanaAddress = this._parseAddress(value);
    }

    private _parseAddress(value: string): string {
        const firstPart = value.slice(0, 4);
        const lastPart = value.slice(-4);

        return `${firstPart}...${lastPart}`;
    }
}

export class WalletPublicDataModel {
    private _isExpired: boolean;
    private _isExpiringSoon: boolean;

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

        this.btcAddress = data.btcAddress || "";
        this.ethAddress = data.ethAddress || "";
        this.expiresAt = data.expiresAt || "";
        this.registeredAt = data.registeredAt || "";
        this.solanaAddress = data.solanaAddress || "";
        this.type = data.type || "";
        this.zelfName = data.zelfName || "";

        if (this.zelfName) this.zelfName = this.zelfName.replace(".hold", "");

        this.isExpired = this._checkIsExpired(this.expiresAt);
        this.isExpiringSoon = this._checkIsExpiringSoon(this.expiresAt);
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
}
