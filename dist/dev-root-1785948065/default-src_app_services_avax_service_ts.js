"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["default-src_app_services_avax_service_ts"],{

/***/ 12560
/*!******************************************!*\
  !*** ./src/app/services/avax.service.ts ***!
  \******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AvaxService: () => (/* binding */ AvaxService)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var web3__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! web3 */ 37433);
/* harmony import */ var web3_validator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! web3-validator */ 18578);
/* harmony import */ var environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _http_wrapper_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../http-wrapper.service */ 84099);
/* harmony import */ var app_services_rpc_provider_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/services/rpc-provider.service */ 55849);







class AvaxService {
  _httpWrapper;
  _rpcProvider;
  _baseUrl = environments_environment__WEBPACK_IMPORTED_MODULE_3__.environment.apiUrl;
  _chainConfigs = {
    mainnet: {
      blockExplorerUrls: ["https://snowtrace.io"],
      chainId: 43114,
      chainName: "Avalanche C-Chain",
      rpcUrls: [environments_environment__WEBPACK_IMPORTED_MODULE_3__.environment.avalancheRpc.mainnet],
      nativeCurrency: {
        decimals: 18,
        name: "AVAX",
        symbol: "AVAX"
      }
    }
    // Testnet configuration can be added when needed
    // testnet: {
    //     blockExplorerUrls: ["https://testnet.snowtrace.io"],
    //     chainId: 43113,
    //     chainName: "Avalanche Fuji Testnet",
    //     rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    //     nativeCurrency: {
    //         decimals: 18,
    //         name: "AVAX",
    //         symbol: "AVAX",
    //     },
    // },
  };
  constructor(_httpWrapper, _rpcProvider) {
    this._httpWrapper = _httpWrapper;
    this._rpcProvider = _rpcProvider;
  }
  _defaultResponse() {
    return {
      data: {
        _balance: 0,
        balance: "0",
        fiatBalance: "0",
        account: {
          asset: "AVAX",
          price: "0"
        },
        tokenHoldings: {
          tokens: []
        }
      }
    };
  }
  _fromWei(amount, decimals = 18) {
    const web3 = new web3__WEBPACK_IMPORTED_MODULE_1__["default"]();
    if (decimals === 18) return web3.utils.fromWei(amount, "ether");
    const factor = Math.pow(10, decimals);
    return (parseFloat(amount) / factor).toString();
  }
  _getTransactionCost(toAddress, value, data) {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const web3 = yield _this._rpcProvider.getWeb3("avalanche", {
        allowDirectFallback: false
      });
      const estimatedGas = yield web3.eth.estimateGas({
        from: "0x0000000000000000000000000000000000000000",
        to: toAddress,
        value: value,
        data: data
      });
      const gasPriceRaw = yield web3.eth.getGasPrice();
      const gasPrice = (BigInt(gasPriceRaw) * BigInt(110) / BigInt(100)).toString();
      return {
        estimatedGas: Number(estimatedGas),
        gasPrice: gasPrice
      };
    })();
  }
  _sendERC20Transaction(amount, privateKey, toAddress, tokenAddress) {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      let signedTx;
      try {
        const web3 = yield _this2._rpcProvider.getWeb3("avalanche", {
          allowDirectFallback: false
        });
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.transactionConfirmationBlocks = 1;
        web3.eth.transactionPollingInterval = 2000;
        web3.eth.transactionReceiptPollingInterval = 2000;
        web3.eth.transactionPollingTimeout = 30000;
        const minABI = [{
          constant: false,
          inputs: [{
            name: "_to",
            type: "address"
          }, {
            name: "_value",
            type: "uint256"
          }],
          name: "transfer",
          outputs: [{
            name: "",
            type: "bool"
          }],
          type: "function"
        }, {
          constant: true,
          inputs: [],
          name: "decimals",
          outputs: [{
            name: "",
            type: "uint8"
          }],
          type: "function"
        }];
        const contract = new web3.eth.Contract(minABI, tokenAddress);
        const decimals = Number(yield contract.methods.decimals().call());
        const amountInWei = _this2._toWei(amount, decimals);
        const transferData = contract.methods.transfer(toAddress, amountInWei).encodeABI();
        const [nonce, gasPrice] = yield Promise.all([web3.eth.getTransactionCount(account.address, "latest"), web3.eth.getGasPrice()]);
        const gasEstimate = yield web3.eth.estimateGas({
          from: account.address,
          to: tokenAddress,
          data: transferData
        });
        const tx = {
          from: account.address,
          to: tokenAddress,
          data: transferData,
          nonce: nonce,
          gasPrice: gasPrice,
          gas: gasEstimate
        };
        signedTx = yield web3.eth.accounts.signTransaction(tx, privateKey);
        const receipt = yield web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        return receipt;
      } catch (error) {
        if (signedTx) return signedTx;
        console.error("Error sending ERC20 token on Avalanche:", error);
        throw error;
      }
    })();
  }
  _sendNativeTransaction(amount, privateKey, toAddress) {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const web3 = yield _this3._rpcProvider.getWeb3("avalanche", {
          allowDirectFallback: false
        });
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        const amountInWei = web3.utils.toWei(amount, "ether");
        const nonce = yield web3.eth.getTransactionCount(account.address, "latest");
        const transactionCost = yield _this3._getTransactionCost(toAddress, amountInWei, "0x");
        const tx = {
          from: account.address,
          to: toAddress,
          value: amountInWei,
          nonce: nonce,
          gasPrice: transactionCost.gasPrice,
          gas: transactionCost.estimatedGas,
          chainId: _this3._chainConfigs.mainnet.chainId
        };
        const signedTx = yield web3.eth.accounts.signTransaction(tx, privateKey);
        try {
          return yield web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        } catch (txError) {
          console.error("Detailed transaction error for Avalanche:", {
            error: txError,
            tx: {
              ...tx,
              value: web3.utils.fromWei(tx.value, "ether"),
              gasPrice: web3.utils.fromWei(tx.gasPrice, "gwei") + " gwei"
            }
          });
          return signedTx;
        }
      } catch (error) {
        console.error("Error in Avalanche transaction preparation:", error);
        throw error;
      }
    })();
  }
  _toWei(amount, decimals = 18) {
    const web3 = new web3__WEBPACK_IMPORTED_MODULE_1__["default"]();
    if (decimals === 18) return web3.utils.toWei(amount, "ether");
    const factor = Math.pow(10, decimals);
    const amountInSmallestUnit = Math.floor(parseFloat(amount) * factor);
    return amountInSmallestUnit.toString();
  }
  calculateTransactionFees(receiverAddress, amount, tokenAddress, tokenDecimals, senderAddress) {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        if (!receiverAddress || !_this4.checkIfValidAddress(receiverAddress)) {
          throw new Error("Invalid address");
        }
        const web3 = yield _this4._rpcProvider.getWeb3("avalanche", {
          allowDirectFallback: false
        });
        const value = _this4._toWei(amount.toString(), tokenDecimals || 18);
        let estimatedGas;
        if (tokenAddress) {
          const minABI = [{
            constant: false,
            inputs: [{
              name: "_to",
              type: "address"
            }, {
              name: "_value",
              type: "uint256"
            }],
            name: "transfer",
            outputs: [{
              name: "",
              type: "bool"
            }],
            type: "function"
          }];
          const contract = new web3.eth.Contract(minABI, tokenAddress);
          const data = contract.methods.transfer(receiverAddress, value).encodeABI();
          // Use sender address if provided, otherwise fall back to zero address
          const fromAddress = senderAddress && _this4.checkIfValidAddress(senderAddress) ? senderAddress : "0x0000000000000000000000000000000000000000";
          estimatedGas = yield web3.eth.estimateGas({
            from: fromAddress,
            to: tokenAddress,
            data,
            value: "0"
          });
          estimatedGas = Math.floor(Number(estimatedGas) * 1.2); // 20% buffer
        } else {
          // Use sender address if provided, otherwise fall back to zero address
          const fromAddress = senderAddress && _this4.checkIfValidAddress(senderAddress) ? senderAddress : "0x0000000000000000000000000000000000000000";
          estimatedGas = yield web3.eth.estimateGas({
            from: fromAddress,
            to: receiverAddress,
            value
          });
        }
        const gasPriceRaw = yield web3.eth.getGasPrice();
        const gasPrice = (BigInt(gasPriceRaw) * BigInt(110) / BigInt(100)).toString();
        const totalCost = (BigInt(gasPrice) * BigInt(estimatedGas)).toString();
        const nativeFee = Number(web3.utils.fromWei(totalCost, "ether"));
        const avaxPrice = yield _this4.getAVAXPrice();
        return {
          fee: nativeFee,
          fiatFee: nativeFee * avaxPrice,
          total: amount + nativeFee,
          networkPrice: avaxPrice
        };
      } catch (error) {
        console.error("Error calculating Avalanche transaction fees:", error);
        throw error;
      }
    })();
  }
  checkIfValidAddress(address) {
    return (0,web3_validator__WEBPACK_IMPORTED_MODULE_2__.isAddress)(address);
  }
  getAVAXPrice() {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        try {
          const response = yield _this5._httpWrapper.sendRequest("get", "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd");
          if (response && response["avalanche-2"] && response["avalanche-2"].usd) {
            return response["avalanche-2"].usd;
          }
        } catch (error) {
          console.warn("CoinGecko API failed:", error);
        }
        return 0;
      } catch (error) {
        console.error("Error getting AVAX price:", error);
        return 0;
      }
    })();
  }
  getWalletDetails(address) {
    var _this6 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const url = `${_this6._baseUrl}/api/avalanche/address/${address}`;
        return yield _this6._httpWrapper.sendRequest("get", url, {}).then(response => response).catch(() => _this6._defaultResponse());
      } catch (error) {
        console.error("Exception in Avalanche getWalletDetails:", error);
        return Promise.resolve(_this6._defaultResponse());
      }
    })();
  }
  requestTransactionDetails(transactionHash) {
    var _this7 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      return _this7._httpWrapper.sendRequest("get", `${_this7._baseUrl}/api/avalanche/transaction/${transactionHash}`);
    })();
  }
  requestTransactionHistory(address, pagination) {
    var _this8 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const url = `${_this8._baseUrl}/api/avalanche/address/${address}/transactions`;
        const params = {
          page: pagination.page,
          show: pagination.show || 25
        };
        return yield _this8._httpWrapper.sendRequest("get", url, params).then(response => response).catch(() => ({
          data: []
        }));
      } catch (error) {
        console.error("Exception in Avalanche requestTransactionHistory:", error);
        return Promise.resolve({
          data: []
        });
      }
    })();
  }
  sendTransaction(params) {
    var _this9 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!params.privateKey) throw new Error("Private key is required for Avalanche transactions");
      let result;
      if (params.tokenAddress) {
        result = yield _this9._sendERC20Transaction(params.value, params.privateKey, params.to, params.tokenAddress);
      } else {
        result = yield _this9._sendNativeTransaction(params.value, params.privateKey, params.to);
      }
      return {
        hash: result.transactionHash || result.hash,
        status: "pending"
      };
    })();
  }
  static ɵfac = function AvaxService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AvaxService)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_http_wrapper_service__WEBPACK_IMPORTED_MODULE_5__.HttpWrapperService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](app_services_rpc_provider_service__WEBPACK_IMPORTED_MODULE_6__.RpcProviderService));
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({
    token: AvaxService,
    factory: AvaxService.ɵfac,
    providedIn: "root"
  });
}

/***/ }

}]);
//# sourceMappingURL=default-src_app_services_avax_service_ts.js.map