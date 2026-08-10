"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_swap_swap_component_ts"],{

/***/ 70390
/*!***********************************************!*\
  !*** ./src/app/core/network-settings.util.ts ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_NETWORK_CONFIGS: () => (/* binding */ DEFAULT_NETWORK_CONFIGS),
/* harmony export */   NETWORK_IDS_ENSURED_FROM_LICENSE_GAP: () => (/* binding */ NETWORK_IDS_ENSURED_FROM_LICENSE_GAP),
/* harmony export */   mergeNetworkSettings: () => (/* binding */ mergeNetworkSettings),
/* harmony export */   shouldPersistNetworkMerge: () => (/* binding */ shouldPersistNetworkMerge)
/* harmony export */ });
/** Canonical list; keep in sync with BlockchainTransactionsService chain ids. */
const DEFAULT_NETWORK_CONFIGS = [{
  id: "ethereum",
  name: "Ethereum",
  symbol: "ETH",
  enabled: true
}, {
  id: "avalanche",
  name: "Avalanche",
  symbol: "AVAX",
  enabled: true
}, {
  id: "binance",
  name: "BNB Chain",
  symbol: "BNB",
  enabled: true
}, {
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "BTC",
  enabled: true
}, {
  id: "blockdag",
  name: "BlockDAG",
  symbol: "BDAG",
  enabled: true
}, {
  id: "polygon",
  name: "Polygon",
  symbol: "POL",
  enabled: true
}, {
  id: "solana",
  name: "Solana",
  symbol: "SOL",
  enabled: true
}, {
  id: "stellar",
  name: "Stellar",
  symbol: "XLM",
  enabled: true
}, {
  id: "sui",
  name: "Sui",
  symbol: "SUI",
  enabled: true
}, {
  id: "ton",
  name: "Ton",
  symbol: "TON",
  enabled: true
}, {
  id: "polkadot",
  name: "Polkadot",
  symbol: "DOT",
  enabled: true
}, {
  id: "kusama",
  name: "Kusama",
  symbol: "KSM",
  enabled: true
}];
/**
 * Chain ids the app supports but `tags.wallet.networks` on the domain license may omit.
 * Merge these into the license allowlist so Manage Networks matches {@link DEFAULT_NETWORK_CONFIGS}.
 */
const NETWORK_IDS_ENSURED_FROM_LICENSE_GAP = ["stellar", "bitcoin", "sui", "ton", "polkadot", "kusama"];
/**
 * Merge saved toggles into defaults so new chains (e.g. stellar) appear enabled
 * for users whose stored settings predate them.
 */
function mergeNetworkSettings(saved) {
  if (!Array.isArray(saved) || !saved.length) {
    return DEFAULT_NETWORK_CONFIGS.map(n => ({
      ...n
    }));
  }
  return DEFAULT_NETWORK_CONFIGS.map(def => {
    const existing = saved.find(s => s.id === def.id);
    return existing ? {
      ...def,
      ...existing
    } : {
      ...def
    };
  });
}
/** True when persisted list is missing any default network id (needs re-save). */
function shouldPersistNetworkMerge(saved, merged) {
  if (!Array.isArray(saved) || !saved.length) {
    return merged.length > 0;
  }
  const savedIds = new Set(saved.map(n => n.id));
  return DEFAULT_NETWORK_CONFIGS.some(d => !savedIds.has(d.id));
}

/***/ },

/***/ 53520
/*!******************************************!*\
  !*** ./src/app/services/lifi.service.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LifiService: () => (/* binding */ LifiService)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ethers */ 27471);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ethers */ 29929);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ethers */ 6171);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ethers */ 90374);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 59452);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 61318);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ 70271);
/* harmony import */ var _shared_utils_evm_chain_key_util__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @shared/utils/evm-chain-key.util */ 89685);
/* harmony import */ var environments_environment__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common/http */ 63855);
/* harmony import */ var app_services_rpc_provider_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! app/services/rpc-provider.service */ 55849);
/* harmony import */ var app_solana_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! app/solana.service */ 98010);










class LifiService {
  _http;
  _rpcProvider;
  _solanaService;
  ERC20_ABI = [{
    name: "approve",
    inputs: [{
      name: "spender",
      type: "address"
    }, {
      name: "amount",
      type: "uint256"
    }],
    outputs: [{
      name: "",
      type: "bool"
    }],
    stateMutability: "nonpayable",
    type: "function"
  }, {
    name: "allowance",
    inputs: [{
      name: "owner",
      type: "address"
    }, {
      name: "spender",
      type: "address"
    }],
    outputs: [{
      name: "amount",
      type: "uint256"
    }],
    stateMutability: "view",
    type: "function"
  }];
  constructor(_http, _rpcProvider, _solanaService) {
    this._http = _http;
    this._rpcProvider = _rpcProvider;
    this._solanaService = _solanaService;
  }
  get MIN_PRICE_USD() {
    return 0.01;
  }
  get LIFI_API_URL() {
    return `${environments_environment__WEBPACK_IMPORTED_MODULE_10__.environment.apiUrl}/api/lifi`;
  }
  get chainIdToSymbol() {
    return {
      "1": "ETH",
      "137": "POL",
      "43114": "AVAX",
      "56": "BNB"
    };
  }
  get lifiChainSymbols() {
    return ["eth", "ava", "sol", "pol", "bsc"];
  }
  /**
   * Maps LiFi `/tokens` bucket keys (chain symbols like ETH, AVA, SOL or numeric chain IDs)
   * to internal lowercase network slugs (settings `id`, `NetworkName` without casing quirks).
   */
  chainBucketKeyToInternalNetwork(bucketKey) {
    const raw = String(bucketKey).trim();
    if (!raw) return "unknown";
    const byChainId = {
      "1": "ethereum",
      "56": "binance",
      "137": "polygon",
      "43114": "avalanche",
      "42161": "arbitrum"
    };
    if (/^\d+$/.test(raw) && byChainId[raw]) return byChainId[raw];
    const upper = raw.toUpperCase();
    const bySymbol = {
      ETH: "ethereum",
      AVA: "avalanche",
      AVAX: "avalanche",
      BSC: "binance",
      BNB: "binance",
      POL: "polygon",
      MATIC: "polygon",
      SOL: "solana",
      SUI: "sui"
    };
    if (bySymbol[upper]) return bySymbol[upper];
    const lower = raw.toLowerCase();
    const byLower = {
      eth: "ethereum",
      ava: "avalanche",
      avax: "avalanche",
      bsc: "binance",
      bnb: "binance",
      pol: "polygon",
      matic: "polygon",
      sol: "solana",
      sui: "sui"
    };
    if (byLower[lower]) return byLower[lower];
    return "unknown";
  }
  /**
   * Format amount to avoid scientific notation
   */
  _formatAmount(amount) {
    const numAmount = parseFloat(amount);
    if (numAmount < 0.000001 && numAmount > 0) return numAmount.toFixed(18).replace(/\.?0+$/, "");
    return numAmount.toString();
  }
  /**
   * LiFi `/tokens` chain keys we request via the EVM-style query (no chainTypes).
   * Solana is always a separate request with chainTypes=SVM.
   */
  _lifiEvmTokensChainParam(internalNetworkLower) {
    const id = this.getChainIdentifier(internalNetworkLower);
    const supported = new Set(["ETH", "AVA", "SUI", "POL", "BNB"]);
    if (id === "SOL") return null;
    if (supported.has(id)) return id;
    return null;
  }
  /**
   * Loads trusted tokens from the LiFi proxy.
   * @param lockedInternalNetwork Optional lowercase network id (e.g. `avalanche`). When set, only that chain is fetched (no Solana call for EVM/Sui locks). Omit or pass null for the full multi-chain catalog.
   */
  requestTokens(lockedInternalNetwork) {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const defaultResponse = {
        data: {
          tokens: {}
        }
      };
      const lock = lockedInternalNetwork?.trim().toLowerCase() || null;
      let fetchEvmChains = "ETH,AVA,POL,BNB,SUI";
      let fetchSolana = true;
      if (lock) {
        if (lock === "solana") {
          fetchEvmChains = "";
          fetchSolana = true;
        } else {
          fetchSolana = false;
          const single = _this._lifiEvmTokensChainParam(lock);
          if (single) fetchEvmChains = single;else {
            fetchEvmChains = "ETH,AVA,POL,BNB,SUI";
            fetchSolana = true;
          }
        }
      }
      try {
        const result = {
          tokens: {}
        };
        if (fetchEvmChains) {
          const {
            data: standardResponse
          } = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.firstValueFrom)(_this._http.get(`${_this.LIFI_API_URL}/tokens`, {
            params: {
              chains: fetchEvmChains,
              minPriceUSD: _this.MIN_PRICE_USD
            }
          }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.catchError)(err => {
            console.warn("Failed to fetch standard tokens:", err);
            return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.of)(defaultResponse);
          })));
          Object.assign(result.tokens, standardResponse.tokens || {});
        }
        if (fetchSolana) {
          const {
            data: solanaResponse
          } = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.firstValueFrom)(_this._http.get(`${_this.LIFI_API_URL}/tokens`, {
            params: {
              chains: "SOL",
              chainTypes: "SVM",
              minPriceUSD: _this.MIN_PRICE_USD
            }
          }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.catchError)(err => {
            console.warn("Failed to fetch Solana tokens:", err);
            return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.of)(defaultResponse);
          })));
          if (solanaResponse?.tokens) {
            result.tokens.SOL = solanaResponse.tokens?.SOL || solanaResponse.tokens?.sol || [];
            if (!result.tokens.SOL.length) result.tokens.SOL = Object.values(solanaResponse.tokens).flat();
          }
        }
        return result;
      } catch (error) {
        console.error("Error in requestTokens:", error);
        return {
          tokens: {}
        };
      }
    })();
  }
  /** Maps LiFi `chains` query keys (eth, pol, bsc, …) to wallet token bucket symbols. */
  _lifiQueryKeyToWalletSymbol(key) {
    const k = String(key).toLowerCase();
    const map = {
      eth: "ETH",
      ava: "AVAX",
      pol: "POL",
      bsc: "BNB",
      sol: "SOL"
    };
    return map[k] ?? null;
  }
  getTokens() {
    const chains = this.lifiChainSymbols;
    const combined = {};
    return this._http.get(`${this.LIFI_API_URL}/tokens`, {
      params: {
        chains: chains.join(","),
        minPriceUSD: this.MIN_PRICE_USD
      }
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.map)(result => {
      if (!result?.data?.tokens) return combined;
      chains.forEach(chain => {
        const chainSymbol = this._lifiQueryKeyToWalletSymbol(chain);
        if (!chainSymbol) return;
        combined[chainSymbol] = result.data.tokens[chain] || [];
      });
      return combined;
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.catchError)(error => {
      console.error("Error in combined token request:", error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.of)(combined);
    }));
  }
  /**
   * Get the chain identifier for LiFi API
   */
  getChainIdentifier(network) {
    switch (network.toLowerCase()) {
      case "ethereum":
        return "ETH";
      case "polygon":
        return "POL";
      case "binance":
        return "BNB";
      case "avalanche":
        return "AVA";
      case "solana":
        return "SOL";
      default:
        return network.toUpperCase();
    }
  }
  /** LiFi `fromChain` query symbols for numeric chain IDs used in stepTransaction bodies. */
  getChainIdentifierFromChainId(chainId) {
    const id = Number(chainId);
    const map = {
      1: "ETH",
      56: "BNB",
      137: "POL",
      43114: "AVA"
    };
    if (map[id]) return map[id];
    return String(chainId);
  }
  /**
   * Truncate fractional digits to `decimals` so `ethers.parseUnits` never throws NUMERIC_FAULT
   * (human-entered or float-derived strings often exceed USDC-style 6 dp).
   */
  _clampDecimalPlacesForParseUnits(amount, decimals) {
    let s = String(amount).trim().replace(/,/g, "");
    if (!s || s === "." || s.startsWith("-")) {
      return "0";
    }
    if (/[eE]/.test(s)) {
      const n = Number(s);
      if (!Number.isFinite(n) || n < 0) {
        return "0";
      }
      return n.toFixed(decimals);
    }
    const dotIdx = s.indexOf(".");
    let intPart = dotIdx === -1 ? s : s.slice(0, dotIdx);
    let fracPart = dotIdx === -1 ? "" : s.slice(dotIdx + 1);
    intPart = intPart.replace(/\D/g, "") || "0";
    fracPart = fracPart.replace(/\D/g, "").slice(0, decimals);
    if (decimals === 0) {
      return intPart;
    }
    return fracPart.length > 0 ? `${intPart}.${fracPart}` : intPart;
  }
  /**
   * Format amount with proper decimals
   */
  formatAmount(amount, decimals) {
    try {
      let d = Math.floor(Number(decimals));
      if (!Number.isFinite(d) || d < 0) {
        d = 18;
      }
      if (d > 78) {
        d = 78;
      }
      const normalized = this._clampDecimalPlacesForParseUnits(amount, d);
      const amountBN = ethers__WEBPACK_IMPORTED_MODULE_1__.parseUnits(normalized, d);
      return amountBN.toString();
    } catch (error) {
      console.error("Error formatting amount:", error);
      return "0";
    }
  }
  /**
   * Execute a swap transaction (single EVM tx from LiFi `transactionRequest`).
   */
  executeSwap(quote, wallet) {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!quote?.transactionRequest || !quote?.action || !quote?.estimate) {
        throw new Error("Invalid quote: missing transactionRequest");
      }
      return _this2._sendEvmLifiTransactionRequest(quote.transactionRequest, quote.action, quote.estimate, wallet);
    })();
  }
  /**
   * Cross-chain / multi-step: first source tx via `executeSwap`, poll bridge status, then sign any destination-chain steps.
   */
  executeEvmLiFiSwap(quote, wallet) {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const receipt = yield _this3.executeSwap(quote, wallet);
      const txHash = receipt?.transactionHash ?? receipt?.hash;
      const fromChainId = Number(quote?.action?.fromChainId);
      const toChainId = Number(quote?.action?.toChainId);
      const isCross = Number.isFinite(fromChainId) && Number.isFinite(toChainId) && fromChainId !== toChainId;
      if (isCross && txHash && quote?.tool) {
        yield _this3.waitForLiFiTransferStatus({
          txHash,
          tool: String(quote.tool),
          fromChainId,
          toChainId
        });
      }
      if (isCross) {
        yield _this3.executeDestinationEvmStepsIfAny(quote, wallet);
      }
      return receipt;
    })();
  }
  _sendEvmLifiTransactionRequest(transactionRequest, action, estimate, wallet) {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const chainId = action.fromChainId;
        const provider = yield _this4._getLifiEvmProvider(chainId);
        const signer = new ethers__WEBPACK_IMPORTED_MODULE_2__.Wallet(wallet.privateKey, provider);
        const NATIVE_TOKEN_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
        const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
        const isFromNative = action.fromToken.address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase() || action.fromToken.address.toLowerCase() === ZERO_ADDRESS.toLowerCase();
        const feeData = yield provider.getFeeData();
        const tx = {
          to: transactionRequest.to,
          data: transactionRequest.data,
          value: isFromNative ? transactionRequest.value ?? "0" : "0",
          maxFeePerGas: feeData.maxFeePerGas,
          maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
          gasLimit: transactionRequest.gasLimit ? BigInt(transactionRequest.gasLimit) : ethers__WEBPACK_IMPORTED_MODULE_1__.parseUnits("800000", "wei")
        };
        if (!isFromNative) {
          yield _this4.checkAndSetAllowance(action.fromToken.address, estimate.approvalAddress, action.fromAmount, wallet.address, wallet.privateKey, chainId.toString());
        }
        yield new Promise(resolve => setTimeout(resolve, 1000));
        const latestNonce = yield provider.getTransactionCount(signer.address, "latest");
        tx.nonce = latestNonce;
        const transaction = yield signer.sendTransaction(tx);
        try {
          const waited = yield transaction.wait();
          return {
            ...(waited || {}),
            transactionHash: waited?.hash || transaction?.hash
          };
        } catch (error) {
          return {
            ...transaction,
            transactionHash: transaction.hash
          };
        }
      } catch (error) {
        console.error("Detailed swap execution error:", error);
        throw error;
      }
    })();
  }
  getTransferStatus(params) {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const query = {
        txHash: params.txHash
      };
      if (params.bridge) query.bridge = params.bridge;
      if (params.fromChain !== undefined && params.fromChain !== "") query.fromChain = params.fromChain;
      if (params.toChain !== undefined && params.toChain !== "") query.toChain = params.toChain;
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.firstValueFrom)(_this5._http.get(`${_this5.LIFI_API_URL}/status`, {
        params: query
      }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.map)(r => r.data ?? r), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.catchError)(err => {
        console.warn("LiFi status error:", err);
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.of)(null);
      })));
    })();
  }
  waitForLiFiTransferStatus(opts) {
    var _this6 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const maxAttempts = 48;
      const delayMs = 5000;
      for (let i = 0; i < maxAttempts; i++) {
        yield new Promise(resolve => setTimeout(resolve, delayMs));
        const s = yield _this6.getTransferStatus({
          txHash: opts.txHash,
          bridge: opts.tool,
          fromChain: String(opts.fromChainId),
          toChain: String(opts.toChainId)
        });
        if (!s) continue;
        const st = String(s.status ?? "").toUpperCase();
        if (st === "DONE" || st === "FAILED" || st === "INVALID" || st === "NOT_FOUND") break;
      }
    })();
  }
  executeDestinationEvmStepsIfAny(quote, wallet) {
    var _this7 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const dest = Number(quote?.action?.toChainId);
      if (!Number.isFinite(dest) || !Array.isArray(quote?.includedSteps)) return;
      for (const step of quote.includedSteps) {
        const from = Number(step?.action?.fromChainId);
        if (from !== dest) continue;
        if (!step?.tool || !step?.estimate || !step?.action) continue;
        try {
          yield _this7.postEvmLiFiStepAndSend(quote, step, wallet);
        } catch (e) {
          console.warn("LiFi destination-chain step skipped:", e);
          break;
        }
      }
    })();
  }
  postEvmLiFiStepAndSend(quote, step, wallet) {
    var _this8 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const fromChainId = Number(step.action.fromChainId);
      const lifiChain = _this8.getChainIdentifierFromChainId(fromChainId);
      const body = {
        ...step,
        id: quote.id,
        fromChain: lifiChain,
        fromAddress: wallet.address,
        toAddress: step.action.toAddress || quote.action?.toAddress || wallet.address
      };
      const {
        data: txResponse
      } = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.firstValueFrom)(_this8._http.post(`${_this8.LIFI_API_URL}/execute-advanced-step-transaction`, body));
      if (!txResponse?.transactionRequest) return;
      yield _this8._sendEvmLifiTransactionRequest(txResponse.transactionRequest, step.action, step.estimate, wallet);
    })();
  }
  checkAndSetAllowance(tokenAddress, spender, amount, owner, privateKey, network) {
    var _this9 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const provider = yield _this9._getLifiEvmProvider(network);
        const signer = new ethers__WEBPACK_IMPORTED_MODULE_2__.Wallet(privateKey, provider);
        const contract = new ethers__WEBPACK_IMPORTED_MODULE_3__.Contract(tokenAddress, _this9.ERC20_ABI, signer);
        const currentAllowance = yield contract.allowance.staticCall(owner, spender);
        if (BigInt(currentAllowance.toString()) < BigInt(amount)) {
          const feeData = yield provider.getFeeData();
          const tx = yield contract.approve(spender, amount, {
            gasLimit: ethers__WEBPACK_IMPORTED_MODULE_1__.parseUnits("200000", "wei"),
            maxFeePerGas: feeData.maxFeePerGas,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
          });
          yield tx.wait();
        }
      } catch (error) {
        console.error("Error in checkAndSetAllowance:", error);
        throw error;
      }
    })();
  }
  _getLifiEvmProvider(chainIdOrSlug) {
    var _this0 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const raw = String(chainIdOrSlug).trim();
      const slugToId = {
        ethereum: "1",
        avalanche: "43114",
        binance: "56",
        polygon: "137"
      };
      const id = /^\d+$/.test(raw) ? raw : slugToId[raw.toLowerCase()];
      if (!id) throw new Error(`Unsupported network: ${chainIdOrSlug}`);
      const n = Number(id);
      return _this0._rpcProvider.getEthersProviderForChainId(n, {
        allowDirectFallback: (0,_shared_utils_evm_chain_key_util__WEBPACK_IMPORTED_MODULE_9__.allowDirectFallbackForChainId)(n)
      });
    })();
  }
  sendTransaction(params) {
    var _this1 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const net = params.network;
        const chainIdNum = Number(net);
        const provider = typeof net === "string" && (net.startsWith("http://") || net.startsWith("https://")) ? new ethers__WEBPACK_IMPORTED_MODULE_4__.JsonRpcProvider(net) : yield _this1._rpcProvider.getEthersProviderForChainId(chainIdNum, {
          allowDirectFallback: (0,_shared_utils_evm_chain_key_util__WEBPACK_IMPORTED_MODULE_9__.allowDirectFallbackForChainId)(chainIdNum)
        });
        const signer = new ethers__WEBPACK_IMPORTED_MODULE_2__.Wallet(params.privateKey, provider);
        const gasEstimate = yield provider.estimateGas({
          to: params.to,
          data: params.data,
          value: params.value
        });
        const feeData = yield provider.getFeeData();
        const tx = {
          to: params.to,
          data: params.data,
          value: params.value,
          gasLimit: ethers__WEBPACK_IMPORTED_MODULE_1__.parseUnits(Math.floor(Number(gasEstimate) * 1.2).toString(), "wei"),
          maxFeePerGas: feeData.maxFeePerGas,
          maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
        };
        const transaction = yield signer.sendTransaction(tx);
        try {
          const receipt = yield transaction.wait();
          return {
            ...(receipt || {}),
            transactionHash: receipt?.hash || transaction?.hash
          };
        } catch (error) {
          return {
            ...transaction,
            transactionHash: transaction.hash
          };
        }
      } catch (error) {
        console.error("Error sending transaction:", error);
        throw error;
      }
    })();
  }
  getTokenImage(token) {
    if (token.image?.startsWith("http")) return token.image;
    return `assets/tokens/placeholder-coin.png`;
  }
  /**
   * Get the correct token address for the given network and symbol
   */
  getTokenAddress(network, symbol, contractAddress) {
    if (network.toLowerCase() === "solana") {
      const solanaTokens = {
        SOL: "So11111111111111111111111111111111111111112"
      };
      if (solanaTokens[symbol.toUpperCase()]) {
        return solanaTokens[symbol.toUpperCase()];
      }
      if (contractAddress && !contractAddress.startsWith("0x")) {
        return contractAddress;
      }
      console.warn(`Token ${symbol} no reconocido en Solana, usando SOL nativo como fallback`);
      return "So11111111111111111111111111111111111111112";
    }
    if (["ETH", "AVAX", "BNB", "MATIC", "POL"].includes(symbol.toUpperCase())) {
      return "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
    }
    return contractAddress;
  }
  getSwapGasCost(swapQuote) {
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        return {
          gasLimit: "300000",
          gasPrice: "3000000000",
          maxFeePerGas: "4000000000",
          maxPriorityFeePerGas: "2000000000"
        };
      } catch (error) {
        console.error("Error estimating swap gas:", error);
        throw error;
      }
    })();
  }
  /**
   * Get routes for token swap including Solana support
   */
  getRoutes(fromChain, fromToken, toChain, toToken, fromAmount, fromAddress, toAddress, slippage = 3) {
    const requestBody = {
      fromChainId: fromChain,
      fromAmount,
      toChainId: toChain,
      fromTokenAddress: fromToken,
      toTokenAddress: toToken,
      fromAddress,
      toAddress,
      options: {
        slippage: slippage / 100
      }
    };
    return this._http.post(`${this.LIFI_API_URL}/advanced/routes`, requestBody);
  }
  /**
   * Converts UI slippage in percent (slider 0.1–0.8 = 0.1%–0.8%) to LiFi's decimal fraction (e.g. 0.005 = 0.5%).
   */
  _uiSlippagePercentToLiFiDecimal(slippageInput) {
    const raw = Number(String(slippageInput).trim().replace(/,/g, "."));
    const percent = Number.isFinite(raw) && raw > 0 ? raw : 0.5;
    let d = percent / 100;
    if (d < 0.0001) d = 0.0001;
    if (d > 0.99) d = 0.99;
    let s = d.toFixed(10).replace(/\.?0+$/, "");
    if (!s || s === ".") s = "0.0001";
    return s;
  }
  /**
   * Get a quote for a swap.
   * @param slippage UI percent (same as swap form / slippage sheet), not LiFi raw decimal.
   */
  getQuote(fromChain, fromToken, toChain, toToken, fromAmount, fromAddress, slippage, toAddress) {
    const formattedAmount = this._formatAmount(fromAmount.toString());
    const params = {
      fromChain,
      fromToken,
      toChain,
      toToken,
      fromAmount: formattedAmount,
      fromAddress,
      slippage: this._uiSlippagePercentToLiFiDecimal(slippage)
    };
    const to = String(toAddress || "").trim();
    if (to) params.toAddress = to;
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.firstValueFrom)(this._http.get(`${this.LIFI_API_URL}/quote`, {
      params
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.map)(response => response.data), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.catchError)(error => {
      console.error("Error getting quote:", error);
      throw error;
    })));
  }
  executeSwapWithApproval(quote, wallet, sourceNetwork, sourceToken, targetToken) {
    var _this10 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        if (!quote || !quote.estimate || Number(quote.estimate.toAmount) === 0) {
          console.error("No hay ruta de swap o liquidez insuficiente. Aborting swap.");
          throw new Error("No hay ruta de swap o liquidez insuficiente");
        }
        if (sourceNetwork === "avalanche") {
          return _this10.executeDirectSwap(wallet, sourceNetwork, sourceToken, targetToken, quote.action.fromAmount);
        }
      } catch (error) {
        console.error("Error ejecutando swap:", error);
        throw error;
      }
    })();
  }
  executeDirectSwap(wallet, sourceNetwork, sourceToken, targetToken, amount) {
    var _this11 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const ROUTER_ADDRESS = "0x60aE616a2155Ee3d9A68541Ba4544862310933d4";
        const WAVAX_ADDRESS = "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7";
        const ROUTER_ABI = [{
          inputs: [{
            name: "amountIn",
            type: "uint256"
          }, {
            name: "amountOutMin",
            type: "uint256"
          }, {
            name: "path",
            type: "address[]"
          }, {
            name: "to",
            type: "address"
          }, {
            name: "deadline",
            type: "uint256"
          }],
          name: "swapExactTokensForTokens",
          outputs: [{
            name: "amounts",
            type: "uint256[]"
          }],
          type: "function"
        }, {
          inputs: [{
            name: "amountIn",
            type: "uint256"
          }, {
            name: "amountOutMin",
            type: "uint256"
          }, {
            name: "path",
            type: "address[]"
          }, {
            name: "to",
            type: "address"
          }, {
            name: "deadline",
            type: "uint256"
          }],
          name: "swapExactTokensForAVAX",
          outputs: [{
            name: "amounts",
            type: "uint256[]"
          }],
          type: "function"
        }, {
          inputs: [{
            name: "amountOutMin",
            type: "uint256"
          }, {
            name: "path",
            type: "address[]"
          }, {
            name: "to",
            type: "address"
          }, {
            name: "deadline",
            type: "uint256"
          }],
          name: "swapExactAVAXForTokens",
          outputs: [{
            name: "amounts",
            type: "uint256[]"
          }],
          stateMutability: "payable",
          type: "function"
        }];
        const provider = yield _this11._getLifiEvmProvider(sourceNetwork);
        const privateKey = wallet.privateKey.startsWith("0x") ? wallet.privateKey : ethers__WEBPACK_IMPORTED_MODULE_2__.Wallet.fromPhrase(wallet.mnemonic.trim().toLowerCase()).privateKey;
        const signer = new ethers__WEBPACK_IMPORTED_MODULE_2__.Wallet(privateKey, provider);
        const router = new ethers__WEBPACK_IMPORTED_MODULE_3__.Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);
        const deadline = Math.floor(Date.now() / 1000) + 1200;
        const isSourceNative = !sourceToken.address || sourceToken.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
        const isTargetNative = !targetToken.address || targetToken.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
        try {
          if (isSourceNative && !isTargetNative) {
            const path = [WAVAX_ADDRESS, targetToken.address];
            return yield router.swapExactAVAXForTokens(ethers__WEBPACK_IMPORTED_MODULE_1__.parseUnits(amount, "wei"), ethers__WEBPACK_IMPORTED_MODULE_1__.parseUnits("1", "wei"), path, signer.address, deadline);
          } else if (!isSourceNative && isTargetNative) {
            const path = [sourceToken.address, WAVAX_ADDRESS];
            yield _this11.approveToken(sourceToken.address, signer.address, ROUTER_ADDRESS, amount, privateKey, sourceNetwork);
            yield new Promise(resolve => setTimeout(resolve, 5000));
            return yield router.swapExactTokensForAVAX(ethers__WEBPACK_IMPORTED_MODULE_1__.parseUnits(amount, "wei"), ethers__WEBPACK_IMPORTED_MODULE_1__.parseUnits("1", "wei"), path, signer.address, deadline);
          } else if (!isSourceNative && !isTargetNative) {
            const path = [sourceToken.address, WAVAX_ADDRESS, targetToken.address];
            yield _this11.approveToken(sourceToken.address, signer.address, ROUTER_ADDRESS, amount, privateKey, sourceNetwork);
            yield new Promise(resolve => setTimeout(resolve, 5000));
            return yield router.swapExactTokensForTokens(ethers__WEBPACK_IMPORTED_MODULE_1__.parseUnits(amount, "wei"), ethers__WEBPACK_IMPORTED_MODULE_1__.parseUnits("1", "wei"), path, signer.address, deadline);
          } else {
            throw new Error("Tipo de swap inválido: AVAX a AVAX");
          }
        } catch (error) {
          console.error("Error ejecutando swap directo:", error);
          throw new Error("Error en la transacción: " + error.message || 0);
        }
      } catch (error) {
        console.error("Error ejecutando swap directo:", error);
        throw error;
      }
    })();
  }
  approveToken(tokenAddress, owner, spender, amount, privateKey, network) {
    var _this12 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this12.checkAndSetAllowance(tokenAddress, spender, amount, owner, privateKey, network);
    })();
  }
  /**
   * Execute a swap on Solana
   */
  executeSolanaSwap(quote, wallet, mnemonic) {
    var _this13 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        if (!quote) throw new Error("Invalid quote for Solana swap: Quote is null or undefined");
        let step;
        if (quote.steps && quote.steps.length > 0) {
          step = quote.steps[0];
        } else if (quote.tool) {
          step = quote;
        } else if (quote.includedSteps && quote.includedSteps.length > 0) {
          step = quote.includedSteps[0];
        } else throw new Error("Invalid quote structure: No steps or direct quote found");
        if (!step.tool) throw new Error("Invalid step: Missing tool information");
        if (!quote.estimate || !quote.estimate.toAmount || parseFloat(quote.estimate.toAmount) <= 0) {
          throw new Error("Invalid quote: The estimated output amount is zero or missing");
        }
        if (!wallet || !wallet.solanaAddress) throw new Error("Wallet address is required for Solana swap");
        const requestBody = {
          ...quote,
          fromAddress: wallet.solanaAddress,
          toAddress: wallet.solanaAddress,
          slippage: quote.slippage || 1
        };
        const {
          data: txResponse
        } = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.firstValueFrom)(_this13._http.post(`${_this13.LIFI_API_URL}/execute-advanced-step-transaction`, requestBody));
        if (!txResponse || !txResponse.transactionRequest) throw new Error("Failed to get transaction data");
        const transactionData = txResponse.transactionRequest.data;
        if (!transactionData) throw new Error("No transaction data received");
        if (!mnemonic) throw new Error("Mnemonic phrase is required for signing Solana transactions");
        try {
          const cleanMnemonic = mnemonic.trim();
          const signature = yield _this13._solanaService.sendSerializedTransaction(cleanMnemonic, transactionData);
          yield new Promise(resolve => setTimeout(resolve, 2000));
          return {
            status: "SUCCESS",
            message: "Transaction successfully executed",
            transactionHash: signature,
            transactionData: transactionData,
            network: "solana",
            fromToken: quote.action?.fromToken?.symbol || "",
            toToken: quote.action?.toToken?.symbol || "",
            fromAmount: quote.action?.fromAmount || "0",
            toAmount: quote.estimate?.toAmount || "0",
            fromAddress: wallet.solanaAddress,
            toAddress: wallet.solanaAddress
          };
        } catch (error) {
          console.error("Error in Solana transaction:", error);
          if (error.message && error.message.includes("Fondos insuficientes")) {
            throw new Error("Para realizar un swap en Solana, necesitas tener al menos 0.002 SOL para cubrir las tarifas de red y la creación de cuentas de token. Por favor, añade SOL a tu cuenta e inténtalo de nuevo.");
          }
          if (error.message && (error.message.includes("Instruction") || error.message.includes("Program Error"))) {
            throw new Error("La transacción falló en la blockchain de Solana. Esto puede deberse a slippage, liquidez insuficiente o problemas con las cuentas de token. Por favor, intenta con un monto menor o un slippage mayor.");
          }
          if (error.message && error.message.includes("expired")) {
            throw new Error("La transacción expiró antes de ser confirmada. Esto puede deberse a congestión en la red. Por favor, intenta nuevamente.");
          }
          throw error;
        }
      } catch (error) {
        console.error("Error executing Solana swap:", error);
        throw error;
      }
    })();
  }
  static ɵfac = function LifiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || LifiService)(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_12__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵinject"](app_services_rpc_provider_service__WEBPACK_IMPORTED_MODULE_13__.RpcProviderService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵinject"](app_solana_service__WEBPACK_IMPORTED_MODULE_14__.SolanaService));
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineInjectable"]({
    token: LifiService,
    factory: LifiService.ɵfac,
    providedIn: "root"
  });
}

/***/ },

/***/ 40875
/*!**********************************************!*\
  !*** ./src/app/services/settings.service.ts ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsService: () => (/* binding */ SettingsService)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var app_core_network_settings_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/core/network-settings.util */ 70390);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 75797);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var app_chrome_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/chrome.service */ 85043);
/* harmony import */ var app_vault_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/vault.service */ 19519);
/* harmony import */ var app_wallet_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/wallet.service */ 69556);







