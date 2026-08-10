"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["default-src_app_blockchain-networks_service_ts-src_app_services_settings_service_ts-src_app_z-da6cb3"],{

/***/ 29809
/*!************************************************!*\
  !*** ./src/app/blockchain-networks.service.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BlockchainNetworksService: () => (/* binding */ BlockchainNetworksService)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _chrome_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chrome.service */ 85043);



class BlockchainNetworksService {
  _chromeService;
  selectedNetwork;
  currentSuiNetwork = "mainnet"; // Default network, adjust as needed
  constructor(_chromeService) {
    this._chromeService = _chromeService;
  }
  _initNetwork() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this.selectedNetwork = yield _this._chromeService.getItem("network");
      if (!_this.selectedNetwork) {
        _this.selectedNetwork = "eth";
        yield _this._chromeService.setItem("network", _this.selectedNetwork);
      }
      return _this.selectedNetwork;
    })();
  }
  getSelectedNetwork() {
    return this.selectedNetwork || "eth";
  }
  setSelectedNetwork(code) {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this2.selectedNetwork = code;
      yield _this2._chromeService.setItem("network", _this2.selectedNetwork);
    })();
  }
  getCurrentSuiNetwork() {
    return this.currentSuiNetwork;
  }
  setCurrentSuiNetwork(network) {
    this.currentSuiNetwork = network;
  }
  static ɵfac = function BlockchainNetworksService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || BlockchainNetworksService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_chrome_service__WEBPACK_IMPORTED_MODULE_2__.ChromeService));
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: BlockchainNetworksService,
    factory: BlockchainNetworksService.ɵfac,
    providedIn: "root"
  });
}

/***/ },

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

/***/ 87752
/*!******************************************************************************************!*\
  !*** ./src/app/zelf-wallet/wallet-balance-top-card/wallet-balance-top-card.component.ts ***!
  \******************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WalletBalanceTopCardComponent: () => (/* binding */ WalletBalanceTopCardComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/flex-layout */ 39981);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 34487);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/flex-layout/flex */ 91447);








