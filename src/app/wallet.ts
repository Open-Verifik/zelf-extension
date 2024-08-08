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

	constructor(data: any) {
		this.asset = data.asset || "NA";

		this.balance = data.balance || 0;
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
