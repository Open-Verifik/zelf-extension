export class WalletPublicDataModel {
	ethAddress: string;
	solanaAddress: string;
	_id: string;
	zelfName: string;

	constructor(data: any) {
		this.ethAddress = data.ethAddress || "";
		this.solanaAddress = data.solanaAddress || "";
		this._id = data._id || "offline";
		this.zelfName = data.zelfName;
	}
}

export class Asset {
	asset: string;
	balance: number;
	fiatBalance: number;
	price: number;

	constructor(data: any) {
		this.asset = data.asset || "NA";

		// Explicit check for balance
		this.balance =
			data.balance !== undefined && data.balance !== null
				? Number(parseFloat(data.balance).toFixed(7))
				: Number((data.fiatBalance / data.price).toFixed(6));

		this.fiatBalance = data.fiatBalance;

		this.price = data.price || 0; // hardcoded price
	}
}

export interface Wallet {
	name?: string;
	anonymous: boolean;
	ethAddress: string;
	displayEthAddress: string;
	solanaAddress: string;
	hasPassword: boolean;
	zelfProof: string;
	image: string;
	publicData: WalletPublicData;
	zkProof: string;
	_id: string;
	metadata: any;
	assets: Array<Asset>;
}

export class WalletModel implements Wallet {
	name?: string;
	anonymous: boolean;
	ethAddress: string;
	displayEthAddress: string;
	solanaAddress: string;
	displaySolanaAddress: string;
	hasPassword: boolean;
	zelfProof: string;
	image: string;
	publicData: WalletPublicData;
	zkProof: string;
	_id: string;
	metadata: any;
	assets: Array<Asset>;

	constructor(data: any = {}) {
		this.name = data.name || data.zelfName || data.publicData?.zelfName;

		this.anonymous = data.anonymous || true;

		const secondaryStorage = data.publicData || data.cleartext_data || {};

		this.ethAddress = data.ethAddress || secondaryStorage.ethAddress;

		this.displayEthAddress = "";

		this.displaySolanaAddress = "";

		if (this.ethAddress) {
			const firstPart = this.ethAddress.slice(0, 8);
			const lastPart = this.ethAddress.slice(-6);
			this.displayEthAddress = `${firstPart}...${lastPart}`;
		}

		this.solanaAddress = data.solanaAddress || secondaryStorage.solanaAddress;

		if (this.solanaAddress) {
			const firstPart = this.solanaAddress.slice(0, 8);
			const lastPart = this.solanaAddress.slice(-6);
			this.displaySolanaAddress = `${firstPart}...${lastPart}`;
		}

		this.hasPassword = Boolean(data.hasPassword || data.passwordLayer === "WithPassword" || data.publicData?.hasPassword === "true");
		this.zelfProof = data.zelfProof;
		this.image = data.image || data.zelfProofQRCode || data.url;
		this.publicData = secondaryStorage;
		this.zkProof = data.zkProof;
		this._id = data._id;
		this.metadata = data.metadata;

		this.assets = [];
	}
}

export interface WalletPublicData {
	ethAddress: string;
	solanaAddress: string;
	zelfName: string;
	_id: string;
}

export interface Transaction {
	receiver: any;
	sender: any;
	asset: string;

	amount: number;
	fiatAmount: number;

	fiatBalance: number;
	balance: number;

	price: number;
	gasFee: number;
	fiatTotal: number;

	network: string;
	tokenType: string;
}

export class TransactionModel implements Transaction {
	receiver: any;
	sender: any;

	asset: string; //ETH

	amount: number; // 0.01
	fiatAmount: number; // 38.00

	fiatBalance: number; // 199 usd
	balance: number; // 0.05

	price: number; // 3800
	gasFee: number; // 0.28
	fiatTotal: number; // 38.28

	network: string; // Ethereum
	tokenType: string; // ERC-20

	constructor(data: any) {
		console.log({ data });
		this.receiver = data.receiver || null;
		this.sender = data.sender || null;
		this.asset = data.asset || data.symbol || data.token.symbol || "";

		this.amount = Number(data.amount || 0);
		this.fiatAmount = Number(data.fiatAmount || 0);

		this.price = data.price || data.token.price || 0;

		this.fiatBalance = data.fiatBalance || data.token?.fiatBalance || 0;
		this.balance = data.balance || data.token?.amount || 0;

		this.gasFee = data.gasFee || 0;

		this.fiatTotal = data.fiatTotal || 0;

		this.network = data.network || data.token.network || "";
		this.tokenType = data.tokenType || data.token.tokenType || "";
	}
}

export class ETHTransaction {
	age: string;
	amount: string;
	fiatAmount: string;
	block: string;
	from: string;
	zelfProof: string;
	method: string;
	to: string;
	traffic: string;
	txnFee: string;
	asset: string;
	transactionId: string;
	_to: string;
	_from: string;
	_transactionId: string;

	constructor(data: any) {
		this.age = data.age;
		this.amount = data.amount;
		this.fiatAmount = data.fiatAmount;
		this.asset = data.asset;
		this.block = data.block;
		this.from = data.from;
		this.zelfProof = data.zelfProof;
		this.method = data.method;
		this.to = data.to;
		this._to = "";
		this._from = "";
		this.transactionId = data.hash;
		this._transactionId = "";

		if (this.to) {
			const firstPart = this.to.slice(0, 8);
			const lastPart = this.to.slice(-8);
			this._to = `${firstPart}...${lastPart}`;
		}

		if (this.from) {
			const firstPart = this.from.slice(0, 8);
			const lastPart = this.from.slice(-8);
			this._from = `${firstPart}...${lastPart}`;
		}

		if (this.transactionId) {
			const firstPart = this.transactionId.slice(0, 10);
			const lastPart = this.transactionId.slice(-10);
			this._transactionId = `${firstPart}...${lastPart}`;
		}

		this.traffic = data.traffic;

		this.txnFee = data.txnFee;
	}
}
