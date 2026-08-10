"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_zelf-keys_zelf-keys-payment-cards_zelf-keys-payment-card-detail_zelf-keys-payment-car-af4ba1"],{

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

/***/ 94557
/*!****************************************************************************************************************************!*\
  !*** ./src/app/zelf-keys/zelf-keys-payment-cards/zelf-keys-payment-card-detail/zelf-keys-payment-card-detail.component.ts ***!
  \****************************************************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZelfKeysPaymentCardDetailComponent: () => (/* binding */ ZelfKeysPaymentCardDetailComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 33900);
/* harmony import */ var _base_copy_to_clipboard_copy_to_clipboard_base__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../base/copy-to-clipboard/copy-to-clipboard.base */ 88070);
/* harmony import */ var _popout_decryptor_popout_decryptor_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../popout-decryptor/popout-decryptor.component */ 37942);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/bottom-sheet */ 15244);
/* harmony import */ var _services_payment_card_data_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../services/payment-card-data.service */ 52440);
/* harmony import */ var _services_popout_communication_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../services/popout-communication.service */ 8298);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var _services_scroll_to_section_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../services/scroll-to-section.service */ 51001);
/* harmony import */ var app_services_zelf_keys_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! app/services/zelf-keys.service */ 52368);
/* harmony import */ var _chrome_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../chrome.service */ 85043);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/snack-bar */ 3347);

