const _c0 = () => ["/receive"];
const _c1 = () => ["/swap"];
const _c2 = () => ["/send"];
const _c3 = () => ["/activity"];
function WalletBalanceTopCardComponent_div_0_div_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function WalletBalanceTopCardComponent_div_0_h3_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "h3", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](2, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind4"](2, 1, ctx_r1.totalFiatBalance || 0, "USD", "symbol", "1.2-5"), " ");
  }
}
function WalletBalanceTopCardComponent_div_0_h3_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "h3", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "\u2022\u2022\u2022\u2022\u2022\u2022");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function WalletBalanceTopCardComponent_div_0_button_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function WalletBalanceTopCardComponent_div_0_button_17_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r1.emitRefresh());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "svg", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "path", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("home-balance__refresh--spinning", ctx_r1.balancesLoading);
  }
}
function WalletBalanceTopCardComponent_div_0__svg_svg_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "svg", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "path", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function WalletBalanceTopCardComponent_div_0__svg_svg_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "svg", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "path", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function WalletBalanceTopCardComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "div", 4)(4, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "svg", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](6, "rect", 7)(7, "path", 8)(8, "path", 9)(9, "path", 10)(10, "path", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "span", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](14, WalletBalanceTopCardComponent_div_0_div_14_Template, 2, 0, "div", 14)(15, WalletBalanceTopCardComponent_div_0_h3_15_Template, 3, 6, "h3", 15)(16, WalletBalanceTopCardComponent_div_0_h3_16_Template, 2, 0, "h3", 15)(17, WalletBalanceTopCardComponent_div_0_button_17_Template, 3, 2, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](18, "button", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function WalletBalanceTopCardComponent_div_0_Template_button_click_18_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r1.emitToggleHide());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](19, WalletBalanceTopCardComponent_div_0__svg_svg_19_Template, 2, 0, "svg", 18)(20, WalletBalanceTopCardComponent_div_0__svg_svg_20_Template, 2, 0, "svg", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "div", 19)(22, "div", 20)(23, "div", 21)(24, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](25, "svg", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](26, "path", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](27, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "div", 20)(30, "div", 21)(31, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](32, "svg", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](33, "path", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](34, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](35);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](36, "div", 20)(37, "div", 21)(38, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](39, "svg", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](40, "path", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](41, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](42);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](43, "div", 30)(44, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](45);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](46, "svg", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](47, "path", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const t_r4 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](t_r4("home.total_balance"));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r1.balancesLoading && !ctx_r1.hideBalances);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r1.balancesLoading && !ctx_r1.hideBalances);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r1.hideBalances);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r1.hideBalances);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵattribute"]("aria-label", ctx_r1.hideBalances ? t_r4("home.show_balances") : t_r4("home.hide_balances"));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r1.hideBalances);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r1.hideBalances);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](16, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](t_r4("home.receive_transaction_button"));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](17, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](t_r4("home.swap"));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](18, _c2));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](t_r4("home.send_transaction_button"));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](19, _c3));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](t_r4("home.recent_transactions"));
  }
}
class WalletBalanceTopCardComponent {
  totalFiatBalance;
  balancesLoading;
  hideBalances;
  refresh = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
  toggleHide = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
  emitRefresh() {
    this.refresh.emit();
  }
  emitToggleHide() {
    this.toggleHide.emit();
  }
  static ɵfac = function WalletBalanceTopCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || WalletBalanceTopCardComponent)();
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: WalletBalanceTopCardComponent,
    selectors: [["wallet-balance-top-card"]],
    inputs: {
      totalFiatBalance: "totalFiatBalance",
      balancesLoading: "balancesLoading",
      hideBalances: "hideBalances"
    },
    outputs: {
      refresh: "refresh",
      toggleHide: "toggleHide"
    },
    decls: 1,
    vars: 0,
    consts: [["class", "home__balance-card", 4, "transloco"], [1, "home__balance-card"], [1, "home__actions-container"], [1, "home-balance"], [1, "home-balance__info"], [1, "home-balance__label-row"], ["width", "20", "height", "20", "viewBox", "0 0 40 40", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "home-balance__brand-icon"], ["width", "40", "height", "40", "rx", "20", "fill", "#FF5C00"], ["d", "M20.0108 8C21.363 9.83518 23.0993 11.9272 25.2883 14.0893H15.4609C17.5873 11.8373 19.0426 9.67625 20.0128 8H20.0118H20.0108Z", "fill", "white"], ["d", "M8 20.0292C9.7302 19.1896 12.0031 17.8722 14.2841 15.8571C14.4852 15.6792 14.6823 15.4992 14.8713 15.3203H23.6597C23.6597 15.3203 17.2948 24.3153 13.8121 24.3423C10.9389 24.3652 9.73525 21.0997 8 20.0282V20.0292Z", "fill", "white"], ["d", "M20.5727 31.9996C19.5125 30.5603 18.1472 28.917 16.418 27.2168H24.499C22.787 28.942 21.5085 30.6073 20.5737 31.9996H20.5727Z", "fill", "white"], ["d", "M25.7777 25.7316C25.6827 25.8155 25.5897 25.9005 25.4977 25.9845H16.0625C16.0625 25.9845 22.5325 16.8726 26.0617 16.8536C29.0066 16.8386 30.2265 20.1821 31.9991 21.2766C30.1962 22.2891 28.0011 23.7295 25.7767 25.7316H25.7777Z", "fill", "white"], [1, "home-balance__label"], [1, "home-balance__amount-row"], ["class", "home-balance__amount-skeleton", 4, "ngIf"], ["class", "home-balance__amount", 4, "ngIf"], ["type", "button", "class", "home-balance__refresh", 3, "home-balance__refresh--spinning", "click", 4, "ngIf"], ["type", "button", 1, "home-balance__visibility", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "viewBox", "0 -960 960 960", 4, "ngIf"], ["fxLayout", "row", "fxLayoutAlign", "start center", 1, "home__actions", "home__action-buttons"], [1, "zelf-action-button"], [1, "zelf-action-button__icon", 3, "routerLink"], [1, "zelf-action-button__icon-box"], ["width", "17", "height", "18", "viewBox", "0 0 17 18", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M16.6755 0.834414C16.2205 0.379414 15.4855 0.379414 15.0305 0.834414L2.32552 13.5277V7.00608C2.32552 6.36441 1.80052 5.83941 1.15885 5.83941C0.517187 5.83941 -0.0078125 6.36441 -0.0078125 7.00608V16.3394C-0.0078125 16.9811 0.517187 17.5061 1.15885 17.5061H10.4922C11.1339 17.5061 11.6589 16.9811 11.6589 16.3394C11.6589 15.6977 11.1339 15.1727 10.4922 15.1727H3.97052L16.6755 2.46775C17.1189 2.02441 17.1189 1.27775 16.6755 0.834414Z"], [1, "zelf-action-button__text"], ["width", "24", "height", "19", "viewBox", "0 0 18 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M3.13563 6.85496L0.355635 9.64496C0.165635 9.84496 0.165635 10.155 0.355635 10.355L3.13563 13.145C3.44563 13.465 3.98563 13.235 3.98563 12.795V10.995H9.99564C10.5456 10.995 10.9956 10.545 10.9956 9.99496C10.9956 9.44496 10.5456 8.99496 9.99564 8.99496H3.98563V7.20496C3.98563 6.75496 3.44563 6.53496 3.13563 6.85496ZM17.6456 3.64496L14.8656 0.854961C14.5556 0.534961 14.0156 0.764961 14.0156 1.20496V2.99496H7.99564C7.44563 2.99496 6.99564 3.44496 6.99564 3.99496C6.99564 4.54496 7.44563 4.99496 7.99564 4.99496H14.0056V6.78496C14.0056 7.23496 14.5456 7.45496 14.8556 7.13496L17.6356 4.34496C17.8356 4.15496 17.8356 3.83496 17.6456 3.64496Z"], ["width", "19", "height", "18", "viewBox", "0 0 19 18", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M6.34571 1.65397C6.34571 2.3073 6.87071 2.82064 7.51238 2.82064H14.034L1.32904 15.5256C0.874043 15.9806 0.874043 16.7156 1.32904 17.1706C1.78404 17.6256 2.51904 17.6256 2.97404 17.1706L15.679 4.46564V10.9873C15.679 11.629 16.204 12.154 16.8457 12.154C17.4874 12.154 18.0124 11.629 18.0124 10.9873V1.65397C18.0124 1.0123 17.4874 0.487305 16.8457 0.487305H7.51238C6.87071 0.487305 6.34571 1.0123 6.34571 1.65397Z"], [1, "home__recent-transactions", 3, "routerLink"], [1, "home__recent-transactions__label"], ["width", "8", "height", "14", "viewBox", "0 0 8 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M1 1L7 7L1 13", "stroke", "currentColor", "stroke-width", "1.5", "stroke-linecap", "round", "stroke-linejoin", "round"], [1, "home-balance__amount-skeleton"], [1, "home-balance__skeleton-bar"], [1, "home-balance__amount"], ["type", "button", 1, "home-balance__refresh", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "viewBox", "0 -960 960 960"], ["d", "M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"], ["d", "M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z"], ["d", "m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Z"]],
    template: function WalletBalanceTopCardComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](0, WalletBalanceTopCardComponent_div_0_Template, 48, 20, "div", 0);
      }
    },
    dependencies: [_angular_flex_layout__WEBPACK_IMPORTED_MODULE_2__.FlexLayoutModule, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_6__.DefaultLayoutDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_6__.DefaultLayoutAlignDirective, _angular_common__WEBPACK_IMPORTED_MODULE_0__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__.TranslocoDirective, _angular_common__WEBPACK_IMPORTED_MODULE_0__.CurrencyPipe],
    styles: ["*[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n}\n\n.home__balance-card[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  border: 1px solid transparent;\n  background: linear-gradient(var(--zns-theme-card-border, #eeedf1), var(--zns-theme-card-border, #eeedf1)) padding-box, linear-gradient(135deg, var(--zns-theme-border-hover, #c3c6cf), var(--zns-theme-card-border, #eeedf1)) border-box;\n  border-radius: calc(20px * var(--zns-space-scale, 1));\n  padding: calc(16px * var(--zns-space-scale, 1));\n}\n@media (max-width: 600px) {\n  .home__balance-card[_ngcontent-%COMP%] {\n    border-radius: calc(16px * var(--zns-space-scale, 1));\n    padding: calc(10px * var(--zns-space-scale, 1));\n  }\n}\n\nhtml.zns-theme-light[_nghost-%COMP%]   .home__balance-card[_ngcontent-%COMP%], html.zns-theme-light   [_nghost-%COMP%]   .home__balance-card[_ngcontent-%COMP%] {\n  background: white;\n}\n\n.home__actions-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: stretch;\n  width: 100%;\n}\n\n.home__actions[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: calc(16px * var(--zns-space-scale, 1));\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n}\n@media (max-width: 600px) {\n  .home__actions[_ngcontent-%COMP%] {\n    margin-top: calc(10px * var(--zns-space-scale, 1));\n    gap: calc(6px * var(--zns-space-scale, 1));\n  }\n}\n\n.home__action-buttons[_ngcontent-%COMP%]   .zelf-action-button__icon[_ngcontent-%COMP%] {\n  border-radius: calc(16px * var(--zns-space-scale, 1));\n  width: calc(100px * var(--zns-space-scale, 1));\n}\n\n.home-balance[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  width: 100%;\n}\n.home-balance__info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: flex-start;\n  gap: calc(4px * var(--zns-space-scale, 1));\n}\n.home-balance__label-row[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: calc(6px * var(--zns-space-scale, 1));\n}\n.home-balance__brand-icon[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  display: block;\n}\n.home-balance__label[_ngcontent-%COMP%] {\n  font-size: calc(13px * var(--zns-font-scale, 1));\n  font-weight: 400;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  letter-spacing: 0.3px;\n}\n.home-balance__amount-row[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n}\n.home-balance__amount[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-size: calc(40px * var(--zns-font-scale, 1));\n  font-weight: 800;\n  line-height: calc(44px * var(--zns-font-scale, 1));\n  margin: 0;\n  word-wrap: break-word;\n}\n@media (max-width: 600px) {\n  .home-balance__amount[_ngcontent-%COMP%] {\n    font-size: calc(32px * var(--zns-font-scale, 1));\n    line-height: calc(36px * var(--zns-font-scale, 1));\n  }\n}\n.home-balance__refresh[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: calc(4px * var(--zns-space-scale, 1));\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  line-height: 0;\n  border-radius: 50%;\n  transition: background-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.home-balance__refresh[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: calc(22px * var(--zns-font-scale, 1));\n  height: calc(22px * var(--zns-font-scale, 1));\n  fill: var(--zns-theme-text-secondary, #73777f);\n  transition: fill 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.home-balance__refresh[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-card-border, #eeedf1);\n}\n.home-balance__refresh[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.home-balance__refresh--spinning[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n.home-balance__visibility[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: calc(6px * var(--zns-space-scale, 1));\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  line-height: 0;\n  border-radius: 50%;\n  transition: background-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n  align-self: flex-start;\n  flex-shrink: 0;\n}\n.home-balance__visibility[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: calc(22px * var(--zns-font-scale, 1));\n  height: calc(22px * var(--zns-font-scale, 1));\n  fill: var(--zns-theme-text-secondary, #73777f);\n  transition: fill 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.home-balance__visibility[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-card-border, #eeedf1);\n}\n.home-balance__visibility[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.home-balance__amount-skeleton[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n}\n.home-balance__skeleton-bar[_ngcontent-%COMP%] {\n  width: calc(160px * var(--zns-space-scale, 1));\n  height: calc(40px * var(--zns-font-scale, 1));\n  background: var(--zns-theme-border, #e3e3e3);\n  border-radius: calc(8px * var(--zns-space-scale, 1));\n  position: relative;\n  overflow: hidden;\n}\n.home-balance__skeleton-bar[_ngcontent-%COMP%]::after {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  transform: translateX(-100%);\n  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);\n  animation: _ngcontent-%COMP%_shimmer 1.5s infinite;\n}\n@media (max-width: 600px) {\n  .home-balance__skeleton-bar[_ngcontent-%COMP%] {\n    height: calc(32px * var(--zns-font-scale, 1));\n  }\n}\n\n.home__recent-transactions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  margin-top: calc(16px * var(--zns-space-scale, 1));\n  padding-top: calc(12px * var(--zns-space-scale, 1));\n  cursor: pointer;\n  transition: opacity 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.home__recent-transactions[_ngcontent-%COMP%]:hover {\n  opacity: 0.7;\n}\n.home__recent-transactions__label[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  font-weight: 400;\n  color: var(--zns-theme-text, #181818);\n}\n.home__recent-transactions__label[_ngcontent-%COMP%]:hover {\n  font-weight: 700;\n}\n.home__recent-transactions[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text-secondary, #73777f);\n  flex-shrink: 0;\n}\n\n@keyframes _ngcontent-%COMP%_spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n@keyframes _ngcontent-%COMP%_shimmer {\n  100% {\n    transform: translateX(100%);\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvemVsZi13YWxsZXQvd2FsbGV0LWJhbGFuY2UtdG9wLWNhcmQvd2FsbGV0LWJhbGFuY2UtdG9wLWNhcmQuY29tcG9uZW50LnNjc3MiLCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL192YXJpYWJsZXMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNJLHNCQUFBO0FBREo7O0FBSUE7RUFDSSxjQUFBO0VBQ0EsV0FBQTtBQURKOztBQUlBO0VBQ0ksa0JBQUE7RUFDQSxXQUFBO0VBQ0EsNkJBQUE7RUFDQSx3T0FDSTtFQUVKLHFEQUFBO0VBQ0EsK0NBQUE7QUFISjtBQUtJO0VBVko7SUFXUSxxREFBQTtJQUNBLCtDQUFBO0VBRk47QUFDRjs7QUFNSTtFQUNJLGlCQUFBO0FBSFI7O0FBT0E7RUFDSSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSwyQkFBQTtFQUNBLG9CQUFBO0VBQ0EsV0FBQTtBQUpKOztBQU9BO0VBQ0ksV0FBQTtFQUNBLGtEQUFBO0VBQ0EsYUFBQTtFQUNBLDJCQUFBO0VBQ0EsbUJBQUE7RUFDQSwwQ0FBQTtBQUpKO0FBTUk7RUFSSjtJQVNRLGtEQUFBO0lBQ0EsMENBQUE7RUFITjtBQUNGOztBQU9JO0VBQ0kscURBQUE7RUFDQSw4Q0FBQTtBQUpSOztBQVFBO0VBQ0ksa0JBQUE7RUFDQSxhQUFBO0VBQ0EsdUJBQUE7RUFDQSw4QkFBQTtFQUNBLFdBQUE7QUFMSjtBQU9JO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsMkJBQUE7RUFDQSx1QkFBQTtFQUNBLDBDQUFBO0FBTFI7QUFRSTtFQUNJLG9CQUFBO0VBQ0EsbUJBQUE7RUFDQSwwQ0FBQTtBQU5SO0FBU0k7RUFDSSxjQUFBO0VBQ0EsY0FBQTtBQVBSO0FBVUk7RUFDSSxnREFBQTtFQUNBLGdCQUFBO0VBQ0EsK0NDMURhO0VEMkRiLHVFQ3BFVTtFRHFFVixxQkFBQTtBQVJSO0FBV0k7RUFDSSxvQkFBQTtFQUNBLG1CQUFBO0VBQ0EsMENBQUE7QUFUUjtBQVlJO0VBQ0kscUNDeEVJO0VEeUVKLGdEQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrREFBQTtFQUNBLFNBQUE7RUFDQSxxQkFBQTtBQVZSO0FBWVE7RUFSSjtJQVNRLGdEQUFBO0lBQ0Esa0RBQUE7RUFUVjtBQUNGO0FBWUk7RUFDSSxnQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsOENBQUE7RUFDQSxvQkFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxjQUFBO0VBQ0EsY0FBQTtFQUNBLGtCQUFBO0VBQ0EsaUVBQUE7QUFWUjtBQVlRO0VBQ0ksNENBQUE7RUFDQSw2Q0FBQTtFQUNBLDhDQ25HUztFRG9HVCxxREFBQTtBQVZaO0FBYVE7RUFDSSx1REN2Rk07QUQ0RWxCO0FBYVk7RUFDSSxvQ0M3R0o7QURrR1o7QUFlUTtFQUNJLGtDQUFBO0FBYlo7QUFpQkk7RUFDSSxnQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsOENBQUE7RUFDQSxvQkFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxjQUFBO0VBQ0Esa0JBQUE7RUFDQSxpRUFBQTtFQUNBLHNCQUFBO0VBQ0EsY0FBQTtBQWZSO0FBaUJRO0VBQ0ksNENBQUE7RUFDQSw2Q0FBQTtFQUNBLDhDQ3JJUztFRHNJVCxxREFBQTtBQWZaO0FBa0JRO0VBQ0ksdURDekhNO0FEeUdsQjtBQWtCWTtFQUNJLG9DQy9JSjtBRCtIWjtBQXFCSTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLDJCQUFBO0FBbkJSO0FBc0JJO0VBQ0ksOENBQUE7RUFDQSw2Q0FBQTtFQUNBLDRDQzlJTTtFRCtJTixvREFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7QUFwQlI7QUFzQlE7RUFDSSxXQUFBO0VBQ0Esa0JBQUE7RUFDQSxNQUFBO0VBQ0EsUUFBQTtFQUNBLFNBQUE7RUFDQSxPQUFBO0VBQ0EsNEJBQUE7RUFDQSxzRkFBQTtFQUNBLGdDQUFBO0FBcEJaO0FBdUJRO0VBcEJKO0lBcUJRLDZDQUFBO0VBcEJWO0FBQ0Y7O0FBd0JBO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsOEJBQUE7RUFDQSxXQUFBO0VBQ0Esa0RBQUE7RUFDQSxtREFBQTtFQUNBLGVBQUE7RUFDQSx3REFBQTtBQXJCSjtBQXVCSTtFQUNJLFlBQUE7QUFyQlI7QUF3Qkk7RUFDSSx1RUMxTVU7RUQyTVYsZ0RBQUE7RUFDQSxnQkFBQTtFQUNBLHFDQ3RNSTtBRGdMWjtBQXdCUTtFQUNJLGdCQUFBO0FBdEJaO0FBMEJJO0VBQ0ksK0NDNU1hO0VENk1iLGNBQUE7QUF4QlI7O0FBNEJBO0VBQ0k7SUFDSSx1QkFBQTtFQXpCTjtFQTRCRTtJQUNJLHlCQUFBO0VBMUJOO0FBQ0Y7QUE2QkE7RUFDSTtJQUNJLDJCQUFBO0VBM0JOO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwiLi4vLi4vLi4vc3R5bGVzL3ZhcmlhYmxlc1wiO1xuXG4qIHtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG46aG9zdCB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgd2lkdGg6IDEwMCU7XG59XG5cbi5ob21lX19iYWxhbmNlLWNhcmQge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB0cmFuc3BhcmVudDtcbiAgICBiYWNrZ3JvdW5kOlxuICAgICAgICBsaW5lYXItZ3JhZGllbnQodmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXIsIHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyKSBwYWRkaW5nLWJveCxcbiAgICAgICAgbGluZWFyLWdyYWRpZW50KDEzNWRlZywgdmFyaWFibGVzLiR0aGVtZUJvcmRlckhvdmVyLCB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcikgYm9yZGVyLWJveDtcbiAgICBib3JkZXItcmFkaXVzOiBjYWxjKDIwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICBwYWRkaW5nOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcblxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiB2YXJpYWJsZXMuJG1pblNtYWxsKSB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IGNhbGMoMTZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDEwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG59XG5cbjpob3N0LWNvbnRleHQoaHRtbC56bnMtdGhlbWUtbGlnaHQpIHtcbiAgICAuaG9tZV9fYmFsYW5jZS1jYXJkIHtcbiAgICAgICAgYmFja2dyb3VuZDogd2hpdGU7XG4gICAgfVxufVxuXG4uaG9tZV9fYWN0aW9ucy1jb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XG4gICAgd2lkdGg6IDEwMCU7XG59XG5cbi5ob21lX19hY3Rpb25zIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBtYXJnaW4tdG9wOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcblxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiB2YXJpYWJsZXMuJG1pblNtYWxsKSB7XG4gICAgICAgIG1hcmdpbi10b3A6IGNhbGMoMTBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBnYXA6IGNhbGMoNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgfVxufVxuXG4uaG9tZV9fYWN0aW9uLWJ1dHRvbnMge1xuICAgIC56ZWxmLWFjdGlvbi1idXR0b25fX2ljb24ge1xuICAgICAgICBib3JkZXItcmFkaXVzOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgd2lkdGg6IGNhbGMoMTAwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG59XG5cbi5ob21lLWJhbGFuY2Uge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICB3aWR0aDogMTAwJTtcblxuICAgICZfX2luZm8ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgICAgICBnYXA6IGNhbGMoNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgfVxuXG4gICAgJl9fbGFiZWwtcm93IHtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogY2FsYyg2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19icmFuZC1pY29uIHtcbiAgICAgICAgZmxleC1zaHJpbms6IDA7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIH1cblxuICAgICZfX2xhYmVsIHtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEzcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LXdlaWdodDogNDAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuM3B4O1xuICAgIH1cblxuICAgICZfX2Ftb3VudC1yb3cge1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX2Ftb3VudCB7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDQwcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LXdlaWdodDogODAwO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYyg0NHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICB3b3JkLXdyYXA6IGJyZWFrLXdvcmQ7XG5cbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IHZhcmlhYmxlcy4kbWluU21hbGwpIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogY2FsYygzMnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDM2cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fcmVmcmVzaCB7XG4gICAgICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgICAgICBsaW5lLWhlaWdodDogMDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgICAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMnMgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIHdpZHRoOiBjYWxjKDIycHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICAgICAgaGVpZ2h0OiBjYWxjKDIycHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBmaWxsIDAuMnMgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJi0tc3Bpbm5pbmcgc3ZnIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogc3BpbiAxcyBsaW5lYXIgaW5maW5pdGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX192aXNpYmlsaXR5IHtcbiAgICAgICAgYmFja2dyb3VuZDogbm9uZTtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIHBhZGRpbmc6IGNhbGMoNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDA7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICBhbGlnbi1zZWxmOiBmbGV4LXN0YXJ0O1xuICAgICAgICBmbGV4LXNocmluazogMDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgd2lkdGg6IGNhbGMoMjJweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgICAgICBoZWlnaHQ6IGNhbGMoMjJweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGZpbGwgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICAgICAgfVxuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19hbW91bnQtc2tlbGV0b24ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgfVxuXG4gICAgJl9fc2tlbGV0b24tYmFyIHtcbiAgICAgICAgd2lkdGg6IGNhbGMoMTYwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgaGVpZ2h0OiBjYWxjKDQwcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyO1xuICAgICAgICBib3JkZXItcmFkaXVzOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgICAgICAgJjo6YWZ0ZXIge1xuICAgICAgICAgICAgY29udGVudDogXCJcIjtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgIHRvcDogMDtcbiAgICAgICAgICAgIHJpZ2h0OiAwO1xuICAgICAgICAgICAgYm90dG9tOiAwO1xuICAgICAgICAgICAgbGVmdDogMDtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTAwJSk7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoOTBkZWcsIHRyYW5zcGFyZW50LCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNCksIHRyYW5zcGFyZW50KTtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogc2hpbW1lciAxLjVzIGluZmluaXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IHZhcmlhYmxlcy4kbWluU21hbGwpIHtcbiAgICAgICAgICAgIGhlaWdodDogY2FsYygzMnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLmhvbWVfX3JlY2VudC10cmFuc2FjdGlvbnMge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgbWFyZ2luLXRvcDogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgcGFkZGluZy10b3A6IGNhbGMoMTJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMnMgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgICAgb3BhY2l0eTogMC43O1xuICAgIH1cblxuICAgICZfX2xhYmVsIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdmcge1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgIH1cbn1cblxuQGtleWZyYW1lcyBzcGluIHtcbiAgICBmcm9tIHtcbiAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XG4gICAgfVxuXG4gICAgdG8ge1xuICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICAgIH1cbn1cblxuQGtleWZyYW1lcyBzaGltbWVyIHtcbiAgICAxMDAlIHtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDEwMCUpO1xuICAgIH1cbn1cbiIsIiRwcmltYXJ5Q29sb3I6IHZhcigtLXpucy10aGVtZS1wcmltYXJ5LCAjMTgxODE4KTtcbiRwcmltYXJ5TGlnaHQ6ICNkYWRkZmE7XG4kc2Vjb25kYXJ5Q29sb3I6IHZhcigtLXpucy10aGVtZS1zZWNvbmRhcnksICNmZjU3MjEpO1xuJHNlY29uZGFyeUNvbG9yTGlnaHQ6ICNmNmU1ZTA7XG5cbiRjb3JyZWN0OiB2YXIoLS16bnMtdGhlbWUtc3VjY2VzcywgIzFlYTQ0Nik7XG4kY29ycmVjdERhcms6ICMwZjUyMjM7XG4kY29ycmVjdExpZ2h0OiB2YXIoLS16bnMtdGhlbWUtc3VjY2Vzcy10ZXh0LCAjZTdmOGVkKTtcblxuJGVycm9yOiB2YXIoLS16bnMtdGhlbWUtZXJyb3IsICNkYzM2MmUpO1xuJGVycm9yRGFyazogIzYwMTQxMDtcbiRlcnJvckxpZ2h0OiB2YXIoLS16bnMtdGhlbWUtZXJyb3ItdGV4dCwgI2ZjZWVlZSk7XG5cbiR3YXJuaW5nOiB2YXIoLS16bnMtdGhlbWUtd2FybmluZywgI2RlNjgwMCk7XG4kd2FybmluZ0Rhcms6ICM0YTIxMGE7XG4kd2FybmluZ0xpZ2h0OiB2YXIoLS16bnMtdGhlbWUtd2FybmluZy10ZXh0LCAjZmZlZWU5KTtcblxuJGluZm86ICMzOTk4ZDM7XG4kaW5mb0Rhcms6ICMwMDRhNzc7XG4kaW5mb0xpZ2h0OiAjZWNmM2ZlO1xuXG4kYmxhY2s6ICMxODE4MTg7XG4kd2hpdGU6ICNmZmZmZmY7XG5cbiR0aGVtZUJvZHlGYW1pbHk6IHZhcigtLXpucy10aGVtZS1ib2R5LWZhbWlseSwgXCJQb3BwaW5zXCIsIEFyaWFsLCBzYW5zLXNlcmlmKTtcbiR0aGVtZVRpdGxlRmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtdGl0bGUtZmFtaWx5LCBcIk1lbmRhXCIsIFwiQXJpYWwgQmxhY2tcIiwgc2Fucy1zZXJpZik7XG4kdGhlbWVNb25vc3BhY2VGYW1pbHk6IHZhcigtLXpucy10aGVtZS1tb25vc3BhY2UtZmFtaWx5LCBcIkNvdXJpZXIgTmV3XCIsIENvdXJpZXIsIG1vbm9zcGFjZSk7XG5cbiR0aGVtZUJhY2tncm91bmQ6IHZhcigtLXpucy10aGVtZS1iYWNrZ3JvdW5kLCAjZmZmZmZmKTtcbiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS1iYWNrZ3JvdW5kLXNlY29uZGFyeSwgI2Y5ZjlmYyk7XG5cbiR0aGVtZVRleHQ6IHZhcigtLXpucy10aGVtZS10ZXh0LCAjMTgxODE4KTtcbiR0aGVtZVRleHRNdXRlZDogdmFyKC0tem5zLXRoZW1lLXRleHQtbXV0ZWQsICM5NjkzOWUpO1xuJHRoZW1lVGV4dFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLXRleHQtc2Vjb25kYXJ5LCAjNzM3NzdmKTtcblxuJHRoZW1lSGVhZGVyOiB2YXIoLS16bnMtdGhlbWUtaGVhZGVyLCAjMTgxODE4KTtcbiR0aGVtZUhlYWRlclRleHQ6IHZhcigtLXpucy10aGVtZS1oZWFkZXItdGV4dCwgI2ZmZmZmZik7XG5cbiR0aGVtZUJ1dHRvbjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbiwgIzE4MTgxOCk7XG4kdGhlbWVCdXR0b25UZXh0OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXRleHQsICNmZmZmZmYpO1xuJHRoZW1lQnV0dG9uSG92ZXI6IHZhcigtLXpucy10aGVtZS1idXR0b24taG92ZXIsICNmZjU3MjEpO1xuXG4kdGhlbWVCdXR0b25TZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LCAjZTllY2VmKTtcbiR0aGVtZUJ1dHRvblNlY29uZGFyeVRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LXRleHQsICM0OTUwNTcpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5SG92ZXI6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LWhvdmVyLCAjZTllY2VmKTtcblxuJHRoZW1lQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtYm9yZGVyLCAjZTNlM2UzKTtcbiR0aGVtZUJvcmRlckhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYm9yZGVyLWhvdmVyLCAjYzNjNmNmKTtcblxuJHRoZW1lQ2FyZDogdmFyKC0tem5zLXRoZW1lLWNhcmQsICNmZmZmZmYpO1xuJHRoZW1lQ2FyZEJvcmRlcjogdmFyKC0tem5zLXRoZW1lLWNhcmQtYm9yZGVyLCAjZWVlZGYxKTtcblxuJHRoZW1lU2hhZG93OiB2YXIoLS16bnMtdGhlbWUtc2hhZG93LCByZ2JhKDAsIDAsIDAsIDAuMSkpO1xuXG4kc21vb3RoQmV6aWVyOiBjdWJpYy1iZXppZXIoMC4yNSwgMC40LCAwLjcsIDEpO1xuXG4kbWF4RXh0cmFTbWFsbDogNTk1cHg7XG4kbWluU21hbGw6IDYwMHB4O1xuJG1lZGl1bTogNzY4cHg7XG4kbGFyZ2U6IDg4OXB4O1xuJGNvbXB1dGVyczogMTIwMHB4O1xuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ },

/***/ 63617
/*!*****************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/observable/merge.js ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   merge: () => (/* binding */ merge)
/* harmony export */ });
/* harmony import */ var _operators_mergeAll__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../operators/mergeAll */ 23222);
/* harmony import */ var _innerFrom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./innerFrom */ 82645);
/* harmony import */ var _empty__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./empty */ 59400);
/* harmony import */ var _util_args__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/args */ 4083);
/* harmony import */ var _from__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./from */ 95429);





