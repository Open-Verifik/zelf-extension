"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["default-src_app_popout-decryptor_popout-decryptor_component_ts"],{

/***/ 37942
/*!****************************************************************!*\
  !*** ./src/app/popout-decryptor/popout-decryptor.component.ts ***!
  \****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PopoutDecryptorComponent: () => (/* binding */ PopoutDecryptorComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/flex-layout */ 39981);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/progress-bar */ 26354);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/progress-spinner */ 41134);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 34487);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var _vladmandic_face_api__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @vladmandic/face-api */ 12841);
/* harmony import */ var ngx_webcam__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ngx-webcam */ 93491);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs */ 33900);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var app_services_auth_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! app/services/auth.service */ 44796);
/* harmony import */ var app_chrome_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! app/chrome.service */ 85043);
/* harmony import */ var app_services_error_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! app/services/error.service */ 25424);
/* harmony import */ var app_http_wrapper_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! app/http-wrapper.service */ 84099);
/* harmony import */ var _services_popout_communication_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../services/popout-communication.service */ 8298);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var app_theme_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! app/theme.service */ 3278);
/* harmony import */ var app_vault_service__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! app/vault.service */ 19519);
/* harmony import */ var _wallet_service__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../wallet.service */ 69556);
/* harmony import */ var app_services_zelf_keys_service__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! app/services/zelf-keys.service */ 52368);




























