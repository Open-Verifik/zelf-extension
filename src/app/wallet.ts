export class WalletPublicDataModel {
	ethAddress: string;
	solanaAddress: string;
	_id: string;

	constructor(data: any) {
		this.ethAddress = data.ethAddress || "";
		this.solanaAddress = data.solanaAddress || "";
		this._id = data._id || "offline";
	}
}

export class Asset {
	asset: string;
	balance: number;
	price: number;

	constructor(data: any) {
		this.asset = data.asset || "NA";

		this.balance = data.balance || 0;

		this.price = data.price || 2558.33; // hardcoded price
	}
}

export interface Wallet {
	name?: string;
	anonymous: boolean;
	ethAddress: string;
	displayEthAddress: string;
	solanaAddress: string;
	hasPassword: boolean;
	hash: string;
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
	hasPassword: boolean;
	hash: string;
	image: string;
	publicData: WalletPublicData;
	zkProof: string;
	_id: string;
	metadata: any;
	assets: Array<Asset>;

	constructor(data: any = {}) {
		this.name =
			["Account NaN", "Account 1"].includes(data.name) && data.index !== undefined ? `Account ${data.index + 1}` : data.name || "Account";

		this.anonymous = data.anonymous || true;

		const secondaryStorage = data.publicData || data.cleartext_data || {};

		this.ethAddress = data.ethAddress || secondaryStorage.ethAddress;

		this.displayEthAddress = "";

		if (this.ethAddress) {
			const firstPart = this.ethAddress.slice(0, 8);
			const lastPart = this.ethAddress.slice(-6);
			this.displayEthAddress = `${firstPart}...${lastPart}`;
		}

		this.solanaAddress = data.solanaAddress || secondaryStorage.solanaAddress;
		this.hasPassword = data.hasPassword || Boolean(data.type === "WithPassword");
		this.hash = data.hash;
		this.image = data.image;
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
	_id: string;
}

export interface Transaction {
	receiver: any;
	sender: any;
	asset: string;
	amount: number;
	price: number;
	balance: number;
	gasFee: number;
	total: number;
}

export class TransactionModel implements Transaction {
	receiver: any;
	sender: any;
	asset: string;
	amount: number;
	price: number;
	balance: number;
	gasFee: number;
	total: number;

	constructor(data: any) {
		this.receiver = data.receiver || null;
		this.sender = data.sender || null;
		this.asset = data.asset || null;
		this.amount = data.amount || 0;
		this.price = data.price || 0;
		this.balance = data.balance || 0;
		this.gasFee = data.gasFee || 0;
		this.total = data.total || this.price + this.gasFee;
	}
}