function merge(...args) {
  const scheduler = (0,_util_args__WEBPACK_IMPORTED_MODULE_3__.popScheduler)(args);
  const concurrent = (0,_util_args__WEBPACK_IMPORTED_MODULE_3__.popNumber)(args, Infinity);
  const sources = args;
  return !sources.length ? _empty__WEBPACK_IMPORTED_MODULE_2__.EMPTY : sources.length === 1 ? (0,_innerFrom__WEBPACK_IMPORTED_MODULE_1__.innerFrom)(sources[0]) : (0,_operators_mergeAll__WEBPACK_IMPORTED_MODULE_0__.mergeAll)(concurrent)((0,_from__WEBPACK_IMPORTED_MODULE_4__.from)(sources, scheduler));
}

/***/ },

/***/ 28206
/*!*********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/scheduler/AsapAction.js ***!
  \*********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AsapAction: () => (/* binding */ AsapAction)
/* harmony export */ });
/* harmony import */ var _AsyncAction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AsyncAction */ 72083);
/* harmony import */ var _immediateProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./immediateProvider */ 73701);


class AsapAction extends _AsyncAction__WEBPACK_IMPORTED_MODULE_0__.AsyncAction {
  constructor(scheduler, work) {
    super(scheduler, work);
    this.scheduler = scheduler;
    this.work = work;
  }
  requestAsyncId(scheduler, id, delay = 0) {
    if (delay !== null && delay > 0) {
      return super.requestAsyncId(scheduler, id, delay);
    }
    scheduler.actions.push(this);
    return scheduler._scheduled || (scheduler._scheduled = _immediateProvider__WEBPACK_IMPORTED_MODULE_1__.immediateProvider.setImmediate(scheduler.flush.bind(scheduler, undefined)));
  }
  recycleAsyncId(scheduler, id, delay = 0) {
    var _a;
    if (delay != null ? delay > 0 : this.delay > 0) {
      return super.recycleAsyncId(scheduler, id, delay);
    }
    const {
      actions
    } = scheduler;
    if (id != null && ((_a = actions[actions.length - 1]) === null || _a === void 0 ? void 0 : _a.id) !== id) {
      _immediateProvider__WEBPACK_IMPORTED_MODULE_1__.immediateProvider.clearImmediate(id);
      if (scheduler._scheduled === id) {
        scheduler._scheduled = undefined;
      }
    }
    return undefined;
  }
}