function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_24_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r4("zelf_keys.payment_cards.decrypt.button"));
  }
}
function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_24_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r4("zelf_keys.payment_cards.decrypt.decrypting"));
  }
}
function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 25)(1, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_24_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.onDecryptClick());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](2, ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_24_span_2_Template, 2, 1, "span", 27)(3, ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_24_span_3_Template, 2, 1, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("disabled", ctx_r1.isLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r1.isLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.isLoading);
  }
}
function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 28)(1, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx_r1.error);
  }
}
function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_26_ng_container_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainer"](0);
  }
}
function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 29)(1, "h3", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "div", 31)(4, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "div", 33)(7, "span", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](9, "button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_26_Template_button_click_9_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.onCopyPaymentCardId());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](10, ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_26_ng_container_10_Template, 1, 0, "ng-container", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](11, "div", 31)(12, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](14, "p", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](16, "div", 31)(17, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](19, "p", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](21, "div", 38)(22, "h4", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](24, "div", 39)(25, "img", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("error", function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_26_Template_img_error_25_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.onImageError($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](26, "div", 41)(27, "button", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_26_Template_button_click_27_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.onDownloadZelfProof());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](28, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](29, "svg", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](30, "path", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](31, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()()()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    const clipboardIcon_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r4("zelf_keys.payment_cards.info.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r4("zelf_keys.payment_cards.info.payment_card_id"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx_r1.paymentCard.id);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("title", t_r4("zelf_keys.payment_cards.info.copy_payment_card_id"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngTemplateOutlet", clipboardIcon_r6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r4("zelf_keys.payment_cards.info.type"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx_r1.getPaymentCardType());
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r4("zelf_keys.payment_cards.info.folder"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx_r1.paymentCard.publicData.folder || t_r4("zelf_keys.common.no_folder"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r4("zelf_keys.payment_cards.zelfproof.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("src", ctx_r1.paymentCard.url, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵattribute"]("alt", t_r4("zelf_keys.payment_cards.zelfproof.title") + " - " + ctx_r1.getCardBankName());
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r4("zelf_keys.payment_cards.zelfproof.download"));
  }
}
function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_ng_container_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainer"](0);
  }
}
function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27__svg_svg_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "svg", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](1, "path", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27__svg_svg_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "svg", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](1, "path", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_ng_container_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainer"](0);
  }
}
function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_ng_container_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainer"](0);
  }
}
function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27__svg_svg_37_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "svg", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](1, "path", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27__svg_svg_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "svg", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](1, "path", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_ng_container_40_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainer"](0);
  }
}
function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_ng_container_48_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainer"](0);
  }
}
function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 46)(1, "h4", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "div", 31)(4, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "div", 47)(7, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](9, "button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_Template_button_click_9_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.onCopyCardName());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](10, ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_ng_container_10_Template, 1, 0, "ng-container", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](11, "div", 31)(12, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](14, "div", 48)(15, "span", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](17, "button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_Template_button_click_17_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.onToggleCardNumberVisibility());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](18, ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27__svg_svg_18_Template, 2, 0, "svg", 50)(19, ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27__svg_svg_19_Template, 2, 0, "svg", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](20, "button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_Template_button_click_20_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.onCopyCardNumber());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](21, ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_ng_container_21_Template, 1, 0, "ng-container", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](22, "div", 31)(23, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](25, "div", 47)(26, "span", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](28, "button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_Template_button_click_28_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.onCopyExpiryDate());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](29, ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_ng_container_29_Template, 1, 0, "ng-container", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](30, "div", 31)(31, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](33, "div", 51)(34, "span", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](36, "button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_Template_button_click_36_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.onToggleCvvVisibility());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](37, ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27__svg_svg_37_Template, 2, 0, "svg", 50)(38, ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27__svg_svg_38_Template, 2, 0, "svg", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](39, "button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_Template_button_click_39_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.onCopyCvv());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](40, ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_ng_container_40_Template, 1, 0, "ng-container", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](41, "div", 31)(42, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](43);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](44, "div", 47)(45, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](46);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](47, "button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_Template_button_click_47_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.onCopyBankName());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](48, ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_ng_container_48_Template, 1, 0, "ng-container", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    const clipboardIcon_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r4("zelf_keys.payment_cards.decrypted.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r4("zelf_keys.payment_cards.decrypted.card_holder_name"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx_r1.decryptedData.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("title", t_r4("zelf_keys.payment_cards.decrypted.copy_card_holder_name"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngTemplateOutlet", clipboardIcon_r6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r4("zelf_keys.payment_cards.labels.card_number"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", ctx_r1.getMaskedCardNumber(), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("title", ctx_r1.showCardNumber ? t_r4("zelf_keys.payment_cards.decrypted.hide_card_number") : t_r4("zelf_keys.payment_cards.decrypted.show_card_number"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r1.showCardNumber);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.showCardNumber);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("title", t_r4("zelf_keys.payment_cards.decrypted.copy_card_number"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngTemplateOutlet", clipboardIcon_r6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r4("zelf_keys.payment_cards.labels.expiry_date"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx_r1.decryptedData.expires);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("title", t_r4("zelf_keys.payment_cards.decrypted.copy_expiry_date"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngTemplateOutlet", clipboardIcon_r6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r4("zelf_keys.payment_cards.labels.cvv"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", ctx_r1.showCvv ? ctx_r1.decryptedData.cvv || "N/A" : "\u2022\u2022\u2022", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("title", ctx_r1.showCvv ? t_r4("zelf_keys.payment_cards.decrypted.hide_cvv") : t_r4("zelf_keys.payment_cards.decrypted.show_cvv"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r1.showCvv);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.showCvv);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("title", t_r4("zelf_keys.payment_cards.decrypted.copy_cvv"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngTemplateOutlet", clipboardIcon_r6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r4("zelf_keys.payment_cards.labels.bank_name"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx_r1.decryptedData.bankName);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("title", t_r4("zelf_keys.payment_cards.decrypted.copy_bank_name"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngTemplateOutlet", clipboardIcon_r6);
  }
}
function ZelfKeysPaymentCardDetailComponent_div_0_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 5)(1, "div", 6)(2, "button", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ZelfKeysPaymentCardDetailComponent_div_0_div_1_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.onBackToList());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "svg", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](4, "path", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "div", 10)(6, "div", 11)(7, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](9, "div", 13)(10, "img", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("error", function ZelfKeysPaymentCardDetailComponent_div_0_div_1_Template_img_error_10_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.onImageError($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](11, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](13, "div", 16)(14, "div", 17)(15, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](17, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](19, "div", 20)(20, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](21);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](22, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](24, ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_24_Template, 4, 3, "div", 21)(25, ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_25_Template, 3, 1, "div", 22)(26, ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_26_Template, 33, 13, "div", 23)(27, ZelfKeysPaymentCardDetailComponent_div_0_div_1_div_27_Template, 49, 27, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵclassMap"](ctx_r1.getCardType().toLowerCase());
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵstyleProp"]("background", ctx_r1.getCardGradient());
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx_r1.getCardBankName());
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("src", ctx_r1.paymentCard == null ? null : ctx_r1.paymentCard.url, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵattribute"]("alt", t_r4("zelf_keys.payment_cards.zelfproof.title") + " - " + ctx_r1.getCardBankName());
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx_r1.getMaskedCardNumber());
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r4("zelf_keys.payment_cards.labels.card_holder"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"]((ctx_r1.decryptedData == null ? null : ctx_r1.decryptedData.name) || t_r4("zelf_keys.payment_cards.placeholders.card_holder_upper"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r4("zelf_keys.payment_cards.labels.expires"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx_r1.getExpiryDate());
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r1.isDecrypted && !ctx_r1.showBiometrics);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.error);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.paymentCard);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.isDecrypted && ctx_r1.decryptedData);
  }
}
function ZelfKeysPaymentCardDetailComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, ZelfKeysPaymentCardDetailComponent_div_0_div_1_Template, 28, 16, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r1.showBiometrics);
  }
}
function ZelfKeysPaymentCardDetailComponent_popout_decryptor_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "popout-decryptor", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("close", function ZelfKeysPaymentCardDetailComponent_popout_decryptor_1_Template_popout_decryptor_close_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r8);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.showPopoutDecryptor = false);
    })("decryptedData", function ZelfKeysPaymentCardDetailComponent_popout_decryptor_1_Template_popout_decryptor_decryptedData_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r8);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.handleDecryptionResult($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
function ZelfKeysPaymentCardDetailComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "svg", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](1, "path", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
class ZelfKeysPaymentCardDetailComponent extends _base_copy_to_clipboard_copy_to_clipboard_base__WEBPACK_IMPORTED_MODULE_5__.CopyToClipboardBase {
  _bottomSheet;
  _changeDetectorRef;
  _paymentCardDataService;
  _popoutCommunicationService;
  _router;
  _scrollToSectionService;
  _zelfKeysService;
  _chromeService;
  _snackBar;
  _translocoService;
  _destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__.Subject();
  decryptedData = null;
  error = null;
  isDecrypted = false;
  isLoading = false;
  isPopout = false;
  paymentCard = null;
  showBiometrics = false;
  showCardNumber = false;
  showCvv = false;
  showPopoutDecryptor = false;
  constructor(_bottomSheet, _changeDetectorRef, _paymentCardDataService, _popoutCommunicationService, _router, _scrollToSectionService, _zelfKeysService, _chromeService, _snackBar, _translocoService) {
    super(_chromeService, _snackBar, _translocoService);
    this._bottomSheet = _bottomSheet;
    this._changeDetectorRef = _changeDetectorRef;
    this._paymentCardDataService = _paymentCardDataService;
    this._popoutCommunicationService = _popoutCommunicationService;
    this._router = _router;
    this._scrollToSectionService = _scrollToSectionService;
    this._zelfKeysService = _zelfKeysService;
    this._chromeService = _chromeService;
    this._snackBar = _snackBar;
    this._translocoService = _translocoService;
    this.isPopout = this._chromeService.isPopout;
    this._initSubscriptions();
  }
  ngOnInit() {
    this.loadPaymentCardData();
  }
  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
    this._popoutCommunicationService.clearDecryptionData();
    this._popoutCommunicationService.clearDecryptionResult();
    chrome.runtime.onMessage.removeListener(this._handleDecryptionResultListener);
  }
  getCardBankName() {
    if (this.paymentCard?.publicData?.card) {
      try {
        const cardData = this._parseJsonSafely(this.paymentCard.publicData.card);
        return cardData.bankName || this._translocoService.translate("zelf_keys.data_types.payment_card");
      } catch {
        return this._translocoService.translate("zelf_keys.data_types.payment_card");
      }
    }
    return this._translocoService.translate("zelf_keys.data_types.payment_card");
  }
  loadPaymentCardData() {
    this.paymentCard = this._paymentCardDataService.getCurrentPaymentCard();
    if (!this.paymentCard) {
      setTimeout(() => {
        this._router.navigate(["/zelf-keys/vault"]);
      }, 100);
      return;
    }
    // Ensure publicData has required fields
    if (this.paymentCard.publicData && !this.paymentCard.publicData.type) {
      this.paymentCard.publicData.type = "credit_card";
    }
  }
  onDecryptClick() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this.isDecrypted) {
        _this._scrollToSectionService.scrollToSection("payment-card-decrypted-content", "payment-card");
        return;
      }
      if (_this.isPopout) {
        _this.showPopoutDecryptor = true;
        _this._setDecryptionDataForService();
        return;
      }
      const isPopoutOpen = yield _this._popoutCommunicationService.isPopoutOpen();
      const payload = _this.decryptionPayload;
      if (isPopoutOpen) {
        yield _this._popoutCommunicationService.redirectPopout("popout-decryptor", payload);
      } else {
        yield _this._popoutCommunicationService.openPopout("popout-decryptor", payload);
      }
      chrome.runtime.onMessage.addListener(_this._handleDecryptionResultListener);
    })();
  }
  handleDecryptionResult(data) {
    if (!data || !this.paymentCard) return;
    // Parse the card data from publicData.card JSON string if needed for fallback
    let cardData = {};
    try {
      if (data?.card) {
        cardData = this._parseJsonSafely(data.card);
      }
    } catch (error) {
      console.warn("Failed to parse card data from publicData.card");
    }
    this.decryptedData = {
      name: cardData.name || "",
      number: data.number || data.cardNumber || "",
      expires: data.expiryMonth && data.expiryYear ? `${data.expiryMonth}/${data.expiryYear}` : cardData.expires || "",
      bankName: cardData.bankName || "",
      cvv: data.cvv || ""
    };
    this.isDecrypted = true;
    this._changeDetectorRef.detectChanges();
    // Trigger scroll to decrypted content section
    setTimeout(() => {
      this._scrollToSectionService.scrollToSection("payment-card-decrypted-content", "payment-card");
    }, 500);
  }
  get decryptionPayload() {
    if (!this.paymentCard) return null;
    return {
      requestId: this.paymentCard.id,
      type: "payment-card",
      zelfProof: this.paymentCard.zelfProof || this.paymentCard?.publicData?.zelfProof || "",
      publicData: {
        title: this.getCardBankName(),
        website: "Payment Card"
      }
    };
  }
  _handleDecryptionResultListener = message => {
    if (message.type === "DECRYPTION_RESULT_FROM_POPOUT" && this.paymentCard?.id === message.payload?.requestId) {
      this.handleDecryptionResult(message.payload?.result?.data);
      chrome.runtime.onMessage.removeListener(this._handleDecryptionResultListener);
    }
    return true;
  };
  _initSubscriptions() {
    this._chromeService.isPopout$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.takeUntil)(this._destroy$)).subscribe(isPopout => {
      this.isPopout = isPopout;
    });
    this._popoutCommunicationService.decryptionResult$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.takeUntil)(this._destroy$)).subscribe(result => {
      if (!result?.success || !this.showPopoutDecryptor) return;
      this.handleDecryptionResult(result.data);
      this.showPopoutDecryptor = false;
    });
  }
  _setDecryptionDataForService() {
    if (!this.isPopout) return;
    this._popoutCommunicationService.setDecryptionData(this.decryptionPayload);
  }
  onBackToList() {
    this._router.navigate(["/zelf-keys/vault"]);
  }
  onCopyCardName() {
    if (this.decryptedData?.name) {
      this._copyToClipboard(this.decryptedData.name);
    }
  }
  onCopyCardNumber() {
    if (this.decryptedData?.number) {
      this._copyToClipboard(this.decryptedData.number);
    }
  }
  onCopyExpiryDate() {
    if (this.decryptedData?.expires) {
      this._copyToClipboard(this.decryptedData.expires);
    }
  }
  onCopyBankName() {
    if (this.decryptedData?.bankName) {
      this._copyToClipboard(this.decryptedData.bankName);
    }
  }
  onToggleCvvVisibility() {
    this.showCvv = !this.showCvv;
  }
  onCopyCvv() {
    if (this.decryptedData?.cvv) {
      this._copyToClipboard(this.decryptedData.cvv);
    }
  }
  onToggleCardNumberVisibility() {
    this.showCardNumber = !this.showCardNumber;
  }
  onCopyPaymentCardId() {
    if (this.paymentCard?.id) {
      this._copyToClipboard(this.paymentCard.id);
    }
  }
  onCopyZelfProof() {
    if (this.paymentCard?.publicData?.zelfProof) {
      this._copyToClipboard(this.paymentCard.publicData.zelfProof);
    }
  }
  onImageError(event) {
    const img = event.target;
    img.style.display = "none";
  }
  onDownloadZelfProof() {
    if (this.paymentCard?.url) {
      const link = document.createElement("a");
      link.href = this.paymentCard.url;
      link.download = `zelfproof-${this.paymentCard.id}.png`;
      link.click();
    }
  }
  getCardType() {
    // If decrypted, determine card type from number
    if (this.isDecrypted && this.decryptedData?.number) {
      const number = this.decryptedData.number.replace(/\s/g, "");
      if (number.startsWith("4")) return "VISA";
      if (number.startsWith("5") || number.startsWith("2")) return "MASTERCARD";
      if (number.startsWith("3")) return "AMEX";
      if (number.startsWith("6")) return "DISCOVER";
    }
    // If not decrypted, show generic card type
    return "CARD";
  }
  getMaskedCardNumber() {
    // If decrypted, show masked or full number based on visibility
    if (this.isDecrypted && this.decryptedData?.number) {
      if (this.showCardNumber) {
        return this.decryptedData.number;
      }
      const number = this.decryptedData.number.replace(/\s/g, "");
      const lastFour = number.slice(-4);
      const maskedLength = number.length - 4;
      const masked = "•".repeat(maskedLength);
      // Format with spaces like a typical card number
      return masked + " " + lastFour;
    }
    // If not decrypted, try to get last 4 digits from public data
    if (this.paymentCard?.publicData?.card) {
      try {
        const cardData = this._parseJsonSafely(this.paymentCard.publicData.card);
        if (cardData.number) {
          const number = cardData.number.replace(/\s/g, "");
          const lastFour = number.slice(-4);
          return `•••• •••• •••• ${lastFour}`;
        }
      } catch {
        // Fall through to generic pattern
      }
    }
    // Fallback to generic masked pattern
    return "•••• •••• •••• ••••";
  }
  getExpiryDate() {
    // If decrypted, show actual expiry
    if (this.isDecrypted && this.decryptedData?.expires) {
      return this.decryptedData.expires;
    }
    // If not decrypted, try to get expiry from public data
    if (this.paymentCard?.publicData?.card) {
      try {
        const cardData = this._parseJsonSafely(this.paymentCard.publicData.card);
        if (cardData.expires) {
          return cardData.expires;
        }
      } catch {
        // Fall through to generic pattern
      }
    }
    // Fallback to generic pattern
    return this._translocoService.translate("zelf_keys.payment_cards.detail.expiry_placeholder");
  }
  getPaymentCardType() {
    const type = this.paymentCard?.publicData?.type;
    if (!type) {
      return "N/A";
    }
    // Map type values to translation keys
    switch (type) {
      case "credit_card":
        return this._translocoService.translate("zelf_keys.data_types.payment_card");
      default:
        return type;
    }
  }
  getCardGradient() {
    // If decrypted, use card type-specific colors
    if (this.isDecrypted && this.decryptedData) {
      const cardType = this.getCardType().toLowerCase();
      switch (cardType) {
        case "visa":
          return "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)";
        case "mastercard":
          return "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)";
        case "amex":
          return "linear-gradient(135deg, #0066cc 0%, #004499 100%)";
        case "discover":
          return "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)";
        default:
          return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      }
    }
    // If not decrypted, use the same dynamic color system as the main list
    if (this.paymentCard?.publicData?.zelfProof) {
      return this.getDynamicCardGradient(this.paymentCard.publicData.zelfProof);
    }
    // Fallback
    return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  }
  _parseJsonSafely(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch {
      return {};
    }
  }
  getCardColor(zelfProof) {
    // Use zelfProof as seed for consistent colors
    let hash = 0;
    for (let i = 0; i < zelfProof.length; i++) {
      const char = zelfProof.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Generate color based on hash
    const hue = Math.abs(hash) % 360;
    const saturation = 60 + Math.abs(hash) % 30; // 60-90%
    const lightness = 45 + Math.abs(hash) % 20; // 45-65%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  getDynamicCardGradient(zelfProof) {
    const baseColor = this.getCardColor(zelfProof);
    // Convert HSL to RGB for gradient calculation
    const hsl = baseColor.match(/\d+/g);
    if (!hsl) return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    const h = parseInt(hsl[0]);
    const s = parseInt(hsl[1]);
    const l = parseInt(hsl[2]);
    // Create a complementary color for gradient
    const complementaryH = (h + 180) % 360;
    const lighterL = Math.min(95, l + 20);
    const darkerL = Math.max(25, l - 20);
    return `linear-gradient(135deg, hsl(${h}, ${s}%, ${lighterL}%) 0%, hsl(${complementaryH}, ${s}%, ${darkerL}%) 100%)`;
  }
  static ɵfac = function ZelfKeysPaymentCardDetailComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ZelfKeysPaymentCardDetailComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_10__.MatBottomSheet), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_7__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_services_payment_card_data_service__WEBPACK_IMPORTED_MODULE_11__.PaymentCardDataService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_services_popout_communication_service__WEBPACK_IMPORTED_MODULE_12__.PopoutCommunicationService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_13__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_services_scroll_to_section_service__WEBPACK_IMPORTED_MODULE_14__.ScrollToSectionService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](app_services_zelf_keys_service__WEBPACK_IMPORTED_MODULE_15__.ZelfKeysService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_chrome_service__WEBPACK_IMPORTED_MODULE_16__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_17__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_jsverse_transloco__WEBPACK_IMPORTED_MODULE_2__.TranslocoService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({
    type: ZelfKeysPaymentCardDetailComponent,
    selectors: [["zelf-keys-payment-card-detail"]],
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵInheritDefinitionFeature"]],
    decls: 4,
    vars: 1,
    consts: [["clipboardIcon", ""], ["class", "payment-card-detail", 4, "transloco"], ["mode", "embedded", 3, "close", "decryptedData", 4, "ngIf"], [1, "payment-card-detail"], ["class", "payment-card-detail__content", 4, "ngIf"], [1, "payment-card-detail__content"], [1, "payment-card-detail__card-wrapper"], ["mat-flat-button", "", 1, "zelf-icon-button", "zelf-icon-button--secondary", "zelf-icon-button--40", 3, "click"], ["width", "22", "height", "14", "viewBox", "0 0 22 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"], [1, "card-preview"], [1, "card-header"], [1, "card-type"], [1, "card-qr-chip"], [1, "qr-image", 3, "error", "src"], [1, "card-number"], [1, "card-details"], [1, "card-holder"], [1, "label"], [1, "value"], [1, "card-expiry"], ["class", "payment-card-detail__decrypt-section", 4, "ngIf"], ["class", "payment-card-detail__error", 4, "ngIf"], ["class", "payment-card-detail__info-section", 4, "ngIf"], ["class", "payment-card-detail__decrypted-section", "id", "payment-card-decrypted-content", 4, "ngIf"], [1, "payment-card-detail__decrypt-section"], [1, "zelf-button", "zelf-button--primary", "zelf-button--wide", 3, "click", "disabled"], [4, "ngIf"], [1, "payment-card-detail__error"], [1, "payment-card-detail__info-section"], [1, "payment-card-detail__section-title"], [1, "zelf-action-row"], [1, "zelf-action-row__label"], [1, "zelf-action-row__value", "payment-card-detail__id-field"], [1, "payment-card-detail__hash"], [1, "zelf-icon-button", "zelf-icon-button--40", "zelf-icon-button--secondary", "zelf-icon-button--border-soft", 3, "click", "title"], [4, "ngTemplateOutlet"], [1, "zelf-action-row__value"], [1, "payment-card-detail__image-row"], [1, "payment-card-detail__image-container"], [1, "payment-card-detail__image", 3, "error", "src"], [1, "payment-card-detail__download-container"], [1, "payment-card-detail__download-button", 3, "click"], [1, "payment-card-detail__download-content"], ["width", "18", "height", "20", "viewBox", "0 0 18 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M14.3549 7.08398H12.4999V1.25065C12.4999 0.608984 11.9749 0.0839844 11.3333 0.0839844H6.66658C6.02492 0.0839844 5.49992 0.608984 5.49992 1.25065V7.08398H3.64492C2.60659 7.08398 2.08159 8.34398 2.81658 9.07898L8.17159 14.434C8.62659 14.889 9.36158 14.889 9.81658 14.434L15.1716 9.07898C15.9066 8.34398 15.3933 7.08398 14.3549 7.08398ZM0.833252 18.7507C0.833252 19.3923 1.35825 19.9173 1.99992 19.9173H15.9999C16.6416 19.9173 17.1666 19.3923 17.1666 18.7507C17.1666 18.109 16.6416 17.584 15.9999 17.584H1.99992C1.35825 17.584 0.833252 18.109 0.833252 18.7507Z", "fill", "#181818"], ["id", "payment-card-decrypted-content", 1, "payment-card-detail__decrypted-section"], [1, "zelf-action-row__value", "payment-card-detail__proof-field"], [1, "zelf-action-row__value", "payment-card-detail__card-number-field"], [1, "payment-card-detail__monospace"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], [1, "zelf-action-row__value", "payment-card-detail__cvv-field"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z", "fill", "currentColor"], ["d", "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z", "fill", "currentColor"], ["mode", "embedded", 3, "close", "decryptedData"], ["width", "24", "height", "24", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M15.5 20H5.5V7C5.5 6.45 5.05 6 4.5 6C3.95 6 3.5 6.45 3.5 7V20C3.5 21.1 4.4 22 5.5 22H15.5C16.05 22 16.5 21.55 16.5 21C16.5 20.45 16.05 20 15.5 20ZM20.5 16V4C20.5 2.9 19.6 2 18.5 2H9.5C8.4 2 7.5 2.9 7.5 4V16C7.5 17.1 8.4 18 9.5 18H18.5C19.6 18 20.5 17.1 20.5 16ZM18.5 16H9.5V4H18.5V16Z"]],
    template: function ZelfKeysPaymentCardDetailComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](0, ZelfKeysPaymentCardDetailComponent_div_0_Template, 2, 1, "div", 1)(1, ZelfKeysPaymentCardDetailComponent_popout_decryptor_1_Template, 1, 0, "popout-decryptor", 2)(2, ZelfKeysPaymentCardDetailComponent_ng_template_2_Template, 2, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplateRefExtractor"]);
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.showPopoutDecryptor);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgTemplateOutlet, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_2__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_2__.TranslocoDirective, _popout_decryptor_popout_decryptor_component__WEBPACK_IMPORTED_MODULE_6__.PopoutDecryptorComponent],
    styles: [".payment-card-detail[_ngcontent-%COMP%] {\n  padding: 0;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n}\n.payment-card-detail__header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  margin-bottom: 24px;\n}\n.payment-card-detail__header-content[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.payment-card-detail__header-content[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 28px;\n  font-weight: 700;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n}\n.payment-card-detail__header-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 16px;\n  color: var(--zns-theme-text-muted, #96939e);\n  margin: 0;\n}\n.payment-card-detail__content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n}\n.payment-card-detail__card-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  align-items: flex-start;\n  gap: 16px;\n}\n.payment-card-detail[_ngcontent-%COMP%]   .card-preview[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, var(--zns-theme-button, #181818) 0%, var(--zns-theme-button-hover, #ff5721) 100%);\n  border-radius: 16px;\n  padding: 24px;\n  color: var(--zns-theme-button-text, #ffffff);\n  box-shadow: 0 4px 20px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n  transition: all 0.2s ease;\n  position: relative;\n  overflow: hidden;\n  min-height: 150px;\n  flex: 1;\n}\n.payment-card-detail[_ngcontent-%COMP%]   .card-preview[_ngcontent-%COMP%]   .card-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 20px;\n}\n.payment-card-detail[_ngcontent-%COMP%]   .card-preview[_ngcontent-%COMP%]   .card-type[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 600;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n}\n.payment-card-detail[_ngcontent-%COMP%]   .card-preview[_ngcontent-%COMP%]   .card-qr-chip[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 24px;\n  right: 24px;\n  width: 40px;\n  height: 30px;\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  border-radius: 6px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n}\n.payment-card-detail[_ngcontent-%COMP%]   .card-preview[_ngcontent-%COMP%]   .qr-image[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  border-radius: 4px;\n}\n.payment-card-detail[_ngcontent-%COMP%]   .card-preview[_ngcontent-%COMP%]   .qr-placeholder[_ngcontent-%COMP%] {\n  font-size: 10px;\n  font-weight: 600;\n  color: var(--zns-theme-button-text, #ffffff);\n}\n.payment-card-detail[_ngcontent-%COMP%]   .card-preview[_ngcontent-%COMP%]   .card-number[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 600;\n  letter-spacing: 2px;\n  margin: 20px 0;\n  font-family: var(--zns-theme-monospace-family, \"Courier New\", Courier, monospace);\n}\n.payment-card-detail[_ngcontent-%COMP%]   .card-preview[_ngcontent-%COMP%]   .card-details[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-end;\n  margin-top: auto;\n}\n.payment-card-detail[_ngcontent-%COMP%]   .card-preview[_ngcontent-%COMP%]   .card-holder[_ngcontent-%COMP%], \n.payment-card-detail[_ngcontent-%COMP%]   .card-preview[_ngcontent-%COMP%]   .card-expiry[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.payment-card-detail[_ngcontent-%COMP%]   .card-preview[_ngcontent-%COMP%]   .label[_ngcontent-%COMP%] {\n  font-size: 10px;\n  opacity: 0.8;\n  margin-bottom: 4px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.payment-card-detail[_ngcontent-%COMP%]   .card-preview[_ngcontent-%COMP%]   .value[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 600;\n}\n.payment-card-detail[_ngcontent-%COMP%]   .card-preview.visa[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);\n  color: #ffffff;\n}\n.payment-card-detail[_ngcontent-%COMP%]   .card-preview.mastercard[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);\n  color: #ffffff;\n}\n.payment-card-detail[_ngcontent-%COMP%]   .card-preview.amex[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #0066cc 0%, #004499 100%);\n  color: #ffffff;\n}\n.payment-card-detail[_ngcontent-%COMP%]   .card-preview.discover[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);\n  color: #ffffff;\n}\n.payment-card-detail[_ngcontent-%COMP%]   .card-preview.card[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: #ffffff;\n}\n.payment-card-detail__decrypt-section[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.payment-card-detail__biometrics[_ngcontent-%COMP%] {\n  margin-top: 24px;\n}\n.payment-card-detail__error[_ngcontent-%COMP%] {\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  border-radius: 8px;\n  padding: 16px;\n  color: var(--zns-theme-error, #dc362e);\n  text-align: center;\n}\n.payment-card-detail__section-title[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n  margin: 0 0 16px 0;\n}\n.payment-card-detail__info-section[_ngcontent-%COMP%], .payment-card-detail__decrypted-section[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n}\n.payment-card-detail__decrypted-section[_ngcontent-%COMP%] {\n  padding-bottom: 16px;\n}\n.payment-card-detail__section-title[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n  margin: 0 0 16px 0;\n}\n.payment-card-detail__monospace[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-monospace-family, \"Courier New\", Courier, monospace);\n  font-size: 14px;\n  letter-spacing: 0.5px;\n}\n.payment-card-detail__cvv-field[_ngcontent-%COMP%], .payment-card-detail__card-number-field[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 8px;\n  flex-wrap: wrap;\n}\n.payment-card-detail__id-field[_ngcontent-%COMP%], .payment-card-detail__proof-field[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n.payment-card-detail__hash[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-monospace-family, \"Courier New\", Courier, monospace);\n  font-size: 12px;\n  color: var(--zns-theme-text-muted, #96939e);\n  word-break: break-all;\n  flex: 1;\n}\n.payment-card-detail__image-row[_ngcontent-%COMP%] {\n  margin-top: 24px;\n}\n.payment-card-detail__image-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  border-radius: 8px;\n  padding: 16px;\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  min-height: 120px;\n  margin-bottom: 16px;\n}\n.payment-card-detail__image[_ngcontent-%COMP%] {\n  width: 100%;\n  max-height: 400px;\n  border-radius: 4px;\n  object-fit: contain;\n}\n.payment-card-detail__image-error[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 40px 20px;\n  color: var(--zns-theme-text-muted, #96939e);\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  border-radius: 8px;\n}\n.payment-card-detail__download-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n}\n.payment-card-detail__download-button[_ngcontent-%COMP%] {\n  display: flex;\n  background: none;\n  border: none;\n  cursor: pointer;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--zns-theme-text, #181818);\n  transition: background-color 0.2s ease;\n  border-radius: 12px;\n  padding: 12px;\n}\n.payment-card-detail__download-button[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc);\n}\n.payment-card-detail__download-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n}\n.payment-card-detail__download-content[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n  width: 18px;\n  height: 20px;\n}\n\n@media (max-width: 768px) {\n  .payment-card-detail__header-content[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n    font-size: 24px;\n  }\n  .payment-card-detail__header-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n    font-size: 14px;\n  }\n  .payment-card-detail[_ngcontent-%COMP%]   .card-preview[_ngcontent-%COMP%] {\n    min-height: 180px;\n    padding: 20px;\n  }\n  .payment-card-detail[_ngcontent-%COMP%]   .card-preview[_ngcontent-%COMP%]   .card-number[_ngcontent-%COMP%] {\n    font-size: 18px;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvemVsZi1rZXlzL3plbGYta2V5cy1wYXltZW50LWNhcmRzL3plbGYta2V5cy1wYXltZW50LWNhcmQtZGV0YWlsL3plbGYta2V5cy1wYXltZW50LWNhcmQtZGV0YWlsLmNvbXBvbmVudC5zY3NzIiwid2VicGFjazovLy4vc3JjL3N0eWxlcy9fdmFyaWFibGVzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxVQUFBO0VBQ0EsdUVDb0JjO0FEckJsQjtBQUdJO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtFQUNBLG1CQUFBO0FBRFI7QUFHUTtFQUNJLE9BQUE7QUFEWjtBQUdZO0VBQ0ksZUFBQTtFQUNBLGdCQUFBO0VBQ0EscUNDYUo7RURaSSxTQUFBO0FBRGhCO0FBSVk7RUFDSSxlQUFBO0VBQ0EsMkNDUUM7RURQRCxTQUFBO0FBRmhCO0FBT0k7RUFDSSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxTQUFBO0FBTFI7QUFRSTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsU0FBQTtBQU5SO0FBVUk7RUFDSSxxSEFBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLDRDQ1RVO0VEVVYsa0VBQUE7RUFDQSx5QkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxpQkFBQTtFQUNBLE9BQUE7QUFSUjtBQVVRO0VBQ0ksYUFBQTtFQUNBLDhCQUFBO0VBQ0EsbUJBQUE7RUFDQSxtQkFBQTtBQVJaO0FBV1E7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSx5QkFBQTtFQUNBLG1CQUFBO0FBVFo7QUFZUTtFQUNJLGtCQUFBO0VBQ0EsU0FBQTtFQUNBLFdBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLDBEQy9DZTtFRGdEZixrQkFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsZ0JBQUE7QUFWWjtBQWFRO0VBQ0ksV0FBQTtFQUNBLFlBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0FBWFo7QUFjUTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLDRDQ3ZETTtBRDJDbEI7QUFlUTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLG1CQUFBO0VBQ0EsY0FBQTtFQUNBLGlGQzVFVztBRCtEdkI7QUFnQlE7RUFDSSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxxQkFBQTtFQUNBLGdCQUFBO0FBZFo7QUFpQlE7O0VBRUksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsUUFBQTtBQWZaO0FBa0JRO0VBQ0ksZUFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtFQUNBLHlCQUFBO0VBQ0EscUJBQUE7QUFoQlo7QUFtQlE7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7QUFqQlo7QUFvQlE7RUFDSSw2REFBQTtFQUNBLGNDaEhKO0FEOEZSO0FBcUJRO0VBQ0ksNkRBQUE7RUFDQSxjQ3JISjtBRGtHUjtBQXNCUTtFQUNJLDZEQUFBO0VBQ0EsY0MxSEo7QURzR1I7QUF1QlE7RUFDSSw2REFBQTtFQUNBLGNDL0hKO0FEMEdSO0FBd0JRO0VBQ0ksNkRBQUE7RUFDQSxjQ3BJSjtBRDhHUjtBQTBCSTtFQUNJLGtCQUFBO0FBeEJSO0FBMkJJO0VBQ0ksZ0JBQUE7QUF6QlI7QUE0Qkk7RUFDSSwwREMxSW1CO0VEMkluQixrREFBQTtFQUNBLGtCQUFBO0VBQ0EsYUFBQTtFQUNBLHNDQ2xLQTtFRG1LQSxrQkFBQTtBQTFCUjtBQTZCSTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHFDQ25KSTtFRG9KSixrQkFBQTtBQTNCUjtBQThCSTtFQUVJLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7QUE3QlI7QUFnQ0k7RUFDSSxvQkFBQTtBQTlCUjtBQWlDSTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHFDQ3JLSTtFRHNLSixrQkFBQTtBQS9CUjtBQWtDSTtFQUNJLGlGQy9LZTtFRGdMZixlQUFBO0VBQ0EscUJBQUE7QUFoQ1I7QUFtQ0k7RUFFSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx5QkFBQTtFQUNBLFFBQUE7RUFDQSxlQUFBO0FBbENSO0FBcUNJO0VBRUksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsUUFBQTtBQXBDUjtBQXVDSTtFQUNJLGlGQ3JNZTtFRHNNZixlQUFBO0VBQ0EsMkNDak1TO0VEa01ULHFCQUFBO0VBQ0EsT0FBQTtBQXJDUjtBQXdDSTtFQUNJLGdCQUFBO0FBdENSO0FBeUNJO0VBQ0ksYUFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFDQSwwRENqTm1CO0VEa05uQixrQkFBQTtFQUNBLGFBQUE7RUFDQSxrREFBQTtFQUNBLGlCQUFBO0VBQ0EsbUJBQUE7QUF2Q1I7QUEwQ0k7RUFDSSxXQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLG1CQUFBO0FBeENSO0FBMkNJO0VBQ0ksa0JBQUE7RUFDQSxrQkFBQTtFQUNBLDJDQ2hPUztFRGlPVCwwRENwT21CO0VEcU9uQixrQkFBQTtBQXpDUjtBQTRDSTtFQUNJLGFBQUE7RUFDQSx1QkFBQTtBQTFDUjtBQTZDSTtFQUNJLGFBQUE7RUFDQSxnQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsdUVDdlBVO0VEd1BWLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHFDQ25QSTtFRG9QSixzQ0FBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtBQTNDUjtBQTZDUTtFQUNJLGdFQzNQZTtBRGdOM0I7QUErQ0k7RUFDSSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxtQkFBQTtFQUNBLFFBQUE7RUFDQSxXQUFBO0FBN0NSO0FBK0NRO0VBQ0ksb0NDclFBO0VEc1FBLFdBQUE7RUFDQSxZQUFBO0FBN0NaOztBQW1EQTtFQUlnQjtJQUNJLGVBQUE7RUFuRGxCO0VBc0RjO0lBQ0ksZUFBQTtFQXBEbEI7RUF5RE07SUFDSSxpQkFBQTtJQUNBLGFBQUE7RUF2RFY7RUF5RFU7SUFDSSxlQUFBO0VBdkRkO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwiLi4vLi4vLi4vLi4vc3R5bGVzL3ZhcmlhYmxlc1wiO1xuXG4ucGF5bWVudC1jYXJkLWRldGFpbCB7XG4gICAgcGFkZGluZzogMDtcbiAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG5cbiAgICAmX19oZWFkZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IDE2cHg7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDI0cHg7XG5cbiAgICAgICAgJi1jb250ZW50IHtcbiAgICAgICAgICAgIGZsZXg6IDE7XG5cbiAgICAgICAgICAgIGgyIHtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDI4cHg7XG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwIHtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fY29udGVudCB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogMjRweDtcbiAgICB9XG5cbiAgICAmX19jYXJkLXdyYXBwZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgICAgICAgZ2FwOiAxNnB4O1xuICAgIH1cblxuICAgIC8vIENhcmQgcHJldmlldyB1c2VzIHRoZSBzYW1lIHN0eWxpbmcgYXMgdGhlIGZvcm1cbiAgICAuY2FyZC1wcmV2aWV3IHtcbiAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgdmFyaWFibGVzLiR0aGVtZUJ1dHRvbiAwJSwgdmFyaWFibGVzLiR0aGVtZUJ1dHRvbkhvdmVyIDEwMCUpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgICAgICBwYWRkaW5nOiAyNHB4O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQ7XG4gICAgICAgIGJveC1zaGFkb3c6IDAgNHB4IDIwcHggdmFyaWFibGVzLiR0aGVtZVNoYWRvdztcbiAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZTtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICBtaW4taGVpZ2h0OiAxNTBweDtcbiAgICAgICAgZmxleDogMTtcblxuICAgICAgICAuY2FyZC1oZWFkZXIge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLmNhcmQtdHlwZSB7XG4gICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAxcHg7XG4gICAgICAgIH1cblxuICAgICAgICAuY2FyZC1xci1jaGlwIHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgIHRvcDogMjRweDtcbiAgICAgICAgICAgIHJpZ2h0OiAyNHB4O1xuICAgICAgICAgICAgd2lkdGg6IDQwcHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDMwcHg7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDZweDtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICB9XG5cbiAgICAgICAgLnFyLWltYWdlIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICAgICAgb2JqZWN0LWZpdDogY292ZXI7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgICAgIH1cblxuICAgICAgICAucXItcGxhY2Vob2xkZXIge1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMHB4O1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5jYXJkLW51bWJlciB7XG4gICAgICAgICAgICBmb250LXNpemU6IDIwcHg7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDJweDtcbiAgICAgICAgICAgIG1hcmdpbjogMjBweCAwO1xuICAgICAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVNb25vc3BhY2VGYW1pbHk7XG4gICAgICAgIH1cblxuICAgICAgICAuY2FyZC1kZXRhaWxzIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XG4gICAgICAgICAgICBtYXJnaW4tdG9wOiBhdXRvO1xuICAgICAgICB9XG5cbiAgICAgICAgLmNhcmQtaG9sZGVyLFxuICAgICAgICAuY2FyZC1leHBpcnkge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgICAgICBnYXA6IDRweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5sYWJlbCB7XG4gICAgICAgICAgICBmb250LXNpemU6IDEwcHg7XG4gICAgICAgICAgICBvcGFjaXR5OiAwLjg7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiA0cHg7XG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLnZhbHVlIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIH1cblxuICAgICAgICAmLnZpc2Ege1xuICAgICAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgIzFlM2M3MiAwJSwgIzJhNTI5OCAxMDAlKTtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHdoaXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgJi5tYXN0ZXJjYXJkIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICNlYjMzNDkgMCUsICNmNDVjNDMgMTAwJSk7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR3aGl0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgICYuYW1leCB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjMDA2NmNjIDAlLCAjMDA0NDk5IDEwMCUpO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kd2hpdGU7XG4gICAgICAgIH1cblxuICAgICAgICAmLmRpc2NvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsICNmZjZiMzUgMCUsICNmNzkzMWUgMTAwJSk7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR3aGl0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgICYuY2FyZCB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjNjY3ZWVhIDAlLCAjNzY0YmEyIDEwMCUpO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kd2hpdGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19kZWNyeXB0LXNlY3Rpb24ge1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgJl9fYmlvbWV0cmljcyB7XG4gICAgICAgIG1hcmdpbi10b3A6IDI0cHg7XG4gICAgfVxuXG4gICAgJl9fZXJyb3Ige1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICBwYWRkaW5nOiAxNnB4O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvcjtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuICAgICZfX3NlY3Rpb24tdGl0bGUge1xuICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgbWFyZ2luOiAwIDAgMTZweCAwO1xuICAgIH1cblxuICAgICZfX2luZm8tc2VjdGlvbixcbiAgICAmX19kZWNyeXB0ZWQtc2VjdGlvbiB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogMTZweDtcbiAgICB9XG5cbiAgICAmX19kZWNyeXB0ZWQtc2VjdGlvbiB7XG4gICAgICAgIHBhZGRpbmctYm90dG9tOiAxNnB4O1xuICAgIH1cblxuICAgICZfX3NlY3Rpb24tdGl0bGUge1xuICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgbWFyZ2luOiAwIDAgMTZweCAwO1xuICAgIH1cblxuICAgICZfX21vbm9zcGFjZSB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lTW9ub3NwYWNlRmFtaWx5O1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjVweDtcbiAgICB9XG5cbiAgICAmX19jdnYtZmllbGQsXG4gICAgJl9fY2FyZC1udW1iZXItZmllbGQge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgZmxleC13cmFwOiB3cmFwO1xuICAgIH1cblxuICAgICZfX2lkLWZpZWxkLFxuICAgICZfX3Byb29mLWZpZWxkIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgfVxuXG4gICAgJl9faGFzaCB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lTW9ub3NwYWNlRmFtaWx5O1xuICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgICAgICB3b3JkLWJyZWFrOiBicmVhay1hbGw7XG4gICAgICAgIGZsZXg6IDE7XG4gICAgfVxuXG4gICAgJl9faW1hZ2Utcm93IHtcbiAgICAgICAgbWFyZ2luLXRvcDogMjRweDtcbiAgICB9XG5cbiAgICAmX19pbWFnZS1jb250YWluZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgcGFkZGluZzogMTZweDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcbiAgICAgICAgbWluLWhlaWdodDogMTIwcHg7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XG4gICAgfVxuXG4gICAgJl9faW1hZ2Uge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgbWF4LWhlaWdodDogNDAwcHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgICAgb2JqZWN0LWZpdDogY29udGFpbjtcbiAgICB9XG5cbiAgICAmX19pbWFnZS1lcnJvciB7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgcGFkZGluZzogNDBweCAyMHB4O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICB9XG5cbiAgICAmX19kb3dubG9hZC1jb250YWluZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX19kb3dubG9hZC1idXR0b24ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBiYWNrZ3JvdW5kOiBub25lO1xuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzIGVhc2U7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICAgIHBhZGRpbmc6IDEycHg7XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2Rvd25sb2FkLWNvbnRlbnQge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgd2lkdGg6IDE4cHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDIwcHg7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIFJlc3BvbnNpdmUgZGVzaWduXG5AbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgICAucGF5bWVudC1jYXJkLWRldGFpbCB7XG4gICAgICAgICZfX2hlYWRlciB7XG4gICAgICAgICAgICAmLWNvbnRlbnQge1xuICAgICAgICAgICAgICAgIGgyIHtcbiAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAyNHB4O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHAge1xuICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLmNhcmQtcHJldmlldyB7XG4gICAgICAgICAgICBtaW4taGVpZ2h0OiAxODBweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDIwcHg7XG5cbiAgICAgICAgICAgIC5jYXJkLW51bWJlciB7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiJHByaW1hcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXByaW1hcnksICMxODE4MTgpO1xuJHByaW1hcnlMaWdodDogI2RhZGRmYTtcbiRzZWNvbmRhcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXNlY29uZGFyeSwgI2ZmNTcyMSk7XG4kc2Vjb25kYXJ5Q29sb3JMaWdodDogI2Y2ZTVlMDtcblxuJGNvcnJlY3Q6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLCAjMWVhNDQ2KTtcbiRjb3JyZWN0RGFyazogIzBmNTIyMztcbiRjb3JyZWN0TGlnaHQ6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLXRleHQsICNlN2Y4ZWQpO1xuXG4kZXJyb3I6IHZhcigtLXpucy10aGVtZS1lcnJvciwgI2RjMzYyZSk7XG4kZXJyb3JEYXJrOiAjNjAxNDEwO1xuJGVycm9yTGlnaHQ6IHZhcigtLXpucy10aGVtZS1lcnJvci10ZXh0LCAjZmNlZWVlKTtcblxuJHdhcm5pbmc6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLCAjZGU2ODAwKTtcbiR3YXJuaW5nRGFyazogIzRhMjEwYTtcbiR3YXJuaW5nTGlnaHQ6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLXRleHQsICNmZmVlZTkpO1xuXG4kaW5mbzogIzM5OThkMztcbiRpbmZvRGFyazogIzAwNGE3NztcbiRpbmZvTGlnaHQ6ICNlY2YzZmU7XG5cbiRibGFjazogIzE4MTgxODtcbiR3aGl0ZTogI2ZmZmZmZjtcblxuJHRoZW1lQm9keUZhbWlseTogdmFyKC0tem5zLXRoZW1lLWJvZHktZmFtaWx5LCBcIlBvcHBpbnNcIiwgQXJpYWwsIHNhbnMtc2VyaWYpO1xuJHRoZW1lVGl0bGVGYW1pbHk6IHZhcigtLXpucy10aGVtZS10aXRsZS1mYW1pbHksIFwiTWVuZGFcIiwgXCJBcmlhbCBCbGFja1wiLCBzYW5zLXNlcmlmKTtcbiR0aGVtZU1vbm9zcGFjZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLW1vbm9zcGFjZS1mYW1pbHksIFwiQ291cmllciBOZXdcIiwgQ291cmllciwgbW9ub3NwYWNlKTtcblxuJHRoZW1lQmFja2dyb3VuZDogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQsICNmZmZmZmYpO1xuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQtc2Vjb25kYXJ5LCAjZjlmOWZjKTtcblxuJHRoZW1lVGV4dDogdmFyKC0tem5zLXRoZW1lLXRleHQsICMxODE4MTgpO1xuJHRoZW1lVGV4dE11dGVkOiB2YXIoLS16bnMtdGhlbWUtdGV4dC1tdXRlZCwgIzk2OTM5ZSk7XG4kdGhlbWVUZXh0U2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtdGV4dC1zZWNvbmRhcnksICM3Mzc3N2YpO1xuXG4kdGhlbWVIZWFkZXI6IHZhcigtLXpucy10aGVtZS1oZWFkZXIsICMxODE4MTgpO1xuJHRoZW1lSGVhZGVyVGV4dDogdmFyKC0tem5zLXRoZW1lLWhlYWRlci10ZXh0LCAjZmZmZmZmKTtcblxuJHRoZW1lQnV0dG9uOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLCAjMTgxODE4KTtcbiR0aGVtZUJ1dHRvblRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tdGV4dCwgI2ZmZmZmZik7XG4kdGhlbWVCdXR0b25Ib3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1ob3ZlciwgI2ZmNTcyMSk7XG5cbiR0aGVtZUJ1dHRvblNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnksICNlOWVjZWYpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktdGV4dCwgIzQ5NTA1Nyk7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktaG92ZXIsICNlOWVjZWYpO1xuXG4kdGhlbWVCb3JkZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXIsICNlM2UzZTMpO1xuJHRoZW1lQm9yZGVySG92ZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXItaG92ZXIsICNjM2M2Y2YpO1xuXG4kdGhlbWVDYXJkOiB2YXIoLS16bnMtdGhlbWUtY2FyZCwgI2ZmZmZmZik7XG4kdGhlbWVDYXJkQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtY2FyZC1ib3JkZXIsICNlZWVkZjEpO1xuXG4kdGhlbWVTaGFkb3c6IHZhcigtLXpucy10aGVtZS1zaGFkb3csIHJnYmEoMCwgMCwgMCwgMC4xKSk7XG5cbiRzbW9vdGhCZXppZXI6IGN1YmljLWJlemllcigwLjI1LCAwLjQsIDAuNywgMSk7XG5cbiRtYXhFeHRyYVNtYWxsOiA1OTVweDtcbiRtaW5TbWFsbDogNjAwcHg7XG4kbWVkaXVtOiA3NjhweDtcbiRsYXJnZTogODg5cHg7XG4kY29tcHV0ZXJzOiAxMjAwcHg7XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }

}]);
//# sourceMappingURL=src_app_zelf-keys_zelf-keys-payment-cards_zelf-keys-payment-card-detail_zelf-keys-payment-car-af4ba1.js.map