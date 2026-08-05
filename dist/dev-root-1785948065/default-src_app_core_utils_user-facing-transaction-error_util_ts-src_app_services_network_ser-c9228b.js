"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["default-src_app_core_utils_user-facing-transaction-error_util_ts-src_app_services_network_ser-c9228b"],{

/***/ 50276
/*!******************************************************************!*\
  !*** ./src/app/core/utils/user-facing-transaction-error.util.ts ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mapTransactionErrorToTranslationKey: () => (/* binding */ mapTransactionErrorToTranslationKey)
/* harmony export */ });
/**
 * Maps an arbitrary error thrown during a send/swap transaction to a stable
 * Transloco key. The goal is that the snackbar never shows raw `Error.message`
 * coming from ethers / web3 / RPC — those leak JSON-RPC payloads and provider
 * internals into the UI (see the Polygon `eth_getTransactionCount` regression).
 *
 * Always returns a key — never the original message. Callers should
 * `console.error` the original error themselves for debugging.
 */
function mapTransactionErrorToTranslationKey(error) {
  if (error instanceof Object) {
    const ethersKey = mapEthersError(error);
    if (ethersKey) return ethersKey;
  }
  if (looksLikeRpcOrTransportNoise(error)) {
    return "errors.send_transaction_network_error";
  }
  const messageKey = mapKnownErrorMessage(extractMessage(error));
  if (messageKey) return messageKey;
  return "errors.something_went_wrong";
}
const KNOWN_ERROR_KEYS = new Set(["errors.empty_password", "errors.insufficient_funds", "errors.invalid_credentials", "errors.invalid_private_key", "errors.private_key_locked", "errors.same_address", "errors.send_transaction_network_error", "errors.send_transaction_user_rejected", "errors.something_went_wrong"]);
/** Allows callers (e.g. an inner layer) to throw with a translation key directly. */
function mapKnownErrorMessage(message) {
  if (!message) return null;
  if (KNOWN_ERROR_KEYS.has(message)) return message;
  return null;
}
/**
 * ethers v6 `isError` lives in the same package as the wallet code; importing
 * it from this util pulled `ethers` into the same chunk graph as standalone
 * route components and triggered "Cannot access … before initialization" /
 * spurious "Cannot find module" chunk errors. We only need the `code` string
 * (ErrorCode) for mapping.
 */
const ETHERS_ERROR_CODE_TO_KEY = {
  INSUFFICIENT_FUNDS: "errors.insufficient_funds",
  ACTION_REJECTED: "errors.send_transaction_user_rejected",
  NETWORK_ERROR: "errors.send_transaction_network_error",
  TIMEOUT: "errors.send_transaction_network_error",
  SERVER_ERROR: "errors.send_transaction_network_error",
  BAD_DATA: "errors.send_transaction_network_error",
  NONCE_EXPIRED: "errors.send_transaction_network_error",
  REPLACEMENT_UNDERPRICED: "errors.send_transaction_network_error",
  UNCONFIGURED_NAME: "errors.send_transaction_network_error"
};
function mapEthersError(error) {
  const code = error.code;
  if (typeof code !== "string") return null;
  return ETHERS_ERROR_CODE_TO_KEY[code] ?? null;
}
const RPC_NOISE_HINTS = ["jsonrpc", "json-rpc", "code=bad_data", "missing response for request", "missing revert data", "could not coalesce error", "eth_gettransactioncount", "eth_sendrawtransaction", "eth_estimategas", "eth_call", "eth_getlogs", "could not detect network", "underlying network changed", "value\" must be of type", "code=server_error", "code=network_error", "code=timeout"];
function looksLikeRpcOrTransportNoise(error) {
  const haystack = serializeForHeuristics(error).toLowerCase();
  if (!haystack) return false;
  if (RPC_NOISE_HINTS.some(hint => haystack.includes(hint))) return true;
  if (haystack.length > 240) return true;
  return false;
}
function extractMessage(error) {
  if (!error) return "";
  if (typeof error === "string") return error.trim();
  if (typeof error === "object" && "message" in error) {
    const value = error.message;
    if (typeof value === "string") return value.trim();
  }
  return "";
}
function serializeForHeuristics(error) {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (typeof error !== "object") return String(error);
  const parts = [];
  const message = extractMessage(error);
  if (message) parts.push(message);
  const code = error.code;
  if (code != null) parts.push(`code=${String(code)}`);
  try {
    parts.push(JSON.stringify(error, jsonReplacer));
  } catch {
    // Cyclic or unserializable errors fall through to the message-only haystack.
  }
  return parts.join(" ");
}
function jsonReplacer(_key, value) {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message
    };
  }
  if (typeof value === "bigint") return value.toString();
  return value;
}

