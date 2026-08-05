"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_welcome-claim_welcome-claim_component_ts"],{

/***/ 46704
/*!**********************************************************!*\
  !*** ./src/app/welcome-claim/welcome-claim.component.ts ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WelcomeClaimComponent: () => (/* binding */ WelcomeClaimComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 33900);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/progress-spinner */ 41134);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 34487);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var app_domain_selection_modal_domain_selection_modal_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! app/domain-selection-modal/domain-selection-modal.component */ 74232);
/* harmony import */ var app_pipes_zelf_name_pipe__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! app/pipes/zelf-name.pipe */ 20655);
/* harmony import */ var app_welcome_available_welcome_available_content_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! app/welcome-available/welcome-available-content.component */ 85220);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var app_captcha_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! app/captcha.service */ 29569);
/* harmony import */ var app_chrome_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! app/chrome.service */ 85043);
/* harmony import */ var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/bottom-sheet */ 15244);
/* harmony import */ var app_domain_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! app/domain.service */ 4813);
/* harmony import */ var app_http_wrapper_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! app/http-wrapper.service */ 84099);
/* harmony import */ var app_tags_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! app/tags.service */ 73768);
/* harmony import */ var app_vault_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! app/vault.service */ 19519);
/* harmony import */ var app_wallet_service__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! app/wallet.service */ 69556);


























