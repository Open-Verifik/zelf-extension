"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_welcome-find-import-claim_welcome-find-import-claim_component_ts"],{

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

/***/ 20655
/*!*****************************************!*\
  !*** ./src/app/pipes/zelf-name.pipe.ts ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZelfNamePipe: () => (/* binding */ ZelfNamePipe)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 12481);

/**
 * Pipe to format the Zelf name.
 *
 * Use pipe without arguments to return the name resized for different screen sizes.
 * Use pipe with a number argument to return the name resized for small screen sizes with a custom length.
 * Adjusts based on screen size;
 *
 * @example
 *  {{ "testinglargezelfname.zelf" | zelfName }} // TESTINGL...AME.ZELF
 *  {{ "testinglargezelfname.zelf" | zelfName: 10 }} // TESTINGL...ME.ZELF
 *  {{ "testinglargezelfname.zelf" | zelfName: 20 }} // TESTINGLARGEZELFNAME.ZELF
 */
class ZelfNamePipe {
  cdr;
  ngZone;
  _onResize = this.onResize.bind(this);
  constructor(cdr, ngZone) {
    this.cdr = cdr;
    this.ngZone = ngZone;
    window.addEventListener("resize", this._onResize);
  }
  ngOnDestroy() {
    window.removeEventListener("resize", this._onResize);
  }
  transform(value, ...args) {
    if (typeof value !== "string" || !value?.trim()) return "****.zelf";
    const hasZelfPostfix = value.includes(".zelf");
    const zelfName = value.split(".zelf")[0];
    const windowWidth = window.innerWidth;
    if (!isNaN(+args[0])) {
      if (+args[0] && args[0] <= 10) return zelfName.trim().toUpperCase();
      if (windowWidth < 480 && zelfName?.trim().length > +args[0]) {
        if (hasZelfPostfix) return this.transform(value.split(".zelf")[0], +args[0]);
        return `${zelfName.slice(0, +args[0] - 10)}...${zelfName.slice(-9)}`.toUpperCase();
      }
    } else {
      if (windowWidth < 480 && zelfName?.trim().length > 15) {
        if (hasZelfPostfix) return this.transform(value.split(".zelf")[0], +args[0]);
        return `${zelfName.slice(0, 15 - 10)}...${zelfName.slice(-9)}`.toUpperCase();
      }
      if (windowWidth < 768 && zelfName?.trim().length > 24) {
        if (hasZelfPostfix) return this.transform(value.split(".zelf")[0], +args[0]);
        return `${zelfName.slice(0, 24 - 10)}...${zelfName.slice(-9)}`.toUpperCase();
      }
    }
    return zelfName.trim().toUpperCase();
  }
  onResize() {
    this.ngZone.run(() => {
      this.cdr.markForCheck();
    });
  }
  static ɵfac = function ZelfNamePipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ZelfNamePipe)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef, 16), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone, 16));
  };
  static ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefinePipe"]({
    name: "zelfName",
    type: ZelfNamePipe,
    pure: false
  });
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: ZelfNamePipe,
    factory: ZelfNamePipe.ɵfac
  });
}

/***/ },

/***/ 27888
/*!**********************************************************************************!*\
  !*** ./src/app/welcome-find-import-claim/welcome-find-import-claim.component.ts ***!
  \**********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WelcomeFindImportClaimComponent: () => (/* binding */ WelcomeFindImportClaimComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 33900);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/progress-spinner */ 41134);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var app_domain_selection_modal_domain_selection_modal_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! app/domain-selection-modal/domain-selection-modal.component */ 74232);
/* harmony import */ var app_pipes_zelf_name_pipe__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! app/pipes/zelf-name.pipe */ 20655);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var app_captcha_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! app/captcha.service */ 29569);
/* harmony import */ var app_chrome_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! app/chrome.service */ 85043);
/* harmony import */ var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/bottom-sheet */ 15244);
/* harmony import */ var app_domain_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! app/domain.service */ 4813);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var app_tags_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! app/tags.service */ 73768);
/* harmony import */ var app_vault_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! app/vault.service */ 19519);






