class SettingsService {
  _chromeService;
  _vaultService;
  _walletService;
  _settings$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.BehaviorSubject({});
  _settings = {};
  constructor(_chromeService, _vaultService, _walletService) {
    this._chromeService = _chromeService;
    this._vaultService = _vaultService;
    this._walletService = _walletService;
    this._settings = {
      security: {
        biometricVerificationInterval: 10,
        passwordAttempts: 4
      }
    };
    this._chromeService.onSettingsChanged$.subscribe(settings => {
      this._applySettingsFromStorage(settings);
    });
    this._chromeService.getItem("settings").then(settings => {
      this._applySettingsFromStorage(settings);
    });
  }
  _applySettingsFromStorage(raw) {
    const hasRaw = raw && Object.keys(raw).length > 0;
    const base = hasRaw ? {
      ...this._settings,
      ...raw,
      security: raw.security ?? this._settings.security
    } : this._settings;
    const mergedNetworks = (0,app_core_network_settings_util__WEBPACK_IMPORTED_MODULE_1__.mergeNetworkSettings)(base.networks);
    const next = {
      ...base,
      networks: mergedNetworks
    };
    this._settings = next;
    this._settings$.next(this._settings);
    if (hasRaw && (0,app_core_network_settings_util__WEBPACK_IMPORTED_MODULE_1__.shouldPersistNetworkMerge)(raw.networks, mergedNetworks)) {
      void this._chromeService.setItem("settings", next);
    }
  }
  get settings$() {
    return this._settings$.asObservable();
  }
  get settings() {
    return this._settings;
  }
  /**
   * Enabled chain ids for portfolio / history / send filters.
   * Returns undefined when networks are unset, or when every toggle is off — same as legacy "no filter" behavior.
   * (An empty array would otherwise make `getAddressData` skip every chain.)
   */
  getEnabledNetworkIds() {
    if (!this._settings?.networks?.length) return undefined;
    const ids = this._settings.networks.filter(n => n.enabled).map(n => n.id);
    return ids.length > 0 ? ids : undefined;
  }
  set settings(value) {
    const security = value.security ?? this._settings.security;
    if (this._settings.security.passwordAttempts !== security.passwordAttempts) {
      this._vaultService.passwordAttempts = security.passwordAttempts;
    }
    const mergedNetworks = (0,app_core_network_settings_util__WEBPACK_IMPORTED_MODULE_1__.mergeNetworkSettings)(value.networks);
    const next = {
      ...value,
      security,
      networks: mergedNetworks
    };
    this._settings = next;
    this._chromeService.setItem("settings", next);
    this._settings$.next(this._settings);
    this._biometricsRequired();
  }
  _biometricsRequired() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const lastVerified = yield _this._chromeService.getItem("lastVerified");
      // Force biometrics if someone has tampered with the lastVerified timestamp
      if (!lastVerified || _this._vaultService.lastVerified !== lastVerified) {
        yield _this._walletService.clearPGPKeys();
        return;
      }
      const minutesSinceLastVerified = Math.floor((new Date().getTime() - new Date(lastVerified).getTime()) / (1000 * 60));
      if (minutesSinceLastVerified < (_this._settings?.security?.biometricVerificationInterval || 10)) return;
      yield _this._walletService.clearPGPKeys();
    })();
  }
  static ɵfac = function SettingsService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SettingsService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](app_chrome_service__WEBPACK_IMPORTED_MODULE_4__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](app_vault_service__WEBPACK_IMPORTED_MODULE_5__.VaultService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](app_wallet_service__WEBPACK_IMPORTED_MODULE_6__.WalletService));
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
    token: SettingsService,
    factory: SettingsService.ɵfac,
    providedIn: "root"
  });
}

/***/ },

/***/ 34104
/*!************************************************************!*\
  !*** ./src/app/slippage-sheet/slippage-sheet.component.ts ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SlippageSheetComponent: () => (/* binding */ SlippageSheetComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/bottom-sheet */ 15244);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 33900);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var app_services_network_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! app/services/network.service */ 32404);













const _c0 = ["slippageSlider"];
const _c1 = a0 => ({
  "slippage-sheet__switch-label--active": a0
});
function SlippageSheetComponent_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "form", 2)(2, "button", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function SlippageSheetComponent_ng_container_0_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.close());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "svg", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](5, "path", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "div", 7)(7, "h3", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](9, "div", 9)(10, "div", 10)(11, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](13, "div", 12)(14, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function SlippageSheetComponent_ng_container_0_Template_div_click_14_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.toggleMode("slippageToggle"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](15, "p", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](17, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](18, "input", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](19, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](20, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](21, "p", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](22);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](23, "div", 19)(24, "div", 20)(25, "div", 21)(26, "label", 22)(27, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](28, "div", 24)(29, "div", 24)(30, "div", 24)(31, "div", 24)(32, "div", 24)(33, "div", 24)(34, "div", 24)(35, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](36, "input", 25, 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](38, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](39);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](40, "p", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](41);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](42, "div", 9)(43, "div", 10)(44, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](45);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](46, "div", 12)(47, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function SlippageSheetComponent_ng_container_0_Template_div_click_47_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.toggleMode("commissionToggle"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](48, "p", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](49);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](50, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](51, "input", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](52, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](53, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](54, "p", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](55);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](56, "div", 28)(57, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](58, "input", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](59, "p", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](60);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](61, "div", 32)(62, "button", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function SlippageSheetComponent_ng_container_0_Template_button_click_62_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.confirm());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](63);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_10_0;
    let tmp_11_0;
    let tmp_14_0;
    let tmp_15_0;
    let tmp_16_0;
    let tmp_18_0;
    const t_r3 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("formGroup", ctx_r1.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", t_r3("swap.slipping_adjustments"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r3("swap.slipping"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction1"](24, _c1, ((tmp_6_0 = ctx_r1.form.get("slippageToggle")) == null ? null : tmp_6_0.value) === "automatic"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](17, 20, "swap." + ((tmp_7_0 = ctx_r1.form.get("slippageToggle")) == null ? null : tmp_7_0.value)), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("checked", ((tmp_8_0 = ctx_r1.form.get("slippageToggle")) == null ? null : tmp_8_0.value) === "automatic");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r3("swap.slipping_subtitle"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵstyleProp"]("display", ((tmp_10_0 = ctx_r1.form.get("slippageToggle")) == null ? null : tmp_10_0.value) === "manual" ? "flex" : "none");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", (tmp_11_0 = ctx_r1.form.get("slippage")) == null ? null : tmp_11_0.value, "%");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r3("swap.slipping_more_info"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r3("swap.priority_commission"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction1"](26, _c1, ((tmp_14_0 = ctx_r1.form.get("commissionToggle")) == null ? null : tmp_14_0.value) === "automatic"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](50, 22, "swap." + ((tmp_15_0 = ctx_r1.form.get("commissionToggle")) == null ? null : tmp_15_0.value)), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("checked", ((tmp_16_0 = ctx_r1.form.get("commissionToggle")) == null ? null : tmp_16_0.value) === "automatic");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r3("swap.priority_commission_subtitle"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵstyleProp"]("display", ((tmp_18_0 = ctx_r1.form.get("commissionToggle")) == null ? null : tmp_18_0.value) === "manual" ? "block" : "none");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx_r1.networkSymbol);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", t_r3("common.confirm"), " ");
  }
}
class SlippageSheetComponent {
  data;
  _formBuilder;
  _bottomSheetRef;
  _networkService;
  slippageSlider;
  unsubscriber$ = new rxjs__WEBPACK_IMPORTED_MODULE_6__.Subject();
  form;
  constructor(data, _formBuilder, _bottomSheetRef, _networkService) {
    this.data = data;
    this._formBuilder = _formBuilder;
    this._bottomSheetRef = _bottomSheetRef;
    this._networkService = _networkService;
    this._initForm();
  }
  ngAfterViewInit() {
    this._updateRangeProgress();
  }
  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
  get networkSymbol() {
    return this._networkService.getNetworkSymbol(this.data.network.toLowerCase());
  }
  _initForm() {
    this.form = this._formBuilder.group({
      commission: [this.data.commission || 0.1, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.min(0), this._requiredIfManual("commissionToggle")]],
      commissionToggle: [this.data.commissionToggle || "automatic", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required]],
      slippage: [this.data.slippage || 0.5, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.min(0), _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.max(0.8)]],
      slippageToggle: [this.data.slippageToggle || "automatic", [this._requiredIfManual("slippageToggle")]]
    });
    this.form.get("commissionToggle")?.valueChanges.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_7__.takeUntil)(this.unsubscriber$)).subscribe(() => {
      this.form.get("commission")?.updateValueAndValidity();
    });
    this.form.get("slippageToggle")?.valueChanges.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_7__.takeUntil)(this.unsubscriber$)).subscribe(() => {
      this.form.get("slippage")?.updateValueAndValidity();
      this._updateRangeProgress();
    });
    this.form.get("slippage")?.valueChanges.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_7__.takeUntil)(this.unsubscriber$)).subscribe(() => {
      this._updateRangeProgress();
    });
  }
  _requiredIfManual = formControlName => {
    return control => {
      const toggle = this.form?.get(formControlName)?.value;
      if (toggle === "manual") return _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required(control);
      return null;
    };
  };
  _updateRangeProgress() {
    requestAnimationFrame(() => {
      const slider = this.slippageSlider?.nativeElement;
      if (!slider) return;
      try {
        const value = parseFloat(this.form.get("slippage")?.value) || 0;
        const min = parseFloat(slider.min) || 0.1;
        const max = parseFloat(slider.max) || 0.8;
        if (isNaN(value) || isNaN(min) || isNaN(max)) return;
        const percentage = Math.max(0, Math.min(100, (value - min) / (max - min) * 100));
        slider.style.setProperty("--progress", `${percentage}%`);
      } catch (error) {
        console.error("Error updating range progress:", error);
      }
    });
  }
  close() {
    this._bottomSheetRef.dismiss();
  }
  confirm() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this.form.valid || _this.form.pristine) return;
      _this._bottomSheetRef.dismiss(_this.form.value);
    })();
  }
  toggleMode(controlName) {
    if (!this.form) return;
    const control = this.form.get(controlName);
    if (!control) return;
    const currentValue = control.value;
    const newValue = currentValue === "automatic" ? "manual" : "automatic";
    control.setValue(newValue);
    this.form.markAsDirty();
    if (controlName === "slippageToggle") {
      requestAnimationFrame(() => this._updateRangeProgress());
    }
  }
  static ɵfac = function SlippageSheetComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SlippageSheetComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_3__.MAT_BOTTOM_SHEET_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_3__.MatBottomSheetRef), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](app_services_network_service__WEBPACK_IMPORTED_MODULE_10__.NetworkService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({
    type: SlippageSheetComponent,
    selectors: [["slippage-sheet"]],
    viewQuery: function SlippageSheetComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵviewQuery"](_c0, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵloadQuery"]()) && (ctx.slippageSlider = _t.first);
      }
    },
    decls: 1,
    vars: 0,
    consts: [["slippageSlider", ""], [4, "transloco"], [1, "slippage-sheet", 3, "formGroup"], ["mat-flat-button", "", 1, "slippage-sheet__exit", 3, "click"], [1, "slippage-sheet__exit-icon"], ["width", "14", "height", "14", "viewBox", "0 0 14 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M13.3 0.710703C12.91 0.320703 12.28 0.320703 11.89 0.710703L6.99997 5.5907L2.10997 0.700703C1.71997 0.310703 1.08997 0.310703 0.699971 0.700703C0.309971 1.0907 0.309971 1.7207 0.699971 2.1107L5.58997 7.0007L0.699971 11.8907C0.309971 12.2807 0.309971 12.9107 0.699971 13.3007C1.08997 13.6907 1.71997 13.6907 2.10997 13.3007L6.99997 8.4107L11.89 13.3007C12.28 13.6907 12.91 13.6907 13.3 13.3007C13.69 12.9107 13.69 12.2807 13.3 11.8907L8.40997 7.0007L13.3 2.1107C13.68 1.7307 13.68 1.0907 13.3 0.710703Z"], [1, "slippage-sheet__body"], [1, "slippage-sheet__title"], [1, "slippage-sheet__container"], [1, "slippage-sheet__switch-container"], [1, "slippage-sheet__switch-title"], [1, "slippage-sheet__switch-group"], [1, "slippage-sheet__switch", 3, "click"], [1, "slippage-sheet__switch-label", 3, "ngClass"], ["type", "checkbox", 1, "slippage-sheet__switch-input", 3, "checked"], [1, "slippage-sheet__switch-track"], [1, "slippage-sheet__switch-thumb"], [1, "slippage-sheet__text"], [1, "slippage-sheet__slider-container"], [1, "slippage-sheet__slider-input-row"], [1, "slippage-sheet__slider-input-container"], ["for", "slippage", 1, "slippage-sheet__slider-label"], [1, "slippage-sheet__slider-dots"], [1, "slippage-sheet__slider-dot"], ["formControlName", "slippage", "max", "0.8", "min", "0.1", "step", "0.1", "type", "range", 1, "slippage-sheet__slider"], [1, "slippage-sheet__slider-value"], [1, "slippage-sheet__slider-subtitle"], [1, "slippage-sheet__input-container"], [1, "zelf-input", "zelf-input--wide"], ["formControlName", "commission", "id", "commission", "name", "commission", "placeholder", "0.1", "required", "", "type", "number", 1, "zelf-input__control"], [1, "zelf-input__postfix", "slippage-sheet__input-postfix"], [1, "slippage-sheet__actions"], ["mat-flat-button", "", 1, "zelf-button", "zelf-button--primary", "zelf-button--wide", 3, "click"]],
    template: function SlippageSheetComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](0, SlippageSheetComponent_ng_container_0_Template, 64, 28, "ng-container", 1);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgClass, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.RangeValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControlName, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormsModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButton, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_5__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_5__.TranslocoDirective, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_5__.TranslocoPipe],
    styles: ["[_ngcontent-%COMP%]:root {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc);\n}\n\n.zelf-button-external-link[_ngcontent-%COMP%] {\n  display: block;\n}\n.zelf-button-external-link--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.zelf-button[_ngcontent-%COMP%] {\n  align-items: center;\n  border-radius: 16px;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  gap: 8px;\n  height: 56px;\n  justify-content: center;\n  outline: none;\n  padding: 8px 24px;\n  text-align: center;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.zelf-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-button[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: inherit;\n}\n.zelf-button__text--margin-right[_ngcontent-%COMP%] {\n  margin-right: 1rem;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-button--thin[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  padding: 12px 16px;\n}\n.zelf-button--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.zelf-button--wide.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-button--primary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button, #181818) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--primary[_ngcontent-%COMP%]:active {\n  --mdc-filled-button-container-color: var(--zns-theme-text-muted, #96939e) !important;\n  background-color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-hover, #ff5721) !important;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff) !important;\n  stroke: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-text-secondary, #73777f) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-text-secondary, #73777f) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--secondary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-button-secondary-text, #495057) !important;\n  background-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  color: var(--zns-theme-button-secondary-text, #495057) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-secondary-text, #495057);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus, .zelf-button--secondary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-border, #e3e3e3) !important;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]:focus, .zelf-button--tertiary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%] {\n  --mdc-outlined-button-label-text-color: var(--zns-theme-button, #181818) !important;\n  --mdc-outlined-button-outline-color: var(--zns-theme-border, #e3e3e3) !important;\n  border: 1px solid var(--zns-theme-button, #181818) !important;\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-button, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button, #181818);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus, .zelf-button--outlined[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--outlined[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--outlined[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%] {\n  border: none !important;\n  background-color: transparent !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--red[_ngcontent-%COMP%]:focus, .zelf-button--red[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n}\n.zelf-button--red[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e);\n}\n.zelf-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n}\n\n.zelf-icon-button[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  align-items: center;\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  border-radius: 56px;\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  font-weight: 600;\n  gap: 16px;\n  height: 56px;\n  justify-content: center;\n  min-height: 56px;\n  min-width: 56px;\n  outline: none;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  -webkit-user-select: none;\n          user-select: none;\n  width: 56px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-icon-button.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: var(--zns-theme-text, #181818);\n  height: 24px;\n  width: 24px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%] {\n  height: 40px;\n  min-height: 40px;\n  min-width: 40px;\n  width: 40px;\n  border-radius: 40px;\n  padding: 0 8px;\n}\n.zelf-icon-button--40.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 14px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  height: 20px;\n  width: 20px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e) !important;\n  stroke: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:active {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus, .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%] {\n  background-color: transparent !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]:focus, .zelf-icon-button--transparent[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--text[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: initial !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  height: auto;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n  width: auto;\n}\n\n.zelf-icon-button-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:first-child {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:last-child {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.zelf-action-button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: 8px;\n}\n.zelf-action-button__icon[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  background: var(--zns-theme-card, #ffffff);\n  border-radius: 32px;\n  outline: 1px var(--zns-theme-border, #e3e3e3) solid;\n  outline-offset: -1px;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  cursor: pointer;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n@media (max-width: 600px) {\n  .zelf-action-button__icon[_ngcontent-%COMP%] {\n    padding: 8px 14px;\n  }\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-size: 24px;\n  line-height: 1;\n  font-variation-settings: \"FILL\" 0, \"wght\" 400, \"GRAD\" 0, \"opsz\" 24;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-primary, #181818);\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .zelf-action-button__text[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon-box[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  position: relative;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n}\n.zelf-action-button__text[_ngcontent-%COMP%] {\n  width: auto;\n  white-space: nowrap;\n  text-align: center;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 11px;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  line-height: 16px;\n  letter-spacing: 0.5px;\n  word-wrap: normal;\n}\n\n[_nghost-%COMP%] {\n  position: relative;\n  display: block;\n  padding: calc(16px * var(--zns-space-scale, 1));\n  max-width: min(400px, var(--zns-card-width, 400px));\n  margin: 0 auto;\n}\n\n.slippage-sheet[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  justify-content: center;\n  align-items: center;\n  gap: calc(16px * var(--zns-space-scale, 1));\n}\n.slippage-sheet__exit[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  margin: calc(8px * var(--zns-space-scale, 1));\n  min-height: calc(32px * var(--zns-space-scale, 1));\n  min-width: calc(32px * var(--zns-space-scale, 1));\n  width: calc(32px * var(--zns-space-scale, 1));\n  height: calc(32px * var(--zns-space-scale, 1));\n  padding: calc(8px * var(--zns-space-scale, 1));\n  cursor: pointer;\n  outline: none;\n  border: none;\n  border-radius: 9999px;\n  background-color: transparent;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.slippage-sheet__exit[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: var(--zns-theme-text, #181818);\n}\n.slippage-sheet__exit[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button, #181818);\n  color: var(--zns-theme-card, #ffffff);\n}\n.slippage-sheet__exit[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.slippage-sheet__exit-icon[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.slippage-sheet__body[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  width: 100%;\n  justify-content: center;\n  align-items: center;\n}\n.slippage-sheet__container[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  width: 100%;\n  padding: calc(16px * var(--zns-space-scale, 1));\n  margin-bottom: calc(12px * var(--zns-space-scale, 1));\n  border-radius: 16px;\n  border: 1px solid var(--zns-theme-border-hover, #c3c6cf);\n}\n.slippage-sheet__switch-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: calc(12px * var(--zns-space-scale, 1));\n}\n.slippage-sheet__switch-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n}\n.slippage-sheet__switch-title[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  text-align: center;\n  vertical-align: middle;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n}\n.slippage-sheet__switch[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  position: relative;\n  cursor: pointer;\n  gap: calc(16px * var(--zns-space-scale, 1));\n}\n.slippage-sheet__switch-input[_ngcontent-%COMP%] {\n  position: absolute;\n  opacity: 0;\n  width: 0;\n  height: 0;\n}\n.slippage-sheet__switch-track[_ngcontent-%COMP%] {\n  position: relative;\n  width: calc(46px * var(--zns-space-scale, 1));\n  height: calc(26px * var(--zns-space-scale, 1));\n  background-color: var(--zns-theme-background-secondary, #f9f9fc);\n  border: 2px solid var(--zns-theme-text-secondary, #73777f);\n  border-radius: calc(14px * var(--zns-space-scale, 1));\n  transition: all 0.3s ease;\n  display: flex;\n  align-items: center;\n}\n.slippage-sheet__switch-thumb[_ngcontent-%COMP%] {\n  position: absolute;\n  left: calc(5px * var(--zns-space-scale, 1));\n  height: calc(16px * var(--zns-space-scale, 1));\n  width: calc(16px * var(--zns-space-scale, 1));\n  background-color: var(--zns-theme-text-secondary, #73777f);\n  border-radius: 50%;\n  transition: all 0.3s ease;\n}\n.slippage-sheet__switch-input[_ngcontent-%COMP%]:checked    + .slippage-sheet__switch-track[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-text, #181818);\n  border-color: var(--zns-theme-text, #181818);\n}\n.slippage-sheet__switch-input[_ngcontent-%COMP%]:checked    + .slippage-sheet__switch-track[_ngcontent-%COMP%]   .slippage-sheet__switch-thumb[_ngcontent-%COMP%] {\n  left: calc(100% - 23px);\n  background-color: var(--zns-theme-card, #ffffff);\n  width: calc(20px * var(--zns-space-scale, 1));\n  height: calc(20px * var(--zns-space-scale, 1));\n}\n.slippage-sheet__switch-label[_ngcontent-%COMP%] {\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  margin: 0;\n  color: var(--zns-theme-text-muted, #96939e);\n}\n.slippage-sheet__switch-label--active[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n}\n.slippage-sheet__icon[_ngcontent-%COMP%] {\n  margin-top: calc(28px * var(--zns-space-scale, 1));\n  fill: var(--zns-theme-text, #181818);\n}\n.slippage-sheet__title[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-title-family, \"Menda\", \"Arial Black\", sans-serif);\n  font-weight: 700;\n  font-size: calc(24px * var(--zns-font-scale, 1));\n  line-height: calc(24px * var(--zns-font-scale, 1));\n  letter-spacing: 0px;\n  text-align: center;\n  vertical-align: middle;\n  text-transform: uppercase;\n  margin: calc(16px * var(--zns-space-scale, 1)) 0 calc(8px * var(--zns-space-scale, 1));\n}\n.slippage-sheet__text[_ngcontent-%COMP%] {\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  margin: 0;\n  color: var(--zns-theme-text-secondary, #73777f);\n}\n.slippage-sheet__actions[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: calc(16px * var(--zns-space-scale, 1));\n  gap: calc(8px * var(--zns-space-scale, 1));\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n}\n.slippage-sheet__slider-container[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  margin-top: calc(12px * var(--zns-space-scale, 1));\n}\n.slippage-sheet__slider-input-row[_ngcontent-%COMP%] {\n  width: 100%;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  box-sizing: border-box;\n}\n.slippage-sheet__slider-subtitle[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 500;\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  line-height: calc(16px * var(--zns-font-scale, 1));\n  letter-spacing: 0.5px;\n  vertical-align: middle;\n  margin: 0;\n  color: var(--zns-theme-text, #181818);\n}\n.slippage-sheet__slider-input-container[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  box-sizing: border-box;\n  gap: calc(12px * var(--zns-space-scale, 1));\n  height: calc(32px * var(--zns-space-scale, 1));\n  border-radius: 32px;\n  background-color: var(--zns-theme-card-border, #eeedf1);\n  padding: 0 calc(8px * var(--zns-space-scale, 1));\n}\n.slippage-sheet__slider-value[_ngcontent-%COMP%] {\n  text-align: right;\n  font-weight: 500;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  background-color: var(--zns-theme-card-border, #eeedf1);\n  border-radius: 12px;\n  padding: 0 calc(8px * var(--zns-space-scale, 1));\n  height: calc(32px * var(--zns-space-scale, 1));\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-width: calc(42px * var(--zns-space-scale, 1));\n}\n.slippage-sheet__slider-label[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: calc(16px * var(--zns-space-scale, 1));\n}\n.slippage-sheet__slider-dots[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  position: absolute;\n  top: 50%;\n  left: 0;\n  right: 0;\n  transform: translateY(-50%);\n  z-index: 3;\n  padding: 0 calc(8px * var(--zns-space-scale, 1));\n  pointer-events: none;\n}\n.slippage-sheet__slider-dot[_ngcontent-%COMP%] {\n  width: calc(4px * var(--zns-space-scale, 1));\n  height: calc(4px * var(--zns-space-scale, 1));\n  background-color: var(--zns-theme-card, #ffffff);\n  opacity: 0.2;\n  border-radius: 50%;\n  z-index: 1;\n}\n.slippage-sheet__slider[_ngcontent-%COMP%] {\n  appearance: none;\n  width: 100%;\n  height: calc(16px * var(--zns-space-scale, 1));\n  border-radius: calc(20px * var(--zns-space-scale, 1));\n  background: var(--zns-theme-card-border, #eeedf1);\n  outline: none;\n  position: relative;\n  margin: 0;\n  z-index: 2;\n}\n.slippage-sheet__slider[_ngcontent-%COMP%]::-webkit-slider-runnable-track {\n  background: linear-gradient(to right, var(--zns-theme-text-secondary, #73777f) var(--progress, 0%), transparent var(--progress, 0%));\n  border-radius: calc(20px * var(--zns-space-scale, 1));\n  height: calc(16px * var(--zns-space-scale, 1));\n  width: 100%;\n}\n.slippage-sheet__slider[_ngcontent-%COMP%]::-webkit-slider-thumb {\n  box-sizing: content-box;\n  appearance: none;\n  background: var(--zns-theme-card, #ffffff);\n  border-radius: calc(20px * var(--zns-space-scale, 1));\n  border: calc(6px * var(--zns-space-scale, 1)) solid var(--zns-theme-text-secondary, #73777f);\n  box-shadow: none;\n  cursor: pointer;\n  height: calc(8px * var(--zns-space-scale, 1));\n  position: relative;\n  width: calc(8px * var(--zns-space-scale, 1));\n  z-index: 2;\n  margin-top: calc(-2px * var(--zns-space-scale, 1));\n}\n.slippage-sheet__slider[_ngcontent-%COMP%]::-moz-range-track {\n  background: linear-gradient(to right, var(--zns-theme-text-secondary, #73777f) var(--progress, 0%), transparent var(--progress, 0%));\n  border-radius: calc(20px * var(--zns-space-scale, 1));\n  height: calc(16px * var(--zns-space-scale, 1));\n  width: 100%;\n}\n.slippage-sheet__slider[_ngcontent-%COMP%]::-moz-range-progress {\n  background-color: var(--zns-theme-text-secondary, #73777f);\n  border-radius: calc(20px * var(--zns-space-scale, 1));\n  height: calc(16px * var(--zns-space-scale, 1));\n}\n.slippage-sheet__slider[_ngcontent-%COMP%]::-moz-range-thumb {\n  box-sizing: content-box;\n  margin-top: calc(-3px * var(--zns-space-scale, 1));\n  background: var(--zns-theme-card, #ffffff);\n  border-radius: 50%;\n  border: calc(6px * var(--zns-space-scale, 1)) solid var(--zns-theme-text-secondary, #73777f);\n  box-shadow: none;\n  cursor: pointer;\n  height: calc(8px * var(--zns-space-scale, 1));\n  width: calc(8px * var(--zns-space-scale, 1));\n  margin-top: calc(-2px * var(--zns-space-scale, 1));\n}\n.slippage-sheet__input-container[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: calc(12px * var(--zns-space-scale, 1));\n}\n.slippage-sheet__input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: calc(10px * var(--zns-space-scale, 1));\n  border-radius: calc(8px * var(--zns-space-scale, 1));\n  border: 1px solid #e0e0e0;\n  outline: none;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n}\n.slippage-sheet__input-postfix[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  margin-right: calc(16px * var(--zns-space-scale, 1));\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX2J1dHRvbnMuc2NzcyIsIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX3ZhcmlhYmxlcy5zY3NzIiwid2VicGFjazovLy4vc3JjL2FwcC9zbGlwcGFnZS1zaGVldC9zbGlwcGFnZS1zaGVldC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNJLGdFQzBCdUI7QUMzQjNCOztBRklBO0VBQ0ksY0FBQTtBRURKO0FGR0k7RUFDSSxXQUFBO0FFRFI7O0FGS0E7RUFDSSxtQkFBQTtFQUNBLG1CQUFBO0VBQ0EsWUFBQTtFQUNBLGVBQUE7RUFDQSxhQUFBO0VBQ0EsdUVDSWM7RURIZCxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxRQUFBO0VBQ0EsWUFBQTtFQUNBLHVCQUFBO0VBQ0EsYUFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7RUFDQSx5QkFBQTtVQUFBLGlCQUFBO0FFRko7QUZJSTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsUUFBQTtBRUZSO0FGS0k7RUFDSSxTQUFBO0VBQ0EsY0FBQTtBRUhSO0FGT1E7RUFDSSxrQkFBQTtBRUxaO0FGU0k7RUFDSSw2QkFBQTtFQUNBLCtDQ2xCYTtFRG1CYixlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQkFBQTtFQUNBLGlCQUFBO0VBQ0EsNkdBQ0k7QUVSWjtBRldRO0VBQ0ksZUFBQTtBRVRaO0FGWVE7RUFDSSw4Q0NoQ1M7QUNzQnJCO0FGYVE7RUFDSSxxQ0N0Q0E7RUR1Q0Esa0RDeEJFO0FDYWQ7QUZhWTtFQUNJLG9DQzFDSjtBQytCWjtBRmVRO0VBQ0ksbUJBQUE7RUFDQSxzREFBQTtBRWJaO0FGZVk7RUFDSSwwQ0NsREM7QUNxQ2pCO0FGa0JJO0VBQ0ksa0JBQUE7RUFDQSxrQkFBQTtBRWhCUjtBRm1CSTtFQUNJLFdBQUE7QUVqQlI7QUZtQlE7RUFDSSxtQkFBQTtBRWpCWjtBRnFCSTtFQUVJLGdGQUFBO0VBQ0EsK0VBQUE7RUFF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LHFEQUFBO0VBQ0EsNEZBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSw2Q0FBQTtFQUNBLGtCQUFBO0VBQ0EsNENBQUE7RUFDQSxVQUFBO0VBQ0Esa0RBQUE7QUF1ZFo7QUFwZFE7RUFDSSxvSUFBQTtFQUNBLHFEQUFBO0VBQ0EsOENBQUE7RUFDQSxXQUFBO0FBc2RaO0FBbmRRO0VBQ0ksMEREbFNTO0VDbVNULHFEQUFBO0VBQ0EsOENBQUE7QUFxZFo7QUFsZFE7RUFDSSx1QkFBQTtFQUNBLGtEQUFBO0VBQ0EsMENEMVJBO0VDMlJBLGtCQUFBO0VBQ0EsNEZBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSw2Q0FBQTtFQUNBLDRDQUFBO0VBQ0Esa0RBQUE7QUFvZFo7QUFoZEk7RUFDSSxXQUFBO0VBQ0Esa0RBQUE7QUFrZFI7QUEvY0k7RUFDSSxXQUFBO0VBQ0EsK0NBQUE7RUFDQSxvREFBQTtFQUNBLHlCQUFBO0VBQ0EsYUFBQTtFQUNBLGdEQUFBO0FBaWRSO0FBOWNJO0VBQ0kscUNEdFVJO0VDdVVKLG9EQUFBO0FBZ2RSIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcIi4vdmFyaWFibGVzXCI7XG5cbjpyb290IHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbn1cblxuLnplbGYtYnV0dG9uLWV4dGVybmFsLWxpbmsge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuXG4gICAgJi0td2lkZSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cbn1cblxuLnplbGYtYnV0dG9uIHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBnYXA6IDhweDtcbiAgICBoZWlnaHQ6IDU2cHg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBwYWRkaW5nOiA4cHggMjRweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG5cbiAgICBzcGFuIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogOHB4O1xuICAgIH1cblxuICAgIHAge1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIGNvbG9yOiBpbmhlcml0O1xuICAgIH1cblxuICAgICZfX3RleHQge1xuICAgICAgICAmLS1tYXJnaW4tcmlnaHQge1xuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0taHlwZXJsaW5rIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIHBhZGRpbmc6IDhweCAxNnB4O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmLS1zbWFsbCB7XG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tdGhpbiB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgcGFkZGluZzogMTJweCAxNnB4O1xuICAgIH1cblxuICAgICYtLXdpZGUge1xuICAgICAgICB3aWR0aDogMTAwJTtcblxuICAgICAgICAmLnplbGYtYnV0dG9uLS1oeXBlcmxpbmsge1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXByaW1hcnkge1xuICAgICAgICAvLyBNREMgbWF0LWZsYXQtYnV0dG9uIHBhaW50cyB2aWEgQ1NTIHZhcmlhYmxlczsgYWxpZ24gd2l0aCBaZWxmIHRva2VucyAoYXZvaWRzIGRlZmF1bHQgTWF0ZXJpYWwgYmx1ZSkuXG4gICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b259ICFpbXBvcnRhbnQ7XG4gICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tbGFiZWwtdGV4dC1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQ2FyZH0gIWltcG9ydGFudDtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmFjdGl2ZSB7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXJ9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5fSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVDYXJkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc2Vjb25kYXJ5IHtcbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeX0gIWltcG9ydGFudDtcbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0fSAhaW1wb3J0YW50O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVDYXJkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJvcmRlcn0gIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10ZXJ0aWFyeSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3IgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tb3V0bGluZWQge1xuICAgICAgICAtLW1kYy1vdXRsaW5lZC1idXR0b24tbGFiZWwtdGV4dC1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9ufSAhaW1wb3J0YW50O1xuICAgICAgICAtLW1kYy1vdXRsaW5lZC1idXR0b24tb3V0bGluZS1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQm9yZGVyfSAhaW1wb3J0YW50O1xuXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b247XG4gICAgICAgIH1cblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1yZWQge1xuICAgICAgICBib3JkZXI6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tZXJyb3Ige1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc3VjY2VzcyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdExpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRjb3JyZWN0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1waWxsIHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBtaW4taGVpZ2h0OiAwO1xuICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgICAgIHBhZGRpbmc6IDRweCAxMnB4O1xuICAgIH1cbn1cblxuLnplbGYtaWNvbi1idXR0b24ge1xuICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyLXJhZGl1czogNTZweDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgZ2FwOiAxNnB4O1xuICAgIGhlaWdodDogNTZweDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBtaW4taGVpZ2h0OiA1NnB4O1xuICAgIG1pbi13aWR0aDogNTZweDtcbiAgICBvdXRsaW5lOiBub25lO1xuICAgIHRyYW5zaXRpb246XG4gICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICB3aWR0aDogNTZweDtcblxuICAgIHNwYW4ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgfVxuXG4gICAgJi56ZWxmLWljb24tYnV0dG9uLS1ib3JkZXItc29mdCB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgfVxuXG4gICAgc3ZnIHtcbiAgICAgICAgdHJhbnNpdGlvbjogZmlsbCAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgaGVpZ2h0OiAyNHB4O1xuICAgICAgICB3aWR0aDogMjRweDtcbiAgICB9XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tYm9yZGVyLXNvZnQge1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIH1cblxuICAgICYtLTQwIHtcbiAgICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgICBtaW4taGVpZ2h0OiA0MHB4O1xuICAgICAgICBtaW4td2lkdGg6IDQwcHg7XG4gICAgICAgIHdpZHRoOiA0MHB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA0MHB4O1xuICAgICAgICBwYWRkaW5nOiAwIDhweDtcblxuICAgICAgICAmLnplbGYtaWNvbi1idXR0b24tLWJvcmRlci1zb2Z0IHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgaGVpZ2h0OiAyMHB4O1xuICAgICAgICAgICAgd2lkdGg6IDIwcHg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1oeXBlcmxpbmsge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICAgICAgcGFkZGluZzogOHB4IDE2cHg7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICYtLXNtYWxsIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tcHJpbWFyeSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6YWN0aXZlIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc2Vjb25kYXJ5IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXIgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10cmFuc3BhcmVudCB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10ZXh0IHtcbiAgICAgICAgd2lkdGg6IGF1dG8gIWltcG9ydGFudDtcbiAgICAgICAgbWluLXdpZHRoOiBpbml0aWFsICFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgJi0tZXJyb3Ige1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc3VjY2VzcyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdExpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRjb3JyZWN0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1waWxsIHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBoZWlnaHQ6IGF1dG87XG4gICAgICAgIG1pbi1oZWlnaHQ6IDA7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgcGFkZGluZzogNHB4IDEycHg7XG4gICAgICAgIHdpZHRoOiBhdXRvO1xuICAgIH1cbn1cblxuLnplbGYtaWNvbi1idXR0b24tZ3JvdXAge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDA7XG5cbiAgICAuemVsZi1pY29uLWJ1dHRvbiB7XG4gICAgICAgICY6Zmlyc3QtY2hpbGQge1xuICAgICAgICAgICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDA7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6bm90KDpmaXJzdC1jaGlsZCk6bm90KDpsYXN0LWNoaWxkKSB7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpsYXN0LWNoaWxkIHtcbiAgICAgICAgICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAwO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uemVsZi1hY3Rpb24tYnV0dG9uIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogOHB4O1xuXG4gICAgJl9faWNvbiB7XG4gICAgICAgIHBhZGRpbmc6IDEwcHggMjBweDtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDMycHg7XG4gICAgICAgIG91dGxpbmU6IDFweCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyIHNvbGlkO1xuICAgICAgICBvdXRsaW5lLW9mZnNldDogLTFweDtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogdmFyaWFibGVzLiRtaW5TbWFsbCkge1xuICAgICAgICAgICAgcGFkZGluZzogOHB4IDE0cHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBmaWxsIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgICAgIH1cblxuICAgICAgICAubWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBmb250LXNpemU6IDI0cHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcbiAgICAgICAgICAgIGZvbnQtdmFyaWF0aW9uLXNldHRpbmdzOlxuICAgICAgICAgICAgICAgIFwiRklMTFwiIDAsXG4gICAgICAgICAgICAgICAgXCJ3Z2h0XCIgNDAwLFxuICAgICAgICAgICAgICAgIFwiR1JBRFwiIDAsXG4gICAgICAgICAgICAgICAgXCJvcHN6XCIgMjQ7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHByaW1hcnlDb2xvcjtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQge1xuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLnplbGYtYWN0aW9uLWJ1dHRvbl9fdGV4dCB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9faWNvbi1ib3gge1xuICAgICAgICB3aWR0aDogMjhweDtcbiAgICAgICAgaGVpZ2h0OiAyOHB4O1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX190ZXh0IHtcbiAgICAgICAgd2lkdGg6IGF1dG87XG4gICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE2cHg7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjVweDtcbiAgICAgICAgd29yZC13cmFwOiBub3JtYWw7XG4gICAgfVxufVxuIiwiJHByaW1hcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXByaW1hcnksICMxODE4MTgpO1xuJHByaW1hcnlMaWdodDogI2RhZGRmYTtcbiRzZWNvbmRhcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXNlY29uZGFyeSwgI2ZmNTcyMSk7XG4kc2Vjb25kYXJ5Q29sb3JMaWdodDogI2Y2ZTVlMDtcblxuJGNvcnJlY3Q6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLCAjMWVhNDQ2KTtcbiRjb3JyZWN0RGFyazogIzBmNTIyMztcbiRjb3JyZWN0TGlnaHQ6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLXRleHQsICNlN2Y4ZWQpO1xuXG4kZXJyb3I6IHZhcigtLXpucy10aGVtZS1lcnJvciwgI2RjMzYyZSk7XG4kZXJyb3JEYXJrOiAjNjAxNDEwO1xuJGVycm9yTGlnaHQ6IHZhcigtLXpucy10aGVtZS1lcnJvci10ZXh0LCAjZmNlZWVlKTtcblxuJHdhcm5pbmc6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLCAjZGU2ODAwKTtcbiR3YXJuaW5nRGFyazogIzRhMjEwYTtcbiR3YXJuaW5nTGlnaHQ6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLXRleHQsICNmZmVlZTkpO1xuXG4kaW5mbzogIzM5OThkMztcbiRpbmZvRGFyazogIzAwNGE3NztcbiRpbmZvTGlnaHQ6ICNlY2YzZmU7XG5cbiRibGFjazogIzE4MTgxODtcbiR3aGl0ZTogI2ZmZmZmZjtcblxuJHRoZW1lQm9keUZhbWlseTogdmFyKC0tem5zLXRoZW1lLWJvZHktZmFtaWx5LCBcIlBvcHBpbnNcIiwgQXJpYWwsIHNhbnMtc2VyaWYpO1xuJHRoZW1lVGl0bGVGYW1pbHk6IHZhcigtLXpucy10aGVtZS10aXRsZS1mYW1pbHksIFwiTWVuZGFcIiwgXCJBcmlhbCBCbGFja1wiLCBzYW5zLXNlcmlmKTtcbiR0aGVtZU1vbm9zcGFjZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLW1vbm9zcGFjZS1mYW1pbHksIFwiQ291cmllciBOZXdcIiwgQ291cmllciwgbW9ub3NwYWNlKTtcblxuJHRoZW1lQmFja2dyb3VuZDogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQsICNmZmZmZmYpO1xuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQtc2Vjb25kYXJ5LCAjZjlmOWZjKTtcblxuJHRoZW1lVGV4dDogdmFyKC0tem5zLXRoZW1lLXRleHQsICMxODE4MTgpO1xuJHRoZW1lVGV4dE11dGVkOiB2YXIoLS16bnMtdGhlbWUtdGV4dC1tdXRlZCwgIzk2OTM5ZSk7XG4kdGhlbWVUZXh0U2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtdGV4dC1zZWNvbmRhcnksICM3Mzc3N2YpO1xuXG4kdGhlbWVIZWFkZXI6IHZhcigtLXpucy10aGVtZS1oZWFkZXIsICMxODE4MTgpO1xuJHRoZW1lSGVhZGVyVGV4dDogdmFyKC0tem5zLXRoZW1lLWhlYWRlci10ZXh0LCAjZmZmZmZmKTtcblxuJHRoZW1lQnV0dG9uOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLCAjMTgxODE4KTtcbiR0aGVtZUJ1dHRvblRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tdGV4dCwgI2ZmZmZmZik7XG4kdGhlbWVCdXR0b25Ib3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1ob3ZlciwgI2ZmNTcyMSk7XG5cbiR0aGVtZUJ1dHRvblNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnksICNlOWVjZWYpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktdGV4dCwgIzQ5NTA1Nyk7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktaG92ZXIsICNlOWVjZWYpO1xuXG4kdGhlbWVCb3JkZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXIsICNlM2UzZTMpO1xuJHRoZW1lQm9yZGVySG92ZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXItaG92ZXIsICNjM2M2Y2YpO1xuXG4kdGhlbWVDYXJkOiB2YXIoLS16bnMtdGhlbWUtY2FyZCwgI2ZmZmZmZik7XG4kdGhlbWVDYXJkQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtY2FyZC1ib3JkZXIsICNlZWVkZjEpO1xuXG4kdGhlbWVTaGFkb3c6IHZhcigtLXpucy10aGVtZS1zaGFkb3csIHJnYmEoMCwgMCwgMCwgMC4xKSk7XG5cbiRzbW9vdGhCZXppZXI6IGN1YmljLWJlemllcigwLjI1LCAwLjQsIDAuNywgMSk7XG5cbiRtYXhFeHRyYVNtYWxsOiA1OTVweDtcbiRtaW5TbWFsbDogNjAwcHg7XG4kbWVkaXVtOiA3NjhweDtcbiRsYXJnZTogODg5cHg7XG4kY29tcHV0ZXJzOiAxMjAwcHg7XG4iLCJAdXNlIFwiLi4vLi4vc3R5bGVzL3ZhcmlhYmxlc1wiO1xuQHVzZSBcIi4uLy4uL3N0eWxlcy9idXR0b25zXCI7XG5cbjpob3N0IHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgcGFkZGluZzogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgbWF4LXdpZHRoOiBtaW4oNDAwcHgsIHZhcigtLXpucy1jYXJkLXdpZHRoLCA0MDBweCkpO1xuICAgIG1hcmdpbjogMCBhdXRvO1xufVxuXG4uc2xpcHBhZ2Utc2hlZXQge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG5cbiAgICAmX19leGl0IHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB0b3A6IDA7XG4gICAgICAgIHJpZ2h0OiAwO1xuICAgICAgICBtYXJnaW46IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIG1pbi1oZWlnaHQ6IGNhbGMoMzJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBtaW4td2lkdGg6IGNhbGMoMzJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB3aWR0aDogY2FsYygzMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGhlaWdodDogY2FsYygzMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHBhZGRpbmc6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgb3V0bGluZTogbm9uZTtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogZmlsbCAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b247XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19leGl0LWljb24ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX19ib2R5IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgJl9fY29udGFpbmVyIHtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIHBhZGRpbmc6IGNhbGMoMTZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBtYXJnaW4tYm90dG9tOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUJvcmRlckhvdmVyO1xuICAgIH1cblxuICAgICZfX3N3aXRjaC1jb250YWluZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IGNhbGMoMTJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX3N3aXRjaC1ncm91cCB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19zd2l0Y2gtdGl0bGUge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMjBweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjFweDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICB9XG5cbiAgICAmX19zd2l0Y2gge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19zd2l0Y2gtaW5wdXQge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIG9wYWNpdHk6IDA7XG4gICAgICAgIHdpZHRoOiAwO1xuICAgICAgICBoZWlnaHQ6IDA7XG4gICAgfVxuXG4gICAgJl9fc3dpdGNoLXRyYWNrIHtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICB3aWR0aDogY2FsYyg0NnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGhlaWdodDogY2FsYygyNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5O1xuICAgICAgICBib3JkZXI6IDJweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogY2FsYygxNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2U7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgJl9fc3dpdGNoLXRodW1iIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICBsZWZ0OiBjYWxjKDVweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBoZWlnaHQ6IGNhbGMoMTZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB3aWR0aDogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2U7XG4gICAgfVxuXG4gICAgJl9fc3dpdGNoLWlucHV0OmNoZWNrZWQgKyAmX19zd2l0Y2gtdHJhY2sge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgYm9yZGVyLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICB9XG5cbiAgICAmX19zd2l0Y2gtaW5wdXQ6Y2hlY2tlZCArICZfX3N3aXRjaC10cmFjayAmX19zd2l0Y2gtdGh1bWIge1xuICAgICAgICBsZWZ0OiBjYWxjKDEwMCUgLSAyM3B4KTtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgIHdpZHRoOiBjYWxjKDIwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgaGVpZ2h0OiBjYWxjKDIwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19zd2l0Y2gtbGFiZWwge1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG5cbiAgICAgICAgJi0tYWN0aXZlIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2ljb24ge1xuICAgICAgICBtYXJnaW4tdG9wOiBjYWxjKDI4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgfVxuXG4gICAgJl9fdGl0bGUge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZVRpdGxlRmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMjRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDI0cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMHB4O1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgICAgIG1hcmdpbjogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSkgMCBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX3RleHQge1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgIH1cblxuICAgICZfX2FjdGlvbnMge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgbWFyZ2luLXRvcDogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGdhcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgJl9fc2xpZGVyLWNvbnRhaW5lciB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBtYXJnaW4tdG9wOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19zbGlkZXItaW5wdXQtcm93IHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGdhcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICB9XG5cbiAgICAmX19zbGlkZXItc3VidGl0bGUge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxMnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMTZweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjVweDtcbiAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgfVxuXG4gICAgJl9fc2xpZGVyLWlucHV0LWNvbnRhaW5lciB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICBnYXA6IGNhbGMoMTJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBoZWlnaHQ6IGNhbGMoMzJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAzMnB4O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICAgICAgcGFkZGluZzogMCBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX3NsaWRlci12YWx1ZSB7XG4gICAgICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICAgICAgICBwYWRkaW5nOiAwIGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGhlaWdodDogY2FsYygzMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBtaW4td2lkdGg6IGNhbGMoNDJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX3NsaWRlci1sYWJlbCB7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGhlaWdodDogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgfVxuXG4gICAgJl9fc2xpZGVyLWRvdHMge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgdG9wOiA1MCU7XG4gICAgICAgIGxlZnQ6IDA7XG4gICAgICAgIHJpZ2h0OiAwO1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7XG4gICAgICAgIHotaW5kZXg6IDM7XG4gICAgICAgIHBhZGRpbmc6IDAgY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgfVxuXG4gICAgJl9fc2xpZGVyLWRvdCB7XG4gICAgICAgIHdpZHRoOiBjYWxjKDRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBoZWlnaHQ6IGNhbGMoNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICBvcGFjaXR5OiAwLjI7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgei1pbmRleDogMTtcbiAgICB9XG5cbiAgICAmX19zbGlkZXIge1xuICAgICAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG4gICAgICAgIGFwcGVhcmFuY2U6IG5vbmU7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBoZWlnaHQ6IGNhbGMoMTZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiBjYWxjKDIwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICB6LWluZGV4OiAyO1xuXG4gICAgICAgICY6Oi13ZWJraXQtc2xpZGVyLXJ1bm5hYmxlLXRyYWNrIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgdmFyKC0tcHJvZ3Jlc3MsIDAlKSwgdHJhbnNwYXJlbnQgdmFyKC0tcHJvZ3Jlc3MsIDAlKSk7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiBjYWxjKDIwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgICAgIGhlaWdodDogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Oi13ZWJraXQtc2xpZGVyLXRodW1iIHtcbiAgICAgICAgICAgIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xuICAgICAgICAgICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xuICAgICAgICAgICAgYXBwZWFyYW5jZTogbm9uZTtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogY2FsYygyMHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgICAgICBib3JkZXI6IGNhbGMoNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSkgc29saWQgdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgICAgICBib3gtc2hhZG93OiBub25lO1xuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgaGVpZ2h0OiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICAgICAgd2lkdGg6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgICAgICB6LWluZGV4OiAyO1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogY2FsYygtMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIH1cblxuICAgICAgICAmOjotbW96LXJhbmdlLXRyYWNrIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCh0byByaWdodCwgdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgdmFyKC0tcHJvZ3Jlc3MsIDAlKSwgdHJhbnNwYXJlbnQgdmFyKC0tcHJvZ3Jlc3MsIDAlKSk7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiBjYWxjKDIwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgICAgIGhlaWdodDogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Oi1tb3otcmFuZ2UtcHJvZ3Jlc3Mge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiBjYWxjKDIwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgICAgIGhlaWdodDogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIH1cblxuICAgICAgICAmOjotbW96LXJhbmdlLXRodW1iIHtcbiAgICAgICAgICAgIGJveC1zaXppbmc6IGNvbnRlbnQtYm94O1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogY2FsYygtM3B4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgICAgIGJvcmRlcjogY2FsYyg2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IG5vbmU7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICBoZWlnaHQ6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgICAgICB3aWR0aDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IGNhbGMoLTJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9faW5wdXQtY29udGFpbmVyIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIG1hcmdpbi10b3A6IGNhbGMoMTJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX2lucHV0IHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIHBhZGRpbmc6IGNhbGMoMTBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZTBlMGUwO1xuICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgfVxuXG4gICAgJl9faW5wdXQtcG9zdGZpeCB7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ },

/***/ 84412
/*!**********************************************************!*\
  !*** ./src/app/swap-currency/swap-currency.component.ts ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SwapCurrencyComponent: () => (/* binding */ SwapCurrencyComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core/rxjs-interop */ 49074);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/core */ 86362);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var app_zelf_loader_zelf_loader_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! app/zelf-loader/zelf-loader.component */ 40152);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var app_asset_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! app/asset.service */ 25931);