/***/ },

/***/ 39835
/*!************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/scheduler/AsapScheduler.js ***!
  \************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AsapScheduler: () => (/* binding */ AsapScheduler)
/* harmony export */ });
/* harmony import */ var _AsyncScheduler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AsyncScheduler */ 2400);

class AsapScheduler extends _AsyncScheduler__WEBPACK_IMPORTED_MODULE_0__.AsyncScheduler {
  flush(action) {
    this._active = true;
    const flushId = this._scheduled;
    this._scheduled = undefined;
    const {
      actions
    } = this;
    let error;
    action = action || actions.shift();
    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while ((action = actions[0]) && action.id === flushId && actions.shift());
    this._active = false;
    if (error) {
      while ((action = actions[0]) && action.id === flushId && actions.shift()) {
        action.unsubscribe();
      }
      throw error;
    }
  }
}

/***/ },

/***/ 67180
/*!***************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/scheduler/asap.js ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   asap: () => (/* binding */ asap),
/* harmony export */   asapScheduler: () => (/* binding */ asapScheduler)
/* harmony export */ });
/* harmony import */ var _AsapAction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AsapAction */ 28206);
/* harmony import */ var _AsapScheduler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AsapScheduler */ 39835);


const asapScheduler = new _AsapScheduler__WEBPACK_IMPORTED_MODULE_1__.AsapScheduler(_AsapAction__WEBPACK_IMPORTED_MODULE_0__.AsapAction);
const asap = asapScheduler;

