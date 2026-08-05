"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_send-transaction_send-transaction_component_ts"],{

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

/***/ 15132
/*!****************************************************************!*\
  !*** ./src/app/send-transaction/send-transaction.component.ts ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SendTransactionComponent: () => (/* binding */ SendTransactionComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 52575);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 33900);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/core */ 86362);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/progress-spinner */ 41134);
/* harmony import */ var _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/slide-toggle */ 8827);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 34487);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var app_core_utils_same_wallet_address_util__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! app/core/utils/same-wallet-address.util */ 40693);
/* harmony import */ var app_pipes_address_mask_pipe__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! app/pipes/address-mask.pipe */ 29011);
/* harmony import */ var app_zelf_loader_zelf_loader_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! app/zelf-loader/zelf-loader.component */ 40152);
/* harmony import */ var app_tags_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! app/tags.service */ 73768);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var app_asset_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! app/asset.service */ 25931);
/* harmony import */ var app_services_bitcoin_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! app/services/bitcoin.service */ 28808);
/* harmony import */ var app_services_blockdag_service__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! app/services/blockdag.service */ 29205);
/* harmony import */ var app_eth_service__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! app/eth.service */ 97348);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/material/snack-bar */ 3347);
/* harmony import */ var app_solana_service__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! app/solana.service */ 98010);
/* harmony import */ var app_services_stellar_service__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! app/services/stellar.service */ 70431);
/* harmony import */ var app_services_substrate_relay_service__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! app/services/substrate-relay.service */ 70657);
/* harmony import */ var app_services_sui_service__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! app/services/sui.service */ 12009);
/* harmony import */ var app_transaction_service__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! app/transaction.service */ 65443);
/* harmony import */ var app_vault_service__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! app/vault.service */ 19519);
/* harmony import */ var app_wallet_service__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! app/wallet.service */ 69556);
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! @angular/material/core */ 74157);



































