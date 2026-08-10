"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["default-src_app_services_signing_service_ts"],{

/***/ 35079
/*!************************************!*\
  !*** ./shared/types/dapp.types.ts ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SUPPORTED_CHAINS: () => (/* binding */ SUPPORTED_CHAINS),
/* harmony export */   chainIdToHex: () => (/* binding */ chainIdToHex),
/* harmony export */   getChainConfig: () => (/* binding */ getChainConfig),
/* harmony export */   hexToChainId: () => (/* binding */ hexToChainId),
/* harmony export */   isSupportedChain: () => (/* binding */ isSupportedChain)
/* harmony export */ });
const SUPPORTED_CHAINS = [{
  chainId: 1,
  name: "Ethereum",
  symbol: "ETH",
  network: "ethereum",
  rpcUrl: "https://eth.llamarpc.com",
  blockExplorer: "https://etherscan.io"
}, {
  chainId: 42161,
  name: "Arbitrum One",
  symbol: "ETH",
  network: "arbitrum",
  rpcUrl: "https://arb1.arbitrum.io/rpc",
  blockExplorer: "https://arbiscan.io"
}, {
  chainId: 10,
  name: "Optimism",
  symbol: "ETH",
  network: "optimism",
  rpcUrl: "https://mainnet.optimism.io",
  blockExplorer: "https://optimistic.etherscan.io"
}, {
  chainId: 8453,
  name: "Base",
  symbol: "ETH",
  network: "base",
  rpcUrl: "https://mainnet.base.org",
  blockExplorer: "https://basescan.org"
}, {
  chainId: 43114,
  name: "Avalanche",
  symbol: "AVAX",
  network: "avalanche",
  rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
  blockExplorer: "https://avascan.info"
}, {
  chainId: 137,
  name: "Polygon",
  symbol: "POL",
  network: "polygon",
  rpcUrl: "https://polygon-rpc.com",
  blockExplorer: "https://polygonscan.com"
}, {
  chainId: 56,
  name: "BNB Chain",
  symbol: "BNB",
  network: "binance",
  rpcUrl: "https://bsc-dataseed.binance.org",
  blockExplorer: "https://bscscan.com"
}, {
  chainId: 1404,
  name: "BlockDAG",
  symbol: "BDAG",
  network: "blockdag",
  rpcUrl: "https://rpc.bdagscan.com",
  blockExplorer: "https://bdagscan.com"
}];
function getChainConfig(chainId) {
  return SUPPORTED_CHAINS.find(c => c.chainId === chainId);
}
function isSupportedChain(chainId) {
  return SUPPORTED_CHAINS.some(c => c.chainId === chainId);
}
function chainIdToHex(chainId) {
  return `0x${chainId.toString(16)}`;
}
function hexToChainId(hex) {
  return parseInt(hex, 16);
}

/***/ },

/***/ 98795
/*!*********************************************************!*\
  !*** ./src/app/services/dapp-gas-estimation.service.ts ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DappGasEstimationService: () => (/* binding */ DappGasEstimationService)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ethers */ 27471);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ethers */ 90374);
/* harmony import */ var _shared_types_dapp_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @shared/types/dapp.types */ 35079);
/* harmony import */ var _shared_utils_evm_chain_key_util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @shared/utils/evm-chain-key.util */ 89685);
/* harmony import */ var environments_environment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var app_services_rpc_provider_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! app/services/rpc-provider.service */ 55849);