/***/ },

/***/ 73701
/*!****************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/scheduler/immediateProvider.js ***!
  \****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   immediateProvider: () => (/* binding */ immediateProvider)
/* harmony export */ });
/* harmony import */ var _util_Immediate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/Immediate */ 733);

const {
  setImmediate,
  clearImmediate
} = _util_Immediate__WEBPACK_IMPORTED_MODULE_0__.Immediate;
const immediateProvider = {
  setImmediate(...args) {
    const {
      delegate
    } = immediateProvider;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.setImmediate) || setImmediate)(...args);
  },
  clearImmediate(handle) {
    const {
      delegate
    } = immediateProvider;
    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearImmediate) || clearImmediate)(handle);
  },
  delegate: undefined
};

/***/ },

/***/ 733
/*!***************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/util/Immediate.js ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Immediate: () => (/* binding */ Immediate),
/* harmony export */   TestTools: () => (/* binding */ TestTools)
/* harmony export */ });
let nextHandle = 1;
let resolved;
const activeHandles = {};
function findAndClearHandle(handle) {
  if (handle in activeHandles) {
    delete activeHandles[handle];
    return true;
  }
  return false;
}
const Immediate = {
  setImmediate(cb) {
    const handle = nextHandle++;
    activeHandles[handle] = true;
    if (!resolved) {
      resolved = Promise.resolve();
    }
    resolved.then(() => findAndClearHandle(handle) && cb());
    return handle;
  },
  clearImmediate(handle) {
    findAndClearHandle(handle);
  }
};
const TestTools = {
  pending() {
    return Object.keys(activeHandles).length;
  }
};

/***/ },

/***/ 56412
/*!****************************************************************!*\
  !*** ./node_modules/@angular/cdk/fesm2022/css-pixel-value.mjs ***!
  \****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   coerceCssPixelValue: () => (/* binding */ coerceCssPixelValue)
/* harmony export */ });
/** Coerces a value to a CSS pixel value. */
function coerceCssPixelValue(value) {
  if (value == null) {
    return '';
  }
  return typeof value === 'string' ? value : `${value}px`;
}


/***/ }

}]);
//# sourceMappingURL=default-src_app_blockchain-networks_service_ts-src_app_services_settings_service_ts-src_app_z-da6cb3.js.map