/* harmony import */ var app_services_lifi_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! app/services/lifi.service */ 53520);
/* harmony import */ var app_services_network_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! app/services/network.service */ 32404);
/* harmony import */ var app_wallet_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! app/wallet.service */ 69556);
/* harmony import */ var app_services_settings_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! app/services/settings.service */ 40875);


















const _c0 = ["assetsContainer"];
const _c1 = a0 => ({
  "swap-currency__list-tab--active": a0
});
const _c2 = a0 => ({
  "zelf-button--primary": a0
});
const _c3 = a0 => ({
  "swap-currency__asset--selected": a0
});
const _c4 = a0 => ({
  "swap-currency__pct--down": a0
});
function SwapCurrencyComponent_div_0_ng_container_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainer"](0);
  }
}
function SwapCurrencyComponent_div_0_div_19_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "button", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function SwapCurrencyComponent_div_0_div_19_button_1_Template_button_click_0_listener() {
      const network_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r3).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.toggleNetworkFilter(network_r4));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    let tmp_7_0;
    const network_r4 = ctx.$implicit;
    const t_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](4, _c2, ((tmp_7_0 = ctx_r1.form.get("networkFilter")) == null ? null : tmp_7_0.value) === network_r4));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", network_r4 === "all" ? t_r5("common.all") : _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 2, network_r4), " ");
  }
}
function SwapCurrencyComponent_div_0_div_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, SwapCurrencyComponent_div_0_div_19_button_1_Template, 3, 6, "button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r1.networkOptions);
  }
}
function SwapCurrencyComponent_div_0_div_22_img_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "img", 37);
  }
  if (rf & 2) {
    const asset_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("src", ctx_r1.getNetworkBadge(asset_r7), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeUrl"]);
  }
}
function SwapCurrencyComponent_div_0_div_22_ng_container_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "span", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "\u2022");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "span", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const chg_r8 = ctx.ngIf;
    const asset_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](2, _c4, ctx_r1.isPriceChangeNegative(asset_r7)));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](chg_r8);
  }
}
function SwapCurrencyComponent_div_0_div_22_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function SwapCurrencyComponent_div_0_div_22_Template_div_click_0_listener() {
      const asset_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r6).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.selectAsset(asset_r7));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "div", 26)(2, "div", 27)(3, "img", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("error", function SwapCurrencyComponent_div_0_div_22_Template_img_error_3_listener() {
      const asset_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r6).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.onImageError(asset_r7));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, SwapCurrencyComponent_div_0_div_22_img_4_Template, 1, 1, "img", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "div", 30)(6, "p", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "p", 32)(9, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](11, SwapCurrencyComponent_div_0_div_22_ng_container_11_Template, 5, 4, "ng-container", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "div", 33)(13, "div", 34)(14, "p", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](16, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "p", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](19, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const asset_r7 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](17, _c3, asset_r7.name === ctx_r1.selectedAsset.name && asset_r7.symbol === ctx_r1.selectedAsset.symbol));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("alt", asset_r7.symbol)("src", ctx_r1.getAssetImage(asset_r7), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", asset_r7.network);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](asset_r7.symbol);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r1.formatTokenPrice(asset_r7));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.formatPriceChange(asset_r7));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind4"](16, 9, asset_r7.fiatBalance, "USD", "symbol", "1.2-2"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](19, 14, asset_r7.amount, "1.2-8"));
  }
}
function SwapCurrencyComponent_div_0_zelf_loader_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "zelf-loader");
  }
}
function SwapCurrencyComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 3)(1, "div", 4)(2, "button", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function SwapCurrencyComponent_div_0_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.emitPickerBack());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "svg", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](4, "path", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "h2", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "form", 9)(8, "div", 10)(9, "div", 11)(10, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](11, "input", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](13, SwapCurrencyComponent_div_0_ng_container_13_Template, 1, 0, "ng-container", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](14, "div", 16)(15, "button", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function SwapCurrencyComponent_div_0_Template_button_click_15_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.setTokenListTab("yours"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](17, "button", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function SwapCurrencyComponent_div_0_Template_button_click_17_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.setTokenListTab("trusted"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](19, SwapCurrencyComponent_div_0_div_19_Template, 2, 1, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](20, "div", 19, 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("scroll", function SwapCurrencyComponent_div_0_Template_div_scroll_20_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.onScroll($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](22, SwapCurrencyComponent_div_0_div_22_Template, 20, 19, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](23, SwapCurrencyComponent_div_0_zelf_loader_23_Template, 1, 0, "zelf-loader", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r5 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    const search_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r1.source === "source" ? t_r5("swap.search_source_token") : t_r5("swap.search_destination_token"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formGroup", ctx_r1.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("placeholder", t_r5("common.search"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", search_r9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](11, _c1, ctx_r1.tokenListTab === "yours"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", t_r5("swap.your_tokens"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](13, _c1, ctx_r1.tokenListTab === "trusted"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", t_r5("swap.trusted_tokens"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx_r1.parentNetworkId);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r1.displayedAssets);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.loading);
  }
}
function SwapCurrencyComponent_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "svg", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "path", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
class SwapCurrencyComponent {
  _assetService;
  _destroyRef;
  _fb;
  _lifiService;
  _networkService;
  _walletService;
  _settingsService;
  _cdr;
  assetsContainer;
  source = "source";
  selectedAsset = {};
  myAssets = [];
  showAllTokens = true;
  /** When set, only tokens on this chain (lowercase id, e.g. ethereum) are listed. */
  parentNetworkId = null;
  /** Token already chosen on the other swap side; hidden so the same asset cannot be selected twice. */
  excludeOppositeAsset = null;
  assetChange = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
  pickerBack = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
  tokenListTab = "yours";
  _pageSize = 40;
  _myAssetsMap = {};
  assets = [];
  form;
  loading = false;
  maxPage = 1;
  minPage = 1;
  networkOptions = [];
  selectedNetworkFilter = "all";
  constructor(_assetService, _destroyRef, _fb, _lifiService, _networkService, _walletService, _settingsService, _cdr) {
    this._assetService = _assetService;
    this._destroyRef = _destroyRef;
    this._fb = _fb;
    this._lifiService = _lifiService;
    this._networkService = _networkService;
    this._walletService = _walletService;
    this._settingsService = _settingsService;
    this._cdr = _cdr;
    this.loading = true;
    this._initNetworkOptions();
    this._initForm();
  }
  _initNetworkOptions() {
    const enabledNetworkIds = this._getEnabledNetworkIds();
    this.networkOptions = ["all", ...Object.keys(this._assetService.canSwap).map(networkSymbol => {
      const canSwap = this._assetService.canSwap[networkSymbol];
      if (!canSwap) return "";
      const networkName = this._networkService.getNetworkName(networkSymbol);
      // Check if network is enabled in settings
      if (enabledNetworkIds && !enabledNetworkIds.includes(networkName.toLowerCase())) {
        return "";
      }
      return networkName;
    }).filter(networkName => networkName !== "" && networkName !== undefined && networkName !== null)];
  }
  ngOnInit() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this._ensureNetworkFilterDefaults();
      _this._settingsService.settings$.pipe((0,_angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_3__.takeUntilDestroyed)(_this._destroyRef)).subscribe(() => {
        _this._initNetworkOptions();
        _this._cdr.markForCheck();
      });
      try {
        yield _this._initializeAssets();
      } catch (error) {
        console.error("Error in ngOnInit:", error);
      } finally {
        _this.loading = false;
      }
    })();
  }
  ngOnChanges(changes) {
    if (changes["parentNetworkId"] && this.form) {
      this.form.patchValue({
        networkFilter: "all"
      }, {
        emitEvent: false
      });
      this.selectedNetworkFilter = "all";
      this._resetPaging();
      const ch = changes["parentNetworkId"];
      if (!ch.isFirstChange() && ch.previousValue !== ch.currentValue) {
        void this._fetchAndMapTokens();
      }
    }
    if (changes["excludeOppositeAsset"] && this.form) {
      this._resetPaging();
    }
    this._ensureNetworkFilterDefaults();
  }
  get displayedAssets() {
    return this.tabFilteredAssets.slice(this.minPage - 1, this.maxPage * this._pageSize);
  }
  get tabFilteredAssets() {
    const base = this.filteredAssets;
    if (this.tokenListTab !== "yours") return base;
    return base.filter(a => {
      const fiat = parseFloat(String(a.fiatBalance ?? 0)) || 0;
      const amt = parseFloat(String(a.amount ?? 0)) || 0;
      return fiat > 0 || amt > 0;
    });
  }
  _getEnabledNetworkIds() {
    return this._settingsService.getEnabledNetworkIds();
  }
  _isNetworkEnabled(networkName) {
    const enabledNetworkIds = this._getEnabledNetworkIds();
    if (!enabledNetworkIds) return true;
    return enabledNetworkIds.includes(networkName.toLowerCase());
  }
  /** Aligns with swap form `_notMatchingValidator` (symbol + network). */
  _swapAssetIdentityKey(asset) {
    if (!asset?.symbol || !asset?.network) return null;
    return `${String(asset.symbol).toLowerCase()}-${String(asset.network).toLowerCase()}`;
  }
  get filteredAssets() {
    const excludeKey = this._swapAssetIdentityKey(this.excludeOppositeAsset);
    return this.assets.filter(asset => {
      if (!asset) return false;
      const networkName = asset.network || "";
      if (!this._isNetworkEnabled(networkName)) return false;
      if (excludeKey && this._swapAssetIdentityKey(asset) === excludeKey) return false;
      if (this.parentNetworkId && networkName.toLowerCase() !== this.parentNetworkId.toLowerCase()) return false;
      const raw = this.form.get("networkFilter")?.value;
      const selectedNetwork = typeof raw === "string" && raw.trim() !== "" ? raw.trim().toLowerCase() : "all";
      const matchesNetwork = selectedNetwork === "all" || networkName.toLowerCase() === selectedNetwork;
      const searchText = this.form.get("textFilter")?.value?.toLowerCase() || "";
      const matchesText = !searchText || asset.name && asset.name.toLowerCase().includes(searchText) || asset.symbol && asset.symbol.toLowerCase().includes(searchText);
      return matchesNetwork && matchesText;
    });
  }
  get myAssetsMap() {
    return this._myAssetsMap;
  }
  _fetchAndMapTokens() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this2.loading = true;
      try {
        const allTokens = [];
        const {
          tokens
        } = yield _this2._lifiService.requestTokens(_this2.parentNetworkId);
        if (tokens && Object.keys(tokens).length) {
          Object.entries(tokens).forEach(([chainId, tokenList]) => _this2._mapTokenResponse([chainId, tokenList], allTokens));
        }
        _this2._appendWalletOnlySwappableTokens(allTokens);
        allTokens.sort((a, b) => _this2._sortAssets(a, b));
        _this2.assets = allTokens;
        _this2._resetPaging();
        _this2.loading = false;
        return _this2.assets;
      } catch (error) {
        _this2.loading = false;
        const fallback = [];
        _this2._appendWalletOnlySwappableTokens(fallback);
        fallback.sort((a, b) => _this2._sortAssets(a, b));
        _this2.assets = fallback;
        _this2._resetPaging();
        return _this2.assets;
      }
    })();
  }
  /** LiFi catalog omits some enabled chains (e.g. Stellar); still list wallet balances for swap picker. */
  _appendWalletOnlySwappableTokens(allTokens) {
    const seen = new Set();
    for (const a of allTokens) {
      const id = this._swapAssetIdentityKey(a);
      if (id) seen.add(id);
    }
    for (const wallet of this.myAssets) {
      if (!wallet?.symbol || !wallet?.network) continue;
      const id = this._swapAssetIdentityKey(wallet);
      if (!id || seen.has(id)) continue;
      if (!this._isNetworkEnabled(wallet.network)) continue;
      if (this.parentNetworkId && String(wallet.network).toLowerCase() !== this.parentNetworkId.toLowerCase()) {
        continue;
      }
      const sym = this._networkService.getNetworkSymbol(String(wallet.network).toLowerCase());
      if (!sym || !this._assetService.canSwap[sym]) continue;
      seen.add(id);
      const priceNum = typeof wallet.price === "number" ? wallet.price : parseFloat(String(wallet.price ?? 0)) || 0;
      const w = wallet;
      allTokens.push({
        amount: wallet.amount ?? "0",
        balance: wallet.balance ?? String(wallet.amount ?? "0"),
        balanceUsd: wallet.balanceUsd ?? "0",
        contractAddress: wallet.contractAddress ?? w.address_token ?? "",
        decimals: wallet.decimals,
        fiatBalance: wallet.fiatBalance ?? "0",
        image: wallet.image ?? "",
        name: wallet.name ?? wallet.symbol,
        network: wallet.network,
        price: priceNum,
        symbol: wallet.symbol,
        tokenType: wallet.tokenType || "token"
      });
    }
  }
  _ensureNetworkFilterDefaults() {
    if (!this.form) return;
    const v = this.form.get("networkFilter")?.value;
    if (v == null || v === "" || typeof v === "string" && v.trim() === "") {
      this.form.patchValue({
        networkFilter: "all"
      }, {
        emitEvent: false
      });
      this.selectedNetworkFilter = "all";
    }
  }
  _initForm() {
    this.form = this._fb.group({
      textFilter: [""],
      networkFilter: ["all"]
    });
    this.form.valueChanges.pipe((0,_angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_3__.takeUntilDestroyed)(this._destroyRef)).subscribe(() => this._resetPaging());
  }
  _initializeAssets() {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this3._setMyAssetsMap(_this3.myAssets);
      try {
        yield _this3._fetchAndMapTokens();
      } catch (error) {}
      _this3._resetPaging();
      _this3.loading = false;
    })();
  }
  _mapTokenResponse = ([chainId, tokens], allTokens) => {
    if (!Array.isArray(tokens)) return;
    const chainMap = {};
    const network = this._lifiService.chainBucketKeyToInternalNetwork(chainId);
    const canSwap = this._assetService.canSwap[this._networkService.getNetworkSymbol(network)];
    if (!canSwap) return;
    const chainTokens = [];
    tokens.forEach(token => {
      const key = `${token.symbol.toLowerCase()}-${network}`;
      if (chainMap[key]) return;
      chainMap[key] = true;
      let myAsset = {};
      if (this._myAssetsMap[key]) myAsset = this._myAssetsMap[key];
      const asset = {
        amount: "0",
        balance: "0",
        balanceUsd: "0",
        chainId,
        decimals: token.decimals,
        fiatBalance: "0",
        tokenType: "token",
        ...myAsset,
        contractAddress: token.address,
        image: token.logoURI || "",
        name: token.name,
        network: network.charAt(0).toUpperCase() + network.slice(1),
        price: token.priceUSD ? parseFloat(token.priceUSD) : 0,
        symbol: token.symbol
      };
      if (asset.image) this._walletService.setAssetImage(asset.symbol, asset.image);
      chainTokens.push(asset);
    });
    allTokens.push(...chainTokens);
  };
  _resetPaging() {
    this.minPage = 1;
    this.maxPage = 1;
  }
  _setMyAssetsMap(assets) {
    this._myAssetsMap = assets.reduce((acc, asset) => {
      const key = `${asset.symbol.toLowerCase()}-${asset.network.toLowerCase()}`;
      acc[key] = asset;
      return acc;
    }, {});
  }
  _sortAssets(a, b) {
    const aBalance = parseFloat(`${a.fiatBalance}` || "0");
    const bBalance = parseFloat(`${b.fiatBalance}` || "0");
    if (!aBalance && !bBalance) return a.priceUSD?.localeCompare(b.priceUSD) || 0;
    return bBalance - aBalance;
  }
  getAssetImage(asset) {
    return this._walletService.getAssetImage(asset.symbol, asset.image);
  }
  isNetworkSelected(network) {
    return this.selectedNetworkFilter === network;
  }
  onImageError(asset) {
    asset.image = "assets/tokens/placeholder-coin.png";
  }
  onScroll(event) {
    const el = event.target;
    const threshold = 20;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
    const atTop = el.scrollTop <= threshold;
    if (atBottom && this.maxPage * this._pageSize < this.tabFilteredAssets.length) {
      this.maxPage++;
      if (this.maxPage - this.minPage + 1 > 2) this.minPage++;
    } else if (atTop && this.minPage > 1) {
      this.minPage--;
      if (this.maxPage - this.minPage + 1 > 2) this.maxPage--;
    } else return;
  }
  selectAsset(asset) {
    this.assetChange.emit({
      asset,
      source: this.source
    });
  }
  toggleNetworkFilter(network) {
    this.selectedNetworkFilter = network;
    this.form.patchValue({
      networkFilter: network
    });
  }
  setTokenListTab(tab) {
    this.tokenListTab = tab;
    this._resetPaging();
  }
  emitPickerBack() {
    this.pickerBack.emit();
  }
  formatTokenPrice(asset) {
    const p = asset.price;
    if (p == null || Number.isNaN(p) || p <= 0) return "—";
    if (p < 0.0001) return `$${p.toExponential(2)}`;
    return `$${p.toFixed(p < 1 ? 6 : 2)}`;
  }
  formatPriceChange(asset) {
    const pct = asset.priceChangePercentage24h;
    if (pct == null || Number.isNaN(pct)) return null;
    const sign = pct > 0 ? "+" : "";
    return `${sign}${pct.toFixed(2)}%`;
  }
  isPriceChangeNegative(asset) {
    const pct = asset.priceChangePercentage24h;
    return typeof pct === "number" && pct < 0;
  }
  getNetworkBadge(asset) {
    const n = (asset.network || "").toLowerCase();
    if (!n) return "";
    return this._walletService.getAssetImage(this._networkService.getNetworkSymbol(n));
  }
  static ɵfac = function SwapCurrencyComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SwapCurrencyComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](app_asset_service__WEBPACK_IMPORTED_MODULE_11__.AssetService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_10__.DestroyRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](app_services_lifi_service__WEBPACK_IMPORTED_MODULE_12__.LifiService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](app_services_network_service__WEBPACK_IMPORTED_MODULE_13__.NetworkService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](app_wallet_service__WEBPACK_IMPORTED_MODULE_14__.WalletService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](app_services_settings_service__WEBPACK_IMPORTED_MODULE_15__.SettingsService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_9__.ChangeDetectorRef));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: SwapCurrencyComponent,
    selectors: [["swap-currency"]],
    viewQuery: function SwapCurrencyComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c0, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.assetsContainer = _t.first);
      }
    },
    inputs: {
      source: "source",
      selectedAsset: "selectedAsset",
      myAssets: "myAssets",
      showAllTokens: "showAllTokens",
      parentNetworkId: "parentNetworkId",
      excludeOppositeAsset: "excludeOppositeAsset"
    },
    outputs: {
      assetChange: "assetChange",
      pickerBack: "pickerBack"
    },
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵNgOnChangesFeature"]],
    decls: 3,
    vars: 0,
    consts: [["search", ""], ["assetsContainer", ""], ["class", "swap-currency", 4, "transloco"], [1, "swap-currency"], [1, "swap-currency__header"], ["mat-flat-button", "", "type", "button", 1, "swap-currency__back", "zelf-icon-button", "zelf-icon-button--secondary", "zelf-icon-button--40", 3, "click"], ["width", "22", "height", "14", "viewBox", "0 0 22 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"], [1, "swap-currency__title"], [1, "swap-currency__form", 3, "formGroup"], [1, "swap-currency__filters"], [1, "swap-currency__filter"], [1, "zelf-input", "zelf-input--wide"], ["formControlName", "textFilter", "id", "textFilter", "name", "textFilter", "required", "", "type", "text", 1, "zelf-input__control", 3, "placeholder"], [1, "zelf-input__postfix", "swap-currency__search-icon"], [4, "ngTemplateOutlet"], [1, "swap-currency__list-tabs"], ["mat-flat-button", "", "type", "button", 1, "swap-currency__list-tab", 3, "click", "ngClass"], ["class", "swap-currency__network-filters", 4, "ngIf"], [1, "swap-currency__assets", 3, "scroll"], ["class", "swap-currency__asset swap-currency__asset--hot", "md-ripple", "", 3, "ngClass", "click", 4, "ngFor", "ngForOf"], [4, "ngIf"], [1, "swap-currency__network-filters"], ["class", "zelf-button zelf-button--pill swap-currency__network-filter", "mat-flat-button", "", "type", "button", 3, "ngClass", "click", 4, "ngFor", "ngForOf"], ["mat-flat-button", "", "type", "button", 1, "zelf-button", "zelf-button--pill", "swap-currency__network-filter", 3, "click", "ngClass"], ["md-ripple", "", 1, "swap-currency__asset", "swap-currency__asset--hot", 3, "click", "ngClass"], [1, "swap-currency__asset-info", "swap-currency__asset-info--left"], [1, "swap-currency__asset-icon-wrap"], [1, "swap-currency__asset-image", 3, "error", "alt", "src"], ["alt", "", "class", "swap-currency__asset-network-badge", 3, "src", 4, "ngIf"], [1, "swap-currency__asset-col"], [1, "swap-currency__asset-symbol-hot"], [1, "swap-currency__asset-meta"], [1, "swap-currency__asset-info", "swap-currency__asset-info--right"], [1, "swap-currency__asset-col", "swap-currency__asset-col--right"], [1, "swap-currency__asset-balance-fiat-hot"], [1, "swap-currency__asset-balance-hot"], ["alt", "", 1, "swap-currency__asset-network-badge", 3, "src"], [1, "swap-currency__meta-sep"], [3, "ngClass"], ["viewBox", "0 0 18 18", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z"]],
    template: function SwapCurrencyComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, SwapCurrencyComponent_div_0_Template, 24, 15, "div", 2)(1, SwapCurrencyComponent_ng_template_1_Template, 2, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgTemplateOutlet, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormControlName, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_7__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_7__.TranslocoDirective, _angular_material_core__WEBPACK_IMPORTED_MODULE_5__.MatRippleModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButton, app_zelf_loader_zelf_loader_component__WEBPACK_IMPORTED_MODULE_8__.ZelfLoaderComponent, _angular_common__WEBPACK_IMPORTED_MODULE_1__.TitleCasePipe, _angular_common__WEBPACK_IMPORTED_MODULE_1__.CurrencyPipe, _angular_common__WEBPACK_IMPORTED_MODULE_1__.DecimalPipe],
    styles: ["[_ngcontent-%COMP%]:root {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc);\n}\n\n.zelf-button-external-link[_ngcontent-%COMP%] {\n  display: block;\n}\n.zelf-button-external-link--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.zelf-button[_ngcontent-%COMP%] {\n  align-items: center;\n  border-radius: 16px;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  gap: 8px;\n  height: 56px;\n  justify-content: center;\n  outline: none;\n  padding: 8px 24px;\n  text-align: center;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.zelf-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-button[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: inherit;\n}\n.zelf-button__text--margin-right[_ngcontent-%COMP%] {\n  margin-right: 1rem;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-button--thin[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  padding: 12px 16px;\n}\n.zelf-button--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.zelf-button--wide.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-button--primary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button, #181818) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--primary[_ngcontent-%COMP%]:active {\n  --mdc-filled-button-container-color: var(--zns-theme-text-muted, #96939e) !important;\n  background-color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-hover, #ff5721) !important;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff) !important;\n  stroke: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-text-secondary, #73777f) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-text-secondary, #73777f) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--secondary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-button-secondary-text, #495057) !important;\n  background-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  color: var(--zns-theme-button-secondary-text, #495057) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-secondary-text, #495057);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus, .zelf-button--secondary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-border, #e3e3e3) !important;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]:focus, .zelf-button--tertiary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%] {\n  --mdc-outlined-button-label-text-color: var(--zns-theme-button, #181818) !important;\n  --mdc-outlined-button-outline-color: var(--zns-theme-border, #e3e3e3) !important;\n  border: 1px solid var(--zns-theme-button, #181818) !important;\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-button, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button, #181818);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus, .zelf-button--outlined[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--outlined[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--outlined[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%] {\n  border: none !important;\n  background-color: transparent !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--red[_ngcontent-%COMP%]:focus, .zelf-button--red[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n}\n.zelf-button--red[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e);\n}\n.zelf-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n}\n\n.zelf-icon-button[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  align-items: center;\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  border-radius: 56px;\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  font-weight: 600;\n  gap: 16px;\n  height: 56px;\n  justify-content: center;\n  min-height: 56px;\n  min-width: 56px;\n  outline: none;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  -webkit-user-select: none;\n          user-select: none;\n  width: 56px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-icon-button.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: var(--zns-theme-text, #181818);\n  height: 24px;\n  width: 24px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%] {\n  height: 40px;\n  min-height: 40px;\n  min-width: 40px;\n  width: 40px;\n  border-radius: 40px;\n  padding: 0 8px;\n}\n.zelf-icon-button--40.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 14px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  height: 20px;\n  width: 20px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e) !important;\n  stroke: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:active {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus, .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%] {\n  background-color: transparent !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]:focus, .zelf-icon-button--transparent[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--text[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: initial !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  height: auto;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n  width: auto;\n}\n\n.zelf-icon-button-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:first-child {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:last-child {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.zelf-action-button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: 8px;\n}\n.zelf-action-button__icon[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  background: var(--zns-theme-card, #ffffff);\n  border-radius: 32px;\n  outline: 1px var(--zns-theme-border, #e3e3e3) solid;\n  outline-offset: -1px;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  cursor: pointer;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n@media (max-width: 600px) {\n  .zelf-action-button__icon[_ngcontent-%COMP%] {\n    padding: 8px 14px;\n  }\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-size: 24px;\n  line-height: 1;\n  font-variation-settings: \"FILL\" 0, \"wght\" 400, \"GRAD\" 0, \"opsz\" 24;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-primary, #181818);\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .zelf-action-button__text[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon-box[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  position: relative;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n}\n.zelf-action-button__text[_ngcontent-%COMP%] {\n  width: auto;\n  white-space: nowrap;\n  text-align: center;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 11px;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  line-height: 16px;\n  letter-spacing: 0.5px;\n  word-wrap: normal;\n}\n\n[_nghost-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: calc(16px * var(--zns-space-scale, 1));\n  width: 100%;\n  flex: 1 1 auto;\n}\n\n.swap-currency[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: calc(16px * var(--zns-space-scale, 1));\n  width: 100%;\n  flex: 1 1 auto;\n  height: 100%;\n}\n.swap-currency__header[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  width: 100%;\n}\n.swap-currency__back[_ngcontent-%COMP%] {\n  align-self: flex-start;\n}\n.swap-currency__title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 700;\n  font-size: calc(20px * var(--zns-font-scale, 1));\n  line-height: 1.2;\n  color: var(--zns-theme-text, #181818);\n}\n.swap-currency__form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: calc(16px * var(--zns-space-scale, 1));\n  flex: 1 1 auto;\n  min-height: 0;\n  width: 100%;\n}\n.swap-currency__list-tabs[_ngcontent-%COMP%] {\n  display: flex;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  width: 100%;\n}\n.swap-currency__list-tab[_ngcontent-%COMP%] {\n  flex: 1 1 0;\n  min-height: calc(36px * var(--zns-space-scale, 1)) !important;\n  border-radius: 9999px !important;\n  border: 1px solid var(--zns-theme-border, #e3e3e3) !important;\n  font-weight: 600 !important;\n  font-size: calc(13px * var(--zns-font-scale, 1)) !important;\n  background: transparent !important;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.swap-currency__list-tab--active[_ngcontent-%COMP%] {\n  border-color: var(--zns-theme-text, #181818) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  background: var(--zns-theme-card-border, #eeedf1) !important;\n}\n.swap-currency__loader[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  margin: auto;\n  z-index: 100;\n}\n.swap-currency__filters[_ngcontent-%COMP%] {\n  display: flex;\n  gap: calc(16px * var(--zns-space-scale, 1));\n  flex-direction: column;\n  width: 100%;\n}\n.swap-currency__filter[_ngcontent-%COMP%] {\n  display: flex;\n  width: 100%;\n}\n.swap-currency__search-icon[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text-secondary, #73777f);\n  margin-right: calc(24px * var(--zns-space-scale, 1));\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.swap-currency__search-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: calc(24px * var(--zns-space-scale, 1));\n  height: calc(24px * var(--zns-space-scale, 1));\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.swap-currency__network-filters[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  width: 100%;\n  max-width: 100%;\n  gap: calc(6px * var(--zns-space-scale, 1));\n}\n.swap-currency__network-filter[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 0 0 auto;\n  min-width: 0;\n  max-width: calc(50% - 4px);\n  gap: calc(4px * var(--zns-space-scale, 1));\n  height: calc(30px * var(--zns-space-scale, 1));\n  min-height: calc(30px * var(--zns-space-scale, 1));\n  padding: 0 calc(10px * var(--zns-space-scale, 1)) !important;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(11px * var(--zns-font-scale, 1)) !important;\n  line-height: 1;\n  letter-spacing: 0.1px;\n  vertical-align: middle;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.swap-currency__assets[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: calc(4px * var(--zns-space-scale, 1));\n  width: 100%;\n  flex: 1 1 auto;\n  height: 100%;\n  max-height: calc(490px * var(--zns-space-scale, 1));\n  overflow-y: auto;\n}\n.swap-currency__asset[_ngcontent-%COMP%] {\n  display: flex;\n  width: 100%;\n  gap: calc(16px * var(--zns-space-scale, 1));\n  align-items: center;\n  flex: 1 1 auto;\n  cursor: pointer;\n  padding: calc(16px * var(--zns-space-scale, 1));\n  max-height: calc(72px * var(--zns-space-scale, 1));\n  border-radius: 16px;\n  box-sizing: border-box;\n  transition: background-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.swap-currency__asset[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-card-border, #eeedf1);\n}\n.swap-currency__asset--selected[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card-border, #eeedf1);\n}\n.swap-currency__asset-info[_ngcontent-%COMP%] {\n  display: flex;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  align-items: center;\n}\n.swap-currency__asset-info--left[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n  flex: 1 1 auto;\n  width: 100%;\n}\n.swap-currency__asset-info--right[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n  flex: 0 0 auto;\n}\n.swap-currency__asset-col[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: calc(4px * var(--zns-space-scale, 1));\n}\n.swap-currency__asset-col--right[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n}\n.swap-currency__asset-image[_ngcontent-%COMP%] {\n  width: calc(32px * var(--zns-space-scale, 1));\n  height: calc(32px * var(--zns-space-scale, 1));\n  min-width: calc(32px * var(--zns-space-scale, 1));\n  min-height: calc(32px * var(--zns-space-scale, 1));\n  border-radius: 32px;\n  object-fit: contain;\n  overflow: hidden;\n}\n.swap-currency__asset-name[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  text-align: left;\n  vertical-align: middle;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n  display: inline-flex;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n}\n.swap-currency__asset-name-text[_ngcontent-%COMP%] {\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  max-width: calc(240px * var(--zns-space-scale, 1));\n}\n.swap-currency__asset-symbol[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  line-height: calc(16px * var(--zns-font-scale, 1));\n  letter-spacing: 0.5px;\n  vertical-align: middle;\n  color: var(--zns-theme-text-secondary, #73777f);\n  margin: 0;\n}\n.swap-currency__asset-balance[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n  text-align: right;\n}\n.swap-currency__asset-balance-fiat[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 400;\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  line-height: calc(18px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  color: var(--zns-theme-text-secondary, #73777f);\n  margin: 0;\n  text-align: right;\n}\n.swap-currency__asset--hot[_ngcontent-%COMP%] {\n  max-height: none;\n  min-height: calc(72px * var(--zns-space-scale, 1));\n  align-items: flex-start;\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  background: var(--zns-theme-card, #ffffff);\n}\n.swap-currency__asset-icon-wrap[_ngcontent-%COMP%] {\n  position: relative;\n  width: calc(40px * var(--zns-space-scale, 1));\n  height: calc(40px * var(--zns-space-scale, 1));\n  flex-shrink: 0;\n}\n.swap-currency__asset-network-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  right: -4px;\n  bottom: -2px;\n  width: calc(18px * var(--zns-space-scale, 1));\n  height: calc(18px * var(--zns-space-scale, 1));\n  border-radius: 50%;\n  border: 2px solid var(--zns-theme-card, #ffffff);\n  object-fit: contain;\n  background: var(--zns-theme-card-border, #eeedf1);\n}\n.swap-currency__asset-symbol-hot[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 700;\n  font-size: calc(16px * var(--zns-font-scale, 1));\n  margin: 0;\n  color: var(--zns-theme-text, #181818);\n}\n.swap-currency__asset-meta[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  font-weight: 500;\n  color: var(--zns-theme-text-secondary, #73777f);\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  gap: calc(4px * var(--zns-space-scale, 1));\n}\n.swap-currency__meta-sep[_ngcontent-%COMP%] {\n  opacity: 0.6;\n}\n.swap-currency__pct--down[_ngcontent-%COMP%] {\n  color: var(--zns-theme-error, #dc362e);\n}\n.swap-currency__asset-balance-fiat-hot[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: calc(15px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n  text-align: right;\n}\n.swap-currency__asset-balance-hot[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: calc(13px * var(--zns-font-scale, 1));\n  font-weight: 500;\n  color: var(--zns-theme-text-secondary, #73777f);\n  text-align: right;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX2J1dHRvbnMuc2NzcyIsIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX3ZhcmlhYmxlcy5zY3NzIiwid2VicGFjazovLy4vc3JjL2FwcC9zd2FwLWN1cnJlbmN5L3N3YXAtY3VycmVuY3kuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxnRUMwQnVCO0FDM0IzQjs7QUZJQTtFQUNJLGNBQUE7QUVESjtBRkdJO0VBQ0ksV0FBQTtBRURSOztBRktBO0VBQ0ksbUJBQUE7RUFDQSxtQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLHVFQ0ljO0VESGQsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsUUFBQTtFQUNBLFlBQUE7RUFDQSx1QkFBQTtFQUNBLGFBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7VUFBQSxpQkFBQTtBRUZKO0FGSUk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLFFBQUE7QUVGUjtBRktJO0VBQ0ksU0FBQTtFQUNBLGNBQUE7QUVIUjtBRk9RO0VBQ0ksa0JBQUE7QUVMWjtBRlNJO0VBQ0ksNkJBQUE7RUFDQSwrQ0NsQmE7RURtQmIsZUFBQTtFQUNBLGdCQUFBO0VBQ0EscUJBQUE7RUFDQSxpQkFBQTtFQUNBLDZHQUNJO0FFUlo7QUZXUTtFQUNJLGVBQUE7QUVUWjtBRllRO0VBQ0ksOENDaENTO0FDc0JyQjtBRmFRO0VBQ0kscUNDdENBO0VEdUNBLGtEQ3hCRTtBQ2FkO0FGYVk7RUFDSSxvQ0MxQ0o7QUMrQlo7QUZlUTtFQUNJLG1CQUFBO0VBQ0Esc0RBQUE7QUViWjtBRmVZO0VBQ0ksMENDbERDO0FDcUNqQjtBRmtCSTtFQUNJLGtCQUFBO0VBQ0Esa0JBQUE7QUVoQlI7QUZtQkk7RUFDSSxXQUFBO0FFakJSO0FGbUJRO0VBQ0ksbUJBQUE7QUVqQlo7QUZxQkk7RUFFSSxnRkFBQTtFQUNBLCtFQUFBO0VBRUEs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WUFBQTtBQXFkUjtBQWxkSTtFQUNJLHNDRDlTQTtBQ2t3QlI7QUFqZEk7RUFDSSxTQUFBO0VBQ0EsZ0RBQUE7RUFDQSxnQkFBQTtFQUNBLHFDRC9SSTtFQ2dTSixpQkFBQTtBQW1kUjtBQWhkSTtFQUNJLFNBQUE7RUFDQSxnREFBQTtFQUNBLGdCQUFBO0VBQ0EsK0NEclNhO0VDc1NiLGlCQUFBO0FBa2RSIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcIi4vdmFyaWFibGVzXCI7XG5cbjpyb290IHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbn1cblxuLnplbGYtYnV0dG9uLWV4dGVybmFsLWxpbmsge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuXG4gICAgJi0td2lkZSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cbn1cblxuLnplbGYtYnV0dG9uIHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBnYXA6IDhweDtcbiAgICBoZWlnaHQ6IDU2cHg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBwYWRkaW5nOiA4cHggMjRweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG5cbiAgICBzcGFuIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogOHB4O1xuICAgIH1cblxuICAgIHAge1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIGNvbG9yOiBpbmhlcml0O1xuICAgIH1cblxuICAgICZfX3RleHQge1xuICAgICAgICAmLS1tYXJnaW4tcmlnaHQge1xuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0taHlwZXJsaW5rIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIHBhZGRpbmc6IDhweCAxNnB4O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmLS1zbWFsbCB7XG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tdGhpbiB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgcGFkZGluZzogMTJweCAxNnB4O1xuICAgIH1cblxuICAgICYtLXdpZGUge1xuICAgICAgICB3aWR0aDogMTAwJTtcblxuICAgICAgICAmLnplbGYtYnV0dG9uLS1oeXBlcmxpbmsge1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXByaW1hcnkge1xuICAgICAgICAvLyBNREMgbWF0LWZsYXQtYnV0dG9uIHBhaW50cyB2aWEgQ1NTIHZhcmlhYmxlczsgYWxpZ24gd2l0aCBaZWxmIHRva2VucyAoYXZvaWRzIGRlZmF1bHQgTWF0ZXJpYWwgYmx1ZSkuXG4gICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b259ICFpbXBvcnRhbnQ7XG4gICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tbGFiZWwtdGV4dC1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQ2FyZH0gIWltcG9ydGFudDtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmFjdGl2ZSB7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXJ9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5fSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVDYXJkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc2Vjb25kYXJ5IHtcbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeX0gIWltcG9ydGFudDtcbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0fSAhaW1wb3J0YW50O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVDYXJkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJvcmRlcn0gIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10ZXJ0aWFyeSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3IgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tb3V0bGluZWQge1xuICAgICAgICAtLW1kYy1vdXRsaW5lZC1idXR0b24tbGFiZWwtdGV4dC1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9ufSAhaW1wb3J0YW50O1xuICAgICAgICAtLW1kYy1vdXRsaW5lZC1idXR0b24tb3V0bGluZS1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQm9yZGVyfSAhaW1wb3J0YW50O1xuXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b247XG4gICAgICAgIH1cblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1yZWQge1xuICAgICAgICBib3JkZXI6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tZXJyb3Ige1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc3VjY2VzcyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdExpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRjb3JyZWN0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1waWxsIHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBtaW4taGVpZ2h0OiAwO1xuICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgICAgIHBhZGRpbmc6IDRweCAxMnB4O1xuICAgIH1cbn1cblxuLnplbGYtaWNvbi1idXR0b24ge1xuICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyLXJhZGl1czogNTZweDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgZ2FwOiAxNnB4O1xuICAgIGhlaWdodDogNTZweDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBtaW4taGVpZ2h0OiA1NnB4O1xuICAgIG1pbi13aWR0aDogNTZweDtcbiAgICBvdXRsaW5lOiBub25lO1xuICAgIHRyYW5zaXRpb246XG4gICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICB3aWR0aDogNTZweDtcblxuICAgIHNwYW4ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgfVxuXG4gICAgJi56ZWxmLWljb24tYnV0dG9uLS1ib3JkZXItc29mdCB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgfVxuXG4gICAgc3ZnIHtcbiAgICAgICAgdHJhbnNpdGlvbjogZmlsbCAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgaGVpZ2h0OiAyNHB4O1xuICAgICAgICB3aWR0aDogMjRweDtcbiAgICB9XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tYm9yZGVyLXNvZnQge1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIH1cblxuICAgICYtLTQwIHtcbiAgICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgICBtaW4taGVpZ2h0OiA0MHB4O1xuICAgICAgICBtaW4td2lkdGg6IDQwcHg7XG4gICAgICAgIHdpZHRoOiA0MHB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA0MHB4O1xuICAgICAgICBwYWRkaW5nOiAwIDhweDtcblxuICAgICAgICAmLnplbGYtaWNvbi1idXR0b24tLWJvcmRlci1zb2Z0IHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgaGVpZ2h0OiAyMHB4O1xuICAgICAgICAgICAgd2lkdGg6IDIwcHg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1oeXBlcmxpbmsge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICAgICAgcGFkZGluZzogOHB4IDE2cHg7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICYtLXNtYWxsIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tcHJpbWFyeSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6YWN0aXZlIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc2Vjb25kYXJ5IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXIgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10cmFuc3BhcmVudCB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10ZXh0IHtcbiAgICAgICAgd2lkdGg6IGF1dG8gIWltcG9ydGFudDtcbiAgICAgICAgbWluLXdpZHRoOiBpbml0aWFsICFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgJi0tZXJyb3Ige1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc3VjY2VzcyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdExpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRjb3JyZWN0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1waWxsIHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBoZWlnaHQ6IGF1dG87XG4gICAgICAgIG1pbi1oZWlnaHQ6IDA7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgcGFkZGluZzogNHB4IDEycHg7XG4gICAgICAgIHdpZHRoOiBhdXRvO1xuICAgIH1cbn1cblxuLnplbGYtaWNvbi1idXR0b24tZ3JvdXAge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDA7XG5cbiAgICAuemVsZi1pY29uLWJ1dHRvbiB7XG4gICAgICAgICY6Zmlyc3QtY2hpbGQge1xuICAgICAgICAgICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDA7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6bm90KDpmaXJzdC1jaGlsZCk6bm90KDpsYXN0LWNoaWxkKSB7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpsYXN0LWNoaWxkIHtcbiAgICAgICAgICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAwO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uemVsZi1hY3Rpb24tYnV0dG9uIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogOHB4O1xuXG4gICAgJl9faWNvbiB7XG4gICAgICAgIHBhZGRpbmc6IDEwcHggMjBweDtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDMycHg7XG4gICAgICAgIG91dGxpbmU6IDFweCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyIHNvbGlkO1xuICAgICAgICBvdXRsaW5lLW9mZnNldDogLTFweDtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogdmFyaWFibGVzLiRtaW5TbWFsbCkge1xuICAgICAgICAgICAgcGFkZGluZzogOHB4IDE0cHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBmaWxsIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgICAgIH1cblxuICAgICAgICAubWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBmb250LXNpemU6IDI0cHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcbiAgICAgICAgICAgIGZvbnQtdmFyaWF0aW9uLXNldHRpbmdzOlxuICAgICAgICAgICAgICAgIFwiRklMTFwiIDAsXG4gICAgICAgICAgICAgICAgXCJ3Z2h0XCIgNDAwLFxuICAgICAgICAgICAgICAgIFwiR1JBRFwiIDAsXG4gICAgICAgICAgICAgICAgXCJvcHN6XCIgMjQ7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHByaW1hcnlDb2xvcjtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQge1xuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLnplbGYtYWN0aW9uLWJ1dHRvbl9fdGV4dCB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9faWNvbi1ib3gge1xuICAgICAgICB3aWR0aDogMjhweDtcbiAgICAgICAgaGVpZ2h0OiAyOHB4O1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX190ZXh0IHtcbiAgICAgICAgd2lkdGg6IGF1dG87XG4gICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE2cHg7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjVweDtcbiAgICAgICAgd29yZC13cmFwOiBub3JtYWw7XG4gICAgfVxufVxuIiwiJHByaW1hcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXByaW1hcnksICMxODE4MTgpO1xuJHByaW1hcnlMaWdodDogI2RhZGRmYTtcbiRzZWNvbmRhcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXNlY29uZGFyeSwgI2ZmNTcyMSk7XG4kc2Vjb25kYXJ5Q29sb3JMaWdodDogI2Y2ZTVlMDtcblxuJGNvcnJlY3Q6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLCAjMWVhNDQ2KTtcbiRjb3JyZWN0RGFyazogIzBmNTIyMztcbiRjb3JyZWN0TGlnaHQ6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLXRleHQsICNlN2Y4ZWQpO1xuXG4kZXJyb3I6IHZhcigtLXpucy10aGVtZS1lcnJvciwgI2RjMzYyZSk7XG4kZXJyb3JEYXJrOiAjNjAxNDEwO1xuJGVycm9yTGlnaHQ6IHZhcigtLXpucy10aGVtZS1lcnJvci10ZXh0LCAjZmNlZWVlKTtcblxuJHdhcm5pbmc6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLCAjZGU2ODAwKTtcbiR3YXJuaW5nRGFyazogIzRhMjEwYTtcbiR3YXJuaW5nTGlnaHQ6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLXRleHQsICNmZmVlZTkpO1xuXG4kaW5mbzogIzM5OThkMztcbiRpbmZvRGFyazogIzAwNGE3NztcbiRpbmZvTGlnaHQ6ICNlY2YzZmU7XG5cbiRibGFjazogIzE4MTgxODtcbiR3aGl0ZTogI2ZmZmZmZjtcblxuJHRoZW1lQm9keUZhbWlseTogdmFyKC0tem5zLXRoZW1lLWJvZHktZmFtaWx5LCBcIlBvcHBpbnNcIiwgQXJpYWwsIHNhbnMtc2VyaWYpO1xuJHRoZW1lVGl0bGVGYW1pbHk6IHZhcigtLXpucy10aGVtZS10aXRsZS1mYW1pbHksIFwiTWVuZGFcIiwgXCJBcmlhbCBCbGFja1wiLCBzYW5zLXNlcmlmKTtcbiR0aGVtZU1vbm9zcGFjZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLW1vbm9zcGFjZS1mYW1pbHksIFwiQ291cmllciBOZXdcIiwgQ291cmllciwgbW9ub3NwYWNlKTtcblxuJHRoZW1lQmFja2dyb3VuZDogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQsICNmZmZmZmYpO1xuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQtc2Vjb25kYXJ5LCAjZjlmOWZjKTtcblxuJHRoZW1lVGV4dDogdmFyKC0tem5zLXRoZW1lLXRleHQsICMxODE4MTgpO1xuJHRoZW1lVGV4dE11dGVkOiB2YXIoLS16bnMtdGhlbWUtdGV4dC1tdXRlZCwgIzk2OTM5ZSk7XG4kdGhlbWVUZXh0U2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtdGV4dC1zZWNvbmRhcnksICM3Mzc3N2YpO1xuXG4kdGhlbWVIZWFkZXI6IHZhcigtLXpucy10aGVtZS1oZWFkZXIsICMxODE4MTgpO1xuJHRoZW1lSGVhZGVyVGV4dDogdmFyKC0tem5zLXRoZW1lLWhlYWRlci10ZXh0LCAjZmZmZmZmKTtcblxuJHRoZW1lQnV0dG9uOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLCAjMTgxODE4KTtcbiR0aGVtZUJ1dHRvblRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tdGV4dCwgI2ZmZmZmZik7XG4kdGhlbWVCdXR0b25Ib3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1ob3ZlciwgI2ZmNTcyMSk7XG5cbiR0aGVtZUJ1dHRvblNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnksICNlOWVjZWYpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktdGV4dCwgIzQ5NTA1Nyk7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktaG92ZXIsICNlOWVjZWYpO1xuXG4kdGhlbWVCb3JkZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXIsICNlM2UzZTMpO1xuJHRoZW1lQm9yZGVySG92ZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXItaG92ZXIsICNjM2M2Y2YpO1xuXG4kdGhlbWVDYXJkOiB2YXIoLS16bnMtdGhlbWUtY2FyZCwgI2ZmZmZmZik7XG4kdGhlbWVDYXJkQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtY2FyZC1ib3JkZXIsICNlZWVkZjEpO1xuXG4kdGhlbWVTaGFkb3c6IHZhcigtLXpucy10aGVtZS1zaGFkb3csIHJnYmEoMCwgMCwgMCwgMC4xKSk7XG5cbiRzbW9vdGhCZXppZXI6IGN1YmljLWJlemllcigwLjI1LCAwLjQsIDAuNywgMSk7XG5cbiRtYXhFeHRyYVNtYWxsOiA1OTVweDtcbiRtaW5TbWFsbDogNjAwcHg7XG4kbWVkaXVtOiA3NjhweDtcbiRsYXJnZTogODg5cHg7XG4kY29tcHV0ZXJzOiAxMjAwcHg7XG4iLCJAdXNlIFwiLi4vLi4vc3R5bGVzL3ZhcmlhYmxlc1wiO1xuQHVzZSBcIi4uLy4uL3N0eWxlcy9idXR0b25zXCI7XG5cbjpob3N0IHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgZ2FwOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBmbGV4OiAxIDEgYXV0bztcbn1cblxuLnN3YXAtY3VycmVuY3kge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgZ2FwOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBmbGV4OiAxIDEgYXV0bztcbiAgICBoZWlnaHQ6IDEwMCU7XG5cbiAgICAmX19oZWFkZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgICAgICAgZ2FwOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX19iYWNrIHtcbiAgICAgICAgYWxpZ24tc2VsZjogZmxleC1zdGFydDtcbiAgICB9XG5cbiAgICAmX190aXRsZSB7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMjBweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjI7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICB9XG5cbiAgICAmX19mb3JtIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZmxleDogMSAxIGF1dG87XG4gICAgICAgIG1pbi1oZWlnaHQ6IDA7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgICZfX2xpc3QtdGFicyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGdhcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgJl9fbGlzdC10YWIge1xuICAgICAgICBmbGV4OiAxIDEgMDtcbiAgICAgICAgbWluLWhlaWdodDogY2FsYygzNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSkgIWltcG9ydGFudDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4ICFpbXBvcnRhbnQ7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMCAhaW1wb3J0YW50O1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTNweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSkgIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgJl9fbGlzdC10YWItLWFjdGl2ZSB7XG4gICAgICAgIGJvcmRlci1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgJl9fbG9hZGVyIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICBpbnNldDogMDtcbiAgICAgICAgbWFyZ2luOiBhdXRvO1xuICAgICAgICB6LWluZGV4OiAxMDA7XG4gICAgfVxuXG4gICAgJl9fZmlsdGVycyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGdhcDogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgICZfX2ZpbHRlciB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgICZfX3NlYXJjaC1pY29uIHtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBtYXJnaW4tcmlnaHQ6IGNhbGMoMjRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgd2lkdGg6IGNhbGMoMjRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICAgICAgaGVpZ2h0OiBjYWxjKDI0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fbmV0d29yay1maWx0ZXJzIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC13cmFwOiB3cmFwO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgbWF4LXdpZHRoOiAxMDAlO1xuICAgICAgICBnYXA6IGNhbGMoNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIC8vIE5vIG92ZXJmbG93IMOiwoDClCBwaWxscyB3cmFwIGludG8gbXVsdGlwbGUgcm93c1xuICAgIH1cblxuICAgICZfX25ldHdvcmstZmlsdGVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleDogMCAwIGF1dG87XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgbWF4LXdpZHRoOiBjYWxjKDUwJSAtIDRweCk7XG4gICAgICAgIGdhcDogY2FsYyg0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgaGVpZ2h0OiBjYWxjKDMwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgbWluLWhlaWdodDogY2FsYygzMHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHBhZGRpbmc6IDAgY2FsYygxMHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSkgIWltcG9ydGFudDtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTFweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSkgIWltcG9ydGFudDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjFweDtcbiAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgfVxuXG4gICAgJl9fYXNzZXRzIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiBjYWxjKDRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgZmxleDogMSAxIGF1dG87XG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgbWF4LWhlaWdodDogY2FsYyg0OTBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgIH1cblxuICAgICZfX2Fzc2V0IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGdhcDogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIHBhZGRpbmc6IGNhbGMoMTZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBtYXgtaGVpZ2h0OiBjYWxjKDcycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIH1cblxuICAgICAgICAmLS1zZWxlY3RlZCB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2Fzc2V0LWluZm8ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG5cbiAgICAgICAgJi0tbGVmdCB7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgICAgICAgICBmbGV4OiAxIDEgYXV0bztcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICB9XG5cbiAgICAgICAgJi0tcmlnaHQge1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgICAgICAgICAgIGZsZXg6IDAgMCBhdXRvO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fYXNzZXQtY29sIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiBjYWxjKDRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuXG4gICAgICAgICYtLXJpZ2h0IHtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19hc3NldC1pbWFnZSB7XG4gICAgICAgIHdpZHRoOiBjYWxjKDMycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgaGVpZ2h0OiBjYWxjKDMycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgbWluLXdpZHRoOiBjYWxjKDMycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgbWluLWhlaWdodDogY2FsYygzMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDMycHg7XG4gICAgICAgIG9iamVjdC1maXQ6IGNvbnRhaW47XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgfVxuXG4gICAgJl9fYXNzZXQtbmFtZSB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDE0cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygyMHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMXB4O1xuICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19hc3NldC1uYW1lLXRleHQge1xuICAgICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgbWF4LXdpZHRoOiBjYWxjKDI0MHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgfVxuXG4gICAgJl9fYXNzZXQtc3ltYm9sIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTJweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDE2cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC41cHg7XG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgIH1cblxuICAgICZfX2Fzc2V0LWJhbGFuY2Uge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMjBweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjFweDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICAgIH1cblxuICAgICZfX2Fzc2V0LWJhbGFuY2UtZmlhdCB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEycHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygxOHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMXB4O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgfVxuXG4gICAgJl9fYXNzZXQtLWhvdCB7XG4gICAgICAgIG1heC1oZWlnaHQ6IG5vbmU7XG4gICAgICAgIG1pbi1oZWlnaHQ6IGNhbGMoNzJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgfVxuXG4gICAgJl9fYXNzZXQtaWNvbi13cmFwIHtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICB3aWR0aDogY2FsYyg0MHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGhlaWdodDogY2FsYyg0MHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgIH1cblxuICAgICZfX2Fzc2V0LW5ldHdvcmstYmFkZ2Uge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIHJpZ2h0OiAtNHB4O1xuICAgICAgICBib3R0b206IC0ycHg7XG4gICAgICAgIHdpZHRoOiBjYWxjKDE4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgaGVpZ2h0OiBjYWxjKDE4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgICAgICBib3JkZXI6IDJweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgb2JqZWN0LWZpdDogY29udGFpbjtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgfVxuXG4gICAgJl9fYXNzZXQtc3ltYm9sLWhvdCB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICB9XG5cbiAgICAmX19hc3NldC1tZXRhIHtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTJweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC13cmFwOiB3cmFwO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IGNhbGMoNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgfVxuXG4gICAgJl9fbWV0YS1zZXAge1xuICAgICAgICBvcGFjaXR5OiAwLjY7XG4gICAgfVxuXG4gICAgJl9fcGN0LS1kb3duIHtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3I7XG4gICAgfVxuXG4gICAgJl9fYXNzZXQtYmFsYW5jZS1maWF0LWhvdCB7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDE1cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICAgIH1cblxuICAgICZfX2Fzc2V0LWJhbGFuY2UtaG90IHtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTNweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ },

/***/ 26660
/*!****************************************!*\
  !*** ./src/app/swap/swap.component.ts ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SwapComponent: () => (/* binding */ SwapComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ethers */ 71932);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ethers */ 29929);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 63617);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 33900);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 52575);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ 51567);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ 5057);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs/operators */ 63037);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs/operators */ 98764);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/menu */ 31034);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/progress-spinner */ 41134);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var _shared_types_wallet_types__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @shared/types/wallet.types */ 56169);