/***/ },

/***/ 32404
/*!*********************************************!*\
  !*** ./src/app/services/network.service.ts ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NetworkService: () => (/* binding */ NetworkService)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var app_chrome_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/chrome.service */ 85043);



class NetworkService {
  _chromeService;
  constructor(_chromeService) {
    this._chromeService = _chromeService;
  }
  getNetworkSymbol(network) {
    switch (network) {
      case "ethereum":
        return "ETH";
      case "sui":
        return "SUI";
      case "ton":
        return "TON";
      case "polygon":
        return "POL";
      case "avalanche":
        return "AVAX";
      case "bitcoin":
        return "BTC";
      case "blockdag":
        return "BDAG";
      case "binance":
        return "BNB";
      case "solana":
        return "SOL";
      case "stellar":
        return "XLM";
      case "polkadot":
        return "DOT";
      case "kusama":
        return "KSM";
      default:
        return "";
    }
  }
  getNetworkName(symbol) {
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
      case "TON":
        return "ton";
      case "BTC":
        return "bitcoin";
      case "BDAG":
        return "blockdag";
      case "BNB":
        return "binance";
      case "POL":
        return "polygon";
      case "XLM":
        return "stellar";
      case "DOT":
        return "polkadot";
      case "KSM":
        return "kusama";
      default:
        console.warn(`NetworkService: No name mapping for symbol: ${symbol}`);
        return "";
    }
  }
  getNetworkToken(network) {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const tokens = yield _this._chromeService.getItemSession("tokens");
      if (!tokens || !tokens.length) return null;
      return tokens.find(token => token.name.toLowerCase() === network);
    })();
  }
  getChainId(network) {
    switch (network.toLowerCase()) {
      case "ethereum":
        return 1;
      case "avalanche":
        return 43114;
      case "blockdag":
        return 1404;
      case "solana":
        return 1399811149;
      case "sui":
        return 784;
      case "polygon":
        return 137;
      case "bitcoin":
        return 0;
      case "binance":
        return 56;
      case "polkadot":
      case "kusama":
        return 0;
      default:
        return 1;
    }
  }
  getNetworkImage(network) {
    switch (network) {
      case "ethereum":
      case "ETH":
        return "./assets/networks/eth.png";
      case "sui":
      case "SUI":
        return "./assets/networks/sui.svg";
      case "ton":
      case "TON":
        return "./assets/networks/ton.png";
      case "avalanche":
      case "AVAX":
        return "./assets/networks/avax.png";
      case "blockdag":
      case "BDAG":
        return "/assets/networks/bdag.png";
      case "solana":
      case "SOL":
        return "./assets/networks/sol.svg";
      case "bitcoin":
      case "BTC":
        return "./assets/networks/btc.png";
      case "binance":
      case "BNB":
        return "./assets/networks/bnb.png";
      case "stellar":
      case "XLM":
        return "./assets/icons/xlm_logo.svg";
      case "polygon":
      case "POL":
        return "./assets/networks/pol.png";
      case "polkadot":
      case "DOT":
        return "./assets/networks/dot.svg";
      case "kusama":
      case "KSM":
        return "./assets/networks/ksm.svg";
      default:
        return "";
    }
  }
  static ɵfac = function NetworkService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NetworkService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](app_chrome_service__WEBPACK_IMPORTED_MODULE_2__.ChromeService));
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: NetworkService,
    factory: NetworkService.ɵfac,
    providedIn: "root"
  });
}

/***/ },

/***/ 65443
/*!****************************************!*\
  !*** ./src/app/transaction.service.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TransactionService: () => (/* binding */ TransactionService)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _shared_types_wallet_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shared/types/wallet.types */ 56169);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _chrome_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./chrome.service */ 85043);





