"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_send-confirm_send-confirm_component_ts"],{

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

/***/ 13344
/*!********************************************************!*\
  !*** ./src/app/send-confirm/send-confirm.component.ts ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SendConfirmComponent: () => (/* binding */ SendConfirmComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ethers */ 71932);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ethers */ 29929);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 33900);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/progress-spinner */ 41134);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 34487);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var app_core_utils_same_wallet_address_util__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! app/core/utils/same-wallet-address.util */ 40693);
/* harmony import */ var app_core_utils_user_facing_transaction_error_util__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! app/core/utils/user-facing-transaction-error.util */ 50276);
/* harmony import */ var app_pipes_address_mask_pipe__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! app/pipes/address-mask.pipe */ 29011);
/* harmony import */ var app_zelf_loader_zelf_loader_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! app/zelf-loader/zelf-loader.component */ 40152);
/* harmony import */ var app_stellar_send_summary_stellar_send_summary_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! app/stellar-send-summary/stellar-send-summary.component */ 46524);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var app_asset_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! app/asset.service */ 25931);
/* harmony import */ var app_services_bitcoin_service__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! app/services/bitcoin.service */ 28808);
/* harmony import */ var app_services_blockdag_service__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! app/services/blockdag.service */ 29205);
/* harmony import */ var app_services_blockchain_transactions_service__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! app/services/blockchain-transactions.service */ 56122);
/* harmony import */ var app_chrome_service__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! app/chrome.service */ 85043);
/* harmony import */ var app_services_network_service__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! app/services/network.service */ 32404);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @angular/material/snack-bar */ 3347);
/* harmony import */ var app_tags_service__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! app/tags.service */ 73768);
/* harmony import */ var app_transaction_service__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! app/transaction.service */ 65443);
/* harmony import */ var app_vault_service__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! app/vault.service */ 19519);
/* harmony import */ var app_wallet_service__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! app/wallet.service */ 69556);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! @angular/material/button */ 69885);
