const _c0 = ["maskResult"];
const _c1 = ["toSend"];
const _c2 = ["webcam"];
const _c3 = a0 => ({
  type: a0
});
function PopoutDecryptorComponent_div_0_div_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "mat-spinner", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r3("zelf_keys.popout_decryptor.loading_camera"));
  }
}
function PopoutDecryptorComponent_div_0_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 18)(1, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "camera_alt");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "h4");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function PopoutDecryptorComponent_div_0_div_11_Template_button_click_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r1.ngOnInit());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r3("zelf_keys.popout_decryptor.permission_required"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r3("zelf_keys.popout_decryptor.permission_allow"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r3("zelf_keys.popout_decryptor.retry"));
  }
}
function PopoutDecryptorComponent_div_0_div_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 18)(1, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "warning");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "h4");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function PopoutDecryptorComponent_div_0_div_12_Template_button_click_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r1.ngOnInit());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r3("zelf_keys.popout_decryptor.low_quality_title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r3("zelf_keys.popout_decryptor.low_quality_message"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r3("zelf_keys.popout_decryptor.retry"));
  }
}
function PopoutDecryptorComponent_div_0_div_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 21)(1, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "error");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "h4");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function PopoutDecryptorComponent_div_0_div_13_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r1.onRetry());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r1.error);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", t_r3("zelf_keys.popout_decryptor.retry"), " ");
  }
}
function PopoutDecryptorComponent_div_0_div_14_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 28)(1, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 30)(4, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "span", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", (ctx_r1.errorFace == null ? null : ctx_r1.errorFace.icon) || "face", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r1.errorFace == null ? null : ctx_r1.errorFace.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r1.errorFace == null ? null : ctx_r1.errorFace.subtitle);
  }
}
function PopoutDecryptorComponent_div_0_div_14_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "mat-spinner", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r3("zelf_keys.popout_decryptor.processing"));
  }
}
function PopoutDecryptorComponent_div_0_div_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 22)(1, "div", 23)(2, "webcam", 24, 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("imageCapture", function PopoutDecryptorComponent_div_0_div_14_Template_webcam_imageCapture_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r1.processImage($event));
    })("initError", function PopoutDecryptorComponent_div_0_div_14_Template_webcam_initError_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r7);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r1.cameraError($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](4, "canvas", 25, 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](6, PopoutDecryptorComponent_div_0_div_14_div_6_Template, 8, 3, "div", 26)(7, PopoutDecryptorComponent_div_0_div_14_div_7_Template, 4, 1, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("allowCameraSwitch", false)("height", ctx_r1.camera.dimensions.video.height)("trigger", ctx_r1.takePicture$)("videoOptions", ctx_r1.camera.configuration)("width", ctx_r1.camera.dimensions.video.width);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("height", ctx_r1.camera.dimensions.video.height, "px")("width", ctx_r1.camera.dimensions.video.width, "px");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.errorFace);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.response.isLoading);
  }
}
function PopoutDecryptorComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 4)(1, "div", 5)(2, "button", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function PopoutDecryptorComponent_div_0_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r1.onCancel());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, "close");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "h3", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](10, PopoutDecryptorComponent_div_0_div_10_Template, 4, 1, "div", 11)(11, PopoutDecryptorComponent_div_0_div_11_Template, 9, 3, "div", 12)(12, PopoutDecryptorComponent_div_0_div_12_Template, 9, 3, "div", 12)(13, PopoutDecryptorComponent_div_0_div_13_Template, 7, 2, "div", 13)(14, PopoutDecryptorComponent_div_0_div_14_Template, 8, 11, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](15, "canvas", 15, 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r3 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx_r1.response.isLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-label", t_r3("zelf_keys.popout_decryptor.cancel"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r1.dataTypeIcon);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", t_r3("zelf_keys.popout_decryptor.title", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](9, _c3, t_r3("zelf_keys.popout_decryptor.types." + ctx_r1.recordType))), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.camera.isLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx_r1.camera.hasPermissions);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.camera.isLowQuality);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.error);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx_r1.camera.isLoading && ctx_r1.camera.hasPermissions && !ctx_r1.camera.isLowQuality && !ctx_r1.error);
  }
}
class PopoutDecryptorComponent {
  _authService;
  _changeDetectorRef;
  _chromeService;
  _errorService;
  _httpWrapperService;
  _popoutCommunicationService;
  _router;
  _themeService;
  _translocoService;
  _vaultService;
  _walletService;
  _zelfKeysService;
  maskResultCanvasRef;
  ToSendCanvasRef;
  webcamRef;
  mode = "popup";
  close = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
  decryptedData = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
  _destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_11__.Subject();
  _intervals = {};
  _takePicture$ = new rxjs__WEBPACK_IMPORTED_MODULE_11__.Subject();
  aspectRatio = 0.75;
  camera = {
    isLoading: true,
    hasPermissions: true,
    isLowQuality: false,
    dimensions: {
      video: {
        width: 0,
        height: 0,
        max: {
          width: 400,
          height: 300
        }
      },
      real: {
        width: 0,
        height: 0,
        offsetX: 0,
        offsetY: 0
      }
    },
    configuration: {
      facingMode: "user",
      width: {
        ideal: 1920
      },
      height: {
        ideal: 1080
      }
    }
  };
  error = null;
  errorFace = null;
  face = {
    video: {
      center: {
        x: 0,
        y: 0
      },
      radius: {
        x: 0,
        y: 0
      },
      margin: {
        x: 0,
        y: 0
      }
    },
    real: {
      center: {
        x: 0,
        y: 0
      },
      radius: {
        x: 0,
        y: 0
      },
      margin: {
        x: 0,
        y: 0
      }
    },
    minHeight: 80,
    minPixels: 80,
    successPosition: 0,
    threshold: 0.1
  };
  lastFace;
  record = {};
  response = {
    base64Image: "",
    isLoading: false
  };
  wallet;
  constructor(_authService, _changeDetectorRef, _chromeService, _errorService, _httpWrapperService, _popoutCommunicationService, _router, _themeService, _translocoService, _vaultService, _walletService, _zelfKeysService) {
    this._authService = _authService;
    this._changeDetectorRef = _changeDetectorRef;
    this._chromeService = _chromeService;
    this._errorService = _errorService;
    this._httpWrapperService = _httpWrapperService;
    this._popoutCommunicationService = _popoutCommunicationService;
    this._router = _router;
    this._themeService = _themeService;
    this._translocoService = _translocoService;
    this._vaultService = _vaultService;
    this._walletService = _walletService;
    this._zelfKeysService = _zelfKeysService;
    this._getRecordForDecryptingFromService();
    this._initializeDecryptionData();
    this._initializeBiometrics();
  }
  ngOnInit() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this._getRecordForDecryptingFromService();
      yield _this._setWallet();
      _this._setupCloseMessageListener();
    })();
  }
  ngOnDestroy() {
    if (this._intervals.detectFace) clearInterval(this._intervals.detectFace);
    if (this._intervals.checkNgxVideo) clearInterval(this._intervals.checkNgxVideo);
    this._popoutCommunicationService.clearDecryptionData();
    this._stopCamera();
    this._destroy$.next();
    this._destroy$.complete();
  }
  get dataTypeIcon() {
    switch (this.recordType) {
      case "note":
      case "notes":
        return "note";
      case "credit_card":
      case "payment-card":
        return "credit_card";
      case "zotp":
        return "key";
      case "wallet":
        return "wallet";
      default:
        return "lock";
    }
  }
  get recordType() {
    return this.record?.type || "password";
  }
  get takePicture$() {
    return this._takePicture$.asObservable();
  }
  _setWallet() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const wallet = yield _this2._walletService.getFirstWalletFromStorage();
      if (!wallet?.name) {
        _this2._router.navigate(["/welcome"]);
        return;
      }
      _this2.wallet = wallet;
      _this2._changeDetectorRef.detectChanges();
    })();
  }
  _checkVideoStreamReady() {
    const videoNgx = this.webcamRef?.nativeVideoElement;
    if (!videoNgx) return;
    clearInterval(this._intervals.checkNgxVideo);
    this._intervals.checkNgxVideo = null;
    videoNgx.addEventListener("loadeddata", () => {
      this._startFaceDetectionInterval();
      this._setVideoDimensions(videoNgx);
      this._drawOvalCenterAndMask();
    }, {
      once: true
    });
    this._setVideoDimensions(videoNgx);
    this._drawOvalCenterAndMask();
  }
  _closeDecryptor() {
    try {
      this._stopCamera();
      this.close.emit();
      if (this.mode === "embedded") return;
      window.close();
    } catch (error) {
      console.warn("Error closing popup:", error);
    }
  }
  _detectFace() {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const videoNgx = _this3.webcamRef?.nativeVideoElement;
      if (!videoNgx || _this3.response.base64Image) return;
      try {
        const detection = yield _vladmandic_face_api__WEBPACK_IMPORTED_MODULE_9__.detectAllFaces(videoNgx, new _vladmandic_face_api__WEBPACK_IMPORTED_MODULE_9__.SsdMobilenetv1Options({
          minConfidence: 0.2
        })).withFaceLandmarks();
        const context = _this3.maskResultCanvasRef?.nativeElement.getContext("2d", {
          willReadFrequently: true
        });
        if (!context) return;
        _this3._drawOvalCenterAndMask();
        if (detection.length > 0) {
          _this3.lastFace = detection[0];
          _this3.errorFace = null;
          _this3.camera.dimensions.real = {
            height: videoNgx.videoHeight,
            width: videoNgx.videoWidth,
            offsetX: 0,
            offsetY: 0
          };
          _this3.face.real = _this3._getCenterAndRadius(videoNgx.videoHeight, videoNgx.videoWidth);
          _this3._isFaceCentered(_this3.lastFace.landmarks.getNose()[3]);
          _this3._isFaceClose(_this3.lastFace.landmarks);
          _this3._drawStatusOval(context, !_this3.errorFace);
          if (!_this3.errorFace) {
            ++_this3.face.successPosition;
          } else {
            _this3.face.successPosition = 0;
          }
          if (_this3.face.successPosition > 0) {
            _this3.face.successPosition = 0;
            _this3._takePicture$.next();
            clearInterval(_this3._intervals.detectFace);
          }
        } else {
          _this3.face.successPosition = 0;
          _this3.errorFace = {
            icon: "face",
            title: "No face detected",
            subtitle: "Please look at the camera"
          };
          _this3._drawStatusOval(context, false);
        }
        _this3._changeDetectorRef.markForCheck();
      } catch (error) {
        console.error("Face detection error:", error);
        const context = _this3.maskResultCanvasRef?.nativeElement.getContext("2d");
        if (context) _this3._drawStatusOval(context, false);
      }
    })();
  }
  _drawOvalCenterAndMask() {
    const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;
    if (!maskResultCanvas) return;
    const ctx = maskResultCanvas.getContext("2d");
    if (!ctx) return;
    const videoDim = this.camera.dimensions.video;
    if (!videoDim.width || !videoDim.height) return;
    maskResultCanvas.width = videoDim.width;
    maskResultCanvas.height = videoDim.height;
    const {
      center,
      radius
    } = this.face.video || {
      center: {
        x: 0,
        y: 0
      },
      radius: {
        x: 0,
        y: 0
      }
    };
    ctx.clearRect(0, 0, maskResultCanvas.width, maskResultCanvas.height);
    ctx.fillStyle = this._themeService.getCurrentThemeMaskColor();
    ctx.fillRect(0, 0, maskResultCanvas.width, maskResultCanvas.height);
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.beginPath();
    ctx.ellipse(center.x, center.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.globalCompositeOperation = "source-over";
  }
  _drawStatusOval(ctx, isOk) {
    const {
      center,
      radius
    } = this.face.video || {
      center: {
        x: 0,
        y: 0
      },
      radius: {
        x: 0,
        y: 0
      }
    };
    ctx.beginPath();
    ctx.ellipse(center.x, center.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = isOk ? "green" : "red";
    ctx.stroke();
    ctx.closePath();
  }
  _emitBiometricCapture() {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const base64Data = _this4.response.base64Image.split(",")[1];
        const result = yield _this4._retrieveEncryptedRecord(base64Data);
        _this4._handleDecryptionSuccess(result);
      } catch (error) {
        console.error("Error in biometric capture:", error);
        _this4._handleError(error);
      }
    })();
  }
  _getCenterAndRadius(height, width) {
    const center = {
      x: width / 2,
      y: height / 2
    };
    const margin = {
      y: height * 0.05,
      x: 0
    };
    margin.x = margin.y * 0.8;
    const radius = {
      y: height * 0.35,
      x: 0
    };
    radius.x = radius.y * this.aspectRatio;
    if (radius.x * 2 >= width) {
      radius.x = width * 0.48;
      radius.y = radius.x / this.aspectRatio;
    }
    return {
      center,
      radius,
      margin
    };
  }
  _getRecordForDecryptingFromService() {
    const popoutData = this._popoutCommunicationService.getDecryptionData();
    this.record = this._normalizeDecryptionRecord(popoutData);
  }
  _normalizeDecryptionRecord(data) {
    if (!data) return {};
    const type = data.type || data.publicData?.type || "password";
    const zelfProof = data.zelfProof || data.publicData?.zelfProof || "";
    return {
      ...data,
      type,
      zelfProof,
      publicData: data.publicData || {}
    };
  }
  _handleDecryptionSuccess(result) {
    this._popoutCommunicationService.setDecryptionResult(result);
    if (this.mode === "embedded") {
      this.decryptedData.emit(result);
    } else {
      this._sendDecryptionResultToBackground(result);
    }
    this._closeDecryptor();
  }
  _handleError(error) {
    const rawMessage = typeof error?.message === "string" ? error.message : "";
    if (rawMessage === "User cancelled decryption") {
      this._closeDecryptor();
      return;
    }
    const errorKey = this._errorService.resolveErrorKey(error);
    const translatedMessage = this._errorService.translateErrorMessage(errorKey);
    if (errorKey.includes("failed_to_decrypt") || errorKey.includes("encryption_key_didnt_match")) {
      this._logIdentifierDiagnostics(errorKey);
    }
    this.camera.isLoading = false;
    this.response.isLoading = false;
    this.response.base64Image = "";
    if (this._errorService.isLivenessError(errorKey)) {
      this.error = null;
      this.errorFace = {
        icon: "face",
        title: translatedMessage,
        subtitle: this._translocoService.translate("liveness.center_your_face_subtitle")
      };
      this._resetBiometricSession();
      this._changeDetectorRef.detectChanges();
      return;
    }
    this.error = translatedMessage;
    this.errorFace = null;
    this._resetBiometricSession();
    this._changeDetectorRef.detectChanges();
  }
  _initializeBiometrics() {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        _this5._walletService.faceapi$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.takeUntil)(_this5._destroy$)).subscribe(/*#__PURE__*/function () {
          var _ref = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (isLoaded) {
            if (!isLoaded) return;
            _this5.camera.isLoading = false;
            yield _this5._setMaxVideoDimensions();
            _this5._startNgxVideoInterval();
          });
          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }());
      } catch (error) {
        console.error("Error initializing biometrics:", error);
        _this5._handleError(error);
      }
    })();
  }
  _initializeDecryptionData() {
    this._popoutCommunicationService.decryptionData$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_12__.takeUntil)(this._destroy$)).subscribe(data => {
      if (!data) return;
      this.record = this._normalizeDecryptionRecord(data);
    });
  }
  _inRange(value, min, max) {
    return value >= min && value <= max;
  }
  _isFaceCentered(nose) {
    const faceCenterX = nose.x;
    const faceCenterY = nose.y;
    const {
      center,
      margin
    } = this.face.real || {
      center: {
        x: 0,
        y: 0
      },
      margin: {
        x: 0,
        y: 0
      }
    };
    const inRangeX = this._inRange(faceCenterX, center.x - margin.x, center.x + margin.x);
    const inRangeY = this._inRange(faceCenterY, center.y, center.y + margin.y * 2.5);
    const isFaceCentered = inRangeX && inRangeY;
    if (isFaceCentered) return;
    let direction = "";
    if (!inRangeX) direction += `${faceCenterX < center.x - margin.x ? "←" : "→"}`;
    if (!inRangeY) direction += `${faceCenterY < center.y ? "↓" : "↑"}`;
    this.errorFace = {
      canvas: direction,
      icon: "center_focus_strong",
      subtitle: "Center your face in the oval",
      title: "Center your face"
    };
  }
  _isFaceClose(landmarks) {
    const realDim = this.camera.dimensions.real || {
      height: 0,
      width: 0
    };
    const totalFaceArea = landmarks.imageHeight * landmarks.imageWidth;
    const totalImageArea = realDim.height * realDim.width;
    const faceProportion = totalFaceArea / totalImageArea;
    if (faceProportion < this.face.threshold || landmarks.imageHeight < this.face.minPixels || landmarks.imageWidth < this.face.minPixels) {
      this.errorFace = {
        icon: "zoom_in",
        title: "Get closer",
        subtitle: "Move your face closer to the camera"
      };
    }
  }
  _retrieveEncryptedRecord(faceBase64) {
    var _this6 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        if (!_this6.record.zelfProof) throw new Error("missing_zelf_proof");
        const base64Data = faceBase64.includes(",") ? faceBase64.split(",")[1] : faceBase64;
        const {
          publicKey: clientPublicKey,
          privateKey: clientPrivateKey
        } = yield _this6._vaultService.generateEphemeralKeyPair();
        const payload = {
          faceBase64: yield _this6._httpWrapperService.encryptMessage(base64Data),
          type: _this6.record.type,
          zelfProof: _this6.record.zelfProof,
          clientPublicKey
        };
        const response = yield _this6._zelfKeysService.retrieve(payload);
        yield _this6._vaultService.setLastVerified();
        const encryptedMessage = response?.data?.pgp?.encryptedMessage;
        const {
          publicData
        } = response.data;
        let decryptedData = response?.data?.metadata || {};
        if (encryptedMessage) {
          const jsonData = yield _this6._vaultService.decryptWithPrivateKey(encryptedMessage, clientPrivateKey);
          decryptedData = JSON.parse(jsonData);
          delete response?.data?.pgp;
        }
        if (!decryptedData) throw new Error("missing_decrypted_data");
        const resultData = {
          ...response?.data,
          ...decryptedData
        };
        if (_this6.record.type === "password") {
          resultData.password = decryptedData.password || "";
          resultData.username = publicData.username || "";
          resultData.website = publicData?.website || "";
        } else if (_this6.record.type === "credit_card" || _this6.record.type === "payment-card") {
          resultData.number = decryptedData.cardNumber || "";
          resultData.cvv = decryptedData.cvv || "";
          resultData.expiryMonth = decryptedData.expiryMonth || "";
          resultData.expiryYear = decryptedData.expiryYear || "";
        } else if (_this6.record.type === "notes" || _this6.record.type === "note") {
          resultData.title = publicData.title || "";
          resultData.content = decryptedData.content || "";
        }
        return {
          success: true,
          data: resultData
        };
      } catch (error) {
        _this6._handleError(error);
        throw error;
      }
    })();
  }
  _sendDecryptionResultToBackground(result) {
    try {
      if (typeof chrome !== "undefined" && chrome.runtime) {
        chrome.runtime.sendMessage({
          type: "DECRYPTION_RESULT_FROM_POPOUT",
          payload: {
            requestId: this.record.requestId,
            result: result
          }
        });
      }
    } catch (error) {
      console.error("Error sending decryption result to background:", error);
    }
  }
  _drawCrop(canvas, img, src, dst) {
    const context = canvas.getContext("2d");
    if (!context) return;
    canvas.width = dst.width;
    canvas.height = dst.height;
    context.drawImage(img, src.x, src.y, src.width, src.height, 0, 0, dst.width, dst.height);
  }
  /**
   * Compute the face-oval crop in both source (native video) and display coordinates.
   *
   * The live `<video>` element uses `object-fit: cover`, so the underlying source
   * frame is rendered with a uniform scale and the overflowing edges are clipped.
   * We replicate that mapping when cropping the captured frame so the preview canvas
   * and the to-send canvas share the same aspect ratio as what the user saw on screen
   * — otherwise the captured face gets stretched (egg-face).
   *
   * - `display` is the rectangle in popup coords (375x600). Used as the buffer for
   *   the preview canvas, rendered 1:1 by CSS.
   * - `original` is the corresponding rectangle in native source coords (e.g. 1920x1080),
   *   computed via the same single-scale + centered offset that `object-fit: cover` uses.
   *   `original` always has the same aspect as `display` so drawing `original -> display`
   *   is a pure uniform scale, no distortion.
   *
   * Returns `null` if face detection has not produced real dimensions yet.
   */
  _computeOvalCrops() {
    const videoDim = this.camera.dimensions.video;
    const realDim = this.camera.dimensions.real;
    if (!videoDim?.width || !videoDim?.height) return null;
    if (!realDim?.width || !realDim?.height) return null;
    const ovalRadiusX = this.face.video?.radius?.x || 0;
    const centerX = this.face.video?.center?.x ?? videoDim.width / 2;
    if (!ovalRadiusX) return null;
    const displayWidth = Math.min(2.8 * ovalRadiusX, videoDim.width);
    const display = {
      x: Math.max(0, centerX - displayWidth / 2),
      y: 0,
      width: displayWidth,
      height: videoDim.height
    };
    // object-fit: cover math — uniform scale so the source fully covers the display
    // box, then the box is read out of the centered visible portion of the source.
    const coverScale = Math.max(videoDim.width / realDim.width, videoDim.height / realDim.height);
    const visibleSrcWidth = videoDim.width / coverScale;
    const visibleSrcHeight = videoDim.height / coverScale;
    const offsetSrcX = (realDim.width - visibleSrcWidth) / 2;
    const offsetSrcY = (realDim.height - visibleSrcHeight) / 2;
    const original = {
      x: offsetSrcX + display.x / coverScale,
      y: offsetSrcY + display.y / coverScale,
      width: display.width / coverScale,
      height: display.height / coverScale
    };
    return {
      original,
      display
    };
  }
  /**
   * Optionally downscale a rect so that the longest edge does not exceed `maxEdge`.
   * Used to cap the to-send canvas size and reduce the base64 upload payload.
   */
  _capRect(rect, maxEdge) {
    const longest = Math.max(rect.width, rect.height);
    if (longest <= maxEdge) return rect;
    const scale = maxEdge / longest;
    return {
      x: rect.x,
      y: rect.y,
      width: Math.round(rect.width * scale),
      height: Math.round(rect.height * scale)
    };
  }
  _setMaxVideoDimensions() {
    var _this7 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const popupWidth = 375;
      const popupHeight = 600;
      const viewportWidth = popupWidth;
      const viewportHeight = popupHeight;
      _this7.camera.dimensions.video.width = viewportWidth;
      _this7.camera.dimensions.video.height = viewportHeight;
      _this7.face.video = _this7._getCenterAndRadius(viewportHeight, viewportWidth);
      _this7._changeDetectorRef.markForCheck();
    })();
  }
  _setupCloseMessageListener() {
    if (typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === "CLOSE_POPUP") {
          this._closeDecryptor();
          sendResponse({
            success: true
          });
        }
        return true;
      });
    }
  }
  _setVideoDimensions(videoElement) {
    const containerWidth = 375;
    const containerHeight = 600;
    videoElement.style.width = `${containerWidth}px`;
    videoElement.style.height = `${containerHeight}px`;
    videoElement.style.objectFit = "cover";
    videoElement.style.objectPosition = "center";
    this.camera.dimensions.video.height = containerHeight;
    this.camera.dimensions.video.width = containerWidth;
    this.face.video = this._getCenterAndRadius(containerHeight, containerWidth);
    const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;
    if (maskResultCanvas) {
      maskResultCanvas.style.marginLeft = `0px`;
      maskResultCanvas.style.marginTop = `0px`;
    }
    this._changeDetectorRef.markForCheck();
  }
  _logIdentifierDiagnostics(reason) {
    var _this8 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const accessToken = (yield _this8._chromeService.getItem("accessToken")) || "";
        const storedSessionIdentifier = (yield _this8._chromeService.getItem("sessionIdentifier")) || null;
        const jwtIdentifier = accessToken ? _this8._authService.getJwtIdentifier(accessToken) : null;
        console.warn("[Zelf Keys] popout decrypt failed — identifier diagnostics", {
          reason,
          jwtIdentifier,
          storedSessionIdentifier,
          identifierMismatch: !!(jwtIdentifier && storedSessionIdentifier && jwtIdentifier !== storedSessionIdentifier)
        });
      } catch (diagError) {
        console.warn("[Zelf Keys] failed to collect identifier diagnostics:", diagError);
      }
    })();
  }
  _resetBiometricSession() {
    this.response.base64Image = "";
    this.response.isLoading = false;
    this.errorFace = null;
    this.face.successPosition = 0;
    this.lastFace = null;
    const videoNgx = this.webcamRef?.nativeVideoElement;
    if (videoNgx) {
      this._setVideoDimensions(videoNgx);
    }
    this._drawOvalCenterAndMask();
    this._startFaceDetectionInterval();
    this._changeDetectorRef.markForCheck();
  }
  _startFaceDetectionInterval() {
    if (this._intervals.detectFace) {
      clearInterval(this._intervals.detectFace);
      this._intervals.detectFace = null;
    }
    this._intervals.detectFace = setInterval(() => {
      this._detectFace();
    }, 100);
  }
  _startNgxVideoInterval() {
    if (this._intervals.checkNgxVideo) {
      clearInterval(this._intervals.checkNgxVideo);
      this._intervals.checkNgxVideo = null;
    }
    this._intervals.checkNgxVideo = setInterval(() => this._checkVideoStreamReady(), 100);
  }
  _stopCamera() {
    try {
      if (!this.webcamRef) return;
      const videoElement = this.webcamRef.nativeVideoElement;
      if (!videoElement || !videoElement.srcObject) return;
      const stream = videoElement.srcObject;
      if (!stream) return;
      stream.getTracks().forEach(track => {
        track.stop();
      });
      videoElement.srcObject = null;
    } catch (error) {
      console.warn("Error stopping camera:", error);
    }
  }
  _takePictureLiveness(img) {
    const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;
    const toSendCanvas = this.ToSendCanvasRef?.nativeElement;
    if (!maskResultCanvas || !toSendCanvas) return;
    const crops = this._computeOvalCrops();
    if (!crops) {
      console.error("Camera dimensions not properly initialized");
      return;
    }
    const {
      original,
      display
    } = crops;
    // Preview canvas: buffer matches the display crop so CSS renders 1:1 (no squash).
    this._drawCrop(maskResultCanvas, img, original, display);
    // To-send canvas: buffer matches the native crop so the API gets a clean face
    // crop at full quality, capped to 1080px long edge to keep the payload light.
    const sendDst = this._capRect(original, 1080);
    this._drawCrop(toSendCanvas, img, original, sendDst);
    this.response.base64Image = toSendCanvas.toDataURL("image/jpeg", 0.92);
    this.response.isLoading = true;
    this._changeDetectorRef.detectChanges();
    this._emitBiometricCapture();
  }
  cameraError(error) {
    this._handleError(error);
  }
  onBiometricsCancel() {
    this._handleError({
      message: "User cancelled decryption"
    });
  }
  onCancel() {
    this.onBiometricsCancel();
  }
  onRetry() {
    this.error = null;
    this._resetBiometricSession();
  }
  processImage(webcamImage) {
    var _this9 = this;
    if (this.response.base64Image) return;
    const img = new Image();
    img.src = webcamImage.imageAsDataUrl;
    img.onload = /*#__PURE__*/(0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (img.height < _this9.face.minHeight) {
        _this9.camera.isLowQuality = true;
        return;
      }
      _this9._takePictureLiveness(img);
    });
  }
  static ɵfac = function PopoutDecryptorComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || PopoutDecryptorComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](app_services_auth_service__WEBPACK_IMPORTED_MODULE_15__.AuthService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_13__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](app_chrome_service__WEBPACK_IMPORTED_MODULE_16__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](app_services_error_service__WEBPACK_IMPORTED_MODULE_17__.ErrorService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](app_http_wrapper_service__WEBPACK_IMPORTED_MODULE_18__.HttpWrapperService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_services_popout_communication_service__WEBPACK_IMPORTED_MODULE_19__.PopoutCommunicationService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_20__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](app_theme_service__WEBPACK_IMPORTED_MODULE_21__.ThemeService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_jsverse_transloco__WEBPACK_IMPORTED_MODULE_8__.TranslocoService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](app_vault_service__WEBPACK_IMPORTED_MODULE_22__.VaultService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_wallet_service__WEBPACK_IMPORTED_MODULE_23__.WalletService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](app_services_zelf_keys_service__WEBPACK_IMPORTED_MODULE_24__.ZelfKeysService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: PopoutDecryptorComponent,
    selectors: [["popout-decryptor"]],
    viewQuery: function PopoutDecryptorComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c0, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c1, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c2, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.maskResultCanvasRef = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.ToSendCanvasRef = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.webcamRef = _t.first);
      }
    },
    inputs: {
      mode: "mode"
    },
    outputs: {
      close: "close",
      decryptedData: "decryptedData"
    },
    decls: 1,
    vars: 0,
    consts: [["toSend", ""], ["webcam", ""], ["maskResult", ""], ["class", "password-decryptor", 4, "transloco"], [1, "password-decryptor"], [1, "password-decryptor__header"], ["type", "button", 1, "password-decryptor__back", 3, "click", "disabled"], [1, "material-symbols-outlined"], [1, "material-symbols-outlined", "password-decryptor__icon"], [1, "password-decryptor__title"], [1, "password-decryptor__camera-container"], ["class", "password-decryptor__loading", 4, "ngIf"], ["class", "password-decryptor__error", 4, "ngIf"], ["class", "password-decryptor__error", "role", "alert", 4, "ngIf"], ["class", "password-decryptor__camera", 4, "ngIf"], [2, "display", "none"], [1, "password-decryptor__loading"], ["diameter", "30"], [1, "password-decryptor__error"], [1, "material-symbols-outlined", "password-decryptor__error-icon"], ["mat-raised-button", "", "color", "primary", 3, "click"], ["role", "alert", 1, "password-decryptor__error"], [1, "password-decryptor__camera"], [1, "password-decryptor__webcam-container"], [3, "imageCapture", "initError", "allowCameraSwitch", "height", "trigger", "videoOptions", "width"], [1, "password-decryptor__overlay"], ["class", "password-decryptor__status", "role", "status", "aria-live", "polite", 4, "ngIf"], ["class", "password-decryptor__processing", 4, "ngIf"], ["role", "status", "aria-live", "polite", 1, "password-decryptor__status"], [1, "material-symbols-outlined", "password-decryptor__status-icon"], [1, "password-decryptor__status-content"], [1, "password-decryptor__status-title"], [1, "password-decryptor__status-subtitle"], [1, "password-decryptor__processing"], ["diameter", "28"]],
    template: function PopoutDecryptorComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, PopoutDecryptorComponent_div_0_Template, 17, 11, "div", 3);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _angular_flex_layout__WEBPACK_IMPORTED_MODULE_3__.FlexLayoutModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButton, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_5__.MatProgressBarModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_6__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_6__.MatProgressSpinner, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_8__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_8__.TranslocoDirective, ngx_webcam__WEBPACK_IMPORTED_MODULE_10__.WebcamModule, ngx_webcam__WEBPACK_IMPORTED_MODULE_10__.WebcamComponent],
    styles: ["[_ngcontent-%COMP%]:root {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc);\n}\n\n.zelf-button-external-link[_ngcontent-%COMP%] {\n  display: block;\n}\n.zelf-button-external-link--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.zelf-button[_ngcontent-%COMP%] {\n  align-items: center;\n  border-radius: 16px;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  gap: 8px;\n  height: 56px;\n  justify-content: center;\n  outline: none;\n  padding: 8px 24px;\n  text-align: center;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.zelf-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-button[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: inherit;\n}\n.zelf-button__text--margin-right[_ngcontent-%COMP%] {\n  margin-right: 1rem;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-button--thin[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  padding: 12px 16px;\n}\n.zelf-button--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.zelf-button--wide.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-button--primary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button, #181818) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--primary[_ngcontent-%COMP%]:active {\n  --mdc-filled-button-container-color: var(--zns-theme-text-muted, #96939e) !important;\n  background-color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-hover, #ff5721) !important;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff) !important;\n  stroke: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-text-secondary, #73777f) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-text-secondary, #73777f) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--secondary[_ngcontent-%COMP%] {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-button-secondary-text, #495057) !important;\n  background-color: var(--zns-theme-button-secondary, #e9ecef) !important;\n  color: var(--zns-theme-button-secondary-text, #495057) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-secondary-text, #495057);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus, .zelf-button--secondary[_ngcontent-%COMP%]:hover {\n  --mdc-filled-button-container-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  --mdc-filled-button-label-text-color: var(--zns-theme-card, #ffffff) !important;\n  background-color: var(--zns-theme-button-secondary-hover, #e9ecef) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  --mdc-filled-button-container-color: var(--zns-theme-border, #e3e3e3) !important;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]:focus, .zelf-button--tertiary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-button--tertiary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818) !important;\n  stroke: var(--zns-theme-text, #181818) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%] {\n  --mdc-outlined-button-label-text-color: var(--zns-theme-button, #181818) !important;\n  --mdc-outlined-button-outline-color: var(--zns-theme-border, #e3e3e3) !important;\n  border: 1px solid var(--zns-theme-button, #181818) !important;\n  background-color: var(--zns-theme-card, #ffffff) !important;\n  color: var(--zns-theme-button, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button, #181818);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus, .zelf-button--outlined[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff) !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-button--outlined[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-button--outlined[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%] {\n  border: none !important;\n  background-color: transparent !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--red[_ngcontent-%COMP%]:focus, .zelf-button--red[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n}\n.zelf-button--red[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-button--red[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e);\n}\n.zelf-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n}\n\n.zelf-icon-button[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  align-items: center;\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  border-radius: 56px;\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  font-weight: 600;\n  gap: 16px;\n  height: 56px;\n  justify-content: center;\n  min-height: 56px;\n  min-width: 56px;\n  outline: none;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  -webkit-user-select: none;\n          user-select: none;\n  width: 56px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.zelf-icon-button.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: var(--zns-theme-text, #181818);\n  height: 24px;\n  width: 24px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card-border, #eeedf1);\n}\n.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%] {\n  height: 40px;\n  min-height: 40px;\n  min-width: 40px;\n  width: 40px;\n  border-radius: 40px;\n  padding: 0 8px;\n}\n.zelf-icon-button--40.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 14px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  height: 20px;\n  width: 20px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 14px;\n  font-weight: 500;\n  border-radius: 9999px;\n  padding: 8px 16px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background-color: var(--zns-theme-border, #e3e3e3);\n}\n.zelf-icon-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e);\n}\n.zelf-icon-button--hyperlink[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-muted, #96939e) !important;\n  stroke: var(--zns-theme-text-muted, #96939e) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-button, #181818) !important;\n  color: var(--zns-theme-button-text, #ffffff) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:active {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-button-hover, #ff5721) !important;\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff);\n}\n.zelf-icon-button--primary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-button-text, #ffffff) !important;\n  stroke: var(--zns-theme-button-text, #ffffff) !important;\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card-border, #eeedf1) !important;\n  color: var(--zns-theme-text, #181818) !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus, .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721) !important;\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-icon-button--secondary[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: var(--zns-theme-border, #e3e3e3) !important;\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--secondary[disabled][_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f) !important;\n  stroke: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%] {\n  background-color: transparent !important;\n  color: var(--zns-theme-text, #181818) !important;\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text-secondary, #73777f);\n}\n.zelf-icon-button--transparent[_ngcontent-%COMP%]:focus, .zelf-icon-button--transparent[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-background-secondary, #f9f9fc) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: var(--zns-theme-text-secondary, #73777f) !important;\n}\n.zelf-icon-button--transparent[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-border-hover, #c3c6cf);\n}\n.zelf-icon-button--text[_ngcontent-%COMP%] {\n  width: auto !important;\n  min-width: initial !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-error-text, #fceeee) !important;\n  color: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-error, #dc362e) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-success-text, #e7f8ed) !important;\n  color: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-success, #1ea446) !important;\n}\n.zelf-icon-button--pill[_ngcontent-%COMP%] {\n  border-radius: 9999px;\n  height: auto;\n  min-height: 0;\n  min-width: 0;\n  padding: 4px 12px;\n  width: auto;\n}\n\n.zelf-icon-button-group[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:first-child {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:not(:first-child):not(:last-child) {\n  border-radius: 0;\n}\n.zelf-icon-button-group[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:last-child {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.zelf-action-button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: 8px;\n}\n.zelf-action-button__icon[_ngcontent-%COMP%] {\n  padding: 10px 20px;\n  background: var(--zns-theme-card, #ffffff);\n  border-radius: 32px;\n  outline: 1px var(--zns-theme-border, #e3e3e3) solid;\n  outline-offset: -1px;\n  display: inline-flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  cursor: pointer;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n@media (max-width: 600px) {\n  .zelf-action-button__icon[_ngcontent-%COMP%] {\n    padding: 8px 14px;\n  }\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-size: 24px;\n  line-height: 1;\n  font-variation-settings: \"FILL\" 0, \"wght\" 400, \"GRAD\" 0, \"opsz\" 24;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-primary, #181818);\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon[_ngcontent-%COMP%]:hover   .zelf-action-button__text[_ngcontent-%COMP%] {\n  color: var(--zns-theme-card, #ffffff);\n}\n.zelf-action-button__icon-box[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  position: relative;\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n}\n.zelf-action-button__text[_ngcontent-%COMP%] {\n  width: auto;\n  white-space: nowrap;\n  text-align: center;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-size: 11px;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-weight: 600;\n  line-height: 16px;\n  letter-spacing: 0.5px;\n  word-wrap: normal;\n}\n\n[_nghost-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 1000;\n}\n\n.password-decryptor[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-width: var(--zns-card-width, 375px);\n  min-height: var(--zns-card-min-height, 600px);\n  overflow: hidden;\n  background: var(--zns-theme-background, #ffffff);\n  display: flex;\n  flex-direction: column;\n}\n.password-decryptor__header[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  z-index: 10;\n  background: linear-gradient(to bottom, color-mix(in oklab, var(--zns-theme-background, #ffffff) 95%, transparent) 0%, color-mix(in oklab, var(--zns-theme-background, #ffffff) 60%, transparent) 70%, transparent 100%);\n  backdrop-filter: blur(calc(14px * var(--zns-space-scale, 1)));\n  padding: calc(14px * var(--zns-space-scale, 1)) calc(56px * var(--zns-space-scale, 1)) calc(22px * var(--zns-space-scale, 1));\n  text-align: center;\n}\n.password-decryptor__back[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(12px * var(--zns-space-scale, 1));\n  left: calc(12px * var(--zns-space-scale, 1));\n  z-index: 12;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: calc(36px * var(--zns-space-scale, 1));\n  height: calc(36px * var(--zns-space-scale, 1));\n  padding: 0;\n  border-radius: 12px;\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  background: color-mix(in oklab, var(--zns-theme-card, #ffffff) 85%, transparent);\n  backdrop-filter: blur(10px);\n  color: var(--zns-theme-text, #181818);\n  cursor: pointer;\n  box-shadow: 0 6px 16px -10px color-mix(in oklab, var(--zns-theme-primary, #181818) 60%, transparent);\n  transition: background-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), transform 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), border-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.password-decryptor__back[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  font-size: calc(20px * var(--zns-font-scale, 1));\n}\n.password-decryptor__back[_ngcontent-%COMP%]:hover:not([disabled]) {\n  background: var(--zns-theme-card, #ffffff);\n  border-color: var(--zns-theme-border-hover, #c3c6cf);\n  transform: translateX(-1px);\n}\n.password-decryptor__back[_ngcontent-%COMP%]:active:not([disabled]) {\n  transform: translateX(-1px) scale(0.97);\n}\n.password-decryptor__back[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  opacity: 0.45;\n}\n.password-decryptor__icon[_ngcontent-%COMP%] {\n  font-size: calc(22px * var(--zns-font-scale, 1));\n  width: calc(22px * var(--zns-space-scale, 1));\n  height: calc(22px * var(--zns-space-scale, 1));\n  margin-bottom: calc(2px * var(--zns-space-scale, 1));\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  color: var(--zns-theme-text, #181818);\n}\n.password-decryptor__title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: calc(15px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  letter-spacing: -0.005em;\n  color: var(--zns-theme-text, #181818);\n}\n.password-decryptor__camera-container[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.password-decryptor__loading[_ngcontent-%COMP%], .password-decryptor__error[_ngcontent-%COMP%] {\n  padding: calc(20px * var(--zns-space-scale, 1));\n  text-align: center;\n  border-radius: calc(8px * var(--zns-space-scale, 1));\n  background: var(--zns-theme-background, #ffffff);\n  margin: calc(20px * var(--zns-space-scale, 1));\n}\n.password-decryptor__error-icon[_ngcontent-%COMP%] {\n  font-size: calc(32px * var(--zns-font-scale, 1));\n  width: calc(32px * var(--zns-space-scale, 1));\n  height: calc(32px * var(--zns-space-scale, 1));\n  margin-bottom: calc(12px * var(--zns-space-scale, 1));\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.password-decryptor__camera[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.password-decryptor__webcam-container[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  width: var(--zns-card-width, 375px);\n  height: var(--zns-card-min-height, 600px);\n  flex: 0 0 auto;\n  background: var(--zns-theme-background, #ffffff);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  image-rendering: -webkit-optimize-contrast;\n  image-rendering: crisp-edges;\n  transform: translateZ(0);\n}\n.password-decryptor__overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  pointer-events: none;\n  z-index: 5;\n  width: var(--zns-card-width, 375px);\n  height: var(--zns-card-min-height, 600px);\n}\n.password-decryptor__status[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(76px * var(--zns-space-scale, 1));\n  left: 50%;\n  transform: translateX(-50%);\n  z-index: 8;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 8px 14px 8px 8px;\n  border-radius: 18px;\n  background: rgba(24, 24, 24, 0.78);\n  backdrop-filter: blur(14px) saturate(140%);\n  color: #fff;\n  box-shadow: 0 18px 38px -22px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.08);\n  min-width: calc(220px * var(--zns-space-scale, 1));\n  max-width: min(340px * var(--zns-space-scale, 1), 100% - 24px);\n  width: max-content;\n  animation: _ngcontent-%COMP%_password-decryptor-status-pop 0.25s cubic-bezier(0.25, 0.4, 0.7, 1) both;\n}\n.password-decryptor__status-icon[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 26px;\n  height: 26px;\n  border-radius: 50%;\n  background: color-mix(in oklab, var(--zns-theme-secondary, #ff5721) 80%, white);\n  color: #fff;\n  font-size: calc(15px * var(--zns-font-scale, 1));\n  font-variation-settings: \"FILL\" 1, \"wght\" 500, \"GRAD\" 0, \"opsz\" 24;\n}\n.password-decryptor__status-content[_ngcontent-%COMP%] {\n  min-width: 0;\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  text-align: left;\n  line-height: 1.2;\n}\n.password-decryptor__status-title[_ngcontent-%COMP%] {\n  font-size: calc(13px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  letter-spacing: 0.01em;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.password-decryptor__status-subtitle[_ngcontent-%COMP%] {\n  font-size: calc(11px * var(--zns-font-scale, 1));\n  font-weight: 400;\n  opacity: 0.8;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.password-decryptor__processing[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background: rgba(24, 24, 24, 0.85);\n  backdrop-filter: blur(16px) saturate(140%);\n  color: #fff;\n  padding: calc(18px * var(--zns-space-scale, 1)) calc(22px * var(--zns-space-scale, 1));\n  border-radius: 16px;\n  text-align: center;\n  z-index: 10;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: calc(10px * var(--zns-space-scale, 1));\n  box-shadow: 0 20px 40px -22px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.08);\n}\n.password-decryptor__processing[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: calc(13px * var(--zns-font-scale, 1));\n  font-weight: 500;\n}\n.password-decryptor__processing[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  stroke: #fff !important;\n}\n.password-decryptor__processing[_ngcontent-%COMP%]   mat-spinner[_ngcontent-%COMP%]   circle[_ngcontent-%COMP%] {\n  stroke: #fff !important;\n}\n\n@keyframes _ngcontent-%COMP%_password-decryptor-status-pop {\n  0% {\n    opacity: 0;\n    transform: translate(-50%, -8px);\n  }\n  100% {\n    opacity: 1;\n    transform: translate(-50%, 0);\n  }\n}\n.master-password-sheet[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  z-index: 100;\n  display: flex;\n  flex-direction: column;\n  padding: calc(28px * var(--zns-space-scale, 1)) calc(20px * var(--zns-space-scale, 1)) calc(20px * var(--zns-space-scale, 1));\n  background: radial-gradient(120% 80% at 50% -10%, color-mix(in oklab, var(--zns-theme-secondary, #ff5721) 14%, transparent) 0%, transparent 60%), radial-gradient(80% 60% at 100% 110%, color-mix(in oklab, var(--zns-theme-primary, #181818) 10%, transparent) 0%, transparent 70%), var(--zns-theme-background, #ffffff);\n  overflow: hidden;\n  isolation: isolate;\n}\n.master-password-sheet__aurora[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: -20%;\n  z-index: 0;\n  pointer-events: none;\n  background: radial-gradient(40% 30% at 30% 20%, color-mix(in oklab, var(--zns-theme-secondary, #ff5721) 18%, transparent), transparent 70%), radial-gradient(35% 25% at 75% 80%, color-mix(in oklab, var(--zns-theme-primary, #181818) 12%, transparent), transparent 70%);\n  filter: blur(40px);\n  opacity: 0.85;\n  animation: _ngcontent-%COMP%_master-password-sheet-aurora 14s ease-in-out infinite alternate;\n}\n.master-password-sheet__body[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n  gap: calc(10px * var(--zns-space-scale, 1));\n  flex: 1;\n  padding-top: calc(8px * var(--zns-space-scale, 1));\n}\n.master-password-sheet__badge[_ngcontent-%COMP%] {\n  position: relative;\n  width: calc(76px * var(--zns-space-scale, 1));\n  height: calc(76px * var(--zns-space-scale, 1));\n  margin-bottom: calc(4px * var(--zns-space-scale, 1));\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.master-password-sheet__badge-ring[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  border-radius: 50%;\n  border: 1px solid color-mix(in oklab, var(--zns-theme-secondary, #ff5721) 35%, transparent);\n  opacity: 0;\n  animation: _ngcontent-%COMP%_master-password-sheet-pulse 2.6s ease-out infinite;\n}\n.master-password-sheet__badge-ring--outer[_ngcontent-%COMP%] {\n  animation-delay: 0.4s;\n}\n.master-password-sheet__badge-ring--inner[_ngcontent-%COMP%] {\n  inset: 6px;\n}\n.master-password-sheet__badge-core[_ngcontent-%COMP%] {\n  position: relative;\n  width: calc(60px * var(--zns-space-scale, 1));\n  height: calc(60px * var(--zns-space-scale, 1));\n  border-radius: 50%;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  background: radial-gradient(120% 120% at 30% 20%, color-mix(in oklab, var(--zns-theme-card, #ffffff) 90%, white) 0%, var(--zns-theme-card, #ffffff) 60%), linear-gradient(135deg, var(--zns-theme-primary, #181818), color-mix(in oklab, var(--zns-theme-secondary, #ff5721) 65%, var(--zns-theme-primary, #181818)));\n  box-shadow: 0 18px 38px -18px color-mix(in oklab, var(--zns-theme-primary, #181818) 50%, transparent), 0 6px 16px -10px color-mix(in oklab, var(--zns-theme-secondary, #ff5721) 70%, transparent), inset 0 0 0 1px color-mix(in oklab, var(--zns-theme-border, #e3e3e3) 50%, transparent);\n}\n.master-password-sheet__badge-core[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text, #181818);\n  font-size: calc(30px * var(--zns-font-scale, 1));\n  font-variation-settings: \"FILL\" 0, \"wght\" 500, \"GRAD\" 0, \"opsz\" 24;\n}\n.master-password-sheet__title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-family: var(--zns-theme-title-family, \"Menda\", \"Arial Black\", sans-serif);\n  font-size: calc(20px * var(--zns-font-scale, 1));\n  font-weight: 700;\n  letter-spacing: -0.01em;\n  color: var(--zns-theme-text, #181818);\n}\n.master-password-sheet__subtitle[_ngcontent-%COMP%] {\n  margin: 0 auto;\n  max-width: 28ch;\n  font-size: calc(13px * var(--zns-font-scale, 1));\n  line-height: 1.45;\n  color: var(--zns-theme-text-secondary, #73777f);\n}\n.master-password-sheet__context[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  padding: 6px 12px;\n  margin-top: calc(2px * var(--zns-space-scale, 1));\n  max-width: 100%;\n  border-radius: 9999px;\n  background: color-mix(in oklab, var(--zns-theme-background-secondary, #f9f9fc) 80%, transparent);\n  border: 1px solid color-mix(in oklab, var(--zns-theme-border, #e3e3e3) 60%, transparent);\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-text-secondary, #73777f);\n}\n.master-password-sheet__context[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-text-muted, #96939e);\n}\n.master-password-sheet__context-text[_ngcontent-%COMP%] {\n  max-width: 220px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.master-password-sheet__error[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 8px 12px;\n  border-radius: 12px;\n  background: var(--zns-theme-error-text, #fceeee);\n  color: var(--zns-theme-error, #dc362e);\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  font-weight: 500;\n  width: 100%;\n  text-align: left;\n}\n.master-password-sheet__error[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  font-size: calc(16px * var(--zns-font-scale, 1));\n}\n.master-password-sheet__field[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  width: 100%;\n  margin-top: calc(8px * var(--zns-space-scale, 1));\n  padding: 0 calc(8px * var(--zns-space-scale, 1)) 0 calc(14px * var(--zns-space-scale, 1));\n  border-radius: 16px;\n  background: var(--zns-theme-card, #ffffff);\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  box-shadow: 0 10px 30px -22px color-mix(in oklab, var(--zns-theme-primary, #181818) 60%, transparent), inset 0 0 0 1px color-mix(in oklab, var(--zns-theme-card, #ffffff) 100%, transparent);\n  transition: border-color 0.25s cubic-bezier(0.25, 0.4, 0.7, 1), box-shadow 0.25s cubic-bezier(0.25, 0.4, 0.7, 1), transform 0.25s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.master-password-sheet__field[_ngcontent-%COMP%]:focus-within {\n  border-color: color-mix(in oklab, var(--zns-theme-secondary, #ff5721) 65%, var(--zns-theme-border, #e3e3e3));\n  box-shadow: 0 0 0 4px color-mix(in oklab, var(--zns-theme-secondary, #ff5721) 18%, transparent), 0 16px 36px -22px color-mix(in oklab, var(--zns-theme-primary, #181818) 60%, transparent);\n}\n.master-password-sheet__field--error[_ngcontent-%COMP%] {\n  border-color: var(--zns-theme-error, #dc362e);\n}\n.master-password-sheet__field--error[_ngcontent-%COMP%]:focus-within {\n  border-color: var(--zns-theme-error, #dc362e);\n  box-shadow: 0 0 0 4px color-mix(in oklab, var(--zns-theme-error, #dc362e) 18%, transparent);\n}\n.master-password-sheet__field-icon[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text-muted, #96939e);\n  font-size: calc(18px * var(--zns-font-scale, 1));\n  margin-right: 8px;\n}\n.master-password-sheet__input[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  height: calc(48px * var(--zns-space-scale, 1));\n  background: transparent;\n  border: none;\n  outline: none;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-text, #181818);\n  letter-spacing: 0.02em;\n}\n.master-password-sheet__input[_ngcontent-%COMP%]::placeholder {\n  color: var(--zns-theme-text-muted, #96939e);\n  font-weight: 400;\n}\n.master-password-sheet__toggle[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 36px;\n  height: 36px;\n  border-radius: 12px;\n  border: none;\n  background: transparent;\n  color: var(--zns-theme-text-muted, #96939e);\n  cursor: pointer;\n  transition: background-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.master-password-sheet__toggle[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  font-size: calc(18px * var(--zns-font-scale, 1));\n}\n.master-password-sheet__toggle[_ngcontent-%COMP%]:hover, .master-password-sheet__toggle[_ngcontent-%COMP%]:focus-visible {\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  color: var(--zns-theme-text, #181818);\n  outline: none;\n}\n.master-password-sheet__hint[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  margin-top: calc(2px * var(--zns-space-scale, 1));\n  font-size: calc(11px * var(--zns-font-scale, 1));\n  font-weight: 500;\n  letter-spacing: 0.01em;\n  color: var(--zns-theme-text-muted, #96939e);\n}\n.master-password-sheet__hint[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  color: var(--zns-theme-success, #1ea446);\n}\n.master-password-sheet__actions[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  display: flex;\n  flex-direction: column;\n  gap: calc(6px * var(--zns-space-scale, 1));\n  margin-top: calc(20px * var(--zns-space-scale, 1));\n}\n.master-password-sheet__cta[_ngcontent-%COMP%] {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n  width: 100%;\n  height: calc(52px * var(--zns-space-scale, 1));\n  padding: 0 20px;\n  border: none;\n  border-radius: 16px;\n  cursor: pointer;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  letter-spacing: 0.01em;\n  color: var(--zns-theme-button-text, #ffffff);\n  background: linear-gradient(135deg, var(--zns-theme-primary, #181818) 0%, color-mix(in oklab, var(--zns-theme-secondary, #ff5721) 35%, var(--zns-theme-primary, #181818)) 100%);\n  box-shadow: 0 14px 30px -16px color-mix(in oklab, var(--zns-theme-primary, #181818) 70%, transparent), inset 0 1px 0 color-mix(in oklab, white 18%, transparent);\n  transition: transform 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), box-shadow 0.25s cubic-bezier(0.25, 0.4, 0.7, 1), filter 0.25s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.master-password-sheet__cta[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  font-size: calc(18px * var(--zns-font-scale, 1));\n}\n.master-password-sheet__cta[_ngcontent-%COMP%]:hover:not([disabled]) {\n  transform: translateY(-1px);\n  filter: brightness(1.05);\n  box-shadow: 0 18px 36px -16px color-mix(in oklab, var(--zns-theme-primary, #181818) 70%, transparent), inset 0 1px 0 color-mix(in oklab, white 22%, transparent);\n}\n.master-password-sheet__cta[_ngcontent-%COMP%]:active:not([disabled]) {\n  transform: translateY(0);\n  filter: brightness(0.96);\n}\n.master-password-sheet__cta[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  opacity: 0.5;\n  box-shadow: none;\n}\n.master-password-sheet__ghost[_ngcontent-%COMP%] {\n  background: transparent;\n  border: none;\n  padding: 10px;\n  cursor: pointer;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: calc(13px * var(--zns-font-scale, 1));\n  font-weight: 500;\n  color: var(--zns-theme-text-secondary, #73777f);\n  border-radius: 12px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.master-password-sheet__ghost[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n}\n\n@keyframes _ngcontent-%COMP%_master-password-sheet-pulse {\n  0% {\n    opacity: 0.7;\n    transform: scale(0.92);\n  }\n  70% {\n    opacity: 0;\n    transform: scale(1.25);\n  }\n  100% {\n    opacity: 0;\n    transform: scale(1.25);\n  }\n}\n@keyframes _ngcontent-%COMP%_master-password-sheet-aurora {\n  0% {\n    transform: translate3d(0, 0, 0) scale(1);\n  }\n  100% {\n    transform: translate3d(2%, -3%, 0) scale(1.05);\n  }\n}\n  .password-decryptor webcam {\n  width: var(--zns-card-width, 375px) !important;\n  height: var(--zns-card-min-height, 600px) !important;\n  display: block !important;\n  position: relative !important;\n  transform: scaleX(-1);\n}\n  .password-decryptor webcam video {\n  border-radius: calc(8px * var(--zns-space-scale, 1));\n  width: var(--zns-card-width, 375px) !important;\n  height: var(--zns-card-min-height, 600px) !important;\n  object-fit: cover !important;\n  object-position: center !important;\n  display: block !important;\n  position: absolute !important;\n  top: 0 !important;\n  left: 0 !important;\n  image-rendering: -webkit-optimize-contrast;\n  image-rendering: crisp-edges;\n  transform: translateZ(0);\n  image-rendering: auto;\n  image-rendering: smooth;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX2J1dHRvbnMuc2NzcyIsIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX3ZhcmlhYmxlcy5zY3NzIiwid2VicGFjazovLy4vc3JjL2FwcC9wb3BvdXQtZGVjcnlwdG9yL3BvcG91dC1kZWNyeXB0b3IuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxnRUMwQnVCO0FDM0IzQjs7QUZJQTtFQUNJLGNBQUE7QUVESjtBRkdJO0VBQ0ksV0FBQTtBRURSOztBRktBO0VBQ0ksbUJBQUE7RUFDQSxtQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLHVFQ0ljO0VESGQsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsUUFBQTtFQUNBLFlBQUE7RUFDQSx1QkFBQTtFQUNBLGFBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7VUFBQSxpQkFBQTtBRUZKO0FGSUk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLFFBQUE7QUVGUjtBRktJO0VBQ0ksU0FBQTtFQUNBLGNBQUE7QUVIUjtBRk9RO0VBQ0ksa0JBQUE7QUVMWjtBRlNJO0VBQ0ksNkJBQUE7RUFDQSwrQ0NsQmE7RURtQmIsZUFBQTtFQUNBLGdCQUFBO0VBQ0EscUJBQUE7RUFDQSxpQkFBQTtFQUNBLDZHQUNJO0FFUlo7QUZXUTtFQUNJLGVBQUE7QUVUWjtBRllRO0VBQ0ksOENDaENTO0FDc0JyQjtBRmFRO0VBQ0kscUNDdENBO0VEdUNBLGtEQ3hCRTtBQ2FkO0FGYVk7RUFDSSxvQ0MxQ0o7QUMrQlo7QUZlUTtFQUNJLG1CQUFBO0VBQ0Esc0RBQUE7QUViWjtBRmVZO0VBQ0ksMENDbERDO0FDcUNqQjtBRmtCSTtFQUNJLGtCQUFBO0VBQ0Esa0JBQUE7QUVoQlI7QUZtQkk7RUFDSSxXQUFBO0FFakJSO0FGbUJRO0VBQ0ksbUJBQUE7QUVqQlo7QUZxQkk7RUFFSSxnRkFBQTtFQUNBLCtFQUFB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O0VBQ0EsdUJBQUE7QUFvWWhCIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcIi4vdmFyaWFibGVzXCI7XG5cbjpyb290IHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbn1cblxuLnplbGYtYnV0dG9uLWV4dGVybmFsLWxpbmsge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuXG4gICAgJi0td2lkZSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cbn1cblxuLnplbGYtYnV0dG9uIHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBnYXA6IDhweDtcbiAgICBoZWlnaHQ6IDU2cHg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBwYWRkaW5nOiA4cHggMjRweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG5cbiAgICBzcGFuIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogOHB4O1xuICAgIH1cblxuICAgIHAge1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIGNvbG9yOiBpbmhlcml0O1xuICAgIH1cblxuICAgICZfX3RleHQge1xuICAgICAgICAmLS1tYXJnaW4tcmlnaHQge1xuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0taHlwZXJsaW5rIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIHBhZGRpbmc6IDhweCAxNnB4O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmLS1zbWFsbCB7XG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tdGhpbiB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgcGFkZGluZzogMTJweCAxNnB4O1xuICAgIH1cblxuICAgICYtLXdpZGUge1xuICAgICAgICB3aWR0aDogMTAwJTtcblxuICAgICAgICAmLnplbGYtYnV0dG9uLS1oeXBlcmxpbmsge1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXByaW1hcnkge1xuICAgICAgICAvLyBNREMgbWF0LWZsYXQtYnV0dG9uIHBhaW50cyB2aWEgQ1NTIHZhcmlhYmxlczsgYWxpZ24gd2l0aCBaZWxmIHRva2VucyAoYXZvaWRzIGRlZmF1bHQgTWF0ZXJpYWwgYmx1ZSkuXG4gICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b259ICFpbXBvcnRhbnQ7XG4gICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tbGFiZWwtdGV4dC1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQ2FyZH0gIWltcG9ydGFudDtcblxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmFjdGl2ZSB7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAtLW1kYy1maWxsZWQtYnV0dG9uLWNvbnRhaW5lci1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXJ9ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIC0tbWRjLWZpbGxlZC1idXR0b24tY29udGFpbmVyLWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5fSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVDYXJkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc2Vjb25kYXJ5IHtcbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeX0gIWltcG9ydGFudDtcbiAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0fSAhaW1wb3J0YW50O1xuXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1sYWJlbC10ZXh0LWNvbG9yOiAje3ZhcmlhYmxlcy4kdGhlbWVDYXJkfSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgLS1tZGMtZmlsbGVkLWJ1dHRvbi1jb250YWluZXItY29sb3I6ICN7dmFyaWFibGVzLiR0aGVtZUJvcmRlcn0gIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10ZXJ0aWFyeSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3IgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgbWF0LXNwaW5uZXIgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHQgIWltcG9ydGFudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tb3V0bGluZWQge1xuICAgICAgICAtLW1kYy1vdXRsaW5lZC1idXR0b24tbGFiZWwtdGV4dC1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQnV0dG9ufSAhaW1wb3J0YW50O1xuICAgICAgICAtLW1kYy1vdXRsaW5lZC1idXR0b24tb3V0bGluZS1jb2xvcjogI3t2YXJpYWJsZXMuJHRoZW1lQm9yZGVyfSAhaW1wb3J0YW50O1xuXG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b247XG4gICAgICAgIH1cblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1yZWQge1xuICAgICAgICBib3JkZXI6IG5vbmUgIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tZXJyb3Ige1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc3VjY2VzcyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdExpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRjb3JyZWN0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1waWxsIHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBtaW4taGVpZ2h0OiAwO1xuICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgICAgIHBhZGRpbmc6IDRweCAxMnB4O1xuICAgIH1cbn1cblxuLnplbGYtaWNvbi1idXR0b24ge1xuICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyLXJhZGl1czogNTZweDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgZ2FwOiAxNnB4O1xuICAgIGhlaWdodDogNTZweDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBtaW4taGVpZ2h0OiA1NnB4O1xuICAgIG1pbi13aWR0aDogNTZweDtcbiAgICBvdXRsaW5lOiBub25lO1xuICAgIHRyYW5zaXRpb246XG4gICAgICAgIGNvbG9yIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICB3aWR0aDogNTZweDtcblxuICAgIHNwYW4ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgfVxuXG4gICAgJi56ZWxmLWljb24tYnV0dG9uLS1ib3JkZXItc29mdCB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgfVxuXG4gICAgc3ZnIHtcbiAgICAgICAgdHJhbnNpdGlvbjogZmlsbCAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgaGVpZ2h0OiAyNHB4O1xuICAgICAgICB3aWR0aDogMjRweDtcbiAgICB9XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tYm9yZGVyLXNvZnQge1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIH1cblxuICAgICYtLTQwIHtcbiAgICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgICBtaW4taGVpZ2h0OiA0MHB4O1xuICAgICAgICBtaW4td2lkdGg6IDQwcHg7XG4gICAgICAgIHdpZHRoOiA0MHB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA0MHB4O1xuICAgICAgICBwYWRkaW5nOiAwIDhweDtcblxuICAgICAgICAmLnplbGYtaWNvbi1idXR0b24tLWJvcmRlci1zb2Z0IHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgaGVpZ2h0OiAyMHB4O1xuICAgICAgICAgICAgd2lkdGg6IDIwcHg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1oeXBlcmxpbmsge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICAgICAgcGFkZGluZzogOHB4IDE2cHg7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICYtLXNtYWxsIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHN0cm9rZTogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tcHJpbWFyeSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b24gIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6YWN0aXZlIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uSG92ZXIgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlciAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBtYXQtc3Bpbm5lciBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiB2YXJpYWJsZXMuJHRoZW1lQnV0dG9uVGV4dCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc2Vjb25kYXJ5IHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXIgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0ICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG1hdC1zcGlubmVyIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBzdHJva2U6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10cmFuc3BhcmVudCB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnkgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQm9yZGVySG92ZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS10ZXh0IHtcbiAgICAgICAgd2lkdGg6IGF1dG8gIWltcG9ydGFudDtcbiAgICAgICAgbWluLXdpZHRoOiBpbml0aWFsICFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgJi0tZXJyb3Ige1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3IgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc3VjY2VzcyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kY29ycmVjdExpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGNvcnJlY3QgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiRjb3JyZWN0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1waWxsIHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBoZWlnaHQ6IGF1dG87XG4gICAgICAgIG1pbi1oZWlnaHQ6IDA7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgcGFkZGluZzogNHB4IDEycHg7XG4gICAgICAgIHdpZHRoOiBhdXRvO1xuICAgIH1cbn1cblxuLnplbGYtaWNvbi1idXR0b24tZ3JvdXAge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDA7XG5cbiAgICAuemVsZi1pY29uLWJ1dHRvbiB7XG4gICAgICAgICY6Zmlyc3QtY2hpbGQge1xuICAgICAgICAgICAgYm9yZGVyLXRvcC1yaWdodC1yYWRpdXM6IDA7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6bm90KDpmaXJzdC1jaGlsZCk6bm90KDpsYXN0LWNoaWxkKSB7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpsYXN0LWNoaWxkIHtcbiAgICAgICAgICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDA7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAwO1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uemVsZi1hY3Rpb24tYnV0dG9uIHtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogOHB4O1xuXG4gICAgJl9faWNvbiB7XG4gICAgICAgIHBhZGRpbmc6IDEwcHggMjBweDtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDMycHg7XG4gICAgICAgIG91dGxpbmU6IDFweCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyIHNvbGlkO1xuICAgICAgICBvdXRsaW5lLW9mZnNldDogLTFweDtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4zcyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogdmFyaWFibGVzLiRtaW5TbWFsbCkge1xuICAgICAgICAgICAgcGFkZGluZzogOHB4IDE0cHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBmaWxsIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgICAgIH1cblxuICAgICAgICAubWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBmb250LXNpemU6IDI0cHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcbiAgICAgICAgICAgIGZvbnQtdmFyaWF0aW9uLXNldHRpbmdzOlxuICAgICAgICAgICAgICAgIFwiRklMTFwiIDAsXG4gICAgICAgICAgICAgICAgXCJ3Z2h0XCIgNDAwLFxuICAgICAgICAgICAgICAgIFwiR1JBRFwiIDAsXG4gICAgICAgICAgICAgICAgXCJvcHN6XCIgMjQ7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjNzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHByaW1hcnlDb2xvcjtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQge1xuICAgICAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLnplbGYtYWN0aW9uLWJ1dHRvbl9fdGV4dCB7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9faWNvbi1ib3gge1xuICAgICAgICB3aWR0aDogMjhweDtcbiAgICAgICAgaGVpZ2h0OiAyOHB4O1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX190ZXh0IHtcbiAgICAgICAgd2lkdGg6IGF1dG87XG4gICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDE2cHg7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjVweDtcbiAgICAgICAgd29yZC13cmFwOiBub3JtYWw7XG4gICAgfVxufVxuIiwiJHByaW1hcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXByaW1hcnksICMxODE4MTgpO1xuJHByaW1hcnlMaWdodDogI2RhZGRmYTtcbiRzZWNvbmRhcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXNlY29uZGFyeSwgI2ZmNTcyMSk7XG4kc2Vjb25kYXJ5Q29sb3JMaWdodDogI2Y2ZTVlMDtcblxuJGNvcnJlY3Q6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLCAjMWVhNDQ2KTtcbiRjb3JyZWN0RGFyazogIzBmNTIyMztcbiRjb3JyZWN0TGlnaHQ6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLXRleHQsICNlN2Y4ZWQpO1xuXG4kZXJyb3I6IHZhcigtLXpucy10aGVtZS1lcnJvciwgI2RjMzYyZSk7XG4kZXJyb3JEYXJrOiAjNjAxNDEwO1xuJGVycm9yTGlnaHQ6IHZhcigtLXpucy10aGVtZS1lcnJvci10ZXh0LCAjZmNlZWVlKTtcblxuJHdhcm5pbmc6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLCAjZGU2ODAwKTtcbiR3YXJuaW5nRGFyazogIzRhMjEwYTtcbiR3YXJuaW5nTGlnaHQ6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLXRleHQsICNmZmVlZTkpO1xuXG4kaW5mbzogIzM5OThkMztcbiRpbmZvRGFyazogIzAwNGE3NztcbiRpbmZvTGlnaHQ6ICNlY2YzZmU7XG5cbiRibGFjazogIzE4MTgxODtcbiR3aGl0ZTogI2ZmZmZmZjtcblxuJHRoZW1lQm9keUZhbWlseTogdmFyKC0tem5zLXRoZW1lLWJvZHktZmFtaWx5LCBcIlBvcHBpbnNcIiwgQXJpYWwsIHNhbnMtc2VyaWYpO1xuJHRoZW1lVGl0bGVGYW1pbHk6IHZhcigtLXpucy10aGVtZS10aXRsZS1mYW1pbHksIFwiTWVuZGFcIiwgXCJBcmlhbCBCbGFja1wiLCBzYW5zLXNlcmlmKTtcbiR0aGVtZU1vbm9zcGFjZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLW1vbm9zcGFjZS1mYW1pbHksIFwiQ291cmllciBOZXdcIiwgQ291cmllciwgbW9ub3NwYWNlKTtcblxuJHRoZW1lQmFja2dyb3VuZDogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQsICNmZmZmZmYpO1xuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQtc2Vjb25kYXJ5LCAjZjlmOWZjKTtcblxuJHRoZW1lVGV4dDogdmFyKC0tem5zLXRoZW1lLXRleHQsICMxODE4MTgpO1xuJHRoZW1lVGV4dE11dGVkOiB2YXIoLS16bnMtdGhlbWUtdGV4dC1tdXRlZCwgIzk2OTM5ZSk7XG4kdGhlbWVUZXh0U2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtdGV4dC1zZWNvbmRhcnksICM3Mzc3N2YpO1xuXG4kdGhlbWVIZWFkZXI6IHZhcigtLXpucy10aGVtZS1oZWFkZXIsICMxODE4MTgpO1xuJHRoZW1lSGVhZGVyVGV4dDogdmFyKC0tem5zLXRoZW1lLWhlYWRlci10ZXh0LCAjZmZmZmZmKTtcblxuJHRoZW1lQnV0dG9uOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLCAjMTgxODE4KTtcbiR0aGVtZUJ1dHRvblRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tdGV4dCwgI2ZmZmZmZik7XG4kdGhlbWVCdXR0b25Ib3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1ob3ZlciwgI2ZmNTcyMSk7XG5cbiR0aGVtZUJ1dHRvblNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnksICNlOWVjZWYpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktdGV4dCwgIzQ5NTA1Nyk7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktaG92ZXIsICNlOWVjZWYpO1xuXG4kdGhlbWVCb3JkZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXIsICNlM2UzZTMpO1xuJHRoZW1lQm9yZGVySG92ZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXItaG92ZXIsICNjM2M2Y2YpO1xuXG4kdGhlbWVDYXJkOiB2YXIoLS16bnMtdGhlbWUtY2FyZCwgI2ZmZmZmZik7XG4kdGhlbWVDYXJkQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtY2FyZC1ib3JkZXIsICNlZWVkZjEpO1xuXG4kdGhlbWVTaGFkb3c6IHZhcigtLXpucy10aGVtZS1zaGFkb3csIHJnYmEoMCwgMCwgMCwgMC4xKSk7XG5cbiRzbW9vdGhCZXppZXI6IGN1YmljLWJlemllcigwLjI1LCAwLjQsIDAuNywgMSk7XG5cbiRtYXhFeHRyYVNtYWxsOiA1OTVweDtcbiRtaW5TbWFsbDogNjAwcHg7XG4kbWVkaXVtOiA3NjhweDtcbiRsYXJnZTogODg5cHg7XG4kY29tcHV0ZXJzOiAxMjAwcHg7XG4iLCJAdXNlIFwiLi4vLi4vc3R5bGVzL3ZhcmlhYmxlc1wiO1xuQHVzZSBcIi4uLy4uL3N0eWxlcy9idXR0b25zXCI7XG5cbjpob3N0IHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgaW5zZXQ6IDA7XG4gICAgei1pbmRleDogMTAwMDtcbn1cblxuLnBhc3N3b3JkLWRlY3J5cHRvciB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGhlaWdodDogMTAwJTtcbiAgICBtaW4td2lkdGg6IHZhcigtLXpucy1jYXJkLXdpZHRoLCAzNzVweCk7XG4gICAgbWluLWhlaWdodDogdmFyKC0tem5zLWNhcmQtbWluLWhlaWdodCwgNjAwcHgpO1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmQ7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXG4gICAgJl9faGVhZGVyIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB0b3A6IDA7XG4gICAgICAgIGxlZnQ6IDA7XG4gICAgICAgIHJpZ2h0OiAwO1xuICAgICAgICB6LWluZGV4OiAxMDtcbiAgICAgICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgY29sb3ItbWl4KGluIG9rbGFiLCB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZCA5NSUsIHRyYW5zcGFyZW50KSAwJSwgY29sb3ItbWl4KGluIG9rbGFiLCB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZCA2MCUsIHRyYW5zcGFyZW50KSA3MCUsIHRyYW5zcGFyZW50IDEwMCUpO1xuICAgICAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoY2FsYygxNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSkpO1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDE0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBjYWxjKDU2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBjYWxjKDIycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuICAgICZfX2JhY2sge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIHRvcDogY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGxlZnQ6IGNhbGMoMTJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB6LWluZGV4OiAxMjtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICB3aWR0aDogY2FsYygzNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGhlaWdodDogY2FsYygzNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHBhZGRpbmc6IDA7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG4gICAgICAgIGJhY2tncm91bmQ6IGNvbG9yLW1peChpbiBva2xhYiwgdmFyaWFibGVzLiR0aGVtZUNhcmQgODUlLCB0cmFuc3BhcmVudCk7XG4gICAgICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cigxMHB4KTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIGJveC1zaGFkb3c6IDAgNnB4IDE2cHggLTEwcHggY29sb3ItbWl4KGluIG9rbGFiLCB2YXJpYWJsZXMuJHByaW1hcnlDb2xvciA2MCUsIHRyYW5zcGFyZW50KTtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3IgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIHRyYW5zZm9ybSAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYm9yZGVyLWNvbG9yIDAuMnMgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgLm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQge1xuICAgICAgICAgICAgZm9udC1zaXplOiBjYWxjKDIwcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3Zlcjpub3QoW2Rpc2FibGVkXSkge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMXB4KTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6YWN0aXZlOm5vdChbZGlzYWJsZWRdKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTFweCkgc2NhbGUoMC45Nyk7XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgb3BhY2l0eTogMC40NTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2ljb24ge1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMjJweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIHdpZHRoOiBjYWxjKDIycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgaGVpZ2h0OiBjYWxjKDIycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogY2FsYygycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgfVxuXG4gICAgJl9fdGl0bGUge1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNXB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IC0wLjAwNWVtO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgfVxuXG4gICAgJl9fY2FtZXJhLWNvbnRhaW5lciB7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgZmxleDogMTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgfVxuXG4gICAgJl9fbG9hZGluZyxcbiAgICAmX19lcnJvciB7XG4gICAgICAgIHBhZGRpbmc6IGNhbGMoMjBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kO1xuICAgICAgICBtYXJnaW46IGNhbGMoMjBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX2Vycm9yLWljb24ge1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMzJweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIHdpZHRoOiBjYWxjKDMycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgaGVpZ2h0OiBjYWxjKDMycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX19jYW1lcmEge1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIH1cblxuICAgICZfX3dlYmNhbS1jb250YWluZXIge1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIHdpZHRoOiB2YXIoLS16bnMtY2FyZC13aWR0aCwgMzc1cHgpO1xuICAgICAgICBoZWlnaHQ6IHZhcigtLXpucy1jYXJkLW1pbi1oZWlnaHQsIDYwMHB4KTtcbiAgICAgICAgZmxleDogMCAwIGF1dG87XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblxuICAgICAgICBpbWFnZS1yZW5kZXJpbmc6IC13ZWJraXQtb3B0aW1pemUtY29udHJhc3Q7XG4gICAgICAgIGltYWdlLXJlbmRlcmluZzogY3Jpc3AtZWRnZXM7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWigwKTtcbiAgICB9XG5cbiAgICAmX19vdmVybGF5IHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB0b3A6IDA7XG4gICAgICAgIGxlZnQ6IDA7XG4gICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgICAgICB6LWluZGV4OiA1O1xuICAgICAgICB3aWR0aDogdmFyKC0tem5zLWNhcmQtd2lkdGgsIDM3NXB4KTtcbiAgICAgICAgaGVpZ2h0OiB2YXIoLS16bnMtY2FyZC1taW4taGVpZ2h0LCA2MDBweCk7XG4gICAgfVxuXG4gICAgJl9fc3RhdHVzIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICB0b3A6IGNhbGMoNzZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBsZWZ0OiA1MCU7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcbiAgICAgICAgei1pbmRleDogODtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiAxMHB4O1xuICAgICAgICBwYWRkaW5nOiA4cHggMTRweCA4cHggOHB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxOHB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0LCAyNCwgMjQsIDAuNzgpO1xuICAgICAgICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMTRweCkgc2F0dXJhdGUoMTQwJSk7XG4gICAgICAgIGNvbG9yOiAjZmZmO1xuICAgICAgICBib3gtc2hhZG93OlxuICAgICAgICAgICAgMCAxOHB4IDM4cHggLTIycHggcmdiYSgwLCAwLCAwLCAwLjU1KSxcbiAgICAgICAgICAgIGluc2V0IDAgMCAwIDFweCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDgpO1xuICAgICAgICBtaW4td2lkdGg6IGNhbGMoMjIwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgbWF4LXdpZHRoOiBtaW4oY2FsYygzNDBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpLCBjYWxjKDEwMCUgLSAyNHB4KSk7XG4gICAgICAgIHdpZHRoOiBtYXgtY29udGVudDtcbiAgICAgICAgYW5pbWF0aW9uOiBwYXNzd29yZC1kZWNyeXB0b3Itc3RhdHVzLXBvcCAwLjI1cyB2YXJpYWJsZXMuJHNtb290aEJlemllciBib3RoO1xuICAgIH1cblxuICAgICZfX3N0YXR1cy1pY29uIHtcbiAgICAgICAgZmxleDogMCAwIGF1dG87XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgd2lkdGg6IDI2cHg7XG4gICAgICAgIGhlaWdodDogMjZweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgICAgICBiYWNrZ3JvdW5kOiBjb2xvci1taXgoaW4gb2tsYWIsIHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3IgODAlLCB3aGl0ZSk7XG4gICAgICAgIGNvbG9yOiAjZmZmO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTVweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGZvbnQtdmFyaWF0aW9uLXNldHRpbmdzOlxuICAgICAgICAgICAgXCJGSUxMXCIgMSxcbiAgICAgICAgICAgIFwid2dodFwiIDUwMCxcbiAgICAgICAgICAgIFwiR1JBRFwiIDAsXG4gICAgICAgICAgICBcIm9wc3pcIiAyNDtcbiAgICB9XG5cbiAgICAmX19zdGF0dXMtY29udGVudCB7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgZmxleDogMTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiAycHg7XG4gICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjI7XG4gICAgfVxuXG4gICAgJl9fc3RhdHVzLXRpdGxlIHtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDEzcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4wMWVtO1xuICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICB9XG5cbiAgICAmX19zdGF0dXMtc3VidGl0bGUge1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTFweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gICAgICAgIG9wYWNpdHk6IDAuODtcbiAgICAgICAgZGlzcGxheTogLXdlYmtpdC1ib3g7XG4gICAgICAgIC13ZWJraXQtbGluZS1jbGFtcDogMjtcbiAgICAgICAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbDtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgfVxuXG4gICAgJl9fcHJvY2Vzc2luZyB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgdG9wOiA1MCU7XG4gICAgICAgIGxlZnQ6IDUwJTtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjQsIDI0LCAyNCwgMC44NSk7XG4gICAgICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cigxNnB4KSBzYXR1cmF0ZSgxNDAlKTtcbiAgICAgICAgY29sb3I6ICNmZmY7XG4gICAgICAgIHBhZGRpbmc6IGNhbGMoMThweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpIGNhbGMoMjJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIHotaW5kZXg6IDEwO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiBjYWxjKDEwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYm94LXNoYWRvdzpcbiAgICAgICAgICAgIDAgMjBweCA0MHB4IC0yMnB4IHJnYmEoMCwgMCwgMCwgMC42KSxcbiAgICAgICAgICAgIGluc2V0IDAgMCAwIDFweCByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDgpO1xuXG4gICAgICAgIHAge1xuICAgICAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICAgICAgZm9udC1zaXplOiBjYWxjKDEzcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgfVxuXG4gICAgICAgIG1hdC1zcGlubmVyIHtcbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiAjZmZmICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNpcmNsZSB7XG4gICAgICAgICAgICAgICAgc3Ryb2tlOiAjZmZmICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBrZXlmcmFtZXMgcGFzc3dvcmQtZGVjcnlwdG9yLXN0YXR1cy1wb3Age1xuICAgIDAlIHtcbiAgICAgICAgb3BhY2l0eTogMDtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLThweCk7XG4gICAgfVxuXG4gICAgMTAwJSB7XG4gICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIDApO1xuICAgIH1cbn1cblxuLm1hc3Rlci1wYXNzd29yZC1zaGVldCB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGluc2V0OiAwO1xuICAgIHotaW5kZXg6IDEwMDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgcGFkZGluZzogY2FsYygyOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSkgY2FsYygyMHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSkgY2FsYygyMHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgYmFja2dyb3VuZDpcbiAgICAgICAgcmFkaWFsLWdyYWRpZW50KDEyMCUgODAlIGF0IDUwJSAtMTAlLCBjb2xvci1taXgoaW4gb2tsYWIsIHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3IgMTQlLCB0cmFuc3BhcmVudCkgMCUsIHRyYW5zcGFyZW50IDYwJSksXG4gICAgICAgIHJhZGlhbC1ncmFkaWVudCg4MCUgNjAlIGF0IDEwMCUgMTEwJSwgY29sb3ItbWl4KGluIG9rbGFiLCB2YXJpYWJsZXMuJHByaW1hcnlDb2xvciAxMCUsIHRyYW5zcGFyZW50KSAwJSwgdHJhbnNwYXJlbnQgNzAlKSxcbiAgICAgICAgdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmQ7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICBpc29sYXRpb246IGlzb2xhdGU7XG5cbiAgICAmX19hdXJvcmEge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIGluc2V0OiAtMjAlO1xuICAgICAgICB6LWluZGV4OiAwO1xuICAgICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICAgICAgYmFja2dyb3VuZDpcbiAgICAgICAgICAgIHJhZGlhbC1ncmFkaWVudCg0MCUgMzAlIGF0IDMwJSAyMCUsIGNvbG9yLW1peChpbiBva2xhYiwgdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAxOCUsIHRyYW5zcGFyZW50KSwgdHJhbnNwYXJlbnQgNzAlKSxcbiAgICAgICAgICAgIHJhZGlhbC1ncmFkaWVudCgzNSUgMjUlIGF0IDc1JSA4MCUsIGNvbG9yLW1peChpbiBva2xhYiwgdmFyaWFibGVzLiRwcmltYXJ5Q29sb3IgMTIlLCB0cmFuc3BhcmVudCksIHRyYW5zcGFyZW50IDcwJSk7XG4gICAgICAgIGZpbHRlcjogYmx1cig0MHB4KTtcbiAgICAgICAgb3BhY2l0eTogMC44NTtcbiAgICAgICAgYW5pbWF0aW9uOiBtYXN0ZXItcGFzc3dvcmQtc2hlZXQtYXVyb3JhIDE0cyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGU7XG4gICAgfVxuXG4gICAgJl9fYm9keSB7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgei1pbmRleDogMTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBnYXA6IGNhbGMoMTBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBmbGV4OiAxO1xuICAgICAgICBwYWRkaW5nLXRvcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19iYWRnZSB7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgd2lkdGg6IGNhbGMoNzZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBoZWlnaHQ6IGNhbGMoNzZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBtYXJnaW4tYm90dG9tOiBjYWxjKDRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX19iYWRnZS1yaW5nIHtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICBpbnNldDogMDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsYWIsIHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3IgMzUlLCB0cmFuc3BhcmVudCk7XG4gICAgICAgIG9wYWNpdHk6IDA7XG4gICAgICAgIGFuaW1hdGlvbjogbWFzdGVyLXBhc3N3b3JkLXNoZWV0LXB1bHNlIDIuNnMgZWFzZS1vdXQgaW5maW5pdGU7XG5cbiAgICAgICAgJi0tb3V0ZXIge1xuICAgICAgICAgICAgYW5pbWF0aW9uLWRlbGF5OiAwLjRzO1xuICAgICAgICB9XG5cbiAgICAgICAgJi0taW5uZXIge1xuICAgICAgICAgICAgaW5zZXQ6IDZweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2JhZGdlLWNvcmUge1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIHdpZHRoOiBjYWxjKDYwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgaGVpZ2h0OiBjYWxjKDYwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGJhY2tncm91bmQ6XG4gICAgICAgICAgICByYWRpYWwtZ3JhZGllbnQoMTIwJSAxMjAlIGF0IDMwJSAyMCUsIGNvbG9yLW1peChpbiBva2xhYiwgdmFyaWFibGVzLiR0aGVtZUNhcmQgOTAlLCB3aGl0ZSkgMCUsIHZhcmlhYmxlcy4kdGhlbWVDYXJkIDYwJSksXG4gICAgICAgICAgICBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCB2YXJpYWJsZXMuJHByaW1hcnlDb2xvciwgY29sb3ItbWl4KGluIG9rbGFiLCB2YXJpYWJsZXMuJHNlY29uZGFyeUNvbG9yIDY1JSwgdmFyaWFibGVzLiRwcmltYXJ5Q29sb3IpKTtcbiAgICAgICAgYm94LXNoYWRvdzpcbiAgICAgICAgICAgIDAgMThweCAzOHB4IC0xOHB4IGNvbG9yLW1peChpbiBva2xhYiwgdmFyaWFibGVzLiRwcmltYXJ5Q29sb3IgNTAlLCB0cmFuc3BhcmVudCksXG4gICAgICAgICAgICAwIDZweCAxNnB4IC0xMHB4IGNvbG9yLW1peChpbiBva2xhYiwgdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciA3MCUsIHRyYW5zcGFyZW50KSxcbiAgICAgICAgICAgIGluc2V0IDAgMCAwIDFweCBjb2xvci1taXgoaW4gb2tsYWIsIHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgNTAlLCB0cmFuc3BhcmVudCk7XG5cbiAgICAgICAgLm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgZm9udC1zaXplOiBjYWxjKDMwcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICAgICAgZm9udC12YXJpYXRpb24tc2V0dGluZ3M6XG4gICAgICAgICAgICAgICAgXCJGSUxMXCIgMCxcbiAgICAgICAgICAgICAgICBcIndnaHRcIiA1MDAsXG4gICAgICAgICAgICAgICAgXCJHUkFEXCIgMCxcbiAgICAgICAgICAgICAgICBcIm9wc3pcIiAyNDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3RpdGxlIHtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZVRpdGxlRmFtaWx5O1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMjBweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAtMC4wMWVtO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgfVxuXG4gICAgJl9fc3VidGl0bGUge1xuICAgICAgICBtYXJnaW46IDAgYXV0bztcbiAgICAgICAgbWF4LXdpZHRoOiAyOGNoO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTNweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjQ1O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgfVxuXG4gICAgJl9fY29udGV4dCB7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IDZweDtcbiAgICAgICAgcGFkZGluZzogNnB4IDEycHg7XG4gICAgICAgIG1hcmdpbi10b3A6IGNhbGMoMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIG1heC13aWR0aDogMTAwJTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5OXB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiBjb2xvci1taXgoaW4gb2tsYWIsIHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5IDgwJSwgdHJhbnNwYXJlbnQpO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsYWIsIHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIgNjAlLCB0cmFuc3BhcmVudCk7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxMnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuXG4gICAgICAgIC5tYXRlcmlhbC1zeW1ib2xzLW91dGxpbmVkIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fY29udGV4dC10ZXh0IHtcbiAgICAgICAgbWF4LXdpZHRoOiAyMjBweDtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgfVxuXG4gICAgJl9fZXJyb3Ige1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgcGFkZGluZzogOHB4IDEycHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kZXJyb3JMaWdodDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3I7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxMnB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG5cbiAgICAgICAgLm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQge1xuICAgICAgICAgICAgZm9udC1zaXplOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fZmllbGQge1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBtYXJnaW4tdG9wOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBwYWRkaW5nOiAwIGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSkgMCBjYWxjKDE0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVCb3JkZXI7XG4gICAgICAgIGJveC1zaGFkb3c6XG4gICAgICAgICAgICAwIDEwcHggMzBweCAtMjJweCBjb2xvci1taXgoaW4gb2tsYWIsIHZhcmlhYmxlcy4kcHJpbWFyeUNvbG9yIDYwJSwgdHJhbnNwYXJlbnQpLFxuICAgICAgICAgICAgaW5zZXQgMCAwIDAgMXB4IGNvbG9yLW1peChpbiBva2xhYiwgdmFyaWFibGVzLiR0aGVtZUNhcmQgMTAwJSwgdHJhbnNwYXJlbnQpO1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgYm9yZGVyLWNvbG9yIDAuMjVzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYm94LXNoYWRvdyAwLjI1cyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIHRyYW5zZm9ybSAwLjI1cyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmZvY3VzLXdpdGhpbiB7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6IGNvbG9yLW1peChpbiBva2xhYiwgdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciA2NSUsIHZhcmlhYmxlcy4kdGhlbWVCb3JkZXIpO1xuICAgICAgICAgICAgYm94LXNoYWRvdzpcbiAgICAgICAgICAgICAgICAwIDAgMCA0cHggY29sb3ItbWl4KGluIG9rbGFiLCB2YXJpYWJsZXMuJHNlY29uZGFyeUNvbG9yIDE4JSwgdHJhbnNwYXJlbnQpLFxuICAgICAgICAgICAgICAgIDAgMTZweCAzNnB4IC0yMnB4IGNvbG9yLW1peChpbiBva2xhYiwgdmFyaWFibGVzLiRwcmltYXJ5Q29sb3IgNjAlLCB0cmFuc3BhcmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICAmLS1lcnJvciB7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcmlhYmxlcy4kZXJyb3I7XG5cbiAgICAgICAgICAgICY6Zm9jdXMtd2l0aGluIHtcbiAgICAgICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcmlhYmxlcy4kZXJyb3I7XG4gICAgICAgICAgICAgICAgYm94LXNoYWRvdzogMCAwIDAgNHB4IGNvbG9yLW1peChpbiBva2xhYiwgdmFyaWFibGVzLiRlcnJvciAxOCUsIHRyYW5zcGFyZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2ZpZWxkLWljb24ge1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDE4cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBtYXJnaW4tcmlnaHQ6IDhweDtcbiAgICB9XG5cbiAgICAmX19pbnB1dCB7XG4gICAgICAgIGZsZXg6IDE7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgaGVpZ2h0OiBjYWxjKDQ4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgb3V0bGluZTogbm9uZTtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMDJlbTtcblxuICAgICAgICAmOjpwbGFjZWhvbGRlciB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX190b2dnbGUge1xuICAgICAgICBmbGV4OiAwIDAgYXV0bztcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICB3aWR0aDogMzZweDtcbiAgICAgICAgaGVpZ2h0OiAzNnB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICB0cmFuc2l0aW9uOlxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgY29sb3IgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAubWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB7XG4gICAgICAgICAgICBmb250LXNpemU6IGNhbGMoMThweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyLFxuICAgICAgICAmOmZvY3VzLXZpc2libGUge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9faGludCB7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IDZweDtcbiAgICAgICAgbWFyZ2luLXRvcDogY2FsYygycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDExcHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4wMWVtO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcblxuICAgICAgICAubWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB7XG4gICAgICAgICAgICBmb250LXNpemU6IGNhbGMoMTRweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRjb3JyZWN0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fYWN0aW9ucyB7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgICAgei1pbmRleDogMTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiBjYWxjKDZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBtYXJnaW4tdG9wOiBjYWxjKDIwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19jdGEge1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBoZWlnaHQ6IGNhbGMoNTJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBwYWRkaW5nOiAwIDIwcHg7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMDFlbTtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25UZXh0O1xuICAgICAgICBiYWNrZ3JvdW5kOlxuICAgICAgICAgICAgbGluZWFyLWdyYWRpZW50KDEzNWRlZywgdmFyaWFibGVzLiRwcmltYXJ5Q29sb3IgMCUsIGNvbG9yLW1peChpbiBva2xhYiwgdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciAzNSUsIHZhcmlhYmxlcy4kcHJpbWFyeUNvbG9yKSAxMDAlKTtcbiAgICAgICAgYm94LXNoYWRvdzpcbiAgICAgICAgICAgIDAgMTRweCAzMHB4IC0xNnB4IGNvbG9yLW1peChpbiBva2xhYiwgdmFyaWFibGVzLiRwcmltYXJ5Q29sb3IgNzAlLCB0cmFuc3BhcmVudCksXG4gICAgICAgICAgICBpbnNldCAwIDFweCAwIGNvbG9yLW1peChpbiBva2xhYiwgd2hpdGUgMTglLCB0cmFuc3BhcmVudCk7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICB0cmFuc2Zvcm0gMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJveC1zaGFkb3cgMC4yNXMgdmFyaWFibGVzLiRzbW9vdGhCZXppZXIsXG4gICAgICAgICAgICBmaWx0ZXIgMC4yNXMgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgLm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQge1xuICAgICAgICAgICAgZm9udC1zaXplOiBjYWxjKDE4cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3Zlcjpub3QoW2Rpc2FibGVkXSkge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xcHgpO1xuICAgICAgICAgICAgZmlsdGVyOiBicmlnaHRuZXNzKDEuMDUpO1xuICAgICAgICAgICAgYm94LXNoYWRvdzpcbiAgICAgICAgICAgICAgICAwIDE4cHggMzZweCAtMTZweCBjb2xvci1taXgoaW4gb2tsYWIsIHZhcmlhYmxlcy4kcHJpbWFyeUNvbG9yIDcwJSwgdHJhbnNwYXJlbnQpLFxuICAgICAgICAgICAgICAgIGluc2V0IDAgMXB4IDAgY29sb3ItbWl4KGluIG9rbGFiLCB3aGl0ZSAyMiUsIHRyYW5zcGFyZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6YWN0aXZlOm5vdChbZGlzYWJsZWRdKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gICAgICAgICAgICBmaWx0ZXI6IGJyaWdodG5lc3MoMC45Nik7XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgb3BhY2l0eTogMC41O1xuICAgICAgICAgICAgYm94LXNoYWRvdzogbm9uZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2dob3N0IHtcbiAgICAgICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgcGFkZGluZzogMTBweDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxM3B4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0U2Vjb25kYXJ5O1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICAgICAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLCBiYWNrZ3JvdW5kLWNvbG9yIDAuMnMgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuQGtleWZyYW1lcyBtYXN0ZXItcGFzc3dvcmQtc2hlZXQtcHVsc2Uge1xuICAgIDAlIHtcbiAgICAgICAgb3BhY2l0eTogMC43O1xuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTIpO1xuICAgIH1cblxuICAgIDcwJSB7XG4gICAgICAgIG9wYWNpdHk6IDA7XG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMS4yNSk7XG4gICAgfVxuXG4gICAgMTAwJSB7XG4gICAgICAgIG9wYWNpdHk6IDA7XG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMS4yNSk7XG4gICAgfVxufVxuXG5Aa2V5ZnJhbWVzIG1hc3Rlci1wYXNzd29yZC1zaGVldC1hdXJvcmEge1xuICAgIDAlIHtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAwLCAwKSBzY2FsZSgxKTtcbiAgICB9XG5cbiAgICAxMDAlIHtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgyJSwgLTMlLCAwKSBzY2FsZSgxLjA1KTtcbiAgICB9XG59XG5cbjo6bmctZGVlcCB7XG4gICAgLnBhc3N3b3JkLWRlY3J5cHRvciB7XG4gICAgICAgIHdlYmNhbSB7XG4gICAgICAgICAgICB3aWR0aDogdmFyKC0tem5zLWNhcmQtd2lkdGgsIDM3NXB4KSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgaGVpZ2h0OiB2YXIoLS16bnMtY2FyZC1taW4taGVpZ2h0LCA2MDBweCkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmUgIWltcG9ydGFudDtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGVYKC0xKTtcblxuICAgICAgICAgICAgdmlkZW8ge1xuICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgICAgICAgICAgd2lkdGg6IHZhcigtLXpucy1jYXJkLXdpZHRoLCAzNzVweCkgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHZhcigtLXpucy1jYXJkLW1pbi1oZWlnaHQsIDYwMHB4KSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIG9iamVjdC1maXQ6IGNvdmVyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgb2JqZWN0LXBvc2l0aW9uOiBjZW50ZXIgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBibG9jayAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIHRvcDogMCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIGxlZnQ6IDAgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgICAgIGltYWdlLXJlbmRlcmluZzogLXdlYmtpdC1vcHRpbWl6ZS1jb250cmFzdDtcbiAgICAgICAgICAgICAgICBpbWFnZS1yZW5kZXJpbmc6IGNyaXNwLWVkZ2VzO1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWigwKTtcblxuICAgICAgICAgICAgICAgIGltYWdlLXJlbmRlcmluZzogYXV0bztcbiAgICAgICAgICAgICAgICBpbWFnZS1yZW5kZXJpbmc6IHNtb290aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ },

/***/ 25424
/*!*******************************************!*\
  !*** ./src/app/services/error.service.ts ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ErrorService: () => (/* binding */ ErrorService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jsverse/transloco */ 88065);