const BLOCKDAG_CHAIN_ID = 1404;
const MIN_GAS_PRICE_WEI = BigInt(1e9);
const BLOCKDAG_MIN_GAS_PRICE_WEI = BigInt(500e9);
const SAFE_RPC_FEE_CAP_WEI = BigInt("900000000000000000");
const MAX_CEILING_MULTIPLIER = 10n;
const PRIORITY_MULTIPLIER_NATIVE = 3n;
class DappGasEstimationService {
  _rpcProvider;
  _providerByRpcUrl = new Map();
  constructor(_rpcProvider) {
    this._rpcProvider = _rpcProvider;
  }
  resolveRpcUrl(chainId, network) {
    const chainConfig = typeof chainId === "number" ? (0,_shared_types_dapp_types__WEBPACK_IMPORTED_MODULE_3__.getChainConfig)(chainId) : undefined;
    if (chainConfig?.rpcUrl) {
      return chainConfig.rpcUrl;
    }
    switch ((network || "").toLowerCase()) {
      case "ethereum":
        return environments_environment__WEBPACK_IMPORTED_MODULE_5__.environment.ethereumRpc.mainnet;
      case "arbitrum":
        return "https://arb1.arbitrum.io/rpc";
      case "optimism":
        return "https://mainnet.optimism.io";
      case "base":
        return "https://mainnet.base.org";
      case "avalanche":
        return environments_environment__WEBPACK_IMPORTED_MODULE_5__.environment.avalancheRpc.mainnet;
      case "polygon":
        return environments_environment__WEBPACK_IMPORTED_MODULE_5__.environment.polygonRpc.mainnet;
      case "bsc":
      case "binance":
        return environments_environment__WEBPACK_IMPORTED_MODULE_5__.environment.binanceRpc.mainnet;
      case "blockdag":
        return "https://rpc.bdagscan.com";
      default:
        return environments_environment__WEBPACK_IMPORTED_MODULE_5__.environment.ethereumRpc.mainnet;
    }
  }
  _resolveJsonRpcProvider(chainId, network) {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (typeof chainId === "number") {
        const key = (0,_shared_utils_evm_chain_key_util__WEBPACK_IMPORTED_MODULE_4__.getChainKeyFromChainId)(chainId);
        if (key) {
          return _this._rpcProvider.getEthersProvider(key, {
            allowDirectFallback: (0,_shared_utils_evm_chain_key_util__WEBPACK_IMPORTED_MODULE_4__.allowDirectFallbackForChainKey)(key)
          });
        }
      }
      return _this._getProvider(_this.resolveRpcUrl(chainId, network));
    })();
  }
  estimateTransactionFee(params, fromAddress) {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const provider = yield _this2._resolveJsonRpcProvider(params.chainId, params.network);
      const txRequest = _this2._buildTransactionRequest(params, fromAddress);
      const gasLimit = yield _this2._resolveGasLimit(provider, txRequest, params.gasLimit);
      const feeConfig = yield _this2._resolveFeeConfig(provider, params, gasLimit);
      const effectiveGasPrice = feeConfig.gasPrice ?? feeConfig.maxFeePerGas ?? feeConfig.maxPriorityFeePerGas ?? 0n;
      const totalFeeWei = gasLimit * effectiveGasPrice;
      return {
        gasLimit,
        totalFeeWei,
        formattedFee: ethers__WEBPACK_IMPORTED_MODULE_1__.formatEther(totalFeeWei),
        gasPrice: feeConfig.gasPrice,
        maxFeePerGas: feeConfig.maxFeePerGas,
        maxPriorityFeePerGas: feeConfig.maxPriorityFeePerGas
      };
    })();
  }
  prepareTransactionForBroadcast(params, fromAddress) {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (params.chainId !== BLOCKDAG_CHAIN_ID) {
        return params;
      }
      try {
        const provider = yield _this3._resolveJsonRpcProvider(params.chainId, params.network);
        const rpcGasPrice = yield _this3._getLegacyGasPrice(provider);
        const baseGasPrice = rpcGasPrice < BLOCKDAG_MIN_GAS_PRICE_WEI ? BLOCKDAG_MIN_GAS_PRICE_WEI : rpcGasPrice;
        return {
          ...params,
          gasPrice: baseGasPrice.toString(),
          maxFeePerGas: undefined,
          maxPriorityFeePerGas: undefined
        };
      } catch (error) {
        console.warn("BlockDAG gas price fetch failed, using fallback gas price:", error);
        return {
          ...params,
          gasPrice: BLOCKDAG_MIN_GAS_PRICE_WEI.toString(),
          maxFeePerGas: undefined,
          maxPriorityFeePerGas: undefined
        };
      }
    })();
  }
  _buildTransactionRequest(params, fromAddress) {
    const txRequest = {
      chainId: params.chainId,
      data: params.data || "0x"
    };
    if (params.to) {
      txRequest.to = params.to;
    }
    if (fromAddress) {
      txRequest.from = fromAddress;
    }
    if (params.value && params.value !== "0" && params.value !== "0x0") {
      txRequest.value = BigInt(params.value);
    }
    return txRequest;
  }
  _getProvider(rpcUrl) {
    const cached = this._providerByRpcUrl.get(rpcUrl);
    if (cached) {
      return cached;
    }
    const needsNoBatch = rpcUrl.includes("bdagscan.com");
    const provider = new ethers__WEBPACK_IMPORTED_MODULE_2__.JsonRpcProvider(rpcUrl, undefined, needsNoBatch ? {
      batchMaxCount: 1
    } : undefined);
    this._providerByRpcUrl.set(rpcUrl, provider);
    return provider;
  }
  _resolveGasLimit(provider, txRequest, providedGasLimit) {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (providedGasLimit) {
        return BigInt(providedGasLimit);
      }
      try {
        const estimated = yield provider.estimateGas(txRequest);
        return estimated * 110n / 100n;
      } catch {
        return _this4._fallbackGasLimit(txRequest);
      }
    })();
  }
  _fallbackGasLimit(txRequest) {
    const hasData = Boolean(txRequest.data && txRequest.data !== "0x");
    const hasValue = txRequest.value != null && txRequest.value !== 0n;
    if (hasData) {
      return 200000n;
    }
    if (hasValue) {
      return 21000n;
    }
    return 100000n;
  }
  _resolveFeeConfig(provider, params, gasLimit) {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (params.chainId === BLOCKDAG_CHAIN_ID) {
        const gasPrice = yield _this5._resolveBlockdagGasPrice(provider, gasLimit, params);
        return {
          gasPrice
        };
      }
      if (params.maxFeePerGas || params.maxPriorityFeePerGas) {
        return {
          maxFeePerGas: params.maxFeePerGas ? BigInt(params.maxFeePerGas) : undefined,
          maxPriorityFeePerGas: params.maxPriorityFeePerGas ? BigInt(params.maxPriorityFeePerGas) : undefined
        };
      }
      if (params.gasPrice) {
        return {
          gasPrice: BigInt(params.gasPrice)
        };
      }
      const feeData = yield provider.getFeeData();
      if (feeData.maxFeePerGas || feeData.maxPriorityFeePerGas) {
        return {
          maxFeePerGas: feeData.maxFeePerGas ?? undefined,
          maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ?? undefined
        };
      }
      return {
        gasPrice: feeData.gasPrice ?? MIN_GAS_PRICE_WEI
      };
    })();
  }
  _resolveBlockdagGasPrice(provider, gasLimit, params) {
    var _this6 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      let rpcGasPrice = yield _this6._getLegacyGasPrice(provider);
      if (rpcGasPrice < MIN_GAS_PRICE_WEI) {
        rpcGasPrice = MIN_GAS_PRICE_WEI;
      }
      const baseGasPrice = rpcGasPrice < BLOCKDAG_MIN_GAS_PRICE_WEI ? BLOCKDAG_MIN_GAS_PRICE_WEI : rpcGasPrice;
      const dynamicCeiling = baseGasPrice * MAX_CEILING_MULTIPLIER;
      const recommendedGasPrice = _this6._capGasPriceForFeeLimit(gasLimit, _this6._minBigInt(dynamicCeiling, baseGasPrice * 110n * PRIORITY_MULTIPLIER_NATIVE / 100n));
      const providedGasPrice = _this6._readProvidedBlockdagGasPrice(params);
      if (providedGasPrice == null) {
        return recommendedGasPrice;
      }
      const sanitizedProvided = providedGasPrice < MIN_GAS_PRICE_WEI ? MIN_GAS_PRICE_WEI : providedGasPrice;
      return _this6._capGasPriceForFeeLimit(gasLimit, _this6._maxBigInt(sanitizedProvided, recommendedGasPrice));
    })();
  }
  _getLegacyGasPrice(provider) {
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const hex = yield provider.send("eth_gasPrice", []);
        return BigInt(hex);
      } catch {
        try {
          const feeData = yield provider.getFeeData();
          return feeData.gasPrice ?? feeData.maxPriorityFeePerGas ?? MIN_GAS_PRICE_WEI;
        } catch {
          return MIN_GAS_PRICE_WEI;
        }
      }
    })();
  }
  _readProvidedBlockdagGasPrice(params) {
    const raw = params.gasPrice || params.maxFeePerGas || params.maxPriorityFeePerGas;
    if (!raw) {
      return null;
    }
    try {
      return BigInt(raw);
    } catch {
      return null;
    }
  }
  _capGasPriceForFeeLimit(gasLimit, gasPrice) {
    if (gasLimit <= 0n) {
      return gasPrice;
    }
    const maxGasPrice = SAFE_RPC_FEE_CAP_WEI / gasLimit;
    return gasPrice > maxGasPrice ? maxGasPrice : gasPrice;
  }
  _maxBigInt(left, right) {
    return left > right ? left : right;
  }
  _minBigInt(left, right) {
    return left < right ? left : right;
  }
  static ɵfac = function DappGasEstimationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DappGasEstimationService)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵinject"](app_services_rpc_provider_service__WEBPACK_IMPORTED_MODULE_7__.RpcProviderService));
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjectable"]({
    token: DappGasEstimationService,
    factory: DappGasEstimationService.ɵfac,
    providedIn: "root"
  });
}

