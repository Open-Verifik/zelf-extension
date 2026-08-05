"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["default-src_app_solana_service_ts"],{

/***/ 98010
/*!***********************************!*\
  !*** ./src/app/solana.service.ts ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SolanaService: () => (/* binding */ SolanaService)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _solana_spl_token__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/spl-token */ 53949);
/* harmony import */ var _solana_spl_token__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/spl-token */ 65408);
/* harmony import */ var _solana_spl_token__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @solana/spl-token */ 3224);
/* harmony import */ var _solana_spl_token__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @solana/spl-token */ 52093);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @solana/web3.js */ 47647);
/* harmony import */ var bip39__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! bip39 */ 74785);
/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! buffer */ 163);
/* harmony import */ var micro_key_producer_slip10_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! micro-key-producer/slip10.js */ 27354);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var environments_environment__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common/http */ 63855);
/* harmony import */ var _http_wrapper_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./http-wrapper.service */ 84099);
/* harmony import */ var app_services_rpc_provider_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! app/services/rpc-provider.service */ 55849);












if (typeof window !== "undefined") window.Buffer = window.Buffer || buffer__WEBPACK_IMPORTED_MODULE_7__.Buffer;
class SolanaService {
  http;
  _httpWrapper;
  _rpcProvider;
  _baseUrl = environments_environment__WEBPACK_IMPORTED_MODULE_10__.environment.apiUrl;
  /** All RPC calls: `POST /api/protected/rpc/solana` + JWT when session is available. */
  _connectionReady;
  tokens = [];
  constructor(http, _httpWrapper, _rpcProvider) {
    this.http = http;
    this._httpWrapper = _httpWrapper;
    this._rpcProvider = _rpcProvider;
    this._connectionReady = this._rpcProvider.getSolanaConnection();
  }
  /** ZNS SPL token mint on Solana mainnet */
  static ZNS_MINT_ADDRESS = "GfF6PSkH8bKLkws5RMFdzgASwcVbgCfhhKfp8zeoFBkx";
  /** Solana RPC (Zelf protected proxy + JWT, or direct fallback). */
  getConnection() {
    return this._connectionReady;
  }
  /**
   * Get ZNS token balance for a wallet via Solana RPC.
   * ownerAddress = the holder's Solana wallet (the one that holds the tokens), not the minter.
   * Uses getTokenAccountsByOwner to find any token account holding ZNS for this wallet.
   * Tries legacy SPL Token (mint filter) then Token-2022 (list all, filter by mint).
   */
  getZnsBalanceViaRpc(ownerAddress) {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const connection = yield _this._connectionReady;
        const mint = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.PublicKey(SolanaService.ZNS_MINT_ADDRESS);
        const owner = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.PublicKey(ownerAddress);
        const mintStr = SolanaService.ZNS_MINT_ADDRESS;
        const tryBalance = /*#__PURE__*/function () {
          var _ref = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (accountPubkey) {
            const balance = yield connection.getTokenAccountBalance(accountPubkey);
            const amount = balance?.value?.uiAmount ?? 0;
            return typeof amount === "number" ? amount : parseFloat(String(amount)) || 0;
          });
          return function tryBalance(_x) {
            return _ref.apply(this, arguments);
          };
        }();
        const responseLegacy = yield connection.getTokenAccountsByOwner(owner, {
          mint
        });
        if (responseLegacy.value.length > 0) {
          return tryBalance(responseLegacy.value[0].pubkey);
        }
        const parsed2022 = yield connection.getParsedTokenAccountsByOwner(owner, {
          programId: _solana_spl_token__WEBPACK_IMPORTED_MODULE_1__.TOKEN_2022_PROGRAM_ID
        });
        for (const item of parsed2022.value) {
          const info = item.account?.data?.parsed?.info;
          if (info?.mint === mintStr) {
            return tryBalance(item.pubkey);
          }
        }
        return 0;
      } catch (error) {
        const msg = error?.message ?? String(error);
        if (msg.includes("could not find account") || msg.includes("Invalid param")) {
          return 0;
        }
        console.warn("Solana RPC ZNS balance error:", error);
        return 0;
      }
    })();
  }
  _defaultResponse() {
    return {
      data: {
        _balance: 0,
        balance: "0",
        fiatBalance: "0",
        account: {
          asset: "SOL",
          price: "0"
        },
        tokenHoldings: {
          tokens: []
        }
      }
    };
  }
  getSolanaAccount(mnemonic) {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      return _this2._getKeypairFromMnemonic(mnemonic);
    })();
  }
  _getKeypairFromMnemonic(mnemonic) {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this3._validateMnemonic(mnemonic)) throw new Error("Invalid mnemonic phrase");
      try {
        const seed = bip39__WEBPACK_IMPORTED_MODULE_6__.mnemonicToSeedSync(mnemonic, "");
        const hd = micro_key_producer_slip10_js__WEBPACK_IMPORTED_MODULE_8__["default"].fromMasterSeed(seed.toString("hex"));
        const keypair = _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.Keypair.fromSeed(hd.derive("m/44'/501'/0'/0'").privateKey);
        return keypair;
      } catch (error) {
        throw error;
      }
    })();
  }
  /**
   * Polls getSignatureStatuses (HTTP only) until confirmed/finalized or timeout.
   * Avoids WebSocket signatureSubscribe which fails when the RPC endpoint is HTTP-only.
   */
  _waitForConfirmation(_x2, _x3) {
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (connection, signature, timeoutMs = 60_000) {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        const {
          value
        } = yield connection.getSignatureStatuses([signature], {
          searchTransactionHistory: false
        });
        const status = value?.[0];
        if (status) {
          if (status.err) throw new Error(`Transaction failed on-chain: ${JSON.stringify(status.err)}`);
          if (status.confirmationStatus === "confirmed" || status.confirmationStatus === "finalized") return;
        }
        yield new Promise(r => setTimeout(r, 2000));
      }
      throw new Error("Transaction confirmation timed out after 60 seconds");
    }).apply(this, arguments);
  }
  _sendSOL(connection, fromKeypair, toAddress, amount) {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const walletBalance = yield connection.getBalance(fromKeypair.publicKey);
        const lamports = Math.floor(amount * _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.LAMPORTS_PER_SOL);
        const estimatedFee = yield _this4.getTransactionCost();
        if (walletBalance < lamports + Number(estimatedFee.estimatedGas)) {
          throw new Error(`Insufficient funds. Required: ${(lamports + Number(estimatedFee.estimatedGas)) / _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.LAMPORTS_PER_SOL} SOL, Available: ${walletBalance / _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.LAMPORTS_PER_SOL} SOL`);
        }
        const transaction = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.Transaction();
        transaction.add(_solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 500000
        }));
        transaction.add(_solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: new _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.PublicKey(toAddress),
          lamports: lamports
        }));
        const {
          blockhash
        } = yield connection.getLatestBlockhash("confirmed");
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromKeypair.publicKey;
        transaction.sign(fromKeypair);
        const signature = yield connection.sendRawTransaction(transaction.serialize(), {
          skipPreflight: false,
          maxRetries: 3
        });
        yield _this4._waitForConfirmation(connection, signature);
        return signature;
      } catch (error) {
        console.error("SOL transfer failed:", error);
        throw error;
      }
    })();
  }
  _sendSPLTokens(params) {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const connection = yield _this5._connectionReady;
        const fromKeypair = params.fromPubKey;
        const mint = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.PublicKey(params.mintAddress);
        const recipientAddress = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.PublicKey(params.toAddress);
        const senderTokenAccount = yield (0,_solana_spl_token__WEBPACK_IMPORTED_MODULE_2__.getAssociatedTokenAddress)(mint, fromKeypair.publicKey);
        const recipientTokenAccount = yield (0,_solana_spl_token__WEBPACK_IMPORTED_MODULE_2__.getAssociatedTokenAddress)(mint, recipientAddress);
        const tokenInfo = yield connection.getParsedAccountInfo(mint);
        if (!tokenInfo.value) throw new Error("Token not found");
        const decimals = tokenInfo.value.data.parsed.info.decimals;
        const amountInTokenUnits = Math.floor(params.amount * Math.pow(10, decimals));
        const tokenBalance = yield connection.getTokenAccountBalance(senderTokenAccount);
        if (!tokenBalance.value || Number(tokenBalance.value.amount) < amountInTokenUnits) {
          throw new Error(`Insufficient token balance. Required: ${params.amount}, Available: ${tokenBalance.value ? Number(tokenBalance.value.amount) / Math.pow(10, decimals) : 0}`);
        }
        const transaction = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.Transaction();
        transaction.add(_solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 500000
        }));
        const recipientTokenAccountInfo = yield connection.getAccountInfo(recipientTokenAccount);
        if (!recipientTokenAccountInfo) {
          transaction.add((0,_solana_spl_token__WEBPACK_IMPORTED_MODULE_3__.createAssociatedTokenAccountInstruction)(fromKeypair.publicKey, recipientTokenAccount, recipientAddress, mint));
        }
        transaction.add((0,_solana_spl_token__WEBPACK_IMPORTED_MODULE_4__.createTransferInstruction)(senderTokenAccount, recipientTokenAccount, fromKeypair.publicKey, amountInTokenUnits));
        const walletBalance = yield connection.getBalance(fromKeypair.publicKey);
        const gasEstimate = 510000; // Prioritization fee (500k) + Base fee (10k)
        const senderRent = yield connection.getMinimumBalanceForRentExemption(0);
        let totalNeededSOL = gasEstimate + senderRent;
        if (!recipientTokenAccountInfo) {
          const ataRent = yield connection.getMinimumBalanceForRentExemption(165);
          totalNeededSOL += ataRent;
        }
        if (walletBalance < totalNeededSOL) throw new Error("errors.solana_insufficient_sol_for_fees");
        const {
          blockhash
        } = yield connection.getLatestBlockhash("confirmed");
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromKeypair.publicKey;
        transaction.sign(fromKeypair);
        const signature = yield connection.sendRawTransaction(transaction.serialize(), {
          skipPreflight: false,
          maxRetries: 3
        });
        yield _this5._waitForConfirmation(connection, signature);
        return signature;
      } catch (error) {
        console.error("SPL token transfer failed:", error);
        if (error.logs) {
          console.error("Solana transaction logs:", error.logs);
        } else if (typeof error.getLogs === "function") {
          console.error("Solana transaction logs (from getLogs):", error.getLogs());
        }
        const errorMsg = error.message || "";
        if (errorMsg.includes("insufficient funds for rent") || errorMsg.includes("insufficient lamports")) {
          throw new Error("errors.solana_insufficient_sol_for_rent");
        }
        throw error;
      }
    })();
  }
  _sendTokens(mnemonic, toAddress, tokenAddress, amount) {
    var _this6 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const connection = yield _this6._connectionReady;
        const fromKeypair = yield _this6._getKeypairFromMnemonic(mnemonic);
        if (tokenAddress) {
          return _this6._sendSPLTokens({
            fromPubKey: fromKeypair,
            toAddress,
            mintAddress: tokenAddress,
            amount
          });
        } else {
          return _this6._sendSOL(connection, fromKeypair, toAddress, amount);
        }
      } catch (error) {
        console.error("Error sending tokens:", error);
        throw error;
      }
    })();
  }
  _validateMnemonic(mnemonic) {
    return bip39__WEBPACK_IMPORTED_MODULE_6__.validateMnemonic(mnemonic);
  }
  calculateTransactionFees(tokenAddress, amount, tokenPrice) {
    var _this7 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const feeEstimate = yield _this7.getTransactionCost(tokenAddress);
      const amountInUsd = amount * tokenPrice;
      const fee = typeof feeEstimate.gasPrice === "number" ? feeEstimate.gasPrice : parseFloat(feeEstimate.gasPrice || "0");
      const fiatFee = typeof feeEstimate.fiatFee === "number" ? feeEstimate.fiatFee : parseFloat(feeEstimate.fiatFee || "0");
      return {
        fee,
        fiatFee,
        total: amountInUsd + fiatFee
      };
    })();
  }
  getSolPrice() {
    var _this8 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const response = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.firstValueFrom)(_this8.http.get("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"));
        if (response && response.solana && response.solana.usd) return response.solana.usd;
        console.warn("Could not fetch SOL price, using default value");
        return 150;
      } catch (error) {
        console.error("Error fetching SOL price:", error);
        return 150;
      }
    })();
  }
  getTransactionCost(tokenAddress) {
    var _this9 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const baseCostLamports = tokenAddress ? 10000 : 5000;
        const prioritizationFee = 500000;
        const computeUnits = tokenAddress ? 200000 : 150000;
        const prioritizationFeeLamports = prioritizationFee * computeUnits / 1000000;
        const totalLamports = baseCostLamports + prioritizationFeeLamports;
        const totalCostSOL = totalLamports / _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.LAMPORTS_PER_SOL;
        let solPriceUSD = 0;
        try {
          const response = yield _this9.http.get("https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd").toPromise();
          solPriceUSD = response?.solana?.usd || 0;
        } catch (error) {
          console.warn("Failed to fetch SOL price, using 0 for fiat conversion", error);
        }
        const fiatFee = totalCostSOL * solPriceUSD;
        return {
          estimatedGas: Math.round(totalLamports),
          fiatFee: fiatFee,
          gasPrice: totalCostSOL.toString(),
          totalCost: totalCostSOL.toString()
        };
      } catch (error) {
        console.error("Error getting Solana transaction cost:", error);
        const baseFee = 0.00005;
        return {
          estimatedGas: 50000,
          fiatFee: baseFee,
          gasPrice: baseFee.toString(),
          totalCost: baseFee.toString()
        };
      }
    })();
  }
  /**
   * Get Solana address details (balance, tokenHoldings, etc.) from the backend.
   * @param address - Solana wallet address
   * @param params - Optional query params, e.g. { source: 'oklink' } to force OKLink
   */
  getWalletDetails(address, params) {
    var _this0 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const url = `${_this0._baseUrl}/api/solana/address/${address}`;
      try {
        return _this0._httpWrapper.sendRequest("get", url, params ?? {}).then(response => response).catch(() => _this0._defaultResponse());
      } catch (error) {
        console.error("Exception in Solana getWalletDetails:", error);
        return Promise.resolve(_this0._defaultResponse());
      }
    })();
  }
  checkIfValidAddress(address) {
    return this.isValidSolanaAddress(address);
  }
  isValidSolanaAddress(address) {
    try {
      if (!address) return false;
      const publicKey = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.PublicKey(address);
      return _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.PublicKey.isOnCurve(publicKey);
    } catch (error) {
      return false;
    }
  }
  requestTransactionDetails(transactionHash) {
    var _this1 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      return _this1._httpWrapper.sendRequest("get", `${_this1._baseUrl}/api/solana/transaction/${transactionHash}`);
    })();
  }
  requestTransactionHistory(address, pagination) {
    var _this10 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const url = `${_this10._baseUrl}/api/solana/transactions/${address}`;
      const params = {
        page: pagination.page,
        show: pagination.show || 25
      };
      try {
        return _this10._httpWrapper.sendRequest("get", url, params).then(response => response).catch(() => ({
          data: []
        }));
      } catch (error) {
        console.error("Exception in Solana requestTransactionHistory:", error);
        return Promise.resolve({
          data: []
        });
      }
    })();
  }
  /**
   * Send a serialized transaction using the provided mnemonic
   * @param mnemonic The mnemonic phrase to derive the keypair
   * @param serializedTransaction The base64 encoded transaction data
   * @returns The transaction signature
   */
  sendSerializedTransaction(mnemonic, serializedTransaction) {
    var _this11 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const connection = yield _this11._connectionReady;
        const fromKeypair = yield _this11._getKeypairFromMnemonic(mnemonic);
        const transactionBuffer = buffer__WEBPACK_IMPORTED_MODULE_7__.Buffer.from(serializedTransaction, "base64");
        const {
          blockhash
        } = yield connection.getLatestBlockhash("finalized");
        let transaction;
        let isVersioned = false;
        try {
          transaction = _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.VersionedTransaction.deserialize(transactionBuffer);
          isVersioned = true;
        } catch (error) {
          try {
            transaction = _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.Transaction.from(transactionBuffer);
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = fromKeypair.publicKey;
          } catch (deserializeError) {
            throw new Error("Invalid transaction data: Could not deserialize");
          }
        }
        if (isVersioned) {
          const versionedTx = transaction;
          const messageV0 = versionedTx.message;
          const newMessage = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.MessageV0({
            header: messageV0.header,
            staticAccountKeys: messageV0.staticAccountKeys,
            recentBlockhash: blockhash,
            compiledInstructions: messageV0.compiledInstructions,
            addressTableLookups: messageV0.addressTableLookups
          });
          transaction = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.VersionedTransaction(newMessage);
          transaction.sign([fromKeypair]);
        } else {
          transaction.partialSign(fromKeypair);
        }
        const signature = yield connection.sendRawTransaction(transaction instanceof _solana_web3_js__WEBPACK_IMPORTED_MODULE_5__.VersionedTransaction ? transaction.serialize() : transaction.serialize(), {
          skipPreflight: true,
          preflightCommitment: "confirmed",
          maxRetries: 5
        });
        return signature;
      } catch (error) {
        console.error("Serialized transaction failed:", error);
        if (error.logs) {
          console.error("Solana transaction logs:", error.logs);
        } else if (typeof error.getLogs === "function") {
          console.error("Solana transaction logs (from getLogs):", error.getLogs());
        }
        const msg = error.message || "";
        if (msg.includes("insufficient lamports") || msg.includes("Fondos insuficientes") || msg.includes("insufficient funds for rent")) {
          throw new Error("errors.solana_insufficient_sol_for_fees");
        }
        throw error;
      }
    })();
  }
  sendTransaction(params) {
    var _this12 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!params.mnemonic) throw new Error("Mnemonic is required for Solana transactions");
      const hash = yield _this12._sendTokens(params.mnemonic, params.to, params.tokenAddress || "", parseFloat(params.value));
      return {
        hash,
        status: "confirmed"
      };
    })();
  }
  static ɵfac = function SolanaService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SolanaService)(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_12__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵinject"](_http_wrapper_service__WEBPACK_IMPORTED_MODULE_13__.HttpWrapperService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵinject"](app_services_rpc_provider_service__WEBPACK_IMPORTED_MODULE_14__.RpcProviderService));
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineInjectable"]({
    token: SolanaService,
    factory: SolanaService.ɵfac,
    providedIn: "root"
  });
}

/***/ },

/***/ 43988
/*!****************************************************!*\
  !*** ./node_modules/bigint-buffer/dist/browser.js ***!
  \****************************************************/
(__unused_webpack_module, exports) {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
let converter;
/**
 * Convert a little-endian buffer into a BigInt.
 * @param buf The little-endian buffer to convert
 * @returns A BigInt with the little-endian representation of buf.
 */
function toBigIntLE(buf) {
  {
    const reversed = Buffer.from(buf);
    reversed.reverse();
    const hex = reversed.toString('hex');
    if (hex.length === 0) {
      return BigInt(0);
    }
    return BigInt(`0x${hex}`);
  }
  // removed by dead control flow

}
exports.toBigIntLE = toBigIntLE;
/**
 * Convert a big-endian buffer into a BigInt
 * @param buf The big-endian buffer to convert.
 * @returns A BigInt with the big-endian representation of buf.
 */
function toBigIntBE(buf) {
  {
    const hex = buf.toString('hex');
    if (hex.length === 0) {
      return BigInt(0);
    }
    return BigInt(`0x${hex}`);
  }
  // removed by dead control flow

}
exports.toBigIntBE = toBigIntBE;
/**
 * Convert a BigInt to a little-endian buffer.
 * @param num   The BigInt to convert.
 * @param width The number of bytes that the resulting buffer should be.
 * @returns A little-endian buffer representation of num.
 */
function toBufferLE(num, width) {
  {
    const hex = num.toString(16);
    const buffer = Buffer.from(hex.padStart(width * 2, '0').slice(0, width * 2), 'hex');
    buffer.reverse();
    return buffer;
  }
  // Allocation is done here, since it is slower using napi in C
  // removed by dead control flow

}
exports.toBufferLE = toBufferLE;
/**
 * Convert a BigInt to a big-endian buffer.
 * @param num   The BigInt to convert.
 * @param width The number of bytes that the resulting buffer should be.
 * @returns A big-endian buffer representation of num.
 */
function toBufferBE(num, width) {
  {
    const hex = num.toString(16);
    return Buffer.from(hex.padStart(width * 2, '0').slice(0, width * 2), 'hex');
  }
  // removed by dead control flow

}
exports.toBufferBE = toBufferBE;

/***/ },

/***/ 56196
/*!***************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/firstValueFrom.js ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   firstValueFrom: () => (/* binding */ firstValueFrom)
/* harmony export */ });
/* harmony import */ var _util_EmptyError__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/EmptyError */ 93335);
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Subscriber */ 89285);


function firstValueFrom(source, config) {
  const hasConfig = typeof config === 'object';
  return new Promise((resolve, reject) => {
    const subscriber = new _Subscriber__WEBPACK_IMPORTED_MODULE_1__.SafeSubscriber({
      next: value => {
        resolve(value);
        subscriber.unsubscribe();
      },
      error: reject,
      complete: () => {
        if (hasConfig) {
          resolve(config.defaultValue);
        } else {
          reject(new _util_EmptyError__WEBPACK_IMPORTED_MODULE_0__.EmptyError());
        }
      }
    });
    source.subscribe(subscriber);
  });
}

/***/ },

/***/ 10980
/*!***************************************************!*\
  !*** ./node_modules/@noble/hashes/esm/_assert.js ***!
  \***************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   abytes: () => (/* binding */ abytes),
/* harmony export */   aexists: () => (/* binding */ aexists),
/* harmony export */   anumber: () => (/* binding */ anumber),
/* harmony export */   aoutput: () => (/* binding */ aoutput)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ 97770);
/**
 * Internal assertion helpers.
 * @module
 * @deprecated
 */

/** @deprecated Use import from `noble/hashes/utils` module */
const abytes = _utils_js__WEBPACK_IMPORTED_MODULE_0__.abytes;
/** @deprecated Use import from `noble/hashes/utils` module */
const aexists = _utils_js__WEBPACK_IMPORTED_MODULE_0__.aexists;
/** @deprecated Use import from `noble/hashes/utils` module */
const anumber = _utils_js__WEBPACK_IMPORTED_MODULE_0__.anumber;
/** @deprecated Use import from `noble/hashes/utils` module */
const aoutput = _utils_js__WEBPACK_IMPORTED_MODULE_0__.aoutput;

/***/ },

/***/ 16952
/*!**************************************************!*\
  !*** ./node_modules/@noble/hashes/esm/legacy.js ***!
  \**************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MD5: () => (/* binding */ MD5),
/* harmony export */   RIPEMD160: () => (/* binding */ RIPEMD160),
/* harmony export */   SHA1: () => (/* binding */ SHA1),
/* harmony export */   md5: () => (/* binding */ md5),
/* harmony export */   ripemd160: () => (/* binding */ ripemd160),
/* harmony export */   sha1: () => (/* binding */ sha1)
/* harmony export */ });
/* harmony import */ var _md_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_md.js */ 93887);
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ 97770);
/**

SHA1 (RFC 3174), MD5 (RFC 1321) and RIPEMD160 (RFC 2286) legacy, weak hash functions.
Don't use them in a new protocol. What "weak" means:

- Collisions can be made with 2^18 effort in MD5, 2^60 in SHA1, 2^80 in RIPEMD160.
- No practical pre-image attacks (only theoretical, 2^123.4)
- HMAC seems kinda ok: https://datatracker.ietf.org/doc/html/rfc6151
 * @module
 */


/** Initial SHA1 state */
const SHA1_IV = /* @__PURE__ */Uint32Array.from([0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]);
// Reusable temporary buffer
const SHA1_W = /* @__PURE__ */new Uint32Array(80);
/** SHA1 legacy hash class. */
class SHA1 extends _md_js__WEBPACK_IMPORTED_MODULE_0__.HashMD {
  constructor() {
    super(64, 20, 8, false);
    this.A = SHA1_IV[0] | 0;
    this.B = SHA1_IV[1] | 0;
    this.C = SHA1_IV[2] | 0;
    this.D = SHA1_IV[3] | 0;
    this.E = SHA1_IV[4] | 0;
  }
  get() {
    const {
      A,
      B,
      C,
      D,
      E
    } = this;
    return [A, B, C, D, E];
  }
  set(A, B, C, D, E) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4) SHA1_W[i] = view.getUint32(offset, false);
    for (let i = 16; i < 80; i++) SHA1_W[i] = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.rotl)(SHA1_W[i - 3] ^ SHA1_W[i - 8] ^ SHA1_W[i - 14] ^ SHA1_W[i - 16], 1);
    // Compression function main loop, 80 rounds
    let {
      A,
      B,
      C,
      D,
      E
    } = this;
    for (let i = 0; i < 80; i++) {
      let F, K;
      if (i < 20) {
        F = (0,_md_js__WEBPACK_IMPORTED_MODULE_0__.Chi)(B, C, D);
        K = 0x5a827999;
      } else if (i < 40) {
        F = B ^ C ^ D;
        K = 0x6ed9eba1;
      } else if (i < 60) {
        F = (0,_md_js__WEBPACK_IMPORTED_MODULE_0__.Maj)(B, C, D);
        K = 0x8f1bbcdc;
      } else {
        F = B ^ C ^ D;
        K = 0xca62c1d6;
      }
      const T = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.rotl)(A, 5) + F + E + K + SHA1_W[i] | 0;
      E = D;
      D = C;
      C = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.rotl)(B, 30);
      B = A;
      A = T;
    }
    // Add the compressed chunk to the current hash value
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    this.set(A, B, C, D, E);
  }
  roundClean() {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.clean)(SHA1_W);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0);
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.clean)(this.buffer);
  }
}
/** SHA1 (RFC 3174) legacy hash function. It was cryptographically broken. */
const sha1 = /* @__PURE__ */(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.createHasher)(() => new SHA1());
/** Per-round constants */
const p32 = /* @__PURE__ */Math.pow(2, 32);
const K = /* @__PURE__ */Array.from({
  length: 64
}, (_, i) => Math.floor(p32 * Math.abs(Math.sin(i + 1))));
/** md5 initial state: same as sha1, but 4 u32 instead of 5. */
const MD5_IV = /* @__PURE__ */SHA1_IV.slice(0, 4);
// Reusable temporary buffer
const MD5_W = /* @__PURE__ */new Uint32Array(16);
/** MD5 legacy hash class. */
class MD5 extends _md_js__WEBPACK_IMPORTED_MODULE_0__.HashMD {
  constructor() {
    super(64, 16, 8, true);
    this.A = MD5_IV[0] | 0;
    this.B = MD5_IV[1] | 0;
    this.C = MD5_IV[2] | 0;
    this.D = MD5_IV[3] | 0;
  }
  get() {
    const {
      A,
      B,
      C,
      D
    } = this;
    return [A, B, C, D];
  }
  set(A, B, C, D) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4) MD5_W[i] = view.getUint32(offset, true);
    // Compression function main loop, 64 rounds
    let {
      A,
      B,
      C,
      D
    } = this;
    for (let i = 0; i < 64; i++) {
      let F, g, s;
      if (i < 16) {
        F = (0,_md_js__WEBPACK_IMPORTED_MODULE_0__.Chi)(B, C, D);
        g = i;
        s = [7, 12, 17, 22];
      } else if (i < 32) {
        F = (0,_md_js__WEBPACK_IMPORTED_MODULE_0__.Chi)(D, B, C);
        g = (5 * i + 1) % 16;
        s = [5, 9, 14, 20];
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
        s = [4, 11, 16, 23];
      } else {
        F = C ^ (B | ~D);
        g = 7 * i % 16;
        s = [6, 10, 15, 21];
      }
      F = F + A + K[i] + MD5_W[g];
      A = D;
      D = C;
      C = B;
      B = B + (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.rotl)(F, s[i % 4]);
    }
    // Add the compressed chunk to the current hash value
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    this.set(A, B, C, D);
  }
  roundClean() {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.clean)(MD5_W);
  }
  destroy() {
    this.set(0, 0, 0, 0);
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.clean)(this.buffer);
  }
}
/**
 * MD5 (RFC 1321) legacy hash function. It was cryptographically broken.
 * MD5 architecture is similar to SHA1, with some differences:
 * - Reduced output length: 16 bytes (128 bit) instead of 20
 * - 64 rounds, instead of 80
 * - Little-endian: could be faster, but will require more code
 * - Non-linear index selection: huge speed-up for unroll
 * - Per round constants: more memory accesses, additional speed-up for unroll
 */
const md5 = /* @__PURE__ */(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.createHasher)(() => new MD5());
// RIPEMD-160
const Rho160 = /* @__PURE__ */Uint8Array.from([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]);
const Id160 = /* @__PURE__ */(() => Uint8Array.from(new Array(16).fill(0).map((_, i) => i)))();
const Pi160 = /* @__PURE__ */(() => Id160.map(i => (9 * i + 5) % 16))();
const idxLR = /* @__PURE__ */(() => {
  const L = [Id160];
  const R = [Pi160];
  const res = [L, R];
  for (let i = 0; i < 4; i++) for (let j of res) j.push(j[i].map(k => Rho160[k]));
  return res;
})();
const idxL = /* @__PURE__ */(() => idxLR[0])();
const idxR = /* @__PURE__ */(() => idxLR[1])();
// const [idxL, idxR] = idxLR;
const shifts160 = /* @__PURE__ */[[11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8], [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7], [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9], [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6], [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5]].map(i => Uint8Array.from(i));
const shiftsL160 = /* @__PURE__ */idxL.map((idx, i) => idx.map(j => shifts160[i][j]));
const shiftsR160 = /* @__PURE__ */idxR.map((idx, i) => idx.map(j => shifts160[i][j]));
const Kl160 = /* @__PURE__ */Uint32Array.from([0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e]);
const Kr160 = /* @__PURE__ */Uint32Array.from([0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000]);
// It's called f() in spec.
function ripemd_f(group, x, y, z) {
  if (group === 0) return x ^ y ^ z;
  if (group === 1) return x & y | ~x & z;
  if (group === 2) return (x | ~y) ^ z;
  if (group === 3) return x & z | y & ~z;
  return x ^ (y | ~z);
}
// Reusable temporary buffer
const BUF_160 = /* @__PURE__ */new Uint32Array(16);
class RIPEMD160 extends _md_js__WEBPACK_IMPORTED_MODULE_0__.HashMD {
  constructor() {
    super(64, 20, 8, true);
    this.h0 = 0x67452301 | 0;
    this.h1 = 0xefcdab89 | 0;
    this.h2 = 0x98badcfe | 0;
    this.h3 = 0x10325476 | 0;
    this.h4 = 0xc3d2e1f0 | 0;
  }
  get() {
    const {
      h0,
      h1,
      h2,
      h3,
      h4
    } = this;
    return [h0, h1, h2, h3, h4];
  }
  set(h0, h1, h2, h3, h4) {
    this.h0 = h0 | 0;
    this.h1 = h1 | 0;
    this.h2 = h2 | 0;
    this.h3 = h3 | 0;
    this.h4 = h4 | 0;
  }
  process(view, offset) {
    for (let i = 0; i < 16; i++, offset += 4) BUF_160[i] = view.getUint32(offset, true);
    // prettier-ignore
    let al = this.h0 | 0,
      ar = al,
      bl = this.h1 | 0,
      br = bl,
      cl = this.h2 | 0,
      cr = cl,
      dl = this.h3 | 0,
      dr = dl,
      el = this.h4 | 0,
      er = el;
    // Instead of iterating 0 to 80, we split it into 5 groups
    // And use the groups in constants, functions, etc. Much simpler
    for (let group = 0; group < 5; group++) {
      const rGroup = 4 - group;
      const hbl = Kl160[group],
        hbr = Kr160[group]; // prettier-ignore
      const rl = idxL[group],
        rr = idxR[group]; // prettier-ignore
      const sl = shiftsL160[group],
        sr = shiftsR160[group]; // prettier-ignore
      for (let i = 0; i < 16; i++) {
        const tl = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.rotl)(al + ripemd_f(group, bl, cl, dl) + BUF_160[rl[i]] + hbl, sl[i]) + el | 0;
        al = el, el = dl, dl = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.rotl)(cl, 10) | 0, cl = bl, bl = tl; // prettier-ignore
      }
      // 2 loops are 10% faster
      for (let i = 0; i < 16; i++) {
        const tr = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.rotl)(ar + ripemd_f(rGroup, br, cr, dr) + BUF_160[rr[i]] + hbr, sr[i]) + er | 0;
        ar = er, er = dr, dr = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.rotl)(cr, 10) | 0, cr = br, br = tr; // prettier-ignore
      }
    }
    // Add the compressed chunk to the current hash value
    this.set(this.h1 + cl + dr | 0, this.h2 + dl + er | 0, this.h3 + el + ar | 0, this.h4 + al + br | 0, this.h0 + bl + cr | 0);
  }
  roundClean() {
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.clean)(BUF_160);
  }
  destroy() {
    this.destroyed = true;
    (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.clean)(this.buffer);
    this.set(0, 0, 0, 0, 0);
  }
}
/**
 * RIPEMD-160 - a legacy hash function from 1990s.
 * * https://homes.esat.kuleuven.be/~bosselae/ripemd160.html
 * * https://homes.esat.kuleuven.be/~bosselae/ripemd160/pdf/AB-9601/AB-9601.pdf
 */
const ripemd160 = /* @__PURE__ */(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.createHasher)(() => new RIPEMD160());

/***/ },

/***/ 8015
/*!*****************************************************!*\
  !*** ./node_modules/@noble/hashes/esm/ripemd160.js ***!
  \*****************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RIPEMD160: () => (/* binding */ RIPEMD160),
/* harmony export */   ripemd160: () => (/* binding */ ripemd160)
/* harmony export */ });
/* harmony import */ var _legacy_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./legacy.js */ 16952);
/**
 * RIPEMD-160 legacy hash function.
 * https://homes.esat.kuleuven.be/~bosselae/ripemd160.html
 * https://homes.esat.kuleuven.be/~bosselae/ripemd160/pdf/AB-9601/AB-9601.pdf
 * @module
 * @deprecated
 */

/** @deprecated Use import from `noble/hashes/legacy` module */
const RIPEMD160 = _legacy_js__WEBPACK_IMPORTED_MODULE_0__.RIPEMD160;
/** @deprecated Use import from `noble/hashes/legacy` module */
const ripemd160 = _legacy_js__WEBPACK_IMPORTED_MODULE_0__.ripemd160;

/***/ },

/***/ 88136
/*!*******************************************************************!*\
  !*** ./node_modules/@solana/buffer-layout-utils/lib/esm/base.mjs ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   encodeDecode: () => (/* binding */ encodeDecode)
/* harmony export */ });
const encodeDecode = layout => {
  const decode = layout.decode.bind(layout);
  const encode = layout.encode.bind(layout);
  return {
    decode,
    encode
  };
};

/***/ },

/***/ 11374
/*!*********************************************************************!*\
  !*** ./node_modules/@solana/buffer-layout-utils/lib/esm/bigint.mjs ***!
  \*********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bigInt: () => (/* binding */ bigInt),
/* harmony export */   bigIntBE: () => (/* binding */ bigIntBE),
/* harmony export */   u128: () => (/* binding */ u128),
/* harmony export */   u128be: () => (/* binding */ u128be),
/* harmony export */   u192: () => (/* binding */ u192),
/* harmony export */   u192be: () => (/* binding */ u192be),
/* harmony export */   u256: () => (/* binding */ u256),
/* harmony export */   u256be: () => (/* binding */ u256be),
/* harmony export */   u64: () => (/* binding */ u64),
/* harmony export */   u64be: () => (/* binding */ u64be)
/* harmony export */ });
/* harmony import */ var buffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! buffer */ 163);
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var bigint_buffer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bigint-buffer */ 43988);
/* harmony import */ var _base_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./base.mjs */ 88136);




// https://github.com/no2chem/bigint-buffer/issues/59
function assertValidBigInteger(untrustedInput) {
  if (typeof untrustedInput !== 'bigint') {
    throw new Error('Expected a `BigInt`');
  }
}
function bigInt_IMPL(littleEndian, length) {
  return property => {
    const layout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.blob)(length, property);
    const {
      encode,
      decode
    } = (0,_base_mjs__WEBPACK_IMPORTED_MODULE_3__.encodeDecode)(layout);
    const bigIntLayout = layout;
    bigIntLayout.decode = (buffer, offset) => {
      const src = decode(buffer, offset);
      return littleEndian ? (0,bigint_buffer__WEBPACK_IMPORTED_MODULE_2__.toBigIntLE)(buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(src)) : (0,bigint_buffer__WEBPACK_IMPORTED_MODULE_2__.toBigIntBE)(buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.from(src));
    };
    bigIntLayout.encode = (bigInt, buffer, offset) => {
      assertValidBigInteger(bigInt);
      let src;
      if (length === 0) {
        // https://github.com/no2chem/bigint-buffer/issues/40
        // `toBuffer{BE|LE}` crashes when passed zero for the `length` argument.
        src = buffer__WEBPACK_IMPORTED_MODULE_0__.Buffer.alloc(0);
      } else {
        src = littleEndian ? (0,bigint_buffer__WEBPACK_IMPORTED_MODULE_2__.toBufferLE)(bigInt, length) : (0,bigint_buffer__WEBPACK_IMPORTED_MODULE_2__.toBufferBE)(bigInt, length);
      }
      return encode(src, buffer, offset);
    };
    return bigIntLayout;
  };
}
const bigInt = /* @__PURE__ */bigInt_IMPL.bind(null, /* littleEndian */true);
const bigIntBE = /* @__PURE__ */bigInt_IMPL.bind(null, /* littleEndian */false);
const u64 = /* @__PURE__ */bigInt(8);
const u64be = /* @__PURE__ */bigIntBE(8);
const u128 = /* @__PURE__ */bigInt(16);
const u128be = /* @__PURE__ */bigIntBE(16);
const u192 = /* @__PURE__ */bigInt(24);
const u192be = /* @__PURE__ */bigIntBE(24);
const u256 = /* @__PURE__ */bigInt(32);
const u256be = /* @__PURE__ */bigIntBE(32);

/***/ },

/***/ 87628
/*!**********************************************************************!*\
  !*** ./node_modules/@solana/buffer-layout-utils/lib/esm/decimal.mjs ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WAD: () => (/* binding */ WAD),
/* harmony export */   decimal: () => (/* binding */ decimal)
/* harmony export */ });
/* harmony import */ var bignumber_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bignumber.js */ 33124);
/* harmony import */ var _base_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base.mjs */ 88136);
/* harmony import */ var _bigint_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./bigint.mjs */ 11374);



const WAD = new bignumber_js__WEBPACK_IMPORTED_MODULE_0__["default"]('1e+18');
const decimal = property => {
  const layout = (0,_bigint_mjs__WEBPACK_IMPORTED_MODULE_2__.u128)(property);
  const {
    encode,
    decode
  } = (0,_base_mjs__WEBPACK_IMPORTED_MODULE_1__.encodeDecode)(layout);
  const decimalLayout = layout;
  decimalLayout.decode = (buffer, offset) => {
    const src = decode(buffer, offset).toString();
    return new bignumber_js__WEBPACK_IMPORTED_MODULE_0__["default"](src).div(WAD);
  };
  decimalLayout.encode = (decimal, buffer, offset) => {
    const src = BigInt(decimal.times(WAD).integerValue().toString());
    return encode(src, buffer, offset);
  };
  return decimalLayout;
};

/***/ },

/***/ 99033
/*!********************************************************************!*\
  !*** ./node_modules/@solana/buffer-layout-utils/lib/esm/index.mjs ***!
  \********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WAD: () => (/* reexport safe */ _decimal_mjs__WEBPACK_IMPORTED_MODULE_2__.WAD),
/* harmony export */   bigInt: () => (/* reexport safe */ _bigint_mjs__WEBPACK_IMPORTED_MODULE_1__.bigInt),
/* harmony export */   bigIntBE: () => (/* reexport safe */ _bigint_mjs__WEBPACK_IMPORTED_MODULE_1__.bigIntBE),
/* harmony export */   bool: () => (/* reexport safe */ _native_mjs__WEBPACK_IMPORTED_MODULE_3__.bool),
/* harmony export */   decimal: () => (/* reexport safe */ _decimal_mjs__WEBPACK_IMPORTED_MODULE_2__.decimal),
/* harmony export */   encodeDecode: () => (/* reexport safe */ _base_mjs__WEBPACK_IMPORTED_MODULE_0__.encodeDecode),
/* harmony export */   publicKey: () => (/* reexport safe */ _web3_mjs__WEBPACK_IMPORTED_MODULE_4__.publicKey),
/* harmony export */   u128: () => (/* reexport safe */ _bigint_mjs__WEBPACK_IMPORTED_MODULE_1__.u128),
/* harmony export */   u128be: () => (/* reexport safe */ _bigint_mjs__WEBPACK_IMPORTED_MODULE_1__.u128be),
/* harmony export */   u192: () => (/* reexport safe */ _bigint_mjs__WEBPACK_IMPORTED_MODULE_1__.u192),
/* harmony export */   u192be: () => (/* reexport safe */ _bigint_mjs__WEBPACK_IMPORTED_MODULE_1__.u192be),
/* harmony export */   u256: () => (/* reexport safe */ _bigint_mjs__WEBPACK_IMPORTED_MODULE_1__.u256),
/* harmony export */   u256be: () => (/* reexport safe */ _bigint_mjs__WEBPACK_IMPORTED_MODULE_1__.u256be),
/* harmony export */   u64: () => (/* reexport safe */ _bigint_mjs__WEBPACK_IMPORTED_MODULE_1__.u64),
/* harmony export */   u64be: () => (/* reexport safe */ _bigint_mjs__WEBPACK_IMPORTED_MODULE_1__.u64be)
/* harmony export */ });
/* harmony import */ var _base_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base.mjs */ 88136);
/* harmony import */ var _bigint_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bigint.mjs */ 11374);
/* harmony import */ var _decimal_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./decimal.mjs */ 87628);
/* harmony import */ var _native_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./native.mjs */ 79978);
/* harmony import */ var _web3_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./web3.mjs */ 68514);






/***/ },

/***/ 79978
/*!*********************************************************************!*\
  !*** ./node_modules/@solana/buffer-layout-utils/lib/esm/native.mjs ***!
  \*********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bool: () => (/* binding */ bool)
/* harmony export */ });
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _base_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./base.mjs */ 88136);


const bool = property => {
  const layout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.u8)(property);
  const {
    encode,
    decode
  } = (0,_base_mjs__WEBPACK_IMPORTED_MODULE_1__.encodeDecode)(layout);
  const boolLayout = layout;
  boolLayout.decode = (buffer, offset) => {
    const src = decode(buffer, offset);
    return !!src;
  };
  boolLayout.encode = (bool, buffer, offset) => {
    const src = Number(bool);
    return encode(src, buffer, offset);
  };
  return boolLayout;
};

/***/ },

/***/ 68514
/*!*******************************************************************!*\
  !*** ./node_modules/@solana/buffer-layout-utils/lib/esm/web3.mjs ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   publicKey: () => (/* binding */ publicKey)
/* harmony export */ });
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/web3.js */ 47647);
/* harmony import */ var _base_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base.mjs */ 88136);



const publicKey = property => {
  const layout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.blob)(32, property);
  const {
    encode,
    decode
  } = (0,_base_mjs__WEBPACK_IMPORTED_MODULE_2__.encodeDecode)(layout);
  const publicKeyLayout = layout;
  publicKeyLayout.decode = (buffer, offset) => {
    const src = decode(buffer, offset);
    return new _solana_web3_js__WEBPACK_IMPORTED_MODULE_1__.PublicKey(src);
  };
  publicKeyLayout.encode = (publicKey, buffer, offset) => {
    const src = publicKey.toBuffer();
    return encode(src, buffer, offset);
  };
  return publicKeyLayout;
};

/***/ },

/***/ 37750
/*!*****************************************************************!*\
  !*** ./node_modules/@solana/codecs-core/dist/index.browser.mjs ***!
  \*****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addCodecSentinel: () => (/* binding */ addCodecSentinel),
/* harmony export */   addCodecSizePrefix: () => (/* binding */ addCodecSizePrefix),
/* harmony export */   addDecoderSentinel: () => (/* binding */ addDecoderSentinel),
/* harmony export */   addDecoderSizePrefix: () => (/* binding */ addDecoderSizePrefix),
/* harmony export */   addEncoderSentinel: () => (/* binding */ addEncoderSentinel),
/* harmony export */   addEncoderSizePrefix: () => (/* binding */ addEncoderSizePrefix),
/* harmony export */   assertByteArrayHasEnoughBytesForCodec: () => (/* binding */ assertByteArrayHasEnoughBytesForCodec),
/* harmony export */   assertByteArrayIsNotEmptyForCodec: () => (/* binding */ assertByteArrayIsNotEmptyForCodec),
/* harmony export */   assertByteArrayOffsetIsNotOutOfRange: () => (/* binding */ assertByteArrayOffsetIsNotOutOfRange),
/* harmony export */   assertIsFixedSize: () => (/* binding */ assertIsFixedSize),
/* harmony export */   assertIsVariableSize: () => (/* binding */ assertIsVariableSize),
/* harmony export */   combineCodec: () => (/* binding */ combineCodec),
/* harmony export */   containsBytes: () => (/* binding */ containsBytes),
/* harmony export */   createCodec: () => (/* binding */ createCodec),
/* harmony export */   createDecoder: () => (/* binding */ createDecoder),
/* harmony export */   createEncoder: () => (/* binding */ createEncoder),
/* harmony export */   fixBytes: () => (/* binding */ fixBytes),
/* harmony export */   fixCodecSize: () => (/* binding */ fixCodecSize),
/* harmony export */   fixDecoderSize: () => (/* binding */ fixDecoderSize),
/* harmony export */   fixEncoderSize: () => (/* binding */ fixEncoderSize),
/* harmony export */   getEncodedSize: () => (/* binding */ getEncodedSize),
/* harmony export */   isFixedSize: () => (/* binding */ isFixedSize),
/* harmony export */   isVariableSize: () => (/* binding */ isVariableSize),
/* harmony export */   mergeBytes: () => (/* binding */ mergeBytes),
/* harmony export */   offsetCodec: () => (/* binding */ offsetCodec),
/* harmony export */   offsetDecoder: () => (/* binding */ offsetDecoder),
/* harmony export */   offsetEncoder: () => (/* binding */ offsetEncoder),
/* harmony export */   padBytes: () => (/* binding */ padBytes),
/* harmony export */   padLeftCodec: () => (/* binding */ padLeftCodec),
/* harmony export */   padLeftDecoder: () => (/* binding */ padLeftDecoder),
/* harmony export */   padLeftEncoder: () => (/* binding */ padLeftEncoder),
/* harmony export */   padRightCodec: () => (/* binding */ padRightCodec),
/* harmony export */   padRightDecoder: () => (/* binding */ padRightDecoder),
/* harmony export */   padRightEncoder: () => (/* binding */ padRightEncoder),
/* harmony export */   resizeCodec: () => (/* binding */ resizeCodec),
/* harmony export */   resizeDecoder: () => (/* binding */ resizeDecoder),
/* harmony export */   resizeEncoder: () => (/* binding */ resizeEncoder),
/* harmony export */   reverseCodec: () => (/* binding */ reverseCodec),
/* harmony export */   reverseDecoder: () => (/* binding */ reverseDecoder),
/* harmony export */   reverseEncoder: () => (/* binding */ reverseEncoder),
/* harmony export */   transformCodec: () => (/* binding */ transformCodec),
/* harmony export */   transformDecoder: () => (/* binding */ transformDecoder),
/* harmony export */   transformEncoder: () => (/* binding */ transformEncoder)
/* harmony export */ });
/* harmony import */ var _solana_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/errors */ 80970);


// src/add-codec-sentinel.ts

// src/bytes.ts
var mergeBytes = byteArrays => {
  const nonEmptyByteArrays = byteArrays.filter(arr => arr.length);
  if (nonEmptyByteArrays.length === 0) {
    return byteArrays.length ? byteArrays[0] : new Uint8Array();
  }
  if (nonEmptyByteArrays.length === 1) {
    return nonEmptyByteArrays[0];
  }
  const totalLength = nonEmptyByteArrays.reduce((total, arr) => total + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  nonEmptyByteArrays.forEach(arr => {
    result.set(arr, offset);
    offset += arr.length;
  });
  return result;
};
var padBytes = (bytes, length) => {
  if (bytes.length >= length) return bytes;
  const paddedBytes = new Uint8Array(length).fill(0);
  paddedBytes.set(bytes);
  return paddedBytes;
};
var fixBytes = (bytes, length) => padBytes(bytes.length <= length ? bytes : bytes.slice(0, length), length);
function containsBytes(data, bytes, offset) {
  const slice = offset === 0 && data.length === bytes.length ? data : data.slice(offset, offset + bytes.length);
  if (slice.length !== bytes.length) return false;
  return bytes.every((b, i) => b === slice[i]);
}
function getEncodedSize(value, encoder) {
  return "fixedSize" in encoder ? encoder.fixedSize : encoder.getSizeFromValue(value);
}
function createEncoder(encoder) {
  return Object.freeze({
    ...encoder,
    encode: value => {
      const bytes = new Uint8Array(getEncodedSize(value, encoder));
      encoder.write(value, bytes, 0);
      return bytes;
    }
  });
}
function createDecoder(decoder) {
  return Object.freeze({
    ...decoder,
    decode: (bytes, offset = 0) => decoder.read(bytes, offset)[0]
  });
}
function createCodec(codec) {
  return Object.freeze({
    ...codec,
    decode: (bytes, offset = 0) => codec.read(bytes, offset)[0],
    encode: value => {
      const bytes = new Uint8Array(getEncodedSize(value, codec));
      codec.write(value, bytes, 0);
      return bytes;
    }
  });
}
function isFixedSize(codec) {
  return "fixedSize" in codec && typeof codec.fixedSize === "number";
}
function assertIsFixedSize(codec) {
  if (!isFixedSize(codec)) {
    throw new _solana_errors__WEBPACK_IMPORTED_MODULE_0__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_0__.SOLANA_ERROR__CODECS__EXPECTED_FIXED_LENGTH);
  }
}
function isVariableSize(codec) {
  return !isFixedSize(codec);
}
function assertIsVariableSize(codec) {
  if (!isVariableSize(codec)) {
    throw new _solana_errors__WEBPACK_IMPORTED_MODULE_0__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_0__.SOLANA_ERROR__CODECS__EXPECTED_VARIABLE_LENGTH);
  }
}
function combineCodec(encoder, decoder) {
  if (isFixedSize(encoder) !== isFixedSize(decoder)) {
    throw new _solana_errors__WEBPACK_IMPORTED_MODULE_0__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_0__.SOLANA_ERROR__CODECS__ENCODER_DECODER_SIZE_COMPATIBILITY_MISMATCH);
  }
  if (isFixedSize(encoder) && isFixedSize(decoder) && encoder.fixedSize !== decoder.fixedSize) {
    throw new _solana_errors__WEBPACK_IMPORTED_MODULE_0__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_0__.SOLANA_ERROR__CODECS__ENCODER_DECODER_FIXED_SIZE_MISMATCH, {
      decoderFixedSize: decoder.fixedSize,
      encoderFixedSize: encoder.fixedSize
    });
  }
  if (!isFixedSize(encoder) && !isFixedSize(decoder) && encoder.maxSize !== decoder.maxSize) {
    throw new _solana_errors__WEBPACK_IMPORTED_MODULE_0__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_0__.SOLANA_ERROR__CODECS__ENCODER_DECODER_MAX_SIZE_MISMATCH, {
      decoderMaxSize: decoder.maxSize,
      encoderMaxSize: encoder.maxSize
    });
  }
  return {
    ...decoder,
    ...encoder,
    decode: decoder.decode,
    encode: encoder.encode,
    read: decoder.read,
    write: encoder.write
  };
}

// src/add-codec-sentinel.ts
function addEncoderSentinel(encoder, sentinel) {
  const write = (value, bytes, offset) => {
    const encoderBytes = encoder.encode(value);
    if (findSentinelIndex(encoderBytes, sentinel) >= 0) {
      throw new _solana_errors__WEBPACK_IMPORTED_MODULE_0__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_0__.SOLANA_ERROR__CODECS__ENCODED_BYTES_MUST_NOT_INCLUDE_SENTINEL, {
        encodedBytes: encoderBytes,
        hexEncodedBytes: hexBytes(encoderBytes),
        hexSentinel: hexBytes(sentinel),
        sentinel
      });
    }
    bytes.set(encoderBytes, offset);
    offset += encoderBytes.length;
    bytes.set(sentinel, offset);
    offset += sentinel.length;
    return offset;
  };
  if (isFixedSize(encoder)) {
    return createEncoder({
      ...encoder,
      fixedSize: encoder.fixedSize + sentinel.length,
      write
    });
  }
  return createEncoder({
    ...encoder,
    ...(encoder.maxSize != null ? {
      maxSize: encoder.maxSize + sentinel.length
    } : {}),
    getSizeFromValue: value => encoder.getSizeFromValue(value) + sentinel.length,
    write
  });
}
function addDecoderSentinel(decoder, sentinel) {
  const read = (bytes, offset) => {
    const candidateBytes = offset === 0 ? bytes : bytes.slice(offset);
    const sentinelIndex = findSentinelIndex(candidateBytes, sentinel);
    if (sentinelIndex === -1) {
      throw new _solana_errors__WEBPACK_IMPORTED_MODULE_0__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_0__.SOLANA_ERROR__CODECS__SENTINEL_MISSING_IN_DECODED_BYTES, {
        decodedBytes: candidateBytes,
        hexDecodedBytes: hexBytes(candidateBytes),
        hexSentinel: hexBytes(sentinel),
        sentinel
      });
    }
    const preSentinelBytes = candidateBytes.slice(0, sentinelIndex);
    return [decoder.decode(preSentinelBytes), offset + preSentinelBytes.length + sentinel.length];
  };
  if (isFixedSize(decoder)) {
    return createDecoder({
      ...decoder,
      fixedSize: decoder.fixedSize + sentinel.length,
      read
    });
  }
  return createDecoder({
    ...decoder,
    ...(decoder.maxSize != null ? {
      maxSize: decoder.maxSize + sentinel.length
    } : {}),
    read
  });
}
function addCodecSentinel(codec, sentinel) {
  return combineCodec(addEncoderSentinel(codec, sentinel), addDecoderSentinel(codec, sentinel));
}
function findSentinelIndex(bytes, sentinel) {
  return bytes.findIndex((byte, index, arr) => {
    if (sentinel.length === 1) return byte === sentinel[0];
    return containsBytes(arr, sentinel, index);
  });
}
function hexBytes(bytes) {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
}
function assertByteArrayIsNotEmptyForCodec(codecDescription, bytes, offset = 0) {
  if (bytes.length - offset <= 0) {
    throw new _solana_errors__WEBPACK_IMPORTED_MODULE_0__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_0__.SOLANA_ERROR__CODECS__CANNOT_DECODE_EMPTY_BYTE_ARRAY, {
      codecDescription
    });
  }
}
function assertByteArrayHasEnoughBytesForCodec(codecDescription, expected, bytes, offset = 0) {
  const bytesLength = bytes.length - offset;
  if (bytesLength < expected) {
    throw new _solana_errors__WEBPACK_IMPORTED_MODULE_0__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_0__.SOLANA_ERROR__CODECS__INVALID_BYTE_LENGTH, {
      bytesLength,
      codecDescription,
      expected
    });
  }
}
function assertByteArrayOffsetIsNotOutOfRange(codecDescription, offset, bytesLength) {
  if (offset < 0 || offset > bytesLength) {
    throw new _solana_errors__WEBPACK_IMPORTED_MODULE_0__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_0__.SOLANA_ERROR__CODECS__OFFSET_OUT_OF_RANGE, {
      bytesLength,
      codecDescription,
      offset
    });
  }
}

// src/add-codec-size-prefix.ts
function addEncoderSizePrefix(encoder, prefix) {
  const write = (value, bytes, offset) => {
    const encoderBytes = encoder.encode(value);
    offset = prefix.write(encoderBytes.length, bytes, offset);
    bytes.set(encoderBytes, offset);
    return offset + encoderBytes.length;
  };
  if (isFixedSize(prefix) && isFixedSize(encoder)) {
    return createEncoder({
      ...encoder,
      fixedSize: prefix.fixedSize + encoder.fixedSize,
      write
    });
  }
  const prefixMaxSize = isFixedSize(prefix) ? prefix.fixedSize : prefix.maxSize ?? null;
  const encoderMaxSize = isFixedSize(encoder) ? encoder.fixedSize : encoder.maxSize ?? null;
  const maxSize = prefixMaxSize !== null && encoderMaxSize !== null ? prefixMaxSize + encoderMaxSize : null;
  return createEncoder({
    ...encoder,
    ...(maxSize !== null ? {
      maxSize
    } : {}),
    getSizeFromValue: value => {
      const encoderSize = getEncodedSize(value, encoder);
      return getEncodedSize(encoderSize, prefix) + encoderSize;
    },
    write
  });
}
function addDecoderSizePrefix(decoder, prefix) {
  const read = (bytes, offset) => {
    const [bigintSize, decoderOffset] = prefix.read(bytes, offset);
    const size = Number(bigintSize);
    offset = decoderOffset;
    if (offset > 0 || bytes.length > size) {
      bytes = bytes.slice(offset, offset + size);
    }
    assertByteArrayHasEnoughBytesForCodec("addDecoderSizePrefix", size, bytes);
    return [decoder.decode(bytes), offset + size];
  };
  if (isFixedSize(prefix) && isFixedSize(decoder)) {
    return createDecoder({
      ...decoder,
      fixedSize: prefix.fixedSize + decoder.fixedSize,
      read
    });
  }
  const prefixMaxSize = isFixedSize(prefix) ? prefix.fixedSize : prefix.maxSize ?? null;
  const decoderMaxSize = isFixedSize(decoder) ? decoder.fixedSize : decoder.maxSize ?? null;
  const maxSize = prefixMaxSize !== null && decoderMaxSize !== null ? prefixMaxSize + decoderMaxSize : null;
  return createDecoder({
    ...decoder,
    ...(maxSize !== null ? {
      maxSize
    } : {}),
    read
  });
}
function addCodecSizePrefix(codec, prefix) {
  return combineCodec(addEncoderSizePrefix(codec, prefix), addDecoderSizePrefix(codec, prefix));
}

// src/fix-codec-size.ts
function fixEncoderSize(encoder, fixedBytes) {
  return createEncoder({
    fixedSize: fixedBytes,
    write: (value, bytes, offset) => {
      const variableByteArray = encoder.encode(value);
      const fixedByteArray = variableByteArray.length > fixedBytes ? variableByteArray.slice(0, fixedBytes) : variableByteArray;
      bytes.set(fixedByteArray, offset);
      return offset + fixedBytes;
    }
  });
}
function fixDecoderSize(decoder, fixedBytes) {
  return createDecoder({
    fixedSize: fixedBytes,
    read: (bytes, offset) => {
      assertByteArrayHasEnoughBytesForCodec("fixCodecSize", fixedBytes, bytes, offset);
      if (offset > 0 || bytes.length > fixedBytes) {
        bytes = bytes.slice(offset, offset + fixedBytes);
      }
      if (isFixedSize(decoder)) {
        bytes = fixBytes(bytes, decoder.fixedSize);
      }
      const [value] = decoder.read(bytes, 0);
      return [value, offset + fixedBytes];
    }
  });
}
function fixCodecSize(codec, fixedBytes) {
  return combineCodec(fixEncoderSize(codec, fixedBytes), fixDecoderSize(codec, fixedBytes));
}

// src/offset-codec.ts
function offsetEncoder(encoder, config) {
  return createEncoder({
    ...encoder,
    write: (value, bytes, preOffset) => {
      const wrapBytes = offset => modulo(offset, bytes.length);
      const newPreOffset = config.preOffset ? config.preOffset({
        bytes,
        preOffset,
        wrapBytes
      }) : preOffset;
      assertByteArrayOffsetIsNotOutOfRange("offsetEncoder", newPreOffset, bytes.length);
      const postOffset = encoder.write(value, bytes, newPreOffset);
      const newPostOffset = config.postOffset ? config.postOffset({
        bytes,
        newPreOffset,
        postOffset,
        preOffset,
        wrapBytes
      }) : postOffset;
      assertByteArrayOffsetIsNotOutOfRange("offsetEncoder", newPostOffset, bytes.length);
      return newPostOffset;
    }
  });
}
function offsetDecoder(decoder, config) {
  return createDecoder({
    ...decoder,
    read: (bytes, preOffset) => {
      const wrapBytes = offset => modulo(offset, bytes.length);
      const newPreOffset = config.preOffset ? config.preOffset({
        bytes,
        preOffset,
        wrapBytes
      }) : preOffset;
      assertByteArrayOffsetIsNotOutOfRange("offsetDecoder", newPreOffset, bytes.length);
      const [value, postOffset] = decoder.read(bytes, newPreOffset);
      const newPostOffset = config.postOffset ? config.postOffset({
        bytes,
        newPreOffset,
        postOffset,
        preOffset,
        wrapBytes
      }) : postOffset;
      assertByteArrayOffsetIsNotOutOfRange("offsetDecoder", newPostOffset, bytes.length);
      return [value, newPostOffset];
    }
  });
}
function offsetCodec(codec, config) {
  return combineCodec(offsetEncoder(codec, config), offsetDecoder(codec, config));
}
function modulo(dividend, divisor) {
  if (divisor === 0) return 0;
  return (dividend % divisor + divisor) % divisor;
}
function resizeEncoder(encoder, resize) {
  if (isFixedSize(encoder)) {
    const fixedSize = resize(encoder.fixedSize);
    if (fixedSize < 0) {
      throw new _solana_errors__WEBPACK_IMPORTED_MODULE_0__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_0__.SOLANA_ERROR__CODECS__EXPECTED_POSITIVE_BYTE_LENGTH, {
        bytesLength: fixedSize,
        codecDescription: "resizeEncoder"
      });
    }
    return createEncoder({
      ...encoder,
      fixedSize
    });
  }
  return createEncoder({
    ...encoder,
    getSizeFromValue: value => {
      const newSize = resize(encoder.getSizeFromValue(value));
      if (newSize < 0) {
        throw new _solana_errors__WEBPACK_IMPORTED_MODULE_0__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_0__.SOLANA_ERROR__CODECS__EXPECTED_POSITIVE_BYTE_LENGTH, {
          bytesLength: newSize,
          codecDescription: "resizeEncoder"
        });
      }
      return newSize;
    }
  });
}
function resizeDecoder(decoder, resize) {
  if (isFixedSize(decoder)) {
    const fixedSize = resize(decoder.fixedSize);
    if (fixedSize < 0) {
      throw new _solana_errors__WEBPACK_IMPORTED_MODULE_0__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_0__.SOLANA_ERROR__CODECS__EXPECTED_POSITIVE_BYTE_LENGTH, {
        bytesLength: fixedSize,
        codecDescription: "resizeDecoder"
      });
    }
    return createDecoder({
      ...decoder,
      fixedSize
    });
  }
  return decoder;
}
function resizeCodec(codec, resize) {
  return combineCodec(resizeEncoder(codec, resize), resizeDecoder(codec, resize));
}

// src/pad-codec.ts
function padLeftEncoder(encoder, offset) {
  return offsetEncoder(resizeEncoder(encoder, size => size + offset), {
    preOffset: ({
      preOffset
    }) => preOffset + offset
  });
}
function padRightEncoder(encoder, offset) {
  return offsetEncoder(resizeEncoder(encoder, size => size + offset), {
    postOffset: ({
      postOffset
    }) => postOffset + offset
  });
}
function padLeftDecoder(decoder, offset) {
  return offsetDecoder(resizeDecoder(decoder, size => size + offset), {
    preOffset: ({
      preOffset
    }) => preOffset + offset
  });
}
function padRightDecoder(decoder, offset) {
  return offsetDecoder(resizeDecoder(decoder, size => size + offset), {
    postOffset: ({
      postOffset
    }) => postOffset + offset
  });
}
function padLeftCodec(codec, offset) {
  return combineCodec(padLeftEncoder(codec, offset), padLeftDecoder(codec, offset));
}
function padRightCodec(codec, offset) {
  return combineCodec(padRightEncoder(codec, offset), padRightDecoder(codec, offset));
}

// src/reverse-codec.ts
function copySourceToTargetInReverse(source, target_WILL_MUTATE, sourceOffset, sourceLength, targetOffset = 0) {
  while (sourceOffset < --sourceLength) {
    const leftValue = source[sourceOffset];
    target_WILL_MUTATE[sourceOffset + targetOffset] = source[sourceLength];
    target_WILL_MUTATE[sourceLength + targetOffset] = leftValue;
    sourceOffset++;
  }
  if (sourceOffset === sourceLength) {
    target_WILL_MUTATE[sourceOffset + targetOffset] = source[sourceOffset];
  }
}
function reverseEncoder(encoder) {
  assertIsFixedSize(encoder);
  return createEncoder({
    ...encoder,
    write: (value, bytes, offset) => {
      const newOffset = encoder.write(value, bytes, offset);
      copySourceToTargetInReverse(bytes, bytes, offset, offset + encoder.fixedSize);
      return newOffset;
    }
  });
}
function reverseDecoder(decoder) {
  assertIsFixedSize(decoder);
  return createDecoder({
    ...decoder,
    read: (bytes, offset) => {
      const reversedBytes = bytes.slice();
      copySourceToTargetInReverse(bytes, reversedBytes, offset, offset + decoder.fixedSize);
      return decoder.read(reversedBytes, offset);
    }
  });
}
function reverseCodec(codec) {
  return combineCodec(reverseEncoder(codec), reverseDecoder(codec));
}

// src/transform-codec.ts
function transformEncoder(encoder, unmap) {
  return createEncoder({
    ...(isVariableSize(encoder) ? {
      ...encoder,
      getSizeFromValue: value => encoder.getSizeFromValue(unmap(value))
    } : encoder),
    write: (value, bytes, offset) => encoder.write(unmap(value), bytes, offset)
  });
}
function transformDecoder(decoder, map) {
  return createDecoder({
    ...decoder,
    read: (bytes, offset) => {
      const [value, newOffset] = decoder.read(bytes, offset);
      return [map(value, bytes, offset), newOffset];
    }
  });
}
function transformCodec(codec, unmap, map) {
  return createCodec({
    ...transformEncoder(codec, unmap),
    read: map ? transformDecoder(codec, map).read : codec.read
  });
}


//# sourceMappingURL=index.browser.mjs.map

/***/ },

/***/ 57718
/*!****************************************************************************!*\
  !*** ./node_modules/@solana/codecs-data-structures/dist/index.browser.mjs ***!
  \****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assertValidNumberOfItemsForCodec: () => (/* binding */ assertValidNumberOfItemsForCodec),
/* harmony export */   getArrayCodec: () => (/* binding */ getArrayCodec),
/* harmony export */   getArrayDecoder: () => (/* binding */ getArrayDecoder),
/* harmony export */   getArrayEncoder: () => (/* binding */ getArrayEncoder),
/* harmony export */   getBitArrayCodec: () => (/* binding */ getBitArrayCodec),
/* harmony export */   getBitArrayDecoder: () => (/* binding */ getBitArrayDecoder),
/* harmony export */   getBitArrayEncoder: () => (/* binding */ getBitArrayEncoder),
/* harmony export */   getBooleanCodec: () => (/* binding */ getBooleanCodec),
/* harmony export */   getBooleanDecoder: () => (/* binding */ getBooleanDecoder),
/* harmony export */   getBooleanEncoder: () => (/* binding */ getBooleanEncoder),
/* harmony export */   getBytesCodec: () => (/* binding */ getBytesCodec),
/* harmony export */   getBytesDecoder: () => (/* binding */ getBytesDecoder),
/* harmony export */   getBytesEncoder: () => (/* binding */ getBytesEncoder),
/* harmony export */   getConstantCodec: () => (/* binding */ getConstantCodec),
/* harmony export */   getConstantDecoder: () => (/* binding */ getConstantDecoder),
/* harmony export */   getConstantEncoder: () => (/* binding */ getConstantEncoder),
/* harmony export */   getDataEnumCodec: () => (/* binding */ getDataEnumCodec),
/* harmony export */   getDataEnumDecoder: () => (/* binding */ getDataEnumDecoder),
/* harmony export */   getDataEnumEncoder: () => (/* binding */ getDataEnumEncoder),
/* harmony export */   getDiscriminatedUnionCodec: () => (/* binding */ getDiscriminatedUnionCodec),
/* harmony export */   getDiscriminatedUnionDecoder: () => (/* binding */ getDiscriminatedUnionDecoder),
/* harmony export */   getDiscriminatedUnionEncoder: () => (/* binding */ getDiscriminatedUnionEncoder),
/* harmony export */   getEnumCodec: () => (/* binding */ getEnumCodec),
/* harmony export */   getEnumDecoder: () => (/* binding */ getEnumDecoder),
/* harmony export */   getEnumEncoder: () => (/* binding */ getEnumEncoder),
/* harmony export */   getHiddenPrefixCodec: () => (/* binding */ getHiddenPrefixCodec),
/* harmony export */   getHiddenPrefixDecoder: () => (/* binding */ getHiddenPrefixDecoder),
/* harmony export */   getHiddenPrefixEncoder: () => (/* binding */ getHiddenPrefixEncoder),
/* harmony export */   getHiddenSuffixCodec: () => (/* binding */ getHiddenSuffixCodec),
/* harmony export */   getHiddenSuffixDecoder: () => (/* binding */ getHiddenSuffixDecoder),
/* harmony export */   getHiddenSuffixEncoder: () => (/* binding */ getHiddenSuffixEncoder),
/* harmony export */   getMapCodec: () => (/* binding */ getMapCodec),
/* harmony export */   getMapDecoder: () => (/* binding */ getMapDecoder),
/* harmony export */   getMapEncoder: () => (/* binding */ getMapEncoder),
/* harmony export */   getNullableCodec: () => (/* binding */ getNullableCodec),
/* harmony export */   getNullableDecoder: () => (/* binding */ getNullableDecoder),
/* harmony export */   getNullableEncoder: () => (/* binding */ getNullableEncoder),
/* harmony export */   getScalarEnumCodec: () => (/* binding */ getScalarEnumCodec),
/* harmony export */   getScalarEnumDecoder: () => (/* binding */ getScalarEnumDecoder),
/* harmony export */   getScalarEnumEncoder: () => (/* binding */ getScalarEnumEncoder),
/* harmony export */   getSetCodec: () => (/* binding */ getSetCodec),
/* harmony export */   getSetDecoder: () => (/* binding */ getSetDecoder),
/* harmony export */   getSetEncoder: () => (/* binding */ getSetEncoder),
/* harmony export */   getStructCodec: () => (/* binding */ getStructCodec),
/* harmony export */   getStructDecoder: () => (/* binding */ getStructDecoder),
/* harmony export */   getStructEncoder: () => (/* binding */ getStructEncoder),
/* harmony export */   getTupleCodec: () => (/* binding */ getTupleCodec),
/* harmony export */   getTupleDecoder: () => (/* binding */ getTupleDecoder),
/* harmony export */   getTupleEncoder: () => (/* binding */ getTupleEncoder),
/* harmony export */   getUnionCodec: () => (/* binding */ getUnionCodec),
/* harmony export */   getUnionDecoder: () => (/* binding */ getUnionDecoder),
/* harmony export */   getUnionEncoder: () => (/* binding */ getUnionEncoder),
/* harmony export */   getUnitCodec: () => (/* binding */ getUnitCodec),
/* harmony export */   getUnitDecoder: () => (/* binding */ getUnitDecoder),
/* harmony export */   getUnitEncoder: () => (/* binding */ getUnitEncoder)
/* harmony export */ });
/* harmony import */ var _solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/codecs-core */ 37750);
/* harmony import */ var _solana_codecs_numbers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/codecs-numbers */ 1565);
/* harmony import */ var _solana_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/errors */ 80970);




// src/array.ts
function assertValidNumberOfItemsForCodec(codecDescription, expected, actual) {
  if (expected !== actual) {
    throw new _solana_errors__WEBPACK_IMPORTED_MODULE_2__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_2__.SOLANA_ERROR__CODECS__INVALID_NUMBER_OF_ITEMS, {
      actual,
      codecDescription,
      expected
    });
  }
}
function maxCodecSizes(sizes) {
  return sizes.reduce((all, size) => all === null || size === null ? null : Math.max(all, size), 0);
}
function sumCodecSizes(sizes) {
  return sizes.reduce((all, size) => all === null || size === null ? null : all + size, 0);
}
function getFixedSize(codec) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.isFixedSize)(codec) ? codec.fixedSize : null;
}
function getMaxSize(codec) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.isFixedSize)(codec) ? codec.fixedSize : codec.maxSize ?? null;
}

// src/array.ts
function getArrayEncoder(item, config = {}) {
  const size = config.size ?? (0,_solana_codecs_numbers__WEBPACK_IMPORTED_MODULE_1__.getU32Encoder)();
  const fixedSize = computeArrayLikeCodecSize(size, getFixedSize(item));
  const maxSize = computeArrayLikeCodecSize(size, getMaxSize(item)) ?? void 0;
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createEncoder)({
    ...(fixedSize !== null ? {
      fixedSize
    } : {
      getSizeFromValue: array => {
        const prefixSize = typeof size === "object" ? (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.getEncodedSize)(array.length, size) : 0;
        return prefixSize + [...array].reduce((all, value) => all + (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.getEncodedSize)(value, item), 0);
      },
      maxSize
    }),
    write: (array, bytes, offset) => {
      if (typeof size === "number") {
        assertValidNumberOfItemsForCodec("array", size, array.length);
      }
      if (typeof size === "object") {
        offset = size.write(array.length, bytes, offset);
      }
      array.forEach(value => {
        offset = item.write(value, bytes, offset);
      });
      return offset;
    }
  });
}
function getArrayDecoder(item, config = {}) {
  const size = config.size ?? (0,_solana_codecs_numbers__WEBPACK_IMPORTED_MODULE_1__.getU32Decoder)();
  const itemSize = getFixedSize(item);
  const fixedSize = computeArrayLikeCodecSize(size, itemSize);
  const maxSize = computeArrayLikeCodecSize(size, getMaxSize(item)) ?? void 0;
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createDecoder)({
    ...(fixedSize !== null ? {
      fixedSize
    } : {
      maxSize
    }),
    read: (bytes, offset) => {
      const array = [];
      if (typeof size === "object" && bytes.slice(offset).length === 0) {
        return [array, offset];
      }
      if (size === "remainder") {
        while (offset < bytes.length) {
          const [value, newOffset2] = item.read(bytes, offset);
          offset = newOffset2;
          array.push(value);
        }
        return [array, offset];
      }
      const [resolvedSize, newOffset] = typeof size === "number" ? [size, offset] : size.read(bytes, offset);
      offset = newOffset;
      for (let i = 0; i < resolvedSize; i += 1) {
        const [value, newOffset2] = item.read(bytes, offset);
        offset = newOffset2;
        array.push(value);
      }
      return [array, offset];
    }
  });
}
function getArrayCodec(item, config = {}) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.combineCodec)(getArrayEncoder(item, config), getArrayDecoder(item, config));
}
function computeArrayLikeCodecSize(size, itemSize) {
  if (typeof size !== "number") return null;
  if (size === 0) return 0;
  return itemSize === null ? null : itemSize * size;
}
function getBitArrayEncoder(size, config = {}) {
  const parsedConfig = typeof config === "boolean" ? {
    backward: config
  } : config;
  const backward = parsedConfig.backward ?? false;
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createEncoder)({
    fixedSize: size,
    write(value, bytes, offset) {
      const bytesToAdd = [];
      for (let i = 0; i < size; i += 1) {
        let byte = 0;
        for (let j = 0; j < 8; j += 1) {
          const feature = Number(value[i * 8 + j] ?? 0);
          byte |= feature << (backward ? j : 7 - j);
        }
        if (backward) {
          bytesToAdd.unshift(byte);
        } else {
          bytesToAdd.push(byte);
        }
      }
      bytes.set(bytesToAdd, offset);
      return size;
    }
  });
}
function getBitArrayDecoder(size, config = {}) {
  const parsedConfig = typeof config === "boolean" ? {
    backward: config
  } : config;
  const backward = parsedConfig.backward ?? false;
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createDecoder)({
    fixedSize: size,
    read(bytes, offset) {
      (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.assertByteArrayHasEnoughBytesForCodec)("bitArray", size, bytes, offset);
      const booleans = [];
      let slice = bytes.slice(offset, offset + size);
      slice = backward ? slice.reverse() : slice;
      slice.forEach(byte => {
        for (let i = 0; i < 8; i += 1) {
          if (backward) {
            booleans.push(Boolean(byte & 1));
            byte >>= 1;
          } else {
            booleans.push(Boolean(byte & 128));
            byte <<= 1;
          }
        }
      });
      return [booleans, offset + size];
    }
  });
}
function getBitArrayCodec(size, config = {}) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.combineCodec)(getBitArrayEncoder(size, config), getBitArrayDecoder(size, config));
}
function getBooleanEncoder(config = {}) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformEncoder)(config.size ?? (0,_solana_codecs_numbers__WEBPACK_IMPORTED_MODULE_1__.getU8Encoder)(), value => value ? 1 : 0);
}
function getBooleanDecoder(config = {}) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformDecoder)(config.size ?? (0,_solana_codecs_numbers__WEBPACK_IMPORTED_MODULE_1__.getU8Decoder)(), value => Number(value) === 1);
}
function getBooleanCodec(config = {}) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.combineCodec)(getBooleanEncoder(config), getBooleanDecoder(config));
}
function getBytesEncoder() {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createEncoder)({
    getSizeFromValue: value => value.length,
    write: (value, bytes, offset) => {
      bytes.set(value, offset);
      return offset + value.length;
    }
  });
}
function getBytesDecoder() {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createDecoder)({
    read: (bytes, offset) => {
      const slice = bytes.slice(offset);
      return [slice, offset + slice.length];
    }
  });
}
function getBytesCodec() {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.combineCodec)(getBytesEncoder(), getBytesDecoder());
}
var getBase16Decoder = () => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createDecoder)({
  read(bytes, offset) {
    const value = bytes.slice(offset).reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
    return [value, bytes.length];
  }
});
function getConstantEncoder(constant) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createEncoder)({
    fixedSize: constant.length,
    write: (_, bytes, offset) => {
      bytes.set(constant, offset);
      return offset + constant.length;
    }
  });
}
function getConstantDecoder(constant) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createDecoder)({
    fixedSize: constant.length,
    read: (bytes, offset) => {
      const base16 = getBase16Decoder();
      if (!(0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.containsBytes)(bytes, constant, offset)) {
        throw new _solana_errors__WEBPACK_IMPORTED_MODULE_2__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_2__.SOLANA_ERROR__CODECS__INVALID_CONSTANT, {
          constant,
          data: bytes,
          hexConstant: base16.decode(constant),
          hexData: base16.decode(bytes),
          offset
        });
      }
      return [void 0, offset + constant.length];
    }
  });
}
function getConstantCodec(constant) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.combineCodec)(getConstantEncoder(constant), getConstantDecoder(constant));
}
function getTupleEncoder(items) {
  const fixedSize = sumCodecSizes(items.map(getFixedSize));
  const maxSize = sumCodecSizes(items.map(getMaxSize)) ?? void 0;
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createEncoder)({
    ...(fixedSize === null ? {
      getSizeFromValue: value => items.map((item, index) => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.getEncodedSize)(value[index], item)).reduce((all, one) => all + one, 0),
      maxSize
    } : {
      fixedSize
    }),
    write: (value, bytes, offset) => {
      assertValidNumberOfItemsForCodec("tuple", items.length, value.length);
      items.forEach((item, index) => {
        offset = item.write(value[index], bytes, offset);
      });
      return offset;
    }
  });
}
function getTupleDecoder(items) {
  const fixedSize = sumCodecSizes(items.map(getFixedSize));
  const maxSize = sumCodecSizes(items.map(getMaxSize)) ?? void 0;
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createDecoder)({
    ...(fixedSize === null ? {
      maxSize
    } : {
      fixedSize
    }),
    read: (bytes, offset) => {
      const values = [];
      items.forEach(item => {
        const [newValue, newOffset] = item.read(bytes, offset);
        values.push(newValue);
        offset = newOffset;
      });
      return [values, offset];
    }
  });
}
function getTupleCodec(items) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.combineCodec)(getTupleEncoder(items), getTupleDecoder(items));
}
function getUnionEncoder(variants, getIndexFromValue) {
  const fixedSize = getUnionFixedSize(variants);
  const write = (variant, bytes, offset) => {
    const index = getIndexFromValue(variant);
    assertValidVariantIndex(variants, index);
    return variants[index].write(variant, bytes, offset);
  };
  if (fixedSize !== null) {
    return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createEncoder)({
      fixedSize,
      write
    });
  }
  const maxSize = getUnionMaxSize(variants);
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createEncoder)({
    ...(maxSize !== null ? {
      maxSize
    } : {}),
    getSizeFromValue: variant => {
      const index = getIndexFromValue(variant);
      assertValidVariantIndex(variants, index);
      return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.getEncodedSize)(variant, variants[index]);
    },
    write
  });
}
function getUnionDecoder(variants, getIndexFromBytes) {
  const fixedSize = getUnionFixedSize(variants);
  const read = (bytes, offset) => {
    const index = getIndexFromBytes(bytes, offset);
    assertValidVariantIndex(variants, index);
    return variants[index].read(bytes, offset);
  };
  if (fixedSize !== null) {
    return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createDecoder)({
      fixedSize,
      read
    });
  }
  const maxSize = getUnionMaxSize(variants);
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createDecoder)({
    ...(maxSize !== null ? {
      maxSize
    } : {}),
    read
  });
}
function getUnionCodec(variants, getIndexFromValue, getIndexFromBytes) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.combineCodec)(getUnionEncoder(variants, getIndexFromValue), getUnionDecoder(variants, getIndexFromBytes));
}
function assertValidVariantIndex(variants, index) {
  if (typeof variants[index] === "undefined") {
    throw new _solana_errors__WEBPACK_IMPORTED_MODULE_2__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_2__.SOLANA_ERROR__CODECS__UNION_VARIANT_OUT_OF_RANGE, {
      maxRange: variants.length - 1,
      minRange: 0,
      variant: index
    });
  }
}
function getUnionFixedSize(variants) {
  if (variants.length === 0) return 0;
  if (!(0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.isFixedSize)(variants[0])) return null;
  const variantSize = variants[0].fixedSize;
  const sameSizedVariants = variants.every(variant => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.isFixedSize)(variant) && variant.fixedSize === variantSize);
  return sameSizedVariants ? variantSize : null;
}
function getUnionMaxSize(variants) {
  return maxCodecSizes(variants.map(variant => getMaxSize(variant)));
}

// src/discriminated-union.ts
function getDiscriminatedUnionEncoder(variants, config = {}) {
  const discriminatorProperty = config.discriminator ?? "__kind";
  const prefix = config.size ?? (0,_solana_codecs_numbers__WEBPACK_IMPORTED_MODULE_1__.getU8Encoder)();
  return getUnionEncoder(variants.map(([, variant], index) => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformEncoder)(getTupleEncoder([prefix, variant]), value => [index, value])), value => getVariantDiscriminator(variants, value[discriminatorProperty]));
}
function getDiscriminatedUnionDecoder(variants, config = {}) {
  const discriminatorProperty = config.discriminator ?? "__kind";
  const prefix = config.size ?? (0,_solana_codecs_numbers__WEBPACK_IMPORTED_MODULE_1__.getU8Decoder)();
  return getUnionDecoder(variants.map(([discriminator, variant]) => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformDecoder)(getTupleDecoder([prefix, variant]), ([, value]) => ({
    [discriminatorProperty]: discriminator,
    ...value
  }))), (bytes, offset) => Number(prefix.read(bytes, offset)[0]));
}
function getDiscriminatedUnionCodec(variants, config = {}) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.combineCodec)(getDiscriminatedUnionEncoder(variants, config), getDiscriminatedUnionDecoder(variants, config));
}
function getVariantDiscriminator(variants, discriminatorValue) {
  const discriminator = variants.findIndex(([key]) => discriminatorValue === key);
  if (discriminator < 0) {
    throw new _solana_errors__WEBPACK_IMPORTED_MODULE_2__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_2__.SOLANA_ERROR__CODECS__INVALID_DISCRIMINATED_UNION_VARIANT, {
      value: discriminatorValue,
      variants: variants.map(([key]) => key)
    });
  }
  return discriminator;
}
var getDataEnumEncoder = getDiscriminatedUnionEncoder;
var getDataEnumDecoder = getDiscriminatedUnionDecoder;
var getDataEnumCodec = getDiscriminatedUnionCodec;

// src/enum-helpers.ts
function getEnumStats(constructor) {
  const numericalValues = [...new Set(Object.values(constructor).filter(v => typeof v === "number"))].sort();
  const enumRecord = Object.fromEntries(Object.entries(constructor).slice(numericalValues.length));
  const enumKeys = Object.keys(enumRecord);
  const enumValues = Object.values(enumRecord);
  const stringValues = [... /* @__PURE__ */new Set([...enumKeys, ...enumValues.filter(v => typeof v === "string")])];
  return {
    enumKeys,
    enumRecord,
    enumValues,
    numericalValues,
    stringValues
  };
}
function getEnumIndexFromVariant({
  enumKeys,
  enumValues,
  variant
}) {
  const valueIndex = findLastIndex(enumValues, value => value === variant);
  if (valueIndex >= 0) return valueIndex;
  return enumKeys.findIndex(key => key === variant);
}
function getEnumIndexFromDiscriminator({
  discriminator,
  enumKeys,
  enumValues,
  useValuesAsDiscriminators
}) {
  if (!useValuesAsDiscriminators) {
    return discriminator >= 0 && discriminator < enumKeys.length ? discriminator : -1;
  }
  return findLastIndex(enumValues, value => value === discriminator);
}
function findLastIndex(array, predicate) {
  let l = array.length;
  while (l--) {
    if (predicate(array[l], l, array)) return l;
  }
  return -1;
}
function formatNumericalValues(values) {
  if (values.length === 0) return "";
  let range = [values[0], values[0]];
  const ranges = [];
  for (let index = 1; index < values.length; index++) {
    const value = values[index];
    if (range[1] + 1 === value) {
      range[1] = value;
    } else {
      ranges.push(range[0] === range[1] ? `${range[0]}` : `${range[0]}-${range[1]}`);
      range = [value, value];
    }
  }
  ranges.push(range[0] === range[1] ? `${range[0]}` : `${range[0]}-${range[1]}`);
  return ranges.join(", ");
}

// src/enum.ts
function getEnumEncoder(constructor, config = {}) {
  const prefix = config.size ?? (0,_solana_codecs_numbers__WEBPACK_IMPORTED_MODULE_1__.getU8Encoder)();
  const useValuesAsDiscriminators = config.useValuesAsDiscriminators ?? false;
  const {
    enumKeys,
    enumValues,
    numericalValues,
    stringValues
  } = getEnumStats(constructor);
  if (useValuesAsDiscriminators && enumValues.some(value => typeof value === "string")) {
    throw new _solana_errors__WEBPACK_IMPORTED_MODULE_2__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_2__.SOLANA_ERROR__CODECS__CANNOT_USE_LEXICAL_VALUES_AS_ENUM_DISCRIMINATORS, {
      stringValues: enumValues.filter(v => typeof v === "string")
    });
  }
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformEncoder)(prefix, variant => {
    const index = getEnumIndexFromVariant({
      enumKeys,
      enumValues,
      variant
    });
    if (index < 0) {
      throw new _solana_errors__WEBPACK_IMPORTED_MODULE_2__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_2__.SOLANA_ERROR__CODECS__INVALID_ENUM_VARIANT, {
        formattedNumericalValues: formatNumericalValues(numericalValues),
        numericalValues,
        stringValues,
        variant
      });
    }
    return useValuesAsDiscriminators ? enumValues[index] : index;
  });
}
function getEnumDecoder(constructor, config = {}) {
  const prefix = config.size ?? (0,_solana_codecs_numbers__WEBPACK_IMPORTED_MODULE_1__.getU8Decoder)();
  const useValuesAsDiscriminators = config.useValuesAsDiscriminators ?? false;
  const {
    enumKeys,
    enumValues,
    numericalValues
  } = getEnumStats(constructor);
  if (useValuesAsDiscriminators && enumValues.some(value => typeof value === "string")) {
    throw new _solana_errors__WEBPACK_IMPORTED_MODULE_2__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_2__.SOLANA_ERROR__CODECS__CANNOT_USE_LEXICAL_VALUES_AS_ENUM_DISCRIMINATORS, {
      stringValues: enumValues.filter(v => typeof v === "string")
    });
  }
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformDecoder)(prefix, value => {
    const discriminator = Number(value);
    const index = getEnumIndexFromDiscriminator({
      discriminator,
      enumKeys,
      enumValues,
      useValuesAsDiscriminators
    });
    if (index < 0) {
      const validDiscriminators = useValuesAsDiscriminators ? numericalValues : [...Array(enumKeys.length).keys()];
      throw new _solana_errors__WEBPACK_IMPORTED_MODULE_2__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_2__.SOLANA_ERROR__CODECS__ENUM_DISCRIMINATOR_OUT_OF_RANGE, {
        discriminator,
        formattedValidDiscriminators: formatNumericalValues(validDiscriminators),
        validDiscriminators
      });
    }
    return enumValues[index];
  });
}
function getEnumCodec(constructor, config = {}) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.combineCodec)(getEnumEncoder(constructor, config), getEnumDecoder(constructor, config));
}
var getScalarEnumEncoder = getEnumEncoder;
var getScalarEnumDecoder = getEnumDecoder;
var getScalarEnumCodec = getEnumCodec;
function getHiddenPrefixEncoder(encoder, prefixedEncoders) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformEncoder)(getTupleEncoder([...prefixedEncoders, encoder]), value => [...prefixedEncoders.map(() => void 0), value]);
}
function getHiddenPrefixDecoder(decoder, prefixedDecoders) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformDecoder)(getTupleDecoder([...prefixedDecoders, decoder]), tuple => tuple[tuple.length - 1]);
}
function getHiddenPrefixCodec(codec, prefixedCodecs) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.combineCodec)(getHiddenPrefixEncoder(codec, prefixedCodecs), getHiddenPrefixDecoder(codec, prefixedCodecs));
}
function getHiddenSuffixEncoder(encoder, suffixedEncoders) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformEncoder)(getTupleEncoder([encoder, ...suffixedEncoders]), value => [value, ...suffixedEncoders.map(() => void 0)]);
}
function getHiddenSuffixDecoder(decoder, suffixedDecoders) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformDecoder)(getTupleDecoder([decoder, ...suffixedDecoders]), tuple => tuple[0]);
}
function getHiddenSuffixCodec(codec, suffixedCodecs) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.combineCodec)(getHiddenSuffixEncoder(codec, suffixedCodecs), getHiddenSuffixDecoder(codec, suffixedCodecs));
}
function getMapEncoder(key, value, config = {}) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformEncoder)(getArrayEncoder(getTupleEncoder([key, value]), config), map => [...map.entries()]);
}
function getMapDecoder(key, value, config = {}) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformDecoder)(getArrayDecoder(getTupleDecoder([key, value]), config), entries => new Map(entries));
}
function getMapCodec(key, value, config = {}) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.combineCodec)(getMapEncoder(key, value, config), getMapDecoder(key, value, config));
}
function getUnitEncoder() {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createEncoder)({
    fixedSize: 0,
    write: (_value, _bytes, offset) => offset
  });
}
function getUnitDecoder() {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createDecoder)({
    fixedSize: 0,
    read: (_bytes, offset) => [void 0, offset]
  });
}
function getUnitCodec() {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.combineCodec)(getUnitEncoder(), getUnitDecoder());
}

// src/nullable.ts
function getNullableEncoder(item, config = {}) {
  const prefix = (() => {
    if (config.prefix === null) {
      return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformEncoder)(getUnitEncoder(), _boolean => void 0);
    }
    return getBooleanEncoder({
      size: config.prefix ?? (0,_solana_codecs_numbers__WEBPACK_IMPORTED_MODULE_1__.getU8Encoder)()
    });
  })();
  const noneValue = (() => {
    if (config.noneValue === "zeroes") {
      (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.assertIsFixedSize)(item);
      return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.fixEncoderSize)(getUnitEncoder(), item.fixedSize);
    }
    if (!config.noneValue) {
      return getUnitEncoder();
    }
    return getConstantEncoder(config.noneValue);
  })();
  return getUnionEncoder([(0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformEncoder)(getTupleEncoder([prefix, noneValue]), _value => [false, void 0]), (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformEncoder)(getTupleEncoder([prefix, item]), value => [true, value])], variant => Number(variant !== null));
}
function getNullableDecoder(item, config = {}) {
  const prefix = (() => {
    if (config.prefix === null) {
      return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformDecoder)(getUnitDecoder(), () => false);
    }
    return getBooleanDecoder({
      size: config.prefix ?? (0,_solana_codecs_numbers__WEBPACK_IMPORTED_MODULE_1__.getU8Decoder)()
    });
  })();
  const noneValue = (() => {
    if (config.noneValue === "zeroes") {
      (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.assertIsFixedSize)(item);
      return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.fixDecoderSize)(getUnitDecoder(), item.fixedSize);
    }
    if (!config.noneValue) {
      return getUnitDecoder();
    }
    return getConstantDecoder(config.noneValue);
  })();
  return getUnionDecoder([(0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformDecoder)(getTupleDecoder([prefix, noneValue]), () => null), (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformDecoder)(getTupleDecoder([prefix, item]), ([, value]) => value)], (bytes, offset) => {
    if (config.prefix === null && !config.noneValue) {
      return Number(offset < bytes.length);
    }
    if (config.prefix === null && config.noneValue != null) {
      const zeroValue = config.noneValue === "zeroes" ? new Uint8Array(noneValue.fixedSize).fill(0) : config.noneValue;
      return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.containsBytes)(bytes, zeroValue, offset) ? 0 : 1;
    }
    return Number(prefix.read(bytes, offset)[0]);
  });
}
function getNullableCodec(item, config = {}) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.combineCodec)(getNullableEncoder(item, config), getNullableDecoder(item, config));
}
function getSetEncoder(item, config = {}) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformEncoder)(getArrayEncoder(item, config), set => [...set]);
}
function getSetDecoder(item, config = {}) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.transformDecoder)(getArrayDecoder(item, config), entries => new Set(entries));
}
function getSetCodec(item, config = {}) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.combineCodec)(getSetEncoder(item, config), getSetDecoder(item, config));
}
function getStructEncoder(fields) {
  const fieldCodecs = fields.map(([, codec]) => codec);
  const fixedSize = sumCodecSizes(fieldCodecs.map(getFixedSize));
  const maxSize = sumCodecSizes(fieldCodecs.map(getMaxSize)) ?? void 0;
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createEncoder)({
    ...(fixedSize === null ? {
      getSizeFromValue: value => fields.map(([key, codec]) => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.getEncodedSize)(value[key], codec)).reduce((all, one) => all + one, 0),
      maxSize
    } : {
      fixedSize
    }),
    write: (struct, bytes, offset) => {
      fields.forEach(([key, codec]) => {
        offset = codec.write(struct[key], bytes, offset);
      });
      return offset;
    }
  });
}
function getStructDecoder(fields) {
  const fieldCodecs = fields.map(([, codec]) => codec);
  const fixedSize = sumCodecSizes(fieldCodecs.map(getFixedSize));
  const maxSize = sumCodecSizes(fieldCodecs.map(getMaxSize)) ?? void 0;
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.createDecoder)({
    ...(fixedSize === null ? {
      maxSize
    } : {
      fixedSize
    }),
    read: (bytes, offset) => {
      const struct = {};
      fields.forEach(([key, codec]) => {
        const [value, newOffset] = codec.read(bytes, offset);
        offset = newOffset;
        struct[key] = value;
      });
      return [struct, offset];
    }
  });
}
function getStructCodec(fields) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_0__.combineCodec)(getStructEncoder(fields), getStructDecoder(fields));
}


//# sourceMappingURL=index.browser.mjs.map

/***/ },

/***/ 1565
/*!********************************************************************!*\
  !*** ./node_modules/@solana/codecs-numbers/dist/index.browser.mjs ***!
  \********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Endian: () => (/* binding */ Endian),
/* harmony export */   assertNumberIsBetweenForCodec: () => (/* binding */ assertNumberIsBetweenForCodec),
/* harmony export */   getF32Codec: () => (/* binding */ getF32Codec),
/* harmony export */   getF32Decoder: () => (/* binding */ getF32Decoder),
/* harmony export */   getF32Encoder: () => (/* binding */ getF32Encoder),
/* harmony export */   getF64Codec: () => (/* binding */ getF64Codec),
/* harmony export */   getF64Decoder: () => (/* binding */ getF64Decoder),
/* harmony export */   getF64Encoder: () => (/* binding */ getF64Encoder),
/* harmony export */   getI128Codec: () => (/* binding */ getI128Codec),
/* harmony export */   getI128Decoder: () => (/* binding */ getI128Decoder),
/* harmony export */   getI128Encoder: () => (/* binding */ getI128Encoder),
/* harmony export */   getI16Codec: () => (/* binding */ getI16Codec),
/* harmony export */   getI16Decoder: () => (/* binding */ getI16Decoder),
/* harmony export */   getI16Encoder: () => (/* binding */ getI16Encoder),
/* harmony export */   getI32Codec: () => (/* binding */ getI32Codec),
/* harmony export */   getI32Decoder: () => (/* binding */ getI32Decoder),
/* harmony export */   getI32Encoder: () => (/* binding */ getI32Encoder),
/* harmony export */   getI64Codec: () => (/* binding */ getI64Codec),
/* harmony export */   getI64Decoder: () => (/* binding */ getI64Decoder),
/* harmony export */   getI64Encoder: () => (/* binding */ getI64Encoder),
/* harmony export */   getI8Codec: () => (/* binding */ getI8Codec),
/* harmony export */   getI8Decoder: () => (/* binding */ getI8Decoder),
/* harmony export */   getI8Encoder: () => (/* binding */ getI8Encoder),
/* harmony export */   getShortU16Codec: () => (/* binding */ getShortU16Codec),
/* harmony export */   getShortU16Decoder: () => (/* binding */ getShortU16Decoder),
/* harmony export */   getShortU16Encoder: () => (/* binding */ getShortU16Encoder),
/* harmony export */   getU128Codec: () => (/* binding */ getU128Codec),
/* harmony export */   getU128Decoder: () => (/* binding */ getU128Decoder),
/* harmony export */   getU128Encoder: () => (/* binding */ getU128Encoder),
/* harmony export */   getU16Codec: () => (/* binding */ getU16Codec),
/* harmony export */   getU16Decoder: () => (/* binding */ getU16Decoder),
/* harmony export */   getU16Encoder: () => (/* binding */ getU16Encoder),
/* harmony export */   getU32Codec: () => (/* binding */ getU32Codec),
/* harmony export */   getU32Decoder: () => (/* binding */ getU32Decoder),
/* harmony export */   getU32Encoder: () => (/* binding */ getU32Encoder),
/* harmony export */   getU64Codec: () => (/* binding */ getU64Codec),
/* harmony export */   getU64Decoder: () => (/* binding */ getU64Decoder),
/* harmony export */   getU64Encoder: () => (/* binding */ getU64Encoder),
/* harmony export */   getU8Codec: () => (/* binding */ getU8Codec),
/* harmony export */   getU8Decoder: () => (/* binding */ getU8Decoder),
/* harmony export */   getU8Encoder: () => (/* binding */ getU8Encoder)
/* harmony export */ });
/* harmony import */ var _solana_errors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/errors */ 80970);
/* harmony import */ var _solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/codecs-core */ 37750);



// src/assertions.ts
function assertNumberIsBetweenForCodec(codecDescription, min, max, value) {
  if (value < min || value > max) {
    throw new _solana_errors__WEBPACK_IMPORTED_MODULE_0__.SolanaError(_solana_errors__WEBPACK_IMPORTED_MODULE_0__.SOLANA_ERROR__CODECS__NUMBER_OUT_OF_RANGE, {
      codecDescription,
      max,
      min,
      value
    });
  }
}

// src/common.ts
var Endian = /* @__PURE__ */(Endian2 => {
  Endian2[Endian2["Little"] = 0] = "Little";
  Endian2[Endian2["Big"] = 1] = "Big";
  return Endian2;
})(Endian || {});
function isLittleEndian(config) {
  return config?.endian === 1 /* Big */ ? false : true;
}
function numberEncoderFactory(input) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.createEncoder)({
    fixedSize: input.size,
    write(value, bytes, offset) {
      if (input.range) {
        assertNumberIsBetweenForCodec(input.name, input.range[0], input.range[1], value);
      }
      const arrayBuffer = new ArrayBuffer(input.size);
      input.set(new DataView(arrayBuffer), value, isLittleEndian(input.config));
      bytes.set(new Uint8Array(arrayBuffer), offset);
      return offset + input.size;
    }
  });
}
function numberDecoderFactory(input) {
  return (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.createDecoder)({
    fixedSize: input.size,
    read(bytes, offset = 0) {
      (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.assertByteArrayIsNotEmptyForCodec)(input.name, bytes, offset);
      (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.assertByteArrayHasEnoughBytesForCodec)(input.name, input.size, bytes, offset);
      const view = new DataView(toArrayBuffer(bytes, offset, input.size));
      return [input.get(view, isLittleEndian(input.config)), offset + input.size];
    }
  });
}
function toArrayBuffer(bytes, offset, length) {
  const bytesOffset = bytes.byteOffset + (offset ?? 0);
  const bytesLength = length ?? bytes.byteLength;
  return bytes.buffer.slice(bytesOffset, bytesOffset + bytesLength);
}

// src/f32.ts
var getF32Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "f32",
  set: (view, value, le) => view.setFloat32(0, Number(value), le),
  size: 4
});
var getF32Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => view.getFloat32(0, le),
  name: "f32",
  size: 4
});
var getF32Codec = (config = {}) => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.combineCodec)(getF32Encoder(config), getF32Decoder(config));
var getF64Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "f64",
  set: (view, value, le) => view.setFloat64(0, Number(value), le),
  size: 8
});
var getF64Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => view.getFloat64(0, le),
  name: "f64",
  size: 8
});
var getF64Codec = (config = {}) => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.combineCodec)(getF64Encoder(config), getF64Decoder(config));
var getI128Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "i128",
  range: [-BigInt("0x7fffffffffffffffffffffffffffffff") - 1n, BigInt("0x7fffffffffffffffffffffffffffffff")],
  set: (view, value, le) => {
    const leftOffset = le ? 8 : 0;
    const rightOffset = le ? 0 : 8;
    const rightMask = 0xffffffffffffffffn;
    view.setBigInt64(leftOffset, BigInt(value) >> 64n, le);
    view.setBigUint64(rightOffset, BigInt(value) & rightMask, le);
  },
  size: 16
});
var getI128Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => {
    const leftOffset = le ? 8 : 0;
    const rightOffset = le ? 0 : 8;
    const left = view.getBigInt64(leftOffset, le);
    const right = view.getBigUint64(rightOffset, le);
    return (left << 64n) + right;
  },
  name: "i128",
  size: 16
});
var getI128Codec = (config = {}) => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.combineCodec)(getI128Encoder(config), getI128Decoder(config));
var getI16Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "i16",
  range: [-Number("0x7fff") - 1, Number("0x7fff")],
  set: (view, value, le) => view.setInt16(0, Number(value), le),
  size: 2
});
var getI16Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => view.getInt16(0, le),
  name: "i16",
  size: 2
});
var getI16Codec = (config = {}) => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.combineCodec)(getI16Encoder(config), getI16Decoder(config));
var getI32Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "i32",
  range: [-Number("0x7fffffff") - 1, Number("0x7fffffff")],
  set: (view, value, le) => view.setInt32(0, Number(value), le),
  size: 4
});
var getI32Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => view.getInt32(0, le),
  name: "i32",
  size: 4
});
var getI32Codec = (config = {}) => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.combineCodec)(getI32Encoder(config), getI32Decoder(config));
var getI64Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "i64",
  range: [-BigInt("0x7fffffffffffffff") - 1n, BigInt("0x7fffffffffffffff")],
  set: (view, value, le) => view.setBigInt64(0, BigInt(value), le),
  size: 8
});
var getI64Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => view.getBigInt64(0, le),
  name: "i64",
  size: 8
});
var getI64Codec = (config = {}) => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.combineCodec)(getI64Encoder(config), getI64Decoder(config));
var getI8Encoder = () => numberEncoderFactory({
  name: "i8",
  range: [-Number("0x7f") - 1, Number("0x7f")],
  set: (view, value) => view.setInt8(0, Number(value)),
  size: 1
});
var getI8Decoder = () => numberDecoderFactory({
  get: view => view.getInt8(0),
  name: "i8",
  size: 1
});
var getI8Codec = () => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.combineCodec)(getI8Encoder(), getI8Decoder());
var getShortU16Encoder = () => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.createEncoder)({
  getSizeFromValue: value => {
    if (value <= 127) return 1;
    if (value <= 16383) return 2;
    return 3;
  },
  maxSize: 3,
  write: (value, bytes, offset) => {
    assertNumberIsBetweenForCodec("shortU16", 0, 65535, value);
    const shortU16Bytes = [0];
    for (let ii = 0;; ii += 1) {
      const alignedValue = Number(value) >> ii * 7;
      if (alignedValue === 0) {
        break;
      }
      const nextSevenBits = 127 & alignedValue;
      shortU16Bytes[ii] = nextSevenBits;
      if (ii > 0) {
        shortU16Bytes[ii - 1] |= 128;
      }
    }
    bytes.set(shortU16Bytes, offset);
    return offset + shortU16Bytes.length;
  }
});
var getShortU16Decoder = () => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.createDecoder)({
  maxSize: 3,
  read: (bytes, offset) => {
    let value = 0;
    let byteCount = 0;
    while (++byteCount) {
      const byteIndex = byteCount - 1;
      const currentByte = bytes[offset + byteIndex];
      const nextSevenBits = 127 & currentByte;
      value |= nextSevenBits << byteIndex * 7;
      if ((currentByte & 128) === 0) {
        break;
      }
    }
    return [value, offset + byteCount];
  }
});
var getShortU16Codec = () => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.combineCodec)(getShortU16Encoder(), getShortU16Decoder());
var getU128Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "u128",
  range: [0n, BigInt("0xffffffffffffffffffffffffffffffff")],
  set: (view, value, le) => {
    const leftOffset = le ? 8 : 0;
    const rightOffset = le ? 0 : 8;
    const rightMask = 0xffffffffffffffffn;
    view.setBigUint64(leftOffset, BigInt(value) >> 64n, le);
    view.setBigUint64(rightOffset, BigInt(value) & rightMask, le);
  },
  size: 16
});
var getU128Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => {
    const leftOffset = le ? 8 : 0;
    const rightOffset = le ? 0 : 8;
    const left = view.getBigUint64(leftOffset, le);
    const right = view.getBigUint64(rightOffset, le);
    return (left << 64n) + right;
  },
  name: "u128",
  size: 16
});
var getU128Codec = (config = {}) => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.combineCodec)(getU128Encoder(config), getU128Decoder(config));
var getU16Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "u16",
  range: [0, Number("0xffff")],
  set: (view, value, le) => view.setUint16(0, Number(value), le),
  size: 2
});
var getU16Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => view.getUint16(0, le),
  name: "u16",
  size: 2
});
var getU16Codec = (config = {}) => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.combineCodec)(getU16Encoder(config), getU16Decoder(config));
var getU32Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "u32",
  range: [0, Number("0xffffffff")],
  set: (view, value, le) => view.setUint32(0, Number(value), le),
  size: 4
});
var getU32Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => view.getUint32(0, le),
  name: "u32",
  size: 4
});
var getU32Codec = (config = {}) => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.combineCodec)(getU32Encoder(config), getU32Decoder(config));
var getU64Encoder = (config = {}) => numberEncoderFactory({
  config,
  name: "u64",
  range: [0n, BigInt("0xffffffffffffffff")],
  set: (view, value, le) => view.setBigUint64(0, BigInt(value), le),
  size: 8
});
var getU64Decoder = (config = {}) => numberDecoderFactory({
  config,
  get: (view, le) => view.getBigUint64(0, le),
  name: "u64",
  size: 8
});
var getU64Codec = (config = {}) => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.combineCodec)(getU64Encoder(config), getU64Decoder(config));
var getU8Encoder = () => numberEncoderFactory({
  name: "u8",
  range: [0, Number("0xff")],
  set: (view, value) => view.setUint8(0, Number(value)),
  size: 1
});
var getU8Decoder = () => numberDecoderFactory({
  get: view => view.getUint8(0),
  name: "u8",
  size: 1
});
var getU8Codec = () => (0,_solana_codecs_core__WEBPACK_IMPORTED_MODULE_1__.combineCodec)(getU8Encoder(), getU8Decoder());


//# sourceMappingURL=index.browser.mjs.map

/***/ },

/***/ 80970
/*!************************************************************!*\
  !*** ./node_modules/@solana/errors/dist/index.browser.mjs ***!
  \************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SOLANA_ERROR__ACCOUNTS__ACCOUNT_NOT_FOUND: () => (/* binding */ SOLANA_ERROR__ACCOUNTS__ACCOUNT_NOT_FOUND),
/* harmony export */   SOLANA_ERROR__ACCOUNTS__EXPECTED_ALL_ACCOUNTS_TO_BE_DECODED: () => (/* binding */ SOLANA_ERROR__ACCOUNTS__EXPECTED_ALL_ACCOUNTS_TO_BE_DECODED),
/* harmony export */   SOLANA_ERROR__ACCOUNTS__EXPECTED_DECODED_ACCOUNT: () => (/* binding */ SOLANA_ERROR__ACCOUNTS__EXPECTED_DECODED_ACCOUNT),
/* harmony export */   SOLANA_ERROR__ACCOUNTS__FAILED_TO_DECODE_ACCOUNT: () => (/* binding */ SOLANA_ERROR__ACCOUNTS__FAILED_TO_DECODE_ACCOUNT),
/* harmony export */   SOLANA_ERROR__ACCOUNTS__ONE_OR_MORE_ACCOUNTS_NOT_FOUND: () => (/* binding */ SOLANA_ERROR__ACCOUNTS__ONE_OR_MORE_ACCOUNTS_NOT_FOUND),
/* harmony export */   SOLANA_ERROR__ADDRESSES__FAILED_TO_FIND_VIABLE_PDA_BUMP_SEED: () => (/* binding */ SOLANA_ERROR__ADDRESSES__FAILED_TO_FIND_VIABLE_PDA_BUMP_SEED),
/* harmony export */   SOLANA_ERROR__ADDRESSES__INVALID_BASE58_ENCODED_ADDRESS: () => (/* binding */ SOLANA_ERROR__ADDRESSES__INVALID_BASE58_ENCODED_ADDRESS),
/* harmony export */   SOLANA_ERROR__ADDRESSES__INVALID_BYTE_LENGTH: () => (/* binding */ SOLANA_ERROR__ADDRESSES__INVALID_BYTE_LENGTH),
/* harmony export */   SOLANA_ERROR__ADDRESSES__INVALID_ED25519_PUBLIC_KEY: () => (/* binding */ SOLANA_ERROR__ADDRESSES__INVALID_ED25519_PUBLIC_KEY),
/* harmony export */   SOLANA_ERROR__ADDRESSES__INVALID_SEEDS_POINT_ON_CURVE: () => (/* binding */ SOLANA_ERROR__ADDRESSES__INVALID_SEEDS_POINT_ON_CURVE),
/* harmony export */   SOLANA_ERROR__ADDRESSES__MALFORMED_PDA: () => (/* binding */ SOLANA_ERROR__ADDRESSES__MALFORMED_PDA),
/* harmony export */   SOLANA_ERROR__ADDRESSES__MAX_NUMBER_OF_PDA_SEEDS_EXCEEDED: () => (/* binding */ SOLANA_ERROR__ADDRESSES__MAX_NUMBER_OF_PDA_SEEDS_EXCEEDED),
/* harmony export */   SOLANA_ERROR__ADDRESSES__MAX_PDA_SEED_LENGTH_EXCEEDED: () => (/* binding */ SOLANA_ERROR__ADDRESSES__MAX_PDA_SEED_LENGTH_EXCEEDED),
/* harmony export */   SOLANA_ERROR__ADDRESSES__PDA_BUMP_SEED_OUT_OF_RANGE: () => (/* binding */ SOLANA_ERROR__ADDRESSES__PDA_BUMP_SEED_OUT_OF_RANGE),
/* harmony export */   SOLANA_ERROR__ADDRESSES__PDA_ENDS_WITH_PDA_MARKER: () => (/* binding */ SOLANA_ERROR__ADDRESSES__PDA_ENDS_WITH_PDA_MARKER),
/* harmony export */   SOLANA_ERROR__ADDRESSES__STRING_LENGTH_OUT_OF_RANGE: () => (/* binding */ SOLANA_ERROR__ADDRESSES__STRING_LENGTH_OUT_OF_RANGE),
/* harmony export */   SOLANA_ERROR__BLOCKHASH_STRING_LENGTH_OUT_OF_RANGE: () => (/* binding */ SOLANA_ERROR__BLOCKHASH_STRING_LENGTH_OUT_OF_RANGE),
/* harmony export */   SOLANA_ERROR__BLOCK_HEIGHT_EXCEEDED: () => (/* binding */ SOLANA_ERROR__BLOCK_HEIGHT_EXCEEDED),
/* harmony export */   SOLANA_ERROR__CODECS__CANNOT_DECODE_EMPTY_BYTE_ARRAY: () => (/* binding */ SOLANA_ERROR__CODECS__CANNOT_DECODE_EMPTY_BYTE_ARRAY),
/* harmony export */   SOLANA_ERROR__CODECS__CANNOT_USE_LEXICAL_VALUES_AS_ENUM_DISCRIMINATORS: () => (/* binding */ SOLANA_ERROR__CODECS__CANNOT_USE_LEXICAL_VALUES_AS_ENUM_DISCRIMINATORS),
/* harmony export */   SOLANA_ERROR__CODECS__ENCODED_BYTES_MUST_NOT_INCLUDE_SENTINEL: () => (/* binding */ SOLANA_ERROR__CODECS__ENCODED_BYTES_MUST_NOT_INCLUDE_SENTINEL),
/* harmony export */   SOLANA_ERROR__CODECS__ENCODER_DECODER_FIXED_SIZE_MISMATCH: () => (/* binding */ SOLANA_ERROR__CODECS__ENCODER_DECODER_FIXED_SIZE_MISMATCH),
/* harmony export */   SOLANA_ERROR__CODECS__ENCODER_DECODER_MAX_SIZE_MISMATCH: () => (/* binding */ SOLANA_ERROR__CODECS__ENCODER_DECODER_MAX_SIZE_MISMATCH),
/* harmony export */   SOLANA_ERROR__CODECS__ENCODER_DECODER_SIZE_COMPATIBILITY_MISMATCH: () => (/* binding */ SOLANA_ERROR__CODECS__ENCODER_DECODER_SIZE_COMPATIBILITY_MISMATCH),
/* harmony export */   SOLANA_ERROR__CODECS__ENUM_DISCRIMINATOR_OUT_OF_RANGE: () => (/* binding */ SOLANA_ERROR__CODECS__ENUM_DISCRIMINATOR_OUT_OF_RANGE),
/* harmony export */   SOLANA_ERROR__CODECS__EXPECTED_FIXED_LENGTH: () => (/* binding */ SOLANA_ERROR__CODECS__EXPECTED_FIXED_LENGTH),
/* harmony export */   SOLANA_ERROR__CODECS__EXPECTED_POSITIVE_BYTE_LENGTH: () => (/* binding */ SOLANA_ERROR__CODECS__EXPECTED_POSITIVE_BYTE_LENGTH),
/* harmony export */   SOLANA_ERROR__CODECS__EXPECTED_VARIABLE_LENGTH: () => (/* binding */ SOLANA_ERROR__CODECS__EXPECTED_VARIABLE_LENGTH),
/* harmony export */   SOLANA_ERROR__CODECS__EXPECTED_ZERO_VALUE_TO_MATCH_ITEM_FIXED_SIZE: () => (/* binding */ SOLANA_ERROR__CODECS__EXPECTED_ZERO_VALUE_TO_MATCH_ITEM_FIXED_SIZE),
/* harmony export */   SOLANA_ERROR__CODECS__INVALID_BYTE_LENGTH: () => (/* binding */ SOLANA_ERROR__CODECS__INVALID_BYTE_LENGTH),
/* harmony export */   SOLANA_ERROR__CODECS__INVALID_CONSTANT: () => (/* binding */ SOLANA_ERROR__CODECS__INVALID_CONSTANT),
/* harmony export */   SOLANA_ERROR__CODECS__INVALID_DISCRIMINATED_UNION_VARIANT: () => (/* binding */ SOLANA_ERROR__CODECS__INVALID_DISCRIMINATED_UNION_VARIANT),
/* harmony export */   SOLANA_ERROR__CODECS__INVALID_ENUM_VARIANT: () => (/* binding */ SOLANA_ERROR__CODECS__INVALID_ENUM_VARIANT),
/* harmony export */   SOLANA_ERROR__CODECS__INVALID_LITERAL_UNION_VARIANT: () => (/* binding */ SOLANA_ERROR__CODECS__INVALID_LITERAL_UNION_VARIANT),
/* harmony export */   SOLANA_ERROR__CODECS__INVALID_NUMBER_OF_ITEMS: () => (/* binding */ SOLANA_ERROR__CODECS__INVALID_NUMBER_OF_ITEMS),
/* harmony export */   SOLANA_ERROR__CODECS__INVALID_STRING_FOR_BASE: () => (/* binding */ SOLANA_ERROR__CODECS__INVALID_STRING_FOR_BASE),
/* harmony export */   SOLANA_ERROR__CODECS__LITERAL_UNION_DISCRIMINATOR_OUT_OF_RANGE: () => (/* binding */ SOLANA_ERROR__CODECS__LITERAL_UNION_DISCRIMINATOR_OUT_OF_RANGE),
/* harmony export */   SOLANA_ERROR__CODECS__NUMBER_OUT_OF_RANGE: () => (/* binding */ SOLANA_ERROR__CODECS__NUMBER_OUT_OF_RANGE),
/* harmony export */   SOLANA_ERROR__CODECS__OFFSET_OUT_OF_RANGE: () => (/* binding */ SOLANA_ERROR__CODECS__OFFSET_OUT_OF_RANGE),
/* harmony export */   SOLANA_ERROR__CODECS__SENTINEL_MISSING_IN_DECODED_BYTES: () => (/* binding */ SOLANA_ERROR__CODECS__SENTINEL_MISSING_IN_DECODED_BYTES),
/* harmony export */   SOLANA_ERROR__CODECS__UNION_VARIANT_OUT_OF_RANGE: () => (/* binding */ SOLANA_ERROR__CODECS__UNION_VARIANT_OUT_OF_RANGE),
/* harmony export */   SOLANA_ERROR__CRYPTO__RANDOM_VALUES_FUNCTION_UNIMPLEMENTED: () => (/* binding */ SOLANA_ERROR__CRYPTO__RANDOM_VALUES_FUNCTION_UNIMPLEMENTED),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_ALREADY_INITIALIZED: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_ALREADY_INITIALIZED),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_BORROW_FAILED: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_BORROW_FAILED),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_BORROW_OUTSTANDING: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_BORROW_OUTSTANDING),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_DATA_SIZE_CHANGED: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_DATA_SIZE_CHANGED),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_DATA_TOO_SMALL: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_DATA_TOO_SMALL),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_NOT_EXECUTABLE: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_NOT_EXECUTABLE),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_NOT_RENT_EXEMPT: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_NOT_RENT_EXEMPT),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__ARITHMETIC_OVERFLOW: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__ARITHMETIC_OVERFLOW),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__BORSH_IO_ERROR: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__BORSH_IO_ERROR),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__BUILTIN_PROGRAMS_MUST_CONSUME_COMPUTE_UNITS: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__BUILTIN_PROGRAMS_MUST_CONSUME_COMPUTE_UNITS),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__CALL_DEPTH: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__CALL_DEPTH),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__COMPUTATIONAL_BUDGET_EXCEEDED: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__COMPUTATIONAL_BUDGET_EXCEEDED),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__DUPLICATE_ACCOUNT_INDEX: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__DUPLICATE_ACCOUNT_INDEX),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__DUPLICATE_ACCOUNT_OUT_OF_SYNC: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__DUPLICATE_ACCOUNT_OUT_OF_SYNC),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__EXECUTABLE_ACCOUNT_NOT_RENT_EXEMPT: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__EXECUTABLE_ACCOUNT_NOT_RENT_EXEMPT),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__EXECUTABLE_DATA_MODIFIED: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__EXECUTABLE_DATA_MODIFIED),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__EXECUTABLE_LAMPORT_CHANGE: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__EXECUTABLE_LAMPORT_CHANGE),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__EXECUTABLE_MODIFIED: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__EXECUTABLE_MODIFIED),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__EXTERNAL_ACCOUNT_DATA_MODIFIED: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__EXTERNAL_ACCOUNT_DATA_MODIFIED),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__EXTERNAL_ACCOUNT_LAMPORT_SPEND: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__EXTERNAL_ACCOUNT_LAMPORT_SPEND),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__GENERIC_ERROR: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__GENERIC_ERROR),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__ILLEGAL_OWNER: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__ILLEGAL_OWNER),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__IMMUTABLE: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__IMMUTABLE),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__INCORRECT_AUTHORITY: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__INCORRECT_AUTHORITY),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__INCORRECT_PROGRAM_ID: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__INCORRECT_PROGRAM_ID),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__INSUFFICIENT_FUNDS: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__INSUFFICIENT_FUNDS),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_ACCOUNT_DATA: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_ACCOUNT_DATA),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_ACCOUNT_OWNER: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_ACCOUNT_OWNER),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_ARGUMENT: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_ARGUMENT),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_ERROR: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_ERROR),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_INSTRUCTION_DATA: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_INSTRUCTION_DATA),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_REALLOC: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_REALLOC),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_SEEDS: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_SEEDS),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__MAX_ACCOUNTS_DATA_ALLOCATIONS_EXCEEDED: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__MAX_ACCOUNTS_DATA_ALLOCATIONS_EXCEEDED),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__MAX_ACCOUNTS_EXCEEDED: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__MAX_ACCOUNTS_EXCEEDED),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__MAX_INSTRUCTION_TRACE_LENGTH_EXCEEDED: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__MAX_INSTRUCTION_TRACE_LENGTH_EXCEEDED),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__MAX_SEED_LENGTH_EXCEEDED: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__MAX_SEED_LENGTH_EXCEEDED),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__MISSING_ACCOUNT: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__MISSING_ACCOUNT),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__MISSING_REQUIRED_SIGNATURE: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__MISSING_REQUIRED_SIGNATURE),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__MODIFIED_PROGRAM_ID: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__MODIFIED_PROGRAM_ID),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__NOT_ENOUGH_ACCOUNT_KEYS: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__NOT_ENOUGH_ACCOUNT_KEYS),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__PRIVILEGE_ESCALATION: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__PRIVILEGE_ESCALATION),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__PROGRAM_ENVIRONMENT_SETUP_FAILURE: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__PROGRAM_ENVIRONMENT_SETUP_FAILURE),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__PROGRAM_FAILED_TO_COMPILE: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__PROGRAM_FAILED_TO_COMPILE),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__PROGRAM_FAILED_TO_COMPLETE: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__PROGRAM_FAILED_TO_COMPLETE),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__READONLY_DATA_MODIFIED: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__READONLY_DATA_MODIFIED),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__READONLY_LAMPORT_CHANGE: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__READONLY_LAMPORT_CHANGE),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__REENTRANCY_NOT_ALLOWED: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__REENTRANCY_NOT_ALLOWED),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__RENT_EPOCH_MODIFIED: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__RENT_EPOCH_MODIFIED),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__UNBALANCED_INSTRUCTION: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__UNBALANCED_INSTRUCTION),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__UNINITIALIZED_ACCOUNT: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__UNINITIALIZED_ACCOUNT),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__UNKNOWN: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__UNKNOWN),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__UNSUPPORTED_PROGRAM_ID: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__UNSUPPORTED_PROGRAM_ID),
/* harmony export */   SOLANA_ERROR__INSTRUCTION_ERROR__UNSUPPORTED_SYSVAR: () => (/* binding */ SOLANA_ERROR__INSTRUCTION_ERROR__UNSUPPORTED_SYSVAR),
/* harmony export */   SOLANA_ERROR__INSTRUCTION__EXPECTED_TO_HAVE_ACCOUNTS: () => (/* binding */ SOLANA_ERROR__INSTRUCTION__EXPECTED_TO_HAVE_ACCOUNTS),
/* harmony export */   SOLANA_ERROR__INSTRUCTION__EXPECTED_TO_HAVE_DATA: () => (/* binding */ SOLANA_ERROR__INSTRUCTION__EXPECTED_TO_HAVE_DATA),
/* harmony export */   SOLANA_ERROR__INSTRUCTION__PROGRAM_ID_MISMATCH: () => (/* binding */ SOLANA_ERROR__INSTRUCTION__PROGRAM_ID_MISMATCH),
/* harmony export */   SOLANA_ERROR__INVALID_BLOCKHASH_BYTE_LENGTH: () => (/* binding */ SOLANA_ERROR__INVALID_BLOCKHASH_BYTE_LENGTH),
/* harmony export */   SOLANA_ERROR__INVALID_NONCE: () => (/* binding */ SOLANA_ERROR__INVALID_NONCE),
/* harmony export */   SOLANA_ERROR__INVARIANT_VIOLATION__CACHED_ABORTABLE_ITERABLE_CACHE_ENTRY_MISSING: () => (/* binding */ SOLANA_ERROR__INVARIANT_VIOLATION__CACHED_ABORTABLE_ITERABLE_CACHE_ENTRY_MISSING),
/* harmony export */   SOLANA_ERROR__INVARIANT_VIOLATION__SWITCH_MUST_BE_EXHAUSTIVE: () => (/* binding */ SOLANA_ERROR__INVARIANT_VIOLATION__SWITCH_MUST_BE_EXHAUSTIVE),
/* harmony export */   SOLANA_ERROR__INVARIANT_VIOLATION__WEBSOCKET_MESSAGE_ITERATOR_MUST_NOT_POLL_BEFORE_RESOLVING_EXISTING_MESSAGE_PROMISE: () => (/* binding */ SOLANA_ERROR__INVARIANT_VIOLATION__WEBSOCKET_MESSAGE_ITERATOR_MUST_NOT_POLL_BEFORE_RESOLVING_EXISTING_MESSAGE_PROMISE),
/* harmony export */   SOLANA_ERROR__INVARIANT_VIOLATION__WEBSOCKET_MESSAGE_ITERATOR_STATE_MISSING: () => (/* binding */ SOLANA_ERROR__INVARIANT_VIOLATION__WEBSOCKET_MESSAGE_ITERATOR_STATE_MISSING),
/* harmony export */   SOLANA_ERROR__JSON_RPC__INTERNAL_ERROR: () => (/* binding */ SOLANA_ERROR__JSON_RPC__INTERNAL_ERROR),
/* harmony export */   SOLANA_ERROR__JSON_RPC__INVALID_PARAMS: () => (/* binding */ SOLANA_ERROR__JSON_RPC__INVALID_PARAMS),
/* harmony export */   SOLANA_ERROR__JSON_RPC__INVALID_REQUEST: () => (/* binding */ SOLANA_ERROR__JSON_RPC__INVALID_REQUEST),
/* harmony export */   SOLANA_ERROR__JSON_RPC__METHOD_NOT_FOUND: () => (/* binding */ SOLANA_ERROR__JSON_RPC__METHOD_NOT_FOUND),
/* harmony export */   SOLANA_ERROR__JSON_RPC__PARSE_ERROR: () => (/* binding */ SOLANA_ERROR__JSON_RPC__PARSE_ERROR),
/* harmony export */   SOLANA_ERROR__JSON_RPC__SCAN_ERROR: () => (/* binding */ SOLANA_ERROR__JSON_RPC__SCAN_ERROR),
/* harmony export */   SOLANA_ERROR__JSON_RPC__SERVER_ERROR_BLOCK_CLEANED_UP: () => (/* binding */ SOLANA_ERROR__JSON_RPC__SERVER_ERROR_BLOCK_CLEANED_UP),
/* harmony export */   SOLANA_ERROR__JSON_RPC__SERVER_ERROR_BLOCK_NOT_AVAILABLE: () => (/* binding */ SOLANA_ERROR__JSON_RPC__SERVER_ERROR_BLOCK_NOT_AVAILABLE),
/* harmony export */   SOLANA_ERROR__JSON_RPC__SERVER_ERROR_BLOCK_STATUS_NOT_AVAILABLE_YET: () => (/* binding */ SOLANA_ERROR__JSON_RPC__SERVER_ERROR_BLOCK_STATUS_NOT_AVAILABLE_YET),
/* harmony export */   SOLANA_ERROR__JSON_RPC__SERVER_ERROR_KEY_EXCLUDED_FROM_SECONDARY_INDEX: () => (/* binding */ SOLANA_ERROR__JSON_RPC__SERVER_ERROR_KEY_EXCLUDED_FROM_SECONDARY_INDEX),
/* harmony export */   SOLANA_ERROR__JSON_RPC__SERVER_ERROR_LONG_TERM_STORAGE_SLOT_SKIPPED: () => (/* binding */ SOLANA_ERROR__JSON_RPC__SERVER_ERROR_LONG_TERM_STORAGE_SLOT_SKIPPED),
/* harmony export */   SOLANA_ERROR__JSON_RPC__SERVER_ERROR_MIN_CONTEXT_SLOT_NOT_REACHED: () => (/* binding */ SOLANA_ERROR__JSON_RPC__SERVER_ERROR_MIN_CONTEXT_SLOT_NOT_REACHED),
/* harmony export */   SOLANA_ERROR__JSON_RPC__SERVER_ERROR_NODE_UNHEALTHY: () => (/* binding */ SOLANA_ERROR__JSON_RPC__SERVER_ERROR_NODE_UNHEALTHY),
/* harmony export */   SOLANA_ERROR__JSON_RPC__SERVER_ERROR_NO_SNAPSHOT: () => (/* binding */ SOLANA_ERROR__JSON_RPC__SERVER_ERROR_NO_SNAPSHOT),
/* harmony export */   SOLANA_ERROR__JSON_RPC__SERVER_ERROR_SEND_TRANSACTION_PREFLIGHT_FAILURE: () => (/* binding */ SOLANA_ERROR__JSON_RPC__SERVER_ERROR_SEND_TRANSACTION_PREFLIGHT_FAILURE),
/* harmony export */   SOLANA_ERROR__JSON_RPC__SERVER_ERROR_SLOT_SKIPPED: () => (/* binding */ SOLANA_ERROR__JSON_RPC__SERVER_ERROR_SLOT_SKIPPED),
/* harmony export */   SOLANA_ERROR__JSON_RPC__SERVER_ERROR_TRANSACTION_HISTORY_NOT_AVAILABLE: () => (/* binding */ SOLANA_ERROR__JSON_RPC__SERVER_ERROR_TRANSACTION_HISTORY_NOT_AVAILABLE),
/* harmony export */   SOLANA_ERROR__JSON_RPC__SERVER_ERROR_TRANSACTION_PRECOMPILE_VERIFICATION_FAILURE: () => (/* binding */ SOLANA_ERROR__JSON_RPC__SERVER_ERROR_TRANSACTION_PRECOMPILE_VERIFICATION_FAILURE),
/* harmony export */   SOLANA_ERROR__JSON_RPC__SERVER_ERROR_TRANSACTION_SIGNATURE_LEN_MISMATCH: () => (/* binding */ SOLANA_ERROR__JSON_RPC__SERVER_ERROR_TRANSACTION_SIGNATURE_LEN_MISMATCH),
/* harmony export */   SOLANA_ERROR__JSON_RPC__SERVER_ERROR_TRANSACTION_SIGNATURE_VERIFICATION_FAILURE: () => (/* binding */ SOLANA_ERROR__JSON_RPC__SERVER_ERROR_TRANSACTION_SIGNATURE_VERIFICATION_FAILURE),
/* harmony export */   SOLANA_ERROR__JSON_RPC__SERVER_ERROR_UNSUPPORTED_TRANSACTION_VERSION: () => (/* binding */ SOLANA_ERROR__JSON_RPC__SERVER_ERROR_UNSUPPORTED_TRANSACTION_VERSION),
/* harmony export */   SOLANA_ERROR__KEYS__INVALID_KEY_PAIR_BYTE_LENGTH: () => (/* binding */ SOLANA_ERROR__KEYS__INVALID_KEY_PAIR_BYTE_LENGTH),
/* harmony export */   SOLANA_ERROR__KEYS__INVALID_PRIVATE_KEY_BYTE_LENGTH: () => (/* binding */ SOLANA_ERROR__KEYS__INVALID_PRIVATE_KEY_BYTE_LENGTH),
/* harmony export */   SOLANA_ERROR__KEYS__INVALID_SIGNATURE_BYTE_LENGTH: () => (/* binding */ SOLANA_ERROR__KEYS__INVALID_SIGNATURE_BYTE_LENGTH),
/* harmony export */   SOLANA_ERROR__KEYS__PUBLIC_KEY_MUST_MATCH_PRIVATE_KEY: () => (/* binding */ SOLANA_ERROR__KEYS__PUBLIC_KEY_MUST_MATCH_PRIVATE_KEY),
/* harmony export */   SOLANA_ERROR__KEYS__SIGNATURE_STRING_LENGTH_OUT_OF_RANGE: () => (/* binding */ SOLANA_ERROR__KEYS__SIGNATURE_STRING_LENGTH_OUT_OF_RANGE),
/* harmony export */   SOLANA_ERROR__LAMPORTS_OUT_OF_RANGE: () => (/* binding */ SOLANA_ERROR__LAMPORTS_OUT_OF_RANGE),
/* harmony export */   SOLANA_ERROR__MALFORMED_BIGINT_STRING: () => (/* binding */ SOLANA_ERROR__MALFORMED_BIGINT_STRING),
/* harmony export */   SOLANA_ERROR__MALFORMED_NUMBER_STRING: () => (/* binding */ SOLANA_ERROR__MALFORMED_NUMBER_STRING),
/* harmony export */   SOLANA_ERROR__NONCE_ACCOUNT_NOT_FOUND: () => (/* binding */ SOLANA_ERROR__NONCE_ACCOUNT_NOT_FOUND),
/* harmony export */   SOLANA_ERROR__RPC_SUBSCRIPTIONS__CANNOT_CREATE_SUBSCRIPTION_REQUEST: () => (/* binding */ SOLANA_ERROR__RPC_SUBSCRIPTIONS__CANNOT_CREATE_SUBSCRIPTION_REQUEST),
/* harmony export */   SOLANA_ERROR__RPC_SUBSCRIPTIONS__EXPECTED_SERVER_SUBSCRIPTION_ID: () => (/* binding */ SOLANA_ERROR__RPC_SUBSCRIPTIONS__EXPECTED_SERVER_SUBSCRIPTION_ID),
/* harmony export */   SOLANA_ERROR__RPC_SUBSCRIPTIONS__TRANSPORT_CLOSED_BEFORE_MESSAGE_BUFFERED: () => (/* binding */ SOLANA_ERROR__RPC_SUBSCRIPTIONS__TRANSPORT_CLOSED_BEFORE_MESSAGE_BUFFERED),
/* harmony export */   SOLANA_ERROR__RPC_SUBSCRIPTIONS__TRANSPORT_CONNECTION_CLOSED: () => (/* binding */ SOLANA_ERROR__RPC_SUBSCRIPTIONS__TRANSPORT_CONNECTION_CLOSED),
/* harmony export */   SOLANA_ERROR__RPC_SUBSCRIPTIONS__TRANSPORT_FAILED_TO_CONNECT: () => (/* binding */ SOLANA_ERROR__RPC_SUBSCRIPTIONS__TRANSPORT_FAILED_TO_CONNECT),
/* harmony export */   SOLANA_ERROR__RPC__INTEGER_OVERFLOW: () => (/* binding */ SOLANA_ERROR__RPC__INTEGER_OVERFLOW),
/* harmony export */   SOLANA_ERROR__RPC__TRANSPORT_HTTP_ERROR: () => (/* binding */ SOLANA_ERROR__RPC__TRANSPORT_HTTP_ERROR),
/* harmony export */   SOLANA_ERROR__RPC__TRANSPORT_HTTP_HEADER_FORBIDDEN: () => (/* binding */ SOLANA_ERROR__RPC__TRANSPORT_HTTP_HEADER_FORBIDDEN),
/* harmony export */   SOLANA_ERROR__SIGNER__ADDRESS_CANNOT_HAVE_MULTIPLE_SIGNERS: () => (/* binding */ SOLANA_ERROR__SIGNER__ADDRESS_CANNOT_HAVE_MULTIPLE_SIGNERS),
/* harmony export */   SOLANA_ERROR__SIGNER__EXPECTED_KEY_PAIR_SIGNER: () => (/* binding */ SOLANA_ERROR__SIGNER__EXPECTED_KEY_PAIR_SIGNER),
/* harmony export */   SOLANA_ERROR__SIGNER__EXPECTED_MESSAGE_MODIFYING_SIGNER: () => (/* binding */ SOLANA_ERROR__SIGNER__EXPECTED_MESSAGE_MODIFYING_SIGNER),
/* harmony export */   SOLANA_ERROR__SIGNER__EXPECTED_MESSAGE_PARTIAL_SIGNER: () => (/* binding */ SOLANA_ERROR__SIGNER__EXPECTED_MESSAGE_PARTIAL_SIGNER),
/* harmony export */   SOLANA_ERROR__SIGNER__EXPECTED_MESSAGE_SIGNER: () => (/* binding */ SOLANA_ERROR__SIGNER__EXPECTED_MESSAGE_SIGNER),
/* harmony export */   SOLANA_ERROR__SIGNER__EXPECTED_TRANSACTION_MODIFYING_SIGNER: () => (/* binding */ SOLANA_ERROR__SIGNER__EXPECTED_TRANSACTION_MODIFYING_SIGNER),
/* harmony export */   SOLANA_ERROR__SIGNER__EXPECTED_TRANSACTION_PARTIAL_SIGNER: () => (/* binding */ SOLANA_ERROR__SIGNER__EXPECTED_TRANSACTION_PARTIAL_SIGNER),
/* harmony export */   SOLANA_ERROR__SIGNER__EXPECTED_TRANSACTION_SENDING_SIGNER: () => (/* binding */ SOLANA_ERROR__SIGNER__EXPECTED_TRANSACTION_SENDING_SIGNER),
/* harmony export */   SOLANA_ERROR__SIGNER__EXPECTED_TRANSACTION_SIGNER: () => (/* binding */ SOLANA_ERROR__SIGNER__EXPECTED_TRANSACTION_SIGNER),
/* harmony export */   SOLANA_ERROR__SIGNER__TRANSACTION_CANNOT_HAVE_MULTIPLE_SENDING_SIGNERS: () => (/* binding */ SOLANA_ERROR__SIGNER__TRANSACTION_CANNOT_HAVE_MULTIPLE_SENDING_SIGNERS),
/* harmony export */   SOLANA_ERROR__SIGNER__TRANSACTION_SENDING_SIGNER_MISSING: () => (/* binding */ SOLANA_ERROR__SIGNER__TRANSACTION_SENDING_SIGNER_MISSING),
/* harmony export */   SOLANA_ERROR__SIGNER__WALLET_MULTISIGN_UNIMPLEMENTED: () => (/* binding */ SOLANA_ERROR__SIGNER__WALLET_MULTISIGN_UNIMPLEMENTED),
/* harmony export */   SOLANA_ERROR__SUBTLE_CRYPTO__CANNOT_EXPORT_NON_EXTRACTABLE_KEY: () => (/* binding */ SOLANA_ERROR__SUBTLE_CRYPTO__CANNOT_EXPORT_NON_EXTRACTABLE_KEY),
/* harmony export */   SOLANA_ERROR__SUBTLE_CRYPTO__DIGEST_UNIMPLEMENTED: () => (/* binding */ SOLANA_ERROR__SUBTLE_CRYPTO__DIGEST_UNIMPLEMENTED),
/* harmony export */   SOLANA_ERROR__SUBTLE_CRYPTO__DISALLOWED_IN_INSECURE_CONTEXT: () => (/* binding */ SOLANA_ERROR__SUBTLE_CRYPTO__DISALLOWED_IN_INSECURE_CONTEXT),
/* harmony export */   SOLANA_ERROR__SUBTLE_CRYPTO__ED25519_ALGORITHM_UNIMPLEMENTED: () => (/* binding */ SOLANA_ERROR__SUBTLE_CRYPTO__ED25519_ALGORITHM_UNIMPLEMENTED),
/* harmony export */   SOLANA_ERROR__SUBTLE_CRYPTO__EXPORT_FUNCTION_UNIMPLEMENTED: () => (/* binding */ SOLANA_ERROR__SUBTLE_CRYPTO__EXPORT_FUNCTION_UNIMPLEMENTED),
/* harmony export */   SOLANA_ERROR__SUBTLE_CRYPTO__GENERATE_FUNCTION_UNIMPLEMENTED: () => (/* binding */ SOLANA_ERROR__SUBTLE_CRYPTO__GENERATE_FUNCTION_UNIMPLEMENTED),
/* harmony export */   SOLANA_ERROR__SUBTLE_CRYPTO__SIGN_FUNCTION_UNIMPLEMENTED: () => (/* binding */ SOLANA_ERROR__SUBTLE_CRYPTO__SIGN_FUNCTION_UNIMPLEMENTED),
/* harmony export */   SOLANA_ERROR__SUBTLE_CRYPTO__VERIFY_FUNCTION_UNIMPLEMENTED: () => (/* binding */ SOLANA_ERROR__SUBTLE_CRYPTO__VERIFY_FUNCTION_UNIMPLEMENTED),
/* harmony export */   SOLANA_ERROR__TIMESTAMP_OUT_OF_RANGE: () => (/* binding */ SOLANA_ERROR__TIMESTAMP_OUT_OF_RANGE),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__ACCOUNT_BORROW_OUTSTANDING: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__ACCOUNT_BORROW_OUTSTANDING),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__ACCOUNT_IN_USE: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__ACCOUNT_IN_USE),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__ACCOUNT_LOADED_TWICE: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__ACCOUNT_LOADED_TWICE),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__ACCOUNT_NOT_FOUND: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__ACCOUNT_NOT_FOUND),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__ADDRESS_LOOKUP_TABLE_NOT_FOUND: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__ADDRESS_LOOKUP_TABLE_NOT_FOUND),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__ALREADY_PROCESSED: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__ALREADY_PROCESSED),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__BLOCKHASH_NOT_FOUND: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__BLOCKHASH_NOT_FOUND),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__CALL_CHAIN_TOO_DEEP: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__CALL_CHAIN_TOO_DEEP),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__CLUSTER_MAINTENANCE: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__CLUSTER_MAINTENANCE),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__DUPLICATE_INSTRUCTION: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__DUPLICATE_INSTRUCTION),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_FEE: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_FEE),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_RENT: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_RENT),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ACCOUNT_FOR_FEE: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ACCOUNT_FOR_FEE),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ACCOUNT_INDEX: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ACCOUNT_INDEX),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ADDRESS_LOOKUP_TABLE_DATA: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ADDRESS_LOOKUP_TABLE_DATA),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ADDRESS_LOOKUP_TABLE_INDEX: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ADDRESS_LOOKUP_TABLE_INDEX),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ADDRESS_LOOKUP_TABLE_OWNER: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ADDRESS_LOOKUP_TABLE_OWNER),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__INVALID_LOADED_ACCOUNTS_DATA_SIZE_LIMIT: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__INVALID_LOADED_ACCOUNTS_DATA_SIZE_LIMIT),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__INVALID_PROGRAM_FOR_EXECUTION: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__INVALID_PROGRAM_FOR_EXECUTION),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__INVALID_RENT_PAYING_ACCOUNT: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__INVALID_RENT_PAYING_ACCOUNT),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__INVALID_WRITABLE_ACCOUNT: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__INVALID_WRITABLE_ACCOUNT),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__MAX_LOADED_ACCOUNTS_DATA_SIZE_EXCEEDED: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__MAX_LOADED_ACCOUNTS_DATA_SIZE_EXCEEDED),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__MISSING_SIGNATURE_FOR_FEE: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__MISSING_SIGNATURE_FOR_FEE),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__PROGRAM_ACCOUNT_NOT_FOUND: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__PROGRAM_ACCOUNT_NOT_FOUND),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__PROGRAM_EXECUTION_TEMPORARILY_RESTRICTED: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__PROGRAM_EXECUTION_TEMPORARILY_RESTRICTED),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__RESANITIZATION_NEEDED: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__RESANITIZATION_NEEDED),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__SANITIZE_FAILURE: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__SANITIZE_FAILURE),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__SIGNATURE_FAILURE: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__SIGNATURE_FAILURE),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__TOO_MANY_ACCOUNT_LOCKS: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__TOO_MANY_ACCOUNT_LOCKS),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__UNBALANCED_TRANSACTION: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__UNBALANCED_TRANSACTION),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__UNKNOWN: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__UNKNOWN),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__UNSUPPORTED_VERSION: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__UNSUPPORTED_VERSION),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_ACCOUNT_DATA_BLOCK_LIMIT: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_ACCOUNT_DATA_BLOCK_LIMIT),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_ACCOUNT_DATA_TOTAL_LIMIT: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_ACCOUNT_DATA_TOTAL_LIMIT),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_MAX_ACCOUNT_COST_LIMIT: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_MAX_ACCOUNT_COST_LIMIT),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_MAX_BLOCK_COST_LIMIT: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_MAX_BLOCK_COST_LIMIT),
/* harmony export */   SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_MAX_VOTE_COST_LIMIT: () => (/* binding */ SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_MAX_VOTE_COST_LIMIT),
/* harmony export */   SOLANA_ERROR__TRANSACTION__ADDRESSES_CANNOT_SIGN_TRANSACTION: () => (/* binding */ SOLANA_ERROR__TRANSACTION__ADDRESSES_CANNOT_SIGN_TRANSACTION),
/* harmony export */   SOLANA_ERROR__TRANSACTION__ADDRESS_MISSING: () => (/* binding */ SOLANA_ERROR__TRANSACTION__ADDRESS_MISSING),
/* harmony export */   SOLANA_ERROR__TRANSACTION__CANNOT_ENCODE_WITH_EMPTY_SIGNATURES: () => (/* binding */ SOLANA_ERROR__TRANSACTION__CANNOT_ENCODE_WITH_EMPTY_SIGNATURES),
/* harmony export */   SOLANA_ERROR__TRANSACTION__EXPECTED_BLOCKHASH_LIFETIME: () => (/* binding */ SOLANA_ERROR__TRANSACTION__EXPECTED_BLOCKHASH_LIFETIME),
/* harmony export */   SOLANA_ERROR__TRANSACTION__EXPECTED_NONCE_LIFETIME: () => (/* binding */ SOLANA_ERROR__TRANSACTION__EXPECTED_NONCE_LIFETIME),
/* harmony export */   SOLANA_ERROR__TRANSACTION__FAILED_TO_DECOMPILE_ADDRESS_LOOKUP_TABLE_CONTENTS_MISSING: () => (/* binding */ SOLANA_ERROR__TRANSACTION__FAILED_TO_DECOMPILE_ADDRESS_LOOKUP_TABLE_CONTENTS_MISSING),
/* harmony export */   SOLANA_ERROR__TRANSACTION__FAILED_TO_DECOMPILE_ADDRESS_LOOKUP_TABLE_INDEX_OUT_OF_RANGE: () => (/* binding */ SOLANA_ERROR__TRANSACTION__FAILED_TO_DECOMPILE_ADDRESS_LOOKUP_TABLE_INDEX_OUT_OF_RANGE),
/* harmony export */   SOLANA_ERROR__TRANSACTION__FAILED_TO_DECOMPILE_FEE_PAYER_MISSING: () => (/* binding */ SOLANA_ERROR__TRANSACTION__FAILED_TO_DECOMPILE_FEE_PAYER_MISSING),
/* harmony export */   SOLANA_ERROR__TRANSACTION__FAILED_TO_DECOMPILE_INSTRUCTION_PROGRAM_ADDRESS_NOT_FOUND: () => (/* binding */ SOLANA_ERROR__TRANSACTION__FAILED_TO_DECOMPILE_INSTRUCTION_PROGRAM_ADDRESS_NOT_FOUND),
/* harmony export */   SOLANA_ERROR__TRANSACTION__FAILED_TO_ESTIMATE_COMPUTE_LIMIT: () => (/* binding */ SOLANA_ERROR__TRANSACTION__FAILED_TO_ESTIMATE_COMPUTE_LIMIT),
/* harmony export */   SOLANA_ERROR__TRANSACTION__FEE_PAYER_MISSING: () => (/* binding */ SOLANA_ERROR__TRANSACTION__FEE_PAYER_MISSING),
/* harmony export */   SOLANA_ERROR__TRANSACTION__FEE_PAYER_SIGNATURE_MISSING: () => (/* binding */ SOLANA_ERROR__TRANSACTION__FEE_PAYER_SIGNATURE_MISSING),
/* harmony export */   SOLANA_ERROR__TRANSACTION__INVALID_NONCE_TRANSACTION_FIRST_INSTRUCTION_MUST_BE_ADVANCE_NONCE: () => (/* binding */ SOLANA_ERROR__TRANSACTION__INVALID_NONCE_TRANSACTION_FIRST_INSTRUCTION_MUST_BE_ADVANCE_NONCE),
/* harmony export */   SOLANA_ERROR__TRANSACTION__INVALID_NONCE_TRANSACTION_INSTRUCTIONS_MISSING: () => (/* binding */ SOLANA_ERROR__TRANSACTION__INVALID_NONCE_TRANSACTION_INSTRUCTIONS_MISSING),
/* harmony export */   SOLANA_ERROR__TRANSACTION__INVOKED_PROGRAMS_CANNOT_PAY_FEES: () => (/* binding */ SOLANA_ERROR__TRANSACTION__INVOKED_PROGRAMS_CANNOT_PAY_FEES),
/* harmony export */   SOLANA_ERROR__TRANSACTION__INVOKED_PROGRAMS_MUST_NOT_BE_WRITABLE: () => (/* binding */ SOLANA_ERROR__TRANSACTION__INVOKED_PROGRAMS_MUST_NOT_BE_WRITABLE),
/* harmony export */   SOLANA_ERROR__TRANSACTION__MESSAGE_SIGNATURES_MISMATCH: () => (/* binding */ SOLANA_ERROR__TRANSACTION__MESSAGE_SIGNATURES_MISMATCH),
/* harmony export */   SOLANA_ERROR__TRANSACTION__SIGNATURES_MISSING: () => (/* binding */ SOLANA_ERROR__TRANSACTION__SIGNATURES_MISSING),
/* harmony export */   SOLANA_ERROR__TRANSACTION__VERSION_NUMBER_OUT_OF_RANGE: () => (/* binding */ SOLANA_ERROR__TRANSACTION__VERSION_NUMBER_OUT_OF_RANGE),
/* harmony export */   SolanaError: () => (/* binding */ SolanaError),
/* harmony export */   getSolanaErrorFromInstructionError: () => (/* binding */ getSolanaErrorFromInstructionError),
/* harmony export */   getSolanaErrorFromJsonRpcError: () => (/* binding */ getSolanaErrorFromJsonRpcError),
/* harmony export */   getSolanaErrorFromTransactionError: () => (/* binding */ getSolanaErrorFromTransactionError),
/* harmony export */   isSolanaError: () => (/* binding */ isSolanaError),
/* harmony export */   safeCaptureStackTrace: () => (/* binding */ safeCaptureStackTrace)
/* harmony export */ });
// src/codes.ts
var SOLANA_ERROR__BLOCK_HEIGHT_EXCEEDED = 1;
var SOLANA_ERROR__INVALID_NONCE = 2;
var SOLANA_ERROR__NONCE_ACCOUNT_NOT_FOUND = 3;
var SOLANA_ERROR__BLOCKHASH_STRING_LENGTH_OUT_OF_RANGE = 4;
var SOLANA_ERROR__INVALID_BLOCKHASH_BYTE_LENGTH = 5;
var SOLANA_ERROR__LAMPORTS_OUT_OF_RANGE = 6;
var SOLANA_ERROR__MALFORMED_BIGINT_STRING = 7;
var SOLANA_ERROR__MALFORMED_NUMBER_STRING = 8;
var SOLANA_ERROR__TIMESTAMP_OUT_OF_RANGE = 9;
var SOLANA_ERROR__JSON_RPC__PARSE_ERROR = -32700;
var SOLANA_ERROR__JSON_RPC__INTERNAL_ERROR = -32603;
var SOLANA_ERROR__JSON_RPC__INVALID_PARAMS = -32602;
var SOLANA_ERROR__JSON_RPC__METHOD_NOT_FOUND = -32601;
var SOLANA_ERROR__JSON_RPC__INVALID_REQUEST = -32600;
var SOLANA_ERROR__JSON_RPC__SERVER_ERROR_MIN_CONTEXT_SLOT_NOT_REACHED = -32016;
var SOLANA_ERROR__JSON_RPC__SERVER_ERROR_UNSUPPORTED_TRANSACTION_VERSION = -32015;
var SOLANA_ERROR__JSON_RPC__SERVER_ERROR_BLOCK_STATUS_NOT_AVAILABLE_YET = -32014;
var SOLANA_ERROR__JSON_RPC__SERVER_ERROR_TRANSACTION_SIGNATURE_LEN_MISMATCH = -32013;
var SOLANA_ERROR__JSON_RPC__SCAN_ERROR = -32012;
var SOLANA_ERROR__JSON_RPC__SERVER_ERROR_TRANSACTION_HISTORY_NOT_AVAILABLE = -32011;
var SOLANA_ERROR__JSON_RPC__SERVER_ERROR_KEY_EXCLUDED_FROM_SECONDARY_INDEX = -32010;
var SOLANA_ERROR__JSON_RPC__SERVER_ERROR_LONG_TERM_STORAGE_SLOT_SKIPPED = -32009;
var SOLANA_ERROR__JSON_RPC__SERVER_ERROR_NO_SNAPSHOT = -32008;
var SOLANA_ERROR__JSON_RPC__SERVER_ERROR_SLOT_SKIPPED = -32007;
var SOLANA_ERROR__JSON_RPC__SERVER_ERROR_TRANSACTION_PRECOMPILE_VERIFICATION_FAILURE = -32006;
var SOLANA_ERROR__JSON_RPC__SERVER_ERROR_NODE_UNHEALTHY = -32005;
var SOLANA_ERROR__JSON_RPC__SERVER_ERROR_BLOCK_NOT_AVAILABLE = -32004;
var SOLANA_ERROR__JSON_RPC__SERVER_ERROR_TRANSACTION_SIGNATURE_VERIFICATION_FAILURE = -32003;
var SOLANA_ERROR__JSON_RPC__SERVER_ERROR_SEND_TRANSACTION_PREFLIGHT_FAILURE = -32002;
var SOLANA_ERROR__JSON_RPC__SERVER_ERROR_BLOCK_CLEANED_UP = -32001;
var SOLANA_ERROR__ADDRESSES__INVALID_BYTE_LENGTH = 28e5;
var SOLANA_ERROR__ADDRESSES__STRING_LENGTH_OUT_OF_RANGE = 2800001;
var SOLANA_ERROR__ADDRESSES__INVALID_BASE58_ENCODED_ADDRESS = 2800002;
var SOLANA_ERROR__ADDRESSES__INVALID_ED25519_PUBLIC_KEY = 2800003;
var SOLANA_ERROR__ADDRESSES__MALFORMED_PDA = 2800004;
var SOLANA_ERROR__ADDRESSES__PDA_BUMP_SEED_OUT_OF_RANGE = 2800005;
var SOLANA_ERROR__ADDRESSES__MAX_NUMBER_OF_PDA_SEEDS_EXCEEDED = 2800006;
var SOLANA_ERROR__ADDRESSES__MAX_PDA_SEED_LENGTH_EXCEEDED = 2800007;
var SOLANA_ERROR__ADDRESSES__INVALID_SEEDS_POINT_ON_CURVE = 2800008;
var SOLANA_ERROR__ADDRESSES__FAILED_TO_FIND_VIABLE_PDA_BUMP_SEED = 2800009;
var SOLANA_ERROR__ADDRESSES__PDA_ENDS_WITH_PDA_MARKER = 2800010;
var SOLANA_ERROR__ACCOUNTS__ACCOUNT_NOT_FOUND = 323e4;
var SOLANA_ERROR__ACCOUNTS__ONE_OR_MORE_ACCOUNTS_NOT_FOUND = 32300001;
var SOLANA_ERROR__ACCOUNTS__FAILED_TO_DECODE_ACCOUNT = 3230002;
var SOLANA_ERROR__ACCOUNTS__EXPECTED_DECODED_ACCOUNT = 3230003;
var SOLANA_ERROR__ACCOUNTS__EXPECTED_ALL_ACCOUNTS_TO_BE_DECODED = 3230004;
var SOLANA_ERROR__SUBTLE_CRYPTO__DISALLOWED_IN_INSECURE_CONTEXT = 361e4;
var SOLANA_ERROR__SUBTLE_CRYPTO__DIGEST_UNIMPLEMENTED = 3610001;
var SOLANA_ERROR__SUBTLE_CRYPTO__ED25519_ALGORITHM_UNIMPLEMENTED = 3610002;
var SOLANA_ERROR__SUBTLE_CRYPTO__EXPORT_FUNCTION_UNIMPLEMENTED = 3610003;
var SOLANA_ERROR__SUBTLE_CRYPTO__GENERATE_FUNCTION_UNIMPLEMENTED = 3610004;
var SOLANA_ERROR__SUBTLE_CRYPTO__SIGN_FUNCTION_UNIMPLEMENTED = 3610005;
var SOLANA_ERROR__SUBTLE_CRYPTO__VERIFY_FUNCTION_UNIMPLEMENTED = 3610006;
var SOLANA_ERROR__SUBTLE_CRYPTO__CANNOT_EXPORT_NON_EXTRACTABLE_KEY = 3610007;
var SOLANA_ERROR__CRYPTO__RANDOM_VALUES_FUNCTION_UNIMPLEMENTED = 3611e3;
var SOLANA_ERROR__KEYS__INVALID_KEY_PAIR_BYTE_LENGTH = 3704e3;
var SOLANA_ERROR__KEYS__INVALID_PRIVATE_KEY_BYTE_LENGTH = 3704001;
var SOLANA_ERROR__KEYS__INVALID_SIGNATURE_BYTE_LENGTH = 3704002;
var SOLANA_ERROR__KEYS__SIGNATURE_STRING_LENGTH_OUT_OF_RANGE = 3704003;
var SOLANA_ERROR__KEYS__PUBLIC_KEY_MUST_MATCH_PRIVATE_KEY = 3704004;
var SOLANA_ERROR__INSTRUCTION__EXPECTED_TO_HAVE_ACCOUNTS = 4128e3;
var SOLANA_ERROR__INSTRUCTION__EXPECTED_TO_HAVE_DATA = 4128001;
var SOLANA_ERROR__INSTRUCTION__PROGRAM_ID_MISMATCH = 4128002;
var SOLANA_ERROR__INSTRUCTION_ERROR__UNKNOWN = 4615e3;
var SOLANA_ERROR__INSTRUCTION_ERROR__GENERIC_ERROR = 4615001;
var SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_ARGUMENT = 4615002;
var SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_INSTRUCTION_DATA = 4615003;
var SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_ACCOUNT_DATA = 4615004;
var SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_DATA_TOO_SMALL = 4615005;
var SOLANA_ERROR__INSTRUCTION_ERROR__INSUFFICIENT_FUNDS = 4615006;
var SOLANA_ERROR__INSTRUCTION_ERROR__INCORRECT_PROGRAM_ID = 4615007;
var SOLANA_ERROR__INSTRUCTION_ERROR__MISSING_REQUIRED_SIGNATURE = 4615008;
var SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_ALREADY_INITIALIZED = 4615009;
var SOLANA_ERROR__INSTRUCTION_ERROR__UNINITIALIZED_ACCOUNT = 4615010;
var SOLANA_ERROR__INSTRUCTION_ERROR__UNBALANCED_INSTRUCTION = 4615011;
var SOLANA_ERROR__INSTRUCTION_ERROR__MODIFIED_PROGRAM_ID = 4615012;
var SOLANA_ERROR__INSTRUCTION_ERROR__EXTERNAL_ACCOUNT_LAMPORT_SPEND = 4615013;
var SOLANA_ERROR__INSTRUCTION_ERROR__EXTERNAL_ACCOUNT_DATA_MODIFIED = 4615014;
var SOLANA_ERROR__INSTRUCTION_ERROR__READONLY_LAMPORT_CHANGE = 4615015;
var SOLANA_ERROR__INSTRUCTION_ERROR__READONLY_DATA_MODIFIED = 4615016;
var SOLANA_ERROR__INSTRUCTION_ERROR__DUPLICATE_ACCOUNT_INDEX = 4615017;
var SOLANA_ERROR__INSTRUCTION_ERROR__EXECUTABLE_MODIFIED = 4615018;
var SOLANA_ERROR__INSTRUCTION_ERROR__RENT_EPOCH_MODIFIED = 4615019;
var SOLANA_ERROR__INSTRUCTION_ERROR__NOT_ENOUGH_ACCOUNT_KEYS = 4615020;
var SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_DATA_SIZE_CHANGED = 4615021;
var SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_NOT_EXECUTABLE = 4615022;
var SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_BORROW_FAILED = 4615023;
var SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_BORROW_OUTSTANDING = 4615024;
var SOLANA_ERROR__INSTRUCTION_ERROR__DUPLICATE_ACCOUNT_OUT_OF_SYNC = 4615025;
var SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM = 4615026;
var SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_ERROR = 4615027;
var SOLANA_ERROR__INSTRUCTION_ERROR__EXECUTABLE_DATA_MODIFIED = 4615028;
var SOLANA_ERROR__INSTRUCTION_ERROR__EXECUTABLE_LAMPORT_CHANGE = 4615029;
var SOLANA_ERROR__INSTRUCTION_ERROR__EXECUTABLE_ACCOUNT_NOT_RENT_EXEMPT = 4615030;
var SOLANA_ERROR__INSTRUCTION_ERROR__UNSUPPORTED_PROGRAM_ID = 4615031;
var SOLANA_ERROR__INSTRUCTION_ERROR__CALL_DEPTH = 4615032;
var SOLANA_ERROR__INSTRUCTION_ERROR__MISSING_ACCOUNT = 4615033;
var SOLANA_ERROR__INSTRUCTION_ERROR__REENTRANCY_NOT_ALLOWED = 4615034;
var SOLANA_ERROR__INSTRUCTION_ERROR__MAX_SEED_LENGTH_EXCEEDED = 4615035;
var SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_SEEDS = 4615036;
var SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_REALLOC = 4615037;
var SOLANA_ERROR__INSTRUCTION_ERROR__COMPUTATIONAL_BUDGET_EXCEEDED = 4615038;
var SOLANA_ERROR__INSTRUCTION_ERROR__PRIVILEGE_ESCALATION = 4615039;
var SOLANA_ERROR__INSTRUCTION_ERROR__PROGRAM_ENVIRONMENT_SETUP_FAILURE = 4615040;
var SOLANA_ERROR__INSTRUCTION_ERROR__PROGRAM_FAILED_TO_COMPLETE = 4615041;
var SOLANA_ERROR__INSTRUCTION_ERROR__PROGRAM_FAILED_TO_COMPILE = 4615042;
var SOLANA_ERROR__INSTRUCTION_ERROR__IMMUTABLE = 4615043;
var SOLANA_ERROR__INSTRUCTION_ERROR__INCORRECT_AUTHORITY = 4615044;
var SOLANA_ERROR__INSTRUCTION_ERROR__BORSH_IO_ERROR = 4615045;
var SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_NOT_RENT_EXEMPT = 4615046;
var SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_ACCOUNT_OWNER = 4615047;
var SOLANA_ERROR__INSTRUCTION_ERROR__ARITHMETIC_OVERFLOW = 4615048;
var SOLANA_ERROR__INSTRUCTION_ERROR__UNSUPPORTED_SYSVAR = 4615049;
var SOLANA_ERROR__INSTRUCTION_ERROR__ILLEGAL_OWNER = 4615050;
var SOLANA_ERROR__INSTRUCTION_ERROR__MAX_ACCOUNTS_DATA_ALLOCATIONS_EXCEEDED = 4615051;
var SOLANA_ERROR__INSTRUCTION_ERROR__MAX_ACCOUNTS_EXCEEDED = 4615052;
var SOLANA_ERROR__INSTRUCTION_ERROR__MAX_INSTRUCTION_TRACE_LENGTH_EXCEEDED = 4615053;
var SOLANA_ERROR__INSTRUCTION_ERROR__BUILTIN_PROGRAMS_MUST_CONSUME_COMPUTE_UNITS = 4615054;
var SOLANA_ERROR__SIGNER__ADDRESS_CANNOT_HAVE_MULTIPLE_SIGNERS = 5508e3;
var SOLANA_ERROR__SIGNER__EXPECTED_KEY_PAIR_SIGNER = 5508001;
var SOLANA_ERROR__SIGNER__EXPECTED_MESSAGE_SIGNER = 5508002;
var SOLANA_ERROR__SIGNER__EXPECTED_MESSAGE_MODIFYING_SIGNER = 5508003;
var SOLANA_ERROR__SIGNER__EXPECTED_MESSAGE_PARTIAL_SIGNER = 5508004;
var SOLANA_ERROR__SIGNER__EXPECTED_TRANSACTION_SIGNER = 5508005;
var SOLANA_ERROR__SIGNER__EXPECTED_TRANSACTION_MODIFYING_SIGNER = 5508006;
var SOLANA_ERROR__SIGNER__EXPECTED_TRANSACTION_PARTIAL_SIGNER = 5508007;
var SOLANA_ERROR__SIGNER__EXPECTED_TRANSACTION_SENDING_SIGNER = 5508008;
var SOLANA_ERROR__SIGNER__TRANSACTION_CANNOT_HAVE_MULTIPLE_SENDING_SIGNERS = 5508009;
var SOLANA_ERROR__SIGNER__TRANSACTION_SENDING_SIGNER_MISSING = 5508010;
var SOLANA_ERROR__SIGNER__WALLET_MULTISIGN_UNIMPLEMENTED = 5508011;
var SOLANA_ERROR__TRANSACTION__INVOKED_PROGRAMS_CANNOT_PAY_FEES = 5663e3;
var SOLANA_ERROR__TRANSACTION__INVOKED_PROGRAMS_MUST_NOT_BE_WRITABLE = 5663001;
var SOLANA_ERROR__TRANSACTION__EXPECTED_BLOCKHASH_LIFETIME = 5663002;
var SOLANA_ERROR__TRANSACTION__EXPECTED_NONCE_LIFETIME = 5663003;
var SOLANA_ERROR__TRANSACTION__VERSION_NUMBER_OUT_OF_RANGE = 5663004;
var SOLANA_ERROR__TRANSACTION__FAILED_TO_DECOMPILE_ADDRESS_LOOKUP_TABLE_CONTENTS_MISSING = 5663005;
var SOLANA_ERROR__TRANSACTION__FAILED_TO_DECOMPILE_ADDRESS_LOOKUP_TABLE_INDEX_OUT_OF_RANGE = 5663006;
var SOLANA_ERROR__TRANSACTION__FAILED_TO_DECOMPILE_INSTRUCTION_PROGRAM_ADDRESS_NOT_FOUND = 5663007;
var SOLANA_ERROR__TRANSACTION__FAILED_TO_DECOMPILE_FEE_PAYER_MISSING = 5663008;
var SOLANA_ERROR__TRANSACTION__SIGNATURES_MISSING = 5663009;
var SOLANA_ERROR__TRANSACTION__ADDRESS_MISSING = 5663010;
var SOLANA_ERROR__TRANSACTION__FEE_PAYER_MISSING = 5663011;
var SOLANA_ERROR__TRANSACTION__FEE_PAYER_SIGNATURE_MISSING = 5663012;
var SOLANA_ERROR__TRANSACTION__INVALID_NONCE_TRANSACTION_INSTRUCTIONS_MISSING = 5663013;
var SOLANA_ERROR__TRANSACTION__INVALID_NONCE_TRANSACTION_FIRST_INSTRUCTION_MUST_BE_ADVANCE_NONCE = 5663014;
var SOLANA_ERROR__TRANSACTION__ADDRESSES_CANNOT_SIGN_TRANSACTION = 5663015;
var SOLANA_ERROR__TRANSACTION__CANNOT_ENCODE_WITH_EMPTY_SIGNATURES = 5663016;
var SOLANA_ERROR__TRANSACTION__MESSAGE_SIGNATURES_MISMATCH = 5663017;
var SOLANA_ERROR__TRANSACTION__FAILED_TO_ESTIMATE_COMPUTE_LIMIT = 5663018;
var SOLANA_ERROR__TRANSACTION_ERROR__UNKNOWN = 705e4;
var SOLANA_ERROR__TRANSACTION_ERROR__ACCOUNT_IN_USE = 7050001;
var SOLANA_ERROR__TRANSACTION_ERROR__ACCOUNT_LOADED_TWICE = 7050002;
var SOLANA_ERROR__TRANSACTION_ERROR__ACCOUNT_NOT_FOUND = 7050003;
var SOLANA_ERROR__TRANSACTION_ERROR__PROGRAM_ACCOUNT_NOT_FOUND = 7050004;
var SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_FEE = 7050005;
var SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ACCOUNT_FOR_FEE = 7050006;
var SOLANA_ERROR__TRANSACTION_ERROR__ALREADY_PROCESSED = 7050007;
var SOLANA_ERROR__TRANSACTION_ERROR__BLOCKHASH_NOT_FOUND = 7050008;
var SOLANA_ERROR__TRANSACTION_ERROR__CALL_CHAIN_TOO_DEEP = 7050009;
var SOLANA_ERROR__TRANSACTION_ERROR__MISSING_SIGNATURE_FOR_FEE = 7050010;
var SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ACCOUNT_INDEX = 7050011;
var SOLANA_ERROR__TRANSACTION_ERROR__SIGNATURE_FAILURE = 7050012;
var SOLANA_ERROR__TRANSACTION_ERROR__INVALID_PROGRAM_FOR_EXECUTION = 7050013;
var SOLANA_ERROR__TRANSACTION_ERROR__SANITIZE_FAILURE = 7050014;
var SOLANA_ERROR__TRANSACTION_ERROR__CLUSTER_MAINTENANCE = 7050015;
var SOLANA_ERROR__TRANSACTION_ERROR__ACCOUNT_BORROW_OUTSTANDING = 7050016;
var SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_MAX_BLOCK_COST_LIMIT = 7050017;
var SOLANA_ERROR__TRANSACTION_ERROR__UNSUPPORTED_VERSION = 7050018;
var SOLANA_ERROR__TRANSACTION_ERROR__INVALID_WRITABLE_ACCOUNT = 7050019;
var SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_MAX_ACCOUNT_COST_LIMIT = 7050020;
var SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_ACCOUNT_DATA_BLOCK_LIMIT = 7050021;
var SOLANA_ERROR__TRANSACTION_ERROR__TOO_MANY_ACCOUNT_LOCKS = 7050022;
var SOLANA_ERROR__TRANSACTION_ERROR__ADDRESS_LOOKUP_TABLE_NOT_FOUND = 7050023;
var SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ADDRESS_LOOKUP_TABLE_OWNER = 7050024;
var SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ADDRESS_LOOKUP_TABLE_DATA = 7050025;
var SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ADDRESS_LOOKUP_TABLE_INDEX = 7050026;
var SOLANA_ERROR__TRANSACTION_ERROR__INVALID_RENT_PAYING_ACCOUNT = 7050027;
var SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_MAX_VOTE_COST_LIMIT = 7050028;
var SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_ACCOUNT_DATA_TOTAL_LIMIT = 7050029;
var SOLANA_ERROR__TRANSACTION_ERROR__DUPLICATE_INSTRUCTION = 7050030;
var SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_RENT = 7050031;
var SOLANA_ERROR__TRANSACTION_ERROR__MAX_LOADED_ACCOUNTS_DATA_SIZE_EXCEEDED = 7050032;
var SOLANA_ERROR__TRANSACTION_ERROR__INVALID_LOADED_ACCOUNTS_DATA_SIZE_LIMIT = 7050033;
var SOLANA_ERROR__TRANSACTION_ERROR__RESANITIZATION_NEEDED = 7050034;
var SOLANA_ERROR__TRANSACTION_ERROR__PROGRAM_EXECUTION_TEMPORARILY_RESTRICTED = 7050035;
var SOLANA_ERROR__TRANSACTION_ERROR__UNBALANCED_TRANSACTION = 7050036;
var SOLANA_ERROR__CODECS__CANNOT_DECODE_EMPTY_BYTE_ARRAY = 8078e3;
var SOLANA_ERROR__CODECS__INVALID_BYTE_LENGTH = 8078001;
var SOLANA_ERROR__CODECS__EXPECTED_FIXED_LENGTH = 8078002;
var SOLANA_ERROR__CODECS__EXPECTED_VARIABLE_LENGTH = 8078003;
var SOLANA_ERROR__CODECS__ENCODER_DECODER_SIZE_COMPATIBILITY_MISMATCH = 8078004;
var SOLANA_ERROR__CODECS__ENCODER_DECODER_FIXED_SIZE_MISMATCH = 8078005;
var SOLANA_ERROR__CODECS__ENCODER_DECODER_MAX_SIZE_MISMATCH = 8078006;
var SOLANA_ERROR__CODECS__INVALID_NUMBER_OF_ITEMS = 8078007;
var SOLANA_ERROR__CODECS__ENUM_DISCRIMINATOR_OUT_OF_RANGE = 8078008;
var SOLANA_ERROR__CODECS__INVALID_DISCRIMINATED_UNION_VARIANT = 8078009;
var SOLANA_ERROR__CODECS__INVALID_ENUM_VARIANT = 8078010;
var SOLANA_ERROR__CODECS__NUMBER_OUT_OF_RANGE = 8078011;
var SOLANA_ERROR__CODECS__INVALID_STRING_FOR_BASE = 8078012;
var SOLANA_ERROR__CODECS__EXPECTED_POSITIVE_BYTE_LENGTH = 8078013;
var SOLANA_ERROR__CODECS__OFFSET_OUT_OF_RANGE = 8078014;
var SOLANA_ERROR__CODECS__INVALID_LITERAL_UNION_VARIANT = 8078015;
var SOLANA_ERROR__CODECS__LITERAL_UNION_DISCRIMINATOR_OUT_OF_RANGE = 8078016;
var SOLANA_ERROR__CODECS__UNION_VARIANT_OUT_OF_RANGE = 8078017;
var SOLANA_ERROR__CODECS__INVALID_CONSTANT = 8078018;
var SOLANA_ERROR__CODECS__EXPECTED_ZERO_VALUE_TO_MATCH_ITEM_FIXED_SIZE = 8078019;
var SOLANA_ERROR__CODECS__ENCODED_BYTES_MUST_NOT_INCLUDE_SENTINEL = 8078020;
var SOLANA_ERROR__CODECS__SENTINEL_MISSING_IN_DECODED_BYTES = 8078021;
var SOLANA_ERROR__CODECS__CANNOT_USE_LEXICAL_VALUES_AS_ENUM_DISCRIMINATORS = 8078022;
var SOLANA_ERROR__RPC__INTEGER_OVERFLOW = 81e5;
var SOLANA_ERROR__RPC__TRANSPORT_HTTP_HEADER_FORBIDDEN = 8100001;
var SOLANA_ERROR__RPC__TRANSPORT_HTTP_ERROR = 8100002;
var SOLANA_ERROR__RPC_SUBSCRIPTIONS__CANNOT_CREATE_SUBSCRIPTION_REQUEST = 819e4;
var SOLANA_ERROR__RPC_SUBSCRIPTIONS__EXPECTED_SERVER_SUBSCRIPTION_ID = 8190001;
var SOLANA_ERROR__RPC_SUBSCRIPTIONS__TRANSPORT_CLOSED_BEFORE_MESSAGE_BUFFERED = 8190002;
var SOLANA_ERROR__RPC_SUBSCRIPTIONS__TRANSPORT_CONNECTION_CLOSED = 8190003;
var SOLANA_ERROR__RPC_SUBSCRIPTIONS__TRANSPORT_FAILED_TO_CONNECT = 8190004;
var SOLANA_ERROR__INVARIANT_VIOLATION__WEBSOCKET_MESSAGE_ITERATOR_STATE_MISSING = 99e5;
var SOLANA_ERROR__INVARIANT_VIOLATION__WEBSOCKET_MESSAGE_ITERATOR_MUST_NOT_POLL_BEFORE_RESOLVING_EXISTING_MESSAGE_PROMISE = 9900001;
var SOLANA_ERROR__INVARIANT_VIOLATION__CACHED_ABORTABLE_ITERABLE_CACHE_ENTRY_MISSING = 9900002;
var SOLANA_ERROR__INVARIANT_VIOLATION__SWITCH_MUST_BE_EXHAUSTIVE = 9900003;

// src/context.ts
function encodeValue(value) {
  if (Array.isArray(value)) {
    const commaSeparatedValues = value.map(encodeValue).join("%2C%20"
    /* ", " */);
    return "%5B" + commaSeparatedValues + /* "]" */
    "%5D";
  } else if (typeof value === "bigint") {
    return `${value}n`;
  } else {
    return encodeURIComponent(String(value != null && Object.getPrototypeOf(value) === null ?
    // Plain objects with no prototype don't have a `toString` method.
    // Convert them before stringifying them.
    {
      ...value
    } : value));
  }
}
function encodeObjectContextEntry([key, value]) {
  return `${key}=${encodeValue(value)}`;
}
function encodeContextObject(context) {
  const searchParamsString = Object.entries(context).map(encodeObjectContextEntry).join("&");
  return btoa(searchParamsString);
}

// src/messages.ts
var SolanaErrorMessages = {
  [SOLANA_ERROR__ACCOUNTS__ACCOUNT_NOT_FOUND]: "Account not found at address: $address",
  [SOLANA_ERROR__ACCOUNTS__EXPECTED_ALL_ACCOUNTS_TO_BE_DECODED]: "Not all accounts were decoded. Encoded accounts found at addresses: $addresses.",
  [SOLANA_ERROR__ACCOUNTS__EXPECTED_DECODED_ACCOUNT]: "Expected decoded account at address: $address",
  [SOLANA_ERROR__ACCOUNTS__FAILED_TO_DECODE_ACCOUNT]: "Failed to decode account data at address: $address",
  [SOLANA_ERROR__ACCOUNTS__ONE_OR_MORE_ACCOUNTS_NOT_FOUND]: "Accounts not found at addresses: $addresses",
  [SOLANA_ERROR__ADDRESSES__FAILED_TO_FIND_VIABLE_PDA_BUMP_SEED]: "Unable to find a viable program address bump seed.",
  [SOLANA_ERROR__ADDRESSES__INVALID_BASE58_ENCODED_ADDRESS]: "$putativeAddress is not a base58-encoded address.",
  [SOLANA_ERROR__ADDRESSES__INVALID_BYTE_LENGTH]: "Expected base58 encoded address to decode to a byte array of length 32. Actual length: $actualLength.",
  [SOLANA_ERROR__ADDRESSES__INVALID_ED25519_PUBLIC_KEY]: "The `CryptoKey` must be an `Ed25519` public key.",
  [SOLANA_ERROR__ADDRESSES__INVALID_SEEDS_POINT_ON_CURVE]: "Invalid seeds; point must fall off the Ed25519 curve.",
  [SOLANA_ERROR__ADDRESSES__MALFORMED_PDA]: "Expected given program derived address to have the following format: [Address, ProgramDerivedAddressBump].",
  [SOLANA_ERROR__ADDRESSES__MAX_NUMBER_OF_PDA_SEEDS_EXCEEDED]: "A maximum of $maxSeeds seeds, including the bump seed, may be supplied when creating an address. Received: $actual.",
  [SOLANA_ERROR__ADDRESSES__MAX_PDA_SEED_LENGTH_EXCEEDED]: "The seed at index $index with length $actual exceeds the maximum length of $maxSeedLength bytes.",
  [SOLANA_ERROR__ADDRESSES__PDA_BUMP_SEED_OUT_OF_RANGE]: "Expected program derived address bump to be in the range [0, 255], got: $bump.",
  [SOLANA_ERROR__ADDRESSES__PDA_ENDS_WITH_PDA_MARKER]: "Program address cannot end with PDA marker.",
  [SOLANA_ERROR__ADDRESSES__STRING_LENGTH_OUT_OF_RANGE]: "Expected base58-encoded address string of length in the range [32, 44]. Actual length: $actualLength.",
  [SOLANA_ERROR__BLOCKHASH_STRING_LENGTH_OUT_OF_RANGE]: "Expected base58-encoded blockash string of length in the range [32, 44]. Actual length: $actualLength.",
  [SOLANA_ERROR__BLOCK_HEIGHT_EXCEEDED]: "The network has progressed past the last block for which this transaction could have been committed.",
  [SOLANA_ERROR__CODECS__CANNOT_DECODE_EMPTY_BYTE_ARRAY]: "Codec [$codecDescription] cannot decode empty byte arrays.",
  [SOLANA_ERROR__CODECS__CANNOT_USE_LEXICAL_VALUES_AS_ENUM_DISCRIMINATORS]: "Enum codec cannot use lexical values [$stringValues] as discriminators. Either remove all lexical values or set `useValuesAsDiscriminators` to `false`.",
  [SOLANA_ERROR__CODECS__ENCODED_BYTES_MUST_NOT_INCLUDE_SENTINEL]: "Sentinel [$hexSentinel] must not be present in encoded bytes [$hexEncodedBytes].",
  [SOLANA_ERROR__CODECS__ENCODER_DECODER_FIXED_SIZE_MISMATCH]: "Encoder and decoder must have the same fixed size, got [$encoderFixedSize] and [$decoderFixedSize].",
  [SOLANA_ERROR__CODECS__ENCODER_DECODER_MAX_SIZE_MISMATCH]: "Encoder and decoder must have the same max size, got [$encoderMaxSize] and [$decoderMaxSize].",
  [SOLANA_ERROR__CODECS__ENCODER_DECODER_SIZE_COMPATIBILITY_MISMATCH]: "Encoder and decoder must either both be fixed-size or variable-size.",
  [SOLANA_ERROR__CODECS__ENUM_DISCRIMINATOR_OUT_OF_RANGE]: "Enum discriminator out of range. Expected a number in [$formattedValidDiscriminators], got $discriminator.",
  [SOLANA_ERROR__CODECS__EXPECTED_FIXED_LENGTH]: "Expected a fixed-size codec, got a variable-size one.",
  [SOLANA_ERROR__CODECS__EXPECTED_POSITIVE_BYTE_LENGTH]: "Codec [$codecDescription] expected a positive byte length, got $bytesLength.",
  [SOLANA_ERROR__CODECS__EXPECTED_VARIABLE_LENGTH]: "Expected a variable-size codec, got a fixed-size one.",
  [SOLANA_ERROR__CODECS__EXPECTED_ZERO_VALUE_TO_MATCH_ITEM_FIXED_SIZE]: "Codec [$codecDescription] expected zero-value [$hexZeroValue] to have the same size as the provided fixed-size item [$expectedSize bytes].",
  [SOLANA_ERROR__CODECS__INVALID_BYTE_LENGTH]: "Codec [$codecDescription] expected $expected bytes, got $bytesLength.",
  [SOLANA_ERROR__CODECS__INVALID_CONSTANT]: "Expected byte array constant [$hexConstant] to be present in data [$hexData] at offset [$offset].",
  [SOLANA_ERROR__CODECS__INVALID_DISCRIMINATED_UNION_VARIANT]: "Invalid discriminated union variant. Expected one of [$variants], got $value.",
  [SOLANA_ERROR__CODECS__INVALID_ENUM_VARIANT]: "Invalid enum variant. Expected one of [$stringValues] or a number in [$formattedNumericalValues], got $variant.",
  [SOLANA_ERROR__CODECS__INVALID_LITERAL_UNION_VARIANT]: "Invalid literal union variant. Expected one of [$variants], got $value.",
  [SOLANA_ERROR__CODECS__INVALID_NUMBER_OF_ITEMS]: "Expected [$codecDescription] to have $expected items, got $actual.",
  [SOLANA_ERROR__CODECS__INVALID_STRING_FOR_BASE]: "Invalid value $value for base $base with alphabet $alphabet.",
  [SOLANA_ERROR__CODECS__LITERAL_UNION_DISCRIMINATOR_OUT_OF_RANGE]: "Literal union discriminator out of range. Expected a number between $minRange and $maxRange, got $discriminator.",
  [SOLANA_ERROR__CODECS__NUMBER_OUT_OF_RANGE]: "Codec [$codecDescription] expected number to be in the range [$min, $max], got $value.",
  [SOLANA_ERROR__CODECS__OFFSET_OUT_OF_RANGE]: "Codec [$codecDescription] expected offset to be in the range [0, $bytesLength], got $offset.",
  [SOLANA_ERROR__CODECS__SENTINEL_MISSING_IN_DECODED_BYTES]: "Expected sentinel [$hexSentinel] to be present in decoded bytes [$hexDecodedBytes].",
  [SOLANA_ERROR__CODECS__UNION_VARIANT_OUT_OF_RANGE]: "Union variant out of range. Expected an index between $minRange and $maxRange, got $variant.",
  [SOLANA_ERROR__CRYPTO__RANDOM_VALUES_FUNCTION_UNIMPLEMENTED]: "No random values implementation could be found.",
  [SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_ALREADY_INITIALIZED]: "instruction requires an uninitialized account",
  [SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_BORROW_FAILED]: "instruction tries to borrow reference for an account which is already borrowed",
  [SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_BORROW_OUTSTANDING]: "instruction left account with an outstanding borrowed reference",
  [SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_DATA_SIZE_CHANGED]: "program other than the account's owner changed the size of the account data",
  [SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_DATA_TOO_SMALL]: "account data too small for instruction",
  [SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_NOT_EXECUTABLE]: "instruction expected an executable account",
  [SOLANA_ERROR__INSTRUCTION_ERROR__ACCOUNT_NOT_RENT_EXEMPT]: "An account does not have enough lamports to be rent-exempt",
  [SOLANA_ERROR__INSTRUCTION_ERROR__ARITHMETIC_OVERFLOW]: "Program arithmetic overflowed",
  [SOLANA_ERROR__INSTRUCTION_ERROR__BORSH_IO_ERROR]: "Failed to serialize or deserialize account data: $encodedData",
  [SOLANA_ERROR__INSTRUCTION_ERROR__BUILTIN_PROGRAMS_MUST_CONSUME_COMPUTE_UNITS]: "Builtin programs must consume compute units",
  [SOLANA_ERROR__INSTRUCTION_ERROR__CALL_DEPTH]: "Cross-program invocation call depth too deep",
  [SOLANA_ERROR__INSTRUCTION_ERROR__COMPUTATIONAL_BUDGET_EXCEEDED]: "Computational budget exceeded",
  [SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM]: "custom program error: #$code",
  [SOLANA_ERROR__INSTRUCTION_ERROR__DUPLICATE_ACCOUNT_INDEX]: "instruction contains duplicate accounts",
  [SOLANA_ERROR__INSTRUCTION_ERROR__DUPLICATE_ACCOUNT_OUT_OF_SYNC]: "instruction modifications of multiply-passed account differ",
  [SOLANA_ERROR__INSTRUCTION_ERROR__EXECUTABLE_ACCOUNT_NOT_RENT_EXEMPT]: "executable accounts must be rent exempt",
  [SOLANA_ERROR__INSTRUCTION_ERROR__EXECUTABLE_DATA_MODIFIED]: "instruction changed executable accounts data",
  [SOLANA_ERROR__INSTRUCTION_ERROR__EXECUTABLE_LAMPORT_CHANGE]: "instruction changed the balance of an executable account",
  [SOLANA_ERROR__INSTRUCTION_ERROR__EXECUTABLE_MODIFIED]: "instruction changed executable bit of an account",
  [SOLANA_ERROR__INSTRUCTION_ERROR__EXTERNAL_ACCOUNT_DATA_MODIFIED]: "instruction modified data of an account it does not own",
  [SOLANA_ERROR__INSTRUCTION_ERROR__EXTERNAL_ACCOUNT_LAMPORT_SPEND]: "instruction spent from the balance of an account it does not own",
  [SOLANA_ERROR__INSTRUCTION_ERROR__GENERIC_ERROR]: "generic instruction error",
  [SOLANA_ERROR__INSTRUCTION_ERROR__ILLEGAL_OWNER]: "Provided owner is not allowed",
  [SOLANA_ERROR__INSTRUCTION_ERROR__IMMUTABLE]: "Account is immutable",
  [SOLANA_ERROR__INSTRUCTION_ERROR__INCORRECT_AUTHORITY]: "Incorrect authority provided",
  [SOLANA_ERROR__INSTRUCTION_ERROR__INCORRECT_PROGRAM_ID]: "incorrect program id for instruction",
  [SOLANA_ERROR__INSTRUCTION_ERROR__INSUFFICIENT_FUNDS]: "insufficient funds for instruction",
  [SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_ACCOUNT_DATA]: "invalid account data for instruction",
  [SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_ACCOUNT_OWNER]: "Invalid account owner",
  [SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_ARGUMENT]: "invalid program argument",
  [SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_ERROR]: "program returned invalid error code",
  [SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_INSTRUCTION_DATA]: "invalid instruction data",
  [SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_REALLOC]: "Failed to reallocate account data",
  [SOLANA_ERROR__INSTRUCTION_ERROR__INVALID_SEEDS]: "Provided seeds do not result in a valid address",
  [SOLANA_ERROR__INSTRUCTION_ERROR__MAX_ACCOUNTS_DATA_ALLOCATIONS_EXCEEDED]: "Accounts data allocations exceeded the maximum allowed per transaction",
  [SOLANA_ERROR__INSTRUCTION_ERROR__MAX_ACCOUNTS_EXCEEDED]: "Max accounts exceeded",
  [SOLANA_ERROR__INSTRUCTION_ERROR__MAX_INSTRUCTION_TRACE_LENGTH_EXCEEDED]: "Max instruction trace length exceeded",
  [SOLANA_ERROR__INSTRUCTION_ERROR__MAX_SEED_LENGTH_EXCEEDED]: "Length of the seed is too long for address generation",
  [SOLANA_ERROR__INSTRUCTION_ERROR__MISSING_ACCOUNT]: "An account required by the instruction is missing",
  [SOLANA_ERROR__INSTRUCTION_ERROR__MISSING_REQUIRED_SIGNATURE]: "missing required signature for instruction",
  [SOLANA_ERROR__INSTRUCTION_ERROR__MODIFIED_PROGRAM_ID]: "instruction illegally modified the program id of an account",
  [SOLANA_ERROR__INSTRUCTION_ERROR__NOT_ENOUGH_ACCOUNT_KEYS]: "insufficient account keys for instruction",
  [SOLANA_ERROR__INSTRUCTION_ERROR__PRIVILEGE_ESCALATION]: "Cross-program invocation with unauthorized signer or writable account",
  [SOLANA_ERROR__INSTRUCTION_ERROR__PROGRAM_ENVIRONMENT_SETUP_FAILURE]: "Failed to create program execution environment",
  [SOLANA_ERROR__INSTRUCTION_ERROR__PROGRAM_FAILED_TO_COMPILE]: "Program failed to compile",
  [SOLANA_ERROR__INSTRUCTION_ERROR__PROGRAM_FAILED_TO_COMPLETE]: "Program failed to complete",
  [SOLANA_ERROR__INSTRUCTION_ERROR__READONLY_DATA_MODIFIED]: "instruction modified data of a read-only account",
  [SOLANA_ERROR__INSTRUCTION_ERROR__READONLY_LAMPORT_CHANGE]: "instruction changed the balance of a read-only account",
  [SOLANA_ERROR__INSTRUCTION_ERROR__REENTRANCY_NOT_ALLOWED]: "Cross-program invocation reentrancy not allowed for this instruction",
  [SOLANA_ERROR__INSTRUCTION_ERROR__RENT_EPOCH_MODIFIED]: "instruction modified rent epoch of an account",
  [SOLANA_ERROR__INSTRUCTION_ERROR__UNBALANCED_INSTRUCTION]: "sum of account balances before and after instruction do not match",
  [SOLANA_ERROR__INSTRUCTION_ERROR__UNINITIALIZED_ACCOUNT]: "instruction requires an initialized account",
  [SOLANA_ERROR__INSTRUCTION_ERROR__UNKNOWN]: "",
  [SOLANA_ERROR__INSTRUCTION_ERROR__UNSUPPORTED_PROGRAM_ID]: "Unsupported program id",
  [SOLANA_ERROR__INSTRUCTION_ERROR__UNSUPPORTED_SYSVAR]: "Unsupported sysvar",
  [SOLANA_ERROR__INSTRUCTION__EXPECTED_TO_HAVE_ACCOUNTS]: "The instruction does not have any accounts.",
  [SOLANA_ERROR__INSTRUCTION__EXPECTED_TO_HAVE_DATA]: "The instruction does not have any data.",
  [SOLANA_ERROR__INSTRUCTION__PROGRAM_ID_MISMATCH]: "Expected instruction to have progress address $expectedProgramAddress, got $actualProgramAddress.",
  [SOLANA_ERROR__INVALID_BLOCKHASH_BYTE_LENGTH]: "Expected base58 encoded blockhash to decode to a byte array of length 32. Actual length: $actualLength.",
  [SOLANA_ERROR__INVALID_NONCE]: "The nonce `$expectedNonceValue` is no longer valid. It has advanced to `$actualNonceValue`",
  [SOLANA_ERROR__INVARIANT_VIOLATION__CACHED_ABORTABLE_ITERABLE_CACHE_ENTRY_MISSING]: "Invariant violation: Found no abortable iterable cache entry for key `$cacheKey`. It should be impossible to hit this error; please file an issue at https://sola.na/web3invariant",
  [SOLANA_ERROR__INVARIANT_VIOLATION__SWITCH_MUST_BE_EXHAUSTIVE]: "Invariant violation: Switch statement non-exhaustive. Received unexpected value `$unexpectedValue`. It should be impossible to hit this error; please file an issue at https://sola.na/web3invariant",
  [SOLANA_ERROR__INVARIANT_VIOLATION__WEBSOCKET_MESSAGE_ITERATOR_MUST_NOT_POLL_BEFORE_RESOLVING_EXISTING_MESSAGE_PROMISE]: "Invariant violation: WebSocket message iterator state is corrupt; iterated without first resolving existing message promise. It should be impossible to hit this error; please file an issue at https://sola.na/web3invariant",
  [SOLANA_ERROR__INVARIANT_VIOLATION__WEBSOCKET_MESSAGE_ITERATOR_STATE_MISSING]: "Invariant violation: WebSocket message iterator is missing state storage. It should be impossible to hit this error; please file an issue at https://sola.na/web3invariant",
  [SOLANA_ERROR__JSON_RPC__INTERNAL_ERROR]: "JSON-RPC error: Internal JSON-RPC error ($__serverMessage)",
  [SOLANA_ERROR__JSON_RPC__INVALID_PARAMS]: "JSON-RPC error: Invalid method parameter(s) ($__serverMessage)",
  [SOLANA_ERROR__JSON_RPC__INVALID_REQUEST]: "JSON-RPC error: The JSON sent is not a valid `Request` object ($__serverMessage)",
  [SOLANA_ERROR__JSON_RPC__METHOD_NOT_FOUND]: "JSON-RPC error: The method does not exist / is not available ($__serverMessage)",
  [SOLANA_ERROR__JSON_RPC__PARSE_ERROR]: "JSON-RPC error: An error occurred on the server while parsing the JSON text ($__serverMessage)",
  [SOLANA_ERROR__JSON_RPC__SCAN_ERROR]: "$__serverMessage",
  [SOLANA_ERROR__JSON_RPC__SERVER_ERROR_BLOCK_CLEANED_UP]: "$__serverMessage",
  [SOLANA_ERROR__JSON_RPC__SERVER_ERROR_BLOCK_NOT_AVAILABLE]: "$__serverMessage",
  [SOLANA_ERROR__JSON_RPC__SERVER_ERROR_BLOCK_STATUS_NOT_AVAILABLE_YET]: "$__serverMessage",
  [SOLANA_ERROR__JSON_RPC__SERVER_ERROR_KEY_EXCLUDED_FROM_SECONDARY_INDEX]: "$__serverMessage",
  [SOLANA_ERROR__JSON_RPC__SERVER_ERROR_LONG_TERM_STORAGE_SLOT_SKIPPED]: "$__serverMessage",
  [SOLANA_ERROR__JSON_RPC__SERVER_ERROR_MIN_CONTEXT_SLOT_NOT_REACHED]: "Minimum context slot has not been reached",
  [SOLANA_ERROR__JSON_RPC__SERVER_ERROR_NODE_UNHEALTHY]: "Node is unhealthy; behind by $numSlotsBehind slots",
  [SOLANA_ERROR__JSON_RPC__SERVER_ERROR_NO_SNAPSHOT]: "No snapshot",
  [SOLANA_ERROR__JSON_RPC__SERVER_ERROR_SEND_TRANSACTION_PREFLIGHT_FAILURE]: "Transaction simulation failed",
  [SOLANA_ERROR__JSON_RPC__SERVER_ERROR_SLOT_SKIPPED]: "$__serverMessage",
  [SOLANA_ERROR__JSON_RPC__SERVER_ERROR_TRANSACTION_HISTORY_NOT_AVAILABLE]: "Transaction history is not available from this node",
  [SOLANA_ERROR__JSON_RPC__SERVER_ERROR_TRANSACTION_PRECOMPILE_VERIFICATION_FAILURE]: "$__serverMessage",
  [SOLANA_ERROR__JSON_RPC__SERVER_ERROR_TRANSACTION_SIGNATURE_LEN_MISMATCH]: "Transaction signature length mismatch",
  [SOLANA_ERROR__JSON_RPC__SERVER_ERROR_TRANSACTION_SIGNATURE_VERIFICATION_FAILURE]: "Transaction signature verification failure",
  [SOLANA_ERROR__JSON_RPC__SERVER_ERROR_UNSUPPORTED_TRANSACTION_VERSION]: "$__serverMessage",
  [SOLANA_ERROR__KEYS__INVALID_KEY_PAIR_BYTE_LENGTH]: "Key pair bytes must be of length 64, got $byteLength.",
  [SOLANA_ERROR__KEYS__INVALID_PRIVATE_KEY_BYTE_LENGTH]: "Expected private key bytes with length 32. Actual length: $actualLength.",
  [SOLANA_ERROR__KEYS__INVALID_SIGNATURE_BYTE_LENGTH]: "Expected base58-encoded signature to decode to a byte array of length 64. Actual length: $actualLength.",
  [SOLANA_ERROR__KEYS__PUBLIC_KEY_MUST_MATCH_PRIVATE_KEY]: "The provided private key does not match the provided public key.",
  [SOLANA_ERROR__KEYS__SIGNATURE_STRING_LENGTH_OUT_OF_RANGE]: "Expected base58-encoded signature string of length in the range [64, 88]. Actual length: $actualLength.",
  [SOLANA_ERROR__LAMPORTS_OUT_OF_RANGE]: "Lamports value must be in the range [0, 2e64-1]",
  [SOLANA_ERROR__MALFORMED_BIGINT_STRING]: "`$value` cannot be parsed as a `BigInt`",
  [SOLANA_ERROR__MALFORMED_NUMBER_STRING]: "`$value` cannot be parsed as a `Number`",
  [SOLANA_ERROR__NONCE_ACCOUNT_NOT_FOUND]: "No nonce account could be found at address `$nonceAccountAddress`",
  [SOLANA_ERROR__RPC_SUBSCRIPTIONS__CANNOT_CREATE_SUBSCRIPTION_REQUEST]: "Either the notification name must end in 'Notifications' or the API must supply a subscription creator function for the notification '$notificationName' to map between the notification name and the subscribe/unsubscribe method names.",
  [SOLANA_ERROR__RPC_SUBSCRIPTIONS__EXPECTED_SERVER_SUBSCRIPTION_ID]: "Failed to obtain a subscription id from the server",
  [SOLANA_ERROR__RPC_SUBSCRIPTIONS__TRANSPORT_CLOSED_BEFORE_MESSAGE_BUFFERED]: "WebSocket was closed before payload could be added to the send buffer",
  [SOLANA_ERROR__RPC_SUBSCRIPTIONS__TRANSPORT_CONNECTION_CLOSED]: "WebSocket connection closed",
  [SOLANA_ERROR__RPC_SUBSCRIPTIONS__TRANSPORT_FAILED_TO_CONNECT]: "WebSocket failed to connect",
  [SOLANA_ERROR__RPC__INTEGER_OVERFLOW]: "The $argumentLabel argument to the `$methodName` RPC method$optionalPathLabel was `$value`. This number is unsafe for use with the Solana JSON-RPC because it exceeds `Number.MAX_SAFE_INTEGER`.",
  [SOLANA_ERROR__RPC__TRANSPORT_HTTP_ERROR]: "HTTP error ($statusCode): $message",
  [SOLANA_ERROR__RPC__TRANSPORT_HTTP_HEADER_FORBIDDEN]: "HTTP header(s) forbidden: $headers. Learn more at https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name.",
  [SOLANA_ERROR__SIGNER__ADDRESS_CANNOT_HAVE_MULTIPLE_SIGNERS]: "Multiple distinct signers were identified for address `$address`. Please ensure that you are using the same signer instance for each address.",
  [SOLANA_ERROR__SIGNER__EXPECTED_KEY_PAIR_SIGNER]: "The provided value does not implement the `KeyPairSigner` interface",
  [SOLANA_ERROR__SIGNER__EXPECTED_MESSAGE_MODIFYING_SIGNER]: "The provided value does not implement the `MessageModifyingSigner` interface",
  [SOLANA_ERROR__SIGNER__EXPECTED_MESSAGE_PARTIAL_SIGNER]: "The provided value does not implement the `MessagePartialSigner` interface",
  [SOLANA_ERROR__SIGNER__EXPECTED_MESSAGE_SIGNER]: "The provided value does not implement any of the `MessageSigner` interfaces",
  [SOLANA_ERROR__SIGNER__EXPECTED_TRANSACTION_MODIFYING_SIGNER]: "The provided value does not implement the `TransactionModifyingSigner` interface",
  [SOLANA_ERROR__SIGNER__EXPECTED_TRANSACTION_PARTIAL_SIGNER]: "The provided value does not implement the `TransactionPartialSigner` interface",
  [SOLANA_ERROR__SIGNER__EXPECTED_TRANSACTION_SENDING_SIGNER]: "The provided value does not implement the `TransactionSendingSigner` interface",
  [SOLANA_ERROR__SIGNER__EXPECTED_TRANSACTION_SIGNER]: "The provided value does not implement any of the `TransactionSigner` interfaces",
  [SOLANA_ERROR__SIGNER__TRANSACTION_CANNOT_HAVE_MULTIPLE_SENDING_SIGNERS]: "More than one `TransactionSendingSigner` was identified.",
  [SOLANA_ERROR__SIGNER__TRANSACTION_SENDING_SIGNER_MISSING]: "No `TransactionSendingSigner` was identified. Please provide a valid `ITransactionWithSingleSendingSigner` transaction.",
  [SOLANA_ERROR__SIGNER__WALLET_MULTISIGN_UNIMPLEMENTED]: "Wallet account signers do not support signing multiple messages/transactions in a single operation",
  [SOLANA_ERROR__SUBTLE_CRYPTO__CANNOT_EXPORT_NON_EXTRACTABLE_KEY]: "Cannot export a non-extractable key.",
  [SOLANA_ERROR__SUBTLE_CRYPTO__DIGEST_UNIMPLEMENTED]: "No digest implementation could be found.",
  [SOLANA_ERROR__SUBTLE_CRYPTO__DISALLOWED_IN_INSECURE_CONTEXT]: "Cryptographic operations are only allowed in secure browser contexts. Read more here: https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts.",
  [SOLANA_ERROR__SUBTLE_CRYPTO__ED25519_ALGORITHM_UNIMPLEMENTED]: "This runtime does not support the generation of Ed25519 key pairs.\n\nInstall @solana/webcrypto-ed25519-polyfill and call its `install` function before generating keys in environments that do not support Ed25519.\n\nFor a list of runtimes that currently support Ed25519 operations, visit https://github.com/WICG/webcrypto-secure-curves/issues/20.",
  [SOLANA_ERROR__SUBTLE_CRYPTO__EXPORT_FUNCTION_UNIMPLEMENTED]: "No signature verification implementation could be found.",
  [SOLANA_ERROR__SUBTLE_CRYPTO__GENERATE_FUNCTION_UNIMPLEMENTED]: "No key generation implementation could be found.",
  [SOLANA_ERROR__SUBTLE_CRYPTO__SIGN_FUNCTION_UNIMPLEMENTED]: "No signing implementation could be found.",
  [SOLANA_ERROR__SUBTLE_CRYPTO__VERIFY_FUNCTION_UNIMPLEMENTED]: "No key export implementation could be found.",
  [SOLANA_ERROR__TIMESTAMP_OUT_OF_RANGE]: "Timestamp value must be in the range [-8.64e15, 8.64e15]. `$value` given",
  [SOLANA_ERROR__TRANSACTION_ERROR__ACCOUNT_BORROW_OUTSTANDING]: "Transaction processing left an account with an outstanding borrowed reference",
  [SOLANA_ERROR__TRANSACTION_ERROR__ACCOUNT_IN_USE]: "Account in use",
  [SOLANA_ERROR__TRANSACTION_ERROR__ACCOUNT_LOADED_TWICE]: "Account loaded twice",
  [SOLANA_ERROR__TRANSACTION_ERROR__ACCOUNT_NOT_FOUND]: "Attempt to debit an account but found no record of a prior credit.",
  [SOLANA_ERROR__TRANSACTION_ERROR__ADDRESS_LOOKUP_TABLE_NOT_FOUND]: "Transaction loads an address table account that doesn't exist",
  [SOLANA_ERROR__TRANSACTION_ERROR__ALREADY_PROCESSED]: "This transaction has already been processed",
  [SOLANA_ERROR__TRANSACTION_ERROR__BLOCKHASH_NOT_FOUND]: "Blockhash not found",
  [SOLANA_ERROR__TRANSACTION_ERROR__CALL_CHAIN_TOO_DEEP]: "Loader call chain is too deep",
  [SOLANA_ERROR__TRANSACTION_ERROR__CLUSTER_MAINTENANCE]: "Transactions are currently disabled due to cluster maintenance",
  [SOLANA_ERROR__TRANSACTION_ERROR__DUPLICATE_INSTRUCTION]: "Transaction contains a duplicate instruction ($index) that is not allowed",
  [SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_FEE]: "Insufficient funds for fee",
  [SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_RENT]: "Transaction results in an account ($accountIndex) with insufficient funds for rent",
  [SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ACCOUNT_FOR_FEE]: "This account may not be used to pay transaction fees",
  [SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ACCOUNT_INDEX]: "Transaction contains an invalid account reference",
  [SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ADDRESS_LOOKUP_TABLE_DATA]: "Transaction loads an address table account with invalid data",
  [SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ADDRESS_LOOKUP_TABLE_INDEX]: "Transaction address table lookup uses an invalid index",
  [SOLANA_ERROR__TRANSACTION_ERROR__INVALID_ADDRESS_LOOKUP_TABLE_OWNER]: "Transaction loads an address table account with an invalid owner",
  [SOLANA_ERROR__TRANSACTION_ERROR__INVALID_LOADED_ACCOUNTS_DATA_SIZE_LIMIT]: "LoadedAccountsDataSizeLimit set for transaction must be greater than 0.",
  [SOLANA_ERROR__TRANSACTION_ERROR__INVALID_PROGRAM_FOR_EXECUTION]: "This program may not be used for executing instructions",
  [SOLANA_ERROR__TRANSACTION_ERROR__INVALID_RENT_PAYING_ACCOUNT]: "Transaction leaves an account with a lower balance than rent-exempt minimum",
  [SOLANA_ERROR__TRANSACTION_ERROR__INVALID_WRITABLE_ACCOUNT]: "Transaction loads a writable account that cannot be written",
  [SOLANA_ERROR__TRANSACTION_ERROR__MAX_LOADED_ACCOUNTS_DATA_SIZE_EXCEEDED]: "Transaction exceeded max loaded accounts data size cap",
  [SOLANA_ERROR__TRANSACTION_ERROR__MISSING_SIGNATURE_FOR_FEE]: "Transaction requires a fee but has no signature present",
  [SOLANA_ERROR__TRANSACTION_ERROR__PROGRAM_ACCOUNT_NOT_FOUND]: "Attempt to load a program that does not exist",
  [SOLANA_ERROR__TRANSACTION_ERROR__PROGRAM_EXECUTION_TEMPORARILY_RESTRICTED]: "Execution of the program referenced by account at index $accountIndex is temporarily restricted.",
  [SOLANA_ERROR__TRANSACTION_ERROR__RESANITIZATION_NEEDED]: "ResanitizationNeeded",
  [SOLANA_ERROR__TRANSACTION_ERROR__SANITIZE_FAILURE]: "Transaction failed to sanitize accounts offsets correctly",
  [SOLANA_ERROR__TRANSACTION_ERROR__SIGNATURE_FAILURE]: "Transaction did not pass signature verification",
  [SOLANA_ERROR__TRANSACTION_ERROR__TOO_MANY_ACCOUNT_LOCKS]: "Transaction locked too many accounts",
  [SOLANA_ERROR__TRANSACTION_ERROR__UNBALANCED_TRANSACTION]: "Sum of account balances before and after transaction do not match",
  [SOLANA_ERROR__TRANSACTION_ERROR__UNKNOWN]: "The transaction failed with the error `$errorName`",
  [SOLANA_ERROR__TRANSACTION_ERROR__UNSUPPORTED_VERSION]: "Transaction version is unsupported",
  [SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_ACCOUNT_DATA_BLOCK_LIMIT]: "Transaction would exceed account data limit within the block",
  [SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_ACCOUNT_DATA_TOTAL_LIMIT]: "Transaction would exceed total account data limit",
  [SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_MAX_ACCOUNT_COST_LIMIT]: "Transaction would exceed max account limit within the block",
  [SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_MAX_BLOCK_COST_LIMIT]: "Transaction would exceed max Block Cost Limit",
  [SOLANA_ERROR__TRANSACTION_ERROR__WOULD_EXCEED_MAX_VOTE_COST_LIMIT]: "Transaction would exceed max Vote Cost Limit",
  [SOLANA_ERROR__TRANSACTION__ADDRESSES_CANNOT_SIGN_TRANSACTION]: "Attempted to sign a transaction with an address that is not a signer for it",
  [SOLANA_ERROR__TRANSACTION__ADDRESS_MISSING]: "Transaction is missing an address at index: $index.",
  [SOLANA_ERROR__TRANSACTION__CANNOT_ENCODE_WITH_EMPTY_SIGNATURES]: "Transaction has no expected signers therefore it cannot be encoded",
  [SOLANA_ERROR__TRANSACTION__EXPECTED_BLOCKHASH_LIFETIME]: "Transaction does not have a blockhash lifetime",
  [SOLANA_ERROR__TRANSACTION__EXPECTED_NONCE_LIFETIME]: "Transaction is not a durable nonce transaction",
  [SOLANA_ERROR__TRANSACTION__FAILED_TO_DECOMPILE_ADDRESS_LOOKUP_TABLE_CONTENTS_MISSING]: "Contents of these address lookup tables unknown: $lookupTableAddresses",
  [SOLANA_ERROR__TRANSACTION__FAILED_TO_DECOMPILE_ADDRESS_LOOKUP_TABLE_INDEX_OUT_OF_RANGE]: "Lookup of address at index $highestRequestedIndex failed for lookup table `$lookupTableAddress`. Highest known index is $highestKnownIndex. The lookup table may have been extended since its contents were retrieved",
  [SOLANA_ERROR__TRANSACTION__FAILED_TO_DECOMPILE_FEE_PAYER_MISSING]: "No fee payer set in CompiledTransaction",
  [SOLANA_ERROR__TRANSACTION__FAILED_TO_DECOMPILE_INSTRUCTION_PROGRAM_ADDRESS_NOT_FOUND]: "Could not find program address at index $index",
  [SOLANA_ERROR__TRANSACTION__FAILED_TO_ESTIMATE_COMPUTE_LIMIT]: "Failed to estimate the compute unit consumption for this transaction message. This is likely because simulating the transaction failed. Inspect the `cause` property of this error to learn more",
  [SOLANA_ERROR__TRANSACTION__FEE_PAYER_MISSING]: "Transaction is missing a fee payer.",
  [SOLANA_ERROR__TRANSACTION__FEE_PAYER_SIGNATURE_MISSING]: "Could not determine this transaction's signature. Make sure that the transaction has been signed by its fee payer.",
  [SOLANA_ERROR__TRANSACTION__INVALID_NONCE_TRANSACTION_FIRST_INSTRUCTION_MUST_BE_ADVANCE_NONCE]: "Transaction first instruction is not advance nonce account instruction.",
  [SOLANA_ERROR__TRANSACTION__INVALID_NONCE_TRANSACTION_INSTRUCTIONS_MISSING]: "Transaction with no instructions cannot be durable nonce transaction.",
  [SOLANA_ERROR__TRANSACTION__INVOKED_PROGRAMS_CANNOT_PAY_FEES]: "This transaction includes an address (`$programAddress`) which is both invoked and set as the fee payer. Program addresses may not pay fees",
  [SOLANA_ERROR__TRANSACTION__INVOKED_PROGRAMS_MUST_NOT_BE_WRITABLE]: "This transaction includes an address (`$programAddress`) which is both invoked and marked writable. Program addresses may not be writable",
  [SOLANA_ERROR__TRANSACTION__MESSAGE_SIGNATURES_MISMATCH]: "The transaction message expected the transaction to have $signerAddressesLength signatures, got $signaturesLength.",
  [SOLANA_ERROR__TRANSACTION__SIGNATURES_MISSING]: "Transaction is missing signatures for addresses: $addresses.",
  [SOLANA_ERROR__TRANSACTION__VERSION_NUMBER_OUT_OF_RANGE]: "Transaction version must be in the range [0, 127]. `$actualVersion` given"
};

// src/message-formatter.ts
var START_INDEX = "i";
var TYPE = "t";
function getHumanReadableErrorMessage(code, context = {}) {
  const messageFormatString = SolanaErrorMessages[code];
  if (messageFormatString.length === 0) {
    return "";
  }
  let state;
  function commitStateUpTo(endIndex) {
    if (state[TYPE] === 2 /* Variable */) {
      const variableName = messageFormatString.slice(state[START_INDEX] + 1, endIndex);
      fragments.push(variableName in context ? `${context[variableName]}` : `$${variableName}`);
    } else if (state[TYPE] === 1 /* Text */) {
      fragments.push(messageFormatString.slice(state[START_INDEX], endIndex));
    }
  }
  const fragments = [];
  messageFormatString.split("").forEach((char, ii) => {
    if (ii === 0) {
      state = {
        [START_INDEX]: 0,
        [TYPE]: messageFormatString[0] === "\\" ? 0 /* EscapeSequence */ : messageFormatString[0] === "$" ? 2 /* Variable */ : 1 /* Text */
      };
      return;
    }
    let nextState;
    switch (state[TYPE]) {
      case 0 /* EscapeSequence */:
        nextState = {
          [START_INDEX]: ii,
          [TYPE]: 1 /* Text */
        };
        break;
      case 1 /* Text */:
        if (char === "\\") {
          nextState = {
            [START_INDEX]: ii,
            [TYPE]: 0 /* EscapeSequence */
          };
        } else if (char === "$") {
          nextState = {
            [START_INDEX]: ii,
            [TYPE]: 2 /* Variable */
          };
        }
        break;
      case 2 /* Variable */:
        if (char === "\\") {
          nextState = {
            [START_INDEX]: ii,
            [TYPE]: 0 /* EscapeSequence */
          };
        } else if (char === "$") {
          nextState = {
            [START_INDEX]: ii,
            [TYPE]: 2 /* Variable */
          };
        } else if (!char.match(/\w/)) {
          nextState = {
            [START_INDEX]: ii,
            [TYPE]: 1 /* Text */
          };
        }
        break;
    }
    if (nextState) {
      if (state !== nextState) {
        commitStateUpTo(ii);
      }
      state = nextState;
    }
  });
  commitStateUpTo();
  return fragments.join("");
}
function getErrorMessage(code, context = {}) {
  if (true) {
    return getHumanReadableErrorMessage(code, context);
  } else // removed by dead control flow
{}
}

// src/error.ts
function isSolanaError(e, code) {
  const isSolanaError2 = e instanceof Error && e.name === "SolanaError";
  if (isSolanaError2) {
    if (code !== void 0) {
      return e.context.__code === code;
    }
    return true;
  }
  return false;
}
var SolanaError = class extends Error {
  cause = this.cause;
  context;
  constructor(...[code, contextAndErrorOptions]) {
    let context;
    let errorOptions;
    if (contextAndErrorOptions) {
      const {
        cause,
        ...contextRest
      } = contextAndErrorOptions;
      if (cause) {
        errorOptions = {
          cause
        };
      }
      if (Object.keys(contextRest).length > 0) {
        context = contextRest;
      }
    }
    const message = getErrorMessage(code, context);
    super(message, errorOptions);
    this.context = {
      __code: code,
      ...context
    };
    this.name = "SolanaError";
  }
};

// src/stack-trace.ts
function safeCaptureStackTrace(...args) {
  if ("captureStackTrace" in Error && typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(...args);
  }
}

// src/rpc-enum-errors.ts
function getSolanaErrorFromRpcError({
  errorCodeBaseOffset,
  getErrorContext,
  orderedErrorNames,
  rpcEnumError
}, constructorOpt) {
  let rpcErrorName;
  let rpcErrorContext;
  if (typeof rpcEnumError === "string") {
    rpcErrorName = rpcEnumError;
  } else {
    rpcErrorName = Object.keys(rpcEnumError)[0];
    rpcErrorContext = rpcEnumError[rpcErrorName];
  }
  const codeOffset = orderedErrorNames.indexOf(rpcErrorName);
  const errorCode = errorCodeBaseOffset + codeOffset;
  const errorContext = getErrorContext(errorCode, rpcErrorName, rpcErrorContext);
  const err = new SolanaError(errorCode, errorContext);
  safeCaptureStackTrace(err, constructorOpt);
  return err;
}

// src/instruction-error.ts
var ORDERED_ERROR_NAMES = [
// Keep synced with RPC source: https://github.com/anza-xyz/agave/blob/master/sdk/program/src/instruction.rs
// If this list ever gets too large, consider implementing a compression strategy like this:
// https://gist.github.com/steveluscher/aaa7cbbb5433b1197983908a40860c47
"GenericError", "InvalidArgument", "InvalidInstructionData", "InvalidAccountData", "AccountDataTooSmall", "InsufficientFunds", "IncorrectProgramId", "MissingRequiredSignature", "AccountAlreadyInitialized", "UninitializedAccount", "UnbalancedInstruction", "ModifiedProgramId", "ExternalAccountLamportSpend", "ExternalAccountDataModified", "ReadonlyLamportChange", "ReadonlyDataModified", "DuplicateAccountIndex", "ExecutableModified", "RentEpochModified", "NotEnoughAccountKeys", "AccountDataSizeChanged", "AccountNotExecutable", "AccountBorrowFailed", "AccountBorrowOutstanding", "DuplicateAccountOutOfSync", "Custom", "InvalidError", "ExecutableDataModified", "ExecutableLamportChange", "ExecutableAccountNotRentExempt", "UnsupportedProgramId", "CallDepth", "MissingAccount", "ReentrancyNotAllowed", "MaxSeedLengthExceeded", "InvalidSeeds", "InvalidRealloc", "ComputationalBudgetExceeded", "PrivilegeEscalation", "ProgramEnvironmentSetupFailure", "ProgramFailedToComplete", "ProgramFailedToCompile", "Immutable", "IncorrectAuthority", "BorshIoError", "AccountNotRentExempt", "InvalidAccountOwner", "ArithmeticOverflow", "UnsupportedSysvar", "IllegalOwner", "MaxAccountsDataAllocationsExceeded", "MaxAccountsExceeded", "MaxInstructionTraceLengthExceeded", "BuiltinProgramsMustConsumeComputeUnits"];
function getSolanaErrorFromInstructionError(index, instructionError) {
  return getSolanaErrorFromRpcError({
    errorCodeBaseOffset: 4615001,
    getErrorContext(errorCode, rpcErrorName, rpcErrorContext) {
      if (errorCode === SOLANA_ERROR__INSTRUCTION_ERROR__UNKNOWN) {
        return {
          errorName: rpcErrorName,
          index,
          ...(rpcErrorContext !== void 0 ? {
            instructionErrorContext: rpcErrorContext
          } : null)
        };
      } else if (errorCode === SOLANA_ERROR__INSTRUCTION_ERROR__CUSTOM) {
        return {
          code: rpcErrorContext,
          index
        };
      } else if (errorCode === SOLANA_ERROR__INSTRUCTION_ERROR__BORSH_IO_ERROR) {
        return {
          encodedData: rpcErrorContext,
          index
        };
      }
      return {
        index
      };
    },
    orderedErrorNames: ORDERED_ERROR_NAMES,
    rpcEnumError: instructionError
  }, getSolanaErrorFromInstructionError);
}

// src/transaction-error.ts
var ORDERED_ERROR_NAMES2 = [
// Keep synced with RPC source: https://github.com/anza-xyz/agave/blob/master/sdk/src/transaction/error.rs
// If this list ever gets too large, consider implementing a compression strategy like this:
// https://gist.github.com/steveluscher/aaa7cbbb5433b1197983908a40860c47
"AccountInUse", "AccountLoadedTwice", "AccountNotFound", "ProgramAccountNotFound", "InsufficientFundsForFee", "InvalidAccountForFee", "AlreadyProcessed", "BlockhashNotFound",
// `InstructionError` intentionally omitted; delegated to `getSolanaErrorFromInstructionError`
"CallChainTooDeep", "MissingSignatureForFee", "InvalidAccountIndex", "SignatureFailure", "InvalidProgramForExecution", "SanitizeFailure", "ClusterMaintenance", "AccountBorrowOutstanding", "WouldExceedMaxBlockCostLimit", "UnsupportedVersion", "InvalidWritableAccount", "WouldExceedMaxAccountCostLimit", "WouldExceedAccountDataBlockLimit", "TooManyAccountLocks", "AddressLookupTableNotFound", "InvalidAddressLookupTableOwner", "InvalidAddressLookupTableData", "InvalidAddressLookupTableIndex", "InvalidRentPayingAccount", "WouldExceedMaxVoteCostLimit", "WouldExceedAccountDataTotalLimit", "DuplicateInstruction", "InsufficientFundsForRent", "MaxLoadedAccountsDataSizeExceeded", "InvalidLoadedAccountsDataSizeLimit", "ResanitizationNeeded", "ProgramExecutionTemporarilyRestricted", "UnbalancedTransaction"];
function getSolanaErrorFromTransactionError(transactionError) {
  if (typeof transactionError === "object" && "InstructionError" in transactionError) {
    return getSolanaErrorFromInstructionError(...transactionError.InstructionError);
  }
  return getSolanaErrorFromRpcError({
    errorCodeBaseOffset: 7050001,
    getErrorContext(errorCode, rpcErrorName, rpcErrorContext) {
      if (errorCode === SOLANA_ERROR__TRANSACTION_ERROR__UNKNOWN) {
        return {
          errorName: rpcErrorName,
          ...(rpcErrorContext !== void 0 ? {
            transactionErrorContext: rpcErrorContext
          } : null)
        };
      } else if (errorCode === SOLANA_ERROR__TRANSACTION_ERROR__DUPLICATE_INSTRUCTION) {
        return {
          index: rpcErrorContext
        };
      } else if (errorCode === SOLANA_ERROR__TRANSACTION_ERROR__INSUFFICIENT_FUNDS_FOR_RENT || errorCode === SOLANA_ERROR__TRANSACTION_ERROR__PROGRAM_EXECUTION_TEMPORARILY_RESTRICTED) {
        return {
          accountIndex: rpcErrorContext.account_index
        };
      }
    },
    orderedErrorNames: ORDERED_ERROR_NAMES2,
    rpcEnumError: transactionError
  }, getSolanaErrorFromTransactionError);
}

// src/json-rpc-error.ts
function getSolanaErrorFromJsonRpcError({
  code,
  data,
  message
}) {
  let out;
  if (code === SOLANA_ERROR__JSON_RPC__SERVER_ERROR_SEND_TRANSACTION_PREFLIGHT_FAILURE) {
    const {
      err,
      ...preflightErrorContext
    } = data;
    const causeObject = err ? {
      cause: getSolanaErrorFromTransactionError(err)
    } : null;
    out = new SolanaError(SOLANA_ERROR__JSON_RPC__SERVER_ERROR_SEND_TRANSACTION_PREFLIGHT_FAILURE, {
      ...preflightErrorContext,
      ...causeObject
    });
  } else {
    let errorContext;
    switch (code) {
      case SOLANA_ERROR__JSON_RPC__INTERNAL_ERROR:
      case SOLANA_ERROR__JSON_RPC__INVALID_PARAMS:
      case SOLANA_ERROR__JSON_RPC__INVALID_REQUEST:
      case SOLANA_ERROR__JSON_RPC__METHOD_NOT_FOUND:
      case SOLANA_ERROR__JSON_RPC__PARSE_ERROR:
      case SOLANA_ERROR__JSON_RPC__SCAN_ERROR:
      case SOLANA_ERROR__JSON_RPC__SERVER_ERROR_BLOCK_CLEANED_UP:
      case SOLANA_ERROR__JSON_RPC__SERVER_ERROR_BLOCK_NOT_AVAILABLE:
      case SOLANA_ERROR__JSON_RPC__SERVER_ERROR_BLOCK_STATUS_NOT_AVAILABLE_YET:
      case SOLANA_ERROR__JSON_RPC__SERVER_ERROR_KEY_EXCLUDED_FROM_SECONDARY_INDEX:
      case SOLANA_ERROR__JSON_RPC__SERVER_ERROR_LONG_TERM_STORAGE_SLOT_SKIPPED:
      case SOLANA_ERROR__JSON_RPC__SERVER_ERROR_SLOT_SKIPPED:
      case SOLANA_ERROR__JSON_RPC__SERVER_ERROR_TRANSACTION_PRECOMPILE_VERIFICATION_FAILURE:
      case SOLANA_ERROR__JSON_RPC__SERVER_ERROR_UNSUPPORTED_TRANSACTION_VERSION:
        errorContext = {
          __serverMessage: message
        };
        break;
      default:
        if (typeof data === "object" && !Array.isArray(data)) {
          errorContext = data;
        }
    }
    out = new SolanaError(code, errorContext);
  }
  safeCaptureStackTrace(out, getSolanaErrorFromJsonRpcError);
  return out;
}


//# sourceMappingURL=index.browser.mjs.map

/***/ },

/***/ 66970
/*!**************************************************************************!*\
  !*** ./node_modules/@solana/spl-token-group/lib/esm/state/tokenGroup.js ***!
  \**************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TOKEN_GROUP_SIZE: () => (/* binding */ TOKEN_GROUP_SIZE),
/* harmony export */   packTokenGroup: () => (/* binding */ packTokenGroup),
/* harmony export */   unpackTokenGroup: () => (/* binding */ unpackTokenGroup)
/* harmony export */ });
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/web3.js */ 47647);
/* harmony import */ var _solana_codecs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/codecs */ 37750);
/* harmony import */ var _solana_codecs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/codecs */ 57718);
/* harmony import */ var _solana_codecs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @solana/codecs */ 1565);


const tokenGroupCodec = (0,_solana_codecs__WEBPACK_IMPORTED_MODULE_2__.getStructCodec)([['updateAuthority', (0,_solana_codecs__WEBPACK_IMPORTED_MODULE_1__.fixCodecSize)((0,_solana_codecs__WEBPACK_IMPORTED_MODULE_2__.getBytesCodec)(), 32)], ['mint', (0,_solana_codecs__WEBPACK_IMPORTED_MODULE_1__.fixCodecSize)((0,_solana_codecs__WEBPACK_IMPORTED_MODULE_2__.getBytesCodec)(), 32)], ['size', (0,_solana_codecs__WEBPACK_IMPORTED_MODULE_3__.getU64Codec)()], ['maxSize', (0,_solana_codecs__WEBPACK_IMPORTED_MODULE_3__.getU64Codec)()]]);
const TOKEN_GROUP_SIZE = tokenGroupCodec.fixedSize;
// Checks if all elements in the array are 0
function isNonePubkey(buffer) {
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] !== 0) {
      return false;
    }
  }
  return true;
}
// Pack TokenGroup into byte slab
function packTokenGroup(group) {
  // If no updateAuthority given, set it to the None/Zero PublicKey for encoding
  const updateAuthority = group.updateAuthority ?? _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey.default;
  return tokenGroupCodec.encode({
    updateAuthority: updateAuthority.toBuffer(),
    mint: group.mint.toBuffer(),
    size: group.size,
    maxSize: group.maxSize
  });
}
// unpack byte slab into TokenGroup
function unpackTokenGroup(buffer) {
  const data = tokenGroupCodec.decode(buffer);
  return isNonePubkey(data.updateAuthority) ? {
    mint: new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey(data.mint),
    size: data.size,
    maxSize: data.maxSize
  } : {
    updateAuthority: new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey(data.updateAuthority),
    mint: new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey(data.mint),
    size: data.size,
    maxSize: data.maxSize
  };
}

/***/ },

/***/ 94828
/*!********************************************************************************!*\
  !*** ./node_modules/@solana/spl-token-group/lib/esm/state/tokenGroupMember.js ***!
  \********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TOKEN_GROUP_MEMBER_SIZE: () => (/* binding */ TOKEN_GROUP_MEMBER_SIZE),
/* harmony export */   packTokenGroupMember: () => (/* binding */ packTokenGroupMember),
/* harmony export */   unpackTokenGroupMember: () => (/* binding */ unpackTokenGroupMember)
/* harmony export */ });
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/web3.js */ 47647);
/* harmony import */ var _solana_codecs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/codecs */ 37750);
/* harmony import */ var _solana_codecs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/codecs */ 57718);
/* harmony import */ var _solana_codecs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @solana/codecs */ 1565);


const tokenGroupMemberCodec = (0,_solana_codecs__WEBPACK_IMPORTED_MODULE_2__.getStructCodec)([['mint', (0,_solana_codecs__WEBPACK_IMPORTED_MODULE_1__.fixCodecSize)((0,_solana_codecs__WEBPACK_IMPORTED_MODULE_2__.getBytesCodec)(), 32)], ['group', (0,_solana_codecs__WEBPACK_IMPORTED_MODULE_1__.fixCodecSize)((0,_solana_codecs__WEBPACK_IMPORTED_MODULE_2__.getBytesCodec)(), 32)], ['memberNumber', (0,_solana_codecs__WEBPACK_IMPORTED_MODULE_3__.getU64Codec)()]]);
const TOKEN_GROUP_MEMBER_SIZE = tokenGroupMemberCodec.fixedSize;
// Pack TokenGroupMember into byte slab
function packTokenGroupMember(member) {
  return tokenGroupMemberCodec.encode({
    mint: member.mint.toBuffer(),
    group: member.group.toBuffer(),
    memberNumber: member.memberNumber
  });
}
// unpack byte slab into TokenGroupMember
function unpackTokenGroupMember(buffer) {
  const data = tokenGroupMemberCodec.decode(buffer);
  return {
    mint: new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey(data.mint),
    group: new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey(data.group),
    memberNumber: data.memberNumber
  };
}

/***/ },

/***/ 53949
/*!*************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/constants.js ***!
  \*************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ASSOCIATED_TOKEN_PROGRAM_ID: () => (/* binding */ ASSOCIATED_TOKEN_PROGRAM_ID),
/* harmony export */   NATIVE_MINT: () => (/* binding */ NATIVE_MINT),
/* harmony export */   NATIVE_MINT_2022: () => (/* binding */ NATIVE_MINT_2022),
/* harmony export */   TOKEN_2022_PROGRAM_ID: () => (/* binding */ TOKEN_2022_PROGRAM_ID),
/* harmony export */   TOKEN_PROGRAM_ID: () => (/* binding */ TOKEN_PROGRAM_ID),
/* harmony export */   programSupportsExtensions: () => (/* binding */ programSupportsExtensions)
/* harmony export */ });
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/web3.js */ 47647);

/** Address of the SPL Token program */
const TOKEN_PROGRAM_ID = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
/** Address of the SPL Token 2022 program */
const TOKEN_2022_PROGRAM_ID = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');
/** Address of the SPL Associated Token Account program */
const ASSOCIATED_TOKEN_PROGRAM_ID = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
/** Address of the special mint for wrapped native SOL in spl-token */
const NATIVE_MINT = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey('So11111111111111111111111111111111111111112');
/** Address of the special mint for wrapped native SOL in spl-token-2022 */
const NATIVE_MINT_2022 = new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey('9pan9bMn5HatX4EJdBwg9VgCa7Uz5HL8N1m5D3NdXejP');
/** Check that the token program provided is not `Tokenkeg...`, useful when using extensions */
function programSupportsExtensions(programId) {
  if (programId.equals(TOKEN_PROGRAM_ID)) {
    return false;
  } else {
    return true;
  }
}

/***/ },

/***/ 34601
/*!**********************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/errors.js ***!
  \**********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TokenAccountNotFoundError: () => (/* binding */ TokenAccountNotFoundError),
/* harmony export */   TokenError: () => (/* binding */ TokenError),
/* harmony export */   TokenInvalidAccountDataError: () => (/* binding */ TokenInvalidAccountDataError),
/* harmony export */   TokenInvalidAccountError: () => (/* binding */ TokenInvalidAccountError),
/* harmony export */   TokenInvalidAccountOwnerError: () => (/* binding */ TokenInvalidAccountOwnerError),
/* harmony export */   TokenInvalidAccountSizeError: () => (/* binding */ TokenInvalidAccountSizeError),
/* harmony export */   TokenInvalidInstructionDataError: () => (/* binding */ TokenInvalidInstructionDataError),
/* harmony export */   TokenInvalidInstructionKeysError: () => (/* binding */ TokenInvalidInstructionKeysError),
/* harmony export */   TokenInvalidInstructionProgramError: () => (/* binding */ TokenInvalidInstructionProgramError),
/* harmony export */   TokenInvalidInstructionTypeError: () => (/* binding */ TokenInvalidInstructionTypeError),
/* harmony export */   TokenInvalidMintError: () => (/* binding */ TokenInvalidMintError),
/* harmony export */   TokenInvalidOwnerError: () => (/* binding */ TokenInvalidOwnerError),
/* harmony export */   TokenOwnerOffCurveError: () => (/* binding */ TokenOwnerOffCurveError),
/* harmony export */   TokenTransferHookAccountDataNotFound: () => (/* binding */ TokenTransferHookAccountDataNotFound),
/* harmony export */   TokenTransferHookAccountNotFound: () => (/* binding */ TokenTransferHookAccountNotFound),
/* harmony export */   TokenTransferHookInvalidPubkeyData: () => (/* binding */ TokenTransferHookInvalidPubkeyData),
/* harmony export */   TokenTransferHookInvalidSeed: () => (/* binding */ TokenTransferHookInvalidSeed),
/* harmony export */   TokenTransferHookPubkeyDataTooSmall: () => (/* binding */ TokenTransferHookPubkeyDataTooSmall),
/* harmony export */   TokenUnsupportedInstructionError: () => (/* binding */ TokenUnsupportedInstructionError)
/* harmony export */ });
/** Base class for errors */
class TokenError extends Error {
  constructor(message) {
    super(message);
  }
}
/** Thrown if an account is not found at the expected address */
class TokenAccountNotFoundError extends TokenError {
  constructor() {
    super(...arguments);
    this.name = 'TokenAccountNotFoundError';
  }
}
/** Thrown if a program state account is not a valid Account */
class TokenInvalidAccountError extends TokenError {
  constructor() {
    super(...arguments);
    this.name = 'TokenInvalidAccountError';
  }
}
/** Thrown if a program state account does not contain valid data */
class TokenInvalidAccountDataError extends TokenError {
  constructor() {
    super(...arguments);
    this.name = 'TokenInvalidAccountDataError';
  }
}
/** Thrown if a program state account is not owned by the expected token program */
class TokenInvalidAccountOwnerError extends TokenError {
  constructor() {
    super(...arguments);
    this.name = 'TokenInvalidAccountOwnerError';
  }
}
/** Thrown if the byte length of an program state account doesn't match the expected size */
class TokenInvalidAccountSizeError extends TokenError {
  constructor() {
    super(...arguments);
    this.name = 'TokenInvalidAccountSizeError';
  }
}
/** Thrown if the mint of a token account doesn't match the expected mint */
class TokenInvalidMintError extends TokenError {
  constructor() {
    super(...arguments);
    this.name = 'TokenInvalidMintError';
  }
}
/** Thrown if the owner of a token account doesn't match the expected owner */
class TokenInvalidOwnerError extends TokenError {
  constructor() {
    super(...arguments);
    this.name = 'TokenInvalidOwnerError';
  }
}
/** Thrown if the owner of a token account is a PDA (Program Derived Address) */
class TokenOwnerOffCurveError extends TokenError {
  constructor() {
    super(...arguments);
    this.name = 'TokenOwnerOffCurveError';
  }
}
/** Thrown if an instruction's program is invalid */
class TokenInvalidInstructionProgramError extends TokenError {
  constructor() {
    super(...arguments);
    this.name = 'TokenInvalidInstructionProgramError';
  }
}
/** Thrown if an instruction's keys are invalid */
class TokenInvalidInstructionKeysError extends TokenError {
  constructor() {
    super(...arguments);
    this.name = 'TokenInvalidInstructionKeysError';
  }
}
/** Thrown if an instruction's data is invalid */
class TokenInvalidInstructionDataError extends TokenError {
  constructor() {
    super(...arguments);
    this.name = 'TokenInvalidInstructionDataError';
  }
}
/** Thrown if an instruction's type is invalid */
class TokenInvalidInstructionTypeError extends TokenError {
  constructor() {
    super(...arguments);
    this.name = 'TokenInvalidInstructionTypeError';
  }
}
/** Thrown if the program does not support the desired instruction */
class TokenUnsupportedInstructionError extends TokenError {
  constructor() {
    super(...arguments);
    this.name = 'TokenUnsupportedInstructionError';
  }
}
/** Thrown if the transfer hook extra accounts contains an invalid account index */
class TokenTransferHookAccountNotFound extends TokenError {
  constructor() {
    super(...arguments);
    this.name = 'TokenTransferHookAccountNotFound';
  }
}
/** Thrown if the transfer hook extra accounts contains an invalid seed */
class TokenTransferHookInvalidSeed extends TokenError {
  constructor() {
    super(...arguments);
    this.name = 'TokenTransferHookInvalidSeed';
  }
}
/** Thrown if account data required by an extra account meta seed config could not be fetched */
class TokenTransferHookAccountDataNotFound extends TokenError {
  constructor() {
    super(...arguments);
    this.name = 'TokenTransferHookAccountDataNotFound';
  }
}
/** Thrown if pubkey data extra accounts config is invalid */
class TokenTransferHookInvalidPubkeyData extends TokenError {
  constructor() {
    super(...arguments);
    this.name = 'TokenTransferHookInvalidPubkeyData';
  }
}
/** Thrown if pubkey data source is too small for a pubkey */
class TokenTransferHookPubkeyDataTooSmall extends TokenError {
  constructor() {
    super(...arguments);
    this.name = 'TokenTransferHookPubkeyDataTooSmall';
  }
}

/***/ },

/***/ 0
/*!**************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/accountType.js ***!
  \**************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACCOUNT_TYPE_SIZE: () => (/* binding */ ACCOUNT_TYPE_SIZE),
/* harmony export */   AccountType: () => (/* binding */ AccountType)
/* harmony export */ });
var AccountType;
(function (AccountType) {
  AccountType[AccountType["Uninitialized"] = 0] = "Uninitialized";
  AccountType[AccountType["Mint"] = 1] = "Mint";
  AccountType[AccountType["Account"] = 2] = "Account";
})(AccountType || (AccountType = {}));
const ACCOUNT_TYPE_SIZE = 1;

/***/ },

/***/ 96738
/*!*****************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/cpiGuard/state.js ***!
  \*****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CPI_GUARD_SIZE: () => (/* binding */ CPI_GUARD_SIZE),
/* harmony export */   CpiGuardLayout: () => (/* binding */ CpiGuardLayout),
/* harmony export */   getCpiGuard: () => (/* binding */ getCpiGuard)
/* harmony export */ });
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/buffer-layout-utils */ 99033);
/* harmony import */ var _extensionType_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../extensionType.js */ 18370);



/** Buffer layout for de/serializing a CPI Guard extension */
const CpiGuardLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([(0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.bool)('lockCpi')]);
const CPI_GUARD_SIZE = CpiGuardLayout.span;
function getCpiGuard(account) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.ExtensionType.CpiGuard, account.tlvData);
  if (extensionData !== null) {
    return CpiGuardLayout.decode(extensionData);
  } else {
    return null;
  }
}

/***/ },

/***/ 8768
/*!****************************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/defaultAccountState/state.js ***!
  \****************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_ACCOUNT_STATE_SIZE: () => (/* binding */ DEFAULT_ACCOUNT_STATE_SIZE),
/* harmony export */   DefaultAccountStateLayout: () => (/* binding */ DefaultAccountStateLayout),
/* harmony export */   getDefaultAccountState: () => (/* binding */ getDefaultAccountState)
/* harmony export */ });
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _extensionType_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../extensionType.js */ 18370);


/** Buffer layout for de/serializing a transfer fee config extension */
const DefaultAccountStateLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([(0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.u8)('state')]);
const DEFAULT_ACCOUNT_STATE_SIZE = DefaultAccountStateLayout.span;
function getDefaultAccountState(mint) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_1__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_1__.ExtensionType.DefaultAccountState, mint.tlvData);
  if (extensionData !== null) {
    return DefaultAccountStateLayout.decode(extensionData);
  } else {
    return null;
  }
}

/***/ },

/***/ 18370
/*!****************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/extensionType.js ***!
  \****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExtensionType: () => (/* binding */ ExtensionType),
/* harmony export */   LENGTH_SIZE: () => (/* binding */ LENGTH_SIZE),
/* harmony export */   TYPE_SIZE: () => (/* binding */ TYPE_SIZE),
/* harmony export */   getAccountLen: () => (/* binding */ getAccountLen),
/* harmony export */   getAccountLenForMint: () => (/* binding */ getAccountLenForMint),
/* harmony export */   getAccountTypeOfMintType: () => (/* binding */ getAccountTypeOfMintType),
/* harmony export */   getExtensionData: () => (/* binding */ getExtensionData),
/* harmony export */   getExtensionTypes: () => (/* binding */ getExtensionTypes),
/* harmony export */   getMintLen: () => (/* binding */ getMintLen),
/* harmony export */   getNewAccountLenForExtensionLen: () => (/* binding */ getNewAccountLenForExtensionLen),
/* harmony export */   getTypeLen: () => (/* binding */ getTypeLen),
/* harmony export */   isAccountExtension: () => (/* binding */ isAccountExtension),
/* harmony export */   isMintExtension: () => (/* binding */ isMintExtension)
/* harmony export */ });
/* harmony import */ var _state_account_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state/account.js */ 35737);
/* harmony import */ var _state_mint_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../state/mint.js */ 65408);
/* harmony import */ var _state_multisig_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../state/multisig.js */ 20234);
/* harmony import */ var _accountType_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./accountType.js */ 0);
/* harmony import */ var _cpiGuard_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./cpiGuard/index.js */ 96738);
/* harmony import */ var _defaultAccountState_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./defaultAccountState/index.js */ 8768);
/* harmony import */ var _tokenGroup_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./tokenGroup/index.js */ 66970);
/* harmony import */ var _tokenGroup_index_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./tokenGroup/index.js */ 94828);
/* harmony import */ var _groupMemberPointer_state_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./groupMemberPointer/state.js */ 88359);
/* harmony import */ var _groupPointer_state_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./groupPointer/state.js */ 21149);
/* harmony import */ var _immutableOwner_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./immutableOwner.js */ 1228);
/* harmony import */ var _interestBearingMint_state_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./interestBearingMint/state.js */ 99525);
/* harmony import */ var _memoTransfer_index_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./memoTransfer/index.js */ 8472);
/* harmony import */ var _metadataPointer_state_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./metadataPointer/state.js */ 96571);
/* harmony import */ var _mintCloseAuthority_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./mintCloseAuthority.js */ 49934);
/* harmony import */ var _nonTransferable_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./nonTransferable.js */ 13227);
/* harmony import */ var _pausable_index_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./pausable/index.js */ 26197);
/* harmony import */ var _permanentDelegate_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./permanentDelegate.js */ 55198);
/* harmony import */ var _permissionedBurn_state_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./permissionedBurn/state.js */ 26978);
/* harmony import */ var _scaledUiAmount_index_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./scaledUiAmount/index.js */ 77949);
/* harmony import */ var _transferFee_index_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./transferFee/index.js */ 27432);
/* harmony import */ var _transferHook_index_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./transferHook/index.js */ 25657);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../constants.js */ 53949);






















// Sequence from https://github.com/solana-labs/solana-program-library/blob/master/token/program-2022/src/extension/mod.rs#L903
var ExtensionType;
(function (ExtensionType) {
  ExtensionType[ExtensionType["Uninitialized"] = 0] = "Uninitialized";
  ExtensionType[ExtensionType["TransferFeeConfig"] = 1] = "TransferFeeConfig";
  ExtensionType[ExtensionType["TransferFeeAmount"] = 2] = "TransferFeeAmount";
  ExtensionType[ExtensionType["MintCloseAuthority"] = 3] = "MintCloseAuthority";
  ExtensionType[ExtensionType["ConfidentialTransferMint"] = 4] = "ConfidentialTransferMint";
  ExtensionType[ExtensionType["ConfidentialTransferAccount"] = 5] = "ConfidentialTransferAccount";
  ExtensionType[ExtensionType["DefaultAccountState"] = 6] = "DefaultAccountState";
  ExtensionType[ExtensionType["ImmutableOwner"] = 7] = "ImmutableOwner";
  ExtensionType[ExtensionType["MemoTransfer"] = 8] = "MemoTransfer";
  ExtensionType[ExtensionType["NonTransferable"] = 9] = "NonTransferable";
  ExtensionType[ExtensionType["InterestBearingConfig"] = 10] = "InterestBearingConfig";
  ExtensionType[ExtensionType["CpiGuard"] = 11] = "CpiGuard";
  ExtensionType[ExtensionType["PermanentDelegate"] = 12] = "PermanentDelegate";
  ExtensionType[ExtensionType["NonTransferableAccount"] = 13] = "NonTransferableAccount";
  ExtensionType[ExtensionType["TransferHook"] = 14] = "TransferHook";
  ExtensionType[ExtensionType["TransferHookAccount"] = 15] = "TransferHookAccount";
  // ConfidentialTransferFee, // Not implemented yet
  // ConfidentialTransferFeeAmount, // Not implemented yet
  ExtensionType[ExtensionType["MetadataPointer"] = 18] = "MetadataPointer";
  ExtensionType[ExtensionType["TokenMetadata"] = 19] = "TokenMetadata";
  ExtensionType[ExtensionType["GroupPointer"] = 20] = "GroupPointer";
  ExtensionType[ExtensionType["TokenGroup"] = 21] = "TokenGroup";
  ExtensionType[ExtensionType["GroupMemberPointer"] = 22] = "GroupMemberPointer";
  ExtensionType[ExtensionType["TokenGroupMember"] = 23] = "TokenGroupMember";
  // ConfidentialMintBurn, // Not implemented yet
  ExtensionType[ExtensionType["ScaledUiAmountConfig"] = 25] = "ScaledUiAmountConfig";
  ExtensionType[ExtensionType["PausableConfig"] = 26] = "PausableConfig";
  ExtensionType[ExtensionType["PausableAccount"] = 27] = "PausableAccount";
  ExtensionType[ExtensionType["PermissionedBurn"] = 28] = "PermissionedBurn";
})(ExtensionType || (ExtensionType = {}));
const TYPE_SIZE = 2;
const LENGTH_SIZE = 2;
function addTypeAndLengthToLen(len) {
  return len + TYPE_SIZE + LENGTH_SIZE;
}
function isVariableLengthExtension(e) {
  switch (e) {
    case ExtensionType.TokenMetadata:
      return true;
    default:
      return false;
  }
}
// NOTE: All of these should eventually use their type's Span instead of these
// constants.  This is provided for at least creation to work.
function getTypeLen(e) {
  switch (e) {
    case ExtensionType.Uninitialized:
      return 0;
    case ExtensionType.TransferFeeConfig:
      return _transferFee_index_js__WEBPACK_IMPORTED_MODULE_20__.TRANSFER_FEE_CONFIG_SIZE;
    case ExtensionType.TransferFeeAmount:
      return _transferFee_index_js__WEBPACK_IMPORTED_MODULE_20__.TRANSFER_FEE_AMOUNT_SIZE;
    case ExtensionType.MintCloseAuthority:
      return _mintCloseAuthority_js__WEBPACK_IMPORTED_MODULE_14__.MINT_CLOSE_AUTHORITY_SIZE;
    case ExtensionType.ConfidentialTransferMint:
      return 65;
    case ExtensionType.ConfidentialTransferAccount:
      return 295;
    case ExtensionType.CpiGuard:
      return _cpiGuard_index_js__WEBPACK_IMPORTED_MODULE_4__.CPI_GUARD_SIZE;
    case ExtensionType.DefaultAccountState:
      return _defaultAccountState_index_js__WEBPACK_IMPORTED_MODULE_5__.DEFAULT_ACCOUNT_STATE_SIZE;
    case ExtensionType.ImmutableOwner:
      return _immutableOwner_js__WEBPACK_IMPORTED_MODULE_10__.IMMUTABLE_OWNER_SIZE;
    case ExtensionType.MemoTransfer:
      return _memoTransfer_index_js__WEBPACK_IMPORTED_MODULE_12__.MEMO_TRANSFER_SIZE;
    case ExtensionType.MetadataPointer:
      return _metadataPointer_state_js__WEBPACK_IMPORTED_MODULE_13__.METADATA_POINTER_SIZE;
    case ExtensionType.NonTransferable:
      return _nonTransferable_js__WEBPACK_IMPORTED_MODULE_15__.NON_TRANSFERABLE_SIZE;
    case ExtensionType.InterestBearingConfig:
      return _interestBearingMint_state_js__WEBPACK_IMPORTED_MODULE_11__.INTEREST_BEARING_MINT_CONFIG_STATE_SIZE;
    case ExtensionType.PermanentDelegate:
      return _permanentDelegate_js__WEBPACK_IMPORTED_MODULE_17__.PERMANENT_DELEGATE_SIZE;
    case ExtensionType.NonTransferableAccount:
      return _nonTransferable_js__WEBPACK_IMPORTED_MODULE_15__.NON_TRANSFERABLE_ACCOUNT_SIZE;
    case ExtensionType.TransferHook:
      return _transferHook_index_js__WEBPACK_IMPORTED_MODULE_21__.TRANSFER_HOOK_SIZE;
    case ExtensionType.TransferHookAccount:
      return _transferHook_index_js__WEBPACK_IMPORTED_MODULE_21__.TRANSFER_HOOK_ACCOUNT_SIZE;
    case ExtensionType.GroupPointer:
      return _groupPointer_state_js__WEBPACK_IMPORTED_MODULE_9__.GROUP_POINTER_SIZE;
    case ExtensionType.GroupMemberPointer:
      return _groupMemberPointer_state_js__WEBPACK_IMPORTED_MODULE_8__.GROUP_MEMBER_POINTER_SIZE;
    case ExtensionType.TokenGroup:
      return _tokenGroup_index_js__WEBPACK_IMPORTED_MODULE_6__.TOKEN_GROUP_SIZE;
    case ExtensionType.TokenGroupMember:
      return _tokenGroup_index_js__WEBPACK_IMPORTED_MODULE_7__.TOKEN_GROUP_MEMBER_SIZE;
    case ExtensionType.ScaledUiAmountConfig:
      return _scaledUiAmount_index_js__WEBPACK_IMPORTED_MODULE_19__.SCALED_UI_AMOUNT_CONFIG_SIZE;
    case ExtensionType.PausableConfig:
      return _pausable_index_js__WEBPACK_IMPORTED_MODULE_16__.PAUSABLE_CONFIG_SIZE;
    case ExtensionType.PausableAccount:
      return _pausable_index_js__WEBPACK_IMPORTED_MODULE_16__.PAUSABLE_ACCOUNT_SIZE;
    case ExtensionType.PermissionedBurn:
      return _permissionedBurn_state_js__WEBPACK_IMPORTED_MODULE_18__.PERMISSIONED_BURN_SIZE;
    case ExtensionType.TokenMetadata:
      throw Error(`Cannot get type length for variable extension type: ${e}`);
    default:
      throw Error(`Unknown extension type: ${e}`);
  }
}
function isMintExtension(e) {
  switch (e) {
    case ExtensionType.TransferFeeConfig:
    case ExtensionType.MintCloseAuthority:
    case ExtensionType.ConfidentialTransferMint:
    case ExtensionType.DefaultAccountState:
    case ExtensionType.NonTransferable:
    case ExtensionType.InterestBearingConfig:
    case ExtensionType.PermanentDelegate:
    case ExtensionType.TransferHook:
    case ExtensionType.MetadataPointer:
    case ExtensionType.TokenMetadata:
    case ExtensionType.GroupPointer:
    case ExtensionType.GroupMemberPointer:
    case ExtensionType.TokenGroup:
    case ExtensionType.TokenGroupMember:
    case ExtensionType.ScaledUiAmountConfig:
    case ExtensionType.PausableConfig:
    case ExtensionType.PermissionedBurn:
      return true;
    case ExtensionType.Uninitialized:
    case ExtensionType.TransferFeeAmount:
    case ExtensionType.ConfidentialTransferAccount:
    case ExtensionType.ImmutableOwner:
    case ExtensionType.MemoTransfer:
    case ExtensionType.CpiGuard:
    case ExtensionType.NonTransferableAccount:
    case ExtensionType.TransferHookAccount:
    case ExtensionType.PausableAccount:
      return false;
    default:
      throw Error(`Unknown extension type: ${e}`);
  }
}
function isAccountExtension(e) {
  switch (e) {
    case ExtensionType.TransferFeeAmount:
    case ExtensionType.ConfidentialTransferAccount:
    case ExtensionType.ImmutableOwner:
    case ExtensionType.MemoTransfer:
    case ExtensionType.CpiGuard:
    case ExtensionType.NonTransferableAccount:
    case ExtensionType.TransferHookAccount:
    case ExtensionType.PausableAccount:
      return true;
    case ExtensionType.Uninitialized:
    case ExtensionType.TransferFeeConfig:
    case ExtensionType.MintCloseAuthority:
    case ExtensionType.ConfidentialTransferMint:
    case ExtensionType.DefaultAccountState:
    case ExtensionType.NonTransferable:
    case ExtensionType.InterestBearingConfig:
    case ExtensionType.PermanentDelegate:
    case ExtensionType.TransferHook:
    case ExtensionType.MetadataPointer:
    case ExtensionType.TokenMetadata:
    case ExtensionType.GroupPointer:
    case ExtensionType.GroupMemberPointer:
    case ExtensionType.TokenGroup:
    case ExtensionType.TokenGroupMember:
    case ExtensionType.ScaledUiAmountConfig:
    case ExtensionType.PausableConfig:
    case ExtensionType.PermissionedBurn:
      return false;
    default:
      throw Error(`Unknown extension type: ${e}`);
  }
}
function getAccountTypeOfMintType(e) {
  switch (e) {
    case ExtensionType.TransferFeeConfig:
      return ExtensionType.TransferFeeAmount;
    case ExtensionType.ConfidentialTransferMint:
      return ExtensionType.ConfidentialTransferAccount;
    case ExtensionType.NonTransferable:
      return ExtensionType.NonTransferableAccount;
    case ExtensionType.TransferHook:
      return ExtensionType.TransferHookAccount;
    case ExtensionType.PausableConfig:
      return ExtensionType.PausableAccount;
    case ExtensionType.TransferFeeAmount:
    case ExtensionType.ConfidentialTransferAccount:
    case ExtensionType.CpiGuard:
    case ExtensionType.DefaultAccountState:
    case ExtensionType.ImmutableOwner:
    case ExtensionType.MemoTransfer:
    case ExtensionType.MintCloseAuthority:
    case ExtensionType.MetadataPointer:
    case ExtensionType.TokenMetadata:
    case ExtensionType.Uninitialized:
    case ExtensionType.InterestBearingConfig:
    case ExtensionType.PermanentDelegate:
    case ExtensionType.NonTransferableAccount:
    case ExtensionType.TransferHookAccount:
    case ExtensionType.GroupPointer:
    case ExtensionType.GroupMemberPointer:
    case ExtensionType.TokenGroup:
    case ExtensionType.TokenGroupMember:
    case ExtensionType.ScaledUiAmountConfig:
    case ExtensionType.PausableAccount:
    case ExtensionType.PermissionedBurn:
      return ExtensionType.Uninitialized;
  }
}
function getLen(extensionTypes, baseSize, variableLengthExtensions = {}) {
  if (extensionTypes.length === 0 && Object.keys(variableLengthExtensions).length === 0) {
    return baseSize;
  } else {
    const accountLength = _state_account_js__WEBPACK_IMPORTED_MODULE_0__.ACCOUNT_SIZE + _accountType_js__WEBPACK_IMPORTED_MODULE_3__.ACCOUNT_TYPE_SIZE + extensionTypes.filter((element, i) => i === extensionTypes.indexOf(element)).map(element => addTypeAndLengthToLen(getTypeLen(element))).reduce((a, b) => a + b, 0) + Object.entries(variableLengthExtensions).map(([extension, len]) => {
      if (!isVariableLengthExtension(Number(extension))) {
        throw Error(`Extension ${extension} is not variable length`);
      }
      return addTypeAndLengthToLen(len);
    }).reduce((a, b) => a + b, 0);
    if (accountLength === _state_multisig_js__WEBPACK_IMPORTED_MODULE_2__.MULTISIG_SIZE) {
      return accountLength + TYPE_SIZE;
    } else {
      return accountLength;
    }
  }
}
function getMintLen(extensionTypes, variableLengthExtensions = {}) {
  return getLen(extensionTypes, _state_mint_js__WEBPACK_IMPORTED_MODULE_1__.MINT_SIZE, variableLengthExtensions);
}
function getAccountLen(extensionTypes) {
  // There are currently no variable length extensions for accounts
  return getLen(extensionTypes, _state_account_js__WEBPACK_IMPORTED_MODULE_0__.ACCOUNT_SIZE);
}
function getExtensionData(extension, tlvData) {
  let extensionTypeIndex = 0;
  while (addTypeAndLengthToLen(extensionTypeIndex) <= tlvData.length) {
    const entryType = tlvData.readUInt16LE(extensionTypeIndex);
    const entryLength = tlvData.readUInt16LE(extensionTypeIndex + TYPE_SIZE);
    const typeIndex = addTypeAndLengthToLen(extensionTypeIndex);
    if (entryType == extension) {
      return tlvData.slice(typeIndex, typeIndex + entryLength);
    }
    extensionTypeIndex = typeIndex + entryLength;
  }
  return null;
}
function getExtensionTypes(tlvData) {
  const extensionTypes = [];
  let extensionTypeIndex = 0;
  while (extensionTypeIndex < tlvData.length) {
    const entryType = tlvData.readUInt16LE(extensionTypeIndex);
    extensionTypes.push(entryType);
    const entryLength = tlvData.readUInt16LE(extensionTypeIndex + TYPE_SIZE);
    extensionTypeIndex += addTypeAndLengthToLen(entryLength);
  }
  return extensionTypes;
}
function getAccountLenForMint(mint) {
  const extensionTypes = getExtensionTypes(mint.tlvData);
  const accountExtensions = extensionTypes.map(getAccountTypeOfMintType);
  return getAccountLen(accountExtensions);
}
function getNewAccountLenForExtensionLen(info, address, extensionType, extensionLen, programId = _constants_js__WEBPACK_IMPORTED_MODULE_22__.TOKEN_2022_PROGRAM_ID) {
  const mint = (0,_state_mint_js__WEBPACK_IMPORTED_MODULE_1__.unpackMint)(address, info, programId);
  const extensionData = getExtensionData(extensionType, mint.tlvData);
  const currentExtensionLen = extensionData ? addTypeAndLengthToLen(extensionData.length) : 0;
  const newExtensionLen = addTypeAndLengthToLen(extensionLen);
  return info.data.length + newExtensionLen - currentExtensionLen;
}

/***/ },

/***/ 88359
/*!***************************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/groupMemberPointer/state.js ***!
  \***************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GROUP_MEMBER_POINTER_SIZE: () => (/* binding */ GROUP_MEMBER_POINTER_SIZE),
/* harmony export */   GroupMemberPointerLayout: () => (/* binding */ GroupMemberPointerLayout),
/* harmony export */   getGroupMemberPointerState: () => (/* binding */ getGroupMemberPointerState)
/* harmony export */ });
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/buffer-layout-utils */ 99033);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/web3.js */ 47647);
/* harmony import */ var _extensionType_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../extensionType.js */ 18370);




/** Buffer layout for de/serializing a Group Pointer extension */
const GroupMemberPointerLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([(0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.publicKey)('authority'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.publicKey)('memberAddress')]);
const GROUP_MEMBER_POINTER_SIZE = GroupMemberPointerLayout.span;
function getGroupMemberPointerState(mint) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_3__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_3__.ExtensionType.GroupMemberPointer, mint.tlvData);
  if (extensionData !== null) {
    const {
      authority,
      memberAddress
    } = GroupMemberPointerLayout.decode(extensionData);
    // Explicitly set None/Zero keys to null
    return {
      authority: authority.equals(_solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.PublicKey.default) ? null : authority,
      memberAddress: memberAddress.equals(_solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.PublicKey.default) ? null : memberAddress
    };
  } else {
    return null;
  }
}

/***/ },

/***/ 21149
/*!*********************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/groupPointer/state.js ***!
  \*********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GROUP_POINTER_SIZE: () => (/* binding */ GROUP_POINTER_SIZE),
/* harmony export */   GroupPointerLayout: () => (/* binding */ GroupPointerLayout),
/* harmony export */   getGroupPointerState: () => (/* binding */ getGroupPointerState)
/* harmony export */ });
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/buffer-layout-utils */ 99033);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/web3.js */ 47647);
/* harmony import */ var _extensionType_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../extensionType.js */ 18370);




/** Buffer layout for de/serializing a GroupPointer extension */
const GroupPointerLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([(0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.publicKey)('authority'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.publicKey)('groupAddress')]);
const GROUP_POINTER_SIZE = GroupPointerLayout.span;
function getGroupPointerState(mint) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_3__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_3__.ExtensionType.GroupPointer, mint.tlvData);
  if (extensionData !== null) {
    const {
      authority,
      groupAddress
    } = GroupPointerLayout.decode(extensionData);
    // Explicitly set None/Zero keys to null
    return {
      authority: authority.equals(_solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.PublicKey.default) ? null : authority,
      groupAddress: groupAddress.equals(_solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.PublicKey.default) ? null : groupAddress
    };
  } else {
    return null;
  }
}

/***/ },

/***/ 1228
/*!*****************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/immutableOwner.js ***!
  \*****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IMMUTABLE_OWNER_SIZE: () => (/* binding */ IMMUTABLE_OWNER_SIZE),
/* harmony export */   ImmutableOwnerLayout: () => (/* binding */ ImmutableOwnerLayout),
/* harmony export */   getImmutableOwner: () => (/* binding */ getImmutableOwner)
/* harmony export */ });
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _extensionType_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extensionType.js */ 18370);


/** Buffer layout for de/serializing an account */
const ImmutableOwnerLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([]);
const IMMUTABLE_OWNER_SIZE = ImmutableOwnerLayout.span;
function getImmutableOwner(account) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_1__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_1__.ExtensionType.ImmutableOwner, account.tlvData);
  if (extensionData !== null) {
    return ImmutableOwnerLayout.decode(extensionData);
  } else {
    return null;
  }
}

/***/ },

/***/ 99525
/*!****************************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/interestBearingMint/state.js ***!
  \****************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   INTEREST_BEARING_MINT_CONFIG_STATE_SIZE: () => (/* binding */ INTEREST_BEARING_MINT_CONFIG_STATE_SIZE),
/* harmony export */   InterestBearingMintConfigStateLayout: () => (/* binding */ InterestBearingMintConfigStateLayout),
/* harmony export */   getInterestBearingMintConfigState: () => (/* binding */ getInterestBearingMintConfigState)
/* harmony export */ });
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/buffer-layout-utils */ 99033);
/* harmony import */ var _extensionType_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../extensionType.js */ 18370);



const InterestBearingMintConfigStateLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([(0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.publicKey)('rateAuthority'), (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.ns64)('initializationTimestamp'), (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.s16)('preUpdateAverageRate'), (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.ns64)('lastUpdateTimestamp'), (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.s16)('currentRate')]);
const INTEREST_BEARING_MINT_CONFIG_STATE_SIZE = InterestBearingMintConfigStateLayout.span;
function getInterestBearingMintConfigState(mint) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.ExtensionType.InterestBearingConfig, mint.tlvData);
  if (extensionData !== null) {
    return InterestBearingMintConfigStateLayout.decode(extensionData);
  }
  return null;
}

/***/ },

/***/ 8472
/*!*********************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/memoTransfer/state.js ***!
  \*********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MEMO_TRANSFER_SIZE: () => (/* binding */ MEMO_TRANSFER_SIZE),
/* harmony export */   MemoTransferLayout: () => (/* binding */ MemoTransferLayout),
/* harmony export */   getMemoTransfer: () => (/* binding */ getMemoTransfer)
/* harmony export */ });
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/buffer-layout-utils */ 99033);
/* harmony import */ var _extensionType_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../extensionType.js */ 18370);



/** Buffer layout for de/serializing a memo transfer extension */
const MemoTransferLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([(0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.bool)('requireIncomingTransferMemos')]);
const MEMO_TRANSFER_SIZE = MemoTransferLayout.span;
function getMemoTransfer(account) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.ExtensionType.MemoTransfer, account.tlvData);
  if (extensionData !== null) {
    return MemoTransferLayout.decode(extensionData);
  } else {
    return null;
  }
}

/***/ },

/***/ 96571
/*!************************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/metadataPointer/state.js ***!
  \************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   METADATA_POINTER_SIZE: () => (/* binding */ METADATA_POINTER_SIZE),
/* harmony export */   MetadataPointerLayout: () => (/* binding */ MetadataPointerLayout),
/* harmony export */   getMetadataPointerState: () => (/* binding */ getMetadataPointerState)
/* harmony export */ });
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/buffer-layout-utils */ 99033);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/web3.js */ 47647);
/* harmony import */ var _extensionType_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../extensionType.js */ 18370);




/** Buffer layout for de/serializing a Metadata Pointer extension */
const MetadataPointerLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([(0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.publicKey)('authority'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.publicKey)('metadataAddress')]);
const METADATA_POINTER_SIZE = MetadataPointerLayout.span;
function getMetadataPointerState(mint) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_3__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_3__.ExtensionType.MetadataPointer, mint.tlvData);
  if (extensionData !== null) {
    const {
      authority,
      metadataAddress
    } = MetadataPointerLayout.decode(extensionData);
    // Explicitly set None/Zero keys to null
    return {
      authority: authority.equals(_solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.PublicKey.default) ? null : authority,
      metadataAddress: metadataAddress.equals(_solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.PublicKey.default) ? null : metadataAddress
    };
  } else {
    return null;
  }
}

/***/ },

/***/ 49934
/*!*********************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/mintCloseAuthority.js ***!
  \*********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MINT_CLOSE_AUTHORITY_SIZE: () => (/* binding */ MINT_CLOSE_AUTHORITY_SIZE),
/* harmony export */   MintCloseAuthorityLayout: () => (/* binding */ MintCloseAuthorityLayout),
/* harmony export */   getMintCloseAuthority: () => (/* binding */ getMintCloseAuthority)
/* harmony export */ });
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/buffer-layout-utils */ 99033);
/* harmony import */ var _extensionType_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extensionType.js */ 18370);



/** Buffer layout for de/serializing a mint */
const MintCloseAuthorityLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([(0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.publicKey)('closeAuthority')]);
const MINT_CLOSE_AUTHORITY_SIZE = MintCloseAuthorityLayout.span;
function getMintCloseAuthority(mint) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.ExtensionType.MintCloseAuthority, mint.tlvData);
  if (extensionData !== null) {
    return MintCloseAuthorityLayout.decode(extensionData);
  } else {
    return null;
  }
}

/***/ },

/***/ 13227
/*!******************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/nonTransferable.js ***!
  \******************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NON_TRANSFERABLE_ACCOUNT_SIZE: () => (/* binding */ NON_TRANSFERABLE_ACCOUNT_SIZE),
/* harmony export */   NON_TRANSFERABLE_SIZE: () => (/* binding */ NON_TRANSFERABLE_SIZE),
/* harmony export */   NonTransferableLayout: () => (/* binding */ NonTransferableLayout),
/* harmony export */   getNonTransferable: () => (/* binding */ getNonTransferable),
/* harmony export */   getNonTransferableAccount: () => (/* binding */ getNonTransferableAccount)
/* harmony export */ });
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _extensionType_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./extensionType.js */ 18370);


/** Buffer layout for de/serializing an account */
const NonTransferableLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([]);
const NON_TRANSFERABLE_SIZE = NonTransferableLayout.span;
const NON_TRANSFERABLE_ACCOUNT_SIZE = NonTransferableLayout.span;
function getNonTransferable(mint) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_1__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_1__.ExtensionType.NonTransferable, mint.tlvData);
  if (extensionData !== null) {
    return NonTransferableLayout.decode(extensionData);
  } else {
    return null;
  }
}
function getNonTransferableAccount(account) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_1__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_1__.ExtensionType.NonTransferableAccount, account.tlvData);
  if (extensionData !== null) {
    return NonTransferableLayout.decode(extensionData);
  } else {
    return null;
  }
}

/***/ },

/***/ 26197
/*!*****************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/pausable/state.js ***!
  \*****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PAUSABLE_ACCOUNT_SIZE: () => (/* binding */ PAUSABLE_ACCOUNT_SIZE),
/* harmony export */   PAUSABLE_CONFIG_SIZE: () => (/* binding */ PAUSABLE_CONFIG_SIZE),
/* harmony export */   PausableAccountLayout: () => (/* binding */ PausableAccountLayout),
/* harmony export */   PausableConfigLayout: () => (/* binding */ PausableConfigLayout),
/* harmony export */   getPausableAccount: () => (/* binding */ getPausableAccount),
/* harmony export */   getPausableConfig: () => (/* binding */ getPausableConfig)
/* harmony export */ });
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/buffer-layout-utils */ 99033);
/* harmony import */ var _extensionType_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../extensionType.js */ 18370);



/** Buffer layout for de/serializing a pausable config */
const PausableConfigLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([(0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.publicKey)('authority'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.bool)('paused')]);
const PAUSABLE_CONFIG_SIZE = PausableConfigLayout.span;
function getPausableConfig(mint) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.ExtensionType.PausableConfig, mint.tlvData);
  if (extensionData !== null) {
    return PausableConfigLayout.decode(extensionData);
  } else {
    return null;
  }
}
/** Buffer layout for de/serializing a pausable account */
const PausableAccountLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([]); // esline-disable-line
const PAUSABLE_ACCOUNT_SIZE = PausableAccountLayout.span;
function getPausableAccount(account) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.ExtensionType.PausableAccount, account.tlvData);
  if (extensionData !== null) {
    return PausableAccountLayout.decode(extensionData);
  } else {
    return null;
  }
}

/***/ },

/***/ 55198
/*!********************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/permanentDelegate.js ***!
  \********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PERMANENT_DELEGATE_SIZE: () => (/* binding */ PERMANENT_DELEGATE_SIZE),
/* harmony export */   PermanentDelegateLayout: () => (/* binding */ PermanentDelegateLayout),
/* harmony export */   getPermanentDelegate: () => (/* binding */ getPermanentDelegate)
/* harmony export */ });
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/buffer-layout-utils */ 99033);
/* harmony import */ var _extensionType_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./extensionType.js */ 18370);



/** Buffer layout for de/serializing a mint */
const PermanentDelegateLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([(0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.publicKey)('delegate')]);
const PERMANENT_DELEGATE_SIZE = PermanentDelegateLayout.span;
function getPermanentDelegate(mint) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.ExtensionType.PermanentDelegate, mint.tlvData);
  if (extensionData !== null) {
    return PermanentDelegateLayout.decode(extensionData);
  } else {
    return null;
  }
}

/***/ },

/***/ 26978
/*!*************************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/permissionedBurn/state.js ***!
  \*************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PERMISSIONED_BURN_SIZE: () => (/* binding */ PERMISSIONED_BURN_SIZE),
/* harmony export */   PermissionedBurnLayout: () => (/* binding */ PermissionedBurnLayout),
/* harmony export */   getPermissionedBurn: () => (/* binding */ getPermissionedBurn)
/* harmony export */ });
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/buffer-layout-utils */ 99033);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/web3.js */ 47647);
/* harmony import */ var _extensionType_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../extensionType.js */ 18370);




/** Buffer layout for de/serializing a permissioned burn config */
const PermissionedBurnLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([(0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.publicKey)('authority')]);
const PERMISSIONED_BURN_SIZE = PermissionedBurnLayout.span;
function getPermissionedBurn(mint) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_3__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_3__.ExtensionType.PermissionedBurn, mint.tlvData);
  if (extensionData !== null) {
    const {
      authority
    } = PermissionedBurnLayout.decode(extensionData);
    return {
      authority: authority.equals(_solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.PublicKey.default) ? null : authority
    };
  } else {
    return null;
  }
}

/***/ },

/***/ 77949
/*!***********************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/scaledUiAmount/state.js ***!
  \***********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SCALED_UI_AMOUNT_CONFIG_SIZE: () => (/* binding */ SCALED_UI_AMOUNT_CONFIG_SIZE),
/* harmony export */   ScaledUiAmountConfigLayout: () => (/* binding */ ScaledUiAmountConfigLayout),
/* harmony export */   getScaledUiAmountConfig: () => (/* binding */ getScaledUiAmountConfig)
/* harmony export */ });
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/buffer-layout-utils */ 99033);
/* harmony import */ var _extensionType_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../extensionType.js */ 18370);



const ScaledUiAmountConfigLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([(0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.publicKey)('authority'), (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.f64)('multiplier'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.u64)('newMultiplierEffectiveTimestamp'), (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.f64)('newMultiplier')]);
const SCALED_UI_AMOUNT_CONFIG_SIZE = ScaledUiAmountConfigLayout.span;
function getScaledUiAmountConfig(mint) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.ExtensionType.ScaledUiAmountConfig, mint.tlvData);
  if (extensionData !== null) {
    return ScaledUiAmountConfigLayout.decode(extensionData);
  }
  return null;
}

/***/ },

/***/ 27432
/*!********************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/transferFee/state.js ***!
  \********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MAX_FEE_BASIS_POINTS: () => (/* binding */ MAX_FEE_BASIS_POINTS),
/* harmony export */   ONE_IN_BASIS_POINTS: () => (/* binding */ ONE_IN_BASIS_POINTS),
/* harmony export */   TRANSFER_FEE_AMOUNT_SIZE: () => (/* binding */ TRANSFER_FEE_AMOUNT_SIZE),
/* harmony export */   TRANSFER_FEE_CONFIG_SIZE: () => (/* binding */ TRANSFER_FEE_CONFIG_SIZE),
/* harmony export */   TransferFeeAmountLayout: () => (/* binding */ TransferFeeAmountLayout),
/* harmony export */   TransferFeeConfigLayout: () => (/* binding */ TransferFeeConfigLayout),
/* harmony export */   calculateEpochFee: () => (/* binding */ calculateEpochFee),
/* harmony export */   calculateFee: () => (/* binding */ calculateFee),
/* harmony export */   getEpochFee: () => (/* binding */ getEpochFee),
/* harmony export */   getTransferFeeAmount: () => (/* binding */ getTransferFeeAmount),
/* harmony export */   getTransferFeeConfig: () => (/* binding */ getTransferFeeConfig),
/* harmony export */   transferFeeLayout: () => (/* binding */ transferFeeLayout)
/* harmony export */ });
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/buffer-layout-utils */ 99033);
/* harmony import */ var _extensionType_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../extensionType.js */ 18370);



const MAX_FEE_BASIS_POINTS = 10000;
const ONE_IN_BASIS_POINTS = BigInt(MAX_FEE_BASIS_POINTS);
/** Buffer layout for de/serializing a transfer fee */
function transferFeeLayout(property) {
  return (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([(0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.u64)('epoch'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.u64)('maximumFee'), (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.u16)('transferFeeBasisPoints')], property);
}
/** Calculate the transfer fee */
function calculateFee(transferFee, preFeeAmount) {
  const transferFeeBasisPoints = transferFee.transferFeeBasisPoints;
  if (transferFeeBasisPoints === 0 || preFeeAmount === BigInt(0)) {
    return BigInt(0);
  } else {
    const numerator = preFeeAmount * BigInt(transferFeeBasisPoints);
    const rawFee = (numerator + ONE_IN_BASIS_POINTS - BigInt(1)) / ONE_IN_BASIS_POINTS;
    const fee = rawFee > transferFee.maximumFee ? transferFee.maximumFee : rawFee;
    return BigInt(fee);
  }
}
/** Buffer layout for de/serializing a transfer fee config extension */
const TransferFeeConfigLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([(0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.publicKey)('transferFeeConfigAuthority'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.publicKey)('withdrawWithheldAuthority'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.u64)('withheldAmount'), transferFeeLayout('olderTransferFee'), transferFeeLayout('newerTransferFee')]);
const TRANSFER_FEE_CONFIG_SIZE = TransferFeeConfigLayout.span;
/** Get the fee for given epoch */
function getEpochFee(transferFeeConfig, epoch) {
  if (epoch >= transferFeeConfig.newerTransferFee.epoch) {
    return transferFeeConfig.newerTransferFee;
  } else {
    return transferFeeConfig.olderTransferFee;
  }
}
/** Calculate the fee for the given epoch and input amount */
function calculateEpochFee(transferFeeConfig, epoch, preFeeAmount) {
  const transferFee = getEpochFee(transferFeeConfig, epoch);
  return calculateFee(transferFee, preFeeAmount);
}
/** Buffer layout for de/serializing */
const TransferFeeAmountLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([(0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.u64)('withheldAmount')]);
const TRANSFER_FEE_AMOUNT_SIZE = TransferFeeAmountLayout.span;
function getTransferFeeConfig(mint) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.ExtensionType.TransferFeeConfig, mint.tlvData);
  if (extensionData !== null) {
    return TransferFeeConfigLayout.decode(extensionData);
  } else {
    return null;
  }
}
function getTransferFeeAmount(account) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.ExtensionType.TransferFeeAmount, account.tlvData);
  if (extensionData !== null) {
    return TransferFeeAmountLayout.decode(extensionData);
  } else {
    return null;
  }
}

/***/ },

/***/ 64651
/*!**************************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/transferHook/pubkeyData.js ***!
  \**************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   unpackPubkeyData: () => (/* binding */ unpackPubkeyData)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/web3.js */ 47647);
/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../errors.js */ 34601);



function unpackPubkeyData(_x, _x2, _x3, _x4) {
  return _unpackPubkeyData.apply(this, arguments);
}
function _unpackPubkeyData() {
  _unpackPubkeyData = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (keyDataConfig, previousMetas, instructionData, connection) {
    const [discriminator, ...rest] = keyDataConfig;
    const remaining = new Uint8Array(rest);
    switch (discriminator) {
      case 1:
        return unpackPubkeyDataFromInstructionData(remaining, instructionData);
      case 2:
        return unpackPubkeyDataFromAccountData(remaining, previousMetas, connection);
      default:
        throw new _errors_js__WEBPACK_IMPORTED_MODULE_2__.TokenTransferHookInvalidPubkeyData();
    }
  });
  return _unpackPubkeyData.apply(this, arguments);
}
function unpackPubkeyDataFromInstructionData(remaining, instructionData) {
  if (remaining.length < 1) {
    throw new _errors_js__WEBPACK_IMPORTED_MODULE_2__.TokenTransferHookInvalidPubkeyData();
  }
  const dataIndex = remaining[0];
  if (instructionData.length < dataIndex + _solana_web3_js__WEBPACK_IMPORTED_MODULE_1__.PUBLIC_KEY_LENGTH) {
    throw new _errors_js__WEBPACK_IMPORTED_MODULE_2__.TokenTransferHookPubkeyDataTooSmall();
  }
  return new _solana_web3_js__WEBPACK_IMPORTED_MODULE_1__.PublicKey(instructionData.subarray(dataIndex, dataIndex + _solana_web3_js__WEBPACK_IMPORTED_MODULE_1__.PUBLIC_KEY_LENGTH));
}
function unpackPubkeyDataFromAccountData(_x5, _x6, _x7) {
  return _unpackPubkeyDataFromAccountData.apply(this, arguments);
}
function _unpackPubkeyDataFromAccountData() {
  _unpackPubkeyDataFromAccountData = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (remaining, previousMetas, connection) {
    if (remaining.length < 2) {
      throw new _errors_js__WEBPACK_IMPORTED_MODULE_2__.TokenTransferHookInvalidPubkeyData();
    }
    const [accountIndex, dataIndex] = remaining;
    if (previousMetas.length <= accountIndex) {
      throw new _errors_js__WEBPACK_IMPORTED_MODULE_2__.TokenTransferHookAccountDataNotFound();
    }
    const accountInfo = yield connection.getAccountInfo(previousMetas[accountIndex].pubkey);
    if (accountInfo == null) {
      throw new _errors_js__WEBPACK_IMPORTED_MODULE_2__.TokenTransferHookAccountNotFound();
    }
    if (accountInfo.data.length < dataIndex + _solana_web3_js__WEBPACK_IMPORTED_MODULE_1__.PUBLIC_KEY_LENGTH) {
      throw new _errors_js__WEBPACK_IMPORTED_MODULE_2__.TokenTransferHookPubkeyDataTooSmall();
    }
    return new _solana_web3_js__WEBPACK_IMPORTED_MODULE_1__.PublicKey(accountInfo.data.subarray(dataIndex, dataIndex + _solana_web3_js__WEBPACK_IMPORTED_MODULE_1__.PUBLIC_KEY_LENGTH));
  });
  return _unpackPubkeyDataFromAccountData.apply(this, arguments);
}

/***/ },

/***/ 68486
/*!*********************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/transferHook/seeds.js ***!
  \*********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   unpackSeeds: () => (/* binding */ unpackSeeds)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../errors.js */ 34601);


const DISCRIMINATOR_SPAN = 1;
const LITERAL_LENGTH_SPAN = 1;
const INSTRUCTION_ARG_OFFSET_SPAN = 1;
const INSTRUCTION_ARG_LENGTH_SPAN = 1;
const ACCOUNT_KEY_INDEX_SPAN = 1;
const ACCOUNT_DATA_ACCOUNT_INDEX_SPAN = 1;
const ACCOUNT_DATA_OFFSET_SPAN = 1;
const ACCOUNT_DATA_LENGTH_SPAN = 1;
function unpackSeedLiteral(seeds) {
  if (seeds.length < 1) {
    throw new _errors_js__WEBPACK_IMPORTED_MODULE_1__.TokenTransferHookInvalidSeed();
  }
  const [length, ...rest] = seeds;
  if (rest.length < length) {
    throw new _errors_js__WEBPACK_IMPORTED_MODULE_1__.TokenTransferHookInvalidSeed();
  }
  return {
    data: Buffer.from(rest.slice(0, length)),
    packedLength: DISCRIMINATOR_SPAN + LITERAL_LENGTH_SPAN + length
  };
}
function unpackSeedInstructionArg(seeds, instructionData) {
  if (seeds.length < 2) {
    throw new _errors_js__WEBPACK_IMPORTED_MODULE_1__.TokenTransferHookInvalidSeed();
  }
  const [index, length] = seeds;
  if (instructionData.length < length + index) {
    throw new _errors_js__WEBPACK_IMPORTED_MODULE_1__.TokenTransferHookInvalidSeed();
  }
  return {
    data: instructionData.subarray(index, index + length),
    packedLength: DISCRIMINATOR_SPAN + INSTRUCTION_ARG_OFFSET_SPAN + INSTRUCTION_ARG_LENGTH_SPAN
  };
}
function unpackSeedAccountKey(seeds, previousMetas) {
  if (seeds.length < 1) {
    throw new _errors_js__WEBPACK_IMPORTED_MODULE_1__.TokenTransferHookInvalidSeed();
  }
  const [index] = seeds;
  if (previousMetas.length <= index) {
    throw new _errors_js__WEBPACK_IMPORTED_MODULE_1__.TokenTransferHookInvalidSeed();
  }
  return {
    data: previousMetas[index].pubkey.toBuffer(),
    packedLength: DISCRIMINATOR_SPAN + ACCOUNT_KEY_INDEX_SPAN
  };
}
function unpackSeedAccountData(_x, _x2, _x3) {
  return _unpackSeedAccountData.apply(this, arguments);
}
function _unpackSeedAccountData() {
  _unpackSeedAccountData = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (seeds, previousMetas, connection) {
    if (seeds.length < 3) {
      throw new _errors_js__WEBPACK_IMPORTED_MODULE_1__.TokenTransferHookInvalidSeed();
    }
    const [accountIndex, dataIndex, length] = seeds;
    if (previousMetas.length <= accountIndex) {
      throw new _errors_js__WEBPACK_IMPORTED_MODULE_1__.TokenTransferHookInvalidSeed();
    }
    const accountInfo = yield connection.getAccountInfo(previousMetas[accountIndex].pubkey);
    if (accountInfo == null) {
      throw new _errors_js__WEBPACK_IMPORTED_MODULE_1__.TokenTransferHookAccountDataNotFound();
    }
    if (accountInfo.data.length < dataIndex + length) {
      throw new _errors_js__WEBPACK_IMPORTED_MODULE_1__.TokenTransferHookInvalidSeed();
    }
    return {
      data: accountInfo.data.subarray(dataIndex, dataIndex + length),
      packedLength: DISCRIMINATOR_SPAN + ACCOUNT_DATA_ACCOUNT_INDEX_SPAN + ACCOUNT_DATA_OFFSET_SPAN + ACCOUNT_DATA_LENGTH_SPAN
    };
  });
  return _unpackSeedAccountData.apply(this, arguments);
}
function unpackFirstSeed(_x4, _x5, _x6, _x7) {
  return _unpackFirstSeed.apply(this, arguments);
}
function _unpackFirstSeed() {
  _unpackFirstSeed = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (seeds, previousMetas, instructionData, connection) {
    const [discriminator, ...rest] = seeds;
    const remaining = new Uint8Array(rest);
    switch (discriminator) {
      case 0:
        return null;
      case 1:
        return unpackSeedLiteral(remaining);
      case 2:
        return unpackSeedInstructionArg(remaining, instructionData);
      case 3:
        return unpackSeedAccountKey(remaining, previousMetas);
      case 4:
        return unpackSeedAccountData(remaining, previousMetas, connection);
      default:
        throw new _errors_js__WEBPACK_IMPORTED_MODULE_1__.TokenTransferHookInvalidSeed();
    }
  });
  return _unpackFirstSeed.apply(this, arguments);
}
function unpackSeeds(_x8, _x9, _x0, _x1) {
  return _unpackSeeds.apply(this, arguments);
}
function _unpackSeeds() {
  _unpackSeeds = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (seeds, previousMetas, instructionData, connection) {
    const unpackedSeeds = [];
    let i = 0;
    while (i < 32) {
      const seed = yield unpackFirstSeed(seeds.slice(i), previousMetas, instructionData, connection);
      if (seed == null) {
        break;
      }
      unpackedSeeds.push(seed.data);
      i += seed.packedLength;
    }
    return unpackedSeeds;
  });
  return _unpackSeeds.apply(this, arguments);
}

/***/ },

/***/ 25657
/*!*********************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/extensions/transferHook/state.js ***!
  \*********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExtraAccountMetaAccountDataLayout: () => (/* binding */ ExtraAccountMetaAccountDataLayout),
/* harmony export */   ExtraAccountMetaLayout: () => (/* binding */ ExtraAccountMetaLayout),
/* harmony export */   ExtraAccountMetaListLayout: () => (/* binding */ ExtraAccountMetaListLayout),
/* harmony export */   TRANSFER_HOOK_ACCOUNT_SIZE: () => (/* binding */ TRANSFER_HOOK_ACCOUNT_SIZE),
/* harmony export */   TRANSFER_HOOK_SIZE: () => (/* binding */ TRANSFER_HOOK_SIZE),
/* harmony export */   TransferHookAccountLayout: () => (/* binding */ TransferHookAccountLayout),
/* harmony export */   TransferHookLayout: () => (/* binding */ TransferHookLayout),
/* harmony export */   getExtraAccountMetaAddress: () => (/* binding */ getExtraAccountMetaAddress),
/* harmony export */   getExtraAccountMetas: () => (/* binding */ getExtraAccountMetas),
/* harmony export */   getTransferHook: () => (/* binding */ getTransferHook),
/* harmony export */   getTransferHookAccount: () => (/* binding */ getTransferHookAccount),
/* harmony export */   resolveExtraAccountMeta: () => (/* binding */ resolveExtraAccountMeta)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _extensionType_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../extensionType.js */ 18370);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @solana/web3.js */ 47647);
/* harmony import */ var _solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @solana/buffer-layout-utils */ 99033);
/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../errors.js */ 34601);
/* harmony import */ var _seeds_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./seeds.js */ 68486);
/* harmony import */ var _pubkeyData_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pubkeyData.js */ 64651);








/** Buffer layout for de/serializing a transfer hook extension */
const TransferHookLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.struct)([(0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_4__.publicKey)('authority'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_4__.publicKey)('programId')]);
const TRANSFER_HOOK_SIZE = TransferHookLayout.span;
function getTransferHook(mint) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.ExtensionType.TransferHook, mint.tlvData);
  if (extensionData !== null) {
    return TransferHookLayout.decode(extensionData);
  } else {
    return null;
  }
}
/** Buffer layout for de/serializing a transfer hook account extension */
const TransferHookAccountLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.struct)([(0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_4__.bool)('transferring')]);
const TRANSFER_HOOK_ACCOUNT_SIZE = TransferHookAccountLayout.span;
function getTransferHookAccount(account) {
  const extensionData = (0,_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.getExtensionData)(_extensionType_js__WEBPACK_IMPORTED_MODULE_2__.ExtensionType.TransferHookAccount, account.tlvData);
  if (extensionData !== null) {
    return TransferHookAccountLayout.decode(extensionData);
  } else {
    return null;
  }
}
function getExtraAccountMetaAddress(mint, programId) {
  const seeds = [Buffer.from('extra-account-metas'), mint.toBuffer()];
  return _solana_web3_js__WEBPACK_IMPORTED_MODULE_3__.PublicKey.findProgramAddressSync(seeds, programId)[0];
}
/** Buffer layout for de/serializing an ExtraAccountMeta */
const ExtraAccountMetaLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.struct)([(0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.u8)('discriminator'), (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.blob)(32, 'addressConfig'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_4__.bool)('isSigner'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_4__.bool)('isWritable')]);
/** Buffer layout for de/serializing a list of ExtraAccountMeta prefixed by a u32 length */
const ExtraAccountMetaListLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.struct)([(0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.u32)('count'), (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.seq)(ExtraAccountMetaLayout, (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.greedy)(ExtraAccountMetaLayout.span), 'extraAccounts')]);
/** Buffer layout for de/serializing an ExtraAccountMetaAccountData */
const ExtraAccountMetaAccountDataLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.struct)([(0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_4__.u64)('instructionDiscriminator'), (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.u32)('length'), ExtraAccountMetaListLayout.replicate('extraAccountsList')]);
/** Unpack an extra account metas account and parse the data into a list of ExtraAccountMetas */
function getExtraAccountMetas(account) {
  const extraAccountsList = ExtraAccountMetaAccountDataLayout.decode(account.data).extraAccountsList;
  return extraAccountsList.extraAccounts.slice(0, extraAccountsList.count);
}
/** Take an ExtraAccountMeta and construct that into an actual AccountMeta */
function resolveExtraAccountMeta(_x, _x2, _x3, _x4, _x5) {
  return _resolveExtraAccountMeta.apply(this, arguments);
}
function _resolveExtraAccountMeta() {
  _resolveExtraAccountMeta = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (connection, extraMeta, previousMetas, instructionData, transferHookProgramId) {
    if (extraMeta.discriminator === 0) {
      return {
        pubkey: new _solana_web3_js__WEBPACK_IMPORTED_MODULE_3__.PublicKey(extraMeta.addressConfig),
        isSigner: extraMeta.isSigner,
        isWritable: extraMeta.isWritable
      };
    } else if (extraMeta.discriminator === 2) {
      const pubkey = yield (0,_pubkeyData_js__WEBPACK_IMPORTED_MODULE_7__.unpackPubkeyData)(extraMeta.addressConfig, previousMetas, instructionData, connection);
      return {
        pubkey,
        isSigner: extraMeta.isSigner,
        isWritable: extraMeta.isWritable
      };
    }
    let programId = _solana_web3_js__WEBPACK_IMPORTED_MODULE_3__.PublicKey.default;
    if (extraMeta.discriminator === 1) {
      programId = transferHookProgramId;
    } else {
      const accountIndex = extraMeta.discriminator - (1 << 7);
      if (previousMetas.length <= accountIndex) {
        throw new _errors_js__WEBPACK_IMPORTED_MODULE_5__.TokenTransferHookAccountNotFound();
      }
      programId = previousMetas[accountIndex].pubkey;
    }
    const seeds = yield (0,_seeds_js__WEBPACK_IMPORTED_MODULE_6__.unpackSeeds)(extraMeta.addressConfig, previousMetas, instructionData, connection);
    const pubkey = _solana_web3_js__WEBPACK_IMPORTED_MODULE_3__.PublicKey.findProgramAddressSync(seeds, programId)[0];
    return {
      pubkey,
      isSigner: extraMeta.isSigner,
      isWritable: extraMeta.isWritable
    };
  });
  return _resolveExtraAccountMeta.apply(this, arguments);
}

/***/ },

/***/ 3224
/*!***************************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/instructions/associatedTokenAccount.js ***!
  \***************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createAssociatedTokenAccountIdempotentInstruction: () => (/* binding */ createAssociatedTokenAccountIdempotentInstruction),
/* harmony export */   createAssociatedTokenAccountIdempotentInstructionWithDerivation: () => (/* binding */ createAssociatedTokenAccountIdempotentInstructionWithDerivation),
/* harmony export */   createAssociatedTokenAccountInstruction: () => (/* binding */ createAssociatedTokenAccountInstruction),
/* harmony export */   createRecoverNestedInstruction: () => (/* binding */ createRecoverNestedInstruction)
/* harmony export */ });
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/web3.js */ 47647);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants.js */ 53949);
/* harmony import */ var _state_mint_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../state/mint.js */ 65408);



/**
 * Construct a CreateAssociatedTokenAccount instruction
 *
 * @param payer                    Payer of the initialization fees
 * @param associatedToken          New associated token account
 * @param owner                    Owner of the new account
 * @param mint                     Token mint account
 * @param programId                SPL Token program account
 * @param associatedTokenProgramId SPL Associated Token program account
 *
 * @return Instruction to add to a transaction
 */
function createAssociatedTokenAccountInstruction(payer, associatedToken, owner, mint, programId = _constants_js__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID, associatedTokenProgramId = _constants_js__WEBPACK_IMPORTED_MODULE_1__.ASSOCIATED_TOKEN_PROGRAM_ID) {
  return buildAssociatedTokenAccountInstruction(payer, associatedToken, owner, mint, Buffer.alloc(0), programId, associatedTokenProgramId);
}
/**
 * Construct a CreateAssociatedTokenAccountIdempotent instruction
 *
 * @param payer                    Payer of the initialization fees
 * @param associatedToken          New associated token account
 * @param owner                    Owner of the new account
 * @param mint                     Token mint account
 * @param programId                SPL Token program account
 * @param associatedTokenProgramId SPL Associated Token program account
 *
 * @return Instruction to add to a transaction
 */
function createAssociatedTokenAccountIdempotentInstruction(payer, associatedToken, owner, mint, programId = _constants_js__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID, associatedTokenProgramId = _constants_js__WEBPACK_IMPORTED_MODULE_1__.ASSOCIATED_TOKEN_PROGRAM_ID) {
  return buildAssociatedTokenAccountInstruction(payer, associatedToken, owner, mint, Buffer.from([1]), programId, associatedTokenProgramId);
}
/**
 * Derive the associated token account and construct a CreateAssociatedTokenAccountIdempotent instruction
 *
 * @param payer                    Payer of the initialization fees
 * @param owner                    Owner of the new account
 * @param mint                     Token mint account
 * @param allowOwnerOffCurve       Allow the owner account to be a PDA (Program Derived Address)
 * @param programId                SPL Token program account
 * @param associatedTokenProgramId SPL Associated Token program account
 *
 * @return Instruction to add to a transaction
 */
function createAssociatedTokenAccountIdempotentInstructionWithDerivation(payer, owner, mint, allowOwnerOffCurve = true, programId = _constants_js__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID, associatedTokenProgramId = _constants_js__WEBPACK_IMPORTED_MODULE_1__.ASSOCIATED_TOKEN_PROGRAM_ID) {
  const associatedToken = (0,_state_mint_js__WEBPACK_IMPORTED_MODULE_2__.getAssociatedTokenAddressSync)(mint, owner, allowOwnerOffCurve);
  return createAssociatedTokenAccountIdempotentInstruction(payer, associatedToken, owner, mint, programId, associatedTokenProgramId);
}
function buildAssociatedTokenAccountInstruction(payer, associatedToken, owner, mint, instructionData, programId = _constants_js__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID, associatedTokenProgramId = _constants_js__WEBPACK_IMPORTED_MODULE_1__.ASSOCIATED_TOKEN_PROGRAM_ID) {
  const keys = [{
    pubkey: payer,
    isSigner: true,
    isWritable: true
  }, {
    pubkey: associatedToken,
    isSigner: false,
    isWritable: true
  }, {
    pubkey: owner,
    isSigner: false,
    isWritable: false
  }, {
    pubkey: mint,
    isSigner: false,
    isWritable: false
  }, {
    pubkey: _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.SystemProgram.programId,
    isSigner: false,
    isWritable: false
  }, {
    pubkey: programId,
    isSigner: false,
    isWritable: false
  }];
  return new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.TransactionInstruction({
    keys,
    programId: associatedTokenProgramId,
    data: instructionData
  });
}
/**
 * Construct a RecoverNested instruction
 *
 * @param nestedAssociatedToken             Nested associated token account (must be owned by `ownerAssociatedToken`)
 * @param nestedMint                        Token mint for the nested associated token account
 * @param destinationAssociatedToken        Wallet's associated token account
 * @param ownerAssociatedToken              Owner associated token account address (must be owned by `owner`)
 * @param ownerMint                         Token mint for the owner associated token account
 * @param owner                             Wallet address for the owner associated token account
 * @param programId                         SPL Token program account
 * @param associatedTokenProgramId          SPL Associated Token program account
 *
 * @return Instruction to add to a transaction
 */
function createRecoverNestedInstruction(nestedAssociatedToken, nestedMint, destinationAssociatedToken, ownerAssociatedToken, ownerMint, owner, programId = _constants_js__WEBPACK_IMPORTED_MODULE_1__.TOKEN_PROGRAM_ID, associatedTokenProgramId = _constants_js__WEBPACK_IMPORTED_MODULE_1__.ASSOCIATED_TOKEN_PROGRAM_ID) {
  const keys = [{
    pubkey: nestedAssociatedToken,
    isSigner: false,
    isWritable: true
  }, {
    pubkey: nestedMint,
    isSigner: false,
    isWritable: false
  }, {
    pubkey: destinationAssociatedToken,
    isSigner: false,
    isWritable: true
  }, {
    pubkey: ownerAssociatedToken,
    isSigner: false,
    isWritable: true
  }, {
    pubkey: ownerMint,
    isSigner: false,
    isWritable: false
  }, {
    pubkey: owner,
    isSigner: true,
    isWritable: true
  }, {
    pubkey: programId,
    isSigner: false,
    isWritable: false
  }];
  return new _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.TransactionInstruction({
    keys,
    programId: associatedTokenProgramId,
    data: Buffer.from([2])
  });
}

/***/ },

/***/ 85115
/*!*************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/instructions/internal.js ***!
  \*************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addSigners: () => (/* binding */ addSigners)
/* harmony export */ });
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/web3.js */ 47647);

/** @internal */
function addSigners(keys, ownerOrAuthority, multiSigners) {
  if (multiSigners.length) {
    keys.push({
      pubkey: ownerOrAuthority,
      isSigner: false,
      isWritable: false
    });
    for (const signer of multiSigners) {
      keys.push({
        pubkey: signer instanceof _solana_web3_js__WEBPACK_IMPORTED_MODULE_0__.PublicKey ? signer : signer.publicKey,
        isSigner: true,
        isWritable: false
      });
    }
  } else {
    keys.push({
      pubkey: ownerOrAuthority,
      isSigner: true,
      isWritable: false
    });
  }
  return keys;
}

/***/ },

/***/ 52093
/*!*************************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/instructions/transfer.js ***!
  \*************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createTransferInstruction: () => (/* binding */ createTransferInstruction),
/* harmony export */   decodeTransferInstruction: () => (/* binding */ decodeTransferInstruction),
/* harmony export */   decodeTransferInstructionUnchecked: () => (/* binding */ decodeTransferInstructionUnchecked),
/* harmony export */   transferInstructionData: () => (/* binding */ transferInstructionData)
/* harmony export */ });
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/buffer-layout-utils */ 99033);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/web3.js */ 47647);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants.js */ 53949);
/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../errors.js */ 34601);
/* harmony import */ var _internal_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./internal.js */ 85115);
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./types.js */ 79689);







/** TODO: docs */
const transferInstructionData = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.struct)([(0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_0__.u8)('instruction'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_1__.u64)('amount')]);
/**
 * Construct a Transfer instruction
 *
 * @param source       Source account
 * @param destination  Destination account
 * @param owner        Owner of the source account
 * @param amount       Number of tokens to transfer
 * @param multiSigners Signing accounts if `owner` is a multisig
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
function createTransferInstruction(source, destination, owner, amount, multiSigners = [], programId = _constants_js__WEBPACK_IMPORTED_MODULE_3__.TOKEN_PROGRAM_ID) {
  const keys = (0,_internal_js__WEBPACK_IMPORTED_MODULE_5__.addSigners)([{
    pubkey: source,
    isSigner: false,
    isWritable: true
  }, {
    pubkey: destination,
    isSigner: false,
    isWritable: true
  }], owner, multiSigners);
  const data = Buffer.alloc(transferInstructionData.span);
  transferInstructionData.encode({
    instruction: _types_js__WEBPACK_IMPORTED_MODULE_6__.TokenInstruction.Transfer,
    amount: BigInt(amount)
  }, data);
  return new _solana_web3_js__WEBPACK_IMPORTED_MODULE_2__.TransactionInstruction({
    keys,
    programId,
    data
  });
}
/**
 * Decode a Transfer instruction and validate it
 *
 * @param instruction Transaction instruction to decode
 * @param programId   SPL Token program account
 *
 * @return Decoded, valid instruction
 */
function decodeTransferInstruction(instruction, programId = _constants_js__WEBPACK_IMPORTED_MODULE_3__.TOKEN_PROGRAM_ID) {
  if (!instruction.programId.equals(programId)) throw new _errors_js__WEBPACK_IMPORTED_MODULE_4__.TokenInvalidInstructionProgramError();
  if (instruction.data.length !== transferInstructionData.span) throw new _errors_js__WEBPACK_IMPORTED_MODULE_4__.TokenInvalidInstructionDataError();
  const {
    keys: {
      source,
      destination,
      owner,
      multiSigners
    },
    data
  } = decodeTransferInstructionUnchecked(instruction);
  if (data.instruction !== _types_js__WEBPACK_IMPORTED_MODULE_6__.TokenInstruction.Transfer) throw new _errors_js__WEBPACK_IMPORTED_MODULE_4__.TokenInvalidInstructionTypeError();
  if (!source || !destination || !owner) throw new _errors_js__WEBPACK_IMPORTED_MODULE_4__.TokenInvalidInstructionKeysError();
  // TODO: key checks?
  return {
    programId,
    keys: {
      source,
      destination,
      owner,
      multiSigners
    },
    data
  };
}
/**
 * Decode a Transfer instruction without validating it
 *
 * @param instruction Transaction instruction to decode
 *
 * @return Decoded, non-validated instruction
 */
function decodeTransferInstructionUnchecked({
  programId,
  keys: [source, destination, owner, ...multiSigners],
  data
}) {
  return {
    programId,
    keys: {
      source,
      destination,
      owner,
      multiSigners
    },
    data: transferInstructionData.decode(data)
  };
}

/***/ },

/***/ 79689
/*!**********************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/instructions/types.js ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TokenInstruction: () => (/* binding */ TokenInstruction)
/* harmony export */ });
/** Instructions defined by the program */
var TokenInstruction;
(function (TokenInstruction) {
  TokenInstruction[TokenInstruction["InitializeMint"] = 0] = "InitializeMint";
  TokenInstruction[TokenInstruction["InitializeAccount"] = 1] = "InitializeAccount";
  TokenInstruction[TokenInstruction["InitializeMultisig"] = 2] = "InitializeMultisig";
  TokenInstruction[TokenInstruction["Transfer"] = 3] = "Transfer";
  TokenInstruction[TokenInstruction["Approve"] = 4] = "Approve";
  TokenInstruction[TokenInstruction["Revoke"] = 5] = "Revoke";
  TokenInstruction[TokenInstruction["SetAuthority"] = 6] = "SetAuthority";
  TokenInstruction[TokenInstruction["MintTo"] = 7] = "MintTo";
  TokenInstruction[TokenInstruction["Burn"] = 8] = "Burn";
  TokenInstruction[TokenInstruction["CloseAccount"] = 9] = "CloseAccount";
  TokenInstruction[TokenInstruction["FreezeAccount"] = 10] = "FreezeAccount";
  TokenInstruction[TokenInstruction["ThawAccount"] = 11] = "ThawAccount";
  TokenInstruction[TokenInstruction["TransferChecked"] = 12] = "TransferChecked";
  TokenInstruction[TokenInstruction["ApproveChecked"] = 13] = "ApproveChecked";
  TokenInstruction[TokenInstruction["MintToChecked"] = 14] = "MintToChecked";
  TokenInstruction[TokenInstruction["BurnChecked"] = 15] = "BurnChecked";
  TokenInstruction[TokenInstruction["InitializeAccount2"] = 16] = "InitializeAccount2";
  TokenInstruction[TokenInstruction["SyncNative"] = 17] = "SyncNative";
  TokenInstruction[TokenInstruction["InitializeAccount3"] = 18] = "InitializeAccount3";
  TokenInstruction[TokenInstruction["InitializeMultisig2"] = 19] = "InitializeMultisig2";
  TokenInstruction[TokenInstruction["InitializeMint2"] = 20] = "InitializeMint2";
  TokenInstruction[TokenInstruction["GetAccountDataSize"] = 21] = "GetAccountDataSize";
  TokenInstruction[TokenInstruction["InitializeImmutableOwner"] = 22] = "InitializeImmutableOwner";
  TokenInstruction[TokenInstruction["AmountToUiAmount"] = 23] = "AmountToUiAmount";
  TokenInstruction[TokenInstruction["UiAmountToAmount"] = 24] = "UiAmountToAmount";
  TokenInstruction[TokenInstruction["InitializeMintCloseAuthority"] = 25] = "InitializeMintCloseAuthority";
  TokenInstruction[TokenInstruction["TransferFeeExtension"] = 26] = "TransferFeeExtension";
  TokenInstruction[TokenInstruction["ConfidentialTransferExtension"] = 27] = "ConfidentialTransferExtension";
  TokenInstruction[TokenInstruction["DefaultAccountStateExtension"] = 28] = "DefaultAccountStateExtension";
  TokenInstruction[TokenInstruction["Reallocate"] = 29] = "Reallocate";
  TokenInstruction[TokenInstruction["MemoTransferExtension"] = 30] = "MemoTransferExtension";
  TokenInstruction[TokenInstruction["CreateNativeMint"] = 31] = "CreateNativeMint";
  TokenInstruction[TokenInstruction["InitializeNonTransferableMint"] = 32] = "InitializeNonTransferableMint";
  TokenInstruction[TokenInstruction["InterestBearingMintExtension"] = 33] = "InterestBearingMintExtension";
  TokenInstruction[TokenInstruction["CpiGuardExtension"] = 34] = "CpiGuardExtension";
  TokenInstruction[TokenInstruction["InitializePermanentDelegate"] = 35] = "InitializePermanentDelegate";
  TokenInstruction[TokenInstruction["TransferHookExtension"] = 36] = "TransferHookExtension";
  // ConfidentialTransferFeeExtension = 37,
  // WithdrawalExcessLamports = 38,
  TokenInstruction[TokenInstruction["MetadataPointerExtension"] = 39] = "MetadataPointerExtension";
  TokenInstruction[TokenInstruction["GroupPointerExtension"] = 40] = "GroupPointerExtension";
  TokenInstruction[TokenInstruction["GroupMemberPointerExtension"] = 41] = "GroupMemberPointerExtension";
  // ConfidentialMintBurnExtension = 42,
  TokenInstruction[TokenInstruction["ScaledUiAmountExtension"] = 43] = "ScaledUiAmountExtension";
  TokenInstruction[TokenInstruction["PausableExtension"] = 44] = "PausableExtension";
  TokenInstruction[TokenInstruction["UnwrapLamports"] = 45] = "UnwrapLamports";
  TokenInstruction[TokenInstruction["PermissionedBurnExtension"] = 46] = "PermissionedBurnExtension";
})(TokenInstruction || (TokenInstruction = {}));

/***/ },

/***/ 35737
/*!*****************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/state/account.js ***!
  \*****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ACCOUNT_SIZE: () => (/* binding */ ACCOUNT_SIZE),
/* harmony export */   AccountLayout: () => (/* binding */ AccountLayout),
/* harmony export */   AccountState: () => (/* binding */ AccountState),
/* harmony export */   getAccount: () => (/* binding */ getAccount),
/* harmony export */   getMinimumBalanceForRentExemptAccount: () => (/* binding */ getMinimumBalanceForRentExemptAccount),
/* harmony export */   getMinimumBalanceForRentExemptAccountWithExtensions: () => (/* binding */ getMinimumBalanceForRentExemptAccountWithExtensions),
/* harmony export */   getMultipleAccounts: () => (/* binding */ getMultipleAccounts),
/* harmony export */   unpackAccount: () => (/* binding */ unpackAccount)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/buffer-layout-utils */ 99033);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants.js */ 53949);
/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../errors.js */ 34601);
/* harmony import */ var _extensions_accountType_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../extensions/accountType.js */ 0);
/* harmony import */ var _extensions_extensionType_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../extensions/extensionType.js */ 18370);
/* harmony import */ var _multisig_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./multisig.js */ 20234);








/** Token account state as stored by the program */
var AccountState;
(function (AccountState) {
  AccountState[AccountState["Uninitialized"] = 0] = "Uninitialized";
  AccountState[AccountState["Initialized"] = 1] = "Initialized";
  AccountState[AccountState["Frozen"] = 2] = "Frozen";
})(AccountState || (AccountState = {}));
/** Buffer layout for de/serializing a token account */
const AccountLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.struct)([(0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.publicKey)('mint'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.publicKey)('owner'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.u64)('amount'), (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.u32)('delegateOption'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.publicKey)('delegate'), (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.u8)('state'), (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.u32)('isNativeOption'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.u64)('isNative'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.u64)('delegatedAmount'), (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.u32)('closeAuthorityOption'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.publicKey)('closeAuthority')]);
/** Byte length of a token account */
const ACCOUNT_SIZE = AccountLayout.span;
/**
 * Retrieve information about a token account
 *
 * @param connection Connection to use
 * @param address    Token account
 * @param commitment Desired level of commitment for querying the state
 * @param programId  SPL Token program account
 *
 * @return Token account information
 */
function getAccount(_x, _x2, _x3) {
  return _getAccount.apply(this, arguments);
}
/**
 * Retrieve information about multiple token accounts in a single RPC call
 *
 * @param connection Connection to use
 * @param addresses  Token accounts
 * @param commitment Desired level of commitment for querying the state
 * @param programId  SPL Token program account
 *
 * @return Token account information
 */
function _getAccount() {
  _getAccount = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (connection, address, commitment, programId = _constants_js__WEBPACK_IMPORTED_MODULE_3__.TOKEN_PROGRAM_ID) {
    const info = yield connection.getAccountInfo(address, commitment);
    return unpackAccount(address, info, programId);
  });
  return _getAccount.apply(this, arguments);
}
function getMultipleAccounts(_x4, _x5, _x6) {
  return _getMultipleAccounts.apply(this, arguments);
}
/** Get the minimum lamport balance for a base token account to be rent exempt
 *
 * @param connection Connection to use
 * @param commitment Desired level of commitment for querying the state
 *
 * @return Amount of lamports required
 */
function _getMultipleAccounts() {
  _getMultipleAccounts = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (connection, addresses, commitment, programId = _constants_js__WEBPACK_IMPORTED_MODULE_3__.TOKEN_PROGRAM_ID) {
    const infos = yield connection.getMultipleAccountsInfo(addresses, commitment);
    return addresses.map((address, i) => unpackAccount(address, infos[i], programId));
  });
  return _getMultipleAccounts.apply(this, arguments);
}
function getMinimumBalanceForRentExemptAccount(_x7, _x8) {
  return _getMinimumBalanceForRentExemptAccount.apply(this, arguments);
}
/** Get the minimum lamport balance for a rent-exempt token account with extensions
 *
 * @param connection Connection to use
 * @param commitment Desired level of commitment for querying the state
 *
 * @return Amount of lamports required
 */
function _getMinimumBalanceForRentExemptAccount() {
  _getMinimumBalanceForRentExemptAccount = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (connection, commitment) {
    return yield getMinimumBalanceForRentExemptAccountWithExtensions(connection, [], commitment);
  });
  return _getMinimumBalanceForRentExemptAccount.apply(this, arguments);
}
function getMinimumBalanceForRentExemptAccountWithExtensions(_x9, _x0, _x1) {
  return _getMinimumBalanceForRentExemptAccountWithExtensions.apply(this, arguments);
}
/**
 * Unpack a token account
 *
 * @param address   Token account
 * @param info      Token account data
 * @param programId SPL Token program account
 *
 * @return Unpacked token account
 */
function _getMinimumBalanceForRentExemptAccountWithExtensions() {
  _getMinimumBalanceForRentExemptAccountWithExtensions = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (connection, extensions, commitment) {
    const accountLen = (0,_extensions_extensionType_js__WEBPACK_IMPORTED_MODULE_6__.getAccountLen)(extensions);
    return yield connection.getMinimumBalanceForRentExemption(accountLen, commitment);
  });
  return _getMinimumBalanceForRentExemptAccountWithExtensions.apply(this, arguments);
}
function unpackAccount(address, info, programId = _constants_js__WEBPACK_IMPORTED_MODULE_3__.TOKEN_PROGRAM_ID) {
  if (!info) throw new _errors_js__WEBPACK_IMPORTED_MODULE_4__.TokenAccountNotFoundError();
  if (!info.owner.equals(programId)) throw new _errors_js__WEBPACK_IMPORTED_MODULE_4__.TokenInvalidAccountOwnerError();
  if (info.data.length < ACCOUNT_SIZE) throw new _errors_js__WEBPACK_IMPORTED_MODULE_4__.TokenInvalidAccountSizeError();
  const rawAccount = AccountLayout.decode(info.data.slice(0, ACCOUNT_SIZE));
  let tlvData = Buffer.alloc(0);
  if (info.data.length > ACCOUNT_SIZE) {
    if (info.data.length === _multisig_js__WEBPACK_IMPORTED_MODULE_7__.MULTISIG_SIZE) throw new _errors_js__WEBPACK_IMPORTED_MODULE_4__.TokenInvalidAccountSizeError();
    if (info.data[ACCOUNT_SIZE] != _extensions_accountType_js__WEBPACK_IMPORTED_MODULE_5__.AccountType.Account) throw new _errors_js__WEBPACK_IMPORTED_MODULE_4__.TokenInvalidAccountError();
    tlvData = info.data.slice(ACCOUNT_SIZE + _extensions_accountType_js__WEBPACK_IMPORTED_MODULE_5__.ACCOUNT_TYPE_SIZE);
  }
  return {
    address,
    mint: rawAccount.mint,
    owner: rawAccount.owner,
    amount: rawAccount.amount,
    delegate: rawAccount.delegateOption ? rawAccount.delegate : null,
    delegatedAmount: rawAccount.delegatedAmount,
    isInitialized: rawAccount.state !== AccountState.Uninitialized,
    isFrozen: rawAccount.state === AccountState.Frozen,
    isNative: !!rawAccount.isNativeOption,
    rentExemptReserve: rawAccount.isNativeOption ? rawAccount.isNative : null,
    closeAuthority: rawAccount.closeAuthorityOption ? rawAccount.closeAuthority : null,
    tlvData
  };
}

/***/ },

/***/ 65408
/*!**************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/state/mint.js ***!
  \**************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MINT_SIZE: () => (/* binding */ MINT_SIZE),
/* harmony export */   MintLayout: () => (/* binding */ MintLayout),
/* harmony export */   getAssociatedTokenAddress: () => (/* binding */ getAssociatedTokenAddress),
/* harmony export */   getAssociatedTokenAddressSync: () => (/* binding */ getAssociatedTokenAddressSync),
/* harmony export */   getMinimumBalanceForRentExemptMint: () => (/* binding */ getMinimumBalanceForRentExemptMint),
/* harmony export */   getMinimumBalanceForRentExemptMintWithExtensions: () => (/* binding */ getMinimumBalanceForRentExemptMintWithExtensions),
/* harmony export */   getMint: () => (/* binding */ getMint),
/* harmony export */   unpackMint: () => (/* binding */ unpackMint)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/buffer-layout-utils */ 99033);
/* harmony import */ var _solana_web3_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @solana/web3.js */ 47647);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants.js */ 53949);
/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../errors.js */ 34601);
/* harmony import */ var _extensions_accountType_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../extensions/accountType.js */ 0);
/* harmony import */ var _extensions_extensionType_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../extensions/extensionType.js */ 18370);
/* harmony import */ var _account_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./account.js */ 35737);
/* harmony import */ var _multisig_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./multisig.js */ 20234);










/** Buffer layout for de/serializing a mint */
const MintLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.struct)([(0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.u32)('mintAuthorityOption'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.publicKey)('mintAuthority'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.u64)('supply'), (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.u8)('decimals'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.bool)('isInitialized'), (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.u32)('freezeAuthorityOption'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.publicKey)('freezeAuthority')]);
/** Byte length of a mint */
const MINT_SIZE = MintLayout.span;
/**
 * Retrieve information about a mint
 *
 * @param connection Connection to use
 * @param address    Mint account
 * @param commitment Desired level of commitment for querying the state
 * @param programId  SPL Token program account
 *
 * @return Mint information
 */
function getMint(_x, _x2, _x3) {
  return _getMint.apply(this, arguments);
}
/**
 * Unpack a mint
 *
 * @param address   Mint account
 * @param info      Mint account data
 * @param programId SPL Token program account
 *
 * @return Unpacked mint
 */
function _getMint() {
  _getMint = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (connection, address, commitment, programId = _constants_js__WEBPACK_IMPORTED_MODULE_4__.TOKEN_PROGRAM_ID) {
    const info = yield connection.getAccountInfo(address, commitment);
    return unpackMint(address, info, programId);
  });
  return _getMint.apply(this, arguments);
}
function unpackMint(address, info, programId = _constants_js__WEBPACK_IMPORTED_MODULE_4__.TOKEN_PROGRAM_ID) {
  if (!info) throw new _errors_js__WEBPACK_IMPORTED_MODULE_5__.TokenAccountNotFoundError();
  if (!info.owner.equals(programId)) throw new _errors_js__WEBPACK_IMPORTED_MODULE_5__.TokenInvalidAccountOwnerError();
  if (info.data.length < MINT_SIZE) throw new _errors_js__WEBPACK_IMPORTED_MODULE_5__.TokenInvalidAccountSizeError();
  const rawMint = MintLayout.decode(info.data.slice(0, MINT_SIZE));
  let tlvData = Buffer.alloc(0);
  if (info.data.length > MINT_SIZE) {
    if (info.data.length <= _account_js__WEBPACK_IMPORTED_MODULE_8__.ACCOUNT_SIZE) throw new _errors_js__WEBPACK_IMPORTED_MODULE_5__.TokenInvalidAccountSizeError();
    if (info.data.length === _multisig_js__WEBPACK_IMPORTED_MODULE_9__.MULTISIG_SIZE) throw new _errors_js__WEBPACK_IMPORTED_MODULE_5__.TokenInvalidAccountSizeError();
    if (info.data[_account_js__WEBPACK_IMPORTED_MODULE_8__.ACCOUNT_SIZE] != _extensions_accountType_js__WEBPACK_IMPORTED_MODULE_6__.AccountType.Mint) throw new _errors_js__WEBPACK_IMPORTED_MODULE_5__.TokenInvalidMintError();
    tlvData = info.data.slice(_account_js__WEBPACK_IMPORTED_MODULE_8__.ACCOUNT_SIZE + _extensions_accountType_js__WEBPACK_IMPORTED_MODULE_6__.ACCOUNT_TYPE_SIZE);
  }
  return {
    address,
    mintAuthority: rawMint.mintAuthorityOption ? rawMint.mintAuthority : null,
    supply: rawMint.supply,
    decimals: rawMint.decimals,
    isInitialized: rawMint.isInitialized,
    freezeAuthority: rawMint.freezeAuthorityOption ? rawMint.freezeAuthority : null,
    tlvData
  };
}
/** Get the minimum lamport balance for a mint to be rent exempt
 *
 * @param connection Connection to use
 * @param commitment Desired level of commitment for querying the state
 *
 * @return Amount of lamports required
 */
function getMinimumBalanceForRentExemptMint(_x4, _x5) {
  return _getMinimumBalanceForRentExemptMint.apply(this, arguments);
}
/** Get the minimum lamport balance for a rent-exempt mint with extensions
 *
 * @param connection Connection to use
 * @param extensions Extension types included in the mint
 * @param commitment Desired level of commitment for querying the state
 *
 * @return Amount of lamports required
 */
function _getMinimumBalanceForRentExemptMint() {
  _getMinimumBalanceForRentExemptMint = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (connection, commitment) {
    return yield getMinimumBalanceForRentExemptMintWithExtensions(connection, [], commitment);
  });
  return _getMinimumBalanceForRentExemptMint.apply(this, arguments);
}
function getMinimumBalanceForRentExemptMintWithExtensions(_x6, _x7, _x8) {
  return _getMinimumBalanceForRentExemptMintWithExtensions.apply(this, arguments);
}
/**
 * Async version of getAssociatedTokenAddressSync
 * For backwards compatibility
 *
 * @param mint                     Token mint account
 * @param owner                    Owner of the new account
 * @param allowOwnerOffCurve       Allow the owner account to be a PDA (Program Derived Address)
 * @param programId                SPL Token program account
 * @param associatedTokenProgramId SPL Associated Token program account
 *
 * @return Promise containing the address of the associated token account
 */
function _getMinimumBalanceForRentExemptMintWithExtensions() {
  _getMinimumBalanceForRentExemptMintWithExtensions = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (connection, extensions, commitment) {
    const mintLen = (0,_extensions_extensionType_js__WEBPACK_IMPORTED_MODULE_7__.getMintLen)(extensions);
    return yield connection.getMinimumBalanceForRentExemption(mintLen, commitment);
  });
  return _getMinimumBalanceForRentExemptMintWithExtensions.apply(this, arguments);
}
function getAssociatedTokenAddress(_x9, _x0) {
  return _getAssociatedTokenAddress.apply(this, arguments);
}
/**
 * Get the address of the associated token account for a given mint and owner
 *
 * @param mint                     Token mint account
 * @param owner                    Owner of the new account
 * @param allowOwnerOffCurve       Allow the owner account to be a PDA (Program Derived Address)
 * @param programId                SPL Token program account
 * @param associatedTokenProgramId SPL Associated Token program account
 *
 * @return Address of the associated token account
 */
function _getAssociatedTokenAddress() {
  _getAssociatedTokenAddress = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (mint, owner, allowOwnerOffCurve = false, programId = _constants_js__WEBPACK_IMPORTED_MODULE_4__.TOKEN_PROGRAM_ID, associatedTokenProgramId = _constants_js__WEBPACK_IMPORTED_MODULE_4__.ASSOCIATED_TOKEN_PROGRAM_ID) {
    if (!allowOwnerOffCurve && !_solana_web3_js__WEBPACK_IMPORTED_MODULE_3__.PublicKey.isOnCurve(owner.toBuffer())) throw new _errors_js__WEBPACK_IMPORTED_MODULE_5__.TokenOwnerOffCurveError();
    const [address] = yield _solana_web3_js__WEBPACK_IMPORTED_MODULE_3__.PublicKey.findProgramAddress([owner.toBuffer(), programId.toBuffer(), mint.toBuffer()], associatedTokenProgramId);
    return address;
  });
  return _getAssociatedTokenAddress.apply(this, arguments);
}
function getAssociatedTokenAddressSync(mint, owner, allowOwnerOffCurve = false, programId = _constants_js__WEBPACK_IMPORTED_MODULE_4__.TOKEN_PROGRAM_ID, associatedTokenProgramId = _constants_js__WEBPACK_IMPORTED_MODULE_4__.ASSOCIATED_TOKEN_PROGRAM_ID) {
  if (!allowOwnerOffCurve && !_solana_web3_js__WEBPACK_IMPORTED_MODULE_3__.PublicKey.isOnCurve(owner.toBuffer())) throw new _errors_js__WEBPACK_IMPORTED_MODULE_5__.TokenOwnerOffCurveError();
  const [address] = _solana_web3_js__WEBPACK_IMPORTED_MODULE_3__.PublicKey.findProgramAddressSync([owner.toBuffer(), programId.toBuffer(), mint.toBuffer()], associatedTokenProgramId);
  return address;
}

/***/ },

/***/ 20234
/*!******************************************************************!*\
  !*** ./node_modules/@solana/spl-token/lib/esm/state/multisig.js ***!
  \******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MULTISIG_SIZE: () => (/* binding */ MULTISIG_SIZE),
/* harmony export */   MultisigLayout: () => (/* binding */ MultisigLayout),
/* harmony export */   getMinimumBalanceForRentExemptMultisig: () => (/* binding */ getMinimumBalanceForRentExemptMultisig),
/* harmony export */   getMultisig: () => (/* binding */ getMultisig),
/* harmony export */   unpackMultisig: () => (/* binding */ unpackMultisig)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @solana/buffer-layout */ 86573);
/* harmony import */ var _solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @solana/buffer-layout-utils */ 99033);
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants.js */ 53949);
/* harmony import */ var _errors_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../errors.js */ 34601);





/** Buffer layout for de/serializing a multisig */
const MultisigLayout = (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.struct)([(0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.u8)('m'), (0,_solana_buffer_layout__WEBPACK_IMPORTED_MODULE_1__.u8)('n'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.bool)('isInitialized'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.publicKey)('signer1'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.publicKey)('signer2'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.publicKey)('signer3'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.publicKey)('signer4'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.publicKey)('signer5'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.publicKey)('signer6'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.publicKey)('signer7'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.publicKey)('signer8'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.publicKey)('signer9'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.publicKey)('signer10'), (0,_solana_buffer_layout_utils__WEBPACK_IMPORTED_MODULE_2__.publicKey)('signer11')]);
/** Byte length of a multisig */
const MULTISIG_SIZE = MultisigLayout.span;
/**
 * Retrieve information about a multisig
 *
 * @param connection Connection to use
 * @param address    Multisig account
 * @param commitment Desired level of commitment for querying the state
 * @param programId  SPL Token program account
 *
 * @return Multisig information
 */
function getMultisig(_x, _x2, _x3) {
  return _getMultisig.apply(this, arguments);
}
/**
 * Unpack a multisig
 *
 * @param address   Multisig account
 * @param info      Multisig account data
 * @param programId SPL Token program account
 *
 * @return Unpacked multisig
 */
function _getMultisig() {
  _getMultisig = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (connection, address, commitment, programId = _constants_js__WEBPACK_IMPORTED_MODULE_3__.TOKEN_PROGRAM_ID) {
    const info = yield connection.getAccountInfo(address, commitment);
    return unpackMultisig(address, info, programId);
  });
  return _getMultisig.apply(this, arguments);
}
function unpackMultisig(address, info, programId = _constants_js__WEBPACK_IMPORTED_MODULE_3__.TOKEN_PROGRAM_ID) {
  if (!info) throw new _errors_js__WEBPACK_IMPORTED_MODULE_4__.TokenAccountNotFoundError();
  if (!info.owner.equals(programId)) throw new _errors_js__WEBPACK_IMPORTED_MODULE_4__.TokenInvalidAccountOwnerError();
  if (info.data.length != MULTISIG_SIZE) throw new _errors_js__WEBPACK_IMPORTED_MODULE_4__.TokenInvalidAccountSizeError();
  const multisig = MultisigLayout.decode(info.data);
  return {
    address,
    ...multisig
  };
}
/** Get the minimum lamport balance for a multisig to be rent exempt
 *
 * @param connection Connection to use
 * @param commitment Desired level of commitment for querying the state
 *
 * @return Amount of lamports required
 */
function getMinimumBalanceForRentExemptMultisig(_x4, _x5) {
  return _getMinimumBalanceForRentExemptMultisig.apply(this, arguments);
}
function _getMinimumBalanceForRentExemptMultisig() {
  _getMinimumBalanceForRentExemptMultisig = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (connection, commitment) {
    return yield connection.getMinimumBalanceForRentExemption(MULTISIG_SIZE, commitment);
  });
  return _getMinimumBalanceForRentExemptMultisig.apply(this, arguments);
}

/***/ },

/***/ 33124
/*!*************************************************!*\
  !*** ./node_modules/bignumber.js/bignumber.mjs ***!
  \*************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BigNumber: () => (/* binding */ BigNumber),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/*
 *      bignumber.js v9.3.1
 *      A JavaScript library for arbitrary-precision arithmetic.
 *      https://github.com/MikeMcl/bignumber.js
 *      Copyright (c) 2025 Michael Mclaughlin <M8ch88l@gmail.com>
 *      MIT Licensed.
 *
 *      BigNumber.prototype methods     |  BigNumber methods
 *                                      |
 *      absoluteValue            abs    |  clone
 *      comparedTo                      |  config               set
 *      decimalPlaces            dp     |      DECIMAL_PLACES
 *      dividedBy                div    |      ROUNDING_MODE
 *      dividedToIntegerBy       idiv   |      EXPONENTIAL_AT
 *      exponentiatedBy          pow    |      RANGE
 *      integerValue                    |      CRYPTO
 *      isEqualTo                eq     |      MODULO_MODE
 *      isFinite                        |      POW_PRECISION
 *      isGreaterThan            gt     |      FORMAT
 *      isGreaterThanOrEqualTo   gte    |      ALPHABET
 *      isInteger                       |  isBigNumber
 *      isLessThan               lt     |  maximum              max
 *      isLessThanOrEqualTo      lte    |  minimum              min
 *      isNaN                           |  random
 *      isNegative                      |  sum
 *      isPositive                      |
 *      isZero                          |
 *      minus                           |
 *      modulo                   mod    |
 *      multipliedBy             times  |
 *      negated                         |
 *      plus                            |
 *      precision                sd     |
 *      shiftedBy                       |
 *      squareRoot               sqrt   |
 *      toExponential                   |
 *      toFixed                         |
 *      toFormat                        |
 *      toFraction                      |
 *      toJSON                          |
 *      toNumber                        |
 *      toPrecision                     |
 *      toString                        |
 *      valueOf                         |
 *
 */

var isNumeric = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
  mathceil = Math.ceil,
  mathfloor = Math.floor,
  bignumberError = '[BigNumber Error] ',
  tooManyDigits = bignumberError + 'Number primitive has more than 15 significant digits: ',
  BASE = 1e14,
  LOG_BASE = 14,
  MAX_SAFE_INTEGER = 0x1fffffffffffff,
  // 2^53 - 1
  // MAX_INT32 = 0x7fffffff,                   // 2^31 - 1
  POWS_TEN = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13],
  SQRT_BASE = 1e7,
  // EDITABLE
  // The limit on the value of DECIMAL_PLACES, TO_EXP_NEG, TO_EXP_POS, MIN_EXP, MAX_EXP, and
  // the arguments to toExponential, toFixed, toFormat, and toPrecision.
  MAX = 1E9; // 0 to MAX_INT32

/*
 * Create and return a BigNumber constructor.
 */
function clone(configObject) {
  var div,
    convertBase,
    parseNumeric,
    P = BigNumber.prototype = {
      constructor: BigNumber,
      toString: null,
      valueOf: null
    },
    ONE = new BigNumber(1),
    //----------------------------- EDITABLE CONFIG DEFAULTS -------------------------------

    // The default values below must be integers within the inclusive ranges stated.
    // The values can also be changed at run-time using BigNumber.set.

    // The maximum number of decimal places for operations involving division.
    DECIMAL_PLACES = 20,
    // 0 to MAX

    // The rounding mode used when rounding to the above decimal places, and when using
    // toExponential, toFixed, toFormat and toPrecision, and round (default value).
    // UP         0 Away from zero.
    // DOWN       1 Towards zero.
    // CEIL       2 Towards +Infinity.
    // FLOOR      3 Towards -Infinity.
    // HALF_UP    4 Towards nearest neighbour. If equidistant, up.
    // HALF_DOWN  5 Towards nearest neighbour. If equidistant, down.
    // HALF_EVEN  6 Towards nearest neighbour. If equidistant, towards even neighbour.
    // HALF_CEIL  7 Towards nearest neighbour. If equidistant, towards +Infinity.
    // HALF_FLOOR 8 Towards nearest neighbour. If equidistant, towards -Infinity.
    ROUNDING_MODE = 4,
    // 0 to 8

    // EXPONENTIAL_AT : [TO_EXP_NEG , TO_EXP_POS]

    // The exponent value at and beneath which toString returns exponential notation.
    // Number type: -7
    TO_EXP_NEG = -7,
    // 0 to -MAX

    // The exponent value at and above which toString returns exponential notation.
    // Number type: 21
    TO_EXP_POS = 21,
    // 0 to MAX

    // RANGE : [MIN_EXP, MAX_EXP]

    // The minimum exponent value, beneath which underflow to zero occurs.
    // Number type: -324  (5e-324)
    MIN_EXP = -1e7,
    // -1 to -MAX

    // The maximum exponent value, above which overflow to Infinity occurs.
    // Number type:  308  (1.7976931348623157e+308)
    // For MAX_EXP > 1e7, e.g. new BigNumber('1e100000000').plus(1) may be slow.
    MAX_EXP = 1e7,
    // 1 to MAX

    // Whether to use cryptographically-secure random number generation, if available.
    CRYPTO = false,
    // true or false

    // The modulo mode used when calculating the modulus: a mod n.
    // The quotient (q = a / n) is calculated according to the corresponding rounding mode.
    // The remainder (r) is calculated as: r = a - n * q.
    //
    // UP        0 The remainder is positive if the dividend is negative, else is negative.
    // DOWN      1 The remainder has the same sign as the dividend.
    //             This modulo mode is commonly known as 'truncated division' and is
    //             equivalent to (a % n) in JavaScript.
    // FLOOR     3 The remainder has the same sign as the divisor (Python %).
    // HALF_EVEN 6 This modulo mode implements the IEEE 754 remainder function.
    // EUCLID    9 Euclidian division. q = sign(n) * floor(a / abs(n)).
    //             The remainder is always positive.
    //
    // The truncated division, floored division, Euclidian division and IEEE 754 remainder
    // modes are commonly used for the modulus operation.
    // Although the other rounding modes can also be used, they may not give useful results.
    MODULO_MODE = 1,
    // 0 to 9

    // The maximum number of significant digits of the result of the exponentiatedBy operation.
    // If POW_PRECISION is 0, there will be unlimited significant digits.
    POW_PRECISION = 0,
    // 0 to MAX

    // The format specification used by the BigNumber.prototype.toFormat method.
    FORMAT = {
      prefix: '',
      groupSize: 3,
      secondaryGroupSize: 0,
      groupSeparator: ',',
      decimalSeparator: '.',
      fractionGroupSize: 0,
      fractionGroupSeparator: '\xA0',
      // non-breaking space
      suffix: ''
    },
    // The alphabet used for base conversion. It must be at least 2 characters long, with no '+',
    // '-', '.', whitespace, or repeated character.
    // '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_'
    ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz',
    alphabetHasNormalDecimalDigits = true;

  //------------------------------------------------------------------------------------------

  // CONSTRUCTOR

  /*
   * The BigNumber constructor and exported function.
   * Create and return a new instance of a BigNumber object.
   *
   * v {number|string|BigNumber} A numeric value.
   * [b] {number} The base of v. Integer, 2 to ALPHABET.length inclusive.
   */
  function BigNumber(v, b) {
    var alphabet,
      c,
      caseChanged,
      e,
      i,
      isNum,
      len,
      str,
      x = this;

    // Enable constructor call without `new`.
    if (!(x instanceof BigNumber)) return new BigNumber(v, b);
    if (b == null) {
      if (v && v._isBigNumber === true) {
        x.s = v.s;
        if (!v.c || v.e > MAX_EXP) {
          x.c = x.e = null;
        } else if (v.e < MIN_EXP) {
          x.c = [x.e = 0];
        } else {
          x.e = v.e;
          x.c = v.c.slice();
        }
        return;
      }
      if ((isNum = typeof v == 'number') && v * 0 == 0) {
        // Use `1 / n` to handle minus zero also.
        x.s = 1 / v < 0 ? (v = -v, -1) : 1;

        // Fast path for integers, where n < 2147483648 (2**31).
        if (v === ~~v) {
          for (e = 0, i = v; i >= 10; i /= 10, e++);
          if (e > MAX_EXP) {
            x.c = x.e = null;
          } else {
            x.e = e;
            x.c = [v];
          }
          return;
        }
        str = String(v);
      } else {
        if (!isNumeric.test(str = String(v))) return parseNumeric(x, str, isNum);
        x.s = str.charCodeAt(0) == 45 ? (str = str.slice(1), -1) : 1;
      }

      // Decimal point?
      if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');

      // Exponential form?
      if ((i = str.search(/e/i)) > 0) {
        // Determine exponent.
        if (e < 0) e = i;
        e += +str.slice(i + 1);
        str = str.substring(0, i);
      } else if (e < 0) {
        // Integer.
        e = str.length;
      }
    } else {
      // '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
      intCheck(b, 2, ALPHABET.length, 'Base');

      // Allow exponential notation to be used with base 10 argument, while
      // also rounding to DECIMAL_PLACES as with other bases.
      if (b == 10 && alphabetHasNormalDecimalDigits) {
        x = new BigNumber(v);
        return round(x, DECIMAL_PLACES + x.e + 1, ROUNDING_MODE);
      }
      str = String(v);
      if (isNum = typeof v == 'number') {
        // Avoid potential interpretation of Infinity and NaN as base 44+ values.
        if (v * 0 != 0) return parseNumeric(x, str, isNum, b);
        x.s = 1 / v < 0 ? (str = str.slice(1), -1) : 1;

        // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
        if (BigNumber.DEBUG && str.replace(/^0\.0*|\./, '').length > 15) {
          throw Error(tooManyDigits + v);
        }
      } else {
        x.s = str.charCodeAt(0) === 45 ? (str = str.slice(1), -1) : 1;
      }
      alphabet = ALPHABET.slice(0, b);
      e = i = 0;

      // Check that str is a valid base b number.
      // Don't use RegExp, so alphabet can contain special characters.
      for (len = str.length; i < len; i++) {
        if (alphabet.indexOf(c = str.charAt(i)) < 0) {
          if (c == '.') {
            // If '.' is not the first character and it has not be found before.
            if (i > e) {
              e = len;
              continue;
            }
          } else if (!caseChanged) {
            // Allow e.g. hexadecimal 'FF' as well as 'ff'.
            if (str == str.toUpperCase() && (str = str.toLowerCase()) || str == str.toLowerCase() && (str = str.toUpperCase())) {
              caseChanged = true;
              i = -1;
              e = 0;
              continue;
            }
          }
          return parseNumeric(x, String(v), isNum, b);
        }
      }

      // Prevent later check for length on converted number.
      isNum = false;
      str = convertBase(str, b, 10, x.s);

      // Decimal point?
      if ((e = str.indexOf('.')) > -1) str = str.replace('.', '');else e = str.length;
    }

    // Determine leading zeros.
    for (i = 0; str.charCodeAt(i) === 48; i++);

    // Determine trailing zeros.
    for (len = str.length; str.charCodeAt(--len) === 48;);
    if (str = str.slice(i, ++len)) {
      len -= i;

      // '[BigNumber Error] Number primitive has more than 15 significant digits: {n}'
      if (isNum && BigNumber.DEBUG && len > 15 && (v > MAX_SAFE_INTEGER || v !== mathfloor(v))) {
        throw Error(tooManyDigits + x.s * v);
      }

      // Overflow?
      if ((e = e - i - 1) > MAX_EXP) {
        // Infinity.
        x.c = x.e = null;

        // Underflow?
      } else if (e < MIN_EXP) {
        // Zero.
        x.c = [x.e = 0];
      } else {
        x.e = e;
        x.c = [];

        // Transform base

        // e is the base 10 exponent.
        // i is where to slice str to get the first element of the coefficient array.
        i = (e + 1) % LOG_BASE;
        if (e < 0) i += LOG_BASE; // i < 1

        if (i < len) {
          if (i) x.c.push(+str.slice(0, i));
          for (len -= LOG_BASE; i < len;) {
            x.c.push(+str.slice(i, i += LOG_BASE));
          }
          i = LOG_BASE - (str = str.slice(i)).length;
        } else {
          i -= len;
        }
        for (; i--; str += '0');
        x.c.push(+str);
      }
    } else {
      // Zero.
      x.c = [x.e = 0];
    }
  }

  // CONSTRUCTOR PROPERTIES

  BigNumber.clone = clone;
  BigNumber.ROUND_UP = 0;
  BigNumber.ROUND_DOWN = 1;
  BigNumber.ROUND_CEIL = 2;
  BigNumber.ROUND_FLOOR = 3;
  BigNumber.ROUND_HALF_UP = 4;
  BigNumber.ROUND_HALF_DOWN = 5;
  BigNumber.ROUND_HALF_EVEN = 6;
  BigNumber.ROUND_HALF_CEIL = 7;
  BigNumber.ROUND_HALF_FLOOR = 8;
  BigNumber.EUCLID = 9;

  /*
   * Configure infrequently-changing library-wide settings.
   *
   * Accept an object with the following optional properties (if the value of a property is
   * a number, it must be an integer within the inclusive range stated):
   *
   *   DECIMAL_PLACES   {number}           0 to MAX
   *   ROUNDING_MODE    {number}           0 to 8
   *   EXPONENTIAL_AT   {number|number[]}  -MAX to MAX  or  [-MAX to 0, 0 to MAX]
   *   RANGE            {number|number[]}  -MAX to MAX (not zero)  or  [-MAX to -1, 1 to MAX]
   *   CRYPTO           {boolean}          true or false
   *   MODULO_MODE      {number}           0 to 9
   *   POW_PRECISION       {number}           0 to MAX
   *   ALPHABET         {string}           A string of two or more unique characters which does
   *                                       not contain '.'.
   *   FORMAT           {object}           An object with some of the following properties:
   *     prefix                 {string}
   *     groupSize              {number}
   *     secondaryGroupSize     {number}
   *     groupSeparator         {string}
   *     decimalSeparator       {string}
   *     fractionGroupSize      {number}
   *     fractionGroupSeparator {string}
   *     suffix                 {string}
   *
   * (The values assigned to the above FORMAT object properties are not checked for validity.)
   *
   * E.g.
   * BigNumber.config({ DECIMAL_PLACES : 20, ROUNDING_MODE : 4 })
   *
   * Ignore properties/parameters set to null or undefined, except for ALPHABET.
   *
   * Return an object with the properties current values.
   */
  BigNumber.config = BigNumber.set = function (obj) {
    var p, v;
    if (obj != null) {
      if (typeof obj == 'object') {
        // DECIMAL_PLACES {number} Integer, 0 to MAX inclusive.
        // '[BigNumber Error] DECIMAL_PLACES {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'DECIMAL_PLACES')) {
          v = obj[p];
          intCheck(v, 0, MAX, p);
          DECIMAL_PLACES = v;
        }

        // ROUNDING_MODE {number} Integer, 0 to 8 inclusive.
        // '[BigNumber Error] ROUNDING_MODE {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'ROUNDING_MODE')) {
          v = obj[p];
          intCheck(v, 0, 8, p);
          ROUNDING_MODE = v;
        }

        // EXPONENTIAL_AT {number|number[]}
        // Integer, -MAX to MAX inclusive or
        // [integer -MAX to 0 inclusive, 0 to MAX inclusive].
        // '[BigNumber Error] EXPONENTIAL_AT {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'EXPONENTIAL_AT')) {
          v = obj[p];
          if (v && v.pop) {
            intCheck(v[0], -MAX, 0, p);
            intCheck(v[1], 0, MAX, p);
            TO_EXP_NEG = v[0];
            TO_EXP_POS = v[1];
          } else {
            intCheck(v, -MAX, MAX, p);
            TO_EXP_NEG = -(TO_EXP_POS = v < 0 ? -v : v);
          }
        }

        // RANGE {number|number[]} Non-zero integer, -MAX to MAX inclusive or
        // [integer -MAX to -1 inclusive, integer 1 to MAX inclusive].
        // '[BigNumber Error] RANGE {not a primitive number|not an integer|out of range|cannot be zero}: {v}'
        if (obj.hasOwnProperty(p = 'RANGE')) {
          v = obj[p];
          if (v && v.pop) {
            intCheck(v[0], -MAX, -1, p);
            intCheck(v[1], 1, MAX, p);
            MIN_EXP = v[0];
            MAX_EXP = v[1];
          } else {
            intCheck(v, -MAX, MAX, p);
            if (v) {
              MIN_EXP = -(MAX_EXP = v < 0 ? -v : v);
            } else {
              throw Error(bignumberError + p + ' cannot be zero: ' + v);
            }
          }
        }

        // CRYPTO {boolean} true or false.
        // '[BigNumber Error] CRYPTO not true or false: {v}'
        // '[BigNumber Error] crypto unavailable'
        if (obj.hasOwnProperty(p = 'CRYPTO')) {
          v = obj[p];
          if (v === !!v) {
            if (v) {
              if (typeof crypto != 'undefined' && crypto && (crypto.getRandomValues || crypto.randomBytes)) {
                CRYPTO = v;
              } else {
                CRYPTO = !v;
                throw Error(bignumberError + 'crypto unavailable');
              }
            } else {
              CRYPTO = v;
            }
          } else {
            throw Error(bignumberError + p + ' not true or false: ' + v);
          }
        }

        // MODULO_MODE {number} Integer, 0 to 9 inclusive.
        // '[BigNumber Error] MODULO_MODE {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'MODULO_MODE')) {
          v = obj[p];
          intCheck(v, 0, 9, p);
          MODULO_MODE = v;
        }

        // POW_PRECISION {number} Integer, 0 to MAX inclusive.
        // '[BigNumber Error] POW_PRECISION {not a primitive number|not an integer|out of range}: {v}'
        if (obj.hasOwnProperty(p = 'POW_PRECISION')) {
          v = obj[p];
          intCheck(v, 0, MAX, p);
          POW_PRECISION = v;
        }

        // FORMAT {object}
        // '[BigNumber Error] FORMAT not an object: {v}'
        if (obj.hasOwnProperty(p = 'FORMAT')) {
          v = obj[p];
          if (typeof v == 'object') FORMAT = v;else throw Error(bignumberError + p + ' not an object: ' + v);
        }

        // ALPHABET {string}
        // '[BigNumber Error] ALPHABET invalid: {v}'
        if (obj.hasOwnProperty(p = 'ALPHABET')) {
          v = obj[p];

          // Disallow if less than two characters,
          // or if it contains '+', '-', '.', whitespace, or a repeated character.
          if (typeof v == 'string' && !/^.?$|[+\-.\s]|(.).*\1/.test(v)) {
            alphabetHasNormalDecimalDigits = v.slice(0, 10) == '0123456789';
            ALPHABET = v;
          } else {
            throw Error(bignumberError + p + ' invalid: ' + v);
          }
        }
      } else {
        // '[BigNumber Error] Object expected: {v}'
        throw Error(bignumberError + 'Object expected: ' + obj);
      }
    }
    return {
      DECIMAL_PLACES: DECIMAL_PLACES,
      ROUNDING_MODE: ROUNDING_MODE,
      EXPONENTIAL_AT: [TO_EXP_NEG, TO_EXP_POS],
      RANGE: [MIN_EXP, MAX_EXP],
      CRYPTO: CRYPTO,
      MODULO_MODE: MODULO_MODE,
      POW_PRECISION: POW_PRECISION,
      FORMAT: FORMAT,
      ALPHABET: ALPHABET
    };
  };

  /*
   * Return true if v is a BigNumber instance, otherwise return false.
   *
   * If BigNumber.DEBUG is true, throw if a BigNumber instance is not well-formed.
   *
   * v {any}
   *
   * '[BigNumber Error] Invalid BigNumber: {v}'
   */
  BigNumber.isBigNumber = function (v) {
    if (!v || v._isBigNumber !== true) return false;
    if (!BigNumber.DEBUG) return true;
    var i,
      n,
      c = v.c,
      e = v.e,
      s = v.s;
    out: if ({}.toString.call(c) == '[object Array]') {
      if ((s === 1 || s === -1) && e >= -MAX && e <= MAX && e === mathfloor(e)) {
        // If the first element is zero, the BigNumber value must be zero.
        if (c[0] === 0) {
          if (e === 0 && c.length === 1) return true;
          break out;
        }

        // Calculate number of digits that c[0] should have, based on the exponent.
        i = (e + 1) % LOG_BASE;
        if (i < 1) i += LOG_BASE;

        // Calculate number of digits of c[0].
        //if (Math.ceil(Math.log(c[0] + 1) / Math.LN10) == i) {
        if (String(c[0]).length == i) {
          for (i = 0; i < c.length; i++) {
            n = c[i];
            if (n < 0 || n >= BASE || n !== mathfloor(n)) break out;
          }

          // Last element cannot be zero, unless it is the only element.
          if (n !== 0) return true;
        }
      }

      // Infinity/NaN
    } else if (c === null && e === null && (s === null || s === 1 || s === -1)) {
      return true;
    }
    throw Error(bignumberError + 'Invalid BigNumber: ' + v);
  };

  /*
   * Return a new BigNumber whose value is the maximum of the arguments.
   *
   * arguments {number|string|BigNumber}
   */
  BigNumber.maximum = BigNumber.max = function () {
    return maxOrMin(arguments, -1);
  };

  /*
   * Return a new BigNumber whose value is the minimum of the arguments.
   *
   * arguments {number|string|BigNumber}
   */
  BigNumber.minimum = BigNumber.min = function () {
    return maxOrMin(arguments, 1);
  };

  /*
   * Return a new BigNumber with a random value equal to or greater than 0 and less than 1,
   * and with dp, or DECIMAL_PLACES if dp is omitted, decimal places (or less if trailing
   * zeros are produced).
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp}'
   * '[BigNumber Error] crypto unavailable'
   */
  BigNumber.random = function () {
    var pow2_53 = 0x20000000000000;

    // Return a 53 bit integer n, where 0 <= n < 9007199254740992.
    // Check if Math.random() produces more than 32 bits of randomness.
    // If it does, assume at least 53 bits are produced, otherwise assume at least 30 bits.
    // 0x40000000 is 2^30, 0x800000 is 2^23, 0x1fffff is 2^21 - 1.
    var random53bitInt = Math.random() * pow2_53 & 0x1fffff ? function () {
      return mathfloor(Math.random() * pow2_53);
    } : function () {
      return (Math.random() * 0x40000000 | 0) * 0x800000 + (Math.random() * 0x800000 | 0);
    };
    return function (dp) {
      var a,
        b,
        e,
        k,
        v,
        i = 0,
        c = [],
        rand = new BigNumber(ONE);
      if (dp == null) dp = DECIMAL_PLACES;else intCheck(dp, 0, MAX);
      k = mathceil(dp / LOG_BASE);
      if (CRYPTO) {
        // Browsers supporting crypto.getRandomValues.
        if (crypto.getRandomValues) {
          a = crypto.getRandomValues(new Uint32Array(k *= 2));
          for (; i < k;) {
            // 53 bits:
            // ((Math.pow(2, 32) - 1) * Math.pow(2, 21)).toString(2)
            // 11111 11111111 11111111 11111111 11100000 00000000 00000000
            // ((Math.pow(2, 32) - 1) >>> 11).toString(2)
            //                                     11111 11111111 11111111
            // 0x20000 is 2^21.
            v = a[i] * 0x20000 + (a[i + 1] >>> 11);

            // Rejection sampling:
            // 0 <= v < 9007199254740992
            // Probability that v >= 9e15, is
            // 7199254740992 / 9007199254740992 ~= 0.0008, i.e. 1 in 1251
            if (v >= 9e15) {
              b = crypto.getRandomValues(new Uint32Array(2));
              a[i] = b[0];
              a[i + 1] = b[1];
            } else {
              // 0 <= v <= 8999999999999999
              // 0 <= (v % 1e14) <= 99999999999999
              c.push(v % 1e14);
              i += 2;
            }
          }
          i = k / 2;

          // Node.js supporting crypto.randomBytes.
        } else if (crypto.randomBytes) {
          // buffer
          a = crypto.randomBytes(k *= 7);
          for (; i < k;) {
            // 0x1000000000000 is 2^48, 0x10000000000 is 2^40
            // 0x100000000 is 2^32, 0x1000000 is 2^24
            // 11111 11111111 11111111 11111111 11111111 11111111 11111111
            // 0 <= v < 9007199254740992
            v = (a[i] & 31) * 0x1000000000000 + a[i + 1] * 0x10000000000 + a[i + 2] * 0x100000000 + a[i + 3] * 0x1000000 + (a[i + 4] << 16) + (a[i + 5] << 8) + a[i + 6];
            if (v >= 9e15) {
              crypto.randomBytes(7).copy(a, i);
            } else {
              // 0 <= (v % 1e14) <= 99999999999999
              c.push(v % 1e14);
              i += 7;
            }
          }
          i = k / 7;
        } else {
          CRYPTO = false;
          throw Error(bignumberError + 'crypto unavailable');
        }
      }

      // Use Math.random.
      if (!CRYPTO) {
        for (; i < k;) {
          v = random53bitInt();
          if (v < 9e15) c[i++] = v % 1e14;
        }
      }
      k = c[--i];
      dp %= LOG_BASE;

      // Convert trailing digits to zeros according to dp.
      if (k && dp) {
        v = POWS_TEN[LOG_BASE - dp];
        c[i] = mathfloor(k / v) * v;
      }

      // Remove trailing elements which are zero.
      for (; c[i] === 0; c.pop(), i--);

      // Zero?
      if (i < 0) {
        c = [e = 0];
      } else {
        // Remove leading elements which are zero and adjust exponent accordingly.
        for (e = -1; c[0] === 0; c.splice(0, 1), e -= LOG_BASE);

        // Count the digits of the first element of c to determine leading zeros, and...
        for (i = 1, v = c[0]; v >= 10; v /= 10, i++);

        // adjust the exponent accordingly.
        if (i < LOG_BASE) e -= LOG_BASE - i;
      }
      rand.e = e;
      rand.c = c;
      return rand;
    };
  }();

  /*
  * Return a BigNumber whose value is the sum of the arguments.
  *
  * arguments {number|string|BigNumber}
  */
  BigNumber.sum = function () {
    var i = 1,
      args = arguments,
      sum = new BigNumber(args[0]);
    for (; i < args.length;) sum = sum.plus(args[i++]);
    return sum;
  };

  // PRIVATE FUNCTIONS

  // Called by BigNumber and BigNumber.prototype.toString.
  convertBase = function () {
    var decimal = '0123456789';

    /*
     * Convert string of baseIn to an array of numbers of baseOut.
     * Eg. toBaseOut('255', 10, 16) returns [15, 15].
     * Eg. toBaseOut('ff', 16, 10) returns [2, 5, 5].
     */
    function toBaseOut(str, baseIn, baseOut, alphabet) {
      var j,
        arr = [0],
        arrL,
        i = 0,
        len = str.length;
      for (; i < len;) {
        for (arrL = arr.length; arrL--; arr[arrL] *= baseIn);
        arr[0] += alphabet.indexOf(str.charAt(i++));
        for (j = 0; j < arr.length; j++) {
          if (arr[j] > baseOut - 1) {
            if (arr[j + 1] == null) arr[j + 1] = 0;
            arr[j + 1] += arr[j] / baseOut | 0;
            arr[j] %= baseOut;
          }
        }
      }
      return arr.reverse();
    }

    // Convert a numeric string of baseIn to a numeric string of baseOut.
    // If the caller is toString, we are converting from base 10 to baseOut.
    // If the caller is BigNumber, we are converting from baseIn to base 10.
    return function (str, baseIn, baseOut, sign, callerIsToString) {
      var alphabet,
        d,
        e,
        k,
        r,
        x,
        xc,
        y,
        i = str.indexOf('.'),
        dp = DECIMAL_PLACES,
        rm = ROUNDING_MODE;

      // Non-integer.
      if (i >= 0) {
        k = POW_PRECISION;

        // Unlimited precision.
        POW_PRECISION = 0;
        str = str.replace('.', '');
        y = new BigNumber(baseIn);
        x = y.pow(str.length - i);
        POW_PRECISION = k;

        // Convert str as if an integer, then restore the fraction part by dividing the
        // result by its base raised to a power.

        y.c = toBaseOut(toFixedPoint(coeffToString(x.c), x.e, '0'), 10, baseOut, decimal);
        y.e = y.c.length;
      }

      // Convert the number as integer.

      xc = toBaseOut(str, baseIn, baseOut, callerIsToString ? (alphabet = ALPHABET, decimal) : (alphabet = decimal, ALPHABET));

      // xc now represents str as an integer and converted to baseOut. e is the exponent.
      e = k = xc.length;

      // Remove trailing zeros.
      for (; xc[--k] == 0; xc.pop());

      // Zero?
      if (!xc[0]) return alphabet.charAt(0);

      // Does str represent an integer? If so, no need for the division.
      if (i < 0) {
        --e;
      } else {
        x.c = xc;
        x.e = e;

        // The sign is needed for correct rounding.
        x.s = sign;
        x = div(x, y, dp, rm, baseOut);
        xc = x.c;
        r = x.r;
        e = x.e;
      }

      // xc now represents str converted to baseOut.

      // The index of the rounding digit.
      d = e + dp + 1;

      // The rounding digit: the digit to the right of the digit that may be rounded up.
      i = xc[d];

      // Look at the rounding digits and mode to determine whether to round up.

      k = baseOut / 2;
      r = r || d < 0 || xc[d + 1] != null;
      r = rm < 4 ? (i != null || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : i > k || i == k && (rm == 4 || r || rm == 6 && xc[d - 1] & 1 || rm == (x.s < 0 ? 8 : 7));

      // If the index of the rounding digit is not greater than zero, or xc represents
      // zero, then the result of the base conversion is zero or, if rounding up, a value
      // such as 0.00001.
      if (d < 1 || !xc[0]) {
        // 1^-dp or 0
        str = r ? toFixedPoint(alphabet.charAt(1), -dp, alphabet.charAt(0)) : alphabet.charAt(0);
      } else {
        // Truncate xc to the required number of decimal places.
        xc.length = d;

        // Round up?
        if (r) {
          // Rounding up may mean the previous digit has to be rounded up and so on.
          for (--baseOut; ++xc[--d] > baseOut;) {
            xc[d] = 0;
            if (!d) {
              ++e;
              xc = [1].concat(xc);
            }
          }
        }

        // Determine trailing zeros.
        for (k = xc.length; !xc[--k];);

        // E.g. [4, 11, 15] becomes 4bf.
        for (i = 0, str = ''; i <= k; str += alphabet.charAt(xc[i++]));

        // Add leading zeros, decimal point and trailing zeros as required.
        str = toFixedPoint(str, e, alphabet.charAt(0));
      }

      // The caller will add the sign.
      return str;
    };
  }();

  // Perform division in the specified base. Called by div and convertBase.
  div = function () {
    // Assume non-zero x and k.
    function multiply(x, k, base) {
      var m,
        temp,
        xlo,
        xhi,
        carry = 0,
        i = x.length,
        klo = k % SQRT_BASE,
        khi = k / SQRT_BASE | 0;
      for (x = x.slice(); i--;) {
        xlo = x[i] % SQRT_BASE;
        xhi = x[i] / SQRT_BASE | 0;
        m = khi * xlo + xhi * klo;
        temp = klo * xlo + m % SQRT_BASE * SQRT_BASE + carry;
        carry = (temp / base | 0) + (m / SQRT_BASE | 0) + khi * xhi;
        x[i] = temp % base;
      }
      if (carry) x = [carry].concat(x);
      return x;
    }
    function compare(a, b, aL, bL) {
      var i, cmp;
      if (aL != bL) {
        cmp = aL > bL ? 1 : -1;
      } else {
        for (i = cmp = 0; i < aL; i++) {
          if (a[i] != b[i]) {
            cmp = a[i] > b[i] ? 1 : -1;
            break;
          }
        }
      }
      return cmp;
    }
    function subtract(a, b, aL, base) {
      var i = 0;

      // Subtract b from a.
      for (; aL--;) {
        a[aL] -= i;
        i = a[aL] < b[aL] ? 1 : 0;
        a[aL] = i * base + a[aL] - b[aL];
      }

      // Remove leading zeros.
      for (; !a[0] && a.length > 1; a.splice(0, 1));
    }

    // x: dividend, y: divisor.
    return function (x, y, dp, rm, base) {
      var cmp,
        e,
        i,
        more,
        n,
        prod,
        prodL,
        q,
        qc,
        rem,
        remL,
        rem0,
        xi,
        xL,
        yc0,
        yL,
        yz,
        s = x.s == y.s ? 1 : -1,
        xc = x.c,
        yc = y.c;

      // Either NaN, Infinity or 0?
      if (!xc || !xc[0] || !yc || !yc[0]) {
        return new BigNumber(
        // Return NaN if either NaN, or both Infinity or 0.
        !x.s || !y.s || (xc ? yc && xc[0] == yc[0] : !yc) ? NaN :
        // Return ±0 if x is ±0 or y is ±Infinity, or return ±Infinity as y is ±0.
        xc && xc[0] == 0 || !yc ? s * 0 : s / 0);
      }
      q = new BigNumber(s);
      qc = q.c = [];
      e = x.e - y.e;
      s = dp + e + 1;
      if (!base) {
        base = BASE;
        e = bitFloor(x.e / LOG_BASE) - bitFloor(y.e / LOG_BASE);
        s = s / LOG_BASE | 0;
      }

      // Result exponent may be one less then the current value of e.
      // The coefficients of the BigNumbers from convertBase may have trailing zeros.
      for (i = 0; yc[i] == (xc[i] || 0); i++);
      if (yc[i] > (xc[i] || 0)) e--;
      if (s < 0) {
        qc.push(1);
        more = true;
      } else {
        xL = xc.length;
        yL = yc.length;
        i = 0;
        s += 2;

        // Normalise xc and yc so highest order digit of yc is >= base / 2.

        n = mathfloor(base / (yc[0] + 1));

        // Not necessary, but to handle odd bases where yc[0] == (base / 2) - 1.
        // if (n > 1 || n++ == 1 && yc[0] < base / 2) {
        if (n > 1) {
          yc = multiply(yc, n, base);
          xc = multiply(xc, n, base);
          yL = yc.length;
          xL = xc.length;
        }
        xi = yL;
        rem = xc.slice(0, yL);
        remL = rem.length;

        // Add zeros to make remainder as long as divisor.
        for (; remL < yL; rem[remL++] = 0);
        yz = yc.slice();
        yz = [0].concat(yz);
        yc0 = yc[0];
        if (yc[1] >= base / 2) yc0++;
        // Not necessary, but to prevent trial digit n > base, when using base 3.
        // else if (base == 3 && yc0 == 1) yc0 = 1 + 1e-15;

        do {
          n = 0;

          // Compare divisor and remainder.
          cmp = compare(yc, rem, yL, remL);

          // If divisor < remainder.
          if (cmp < 0) {
            // Calculate trial digit, n.

            rem0 = rem[0];
            if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);

            // n is how many times the divisor goes into the current remainder.
            n = mathfloor(rem0 / yc0);

            //  Algorithm:
            //  product = divisor multiplied by trial digit (n).
            //  Compare product and remainder.
            //  If product is greater than remainder:
            //    Subtract divisor from product, decrement trial digit.
            //  Subtract product from remainder.
            //  If product was less than remainder at the last compare:
            //    Compare new remainder and divisor.
            //    If remainder is greater than divisor:
            //      Subtract divisor from remainder, increment trial digit.

            if (n > 1) {
              // n may be > base only when base is 3.
              if (n >= base) n = base - 1;

              // product = divisor * trial digit.
              prod = multiply(yc, n, base);
              prodL = prod.length;
              remL = rem.length;

              // Compare product and remainder.
              // If product > remainder then trial digit n too high.
              // n is 1 too high about 5% of the time, and is not known to have
              // ever been more than 1 too high.
              while (compare(prod, rem, prodL, remL) == 1) {
                n--;

                // Subtract divisor from product.
                subtract(prod, yL < prodL ? yz : yc, prodL, base);
                prodL = prod.length;
                cmp = 1;
              }
            } else {
              // n is 0 or 1, cmp is -1.
              // If n is 0, there is no need to compare yc and rem again below,
              // so change cmp to 1 to avoid it.
              // If n is 1, leave cmp as -1, so yc and rem are compared again.
              if (n == 0) {
                // divisor < remainder, so n must be at least 1.
                cmp = n = 1;
              }

              // product = divisor
              prod = yc.slice();
              prodL = prod.length;
            }
            if (prodL < remL) prod = [0].concat(prod);

            // Subtract product from remainder.
            subtract(rem, prod, remL, base);
            remL = rem.length;

            // If product was < remainder.
            if (cmp == -1) {
              // Compare divisor and new remainder.
              // If divisor < new remainder, subtract divisor from remainder.
              // Trial digit n too low.
              // n is 1 too low about 5% of the time, and very rarely 2 too low.
              while (compare(yc, rem, yL, remL) < 1) {
                n++;

                // Subtract divisor from remainder.
                subtract(rem, yL < remL ? yz : yc, remL, base);
                remL = rem.length;
              }
            }
          } else if (cmp === 0) {
            n++;
            rem = [0];
          } // else cmp === 1 and n will be 0

          // Add the next digit, n, to the result array.
          qc[i++] = n;

          // Update the remainder.
          if (rem[0]) {
            rem[remL++] = xc[xi] || 0;
          } else {
            rem = [xc[xi]];
            remL = 1;
          }
        } while ((xi++ < xL || rem[0] != null) && s--);
        more = rem[0] != null;

        // Leading zero?
        if (!qc[0]) qc.splice(0, 1);
      }
      if (base == BASE) {
        // To calculate q.e, first get the number of digits of qc[0].
        for (i = 1, s = qc[0]; s >= 10; s /= 10, i++);
        round(q, dp + (q.e = i + e * LOG_BASE - 1) + 1, rm, more);

        // Caller is convertBase.
      } else {
        q.e = e;
        q.r = +more;
      }
      return q;
    };
  }();

  /*
   * Return a string representing the value of BigNumber n in fixed-point or exponential
   * notation rounded to the specified decimal places or significant digits.
   *
   * n: a BigNumber.
   * i: the index of the last digit required (i.e. the digit that may be rounded up).
   * rm: the rounding mode.
   * id: 1 (toExponential) or 2 (toPrecision).
   */
  function format(n, i, rm, id) {
    var c0, e, ne, len, str;
    if (rm == null) rm = ROUNDING_MODE;else intCheck(rm, 0, 8);
    if (!n.c) return n.toString();
    c0 = n.c[0];
    ne = n.e;
    if (i == null) {
      str = coeffToString(n.c);
      str = id == 1 || id == 2 && (ne <= TO_EXP_NEG || ne >= TO_EXP_POS) ? toExponential(str, ne) : toFixedPoint(str, ne, '0');
    } else {
      n = round(new BigNumber(n), i, rm);

      // n.e may have changed if the value was rounded up.
      e = n.e;
      str = coeffToString(n.c);
      len = str.length;

      // toPrecision returns exponential notation if the number of significant digits
      // specified is less than the number of digits necessary to represent the integer
      // part of the value in fixed-point notation.

      // Exponential notation.
      if (id == 1 || id == 2 && (i <= e || e <= TO_EXP_NEG)) {
        // Append zeros?
        for (; len < i; str += '0', len++);
        str = toExponential(str, e);

        // Fixed-point notation.
      } else {
        i -= ne + (id === 2 && e > ne);
        str = toFixedPoint(str, e, '0');

        // Append zeros?
        if (e + 1 > len) {
          if (--i > 0) for (str += '.'; i--; str += '0');
        } else {
          i += e - len;
          if (i > 0) {
            if (e + 1 == len) str += '.';
            for (; i--; str += '0');
          }
        }
      }
    }
    return n.s < 0 && c0 ? '-' + str : str;
  }

  // Handle BigNumber.max and BigNumber.min.
  // If any number is NaN, return NaN.
  function maxOrMin(args, n) {
    var k,
      y,
      i = 1,
      x = new BigNumber(args[0]);
    for (; i < args.length; i++) {
      y = new BigNumber(args[i]);
      if (!y.s || (k = compare(x, y)) === n || k === 0 && x.s === n) {
        x = y;
      }
    }
    return x;
  }

  /*
   * Strip trailing zeros, calculate base 10 exponent and check against MIN_EXP and MAX_EXP.
   * Called by minus, plus and times.
   */
  function normalise(n, c, e) {
    var i = 1,
      j = c.length;

    // Remove trailing zeros.
    for (; !c[--j]; c.pop());

    // Calculate the base 10 exponent. First get the number of digits of c[0].
    for (j = c[0]; j >= 10; j /= 10, i++);

    // Overflow?
    if ((e = i + e * LOG_BASE - 1) > MAX_EXP) {
      // Infinity.
      n.c = n.e = null;

      // Underflow?
    } else if (e < MIN_EXP) {
      // Zero.
      n.c = [n.e = 0];
    } else {
      n.e = e;
      n.c = c;
    }
    return n;
  }

  // Handle values that fail the validity test in BigNumber.
  parseNumeric = function () {
    var basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i,
      dotAfter = /^([^.]+)\.$/,
      dotBefore = /^\.([^.]+)$/,
      isInfinityOrNaN = /^-?(Infinity|NaN)$/,
      whitespaceOrPlus = /^\s*\+(?=[\w.])|^\s+|\s+$/g;
    return function (x, str, isNum, b) {
      var base,
        s = isNum ? str : str.replace(whitespaceOrPlus, '');

      // No exception on ±Infinity or NaN.
      if (isInfinityOrNaN.test(s)) {
        x.s = isNaN(s) ? null : s < 0 ? -1 : 1;
      } else {
        if (!isNum) {
          // basePrefix = /^(-?)0([xbo])(?=\w[\w.]*$)/i
          s = s.replace(basePrefix, function (m, p1, p2) {
            base = (p2 = p2.toLowerCase()) == 'x' ? 16 : p2 == 'b' ? 2 : 8;
            return !b || b == base ? p1 : m;
          });
          if (b) {
            base = b;

            // E.g. '1.' to '1', '.1' to '0.1'
            s = s.replace(dotAfter, '$1').replace(dotBefore, '0.$1');
          }
          if (str != s) return new BigNumber(s, base);
        }

        // '[BigNumber Error] Not a number: {n}'
        // '[BigNumber Error] Not a base {b} number: {n}'
        if (BigNumber.DEBUG) {
          throw Error(bignumberError + 'Not a' + (b ? ' base ' + b : '') + ' number: ' + str);
        }

        // NaN
        x.s = null;
      }
      x.c = x.e = null;
    };
  }();

  /*
   * Round x to sd significant digits using rounding mode rm. Check for over/under-flow.
   * If r is truthy, it is known that there are more digits after the rounding digit.
   */
  function round(x, sd, rm, r) {
    var d,
      i,
      j,
      k,
      n,
      ni,
      rd,
      xc = x.c,
      pows10 = POWS_TEN;

    // if x is not Infinity or NaN...
    if (xc) {
      // rd is the rounding digit, i.e. the digit after the digit that may be rounded up.
      // n is a base 1e14 number, the value of the element of array x.c containing rd.
      // ni is the index of n within x.c.
      // d is the number of digits of n.
      // i is the index of rd within n including leading zeros.
      // j is the actual index of rd within n (if < 0, rd is a leading zero).
      out: {
        // Get the number of digits of the first element of xc.
        for (d = 1, k = xc[0]; k >= 10; k /= 10, d++);
        i = sd - d;

        // If the rounding digit is in the first element of xc...
        if (i < 0) {
          i += LOG_BASE;
          j = sd;
          n = xc[ni = 0];

          // Get the rounding digit at index j of n.
          rd = mathfloor(n / pows10[d - j - 1] % 10);
        } else {
          ni = mathceil((i + 1) / LOG_BASE);
          if (ni >= xc.length) {
            if (r) {
              // Needed by sqrt.
              for (; xc.length <= ni; xc.push(0));
              n = rd = 0;
              d = 1;
              i %= LOG_BASE;
              j = i - LOG_BASE + 1;
            } else {
              break out;
            }
          } else {
            n = k = xc[ni];

            // Get the number of digits of n.
            for (d = 1; k >= 10; k /= 10, d++);

            // Get the index of rd within n.
            i %= LOG_BASE;

            // Get the index of rd within n, adjusted for leading zeros.
            // The number of leading zeros of n is given by LOG_BASE - d.
            j = i - LOG_BASE + d;

            // Get the rounding digit at index j of n.
            rd = j < 0 ? 0 : mathfloor(n / pows10[d - j - 1] % 10);
          }
        }
        r = r || sd < 0 ||
        // Are there any non-zero digits after the rounding digit?
        // The expression  n % pows10[d - j - 1]  returns all digits of n to the right
        // of the digit at j, e.g. if n is 908714 and j is 2, the expression gives 714.
        xc[ni + 1] != null || (j < 0 ? n : n % pows10[d - j - 1]);
        r = rm < 4 ? (rd || r) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || r || rm == 6 &&
        // Check whether the digit to the left of the rounding digit is odd.
        (i > 0 ? j > 0 ? n / pows10[d - j] : 0 : xc[ni - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
        if (sd < 1 || !xc[0]) {
          xc.length = 0;
          if (r) {
            // Convert sd to decimal places.
            sd -= x.e + 1;

            // 1, 0.1, 0.01, 0.001, 0.0001 etc.
            xc[0] = pows10[(LOG_BASE - sd % LOG_BASE) % LOG_BASE];
            x.e = -sd || 0;
          } else {
            // Zero.
            xc[0] = x.e = 0;
          }
          return x;
        }

        // Remove excess digits.
        if (i == 0) {
          xc.length = ni;
          k = 1;
          ni--;
        } else {
          xc.length = ni + 1;
          k = pows10[LOG_BASE - i];

          // E.g. 56700 becomes 56000 if 7 is the rounding digit.
          // j > 0 means i > number of leading zeros of n.
          xc[ni] = j > 0 ? mathfloor(n / pows10[d - j] % pows10[j]) * k : 0;
        }

        // Round up?
        if (r) {
          for (;;) {
            // If the digit to be rounded up is in the first element of xc...
            if (ni == 0) {
              // i will be the length of xc[0] before k is added.
              for (i = 1, j = xc[0]; j >= 10; j /= 10, i++);
              j = xc[0] += k;
              for (k = 1; j >= 10; j /= 10, k++);

              // if i != k the length has increased.
              if (i != k) {
                x.e++;
                if (xc[0] == BASE) xc[0] = 1;
              }
              break;
            } else {
              xc[ni] += k;
              if (xc[ni] != BASE) break;
              xc[ni--] = 0;
              k = 1;
            }
          }
        }

        // Remove trailing zeros.
        for (i = xc.length; xc[--i] === 0; xc.pop());
      }

      // Overflow? Infinity.
      if (x.e > MAX_EXP) {
        x.c = x.e = null;

        // Underflow? Zero.
      } else if (x.e < MIN_EXP) {
        x.c = [x.e = 0];
      }
    }
    return x;
  }
  function valueOf(n) {
    var str,
      e = n.e;
    if (e === null) return n.toString();
    str = coeffToString(n.c);
    str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(str, e) : toFixedPoint(str, e, '0');
    return n.s < 0 ? '-' + str : str;
  }

  // PROTOTYPE/INSTANCE METHODS

  /*
   * Return a new BigNumber whose value is the absolute value of this BigNumber.
   */
  P.absoluteValue = P.abs = function () {
    var x = new BigNumber(this);
    if (x.s < 0) x.s = 1;
    return x;
  };

  /*
   * Return
   *   1 if the value of this BigNumber is greater than the value of BigNumber(y, b),
   *   -1 if the value of this BigNumber is less than the value of BigNumber(y, b),
   *   0 if they have the same value,
   *   or null if the value of either is NaN.
   */
  P.comparedTo = function (y, b) {
    return compare(this, new BigNumber(y, b));
  };

  /*
   * If dp is undefined or null or true or false, return the number of decimal places of the
   * value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
   *
   * Otherwise, if dp is a number, return a new BigNumber whose value is the value of this
   * BigNumber rounded to a maximum of dp decimal places using rounding mode rm, or
   * ROUNDING_MODE if rm is omitted.
   *
   * [dp] {number} Decimal places: integer, 0 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
   */
  P.decimalPlaces = P.dp = function (dp, rm) {
    var c,
      n,
      v,
      x = this;
    if (dp != null) {
      intCheck(dp, 0, MAX);
      if (rm == null) rm = ROUNDING_MODE;else intCheck(rm, 0, 8);
      return round(new BigNumber(x), dp + x.e + 1, rm);
    }
    if (!(c = x.c)) return null;
    n = ((v = c.length - 1) - bitFloor(this.e / LOG_BASE)) * LOG_BASE;

    // Subtract the number of trailing zeros of the last number.
    if (v = c[v]) for (; v % 10 == 0; v /= 10, n--);
    if (n < 0) n = 0;
    return n;
  };

  /*
   *  n / 0 = I
   *  n / N = N
   *  n / I = 0
   *  0 / n = 0
   *  0 / 0 = N
   *  0 / N = N
   *  0 / I = 0
   *  N / n = N
   *  N / 0 = N
   *  N / N = N
   *  N / I = N
   *  I / n = I
   *  I / 0 = I
   *  I / N = N
   *  I / I = N
   *
   * Return a new BigNumber whose value is the value of this BigNumber divided by the value of
   * BigNumber(y, b), rounded according to DECIMAL_PLACES and ROUNDING_MODE.
   */
  P.dividedBy = P.div = function (y, b) {
    return div(this, new BigNumber(y, b), DECIMAL_PLACES, ROUNDING_MODE);
  };

  /*
   * Return a new BigNumber whose value is the integer part of dividing the value of this
   * BigNumber by the value of BigNumber(y, b).
   */
  P.dividedToIntegerBy = P.idiv = function (y, b) {
    return div(this, new BigNumber(y, b), 0, 1);
  };

  /*
   * Return a BigNumber whose value is the value of this BigNumber exponentiated by n.
   *
   * If m is present, return the result modulo m.
   * If n is negative round according to DECIMAL_PLACES and ROUNDING_MODE.
   * If POW_PRECISION is non-zero and m is not present, round to POW_PRECISION using ROUNDING_MODE.
   *
   * The modular power operation works efficiently when x, n, and m are integers, otherwise it
   * is equivalent to calculating x.exponentiatedBy(n).modulo(m) with a POW_PRECISION of 0.
   *
   * n {number|string|BigNumber} The exponent. An integer.
   * [m] {number|string|BigNumber} The modulus.
   *
   * '[BigNumber Error] Exponent not an integer: {n}'
   */
  P.exponentiatedBy = P.pow = function (n, m) {
    var half,
      isModExp,
      i,
      k,
      more,
      nIsBig,
      nIsNeg,
      nIsOdd,
      y,
      x = this;
    n = new BigNumber(n);

    // Allow NaN and ±Infinity, but not other non-integers.
    if (n.c && !n.isInteger()) {
      throw Error(bignumberError + 'Exponent not an integer: ' + valueOf(n));
    }
    if (m != null) m = new BigNumber(m);

    // Exponent of MAX_SAFE_INTEGER is 15.
    nIsBig = n.e > 14;

    // If x is NaN, ±Infinity, ±0 or ±1, or n is ±Infinity, NaN or ±0.
    if (!x.c || !x.c[0] || x.c[0] == 1 && !x.e && x.c.length == 1 || !n.c || !n.c[0]) {
      // The sign of the result of pow when x is negative depends on the evenness of n.
      // If +n overflows to ±Infinity, the evenness of n would be not be known.
      y = new BigNumber(Math.pow(+valueOf(x), nIsBig ? n.s * (2 - isOdd(n)) : +valueOf(n)));
      return m ? y.mod(m) : y;
    }
    nIsNeg = n.s < 0;
    if (m) {
      // x % m returns NaN if abs(m) is zero, or m is NaN.
      if (m.c ? !m.c[0] : !m.s) return new BigNumber(NaN);
      isModExp = !nIsNeg && x.isInteger() && m.isInteger();
      if (isModExp) x = x.mod(m);

      // Overflow to ±Infinity: >=2**1e10 or >=1.0000024**1e15.
      // Underflow to ±0: <=0.79**1e10 or <=0.9999975**1e15.
    } else if (n.e > 9 && (x.e > 0 || x.e < -1 || (x.e == 0
    // [1, 240000000]
    ? x.c[0] > 1 || nIsBig && x.c[1] >= 24e7
    // [80000000000000]  [99999750000000]
    : x.c[0] < 8e13 || nIsBig && x.c[0] <= 9999975e7))) {
      // If x is negative and n is odd, k = -0, else k = 0.
      k = x.s < 0 && isOdd(n) ? -0 : 0;

      // If x >= 1, k = ±Infinity.
      if (x.e > -1) k = 1 / k;

      // If n is negative return ±0, else return ±Infinity.
      return new BigNumber(nIsNeg ? 1 / k : k);
    } else if (POW_PRECISION) {
      // Truncating each coefficient array to a length of k after each multiplication
      // equates to truncating significant digits to POW_PRECISION + [28, 41],
      // i.e. there will be a minimum of 28 guard digits retained.
      k = mathceil(POW_PRECISION / LOG_BASE + 2);
    }
    if (nIsBig) {
      half = new BigNumber(0.5);
      if (nIsNeg) n.s = 1;
      nIsOdd = isOdd(n);
    } else {
      i = Math.abs(+valueOf(n));
      nIsOdd = i % 2;
    }
    y = new BigNumber(ONE);

    // Performs 54 loop iterations for n of 9007199254740991.
    for (;;) {
      if (nIsOdd) {
        y = y.times(x);
        if (!y.c) break;
        if (k) {
          if (y.c.length > k) y.c.length = k;
        } else if (isModExp) {
          y = y.mod(m); //y = y.minus(div(y, m, 0, MODULO_MODE).times(m));
        }
      }
      if (i) {
        i = mathfloor(i / 2);
        if (i === 0) break;
        nIsOdd = i % 2;
      } else {
        n = n.times(half);
        round(n, n.e + 1, 1);
        if (n.e > 14) {
          nIsOdd = isOdd(n);
        } else {
          i = +valueOf(n);
          if (i === 0) break;
          nIsOdd = i % 2;
        }
      }
      x = x.times(x);
      if (k) {
        if (x.c && x.c.length > k) x.c.length = k;
      } else if (isModExp) {
        x = x.mod(m); //x = x.minus(div(x, m, 0, MODULO_MODE).times(m));
      }
    }
    if (isModExp) return y;
    if (nIsNeg) y = ONE.div(y);
    return m ? y.mod(m) : k ? round(y, POW_PRECISION, ROUNDING_MODE, more) : y;
  };

  /*
   * Return a new BigNumber whose value is the value of this BigNumber rounded to an integer
   * using rounding mode rm, or ROUNDING_MODE if rm is omitted.
   *
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {rm}'
   */
  P.integerValue = function (rm) {
    var n = new BigNumber(this);
    if (rm == null) rm = ROUNDING_MODE;else intCheck(rm, 0, 8);
    return round(n, n.e + 1, rm);
  };

  /*
   * Return true if the value of this BigNumber is equal to the value of BigNumber(y, b),
   * otherwise return false.
   */
  P.isEqualTo = P.eq = function (y, b) {
    return compare(this, new BigNumber(y, b)) === 0;
  };

  /*
   * Return true if the value of this BigNumber is a finite number, otherwise return false.
   */
  P.isFinite = function () {
    return !!this.c;
  };

  /*
   * Return true if the value of this BigNumber is greater than the value of BigNumber(y, b),
   * otherwise return false.
   */
  P.isGreaterThan = P.gt = function (y, b) {
    return compare(this, new BigNumber(y, b)) > 0;
  };

  /*
   * Return true if the value of this BigNumber is greater than or equal to the value of
   * BigNumber(y, b), otherwise return false.
   */
  P.isGreaterThanOrEqualTo = P.gte = function (y, b) {
    return (b = compare(this, new BigNumber(y, b))) === 1 || b === 0;
  };

  /*
   * Return true if the value of this BigNumber is an integer, otherwise return false.
   */
  P.isInteger = function () {
    return !!this.c && bitFloor(this.e / LOG_BASE) > this.c.length - 2;
  };

  /*
   * Return true if the value of this BigNumber is less than the value of BigNumber(y, b),
   * otherwise return false.
   */
  P.isLessThan = P.lt = function (y, b) {
    return compare(this, new BigNumber(y, b)) < 0;
  };

  /*
   * Return true if the value of this BigNumber is less than or equal to the value of
   * BigNumber(y, b), otherwise return false.
   */
  P.isLessThanOrEqualTo = P.lte = function (y, b) {
    return (b = compare(this, new BigNumber(y, b))) === -1 || b === 0;
  };

  /*
   * Return true if the value of this BigNumber is NaN, otherwise return false.
   */
  P.isNaN = function () {
    return !this.s;
  };

  /*
   * Return true if the value of this BigNumber is negative, otherwise return false.
   */
  P.isNegative = function () {
    return this.s < 0;
  };

  /*
   * Return true if the value of this BigNumber is positive, otherwise return false.
   */
  P.isPositive = function () {
    return this.s > 0;
  };

  /*
   * Return true if the value of this BigNumber is 0 or -0, otherwise return false.
   */
  P.isZero = function () {
    return !!this.c && this.c[0] == 0;
  };

  /*
   *  n - 0 = n
   *  n - N = N
   *  n - I = -I
   *  0 - n = -n
   *  0 - 0 = 0
   *  0 - N = N
   *  0 - I = -I
   *  N - n = N
   *  N - 0 = N
   *  N - N = N
   *  N - I = N
   *  I - n = I
   *  I - 0 = I
   *  I - N = N
   *  I - I = N
   *
   * Return a new BigNumber whose value is the value of this BigNumber minus the value of
   * BigNumber(y, b).
   */
  P.minus = function (y, b) {
    var i,
      j,
      t,
      xLTy,
      x = this,
      a = x.s;
    y = new BigNumber(y, b);
    b = y.s;

    // Either NaN?
    if (!a || !b) return new BigNumber(NaN);

    // Signs differ?
    if (a != b) {
      y.s = -b;
      return x.plus(y);
    }
    var xe = x.e / LOG_BASE,
      ye = y.e / LOG_BASE,
      xc = x.c,
      yc = y.c;
    if (!xe || !ye) {
      // Either Infinity?
      if (!xc || !yc) return xc ? (y.s = -b, y) : new BigNumber(yc ? x : NaN);

      // Either zero?
      if (!xc[0] || !yc[0]) {
        // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
        return yc[0] ? (y.s = -b, y) : new BigNumber(xc[0] ? x :
        // IEEE 754 (2008) 6.3: n - n = -0 when rounding to -Infinity
        ROUNDING_MODE == 3 ? -0 : 0);
      }
    }
    xe = bitFloor(xe);
    ye = bitFloor(ye);
    xc = xc.slice();

    // Determine which is the bigger number.
    if (a = xe - ye) {
      if (xLTy = a < 0) {
        a = -a;
        t = xc;
      } else {
        ye = xe;
        t = yc;
      }
      t.reverse();

      // Prepend zeros to equalise exponents.
      for (b = a; b--; t.push(0));
      t.reverse();
    } else {
      // Exponents equal. Check digit by digit.
      j = (xLTy = (a = xc.length) < (b = yc.length)) ? a : b;
      for (a = b = 0; b < j; b++) {
        if (xc[b] != yc[b]) {
          xLTy = xc[b] < yc[b];
          break;
        }
      }
    }

    // x < y? Point xc to the array of the bigger number.
    if (xLTy) {
      t = xc;
      xc = yc;
      yc = t;
      y.s = -y.s;
    }
    b = (j = yc.length) - (i = xc.length);

    // Append zeros to xc if shorter.
    // No need to add zeros to yc if shorter as subtract only needs to start at yc.length.
    if (b > 0) for (; b--; xc[i++] = 0);
    b = BASE - 1;

    // Subtract yc from xc.
    for (; j > a;) {
      if (xc[--j] < yc[j]) {
        for (i = j; i && !xc[--i]; xc[i] = b);
        --xc[i];
        xc[j] += BASE;
      }
      xc[j] -= yc[j];
    }

    // Remove leading zeros and adjust exponent accordingly.
    for (; xc[0] == 0; xc.splice(0, 1), --ye);

    // Zero?
    if (!xc[0]) {
      // Following IEEE 754 (2008) 6.3,
      // n - n = +0  but  n - n = -0  when rounding towards -Infinity.
      y.s = ROUNDING_MODE == 3 ? -1 : 1;
      y.c = [y.e = 0];
      return y;
    }

    // No need to check for Infinity as +x - +y != Infinity && -x - -y != Infinity
    // for finite x and y.
    return normalise(y, xc, ye);
  };

  /*
   *   n % 0 =  N
   *   n % N =  N
   *   n % I =  n
   *   0 % n =  0
   *  -0 % n = -0
   *   0 % 0 =  N
   *   0 % N =  N
   *   0 % I =  0
   *   N % n =  N
   *   N % 0 =  N
   *   N % N =  N
   *   N % I =  N
   *   I % n =  N
   *   I % 0 =  N
   *   I % N =  N
   *   I % I =  N
   *
   * Return a new BigNumber whose value is the value of this BigNumber modulo the value of
   * BigNumber(y, b). The result depends on the value of MODULO_MODE.
   */
  P.modulo = P.mod = function (y, b) {
    var q,
      s,
      x = this;
    y = new BigNumber(y, b);

    // Return NaN if x is Infinity or NaN, or y is NaN or zero.
    if (!x.c || !y.s || y.c && !y.c[0]) {
      return new BigNumber(NaN);

      // Return x if y is Infinity or x is zero.
    } else if (!y.c || x.c && !x.c[0]) {
      return new BigNumber(x);
    }
    if (MODULO_MODE == 9) {
      // Euclidian division: q = sign(y) * floor(x / abs(y))
      // r = x - qy    where  0 <= r < abs(y)
      s = y.s;
      y.s = 1;
      q = div(x, y, 0, 3);
      y.s = s;
      q.s *= s;
    } else {
      q = div(x, y, 0, MODULO_MODE);
    }
    y = x.minus(q.times(y));

    // To match JavaScript %, ensure sign of zero is sign of dividend.
    if (!y.c[0] && MODULO_MODE == 1) y.s = x.s;
    return y;
  };

  /*
   *  n * 0 = 0
   *  n * N = N
   *  n * I = I
   *  0 * n = 0
   *  0 * 0 = 0
   *  0 * N = N
   *  0 * I = N
   *  N * n = N
   *  N * 0 = N
   *  N * N = N
   *  N * I = N
   *  I * n = I
   *  I * 0 = N
   *  I * N = N
   *  I * I = I
   *
   * Return a new BigNumber whose value is the value of this BigNumber multiplied by the value
   * of BigNumber(y, b).
   */
  P.multipliedBy = P.times = function (y, b) {
    var c,
      e,
      i,
      j,
      k,
      m,
      xcL,
      xlo,
      xhi,
      ycL,
      ylo,
      yhi,
      zc,
      base,
      sqrtBase,
      x = this,
      xc = x.c,
      yc = (y = new BigNumber(y, b)).c;

    // Either NaN, ±Infinity or ±0?
    if (!xc || !yc || !xc[0] || !yc[0]) {
      // Return NaN if either is NaN, or one is 0 and the other is Infinity.
      if (!x.s || !y.s || xc && !xc[0] && !yc || yc && !yc[0] && !xc) {
        y.c = y.e = y.s = null;
      } else {
        y.s *= x.s;

        // Return ±Infinity if either is ±Infinity.
        if (!xc || !yc) {
          y.c = y.e = null;

          // Return ±0 if either is ±0.
        } else {
          y.c = [0];
          y.e = 0;
        }
      }
      return y;
    }
    e = bitFloor(x.e / LOG_BASE) + bitFloor(y.e / LOG_BASE);
    y.s *= x.s;
    xcL = xc.length;
    ycL = yc.length;

    // Ensure xc points to longer array and xcL to its length.
    if (xcL < ycL) {
      zc = xc;
      xc = yc;
      yc = zc;
      i = xcL;
      xcL = ycL;
      ycL = i;
    }

    // Initialise the result array with zeros.
    for (i = xcL + ycL, zc = []; i--; zc.push(0));
    base = BASE;
    sqrtBase = SQRT_BASE;
    for (i = ycL; --i >= 0;) {
      c = 0;
      ylo = yc[i] % sqrtBase;
      yhi = yc[i] / sqrtBase | 0;
      for (k = xcL, j = i + k; j > i;) {
        xlo = xc[--k] % sqrtBase;
        xhi = xc[k] / sqrtBase | 0;
        m = yhi * xlo + xhi * ylo;
        xlo = ylo * xlo + m % sqrtBase * sqrtBase + zc[j] + c;
        c = (xlo / base | 0) + (m / sqrtBase | 0) + yhi * xhi;
        zc[j--] = xlo % base;
      }
      zc[j] = c;
    }
    if (c) {
      ++e;
    } else {
      zc.splice(0, 1);
    }
    return normalise(y, zc, e);
  };

  /*
   * Return a new BigNumber whose value is the value of this BigNumber negated,
   * i.e. multiplied by -1.
   */
  P.negated = function () {
    var x = new BigNumber(this);
    x.s = -x.s || null;
    return x;
  };

  /*
   *  n + 0 = n
   *  n + N = N
   *  n + I = I
   *  0 + n = n
   *  0 + 0 = 0
   *  0 + N = N
   *  0 + I = I
   *  N + n = N
   *  N + 0 = N
   *  N + N = N
   *  N + I = N
   *  I + n = I
   *  I + 0 = I
   *  I + N = N
   *  I + I = I
   *
   * Return a new BigNumber whose value is the value of this BigNumber plus the value of
   * BigNumber(y, b).
   */
  P.plus = function (y, b) {
    var t,
      x = this,
      a = x.s;
    y = new BigNumber(y, b);
    b = y.s;

    // Either NaN?
    if (!a || !b) return new BigNumber(NaN);

    // Signs differ?
    if (a != b) {
      y.s = -b;
      return x.minus(y);
    }
    var xe = x.e / LOG_BASE,
      ye = y.e / LOG_BASE,
      xc = x.c,
      yc = y.c;
    if (!xe || !ye) {
      // Return ±Infinity if either ±Infinity.
      if (!xc || !yc) return new BigNumber(a / 0);

      // Either zero?
      // Return y if y is non-zero, x if x is non-zero, or zero if both are zero.
      if (!xc[0] || !yc[0]) return yc[0] ? y : new BigNumber(xc[0] ? x : a * 0);
    }
    xe = bitFloor(xe);
    ye = bitFloor(ye);
    xc = xc.slice();

    // Prepend zeros to equalise exponents. Faster to use reverse then do unshifts.
    if (a = xe - ye) {
      if (a > 0) {
        ye = xe;
        t = yc;
      } else {
        a = -a;
        t = xc;
      }
      t.reverse();
      for (; a--; t.push(0));
      t.reverse();
    }
    a = xc.length;
    b = yc.length;

    // Point xc to the longer array, and b to the shorter length.
    if (a - b < 0) {
      t = yc;
      yc = xc;
      xc = t;
      b = a;
    }

    // Only start adding at yc.length - 1 as the further digits of xc can be ignored.
    for (a = 0; b;) {
      a = (xc[--b] = xc[b] + yc[b] + a) / BASE | 0;
      xc[b] = BASE === xc[b] ? 0 : xc[b] % BASE;
    }
    if (a) {
      xc = [a].concat(xc);
      ++ye;
    }

    // No need to check for zero, as +x + +y != 0 && -x + -y != 0
    // ye = MAX_EXP + 1 possible
    return normalise(y, xc, ye);
  };

  /*
   * If sd is undefined or null or true or false, return the number of significant digits of
   * the value of this BigNumber, or null if the value of this BigNumber is ±Infinity or NaN.
   * If sd is true include integer-part trailing zeros in the count.
   *
   * Otherwise, if sd is a number, return a new BigNumber whose value is the value of this
   * BigNumber rounded to a maximum of sd significant digits using rounding mode rm, or
   * ROUNDING_MODE if rm is omitted.
   *
   * sd {number|boolean} number: significant digits: integer, 1 to MAX inclusive.
   *                     boolean: whether to count integer-part trailing zeros: true or false.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
   */
  P.precision = P.sd = function (sd, rm) {
    var c,
      n,
      v,
      x = this;
    if (sd != null && sd !== !!sd) {
      intCheck(sd, 1, MAX);
      if (rm == null) rm = ROUNDING_MODE;else intCheck(rm, 0, 8);
      return round(new BigNumber(x), sd, rm);
    }
    if (!(c = x.c)) return null;
    v = c.length - 1;
    n = v * LOG_BASE + 1;
    if (v = c[v]) {
      // Subtract the number of trailing zeros of the last element.
      for (; v % 10 == 0; v /= 10, n--);

      // Add the number of digits of the first element.
      for (v = c[0]; v >= 10; v /= 10, n++);
    }
    if (sd && x.e + 1 > n) n = x.e + 1;
    return n;
  };

  /*
   * Return a new BigNumber whose value is the value of this BigNumber shifted by k places
   * (powers of 10). Shift to the right if n > 0, and to the left if n < 0.
   *
   * k {number} Integer, -MAX_SAFE_INTEGER to MAX_SAFE_INTEGER inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {k}'
   */
  P.shiftedBy = function (k) {
    intCheck(k, -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER);
    return this.times('1e' + k);
  };

  /*
   *  sqrt(-n) =  N
   *  sqrt(N) =  N
   *  sqrt(-I) =  N
   *  sqrt(I) =  I
   *  sqrt(0) =  0
   *  sqrt(-0) = -0
   *
   * Return a new BigNumber whose value is the square root of the value of this BigNumber,
   * rounded according to DECIMAL_PLACES and ROUNDING_MODE.
   */
  P.squareRoot = P.sqrt = function () {
    var m,
      n,
      r,
      rep,
      t,
      x = this,
      c = x.c,
      s = x.s,
      e = x.e,
      dp = DECIMAL_PLACES + 4,
      half = new BigNumber('0.5');

    // Negative/NaN/Infinity/zero?
    if (s !== 1 || !c || !c[0]) {
      return new BigNumber(!s || s < 0 && (!c || c[0]) ? NaN : c ? x : 1 / 0);
    }

    // Initial estimate.
    s = Math.sqrt(+valueOf(x));

    // Math.sqrt underflow/overflow?
    // Pass x to Math.sqrt as integer, then adjust the exponent of the result.
    if (s == 0 || s == 1 / 0) {
      n = coeffToString(c);
      if ((n.length + e) % 2 == 0) n += '0';
      s = Math.sqrt(+n);
      e = bitFloor((e + 1) / 2) - (e < 0 || e % 2);
      if (s == 1 / 0) {
        n = '5e' + e;
      } else {
        n = s.toExponential();
        n = n.slice(0, n.indexOf('e') + 1) + e;
      }
      r = new BigNumber(n);
    } else {
      r = new BigNumber(s + '');
    }

    // Check for zero.
    // r could be zero if MIN_EXP is changed after the this value was created.
    // This would cause a division by zero (x/t) and hence Infinity below, which would cause
    // coeffToString to throw.
    if (r.c[0]) {
      e = r.e;
      s = e + dp;
      if (s < 3) s = 0;

      // Newton-Raphson iteration.
      for (;;) {
        t = r;
        r = half.times(t.plus(div(x, t, dp, 1)));
        if (coeffToString(t.c).slice(0, s) === (n = coeffToString(r.c)).slice(0, s)) {
          // The exponent of r may here be one less than the final result exponent,
          // e.g 0.0009999 (e-4) --> 0.001 (e-3), so adjust s so the rounding digits
          // are indexed correctly.
          if (r.e < e) --s;
          n = n.slice(s - 3, s + 1);

          // The 4th rounding digit may be in error by -1 so if the 4 rounding digits
          // are 9999 or 4999 (i.e. approaching a rounding boundary) continue the
          // iteration.
          if (n == '9999' || !rep && n == '4999') {
            // On the first iteration only, check to see if rounding up gives the
            // exact result as the nines may infinitely repeat.
            if (!rep) {
              round(t, t.e + DECIMAL_PLACES + 2, 0);
              if (t.times(t).eq(x)) {
                r = t;
                break;
              }
            }
            dp += 4;
            s += 4;
            rep = 1;
          } else {
            // If rounding digits are null, 0{0,4} or 50{0,3}, check for exact
            // result. If not, then there are further digits and m will be truthy.
            if (!+n || !+n.slice(1) && n.charAt(0) == '5') {
              // Truncate to the first rounding digit.
              round(r, r.e + DECIMAL_PLACES + 2, 1);
              m = !r.times(r).eq(x);
            }
            break;
          }
        }
      }
    }
    return round(r, r.e + DECIMAL_PLACES + 1, ROUNDING_MODE, m);
  };

  /*
   * Return a string representing the value of this BigNumber in exponential notation and
   * rounded using ROUNDING_MODE to dp fixed decimal places.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
   */
  P.toExponential = function (dp, rm) {
    if (dp != null) {
      intCheck(dp, 0, MAX);
      dp++;
    }
    return format(this, dp, rm, 1);
  };

  /*
   * Return a string representing the value of this BigNumber in fixed-point notation rounding
   * to dp fixed decimal places using rounding mode rm, or ROUNDING_MODE if rm is omitted.
   *
   * Note: as with JavaScript's number type, (-0).toFixed(0) is '0',
   * but e.g. (-0.00001).toFixed(0) is '-0'.
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
   */
  P.toFixed = function (dp, rm) {
    if (dp != null) {
      intCheck(dp, 0, MAX);
      dp = dp + this.e + 1;
    }
    return format(this, dp, rm);
  };

  /*
   * Return a string representing the value of this BigNumber in fixed-point notation rounded
   * using rm or ROUNDING_MODE to dp decimal places, and formatted according to the properties
   * of the format or FORMAT object (see BigNumber.set).
   *
   * The formatting object may contain some or all of the properties shown below.
   *
   * FORMAT = {
   *   prefix: '',
   *   groupSize: 3,
   *   secondaryGroupSize: 0,
   *   groupSeparator: ',',
   *   decimalSeparator: '.',
   *   fractionGroupSize: 0,
   *   fractionGroupSeparator: '\xA0',      // non-breaking space
   *   suffix: ''
   * };
   *
   * [dp] {number} Decimal places. Integer, 0 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   * [format] {object} Formatting options. See FORMAT pbject above.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {dp|rm}'
   * '[BigNumber Error] Argument not an object: {format}'
   */
  P.toFormat = function (dp, rm, format) {
    var str,
      x = this;
    if (format == null) {
      if (dp != null && rm && typeof rm == 'object') {
        format = rm;
        rm = null;
      } else if (dp && typeof dp == 'object') {
        format = dp;
        dp = rm = null;
      } else {
        format = FORMAT;
      }
    } else if (typeof format != 'object') {
      throw Error(bignumberError + 'Argument not an object: ' + format);
    }
    str = x.toFixed(dp, rm);
    if (x.c) {
      var i,
        arr = str.split('.'),
        g1 = +format.groupSize,
        g2 = +format.secondaryGroupSize,
        groupSeparator = format.groupSeparator || '',
        intPart = arr[0],
        fractionPart = arr[1],
        isNeg = x.s < 0,
        intDigits = isNeg ? intPart.slice(1) : intPart,
        len = intDigits.length;
      if (g2) {
        i = g1;
        g1 = g2;
        g2 = i;
        len -= i;
      }
      if (g1 > 0 && len > 0) {
        i = len % g1 || g1;
        intPart = intDigits.substr(0, i);
        for (; i < len; i += g1) intPart += groupSeparator + intDigits.substr(i, g1);
        if (g2 > 0) intPart += groupSeparator + intDigits.slice(i);
        if (isNeg) intPart = '-' + intPart;
      }
      str = fractionPart ? intPart + (format.decimalSeparator || '') + ((g2 = +format.fractionGroupSize) ? fractionPart.replace(new RegExp('\\d{' + g2 + '}\\B', 'g'), '$&' + (format.fractionGroupSeparator || '')) : fractionPart) : intPart;
    }
    return (format.prefix || '') + str + (format.suffix || '');
  };

  /*
   * Return an array of two BigNumbers representing the value of this BigNumber as a simple
   * fraction with an integer numerator and an integer denominator.
   * The denominator will be a positive non-zero value less than or equal to the specified
   * maximum denominator. If a maximum denominator is not specified, the denominator will be
   * the lowest value necessary to represent the number exactly.
   *
   * [md] {number|string|BigNumber} Integer >= 1, or Infinity. The maximum denominator.
   *
   * '[BigNumber Error] Argument {not an integer|out of range} : {md}'
   */
  P.toFraction = function (md) {
    var d,
      d0,
      d1,
      d2,
      e,
      exp,
      n,
      n0,
      n1,
      q,
      r,
      s,
      x = this,
      xc = x.c;
    if (md != null) {
      n = new BigNumber(md);

      // Throw if md is less than one or is not an integer, unless it is Infinity.
      if (!n.isInteger() && (n.c || n.s !== 1) || n.lt(ONE)) {
        throw Error(bignumberError + 'Argument ' + (n.isInteger() ? 'out of range: ' : 'not an integer: ') + valueOf(n));
      }
    }
    if (!xc) return new BigNumber(x);
    d = new BigNumber(ONE);
    n1 = d0 = new BigNumber(ONE);
    d1 = n0 = new BigNumber(ONE);
    s = coeffToString(xc);

    // Determine initial denominator.
    // d is a power of 10 and the minimum max denominator that specifies the value exactly.
    e = d.e = s.length - x.e - 1;
    d.c[0] = POWS_TEN[(exp = e % LOG_BASE) < 0 ? LOG_BASE + exp : exp];
    md = !md || n.comparedTo(d) > 0 ? e > 0 ? d : n1 : n;
    exp = MAX_EXP;
    MAX_EXP = 1 / 0;
    n = new BigNumber(s);

    // n0 = d1 = 0
    n0.c[0] = 0;
    for (;;) {
      q = div(n, d, 0, 1);
      d2 = d0.plus(q.times(d1));
      if (d2.comparedTo(md) == 1) break;
      d0 = d1;
      d1 = d2;
      n1 = n0.plus(q.times(d2 = n1));
      n0 = d2;
      d = n.minus(q.times(d2 = d));
      n = d2;
    }
    d2 = div(md.minus(d0), d1, 0, 1);
    n0 = n0.plus(d2.times(n1));
    d0 = d0.plus(d2.times(d1));
    n0.s = n1.s = x.s;
    e = e * 2;

    // Determine which fraction is closer to x, n0/d0 or n1/d1
    r = div(n1, d1, e, ROUNDING_MODE).minus(x).abs().comparedTo(div(n0, d0, e, ROUNDING_MODE).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];
    MAX_EXP = exp;
    return r;
  };

  /*
   * Return the value of this BigNumber converted to a number primitive.
   */
  P.toNumber = function () {
    return +valueOf(this);
  };

  /*
   * Return a string representing the value of this BigNumber rounded to sd significant digits
   * using rounding mode rm or ROUNDING_MODE. If sd is less than the number of digits
   * necessary to represent the integer part of the value in fixed-point notation, then use
   * exponential notation.
   *
   * [sd] {number} Significant digits. Integer, 1 to MAX inclusive.
   * [rm] {number} Rounding mode. Integer, 0 to 8 inclusive.
   *
   * '[BigNumber Error] Argument {not a primitive number|not an integer|out of range}: {sd|rm}'
   */
  P.toPrecision = function (sd, rm) {
    if (sd != null) intCheck(sd, 1, MAX);
    return format(this, sd, rm, 2);
  };

  /*
   * Return a string representing the value of this BigNumber in base b, or base 10 if b is
   * omitted. If a base is specified, including base 10, round according to DECIMAL_PLACES and
   * ROUNDING_MODE. If a base is not specified, and this BigNumber has a positive exponent
   * that is equal to or greater than TO_EXP_POS, or a negative exponent equal to or less than
   * TO_EXP_NEG, return exponential notation.
   *
   * [b] {number} Integer, 2 to ALPHABET.length inclusive.
   *
   * '[BigNumber Error] Base {not a primitive number|not an integer|out of range}: {b}'
   */
  P.toString = function (b) {
    var str,
      n = this,
      s = n.s,
      e = n.e;

    // Infinity or NaN?
    if (e === null) {
      if (s) {
        str = 'Infinity';
        if (s < 0) str = '-' + str;
      } else {
        str = 'NaN';
      }
    } else {
      if (b == null) {
        str = e <= TO_EXP_NEG || e >= TO_EXP_POS ? toExponential(coeffToString(n.c), e) : toFixedPoint(coeffToString(n.c), e, '0');
      } else if (b === 10 && alphabetHasNormalDecimalDigits) {
        n = round(new BigNumber(n), DECIMAL_PLACES + e + 1, ROUNDING_MODE);
        str = toFixedPoint(coeffToString(n.c), n.e, '0');
      } else {
        intCheck(b, 2, ALPHABET.length, 'Base');
        str = convertBase(toFixedPoint(coeffToString(n.c), e, '0'), 10, b, s, true);
      }
      if (s < 0 && n.c[0]) str = '-' + str;
    }
    return str;
  };

  /*
   * Return as toString, but do not accept a base argument, and include the minus sign for
   * negative zero.
   */
  P.valueOf = P.toJSON = function () {
    return valueOf(this);
  };
  P._isBigNumber = true;
  P[Symbol.toStringTag] = 'BigNumber';

  // Node.js v10.12.0+
  P[Symbol.for('nodejs.util.inspect.custom')] = P.valueOf;
  if (configObject != null) BigNumber.set(configObject);
  return BigNumber;
}

// PRIVATE HELPER FUNCTIONS

// These functions don't need access to variables,
// e.g. DECIMAL_PLACES, in the scope of the `clone` function above.

function bitFloor(n) {
  var i = n | 0;
  return n > 0 || n === i ? i : i - 1;
}

// Return a coefficient array as a string of base 10 digits.
function coeffToString(a) {
  var s,
    z,
    i = 1,
    j = a.length,
    r = a[0] + '';
  for (; i < j;) {
    s = a[i++] + '';
    z = LOG_BASE - s.length;
    for (; z--; s = '0' + s);
    r += s;
  }

  // Determine trailing zeros.
  for (j = r.length; r.charCodeAt(--j) === 48;);
  return r.slice(0, j + 1 || 1);
}

// Compare the value of BigNumbers x and y.
function compare(x, y) {
  var a,
    b,
    xc = x.c,
    yc = y.c,
    i = x.s,
    j = y.s,
    k = x.e,
    l = y.e;

  // Either NaN?
  if (!i || !j) return null;
  a = xc && !xc[0];
  b = yc && !yc[0];

  // Either zero?
  if (a || b) return a ? b ? 0 : -j : i;

  // Signs differ?
  if (i != j) return i;
  a = i < 0;
  b = k == l;

  // Either Infinity?
  if (!xc || !yc) return b ? 0 : !xc ^ a ? 1 : -1;

  // Compare exponents.
  if (!b) return k > l ^ a ? 1 : -1;
  j = (k = xc.length) < (l = yc.length) ? k : l;

  // Compare digit by digit.
  for (i = 0; i < j; i++) if (xc[i] != yc[i]) return xc[i] > yc[i] ^ a ? 1 : -1;

  // Compare lengths.
  return k == l ? 0 : k > l ^ a ? 1 : -1;
}

/*
 * Check that n is a primitive number, an integer, and in range, otherwise throw.
 */
function intCheck(n, min, max, name) {
  if (n < min || n > max || n !== mathfloor(n)) {
    throw Error(bignumberError + (name || 'Argument') + (typeof n == 'number' ? n < min || n > max ? ' out of range: ' : ' not an integer: ' : ' not a primitive number: ') + String(n));
  }
}

// Assumes finite n.
function isOdd(n) {
  var k = n.c.length - 1;
  return bitFloor(n.e / LOG_BASE) == k && n.c[k] % 2 != 0;
}
function toExponential(str, e) {
  return (str.length > 1 ? str.charAt(0) + '.' + str.slice(1) : str) + (e < 0 ? 'e' : 'e+') + e;
}
function toFixedPoint(str, e, z) {
  var len, zs;

  // Negative exponent?
  if (e < 0) {
    // Prepend zeros.
    for (zs = z + '.'; ++e; zs += z);
    str = zs + str;

    // Positive exponent
  } else {
    len = str.length;

    // Append zeros.
    if (++e > len) {
      for (zs = z, e -= len; --e; zs += z);
      str += zs;
    } else if (e < len) {
      str = str.slice(0, e) + '.' + str.slice(e);
    }
  }
  return str;
}

// EXPORT

var BigNumber = clone();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BigNumber);

/***/ },

/***/ 27354
/*!*******************************************************!*\
  !*** ./node_modules/micro-key-producer/esm/slip10.js ***!
  \*******************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HARDENED_OFFSET: () => (/* binding */ HARDENED_OFFSET),
/* harmony export */   HDKey: () => (/* binding */ HDKey),
/* harmony export */   MASTER_SECRET: () => (/* binding */ MASTER_SECRET),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _noble_curves_ed25519__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @noble/curves/ed25519 */ 87834);
/* harmony import */ var _noble_hashes_assert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @noble/hashes/_assert */ 10980);
/* harmony import */ var _noble_hashes_hmac__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @noble/hashes/hmac */ 40780);
/* harmony import */ var _noble_hashes_ripemd160__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @noble/hashes/ripemd160 */ 8015);
/* harmony import */ var _noble_hashes_sha2__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @noble/hashes/sha2 */ 98047);
/* harmony import */ var _noble_hashes_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @noble/hashes/utils */ 97770);
/*! micro-key-producer - MIT License (c) 2024 Paul Miller (paulmillr.com) */






const MASTER_SECRET = (0,_noble_hashes_utils__WEBPACK_IMPORTED_MODULE_5__.utf8ToBytes)('ed25519 seed');
const HARDENED_OFFSET = 0x80000000;
const ZERO = new Uint8Array([0]);
function ensureBytes(b, ...lengths) {
  if (typeof b === 'string') b = (0,_noble_hashes_utils__WEBPACK_IMPORTED_MODULE_5__.hexToBytes)(b);
  (0,_noble_hashes_assert__WEBPACK_IMPORTED_MODULE_1__.abytes)(b, ...lengths);
  return b;
}
const hash160 = data => (0,_noble_hashes_ripemd160__WEBPACK_IMPORTED_MODULE_3__.ripemd160)((0,_noble_hashes_sha2__WEBPACK_IMPORTED_MODULE_4__.sha256)(data));
const fromU32 = data => (0,_noble_hashes_utils__WEBPACK_IMPORTED_MODULE_5__.createView)(data).getUint32(0, false);
const toU32 = n => {
  if (!Number.isSafeInteger(n) || n < 0 || n > 2 ** 32 - 1) {
    throw new Error(`Invalid number=${n}. Should be from 0 to 2 ** 32 - 1`);
  }
  const buf = new Uint8Array(4);
  (0,_noble_hashes_utils__WEBPACK_IMPORTED_MODULE_5__.createView)(buf).setUint32(0, n, false);
  return buf;
};
class HDKey {
  get publicKeyRaw() {
    return _noble_curves_ed25519__WEBPACK_IMPORTED_MODULE_0__.ed25519.getPublicKey(this.privateKey);
  }
  get publicKey() {
    return (0,_noble_hashes_utils__WEBPACK_IMPORTED_MODULE_5__.concatBytes)(ZERO, this.publicKeyRaw);
  }
  get pubHash() {
    return hash160(this.publicKey);
  }
  get fingerprint() {
    return fromU32(this.pubHash);
  }
  get fingerprintHex() {
    return (0,_noble_hashes_utils__WEBPACK_IMPORTED_MODULE_5__.bytesToHex)(toU32(this.fingerprint));
  }
  get parentFingerprintHex() {
    return (0,_noble_hashes_utils__WEBPACK_IMPORTED_MODULE_5__.bytesToHex)(toU32(this.parentFingerprint));
  }
  static fromMasterSeed(seed) {
    seed = ensureBytes(seed);
    if (8 * seed.length < 128 || 8 * seed.length > 512) {
      throw new Error(`HDKey: wrong seed length=${seed.length}. Should be between 128 and 512 bits; 256 bits is advised)`);
    }
    const I = (0,_noble_hashes_hmac__WEBPACK_IMPORTED_MODULE_2__.hmac)(_noble_hashes_sha2__WEBPACK_IMPORTED_MODULE_4__.sha512, MASTER_SECRET, seed);
    return new HDKey({
      privateKey: I.slice(0, 32),
      chainCode: I.slice(32)
    });
  }
  constructor(opt) {
    this.depth = 0;
    this.index = 0;
    this.parentFingerprint = 0;
    if (!opt || typeof opt !== 'object') throw new Error('HDKey.constructor must not be called directly');
    (0,_noble_hashes_assert__WEBPACK_IMPORTED_MODULE_1__.abytes)(opt.privateKey, 32);
    (0,_noble_hashes_assert__WEBPACK_IMPORTED_MODULE_1__.abytes)(opt.chainCode, 32);
    this.depth = opt.depth || 0;
    this.index = opt.index || 0;
    this.parentFingerprint = opt.parentFingerprint || 0;
    if (!this.depth) {
      if (this.parentFingerprint || this.index) throw new Error('HDKey: zero depth with non-zero index/parent fingerprint');
    }
    this.chainCode = opt.chainCode;
    this.privateKey = opt.privateKey;
  }
  derive(path, forceHardened = false) {
    if (!/^[mM]'?/.test(path)) throw new Error('Path must start with "m" or "M"');
    if (/^[mM]'?$/.test(path)) return this;
    const parts = path.replace(/^[mM]'?\//, '').split('/');
    // tslint:disable-next-line
    let child = this;
    for (const c of parts) {
      const m = /^(\d+)('?)$/.exec(c);
      if (!m || m.length !== 3) throw new Error(`Invalid child index: ${c}`);
      let idx = +m[1];
      if (!Number.isSafeInteger(idx) || idx >= HARDENED_OFFSET) throw new Error('Invalid index');
      // hardened key
      if (forceHardened || m[2] === "'") idx += HARDENED_OFFSET;
      child = child.deriveChild(idx);
    }
    return child;
  }
  deriveChild(index) {
    if (index < HARDENED_OFFSET) throw new Error(`Non-hardened child derivation not possible for Ed25519 (index=${index})`);
    // Hardened child: 0x00 || ser256(kpar) || ser32(index)
    const data = (0,_noble_hashes_utils__WEBPACK_IMPORTED_MODULE_5__.concatBytes)(ZERO, this.privateKey, toU32(index));
    const I = (0,_noble_hashes_hmac__WEBPACK_IMPORTED_MODULE_2__.hmac)(_noble_hashes_sha2__WEBPACK_IMPORTED_MODULE_4__.sha512, this.chainCode, data);
    return new HDKey({
      chainCode: I.slice(32),
      depth: this.depth + 1,
      parentFingerprint: this.fingerprint,
      index,
      privateKey: I.slice(0, 32)
    });
  }
  sign(message) {
    return _noble_curves_ed25519__WEBPACK_IMPORTED_MODULE_0__.ed25519.sign(message, this.privateKey);
  }
  verify(message, signature) {
    signature = ensureBytes(signature, 64);
    return _noble_curves_ed25519__WEBPACK_IMPORTED_MODULE_0__.ed25519.verify(signature, message, this.publicKeyRaw);
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HDKey);

/***/ }

}]);
//# sourceMappingURL=default-src_app_solana_service_ts.js.map