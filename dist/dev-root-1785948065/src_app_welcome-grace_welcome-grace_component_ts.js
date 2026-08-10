"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_welcome-grace_welcome-grace_component_ts"],{

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

/***/ 29569
/*!************************************!*\
  !*** ./src/app/captcha.service.ts ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CaptchaService: () => (/* binding */ CaptchaService)
/* harmony export */ });
/* harmony import */ var environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _chrome_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./chrome.service */ 85043);



class CaptchaService {
  _chromeService;
  captchaToken = "";
  constructor(_chromeService) {
    this._chromeService = _chromeService;
  }
  executeRecaptcha(action) {
    if (this._chromeService.isExtension) return Promise.resolve("");
    return new Promise((resolve, reject) => {
      if (typeof grecaptcha !== "undefined") {
        grecaptcha.enterprise.ready(() => {
          grecaptcha.enterprise.execute(environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment?.captchaKey, {
            action
          }).then(token => resolve(token)).catch(err => reject(err));
        });
      } else {
        reject("reCAPTCHA not loaded");
      }
    });
  }
  retainCaptchaToken(token) {
    this.captchaToken = token;
  }
  getCaptchaToken() {
    return this.captchaToken;
  }
  static ɵfac = function CaptchaService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CaptchaService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_chrome_service__WEBPACK_IMPORTED_MODULE_2__.ChromeService));
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: CaptchaService,
    factory: CaptchaService.ɵfac,
    providedIn: "root"
  });
}

/***/ },

/***/ 24912
/*!**********************************************************!*\
  !*** ./src/app/welcome-grace/welcome-grace.component.ts ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WelcomeGraceComponent: () => (/* binding */ WelcomeGraceComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 34487);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var app_base_copy_to_clipboard_copy_to_clipboard_base__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/base/copy-to-clipboard/copy-to-clipboard.base */ 88070);
/* harmony import */ var app_tags_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/tags.service */ 73768);
/* harmony import */ var environments_environment__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var app_captcha_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! app/captcha.service */ 29569);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var app_zelf_name_service_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! app/zelf-name-service.service */ 56148);
/* harmony import */ var app_chrome_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! app/chrome.service */ 85043);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/snack-bar */ 3347);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/button */ 69885);

















