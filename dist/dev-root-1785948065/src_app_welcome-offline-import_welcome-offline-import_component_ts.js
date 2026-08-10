"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_welcome-offline-import_welcome-offline-import_component_ts"],{

/***/ 72966
/*!****************************************************************************!*\
  !*** ./src/app/welcome-offline-import/welcome-offline-import.component.ts ***!
  \****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WelcomeOfflineImportComponent: () => (/* binding */ WelcomeOfflineImportComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/progress-spinner */ 41134);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 34487);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var app_welcome_available_welcome_available_content_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! app/welcome-available/welcome-available-content.component */ 85220);
/* harmony import */ var app_pipes_zelf_name_pipe__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! app/pipes/zelf-name.pipe */ 20655);
/* harmony import */ var app_tags_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! app/tags.service */ 73768);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var app_captcha_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! app/captcha.service */ 29569);
/* harmony import */ var app_chrome_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! app/chrome.service */ 85043);
/* harmony import */ var app_wallet_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! app/wallet.service */ 69556);
/* harmony import */ var app_zelf_name_service_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! app/zelf-name-service.service */ 56148);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/button */ 69885);





















const _c0 = () => ["../"];
const _c1 = (a0, a1) => ({
  "zelf-chip--info": a0,
  "zelf-chip--error": a1
});
const _c2 = (a0, a1, a2) => ({
  address: a0,
  label: a1,
  logo: "assets/networks/btc.png",
  value: a2
});
const _c3 = a0 => ({
  $implicit: a0
});
const _c4 = (a0, a1, a2) => ({
  address: a0,
  label: a1,
  logo: "assets/networks/eth.png",
  value: a2
});
const _c5 = (a0, a1, a2) => ({
  address: a0,
  label: a1,
  logo: "assets/networks/sol.svg",
  value: a2
});
const _c6 = a0 => ({
  date: a0
});
function WelcomeOfflineImportComponent_div_0_ng_container_5_ng_container_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "svg", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "path", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
  }
}
function WelcomeOfflineImportComponent_div_0_ng_container_5_mat_spinner_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](0, "mat-spinner", 20);
  }
}
function WelcomeOfflineImportComponent_div_0_ng_container_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "img", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "h1", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](5, "p", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](7, "form", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("ngSubmit", function WelcomeOfflineImportComponent_div_0_ng_container_5_Template_form_ngSubmit_7_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.searchZelfName($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](8, "div", 13)(9, "input", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("input", function WelcomeOfflineImportComponent_div_0_ng_container_5_Template_input_input_9_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.sanitizeZelfName());
    })("keydown.enter", function WelcomeOfflineImportComponent_div_0_ng_container_5_Template_input_keydown_enter_9_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.searchZelfName($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](10, "p", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](11, ".zelf");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](12, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](13, WelcomeOfflineImportComponent_div_0_ng_container_5_ng_container_13_Template, 3, 0, "ng-container", 7)(14, WelcomeOfflineImportComponent_div_0_ng_container_5_mat_spinner_14_Template, 1, 0, "mat-spinner", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r4("welcome.safeguard_your_crypto"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r4("welcome.offline_import_subtitle"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("formGroup", ctx_r1.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("placeholder", t_r4("common.search_your_zelf_name"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("disabled", ctx_r1.form.invalid || ctx_r1.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx_r1.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.loading);
  }
}
function WelcomeOfflineImportComponent_div_0_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "div", 21)(2, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "h2", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](6, "zelfName");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](7, "p", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](9, "form", 24)(10, "div", 25)(11, "welcome-available-content", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("clearInvalidReferralEvent", function WelcomeOfflineImportComponent_div_0_ng_container_6_Template_welcome_available_content_clearInvalidReferralEvent_11_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.clearInvalidReferral());
    })("sanitizeZelfNameEvent", function WelcomeOfflineImportComponent_div_0_ng_container_6_Template_welcome_available_content_sanitizeZelfNameEvent_11_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.sanitizeZelfName());
    })("searchZelfName", function WelcomeOfflineImportComponent_div_0_ng_container_6_Template_welcome_available_content_searchZelfName_11_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.searchReferralZelfName($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](12, "div", 27)(13, "label", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](14, "input", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](15, "svg", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](16, "polyline", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](17, "span", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](18, "button", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function WelcomeOfflineImportComponent_div_0_ng_container_6_Template_button_click_18_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.goToImport());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](19);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r4("common.available"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](6, 12, ctx_r1.zelfName));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", t_r4("welcome.you_will_register_this_domain"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("formGroup", ctx_r1.referralForm);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("form", ctx_r1.referralForm)("invalidReferral", ctx_r1.invalidReferral)("loading", ctx_r1.loading)("loadingReferral", ctx_r1.loadingReferral)("zelfNameObject", ctx_r1.zelfNameObject);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("innerHTML", t_r4("common.agree_to_terms_and_conditions"), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵsanitizeHtml"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("disabled", ctx_r1.referralForm.invalid || ctx_r1.loading || ctx_r1.loadingReferral);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", t_r4("common.import_a_wallet"), " ");
  }
}
function WelcomeOfflineImportComponent_div_0_ng_container_7_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "img", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("src", ctx_r1.qrCodeImage, _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵsanitizeUrl"]);
  }
}
function WelcomeOfflineImportComponent_div_0_ng_container_7_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r4("common.reservation_found"));
  }
}
function WelcomeOfflineImportComponent_div_0_ng_container_7_ng_container_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r4("common.registered"));
  }
}
function WelcomeOfflineImportComponent_div_0_ng_container_7_span_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", t_r4("welcome.registered", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction1"](4, _c6, _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind2"](2, 1, ctx_r1.zelfNameObject == null ? null : ctx_r1.zelfNameObject.publicData == null ? null : ctx_r1.zelfNameObject.publicData.registeredAt, "MMMM yyyy"))), " ");
  }
}
function WelcomeOfflineImportComponent_div_0_ng_container_7_ng_container_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainer"](0);
  }
}
function WelcomeOfflineImportComponent_div_0_ng_container_7_ng_container_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainer"](0);
  }
}
function WelcomeOfflineImportComponent_div_0_ng_container_7_ng_container_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainer"](0);
  }
}
function WelcomeOfflineImportComponent_div_0_ng_container_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](2, WelcomeOfflineImportComponent_div_0_ng_container_7_div_2_Template, 2, 1, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "div", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](4, WelcomeOfflineImportComponent_div_0_ng_container_7_ng_container_4_Template, 2, 1, "ng-container", 7)(5, WelcomeOfflineImportComponent_div_0_ng_container_7_ng_container_5_Template, 2, 1, "ng-container", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](6, "h2", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](8, "zelfName");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](9, "p", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](10, WelcomeOfflineImportComponent_div_0_ng_container_7_span_10_Template, 3, 6, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](11, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](12, WelcomeOfflineImportComponent_div_0_ng_container_7_ng_container_12_Template, 1, 0, "ng-container", 39)(13, WelcomeOfflineImportComponent_div_0_ng_container_7_ng_container_13_Template, 1, 0, "ng-container", 39)(14, WelcomeOfflineImportComponent_div_0_ng_container_7_ng_container_14_Template, 1, 0, "ng-container", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](15, "div", 40)(16, "button", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function WelcomeOfflineImportComponent_div_0_ng_container_7_Template_button_click_16_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.showRegistered = false);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const addressRow_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵreference"](9);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", (ctx_r1.zelfNameObject == null ? null : ctx_r1.zelfNameObject.publicData == null ? null : ctx_r1.zelfNameObject.publicData.type) === "hold" || !(ctx_r1.zelfNameObject == null ? null : ctx_r1.zelfNameObject.publicData == null ? null : ctx_r1.zelfNameObject.publicData.isExpiringSoon));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction2"](15, _c1, (ctx_r1.zelfNameObject == null ? null : ctx_r1.zelfNameObject.publicData == null ? null : ctx_r1.zelfNameObject.publicData.type) === "mainnet" && !(ctx_r1.zelfNameObject == null ? null : ctx_r1.zelfNameObject.publicData == null ? null : ctx_r1.zelfNameObject.publicData.isExpiringSoon), (ctx_r1.zelfNameObject == null ? null : ctx_r1.zelfNameObject.publicData == null ? null : ctx_r1.zelfNameObject.publicData.type) === "hold" || (ctx_r1.zelfNameObject == null ? null : ctx_r1.zelfNameObject.publicData == null ? null : ctx_r1.zelfNameObject.publicData.isExpiringSoon)));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", (ctx_r1.zelfNameObject == null ? null : ctx_r1.zelfNameObject.publicData == null ? null : ctx_r1.zelfNameObject.publicData.type) === "hold");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", (ctx_r1.zelfNameObject == null ? null : ctx_r1.zelfNameObject.publicData == null ? null : ctx_r1.zelfNameObject.publicData.type) === "mainnet");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](8, 13, ctx_r1.zelfNameObject == null ? null : ctx_r1.zelfNameObject.publicData == null ? null : ctx_r1.zelfNameObject.publicData.zelfName));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.zelfNameObject == null ? null : ctx_r1.zelfNameObject.publicData == null ? null : ctx_r1.zelfNameObject.publicData.registeredAt);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngTemplateOutlet", addressRow_r7)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction1"](22, _c3, _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction3"](18, _c2, ctx_r1.zelfNameObject == null ? null : ctx_r1.zelfNameObject.publicData == null ? null : ctx_r1.zelfNameObject.publicData.btcAddress, t_r4("common.btc_address"), ctx_r1.zelfNameObject == null ? null : ctx_r1.zelfNameObject.displayBtcAddress)));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngTemplateOutlet", addressRow_r7)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction1"](28, _c3, _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction3"](24, _c4, ctx_r1.zelfNameObject == null ? null : ctx_r1.zelfNameObject.publicData == null ? null : ctx_r1.zelfNameObject.publicData.ethAddress, t_r4("common.eth_address"), ctx_r1.zelfNameObject == null ? null : ctx_r1.zelfNameObject.displayEthAddress)));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngTemplateOutlet", addressRow_r7)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction1"](34, _c3, _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction3"](30, _c5, ctx_r1.zelfNameObject == null ? null : ctx_r1.zelfNameObject.publicData == null ? null : ctx_r1.zelfNameObject.publicData.solanaAddress, t_r4("common.sol_address"), ctx_r1.zelfNameObject == null ? null : ctx_r1.zelfNameObject.displaySolanaAddress)));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", t_r4("common.try_another_one"), " ");
  }
}
function WelcomeOfflineImportComponent_div_0_ng_template_8_ng_container_0_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 46)(1, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "img", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](5, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const address_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("src", address_r8.logo, _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](address_r8.label);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](address_r8.value);
  }
}
function WelcomeOfflineImportComponent_div_0_ng_template_8_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](1, WelcomeOfflineImportComponent_div_0_ng_template_8_ng_container_0_div_1_Template, 7, 3, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const address_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", address_r8.value);
  }
}
function WelcomeOfflineImportComponent_div_0_ng_template_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](0, WelcomeOfflineImportComponent_div_0_ng_template_8_ng_container_0_Template, 2, 1, "ng-container", 44);
  }
}
function WelcomeOfflineImportComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 2)(1, "div", 3)(2, "button", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function WelcomeOfflineImportComponent_div_0_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      ctx_r1.showAvailable = false;
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.showRegistered = false);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "svg", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](4, "path", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](5, WelcomeOfflineImportComponent_div_0_ng_container_5_Template, 15, 7, "ng-container", 7)(6, WelcomeOfflineImportComponent_div_0_ng_container_6_Template, 20, 14, "ng-container", 7)(7, WelcomeOfflineImportComponent_div_0_ng_container_7_Template, 18, 36, "ng-container", 7)(8, WelcomeOfflineImportComponent_div_0_ng_template_8_Template, 1, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("routerLink", ctx_r1.showAvailable || ctx_r1.showRegistered ? null : _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction0"](4, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx_r1.showAvailable && !ctx_r1.showRegistered);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.showAvailable);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.showRegistered);
  }
}
class WelcomeOfflineImportComponent {
  _activatedRoute;
  _captchaService;
  _chromeService;
  _formBuilder;
  _router;
  _walletService;
  _zelfNameService;
  _tagsService;
  _invalidTimeout;
  _showAvailable = false;
  _showRegistered = false;
  form;
  invalidReferral = false;
  loading = false;
  loadingReferral = false;
  qrCodeImage = "./assets/images/qr-preload.png";
  referralForm;
  zelfNameObject;
  zelfName = "";
  constructor(_activatedRoute, _captchaService, _chromeService, _formBuilder, _router, _walletService, _zelfNameService, _tagsService) {
    this._activatedRoute = _activatedRoute;
    this._captchaService = _captchaService;
    this._chromeService = _chromeService;
    this._formBuilder = _formBuilder;
    this._router = _router;
    this._walletService = _walletService;
    this._zelfNameService = _zelfNameService;
    this._tagsService = _tagsService;
  }
  ngOnInit() {
    this._initForm();
  }
  get showRegistered() {
    return this._showRegistered;
  }
  set showRegistered(value) {
    this._showRegistered = value;
    if (value) this._showAvailable = false;
  }
  get showAvailable() {
    return this._showAvailable;
  }
  set showAvailable(value) {
    this._showAvailable = value;
    if (value) {
      this._initReferralForm();
      this._showRegistered = false;
    } else {
      this.loading = false;
      this.loadingReferral = false;
      this.invalidReferral = false;
      this.zelfNameObject = null;
      this.qrCodeImage = "./assets/images/qr-preload.png";
    }
  }
  _initForm() {
    this.form = this._formBuilder.group({
      zelfName: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.minLength(1), _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.maxLength(26), _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.pattern(this._walletService.TagRegexNoPostfix)]]
    });
  }
  _initReferralForm() {
    this.referralForm = this._formBuilder.group({
      referralName: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.maxLength(26)],
      termsAndConditions: [false, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.requiredTrue]
    });
  }
  _noZelfNameFound(zelfNameObject) {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this._zelfNameService.setZelfName(zelfNameObject.zelfName, zelfNameObject);
      yield _this._zelfNameService.setZelfNameObject(zelfNameObject);
      _this.form.clearValidators();
      _this.form.reset({
        zelfName: ""
      });
      _this.loading = false;
      _this.showAvailable = true;
    })();
  }
  _setInvalidReferral() {
    this.invalidReferral = true;
    this._invalidTimeout = setTimeout(() => {
      this.invalidReferral = false;
    }, 5000);
  }
  sanitizeZelfName() {
    const control = this.form.get("zelfName");
    if (!control) return;
    let sanitizedValue = control.value.replace(/[^a-zA-Z0-9.-]|^[^a-zA-Z]+|[.-]$/g, "");
    sanitizedValue = sanitizedValue.toUpperCase().trim();
    control.patchValue(sanitizedValue, {
      emitEvent: false
    });
    if (!sanitizedValue) control.markAsPristine();
  }
  clearInvalidReferral() {
    clearTimeout(this._invalidTimeout);
    this.invalidReferral = false;
  }
  goToImport() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this2._tagsService.setFlow("import");
      _this2._router.navigate(["../import"], {
        relativeTo: _this2._activatedRoute
      });
    })();
  }
  searchZelfName(event) {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this3.form.valid) {
        _this3.form.patchValue({
          zelfName: ""
        });
        _this3.zelfName = "";
        return;
      }
      if (_this3.loading) return;
      event.preventDefault();
      _this3.loading = true;
      const zelfName = `${_this3.form.value.zelfName}.zelf`;
      let captchaToken = "";
      if (!_this3._chromeService.isExtension) {
        try {
          const captchaKey = _this3.form.value.zelfName.replace(".", "_");
          captchaToken = yield _this3._captchaService.executeRecaptcha(captchaKey);
        } catch (error) {
          console.error("reCAPTCHA failed:", error);
        }
      }
      _this3._tagsService.searchTag({
        tagName: zelfName,
        captchaToken: captchaToken
      }).then(/*#__PURE__*/function () {
        var _ref = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (response) {
          _this3.zelfName = zelfName;
          if (response?.data.available) return yield _this3._noZelfNameFound(response?.data);
          const zelfNameObject = new app_tags_service__WEBPACK_IMPORTED_MODULE_9__.TagModel(response.data.tagObject);
          _this3.loading = false;
          _this3.zelfNameObject = zelfNameObject;
          _this3.qrCodeImage = zelfNameObject?.image || _this3.qrCodeImage;
          _this3.showRegistered = true;
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }()).catch(exception => {
        console.error({
          exception
        });
        _this3.loading = false;
      });
    })();
  }
  searchReferralZelfName(event) {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const referralNameCtrl = _this4.referralForm.get("referralName");
      if (!referralNameCtrl) return;
      if (!referralNameCtrl.value || referralNameCtrl.invalid) {
        _this4.referralForm.patchValue({
          zelfName: ""
        });
        _this4.referralForm.markAsPristine();
      }
      if (_this4.loading || _this4.loadingReferral || !referralNameCtrl?.dirty || !referralNameCtrl?.value) return;
      event.preventDefault();
      _this4.loadingReferral = true;
      const zelfName = referralNameCtrl.value ? referralNameCtrl.value.endsWith(".zelf") ? referralNameCtrl.value : `${referralNameCtrl.value}.zelf` : "";
      let captchaToken = "";
      if (!_this4._chromeService.isExtension) {
        try {
          const captchaKey = referralNameCtrl.value.replace(".", "_");
          captchaToken = yield _this4._captchaService.executeRecaptcha(captchaKey);
        } catch (error) {
          console.error("reCAPTCHA failed:", error);
        }
      }
      _this4._tagsService.searchTag({
        tagName: zelfName,
        captchaToken: captchaToken
      }).then(response => {
        if (response?.data.available) {
          _this4.referralForm.patchValue({
            referralName: ""
          });
          _this4.referralForm.markAsPristine();
          _this4.loadingReferral = false;
          _this4._setInvalidReferral();
          return;
        }
        _this4.referralForm.markAsPristine();
        _this4.zelfNameObject = new app_tags_service__WEBPACK_IMPORTED_MODULE_9__.TagModel(response.data.tagObject);
        _this4._zelfNameService.setReferral(_this4.zelfNameObject.publicData.zelfName);
        _this4.loadingReferral = false;
      }).catch(exception => {
        console.error({
          exception
        });
        _this4.referralForm.patchValue({
          referralName: ""
        });
        _this4.referralForm.markAsPristine();
        _this4.loadingReferral = false;
        _this4._setInvalidReferral();
      });
    })();
  }
  static ɵfac = function WelcomeOfflineImportComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || WelcomeOfflineImportComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_12__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](app_captcha_service__WEBPACK_IMPORTED_MODULE_13__.CaptchaService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](app_chrome_service__WEBPACK_IMPORTED_MODULE_14__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_12__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](app_wallet_service__WEBPACK_IMPORTED_MODULE_15__.WalletService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](app_zelf_name_service_service__WEBPACK_IMPORTED_MODULE_16__.ZelfNameService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](app_tags_service__WEBPACK_IMPORTED_MODULE_9__.TagsService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineComponent"]({
    type: WelcomeOfflineImportComponent,
    selectors: [["welcome-offline-import"]],
    decls: 1,
    vars: 0,
    consts: [["addressRow", ""], ["class", "zelf-card welcome-offline-import", 4, "transloco"], [1, "zelf-card", "welcome-offline-import"], [1, "welcome-offline-import__header-button"], ["mat-icon-button", "", 1, "zelf-icon-button", "zelf-icon-button--40", 3, "click", "routerLink"], ["viewBox", "0 0 22 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"], [4, "ngIf"], [1, "welcome-offline-import__wrapper"], ["src", "assets/images/lock.png", "alt", "offline-import"], [1, "zelf-card__title"], [1, "zelf-card__subtitle"], [1, "zelf-card__content", 3, "ngSubmit", "formGroup"], [1, "zelf-input"], ["autocomplete", "off", "formControlName", "zelfName", "id", "zelfName", "maxlength", "26", "minlength", "1", "name", "zelfName", "required", "", 1, "zelf-input__control", 3, "input", "keydown.enter", "placeholder"], [1, "zelf-input__postfix"], ["mat-icon-button", "", "type", "submit", 1, "zelf-icon-button", "zelf-icon-button--primary", 3, "disabled"], ["mode", "indeterminate", "diameter", "18", 4, "ngIf"], ["width", "18", "height", "18", "viewBox", "0 0 18 18", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z"], ["mode", "indeterminate", "diameter", "18"], [1, "welcome-offline-import__available-wrapper"], [1, "zelf-chip", "zelf-chip--success"], [1, "zelf-card__subtitle", "welcome-offline-import__available-subtitle"], [1, "zelf-card__content", 3, "formGroup"], [1, "welcome-offline-import__top"], [3, "clearInvalidReferralEvent", "sanitizeZelfNameEvent", "searchZelfName", "form", "invalidReferral", "loading", "loadingReferral", "zelfNameObject"], [1, "welcome-offline-import__buttons"], [1, "zelf-checkbox"], ["formControlName", "termsAndConditions", "id", "termsAndConditions", "name", "termsAndConditions", "type", "checkbox"], ["viewBox", "0 0 21 21"], ["points", "5 10.75 8.5 14.25 16 6"], [3, "innerHTML"], ["mat-flat-button", "", 1, "zelf-button", "zelf-button--primary", "zelf-button--wide", 3, "click", "disabled"], [1, "zelf-card__content"], ["class", "qr-code", 4, "ngIf"], [1, "zelf-chip", "welcome-offline-import__chip", 3, "ngClass"], [1, "zelf-card__subtitle", "welcome-offline-import__subtitle"], [1, "welcome-offline-import__addresses"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "zelf-card__actions", "welcome-offline-import__actions"], ["mat-flat-button", "", 1, "zelf-button", "zelf-button--primary", "zelf-button--wide", 3, "click"], [1, "qr-code"], ["alt", "zelf-proof", 1, "qr-code__image", 3, "src"], [4, "transloco"], ["class", "address-row", 4, "ngIf"], [1, "address-row"], [1, "address-row__inner"], ["alt", "Currency Logo", 1, "address-row__logo", 3, "src"], [1, "address-row__label"], [1, "address-row__value"]],
    template: function WelcomeOfflineImportComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](0, WelcomeOfflineImportComponent_div_0_Template, 10, 5, "div", 1);
      }
    },
    dependencies: [_angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButton, _angular_material_button__WEBPACK_IMPORTED_MODULE_17__.MatIconButton, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_4__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_4__.MatProgressSpinner, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgTemplateOutlet, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.CheckboxControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.MinLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControlName, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterLink, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_6__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_6__.TranslocoDirective, app_welcome_available_welcome_available_content_component__WEBPACK_IMPORTED_MODULE_7__.WelcomeAvailableContentComponent, _angular_common__WEBPACK_IMPORTED_MODULE_1__.DatePipe, app_pipes_zelf_name_pipe__WEBPACK_IMPORTED_MODULE_8__.ZelfNamePipe],
    styles: ["[_ngcontent-%COMP%]:root {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc);\n}\n\n.zelf-button-external-link[_ngcontent-%COMP%] {\n  display: block;\n}\n.zelf-button-external-link--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.zelf-button[_ngcontent-%COMP%] {\n  align-items: center;\n  border-radius: 16px;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  gap: 8px;\n  height: 56px;\n  justify-content: center;\n  outline: none;\n  padding: 8px 24px;\n  text-align: center;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.zelf-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-button[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: inherit;\n}\n.zelf-button__text--margin-right[_ngcontent-%COMP%] {\n  margin-right: 1rem;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-button--thin[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  padding: 12px 16px;\n}\n.zelf-button--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.zelf-button--wide.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-button--primary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button, #181818) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--primary[_ngcontent-%COMP%]:active {\n  --mdc-filled-button-container-color: var(--zns-theme-text-muted, #96939e) !important;\n  background-color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-hover, #ff5721) !important;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff) !important;\n  stroke: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-text-secondary, #73777f) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-text-secondary, #73777f) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--secondary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-button-secondary-text, #495057) !important;\n  background-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  color: var(--zns-theme-button-secondary-text, #495057) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-secondary-text, #495057);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus, .zelf-button--secondary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-border, #e3e3e3) !important;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]:focus, .zelf-button--tertiary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%] {\n  --mdc-outlined-button-label-text-color: var(--zns-theme-button, #181818) !important;\n  --mdc-outlined-button-outline-color: var(--zns-theme-border, #e3e3e3) !important;\n  border: 1px solid var(--zns-theme-button, #181818) !important;\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-button, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button, #181818);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus, .zelf-button--outlined[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--outlined[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--outlined[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%] {\n  border: none !important;\n  background-color: transparent !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--red[_ngcontent-%COMP%]:focus, .zelf-button--red[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n}\n.zelf-button--red[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e);\n}\n.zelf-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n}\n\n.zelf-icon-button[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  align-items: center;\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  border-radius: 56px;\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  font-weight: 600;\n  gap: 16px;\n  height: 56px;\n  justify-content: center;\n  min-height: 56px;\n  min-width: 56px;\n  outline: none;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  -webkit-user-select: none;\n          user-select: none;\n  width: 56px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-icon-button.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: var(--zns-theme-text, #181818);\n  height: 24px;\n  width: 24px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%] {\n  height: 40px;\n  min-height: 40px;\n  min-width: 40px;\n  width: 40px;\n  border-radius: 40px;\n  padding: 0 8px;\n}\n.zelf-icon-button--40.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 14px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  height: 20px;\n  width: 20px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e) !important;\n  stroke: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:active {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus, .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%] {\n  background-color: transparent !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]:focus, .zelf-icon-button--transparent[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--text[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: initial !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  height: auto;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n  width: auto;\n}\n\n.zelf-icon-button-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:first-child {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:last-child {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.zelf-action-button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: 8px;\n}\n.zelf-action-button__icon[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  background: var(--zns-theme-card, #ffffff);\n  border-radius: 32px;\n  outline: 1px var(--zns-theme-border, #e3e3e3) solid;\n  outline-offset: -1px;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  cursor: pointer;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n@media (max-width: 600px) {\n  .zelf-action-button__icon[_ngcontent-%COMP%] {\n    padding: 8px 14px;\n  }\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-size: 24px;\n  line-height: 1;\n  font-variation-settings: \"FILL\" 0, \"wght\" 400, \"GRAD\" 0, \"opsz\" 24;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-primary, #181818);\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .zelf-action-button__text[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon-box[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  position: relative;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n}\n.zelf-action-button__text[_ngcontent-%COMP%] {\n  width: auto;\n  white-space: nowrap;\n  text-align: center;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 11px;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  line-height: 16px;\n  letter-spacing: 0.5px;\n  word-wrap: normal;\n}\n\n.tip-box[_ngcontent-%COMP%] {\n  align-items: flex-start;\n  border-radius: 16px;\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  box-sizing: border-box;\n  display: flex;\n  gap: 12px;\n  padding: 16px;\n  width: 100%;\n}\n.tip-box__text[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 20px;\n  margin: 0 !important;\n}\n.tip-box__link[_ngcontent-%COMP%] {\n  text-decoration: underline;\n}\n\n.tooltip[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  position: absolute;\n  background-color: var(--zns-theme-text, #181818);\n  color: var(--zns-theme-background, #ffffff);\n  font-size: 12px;\n  padding: 8px 12px;\n  border-radius: 9999px;\n  white-space: nowrap;\n  top: -44px;\n  opacity: 0;\n  visibility: hidden;\n  transform: translateY(10px);\n  transition: opacity 0.2s ease, transform 0.2s ease;\n}\n.tooltip[_ngcontent-%COMP%]::after {\n  content: \"\";\n  position: absolute;\n  bottom: -12px;\n  left: 50%;\n  transform: translateX(-50%);\n  border-width: 6px;\n  border-style: solid;\n  border-color: var(--zns-theme-text, #181818) transparent transparent transparent;\n}\n\n.tooltip-container[_ngcontent-%COMP%] {\n  position: relative;\n  cursor: pointer;\n}\n.tooltip-container[_ngcontent-%COMP%]:hover   .tooltip[_ngcontent-%COMP%] {\n  opacity: 1;\n  visibility: visible;\n  transform: translateY(0);\n}\n\n[_nghost-%COMP%] {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  justify-content: center;\n}\n\n.welcome-offline-import[_ngcontent-%COMP%] {\n  min-height: 75vh;\n  display: flex;\n  justify-content: flex-start;\n  gap: calc(24px * var(--zns-space-scale, 1));\n}\n.welcome-offline-import__header[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: calc(12px * var(--zns-space-scale, 1));\n}\n.welcome-offline-import__content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: calc(12px * var(--zns-space-scale, 1));\n}\n.welcome-offline-import__header-button[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n  flex-direction: row;\n  width: 100%;\n}\n.welcome-offline-import__wrapper[_ngcontent-%COMP%] {\n  margin-top: calc(8px * var(--zns-space-scale, 1));\n  box-sizing: border-box;\n  border-radius: 16px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n  padding: calc(16px * var(--zns-space-scale, 1));\n  width: 100%;\n  flex-grow: 1;\n}\n.welcome-offline-import__available-wrapper[_ngcontent-%COMP%] {\n  margin-top: calc(8px * var(--zns-space-scale, 1));\n  box-sizing: border-box;\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: 16px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n  padding: calc(16px * var(--zns-space-scale, 1));\n  width: 100%;\n  flex-grow: 1;\n}\n.welcome-offline-import__available-subtitle[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 500;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  text-align: center;\n  vertical-align: middle;\n  color: var(--zns-theme-text-secondary, #73777f);\n  margin-top: calc(8px * var(--zns-space-scale, 1));\n}\n.welcome-offline-import__content[_ngcontent-%COMP%] {\n  margin-top: calc(16px * var(--zns-space-scale, 1));\n}\n.welcome-offline-import__top[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  flex-direction: column;\n  gap: 16px;\n  padding: 8px 0;\n  box-sizing: border-box;\n  border-radius: 16px;\n  background: var(--zns-theme-card-border, #eeedf1);\n}\n.welcome-offline-import__buttons[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  flex-direction: column;\n  gap: 8px;\n  width: 100%;\n}\n.welcome-offline-import__subtitle[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n.welcome-offline-import__chip[_ngcontent-%COMP%] {\n  margin-top: 8px;\n}\n.welcome-offline-import__addresses[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  margin-top: 16px;\n}\n.welcome-offline-import__actions[_ngcontent-%COMP%] {\n  align-items: flex-end;\n  flex-grow: 1;\n}\n\n.address-row[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card-border, #eeedf1);\n  border-radius: 16px;\n  height: 48px;\n  width: 100%;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.address-row__inner[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  padding: 0 12px;\n  gap: 8px;\n  flex: 1 1 auto;\n  justify-content: center;\n  align-items: center;\n}\n.address-row__logo[_ngcontent-%COMP%] {\n  min-height: 32px;\n  min-width: 32px;\n  max-height: 32px;\n  max-width: 32px;\n  border-radius: 32px;\n  object-fit: contain;\n  display: flex;\n  justify-self: flex-start;\n}\n.address-row__label[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  display: flex;\n  justify-self: flex-start;\n  flex: 1 1 40%;\n}\n.address-row__value[_ngcontent-%COMP%] {\n  color: #181818;\n  font-family: monospace;\n  font-size: 14px;\n  font-weight: 500;\n  display: flex;\n  flex: 1 1 40%;\n  justify-content: flex-end;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX2J1dHRvbnMuc2NzcyIsIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX3ZhcmlhYmxlcy5zY3NzIiwid2VicGFjazovLy4vc3JjL2FwcC93ZWxjb21lLW9mZmxpbmUtaW1wb3J0L3dlbGNvbWUtb2ZmbGluZS1pbXBvcnQuY29tcG9uZW50LnNjc3MiLCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL19lbGVtZW50cy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQ0ksZ0VDMEJ1QjtBQzNCM0I7O0FGSUE7RUFDSSxjQUFBO0FFREo7QUZHSTtFQUNJLFdBQUE7QUVEUjs7QUZLQTtFQUNJLG1CQUFBO0VBQ0EsbUJBQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQTtFQUNBLGFBQUE7RUFDQSx1RUNJYztFREhkLGVBQUE7RUFDQSxnQkFBQTtFQUNBLFFBQUE7RUFDQSxZQUFBO0VBQ0EsdUJBQUE7RUFDQSxhQUFBO0VBQ0EsaUJBQUE7RUFDQSxrQkFBQTtFQUNBLHlCQUFBO1VBQUEsaUJBQUE7QUVGSjtBRklJO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxRQUFBO0FFRlI7QUZLSTtFQUNJLFNBQUE7RUFDQSxjQUFBO0FFSFI7QUZPUTtFQUNJLGtCQUFBO0FFTFo7QUZTSTtFQUNJLDZCQUFBO0VBQ0EsK0NDbEJhO0VEbUJiLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHFCQUFBO0VBQ0EsaUJBQUE7RUFDQSw2R0FDSTtBRVJaO0FGV1E7RUFDSSxlQUFBO0FFVFo7QUZZUTtFQUNJLDhDQ2hDUztBQ3NCckI7QUZhUTtFQUNJLHFDQ3RDQTtFRHVDQSxrREN4QkU7QUNhZDtBRmFZO0VBQ0ksb0NDMUNKO0FDK0JaO0FGZVE7RUFDSSxtQkFBQTtFQUNBLHNEQUFBO0FFYlo7QUZlWTtFQUNJLDBDQ2xEQztBQ3FDakI7QUZrQkk7RUFDSSxrQkFBQTtFQUNBLGtCQUFBO0FFaEJSO0FGbUJJO0VBQ0ksV0FBQTtBRWpC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QUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0FBb2lCSjtBQWxpQkk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxlQUFBO0VBQ0EsUUFBQTtFQUNBLGNBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0FBb2lCUjtBQWppQkk7RUFDSSxnQkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSxtQkFBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLHdCQUFBO0FBbWlCUjtBQWhpQkk7RUFDSSwrQ0QzSGE7RUM0SGIsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsYUFBQTtFQUNBLHdCQUFBO0VBQ0EsYUFBQTtBQWtpQlI7QUEvaEJJO0VBQ0ksY0RoSkE7RUNpSkEsc0JBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxhQUFBO0VBQ0EsYUFBQTtFQUNBLHlCQUFBO0FBaWlCUiIsInNvdXJjZXNDb250ZW50IjpbIkB1c2UgXCIuL3ZhcmlhYmxlc1wiO1xuXG46cm9vdCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk7XG59XG5cbi56ZWxmLWJ1dHRvbi1leHRlcm5hbC1saW5rIHtcbiAgICBkaXNwbGF5OiBibG9jaztcblxuICAgICYtLXdpZGUge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG59XG5cbi56ZWxmLWJ1dHRvbiB7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgZ2FwOiA4cHg7XG4gICAgaGVpZ2h0OiA1NnB4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgcGFkZGluZzogOHB4IDI0cHg7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuXG4gICAgc3BhbiB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICB9XG5cbiAgICBwIHtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBjb2xvcjogaW5oZXJpdDtcbiAgICB9XG5cbiAgICAmX190ZXh0IHtcbiAgICAgICAgJi0tbWFyZ2luLXJpZ2h0IHtcbiAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMXJlbTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWh5cGVybGluayB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBwYWRkaW5nOiA4cHggMTZweDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuMnMgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJi0tc21hbGwge1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXRoaW4ge1xuICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgIHBhZGRpbmc6IDEycHggMTZweDtcbiAgICB9XG5cbiAgICAmLS13aWRlIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG5cbiAgICAgICAgJi56ZWxmLWJ1dHRvbi0taHlwZXJsaW5rIHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1wcmltYXJ5IHtcbiAgICAgICAgLy8gTURDIG1hdC1mbGF0LWJ1dHRvbiBwYWludHMgdmlhIENTUyB2YXJpYWJsZXM7IGFsaWduIHdpdGggWmVsZiB0b2tlbnMgKGF2b2lkcyBkZWZhdWx0IE1hdGVyaWFsIGJsdWUpLlxuICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9ufSAhaW1wb3J0YW50O1xuICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWxhYmVsLXRleHQtY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUNhcmR9ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbiAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjphY3RpdmUge1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZH0gIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvbkhvdmVyfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbkhvdmVyICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgIH1cblxuICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcbiAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeX0gIWltcG9ydGFudDtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tbGFiZWwtdGV4dC1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQ2FyZH0gIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXNlY29uZGFyeSB7XG4gICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnl9ICFpbXBvcnRhbnQ7XG4gICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tbGFiZWwtdGV4dC1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dH0gIWltcG9ydGFudDtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeVRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlIb3Zlcn0gIWltcG9ydGFudDtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tbGFiZWwtdGV4dC1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQ2FyZH0gIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlIb3ZlciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCb3JkZXJ9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUJvcmRlckhvdmVyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tdGVydGlhcnkge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHNlY29uZGFyeUNvbG9yICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLW91dGxpbmVkIHtcbiAgICAgICAgLS1tZGMtb3V0bGluZWQtYnV0dG9uLWxhYmVsLXRleHQtY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvbn0gIWltcG9ydGFudDtcbiAgICAgICAgLS1tZGMtb3V0bGluZWQtYnV0dG9uLW91dGxpbmUtY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJvcmRlcn0gIWltcG9ydGFudDtcblxuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uICFpbXBvcnRhbnQ7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tcmVkIHtcbiAgICAgICAgYm9yZGVyOiBub25lICFpbXBvcnRhbnQ7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGVycm9yICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRlcnJvckxpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWVycm9yIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRlcnJvckxpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGVycm9yICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXN1Y2Nlc3Mge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3RMaWdodCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRjb3JyZWN0ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kY29ycmVjdCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tcGlsbCB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICAgICAgbWluLWhlaWdodDogMDtcbiAgICAgICAgbWluLXdpZHRoOiAwO1xuICAgICAgICBwYWRkaW5nOiA0cHggMTJweDtcbiAgICB9XG59XG5cbi56ZWxmLWljb24tYnV0dG9uIHtcbiAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlciAhaW1wb3J0YW50O1xuICAgIGJvcmRlci1yYWRpdXM6IDU2cHg7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGdhcDogMTZweDtcbiAgICBoZWlnaHQ6IDU2cHg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgbWluLWhlaWdodDogNTZweDtcbiAgICBtaW4td2lkdGg6IDU2cHg7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICB0cmFuc2l0aW9uOlxuICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgd2lkdGg6IDU2cHg7XG5cbiAgICBzcGFuIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogOHB4O1xuICAgIH1cblxuICAgICYuemVsZi1pY29uLWJ1dHRvbi0tYm9yZGVyLXNvZnQge1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIH1cblxuICAgIHN2ZyB7XG4gICAgICAgIHRyYW5zaXRpb246IGZpbGwgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIGhlaWdodDogMjRweDtcbiAgICAgICAgd2lkdGg6IDI0cHg7XG4gICAgfVxuXG4gICAgJjpob3ZlciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3IgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWJvcmRlci1zb2Z0IHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICB9XG5cbiAgICAmLS00MCB7XG4gICAgICAgIGhlaWdodDogNDBweDtcbiAgICAgICAgbWluLWhlaWdodDogNDBweDtcbiAgICAgICAgbWluLXdpZHRoOiA0MHB4O1xuICAgICAgICB3aWR0aDogNDBweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNDBweDtcbiAgICAgICAgcGFkZGluZzogMCA4cHg7XG5cbiAgICAgICAgJi56ZWxmLWljb24tYnV0dG9uLS1ib3JkZXItc29mdCB7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxNHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGhlaWdodDogMjBweDtcbiAgICAgICAgICAgIHdpZHRoOiAyMHB4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0taHlwZXJsaW5rIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIHBhZGRpbmc6IDhweCAxNnB4O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmLS1zbWFsbCB7XG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQgIWltcG9ydGFudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXByaW1hcnkge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmFjdGl2ZSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbkhvdmVyICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXIgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXNlY29uZGFyeSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3IgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUJvcmRlckhvdmVyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tdHJhbnNwYXJlbnQge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIH1cblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUJvcmRlckhvdmVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tdGV4dCB7XG4gICAgICAgIHdpZHRoOiBhdXRvICFpbXBvcnRhbnQ7XG4gICAgICAgIG1pbi13aWR0aDogaW5pdGlhbCAhaW1wb3J0YW50O1xuICAgIH1cblxuICAgICYtLWVycm9yIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRlcnJvckxpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGVycm9yICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXN1Y2Nlc3Mge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3RMaWdodCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRjb3JyZWN0ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kY29ycmVjdCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tcGlsbCB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICAgICAgaGVpZ2h0OiBhdXRvO1xuICAgICAgICBtaW4taGVpZ2h0OiAwO1xuICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgICAgIHBhZGRpbmc6IDRweCAxMnB4O1xuICAgICAgICB3aWR0aDogYXV0bztcbiAgICB9XG59XG5cbi56ZWxmLWljb24tYnV0dG9uLWdyb3VwIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiAwO1xuXG4gICAgLnplbGYtaWNvbi1idXR0b24ge1xuICAgICAgICAmOmZpcnN0LWNoaWxkIHtcbiAgICAgICAgICAgIGJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiAwO1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDA7XG4gICAgICAgIH1cblxuICAgICAgICAmOm5vdCg6Zmlyc3QtY2hpbGQpOm5vdCg6bGFzdC1jaGlsZCkge1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6bGFzdC1jaGlsZCB7XG4gICAgICAgICAgICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAwO1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMDtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuLnplbGYtYWN0aW9uLWJ1dHRvbiB7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDhweDtcblxuICAgICZfX2ljb24ge1xuICAgICAgICBwYWRkaW5nOiAxMHB4IDIwcHg7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAzMnB4O1xuICAgICAgICBvdXRsaW5lOiAxcHggdmFyaWFibGVzLiR0aGVtZUJvcmRlciBzb2xpZDtcbiAgICAgICAgb3V0bGluZS1vZmZzZXQ6IC0xcHg7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IHZhcmlhYmxlcy4kbWluU21hbGwpIHtcbiAgICAgICAgICAgIHBhZGRpbmc6IDhweCAxNHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogZmlsbCAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgZm9udC1zaXplOiAyNHB4O1xuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDE7XG4gICAgICAgICAgICBmb250LXZhcmlhdGlvbi1zZXR0aW5nczpcbiAgICAgICAgICAgICAgICBcIkZJTExcIiAwLFxuICAgICAgICAgICAgICAgIFwid2dodFwiIDQwMCxcbiAgICAgICAgICAgICAgICBcIkdSQURcIiAwLFxuICAgICAgICAgICAgICAgIFwib3BzelwiIDI0O1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICAgICAgfVxuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRwcmltYXJ5Q29sb3I7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC5tYXRlcmlhbC1zeW1ib2xzLW91dGxpbmVkIHtcbiAgICAgICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC56ZWxmLWFjdGlvbi1idXR0b25fX3RleHQge1xuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2ljb24tYm94IHtcbiAgICAgICAgd2lkdGg6IDI4cHg7XG4gICAgICAgIGhlaWdodDogMjhweDtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgJl9fdGV4dCB7XG4gICAgICAgIHdpZHRoOiBhdXRvO1xuICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgZm9udC1zaXplOiAxMXB4O1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxNnB4O1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC41cHg7XG4gICAgICAgIHdvcmQtd3JhcDogbm9ybWFsO1xuICAgIH1cbn1cbiIsIiRwcmltYXJ5Q29sb3I6IHZhcigtLXpucy10aGVtZS1wcmltYXJ5LCAjMTgxODE4KTtcbiRwcmltYXJ5TGlnaHQ6ICNkYWRkZmE7XG4kc2Vjb25kYXJ5Q29sb3I6IHZhcigtLXpucy10aGVtZS1zZWNvbmRhcnksICNmZjU3MjEpO1xuJHNlY29uZGFyeUNvbG9yTGlnaHQ6ICNmNmU1ZTA7XG5cbiRjb3JyZWN0OiB2YXIoLS16bnMtdGhlbWUtc3VjY2VzcywgIzFlYTQ0Nik7XG4kY29ycmVjdERhcms6ICMwZjUyMjM7XG4kY29ycmVjdExpZ2h0OiB2YXIoLS16bnMtdGhlbWUtc3VjY2Vzcy10ZXh0LCAjZTdmOGVkKTtcblxuJGVycm9yOiB2YXIoLS16bnMtdGhlbWUtZXJyb3IsICNkYzM2MmUpO1xuJGVycm9yRGFyazogIzYwMTQxMDtcbiRlcnJvckxpZ2h0OiB2YXIoLS16bnMtdGhlbWUtZXJyb3ItdGV4dCwgI2ZjZWVlZSk7XG5cbiR3YXJuaW5nOiB2YXIoLS16bnMtdGhlbWUtd2FybmluZywgI2RlNjgwMCk7XG4kd2FybmluZ0Rhcms6ICM0YTIxMGE7XG4kd2FybmluZ0xpZ2h0OiB2YXIoLS16bnMtdGhlbWUtd2FybmluZy10ZXh0LCAjZmZlZWU5KTtcblxuJGluZm86ICMzOTk4ZDM7XG4kaW5mb0Rhcms6ICMwMDRhNzc7XG4kaW5mb0xpZ2h0OiAjZWNmM2ZlO1xuXG4kYmxhY2s6ICMxODE4MTg7XG4kd2hpdGU6ICNmZmZmZmY7XG5cbiR0aGVtZUJvZHlGYW1pbHk6IHZhcigtLXpucy10aGVtZS1ib2R5LWZhbWlseSwgXCJQb3BwaW5zXCIsIEFyaWFsLCBzYW5zLXNlcmlmKTtcbiR0aGVtZVRpdGxlRmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtdGl0bGUtZmFtaWx5LCBcIk1lbmRhXCIsIFwiQXJpYWwgQmxhY2tcIiwgc2Fucy1zZXJpZik7XG4kdGhlbWVNb25vc3BhY2VGYW1pbHk6IHZhcigtLXpucy10aGVtZS1tb25vc3BhY2UtZmFtaWx5LCBcIkNvdXJpZXIgTmV3XCIsIENvdXJpZXIsIG1vbm9zcGFjZSk7XG5cbiR0aGVtZUJhY2tncm91bmQ6IHZhcigtLXpucy10aGVtZS1iYWNrZ3JvdW5kLCAjZmZmZmZmKTtcbiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS1iYWNrZ3JvdW5kLXNlY29uZGFyeSwgI2Y5ZjlmYyk7XG5cbiR0aGVtZVRleHQ6IHZhcigtLXpucy10aGVtZS10ZXh0LCAjMTgxODE4KTtcbiR0aGVtZVRleHRNdXRlZDogdmFyKC0tem5zLXRoZW1lLXRleHQtbXV0ZWQsICM5NjkzOWUpO1xuJHRoZW1lVGV4dFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLXRleHQtc2Vjb25kYXJ5LCAjNzM3NzdmKTtcblxuJHRoZW1lSGVhZGVyOiB2YXIoLS16bnMtdGhlbWUtaGVhZGVyLCAjMTgxODE4KTtcbiR0aGVtZUhlYWRlclRleHQ6IHZhcigtLXpucy10aGVtZS1oZWFkZXItdGV4dCwgI2ZmZmZmZik7XG5cbiR0aGVtZUJ1dHRvbjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbiwgIzE4MTgxOCk7XG4kdGhlbWVCdXR0b25UZXh0OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXRleHQsICNmZmZmZmYpO1xuJHRoZW1lQnV0dG9uSG92ZXI6IHZhcigtLXpucy10aGVtZS1idXR0b24taG92ZXIsICNmZjU3MjEpO1xuXG4kdGhlbWVCdXR0b25TZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LCAjZTllY2VmKTtcbiR0aGVtZUJ1dHRvblNlY29uZGFyeVRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LXRleHQsICM0OTUwNTcpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5SG92ZXI6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LWhvdmVyLCAjZTllY2VmKTtcblxuJHRoZW1lQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtYm9yZGVyLCAjZTNlM2UzKTtcbiR0aGVtZUJvcmRlckhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYm9yZGVyLWhvdmVyLCAjYzNjNmNmKTtcblxuJHRoZW1lQ2FyZDogdmFyKC0tem5zLXRoZW1lLWNhcmQsICNmZmZmZmYpO1xuJHRoZW1lQ2FyZEJvcmRlcjogdmFyKC0tem5zLXRoZW1lLWNhcmQtYm9yZGVyLCAjZWVlZGYxKTtcblxuJHRoZW1lU2hhZG93OiB2YXIoLS16bnMtdGhlbWUtc2hhZG93LCByZ2JhKDAsIDAsIDAsIDAuMSkpO1xuXG4kc21vb3RoQmV6aWVyOiBjdWJpYy1iZXppZXIoMC4yNSwgMC40LCAwLjcsIDEpO1xuXG4kbWF4RXh0cmFTbWFsbDogNTk1cHg7XG4kbWluU21hbGw6IDYwMHB4O1xuJG1lZGl1bTogNzY4cHg7XG4kbGFyZ2U6IDg4OXB4O1xuJGNvbXB1dGVyczogMTIwMHB4O1xuIiwiQHVzZSBcIi4uLy4uL3N0eWxlcy92YXJpYWJsZXNcIjtcbkB1c2UgXCIuLi8uLi9zdHlsZXMvYnV0dG9uc1wiO1xuQHVzZSBcIi4uLy4uL3N0eWxlcy9lbGVtZW50c1wiO1xuXG46aG9zdCB7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgZmxleC1ncm93OiAxO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuXG4ud2VsY29tZS1vZmZsaW5lLWltcG9ydCB7XG4gICAgbWluLWhlaWdodDogNzV2aDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICBnYXA6IGNhbGMoMjRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuXG4gICAgJl9faGVhZGVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19jb250ZW50IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19oZWFkZXItYnV0dG9uIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX193cmFwcGVyIHtcbiAgICAgICAgbWFyZ2luLXRvcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIHBhZGRpbmc6IGNhbGMoMTZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgZmxleC1ncm93OiAxO1xuICAgIH1cblxuICAgICZfX2F2YWlsYWJsZS13cmFwcGVyIHtcbiAgICAgICAgbWFyZ2luLXRvcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGZsZXgtZ3JvdzogMTtcbiAgICB9XG5cbiAgICAmX19hdmFpbGFibGUtc3VidGl0bGUge1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMjBweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjFweDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIG1hcmdpbi10b3A6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgfVxuXG4gICAgJl9fY29udGVudCB7XG4gICAgICAgIG1hcmdpbi10b3A6IGNhbGMoMTZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX3RvcCB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiAxNnB4O1xuICAgICAgICBwYWRkaW5nOiA4cHggMDtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgfVxuXG4gICAgJl9fYnV0dG9ucyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogOHB4O1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX19zdWJ0aXRsZSB7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgfVxuXG4gICAgJl9fY2hpcCB7XG4gICAgICAgIG1hcmdpbi10b3A6IDhweDtcbiAgICB9XG5cbiAgICAmX19hZGRyZXNzZXMge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiAxMnB4O1xuICAgICAgICBtYXJnaW4tdG9wOiAxNnB4O1xuICAgIH1cblxuICAgICZfX2FjdGlvbnMge1xuICAgICAgICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XG4gICAgICAgIGZsZXgtZ3JvdzogMTtcbiAgICB9XG59XG5cbi5hZGRyZXNzLXJvdyB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICBoZWlnaHQ6IDQ4cHg7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgJl9faW5uZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICBwYWRkaW5nOiAwIDEycHg7XG4gICAgICAgIGdhcDogOHB4O1xuICAgICAgICBmbGV4OiAxIDEgYXV0bztcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgJl9fbG9nbyB7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDMycHg7XG4gICAgICAgIG1pbi13aWR0aDogMzJweDtcbiAgICAgICAgbWF4LWhlaWdodDogMzJweDtcbiAgICAgICAgbWF4LXdpZHRoOiAzMnB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiAzMnB4O1xuICAgICAgICBvYmplY3QtZml0OiBjb250YWluO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LXNlbGY6IGZsZXgtc3RhcnQ7XG4gICAgfVxuXG4gICAgJl9fbGFiZWwge1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1zZWxmOiBmbGV4LXN0YXJ0O1xuICAgICAgICBmbGV4OiAxIDEgNDAlO1xuICAgIH1cblxuICAgICZfX3ZhbHVlIHtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kYmxhY2s7XG4gICAgICAgIGZvbnQtZmFtaWx5OiBtb25vc3BhY2U7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleDogMSAxIDQwJTtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgICB9XG59XG4iLCJAdXNlIFwiLi92YXJpYWJsZXNcIjtcblxuLnRpcC1ib3gge1xuICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGdhcDogMTJweDtcbiAgICBwYWRkaW5nOiAxNnB4O1xuICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgJl9fdGV4dCB7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAyMHB4O1xuICAgICAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcbiAgICB9XG5cbiAgICAmX19saW5rIHtcbiAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XG4gICAgfVxufVxuXG4udG9vbHRpcCB7XG4gICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmQ7XG4gICAgZm9udC1zaXplOiAxMnB4O1xuICAgIHBhZGRpbmc6IDhweCAxMnB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgIHRvcDogLTQ0cHg7XG4gICAgb3BhY2l0eTogMDtcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDEwcHgpO1xuICAgIHRyYW5zaXRpb246XG4gICAgICAgIG9wYWNpdHkgMC4ycyBlYXNlLFxuICAgICAgICB0cmFuc2Zvcm0gMC4ycyBlYXNlO1xuXG4gICAgJjo6YWZ0ZXIge1xuICAgICAgICBjb250ZW50OiBcIlwiO1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIGJvdHRvbTogLTEycHg7XG4gICAgICAgIGxlZnQ6IDUwJTtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpO1xuICAgICAgICBib3JkZXItd2lkdGg6IDZweDtcbiAgICAgICAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgICAgICAgYm9yZGVyLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCB0cmFuc3BhcmVudCB0cmFuc3BhcmVudCB0cmFuc3BhcmVudDtcbiAgICB9XG59XG5cbi50b29sdGlwLWNvbnRhaW5lciB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICY6aG92ZXIgLnRvb2x0aXAge1xuICAgICAgICBvcGFjaXR5OiAxO1xuICAgICAgICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }

}]);
//# sourceMappingURL=src_app_welcome-offline-import_welcome-offline-import_component_ts.js.map