/* harmony import */ var app_core_utils_user_facing_transaction_error_util__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! app/core/utils/user-facing-transaction-error.util */ 50276);
/* harmony import */ var app_slippage_sheet_slippage_sheet_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! app/slippage-sheet/slippage-sheet.component */ 34104);
/* harmony import */ var app_zelf_loader_zelf_loader_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! app/zelf-loader/zelf-loader.component */ 40152);
/* harmony import */ var environments_environment__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! environments/environment */ 45312);
/* harmony import */ var _swap_currency_swap_currency_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../swap-currency/swap-currency.component */ 84412);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var app_asset_service__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! app/asset.service */ 25931);
/* harmony import */ var app_services_blockchain_transactions_service__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! app/services/blockchain-transactions.service */ 56122);
/* harmony import */ var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! @angular/material/bottom-sheet */ 15244);
/* harmony import */ var app_chrome_service__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! app/chrome.service */ 85043);
/* harmony import */ var app_services_lifi_service__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! app/services/lifi.service */ 53520);
/* harmony import */ var app_services_network_service__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! app/services/network.service */ 32404);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! @angular/material/snack-bar */ 3347);
/* harmony import */ var app_transaction_service__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! app/transaction.service */ 65443);
/* harmony import */ var app_vault_service__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! app/vault.service */ 19519);
/* harmony import */ var app_wallet_service__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! app/wallet.service */ 69556);
/* harmony import */ var app_tags_service__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! app/tags.service */ 73768);
/* harmony import */ var app_services_settings_service__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! app/services/settings.service */ 40875);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! @angular/material/button */ 69885);




































