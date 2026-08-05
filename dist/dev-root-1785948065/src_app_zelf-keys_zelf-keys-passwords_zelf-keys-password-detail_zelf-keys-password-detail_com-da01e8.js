"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_zelf-keys_zelf-keys-passwords_zelf-keys-password-detail_zelf-keys-password-detail_com-da01e8"],{

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

/***/ 56911
/*!****************************************************************************************************************!*\
  !*** ./src/app/zelf-keys/zelf-keys-passwords/zelf-keys-password-detail/zelf-keys-password-detail.component.ts ***!
  \****************************************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZelfKeysPasswordDetailComponent: () => (/* binding */ ZelfKeysPasswordDetailComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 34487);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 33900);
/* harmony import */ var app_base_copy_to_clipboard_copy_to_clipboard_base__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/base/copy-to-clipboard/copy-to-clipboard.base */ 88070);
/* harmony import */ var app_services_zelf_keys_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! app/services/zelf-keys.service */ 52368);
/* harmony import */ var _popout_decryptor_popout_decryptor_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../popout-decryptor/popout-decryptor.component */ 37942);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _services_password_data_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../services/password-data.service */ 9526);
/* harmony import */ var _services_popout_communication_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../services/popout-communication.service */ 8298);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var _services_scroll_to_section_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../services/scroll-to-section.service */ 51001);
/* harmony import */ var _chrome_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../chrome.service */ 85043);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/snack-bar */ 3347);

















