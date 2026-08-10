"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["default-shared_types_wallet_types_ts-src_app_asset_service_ts"],{

/***/ 56169
/*!**************************************!*\
  !*** ./shared/types/wallet.types.ts ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Asset: () => (/* binding */ Asset),
/* harmony export */   BitcoinTransactionModel: () => (/* binding */ BitcoinTransactionModel),
/* harmony export */   BlockDAGTransactionModel: () => (/* binding */ BlockDAGTransactionModel),
/* harmony export */   EthTransactionModel: () => (/* binding */ EthTransactionModel),
/* harmony export */   SuiTransactionModel: () => (/* binding */ SuiTransactionModel),
/* harmony export */   SwapData: () => (/* binding */ SwapData),
/* harmony export */   TransactionData: () => (/* binding */ TransactionData),
/* harmony export */   TransactionDetailModel: () => (/* binding */ TransactionDetailModel),
/* harmony export */   TransactionModel: () => (/* binding */ TransactionModel),
/* harmony export */   WalletModel: () => (/* binding */ WalletModel),
/* harmony export */   WalletPublicDataModel: () => (/* binding */ WalletPublicDataModel)
/* harmony export */ });
class Asset {
  asset;
  balance;
  fiatBalance;
  price;
  constructor(data) {
    this.asset = data.asset || "NA";
    this.balance = data.balance !== undefined && data.balance !== null ? Number(parseFloat(data.balance).toFixed(7)) : Number((data.fiatBalance / data.price).toFixed(6));
    this.fiatBalance = data.fiatBalance;
    this.price = data.price || 0; // hardcoded price
  }
}
class TransactionModel {
  age;
  amount; // 0.01
  asset; // ETH
  balance; // 0.05
  block;
  confirmations;
  date;
  fiatAmount;
  fiatBalance; // 199 usd
  fiatTotal; // 38.28
  from;
  gasFee; // 0.28
  hash;
  image;
  method;
  network; // Ethereum
  price; // 3800
  receiver;
  sender;
  status;
  symbol;
  to;
  tokenType; // ERC-20
  traffic;
  type;
  targetAddress;
  targetAmount;
  targetImage;
  targetNetwork;
  targetSymbol;
  targetToken;
  constructor(data) {
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
  get total() {
    return Number(this.amount) + Number(this.gasFee);
  }
}
class BitcoinTransactionModel {
  age;
  amount;
  amountSats;
  asset;
  block;
  date;
  decimals;
  fiatAmount;
  from;
  hash;
  logoURI;
  networkFeePayer;
  status;
  to;
  traffic;
  txnFee;
  txnFeeSats;
  constructor(data) {
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
  toTransaction() {
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
      type: this.traffic === "IN" ? "receive" : "send"
    });
  }
}
class SuiTransactionModel {
  age;
  amount;
  block;
  computationCostFee;
  confirmedNumber;
  date;
  from;
  gasBudget;
  gasPayment;
  gasPrice;
  hash;
  nonRefundableStorageFee;
  status;
  symbol = "SUI";
  to;
  tokenTransferNum;
  txFee;
  constructor(data) {
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
  toTransaction() {
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
      tokenType: "SUI"
    });
  }
}
class BlockDAGTransactionModel {
  blockNumber;
  confirmations;
  from;
  to;
  value;
  gas;
  gasPrice;
  gasUsed;
  nonce;
  input;
  hash;
  status;
  transactionIndex;
  constructor(data) {
    this.blockNumber = data.blockNumber || "N/A";
    this.confirmations = data.confirmations || "0";
    this.from = data.from || "";
    this.to = data.to || "";
    this.value = data.value || "0";
    this.gas = data.gas || 0;
    this.gasPrice = data.gasPrice || 0;
    this.gasUsed = data.gasUsed || 0;
    this.nonce = data.nonce || 0;
    this.input = data.input || "0x";
    this.hash = data.hash || "";
    this.status = data.status || "pending";
    this.transactionIndex = data.transactionIndex || 0;
  }
  toTransaction() {
    const transactionData = {
      age: this.confirmations,
      amount: Number(this.value),
      asset: "BDAG",
      block: String(this.blockNumber),
      date: new Date().toISOString(),
      fiatAmount: 0,
      // Will be calculated by frontend
      from: this.from,
      gasFee: String(this.gasUsed * this.gasPrice / 1e18),
      // Convert wei to BDAG
      hash: this.hash,
      image: "https://cryptologos.cc/logos/blockdag-bdag-logo.png",
      network: "blockdag",
      status: this.status.toLowerCase(),
      to: this.to,
      tokenType: "BDAG"
    };
    return new TransactionModel(transactionData);
  }
}
class EthTransactionModel {
  block;
  from;
  gasPrice;
  gweiETH;
  id;
  observation;
  status;
  symbol = "ETH";
  timestamp;
  to;
  transactionFeeDolar;
  transactionFeeETH;
  valueDolar;
  valueETH;
  constructor(data) {
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
  toTransaction() {
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
      tokenType: "ERC-20"
    });
  }
}
class TransactionDetailModel {
  age;
  amount;
  block;
  date;
  fiatAmount;
  from;
  gasPrice;
  gwei;
  hash;
  id;
  image;
  network;
  observation;
  status;
  symbol;
  timestamp;
  to;
  transactionFee;
  transactionFeeFiat;
  transactionType;
  tokensTransferred;
  constructor(data) {
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
    this.transactionType = (data.transactionType || "").toLowerCase();
  }
  toTransaction() {
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
      tokenType: this.network.toLowerCase() === "solana" ? "SPL" : this.network.toLowerCase() === "bitcoin" ? "BTC" : "ERC-20",
      type: this.transactionType
    };
    let additionalData = {};
    if (this.transactionType === "swap" || this.transactionType === "call") {
      transactionData.type = "swap";
      if (this.tokensTransferred.length === 0) {
        return new TransactionModel({
          ...transactionData,
          ...additionalData
        });
      }
      const firstTokenTransfer = this.tokensTransferred[0];
      const lastTokenTransfer = this.tokensTransferred[this.tokensTransferred.length - 1];
      // Source leg: first transfer (EVM previously used API root symbol/amount — wrong for USDC→AVAX etc.)
      const fromFirstLeg = {
        amount: firstTokenTransfer.amount,
        asset: firstTokenTransfer.symbol,
        image: firstTokenTransfer.icon,
        network: firstTokenTransfer.network,
        to: firstTokenTransfer.to
      };
      additionalData = {
        ...fromFirstLeg,
        targetAddress: lastTokenTransfer.to,
        targetAmount: lastTokenTransfer.amount,
        targetImage: lastTokenTransfer.icon,
        targetNetwork: lastTokenTransfer.network,
        targetSymbol: lastTokenTransfer.symbol,
        targetToken: lastTokenTransfer.token
      };
    } else if (this.tokensTransferred.length > 0) {
      const rootAmount = Number(this.amount);
      const rootSym = String(this.symbol || "").toUpperCase();
      const evmNativeSymbols = new Set(["ETH", "AVAX", "BNB", "MATIC", "POL"]);
      const keepRootNative = rootAmount > 0 && !Number.isNaN(rootAmount) && evmNativeSymbols.has(rootSym);
      if (!keepRootNative) {
        const lastTokenTransfer = this.tokensTransferred[this.tokensTransferred.length - 1];
        additionalData = {
          amount: lastTokenTransfer.amount,
          asset: lastTokenTransfer.symbol,
          image: lastTokenTransfer.icon,
          network: lastTokenTransfer.network,
          to: lastTokenTransfer.to
        };
      }
    }
    return new TransactionModel({
      ...transactionData,
      ...additionalData
    });
  }
}
class WalletModel {
  _displayBtcAddress;
  _displayEthAddress;
  _displaySolanaAddress;
  _displaySuiAddress;
  _id;
  available = false;
  anonymous;
  assets;
  btcAddress;
  durationToken;
  ethAddress;
  hasPassword;
  image;
  ipfs = {};
  metadata;
  name;
  pgp = undefined;
  publicData;
  solanaAddress;
  suiAddress;
  zelfProof;
  zkProof;
  constructor(data = {}) {
    this._id = data._id;
    this.available = data.available || false;
    this.anonymous = data.anonymous || true;
    this.ipfs = data.ipfs || {};
    this.pgp = data.pgp || undefined;
    const secondaryStorage = data.publicData || {};
    this.publicData = new WalletPublicDataModel(secondaryStorage);
    this.durationToken = data.durationToken;
    this.hasPassword = Boolean(data.hasPassword || data.passwordLayer === "WithPassword" || secondaryStorage.hasPassword === "true");
    this.image = data.image || data.url || data.zelfProofQRCode;
    this.metadata = data.metadata;
    this.zelfProof = data.zelfProof || secondaryStorage.zelfProof;
    this.zkProof = data.zkProof;
    this.name = data.name || data.tagName || secondaryStorage.tagName ? `${data.name || data.tagName || secondaryStorage.tagName}`.toLowerCase() : "";
    if (!this.publicData?.tagName) this.publicData.tagName = this.name;
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
  get displayBtcAddress() {
    return this._displayBtcAddress || "";
  }
  get displayEthAddress() {
    return this._displayEthAddress || "";
  }
  get displaySolanaAddress() {
    return this._displaySolanaAddress || "";
  }
  get displaySuiAddress() {
    return this._displaySuiAddress || "";
  }
  set displayBtcAddress(value) {
    this._displayBtcAddress = this._parseAddress(value);
  }
  set displayEthAddress(value) {
    this._displayEthAddress = this._parseAddress(value);
  }
  set displaySolanaAddress(value) {
    this._displaySolanaAddress = this._parseAddress(value);
  }
  set displaySuiAddress(value) {
    this._displaySuiAddress = this._parseAddress(value);
  }
  _parseAddress(value) {
    const firstPart = value.slice(0, 8);
    const lastPart = value.slice(-8);
    return `${firstPart}...${lastPart}`;
  }
  updatePublicData(data) {
    this.publicData = new WalletPublicDataModel({
      ...this.publicData,
      ...data
    });
  }
}
class WalletPublicDataModel {
  _id;
  blockDAGAddress;
  btcAddress;
  ethAddress;
  expiresAt;
  gracePeriod;
  origin;
  registeredAt;
  solanaAddress;
  suiAddress;
  type;
  tagName;
  constructor(data) {
    this._id = data._id || "offline";
    this.blockDAGAddress = data.blockDAGAddress || "";
    this.btcAddress = data.btcAddress || "";
    this.ethAddress = data.ethAddress || "";
    this.expiresAt = data.expiresAt || "";
    this.origin = data.origin || "";
    this.registeredAt = data.registeredAt || "";
    this.solanaAddress = data.solanaAddress || "";
    this.suiAddress = data.suiAddress || "";
    this.type = data.type || "";
    this.tagName = data.tagName || "";
    if (!this.type) data.zelfName ? data.zelfName?.includes(".hold") ? this.type = "hold" : this.type = "mainnet" : "";
    if (this.tagName) this.tagName = this.tagName.replace(".hold", "");
    this.gracePeriod = this._calculateGracePeriod();
  }
  get isExpired() {
    return this._checkIsExpired();
  }
  get isExpiringSoon() {
    return this._checkIsExpiringSoon();
  }
  get isFullyExpired() {
    return this._checkIsFullyExpired();
  }
  get isInGracePeriod() {
    if (this.type !== "mainnet" || !this.gracePeriod) return false;
    const now = new Date();
    return now < this.gracePeriod && now > new Date(this.expiresAt);
  }
  _calculateGracePeriod() {
    if (this.type !== "mainnet") return null;
    const gracePeriod = new Date(this.expiresAt);
    gracePeriod.setDate(gracePeriod.getDate() + 30);
    return gracePeriod;
  }
  _checkIsExpired() {
    const timeLeft = this._timeRemaining();
    return timeLeft <= 0;
  }
  _checkIsExpiringSoon() {
    const oneMonthInMs = 24 * 60 * 60 * 1000 * 30;
    const timeLeft = this._timeRemaining();
    return timeLeft > 0 && timeLeft <= oneMonthInMs;
  }
  _checkIsFullyExpired() {
    return this.isExpired && !this.isInGracePeriod;
  }
  _timeRemaining() {
    const expiresAtTime = new Date(this.expiresAt).getTime();
    return expiresAtTime - Date.now();
  }
  timeLeftInGracePeriodSeconds() {
    if (this.type !== "mainnet" || !this.gracePeriod) return 0;
    const now = new Date().getTime();
    const gracePeriodEnd = this.gracePeriod.getTime() * 24 * 60 * 60 * 1000;
    return Math.max(0, Math.floor((gracePeriodEnd - now) / 1000));
  }
}
class TransactionData {
  amount = 0;
  fee = 0;
  fiatAmount = 0;
  fiatFee = 0;
  receiver = {};
  sender = {};
  token = {};
  total = 0;
  memo;
  constructor(data = {}) {
    this.amount = data.amount || 0;
    this.fee = data.fee || 0;
    this.fiatAmount = data.fiatAmount || 0;
    this.fiatFee = data.fiatFee || 0;
    this.receiver = data.receiver || {};
    this.sender = data.sender || {};
    this.token = data.token || {};
    this.total = data.total || 0;
    this.memo = data.memo;
  }
  get hasCompletePaymentData() {
    return this.hasAmount && this.hasReceiver && this.hasSender && this.hasToken;
  }
  get hasTransactionData() {
    return this.hasToken && this.hasSender;
  }
  get hasToken() {
    return !!this.token && Object.keys(this.token).length > 0;
  }
  get hasSender() {
    return !!this.sender && !!this.sender?.address;
  }
  get hasAmount() {
    return !!this.amount && (typeof this.amount === "number" ? this.amount > 0 : typeof this.amount === "string" ? parseFloat(this.amount) > 0 : false);
  }
  get hasReceiver() {
    return !!this.receiver && Object.keys(this.receiver).length > 0;
  }
  get balance() {
    return this.token?.amount || 0;
  }
  get fiatBalance() {
    return this.token?.fiatBalance || 0;
  }
  get network() {
    return (this.token?.network || "").toLowerCase();
  }
  get tokenType() {
    return this.token?.tokenType || "";
  }
  get symbol() {
    return this.token?.symbol || "";
  }
  get tokenName() {
    return this.token?.name || "";
  }
  get receiverSymbol() {
    return this.receiver?.symbol || this.token?.symbol || "";
  }
  get receiverTokenType() {
    return this.receiver?.tokenType || this.token?.tokenType || "";
  }
  get isEthToken() {
    return this.tokenType === "ETH" || this.tokenType === "ERC-20";
  }
  get isPolToken() {
    return this.tokenType === "POL" || this.tokenType === "MATIC";
  }
  get isBscToken() {
    return this.tokenType === "BSC" || this.tokenType === "BNB" || this.tokenType === "BEP-20";
  }
  get isAvaxToken() {
    return this.tokenType === "AVAX";
  }
  get isSolToken() {
    return this.tokenType === "SOL" || this.tokenType === "SPL" || this.network === "solana";
  }
  get isBtcToken() {
    return this.tokenType === "BTC";
  }
  get isBDAGToken() {
    return this.tokenType === "BDAG" || this.tokenType === "BLOCKDAG";
  }
  get isSuiToken() {
    return this.tokenType === "SUI" || this.tokenType === "SUI_TOKEN";
  }
  get isXlmToken() {
    return this.tokenType === "XLM" && this.network === "stellar";
  }
  /** Native DOT on Polkadot relay (public profile `dotAddress`). */
  get isDotToken() {
    return this.tokenType === "DOT" && this.network === "polkadot";
  }
  /** Native KSM on Kusama relay (public profile `ksmAddress`). */
  get isKsmToken() {
    return this.tokenType === "KSM" && this.network === "kusama";
  }
  get senderFullTagName() {
    return this.sender?.fullTagName || (this.sender?.domain ? `${this.sender?.tagName}.${this.sender?.domain}` : this.sender?.tagName || "");
  }
  get receiverFullTagName() {
    return this.receiver?.fullTagName || (this.receiver?.domain ? `${this.receiver?.tagName}.${this.receiver?.domain}` : this.receiver?.tagName || "");
  }
}
class SwapData {
  bridge;
  commission;
  commissionToggle;
  fee;
  password;
  slippage;
  slippageToggle;
  sourceAmount;
  sourceAsset;
  targetAmount;
  targetAsset;
  targetSwapValue;
  /** Persisted swap tab: same-chain vs cross-chain (vault / biometrics return). */
  swapFlowMode;
  /** Global NET filter when set; null = all networks. */
  selectedSwapNetworkId;
  constructor(data = {}) {
    this.bridge = data.bridge || "";
    this.commission = data.commission || 0;
    this.commissionToggle = data.commissionToggle || false;
    this.fee = data.fee || 0;
    this.password = data.password || "";
    this.slippage = data.slippage || 0;
    this.slippageToggle = data.slippageToggle || false;
    this.sourceAmount = data.sourceAmount || 0;
    this.sourceAsset = data.sourceAsset || {};
    this.targetAmount = data.targetAmount || 0;
    this.targetAsset = data.targetAsset || {};
    this.targetSwapValue = data.targetSwapValue || 0;
    this.swapFlowMode = data.swapFlowMode === "cross_chain" ? "cross_chain" : "swaps";
    const sid = data.selectedSwapNetworkId;
    this.selectedSwapNetworkId = sid === undefined || sid === null || sid === "" ? null : String(sid);
  }
  get hasSwapData() {
    return Object.keys(this.sourceAsset).length > 0 && Object.keys(this.targetAsset).length > 0;
  }
}

/***/ },