const _c0 = () => ["/welcome"];
const _c1 = (a0, a1) => ({
  "welcome-claim__step--active": a0,
  "welcome-claim__step--exit": a1
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
function WelcomeClaimComponent_div_0_ng_container_71_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](1, "span", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](2, "mat-spinner", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementContainerEnd"]();
  }
}
function WelcomeClaimComponent_div_0_ng_template_72_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "button", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](1, "svg", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](2, "path", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    let tmp_4_0;
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ((tmp_4_0 = ctx_r1.form.get("tagName")) == null ? null : tmp_4_0.invalid) || ctx_r1.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵattribute"]("aria-label", t_r3("welcome.search_name_aria"));
  }
}
function WelcomeClaimComponent_div_0_div_74__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "svg", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](1, "path", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
}
function WelcomeClaimComponent_div_0_div_74__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "svg", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](1, "path", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
}
function WelcomeClaimComponent_div_0_div_74_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](t_r3("welcome.tag_name_available"));
  }
}
function WelcomeClaimComponent_div_0_div_74_span_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](t_r3("welcome.tag_name_taken"));
  }
}
function WelcomeClaimComponent_div_0_div_74_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "div", 49)(1, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtemplate"](2, WelcomeClaimComponent_div_0_div_74__svg_svg_2_Template, 2, 0, "svg", 51)(3, WelcomeClaimComponent_div_0_div_74__svg_svg_3_Template, 2, 0, "svg", 51)(4, WelcomeClaimComponent_div_0_div_74_span_4_Template, 2, 1, "span", 43)(5, WelcomeClaimComponent_div_0_div_74_span_5_Template, 2, 1, "span", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpureFunction2"](5, _c4, ctx_r1.isAvailable, !ctx_r1.isAvailable));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngIf", ctx_r1.isAvailable);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngIf", !ctx_r1.isAvailable);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngIf", ctx_r1.isAvailable);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngIf", !ctx_r1.isAvailable);
  }
}
function WelcomeClaimComponent_div_0_ng_container_88_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](1, "label", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](2, "input", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](3, "svg", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](4, "polyline", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](5, "span", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](6, "button", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function WelcomeClaimComponent_div_0_ng_container_88_Template_button_click_6_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵresetView"](ctx_r1.goToSecurity());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](8, "button", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function WelcomeClaimComponent_div_0_ng_container_88_Template_button_click_8_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵresetView"](ctx_r1.goToImport());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    let tmp_5_0;
    let tmp_7_0;
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("innerHTML", t_r3("common.agree_to_terms_and_conditions"), _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵsanitizeHtml"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", !((tmp_5_0 = ctx_r1.form.get("termsAndConditions")) == null ? null : tmp_5_0.value) || ctx_r1.loading || ctx_r1.loadingReferral);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", t_r3("common.create_a_new_wallet"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", !((tmp_7_0 = ctx_r1.form.get("termsAndConditions")) == null ? null : tmp_7_0.value) || ctx_r1.loading || ctx_r1.loadingReferral);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", t_r3("common.import_a_wallet"), " ");
  }
}
function WelcomeClaimComponent_div_0_ng_container_89_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](1, "button", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function WelcomeClaimComponent_div_0_ng_container_89_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵresetView"](ctx_r1.goToRegistered());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("disabled", ctx_r1.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", t_r3("welcome.enter_with_zelf_id"), " ");
  }
}
function WelcomeClaimComponent_div_0_div_90_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "div", 62)(1, "welcome-available-content", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("clearInvalidReferralEvent", function WelcomeClaimComponent_div_0_div_90_Template_welcome_available_content_clearInvalidReferralEvent_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵresetView"](ctx_r1.clearInvalidReferral());
    })("sanitizeZelfNameEvent", function WelcomeClaimComponent_div_0_div_90_Template_welcome_available_content_sanitizeZelfNameEvent_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵresetView"](ctx_r1.sanitizeReferralName());
    })("searchZelfName", function WelcomeClaimComponent_div_0_div_90_Template_welcome_available_content_searchZelfName_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵresetView"](ctx_r1.searchReferralName($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("form", ctx_r1.form)("invalidReferral", ctx_r1.invalidReferral)("loading", ctx_r1.loading)("loadingReferral", ctx_r1.loadingReferral)("zelfNameObject", ctx_r1.referralTagModel);
  }
}
function WelcomeClaimComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](0, "div", 2)(1, "div", 3)(2, "div", 4)(3, "button", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function WelcomeClaimComponent_div_0_Template_button_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵresetView"](ctx_r1.step === 2 ? ctx_r1.goBackToSearch() : null);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](4, "svg", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](5, "path", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](6, "div", 8)(7, "div", 9)(8, "div", 10)(9, "h2", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](11, "p", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](13, "div", 13)(14, "div", 14)(15, "div", 15)(16, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](17, "L");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](18, "div", 17)(19, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](21, "lowercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](22, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](24, "div", 20)(25, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](26, "J");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](27, "div", 17)(28, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](29);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](30, "lowercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](31, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](32);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](33, "div", 21)(34, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](35, "A");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](36, "div", 17)(37, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](38);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](39, "lowercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](40, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](41);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](42, "div", 22)(43, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](44, "C");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](45, "div", 17)(46, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](47);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](48, "lowercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](49, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](50);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](51, "div", 23)(52, "div", 24)(53, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](54, "?");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](55, "div", 17)(56, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](57);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](58, "zelfName");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](59, "lowercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](60, "span", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](61);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](62, "form", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("ngSubmit", function WelcomeClaimComponent_div_0_Template_form_ngSubmit_62_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵresetView"](ctx_r1.searchZelfName($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](63, "div", 27)(64, "input", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("input", function WelcomeClaimComponent_div_0_Template_input_input_64_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵresetView"](ctx_r1.sanitizeZelfName());
    })("keydown.enter", function WelcomeClaimComponent_div_0_Template_input_keydown_enter_64_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵresetView"](ctx_r1.searchZelfName($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](65, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("mouseenter", function WelcomeClaimComponent_div_0_Template_div_mouseenter_65_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵresetView"](ctx_r1.domainHover = true);
    })("mouseleave", function WelcomeClaimComponent_div_0_Template_div_mouseleave_65_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵresetView"](ctx_r1.domainHover = false);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](66, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function WelcomeClaimComponent_div_0_Template_div_click_66_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵresetView"](ctx_r1.openDomainSelectionModal());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](67);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](68, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵlistener"]("click", function WelcomeClaimComponent_div_0_Template_span_click_68_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
      $event.stopPropagation();
      return _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵresetView"](ctx_r1.openDomainSelectionModal());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](69, "svg", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](70, "path", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtemplate"](71, WelcomeClaimComponent_div_0_ng_container_71_Template, 3, 0, "ng-container", 34)(72, WelcomeClaimComponent_div_0_ng_template_72_Template, 3, 2, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtemplate"](74, WelcomeClaimComponent_div_0_div_74_Template, 6, 8, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](75, "div", 36)(76, "div", 37)(77, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](78);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](79, "h2", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](80);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](81, "zelfName");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipe"](82, "lowercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](83, "p", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtext"](84);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelement"](85, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementStart"](86, "form", 41)(87, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtemplate"](88, WelcomeClaimComponent_div_0_ng_container_88_Template, 10, 5, "ng-container", 43)(89, WelcomeClaimComponent_div_0_ng_container_89_Template, 3, 2, "ng-container", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtemplate"](90, WelcomeClaimComponent_div_0_div_90_Template, 2, 5, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    let tmp_7_0;
    let tmp_9_0;
    let tmp_11_0;
    let tmp_13_0;
    let tmp_15_0;
    let tmp_22_0;
    let tmp_29_0;
    const t_r3 = ctx.$implicit;
    const searchBtn_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵreference"](73);
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("routerLink", ctx_r1.step === 1 ? _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpureFunction0"](50, _c0) : null);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpureFunction2"](51, _c1, ctx_r1.step === 1, ctx_r1.step === 2));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](ctx_r1.isEnterMode ? t_r3("welcome.enter_with_zelf_id") || "Enter your Zelf ID" : t_r3("welcome.choose_tag_name_title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](ctx_r1.isEnterMode ? t_r3("welcome.enter_tag_name_subtitle") || "Enter your existing Zelf ID to login" : t_r3("welcome.choose_tag_name_subtitle"));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind1"](21, 34, "miguel." + (((tmp_7_0 = ctx_r1.form.get("domain")) == null ? null : tmp_7_0.value) || "zelf")));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](t_r3("common.authorized"));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind1"](30, 36, "johan." + (((tmp_9_0 = ctx_r1.form.get("domain")) == null ? null : tmp_9_0.value) || "zelf")));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](t_r3("common.authorized"));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind1"](39, 38, "anuar." + (((tmp_11_0 = ctx_r1.form.get("domain")) == null ? null : tmp_11_0.value) || "zelf")));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](t_r3("common.authorized"));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind1"](48, 40, "carlos." + (((tmp_13_0 = ctx_r1.form.get("domain")) == null ? null : tmp_13_0.value) || "zelf")));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](t_r3("common.authorized"));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind1"](58, 42, ((tmp_15_0 = ctx_r1.form.get("tagName")) == null ? null : tmp_15_0.value) || t_r3("welcome.preview_name_placeholder")), ".", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind1"](59, 44, ((tmp_15_0 = ctx_r1.form.get("domain")) == null ? null : tmp_15_0.value) || "zelf"));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate"](t_r3("common.available"));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("formGroup", ctx_r1.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpureFunction2"](54, _c2, ctx_r1.availabilityChecked && ctx_r1.isAvailable, ctx_r1.availabilityChecked && !ctx_r1.isAvailable));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("placeholder", t_r3("welcome.choose_tag_name_placeholder"))("maxlength", ctx_r1.getMaxTagNameLength())("minlength", ctx_r1.getMinTagNameLength());
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](".", ((tmp_22_0 = ctx_r1.form.get("domain")) == null ? null : tmp_22_0.value) || "zelf");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngIf", ctx_r1.loading)("ngIfElse", searchBtn_r7);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngIf", ctx_r1.availabilityChecked);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpureFunction2"](57, _c3, ctx_r1.step === 2, ctx_r1.step === 2));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngClass", ctx_r1.isEnterMode ? "zelf-chip--info" : "zelf-chip--success");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", ctx_r1.isEnterMode ? t_r3("welcome.found") || "Found" : t_r3("common.available"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind1"](81, 46, ctx_r1.checkedTagName), ".", _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵpipeBind1"](82, 48, ((tmp_29_0 = ctx_r1.form.get("domain")) == null ? null : tmp_29_0.value) || "zelf"));
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtextInterpolate1"](" ", ctx_r1.isEnterMode ? t_r3("welcome.login_to_this_domain") || "Login to access your wallet" : t_r3("welcome.you_will_register_this_domain"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("formGroup", ctx_r1.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngIf", !ctx_r1.isEnterMode);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngIf", ctx_r1.isEnterMode);
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵproperty"]("ngIf", !ctx_r1.isEnterMode);
  }
}
class WelcomeClaimComponent {
  _activatedRoute;
  _captchaService;
  _chromeService;
  _bottomSheet;
  _domainService;
  _formBuilder;
  _httpWrapperService;
  _router;
  _tagsService;
  _vaultService;
  _walletService;
  unsubscriber$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
  _invalidTimeout;
  availableDomains = [];
  currentDomainConfig = null;
  domain = "zelf";
  domainHover = false;
  form;
  loading = false;
  // Availability state
  availabilityChecked = false;
  isAvailable = false;
  checkedTagName = "";
  // Step state: 1 = search, 2 = confirm
  step = 1;
  isEnterMode = false;
  // Step 2 (confirm) state — absorbed from welcome-available
  loadingReferral = false;
  invalidReferral = false;
  referralTagModel = null;
  constructor(_activatedRoute, _captchaService, _chromeService, _bottomSheet, _domainService, _formBuilder, _httpWrapperService, _router, _tagsService, _vaultService, _walletService) {
    this._activatedRoute = _activatedRoute;
    this._captchaService = _captchaService;
    this._chromeService = _chromeService;
    this._bottomSheet = _bottomSheet;
    this._domainService = _domainService;
    this._formBuilder = _formBuilder;
    this._httpWrapperService = _httpWrapperService;
    this._router = _router;
    this._tagsService = _tagsService;
    this._vaultService = _vaultService;
    this._walletService = _walletService;
    this._initForm();
  }
  ngOnInit() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this._activatedRoute.queryParams.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.takeUntil)(_this.unsubscriber$)).subscribe(params => {
        if (params["mode"] === "enter") {
          _this.isEnterMode = true;
        } else {
          _this.isEnterMode = false;
        }
      });
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
    clearTimeout(this._invalidTimeout);
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
      // Step 2 fields
      referralName: ["", _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.maxLength(32)],
      termsAndConditions: [false, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.requiredTrue]
    });
    this.form.get("domain")?.valueChanges.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.takeUntil)(this.unsubscriber$)).subscribe(domain => {
      this._updateTagNameValidators(domain);
    });
    // Reset availability when tagName changes
    this.form.get("tagName")?.valueChanges.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.takeUntil)(this.unsubscriber$)).subscribe(() => {
      if (this.step === 2) {
        // Go back to step 1 when editing the name
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
      // Tag is taken — just update status, don't touch the form
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
          if (_this5.isEnterMode) {
            if (isTaken) {
              // Enter Mode & Found -> set tag data and go straight to registered/login flow
              yield _this5._existingTagName(response?.data);
              _this5.loading = false;
              yield _this5.goToRegistered();
              return;
            } else {
              // Enter Mode & Available -> Not Found! The user thought they had it, so let them create it.
              _this5.isEnterMode = false; // Transition to normal claim flow organically
              _this5.loading = false;
              // Proceed exactly as Claim mode would when available
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
              _this5.availabilityChecked = true;
              _this5.isAvailable = true;
              _this5.checkedTagName = tagName;
              setTimeout(() => {
                _this5.step = 2;
              }, 800);
              return;
            }
          }
          // Standard Claim logic
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
          // Show availability inline, then auto-advance to step 2
          _this5.availabilityChecked = true;
          _this5.isAvailable = true;
          _this5.checkedTagName = tagName;
          // Auto-advance to confirm step after a brief pause
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
  // --- Step transitions ---
  goBackToSearch() {
    this.step = 1;
  }
  // --- Step 2: Confirm actions (absorbed from welcome-available) ---
  goToSecurity() {
    var _this6 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this6._tagsService.setFlow("create");
      _this6._router.navigate(["/security"]);
    })();
  }
  goToRegistered() {
    var _this7 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this7._tagsService.setFlow("unlock");
      _this7._router.navigate(["/welcome", "registered"]);
    })();
  }
  goToImport() {
    var _this8 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this8._tagsService.setFlow("import");
      _this8._router.navigate(["/welcome", "import"]);
    })();
  }
  // --- Referral logic (absorbed from welcome-available) ---
  _setInvalidReferral() {
    this.invalidReferral = true;
    this.referralTagModel = null;
    this._invalidTimeout = setTimeout(() => {
      this.invalidReferral = false;
    }, 5000);
  }
  clearInvalidReferral() {
    clearTimeout(this._invalidTimeout);
    this.invalidReferral = false;
    this.referralTagModel = null;
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
  sanitizeReferralName() {
    this.clearInvalidReferral();
    const referralNameCtrl = this.form.get("referralName");
    if (!referralNameCtrl) return;
    const sanitizedValue = referralNameCtrl.value.replace(/[^a-zA-Z0-9.-]|^[^a-zA-Z]+/g, "").toLowerCase().trim();
    referralNameCtrl.patchValue(sanitizedValue, {
      emitEvent: false
    });
    if (!sanitizedValue) referralNameCtrl.markAsPristine();
  }
  searchReferralName(event) {
    var _this9 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const referralNameCtrl = _this9.form.get("referralName");
      if (!referralNameCtrl) return;
      if (!referralNameCtrl.value || referralNameCtrl.invalid) {
        _this9.form.patchValue({
          referralName: ""
        });
        _this9.form.markAsPristine();
      }
      if (_this9.loading || _this9.loadingReferral || !referralNameCtrl?.dirty || !referralNameCtrl?.value) return;
      event.preventDefault();
      _this9.loadingReferral = true;
      const referralTagNameInput = referralNameCtrl.value.toLowerCase().trim();
      let referralDomain;
      let referralTagName;
      if (referralTagNameInput.includes(".")) {
        const parsedReferral = _this9._tagsService.parseTagName(referralTagNameInput);
        referralDomain = parsedReferral.domain;
        referralTagName = parsedReferral.name;
      } else {
        referralDomain = _this9.form.value.domain || "zelf";
        referralTagName = referralTagNameInput;
      }
      let captchaToken = "";
      if (!_this9._chromeService.isExtension) {
        try {
          const captchaKey = referralNameCtrl.value.replace(".", "_");
          captchaToken = yield _this9._captchaService.executeRecaptcha(captchaKey);
        } catch (error) {
          console.error("reCAPTCHA failed:", error);
        }
      }
      _this9._tagsService.searchTag({
        tagName: referralTagName,
        domain: referralDomain,
        captchaToken: captchaToken
      }).then(response => {
        if (response?.data.available) {
          _this9.form.patchValue({
            referralName: ""
          });
          _this9.form.markAsPristine();
          _this9.loadingReferral = false;
          _this9.referralTagModel = null;
          _this9._setInvalidReferral();
          return;
        }
        _this9.form.markAsPristine();
        const referralTagModel = _this9._tagsService.createTagModelFromSearchResponse(response.data);
        if (referralTagModel) {
          _this9.referralTagModel = referralTagModel;
          const refName = referralTagModel.publicData.tagName || referralTagModel.name;
          _this9._tagsService.setReferral(refName);
        } else {
          _this9.referralTagModel = null;
          _this9._setInvalidReferral();
        }
        _this9.loadingReferral = false;
      }).catch(exception => {
        console.error({
          exception
        });
        _this9.form.patchValue({
          referralName: ""
        });
        _this9.form.markAsPristine();
        _this9.loadingReferral = false;
        _this9.referralTagModel = null;
        _this9._setInvalidReferral();
      });
    })();
  }
  openDomainSelectionModal() {
    const dialogData = {
      domains: this.availableDomains,
      selectedDomain: this.form.get("domain")?.value || "zelf"
    };
    const bottomSheetRef = this._bottomSheet.open(app_domain_selection_modal_domain_selection_modal_component__WEBPACK_IMPORTED_MODULE_9__.DomainSelectionModalComponent, {
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
  static ɵfac = function WelcomeClaimComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || WelcomeClaimComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_14__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdirectiveInject"](app_captcha_service__WEBPACK_IMPORTED_MODULE_15__.CaptchaService), _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdirectiveInject"](app_chrome_service__WEBPACK_IMPORTED_MODULE_16__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdirectiveInject"](_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_17__.MatBottomSheet), _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdirectiveInject"](app_domain_service__WEBPACK_IMPORTED_MODULE_18__.DomainService), _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdirectiveInject"](app_http_wrapper_service__WEBPACK_IMPORTED_MODULE_19__.HttpWrapperService), _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_14__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdirectiveInject"](app_tags_service__WEBPACK_IMPORTED_MODULE_20__.TagsService), _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdirectiveInject"](app_vault_service__WEBPACK_IMPORTED_MODULE_21__.VaultService), _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdirectiveInject"](app_wallet_service__WEBPACK_IMPORTED_MODULE_22__.WalletService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵdefineComponent"]({
    type: WelcomeClaimComponent,
    selectors: [["welcome-claim"]],
    decls: 1,
    vars: 0,
    consts: [["searchBtn", ""], ["class", "zelf-card welcome-claim", 4, "transloco"], [1, "zelf-card", "welcome-claim"], [1, "zelf-card__header"], [1, "welcome-claim__header-button"], [1, "zelf-icon-button", "zelf-icon-button--40", 3, "click", "routerLink"], ["viewBox", "0 0 22 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"], [1, "welcome-claim__content"], [1, "welcome-claim__step", 3, "ngClass"], [1, "welcome-claim__heading"], [1, "zelf-card__title", "welcome-claim__title"], [1, "zelf-card__subtitle", "welcome-claim__subtitle"], [1, "welcome-claim__name-cards"], [1, "name-cards__grid"], [1, "name-card", "name-card--float-1"], [1, "name-card__avatar", "name-card__avatar--orange"], [1, "name-card__info"], [1, "name-card__name"], [1, "name-card__status"], [1, "name-card", "name-card--float-2"], [1, "name-card", "name-card--float-3"], [1, "name-card", "name-card--float-4"], [1, "name-card", "name-card--active", "name-card--float-5"], [1, "name-card__avatar", "name-card__avatar--white"], [1, "name-card__status", "name-card__status--active"], [1, "welcome-claim__form", 3, "ngSubmit", "formGroup"], [1, "zelf-input", "welcome-claim__input", 3, "ngClass"], ["autocomplete", "off", "formControlName", "tagName", "id", "tagName", "name", "tagName", "required", "", 1, "zelf-input__control", "welcome-claim__input-control", 3, "input", "keydown.enter", "placeholder", "maxlength", "minlength"], [1, "zelf-input__postfix", "zelf-input__postfix--dropdown", "mr-2", 3, "mouseenter", "mouseleave"], [1, "domain-display", 3, "click"], [1, "dropdown-icon-container", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "height", "20px", "viewBox", "0 -960 960 960", "width", "20px"], ["d", "M480-384 288-576h384L480-384Z"], [4, "ngIf", "ngIfElse"], ["class", "welcome-claim__status", 4, "ngIf"], [1, "welcome-claim__step", "welcome-claim__step-2", 3, "ngClass"], [1, "welcome-claim__identity"], [1, "zelf-chip", 3, "ngClass"], [1, "zelf-card__title"], [1, "welcome-claim__divider"], [1, "welcome-claim__confirm-form", 3, "formGroup"], [1, "welcome-claim__buttons"], [4, "ngIf"], ["class", "welcome-claim__referral", 4, "ngIf"], [1, "dropdown-icon-container"], ["mode", "indeterminate", "diameter", "24"], ["type", "submit", 1, "search-button-container", 3, "disabled"], ["d", "M765-144 526-383q-30 22-65.79 34.5-35.79 12.5-76.18 12.5Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.03q0 40.39-12.5 76.18Q599-464 577-434l239 239-51 51ZM384-408q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z"], [1, "welcome-claim__status"], [1, "welcome-claim__status-chip", 3, "ngClass"], ["width", "16", "height", "16", "viewBox", "0 0 20 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg", 4, "ngIf"], ["width", "16", "height", "16", "viewBox", "0 0 20 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM7.29 14.29L3.7 10.7C3.31 10.31 3.31 9.68 3.7 9.29C4.09 8.9 4.72 8.9 5.11 9.29L8 12.17L14.88 5.29C15.27 4.9 15.9 4.9 16.29 5.29C16.68 5.68 16.68 6.31 16.29 6.7L8.7 14.29C8.32 14.68 7.68 14.68 7.29 14.29Z", "fill", "currentColor"], ["d", "M10 0C4.47 0 0 4.47 0 10C0 15.53 4.47 20 10 20C15.53 20 20 15.53 20 10C20 4.47 15.53 0 10 0ZM14.3 14.3C13.91 14.69 13.28 14.69 12.89 14.3L10 11.41L7.11 14.3C6.72 14.69 6.09 14.69 5.7 14.3C5.31 13.91 5.31 13.28 5.7 12.89L8.59 10L5.7 7.11C5.31 6.72 5.31 6.09 5.7 5.7C6.09 5.31 6.72 5.31 7.11 5.7L10 8.59L12.89 5.7C13.28 5.31 13.91 5.31 14.3 5.7C14.69 6.09 14.69 6.72 14.3 7.11L11.41 10L14.3 12.89C14.68 13.27 14.68 13.91 14.3 14.3Z", "fill", "currentColor"], [1, "zelf-checkbox"], ["formControlName", "termsAndConditions", "id", "termsAndConditions", "name", "termsAndConditions", "type", "checkbox"], ["viewBox", "0 0 21 21"], ["points", "5 10.75 8.5 14.25 16 6"], [3, "innerHTML"], ["mat-flat-button", "", 1, "zelf-button", "zelf-button--primary", "zelf-button--wide", 3, "click", "disabled"], ["mat-flat-button", "", 1, "zelf-button", "zelf-button--outlined", "zelf-button--wide", 3, "click", "disabled"], [1, "welcome-claim__referral"], [3, "clearInvalidReferralEvent", "sanitizeZelfNameEvent", "searchZelfName", "form", "invalidReferral", "loading", "loadingReferral", "zelfNameObject"]],
    template: function WelcomeClaimComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_13__["ɵɵtemplate"](0, WelcomeClaimComponent_div_0_Template, 91, 60, "div", 1);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_material_button__WEBPACK_IMPORTED_MODULE_5__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_5__.MatButton, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_6__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_6__.MatProgressSpinner, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.CheckboxControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.MinLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormControlName, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterLink, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_8__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_8__.TranslocoDirective, app_welcome_available_welcome_available_content_component__WEBPACK_IMPORTED_MODULE_11__.WelcomeAvailableContentComponent, _angular_common__WEBPACK_IMPORTED_MODULE_3__.LowerCasePipe, app_pipes_zelf_name_pipe__WEBPACK_IMPORTED_MODULE_10__.ZelfNamePipe],
    styles: ["[_ngcontent-%COMP%]:root {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc);\n}\n\n.zelf-button-external-link[_ngcontent-%COMP%] {\n  display: block;\n}\n.zelf-button-external-link--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.zelf-button[_ngcontent-%COMP%] {\n  align-items: center;\n  border-radius: 16px;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  gap: 8px;\n  height: 56px;\n  justify-content: center;\n  outline: none;\n  padding: 8px 24px;\n  text-align: center;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.zelf-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-button[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: inherit;\n}\n.zelf-button__text--margin-right[_ngcontent-%COMP%] {\n  margin-right: 1rem;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-button--thin[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  padding: 12px 16px;\n}\n.zelf-button--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.zelf-button--wide.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-button--primary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button, #181818) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--primary[_ngcontent-%COMP%]:active {\n  --mdc-filled-button-container-color: var(--zns-theme-text-muted, #96939e) !important;\n  background-color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-hover, #ff5721) !important;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff) !important;\n  stroke: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-text-secondary, #73777f) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-text-secondary, #73777f) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--secondary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-button-secondary-text, #495057) !important;\n  background-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  color: var(--zns-theme-button-secondary-text, #495057) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-secondary-text, #495057);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus, .zelf-button--secondary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-border, #e3e3e3) !important;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]:focus, .zelf-button--tertiary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%] {\n  --mdc-outlined-button-label-text-color: var(--zns-theme-button, #181818) !important;\n  --mdc-outlined-button-outline-color: var(--zns-theme-border, #e3e3e3) !important;\n  border: 1px solid var(--zns-theme-button, #181818) !important;\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-button, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button, #181818);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus, .zelf-button--outlined[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--outlined[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--outlined[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%] {\n  border: none !important;\n  background-color: transparent !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--red[_ngcontent-%COMP%]:focus, .zelf-button--red[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n}\n.zelf-button--red[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e);\n}\n.zelf-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n}\n\n.zelf-icon-button[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  align-items: center;\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  border-radius: 56px;\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  font-weight: 600;\n  gap: 16px;\n  height: 56px;\n  justify-content: center;\n  min-height: 56px;\n  min-width: 56px;\n  outline: none;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  -webkit-user-select: none;\n          user-select: none;\n  width: 56px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-icon-button.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: var(--zns-theme-text, #181818);\n  height: 24px;\n  width: 24px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%] {\n  height: 40px;\n  min-height: 40px;\n  min-width: 40px;\n  width: 40px;\n  border-radius: 40px;\n  padding: 0 8px;\n}\n.zelf-icon-button--40.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 14px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  height: 20px;\n  width: 20px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e) !important;\n  stroke: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:active {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus, .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%] {\n  background-color: transparent !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]:focus, .zelf-icon-button--transparent[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--text[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: initial !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  height: auto;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n  width: auto;\n}\n\n.zelf-icon-button-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:first-child {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:last-child {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.zelf-action-button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: 8px;\n}\n.zelf-action-button__icon[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  background: var(--zns-theme-card, #ffffff);\n  border-radius: 32px;\n  outline: 1px var(--zns-theme-border, #e3e3e3) solid;\n  outline-offset: -1px;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  cursor: pointer;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n@media (max-width: 600px) {\n  .zelf-action-button__icon[_ngcontent-%COMP%] {\n    padding: 8px 14px;\n  }\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-size: 24px;\n  line-height: 1;\n  font-variation-settings: \"FILL\" 0, \"wght\" 400, \"GRAD\" 0, \"opsz\" 24;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-primary, #181818);\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .zelf-action-button__text[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon-box[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  position: relative;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n}\n.zelf-action-button__text[_ngcontent-%COMP%] {\n  width: auto;\n  white-space: nowrap;\n  text-align: center;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 11px;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  line-height: 16px;\n  letter-spacing: 0.5px;\n  word-wrap: normal;\n}\n\n[_nghost-%COMP%] {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  justify-content: center;\n}\n\n.welcome-claim[_ngcontent-%COMP%] {\n  min-height: 75vh;\n  display: flex;\n  justify-content: flex-start;\n  overflow: hidden;\n}\n.welcome-claim__header-button[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n  flex-direction: row;\n  width: 100%;\n}\n.welcome-claim__content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  width: 100%;\n  position: relative;\n}\n.welcome-claim__step[_ngcontent-%COMP%] {\n  display: none;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-between;\n  flex-grow: 1;\n  opacity: 0;\n  width: 100%;\n}\n.welcome-claim__step--active[_ngcontent-%COMP%] {\n  display: flex;\n  opacity: 1;\n  animation: _ngcontent-%COMP%_stepFadeIn 0.35s cubic-bezier(0.25, 0.4, 0.7, 1) forwards;\n}\n.welcome-claim__step--exit[_ngcontent-%COMP%] {\n  display: none;\n}\n.welcome-claim__step--enter[_ngcontent-%COMP%] {\n  display: flex;\n  animation: _ngcontent-%COMP%_stepSlideUp 0.4s cubic-bezier(0.25, 0.4, 0.7, 1) forwards;\n}\n.welcome-claim__name-cards[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  padding: calc(8px * var(--zns-space-scale, 1)) calc(4px * var(--zns-space-scale, 1));\n  margin-bottom: calc(8px * var(--zns-space-scale, 1));\n}\n.welcome-claim__heading[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  width: 100%;\n}\n.welcome-claim__title[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: calc(8px * var(--zns-space-scale, 1));\n}\n.welcome-claim__subtitle[_ngcontent-%COMP%] {\n  text-align: center;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 500;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  margin-bottom: 0;\n}\n.welcome-claim__form[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: calc(16px * var(--zns-space-scale, 1));\n}\n.welcome-claim__input[_ngcontent-%COMP%] {\n  width: 100%;\n  transition: border-color 300ms ease-in-out, box-shadow 300ms ease-in-out;\n}\n.welcome-claim__input--available[_ngcontent-%COMP%] {\n  border-color: var(--zns-theme-success, #1ea446) !important;\n  box-shadow: 0 0 0 1px var(--zns-theme-success, #1ea446);\n}\n.welcome-claim__input--taken[_ngcontent-%COMP%] {\n  border-color: var(--zns-theme-error, #dc362e) !important;\n  box-shadow: 0 0 0 1px var(--zns-theme-error, #dc362e);\n}\n.welcome-claim__input-control[_ngcontent-%COMP%] {\n  flex: 1 1 0;\n  min-width: 0;\n}\n.welcome-claim__status[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  justify-content: flex-start;\n  animation: _ngcontent-%COMP%_fadeInUp 300ms ease-out;\n}\n.welcome-claim__status-chip[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: calc(6px * var(--zns-space-scale, 1));\n  padding: calc(6px * var(--zns-space-scale, 1)) calc(12px * var(--zns-space-scale, 1));\n  border-radius: 20px;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  line-height: calc(16px * var(--zns-font-scale, 1));\n}\n.welcome-claim__status-chip--available[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed);\n  color: var(--zns-theme-success, #1ea446);\n}\n.welcome-claim__status-chip--taken[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee);\n  color: var(--zns-theme-error, #dc362e);\n}\n.welcome-claim__continue[_ngcontent-%COMP%] {\n  margin-top: calc(8px * var(--zns-space-scale, 1));\n}\n.welcome-claim__step-2[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.welcome-claim__identity[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  padding: calc(32px * var(--zns-space-scale, 1)) 0 calc(24px * var(--zns-space-scale, 1));\n  justify-content: center;\n}\n.welcome-claim__divider[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 1px;\n  background-color: var(--zns-theme-card-border, #eeedf1);\n  flex-shrink: 0;\n}\n.welcome-claim__confirm-form[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding-top: calc(16px * var(--zns-space-scale, 1));\n}\n.welcome-claim__buttons[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  width: 100%;\n  padding-bottom: calc(8px * var(--zns-space-scale, 1));\n}\n.welcome-claim__buttons[_ngcontent-%COMP%]     .zelf-button--primary[disabled] {\n  opacity: 1 !important;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.welcome-claim__buttons[_ngcontent-%COMP%]     .zelf-button--outlined[disabled] {\n  opacity: 1 !important;\n  border-color: var(--zns-theme-border, #e3e3e3) !important;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n  background-color: transparent !important;\n}\n.welcome-claim__referral[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  box-sizing: border-box;\n}\n\n\n\n[_nghost-%COMP%]     .zelf-input__postfix--dropdown {\n  min-width: calc(100px * var(--zns-space-scale, 1));\n  padding: calc(6px * var(--zns-space-scale, 1)) calc(6px * var(--zns-space-scale, 1)) calc(6px * var(--zns-space-scale, 1)) calc(14px * var(--zns-space-scale, 1));\n  background: #4277ff; \n\n  border-radius: 32px;\n  display: inline-flex;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n}\n\n.domain-display[_ngcontent-%COMP%] {\n  background: transparent;\n  color: #ffffff;\n  border: none;\n  outline: none;\n  font-family: var(--zns-theme-title-family, \"Menda\", \"Arial Black\", sans-serif), inherit;\n  font-weight: 800;\n  font-size: 14px;\n  line-height: 16px;\n  letter-spacing: 0.5px;\n  text-transform: uppercase;\n  cursor: pointer;\n  min-width: 40px;\n  padding: 0;\n  margin: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.dropdown-icon-container[_ngcontent-%COMP%] {\n  background: #ffffff;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 24px;\n  height: 24px;\n  cursor: pointer;\n  transition: transform 150ms ease-in-out;\n}\n.dropdown-icon-container[_ngcontent-%COMP%]:hover {\n  transform: scale(1.05);\n}\n.dropdown-icon-container[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n  fill: #4277ff !important;\n}\n.dropdown-icon-container[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  opacity: 0.5;\n}\n\n.search-button-container[_ngcontent-%COMP%] {\n  background: rgba(0, 0, 0, 0.15);\n  border: none;\n  outline: none;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 32px;\n  height: 32px;\n  cursor: pointer;\n  padding: 0;\n  transition: background-color 150ms ease-in-out;\n}\n.search-button-container[_ngcontent-%COMP%]:hover:not([disabled]) {\n  background: rgba(0, 0, 0, 0.25);\n}\n.search-button-container[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n}\n.search-button-container[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n  fill: #ffffff !important;\n}\n.search-button-container[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  opacity: 0.5;\n}\n\n@keyframes _ngcontent-%COMP%_fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(8px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_stepFadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_stepSlideUp {\n  from {\n    opacity: 0;\n    transform: translateY(24px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.name-cards__grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  width: 100%;\n}\n\n.name-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  padding: calc(12px * var(--zns-space-scale, 1)) calc(14px * var(--zns-space-scale, 1));\n  background: var(--zns-theme-card, #ffffff);\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: calc(12px * var(--zns-space-scale, 1));\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);\n  will-change: transform;\n}\n.name-card__avatar[_ngcontent-%COMP%] {\n  width: calc(40px * var(--zns-space-scale, 1));\n  height: calc(40px * var(--zns-space-scale, 1));\n  min-width: calc(40px * var(--zns-space-scale, 1));\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 700;\n  font-size: calc(15px * var(--zns-font-scale, 1));\n}\n.name-card__avatar--orange[_ngcontent-%COMP%] {\n  background-color: #f97316;\n  color: #fff;\n}\n.name-card__avatar--white[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-background, #ffffff);\n  color: var(--zns-theme-text-secondary, #73777f);\n  border: 1px dashed var(--zns-theme-text-muted, #96939e);\n}\n.name-card__info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n  min-width: 0;\n}\n.name-card__name[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 700;\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  line-height: calc(18px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-text, #181818);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.name-card__status[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 500;\n  font-size: calc(11px * var(--zns-font-scale, 1));\n  line-height: calc(16px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-text-secondary, #73777f);\n}\n.name-card__status--active[_ngcontent-%COMP%] {\n  color: var(--zns-theme-success, #1ea446);\n  font-weight: 600;\n}\n.name-card--active[_ngcontent-%COMP%] {\n  border: 1.5px dashed #f97316;\n  background: rgba(249, 115, 22, 0.04);\n}\n.name-card--float-1[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_floatCard1 4s ease-in-out infinite;\n}\n.name-card--float-2[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_floatCard2 5s ease-in-out infinite;\n}\n.name-card--float-3[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_floatCard3 4.5s ease-in-out 0.5s infinite;\n}\n.name-card--float-4[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_floatCard4 5.5s ease-in-out 1s infinite;\n}\n.name-card--float-5[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_floatCard5 6s ease-in-out 0.3s infinite;\n}\n\n@keyframes _ngcontent-%COMP%_floatCard1 {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-4px);\n  }\n}\n@keyframes _ngcontent-%COMP%_floatCard2 {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-6px);\n  }\n}\n@keyframes _ngcontent-%COMP%_floatCard3 {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-3px);\n  }\n}\n@keyframes _ngcontent-%COMP%_floatCard4 {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-5px);\n  }\n}\n@keyframes _ngcontent-%COMP%_floatCard5 {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-4px);\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX2J1dHRvbnMuc2NzcyIsIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX3ZhcmlhYmxlcy5zY3NzIiwid2VicGFjazovLy4vc3JjL2FwcC93ZWxjb21lLWNsYWltL3dlbGNvbWUtY2xhaW0uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxnRUMwQnVCO0FDM0IzQjs7QUZJQTtFQUNJLGNBQUE7QUVESjtBRkdJO0VBQ0ksV0FBQTtBRURSOztBRktBO0VBQ0ksbUJBQUE7RUFDQSxtQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLHVFQ0ljO0VESGQsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsUUFBQTtFQUNBLFlBQUE7RUFDQSx1QkFBQTtFQUNBLGFBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7VUFBQSxpQkFBQTtBRUZKO0FGSUk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLFFBQUE7QUVGUjtBRktJO0VBQ0ksU0FBQTtFQUNBLGNBQUE7QUVIUjtBRk9RO0VBQ0ksa0JBQUE7QUVMWjtBRlNJO0VBQ0ksNkJBQUE7RUFDQSwrQ0NsQmE7RURtQmIsZUFBQTtFQUNBLGdCQUFBO0VBQ0EscUJBQUE7RUFDQSxpQkFBQTtFQUNBLDZHQUNJO0FFUlo7QUZXUTtFQUNJLGVBQUE7QUVUWjtBRllRO0VBQ0ksOENDaENTO0FDc0JyQjtBRmFRO0VBQ0kscUNDdENBO0VEdUNBLGtEQ3hCRTtBQ2FkO0FGYVk7RUFDSSxvQ0MxQ0o7QUMrQlo7QUZlUTtFQUNJLG1CQUFBO0VBQ0Esc0RBQUE7QUViWjtBRmVZO0VBQ0ksMENDbERDO0FDcUNqQjtBRmtCSTtFQUNJLGtCQUFBO0VBQ0Esa0JBQUE7QUVoQlI7QUZtQkk7RUFDSSxXQUFBO0FFakJSO0FGbUJRO0VBQ0ksbUJBQUE7QUVqQlo7QUZxQkk7RUFFSSxnRkFBQTtFQUNBLCtFQUFBO0VBRUEs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QTJiTjtBQUNGO0FBeGJBO0VBQ0k7SUFFSSx3QkFBQTtFQXliTjtFQXZiRTtJQUNJLDJCQUFBO0VBeWJOO0FBQ0Y7QUF0YkE7RUFDSTtJQUVJLHdCQUFBO0VBdWJOO0VBcmJFO0lBQ0ksMkJBQUE7RUF1Yk47QUFDRjtBQXBiQTtFQUNJO0lBRUksd0JBQUE7RUFxYk47RUFuYkU7SUFDSSwyQkFBQTtFQXFiTjtBQUNGIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcIi4vdmFyaWFibGVzXCI7XG5cbjpyb290IHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbn1cblxuLnplbGYtYnV0dG9uLWV4dGVybmFsLWxpbmsge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuXG4gICAgJi0td2lkZSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cbn1cblxuLnplbGYtYnV0dG9uIHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBnYXA6IDhweDtcbiAgICBoZWlnaHQ6IDU2cHg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBwYWRkaW5nOiA4cHggMjRweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG5cbiAgICBzcGFuIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogOHB4O1xuICAgIH1cblxuICAgIHAge1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIGNvbG9yOiBpbmhlcml0O1xuICAgIH1cblxuICAgICZfX3RleHQge1xuICAgICAgICAmLS1tYXJnaW4tcmlnaHQge1xuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0taHlwZXJsaW5rIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIHBhZGRpbmc6IDhweCAxNnB4O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmLS1zbWFsbCB7XG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tdGhpbiB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgcGFkZGluZzogMTJweCAxNnB4O1xuICAgIH1cblxuICAgICYtLXdpZGUge1xuICAgICAgICB3aWR0aDogMTAwJTtcblxuICAgICAgICAmLnplbGYtYnV0dG9uLS1oeXBlcmxpbmsge1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXByaW1hcnkge1xuICAgICAgICAvLyBNREMgbWF0LWZsYXQtYnV0dG9uIHBhaW50cyB2aWEgQ1NTIHZhcmlhYmxlczsgYWxpZ24gd2l0aCBaZWxmIHRva2VucyAoYXZvaWRzIGRlZmF1bHQgTWF0ZXJpYWwgYmx1ZSkuXG4gICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b259ICFpbXBvcnRhbnQ7XG4gICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tbGFiZWwtdGV4dC1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQ2FyZH0gIWltcG9ydGFudDtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmFjdGl2ZSB7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXJ9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5fSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVDYXJkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc2Vjb25kYXJ5IHtcbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeX0gIWltcG9ydGFudDtcbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0fSAhaW1wb3J0YW50O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVDYXJkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJvcmRlcn0gIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10ZXJ0aWFyeSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3IgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tb3V0bGluZWQge1xuICAgICAgICAtLW1kYy1vdXRsaW5lZC1idXR0b24tbGFiZWwtdGV4dC1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9ufSAhaW1wb3J0YW50O1xuICAgICAgICAtLW1kYy1vdXRsaW5lZC1idXR0b24tb3V0bGluZS1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQm9yZGVyfSAhaW1wb3J0YW50O1xuXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b247XG4gICAgICAgIH1cblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1yZWQge1xuICAgICAgICBib3JkZXI6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tZXJyb3Ige1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc3VjY2VzcyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdExpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRjb3JyZWN0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1waWxsIHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBtaW4taGVpZ2h0OiAwO1xuICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgICAgIHBhZGRpbmc6IDRweCAxMnB4O1xuICAgIH1cbn1cblxuLnplbGYtaWNvbi1idXR0b24ge1xuICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyLXJhZGl1czogNTZweDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgZ2FwOiAxNnB4O1xuICAgIGhlaWdodDogNTZweDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBtaW4taGVpZ2h0OiA1NnB4O1xuICAgIG1pbi13aWR0aDogNTZweDtcbiAgICBvdXRsaW5lOiBub25lO1xuICAgIHRyYW5zaXRpb246XG4gICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICB3aWR0aDogNTZweDtcblxuICAgIHNwYW4ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgfVxuXG4gICAgJi56ZWxmLWljb24tYnV0dG9uLS1ib3JkZXItc29mdCB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgfVxuXG4gICAgc3ZnIHtcbiAgICAgICAgdHJhbnNpdGlvbjogZmlsbCAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgaGVpZ2h0OiAyNHB4O1xuICAgICAgICB3aWR0aDogMjRweDtcbiAgICB9XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tYm9yZGVyLXNvZnQge1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIH1cblxuICAgICYtLTQwIHtcbiAgICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgICBtaW4taGVpZ2h0OiA0MHB4O1xuICAgICAgICBtaW4td2lkdGg6IDQwcHg7XG4gICAgICAgIHdpZHRoOiA0MHB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA0MHB4O1xuICAgICAgICBwYWRkaW5nOiAwIDhweDtcblxuICAgICAgICAmLnplbGYtaWNvbi1idXR0b24tLWJvcmRlci1zb2Z0IHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgaGVpZ2h0OiAyMHB4O1xuICAgICAgICAgICAgd2lkdGg6IDIwcHg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1oeXBlcmxpbmsge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICAgICAgcGFkZGluZzogOHB4IDE2cHg7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICYtLXNtYWxsIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tcHJpbWFyeSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6YWN0aXZlIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc2Vjb25kYXJ5IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXIgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10cmFuc3BhcmVudCB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10ZXh0IHtcbiAgICAgICAgd2lkdGg6IGF1dG8gIWltcG9ydGFudDtcbiAgICAgICAgbWluLXdpZHRoOiBpbml0aWFsICFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgJi0tZXJyb3Ige1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc3VjY2VzcyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdExpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRjb3JyZWN0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1waWxsIHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBoZWlnaHQ6IGF1dG87XG4gICAgICAgIG1pbi1oZWlnaHQ6IDA7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgcGFkZGluZzogNHB4IDEycHg7XG4gICAgICAgIHdpZHRoOiBhdXRvO1xuICAgIH1cbn1cblxuLnplbGYtaWNvbi1idXR0b24tZ3JvdXAge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDA7XG5cbiAgICAuemVsZi1pY29uLWJ1dHRvbiB7XG4gICAgICAgICY6Zmlyc3QtY2hpbGQge1xuICAgICAgICAgICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDA7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6bm90KDpmaXJzdC1jaGlsZCk6bm90KDpsYXN0LWNoaWxkKSB7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpsYXN0LWNoaWxkIHtcbiAgICAgICAgICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAwO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uemVsZi1hY3Rpb24tYnV0dG9uIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogOHB4O1xuXG4gICAgJl9faWNvbiB7XG4gICAgICAgIHBhZGRpbmc6IDEwcHggMjBweDtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDMycHg7XG4gICAgICAgIG91dGxpbmU6IDFweCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyIHNvbGlkO1xuICAgICAgICBvdXRsaW5lLW9mZnNldDogLTFweDtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogdmFyaWFibGVzLiRtaW5TbWFsbCkge1xuICAgICAgICAgICAgcGFkZGluZzogOHB4IDE0cHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBmaWxsIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgICAgIH1cblxuICAgICAgICAubWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBmb250LXNpemU6IDI0cHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcbiAgICAgICAgICAgIGZvbnQtdmFyaWF0aW9uLXNldHRpbmdzOlxuICAgICAgICAgICAgICAgIFwiRklMTFwiIDAsXG4gICAgICAgICAgICAgICAgXCJ3Z2h0XCIgNDAwLFxuICAgICAgICAgICAgICAgIFwiR1JBRFwiIDAsXG4gICAgICAgICAgICAgICAgXCJvcHN6XCIgMjQ7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHByaW1hcnlDb2xvcjtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQge1xuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLnplbGYtYWN0aW9uLWJ1dHRvbl9fdGV4dCB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9faWNvbi1ib3gge1xuICAgICAgICB3aWR0aDogMjhweDtcbiAgICAgICAgaGVpZ2h0OiAyOHB4O1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX190ZXh0IHtcbiAgICAgICAgd2lkdGg6IGF1dG87XG4gICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE2cHg7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjVweDtcbiAgICAgICAgd29yZC13cmFwOiBub3JtYWw7XG4gICAgfVxufVxuIiwiJHByaW1hcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXByaW1hcnksICMxODE4MTgpO1xuJHByaW1hcnlMaWdodDogI2RhZGRmYTtcbiRzZWNvbmRhcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXNlY29uZGFyeSwgI2ZmNTcyMSk7XG4kc2Vjb25kYXJ5Q29sb3JMaWdodDogI2Y2ZTVlMDtcblxuJGNvcnJlY3Q6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLCAjMWVhNDQ2KTtcbiRjb3JyZWN0RGFyazogIzBmNTIyMztcbiRjb3JyZWN0TGlnaHQ6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLXRleHQsICNlN2Y4ZWQpO1xuXG4kZXJyb3I6IHZhcigtLXpucy10aGVtZS1lcnJvciwgI2RjMzYyZSk7XG4kZXJyb3JEYXJrOiAjNjAxNDEwO1xuJGVycm9yTGlnaHQ6IHZhcigtLXpucy10aGVtZS1lcnJvci10ZXh0LCAjZmNlZWVlKTtcblxuJHdhcm5pbmc6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLCAjZGU2ODAwKTtcbiR3YXJuaW5nRGFyazogIzRhMjEwYTtcbiR3YXJuaW5nTGlnaHQ6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLXRleHQsICNmZmVlZTkpO1xuXG4kaW5mbzogIzM5OThkMztcbiRpbmZvRGFyazogIzAwNGE3NztcbiRpbmZvTGlnaHQ6ICNlY2YzZmU7XG5cbiRibGFjazogIzE4MTgxODtcbiR3aGl0ZTogI2ZmZmZmZjtcblxuJHRoZW1lQm9keUZhbWlseTogdmFyKC0tem5zLXRoZW1lLWJvZHktZmFtaWx5LCBcIlBvcHBpbnNcIiwgQXJpYWwsIHNhbnMtc2VyaWYpO1xuJHRoZW1lVGl0bGVGYW1pbHk6IHZhcigtLXpucy10aGVtZS10aXRsZS1mYW1pbHksIFwiTWVuZGFcIiwgXCJBcmlhbCBCbGFja1wiLCBzYW5zLXNlcmlmKTtcbiR0aGVtZU1vbm9zcGFjZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLW1vbm9zcGFjZS1mYW1pbHksIFwiQ291cmllciBOZXdcIiwgQ291cmllciwgbW9ub3NwYWNlKTtcblxuJHRoZW1lQmFja2dyb3VuZDogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQsICNmZmZmZmYpO1xuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQtc2Vjb25kYXJ5LCAjZjlmOWZjKTtcblxuJHRoZW1lVGV4dDogdmFyKC0tem5zLXRoZW1lLXRleHQsICMxODE4MTgpO1xuJHRoZW1lVGV4dE11dGVkOiB2YXIoLS16bnMtdGhlbWUtdGV4dC1tdXRlZCwgIzk2OTM5ZSk7XG4kdGhlbWVUZXh0U2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtdGV4dC1zZWNvbmRhcnksICM3Mzc3N2YpO1xuXG4kdGhlbWVIZWFkZXI6IHZhcigtLXpucy10aGVtZS1oZWFkZXIsICMxODE4MTgpO1xuJHRoZW1lSGVhZGVyVGV4dDogdmFyKC0tem5zLXRoZW1lLWhlYWRlci10ZXh0LCAjZmZmZmZmKTtcblxuJHRoZW1lQnV0dG9uOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLCAjMTgxODE4KTtcbiR0aGVtZUJ1dHRvblRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tdGV4dCwgI2ZmZmZmZik7XG4kdGhlbWVCdXR0b25Ib3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1ob3ZlciwgI2ZmNTcyMSk7XG5cbiR0aGVtZUJ1dHRvblNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnksICNlOWVjZWYpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktdGV4dCwgIzQ5NTA1Nyk7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktaG92ZXIsICNlOWVjZWYpO1xuXG4kdGhlbWVCb3JkZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXIsICNlM2UzZTMpO1xuJHRoZW1lQm9yZGVySG92ZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXItaG92ZXIsICNjM2M2Y2YpO1xuXG4kdGhlbWVDYXJkOiB2YXIoLS16bnMtdGhlbWUtY2FyZCwgI2ZmZmZmZik7XG4kdGhlbWVDYXJkQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtY2FyZC1ib3JkZXIsICNlZWVkZjEpO1xuXG4kdGhlbWVTaGFkb3c6IHZhcigtLXpucy10aGVtZS1zaGFkb3csIHJnYmEoMCwgMCwgMCwgMC4xKSk7XG5cbiRzbW9vdGhCZXppZXI6IGN1YmljLWJlemllcigwLjI1LCAwLjQsIDAuNywgMSk7XG5cbiRtYXhFeHRyYVNtYWxsOiA1OTVweDtcbiRtaW5TbWFsbDogNjAwcHg7XG4kbWVkaXVtOiA3NjhweDtcbiRsYXJnZTogODg5cHg7XG4kY29tcHV0ZXJzOiAxMjAwcHg7XG4iLCJAdXNlIFwiLi4vLi4vc3R5bGVzL3ZhcmlhYmxlc1wiO1xuQHVzZSBcIi4uLy4uL3N0eWxlcy9idXR0b25zXCI7XG5cbjpob3N0IHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBmbGV4LWdyb3c6IDE7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi53ZWxjb21lLWNsYWltIHtcbiAgICBtaW4taGVpZ2h0OiA3NXZoO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG5cbiAgICAmX19oZWFkZXItYnV0dG9uIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX19jb250ZW50IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZmxleC1ncm93OiAxO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIH1cblxuICAgIC8vIC0tLSBTdGVwIHRyYW5zaXRpb24gc3lzdGVtIC0tLVxuICAgICZfX3N0ZXAge1xuICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47IC8vIFNwYWNlcyBpdGVtcyBldmVubHlcbiAgICAgICAgZmxleC1ncm93OiAxO1xuICAgICAgICBvcGFjaXR5OiAwO1xuICAgICAgICB3aWR0aDogMTAwJTtcblxuICAgICAgICAmLS1hY3RpdmUge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICAgICAgICBhbmltYXRpb246IHN0ZXBGYWRlSW4gMC4zNXMgY3ViaWMtYmV6aWVyKDAuMjUsIDAuNCwgMC43LCAxKSBmb3J3YXJkcztcbiAgICAgICAgfVxuXG4gICAgICAgICYtLWV4aXQge1xuICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgfVxuXG4gICAgICAgICYtLWVudGVyIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbmltYXRpb246IHN0ZXBTbGlkZVVwIDAuNHMgY3ViaWMtYmV6aWVyKDAuMjUsIDAuNCwgMC43LCAxKSBmb3J3YXJkcztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIC0tLSBGbG9hdGluZyBOYW1lIENhcmRzIC0tLVxuICAgICZfX25hbWUtY2FyZHMge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpIGNhbGMoNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgfVxuXG4gICAgLy8gLS0tIFN0ZXAgMTogU2VhcmNoIC0tLVxuICAgICZfX2hlYWRpbmcge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX190aXRsZSB7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19zdWJ0aXRsZSB7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMjBweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjFweDtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMDsgLy8gUmVtb3ZlZCBib3R0b20gbWFyZ2luIHRvIGFsbG93IHNwYWNlLWJldHdlZW4gdG8gaGFuZGxlIHNwYWNpbmdcbiAgICB9XG5cbiAgICAmX19mb3JtIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgfVxuXG4gICAgJl9faW5wdXQge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGJvcmRlci1jb2xvciAzMDBtcyBlYXNlLWluLW91dCxcbiAgICAgICAgICAgIGJveC1zaGFkb3cgMzAwbXMgZWFzZS1pbi1vdXQ7XG5cbiAgICAgICAgJi0tYXZhaWxhYmxlIHtcbiAgICAgICAgICAgIGJvcmRlci1jb2xvcjogdmFyaWFibGVzLiRjb3JyZWN0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDAgMCAxcHggdmFyaWFibGVzLiRjb3JyZWN0O1xuICAgICAgICB9XG5cbiAgICAgICAgJi0tdGFrZW4ge1xuICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDAgMCAxcHggdmFyaWFibGVzLiRlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2lucHV0LWNvbnRyb2wge1xuICAgICAgICBmbGV4OiAxIDEgMDtcbiAgICAgICAgbWluLXdpZHRoOiAwO1xuICAgIH1cblxuICAgICZfX3N0YXR1cyB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgICAgIGFuaW1hdGlvbjogZmFkZUluVXAgMzAwbXMgZWFzZS1vdXQ7XG4gICAgfVxuXG4gICAgJl9fc3RhdHVzLWNoaXAge1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpIGNhbGMoMTJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAyMHB4O1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxMnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IGNhbGMoMTZweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG5cbiAgICAgICAgJi0tYXZhaWxhYmxlIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdExpZ2h0O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdDtcbiAgICAgICAgfVxuXG4gICAgICAgICYtLXRha2VuIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kZXJyb3JMaWdodDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fY29udGludWUge1xuICAgICAgICBtYXJnaW4tdG9wOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgIC8vIC0tLSBTdGVwIDI6IENvbmZpcm0gLS0tXG4gICAgJl9fc3RlcC0yIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgJl9faWRlbnRpdHkge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHBhZGRpbmc6IGNhbGMoMzJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpIDAgY2FsYygyNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIH1cblxuICAgICZfX2RpdmlkZXIge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgaGVpZ2h0OiAxcHg7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICBmbGV4LXNocmluazogMDtcbiAgICB9XG5cbiAgICAmX19jb25maXJtLWZvcm0ge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgcGFkZGluZy10b3A6IGNhbGMoMTZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX2J1dHRvbnMge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBwYWRkaW5nLWJvdHRvbTogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcblxuICAgICAgICA6Om5nLWRlZXAgLnplbGYtYnV0dG9uLS1wcmltYXJ5W2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBvcGFjaXR5OiAxICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIDo6bmctZGVlcCAuemVsZi1idXR0b24tLW91dGxpbmVkW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBvcGFjaXR5OiAxICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fcmVmZXJyYWwge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICB9XG59XG5cbi8qIERvbWFpbiBkaXNwbGF5IHN0eWxpbmcgKi9cbjpob3N0IDo6bmctZGVlcCAuemVsZi1pbnB1dF9fcG9zdGZpeC0tZHJvcGRvd24ge1xuICAgIG1pbi13aWR0aDogY2FsYygxMDBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIHBhZGRpbmc6IGNhbGMoNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSkgY2FsYyg2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBjYWxjKDZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpXG4gICAgICAgIGNhbGMoMTRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIGJhY2tncm91bmQ6ICM0Mjc3ZmY7IC8qIEJsdWUgcGlsbCBmcm9tIHNjcmVlbnNob3QgKi9cbiAgICBib3JkZXItcmFkaXVzOiAzMnB4O1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xufVxuXG4uZG9tYWluLWRpc3BsYXkge1xuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIGNvbG9yOiAjZmZmZmZmO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBvdXRsaW5lOiBub25lO1xuICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lVGl0bGVGYW1pbHksIGluaGVyaXQ7XG4gICAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgbGluZS1oZWlnaHQ6IDE2cHg7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIG1pbi13aWR0aDogNDBweDtcbiAgICBwYWRkaW5nOiAwO1xuICAgIG1hcmdpbjogMDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5kcm9wZG93bi1pY29uLWNvbnRhaW5lciB7XG4gICAgYmFja2dyb3VuZDogI2ZmZmZmZjtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIHdpZHRoOiAyNHB4O1xuICAgIGhlaWdodDogMjRweDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDE1MG1zIGVhc2UtaW4tb3V0O1xuXG4gICAgJjpob3ZlciB7XG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMS4wNSk7XG4gICAgfVxuXG4gICAgc3ZnICoge1xuICAgICAgICBmaWxsOiAjNDI3N2ZmICFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgJltkaXNhYmxlZF0ge1xuICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICBvcGFjaXR5OiAwLjU7XG4gICAgfVxufVxuXG4uc2VhcmNoLWJ1dHRvbi1jb250YWluZXIge1xuICAgIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC4xNSk7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICB3aWR0aDogMzJweDtcbiAgICBoZWlnaHQ6IDMycHg7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAxNTBtcyBlYXNlLWluLW91dDtcblxuICAgICY6aG92ZXI6bm90KFtkaXNhYmxlZF0pIHtcbiAgICAgICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjI1KTtcbiAgICB9XG5cbiAgICBzdmcge1xuICAgICAgICB3aWR0aDogMThweDtcbiAgICAgICAgaGVpZ2h0OiAxOHB4O1xuICAgIH1cblxuICAgIHN2ZyAqIHtcbiAgICAgICAgZmlsbDogI2ZmZmZmZiAhaW1wb3J0YW50O1xuICAgIH1cblxuICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgb3BhY2l0eTogMC41O1xuICAgIH1cbn1cblxuLy8gLS0tIEFuaW1hdGlvbnMgLS0tXG5Aa2V5ZnJhbWVzIGZhZGVJblVwIHtcbiAgICBmcm9tIHtcbiAgICAgICAgb3BhY2l0eTogMDtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDhweCk7XG4gICAgfVxuICAgIHRvIHtcbiAgICAgICAgb3BhY2l0eTogMTtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICAgIH1cbn1cblxuQGtleWZyYW1lcyBzdGVwRmFkZUluIHtcbiAgICBmcm9tIHtcbiAgICAgICAgb3BhY2l0eTogMDtcbiAgICB9XG4gICAgdG8ge1xuICAgICAgICBvcGFjaXR5OiAxO1xuICAgIH1cbn1cblxuQGtleWZyYW1lcyBzdGVwU2xpZGVVcCB7XG4gICAgZnJvbSB7XG4gICAgICAgIG9wYWNpdHk6IDA7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgyNHB4KTtcbiAgICB9XG4gICAgdG8ge1xuICAgICAgICBvcGFjaXR5OiAxO1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gICAgfVxufVxuXG4vLyAtLS0gTmFtZSBDYXJkcyAtLS1cbi5uYW1lLWNhcmRzX19ncmlkIHtcbiAgICBkaXNwbGF5OiBncmlkO1xuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcbiAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgd2lkdGg6IDEwMCU7XG59XG5cbi5uYW1lLWNhcmQge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgcGFkZGluZzogY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSkgY2FsYygxNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgYm9yZGVyLXJhZGl1czogY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgYm94LXNoYWRvdzogMCAycHggOHB4IHJnYmEoMCwgMCwgMCwgMC4wNCk7XG4gICAgd2lsbC1jaGFuZ2U6IHRyYW5zZm9ybTtcblxuICAgICZfX2F2YXRhciB7XG4gICAgICAgIHdpZHRoOiBjYWxjKDQwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgaGVpZ2h0OiBjYWxjKDQwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgbWluLXdpZHRoOiBjYWxjKDQwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTVweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG5cbiAgICAgICAgJi0tb3JhbmdlIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmOTczMTY7XG4gICAgICAgICAgICBjb2xvcjogI2ZmZjtcbiAgICAgICAgfVxuXG4gICAgICAgICYtLXdoaXRlIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggZGFzaGVkIHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19pbmZvIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiAxcHg7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICB9XG5cbiAgICAmX19uYW1lIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiBjYWxjKDE4cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgIH1cblxuICAgICZfX3N0YXR1cyB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDExcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBsaW5lLWhlaWdodDogY2FsYygxNnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuXG4gICAgICAgICYtLWFjdGl2ZSB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRjb3JyZWN0O1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEFjdGl2ZS9Zb3VycyBjYXJkXG4gICAgJi0tYWN0aXZlIHtcbiAgICAgICAgYm9yZGVyOiAxLjVweCBkYXNoZWQgI2Y5NzMxNjtcbiAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNDksIDExNSwgMjIsIDAuMDQpO1xuICAgIH1cblxuICAgIC8vIEZsb2F0IGFuaW1hdGlvbnNcbiAgICAmLS1mbG9hdC0xIHtcbiAgICAgICAgYW5pbWF0aW9uOiBmbG9hdENhcmQxIDRzIGVhc2UtaW4tb3V0IGluZmluaXRlO1xuICAgIH1cbiAgICAmLS1mbG9hdC0yIHtcbiAgICAgICAgYW5pbWF0aW9uOiBmbG9hdENhcmQyIDVzIGVhc2UtaW4tb3V0IGluZmluaXRlO1xuICAgIH1cbiAgICAmLS1mbG9hdC0zIHtcbiAgICAgICAgYW5pbWF0aW9uOiBmbG9hdENhcmQzIDQuNXMgZWFzZS1pbi1vdXQgMC41cyBpbmZpbml0ZTtcbiAgICB9XG4gICAgJi0tZmxvYXQtNCB7XG4gICAgICAgIGFuaW1hdGlvbjogZmxvYXRDYXJkNCA1LjVzIGVhc2UtaW4tb3V0IDFzIGluZmluaXRlO1xuICAgIH1cbiAgICAmLS1mbG9hdC01IHtcbiAgICAgICAgYW5pbWF0aW9uOiBmbG9hdENhcmQ1IDZzIGVhc2UtaW4tb3V0IDAuM3MgaW5maW5pdGU7XG4gICAgfVxufVxuXG5Aa2V5ZnJhbWVzIGZsb2F0Q2FyZDEge1xuICAgIDAlLFxuICAgIDEwMCUge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gICAgfVxuICAgIDUwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNHB4KTtcbiAgICB9XG59XG5cbkBrZXlmcmFtZXMgZmxvYXRDYXJkMiB7XG4gICAgMCUsXG4gICAgMTAwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgICB9XG4gICAgNTAlIHtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC02cHgpO1xuICAgIH1cbn1cblxuQGtleWZyYW1lcyBmbG9hdENhcmQzIHtcbiAgICAwJSxcbiAgICAxMDAlIHtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xuICAgIH1cbiAgICA1MCUge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTNweCk7XG4gICAgfVxufVxuXG5Aa2V5ZnJhbWVzIGZsb2F0Q2FyZDQge1xuICAgIDAlLFxuICAgIDEwMCUge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gICAgfVxuICAgIDUwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNXB4KTtcbiAgICB9XG59XG5cbkBrZXlmcmFtZXMgZmxvYXRDYXJkNSB7XG4gICAgMCUsXG4gICAgMTAwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgICB9XG4gICAgNTAlIHtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC00cHgpO1xuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ }

}]);
//# sourceMappingURL=src_app_welcome-claim_welcome-claim_component_ts.js.map