const _c0 = a0 => ({
  externalUrl: a0
});
const _c1 = () => ["/external-link"];
function ZelfKeysPasswordDetailComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](4, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](4, 1, "billing.passwords.detail.loading"));
  }
}
function ZelfKeysPasswordDetailComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 9)(1, "span", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2, "warning");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](5, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](6, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](8, "button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysPasswordDetailComponent_div_2_Template_button_click_8_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.onBackToList());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](10, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](5, 3, "billing.passwords.detail.error.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.error);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](10, 5, "billing.passwords.detail.error.go_back"));
  }
}
function ZelfKeysPasswordDetailComponent_div_3_div_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ctx_r1.zelfKeyPasswordRecord.publicData.website, " ");
  }
}
function ZelfKeysPasswordDetailComponent_div_3_ng_template_35_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "billing.passwords.detail.no_website"));
  }
}
function ZelfKeysPasswordDetailComponent_div_3_div_37_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 48)(1, "button", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "svg", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](4, "path", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("queryParams", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction1"](5, _c0, ctx_r1.zelfKeyPasswordRecord.publicData.website || ""))("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction0"](7, _c1))("title", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 3, "billing.passwords.detail.info.launch_website"));
  }
}
function ZelfKeysPasswordDetailComponent_div_3_div_45_span_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, ctx_r1.getCategoryTranslationKey()), " ");
  }
}
function ZelfKeysPasswordDetailComponent_div_3_div_45_span_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ctx_r1.getCategory(), " ");
  }
}
function ZelfKeysPasswordDetailComponent_div_3_div_45_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 33)(1, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](3, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](5, ZelfKeysPasswordDetailComponent_div_3_div_45_span_5_Template, 3, 3, "span", 52)(6, ZelfKeysPasswordDetailComponent_div_3_div_45_span_6_Template, 2, 1, "span", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](3, 3, "billing.passwords.detail.info.category"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.getCategoryTranslationKey());
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx_r1.getCategoryTranslationKey());
  }
}
function ZelfKeysPasswordDetailComponent_div_3_div_61_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 33)(1, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](3, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "span", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](5, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysPasswordDetailComponent_div_3_div_61_Template_span_click_4_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.copyZelfProof());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](3, 3, "billing.passwords.detail.zelfproof.proof_label"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("title", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](5, 5, "billing.passwords.detail.zelfproof.copy_hint"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.getZelfProofPreview(36));
  }
}
function ZelfKeysPasswordDetailComponent_div_3_div_80_ng_container_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainer"](0);
  }
}
function ZelfKeysPasswordDetailComponent_div_3_div_80__svg_svg_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "svg", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "path", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ZelfKeysPasswordDetailComponent_div_3_div_80__svg_svg_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "svg", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "path", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ZelfKeysPasswordDetailComponent_div_3_div_80_ng_container_35_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainer"](0);
  }
}
function ZelfKeysPasswordDetailComponent_div_3_div_80_div_36_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 33)(1, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](3, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](3, 2, "billing.passwords.detail.decrypted.notes"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.decryptedData.notes);
  }
}
function ZelfKeysPasswordDetailComponent_div_3_div_80_div_37_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 33)(1, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](3, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "span", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](3, 2, "billing.passwords.detail.decrypted.difficulty"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.decryptedData.difficulty);
  }
}
function ZelfKeysPasswordDetailComponent_div_3_div_80_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 54)(1, "h3", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](3, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "div", 26)(5, "div", 33)(6, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](8, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](9, "div", 56)(10, "span", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](12, "button", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](13, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysPasswordDetailComponent_div_3_div_80_Template_button_click_12_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.onCopyWebsite());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](14, ZelfKeysPasswordDetailComponent_div_3_div_80_ng_container_14_Template, 1, 0, "ng-container", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](15, "div", 33)(16, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](18, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](19, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](21, "div", 33)(22, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](24, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](25, "div", 60)(26, "span", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](27);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](28, "button", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](29, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](30, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysPasswordDetailComponent_div_3_div_80_Template_button_click_28_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.onTogglePasswordVisibility());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](31, ZelfKeysPasswordDetailComponent_div_3_div_80__svg_svg_31_Template, 2, 0, "svg", 62)(32, ZelfKeysPasswordDetailComponent_div_3_div_80__svg_svg_32_Template, 2, 0, "svg", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](33, "button", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](34, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysPasswordDetailComponent_div_3_div_80_Template_button_click_33_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.onCopyPassword());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](35, ZelfKeysPasswordDetailComponent_div_3_div_80_ng_container_35_Template, 1, 0, "ng-container", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](36, ZelfKeysPasswordDetailComponent_div_3_div_80_div_36_Template, 6, 4, "div", 34)(37, ZelfKeysPasswordDetailComponent_div_3_div_80_div_37_Template, 6, 4, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
    const clipboardIcon_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵreference"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](3, 16, "billing.passwords.detail.decrypted.title"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](8, 18, "billing.passwords.detail.decrypted.website"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.decryptedData.website || "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("title", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](13, 20, "billing.passwords.detail.decrypted.copy_website"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngTemplateOutlet", clipboardIcon_r6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](18, 22, "billing.passwords.detail.decrypted.username"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.decryptedData.username || "N/A");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](24, 24, "billing.passwords.detail.decrypted.password"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ctx_r1.showPassword ? ctx_r1.decryptedData.password || "N/A" : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("title", ctx_r1.showPassword ? _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](29, 26, "billing.passwords.detail.decrypted.hide_password") : _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](30, 28, "billing.passwords.detail.decrypted.show_password"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx_r1.showPassword);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.showPassword);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("title", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](34, 30, "billing.passwords.detail.decrypted.copy_password"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngTemplateOutlet", clipboardIcon_r6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.decryptedData.notes);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.decryptedData.difficulty);
  }
}
function ZelfKeysPasswordDetailComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 12)(1, "div", 13)(2, "button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysPasswordDetailComponent_div_3_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.onBackToList());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "svg", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](4, "path", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](5, "div", 17)(6, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](8, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](9, "h3", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](11, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](12, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](14, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](15, "div", 21)(16, "button", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysPasswordDetailComponent_div_3_Template_button_click_16_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.onDecryptClick());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](18, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](19, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](20, "button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysPasswordDetailComponent_div_3_Template_button_click_20_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.onOpenSite());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](21);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](22, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](23, "div", 24)(24, "h3", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](25);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](26, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](27, "div", 26)(28, "div", 27)(29, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](31, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](32, "div", 29)(33, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](34, ZelfKeysPasswordDetailComponent_div_3_div_34_Template, 2, 1, "div", 31)(35, ZelfKeysPasswordDetailComponent_div_3_ng_template_35_Template, 3, 3, "ng-template", null, 1, _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplateRefExtractor"])(37, ZelfKeysPasswordDetailComponent_div_3_div_37_Template, 5, 8, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](38, "div", 33)(39, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](40);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](41, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](42, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](43);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](44, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](45, ZelfKeysPasswordDetailComponent_div_3_div_45_Template, 7, 5, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](46, "div", 33)(47, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](48);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](49, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](50, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](51);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](52, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](53, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](54, "div", 33)(55, "span", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](56);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](57, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](58, "span", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](59, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysPasswordDetailComponent_div_3_Template_span_click_58_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.copyIpfsHash());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](60);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](61, ZelfKeysPasswordDetailComponent_div_3_div_61_Template, 7, 7, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](62, "div", 24)(63, "h3", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](64);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](65, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](66, "div", 26)(67, "div", 36)(68, "div", 37)(69, "img", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](70, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("error", function ZelfKeysPasswordDetailComponent_div_3_Template_img_error_69_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.onImageError($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](71, "div", 39)(72, "div", 40)(73, "button", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ZelfKeysPasswordDetailComponent_div_3_Template_button_click_73_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.onDownloadZelfProof());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](74, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](75, "svg", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](76, "path", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](77, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](78);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](79, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](80, ZelfKeysPasswordDetailComponent_div_3_div_80_Template, 38, 32, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const noWebsite_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵreference"](36);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](8, 26, ctx_r1.getCategoryTranslationKey() || "zelf_keys.categories.password"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ctx_r1.getWebsiteHostname(ctx_r1.zelfKeyPasswordRecord.publicData.website) || _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](11, 28, "billing.passwords.detail.untitled"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ctx_r1.zelfKeyPasswordRecord.publicData.username || _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](14, 30, "billing.passwords.detail.no_username"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("disabled", ctx_r1.decrypting);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ctx_r1.decrypting ? _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](18, 32, "billing.passwords.detail.decrypt.decrypting") : _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](19, 34, "billing.passwords.detail.decrypt.button"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("disabled", !ctx_r1.zelfKeyPasswordRecord.publicData.website);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](22, 36, "billing.passwords.detail.decrypt.open_site"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](26, 38, "billing.passwords.detail.info.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](31, 40, "billing.passwords.detail.info.website"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.zelfKeyPasswordRecord.publicData.website)("ngIfElse", noWebsite_r7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.zelfKeyPasswordRecord.publicData.website);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](41, 42, "billing.passwords.detail.info.username"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ctx_r1.zelfKeyPasswordRecord.publicData.username || _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](44, 44, "billing.passwords.detail.no_username"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.getCategory());
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](49, 46, "billing.passwords.detail.info.created"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ctx_r1.zelfKeyPasswordRecord.publicData.timestamp ? _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind2"](52, 48, ctx_r1.zelfKeyPasswordRecord.publicData.timestamp, "medium") : _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](53, 51, "billing.passwords.detail.unknown_date"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](57, 53, "billing.passwords.detail.info.ipfs_hash"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("title", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](59, 55, "billing.passwords.detail.info.copy_ipfs_hash"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.getIpfsHashPreview(32));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.zelfKeyPasswordRecord.zelfProof);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](65, 57, "billing.passwords.detail.zelfproof.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("src", ctx_r1.zelfKeyPasswordRecord.url, _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵsanitizeUrl"])("alt", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](70, 59, "billing.passwords.detail.zelfproof.image_alt"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](79, 61, "billing.passwords.detail.zelfproof.download"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.decryptedData);
  }
}
function ZelfKeysPasswordDetailComponent_popout_decryptor_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "popout-decryptor", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("close", function ZelfKeysPasswordDetailComponent_popout_decryptor_4_Template_popout_decryptor_close_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r8);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.onPopoutDecryptorClose());
    })("decryptedData", function ZelfKeysPasswordDetailComponent_popout_decryptor_4_Template_popout_decryptor_decryptedData_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r8);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.handleDecryptionResult($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function ZelfKeysPasswordDetailComponent_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "svg", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "path", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
class ZelfKeysPasswordDetailComponent extends app_base_copy_to_clipboard_copy_to_clipboard_base__WEBPACK_IMPORTED_MODULE_6__.CopyToClipboardBase {
  _changeDetectorRef;
  _passwordDataService;
  _popoutCommunicationService;
  _router;
  _scrollToSectionService;
  _chromeService;
  _snackBar;
  _translocoService;
  _destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__.Subject();
  decryptedData = null;
  decrypting = false;
  error = null;
  isPopout = false;
  loading = false;
  showBiometrics = false;
  showPassword = false;
  showPopoutDecryptor = false;
  zelfKeyPasswordRecord = null;
  constructor(_changeDetectorRef, _passwordDataService, _popoutCommunicationService, _router, _scrollToSectionService, _chromeService, _snackBar, _translocoService) {
    super(_chromeService, _snackBar, _translocoService);
    this._changeDetectorRef = _changeDetectorRef;
    this._passwordDataService = _passwordDataService;
    this._popoutCommunicationService = _popoutCommunicationService;
    this._router = _router;
    this._scrollToSectionService = _scrollToSectionService;
    this._chromeService = _chromeService;
    this._snackBar = _snackBar;
    this._translocoService = _translocoService;
    this.isPopout = this._chromeService.isPopout;
    this._initSubscriptions();
  }
  ngOnInit() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this._loadPasswordData();
    })();
  }
  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
    this._popoutCommunicationService.clearDecryptionData();
    this._popoutCommunicationService.clearDecryptionResult();
    chrome.runtime.onMessage.removeListener(this._handleDecryptionResultListener);
  }
  get decryptionPayload() {
    if (!this.zelfKeyPasswordRecord) return null;
    return {
      requestId: this.zelfKeyPasswordRecord.id,
      type: "password",
      zelfProof: this.zelfKeyPasswordRecord.zelfProof || "",
      publicData: {
        title: this.zelfKeyPasswordRecord.publicData?.website || "Password",
        username: this.zelfKeyPasswordRecord.publicData?.username || "",
        website: this.zelfKeyPasswordRecord.publicData?.website || ""
      }
    };
  }
  _handleDecryptionResultListener = message => {
    if (message.type === "DECRYPTION_RESULT_FROM_POPOUT" && this.zelfKeyPasswordRecord?.id === message.payload?.requestId) {
      this.handleDecryptionResult(message.payload?.result?.data);
      chrome.runtime.onMessage.removeListener(this._handleDecryptionResultListener);
    }
    return true;
  };
  _initSubscriptions() {
    this._chromeService.isPopout$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.takeUntil)(this._destroy$)).subscribe(isPopout => {
      this.isPopout = isPopout;
    });
    this._popoutCommunicationService.decryptionResult$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_5__.takeUntil)(this._destroy$)).subscribe(result => {
      if (!result?.success || !this.showPopoutDecryptor) return;
      this.handleDecryptionResult(result.data);
      this.showPopoutDecryptor = false;
    });
  }
  _loadPasswordData() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this2.loading = true;
      _this2.error = null;
      try {
        const passwordData = _this2._passwordDataService.getCurrentPassword();
        if (!passwordData) {
          _this2.error = _this2._translocoService.translate("zelf_keys.passwords.detail.error.not_found");
          return;
        }
        _this2.zelfKeyPasswordRecord = passwordData;
      } catch (error) {
        _this2.error = _this2._translocoService.translate("zelf_keys.passwords.detail.error.load_failed");
      } finally {
        _this2.loading = false;
      }
    })();
  }
  _setDecryptionDataForService() {
    if (!this.isPopout) return;
    this._popoutCommunicationService.setDecryptionData(this.decryptionPayload);
  }
  onDecryptClick() {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this3.decryptedData) {
        _this3._scrollToSectionService.scrollToSection("password-decrypted-content", "password");
        return;
      }
      if (_this3.isPopout) {
        _this3.showPopoutDecryptor = true;
        _this3._setDecryptionDataForService();
        return;
      }
      const isPopoutOpen = yield _this3._popoutCommunicationService.isPopoutOpen();
      const payload = _this3.decryptionPayload;
      if (isPopoutOpen) {
        yield _this3._popoutCommunicationService.redirectPopout("popout-decryptor", payload);
      } else {
        yield _this3._popoutCommunicationService.openPopout("popout-decryptor", payload);
      }
      chrome.runtime.onMessage.addListener(_this3._handleDecryptionResultListener);
    })();
  }
  handleDecryptionResult(data) {
    if (!data || !this.zelfKeyPasswordRecord) return;
    // Embedded popout-decryptor emits { success, data }; external paths pass inner data.
    const payload = data?.success && data?.data ? data.data : data?.data && data.password === undefined ? data.data : data;
    this.decryptedData = {
      category: this.zelfKeyPasswordRecord.publicData?.category,
      difficulty: payload.difficulty || "",
      password: payload.password || "",
      timestamp: this.zelfKeyPasswordRecord.publicData?.timestamp,
      type: "password",
      username: payload.username || this.zelfKeyPasswordRecord.publicData?.username || "",
      website: payload.website || this.zelfKeyPasswordRecord.publicData?.website || "",
      zelfName: this.zelfKeyPasswordRecord.publicData?.zelfName
    };
    this._changeDetectorRef.detectChanges();
    setTimeout(() => {
      this._scrollToSectionService.scrollToSection("password-decrypted-content", "password");
    }, 500);
  }
  onPopoutDecryptorClose() {
    this.showPopoutDecryptor = false;
  }
  onBackToList() {
    this._passwordDataService.clearCurrentPassword();
    this._router.navigate(["/zelf-keys/vault"]);
  }
  onCopyPassword() {
    if (!this.decryptedData?.password) return;
    this._copyToClipboard(this.decryptedData.password);
  }
  onTogglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this._changeDetectorRef.detectChanges();
  }
  onCopyWebsite() {
    if (!this.decryptedData?.website) return;
    this._copyToClipboard(this.decryptedData.website);
  }
  onImageError(event) {
    const img = event.target;
    img.style.display = "none";
    const container = img.parentElement;
    if (!container) return;
    container.innerHTML = `<div class="password-detail__image-error">${this._translocoService.translate("zelf_keys.common.image_not_available")}</div>`;
  }
  onDownloadZelfProof() {
    if (!this.zelfKeyPasswordRecord?.url) return;
    const link = document.createElement("a");
    link.href = this.zelfKeyPasswordRecord.url;
    link.download = `zelfproof-${this.zelfKeyPasswordRecord.publicData?.website || "password"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  getWebsiteHostname(website) {
    if (!website) return "";
    try {
      const url = new URL(website);
      return url.hostname;
    } catch (error) {
      return website;
    }
  }
  getCategory() {
    const category = this.zelfKeyPasswordRecord?.publicData?.category;
    return app_services_zelf_keys_service__WEBPACK_IMPORTED_MODULE_7__.ZelfKeysService.parseCategory(category);
  }
  getCategoryTranslationKey() {
    const category = this.getCategory();
    return category ? `zelf_keys.categories.${category}` : null;
  }
  copyZelfProof() {
    if (!this.zelfKeyPasswordRecord?.zelfProof) return;
    this._copyToClipboard(this.zelfKeyPasswordRecord.zelfProof);
  }
  copyIpfsHash() {
    if (!this.zelfKeyPasswordRecord?.id) return;
    this._copyToClipboard(this.zelfKeyPasswordRecord.id);
  }
  getZelfProofPreview(maxLength) {
    const full = this.zelfKeyPasswordRecord?.zelfProof;
    if (!full) return "";
    if (full.length <= maxLength) return full;
    return `${full.slice(0, maxLength)}…`;
  }
  getIpfsHashPreview(maxLength) {
    const full = this.zelfKeyPasswordRecord?.id;
    if (!full) return "";
    if (full.length <= maxLength) return full;
    return `${full.slice(0, maxLength)}…`;
  }
  onOpenSite() {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const website = _this4.zelfKeyPasswordRecord?.publicData?.website;
      if (!website) {
        console.warn("Cannot open site: missing website");
        return;
      }
      try {
        yield browser.tabs.create({
          url: website
        });
      } catch (error) {
        console.error("Error opening website:", error);
      }
    })();
  }
  static ɵfac = function ZelfKeysPasswordDetailComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ZelfKeysPasswordDetailComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_9__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_services_password_data_service__WEBPACK_IMPORTED_MODULE_12__.PasswordDataService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_services_popout_communication_service__WEBPACK_IMPORTED_MODULE_13__.PopoutCommunicationService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_14__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_services_scroll_to_section_service__WEBPACK_IMPORTED_MODULE_15__.ScrollToSectionService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_chrome_service__WEBPACK_IMPORTED_MODULE_16__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_17__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_jsverse_transloco__WEBPACK_IMPORTED_MODULE_3__.TranslocoService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineComponent"]({
    type: ZelfKeysPasswordDetailComponent,
    selectors: [["zelf-keys-password-detail"]],
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵInheritDefinitionFeature"]],
    decls: 7,
    vars: 4,
    consts: [["clipboardIcon", ""], ["noWebsite", ""], [1, "password-detail"], ["class", "loading-state", 4, "ngIf"], ["class", "error-state", 4, "ngIf"], ["class", "password-detail__content", 4, "ngIf"], ["mode", "embedded", 3, "close", "decryptedData", 4, "ngIf"], [1, "loading-state"], [1, "spinner"], [1, "error-state"], [1, "material-symbols-outlined", "icon"], [1, "btn-secondary", 3, "click"], [1, "password-detail__content"], [1, "password-detail__nav"], ["mat-flat-button", "", 1, "zelf-icon-button", "zelf-icon-button--secondary", "zelf-icon-button--40", 3, "click"], ["width", "22", "height", "14", "viewBox", "0 0 22 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"], [1, "password-detail__header-card"], [1, "password-detail__category-chip"], [1, "password-detail__website-title"], [1, "password-detail__subtitle"], [1, "password-detail__button-row"], [1, "zelf-button", "zelf-button--primary", "password-detail__decrypt-button", "password-detail__decrypt-button--primary", 3, "click", "disabled"], [1, "zelf-button", "zelf-button--outlined", "password-detail__decrypt-button", "password-detail__decrypt-button--secondary", 3, "click", "disabled"], [1, "password-detail__section"], [1, "password-detail__section-title"], [1, "password-detail__panel"], [1, "password-detail__row", "password-detail__row--website"], [1, "password-detail__row-label"], [1, "password-detail__row-value"], [1, "password-detail__website-container"], ["class", "password-detail__website-text", 4, "ngIf", "ngIfElse"], ["class", "password-detail__website-actions", 4, "ngIf"], [1, "password-detail__row"], ["class", "password-detail__row", 4, "ngIf"], [1, "password-detail__row-value", "password-detail__hash", 3, "click", "title"], [1, "password-detail__qr-wrapper"], [1, "password-detail__qr-code"], [3, "error", "src", "alt"], [1, "password-detail__row", "password-detail__row--download"], [1, "password-detail__download-container"], ["type", "button", 1, "password-detail__download-button", 3, "click"], [1, "password-detail__download-content"], ["width", "18", "height", "20", "viewBox", "0 0 18 20", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M14.3549 7.08398H12.4999V1.25065C12.4999 0.608984 11.9749 0.0839844 11.3333 0.0839844H6.66658C6.02492 0.0839844 5.49992 0.608984 5.49992 1.25065V7.08398H3.64492C2.60659 7.08398 2.08159 8.34398 2.81658 9.07898L8.17159 14.434C8.62659 14.889 9.36158 14.889 9.81658 14.434L15.1716 9.07898C15.9066 8.34398 15.3933 7.08398 14.3549 7.08398ZM0.833252 18.7507C0.833252 19.3923 1.35825 19.9173 1.99992 19.9173H15.9999C16.6416 19.9173 17.1666 19.3923 17.1666 18.7507C17.1666 18.109 16.6416 17.584 15.9999 17.584H1.99992C1.35825 17.584 0.833252 18.109 0.833252 18.7507Z"], ["class", "password-detail__section password-detail__section--decrypted", "id", "password-decrypted-content", 4, "ngIf"], [1, "password-detail__website-text"], [1, "password-detail__no-website"], [1, "password-detail__website-actions"], [1, "zelf-icon-button", "zelf-icon-button--40", "zelf-icon-button--secondary", "zelf-icon-button--border-soft", 3, "queryParams", "routerLink", "title"], ["xmlns", "http://www.w3.org/2000/svg", "height", "20px", "viewBox", "0 -960 960 960", "width", "20px", "fill", "#e3e3e3"], ["d", "M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"], ["class", "password-detail__category-chip", 4, "ngIf"], [1, "password-detail__row-value", "password-detail__zelf-key-string", 3, "click", "title"], ["id", "password-decrypted-content", 1, "password-detail__section", "password-detail__section--decrypted"], [1, "password-detail__section-title", "password-detail__section-title--accent"], [1, "password-detail__row-value", "password-detail__website-field"], [1, "password-detail__monospace"], [1, "zelf-icon-button", "zelf-icon-button--40", "zelf-icon-button--secondary", "zelf-icon-button--border-soft", 3, "click", "title"], [4, "ngTemplateOutlet"], [1, "password-detail__row-value", "password-detail__password-field"], [1, "password-detail__password-text"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z", "fill", "currentColor"], ["d", "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z", "fill", "currentColor"], [1, "password-detail__row-value", "password-detail__difficulty-badge"], ["mode", "embedded", 3, "close", "decryptedData"], ["width", "24", "height", "24", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M15.5 20H5.5V7C5.5 6.45 5.05 6 4.5 6C3.95 6 3.5 6.45 3.5 7V20C3.5 21.1 4.4 22 5.5 22H15.5C16.05 22 16.5 21.55 16.5 21C16.5 20.45 16.05 20 15.5 20ZM20.5 16V4C20.5 2.9 19.6 2 18.5 2H9.5C8.4 2 7.5 2.9 7.5 4V16C7.5 17.1 8.4 18 9.5 18H18.5C19.6 18 20.5 17.1 20.5 16ZM18.5 16H9.5V4H18.5V16Z"]],
    template: function ZelfKeysPasswordDetailComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](1, ZelfKeysPasswordDetailComponent_div_1_Template, 5, 3, "div", 3)(2, ZelfKeysPasswordDetailComponent_div_2_Template, 11, 7, "div", 4)(3, ZelfKeysPasswordDetailComponent_div_3_Template, 81, 63, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](4, ZelfKeysPasswordDetailComponent_popout_decryptor_4_Template, 1, 0, "popout-decryptor", 6)(5, ZelfKeysPasswordDetailComponent_ng_template_5_Template, 2, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplateRefExtractor"]);
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.error && !ctx.loading);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx.loading && !ctx.error && ctx.zelfKeyPasswordRecord && !ctx.showBiometrics);
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.showPopoutDecryptor);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgTemplateOutlet, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_3__.TranslocoModule, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterLink, _popout_decryptor_popout_decryptor_component__WEBPACK_IMPORTED_MODULE_8__.PopoutDecryptorComponent, _angular_common__WEBPACK_IMPORTED_MODULE_1__.DatePipe, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_3__.TranslocoPipe],
    styles: [".password-detail[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n}\n.password-detail__category-chip[_ngcontent-%COMP%] {\n  display: inline-block;\n  background: var(--zns-theme-button, #181818);\n  color: var(--zns-theme-button-text, #ffffff);\n  font-size: 12px;\n  font-weight: 600;\n  padding: 3px 10px;\n  border-radius: 20px;\n  text-transform: capitalize;\n}\n.password-detail__header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  margin-bottom: 32px;\n  gap: 16px;\n}\n.password-detail__header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 700;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n}\n.password-detail__title[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 700;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n}\n.password-detail[_ngcontent-%COMP%]   .loading-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 60px 20px;\n}\n.password-detail[_ngcontent-%COMP%]   .loading-state[_ngcontent-%COMP%]   .spinner[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  border: 4px solid var(--zns-theme-border, #e3e3e3);\n  border-top: 4px solid var(--zns-theme-primary, #181818);\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n  margin: 0 auto 24px;\n}\n.password-detail[_ngcontent-%COMP%]   .loading-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 16px;\n  color: var(--zns-theme-text-muted, #96939e);\n  margin: 0;\n}\n.password-detail[_ngcontent-%COMP%]   .error-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 60px 20px;\n}\n.password-detail[_ngcontent-%COMP%]   .error-state[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%] {\n  font-size: 64px;\n  width: 64px;\n  height: 64px;\n  margin-bottom: 24px;\n  color: var(--zns-theme-error, #dc362e);\n}\n.password-detail[_ngcontent-%COMP%]   .error-state[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 600;\n  color: var(--zns-theme-error, #dc362e);\n  margin: 0 0 16px 0;\n}\n.password-detail[_ngcontent-%COMP%]   .error-state[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 16px;\n  color: var(--zns-theme-text-muted, #96939e);\n  margin: 0 0 32px 0;\n  max-width: 400px;\n  margin-left: auto;\n  margin-right: auto;\n}\n.password-detail[_ngcontent-%COMP%]   .error-state[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%] {\n  background: var(--zns-theme-button-secondary, #e9ecef);\n  color: var(--zns-theme-button-secondary-text, #495057);\n  border: none;\n  padding: 12px 24px;\n  border-radius: 8px;\n  font-size: 16px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background-color 0.2s;\n}\n.password-detail[_ngcontent-%COMP%]   .error-state[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%]:hover {\n  background: var(--zns-theme-button-secondary-text, #495057);\n  color: var(--zns-theme-button-secondary, #e9ecef);\n}\n.password-detail__content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n  padding-bottom: 24px;\n}\n.password-detail__nav[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n}\n.password-detail__header-card[_ngcontent-%COMP%] {\n  background: var(--zns-theme-card, #ffffff);\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  border-radius: 16px;\n  padding: 20px 24px;\n  box-shadow: 0 2px 8px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  gap: 8px;\n}\n.password-detail__header-card[_ngcontent-%COMP%]   .password-detail__category-chip[_ngcontent-%COMP%] {\n  margin-bottom: 4px;\n}\n.password-detail__header-card[_ngcontent-%COMP%]   .password-detail__website-title[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 700;\n  line-height: 1.3;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n  max-width: 100%;\n  overflow-wrap: anywhere;\n  word-break: break-word;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n}\n.password-detail__header-card[_ngcontent-%COMP%]   .password-detail__subtitle[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--zns-theme-text-muted, #96939e);\n  margin: 0;\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.password-detail__button-row[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  width: 100%;\n}\n.password-detail__decrypt-button[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.password-detail__decrypt-button--primary[_ngcontent-%COMP%] {\n  flex: 1.15;\n}\n.password-detail__decrypt-button--secondary[_ngcontent-%COMP%] {\n  flex: 0.9;\n}\n.password-detail__website-container[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  width: 100%;\n}\n.password-detail__website-text[_ngcontent-%COMP%] {\n  font-family: monospace;\n  font-size: 12px;\n  word-break: break-all;\n  overflow-wrap: break-word;\n  hyphens: auto;\n  flex: 1;\n  min-width: 0;\n  line-height: 1.4;\n  color: var(--zns-theme-text, #181818);\n  text-align: right;\n}\n.password-detail__website-link[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  color: var(--zns-theme-primary, #181818);\n  text-decoration: none;\n  font-family: monospace;\n  font-size: 12px;\n  word-break: break-all;\n  overflow-wrap: break-word;\n  hyphens: auto;\n  flex: 1;\n  min-width: 0;\n  line-height: 1.4;\n}\n.password-detail__website-link[_ngcontent-%COMP%]:hover {\n  text-decoration: underline;\n}\n.password-detail__website-link[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  margin-top: 2px;\n}\n.password-detail__no-website[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text-muted, #96939e);\n  font-style: italic;\n  flex: 1;\n  min-width: 0;\n  text-align: right;\n}\n.password-detail__website-actions[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-shrink: 0;\n}\n.password-detail__section[_ngcontent-%COMP%] {\n  margin-bottom: 20px;\n}\n.password-detail__section[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0;\n}\n.password-detail__section--decrypted[_ngcontent-%COMP%] {\n  padding-bottom: 8px;\n}\n.password-detail__section-title[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 600;\n  letter-spacing: 0.05em;\n  text-transform: uppercase;\n  color: var(--zns-theme-text-muted, #96939e);\n  margin: 0 0 8px 4px;\n}\n.password-detail__section-title--accent[_ngcontent-%COMP%] {\n  color: var(--zns-theme-success, #1ea446);\n}\n.password-detail__panel[_ngcontent-%COMP%] {\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: 14px;\n  background: var(--zns-theme-card, #ffffff);\n  overflow: hidden;\n}\n.password-detail__row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 12px;\n  padding: 12px 16px;\n}\n.password-detail__row[_ngcontent-%COMP%]    + .password-detail__row[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--zns-theme-card-border, #eeedf1);\n}\n.password-detail__row--website[_ngcontent-%COMP%] {\n  align-items: center;\n}\n.password-detail__row--download[_ngcontent-%COMP%] {\n  justify-content: center;\n  padding-top: 16px;\n  padding-bottom: 16px;\n}\n.password-detail__row-label[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  font-size: 13px;\n  font-weight: 500;\n  color: var(--zns-theme-text-muted, #96939e);\n  line-height: 1.4;\n  padding-top: 1px;\n  min-width: 80px;\n}\n.password-detail__row-value[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  font-size: 13px;\n  color: var(--zns-theme-text, #181818);\n  font-weight: 500;\n  line-height: 1.4;\n  text-align: right;\n  word-break: break-word;\n}\n.password-detail__hash[_ngcontent-%COMP%] {\n  display: block;\n  font-family: var(--zns-theme-monospace-family, \"Courier New\", Courier, monospace);\n  font-size: 11px;\n  color: var(--zns-theme-text-muted, #96939e);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-width: 0;\n  cursor: pointer;\n  -webkit-user-select: none;\n          user-select: none;\n  text-align: right;\n}\n.password-detail__hash[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-secondary, #ff5721);\n}\n.password-detail__zelf-key-string[_ngcontent-%COMP%] {\n  display: block;\n  font-family: var(--zns-theme-monospace-family, \"Courier New\", Courier, monospace);\n  font-size: 11px;\n  color: var(--zns-theme-text, #181818);\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-width: 0;\n  cursor: pointer;\n  -webkit-user-select: none;\n          user-select: none;\n  text-align: right;\n}\n.password-detail__zelf-key-string[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-secondary, #ff5721);\n}\n.password-detail__password-field[_ngcontent-%COMP%], .password-detail__website-field[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  gap: 8px;\n  flex: 1;\n  min-width: 0;\n}\n.password-detail__monospace[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-monospace-family, \"Courier New\", Courier, monospace);\n  font-size: 14px;\n  letter-spacing: 0.5px;\n  word-break: break-all;\n}\n.password-detail__password-text[_ngcontent-%COMP%] {\n  flex: 1;\n  word-break: break-all;\n  overflow-wrap: break-word;\n}\n.password-detail__qr-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  padding: 20px 16px 8px;\n  border-bottom: 1px solid var(--zns-theme-card-border, #eeedf1);\n}\n.password-detail__qr-code[_ngcontent-%COMP%] {\n  width: 160px;\n  min-height: 120px;\n  border-radius: 10px;\n  overflow: hidden;\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  background: var(--zns-theme-background, #ffffff);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.password-detail__qr-code[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  max-height: 400px;\n  height: auto;\n  display: block;\n  object-fit: contain;\n}\n.password-detail__download-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  width: 100%;\n}\n.password-detail__download-button[_ngcontent-%COMP%] {\n  display: flex;\n  background: none;\n  border: none;\n  cursor: pointer;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--zns-theme-text, #181818);\n  transition: background-color 0.2s ease;\n  border-radius: 12px;\n  padding: 12px;\n}\n.password-detail__download-button[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc);\n}\n.password-detail__download-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 8px;\n  width: 100%;\n}\n.password-detail__download-content[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n  flex-shrink: 0;\n  fill: var(--zns-theme-text, #181818);\n}\n.password-detail__download-content[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 500;\n  text-align: center;\n  line-height: 14px;\n  color: var(--zns-theme-text, #181818);\n}\n.password-detail__image-error[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text-muted, #96939e);\n  font-size: 14px;\n  font-style: italic;\n  text-align: center;\n  padding: 20px;\n}\n.password-detail__difficulty-badge[_ngcontent-%COMP%] {\n  background: #ecf3fe;\n  color: #3998d3;\n  padding: 4px 12px;\n  border-radius: 16px;\n  font-size: 12px;\n  font-weight: 600;\n  text-transform: uppercase;\n  display: inline-block;\n}\n\n@keyframes _ngcontent-%COMP%_spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvemVsZi1rZXlzL3plbGYta2V5cy1wYXNzd29yZHMvemVsZi1rZXlzLXBhc3N3b3JkLWRldGFpbC96ZWxmLWtleXMtcGFzc3dvcmQtZGV0YWlsLmNvbXBvbmVudC5zY3NzIiwid2VicGFjazovLy4vc3JjL3N0eWxlcy9fdmFyaWFibGVzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUE7RUFDSSx1RUNtQmM7QUR0QmxCO0FBTUk7RUFDSSxxQkFBQTtFQUNBLDRDQzRCTTtFRDNCTiw0Q0M0QlU7RUQzQlYsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxtQkFBQTtFQUNBLDBCQUFBO0FBSlI7QUFNSTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtBQUpSO0FBTVE7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQ0NJQTtFREhBLFNBQUE7QUFKWjtBQVFJO0VBQ0ksZUFBQTtFQUNBLGdCQUFBO0VBQ0EscUNDSkk7RURLSixTQUFBO0FBTlI7QUFVSTtFQUNJLGtCQUFBO0VBQ0Esa0JBQUE7QUFSUjtBQVVRO0VBQ0ksV0FBQTtFQUNBLFlBQUE7RUFDQSxrREFBQTtFQUNBLHVEQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQ0FBQTtFQUNBLG1CQUFBO0FBUlo7QUFXUTtFQUNJLGVBQUE7RUFDQSwyQ0N4Qks7RUR5QkwsU0FBQTtBQVRaO0FBY0k7RUFDSSxrQkFBQTtFQUNBLGtCQUFBO0FBWlI7QUFjUTtFQUNJLGVBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLG1CQUFBO0VBQ0Esc0NDOURKO0FEa0RSO0FBZVE7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxzQ0NwRUo7RURxRUksa0JBQUE7QUFiWjtBQWdCUTtFQUNJLGVBQUE7RUFDQSwyQ0NuREs7RURvREwsa0JBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7QUFkWjtBQWlCUTtFQUNJLHNEQ2pEVztFRGtEWCxzRENqRGU7RURrRGYsWUFBQTtFQUNBLGtCQUFBO0VBQ0Esa0JBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxlQUFBO0VBQ0EsaUNBQUE7QUFmWjtBQWlCWTtFQUNJLDJEQzNEVztFRDREWCxpREM3RE87QUQ4Q3ZCO0FBb0JJO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsU0FBQTtFQUNBLG9CQUFBO0FBbEJSO0FBcUJJO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsMkJBQUE7QUFuQlI7QUFzQkk7RUFDSSwwQ0N6RUk7RUQwRUosa0RBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0EsaUVBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0EsUUFBQTtBQXBCUjtBQXNCUTtFQUNJLGtCQUFBO0FBcEJaO0FBdUJRO0VBQ0ksZUFBQTtFQUNBLGdCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQ0M5R0E7RUQrR0EsU0FBQTtFQUNBLGVBQUE7RUFDQSx1QkFBQTtFQUNBLHNCQUFBO0VBQ0Esb0JBQUE7RUFDQSxxQkFBQTtFQUNBLDRCQUFBO0VBQ0EsZ0JBQUE7QUFyQlo7QUF3QlE7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSwyQ0MzSEs7RUQ0SEwsU0FBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7QUF0Qlo7QUEwQkk7RUFDSSxhQUFBO0VBQ0EsU0FBQTtFQUNBLFdBQUE7QUF4QlI7QUEyQkk7RUFDSSxPQUFBO0FBekJSO0FBMkJRO0VBQ0ksVUFBQTtBQXpCWjtBQTRCUTtFQUNJLFNBQUE7QUExQlo7QUE4Qkk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSw4QkFBQTtFQUNBLFNBQUE7RUFDQSxXQUFBO0FBNUJSO0FBK0JJO0VBQ0ksc0JBQUE7RUFDQSxlQUFBO0VBQ0EscUJBQUE7RUFDQSx5QkFBQTtFQUNBLGFBQUE7RUFDQSxPQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0VBQ0EscUNDeEtJO0VEeUtKLGlCQUFBO0FBN0JSO0FBZ0NJO0VBQ0ksYUFBQTtFQUNBLHVCQUFBO0VBQ0EsUUFBQTtFQUNBLHdDQy9NTztFRGdOUCxxQkFBQTtFQUNBLHNCQUFBO0VBQ0EsZUFBQTtFQUNBLHFCQUFBO0VBQ0EseUJBQUE7RUFDQSxhQUFBO0VBQ0EsT0FBQTtFQUNBLFlBQUE7RUFDQSxnQkFBQTtBQTlCUjtBQWdDUTtFQUNJLDBCQUFBO0FBOUJaO0FBaUNRO0VBQ0ksY0FBQTtFQUNBLGVBQUE7QUEvQlo7QUFtQ0k7RUFDSSwyQ0NyTVM7RURzTVQsa0JBQUE7RUFDQSxPQUFBO0VBQ0EsWUFBQTtFQUNBLGlCQUFBO0FBakNSO0FBb0NJO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsUUFBQTtFQUNBLGNBQUE7QUFsQ1I7QUF1Q0k7RUFDSSxtQkFBQTtBQXJDUjtBQXVDUTtFQUNJLGdCQUFBO0FBckNaO0FBd0NRO0VBQ0ksbUJBQUE7QUF0Q1o7QUEwQ0k7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxzQkFBQTtFQUNBLHlCQUFBO0VBQ0EsMkNDdE9TO0VEdU9ULG1CQUFBO0FBeENSO0FBMENRO0VBQ0ksd0NDclFGO0FENk5WO0FBNENJO0VBQ0ksdURBQUE7RUFDQSxtQkE5UWM7RUErUWQsMENDaE9JO0VEaU9KLGdCQUFBO0FBMUNSO0FBNkNJO0VBQ0ksYUFBQTtFQUNBLHVCQUFBO0VBQ0EsOEJBQUE7RUFDQSxTQUFBO0VBQ0Esa0JBQUE7QUEzQ1I7QUE2Q1E7RUFDSSwyREFBQTtBQTNDWjtBQThDUTtFQUNJLG1CQUFBO0FBNUNaO0FBK0NRO0VBQ0ksdUJBQUE7RUFDQSxpQkFBQTtFQUNBLG9CQUFBO0FBN0NaO0FBaURJO0VBQ0ksY0FBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLDJDQy9RUztFRGdSVCxnQkFBQTtFQUNBLGdCQUFBO0VBQ0EsZUFBQTtBQS9DUjtBQWtESTtFQUNJLE9BQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQTtFQUNBLHFDQzFSSTtFRDJSSixnQkFBQTtFQUNBLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxzQkFBQTtBQWhEUjtBQW1ESTtFQUNJLGNBQUE7RUFDQSxpRkN4U2U7RUR5U2YsZUFBQTtFQUNBLDJDQ3BTUztFRHFTVCxnQkFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQTtFQUNBLHlCQUFBO1VBQUEsaUJBQUE7RUFDQSxpQkFBQTtBQWpEUjtBQW1EUTtFQUNJLDBDQzVVSztBRDJSakI7QUFxREk7RUFDSSxjQUFBO0VBQ0EsaUZDMVRlO0VEMlRmLGVBQUE7RUFDQSxxQ0N2VEk7RUR3VEosZ0JBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0VBQ0EsWUFBQTtFQUNBLGVBQUE7RUFDQSx5QkFBQTtVQUFBLGlCQUFBO0VBQ0EsaUJBQUE7QUFuRFI7QUFxRFE7RUFDSSwwQ0M5Vks7QUQyU2pCO0FBdURJO0VBRUksYUFBQTtFQUNBLG1CQUFBO0VBQ0EseUJBQUE7RUFDQSxRQUFBO0VBQ0EsT0FBQTtFQUNBLFlBQUE7QUF0RFI7QUF5REk7RUFDSSxpRkNyVmU7RURzVmYsZUFBQTtFQUNBLHFCQUFBO0VBQ0EscUJBQUE7QUF2RFI7QUEwREk7RUFDSSxPQUFBO0VBQ0EscUJBQUE7RUFDQSx5QkFBQTtBQXhEUjtBQTZESTtFQUNJLGFBQUE7RUFDQSx1QkFBQTtFQUNBLHNCQUFBO0VBQ0EsOERBQUE7QUEzRFI7QUE4REk7RUFDSSxZQUFBO0VBQ0EsaUJBQUE7RUFDQSxtQkFBQTtFQUNBLGdCQUFBO0VBQ0EsdURBQUE7RUFDQSxnREM5V1U7RUQrV1YsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7QUE1RFI7QUE4RFE7RUFDSSxXQUFBO0VBQ0EsaUJBQUE7RUFDQSxZQUFBO0VBQ0EsY0FBQTtFQUNBLG1CQUFBO0FBNURaO0FBZ0VJO0VBQ0ksYUFBQTtFQUNBLHVCQUFBO0VBQ0EsV0FBQTtBQTlEUjtBQWlFSTtFQUNJLGFBQUE7RUFDQSxnQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsdUVDM1lVO0VENFlWLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHFDQ3ZZSTtFRHdZSixzQ0FBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtBQS9EUjtBQWlFUTtFQUNJLGdFQy9ZZTtBRGdWM0I7QUFtRUk7RUFDSSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxtQkFBQTtFQUNBLFFBQUE7RUFDQSxXQUFBO0FBakVSO0FBbUVRO0VBQ0ksV0FBQTtFQUNBLFlBQUE7RUFDQSxjQUFBO0VBQ0Esb0NDNVpBO0FEMlZaO0FBb0VRO0VBQ0ksZUFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxpQkFBQTtFQUNBLHFDQ3BhQTtBRGtXWjtBQXNFSTtFQUNJLDJDQ3hhUztFRHlhVCxlQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQkFBQTtFQUNBLGFBQUE7QUFwRVI7QUF1RUk7RUFDSSxtQkM3Ykk7RUQ4YkosY0NoY0Q7RURpY0MsaUJBQUE7RUFDQSxtQkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHlCQUFBO0VBQ0EscUJBQUE7QUFyRVI7O0FBeUVBO0VBQ0k7SUFDSSx1QkFBQTtFQXRFTjtFQXdFRTtJQUNJLHlCQUFBO0VBdEVOO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwiLi4vLi4vLi4vLi4vc3R5bGVzL3ZhcmlhYmxlc1wiO1xuXG4kZGV0YWlsLXBhbmVsLXJhZGl1czogMTRweDtcblxuLnBhc3N3b3JkLWRldGFpbCB7XG4gICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuXG4gICAgLy8gQ2F0ZWdvcnkgY2hpcCDDosKAwpQgbWF0Y2ggcGFzc3dvcmQtcmVzdWx0IHBpbGxcbiAgICAmX19jYXRlZ29yeS1jaGlwIHtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQ7XG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgcGFkZGluZzogM3B4IDEwcHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7XG4gICAgICAgIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xuICAgIH1cbiAgICAmX19oZWFkZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAzMnB4O1xuICAgICAgICBnYXA6IDE2cHg7XG5cbiAgICAgICAgaDIge1xuICAgICAgICAgICAgZm9udC1zaXplOiAyNHB4O1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3RpdGxlIHtcbiAgICAgICAgZm9udC1zaXplOiAyNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICB9XG5cbiAgICAvLyBMb2FkaW5nIFN0YXRlXG4gICAgLmxvYWRpbmctc3RhdGUge1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIHBhZGRpbmc6IDYwcHggMjBweDtcblxuICAgICAgICAuc3Bpbm5lciB7XG4gICAgICAgICAgICB3aWR0aDogNDBweDtcbiAgICAgICAgICAgIGhlaWdodDogNDBweDtcbiAgICAgICAgICAgIGJvcmRlcjogNHB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG4gICAgICAgICAgICBib3JkZXItdG9wOiA0cHggc29saWQgdmFyaWFibGVzLiRwcmltYXJ5Q29sb3I7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICAgICAgICBhbmltYXRpb246IHNwaW4gMXMgbGluZWFyIGluZmluaXRlO1xuICAgICAgICAgICAgbWFyZ2luOiAwIGF1dG8gMjRweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHAge1xuICAgICAgICAgICAgZm9udC1zaXplOiAxNnB4O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFcnJvciBTdGF0ZVxuICAgIC5lcnJvci1zdGF0ZSB7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgcGFkZGluZzogNjBweCAyMHB4O1xuXG4gICAgICAgIC5pY29uIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogNjRweDtcbiAgICAgICAgICAgIHdpZHRoOiA2NHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiA2NHB4O1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjRweDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGVycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgaDMge1xuICAgICAgICAgICAgZm9udC1zaXplOiAyNHB4O1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGVycm9yO1xuICAgICAgICAgICAgbWFyZ2luOiAwIDAgMTZweCAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcCB7XG4gICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgICAgIG1hcmdpbjogMCAwIDMycHggMDtcbiAgICAgICAgICAgIG1heC13aWR0aDogNDAwcHg7XG4gICAgICAgICAgICBtYXJnaW4tbGVmdDogYXV0bztcbiAgICAgICAgICAgIG1hcmdpbi1yaWdodDogYXV0bztcbiAgICAgICAgfVxuXG4gICAgICAgIC5idG4tc2Vjb25kYXJ5IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnk7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeVRleHQ7XG4gICAgICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgICAgICBwYWRkaW5nOiAxMnB4IDI0cHg7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzO1xuXG4gICAgICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDtcbiAgICAgICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2NvbnRlbnQge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBnYXA6IDI0cHg7XG4gICAgICAgIHBhZGRpbmctYm90dG9tOiAyNHB4O1xuICAgIH1cblxuICAgICZfX25hdiB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICB9XG5cbiAgICAmX19oZWFkZXItY2FyZCB7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgICAgICBwYWRkaW5nOiAyMHB4IDI0cHg7XG4gICAgICAgIGJveC1zaGFkb3c6IDAgMnB4IDhweCB2YXJpYWJsZXMuJHRoZW1lU2hhZG93O1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIGdhcDogOHB4O1xuXG4gICAgICAgIC5wYXNzd29yZC1kZXRhaWxfX2NhdGVnb3J5LWNoaXAge1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogNHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLnBhc3N3b3JkLWRldGFpbF9fd2Vic2l0ZS10aXRsZSB7XG4gICAgICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDEuMztcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICAgIG1heC13aWR0aDogMTAwJTtcbiAgICAgICAgICAgIG92ZXJmbG93LXdyYXA6IGFueXdoZXJlO1xuICAgICAgICAgICAgd29yZC1icmVhazogYnJlYWstd29yZDtcbiAgICAgICAgICAgIGRpc3BsYXk6IC13ZWJraXQtYm94O1xuICAgICAgICAgICAgLXdlYmtpdC1saW5lLWNsYW1wOiAyO1xuICAgICAgICAgICAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbDtcbiAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIH1cblxuICAgICAgICAucGFzc3dvcmQtZGV0YWlsX19zdWJ0aXRsZSB7XG4gICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgICAgICBtYXgtd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fYnV0dG9uLXJvdyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGdhcDogMTJweDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgJl9fZGVjcnlwdC1idXR0b24ge1xuICAgICAgICBmbGV4OiAxO1xuXG4gICAgICAgICYtLXByaW1hcnkge1xuICAgICAgICAgICAgZmxleDogMS4xNTtcbiAgICAgICAgfVxuXG4gICAgICAgICYtLXNlY29uZGFyeSB7XG4gICAgICAgICAgICBmbGV4OiAwLjk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX193ZWJzaXRlLWNvbnRhaW5lciB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgZ2FwOiAxNnB4O1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX193ZWJzaXRlLXRleHQge1xuICAgICAgICBmb250LWZhbWlseTogbW9ub3NwYWNlO1xuICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgIHdvcmQtYnJlYWs6IGJyZWFrLWFsbDtcbiAgICAgICAgb3ZlcmZsb3ctd3JhcDogYnJlYWstd29yZDtcbiAgICAgICAgaHlwaGVuczogYXV0bztcbiAgICAgICAgZmxleDogMTtcbiAgICAgICAgbWluLXdpZHRoOiAwO1xuICAgICAgICBsaW5lLWhlaWdodDogMS40O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICAgIH1cblxuICAgICZfX3dlYnNpdGUtbGluayB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kcHJpbWFyeUNvbG9yO1xuICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgICAgIGZvbnQtZmFtaWx5OiBtb25vc3BhY2U7XG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgd29yZC1icmVhazogYnJlYWstYWxsO1xuICAgICAgICBvdmVyZmxvdy13cmFwOiBicmVhay13b3JkO1xuICAgICAgICBoeXBoZW5zOiBhdXRvO1xuICAgICAgICBmbGV4OiAxO1xuICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjQ7XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmbGV4LXNocmluazogMDtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDJweDsgLy8gQWxpZ24gd2l0aCBmaXJzdCBsaW5lIG9mIHRleHRcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX25vLXdlYnNpdGUge1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgZm9udC1zdHlsZTogaXRhbGljO1xuICAgICAgICBmbGV4OiAxO1xuICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICAgIH1cblxuICAgICZfX3dlYnNpdGUtYWN0aW9ucyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogOHB4O1xuICAgICAgICBmbGV4LXNocmluazogMDtcbiAgICB9XG5cbiAgICAvLyDDosKUwoDDosKUwoDDosKUwoAgU2VjdGlvbiArIHBhbmVsIChhbGlnbmVkIHdpdGggcGFzc3dvcmQtcmVzdWx0KSDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoDDosKUwoBcblxuICAgICZfX3NlY3Rpb24ge1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xuXG4gICAgICAgICY6bGFzdC1jaGlsZCB7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgJi0tZGVjcnlwdGVkIHtcbiAgICAgICAgICAgIHBhZGRpbmctYm90dG9tOiA4cHg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19zZWN0aW9uLXRpdGxlIHtcbiAgICAgICAgZm9udC1zaXplOiAxM3B4O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4wNWVtO1xuICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgbWFyZ2luOiAwIDAgOHB4IDRweDtcblxuICAgICAgICAmLS1hY2NlbnQge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3BhbmVsIHtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6ICRkZXRhaWwtcGFuZWwtcmFkaXVzO1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICB9XG5cbiAgICAmX19yb3cge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICBnYXA6IDEycHg7XG4gICAgICAgIHBhZGRpbmc6IDEycHggMTZweDtcblxuICAgICAgICAmICsgJiB7XG4gICAgICAgICAgICBib3JkZXItdG9wOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIH1cblxuICAgICAgICAmLS13ZWJzaXRlIHtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIH1cblxuICAgICAgICAmLS1kb3dubG9hZCB7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgICAgIHBhZGRpbmctdG9wOiAxNnB4O1xuICAgICAgICAgICAgcGFkZGluZy1ib3R0b206IDE2cHg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19yb3ctbGFiZWwge1xuICAgICAgICBmbGV4LXNocmluazogMDtcbiAgICAgICAgZm9udC1zaXplOiAxM3B4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDEuNDtcbiAgICAgICAgcGFkZGluZy10b3A6IDFweDtcbiAgICAgICAgbWluLXdpZHRoOiA4MHB4O1xuICAgIH1cblxuICAgICZfX3Jvdy12YWx1ZSB7XG4gICAgICAgIGZsZXg6IDE7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgZm9udC1zaXplOiAxM3B4O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjQ7XG4gICAgICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuICAgICAgICB3b3JkLWJyZWFrOiBicmVhay13b3JkO1xuICAgIH1cblxuICAgICZfX2hhc2gge1xuICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVNb25vc3BhY2VGYW1pbHk7XG4gICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAgIHRleHQtYWxpZ246IHJpZ2h0O1xuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX196ZWxmLWtleS1zdHJpbmcge1xuICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVNb25vc3BhY2VGYW1pbHk7XG4gICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgbWluLXdpZHRoOiAwO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICB0ZXh0LWFsaWduOiByaWdodDtcblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHNlY29uZGFyeUNvbG9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fcGFzc3dvcmQtZmllbGQsXG4gICAgJl9fd2Vic2l0ZS1maWVsZCB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgICAgIGdhcDogOHB4O1xuICAgICAgICBmbGV4OiAxO1xuICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgfVxuXG4gICAgJl9fbW9ub3NwYWNlIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVNb25vc3BhY2VGYW1pbHk7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgICAgICB3b3JkLWJyZWFrOiBicmVhay1hbGw7XG4gICAgfVxuXG4gICAgJl9fcGFzc3dvcmQtdGV4dCB7XG4gICAgICAgIGZsZXg6IDE7XG4gICAgICAgIHdvcmQtYnJlYWs6IGJyZWFrLWFsbDtcbiAgICAgICAgb3ZlcmZsb3ctd3JhcDogYnJlYWstd29yZDtcbiAgICB9XG5cbiAgICAvLyDDosKUwoDDosKUwoDDosKUwoAgUVIgKG1hdGNoIHBhc3N3b3JkLXJlc3VsdCBfX3FyLXdyYXBwZXIgLyBfX3FyLWNvZGUpIMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgMOiwpTCgFxuXG4gICAgJl9fcXItd3JhcHBlciB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBwYWRkaW5nOiAyMHB4IDE2cHggOHB4O1xuICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgfVxuXG4gICAgJl9fcXItY29kZSB7XG4gICAgICAgIHdpZHRoOiAxNjBweDtcbiAgICAgICAgbWluLWhlaWdodDogMTIwcHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbiAgICAgICAgaW1nIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgbWF4LWhlaWdodDogNDAwcHg7XG4gICAgICAgICAgICBoZWlnaHQ6IGF1dG87XG4gICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgICAgIG9iamVjdC1maXQ6IGNvbnRhaW47XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19kb3dubG9hZC1jb250YWluZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgJl9fZG93bmxvYWQtYnV0dG9uIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYmFja2dyb3VuZDogbm9uZTtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICAgICAgICBwYWRkaW5nOiAxMnB4O1xuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19kb3dubG9hZC1jb250ZW50IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICB3aWR0aDogMjRweDtcbiAgICAgICAgICAgIGhlaWdodDogMjRweDtcbiAgICAgICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBzcGFuIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTRweDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2ltYWdlLWVycm9yIHtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgZm9udC1zdHlsZTogaXRhbGljO1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIHBhZGRpbmc6IDIwcHg7XG4gICAgfVxuXG4gICAgJl9fZGlmZmljdWx0eS1iYWRnZSB7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kaW5mb0xpZ2h0O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRpbmZvO1xuICAgICAgICBwYWRkaW5nOiA0cHggMTJweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgfVxufVxuXG5Aa2V5ZnJhbWVzIHNwaW4ge1xuICAgIDAlIHtcbiAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMGRlZyk7XG4gICAgfVxuICAgIDEwMCUge1xuICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICAgIH1cbn1cbiIsIiRwcmltYXJ5Q29sb3I6IHZhcigtLXpucy10aGVtZS1wcmltYXJ5LCAjMTgxODE4KTtcbiRwcmltYXJ5TGlnaHQ6ICNkYWRkZmE7XG4kc2Vjb25kYXJ5Q29sb3I6IHZhcigtLXpucy10aGVtZS1zZWNvbmRhcnksICNmZjU3MjEpO1xuJHNlY29uZGFyeUNvbG9yTGlnaHQ6ICNmNmU1ZTA7XG5cbiRjb3JyZWN0OiB2YXIoLS16bnMtdGhlbWUtc3VjY2VzcywgIzFlYTQ0Nik7XG4kY29ycmVjdERhcms6ICMwZjUyMjM7XG4kY29ycmVjdExpZ2h0OiB2YXIoLS16bnMtdGhlbWUtc3VjY2Vzcy10ZXh0LCAjZTdmOGVkKTtcblxuJGVycm9yOiB2YXIoLS16bnMtdGhlbWUtZXJyb3IsICNkYzM2MmUpO1xuJGVycm9yRGFyazogIzYwMTQxMDtcbiRlcnJvckxpZ2h0OiB2YXIoLS16bnMtdGhlbWUtZXJyb3ItdGV4dCwgI2ZjZWVlZSk7XG5cbiR3YXJuaW5nOiB2YXIoLS16bnMtdGhlbWUtd2FybmluZywgI2RlNjgwMCk7XG4kd2FybmluZ0Rhcms6ICM0YTIxMGE7XG4kd2FybmluZ0xpZ2h0OiB2YXIoLS16bnMtdGhlbWUtd2FybmluZy10ZXh0LCAjZmZlZWU5KTtcblxuJGluZm86ICMzOTk4ZDM7XG4kaW5mb0Rhcms6ICMwMDRhNzc7XG4kaW5mb0xpZ2h0OiAjZWNmM2ZlO1xuXG4kYmxhY2s6ICMxODE4MTg7XG4kd2hpdGU6ICNmZmZmZmY7XG5cbiR0aGVtZUJvZHlGYW1pbHk6IHZhcigtLXpucy10aGVtZS1ib2R5LWZhbWlseSwgXCJQb3BwaW5zXCIsIEFyaWFsLCBzYW5zLXNlcmlmKTtcbiR0aGVtZVRpdGxlRmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtdGl0bGUtZmFtaWx5LCBcIk1lbmRhXCIsIFwiQXJpYWwgQmxhY2tcIiwgc2Fucy1zZXJpZik7XG4kdGhlbWVNb25vc3BhY2VGYW1pbHk6IHZhcigtLXpucy10aGVtZS1tb25vc3BhY2UtZmFtaWx5LCBcIkNvdXJpZXIgTmV3XCIsIENvdXJpZXIsIG1vbm9zcGFjZSk7XG5cbiR0aGVtZUJhY2tncm91bmQ6IHZhcigtLXpucy10aGVtZS1iYWNrZ3JvdW5kLCAjZmZmZmZmKTtcbiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS1iYWNrZ3JvdW5kLXNlY29uZGFyeSwgI2Y5ZjlmYyk7XG5cbiR0aGVtZVRleHQ6IHZhcigtLXpucy10aGVtZS10ZXh0LCAjMTgxODE4KTtcbiR0aGVtZVRleHRNdXRlZDogdmFyKC0tem5zLXRoZW1lLXRleHQtbXV0ZWQsICM5NjkzOWUpO1xuJHRoZW1lVGV4dFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLXRleHQtc2Vjb25kYXJ5LCAjNzM3NzdmKTtcblxuJHRoZW1lSGVhZGVyOiB2YXIoLS16bnMtdGhlbWUtaGVhZGVyLCAjMTgxODE4KTtcbiR0aGVtZUhlYWRlclRleHQ6IHZhcigtLXpucy10aGVtZS1oZWFkZXItdGV4dCwgI2ZmZmZmZik7XG5cbiR0aGVtZUJ1dHRvbjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbiwgIzE4MTgxOCk7XG4kdGhlbWVCdXR0b25UZXh0OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXRleHQsICNmZmZmZmYpO1xuJHRoZW1lQnV0dG9uSG92ZXI6IHZhcigtLXpucy10aGVtZS1idXR0b24taG92ZXIsICNmZjU3MjEpO1xuXG4kdGhlbWVCdXR0b25TZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LCAjZTllY2VmKTtcbiR0aGVtZUJ1dHRvblNlY29uZGFyeVRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LXRleHQsICM0OTUwNTcpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5SG92ZXI6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LWhvdmVyLCAjZTllY2VmKTtcblxuJHRoZW1lQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtYm9yZGVyLCAjZTNlM2UzKTtcbiR0aGVtZUJvcmRlckhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYm9yZGVyLWhvdmVyLCAjYzNjNmNmKTtcblxuJHRoZW1lQ2FyZDogdmFyKC0tem5zLXRoZW1lLWNhcmQsICNmZmZmZmYpO1xuJHRoZW1lQ2FyZEJvcmRlcjogdmFyKC0tem5zLXRoZW1lLWNhcmQtYm9yZGVyLCAjZWVlZGYxKTtcblxuJHRoZW1lU2hhZG93OiB2YXIoLS16bnMtdGhlbWUtc2hhZG93LCByZ2JhKDAsIDAsIDAsIDAuMSkpO1xuXG4kc21vb3RoQmV6aWVyOiBjdWJpYy1iZXppZXIoMC4yNSwgMC40LCAwLjcsIDEpO1xuXG4kbWF4RXh0cmFTbWFsbDogNTk1cHg7XG4kbWluU21hbGw6IDYwMHB4O1xuJG1lZGl1bTogNzY4cHg7XG4kbGFyZ2U6IDg4OXB4O1xuJGNvbXB1dGVyczogMTIwMHB4O1xuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
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

/***/ }

}]);
//# sourceMappingURL=src_app_zelf-keys_zelf-keys-passwords_zelf-keys-password-detail_zelf-keys-password-detail_com-da01e8.js.map