const _c0 = () => ["../find"];
const _c1 = (a0, a1) => ({
  address: a0,
  label: "Bitcoin",
  logo: "assets/networks/btc.png",
  value: a1
});
const _c2 = a0 => ({
  $implicit: a0
});
const _c3 = (a0, a1) => ({
  address: a0,
  label: "Ethereum",
  logo: "assets/networks/eth.png",
  value: a1
});
const _c4 = (a0, a1) => ({
  address: a0,
  label: "Solana",
  logo: "assets/networks/sol.svg",
  value: a1
});
const _c5 = a0 => ({
  date: a0
});
function WelcomeGraceComponent_div_0_ng_container_7_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r1("common.registered"));
  }
}
function WelcomeGraceComponent_div_0_ng_container_7_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r1("common.domain_expired"));
  }
}
function WelcomeGraceComponent_div_0_ng_container_7_span_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", t_r1("welcome.registered_since", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction1"](4, _c5, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind2"](2, 1, ctx_r1.tagNameObject.publicData.registeredAt, "dd MMM, yyyy"))), " ");
  }
}
function WelcomeGraceComponent_div_0_ng_container_7_span_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", t_r1("welcome.domain_expired_since", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction1"](4, _c5, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind2"](2, 1, ctx_r1.tagNameObject.publicData.gracePeriod, "dd MMM, yyyy"))), " ");
  }
}
function WelcomeGraceComponent_div_0_ng_container_7_ng_container_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainer"](0);
  }
}
function WelcomeGraceComponent_div_0_ng_container_7_ng_container_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainer"](0);
  }
}
function WelcomeGraceComponent_div_0_ng_container_7_ng_container_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainer"](0);
  }
}
function WelcomeGraceComponent_div_0_ng_container_7_div_14_p_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "p", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind2"](2, 1, ctx_r1.tagNameObject.publicData.gracePeriod, "dd MMM, yyyy"), " ");
  }
}
function WelcomeGraceComponent_div_0_ng_container_7_div_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 18)(1, "div", 19)(2, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "div", 21)(5, "p", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](7, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](8, "svg", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](9, "path", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](10, "div", 19)(11, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](13, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](14, WelcomeGraceComponent_div_0_ng_container_7_div_14_p_14_Template, 3, 4, "p", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](15, "svg", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](16, "path", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", t_r1("welcome.name_expires"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind2"](7, 4, ctx_r1.tagNameObject.publicData.expiresAt, "dd MMM, yyyy"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", t_r1("welcome.grace_period_until"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.tagNameObject.publicData.gracePeriod);
  }
}
function WelcomeGraceComponent_div_0_ng_container_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "div", 11)(2, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](3, WelcomeGraceComponent_div_0_ng_container_7_ng_container_3_Template, 2, 1, "ng-container", 9)(4, WelcomeGraceComponent_div_0_ng_container_7_ng_container_4_Template, 2, 1, "ng-container", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "h2", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](7, "p", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](8, WelcomeGraceComponent_div_0_ng_container_7_span_8_Template, 3, 6, "span", 9)(9, WelcomeGraceComponent_div_0_ng_container_7_span_9_Template, 3, 6, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](10, "div", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](11, WelcomeGraceComponent_div_0_ng_container_7_ng_container_11_Template, 1, 0, "ng-container", 16)(12, WelcomeGraceComponent_div_0_ng_container_7_ng_container_12_Template, 1, 0, "ng-container", 16)(13, WelcomeGraceComponent_div_0_ng_container_7_ng_container_13_Template, 1, 0, "ng-container", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](14, WelcomeGraceComponent_div_0_ng_container_7_div_14_Template, 17, 7, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    const addressRow_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreference"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.tagNameObject.publicData.isInGracePeriod);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r1.tagNameObject.publicData.isInGracePeriod);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx_r1.tagNameObject.fullTagName);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.tagNameObject.publicData.isInGracePeriod);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r1.tagNameObject.publicData.isInGracePeriod);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngTemplateOutlet", addressRow_r3)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction1"](15, _c2, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction2"](12, _c1, ctx_r1.tagNameObject == null ? null : ctx_r1.tagNameObject.publicData == null ? null : ctx_r1.tagNameObject.publicData.btcAddress, ctx_r1.tagNameObject == null ? null : ctx_r1.tagNameObject.displayBtcAddress)));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngTemplateOutlet", addressRow_r3)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction1"](20, _c2, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction2"](17, _c3, ctx_r1.tagNameObject == null ? null : ctx_r1.tagNameObject.publicData == null ? null : ctx_r1.tagNameObject.publicData.ethAddress, ctx_r1.tagNameObject == null ? null : ctx_r1.tagNameObject.displayEthAddress)));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngTemplateOutlet", addressRow_r3)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction1"](25, _c2, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction2"](22, _c4, ctx_r1.tagNameObject == null ? null : ctx_r1.tagNameObject.publicData == null ? null : ctx_r1.tagNameObject.publicData.solanaAddress, ctx_r1.tagNameObject == null ? null : ctx_r1.tagNameObject.displaySolanaAddress)));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.tagNameObject.publicData.expiresAt);
  }
}
function WelcomeGraceComponent_div_0_ng_container_9_p_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "p", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r1("welcome.renew_your_domain_today"));
  }
}
function WelcomeGraceComponent_div_0_ng_container_9_p_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "p", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r1("welcome.dont_lose_your_zelfname"));
  }
}
function WelcomeGraceComponent_div_0_ng_container_9_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function WelcomeGraceComponent_div_0_ng_container_9_button_6_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.renewZelfName());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", t_r1("common.renew_subscription"), " ");
  }
}
function WelcomeGraceComponent_div_0_ng_container_9_button_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function WelcomeGraceComponent_div_0_ng_container_9_button_7_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.decryptZelfName());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", t_r1("welcome.decrypt_now_renew_later"), " ");
  }
}
function WelcomeGraceComponent_div_0_ng_container_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](2, "svg", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](3, "path", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](4, WelcomeGraceComponent_div_0_ng_container_9_p_4_Template, 2, 1, "p", 30)(5, WelcomeGraceComponent_div_0_ng_container_9_p_5_Template, 2, 1, "p", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](6, WelcomeGraceComponent_div_0_ng_container_9_button_6_Template, 2, 1, "button", 31)(7, WelcomeGraceComponent_div_0_ng_container_9_button_7_Template, 2, 1, "button", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.tagNameObject.publicData.isInGracePeriod);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r1.tagNameObject.publicData.isInGracePeriod);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !ctx_r1.tagNameObject.available);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.tagNameObject.publicData.isInGracePeriod && ctx_r1.tagNameObject.publicData.isExpired);
  }
}
function WelcomeGraceComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 2)(1, "div", 3)(2, "div", 4)(3, "button", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "svg", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](5, "path", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](7, WelcomeGraceComponent_div_0_ng_container_7_Template, 15, 27, "ng-container", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](8, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](9, WelcomeGraceComponent_div_0_ng_container_9_Template, 8, 4, "ng-container", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](3, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.tagNameObject);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx_r1.tagNameObject);
  }
}
function WelcomeGraceComponent_ng_template_1_ng_container_0_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function WelcomeGraceComponent_ng_template_1_ng_container_0_div_1_Template_div_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r6);
      const address_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r1.copyToClipboard(address_r7.address));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](2, "img", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](7, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    const address_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("src", address_r7.logo, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](address_r7.label);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](address_r7.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](t_r8("common.copy"));
  }
}
function WelcomeGraceComponent_ng_template_1_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](1, WelcomeGraceComponent_ng_template_1_ng_container_0_div_1_Template, 9, 4, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const address_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", address_r7.value);
  }
}
function WelcomeGraceComponent_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](0, WelcomeGraceComponent_ng_template_1_ng_container_0_Template, 2, 1, "ng-container", 36);
  }
}
class WelcomeGraceComponent extends app_base_copy_to_clipboard_copy_to_clipboard_base__WEBPACK_IMPORTED_MODULE_5__.CopyToClipboardBase {
  _captchaService;
  _router;
  _zelfNameService;
  _chromeService;
  _translocoService;
  _snackBar;
  _tagsService;
  loading = false;
  captchaToken;
  tagNameObject;
  zelfProof;
  tagName;
  domain;
  constructor(_captchaService, _router, _zelfNameService, _chromeService, _translocoService, _snackBar, _tagsService) {
    super(_chromeService, _snackBar, _translocoService);
    this._captchaService = _captchaService;
    this._router = _router;
    this._zelfNameService = _zelfNameService;
    this._chromeService = _chromeService;
    this._translocoService = _translocoService;
    this._snackBar = _snackBar;
    this._tagsService = _tagsService;
  }
  ngOnInit() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this.tagName = yield _this._tagsService.getTagName();
      const tagResponse = yield _this._tagsService.getTagResponse();
      if (tagResponse?.tagObject) {
        _this.tagNameObject = new app_tags_service__WEBPACK_IMPORTED_MODULE_6__.TagModel(tagResponse?.tagObject);
      } else {
        _this.tagNameObject = new app_tags_service__WEBPACK_IMPORTED_MODULE_6__.TagModel();
      }
      _this.zelfProof = yield _this._zelfNameService.getZelfProof();
      _this.domain = yield _this._tagsService.getDomain();
      yield _this._queryZNS(_this.tagName);
    })();
  }
  get externalUrl() {
    const name = this.tagNameObject?.tagName || "";
    const domain = this.tagNameObject?.domain || "zelf";
    const duration = 1;
    return `${environments_environment__WEBPACK_IMPORTED_MODULE_7__.environment.paymentDomainUrl}?tagname=${name}&domain=${domain}&duration=${duration}`;
  }
  _queryZNS(zelfName) {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const response = yield _this2._tagsService.searchTag({
          tagName: zelfName,
          domain: _this2.domain,
          captchaToken: _this2.captchaToken
        });
        if (!response.data) {
          _this2._router.navigate(["/welcome/available"]);
          return;
        }
        // If tag is available, it means it doesn't exist in IPFS/Arweave anymore
        // Redirect to welcome/find so user can recover it using their zelfProof
        if (response.data?.available) {
          // Ensure zelfProof is set in the service for recovery
          if (_this2.zelfProof) {
            yield _this2._tagsService.setZelfProof(_this2.zelfProof);
          }
          // Redirect to find page to recover the tag
          _this2._router.navigate(["/welcome/find"]);
          return;
        }
        const tagNameObject = new app_tags_service__WEBPACK_IMPORTED_MODULE_6__.TagModel(response.data.tagObject);
        // Update the component's tagNameObject with fresh data
        if (response.data.tagObject) {
          _this2.tagNameObject = tagNameObject;
        }
        const isOwnedByUser = tagNameObject.zelfProof === _this2.tagNameObject.zelfProof;
        if (!isOwnedByUser && tagNameObject.publicData?.expiresAt && new Date(tagNameObject.publicData.expiresAt) < new Date()) {
          _this2._router.navigate(["/welcome/recover"]);
          return;
        }
        _this2.loading = false;
      } catch (error) {
        console.error({
          error
        });
        _this2.loading = false;
      }
    })();
  }
  copyToClipboard(address) {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this3._copyToClipboard(address);
    })();
  }
  decryptZelfName() {
    this._tagsService.setFlow("unlock");
    this._router.navigate(["/security/password"], {
      queryParams: {
        return: "/welcome/grace"
      }
    });
  }
  renewZelfName() {
    const name = this.tagNameObject?.tagName || "";
    const domain = this.tagNameObject?.domain || "zelf";
    const duration = 1;
    this._router.navigate(["/external-link"], {
      queryParams: {
        externalUrl: `${environments_environment__WEBPACK_IMPORTED_MODULE_7__.environment.paymentDomainUrl}?tagname=${name}&domain=${domain}&duration=${duration}`
      }
    });
  }
  static ɵfac = function WelcomeGraceComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || WelcomeGraceComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](app_captcha_service__WEBPACK_IMPORTED_MODULE_10__.CaptchaService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_11__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](app_zelf_name_service_service__WEBPACK_IMPORTED_MODULE_12__.ZelfNameService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](app_chrome_service__WEBPACK_IMPORTED_MODULE_13__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__.TranslocoService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_14__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](app_tags_service__WEBPACK_IMPORTED_MODULE_6__.TagsService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({
    type: WelcomeGraceComponent,
    selectors: [["welcome-grace"]],
    features: [_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵInheritDefinitionFeature"]],
    decls: 3,
    vars: 0,
    consts: [["addressRow", ""], ["class", "zelf-card welcome-grace", 4, "transloco"], [1, "zelf-card", "welcome-grace"], [1, "zelf-card__header"], [1, "welcome-grace__header-button"], ["mat-icon-button", "", 1, "zelf-icon-button", "zelf-icon-button--40", 3, "routerLink"], ["viewBox", "0 0 22 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"], [1, "zelf-card__content", "welcome-grace__content"], [4, "ngIf"], [1, "zelf-card__actions", "zelf-card__actions--column"], [1, "welcome-grace__details"], [1, "zelf-chip", "welcome-grace__chip", "zelf-chip--error"], [1, "zelf-card__title"], [1, "zelf-card__subtitle", "welcome-grace__subtitle"], [1, "welcome-grace__addresses"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], ["class", "welcome-grace__date-row", 4, "ngIf"], [1, "welcome-grace__date-row"], [1, "welcome-grace__date-column"], [1, "welcome-grace__date-title"], [1, "welcome-grace__date-text__inner-row"], [1, "welcome-grace__date-text"], ["width", "14", "height", "14", "viewBox", "0 0 15 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M7.4935 0.333984C3.8135 0.333984 0.833496 3.32065 0.833496 7.00065C0.833496 10.6807 3.8135 13.6673 7.4935 13.6673C11.1802 13.6673 14.1668 10.6807 14.1668 7.00065C14.1668 3.32065 11.1802 0.333984 7.4935 0.333984ZM10.1668 9.66732C9.90683 9.92732 9.48683 9.92732 9.22683 9.66732L7.0335 7.47398C6.90683 7.34732 6.8335 7.18065 6.8335 7.00065V4.33398C6.8335 3.96732 7.1335 3.66732 7.50016 3.66732C7.86683 3.66732 8.16683 3.96732 8.16683 4.33398V6.72732L10.1668 8.72732C10.4268 8.98732 10.4268 9.40732 10.1668 9.66732Z", "fill", "#0E26FF"], ["class", "welcome-grace__date-text", 4, "ngIf"], ["d", "M7.50016 0.333984C3.82016 0.333984 0.833496 3.32065 0.833496 7.00065C0.833496 10.6807 3.82016 13.6673 7.50016 13.6673C11.1802 13.6673 14.1668 10.6807 14.1668 7.00065C14.1668 3.32065 11.1802 0.333984 7.50016 0.333984ZM7.50016 10.334C7.1335 10.334 6.8335 10.034 6.8335 9.66732V7.00065C6.8335 6.63398 7.1335 6.33398 7.50016 6.33398C7.86683 6.33398 8.16683 6.63398 8.16683 7.00065V9.66732C8.16683 10.034 7.86683 10.334 7.50016 10.334ZM8.16683 5.00065H6.8335V3.66732H8.16683V5.00065Z", "fill", "#0E26FF"], [1, "tip-box"], ["width", "20", "height", "20", "viewBox", "0 0 20 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 11C9.45 11 9 10.55 9 10V6C9 5.45 9.45 5 10 5C10.55 5 11 5.45 11 6V10C11 10.55 10.55 11 10 11ZM11 15H9V13H11V15Z", "fill", "#FF5721"], ["class", "tip-box__text", 4, "ngIf"], ["class", "zelf-button zelf-button--primary zelf-button--wide", "mat-flat-button", "", 3, "click", 4, "ngIf"], ["class", "zelf-button zelf-button--hyperlink zelf-button--wide", "mat-flat-button", "", 3, "click", 4, "ngIf"], [1, "tip-box__text"], ["mat-flat-button", "", 1, "zelf-button", "zelf-button--primary", "zelf-button--wide", 3, "click"], ["mat-flat-button", "", 1, "zelf-button", "zelf-button--hyperlink", "zelf-button--wide", 3, "click"], [4, "transloco"], ["class", "address-row tooltip-container", 3, "click", 4, "ngIf"], [1, "address-row", "tooltip-container", 3, "click"], [1, "address-row__inner"], ["alt", "Currency Logo", 1, "address-row__logo", 3, "src"], [1, "address-row__label"], [1, "address-row__value"], [1, "tooltip"]],
    template: function WelcomeGraceComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](0, WelcomeGraceComponent_div_0_Template, 10, 4, "div", 1)(1, WelcomeGraceComponent_ng_template_1_Template, 1, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplateRefExtractor"]);
      }
    },
    dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgTemplateOutlet, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__.TranslocoDirective, _angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_15__.MatIconButton, _angular_common__WEBPACK_IMPORTED_MODULE_1__.DatePipe],
    styles: ["[_ngcontent-%COMP%]:root {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc);\n}\n\n.zelf-button-external-link[_ngcontent-%COMP%] {\n  display: block;\n}\n.zelf-button-external-link--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.zelf-button[_ngcontent-%COMP%] {\n  align-items: center;\n  border-radius: 16px;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  gap: 8px;\n  height: 56px;\n  justify-content: center;\n  outline: none;\n  padding: 8px 24px;\n  text-align: center;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.zelf-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-button[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: inherit;\n}\n.zelf-button__text--margin-right[_ngcontent-%COMP%] {\n  margin-right: 1rem;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-button--thin[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  padding: 12px 16px;\n}\n.zelf-button--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.zelf-button--wide.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-button--primary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button, #181818) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--primary[_ngcontent-%COMP%]:active {\n  --mdc-filled-button-container-color: var(--zns-theme-text-muted, #96939e) !important;\n  background-color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-hover, #ff5721) !important;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff) !important;\n  stroke: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-text-secondary, #73777f) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-text-secondary, #73777f) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--secondary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-button-secondary-text, #495057) !important;\n  background-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  color: var(--zns-theme-button-secondary-text, #495057) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-secondary-text, #495057);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus, .zelf-button--secondary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-border, #e3e3e3) !important;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]:focus, .zelf-button--tertiary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%] {\n  --mdc-outlined-button-label-text-color: var(--zns-theme-button, #181818) !important;\n  --mdc-outlined-button-outline-color: var(--zns-theme-border, #e3e3e3) !important;\n  border: 1px solid var(--zns-theme-button, #181818) !important;\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-button, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button, #181818);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus, .zelf-button--outlined[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--outlined[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--outlined[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%] {\n  border: none !important;\n  background-color: transparent !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--red[_ngcontent-%COMP%]:focus, .zelf-button--red[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n}\n.zelf-button--red[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e);\n}\n.zelf-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n}\n\n.zelf-icon-button[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  align-items: center;\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  border-radius: 56px;\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  font-weight: 600;\n  gap: 16px;\n  height: 56px;\n  justify-content: center;\n  min-height: 56px;\n  min-width: 56px;\n  outline: none;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  -webkit-user-select: none;\n          user-select: none;\n  width: 56px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-icon-button.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: var(--zns-theme-text, #181818);\n  height: 24px;\n  width: 24px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%] {\n  height: 40px;\n  min-height: 40px;\n  min-width: 40px;\n  width: 40px;\n  border-radius: 40px;\n  padding: 0 8px;\n}\n.zelf-icon-button--40.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 14px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  height: 20px;\n  width: 20px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e) !important;\n  stroke: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:active {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus, .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%] {\n  background-color: transparent !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]:focus, .zelf-icon-button--transparent[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--text[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: initial !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  height: auto;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n  width: auto;\n}\n\n.zelf-icon-button-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:first-child {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:last-child {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.zelf-action-button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: 8px;\n}\n.zelf-action-button__icon[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  background: var(--zns-theme-card, #ffffff);\n  border-radius: 32px;\n  outline: 1px var(--zns-theme-border, #e3e3e3) solid;\n  outline-offset: -1px;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  cursor: pointer;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n@media (max-width: 600px) {\n  .zelf-action-button__icon[_ngcontent-%COMP%] {\n    padding: 8px 14px;\n  }\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-size: 24px;\n  line-height: 1;\n  font-variation-settings: \"FILL\" 0, \"wght\" 400, \"GRAD\" 0, \"opsz\" 24;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-primary, #181818);\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .zelf-action-button__text[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon-box[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  position: relative;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n}\n.zelf-action-button__text[_ngcontent-%COMP%] {\n  width: auto;\n  white-space: nowrap;\n  text-align: center;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 11px;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  line-height: 16px;\n  letter-spacing: 0.5px;\n  word-wrap: normal;\n}\n\n.tip-box[_ngcontent-%COMP%] {\n  align-items: flex-start;\n  border-radius: 16px;\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  box-sizing: border-box;\n  display: flex;\n  gap: 12px;\n  padding: 16px;\n  width: 100%;\n}\n.tip-box__text[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 20px;\n  margin: 0 !important;\n}\n.tip-box__link[_ngcontent-%COMP%] {\n  text-decoration: underline;\n}\n\n.tooltip[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  position: absolute;\n  background-color: var(--zns-theme-text, #181818);\n  color: var(--zns-theme-background, #ffffff);\n  font-size: 12px;\n  padding: 8px 12px;\n  border-radius: 9999px;\n  white-space: nowrap;\n  top: -44px;\n  opacity: 0;\n  visibility: hidden;\n  transform: translateY(10px);\n  transition: opacity 0.2s ease, transform 0.2s ease;\n}\n.tooltip[_ngcontent-%COMP%]::after {\n  content: \"\";\n  position: absolute;\n  bottom: -12px;\n  left: 50%;\n  transform: translateX(-50%);\n  border-width: 6px;\n  border-style: solid;\n  border-color: var(--zns-theme-text, #181818) transparent transparent transparent;\n}\n\n.tooltip-container[_ngcontent-%COMP%] {\n  position: relative;\n  cursor: pointer;\n}\n.tooltip-container[_ngcontent-%COMP%]:hover   .tooltip[_ngcontent-%COMP%] {\n  opacity: 1;\n  visibility: visible;\n  transform: translateY(0);\n}\n\n[_nghost-%COMP%] {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  justify-content: center;\n}\n\n.welcome-grace[_ngcontent-%COMP%] {\n  min-height: 75vh;\n  display: flex;\n  justify-content: flex-start;\n  gap: calc(24px * var(--zns-space-scale, 1));\n}\n.welcome-grace__header-button[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n  flex-direction: row;\n  width: 100%;\n}\n.welcome-grace__content[_ngcontent-%COMP%] {\n  align-items: center;\n  gap: calc(24px * var(--zns-space-scale, 1));\n  flex: 1 1 auto;\n}\n.welcome-grace__details[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: calc(12px * var(--zns-space-scale, 1));\n  flex: 1 1 auto;\n  width: 100%;\n}\n.welcome-grace__addresses[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: calc(12px * var(--zns-space-scale, 1));\n  margin-top: calc(16px * var(--zns-space-scale, 1));\n}\n.welcome-grace__subtitle[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n.welcome-grace__chip[_ngcontent-%COMP%] {\n  margin-top: calc(8px * var(--zns-space-scale, 1));\n}\n.welcome-grace__date-row[_ngcontent-%COMP%] {\n  margin: 16px 0;\n  align-items: center;\n  display: flex;\n  flex-direction: row;\n  gap: 12px;\n  justify-content: space-between;\n  width: 100%;\n}\n.welcome-grace__date-column[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  text-align: center;\n  width: 100%;\n}\n.welcome-grace__date-title[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 11px;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 500;\n  letter-spacing: 0.5px;\n  line-height: 16px;\n  margin: 0;\n}\n.welcome-grace__date-text__inner-row[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: row;\n  gap: 4px;\n  align-items: center;\n  justify-content: center;\n}\n.welcome-grace__date-text__inner-row[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  margin-bottom: 2px;\n}\n.welcome-grace__date-text[_ngcontent-%COMP%] {\n  color: #181818;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 600;\n  letter-spacing: 0.1px;\n  line-height: 20px;\n  margin: 0 !important;\n}\n\n.address-row[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card-border, #eeedf1);\n  border-radius: 16px;\n  height: 64px;\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.address-row__inner[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  padding: 0 16px;\n  gap: 8px;\n  flex: 1 1 auto;\n  justify-content: center;\n  align-items: center;\n}\n.address-row__logo[_ngcontent-%COMP%] {\n  min-height: 32px;\n  min-width: 32px;\n  max-height: 32px;\n  max-width: 32px;\n  border-radius: 32px;\n  object-fit: contain;\n  display: flex;\n  justify-self: flex-start;\n}\n.address-row__label[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  display: flex;\n  justify-self: flex-start;\n  flex: 1 1 40%;\n}\n.address-row__value[_ngcontent-%COMP%] {\n  color: #181818;\n  font-family: monospace;\n  font-size: 14px;\n  font-weight: 500;\n  display: flex;\n  flex: 1 1 40%;\n  justify-content: flex-end;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX2J1dHRvbnMuc2NzcyIsIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX3ZhcmlhYmxlcy5zY3NzIiwid2VicGFjazovLy4vc3JjL2FwcC93ZWxjb21lLWdyYWNlL3dlbGNvbWUtZ3JhY2UuY29tcG9uZW50LnNjc3MiLCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL19lbGVtZW50cy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQ0ksZ0VDMEJ1QjtBQzNCM0I7O0FGSUE7RUFDSSxjQUFBO0FFREo7QUZHSTtFQUNJLFdBQUE7QUVEUjs7QUZLQTtFQUNJLG1CQUFBO0VBQ0EsbUJBQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQTtFQUNBLGFBQUE7RUFDQSx1RUNJYztFREhkLGVBQUE7RUFDQSxnQkFBQTtFQUNBLFFBQUE7RUFDQSxZQUFBO0VBQ0EsdUJBQUE7RUFDQSxhQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLHlCQUFBO1VBQUEsaUJBQUE7QUVGSjtBRklJO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxRQUFBO0FFRlI7QUZLSTtFQUNJLFNBQUE7RUFDQSxjQUFBO0FFSFI7QUZPUTtFQUNJLGtCQUFBO0FFTFo7QUZTSTtFQUNJLDZCQUFBO0VBQ0EsK0NDbEJhO0VEbUJiLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHFCQUFBO0VBQ0EsaUJBQUE7RUFDQSw2R0FDSTtBRVJaO0FGV1E7RUFDSSxlQUFBO0FFVFo7QUZZUTtFQUNJLDhDQ2hDUztBQ3NCckI7QUZhUTtFQUNJLHFDQ3RDQTtFRHVDQSxrREN4QkU7QUNhZDtBRmFZO0VBQ0ksb0NDMUNKO0FDK0JaO0FGZVE7RUFDSSxtQkFBQTtFQUNBLHNEQUFBO0FFYlo7QUZlWTtFQUNJLDBDQ2xEQztBQ3FDakI7QUZrQkk7RUFDSSxrQkFBQTtFQUNBLGtCQUFBO0FFaEJSO0FGbUJJO0VBQ0ksV0FBQTtBRWpCUjtBRm1CUTtFQUNJLG1CQUFB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Q0EsbUJBQUE7RUFDQSxtQkFBQTtFQUNBLGFBQUE7RUFDQSx3QkFBQTtBQW1pQlI7QUFoaUJJO0VBQ0ksK0NENUdhO0VDNkdiLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGFBQUE7RUFDQSx3QkFBQTtFQUNBLGFBQUE7QUFraUJSO0FBL2hCSTtFQUNJLGNEaklBO0VDa0lBLHNCQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsYUFBQTtFQUNBLGFBQUE7RUFDQSx5QkFBQTtBQWlpQlIiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwiLi92YXJpYWJsZXNcIjtcblxuOnJvb3Qge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5O1xufVxuXG4uemVsZi1idXR0b24tZXh0ZXJuYWwtbGluayB7XG4gICAgZGlzcGxheTogYmxvY2s7XG5cbiAgICAmLS13aWRlIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxufVxuXG4uemVsZi1idXR0b24ge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIGdhcDogOHB4O1xuICAgIGhlaWdodDogNTZweDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBvdXRsaW5lOiBub25lO1xuICAgIHBhZGRpbmc6IDhweCAyNHB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcblxuICAgIHNwYW4ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgfVxuXG4gICAgcCB7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgY29sb3I6IGluaGVyaXQ7XG4gICAgfVxuXG4gICAgJl9fdGV4dCB7XG4gICAgICAgICYtLW1hcmdpbi1yaWdodCB7XG4gICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDFyZW07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1oeXBlcmxpbmsge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICAgICAgcGFkZGluZzogOHB4IDE2cHg7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICYtLXNtYWxsIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10aGluIHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICBwYWRkaW5nOiAxMnB4IDE2cHg7XG4gICAgfVxuXG4gICAgJi0td2lkZSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgICAgICYuemVsZi1idXR0b24tLWh5cGVybGluayB7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tcHJpbWFyeSB7XG4gICAgICAgIC8vIE1EQyBtYXQtZmxhdC1idXR0b24gcGFpbnRzIHZpYSBDU1MgdmFyaWFibGVzOyBhbGlnbiB3aXRoIFplbGYgdG9rZW5zIChhdm9pZHMgZGVmYXVsdCBNYXRlcmlhbCBibHVlKS5cbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvbn0gIWltcG9ydGFudDtcbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVDYXJkfSAhaW1wb3J0YW50O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6YWN0aXZlIHtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWR9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3Zlcn0gIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICB9XG5cbiAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnl9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWxhYmVsLXRleHQtY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUNhcmR9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zZWNvbmRhcnkge1xuICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5fSAhaW1wb3J0YW50O1xuICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWxhYmVsLXRleHQtY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeVRleHR9ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5SG92ZXJ9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWxhYmVsLXRleHQtY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUNhcmR9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5SG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQm9yZGVyfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlciAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXRlcnRpYXJ5IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1vdXRsaW5lZCB7XG4gICAgICAgIC0tbWRjLW91dGxpbmVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b259ICFpbXBvcnRhbnQ7XG4gICAgICAgIC0tbWRjLW91dGxpbmVkLWJ1dHRvbi1vdXRsaW5lLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCb3JkZXJ9ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUJ1dHRvbiAhaW1wb3J0YW50O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbiAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbjtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbkhvdmVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXJlZCB7XG4gICAgICAgIGJvcmRlcjogbm9uZSAhaW1wb3J0YW50O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kZXJyb3JMaWdodCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1lcnJvciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kZXJyb3JMaWdodCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGVycm9yICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zdWNjZXNzIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRjb3JyZWN0TGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXBpbGwge1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDA7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgcGFkZGluZzogNHB4IDEycHg7XG4gICAgfVxufVxuXG4uemVsZi1pY29uLWJ1dHRvbiB7XG4gICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXIgIWltcG9ydGFudDtcbiAgICBib3JkZXItcmFkaXVzOiA1NnB4O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICBnYXA6IDE2cHg7XG4gICAgaGVpZ2h0OiA1NnB4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG1pbi1oZWlnaHQ6IDU2cHg7XG4gICAgbWluLXdpZHRoOiA1NnB4O1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgdHJhbnNpdGlvbjpcbiAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgIHdpZHRoOiA1NnB4O1xuXG4gICAgc3BhbiB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICB9XG5cbiAgICAmLnplbGYtaWNvbi1idXR0b24tLWJvcmRlci1zb2Z0IHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICB9XG5cbiAgICBzdmcge1xuICAgICAgICB0cmFuc2l0aW9uOiBmaWxsIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBoZWlnaHQ6IDI0cHg7XG4gICAgICAgIHdpZHRoOiAyNHB4O1xuICAgIH1cblxuICAgICY6aG92ZXIge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHNlY29uZGFyeUNvbG9yICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1ib3JkZXItc29mdCB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgfVxuXG4gICAgJi0tNDAge1xuICAgICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDQwcHg7XG4gICAgICAgIG1pbi13aWR0aDogNDBweDtcbiAgICAgICAgd2lkdGg6IDQwcHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDQwcHg7XG4gICAgICAgIHBhZGRpbmc6IDAgOHB4O1xuXG4gICAgICAgICYuemVsZi1pY29uLWJ1dHRvbi0tYm9yZGVyLXNvZnQge1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTRweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBoZWlnaHQ6IDIwcHg7XG4gICAgICAgICAgICB3aWR0aDogMjBweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWh5cGVybGluayB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBwYWRkaW5nOiA4cHggMTZweDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuMnMgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJi0tc21hbGwge1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1wcmltYXJ5IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbiAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjphY3RpdmUge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbkhvdmVyICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbkhvdmVyICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zZWNvbmRhcnkge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlciAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHNlY29uZGFyeUNvbG9yICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlciAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXRyYW5zcGFyZW50IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXRleHQge1xuICAgICAgICB3aWR0aDogYXV0byAhaW1wb3J0YW50O1xuICAgICAgICBtaW4td2lkdGg6IGluaXRpYWwgIWltcG9ydGFudDtcbiAgICB9XG5cbiAgICAmLS1lcnJvciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kZXJyb3JMaWdodCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGVycm9yICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zdWNjZXNzIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRjb3JyZWN0TGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXBpbGwge1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIGhlaWdodDogYXV0bztcbiAgICAgICAgbWluLWhlaWdodDogMDtcbiAgICAgICAgbWluLXdpZHRoOiAwO1xuICAgICAgICBwYWRkaW5nOiA0cHggMTJweDtcbiAgICAgICAgd2lkdGg6IGF1dG87XG4gICAgfVxufVxuXG4uemVsZi1pY29uLWJ1dHRvbi1ncm91cCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogMDtcblxuICAgIC56ZWxmLWljb24tYnV0dG9uIHtcbiAgICAgICAgJjpmaXJzdC1jaGlsZCB7XG4gICAgICAgICAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMDtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpub3QoOmZpcnN0LWNoaWxkKTpub3QoOmxhc3QtY2hpbGQpIHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDA7XG4gICAgICAgIH1cblxuICAgICAgICAmOmxhc3QtY2hpbGQge1xuICAgICAgICAgICAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogMDtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDA7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi56ZWxmLWFjdGlvbi1idXR0b24ge1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiA4cHg7XG5cbiAgICAmX19pY29uIHtcbiAgICAgICAgcGFkZGluZzogMTBweCAyMHB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMzJweDtcbiAgICAgICAgb3V0bGluZTogMXB4IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgc29saWQ7XG4gICAgICAgIG91dGxpbmUtb2Zmc2V0OiAtMXB4O1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogOHB4O1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiB2YXJpYWJsZXMuJG1pblNtYWxsKSB7XG4gICAgICAgICAgICBwYWRkaW5nOiA4cHggMTRweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGZpbGwgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC5tYXRlcmlhbC1zeW1ib2xzLW91dGxpbmVkIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgICAgICAgICAgZm9udC12YXJpYXRpb24tc2V0dGluZ3M6XG4gICAgICAgICAgICAgICAgXCJGSUxMXCIgMCxcbiAgICAgICAgICAgICAgICBcIndnaHRcIiA0MDAsXG4gICAgICAgICAgICAgICAgXCJHUkFEXCIgMCxcbiAgICAgICAgICAgICAgICBcIm9wc3pcIiAyNDtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kcHJpbWFyeUNvbG9yO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAubWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAuemVsZi1hY3Rpb24tYnV0dG9uX190ZXh0IHtcbiAgICAgICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19pY29uLWJveCB7XG4gICAgICAgIHdpZHRoOiAyOHB4O1xuICAgICAgICBoZWlnaHQ6IDI4cHg7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIH1cblxuICAgICZfX3RleHQge1xuICAgICAgICB3aWR0aDogYXV0bztcbiAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBsaW5lLWhlaWdodDogMTZweDtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgICAgICB3b3JkLXdyYXA6IG5vcm1hbDtcbiAgICB9XG59XG4iLCIkcHJpbWFyeUNvbG9yOiB2YXIoLS16bnMtdGhlbWUtcHJpbWFyeSwgIzE4MTgxOCk7XG4kcHJpbWFyeUxpZ2h0OiAjZGFkZGZhO1xuJHNlY29uZGFyeUNvbG9yOiB2YXIoLS16bnMtdGhlbWUtc2Vjb25kYXJ5LCAjZmY1NzIxKTtcbiRzZWNvbmRhcnlDb2xvckxpZ2h0OiAjZjZlNWUwO1xuXG4kY29ycmVjdDogdmFyKC0tem5zLXRoZW1lLXN1Y2Nlc3MsICMxZWE0NDYpO1xuJGNvcnJlY3REYXJrOiAjMGY1MjIzO1xuJGNvcnJlY3RMaWdodDogdmFyKC0tem5zLXRoZW1lLXN1Y2Nlc3MtdGV4dCwgI2U3ZjhlZCk7XG5cbiRlcnJvcjogdmFyKC0tem5zLXRoZW1lLWVycm9yLCAjZGMzNjJlKTtcbiRlcnJvckRhcms6ICM2MDE0MTA7XG4kZXJyb3JMaWdodDogdmFyKC0tem5zLXRoZW1lLWVycm9yLXRleHQsICNmY2VlZWUpO1xuXG4kd2FybmluZzogdmFyKC0tem5zLXRoZW1lLXdhcm5pbmcsICNkZTY4MDApO1xuJHdhcm5pbmdEYXJrOiAjNGEyMTBhO1xuJHdhcm5pbmdMaWdodDogdmFyKC0tem5zLXRoZW1lLXdhcm5pbmctdGV4dCwgI2ZmZWVlOSk7XG5cbiRpbmZvOiAjMzk5OGQzO1xuJGluZm9EYXJrOiAjMDA0YTc3O1xuJGluZm9MaWdodDogI2VjZjNmZTtcblxuJGJsYWNrOiAjMTgxODE4O1xuJHdoaXRlOiAjZmZmZmZmO1xuXG4kdGhlbWVCb2R5RmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtYm9keS1mYW1pbHksIFwiUG9wcGluc1wiLCBBcmlhbCwgc2Fucy1zZXJpZik7XG4kdGhlbWVUaXRsZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLXRpdGxlLWZhbWlseSwgXCJNZW5kYVwiLCBcIkFyaWFsIEJsYWNrXCIsIHNhbnMtc2VyaWYpO1xuJHRoZW1lTW9ub3NwYWNlRmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtbW9ub3NwYWNlLWZhbWlseSwgXCJDb3VyaWVyIE5ld1wiLCBDb3VyaWVyLCBtb25vc3BhY2UpO1xuXG4kdGhlbWVCYWNrZ3JvdW5kOiB2YXIoLS16bnMtdGhlbWUtYmFja2dyb3VuZCwgI2ZmZmZmZik7XG4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtYmFja2dyb3VuZC1zZWNvbmRhcnksICNmOWY5ZmMpO1xuXG4kdGhlbWVUZXh0OiB2YXIoLS16bnMtdGhlbWUtdGV4dCwgIzE4MTgxOCk7XG4kdGhlbWVUZXh0TXV0ZWQ6IHZhcigtLXpucy10aGVtZS10ZXh0LW11dGVkLCAjOTY5MzllKTtcbiR0aGVtZVRleHRTZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS10ZXh0LXNlY29uZGFyeSwgIzczNzc3Zik7XG5cbiR0aGVtZUhlYWRlcjogdmFyKC0tem5zLXRoZW1lLWhlYWRlciwgIzE4MTgxOCk7XG4kdGhlbWVIZWFkZXJUZXh0OiB2YXIoLS16bnMtdGhlbWUtaGVhZGVyLXRleHQsICNmZmZmZmYpO1xuXG4kdGhlbWVCdXR0b246IHZhcigtLXpucy10aGVtZS1idXR0b24sICMxODE4MTgpO1xuJHRoZW1lQnV0dG9uVGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi10ZXh0LCAjZmZmZmZmKTtcbiR0aGVtZUJ1dHRvbkhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLWhvdmVyLCAjZmY1NzIxKTtcblxuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeSwgI2U5ZWNlZik7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeS10ZXh0LCAjNDk1MDU3KTtcbiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeS1ob3ZlciwgI2U5ZWNlZik7XG5cbiR0aGVtZUJvcmRlcjogdmFyKC0tem5zLXRoZW1lLWJvcmRlciwgI2UzZTNlMyk7XG4kdGhlbWVCb3JkZXJIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJvcmRlci1ob3ZlciwgI2MzYzZjZik7XG5cbiR0aGVtZUNhcmQ6IHZhcigtLXpucy10aGVtZS1jYXJkLCAjZmZmZmZmKTtcbiR0aGVtZUNhcmRCb3JkZXI6IHZhcigtLXpucy10aGVtZS1jYXJkLWJvcmRlciwgI2VlZWRmMSk7XG5cbiR0aGVtZVNoYWRvdzogdmFyKC0tem5zLXRoZW1lLXNoYWRvdywgcmdiYSgwLCAwLCAwLCAwLjEpKTtcblxuJHNtb290aEJlemllcjogY3ViaWMtYmV6aWVyKDAuMjUsIDAuNCwgMC43LCAxKTtcblxuJG1heEV4dHJhU21hbGw6IDU5NXB4O1xuJG1pblNtYWxsOiA2MDBweDtcbiRtZWRpdW06IDc2OHB4O1xuJGxhcmdlOiA4ODlweDtcbiRjb21wdXRlcnM6IDEyMDBweDtcbiIsIkB1c2UgXCIuLi8uLi9zdHlsZXMvdmFyaWFibGVzXCI7XG5AdXNlIFwiLi4vLi4vc3R5bGVzL2J1dHRvbnNcIjtcbkB1c2UgXCIuLi8uLi9zdHlsZXMvZWxlbWVudHNcIjtcblxuOmhvc3Qge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGZsZXgtZ3JvdzogMTtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cbi53ZWxjb21lLWdyYWNlIHtcbiAgICBtaW4taGVpZ2h0OiA3NXZoO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgIGdhcDogY2FsYygyNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG5cbiAgICAmX19oZWFkZXItYnV0dG9uIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX19jb250ZW50IHtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDI0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZmxleDogMSAxIGF1dG87XG4gICAgfVxuXG4gICAgJl9fZGV0YWlscyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZmxleDogMSAxIGF1dG87XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgICZfX2FkZHJlc3NlcyB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBnYXA6IGNhbGMoMTJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBtYXJnaW4tdG9wOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19zdWJ0aXRsZSB7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgfVxuXG4gICAgJl9fY2hpcCB7XG4gICAgICAgIG1hcmdpbi10b3A6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgfVxuXG4gICAgJl9fZGF0ZSB7XG4gICAgICAgICYtcm93IHtcbiAgICAgICAgICAgIG1hcmdpbjogMTZweCAwO1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICAgICAgZ2FwOiAxMnB4O1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIH1cblxuICAgICAgICAmLWNvbHVtbiB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgICAgIGdhcDogNHB4O1xuICAgICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIH1cblxuICAgICAgICAmLXRpdGxlIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC41cHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTZweDtcbiAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgfVxuXG4gICAgICAgICYtdGV4dF9faW5uZXItcm93IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgICAgICAgIGdhcDogNHB4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDJweDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICYtdGV4dCB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRibGFjaztcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xcHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMjBweDtcbiAgICAgICAgICAgIG1hcmdpbjogMCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uYWRkcmVzcy1yb3cge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgaGVpZ2h0OiA2NHB4O1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICZfX2lubmVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgICAgcGFkZGluZzogMCAxNnB4O1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgZmxleDogMSAxIGF1dG87XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIH1cblxuICAgICZfX2xvZ28ge1xuICAgICAgICBtaW4taGVpZ2h0OiAzMnB4O1xuICAgICAgICBtaW4td2lkdGg6IDMycHg7XG4gICAgICAgIG1heC1oZWlnaHQ6IDMycHg7XG4gICAgICAgIG1heC13aWR0aDogMzJweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMzJweDtcbiAgICAgICAgb2JqZWN0LWZpdDogY29udGFpbjtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1zZWxmOiBmbGV4LXN0YXJ0O1xuICAgIH1cblxuICAgICZfX2xhYmVsIHtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktc2VsZjogZmxleC1zdGFydDtcbiAgICAgICAgZmxleDogMSAxIDQwJTtcbiAgICB9XG5cbiAgICAmX192YWx1ZSB7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGJsYWNrO1xuICAgICAgICBmb250LWZhbWlseTogbW9ub3NwYWNlO1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXg6IDEgMSA0MCU7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgfVxufVxuIiwiQHVzZSBcIi4vdmFyaWFibGVzXCI7XG5cbi50aXAtYm94IHtcbiAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBnYXA6IDEycHg7XG4gICAgcGFkZGluZzogMTZweDtcbiAgICB3aWR0aDogMTAwJTtcblxuICAgICZfX3RleHQge1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBsaW5lLWhlaWdodDogMjBweDtcbiAgICAgICAgbWFyZ2luOiAwICFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgJl9fbGluayB7XG4gICAgICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xuICAgIH1cbn1cblxuLnRvb2x0aXAge1xuICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kO1xuICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICBwYWRkaW5nOiA4cHggMTJweDtcbiAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICB0b3A6IC00NHB4O1xuICAgIG9wYWNpdHk6IDA7XG4gICAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgxMHB4KTtcbiAgICB0cmFuc2l0aW9uOlxuICAgICAgICBvcGFjaXR5IDAuMnMgZWFzZSxcbiAgICAgICAgdHJhbnNmb3JtIDAuMnMgZWFzZTtcblxuICAgICY6OmFmdGVyIHtcbiAgICAgICAgY29udGVudDogXCJcIjtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICBib3R0b206IC0xMnB4O1xuICAgICAgICBsZWZ0OiA1MCU7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcbiAgICAgICAgYm9yZGVyLXdpZHRoOiA2cHg7XG4gICAgICAgIGJvcmRlci1zdHlsZTogc29saWQ7XG4gICAgICAgIGJvcmRlci1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQgdHJhbnNwYXJlbnQgdHJhbnNwYXJlbnQgdHJhbnNwYXJlbnQ7XG4gICAgfVxufVxuXG4udG9vbHRpcC1jb250YWluZXIge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG5cbiAgICAmOmhvdmVyIC50b29sdGlwIHtcbiAgICAgICAgb3BhY2l0eTogMTtcbiAgICAgICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }

}]);
//# sourceMappingURL=src_app_welcome-grace_welcome-grace_component_ts.js.map