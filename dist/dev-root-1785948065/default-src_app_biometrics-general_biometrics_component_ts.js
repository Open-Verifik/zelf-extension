"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["default-src_app_biometrics-general_biometrics_component_ts"],{

/***/ 75916
/*!************************************************************!*\
  !*** ./src/app/biometrics-general/biometrics.component.ts ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BiometricsGeneralComponent: () => (/* binding */ BiometricsGeneralComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var _vladmandic_face_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @vladmandic/face-api */ 12841);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash */ 46227);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var ngx_webcam__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ngx-webcam */ 93491);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 33900);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/flex-layout */ 39981);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/dialog */ 57760);
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/progress-bar */ 26354);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/progress-spinner */ 41134);
/* harmony import */ var app_zelf_loader_zelf_loader_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! app/zelf-loader/zelf-loader.component */ 40152);
/* harmony import */ var _sdk_models__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./sdk.models */ 67397);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var app_http_wrapper_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! app/http-wrapper.service */ 84099);
/* harmony import */ var app_services_media_stream_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! app/services/media-stream.service */ 54173);
/* harmony import */ var _wallet_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../wallet.service */ 69556);
/* harmony import */ var _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/flex-layout/flex */ 91447);























const _c0 = ["maskResult"];
const _c1 = ["toSend"];
const _c2 = ["webcam"];
function BiometricsGeneralComponent_div_1_webcam_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "webcam", 13, 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("imageCapture", function BiometricsGeneralComponent_div_1_webcam_2_Template_webcam_imageCapture_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r1.processImage($event));
    })("initError", function BiometricsGeneralComponent_div_1_webcam_2_Template_webcam_initError_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r1.cameraError($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("allowCameraSwitch", false)("captureImageData", true)("height", ctx_r1.camera.dimensions.video.max.height)("imageQuality", 1)("trigger", ctx_r1.takePicture$)("videoOptions", ctx_r1.camera.configuration)("width", ctx_r1.camera.dimensions.video.max.width);
  }
}
function BiometricsGeneralComponent_div_1_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 14)(1, "span", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](3, "div", 16)(4, "span", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](6, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](ctx_r1.errorFace.icon || "face");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](ctx_r1.errorFace.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](ctx_r1.errorFace.subtitle);
  }
}
function BiometricsGeneralComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 7)(1, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](2, BiometricsGeneralComponent_div_1_webcam_2_Template, 2, 7, "webcam", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](3, "canvas", 10, 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](5, BiometricsGeneralComponent_div_1_div_5_Template, 8, 3, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](6, "canvas", 12, 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵstyleProp"]("width", ctx_r1.camera.dimensions.video.width, "px")("height", ctx_r1.camera.dimensions.video.height, "px");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !ctx_r1.response.base64Image);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵstyleProp"]("height", ctx_r1.response.base64Image ? ctx_r1.camera.dimensions.result == null ? null : ctx_r1.camera.dimensions.result.height : ctx_r1.camera.dimensions.video.height, "px")("width", ctx_r1.response.base64Image ? ctx_r1.camera.dimensions.result == null ? null : ctx_r1.camera.dimensions.result.width : ctx_r1.camera.dimensions.video.width, "px");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx_r1.errorFace && !ctx_r1.response.isLoading);
  }
}
function BiometricsGeneralComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](1, "zelf-loader", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("diameter", 120);
  }
}
function BiometricsGeneralComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](1, "img", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](2, "h1", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](4, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](5, "p", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](7, "transloco");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](4, 2, "id_scanning.camera_not_found"));
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](7, 4, "id_scanning.camera_not_found_description"), " ");
  }
}
class BiometricsGeneralComponent {
  _changeDetectorRef;
  _httpWrapperService;
  _mediaStreamService;
  _renderer;
  _translocoService;
  _walletService;
  maskResultCanvasRef;
  ToSendCanvasRef;
  webcamRef;
  displayMode = "auto";
  maxDisplayHeight = 600;
  maxDisplayWidth = 420;
  canNavigate = new _angular_core__WEBPACK_IMPORTED_MODULE_8__.EventEmitter();
  error = new _angular_core__WEBPACK_IMPORTED_MODULE_8__.EventEmitter();
  imageCaptured = new _angular_core__WEBPACK_IMPORTED_MODULE_8__.EventEmitter();
  _resizeUnlisten = () => {};
  _debounceWindowResize;
  _intervals = {};
  _takePicture = new rxjs__WEBPACK_IMPORTED_MODULE_5__.Subject();
  unsubscriber$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__.Subject();
  //ACTIVE DEBUG GRAPHIC MODE
  debugIndex;
  debugText = "debug";
  isActiveDebug;
  aspectRatio = 0.75;
  camera;
  deviceData;
  direction;
  errorFace;
  face;
  lastFace;
  marginX;
  marginY;
  response;
  constructor(_changeDetectorRef, _httpWrapperService, _mediaStreamService, _renderer, _translocoService, _walletService) {
    var _this = this;
    this._changeDetectorRef = _changeDetectorRef;
    this._httpWrapperService = _httpWrapperService;
    this._mediaStreamService = _mediaStreamService;
    this._renderer = _renderer;
    this._translocoService = _translocoService;
    this._walletService = _walletService;
    this.deviceData = this._walletService.getDeviceData();
    this._debounceWindowResize = (0,lodash__WEBPACK_IMPORTED_MODULE_3__.debounce)(/*#__PURE__*/(0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this.canNavigate.emit(false);
      yield _this._setMaxVideoDimensions();
      _this._startNgxVideoInterval();
    }), 300);
  }
  ngOnInit() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this2._startDefaultValues();
      _this2._resizeUnlisten = _this2._renderer.listen("window", "resize", _this2._debounceWindowResize);
      _this2._walletService.faceapi$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.takeUntil)(_this2.unsubscriber$)).subscribe(/*#__PURE__*/function () {
        var _ref2 = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (isLoaded) {
          _this2.canNavigate.emit(false);
          _this2.camera.isLoading = !isLoaded;
          if (!isLoaded) return;
          yield _this2._setMaxVideoDimensions();
          _this2._startNgxVideoInterval();
        });
        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      }());
    })();
  }
  ngOnDestroy() {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this3._mediaStreamService.stopAllStreams();
      _this3.canNavigate.emit(true);
      _this3._resizeUnlisten();
      _this3._killIntervals();
      _this3._debounceWindowResize.cancel();
      _this3.unsubscriber$.next();
      _this3.unsubscriber$.complete();
    })();
  }
  get takePicture$() {
    return this._takePicture.asObservable();
  }
  _calculateDisplayDimensions() {
    const isLandscape = window.innerHeight < window.innerWidth;
    if (this.displayMode === "portrait") {
      const portraitAspectRatio = this.maxDisplayWidth / this.maxDisplayHeight;
      const maxAvailableHeight = Math.ceil(window.innerHeight - 96);
      const maxAvailableWidth = Math.ceil(window.innerWidth * 0.92);
      const maxHeight = Math.min(maxAvailableHeight, this.maxDisplayHeight);
      const maxWidth = Math.min(maxAvailableWidth, this.maxDisplayWidth);
      const widthFromHeight = Math.round(maxHeight * portraitAspectRatio);
      const width = Math.min(widthFromHeight, maxWidth);
      const height = Math.round(width / portraitAspectRatio);
      return {
        isLandscape: false,
        height,
        width
      };
    }
    const maxAvailableHeight = Math.ceil(window.innerHeight * 0.7);
    const maxAvailableWidth = Math.ceil(window.innerWidth * 0.9);
    const targetAspectRatio = 16 / 9;
    if (isLandscape) {
      const maxHeight = Math.min(maxAvailableHeight, 1920);
      const calculatedWidth = Math.round(maxHeight * targetAspectRatio);
      const maxWidth = Math.min(maxAvailableWidth, 1920);
      return {
        isLandscape,
        height: maxHeight,
        width: Math.min(calculatedWidth, maxWidth)
      };
    } else {
      const maxHeight = Math.min(maxAvailableHeight, 1920);
      const calculatedWidth = Math.round(maxHeight * targetAspectRatio);
      const maxWidth = Math.min(maxAvailableWidth, 1080);
      return {
        isLandscape,
        height: maxHeight,
        width: Math.min(calculatedWidth, maxWidth)
      };
    }
  }
  _checkVideoStreamReady = () => {
    const videoNgx = this.webcamRef?.nativeVideoElement;
    if (!videoNgx) return;
    clearInterval(this._intervals.checkNgxVideo);
    this._intervals.checkNgxVideo = null;
    videoNgx.addEventListener("loadeddata", () => {
      this._startFaceDetectionInterval();
      this.canNavigate.emit(true);
      this._setVideoDimensions(videoNgx);
      this._drawOvalCenterAndMask();
    }, {
      once: true
    });
    this._setVideoDimensions(videoNgx);
    this._drawOvalCenterAndMask();
  };
  _detectFace = () => {
    if (this.response.base64Image) {
      this._intervals.detectFace = clearInterval(this._intervals.detectFace);
      return;
    }
    this._takePicture.next();
  };
  _drawOvalCenterAndMask() {
    const videoDim = this.camera.dimensions.video;
    const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;
    maskResultCanvas.height = videoDim.height;
    maskResultCanvas.width = videoDim.width;
    const ctx = maskResultCanvas.getContext("2d");
    ctx.clearRect(0, 0, videoDim.width || 0, videoDim.height || 0);
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.fillRect(0, 0, videoDim.width || 0, videoDim.height || 0);
    ctx.globalCompositeOperation = "destination-out";
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
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.beginPath();
    ctx.ellipse(center?.x, center?.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
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
    ctx.lineWidth = 5;
    ctx.strokeStyle = isOk ? "green" : "red";
    ctx.stroke();
    ctx.closePath();
    if (!isOk) {
      if (this.errorFace?.canvas?.includes("↑")) {
        const startX = center.x - 20;
        const startY = center.y - radius.y + 10;
        ctx.drawImage(this.direction.up, startX, startY, 40, 40);
      }
      if (this.errorFace?.canvas?.includes("↓")) {
        const startX = center.x - 20;
        const startY = center.y + radius.y - 50;
        ctx.drawImage(this.direction.down, startX, startY, 40, 40);
      }
      if (this.errorFace?.canvas?.includes("→")) {
        const startX = center.x + radius.x - 50;
        const startY = center.y - 20;
        ctx.drawImage(this.direction.right, startX, startY, 40, 40);
      }
      if (this.errorFace?.canvas?.includes("←")) {
        const startX = center.x - radius.x + 10;
        const startY = center.y - 20;
        ctx.drawImage(this.direction.left, startX, startY, 40, 40);
      }
    }
    this._changeDetectorRef.markForCheck();
  }
  _emitBiometricCapture() {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this4.response.isLoading) return;
      _this4._loading({
        result: true
      });
      const base64Image = _this4.response.base64Image?.replace(/^data:.*;base64,/, "");
      const encryptedImage = yield _this4._httpWrapperService.encryptMessage(base64Image);
      _this4.imageCaptured.emit(encryptedImage);
    })();
  }
  _getCenterAndRadius = (height, width) => {
    const data = {
      center: {
        x: width / 2,
        y: height / 2
      },
      radius: {
        x: 0,
        y: 0
      },
      margin: {
        y: height * 0.05,
        x: 0
      }
    };
    data.margin.x = data.margin.y * 0.8;
    data.radius.y = height * 0.42;
    data.radius.x = data.radius.y * this.aspectRatio;
    if (data.radius.x * 2 >= width) {
      data.radius.x = width * 0.48;
      data.radius.y = data.radius.x / this.aspectRatio;
    }
    return data;
  };
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
      subtitle: this._translocoService.translate("liveness.center_your_face_subtitle"),
      title: this._translocoService.translate("liveness.center_your_face")
    };
  }
  _isFaceClose(landmarks) {
    const realDim = this.camera.dimensions.real || {
      center: {
        x: 0,
        y: 0
      },
      margin: {
        x: 0,
        y: 0
      },
      height: 0,
      width: 0,
      offsetX: 0
    };
    const totalFaceArea = landmarks.imageHeight * landmarks.imageWidth;
    const totalImageArea = Math.floor(realDim.height * (realDim.width - realDim.offsetX));
    const faceProportion = totalFaceArea / totalImageArea;
    if (faceProportion < this.face.threshold || landmarks.imageHeight < this.face.minPixels || landmarks.imageWidth < this.face.minPixels) {
      this.errorFace = {
        icon: "zoom_in",
        title: this._translocoService.translate("liveness.get_closer"),
        subtitle: this._translocoService.translate("liveness.get_closer_subtitle")
      };
    }
  }
  _killIntervals() {
    clearInterval(this._intervals.checkNgxVideo);
    clearInterval(this._intervals.detectFace);
    this._intervals = {};
  }
  _loading(paramsLoading) {
    const {
      isLoading = true,
      start,
      result
    } = paramsLoading;
    const key = start && "camera" || result && "response";
    if (!key || !this[key]) return;
    this[key].isLoading = isLoading;
  }
  _startFaceDetectionInterval = () => {
    if (this._intervals.detectFace) {
      clearInterval(this._intervals.detectFace);
      this._intervals.detectFace = null;
    }
    this._intervals.detectFace = setInterval(this._detectFace, this.deviceData.time);
  };
  _startNgxVideoInterval = () => {
    if (this._intervals.checkNgxVideo) {
      clearInterval(this._intervals.checkNgxVideo);
      this._intervals.checkNgxVideo = null;
    }
    this._intervals.checkNgxVideo = setInterval(this._checkVideoStreamReady, this.deviceData.time);
  };
  _setDefaultCamera = () => {
    const displayDimensions = this._calculateDisplayDimensions();
    this.camera = {
      hasPermissions: true,
      isLoading: true,
      isLowQuality: false,
      configuration: {
        height: {
          ideal: displayDimensions.isLandscape ? 1080 : 1920
        },
        width: {
          ideal: displayDimensions.isLandscape ? 1920 : 1080
        },
        facingMode: _sdk_models__WEBPACK_IMPORTED_MODULE_15__.FacingMode.USER,
        frameRate: {
          ideal: 30,
          max: 30
        }
      },
      dimensions: {
        video: {
          max: displayDimensions
        }
      }
    };
    this._changeDetectorRef.markForCheck();
  };
  _setDefaultDirections = () => {
    this.direction = {
      down: new Image(),
      left: new Image(),
      right: new Image(),
      up: new Image()
    };
    this.direction.down.crossOrigin = "anonymous";
    this.direction.left.crossOrigin = "anonymous";
    this.direction.right.crossOrigin = "anonymous";
    this.direction.up.crossOrigin = "anonymous";
    this.direction.down.src = "https://cdn.verifik.co/web-sdk/images/down.png";
    this.direction.left.src = "https://cdn.verifik.co/web-sdk/images/left.png";
    this.direction.right.src = "https://cdn.verifik.co/web-sdk/images/right.png";
    this.direction.up.src = "https://cdn.verifik.co/web-sdk/images/up.png";
  };
  _setDefaultFace = () => {
    this.face = {
      minHeight: 240,
      minPixels: 240,
      successPosition: 0,
      threshold: 0.25
    };
  };
  _setDefaultResponse = () => {
    this.response = {
      isLoading: false,
      isFailed: false
    };
  };
  _setImageOnCanvas = (canvas, inputImg, originalDim, resizeDim) => {
    canvas.width = resizeDim.width;
    canvas.height = resizeDim.height;
    canvas.style.marginLeft = `${resizeDim.offsetX || 0}px`;
    canvas.style.marginTop = `${resizeDim.offsetY || 0}px`;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, originalDim.width, originalDim.height);
    ctx.drawImage(inputImg, originalDim.offsetX, originalDim.offsetY, originalDim.width, originalDim.height, 0, 0, resizeDim.width, resizeDim.height);
  };
  _setMaxVideoDimensions() {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const displayDimensions = _this5._calculateDisplayDimensions();
      _this5.camera.isLoading = true;
      _this5._changeDetectorRef.markForCheck();
      return yield new Promise(resolve => {
        setTimeout(() => {
          _this5.camera.dimensions.video = {
            max: displayDimensions
          };
          _this5.camera.configuration = {
            height: {
              ideal: displayDimensions.isLandscape ? 1080 : 1920
            },
            width: {
              ideal: displayDimensions.isLandscape ? 1920 : 1080
            },
            facingMode: _sdk_models__WEBPACK_IMPORTED_MODULE_15__.FacingMode.USER,
            frameRate: {
              ideal: 30,
              max: 30
            }
          };
          _this5.camera.dimensions.result = undefined;
          _this5.camera.isLoading = false;
          _this5.webcamRef?.videoResize();
          _this5._changeDetectorRef.markForCheck();
          resolve();
        });
      });
    })();
  }
  _startDefaultValues() {
    var _this6 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this6._setDefaultResponse();
      _this6._setDefaultCamera();
      _this6._setDefaultDirections();
      _this6._setDefaultFace();
      yield _this6._setMaxVideoDimensions();
    })();
  }
  _setResultDimensions(key, height, width) {
    const {
      center,
      radius
    } = this.face[key] = this._getCenterAndRadius(height, width);
    const dimensions = this.camera.dimensions[key];
    if (!dimensions) return;
    dimensions.height = height;
    dimensions.offsetY = 0;
    dimensions.width = Math.min(2.8 * radius.x, width);
    dimensions.offsetX = center.x - dimensions.width / 2;
  }
  _setVideoDimensions(videoElement) {
    const actualWidth = videoElement.clientWidth;
    const actualHeight = videoElement.clientHeight;
    this.camera.dimensions.video.height = actualHeight;
    this.camera.dimensions.video.width = actualWidth;
    this.camera.dimensions.result = {
      height: 0,
      width: 0,
      offsetX: 0,
      offsetY: 0
    };
    this._setResultDimensions("result", actualHeight, actualWidth);
    this.face.video = this._getCenterAndRadius(actualHeight, actualWidth);
    const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;
    maskResultCanvas.style.marginLeft = `0px`;
    maskResultCanvas.style.marginTop = `0px`;
    this._changeDetectorRef.markForCheck();
  }
  _takePictureLiveness(img) {
    const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;
    const toSendCanvas = this.ToSendCanvasRef?.nativeElement;
    this._setImageOnCanvas(maskResultCanvas, img, this.camera.dimensions.real, this.camera.dimensions.result);
    this._setImageOnCanvas(toSendCanvas, img, this.camera.dimensions.real, this.camera.dimensions.real);
    this.response.base64Image = toSendCanvas.toDataURL("image/jpeg");
    this._emitBiometricCapture();
  }
  cameraError(error) {
    this.canNavigate.emit(true);
    this.error.emit(error);
    if (!error.mediaStreamError || error.mediaStreamError.name !== "NotAllowedError") return;
    this._loading({
      isLoading: false,
      start: true
    });
    this.camera.hasPermissions = false;
  }
  processImage(webcamImage) {
    var _this7 = this;
    if (!this._intervals.detectFace || this.response.base64Image) return;
    const img = new Image();
    img.src = webcamImage.imageAsDataUrl;
    img.onload = /*#__PURE__*/(0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (img.height < _this7.face.minHeight) {
        _this7.camera.isLowQuality = true;
        _this7.canNavigate.emit(true);
        _this7.error.emit({
          error: "low_quality"
        });
        return;
      }
      try {
        _this7.camera.dimensions.real = {
          height: 0,
          width: 0,
          offsetX: 0,
          offsetY: 0
        };
        _this7._setResultDimensions("real", img.height, img.width);
        _this7.face.real = _this7._getCenterAndRadius(img.height, img.width);
        const detection = yield _vladmandic_face_api__WEBPACK_IMPORTED_MODULE_2__.detectAllFaces(img, new _vladmandic_face_api__WEBPACK_IMPORTED_MODULE_2__.SsdMobilenetv1Options({
          minConfidence: 0.2
        })).withFaceLandmarks();
        const context = _this7.maskResultCanvasRef?.nativeElement.getContext("2d", {
          willReadFrequently: true
        });
        if (detection.length > 0) {
          _this7.lastFace = detection[0];
          _this7.errorFace = null;
          _this7._drawOvalCenterAndMask();
          _this7._isFaceCentered(_this7.lastFace.landmarks.getNose()[3]);
          _this7._isFaceClose(_this7.lastFace.landmarks);
          _this7._drawStatusOval(context, !_this7.errorFace);
          !_this7.errorFace ? ++_this7.face.successPosition : _this7.face.successPosition = 0;
          if (!_this7.errorFace && _this7.face.successPosition > 2) {
            _this7.face.successPosition = 0;
            _this7._takePictureLiveness(img);
            return;
          }
        }
        _this7._changeDetectorRef.markForCheck();
      } catch (error) {
        alert(error.message);
      }
    });
  }
  static ɵfac = function BiometricsGeneralComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || BiometricsGeneralComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_16__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](app_http_wrapper_service__WEBPACK_IMPORTED_MODULE_18__.HttpWrapperService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](app_services_media_stream_service__WEBPACK_IMPORTED_MODULE_19__.MediaStreamService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_8__.Renderer2), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_jsverse_transloco__WEBPACK_IMPORTED_MODULE_1__.TranslocoService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_wallet_service__WEBPACK_IMPORTED_MODULE_20__.WalletService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineComponent"]({
    type: BiometricsGeneralComponent,
    selectors: [["biometrics-general"]],
    viewQuery: function BiometricsGeneralComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵviewQuery"](_c0, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵviewQuery"](_c1, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵviewQuery"](_c2, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵloadQuery"]()) && (ctx.maskResultCanvasRef = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵloadQuery"]()) && (ctx.ToSendCanvasRef = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵloadQuery"]()) && (ctx.webcamRef = _t.first);
      }
    },
    inputs: {
      displayMode: "displayMode",
      maxDisplayHeight: "maxDisplayHeight",
      maxDisplayWidth: "maxDisplayWidth"
    },
    outputs: {
      canNavigate: "canNavigate",
      error: "error",
      imageCaptured: "imageCaptured"
    },
    decls: 4,
    vars: 5,
    consts: [["maskResult", ""], ["toSend", ""], ["webcam", ""], ["fxLayout", "column", "fxLayoutAlign", "center center", 1, "biometric-shell", "min-h-[60vh]", "justify-center", "p-4", "sm:p-1", "xs:p-1", "w-full"], ["class", "justify-center w-full", "fxLayout", "column", "fxLayoutAlign", "center center", 4, "ngIf"], ["class", "loader", "fxLayout", "column", "fxLayoutAlign", "center center", 4, "ngIf"], ["fxLayout", "column", "fxLayoutAlign", "center center", "class", "id-scanning-error-div", 4, "ngIf"], ["fxLayout", "column", "fxLayoutAlign", "center center", 1, "justify-center", "w-full"], [1, "relative"], ["mirrorImage", "always", 3, "allowCameraSwitch", "captureImageData", "height", "imageQuality", "trigger", "videoOptions", "width", "imageCapture", "initError", 4, "ngIf"], [1, "absolute", "top-0", "left-0"], ["class", "biometric__status", "role", "status", "aria-live", "polite", 4, "ngIf"], ["hidden", "true"], ["mirrorImage", "always", 3, "imageCapture", "initError", "allowCameraSwitch", "captureImageData", "height", "imageQuality", "trigger", "videoOptions", "width"], ["role", "status", "aria-live", "polite", 1, "biometric__status"], [1, "material-symbols-outlined", "biometric__status-icon"], [1, "biometric__status-content"], [1, "biometric__status-title"], [1, "biometric__status-subtitle"], ["fxLayout", "column", "fxLayoutAlign", "center center", 1, "loader"], [3, "diameter"], ["fxLayout", "column", "fxLayoutAlign", "center center", 1, "id-scanning-error-div"], ["src", "https://cdn.verifik.co/demo/nocameraenabled.svg", "alt", "", 1, "id-scanning-no-camera-enabled-img"], [1, "mt-4"]],
    template: function BiometricsGeneralComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](1, BiometricsGeneralComponent_div_1_Template, 8, 10, "div", 4)(2, BiometricsGeneralComponent_div_2_Template, 2, 1, "div", 5)(3, BiometricsGeneralComponent_div_3_Template, 8, 6, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵclassProp"]("biometric-shell--portrait", ctx.displayMode === "portrait");
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !ctx.camera.isLoading && ctx.camera.hasPermissions && !ctx.camera.isLowQuality);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx.response.base64Image || ctx.camera.isLoading);
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !ctx.camera.isLoading && ctx.camera.isLowQuality);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgIf, _angular_flex_layout__WEBPACK_IMPORTED_MODULE_9__.FlexLayoutModule, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_21__.DefaultLayoutDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_21__.DefaultLayoutAlignDirective, _angular_material_button__WEBPACK_IMPORTED_MODULE_10__.MatButtonModule, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_11__.MatDialogModule, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_12__.MatProgressBarModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_13__.MatProgressSpinnerModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_1__.TranslocoModule, ngx_webcam__WEBPACK_IMPORTED_MODULE_4__.WebcamModule, ngx_webcam__WEBPACK_IMPORTED_MODULE_4__.WebcamComponent, app_zelf_loader_zelf_loader_component__WEBPACK_IMPORTED_MODULE_14__.ZelfLoaderComponent, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_1__.TranslocoPipe],
    styles: [".biometric__status[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(14px * var(--zns-space-scale, 1));\n  left: 50%;\n  transform: translateX(-50%);\n  z-index: 8;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 8px 14px 8px 8px;\n  border-radius: 18px;\n  background: rgba(24, 24, 24, 0.78);\n  backdrop-filter: blur(14px) saturate(140%);\n  color: #fff;\n  box-shadow: 0 18px 38px -22px rgba(0, 0, 0, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.08);\n  min-width: calc(220px * var(--zns-space-scale, 1));\n  max-width: min(340px * var(--zns-space-scale, 1), 100% - 24px);\n  width: max-content;\n  animation: _ngcontent-%COMP%_biometric-status-pop 0.25s cubic-bezier(0.25, 0.4, 0.7, 1) both;\n  pointer-events: none;\n}\n.biometric__status-icon[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  width: 26px;\n  height: 26px;\n  border-radius: 50%;\n  background: color-mix(in oklab, var(--zns-theme-secondary, #ff5721) 80%, white);\n  color: #fff;\n  font-size: calc(15px * var(--zns-font-scale, 1));\n  font-variation-settings: \"FILL\" 1, \"wght\" 500, \"GRAD\" 0, \"opsz\" 24;\n}\n.biometric__status-content[_ngcontent-%COMP%] {\n  min-width: 0;\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  text-align: left;\n  line-height: 1.2;\n}\n.biometric__status-title[_ngcontent-%COMP%] {\n  font-size: calc(13px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  letter-spacing: 0.01em;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.biometric__status-subtitle[_ngcontent-%COMP%] {\n  font-size: calc(11px * var(--zns-font-scale, 1));\n  font-weight: 400;\n  opacity: 0.8;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n@keyframes _ngcontent-%COMP%_biometric-status-pop {\n  0% {\n    opacity: 0;\n    transform: translate(-50%, -8px);\n  }\n  100% {\n    opacity: 1;\n    transform: translate(-50%, 0);\n  }\n}\n.id-scanning-error-div[_ngcontent-%COMP%] {\n  margin-top: calc(20px * var(--zns-space-scale, 1));\n  width: min(var(--zns-card-width, 600px), 100%);\n  background: white;\n  min-height: var(--zns-card-min-height, 600px);\n  padding: calc(16px * var(--zns-space-scale, 1));\n  box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.05);\n}\n.id-scanning-error-div[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  color: #0036e7;\n  font-size: calc(24px * var(--zns-font-scale, 1));\n  font-weight: 800;\n  text-align: center;\n}\n.id-scanning-error-div[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: rgba(1, 35, 109, 0.6509803922);\n  font-size: calc(16px * var(--zns-font-scale, 1));\n  font-weight: 300;\n  text-align: center;\n}\n\nvideo[_ngcontent-%COMP%] {\n  object-fit: cover;\n}\n\n.p-4[_ngcontent-%COMP%] {\n  padding: calc(1rem * var(--zns-space-scale, 1));\n}\n\n.sm\\:p-1[_ngcontent-%COMP%] {\n  padding: calc(0.25rem * var(--zns-space-scale, 1));\n}\n\n.xs\\:p-1[_ngcontent-%COMP%] {\n  padding: calc(0.25rem * var(--zns-space-scale, 1));\n}\n\n.w-full[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.text-center[_ngcontent-%COMP%] {\n  text-align: center;\n}\n\n.text-3xl[_ngcontent-%COMP%] {\n  font-size: calc(1.875rem * var(--zns-font-scale, 1));\n}\n\n.font-bold[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n\n.text-gray-600[_ngcontent-%COMP%] {\n  --tw-text-opacity: 1;\n  color: rgba(156, 163, 175, var(--tw-text-opacity));\n}\n\n.relative[_ngcontent-%COMP%] {\n  position: relative;\n}\n\n.top-0[_ngcontent-%COMP%] {\n  top: 0;\n}\n\n.left-0[_ngcontent-%COMP%] {\n  left: 0;\n}\n\n.absolute[_ngcontent-%COMP%] {\n  position: absolute;\n}\n\n.mt-4[_ngcontent-%COMP%] {\n  margin-top: calc(1rem * var(--zns-space-scale, 1));\n}\n\n.biometric-shell.biometric-shell--portrait[_ngcontent-%COMP%] {\n  min-height: 100%;\n  padding: 0;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYmlvbWV0cmljcy1nZW5lcmFsL2Jpb21ldHJpY3MuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxrQkFBQTtFQUNBLDJDQUFBO0VBQ0EsU0FBQTtFQUNBLDJCQUFBO0VBQ0EsVUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFNBQUE7RUFDQSx5QkFBQTtFQUNBLG1CQUFBO0VBQ0Esa0NBQUE7RUFDQSwwQ0FBQTtFQUNBLFdBQUE7RUFDQSw0RkFDSTtFQUVKLGtEQUFBO0VBQ0EsOERBQUE7RUFDQSxrQkFBQTtFQUNBLDBFQUFBO0VBQ0Esb0JBQUE7QUFISjtBQUtJO0VBQ0ksY0FBQTtFQUNBLG9CQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSwrRUFBQTtFQUNBLFdBQUE7RUFDQSxnREFBQTtFQUNBLGtFQUNJO0FBSlo7QUFVSTtFQUNJLFlBQUE7RUFDQSxPQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsUUFBQTtFQUNBLGdCQUFBO0VBQ0EsZ0JBQUE7QUFSUjtBQVdJO0VBQ0ksZ0RBQUE7RUFDQSxnQkFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSxnQkFBQTtFQUNBLHVCQUFBO0FBVFI7QUFZSTtFQUNJLGdEQUFBO0VBQ0EsZ0JBQUE7RUFDQSxZQUFBO0VBQ0Esb0JBQUE7RUFDQSxxQkFBQTtFQUNBLDRCQUFBO0VBQ0EsZ0JBQUE7RUFDQSx1QkFBQTtBQVZSOztBQWNBO0VBQ0k7SUFDSSxVQUFBO0lBQ0EsZ0NBQUE7RUFYTjtFQWNFO0lBQ0ksVUFBQTtJQUNBLDZCQUFBO0VBWk47QUFDRjtBQWVBO0VBQ0ksa0RBQUE7RUFDQSw4Q0FBQTtFQUNBLGlCQUFBO0VBQ0EsNkNBQUE7RUFDQSwrQ0FBQTtFQUNBLCtDQUFBO0FBYko7QUFlSTtFQUNJLGNBQUE7RUFDQSxnREFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7QUFiUjtBQWdCSTtFQUNJLHFDQUFBO0VBQ0EsZ0RBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0FBZFI7O0FBa0JBO0VBQ0ksaUJBQUE7QUFmSjs7QUFrQkE7RUFDSSwrQ0FBQTtBQWZKOztBQWtCQTtFQUNJLGtEQUFBO0FBZko7O0FBa0JBO0VBQ0ksa0RBQUE7QUFmSjs7QUFrQkE7RUFDSSxXQUFBO0FBZko7O0FBa0JBO0VBQ0ksa0JBQUE7QUFmSjs7QUFrQkE7RUFDSSxvREFBQTtBQWZKOztBQWtCQTtFQUNJLGdCQUFBO0FBZko7O0FBa0JBO0VBQ0ksb0JBQUE7RUFDQSxrREFBQTtBQWZKOztBQWtCQTtFQUNJLGtCQUFBO0FBZko7O0FBa0JBO0VBQ0ksTUFBQTtBQWZKOztBQWtCQTtFQUNJLE9BQUE7QUFmSjs7QUFrQkE7RUFDSSxrQkFBQTtBQWZKOztBQWtCQTtFQUNJLGtEQUFBO0FBZko7O0FBa0JBO0VBQ0ksZ0JBQUE7RUFDQSxVQUFBO0FBZkoiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwiLi4vLi4vc3R5bGVzL3ZhcmlhYmxlc1wiO1xuXG4uYmlvbWV0cmljX19zdGF0dXMge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IGNhbGMoMTRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIGxlZnQ6IDUwJTtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7XG4gICAgei1pbmRleDogODtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiAxMHB4O1xuICAgIHBhZGRpbmc6IDhweCAxNHB4IDhweCA4cHg7XG4gICAgYm9yZGVyLXJhZGl1czogMThweDtcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI0LCAyNCwgMjQsIDAuNzgpO1xuICAgIGJhY2tkcm9wLWZpbHRlcjogYmx1cigxNHB4KSBzYXR1cmF0ZSgxNDAlKTtcbiAgICBjb2xvcjogI2ZmZjtcbiAgICBib3gtc2hhZG93OlxuICAgICAgICAwIDE4cHggMzhweCAtMjJweCByZ2JhKDAsIDAsIDAsIDAuNTUpLFxuICAgICAgICBpbnNldCAwIDAgMCAxcHggcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA4KTtcbiAgICBtaW4td2lkdGg6IGNhbGMoMjIwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICBtYXgtd2lkdGg6IG1pbihjYWxjKDM0MHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSksIGNhbGMoMTAwJSAtIDI0cHgpKTtcbiAgICB3aWR0aDogbWF4LWNvbnRlbnQ7XG4gICAgYW5pbWF0aW9uOiBiaW9tZXRyaWMtc3RhdHVzLXBvcCAwLjI1cyBjdWJpYy1iZXppZXIoMC4yNSwgMC40LCAwLjcsIDEpIGJvdGg7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG5cbiAgICAmLWljb24ge1xuICAgICAgICBmbGV4OiAwIDAgYXV0bztcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICB3aWR0aDogMjZweDtcbiAgICAgICAgaGVpZ2h0OiAyNnB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICAgIGJhY2tncm91bmQ6IGNvbG9yLW1peChpbiBva2xhYiwgdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvciA4MCUsIHdoaXRlKTtcbiAgICAgICAgY29sb3I6ICNmZmY7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxNXB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgZm9udC12YXJpYXRpb24tc2V0dGluZ3M6XG4gICAgICAgICAgICBcIkZJTExcIiAxLFxuICAgICAgICAgICAgXCJ3Z2h0XCIgNTAwLFxuICAgICAgICAgICAgXCJHUkFEXCIgMCxcbiAgICAgICAgICAgIFwib3BzelwiIDI0O1xuICAgIH1cblxuICAgICYtY29udGVudCB7XG4gICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgZmxleDogMTtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiAycHg7XG4gICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjI7XG4gICAgfVxuXG4gICAgJi10aXRsZSB7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxM3B4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMDFlbTtcbiAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgfVxuXG4gICAgJi1zdWJ0aXRsZSB7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygxMXB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgICAgICAgb3BhY2l0eTogMC44O1xuICAgICAgICBkaXNwbGF5OiAtd2Via2l0LWJveDtcbiAgICAgICAgLXdlYmtpdC1saW5lLWNsYW1wOiAyO1xuICAgICAgICAtd2Via2l0LWJveC1vcmllbnQ6IHZlcnRpY2FsO1xuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgICB9XG59XG5cbkBrZXlmcmFtZXMgYmlvbWV0cmljLXN0YXR1cy1wb3Age1xuICAgIDAlIHtcbiAgICAgICAgb3BhY2l0eTogMDtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLThweCk7XG4gICAgfVxuXG4gICAgMTAwJSB7XG4gICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIDApO1xuICAgIH1cbn1cblxuLmlkLXNjYW5uaW5nLWVycm9yLWRpdiB7XG4gICAgbWFyZ2luLXRvcDogY2FsYygyMHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgd2lkdGg6IG1pbih2YXIoLS16bnMtY2FyZC13aWR0aCwgNjAwcHgpLCAxMDAlKTtcbiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICBtaW4taGVpZ2h0OiB2YXIoLS16bnMtY2FyZC1taW4taGVpZ2h0LCA2MDBweCk7XG4gICAgcGFkZGluZzogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgYm94LXNoYWRvdzogM3B4IDNweCAzcHggM3B4IHJnYigwIDAgMCAvIDUlKTtcblxuICAgIGgxIHtcbiAgICAgICAgY29sb3I6ICMwMDM2ZTc7XG4gICAgICAgIGZvbnQtc2l6ZTogY2FsYygyNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDgwMDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuICAgIHAge1xuICAgICAgICBjb2xvcjogIzAxMjM2ZGE2O1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTZweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiAzMDA7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG59XG5cbnZpZGVvIHtcbiAgICBvYmplY3QtZml0OiBjb3Zlcjtcbn1cblxuLnAtNCB7XG4gICAgcGFkZGluZzogY2FsYygxcmVtICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG59XG5cbi5zbVxcOnAtMSB7XG4gICAgcGFkZGluZzogY2FsYygwLjI1cmVtICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG59XG5cbi54c1xcOnAtMSB7XG4gICAgcGFkZGluZzogY2FsYygwLjI1cmVtICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG59XG5cbi53LWZ1bGwge1xuICAgIHdpZHRoOiAxMDAlO1xufVxuXG4udGV4dC1jZW50ZXIge1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxuLnRleHQtM3hsIHtcbiAgICBmb250LXNpemU6IGNhbGMoMS44NzVyZW0gKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xufVxuXG4uZm9udC1ib2xkIHtcbiAgICBmb250LXdlaWdodDogNzAwO1xufVxuXG4udGV4dC1ncmF5LTYwMCB7XG4gICAgLS10dy10ZXh0LW9wYWNpdHk6IDE7XG4gICAgY29sb3I6IHJnYmEoMTU2LCAxNjMsIDE3NSwgdmFyKC0tdHctdGV4dC1vcGFjaXR5KSk7XG59XG5cbi5yZWxhdGl2ZSB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuXG4udG9wLTAge1xuICAgIHRvcDogMDtcbn1cblxuLmxlZnQtMCB7XG4gICAgbGVmdDogMDtcbn1cblxuLmFic29sdXRlIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG59XG5cbi5tdC00IHtcbiAgICBtYXJnaW4tdG9wOiBjYWxjKDFyZW0gKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbn1cblxuLmJpb21ldHJpYy1zaGVsbC5iaW9tZXRyaWMtc2hlbGwtLXBvcnRyYWl0IHtcbiAgICBtaW4taGVpZ2h0OiAxMDAlO1xuICAgIHBhZGRpbmc6IDA7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ },

/***/ 67397
/*!**************************************************!*\
  !*** ./src/app/biometrics-general/sdk.models.ts ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FacingMode: () => (/* binding */ FacingMode)