const _c0 = a0 => ({
  "zelf-action-row--clickable": a0
});
const _c1 = a0 => ({
  "send-confirm__value--error": a0
});
const _c2 = a0 => ({
  "zelf-input--error": a0
});
const _c3 = a0 => ({
  remaining: a0
});
const _c4 = a0 => ({
  "zelf-action-row--selected": a0
});
const _c5 = (a0, a1) => ({
  sats: a0,
  feeAmountUSD: a1,
  time: "< 30"
});
const _c6 = (a0, a1) => ({
  sats: a0,
  feeAmountUSD: a1,
  time: "~ 30"
});
const _c7 = (a0, a1) => ({
  sats: a0,
  feeAmountUSD: a1,
  time: "> 30"
});
function SendConfirmComponent_div_0_ng_container_1_div_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](0, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate1"](" \uD83D\uDD12 ", t_r3("send.private_transaction"), " ");
  }
}
function SendConfirmComponent_div_0_ng_container_1_form_12_div_14_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipe"](2, "uppercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipeBind1"](2, 1, ctx_r1.transactionData.senderFullTagName));
  }
}
function SendConfirmComponent_div_0_ng_container_1_form_12_div_14_ng_container_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipe"](2, "uppercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipeBind1"](2, 1, ctx_r1.transactionData.receiverFullTagName));
  }
}
function SendConfirmComponent_div_0_ng_container_1_form_12_div_14_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipe"](2, "uppercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](4).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipeBind1"](2, 1, t_r3("common.unknown")));
  }
}
function SendConfirmComponent_div_0_ng_container_1_form_12_div_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplate"](1, SendConfirmComponent_div_0_ng_container_1_form_12_div_14_div_1_Template, 3, 3, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](2, "svg", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelement"](3, "path", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](4, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplate"](5, SendConfirmComponent_div_0_ng_container_1_form_12_div_14_ng_container_5_Template, 3, 3, "ng-container", 6)(6, SendConfirmComponent_div_0_ng_container_1_form_12_div_14_ng_container_6_Template, 3, 3, "ng-container", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngIf", ctx_r1.transactionData.sender.tagName);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngIf", ctx_r1.transactionData.receiver.tagName);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngIf", !ctx_r1.transactionData.receiver.tagName);
  }
}
function SendConfirmComponent_div_0_ng_container_1_form_12_ng_container_49_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](1, "svg", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelement"](2, "path", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementContainerEnd"]();
  }
}
function SendConfirmComponent_div_0_ng_container_1_form_12_stellar_send_summary_56_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelement"](0, "stellar-send-summary", 50);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("breakdown", ctx_r1.stellarFeeBreakdown);
  }
}
function SendConfirmComponent_div_0_ng_container_1_form_12_div_57_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementContainer"](0);
  }
}
function SendConfirmComponent_div_0_ng_container_1_form_12_div_57_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](0, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplate"](1, SendConfirmComponent_div_0_ng_container_1_form_12_div_57_ng_container_1_Template, 1, 0, "ng-container", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"]();
    const cross_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵreference"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngTemplateOutlet", cross_r5);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](t_r3("errors.insufficient_funds"));
  }
}
function SendConfirmComponent_div_0_ng_container_1_form_12_div_58_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementContainer"](0);
  }
}
function SendConfirmComponent_div_0_ng_container_1_form_12_div_58_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](0, "div", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelement"](1, "input", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](2, "label", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplate"](4, SendConfirmComponent_div_0_ng_container_1_form_12_div_58_ng_container_4_Template, 1, 0, "ng-container", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    let tmp_9_0;
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](3).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"]();
    const toggleButton_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵreference"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpureFunction1"](4, _c2, ((tmp_9_0 = ctx_r1.form.get("password")) == null ? null : tmp_9_0.dirty) && ((tmp_9_0 = ctx_r1.form.get("password")) == null ? null : tmp_9_0.errors)));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("type", ctx_r1.showPassword ? "text" : "password");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](t_r3("common.password"));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngTemplateOutlet", toggleButton_r6);
  }
}
function SendConfirmComponent_div_0_ng_container_1_form_12_div_59_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementContainer"](0);
  }
}
function SendConfirmComponent_div_0_ng_container_1_form_12_div_59_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](0, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplate"](1, SendConfirmComponent_div_0_ng_container_1_form_12_div_59_ng_container_1_Template, 1, 0, "ng-container", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](3).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"]();
    const cross_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵreference"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngTemplateOutlet", cross_r5);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](t_r3("errors.invalid_password", _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpureFunction1"](2, _c3, ctx_r1.remainingAttempts)));
  }
}
function SendConfirmComponent_div_0_ng_container_1_form_12_button_61_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](0, "button", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵlistener"]("click", function SendConfirmComponent_div_0_ng_container_1_form_12_button_61_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵresetView"](ctx_r1.goToBiometrics());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](3).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("disabled", !ctx_r1.hasBalance || ctx_r1.sending || !ctx_r1.hasCredentials || ctx_r1.stellarSendBlocked);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate1"](" ", t_r3("common.verify"), " ");
  }
}
function SendConfirmComponent_div_0_ng_container_1_form_12_button_62_mat_spinner_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelement"](0, "mat-spinner", 59);
  }
}
function SendConfirmComponent_div_0_ng_container_1_form_12_button_62_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](0, "button", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵlistener"]("click", function SendConfirmComponent_div_0_ng_container_1_form_12_button_62_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵrestoreView"](_r8);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵresetView"](ctx_r1.confirmTransaction());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplate"](2, SendConfirmComponent_div_0_ng_container_1_form_12_button_62_mat_spinner_2_Template, 1, 0, "mat-spinner", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](3).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("disabled", !ctx_r1.hasBalance || ctx_r1.sending || !ctx_r1.hasCredentials || ctx_r1.stellarSendBlocked);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate1"](" ", t_r3("common.confirm"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngIf", ctx_r1.sending);
  }
}
function SendConfirmComponent_div_0_ng_container_1_form_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](0, "form", 19)(1, "div", 20)(2, "div", 21)(3, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](5, "div", 23)(6, "h2", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipe"](8, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](9, "p", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](11, "p", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipe"](13, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplate"](14, SendConfirmComponent_div_0_ng_container_1_form_12_div_14_Template, 7, 3, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](15, "div", 27)(16, "div", 28)(17, "div", 29)(18, "p", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](19);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](20, "p", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](21);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipe"](22, "addressMask");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](23, "div", 29)(24, "p", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](25);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](26, "p", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](27);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](28, "div", 29)(29, "p", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](30);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](31, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](32);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](33, "div", 29)(34, "p", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](35);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](36, "p", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](37);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](38, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵlistener"]("click", function SendConfirmComponent_div_0_ng_container_1_form_12_Template_div_click_38_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵresetView"](ctx_r1.transactionData.network === "bitcoin" && ctx_r1.openFeeInfo() || null);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](39, "p", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](40);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](41, "div", 34)(42, "p", 35)(43, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](44);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipe"](45, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](46, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](47);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipe"](48, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplate"](49, SendConfirmComponent_div_0_ng_container_1_form_12_ng_container_49_Template, 3, 0, "ng-container", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](50, "div", 29)(51, "p", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](52);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](53, "p", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](54);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipe"](55, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplate"](56, SendConfirmComponent_div_0_ng_container_1_form_12_stellar_send_summary_56_Template, 1, 1, "stellar-send-summary", 38)(57, SendConfirmComponent_div_0_ng_container_1_form_12_div_57_Template, 4, 2, "div", 39)(58, SendConfirmComponent_div_0_ng_container_1_form_12_div_58_Template, 5, 6, "div", 40)(59, SendConfirmComponent_div_0_ng_container_1_form_12_div_59_Template, 4, 4, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](60, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplate"](61, SendConfirmComponent_div_0_ng_container_1_form_12_button_61_Template, 2, 2, "button", 42)(62, SendConfirmComponent_div_0_ng_container_1_form_12_button_62_Template, 3, 3, "button", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("formGroup", ctx_r1.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](t_r3("common.amount"));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipeBind2"](8, 29, ctx_r1.transactionData.amount, "1.1-8"));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](ctx_r1.transactionData.symbol);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate1"]("~", _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipeBind4"](13, 32, ctx_r1.fiatPrice, "USD", "symbol", "1.2-8"));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngIf", ctx_r1.transactionData.sender);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](t_r3("common.from"));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipeBind1"](22, 37, ctx_r1.transactionData.sender.address));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](t_r3("common.withdrawal_network"));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](ctx_r1.transactionData.tokenType);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](t_r3("common.address"));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](ctx_r1.transactionData.receiver.address);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](t_r3("common.coin"));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](ctx_r1.transactionData.symbol);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpureFunction1"](52, _c0, ctx_r1.transactionData.network === "bitcoin"));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](t_r3("common.fee"));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipeBind2"](45, 39, ctx_r1.transactionData.fee, "1.2-8"), " ", ctx_r1.networkCurrency);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate1"]("~", _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipeBind4"](48, 42, ctx_r1.fiatFeePrice, "USD", "symbol", "1.2-8"));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngIf", ctx_r1.transactionData.network === "bitcoin");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](t_r3("common.total"));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpureFunction1"](54, _c1, !ctx_r1.hasBalance));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipeBind4"](55, 47, ctx_r1.total, "USD", "symbol", "1.2-8"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngIf", ctx_r1.transactionData.network === "stellar");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngIf", !ctx_r1.hasBalance);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngIf", !ctx_r1.passwordSet);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngIf", ctx_r1.passwordError);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngIf", ctx_r1.requiresBiometrics);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngIf", !ctx_r1.requiresBiometrics);
  }
}
function SendConfirmComponent_div_0_ng_container_1_ng_container_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](1, "div", 60)(2, "div", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵlistener"]("click", function SendConfirmComponent_div_0_ng_container_1_ng_container_13_Template_div_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵrestoreView"](_r9);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵresetView"](ctx_r1.selectFeeRate(ctx_r1.feeRates.fastestFee));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](3, "div", 62)(4, "p", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](6, "p", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipe"](8, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](9, "div", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵlistener"]("click", function SendConfirmComponent_div_0_ng_container_1_ng_container_13_Template_div_click_9_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵrestoreView"](_r9);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵresetView"](ctx_r1.selectFeeRate(ctx_r1.feeRates.halfHourFee));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](10, "div", 62)(11, "p", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](13, "p", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipe"](15, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](16, "div", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵlistener"]("click", function SendConfirmComponent_div_0_ng_container_1_ng_container_13_Template_div_click_16_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵrestoreView"](_r9);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵresetView"](ctx_r1.selectFeeRate(ctx_r1.feeRates.economyFee));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](17, "div", 62)(18, "p", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](19);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](20, "p", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](21);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipe"](22, "currency");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpureFunction1"](24, _c4, ctx_r1.selectedFeeRate === ctx_r1.feeRates.fastestFee));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](t_r3("send.fastest"));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate1"](" ", t_r3("send.upto_sats", _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpureFunction2"](26, _c5, ctx_r1.feeRates.fastestFee, _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipeBind4"](8, 9, ctx_r1.fiatFastestFee, "USD", "symbol", "1.2"))), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpureFunction1"](29, _c4, ctx_r1.selectedFeeRate === ctx_r1.feeRates.halfHourFee));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](t_r3("send.average"));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate1"](" ", t_r3("send.upto_sats", _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpureFunction2"](31, _c6, ctx_r1.feeRates.halfHourFee, _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipeBind4"](15, 14, ctx_r1.fiatHalfHourFee, "USD", "symbol", "1.2"))), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpureFunction1"](34, _c4, ctx_r1.selectedFeeRate === ctx_r1.feeRates.economyFee));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](t_r3("send.economical"));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate1"](" ", t_r3("send.upto_sats", _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpureFunction2"](36, _c7, ctx_r1.feeRates.economyFee, _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵpipeBind4"](22, 19, ctx_r1.fiatEconomyFee, "USD", "symbol", "1.2"))), " ");
  }
}
function SendConfirmComponent_div_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](1, "div", 7)(2, "div", 8)(3, "button", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵlistener"]("click", function SendConfirmComponent_div_0_ng_container_1_Template_button_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵresetView"](ctx_r1.goBack());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](4, "svg", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelement"](5, "path", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](6, "div", 12)(7, "div", 13)(8, "p", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplate"](10, SendConfirmComponent_div_0_ng_container_1_div_10_Template, 2, 1, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelement"](11, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplate"](12, SendConfirmComponent_div_0_ng_container_1_form_12_Template, 63, 56, "form", 17)(13, SendConfirmComponent_div_0_ng_container_1_ng_container_13_Template, 23, 39, "ng-container", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtextInterpolate"](ctx_r1.showFeeInfo ? t_r3("send.transaction_settings") : t_r3("common.transfer"));
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngIf", ctx_r1.isStealthMode);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngIf", !ctx_r1.showFeeInfo);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngIf", ctx_r1.showFeeInfo);
  }
}
function SendConfirmComponent_div_0_zelf_loader_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelement"](0, "zelf-loader");
  }
}
function SendConfirmComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplate"](1, SendConfirmComponent_div_0_ng_container_1_Template, 14, 4, "ng-container", 6)(2, SendConfirmComponent_div_0_zelf_loader_2_Template, 1, 0, "zelf-loader", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngIf", !ctx_r1.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngIf", ctx_r1.loading);
  }
}
function SendConfirmComponent_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](0, "svg", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelement"](1, "path", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
  }
}
function SendConfirmComponent_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](0, "svg", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelement"](1, "path", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
  }
}
function SendConfirmComponent_ng_template_5_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementContainer"](0);
  }
}
function SendConfirmComponent_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](0, "button", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵlistener"]("click", function SendConfirmComponent_ng_template_5_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵrestoreView"](_r10);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵresetView"](ctx_r1.toggleShowPassword());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplate"](1, SendConfirmComponent_ng_template_5_ng_container_1_Template, 1, 0, "ng-container", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵnextContext"]();
    const openEye_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵreference"](2);
    const closedEye_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵreference"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵproperty"]("ngTemplateOutlet", ctx_r1.showPassword ? openEye_r11 : closedEye_r12);
  }
}
function SendConfirmComponent_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_18__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementStart"](0, "svg", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelement"](1, "path", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵelementEnd"]();
  }
}
class SendConfirmComponent {
  _activatedRoute;
  _assetService;
  _bitcoinService;
  _blockDAGService;
  _blockchainTransactionsService;
  _changeDetectorRef;
  _chromeService;
  _formBuilder;
  _networkService;
  _router;
  _snackBar;
  _tagsService;
  _transactionService;
  _translocoService;
  _vaultService;
  _walletService;
  _mnemonics = "";
  _password = "";
  _interval;
  _intervalTime = 30000;
  _skipPriceFetch = false;
  unsubcriber$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__.Subject();
  feeRates = {
    fastestFee: 0,
    halfHourFee: 0,
    hourFee: 0,
    economyFee: 0,
    minimumFee: 0
  };
  availableNetworks = [{
    id: "avalanche",
    name: "Avalanche",
    symbol: "AVAX"
  }, {
    id: "binance",
    name: "Binance",
    symbol: "BNB"
  }, {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC"
  }, {
    id: "blockdag",
    name: "BlockDAG",
    symbol: "BDAG"
  }, {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH"
  }, {
    id: "polygon",
    name: "Polygon",
    symbol: "POL"
  }, {
    id: "solana",
    name: "Solana",
    symbol: "SOL"
  }, {
    id: "stellar",
    name: "Stellar",
    symbol: "XLM"
  }, {
    id: "sui",
    name: "Sui",
    symbol: "SUI"
  }, {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT"
  }, {
    id: "kusama",
    name: "Kusama",
    symbol: "KSM"
  }];
  form;
  isNativeAsset = false;
  loading;
  networkPrice = 0;
  networkToken;
  passwordError = false;
  passwordSet = true;
  price = 0;
  remainingAttempts = 0;
  requiresBiometrics = false;
  selectedFeeRate = 0;
  sending = false;
  showFeeInfo = false;
  showPassword = false;
  transactionData;
  wallet;
  isStealthMode = false;
  /** Stellar fee preview (native + classic) for confirm UI. */
  stellarFeeBreakdown = null;
  constructor(_activatedRoute, _assetService, _bitcoinService, _blockDAGService, _blockchainTransactionsService, _changeDetectorRef, _chromeService, _formBuilder, _networkService, _router, _snackBar, _tagsService, _transactionService, _translocoService, _vaultService, _walletService) {
    this._activatedRoute = _activatedRoute;
    this._assetService = _assetService;
    this._bitcoinService = _bitcoinService;
    this._blockDAGService = _blockDAGService;
    this._blockchainTransactionsService = _blockchainTransactionsService;
    this._changeDetectorRef = _changeDetectorRef;
    this._chromeService = _chromeService;
    this._formBuilder = _formBuilder;
    this._networkService = _networkService;
    this._router = _router;
    this._snackBar = _snackBar;
    this._tagsService = _tagsService;
    this._transactionService = _transactionService;
    this._translocoService = _translocoService;
    this._vaultService = _vaultService;
    this._walletService = _walletService;
    this.loading = true;
    this.remainingAttempts = this._vaultService.remainingAttempts;
    this._mnemonics = "";
    this._password = this._vaultService.password;
    this._vaultService.mnemonic = "";
    this._vaultService.password = "";
    if (!this._password || !this._password.trim()) return;
    this.passwordSet = !!this._password;
  }
  /**
   * Defense in depth: covers manual navigation to /send/confirmation with
   * stale in-memory data where sender and receiver resolve to the same wallet.
   */
  _isSelfTransfer() {
    return (0,app_core_utils_same_wallet_address_util__WEBPACK_IMPORTED_MODULE_12__.areSendAddressesSame)(this.transactionData?.sender?.address, this.transactionData?.receiver?.address, this.transactionData);
  }
  ngOnInit() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this.transactionData = yield _this._transactionService.getCurrentTransactionData();
      if (_this.transactionData && _this.transactionData.hasTransactionData && _this.transactionData.hasCompletePaymentData) {
        if (_this._isSelfTransfer()) {
          _this.openErrorSnackBar("errors.same_address");
          _this._router.navigate(["/send/transaction"]);
          _this.loading = false;
          return;
        }
        _this.isStealthMode = localStorage.getItem("isStealthMode") === "true";
        yield _this._initTransactionData();
        // Check if wallet is password-less
        yield _this._checkPasswordlessWallet();
        // Auto-send flow
        const decrypted = yield _this._decryptMnemonics();
        if (decrypted && _this._password === "NO_PASSWORD_PLACEHOLDER") {
          yield _this.confirmTransaction();
        }
        _this.loading = false;
        return;
      }
      _this._transactionService.transactionData$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.takeUntil)(_this.unsubcriber$)).subscribe(/*#__PURE__*/function () {
        var _ref = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (transactionData) {
          _this.transactionData = transactionData;
          if (!_this.transactionData || !_this.transactionData.hasTransactionData) {
            _this._router.navigate(["/send"]);
            return;
          }
          if (!_this.transactionData.hasCompletePaymentData) {
            _this._router.navigate(["/send/transaction"]);
            return;
          }
          if (_this._isSelfTransfer()) {
            _this.openErrorSnackBar("errors.same_address");
            _this._router.navigate(["/send/transaction"]);
            _this.loading = false;
            return;
          }
          _this.isStealthMode = localStorage.getItem("isStealthMode") === "true";
          yield _this._initTransactionData();
          // Check if wallet is password-less
          yield _this._checkPasswordlessWallet();
          // Auto-send flow
          const decrypted = yield _this._decryptMnemonics();
          if (decrypted && _this._password === "NO_PASSWORD_PLACEHOLDER") {
            yield _this.confirmTransaction();
          }
          _this.loading = false;
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    })();
  }
  ngOnDestroy() {
    clearInterval(this._interval);
    this.unsubcriber$.next();
    this.unsubcriber$.complete();
  }
  get fiatEconomyFee() {
    const calculatedFee = this._bitcoinService.calculateBitcoinTransactionFee(this.feeRates.economyFee, this.networkPrice);
    return calculatedFee.fiatFee;
  }
  get fiatFastestFee() {
    const calculatedFee = this._bitcoinService.calculateBitcoinTransactionFee(this.feeRates.fastestFee, this.networkPrice);
    return calculatedFee.fiatFee;
  }
  get fiatFeePrice() {
    const amount = Number(this.transactionData.fee) || 0;
    const fiatPrice = this.networkPrice || 0;
    return amount * fiatPrice || Number(this.transactionData.fiatFee) || 0;
  }
  get fiatHalfHourFee() {
    const calculatedFee = this._bitcoinService.calculateBitcoinTransactionFee(this.feeRates.halfHourFee, this.networkPrice);
    return calculatedFee.fiatFee;
  }
  get fiatPrice() {
    const amount = Number(this.transactionData.amount) || 0;
    const fiatPrice = this.price || 0;
    return amount * fiatPrice || amount * Number(this.transactionData.token.price || 0) || 0;
  }
  get hasBalance() {
    const tokenBalance = Number(this.transactionData.token.balance) || 0;
    const tokenAmount = Number(this.transactionData.token.amount) || 0;
    const sendAmount = Number(this.transactionData.amount) || 0;
    const feeAmount = Number(this.transactionData.fee) || 0;
    const canCoverTokenBalance = tokenBalance > 0 && sendAmount <= tokenBalance;
    if (this.isNativeAsset) {
      const canCoverTotal = sendAmount + feeAmount <= tokenAmount;
      return canCoverTokenBalance && canCoverTotal;
    }
    const canCoverNetworkFee = this.networkToken?.balance > 0 && feeAmount <= Number(this.networkToken?.balance);
    return canCoverTokenBalance && canCoverNetworkFee;
  }
  /** Blocks confirm when Stellar preview reports an invalid or impossible send. */
  get stellarSendBlocked() {
    if (this.transactionData?.network !== "stellar") return false;
    const p = this.stellarFeeBreakdown?.preview;
    if (!p) return false;
    if (p.amountBelowMinimum) return true;
    return p.warningKeys.some(k => k === "classic_fund_first" || k === "classic_trustline" || k === "invalid_amount");
  }
  get networkCurrency() {
    return this._networkService.getNetworkSymbol(this.transactionData.network);
  }
  get total() {
    return this.fiatPrice + this.fiatFeePrice || 0;
  }
  get hasCredentials() {
    // For password-less wallets, credentials are ready if passwordSet is true
    // For password wallets, credentials are ready if password has been entered
    return this.passwordSet || !!this.form.get("password")?.value;
  }
  _calculateTransactionFee() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const normalizedAmount = Number(String(_this2.transactionData.amount || "0").replace(",", "."));
        const tokenSymbol = _this2.transactionData.token?.symbol;
        let tokenAddress = _this2.transactionData.token?.address_token;
        const isNativeToken = ["AVAX", "ETH", "BNB", "MATIC", "BDAG", "XLM", "DOT", "KSM"].includes(tokenSymbol);
        if (!tokenAddress && _this2.wallet && _this2.wallet.publicData?.ethAddress && !isNativeToken) {
          try {
            // Only fetch data for the specific network/token being sent, not all networks
            const addressData = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.firstValueFrom)(_this2._blockchainTransactionsService.getAddressDataByToken(_this2.wallet, tokenSymbol));
            const foundToken = addressData?.[_this2.transactionData.network]?.data?.tokenHoldings?.tokens.find(t => t.symbol === tokenSymbol);
            if (foundToken) tokenAddress = foundToken.address;
          } catch (error) {
            console.error("Error fetching token data from API:", error);
          }
        }
        const feeParams = {
          network: _this2.transactionData.network,
          receiverAddress: _this2.transactionData.receiver.address,
          amount: normalizedAmount,
          tokenType: _this2.transactionData.tokenType,
          tokenAddress: tokenAddress,
          tokenDecimals: _this2.transactionData.token.decimals,
          tokenPrice: +_this2.transactionData.token.price || 0,
          selectedFeeRate: _this2.selectedFeeRate,
          senderAddress: _this2.transactionData.sender.address
        };
        const feeEstimate = yield _this2._blockchainTransactionsService.calculateTransactionFees(feeParams);
        _this2.transactionData.fee = feeEstimate.fee;
        _this2.transactionData.fiatFee = feeEstimate.fiatFee;
        _this2.transactionData.total = feeEstimate.total;
        if (feeEstimate.networkPrice !== undefined) {
          _this2.networkPrice = feeEstimate.networkPrice;
        }
        _this2.stellarFeeBreakdown = _this2.transactionData.network === "stellar" && feeEstimate.stellar ? feeEstimate.stellar : null;
        yield _this2._transactionService.setCurrentTransactionData(_this2.transactionData);
      } catch (error) {
        console.error("Error calculating transaction fee:", error);
        if (_this2.transactionData?.network === "stellar") {
          _this2.stellarFeeBreakdown = null;
        }
      }
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
        const secret = yield _this3._vaultService.decryptMessage(encryptedMessage, privateKeyArmoured, passphrase);
        _this3.passwordSet = true;
        return secret;
      } catch (error) {
        _this3.wallet = yield _this3._walletService.getCurrentWallet();
        _this3.remainingAttempts = _this3._vaultService.remainingAttempts;
        _this3.passwordSet = false;
        _this3._changeDetectorRef.detectChanges();
        if (!_this3.wallet?.pgp?.encryptedMessage || !_this3.wallet?.pgp?.privateKey) {
          _this3._mnemonics = "";
          _this3._password = "";
          _this3.passwordError = false;
          _this3.requiresBiometrics = true;
        } else {
          _this3.passwordError = true;
        }
        throw error;
      }
    })();
  }
  _decryptMnemonics() {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const biometricsRequired = yield _this4._vaultService.biometricsRequired();
      if (!_this4.wallet?.pgp?.encryptedMessage || !_this4.wallet?.pgp?.privateKey || biometricsRequired) {
        const isPasswordless = String(_this4.wallet?.publicData?.hasPassword) === "false";
        _this4.passwordSet = isPasswordless;
        _this4.requiresBiometrics = true;
        return false;
      }
      _this4.requiresBiometrics = false;
      if (!_this4._password && !_this4.form.get("password")?.value && _this4.passwordSet) return false;
      try {
        const raw = yield _this4._decryptMessage();
        if (!raw) return false;
        const secret = JSON.parse(raw);
        _this4._mnemonics = secret.mnemonic?.trim()?.toLowerCase();
        return true;
      } catch (e) {
        console.error(e);
        return false;
      }
    })();
  }
  _fetchTokenPrice() {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this5._skipPriceFetch) return;
      try {
        if (_this5.transactionData.isBDAGToken) {
          _this5.price = yield _this5._blockDAGService.getCurrentPrice();
          return;
        }
        const response = yield _this5._assetService.fetchAssetPrice(_this5.transactionData.symbol);
        if (!response?.data || !response?.data?.length) return;
        _this5.price = response.data[0].open;
      } catch (error) {
        // Don't block the flow if price fetching fails
        console.warn("Price fetch failed (non-blocking):", error?.message || error);
        if (error?.status === 400 || error?.status === 404) _this5._skipPriceFetch = true;
        // Silently continue - price is optional
      }
    })();
  }
  _getNetworkToken() {
    var _this6 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const network = _this6.transactionData.network?.toLowerCase();
      const sessionTokens = yield _this6._assetService.loadTokensFromSession();
      // Check if we're sending a native token (doesn't need token contract address)
      const isNativeToken = ["AVAX", "ETH", "BNB", "MATIC", "BDAG", "BTC", "SOL", "SUI", "XLM", "DOT", "KSM"].includes(_this6.transactionData.token?.symbol || "");
      if (!sessionTokens || sessionTokens.length === 0) {
        if (!_this6.wallet) {
          _this6.networkToken = null;
          return;
        }
        // Skip fetching all network data for native tokens - we don't need it!
        if (!isNativeToken) {
          try {
            const response = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.firstValueFrom)(_this6._blockchainTransactionsService.getAddressData(_this6.wallet));
            const result = yield _this6._assetService.processTokensFromResponse(response);
            yield _this6._assetService.saveTokensToSession(result.tokens);
          } catch (error) {
            console.error("Error fetching tokens for network token balance:", error);
          }
        }
      }
      _this6.networkToken = yield _this6._networkService.getNetworkToken(network);
      _this6.isNativeAsset = isNativeToken || network === _this6.networkToken?.name?.toLowerCase() || network === "bitcoin";
      if (network !== "bitcoin" && network !== "blockdag") return;
      try {
        if (network === "blockdag") {
          _this6.networkPrice = yield _this6._blockDAGService.getCurrentPrice();
          return;
        }
        const response = yield _this6._assetService.fetchAssetPrice("BTC");
        if (response?.data?.length) _this6.networkPrice = response.data[0].open;
      } catch (error) {
        console.error("Error fetching network price:", error);
      }
    })();
  }
  _initForm() {
    this.form = this._formBuilder.group({
      password: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.required]]
    });
  }
  _initFeeRates() {
    var _this7 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this7.transactionData.network !== "bitcoin") return;
      _this7.feeRates = yield _this7._bitcoinService.getFeeRates();
      _this7.selectedFeeRate = _this7._bitcoinService.selectedFeeRate;
      if (_this7.selectedFeeRate === 0) {
        _this7.selectedFeeRate = _this7.feeRates.halfHourFee;
        return;
      }
      const keys = ["minimumFee", "economyFee", "hourFee", "halfHourFee", "fastestFee"];
      let lastFeeRate = 0;
      for (const key of keys) {
        const feeRate = _this7.feeRates[key];
        if (feeRate === _this7.selectedFeeRate) {
          _this7.selectedFeeRate = feeRate;
          break;
        } else if (feeRate > _this7.selectedFeeRate || key === "fastestFee") {
          _this7.selectedFeeRate = lastFeeRate;
          break;
        } else {
          lastFeeRate = feeRate;
        }
      }
    })();
  }
  _initInterval() {
    var _this8 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      clearInterval(_this8._interval);
      _this8._interval = setInterval(() => {
        _this8._calculateTransactionFee();
        _this8._fetchTokenPrice();
      }, _this8._intervalTime);
    })();
  }
  _initTransactionData() {
    var _this9 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this9.wallet = yield _this9._walletService.getCurrentWallet();
      _this9.transactionData = yield _this9._transactionService.getCurrentTransactionData();
      _this9._initInterval();
      _this9._initForm();
      yield _this9._initFeeRates();
      yield _this9._getNetworkToken();
      yield _this9._fetchTokenPrice();
      yield _this9._calculateTransactionFee();
      yield _this9._decryptMnemonics();
    })();
  }
  _checkPasswordlessWallet() {
    var _this0 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this0.wallet?.publicData) return;
      const publicData = _this0.wallet.publicData;
      // Check if wallet is password-less
      if (String(publicData.hasPassword) === "false") {
        // For password-less wallets, we need biometric verification
        // Set the placeholder password that will be used after biometrics
        _this0._password = "NO_PASSWORD_PLACEHOLDER";
        _this0._vaultService.password = "NO_PASSWORD_PLACEHOLDER";
        _this0._vaultService.securityType = "withoutPassword";
        // Mark as requiring biometrics (will redirect user to biometric verification)
        _this0.requiresBiometrics = true;
        _this0.passwordSet = true; // Keep password field hidden
        // Trigger change detection to update UI
        _this0._changeDetectorRef.detectChanges();
      } else {
        // Wallet has a password - show the password field
        _this0.passwordSet = false;
        _this0._changeDetectorRef.detectChanges();
      }
    })();
  }
  _redirectToBiometrics() {
    var _this1 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      // Only set password from form if it's not already set (e.g., for password-less wallets)
      if (!_this1._vaultService.password || _this1._vaultService.password.trim() === "") {
        _this1._vaultService.password = _this1.form.get("password")?.value || _this1._password;
      }
      yield _this1._tagsService.setTagName(_this1.transactionData.sender.tagName);
      yield _this1._tagsService.setFlow("unlock");
      _this1._router.navigate(["security/biometrics"], {
        queryParams: {
          return: "/send/confirmation"
        }
      });
    })();
  }
  _validateCredentials() {
    var _this10 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this10._password && !_this10.form.get("password")?.value) {
        _this10.openErrorSnackBar("errors.empty_password");
        return false;
      }
      if (_this10.requiresBiometrics) {
        yield _this10._redirectToBiometrics();
        return false;
      }
      if (_this10._mnemonics) return true;
      try {
        yield _this10._decryptMnemonics();
        if (_this10._mnemonics) return true;
      } catch (error) {
        if (error?.message === "expired") {
          yield _this10._redirectToBiometrics();
          return false;
        }
        _this10.openErrorSnackBar("errors.invalid_credentials");
        return false;
      }
      if (_this10.requiresBiometrics) return false;
      if (_this10._mnemonics) return true;
      _this10.openErrorSnackBar("errors.private_key_locked");
      return false;
    })();
  }
  confirmTransaction() {
    var _this11 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this11.sending) return;
      if (!(yield _this11._validateCredentials())) return;
      _this11.sending = true;
      try {
        const cleanMnemonic = _this11._mnemonics.trim().toLowerCase();
        const normalizedAmount = Number(String(_this11.transactionData.amount || "0").replace(",", "."));
        const transactionParams = {
          from: "",
          to: _this11.transactionData.receiver.address,
          value: String(normalizedAmount),
          network: _this11.transactionData.network,
          mnemonic: cleanMnemonic,
          tokenAddress: _this11.transactionData.token?.address_token || _this11.transactionData.token?.tokenAddress,
          tokenDecimals: _this11.transactionData.token?.decimals
        };
        // Standard transaction flow (Solana, EVM, Bitcoin, SUI)
        yield _this11._handleStandardTransaction(cleanMnemonic, normalizedAmount);
      } catch (error) {
        console.error("Send transaction failed", error);
        _this11.openErrorSnackBar((0,app_core_utils_user_facing_transaction_error_util__WEBPACK_IMPORTED_MODULE_13__.mapTransactionErrorToTranslationKey)(error));
        _this11.sending = false;
      } finally {
        _this11._mnemonics = "";
        _this11._password = "";
        if (!_this11.sending) {}
      }
    })();
  }
  _resetPasswordSet() {
    const isPasswordless = String(this.wallet?.publicData?.hasPassword) === "false";
    if (isPasswordless) {
      this._password = "NO_PASSWORD_PLACEHOLDER";
    } else {
      this.passwordSet = false;
    }
  }
  goBack() {
    var _this12 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this12.showFeeInfo) {
        _this12.showFeeInfo = false;
        return;
      }
      _this12._vaultService.password = "";
      _this12._vaultService.mnemonic = "";
      _this12.transactionData.fee = 0;
      _this12.transactionData.fiatFee = 0;
      _this12.transactionData.total = 0;
      yield _this12._transactionService.setCurrentTransactionData(_this12.transactionData);
      // Don't clear stealth mode flag here - let user keep their selection
      _this12._router.navigate(["/send/transaction"]);
    })();
  }
  goToBiometrics() {
    var _this13 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this13.hasCredentials || !_this13.wallet) return;
      yield _this13._redirectToBiometrics();
    })();
  }
  openErrorSnackBar(message) {
    this._snackBar.open(this._translocoService.translate(message), this._translocoService.translate("common.close"), {
      duration: 5000,
      panelClass: "zelf-snackbar",
      verticalPosition: "top"
    });
  }
  openFeeInfo() {
    this.showFeeInfo = true;
  }
  selectFeeRate(feeRate) {
    this.showFeeInfo = false;
    this.selectedFeeRate = feeRate;
    this._calculateTransactionFee();
  }
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  /**
   * Handle standard (non-stealth) transaction for all networks
   * @private
   */
  _handleStandardTransaction(cleanMnemonic, normalizedAmount) {
    var _this14 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const transactionParams = {
        from: "",
        to: _this14.transactionData.receiver.address,
        value: String(normalizedAmount),
        network: _this14.transactionData.network,
        mnemonic: cleanMnemonic,
        tokenAddress: _this14.transactionData.token?.address_token || _this14.transactionData.token?.tokenAddress,
        tokenDecimals: _this14.transactionData.token?.decimals,
        memo: _this14.transactionData.memo?.trim() || undefined
      };
      // EVM networks need private key instead of mnemonic
      if (["ethereum", "avalanche", "binance", "blockdag", "polygon"].includes(_this14.transactionData.network)) {
        if (!ethers__WEBPACK_IMPORTED_MODULE_1__.Mnemonic.isValidMnemonic(cleanMnemonic)) {
          _this14.openErrorSnackBar("errors.invalid_private_key");
          return;
        }
        const wallet = ethers__WEBPACK_IMPORTED_MODULE_2__.Wallet.fromPhrase(cleanMnemonic);
        transactionParams.privateKey = wallet.privateKey;
        transactionParams.from = wallet.address;
        delete transactionParams.mnemonic;
      }
      // Send transaction via blockchain service
      const result = yield _this14._blockchainTransactionsService.sendTransaction(transactionParams);
      yield _this14._finalizeStandardTransaction(result);
    })();
  }
  /**
   * Finalize standard transaction and navigate to confirmation
   * @private
   */
  _finalizeStandardTransaction(result) {
    var _this15 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const receipt = {
        transactionHash: result.hash,
        hash: result.hash,
        digest: result.hash,
        network: _this15.transactionData.network,
        tokenType: _this15.transactionData.tokenType,
        fee: _this15.transactionData.fee,
        fiatFee: _this15.transactionData.fiatFee,
        total: _this15.transactionData.total,
        status: result.status
      };
      _this15._transactionService.addToRecentAddresses({
        address: _this15.transactionData.receiver.address,
        tagName: _this15.transactionData.receiver.tagName,
        domain: _this15.transactionData.receiver.domain,
        network: _this15.transactionData.network,
        tokenType: _this15.transactionData.network === "sui" ? "SUI" : _this15.transactionData.network === "stellar" ? "XLM" : _this15.transactionData.network === "avalanche" ? "AVAX" : _this15.transactionData.network === "bitcoin" ? "BTC" : _this15.transactionData.network === "polkadot" ? "DOT" : _this15.transactionData.network === "kusama" ? "KSM" : _this15.transactionData.tokenType
      });
      _this15.sending = false;
      const sendDateTime = new Date().toISOString();
      const pendingTransactionData = {
        ..._this15.transactionData,
        ...receipt,
        amount: _this15.transactionData.amount,
        total: _this15.transactionData.total,
        fee: _this15.transactionData.fee,
        date: sendDateTime,
        from: _this15.transactionData.sender.address,
        network: _this15.transactionData.network,
        status: receipt.status,
        to: _this15.transactionData.receiver.address,
        tokenType: _this15.transactionData.tokenType
      };
      yield _this15._walletService.addTransactionToPending(pendingTransactionData);
      yield _this15._transactionService.removeTransactionData();
      yield _this15._chromeService.removeItemSession("tokensTtl");
      yield _this15._router.navigate(["/transaction", receipt.transactionHash], {
        queryParams: {
          network: _this15.transactionData?.network,
          symbol: _this15.transactionData?.tokenType
        }
      });
    })();
  }
  static ɵfac = function SendConfirmComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SendConfirmComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_20__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdirectiveInject"](app_asset_service__WEBPACK_IMPORTED_MODULE_21__.AssetService), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdirectiveInject"](app_services_bitcoin_service__WEBPACK_IMPORTED_MODULE_22__.BitcoinService), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdirectiveInject"](app_services_blockdag_service__WEBPACK_IMPORTED_MODULE_23__.BlockDAGService), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdirectiveInject"](app_services_blockchain_transactions_service__WEBPACK_IMPORTED_MODULE_24__.BlockchainTransactionsService), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_17__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdirectiveInject"](app_chrome_service__WEBPACK_IMPORTED_MODULE_25__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdirectiveInject"](app_services_network_service__WEBPACK_IMPORTED_MODULE_26__.NetworkService), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_20__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_27__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdirectiveInject"](app_tags_service__WEBPACK_IMPORTED_MODULE_28__.TagsService), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdirectiveInject"](app_transaction_service__WEBPACK_IMPORTED_MODULE_29__.TransactionService), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdirectiveInject"](_jsverse_transloco__WEBPACK_IMPORTED_MODULE_11__.TranslocoService), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdirectiveInject"](app_vault_service__WEBPACK_IMPORTED_MODULE_30__.VaultService), _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdirectiveInject"](app_wallet_service__WEBPACK_IMPORTED_MODULE_31__.WalletService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdefineComponent"]({
    type: SendConfirmComponent,
    selectors: [["send-confirm"]],
    decls: 9,
    vars: 0,
    consts: [["openEye", ""], ["closedEye", ""], ["toggleButton", ""], ["cross", ""], ["class", "zelf-card send-confirm", 4, "transloco"], [1, "zelf-card", "send-confirm"], [4, "ngIf"], [1, "send-confirm__header"], [1, "send-confirm__col1"], ["mat-flat-button", "", 1, "zelf-icon-button", "zelf-icon-button--secondary", "zelf-icon-button--40", 3, "click"], ["width", "22", "height", "14", "viewBox", "0 0 22 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"], [1, "send-confirm__col2"], [2, "display", "flex", "align-items", "center", "gap", "8px"], [1, "send-confirm__title"], ["style", "\n                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n                            color: white;\n                            padding: 4px 12px;\n                            border-radius: 12px;\n                            font-size: 11px;\n                            font-weight: 600;\n                            letter-spacing: 0.5px;\n                            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);\n                        ", 4, "ngIf"], [1, "send-confirm__col3"], ["class", "send-confirm__form", 3, "formGroup", 4, "ngIf"], [2, "background", "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", "color", "white", "padding", "4px 12px", "border-radius", "12px", "font-size", "11px", "font-weight", "600", "letter-spacing", "0.5px", "box-shadow", "0 2px 8px rgba(102, 126, 234, 0.3)"], [1, "send-confirm__form", 3, "formGroup"], [1, "zelf-card__content", "zelf-card__content--grow"], [1, "send-confirm__total"], [1, "zelf-chip"], [1, "send-confirm__price-amount-container"], [1, "send-confirm__price"], [1, "send-confirm__price-currency"], ["class", "send-confirm__zelf-name-display", 4, "ngIf"], [1, "send-confirm__content"], [1, "send-confirm__summary"], [1, "zelf-action-row"], [1, "send-confirm__label"], [1, "send-confirm__value"], [1, "send-confirm__value", "send-confirm__value--address"], [1, "zelf-action-row", 3, "click", "ngClass"], [1, "send-confirm__value", "send-confirm__value-row"], [1, "send-confirm__value", "send-confirm__value--col", "send-confirm__value--items-end"], [1, "send-confirm__fee"], [1, "send-confirm__value", 3, "ngClass"], [3, "breakdown", 4, "ngIf"], ["class", "zelf-message zelf-message--error", 4, "ngIf"], ["class", "zelf-input zelf-input--wide", 3, "ngClass", 4, "ngIf"], [1, "zelf-card__actions"], ["autocomplete", "off", "class", "zelf-button zelf-button--primary zelf-button--wide", "mat-flat-button", "", "type", "submit", 3, "disabled", "click", 4, "ngIf"], ["class", "zelf-button zelf-button--primary zelf-button--wide", "mat-flat-button", "", "type", "submit", 3, "disabled", "click", 4, "ngIf"], [1, "send-confirm__zelf-name-display"], ["class", "zelf-chip", 4, "ngIf"], ["xmlns", "http://www.w3.org/2000/svg", "width", "24", "height", "24", "viewBox", "0 0 24 24", "fill", "none", 1, "send-confirm__arrow-icon"], ["d", "M21.2544 11.65L18.4644 8.86003C18.1444 8.54003 17.6044 8.76003 17.6044 9.21003V11H3.60437C3.05437 11 2.60437 11.45 2.60437 12C2.60437 12.55 3.05437 13 3.60437 13H17.6044V14.79C17.6044 15.24 18.1444 15.46 18.4544 15.14L21.2444 12.35C21.4444 12.16 21.4444 11.84 21.2544 11.65Z"], ["xmlns", "http://www.w3.org/2000/svg", "height", "16px", "viewBox", "0 -960 960 960", "width", "16px"], ["d", "m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"], [3, "breakdown"], [1, "zelf-message", "zelf-message--error"], [4, "ngTemplateOutlet"], [1, "zelf-input", "zelf-input--wide", 3, "ngClass"], ["formControlName", "password", "id", "password", "name", "password", "placeholder", " ", "required", "", 1, "zelf-input__control", "zelf-input__control--floating-label", 3, "type"], ["for", "password", 1, "zelf-input__floating-label"], ["autocomplete", "off", "mat-flat-button", "", "type", "submit", 1, "zelf-button", "zelf-button--primary", "zelf-button--wide", 3, "click", "disabled"], ["mat-flat-button", "", "type", "submit", 1, "zelf-button", "zelf-button--primary", "zelf-button--wide", 3, "click", "disabled"], ["mode", "indeterminate", "diameter", "18", 4, "ngIf"], ["mode", "indeterminate", "diameter", "18"], [1, "zelf-card__content", "send-confirm__content"], [1, "zelf-action-row", "send-confirm__fee-row", "zelf-action-row--clickable", 3, "click", "ngClass"], [1, "send-confirm__value", "send-confirm__value--col"], ["xmlns", "http://www.w3.org/2000/svg", "height", "24px", "viewBox", "0 -960 960 960", "width", "24px"], ["d", "M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"], ["d", "m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"], ["type", "button", "mat-icon-button", "", "tabindex", "-1", 1, "zelf-icon-button", "zelf-icon-button--transparent", 3, "click"], ["width", "20", "height", "20", "viewBox", "0 0 20 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM14.3 14.3C13.91 14.69 13.28 14.69 12.89 14.3L10 11.41L7.11 14.3C6.72 14.69 6.09 14.69 5.7 14.3C5.31 13.91 5.31 13.28 5.7 12.89L8.59 10L5.7 7.11C5.31 6.72 5.31 6.09 5.7 5.7C6.09 5.31 6.72 5.31 7.11 5.7L10 8.59L12.89 5.7C13.28 5.31 13.91 5.31 14.3 5.7C14.69 6.09 14.69 6.72 14.3 7.11L11.41 10L14.3 12.89C14.68 13.27 14.68 13.91 14.3 14.3Z"]],
    template: function SendConfirmComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplate"](0, SendConfirmComponent_div_0_Template, 3, 2, "div", 4)(1, SendConfirmComponent_ng_template_1_Template, 2, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplateRefExtractor"])(3, SendConfirmComponent_ng_template_3_Template, 2, 0, "ng-template", null, 1, _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplateRefExtractor"])(5, SendConfirmComponent_ng_template_5_Template, 2, 1, "ng-template", null, 2, _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplateRefExtractor"])(7, SendConfirmComponent_ng_template_7_Template, 2, 0, "ng-template", null, 3, _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵtemplateRefExtractor"]);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_8__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_32__.MatIconButton, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_9__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_9__.MatProgressSpinner, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_7__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormControlName, _angular_router__WEBPACK_IMPORTED_MODULE_10__.RouterModule, app_stellar_send_summary_stellar_send_summary_component__WEBPACK_IMPORTED_MODULE_16__.StellarSendSummaryComponent, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_11__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_11__.TranslocoDirective, app_zelf_loader_zelf_loader_component__WEBPACK_IMPORTED_MODULE_15__.ZelfLoaderComponent, app_pipes_address_mask_pipe__WEBPACK_IMPORTED_MODULE_14__.AddressMaskPipe, _angular_common__WEBPACK_IMPORTED_MODULE_6__.UpperCasePipe, _angular_common__WEBPACK_IMPORTED_MODULE_6__.DecimalPipe, _angular_common__WEBPACK_IMPORTED_MODULE_6__.CurrencyPipe],
    styles: ["[_ngcontent-%COMP%]:root {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc);\n}\n\n.zelf-button-external-link[_ngcontent-%COMP%] {\n  display: block;\n}\n.zelf-button-external-link--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.zelf-button[_ngcontent-%COMP%] {\n  align-items: center;\n  border-radius: 16px;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  gap: 8px;\n  height: 56px;\n  justify-content: center;\n  outline: none;\n  padding: 8px 24px;\n  text-align: center;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.zelf-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-button[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: inherit;\n}\n.zelf-button__text--margin-right[_ngcontent-%COMP%] {\n  margin-right: 1rem;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-button--thin[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  padding: 12px 16px;\n}\n.zelf-button--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.zelf-button--wide.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-button--primary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button, #181818) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--primary[_ngcontent-%COMP%]:active {\n  --mdc-filled-button-container-color: var(--zns-theme-text-muted, #96939e) !important;\n  background-color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-hover, #ff5721) !important;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff) !important;\n  stroke: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-text-secondary, #73777f) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-text-secondary, #73777f) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--secondary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-button-secondary-text, #495057) !important;\n  background-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  color: var(--zns-theme-button-secondary-text, #495057) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-secondary-text, #495057);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus, .zelf-button--secondary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-border, #e3e3e3) !important;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]:focus, .zelf-button--tertiary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%] {\n  --mdc-outlined-button-label-text-color: var(--zns-theme-button, #181818) !important;\n  --mdc-outlined-button-outline-color: var(--zns-theme-border, #e3e3e3) !important;\n  border: 1px solid var(--zns-theme-button, #181818) !important;\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-button, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button, #181818);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus, .zelf-button--outlined[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--outlined[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--outlined[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%] {\n  border: none !important;\n  background-color: transparent !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--red[_ngcontent-%COMP%]:focus, .zelf-button--red[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n}\n.zelf-button--red[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e);\n}\n.zelf-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n}\n\n.zelf-icon-button[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  align-items: center;\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  border-radius: 56px;\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  font-weight: 600;\n  gap: 16px;\n  height: 56px;\n  justify-content: center;\n  min-height: 56px;\n  min-width: 56px;\n  outline: none;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  -webkit-user-select: none;\n          user-select: none;\n  width: 56px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-icon-button.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: var(--zns-theme-text, #181818);\n  height: 24px;\n  width: 24px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%] {\n  height: 40px;\n  min-height: 40px;\n  min-width: 40px;\n  width: 40px;\n  border-radius: 40px;\n  padding: 0 8px;\n}\n.zelf-icon-button--40.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 14px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  height: 20px;\n  width: 20px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e) !important;\n  stroke: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:active {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus, .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%] {\n  background-color: transparent !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]:focus, .zelf-icon-button--transparent[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--text[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: initial !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  height: auto;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n  width: auto;\n}\n\n.zelf-icon-button-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:first-child {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:last-child {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.zelf-action-button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: 8px;\n}\n.zelf-action-button__icon[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  background: var(--zns-theme-card, #ffffff);\n  border-radius: 32px;\n  outline: 1px var(--zns-theme-border, #e3e3e3) solid;\n  outline-offset: -1px;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  cursor: pointer;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n@media (max-width: 600px) {\n  .zelf-action-button__icon[_ngcontent-%COMP%] {\n    padding: 8px 14px;\n  }\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-size: 24px;\n  line-height: 1;\n  font-variation-settings: \"FILL\" 0, \"wght\" 400, \"GRAD\" 0, \"opsz\" 24;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-primary, #181818);\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .zelf-action-button__text[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon-box[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  position: relative;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n}\n.zelf-action-button__text[_ngcontent-%COMP%] {\n  width: auto;\n  white-space: nowrap;\n  text-align: center;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 11px;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  line-height: 16px;\n  letter-spacing: 0.5px;\n  word-wrap: normal;\n}\n\n[_nghost-%COMP%] {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  justify-content: center;\n}\n\n.send-confirm[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  max-width: var(--zns-card-width, 536px);\n  min-height: var(--zns-card-min-height, 768px);\n}\n.send-confirm__loader[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  margin: auto;\n  z-index: 2;\n}\n.send-confirm__header[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(10, 1fr);\n  column-gap: calc(12px * var(--zns-space-scale, 1));\n  align-content: center;\n  justify-content: start;\n  gap: calc(24px * var(--zns-space-scale, 1));\n  width: 100%;\n}\n.send-confirm__col1[_ngcontent-%COMP%], .send-confirm__col3[_ngcontent-%COMP%] {\n  grid-column: span 3;\n  display: flex;\n  align-items: center;\n}\n.send-confirm__col1[_ngcontent-%COMP%] {\n  justify-content: start;\n}\n.send-confirm__col2[_ngcontent-%COMP%] {\n  grid-column: span 4;\n  text-align: center;\n  align-items: center;\n}\n.send-confirm__col3[_ngcontent-%COMP%] {\n  justify-content: end;\n}\n.send-confirm__title[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-title-family, \"Menda\", \"Arial Black\", sans-serif);\n  font-weight: 500;\n  font-size: calc(24px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  text-align: center;\n  vertical-align: middle;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n}\n.send-confirm__form[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: calc(24px * var(--zns-space-scale, 1));\n  flex-grow: 1;\n}\n.send-confirm__zelf-name-display[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: calc(16px * var(--zns-space-scale, 1));\n}\n.send-confirm__content[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  justify-content: flex-start;\n  width: 100%;\n}\n.send-confirm__total[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  flex-direction: column;\n}\n.send-confirm__from-value[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n}\n@media (max-width: 600px) {\n  .send-confirm__from-value[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-end;\n  }\n}\n.send-confirm__summary[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  width: 100%;\n  margin-top: calc(16px * var(--zns-space-scale, 1));\n}\n.send-confirm__label[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 500;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  vertical-align: middle;\n  color: var(--zns-theme-text-secondary, #73777f);\n  margin: 0;\n}\n.send-confirm__value-row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n}\n.send-confirm__value-row[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: var(--zns-theme-text, #181818);\n}\n.send-confirm__value[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(15px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  vertical-align: middle;\n  color: var(--zns-theme-text, #181818);\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n  margin: 0;\n}\n.send-confirm__value--col[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n}\n.send-confirm__value--items-end[_ngcontent-%COMP%] {\n  justify-content: center;\n  align-items: flex-end;\n  text-align: right;\n}\n.send-confirm__value--address[_ngcontent-%COMP%] {\n  max-width: 60%;\n  overflow-wrap: anywhere;\n  text-align: right;\n  font-size: calc(13px * var(--zns-font-scale, 1));\n}\n.send-confirm__value--error[_ngcontent-%COMP%] {\n  color: var(--zns-theme-error, #dc362e);\n}\n.send-confirm__arrow-icon[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.send-confirm__fee[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 500;\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  vertical-align: middle;\n  color: var(--zns-theme-text-secondary, #73777f);\n  margin: 0;\n}\n.send-confirm__price-amount-container[_ngcontent-%COMP%] {\n  display: flex;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  justify-content: center;\n  align-items: flex-end;\n  width: 100%;\n}\n.send-confirm__price[_ngcontent-%COMP%] {\n  font-size: calc(32px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n  font-family: var(--zns-theme-title-family, \"Menda\", \"Arial Black\", sans-serif);\n  margin: 0;\n}\n.send-confirm__price-currency[_ngcontent-%COMP%] {\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  letter-spacing: 1px;\n  color: var(--zns-theme-text, #181818);\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  margin: 0 0 calc(8px * var(--zns-space-scale, 1));\n}\n.send-confirm__fee-row[_ngcontent-%COMP%]   .send-confirm__value[_ngcontent-%COMP%] {\n  font-weight: 400;\n}\n.send-confirm__fee-row[_ngcontent-%COMP%]   .send-confirm__label[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n@media (max-width: 600px) {\n  .send-confirm__price[_ngcontent-%COMP%] {\n    font-size: calc(28px * var(--zns-font-scale, 1));\n  }\n  .send-confirm__label[_ngcontent-%COMP%] {\n    font-size: calc(12px * var(--zns-font-scale, 1));\n    line-height: calc(16px * var(--zns-font-scale, 1));\n  }\n  .send-confirm__value[_ngcontent-%COMP%] {\n    font-size: calc(12px * var(--zns-font-scale, 1));\n    line-height: calc(16px * var(--zns-font-scale, 1));\n  }\n}\n\n.zelf-action-row--clickable[_ngcontent-%COMP%] {\n  transition: background-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n  cursor: pointer;\n}\n.zelf-action-row--clickable[_ngcontent-%COMP%]   .send-confirm__value[_ngcontent-%COMP%] {\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-row--clickable[_ngcontent-%COMP%]   .send-confirm__label[_ngcontent-%COMP%] {\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-row--clickable[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-text, #181818);\n}\n.zelf-action-row--clickable[_ngcontent-%COMP%]:hover   .send-confirm__value[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-row--clickable[_ngcontent-%COMP%]:hover   .send-confirm__label[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-action-row--clickable[_ngcontent-%COMP%]:hover   .send-confirm__value-row[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n\n.zelf-action-row--selected[_ngcontent-%COMP%] {\n  transition: background-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n  background-color: var(--zns-theme-text, #181818);\n}\n.zelf-action-row--selected[_ngcontent-%COMP%]   .send-confirm__value[_ngcontent-%COMP%] {\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n  color: var(--zns-theme-card, #ffffff);\n  font-weight: 400;\n}\n.zelf-action-row--selected[_ngcontent-%COMP%]   .send-confirm__label[_ngcontent-%COMP%] {\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n  color: var(--zns-theme-text-muted, #96939e);\n  font-weight: 600;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX2J1dHRvbnMuc2NzcyIsIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX3ZhcmlhYmxlcy5zY3NzIiwid2VicGFjazovLy4vc3JjL2FwcC9zZW5kLWNvbmZpcm0vc2VuZC1jb25maXJtLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQ0ksZ0VDMEJ1QjtBQzNCM0I7O0FGSUE7RUFDSSxjQUFBO0FFREo7QUZHSTtFQUNJLFdBQUE7QUVEUjs7QUZLQTtFQUNJLG1CQUFBO0VBQ0EsbUJBQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQTtFQUNBLGFBQUE7RUFDQSx1RUNJYztFREhkLGVBQUE7RUFDQSxnQkFBQTtFQUNBLFFBQUE7RUFDQSxZQUFBO0VBQ0EsdUJBQUE7RUFDQSxhQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLHlCQUFBO1VBQUEsaUJBQUE7QUVGSjtBRklJO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxRQUFBO0FFRlI7QUZLSTtFQUNJLFNBQUE7RUFDQSxjQUFBO0FFSFI7QUZPUTtFQUNJLGtCQUFBO0FFTFo7QUZTSTtFQUNJLDZCQUFBO0VBQ0EsK0NDbEJhO0VEbUJiLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHFCQUFBO0VBQ0EsaUJBQUE7RUFDQSw2R0FDSTtBRVJaO0FGV1E7RUFDSSxlQUFBO0FFVFo7QUZZUTtFQUNJLDhDQ2hDUztBQ3NCckI7QUZhUTtFQUNJLHFDQ3RDQTtFRHVDQSxrREN4QkU7QUNhZDtBRmFZO0VBQ0ksb0NDMUNKO0FDK0JaO0FGZVE7RUFDSSxtQkFBQTtFQUNBLHNEQUFBO0FFYlo7QUZlWTtFQUNJLDBDQ2xEQztBQ3FDakI7QUZrQkk7RUFDSSxrQkFBQTtFQUNBLGtCQUFBO0FFaEJSO0FGbUJJO0VBQ0ksV0FBQTtBRWpCUjtBRm1CUTtFQUNJLG1CQUFBO0FFakJaO0FGcUJJO0VBRUksZ0ZBQUE7RUFDQSwrRUFBQTtFQUVBLDZEQUFBO0VBQ0EsZ0RBQUE7RUFDQSw2R0FDSTtBRXRCWjtBRnlCUTtFQUNJLG9GQUFBO0VBQ0EsaUVBQUE7QUV2Qlo7QUYwQlE7RUFDSSxzRkFBQTtFQUNBLG1FQUFBO0FFeEJaO0FGMkJRO0VBQ0ksb0NDekVBO0FDZ0RaO0FGNEJRO0VBQ0ksK0NBQUE7RUFDQSxpREFBQTtBRTFCWjtBRjZCUTtFQUNJLG1CQUFBO0VBQ0Esd0ZBQUE7RUFDQSwrRUFBQTtFQUNBLHFFQUFBO0VBQ0EsZ0RBQUE7QUUzQlo7QUY2Qlk7RUFDSSwrQ0FBQTtFQUNBLGlEQUFBO0FFM0JoQjtBRmdDSTtFQUNJLDBGQUFBO0VBQ0EsZ0dBQUE7RUFFQSx1RUFBQTtFQUNBLGlFQUFBO0VBQ0EsNkdBQ0k7QUVoQ1o7QUZtQ1E7RUFDSSxxRENoSGU7QUMrRTNCO0FGb0NRO0VBRUksZ0dBQUE7RUFDQSwrRUFBQTtFQUNBLDZFQUFBO0VBQ0EscUNDbEhBO0FDK0VaO0FGcUNZO0VBQ0ksb0NDdklKO0FDb0daO0FGdUNRO0VBQ0ksbUJBQUE7RUFDQSxnRkFBQTtFQUNBLDZEQUFBO0FFckNaO0FGdUNZO0VBQ0ksNENDaklHO0FDNEZuQjtBRndDWTtFQUNJLHlEQUFBO0VBQ0EsMkRBQUE7QUV0Q2hCO0FGMkNJO0VBQ0ksMkRBQUE7RUFDQSxnREFBQTtFQUNBLDZHQUNJO0FFMUNaO0FGNkNRO0VBRUksZ0VBQUE7QUU1Q1o7QUYrQ1E7RUFDSSxtQkFBQTtFQUNBLDZEQUFBO0VBQ0EsZ0RBQUE7QUU3Q1o7QUYrQ1k7RUFDSSwrQ0FBQTtFQUNBLGlEQUFBO0FFN0NoQjtBRmlEUTtFQUNJLG9DQ25MQTtBQ29JWjtBRmtEUTtFQUNJLCtDQUFBO0VBQ0EsaURBQUE7QUVoRFo7QUZvREk7RUFDSSxtRkFBQTtFQUNBLGdGQUFBO0VBRUEsNkRBQUE7RUFDQSwyREFBQTtFQUNBLGtEQUFBO0VBQ0EsNkdBQ0k7QUVwRFo7QUZ1RFE7RUFDSSxzQ0NqTUU7QUM0SWQ7QUZ3RFE7RUFFSSxtRUFBQTtFQUNBLGdEQUFBO0FFdkRaO0FGeURZO0VBQ0ksb0NDL0xKO0FDd0laO0FGMkRRO0VBQ0ksbUJBQUE7RUFDQSx1REFBQTtBRXpEWjtBRjZESTtFQUNJLHVCQUFBO0VBQ0Esd0NBQUE7RUFDQSxpREFBQTtFQUNBLDZHQUNJO0FFNURaO0FGK0RRO0VBRUksaUVBQUE7QUU5RFo7QUZpRVE7RUFDSSxtQkFBQTtFQUNBLDBEQUFBO0FFL0RaO0FGa0VRO0VBQ0kscUNDcFFKO0FDb01SO0FGb0VJO0VBQ0ksaUVBQUE7RUFDQSxpREFBQTtBRWxFUjtBRm9FUTtFQUNJLGdEQUFBO0FFbEVaO0FGc0VJO0VBQ0ksbUVBQUE7RUFDQSxtREFBQTtBRXBFUjtBRnNFUTtFQUNJLGtEQUFBO0FFcEVaO0FGd0VJO0VBQ0kscUJBQUE7RUFDQSxhQUFBO0VBQ0EsWUFBQTtFQUNBLGlCQUFBO0FFdEVSOztBRjBFQTtFQUNJLHVFQ3BSYztFRHFSZCxtQkFBQTtFQUNBLGtFQUFBO0VBQ0EsbUJBQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQTtFQUNBLG9CQUFBO0VBQ0EsZ0JBQUE7RUFDQSxTQUFBO0VBQ0EsWUFBQTtFQUNBLHVCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLDZHQUNJO0VBRUoseUJBQUE7VUFBQSxpQkFBQTtFQUNBLFdBQUE7QUV6RUo7QUYyRUk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLFFBQUE7QUV6RVI7QUY0RUk7RUFDSSxtQkFBQTtBRTFFUjtBRjZFSTtFQUNJLHFEQUFBO0VBQ0Esb0NDOVNJO0VEK1NKLFlBQUE7RUFDQSxXQUFBO0FFM0VSO0FGOEVJO0VBQ0ksZ0VBQUE7RUFDQSw0Q0NsU1U7QUNzTmxCO0FGOEVRO0VBQ0ksMkNDclNNO0FDeU5sQjtBRmdGSTtFQUNJLG1CQUFBO0FFOUVSO0FGaUZJO0VBQ0ksWUFBQTtFQUNBLGdCQUFBO0VBQ0EsZUFBQTtFQUNBLFdBQUE7RUFDQSxtQkFBQTtFQUNBLGNBQUE7QUUvRVI7QUZpRlE7RUFDSSxtQkFBQTtBRS9FWjtBRmtGUTtFQUNJLFlBQUE7RUFDQSxXQUFBO0FFaEZaO0FGb0ZJO0VBQ0ksNkJBQUE7RUFDQSwrQ0NsVmE7RURtVmIsZUFBQTtFQUNBLGdCQUFBO0VBQ0EscUJBQUE7RUFDQSxpQkFBQTtFQUNBLDZHQUNJO0FFbkZaO0FGc0ZRO0VBQ0ksZUFBQTtBRXBGWjtBRnVGUTtFQUNJLDhDQ2hXUztBQzJRckI7QUZ3RlE7RUFDSSxxQ0N0V0E7RUR1V0Esa0RDeFZFO0FDa1FkO0FGd0ZZO0VBQ0ksb0NDMVdKO0FDb1JaO0FGMEZRO0VBQ0ksbUJBQUE7RUFDQSxzREFBQTtBRXhGWjtBRjBGWTtFQUNJLDBDQ2xYQztBQzBSakI7QUYyRlk7RUFDSSxxREFBQTtFQUNBLHVEQUFBO0FFekZoQjtBRjhGSTtFQUNJLDZEQUFBO0VBQ0EsdURBQUE7RUFDQSw2R0FDSTtBRTdGWjtBRmdHUTtFQUNJLG1FQUFBO0FFOUZaO0FGaUdRO0VBQ0ksbUVBQUE7QUUvRlo7QUZrR1E7RUFDSSwyQ0NyWU07QUNxU2xCO0FGbUdRO0VBQ0ksc0RBQUE7RUFDQSx3REFBQTtBRWpHWjtBRm9HUTtFQUNJLG1CQUFBO0VBQ0EsbUVBQUE7QUVsR1o7QUZvR1k7RUFDSSwyQ0NsWkU7QUNnVGxCO0FGcUdZO0VBQ0ksc0RBQUE7RUFDQSx3REFBQTtBRW5HaEI7QUZ3R0k7RUFDSSxrRUFBQTtFQUNBLGdEQUFBO0VBQ0EsNkdBQ0k7QUV2R1o7QUYwR1E7RUFDSSxvQ0M1YUE7QUNvVVo7QUYyR1E7RUFFSSxnRUFBQTtFQUNBLHFDQ2hhQTtBQ3NUWjtBRjRHWTtFQUNJLG9DQ25hSjtBQ3lUWjtBRjhHUTtFQUNJLG1CQUFBO0VBQ0EsNkRBQUE7QUU1R1o7QUY4R1k7RUFDSSw0Q0M5YUc7QUNrVW5CO0FGK0dZO0VBQ0kseURBQUE7RUFDQSwyREFBQTtBRTdHaEI7QUZrSEk7RUFDSSx3Q0FBQTtFQUNBLGdEQUFBO0FFaEhSO0FGa0hRO0VBQ0ksOENDM2NTO0FDMlZyQjtBRm1IUTtFQUVJLDJFQUFBO0FFbEhaO0FGcUhRO0VBQ0ksbUJBQUE7RUFDQSwwREFBQTtBRW5IWjtBRnFIWTtFQUNJLDRDQzFjRztBQ3VWbkI7QUZ3SEk7RUFDSSxzQkFBQTtFQUNBLDZCQUFBO0FFdEhSO0FGeUhJO0VBQ0ksaUVBQUE7RUFDQSxpREFBQTtBRXZIUjtBRnlIUTtFQUNJLGdEQUFBO0FFdkhaO0FGMkhJO0VBQ0ksbUVBQUE7RUFDQSxtREFBQTtBRXpIUjtBRjJIUTtFQUNJLGtEQUFBO0FFekhaO0FGNkhJO0VBQ0kscUJBQUE7RUFDQSxZQUFBO0VBQ0EsYUFBQTtFQUNBLFlBQUE7RUFDQSxpQkFBQTtFQUNBLFdBQUE7QUUzSFI7O0FGK0hBO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsTUFBQTtBRTVISjtBRitIUTtFQUNJLDBCQUFBO0VBQ0EsNkJBQUE7QUU3SFo7QUZnSVE7RUFDSSxnQkFBQTtBRTlIWjtBRmlJUTtFQUNJLHlCQUFBO0VBQ0EsNEJBQUE7QUUvSFo7O0FGb0lBO0VBQ0ksb0JBQUE7RUFDQSxzQkFBQTtFQUNBLDJCQUFBO0VBQ0EsbUJBQUE7RUFDQSxRQUFBO0FFaklKO0FGbUlJO0VBQ0ksa0JBQUE7RUFDQSwwQ0M3Z0JJO0VEOGdCSixtQkFBQTtFQUNBLG1EQUFBO0VBQ0Esb0JBQUE7RUFDQSxvQkFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLFFBQUE7RUFDQSxlQUFBO0VBQ0EsNkdBQ0k7QUVsSVo7QUZxSVE7RUFoQko7SUFpQlEsaUJBQUE7RUVsSVY7QUFDRjtBRm9JUTtFQUNJLG9DQ2xqQkE7RURtakJBLHFEQUFBO0FFbElaO0FGcUlRO0VBQ0kscUNDdmpCQTtFRHdqQkEsZUFBQTtFQUNBLGNBQUE7RUFDQSxrRUFDSTtFQUlKLHNEQUFBO0FFdklaO0FGMElRO0VBQ0ksbURDbG1CRztFRG1tQkgscUNDbGpCQTtBQzBhWjtBRjBJWTtFQUNJLG9DQ3JqQko7QUM2YVo7QUYySVk7RUFDSSxxQ0N6akJKO0FDZ2JaO0FGNElZO0VBQ0kscUNDN2pCSjtBQ21iWjtBRitJSTtFQUNJLFdBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7QUU3SVI7QUZnSkk7RUFDSSxXQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLCtDQy9sQmE7RURnbUJiLGVBQUE7RUFDQSx1RUMxbUJVO0VEMm1CVixnQkFBQTtFQUNBLGlCQUFBO0VBQ0EscUJBQUE7RUFDQSxpQkFBQTtBRTlJUjs7QUFyZkE7RUFDSSxtQkFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFlBQUE7RUFDQSx1QkFBQTtBQXdmSjs7QUFyZkE7RUFDSSxrQkFBQTtFQUNBLFdBQUE7RUFDQSx1Q0FBQTtFQUNBLDZDQUFBO0FBd2ZKO0FBdGZJO0VBQ0ksa0JBQUE7RUFDQSxRQUFBO0VBQ0EsWUFBQTtFQUNBLFVBQUE7QUF3ZlI7QUFyZkk7RUFDSSxhQUFBO0VBQ0Esc0NBQUE7RUFDQSxrREFBQTtFQUNBLHFCQUFBO0VBQ0Esc0JBQUE7RUFDQSwyQ0FBQTtFQUNBLFdBQUE7QUF1ZlI7QUFwZkk7RUFFSSxtQkFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtBQXFmUjtBQWxmSTtFQUNJLHNCQUFBO0FBb2ZSO0FBamZJO0VBQ0ksbUJBQUE7RUFDQSxrQkFBQTtFQUNBLG1CQUFBO0FBbWZSO0FBaGZJO0VBQ0ksb0JBQUE7QUFrZlI7QUEvZUk7RUFDSSw4RUQvQlc7RUNnQ1gsZ0JBQUE7RUFDQSxnREFBQTtFQUNBLGtEQUFBO0VBQ0EscUJBQUE7RUFDQSxrQkFBQTtFQUNBLHNCQUFBO0VBQ0EscUNEaENJO0VDaUNKLFNBQUE7QUFpZlI7QUE5ZUk7RUFDSSxXQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLDJDQUFBO0VBQ0EsWUFBQTtBQWdmUjtBQTdlSTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLDJDQUFBO0FBK2VSO0FBNWVJO0VBQ0ksY0FBQTtFQUNBLDJCQUFBO0VBQ0EsV0FBQTtBQThlUjtBQTNlSTtFQUNJLGFBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0VBQ0EsMENBQUE7RUFDQSxzQkFBQTtBQTZlUjtBQTFlSTtFQUNJLGFBQUE7RUFDQSx5QkFBQTtFQUNBLG1CQUFBO0VBQ0EsMENBQUE7QUE0ZVI7QUExZVE7RUFOSjtJQU9RLHNCQUFBO0lBQ0EscUJBQUE7RUE2ZVY7QUFDRjtBQTFlSTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSwwQ0FBQTtFQUNBLFdBQUE7RUFDQSxrREFBQTtBQTRlUjtBQXplSTtFQUNJLHVFRGhHVTtFQ2lHVixnQkFBQTtFQUNBLGdEQUFBO0VBQ0Esa0RBQUE7RUFDQSxxQkFBQTtFQUNBLHNCQUFBO0VBQ0EsK0NEN0ZhO0VDOEZiLFNBQUE7QUEyZVI7QUF4ZUk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSwwQ0FBQTtBQTBlUjtBQXhlUTtFQUNJLHFEQUFBO0VBQ0Esb0NEMUdBO0FDb2xCWjtBQXRlSTtFQUNJLHVFRHRIVTtFQ3VIVixnQkFBQTtFQUNBLGdEQUFBO0VBQ0Esa0RBQUE7RUFDQSxxQkFBQTtFQUNBLHNCQUFBO0VBQ0EscUNEckhJO0VDc0hKLHNEQUFBO0VBQ0EsU0FBQTtBQXdlUjtBQXRlUTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtBQXdlWjtBQXJlUTtFQUNJLHVCQUFBO0VBQ0EscUJBQUE7RUFDQSxpQkFBQTtBQXVlWjtBQXBlUTtFQUNJLGNBQUE7RUFDQSx1QkFBQTtFQUNBLGlCQUFBO0VBQ0EsZ0RBQUE7QUFzZVo7QUFuZVE7RUFDSSxzQ0RsS0o7QUN1b0JSO0FBamVJO0VBQ0ksb0NEakpJO0FDb25CWjtBQWhlSTtFQUNJLHVFRDVKVTtFQzZKVixnQkFBQTtFQUNBLGdEQUFBO0VBQ0Esa0RBQUE7RUFDQSxxQkFBQTtFQUNBLHNCQUFBO0VBQ0EsK0NEekphO0VDMEpiLFNBQUE7QUFrZVI7QUEvZEk7RUFDSSxhQUFBO0VBQ0EsMENBQUE7RUFDQSx1QkFBQTtFQUNBLHFCQUFBO0VBQ0EsV0FBQTtBQWllUjtBQTlkSTtFQUNJLGdEQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQ0QxS0k7RUMyS0osOEVEakxXO0VDa0xYLFNBQUE7QUFnZVI7QUE3ZEk7RUFDSSxnREFBQTtFQUNBLGdCQUFBO0VBQ0EsbUJBQUE7RUFDQSxxQ0RuTEk7RUNvTEosdUVEM0xVO0VDNExWLGlEQUFBO0FBK2RSO0FBM2RRO0VBQ0ksZ0JBQUE7QUE2ZFo7QUExZFE7RUFDSSxnQkFBQTtBQTRkWjtBQXhkSTtFQUNJO0lBQ0ksZ0RBQUE7RUEwZFY7RUF2ZE07SUFDSSxnREFBQTtJQUNBLGtEQUFBO0VBeWRWO0VBdGRNO0lBQ0ksZ0RBQUE7SUFDQSxrREFBQTtFQXdkVjtBQUNGOztBQXBkQTtFQUNJLGlFQUFBO0VBQ0EsZUFBQTtBQXVkSjtBQXJkSTtFQUNJLHNEQUFBO0FBdWRSO0FBcGRJO0VBQ0ksc0RBQUE7QUFzZFI7QUFuZEk7RUFDSSxnRERoT0k7QUNxckJaO0FBbmRRO0VBQ0kscUNEak5BO0FDc3FCWjtBQWxkUTtFQUNJLDJDRHRPSztBQzByQmpCO0FBamRRO0VBQ0ksb0NEek5BO0FDNHFCWjs7QUE5Y0E7RUFDSSxpRUFBQTtFQUNBLGdERGxQUTtBQ21zQlo7QUEvY0k7RUFDSSxzREFBQTtFQUNBLHFDRHBPSTtFQ3FPSixnQkFBQTtBQWlkUjtBQTljSTtFQUNJLHNEQUFBO0VBQ0EsMkNEM1BTO0VDNFBULGdCQUFBO0FBZ2RSIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcIi4vdmFyaWFibGVzXCI7XG5cbjpyb290IHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbn1cblxuLnplbGYtYnV0dG9uLWV4dGVybmFsLWxpbmsge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuXG4gICAgJi0td2lkZSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cbn1cblxuLnplbGYtYnV0dG9uIHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBnYXA6IDhweDtcbiAgICBoZWlnaHQ6IDU2cHg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBwYWRkaW5nOiA4cHggMjRweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG5cbiAgICBzcGFuIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogOHB4O1xuICAgIH1cblxuICAgIHAge1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIGNvbG9yOiBpbmhlcml0O1xuICAgIH1cblxuICAgICZfX3RleHQge1xuICAgICAgICAmLS1tYXJnaW4tcmlnaHQge1xuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0taHlwZXJsaW5rIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIHBhZGRpbmc6IDhweCAxNnB4O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmLS1zbWFsbCB7XG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tdGhpbiB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgcGFkZGluZzogMTJweCAxNnB4O1xuICAgIH1cblxuICAgICYtLXdpZGUge1xuICAgICAgICB3aWR0aDogMTAwJTtcblxuICAgICAgICAmLnplbGYtYnV0dG9uLS1oeXBlcmxpbmsge1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXByaW1hcnkge1xuICAgICAgICAvLyBNREMgbWF0LWZsYXQtYnV0dG9uIHBhaW50cyB2aWEgQ1NTIHZhcmlhYmxlczsgYWxpZ24gd2l0aCBaZWxmIHRva2VucyAoYXZvaWRzIGRlZmF1bHQgTWF0ZXJpYWwgYmx1ZSkuXG4gICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b259ICFpbXBvcnRhbnQ7XG4gICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tbGFiZWwtdGV4dC1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQ2FyZH0gIWltcG9ydGFudDtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmFjdGl2ZSB7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXJ9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5fSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVDYXJkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc2Vjb25kYXJ5IHtcbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeX0gIWltcG9ydGFudDtcbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0fSAhaW1wb3J0YW50O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVDYXJkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJvcmRlcn0gIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10ZXJ0aWFyeSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3IgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tb3V0bGluZWQge1xuICAgICAgICAtLW1kYy1vdXRsaW5lZC1idXR0b24tbGFiZWwtdGV4dC1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9ufSAhaW1wb3J0YW50O1xuICAgICAgICAtLW1kYy1vdXRsaW5lZC1idXR0b24tb3V0bGluZS1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQm9yZGVyfSAhaW1wb3J0YW50O1xuXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b247XG4gICAgICAgIH1cblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1yZWQge1xuICAgICAgICBib3JkZXI6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tZXJyb3Ige1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc3VjY2VzcyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdExpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRjb3JyZWN0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1waWxsIHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBtaW4taGVpZ2h0OiAwO1xuICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgICAgIHBhZGRpbmc6IDRweCAxMnB4O1xuICAgIH1cbn1cblxuLnplbGYtaWNvbi1idXR0b24ge1xuICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyLXJhZGl1czogNTZweDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgZ2FwOiAxNnB4O1xuICAgIGhlaWdodDogNTZweDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBtaW4taGVpZ2h0OiA1NnB4O1xuICAgIG1pbi13aWR0aDogNTZweDtcbiAgICBvdXRsaW5lOiBub25lO1xuICAgIHRyYW5zaXRpb246XG4gICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICB3aWR0aDogNTZweDtcblxuICAgIHNwYW4ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgfVxuXG4gICAgJi56ZWxmLWljb24tYnV0dG9uLS1ib3JkZXItc29mdCB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgfVxuXG4gICAgc3ZnIHtcbiAgICAgICAgdHJhbnNpdGlvbjogZmlsbCAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgaGVpZ2h0OiAyNHB4O1xuICAgICAgICB3aWR0aDogMjRweDtcbiAgICB9XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tYm9yZGVyLXNvZnQge1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIH1cblxuICAgICYtLTQwIHtcbiAgICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgICBtaW4taGVpZ2h0OiA0MHB4O1xuICAgICAgICBtaW4td2lkdGg6IDQwcHg7XG4gICAgICAgIHdpZHRoOiA0MHB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA0MHB4O1xuICAgICAgICBwYWRkaW5nOiAwIDhweDtcblxuICAgICAgICAmLnplbGYtaWNvbi1idXR0b24tLWJvcmRlci1zb2Z0IHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgaGVpZ2h0OiAyMHB4O1xuICAgICAgICAgICAgd2lkdGg6IDIwcHg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1oeXBlcmxpbmsge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICAgICAgcGFkZGluZzogOHB4IDE2cHg7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICYtLXNtYWxsIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tcHJpbWFyeSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6YWN0aXZlIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc2Vjb25kYXJ5IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXIgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10cmFuc3BhcmVudCB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10ZXh0IHtcbiAgICAgICAgd2lkdGg6IGF1dG8gIWltcG9ydGFudDtcbiAgICAgICAgbWluLXdpZHRoOiBpbml0aWFsICFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgJi0tZXJyb3Ige1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc3VjY2VzcyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdExpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRjb3JyZWN0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1waWxsIHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBoZWlnaHQ6IGF1dG87XG4gICAgICAgIG1pbi1oZWlnaHQ6IDA7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgcGFkZGluZzogNHB4IDEycHg7XG4gICAgICAgIHdpZHRoOiBhdXRvO1xuICAgIH1cbn1cblxuLnplbGYtaWNvbi1idXR0b24tZ3JvdXAge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDA7XG5cbiAgICAuemVsZi1pY29uLWJ1dHRvbiB7XG4gICAgICAgICY6Zmlyc3QtY2hpbGQge1xuICAgICAgICAgICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDA7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6bm90KDpmaXJzdC1jaGlsZCk6bm90KDpsYXN0LWNoaWxkKSB7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpsYXN0LWNoaWxkIHtcbiAgICAgICAgICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAwO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uemVsZi1hY3Rpb24tYnV0dG9uIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogOHB4O1xuXG4gICAgJl9faWNvbiB7XG4gICAgICAgIHBhZGRpbmc6IDEwcHggMjBweDtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDMycHg7XG4gICAgICAgIG91dGxpbmU6IDFweCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyIHNvbGlkO1xuICAgICAgICBvdXRsaW5lLW9mZnNldDogLTFweDtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogdmFyaWFibGVzLiRtaW5TbWFsbCkge1xuICAgICAgICAgICAgcGFkZGluZzogOHB4IDE0cHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBmaWxsIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgICAgIH1cblxuICAgICAgICAubWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBmb250LXNpemU6IDI0cHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcbiAgICAgICAgICAgIGZvbnQtdmFyaWF0aW9uLXNldHRpbmdzOlxuICAgICAgICAgICAgICAgIFwiRklMTFwiIDAsXG4gICAgICAgICAgICAgICAgXCJ3Z2h0XCIgNDAwLFxuICAgICAgICAgICAgICAgIFwiR1JBRFwiIDAsXG4gICAgICAgICAgICAgICAgXCJvcHN6XCIgMjQ7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHByaW1hcnlDb2xvcjtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQge1xuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLnplbGYtYWN0aW9uLWJ1dHRvbl9fdGV4dCB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9faWNvbi1ib3gge1xuICAgICAgICB3aWR0aDogMjhweDtcbiAgICAgICAgaGVpZ2h0OiAyOHB4O1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX190ZXh0IHtcbiAgICAgICAgd2lkdGg6IGF1dG87XG4gICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE2cHg7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjVweDtcbiAgICAgICAgd29yZC13cmFwOiBub3JtYWw7XG4gICAgfVxufVxuIiwiJHByaW1hcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXByaW1hcnksICMxODE4MTgpO1xuJHByaW1hcnlMaWdodDogI2RhZGRmYTtcbiRzZWNvbmRhcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXNlY29uZGFyeSwgI2ZmNTcyMSk7XG4kc2Vjb25kYXJ5Q29sb3JMaWdodDogI2Y2ZTVlMDtcblxuJGNvcnJlY3Q6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLCAjMWVhNDQ2KTtcbiRjb3JyZWN0RGFyazogIzBmNTIyMztcbiRjb3JyZWN0TGlnaHQ6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLXRleHQsICNlN2Y4ZWQpO1xuXG4kZXJyb3I6IHZhcigtLXpucy10aGVtZS1lcnJvciwgI2RjMzYyZSk7XG4kZXJyb3JEYXJrOiAjNjAxNDEwO1xuJGVycm9yTGlnaHQ6IHZhcigtLXpucy10aGVtZS1lcnJvci10ZXh0LCAjZmNlZWVlKTtcblxuJHdhcm5pbmc6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLCAjZGU2ODAwKTtcbiR3YXJuaW5nRGFyazogIzRhMjEwYTtcbiR3YXJuaW5nTGlnaHQ6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLXRleHQsICNmZmVlZTkpO1xuXG4kaW5mbzogIzM5OThkMztcbiRpbmZvRGFyazogIzAwNGE3NztcbiRpbmZvTGlnaHQ6ICNlY2YzZmU7XG5cbiRibGFjazogIzE4MTgxODtcbiR3aGl0ZTogI2ZmZmZmZjtcblxuJHRoZW1lQm9keUZhbWlseTogdmFyKC0tem5zLXRoZW1lLWJvZHktZmFtaWx5LCBcIlBvcHBpbnNcIiwgQXJpYWwsIHNhbnMtc2VyaWYpO1xuJHRoZW1lVGl0bGVGYW1pbHk6IHZhcigtLXpucy10aGVtZS10aXRsZS1mYW1pbHksIFwiTWVuZGFcIiwgXCJBcmlhbCBCbGFja1wiLCBzYW5zLXNlcmlmKTtcbiR0aGVtZU1vbm9zcGFjZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLW1vbm9zcGFjZS1mYW1pbHksIFwiQ291cmllciBOZXdcIiwgQ291cmllciwgbW9ub3NwYWNlKTtcblxuJHRoZW1lQmFja2dyb3VuZDogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQsICNmZmZmZmYpO1xuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQtc2Vjb25kYXJ5LCAjZjlmOWZjKTtcblxuJHRoZW1lVGV4dDogdmFyKC0tem5zLXRoZW1lLXRleHQsICMxODE4MTgpO1xuJHRoZW1lVGV4dE11dGVkOiB2YXIoLS16bnMtdGhlbWUtdGV4dC1tdXRlZCwgIzk2OTM5ZSk7XG4kdGhlbWVUZXh0U2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtdGV4dC1zZWNvbmRhcnksICM3Mzc3N2YpO1xuXG4kdGhlbWVIZWFkZXI6IHZhcigtLXpucy10aGVtZS1oZWFkZXIsICMxODE4MTgpO1xuJHRoZW1lSGVhZGVyVGV4dDogdmFyKC0tem5zLXRoZW1lLWhlYWRlci10ZXh0LCAjZmZmZmZmKTtcblxuJHRoZW1lQnV0dG9uOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLCAjMTgxODE4KTtcbiR0aGVtZUJ1dHRvblRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tdGV4dCwgI2ZmZmZmZik7XG4kdGhlbWVCdXR0b25Ib3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1ob3ZlciwgI2ZmNTcyMSk7XG5cbiR0aGVtZUJ1dHRvblNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnksICNlOWVjZWYpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktdGV4dCwgIzQ5NTA1Nyk7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktaG92ZXIsICNlOWVjZWYpO1xuXG4kdGhlbWVCb3JkZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXIsICNlM2UzZTMpO1xuJHRoZW1lQm9yZGVySG92ZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXItaG92ZXIsICNjM2M2Y2YpO1xuXG4kdGhlbWVDYXJkOiB2YXIoLS16bnMtdGhlbWUtY2FyZCwgI2ZmZmZmZik7XG4kdGhlbWVDYXJkQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtY2FyZC1ib3JkZXIsICNlZWVkZjEpO1xuXG4kdGhlbWVTaGFkb3c6IHZhcigtLXpucy10aGVtZS1zaGFkb3csIHJnYmEoMCwgMCwgMCwgMC4xKSk7XG5cbiRzbW9vdGhCZXppZXI6IGN1YmljLWJlemllcigwLjI1LCAwLjQsIDAuNywgMSk7XG5cbiRtYXhFeHRyYVNtYWxsOiA1OTVweDtcbiRtaW5TbWFsbDogNjAwcHg7XG4kbWVkaXVtOiA3NjhweDtcbiRsYXJnZTogODg5cHg7XG4kY29tcHV0ZXJzOiAxMjAwcHg7XG4iLCJAdXNlIFwiLi4vLi4vc3R5bGVzL3ZhcmlhYmxlc1wiO1xuQHVzZSBcIi4uLy4uL3N0eWxlcy9idXR0b25zXCI7XG5cbjpob3N0IHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBmbGV4LWdyb3c6IDE7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5zZW5kLWNvbmZpcm0ge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBtYXgtd2lkdGg6IHZhcigtLXpucy1jYXJkLXdpZHRoLCA1MzZweCk7XG4gICAgbWluLWhlaWdodDogdmFyKC0tem5zLWNhcmQtbWluLWhlaWdodCwgNzY4cHgpO1xuXG4gICAgJl9fbG9hZGVyIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICBpbnNldDogMDtcbiAgICAgICAgbWFyZ2luOiBhdXRvO1xuICAgICAgICB6LWluZGV4OiAyO1xuICAgIH1cblxuICAgICZfX2hlYWRlciB7XG4gICAgICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAxZnIpO1xuICAgICAgICBjb2x1bW4tZ2FwOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYWxpZ24tY29udGVudDogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHN0YXJ0O1xuICAgICAgICBnYXA6IGNhbGMoMjRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX19jb2wxLFxuICAgICZfX2NvbDMge1xuICAgICAgICBncmlkLWNvbHVtbjogc3BhbiAzO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIH1cblxuICAgICZfX2NvbDEge1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHN0YXJ0O1xuICAgIH1cblxuICAgICZfX2NvbDIge1xuICAgICAgICBncmlkLWNvbHVtbjogc3BhbiA0O1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgJl9fY29sMyB7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZW5kO1xuICAgIH1cblxuICAgICZfX3RpdGxlIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVUaXRsZUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDI0cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygyMHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMXB4O1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgIH1cblxuICAgICZfX2Zvcm0ge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogY2FsYygyNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGZsZXgtZ3JvdzogMTtcbiAgICB9XG5cbiAgICAmX196ZWxmLW5hbWUtZGlzcGxheSB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgfVxuXG4gICAgJl9fY29udGVudCB7XG4gICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgICZfX3RvdGFsIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICB9XG5cbiAgICAmX19mcm9tLXZhbHVlIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiB2YXJpYWJsZXMuJG1pblNtYWxsKSB7XG4gICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fc3VtbWFyeSB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBtYXJnaW4tdG9wOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19sYWJlbCB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDE0cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygyMHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMXB4O1xuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICB9XG5cbiAgICAmX192YWx1ZS1yb3cge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGZpbGwgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fdmFsdWUge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNXB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMjBweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjFweDtcbiAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICBtYXJnaW46IDA7XG5cbiAgICAgICAgJi0tY29sIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICB9XG5cbiAgICAgICAgJi0taXRlbXMtZW5kIHtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xuICAgICAgICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICAmLS1hZGRyZXNzIHtcbiAgICAgICAgICAgIG1heC13aWR0aDogNjAlO1xuICAgICAgICAgICAgb3ZlcmZsb3ctd3JhcDogYW55d2hlcmU7XG4gICAgICAgICAgICB0ZXh0LWFsaWduOiByaWdodDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogY2FsYygxM3B4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgICYtLWVycm9yIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fYXJyb3ctaWNvbiB7XG4gICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgIH1cblxuICAgICZfX2ZlZSB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEycHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygyMHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMXB4O1xuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICB9XG5cbiAgICAmX19wcmljZS1hbW91bnQtY29udGFpbmVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZ2FwOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX19wcmljZSB7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygzMnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZVRpdGxlRmFtaWx5O1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgfVxuXG4gICAgJl9fcHJpY2UtY3VycmVuY3kge1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTJweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAxcHg7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBtYXJnaW46IDAgMCBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX2ZlZS1yb3cge1xuICAgICAgICAuc2VuZC1jb25maXJtX192YWx1ZSB7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNDAwO1xuICAgICAgICB9XG5cbiAgICAgICAgLnNlbmQtY29uZmlybV9fbGFiZWwge1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBtZWRpYSAobWF4LXdpZHRoOiB2YXJpYWJsZXMuJG1pblNtYWxsKSB7XG4gICAgICAgICZfX3ByaWNlIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogY2FsYygyOHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgfVxuXG4gICAgICAgICZfX2xhYmVsIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogY2FsYygxMnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDE2cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgJl9fdmFsdWUge1xuICAgICAgICAgICAgZm9udC1zaXplOiBjYWxjKDEycHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMTZweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi56ZWxmLWFjdGlvbi1yb3ctLWNsaWNrYWJsZSB7XG4gICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgIC5zZW5kLWNvbmZpcm1fX3ZhbHVlIHtcbiAgICAgICAgdHJhbnNpdGlvbjogY29sb3IgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICB9XG5cbiAgICAuc2VuZC1jb25maXJtX19sYWJlbCB7XG4gICAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuMnMgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgfVxuXG4gICAgJjpob3ZlciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuXG4gICAgICAgIC5zZW5kLWNvbmZpcm1fX3ZhbHVlIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5zZW5kLWNvbmZpcm1fX2xhYmVsIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgLnNlbmQtY29uZmlybV9fdmFsdWUtcm93IHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLnplbGYtYWN0aW9uLXJvdy0tc2VsZWN0ZWQge1xuICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcblxuICAgIC5zZW5kLWNvbmZpcm1fX3ZhbHVlIHtcbiAgICAgICAgdHJhbnNpdGlvbjogY29sb3IgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICBmb250LXdlaWdodDogNDAwO1xuICAgIH1cblxuICAgIC5zZW5kLWNvbmZpcm1fX2xhYmVsIHtcbiAgICAgICAgdHJhbnNpdGlvbjogY29sb3IgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ },

/***/ 46524
/*!************************************************************************!*\
  !*** ./src/app/stellar-send-summary/stellar-send-summary.component.ts ***!
  \************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StellarSendSummaryComponent: () => (/* binding */ StellarSendSummaryComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 12481);





const _c0 = a0 => ({
  min: a0
});
function StellarSendSummaryComponent_ng_container_0_div_1_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 5)(1, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](3, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r1("send.stellar.below_min", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](4, _c0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](3, 1, ctx_r1.breakdown.preview.minReserveXlm, "1.0-7"))));
  }
}
function StellarSendSummaryComponent_ng_container_0_div_1_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 5)(1, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r1("send.stellar.classic_fund_first"));
  }
}
function StellarSendSummaryComponent_ng_container_0_div_1_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 5)(1, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r1("send.stellar.classic_trustline"));
  }
}
function StellarSendSummaryComponent_ng_container_0_div_1_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 5)(1, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r1("send.stellar.invalid_amount"));
  }
}
function StellarSendSummaryComponent_ng_container_0_div_1_div_5_div_5_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 12)(1, "span", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "span", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](5, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r1("send.stellar.line_transfer"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](5, 2, ctx_r1.breakdown.preview.transferPortionXlm, "1.0-7"), " XLM");
  }
}
function StellarSendSummaryComponent_ng_container_0_div_1_div_5_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 11)(1, "div", 12)(2, "span", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "span", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](6, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, StellarSendSummaryComponent_ng_container_0_div_1_div_5_div_5_div_7_Template, 6, 5, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r1("send.stellar.line_reserve"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](6, 3, ctx_r1.breakdown.preview.reservePortionXlm, "1.0-7"), " XLM");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.breakdown.preview.transferPortionXlm != null && ctx_r1.breakdown.preview.transferPortionXlm > 0);
  }
}
function StellarSendSummaryComponent_ng_container_0_div_1_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 6)(1, "h3", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "p", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](5, StellarSendSummaryComponent_ng_container_0_div_1_div_5_div_5_Template, 8, 6, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "p", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r1("send.stellar.new_account_title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r1("send.stellar.new_account_subtitle"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.breakdown.preview.reservePortionXlm != null);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r1("send.stellar.fee_separate"));
  }
}
function StellarSendSummaryComponent_ng_container_0_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, StellarSendSummaryComponent_ng_container_0_div_1_div_1_Template, 4, 6, "div", 3)(2, StellarSendSummaryComponent_ng_container_0_div_1_div_2_Template, 3, 1, "div", 3)(3, StellarSendSummaryComponent_ng_container_0_div_1_div_3_Template, 3, 1, "div", 3)(4, StellarSendSummaryComponent_ng_container_0_div_1_div_4_Template, 3, 1, "div", 3)(5, StellarSendSummaryComponent_ng_container_0_div_1_div_5_Template, 8, 4, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.breakdown.preview.amountBelowMinimum);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.has("classic_fund_first"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.has("classic_trustline"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.has("invalid_amount"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.showNewAccountDetails());
  }
}
function StellarSendSummaryComponent_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, StellarSendSummaryComponent_ng_container_0_div_1_Template, 6, 5, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainerEnd"]();
  }
}
class StellarSendSummaryComponent {
  breakdown = null;
  has(key) {
    return !!this.breakdown?.preview.warningKeys.includes(key);
  }
  showNewAccountDetails() {
    const p = this.breakdown?.preview;
    if (!p || p.amountBelowMinimum) return false;
    return p.destinationAccountMissing && (p.mode === "create_only" || p.mode === "create_and_pay");
  }
  static ɵfac = function StellarSendSummaryComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || StellarSendSummaryComponent)();
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: StellarSendSummaryComponent,
    selectors: [["stellar-send-summary"]],
    inputs: {
      breakdown: "breakdown"
    },
    decls: 1,
    vars: 1,
    consts: [[4, "ngIf"], ["class", "stellar-send-summary", 4, "transloco"], [1, "stellar-send-summary"], ["class", "zelf-message zelf-message--error", 4, "ngIf"], ["class", "stellar-send-summary__panel", 4, "ngIf"], [1, "zelf-message", "zelf-message--error"], [1, "stellar-send-summary__panel"], [1, "stellar-send-summary__title"], [1, "stellar-send-summary__subtitle"], ["class", "stellar-send-summary__breakdown", 4, "ngIf"], [1, "stellar-send-summary__fee-note"], [1, "stellar-send-summary__breakdown"], [1, "zelf-action-row", "stellar-send-summary__row"], [1, "stellar-send-summary__label"], [1, "stellar-send-summary__value"], ["class", "zelf-action-row stellar-send-summary__row", 4, "ngIf"]],
    template: function StellarSendSummaryComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, StellarSendSummaryComponent_ng_container_0_Template, 2, 0, "ng-container", 0);
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.breakdown);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_0__.NgIf, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_1__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_1__.TranslocoDirective, _angular_common__WEBPACK_IMPORTED_MODULE_0__.DecimalPipe],
    styles: [".stellar-send-summary[_ngcontent-%COMP%] {\n  margin-top: 12px;\n}\n\n.stellar-send-summary__panel[_ngcontent-%COMP%] {\n  align-items: stretch;\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  border-radius: 12px;\n  display: flex;\n  flex-direction: column;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  gap: 12px;\n  padding: 16px;\n  text-align: left;\n}\n\n.stellar-send-summary__title[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-size: 16px;\n  font-weight: 600;\n  letter-spacing: 0.1px;\n  line-height: 22px;\n  margin: 0;\n}\n\n.stellar-send-summary__subtitle[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 13px;\n  font-weight: 500;\n  letter-spacing: 0.1px;\n  line-height: 1.45;\n  margin: 0;\n}\n\n.stellar-send-summary__breakdown[_ngcontent-%COMP%] {\n  background: var(--zns-theme-card-border, #eeedf1);\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  border-radius: 10px;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  padding: 12px;\n}\n\n.stellar-send-summary__row[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n\n.stellar-send-summary__label[_ngcontent-%COMP%] {\n  flex: 1;\n  font-size: 13px;\n  color: var(--zns-theme-text-secondary, #73777f);\n}\n\n.stellar-send-summary__value[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-size: 13px;\n  font-weight: 600;\n}\n\n.stellar-send-summary__fee-note[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 12px;\n  font-weight: 500;\n  letter-spacing: 0.1px;\n  line-height: 1.45;\n  margin: 0;\n  opacity: 0.9;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc3RlbGxhci1zZW5kLXN1bW1hcnkvc3RlbGxhci1zZW5kLXN1bW1hcnkuY29tcG9uZW50LnNjc3MiLCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL192YXJpYWJsZXMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNJLGdCQUFBO0FBREo7O0FBSUE7RUFDSSxvQkFBQTtFQUNBLGtEQUFBO0VBQ0EsbUJBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSx1RUNZYztFRFhkLFNBQUE7RUFDQSxhQUFBO0VBQ0EsZ0JBQUE7QUFESjs7QUFJQTtFQUNJLHFDQ1lRO0VEWFIsZUFBQTtFQUNBLGdCQUFBO0VBQ0EscUJBQUE7RUFDQSxpQkFBQTtFQUNBLFNBQUE7QUFESjs7QUFJQTtFQUNJLCtDQ0tpQjtFREpqQixlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQkFBQTtFQUNBLGlCQUFBO0VBQ0EsU0FBQTtBQURKOztBQUlBO0VBQ0ksaURDYWM7RURaZCxrREFBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsUUFBQTtFQUNBLGFBQUE7QUFESjs7QUFJQTtFQUNJLGdCQUFBO0FBREo7O0FBSUE7RUFDSSxPQUFBO0VBQ0EsZUFBQTtFQUNBLCtDQ3BCaUI7QURtQnJCOztBQUlBO0VBQ0kscUNDMUJRO0VEMkJSLGVBQUE7RUFDQSxnQkFBQTtBQURKOztBQUlBO0VBQ0ksK0NDOUJpQjtFRCtCakIsZUFBQTtFQUNBLGdCQUFBO0VBQ0EscUJBQUE7RUFDQSxpQkFBQTtFQUNBLFNBQUE7RUFDQSxZQUFBO0FBREoiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwiLi4vLi4vc3R5bGVzL3ZhcmlhYmxlc1wiO1xuXG4uc3RlbGxhci1zZW5kLXN1bW1hcnkge1xuICAgIG1hcmdpbi10b3A6IDEycHg7XG59XG5cbi5zdGVsbGFyLXNlbmQtc3VtbWFyeV9fcGFuZWwge1xuICAgIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG4gICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgIGdhcDogMTJweDtcbiAgICBwYWRkaW5nOiAxNnB4O1xuICAgIHRleHQtYWxpZ246IGxlZnQ7XG59XG5cbi5zdGVsbGFyLXNlbmQtc3VtbWFyeV9fdGl0bGUge1xuICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICBmb250LXNpemU6IDE2cHg7XG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICBsZXR0ZXItc3BhY2luZzogMC4xcHg7XG4gICAgbGluZS1oZWlnaHQ6IDIycHg7XG4gICAgbWFyZ2luOiAwO1xufVxuXG4uc3RlbGxhci1zZW5kLXN1bW1hcnlfX3N1YnRpdGxlIHtcbiAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgZm9udC1zaXplOiAxM3B4O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuMXB4O1xuICAgIGxpbmUtaGVpZ2h0OiAxLjQ1O1xuICAgIG1hcmdpbjogMDtcbn1cblxuLnN0ZWxsYXItc2VuZC1zdW1tYXJ5X19icmVha2Rvd24ge1xuICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG4gICAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgZ2FwOiA0cHg7XG4gICAgcGFkZGluZzogMTJweDtcbn1cblxuLnN0ZWxsYXItc2VuZC1zdW1tYXJ5X19yb3cge1xuICAgIG1hcmdpbi1ib3R0b206IDA7XG59XG5cbi5zdGVsbGFyLXNlbmQtc3VtbWFyeV9fbGFiZWwge1xuICAgIGZsZXg6IDE7XG4gICAgZm9udC1zaXplOiAxM3B4O1xuICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbn1cblxuLnN0ZWxsYXItc2VuZC1zdW1tYXJ5X192YWx1ZSB7XG4gICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICBmb250LXdlaWdodDogNjAwO1xufVxuXG4uc3RlbGxhci1zZW5kLXN1bW1hcnlfX2ZlZS1ub3RlIHtcbiAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuMXB4O1xuICAgIGxpbmUtaGVpZ2h0OiAxLjQ1O1xuICAgIG1hcmdpbjogMDtcbiAgICBvcGFjaXR5OiAwLjk7XG59XG4iLCIkcHJpbWFyeUNvbG9yOiB2YXIoLS16bnMtdGhlbWUtcHJpbWFyeSwgIzE4MTgxOCk7XG4kcHJpbWFyeUxpZ2h0OiAjZGFkZGZhO1xuJHNlY29uZGFyeUNvbG9yOiB2YXIoLS16bnMtdGhlbWUtc2Vjb25kYXJ5LCAjZmY1NzIxKTtcbiRzZWNvbmRhcnlDb2xvckxpZ2h0OiAjZjZlNWUwO1xuXG4kY29ycmVjdDogdmFyKC0tem5zLXRoZW1lLXN1Y2Nlc3MsICMxZWE0NDYpO1xuJGNvcnJlY3REYXJrOiAjMGY1MjIzO1xuJGNvcnJlY3RMaWdodDogdmFyKC0tem5zLXRoZW1lLXN1Y2Nlc3MtdGV4dCwgI2U3ZjhlZCk7XG5cbiRlcnJvcjogdmFyKC0tem5zLXRoZW1lLWVycm9yLCAjZGMzNjJlKTtcbiRlcnJvckRhcms6ICM2MDE0MTA7XG4kZXJyb3JMaWdodDogdmFyKC0tem5zLXRoZW1lLWVycm9yLXRleHQsICNmY2VlZWUpO1xuXG4kd2FybmluZzogdmFyKC0tem5zLXRoZW1lLXdhcm5pbmcsICNkZTY4MDApO1xuJHdhcm5pbmdEYXJrOiAjNGEyMTBhO1xuJHdhcm5pbmdMaWdodDogdmFyKC0tem5zLXRoZW1lLXdhcm5pbmctdGV4dCwgI2ZmZWVlOSk7XG5cbiRpbmZvOiAjMzk5OGQzO1xuJGluZm9EYXJrOiAjMDA0YTc3O1xuJGluZm9MaWdodDogI2VjZjNmZTtcblxuJGJsYWNrOiAjMTgxODE4O1xuJHdoaXRlOiAjZmZmZmZmO1xuXG4kdGhlbWVCb2R5RmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtYm9keS1mYW1pbHksIFwiUG9wcGluc1wiLCBBcmlhbCwgc2Fucy1zZXJpZik7XG4kdGhlbWVUaXRsZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLXRpdGxlLWZhbWlseSwgXCJNZW5kYVwiLCBcIkFyaWFsIEJsYWNrXCIsIHNhbnMtc2VyaWYpO1xuJHRoZW1lTW9ub3NwYWNlRmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtbW9ub3NwYWNlLWZhbWlseSwgXCJDb3VyaWVyIE5ld1wiLCBDb3VyaWVyLCBtb25vc3BhY2UpO1xuXG4kdGhlbWVCYWNrZ3JvdW5kOiB2YXIoLS16bnMtdGhlbWUtYmFja2dyb3VuZCwgI2ZmZmZmZik7XG4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtYmFja2dyb3VuZC1zZWNvbmRhcnksICNmOWY5ZmMpO1xuXG4kdGhlbWVUZXh0OiB2YXIoLS16bnMtdGhlbWUtdGV4dCwgIzE4MTgxOCk7XG4kdGhlbWVUZXh0TXV0ZWQ6IHZhcigtLXpucy10aGVtZS10ZXh0LW11dGVkLCAjOTY5MzllKTtcbiR0aGVtZVRleHRTZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS10ZXh0LXNlY29uZGFyeSwgIzczNzc3Zik7XG5cbiR0aGVtZUhlYWRlcjogdmFyKC0tem5zLXRoZW1lLWhlYWRlciwgIzE4MTgxOCk7XG4kdGhlbWVIZWFkZXJUZXh0OiB2YXIoLS16bnMtdGhlbWUtaGVhZGVyLXRleHQsICNmZmZmZmYpO1xuXG4kdGhlbWVCdXR0b246IHZhcigtLXpucy10aGVtZS1idXR0b24sICMxODE4MTgpO1xuJHRoZW1lQnV0dG9uVGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi10ZXh0LCAjZmZmZmZmKTtcbiR0aGVtZUJ1dHRvbkhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLWhvdmVyLCAjZmY1NzIxKTtcblxuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeSwgI2U5ZWNlZik7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeS10ZXh0LCAjNDk1MDU3KTtcbiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeS1ob3ZlciwgI2U5ZWNlZik7XG5cbiR0aGVtZUJvcmRlcjogdmFyKC0tem5zLXRoZW1lLWJvcmRlciwgI2UzZTNlMyk7XG4kdGhlbWVCb3JkZXJIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJvcmRlci1ob3ZlciwgI2MzYzZjZik7XG5cbiR0aGVtZUNhcmQ6IHZhcigtLXpucy10aGVtZS1jYXJkLCAjZmZmZmZmKTtcbiR0aGVtZUNhcmRCb3JkZXI6IHZhcigtLXpucy10aGVtZS1jYXJkLWJvcmRlciwgI2VlZWRmMSk7XG5cbiR0aGVtZVNoYWRvdzogdmFyKC0tem5zLXRoZW1lLXNoYWRvdywgcmdiYSgwLCAwLCAwLCAwLjEpKTtcblxuJHNtb290aEJlemllcjogY3ViaWMtYmV6aWVyKDAuMjUsIDAuNCwgMC43LCAxKTtcblxuJG1heEV4dHJhU21hbGw6IDU5NXB4O1xuJG1pblNtYWxsOiA2MDBweDtcbiRtZWRpdW06IDc2OHB4O1xuJGxhcmdlOiA4ODlweDtcbiRjb21wdXRlcnM6IDEyMDBweDtcbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }

}]);
//# sourceMappingURL=src_app_send-confirm_send-confirm_component_ts.js.map