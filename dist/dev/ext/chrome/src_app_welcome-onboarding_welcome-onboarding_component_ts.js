"use strict";
(self["webpackChunkverifik_wallet_extension"] = self["webpackChunkverifik_wallet_extension"] || []).push([["src_app_welcome-onboarding_welcome-onboarding_component_ts"],{

/***/ 46742:
/*!****************************************************!*\
  !*** ./src/app/animations/swipe-left.animation.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   swipeLeft: () => (/* binding */ swipeLeft)
/* harmony export */ });
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/animations */ 47172);

const swipeLeft = (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)("swipeLeft", [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(":enter", [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  opacity: 0,
  transform: "translate3d(100%, 0, 0)"
}), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)("0.45s cubic-bezier(0.25, 0.4, 0.7, 1)", (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  opacity: 1,
  transform: "translate3d(0, 0, 0)"
}))]), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(":leave", [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  opacity: 1,
  transform: "translate3d(0, 0, 0)"
}), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)("0.45s cubic-bezier(0.25, 0.4, 0.7, 1)", (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  opacity: 0,
  transform: "translate3d(-100%, 0, 0)"
}))])]);

/***/ }),

/***/ 36514:
/*!********************************************************************!*\
  !*** ./src/app/welcome-onboarding/welcome-onboarding.component.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   WelcomeOnboardingComponent: () => (/* binding */ WelcomeOnboardingComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/progress-spinner */ 41134);
/* harmony import */ var _ngneat_transloco__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @ngneat/transloco */ 40261);
/* harmony import */ var app_animations_swipe_left_animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/animations/swipe-left.animation */ 46742);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var app_chrome_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/chrome.service */ 85043);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var app_wallet_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/wallet.service */ 69556);
/* harmony import */ var app_zelf_name_service_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/zelf-name-service.service */ 56148);
/* harmony import */ var app_captcha_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/captcha.service */ 29569);


















