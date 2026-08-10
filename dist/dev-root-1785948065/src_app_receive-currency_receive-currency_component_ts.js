"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_receive-currency_receive-currency_component_ts"],{

/***/ 88070
/*!******************************************************************!*\
  !*** ./src/app/base/copy-to-clipboard/copy-to-clipboard.base.ts ***!
  \******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CopyToClipboardBase: () => (/* binding */ CopyToClipboardBase)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);

class CopyToClipboardBase {
  _chromeService;
  _snackBar;
  _translocoService;
  _copyToClipboardActionText;
  _copyToClipboardErrorActionText;
  _copyToClipboardErrorText;
  _copyToClipboardText;
  constructor(_chromeService, _snackBar, _translocoService) {
    this._chromeService = _chromeService;
    this._snackBar = _snackBar;
    this._translocoService = _translocoService;
    this._copyToClipboardActionText = this._translocoService.translate("common.close");
    this._copyToClipboardErrorActionText = this._translocoService.translate("common.close");
    this._copyToClipboardErrorText = this._translocoService.translate("common.failed_to_copy_to_clipboard");
    this._copyToClipboardText = this._translocoService.translate("common.copied_to_clipboard");
  }
  _copyToClipboard(_x) {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (value, showSnackBar = true) {
      try {
        yield _this._chromeService.copyToClipboard(value);
        if (showSnackBar) _this._showCopyToClipboardSnackBar();
      } catch (error) {
        if (!showSnackBar) return;
        _this._showCopyToClipboardSnackBarError();
      }
    }).apply(this, arguments);
  }
  _showCopyToClipboardSnackBar() {
    this._snackBar.open(this._copyToClipboardText, this._copyToClipboardActionText, {
      duration: 2000,
      panelClass: "zelf-snackbar",
      verticalPosition: "top"
    });
  }
  _showCopyToClipboardSnackBarError() {
    this._snackBar.open(this._copyToClipboardErrorText, this._copyToClipboardErrorActionText, {
      duration: 2000,
      panelClass: "zelf-snackbar",
      verticalPosition: "top"
    });
  }
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

/***/ 29011
/*!********************************************!*\
  !*** ./src/app/pipes/address-mask.pipe.ts ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AddressMaskPipe: () => (/* binding */ AddressMaskPipe)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 12481);

class AddressMaskPipe {
  transform(value) {
    if (typeof value !== "string" || !value || !value.trim()) return "";
    const firstPart = value.slice(0, 8);
    const lastPart = value.slice(-8);
    return `${firstPart}...${lastPart}`;
  }
  static ɵfac = function AddressMaskPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AddressMaskPipe)();
  };
  static ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({
    name: "addressMask",
    type: AddressMaskPipe,
    pure: true
  });
}

/***/ },

/***/ 9980
/*!****************************************************************!*\
  !*** ./src/app/receive-currency/receive-currency.component.ts ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReceiveCurrencyComponent: () => (/* binding */ ReceiveCurrencyComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 34487);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var _shared_types_tag_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @shared/types/tag.types */ 92792);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 47470);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 33900);
/* harmony import */ var app_base_copy_to_clipboard_copy_to_clipboard_base__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! app/base/copy-to-clipboard/copy-to-clipboard.base */ 88070);
/* harmony import */ var app_pipes_address_mask_pipe__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! app/pipes/address-mask.pipe */ 29011);
/* harmony import */ var app_receive_qr_receive_generate_substrate_modal_receive_generate_substrate_modal_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! app/receive-qr/receive-generate-substrate-modal/receive-generate-substrate-modal.component */ 19450);
/* harmony import */ var app_wallet_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! app/wallet.service */ 69556);
/* harmony import */ var app_zelf_loader_zelf_loader_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! app/zelf-loader/zelf-loader.component */ 40152);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/dialog */ 57760);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var app_services_settings_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! app/services/settings.service */ 40875);
/* harmony import */ var app_tags_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! app/tags.service */ 73768);
/* harmony import */ var app_chrome_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! app/chrome.service */ 85043);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/material/snack-bar */ 3347);






