const _c0 = (a0, a1) => ({
  "welcome-claim__step--active": a0,
  "welcome-claim__step--exit": a1
});
const _c1 = () => ({
  current: 2,
  total: 4
});
const _c2 = (a0, a1) => ({
  "welcome-claim__input--available": a0,
  "welcome-claim__input--taken": a1
});
const _c3 = (a0, a1) => ({
  "welcome-claim__step--active": a0,
  "welcome-claim__step--enter": a1
});
const _c4 = (a0, a1) => ({
  "welcome-claim__status-chip--available": a0,
  "welcome-claim__status-chip--taken": a1
});
function WelcomeFindImportClaimComponent_div_0_ng_container_73_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "mat-spinner", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
  }
}
function WelcomeFindImportClaimComponent_div_0_ng_template_74_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "svg", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "path", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("disabled", ((tmp_4_0 = ctx_r1.form.get("tagName")) == null ? null : tmp_4_0.invalid) || ctx_r1.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵattribute"]("aria-label", t_r3("welcome.search_name_aria"));
  }
}
function WelcomeFindImportClaimComponent_div_0_div_76__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "svg", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "path", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function WelcomeFindImportClaimComponent_div_0_div_76__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "svg", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "path", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function WelcomeFindImportClaimComponent_div_0_div_76_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("welcome.tag_name_available"));
  }
}
function WelcomeFindImportClaimComponent_div_0_div_76_span_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("welcome.tag_name_taken"));
  }
}
function WelcomeFindImportClaimComponent_div_0_div_76_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 54)(1, "div", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](2, WelcomeFindImportClaimComponent_div_0_div_76__svg_svg_2_Template, 2, 0, "svg", 56)(3, WelcomeFindImportClaimComponent_div_0_div_76__svg_svg_3_Template, 2, 0, "svg", 56)(4, WelcomeFindImportClaimComponent_div_0_div_76_span_4_Template, 2, 1, "span", 57)(5, WelcomeFindImportClaimComponent_div_0_div_76_span_5_Template, 2, 1, "span", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction2"](5, _c4, ctx_r1.isAvailable, !ctx_r1.isAvailable));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.isAvailable);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx_r1.isAvailable);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.isAvailable);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx_r1.isAvailable);
  }
}
function WelcomeFindImportClaimComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 2)(1, "div", 3)(2, "div", 4)(3, "button", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function WelcomeFindImportClaimComponent_div_0_Template_button_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.step === 2 ? ctx_r1.goBackToSearch() : ctx_r1.goBackToMnemonic());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "svg", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](5, "path", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](6, "div", 8)(7, "div", 9)(8, "div", 10)(9, "span", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](11, "h2", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](13, "p", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](15, "div", 14)(16, "div", 15)(17, "div", 16)(18, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](19, "L");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](20, "div", 18)(21, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](22);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](23, "lowercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](24, "span", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](25);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](26, "div", 21)(27, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](28, "J");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](29, "div", 18)(30, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](31);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](32, "lowercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](33, "span", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](34);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](35, "div", 22)(36, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](37, "A");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](38, "div", 18)(39, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](40);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](41, "lowercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](42, "span", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](43);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](44, "div", 23)(45, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](46, "C");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](47, "div", 18)(48, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](50, "lowercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](51, "span", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](52);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](53, "div", 24)(54, "div", 25)(55, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](56, "?");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](57, "div", 18)(58, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](59);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](60, "zelfName");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](61, "lowercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](62, "span", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](63);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](64, "form", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("ngSubmit", function WelcomeFindImportClaimComponent_div_0_Template_form_ngSubmit_64_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.searchZelfName($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](65, "div", 28)(66, "input", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("input", function WelcomeFindImportClaimComponent_div_0_Template_input_input_66_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.sanitizeZelfName());
    })("keydown.enter", function WelcomeFindImportClaimComponent_div_0_Template_input_keydown_enter_66_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.searchZelfName($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](67, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("mouseenter", function WelcomeFindImportClaimComponent_div_0_Template_div_mouseenter_67_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.domainHover = true);
    })("mouseleave", function WelcomeFindImportClaimComponent_div_0_Template_div_mouseleave_67_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.domainHover = false);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](68, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function WelcomeFindImportClaimComponent_div_0_Template_div_click_68_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.openDomainSelectionModal());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](69);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](70, "span", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function WelcomeFindImportClaimComponent_div_0_Template_span_click_70_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      $event.stopPropagation();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.openDomainSelectionModal());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](71, "svg", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](72, "path", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](73, WelcomeFindImportClaimComponent_div_0_ng_container_73_Template, 3, 0, "ng-container", 35)(74, WelcomeFindImportClaimComponent_div_0_ng_template_74_Template, 3, 2, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](76, WelcomeFindImportClaimComponent_div_0_div_76_Template, 6, 8, "div", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](77, "div", 37)(78, "div", 38)(79, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](80);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](81, "h2", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](82);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](83, "zelfName");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](84, "lowercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](85, "p", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](86);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](87, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](88, "form", 42)(89, "div", 43)(90, "label", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](91, "input", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](92, "svg", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](93, "polyline", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](94, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](95, "button", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function WelcomeFindImportClaimComponent_div_0_Template_button_click_95_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.continueToSecurity());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](96);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()()()();
  }
  if (rf & 2) {
    let tmp_7_0;
    let tmp_9_0;
    let tmp_11_0;
    let tmp_13_0;
    let tmp_15_0;
    let tmp_22_0;
    let tmp_28_0;
    let tmp_32_0;
    const t_r3 = ctx.$implicit;
    const searchBtn_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵreference"](75);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction2"](49, _c0, ctx_r1.step === 1, ctx_r1.step === 2));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", t_r3("welcome.find_import_step_label", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction0"](52, _c1)), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("welcome.find_import_choose_tag_name_title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("welcome.find_import_choose_tag_name_subtitle"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](23, 33, "miguel." + (((tmp_7_0 = ctx_r1.form.get("domain")) == null ? null : tmp_7_0.value) || "zelf")));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("common.authorized"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](32, 35, "johan." + (((tmp_9_0 = ctx_r1.form.get("domain")) == null ? null : tmp_9_0.value) || "zelf")));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("common.authorized"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](41, 37, "anuar." + (((tmp_11_0 = ctx_r1.form.get("domain")) == null ? null : tmp_11_0.value) || "zelf")));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("common.authorized"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](50, 39, "carlos." + (((tmp_13_0 = ctx_r1.form.get("domain")) == null ? null : tmp_13_0.value) || "zelf")));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("common.authorized"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](60, 41, ((tmp_15_0 = ctx_r1.form.get("tagName")) == null ? null : tmp_15_0.value) || t_r3("welcome.preview_name_placeholder")), ".", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](61, 43, ((tmp_15_0 = ctx_r1.form.get("domain")) == null ? null : tmp_15_0.value) || "zelf"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("common.available"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("formGroup", ctx_r1.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction2"](53, _c2, ctx_r1.availabilityChecked && ctx_r1.isAvailable, ctx_r1.availabilityChecked && !ctx_r1.isAvailable));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("placeholder", t_r3("welcome.choose_tag_name_placeholder"))("maxlength", ctx_r1.getMaxTagNameLength())("minlength", ctx_r1.getMinTagNameLength());
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](".", ((tmp_22_0 = ctx_r1.form.get("domain")) == null ? null : tmp_22_0.value) || "zelf");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.loading)("ngIfElse", searchBtn_r4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.availabilityChecked);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction2"](56, _c3, ctx_r1.step === 2, ctx_r1.step === 2));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r3("common.available"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](83, 45, ctx_r1.checkedTagName), ".", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](84, 47, ((tmp_28_0 = ctx_r1.form.get("domain")) == null ? null : tmp_28_0.value) || "zelf"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", t_r3("welcome.you_will_register_this_domain"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("formGroup", ctx_r1.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("innerHTML", t_r3("common.agree_to_terms_and_conditions"), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵsanitizeHtml"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("disabled", !((tmp_32_0 = ctx_r1.form.get("termsAndConditions")) == null ? null : tmp_32_0.value) || ctx_r1.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", t_r3("common.continue"), " ");
  }
}
class WelcomeFindImportClaimComponent {
  _captchaService;
  _chromeService;
  _bottomSheet;
  _domainService;
  _formBuilder;
  _router;
  _tagsService;
  _vaultService;
  unsubscriber$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
  availableDomains = [];
  currentDomainConfig = null;
  domain = "zelf";
  domainHover = false;
  form;
  loading = false;
  availabilityChecked = false;
  isAvailable = false;
  checkedTagName = "";
  step = 1;
  constructor(_captchaService, _chromeService, _bottomSheet, _domainService, _formBuilder, _router, _tagsService, _vaultService) {
    this._captchaService = _captchaService;
    this._chromeService = _chromeService;
    this._bottomSheet = _bottomSheet;
    this._domainService = _domainService;
    this._formBuilder = _formBuilder;
    this._router = _router;
    this._tagsService = _tagsService;
    this._vaultService = _vaultService;
    this._initForm();
  }
  ngOnInit() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this._loadDomains();
    })();
  }
  ngAfterContentInit() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this2.form.value.domain) {
        _this2.form.patchValue({
          domain: "zelf"
        }, {
          emitEvent: false
        });
      }
      const initialDomain = _this2.form.get("domain")?.value || "zelf";
      _this2._updateTagNameValidators(initialDomain);
    })();
  }
  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
  get isZelfNameEmpty() {
    const value = (this.form?.value?.tagName || "").trim();
    return value?.length === 0;
  }
  _loadDomains() {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this3.domain = yield _this3._chromeService.getItem("domain");
      try {
        yield _this3._domainService.getDomains();
      } catch {
        // Fall back to cached storage if API fails
      }
      _this3.availableDomains = yield _this3._domainService.loadDomainsFromStorage();
      _this3.form.patchValue({
        domain: _this3.domain
      }, {
        emitEvent: false
      });
    })();
  }
  _initForm() {
    this.form = this._formBuilder.group({
      tagName: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.minLength(1), _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.maxLength(27)]],
      domain: [this.domain || "zelf", [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required]],
      termsAndConditions: [false, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.requiredTrue]
    });
    this.form.get("domain")?.valueChanges.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.takeUntil)(this.unsubscriber$)).subscribe(domain => {
      this._updateTagNameValidators(domain);
    });
    this.form.get("tagName")?.valueChanges.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.takeUntil)(this.unsubscriber$)).subscribe(() => {
      if (this.step === 2) {
        this.step = 1;
      }
      this.availabilityChecked = false;
      this.isAvailable = false;
      this.checkedTagName = "";
    });
  }
  _updateTagNameValidators(domain) {
    if (!domain) return;
    const domainConfig = this.availableDomains.find(d => d.name === domain);
    if (!domainConfig) {
      const configFromService = this._domainService.getDomainLicense(domain);
      if (configFromService && configFromService.tags) {
        this.currentDomainConfig = configFromService;
        this._applyValidators(configFromService.tags.minLength, configFromService.tags.maxLength);
      }
      return;
    }
    if (!domainConfig.tags || !domainConfig.tags.minLength || !domainConfig.tags.maxLength) {
      console.warn(`Domain config for "${domain}" is missing tags validation rules. Using defaults.`);
      return;
    }
    this.currentDomainConfig = domainConfig;
    const {
      minLength,
      maxLength
    } = domainConfig.tags;
    this._applyValidators(minLength, maxLength);
  }
  _applyValidators(minLength, maxLength) {
    const tagNameControl = this.form.get("tagName");
    if (!tagNameControl) return;
    tagNameControl.clearValidators();
    tagNameControl.setValidators([_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.minLength(minLength), _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.maxLength(maxLength)]);
    const currentValue = tagNameControl.value;
    if (currentValue && currentValue.length > maxLength) {
      tagNameControl.setValue(currentValue.substring(0, maxLength));
    }
    tagNameControl.updateValueAndValidity();
  }
  getMaxTagNameLength() {
    return this.currentDomainConfig?.tags?.maxLength || 27;
  }
  getMinTagNameLength() {
    return this.currentDomainConfig?.tags?.minLength || 1;
  }
  _existingTagName(responseData) {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const tagModel = _this4._tagsService.createTagModelFromSearchResponse(responseData);
      if (!tagModel) {
        _this4.loading = false;
        return;
      }
      const tagName = tagModel.publicData.tagName || tagModel.name;
      if (tagName) {
        yield _this4._tagsService.setTagName(tagName.toLowerCase(), responseData);
        yield _this4._tagsService.setZelfProof(tagModel.zelfProof);
        yield _this4._tagsService.setDomain(tagModel.publicData.domain);
        yield _this4._tagsService.setTagNameObject(tagModel);
        yield _this4._tagsService.setTagResponse(responseData);
      }
      _this4.availabilityChecked = true;
      _this4.isAvailable = false;
      _this4.loading = false;
    })();
  }
  searchZelfName(event) {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this5.form.get("tagName")?.valid || !_this5.form.get("domain")?.valid) {
        _this5.form.patchValue({
          tagName: ""
        });
        return;
      }
      if (_this5.loading) return;
      event.preventDefault();
      _this5.loading = true;
      const domain = _this5.form.value.domain || "zelf";
      const tagName = `${_this5.form.value.tagName}`.toLowerCase();
      let captchaToken = "";
      if (!_this5._chromeService.isExtension) {
        try {
          const captchaKey = _this5.form.value.tagName.replace(".", "_");
          captchaToken = yield _this5._captchaService.executeRecaptcha(captchaKey);
        } catch (error) {
          console.error("reCAPTCHA failed:", error);
        }
      }
      _this5._tagsService.searchTag({
        tagName,
        domain: domain,
        captchaToken: captchaToken
      }).then(/*#__PURE__*/function () {
        var _ref = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (response) {
          const isTaken = !response?.data.available;
          if (isTaken) {
            yield _this5._existingTagName(response?.data);
            return;
          }
          yield _this5._tagsService.setNewTagName(tagName);
          yield _this5._tagsService.setDomain(domain);
          yield _this5._tagsService.setTagResponse(response.data);
          const availableTagData = {
            name: tagName,
            available: true,
            publicData: {
              avalancheAddress: "",
              blockDAGAddress: "",
              btcAddress: "",
              domain: domain,
              ethAddress: "",
              expiresAt: "",
              hasPassword: "false",
              origin: "",
              registeredAt: "",
              solanaAddress: "",
              suiAddress: "",
              tagName: tagName,
              type: ""
            }
          };
          yield _this5._tagsService.setTagNameObject(availableTagData);
          _this5.loading = false;
          _this5.availabilityChecked = true;
          _this5.isAvailable = true;
          _this5.checkedTagName = tagName;
          setTimeout(() => {
            _this5.step = 2;
          }, 800);
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }()).catch(exception => {
        console.error({
          exception
        });
        _this5.loading = false;
      });
    })();
  }
  goBackToSearch() {
    this.step = 1;
  }
  /** Back from step 1 returns to mnemonic entry and clears in-memory mnemonic so the user can re-enter. */
  goBackToMnemonic() {
    this._vaultService.mnemonic = "";
    this._router.navigate(["/welcome/find-import-mnemonic"]);
  }
  continueToSecurity() {
    var _this6 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this6._tagsService.setFlow("import");
      _this6._router.navigate(["/security/password"]);
    })();
  }
  sanitizeZelfName() {
    const control = this.form.get("tagName");
    if (!control) return;
    let sanitizedValue = control.value.replace(/[^a-zA-Z0-9.-]|^[^a-zA-Z]+|[.-]$/g, "");
    sanitizedValue = sanitizedValue.toUpperCase().trim();
    control.patchValue(sanitizedValue, {
      emitEvent: false
    });
    if (!sanitizedValue) control.markAsPristine();
  }
  openDomainSelectionModal() {
    const dialogData = {
      domains: this.availableDomains,
      selectedDomain: this.form.get("domain")?.value || "zelf"
    };
    const bottomSheetRef = this._bottomSheet.open(app_domain_selection_modal_domain_selection_modal_component__WEBPACK_IMPORTED_MODULE_8__.DomainSelectionModalComponent, {
      data: dialogData,
      disableClose: true,
      backdropClass: "zelf-backdrop",
      panelClass: "zelf-bottom-sheet-seasalt"
    });
    bottomSheetRef.afterDismissed().subscribe(result => {
      if (!result) return;
      this.form.get("domain")?.setValue(result);
      this._tagsService.setDomain(result);
    });
  }
  static ɵfac = function WelcomeFindImportClaimComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || WelcomeFindImportClaimComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](app_captcha_service__WEBPACK_IMPORTED_MODULE_12__.CaptchaService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](app_chrome_service__WEBPACK_IMPORTED_MODULE_13__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_14__.MatBottomSheet), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](app_domain_service__WEBPACK_IMPORTED_MODULE_15__.DomainService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_16__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](app_tags_service__WEBPACK_IMPORTED_MODULE_17__.TagsService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](app_vault_service__WEBPACK_IMPORTED_MODULE_18__.VaultService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineComponent"]({
    type: WelcomeFindImportClaimComponent,
    selectors: [["welcome-find-import-claim"]],
    decls: 1,
    vars: 0,
    consts: [["searchBtn", ""], ["class", "zelf-card welcome-claim", 4, "transloco"], [1, "zelf-card", "welcome-claim"], [1, "zelf-card__header"], [1, "welcome-claim__header-button"], [1, "zelf-icon-button", "zelf-icon-button--40", 3, "click"], ["viewBox", "0 0 22 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"], [1, "welcome-claim__content"], [1, "welcome-claim__step", 3, "ngClass"], [1, "welcome-claim__heading"], [1, "zelf-chip", "zelf-chip--info", "welcome-find-claim__step-pill"], [1, "zelf-card__title", "welcome-claim__title"], [1, "zelf-card__subtitle", "welcome-claim__subtitle"], [1, "welcome-claim__name-cards"], [1, "name-cards__grid"], [1, "name-card", "name-card--float-1"], [1, "name-card__avatar", "name-card__avatar--orange"], [1, "name-card__info"], [1, "name-card__name"], [1, "name-card__status"], [1, "name-card", "name-card--float-2"], [1, "name-card", "name-card--float-3"], [1, "name-card", "name-card--float-4"], [1, "name-card", "name-card--active", "name-card--float-5"], [1, "name-card__avatar", "name-card__avatar--white"], [1, "name-card__status", "name-card__status--active"], [1, "welcome-claim__form", 3, "ngSubmit", "formGroup"], [1, "zelf-input", "welcome-claim__input", 3, "ngClass"], ["autocomplete", "off", "formControlName", "tagName", "id", "tagName", "name", "tagName", "required", "", 1, "zelf-input__control", "welcome-claim__input-control", 3, "input", "keydown.enter", "placeholder", "maxlength", "minlength"], [1, "zelf-input__postfix", "zelf-input__postfix--dropdown", "mr-2", 3, "mouseenter", "mouseleave"], [1, "domain-display", 3, "click"], [1, "dropdown-icon-container", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "height", "20px", "viewBox", "0 -960 960 960", "width", "20px"], ["d", "M480-384 288-576h384L480-384Z"], [4, "ngIf", "ngIfElse"], ["class", "welcome-claim__status", 4, "ngIf"], [1, "welcome-claim__step", "welcome-claim__step-2", 3, "ngClass"], [1, "welcome-claim__identity"], [1, "zelf-chip", "zelf-chip--success"], [1, "zelf-card__title"], [1, "welcome-claim__divider"], [1, "welcome-claim__confirm-form", 3, "formGroup"], [1, "welcome-claim__buttons"], [1, "zelf-checkbox"], ["formControlName", "termsAndConditions", "id", "termsAndConditions", "name", "termsAndConditions", "type", "checkbox"], ["viewBox", "0 0 21 21"], ["points", "5 10.75 8.5 14.25 16 6"], [3, "innerHTML"], ["mat-flat-button", "", 1, "zelf-button", "zelf-button--primary", "zelf-button--wide", 3, "click", "disabled"], [1, "dropdown-icon-container"], ["mode", "indeterminate", "diameter", "24"], ["type", "submit", 1, "search-button-container", 3, "disabled"], ["d", "M765-144 526-383q-30 22-65.79 34.5-35.79 12.5-76.18 12.5Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.03q0 40.39-12.5 76.18Q599-464 577-434l239 239-51 51ZM384-408q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z"], [1, "welcome-claim__status"], [1, "welcome-claim__status-chip", 3, "ngClass"], ["width", "16", "height", "16", "viewBox", "0 0 20 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], [4, "ngIf"], ["width", "16", "height", "16", "viewBox", "0 0 20 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM7.29 14.29L3.7 10.7C3.31 10.31 3.31 9.68 3.7 9.29C4.09 8.9 4.72 8.9 5.11 9.29L8 12.17L14.88 5.29C15.27 4.9 15.9 4.9 16.29 5.29C16.68 5.68 16.68 6.31 16.29 6.7L8.7 14.29C8.32 14.68 7.68 14.68 7.29 14.29Z", "fill", "currentColor"], ["d", "M10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM14.3 14.3C13.91 14.69 13.28 14.69 12.89 14.3L10 11.41L7.11 14.3C6.72 14.69 6.09 14.69 5.7 14.3C5.31 13.91 5.31 13.28 5.7 12.89L8.59 10L5.7 7.11C5.31 6.72 5.31 6.09 5.7 5.7C6.09 5.31 6.72 5.31 7.11 5.7L10 8.59L12.89 5.7C13.28 5.31 13.91 5.31 14.3 5.7C14.69 6.09 14.69 6.72 14.3 7.11L11.41 10L14.3 12.89C14.68 13.27 14.68 13.91 14.3 14.3Z", "fill", "currentColor"]],
    template: function WelcomeFindImportClaimComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](0, WelcomeFindImportClaimComponent_div_0_Template, 97, 59, "div", 1);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_material_button__WEBPACK_IMPORTED_MODULE_5__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_5__.MatButton, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_6__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_6__.MatProgressSpinner, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.CheckboxControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.MinLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormControlName, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_7__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_7__.TranslocoDirective, _angular_common__WEBPACK_IMPORTED_MODULE_3__.LowerCasePipe, app_pipes_zelf_name_pipe__WEBPACK_IMPORTED_MODULE_9__.ZelfNamePipe],
    styles: ["[_ngcontent-%COMP%]:root {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc);\n}\n\n.zelf-button-external-link[_ngcontent-%COMP%] {\n  display: block;\n}\n.zelf-button-external-link--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.zelf-button[_ngcontent-%COMP%] {\n  align-items: center;\n  border-radius: 16px;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  gap: 8px;\n  height: 56px;\n  justify-content: center;\n  outline: none;\n  padding: 8px 24px;\n  text-align: center;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.zelf-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-button[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: inherit;\n}\n.zelf-button__text--margin-right[_ngcontent-%COMP%] {\n  margin-right: 1rem;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-button--thin[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  padding: 12px 16px;\n}\n.zelf-button--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.zelf-button--wide.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-button--primary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button, #181818) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--primary[_ngcontent-%COMP%]:active {\n  --mdc-filled-button-container-color: var(--zns-theme-text-muted, #96939e) !important;\n  background-color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-hover, #ff5721) !important;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff) !important;\n  stroke: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-text-secondary, #73777f) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-text-secondary, #73777f) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--secondary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-button-secondary-text, #495057) !important;\n  background-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  color: var(--zns-theme-button-secondary-text, #495057) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-secondary-text, #495057);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus, .zelf-button--secondary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-border, #e3e3e3) !important;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]:focus, .zelf-button--tertiary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%] {\n  --mdc-outlined-button-label-text-color: var(--zns-theme-button, #181818) !important;\n  --mdc-outlined-button-outline-color: var(--zns-theme-border, #e3e3e3) !important;\n  border: 1px solid var(--zns-theme-button, #181818) !important;\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-button, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button, #181818);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus, .zelf-button--outlined[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--outlined[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--outlined[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%] {\n  border: none !important;\n  background-color: transparent !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--red[_ngcontent-%COMP%]:focus, .zelf-button--red[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n}\n.zelf-button--red[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e);\n}\n.zelf-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n}\n\n.zelf-icon-button[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  align-items: center;\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  border-radius: 56px;\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  font-weight: 600;\n  gap: 16px;\n  height: 56px;\n  justify-content: center;\n  min-height: 56px;\n  min-width: 56px;\n  outline: none;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  -webkit-user-select: none;\n          user-select: none;\n  width: 56px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-icon-button.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: var(--zns-theme-text, #181818);\n  height: 24px;\n  width: 24px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%] {\n  height: 40px;\n  min-height: 40px;\n  min-width: 40px;\n  width: 40px;\n  border-radius: 40px;\n  padding: 0 8px;\n}\n.zelf-icon-button--40.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 14px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  height: 20px;\n  width: 20px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e) !important;\n  stroke: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:active {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus, .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%] {\n  background-color: transparent !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]:focus, .zelf-icon-button--transparent[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--text[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: initial !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  height: auto;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n  width: auto;\n}\n\n.zelf-icon-button-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:first-child {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:last-child {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.zelf-action-button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: 8px;\n}\n.zelf-action-button__icon[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  background: var(--zns-theme-card, #ffffff);\n  border-radius: 32px;\n  outline: 1px var(--zns-theme-border, #e3e3e3) solid;\n  outline-offset: -1px;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  cursor: pointer;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n@media (max-width: 600px) {\n  .zelf-action-button__icon[_ngcontent-%COMP%] {\n    padding: 8px 14px;\n  }\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-size: 24px;\n  line-height: 1;\n  font-variation-settings: \"FILL\" 0, \"wght\" 400, \"GRAD\" 0, \"opsz\" 24;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-primary, #181818);\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .zelf-action-button__text[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon-box[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  position: relative;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n}\n.zelf-action-button__text[_ngcontent-%COMP%] {\n  width: auto;\n  white-space: nowrap;\n  text-align: center;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 11px;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  line-height: 16px;\n  letter-spacing: 0.5px;\n  word-wrap: normal;\n}\n\n[_nghost-%COMP%] {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  justify-content: center;\n}\n\n.welcome-claim[_ngcontent-%COMP%] {\n  min-height: 75vh;\n  display: flex;\n  justify-content: flex-start;\n  overflow: hidden;\n}\n.welcome-claim__header-button[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n  flex-direction: row;\n  width: 100%;\n}\n.welcome-claim__content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  width: 100%;\n  position: relative;\n}\n.welcome-claim__step[_ngcontent-%COMP%] {\n  display: none;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-between;\n  flex-grow: 1;\n  opacity: 0;\n  width: 100%;\n}\n.welcome-claim__step--active[_ngcontent-%COMP%] {\n  display: flex;\n  opacity: 1;\n  animation: _ngcontent-%COMP%_stepFadeIn 0.35s cubic-bezier(0.25, 0.4, 0.7, 1) forwards;\n}\n.welcome-claim__step--exit[_ngcontent-%COMP%] {\n  display: none;\n}\n.welcome-claim__step--enter[_ngcontent-%COMP%] {\n  display: flex;\n  animation: _ngcontent-%COMP%_stepSlideUp 0.4s cubic-bezier(0.25, 0.4, 0.7, 1) forwards;\n}\n.welcome-claim__name-cards[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  padding: calc(8px * var(--zns-space-scale, 1)) calc(4px * var(--zns-space-scale, 1));\n  margin-bottom: calc(8px * var(--zns-space-scale, 1));\n}\n.welcome-claim__heading[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  width: 100%;\n  gap: calc(8px * var(--zns-space-scale, 1));\n}\n.welcome-claim__title[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: calc(8px * var(--zns-space-scale, 1));\n}\n.welcome-claim__subtitle[_ngcontent-%COMP%] {\n  text-align: center;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 500;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  margin-bottom: 0;\n}\n.welcome-claim__form[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: calc(16px * var(--zns-space-scale, 1));\n}\n.welcome-claim__input[_ngcontent-%COMP%] {\n  width: 100%;\n  transition: border-color 300ms ease-in-out, box-shadow 300ms ease-in-out;\n}\n.welcome-claim__input--available[_ngcontent-%COMP%] {\n  border-color: var(--zns-theme-success, #1ea446) !important;\n  box-shadow: 0 0 0 1px var(--zns-theme-success, #1ea446);\n}\n.welcome-claim__input--taken[_ngcontent-%COMP%] {\n  border-color: var(--zns-theme-error, #dc362e) !important;\n  box-shadow: 0 0 0 1px var(--zns-theme-error, #dc362e);\n}\n.welcome-claim__input-control[_ngcontent-%COMP%] {\n  flex: 1 1 0;\n  min-width: 0;\n}\n.welcome-claim__status[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  justify-content: flex-start;\n  animation: _ngcontent-%COMP%_fadeInUp 300ms ease-out;\n}\n.welcome-claim__status-chip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: calc(6px * var(--zns-space-scale, 1));\n  padding: calc(6px * var(--zns-space-scale, 1)) calc(12px * var(--zns-space-scale, 1));\n  border-radius: 20px;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  line-height: calc(16px * var(--zns-font-scale, 1));\n}\n.welcome-claim__status-chip--available[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed);\n  color: var(--zns-theme-success, #1ea446);\n}\n.welcome-claim__status-chip--taken[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee);\n  color: var(--zns-theme-error, #dc362e);\n}\n.welcome-claim__continue[_ngcontent-%COMP%] {\n  margin-top: calc(8px * var(--zns-space-scale, 1));\n}\n.welcome-claim__step-2[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.welcome-claim__identity[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  padding: calc(32px * var(--zns-space-scale, 1)) 0 calc(24px * var(--zns-space-scale, 1));\n  justify-content: center;\n}\n.welcome-claim__divider[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 1px;\n  background-color: var(--zns-theme-card-border, #eeedf1);\n  flex-shrink: 0;\n}\n.welcome-claim__confirm-form[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding-top: calc(16px * var(--zns-space-scale, 1));\n}\n.welcome-claim__buttons[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  width: 100%;\n  padding-bottom: calc(8px * var(--zns-space-scale, 1));\n}\n.welcome-claim__buttons[_ngcontent-%COMP%]     .zelf-button--primary[disabled] {\n  opacity: 1 !important;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.welcome-claim__buttons[_ngcontent-%COMP%]     .zelf-button--outlined[disabled] {\n  opacity: 1 !important;\n  border-color: var(--zns-theme-border, #e3e3e3) !important;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n  background-color: transparent !important;\n}\n.welcome-claim__referral[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  box-sizing: border-box;\n}\n\n.welcome-find-claim__step-pill[_ngcontent-%COMP%] {\n  margin-bottom: calc(4px * var(--zns-space-scale, 1));\n}\n\n\n\n[_nghost-%COMP%]     .zelf-input__postfix--dropdown {\n  min-width: calc(100px * var(--zns-space-scale, 1));\n  padding: calc(6px * var(--zns-space-scale, 1)) calc(6px * var(--zns-space-scale, 1)) calc(6px * var(--zns-space-scale, 1)) calc(14px * var(--zns-space-scale, 1));\n  background: #4277ff; \n\n  border-radius: 32px;\n  display: inline-flex;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n}\n\n.domain-display[_ngcontent-%COMP%] {\n  background: transparent;\n  color: #ffffff;\n  border: none;\n  outline: none;\n  font-family: var(--zns-theme-title-family, \"Menda\", \"Arial Black\", sans-serif), inherit;\n  font-weight: 800;\n  font-size: 14px;\n  line-height: 16px;\n  letter-spacing: 0.5px;\n  text-transform: uppercase;\n  cursor: pointer;\n  min-width: 40px;\n  padding: 0;\n  margin: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.dropdown-icon-container[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 24px;\n  height: 24px;\n  cursor: pointer;\n  transition: transform 150ms ease-in-out;\n}\n.dropdown-icon-container[_ngcontent-%COMP%]:hover {\n  transform: scale(1.05);\n}\n.dropdown-icon-container[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n  fill: #4277ff !important;\n}\n.dropdown-icon-container[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  opacity: 0.5;\n}\n\n.search-button-container[_ngcontent-%COMP%] {\n  background: rgba(0, 0, 0, 0.15);\n  border: none;\n  outline: none;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 32px;\n  height: 32px;\n  cursor: pointer;\n  padding: 0;\n  transition: background-color 150ms ease-in-out;\n}\n.search-button-container[_ngcontent-%COMP%]:hover:not([disabled]) {\n  background: rgba(0, 0, 0, 0.25);\n}\n.search-button-container[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n}\n.search-button-container[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n  fill: #ffffff !important;\n}\n.search-button-container[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  opacity: 0.5;\n}\n\n@keyframes _ngcontent-%COMP%_fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(8px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_stepFadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_stepSlideUp {\n  from {\n    opacity: 0;\n    transform: translateY(24px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.name-cards__grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  width: 100%;\n}\n\n.name-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  padding: calc(12px * var(--zns-space-scale, 1)) calc(14px * var(--zns-space-scale, 1));\n  background: var(--zns-theme-card, #ffffff);\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: calc(12px * var(--zns-space-scale, 1));\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n  will-change: transform;\n}\n.name-card__avatar[_ngcontent-%COMP%] {\n  width: calc(40px * var(--zns-space-scale, 1));\n  height: calc(40px * var(--zns-space-scale, 1));\n  min-width: calc(40px * var(--zns-space-scale, 1));\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 700;\n  font-size: calc(15px * var(--zns-font-scale, 1));\n}\n.name-card__avatar--orange[_ngcontent-%COMP%] {\n  background-color: #f97316;\n  color: #fff;\n}\n.name-card__avatar--white[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-background, #ffffff);\n  color: var(--zns-theme-text-secondary, #73777f);\n  border: 1px dashed var(--zns-theme-text-muted, #96939e);\n}\n.name-card__info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n  min-width: 0;\n}\n.name-card__name[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 700;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(18px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-text, #181818);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.name-card__status[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 500;\n  font-size: calc(11px * var(--zns-font-scale, 1));\n  line-height: calc(16px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-text-secondary, #73777f);\n}\n.name-card__status--active[_ngcontent-%COMP%] {\n  color: var(--zns-theme-success, #1ea446);\n  font-weight: 600;\n}\n.name-card--active[_ngcontent-%COMP%] {\n  border: 1.5px dashed #f97316;\n  background: rgba(249, 115, 22, 0.04);\n}\n.name-card--float-1[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_floatCard1 4s ease-in-out infinite;\n}\n.name-card--float-2[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_floatCard2 5s ease-in-out infinite;\n}\n.name-card--float-3[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_floatCard3 4.5s ease-in-out 0.5s infinite;\n}\n.name-card--float-4[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_floatCard4 5.5s ease-in-out 1s infinite;\n}\n.name-card--float-5[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_floatCard5 6s ease-in-out 0.3s infinite;\n}\n\n@keyframes _ngcontent-%COMP%_floatCard1 {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-4px);\n  }\n}\n@keyframes _ngcontent-%COMP%_floatCard2 {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-6px);\n  }\n}\n@keyframes _ngcontent-%COMP%_floatCard3 {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-3px);\n  }\n}\n@keyframes _ngcontent-%COMP%_floatCard4 {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-5px);\n  }\n}\n@keyframes _ngcontent-%COMP%_floatCard5 {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-4px);\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX2J1dHRvbnMuc2NzcyIsIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX3ZhcmlhYmxlcy5zY3NzIiwid2VicGFjazovLy4vc3JjL2FwcC93ZWxjb21lLWZpbmQtaW1wb3J0LWNsYWltL3dlbGNvbWUtZmluZC1pbXBvcnQtY2xhaW0uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxnRUMwQnVCO0FDM0IzQjs7QUZJQTtFQUNJLGNBQUE7QUVESjtBRkdJO0VBQ0ksV0FBQTtBRURSOztBRktBO0VBQ0ksbUJBQUE7RUFDQSxtQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLHVFQ0ljO0VESGQsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsUUFBQTtFQUNBLFlBQUE7RUFDQSx1QkFBQTtFQUNBLGFBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7VUFBQSxpQkFBQTtBRUZKO0FGSUk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLFFBQUE7QUVGUjtBRktJO0VBQ0ksU0FBQTtFQUNBLGNBQUE7QUVIUjtBRk9RO0VBQ0ksa0JBQUE7QUVMWjtBRlNJO0VBQ0ksNkJBQUE7RUFDQSwrQ0NsQmE7RURtQmIsZUFBQTtFQUNBLGdCQUFBO0VBQ0EscUJBQUE7RUFDQSxpQkFBQTtFQUNBLDZHQUNJO0FFUlo7QUZXUTtFQUNJLGVBQUE7QUVUWjtBRllRO0VBQ0ksOENDaENTO0FDc0JyQjtBRmFRO0VBQ0kscUNDdENBO0VEdUNBLGtEQ3hCRTtBQ2FkO0FGYVk7RUFDSSxvQ0MxQ0o7QUMrQlo7QUZlUTtFQUNJLG1CQUFBO0VBQ0Esc0RBQUE7QUViWjtBRmVZO0VBQ0ksMENDbERDO0FDcUNqQjtBRmtCSTtFQUNJLGtCQUFBO0VBQ0Esa0JBQUE7QUVoQlI7QUZtQkk7RUFDSSxXQUFBO0FFakJSO0FGbUJRO0VBQ0ksbUJBQUE7QUVqQlo7QUZxQkk7RUFF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QTtFQTJiTjtBQUNGO0FBeGJBO0VBQ0k7SUFFSSx3QkFBQTtFQXliTjtFQXZiRTtJQUNJLDJCQUFBO0VBeWJOO0FBQ0Y7QUF0YkE7RUFDSTtJQUVJLHdCQUFBO0VBdWJOO0VBcmJFO0lBQ0ksMkJBQUE7RUF1Yk47QUFDRjtBQXBiQTtFQUNJO0lBRUksd0JBQUE7RUFxYk47RUFuYkU7SUFDSSwyQkFBQTtFQXFiTjtBQUNGO0FBbGJBO0VBQ0k7SUFFSSx3QkFBQTtFQW1iTjtFQWpiRTtJQUNJLDJCQUFBO0VBbWJOO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwiLi92YXJpYWJsZXNcIjtcblxuOnJvb3Qge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5O1xufVxuXG4uemVsZi1idXR0b24tZXh0ZXJuYWwtbGluayB7XG4gICAgZGlzcGxheTogYmxvY2s7XG5cbiAgICAmLS13aWRlIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxufVxuXG4uemVsZi1idXR0b24ge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIGdhcDogOHB4O1xuICAgIGhlaWdodDogNTZweDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBvdXRsaW5lOiBub25lO1xuICAgIHBhZGRpbmc6IDhweCAyNHB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcblxuICAgIHNwYW4ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgfVxuXG4gICAgcCB7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgY29sb3I6IGluaGVyaXQ7XG4gICAgfVxuXG4gICAgJl9fdGV4dCB7XG4gICAgICAgICYtLW1hcmdpbi1yaWdodCB7XG4gICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDFyZW07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1oeXBlcmxpbmsge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICAgICAgcGFkZGluZzogOHB4IDE2cHg7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICYtLXNtYWxsIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10aGluIHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICBwYWRkaW5nOiAxMnB4IDE2cHg7XG4gICAgfVxuXG4gICAgJi0td2lkZSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgICAgICYuemVsZi1idXR0b24tLWh5cGVybGluayB7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tcHJpbWFyeSB7XG4gICAgICAgIC8vIE1EQyBtYXQtZmxhdC1idXR0b24gcGFpbnRzIHZpYSBDU1MgdmFyaWFibGVzOyBhbGlnbiB3aXRoIFplbGYgdG9rZW5zIChhdm9pZHMgZGVmYXVsdCBNYXRlcmlhbCBibHVlKS5cbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvbn0gIWltcG9ydGFudDtcbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVDYXJkfSAhaW1wb3J0YW50O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6YWN0aXZlIHtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWR9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3Zlcn0gIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICB9XG5cbiAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnl9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWxhYmVsLXRleHQtY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUNhcmR9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zZWNvbmRhcnkge1xuICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5fSAhaW1wb3J0YW50O1xuICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWxhYmVsLXRleHQtY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeVRleHR9ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5SG92ZXJ9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWxhYmVsLXRleHQtY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUNhcmR9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5SG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQm9yZGVyfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlciAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXRlcnRpYXJ5IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1vdXRsaW5lZCB7XG4gICAgICAgIC0tbWRjLW91dGxpbmVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b259ICFpbXBvcnRhbnQ7XG4gICAgICAgIC0tbWRjLW91dGxpbmVkLWJ1dHRvbi1vdXRsaW5lLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCb3JkZXJ9ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUJ1dHRvbiAhaW1wb3J0YW50O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbiAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbjtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbkhvdmVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXJlZCB7XG4gICAgICAgIGJvcmRlcjogbm9uZSAhaW1wb3J0YW50O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kZXJyb3JMaWdodCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1lcnJvciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kZXJyb3JMaWdodCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGVycm9yICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zdWNjZXNzIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRjb3JyZWN0TGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXBpbGwge1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDA7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgcGFkZGluZzogNHB4IDEycHg7XG4gICAgfVxufVxuXG4uemVsZi1pY29uLWJ1dHRvbiB7XG4gICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXIgIWltcG9ydGFudDtcbiAgICBib3JkZXItcmFkaXVzOiA1NnB4O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICBnYXA6IDE2cHg7XG4gICAgaGVpZ2h0OiA1NnB4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG1pbi1oZWlnaHQ6IDU2cHg7XG4gICAgbWluLXdpZHRoOiA1NnB4O1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgdHJhbnNpdGlvbjpcbiAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgIHdpZHRoOiA1NnB4O1xuXG4gICAgc3BhbiB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICB9XG5cbiAgICAmLnplbGYtaWNvbi1idXR0b24tLWJvcmRlci1zb2Z0IHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICB9XG5cbiAgICBzdmcge1xuICAgICAgICB0cmFuc2l0aW9uOiBmaWxsIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBoZWlnaHQ6IDI0cHg7XG4gICAgICAgIHdpZHRoOiAyNHB4O1xuICAgIH1cblxuICAgICY6aG92ZXIge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHNlY29uZGFyeUNvbG9yICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1ib3JkZXItc29mdCB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgfVxuXG4gICAgJi0tNDAge1xuICAgICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDQwcHg7XG4gICAgICAgIG1pbi13aWR0aDogNDBweDtcbiAgICAgICAgd2lkdGg6IDQwcHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDQwcHg7XG4gICAgICAgIHBhZGRpbmc6IDAgOHB4O1xuXG4gICAgICAgICYuemVsZi1pY29uLWJ1dHRvbi0tYm9yZGVyLXNvZnQge1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTRweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBoZWlnaHQ6IDIwcHg7XG4gICAgICAgICAgICB3aWR0aDogMjBweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWh5cGVybGluayB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBwYWRkaW5nOiA4cHggMTZweDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuMnMgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJi0tc21hbGwge1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1wcmltYXJ5IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbiAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjphY3RpdmUge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbkhvdmVyICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbkhvdmVyICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zZWNvbmRhcnkge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlciAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHNlY29uZGFyeUNvbG9yICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlciAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXRyYW5zcGFyZW50IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXRleHQge1xuICAgICAgICB3aWR0aDogYXV0byAhaW1wb3J0YW50O1xuICAgICAgICBtaW4td2lkdGg6IGluaXRpYWwgIWltcG9ydGFudDtcbiAgICB9XG5cbiAgICAmLS1lcnJvciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kZXJyb3JMaWdodCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGVycm9yICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zdWNjZXNzIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRjb3JyZWN0TGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXBpbGwge1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIGhlaWdodDogYXV0bztcbiAgICAgICAgbWluLWhlaWdodDogMDtcbiAgICAgICAgbWluLXdpZHRoOiAwO1xuICAgICAgICBwYWRkaW5nOiA0cHggMTJweDtcbiAgICAgICAgd2lkdGg6IGF1dG87XG4gICAgfVxufVxuXG4uemVsZi1pY29uLWJ1dHRvbi1ncm91cCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogMDtcblxuICAgIC56ZWxmLWljb24tYnV0dG9uIHtcbiAgICAgICAgJjpmaXJzdC1jaGlsZCB7XG4gICAgICAgICAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMDtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpub3QoOmZpcnN0LWNoaWxkKTpub3QoOmxhc3QtY2hpbGQpIHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDA7XG4gICAgICAgIH1cblxuICAgICAgICAmOmxhc3QtY2hpbGQge1xuICAgICAgICAgICAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogMDtcbiAgICAgICAgICAgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDA7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi56ZWxmLWFjdGlvbi1idXR0b24ge1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiA4cHg7XG5cbiAgICAmX19pY29uIHtcbiAgICAgICAgcGFkZGluZzogMTBweCAyMHB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMzJweDtcbiAgICAgICAgb3V0bGluZTogMXB4IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgc29saWQ7XG4gICAgICAgIG91dGxpbmUtb2Zmc2V0OiAtMXB4O1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogOHB4O1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIEBtZWRpYSAobWF4LXdpZHRoOiB2YXJpYWJsZXMuJG1pblNtYWxsKSB7XG4gICAgICAgICAgICBwYWRkaW5nOiA4cHggMTRweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGZpbGwgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC5tYXRlcmlhbC1zeW1ib2xzLW91dGxpbmVkIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMjRweDtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgICAgICAgICAgZm9udC12YXJpYXRpb24tc2V0dGluZ3M6XG4gICAgICAgICAgICAgICAgXCJGSUxMXCIgMCxcbiAgICAgICAgICAgICAgICBcIndnaHRcIiA0MDAsXG4gICAgICAgICAgICAgICAgXCJHUkFEXCIgMCxcbiAgICAgICAgICAgICAgICBcIm9wc3pcIiAyNDtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kcHJpbWFyeUNvbG9yO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAubWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAuemVsZi1hY3Rpb24tYnV0dG9uX190ZXh0IHtcbiAgICAgICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19pY29uLWJveCB7XG4gICAgICAgIHdpZHRoOiAyOHB4O1xuICAgICAgICBoZWlnaHQ6IDI4cHg7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIH1cblxuICAgICZfX3RleHQge1xuICAgICAgICB3aWR0aDogYXV0bztcbiAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBsaW5lLWhlaWdodDogMTZweDtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgICAgICB3b3JkLXdyYXA6IG5vcm1hbDtcbiAgICB9XG59XG4iLCIkcHJpbWFyeUNvbG9yOiB2YXIoLS16bnMtdGhlbWUtcHJpbWFyeSwgIzE4MTgxOCk7XG4kcHJpbWFyeUxpZ2h0OiAjZGFkZGZhO1xuJHNlY29uZGFyeUNvbG9yOiB2YXIoLS16bnMtdGhlbWUtc2Vjb25kYXJ5LCAjZmY1NzIxKTtcbiRzZWNvbmRhcnlDb2xvckxpZ2h0OiAjZjZlNWUwO1xuXG4kY29ycmVjdDogdmFyKC0tem5zLXRoZW1lLXN1Y2Nlc3MsICMxZWE0NDYpO1xuJGNvcnJlY3REYXJrOiAjMGY1MjIzO1xuJGNvcnJlY3RMaWdodDogdmFyKC0tem5zLXRoZW1lLXN1Y2Nlc3MtdGV4dCwgI2U3ZjhlZCk7XG5cbiRlcnJvcjogdmFyKC0tem5zLXRoZW1lLWVycm9yLCAjZGMzNjJlKTtcbiRlcnJvckRhcms6ICM2MDE0MTA7XG4kZXJyb3JMaWdodDogdmFyKC0tem5zLXRoZW1lLWVycm9yLXRleHQsICNmY2VlZWUpO1xuXG4kd2FybmluZzogdmFyKC0tem5zLXRoZW1lLXdhcm5pbmcsICNkZTY4MDApO1xuJHdhcm5pbmdEYXJrOiAjNGEyMTBhO1xuJHdhcm5pbmdMaWdodDogdmFyKC0tem5zLXRoZW1lLXdhcm5pbmctdGV4dCwgI2ZmZWVlOSk7XG5cbiRpbmZvOiAjMzk5OGQzO1xuJGluZm9EYXJrOiAjMDA0YTc3O1xuJGluZm9MaWdodDogI2VjZjNmZTtcblxuJGJsYWNrOiAjMTgxODE4O1xuJHdoaXRlOiAjZmZmZmZmO1xuXG4kdGhlbWVCb2R5RmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtYm9keS1mYW1pbHksIFwiUG9wcGluc1wiLCBBcmlhbCwgc2Fucy1zZXJpZik7XG4kdGhlbWVUaXRsZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLXRpdGxlLWZhbWlseSwgXCJNZW5kYVwiLCBcIkFyaWFsIEJsYWNrXCIsIHNhbnMtc2VyaWYpO1xuJHRoZW1lTW9ub3NwYWNlRmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtbW9ub3NwYWNlLWZhbWlseSwgXCJDb3VyaWVyIE5ld1wiLCBDb3VyaWVyLCBtb25vc3BhY2UpO1xuXG4kdGhlbWVCYWNrZ3JvdW5kOiB2YXIoLS16bnMtdGhlbWUtYmFja2dyb3VuZCwgI2ZmZmZmZik7XG4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtYmFja2dyb3VuZC1zZWNvbmRhcnksICNmOWY5ZmMpO1xuXG4kdGhlbWVUZXh0OiB2YXIoLS16bnMtdGhlbWUtdGV4dCwgIzE4MTgxOCk7XG4kdGhlbWVUZXh0TXV0ZWQ6IHZhcigtLXpucy10aGVtZS10ZXh0LW11dGVkLCAjOTY5MzllKTtcbiR0aGVtZVRleHRTZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS10ZXh0LXNlY29uZGFyeSwgIzczNzc3Zik7XG5cbiR0aGVtZUhlYWRlcjogdmFyKC0tem5zLXRoZW1lLWhlYWRlciwgIzE4MTgxOCk7XG4kdGhlbWVIZWFkZXJUZXh0OiB2YXIoLS16bnMtdGhlbWUtaGVhZGVyLXRleHQsICNmZmZmZmYpO1xuXG4kdGhlbWVCdXR0b246IHZhcigtLXpucy10aGVtZS1idXR0b24sICMxODE4MTgpO1xuJHRoZW1lQnV0dG9uVGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi10ZXh0LCAjZmZmZmZmKTtcbiR0aGVtZUJ1dHRvbkhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLWhvdmVyLCAjZmY1NzIxKTtcblxuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeSwgI2U5ZWNlZik7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeS10ZXh0LCAjNDk1MDU3KTtcbiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeS1ob3ZlciwgI2U5ZWNlZik7XG5cbiR0aGVtZUJvcmRlcjogdmFyKC0tem5zLXRoZW1lLWJvcmRlciwgI2UzZTNlMyk7XG4kdGhlbWVCb3JkZXJIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJvcmRlci1ob3ZlciwgI2MzYzZjZik7XG5cbiR0aGVtZUNhcmQ6IHZhcigtLXpucy10aGVtZS1jYXJkLCAjZmZmZmZmKTtcbiR0aGVtZUNhcmRCb3JkZXI6IHZhcigtLXpucy10aGVtZS1jYXJkLWJvcmRlciwgI2VlZWRmMSk7XG5cbiR0aGVtZVNoYWRvdzogdmFyKC0tem5zLXRoZW1lLXNoYWRvdywgcmdiYSgwLCAwLCAwLCAwLjEpKTtcblxuJHNtb290aEJlemllcjogY3ViaWMtYmV6aWVyKDAuMjUsIDAuNCwgMC43LCAxKTtcblxuJG1heEV4dHJhU21hbGw6IDU5NXB4O1xuJG1pblNtYWxsOiA2MDBweDtcbiRtZWRpdW06IDc2OHB4O1xuJGxhcmdlOiA4ODlweDtcbiRjb21wdXRlcnM6IDEyMDBweDtcbiIsIkB1c2UgXCIuLi8uLi9zdHlsZXMvdmFyaWFibGVzXCI7XG5AdXNlIFwiLi4vLi4vc3R5bGVzL2J1dHRvbnNcIjtcblxuOmhvc3Qge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGZsZXgtZ3JvdzogMTtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuLndlbGNvbWUtY2xhaW0ge1xuICAgIG1pbi1oZWlnaHQ6IDc1dmg7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcblxuICAgICZfX2hlYWRlci1idXR0b24ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgICZfX2NvbnRlbnQge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBmbGV4LWdyb3c6IDE7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgfVxuXG4gICAgLy8gLS0tIFN0ZXAgdHJhbnNpdGlvbiBzeXN0ZW0gLS0tXG4gICAgJl9fc3RlcCB7XG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjsgLy8gU3BhY2VzIGl0ZW1zIGV2ZW5seVxuICAgICAgICBmbGV4LWdyb3c6IDE7XG4gICAgICAgIG9wYWNpdHk6IDA7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgICAgICYtLWFjdGl2ZSB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgb3BhY2l0eTogMTtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogc3RlcEZhZGVJbiAwLjM1cyBjdWJpYy1iZXppZXIoMC4yNSwgMC40LCAwLjcsIDEpIGZvcndhcmRzO1xuICAgICAgICB9XG5cbiAgICAgICAgJi0tZXhpdCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICB9XG5cbiAgICAgICAgJi0tZW50ZXIge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogc3RlcFNsaWRlVXAgMC40cyBjdWJpYy1iZXppZXIoMC4yNSwgMC40LCAwLjcsIDEpIGZvcndhcmRzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gLS0tIEZsb2F0aW5nIE5hbWUgQ2FyZHMgLS0tXG4gICAgJl9fbmFtZS1jYXJkcyB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHBhZGRpbmc6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSkgY2FsYyg0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAvLyAtLS0gU3RlcCAxOiBTZWFyY2ggLS0tXG4gICAgJl9faGVhZGluZyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgfVxuXG4gICAgJl9fdGl0bGUge1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgfVxuXG4gICAgJl9fc3VidGl0bGUge1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDIwcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4xcHg7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDA7IC8vIFJlbW92ZWQgYm90dG9tIG1hcmdpbiB0byBhbGxvdyBzcGFjZS1iZXR3ZWVuIHRvIGhhbmRsZSBzcGFjaW5nXG4gICAgfVxuXG4gICAgJl9fZm9ybSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IGNhbGMoMTZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX2lucHV0IHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBib3JkZXItY29sb3IgMzAwbXMgZWFzZS1pbi1vdXQsXG4gICAgICAgICAgICBib3gtc2hhZG93IDMwMG1zIGVhc2UtaW4tb3V0O1xuXG4gICAgICAgICYtLWF2YWlsYWJsZSB7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm94LXNoYWRvdzogMCAwIDAgMXB4IHZhcmlhYmxlcy4kY29ycmVjdDtcbiAgICAgICAgfVxuXG4gICAgICAgICYtLXRha2VuIHtcbiAgICAgICAgICAgIGJvcmRlci1jb2xvcjogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm94LXNoYWRvdzogMCAwIDAgMXB4IHZhcmlhYmxlcy4kZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19pbnB1dC1jb250cm9sIHtcbiAgICAgICAgZmxleDogMSAxIDA7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICB9XG5cbiAgICAmX19zdGF0dXMge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgICAgICBhbmltYXRpb246IGZhZGVJblVwIDMwMG1zIGVhc2Utb3V0O1xuICAgIH1cblxuICAgICZfX3N0YXR1cy1jaGlwIHtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogY2FsYyg2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgcGFkZGluZzogY2FsYyg2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMjBweDtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTJweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDE2cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuXG4gICAgICAgICYtLWF2YWlsYWJsZSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3RMaWdodDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3Q7XG4gICAgICAgIH1cblxuICAgICAgICAmLS10YWtlbiB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2NvbnRpbnVlIHtcbiAgICAgICAgbWFyZ2luLXRvcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAvLyAtLS0gU3RlcCAyOiBDb25maXJtIC0tLVxuICAgICZfX3N0ZXAtMiB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgICZfX2lkZW50aXR5IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDMycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSAwIGNhbGMoMjRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX19kaXZpZGVyIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGhlaWdodDogMXB4O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICAgICAgZmxleC1zaHJpbms6IDA7XG4gICAgfVxuXG4gICAgJl9fY29uZmlybS1mb3JtIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIHBhZGRpbmctdG9wOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19idXR0b25zIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgcGFkZGluZy1ib3R0b206IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG5cbiAgICAgICAgOjpuZy1kZWVwIC56ZWxmLWJ1dHRvbi0tcHJpbWFyeVtkaXNhYmxlZF0ge1xuICAgICAgICAgICAgb3BhY2l0eTogMSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICA6Om5nLWRlZXAgLnplbGYtYnV0dG9uLS1vdXRsaW5lZFtkaXNhYmxlZF0ge1xuICAgICAgICAgICAgb3BhY2l0eTogMSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3JlZmVycmFsIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgfVxufVxuXG4ud2VsY29tZS1maW5kLWNsYWltIHtcbiAgICAmX19zdGVwLXBpbGwge1xuICAgICAgICBtYXJnaW4tYm90dG9tOiBjYWxjKDRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cbn1cblxuLyogRG9tYWluIGRpc3BsYXkgc3R5bGluZyAqL1xuOmhvc3QgOjpuZy1kZWVwIC56ZWxmLWlucHV0X19wb3N0Zml4LS1kcm9wZG93biB7XG4gICAgbWluLXdpZHRoOiBjYWxjKDEwMHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgcGFkZGluZzogY2FsYyg2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBjYWxjKDZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpIGNhbGMoNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSlcbiAgICAgICAgY2FsYygxNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgYmFja2dyb3VuZDogIzQyNzdmZjsgLyogQmx1ZSBwaWxsIGZyb20gc2NyZWVuc2hvdCAqL1xuICAgIGJvcmRlci1yYWRpdXM6IDMycHg7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG59XG5cbi5kb21haW4tZGlzcGxheSB7XG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgY29sb3I6ICNmZmZmZmY7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVUaXRsZUZhbWlseSwgaW5oZXJpdDtcbiAgICBmb250LXdlaWdodDogODAwO1xuICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICBsaW5lLWhlaWdodDogMTZweDtcbiAgICBsZXR0ZXItc3BhY2luZzogMC41cHg7XG4gICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgbWluLXdpZHRoOiA0MHB4O1xuICAgIHBhZGRpbmc6IDA7XG4gICAgbWFyZ2luOiAwO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuLmRyb3Bkb3duLWljb24tY29udGFpbmVyIHtcbiAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgd2lkdGg6IDI0cHg7XG4gICAgaGVpZ2h0OiAyNHB4O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMTUwbXMgZWFzZS1pbi1vdXQ7XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxLjA1KTtcbiAgICB9XG5cbiAgICBzdmcgKiB7XG4gICAgICAgIGZpbGw6ICM0Mjc3ZmYgIWltcG9ydGFudDtcbiAgICB9XG5cbiAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgIG9wYWNpdHk6IDAuNTtcbiAgICB9XG59XG5cbi5zZWFyY2gtYnV0dG9uLWNvbnRhaW5lciB7XG4gICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjE1KTtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIHdpZHRoOiAzMnB4O1xuICAgIGhlaWdodDogMzJweDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgcGFkZGluZzogMDtcbiAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDE1MG1zIGVhc2UtaW4tb3V0O1xuXG4gICAgJjpob3Zlcjpub3QoW2Rpc2FibGVkXSkge1xuICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuMjUpO1xuICAgIH1cblxuICAgIHN2ZyB7XG4gICAgICAgIHdpZHRoOiAxOHB4O1xuICAgICAgICBoZWlnaHQ6IDE4cHg7XG4gICAgfVxuXG4gICAgc3ZnICoge1xuICAgICAgICBmaWxsOiAjZmZmZmZmICFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgJltkaXNhYmxlZF0ge1xuICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICBvcGFjaXR5OiAwLjU7XG4gICAgfVxufVxuXG4vLyAtLS0gQW5pbWF0aW9ucyAtLS1cbkBrZXlmcmFtZXMgZmFkZUluVXAge1xuICAgIGZyb20ge1xuICAgICAgICBvcGFjaXR5OiAwO1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoOHB4KTtcbiAgICB9XG4gICAgdG8ge1xuICAgICAgICBvcGFjaXR5OiAxO1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gICAgfVxufVxuXG5Aa2V5ZnJhbWVzIHN0ZXBGYWRlSW4ge1xuICAgIGZyb20ge1xuICAgICAgICBvcGFjaXR5OiAwO1xuICAgIH1cbiAgICB0byB7XG4gICAgICAgIG9wYWNpdHk6IDE7XG4gICAgfVxufVxuXG5Aa2V5ZnJhbWVzIHN0ZXBTbGlkZVVwIHtcbiAgICBmcm9tIHtcbiAgICAgICAgb3BhY2l0eTogMDtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDI0cHgpO1xuICAgIH1cbiAgICB0byB7XG4gICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgICB9XG59XG5cbi8vIC0tLSBOYW1lIENhcmRzIC0tLVxuLm5hbWUtY2FyZHNfX2dyaWQge1xuICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xuICAgIGdhcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB3aWR0aDogMTAwJTtcbn1cblxuLm5hbWUtY2FyZCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICBwYWRkaW5nOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBjYWxjKDE0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICBib3JkZXItcmFkaXVzOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICBib3gtc2hhZG93OiAwIDJweCA4cHggcmdiYSgwLCAwLCAwLCAwLjA0KTtcbiAgICB3aWxsLWNoYW5nZTogdHJhbnNmb3JtO1xuXG4gICAgJl9fYXZhdGFyIHtcbiAgICAgICAgd2lkdGg6IGNhbGMoNDBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBoZWlnaHQ6IGNhbGMoNDBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBtaW4td2lkdGg6IGNhbGMoNDBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNXB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcblxuICAgICAgICAmLS1vcmFuZ2Uge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2Y5NzMxNjtcbiAgICAgICAgICAgIGNvbG9yOiAjZmZmO1xuICAgICAgICB9XG5cbiAgICAgICAgJi0td2hpdGUge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBkYXNoZWQgdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2luZm8ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBnYXA6IDFweDtcbiAgICAgICAgbWluLXdpZHRoOiAwO1xuICAgIH1cblxuICAgICZfX25hbWUge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMThweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgfVxuXG4gICAgJl9fc3RhdHVzIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTFweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDE2cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG5cbiAgICAgICAgJi0tYWN0aXZlIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3Q7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWN0aXZlL1lvdXJzIGNhcmRcbiAgICAmLS1hY3RpdmUge1xuICAgICAgICBib3JkZXI6IDEuNXB4IGRhc2hlZCAjZjk3MzE2O1xuICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0OSwgMTE1LCAyMiwgMC4wNCk7XG4gICAgfVxuXG4gICAgLy8gRmxvYXQgYW5pbWF0aW9uc1xuICAgICYtLWZsb2F0LTEge1xuICAgICAgICBhbmltYXRpb246IGZsb2F0Q2FyZDEgNHMgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG4gICAgfVxuICAgICYtLWZsb2F0LTIge1xuICAgICAgICBhbmltYXRpb246IGZsb2F0Q2FyZDIgNXMgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG4gICAgfVxuICAgICYtLWZsb2F0LTMge1xuICAgICAgICBhbmltYXRpb246IGZsb2F0Q2FyZDMgNC41cyBlYXNlLWluLW91dCAwLjVzIGluZmluaXRlO1xuICAgIH1cbiAgICAmLS1mbG9hdC00IHtcbiAgICAgICAgYW5pbWF0aW9uOiBmbG9hdENhcmQ0IDUuNXMgZWFzZS1pbi1vdXQgMXMgaW5maW5pdGU7XG4gICAgfVxuICAgICYtLWZsb2F0LTUge1xuICAgICAgICBhbmltYXRpb246IGZsb2F0Q2FyZDUgNnMgZWFzZS1pbi1vdXQgMC4zcyBpbmZpbml0ZTtcbiAgICB9XG59XG5cbkBrZXlmcmFtZXMgZmxvYXRDYXJkMSB7XG4gICAgMCUsXG4gICAgMTAwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgICB9XG4gICAgNTAlIHtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00cHgpO1xuICAgIH1cbn1cblxuQGtleWZyYW1lcyBmbG9hdENhcmQyIHtcbiAgICAwJSxcbiAgICAxMDAlIHtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICAgIH1cbiAgICA1MCUge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTZweCk7XG4gICAgfVxufVxuXG5Aa2V5ZnJhbWVzIGZsb2F0Q2FyZDMge1xuICAgIDAlLFxuICAgIDEwMCUge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gICAgfVxuICAgIDUwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtM3B4KTtcbiAgICB9XG59XG5cbkBrZXlmcmFtZXMgZmxvYXRDYXJkNCB7XG4gICAgMCUsXG4gICAgMTAwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgICB9XG4gICAgNTAlIHtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01cHgpO1xuICAgIH1cbn1cblxuQGtleWZyYW1lcyBmbG9hdENhcmQ1IHtcbiAgICAwJSxcbiAgICAxMDAlIHtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICAgIH1cbiAgICA1MCUge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTRweCk7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }

}]);
//# sourceMappingURL=src_app_welcome-find-import-claim_welcome-find-import-claim_component_ts.js.map