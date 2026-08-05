"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_zelf-keys_zelf-keys-billing_zelf-keys-billing_component_ts"],{

/***/ 74877
/*!*********************************************!*\
  !*** ./src/app/services/billing.service.ts ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BillingService: () => (/* binding */ BillingService)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../environments/environment */ 45312);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _http_wrapper_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../http-wrapper.service */ 84099);
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./auth.service */ 44796);






class BillingService {
  _httpWrapper;
  _authService;
  baseUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl;
  _currentPlan = "free";
  _currentPlan$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
  constructor(_httpWrapper, _authService) {
    this._httpWrapper = _httpWrapper;
    this._authService = _authService;
  }
  get currentPlan$() {
    return this._currentPlan$.asObservable();
  }
  get currentPlan() {
    return this._currentPlan;
  }
  set currentPlan(plan) {
    this._currentPlan = plan;
    this._currentPlan$.next(plan);
  }
  /**
   * Get available subscription plans
   * @returns Promise with the list of available plans
   */
  getAvailablePlans() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      return _this._httpWrapper.sendRequest("get", `${_this.baseUrl}/api/subscription/plans`);
    })();
  }
  /**
   * Get active subscription for the current user
   * @returns Promise with the active subscription data
   */
  getActiveSubscription() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const apiKeysSessionJWT = yield _this2._authService.checkAccessToken();
      return _this2._httpWrapper.sendRequest("get", `${_this2.baseUrl}/api/subscription/active`, null, {
        headers: {
          Authorization: `Bearer ${apiKeysSessionJWT}`
        }
      });
    })();
  }
  /**
   * Initialize current plan based on active subscription
   * This method should be called when the app starts to set the correct current plan
   */
  initializeCurrentPlan() {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const response = yield _this3.getActiveSubscription();
        if (response.success && response.data) {
          const subscription = response.data;
          // Check for crypto payment first
          if (subscription.paymentMethod === "crypto" && subscription.cryptoData) {
            _this3.currentPlan = subscription.cryptoData.plan || "basic";
          }
          // Check for Stripe payment
          else if (subscription.paymentMethod === "stripe" && subscription.stripeData) {
            const stripeData = subscription.stripeData;
            if (stripeData.plan) {
              // For now, we'll set it to a default premium plan
              // In a real implementation, you'd want to map the Stripe price ID to the actual plan ID
              _this3.currentPlan = "pro"; // or "basic" or "enterprise" based on the price ID
            } else {
              _this3.currentPlan = "free";
            }
          }
          // Check for RevenueCat payment
          else if (subscription.paymentMethod === "revenuecat" && subscription.revenueCatData) {
            // RevenueCat subscriptions - get plan from entitlement_ids
            const plan = subscription.revenueCatData.plan || "pro"; // Default to "pro" if not found
            _this3.currentPlan = plan;
          }
          // Fallback for other payment methods or missing data
          else {
            _this3.currentPlan = "free";
          }
        } else {
          _this3.currentPlan = "free";
        }
      } catch (error) {
        _this3.currentPlan = "free";
      }
    })();
  }
  /**
   * Create a Stripe checkout session
   * @param planId - The ID of the plan to subscribe to
   * @returns Promise with the checkout session data
   */
  createCheckoutSession(planId) {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const apiKeysSessionJWT = yield _this4._authService.checkAccessToken();
      return _this4._httpWrapper.sendRequest("post", `${_this4.baseUrl}/api/subscription/checkout`, {
        planId: planId
      }, {
        headers: {
          Authorization: `Bearer ${apiKeysSessionJWT}`
        }
      });
    })();
  }
  /**
   * Cancel the current subscription
   * @returns Promise with the cancellation result
   */
  cancelSubscription() {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const apiKeysSessionJWT = yield _this5._authService.checkAccessToken();
      return _this5._httpWrapper.sendRequest("post", `${_this5.baseUrl}/api/subscription/cancel`, null, {
        headers: {
          Authorization: `Bearer ${apiKeysSessionJWT}`
        }
      });
    })();
  }
  /**
   * Create Stripe customer portal session for subscription management
   * @returns Promise with the portal session data
   */
  createCustomerPortalSession() {
    var _this6 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const apiKeysSessionJWT = yield _this6._authService.checkAccessToken();
      return _this6._httpWrapper.sendRequest("post", `${_this6.baseUrl}/api/subscription/portal`, null, {
        headers: {
          Authorization: `Bearer ${apiKeysSessionJWT}`
        }
      });
    })();
  }
  /**
   * Create crypto payment for subscription
   * @param planId - The ID of the plan to subscribe to
   * @returns Promise with the crypto payment data
   */
  createCryptoPayment(planId) {
    var _this7 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const apiKeysSessionJWT = yield _this7._authService.checkAccessToken();
      return _this7._httpWrapper.sendRequest("post", `${_this7.baseUrl}/api/subscription/crypto-payment`, {
        planId: planId
      }, {
        headers: {
          Authorization: `Bearer ${apiKeysSessionJWT}`
        }
      });
    })();
  }
  /**
   * Check crypto payment status
   * @param paymentId - The payment ID (IPFS hash)
   * @returns Promise with payment status
   */
  checkCryptoPaymentStatus(paymentId) {
    var _this8 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const apiKeysSessionJWT = yield _this8._authService.checkAccessToken();
      return _this8._httpWrapper.sendRequest("get", `${_this8.baseUrl}/api/subscription/crypto-payment-status/${paymentId}`, null, {
        headers: {
          Authorization: `Bearer ${apiKeysSessionJWT}`
        }
      });
    })();
  }
  /**
   * Confirm crypto payment by checking blockchain transactions
   * @param lockedPriceToken - The JWT token containing payment details
   * @returns Promise with payment confirmation result
   */
  confirmCryptoPayment(lockedPriceToken) {
    var _this9 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const apiKeysSessionJWT = yield _this9._authService.checkAccessToken();
      return _this9._httpWrapper.sendRequest("post", `${_this9.baseUrl}/api/subscription/confirm-crypto-payment`, {
        lockedPriceToken: lockedPriceToken
      }, {
        headers: {
          Authorization: `Bearer ${apiKeysSessionJWT}`
        }
      });
    })();
  }
  /**
   * Transform API plans to pricing plans with additional UI properties
   * @param apiPlans - Plans from the API
   * @returns Transformed pricing plans
   */
  transformApiPlansToPricingPlans(apiPlans) {
    return apiPlans.map(plan => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      currency: plan.currency.toUpperCase(),
      interval: plan.interval,
      description: plan.description,
      features: this.getPlanFeatures(plan.id),
      buttonText: this.getPlanButtonText(plan.id),
      buttonClass: this.getPlanButtonClass(plan.id),
      isPopular: plan.id === "pro",
      isCurrent: false,
      // Will be updated based on current subscription
      priceId: plan.priceId // Pass through Stripe price ID
    }));
  }
  /**
   * Get features for a specific plan
   * @param planId - The plan ID
   * @returns Array of feature strings
   */
  getPlanFeatures(planId) {
    const featuresMap = {
      basic: ["Up to 20 new encryptions every month", "Community support"],
      pro: ["Up to 50 new encryptions every month", "Priority support"],
      enterprise: ["Up to 100 new encryptions every month", "24/7 premium support"]
    };
    return featuresMap[planId] || [];
  }
  /**
   * Get button text for a specific plan
   * @param planId - The plan ID
   * @returns Button text string
   */
  getPlanButtonText(planId) {
    const buttonTextMap = {
      basic: "Get Basic",
      pro: "Get Pro",
      enterprise: "Get Enterprise"
    };
    return buttonTextMap[planId] || "Get Plan";
  }
  /**
   * Get button CSS class for a specific plan
   * @param planId - The plan ID
   * @returns CSS class string
   */
  getPlanButtonClass(planId) {
    const buttonClassMap = {
      basic: "upgrade-button",
      pro: "upgrade-button pro",
      enterprise: "upgrade-button enterprise"
    };
    return buttonClassMap[planId] || "upgrade-button";
  }
  static ɵfac = function BillingService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || BillingService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_http_wrapper_service__WEBPACK_IMPORTED_MODULE_4__.HttpWrapperService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_auth_service__WEBPACK_IMPORTED_MODULE_5__.AuthService));
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
    token: BillingService,
    factory: BillingService.ɵfac,
    providedIn: "root"
  });
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

/***/ },

/***/ 80705
/*!****************************************************************************!*\
  !*** ./src/app/zelf-keys/zelf-keys-billing/zelf-keys-billing.component.ts ***!
  \****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZelfKeysBillingComponent: () => (/* binding */ ZelfKeysBillingComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/progress-spinner */ 41134);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var _shared_types_wallet_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @shared/types/wallet.types */ 56169);
/* harmony import */ var app_tags_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! app/tags.service */ 73768);
/* harmony import */ var app_zelf_loader_zelf_loader_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! app/zelf-loader/zelf-loader.component */ 40152);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var app_asset_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! app/asset.service */ 25931);
/* harmony import */ var app_services_avax_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! app/services/avax.service */ 12560);
/* harmony import */ var _services_billing_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../services/billing.service */ 74877);
/* harmony import */ var app_chrome_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! app/chrome.service */ 85043);
/* harmony import */ var app_services_network_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! app/services/network.service */ 32404);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var app_transaction_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! app/transaction.service */ 65443);
/* harmony import */ var _wallet_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../wallet.service */ 69556);





