const _c0 = () => ["/home"];
const _c1 = a0 => ["qr", a0];
function ReceiveCurrencyComponent_div_0_ng_container_11_a_1_ng_container_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementContainer"](0);
  }
}
function ReceiveCurrencyComponent_div_0_ng_container_11_a_1_ng_container_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementContainer"](0);
  }
}
function ReceiveCurrencyComponent_div_0_ng_container_11_a_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](0, "a", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](1, "img", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](2, "div", 20)(3, "div", 21)(4, "p", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](6, "p", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](8, "p", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵpipe"](10, "addressMask");
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](11, "div", 25)(12, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtemplate"](13, ReceiveCurrencyComponent_div_0_ng_container_11_a_1_ng_container_13_Template, 1, 0, "ng-container", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](14, "button", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵlistener"]("click", function ReceiveCurrencyComponent_div_0_ng_container_11_a_1_Template_button_click_14_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r1);
      const network_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"]().$implicit;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r2.copyToClipboard($event, network_r2));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtemplate"](15, ReceiveCurrencyComponent_div_0_ng_container_11_a_1_ng_container_15_Template, 1, 0, "ng-container", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const network_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"](2);
    const copyIcon_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵreference"](4);
    const qrCodeIcon_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵreference"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵpureFunction1"](9, _c1, network_r2.name));
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("src", network_r2.image, _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtextInterpolate"](network_r2.symbol);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtextInterpolate"](network_r2.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵpipeBind1"](10, 7, network_r2.address));
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("ngTemplateOutlet", qrCodeIcon_r5);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("ngTemplateOutlet", copyIcon_r4);
  }
}
function ReceiveCurrencyComponent_div_0_ng_container_11_div_2_ng_container_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementContainer"](0);
  }
}
function ReceiveCurrencyComponent_div_0_ng_container_11_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](0, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](1, "img", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](2, "div", 20)(3, "div", 21)(4, "p", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](6, "p", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](8, "p", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](10, "div", 31)(11, "button", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵlistener"]("click", function ReceiveCurrencyComponent_div_0_ng_container_11_div_2_Template_button_click_11_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r6);
      const network_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"]().$implicit;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r2.onGenerateSubstrateClick($event, network_r2));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](12, "span", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtemplate"](13, ReceiveCurrencyComponent_div_0_ng_container_11_div_2_ng_container_13_Template, 1, 0, "ng-container", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](14, "span", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const network_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"]().$implicit;
    const t_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"]();
    const generateAddressIcon_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵreference"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("src", network_r2.image, _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtextInterpolate"](network_r2.symbol);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtextInterpolate"](network_r2.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtextInterpolate"](network_r2.address);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("ngTemplateOutlet", generateAddressIcon_r8);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtextInterpolate"](t_r7("receive.generate"));
  }
}
function ReceiveCurrencyComponent_div_0_ng_container_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtemplate"](1, ReceiveCurrencyComponent_div_0_ng_container_11_a_1_Template, 16, 11, "a", 16)(2, ReceiveCurrencyComponent_div_0_ng_container_11_div_2_Template, 16, 6, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const network_r2 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("ngIf", !network_r2.needsSubstrateAddress);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("ngIf", network_r2.needsSubstrateAddress);
  }
}
function ReceiveCurrencyComponent_div_0_zelf_loader_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](0, "zelf-loader");
  }
}
function ReceiveCurrencyComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](0, "div", 4)(1, "div", 5)(2, "div", 6)(3, "button", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](4, "svg", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](5, "path", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](6, "div", 10)(7, "p", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](9, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](10, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtemplate"](11, ReceiveCurrencyComponent_div_0_ng_container_11_Template, 3, 2, "ng-container", 14)(12, ReceiveCurrencyComponent_div_0_zelf_loader_12_Template, 1, 0, "zelf-loader", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r7 = ctx.$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵpureFunction0"](4, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtextInterpolate"](t_r7("common.receive"));
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("ngForOf", ctx_r2.networks);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("ngIf", ctx_r2.loading);
  }
}
function ReceiveCurrencyComponent_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](0, "svg", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](1, "path", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
  }
}
function ReceiveCurrencyComponent_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](0, "svg", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](1, "path", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
  }
}
function ReceiveCurrencyComponent_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](0, "svg", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](1, "path", 40)(2, "path", 41)(3, "path", 42)(4, "path", 43)(5, "path", 44)(6, "path", 45)(7, "path", 46)(8, "path", 47)(9, "path", 48)(10, "path", 49)(11, "path", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
  }
}
class ReceiveCurrencyComponent extends app_base_copy_to_clipboard_copy_to_clipboard_base__WEBPACK_IMPORTED_MODULE_10__.CopyToClipboardBase {
  _dialog;
  _router;
  _walletService;
  _settingsService;
  _tagsService;
  _chromeService;
  _snackBar;
  _translocoService;
  _destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_6__.Subject();
  loading = true;
  networks = [];
  constructor(_dialog, _router, _walletService, _settingsService, _tagsService, _chromeService, _snackBar, _translocoService) {
    super(_chromeService, _snackBar, _translocoService);
    this._dialog = _dialog;
    this._router = _router;
    this._walletService = _walletService;
    this._settingsService = _settingsService;
    this._tagsService = _tagsService;
    this._chromeService = _chromeService;
    this._snackBar = _snackBar;
    this._translocoService = _translocoService;
  }
  ngOnInit() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this._chromeService.onWalletChanged$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_8__.skip)(1), (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.takeUntil)(_this._destroy$)).subscribe(() => {
        void _this._rebuildNetworkRowsFromCurrentWallet();
      });
      try {
        yield _this._rebuildNetworkRowsFromCurrentWallet();
      } finally {
        _this.loading = false;
      }
    })();
  }
  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
  /**
   * Storage-first: no blocking GET /api/tags/search. A background refresh runs only when the same 30m
   * session window as `refreshAllTagsPublicData` says so; `onWalletChanged$` reapplies the list when it finishes.
   */
  _rebuildNetworkRowsFromCurrentWallet() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const wallet = yield _this2._walletService.getCurrentWallet();
      if (wallet?.tagName) {
        _this2._tagsService.scheduleTagPublicDataRefreshIfDue(wallet);
      }
      if (!wallet) {
        _this2.networks = [];
        return;
      }
      const allNetworks = yield _this2._walletService.getAvailableWalletNetworks(wallet);
      const enabledNetworkIds = _this2._getEnabledNetworkIds();
      let list = !enabledNetworkIds ? allNetworks : allNetworks.filter(network => _this2._isNetworkEnabled(network, enabledNetworkIds));
      list = _this2._withSubstratePlaceholdersIfNeeded(list, wallet, enabledNetworkIds);
      _this2.networks = list;
    })();
  }
  _isNetworkEnabled(network, enabledNetworkIds) {
    const networkId = this._mapSymbolToNetworkId(network.symbol);
    return enabledNetworkIds.includes(networkId);
  }
  _withSubstratePlaceholdersIfNeeded(networks, wallet, enabledNetworkIds) {
    const zelfId = (wallet.fullTagName || wallet.name || "").trim();
    if (!zelfId) return networks;
    const pd = wallet.publicData;
    const hasDot = Boolean((0,_shared_types_tag_types__WEBPACK_IMPORTED_MODULE_5__.readPublicDataDotAddress)(pd));
    const hasKsm = Boolean((0,_shared_types_tag_types__WEBPACK_IMPORTED_MODULE_5__.readPublicDataKsmAddress)(pd));
    const out = [...networks];
    const showDot = this._shouldShowSubstrateInReceive("polkadot", enabledNetworkIds, out, "DOT");
    const showKsm = this._shouldShowSubstrateInReceive("kusama", enabledNetworkIds, out, "KSM");
    if (!hasDot && showDot) {
      out.push({
        address: app_wallet_service__WEBPACK_IMPORTED_MODULE_13__.SUBSTRATE_ADDRESS_PLACEHOLDER,
        image: this._walletService.getAssetImage("DOT"),
        name: "Polkadot",
        needsSubstrateAddress: true,
        symbol: "DOT"
      });
    }
    if (!hasKsm && showKsm) {
      out.push({
        address: app_wallet_service__WEBPACK_IMPORTED_MODULE_13__.SUBSTRATE_ADDRESS_PLACEHOLDER,
        image: this._walletService.getAssetImage("KSM"),
        name: "Kusama",
        needsSubstrateAddress: true,
        symbol: "KSM"
      });
    }
    return out;
  }
  _shouldShowSubstrateInReceive(id, enabledNetworkIds, currentList, symbol) {
    if (currentList.some(n => n.symbol === symbol && !n.needsSubstrateAddress)) return false;
    if (currentList.some(n => n.symbol === symbol && n.needsSubstrateAddress)) return false;
    if (!enabledNetworkIds) return true;
    return enabledNetworkIds.includes(id);
  }
  _getEnabledNetworkIds() {
    return this._settingsService.getEnabledNetworkIds();
  }
  _mapSymbolToNetworkId(symbol) {
    switch (symbol.toUpperCase()) {
      case "ETH":
        return "ethereum";
      case "AVAX":
        return "avalanche";
      case "BNB":
      case "BSC":
        return "binance";
      case "BTC":
        return "bitcoin";
      case "BDAG":
        return "blockdag";
      case "MATIC":
      case "POL":
        return "polygon";
      case "SOL":
        return "solana";
      case "SUI":
        return "sui";
      case "TON":
        return "ton";
      case "XLM":
        return "stellar";
      case "DOT":
        return "polkadot";
      case "KSM":
        return "kusama";
      default:
        return symbol.toLowerCase();
    }
  }
  copyToClipboard(event, network) {
    event.preventDefault();
    event.stopPropagation();
    this._copyToClipboard(network.address);
  }
  onGenerateSubstrateClick(event, network) {
    event.preventDefault();
    event.stopPropagation();
    if (!network.needsSubstrateAddress) return;
    void this._openGenerateSubstrateModalAndGo(network);
  }
  _openGenerateSubstrateModalAndGo(network) {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const wallet = yield _this3._walletService.getCurrentWallet();
      const fullTagName = (wallet?.fullTagName || wallet?.name || "").trim();
      if (!fullTagName) return;
      const symbol = network.symbol === "KSM" ? "KSM" : "DOT";
      const ref = _this3._dialog.open(app_receive_qr_receive_generate_substrate_modal_receive_generate_substrate_modal_component__WEBPACK_IMPORTED_MODULE_12__.ReceiveGenerateSubstrateModalComponent, {
        backdropClass: "zelf-backdrop",
        data: {
          fullTagName,
          symbol
        },
        maxWidth: "min(360px, 92vw)",
        panelClass: ["zelf-dialog", "zelf-dialog--receive-generate-substrate"]
      });
      const proceed = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.firstValueFrom)(ref.afterClosed());
      if (!proceed) return;
      yield _this3._tagsService.setFlow("unlock");
      yield _this3._router.navigate(["/security", "biometrics"], {
        queryParams: {
          return: "/receive"
        }
      });
    })();
  }
  static ɵfac = function ReceiveCurrencyComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ReceiveCurrencyComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_17__.MatDialog), _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_18__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdirectiveInject"](app_wallet_service__WEBPACK_IMPORTED_MODULE_13__.WalletService), _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdirectiveInject"](app_services_settings_service__WEBPACK_IMPORTED_MODULE_19__.SettingsService), _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdirectiveInject"](app_tags_service__WEBPACK_IMPORTED_MODULE_20__.TagsService), _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdirectiveInject"](app_chrome_service__WEBPACK_IMPORTED_MODULE_21__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_22__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdirectiveInject"](_jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__.TranslocoService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdefineComponent"]({
    type: ReceiveCurrencyComponent,
    selectors: [["receive-currency"]],
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵInheritDefinitionFeature"]],
    decls: 7,
    vars: 0,
    consts: [["generateAddressIcon", ""], ["copyIcon", ""], ["qrCodeIcon", ""], ["class", "zelf-card receive-currency", 4, "transloco"], [1, "zelf-card", "receive-currency"], [1, "receive-currency__header"], [1, "receive-currency__col1"], ["mat-flat-button", "", 1, "zelf-icon-button", "zelf-icon-button--secondary", "zelf-icon-button--40", 3, "routerLink"], ["width", "22", "height", "14", "viewBox", "0 0 22 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"], [1, "receive-currency__col2"], [1, "receive-currency__title"], [1, "receive-currency__col3"], [1, "zelf-card__content", "receive-currency__content"], [4, "ngFor", "ngForOf"], [4, "ngIf"], ["class", "network-item", 3, "routerLink", 4, "ngIf"], ["class", "network-item network-item--placeholder", 4, "ngIf"], [1, "network-item", 3, "routerLink"], ["alt", "icon", 1, "network-item__icon", 3, "src"], [1, "network-item__info"], [1, "network-item__network-info"], [1, "network-item__network"], [1, "network-item__network-chip"], [1, "network-item__name"], [1, "network-item__buttons"], ["mat-flat-button", "", 1, "zelf-icon-button", "zelf-icon-button--40", "zelf-icon-button--secondary", "zelf-icon-button--border-soft"], [4, "ngTemplateOutlet"], ["mat-flat-button", "", 1, "zelf-icon-button", "zelf-icon-button--40", "zelf-icon-button--secondary", "zelf-icon-button--border-soft", 3, "click"], [1, "network-item", "network-item--placeholder"], ["aria-hidden", "true", 1, "network-item__name", "network-item__name--placeholder-blur"], [1, "network-item__buttons", "network-item__buttons--generate"], ["type", "button", 1, "network-item__generate-btn", 3, "click"], ["aria-hidden", "true", 1, "network-item__generate-btn-wrap"], [1, "network-item__generate-label"], ["viewBox", "0 0 24 24", "fill", "currentColor", "aria-hidden", "true", "focusable", "false", 1, "network-item__generate-icon"], ["d", "M9.4 4.1c.2-.5.8-.5 1 0l.6 1.4 1.4.6c.5.2.5.8 0 1l-1.4.6-.6 1.4c-.2.5-.8.5-1 0l-.6-1.4-1.4-.6c-.5-.2-.5-.8 0-1l1.4-.6.6-1.4zm8.1 2.1c.1-.3.5-.3.6 0l.3.8.8.3c.3.1.3.5 0 .6l-.8.3-.3.8c-.1.3-.5.3-.6 0l-.3-.8-.8-.3c-.3-.1-.3-.5 0-.6l.8-.3.3-.8zm-3.5 6.7c.2-.4.7-.4.9 0l1.1 2.1 2.1 1.1c.4.2.4.7 0 .9l-2.1 1.1-1.1 2.1c-.2.4-.7.4-.9 0l-1.1-2.1-2.1-1.1c-.4-.2-.4-.7 0-.9l2.1-1.1 1.1-2.1z"], ["width", "24", "height", "24", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M15.5 20H5.5V7C5.5 6.45 5.05 6 4.5 6C3.95 6 3.5 6.45 3.5 7V20C3.5 21.1 4.4 22 5.5 22H15.5C16.05 22 16.5 21.55 16.5 21C16.5 20.45 16.05 20 15.5 20ZM20.5 16V4C20.5 2.9 19.6 2 18.5 2H9.5C8.4 2 7.5 2.9 7.5 4V16C7.5 17.1 8.4 18 9.5 18H18.5C19.6 18 20.5 17.1 20.5 16ZM18.5 16H9.5V4H18.5V16Z"], ["width", "18", "height", "18", "viewBox", "0 0 18 18", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M2 8H6C7.1 8 8 7.1 8 6V2C8 0.9 7.1 0 6 0H2C0.9 0 0 0.9 0 2V6C0 7.1 0.9 8 2 8ZM2 2H6V6H2V2Z"], ["d", "M2 18H6C7.1 18 8 17.1 8 16V12C8 10.9 7.1 10 6 10H2C0.9 10 0 10.9 0 12V16C0 17.1 0.9 18 2 18ZM2 12H6V16H2V12Z"], ["d", "M10 2V6C10 7.1 10.9 8 12 8H16C17.1 8 18 7.1 18 6V2C18 0.9 17.1 0 16 0H12C10.9 0 10 0.9 10 2ZM16 6H12V2H16V6Z"], ["d", "M18 17.5V16.5C18 16.22 17.78 16 17.5 16H16.5C16.22 16 16 16.22 16 16.5V17.5C16 17.78 16.22 18 16.5 18H17.5C17.78 18 18 17.78 18 17.5Z"], ["d", "M10 10.5V11.5C10 11.78 10.22 12 10.5 12H11.5C11.78 12 12 11.78 12 11.5V10.5C12 10.22 11.78 10 11.5 10H10.5C10.22 10 10 10.22 10 10.5Z"], ["d", "M13.5 12H12.5C12.22 12 12 12.22 12 12.5V13.5C12 13.78 12.22 14 12.5 14H13.5C13.78 14 14 13.78 14 13.5V12.5C14 12.22 13.78 12 13.5 12Z"], ["d", "M10 14.5V15.5C10 15.78 10.22 16 10.5 16H11.5C11.78 16 12 15.78 12 15.5V14.5C12 14.22 11.78 14 11.5 14H10.5C10.22 14 10 14.22 10 14.5Z"], ["d", "M12.5 18H13.5C13.78 18 14 17.78 14 17.5V16.5C14 16.22 13.78 16 13.5 16H12.5C12.22 16 12 16.22 12 16.5V17.5C12 17.78 12.22 18 12.5 18Z"], ["d", "M14.5 16H15.5C15.78 16 16 15.78 16 15.5V14.5C16 14.22 15.78 14 15.5 14H14.5C14.22 14 14 14.22 14 14.5V15.5C14 15.78 14.22 16 14.5 16Z"], ["d", "M15.5 10H14.5C14.22 10 14 10.22 14 10.5V11.5C14 11.78 14.22 12 14.5 12H15.5C15.78 12 16 11.78 16 11.5V10.5C16 10.22 15.78 10 15.5 10Z"], ["d", "M16.5 14H17.5C17.78 14 18 13.78 18 13.5V12.5C18 12.22 17.78 12 17.5 12H16.5C16.22 12 16 12.22 16 12.5V13.5C16 13.78 16.22 14 16.5 14Z"]],
    template: function ReceiveCurrencyComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtemplate"](0, ReceiveCurrencyComponent_div_0_Template, 13, 5, "div", 3)(1, ReceiveCurrencyComponent_ng_template_1_Template, 2, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtemplateRefExtractor"])(3, ReceiveCurrencyComponent_ng_template_3_Template, 2, 0, "ng-template", null, 1, _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtemplateRefExtractor"])(5, ReceiveCurrencyComponent_ng_template_5_Template, 12, 0, "ng-template", null, 2, _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtemplateRefExtractor"]);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgTemplateOutlet, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__.TranslocoDirective, _angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatButton, app_zelf_loader_zelf_loader_component__WEBPACK_IMPORTED_MODULE_14__.ZelfLoaderComponent, app_pipes_address_mask_pipe__WEBPACK_IMPORTED_MODULE_11__.AddressMaskPipe],
    styles: ["[_ngcontent-%COMP%]:root {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc);\n}\n\n.zelf-button-external-link[_ngcontent-%COMP%] {\n  display: block;\n}\n.zelf-button-external-link--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.zelf-button[_ngcontent-%COMP%] {\n  align-items: center;\n  border-radius: 16px;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  gap: 8px;\n  height: 56px;\n  justify-content: center;\n  outline: none;\n  padding: 8px 24px;\n  text-align: center;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.zelf-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-button[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: inherit;\n}\n.zelf-button__text--margin-right[_ngcontent-%COMP%] {\n  margin-right: 1rem;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-button--thin[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  padding: 12px 16px;\n}\n.zelf-button--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.zelf-button--wide.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-button--primary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button, #181818) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--primary[_ngcontent-%COMP%]:active {\n  --mdc-filled-button-container-color: var(--zns-theme-text-muted, #96939e) !important;\n  background-color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-hover, #ff5721) !important;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff) !important;\n  stroke: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-text-secondary, #73777f) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-text-secondary, #73777f) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--secondary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-button-secondary-text, #495057) !important;\n  background-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  color: var(--zns-theme-button-secondary-text, #495057) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-secondary-text, #495057);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus, .zelf-button--secondary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-border, #e3e3e3) !important;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]:focus, .zelf-button--tertiary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%] {\n  --mdc-outlined-button-label-text-color: var(--zns-theme-button, #181818) !important;\n  --mdc-outlined-button-outline-color: var(--zns-theme-border, #e3e3e3) !important;\n  border: 1px solid var(--zns-theme-button, #181818) !important;\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-button, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button, #181818);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus, .zelf-button--outlined[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--outlined[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--outlined[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%] {\n  border: none !important;\n  background-color: transparent !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--red[_ngcontent-%COMP%]:focus, .zelf-button--red[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n}\n.zelf-button--red[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e);\n}\n.zelf-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n}\n\n.zelf-icon-button[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  align-items: center;\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  border-radius: 56px;\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  font-weight: 600;\n  gap: 16px;\n  height: 56px;\n  justify-content: center;\n  min-height: 56px;\n  min-width: 56px;\n  outline: none;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  -webkit-user-select: none;\n          user-select: none;\n  width: 56px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-icon-button.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: var(--zns-theme-text, #181818);\n  height: 24px;\n  width: 24px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%] {\n  height: 40px;\n  min-height: 40px;\n  min-width: 40px;\n  width: 40px;\n  border-radius: 40px;\n  padding: 0 8px;\n}\n.zelf-icon-button--40.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 14px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  height: 20px;\n  width: 20px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e) !important;\n  stroke: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:active {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus, .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%] {\n  background-color: transparent !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]:focus, .zelf-icon-button--transparent[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--text[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: initial !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  height: auto;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n  width: auto;\n}\n\n.zelf-icon-button-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:first-child {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:last-child {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.zelf-action-button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: 8px;\n}\n.zelf-action-button__icon[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  background: var(--zns-theme-card, #ffffff);\n  border-radius: 32px;\n  outline: 1px var(--zns-theme-border, #e3e3e3) solid;\n  outline-offset: -1px;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  cursor: pointer;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n@media (max-width: 600px) {\n  .zelf-action-button__icon[_ngcontent-%COMP%] {\n    padding: 8px 14px;\n  }\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-size: 24px;\n  line-height: 1;\n  font-variation-settings: \"FILL\" 0, \"wght\" 400, \"GRAD\" 0, \"opsz\" 24;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-primary, #181818);\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .zelf-action-button__text[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon-box[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  position: relative;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n}\n.zelf-action-button__text[_ngcontent-%COMP%] {\n  width: auto;\n  white-space: nowrap;\n  text-align: center;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 11px;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  line-height: 16px;\n  letter-spacing: 0.5px;\n  word-wrap: normal;\n}\n\n[_nghost-%COMP%] {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  justify-content: center;\n}\n\n.receive-currency[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: var(--zns-card-width, 536px);\n  min-height: var(--zns-card-min-height, 768px);\n}\n.receive-currency__header[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(10, 1fr);\n  column-gap: calc(12px * var(--zns-space-scale, 1));\n  align-content: center;\n  justify-content: start;\n  gap: calc(24px * var(--zns-space-scale, 1));\n  width: 100%;\n}\n.receive-currency__col1[_ngcontent-%COMP%], .receive-currency__col3[_ngcontent-%COMP%] {\n  grid-column: span 3;\n  display: flex;\n  align-items: center;\n}\n.receive-currency__col1[_ngcontent-%COMP%] {\n  justify-content: start;\n}\n.receive-currency__col2[_ngcontent-%COMP%] {\n  grid-column: span 4;\n  text-align: center;\n  align-items: center;\n}\n.receive-currency__col3[_ngcontent-%COMP%] {\n  justify-content: end;\n}\n.receive-currency__title[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-title-family, \"Menda\", \"Arial Black\", sans-serif);\n  font-weight: 300;\n  font-size: calc(24px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  text-align: center;\n  vertical-align: middle;\n  color: var(--zns-theme-text, #181818);\n}\n.receive-currency__content[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  justify-content: flex-start;\n  position: relative;\n}\n.receive-currency__loader[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  margin: auto;\n}\n\n.network-item[_ngcontent-%COMP%] {\n  color: inherit;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: calc(24px * var(--zns-space-scale, 1));\n  padding: calc(16px * var(--zns-space-scale, 1));\n  border-radius: 16px;\n  background-color: transparent;\n  transition: background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  width: 100%;\n  box-sizing: border-box;\n  cursor: pointer;\n  text-decoration: none;\n}\n.network-item[_ngcontent-%COMP%]:visited, .network-item[_ngcontent-%COMP%]:active, .network-item[_ngcontent-%COMP%]:focus {\n  color: inherit;\n  text-decoration: none;\n}\n.network-item__icon[_ngcontent-%COMP%] {\n  height: calc(40px * var(--zns-action-scale, 1));\n  width: calc(40px * var(--zns-action-scale, 1));\n  min-height: calc(40px * var(--zns-action-scale, 1));\n  min-width: calc(40px * var(--zns-action-scale, 1));\n  object-fit: contain;\n}\n.network-item__name[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 500;\n  color: var(--zns-theme-text, #181818);\n  text-decoration: none;\n}\n.network-item__info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  justify-content: flex-start;\n  align-items: flex-start;\n  flex: 1 1 auto;\n}\n.network-item__network-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  gap: 8px;\n  justify-content: center;\n  align-items: flex-start;\n}\n.network-item__network[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: 14px;\n  line-height: 20px;\n  letter-spacing: 0.1px;\n  text-align: center;\n  vertical-align: middle;\n  margin: 0;\n}\n.network-item__network-chip[_ngcontent-%COMP%] {\n  height: 20;\n  border-radius: 24px;\n  gap: 10px;\n  padding: 2px 8px;\n  margin: 0;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 500;\n  font-size: 11px;\n  line-height: 16px;\n  letter-spacing: 0.5px;\n  text-align: center;\n  vertical-align: middle;\n  background-color: var(--zns-theme-border, #e3e3e3);\n  color: var(--zns-theme-text-muted, #96939e);\n}\n.network-item__name[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: 11px;\n  line-height: 16px;\n  letter-spacing: 0.5px;\n  vertical-align: middle;\n  margin: 0;\n  color: var(--zns-theme-text, #181818);\n  text-decoration: none;\n}\n.network-item__balance[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  justify-content: center;\n  align-items: flex-end;\n}\n.network-item__balance-amount[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: 14px;\n  line-height: 20px;\n  letter-spacing: 0.1px;\n  vertical-align: middle;\n}\n.network-item__fiat-amount[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: 11px;\n  line-height: 16px;\n  letter-spacing: 0.5px;\n  text-align: center;\n  vertical-align: middle;\n  color: var(--zns-theme-text-muted, #96939e);\n}\n.network-item__buttons[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  justify-content: center;\n  align-items: center;\n}\n.network-item[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-card-border, #eeedf1);\n}\n.network-item--placeholder[_ngcontent-%COMP%] {\n  cursor: default;\n}\n.network-item--placeholder[_ngcontent-%COMP%]:hover {\n  background-color: transparent;\n}\n.network-item__name--placeholder-blur[_ngcontent-%COMP%] {\n  -webkit-user-select: none;\n          user-select: none;\n  filter: blur(4px);\n  letter-spacing: 0.02em;\n}\n.network-item__buttons--generate[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  min-width: 0;\n}\n.network-item__generate-btn[_ngcontent-%COMP%] {\n  align-items: center;\n  background: var(--zns-theme-card-border, #eeedf1);\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  border-radius: 999px;\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);\n  color: var(--zns-theme-text, #181818);\n  cursor: pointer;\n  display: inline-flex;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 10px;\n  font-weight: 600;\n  gap: 5px;\n  letter-spacing: 0.06em;\n  line-height: 1.15;\n  max-width: none;\n  min-height: 0;\n  padding: 5px 12px 5px 8px;\n  text-align: left;\n  text-transform: none;\n  transition: background-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), border-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), box-shadow 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), transform 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.network-item__generate-btn[_ngcontent-%COMP%]:hover {\n  background: #f6e5e0;\n  border-color: var(--zns-theme-secondary, #ff5721);\n  box-shadow: 0 0 0 1px rgba(255, 87, 33, 0.18);\n}\n.network-item__generate-btn[_ngcontent-%COMP%]:active {\n  transform: scale(0.98);\n}\n.network-item__generate-btn[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--zns-theme-secondary, #ff5721);\n  outline-offset: 2px;\n}\n.network-item__generate-btn-wrap[_ngcontent-%COMP%] {\n  color: var(--zns-theme-secondary, #ff5721);\n  display: flex;\n  flex: 0 0 auto;\n  line-height: 0;\n}\n.network-item__generate-icon[_ngcontent-%COMP%] {\n  display: block;\n  height: 12px;\n  width: 12px;\n}\n.network-item__generate-label[_ngcontent-%COMP%] {\n  line-height: 1.2;\n  white-space: nowrap;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX2J1dHRvbnMuc2NzcyIsIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX3ZhcmlhYmxlcy5zY3NzIiwid2VicGFjazovLy4vc3JjL2FwcC9yZWNlaXZlLWN1cnJlbmN5L3JlY2VpdmUtY3VycmVuY3kuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxnRUMwQnVCO0FDM0IzQjs7QUZJQTtFQUNJLGNBQUE7QUVESjtBRkdJO0VBQ0ksV0FBQTtBRURSOztBRktBO0VBQ0ksbUJBQUE7RUFDQSxtQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLHVFQ0ljO0VESGQsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsUUFBQTtFQUNBLFlBQUE7RUFDQSx1QkFBQTtFQUNBLGFBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7VUFBQSxpQkFBQTtBRUZKO0FGSUk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLFFBQUE7QUVGUjtBRktJO0VBQ0ksU0FBQTtFQUNBLGNBQUE7QUVIUjtBRk9RO0VBQ0ksa0JBQUE7QUVMWjtBRlNJO0VBQ0ksNkJBQUE7RUFDQSwrQ0NsQmE7RURtQmIsZUFBQTtFQUNBLGdCQUFBO0VBQ0EscUJBQUE7RUFDQSxpQkFBQTtFQUNBLDZHQUNJO0FFUlo7QUZXUTtFQUNJLGVBQUE7QUVUWjtBRllRO0VBQ0ksOENDaENTO0FDc0JyQjtBRmFRO0VBQ0kscUNDdENBO0VEdUNBLGtEQ3hCRTtBQ2FkO0FGYVk7RUFDSSxvQ0MxQ0o7QUMrQlo7QUZlUTtFQUNJLG1CQUFBO0VBQ0Esc0RBQUE7QUViWjtBRmVZO0VBQ0ksMENDbERDO0FDcUNqQjtBRmtCSTtFQUNJLGtCQUFBO0VBQ0Esa0JBQUE7QUVoQlI7QUZtQkk7RUFDSSxXQUFBO0FFakJSO0FGbUJRO0VBQ0ksbUJBQUE7QUVqQlo7QUZxQkk7RUFFSSxnRkFBQTtFQUNBLCtFQUFBO0VBRUEsNkRBQUE7RUFDQSxnREFBQTtFQUNBLDZHQUNJO0FFdEJaO0FGeUJRO0VBQ0ksb0ZBQUE7RUFDQSxpRUFBQTtBRXZCWjtBRjBCUTtFQUNJLHNGQUFBO0VBQ0EsbUVBQUE7QUV4Qlo7QUYyQlE7RUFDSSxvQ0N6RUE7QUNnRFo7QUY0QlE7RUFDSSwrQ0FBQTtFQUNBLGlEQUFBO0FFMUJaO0FGNkJRO0VBQ0ksbUJBQUE7RUFDQSx3RkFBQTtFQUNBLCtFQUFBO0VBQ0EscUVBQUE7RUFDQSxnREFBQTtBRTNCWjtBRjZCWTtFQUNJLCtDQUFBO0VBQ0EsaURBQUE7QUUzQmhCO0FGZ0NJO0VBQ0ksMEZBQUE7RUFDQSxnR0FBQTtFQUVBLHVFQUFBO0VBQ0EsaUVBQUE7RUFDQSw2R0FDSTtBRWhDWjtBRm1DUTtFQUNJLHFEQ2hIZTtBQytFM0I7QUZvQ1E7RUFFSSxnR0FBQTtFQUNBLCtFQUFBO0VBQ0EsNkVBQUE7RUFDQSxxQ0NsSEE7QUMrRVo7QUZxQ1k7RUFDSSxvQ0N2SUo7QUNvR1o7QUZ1Q1E7RUFDSSxtQkFBQTtFQUNBLGdGQUFBO0VBQ0EsNkRBQUE7QUVyQ1o7QUZ1Q1k7RUFDSSw0Q0NqSUc7QUM0Rm5CO0FGd0NZO0VBQ0kseURBQUE7RUFDQSwyREFBQTtBRXRDaEI7QUYyQ0k7RUFDSSwyREFBQTtFQUNBLGdEQUFBO0VBQ0EsNkdBQ0k7QUUxQ1o7QUY2Q1E7RUFFSSxnRUFBQTtBRTVDWjtBRitDUTtFQUNJLG1CQUFBO0VBQ0EsNkRBQUE7RUFDQSxnREFBQTtBRTdDWjtBRitDWTtFQUNJLCtDQUFBO0VBQ0EsaURBQUE7QUU3Q2hCO0FGaURRO0VBQ0ksb0NDbkxBO0FDb0laO0FGa0RRO0VBQ0ksK0NBQUE7RUFDQSxpREFBQTtBRWhEWjtBRm9ESTtFQUNJLG1GQUFBO0VBQ0EsZ0ZBQUE7RUFFQSw2REFBQTtFQUNBLDJEQUFBO0VBQ0Esa0RBQUE7RUFDQSw2R0FDSTtBRXBEWjtBRnVEUTtFQUNJLHNDQ2pNRTtBQzRJZDtBRndEUTtFQUVJLG1FQUFBO0VBQ0EsZ0RBQUE7QUV2RFo7QUZ5RFk7RUFDSSxvQ0MvTEo7QUN3SVo7QUYyRFE7RUFDSSxtQkFBQTtFQUNBLHVEQUFBO0FFekRaO0FGNkRJO0VBQ0ksdUJBQUE7RUFDQSx3Q0FBQTtFQUNBLGlEQUFBO0VBQ0EsNkdBQ0k7QUU1RFo7QUYrRFE7RUFFSSxpRUFBQTtBRTlEWjtBRmlFUTtFQUNJLG1CQUFBO0VBQ0EsMERBQUE7QUUvRFo7QUZrRVE7RUFDSSxxQ0NwUUo7QUNvTVI7QUZvRUk7RUFDSSxpRUFBQTtFQUNBLGlEQUFBO0FFbEVSO0FGb0VRO0VBQ0ksZ0RBQUE7QUVsRVo7QUZzRUk7RUFDSSxtRUFBQTtFQUNBLG1EQUFBO0FFcEVSO0FGc0VRO0VBQ0ksa0RBQUE7QUVwRVo7QUZ3RUk7RUFDSSxxQkFBQTtFQUNBLGFBQUE7RUFDQSxZQUFBO0VBQ0EsaUJBQUE7QUV0RVI7O0FGMEVBO0VBQ0ksdUVDcFJjO0VEcVJkLG1CQUFBO0VBQ0Esa0VBQUE7RUFDQSxtQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0Esb0JBQUE7RUFDQSxnQkFBQTtFQUNBLFNBQUE7RUFDQSxZQUFBO0VBQ0EsdUJBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSxhQUFBO0VBQ0EsNkdBQ0k7RUFFSix5QkFBQTtVQUFBLGlCQUFBO0VBQ0EsV0FBQTtBRXpFSjtBRjJFSTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsUUFBQTtBRXpFUjtBRjRFSTtFQUNJLG1CQUFBO0FFMUVSO0FGNkVJO0VBQ0kscURBQUE7RUFDQSxvQ0M5U0k7RUQrU0osWUFBQTtFQUNBLFdBQUE7QUUzRVI7QUY4RUk7RUFDSSxnRUFBQTtFQUNBLDRDQ2xTVTtBQ3NObEI7QUY4RVE7RUFDSSwyQ0NyU007QUN5TmxCO0FGZ0ZJO0VBQ0ksbUJBQUE7QUU5RVI7QUZpRkk7RUFDSSxZQUFBO0VBQ0EsZ0JBQUE7RUFDQSxlQUFBO0VBQ0EsV0FBQTtFQUNBLG1CQUFBO0VBQ0EsY0FBQTtBRS9FUjtBRmlGUTtFQUNJLG1CQUFBO0FFL0VaO0FGa0ZRO0VBQ0ksWUFBQTtFQUNBLFdBQUE7QUVoRlo7QUZvRkk7RUFDSSw2QkFBQTtFQUNBLCtDQ2xWYTtFRG1WYixlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQkFBQTtFQUNBLGlCQUFBO0VBQ0EsNkdBQ0k7QUVuRlo7QUZzRlE7RUFDSSxlQUFBO0FFcEZaO0FGdUZRO0VBQ0ksOENDaFdTO0FDMlFyQjtBRndGUTtFQUNJLHFDQ3RXQTtFRHVXQSxrREN4VkU7QUNrUWQ7QUZ3Rlk7RUFDSSxvQ0MxV0o7QUNvUlo7QUYwRlE7RUFDSSxtQkFBQTtFQUNBLHNEQUFBO0FFeEZaO0FGMEZZO0VBQ0ksMENDbFhDO0FDMFJqQjtBRjJGWTtFQUNJLHFEQUFBO0VBQ0EsdURBQUE7QUV6RmhCO0FGOEZJO0VBQ0ksNkRBQUE7RUFDQSx1REFBQTtFQUNBLDZHQUNJO0FFN0ZaO0FGZ0dRO0VBQ0ksbUVBQUE7QUU5Rlo7QUZpR1E7RUFDSSxtRUFBQTtBRS9GWjtBRmtHUTtFQUNJLDJDQ3JZTTtBQ3FTbEI7QUZtR1E7RUFDSSxzREFBQTtFQUNBLHdEQUFBO0FFakdaO0FGb0dRO0VBQ0ksbUJBQUE7RUFDQSxtRUFBQTtBRWxHWjtBRm9HWTtFQUNJLDJDQ2xaRTtBQ2dUbEI7QUZxR1k7RUFDSSxzREFBQTtFQUNBLHdEQUFBO0FFbkdoQjtBRndHSTtFQUNJLGtFQUFBO0VBQ0EsZ0RBQUE7RUFDQSw2R0FDSTtBRXZHWjtBRjBHUTtFQUNJLG9DQzVhQTtBQ29VWjtBRjJHUTtFQUVJLGdFQUFBO0VBQ0EscUNDaGFBO0FDc1RaO0FGNEdZO0VBQ0ksb0NDbmFKO0FDeVRaO0FGOEdRO0VBQ0ksbUJBQUE7RUFDQSw2REFBQTtBRTVHWjtBRjhHWTtFQUNJLDRDQzlhRztBQ2tVbkI7QUYrR1k7RUFDSSx5REFBQTtFQUNBLDJEQUFBO0FFN0doQjtBRmtISTtFQUNJLHdDQUFBO0VBQ0EsZ0RBQUE7QUVoSFI7QUZrSFE7RUFDSSw4Q0MzY1M7QUMyVnJCO0FGbUhRO0VBRUksMkVBQUE7QUVsSFo7QUZxSFE7RUFDSSxtQkFBQTtFQUNBLDBEQUFBO0FFbkhaO0FGcUhZO0VBQ0ksNENDMWNHO0FDdVZuQjtBRndISTtFQUNJLHNCQUFBO0VBQ0EsNkJBQUE7QUV0SFI7QUZ5SEk7RUFDSSxpRUFBQTtFQUNBLGlEQUFBO0FFdkhSO0FGeUhRO0VBQ0ksZ0RBQUE7QUV2SFo7QUYySEk7RUFDSSxtRUFBQTtFQUNBLG1EQUFBO0FFekhSO0FGMkhRO0VBQ0ksa0RBQUE7QUV6SFo7QUY2SEk7RUFDSSxxQkFBQTtFQUNBLFlBQUE7RUFDQSxhQUFBO0VBQ0EsWUFBQTtFQUNBLGlCQUFBO0VBQ0EsV0FBQTtBRTNIUjs7QUYrSEE7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxNQUFBO0FFNUhKO0FGK0hRO0VBQ0ksMEJBQUE7RUFDQSw2QkFBQTtBRTdIWjtBRmdJUTtFQUNJLGdCQUFBO0FFOUhaO0FGaUlRO0VBQ0kseUJBQUE7RUFDQSw0QkFBQTtBRS9IWjs7QUZvSUE7RUFDSSxvQkFBQTtFQUNBLHNCQUFBO0VBQ0EsMkJBQUE7RUFDQSxtQkFBQTtFQUNBLFFBQUE7QUVqSUo7QUZtSUk7RUFDSSxrQkFBQTtFQUNBLDBDQzdnQkk7RUQ4Z0JKLG1CQUFBO0VBQ0EsbURBQUE7RUFDQSxvQkFBQTtFQUNBLG9CQUFBO0VBQ0Esc0JBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsUUFBQTtFQUNBLGVBQUE7RUFDQSw2R0FDSTtBRWxJWjtBRnFJUTtFQWhCSjtJQWlCUSxpQkFBQTtFRWxJVjtBQUNGO0FGb0lRO0VBQ0ksb0NDbGpCQTtFRG1qQkEscURBQUE7QUVsSVo7QUZxSVE7RUFDSSxxQ0N2akJBO0VEd2pCQSxlQUFBO0VBQ0EsY0FBQTtFQUNBLGtFQUNJO0VBSUosc0RBQUE7QUV2SVo7QUYwSVE7RUFDSSxtRENsbUJHO0VEbW1CSCxxQ0NsakJBO0FDMGFaO0FGMElZO0VBQ0ksb0NDcmpCSjtBQzZhWjtBRjJJWTtFQUNJLHFDQ3pqQko7QUNnYlo7QUY0SVk7RUFDSSxxQ0M3akJKO0FDbWJaO0FGK0lJO0VBQ0ksV0FBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtFQUNBLG9CQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQkFBQTtBRTdJUjtBRmdKSTtFQUNJLFdBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0EsK0NDL2xCYTtFRGdtQmIsZUFBQTtFQUNBLHVFQzFtQlU7RUQybUJWLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxxQkFBQTtFQUNBLGlCQUFBO0FFOUlSOztBQXJmQTtFQUNJLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsWUFBQTtFQUNBLHVCQUFBO0FBd2ZKOztBQXJmQTtFQUNJLFdBQUE7RUFDQSx1Q0FBQTtFQUNBLDZDQUFBO0FBd2ZKO0FBdGZJO0VBQ0ksYUFBQTtFQUNBLHNDQUFBO0VBQ0Esa0RBQUE7RUFDQSxxQkFBQTtFQUNBLHNCQUFBO0VBQ0EsMkNBQUE7RUFDQSxXQUFBO0FBd2ZSO0FBcmZJO0VBRUksbUJBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7QUFzZlI7QUFuZkk7RUFDSSxzQkFBQTtBQXFmUjtBQWxmSTtFQUNJLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxtQkFBQTtBQW9mUjtBQWpmSTtFQUNJLG9CQUFBO0FBbWZSO0FBaGZJO0VBQ0ksOEVEdkJXO0VDd0JYLGdCQUFBO0VBQ0EsZ0RBQUE7RUFDQSxrREFBQTtFQUNBLHFCQUFBO0VBQ0Esa0JBQUE7RUFDQSxzQkFBQTtFQUNBLHFDRHhCSTtBQzBnQlo7QUEvZUk7RUFDSSxjQUFBO0VBQ0EsMkJBQUE7RUFDQSxrQkFBQTtBQWlmUjtBQTllSTtFQUNJLGtCQUFBO0VBQ0EsUUFBQTtFQUNBLFlBQUE7QUFnZlI7O0FBNWVBO0VBQ0ksY0FBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLDhCQUFBO0VBQ0EsMkNBQUE7RUFDQSwrQ0FBQTtFQUNBLG1CQUFBO0VBQ0EsNkJBQUE7RUFDQSxpRUFBQTtFQUNBLFdBQUE7RUFDQSxzQkFBQTtFQUNBLGVBQUE7RUFDQSxxQkFBQTtBQStlSjtBQTdlSTtFQUdJLGNBQUE7RUFDQSxxQkFBQTtBQTZlUjtBQTFlSTtFQUNJLCtDQUFBO0VBQ0EsOENBQUE7RUFDQSxtREFBQTtFQUNBLGtEQUFBO0VBQ0EsbUJBQUE7QUE0ZVI7QUF6ZUk7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQ0R6RUk7RUMwRUoscUJBQUE7QUEyZVI7QUF4ZUk7RUFDSSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxRQUFBO0VBQ0EsMkJBQUE7RUFDQSx1QkFBQTtFQUNBLGNBQUE7QUEwZVI7QUF2ZUk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxRQUFBO0VBQ0EsdUJBQUE7RUFDQSx1QkFBQTtBQXllUjtBQXRlSTtFQUNJLHVFRHRHVTtFQ3VHVixnQkFBQTtFQUNBLGVBQUE7RUFDQSxpQkFBQTtFQUNBLHFCQUFBO0VBQ0Esa0JBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7QUF3ZVI7QUFyZUk7RUFDSSxVQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0VBQ0EsZ0JBQUE7RUFDQSxTQUFBO0VBQ0EsdUVEdEhVO0VDdUhWLGdCQUFBO0VBQ0EsZUFBQTtFQUNBLGlCQUFBO0VBQ0EscUJBQUE7RUFDQSxrQkFBQTtFQUNBLHNCQUFBO0VBQ0Esa0REdkdNO0VDd0dOLDJDRHRIUztBQzZsQmpCO0FBcGVJO0VBQ0ksdUVEbElVO0VDbUlWLGdCQUFBO0VBQ0EsZUFBQTtFQUNBLGlCQUFBO0VBQ0EscUJBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7RUFDQSxxQ0RsSUk7RUNtSUoscUJBQUE7QUFzZVI7QUFuZUk7RUFDSSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxRQUFBO0VBQ0EsdUJBQUE7RUFDQSxxQkFBQTtBQXFlUjtBQWxlSTtFQUNJLHVFRHRKVTtFQ3VKVixnQkFBQTtFQUNBLGVBQUE7RUFDQSxpQkFBQTtFQUNBLHFCQUFBO0VBQ0Esc0JBQUE7QUFvZVI7QUFqZUk7RUFDSSx1RUQvSlU7RUNnS1YsZ0JBQUE7RUFDQSxlQUFBO0VBQ0EsaUJBQUE7RUFDQSxxQkFBQTtFQUNBLGtCQUFBO0VBQ0Esc0JBQUE7RUFDQSwyQ0Q5SlM7QUNpb0JqQjtBQWhlSTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLDBDQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQkFBQTtBQWtlUjtBQS9kSTtFQUNJLHVERHhKVTtBQ3luQmxCO0FBOWRJO0VBQ0ksZUFBQTtBQWdlUjtBQTlkUTtFQUNJLDZCQUFBO0FBZ2VaO0FBNWRJO0VBQ0kseUJBQUE7VUFBQSxpQkFBQTtFQUNBLGlCQUFBO0VBQ0Esc0JBQUE7QUE4ZFI7QUEzZEk7RUFDSSxjQUFBO0VBQ0EsWUFBQTtBQTZkUjtBQTFkSTtFQUNJLG1CQUFBO0VBQ0EsaUREaExVO0VDaUxWLGtEQUFBO0VBQ0Esb0JBQUE7RUFDQSx5Q0FBQTtFQUNBLHFDRHZNSTtFQ3dNSixlQUFBO0VBQ0Esb0JBQUE7RUFDQSx1RURqTlU7RUNrTlYsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsUUFBQTtFQUNBLHNCQUFBO0VBQ0EsaUJBQUE7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLHlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxvQkFBQTtFQUNBLHFOQUNJO0FBMmRaO0FBdGRRO0VBQ0ksbUJEeFBVO0VDeVBWLGlERDFQSztFQzJQTCw2Q0FBQTtBQXdkWjtBQXJkUTtFQUNJLHNCQUFBO0FBdWRaO0FBcGRRO0VBQ0ksc0RBQUE7RUFDQSxtQkFBQTtBQXNkWjtBQWxkSTtFQUNJLDBDRHpRUztFQzBRVCxhQUFBO0VBQ0EsY0FBQTtFQUNBLGNBQUE7QUFvZFI7QUFqZEk7RUFDSSxjQUFBO0VBQ0EsWUFBQTtFQUNBLFdBQUE7QUFtZFI7QUFoZEk7RUFDSSxnQkFBQTtFQUNBLG1CQUFBO0FBa2RSIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcIi4vdmFyaWFibGVzXCI7XG5cbjpyb290IHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbn1cblxuLnplbGYtYnV0dG9uLWV4dGVybmFsLWxpbmsge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuXG4gICAgJi0td2lkZSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cbn1cblxuLnplbGYtYnV0dG9uIHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBnYXA6IDhweDtcbiAgICBoZWlnaHQ6IDU2cHg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBwYWRkaW5nOiA4cHggMjRweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG5cbiAgICBzcGFuIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogOHB4O1xuICAgIH1cblxuICAgIHAge1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIGNvbG9yOiBpbmhlcml0O1xuICAgIH1cblxuICAgICZfX3RleHQge1xuICAgICAgICAmLS1tYXJnaW4tcmlnaHQge1xuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0taHlwZXJsaW5rIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIHBhZGRpbmc6IDhweCAxNnB4O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmLS1zbWFsbCB7XG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tdGhpbiB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgcGFkZGluZzogMTJweCAxNnB4O1xuICAgIH1cblxuICAgICYtLXdpZGUge1xuICAgICAgICB3aWR0aDogMTAwJTtcblxuICAgICAgICAmLnplbGYtYnV0dG9uLS1oeXBlcmxpbmsge1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXByaW1hcnkge1xuICAgICAgICAvLyBNREMgbWF0LWZsYXQtYnV0dG9uIHBhaW50cyB2aWEgQ1NTIHZhcmlhYmxlczsgYWxpZ24gd2l0aCBaZWxmIHRva2VucyAoYXZvaWRzIGRlZmF1bHQgTWF0ZXJpYWwgYmx1ZSkuXG4gICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b259ICFpbXBvcnRhbnQ7XG4gICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tbGFiZWwtdGV4dC1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQ2FyZH0gIWltcG9ydGFudDtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmFjdGl2ZSB7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXJ9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5fSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVDYXJkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc2Vjb25kYXJ5IHtcbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeX0gIWltcG9ydGFudDtcbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0fSAhaW1wb3J0YW50O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVDYXJkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJvcmRlcn0gIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10ZXJ0aWFyeSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3IgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tb3V0bGluZWQge1xuICAgICAgICAtLW1kYy1vdXRsaW5lZC1idXR0b24tbGFiZWwtdGV4dC1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9ufSAhaW1wb3J0YW50O1xuICAgICAgICAtLW1kYy1vdXRsaW5lZC1idXR0b24tb3V0bGluZS1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQm9yZGVyfSAhaW1wb3J0YW50O1xuXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b247XG4gICAgICAgIH1cblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1yZWQge1xuICAgICAgICBib3JkZXI6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tZXJyb3Ige1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc3VjY2VzcyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdExpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRjb3JyZWN0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1waWxsIHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBtaW4taGVpZ2h0OiAwO1xuICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgICAgIHBhZGRpbmc6IDRweCAxMnB4O1xuICAgIH1cbn1cblxuLnplbGYtaWNvbi1idXR0b24ge1xuICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyLXJhZGl1czogNTZweDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgZ2FwOiAxNnB4O1xuICAgIGhlaWdodDogNTZweDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBtaW4taGVpZ2h0OiA1NnB4O1xuICAgIG1pbi13aWR0aDogNTZweDtcbiAgICBvdXRsaW5lOiBub25lO1xuICAgIHRyYW5zaXRpb246XG4gICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICB3aWR0aDogNTZweDtcblxuICAgIHNwYW4ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgfVxuXG4gICAgJi56ZWxmLWljb24tYnV0dG9uLS1ib3JkZXItc29mdCB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgfVxuXG4gICAgc3ZnIHtcbiAgICAgICAgdHJhbnNpdGlvbjogZmlsbCAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgaGVpZ2h0OiAyNHB4O1xuICAgICAgICB3aWR0aDogMjRweDtcbiAgICB9XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tYm9yZGVyLXNvZnQge1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIH1cblxuICAgICYtLTQwIHtcbiAgICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgICBtaW4taGVpZ2h0OiA0MHB4O1xuICAgICAgICBtaW4td2lkdGg6IDQwcHg7XG4gICAgICAgIHdpZHRoOiA0MHB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA0MHB4O1xuICAgICAgICBwYWRkaW5nOiAwIDhweDtcblxuICAgICAgICAmLnplbGYtaWNvbi1idXR0b24tLWJvcmRlci1zb2Z0IHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgaGVpZ2h0OiAyMHB4O1xuICAgICAgICAgICAgd2lkdGg6IDIwcHg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1oeXBlcmxpbmsge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICAgICAgcGFkZGluZzogOHB4IDE2cHg7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICYtLXNtYWxsIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tcHJpbWFyeSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6YWN0aXZlIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc2Vjb25kYXJ5IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXIgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10cmFuc3BhcmVudCB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10ZXh0IHtcbiAgICAgICAgd2lkdGg6IGF1dG8gIWltcG9ydGFudDtcbiAgICAgICAgbWluLXdpZHRoOiBpbml0aWFsICFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgJi0tZXJyb3Ige1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc3VjY2VzcyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdExpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRjb3JyZWN0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1waWxsIHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBoZWlnaHQ6IGF1dG87XG4gICAgICAgIG1pbi1oZWlnaHQ6IDA7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgcGFkZGluZzogNHB4IDEycHg7XG4gICAgICAgIHdpZHRoOiBhdXRvO1xuICAgIH1cbn1cblxuLnplbGYtaWNvbi1idXR0b24tZ3JvdXAge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDA7XG5cbiAgICAuemVsZi1pY29uLWJ1dHRvbiB7XG4gICAgICAgICY6Zmlyc3QtY2hpbGQge1xuICAgICAgICAgICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDA7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6bm90KDpmaXJzdC1jaGlsZCk6bm90KDpsYXN0LWNoaWxkKSB7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpsYXN0LWNoaWxkIHtcbiAgICAgICAgICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAwO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uemVsZi1hY3Rpb24tYnV0dG9uIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogOHB4O1xuXG4gICAgJl9faWNvbiB7XG4gICAgICAgIHBhZGRpbmc6IDEwcHggMjBweDtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDMycHg7XG4gICAgICAgIG91dGxpbmU6IDFweCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyIHNvbGlkO1xuICAgICAgICBvdXRsaW5lLW9mZnNldDogLTFweDtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogdmFyaWFibGVzLiRtaW5TbWFsbCkge1xuICAgICAgICAgICAgcGFkZGluZzogOHB4IDE0cHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBmaWxsIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgICAgIH1cblxuICAgICAgICAubWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBmb250LXNpemU6IDI0cHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcbiAgICAgICAgICAgIGZvbnQtdmFyaWF0aW9uLXNldHRpbmdzOlxuICAgICAgICAgICAgICAgIFwiRklMTFwiIDAsXG4gICAgICAgICAgICAgICAgXCJ3Z2h0XCIgNDAwLFxuICAgICAgICAgICAgICAgIFwiR1JBRFwiIDAsXG4gICAgICAgICAgICAgICAgXCJvcHN6XCIgMjQ7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHByaW1hcnlDb2xvcjtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQge1xuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLnplbGYtYWN0aW9uLWJ1dHRvbl9fdGV4dCB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9faWNvbi1ib3gge1xuICAgICAgICB3aWR0aDogMjhweDtcbiAgICAgICAgaGVpZ2h0OiAyOHB4O1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX190ZXh0IHtcbiAgICAgICAgd2lkdGg6IGF1dG87XG4gICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE2cHg7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjVweDtcbiAgICAgICAgd29yZC13cmFwOiBub3JtYWw7XG4gICAgfVxufVxuIiwiJHByaW1hcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXByaW1hcnksICMxODE4MTgpO1xuJHByaW1hcnlMaWdodDogI2RhZGRmYTtcbiRzZWNvbmRhcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXNlY29uZGFyeSwgI2ZmNTcyMSk7XG4kc2Vjb25kYXJ5Q29sb3JMaWdodDogI2Y2ZTVlMDtcblxuJGNvcnJlY3Q6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLCAjMWVhNDQ2KTtcbiRjb3JyZWN0RGFyazogIzBmNTIyMztcbiRjb3JyZWN0TGlnaHQ6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLXRleHQsICNlN2Y4ZWQpO1xuXG4kZXJyb3I6IHZhcigtLXpucy10aGVtZS1lcnJvciwgI2RjMzYyZSk7XG4kZXJyb3JEYXJrOiAjNjAxNDEwO1xuJGVycm9yTGlnaHQ6IHZhcigtLXpucy10aGVtZS1lcnJvci10ZXh0LCAjZmNlZWVlKTtcblxuJHdhcm5pbmc6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLCAjZGU2ODAwKTtcbiR3YXJuaW5nRGFyazogIzRhMjEwYTtcbiR3YXJuaW5nTGlnaHQ6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLXRleHQsICNmZmVlZTkpO1xuXG4kaW5mbzogIzM5OThkMztcbiRpbmZvRGFyazogIzAwNGE3NztcbiRpbmZvTGlnaHQ6ICNlY2YzZmU7XG5cbiRibGFjazogIzE4MTgxODtcbiR3aGl0ZTogI2ZmZmZmZjtcblxuJHRoZW1lQm9keUZhbWlseTogdmFyKC0tem5zLXRoZW1lLWJvZHktZmFtaWx5LCBcIlBvcHBpbnNcIiwgQXJpYWwsIHNhbnMtc2VyaWYpO1xuJHRoZW1lVGl0bGVGYW1pbHk6IHZhcigtLXpucy10aGVtZS10aXRsZS1mYW1pbHksIFwiTWVuZGFcIiwgXCJBcmlhbCBCbGFja1wiLCBzYW5zLXNlcmlmKTtcbiR0aGVtZU1vbm9zcGFjZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLW1vbm9zcGFjZS1mYW1pbHksIFwiQ291cmllciBOZXdcIiwgQ291cmllciwgbW9ub3NwYWNlKTtcblxuJHRoZW1lQmFja2dyb3VuZDogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQsICNmZmZmZmYpO1xuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQtc2Vjb25kYXJ5LCAjZjlmOWZjKTtcblxuJHRoZW1lVGV4dDogdmFyKC0tem5zLXRoZW1lLXRleHQsICMxODE4MTgpO1xuJHRoZW1lVGV4dE11dGVkOiB2YXIoLS16bnMtdGhlbWUtdGV4dC1tdXRlZCwgIzk2OTM5ZSk7XG4kdGhlbWVUZXh0U2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtdGV4dC1zZWNvbmRhcnksICM3Mzc3N2YpO1xuXG4kdGhlbWVIZWFkZXI6IHZhcigtLXpucy10aGVtZS1oZWFkZXIsICMxODE4MTgpO1xuJHRoZW1lSGVhZGVyVGV4dDogdmFyKC0tem5zLXRoZW1lLWhlYWRlci10ZXh0LCAjZmZmZmZmKTtcblxuJHRoZW1lQnV0dG9uOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLCAjMTgxODE4KTtcbiR0aGVtZUJ1dHRvblRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tdGV4dCwgI2ZmZmZmZik7XG4kdGhlbWVCdXR0b25Ib3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1ob3ZlciwgI2ZmNTcyMSk7XG5cbiR0aGVtZUJ1dHRvblNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnksICNlOWVjZWYpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktdGV4dCwgIzQ5NTA1Nyk7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktaG92ZXIsICNlOWVjZWYpO1xuXG4kdGhlbWVCb3JkZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXIsICNlM2UzZTMpO1xuJHRoZW1lQm9yZGVySG92ZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXItaG92ZXIsICNjM2M2Y2YpO1xuXG4kdGhlbWVDYXJkOiB2YXIoLS16bnMtdGhlbWUtY2FyZCwgI2ZmZmZmZik7XG4kdGhlbWVDYXJkQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtY2FyZC1ib3JkZXIsICNlZWVkZjEpO1xuXG4kdGhlbWVTaGFkb3c6IHZhcigtLXpucy10aGVtZS1zaGFkb3csIHJnYmEoMCwgMCwgMCwgMC4xKSk7XG5cbiRzbW9vdGhCZXppZXI6IGN1YmljLWJlemllcigwLjI1LCAwLjQsIDAuNywgMSk7XG5cbiRtYXhFeHRyYVNtYWxsOiA1OTVweDtcbiRtaW5TbWFsbDogNjAwcHg7XG4kbWVkaXVtOiA3NjhweDtcbiRsYXJnZTogODg5cHg7XG4kY29tcHV0ZXJzOiAxMjAwcHg7XG4iLCJAdXNlIFwiLi4vLi4vc3R5bGVzL3ZhcmlhYmxlc1wiO1xuQHVzZSBcIi4uLy4uL3N0eWxlcy9idXR0b25zXCI7XG5cbjpob3N0IHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBmbGV4LWdyb3c6IDE7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5yZWNlaXZlLWN1cnJlbmN5IHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBtYXgtd2lkdGg6IHZhcigtLXpucy1jYXJkLXdpZHRoLCA1MzZweCk7XG4gICAgbWluLWhlaWdodDogdmFyKC0tem5zLWNhcmQtbWluLWhlaWdodCwgNzY4cHgpO1xuXG4gICAgJl9faGVhZGVyIHtcbiAgICAgICAgZGlzcGxheTogZ3JpZDtcbiAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTAsIDFmcik7XG4gICAgICAgIGNvbHVtbi1nYXA6IGNhbGMoMTJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBhbGlnbi1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3RhcnQ7XG4gICAgICAgIGdhcDogY2FsYygyNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgICZfX2NvbDEsXG4gICAgJl9fY29sMyB7XG4gICAgICAgIGdyaWQtY29sdW1uOiBzcGFuIDM7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgJl9fY29sMSB7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3RhcnQ7XG4gICAgfVxuXG4gICAgJl9fY29sMiB7XG4gICAgICAgIGdyaWQtY29sdW1uOiBzcGFuIDQ7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX19jb2wzIHtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBlbmQ7XG4gICAgfVxuXG4gICAgJl9fdGl0bGUge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZVRpdGxlRmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogMzAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMjRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDIwcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xcHg7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgIH1cblxuICAgICZfX2NvbnRlbnQge1xuICAgICAgICBmbGV4OiAxIDEgYXV0bztcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgfVxuXG4gICAgJl9fbG9hZGVyIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICBpbnNldDogMDtcbiAgICAgICAgbWFyZ2luOiBhdXRvO1xuICAgIH1cbn1cblxuLm5ldHdvcmstaXRlbSB7XG4gICAgY29sb3I6IGluaGVyaXQ7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICBnYXA6IGNhbGMoMjRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIHBhZGRpbmc6IGNhbGMoMTZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcblxuICAgICY6dmlzaXRlZCxcbiAgICAmOmFjdGl2ZSxcbiAgICAmOmZvY3VzIHtcbiAgICAgICAgY29sb3I6IGluaGVyaXQ7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICB9XG5cbiAgICAmX19pY29uIHtcbiAgICAgICAgaGVpZ2h0OiBjYWxjKDQwcHggKiB2YXIoLS16bnMtYWN0aW9uLXNjYWxlLCAxKSk7XG4gICAgICAgIHdpZHRoOiBjYWxjKDQwcHggKiB2YXIoLS16bnMtYWN0aW9uLXNjYWxlLCAxKSk7XG4gICAgICAgIG1pbi1oZWlnaHQ6IGNhbGMoNDBweCAqIHZhcigtLXpucy1hY3Rpb24tc2NhbGUsIDEpKTtcbiAgICAgICAgbWluLXdpZHRoOiBjYWxjKDQwcHggKiB2YXIoLS16bnMtYWN0aW9uLXNjYWxlLCAxKSk7XG4gICAgICAgIG9iamVjdC1maXQ6IGNvbnRhaW47XG4gICAgfVxuXG4gICAgJl9fbmFtZSB7XG4gICAgICAgIGZvbnQtc2l6ZTogMXJlbTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgfVxuXG4gICAgJl9faW5mbyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogNHB4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgICAgICBmbGV4OiAxIDEgYXV0bztcbiAgICB9XG5cbiAgICAmX19uZXR3b3JrLWluZm8ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgIH1cblxuICAgICZfX25ldHdvcmsge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDIwcHg7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjFweDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgfVxuXG4gICAgJl9fbmV0d29yay1jaGlwIHtcbiAgICAgICAgaGVpZ2h0OiAyMDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMjRweDtcbiAgICAgICAgZ2FwOiAxMHB4O1xuICAgICAgICBwYWRkaW5nOiAycHggOHB4O1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgZm9udC1zaXplOiAxMXB4O1xuICAgICAgICBsaW5lLWhlaWdodDogMTZweDtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgIH1cblxuICAgICZfX25hbWUge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE2cHg7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjVweDtcbiAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcbiAgICB9XG5cbiAgICAmX19iYWxhbmNlIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiA0cHg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XG4gICAgfVxuXG4gICAgJl9fYmFsYW5jZS1hbW91bnQge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDIwcHg7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjFweDtcbiAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICB9XG5cbiAgICAmX19maWF0LWFtb3VudCB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgZm9udC1zaXplOiAxMXB4O1xuICAgICAgICBsaW5lLWhlaWdodDogMTZweDtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgIH1cblxuICAgICZfX2J1dHRvbnMge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIH1cblxuICAgICY6aG92ZXIge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICB9XG5cbiAgICAmLS1wbGFjZWhvbGRlciB7XG4gICAgICAgIGN1cnNvcjogZGVmYXVsdDtcblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fbmFtZS0tcGxhY2Vob2xkZXItYmx1ciB7XG4gICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICBmaWx0ZXI6IGJsdXIoNHB4KTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMDJlbTtcbiAgICB9XG5cbiAgICAmX19idXR0b25zLS1nZW5lcmF0ZSB7XG4gICAgICAgIGZsZXg6IDAgMCBhdXRvO1xuICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgfVxuXG4gICAgJl9fZ2VuZXJhdGUtYnRuIHtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xuICAgICAgICBib3gtc2hhZG93OiAwIDFweCAycHggcmdiYSgwLCAwLCAwLCAwLjA2KTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtc2l6ZTogMTBweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgZ2FwOiA1cHg7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjA2ZW07XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjE1O1xuICAgICAgICBtYXgtd2lkdGg6IG5vbmU7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDA7XG4gICAgICAgIHBhZGRpbmc6IDVweCAxMnB4IDVweCA4cHg7XG4gICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgIHRleHQtdHJhbnNmb3JtOiBub25lO1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYm9yZGVyLWNvbG9yIDAuMnMgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBib3gtc2hhZG93IDAuMnMgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICB0cmFuc2Zvcm0gMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3JMaWdodDtcbiAgICAgICAgICAgIGJvcmRlci1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvcjtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMCAwIDFweCByZ2JhKDI1NSwgODcsIDMzLCAwLjE4KTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6YWN0aXZlIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMC45OCk7XG4gICAgICAgIH1cblxuICAgICAgICAmOmZvY3VzLXZpc2libGUge1xuICAgICAgICAgICAgb3V0bGluZTogMnB4IHNvbGlkIHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3I7XG4gICAgICAgICAgICBvdXRsaW5lLW9mZnNldDogMnB4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fZ2VuZXJhdGUtYnRuLXdyYXAge1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvcjtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleDogMCAwIGF1dG87XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAwO1xuICAgIH1cblxuICAgICZfX2dlbmVyYXRlLWljb24ge1xuICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgaGVpZ2h0OiAxMnB4O1xuICAgICAgICB3aWR0aDogMTJweDtcbiAgICB9XG5cbiAgICAmX19nZW5lcmF0ZS1sYWJlbCB7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjI7XG4gICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
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

/***/ }

}]);
//# sourceMappingURL=src_app_receive-currency_receive-currency_component_ts.js.map