class TransactionService {
  _chromeService;
  _recentAddresses = [];
  _swapData = new _shared_types_wallet_types__WEBPACK_IMPORTED_MODULE_1__.SwapData({});
  _swapData$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
  _transactionData = new _shared_types_wallet_types__WEBPACK_IMPORTED_MODULE_1__.TransactionData({});
  _transactionData$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
  constructor(_chromeService) {
    this._chromeService = _chromeService;
    this._chromeService.getItem("transactionData").then(response => {
      if (!response) this._transactionData = new _shared_types_wallet_types__WEBPACK_IMPORTED_MODULE_1__.TransactionData({});else this._transactionData = new _shared_types_wallet_types__WEBPACK_IMPORTED_MODULE_1__.TransactionData(response);
      this._transactionData$.next(this._transactionData);
    });
    this._chromeService.getItem("swapData").then(response => {
      if (!response) this._swapData = new _shared_types_wallet_types__WEBPACK_IMPORTED_MODULE_1__.SwapData({});else this._swapData = new _shared_types_wallet_types__WEBPACK_IMPORTED_MODULE_1__.SwapData(response);
      this._swapData$.next(this._swapData);
    });
    this._chromeService.getItem("recentAddresses").then(response => {
      if (!response) this._recentAddresses = [];else {
        response.forEach(address => {
          this._recentAddresses.push(address);
        });
      }
    });
  }
  get swapData$() {
    return this._swapData$.asObservable();
  }
  set swapData(value) {
    this._chromeService.setItem("swapData", value);
    this._swapData = value;
    this._swapData$.next(this._swapData);
  }
  get transactionData$() {
    return this._transactionData$.asObservable();
  }
  addToRecentAddresses(address) {
    if (!this._transactionData?.receiver?.address) return;
    const index = this._recentAddresses.map(recent => recent.address).indexOf(address.address);
    if (index > -1) {
      this._recentAddresses[index].lastUsed = new Date().toISOString();
      this._recentAddresses.sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime());
    } else {
      this._recentAddresses.push({
        ...address,
        lastUsed: new Date().toISOString()
      });
      if (this._recentAddresses.length > 5) {
        this._recentAddresses.sort((a, b) => new Date(a.lastUsed).getTime() - new Date(b.lastUsed).getTime());
        this._recentAddresses.shift();
      }
    }
    this._chromeService.setItem("recentAddresses", this._recentAddresses);
  }
  findAddressInRecentAddresses(key, value) {
    return this._recentAddresses.filter(recent => recent[key] === value);
  }
  getCurrentTransactionData() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this._transactionData) return _this._transactionData;
      _this._transactionData = new _shared_types_wallet_types__WEBPACK_IMPORTED_MODULE_1__.TransactionData((yield _this._chromeService.getItem("transactionData")) || {});
      return _this._transactionData;
    })();
  }
  /**
   * Always re-read from storage so in-memory state matches chrome after removeItem (e.g. post-swap).
   */
  getCurrentSwapData() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const raw = yield _this2._chromeService.getItem("swapData");
      _this2._swapData = new _shared_types_wallet_types__WEBPACK_IMPORTED_MODULE_1__.SwapData(raw || {});
      _this2._swapData$.next(_this2._swapData);
      return _this2._swapData;
    })();
  }
  /** Clears persisted swap draft and in-memory cache (call after a completed swap). */
  clearPersistedSwapData() {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this3._chromeService.removeItem("swapData");
      _this3._swapData = new _shared_types_wallet_types__WEBPACK_IMPORTED_MODULE_1__.SwapData({});
      _this3._swapData$.next(_this3._swapData);
    })();
  }
  removeTransactionData() {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this4._chromeService.removeItem("transactionData");
    })();
  }
  removeAddressFromRecentAddresses(address) {
    const index = this._recentAddresses.map(recent => recent.address).indexOf(address);
    if (index === -1) return;
    this._recentAddresses.splice(index, 1);
  }
  setCurrentTransactionData(data) {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this5._transactionData = new _shared_types_wallet_types__WEBPACK_IMPORTED_MODULE_1__.TransactionData(data);
      yield _this5._chromeService.setItem("transactionData", _this5._transactionData);
    })();
  }
  static ɵfac = function TransactionService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || TransactionService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_chrome_service__WEBPACK_IMPORTED_MODULE_4__.ChromeService));
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
    token: TransactionService,
    factory: TransactionService.ɵfac,
    providedIn: "root"
  });
}

/***/ }

}]);
//# sourceMappingURL=default-src_app_core_utils_user-facing-transaction-error_util_ts-src_app_services_network_ser-c9228b.js.map