const _c0 = a0 => ({
  discount: a0
});
function ZelfKeysBillingComponent_div_0_zelf_loader_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](0, "zelf-loader", 10);
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("diameter", 120);
  }
}
function ZelfKeysBillingComponent_div_0_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 11)(1, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](2, "svg", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](3, "path", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "p", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](6, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysBillingComponent_div_0_div_3_Template_button_click_6_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.retryLoadPlans());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.error);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("zelf_keys.billing_ui.error.try_again"));
  }
}
function ZelfKeysBillingComponent_div_0_div_4__svg_svg_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "svg", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "path", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ZelfKeysBillingComponent_div_0_div_4__svg_svg_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "svg", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "path", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ZelfKeysBillingComponent_div_0_div_4_span_33_span_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("billing.subscription.demo"));
  }
}
function ZelfKeysBillingComponent_div_0_div_4_span_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "svg", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "circle", 44)(3, "path", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](5, ZelfKeysBillingComponent_div_0_div_4_span_33_span_5_Template, 2, 1, "span", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    let tmp_6_0;
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", t_r3("billing.subscription.payment_method_crypto"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", (tmp_6_0 = ctx_r1.getCryptoData()) == null ? null : tmp_6_0.isDemoMode);
  }
}
function ZelfKeysBillingComponent_div_0_div_4_span_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "svg", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "rect", 49)(3, "line", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", t_r3("billing.subscription.payment_method_stripe"), " ");
  }
}
function ZelfKeysBillingComponent_div_0_div_4_span_35_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "svg", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "path", 52)(3, "path", 53)(4, "path", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](5, " RevenueCat ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ZelfKeysBillingComponent_div_0_div_4_div_42_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 29)(1, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "div", 31)(4, "div", 55)(5, "a", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](7, "slice");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](8, "slice");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](9, "svg", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](10, "path", 58)(11, "polyline", 59)(12, "line", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    let tmp_7_0;
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("billing.subscription.transaction"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("href", ctx_r1.getTransactionUrl(), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate2"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind3"](7, 4, (tmp_7_0 = ctx_r1.getCryptoData()) == null ? null : tmp_7_0.transactionHash, 0, 10), "...", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind2"](8, 8, (tmp_7_0 = ctx_r1.getCryptoData()) == null ? null : tmp_7_0.transactionHash, -8), " ");
  }
}
function ZelfKeysBillingComponent_div_0_div_4_div_63_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 29)(1, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "div", 31)(4, "div", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](6, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("billing.subscription.cancelled_on"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind2"](6, 2, ctx_r1.activeSubscription.stripeData.cancelledAt, "medium"), " ");
  }
}
function ZelfKeysBillingComponent_div_0_div_4_div_65_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 62)(1, "div", 21)(2, "h4", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "div", 27)(5, "button", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysBillingComponent_div_0_div_4_div_65_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.openCustomerPortal());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](6, "svg", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](7, "path", 65)(8, "path", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](10, "p", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("billing.subscription.manage_subscription"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", t_r3("billing.subscription.manage_subscription"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.getManagementNote());
  }
}
function ZelfKeysBillingComponent_div_0_div_4_div_66_small_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "small", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ctx_r1.getTransactionVerifiedText(), " ");
  }
}
function ZelfKeysBillingComponent_div_0_div_4_div_66_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 62)(1, "div", 21)(2, "h4", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "div", 27)(5, "div", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](6, "svg", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](7, "circle", 44)(8, "path", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](9, "div", 71)(10, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](12, ZelfKeysBillingComponent_div_0_div_4_div_66_small_12_Template, 2, 1, "small", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    let tmp_7_0;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.getCryptoSubscriptionTitle());
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.getCryptoSubscriptionInfo());
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", (tmp_7_0 = ctx_r1.getCryptoData()) == null ? null : tmp_7_0.transactionHash);
  }
}
function ZelfKeysBillingComponent_div_0_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 17)(1, "div", 18)(2, "div", 19)(3, "div", 20)(4, "div", 21)(5, "h4", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](7, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](8, ZelfKeysBillingComponent_div_0_div_4__svg_svg_8_Template, 2, 0, "svg", 24)(9, ZelfKeysBillingComponent_div_0_div_4__svg_svg_9_Template, 2, 0, "svg", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](10, "span", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](12, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](13, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](14, "div", 27)(15, "div", 28)(16, "div", 29)(17, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](19, "div", 31)(20, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](21);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](22, "div", 29)(23, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](25, "div", 31)(26, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](27);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](28, "div", 29)(29, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](31, "div", 31)(32, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](33, ZelfKeysBillingComponent_div_0_div_4_span_33_Template, 6, 2, "span", 33)(34, ZelfKeysBillingComponent_div_0_div_4_span_34_Template, 5, 1, "span", 34)(35, ZelfKeysBillingComponent_div_0_div_4_span_35_Template, 6, 0, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](36, "div", 29)(37, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](38);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](39, "div", 31)(40, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](41);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](42, ZelfKeysBillingComponent_div_0_div_4_div_42_Template, 13, 11, "div", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](43, "div", 29)(44, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](45);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](46, "div", 31)(47, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](48);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](49, "div", 29)(50, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](51);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](52, "div", 31)(53, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](54);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](55, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](56, "div", 29)(57, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](58);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](59, "div", 31)(60, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](61);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](62, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](63, ZelfKeysBillingComponent_div_0_div_4_div_63_Template, 7, 5, "div", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](64, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](65, ZelfKeysBillingComponent_div_0_div_4_div_65_Template, 12, 3, "div", 38)(66, ZelfKeysBillingComponent_div_0_div_4_div_66_Template, 13, 3, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    let tmp_21_0;
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.getCurrentPlanName());
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassProp"]("billing__subscription-status--cancelled", ctx_r1.isCancelledActive());
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx_r1.isCancelledActive());
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.isCancelledActive());
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ctx_r1.isCancelledActive() ? _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](12, 32, t_r3("billing.subscription.cancelled_active")) : _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](13, 34, t_r3("billing.subscription.active_subscription")), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("billing.subscription.plan"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.getCurrentPlanName());
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("billing.subscription.price"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.getCurrentPlanPrice());
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("billing.subscription.payment_method"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", (ctx_r1.activeSubscription == null ? null : ctx_r1.activeSubscription.paymentMethod) === "crypto");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", (ctx_r1.activeSubscription == null ? null : ctx_r1.activeSubscription.paymentMethod) === "stripe");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", (ctx_r1.activeSubscription == null ? null : ctx_r1.activeSubscription.paymentMethod) === "revenuecat");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("billing.subscription.status"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassProp"]("billing__status-active", !ctx_r1.isCancelledActive())("billing__status-cancelled", ctx_r1.isCancelledActive());
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ctx_r1.getSubscriptionStatus(), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", (ctx_r1.activeSubscription == null ? null : ctx_r1.activeSubscription.paymentMethod) === "crypto" && ((tmp_21_0 = ctx_r1.getCryptoData()) == null ? null : tmp_21_0.transactionHash));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("billing.subscription.zelf_name"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", (ctx_r1.activeSubscription == null ? null : ctx_r1.activeSubscription.zelfName) || t_r3("zelf_keys.billing_ui.plan.not_available"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("billing.subscription.start_date"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind2"](55, 36, ctx_r1.activeSubscription == null ? null : ctx_r1.activeSubscription.startDate, "medium"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.getEndDateLabel());
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassProp"]("billing__status-cancelled", ctx_r1.isCancelledActive());
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind2"](62, 39, ctx_r1.activeSubscription == null ? null : ctx_r1.activeSubscription.endDate, "medium"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.isCancelledActive() && (ctx_r1.activeSubscription == null ? null : ctx_r1.activeSubscription.stripeData == null ? null : ctx_r1.activeSubscription.stripeData.cancelledAt));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", (ctx_r1.activeSubscription == null ? null : ctx_r1.activeSubscription.paymentMethod) === "stripe");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", (ctx_r1.activeSubscription == null ? null : ctx_r1.activeSubscription.paymentMethod) === "crypto");
  }
}
function ZelfKeysBillingComponent_div_0_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 74)(1, "div", 75)(2, "div", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "svg", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](4, "path", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](5, "h2", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](7, "p", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](9, "zelf-loader", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("billing.activation.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.activationMessage);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("diameter", 40);
  }
}
function ZelfKeysBillingComponent_div_0_div_6_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 106);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", t_r3("zelf_keys.billing_ui.crypto.demo_banner"), " ");
  }
}
function ZelfKeysBillingComponent_div_0_div_6_span_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.originalAmount == null ? null : ctx_r1.cryptoPaymentData.originalAmount.avax);
  }
}
function ZelfKeysBillingComponent_div_0_div_6_span_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.amount);
  }
}
function ZelfKeysBillingComponent_div_0_div_6_div_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 107)(1, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "div", 31)(4, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](6, "div", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](8, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", t_r3("zelf_keys.billing_ui.crypto.demo_discount", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction1"](6, _c0, ctx_r1.getDemoDiscount())), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"]("", ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.amount, " AVAX");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"]("~$", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind2"](8, 3, ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.usdAmount, "1.2-4"));
  }
}
function ZelfKeysBillingComponent_div_0_div_6_span_30_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.amount);
  }
}
function ZelfKeysBillingComponent_div_0_div_6_span_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.amount);
  }
}
function ZelfKeysBillingComponent_div_0_div_6_div_39_div_16_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 121);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysBillingComponent_div_0_div_6_div_39_div_16_button_1_Template_button_click_0_listener() {
      const wallet_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r7).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](5);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.selectWallet(wallet_r8));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const wallet_r8 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassProp"]("billing__wallet-menu-item--selected", ctx_r1.selectedWallet === wallet_r8);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ctx_r1.getWalletDisplayName(wallet_r8), " ");
  }
}
function ZelfKeysBillingComponent_div_0_div_6_div_39_div_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 119);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](1, ZelfKeysBillingComponent_div_0_div_6_div_39_div_16_button_1_Template, 2, 3, "button", 120);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngForOf", ctx_r1.wallets);
  }
}
function ZelfKeysBillingComponent_div_0_div_6_div_39_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 62)(1, "div", 21)(2, "h4", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "div", 27)(5, "div", 108)(6, "label", 109);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](8, "div", 110)(9, "div", 111)(10, "button", 112);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysBillingComponent_div_0_div_6_div_39_Template_button_click_10_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.toggleWalletMenu());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](11, "span", 113);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](13, "div", 114);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](14, "svg", 115);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](15, "path", 116);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](16, ZelfKeysBillingComponent_div_0_div_6_div_39_div_16_Template, 2, 1, "div", 117);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](17, "button", 118);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysBillingComponent_div_0_div_6_div_39_Template_button_click_17_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.payWithAvax());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("zelf_keys.billing_ui.crypto.pay_with_wallet"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", t_r3("zelf_keys.billing_ui.crypto.domain_label"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵattribute"]("aria-expanded", ctx_r1.showWalletMenu)("aria-haspopup", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ctx_r1.selectedWallet ? ctx_r1.getWalletDisplayName(ctx_r1.selectedWallet) : t_r3("zelf_keys.billing_ui.crypto.select_wallet"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassProp"]("billing__wallet-trigger-icon--open", ctx_r1.showWalletMenu);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.showWalletMenu);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", t_r3("zelf_keys.billing_ui.crypto.pay_with_avax"), " ");
  }
}
function ZelfKeysBillingComponent_div_0_div_6_ng_container_53_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainer"](0);
  }
}
function ZelfKeysBillingComponent_div_0_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 80)(1, "div", 18)(2, "div", 19)(3, "div", 20)(4, "div", 21)(5, "h4", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](7, "div", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](8, ZelfKeysBillingComponent_div_0_div_6_div_8_Template, 2, 1, "div", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](9, "div", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](11, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](12, "div", 27)(13, "div", 28)(14, "div", 29)(15, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](17, "div", 31)(18, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](19, ZelfKeysBillingComponent_div_0_div_6_span_19_Template, 2, 1, "span", 84)(20, ZelfKeysBillingComponent_div_0_div_6_span_20_Template, 2, 1, "span", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](21, " AVAX ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](22, "div", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](24, ZelfKeysBillingComponent_div_0_div_6_div_24_Template, 9, 8, "div", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](25, "div", 87)(26, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](27);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](28, "div", 31)(29, "div", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](30, ZelfKeysBillingComponent_div_0_div_6_span_30_Template, 2, 1, "span", 84)(31, ZelfKeysBillingComponent_div_0_div_6_span_31_Template, 2, 1, "span", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](32, " AVAX ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](33, "div", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](34);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](35, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](36, "div", 90)(37, "h3", 91);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](38);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](39, ZelfKeysBillingComponent_div_0_div_6_div_39_Template, 19, 9, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](40, "div", 62)(41, "div", 21)(42, "h4", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](43);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](44, "div", 27)(45, "div", 92)(46, "div", 93)(47, "div", 94)(48, "p", 95);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](50, "p", 96);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](51);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](52, "button", 97);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysBillingComponent_div_0_div_6_Template_button_click_52_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.copyPaymentAddress());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](53, ZelfKeysBillingComponent_div_0_div_6_ng_container_53_Template, 1, 0, "ng-container", 98);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](54, "div", 62)(55, "div", 21)(56, "h4", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](57);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](58, "div", 27)(59, "div", 99)(60, "div", 100);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](61, "img", 101);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](62, "div", 102)(63, "div", 21)(64, "h4", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](65);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](66, "div", 27)(67, "div", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](68);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](69, "zelf-loader", 103);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](70, "div", 104)(71, "button", 105);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysBillingComponent_div_0_div_6_Template_button_click_71_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.cancelCryptoPayment());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](72);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const clipboardIcon_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵreference"](9);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.selectedPlan == null ? null : ctx_r1.cryptoPaymentData.selectedPlan.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.isDemoMode);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate2"](" ", t_r3("zelf_keys.billing_ui.crypto.price_lock"), " \u2022 1 AVAX = $", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind2"](11, 29, ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.avaxPrice, "1.2-2"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("billing.subscription.plan"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.originalAmount);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !(ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.originalAmount));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassProp"]("billing__receipt-secondary--discounted", (ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.isDemoMode) && (ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.originalAmount));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" $", ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.selectedPlan == null ? null : ctx_r1.cryptoPaymentData.selectedPlan.price, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", (ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.isDemoMode) && (ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.originalAmount));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("common.amount"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", (ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.isDemoMode) && (ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.originalAmount));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !(ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.isDemoMode) || !(ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.originalAmount));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ~$", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind2"](35, 32, ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.usdAmount, "1.2-4"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("zelf_keys.billing_ui.crypto.payment_methods"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.wallets && ctx_r1.wallets.length > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("zelf_keys.billing_ui.crypto.copy_address"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("zelf_keys.billing_ui.crypto.payment_address_label"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.cryptoPaymentData == null ? null : ctx_r1.cryptoPaymentData.paymentAddress);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngTemplateOutlet", clipboardIcon_r9);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("zelf_keys.billing_ui.crypto.scan_address"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("src", ctx_r1.generatePaymentQR(), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵsanitizeUrl"])("alt", t_r3("zelf_keys.billing_ui.crypto.payment_qr_code_alt"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("zelf_keys.billing_ui.crypto.waiting_confirmation"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("zelf_keys.billing_ui.crypto.auto_update_note"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("absolute", false)("diameter", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", t_r3("zelf_keys.billing_ui.crypto.cancel_payment"), " ");
  }
}
function ZelfKeysBillingComponent_div_0_div_7_div_7_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 142);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("zelf_keys.billing_ui.plan.popular_badge"));
  }
}
function ZelfKeysBillingComponent_div_0_div_7_div_7_div_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 143);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "svg", 144);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "path", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "span", 145);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const feature_r10 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](feature_r10);
  }
}
function ZelfKeysBillingComponent_div_0_div_7_div_7_div_17_mat_spinner_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](0, "mat-spinner", 151);
  }
}
function ZelfKeysBillingComponent_div_0_div_7_div_7_div_17__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "svg", 152);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "rect", 49)(2, "line", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ZelfKeysBillingComponent_div_0_div_7_div_7_div_17_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](4).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("zelf_keys.billing_ui.plan.pay_with_stripe"));
  }
}
function ZelfKeysBillingComponent_div_0_div_7_div_7_div_17_mat_spinner_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](0, "mat-spinner", 151);
  }
}
function ZelfKeysBillingComponent_div_0_div_7_div_7_div_17__svg_svg_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "svg", 152);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "circle", 44)(2, "path", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ZelfKeysBillingComponent_div_0_div_7_div_7_div_17_span_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](4).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("zelf_keys.billing_ui.plan.pay_with_crypto"));
  }
}
function ZelfKeysBillingComponent_div_0_div_7_div_7_div_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 146)(1, "button", 147);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysBillingComponent_div_0_div_7_div_7_div_17_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r11);
      const plan_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.selectPlan(plan_r12.id, "stripe"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](2, ZelfKeysBillingComponent_div_0_div_7_div_7_div_17_mat_spinner_2_Template, 1, 0, "mat-spinner", 148)(3, ZelfKeysBillingComponent_div_0_div_7_div_7_div_17__svg_svg_3_Template, 3, 0, "svg", 149)(4, ZelfKeysBillingComponent_div_0_div_7_div_7_div_17_span_4_Template, 2, 1, "span", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](5, "button", 150);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysBillingComponent_div_0_div_7_div_7_div_17_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r11);
      const plan_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.selectPlan(plan_r12.id, "crypto"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](6, ZelfKeysBillingComponent_div_0_div_7_div_7_div_17_mat_spinner_6_Template, 1, 0, "mat-spinner", 148)(7, ZelfKeysBillingComponent_div_0_div_7_div_7_div_17__svg_svg_7_Template, 3, 0, "svg", 149)(8, ZelfKeysBillingComponent_div_0_div_7_div_7_div_17_span_8_Template, 2, 1, "span", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const plan_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("disabled", ctx_r1.isAnyPaymentLoading());
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.isPaymentLoading(plan_r12.id, "stripe"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx_r1.isPaymentLoading(plan_r12.id, "stripe"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx_r1.isPaymentLoading(plan_r12.id, "stripe"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("disabled", ctx_r1.isAnyPaymentLoading());
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.isPaymentLoading(plan_r12.id, "crypto"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx_r1.isPaymentLoading(plan_r12.id, "crypto"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx_r1.isPaymentLoading(plan_r12.id, "crypto"));
  }
}
function ZelfKeysBillingComponent_div_0_div_7_div_7_button_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 153);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const plan_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ctx_r1.getPlanButtonText(plan_r12), " ");
  }
}
function ZelfKeysBillingComponent_div_0_div_7_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 128)(1, "div", 129)(2, "div", 130);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](4, ZelfKeysBillingComponent_div_0_div_7_div_7_div_4_Template, 2, 1, "div", 131);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](5, "div", 132)(6, "div", 133)(7, "span", 134);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](8, "$");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](9, "span", 135);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](11, "span", 136);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](13, "div", 137);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](15, "div", 138);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](16, ZelfKeysBillingComponent_div_0_div_7_div_7_div_16_Template, 5, 1, "div", 139);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](17, ZelfKeysBillingComponent_div_0_div_7_div_7_div_17_Template, 9, 8, "div", 140)(18, ZelfKeysBillingComponent_div_0_div_7_div_7_button_18_Template, 2, 1, "button", 141);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const plan_r12 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassProp"]("billing__pricing-card--popular", plan_r12.isPopular)("billing__pricing-card--current", plan_r12.isCurrent);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](plan_r12.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", plan_r12.isPopular);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](plan_r12.price);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"]("/", plan_r12.interval);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](plan_r12.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngForOf", plan_r12.features);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !plan_r12.isCurrent);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", plan_r12.isCurrent);
  }
}
function ZelfKeysBillingComponent_div_0_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 122)(1, "div", 123)(2, "h1", 124);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "p", 125);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](6, "div", 126);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](7, ZelfKeysBillingComponent_div_0_div_7_div_7_Template, 19, 12, "div", 127);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("zelf_keys.billing_ui.choose_your_plan_title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("zelf_keys.billing_ui.choose_your_plan_subtitle"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngForOf", ctx_r1.plans);
  }
}
function ZelfKeysBillingComponent_div_0_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "svg", 154);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "path", 155);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ZelfKeysBillingComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 2)(1, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](2, ZelfKeysBillingComponent_div_0_zelf_loader_2_Template, 1, 1, "zelf-loader", 4)(3, ZelfKeysBillingComponent_div_0_div_3_Template, 8, 2, "div", 5)(4, ZelfKeysBillingComponent_div_0_div_4_Template, 67, 42, "div", 6)(5, ZelfKeysBillingComponent_div_0_div_5_Template, 10, 3, "div", 7)(6, ZelfKeysBillingComponent_div_0_div_6_Template, 73, 35, "div", 8)(7, ZelfKeysBillingComponent_div_0_div_7_Template, 8, 3, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](8, ZelfKeysBillingComponent_div_0_ng_template_8_Template, 2, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.loadingPlans || ctx_r1.loadingCurrentPlan);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.error && !ctx_r1.loadingPlans && !ctx_r1.loadingCurrentPlan);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx_r1.loadingPlans && !ctx_r1.loadingCurrentPlan && !ctx_r1.error && ctx_r1.hasActiveSubscription);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.showActivationMessage);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx_r1.loading && !ctx_r1.error && ctx_r1.showCryptoPayment && !ctx_r1.showActivationMessage);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx_r1.loading && !ctx_r1.error && !ctx_r1.hasActiveSubscription && !ctx_r1.showCryptoPayment);
  }
}
class ZelfKeysBillingComponent {
  _assetService;
  _avaxService;
  _billingService;
  _changeDetectorRef;
  _chromeService;
  _networkService;
  _router;
  _transactionService;
  _translocoService;
  _walletService;
  activationMessage = "";
  activeSubscription = null;
  cryptoPaymentData = null;
  currentPlan = "free";
  error = null;
  hasActiveSubscription = false;
  loading = true;
  loadingAvaxPayment = false;
  loadingCurrentPlan = true;
  loadingPayment = null;
  loadingPlans = true;
  paymentPollingInterval = null;
  plans = [];
  redirectState = "";
  selectedWallet = null;
  shareables = null;
  showActivationMessage = false;
  showCryptoPayment = false;
  showWalletMenu = false;
  wallets = [];
  constructor(_assetService, _avaxService, _billingService, _changeDetectorRef, _chromeService, _networkService, _router, _transactionService, _translocoService, _walletService) {
    this._assetService = _assetService;
    this._avaxService = _avaxService;
    this._billingService = _billingService;
    this._changeDetectorRef = _changeDetectorRef;
    this._chromeService = _chromeService;
    this._networkService = _networkService;
    this._router = _router;
    this._transactionService = _transactionService;
    this._translocoService = _translocoService;
    this._walletService = _walletService;
    this.shareables = {
      wallet: {}
    };
  }
  ngOnInit() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this._setWallet();
      yield _this._loadWallets();
      _this._loadPlans();
      _this._loadCurrentPlan();
    })();
  }
  _setWallet() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const wallet = yield _this2._walletService.getFirstWalletFromStorage();
      if (!wallet?.name) {
        _this2._router.navigate(["/welcome"]);
        return;
      }
      _this2.shareables.wallet = wallet;
      _this2._changeDetectorRef.detectChanges();
    })();
  }
  _loadWallets() {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const {
        wallet,
        wallets
      } = yield _this3._walletService.getAllWalletsFromStorage();
      _this3.wallets = [wallet, ...wallets];
      _this3.selectedWallet = _this3.wallets[0];
      _this3._changeDetectorRef.detectChanges();
    })();
  }
  onDocumentClick(event) {
    const target = event.target;
    if (this.showWalletMenu && !target.closest(".billing__wallet-dropdown")) {
      this.closeWalletMenu();
    }
  }
  getWalletDisplayName(wallet) {
    if (!wallet) return "";
    return wallet.fullTagName || (wallet.domain ? `${wallet.tagName || wallet.name}.${wallet.domain}` : wallet.tagName || wallet.name || "");
  }
  toggleWalletMenu() {
    this.showWalletMenu = !this.showWalletMenu;
  }
  closeWalletMenu() {
    this.showWalletMenu = false;
  }
  selectWallet(wallet) {
    this.selectedWallet = wallet;
    this.closeWalletMenu();
  }
  _loadPlans() {
    this.error = null;
    this._billingService.getAvailablePlans().then(response => {
      this.loadingPlans = false;
      this.updateLoadingState();
      if (response.success && response.plans) {
        this.plans = this._billingService.transformApiPlansToPricingPlans(response.plans);
        return;
      }
      this.error = this._translocoService.translate("zelf_keys.billing_ui.error.load_plans");
    }).catch(error => {
      console.error("Error loading plans:", error);
      this.error = this._translocoService.translate("zelf_keys.billing_ui.error.load_plans");
      this.loadingPlans = false;
      this.updateLoadingState();
    });
  }
  _loadCurrentPlan() {
    this._billingService.getActiveSubscription().then(response => {
      this.loadingCurrentPlan = false;
      this.updateLoadingState();
      if (!response.success || !response.data) {
        this._billingService.currentPlan = "free";
        this.currentPlan = "free";
        this.hasActiveSubscription = false;
        this.activeSubscription = null;
        return;
      }
      this.hasActiveSubscription = true;
      this.activeSubscription = response.data;
      const subscription = response.data;
      let planId = null;
      if (subscription.paymentMethod === "crypto" && subscription.cryptoData) {
        planId = subscription.cryptoData.plan || "basic";
      } else if (subscription.paymentMethod === "stripe" && subscription.stripeData) {
        const stripeData = subscription.stripeData;
        if (stripeData.plan) {
          const currentPlan = this.plans.find(plan => plan.priceId === stripeData.plan);
          planId = currentPlan?.id || "basic";
        }
      } else if (subscription.paymentMethod === "revenuecat" && subscription.revenueCatData) {
        // RevenueCat subscriptions - get plan from revenueCatData
        planId = subscription.revenueCatData.plan || "pro";
      }
      if (planId) {
        this._billingService.currentPlan = planId;
        this.currentPlan = planId;
        this.plans = this.plans.map(plan => ({
          ...plan,
          isCurrent: plan.id === this.currentPlan
        }));
        return;
      }
      this._billingService.currentPlan = "free";
      this.currentPlan = "free";
    }).catch(() => {
      this._billingService.currentPlan = "free";
      this.currentPlan = "free";
      this.hasActiveSubscription = false;
      this.activeSubscription = null;
      this.loadingCurrentPlan = false;
      this.updateLoadingState();
    });
  }
  updateLoadingState() {
    this.loading = this.loadingPlans || this.loadingCurrentPlan;
  }
  retryLoadPlans() {
    this.loadingPlans = true;
    this.loadingCurrentPlan = true;
    this.loading = true;
    this.error = null;
    this._loadPlans();
    this._loadCurrentPlan();
  }
  selectPlan(planId, paymentMethod) {
    if (planId === this.currentPlan) return;
    if (this.loadingPayment) return;
    this.loadingPayment = {
      planId,
      method: paymentMethod
    };
    this.error = null;
    if (paymentMethod === "stripe") {
      this._createCheckoutSession(planId);
    } else if (paymentMethod === "crypto") {
      this._createCryptoPayment(planId);
    }
  }
  isPaymentLoading(planId, method) {
    return this.loadingPayment?.planId === planId && this.loadingPayment?.method === method;
  }
  isAnyPaymentLoading() {
    return this.loadingPayment !== null;
  }
  /**
   * Create crypto payment for the selected plan
   * @param planId - The ID of the plan to subscribe to
   */
  _createCryptoPayment(planId) {
    this._billingService.createCryptoPayment(planId).then(response => {
      this.loadingPayment = null;
      if (response.data && response.data.success && response.data.paymentAddress) {
        this.cryptoPaymentData = {
          planId,
          paymentAddress: response.data.paymentAddress,
          amount: response.data.amount,
          currency: response.data.currency,
          usdAmount: response.data.usdAmount,
          avaxPrice: response.data.avaxPrice,
          lockedPriceToken: response.data.lockedPriceToken,
          expiresAt: response.data.expiresAt,
          zkPay: response.data.zkPay,
          selectedPlan: this.plans.find(plan => plan.id === planId),
          isDemoMode: response.data.isDemoMode,
          originalAmount: response.data.originalAmount
        };
        this.showCryptoPayment = true;
        this.startPaymentMonitoring();
      } else {
        this.error = this._translocoService.translate("zelf_keys.billing_ui.error.create_crypto_payment");
      }
    }).catch(error => {
      console.error("Error creating crypto payment:", error);
      this.loadingPayment = null;
      this.error = this._translocoService.translate("zelf_keys.billing_ui.error.create_crypto_payment");
    });
  }
  /**
   * Start monitoring for crypto payment confirmation
   */
  startPaymentMonitoring() {
    if (this.paymentPollingInterval) {
      clearInterval(this.paymentPollingInterval);
    }
    // Check payment status every 30 seconds
    this.paymentPollingInterval = setInterval(() => {
      this.checkPaymentStatus();
    }, 30000);
    // Also check immediately
    this.checkPaymentStatus();
  }
  /**
   * Check if crypto payment has been confirmed
   */
  checkPaymentStatus() {
    if (!this.cryptoPaymentData?.lockedPriceToken) return;
    this._billingService.confirmCryptoPayment(this.cryptoPaymentData.lockedPriceToken).then(response => {
      if (response.success && response.paymentConfirmed) {
        this.stopPaymentMonitoring();
        // Show success message
        if (response.subscriptionCreated) {
          // Show activation message and loading
          this.showActivationMessage = true;
          this.activationMessage = this._translocoService.translate("billing.activation.message");
          setTimeout(() => {
            // Hide crypto payment interface
            this.showCryptoPayment = false;
            this.cryptoPaymentData = null;
            this.showActivationMessage = false;
            // Reload the whole component
            this.ngOnInit();
          }, 5000);
        }
      }
    }).catch(error => {
      console.error("Error checking payment status:", error);
    });
  }
  /**
   * Stop payment monitoring
   */
  stopPaymentMonitoring() {
    if (this.paymentPollingInterval) {
      clearInterval(this.paymentPollingInterval);
      this.paymentPollingInterval = null;
    }
  }
  /**
   * Cancel crypto payment and return to plan selection
   */
  cancelCryptoPayment() {
    this.stopPaymentMonitoring();
    this.showCryptoPayment = false;
    this.cryptoPaymentData = null;
  }
  /**
   * Go back to plan selection from crypto payment interface
   */
  goBackToPlans() {
    this.stopPaymentMonitoring();
    this.showCryptoPayment = false;
    this.cryptoPaymentData = null;
  }
  /**
   * Generate QR code data URL for the payment address
   * @returns string data URL for QR code
   */
  generatePaymentQR() {
    if (!this.cryptoPaymentData?.paymentAddress) return "";
    // For now, return a simple QR code URL (you can use a QR library later)
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${this.cryptoPaymentData.paymentAddress}`;
  }
  /**
   * Copy payment address to clipboard
   */
  copyPaymentAddress() {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this4.cryptoPaymentData?.paymentAddress) {
        yield _this4._chromeService.copyToClipboard(_this4.cryptoPaymentData.paymentAddress);
      }
    })();
  }
  /**
   * Calculate the demo discount percentage
   * @returns Discount percentage as a string
   */
  getDemoDiscount() {
    if (!this.cryptoPaymentData?.isDemoMode || !this.cryptoPaymentData?.originalAmount) {
      return "0";
    }
    const originalPrice = this.cryptoPaymentData.originalAmount.usd;
    const demoPrice = this.cryptoPaymentData.usdAmount;
    const discountPercentage = (originalPrice - demoPrice) / originalPrice * 100;
    return discountPercentage.toFixed(1);
  }
  /**
   * Get crypto payment data from active subscription
   * @returns Crypto payment data or null
   */
  getCryptoData() {
    if (this.activeSubscription?.paymentMethod === "crypto" && this.activeSubscription?.cryptoData) {
      try {
        return typeof this.activeSubscription.cryptoData === "string" ? JSON.parse(this.activeSubscription.cryptoData) : this.activeSubscription.cryptoData;
      } catch (error) {
        console.error("Error parsing crypto data:", error);
        return null;
      }
    }
    return null;
  }
  /**
   * Get subscription status based on payment method
   * @returns Status string
   */
  getSubscriptionStatus() {
    if (this.activeSubscription?.paymentMethod === "crypto") {
      const cryptoData = this.getCryptoData();
      return cryptoData?.status || this._translocoService.translate("billing.subscription.active");
    } else if (this.activeSubscription?.paymentMethod === "revenuecat") {
      // RevenueCat subscription status
      return this.isCancelledActive() ? this._translocoService.translate("billing.subscription.cancelled_active") : this.activeSubscription?.status || this._translocoService.translate("billing.subscription.active");
    } else {
      // Stripe subscription status
      return this.isCancelledActive() ? this._translocoService.translate("billing.subscription.cancelled_active") : this.activeSubscription?.stripeData?.status || this._translocoService.translate("billing.subscription.active");
    }
  }
  /**
   * Get transaction URL for blockchain explorer
   * @returns Transaction URL
   */
  getTransactionUrl() {
    const cryptoData = this.getCryptoData();
    if (cryptoData?.transactionHash) {
      return `https://snowtrace.io/tx/${cryptoData.transactionHash}`;
    }
    return "#";
  }
  /**
   * Get appropriate end date label based on payment method
   * @returns Label string
   */
  getEndDateLabel() {
    if (this.activeSubscription?.paymentMethod === "crypto") {
      return this._translocoService.translate("billing.subscription.expires_on");
    } else {
      return this.isCancelledActive() ? this._translocoService.translate("billing.subscription.access_ends") : this._translocoService.translate("billing.subscription.next_billing");
    }
  }
  /**
   * Get management note text based on subscription status
   * @returns Management note string
   */
  getManagementNote() {
    return this.isCancelledActive() ? this._translocoService.translate("billing.subscription.manage_note_cancelled") : this._translocoService.translate("billing.subscription.manage_note_active");
  }
  /**
   * Get crypto subscription info text
   * @returns Crypto info string
   */
  getCryptoSubscriptionInfo() {
    return this._translocoService.translate("billing.subscription.crypto_subscription_info");
  }
  /**
   * Get transaction verified text
   * @returns Transaction verified string
   */
  getTransactionVerifiedText() {
    return this._translocoService.translate("billing.subscription.transaction_verified");
  }
  /**
   * Get crypto subscription active title
   * @returns Crypto subscription title
   */
  getCryptoSubscriptionTitle() {
    return this._translocoService.translate("billing.subscription.crypto_subscription_title");
  }
  _createCheckoutSession(planId) {
    this._billingService.createCheckoutSession(planId).then(response => {
      this.loadingPayment = null;
      if (response.success && response.checkoutUrl) {
        window.open(response.checkoutUrl, "_blank");
        this.startSubscriptionPolling();
      } else {
        this.error = this._translocoService.translate("zelf_keys.billing_ui.error.create_checkout");
      }
    }).catch(error => {
      console.error("Error creating checkout session:", error);
      this.loadingPayment = null;
      this.error = this._translocoService.translate("zelf_keys.billing_ui.error.create_checkout");
    });
  }
  /**
   * Start polling for subscription status
   */
  startSubscriptionPolling() {
    this.loading = true; // Show loading indicator while polling
    // Clear any existing polling
    if (this.paymentPollingInterval) {
      clearInterval(this.paymentPollingInterval);
    }
    let attempts = 0;
    const maxAttempts = 60; // Poll for 2 minutes (every 2 seconds)
    this.paymentPollingInterval = setInterval(() => {
      attempts++;
      this._billingService.getActiveSubscription().then(response => {
        if (response.success && response.data) {
          // Subscription found!
          this.stopPaymentMonitoring();
          // Show activation message
          this.showActivationMessage = true;
          this.activationMessage = this._translocoService.translate("billing.activation.message");
          this.loadingPayment = null;
          setTimeout(() => {
            this.showActivationMessage = false;
            this.ngOnInit(); // Reload full state
          }, 3000);
        }
      }).catch(() => {
        // Ignore errors during polling, simply retry
      });
      if (attempts >= maxAttempts) {
        this.stopPaymentMonitoring();
        this.loading = false;
        this.loadingPayment = null;
        // Don't show error, just stop polling. User can refresh manually.
      }
    }, 2000); // Check every 2 seconds
  }
  getPlanButtonText(plan) {
    if (plan.isCurrent) {
      return this._translocoService.translate("zelf_keys.billing_ui.plan.current_plan");
    }
    return plan.buttonText;
  }
  getPlanButtonClass(plan) {
    if (plan.isCurrent) {
      return "current-plan";
    }
    return plan.buttonClass;
  }
  isPlanDisabled(plan) {
    return plan.isCurrent || false;
  }
  /**
   * Check if the subscription is cancelled but still active
   * @returns boolean indicating if subscription is cancelled but active
   */
  isCancelledActive() {
    if (!this.activeSubscription) return false;
    // Check RevenueCat subscription status
    if (this.activeSubscription.paymentMethod === "revenuecat") {
      return this.activeSubscription.status === "cancelled_active";
    }
    // Check Stripe subscription status
    if (this.activeSubscription.paymentMethod === "stripe") {
      const stripeStatus = this.activeSubscription.stripeData?.status === "cancelled_active";
      const cancelAtPeriodEnd = this.activeSubscription.stripeData?.cancelAtPeriodEnd === true;
      return stripeStatus || cancelAtPeriodEnd;
    }
    return false;
  }
  /**
   * Get the current plan details by matching with available plans
   * @returns PricingPlan object with name, price, etc.
   */
  getCurrentPlanDetails() {
    if (!this.activeSubscription || !this.plans.length) return null;
    // Try to match by price ID first (most reliable)
    const priceId = this.activeSubscription.stripeData?.plan;
    if (priceId) {
      const matchedPlan = this.plans.find(plan => plan.priceId === priceId);
      if (matchedPlan) return matchedPlan;
    }
    // Fallback: try to match by plan name from metadata
    const planName = this.activeSubscription.stripeData?.metadata?.plan;
    if (planName) {
      const matchedPlan = this.plans.find(plan => plan.id === planName);
      if (matchedPlan) return matchedPlan;
    }
    // Last fallback: return the current plan if marked as current
    const currentPlan = this.plans.find(plan => plan.isCurrent);
    return currentPlan || null;
  }
  /**
   * Get the display name for the current subscription plan
   * @returns string plan name
   */
  getCurrentPlanName() {
    const planDetails = this.getCurrentPlanDetails();
    if (planDetails) return planDetails.name;
    // Fallback to backend data
    return this.activeSubscription?.stripeData?.planName || this.activeSubscription?.name || this._translocoService.translate("zelf_keys.billing_ui.plan.premium_plan");
  }
  /**
   * Get the price for the current subscription plan
   * @returns string formatted price
   */
  getCurrentPlanPrice() {
    const planDetails = this.getCurrentPlanDetails();
    if (planDetails) return `$${planDetails.price}/${planDetails.interval}`;
    // Fallback to backend data (convert from cents if needed)
    const backendPrice = this.activeSubscription?.stripeData?.planPrice || this.activeSubscription?.stripeData?.amount;
    if (backendPrice) {
      const priceInDollars = backendPrice > 100 ? backendPrice / 100 : backendPrice;
      return `$${priceInDollars.toFixed(2)}/${this._translocoService.translate("zelf_keys.billing_ui.plan.month")}`;
    }
    return this._translocoService.translate("zelf_keys.billing_ui.plan.not_available");
  }
  /**
   * Prepare transaction data and navigate to send-confirm
   */
  payWithAvax() {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this5.loadingAvaxPayment) return;
      _this5.loadingAvaxPayment = true;
      if (!_this5.selectedWallet || !_this5.cryptoPaymentData?.paymentAddress || !_this5.cryptoPaymentData?.amount) {
        _this5.error = _this5._translocoService.translate("zelf_keys.billing_ui.error.missing_payment_data");
        _this5.loadingAvaxPayment = false;
        return;
      }
      try {
        const avaxAddress = _this5.selectedWallet.publicData?.ethAddress;
        if (!avaxAddress) {
          _this5.error = _this5._translocoService.translate("zelf_keys.billing_ui.error.no_avax_address");
          _this5.loadingAvaxPayment = false;
          return;
        }
        let avaxToken = yield _this5._networkService.getNetworkToken("avalanche");
        // Fallback if not cached
        if (!avaxToken) {
          try {
            const response = yield _this5._avaxService.getWalletDetails(avaxAddress);
            const result = yield _this5._assetService.processTokensFromResponse({
              avalanche: response
            });
            avaxToken = result.tokens.find(token => token.name.toLowerCase() === "avalanche");
          } catch (error) {
            avaxToken = null;
          }
        }
        if (!avaxToken) {
          _this5.error = _this5._translocoService.translate("zelf_keys.billing_ui.error.no_avax_token");
          _this5.loadingAvaxPayment = false;
          return;
        }
        // Prepare transaction data
        const transactionData = new _shared_types_wallet_types__WEBPACK_IMPORTED_MODULE_6__.TransactionData({
          amount: String(_this5.cryptoPaymentData.amount),
          token: {
            ...avaxToken,
            network: "avalanche",
            symbol: "AVAX",
            tokenType: "AVAX"
          },
          sender: {
            address: avaxAddress,
            domain: _this5.selectedWallet.domain || "",
            fullTagName: _this5.selectedWallet.fullTagName || "",
            tagName: _this5.selectedWallet.tagName || _this5.selectedWallet.name || ""
          },
          receiver: {
            address: _this5.cryptoPaymentData.paymentAddress
          }
        });
        if (_this5.selectedWallet && (_this5.selectedWallet.tagName || _this5.selectedWallet.name)) {
          yield _this5._walletService.switchWallet(new app_tags_service__WEBPACK_IMPORTED_MODULE_7__.TagModel(_this5.selectedWallet));
        }
        // Store transaction data
        yield _this5._transactionService.setCurrentTransactionData(transactionData);
        // Open send-confirm route in a new tab
        if (typeof browser !== "undefined" && browser.runtime && browser.tabs) {
          const extensionUrl = browser.runtime.getURL("index.html");
          const routePath = "/send/confirmation";
          yield browser.tabs.create({
            url: `${extensionUrl}#${routePath}`,
            active: true
          });
        } else {
          // Fallback for non-extension environments
          _this5._router.navigate(["/send/confirmation"]);
        }
      } catch (error) {
        console.error("Error preparing transaction:", error);
        _this5.error = _this5._translocoService.translate("zelf_keys.billing_ui.error.prepare_transaction");
        _this5.loadingAvaxPayment = false;
      }
    })();
  }
  openCustomerPortal() {
    this._billingService.createCustomerPortalSession().then(response => {
      if (response.success && response.portalUrl) {
        window.open(response.portalUrl, "_blank");
      } else {
        console.error("Portal creation failed:", response);
        this.error = this._translocoService.translate("zelf_keys.billing_ui.error.open_portal");
      }
    }).catch(error => {
      console.error("Error opening customer portal:", error);
      // Provide more specific error messages
      if (error.message?.includes("Customer ID not found")) {
        this.error = this._translocoService.translate("zelf_keys.billing_ui.error.customer_not_found");
      } else if (error.message?.includes("No active subscription")) {
        this.error = this._translocoService.translate("zelf_keys.billing_ui.error.no_subscription");
      } else {
        this.error = this._translocoService.translate("zelf_keys.billing_ui.error.open_portal_generic", {
          error: error.message || this._translocoService.translate("errors.unknown")
        });
      }
    });
  }
  static ɵfac = function ZelfKeysBillingComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ZelfKeysBillingComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](app_asset_service__WEBPACK_IMPORTED_MODULE_12__.AssetService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](app_services_avax_service__WEBPACK_IMPORTED_MODULE_13__.AvaxService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_services_billing_service__WEBPACK_IMPORTED_MODULE_14__.BillingService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_9__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](app_chrome_service__WEBPACK_IMPORTED_MODULE_15__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](app_services_network_service__WEBPACK_IMPORTED_MODULE_16__.NetworkService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_17__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](app_transaction_service__WEBPACK_IMPORTED_MODULE_18__.TransactionService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_jsverse_transloco__WEBPACK_IMPORTED_MODULE_5__.TranslocoService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_wallet_service__WEBPACK_IMPORTED_MODULE_19__.WalletService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineComponent"]({
    type: ZelfKeysBillingComponent,
    selectors: [["zelf-keys-billing"]],
    hostBindings: function ZelfKeysBillingComponent_HostBindings(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysBillingComponent_click_HostBindingHandler($event) {
          return ctx.onDocumentClick($event);
        }, _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresolveDocument"]);
      }
    },
    decls: 1,
    vars: 0,
    consts: [["clipboardIcon", ""], ["class", "billing", 4, "transloco"], [1, "billing"], [1, "billing__content"], [3, "diameter", 4, "ngIf"], ["class", "billing__error", 4, "ngIf"], ["class", "billing__subscription", 4, "ngIf"], ["class", "billing__activation-success", 4, "ngIf"], ["class", "billing__crypto-payment", 4, "ngIf"], ["class", "billing__plans", 4, "ngIf"], [3, "diameter"], [1, "billing__error"], [1, "billing__error-content"], ["width", "24", "height", "24", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "billing__error-icon"], ["d", "M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], [1, "billing__error-text"], [1, "billing__retry-button", 3, "click"], [1, "billing__subscription"], [1, "billing__crypto-card"], [1, "billing__payment-details"], [1, "billing__payment-amount"], [1, "billing__payment-method-header"], [1, "billing__payment-method-title"], [1, "billing__subscription-status"], ["class", "billing__status-icon", "width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], ["class", "billing__status-icon billing__status-icon--cancelled", "width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], [1, "billing__status-text"], [1, "billing__payment-method-content"], [1, "billing__receipt"], [1, "billing__receipt-row"], [1, "billing__receipt-label"], [1, "billing__receipt-value"], [1, "billing__receipt-price"], ["class", "billing__payment-method-text billing__payment-method-text--crypto", 4, "ngIf"], ["class", "billing__payment-method-text billing__payment-method-text--stripe", 4, "ngIf"], ["class", "billing__payment-method-text billing__payment-method-text--revenuecat", 4, "ngIf"], ["class", "billing__receipt-row", 4, "ngIf"], [1, "billing__subscription-actions"], ["class", "billing__payment-method", 4, "ngIf"], ["width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "billing__status-icon"], ["d", "M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "billing__status-icon", "billing__status-icon--cancelled"], [1, "billing__payment-method-text", "billing__payment-method-text--crypto"], ["width", "14", "height", "14", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["cx", "12", "cy", "12", "r", "10", "stroke", "currentColor", "stroke-width", "2"], ["d", "M8 12l2 2 4-4", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["class", "billing__demo-badge", 4, "ngIf"], [1, "billing__demo-badge"], [1, "billing__payment-method-text", "billing__payment-method-text--stripe"], ["x", "1", "y", "4", "width", "22", "height", "16", "rx", "2", "ry", "2", "stroke", "currentColor", "stroke-width", "2"], ["x1", "1", "y1", "10", "x2", "23", "y2", "10", "stroke", "currentColor", "stroke-width", "2"], [1, "billing__payment-method-text", "billing__payment-method-text--revenuecat"], ["d", "M12 2L2 7L12 12L22 7L12 2Z", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M2 17L12 22L22 17", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M2 12L12 17L22 12", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], [1, "billing__receipt-price", "billing__transaction-hash"], ["target", "_blank", "rel", "noopener noreferrer", 3, "href"], ["width", "12", "height", "12", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M18 13V19A2 2 0 0116 21H5A2 2 0 013 19V8A2 2 0 015 6H11", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["points", "15,3 21,3 21,9", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["x1", "10", "y1", "14", "x2", "21", "y2", "3", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], [1, "billing__receipt-price", "billing__status-cancelled"], [1, "billing__payment-method"], [1, "billing__pay-button", "billing__pay-button--stripe", 3, "click"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "billing__button-icon"], ["d", "M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.01131 9.77251C4.28062 9.5799 4.48571 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], [1, "billing__status-note"], [1, "billing__crypto-info-card"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "billing__info-icon"], ["d", "M12 16V12M12 8H12.01", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], [1, "billing__crypto-content"], ["class", "billing__transaction-note", 4, "ngIf"], [1, "billing__transaction-note"], [1, "billing__activation-success"], [1, "billing__activation-card"], [1, "billing__success-icon"], ["width", "48", "height", "48", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], [1, "billing__success-title"], [1, "billing__success-message"], [1, "billing__crypto-payment"], [1, "billing__price-lock-content"], ["class", "billing__demo-banner", 4, "ngIf"], [1, "billing__price-lock"], [4, "ngIf"], [1, "billing__receipt-secondary"], ["class", "billing__receipt-row billing__receipt-row--discount", 4, "ngIf"], [1, "billing__receipt-row", "billing__receipt-row--total"], [1, "billing__receipt-price", "billing__receipt-price--total"], [1, "billing__receipt-secondary", "billing__receipt-secondary--total"], [1, "billing__payment-methods"], [1, "billing__payment-methods-title"], [1, "billing__address-section"], [1, "crypto-address"], [1, "crypto-address__col"], [1, "crypto-address__text"], [1, "crypto-address__address-text"], [1, "zelf-icon-button", "zelf-icon-button--40", "zelf-icon-button--secondary", "zelf-icon-button--border-soft", 3, "click"], [4, "ngTemplateOutlet"], [1, "billing__qr-section"], [1, "billing__qr-container"], [1, "billing__qr-code", 3, "src", "alt"], [1, "billing__payment-status"], [3, "absolute", "diameter"], [1, "billing__payment-actions"], [1, "billing__cancel-button", 3, "click"], [1, "billing__demo-banner"], [1, "billing__receipt-row", "billing__receipt-row--discount"], [1, "billing__domain-payment"], ["for", "selectedWallet", 1, "billing__domain-label", "form-label"], [1, "billing__wallet-dropdown"], [1, "zelf-input", "zelf-input--wide"], ["type", "button", 1, "billing__wallet-trigger", "zelf-input__control", 3, "click"], [1, "billing__wallet-trigger-text"], [1, "billing__wallet-trigger-icon-wrapper"], ["width", "12", "height", "8", "viewBox", "0 0 12 8", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "billing__wallet-trigger-icon"], ["d", "M1 1L6 6L11 1", "stroke", "#181818", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["class", "billing__wallet-menu", 4, "ngIf"], [1, "billing__pay-button", "billing__pay-button--avax", 3, "click"], [1, "billing__wallet-menu"], ["type", "button", "class", "billing__wallet-menu-item", 3, "billing__wallet-menu-item--selected", "click", 4, "ngFor", "ngForOf"], ["type", "button", 1, "billing__wallet-menu-item", 3, "click"], [1, "billing__plans"], [1, "billing__header"], [1, "billing__title"], [1, "billing__subtitle"], [1, "billing__pricing-grid"], ["class", "billing__pricing-card", 3, "billing__pricing-card--popular", "billing__pricing-card--current", 4, "ngFor", "ngForOf"], [1, "billing__pricing-card"], [1, "billing__card-header"], [1, "billing__plan-name"], ["class", "billing__popular-badge", 4, "ngIf"], [1, "billing__plan-pricing"], [1, "billing__price"], [1, "billing__currency"], [1, "billing__amount"], [1, "billing__period"], [1, "billing__plan-tagline"], [1, "billing__plan-features"], ["class", "billing__feature-item", 4, "ngFor", "ngForOf"], ["class", "billing__payment-options", 4, "ngIf"], ["class", "billing__plan-button billing__plan-button--current", "disabled", "", 4, "ngIf"], [1, "billing__popular-badge"], [1, "billing__feature-item"], ["width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "billing__feature-icon"], [1, "billing__feature-text"], [1, "billing__payment-options"], [1, "billing__payment-button", "billing__payment-button--stripe", 3, "click", "disabled"], ["diameter", "20", "class", "billing__payment-spinner", 4, "ngIf"], ["class", "billing__payment-icon", "width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], [1, "billing__payment-button", "billing__payment-button--crypto", 3, "click", "disabled"], ["diameter", "20", 1, "billing__payment-spinner"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "billing__payment-icon"], ["disabled", "", 1, "billing__plan-button", "billing__plan-button--current"], ["width", "24", "height", "24", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M15.5 20H5.5V7C5.5 6.45 5.05 6 4.5 6C3.95 6 3.5 6.45 3.5 7V20C3.5 21.1 4.4 22 5.5 22H15.5C16.05 22 16.5 21.55 16.5 21C16.5 20.45 16.05 20 15.5 20ZM20.5 16V4C20.5 2.9 19.6 2 18.5 2H9.5C8.4 2 7.5 2.9 7.5 4V16C7.5 17.1 8.4 18 9.5 18H18.5C19.6 18 20.5 17.1 20.5 16ZM18.5 16H9.5V4H18.5V16Z"]],
    template: function ZelfKeysBillingComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](0, ZelfKeysBillingComponent_div_0_Template, 10, 6, "div", 1);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgTemplateOutlet, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormsModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_5__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_5__.TranslocoDirective, app_zelf_loader_zelf_loader_component__WEBPACK_IMPORTED_MODULE_8__.ZelfLoaderComponent, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_4__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_4__.MatProgressSpinner, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButtonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.SlicePipe, _angular_common__WEBPACK_IMPORTED_MODULE_1__.DecimalPipe, _angular_common__WEBPACK_IMPORTED_MODULE_1__.DatePipe, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_5__.TranslocoPipe],
    styles: [".crypto-address[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: row;\n  gap: 16px;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  background-color: var(--zns-theme-card, #ffffff);\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: 16px;\n  padding: 16px 8px;\n  box-shadow: 0px 8px 24px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n}\n.crypto-address__col[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  justify-content: center;\n  align-items: flex-start;\n  width: 100%;\n}\n.crypto-address__text[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 600;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n}\n.crypto-address__address-text[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 500;\n  font-family: monospace;\n  color: var(--zns-theme-text, #181818);\n  word-break: break-all;\n  margin: 0;\n}\n\n.billing__content[_ngcontent-%COMP%] {\n  max-width: 1000px;\n  margin: 0 auto;\n  padding: 0;\n}\n.billing__header[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 48px;\n}\n.billing__title[_ngcontent-%COMP%] {\n  font-size: 32px;\n  font-weight: 700;\n  color: var(--zns-theme-text, #181818);\n  margin: 0 0 12px 0;\n  letter-spacing: -0.5px;\n}\n.billing__subtitle[_ngcontent-%COMP%] {\n  font-size: 18px;\n  color: var(--zns-theme-text-secondary, #73777f);\n  margin: 0;\n  font-weight: 400;\n}\n.billing__error[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  padding: 60px 20px;\n}\n.billing__error-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  max-width: 400px;\n}\n.billing__error-icon[_ngcontent-%COMP%] {\n  color: var(--zns-theme-error, #dc362e);\n  margin-bottom: 16px;\n}\n.billing__error-text[_ngcontent-%COMP%] {\n  font-size: 16px;\n  color: var(--zns-theme-error, #dc362e);\n  margin: 0 0 20px 0;\n}\n.billing__retry-button[_ngcontent-%COMP%] {\n  background: var(--zns-theme-button, #181818);\n  color: var(--zns-theme-button-text, #ffffff);\n  border: none;\n  padding: 12px 24px;\n  border-radius: 8px;\n  font-size: 14px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n}\n.billing__retry-button[_ngcontent-%COMP%]:hover {\n  background: var(--zns-theme-button-hover, #ff5721);\n}\n.billing__subscription[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n}\n.billing__subscription-status[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  margin-top: 8px;\n  font-size: 12px;\n  font-weight: 500;\n}\n.billing__subscription-status--cancelled[_ngcontent-%COMP%]   .billing__status-text[_ngcontent-%COMP%] {\n  color: var(--zns-theme-warning, #de6800);\n}\n.billing__status-icon[_ngcontent-%COMP%] {\n  color: var(--zns-theme-success, #1ea446);\n  width: 16px;\n  height: 16px;\n  flex-shrink: 0;\n}\n.billing__status-icon--cancelled[_ngcontent-%COMP%] {\n  color: var(--zns-theme-warning, #de6800);\n}\n.billing__status-text[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--zns-theme-success, #1ea446);\n}\n.billing__status-active[_ngcontent-%COMP%] {\n  color: var(--zns-theme-success, #1ea446);\n  font-weight: 600;\n}\n.billing__status-cancelled[_ngcontent-%COMP%] {\n  color: var(--zns-theme-warning, #de6800);\n  font-weight: 600;\n}\n.billing__transaction-hash[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n}\n.billing__transaction-hash[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: var(--zns-theme-warning, #de6800);\n  text-decoration: none;\n  font-family: \"Monaco\", \"Menlo\", \"Ubuntu Mono\", monospace;\n  font-size: 13px;\n  display: inline-flex;\n  align-items: center;\n  gap: 4px;\n}\n.billing__transaction-hash[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.billing__transaction-hash[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  opacity: 0.7;\n  flex-shrink: 0;\n}\n.billing__subscription-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 20px;\n}\n.billing__crypto-info-card[_ngcontent-%COMP%] {\n  display: flex;\n  text-align: left;\n  gap: 12px;\n}\n.billing__info-icon[_ngcontent-%COMP%] {\n  color: var(--zns-theme-button, #181818);\n  flex-shrink: 0;\n  margin-top: 2px;\n}\n.billing__crypto-content[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.billing__crypto-content[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  margin: 0 0 8px 0;\n  font-size: 16px;\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n}\n.billing__crypto-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0 0 8px 0;\n  font-size: 14px;\n  font-weight: 400;\n  color: var(--zns-theme-text, #181818);\n  line-height: 1.5;\n}\n.billing__crypto-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0;\n}\n.billing__transaction-note[_ngcontent-%COMP%] {\n  color: var(--zns-theme-button, #181818);\n  font-weight: 400;\n  font-size: 12px;\n  display: block;\n  margin-top: 8px;\n}\n.billing__payment-method-text[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-weight: 500;\n}\n.billing__payment-method-text--crypto[_ngcontent-%COMP%] {\n  color: var(--zns-theme-warning, #de6800);\n}\n.billing__payment-method-text--stripe[_ngcontent-%COMP%] {\n  color: var(--zns-theme-button, #181818);\n}\n.billing__payment-method-text[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 14px;\n  height: 14px;\n  flex-shrink: 0;\n}\n.billing__demo-badge[_ngcontent-%COMP%] {\n  background: var(--zns-theme-button, #181818);\n  color: var(--zns-theme-button-text, #ffffff);\n  font-size: 10px;\n  font-weight: 600;\n  padding: 2px 6px;\n  border-radius: 4px;\n  margin-left: 4px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.billing__crypto-payment[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  margin-bottom: 48px;\n}\n.billing__crypto-card[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.billing__payment-details[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n  text-align: center;\n}\n.billing__payment-amount[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  background: var(--zns-theme-card, #ffffff);\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: 16px;\n  padding: 24px;\n  box-shadow: 0 2px 8px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n}\n.billing__price-lock-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 24px;\n}\n.billing__receipt[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.billing__receipt-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 16px;\n  padding-bottom: 12px;\n}\n.billing__receipt-row[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n  padding-bottom: 0;\n}\n.billing__receipt-row--discount[_ngcontent-%COMP%]   .billing__receipt-price[_ngcontent-%COMP%] {\n  color: var(--zns-theme-success, #1ea446);\n}\n.billing__receipt-row--total[_ngcontent-%COMP%] {\n  padding-top: 8px;\n  margin-top: 4px;\n  border-top: 2px solid var(--zns-theme-text, #181818);\n  border-bottom: none;\n}\n.billing__receipt-label[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--zns-theme-text-muted, #96939e);\n  flex-shrink: 0;\n}\n.billing__receipt-value[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-end;\n  gap: 4px;\n  text-align: right;\n  flex: 1;\n  min-width: 0;\n}\n.billing__receipt-price[_ngcontent-%COMP%] {\n  font-size: 16px;\n  font-weight: 500;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n  white-space: nowrap;\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n}\n.billing__receipt-price--total[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 700;\n}\n.billing__receipt-secondary[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--zns-theme-text-muted, #96939e);\n  margin: 0;\n}\n.billing__receipt-secondary--discounted[_ngcontent-%COMP%] {\n  text-decoration: line-through;\n  color: var(--zns-theme-error, #dc362e);\n  opacity: 0.7;\n}\n.billing__receipt-secondary--total[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: var(--zns-theme-text-muted, #96939e);\n}\n.billing__payment-status[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  background: var(--zns-theme-card, #ffffff);\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: 16px;\n  padding: 24px;\n  margin-bottom: 20px;\n  box-shadow: 0 2px 8px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n}\n.billing__payment-status[_ngcontent-%COMP%]   .billing__payment-method-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 12px;\n}\n.billing__status-note[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 500;\n  margin-top: 12px;\n  color: var(--zns-theme-text-muted, #96939e);\n  text-align: center;\n}\n.billing__demo-banner[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--zns-theme-button-text, #ffffff);\n  padding: 8px 16px;\n  background: var(--zns-theme-button, #181818);\n  border-radius: 20px;\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  display: inline-block;\n  margin: 0 auto;\n}\n.billing__price-lock[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--zns-theme-text-muted, #96939e);\n  margin: 0;\n}\n.billing__address-section[_ngcontent-%COMP%] {\n  margin-bottom: 24px;\n}\n.billing__qr-section[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.billing__qr-label[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--zns-theme-text-muted, #96939e);\n  margin-bottom: 12px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.billing__qr-container[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 12px;\n  background: var(--zns-theme-card, #ffffff);\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: 12px;\n  box-shadow: 0 2px 8px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n}\n.billing__qr-code[_ngcontent-%COMP%] {\n  width: 180px;\n  height: 180px;\n  display: block;\n}\n.billing__payment-methods[_ngcontent-%COMP%] {\n  margin-bottom: 24px;\n}\n.billing__payment-methods-title[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 700;\n  color: var(--zns-theme-text, #181818);\n  margin: 0 0 24px 0;\n  text-align: center;\n}\n.billing__payment-method[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  background: var(--zns-theme-card, #ffffff);\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: 16px;\n  padding: 24px;\n  margin-bottom: 20px;\n  box-shadow: 0 2px 8px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n}\n.billing__payment-method[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0;\n}\n.billing__payment-method-header[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  margin-bottom: 16px;\n  padding-bottom: 16px;\n  border-bottom: 1px solid var(--zns-theme-card-border, #eeedf1);\n}\n.billing__payment-method-title[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.billing__payment-method-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n}\n.billing__domain-payment[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.billing__domain-label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 14px;\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n  margin-bottom: 12px;\n  width: 100%;\n}\n.billing__wallet-dropdown[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n}\n.billing__wallet-trigger[_ngcontent-%COMP%] {\n  cursor: pointer;\n  width: 100%;\n  flex: 1;\n  min-width: 0;\n  padding: 16px;\n  margin: 0;\n  border: none;\n  background: none;\n  outline: none;\n  text-align: left;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.billing__wallet-trigger[_ngcontent-%COMP%]:focus {\n  outline: none;\n}\n.billing__wallet-trigger[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--zns-theme-button, #181818);\n  outline-offset: 2px;\n  border-radius: 9999px;\n}\n.billing__wallet-trigger-text[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  text-align: left;\n}\n.billing__wallet-trigger-icon-wrapper[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-right: 16px;\n}\n.billing__wallet-trigger-icon[_ngcontent-%COMP%] {\n  transition: transform 0.2s ease;\n  stroke: var(--zns-theme-text, #181818);\n  width: 12px;\n  height: 8px;\n}\n.billing__wallet-trigger-icon--open[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n}\n.billing__wallet-menu[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 8px);\n  left: 0;\n  right: 0;\n  z-index: 1000;\n  background: var(--zns-theme-card, #ffffff);\n  border-radius: 14px;\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n  padding: 8px 0;\n  max-height: 300px;\n  overflow-y: auto;\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n}\n.billing__wallet-menu-item[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  padding: 12px 24px;\n  border: none;\n  background: none;\n  text-align: left;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--zns-theme-text, #181818);\n  cursor: pointer;\n  transition: background-color 0.2s ease;\n  min-height: 48px;\n  line-height: 24px;\n}\n.billing__wallet-menu-item[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-card-border, #eeedf1);\n}\n.billing__wallet-menu-item--selected[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-button, #181818);\n  color: var(--zns-theme-button-text, #ffffff);\n  font-weight: 600;\n}\n.billing__wallet-menu-item[_ngcontent-%COMP%]:active {\n  background-color: var(--zns-theme-card-border, #eeedf1);\n}\n.billing__pay-button[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 14px 24px;\n  border: none;\n  border-radius: 12px;\n  font-size: 16px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  min-height: 48px;\n}\n.billing__pay-button--avax[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, var(--zns-theme-warning, #de6800) 0%, var(--zns-theme-warning, #de6800) 100%);\n  color: var(--zns-theme-button-text, #ffffff);\n  box-shadow: 0 4px 16px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n}\n.billing__pay-button--avax[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 20px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n}\n.billing__pay-button--stripe[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, var(--zns-theme-button, #181818) 0%, var(--zns-theme-button-hover, #ff5721) 100%);\n  color: var(--zns-theme-button-text, #ffffff);\n  box-shadow: 0 4px 16px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n}\n.billing__pay-button--stripe[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 20px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n}\n.billing__pay-button[_ngcontent-%COMP%]:active:not(:disabled) {\n  transform: translateY(0);\n}\n.billing__pay-button[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n  opacity: 0.7;\n}\n.billing__payment-actions[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.billing__cancel-button[_ngcontent-%COMP%] {\n  background: var(--zns-theme-card-border, #eeedf1);\n  color: var(--zns-theme-text-muted, #96939e);\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  padding: 10px 20px;\n  border-radius: 8px;\n  font-size: 14px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.billing__cancel-button[_ngcontent-%COMP%]:hover {\n  background: var(--zns-theme-card-border, #eeedf1);\n  border-color: var(--zns-theme-card-border, #eeedf1);\n  color: var(--zns-theme-text-muted, #96939e);\n}\n.billing__pricing-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 24px;\n  margin-bottom: 48px;\n}\n.billing__pricing-card[_ngcontent-%COMP%] {\n  background: var(--zns-theme-card, #ffffff);\n  border: 2px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: 16px;\n  padding: 32px 24px;\n  position: relative;\n  transition: all 0.3s ease;\n  display: flex;\n  flex-direction: column;\n}\n.billing__pricing-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 12px 40px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n  border-color: var(--zns-theme-button, #181818);\n}\n.billing__pricing-card--popular[_ngcontent-%COMP%] {\n  border-color: var(--zns-theme-button, #181818);\n  box-shadow: 0 8px 32px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n  transform: scale(1.02);\n}\n.billing__pricing-card--popular[_ngcontent-%COMP%]:hover {\n  transform: scale(1.02) translateY(-4px);\n}\n.billing__pricing-card--current[_ngcontent-%COMP%] {\n  border-color: var(--zns-theme-success, #1ea446);\n  background: linear-gradient(135deg, var(--zns-theme-success-text, #e7f8ed) 0%, var(--zns-theme-success-text, #e7f8ed) 100%);\n  box-shadow: 0 8px 32px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n}\n.billing__card-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  margin-bottom: 16px;\n}\n.billing__plan-name[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 700;\n  color: var(--zns-theme-text, #181818);\n  letter-spacing: -0.5px;\n}\n.billing__popular-badge[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, var(--zns-theme-button, #181818) 0%, var(--zns-theme-button-hover, #ff5721) 100%);\n  color: var(--zns-theme-button-text, #ffffff);\n  font-size: 12px;\n  font-weight: 600;\n  padding: 4px 12px;\n  border-radius: 12px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.billing__plan-pricing[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n.billing__price[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: baseline;\n  gap: 4px;\n}\n.billing__currency[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n}\n.billing__amount[_ngcontent-%COMP%] {\n  font-size: 48px;\n  font-weight: 700;\n  color: var(--zns-theme-text, #181818);\n  line-height: 1;\n}\n.billing__period[_ngcontent-%COMP%] {\n  font-size: 18px;\n  color: var(--zns-theme-text-muted, #96939e);\n  font-weight: 500;\n}\n.billing__plan-tagline[_ngcontent-%COMP%] {\n  font-size: 16px;\n  color: var(--zns-theme-text-muted, #96939e);\n  margin-bottom: 24px;\n  font-weight: 400;\n}\n.billing__plan-features[_ngcontent-%COMP%] {\n  flex: 1;\n  margin-bottom: 32px;\n}\n.billing__feature-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 12px;\n  margin-bottom: 12px;\n}\n.billing__feature-icon[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  margin-top: 2px;\n  color: var(--zns-theme-success, #1ea446);\n  width: 16px;\n  height: 16px;\n}\n.billing__feature-text[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: var(--zns-theme-text, #181818);\n  line-height: 1.4;\n}\n.billing__payment-options[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  margin-top: auto;\n}\n.billing__payment-button[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 14px 24px;\n  border: none;\n  border-radius: 12px;\n  font-size: 16px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  position: relative;\n  min-height: 48px;\n}\n.billing__payment-button[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n  opacity: 0.7;\n}\n.billing__payment-button--stripe[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, var(--zns-theme-button, #181818) 0%, var(--zns-theme-button-hover, #ff5721) 100%);\n  color: var(--zns-theme-button-text, #ffffff);\n  box-shadow: 0 4px 16px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n}\n.billing__payment-button--stripe[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 20px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n}\n.billing__payment-button--crypto[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, var(--zns-theme-warning, #de6800) 0%, var(--zns-theme-warning, #de6800) 100%);\n  color: var(--zns-theme-button-text, #ffffff);\n  box-shadow: 0 4px 16px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n}\n.billing__payment-button--crypto[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-2px);\n  box-shadow: 0 6px 20px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n}\n.billing__payment-button[_ngcontent-%COMP%]:active:not(:disabled) {\n  transform: translateY(0);\n}\n.billing__payment-spinner[_ngcontent-%COMP%] {\n  display: inline-block;\n  width: 20px;\n  height: 20px;\n}\n.billing__payment-spinner[_ngcontent-%COMP%]     svg {\n  width: 20px;\n  height: 20px;\n}\n.billing__payment-icon[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n}\n.billing__plan-button[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 14px 24px;\n  border: none;\n  border-radius: 12px;\n  font-size: 16px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  margin-top: auto;\n}\n.billing__plan-button--current[_ngcontent-%COMP%] {\n  background: var(--zns-theme-success-text, #e7f8ed);\n  color: var(--zns-theme-success, #1ea446);\n  border: 2px solid var(--zns-theme-success, #1ea446);\n  cursor: default;\n}\n.billing__plan-button--current[_ngcontent-%COMP%]:hover {\n  transform: none;\n  box-shadow: none;\n}\n.billing__plan-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n@keyframes _ngcontent-%COMP%_spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n@media (max-width: 768px) {\n  .billing__content[_ngcontent-%COMP%] {\n    padding: 0;\n  }\n  .billing__header[_ngcontent-%COMP%] {\n    margin-bottom: 32px;\n  }\n  .billing__title[_ngcontent-%COMP%] {\n    font-size: 28px;\n  }\n  .billing__subtitle[_ngcontent-%COMP%] {\n    font-size: 16px;\n  }\n  .billing__subscription[_ngcontent-%COMP%] {\n    margin-bottom: 32px;\n  }\n  .billing__subscription-status[_ngcontent-%COMP%] {\n    margin-top: 6px;\n  }\n  .billing__status-text[_ngcontent-%COMP%] {\n    font-size: 11px;\n  }\n  .billing__pricing-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 20px;\n    margin-bottom: 32px;\n  }\n  .billing__pricing-card[_ngcontent-%COMP%] {\n    padding: 24px 20px;\n  }\n  .billing__pricing-card--popular[_ngcontent-%COMP%] {\n    transform: none;\n  }\n  .billing__pricing-card--popular[_ngcontent-%COMP%]:hover {\n    transform: translateY(-2px);\n  }\n  .billing__plan-name[_ngcontent-%COMP%] {\n    font-size: 20px;\n  }\n  .billing__amount[_ngcontent-%COMP%] {\n    font-size: 40px;\n  }\n  .billing__feature-text[_ngcontent-%COMP%] {\n    font-size: 13px;\n  }\n  .billing__plan-button[_ngcontent-%COMP%] {\n    padding: 12px 20px;\n    font-size: 15px;\n  }\n  .billing__activation-success[_ngcontent-%COMP%] {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    min-height: 400px;\n    padding: 20px;\n  }\n  .billing__activation-card[_ngcontent-%COMP%] {\n    background: var(--zns-theme-card, #ffffff);\n    border-radius: 16px;\n    padding: 48px 32px;\n    text-align: center;\n    box-shadow: 0 8px 32px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n    border: 1px solid var(--zns-theme-card-border, #eeedf1);\n    max-width: 500px;\n    width: 100%;\n  }\n  .billing__success-icon[_ngcontent-%COMP%] {\n    margin-bottom: 24px;\n    color: var(--zns-theme-success, #1ea446);\n    display: flex;\n    justify-content: center;\n  }\n  .billing__success-icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n    animation: _ngcontent-%COMP%_pulse 2s infinite;\n  }\n  .billing__success-title[_ngcontent-%COMP%] {\n    font-size: 28px;\n    font-weight: 700;\n    color: var(--zns-theme-text, #181818);\n    margin: 0 0 16px 0;\n    letter-spacing: -0.5px;\n  }\n  .billing__success-message[_ngcontent-%COMP%] {\n    font-size: 16px;\n    color: var(--zns-theme-text-muted, #96939e);\n    margin: 0 0 32px 0;\n    line-height: 1.5;\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0%, 100% {\n    opacity: 1;\n    transform: scale(1);\n  }\n  50% {\n    opacity: 0.8;\n    transform: scale(1.05);\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvemVsZi1rZXlzL3plbGYta2V5cy1iaWxsaW5nL3plbGYta2V5cy1iaWxsaW5nLmNvbXBvbmVudC5zY3NzIiwid2VicGFjazovLy4vc3JjL3N0eWxlcy9fdmFyaWFibGVzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxzQkFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFNBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0VBQ0EsV0FBQTtFQUNBLGdEQ3VDUTtFRHRDUix1REFBQTtFQUNBLG1CQUFBO0VBQ0EsaUJBQUE7RUFDQSxvRUFBQTtBQURKO0FBR0k7RUFDSSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxRQUFBO0VBQ0EsdUJBQUE7RUFDQSx1QkFBQTtFQUNBLFdBQUE7QUFEUjtBQUlJO0VBQ0ksZUFBQTtFQUNBLGdCQUFBO0VBQ0EsdUVDSlU7RURLVixxQ0NFSTtFRERKLFNBQUE7QUFGUjtBQUtJO0VBQ0ksZUFBQTtFQUNBLGdCQUFBO0VBQ0Esc0JBQUE7RUFDQSxxQ0NOSTtFRE9KLHFCQUFBO0VBQ0EsU0FBQTtBQUhSOztBQVFJO0VBQ0ksaUJBQUE7RUFDQSxjQUFBO0VBQ0EsVUFBQTtBQUxSO0FBUUk7RUFDSSxrQkFBQTtFQUNBLG1CQUFBO0FBTlI7QUFTSTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHFDQzNCSTtFRDRCSixrQkFBQTtFQUNBLHNCQUFBO0FBUFI7QUFVSTtFQUNJLGVBQUE7RUFDQSwrQ0NoQ2E7RURpQ2IsU0FBQTtFQUNBLGdCQUFBO0FBUlI7QUFXSTtFQUNJLGFBQUE7RUFDQSx1QkFBQTtFQUNBLGtCQUFBO0FBVFI7QUFZSTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtBQVZSO0FBYUk7RUFDSSxzQ0M1RUE7RUQ2RUEsbUJBQUE7QUFYUjtBQWNJO0VBQ0ksZUFBQTtFQUNBLHNDQ2xGQTtFRG1GQSxrQkFBQTtBQVpS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REFBQTtJQUNBLGdCQUFBO0lBQ0EsV0FBQTtFQTNKVjtFQThKTTtJQUNJLG1CQUFBO0lBQ0Esd0NDNS9CRjtJRDYvQkUsYUFBQTtJQUNBLHVCQUFBO0VBNUpWO0VBOEpVO0lBQ0ksNEJBQUE7RUE1SmQ7RUFnS007SUFDSSxlQUFBO0lBQ0EsZ0JBQUE7SUFDQSxxQ0M5K0JBO0lEKytCQSxrQkFBQTtJQUNBLHNCQUFBO0VBOUpWO0VBaUtNO0lBQ0ksZUFBQTtJQUNBLDJDQ3AvQks7SURxL0JMLGtCQUFBO0lBQ0EsZ0JBQUE7RUEvSlY7QUFDRjtBQW1LQTtFQUNJO0lBRUksVUFBQTtJQUNBLG1CQUFBO0VBbEtOO0VBb0tFO0lBQ0ksWUFBQTtJQUNBLHNCQUFBO0VBbEtOO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwiLi4vLi4vLi4vc3R5bGVzL3ZhcmlhYmxlc1wiO1xuXG4uY3J5cHRvLWFkZHJlc3Mge1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgIGdhcDogMTZweDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgcGFkZGluZzogMTZweCA4cHg7XG4gICAgYm94LXNoYWRvdzogMHB4IDhweCAyNHB4IHZhcmlhYmxlcy4kdGhlbWVTaGFkb3c7XG5cbiAgICAmX19jb2wge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBnYXA6IDJweDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX190ZXh0IHtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgIH1cblxuICAgICZfX2FkZHJlc3MtdGV4dCB7XG4gICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgZm9udC1mYW1pbHk6IG1vbm9zcGFjZTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICB3b3JkLWJyZWFrOiBicmVhay1hbGw7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICB9XG59XG5cbi5iaWxsaW5nIHtcbiAgICAmX19jb250ZW50IHtcbiAgICAgICAgbWF4LXdpZHRoOiAxMDAwcHg7XG4gICAgICAgIG1hcmdpbjogMCBhdXRvO1xuICAgICAgICBwYWRkaW5nOiAwO1xuICAgIH1cblxuICAgICZfX2hlYWRlciB7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogNDhweDtcbiAgICB9XG5cbiAgICAmX190aXRsZSB7XG4gICAgICAgIGZvbnQtc2l6ZTogMzJweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBtYXJnaW46IDAgMCAxMnB4IDA7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAtMC41cHg7XG4gICAgfVxuXG4gICAgJl9fc3VidGl0bGUge1xuICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBmb250LXdlaWdodDogNDAwO1xuICAgIH1cblxuICAgICZfX2Vycm9yIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIHBhZGRpbmc6IDYwcHggMjBweDtcbiAgICB9XG5cbiAgICAmX19lcnJvci1jb250ZW50IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICAgIH1cblxuICAgICZfX2Vycm9yLWljb24ge1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvcjtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMTZweDtcbiAgICB9XG5cbiAgICAmX19lcnJvci10ZXh0IHtcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvcjtcbiAgICAgICAgbWFyZ2luOiAwIDAgMjBweCAwO1xuICAgIH1cblxuICAgICZfX3JldHJ5LWJ1dHRvbiB7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b247XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dDtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBwYWRkaW5nOiAxMnB4IDI0cHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlO1xuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbkhvdmVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fc3Vic2NyaXB0aW9uIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgfVxuXG4gICAgJl9fc3Vic2NyaXB0aW9uLXN0YXR1cyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgbWFyZ2luLXRvcDogOHB4O1xuICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG5cbiAgICAgICAgJi0tY2FuY2VsbGVkIHtcbiAgICAgICAgICAgIC5iaWxsaW5nX19zdGF0dXMtdGV4dCB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kd2FybmluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3N0YXR1cy1pY29uIHtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdDtcbiAgICAgICAgd2lkdGg6IDE2cHg7XG4gICAgICAgIGhlaWdodDogMTZweDtcbiAgICAgICAgZmxleC1zaHJpbms6IDA7XG5cbiAgICAgICAgJi0tY2FuY2VsbGVkIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHdhcm5pbmc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19zdGF0dXMtdGV4dCB7XG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdDtcbiAgICB9XG5cbiAgICAmX19zdGF0dXMtYWN0aXZlIHtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICB9XG5cbiAgICAmX19zdGF0dXMtY2FuY2VsbGVkIHtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kd2FybmluZztcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICB9XG5cbiAgICAmX190cmFuc2FjdGlvbi1oYXNoIHtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogNHB4O1xuXG4gICAgICAgIGEge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kd2FybmluZztcbiAgICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiBcIk1vbmFjb1wiLCBcIk1lbmxvXCIsIFwiVWJ1bnR1IE1vbm9cIiwgbW9ub3NwYWNlO1xuICAgICAgICAgICAgZm9udC1zaXplOiAxM3B4O1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgZ2FwOiA0cHg7XG5cbiAgICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNztcbiAgICAgICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fc3Vic2NyaXB0aW9uLWFjdGlvbnMge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBnYXA6IDIwcHg7XG4gICAgfVxuXG4gICAgJl9fY3J5cHRvLWluZm8tY2FyZCB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgIGdhcDogMTJweDtcbiAgICB9XG5cbiAgICAmX19pbmZvLWljb24ge1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbjtcbiAgICAgICAgZmxleC1zaHJpbms6IDA7XG4gICAgICAgIG1hcmdpbi10b3A6IDJweDtcbiAgICB9XG5cbiAgICAmX19jcnlwdG8tY29udGVudCB7XG4gICAgICAgIGZsZXg6IDE7XG5cbiAgICAgICAgaDQge1xuICAgICAgICAgICAgbWFyZ2luOiAwIDAgOHB4IDA7XG4gICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgcCB7XG4gICAgICAgICAgICBtYXJnaW46IDAgMCA4cHggMDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMS41O1xuXG4gICAgICAgICAgICAmOmxhc3QtY2hpbGQge1xuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX190cmFuc2FjdGlvbi1ub3RlIHtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b247XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIG1hcmdpbi10b3A6IDhweDtcbiAgICB9XG5cbiAgICAmX19wYXltZW50LW1ldGhvZC10ZXh0IHtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogNnB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuXG4gICAgICAgICYtLWNyeXB0byB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR3YXJuaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgJi0tc3RyaXBlIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uO1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIHdpZHRoOiAxNHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiAxNHB4O1xuICAgICAgICAgICAgZmxleC1zaHJpbms6IDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19kZW1vLWJhZGdlIHtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbjtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0O1xuICAgICAgICBmb250LXNpemU6IDEwcHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIHBhZGRpbmc6IDJweCA2cHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgICAgbWFyZ2luLWxlZnQ6IDRweDtcbiAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgIH1cblxuICAgICZfX2NyeXB0by1wYXltZW50IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogNDhweDtcbiAgICB9XG5cbiAgICAmX19jcnlwdG8tY2FyZCB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgICZfX3BheW1lbnQtZGV0YWlscyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogMjRweDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuICAgICZfX3BheW1lbnQtYW1vdW50IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgICAgICBwYWRkaW5nOiAyNHB4O1xuICAgICAgICBib3gtc2hhZG93OiAwIDJweCA4cHggdmFyaWFibGVzLiR0aGVtZVNoYWRvdztcbiAgICB9XG5cbiAgICAmX19wcmljZS1sb2NrLWNvbnRlbnQge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiAxMnB4O1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAyNHB4O1xuICAgIH1cblxuICAgICZfX3JlY2VpcHQge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBnYXA6IDEycHg7XG4gICAgfVxuXG4gICAgJl9fcmVjZWlwdC1yb3cge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgICAgICBnYXA6IDE2cHg7XG4gICAgICAgIHBhZGRpbmctYm90dG9tOiAxMnB4O1xuXG4gICAgICAgICY6bGFzdC1jaGlsZCB7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tOiBub25lO1xuICAgICAgICAgICAgcGFkZGluZy1ib3R0b206IDA7XG4gICAgICAgIH1cblxuICAgICAgICAmLS1kaXNjb3VudCB7XG4gICAgICAgICAgICAuYmlsbGluZ19fcmVjZWlwdC1wcmljZSB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICYtLXRvdGFsIHtcbiAgICAgICAgICAgIHBhZGRpbmctdG9wOiA4cHg7XG4gICAgICAgICAgICBtYXJnaW4tdG9wOiA0cHg7XG4gICAgICAgICAgICBib3JkZXItdG9wOiAycHggc29saWQgdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tOiBub25lO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fcmVjZWlwdC1sYWJlbCB7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgIH1cblxuICAgICZfX3JlY2VpcHQtdmFsdWUge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XG4gICAgICAgIGdhcDogNHB4O1xuICAgICAgICB0ZXh0LWFsaWduOiByaWdodDtcbiAgICAgICAgZmxleDogMTtcbiAgICAgICAgbWluLXdpZHRoOiAwO1xuICAgIH1cblxuICAgICZfX3JlY2VpcHQtcHJpY2Uge1xuICAgICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA2cHg7XG5cbiAgICAgICAgJi0tdG90YWwge1xuICAgICAgICAgICAgZm9udC1zaXplOiAyMHB4O1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3JlY2VpcHQtc2Vjb25kYXJ5IHtcbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgbWFyZ2luOiAwO1xuXG4gICAgICAgICYtLWRpc2NvdW50ZWQge1xuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBsaW5lLXRocm91Z2g7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvcjtcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNztcbiAgICAgICAgfVxuXG4gICAgICAgICYtLXRvdGFsIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fcGF5bWVudC1zdGF0dXMge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgICAgIHBhZGRpbmc6IDI0cHg7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XG4gICAgICAgIGJveC1zaGFkb3c6IDAgMnB4IDhweCB2YXJpYWJsZXMuJHRoZW1lU2hhZG93O1xuXG4gICAgICAgIC5iaWxsaW5nX19wYXltZW50LW1ldGhvZC1jb250ZW50IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGdhcDogMTJweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3N0YXR1cy1ub3RlIHtcbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBtYXJnaW4tdG9wOiAxMnB4O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuICAgICZfX2RlbW8tYmFubmVyIHtcbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQ7XG4gICAgICAgIHBhZGRpbmc6IDhweCAxNnB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAyMHB4O1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICBtYXJnaW46IDAgYXV0bztcbiAgICB9XG5cbiAgICAmX19wcmljZS1sb2NrIHtcbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgIH1cblxuICAgICZfX2FkZHJlc3Mtc2VjdGlvbiB7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDI0cHg7XG4gICAgfVxuXG4gICAgJl9fcXItc2VjdGlvbiB7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX19xci1sYWJlbCB7XG4gICAgICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDEycHg7XG4gICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjVweDtcbiAgICB9XG5cbiAgICAmX19xci1jb250YWluZXIge1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICAgIHBhZGRpbmc6IDEycHg7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgYm94LXNoYWRvdzogMCAycHggOHB4IHZhcmlhYmxlcy4kdGhlbWVTaGFkb3c7XG4gICAgfVxuXG4gICAgJl9fcXItY29kZSB7XG4gICAgICAgIHdpZHRoOiAxODBweDtcbiAgICAgICAgaGVpZ2h0OiAxODBweDtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgfVxuXG4gICAgJl9fcGF5bWVudC1tZXRob2RzIHtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMjRweDtcbiAgICB9XG5cbiAgICAmX19wYXltZW50LW1ldGhvZHMtdGl0bGUge1xuICAgICAgICBmb250LXNpemU6IDIwcHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgbWFyZ2luOiAwIDAgMjRweCAwO1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgJl9fcGF5bWVudC1tZXRob2Qge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgICAgIHBhZGRpbmc6IDI0cHg7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XG4gICAgICAgIGJveC1zaGFkb3c6IDAgMnB4IDhweCB2YXJpYWJsZXMuJHRoZW1lU2hhZG93O1xuXG4gICAgICAgICY6bGFzdC1jaGlsZCB7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fcGF5bWVudC1tZXRob2QtaGVhZGVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMTZweDtcbiAgICAgICAgcGFkZGluZy1ib3R0b206IDE2cHg7XG4gICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICB9XG5cbiAgICAmX19wYXltZW50LW1ldGhvZC10aXRsZSB7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjVweDtcbiAgICB9XG5cbiAgICAmX19wYXltZW50LW1ldGhvZC1jb250ZW50IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgJl9fZG9tYWluLXBheW1lbnQge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBnYXA6IDE2cHg7XG4gICAgfVxuXG4gICAgJl9fZG9tYWluLWxhYmVsIHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAxMnB4O1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX193YWxsZXQtZHJvcGRvd24ge1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgICZfX3dhbGxldC10cmlnZ2VyIHtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgZmxleDogMTtcbiAgICAgICAgbWluLXdpZHRoOiAwO1xuICAgICAgICBwYWRkaW5nOiAxNnB4O1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgYmFja2dyb3VuZDogbm9uZTtcbiAgICAgICAgb3V0bGluZTogbm9uZTtcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG5cbiAgICAgICAgJjpmb2N1cyB7XG4gICAgICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpmb2N1cy12aXNpYmxlIHtcbiAgICAgICAgICAgIG91dGxpbmU6IDJweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uO1xuICAgICAgICAgICAgb3V0bGluZS1vZmZzZXQ6IDJweDtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3dhbGxldC10cmlnZ2VyLXRleHQge1xuICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgIH1cblxuICAgICZfX3dhbGxldC10cmlnZ2VyLWljb24td3JhcHBlciB7XG4gICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAxNnB4O1xuICAgIH1cblxuICAgICZfX3dhbGxldC10cmlnZ2VyLWljb24ge1xuICAgICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4ycyBlYXNlO1xuICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICB3aWR0aDogMTJweDtcbiAgICAgICAgaGVpZ2h0OiA4cHg7XG5cbiAgICAgICAgJi0tb3BlbiB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgxODBkZWcpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fd2FsbGV0LW1lbnUge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIHRvcDogY2FsYygxMDAlICsgOHB4KTtcbiAgICAgICAgbGVmdDogMDtcbiAgICAgICAgcmlnaHQ6IDA7XG4gICAgICAgIHotaW5kZXg6IDEwMDA7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNHB4O1xuICAgICAgICBib3gtc2hhZG93OiAwIDRweCAxMnB4IHJnYmEoMCwgMCwgMCwgMC4xNSk7XG4gICAgICAgIHBhZGRpbmc6IDhweCAwO1xuICAgICAgICBtYXgtaGVpZ2h0OiAzMDBweDtcbiAgICAgICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgfVxuXG4gICAgJl9fd2FsbGV0LW1lbnUtaXRlbSB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgcGFkZGluZzogMTJweCAyNHB4O1xuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzIGVhc2U7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDQ4cHg7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAyNHB4O1xuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIH1cblxuICAgICAgICAmLS1zZWxlY3RlZCB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0O1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6YWN0aXZlIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fcGF5LWJ1dHRvbiB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBwYWRkaW5nOiAxNHB4IDI0cHg7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2U7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgbWluLWhlaWdodDogNDhweDtcblxuICAgICAgICAmLS1hdmF4IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsIHZhcmlhYmxlcy4kd2FybmluZyAwJSwgdmFyaWFibGVzLiR3YXJuaW5nIDEwMCUpO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0O1xuICAgICAgICAgICAgYm94LXNoYWRvdzogMCA0cHggMTZweCB2YXJpYWJsZXMuJHRoZW1lU2hhZG93O1xuXG4gICAgICAgICAgICAmOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XG4gICAgICAgICAgICAgICAgYm94LXNoYWRvdzogMCA2cHggMjBweCB2YXJpYWJsZXMuJHRoZW1lU2hhZG93O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJi0tc3RyaXBlIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsIHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gMCUsIHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAxMDAlKTtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dDtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgNHB4IDE2cHggdmFyaWFibGVzLiR0aGVtZVNoYWRvdztcblxuICAgICAgICAgICAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpO1xuICAgICAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgNnB4IDIwcHggdmFyaWFibGVzLiR0aGVtZVNoYWRvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICY6YWN0aXZlOm5vdCg6ZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6ZGlzYWJsZWQge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNztcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3BheW1lbnQtYWN0aW9ucyB7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX19jYW5jZWwtYnV0dG9uIHtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICAgICAgcGFkZGluZzogMTBweCAyMHB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19wcmljaW5nLWdyaWQge1xuICAgICAgICBkaXNwbGF5OiBncmlkO1xuICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdChhdXRvLWZpdCwgbWlubWF4KDMwMHB4LCAxZnIpKTtcbiAgICAgICAgZ2FwOiAyNHB4O1xuICAgICAgICBtYXJnaW4tYm90dG9tOiA0OHB4O1xuICAgIH1cblxuICAgICZfX3ByaWNpbmctY2FyZCB7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICBib3JkZXI6IDJweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgcGFkZGluZzogMzJweCAyNHB4O1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2U7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTRweCk7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDEycHggNDBweCB2YXJpYWJsZXMuJHRoZW1lU2hhZG93O1xuICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uO1xuICAgICAgICB9XG5cbiAgICAgICAgJi0tcG9wdWxhciB7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b247XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDhweCAzMnB4IHZhcmlhYmxlcy4kdGhlbWVTaGFkb3c7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMDIpO1xuXG4gICAgICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMDIpIHRyYW5zbGF0ZVkoLTRweCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmLS1jdXJyZW50IHtcbiAgICAgICAgICAgIGJvcmRlci1jb2xvcjogdmFyaWFibGVzLiRjb3JyZWN0O1xuICAgICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgdmFyaWFibGVzLiRjb3JyZWN0TGlnaHQgMCUsIHZhcmlhYmxlcy4kY29ycmVjdExpZ2h0IDEwMCUpO1xuICAgICAgICAgICAgYm94LXNoYWRvdzogMCA4cHggMzJweCB2YXJpYWJsZXMuJHRoZW1lU2hhZG93O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fY2FyZC1oZWFkZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAxNnB4O1xuICAgIH1cblxuICAgICZfX3BsYW4tbmFtZSB7XG4gICAgICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogLTAuNXB4O1xuICAgIH1cblxuICAgICZfX3BvcHVsYXItYmFkZ2Uge1xuICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uIDAlLCB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXIgMTAwJSk7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dDtcbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBwYWRkaW5nOiA0cHggMTJweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgIH1cblxuICAgICZfX3BsYW4tcHJpY2luZyB7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XG4gICAgfVxuXG4gICAgJl9fcHJpY2Uge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogYmFzZWxpbmU7XG4gICAgICAgIGdhcDogNHB4O1xuICAgIH1cblxuICAgICZfX2N1cnJlbmN5IHtcbiAgICAgICAgZm9udC1zaXplOiAyNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgfVxuXG4gICAgJl9fYW1vdW50IHtcbiAgICAgICAgZm9udC1zaXplOiA0OHB4O1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgIH1cblxuICAgICZfX3BlcmlvZCB7XG4gICAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgfVxuXG4gICAgJl9fcGxhbi10YWdsaW5lIHtcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMjRweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgICB9XG5cbiAgICAmX19wbGFuLWZlYXR1cmVzIHtcbiAgICAgICAgZmxleDogMTtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMzJweDtcbiAgICB9XG5cbiAgICAmX19mZWF0dXJlLWl0ZW0ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgICAgICAgZ2FwOiAxMnB4O1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAxMnB4O1xuICAgIH1cblxuICAgICZfX2ZlYXR1cmUtaWNvbiB7XG4gICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgICAgICBtYXJnaW4tdG9wOiAycHg7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3Q7XG4gICAgICAgIHdpZHRoOiAxNnB4O1xuICAgICAgICBoZWlnaHQ6IDE2cHg7XG4gICAgfVxuXG4gICAgJl9fZmVhdHVyZS10ZXh0IHtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjQ7XG4gICAgfVxuXG4gICAgJl9fcGF5bWVudC1vcHRpb25zIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiAxMnB4O1xuICAgICAgICBtYXJnaW4tdG9wOiBhdXRvO1xuICAgIH1cblxuICAgICZfX3BheW1lbnQtYnV0dG9uIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIHBhZGRpbmc6IDE0cHggMjRweDtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICAgICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogOHB4O1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDQ4cHg7XG5cbiAgICAgICAgJjpkaXNhYmxlZCB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgb3BhY2l0eTogMC43O1xuICAgICAgICB9XG5cbiAgICAgICAgJi0tc3RyaXBlIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsIHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gMCUsIHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAxMDAlKTtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dDtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgNHB4IDE2cHggdmFyaWFibGVzLiR0aGVtZVNoYWRvdztcblxuICAgICAgICAgICAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpO1xuICAgICAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgNnB4IDIwcHggdmFyaWFibGVzLiR0aGVtZVNoYWRvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICYtLWNyeXB0byB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCB2YXJpYWJsZXMuJHdhcm5pbmcgMCUsIHZhcmlhYmxlcy4kd2FybmluZyAxMDAlKTtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dDtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgNHB4IDE2cHggdmFyaWFibGVzLiR0aGVtZVNoYWRvdztcblxuICAgICAgICAgICAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpO1xuICAgICAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgNnB4IDIwcHggdmFyaWFibGVzLiR0aGVtZVNoYWRvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICY6YWN0aXZlOm5vdCg6ZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3BheW1lbnQtc3Bpbm5lciB7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgICAgd2lkdGg6IDIwcHg7XG4gICAgICAgIGhlaWdodDogMjBweDtcblxuICAgICAgICA6Om5nLWRlZXAgc3ZnIHtcbiAgICAgICAgICAgIHdpZHRoOiAyMHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiAyMHB4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fcGF5bWVudC1pY29uIHtcbiAgICAgICAgd2lkdGg6IDIwcHg7XG4gICAgICAgIGhlaWdodDogMjBweDtcbiAgICB9XG5cbiAgICAmX19wbGFuLWJ1dHRvbiB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBwYWRkaW5nOiAxNHB4IDI0cHg7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2U7XG4gICAgICAgIG1hcmdpbi10b3A6IGF1dG87XG5cbiAgICAgICAgJi0tY3VycmVudCB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJGNvcnJlY3RMaWdodDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3Q7XG4gICAgICAgICAgICBib3JkZXI6IDJweCBzb2xpZCB2YXJpYWJsZXMuJGNvcnJlY3Q7XG4gICAgICAgICAgICBjdXJzb3I6IGRlZmF1bHQ7XG5cbiAgICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogbm9uZTtcbiAgICAgICAgICAgICAgICBib3gtc2hhZG93OiBub25lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJjpkaXNhYmxlZCB7XG4gICAgICAgICAgICBvcGFjaXR5OiAwLjY7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5Aa2V5ZnJhbWVzIHNwaW4ge1xuICAgIDAlIHtcbiAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XG4gICAgfVxuICAgIDEwMCUge1xuICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICAgIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gICAgLmJpbGxpbmcge1xuICAgICAgICAmX19jb250ZW50IHtcbiAgICAgICAgICAgIHBhZGRpbmc6IDA7XG4gICAgICAgIH1cblxuICAgICAgICAmX19oZWFkZXIge1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMzJweDtcbiAgICAgICAgfVxuXG4gICAgICAgICZfX3RpdGxlIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMjhweDtcbiAgICAgICAgfVxuXG4gICAgICAgICZfX3N1YnRpdGxlIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgICAgfVxuXG4gICAgICAgICZfX3N1YnNjcmlwdGlvbiB7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAzMnB4O1xuICAgICAgICB9XG5cbiAgICAgICAgJl9fc3Vic2NyaXB0aW9uLXN0YXR1cyB7XG4gICAgICAgICAgICBtYXJnaW4tdG9wOiA2cHg7XG4gICAgICAgIH1cblxuICAgICAgICAmX19zdGF0dXMtdGV4dCB7XG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgIH1cblxuICAgICAgICAmX19wcmljaW5nLWdyaWQge1xuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XG4gICAgICAgICAgICBnYXA6IDIwcHg7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAzMnB4O1xuICAgICAgICB9XG5cbiAgICAgICAgJl9fcHJpY2luZy1jYXJkIHtcbiAgICAgICAgICAgIHBhZGRpbmc6IDI0cHggMjBweDtcblxuICAgICAgICAgICAgJi0tcG9wdWxhciB7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBub25lO1xuXG4gICAgICAgICAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMnB4KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmX19wbGFuLW5hbWUge1xuICAgICAgICAgICAgZm9udC1zaXplOiAyMHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgJl9fYW1vdW50IHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogNDBweDtcbiAgICAgICAgfVxuXG4gICAgICAgICZfX2ZlYXR1cmUtdGV4dCB7XG4gICAgICAgICAgICBmb250LXNpemU6IDEzcHg7XG4gICAgICAgIH1cblxuICAgICAgICAmX19wbGFuLWJ1dHRvbiB7XG4gICAgICAgICAgICBwYWRkaW5nOiAxMnB4IDIwcHg7XG4gICAgICAgICAgICBmb250LXNpemU6IDE1cHg7XG4gICAgICAgIH1cblxuICAgICAgICAmX19hY3RpdmF0aW9uLXN1Y2Nlc3Mge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIG1pbi1oZWlnaHQ6IDQwMHB4O1xuICAgICAgICAgICAgcGFkZGluZzogMjBweDtcbiAgICAgICAgfVxuXG4gICAgICAgICZfX2FjdGl2YXRpb24tY2FyZCB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgICAgICAgICBwYWRkaW5nOiA0OHB4IDMycHg7XG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDhweCAzMnB4IHZhcmlhYmxlcy4kdGhlbWVTaGFkb3c7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICAgICAgICAgIG1heC13aWR0aDogNTAwcHg7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgfVxuXG4gICAgICAgICZfX3N1Y2Nlc3MtaWNvbiB7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyNHB4O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdDtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IHB1bHNlIDJzIGluZmluaXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJl9fc3VjY2Vzcy10aXRsZSB7XG4gICAgICAgICAgICBmb250LXNpemU6IDI4cHg7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgbWFyZ2luOiAwIDAgMTZweCAwO1xuICAgICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IC0wLjVweDtcbiAgICAgICAgfVxuXG4gICAgICAgICZfX3N1Y2Nlc3MtbWVzc2FnZSB7XG4gICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgICAgIG1hcmdpbjogMCAwIDMycHggMDtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjU7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBrZXlmcmFtZXMgcHVsc2Uge1xuICAgIDAlLFxuICAgIDEwMCUge1xuICAgICAgICBvcGFjaXR5OiAxO1xuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgIH1cbiAgICA1MCUge1xuICAgICAgICBvcGFjaXR5OiAwLjg7XG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMS4wNSk7XG4gICAgfVxufVxuIiwiJHByaW1hcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXByaW1hcnksICMxODE4MTgpO1xuJHByaW1hcnlMaWdodDogI2RhZGRmYTtcbiRzZWNvbmRhcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXNlY29uZGFyeSwgI2ZmNTcyMSk7XG4kc2Vjb25kYXJ5Q29sb3JMaWdodDogI2Y2ZTVlMDtcblxuJGNvcnJlY3Q6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLCAjMWVhNDQ2KTtcbiRjb3JyZWN0RGFyazogIzBmNTIyMztcbiRjb3JyZWN0TGlnaHQ6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLXRleHQsICNlN2Y4ZWQpO1xuXG4kZXJyb3I6IHZhcigtLXpucy10aGVtZS1lcnJvciwgI2RjMzYyZSk7XG4kZXJyb3JEYXJrOiAjNjAxNDEwO1xuJGVycm9yTGlnaHQ6IHZhcigtLXpucy10aGVtZS1lcnJvci10ZXh0LCAjZmNlZWVlKTtcblxuJHdhcm5pbmc6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLCAjZGU2ODAwKTtcbiR3YXJuaW5nRGFyazogIzRhMjEwYTtcbiR3YXJuaW5nTGlnaHQ6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLXRleHQsICNmZmVlZTkpO1xuXG4kaW5mbzogIzM5OThkMztcbiRpbmZvRGFyazogIzAwNGE3NztcbiRpbmZvTGlnaHQ6ICNlY2YzZmU7XG5cbiRibGFjazogIzE4MTgxODtcbiR3aGl0ZTogI2ZmZmZmZjtcblxuJHRoZW1lQm9keUZhbWlseTogdmFyKC0tem5zLXRoZW1lLWJvZHktZmFtaWx5LCBcIlBvcHBpbnNcIiwgQXJpYWwsIHNhbnMtc2VyaWYpO1xuJHRoZW1lVGl0bGVGYW1pbHk6IHZhcigtLXpucy10aGVtZS10aXRsZS1mYW1pbHksIFwiTWVuZGFcIiwgXCJBcmlhbCBCbGFja1wiLCBzYW5zLXNlcmlmKTtcbiR0aGVtZU1vbm9zcGFjZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLW1vbm9zcGFjZS1mYW1pbHksIFwiQ291cmllciBOZXdcIiwgQ291cmllciwgbW9ub3NwYWNlKTtcblxuJHRoZW1lQmFja2dyb3VuZDogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQsICNmZmZmZmYpO1xuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQtc2Vjb25kYXJ5LCAjZjlmOWZjKTtcblxuJHRoZW1lVGV4dDogdmFyKC0tem5zLXRoZW1lLXRleHQsICMxODE4MTgpO1xuJHRoZW1lVGV4dE11dGVkOiB2YXIoLS16bnMtdGhlbWUtdGV4dC1tdXRlZCwgIzk2OTM5ZSk7XG4kdGhlbWVUZXh0U2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtdGV4dC1zZWNvbmRhcnksICM3Mzc3N2YpO1xuXG4kdGhlbWVIZWFkZXI6IHZhcigtLXpucy10aGVtZS1oZWFkZXIsICMxODE4MTgpO1xuJHRoZW1lSGVhZGVyVGV4dDogdmFyKC0tem5zLXRoZW1lLWhlYWRlci10ZXh0LCAjZmZmZmZmKTtcblxuJHRoZW1lQnV0dG9uOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLCAjMTgxODE4KTtcbiR0aGVtZUJ1dHRvblRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tdGV4dCwgI2ZmZmZmZik7XG4kdGhlbWVCdXR0b25Ib3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1ob3ZlciwgI2ZmNTcyMSk7XG5cbiR0aGVtZUJ1dHRvblNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnksICNlOWVjZWYpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktdGV4dCwgIzQ5NTA1Nyk7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktaG92ZXIsICNlOWVjZWYpO1xuXG4kdGhlbWVCb3JkZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXIsICNlM2UzZTMpO1xuJHRoZW1lQm9yZGVySG92ZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXItaG92ZXIsICNjM2M2Y2YpO1xuXG4kdGhlbWVDYXJkOiB2YXIoLS16bnMtdGhlbWUtY2FyZCwgI2ZmZmZmZik7XG4kdGhlbWVDYXJkQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtY2FyZC1ib3JkZXIsICNlZWVkZjEpO1xuXG4kdGhlbWVTaGFkb3c6IHZhcigtLXpucy10aGVtZS1zaGFkb3csIHJnYmEoMCwgMCwgMCwgMC4xKSk7XG5cbiRzbW9vdGhCZXppZXI6IGN1YmljLWJlemllcigwLjI1LCAwLjQsIDAuNywgMSk7XG5cbiRtYXhFeHRyYVNtYWxsOiA1OTVweDtcbiRtaW5TbWFsbDogNjAwcHg7XG4kbWVkaXVtOiA3NjhweDtcbiRsYXJnZTogODg5cHg7XG4kY29tcHV0ZXJzOiAxMjAwcHg7XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }

}]);
//# sourceMappingURL=src_app_zelf-keys_zelf-keys-billing_zelf-keys-billing_component_ts.js.map