class ErrorService {
  _translocoService;
  _defaultErrorMessage = "";
  constructor(_translocoService) {
    this._translocoService = _translocoService;
    this._defaultErrorMessage = this._translocoService.translate("errors.generic");
  }
  API_MESSAGE_TO_KEY = {
    "FACE IS NOT CENTRAL, PLEASE USE AN IMAGE WITH A CENTRAL FACE.": "face_not_central"
  };
  resolveErrorKey(error) {
    if (!error || typeof error !== "object") {
      return "unknown_error";
    }
    const err = error;
    const body = err["error"];
    if (body && typeof body === "object") {
      const errorBody = body;
      if (typeof errorBody["code"] === "string" && errorBody["code"].startsWith("ERR_")) {
        return errorBody["code"];
      }
      if (typeof errorBody["message"] === "string" && errorBody["message"].trim()) {
        return this._normalizeErrorKey(errorBody["message"]);
      }
    }
    if (typeof err["message"] === "string" && err["message"].trim()) {
      return this._normalizeErrorKey(err["message"]);
    }
    return "unknown_error";
  }
  isLivenessError(key) {
    const normalized = key.toLowerCase();
    return normalized.includes("liveness") || normalized.includes("err_liveness") || normalized.includes("face_not");
  }
  translateErrorMessage(key, fallbackErrorKey = "") {
    const trimmed = key?.trim() || "";
    const mappedKey = this.API_MESSAGE_TO_KEY[trimmed] ?? trimmed;
    const formattedKey = `errors.${mappedKey}`;
    const translation = this._translocoService.translate(formattedKey);
    return translation !== formattedKey ? translation : fallbackErrorKey ? this._translocoService.translate(fallbackErrorKey) : this._defaultErrorMessage;
  }
  _normalizeErrorKey(message) {
    const withoutStatus = message.replace(/^\d{3}:/, "").trim();
    if (withoutStatus.startsWith("ERR_")) {
      return withoutStatus;
    }
    return withoutStatus.toLowerCase().replace(/\s+/g, "_");
  }
  static ɵfac = function ErrorService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ErrorService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_jsverse_transloco__WEBPACK_IMPORTED_MODULE_1__.TranslocoService));
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
    token: ErrorService,
    factory: ErrorService.ɵfac,
    providedIn: "root"
  });
}

/***/ }

}]);
//# sourceMappingURL=default-src_app_popout-decryptor_popout-decryptor_component_ts.js.map