/***/ },

/***/ 92121
/*!*********************************************!*\
  !*** ./src/app/services/signing.service.ts ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SigningService: () => (/* binding */ SigningService)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ethers */ 29929);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ethers */ 71932);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ethers */ 61889);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ethers */ 43666);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ethers */ 90374);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ethers */ 27471);
/* harmony import */ var _shared_utils_evm_chain_key_util__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @shared/utils/evm-chain-key.util */ 89685);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _blockchain_transactions_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./blockchain-transactions.service */ 56122);
/* harmony import */ var _dapp_gas_estimation_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./dapp-gas-estimation.service */ 98795);
/* harmony import */ var _rpc_provider_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./rpc-provider.service */ 55849);
/* harmony import */ var _vault_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../vault.service */ 19519);
/* harmony import */ var _wallet_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../wallet.service */ 69556);









const CHAIN_ID_TO_NETWORK = {
  1: "ethereum",
  10: "ethereum",
  42161: "ethereum",
  8453: "ethereum",
  43114: "avalanche",
  137: "polygon",
  56: "binance",
  1404: "blockdag"
};
const NETWORK_TO_CHAIN_ID = {
  ethereum: 1,
  avalanche: 43114,
  polygon: 137,
  binance: 56,
  blockdag: 1404
};
class SigningService {
  _blockchainTransactionsService;
  _dappGasEstimation;
  _rpcProvider;
  _vaultService;
  _walletService;
  constructor(_blockchainTransactionsService, _dappGasEstimation, _rpcProvider, _vaultService, _walletService) {
    this._blockchainTransactionsService = _blockchainTransactionsService;
    this._dappGasEstimation = _dappGasEstimation;
    this._rpcProvider = _rpcProvider;
    this._vaultService = _vaultService;
    this._walletService = _walletService;
  }
  static getNetworkFromChainId(chainId) {
    return CHAIN_ID_TO_NETWORK[chainId] || null;
  }
  static getChainIdFromNetwork(network) {
    return NETWORK_TO_CHAIN_ID[network.toLowerCase()] || null;
  }
  static getSupportedChainIds() {
    return Object.keys(CHAIN_ID_TO_NETWORK).map(Number);
  }
  static getSupportedEipChains() {
    return Object.keys(CHAIN_ID_TO_NETWORK).map(id => `eip155:${id}`);
  }
  static isEvmNetwork(network) {
    return ["ethereum", "avalanche", "polygon", "binance", "blockdag", "optimism", "arbitrum", "base"].includes(network.toLowerCase());
  }
  deriveEvmKey(mnemonic) {
    const wallet = ethers__WEBPACK_IMPORTED_MODULE_1__.Wallet.fromPhrase(mnemonic.trim().toLowerCase());
    return {
      privateKey: wallet.privateKey,
      address: wallet.address
    };
  }
  signEvmTransaction(mnemonic, txParams) {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const cleanMnemonic = mnemonic.trim().toLowerCase();
      if (!ethers__WEBPACK_IMPORTED_MODULE_2__.Mnemonic.isValidMnemonic(cleanMnemonic)) {
        throw new Error("Invalid mnemonic");
      }
      const {
        privateKey,
        address
      } = _this.deriveEvmKey(cleanMnemonic);
      const params = {
        from: address,
        to: txParams.to,
        value: txParams.value || "0",
        network: txParams.network,
        privateKey,
        data: txParams.data,
        chainId: txParams.chainId
      };
      if (txParams.data && txParams.data !== "0x") {
        params.data = txParams.data;
      }
      return _this._blockchainTransactionsService.sendTransaction(params);
    })();
  }
  signMessage(mnemonic, params) {
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const cleanMnemonic = mnemonic.trim().toLowerCase();
      if (!ethers__WEBPACK_IMPORTED_MODULE_2__.Mnemonic.isValidMnemonic(cleanMnemonic)) {
        throw new Error("Invalid mnemonic");
      }
      const wallet = ethers__WEBPACK_IMPORTED_MODULE_1__.Wallet.fromPhrase(cleanMnemonic);
      switch (params.method) {
        case "personal_sign":
          {
            const message = params.message.startsWith("0x") ? ethers__WEBPACK_IMPORTED_MODULE_3__.toUtf8String(ethers__WEBPACK_IMPORTED_MODULE_4__.getBytes(params.message)) : params.message;
            const signature = yield wallet.signMessage(message);
            return {
              signature
            };
          }
        case "eth_signTypedData_v4":
          {
            const typedData = JSON.parse(params.message);
            const {
              domain,
              types,
              message,
              primaryType
            } = typedData;
            const filteredTypes = {
              ...types
            };
            delete filteredTypes.EIP712Domain;
            const signature = yield wallet.signTypedData(domain, filteredTypes, message);
            return {
              signature
            };
          }
        case "eth_sign":
          {
            const messageBytes = ethers__WEBPACK_IMPORTED_MODULE_4__.getBytes(params.message);
            const signature = yield wallet.signMessage(messageBytes);
            return {
              signature
            };
          }
        default:
          throw new Error(`Unsupported signing method: ${params.method}`);
      }
    })();
  }
  signRawTransaction(mnemonic, txParams) {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const cleanMnemonic = mnemonic.trim().toLowerCase();
      const wallet = ethers__WEBPACK_IMPORTED_MODULE_1__.Wallet.fromPhrase(cleanMnemonic);
      const preparedTxParams = yield _this2._dappGasEstimation.prepareTransactionForBroadcast(txParams, wallet.address);
      const tx = {
        to: preparedTxParams.to,
        value: preparedTxParams.value ? BigInt(preparedTxParams.value) : 0n,
        data: preparedTxParams.data || "0x",
        chainId: preparedTxParams.chainId
      };
      if (preparedTxParams.gasLimit) tx.gasLimit = BigInt(preparedTxParams.gasLimit);
      if (preparedTxParams.gasPrice) tx.gasPrice = BigInt(preparedTxParams.gasPrice);
      if (preparedTxParams.maxFeePerGas) tx.maxFeePerGas = BigInt(preparedTxParams.maxFeePerGas);
      if (preparedTxParams.maxPriorityFeePerGas) tx.maxPriorityFeePerGas = BigInt(preparedTxParams.maxPriorityFeePerGas);
      if (preparedTxParams.nonce !== undefined) tx.nonce = preparedTxParams.nonce;
      return wallet.signTransaction(tx);
    })();
  }
  sendTransaction(mnemonic, txParams) {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const network = txParams.network.toLowerCase();
      if (SigningService.isEvmNetwork(network)) {
        return _this3.sendEvmTransactionNative(mnemonic, txParams);
      }
      const params = {
        from: "",
        to: txParams.to,
        value: txParams.value || "0",
        network,
        mnemonic: mnemonic.trim().toLowerCase()
      };
      return _this3._blockchainTransactionsService.sendTransaction(params);
    })();
  }
  decryptMnemonic(wallet, password) {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!wallet?.pgp?.encryptedMessage || !wallet?.pgp?.privateKey || !password) {
        return null;
      }
      const raw = yield _this4._vaultService.decryptMessage(wallet.pgp.encryptedMessage, wallet.pgp.privateKey, password);
      const secret = JSON.parse(raw);
      return secret.mnemonic?.trim()?.toLowerCase() || null;
    })();
  }
  decryptMnemonicOnce(wallet, password) {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!wallet?.pgp?.encryptedMessage || !wallet?.pgp?.privateKey || !password) {
        return null;
      }
      const raw = yield _this5._vaultService.oneTimeDecryptMessage(wallet.pgp.encryptedMessage, wallet.pgp.privateKey, password);
      const secret = JSON.parse(raw);
      return secret.mnemonic?.trim()?.toLowerCase() || null;
    })();
  }
  getAccountsForWallet(wallet) {
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const accounts = [];
      if (wallet?.publicData?.ethAddress) {
        accounts.push(wallet.publicData.ethAddress);
      }
      return accounts;
    })();
  }
  getAllWalletAccounts() {
    var _this6 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const current = yield _this6._walletService.getCurrentWallet();
      const others = yield _this6._walletService.getWalletsFromStorage();
      const allWallets = [];
      if (current?.publicData?.ethAddress) allWallets.push(current);
      allWallets.push(...others.filter(w => w.publicData?.ethAddress));
      const seen = new Set();
      return allWallets.filter(w => {
        const addr = w.publicData?.ethAddress?.toLowerCase();
        if (!addr || seen.has(addr)) return false;
        seen.add(addr);
        return true;
      }).map(w => ({
        tagName: w.publicData?.tagName || w.fullTagName || "",
        address: w.publicData?.ethAddress || "",
        wallet: w
      }));
    })();
  }
  sendEvmTransactionNative(mnemonic, txParams) {
    var _this7 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const cleanMnemonic = mnemonic.trim().toLowerCase();
      const network = txParams.network.toLowerCase();
      const baseWallet = ethers__WEBPACK_IMPORTED_MODULE_1__.Wallet.fromPhrase(cleanMnemonic);
      const preparedTxParams = yield _this7._dappGasEstimation.prepareTransactionForBroadcast(txParams, baseWallet.address);
      const chainId = preparedTxParams.chainId;
      const key = typeof chainId === "number" ? (0,_shared_utils_evm_chain_key_util__WEBPACK_IMPORTED_MODULE_7__.getChainKeyFromChainId)(chainId) : null;
      const provider = key ? yield _this7._rpcProvider.getEthersProvider(key, {
        allowDirectFallback: (0,_shared_utils_evm_chain_key_util__WEBPACK_IMPORTED_MODULE_7__.allowDirectFallbackForChainKey)(key)
      }) : new ethers__WEBPACK_IMPORTED_MODULE_5__.JsonRpcProvider(_this7._dappGasEstimation.resolveRpcUrl(preparedTxParams.chainId, network));
      const wallet = baseWallet.connect(provider);
      const tx = {
        to: preparedTxParams.to,
        value: preparedTxParams.value ? BigInt(preparedTxParams.value) : 0n,
        data: preparedTxParams.data || "0x",
        chainId: preparedTxParams.chainId
      };
      if (preparedTxParams.gasLimit) tx.gasLimit = BigInt(preparedTxParams.gasLimit);
      if (preparedTxParams.gasPrice) tx.gasPrice = BigInt(preparedTxParams.gasPrice);
      if (preparedTxParams.maxFeePerGas) tx.maxFeePerGas = BigInt(preparedTxParams.maxFeePerGas);
      if (preparedTxParams.maxPriorityFeePerGas) tx.maxPriorityFeePerGas = BigInt(preparedTxParams.maxPriorityFeePerGas);
      if (preparedTxParams.nonce !== undefined) tx.nonce = preparedTxParams.nonce;
      if (preparedTxParams.chainId === 1404) {
        tx.type = 0;
        delete tx.maxFeePerGas;
        delete tx.maxPriorityFeePerGas;
        if (!tx.gasPrice) {
          tx.gasPrice = BigInt(500e9);
        }
      }
      try {
        try {
          const balanceWei = yield provider.getBalance(baseWallet.address);
          console.log("[EVM send] balance before send", {
            chainId: preparedTxParams.chainId,
            address: baseWallet.address,
            balanceWei: balanceWei.toString(),
            balanceEther: ethers__WEBPACK_IMPORTED_MODULE_6__.formatEther(balanceWei)
          });
        } catch (balanceErr) {
          console.warn("[EVM send] getBalance before send failed:", balanceErr);
        }
        const txResponse = yield wallet.sendTransaction(tx);
        return {
          hash: txResponse.hash,
          status: "pending"
        };
      } catch (error) {
        console.error("Direct EVM Transaction Failed:", error);
        throw error;
      }
    })();
  }
  static ɵfac = function SigningService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SigningService)(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵinject"](_blockchain_transactions_service__WEBPACK_IMPORTED_MODULE_9__.BlockchainTransactionsService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵinject"](_dapp_gas_estimation_service__WEBPACK_IMPORTED_MODULE_10__.DappGasEstimationService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵinject"](_rpc_provider_service__WEBPACK_IMPORTED_MODULE_11__.RpcProviderService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵinject"](_vault_service__WEBPACK_IMPORTED_MODULE_12__.VaultService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵinject"](_wallet_service__WEBPACK_IMPORTED_MODULE_13__.WalletService));
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineInjectable"]({
    token: SigningService,
    factory: SigningService.ɵfac,
    providedIn: "root"
  });
}

/***/ }

}]);
//# sourceMappingURL=default-src_app_services_signing_service_ts.js.map