/* harmony export */ });
var FacingMode;
(function (FacingMode) {
  FacingMode["ENVIRONMENT"] = "environment";
  FacingMode["USER"] = "user";
  FacingMode["true"] = "environment";
  FacingMode["false"] = "user";
})(FacingMode || (FacingMode = {}));

/***/ },

/***/ 54173
/*!**************************************************!*\
  !*** ./src/app/services/media-stream.service.ts ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MediaStreamService: () => (/* binding */ MediaStreamService)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 34205);


class MediaStreamService {
  _activeStreams = [];
  startStream(constraints) {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const stream = yield navigator.mediaDevices.getUserMedia(constraints);
      _this._activeStreams.push(stream);
      return stream;
    })();
  }
  addStream(stream) {
    this._activeStreams.push(stream);
  }
  stopStream(stream) {
    stream.getTracks().forEach(track => track.stop());
    this._activeStreams = this._activeStreams.filter(activeStream => activeStream !== stream);
  }
  stopAllStreams() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this2._activeStreams.forEach(stream => {
        stream?.getTracks().forEach(track => track.stop());
      });
      _this2._activeStreams = [];
      document.querySelectorAll("video").forEach(video => {
        if (!(video.srcObject instanceof MediaStream)) return;
        const stream = video.srcObject;
        if (!stream) return;
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      });
      document.querySelectorAll("canvas").forEach(canvas => {
        const context = canvas.getContext("2d");
        if (!context) return;
        const stream = canvas.captureStream?.();
        if (!stream) return;
        stream.getTracks().forEach(track => track.stop());
      });
      const stream = yield navigator.mediaDevices.getUserMedia({
        video: true
      });
      stream?.getTracks().forEach(track => track.stop());
    })();
  }
  static ɵfac = function MediaStreamService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || MediaStreamService)();
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: MediaStreamService,
    factory: MediaStreamService.ɵfac,
    providedIn: "root"
  });
}

/***/ }

}]);
//# sourceMappingURL=default-src_app_biometrics-general_biometrics_component_ts.js.map