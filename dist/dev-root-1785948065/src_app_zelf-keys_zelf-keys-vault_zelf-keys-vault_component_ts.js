"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_zelf-keys_zelf-keys-vault_zelf-keys-vault_component_ts"],{

/***/ 47633
/*!************************************************************************!*\
  !*** ./src/app/zelf-keys/zelf-keys-vault/zelf-keys-vault.component.ts ***!
  \************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZelfKeysVaultComponent: () => (/* binding */ ZelfKeysVaultComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 34487);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 14876);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 52575);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 91817);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 51567);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs */ 70271);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 47470);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs */ 64334);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs */ 33900);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _chrome_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../chrome.service */ 85043);
/* harmony import */ var _services_password_data_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../services/password-data.service */ 9526);
/* harmony import */ var _services_payment_card_data_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../services/payment-card-data.service */ 52440);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var _wallet_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../../wallet.service */ 69556);
/* harmony import */ var _services_zelf_keys_data_service__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../../services/zelf-keys-data.service */ 18487);
















const _c0 = a0 => ({
  "vault__row-icon--card": a0
});
function ZelfKeysVaultComponent_div_0_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](1, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](2, "p", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtextInterpolate"](t_r1("billing.passwords.loading.title"));
  }
}
function ZelfKeysVaultComponent_div_0_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](0, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](1, "svg", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](2, "circle", 10)(3, "path", 11)(4, "path", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](5, "p", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](7, "button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵlistener"]("click", function ZelfKeysVaultComponent_div_0_div_2_Template_button_click_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r2);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r2.onRefresh());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"]().$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtextInterpolate"](ctx_r2.error);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtextInterpolate1"](" ", t_r1("billing.passwords.error.try_again"), " ");
  }
}
function ZelfKeysVaultComponent_div_0_div_3_div_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](0, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](1, "svg", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](2, "path", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](3, "input", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"](2).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("formControl", ctx_r2.searchControl)("placeholder", t_r1("billing.passwords.search.placeholder"));
  }
}
function ZelfKeysVaultComponent_div_0_div_3_div_14_div_1__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](0, "svg", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](1, "rect", 41)(2, "path", 42)(3, "circle", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
  }
}
function ZelfKeysVaultComponent_div_0_div_3_div_14_div_1__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](0, "svg", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](1, "rect", 44)(2, "path", 45)(3, "path", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
  }
}
function ZelfKeysVaultComponent_div_0_div_3_div_14_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](0, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵlistener"]("click", function ZelfKeysVaultComponent_div_0_div_3_div_14_div_1_Template_div_click_0_listener() {
      const item_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r5).$implicit;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r2.onItemClick(item_r6));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](1, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtemplate"](2, ZelfKeysVaultComponent_div_0_div_3_div_14_div_1__svg_svg_2_Template, 4, 0, "svg", 34)(3, ZelfKeysVaultComponent_div_0_div_3_div_14_div_1__svg_svg_3_Template, 4, 0, "svg", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](4, "div", 35)(5, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](7, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](9, "svg", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](10, "path", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵpureFunction1"](5, _c0, item_r6.type === "card"));
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("ngIf", item_r6.type === "password");
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("ngIf", item_r6.type === "card");
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtextInterpolate"](item_r6.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtextInterpolate"](item_r6.subtitle);
  }
}
function ZelfKeysVaultComponent_div_0_div_3_div_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](0, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtemplate"](1, ZelfKeysVaultComponent_div_0_div_3_div_14_div_1_Template, 11, 7, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("ngForOf", ctx_r2.filteredItems)("ngForTrackBy", ctx_r2.trackByItem);
  }
}
function ZelfKeysVaultComponent_div_0_div_3_div_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](0, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](1, "svg", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](2, "rect", 49)(3, "path", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](4, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtextInterpolate"](t_r1("billing.passwords.add_password.description"));
  }
}
function ZelfKeysVaultComponent_div_0_div_3_div_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](0, "div", 47)(1, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtextInterpolate"](t_r1("billing.passwords.no_results.title"));
  }
}
function ZelfKeysVaultComponent_div_0_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](0, "div", 14)(1, "div", 15)(2, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵlistener"]("click", function ZelfKeysVaultComponent_div_0_div_3_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r4);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r2.onAddPassword());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](3, "svg", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](4, "path", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](6, "button", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵlistener"]("click", function ZelfKeysVaultComponent_div_0_div_3_Template_button_click_6_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r4);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r2.onAddCard());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](7, "svg", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](8, "path", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](10, "button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵlistener"]("click", function ZelfKeysVaultComponent_div_0_div_3_Template_button_click_10_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r4);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r2.onRefresh());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](11, "svg", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelement"](12, "path", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtemplate"](13, ZelfKeysVaultComponent_div_0_div_3_div_13_Template, 4, 2, "div", 23)(14, ZelfKeysVaultComponent_div_0_div_3_div_14_Template, 2, 2, "div", 24)(15, ZelfKeysVaultComponent_div_0_div_3_div_15_Template, 6, 1, "div", 25)(16, ZelfKeysVaultComponent_div_0_div_3_div_16_Template, 3, 1, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"]().$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtextInterpolate1"](" ", t_r1("billing.dashboard.add_password"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtextInterpolate1"](" ", t_r1("billing.dashboard.add_card"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("ngIf", ctx_r2.showFilter);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("ngIf", ctx_r2.filteredItems.length > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("ngIf", ctx_r2.allItems.length === 0 && !ctx_r2.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("ngIf", ctx_r2.allItems.length > 0 && ctx_r2.filteredItems.length === 0);
  }
}
function ZelfKeysVaultComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementStart"](0, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtemplate"](1, ZelfKeysVaultComponent_div_0_div_1_Template, 4, 1, "div", 2)(2, ZelfKeysVaultComponent_div_0_div_2_Template, 9, 2, "div", 3)(3, ZelfKeysVaultComponent_div_0_div_3_Template, 17, 6, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("ngIf", ctx_r2.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("ngIf", ctx_r2.error && !ctx_r2.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵproperty"]("ngIf", !ctx_r2.loading && !ctx_r2.error);
  }
}
class ZelfKeysVaultComponent {
  _changeDetectorRef;
  _chromeService;
  _passwordDataService;
  _paymentCardDataService;
  _router;
  _translocoService;
  _walletService;
  _zelfKeysDataService;
  destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__.Subject();
  _expectedOwnerTag = null;
  _pollSub = null;
  _reinitInFlight = false;
  allItems = [];
  filteredItems = [];
  loading = true;
  error = null;
  searchControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControl("");
  showFilter = false;
  constructor(_changeDetectorRef, _chromeService, _passwordDataService, _paymentCardDataService, _router, _translocoService, _walletService, _zelfKeysDataService) {
    this._changeDetectorRef = _changeDetectorRef;
    this._chromeService = _chromeService;
    this._passwordDataService = _passwordDataService;
    this._paymentCardDataService = _paymentCardDataService;
    this._router = _router;
    this._translocoService = _translocoService;
    this._walletService = _walletService;
    this._zelfKeysDataService = _zelfKeysDataService;
  }
  get currentPlan() {
    return "premium";
  }
  set currentPlan(value) {}
  ngOnInit() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this._setupSearchFilter();
      _this._subscribeToDataService();
      _this._subscribeToLoadingState();
      _this._subscribeToErrorState();
      _this._subscribeToWalletChanges();
      const wallet = yield _this._walletService.getCurrentWallet();
      _this._expectedOwnerTag = _this._zelfKeysDataService.walletTagForCache(wallet);
      yield _this._zelfKeysDataService.ensureLoadedForCurrentWallet({
        forceRefresh: false,
        reason: "vault-enter"
      });
      _this._startWalletPollWatchdog();
    })();
  }
  ngOnDestroy() {
    this._stopWalletPollWatchdog();
    this.destroy$.next();
    this.destroy$.complete();
  }
  _subscribeToWalletChanges() {
    this._chromeService.onWalletChanged$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_10__.map)(w => w?.fullTagName ?? ""), (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.distinctUntilChanged)(), (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.filter)(tag => !!tag), (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.skip)(1), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.takeUntil)(this.destroy$)).subscribe(() => {
      void this._reinitForCurrentWallet("vault-wallet-switch");
    });
  }
  _startWalletPollWatchdog() {
    this._stopWalletPollWatchdog();
    this._pollSub = (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.timer)(3000, 3000).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.take)(5), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.takeUntil)(this.destroy$)).subscribe(() => {
      void this._checkWalletFromStorage("vault-poll-detected-switch");
    });
  }
  _stopWalletPollWatchdog() {
    this._pollSub?.unsubscribe();
    this._pollSub = null;
  }
  _checkWalletFromStorage(reason) {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const wallet = yield _this2._walletService.getCurrentWallet();
      const tag = _this2._zelfKeysDataService.walletTagForCache(wallet);
      if (tag !== _this2._expectedOwnerTag) {
        yield _this2._reinitForCurrentWallet(reason);
      }
    })();
  }
  _reinitForCurrentWallet(reason) {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this3._reinitInFlight) return;
      _this3._reinitInFlight = true;
      try {
        _this3.allItems = [];
        _this3.filteredItems = [];
        _this3.searchControl.setValue("", {
          emitEvent: false
        });
        _this3.loading = true;
        const wallet = yield _this3._walletService.getCurrentWallet();
        _this3._expectedOwnerTag = _this3._zelfKeysDataService.walletTagForCache(wallet);
        yield _this3._zelfKeysDataService.reloadForWalletSwitch(reason);
      } finally {
        _this3._reinitInFlight = false;
        _this3._startWalletPollWatchdog();
        _this3._changeDetectorRef.detectChanges();
      }
    })();
  }
  _subscribeToDataService() {
    this._zelfKeysDataService.data$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_13__.takeUntil)(this.destroy$)).subscribe(data => {
      void this._applyDataIfCurrentWallet(data);
    });
  }
  _applyDataIfCurrentWallet(data) {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const wallet = yield _this4._walletService.getCurrentWallet();
      const expectedTag = _this4._zelfKeysDataService.walletTagForCache(wallet);
      if (data && _this4._zelfKeysDataService.dataOwnerTag !== expectedTag) {
        _this4.allItems = [];
        _this4.filteredItems = [];
        _this4.showFilter = false;
        void _this4._reinitForCurrentWallet("vault-stale-data");
        return;
      }
      if (!data) {
        _this4.allItems = [];
        _this4.filteredItems = [];
        _this4.showFilter = false;
        _this4._changeDetectorRef.detectChanges();
        return;
      }
      const passwords = (data.passwords || []).map(p => ({
        type: "password",
        title: _this4._getPasswordTitle(p),
        subtitle: _this4._getPasswordSubtitle(p),
        raw: p
      }));
      const cards = (data.paymentCards || []).map(c => ({
        type: "card",
        title: c.cardName || c.publicData?.cardName || _this4._translocoService.translate("zelf_keys.data_card.untitled"),
        subtitle: _this4._getMaskedCardNumber(c.cardNumber || c.publicData?.card || ""),
        raw: c
      }));
      _this4.allItems = [...passwords, ...cards];
      _this4.filteredItems = [..._this4.allItems];
      _this4.showFilter = _this4.allItems.length > 5;
      _this4._changeDetectorRef.detectChanges();
    })();
  }
  _subscribeToLoadingState() {
    this._zelfKeysDataService.loading$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_13__.takeUntil)(this.destroy$)).subscribe(loading => {
      this.loading = loading;
      this._changeDetectorRef.detectChanges();
    });
  }
  _subscribeToErrorState() {
    this._zelfKeysDataService.error$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_13__.takeUntil)(this.destroy$)).subscribe(error => {
      this.error = error ? this._translocoService.translate("zelf_keys.passwords.error.load_failed") : null;
    });
  }
  _setupSearchFilter() {
    this.searchControl.valueChanges.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_7__.debounceTime)(300), (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.distinctUntilChanged)(), (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.takeUntil)(this.destroy$)).subscribe(term => {
      this._filterItems(term || "");
    });
  }
  _filterItems(term) {
    if (!term.trim()) {
      this.filteredItems = [...this.allItems];
      return;
    }
    const lower = term.toLowerCase();
    this.filteredItems = this.allItems.filter(item => item.title.toLowerCase().includes(lower) || item.subtitle.toLowerCase().includes(lower));
  }
  _getPasswordTitle(password) {
    if (password.publicData?.website) {
      try {
        return new URL(password.publicData.website).hostname;
      } catch {
        return password.publicData.website;
      }
    }
    if (password.publicData?.title) return password.publicData.title;
    if (password.title) return password.title;
    if (password.name) {
      return password.name?.replace(/\.png$/, "").split("_").pop() || this._translocoService.translate("zelf_keys.data_card.untitled");
    }
    return this._translocoService.translate("zelf_keys.data_card.untitled");
  }
  _getPasswordSubtitle(password) {
    if (password.publicData?.username) return password.publicData.username;
    if (password.publicData?.description) return password.publicData.description;
    if (password.subtitle) return password.subtitle;
    if (password.publicData?.zelfName) return password.publicData.zelfName;
    return this._translocoService.translate("zelf_keys.data_card.secure_credential");
  }
  _getMaskedCardNumber(cardNumber) {
    if (!cardNumber) return "•••• ••••";
    const cleaned = cardNumber.replace(/\D/g, "");
    if (cleaned.length < 4) return "•••• " + cleaned;
    const last4 = cleaned.slice(-4);
    return "•••• •••• •••• " + last4;
  }
  onItemClick(item) {
    if (item.type === "password") {
      this._passwordDataService.setCurrentPassword(item.raw);
      this._router.navigate(["/zelf-keys/passwords/detail"]);
    } else {
      const sourceCard = item.raw.rawData || item.raw;
      const zelfProof = item.raw.zelfProof || item.raw.publicData?.zelfProof || sourceCard.zelfProof || sourceCard.publicData?.zelfProof || item.raw.id;
      const publicData = {
        ...(sourceCard.publicData || {}),
        ...(item.raw.publicData || {}),
        type: "credit_card",
        card: item.raw.publicData?.card || sourceCard.publicData?.card || "",
        zelfProof: zelfProof
      };
      const cardItem = {
        id: item.raw.id || sourceCard.id || sourceCard.identifier || "",
        name: item.raw.name || sourceCard.name || "",
        url: item.raw.url || sourceCard.url || "",
        size: item.raw.size || sourceCard.size || 0,
        timestamp: item.raw.timestamp || sourceCard.timestamp || sourceCard.createdAt || new Date().toISOString(),
        publicData: publicData,
        zelfProof: zelfProof
      };
      this._paymentCardDataService.setCurrentPaymentCard(cardItem);
      this._router.navigate(["/zelf-keys/payment-cards/detail"]);
    }
  }
  onAddPassword() {
    this._router.navigate(["/zelf-keys/passwords/new"]);
  }
  onAddCard() {
    this._router.navigate(["/zelf-keys/payment-cards/new"]);
  }
  onRefresh() {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const wallet = yield _this5._walletService.getCurrentWallet();
      _this5._expectedOwnerTag = _this5._zelfKeysDataService.walletTagForCache(wallet);
      yield _this5._zelfKeysDataService.ensureLoadedForCurrentWallet({
        forceRefresh: true,
        reason: "vault-refresh"
      });
    })();
  }
  trackByItem(index, item) {
    return item.type + "-" + (item.raw?.id || item.raw?.publicData?.id || index);
  }
  static ɵfac = function ZelfKeysVaultComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ZelfKeysVaultComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_14__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdirectiveInject"](_chrome_service__WEBPACK_IMPORTED_MODULE_17__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdirectiveInject"](_services_password_data_service__WEBPACK_IMPORTED_MODULE_18__.PasswordDataService), _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdirectiveInject"](_services_payment_card_data_service__WEBPACK_IMPORTED_MODULE_19__.PaymentCardDataService), _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_20__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdirectiveInject"](_jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__.TranslocoService), _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdirectiveInject"](_wallet_service__WEBPACK_IMPORTED_MODULE_21__.WalletService), _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdirectiveInject"](_services_zelf_keys_data_service__WEBPACK_IMPORTED_MODULE_22__.ZelfKeysDataService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵdefineComponent"]({
    type: ZelfKeysVaultComponent,
    selectors: [["zelf-keys-vault"]],
    decls: 1,
    vars: 0,
    consts: [["class", "vault", 4, "transloco"], [1, "vault"], ["class", "vault__state vault__state--loading", 4, "ngIf"], ["class", "vault__state vault__state--error", 4, "ngIf"], ["class", "vault__content", 4, "ngIf"], [1, "vault__state", "vault__state--loading"], [1, "vault__spinner"], [1, "vault__state-text"], [1, "vault__state", "vault__state--error"], ["width", "48", "height", "48", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "vault__state-icon"], ["cx", "12", "cy", "12", "r", "10", "stroke", "#ff6b6b", "stroke-width", "2"], ["d", "m15 9-6 6", "stroke", "#ff6b6b", "stroke-width", "2", "stroke-linecap", "round"], ["d", "m9 9 6 6", "stroke", "#ff6b6b", "stroke-width", "2", "stroke-linecap", "round"], [1, "zelf-button", "zelf-button--primary", 3, "click"], [1, "vault__content"], [1, "vault__actions"], [1, "vault__add-btn", 3, "click"], ["width", "18", "height", "18", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M12 5v14M5 12h14", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round"], [1, "vault__add-btn", "vault__add-btn--secondary", 3, "click"], [1, "vault__icon-btn", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "height", "20", "viewBox", "0 -960 960 960", "width", "20", "fill", "currentColor"], ["d", "M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"], ["class", "vault__search", 4, "ngIf"], ["class", "vault__list", 4, "ngIf"], ["class", "vault__empty", 4, "ngIf"], [1, "vault__search"], ["width", "18", "height", "18", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "vault__search-icon"], ["d", "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["autocomplete", "off", "type", "text", 1, "vault__search-input", 3, "formControl", "placeholder"], [1, "vault__list"], ["class", "vault__row", 3, "click", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "vault__row", 3, "click"], [1, "vault__row-icon", 3, "ngClass"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], [1, "vault__row-info"], [1, "vault__row-title"], [1, "vault__row-subtitle"], ["width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "vault__row-chevron"], ["d", "M9 18l6-6-6-6", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["x", "3", "y", "11", "width", "18", "height", "11", "rx", "2", "stroke", "currentColor", "stroke-width", "2"], ["d", "M7 11V7a5 5 0 0 1 10 0v4", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round"], ["cx", "12", "cy", "16.5", "r", "1.5", "fill", "currentColor"], ["x", "2", "y", "5", "width", "20", "height", "14", "rx", "2", "stroke", "currentColor", "stroke-width", "2"], ["d", "M2 10h20", "stroke", "currentColor", "stroke-width", "2"], ["d", "M6 15h4", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round"], [1, "vault__empty"], ["width", "48", "height", "48", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["x", "3", "y", "11", "width", "18", "height", "11", "rx", "2", "stroke", "currentColor", "stroke-width", "1.5"], ["d", "M7 11V7a5 5 0 0 1 10 0v4", "stroke", "currentColor", "stroke-width", "1.5", "stroke-linecap", "round"]],
    template: function ZelfKeysVaultComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_16__["ɵɵtemplate"](0, ZelfKeysVaultComponent_div_0_Template, 4, 3, "div", 0);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__.TranslocoDirective, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControlDirective],
    styles: [".vault[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: calc(16px * var(--zns-space-scale, 1));\n  height: 100%;\n  min-height: 0; \n\n  \n\n  \n\n}\n.dashboard[_ngcontent-%COMP%]   .vault[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n}\n.vault__state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: calc(48px * var(--zns-space-scale, 1)) calc(24px * var(--zns-space-scale, 1));\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: calc(16px * var(--zns-space-scale, 1));\n}\n.vault__state--loading[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text-muted, #96939e);\n}\n.vault__state--error[_ngcontent-%COMP%] {\n  color: var(--zns-theme-error, #dc362e);\n}\n.vault__spinner[_ngcontent-%COMP%] {\n  width: calc(36px * var(--zns-space-scale, 1));\n  height: calc(36px * var(--zns-space-scale, 1));\n  border: 3px solid var(--zns-theme-border, #e3e3e3);\n  border-top: 3px solid var(--zns-theme-primary, #181818);\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n.vault__state-text[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  margin: 0;\n  color: var(--zns-theme-text-secondary, #73777f);\n}\n.vault__state-icon[_ngcontent-%COMP%] {\n  opacity: 0.7;\n}\n.vault__content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: calc(14px * var(--zns-space-scale, 1));\n  flex: 1 1 auto;\n  min-height: 0;\n}\n.vault__list[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow: auto;\n}\n.vault__actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n}\n.vault__add-btn[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: calc(6px * var(--zns-space-scale, 1));\n  padding: calc(10px * var(--zns-space-scale, 1)) calc(14px * var(--zns-space-scale, 1));\n  border: none;\n  border-radius: calc(12px * var(--zns-space-scale, 1));\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: calc(13px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  cursor: pointer;\n  transition: transform 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), box-shadow 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n  background: var(--zns-theme-button, #181818);\n  color: var(--zns-theme-button-text, #ffffff);\n}\n.vault__add-btn[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);\n}\n.vault__add-btn[_ngcontent-%COMP%]:active {\n  transform: scale(0.97);\n}\n.vault__add-btn--secondary[_ngcontent-%COMP%] {\n  background: var(--zns-theme-button-secondary, #e9ecef);\n  color: var(--zns-theme-button-secondary-text, #495057);\n}\n.vault__icon-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: calc(40px * var(--zns-space-scale, 1));\n  height: calc(40px * var(--zns-space-scale, 1));\n  border: none;\n  border-radius: calc(12px * var(--zns-space-scale, 1));\n  background: var(--zns-theme-button-secondary, #e9ecef);\n  color: var(--zns-theme-button-secondary-text, #495057);\n  cursor: pointer;\n  flex-shrink: 0;\n  transition: background 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.vault__icon-btn[_ngcontent-%COMP%]:hover {\n  background: var(--zns-theme-button-secondary-hover, #e9ecef);\n}\n.vault__search[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n}\n.vault__search-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: calc(14px * var(--zns-space-scale, 1));\n  color: var(--zns-theme-text-muted, #96939e);\n  pointer-events: none;\n}\n.vault__search-input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: calc(10px * var(--zns-space-scale, 1)) calc(14px * var(--zns-space-scale, 1)) calc(10px * var(--zns-space-scale, 1)) calc(38px * var(--zns-space-scale, 1));\n  border: 1px solid transparent;\n  background: linear-gradient(var(--zns-theme-background-secondary, #f9f9fc), var(--zns-theme-background-secondary, #f9f9fc)) padding-box, linear-gradient(135deg, var(--zns-theme-border-hover, #c3c6cf), var(--zns-theme-card-border, #eeedf1)) border-box;\n  border-radius: calc(14px * var(--zns-space-scale, 1));\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-text, #181818);\n  outline: none;\n  transition: box-shadow 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.vault__search-input[_ngcontent-%COMP%]::placeholder {\n  color: var(--zns-theme-text-muted, #96939e);\n}\n.vault__search-input[_ngcontent-%COMP%]:focus {\n  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.06);\n}\n.vault__list[_ngcontent-%COMP%] {\n  border: 1px solid transparent;\n  background: linear-gradient(var(--zns-theme-card, #ffffff), var(--zns-theme-card, #ffffff)) padding-box, linear-gradient(135deg, var(--zns-theme-border-hover, #c3c6cf), var(--zns-theme-card-border, #eeedf1)) border-box;\n  border-radius: calc(20px * var(--zns-space-scale, 1));\n  overflow: hidden;\n}\n.vault__row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: calc(14px * var(--zns-space-scale, 1));\n  padding: calc(12px * var(--zns-space-scale, 1)) calc(16px * var(--zns-space-scale, 1));\n  cursor: pointer;\n  transition: background 0.15s cubic-bezier(0.25, 0.4, 0.7, 1);\n  border-bottom: 1px solid var(--zns-theme-card-border, #eeedf1);\n}\n.vault__row[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.vault__row[_ngcontent-%COMP%]:hover {\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n}\n.vault__row[_ngcontent-%COMP%]:active {\n  background: var(--zns-theme-border, #e3e3e3);\n}\n.vault__row-icon[_ngcontent-%COMP%] {\n  width: calc(40px * var(--zns-space-scale, 1));\n  height: calc(40px * var(--zns-space-scale, 1));\n  border-radius: calc(12px * var(--zns-space-scale, 1));\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  color: var(--zns-theme-text-secondary, #73777f);\n}\n.vault__row-icon--card[_ngcontent-%COMP%] {\n  color: var(--zns-theme-secondary, #ff5721);\n  background: #f6e5e0;\n}\n.vault__row-info[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: calc(2px * var(--zns-space-scale, 1));\n}\n.vault__row-title[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: calc(15px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n  line-height: 1.3;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.vault__row-subtitle[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: calc(13px * var(--zns-font-scale, 1));\n  font-weight: 400;\n  color: var(--zns-theme-text-muted, #96939e);\n  line-height: 1.3;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.vault__row-chevron[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  color: var(--zns-theme-text-muted, #96939e);\n  transition: transform 0.15s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.vault__row[_ngcontent-%COMP%]:hover   .vault__row-chevron[_ngcontent-%COMP%] {\n  transform: translateX(calc(2px * var(--zns-space-scale, 1)));\n  color: var(--zns-theme-text, #181818);\n}\n.vault__empty[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: calc(48px * var(--zns-space-scale, 1)) calc(24px * var(--zns-space-scale, 1));\n  color: var(--zns-theme-text-muted, #96939e);\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: calc(12px * var(--zns-space-scale, 1));\n}\n.vault__empty[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: calc(14px * var(--zns-font-scale, 1));\n}\n\n@keyframes _ngcontent-%COMP%_spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvemVsZi1rZXlzL3plbGYta2V5cy12YXVsdC96ZWxmLWtleXMtdmF1bHQuY29tcG9uZW50LnNjc3MiLCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL192YXJpYWJsZXMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNJLFdBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSwyQ0FBQTtFQUNBLFlBQUE7RUFDQSxhQUFBLEVBQUEsd0RBQUE7RUFFQSw4RkFBQTtFQWtEQSwwRUFBQTtBQW5ESjtBQUVJO0VBQ0ksY0FBQTtBQUFSO0FBR0k7RUFDSSxrQkFBQTtFQUNBLHNGQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSwyQ0FBQTtBQURSO0FBR1E7RUFDSSwyQ0NRSztBRFRqQjtBQUlRO0VBQ0ksc0NDbkJKO0FEaUJSO0FBTUk7RUFDSSw2Q0FBQTtFQUNBLDhDQUFBO0VBQ0Esa0RBQUE7RUFDQSx1REFBQTtFQUNBLGtCQUFBO0VBQ0Esa0NBQUE7QUFKUjtBQU9JO0VBQ0ksdUVDbEJVO0VEbUJWLGdEQUFBO0VBQ0EsU0FBQTtFQUNBLCtDQ1phO0FET3JCO0FBUUk7RUFDSSxZQUFBO0FBTlI7QUFTSTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtFQUNBLDJDQUFBO0VBQ0EsY0FBQTtFQUNBLGFBQUE7QUFQUjtBQVdJO0VBQ0ksY0FBQTtFQUNBLGFBQUE7RUFDQSxjQUFBO0FBVFI7QUFZSTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLDBDQUFBO0FBVlI7QUFhSTtFQUNJLE9BQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLDBDQUFBO0VBQ0Esc0ZBQUE7RUFDQSxZQUFBO0VBQ0EscURBQUE7RUFDQSx1RUMxRFU7RUQyRFYsZ0RBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSwyR0FDSTtFQUVKLDRDQ25ETTtFRG9ETiw0Q0NuRFU7QURzQ2xCO0FBZVE7RUFDSSwyQkFBQTtFQUNBLHlDQUFBO0FBYlo7QUFnQlE7RUFDSSxzQkFBQTtBQWRaO0FBaUJRO0VBQ0ksc0RDNURXO0VENkRYLHNEQzVEZTtBRDZDM0I7QUFtQkk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLDZDQUFBO0VBQ0EsOENBQUE7RUFDQSxZQUFBO0VBQ0EscURBQUE7RUFDQSxzREN6RWU7RUQwRWYsc0RDekVtQjtFRDBFbkIsZUFBQTtFQUNBLGNBQUE7RUFDQSwyREFBQTtBQWpCUjtBQW1CUTtFQUNJLDREQzlFZ0I7QUQ2RDVCO0FBcUJJO0VBQ0ksa0JBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7QUFuQlI7QUFzQkk7RUFDSSxrQkFBQTtFQUNBLDRDQUFBO0VBQ0EsMkNDdkdTO0VEd0dULG9CQUFBO0FBcEJSO0FBdUJJO0VBQ0ksV0FBQTtFQUNBLG9LQUFBO0VBQ0EsNkJBQUE7RUFDQSwwUEFDSTtFQUVKLHFEQUFBO0VBQ0EsdUVDM0hVO0VENEhWLGdEQUFBO0VBQ0EscUNDdEhJO0VEdUhKLGFBQUE7RUFDQSwyREFBQTtBQXZCUjtBQXlCUTtFQUNJLDJDQzFISztBRG1HakI7QUEwQlE7RUFDSSx5Q0FBQTtBQXhCWjtBQTRCSTtFQUNJLDZCQUFBO0VBQ0EsME5BQ0k7RUFFSixxREFBQTtFQUNBLGdCQUFBO0FBNUJSO0FBK0JJO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsMkNBQUE7RUFDQSxzRkFBQTtFQUNBLGVBQUE7RUFDQSw0REFBQTtFQUNBLDhEQUFBO0FBN0JSO0FBK0JRO0VBQ0ksbUJBQUE7QUE3Qlo7QUFnQ1E7RUFDSSwwREM1SmU7QUQ4SDNCO0FBaUNRO0VBQ0ksNENDL0lFO0FEZ0hkO0FBbUNJO0VBQ0ksNkNBQUE7RUFDQSw4Q0FBQTtFQUNBLHFEQUFBO0VBQ0EsMERDeEttQjtFRHlLbkIsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxjQUFBO0VBQ0EsK0NDekthO0FEd0lyQjtBQW1DUTtFQUNJLDBDQzNNSztFRDRNTCxtQkMzTVU7QUQwS3RCO0FBcUNJO0VBQ0ksT0FBQTtFQUNBLFlBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSwwQ0FBQTtBQW5DUjtBQXNDSTtFQUNJLHVFQ25NVTtFRG9NVixnREFBQTtFQUNBLGdCQUFBO0VBQ0EscUNDL0xJO0VEZ01KLGdCQUFBO0VBQ0EsZ0JBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0FBcENSO0FBdUNJO0VBQ0ksdUVDOU1VO0VEK01WLGdEQUFBO0VBQ0EsZ0JBQUE7RUFDQSwyQ0N6TVM7RUQwTVQsZ0JBQUE7RUFDQSxnQkFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7QUFyQ1I7QUF3Q0k7RUFDSSxjQUFBO0VBQ0EsMkNDbE5TO0VEbU5ULDJEQUFBO0FBdENSO0FBd0NRO0VBQ0ksNERBQUE7RUFDQSxxQ0N4TkE7QURrTFo7QUEwQ0k7RUFDSSxrQkFBQTtFQUNBLHNGQUFBO0VBQ0EsMkNDOU5TO0VEK05ULGFBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0VBQ0EsMkNBQUE7QUF4Q1I7QUEwQ1E7RUFDSSxTQUFBO0VBQ0EsdUVDOU9NO0VEK09OLGdEQUFBO0FBeENaOztBQTZDQTtFQUNJO0lBQ0ksdUJBQUE7RUExQ047RUE0Q0U7SUFDSSx5QkFBQTtFQTFDTjtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcIi4uLy4uLy4uL3N0eWxlcy92YXJpYWJsZXNcIjtcblxuLnZhdWx0IHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgZ2FwOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgbWluLWhlaWdodDogMDsgICAgICAgICAgLyogYWxsb3cgcHJvcGVyIGZsZXggKyBzY3JvbGxpbmcgaW5zaWRlIHRoZSBwaG9uZSBjYXJkICovXG5cbiAgICAvKiBXaGVuIHJlbmRlcmVkIGluc2lkZSB0aGUgbmV3IGh1YiBzaGVsbCAoZGFzaGJvYXJkICsgdGFsbCBjYXJkKSwgdGFrZSBhbGwgYXZhaWxhYmxlIGhlaWdodCAqL1xuICAgIC5kYXNoYm9hcmQgJiB7XG4gICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgIH1cblxuICAgICZfX3N0YXRlIHtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDQ4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBjYWxjKDI0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcblxuICAgICAgICAmLS1sb2FkaW5nIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgJi0tZXJyb3Ige1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19zcGlubmVyIHtcbiAgICAgICAgd2lkdGg6IGNhbGMoMzZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBoZWlnaHQ6IGNhbGMoMzZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBib3JkZXI6IDNweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyO1xuICAgICAgICBib3JkZXItdG9wOiAzcHggc29saWQgdmFyaWFibGVzLiRwcmltYXJ5Q29sb3I7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgYW5pbWF0aW9uOiBzcGluIDFzIGxpbmVhciBpbmZpbml0ZTtcbiAgICB9XG5cbiAgICAmX19zdGF0ZS10ZXh0IHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgIH1cblxuICAgICZfX3N0YXRlLWljb24ge1xuICAgICAgICBvcGFjaXR5OiAwLjc7XG4gICAgfVxuXG4gICAgJl9fY29udGVudCB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogY2FsYygxNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgICAgICBtaW4taGVpZ2h0OiAwO1xuICAgIH1cblxuICAgIC8qIE1ha2UgdGhlIGFjdHVhbCBsaXN0IHRoZSB0YWxsIHNjcm9sbGFibGUgcmVnaW9uIGluc2lkZSB0aGUgcGhvbmUgY2FyZCAqL1xuICAgICZfX2xpc3Qge1xuICAgICAgICBmbGV4OiAxIDEgYXV0bztcbiAgICAgICAgbWluLWhlaWdodDogMDtcbiAgICAgICAgb3ZlcmZsb3c6IGF1dG87XG4gICAgfVxuXG4gICAgJl9fYWN0aW9ucyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19hZGQtYnRuIHtcbiAgICAgICAgZmxleDogMTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogY2FsYyg2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgcGFkZGluZzogY2FsYygxMHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSkgY2FsYygxNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEzcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICB0cmFuc2Zvcm0gMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJveC1zaGFkb3cgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbjtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0O1xuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xcHgpO1xuICAgICAgICAgICAgYm94LXNoYWRvdzogMCAycHggOHB4IHJnYmEoMCwgMCwgMCwgMC4wOCk7XG4gICAgICAgIH1cblxuICAgICAgICAmOmFjdGl2ZSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTcpO1xuICAgICAgICB9XG5cbiAgICAgICAgJi0tc2Vjb25kYXJ5IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnk7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeVRleHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19pY29uLWJ0biB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICB3aWR0aDogY2FsYyg0MHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGhlaWdodDogY2FsYyg0MHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnk7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICBmbGV4LXNocmluazogMDtcbiAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZCAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fc2VhcmNoIHtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIH1cblxuICAgICZfX3NlYXJjaC1pY29uIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICBsZWZ0OiBjYWxjKDE0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgIH1cblxuICAgICZfX3NlYXJjaC1pbnB1dCB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDEwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBjYWxjKDE0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBjYWxjKDEwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBjYWxjKDM4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdHJhbnNwYXJlbnQ7XG4gICAgICAgIGJhY2tncm91bmQ6XG4gICAgICAgICAgICBsaW5lYXItZ3JhZGllbnQodmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnksIHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5KSBwYWRkaW5nLWJveCxcbiAgICAgICAgICAgIGxpbmVhci1ncmFkaWVudCgxMzVkZWcsIHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlciwgdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXIpIGJvcmRlci1ib3g7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IGNhbGMoMTRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICB0cmFuc2l0aW9uOiBib3gtc2hhZG93IDAuMnMgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjo6cGxhY2Vob2xkZXIge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICAmOmZvY3VzIHtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMCAwIDJweCByZ2JhKDAsIDAsIDAsIDAuMDYpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fbGlzdCB7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICAgICAgICBiYWNrZ3JvdW5kOlxuICAgICAgICAgICAgbGluZWFyLWdyYWRpZW50KHZhcmlhYmxlcy4kdGhlbWVDYXJkLCB2YXJpYWJsZXMuJHRoZW1lQ2FyZCkgcGFkZGluZy1ib3gsXG4gICAgICAgICAgICBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXIsIHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyKSBib3JkZXItYm94O1xuICAgICAgICBib3JkZXItcmFkaXVzOiBjYWxjKDIwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICB9XG5cbiAgICAmX19yb3cge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IGNhbGMoMTRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kIDAuMTVzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG5cbiAgICAgICAgJjpsYXN0LWNoaWxkIHtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b206IG5vbmU7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgJjphY3RpdmUge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3Jvdy1pY29uIHtcbiAgICAgICAgd2lkdGg6IGNhbGMoNDBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBoZWlnaHQ6IGNhbGMoNDBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBmbGV4LXNocmluazogMDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuXG4gICAgICAgICYtLWNhcmQge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3I7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHNlY29uZGFyeUNvbG9yTGlnaHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19yb3ctaW5mbyB7XG4gICAgICAgIGZsZXg6IDE7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiBjYWxjKDJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX3Jvdy10aXRsZSB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDE1cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjM7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgIH1cblxuICAgICZfX3Jvdy1zdWJ0aXRsZSB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEzcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LXdlaWdodDogNDAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDEuMztcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgfVxuXG4gICAgJl9fcm93LWNoZXZyb24ge1xuICAgICAgICBmbGV4LXNocmluazogMDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjE1cyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAudmF1bHRfX3Jvdzpob3ZlciAmIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWChjYWxjKDJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpKTtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2VtcHR5IHtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDQ4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBjYWxjKDI0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG5cbiAgICAgICAgcCB7XG4gICAgICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgICAgICBmb250LXNpemU6IGNhbGMoMTRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBrZXlmcmFtZXMgc3BpbiB7XG4gICAgMCUge1xuICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcbiAgICB9XG4gICAgMTAwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG4gICAgfVxufVxuIiwiJHByaW1hcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXByaW1hcnksICMxODE4MTgpO1xuJHByaW1hcnlMaWdodDogI2RhZGRmYTtcbiRzZWNvbmRhcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXNlY29uZGFyeSwgI2ZmNTcyMSk7XG4kc2Vjb25kYXJ5Q29sb3JMaWdodDogI2Y2ZTVlMDtcblxuJGNvcnJlY3Q6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLCAjMWVhNDQ2KTtcbiRjb3JyZWN0RGFyazogIzBmNTIyMztcbiRjb3JyZWN0TGlnaHQ6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLXRleHQsICNlN2Y4ZWQpO1xuXG4kZXJyb3I6IHZhcigtLXpucy10aGVtZS1lcnJvciwgI2RjMzYyZSk7XG4kZXJyb3JEYXJrOiAjNjAxNDEwO1xuJGVycm9yTGlnaHQ6IHZhcigtLXpucy10aGVtZS1lcnJvci10ZXh0LCAjZmNlZWVlKTtcblxuJHdhcm5pbmc6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLCAjZGU2ODAwKTtcbiR3YXJuaW5nRGFyazogIzRhMjEwYTtcbiR3YXJuaW5nTGlnaHQ6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLXRleHQsICNmZmVlZTkpO1xuXG4kaW5mbzogIzM5OThkMztcbiRpbmZvRGFyazogIzAwNGE3NztcbiRpbmZvTGlnaHQ6ICNlY2YzZmU7XG5cbiRibGFjazogIzE4MTgxODtcbiR3aGl0ZTogI2ZmZmZmZjtcblxuJHRoZW1lQm9keUZhbWlseTogdmFyKC0tem5zLXRoZW1lLWJvZHktZmFtaWx5LCBcIlBvcHBpbnNcIiwgQXJpYWwsIHNhbnMtc2VyaWYpO1xuJHRoZW1lVGl0bGVGYW1pbHk6IHZhcigtLXpucy10aGVtZS10aXRsZS1mYW1pbHksIFwiTWVuZGFcIiwgXCJBcmlhbCBCbGFja1wiLCBzYW5zLXNlcmlmKTtcbiR0aGVtZU1vbm9zcGFjZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLW1vbm9zcGFjZS1mYW1pbHksIFwiQ291cmllciBOZXdcIiwgQ291cmllciwgbW9ub3NwYWNlKTtcblxuJHRoZW1lQmFja2dyb3VuZDogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQsICNmZmZmZmYpO1xuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQtc2Vjb25kYXJ5LCAjZjlmOWZjKTtcblxuJHRoZW1lVGV4dDogdmFyKC0tem5zLXRoZW1lLXRleHQsICMxODE4MTgpO1xuJHRoZW1lVGV4dE11dGVkOiB2YXIoLS16bnMtdGhlbWUtdGV4dC1tdXRlZCwgIzk2OTM5ZSk7XG4kdGhlbWVUZXh0U2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtdGV4dC1zZWNvbmRhcnksICM3Mzc3N2YpO1xuXG4kdGhlbWVIZWFkZXI6IHZhcigtLXpucy10aGVtZS1oZWFkZXIsICMxODE4MTgpO1xuJHRoZW1lSGVhZGVyVGV4dDogdmFyKC0tem5zLXRoZW1lLWhlYWRlci10ZXh0LCAjZmZmZmZmKTtcblxuJHRoZW1lQnV0dG9uOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLCAjMTgxODE4KTtcbiR0aGVtZUJ1dHRvblRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tdGV4dCwgI2ZmZmZmZik7XG4kdGhlbWVCdXR0b25Ib3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1ob3ZlciwgI2ZmNTcyMSk7XG5cbiR0aGVtZUJ1dHRvblNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnksICNlOWVjZWYpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktdGV4dCwgIzQ5NTA1Nyk7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktaG92ZXIsICNlOWVjZWYpO1xuXG4kdGhlbWVCb3JkZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXIsICNlM2UzZTMpO1xuJHRoZW1lQm9yZGVySG92ZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXItaG92ZXIsICNjM2M2Y2YpO1xuXG4kdGhlbWVDYXJkOiB2YXIoLS16bnMtdGhlbWUtY2FyZCwgI2ZmZmZmZik7XG4kdGhlbWVDYXJkQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtY2FyZC1ib3JkZXIsICNlZWVkZjEpO1xuXG4kdGhlbWVTaGFkb3c6IHZhcigtLXpucy10aGVtZS1zaGFkb3csIHJnYmEoMCwgMCwgMCwgMC4xKSk7XG5cbiRzbW9vdGhCZXppZXI6IGN1YmljLWJlemllcigwLjI1LCAwLjQsIDAuNywgMSk7XG5cbiRtYXhFeHRyYVNtYWxsOiA1OTVweDtcbiRtaW5TbWFsbDogNjAwcHg7XG4kbWVkaXVtOiA3NjhweDtcbiRsYXJnZTogODg5cHg7XG4kY29tcHV0ZXJzOiAxMjAwcHg7XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ },

/***/ 91817
/*!*******************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/operators/distinctUntilChanged.js ***!
  \*******************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   distinctUntilChanged: () => (/* binding */ distinctUntilChanged)
/* harmony export */ });
/* harmony import */ var _util_identity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/identity */ 1440);
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/lift */ 50819);
/* harmony import */ var _OperatorSubscriber__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./OperatorSubscriber */ 91687);



function distinctUntilChanged(comparator, keySelector = _util_identity__WEBPACK_IMPORTED_MODULE_0__.identity) {
  comparator = comparator !== null && comparator !== void 0 ? comparator : defaultCompare;
  return (0,_util_lift__WEBPACK_IMPORTED_MODULE_1__.operate)((source, subscriber) => {
    let previousKey;
    let first = true;
    source.subscribe((0,_OperatorSubscriber__WEBPACK_IMPORTED_MODULE_2__.createOperatorSubscriber)(subscriber, value => {
      const currentKey = keySelector(value);
      if (first || !comparator(previousKey, currentKey)) {
        first = false;
        previousKey = currentKey;
        subscriber.next(value);
      }
    }));
  });
}
function defaultCompare(a, b) {
  return a === b;
}

/***/ }

}]);
//# sourceMappingURL=src_app_zelf-keys_zelf-keys-vault_zelf-keys-vault_component_ts.js.map