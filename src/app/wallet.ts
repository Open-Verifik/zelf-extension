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

export interface Wallet {
	name?: string;
	anonymous: boolean;
	ethAddress: string;
	solanaAddress: string;
	hasPassword: boolean;
	hash: string;
	image: string;
	publicData: WalletPublicData;
	zkProof: string;
	_id: string;
	metadata: any;
}

export class WalletModel implements Wallet {
	name?: string;
	anonymous: boolean;
	ethAddress: string;
	solanaAddress: string;
	hasPassword: boolean;
	hash: string;
	image: string;
	publicData: WalletPublicData;
	zkProof: string;
	_id: string;
	metadata: any;

	constructor(data: any) {
		this.name = data.name;
		this.anonymous = data.anonymous || true;
		this.ethAddress = data.ethAddress || data.publicData.ethAddress;
		this.solanaAddress = data.solanaAddress || data.publicData.solanaAddress;
		this.hasPassword = data.hasPassword || Boolean(data.type === "WithPassword");
		this.hash = data.hash;
		this.image = data.image;
		this.publicData = data.publicData || data.clear_text_data;
		this.zkProof = data.zkProof;
		this._id = data._id;
		this.metadata = data.metadata;
	}
}

export interface WalletPublicData {
	ethAddress: string;
	solanaAddress: string;
	_id: string;
}