const _c0 = a0 => ({
  symbol: a0
});
const _c1 = a0 => ({
  "zelf-input--error": a0
});
const _c2 = (a0, a1) => ({
  symbol: a0,
  balance: a1
});
const _c3 = a0 => ({
  amount: a0
});
const _c4 = a0 => ({
  days: a0
});
function SendTransactionComponent_div_0_ng_container_1_button_28_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "button", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("click", function SendTransactionComponent_div_0_ng_container_1_button_28_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r1.pasteAddress());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipe"](2, "uppercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("disabled", ctx_r1.searching);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipeBind1"](2, 2, t_r4("common.paste")), " ");
  }
}
function SendTransactionComponent_div_0_ng_container_1_div_29_ng_container_1_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainer"](0);
  }
}
function SendTransactionComponent_div_0_ng_container_1_div_29_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](1, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](2, SendTransactionComponent_div_0_ng_container_1_div_29_ng_container_1_ng_container_2_Template, 1, 0, "ng-container", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
    const cross_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵreference"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngTemplateOutlet", cross_r5);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate"](t_r4("errors.required_field"));
  }
}
function SendTransactionComponent_div_0_ng_container_1_div_29_ng_container_2_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainer"](0);
  }
}
function SendTransactionComponent_div_0_ng_container_1_div_29_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](1, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](2, SendTransactionComponent_div_0_ng_container_1_div_29_ng_container_2_ng_container_2_Template, 1, 0, "ng-container", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
    const cross_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵreference"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngTemplateOutlet", cross_r5);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate"](t_r4("errors.same_address"));
  }
}
function SendTransactionComponent_div_0_ng_container_1_div_29_ng_container_3_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainer"](0);
  }
}
function SendTransactionComponent_div_0_ng_container_1_div_29_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](1, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](2, SendTransactionComponent_div_0_ng_container_1_div_29_ng_container_3_ng_container_2_Template, 1, 0, "ng-container", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
    const cross_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵreference"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngTemplateOutlet", cross_r5);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate"](t_r4("errors.address_too_long"));
  }
}
function SendTransactionComponent_div_0_ng_container_1_div_29_ng_container_4_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainer"](0);
  }
}
function SendTransactionComponent_div_0_ng_container_1_div_29_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](1, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](2, SendTransactionComponent_div_0_ng_container_1_div_29_ng_container_4_ng_container_2_Template, 1, 0, "ng-container", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
    const cross_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵreference"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngTemplateOutlet", cross_r5);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate"](t_r4("errors.invalid_format"));
  }
}
function SendTransactionComponent_div_0_ng_container_1_div_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](1, SendTransactionComponent_div_0_ng_container_1_div_29_ng_container_1_Template, 5, 2, "ng-container", 3)(2, SendTransactionComponent_div_0_ng_container_1_div_29_ng_container_2_Template, 5, 2, "ng-container", 3)(3, SendTransactionComponent_div_0_ng_container_1_div_29_ng_container_3_Template, 5, 2, "ng-container", 3)(4, SendTransactionComponent_div_0_ng_container_1_div_29_ng_container_4_Template, 5, 2, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", (tmp_5_0 = ctx_r1.form.get("toAddress")) == null ? null : tmp_5_0.errors == null ? null : tmp_5_0.errors.required);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", (tmp_6_0 = ctx_r1.form.get("toAddress")) == null ? null : tmp_6_0.errors == null ? null : tmp_6_0.errors.sameAddress);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", (tmp_7_0 = ctx_r1.form.get("toAddress")) == null ? null : tmp_7_0.errors == null ? null : tmp_7_0.errors.maxLength);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", (tmp_8_0 = ctx_r1.form.get("toAddress")) == null ? null : tmp_8_0.errors == null ? null : tmp_8_0.errors.invalidFormat);
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_30_div_12_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "span", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](4).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", t_r4("send.amount_inline_invalid"), " ");
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_30_div_12_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "span", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    let tmp_7_0;
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](4).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", t_r4("send.amount_inline_max", _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpureFunction1"](1, _c3, ctx_r1.formatAmountForInlineError((tmp_7_0 = ctx_r1.form.get("amount")) == null ? null : tmp_7_0.errors == null ? null : tmp_7_0.errors.lessThan == null ? null : tmp_7_0.errors.lessThan.value))), " ");
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_30_div_12_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "span", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](4).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", t_r4("send.amount_inline_min", _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpureFunction1"](1, _c3, ctx_r1.dustMinAmountDisplay())), " ");
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_30_div_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](1, SendTransactionComponent_div_0_ng_container_1_ng_container_30_div_12_span_1_Template, 2, 1, "span", 40)(2, SendTransactionComponent_div_0_ng_container_1_ng_container_30_div_12_span_2_Template, 2, 3, "span", 40)(3, SendTransactionComponent_div_0_ng_container_1_ng_container_30_div_12_span_3_Template, 2, 3, "span", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", (tmp_6_0 = ctx_r1.form.get("amount")) == null ? null : tmp_6_0.errors == null ? null : tmp_6_0.errors.invalidNumber);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", (tmp_7_0 = ctx_r1.form.get("amount")) == null ? null : tmp_7_0.errors == null ? null : tmp_7_0.errors.lessThan);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", (tmp_8_0 = ctx_r1.form.get("amount")) == null ? null : tmp_8_0.errors == null ? null : tmp_8_0.errors.dustTooSmall);
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_30_ng_container_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](1, "p", 20)(2, "span", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](4, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](5, "input", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"]("", t_r4("send.memo_optional"), ":");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("placeholder", t_r4("send.memo_placeholder"));
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](1, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](3, "div", 32)(4, "input", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("input", function SendTransactionComponent_div_0_ng_container_1_ng_container_30_Template_input_input_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r1.onAmountInput($event));
    })("blur", function SendTransactionComponent_div_0_ng_container_1_ng_container_30_Template_input_blur_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r1.onAmountBlur());
    })("keydown", function SendTransactionComponent_div_0_ng_container_1_ng_container_30_Template_input_keydown_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r1.onAmountKeydown($event));
    })("paste", function SendTransactionComponent_div_0_ng_container_1_ng_container_30_Template_input_paste_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r1.onAmountPaste($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](5, "button", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("click", function SendTransactionComponent_div_0_ng_container_1_ng_container_30_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r1.withdrawAll());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipe"](7, "uppercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](8, "div", 35)(9, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipe"](11, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](12, SendTransactionComponent_div_0_ng_container_1_ng_container_30_div_12_Template, 4, 3, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](13, "p", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](15, SendTransactionComponent_div_0_ng_container_1_ng_container_30_ng_container_15_Template, 6, 2, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"]("", t_r4("send.withdrawal_amount"), ":");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpureFunction1"](15, _c1, ctx_r1.showAmountFieldErrorState));
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("placeholder", t_r4("send.enter_amount_to_send"));
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipeBind1"](7, 8, t_r4("common.all")), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"]("~", _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipeBind4"](11, 10, ctx_r1.fiatPrice, "USD", "symbol", "1.2"));
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx_r1.showAmountFieldErrorState);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", t_r4("send.available_balance", _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpureFunction2"](17, _c2, ctx_r1.transactionData.symbol, ctx_r1.displaySendableBalance)), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx_r1.transactionData.isXlmToken);
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_31_div_6_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const address_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate"](address_r8.tagName.slice(0, 2).toUpperCase());
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_31_div_6__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "svg", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](1, "path", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_31_div_6_span_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "span", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const address_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate2"](" ", address_r8.tagName, "", address_r8.domain ? "." + address_r8.domain : "", " ");
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_31_div_6_span_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "span", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipe"](2, "addressMask");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const address_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipeBind1"](2, 1, address_r8.address), " ");
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_31_div_6_span_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "span", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipe"](2, "addressMask");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const address_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipeBind1"](2, 1, address_r8.address), " ");
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_31_div_6__svg_svg_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "svg", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](1, "path", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_31_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("click", function SendTransactionComponent_div_0_ng_container_1_ng_container_31_div_6_Template_div_click_0_listener() {
      const address_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r7).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r1.selectRecentAddress(address_r8));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](1, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](2, SendTransactionComponent_div_0_ng_container_1_ng_container_31_div_6_span_2_Template, 2, 1, "span", 3)(3, SendTransactionComponent_div_0_ng_container_1_ng_container_31_div_6__svg_svg_3_Template, 2, 0, "svg", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](4, "div", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](5, SendTransactionComponent_div_0_ng_container_1_ng_container_31_div_6_span_5_Template, 2, 2, "span", 53)(6, SendTransactionComponent_div_0_ng_container_1_ng_container_31_div_6_span_6_Template, 3, 3, "span", 53)(7, SendTransactionComponent_div_0_ng_container_1_ng_container_31_div_6_span_7_Template, 3, 3, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](8, "span", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](10, SendTransactionComponent_div_0_ng_container_1_ng_container_31_div_6__svg_svg_10_Template, 2, 0, "svg", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    let tmp_7_0;
    let tmp_15_0;
    const address_r8 = ctx.$implicit;
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](3).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵclassProp"]("send-transaction__recent-card--selected", address_r8.address === ((tmp_7_0 = ctx_r1.form.get("toAddress")) == null ? null : tmp_7_0.value));
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("matRippleColor", "rgba(0, 0, 0, 0.1)");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", address_r8.tagName);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", !address_r8.tagName);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", address_r8.tagName);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", !address_r8.tagName);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", address_r8.tagName);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", t_r4("send.used", _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpureFunction1"](10, _c4, ctx_r1.getTimeDiff(address_r8.lastUsed))), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", address_r8.address === ((tmp_15_0 = ctx_r1.form.get("toAddress")) == null ? null : tmp_15_0.value));
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](1, "div", 44)(2, "p", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](3, "svg", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](4, "path", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](6, SendTransactionComponent_div_0_ng_container_1_ng_container_31_div_6_Template, 11, 12, "div", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", t_r4("send.recent_addresses"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngForOf", ctx_r1.filteredAddresses);
  }
}
function SendTransactionComponent_div_0_ng_container_1_zelf_loader_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](0, "zelf-loader");
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_1_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](4).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate"](t_r4("send.address_found"));
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_1_span_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](4).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate"](t_r4("send.external_address_found"));
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_1_span_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipe"](2, "addressMask");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipeBind1"](2, 1, ctx_r1.foundAddress.publicData.ethAddress));
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_1_span_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipe"](2, "addressMask");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipeBind1"](2, 1, ctx_r1.foundAddress.publicData.solanaAddress));
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_1_span_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipe"](2, "addressMask");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipeBind1"](2, 1, ctx_r1.foundAddress.publicData.btcAddress));
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_1_span_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipe"](2, "addressMask");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipeBind1"](2, 1, ctx_r1.foundAddress.publicData.suiAddress));
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_1_span_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipe"](2, "addressMask");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipeBind1"](2, 1, ctx_r1.foundAddress.publicData.blockDAGAddress));
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_1_span_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipe"](2, "addressMask");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipeBind1"](2, 1, ctx_r1.foundAddress.publicData.xlmAddress));
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "div", 64)(1, "p", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](2, "svg", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](3, "path", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](4, SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_1_span_4_Template, 2, 1, "span", 3)(5, SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_1_span_5_Template, 2, 1, "span", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](6, "div", 68)(7, "div", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](9, "div", 70)(10, "span", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](12, SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_1_span_12_Template, 3, 3, "span", 72)(13, SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_1_span_13_Template, 3, 3, "span", 72)(14, SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_1_span_14_Template, 3, 3, "span", 72)(15, SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_1_span_15_Template, 3, 3, "span", 72)(16, SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_1_span_16_Template, 3, 3, "span", 72)(17, SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_1_span_17_Template, 3, 3, "span", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](18, "svg", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](19, "path", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx_r1.foundAddress.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", !ctx_r1.foundAddress.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", (ctx_r1.foundAddress.fullTagName || ctx_r1.foundAddress.name || "").slice(0, 2).toUpperCase(), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate"](ctx_r1.foundAddress.fullTagName);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx_r1.transactionData.isEthToken || ctx_r1.transactionData.isAvaxToken);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx_r1.transactionData.isSolToken);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx_r1.transactionData.isBtcToken);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx_r1.transactionData.isSuiToken);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx_r1.transactionData.isBDAGToken);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx_r1.transactionData.isXlmToken);
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "div", 64)(1, "div", 75)(2, "div", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](3, "svg", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](4, "path", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](5, "p", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](7, "hr", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](8, "p", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate"](t_r4("send.zelf_name_not_registered"));
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate"](t_r4("send.cannot_continue_process"));
  }
}
function SendTransactionComponent_div_0_ng_container_1_ng_container_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](1, SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_1_Template, 20, 10, "div", 63)(2, SendTransactionComponent_div_0_ng_container_1_ng_container_33_div_2_Template, 10, 2, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx_r1.foundAddress && !ctx_r1.isZelfNameNotFound && !ctx_r1.isFromRecentAddress);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx_r1.isZelfNameNotFound);
  }
}
function SendTransactionComponent_div_0_ng_container_1_button_35_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "button", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("click", function SendTransactionComponent_div_0_ng_container_1_button_35_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r9);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r1.continueToWithdraw());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("disabled", ctx_r1.isWithdrawDisabled());
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", t_r4("common.next"), " ");
  }
}
function SendTransactionComponent_div_0_ng_container_1_button_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "button", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("click", function SendTransactionComponent_div_0_ng_container_1_button_36_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r10);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r1.onWithdrawPrimaryClick());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵclassProp"]("send-transaction__withdraw-cta--blocked", ctx_r1.isConfirmationDisabled());
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵattribute"]("aria-disabled", ctx_r1.isConfirmationDisabled());
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", t_r4("common.withdraw"), " ");
  }
}
function SendTransactionComponent_div_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](1, "div", 4)(2, "div", 5)(3, "button", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("click", function SendTransactionComponent_div_0_ng_container_1_Template_button_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r1.goBack());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](4, "svg", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](5, "path", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](6, "div", 9)(7, "p", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](9, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](10, "form", 12)(11, "div", 13)(12, "p", 14)(13, "span", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](15, "input", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](16, "div", 17)(17, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipe"](19, "uppercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](20, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](21);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipe"](22, "addressMask");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](23, "p", 20)(24, "span", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtext"](25);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](26, "div", 21)(27, "input", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵlistener"]("paste", function SendTransactionComponent_div_0_ng_container_1_Template_input_paste_27_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r1.pastedAddress($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](28, SendTransactionComponent_div_0_ng_container_1_button_28_Template, 3, 4, "button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](29, SendTransactionComponent_div_0_ng_container_1_div_29_Template, 5, 4, "div", 24)(30, SendTransactionComponent_div_0_ng_container_1_ng_container_30_Template, 16, 20, "ng-container", 3)(31, SendTransactionComponent_div_0_ng_container_1_ng_container_31_Template, 7, 2, "ng-container", 3)(32, SendTransactionComponent_div_0_ng_container_1_zelf_loader_32_Template, 1, 0, "zelf-loader", 3)(33, SendTransactionComponent_div_0_ng_container_1_ng_container_33_Template, 3, 2, "ng-container", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](34, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](35, SendTransactionComponent_div_0_ng_container_1_button_35_Template, 2, 2, "button", 26)(36, SendTransactionComponent_div_0_ng_container_1_button_36_Template, 2, 4, "button", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    let tmp_9_0;
    let tmp_11_0;
    let tmp_15_0;
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate"](t_r4("common.send_symbol", _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpureFunction1"](22, _c0, ctx_r1.transactionData.symbol)));
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("formGroup", ctx_r1.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"]("", t_r4("common.from"), ":");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵattribute"]("aria-label", t_r4("send.from_address"));
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipeBind1"](19, 18, ctx_r1.transactionData.sender.fullTagName), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpipeBind1"](22, 20, (tmp_9_0 = ctx_r1.form.get("fromAddress")) == null ? null : tmp_9_0.value), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtextInterpolate1"]("", t_r4("common.to"), ":");
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵpureFunction1"](24, _c1, ((tmp_11_0 = ctx_r1.form.get("toAddress")) == null ? null : tmp_11_0.dirty) && ((tmp_11_0 = ctx_r1.form.get("toAddress")) == null ? null : tmp_11_0.invalid)));
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("placeholder", t_r4("send.domain_or_address"))("readonly", ctx_r1.withdrawStep);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", !ctx_r1.withdrawStep);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ((tmp_15_0 = ctx_r1.form.get("toAddress")) == null ? null : tmp_15_0.dirty) && ((tmp_15_0 = ctx_r1.form.get("toAddress")) == null ? null : tmp_15_0.errors));
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx_r1.withdrawStep);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", !ctx_r1.withdrawStep && ctx_r1.filteredAddresses.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx_r1.searching);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", !ctx_r1.withdrawStep);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", !ctx_r1.withdrawStep);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx_r1.withdrawStep);
  }
}
function SendTransactionComponent_div_0_zelf_loader_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](0, "zelf-loader");
  }
}
function SendTransactionComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](1, SendTransactionComponent_div_0_ng_container_1_Template, 37, 26, "ng-container", 3)(2, SendTransactionComponent_div_0_zelf_loader_2_Template, 1, 0, "zelf-loader", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", !ctx_r1.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵproperty"]("ngIf", ctx_r1.loading);
  }
}
function SendTransactionComponent_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementStart"](0, "svg", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelement"](1, "path", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵelementEnd"]();
  }
}
class SendTransactionComponent {
  _activatedRoute;
  _assetService;
  _bitcoinService;
  _blockDAGService;
  _changeDetectionRef;
  _ethService;
  _formBuilder;
  _router;
  _snackBar;
  _solanaService;
  _stellarService;
  _substrateRelayService;
  _suiService;
  _tagsService;
  _transactionService;
  _translocoService;
  _vaultService;
  _walletService;
  unsubscriber$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
  form;
  foundAddress;
  isFromRecentAddress = false;
  isZelfNameNotFound = false;
  loading = true;
  price = 0;
  recentAddresses = [];
  searching = false;
  transactionData;
  withdrawStep = false;
  constructor(_activatedRoute, _assetService, _bitcoinService, _blockDAGService, _changeDetectionRef, _ethService, _formBuilder, _router, _snackBar, _solanaService, _stellarService, _substrateRelayService, _suiService, _tagsService, _transactionService, _translocoService, _vaultService, _walletService) {
    this._activatedRoute = _activatedRoute;
    this._assetService = _assetService;
    this._bitcoinService = _bitcoinService;
    this._blockDAGService = _blockDAGService;
    this._changeDetectionRef = _changeDetectionRef;
    this._ethService = _ethService;
    this._formBuilder = _formBuilder;
    this._router = _router;
    this._snackBar = _snackBar;
    this._solanaService = _solanaService;
    this._stellarService = _stellarService;
    this._substrateRelayService = _substrateRelayService;
    this._suiService = _suiService;
    this._tagsService = _tagsService;
    this._transactionService = _transactionService;
    this._translocoService = _translocoService;
    this._vaultService = _vaultService;
    this._walletService = _walletService;
    this.loading = true;
  }
  ngOnInit() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this.transactionData = yield _this._transactionService.getCurrentTransactionData();
      if (_this.transactionData && _this.transactionData.hasTransactionData) {
        _this._initTransactionData().catch(() => _this.goBack()).finally(() => _this.loading = false);
        return;
      }
      _this._transactionService.transactionData$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.takeUntil)(_this.unsubscriber$)).subscribe(transactionData => {
        _this.transactionData = transactionData;
        if (!_this.transactionData || !_this.transactionData.hasTransactionData) {
          _this._router.navigate(["/send"]);
          return;
        }
        _this._initTransactionData().catch(() => _this.goBack()).finally(() => _this.loading = false);
      });
    })();
  }
  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
  get addressKey() {
    if (this.transactionData.isBscToken) return "ethAddress";
    if (this.transactionData.isBDAGToken) return "ethAddress";
    if (this.transactionData.isBtcToken) return "btcAddress";
    if (this.transactionData.isEthToken || this.transactionData.isAvaxToken) return "ethAddress";
    if (this.transactionData.isPolToken) return "ethAddress";
    if (this.transactionData.isSolToken) return "solanaAddress";
    if (this.transactionData.isSuiToken) return "suiAddress";
    if (this.transactionData.isXlmToken) return "xlmAddress";
    if (this.transactionData.isDotToken) return "dotAddress";
    if (this.transactionData.isKsmToken) return "ksmAddress";
    throw new Error("Network address key unavailable");
  }
  get fiatPrice() {
    const amount = this.form.get("amount")?.value || 0;
    const fiatPrice = this.price || 0;
    return amount * fiatPrice || 0;
  }
  /** Matches truncated max used for validation and "withdraw all". */
  get displaySendableBalance() {
    return this._getMaxSendableAmount();
  }
  /** Smallest amount we allow without treating as dust (matches ~8 leading fractional zeros). */
  static _MIN_SENDABLE_AMOUNT = 1e-8;
  /** Red border + inline row: only dust / max / bad number — not empty or zero. */
  get showAmountFieldErrorState() {
    const c = this.form?.get("amount");
    if (!c?.touched || !c.invalid) return false;
    const e = c.errors;
    return !!(e?.dustTooSmall || e?.lessThan || e?.invalidNumber);
  }
  /** Up to 8 decimal places for inline validation copy. */
  formatAmountForInlineError(value) {
    const n = parseFloat(String(value ?? ""));
    if (!Number.isFinite(n)) return String(value ?? "");
    const s = n.toFixed(8).replace(/\.?0+$/, "");
    return s || "0";
  }
  dustMinAmountDisplay() {
    return this.formatAmountForInlineError(this._getMinSendableAmount());
  }
  _getMinSendableAmount() {
    if (this.transactionData.isXlmToken) return 1e-7;
    if (this.transactionData.isDotToken || this.transactionData.isKsmToken) return 1e-8;
    return SendTransactionComponent._MIN_SENDABLE_AMOUNT;
  }
  onAmountBlur() {
    this.form.get("amount")?.markAsTouched();
  }
  onWithdrawPrimaryClick() {
    if (this.isConfirmationDisabled()) {
      this.form.get("amount")?.markAsTouched();
      return;
    }
    void this.continueToConfirmation();
  }
  get filteredAddresses() {
    const searchValue = this.form.get("toAddress")?.value;
    return this.recentAddresses.filter(address => {
      if (!searchValue || !searchValue.trim()) return true;
      return new RegExp(searchValue, "i").test(address.address) || address.tagName && new RegExp(searchValue, "i").test(address.tagName);
    });
  }
  /**
   * True when the candidate destination resolves to the same on-chain
   * address as the sender. Considers the resolved Zelf-name address (when
   * available) so users can't bypass the check by typing their own tag.
   */
  _isSameWalletAsSender(candidate) {
    const senderAddress = this.transactionData?.sender?.address;
    if (!senderAddress) return false;
    if (candidate && (0,app_core_utils_same_wallet_address_util__WEBPACK_IMPORTED_MODULE_12__.areSendAddressesSame)(senderAddress, candidate, this.transactionData)) return true;
    const resolved = this.foundAddress?.publicData?.[this.addressKey];
    if (resolved && (0,app_core_utils_same_wallet_address_util__WEBPACK_IMPORTED_MODULE_12__.areSendAddressesSame)(senderAddress, resolved, this.transactionData)) return true;
    return false;
  }
  /**
   * Keep the `sameAddress` error in sync after async resolutions
   * (e.g. Zelf-name lookups that populate `foundAddress`) without losing
   * other validator errors set on the same control.
   */
  _syncSameAddressControlError() {
    const ctrl = this.form?.get("toAddress");
    if (!ctrl) return;
    const isSame = this._isSameWalletAsSender(ctrl.value);
    const errors = {
      ...(ctrl.errors || {})
    };
    if (isSame) {
      errors["sameAddress"] = true;
    } else if ("sameAddress" in errors) {
      delete errors["sameAddress"];
    }
    const next = Object.keys(errors).length ? errors : null;
    ctrl.setErrors(next);
  }
  _addressValidator() {
    return control => {
      const value = control.value;
      if (!value) return null;
      if (this._isSameWalletAsSender(value)) return {
        sameAddress: true
      };
      const pattern = this._getAddressPattern();
      const isValidZelfName = this._walletService.TagRegex.test(value) || this._walletService.TagRegexNoPostfix.test(value);
      if (!pattern.test(value) && !isValidZelfName) return {
        invalidFormat: true
      };
      if (isValidZelfName) return null;
      if ((this.transactionData.isEthToken || this.transactionData.isAvaxToken || this.transactionData.isBDAGToken) && !this._walletService.isValidEVMAddress(value)) {
        return {
          invalidFormat: true
        };
      }
      if (this.transactionData.isSuiToken && !this._suiService.isValidSuiAddress(value)) {
        return {
          invalidFormat: true
        };
      }
      if (this.transactionData.isSolToken && !this._solanaService.isValidSolanaAddress(value)) {
        return {
          invalidFormat: true
        };
      }
      if (this.transactionData.isXlmToken && !this._stellarService.isValidStellarAddress(value)) {
        return {
          invalidFormat: true
        };
      }
      if (this.transactionData.isBtcToken && !this._bitcoinService.isValidBTCAddress(value)) {
        return {
          invalidBTC: true
        };
      }
      if (this.transactionData.isDotToken && !this._substrateRelayService.isValidAddress(value)) {
        return {
          invalidFormat: true
        };
      }
      if (this.transactionData.isKsmToken && !this._substrateRelayService.isValidAddress(value)) {
        return {
          invalidFormat: true
        };
      }
      return null;
    };
  }
  _amountValidation(maxValue) {
    const minSend = this._getMinSendableAmount();
    return control => {
      const raw = control.value;
      const str = raw === null || raw === undefined ? "" : String(raw).trim();
      if (str === "") return {
        noAmount: true
      };
      const value = +str.replace(/,/g, "");
      if (isNaN(value)) return {
        invalidNumber: true
      };
      if (value <= 0) return {
        noAmount: true
      };
      if (value < minSend) return {
        dustTooSmall: true
      };
      const cap = parseFloat(String(maxValue));
      if (!Number.isFinite(cap) || value > cap) return {
        lessThan: {
          value: maxValue
        }
      };
      return null;
    };
  }
  _getSendDecimals() {
    const raw = this.transactionData?.token?.decimals;
    const parsed = raw !== undefined && raw !== null ? Number(raw) : NaN;
    if (Number.isFinite(parsed) && parsed >= 0) return Math.min(36, Math.floor(parsed));
    if (this.transactionData.isSuiToken) return 9;
    if (this.transactionData.isSolToken) return 9;
    if (this.transactionData.isXlmToken) return 7;
    if (this.transactionData.isDotToken || this.transactionData.isKsmToken) return 10;
    if (this.transactionData.isBtcToken) return 8;
    if (this.transactionData.isEthToken || this.transactionData.isAvaxToken || this.transactionData.isPolToken || this.transactionData.isBscToken || this.transactionData.isBDAGToken) {
      return 18;
    }
    return 18;
  }
  /**
   * Balance truncated to token decimals (floor) so max validation, "withdraw all", and error copy stay aligned.
   */
  _getMaxSendableAmount() {
    const decimals = this._getSendDecimals();
    const raw = this.transactionData.balance;
    let s = String(raw ?? 0).replace(/,/g, "").trim();
    if (!s || /^nan$/i.test(s)) return "0";
    const negative = s.startsWith("-");
    if (negative) s = s.slice(1);
    if (/e/i.test(s)) {
      const n = Number((negative ? "-" : "") + s);
      if (!Number.isFinite(n) || n < 0) return "0";
      const factor = 10 ** decimals;
      const floored = Math.floor(n * factor + 1e-12) / factor;
      return this._trimAmountFraction(floored.toFixed(decimals));
    }
    const parts = s.split(".");
    const intDigits = (parts[0] || "").replace(/\D/g, "") || "0";
    const intPart = intDigits.replace(/^0+(?=\d)/, "") || "0";
    const fracDigits = (parts[1] || "").replace(/\D/g, "");
    const truncatedFrac = fracDigits.slice(0, decimals);
    const joined = truncatedFrac.length ? `${intPart}.${truncatedFrac}` : intPart;
    const signed = negative && joined !== "0" && parseFloat(joined) !== 0 ? `-${joined}` : joined;
    return this._trimAmountFraction(signed);
  }
  _trimAmountFraction(amount) {
    if (!amount.includes(".")) return amount;
    return amount.replace(/\.?0+$/, "") || "0";
  }
  _checkEVMAddress(text) {
    const isValidFormat = this._walletService.isValidEVMAddress(text);
    const isValidWeb3 = this._ethService.checkIfValidAddress(text.toLowerCase());
    return isValidFormat && isValidWeb3;
  }
  _fetchTokenPrice() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        if (_this2.transactionData.isBDAGToken) {
          _this2.price = yield _this2._blockDAGService.getCurrentPrice();
          return;
        }
        const response = yield _this2._assetService.fetchAssetPrice(_this2.transactionData.symbol);
        if (!response?.data || !response?.data?.length) return;
        _this2.price = response.data[0].open;
      } catch (error) {}
    })();
  }
  _getAddressPattern() {
    let pattern = /.*/;
    if (this.transactionData.isEthToken || this.transactionData.isAvaxToken || this.transactionData.isBDAGToken) pattern = this._walletService.ETHRegex;
    if (this.transactionData.isSolToken) pattern = this._walletService.SOLRegex;
    if (this.transactionData.isBtcToken) pattern = this._walletService.BTCRegex;
    if (this.transactionData.isSuiToken) pattern = this._walletService.SUIRegex;
    if (this.transactionData.isXlmToken) pattern = /^G[A-Z2-7]{54}$/;
    if (this.transactionData.isDotToken || this.transactionData.isKsmToken) pattern = /^[1-9A-HJ-NP-Za-km-z]{30,100}$/;
    return pattern;
  }
  _handlePaste(text) {
    if (!text) return;
    const toAddressCtrl = this.form.get("toAddress");
    if (!toAddressCtrl) return;
    toAddressCtrl.patchValue(text, {
      emitEvent: true,
      onlySelf: false
    });
    toAddressCtrl.markAsDirty();
    toAddressCtrl.updateValueAndValidity({
      emitEvent: true,
      onlySelf: false
    });
  }
  _handleToAddressChange(text) {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this3.searching || _this3.form.get("toAddress")?.invalid) return;
      _this3.isFromRecentAddress = false;
      if (!text || !text.trim()) {
        _this3.isZelfNameNotFound = false;
        _this3.foundAddress = undefined;
        return;
      }
      _this3.searching = true;
      _this3._syncToAddressControlDisabledState();
      _this3.isZelfNameNotFound = false;
      const isEVM = _this3.transactionData.isEthToken || _this3.transactionData.isAvaxToken || _this3.transactionData.isPolToken || _this3.transactionData.isBscToken || _this3.transactionData.isBDAGToken;
      try {
        const {
          name: tagName,
          domain
        } = _this3._tagsService.parseTagName(text);
        const finalDomain = domain || _this3.transactionData?.sender?.domain || "zelf";
        if (_this3._walletService.TagRegex.test(text) || _this3._walletService.TagRegexNoPostfix.test(text)) yield _this3._searchTag("tagName", tagName, finalDomain);
        if (!_this3.foundAddress) {
          if (_this3.transactionData.isSuiToken && _this3._suiService.isValidSuiAddress(text)) {
            yield _this3._searchTag("suiAddress", text);
            if (!_this3.foundAddress) _this3._setRawAddressToFoundAddress(text, "suiAddress");
          } else if (isEVM && _this3._checkEVMAddress(text)) {
            yield _this3._searchTag("ethAddress", text);
            if (!_this3.foundAddress) _this3._setRawAddressToFoundAddress(text, "ethAddress");
          } else if (_this3.transactionData.isSolToken && _this3._solanaService.isValidSolanaAddress(text)) {
            yield _this3._searchTag("solanaAddress", text);
            if (!_this3.foundAddress) _this3._setRawAddressToFoundAddress(text, "solanaAddress");
          } else if (_this3.transactionData.isXlmToken && _this3._stellarService.isValidStellarAddress(text)) {
            yield _this3._searchTag("xlmAddress", text);
            if (!_this3.foundAddress) _this3._setRawAddressToFoundAddress(text, "xlmAddress");
          } else if (_this3.transactionData.isBtcToken && _this3._bitcoinService.isValidBTCAddress(text)) {
            yield _this3._searchTag("btcAddress", text);
            if (!_this3.foundAddress) _this3._setRawAddressToFoundAddress(text, "btcAddress");
          } else if (_this3.transactionData.isDotToken && _this3._substrateRelayService.isValidAddress(text)) {
            yield _this3._searchTag("dotAddress", text);
            if (!_this3.foundAddress) _this3._setRawAddressToFoundAddress(text, "dotAddress");
          } else if (_this3.transactionData.isKsmToken && _this3._substrateRelayService.isValidAddress(text)) {
            yield _this3._searchTag("ksmAddress", text);
            if (!_this3.foundAddress) _this3._setRawAddressToFoundAddress(text, "ksmAddress");
          }
        }
        if (_this3.foundAddress) return;
        _this3.isZelfNameNotFound = true;
      } catch (error) {
        if (_this3.transactionData.isSuiToken && _this3._suiService.isValidSuiAddress(text)) {
          _this3._setRawAddressToFoundAddress(text, "suiAddress");
        } else if (isEVM && _this3._checkEVMAddress(text)) {
          _this3._setRawAddressToFoundAddress(text, "ethAddress");
        } else if (_this3.transactionData.isSolToken && _this3._solanaService.isValidSolanaAddress(text)) {
          _this3._setRawAddressToFoundAddress(text, "solanaAddress");
        } else if (_this3.transactionData.isXlmToken && _this3._stellarService.isValidStellarAddress(text)) {
          _this3._setRawAddressToFoundAddress(text, "xlmAddress");
        } else if (_this3.transactionData.isBtcToken && _this3._bitcoinService.isValidBTCAddress(text)) {
          _this3._setRawAddressToFoundAddress(text, "btcAddress");
        } else if (_this3.transactionData.isDotToken && _this3._substrateRelayService.isValidAddress(text)) {
          _this3._setRawAddressToFoundAddress(text, "dotAddress");
        } else if (_this3.transactionData.isKsmToken && _this3._substrateRelayService.isValidAddress(text)) {
          _this3._setRawAddressToFoundAddress(text, "ksmAddress");
        } else {
          _this3.isZelfNameNotFound = true;
          _this3.foundAddress = undefined;
        }
      } finally {
        _this3.searching = false;
        _this3._syncToAddressControlDisabledState();
        if (_this3.foundAddress) yield _this3._setToCurrentTransactionData();
        _this3._syncSameAddressControlError();
        _this3._changeDetectionRef.detectChanges();
      }
    })();
  }
  _initForm() {
    const maxSend = this._getMaxSendableAmount();
    const maxAddrLen = this.transactionData.isXlmToken ? 56 : this.transactionData.isDotToken || this.transactionData.isKsmToken ? 100 : 66;
    const controls = {
      amount: [this.transactionData?.amount || "", [this._amountValidation(maxSend)]],
      toAddress: [this.transactionData?.receiver?.address || "", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.maxLength(maxAddrLen), this._addressValidator()]],
      fromAddress: [this.transactionData?.sender?.address || ""]
    };
    if (this.transactionData.isXlmToken) {
      controls.memo = [this.transactionData.memo || "", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.maxLength(28)]];
    }
    this.form = this._formBuilder.group(controls);
    const toAddressCtrl = this.form?.get("toAddress");
    if (!toAddressCtrl) return;
    this._syncToAddressControlDisabledState();
    toAddressCtrl.valueChanges.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.takeUntil)(this.unsubscriber$), (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.debounceTime)(1000)).subscribe(value => {
      if (!value || !value.trim() || this.form.get("toAddress")?.invalid) {
        this.foundAddress = undefined;
        this.isZelfNameNotFound = false;
        this._setToCurrentTransactionData();
        return;
      }
      this._handleToAddressChange(value);
    });
    if (!toAddressCtrl.value || !toAddressCtrl.value.trim()) return;
    if (this.transactionData?.receiver?.address) {
      this._setRawAddressToFoundAddress(this.transactionData.receiver.address, this.addressKey);
      this.withdrawStep = true;
      this._syncToAddressControlDisabledState();
      return;
    }
    toAddressCtrl.updateValueAndValidity();
    this._syncToAddressControlDisabledState();
  }
  _syncToAddressControlDisabledState() {
    const ctrl = this.form?.get("toAddress");
    if (!ctrl) return;
    const shouldDisable = this.withdrawStep || this.searching;
    if (shouldDisable) {
      if (ctrl.enabled) ctrl.disable({
        emitEvent: false
      });
    } else if (ctrl.disabled) {
      ctrl.enable({
        emitEvent: false
      });
    }
  }
  _initTransactionData() {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this4.recentAddresses = _this4._transactionService.findAddressInRecentAddresses("network", _this4.transactionData.network);
      yield _this4._fetchTokenPrice();
      _this4._initForm();
    })();
  }
  _searchTag(_x, _x2) {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (key, value, domain = "zelf") {
      try {
        const response = yield _this5._tagsService.searchTag(key === "tagName" ? {
          tagName: value,
          domain,
          os: "DESKTOP"
        } : {
          key,
          value,
          domain,
          os: "DESKTOP"
        });
        if (!response.data) {
          _this5.foundAddress = undefined;
          return;
        }
        const foundAddress = new app_tags_service__WEBPACK_IMPORTED_MODULE_15__.TagModel(response.data.tagObject || (key !== "tagName" ? {
          publicData: {
            [_this5.addressKey]: value
          }
        } : {}));
        const zelfObjectContainsAddress = !!foundAddress.publicData[_this5.addressKey];
        _this5.foundAddress = zelfObjectContainsAddress ? foundAddress : undefined;
      } catch (error) {
        console.error("Error querying ZNS:", error);
        _this5.foundAddress = undefined;
      }
    }).apply(this, arguments);
  }
  _setRawAddressToFoundAddress(text, addressKey) {
    this.searching = false;
    this._syncToAddressControlDisabledState();
    this.isZelfNameNotFound = false;
    this.foundAddress = new app_tags_service__WEBPACK_IMPORTED_MODULE_15__.TagModel({
      publicData: {
        [addressKey]: text,
        tagName: this.transactionData?.receiver?.tagName?.replace(".hold", ""),
        domain: this.transactionData?.receiver?.domain
      }
    });
    if (this.withdrawStep) {
      this._syncSameAddressControlError();
      return;
    }
    const toAddressCtrl = this.form.get("toAddress");
    if (toAddressCtrl) toAddressCtrl.updateValueAndValidity({
      emitEvent: false
    });
    this._syncSameAddressControlError();
  }
  _setToCurrentTransactionData() {
    var _this6 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        if (_this6.withdrawStep) {
          const amount = Number(String(_this6.form.get("amount")?.value || "0").replace(",", "."));
          _this6.transactionData.amount = amount;
        }
        const memoCtrl = _this6.form.get("memo");
        if (memoCtrl) {
          _this6.transactionData.memo = memoCtrl.value && String(memoCtrl.value).trim() || undefined;
        }
        _this6.transactionData.receiver.address = _this6.foundAddress && _this6.foundAddress.publicData[_this6.addressKey] || "";
        _this6.transactionData.receiver.tagName = _this6.foundAddress?.tagName || "";
        _this6.transactionData.receiver.domain = _this6.foundAddress?.domain || "";
        yield _this6._transactionService.setCurrentTransactionData(_this6.transactionData);
      } catch (exception) {
        console.error("Error setting transaction data", exception);
        _this6.openErrorSnackBar("send-transaction.error-setting-transaction-data");
      }
    })();
  }
  continueToWithdraw() {
    var _this7 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const address = _this7.form.get("toAddress")?.value;
      if (_this7._isSameWalletAsSender(address)) {
        _this7._syncSameAddressControlError();
        _this7.openErrorSnackBar("errors.same_address");
        return;
      }
      const isEVM = _this7.transactionData.isEthToken || _this7.transactionData.isAvaxToken || _this7.transactionData.isPolToken || _this7.transactionData.isBscToken || _this7.transactionData.isBDAGToken;
      if (_this7.foundAddress) {
        const toAddressCtrl = _this7.form.get("toAddress");
        if (toAddressCtrl) {
          toAddressCtrl.setValue(_this7.foundAddress.publicData[_this7.addressKey] || "");
          toAddressCtrl.updateValueAndValidity({
            emitEvent: false
          });
        }
        yield _this7._setToCurrentTransactionData();
        _this7.withdrawStep = true;
        _this7._syncToAddressControlDisabledState();
        return;
      }
      if (_this7.transactionData.isSuiToken && _this7._suiService.isValidSuiAddress(address)) {
        _this7._setRawAddressToFoundAddress(address, "suiAddress");
      } else if (isEVM && _this7._checkEVMAddress(address)) {
        _this7._setRawAddressToFoundAddress(address, "ethAddress");
      } else if (_this7.transactionData.isSolToken && _this7._solanaService.isValidSolanaAddress(address)) {
        _this7._setRawAddressToFoundAddress(address, "solanaAddress");
      } else if (_this7.transactionData.isBtcToken && _this7._bitcoinService.isValidBTCAddress(address)) {
        _this7._setRawAddressToFoundAddress(address, "btcAddress");
        try {
          // Type assertion needed due to TypeScript control flow analysis
          const foundAddressWithBtc = _this7.foundAddress;
          const btcAddress = foundAddressWithBtc?.publicData?.btcAddress;
          if (btcAddress) {
            const btcBalance = yield _this7._bitcoinService.getBitcoinBalance(btcAddress);
            if (btcBalance.balance < parseFloat(_this7.form.get("amount")?.value || "0")) {
              _this7._snackBar.open(_this7._translocoService.translate("INSUFFICIENT_FUNDS"), _this7._translocoService.translate("CLOSE"), {
                duration: 5000
              });
              return;
            }
          }
        } catch (error) {
          console.error("Error checking Bitcoin balance:", error);
        }
      } else if (_this7.transactionData.isXlmToken && _this7._stellarService.isValidStellarAddress(address)) {
        _this7._setRawAddressToFoundAddress(address, "xlmAddress");
      }
      yield _this7._setToCurrentTransactionData();
      _this7.withdrawStep = true;
      _this7._syncToAddressControlDisabledState();
    })();
  }
  continueToConfirmation() {
    var _this8 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this8.form.valid) return;
      const address = _this8.form.get("toAddress")?.value;
      if (!address) {
        console.error("No address provided");
        return;
      }
      const isEVM = _this8.transactionData.isEthToken || _this8.transactionData.isAvaxToken || _this8.transactionData.isPolToken || _this8.transactionData.isBscToken || _this8.transactionData.isBDAGToken;
      if (!_this8.foundAddress) {
        if (_this8.transactionData.isSuiToken && _this8._suiService.isValidSuiAddress(address)) {
          _this8._setRawAddressToFoundAddress(address, "suiAddress");
        } else if (isEVM && _this8._checkEVMAddress(address)) {
          _this8._setRawAddressToFoundAddress(address, "ethAddress");
        } else if (_this8.transactionData.isSolToken && _this8._solanaService.isValidSolanaAddress(address)) {
          _this8._setRawAddressToFoundAddress(address, "solanaAddress");
        } else if (_this8.transactionData.isBtcToken && _this8._bitcoinService.isValidBTCAddress(address)) {
          _this8._setRawAddressToFoundAddress(address, "btcAddress");
        } else if (_this8.transactionData.isXlmToken && _this8._stellarService.isValidStellarAddress(address)) {
          _this8._setRawAddressToFoundAddress(address, "xlmAddress");
        }
      }
      if (!_this8.foundAddress) {
        console.error("No valid address found");
        return;
      }
      if (_this8._isSameWalletAsSender(_this8.foundAddress.publicData?.[_this8.addressKey])) {
        _this8._syncSameAddressControlError();
        _this8.openErrorSnackBar("errors.same_address");
        return;
      }
      yield _this8._setToCurrentTransactionData();
      _this8._router.navigate(["/send/confirmation"]);
    })();
  }
  getTimeDiff(lastUsed) {
    if (!lastUsed) return "";
    const now = new Date();
    const lastUsedDate = new Date(lastUsed);
    const diffInSeconds = Math.floor((now.getTime() - lastUsedDate.getTime()) / 1000);
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}min`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d`;
    } else {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months}mnth`;
    }
  }
  goBack() {
    this.transactionData.amount = 0;
    this.transactionData.receiver.address = "";
    this.transactionData.receiver.tagName = "";
    this.transactionData.memo = undefined;
    if (this.withdrawStep) {
      this.foundAddress = undefined;
      this.form.get("toAddress")?.patchValue(this.transactionData.receiver.address);
      this.form.get("amount")?.patchValue(this.transactionData.amount);
      this.form.get("memo")?.patchValue("");
      this._transactionService.setCurrentTransactionData(this.transactionData);
      this.withdrawStep = false;
      this._syncToAddressControlDisabledState();
      return;
    }
    this._transactionService.setCurrentTransactionData(this.transactionData);
    this._router.navigate(["/send"]);
  }
  isConfirmationDisabled() {
    if (!this.foundAddress || this.searching || this.form.invalid || this.form.get("amount")?.invalid) return true;
    return false;
  }
  isWithdrawDisabled() {
    if (!this.foundAddress || this.searching) return true;
    return false;
  }
  openErrorSnackBar(message) {
    this._snackBar.open(this._translocoService.translate(message), this._translocoService.translate("common.close"), {
      duration: 5000,
      panelClass: "zelf-snackbar",
      verticalPosition: "top"
    });
  }
  pasteAddress() {
    var _this9 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this9.withdrawStep || _this9.searching) return;
      const text = yield navigator.clipboard.readText();
      _this9._handlePaste(text);
    })();
  }
  pastedAddress(event) {
    var _this0 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      event.preventDefault();
      if (_this0.withdrawStep || _this0.searching) return;
      const text = event.clipboardData?.getData("text");
      _this0._handlePaste(text);
    })();
  }
  selectRecentAddress(address) {
    if (this.searching) return;
    const currentValue = this.form.get("toAddress")?.value;
    if (currentValue === address.address) {
      // Deselect: clear without triggering the debounced search
      this.form.get("toAddress")?.patchValue("", {
        emitEvent: false
      });
      this.foundAddress = undefined;
      this.isFromRecentAddress = false;
      this.isZelfNameNotFound = false;
      this._setToCurrentTransactionData();
      return;
    }
    // Patch without emitting so valueChanges / debounced search never fires
    this.form.get("toAddress")?.patchValue(address.address, {
      emitEvent: false
    });
    // Build foundAddress directly from the address book entry
    this._setRawAddressToFoundAddress(address.address, this.addressKey);
    this.isFromRecentAddress = true;
    this._setToCurrentTransactionData();
  }
  sendTransaction() {
    var _this1 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this1.form.invalid) return;
      _this1.loading = true;
      try {
        const walletData = yield _this1._walletService.getCurrentWallet();
        const mnemonic = _this1._vaultService.mnemonic;
        if (!walletData || !mnemonic) throw new Error("No wallet data or mnemonic available");
        const amount = parseFloat(_this1.form.get("amount")?.value || "0");
        const toAddress = _this1.form.get("toAddress")?.value;
        if (_this1.transactionData.isBtcToken) {
          yield _this1._handleBitcoinTransaction(amount, toAddress, mnemonic);
        }
      } catch (error) {
        console.error("Error sending transaction:", error);
        _this1._snackBar.open(_this1._translocoService.translate("TRANSACTION_FAILED"), _this1._translocoService.translate("CLOSE"), {
          duration: 5000
        });
      } finally {
        _this1.loading = false;
      }
    })();
  }
  _handleBitcoinTransaction(amount, toAddress, mnemonic) {
    var _this10 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const transactionParams = {
        from: "",
        // Will be derived from mnemonic in Bitcoin service
        to: toAddress,
        value: String(amount),
        network: "bitcoin",
        mnemonic: mnemonic
      };
      const result = yield _this10._bitcoinService.sendTransaction(transactionParams);
      _this10._snackBar.open(_this10._translocoService.translate("TRANSACTION_SENT"), _this10._translocoService.translate("CLOSE"), {
        duration: 5000
      });
      _this10._router.navigate(["/transaction-confirmation"], {
        state: {
          hash: result.hash,
          network: "bitcoin",
          amount: amount,
          to: toAddress,
          symbol: "BTC"
        }
      });
    })();
  }
  setToInput(address) {
    this.form.get("toAddress")?.patchValue(address.address);
  }
  onAmountKeydown(event) {
    if (event.isComposing) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const nav = ["Backspace", "Delete", "Tab", "Escape", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
    if (nav.includes(event.key)) return;
    if (/^[0-9]$/.test(event.key)) return;
    if (event.key === ".") {
      const input = event.target;
      if (input.value.includes(".")) event.preventDefault();
      return;
    }
    event.preventDefault();
  }
  onAmountInput(event) {
    const input = event.target;
    const sanitized = this._sanitizeAmountValue(input.value);
    if (sanitized !== input.value) {
      input.value = sanitized;
    }
    this.form.get("amount")?.setValue(sanitized, {
      emitEvent: true
    });
  }
  onAmountPaste(event) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData("text") || "";
    const sanitized = this._sanitizeAmountValue(pasted);
    this.form.get("amount")?.setValue(sanitized, {
      emitEvent: true
    });
    this.form.get("amount")?.markAsTouched();
  }
  withdrawAll() {
    const c = this.form.get("amount");
    c?.patchValue(this._getMaxSendableAmount());
    c?.markAsTouched();
  }
  _sanitizeAmountValue(value) {
    if (!value) return "";
    const filtered = value.replace(/[^0-9.]/g, "");
    const parts = filtered.split(".");
    if (parts.length <= 1) return filtered;
    return parts[0] + "." + parts.slice(1).join("");
  }
  static ɵfac = function SendTransactionComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SendTransactionComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_19__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](app_asset_service__WEBPACK_IMPORTED_MODULE_20__.AssetService), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](app_services_bitcoin_service__WEBPACK_IMPORTED_MODULE_21__.BitcoinService), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](app_services_blockdag_service__WEBPACK_IMPORTED_MODULE_22__.BlockDAGService), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_16__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](app_eth_service__WEBPACK_IMPORTED_MODULE_23__.EthereumService), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_19__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_24__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](app_solana_service__WEBPACK_IMPORTED_MODULE_25__.SolanaService), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](app_services_stellar_service__WEBPACK_IMPORTED_MODULE_26__.StellarService), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](app_services_substrate_relay_service__WEBPACK_IMPORTED_MODULE_27__.SubstrateRelayService), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](app_services_sui_service__WEBPACK_IMPORTED_MODULE_28__.SuiService), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](app_tags_service__WEBPACK_IMPORTED_MODULE_15__.TagsService), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](app_transaction_service__WEBPACK_IMPORTED_MODULE_29__.TransactionService), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](_jsverse_transloco__WEBPACK_IMPORTED_MODULE_11__.TranslocoService), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](app_vault_service__WEBPACK_IMPORTED_MODULE_30__.VaultService), _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdirectiveInject"](app_wallet_service__WEBPACK_IMPORTED_MODULE_31__.WalletService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵdefineComponent"]({
    type: SendTransactionComponent,
    selectors: [["send-transaction"]],
    decls: 3,
    vars: 0,
    consts: [["cross", ""], ["class", "zelf-card send-transaction", 4, "transloco"], [1, "zelf-card", "send-transaction"], [4, "ngIf"], [1, "send-transaction__header"], [1, "send-transaction__col1"], ["mat-flat-button", "", 1, "zelf-icon-button", "zelf-icon-button--secondary", "zelf-icon-button--40", 3, "click"], ["width", "22", "height", "14", "viewBox", "0 0 22 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"], [1, "send-transaction__col2"], [1, "send-transaction__title"], [1, "send-transaction__col3"], [1, "send-transaction__form", 3, "formGroup"], [1, "zelf-card__content", "send-transaction__content"], [1, "send-transaction__input-label"], [1, "send-transaction__input-label-text"], ["type", "hidden", "formControlName", "fromAddress", "id", "fromAddress", "name", "fromAddress"], ["role", "group", 1, "send-transaction__from-stacked"], [1, "send-transaction__from-stacked-tag"], [1, "send-transaction__from-stacked-address"], [1, "send-transaction__input-label", "send-transaction__input-label--mt-8"], [1, "zelf-input", "zelf-input--wide", "zelf-input--gap-narrow", 3, "ngClass"], ["autocomplete", "off", "formControlName", "toAddress", "id", "toAddress", "name", "toAddress", "required", "", 1, "zelf-input__control", 3, "paste", "placeholder", "readonly"], ["class", "zelf-icon-button zelf-icon-button--transparent zelf-icon-button--text", "type", "button", "mat-flat-button", "", 3, "disabled", "click", 4, "ngIf"], ["class", "zelf-message zelf-message--error zelf-message--column", 4, "ngIf"], [1, "zelf-card__actions"], ["class", "zelf-button zelf-button--primary zelf-button--wide", "mat-flat-button", "", "type", "button", 3, "disabled", "click", 4, "ngIf"], ["class", "zelf-button zelf-button--primary zelf-button--wide send-transaction__withdraw-cta", "mat-flat-button", "", "type", "button", 3, "send-transaction__withdraw-cta--blocked", "click", 4, "ngIf"], ["type", "button", "mat-flat-button", "", 1, "zelf-icon-button", "zelf-icon-button--transparent", "zelf-icon-button--text", 3, "click", "disabled"], [1, "zelf-message", "zelf-message--error", "zelf-message--column"], [1, "zelf-message__row"], [4, "ngTemplateOutlet"], [1, "zelf-input", "zelf-input--wide", 3, "ngClass"], ["autocomplete", "off", "formControlName", "amount", "id", "amount", "inputmode", "decimal", "name", "amount", "type", "text", 1, "zelf-input__control", 3, "input", "blur", "keydown", "paste", "placeholder"], ["mat-flat-button", "", "type", "button", 1, "zelf-icon-button", "zelf-icon-button--transparent", 3, "click"], [1, "send-transaction__fiat-row"], [1, "send-transaction__fiat-price"], ["class", "send-transaction__amount-inline-errors", 4, "ngIf"], [1, "zelf-input__tip"], [1, "send-transaction__amount-inline-errors"], ["class", "send-transaction__amount-inline-error", 4, "ngIf"], [1, "send-transaction__amount-inline-error"], [1, "zelf-input", "zelf-input--wide", "zelf-input--gap-narrow"], ["autocomplete", "off", "formControlName", "memo", "id", "memo", "maxlength", "28", "name", "memo", "type", "text", 1, "zelf-input__control", 3, "placeholder"], [1, "send-transaction__address-book"], [1, "send-transaction__address-book-label"], ["width", "14", "height", "14", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z"], ["class", "send-transaction__recent-card", "matRipple", "", 3, "matRippleColor", "send-transaction__recent-card--selected", "click", 4, "ngFor", "ngForOf"], ["matRipple", "", 1, "send-transaction__recent-card", 3, "click", "matRippleColor"], [1, "send-transaction__recent-avatar"], ["width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], [1, "send-transaction__recent-info"], ["class", "send-transaction__recent-name", 4, "ngIf"], ["class", "send-transaction__recent-address", 4, "ngIf"], [1, "send-transaction__recent-time"], ["class", "send-transaction__recent-check", "width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], ["width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M21 18v1c0 1.1-.9 2-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1h-9a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9zm-9-2h10V8H12v8zm4-2.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"], [1, "send-transaction__recent-name"], [1, "send-transaction__recent-address"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "send-transaction__recent-check"], ["d", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.41 14.58L6.7 12.7a.996.996 0 1 1 1.41-1.41l2.89 2.88 6.88-6.88a.996.996 0 1 1 1.41 1.41l-7.59 7.58c-.39.39-1.02.39-1.41 0z"], ["class", "zelf-object-preview", 4, "ngIf"], [1, "zelf-object-preview"], [1, "zelf-object-preview__status"], ["width", "12", "height", "12", "viewBox", "0 0 20 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z"], [1, "zelf-object-preview__row"], [1, "zelf-object-preview__avatar"], [1, "zelf-object-preview__details"], [1, "zelf-object-preview__name"], ["class", "zelf-object-preview__address-short", 4, "ngIf"], ["width", "20", "height", "20", "viewBox", "0 0 20 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 1, "zelf-object-preview__check"], [1, "zelf-object-preview__address-short"], [1, "zelf-object-preview__chip"], [1, "zelf-object-preview__icon-bubble", "zelf-object-preview__icon-bubble--error"], ["width", "20", "height", "20", "viewBox", "0 0 20 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z", "fill", "currentColor"], [1, "zelf-object-preview__chip-text"], [1, "zelf-object-preview__horizontal-rule"], [1, "zelf-object-preview__instructions"], ["mat-flat-button", "", "type", "button", 1, "zelf-button", "zelf-button--primary", "zelf-button--wide", 3, "click", "disabled"], ["mat-flat-button", "", "type", "button", 1, "zelf-button", "zelf-button--primary", "zelf-button--wide", "send-transaction__withdraw-cta", 3, "click"], ["d", "M10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM14.3 14.3C13.91 14.69 13.28 14.69 12.89 14.3L10 11.41L7.11 14.3C6.72 14.69 6.09 14.69 5.7 14.3C5.31 13.91 5.31 13.28 5.7 12.89L8.59 10L5.7 7.11C5.31 6.72 5.31 6.09 5.7 5.7C6.09 5.31 6.72 5.31 7.11 5.7L10 8.59L12.89 5.7C13.28 5.31 13.91 5.31 14.3 5.7C14.69 6.09 14.69 6.72 14.3 7.11L11.41 10L14.3 12.89C14.68 13.27 14.68 13.91 14.3 14.3Z", "fill", "#DC362E"]],
    template: function SendTransactionComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplate"](0, SendTransactionComponent_div_0_Template, 3, 2, "div", 1)(1, SendTransactionComponent_ng_template_1_Template, 2, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵtemplateRefExtractor"]);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgTemplateOutlet, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButton, _angular_material_slide_toggle__WEBPACK_IMPORTED_MODULE_9__.MatSlideToggleModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_8__.MatProgressSpinnerModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_7__.MatRippleModule, _angular_material_core__WEBPACK_IMPORTED_MODULE_32__.MatRipple, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormControlName, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule, _angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_11__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_11__.TranslocoDirective, app_zelf_loader_zelf_loader_component__WEBPACK_IMPORTED_MODULE_14__.ZelfLoaderComponent, app_pipes_address_mask_pipe__WEBPACK_IMPORTED_MODULE_13__.AddressMaskPipe, _angular_common__WEBPACK_IMPORTED_MODULE_4__.UpperCasePipe, _angular_common__WEBPACK_IMPORTED_MODULE_4__.CurrencyPipe],
    styles: ["[_ngcontent-%COMP%]:root {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc);\n}\n\n.zelf-button-external-link[_ngcontent-%COMP%] {\n  display: block;\n}\n.zelf-button-external-link--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.zelf-button[_ngcontent-%COMP%] {\n  align-items: center;\n  border-radius: 16px;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  gap: 8px;\n  height: 56px;\n  justify-content: center;\n  outline: none;\n  padding: 8px 24px;\n  text-align: center;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.zelf-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-button[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: inherit;\n}\n.zelf-button__text--margin-right[_ngcontent-%COMP%] {\n  margin-right: 1rem;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-button--thin[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  padding: 12px 16px;\n}\n.zelf-button--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.zelf-button--wide.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-button--primary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button, #181818) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--primary[_ngcontent-%COMP%]:active {\n  --mdc-filled-button-container-color: var(--zns-theme-text-muted, #96939e) !important;\n  background-color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-hover, #ff5721) !important;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff) !important;\n  stroke: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-text-secondary, #73777f) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-text-secondary, #73777f) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--secondary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-button-secondary-text, #495057) !important;\n  background-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  color: var(--zns-theme-button-secondary-text, #495057) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-secondary-text, #495057);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus, .zelf-button--secondary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-border, #e3e3e3) !important;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]:focus, .zelf-button--tertiary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%] {\n  --mdc-outlined-button-label-text-color: var(--zns-theme-button, #181818) !important;\n  --mdc-outlined-button-outline-color: var(--zns-theme-border, #e3e3e3) !important;\n  border: 1px solid var(--zns-theme-button, #181818) !important;\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-button, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button, #181818);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus, .zelf-button--outlined[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--outlined[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--outlined[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%] {\n  border: none !important;\n  background-color: transparent !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--red[_ngcontent-%COMP%]:focus, .zelf-button--red[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n}\n.zelf-button--red[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e);\n}\n.zelf-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n}\n\n.zelf-icon-button[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  align-items: center;\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  border-radius: 56px;\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  font-weight: 600;\n  gap: 16px;\n  height: 56px;\n  justify-content: center;\n  min-height: 56px;\n  min-width: 56px;\n  outline: none;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  -webkit-user-select: none;\n          user-select: none;\n  width: 56px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-icon-button.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: var(--zns-theme-text, #181818);\n  height: 24px;\n  width: 24px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%] {\n  height: 40px;\n  min-height: 40px;\n  min-width: 40px;\n  width: 40px;\n  border-radius: 40px;\n  padding: 0 8px;\n}\n.zelf-icon-button--40.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 14px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  height: 20px;\n  width: 20px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e) !important;\n  stroke: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:active {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus, .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%] {\n  background-color: transparent !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]:focus, .zelf-icon-button--transparent[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--text[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: initial !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  height: auto;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n  width: auto;\n}\n\n.zelf-icon-button-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:first-child {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:last-child {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.zelf-action-button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: 8px;\n}\n.zelf-action-button__icon[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  background: var(--zns-theme-card, #ffffff);\n  border-radius: 32px;\n  outline: 1px var(--zns-theme-border, #e3e3e3) solid;\n  outline-offset: -1px;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  cursor: pointer;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n@media (max-width: 600px) {\n  .zelf-action-button__icon[_ngcontent-%COMP%] {\n    padding: 8px 14px;\n  }\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-size: 24px;\n  line-height: 1;\n  font-variation-settings: \"FILL\" 0, \"wght\" 400, \"GRAD\" 0, \"opsz\" 24;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-primary, #181818);\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .zelf-action-button__text[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon-box[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  position: relative;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n}\n.zelf-action-button__text[_ngcontent-%COMP%] {\n  width: auto;\n  white-space: nowrap;\n  text-align: center;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 11px;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  line-height: 16px;\n  letter-spacing: 0.5px;\n  word-wrap: normal;\n}\n\n[_nghost-%COMP%] {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  justify-content: center;\n}\n\n.send-transaction[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  max-width: var(--zns-card-width, 536px);\n  min-height: var(--zns-card-min-height, 768px);\n  \n\n}\n.send-transaction__loader[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  margin: auto;\n  z-index: 2;\n}\n.send-transaction__header[_ngcontent-%COMP%] {\n  align-content: center;\n  column-gap: calc(12px * var(--zns-space-scale, 1));\n  display: grid;\n  gap: calc(24px * var(--zns-space-scale, 1));\n  grid-template-columns: repeat(10, 1fr);\n  justify-content: start;\n  width: 100%;\n}\n.send-transaction__col1[_ngcontent-%COMP%], .send-transaction__col3[_ngcontent-%COMP%] {\n  grid-column: span 3;\n  display: flex;\n  align-items: center;\n}\n.send-transaction__col1[_ngcontent-%COMP%] {\n  justify-content: start;\n}\n.send-transaction__col2[_ngcontent-%COMP%] {\n  grid-column: span 4;\n  text-align: center;\n  align-items: center;\n}\n.send-transaction__col3[_ngcontent-%COMP%] {\n  justify-content: end;\n}\n.send-transaction__title[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-title-family, \"Menda\", \"Arial Black\", sans-serif);\n  font-weight: 500;\n  font-size: calc(24px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  text-align: center;\n  vertical-align: middle;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n}\n.send-transaction__form[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: calc(24px * var(--zns-space-scale, 1));\n  flex-grow: 1;\n  position: relative;\n}\n.send-transaction__content[_ngcontent-%COMP%] {\n  margin-top: calc(16px * var(--zns-space-scale, 1));\n  flex: 1 1 auto;\n  justify-content: flex-start;\n}\n.send-transaction__input-label[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  box-sizing: border-box;\n  padding-left: calc(16px * var(--zns-space-scale, 1));\n  width: 100%;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  margin: 0;\n  text-align: left;\n}\n.send-transaction__input-label--mt-8[_ngcontent-%COMP%] {\n  margin-top: calc(8px * var(--zns-space-scale, 1));\n}\n.send-transaction__input-label-text[_ngcontent-%COMP%] {\n  margin-right: calc(4px * var(--zns-space-scale, 1));\n}\n.send-transaction__address-row[_ngcontent-%COMP%] {\n  align-items: center;\n  cursor: pointer;\n  display: flex;\n  flex-direction: row;\n  gap: calc(16px * var(--zns-space-scale, 1));\n  justify-content: flex-start;\n  -webkit-user-select: none;\n          user-select: none;\n  width: 100%;\n}\n.send-transaction__address-icon[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  fill: var(--zns-theme-text, #181818);\n}\n.send-transaction__fiat-row[_ngcontent-%COMP%] {\n  align-items: baseline;\n  box-sizing: border-box;\n  display: flex;\n  flex-wrap: wrap;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  justify-content: space-between;\n  margin: 0;\n  padding: 0 calc(12px * var(--zns-space-scale, 1));\n  width: 100%;\n}\n.send-transaction__fiat-price[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  color: var(--zns-theme-text-secondary, #73777f);\n  flex: 0 1 auto;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  font-weight: 500;\n  letter-spacing: 0.1px;\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  margin: 0;\n  padding: 0;\n  text-align: left;\n  vertical-align: middle;\n}\n.send-transaction__amount-inline-errors[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1 1 auto;\n  justify-content: flex-end;\n  margin: 0;\n  min-width: 0;\n  text-align: right;\n}\n.send-transaction__amount-inline-error[_ngcontent-%COMP%] {\n  color: var(--zns-theme-error, #dc362e);\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  font-weight: 500;\n  letter-spacing: 0.02em;\n  line-height: calc(18px * var(--zns-font-scale, 1));\n  margin: 0;\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.send-transaction__withdraw-cta--blocked[_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  opacity: 0.45;\n  pointer-events: auto;\n}\n.send-transaction__address-col[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  justify-content: flex-start;\n  gap: calc(4px * var(--zns-space-scale, 1));\n  width: 100%;\n  margin: 0;\n}\n.send-transaction__address-name[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  vertical-align: middle;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n}\n.send-transaction__address-name--zelf-name[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-title-family, \"Menda\", \"Arial Black\", sans-serif);\n  font-weight: 700;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  text-transform: uppercase;\n}\n.send-transaction__address-book[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  margin-top: calc(16px * var(--zns-space-scale, 1));\n  width: 100%;\n  justify-content: flex-start;\n  align-items: flex-start;\n}\n.send-transaction__address-book-label[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: calc(6px * var(--zns-space-scale, 1));\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: calc(11px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  letter-spacing: 0.8px;\n  text-transform: uppercase;\n  color: var(--zns-theme-text-secondary, #73777f);\n  margin: calc(4px * var(--zns-space-scale, 1)) 0 0 calc(4px * var(--zns-space-scale, 1));\n}\n.send-transaction__address-book-label[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n  flex-shrink: 0;\n}\n.send-transaction__recent-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: calc(12px * var(--zns-space-scale, 1));\n  width: 100%;\n  padding: calc(10px * var(--zns-space-scale, 1)) calc(14px * var(--zns-space-scale, 1));\n  border-radius: 16px;\n  border: 1.5px solid var(--zns-theme-border, #e3e3e3);\n  background: var(--zns-theme-card, #ffffff);\n  cursor: pointer;\n  box-sizing: border-box;\n  transition: border-color 0.2s ease, background 0.2s ease;\n}\n.send-transaction__recent-card--selected[_ngcontent-%COMP%] {\n  border-color: var(--zns-theme-primary, #181818);\n  background: var(--zns-theme-card, #ffffff);\n}\n.send-transaction__recent-card[_ngcontent-%COMP%]:hover:not(.send-transaction__recent-card--selected) {\n  border-color: var(--zns-theme-border-hover, #c3c6cf);\n}\n.send-transaction__recent-avatar[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  width: calc(36px * var(--zns-space-scale, 1));\n  height: calc(36px * var(--zns-space-scale, 1));\n  border-radius: 50%;\n  background: var(--zns-theme-card-border, #eeedf1);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-family: var(--zns-theme-title-family, \"Menda\", \"Arial Black\", sans-serif);\n  font-weight: 700;\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-text, #181818);\n}\n.send-transaction__recent-avatar[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.send-transaction__recent-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: calc(2px * var(--zns-space-scale, 1));\n  flex: 1 1 0;\n  min-width: 0;\n}\n.send-transaction__recent-name[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-title-family, \"Menda\", \"Arial Black\", sans-serif);\n  font-weight: 700;\n  font-size: calc(13px * var(--zns-font-scale, 1));\n  line-height: calc(18px * var(--zns-font-scale, 1));\n  letter-spacing: 0.5px;\n  text-transform: uppercase;\n  color: var(--zns-theme-text, #181818);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.send-transaction__recent-address[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-monospace-family, \"Courier New\", Courier, monospace);\n  font-size: calc(10px * var(--zns-font-scale, 1));\n  line-height: calc(14px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-text-secondary, #73777f);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.send-transaction__recent-time[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: calc(10px * var(--zns-font-scale, 1));\n  line-height: calc(14px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-text-muted, #96939e);\n  letter-spacing: 0.2px;\n}\n.send-transaction__recent-check[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  fill: var(--zns-theme-success, #1ea446);\n}\n.send-transaction__from-stacked[_ngcontent-%COMP%] {\n  align-items: stretch;\n  background-color: var(--zns-theme-card, #ffffff);\n  border-radius: 9999px;\n  border: 1px solid var(--zns-theme-text-secondary, #73777f);\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  gap: calc(4px * var(--zns-space-scale, 1));\n  justify-content: center;\n  min-height: 56px;\n  padding: calc(10px * var(--zns-space-scale, 1)) calc(18px * var(--zns-space-scale, 1));\n  transition: border-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n  width: 100%;\n}\n.send-transaction__from-stacked-tag[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-family: var(--zns-theme-title-family, \"Menda\", \"Arial Black\", sans-serif);\n  font-size: calc(13px * var(--zns-font-scale, 1));\n  font-weight: 700;\n  letter-spacing: 0.06em;\n  line-height: calc(18px * var(--zns-font-scale, 1));\n  margin: 0;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  text-transform: uppercase;\n  white-space: nowrap;\n}\n.send-transaction__from-stacked-address[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-family: var(--zns-theme-monospace-family, \"Courier New\", Courier, monospace);\n  font-size: calc(11px * var(--zns-font-scale, 1));\n  font-weight: 500;\n  letter-spacing: 0.02em;\n  line-height: calc(16px * var(--zns-font-scale, 1));\n  margin: 0;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.send-transaction__address-used[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 500;\n  font-size: calc(11px * var(--zns-font-scale, 1));\n  line-height: calc(16px * var(--zns-font-scale, 1));\n  letter-spacing: 0.5px;\n  vertical-align: middle;\n  color: var(--zns-theme-text-secondary, #73777f);\n  margin: 0;\n}\n\n.zelf-object-preview[_ngcontent-%COMP%] {\n  max-width: var(--zns-card-width, 484px);\n  width: 100%;\n  border-radius: 14px;\n  padding: calc(10px * var(--zns-space-scale, 1)) calc(14px * var(--zns-space-scale, 1));\n  border: 1px solid var(--zns-theme-success, #1ea446);\n  background-color: var(--zns-theme-card, #ffffff);\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  gap: calc(8px * var(--zns-space-scale, 1));\n}\n.zelf-object-preview__status[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: calc(11px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 0.06em;\n  color: var(--zns-theme-success, #1ea446);\n  margin: 0;\n}\n.zelf-object-preview__status[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446);\n  flex-shrink: 0;\n}\n.zelf-object-preview__row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: calc(10px * var(--zns-space-scale, 1));\n  width: 100%;\n}\n.zelf-object-preview__avatar[_ngcontent-%COMP%] {\n  width: calc(36px * var(--zns-space-scale, 1));\n  height: calc(36px * var(--zns-space-scale, 1));\n  min-width: calc(36px * var(--zns-space-scale, 1));\n  border-radius: 36px;\n  background-color: var(--zns-theme-background-secondary, #f9f9fc);\n  color: var(--zns-theme-text, #181818);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-family: var(--zns-theme-title-family, \"Menda\", \"Arial Black\", sans-serif);\n  font-weight: 700;\n  font-size: calc(13px * var(--zns-font-scale, 1));\n  text-transform: uppercase;\n  flex-shrink: 0;\n}\n.zelf-object-preview__details[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  flex-grow: 1;\n  min-width: 0;\n}\n.zelf-object-preview__name[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-title-family, \"Menda\", \"Arial Black\", sans-serif);\n  font-weight: 700;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(18px * var(--zns-font-scale, 1));\n  text-transform: uppercase;\n  color: var(--zns-theme-text, #181818);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.zelf-object-preview__address-short[_ngcontent-%COMP%] {\n  font-family: monospace;\n  font-size: calc(11px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-text-secondary, #73777f);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.zelf-object-preview__check[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  fill: var(--zns-theme-success, #1ea446);\n}\n.zelf-object-preview__icon-bubble[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc);\n  height: calc(32px * var(--zns-space-scale, 1));\n  width: calc(32px * var(--zns-space-scale, 1));\n  border-radius: 48px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.zelf-object-preview__icon-bubble[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446);\n}\n.zelf-object-preview__icon-bubble--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error, #dc362e);\n  color: white;\n}\n.zelf-object-preview__horizontal-rule[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n}\n.zelf-object-preview__instructions[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 500;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  text-align: center;\n  vertical-align: middle;\n  color: var(--zns-theme-text-secondary, #73777f);\n  margin: 0;\n}\n.zelf-object-preview__error-message[_ngcontent-%COMP%] {\n  color: var(--zns-theme-error, #dc362e);\n  text-align: center;\n  font-size: calc(16px * var(--zns-font-scale, 1));\n  margin: calc(16px * var(--zns-space-scale, 1)) 0;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX2J1dHRvbnMuc2NzcyIsIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX3ZhcmlhYmxlcy5zY3NzIiwid2VicGFjazovLy4vc3JjL2FwcC9zZW5kLXRyYW5zYWN0aW9uL3NlbmQtdHJhbnNhY3Rpb24uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxnRUMwQnVCO0FDM0IzQjs7QUZJQTtFQUNJLGNBQUE7QUVESjtBRkdJO0VBQ0ksV0FBQTtBRURSOztBRktBO0VBQ0ksbUJBQUE7RUFDQSxtQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLHVFQ0ljO0VESGQsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsUUFBQTtFQUNBLFlBQUE7RUFDQSx1QkFBQTtFQUNBLGFBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7VUFBQSxpQkFBQTtBRUZKO0FGSUk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLFFBQUE7QUVGUjtBRktJO0VBQ0ksU0FBQTtFQUNBLGNBQUE7QUVIUjtBRk9RO0VBQ0ksa0JBQUE7QUVMWjtBRlNJO0VBQ0ksNkJBQUE7RUFDQSwrQ0NsQmE7RURtQmIsZUFBQTtFQUNBLGdCQUFBO0VBQ0EscUJBQUE7RUFDQSxpQkFBQTtFQUNBLDZHQUNJO0FFUlo7QUZXUTtFQUNJLGVBQUE7QUVUWjtBRllRO0VBQ0ksOENDaENTO0FDc0JyQjtBRmFRO0VBQ0kscUNDdENBO0VEdUNBLGtEQ3hCRTtBQ2FkO0FGYVk7RUFDSSxvQ0MxQ0o7QUMrQlo7QUZlUTtFQUNJLG1CQUFBO0VBQ0Esc0RBQUE7QUViWjtBRmVZO0VBQ0ksMENDbERDO0FDcUNqQjtBRmtCSTtFQUNJLGtCQUFBO0VBQ0Esa0JBQUE7QUVoQlI7QUZtQkk7RUFDSSxXQUFBO0FFakJSO0FGbUJRO0VBQ0ksbUJBQUE7QUVqQlo7QUZxQkk7RUFFSSxnRkFBQTtFQUNBLCtFQUFB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LGtCQUFBO0VBQ0Esc0JBQUE7RUFDQSwrQ0R0ZGE7RUN1ZGIsU0FBQTtBQWtjUjtBQS9iSTtFQUNJLHNDRG5mQTtFQ29mQSxrQkFBQTtFQUNBLGdEQUFBO0VBQ0EsZ0RBQUE7QUFpY1IiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwiLi92YXJpYWJsZXNcIjtcblxuOnJvb3Qge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5O1xufVxuXG4uemVsZi1idXR0b24tZXh0ZXJuYWwtbGluayB7XG4gICAgZGlzcGxheTogYmxvY2s7XG5cbiAgICAmLS13aWRlIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxufVxuXG4uemVsZi1idXR0b24ge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIGdhcDogOHB4O1xuICAgIGhlaWdodDogNTZweDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBvdXRsaW5lOiBub25lO1xuICAgIHBhZGRpbmc6IDhweCAyNHB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcblxuICAgIHNwYW4ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgfVxuXG4gICAgcCB7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgY29sb3I6IGluaGVyaXQ7XG4gICAgfVxuXG4gICAgJl9fdGV4dCB7XG4gICAgICAgICYtLW1hcmdpbi1yaWdodCB7XG4gICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDFyZW07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1oeXBlcmxpbmsge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICAgICAgcGFkZGluZzogOHB4IDE2cHg7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICYtLXNtYWxsIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10aGluIHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICBwYWRkaW5nOiAxMnB4IDE2cHg7XG4gICAgfVxuXG4gICAgJi0td2lkZSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgICAgICYuemVsZi1idXR0b24tLWh5cGVybGluayB7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tcHJpbWFyeSB7XG4gICAgICAgIC8vIE1EQyBtYXQtZmxhdC1idXR0b24gcGFpbnRzIHZpYSBDU1MgdmFyaWFibGVzOyBhbGlnbiB3aXRoIFplbGYgdG9rZW5zIChhdm9pZHMgZGVmYXVsdCBNYXRlcmlhbCBibHVlKS5cbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvbn0gIWltcG9ydGFudDtcbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVDYXJkfSAhaW1wb3J0YW50O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6YWN0aXZlIHtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWR9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3Zlcn0gIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICB9XG5cbiAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnl9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWxhYmVsLXRleHQtY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUNhcmR9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zZWNvbmRhcnkge1xuICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5fSAhaW1wb3J0YW50O1xuICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWxhYmVsLXRleHQtY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeVRleHR9ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5SG92ZXJ9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWxhYmVsLXRleHQtY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUNhcmR9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5SG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQm9yZGVyfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlciAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXRlcnRpYXJ5IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1vdXRsaW5lZCB7XG4gICAgICAgIC0tbWRjLW91dGxpbmVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b259ICFpbXBvcnRhbnQ7XG4gICAgICAgIC0tbWRjLW91dGxpbmVkLWJ1dHRvbi1vdXRsaW5lLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCb3JkZXJ9ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUJ1dHRvbiAhaW1wb3J0YW50O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbiAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbjtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbkhvdmVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXJlZCB7XG4gICAgICAgIGJvcmRlcjogbm9uZSAhaW1wb3J0YW50O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kZXJyb3JMaWdodCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1lcnJvciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kZXJyb3JMaWdodCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGVycm9yICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zdWNjZXNzIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRjb3JyZWN0TGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXBpbGwge1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDA7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgcGFkZGluZzogNHB4IDEycHg7XG4gICAgfVxufVxuXG4uemVsZi1pY29uLWJ1dHRvbiB7XG4gICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXIgIWltcG9ydGFudDtcbiAgICBib3JkZXItcmFkaXVzOiA1NnB4O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICBnYXA6IDE2cHg7XG4gICAgaGVpZ2h0OiA1NnB4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG1pbi1oZWlnaHQ6IDU2cHg7XG4gICAgbWluLXdpZHRoOiA1NnB4O1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgdHJhbnNpdGlvbjpcbiAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgIHdpZHRoOiA1NnB4O1xuXG4gICAgc3BhbiB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICB9XG5cbiAgICAmLnplbGYtaWNvbi1idXR0b24tLWJvcmRlci1zb2Z0IHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICB9XG5cbiAgICBzdmcge1xuICAgICAgICB0cmFuc2l0aW9uOiBmaWxsIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBoZWlnaHQ6IDI0cHg7XG4gICAgICAgIHdpZHRoOiAyNHB4O1xuICAgIH1cblxuICAgICY6aG92ZXIge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHNlY29uZGFyeUNvbG9yICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1ib3JkZXItc29mdCB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgfVxuXG4gICAgJi0tNDAge1xuICAgICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDQwcHg7XG4gICAgICAgIG1pbi13aWR0aDogNDBweDtcbiAgICAgICAgd2lkdGg6IDQwcHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDQwcHg7XG4gICAgICAgIHBhZGRpbmc6IDAgOHB4O1xuXG4gICAgICAgICYuemVsZi1pY29uLWJ1dHRvbi0tYm9yZGVyLXNvZnQge1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTRweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBoZWlnaHQ6IDIwcHg7XG4gICAgICAgICAgICB3aWR0aDogMjBweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWh5cGVybGluayB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBwYWRkaW5nOiA4cHggMTZweDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuMnMgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJi0tc21hbGwge1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1wcmltYXJ5IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbiAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjphY3RpdmUge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbkhvdmVyICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbkhvdmVyICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zZWNvbmRhcnkge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlciAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHNlY29uZGFyeUNvbG9yICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlciAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXRyYW5zcGFyZW50IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXRleHQge1xuICAgICAgICB3aWR0aDogYXV0byAhaW1wb3J0YW50O1xuICAgICAgICBtaW4td2lkdGg6IGluaXRpYWwgIWltcG9ydGFudDtcbiAgICB9XG5cbiAgICAmLS1lcnJvciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kZXJyb3JMaWdodCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGVycm9yICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zdWNjZXNzIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRjb3JyZWN0TGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXBpbGwge1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIGhlaWdodDogYXV0bztcbiAgICAgICAgbWluLWhlaWdodDogMDtcbiAgICAgICAgbWluLXdpZHRoOiAwO1xuICAgICAgICBwYWRkaW5nOiA0cHggMTJweDtcbiAgICAgICAgd2lkdGg6IGF1dG87XG4gICAgfVxufVxuXG4uemVsZi1pY29uLWJ1dHRvbi1ncm91cCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogMDtcblxuICAgIC56ZWxmLWljb24tYnV0dG9uIHtcbiAgICAgICAgJjpmaXJzdC1jaGlsZCB7XG4gICAgICAgICAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMDtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpub3QoOmZpcnN0LWNoaWxkKTpub3QoOmxhc3QtY2hpbGQpIHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDA7XG4gICAgICAgIH1cblxuICAgICAgICAmOmxhc3QtY2hpbGQge1xuICAgICAgICAgICAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogMDtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDA7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi56ZWxmLWFjdGlvbi1idXR0b24ge1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiA4cHg7XG5cbiAgICAmX19pY29uIHtcbiAgICAgICAgcGFkZGluZzogMTBweCAyMHB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMzJweDtcbiAgICAgICAgb3V0bGluZTogMXB4IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgc29saWQ7XG4gICAgICAgIG91dGxpbmUtb2Zmc2V0OiAtMXB4O1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogOHB4O1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiB2YXJpYWJsZXMuJG1pblNtYWxsKSB7XG4gICAgICAgICAgICBwYWRkaW5nOiA4cHggMTRweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGZpbGwgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC5tYXRlcmlhbC1zeW1ib2xzLW91dGxpbmVkIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgICAgICAgICAgZm9udC12YXJpYXRpb24tc2V0dGluZ3M6XG4gICAgICAgICAgICAgICAgXCJGSUxMXCIgMCxcbiAgICAgICAgICAgICAgICBcIndnaHRcIiA0MDAsXG4gICAgICAgICAgICAgICAgXCJHUkFEXCIgMCxcbiAgICAgICAgICAgICAgICBcIm9wc3pcIiAyNDtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kcHJpbWFyeUNvbG9yO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAubWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAuemVsZi1hY3Rpb24tYnV0dG9uX190ZXh0IHtcbiAgICAgICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19pY29uLWJveCB7XG4gICAgICAgIHdpZHRoOiAyOHB4O1xuICAgICAgICBoZWlnaHQ6IDI4cHg7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIH1cblxuICAgICZfX3RleHQge1xuICAgICAgICB3aWR0aDogYXV0bztcbiAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBsaW5lLWhlaWdodDogMTZweDtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgICAgICB3b3JkLXdyYXA6IG5vcm1hbDtcbiAgICB9XG59XG4iLCIkcHJpbWFyeUNvbG9yOiB2YXIoLS16bnMtdGhlbWUtcHJpbWFyeSwgIzE4MTgxOCk7XG4kcHJpbWFyeUxpZ2h0OiAjZGFkZGZhO1xuJHNlY29uZGFyeUNvbG9yOiB2YXIoLS16bnMtdGhlbWUtc2Vjb25kYXJ5LCAjZmY1NzIxKTtcbiRzZWNvbmRhcnlDb2xvckxpZ2h0OiAjZjZlNWUwO1xuXG4kY29ycmVjdDogdmFyKC0tem5zLXRoZW1lLXN1Y2Nlc3MsICMxZWE0NDYpO1xuJGNvcnJlY3REYXJrOiAjMGY1MjIzO1xuJGNvcnJlY3RMaWdodDogdmFyKC0tem5zLXRoZW1lLXN1Y2Nlc3MtdGV4dCwgI2U3ZjhlZCk7XG5cbiRlcnJvcjogdmFyKC0tem5zLXRoZW1lLWVycm9yLCAjZGMzNjJlKTtcbiRlcnJvckRhcms6ICM2MDE0MTA7XG4kZXJyb3JMaWdodDogdmFyKC0tem5zLXRoZW1lLWVycm9yLXRleHQsICNmY2VlZWUpO1xuXG4kd2FybmluZzogdmFyKC0tem5zLXRoZW1lLXdhcm5pbmcsICNkZTY4MDApO1xuJHdhcm5pbmdEYXJrOiAjNGEyMTBhO1xuJHdhcm5pbmdMaWdodDogdmFyKC0tem5zLXRoZW1lLXdhcm5pbmctdGV4dCwgI2ZmZWVlOSk7XG5cbiRpbmZvOiAjMzk5OGQzO1xuJGluZm9EYXJrOiAjMDA0YTc3O1xuJGluZm9MaWdodDogI2VjZjNmZTtcblxuJGJsYWNrOiAjMTgxODE4O1xuJHdoaXRlOiAjZmZmZmZmO1xuXG4kdGhlbWVCb2R5RmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtYm9keS1mYW1pbHksIFwiUG9wcGluc1wiLCBBcmlhbCwgc2Fucy1zZXJpZik7XG4kdGhlbWVUaXRsZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLXRpdGxlLWZhbWlseSwgXCJNZW5kYVwiLCBcIkFyaWFsIEJsYWNrXCIsIHNhbnMtc2VyaWYpO1xuJHRoZW1lTW9ub3NwYWNlRmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtbW9ub3NwYWNlLWZhbWlseSwgXCJDb3VyaWVyIE5ld1wiLCBDb3VyaWVyLCBtb25vc3BhY2UpO1xuXG4kdGhlbWVCYWNrZ3JvdW5kOiB2YXIoLS16bnMtdGhlbWUtYmFja2dyb3VuZCwgI2ZmZmZmZik7XG4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtYmFja2dyb3VuZC1zZWNvbmRhcnksICNmOWY5ZmMpO1xuXG4kdGhlbWVUZXh0OiB2YXIoLS16bnMtdGhlbWUtdGV4dCwgIzE4MTgxOCk7XG4kdGhlbWVUZXh0TXV0ZWQ6IHZhcigtLXpucy10aGVtZS10ZXh0LW11dGVkLCAjOTY5MzllKTtcbiR0aGVtZVRleHRTZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS10ZXh0LXNlY29uZGFyeSwgIzczNzc3Zik7XG5cbiR0aGVtZUhlYWRlcjogdmFyKC0tem5zLXRoZW1lLWhlYWRlciwgIzE4MTgxOCk7XG4kdGhlbWVIZWFkZXJUZXh0OiB2YXIoLS16bnMtdGhlbWUtaGVhZGVyLXRleHQsICNmZmZmZmYpO1xuXG4kdGhlbWVCdXR0b246IHZhcigtLXpucy10aGVtZS1idXR0b24sICMxODE4MTgpO1xuJHRoZW1lQnV0dG9uVGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi10ZXh0LCAjZmZmZmZmKTtcbiR0aGVtZUJ1dHRvbkhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLWhvdmVyLCAjZmY1NzIxKTtcblxuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeSwgI2U5ZWNlZik7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeS10ZXh0LCAjNDk1MDU3KTtcbiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeS1ob3ZlciwgI2U5ZWNlZik7XG5cbiR0aGVtZUJvcmRlcjogdmFyKC0tem5zLXRoZW1lLWJvcmRlciwgI2UzZTNlMyk7XG4kdGhlbWVCb3JkZXJIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJvcmRlci1ob3ZlciwgI2MzYzZjZik7XG5cbiR0aGVtZUNhcmQ6IHZhcigtLXpucy10aGVtZS1jYXJkLCAjZmZmZmZmKTtcbiR0aGVtZUNhcmRCb3JkZXI6IHZhcigtLXpucy10aGVtZS1jYXJkLWJvcmRlciwgI2VlZWRmMSk7XG5cbiR0aGVtZVNoYWRvdzogdmFyKC0tem5zLXRoZW1lLXNoYWRvdywgcmdiYSgwLCAwLCAwLCAwLjEpKTtcblxuJHNtb290aEJlemllcjogY3ViaWMtYmV6aWVyKDAuMjUsIDAuNCwgMC43LCAxKTtcblxuJG1heEV4dHJhU21hbGw6IDU5NXB4O1xuJG1pblNtYWxsOiA2MDBweDtcbiRtZWRpdW06IDc2OHB4O1xuJGxhcmdlOiA4ODlweDtcbiRjb21wdXRlcnM6IDEyMDBweDtcbiIsIkB1c2UgXCIuLi8uLi9zdHlsZXMvdmFyaWFibGVzXCI7XG5AdXNlIFwiLi4vLi4vc3R5bGVzL2J1dHRvbnNcIjtcblxuOmhvc3Qge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGZsZXgtZ3JvdzogMTtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuLnNlbmQtdHJhbnNhY3Rpb24ge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBtYXgtd2lkdGg6IHZhcigtLXpucy1jYXJkLXdpZHRoLCA1MzZweCk7XG4gICAgbWluLWhlaWdodDogdmFyKC0tem5zLWNhcmQtbWluLWhlaWdodCwgNzY4cHgpO1xuXG4gICAgJl9fbG9hZGVyIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICBpbnNldDogMDtcbiAgICAgICAgbWFyZ2luOiBhdXRvO1xuICAgICAgICB6LWluZGV4OiAyO1xuICAgIH1cblxuICAgICZfX2hlYWRlciB7XG4gICAgICAgIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgY29sdW1uLWdhcDogY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgICAgIGdhcDogY2FsYygyNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAxZnIpO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHN0YXJ0O1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX19jb2wxLFxuICAgICZfX2NvbDMge1xuICAgICAgICBncmlkLWNvbHVtbjogc3BhbiAzO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIH1cblxuICAgICZfX2NvbDEge1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHN0YXJ0O1xuICAgIH1cblxuICAgICZfX2NvbDIge1xuICAgICAgICBncmlkLWNvbHVtbjogc3BhbiA0O1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgJl9fY29sMyB7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZW5kO1xuICAgIH1cblxuICAgICZfX3RpdGxlIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVUaXRsZUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDI0cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygyMHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMXB4O1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgIH1cblxuICAgICZfX2Zvcm0ge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogY2FsYygyNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGZsZXgtZ3JvdzogMTtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIH1cblxuICAgICZfX2NvbnRlbnQge1xuICAgICAgICBtYXJnaW4tdG9wOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZmxleDogMSAxIGF1dG87XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICB9XG5cbiAgICAmX19pbnB1dC1sYWJlbCB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgIHBhZGRpbmctbGVmdDogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMjBweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjFweDtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuXG4gICAgICAgICYtLW10LTgge1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2lucHV0LWxhYmVsLXRleHQge1xuICAgICAgICBtYXJnaW4tcmlnaHQ6IGNhbGMoNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgfVxuXG4gICAgJl9fYWRkcmVzcy1yb3cge1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICAgIGdhcDogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICAgICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgICZfX2FkZHJlc3MtaWNvbiB7XG4gICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICB9XG5cbiAgICAmX19maWF0LXJvdyB7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBiYXNlbGluZTtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC13cmFwOiB3cmFwO1xuICAgICAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBwYWRkaW5nOiAwIGNhbGMoMTJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX19maWF0LXByaWNlIHtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmbGV4OiAwIDEgYXV0bztcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjFweDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMjBweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgcGFkZGluZzogMDtcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICB9XG5cbiAgICAmX19hbW91bnQtaW5saW5lLWVycm9ycyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgfVxuXG4gICAgJl9fYW1vdW50LWlubGluZS1lcnJvciB7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGVycm9yO1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxMnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMDJlbTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMThweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgbWF4LXdpZHRoOiAxMDAlO1xuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICB9XG5cbiAgICAmX193aXRoZHJhdy1jdGEge1xuICAgICAgICAmLS1ibG9ja2VkIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBvcGFjaXR5OiAwLjQ1O1xuICAgICAgICAgICAgcG9pbnRlci1ldmVudHM6IGF1dG87XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19hZGRyZXNzLWNvbCB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgICAgIGdhcDogY2FsYyg0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICB9XG5cbiAgICAmX19hZGRyZXNzLW5hbWUge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMjBweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjFweDtcbiAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBtYXJnaW46IDA7XG5cbiAgICAgICAgJi0temVsZi1uYW1lIHtcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lVGl0bGVGYW1pbHk7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICAgICAgZm9udC1zaXplOiBjYWxjKDE0cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMjBweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xcHg7XG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fYWRkcmVzcy1ib29rIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBtYXJnaW4tdG9wOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gICAgfVxuXG4gICAgJl9fYWRkcmVzcy1ib29rLWxhYmVsIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxMXB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuOHB4O1xuICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIG1hcmdpbjogY2FsYyg0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSAwIDAgY2FsYyg0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgICAgICBmbGV4LXNocmluazogMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3JlY2VudC1jYXJkIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIHBhZGRpbmc6IGNhbGMoMTBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpIGNhbGMoMTRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgICAgICBib3JkZXI6IDEuNXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAwLjJzIGVhc2UsIGJhY2tncm91bmQgMC4ycyBlYXNlO1xuXG4gICAgICAgICYtLXNlbGVjdGVkIHtcbiAgICAgICAgICAgIGJvcmRlci1jb2xvcjogdmFyaWFibGVzLiRwcmltYXJ5Q29sb3I7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6aG92ZXI6bm90KCYtLXNlbGVjdGVkKSB7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3JlY2VudC1hdmF0YXIge1xuICAgICAgICBmbGV4LXNocmluazogMDtcbiAgICAgICAgd2lkdGg6IGNhbGMoMzZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBoZWlnaHQ6IGNhbGMoMzZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVUaXRsZUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEycHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fcmVjZW50LWluZm8ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBnYXA6IGNhbGMoMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGZsZXg6IDEgMSAwO1xuICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgfVxuXG4gICAgJl9fcmVjZW50LW5hbWUge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZVRpdGxlRmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTNweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDE4cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC41cHg7XG4gICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgfVxuXG4gICAgJl9fcmVjZW50LWFkZHJlc3Mge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZU1vbm9zcGFjZUZhbWlseTtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEwcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICB9XG5cbiAgICAmX19yZWNlbnQtdGltZSB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEwcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjJweDtcbiAgICB9XG5cbiAgICAmX19yZWNlbnQtY2hlY2sge1xuICAgICAgICBmbGV4LXNocmluazogMDtcbiAgICAgICAgZmlsbDogdmFyaWFibGVzLiRjb3JyZWN0O1xuICAgIH1cblxuICAgIC8qKiBSZWZlcmVuY2Utc3R5bGUgRnJvbTogdGFnIChwcmltYXJ5KSArIG1pZGRsZS1tYXNrZWQgYWRkcmVzcyAoc2Vjb25kYXJ5KSwgc2luZ2xlIHBpbGwgKi9cbiAgICAmX19mcm9tLXN0YWNrZWQge1xuICAgICAgICBhbGlnbi1pdGVtczogc3RyZXRjaDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogY2FsYyg0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDU2cHg7XG4gICAgICAgIHBhZGRpbmc6IGNhbGMoMTBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpIGNhbGMoMThweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB0cmFuc2l0aW9uOiBib3JkZXItY29sb3IgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgJl9fZnJvbS1zdGFja2VkLXRhZyB7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVUaXRsZUZhbWlseTtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEzcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4wNmVtO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygxOHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgIH1cblxuICAgICZfX2Zyb20tc3RhY2tlZC1hZGRyZXNzIHtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZU1vbm9zcGFjZUZhbWlseTtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDExcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4wMmVtO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygxNnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgIH1cblxuICAgICZfX2FkZHJlc3MtdXNlZCB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDExcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygxNnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICB9XG59XG5cbi56ZWxmLW9iamVjdC1wcmV2aWV3IHtcbiAgICBtYXgtd2lkdGg6IHZhcigtLXpucy1jYXJkLXdpZHRoLCA0ODRweCk7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgYm9yZGVyLXJhZGl1czogMTRweDtcbiAgICBwYWRkaW5nOiBjYWxjKDEwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBjYWxjKDE0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJGNvcnJlY3Q7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgZ2FwOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuXG4gICAgJl9fc3RhdHVzIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA1cHg7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDExcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4wNmVtO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRjb3JyZWN0O1xuICAgICAgICBtYXJnaW46IDA7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kY29ycmVjdDtcbiAgICAgICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fcm93IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDEwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgJl9fYXZhdGFyIHtcbiAgICAgICAgd2lkdGg6IGNhbGMoMzZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBoZWlnaHQ6IGNhbGMoMzZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBtaW4td2lkdGg6IGNhbGMoMzZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAzNnB4O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVUaXRsZUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEzcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgICAgICBmbGV4LXNocmluazogMDtcbiAgICB9XG5cbiAgICAmX19kZXRhaWxzIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiAycHg7XG4gICAgICAgIGZsZXgtZ3JvdzogMTtcbiAgICAgICAgbWluLXdpZHRoOiAwO1xuICAgIH1cblxuICAgICZfX25hbWUge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZVRpdGxlRmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDE4cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgIH1cblxuICAgICZfX2FkZHJlc3Mtc2hvcnQge1xuICAgICAgICBmb250LWZhbWlseTogbW9ub3NwYWNlO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTFweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgfVxuXG4gICAgJl9fY2hlY2sge1xuICAgICAgICBmbGV4LXNocmluazogMDtcbiAgICAgICAgZmlsbDogdmFyaWFibGVzLiRjb3JyZWN0O1xuICAgIH1cblxuICAgICZfX2ljb24tYnViYmxlIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk7XG4gICAgICAgIGhlaWdodDogY2FsYygzMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHdpZHRoOiBjYWxjKDMycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNDhweDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kY29ycmVjdDtcbiAgICAgICAgfVxuXG4gICAgICAgICYtLWVycm9yIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kZXJyb3I7XG4gICAgICAgICAgICBjb2xvcjogd2hpdGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19ob3Jpem9udGFsLXJ1bGUge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcbiAgICB9XG5cbiAgICAmX19pbnN0cnVjdGlvbnMge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMjBweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjFweDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICB9XG5cbiAgICAmX19lcnJvci1tZXNzYWdlIHtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3I7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBtYXJnaW46IGNhbGMoMTZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpIDA7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
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
//# sourceMappingURL=src_app_send-transaction_send-transaction_component_ts.js.map