function WelcomeOnboardingComponent_div_0_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 17)(1, "h2", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "p", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@swipeLeft", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r1("onboarding.step_1"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r1("onboarding.step_1_description"));
  }
}
function WelcomeOnboardingComponent_div_0_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 17)(1, "h2", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "p", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@swipeLeft", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r1("onboarding.step_2"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r1("onboarding.step_2_description"));
  }
}
function WelcomeOnboardingComponent_div_0_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 17)(1, "h2", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "p", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("@swipeLeft", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r1("onboarding.step_3"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r1("onboarding.step_3_description"));
  }
}
function WelcomeOnboardingComponent_div_0_ng_container_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](1, "svg", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](2, "path", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
  }
}
function WelcomeOnboardingComponent_div_0_mat_spinner_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](0, "mat-spinner", 22);
  }
}
function WelcomeOnboardingComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 1)(1, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](2, "img", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "div", 4)(4, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](5, WelcomeOnboardingComponent_div_0_div_5_Template, 5, 3, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](6, WelcomeOnboardingComponent_div_0_div_6_Template, 5, 3, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](7, WelcomeOnboardingComponent_div_0_div_7_Template, 5, 3, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](9, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](10, "form", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngSubmit", function WelcomeOnboardingComponent_div_0_Template_form_ngSubmit_10_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r11);
      const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r10.searchZelfName($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](11, "div", 10)(12, "input", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("input", function WelcomeOnboardingComponent_div_0_Template_input_input_12_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r11);
      const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r12.sanitizeZelfName());
    })("keydown.enter", function WelcomeOnboardingComponent_div_0_Template_input_keydown_enter_12_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r11);
      const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r13.searchZelfName($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](13, "p", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](14, ".zelf");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](15, "button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](16, WelcomeOnboardingComponent_div_0_ng_container_16_Template, 3, 0, "ng-container", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](17, WelcomeOnboardingComponent_div_0_mat_spinner_17_Template, 1, 0, "mat-spinner", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](18, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](19);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r1 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r0.carouselIndex === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r0.carouselIndex === 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r0.carouselIndex === 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵstyleProp"]("width", ctx_r0.carouselProgress + "%");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("formGroup", ctx_r0.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("placeholder", t_r1("common.search_your_zelf_name"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", ctx_r0.form.invalid);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !ctx_r0.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r0.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r1("welcome.dont_remember_username"));
  }
}
class WelcomeOnboardingComponent {
  constructor(_chromeService, _formBuilder, _router, _walletService, _zelfNameService, _captchaService) {
    this._chromeService = _chromeService;
    this._formBuilder = _formBuilder;
    this._router = _router;
    this._walletService = _walletService;
    this._zelfNameService = _zelfNameService;
    this._captchaService = _captchaService;
    this.carouselIndex = 0;
    this.carouselProgress = 0;
    this.loading = false;
    this._zelfNameService.setZelfName("");
    this._zelfNameService.setZelfNameObject(null);
    this._initForm();
  }
  ngOnInit() {
    this._initCarousel();
  }
  ngOnDestroy() {
    clearInterval(this._carouselItemInterval);
  }
  _initCarousel() {
    this.carouselProgress = 0;
    this._carouselItemInterval = setInterval(() => {
      const tempIndex = this.carouselIndex;
      this.carouselIndex = -1;
      setTimeout(() => {
        this.carouselIndex = tempIndex === 2 ? 0 : tempIndex + 1;
        this.carouselProgress = 33 * (this.carouselIndex + 1);
      }, 500);
    }, 5000);
    setTimeout(() => {
      this.carouselProgress = 33;
    });
  }
  _initSession() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      let {
        hash
      } = _this._walletService.generateUniqueId();
      const session = yield _this._walletService.createLivenessSession({
        identifier: hash,
        type: "general"
      });
      if (session?.data) _this._chromeService.setItem("accessToken", session.data.token);
    })();
  }
  _initForm() {
    this.form = this._formBuilder.group({
      zelfName: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.minLength(1), _angular_forms__WEBPACK_IMPORTED_MODULE_7__.Validators.maxLength(27)]]
    });
  }
  _noZelfNameFound(zelfNameOffer) {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this2._zelfNameService.setZelfName(zelfNameOffer.zelfName, zelfNameOffer);
      yield _this2._zelfNameService.setZelfNameObject(null);
      _this2.form.clearValidators();
      _this2.form.reset({
        zelfName: ""
      });
      _this2._router.navigate(["/welcome", "available"]);
      _this2.loading = false;
    })();
  }
  searchZelfName(event) {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this3.form.valid) {
        _this3.form.patchValue({
          zelfName: ""
        });
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
      yield _this3._initSession();
      _this3._zelfNameService.searchZelfName("zelfName", zelfName, captchaToken).then( /*#__PURE__*/function () {
        var _ref = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (response) {
          if (response?.data.price) return yield _this3._noZelfNameFound(response?.data);
          const zelfNameObject = response.data.ipfs?.length ? response.data.ipfs[0] : response.data.arweave[0];
          yield _this3._zelfNameService.setZelfName(zelfName, {
            price: 0,
            reward: 0
          });
          yield _this3._zelfNameService.setZelfNameObject(zelfNameObject);
          _this3.loading = false;
          _this3._router.navigate(["/welcome", "registered"]);
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
  sanitizeZelfName() {
    const control = this.form.get("zelfName");
    if (!control) return;
    // Remove invalid characters, ensure it doesn't start with a number or special character and doesn't end with '.' or '-'
    let sanitizedValue = control.value.replace(/[^a-zA-Z0-9.-]|^[^a-zA-Z]+|[.-]$/g, "");
    sanitizedValue = sanitizedValue.toLowerCase().trim();
    control.patchValue(sanitizedValue, {
      emitEvent: false
    });
    if (!sanitizedValue) control.markAsPristine();
  }
  static {
    this.ɵfac = function WelcomeOnboardingComponent_Factory(t) {
      return new (t || WelcomeOnboardingComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](app_chrome_service__WEBPACK_IMPORTED_MODULE_2__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_8__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](app_wallet_service__WEBPACK_IMPORTED_MODULE_3__.WalletService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](app_zelf_name_service_service__WEBPACK_IMPORTED_MODULE_4__.ZelfNameService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](app_captcha_service__WEBPACK_IMPORTED_MODULE_5__.CaptchaService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
      type: WelcomeOnboardingComponent,
      selectors: [["welcome-onboarding"]],
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵStandaloneFeature"]],
      decls: 1,
      vars: 0,
      consts: [["class", "zelf-card welcome-onboarding", 4, "transloco"], [1, "zelf-card", "welcome-onboarding"], [1, "zelf-card__header"], ["src", "assets/images/welcome-image.png", "alt", "welcome", 1, "zelf-card__image"], [1, "carousel"], [1, "carousel__item-container"], ["class", "carousel__item", 4, "ngIf"], [1, "carousel__progress"], [1, "carousel__progress-bar"], [1, "zelf-card__content", 3, "formGroup", "ngSubmit"], [1, "zelf-input"], ["formControlName", "zelfName", "id", "zelfName", "maxlength", "27", "minlength", "1", "name", "zelfName", "required", "", 1, "zelf-input__control", 3, "placeholder", "input", "keydown.enter"], [1, "zelf-input__postfix"], ["mat-icon-button", "", "type", "submit", 1, "zelf-icon-button", "zelf-icon-button--black", 3, "disabled"], [4, "ngIf"], ["mode", "indeterminate", "diameter", "18", 4, "ngIf"], [1, "zelf-button", "zelf-button--hyperlink"], [1, "carousel__item"], [1, "zelf-card__title", "carousel__title"], [1, "zelf-card__subtitle", "carousel__subtitle"], ["width", "18", "height", "18", "viewBox", "0 0 18 18", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z"], ["mode", "indeterminate", "diameter", "18"]],
      template: function WelcomeOnboardingComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](0, WelcomeOnboardingComponent_div_0_Template, 20, 11, "div", 0);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_9__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgIf, _ngneat_transloco__WEBPACK_IMPORTED_MODULE_10__.TranslocoModule, _ngneat_transloco__WEBPACK_IMPORTED_MODULE_10__.TranslocoDirective, _angular_material_button__WEBPACK_IMPORTED_MODULE_11__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_11__.MatIconButton, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_7__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.MinLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormControlName, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__.MatProgressSpinner],
      styles: [".zelf-button-external-link[_ngcontent-%COMP%] {\n  display: block;\n}\n.zelf-button-external-link--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.zelf-button[_ngcontent-%COMP%] {\n  align-items: center;\n  border-radius: 16px;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  font-family: Poppins;\n  font-size: 14px;\n  font-weight: 500;\n  gap: 8px;\n  height: 56px;\n  justify-content: center;\n  outline: none;\n  padding: 16px;\n  text-align: center;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.zelf-button__text--margin-right[_ngcontent-%COMP%] {\n  margin-right: 1rem;\n}\n.zelf-button--thin[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  padding: 12px 16px;\n}\n.zelf-button--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: #73777f;\n  font-size: 14px;\n  border-radius: 9999px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #73777f;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: #181818;\n  background-color: #e3e3e3;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: #181818;\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: #96939e !important;\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #96939e;\n}\n.zelf-button--black[_ngcontent-%COMP%] {\n  background-color: #181818 !important;\n  color: #ffffff !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--black[_ngcontent-%COMP%]:focus, .zelf-button--black[_ngcontent-%COMP%]:hover {\n  background-color: #73777f !important;\n}\n.zelf-button--black[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: #73777f !important;\n  color: #ffffff !important;\n}\n.zelf-button--black[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #ffffff;\n}\n.zelf-button--white[_ngcontent-%COMP%] {\n  background-color: #ffffff !important;\n  color: #181818 !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--white[_ngcontent-%COMP%]:focus, .zelf-button--white[_ngcontent-%COMP%]:hover {\n  background-color: #eeedf1 !important;\n}\n.zelf-button--white[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: #eeedf1 !important;\n  color: #181818 !important;\n}\n.zelf-button--white[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #181818;\n}\n.zelf-button--outlined[_ngcontent-%COMP%] {\n  border: 1px solid #181818 !important;\n  background-color: #ffffff !important;\n  color: #181818 !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus, .zelf-button--outlined[_ngcontent-%COMP%]:hover {\n  background-color: #e3e3e3 !important;\n}\n.zelf-button--outlined[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: #73777f !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #181818;\n}\n.zelf-button--error[_ngcontent-%COMP%] {\n  background-color: #fceeee !important;\n  color: #dc362e !important;\n}\n.zelf-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #dc362e !important;\n}\n.zelf-button--success[_ngcontent-%COMP%] {\n  background-color: #e7f8ed !important;\n  color: #1ea446 !important;\n}\n.zelf-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #1ea446 !important;\n}\n\n.zelf-icon-button[_ngcontent-%COMP%] {\n  align-items: center;\n  background-color: #eeedf1 !important;\n  border-radius: 56px;\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  height: 56px;\n  justify-content: center;\n  min-height: 56px;\n  min-width: 56px;\n  outline: none;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  -webkit-user-select: none;\n          user-select: none;\n  width: 56px;\n}\n.zelf-icon-button.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: #181818;\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover {\n  background-color: #b589f0 !important;\n  color: white;\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: white;\n}\n.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%] {\n  height: 40px;\n  min-height: 40px;\n  min-width: 40px;\n  width: 40px;\n  border-radius: 40px;\n}\n.zelf-icon-button--40.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 14px;\n}\n.zelf-icon-button--black[_ngcontent-%COMP%] {\n  background-color: #181818 !important;\n  color: #ffffff !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--black[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #ffffff;\n}\n.zelf-icon-button--black[_ngcontent-%COMP%]:focus, .zelf-icon-button--black[_ngcontent-%COMP%]:hover {\n  background-color: #73777f !important;\n}\n.zelf-icon-button--black[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: #e3e3e3 !important;\n}\n.zelf-icon-button--black[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #c3c6cf;\n}\n.zelf-icon-button--anti-flash-white[_ngcontent-%COMP%] {\n  background-color: #eeedf1 !important;\n  color: #181818 !important;\n}\n.zelf-icon-button--anti-flash-white[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #181818;\n}\n.zelf-icon-button--anti-flash-white[_ngcontent-%COMP%]:focus, .zelf-icon-button--anti-flash-white[_ngcontent-%COMP%]:hover {\n  background-color: #b589f0 !important;\n  color: white;\n}\n.zelf-icon-button--anti-flash-white[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-icon-button--anti-flash-white[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: #ffffff;\n}\n.zelf-icon-button--anti-flash-white[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: #e3e3e3 !important;\n}\n.zelf-icon-button--anti-flash-white[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #c3c6cf;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%] {\n  background-color: #fceeee !important;\n  color: #dc362e !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #dc362e !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%] {\n  background-color: #e7f8ed !important;\n  color: #1ea446 !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #1ea446 !important;\n}\n\n[_nghost-%COMP%] {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  justify-content: center;\n}\n\n.welcome-onboarding[_ngcontent-%COMP%] {\n  padding-top: 68px !important;\n  padding-bottom: 68px !important;\n}\n\n.carousel[_ngcontent-%COMP%] {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  min-height: 200px;\n  overflow: visible;\n}\n.carousel__item-container[_ngcontent-%COMP%] {\n  min-height: 150px;\n}\n.carousel__subtitle[_ngcontent-%COMP%] {\n  margin-top: 12px;\n}\n.carousel__item[_ngcontent-%COMP%] {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n.carousel__progress[_ngcontent-%COMP%] {\n  background-color: #e3e3e3;\n  border-radius: 6px;\n  height: 6px;\n  overflow: hidden;\n  position: relative;\n  width: 96px;\n}\n.carousel__progress-bar[_ngcontent-%COMP%] {\n  background-color: #0e26ff;\n  border-radius: 6px;\n  height: 100%;\n  left: 0;\n  position: absolute;\n  top: 0;\n  width: 0;\n  transition: width 5s;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3N0eWxlcy9fYnV0dG9ucy5zY3NzIiwid2VsY29tZS1vbmJvYXJkaW5nLmNvbXBvbmVudC5zY3NzIiwiLi4vLi4vc3R5bGVzL192YXJpYWJsZXMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGNBQUE7QUNDSjtBRENJO0VBQ0ksV0FBQTtBQ0NSOztBREdBO0VBQ0ksbUJBQUE7RUFDQSxtQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLG9CQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsUUFBQTtFQUNBLFlBQUE7RUFDQSx1QkFBQTtFQUNBLGFBQUE7RUFDQSxhQUFBO0VBQ0Esa0JBQUE7RUFDQSx5QkFBQTtVQUFBLGlCQUFBO0FDQUo7QURHUTtFQUNJLGtCQUFBO0FDRFo7QURLSTtFQUNJLGtCQUFBO0VBQ0Esa0JBQUE7QUNIUjtBRE1JO0VBQ0ksV0FBQTtBQ0pSO0FET0k7RUFDSSw2QkFBQTtFQUNBLGNFdkNEO0VGd0NDLGVBQUE7RUFDQSxxQkFBQTtFQUNBLDZHQUFBO0FDTFI7QURPUTtFQUNJLGVBQUE7QUNMWjtBRFFRO0VBQ0ksYUVqREw7QUQyQ1A7QURTUTtFQUNJLGNFdERKO0VGdURJLHlCRW5ERDtBRDRDWDtBRFNZO0VBQ0ksYUUxRFI7QURtRFI7QURXUTtFQUNJLG1CQUFBO0VBQ0EseUJBQUE7QUNUWjtBRFdZO0VBQ0ksYUVqRUo7QUR3RFo7QURjSTtFQUNJLG9DQUFBO0VBQ0EseUJBQUE7RUFDQSw2R0FBQTtBQ1pSO0FEY1E7RUFFSSxvQ0FBQTtBQ2JaO0FEZ0JRO0VBQ0ksbUJBQUE7RUFDQSxvQ0FBQTtFQUNBLHlCQUFBO0FDZFo7QURpQlE7RUFDSSxhRWxGSjtBRG1FUjtBRG1CSTtFQUNJLG9DQUFBO0VBQ0EseUJBQUE7RUFDQSw2R0FBQTtBQ2pCUjtBRG1CUTtFQUVJLG9DQUFBO0FDbEJaO0FEcUJRO0VBQ0ksbUJBQUE7RUFDQSxvQ0FBQTtFQUNBLHlCQUFBO0FDbkJaO0FEc0JRO0VBQ0ksYUU5R0o7QUQwRlI7QUR3Qkk7RUFDSSxvQ0FBQTtFQUNBLG9DQUFBO0VBQ0EseUJBQUE7RUFDQSw2R0FBQTtBQ3RCUjtBRHdCUTtFQUVJLG9DQUFBO0FDdkJaO0FEMEJRO0VBQ0ksbUJBQUE7RUFDQSx5QkFBQTtBQ3hCWjtBRDJCUTtFQUNJLGFFbklKO0FEMEdSO0FENkJJO0VBQ0ksb0NBQUE7RUFDQSx5QkFBQTtBQzNCUjtBRDZCUTtFQUNJLHdCQUFBO0FDM0JaO0FEK0JJO0VBQ0ksb0NBQUE7RUFDQSx5QkFBQTtBQzdCUjtBRCtCUTtFQUNJLHdCQUFBO0FDN0JaOztBRGtDQTtFQUNJLG1CQUFBO0VBQ0Esb0NBQUE7RUFDQSxtQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0Esb0JBQUE7RUFDQSxZQUFBO0VBQ0EsdUJBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSxhQUFBO0VBQ0EsNkdBQUE7RUFDQSx5QkFBQTtVQUFBLGlCQUFBO0VBQ0EsV0FBQTtBQy9CSjtBRGlDSTtFQUNJLG1CQUFBO0FDL0JSO0FEa0NJO0VBQ0kscURBQUE7RUFDQSxhRWhMQTtBRGdKUjtBRG1DSTtFQUNJLG9DQUFBO0VBQ0EsWUFBQTtBQ2pDUjtBRG1DUTtFQUNJLFdBQUE7QUNqQ1o7QURxQ0k7RUFDSSxtQkFBQTtBQ25DUjtBRHNDSTtFQUNJLFlBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSxXQUFBO0VBQ0EsbUJBQUE7QUNwQ1I7QURzQ1E7RUFDSSxtQkFBQTtBQ3BDWjtBRHdDSTtFQUNJLG9DQUFBO0VBQ0EseUJBQUE7RUFDQSw2R0FBQTtBQ3RDUjtBRHdDUTtFQUNJLGFFM01KO0FEcUtSO0FEeUNRO0VBRUksb0NBQUE7QUN4Q1o7QUQyQ1E7RUFDSSxtQkFBQTtFQUNBLG9DQUFBO0FDekNaO0FEMkNZO0VBQ0ksYUU1Tkg7QURtTGI7QUQ4Q0k7RUFDSSxvQ0FBQTtFQUNBLHlCQUFBO0FDNUNSO0FEOENRO0VBQ0ksYUV6T0o7QUQ2TFI7QUQrQ1E7RUFFSSxvQ0FBQTtFQUNBLFlBQUE7QUM5Q1o7QURnRFk7RUFDSSxhRTNPUjtBRDZMUjtBRGtEUTtFQUNJLG1CQUFBO0VBQ0Esb0NBQUE7QUNoRFo7QURrRFk7RUFDSSxhRXhQSDtBRHdNYjtBRHFESTtFQUNJLG9DQUFBO0VBQ0EseUJBQUE7QUNuRFI7QURxRFE7RUFDSSx3QkFBQTtBQ25EWjtBRHVESTtFQUNJLG9DQUFBO0VBQ0EseUJBQUE7QUNyRFI7QUR1RFE7RUFDSSx3QkFBQTtBQ3JEWjs7QUF4TkE7RUFDSSxtQkFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFlBQUE7RUFDQSx1QkFBQTtBQTJOSjs7QUF4TkE7RUFDSSw0QkFBQTtFQUNBLCtCQUFBO0FBMk5KOztBQXhOQTtFQUNJLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsdUJBQUE7RUFDQSxpQkFBQTtFQUNBLGlCQUFBO0FBMk5KO0FBek5JO0VBQ0ksaUJBQUE7QUEyTlI7QUF4Tkk7RUFDSSxnQkFBQTtBQTBOUjtBQXZOSTtFQUNJLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsdUJBQUE7QUF5TlI7QUF0Tkk7RUFDSSx5QkNsQ0c7RURtQ0gsa0JBQUE7RUFDQSxXQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLFdBQUE7QUF3TlI7QUF0TlE7RUFDSSx5QkNoREc7RURpREgsa0JBQUE7RUFDQSxZQUFBO0VBQ0EsT0FBQTtFQUNBLGtCQUFBO0VBQ0EsTUFBQTtFQUNBLFFBQUE7RUFDQSxvQkFBQTtBQXdOWiIsImZpbGUiOiJ3ZWxjb21lLW9uYm9hcmRpbmcuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuemVsZi1idXR0b24tZXh0ZXJuYWwtbGluayB7XG4gICAgZGlzcGxheTogYmxvY2s7XG5cbiAgICAmLS13aWRlIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxufVxuXG4uemVsZi1idXR0b24ge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZm9udC1mYW1pbHk6IFBvcHBpbnM7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgZ2FwOiA4cHg7XG4gICAgaGVpZ2h0OiA1NnB4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgcGFkZGluZzogMTZweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG5cbiAgICAmX190ZXh0IHtcbiAgICAgICAgJi0tbWFyZ2luLXJpZ2h0IHtcbiAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMXJlbTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXRoaW4ge1xuICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgIHBhZGRpbmc6IDEycHggMTZweDtcbiAgICB9XG5cbiAgICAmLS13aWRlIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgJi0taHlwZXJsaW5rIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICAgIGNvbG9yOiAkZ3JheTtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuMnMgJHNtb290aEJlemllciwgYmFja2dyb3VuZC1jb2xvciAwLjNzICRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJi0tc21hbGwge1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6ICRncmF5O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBjb2xvcjogJGJsYWNrO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHBsYXRpbnVtO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6ICRibGFjaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogJHRhdXBlR3JheSAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6ICR0YXVwZUdyYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1ibGFjayB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRibGFjayAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogJHdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuM3MgJHNtb290aEJlemllciwgYmFja2dyb3VuZC1jb2xvciAwLjNzICRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkZ3JheSAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRncmF5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogJHdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogJHdoaXRlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0td2hpdGUge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkd2hpdGUgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6ICRibGFjayAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjNzICRzbW9vdGhCZXppZXIsIGJhY2tncm91bmQtY29sb3IgMC4zcyAkc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGFudGlGbGFzaFdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGFudGlGbGFzaFdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogJGJsYWNrICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogJGJsYWNrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tb3V0bGluZWQge1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAkYmxhY2sgIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiAkYmxhY2sgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjogY29sb3IgMC4zcyAkc21vb3RoQmV6aWVyLCBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRwbGF0aW51bSAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGNvbG9yOiAkZ3JheSAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6ICRibGFjaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWVycm9yIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6ICRlcnJvciAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiAkZXJyb3IgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXN1Y2Nlc3Mge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkY29ycmVjdExpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiAkY29ycmVjdCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiAkY29ycmVjdCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uemVsZi1pY29uLWJ1dHRvbiB7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYW50aUZsYXNoV2hpdGUgIWltcG9ydGFudDtcbiAgICBib3JkZXItcmFkaXVzOiA1NnB4O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgaGVpZ2h0OiA1NnB4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG1pbi1oZWlnaHQ6IDU2cHg7XG4gICAgbWluLXdpZHRoOiA1NnB4O1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgdHJhbnNpdGlvbjogY29sb3IgMC4zcyAkc21vb3RoQmV6aWVyLCBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgJHNtb290aEJlemllcjtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICB3aWR0aDogNTZweDtcblxuICAgICYuemVsZi1pY29uLWJ1dHRvbi0tYm9yZGVyLXNvZnQge1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIH1cblxuICAgIHN2ZyB7XG4gICAgICAgIHRyYW5zaXRpb246IGZpbGwgMC4zcyAkc21vb3RoQmV6aWVyO1xuICAgICAgICBmaWxsOiAkYmxhY2s7XG4gICAgfVxuXG4gICAgJjpob3ZlciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNiNTg5ZjAgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHdoaXRlO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB3aGl0ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWJvcmRlci1zb2Z0IHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICB9XG5cbiAgICAmLS00MCB7XG4gICAgICAgIGhlaWdodDogNDBweDtcbiAgICAgICAgbWluLWhlaWdodDogNDBweDtcbiAgICAgICAgbWluLXdpZHRoOiA0MHB4O1xuICAgICAgICB3aWR0aDogNDBweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNDBweDtcblxuICAgICAgICAmLnplbGYtaWNvbi1idXR0b24tLWJvcmRlci1zb2Z0IHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1ibGFjayB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRibGFjayAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogJHdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuM3MgJHNtb290aEJlemllciwgYmFja2dyb3VuZC1jb2xvciAwLjNzICRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6ICR3aGl0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGdyYXkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkcGxhdGludW0gIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiAkZnJlbmNoR3JheTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWFudGktZmxhc2gtd2hpdGUge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYW50aUZsYXNoV2hpdGUgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6ICRibGFjayAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiAkYmxhY2s7XG4gICAgICAgIH1cblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNiNTg5ZjAgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiAkd2hpdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHBsYXRpbnVtICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogJGZyZW5jaEdyYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1lcnJvciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRlcnJvckxpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiAkZXJyb3IgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogJGVycm9yICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zdWNjZXNzIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGNvcnJlY3RMaWdodCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogJGNvcnJlY3QgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogJGNvcnJlY3QgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIkBpbXBvcnQgXCIuLi8uLi9zdHlsZXMvdmFyaWFibGVzXCI7XG5AaW1wb3J0IFwiLi4vLi4vc3R5bGVzL2J1dHRvbnNcIjtcblxuOmhvc3Qge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGZsZXgtZ3JvdzogMTtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuLndlbGNvbWUtb25ib2FyZGluZyB7XG4gICAgcGFkZGluZy10b3A6IDY4cHggIWltcG9ydGFudDtcbiAgICBwYWRkaW5nLWJvdHRvbTogNjhweCAhaW1wb3J0YW50O1xufVxuXG4uY2Fyb3VzZWwge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG1pbi1oZWlnaHQ6IDIwMHB4O1xuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xuXG4gICAgJl9faXRlbS1jb250YWluZXIge1xuICAgICAgICBtaW4taGVpZ2h0OiAxNTBweDtcbiAgICB9XG5cbiAgICAmX19zdWJ0aXRsZSB7XG4gICAgICAgIG1hcmdpbi10b3A6IDEycHg7XG4gICAgfVxuXG4gICAgJl9faXRlbSB7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIH1cblxuICAgICZfX3Byb2dyZXNzIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHBsYXRpbnVtO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gICAgICAgIGhlaWdodDogNnB4O1xuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIHdpZHRoOiA5NnB4O1xuXG4gICAgICAgICYtYmFyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRwcmltYXJ5Q29sb3I7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgICAgICBsZWZ0OiAwO1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgdG9wOiAwO1xuICAgICAgICAgICAgd2lkdGg6IDA7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB3aWR0aCA1cztcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIiRwcmltYXJ5Q29sb3I6ICMwZTI2ZmY7XG4kc2Vjb25kYXJ5Q29sb3I6ICNmZjU3MjE7XG4kYmxhY2s6ICMxODE4MTg7XG4kZ3JheTogIzczNzc3ZjtcbiR0YXVwZUdyYXk6ICM5NjkzOWU7XG4kZnJlbmNoR3JheTogI2MzYzZjZjtcbiRwbGF0aW51bTogI2UzZTNlMztcbiRhbnRpRmxhc2hXaGl0ZTogI2VlZWRmMTtcbiRzZWFTYWx0OiAjZjlmOWZjO1xuJHdoaXRlOiAjZmZmZmZmO1xuJHByaW1hcnlMaWdodDogI2ZmZWVlOTtcbiRlcnJvckRhcms6ICM2MDE0MTA7XG4kZXJyb3I6ICNkYzM2MmU7XG4kZXJyb3JMaWdodDogI2ZjZWVlZTtcbiRjb3JyZWN0RGFyazogIzBmNTIyMztcbiRjb3JyZWN0OiAjMWVhNDQ2O1xuJGNvcnJlY3RMaWdodDogI2U3ZjhlZDtcbiRpbmZvRGFyazogIzAwNGE3NztcbiRpbmZvOiAjMzk5OGQzO1xuJGluZm9MaWdodDogI2VjZjNmZTtcblxuJHNtb290aEJlemllcjogY3ViaWMtYmV6aWVyKDAuMjUsIDAuNCwgMC43LCAxKTtcblxuJG1heEV4dHJhU21hbGw6IDU5NXB4O1xuJG1pblNtYWxsOiA2MDBweDtcbiRtZWRpdW06IDc2OHB4O1xuJGxhcmdlOiA4ODlweDtcbiRjb21wdXRlcnM6IDEyMDBweDtcbiJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX2J1dHRvbnMuc2NzcyIsIndlYnBhY2s6Ly8uL3NyYy9hcHAvd2VsY29tZS1vbmJvYXJkaW5nL3dlbGNvbWUtb25ib2FyZGluZy5jb21wb25lbnQuc2NzcyIsIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX3ZhcmlhYmxlcy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksY0FBQTtBQ0NKO0FEQ0k7RUFDSSxXQUFBO0FDQ1I7O0FER0E7RUFDSSxtQkFBQTtFQUNBLG1CQUFBO0VBQ0EsWUFBQTtFQUNBLGVBQUE7RUFDQSxhQUFBO0VBQ0Esb0JBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxRQUFBO0VBQ0EsWUFBQTtFQUNBLHVCQUFBO0VBQ0EsYUFBQTtFQUNBLGFBQUE7RUFDQSxrQkFBQTtFQUNBLHlCQUFBO1VBQUEsaUJBQUE7QUNBSjtBREdRO0VBQ0ksa0JBQUE7QUNEWjtBREtJO0VBQ0ksa0JBQUE7RUFDQSxrQkFBQTtBQ0hSO0FETUk7RUFDSSxXQUFBO0FDSlI7QURPSTtFQUNJLDZCQUFBO0VBQ0EsY0V2Q0Q7RUZ3Q0MsZUFBQTtFQUNBLHFCQUFBO0VBQ0EsNkdBQUE7QUNMUjtBRE9RO0VBQ0ksZUFBQTtBQ0xaO0FEUVE7RUFDSSxhRWpETDtBRDJDUDtBRFNRO0VBQ0ksY0V0REo7RUZ1REkseUJFbkREO0FENENYO0FEU1k7RUFDSSxhRTFEUjtBRG1EUjtBRFdRO0VBQ0ksbUJBQUE7RUFDQSx5QkFBQTtBQ1RaO0FEV1k7RUFDSSxhRWpFSjtBRHdEWjtBRGNJO0VBQ0ksb0NBQUE7RUFDQSx5QkFBQTtFQUNBLDZHQUFBO0FDWlI7QURjUTtFQUVJLG9DQUFBO0FDYlo7QURnQlE7RUFDSSxtQkFBQTtFQUNBLG9DQUFBO0VBQ0EseUJBQUE7QUNkWjtBRGlCUTtFQUNJLGFFbEZKO0FEbUVSO0FEbUJJO0VBQ0ksb0NBQUE7RUFDQSx5QkFBQTtFQUNBLDZHQUFBO0FDakJSO0FEbUJRO0VBRUksb0NBQUE7QUNsQlo7QURxQlE7RUFDSSxtQkFBQTtFQUNBLG9DQUFBO0VBQ0EseUJBQUE7QUNuQlo7QURzQlE7RUFDSSxhRTlHSjtBRDBGUjtBRHdCSTtFQUNJLG9DQUFBO0VBQ0Esb0NBQUE7RUFDQSx5QkFBQTtFQUNBLDZHQUFBO0FDdEJSO0FEd0JRO0VBRUksb0NBQUE7QUN2Qlo7QUQwQlE7RUFDSSxtQkFBQTtFQUNBLHlCQUFBO0FDeEJaO0FEMkJRO0VBQ0ksYUVuSUo7QUQwR1I7QUQ2Qkk7RUFDSSxvQ0FBQTtFQUNBLHlCQUFBO0FDM0JSO0FENkJRO0VBQ0ksd0JBQUE7QUMzQlo7QUQrQkk7RUFDSSxvQ0FBQTtFQUNBLHlCQUFBO0FDN0JSO0FEK0JRO0VBQ0ksd0JBQUE7QUM3Qlo7O0FEa0NBO0VBQ0ksbUJBQUE7RUFDQSxvQ0FBQTtFQUNBLG1CQUFBO0VBQ0EsWUFBQTtFQUNBLGVBQUE7RUFDQSxvQkFBQTtFQUNBLFlBQUE7RUFDQSx1QkFBQTtFQUNBLGdCQUFBO0VBQ0EsZUFBQTtFQUNBLGFBQUE7RUFDQSw2R0FBQTtFQUNBLHlCQUFBO1VBQUEsaUJBQUE7RUFDQSxXQUFBO0FDL0JKO0FEaUNJO0VBQ0ksbUJBQUE7QUMvQlI7QURrQ0k7RUFDSSxxREFBQTtFQUNBLGFFaExBO0FEZ0pSO0FEbUNJO0VBQ0ksb0NBQUE7RUFDQSxZQUFBO0FDakNSO0FEbUNRO0VBQ0ksV0FBQTtBQ2pDWjtBRHFDSTtFQUNJLG1CQUFBO0FDbkNSO0FEc0NJO0VBQ0ksWUFBQTtFQUNBLGdCQUFBO0VBQ0EsZUFBQTtFQUNBLFdBQUE7RUFDQSxtQkFBQTtBQ3BDUjtBRHNDUTtFQUNJLG1CQUFBO0FDcENaO0FEd0NJO0VBQ0ksb0NBQUE7RUFDQSx5QkFBQTtFQUNBLDZHQUFBO0FDdENSO0FEd0NRO0VBQ0ksYUUzTUo7QURxS1I7QUR5Q1E7RUFFSSxvQ0FBQTtBQ3hDWjtBRDJDUTtFQUNJLG1CQUFBO0VBQ0Esb0NBQUE7QUN6Q1o7QUQyQ1k7RUFDSSxhRTVOSDtBRG1MYjtBRDhDSTtFQUNJLG9DQUFBO0VBQ0EseUJBQUE7QUM1Q1I7QUQ4Q1E7RUFDSSxhRXpPSjtBRDZMUjtBRCtDUTtFQUVJLG9DQUFBO0VBQ0EsWUFBQTtBQzlDWjtBRGdEWTtFQUNJLGFFM09SO0FENkxSO0FEa0RRO0VBQ0ksbUJBQUE7RUFDQSxvQ0FBQTtBQ2hEWjtBRGtEWTtFQUNJLGFFeFBIO0FEd01iO0FEcURJO0VBQ0ksb0NBQUE7RUFDQSx5QkFBQTtBQ25EUjtBRHFEUTtFQUNJLHdCQUFBO0FDbkRaO0FEdURJO0VBQ0ksb0NBQUE7RUFDQSx5QkFBQTtBQ3JEUjtBRHVEUTtFQUNJLHdCQUFBO0FDckRaOztBQXhOQTtFQUNJLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsWUFBQTtFQUNBLHVCQUFBO0FBMk5KOztBQXhOQTtFQUNJLDRCQUFBO0VBQ0EsK0JBQUE7QUEyTko7O0FBeE5BO0VBQ0ksbUJBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSx1QkFBQTtFQUNBLGlCQUFBO0VBQ0EsaUJBQUE7QUEyTko7QUF6Tkk7RUFDSSxpQkFBQTtBQTJOUjtBQXhOSTtFQUNJLGdCQUFBO0FBME5SO0FBdk5JO0VBQ0ksbUJBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSx1QkFBQTtBQXlOUjtBQXROSTtFQUNJLHlCQ2xDRztFRG1DSCxrQkFBQTtFQUNBLFdBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0EsV0FBQTtBQXdOUjtBQXROUTtFQUNJLHlCQ2hERztFRGlESCxrQkFBQTtFQUNBLFlBQUE7RUFDQSxPQUFBO0VBQ0Esa0JBQUE7RUFDQSxNQUFBO0VBQ0EsUUFBQTtFQUNBLG9CQUFBO0FBd05aO0FBR0Esd3VhQUF3dWEiLCJzb3VyY2VzQ29udGVudCI6WyIuemVsZi1idXR0b24tZXh0ZXJuYWwtbGluayB7XG4gICAgZGlzcGxheTogYmxvY2s7XG5cbiAgICAmLS13aWRlIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxufVxuXG4uemVsZi1idXR0b24ge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZm9udC1mYW1pbHk6IFBvcHBpbnM7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgZ2FwOiA4cHg7XG4gICAgaGVpZ2h0OiA1NnB4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgcGFkZGluZzogMTZweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG5cbiAgICAmX190ZXh0IHtcbiAgICAgICAgJi0tbWFyZ2luLXJpZ2h0IHtcbiAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMXJlbTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXRoaW4ge1xuICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgIHBhZGRpbmc6IDEycHggMTZweDtcbiAgICB9XG5cbiAgICAmLS13aWRlIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgJi0taHlwZXJsaW5rIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICAgIGNvbG9yOiAkZ3JheTtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuMnMgJHNtb290aEJlemllciwgYmFja2dyb3VuZC1jb2xvciAwLjNzICRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJi0tc21hbGwge1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6ICRncmF5O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBjb2xvcjogJGJsYWNrO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHBsYXRpbnVtO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6ICRibGFjaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogJHRhdXBlR3JheSAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6ICR0YXVwZUdyYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1ibGFjayB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRibGFjayAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogJHdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuM3MgJHNtb290aEJlemllciwgYmFja2dyb3VuZC1jb2xvciAwLjNzICRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkZ3JheSAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRncmF5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogJHdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogJHdoaXRlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0td2hpdGUge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkd2hpdGUgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6ICRibGFjayAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjNzICRzbW9vdGhCZXppZXIsIGJhY2tncm91bmQtY29sb3IgMC4zcyAkc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGFudGlGbGFzaFdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGFudGlGbGFzaFdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogJGJsYWNrICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogJGJsYWNrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tb3V0bGluZWQge1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAkYmxhY2sgIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiAkYmxhY2sgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjogY29sb3IgMC4zcyAkc21vb3RoQmV6aWVyLCBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRwbGF0aW51bSAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGNvbG9yOiAkZ3JheSAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6ICRibGFjaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWVycm9yIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6ICRlcnJvciAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiAkZXJyb3IgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXN1Y2Nlc3Mge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkY29ycmVjdExpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiAkY29ycmVjdCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiAkY29ycmVjdCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uemVsZi1pY29uLWJ1dHRvbiB7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYW50aUZsYXNoV2hpdGUgIWltcG9ydGFudDtcbiAgICBib3JkZXItcmFkaXVzOiA1NnB4O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgaGVpZ2h0OiA1NnB4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG1pbi1oZWlnaHQ6IDU2cHg7XG4gICAgbWluLXdpZHRoOiA1NnB4O1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgdHJhbnNpdGlvbjogY29sb3IgMC4zcyAkc21vb3RoQmV6aWVyLCBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgJHNtb290aEJlemllcjtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICB3aWR0aDogNTZweDtcblxuICAgICYuemVsZi1pY29uLWJ1dHRvbi0tYm9yZGVyLXNvZnQge1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIH1cblxuICAgIHN2ZyB7XG4gICAgICAgIHRyYW5zaXRpb246IGZpbGwgMC4zcyAkc21vb3RoQmV6aWVyO1xuICAgICAgICBmaWxsOiAkYmxhY2s7XG4gICAgfVxuXG4gICAgJjpob3ZlciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNiNTg5ZjAgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHdoaXRlO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB3aGl0ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWJvcmRlci1zb2Z0IHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICB9XG5cbiAgICAmLS00MCB7XG4gICAgICAgIGhlaWdodDogNDBweDtcbiAgICAgICAgbWluLWhlaWdodDogNDBweDtcbiAgICAgICAgbWluLXdpZHRoOiA0MHB4O1xuICAgICAgICB3aWR0aDogNDBweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNDBweDtcblxuICAgICAgICAmLnplbGYtaWNvbi1idXR0b24tLWJvcmRlci1zb2Z0IHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1ibGFjayB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRibGFjayAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogJHdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuM3MgJHNtb290aEJlemllciwgYmFja2dyb3VuZC1jb2xvciAwLjNzICRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6ICR3aGl0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGdyYXkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkcGxhdGludW0gIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiAkZnJlbmNoR3JheTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWFudGktZmxhc2gtd2hpdGUge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYW50aUZsYXNoV2hpdGUgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6ICRibGFjayAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiAkYmxhY2s7XG4gICAgICAgIH1cblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNiNTg5ZjAgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiAkd2hpdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHBsYXRpbnVtICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogJGZyZW5jaEdyYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1lcnJvciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRlcnJvckxpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiAkZXJyb3IgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogJGVycm9yICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zdWNjZXNzIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGNvcnJlY3RMaWdodCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogJGNvcnJlY3QgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogJGNvcnJlY3QgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIkBpbXBvcnQgXCIuLi8uLi9zdHlsZXMvdmFyaWFibGVzXCI7XG5AaW1wb3J0IFwiLi4vLi4vc3R5bGVzL2J1dHRvbnNcIjtcblxuOmhvc3Qge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGZsZXgtZ3JvdzogMTtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuLndlbGNvbWUtb25ib2FyZGluZyB7XG4gICAgcGFkZGluZy10b3A6IDY4cHggIWltcG9ydGFudDtcbiAgICBwYWRkaW5nLWJvdHRvbTogNjhweCAhaW1wb3J0YW50O1xufVxuXG4uY2Fyb3VzZWwge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG1pbi1oZWlnaHQ6IDIwMHB4O1xuICAgIG92ZXJmbG93OiB2aXNpYmxlO1xuXG4gICAgJl9faXRlbS1jb250YWluZXIge1xuICAgICAgICBtaW4taGVpZ2h0OiAxNTBweDtcbiAgICB9XG5cbiAgICAmX19zdWJ0aXRsZSB7XG4gICAgICAgIG1hcmdpbi10b3A6IDEycHg7XG4gICAgfVxuXG4gICAgJl9faXRlbSB7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIH1cblxuICAgICZfX3Byb2dyZXNzIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHBsYXRpbnVtO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gICAgICAgIGhlaWdodDogNnB4O1xuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIHdpZHRoOiA5NnB4O1xuXG4gICAgICAgICYtYmFyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRwcmltYXJ5Q29sb3I7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgICAgICBsZWZ0OiAwO1xuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICAgICAgdG9wOiAwO1xuICAgICAgICAgICAgd2lkdGg6IDA7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB3aWR0aCA1cztcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIiRwcmltYXJ5Q29sb3I6ICMwZTI2ZmY7XG4kc2Vjb25kYXJ5Q29sb3I6ICNmZjU3MjE7XG4kYmxhY2s6ICMxODE4MTg7XG4kZ3JheTogIzczNzc3ZjtcbiR0YXVwZUdyYXk6ICM5NjkzOWU7XG4kZnJlbmNoR3JheTogI2MzYzZjZjtcbiRwbGF0aW51bTogI2UzZTNlMztcbiRhbnRpRmxhc2hXaGl0ZTogI2VlZWRmMTtcbiRzZWFTYWx0OiAjZjlmOWZjO1xuJHdoaXRlOiAjZmZmZmZmO1xuJHByaW1hcnlMaWdodDogI2ZmZWVlOTtcbiRlcnJvckRhcms6ICM2MDE0MTA7XG4kZXJyb3I6ICNkYzM2MmU7XG4kZXJyb3JMaWdodDogI2ZjZWVlZTtcbiRjb3JyZWN0RGFyazogIzBmNTIyMztcbiRjb3JyZWN0OiAjMWVhNDQ2O1xuJGNvcnJlY3RMaWdodDogI2U3ZjhlZDtcbiRpbmZvRGFyazogIzAwNGE3NztcbiRpbmZvOiAjMzk5OGQzO1xuJGluZm9MaWdodDogI2VjZjNmZTtcblxuJHNtb290aEJlemllcjogY3ViaWMtYmV6aWVyKDAuMjUsIDAuNCwgMC43LCAxKTtcblxuJG1heEV4dHJhU21hbGw6IDU5NXB4O1xuJG1pblNtYWxsOiA2MDBweDtcbiRtZWRpdW06IDc2OHB4O1xuJGxhcmdlOiA4ODlweDtcbiRjb21wdXRlcnM6IDEyMDBweDtcbiJdLCJzb3VyY2VSb290IjoiIn0= */"],
      data: {
        animation: [app_animations_swipe_left_animation__WEBPACK_IMPORTED_MODULE_1__.swipeLeft]
      }
    });
  }
}


/***/ })

}]);
//# sourceMappingURL=src_app_welcome-onboarding_welcome-onboarding_component_ts.js.map