/***/ 25931
/*!**********************************!*\
  !*** ./src/app/asset.service.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AssetService: () => (/* binding */ AssetService)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 43942);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 75797);
/* harmony import */ var environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _chrome_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./chrome.service */ 85043);
/* harmony import */ var _http_wrapper_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./http-wrapper.service */ 84099);






/** Solana wrapped SOL (SPL) mint — must not share native `SOL` tokenType with lamports balance */
const WSOL_MINT = "So11111111111111111111111111111111111111112";
class AssetService {
  _chromeService;
  _httpWrapperService;
  _baseUrl = `${environments_environment__WEBPACK_IMPORTED_MODULE_3__.environment.apiUrl}/api/asset`;
  _sourceAsset = {};
  _sourceAsset$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.BehaviorSubject({});
  _targetAsset = {};
  _targetAsset$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.BehaviorSubject({});
  constructor(_chromeService, _httpWrapperService) {
    this._chromeService = _chromeService;
    this._httpWrapperService = _httpWrapperService;
    this._chromeService.getItem("sourceAsset").then(asset => {
      if (asset) this.setSourceAsset(asset);
    });
    this._chromeService.getItem("targetAsset").then(asset => {
      if (asset) this.setTargetAsset(asset);
    });
  }
  get sourceAsset$() {
    return this._sourceAsset$.asObservable();
  }
  get sourceAsset() {
    return this._sourceAsset;
  }
  get targetAsset$() {
    return this._targetAsset$.asObservable();
  }
  get targetAsset() {
    return this._targetAsset;
  }
  get canSwap() {
    return {
      AVAX: true,
      BDAG: false,
      BNB: true,
      BTC: false,
      ETH: true,
      POL: true,
      SOL: true,
      SUI: true,
      TON: false,
      XLM: true
    };
  }
  get canSend() {
    return {
      AVAX: true,
      BDAG: true,
      BNB: true,
      BTC: true,
      DOT: true,
      ETH: true,
      KSM: true,
      POL: true,
      SOL: true,
      SUI: true,
      TON: false,
      XLM: true
    };
  }
  get intervals() {
    return [{
      label: "1D",
      range: "1d"
    }, {
      label: "7D",
      range: "7d"
    }, {
      label: "1M",
      range: "1M"
    }, {
      label: "1Y",
      range: "1y"
    }];
  }
  get rangeIntervalMap() {
    return {
      "1d": "5m",
      "7d": "15m",
      "1M": "1h",
      "1y": "1d"
    };
  }
  _isWrappedSolToken(token) {
    const mint = `${token.tokenAddress || token.mint || ""}`.trim();
    if (mint === WSOL_MINT) return true;
    const name = `${token.name || ""}`.toUpperCase();
    return name === "WRAPPED SOL" || name.includes("WRAPPED SOL");
  }
  _determineTokenType(token, network) {
    if (network === "Solana" && this._isWrappedSolToken(token)) {
      return "SPL";
    }
    // If token already has a tokenType, use it
    if (token.tokenType && token.tokenType !== "ERC-20") return token.tokenType;
    // Check if this is a native token
    if (this._isNativeToken(token, network)) {
      switch (network) {
        case "Ethereum":
          return "ETH";
        case "Avalanche":
          return "AVAX";
        case "Solana":
          return "SOL";
        case "Bitcoin":
          return "BTC";
        case "Sui":
          return "SUI";
        case "Ton":
          return "TON";
        case "Binance":
          return "BNB";
        case "Polygon":
          return "MATIC";
        case "Stellar":
          return "XLM";
        case "Polkadot":
          return "DOT";
        case "Kusama":
          return "KSM";
        default:
          return "NATIVE";
      }
    }
    // Return appropriate non-native token type for each network
    switch (network) {
      case "Ethereum":
      case "Avalanche":
      case "Polygon":
        return "ERC-20";
      case "Binance":
        return "BEP-20";
      case "Solana":
        return "SPL";
      case "Sui":
        return "SUI-TOKEN";
      case "Ton":
        return "JETTON";
      case "Bitcoin":
        return "BTC-TOKEN";
      default:
        return "TOKEN";
    }
  }
  _isNativeToken(token, network) {
    const nativeTokenSymbols = {
      Avalanche: ["AVAX", "AVALANCHE"],
      Binance: ["BNB", "BINANCE", "BSC"],
      Bitcoin: ["BTC", "BITCOIN"],
      Ethereum: ["ETH", "ETHEREUM"],
      Polygon: ["MATIC", "POLYGON", "POL"],
      Solana: ["SOL", "SOLANA"],
      Stellar: ["XLM", "STELLAR"],
      Sui: ["SUI", "SUI-TOKEN"],
      Ton: ["TON", "TONCOIN"],
      Polkadot: ["DOT", "POLKADOT"],
      Kusama: ["KSM", "KUSAMA"]
    };
    const networkNativeSymbols = nativeTokenSymbols[network] || [];
    const tokenSymbol = token.symbol?.toUpperCase();
    const tokenName = token.name?.toUpperCase();
    return networkNativeSymbols.some(nativeSymbol => tokenSymbol === nativeSymbol || tokenName === nativeSymbol);
  }
  _setStartEndDates(range) {
    const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0].replace(/-/g, "-");
    let startDate = "";
    switch (range) {
      case "1d":
        startDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0].replace(/-/g, "-");
        break;
      case "7d":
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0].replace(/-/g, "-");
        break;
      case "1M":
        startDate = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0].replace(/-/g, "-");
        break;
      case "1y":
        startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split("T")[0].replace(/-/g, "-");
        break;
      default:
        throw new Error("Invalid range");
    }
    return {
      startDate,
      endDate
    };
  }
  fetchAssetDetails(symbol, interval, limit = 50) {
    return this._httpWrapperService.sendRequest("get", `${this._baseUrl}/${symbol.toUpperCase()}/USD`, {
      interval,
      limit
    });
  }
  fetchAssetChart(symbol, range) {
    if (symbol === "BDAG") {
      return new rxjs__WEBPACK_IMPORTED_MODULE_1__.Observable(observer => {
        observer.next({
          data: []
        });
        observer.complete();
      });
    }
    const interval = this.rangeIntervalMap[range];
    const {
      startDate,
      endDate
    } = this._setStartEndDates(range);
    return this._httpWrapperService.sendRequest("get", `${this._baseUrl}/chart/${symbol.toUpperCase()}`, {
      interval,
      startDate,
      endDate
    });
  }
  fetchAssetPrice(symbol) {
    if (symbol === "BDAG") {
      return new rxjs__WEBPACK_IMPORTED_MODULE_1__.Observable(observer => {
        observer.next({
          data: []
        });
        observer.complete();
      });
    }
    return this._httpWrapperService.sendRequest("get", `${this._baseUrl}/chart/${symbol.toUpperCase()}`, {
      interval: "1m",
      limit: 1
    });
  }
  setSourceAsset(asset) {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this._chromeService.setItem("sourceAsset", asset);
      _this._sourceAsset = asset;
      _this._sourceAsset$.next(asset);
    })();
  }
  setTargetAsset(asset) {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this2._chromeService.setItem("targetAsset", asset);
      _this2._targetAsset = asset;
      _this2._targetAsset$.next(asset);
    })();
  }
  removeSourceAsset() {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this3._chromeService.removeItem("sourceAsset");
      _this3._sourceAsset = {};
      _this3._sourceAsset$.next(_this3._sourceAsset);
    })();
  }
  loadTokensFromSession() {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const sessionTokenTtl = yield _this4._chromeService.getItemSession("tokensTtl");
      if (!sessionTokenTtl || sessionTokenTtl <= Date.now()) return [];
      const sessionTokens = yield _this4._chromeService.getItemSession("tokens");
      if (!sessionTokens || !sessionTokens.length) return [];
      return sessionTokens;
    })();
  }
  saveTokensToSession(tokens) {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this5._chromeService.setItemSession("tokens", tokens);
      _this5._chromeService.setItemSession("tokensTtl", Date.now() + 3600000);
    })();
  }
  isNativeToken(token, network) {
    return this._isNativeToken(token, network);
  }
  processTokens(network, tokens, processedTokens = [], permissions) {
    for (const token of tokens) {
      if (!token.symbol && !token.name || /^nft/i.test(token?.tokenType)) continue;
      if (permissions) {
        if (network === "Ethereum" && !permissions.ETH || network === "Solana" && !permissions.SOL || network === "Bitcoin" && !permissions.BTC || network === "Avalanche" && !permissions.AVAX || network === "BlockDAG" && !permissions.BDAG || network === "Sui" && !permissions.SUI || network === "Ton" && !permissions.TON || network === "Binance" && !permissions.BNB || network === "Polygon" && !permissions.POL || network === "Stellar" && !permissions.XLM || network === "Polkadot" && !permissions.DOT || network === "Kusama" && !permissions.KSM) {
          continue;
        }
      }
      const determinedTokenType = this._determineTokenType(token, network);
      const balance = parseFloat(token.balance || token.amount || "0");
      const formattedToken = {
        ...token,
        balance,
        amount: balance,
        fiatBalance: token.fiatBalance !== null ? parseFloat(token.fiatBalance || "0") : null,
        image: token.image || (determinedTokenType === "AVAX" ? "assets/networks/avax.png" : token.image),
        network,
        price: parseFloat(token.price || "0"),
        tokenType: determinedTokenType,
        isWrappedSol: network === "Solana" && this._isWrappedSolToken(token)
      };
      const tokenKey = `${formattedToken.symbol}-${formattedToken.network}-${formattedToken.tokenType}`;
      const existingTokenIndex = processedTokens.findIndex(t => `${t.symbol}-${t.network}-${t.tokenType}` === tokenKey);
      if (existingTokenIndex === -1) {
        processedTokens.push(formattedToken);
      } else {
        processedTokens[existingTokenIndex] = formattedToken;
      }
    }
    return processedTokens;
  }
  processTokensFromResponse(response, permissions) {
    var _this6 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      let tokens = [];
      if (response?.ethereum?.data?.tokenHoldings?.tokens && (!permissions || permissions.ETH)) {
        tokens = _this6.processTokens("Ethereum", response.ethereum.data.tokenHoldings.tokens, tokens, permissions);
      }
      if (response?.solana?.data?.tokenHoldings?.tokens && (!permissions || permissions.SOL)) {
        tokens = _this6.processTokens("Solana", response.solana.data.tokenHoldings.tokens, tokens, permissions);
      }
      if (response?.avalanche?.data?.tokenHoldings?.tokens && (!permissions || permissions.AVAX)) {
        tokens = _this6.processTokens("Avalanche", response.avalanche.data.tokenHoldings.tokens, tokens, permissions);
      }
      if (response?.binance?.data?.tokenHoldings?.tokens && (!permissions || permissions.BNB)) {
        tokens = _this6.processTokens("Binance", response.binance.data.tokenHoldings.tokens, tokens, permissions);
      }
      if (response?.blockdag?.data?.tokenHoldings?.tokens && (!permissions || permissions.BDAG)) {
        tokens = _this6.processTokens("BlockDAG", response.blockdag.data.tokenHoldings.tokens, tokens, permissions);
      }
      if (response?.polygon?.data?.tokenHoldings?.tokens && (!permissions || permissions.POL)) {
        tokens = _this6.processTokens("Polygon", response.polygon.data.tokenHoldings.tokens, tokens, permissions);
      }
      if (response?.sui?.data?.tokenHoldings?.tokens && (!permissions || permissions.SUI)) {
        tokens = _this6.processTokens("Sui", response.sui.data.tokenHoldings.tokens, tokens, permissions);
      }
      if (response?.ton?.data?.tokenHoldings?.tokens && (!permissions || permissions.TON)) {
        tokens = _this6.processTokens("Ton", response.ton.data.tokenHoldings.tokens, tokens, permissions);
      }
      if (response?.polkadot?.data?.tokenHoldings?.tokens && (!permissions || permissions.DOT)) {
        tokens = _this6.processTokens("Polkadot", response.polkadot.data.tokenHoldings.tokens, tokens, permissions);
      }
      if (response?.kusama?.data?.tokenHoldings?.tokens && (!permissions || permissions.KSM)) {
        tokens = _this6.processTokens("Kusama", response.kusama.data.tokenHoldings.tokens, tokens, permissions);
      }
      if (response?.stellar?.data && (!permissions || permissions.XLM)) {
        tokens = _this6._processStellarTokens(response.stellar.data, tokens, permissions);
      }
      if (response?.bitcoin?.data?.tokenHoldings?.tokens && (!permissions || permissions.BTC)) {
        tokens = _this6.processTokens("Bitcoin", response.bitcoin.data.tokenHoldings.tokens, tokens, permissions);
      }
      if (response?.bitcoinTestnet?.data?.tokenHoldings?.tokens && (!permissions || permissions.BTC)) {
        tokens = _this6.processTokens("Bitcoin", response.bitcoinTestnet.data.tokenHoldings.tokens, tokens, permissions);
      }
      // Get pinned tokens and add isPinned flag
      const pinnedTokens = yield _this6.getPinnedTokens();
      tokens = tokens.map(token => ({
        ...token,
        isPinned: pinnedTokens.includes(_this6._getTokenKey(token))
      }));
      // Sort: pinned tokens first, then by fiat balance
      tokens.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.fiatBalance - a.fiatBalance;
      });
      if (!permissions) yield _this6.saveTokensToSession(tokens);
      return {
        tokens,
        totalFiatBalance: tokens.reduce((acc, token) => acc + (token.fiatBalance || 0), 0)
      };
    })();
  }
  _processStellarTokens(stellarData, tokens, permissions) {
    const xlmBalance = parseFloat(stellarData.balance || "0") || 0;
    const xlmFiat = parseFloat(stellarData.fiatBalance || stellarData.account?.fiatValue || "0") || 0;
    const xlmPrice = parseFloat(stellarData.account?.price || "0") || 0;
    const xlmToken = {
      symbol: "XLM",
      name: "Stellar",
      balance: xlmBalance,
      fiatBalance: xlmFiat,
      price: xlmPrice,
      asset: "XLM",
      decimals: 7
    };
    let result = this.processTokens("Stellar", [xlmToken], tokens, permissions);
    if (stellarData.tokenHoldings?.tokens?.length) {
      result = this.processTokens("Stellar", stellarData.tokenHoldings.tokens, result, permissions);
    }
    return result;
  }
  _getTokenKey(token) {
    return `${token.symbol}-${token.network}-${token.tokenType}`;
  }
  getPinnedTokens() {
    var _this7 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const pinned = yield _this7._chromeService.getItem("pinnedTokens");
        return pinned || [];
      } catch (error) {
        console.error("Error getting pinned tokens:", error);
        return [];
      }
    })();
  }
  pinToken(token) {
    var _this8 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const pinnedTokens = yield _this8.getPinnedTokens();
        const tokenKey = _this8._getTokenKey(token);
        if (!pinnedTokens.includes(tokenKey)) {
          pinnedTokens.push(tokenKey);
          yield _this8._chromeService.setItem("pinnedTokens", pinnedTokens);
        }
      } catch (error) {
        console.error("Error pinning token:", error);
      }
    })();
  }
  unpinToken(token) {
    var _this9 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const pinnedTokens = yield _this9.getPinnedTokens();
        const tokenKey = _this9._getTokenKey(token);
        const filtered = pinnedTokens.filter(key => key !== tokenKey);
        yield _this9._chromeService.setItem("pinnedTokens", filtered);
      } catch (error) {
        console.error("Error unpinning token:", error);
      }
    })();
  }
  togglePinToken(token) {
    var _this0 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const pinnedTokens = yield _this0.getPinnedTokens();
      const tokenKey = _this0._getTokenKey(token);
      const isPinned = pinnedTokens.includes(tokenKey);
      if (isPinned) {
        yield _this0.unpinToken(token);
      } else {
        yield _this0.pinToken(token);
      }
      return !isPinned;
    })();
  }
  static ɵfac = function AssetService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AssetService)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_chrome_service__WEBPACK_IMPORTED_MODULE_5__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_http_wrapper_service__WEBPACK_IMPORTED_MODULE_6__.HttpWrapperService));
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({
    token: AssetService,
    factory: AssetService.ɵfac,
    providedIn: "root"
  });
}

/***/ }

}]);
//# sourceMappingURL=default-shared_types_wallet_types_ts-src_app_asset_service_ts.js.map