"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_zelf-keys_zelf-keys-payment-cards_zelf-keys-payment-card-result_zelf-keys-payment-car-e7026e"],{

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

/***/ 59341
/*!****************************************************************************************************************************!*\
  !*** ./src/app/zelf-keys/zelf-keys-payment-cards/zelf-keys-payment-card-result/zelf-keys-payment-card-result.component.ts ***!
  \****************************************************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZelfKeysPaymentCardResultComponent: () => (/* binding */ ZelfKeysPaymentCardResultComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 34487);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var app_base_copy_to_clipboard_copy_to_clipboard_base__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/base/copy-to-clipboard/copy-to-clipboard.base */ 88070);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var app_services_data_passing_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! app/services/data-passing.service */ 59284);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var app_services_zelf_keys_data_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! app/services/zelf-keys-data.service */ 18487);
/* harmony import */ var app_chrome_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! app/chrome.service */ 85043);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/snack-bar */ 3347);













function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 15)(1, "div", 16)(2, "h3", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "div", 18)(5, "div", 19)(6, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "div", 19)(11, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](13, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](15, "div", 19)(16, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](18, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](19);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](20, "div", 19)(21, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](22);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](23, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.preview.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.preview.labels.name"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r2.getBankName());
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.preview.labels.card_holder"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r2.getCardName());
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.preview.labels.card_number"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r2.getCardNumber());
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.preview.labels.expires"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r2.getExpiry());
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 22)(1, "div", 23)(2, "h3", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "div", 25)(5, "img", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("error", function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_8_Template_img_error_5_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r4);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r2.onImageError($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "div", 27)(7, "button", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_8_Template_button_click_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r4);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r2.onDownloadZelfProof());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](9, "svg", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](10, "path", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](11, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.image.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("src", ctx_r2.getZelfProofQRCodeUrl(), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsanitizeUrl"])("alt", ctx_r2.getCardName() + " - Payment card image");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.image.download"));
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_9_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "img", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("src", ctx_r2.result.NFT.imageUrl, _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsanitizeUrl"]);
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_9_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 19)(1, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.nft.labels.token_id"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"]("#", ctx_r2.result.NFT.tokenId);
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_9_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 19)(1, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.nft.labels.cost"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"]("", ctx_r2.result.NFT.cost, " AVAX");
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_9_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 19)(1, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "div", 21)(4, "span", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_9_div_8_Template_span_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r5);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r2.copyContractAddress());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.nft.labels.contract"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("title", t_r2("zelf_keys.payment_card_result.nft.copy_hint"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", ctx_r2.result.NFT.contractAddress, " ");
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_9_div_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 19)(1, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "div", 21)(4, "a", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](6, "slice");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](7, "slice");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.nft.labels.transaction"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("href", ctx_r2.result.NFT.explorerUrl, _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate2"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind3"](6, 4, ctx_r2.result.NFT.transactionHash, 0, 10), "...", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind2"](7, 8, ctx_r2.result.NFT.transactionHash, -10), " ");
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_9_div_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 19)(1, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "div", 21)(4, "a", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.nft.labels.metadata_url"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("href", ctx_r2.result.NFT.metadataUrl, _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.nft.metadata_link"));
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 32)(1, "h3", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](4, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_9_div_4_Template, 2, 1, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "div", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](6, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_9_div_6_Template, 5, 2, "div", 37)(7, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_9_div_7_Template, 5, 2, "div", 37)(8, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_9_div_8_Template, 6, 3, "div", 37)(9, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_9_div_9_Template, 8, 11, "div", 37)(10, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_9_div_10_Template, 6, 3, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.nft.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.result == null ? null : ctx_r2.result.NFT == null ? null : ctx_r2.result.NFT.imageUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.result == null ? null : ctx_r2.result.NFT == null ? null : ctx_r2.result.NFT.tokenId);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.result == null ? null : ctx_r2.result.NFT == null ? null : ctx_r2.result.NFT.cost);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.result == null ? null : ctx_r2.result.NFT == null ? null : ctx_r2.result.NFT.contractAddress);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", (ctx_r2.result == null ? null : ctx_r2.result.NFT == null ? null : ctx_r2.result.NFT.transactionHash) && (ctx_r2.result == null ? null : ctx_r2.result.NFT == null ? null : ctx_r2.result.NFT.explorerUrl));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.result == null ? null : ctx_r2.result.NFT == null ? null : ctx_r2.result.NFT.metadataUrl);
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_10_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 19)(1, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.ipfs.labels.hash"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r2.getIpfsHash());
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_10_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 19)(1, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "div", 21)(4, "a", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.ipfs.labels.gateway_url"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("href", ctx_r2.getIpfsGatewayUrl(), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.ipfs.gateway_link"));
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_10_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 19)(1, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](5, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.ipfs.labels.file_size"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](5, 2, ctx_r2.getIpfsFileSize()), " bytes");
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 32)(1, "h3", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](4, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_10_div_4_Template, 5, 2, "div", 37)(5, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_10_div_5_Template, 6, 3, "div", 37)(6, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_10_div_6_Template, 6, 4, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "div", 19)(8, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](12, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.ipfs.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.getIpfsHash() !== "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.getIpfsGatewayUrl() !== "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.getIpfsFileSize() !== null);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.ipfs.labels.uploaded"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r2.getIpfsUploadTimestamp() ? _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind2"](12, 6, ctx_r2.getIpfsUploadTimestamp(), "medium") : "N/A");
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_11_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 19)(1, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "div", 21)(4, "span", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_11_div_4_Template_span_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r6);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r2.copyZelfProof());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.zelfproof.labels.string"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r2.result.zelfProof);
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_11_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 19)(1, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "div", 21)(4, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](5, "img", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.zelfproof.labels.qr_code"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("src", ctx_r2.getZelfProofQRCodeUrl(), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsanitizeUrl"]);
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 32)(1, "h3", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](4, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_11_div_4_Template, 6, 2, "div", 37)(5, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_11_div_5_Template, 6, 2, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.zelfproof.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.result == null ? null : ctx_r2.result.zelfProof);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.getZelfProofQRCodeUrl());
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_12_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 19)(1, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.walrus.labels.blob_id") || "Blob ID");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r2.getWalrusBlobId());
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_12_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 19)(1, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "div", 21)(4, "a", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.walrus.labels.public_url") || "Public URL");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("href", ctx_r2.getWalrusPublicUrl(), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.walrus.view_link") || "View on Walrus");
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_12_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 19)(1, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "div", 21)(4, "a", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](3).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.walrus.labels.explorer_url") || "Explorer URL");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("href", ctx_r2.getWalrusExplorerUrl(), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.walrus.explorer_link") || "View on Explorer");
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_12_span_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "span", 51)(1, "span", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2, "check_circle");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, " Success ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_12_span_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "span", 53)(1, "span", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2, "warning");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, " Failed ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_div_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 32)(1, "h3", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "div", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](4, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_12_div_4_Template, 5, 2, "div", 37)(5, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_12_div_5_Template, 6, 3, "div", 37)(6, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_12_div_6_Template, 6, 3, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "div", 19)(8, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](11, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_12_span_11_Template, 4, 0, "span", 49)(12, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_12_span_12_Template, 4, 0, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.walrus.title") || "Walrus Storage");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.getWalrusBlobId());
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.getWalrusPublicUrl());
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.getWalrusExplorerUrl());
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.walrus.labels.status") || "Status");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.getWalrusSuccess());
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !ctx_r2.getWalrusSuccess());
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 5)(1, "span", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2, "check_circle");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "h2", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "p", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](7, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_7_Template, 25, 9, "div", 9)(8, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_8_Template, 13, 4, "div", 10)(9, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_9_Template, 11, 7, "div", 11)(10, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_10_Template, 13, 9, "div", 11)(11, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_11_Template, 6, 3, "div", 11)(12, ZelfKeysPaymentCardResultComponent_div_0_div_2_div_12_Template, 13, 7, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](13, "div", 12)(14, "button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function ZelfKeysPaymentCardResultComponent_div_0_div_2_Template_button_click_14_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r2.onBackToCards());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](16, "button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function ZelfKeysPaymentCardResultComponent_div_0_div_2_Template_button_click_16_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r2.onAddAnother());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.success.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.success.description"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", (ctx_r2.result == null ? null : ctx_r2.result.publicData) || (ctx_r2.result == null ? null : ctx_r2.result.ipfs == null ? null : ctx_r2.result.ipfs.publicData));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.getZelfProofQRCodeUrl());
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.result == null ? null : ctx_r2.result.NFT);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.result == null ? null : ctx_r2.result.ipfs);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", (ctx_r2.result == null ? null : ctx_r2.result.zelfProof) || (ctx_r2.result == null ? null : ctx_r2.result.zelfProofQRCode) || (ctx_r2.result == null ? null : ctx_r2.result.zelfQR));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.result == null ? null : ctx_r2.result.walrus);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", t_r2("zelf_keys.payment_card_result.actions.back_to_cards"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", t_r2("zelf_keys.payment_card_result.actions.add_another"), " ");
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 54)(1, "span", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2, "error");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "h2", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "p", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "div", 12)(8, "button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function ZelfKeysPaymentCardResultComponent_div_0_div_3_Template_button_click_8_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r7);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r2.onBackToCards());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function ZelfKeysPaymentCardResultComponent_div_0_div_3_Template_button_click_10_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r7);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r2.onAddAnother());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r2("zelf_keys.payment_card_result.error.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](ctx_r2.error || t_r2("zelf_keys.payment_card_result.error.default_message"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", t_r2("zelf_keys.payment_card_result.actions.back_to_cards"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", t_r2("zelf_keys.payment_card_result.error.try_again"), " ");
  }
}
function ZelfKeysPaymentCardResultComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 1)(1, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](2, ZelfKeysPaymentCardResultComponent_div_0_div_2_Template, 18, 10, "div", 3)(3, ZelfKeysPaymentCardResultComponent_div_0_div_3_Template, 12, 4, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r2.isSuccess);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !ctx_r2.isSuccess);
  }
}
class ZelfKeysPaymentCardResultComponent extends app_base_copy_to_clipboard_copy_to_clipboard_base__WEBPACK_IMPORTED_MODULE_4__.CopyToClipboardBase {
  dataPassingService;
  router;
  zelfKeysDataService;
  chromeService;
  snackBar;
  translocoService;
  error = null;
  isSuccess = false;
  result = null;
  constructor(dataPassingService, router, zelfKeysDataService, chromeService, snackBar, translocoService) {
    super(chromeService, snackBar, translocoService);
    this.dataPassingService = dataPassingService;
    this.router = router;
    this.zelfKeysDataService = zelfKeysDataService;
    this.chromeService = chromeService;
    this.snackBar = snackBar;
    this.translocoService = translocoService;
  }
  ngOnInit() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this.result = _this.dataPassingService.getResult("payment-cards");
      if (!_this.result) {
        _this.error = _this._translocoService.translate("zelf_keys.payment_cards.result.error.no_data");
        return;
      }
      let parsedCardData = {};
      if (_this.result?.ipfs?.publicData?.card || _this.result?.publicData?.card) {
        const cardData = _this.result?.ipfs?.publicData?.card || _this.result?.publicData?.card;
        try {
          parsedCardData = JSON.parse(cardData);
        } catch (error) {
          console.error("Error parsing card data:", error);
        }
      }
      let expiryMonth = "";
      let expiryYear = "";
      if (parsedCardData.expires) {
        const [month, year] = parsedCardData.expires.split("/");
        expiryMonth = month;
        expiryYear = year ? `20${year}` : "";
      }
      if (!_this.result.publicData) {
        _this.result.publicData = {};
      }
      _this.result.publicData.cardName = parsedCardData.name || "";
      _this.result.publicData.cardNumber = parsedCardData.number || "";
      _this.result.publicData.expiryMonth = expiryMonth;
      _this.result.publicData.expiryYear = expiryYear;
      _this.result.publicData.bankName = parsedCardData.bankName || "";
      _this.isSuccess = _this.result?.success === true || _this.result?.ipfs?.saved === true || _this.result?.walrus?.success === true;
      if (_this.isSuccess) {
        yield _this.zelfKeysDataService.clearCache();
        return;
      }
      _this.error = _this.result?.message || _this._translocoService.translate("errors.unknown");
    })();
  }
  onBackToCards() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this2.dataPassingService.clearAll("payment-cards");
      _this2.router.navigate(["/zelf-keys/vault"]);
    })();
  }
  onAddAnother() {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this3.dataPassingService.clearAll("payment-cards");
      _this3.router.navigate(["/zelf-keys/payment-cards/new"]);
    })();
  }
  copyZelfProof() {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this4.result?.zelfProof) return;
      yield _this4._copyToClipboard(_this4.result.zelfProof);
    })();
  }
  copyContractAddress() {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this5.result?.NFT?.contractAddress) return;
      yield _this5._copyToClipboard(_this5.result.NFT.contractAddress);
    })();
  }
  onImageError(event) {
    const img = event.target;
    img.style.display = "none";
    const container = img.parentElement;
    if (!container) return;
    container.innerHTML = `<div class="image-error">${this._translocoService.translate("zelf_keys.common.image_not_available")}</div>`;
  }
  onDownloadZelfProof() {
    const url = this.getZelfProofQRCodeUrl();
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = `zelfproof-${this.getCardName() || "payment-card"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  getCardName() {
    return this.result?.publicData?.cardName || this.result?.ipfs?.publicData?.cardName || "N/A";
  }
  getBankName() {
    return this.result?.publicData?.bankName || this.result?.ipfs?.publicData?.bankName || "N/A";
  }
  getCardNumber() {
    return this.result?.publicData?.cardNumber || this.result?.ipfs?.publicData?.cardNumber || "N/A";
  }
  getExpiryMonth() {
    return this.result?.publicData?.expiryMonth || "";
  }
  getExpiryYear() {
    return this.result?.publicData?.expiryYear || "";
  }
  getExpiry() {
    const month = this.getExpiryMonth();
    const year = this.getExpiryYear();
    if (!month && !year) return "N/A";
    return `${month}/${year}`;
  }
  getZelfProofQRCodeUrl() {
    return this.result?.url || this.result?.zelfProofQRCode || this.result?.zelfQR || null;
  }
  getIpfsHash() {
    return this.result?.ipfs?.ipfsHash || this.result?.ipfs?.ipfs_pin_hash || this.result?.ipfs?.cid || this.result?.ipfs?.hash || "N/A";
  }
  getIpfsGatewayUrl() {
    return this.result?.ipfs?.url || this.result?.ipfs?.gatewayUrl || "N/A";
  }
  getIpfsFileSize() {
    return this.result?.ipfs?.size || this.result?.ipfs?.pinSize || null;
  }
  getIpfsUploadTimestamp() {
    return this.result?.ipfs?.date_pinned || this.result?.ipfs?.created_at || this.result?.ipfs?.timestamp || null;
  }
  getWalrusBlobId() {
    return this.result?.walrus?.blobId || null;
  }
  getWalrusPublicUrl() {
    return this.result?.walrus?.publicUrl || null;
  }
  getWalrusExplorerUrl() {
    return this.result?.walrus?.explorerUrl || null;
  }
  getWalrusSuccess() {
    return this.result?.walrus?.success === true;
  }
  static ɵfac = function ZelfKeysPaymentCardResultComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ZelfKeysPaymentCardResultComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](app_services_data_passing_service__WEBPACK_IMPORTED_MODULE_7__.DataPassingService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_8__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](app_services_zelf_keys_data_service__WEBPACK_IMPORTED_MODULE_9__.ZelfKeysDataService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](app_chrome_service__WEBPACK_IMPORTED_MODULE_10__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_11__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_jsverse_transloco__WEBPACK_IMPORTED_MODULE_3__.TranslocoService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
    type: ZelfKeysPaymentCardResultComponent,
    selectors: [["zelf-keys-payment-card-result"]],
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵInheritDefinitionFeature"]],
    decls: 1,
    vars: 0,
    consts: [["class", "payment-card-result", 4, "transloco"], [1, "payment-card-result"], [1, "payment-card-result__container"], ["class", "payment-card-result__state payment-card-result__state--success", 4, "ngIf"], ["class", "payment-card-result__state payment-card-result__state--error", 4, "ngIf"], [1, "payment-card-result__state", "payment-card-result__state--success"], [1, "material-symbols-outlined", "payment-card-result__icon", "payment-card-result__icon--success"], [1, "payment-card-result__title"], [1, "payment-card-result__description"], ["class", "payment-card-result__preview", 4, "ngIf"], ["class", "payment-card-result__image-section", 4, "ngIf"], ["class", "payment-card-result__section", 4, "ngIf"], [1, "payment-card-result__actions"], [1, "zelf-button", "zelf-button--outlined", "zelf-button--wide", 3, "click"], [1, "zelf-button", "zelf-button--primary", "zelf-button--wide", 3, "click"], [1, "payment-card-result__preview"], [1, "payment-card-result__preview-header"], [1, "payment-card-result__preview-title"], [1, "payment-card-result__preview-content"], [1, "zelf-action-row"], [1, "zelf-action-row__label"], [1, "zelf-action-row__value"], [1, "payment-card-result__image-section"], [1, "payment-card-result__image-header"], [1, "payment-card-result__image-title"], [1, "payment-card-result__image-container"], [1, "payment-card-result__card-image", 3, "error", "src", "alt"], [1, "payment-card-result__download-container"], [1, "payment-card-result__download-button", 3, "click"], [1, "payment-card-result__download-content"], ["width", "18", "height", "20", "viewBox", "0 0 18 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M14.3549 7.08398H12.4999V1.25065C12.4999 0.608984 11.9749 0.0839844 11.3333 0.0839844H6.66658C6.02492 0.0839844 5.49992 0.608984 5.49992 1.25065V7.08398H3.64492C2.60659 7.08398 2.08159 8.34398 2.81658 9.07898L8.17159 14.434C8.62659 14.889 9.36158 14.889 9.81658 14.434L15.1716 9.07898C15.9066 8.34398 15.3933 7.08398 14.3549 7.08398ZM0.833252 18.7507C0.833252 19.3923 1.35825 19.9173 1.99992 19.9173H15.9999C16.6416 19.9173 17.1666 19.3923 17.1666 18.7507C17.1666 18.109 16.6416 17.584 15.9999 17.584H1.99992C1.35825 17.584 0.833252 18.109 0.833252 18.7507Z", "fill", "#181818"], [1, "payment-card-result__section"], [1, "payment-card-result__section-title"], [1, "payment-card-result__nft-info"], ["class", "payment-card-result__nft-image", 4, "ngIf"], [1, "payment-card-result__nft-details"], ["class", "zelf-action-row", 4, "ngIf"], [1, "payment-card-result__nft-image"], ["alt", "ZelfKey NFT", 3, "src"], [1, "payment-card-result__contract-address", 3, "click", "title"], ["target", "_blank", 1, "payment-card-result__tx-link", 3, "href"], ["target", "_blank", 1, "payment-card-result__gateway-link", 3, "href"], [1, "payment-card-result__ipfs-content"], [1, "payment-card-result__security-content"], ["title", "Click to copy", 1, "payment-card-result__proof-string", 3, "click"], [1, "payment-card-result__qr-display"], ["alt", "Zelf QR Code", 1, "payment-card-result__qr-image", 3, "src"], [1, "payment-card-result__walrus-content"], ["class", "payment-card-result__status-badge", 4, "ngIf"], ["class", "payment-card-result__status-badge payment-card-result__status-badge--warning", 4, "ngIf"], [1, "payment-card-result__status-badge"], [1, "material-symbols-outlined", "payment-card-result__status-icon"], [1, "payment-card-result__status-badge", "payment-card-result__status-badge--warning"], [1, "payment-card-result__state", "payment-card-result__state--error"], [1, "material-symbols-outlined", "payment-card-result__icon", "payment-card-result__icon--error"]],
    template: function ZelfKeysPaymentCardResultComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](0, ZelfKeysPaymentCardResultComponent_div_0_Template, 4, 2, "div", 0);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_3__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_3__.TranslocoDirective, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.SlicePipe, _angular_common__WEBPACK_IMPORTED_MODULE_1__.DecimalPipe, _angular_common__WEBPACK_IMPORTED_MODULE_1__.DatePipe],
    styles: [".payment-card-result[_ngcontent-%COMP%] {\n  padding: 0 24px 24px;\n  display: flex;\n  align-items: flex-start;\n  justify-content: center;\n}\n.payment-card-result__container[_ngcontent-%COMP%] {\n  width: 100%;\n  text-align: center;\n}\n.payment-card-result__state--success[_ngcontent-%COMP%]   .payment-card-result__icon[_ngcontent-%COMP%], .payment-card-result__state--error[_ngcontent-%COMP%]   .payment-card-result__icon[_ngcontent-%COMP%] {\n  font-size: 64px;\n  width: 64px;\n  height: 64px;\n}\n.payment-card-result__state--success[_ngcontent-%COMP%]   .payment-card-result__title[_ngcontent-%COMP%], .payment-card-result__state--error[_ngcontent-%COMP%]   .payment-card-result__title[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n  margin: 0 0 12px 0;\n}\n.payment-card-result__state--success[_ngcontent-%COMP%]   .payment-card-result__description[_ngcontent-%COMP%], .payment-card-result__state--error[_ngcontent-%COMP%]   .payment-card-result__description[_ngcontent-%COMP%] {\n  font-size: 16px;\n  color: var(--zns-theme-text-muted, #96939e);\n  margin: 0 0 32px 0;\n}\n.payment-card-result__state--success[_ngcontent-%COMP%]   .payment-card-result__icon--success[_ngcontent-%COMP%] {\n  color: var(--zns-theme-success, #1ea446);\n}\n.payment-card-result__state--error[_ngcontent-%COMP%]   .payment-card-result__icon--error[_ngcontent-%COMP%] {\n  color: var(--zns-theme-error, #dc362e);\n}\n.payment-card-result__icon--success[_ngcontent-%COMP%], .payment-card-result__icon--error[_ngcontent-%COMP%] {\n  font-size: 64px;\n  width: 64px;\n  height: 64px;\n}\n.payment-card-result__title[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n  margin: 0 0 12px 0;\n}\n.payment-card-result__description[_ngcontent-%COMP%] {\n  font-size: 16px;\n  color: var(--zns-theme-text-muted, #96939e);\n  margin: 0 0 32px 0;\n}\n.payment-card-result__preview[_ngcontent-%COMP%] {\n  margin: 24px 0;\n}\n.payment-card-result__image-section[_ngcontent-%COMP%] {\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  border-radius: 12px;\n  padding: 24px;\n  margin: 24px 0;\n}\n.payment-card-result__security[_ngcontent-%COMP%] {\n  margin: 24px 0;\n}\n.payment-card-result__preview-content[_ngcontent-%COMP%]   .zelf-action-row[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n.payment-card-result__preview-content[_ngcontent-%COMP%]   .zelf-action-row[_ngcontent-%COMP%]:nth-child(3)   .zelf-action-row__value[_ngcontent-%COMP%], .payment-card-result__preview-content[_ngcontent-%COMP%]   .zelf-action-row[_ngcontent-%COMP%]:nth-child(4)   .zelf-action-row__value[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-monospace-family, \"Courier New\", Courier, monospace);\n  font-size: 14px;\n  letter-spacing: 0.5px;\n}\n.payment-card-result__preview-header[_ngcontent-%COMP%], .payment-card-result__image-header[_ngcontent-%COMP%], .payment-card-result__security-header[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n  text-align: left;\n}\n.payment-card-result__preview-title[_ngcontent-%COMP%], .payment-card-result__image-title[_ngcontent-%COMP%], .payment-card-result__security-title[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n  text-align: left;\n}\n.payment-card-result__preview-content[_ngcontent-%COMP%], .payment-card-result__security-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.payment-card-result__image-section[_ngcontent-%COMP%]   .payment-card-result__image-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  border-radius: 8px;\n  padding: 16px;\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  min-height: 120px;\n}\n.payment-card-result__image-section[_ngcontent-%COMP%]   .payment-card-result__card-image[_ngcontent-%COMP%] {\n  width: 100%;\n  max-height: 400px;\n  border-radius: 4px;\n  object-fit: contain;\n}\n.payment-card-result__image-section[_ngcontent-%COMP%]   .image-error[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text-muted, #96939e);\n  font-size: 14px;\n  font-style: italic;\n  text-align: center;\n  padding: 20px;\n}\n.payment-card-result__image-section[_ngcontent-%COMP%]   .payment-card-result__download-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  margin-top: 16px;\n}\n.payment-card-result__image-section[_ngcontent-%COMP%]   .payment-card-result__download-button[_ngcontent-%COMP%] {\n  display: flex;\n  background: none;\n  border: none;\n  cursor: pointer;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--zns-theme-text, #181818);\n  transition: background-color 0.2s ease;\n  border-radius: 12px;\n  padding: 12px;\n}\n.payment-card-result__image-section[_ngcontent-%COMP%]   .payment-card-result__download-button[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc);\n}\n.payment-card-result__image-section[_ngcontent-%COMP%]   .payment-card-result__download-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n}\n.payment-card-result__image-section[_ngcontent-%COMP%]   .payment-card-result__download-content[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n  flex-shrink: 0;\n}\n.payment-card-result__image-section[_ngcontent-%COMP%]   .payment-card-result__download-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 500;\n  text-align: center;\n  line-height: 14px;\n}\n.payment-card-result__security[_ngcontent-%COMP%]   .payment-card-result__security-title[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n}\n.payment-card-result__security[_ngcontent-%COMP%]   .zelf-action-row[_ngcontent-%COMP%] {\n  margin-bottom: 0;\n}\n.payment-card-result__security[_ngcontent-%COMP%]   .payment-card-result__proof-string[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-monospace-family, \"Courier New\", Courier, monospace);\n  font-size: 14px;\n  color: var(--zns-theme-text, #181818);\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  padding: 16px;\n  border-radius: 8px;\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  display: block;\n  word-break: break-all;\n  line-height: 1.4;\n  max-width: 100%;\n  overflow-wrap: break-word;\n  white-space: pre-wrap;\n  cursor: pointer;\n  -webkit-user-select: all;\n          user-select: all;\n  width: 100%;\n  box-sizing: border-box;\n  transition: all 0.2s ease;\n}\n.payment-card-result__security[_ngcontent-%COMP%]   .payment-card-result__proof-string[_ngcontent-%COMP%]:hover {\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  border-color: var(--zns-theme-border, #e3e3e3);\n}\n.payment-card-result__security[_ngcontent-%COMP%]   .payment-card-result__qr-display[_ngcontent-%COMP%] {\n  text-align: center;\n  max-width: 200px;\n  padding: 12px;\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  border-radius: 8px;\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);\n  margin: 0 auto 24px;\n}\n.payment-card-result__security[_ngcontent-%COMP%]   .payment-card-result__qr-display[_ngcontent-%COMP%]   .payment-card-result__qr-image[_ngcontent-%COMP%] {\n  max-width: 100%;\n  height: auto;\n  border-radius: 4px;\n  display: block;\n}\n.payment-card-result__actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  justify-content: stretch;\n  margin-top: 32px;\n  width: 100%;\n}\n.payment-card-result__actions[_ngcontent-%COMP%]   .zelf-button[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.payment-card-result__section[_ngcontent-%COMP%] {\n  margin: 24px 0;\n}\n.payment-card-result__section[_ngcontent-%COMP%]:first-child {\n  margin-top: 0;\n}\n.payment-card-result__section-title[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n  margin: 0 0 16px 0;\n  text-align: left;\n}\n.payment-card-result__nft-content[_ngcontent-%COMP%], .payment-card-result__nft-info[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 24px;\n  justify-content: center;\n  flex-direction: column;\n  align-items: center;\n  width: 100%;\n}\n.payment-card-result__nft-image[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  width: 200px;\n  height: 200px;\n  border-radius: 12px;\n  overflow: hidden;\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n}\n.payment-card-result__nft-image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.payment-card-result__nft-details[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  width: 100%;\n}\n.payment-card-result__ipfs-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.payment-card-result__tx-link[_ngcontent-%COMP%], .payment-card-result__gateway-link[_ngcontent-%COMP%] {\n  color: #3998d3;\n  text-decoration: none;\n  font-weight: 500;\n}\n.payment-card-result__tx-link[_ngcontent-%COMP%]:hover, .payment-card-result__gateway-link[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.payment-card-result__walrus-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  width: 100%;\n}\n\n@media (max-width: 768px) {\n  .payment-card-result[_ngcontent-%COMP%] {\n    padding: 16px;\n  }\n  .payment-card-result__actions[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 12px;\n  }\n  .payment-card-result__actions[_ngcontent-%COMP%]   .zelf-button[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvemVsZi1rZXlzL3plbGYta2V5cy1wYXltZW50LWNhcmRzL3plbGYta2V5cy1wYXltZW50LWNhcmQtcmVzdWx0L3plbGYta2V5cy1wYXltZW50LWNhcmQtcmVzdWx0LmNvbXBvbmVudC5zY3NzIiwid2VicGFjazovLy4vc3JjL3N0eWxlcy9fdmFyaWFibGVzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxvQkFBQTtFQUNBLGFBQUE7RUFDQSx1QkFBQTtFQUNBLHVCQUFBO0FBREo7QUFHSTtFQUNJLFdBQUE7RUFDQSxrQkFBQTtBQURSO0FBT1k7RUFDSSxlQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7QUFMaEI7QUFRWTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHFDQ01KO0VETEksa0JBQUE7QUFOaEI7QUFTWTtFQUNJLGVBQUE7RUFDQSwyQ0NDQztFREFELGtCQUFBO0FBUGhCO0FBWVk7RUFDSSx3Q0NqQ047QUR1QlY7QUFlWTtFQUNJLHNDQ25DUjtBRHNCUjtBQW1CUTtFQUVJLGVBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtBQWxCWjtBQXNCSTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHFDQzlCSTtFRCtCSixrQkFBQTtBQXBCUjtBQXVCSTtFQUNJLGVBQUE7RUFDQSwyQ0NuQ1M7RURvQ1Qsa0JBQUE7QUFyQlI7QUF3Qkk7RUFDSSxjQUFBO0FBdEJSO0FBeUJJO0VBQ0ksMERDL0NtQjtFRGdEbkIsa0RBQUE7RUFDQSxtQkFBQTtFQUNBLGFBQUE7RUFDQSxjQUFBO0FBdkJSO0FBMEJJO0VBQ0ksY0FBQTtBQXhCUjtBQTRCUTtFQUNJLGdCQUFBO0FBMUJaO0FBK0JnQjtFQUNJLGlGQ3JFRztFRHNFSCxlQUFBO0VBQ0EscUJBQUE7QUE3QnBCO0FBbUNJO0VBR0ksbUJBQUE7RUFDQSxnQkFBQTtBQW5DUjtBQXNDSTtFQUdJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHFDQ3BGSTtFRHFGSixTQUFBO0VBQ0EsZ0JBQUE7QUF0Q1I7QUF5Q0k7RUFFSSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxTQUFBO0FBeENSO0FBNENRO0VBQ0ksYUFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFDQSwwREN2R2U7RUR3R2Ysa0JBQUE7RUFDQSxhQUFBO0VBQ0Esa0RBQUE7RUFDQSxpQkFBQTtBQTFDWjtBQTZDUTtFQUNJLFdBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0EsbUJBQUE7QUEzQ1o7QUE4Q1E7RUFDSSwyQ0NuSEs7RURvSEwsZUFBQTtFQUNBLGtCQUFBO0VBQ0Esa0JBQUE7RUFDQSxhQUFBO0FBNUNaO0FBK0NRO0VBQ0ksYUFBQTtFQUNBLHVCQUFBO0VBQ0EsZ0JBQUE7QUE3Q1o7QUFnRFE7RUFDSSxhQUFBO0VBQ0EsZ0JBQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQTtFQUNBLHVFQzdJTTtFRDhJTixlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQ0N6SUE7RUQwSUEsc0NBQUE7RUFDQSxtQkFBQTtFQUNBLGFBQUE7QUE5Q1o7QUFnRFk7RUFDSSxnRUNqSlc7QURtRzNCO0FBa0RRO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSxRQUFBO0VBQ0EsV0FBQTtBQWhEWjtBQWtEWTtFQUNJLFdBQUE7RUFDQSxZQUFBO0VBQ0EsY0FBQTtBQWhEaEI7QUFtRFk7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLGlCQUFBO0FBakRoQjtBQXVEUTtFQUNJLHFDQzNLQTtBRHNIWjtBQXdEUTtFQUNJLGdCQUFBO0FBdERaO0FBeURRO0VBQ0ksaUZDeExXO0VEeUxYLGVBQUE7RUFDQSxxQ0NyTEE7RURzTEEsMERDeExlO0VEeUxmLGFBQUE7RUFDQSxrQkFBQTtFQUNBLGtEQUFBO0VBQ0EsY0FBQTtFQUNBLHFCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxlQUFBO0VBQ0EseUJBQUE7RUFDQSxxQkFBQTtFQUNBLGVBQUE7RUFDQSx3QkFBQTtVQUFBLGdCQUFBO0VBQ0EsV0FBQTtFQUNBLHNCQUFBO0VBQ0EseUJBQUE7QUF2RFo7QUF5RFk7RUFDSSwwREN6TVc7RUQwTVgsOENDekxGO0FEa0lkO0FBMkRRO0VBQ0ksa0JBQUE7RUFDQSxnQkFBQTtFQUNBLGFBQUE7RUFDQSwwRENsTmU7RURtTmYsa0JBQUE7RUFDQSxrREFBQTtFQUNBLHdDQUFBO0VBQ0EsbUJBQUE7QUF6RFo7QUEyRFk7RUFDSSxlQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsY0FBQTtBQXpEaEI7QUE4REk7RUFDSSxhQUFBO0VBQ0EsU0FBQTtFQUNBLHdCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxXQUFBO0FBNURSO0FBOERRO0VBQ0ksT0FBQTtBQTVEWjtBQWdFSTtFQUNJLGNBQUE7QUE5RFI7QUFnRVE7RUFDSSxhQUFBO0FBOURaO0FBa0VJO0VBQ0ksZUFBQTtFQUNBLGdCQUFBO0VBQ0EscUNDdFBJO0VEdVBKLGtCQUFBO0VBQ0EsZ0JBQUE7QUFoRVI7QUFtRUk7RUFFSSxhQUFBO0VBQ0EsU0FBQTtFQUNBLHVCQUFBO0VBQ0Esc0JBQUE7RUFDQSxtQkFBQTtFQUNBLFdBQUE7QUFsRVI7QUFxRUk7RUFDSSxjQUFBO0VBQ0EsWUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLGdCQUFBO0VBQ0Esa0RBQUE7QUFuRVI7QUFxRVE7RUFDSSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGlCQUFBO0FBbkVaO0FBdUVJO0VBQ0ksT0FBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7RUFDQSxXQUFBO0FBckVSO0FBd0VJO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsU0FBQTtBQXRFUjtBQXlFSTtFQUVJLGNDbFREO0VEbVRDLHFCQUFBO0VBQ0EsZ0JBQUE7QUF4RVI7QUEwRVE7RUFDSSwwQkFBQTtBQXhFWjtBQTRFSTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7RUFDQSxXQUFBO0FBMUVSOztBQStFQTtFQUNJO0lBQ0ksYUFBQTtFQTVFTjtFQThFTTtJQUNJLHNCQUFBO0lBQ0EsU0FBQTtFQTVFVjtFQThFVTtJQUNJLFdBQUE7RUE1RWQ7QUFDRiIsInNvdXJjZXNDb250ZW50IjpbIkB1c2UgXCIuLi8uLi8uLi8uLi9zdHlsZXMvdmFyaWFibGVzXCI7XG5cbi5wYXltZW50LWNhcmQtcmVzdWx0IHtcbiAgICBwYWRkaW5nOiAwIDI0cHggMjRweDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXG4gICAgJl9fY29udGFpbmVyIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX19zdGF0ZSB7XG4gICAgICAgICYtLXN1Y2Nlc3MsXG4gICAgICAgICYtLWVycm9yIHtcbiAgICAgICAgICAgIC5wYXltZW50LWNhcmQtcmVzdWx0X19pY29uIHtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDY0cHg7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDY0cHg7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA2NHB4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAucGF5bWVudC1jYXJkLXJlc3VsdF9fdGl0bGUge1xuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgICAgICBtYXJnaW46IDAgMCAxMnB4IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC5wYXltZW50LWNhcmQtcmVzdWx0X19kZXNjcmlwdGlvbiB7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgICAgICAgICAgICAgIG1hcmdpbjogMCAwIDMycHggMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICYtLXN1Y2Nlc3Mge1xuICAgICAgICAgICAgLnBheW1lbnQtY2FyZC1yZXN1bHRfX2ljb24tLXN1Y2Nlc3Mge1xuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmLS1lcnJvciB7XG4gICAgICAgICAgICAucGF5bWVudC1jYXJkLXJlc3VsdF9faWNvbi0tZXJyb3Ige1xuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9faWNvbiB7XG4gICAgICAgICYtLXN1Y2Nlc3MsXG4gICAgICAgICYtLWVycm9yIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogNjRweDtcbiAgICAgICAgICAgIHdpZHRoOiA2NHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiA2NHB4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fdGl0bGUge1xuICAgICAgICBmb250LXNpemU6IDI0cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgbWFyZ2luOiAwIDAgMTJweCAwO1xuICAgIH1cblxuICAgICZfX2Rlc2NyaXB0aW9uIHtcbiAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgbWFyZ2luOiAwIDAgMzJweCAwO1xuICAgIH1cblxuICAgICZfX3ByZXZpZXcge1xuICAgICAgICBtYXJnaW46IDI0cHggMDtcbiAgICB9XG5cbiAgICAmX19pbWFnZS1zZWN0aW9uIHtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICAgIHBhZGRpbmc6IDI0cHg7XG4gICAgICAgIG1hcmdpbjogMjRweCAwO1xuICAgIH1cblxuICAgICZfX3NlY3VyaXR5IHtcbiAgICAgICAgbWFyZ2luOiAyNHB4IDA7XG4gICAgfVxuXG4gICAgJl9fcHJldmlldy1jb250ZW50IHtcbiAgICAgICAgLnplbGYtYWN0aW9uLXJvdyB7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xuXG4gICAgICAgICAgICAmOm50aC1jaGlsZCgzKSwgLy8gQ2FyZCBOdW1iZXIgcm93XG4gICAgICAgICAgICAmOm50aC1jaGlsZCg0KSB7XG4gICAgICAgICAgICAgICAgLy8gRXhwaXJ5IHJvd1xuICAgICAgICAgICAgICAgIC56ZWxmLWFjdGlvbi1yb3dfX3ZhbHVlIHtcbiAgICAgICAgICAgICAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVNb25vc3BhY2VGYW1pbHk7XG4gICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3ByZXZpZXctaGVhZGVyLFxuICAgICZfX2ltYWdlLWhlYWRlcixcbiAgICAmX19zZWN1cml0eS1oZWFkZXIge1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAxNnB4O1xuICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgIH1cblxuICAgICZfX3ByZXZpZXctdGl0bGUsXG4gICAgJl9faW1hZ2UtdGl0bGUsXG4gICAgJl9fc2VjdXJpdHktdGl0bGUge1xuICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgIH1cblxuICAgICZfX3ByZXZpZXctY29udGVudCxcbiAgICAmX19zZWN1cml0eS1jb250ZW50IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiAxMnB4O1xuICAgIH1cblxuICAgICZfX2ltYWdlLXNlY3Rpb24ge1xuICAgICAgICAucGF5bWVudC1jYXJkLXJlc3VsdF9faW1hZ2UtY29udGFpbmVyIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDE2cHg7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyO1xuICAgICAgICAgICAgbWluLWhlaWdodDogMTIwcHg7XG4gICAgICAgIH1cblxuICAgICAgICAucGF5bWVudC1jYXJkLXJlc3VsdF9fY2FyZC1pbWFnZSB7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIG1heC1oZWlnaHQ6IDQwMHB4O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgICAgICAgICAgb2JqZWN0LWZpdDogY29udGFpbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC5pbWFnZS1lcnJvciB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgICAgIHBhZGRpbmc6IDIwcHg7XG4gICAgICAgIH1cblxuICAgICAgICAucGF5bWVudC1jYXJkLXJlc3VsdF9fZG93bmxvYWQtY29udGFpbmVyIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDE2cHg7XG4gICAgICAgIH1cblxuICAgICAgICAucGF5bWVudC1jYXJkLXJlc3VsdF9fZG93bmxvYWQtYnV0dG9uIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBub25lO1xuICAgICAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlO1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDEycHg7XG5cbiAgICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLnBheW1lbnQtY2FyZC1yZXN1bHRfX2Rvd25sb2FkLWNvbnRlbnQge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgZ2FwOiA4cHg7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMjRweDtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDI0cHg7XG4gICAgICAgICAgICAgICAgZmxleC1zaHJpbms6IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNwYW4ge1xuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgICAgICAgICBsaW5lLWhlaWdodDogMTRweDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3NlY3VyaXR5IHtcbiAgICAgICAgLnBheW1lbnQtY2FyZC1yZXN1bHRfX3NlY3VyaXR5LXRpdGxlIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIC56ZWxmLWFjdGlvbi1yb3cge1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5wYXltZW50LWNhcmQtcmVzdWx0X19wcm9vZi1zdHJpbmcge1xuICAgICAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVNb25vc3BhY2VGYW1pbHk7XG4gICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbiAgICAgICAgICAgIHBhZGRpbmc6IDE2cHg7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyO1xuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgICAgICB3b3JkLWJyZWFrOiBicmVhay1hbGw7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMS40O1xuICAgICAgICAgICAgbWF4LXdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgb3ZlcmZsb3ctd3JhcDogYnJlYWstd29yZDtcbiAgICAgICAgICAgIHdoaXRlLXNwYWNlOiBwcmUtd3JhcDtcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgIHVzZXItc2VsZWN0OiBhbGw7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xuXG4gICAgICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbiAgICAgICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAucGF5bWVudC1jYXJkLXJlc3VsdF9fcXItZGlzcGxheSB7XG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgICAgICBtYXgtd2lkdGg6IDIwMHB4O1xuICAgICAgICAgICAgcGFkZGluZzogMTJweDtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5O1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMnB4IDhweCByZ2JhKDAsIDAsIDAsIDAuMSk7XG4gICAgICAgICAgICBtYXJnaW46IDAgYXV0byAyNHB4O1xuXG4gICAgICAgICAgICAucGF5bWVudC1jYXJkLXJlc3VsdF9fcXItaW1hZ2Uge1xuICAgICAgICAgICAgICAgIG1heC13aWR0aDogMTAwJTtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGF1dG87XG4gICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fYWN0aW9ucyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGdhcDogMTJweDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzdHJldGNoO1xuICAgICAgICBtYXJnaW4tdG9wOiAzMnB4O1xuICAgICAgICB3aWR0aDogMTAwJTtcblxuICAgICAgICAuemVsZi1idXR0b24ge1xuICAgICAgICAgICAgZmxleDogMTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3NlY3Rpb24ge1xuICAgICAgICBtYXJnaW46IDI0cHggMDtcblxuICAgICAgICAmOmZpcnN0LWNoaWxkIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19zZWN0aW9uLXRpdGxlIHtcbiAgICAgICAgZm9udC1zaXplOiAyMHB4O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIG1hcmdpbjogMCAwIDE2cHggMDtcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICB9XG5cbiAgICAmX19uZnQtY29udGVudCxcbiAgICAmX19uZnQtaW5mbyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGdhcDogMjRweDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgICZfX25mdC1pbWFnZSB7XG4gICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgICAgICB3aWR0aDogMjAwcHg7XG4gICAgICAgIGhlaWdodDogMjAwcHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG5cbiAgICAgICAgaW1nIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICAgICAgb2JqZWN0LWZpdDogY292ZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19uZnQtZGV0YWlscyB7XG4gICAgICAgIGZsZXg6IDE7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogMTJweDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgJl9faXBmcy1jb250ZW50IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiAxMnB4O1xuICAgIH1cblxuICAgICZfX3R4LWxpbmssXG4gICAgJl9fZ2F0ZXdheS1saW5rIHtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kaW5mbztcbiAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX193YWxydXMtY29udGVudCB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogMTJweDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxufVxuXG4vLyBSZXNwb25zaXZlIGRlc2lnblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gICAgLnBheW1lbnQtY2FyZC1yZXN1bHQge1xuICAgICAgICBwYWRkaW5nOiAxNnB4O1xuXG4gICAgICAgICZfX2FjdGlvbnMge1xuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgICAgIGdhcDogMTJweDtcblxuICAgICAgICAgICAgLnplbGYtYnV0dG9uIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIiRwcmltYXJ5Q29sb3I6IHZhcigtLXpucy10aGVtZS1wcmltYXJ5LCAjMTgxODE4KTtcbiRwcmltYXJ5TGlnaHQ6ICNkYWRkZmE7XG4kc2Vjb25kYXJ5Q29sb3I6IHZhcigtLXpucy10aGVtZS1zZWNvbmRhcnksICNmZjU3MjEpO1xuJHNlY29uZGFyeUNvbG9yTGlnaHQ6ICNmNmU1ZTA7XG5cbiRjb3JyZWN0OiB2YXIoLS16bnMtdGhlbWUtc3VjY2VzcywgIzFlYTQ0Nik7XG4kY29ycmVjdERhcms6ICMwZjUyMjM7XG4kY29ycmVjdExpZ2h0OiB2YXIoLS16bnMtdGhlbWUtc3VjY2Vzcy10ZXh0LCAjZTdmOGVkKTtcblxuJGVycm9yOiB2YXIoLS16bnMtdGhlbWUtZXJyb3IsICNkYzM2MmUpO1xuJGVycm9yRGFyazogIzYwMTQxMDtcbiRlcnJvckxpZ2h0OiB2YXIoLS16bnMtdGhlbWUtZXJyb3ItdGV4dCwgI2ZjZWVlZSk7XG5cbiR3YXJuaW5nOiB2YXIoLS16bnMtdGhlbWUtd2FybmluZywgI2RlNjgwMCk7XG4kd2FybmluZ0Rhcms6ICM0YTIxMGE7XG4kd2FybmluZ0xpZ2h0OiB2YXIoLS16bnMtdGhlbWUtd2FybmluZy10ZXh0LCAjZmZlZWU5KTtcblxuJGluZm86ICMzOTk4ZDM7XG4kaW5mb0Rhcms6ICMwMDRhNzc7XG4kaW5mb0xpZ2h0OiAjZWNmM2ZlO1xuXG4kYmxhY2s6ICMxODE4MTg7XG4kd2hpdGU6ICNmZmZmZmY7XG5cbiR0aGVtZUJvZHlGYW1pbHk6IHZhcigtLXpucy10aGVtZS1ib2R5LWZhbWlseSwgXCJQb3BwaW5zXCIsIEFyaWFsLCBzYW5zLXNlcmlmKTtcbiR0aGVtZVRpdGxlRmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtdGl0bGUtZmFtaWx5LCBcIk1lbmRhXCIsIFwiQXJpYWwgQmxhY2tcIiwgc2Fucy1zZXJpZik7XG4kdGhlbWVNb25vc3BhY2VGYW1pbHk6IHZhcigtLXpucy10aGVtZS1tb25vc3BhY2UtZmFtaWx5LCBcIkNvdXJpZXIgTmV3XCIsIENvdXJpZXIsIG1vbm9zcGFjZSk7XG5cbiR0aGVtZUJhY2tncm91bmQ6IHZhcigtLXpucy10aGVtZS1iYWNrZ3JvdW5kLCAjZmZmZmZmKTtcbiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS1iYWNrZ3JvdW5kLXNlY29uZGFyeSwgI2Y5ZjlmYyk7XG5cbiR0aGVtZVRleHQ6IHZhcigtLXpucy10aGVtZS10ZXh0LCAjMTgxODE4KTtcbiR0aGVtZVRleHRNdXRlZDogdmFyKC0tem5zLXRoZW1lLXRleHQtbXV0ZWQsICM5NjkzOWUpO1xuJHRoZW1lVGV4dFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLXRleHQtc2Vjb25kYXJ5LCAjNzM3NzdmKTtcblxuJHRoZW1lSGVhZGVyOiB2YXIoLS16bnMtdGhlbWUtaGVhZGVyLCAjMTgxODE4KTtcbiR0aGVtZUhlYWRlclRleHQ6IHZhcigtLXpucy10aGVtZS1oZWFkZXItdGV4dCwgI2ZmZmZmZik7XG5cbiR0aGVtZUJ1dHRvbjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbiwgIzE4MTgxOCk7XG4kdGhlbWVCdXR0b25UZXh0OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXRleHQsICNmZmZmZmYpO1xuJHRoZW1lQnV0dG9uSG92ZXI6IHZhcigtLXpucy10aGVtZS1idXR0b24taG92ZXIsICNmZjU3MjEpO1xuXG4kdGhlbWVCdXR0b25TZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LCAjZTllY2VmKTtcbiR0aGVtZUJ1dHRvblNlY29uZGFyeVRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LXRleHQsICM0OTUwNTcpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5SG92ZXI6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LWhvdmVyLCAjZTllY2VmKTtcblxuJHRoZW1lQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtYm9yZGVyLCAjZTNlM2UzKTtcbiR0aGVtZUJvcmRlckhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYm9yZGVyLWhvdmVyLCAjYzNjNmNmKTtcblxuJHRoZW1lQ2FyZDogdmFyKC0tem5zLXRoZW1lLWNhcmQsICNmZmZmZmYpO1xuJHRoZW1lQ2FyZEJvcmRlcjogdmFyKC0tem5zLXRoZW1lLWNhcmQtYm9yZGVyLCAjZWVlZGYxKTtcblxuJHRoZW1lU2hhZG93OiB2YXIoLS16bnMtdGhlbWUtc2hhZG93LCByZ2JhKDAsIDAsIDAsIDAuMSkpO1xuXG4kc21vb3RoQmV6aWVyOiBjdWJpYy1iZXppZXIoMC4yNSwgMC40LCAwLjcsIDEpO1xuXG4kbWF4RXh0cmFTbWFsbDogNTk1cHg7XG4kbWluU21hbGw6IDYwMHB4O1xuJG1lZGl1bTogNzY4cHg7XG4kbGFyZ2U6IDg4OXB4O1xuJGNvbXB1dGVyczogMTIwMHB4O1xuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }

}]);
//# sourceMappingURL=src_app_zelf-keys_zelf-keys-payment-cards_zelf-keys-payment-card-result_zelf-keys-payment-car-e7026e.js.map