const _c0 = a0 => ({
  "swap__tab--active": a0
});
const _c1 = a0 => ({
  "swap-network-picker__row--selected": a0
});
const _c2 = a0 => ({
  "swap__hero--error": a0
});
const _c3 = a0 => ({
  "swap__hero-input-wrap--fiat": a0
});
const _c4 = a0 => ({
  "swap__pill--active": a0
});
const _c5 = a0 => ({
  bridge: a0
});
const _c6 = a0 => ({
  slippage: a0
});
const _c7 = a0 => ({
  "zelf-input--error": a0
});
const _c8 = a0 => ({
  remaining: a0
});
function SwapComponent_div_0_ng_container_1_div_1_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "div", 18)(1, "button", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵlistener"]("click", function SwapComponent_div_0_ng_container_1_div_1_div_4_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.setSwapMode("swaps"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](3, "button", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵlistener"]("click", function SwapComponent_div_0_ng_container_1_div_1_div_4_Template_button_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.setSwapMode("cross_chain"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpureFunction1"](4, _c0, ctx_r1.swapMode === "swaps"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate1"](" ", t_r4("swap.tab_swaps"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpureFunction1"](6, _c0, ctx_r1.swapMode === "cross_chain"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate1"](" ", t_r4("swap.tab_cross_chain"), " ");
  }
}
function SwapComponent_div_0_ng_container_1_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "div", 13)(1, "button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵlistener"]("click", function SwapComponent_div_0_ng_container_1_div_1_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.handleSwapNavBack());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](2, "svg", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](3, "path", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](4, SwapComponent_div_0_ng_container_1_div_1_div_4_Template, 5, 8, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", !ctx_r1.swapSource);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_2_button_12_div_7_img_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](0, "img", 34);
  }
  if (rf & 2) {
    const src_r8 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("src", src_r8, _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵsanitizeUrl"]);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_2_button_12_div_7_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const row_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate1"]("+", row_r7.extraTokenCount);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_2_button_12_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](1, SwapComponent_div_0_ng_container_1_ng_container_2_button_12_div_7_img_1_Template, 1, 1, "img", 32)(2, SwapComponent_div_0_ng_container_1_ng_container_2_button_12_div_7_span_2_Template, 2, 1, "span", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const row_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngForOf", row_r7.icons);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", row_r7.extraTokenCount > 0);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_2_button_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵlistener"]("click", function SwapComponent_div_0_ng_container_1_ng_container_2_button_12_Template_button_click_0_listener() {
      const row_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r6).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.selectSwapNetworkRow(row_r7));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](1, "div", 29)(2, "span", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](4, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpipe"](6, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](7, SwapComponent_div_0_ng_container_1_ng_container_2_button_12_div_7_Template, 3, 2, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const row_r7 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpureFunction1"](9, _c1, ctx_r1.selectedSwapNetworkId === row_r7.id));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](row_r7.displayName);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpipeBind4"](6, 4, row_r7.usdTotal, "USD", "symbol", "1.2-2"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", row_r7.icons.length || row_r7.extraTokenCount);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](1, "div", 20)(2, "h2", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](4, "div", 22)(5, "input", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵlistener"]("input", function SwapComponent_div_0_ng_container_1_ng_container_2_Template_input_input_5_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.networkPickerSearch = $event.target.value);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](6, "div", 24)(7, "button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵlistener"]("click", function SwapComponent_div_0_ng_container_1_ng_container_2_Template_button_click_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.selectAllSwapNetworks());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](8, "span", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](10, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](12, SwapComponent_div_0_ng_container_1_ng_container_2_button_12_Template, 8, 11, "button", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("swap.select_network"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("value", ctx_r1.networkPickerSearch)("placeholder", t_r4("swap.search_network"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpureFunction1"](7, _c1, !ctx_r1.selectedSwapNetworkId));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("swap.all_networks"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("swap.any_network_hint"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngForOf", ctx_r1.filteredNetworkPickerRows);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_zelf_loader_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](0, "zelf-loader", 76);
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("diameter", 30);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_9_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](0, "img", 82);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("src", ctx_r1.selectedSourceAsset.image, _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵsanitizeUrl"]);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "div", 77)(1, "div", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](2, SwapComponent_div_0_ng_container_1_ng_container_3_div_9_img_2_Template, 1, 1, "img", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](3, "img", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](4, "span", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.selectedSourceAsset.image);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("src", ctx_r1.getNetworkImage(ctx_r1.selectedSourceAsset.network), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](ctx_r1.selectedSourceAsset.symbol);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_span_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "span", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("swap.select_asset"));
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_17_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](0, "img", 82);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("src", ctx_r1.selectedTargetAsset.image, _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵsanitizeUrl"]);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_17_img_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](0, "img", 80);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("src", ctx_r1.getNetworkImage(ctx_r1.selectedTargetAsset.network), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵsanitizeUrl"]);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "div", 77)(1, "div", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](2, SwapComponent_div_0_ng_container_1_ng_container_3_div_17_img_2_Template, 1, 1, "img", 79)(3, SwapComponent_div_0_ng_container_1_ng_container_3_div_17_img_3_Template, 1, 1, "img", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](4, "span", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.selectedTargetAsset.image);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.selectedTargetAsset.network);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](ctx_r1.selectedTargetAsset.symbol);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_span_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "span", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("swap.select_asset"));
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_img_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](0, "img", 85);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("src", ctx_r1.getNetworkImage(ctx_r1.selectedSwapNetworkId), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵsanitizeUrl"]);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_span_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "span", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("swap.network_short"));
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainer"](0);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_input_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](0, "input", 87);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("max", ctx_r1.selectedSourceAsset.amount || null);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_input_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](0, "input", 88);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("max", ctx_r1.sourceFiatInputMax);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_p_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "p", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpipe"](2, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpipeBind4"](2, 1, ctx_r1.heroSecondaryUsd, "USD", "symbol", "1.2-2"), " ");
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_p_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "p", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpipe"](2, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate2"](" ", ctx_r1.selectedSourceAsset.symbol, " ", _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpipeBind2"](2, 2, ctx_r1.heroSecondaryTokenAmount, "1.0-8"), " ");
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_p_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "p", 90);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpipe"](2, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate3"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpipeBind2"](2, 3, ctx_r1.selectedSourceAsset.amount, "1.2-8"), " ", ctx_r1.selectedSourceAsset.symbol, " ", t_r4("swap.available_suffix"), " ");
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "div", 91)(1, "span", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](3, "span", 93);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpipe"](5, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpipe"](6, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    let tmp_13_0;
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("swap.est_receive"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate3"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpipeBind2"](5, 4, (tmp_13_0 = ctx_r1.form.get("targetAmount")) == null ? null : tmp_13_0.value, "1.2-8"), " ", ctx_r1.selectedTargetAsset.symbol, " (", _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpipeBind4"](6, 7, (tmp_13_0 = ctx_r1.form.get("targetFiat")) == null ? null : tmp_13_0.value, "USD", "symbol", "1.2-2"), ") ");
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_39_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "div", 91)(1, "span", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](3, "span", 93);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpipe"](5, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    let tmp_13_0;
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("swap.price"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate3"](" 1 ", ctx_r1.selectedSourceAsset.symbol, " = ", _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpipeBind2"](5, 4, (tmp_13_0 = ctx_r1.form.get("targetSwapValue")) == null ? null : tmp_13_0.value, "1.0-8"), " ", ctx_r1.selectedTargetAsset.symbol, " ");
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_41_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainer"](0);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_41_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "div", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](1, SwapComponent_div_0_ng_container_1_ng_container_3_div_41_ng_container_1_Template, 1, 0, "ng-container", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"]();
    const cross_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵreference"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngTemplateOutlet", cross_r10);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("errors.swap_same_asset"));
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_42_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainer"](0);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_42_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "div", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](1, SwapComponent_div_0_ng_container_1_ng_container_3_div_42_ng_container_1_Template, 1, 0, "ng-container", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"]();
    const cross_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵreference"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngTemplateOutlet", cross_r10);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("errors.insufficient_funds"));
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_43_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainer"](0);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_43_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "div", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](1, SwapComponent_div_0_ng_container_1_ng_container_3_div_43_ng_container_1_Template, 1, 0, "ng-container", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"]();
    const cross_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵreference"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngTemplateOutlet", cross_r10);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("errors.cannot_swap_across_these_networks"));
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_44_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainer"](0);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_44_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "div", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](1, SwapComponent_div_0_ng_container_1_ng_container_3_div_44_ng_container_1_Template, 1, 0, "ng-container", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"]();
    const cross_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵreference"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngTemplateOutlet", cross_r10);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("errors.swap_same_chain"));
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_ng_container_4_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainer"](0);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](1, SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_ng_container_4_ng_container_1_Template, 1, 0, "ng-container", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](5);
    const downArrowIcon_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵreference"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngTemplateOutlet", downArrowIcon_r12);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "button", 110);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵlistener"]("click", function SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_button_7_Template_button_click_0_listener() {
      const bridgeOption_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r13).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](5);
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.setBridge(bridgeOption_r14.value));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](1, "label", 111)(2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](4, "input", 112);
    _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](5, "svg", 113);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](6, "polyline", 114);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const bridgeOption_r14 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("for", bridgeOption_r14.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](bridgeOption_r14.label);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("id", bridgeOption_r14.value)("value", bridgeOption_r14.value);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_ng_container_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainer"](0);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_ng_container_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainer"](0);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_ng_container_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainer"](0);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_ng_container_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainer"](0);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_ng_container_39_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainer"](0);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](1, "div", 95)(2, "button", 96);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](3, "span", 97);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](4, SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_ng_container_4_Template, 2, 1, "ng-container", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](5, "mat-menu", 98, 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](7, SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_button_7_Template, 7, 4, "button", 99);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](8, "div", 100)(9, "div", 101)(10, "p", 102);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](12, "div", 103);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](13, SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_ng_container_13_Template, 1, 0, "ng-container", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](14, "div", 104)(15, "div", 105);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](16, SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_ng_container_16_Template, 1, 0, "ng-container", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](17, "p", 106);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](19, "div", 107)(20, "p", 108);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](21);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpipe"](22, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](23, "div", 100)(24, "div", 101)(25, "p", 102);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](26);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](27, "div", 103);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](28, SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_ng_container_28_Template, 1, 0, "ng-container", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](29, "div", 104)(30, "div", 105);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](31, SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_ng_container_31_Template, 1, 0, "ng-container", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](32, "p", 106);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](33);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](34, "div", 107)(35, "p", 108);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](36);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpipe"](37, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](38, "button", 109);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵlistener"]("click", function SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_Template_button_click_38_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r11);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.openSlippageSheet());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](39, SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_ng_container_39_Template, 1, 0, "ng-container", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    let tmp_22_0;
    let tmp_26_0;
    let tmp_27_0;
    const bridgeMenu_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵreference"](6);
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"]();
    const informationIcon_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵreference"](4);
    const editIcon_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵreference"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("disabled", ctx_r1.bridgeOptions.length < 2)("matMenuTriggerFor", bridgeMenu_r15);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("innerHTML", t_r4("swap.powered_by", _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpureFunction1"](24, _c5, ctx_r1.getBridgeLabel())), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵsanitizeHtml"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.bridgeOptions.length > 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngForOf", ctx_r1.bridgeOptions);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("swap.fees"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngTemplateOutlet", informationIcon_r16);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngTemplateOutlet", informationIcon_r16);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("swap.fees_text"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpipeBind4"](22, 16, (tmp_22_0 = ctx_r1.form.get("fee")) == null ? null : tmp_22_0.value, "USD", "symbol", "1.2-8"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("swap.slippage"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngTemplateOutlet", informationIcon_r16);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngTemplateOutlet", informationIcon_r16);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate1"](" ", t_r4("swap.slippage_text", _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpureFunction1"](26, _c6, (tmp_26_0 = ctx_r1.form.get("slippage")) == null ? null : tmp_26_0.value)), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpipeBind2"](37, 21, (tmp_27_0 = ctx_r1.form.get("slippage")) == null ? null : tmp_27_0.value, "1.2-2"), " %");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngTemplateOutlet", editIcon_r17);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_47_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainer"](0);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_47_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "div", 115);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](1, "input", 116);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](2, "label", 117);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](4, SwapComponent_div_0_ng_container_1_ng_container_3_div_47_ng_container_4_Template, 1, 0, "ng-container", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    let tmp_12_0;
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"]();
    const toggleButton_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵreference"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpureFunction1"](4, _c7, ((tmp_12_0 = ctx_r1.form.get("password")) == null ? null : tmp_12_0.dirty) && ((tmp_12_0 = ctx_r1.form.get("password")) == null ? null : tmp_12_0.errors)));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("type", ctx_r1.showPassword ? "text" : "password");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("common.password"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngTemplateOutlet", toggleButton_r18);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_48_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainer"](0);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_div_48_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "div", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](1, SwapComponent_div_0_ng_container_1_ng_container_3_div_48_ng_container_1_Template, 1, 0, "ng-container", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"]();
    const cross_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵreference"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngTemplateOutlet", cross_r10);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("errors.invalid_password", _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpureFunction1"](2, _c8, ctx_r1.remainingAttempts)));
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_50_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("swap.swap_now"));
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_51_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("common.verify"));
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_mat_spinner_52_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](0, "mat-spinner", 118);
  }
}
function SwapComponent_div_0_ng_container_1_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](1, "form", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵlistener"]("ngSubmit", function SwapComponent_div_0_ng_container_1_ng_container_3_Template_form_ngSubmit_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r9);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.confirmSwap());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](2, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](3, SwapComponent_div_0_ng_container_1_ng_container_3_zelf_loader_3_Template, 1, 1, "zelf-loader", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](4, "div", 39)(5, "div", 40)(6, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵlistener"]("click", function SwapComponent_div_0_ng_container_1_ng_container_3_Template_div_click_6_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r9);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.swapSource = "source");
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](7, "span", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](9, SwapComponent_div_0_ng_container_1_ng_container_3_div_9_Template, 6, 3, "div", 43)(10, SwapComponent_div_0_ng_container_1_ng_container_3_span_10_Template, 2, 1, "span", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](11, "button", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵlistener"]("click", function SwapComponent_div_0_ng_container_1_ng_container_3_Template_button_click_11_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r9);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.swapTargetWithSource());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](12, "svg", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](13, "path", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](14, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵlistener"]("click", function SwapComponent_div_0_ng_container_1_ng_container_3_Template_div_click_14_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r9);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.swapSource = "target");
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](15, "span", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](17, SwapComponent_div_0_ng_container_1_ng_container_3_div_17_Template, 6, 3, "div", 43)(18, SwapComponent_div_0_ng_container_1_ng_container_3_span_18_Template, 2, 1, "span", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](19, "button", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵlistener"]("click", function SwapComponent_div_0_ng_container_1_ng_container_3_Template_button_click_19_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r9);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.openNetworkPicker());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](20, SwapComponent_div_0_ng_container_1_ng_container_3_img_20_Template, 1, 1, "img", 49)(21, SwapComponent_div_0_ng_container_1_ng_container_3_span_21_Template, 2, 1, "span", 50)(22, SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_22_Template, 1, 0, "ng-container", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](23, "div", 52)(24, "div", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](25, SwapComponent_div_0_ng_container_1_ng_container_3_input_25_Template, 1, 1, "input", 54)(26, SwapComponent_div_0_ng_container_1_ng_container_3_input_26_Template, 1, 1, "input", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](27, SwapComponent_div_0_ng_container_1_ng_container_3_p_27_Template, 3, 6, "p", 56)(28, SwapComponent_div_0_ng_container_1_ng_container_3_p_28_Template, 3, 5, "p", 56)(29, SwapComponent_div_0_ng_container_1_ng_container_3_p_29_Template, 3, 6, "p", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](30, "div", 58)(31, "button", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵlistener"]("click", function SwapComponent_div_0_ng_container_1_ng_container_3_Template_button_click_31_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r9);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.handleBalanceDisplayChange());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](32);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](33, "button", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵlistener"]("click", function SwapComponent_div_0_ng_container_1_ng_container_3_Template_button_click_33_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r9);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.setAmount(0.5));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](34);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](35, "button", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵlistener"]("click", function SwapComponent_div_0_ng_container_1_ng_container_3_Template_button_click_35_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r9);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.setAmount(1));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtext"](36);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](37, "div", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](38, SwapComponent_div_0_ng_container_1_ng_container_3_div_38_Template, 7, 12, "div", 62)(39, SwapComponent_div_0_ng_container_1_ng_container_3_div_39_Template, 6, 7, "div", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](40, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](41, SwapComponent_div_0_ng_container_1_ng_container_3_div_41_Template, 4, 2, "div", 64)(42, SwapComponent_div_0_ng_container_1_ng_container_3_div_42_Template, 4, 2, "div", 64)(43, SwapComponent_div_0_ng_container_1_ng_container_3_div_43_Template, 4, 2, "div", 64)(44, SwapComponent_div_0_ng_container_1_ng_container_3_div_44_Template, 4, 2, "div", 64)(45, SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_45_Template, 40, 28, "ng-container", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](46, "div", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](47, SwapComponent_div_0_ng_container_1_ng_container_3_div_47_Template, 5, 6, "div", 66)(48, SwapComponent_div_0_ng_container_1_ng_container_3_div_48_Template, 4, 4, "div", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](49, "button", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](50, SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_50_Template, 2, 1, "ng-container", 10)(51, SwapComponent_div_0_ng_container_1_ng_container_3_ng_container_51_Template, 2, 1, "ng-container", 10)(52, SwapComponent_div_0_ng_container_1_ng_container_3_mat_spinner_52_Template, 1, 0, "mat-spinner", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](53, "input", 69)(54, "input", 70)(55, "input", 71)(56, "input", 72)(57, "input", 73)(58, "input", 74)(59, "input", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    let tmp_23_0;
    let tmp_36_0;
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"]();
    const downArrowIcon_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵreference"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("formGroup", ctx_r1.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("swap.from"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.hasSelectedSourceAsset);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", !ctx_r1.hasSelectedSourceAsset);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("disabled", !ctx_r1.hasBothAssetsSet);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("swap.to"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.hasSelectedTargetAsset);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", !ctx_r1.hasSelectedTargetAsset);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.selectedSwapNetworkId);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", !ctx_r1.selectedSwapNetworkId);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngTemplateOutlet", downArrowIcon_r12);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpureFunction1"](36, _c2, ((tmp_23_0 = ctx_r1.form.get("sourceAmount")) == null ? null : tmp_23_0.errors) && ((tmp_23_0 = ctx_r1.form.get("sourceAmount")) == null ? null : tmp_23_0.dirty)));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpureFunction1"](38, _c3, ctx_r1.swapBalanceDisplay === "fiat"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.swapBalanceDisplay === "token");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.swapBalanceDisplay === "fiat");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.swapBalanceDisplay === "token");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.swapBalanceDisplay === "fiat");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.hasSelectedSourceAsset);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵpureFunction1"](40, _c4, ctx_r1.swapBalanceDisplay === "fiat"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate1"](" ", t_r4("swap.usd_pill"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("swap.half_pill"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtextInterpolate"](t_r4("swap.max_pill"));
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.hasSelectedTargetAsset && ctx_r1.showDetails());
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.hasSelectedTargetAsset && ctx_r1.showDetails());
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", (tmp_36_0 = ctx_r1.form.get("targetAsset")) == null ? null : tmp_36_0.errors == null ? null : tmp_36_0.errors.mustNotMatch);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.form.errors == null ? null : ctx_r1.form.errors.insufficientFunds);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.form.errors == null ? null : ctx_r1.form.errors.crossNetwork);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.form.errors == null ? null : ctx_r1.form.errors.sameChainSwap);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.showDetails());
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", !ctx_r1.passwordSet);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.passwordError);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("disabled", ctx_r1.isConfirmDisabled());
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", !ctx_r1.requiresBiometrics);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.requiresBiometrics);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.sending);
  }
}
function SwapComponent_div_0_ng_container_1_swap_currency_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "swap-currency", 119);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵlistener"]("assetChange", function SwapComponent_div_0_ng_container_1_swap_currency_4_Template_swap_currency_assetChange_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r19);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.handleAssetChange($event));
    })("pickerBack", function SwapComponent_div_0_ng_container_1_swap_currency_4_Template_swap_currency_pickerBack_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r19);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.handlePickerBack());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("excludeOppositeAsset", ctx_r1.swapSource === "target" ? ctx_r1.selectedSourceAsset : ctx_r1.selectedTargetAsset)("myAssets", ctx_r1.tokens)("parentNetworkId", ctx_r1.effectiveTokenPickerNetworkId)("selectedAsset", ctx_r1.swapSource === "source" ? ctx_r1.selectedSourceAsset : ctx_r1.selectedTargetAsset)("source", ctx_r1.swapSource === "source" ? "source" : "target");
  }
}
function SwapComponent_div_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](1, SwapComponent_div_0_ng_container_1_div_1_Template, 5, 1, "div", 11)(2, SwapComponent_div_0_ng_container_1_ng_container_2_Template, 13, 9, "ng-container", 10)(3, SwapComponent_div_0_ng_container_1_ng_container_3_Template, 60, 42, "ng-container", 10)(4, SwapComponent_div_0_ng_container_1_swap_currency_4_Template, 1, 5, "swap-currency", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.swapSource !== "source" && ctx_r1.swapSource !== "target");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.swapSource === "network");
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", !ctx_r1.swapSource);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.swapSource === "source" || ctx_r1.swapSource === "target");
  }
}
function SwapComponent_div_0_zelf_loader_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](0, "zelf-loader");
  }
}
function SwapComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](1, SwapComponent_div_0_ng_container_1_Template, 5, 4, "ng-container", 10)(2, SwapComponent_div_0_zelf_loader_2_Template, 1, 0, "zelf-loader", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", !ctx_r1.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngIf", ctx_r1.loading || ctx_r1.quoteLoading);
  }
}
function SwapComponent_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "svg", 120);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](1, "path", 121);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
}
function SwapComponent_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "svg", 122);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](1, "path", 123);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
}
function SwapComponent_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "svg", 124);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](1, "path", 125)(2, "path", 126);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
}
function SwapComponent_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "svg", 127);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](1, "path", 128);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
}
function SwapComponent_ng_template_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "svg", 127);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](1, "path", 129);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
}
function SwapComponent_ng_template_11_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementContainer"](0);
  }
}
function SwapComponent_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "button", 130);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵlistener"]("click", function SwapComponent_ng_template_11_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵrestoreView"](_r20);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵresetView"](ctx_r1.toggleShowPassword());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](1, SwapComponent_ng_template_11_ng_container_1_Template, 1, 0, "ng-container", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵnextContext"]();
    const openEye_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵreference"](8);
    const closedEye_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵreference"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵproperty"]("ngTemplateOutlet", ctx_r1.showPassword ? openEye_r21 : closedEye_r22);
  }
}
function SwapComponent_ng_template_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_26__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementStart"](0, "svg", 122);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelement"](1, "path", 131);
    _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵelementEnd"]();
  }
}
class SwapComponent {
  _assetService;
  _blockchainTransactionsService;
  _bottomSheet;
  _changeDetectionRef;
  _chromeService;
  _formBuilder;
  _lifiService;
  _networkService;
  _router;
  _snackBar;
  _transactionService;
  _translocoService;
  _vaultService;
  _walletService;
  _tagsService;
  _settingsService;
  _feeUpdateInterval = null;
  _mnemonics = "";
  _password = "";
  _requiresBiometricsInterval = null;
  CAN_SWAP = {};
  unsubscriber$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__.Subject();
  formUnsubscriber$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__.Subject();
  form;
  loading = true;
  network = "ethereum";
  networkImage = "";
  networkSymbol = "";
  passwordError = false;
  passwordSet = false;
  quoteLoading = false;
  remainingAttempts = 0;
  requiresBiometrics = false;
  sending = false;
  showPassword = false;
  slippage = 0.5;
  swapBalanceDisplay = "token";
  swapData = new _shared_types_wallet_types__WEBPACK_IMPORTED_MODULE_19__.SwapData({});
  swapError = "";
  swapQuote = null;
  swapSource = "";
  swapMode = "swaps";
  networkPickerSearch = "";
  selectedSwapNetworkId = null;
  tokens = [];
  transactionHash = "";
  wallet;
  swapExecuting = false;
  swapExecuted = false;
  swapLoading = false;
  /** When true, returning from e.g. transaction receipt may refresh balances / clear stale quote. */
  _swapNavRefreshReady = false;
  bridgeOptions = [{
    label: "Li.Fi",
    value: "li.fi"
  }];
  selectedSourceAsset = {};
  selectedTargetAsset = {};
  constructor(_assetService, _blockchainTransactionsService, _bottomSheet, _changeDetectionRef, _chromeService, _formBuilder, _lifiService, _networkService, _router, _snackBar, _transactionService, _translocoService, _vaultService, _walletService, _tagsService, _settingsService) {
    this._assetService = _assetService;
    this._blockchainTransactionsService = _blockchainTransactionsService;
    this._bottomSheet = _bottomSheet;
    this._changeDetectionRef = _changeDetectionRef;
    this._chromeService = _chromeService;
    this._formBuilder = _formBuilder;
    this._lifiService = _lifiService;
    this._networkService = _networkService;
    this._router = _router;
    this._snackBar = _snackBar;
    this._transactionService = _transactionService;
    this._translocoService = _translocoService;
    this._vaultService = _vaultService;
    this._walletService = _walletService;
    this._tagsService = _tagsService;
    this._settingsService = _settingsService;
    this.CAN_SWAP = this._assetService.canSwap;
    this.wallet = {};
    this.remainingAttempts = this._vaultService.remainingAttempts;
    this._mnemonics = "";
    this._password = this._vaultService.password;
    this._vaultService.mnemonic = "";
    this._vaultService.password = "";
    if (this._password && this._password.trim()) {
      this.passwordSet = true;
      this.requiresBiometrics = false;
    }
    this._setRequiresBiometricsInterval();
  }
  ngOnInit() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this._router.events.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.filter)(e => e instanceof _angular_router__WEBPACK_IMPORTED_MODULE_17__.NavigationEnd), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.startWith)(null), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.pairwise)(), (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(_this.unsubscriber$)).subscribe(([prev, curr]) => {
        void _this._onNavigationMayRequireSwapRefresh(prev, curr);
      });
      _this.wallet = yield _this._walletService.getCurrentWallet();
      _this._initForm();
      yield _this._loadTokensFromSession();
      yield _this._decryptMnemonics();
      yield _this._findPreviousSwapData();
      if (_this.swapData && _this.swapData.hasSwapData) {
        _this._swapNavRefreshReady = true;
        return;
      }
      _this.loading = false;
      _this._swapNavRefreshReady = true;
    })();
  }
  ngOnDestroy() {
    this._clearFeeUpdateInterval();
    this._clearRequiresBiometricsInterval();
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
    this.formUnsubscriber$.next();
    this.formUnsubscriber$.complete();
  }
  get canCheckQuote() {
    return !this.loading && !this.quoteLoading && !this.sending && this.hasBothAssetsSet && !!this.form.get("sourceAmount")?.valid && !!this.form.get("targetAsset")?.valid && !this.form.errors?.crossNetwork && !this.form.errors?.sameChainSwap;
  }
  get hasBothAssetsSet() {
    return !!this.hasSelectedSourceAsset && !!this.hasSelectedTargetAsset;
  }
  get hasSelectedSourceAsset() {
    return !!Object.keys(this.selectedSourceAsset).length;
  }
  get hasSelectedTargetAsset() {
    return !!Object.keys(this.selectedTargetAsset).length;
  }
  /**
   * Locks LiFi token fetch to one chain when the user explicitly picks NET.
   * Until then, `null` lists all swappable chains in the picker (inline filters + wallet-only tokens).
   * Cross-chain mode uses only `selectedSwapNetworkId` the same way.
   */
  get effectiveTokenPickerNetworkId() {
    if (this.swapMode !== "swaps") {
      return this.selectedSwapNetworkId;
    }
    return this.selectedSwapNetworkId ? this.selectedSwapNetworkId.toLowerCase() : null;
  }
  get targetTokenPricePerDollar() {
    return 1 / (this.selectedTargetAsset?.price || 1);
  }
  get totalTargetFiat() {
    return (this.form?.get("targetAmount")?.value || 0) * (this.selectedTargetAsset?.price || 0);
  }
  get totalTargetToken() {
    return (this.form?.get("targetFiat")?.value || 0) / (this.selectedTargetAsset?.price || 0);
  }
  get totalSourceFiat() {
    return (this.form?.get("sourceAmount")?.value || 0) * (this.selectedSourceAsset?.price || 0);
  }
  get totalSourceToken() {
    return (this.form?.get("sourceFiat")?.value || 0) / (this.selectedSourceAsset?.price || 0);
  }
  get heroSecondaryUsd() {
    return this.totalSourceFiat;
  }
  get heroSecondaryTokenAmount() {
    return this.totalSourceToken;
  }
  get sourceFiatInputMax() {
    const amt = parseFloat(String(this.selectedSourceAsset.amount ?? 0)) || 0;
    const price = Number(this.selectedSourceAsset.price) || 0;
    const v = amt * price;
    return v > 0 ? v : null;
  }
  get filteredNetworkPickerRows() {
    const q = this.networkPickerSearch.trim().toLowerCase();
    return this.swapNetworkPickerRows.filter(row => !q || row.id.includes(q) || row.displayName.toLowerCase().includes(q));
  }
  get swapNetworkPickerRows() {
    const enabledIds = this._getEnabledNetworkIds();
    const rows = new Map();
    for (const sym of Object.keys(this.CAN_SWAP)) {
      if (!this.CAN_SWAP[sym]) continue;
      const name = this._networkService.getNetworkName(sym);
      const id = String(name).toLowerCase();
      if (!id) continue;
      if (enabledIds && !enabledIds.includes(id)) continue;
      rows.set(id, {
        id,
        displayName: id.charAt(0).toUpperCase() + id.slice(1),
        usdTotal: 0,
        icons: [],
        extraTokenCount: 0
      });
    }
    const iconBuckets = new Map();
    for (const t of this.tokens) {
      const id = (t.network || "").toLowerCase();
      if (!id || !rows.has(id)) continue;
      const row = rows.get(id);
      const fiat = parseFloat(String(t.fiatBalance ?? 0)) || 0;
      const amt = parseFloat(String(t.amount ?? 0)) || 0;
      const price = t.price || 0;
      row.usdTotal += fiat > 0 ? fiat : amt * price;
      const icon = t.image || this._walletService.getAssetImage(t.symbol, t.image);
      if (icon) {
        if (!iconBuckets.has(id)) iconBuckets.set(id, []);
        const list = iconBuckets.get(id);
        if (!list.includes(icon)) list.push(icon);
      }
    }
    rows.forEach((row, id) => {
      const list = iconBuckets.get(id) || [];
      row.icons = list.slice(0, 3);
      row.extraTokenCount = Math.max(0, list.length - 3);
    });
    return Array.from(rows.values()).sort((a, b) => b.usdTotal - a.usdTotal);
  }
  get selectedNetworkButtonLabel() {
    if (!this.selectedSwapNetworkId) return this._translocoService.translate("swap.all_networks");
    const row = this.swapNetworkPickerRows.find(r => r.id === this.selectedSwapNetworkId);
    return row?.displayName || this.selectedSwapNetworkId;
  }
  _getEnabledNetworkIds() {
    return this._settingsService.getEnabledNetworkIds();
  }
  _sameChainSwapValidator = () => {
    return control => {
      if (this.swapMode !== "swaps") return null;
      const sourceAsset = control.get("sourceAsset")?.value;
      const targetAsset = control.get("targetAsset")?.value;
      if (!sourceAsset?.network || !targetAsset?.network) return null;
      if (sourceAsset.network.toLowerCase() !== targetAsset.network.toLowerCase()) return {
        sameChainSwap: true
      };
      return null;
    };
  };
  _clearFeeUpdateInterval() {
    if (!this._feeUpdateInterval) return;
    clearInterval(this._feeUpdateInterval);
    this._feeUpdateInterval = null;
  }
  _clearRequiresBiometricsInterval() {
    if (!this._requiresBiometricsInterval) return;
    clearInterval(this._requiresBiometricsInterval);
  }
  _decryptMnemonics() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this2.requiresBiometrics = yield _this2._vaultService.biometricsRequired();
      if (!_this2.wallet?.pgp?.encryptedMessage || !_this2.wallet?.pgp?.privateKey || _this2.requiresBiometrics) {
        _this2.requiresBiometrics = true;
        return;
      }
      if (!_this2._password && !_this2.form.get("password")?.value) return;
      const secret = JSON.parse(yield _this2._decryptMessage());
      _this2._mnemonics = secret?.mnemonic?.trim()?.toLowerCase();
      _this2.requiresBiometrics = !_this2._mnemonics;
    })();
  }
  _decryptMessage() {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const encryptedMessage = _this3.wallet?.pgp?.encryptedMessage;
      const privateKeyArmoured = _this3.wallet?.pgp?.privateKey;
      const passphrase = _this3._password || _this3.form.get("password")?.value;
      if (!encryptedMessage || !privateKeyArmoured || !passphrase) return;
      try {
        return yield _this3._vaultService.decryptMessage(encryptedMessage, privateKeyArmoured, passphrase);
      } catch (error) {
        _this3.wallet = yield _this3._walletService.getCurrentWallet();
        _this3.remainingAttempts = _this3._vaultService.remainingAttempts + 1;
        if (!_this3.wallet?.pgp) {
          _this3._mnemonics = "";
          _this3._password = "";
          _this3.passwordError = false;
          _this3.passwordSet = false;
          _this3.requiresBiometrics = true;
        } else {
          _this3.passwordError = true;
        }
        throw error;
      }
    })();
  }
  _fetchTokens() {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this4.wallet) return;
      const response = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.firstValueFrom)(_this4._blockchainTransactionsService.getAddressData(_this4.wallet));
      const result = yield _this4._assetService.processTokensFromResponse(response, _this4.CAN_SWAP);
      _this4.tokens = result.tokens;
    })();
  }
  _findPreviousSwapData() {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this5.swapData = yield _this5._transactionService.getCurrentSwapData();
      if (_this5.swapData && _this5.swapData.hasSwapData) {
        _this5._initSwapData().finally(() => _this5.loading = false);
        return;
      }
    })();
  }
  _greaterThanZero(control) {
    if (control.value && control.value > 0) return null;
    return {
      greaterThanZero: true
    };
  }
  _toTokenDecimalsFromQuote(quote, fallback) {
    const d = quote?.action?.toToken?.decimals;
    if (typeof d === "number" && Number.isFinite(d) && d >= 0 && d <= 78) {
      return Math.floor(d);
    }
    return fallback;
  }
  _getAddressForNetwork(network) {
    if (!this.wallet) return "";
    switch (network.toLowerCase()) {
      case "ethereum":
        return this.wallet.publicData?.ethAddress;
      case "solana":
        return this.wallet.publicData?.solanaAddress;
      case "avalanche":
        return this.wallet.publicData?.ethAddress;
      case "binance":
        return this.wallet.publicData?.ethAddress;
      case "polygon":
        return this.wallet.publicData?.ethAddress;
      default:
        return this.wallet.publicData?.ethAddress;
    }
  }
  _getFeeFromQuote(quote) {
    let fee = 0;
    if (!quote.estimate) return fee;
    quote.estimate.gasCosts?.forEach(gasCost => {
      if (!gasCost.amountUSD) return;
      fee += parseFloat(gasCost.amountUSD);
    });
    quote.estimate.feeCosts?.forEach(feeCost => {
      if (!feeCost.amountUSD) return;
      fee += parseFloat(feeCost.amountUSD);
    });
    quote.estimate.bridgeCosts?.forEach(bridgeCost => {
      if (!bridgeCost.amountUSD) return;
      fee += parseFloat(bridgeCost.amountUSD);
    });
    quote.estimate.executionCosts?.forEach(executionCost => {
      if (!executionCost.amountUSD) return;
      fee += parseFloat(executionCost.amountUSD);
    });
    quote.includedSteps?.forEach(step => {
      if (!step.estimate || !step.estimate.feeCosts) return;
      step.estimate.feeCosts.forEach(feeCost => {
        if (!feeCost.amountUSD) return;
        fee += parseFloat(feeCost.amountUSD);
      });
    });
    return fee;
  }
  _onNavigationMayRequireSwapRefresh(prev, curr) {
    var _this6 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this6._swapNavRefreshReady || !_this6.form || !curr) return;
      const curPath = curr.urlAfterRedirects.split("?")[0].replace(/\/$/, "");
      if (!curPath.endsWith("/swap")) return;
      if (!prev) return;
      const prevPath = prev.urlAfterRedirects.split("?")[0].replace(/\/$/, "");
      if (!prevPath.includes("/transaction/")) return;
      yield _this6._refreshSwapStateAfterCompletedFlow();
    })();
  }
  /**
   * Fresh balances from API, drop stale LiFi quote/amounts, re-attach selected tokens from updated `tokens`.
   */
  _refreshSwapStateAfterCompletedFlow() {
    var _this7 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this7._clearFeeUpdateInterval();
      _this7.swapQuote = null;
      _this7.swapError = "";
      try {
        yield _this7._fetchTokens();
        yield _this7._assetService.saveTokensToSession(_this7.tokens);
        _this7._rebindPickersToFreshTokens();
        const pwd = _this7.form.get("password")?.value ?? "";
        _this7.form.patchValue({
          fee: 0,
          password: pwd,
          sourceAmount: "",
          sourceFiat: 0,
          targetAmount: "0",
          targetFiat: 0,
          targetSwapValue: "0"
        }, {
          emitEvent: false
        });
        _this7.form.updateValueAndValidity({
          emitEvent: true
        });
      } catch (error) {
        console.error("Swap refresh after transaction failed:", error);
      }
      _this7._changeDetectionRef.markForCheck();
    })();
  }
  _rebindPickersToFreshTokens() {
    const normNet = n => (n || "").toLowerCase();
    const bind = partial => {
      if (!partial?.symbol || !partial?.network) return null;
      const hit = this.tokens.find(t => t.symbol === partial.symbol && normNet(t.network) === normNet(partial.network));
      return hit || null;
    };
    const src = bind(this.selectedSourceAsset);
    const tgt = bind(this.selectedTargetAsset);
    if (src) {
      this.selectedSourceAsset = src;
      this.form.patchValue({
        sourceAsset: src
      }, {
        emitEvent: false
      });
    } else {
      this.selectedSourceAsset = {};
      this.form.patchValue({
        sourceAsset: null
      }, {
        emitEvent: false
      });
    }
    if (tgt) {
      this.selectedTargetAsset = tgt;
      this.form.patchValue({
        targetAsset: tgt
      }, {
        emitEvent: false
      });
    } else {
      this.selectedTargetAsset = {};
      this.form.patchValue({
        targetAsset: null
      }, {
        emitEvent: false
      });
    }
  }
  _handleSuccessfulSwap(receipt) {
    var _this8 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this8.sending = false;
      _this8.swapError = "";
      if (!_this8.transactionHash) return;
      const raw = _this8.form.getRawValue();
      const srcSym = String(_this8.selectedSourceAsset.symbol ?? "").trim() || String(_this8.selectedSourceAsset.name ?? "").trim() || "Asset";
      const tgtSym = String(_this8.selectedTargetAsset.symbol ?? "").trim() || String(_this8.selectedTargetAsset.name ?? "").trim() || "Asset";
      const pendingTransactionData = {
        ...receipt,
        transactionHash: _this8.transactionHash,
        amount: raw.sourceAmount ?? _this8.form.get("sourceAmount")?.value,
        asset: srcSym,
        date: new Date().toISOString(),
        fee: raw.fee ?? _this8.form.get("fee")?.value,
        from: _this8.wallet?.publicData?.ethAddress,
        image: _this8.selectedSourceAsset.image,
        network: _this8.selectedSourceAsset.network,
        status: "pending",
        targetAddress: _this8.selectedTargetAsset.contractAddress ?? "",
        targetAmount: raw.targetAmount ?? _this8.form.get("targetAmount")?.value,
        targetImage: _this8.selectedTargetAsset.image,
        targetNetwork: _this8.selectedTargetAsset.network ?? _this8.selectedSourceAsset.network,
        targetSymbol: tgtSym,
        to: _this8.selectedTargetAsset.contractAddress,
        tokenType: srcSym,
        total: (raw.sourceAmount ?? _this8.form.get("sourceAmount")?.value) + (raw.fee ?? _this8.form.get("fee")?.value),
        type: "swap",
        swapIntentFromSymbol: srcSym,
        swapIntentToSymbol: tgtSym
      };
      yield _this8._walletService.addTransactionToPending(pendingTransactionData);
      yield _this8._chromeService.removeItemSession("tokens");
      yield _this8._chromeService.removeItemSession("tokensTtl");
      yield _this8._transactionService.clearPersistedSwapData();
      yield _this8._router.navigate(["/transaction", _this8.transactionHash], {
        queryParams: {
          network: _this8.selectedSourceAsset.network,
          symbol: _this8.selectedSourceAsset.symbol
        }
      });
    })();
  }
  _initForm() {
    this.form = this._formBuilder.group({
      bridge: ["li.fi", [_angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.required]],
      commission: [0, [_angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.min(0)]],
      commissionToggle: ["automatic", [_angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.required]],
      fee: [0, [_angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.min(0)]],
      password: [this._password || "", [_angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.required]],
      slippage: [0.5, [_angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.min(0), _angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.max(0.8)]],
      slippageToggle: ["automatic", [_angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.required]],
      sourceAmount: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.required, this._greaterThanZero]],
      sourceAsset: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.required]],
      sourceFiat: [0, [_angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.required, this._greaterThanZero]],
      targetAmount: [{
        value: "",
        disabled: true
      }, [_angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.min(0)]],
      targetAsset: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.required, this._notMatchingValidator("sourceAsset")]],
      targetFiat: [{
        value: 0,
        disabled: true
      }, [_angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.Validators.min(0)]],
      targetSwapValue: [""]
    }, {
      validators: [this._insufficientFundsValidator(), this._crossNetworkValidator(), this._sameChainSwapValidator()]
    });
    this._setupQuoteUpdates();
  }
  _crossNetworkValidator() {
    return control => {
      if (this.swapMode === "cross_chain") return null;
      const sourceAsset = control.get("sourceAsset");
      const targetAsset = control.get("targetAsset");
      if (!sourceAsset?.value || !targetAsset?.value) return null;
      const hasSolAsset = [sourceAsset.value.network.toLowerCase(), targetAsset.value.network.toLowerCase()].indexOf("solana") > -1;
      if (hasSolAsset && sourceAsset.value.network !== targetAsset.value.network) return {
        crossNetwork: true
      };
      return null;
    };
  }
  _initSwapData() {
    var _this9 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this9.swapMode = _this9.swapData.swapFlowMode === "cross_chain" ? "cross_chain" : "swaps";
      _this9.selectedSwapNetworkId = _this9.swapData.selectedSwapNetworkId ?? null;
      _this9.form.patchValue(_this9.swapData);
      const src = _this9.form.get("sourceAsset")?.value;
      const tgt = _this9.form.get("targetAsset")?.value;
      if (src) _this9.selectedSourceAsset = src;
      if (tgt) _this9.selectedTargetAsset = tgt;
      _this9.form.updateValueAndValidity({
        emitEvent: true
      });
      _this9._changeDetectionRef.markForCheck();
    })();
  }
  _insufficientFundsValidator() {
    return control => {
      if (!control.value) return null;
      if (!this.swapQuote) return null;
      const sourceAmount = control.get("sourceAmount")?.value;
      const sourceAsset = control.get("sourceAsset")?.value;
      if (!sourceAmount || !sourceAsset) return null;
      const sourceBalance = sourceAsset?.amount;
      if (!sourceBalance) return null;
      return sourceBalance < sourceAmount ? {
        insufficientFunds: true
      } : null;
    };
  }
  _loadTokensFromSession() {
    var _this0 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const sessionTokens = yield _this0._assetService.loadTokensFromSession();
        if (sessionTokens.length > 0) {
          _this0.tokens = sessionTokens;
        } else {
          yield _this0._fetchTokens();
        }
        _this0._changeDetectionRef.detectChanges();
      } catch (error) {
        console.error("Error loading tokens:", error);
      } finally {
        _this0._initForm();
        _this0.loading = false;
      }
    })();
  }
  _notMatchingValidator(matchTo) {
    return control => {
      if (!control.value) return null;
      const targetAsset = control.value;
      const sourceAsset = control.parent?.get(matchTo)?.value;
      const targetKey = `${targetAsset?.symbol}-${targetAsset?.network}`;
      const sourceKey = `${sourceAsset?.symbol}-${sourceAsset?.network}`;
      return targetKey === sourceKey ? {
        mustNotMatch: true
      } : null;
    };
  }
  _redirectToBiometrics() {
    var _this1 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this1._tagsService.setFlow("unlock");
      yield _this1._tagsService.setTagName(_this1.wallet?.tagName);
      const {
        password: _password,
        ...rest
      } = _this1.form.value;
      _this1._transactionService.swapData = new _shared_types_wallet_types__WEBPACK_IMPORTED_MODULE_19__.SwapData({
        ...rest,
        swapFlowMode: _this1.swapMode,
        selectedSwapNetworkId: _this1.selectedSwapNetworkId
      });
      _this1._vaultService.password = _this1.form.get("password")?.value;
      _this1._router.navigate(["/security/biometrics"], {
        queryParams: {
          return: "/swap"
        }
      });
    })();
  }
  _setFeeUpdateInterval() {
    if (!environments_environment__WEBPACK_IMPORTED_MODULE_23__.environment.production) return;
    if (this._feeUpdateInterval) this._clearFeeUpdateInterval();
    this._feeUpdateInterval = setInterval(() => {
      if (!this.canCheckQuote) return this._clearFeeUpdateInterval();
      this.getSwapQuote(true);
    }, 1000 * 15);
  }
  _setRequiresBiometricsInterval() {
    if (this._requiresBiometricsInterval) this._clearRequiresBiometricsInterval();
    this._requiresBiometricsInterval = setInterval(() => {
      this._vaultService.biometricsRequired().then(result => {
        if (!this.wallet?.pgp) this.requiresBiometrics = true;else this.requiresBiometrics = result;
      });
    }, 1000);
  }
  _setupQuoteUpdates() {
    var _this10 = this;
    const sourceFiatChanges = this.form.get("sourceFiat")?.valueChanges.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.formUnsubscriber$), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.filter)(value => value !== null && value !== ""));
    sourceFiatChanges?.subscribe(() => {
      if (this.swapBalanceDisplay === "token") return;
      this.form.get("sourceAmount")?.setValue(this.totalSourceToken);
      this.form.get("sourceAmount")?.markAsDirty();
      this.form.get("sourceAmount")?.markAsTouched();
      this.form.get("sourceAmount")?.updateValueAndValidity();
    });
    const sourceAmountChanges = this.form.get("sourceAmount")?.valueChanges.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.formUnsubscriber$), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.filter)(value => value !== null && value !== ""), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_11__.tap)(() => {
      if (this.swapBalanceDisplay === "fiat") return;
      this.form.get("sourceFiat")?.setValue(this.totalSourceFiat || 0);
      this.form.get("sourceFiat")?.markAsDirty();
      this.form.get("sourceFiat")?.markAsTouched();
      this.form.get("sourceFiat")?.updateValueAndValidity();
    }));
    const slippageChanges = this.form.get("slippage")?.valueChanges.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.formUnsubscriber$));
    const sourceAssetChanges = this.form.get("sourceAsset")?.valueChanges.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.formUnsubscriber$), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.filter)(value => !!value), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_11__.tap)(value => this.selectedSourceAsset = value));
    const targetAssetChanges = this.form.get("targetAsset")?.valueChanges.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.formUnsubscriber$), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.filter)(value => !!value), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_11__.tap)(value => this.selectedTargetAsset = value));
    const REQUIRED_QUOTE_FIELDS = ["sourceAmount", "sourceAsset", "targetAsset", "slippage"];
    (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.merge)(sourceAmountChanges, slippageChanges, sourceAssetChanges, targetAssetChanges).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(this.formUnsubscriber$), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.debounceTime)(300)).subscribe(/*#__PURE__*/(0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this10.quoteLoading) return;
      if (REQUIRED_QUOTE_FIELDS.some(field => _this10.form.get(field)?.invalid)) return;
      try {
        yield _this10.getSwapQuote();
      } catch (error) {
        console.error("Error getting swap quote:", error);
      } finally {
        _this10.quoteLoading = false;
      }
    }));
  }
  _validateCredentials() {
    var _this11 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this11._password && !_this11.form.get("password")?.value) {
        _this11.openErrorSnackBar("errors.empty_password");
        return false;
      }
      if (_this11.requiresBiometrics) {
        yield _this11._redirectToBiometrics();
        return false;
      }
      if (_this11._mnemonics) return true;
      try {
        yield _this11._decryptMnemonics();
        if (_this11._mnemonics) return true;
      } catch (error) {
        if (error?.message === "expired") {
          yield _this11._redirectToBiometrics();
          return false;
        }
        _this11.openErrorSnackBar("errors.invalid_credentials");
        return false;
      }
      if (_this11.requiresBiometrics) return false;
      if (_this11._mnemonics) return true;
      _this11.openErrorSnackBar("errors.private_key_locked");
      return false;
    })();
  }
  confirmSwap() {
    var _this12 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this12.isConfirmDisabled()) return;
      _this12.sending = true;
      _this12.swapError = "";
      try {
        if (!(yield _this12._validateCredentials())) return;
        if (!ethers__WEBPACK_IMPORTED_MODULE_1__.Mnemonic.isValidMnemonic(_this12._mnemonics)) {
          throw new Error("Invalid mnemonic");
        }
        const ethWallet = ethers__WEBPACK_IMPORTED_MODULE_2__.Wallet.fromPhrase(_this12._mnemonics);
        const sourceNetwork = _this12.selectedSourceAsset.network?.toLowerCase();
        const EVM_NETWORKS = ["ethereum", "avalanche", "binance", "polygon"];
        if (sourceNetwork && EVM_NETWORKS.includes(sourceNetwork)) {
          const receipt = yield _this12._lifiService.executeEvmLiFiSwap(_this12.swapQuote, {
            privateKey: ethWallet.privateKey,
            address: ethWallet.address
          });
          if (!receipt?.transactionHash) return;
          _this12.transactionHash = receipt.transactionHash;
          yield _this12._handleSuccessfulSwap(receipt);
        } else if (sourceNetwork === "solana") {
          const receipt = yield _this12._lifiService.executeSolanaSwap(_this12.swapQuote, _this12.wallet, _this12._mnemonics);
          if (!receipt?.transactionHash) return;
          _this12.transactionHash = receipt.transactionHash;
          yield _this12._handleSuccessfulSwap(receipt);
        } else {
          throw new Error(`Unsupported network: ${sourceNetwork}`);
        }
      } catch (error) {
        console.error("Swap execution error:", error);
        const messageKey = (0,app_core_utils_user_facing_transaction_error_util__WEBPACK_IMPORTED_MODULE_20__.mapTransactionErrorToTranslationKey)(error);
        _this12.swapError = _this12._translocoService.translate(messageKey);
        _this12.openErrorSnackBar(messageKey);
      } finally {
        _this12.sending = false;
        _this12._changeDetectionRef.detectChanges();
      }
    })();
  }
  findToken(symbol) {
    return this.tokens.find(token => token.symbol === symbol);
  }
  getBridgeLabel() {
    return this.bridgeOptions.find(option => option.value === this.form.get("bridge")?.value)?.label || "";
  }
  getNetworkImage(network) {
    if (!network) return "";
    return this._walletService.getAssetImage(this._networkService.getNetworkSymbol(network.toLowerCase()));
  }
  getNetworkSymbol(network) {
    if (!network) return "";
    return this._networkService.getNetworkSymbol(network.toLowerCase());
  }
  getSwapQuote() {
    var _this13 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (silentLoading = false) {
      if (!_this13.canCheckQuote) {
        _this13._clearFeeUpdateInterval();
        return;
      }
      const sourceNetwork = _this13.selectedSourceAsset.network?.toLowerCase() || "";
      const targetNetwork = _this13.selectedTargetAsset.network?.toLowerCase() || "";
      const fromToken = _this13._lifiService.getTokenAddress(sourceNetwork, _this13.selectedSourceAsset.symbol || "", _this13.selectedSourceAsset.contractAddress || "");
      const toToken = _this13._lifiService.getTokenAddress(targetNetwork, _this13.selectedTargetAsset.symbol || "", _this13.selectedTargetAsset.contractAddress || "");
      if (!String(fromToken).trim() || !String(toToken).trim()) {
        _this13.openErrorSnackBar("errors.missing_contract_address");
        _this13._clearFeeUpdateInterval();
        return;
      }
      const sourceAmount = _this13.form.get("sourceAmount")?.value;
      const isSameAsset = sourceNetwork === targetNetwork && fromToken.toLowerCase() === toToken.toLowerCase();
      if (!+sourceAmount || isSameAsset) {
        _this13.form.patchValue({
          targetAmount: "0",
          fee: 0,
          targetSwapValue: "0"
        }, {
          emitEvent: false
        });
        _this13._clearFeeUpdateInterval();
        return;
      }
      _this13._clearFeeUpdateInterval();
      _this13.quoteLoading = !silentLoading;
      try {
        const fromChain = _this13._lifiService.getChainIdentifier(sourceNetwork);
        const toChain = _this13._lifiService.getChainIdentifier(targetNetwork);
        const sourceAmountStr = sourceAmount.toString();
        const fromAmount = _this13._lifiService.formatAmount(sourceAmountStr, _this13.selectedSourceAsset.decimals);
        const fromAddress = _this13._getAddressForNetwork(sourceNetwork);
        const toAddress = _this13._getAddressForNetwork(targetNetwork);
        if (targetNetwork === "solana" && !String(toAddress || "").trim()) {
          _this13.openErrorSnackBar("errors.missing_solana_recipient");
          _this13.form.patchValue({
            targetAmount: "0",
            fee: 0,
            targetSwapValue: "0"
          }, {
            emitEvent: false
          });
          return;
        }
        const slippage = _this13.form.get("slippage")?.value || 0.5;
        const slippageStr = slippage.toString();
        const quote = yield _this13._lifiService.getQuote(fromChain, fromToken, toChain, toToken, fromAmount, fromAddress, slippageStr, toAddress || undefined);
        const fallbackDecimals = targetNetwork === "solana" ? _this13.selectedTargetAsset.decimals ?? 9 : _this13.selectedTargetAsset.decimals ?? 18;
        const toTokenDecimals = _this13._toTokenDecimalsFromQuote(quote, fallbackDecimals);
        if (sourceNetwork === "solana" || targetNetwork === "solana") {
          if (!quote || !quote.estimate || !quote.estimate.toAmount) {
            throw new Error("No hay rutas disponibles para este swap en Solana");
          }
          _this13.swapQuote = quote;
          const estimatedAmount = parseFloat(quote.estimate.toAmount) / Math.pow(10, toTokenDecimals);
          const sourceTokenAmount = parseFloat(sourceAmount);
          const targetSwapValue = estimatedAmount / sourceTokenAmount;
          let fee = 0;
          if (quote.estimate.gasCosts) {
            quote.estimate.gasCosts.forEach(gasCost => {
              if (gasCost.amountUSD) {
                fee += parseFloat(gasCost.amountUSD);
              }
            });
          }
          _this13.form.patchValue({
            fee,
            targetSwapValue: targetSwapValue.toString(),
            targetAmount: estimatedAmount.toString(),
            targetFiat: quote.estimate.toAmountUSD
          }, {
            emitEvent: false
          });
          _this13._setFeeUpdateInterval();
        } else {
          if (!quote || !quote?.estimate) throw new Error("Quote error");
          _this13.swapQuote = quote;
          const estimatedAmount = parseFloat(quote.estimate.toAmount) / Math.pow(10, toTokenDecimals);
          const sourceTokenAmount = parseFloat(sourceAmount);
          const targetSwapValue = estimatedAmount / sourceTokenAmount;
          let fee = _this13._getFeeFromQuote(quote);
          _this13.form.patchValue({
            fee,
            targetSwapValue: targetSwapValue.toString(),
            targetAmount: estimatedAmount.toString(),
            targetFiat: quote.estimate.toAmountUSD
          }, {
            emitEvent: false
          });
        }
      } catch (error) {
        console.error("Quote error:", error);
        _this13.openErrorSnackBar((0,app_core_utils_user_facing_transaction_error_util__WEBPACK_IMPORTED_MODULE_20__.mapTransactionErrorToTranslationKey)(error));
        _this13.form.patchValue({
          targetAmount: "0",
          fee: 0,
          targetSwapValue: "0"
        }, {
          emitEvent: false
        });
        _this13._clearFeeUpdateInterval();
      } finally {
        _this13.quoteLoading = false;
        _this13._changeDetectionRef.detectChanges();
      }
    }).apply(this, arguments);
  }
  handleAssetChange(event) {
    if (event.source === "source") {
      this.form.patchValue({
        sourceAsset: event.asset
      });
    } else {
      this.form.patchValue({
        targetAsset: event.asset
      });
    }
    this.form.markAsDirty();
    this.form.markAsTouched();
    this.swapSource = "";
  }
  handlePickerBack() {
    this.swapSource = "";
  }
  handleSwapNavBack() {
    if (this.swapSource) {
      this.swapSource = "";
      return;
    }
    this._router.navigate(["/wallet"]);
  }
  setSwapMode(mode) {
    this.swapMode = mode;
    this.form?.updateValueAndValidity({
      emitEvent: true
    });
    this._changeDetectionRef.markForCheck();
  }
  openNetworkPicker() {
    this.networkPickerSearch = "";
    this.swapSource = "network";
  }
  selectSwapNetworkRow(row) {
    this.selectedSwapNetworkId = row.id;
    this.swapSource = "";
    const norm = n => (n || "").toLowerCase();
    if (this.selectedSourceAsset.network && norm(this.selectedSourceAsset.network) !== row.id) {
      this.form.patchValue({
        sourceAsset: null,
        sourceAmount: "",
        sourceFiat: 0
      });
      this.selectedSourceAsset = {};
      this.swapQuote = null;
    }
    if (this.selectedTargetAsset.network && norm(this.selectedTargetAsset.network) !== row.id) {
      this.form.patchValue({
        targetAsset: null,
        targetAmount: "0",
        targetFiat: 0,
        targetSwapValue: "0"
      });
      this.selectedTargetAsset = {};
      this.swapQuote = null;
    }
    this.form.updateValueAndValidity();
    this._changeDetectionRef.markForCheck();
  }
  clearSelectedSwapNetwork() {
    this.selectedSwapNetworkId = null;
    this._changeDetectionRef.markForCheck();
  }
  selectAllSwapNetworks() {
    this.clearSelectedSwapNetwork();
    this.swapSource = "";
  }
  handleBalanceDisplayChange() {
    this.swapBalanceDisplay = this.swapBalanceDisplay === "token" ? "fiat" : "token";
  }
  isConfirmDisabled() {
    const hasValidAmount = !!this.form.get("sourceAmount")?.value && parseFloat(this.form.get("sourceAmount")?.value) > 0;
    const hasValidBalance = !this.form.errors?.insufficientFunds;
    const hasValidNetworks = !this.form.errors?.crossNetwork && !this.form.errors?.sameChainSwap;
    const hasValidQuote = !!this.swapQuote;
    const hasAssets = this.hasBothAssetsSet;
    const isNotLoadingOrSending = !this.sending && !this.loading && !this.quoteLoading;
    return !(hasValidAmount && hasValidQuote && isNotLoadingOrSending && hasAssets && hasValidBalance && hasValidNetworks);
  }
  openErrorSnackBar(message) {
    this._snackBar.open(this._translocoService.translate(message), this._translocoService.translate("common.close"), {
      duration: 5000,
      panelClass: "zelf-snackbar",
      verticalPosition: "top"
    });
  }
  openSlippageSheet() {
    this._bottomSheet.open(app_slippage_sheet_slippage_sheet_component__WEBPACK_IMPORTED_MODULE_21__.SlippageSheetComponent, {
      backdropClass: "zelf-backdrop",
      panelClass: "zelf-bottom-sheet",
      data: {
        commission: this.form.get("commission")?.value,
        commissionToggle: this.form.get("commissionToggle")?.value,
        network: this.network,
        slippage: this.form.get("slippage")?.value,
        slippageToggle: this.form.get("slippageToggle")?.value
      }
    }).afterDismissed().subscribe({
      next: result => {
        if (!result) return;
        this.form.get("commission")?.patchValue(result.commission);
        this.form.get("commissionToggle")?.patchValue(result.commissionToggle);
        this.form.get("slippage")?.patchValue(result.slippage);
        this.form.get("slippageToggle")?.patchValue(result.slippageToggle);
        this._changeDetectionRef.detectChanges();
      }
    });
  }
  setAmount(modifier) {
    const amount = this.selectedSourceAsset.amount;
    const modifiedValue = Number((amount * modifier).toFixed(8));
    if (this.swapBalanceDisplay === "token") {
      this.form.get("sourceAmount")?.patchValue(modifiedValue || "");
      this.form.get("sourceAmount")?.markAsDirty();
      this.form.get("sourceAmount")?.markAsTouched();
      this.form.get("sourceAmount")?.updateValueAndValidity();
    } else {
      this.form.get("sourceFiat")?.patchValue(modifiedValue * this.selectedSourceAsset.price || 0);
      this.form.get("sourceFiat")?.markAsDirty();
      this.form.get("sourceFiat")?.markAsTouched();
      this.form.get("sourceFiat")?.updateValueAndValidity();
    }
    this._changeDetectionRef.detectChanges();
  }
  setBridge(bridge) {
    this.form.get("bridge")?.patchValue(bridge);
    this._changeDetectionRef.detectChanges();
  }
  showDetails() {
    return !!(this.form.get("sourceAmount")?.valid && this.form.get("targetAsset")?.valid);
  }
  swapTargetWithSource() {
    if (!this.hasBothAssetsSet) return;
    this.formUnsubscriber$.next();
    this.formUnsubscriber$.complete();
    const _tempSourceFiat = this.form.get("sourceFiat")?.value || 0;
    const _tempTargetFiat = 0;
    const _tempSource = {
      ...(this.form.get("sourceAsset")?.value || {})
    };
    const _tempTarget = {
      ...(this.form.get("targetAsset")?.value || {})
    };
    const fromTokenDecimals = _tempSource?.decimals || 9;
    const toTokenDecimals = _tempTarget?.decimals || 9;
    let _tempSourceAmount = this.form.get("sourceAmount")?.value || "";
    let _tempTargetAmount = this.form.get("targetAmount")?.value || "";
    _tempSourceAmount = Number(_tempSourceAmount).toFixed(fromTokenDecimals);
    _tempTargetAmount = Number(_tempTargetAmount).toFixed(toTokenDecimals);
    this._changeDetectionRef.detectChanges();
    this._setupQuoteUpdates();
    this.form.patchValue({
      sourceAmount: _tempTargetAmount,
      sourceAsset: _tempTarget,
      sourceFiat: _tempTargetFiat,
      targetAmount: _tempSourceAmount,
      targetAsset: _tempSource,
      targetFiat: _tempSourceFiat
    }, {
      onlySelf: true
    });
    this.form.get("sourceAsset")?.markAsDirty();
    this.form.get("sourceAsset")?.markAsTouched();
    this.form.get("targetAsset")?.markAsDirty();
    this.form.get("targetAsset")?.markAsTouched();
    this.form.updateValueAndValidity();
  }
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  static ɵfac = function SwapComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SwapComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵdirectiveInject"](app_asset_service__WEBPACK_IMPORTED_MODULE_28__.AssetService), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵdirectiveInject"](app_services_blockchain_transactions_service__WEBPACK_IMPORTED_MODULE_29__.BlockchainTransactionsService), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵdirectiveInject"](_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_30__.MatBottomSheet), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_25__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵdirectiveInject"](app_chrome_service__WEBPACK_IMPORTED_MODULE_31__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵdirectiveInject"](app_services_lifi_service__WEBPACK_IMPORTED_MODULE_32__.LifiService), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵdirectiveInject"](app_services_network_service__WEBPACK_IMPORTED_MODULE_33__.NetworkService), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_17__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_34__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵdirectiveInject"](app_transaction_service__WEBPACK_IMPORTED_MODULE_35__.TransactionService), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵdirectiveInject"](_jsverse_transloco__WEBPACK_IMPORTED_MODULE_18__.TranslocoService), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵdirectiveInject"](app_vault_service__WEBPACK_IMPORTED_MODULE_36__.VaultService), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵdirectiveInject"](app_wallet_service__WEBPACK_IMPORTED_MODULE_37__.WalletService), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵdirectiveInject"](app_tags_service__WEBPACK_IMPORTED_MODULE_38__.TagsService), _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵdirectiveInject"](app_services_settings_service__WEBPACK_IMPORTED_MODULE_39__.SettingsService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵdefineComponent"]({
    type: SwapComponent,
    selectors: [["swap"]],
    decls: 15,
    vars: 0,
    consts: [["downArrowIcon", ""], ["informationIcon", ""], ["editIcon", ""], ["openEye", ""], ["closedEye", ""], ["toggleButton", ""], ["cross", ""], ["bridgeMenu", "matMenu"], ["class", "zelf-card swap", 4, "transloco"], [1, "zelf-card", "swap"], [4, "ngIf"], ["class", "swap__top", 4, "ngIf"], [3, "excludeOppositeAsset", "myAssets", "parentNetworkId", "selectedAsset", "source", "assetChange", "pickerBack", 4, "ngIf"], [1, "swap__top"], ["mat-flat-button", "", "type", "button", 1, "zelf-icon-button", "zelf-icon-button--secondary", "zelf-icon-button--40", "swap__back", 3, "click"], ["width", "22", "height", "14", "viewBox", "0 0 22 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"], ["class", "swap__tabs", 4, "ngIf"], [1, "swap__tabs"], ["mat-flat-button", "", "type", "button", 1, "swap__tab", 3, "click", "ngClass"], [1, "swap-network-picker"], [1, "swap-network-picker__title"], [1, "zelf-input", "zelf-input--wide", "swap-network-picker__search"], ["name", "networkSearch", "type", "search", 1, "zelf-input__control", 3, "input", "value", "placeholder"], [1, "swap-network-picker__list"], ["mat-flat-button", "", "type", "button", 1, "swap-network-picker__row", 3, "click", "ngClass"], [1, "swap-network-picker__name"], [1, "swap-network-picker__usd"], ["class", "swap-network-picker__row", "mat-flat-button", "", "type", "button", 3, "ngClass", "click", 4, "ngFor", "ngForOf"], [1, "swap-network-picker__row-main"], ["class", "swap-network-picker__icons", 4, "ngIf"], [1, "swap-network-picker__icons"], ["alt", "", "class", "swap-network-picker__icon", 3, "src", 4, "ngFor", "ngForOf"], ["class", "swap-network-picker__more", 4, "ngIf"], ["alt", "", 1, "swap-network-picker__icon", 3, "src"], [1, "swap-network-picker__more"], [1, "swap__form", 3, "ngSubmit", "formGroup"], [1, "zelf-card__content", "swap__content"], [3, "diameter", 4, "ngIf"], [1, "swap__pair-shell"], [1, "swap__pair-row"], ["role", "button", "tabindex", "0", 1, "swap__pair-side", 3, "click"], [1, "swap__pair-label"], ["class", "swap__pair-token", 4, "ngIf"], ["class", "swap__pair-placeholder", 4, "ngIf"], ["mat-flat-button", "", "type", "button", 1, "zelf-icon-button", "zelf-icon-button--primary", "zelf-icon-button--40", "swap__pair-flip", 3, "click", "disabled"], ["width", "14", "height", "18", "viewBox", "0 0 14 18", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M10.9961 14.0149V8.0049C10.9961 7.4549 10.5461 7.0049 9.99612 7.0049C9.44612 7.0049 8.99612 7.4549 8.99612 8.0049V14.0149H7.20612C6.75612 14.0149 6.53612 14.5549 6.85612 14.8649L9.64612 17.6449C9.84612 17.8349 10.1561 17.8349 10.3561 17.6449L13.1461 14.8649C13.4661 14.5549 13.2361 14.0149 12.7961 14.0149H10.9961ZM3.64612 0.354902L0.856124 3.1449C0.536124 3.4549 0.756124 3.9949 1.20612 3.9949H2.99612V10.0049C2.99612 10.5549 3.44612 11.0049 3.99612 11.0049C4.54612 11.0049 4.99612 10.5549 4.99612 10.0049V3.9949H6.78612C7.23612 3.9949 7.45612 3.4549 7.13612 3.1449L4.34612 0.354902C4.15612 0.164902 3.83612 0.164902 3.64612 0.354902Z"], ["mat-flat-button", "", "type", "button", 1, "swap__pair-network-btn", 3, "click"], ["alt", "", "class", "swap__pair-network-img", 3, "src", 4, "ngIf"], ["class", "swap__pair-network-all", 4, "ngIf"], [4, "ngTemplateOutlet"], [1, "swap__hero", 3, "ngClass"], [1, "swap__hero-input-wrap", 3, "ngClass"], ["class", "swap__hero-input", "formControlName", "sourceAmount", "min", "0", "placeholder", "0", "required", "", "type", "number", 3, "max", 4, "ngIf"], ["class", "swap__hero-input swap__hero-input--fiat", "formControlName", "sourceFiat", "min", "0", "placeholder", "0", "required", "", "type", "number", 3, "max", 4, "ngIf"], ["class", "swap__hero-sub", 4, "ngIf"], ["class", "swap__hero-balance", 4, "ngIf"], [1, "swap__hero-pills"], ["mat-flat-button", "", "type", "button", 1, "swap__pill", 3, "click", "ngClass"], ["mat-flat-button", "", "type", "button", 1, "swap__pill", 3, "click"], [1, "swap__summary"], ["class", "swap__summary-row", 4, "ngIf"], [1, "swap__details"], ["class", "zelf-message zelf-message--error", 4, "ngIf"], [1, "zelf-card__actions", "swap__actions"], ["class", "zelf-input zelf-input--wide", 3, "ngClass", 4, "ngIf"], ["mat-flat-button", "", "type", "submit", 1, "zelf-button", "zelf-button--primary", "zelf-button--wide", "swap__review-btn", 3, "disabled"], ["mode", "indeterminate", "diameter", "18", 4, "ngIf"], ["type", "hidden", "formControlName", "bridge"], ["type", "hidden", "formControlName", "slippageToggle"], ["type", "hidden", "formControlName", "slippage"], ["type", "hidden", "formControlName", "commissionToggle"], ["type", "hidden", "formControlName", "commission"], ["type", "hidden", "formControlName", "sourceAsset"], ["type", "hidden", "formControlName", "targetAsset"], [3, "diameter"], [1, "swap__pair-token"], [1, "swap__asset-logo-container", "swap__asset-logo-container--sm"], ["alt", "", "class", "swap__asset-logo", 3, "src", 4, "ngIf"], ["alt", "", 1, "swap__asset-network-logo", 3, "src"], [1, "swap__pair-symbol"], ["alt", "", 1, "swap__asset-logo", 3, "src"], [1, "swap__pair-placeholder"], ["alt", "", "class", "swap__asset-network-logo", 3, "src", 4, "ngIf"], ["alt", "", 1, "swap__pair-network-img", 3, "src"], [1, "swap__pair-network-all"], ["formControlName", "sourceAmount", "min", "0", "placeholder", "0", "required", "", "type", "number", 1, "swap__hero-input", 3, "max"], ["formControlName", "sourceFiat", "min", "0", "placeholder", "0", "required", "", "type", "number", 1, "swap__hero-input", "swap__hero-input--fiat", 3, "max"], [1, "swap__hero-sub"], [1, "swap__hero-balance"], [1, "swap__summary-row"], [1, "swap__summary-label"], [1, "swap__summary-value"], [1, "zelf-message", "zelf-message--error"], [1, "swap__settings"], ["type", "button", "mat-flat-button", "", 1, "zelf-button", "zelf-button--secondary", "swap__settings-button", 3, "disabled", "matMenuTriggerFor"], [3, "innerHTML"], [1, "zelf-menu"], ["class", "zelf-menu-item", "type", "button", "mat-menu-item", "", 3, "click", 4, "ngFor", "ngForOf"], [1, "zelf-action-row"], [1, "swap__detail-field", "swap__detail-field--gray"], [1, "swap__details-label"], [1, "tooltip-container"], [1, "tooltip"], [1, "tooltip__content"], [1, "tooltip__content-text"], [1, "swap__detail-field", "swap__detail-field--primary"], [1, "swap__details-value"], ["type", "button", "mat-flat-button", "", 1, "zelf-icon-button", "zelf-icon-button--transparent", "zelf-icon-button--40", 3, "click"], ["type", "button", "mat-menu-item", "", 1, "zelf-menu-item", 3, "click"], [1, "zelf-radio", "zelf-radio--plain", "zelf-radio--gap-lg", 3, "for"], ["formControlName", "bridge", "name", "bridge", "type", "radio", 3, "id", "value"], ["viewBox", "0 0 21 21"], ["points", "5 10.75 8.5 14.25 16 6"], [1, "zelf-input", "zelf-input--wide", 3, "ngClass"], ["autocomplete", "off", "formControlName", "password", "id", "password", "name", "password", "placeholder", " ", "required", "", 1, "zelf-input__control", "zelf-input__control--floating-label", 3, "type"], ["for", "password", 1, "zelf-input__floating-label"], ["mode", "indeterminate", "diameter", "18"], [3, "assetChange", "pickerBack", "excludeOppositeAsset", "myAssets", "parentNetworkId", "selectedAsset", "source"], ["width", "12", "height", "8", "viewBox", "0 0 12 8", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M9.87498 0.999531L5.99498 4.87953L2.11498 0.999531C1.72498 0.609531 1.09498 0.609531 0.704976 0.999531C0.314976 1.38953 0.314976 2.01953 0.704976 2.40953L5.29498 6.99953C5.68498 7.38953 6.31498 7.38953 6.70498 6.99953L11.295 2.40953C11.685 2.01953 11.685 1.38953 11.295 0.999531C10.905 0.619531 10.265 0.609531 9.87498 0.999531Z"], ["width", "20", "height", "20", "viewBox", "0 0 20 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 15C9.45 15 9 14.55 9 14V10C9 9.45 9.45 9 10 9C10.55 9 11 9.45 11 10V14C11 14.55 10.55 15 10 15ZM11 7H9V5H11V7Z"], ["width", "18", "height", "18", "viewBox", "0 0 18 18", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M-0.0012207 14.4615V17.5015C-0.0012207 17.7815 0.218779 18.0015 0.498779 18.0015H3.53878C3.66878 18.0015 3.79878 17.9515 3.88878 17.8515L14.8088 6.94152L11.0588 3.19152L0.148779 14.1015C0.0487794 14.2015 -0.0012207 14.3215 -0.0012207 14.4615Z"], ["d", "M17.7088 2.63152L15.3688 0.291523C14.9788 -0.0984766 14.3488 -0.0984766 13.9588 0.291523L12.1288 2.12152L15.8788 5.87152L17.7088 4.04152C18.0988 3.65152 18.0988 3.02152 17.7088 2.63152Z"], ["xmlns", "http://www.w3.org/2000/svg", "height", "24px", "viewBox", "0 -960 960 960", "width", "24px"], ["d", "M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"], ["d", "m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"], ["type", "button", "mat-icon-button", "", "tabindex", "-1", 1, "zelf-icon-button", "zelf-icon-button--transparent", 3, "click"], ["d", "M10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM14.3 14.3C13.91 14.69 13.28 14.69 12.89 14.3L10 11.41L7.11 14.3C6.72 14.69 6.09 14.69 5.7 14.3C5.31 13.91 5.31 13.28 5.7 12.89L8.59 10L5.7 7.11C5.31 6.72 5.31 6.09 5.7 5.7C6.09 5.31 6.72 5.31 7.11 5.7L10 8.59L12.89 5.7C13.28 5.31 13.91 5.31 14.3 5.7C14.69 6.09 14.69 6.72 14.3 7.11L11.41 10L14.3 12.89C14.68 13.27 14.68 13.91 14.3 14.3Z", "fill", "#DC362E"]],
    template: function SwapComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplate"](0, SwapComponent_div_0_Template, 3, 2, "div", 8)(1, SwapComponent_ng_template_1_Template, 2, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplateRefExtractor"])(3, SwapComponent_ng_template_3_Template, 2, 0, "ng-template", null, 1, _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplateRefExtractor"])(5, SwapComponent_ng_template_5_Template, 3, 0, "ng-template", null, 2, _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplateRefExtractor"])(7, SwapComponent_ng_template_7_Template, 2, 0, "ng-template", null, 3, _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplateRefExtractor"])(9, SwapComponent_ng_template_9_Template, 2, 0, "ng-template", null, 4, _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplateRefExtractor"])(11, SwapComponent_ng_template_11_Template, 2, 1, "ng-template", null, 5, _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplateRefExtractor"])(13, SwapComponent_ng_template_13_Template, 2, 0, "ng-template", null, 6, _angular_core__WEBPACK_IMPORTED_MODULE_27__["ɵɵtemplateRefExtractor"]);
      }
    },
    dependencies: [_angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_14__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_40__.MatIconButton, _angular_material_menu__WEBPACK_IMPORTED_MODULE_15__.MatMenuModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_15__.MatMenu, _angular_material_menu__WEBPACK_IMPORTED_MODULE_15__.MatMenuItem, _angular_material_menu__WEBPACK_IMPORTED_MODULE_15__.MatMenuTrigger, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_16__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_16__.MatProgressSpinner, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgTemplateOutlet, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_13__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_13__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.NumberValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.RadioControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.MinValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.MaxValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormControlName, _swap_currency_swap_currency_component__WEBPACK_IMPORTED_MODULE_24__.SwapCurrencyComponent, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_18__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_18__.TranslocoDirective, app_zelf_loader_zelf_loader_component__WEBPACK_IMPORTED_MODULE_22__.ZelfLoaderComponent, _angular_common__WEBPACK_IMPORTED_MODULE_12__.CurrencyPipe, _angular_common__WEBPACK_IMPORTED_MODULE_12__.DecimalPipe],
    styles: ["[_ngcontent-%COMP%]:root {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc);\n}\n\n.zelf-button-external-link[_ngcontent-%COMP%] {\n  display: block;\n}\n.zelf-button-external-link--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.zelf-button[_ngcontent-%COMP%] {\n  align-items: center;\n  border-radius: 16px;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  gap: 8px;\n  height: 56px;\n  justify-content: center;\n  outline: none;\n  padding: 8px 24px;\n  text-align: center;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.zelf-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-button[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: inherit;\n}\n.zelf-button__text--margin-right[_ngcontent-%COMP%] {\n  margin-right: 1rem;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-button--thin[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  padding: 12px 16px;\n}\n.zelf-button--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.zelf-button--wide.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-button--primary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button, #181818) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--primary[_ngcontent-%COMP%]:active {\n  --mdc-filled-button-container-color: var(--zns-theme-text-muted, #96939e) !important;\n  background-color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-hover, #ff5721) !important;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff) !important;\n  stroke: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-text-secondary, #73777f) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-text-secondary, #73777f) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--secondary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-button-secondary-text, #495057) !important;\n  background-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  color: var(--zns-theme-button-secondary-text, #495057) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-secondary-text, #495057);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus, .zelf-button--secondary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-border, #e3e3e3) !important;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]:focus, .zelf-button--tertiary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%] {\n  --mdc-outlined-button-label-text-color: var(--zns-theme-button, #181818) !important;\n  --mdc-outlined-button-outline-color: var(--zns-theme-border, #e3e3e3) !important;\n  border: 1px solid var(--zns-theme-button, #181818) !important;\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-button, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button, #181818);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus, .zelf-button--outlined[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--outlined[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--outlined[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%] {\n  border: none !important;\n  background-color: transparent !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--red[_ngcontent-%COMP%]:focus, .zelf-button--red[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n}\n.zelf-button--red[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e);\n}\n.zelf-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n}\n\n.zelf-icon-button[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  align-items: center;\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  border-radius: 56px;\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  font-weight: 600;\n  gap: 16px;\n  height: 56px;\n  justify-content: center;\n  min-height: 56px;\n  min-width: 56px;\n  outline: none;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  -webkit-user-select: none;\n          user-select: none;\n  width: 56px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-icon-button.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: var(--zns-theme-text, #181818);\n  height: 24px;\n  width: 24px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%] {\n  height: 40px;\n  min-height: 40px;\n  min-width: 40px;\n  width: 40px;\n  border-radius: 40px;\n  padding: 0 8px;\n}\n.zelf-icon-button--40.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 14px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  height: 20px;\n  width: 20px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e) !important;\n  stroke: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:active {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus, .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%] {\n  background-color: transparent !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]:focus, .zelf-icon-button--transparent[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--text[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: initial !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  height: auto;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n  width: auto;\n}\n\n.zelf-icon-button-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:first-child {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:last-child {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.zelf-action-button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: 8px;\n}\n.zelf-action-button__icon[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  background: var(--zns-theme-card, #ffffff);\n  border-radius: 32px;\n  outline: 1px var(--zns-theme-border, #e3e3e3) solid;\n  outline-offset: -1px;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  cursor: pointer;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n@media (max-width: 600px) {\n  .zelf-action-button__icon[_ngcontent-%COMP%] {\n    padding: 8px 14px;\n  }\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-size: 24px;\n  line-height: 1;\n  font-variation-settings: \"FILL\" 0, \"wght\" 400, \"GRAD\" 0, \"opsz\" 24;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-primary, #181818);\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .zelf-action-button__text[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon-box[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  position: relative;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n}\n.zelf-action-button__text[_ngcontent-%COMP%] {\n  width: auto;\n  white-space: nowrap;\n  text-align: center;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 11px;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  line-height: 16px;\n  letter-spacing: 0.5px;\n  word-wrap: normal;\n}\n\n[_nghost-%COMP%] {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  justify-content: center;\n}\n\n.swap[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  max-width: var(--zns-card-width, 536px);\n  min-height: var(--zns-card-min-height, 768px);\n}\n.swap__top[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: calc(12px * var(--zns-space-scale, 1));\n  width: 100%;\n  margin-bottom: calc(8px * var(--zns-space-scale, 1));\n}\n.swap__back[_ngcontent-%COMP%] {\n  align-self: flex-start;\n}\n.swap__tabs[_ngcontent-%COMP%] {\n  display: flex;\n  width: 100%;\n  gap: calc(4px * var(--zns-space-scale, 1));\n  padding: calc(4px * var(--zns-space-scale, 1));\n  border-radius: 9999px;\n  background: var(--zns-theme-card-border, #eeedf1);\n  box-sizing: border-box;\n}\n.swap__tab[_ngcontent-%COMP%] {\n  flex: 1 1 0;\n  min-height: calc(36px * var(--zns-space-scale, 1));\n  border-radius: 9999px !important;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-text-secondary, #73777f);\n  background: transparent !important;\n  box-shadow: none !important;\n}\n.swap__tab--active[_ngcontent-%COMP%] {\n  background: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  box-shadow: 0 1px 4px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1)) !important;\n}\n.swap__tab--disabled[_ngcontent-%COMP%] {\n  opacity: 0.45;\n  cursor: not-allowed !important;\n}\n.swap__pair-shell[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  border-radius: calc(24px * var(--zns-space-scale, 1));\n  padding: calc(12px * var(--zns-space-scale, 1));\n  background: var(--zns-theme-card, #ffffff);\n  box-sizing: border-box;\n}\n.swap__pair-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  width: 100%;\n}\n.swap__pair-side[_ngcontent-%COMP%] {\n  flex: 1 1 0;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: calc(4px * var(--zns-space-scale, 1));\n  cursor: pointer;\n  padding: calc(4px * var(--zns-space-scale, 1));\n  border-radius: 12px;\n  transition: background-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.swap__pair-side[_ngcontent-%COMP%]:hover {\n  background: var(--zns-theme-card-border, #eeedf1);\n}\n.swap__pair-label[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: calc(11px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  color: var(--zns-theme-text-secondary, #73777f);\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n}\n.swap__pair-token[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n}\n.swap__pair-symbol[_ngcontent-%COMP%] {\n  font-weight: 700;\n  font-size: calc(15px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-text, #181818);\n}\n.swap__pair-placeholder[_ngcontent-%COMP%] {\n  font-size: calc(13px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-weight: 600;\n}\n.swap__pair-flip[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n}\n.swap__pair-network-btn[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 2px;\n  min-width: calc(48px * var(--zns-space-scale, 1));\n  min-height: calc(52px * var(--zns-space-scale, 1));\n  padding: calc(6px * var(--zns-space-scale, 1)) !important;\n  border-radius: calc(14px * var(--zns-space-scale, 1)) !important;\n  border: 1px solid var(--zns-theme-border, #e3e3e3) !important;\n  background: var(--zns-theme-card, #ffffff) !important;\n}\n.swap__pair-network-btn[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 10px;\n  height: 6px;\n  fill: var(--zns-theme-text, #181818);\n}\n.swap__pair-network-img[_ngcontent-%COMP%] {\n  width: calc(28px * var(--zns-space-scale, 1));\n  height: calc(28px * var(--zns-space-scale, 1));\n  border-radius: 50%;\n  object-fit: contain;\n}\n.swap__pair-network-all[_ngcontent-%COMP%] {\n  font-size: calc(10px * var(--zns-font-scale, 1));\n  font-weight: 700;\n  color: var(--zns-theme-text-secondary, #73777f);\n  text-transform: uppercase;\n}\n.swap__asset-logo-container--sm[_ngcontent-%COMP%] {\n  width: calc(32px * var(--zns-space-scale, 1));\n  height: calc(32px * var(--zns-space-scale, 1));\n}\n.swap__asset-logo-container--sm[_ngcontent-%COMP%]   .swap__asset-logo[_ngcontent-%COMP%] {\n  width: calc(32px * var(--zns-space-scale, 1));\n  height: calc(32px * var(--zns-space-scale, 1));\n}\n.swap__hero[_ngcontent-%COMP%] {\n  width: 100%;\n  text-align: center;\n  padding: calc(20px * var(--zns-space-scale, 1)) 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n}\n.swap__hero--error[_ngcontent-%COMP%]   .swap__hero-input[_ngcontent-%COMP%] {\n  color: var(--zns-theme-error, #dc362e);\n}\n.swap__hero-input-wrap[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n}\n.swap__hero-input-wrap--fiat[_ngcontent-%COMP%]::before {\n  color: var(--zns-theme-text-secondary, #73777f);\n  content: \"$\";\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: calc(28px * var(--zns-font-scale, 1));\n  font-weight: 700;\n}\n.swap__hero-input-wrap--fiat[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 4px;\n}\n.swap__hero-input[_ngcontent-%COMP%] {\n  appearance: none;\n  background: none;\n  border: none;\n  box-sizing: border-box;\n  color: inherit;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: calc(36px * var(--zns-font-scale, 1));\n  font-weight: 700;\n  line-height: 1.1;\n  margin: 0;\n  outline: none;\n  padding: 0;\n  text-align: center;\n  width: 100%;\n  max-width: 100%;\n}\n.swap__hero-input[_ngcontent-%COMP%]::-webkit-inner-spin-button, .swap__hero-input[_ngcontent-%COMP%]::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n.swap__hero-input[type=number][_ngcontent-%COMP%] {\n  appearance: textfield;\n}\n.swap__hero-input--fiat[_ngcontent-%COMP%] {\n  \n\n  flex: 0 1 auto;\n  width: 100%;\n  max-width: min(100%, 12rem);\n  min-width: 5ch;\n  text-align: center;\n}\n.swap__hero-sub[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: calc(15px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  color: var(--zns-theme-text-secondary, #73777f);\n}\n.swap__hero-balance[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: calc(13px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-text-secondary, #73777f);\n}\n.swap__hero-pills[_ngcontent-%COMP%] {\n  display: flex;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  margin-top: calc(4px * var(--zns-space-scale, 1));\n}\n.swap__pill[_ngcontent-%COMP%] {\n  min-height: calc(32px * var(--zns-space-scale, 1)) !important;\n  padding: 0 calc(16px * var(--zns-space-scale, 1)) !important;\n  border-radius: 9999px !important;\n  border: 1px solid var(--zns-theme-border, #e3e3e3) !important;\n  font-weight: 600 !important;\n  font-size: calc(12px * var(--zns-font-scale, 1)) !important;\n  background: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.swap__pill--active[_ngcontent-%COMP%] {\n  border-color: var(--zns-theme-text, #181818) !important;\n  background: var(--zns-theme-card-border, #eeedf1) !important;\n}\n.swap__summary[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  padding: calc(8px * var(--zns-space-scale, 1)) 0;\n}\n.swap__summary-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: calc(12px * var(--zns-space-scale, 1));\n}\n.swap__summary-label[_ngcontent-%COMP%] {\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  color: var(--zns-theme-text-secondary, #73777f);\n  margin: 0;\n}\n.swap__summary-value[_ngcontent-%COMP%] {\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n  text-align: right;\n}\n.swap__review-btn[_ngcontent-%COMP%] {\n  border-radius: 9999px !important;\n  min-height: calc(48px * var(--zns-space-scale, 1)) !important;\n}\n.swap__header[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(10, 1fr);\n  column-gap: calc(12px * var(--zns-space-scale, 1));\n  align-content: center;\n  justify-content: start;\n  gap: calc(24px * var(--zns-space-scale, 1));\n  width: 100%;\n}\n.swap__col1[_ngcontent-%COMP%], .swap__col3[_ngcontent-%COMP%] {\n  grid-column: span 3;\n  display: flex;\n  align-items: center;\n}\n.swap__col1[_ngcontent-%COMP%] {\n  justify-content: start;\n}\n.swap__col2[_ngcontent-%COMP%] {\n  grid-column: span 4;\n  text-align: center;\n  align-items: center;\n}\n.swap__col3[_ngcontent-%COMP%] {\n  justify-content: end;\n}\n.swap__title[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 500;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  text-align: center;\n  vertical-align: middle;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n}\n.swap__content[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  justify-content: flex-start;\n  position: relative;\n  gap: calc(12px * var(--zns-space-scale, 1));\n}\n.swap__loader[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  margin: auto;\n  z-index: 1;\n}\n.swap__asset-card[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  justify-content: flex-start;\n  gap: calc(12px * var(--zns-space-scale, 1));\n  width: 100%;\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  border-radius: 32px;\n  padding: calc(20px * var(--zns-space-scale, 1)) calc(16px * var(--zns-space-scale, 1));\n  box-sizing: border-box;\n  background-color: var(--zns-theme-card, #ffffff);\n  box-shadow: 0px 8px 24px 0px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n}\n@media (max-width: 600px) {\n  .swap__asset-card[_ngcontent-%COMP%] {\n    padding: calc(14px * var(--zns-space-scale, 1)) calc(12px * var(--zns-space-scale, 1));\n    gap: calc(8px * var(--zns-space-scale, 1));\n  }\n}\n.swap__asset-card--error[_ngcontent-%COMP%] {\n  border-color: var(--zns-theme-error, #dc362e);\n}\n.swap__asset-card--error[_ngcontent-%COMP%]   .swap__amount-input[_ngcontent-%COMP%] {\n  color: var(--zns-theme-error, #dc362e);\n}\n.swap__asset-switch[_ngcontent-%COMP%] {\n  margin-top: calc(-20px * var(--zns-space-scale, 1));\n  margin-bottom: calc(-20px * var(--zns-space-scale, 1));\n}\n@media (max-width: 600px) {\n  .swap__asset-switch[_ngcontent-%COMP%] {\n    margin-top: calc(-14px * var(--zns-space-scale, 1));\n    margin-bottom: calc(-14px * var(--zns-space-scale, 1));\n  }\n}\n.swap__actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-end;\n  gap: calc(12px * var(--zns-space-scale, 1));\n  width: 100%;\n  flex-grow: 1;\n}\n.swap__dropdown-selector[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  box-shadow: 0px 6px 24px 0px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n  border-radius: 16px;\n  border-color: 1px solid var(--zns-theme-card-border, #eeedf1);\n  justify-content: space-between;\n  background: var(--zns-theme-card, #ffffff);\n  gap: calc(8px * var(--zns-space-scale, 1));\n  padding: calc(8px * var(--zns-space-scale, 1)) calc(12px * var(--zns-space-scale, 1));\n  min-width: calc(140px * var(--zns-space-scale, 1));\n  cursor: pointer;\n  transition: background-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.swap__dropdown-selector[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-card-border, #eeedf1);\n}\n.swap__asset-card-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  flex: 1 1 auto;\n}\n.swap__asset-card-actions--left[_ngcontent-%COMP%] {\n  justify-content: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  align-items: flex-start;\n  min-width: 0;\n  flex: 1 1 auto;\n}\n.swap__asset-card-actions--right[_ngcontent-%COMP%] {\n  justify-content: center;\n  align-items: flex-end;\n  gap: calc(12px * var(--zns-space-scale, 1));\n  flex-shrink: 0;\n  margin-left: auto;\n}\n.swap__asset-logo-container[_ngcontent-%COMP%] {\n  position: relative;\n  width: calc(36px * var(--zns-space-scale, 1));\n  height: calc(36px * var(--zns-space-scale, 1));\n}\n.swap__asset-logo[_ngcontent-%COMP%] {\n  width: calc(36px * var(--zns-space-scale, 1));\n  height: calc(36px * var(--zns-space-scale, 1));\n  border-radius: 50%;\n}\n.swap__asset-network-logo[_ngcontent-%COMP%] {\n  width: calc(20px * var(--zns-space-scale, 1));\n  height: calc(20px * var(--zns-space-scale, 1));\n  border-radius: 50%;\n  position: absolute;\n  bottom: -2px;\n  right: -2px;\n  border: 1px solid var(--zns-theme-card, #ffffff);\n}\n.swap__asset-info[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  justify-content: flex-start;\n  gap: calc(6px * var(--zns-space-scale, 1));\n  flex: 1 1 auto;\n  min-width: 0;\n}\n.swap__asset-name[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  vertical-align: middle;\n  margin: 0;\n  color: var(--zns-theme-text, #181818);\n}\n.swap__asset-symbol[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(10px * var(--zns-font-scale, 1));\n  line-height: calc(16px * var(--zns-font-scale, 1));\n  letter-spacing: 0.5px;\n  vertical-align: middle;\n  margin: 0;\n  color: var(--zns-theme-border-hover, #c3c6cf);\n}\n.swap__asset-placeholder[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(10px * var(--zns-font-scale, 1));\n  line-height: calc(16px * var(--zns-font-scale, 1));\n  letter-spacing: 0.5px;\n  vertical-align: middle;\n  margin: 0;\n  color: var(--zns-theme-text-secondary, #73777f);\n}\n.swap__asset-dropdown-button[_ngcontent-%COMP%] {\n  width: calc(24px * var(--zns-space-scale, 1));\n  height: calc(24px * var(--zns-space-scale, 1));\n  min-width: calc(24px * var(--zns-space-scale, 1));\n  min-height: calc(24px * var(--zns-space-scale, 1));\n  border-radius: 9999px;\n}\n.swap__asset-dropdown-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: calc(12px * var(--zns-space-scale, 1));\n  height: calc(12px * var(--zns-space-scale, 1));\n  fill: var(--zns-theme-text, #181818);\n}\n.swap__quick-amounts[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  flex-wrap: wrap;\n}\n.swap__quick-amount[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  vertical-align: middle;\n  margin: 0;\n  color: var(--zns-theme-text, #181818);\n}\n.swap__quick-amount--error[_ngcontent-%COMP%] {\n  color: var(--zns-theme-error, #dc362e);\n}\n.swap__asset-input-label[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  line-height: calc(16px * var(--zns-font-scale, 1));\n  letter-spacing: 0.5px;\n  vertical-align: middle;\n  margin: 0;\n  color: var(--zns-theme-border-hover, #c3c6cf);\n}\n.swap__amount-input-container[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n}\n.swap__amount-input-container--fiat[_ngcontent-%COMP%]:before {\n  color: var(--zns-theme-text-secondary, #73777f);\n  align-items: center;\n  bottom: 0;\n  content: \"$\";\n  display: flex;\n  font-family: Menda, sans-serif;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  height: calc(40px * var(--zns-space-scale, 1));\n  left: 0;\n  letter-spacing: 0.1px;\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  margin: auto;\n  position: absolute;\n  top: 0;\n  width: calc(40px * var(--zns-space-scale, 1));\n}\n.swap__amount-input-container--fiat[_ngcontent-%COMP%]   .swap__amount-input[_ngcontent-%COMP%] {\n  padding-left: calc(24px * var(--zns-space-scale, 1));\n}\n.swap__amount-input[_ngcontent-%COMP%] {\n  appearance: none;\n  background: none;\n  border: none;\n  box-sizing: border-box;\n  color: inherit;\n  font-family: Menda, sans-serif;\n  font-size: calc(20px * var(--zns-font-scale, 1));\n  font-weight: 700;\n  letter-spacing: 0%;\n  line-height: calc(32px * var(--zns-font-scale, 1));\n  margin: 0;\n  outline: none;\n  padding: 0;\n  text-transform: uppercase;\n  vertical-align: middle;\n  width: 100%;\n  position: relative;\n}\n@media (max-width: 600px) {\n  .swap__amount-input[_ngcontent-%COMP%] {\n    font-size: calc(16px * var(--zns-font-scale, 1));\n    line-height: calc(24px * var(--zns-font-scale, 1));\n  }\n}\n.swap__amount-input[_ngcontent-%COMP%]::-webkit-inner-spin-button, .swap__amount-input[_ngcontent-%COMP%]::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n.swap__amount-input[type=number][_ngcontent-%COMP%] {\n  appearance: textfield;\n}\n.swap__amount-input[_ngcontent-%COMP%]::placeholder {\n  color: var(--zns-theme-border-hover, #c3c6cf);\n}\n.swap__balance-value[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  width: 100%;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  flex-wrap: wrap;\n}\n.swap__balance-value-label[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  line-height: calc(16px * var(--zns-font-scale, 1));\n  letter-spacing: 0.5px;\n  vertical-align: middle;\n  margin: 0;\n  color: var(--zns-theme-text-secondary, #73777f);\n}\n.swap__form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: calc(12px * var(--zns-space-scale, 1));\n  width: 100%;\n  flex-grow: 1;\n}\n.swap__details[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  flex: 1 1 auto;\n}\n.swap__detail-field[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: calc(12px * var(--zns-space-scale, 1));\n}\n.swap__detail-field--gray[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.swap__detail-field--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.swap__details-label[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(11px * var(--zns-font-scale, 1));\n  line-height: calc(16px * var(--zns-font-scale, 1));\n  letter-spacing: 0.5px;\n  vertical-align: middle;\n  color: var(--zns-theme-text-secondary, #73777f);\n  margin: 0;\n}\n.swap__details-label[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.swap__details-value[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(11px * var(--zns-font-scale, 1));\n  line-height: calc(16px * var(--zns-font-scale, 1));\n  letter-spacing: 0.5px;\n  vertical-align: middle;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n}\n.swap__settings[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-bottom: calc(8px * var(--zns-space-scale, 1));\n}\n.swap__settings-button[_ngcontent-%COMP%] {\n  min-width: calc(260px * var(--zns-space-scale, 1));\n  min-height: calc(40px * var(--zns-space-scale, 1));\n  height: calc(40px * var(--zns-space-scale, 1));\n}\n\n.swap-network-picker[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: calc(16px * var(--zns-space-scale, 1));\n  width: 100%;\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.swap-network-picker__title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 700;\n  font-size: calc(22px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-text, #181818);\n}\n.swap-network-picker__search[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.swap-network-picker__list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: calc(10px * var(--zns-space-scale, 1));\n  overflow-y: auto;\n  flex: 1 1 auto;\n  max-height: calc(520px * var(--zns-space-scale, 1));\n  padding-bottom: calc(8px * var(--zns-space-scale, 1));\n}\n.swap-network-picker__row[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  width: 100% !important;\n  text-align: left !important;\n  padding: calc(14px * var(--zns-space-scale, 1)) calc(16px * var(--zns-space-scale, 1)) !important;\n  border-radius: calc(16px * var(--zns-space-scale, 1)) !important;\n  border: 1px solid var(--zns-theme-border, #e3e3e3) !important;\n  background: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  height: auto !important;\n  min-height: calc(64px * var(--zns-space-scale, 1));\n  box-sizing: border-box;\n}\n.swap-network-picker__row--selected[_ngcontent-%COMP%] {\n  border-color: var(--zns-theme-text, #181818) !important;\n  box-shadow: 0 0 0 1px var(--zns-theme-text, #181818);\n}\n.swap-network-picker__row-main[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: calc(12px * var(--zns-space-scale, 1));\n  width: 100%;\n}\n.swap-network-picker__name[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: calc(15px * var(--zns-font-scale, 1));\n}\n.swap-network-picker__usd[_ngcontent-%COMP%] {\n  font-weight: 600;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-text-secondary, #73777f);\n}\n.swap-network-picker__icons[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: calc(-6px * var(--zns-space-scale, 1));\n  padding-left: calc(2px * var(--zns-space-scale, 1));\n}\n.swap-network-picker__icon[_ngcontent-%COMP%] {\n  width: calc(22px * var(--zns-space-scale, 1));\n  height: calc(22px * var(--zns-space-scale, 1));\n  border-radius: 50%;\n  border: 2px solid var(--zns-theme-card, #ffffff);\n  object-fit: contain;\n  background: var(--zns-theme-card-border, #eeedf1);\n}\n.swap-network-picker__more[_ngcontent-%COMP%] {\n  font-size: calc(11px * var(--zns-font-scale, 1));\n  font-weight: 700;\n  color: var(--zns-theme-text-secondary, #73777f);\n  margin-left: calc(8px * var(--zns-space-scale, 1));\n}\n\n.tooltip-container[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-block;\n}\n.tooltip-container[_ngcontent-%COMP%]:hover   .tooltip[_ngcontent-%COMP%] {\n  visibility: visible;\n}\n\n.tooltip[_ngcontent-%COMP%] {\n  visibility: hidden;\n  position: absolute;\n  z-index: 1;\n  top: 125%;\n  left: 50%;\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: 16px;\n  transform: translateX(-50%);\n  background-color: var(--zns-theme-card, #ffffff);\n  box-shadow: 0px 8px 24px 0px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n}\n.tooltip__content[_ngcontent-%COMP%] {\n  width: calc(254px * var(--zns-space-scale, 1));\n  gap: calc(8px * var(--zns-space-scale, 1));\n  padding: calc(16px * var(--zns-space-scale, 1));\n  display: flex;\n  align-items: flex-start;\n  justify-content: flex-start;\n}\n.tooltip__content[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  min-width: 24px;\n  fill: var(--zns-theme-text, #181818);\n}\n.tooltip__content-text[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  line-height: calc(16px * var(--zns-font-scale, 1));\n  letter-spacing: 0.5px;\n  vertical-align: middle;\n  margin: 0;\n  color: var(--zns-theme-text, #181818);\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX2J1dHRvbnMuc2NzcyIsIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX3ZhcmlhYmxlcy5zY3NzIiwid2VicGFjazovLy4vc3JjL2FwcC9zd2FwL3N3YXAuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxnRUMwQnVCO0FDM0IzQjs7QUZJQTtFQUNJLGNBQUE7QUVESjtBRkdJO0VBQ0ksV0FBQTtBRURSOztBRktBO0VBQ0ksbUJBQUE7RUFDQSxtQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLHVFQ0ljO0VESGQsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsUUFBQTtFQUNBLFlBQUE7RUFDQSx1QkFBQTtFQUNBLGFBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7VUFBQSxpQkFBQTtBRUZKO0FGSUk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLFFBQUE7QUVGUjtBRktJO0VBQ0ksU0FBQTtFQUNBLGNBQUE7QUVIUjtBRk9RO0VBQ0ksa0JBQUE7QUVMWjtBRlNJO0VBQ0ksNkJBQUE7RUFDQSwrQ0NsQmE7RURtQmIsZUFBQTtFQUNBLGdCQUFBO0VBQ0EscUJBQUE7RUFDQSxpQkFBQTtFQUNBLDZHQUNJO0FFUlo7QUZXUTtFQUNJLGVBQUE7QUVUWjtBRllRO0VBQ0ksOENDaENTO0FDc0JyQjtBRmFRO0VBQ0kscUNDdENBO0VEdUNBLGtEQ3hCRTtBQ2FkO0FGYVk7RUFDSSxvQ0MxQ0o7QUMrQlo7QUZlUTtFQUNJLG1CQUFBO0VBQ0Esc0RBQUE7QUViWjtBRmVZO0VBQ0ksMENDbERDO0FDcUNqQjtBRmtCSTtFQUNJLGtCQUFBO0VBQ0Esa0JBQUE7QUVoQlI7QUZtQkk7RUFDSSxXQUFBO0FFakJSO0FGbUJRO0VBQ0ksbUJBQUE7QUVqQlo7QUZxQkk7RUFFSSxnRkFBQTtFQUNBLCtFQUFBO0VBRUEsNkRBQUE7RUFDQSxnREFBQTtF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QytzQ1o7QUF0WUk7RUFDSSx1RURqMUJVO0VDazFCVixnQkFBQTtFQUNBLGdEQUFBO0VBQ0Esa0RBQUE7RUFDQSxxQkFBQTtFQUNBLHNCQUFBO0VBQ0EsU0FBQTtFQUNBLHFDRGoxQkk7QUN5dENaIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcIi4vdmFyaWFibGVzXCI7XG5cbjpyb290IHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbn1cblxuLnplbGYtYnV0dG9uLWV4dGVybmFsLWxpbmsge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuXG4gICAgJi0td2lkZSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cbn1cblxuLnplbGYtYnV0dG9uIHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBnYXA6IDhweDtcbiAgICBoZWlnaHQ6IDU2cHg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBwYWRkaW5nOiA4cHggMjRweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG5cbiAgICBzcGFuIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogOHB4O1xuICAgIH1cblxuICAgIHAge1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIGNvbG9yOiBpbmhlcml0O1xuICAgIH1cblxuICAgICZfX3RleHQge1xuICAgICAgICAmLS1tYXJnaW4tcmlnaHQge1xuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0taHlwZXJsaW5rIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIHBhZGRpbmc6IDhweCAxNnB4O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmLS1zbWFsbCB7XG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tdGhpbiB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgcGFkZGluZzogMTJweCAxNnB4O1xuICAgIH1cblxuICAgICYtLXdpZGUge1xuICAgICAgICB3aWR0aDogMTAwJTtcblxuICAgICAgICAmLnplbGYtYnV0dG9uLS1oeXBlcmxpbmsge1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXByaW1hcnkge1xuICAgICAgICAvLyBNREMgbWF0LWZsYXQtYnV0dG9uIHBhaW50cyB2aWEgQ1NTIHZhcmlhYmxlczsgYWxpZ24gd2l0aCBaZWxmIHRva2VucyAoYXZvaWRzIGRlZmF1bHQgTWF0ZXJpYWwgYmx1ZSkuXG4gICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b259ICFpbXBvcnRhbnQ7XG4gICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tbGFiZWwtdGV4dC1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQ2FyZH0gIWltcG9ydGFudDtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmFjdGl2ZSB7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXJ9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5fSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVDYXJkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc2Vjb25kYXJ5IHtcbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeX0gIWltcG9ydGFudDtcbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0fSAhaW1wb3J0YW50O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVDYXJkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJvcmRlcn0gIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10ZXJ0aWFyeSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3IgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tb3V0bGluZWQge1xuICAgICAgICAtLW1kYy1vdXRsaW5lZC1idXR0b24tbGFiZWwtdGV4dC1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9ufSAhaW1wb3J0YW50O1xuICAgICAgICAtLW1kYy1vdXRsaW5lZC1idXR0b24tb3V0bGluZS1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQm9yZGVyfSAhaW1wb3J0YW50O1xuXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b247XG4gICAgICAgIH1cblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1yZWQge1xuICAgICAgICBib3JkZXI6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tZXJyb3Ige1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc3VjY2VzcyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdExpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRjb3JyZWN0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1waWxsIHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBtaW4taGVpZ2h0OiAwO1xuICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgICAgIHBhZGRpbmc6IDRweCAxMnB4O1xuICAgIH1cbn1cblxuLnplbGYtaWNvbi1idXR0b24ge1xuICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyLXJhZGl1czogNTZweDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgZ2FwOiAxNnB4O1xuICAgIGhlaWdodDogNTZweDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBtaW4taGVpZ2h0OiA1NnB4O1xuICAgIG1pbi13aWR0aDogNTZweDtcbiAgICBvdXRsaW5lOiBub25lO1xuICAgIHRyYW5zaXRpb246XG4gICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICB3aWR0aDogNTZweDtcblxuICAgIHNwYW4ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgfVxuXG4gICAgJi56ZWxmLWljb24tYnV0dG9uLS1ib3JkZXItc29mdCB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgfVxuXG4gICAgc3ZnIHtcbiAgICAgICAgdHJhbnNpdGlvbjogZmlsbCAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgaGVpZ2h0OiAyNHB4O1xuICAgICAgICB3aWR0aDogMjRweDtcbiAgICB9XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tYm9yZGVyLXNvZnQge1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIH1cblxuICAgICYtLTQwIHtcbiAgICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgICBtaW4taGVpZ2h0OiA0MHB4O1xuICAgICAgICBtaW4td2lkdGg6IDQwcHg7XG4gICAgICAgIHdpZHRoOiA0MHB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA0MHB4O1xuICAgICAgICBwYWRkaW5nOiAwIDhweDtcblxuICAgICAgICAmLnplbGYtaWNvbi1idXR0b24tLWJvcmRlci1zb2Z0IHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgaGVpZ2h0OiAyMHB4O1xuICAgICAgICAgICAgd2lkdGg6IDIwcHg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1oeXBlcmxpbmsge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICAgICAgcGFkZGluZzogOHB4IDE2cHg7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICYtLXNtYWxsIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tcHJpbWFyeSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6YWN0aXZlIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc2Vjb25kYXJ5IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXIgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10cmFuc3BhcmVudCB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10ZXh0IHtcbiAgICAgICAgd2lkdGg6IGF1dG8gIWltcG9ydGFudDtcbiAgICAgICAgbWluLXdpZHRoOiBpbml0aWFsICFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgJi0tZXJyb3Ige1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc3VjY2VzcyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdExpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRjb3JyZWN0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1waWxsIHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBoZWlnaHQ6IGF1dG87XG4gICAgICAgIG1pbi1oZWlnaHQ6IDA7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgcGFkZGluZzogNHB4IDEycHg7XG4gICAgICAgIHdpZHRoOiBhdXRvO1xuICAgIH1cbn1cblxuLnplbGYtaWNvbi1idXR0b24tZ3JvdXAge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDA7XG5cbiAgICAuemVsZi1pY29uLWJ1dHRvbiB7XG4gICAgICAgICY6Zmlyc3QtY2hpbGQge1xuICAgICAgICAgICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDA7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6bm90KDpmaXJzdC1jaGlsZCk6bm90KDpsYXN0LWNoaWxkKSB7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpsYXN0LWNoaWxkIHtcbiAgICAgICAgICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAwO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uemVsZi1hY3Rpb24tYnV0dG9uIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogOHB4O1xuXG4gICAgJl9faWNvbiB7XG4gICAgICAgIHBhZGRpbmc6IDEwcHggMjBweDtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDMycHg7XG4gICAgICAgIG91dGxpbmU6IDFweCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyIHNvbGlkO1xuICAgICAgICBvdXRsaW5lLW9mZnNldDogLTFweDtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogdmFyaWFibGVzLiRtaW5TbWFsbCkge1xuICAgICAgICAgICAgcGFkZGluZzogOHB4IDE0cHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBmaWxsIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgICAgIH1cblxuICAgICAgICAubWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBmb250LXNpemU6IDI0cHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcbiAgICAgICAgICAgIGZvbnQtdmFyaWF0aW9uLXNldHRpbmdzOlxuICAgICAgICAgICAgICAgIFwiRklMTFwiIDAsXG4gICAgICAgICAgICAgICAgXCJ3Z2h0XCIgNDAwLFxuICAgICAgICAgICAgICAgIFwiR1JBRFwiIDAsXG4gICAgICAgICAgICAgICAgXCJvcHN6XCIgMjQ7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHByaW1hcnlDb2xvcjtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQge1xuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLnplbGYtYWN0aW9uLWJ1dHRvbl9fdGV4dCB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9faWNvbi1ib3gge1xuICAgICAgICB3aWR0aDogMjhweDtcbiAgICAgICAgaGVpZ2h0OiAyOHB4O1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX190ZXh0IHtcbiAgICAgICAgd2lkdGg6IGF1dG87XG4gICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE2cHg7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjVweDtcbiAgICAgICAgd29yZC13cmFwOiBub3JtYWw7XG4gICAgfVxufVxuIiwiJHByaW1hcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXByaW1hcnksICMxODE4MTgpO1xuJHByaW1hcnlMaWdodDogI2RhZGRmYTtcbiRzZWNvbmRhcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXNlY29uZGFyeSwgI2ZmNTcyMSk7XG4kc2Vjb25kYXJ5Q29sb3JMaWdodDogI2Y2ZTVlMDtcblxuJGNvcnJlY3Q6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLCAjMWVhNDQ2KTtcbiRjb3JyZWN0RGFyazogIzBmNTIyMztcbiRjb3JyZWN0TGlnaHQ6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLXRleHQsICNlN2Y4ZWQpO1xuXG4kZXJyb3I6IHZhcigtLXpucy10aGVtZS1lcnJvciwgI2RjMzYyZSk7XG4kZXJyb3JEYXJrOiAjNjAxNDEwO1xuJGVycm9yTGlnaHQ6IHZhcigtLXpucy10aGVtZS1lcnJvci10ZXh0LCAjZmNlZWVlKTtcblxuJHdhcm5pbmc6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLCAjZGU2ODAwKTtcbiR3YXJuaW5nRGFyazogIzRhMjEwYTtcbiR3YXJuaW5nTGlnaHQ6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLXRleHQsICNmZmVlZTkpO1xuXG4kaW5mbzogIzM5OThkMztcbiRpbmZvRGFyazogIzAwNGE3NztcbiRpbmZvTGlnaHQ6ICNlY2YzZmU7XG5cbiRibGFjazogIzE4MTgxODtcbiR3aGl0ZTogI2ZmZmZmZjtcblxuJHRoZW1lQm9keUZhbWlseTogdmFyKC0tem5zLXRoZW1lLWJvZHktZmFtaWx5LCBcIlBvcHBpbnNcIiwgQXJpYWwsIHNhbnMtc2VyaWYpO1xuJHRoZW1lVGl0bGVGYW1pbHk6IHZhcigtLXpucy10aGVtZS10aXRsZS1mYW1pbHksIFwiTWVuZGFcIiwgXCJBcmlhbCBCbGFja1wiLCBzYW5zLXNlcmlmKTtcbiR0aGVtZU1vbm9zcGFjZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLW1vbm9zcGFjZS1mYW1pbHksIFwiQ291cmllciBOZXdcIiwgQ291cmllciwgbW9ub3NwYWNlKTtcblxuJHRoZW1lQmFja2dyb3VuZDogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQsICNmZmZmZmYpO1xuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQtc2Vjb25kYXJ5LCAjZjlmOWZjKTtcblxuJHRoZW1lVGV4dDogdmFyKC0tem5zLXRoZW1lLXRleHQsICMxODE4MTgpO1xuJHRoZW1lVGV4dE11dGVkOiB2YXIoLS16bnMtdGhlbWUtdGV4dC1tdXRlZCwgIzk2OTM5ZSk7XG4kdGhlbWVUZXh0U2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtdGV4dC1zZWNvbmRhcnksICM3Mzc3N2YpO1xuXG4kdGhlbWVIZWFkZXI6IHZhcigtLXpucy10aGVtZS1oZWFkZXIsICMxODE4MTgpO1xuJHRoZW1lSGVhZGVyVGV4dDogdmFyKC0tem5zLXRoZW1lLWhlYWRlci10ZXh0LCAjZmZmZmZmKTtcblxuJHRoZW1lQnV0dG9uOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLCAjMTgxODE4KTtcbiR0aGVtZUJ1dHRvblRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tdGV4dCwgI2ZmZmZmZik7XG4kdGhlbWVCdXR0b25Ib3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1ob3ZlciwgI2ZmNTcyMSk7XG5cbiR0aGVtZUJ1dHRvblNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnksICNlOWVjZWYpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktdGV4dCwgIzQ5NTA1Nyk7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktaG92ZXIsICNlOWVjZWYpO1xuXG4kdGhlbWVCb3JkZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXIsICNlM2UzZTMpO1xuJHRoZW1lQm9yZGVySG92ZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXItaG92ZXIsICNjM2M2Y2YpO1xuXG4kdGhlbWVDYXJkOiB2YXIoLS16bnMtdGhlbWUtY2FyZCwgI2ZmZmZmZik7XG4kdGhlbWVDYXJkQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtY2FyZC1ib3JkZXIsICNlZWVkZjEpO1xuXG4kdGhlbWVTaGFkb3c6IHZhcigtLXpucy10aGVtZS1zaGFkb3csIHJnYmEoMCwgMCwgMCwgMC4xKSk7XG5cbiRzbW9vdGhCZXppZXI6IGN1YmljLWJlemllcigwLjI1LCAwLjQsIDAuNywgMSk7XG5cbiRtYXhFeHRyYVNtYWxsOiA1OTVweDtcbiRtaW5TbWFsbDogNjAwcHg7XG4kbWVkaXVtOiA3NjhweDtcbiRsYXJnZTogODg5cHg7XG4kY29tcHV0ZXJzOiAxMjAwcHg7XG4iLCJAdXNlIFwiLi4vLi4vc3R5bGVzL3ZhcmlhYmxlc1wiO1xuQHVzZSBcIi4uLy4uL3N0eWxlcy9idXR0b25zXCI7XG5cbjpob3N0IHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBmbGV4LWdyb3c6IDE7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5zd2FwIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgbWF4LXdpZHRoOiB2YXIoLS16bnMtY2FyZC13aWR0aCwgNTM2cHgpO1xuICAgIG1pbi1oZWlnaHQ6IHZhcigtLXpucy1jYXJkLW1pbi1oZWlnaHQsIDc2OHB4KTtcblxuICAgICZfX3RvcCB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBtYXJnaW4tYm90dG9tOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX2JhY2sge1xuICAgICAgICBhbGlnbi1zZWxmOiBmbGV4LXN0YXJ0O1xuICAgIH1cblxuICAgICZfX3RhYnMge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgZ2FwOiBjYWxjKDRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIH1cblxuICAgICZfX3RhYiB7XG4gICAgICAgIGZsZXg6IDEgMSAwO1xuICAgICAgICBtaW4taGVpZ2h0OiBjYWxjKDM2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4ICFpbXBvcnRhbnQ7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEycHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7XG4gICAgICAgIGJveC1zaGFkb3c6IG5vbmUgIWltcG9ydGFudDtcbiAgICB9XG5cbiAgICAmX190YWItLWFjdGl2ZSB7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICBib3gtc2hhZG93OiAwIDFweCA0cHggdmFyaWFibGVzLiR0aGVtZVNoYWRvdyAhaW1wb3J0YW50O1xuICAgIH1cblxuICAgICZfX3RhYi0tZGlzYWJsZWQge1xuICAgICAgICBvcGFjaXR5OiAwLjQ1O1xuICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkICFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgJl9fcGFpci1zaGVsbCB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyO1xuICAgICAgICBib3JkZXItcmFkaXVzOiBjYWxjKDI0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgcGFkZGluZzogY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIH1cblxuICAgICZfX3BhaXItcm93IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX19wYWlyLXNpZGUge1xuICAgICAgICBmbGV4OiAxIDEgMDtcbiAgICAgICAgbWluLXdpZHRoOiAwO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBnYXA6IGNhbGMoNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgcGFkZGluZzogY2FsYyg0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19wYWlyLWxhYmVsIHtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTFweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMDRlbTtcbiAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICB9XG5cbiAgICAmX19wYWlyLXRva2VuIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX3BhaXItc3ltYm9sIHtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDE1cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgfVxuXG4gICAgJl9fcGFpci1wbGFjZWhvbGRlciB7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxM3B4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgIH1cblxuICAgICZfX3BhaXItZmxpcCB7XG4gICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgIH1cblxuICAgICZfX3BhaXItbmV0d29yay1idG4ge1xuICAgICAgICBmbGV4LXNocmluazogMDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogMnB4O1xuICAgICAgICBtaW4td2lkdGg6IGNhbGMoNDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBtaW4taGVpZ2h0OiBjYWxjKDUycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgcGFkZGluZzogY2FsYyg2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSAhaW1wb3J0YW50O1xuICAgICAgICBib3JkZXItcmFkaXVzOiBjYWxjKDE0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSAhaW1wb3J0YW50O1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiA2cHg7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3BhaXItbmV0d29yay1pbWcge1xuICAgICAgICB3aWR0aDogY2FsYygyOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGhlaWdodDogY2FsYygyOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgb2JqZWN0LWZpdDogY29udGFpbjtcbiAgICB9XG5cbiAgICAmX19wYWlyLW5ldHdvcmstYWxsIHtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEwcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgfVxuXG4gICAgJl9fYXNzZXQtbG9nby1jb250YWluZXItLXNtIHtcbiAgICAgICAgd2lkdGg6IGNhbGMoMzJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBoZWlnaHQ6IGNhbGMoMzJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX2Fzc2V0LWxvZ28tY29udGFpbmVyLS1zbSAuc3dhcF9fYXNzZXQtbG9nbyB7XG4gICAgICAgIHdpZHRoOiBjYWxjKDMycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgaGVpZ2h0OiBjYWxjKDMycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19oZXJvIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgcGFkZGluZzogY2FsYygyMHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSkgMDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX2hlcm8tLWVycm9yIC5zd2FwX19oZXJvLWlucHV0IHtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3I7XG4gICAgfVxuXG4gICAgJl9faGVyby1pbnB1dC13cmFwIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIG1heC13aWR0aDogMTAwJTtcblxuICAgICAgICAmLS1maWF0OjpiZWZvcmUge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICAgICAgY29udGVudDogXCIkXCI7XG4gICAgICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgICAgICBmb250LXNpemU6IGNhbGMoMjhweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICB9XG5cbiAgICAgICAgJi0tZmlhdCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICAgICAgZ2FwOiA0cHg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19oZXJvLWlucHV0IHtcbiAgICAgICAgLW1vei1hcHBlYXJhbmNlOiBub25lO1xuICAgICAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG4gICAgICAgIGFwcGVhcmFuY2U6IG5vbmU7XG4gICAgICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgY29sb3I6IGluaGVyaXQ7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDM2cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBsaW5lLWhlaWdodDogMS4xO1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICAgIHBhZGRpbmc6IDA7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIG1heC13aWR0aDogMTAwJTtcblxuICAgICAgICAmOjotd2Via2l0LWlubmVyLXNwaW4tYnV0dG9uLFxuICAgICAgICAmOjotd2Via2l0LW91dGVyLXNwaW4tYnV0dG9uIHtcbiAgICAgICAgICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbiAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbdHlwZT1cIm51bWJlclwiXSB7XG4gICAgICAgICAgICAtbW96LWFwcGVhcmFuY2U6IHRleHRmaWVsZDtcbiAgICAgICAgICAgIGFwcGVhcmFuY2U6IHRleHRmaWVsZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2hlcm8taW5wdXQtLWZpYXQge1xuICAgICAgICAvKiBBdm9pZCBmbGV4LWdyb3c6IG51bWJlciBpbnB1dHMgZGVmYXVsdCB3aWRlOyBsZWZ0LWFsaWduZWQgdGV4dCB0aGVuIGxvb2tlZCBvZmYgdnMgY2VudGVyZWQgdG9rZW4gaGVybyAqL1xuICAgICAgICBmbGV4OiAwIDEgYXV0bztcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIG1heC13aWR0aDogbWluKDEwMCUsIDEycmVtKTtcbiAgICAgICAgbWluLXdpZHRoOiA1Y2g7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX19oZXJvLXN1YiB7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDE1cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgfVxuXG4gICAgJl9faGVyby1iYWxhbmNlIHtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTNweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICB9XG5cbiAgICAmX19oZXJvLXBpbGxzIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZ2FwOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBtYXJnaW4tdG9wOiBjYWxjKDRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX3BpbGwge1xuICAgICAgICBtaW4taGVpZ2h0OiBjYWxjKDMycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSAhaW1wb3J0YW50O1xuICAgICAgICBwYWRkaW5nOiAwIGNhbGMoMTZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpICFpbXBvcnRhbnQ7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweCAhaW1wb3J0YW50O1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDAgIWltcG9ydGFudDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEycHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpICFpbXBvcnRhbnQ7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgIH1cblxuICAgICZfX3BpbGwtLWFjdGl2ZSB7XG4gICAgICAgIGJvcmRlci1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXIgIWltcG9ydGFudDtcbiAgICB9XG5cbiAgICAmX19zdW1tYXJ5IHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgcGFkZGluZzogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSAwO1xuICAgIH1cblxuICAgICZfX3N1bW1hcnktcm93IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgICAgICAgZ2FwOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19zdW1tYXJ5LWxhYmVsIHtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEycHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICB9XG5cbiAgICAmX19zdW1tYXJ5LXZhbHVlIHtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEycHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgfVxuXG4gICAgJl9fcmV2aWV3LWJ0biB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweCAhaW1wb3J0YW50O1xuICAgICAgICBtaW4taGVpZ2h0OiBjYWxjKDQ4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSAhaW1wb3J0YW50O1xuICAgIH1cblxuICAgICZfX2hlYWRlciB7XG4gICAgICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAxZnIpO1xuICAgICAgICBjb2x1bW4tZ2FwOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYWxpZ24tY29udGVudDogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHN0YXJ0O1xuICAgICAgICBnYXA6IGNhbGMoMjRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX19jb2wxLFxuICAgICZfX2NvbDMge1xuICAgICAgICBncmlkLWNvbHVtbjogc3BhbiAzO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIH1cblxuICAgICZfX2NvbDEge1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHN0YXJ0O1xuICAgIH1cblxuICAgICZfX2NvbDIge1xuICAgICAgICBncmlkLWNvbHVtbjogc3BhbiA0O1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgJl9fY29sMyB7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZW5kO1xuICAgIH1cblxuICAgICZfX3RpdGxlIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDIwcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xcHg7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgfVxuXG4gICAgJl9fY29udGVudCB7XG4gICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgZ2FwOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19sb2FkZXIge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIGluc2V0OiAwO1xuICAgICAgICBtYXJnaW46IGF1dG87XG4gICAgICAgIHotaW5kZXg6IDE7XG4gICAgfVxuXG4gICAgJl9fYXNzZXQtY2FyZCB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICAgICAgZ2FwOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDMycHg7XG4gICAgICAgIHBhZGRpbmc6IGNhbGMoMjBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpIGNhbGMoMTZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgYm94LXNoYWRvdzogMHB4IDhweCAyNHB4IDBweCB2YXJpYWJsZXMuJHRoZW1lU2hhZG93O1xuXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiB2YXJpYWJsZXMuJG1pblNtYWxsKSB7XG4gICAgICAgICAgICBwYWRkaW5nOiBjYWxjKDE0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgICAgIGdhcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgICYtLWVycm9yIHtcbiAgICAgICAgICAgIGJvcmRlci1jb2xvcjogdmFyaWFibGVzLiRlcnJvcjtcblxuICAgICAgICAgICAgLnN3YXBfX2Ftb3VudC1pbnB1dCB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19hc3NldC1zd2l0Y2gge1xuICAgICAgICBtYXJnaW4tdG9wOiBjYWxjKC0yMHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IGNhbGMoLTIwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcblxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogdmFyaWFibGVzLiRtaW5TbWFsbCkge1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogY2FsYygtMTRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogY2FsYygtMTRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fYWN0aW9ucyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgICAgIGdhcDogY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBmbGV4LWdyb3c6IDE7XG4gICAgfVxuXG4gICAgJl9fZHJvcGRvd24tc2VsZWN0b3Ige1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBib3gtc2hhZG93OiAwcHggNnB4IDI0cHggMHB4IHZhcmlhYmxlcy4kdGhlbWVTaGFkb3c7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgICAgIGJvcmRlci1jb2xvcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHBhZGRpbmc6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSkgY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIG1pbi13aWR0aDogY2FsYygxNDBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fYXNzZXQtY2FyZC1hY3Rpb25zIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZmxleDogMSAxIGF1dG87XG4gICAgfVxuXG4gICAgJl9fYXNzZXQtY2FyZC1hY3Rpb25zLS1sZWZ0IHtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgZmxleDogMSAxIGF1dG87XG4gICAgfVxuXG4gICAgJl9fYXNzZXQtY2FyZC1hY3Rpb25zLS1yaWdodCB7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XG4gICAgICAgIGdhcDogY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgICAgICBtYXJnaW4tbGVmdDogYXV0bztcbiAgICB9XG5cbiAgICAmX19hc3NldC1sb2dvLWNvbnRhaW5lciB7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgd2lkdGg6IGNhbGMoMzZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBoZWlnaHQ6IGNhbGMoMzZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX2Fzc2V0LWxvZ28ge1xuICAgICAgICB3aWR0aDogY2FsYygzNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGhlaWdodDogY2FsYygzNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICB9XG5cbiAgICAmX19hc3NldC1uZXR3b3JrLWxvZ28ge1xuICAgICAgICB3aWR0aDogY2FsYygyMHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGhlaWdodDogY2FsYygyMHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICBib3R0b206IC0ycHg7XG4gICAgICAgIHJpZ2h0OiAtMnB4O1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICB9XG5cbiAgICAmX19hc3NldC1pbmZvIHtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICAgICAgZ2FwOiBjYWxjKDZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBmbGV4OiAxIDEgYXV0bztcbiAgICAgICAgbWluLXdpZHRoOiAwO1xuICAgIH1cblxuICAgICZfX2Fzc2V0LW5hbWUge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMjBweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjFweDtcbiAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgfVxuXG4gICAgJl9fYXNzZXQtc3ltYm9sIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTBweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDE2cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC41cHg7XG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICB9XG5cbiAgICAmX19hc3NldC1wbGFjZWhvbGRlciB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEwcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygxNnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICB9XG5cbiAgICAmX19hc3NldC1kcm9wZG93bi1idXR0b24ge1xuICAgICAgICB3aWR0aDogY2FsYygyNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGhlaWdodDogY2FsYygyNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIG1pbi13aWR0aDogY2FsYygyNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIG1pbi1oZWlnaHQ6IGNhbGMoMjRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIHdpZHRoOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgICAgIGhlaWdodDogY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3F1aWNrLWFtb3VudHMge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICAgICAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICB9XG5cbiAgICAmX19xdWljay1hbW91bnQge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMjBweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjFweDtcbiAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG5cbiAgICAgICAgJi0tZXJyb3Ige1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19hc3NldC1pbnB1dC1sYWJlbCB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEycHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygxNnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgfVxuXG4gICAgJl9fYW1vdW50LWlucHV0LWNvbnRhaW5lciB7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG5cbiAgICAgICAgJi0tZmlhdCB7XG4gICAgICAgICAgICAmOmJlZm9yZSB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICAgICAgYm90dG9tOiAwO1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiJFwiO1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgZm9udC1mYW1pbHk6IE1lbmRhLCBzYW5zLXNlcmlmO1xuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgICAgIGhlaWdodDogY2FsYyg0MHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgICAgICAgICAgbGVmdDogMDtcbiAgICAgICAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xcHg7XG4gICAgICAgICAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMjBweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgICAgICAgICAgbWFyZ2luOiBhdXRvO1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgICAgICB0b3A6IDA7XG4gICAgICAgICAgICAgICAgd2lkdGg6IGNhbGMoNDBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAuc3dhcF9fYW1vdW50LWlucHV0IHtcbiAgICAgICAgICAgICAgICBwYWRkaW5nLWxlZnQ6IGNhbGMoMjRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fYW1vdW50LWlucHV0IHtcbiAgICAgICAgLW1vei1hcHBlYXJhbmNlOiBub25lO1xuICAgICAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG4gICAgICAgIGFwcGVhcmFuY2U6IG5vbmU7XG4gICAgICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgY29sb3I6IGluaGVyaXQ7XG4gICAgICAgIGZvbnQtZmFtaWx5OiBNZW5kYSwgc2Fucy1zZXJpZjtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDIwcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMCU7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDMycHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICAgIHBhZGRpbmc6IDA7XG4gICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IHZhcmlhYmxlcy4kbWluU21hbGwpIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDI0cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgJjo6LXdlYmtpdC1pbm5lci1zcGluLWJ1dHRvbixcbiAgICAgICAgJjo6LXdlYmtpdC1vdXRlci1zcGluLWJ1dHRvbiB7XG4gICAgICAgICAgICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XG4gICAgICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIH1cblxuICAgICAgICAmW3R5cGU9XCJudW1iZXJcIl0ge1xuICAgICAgICAgICAgLW1vei1hcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7XG4gICAgICAgICAgICBhcHBlYXJhbmNlOiB0ZXh0ZmllbGQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19hbW91bnQtaW5wdXQ6OnBsYWNlaG9sZGVyIHtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICB9XG5cbiAgICAmX19iYWxhbmNlLXZhbHVlIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGdhcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZmxleC13cmFwOiB3cmFwO1xuICAgIH1cblxuICAgICZfX2JhbGFuY2UtdmFsdWUtbGFiZWwge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxMnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMTZweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjVweDtcbiAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgfVxuXG4gICAgJl9fZm9ybSB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBmbGV4LWdyb3c6IDE7XG4gICAgfVxuXG4gICAgLy8gRGV0YWlscyBzZWN0aW9uIGlzIGZsZXggYW5kIGdyb3dzOyBubyBmaXhlZCBtaW4taGVpZ2h0IHNvIGl0XG4gICAgLy8gY29sbGFwc2VzIGNsZWFubHkgd2hlbiB0aGVyZSdzIG5vIHF1b3RlIGxvYWRlZCB5ZXQuXG4gICAgJl9fZGV0YWlscyB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBmbGV4OiAxIDEgYXV0bztcbiAgICB9XG5cbiAgICAmX19kZXRhaWwtZmllbGQge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgIGdhcDogY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG5cbiAgICAgICAgJi0tZ3JheSB7XG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJi0tcHJpbWFyeSB7XG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fZGV0YWlscy1sYWJlbCB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDExcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygxNnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIG1hcmdpbjogMDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19kZXRhaWxzLXZhbHVlIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTFweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDE2cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC41cHg7XG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgIH1cblxuICAgICZfX3NldHRpbmdzIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgfVxuXG4gICAgJl9fc2V0dGluZ3MtYnV0dG9uIHtcbiAgICAgICAgbWluLXdpZHRoOiBjYWxjKDI2MHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIG1pbi1oZWlnaHQ6IGNhbGMoNDBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBoZWlnaHQ6IGNhbGMoNDBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cbn1cblxuLnN3YXAtbmV0d29yay1waWNrZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBnYXA6IGNhbGMoMTZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgIG1pbi1oZWlnaHQ6IDA7XG5cbiAgICAmX190aXRsZSB7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMjJweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICB9XG5cbiAgICAmX19zZWFyY2gge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX19saXN0IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiBjYWxjKDEwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICAgICAgZmxleDogMSAxIGF1dG87XG4gICAgICAgIG1heC1oZWlnaHQ6IGNhbGMoNTIwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgcGFkZGluZy1ib3R0b206IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgfVxuXG4gICAgJl9fcm93IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XG4gICAgICAgIGdhcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdCAhaW1wb3J0YW50O1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDE0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSAhaW1wb3J0YW50O1xuICAgICAgICBib3JkZXItcmFkaXVzOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSAhaW1wb3J0YW50O1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICBoZWlnaHQ6IGF1dG8gIWltcG9ydGFudDtcbiAgICAgICAgbWluLWhlaWdodDogY2FsYyg2NHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgfVxuXG4gICAgJl9fcm93LS1zZWxlY3RlZCB7XG4gICAgICAgIGJvcmRlci1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgYm94LXNoYWRvdzogMCAwIDAgMXB4IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgIH1cblxuICAgICZfX3Jvdy1tYWluIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IGNhbGMoMTJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX19uYW1lIHtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDE1cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX3VzZCB7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgIH1cblxuICAgICZfX2ljb25zIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKC02cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgcGFkZGluZy1sZWZ0OiBjYWxjKDJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX2ljb24ge1xuICAgICAgICB3aWR0aDogY2FsYygyMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGhlaWdodDogY2FsYygyMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgYm9yZGVyOiAycHggc29saWQgdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgIG9iamVjdC1maXQ6IGNvbnRhaW47XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgIH1cblxuICAgICZfX21vcmUge1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTFweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgbWFyZ2luLWxlZnQ6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgfVxufVxuXG4udG9vbHRpcC1jb250YWluZXIge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG5cbiAgICAmOmhvdmVyIC50b29sdGlwIHtcbiAgICAgICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbiAgICB9XG59XG5cbi50b29sdGlwIHtcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHotaW5kZXg6IDE7XG4gICAgdG9wOiAxMjUlO1xuICAgIGxlZnQ6IDUwJTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICBib3gtc2hhZG93OiAwcHggOHB4IDI0cHggMHB4IHZhcmlhYmxlcy4kdGhlbWVTaGFkb3c7XG5cbiAgICAmX19jb250ZW50IHtcbiAgICAgICAgd2lkdGg6IGNhbGMoMjU0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZ2FwOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgbWluLXdpZHRoOiAyNHB4O1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19jb250ZW50LXRleHQge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxMnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMTZweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjVweDtcbiAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }

}]);
//# sourceMappingURL=src_app_swap_swap_component_ts.js.map