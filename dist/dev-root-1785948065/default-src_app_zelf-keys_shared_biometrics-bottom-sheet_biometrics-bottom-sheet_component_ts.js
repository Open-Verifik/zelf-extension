"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["default-src_app_zelf-keys_shared_biometrics-bottom-sheet_biometrics-bottom-sheet_component_ts"],{

/***/ 70415
/*!***********************************************************************************************!*\
  !*** ./src/app/zelf-keys/shared/biometrics-bottom-sheet/biometrics-bottom-sheet.component.ts ***!
  \***********************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BiometricsBottomSheetComponent: () => (/* binding */ BiometricsBottomSheetComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/bottom-sheet */ 15244);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var _data_biometrics_data_biometrics_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../data-biometrics/data-biometrics.component */ 7875);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var app_services_data_passing_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! app/services/data-passing.service */ 59284);
/* harmony import */ var app_vault_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! app/vault.service */ 19519);
/* harmony import */ var app_wallet_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! app/wallet.service */ 69556);
/* harmony import */ var app_services_zelf_keys_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! app/services/zelf-keys.service */ 52368);













function BiometricsBottomSheetComponent_div_0_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 13)(1, "span", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "span", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r1.getItemType());
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r1.getItemInfo());
  }
}
function BiometricsBottomSheetComponent_div_0_div_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 16)(1, "h3", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "p", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "button", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function BiometricsBottomSheetComponent_div_0_div_11_Template_button_click_5_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r1.onClose());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r1.errorMessage);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", t_r4("zelf_keys.biometrics_bottom_sheet.error.try_again_later"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", t_r4("zelf_keys.biometrics_bottom_sheet.error.close"), " ");
  }
}
function BiometricsBottomSheetComponent_div_0_ng_container_12_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 23)(1, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r1.errorMessage);
  }
}
function BiometricsBottomSheetComponent_div_0_ng_container_12_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 24)(1, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](t_r4("zelf_keys.biometrics.storing"));
  }
}
function BiometricsBottomSheetComponent_div_0_ng_container_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](1, BiometricsBottomSheetComponent_div_0_ng_container_12_div_1_Template, 3, 1, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "data-biometrics", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("biometricsCancel", function BiometricsBottomSheetComponent_div_0_ng_container_12_Template_data_biometrics_biometricsCancel_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r1.onBiometricsCancel());
    })("biometricsSuccess", function BiometricsBottomSheetComponent_div_0_ng_container_12_Template_data_biometrics_biometricsSuccess_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r1.onBiometricsSuccess($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](3, BiometricsBottomSheetComponent_div_0_ng_container_12_div_3_Template, 3, 1, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx_r1.errorMessage);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("isDecryptMode", ctx_r1.mode === "decrypt")("itemData", ctx_r1.itemData);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx_r1.isLoading);
  }
}
function BiometricsBottomSheetComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 2, 0)(2, "div", 3)(3, "div", 4)(4, "h3", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](6, BiometricsBottomSheetComponent_div_0_div_6_Template, 5, 2, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "button", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function BiometricsBottomSheetComponent_div_0_Template_button_click_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r1.onClose());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](8, "svg", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](9, "path", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](10, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](11, BiometricsBottomSheetComponent_div_0_div_11_Template, 7, 3, "div", 11)(12, BiometricsBottomSheetComponent_div_0_ng_container_12_Template, 4, 4, "ng-container", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r4 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](ctx_r1.getTitle());
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx_r1.itemData);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("aria-label", t_r4("zelf_keys.biometrics.close_aria"));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx_r1.hasStorageError);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", !ctx_r1.hasStorageError);
  }
}
class BiometricsBottomSheetComponent {
  data;
  _bottomSheetRef;
  _changeDetectorRef;
  _dataPassingService;
  _translocoService;
  _vaultService;
  _walletService;
  _zelfKeysService;
  errorMessage = "";
  hasStorageError = false;
  isLoading = false;
  itemData;
  itemType;
  mode;
  wallet;
  constructor(data, _bottomSheetRef, _changeDetectorRef, _dataPassingService, _translocoService, _vaultService, _walletService, _zelfKeysService) {
    this.data = data;
    this._bottomSheetRef = _bottomSheetRef;
    this._changeDetectorRef = _changeDetectorRef;
    this._dataPassingService = _dataPassingService;
    this._translocoService = _translocoService;
    this._vaultService = _vaultService;
    this._walletService = _walletService;
    this._zelfKeysService = _zelfKeysService;
    this.itemData = data.itemData;
    this.itemType = data.itemType;
    this.mode = data.mode;
  }
  ngOnInit() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      yield _this._setWallet();
    })();
  }
  _setWallet() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const wallet = yield _this2._walletService.getFirstWalletFromStorage();
      if (!wallet?.name) return;
      _this2.wallet = wallet;
      _this2._changeDetectorRef.detectChanges();
    })();
  }
  _getCategoryTranslationKey() {
    switch (this.itemType) {
      case "password":
        return "zelf_keys.categories.password";
      case "note":
        return "zelf_keys.categories.note";
      case "payment-card":
        return "zelf_keys.categories.payment_card";
      default:
        return "zelf_keys.biometrics_bottom_sheet.item";
    }
  }
  _storeDataByCategory(faceBase64) {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this3.itemData || Object.keys(_this3.itemData).length === 0) {
        throw new Error(`No data available for ${_this3.itemType}. Cannot proceed with storage.`);
      }
      if (!_this3.wallet?.zelfProof) {
        throw new Error("Wallet zelfProof is required for storage.");
      }
      const walletKeys = {
        masterPassword: _this3.wallet.hasPassword ? _this3.itemData.masterPassword : undefined,
        zelfProof: _this3.wallet.zelfProof
      };
      let response;
      switch (_this3.itemType) {
        case "note":
          const notePayload = {
            faceBase64: faceBase64,
            folder: _this3.itemData.folder,
            insideFolder: _this3.itemData.insideFolder,
            keyValuePairs: _this3.itemData.keyValuePairs,
            title: _this3.itemData.title,
            ...walletKeys
          };
          response = yield _this3._zelfKeysService.storeNotes(notePayload);
          break;
        case "password":
          const passwordPayload = {
            faceBase64: faceBase64,
            folder: _this3.itemData.folder,
            insideFolder: _this3.itemData.insideFolder,
            name: _this3.itemData.title,
            notes: _this3.itemData.notes,
            password: _this3.itemData.password,
            username: _this3.itemData.email,
            website: _this3.itemData.url,
            ...walletKeys
          };
          response = yield _this3._zelfKeysService.storePasswordWithAuth(passwordPayload);
          break;
        case "payment-card":
          const cardPayload = {
            bankName: _this3.itemData.bankName,
            cardName: _this3.itemData.cardName,
            cardNumber: _this3.itemData.cardNumber,
            cvv: _this3.itemData.cvv,
            expiryMonth: _this3.itemData.expiryMonth,
            expiryYear: _this3.itemData.expiryYear,
            faceBase64: faceBase64,
            folder: _this3.itemData.folder,
            insideFolder: _this3.itemData.insideFolder,
            ...walletKeys
          };
          response = yield _this3._zelfKeysService.storeCreditCard(cardPayload);
          break;
        default:
          throw new Error(`Unsupported item type: ${_this3.itemType}`);
      }
      return response;
    })();
  }
  _retrieveDataByCategory(faceBase64) {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this4.itemData?.zelfProof) throw new Error(`No zelfProof available for ${_this4.itemType}. Cannot proceed with retrieval.`);
      const {
        publicKey: clientPublicKey,
        privateKey: clientPrivateKey
      } = yield _this4._vaultService.generateEphemeralKeyPair();
      const payload = {
        zelfProof: _this4.itemData.zelfProof,
        faceBase64: faceBase64,
        type: _this4.itemType,
        clientPublicKey
      };
      const response = yield _this4._zelfKeysService.retrieve(payload);
      const encryptedMessage = response?.data?.pgp?.encryptedMessage;
      if (encryptedMessage) {
        const jsonData = yield _this4._vaultService.decryptWithPrivateKey(encryptedMessage, clientPrivateKey);
        response.data.metadata = JSON.parse(jsonData);
        delete response.data.pgp;
      }
      return response;
    })();
  }
  getTitle() {
    const actionKey = this.mode === "encrypt" ? "encrypt" : "decrypt";
    switch (this.itemType) {
      case "payment-card":
        return this._translocoService.translate(`zelf_keys.biometrics_bottom_sheet.${actionKey}_payment_card`);
      case "note":
        return this._translocoService.translate(`zelf_keys.biometrics_bottom_sheet.${actionKey}_note`);
      default:
        return this._translocoService.translate(`zelf_keys.biometrics_bottom_sheet.${actionKey}_password`);
    }
  }
  getInstructions() {
    switch (this.itemType) {
      case "payment-card":
        return this._translocoService.translate("zelf_keys.biometrics_bottom_sheet.instructions.payment_card");
      case "note":
        return this._translocoService.translate("zelf_keys.biometrics_bottom_sheet.instructions.note");
      default:
        return this._translocoService.translate("zelf_keys.biometrics_bottom_sheet.instructions.password");
    }
  }
  getItemType() {
    switch (this.itemType) {
      case "password":
        return this._translocoService.translate("zelf_keys.data_types.password");
      case "note":
        return this._translocoService.translate("zelf_keys.data_types.note");
      case "payment-card":
        return this._translocoService.translate("zelf_keys.data_types.payment_card");
      default:
        return this._translocoService.translate("zelf_keys.biometrics_bottom_sheet.item");
    }
  }
  getItemInfo() {
    if (!this.itemData) return "";
    switch (this.itemType) {
      case "password":
        if (this.itemData?.publicData?.website) {
          try {
            const url = new URL(this.itemData?.publicData?.website);
            return url.hostname;
          } catch {
            return this.itemData?.publicData?.website;
          }
        }
        return this.itemData.username || this._translocoService.translate("zelf_keys.data_types.password");
      case "payment-card":
        if (this.itemData.cardNumber) {
          const cardNumber = this.itemData.cardNumber.replace(/\s/g, "");
          return `**** **** **** ${cardNumber.slice(-4)}`;
        }
        return this.itemData.cardName || this._translocoService.translate("zelf_keys.data_types.payment_card");
      case "note":
        return this.itemData.title || this._translocoService.translate("zelf_keys.data_types.note");
      default:
        return this._translocoService.translate("zelf_keys.biometrics_bottom_sheet.item");
    }
  }
  onBiometricsSuccess(biometricData) {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this5.mode === "decrypt") {
        try {
          _this5.isLoading = true;
          _this5.errorMessage = "";
          _this5._changeDetectorRef.detectChanges();
          const retrievedData = yield _this5._retrieveDataByCategory(biometricData.faceBase64);
          _this5._bottomSheetRef.dismiss({
            ...biometricData,
            retrievedData: retrievedData?.data || retrievedData
          });
        } catch (error) {
          console.error(`Error retrieving ${_this5.itemType} data:`, error);
          _this5.isLoading = false;
          let errorMessage = _this5._translocoService.translate("zelf_keys.errors.retrieving", {
            type: _this5.itemType
          });
          if (error?.error?.error) {
            errorMessage = error.error.error;
          } else if (error?.error?.message) {
            errorMessage = error.error.message;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          _this5.errorMessage = errorMessage;
          _this5._changeDetectorRef.detectChanges();
        }
        return;
      }
      try {
        _this5.isLoading = true;
        _this5.errorMessage = "";
        _this5.hasStorageError = false;
        _this5._changeDetectorRef.detectChanges();
        const response = yield _this5._storeDataByCategory(biometricData.faceBase64);
        const resultData = response?.data || response;
        if (resultData) {
          let formType;
          switch (_this5.itemType) {
            case "password":
              formType = "passwords";
              break;
            case "note":
              formType = "notes";
              break;
            case "payment-card":
              formType = "payment-cards";
              break;
            default:
              formType = _this5.itemType;
          }
          yield _this5._dataPassingService.storeResult(formType, resultData);
        }
        _this5._bottomSheetRef.dismiss(biometricData);
      } catch (error) {
        console.error(`Error storing ${_this5.itemType} data:`, error);
        _this5.isLoading = false;
        _this5.hasStorageError = true;
        let translatedError = null;
        const errorKeys = [error?.error?.error, error?.error?.message, error?.message].filter(Boolean);
        for (const errorKey of errorKeys) {
          if (!errorKey) continue;
          const formattedKey = `errors.${errorKey}`;
          const translation = _this5._translocoService.translate(formattedKey);
          if (translation !== formattedKey) {
            translatedError = translation;
            break;
          }
        }
        // If we have a translatable error, use it; otherwise use generic message
        if (translatedError) {
          _this5.errorMessage = translatedError;
        } else {
          const categoryKey = _this5._getCategoryTranslationKey();
          const category = _this5._translocoService.translate(categoryKey);
          _this5.errorMessage = _this5._translocoService.translate("zelf_keys.biometrics_bottom_sheet.error.storage_failed", {
            category
          });
        }
        _this5._changeDetectorRef.detectChanges();
      }
    })();
  }
  onBiometricsCancel() {
    this._bottomSheetRef.dismiss();
  }
  onClose() {
    this._bottomSheetRef.dismiss();
  }
  static ɵfac = function BiometricsBottomSheetComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || BiometricsBottomSheetComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_2__.MAT_BOTTOM_SHEET_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_2__.MatBottomSheetRef), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_5__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](app_services_data_passing_service__WEBPACK_IMPORTED_MODULE_8__.DataPassingService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_jsverse_transloco__WEBPACK_IMPORTED_MODULE_3__.TranslocoService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](app_vault_service__WEBPACK_IMPORTED_MODULE_9__.VaultService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](app_wallet_service__WEBPACK_IMPORTED_MODULE_10__.WalletService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](app_services_zelf_keys_service__WEBPACK_IMPORTED_MODULE_11__.ZelfKeysService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({
    type: BiometricsBottomSheetComponent,
    selectors: [["biometrics-bottom-sheet"]],
    decls: 1,
    vars: 0,
    consts: [["zelfBottomSheet", ""], ["class", "biometrics-bottom-sheet__container", 4, "transloco"], [1, "biometrics-bottom-sheet__container"], [1, "biometrics-bottom-sheet__header"], [1, "biometrics-bottom-sheet__title-section"], [1, "biometrics-bottom-sheet__title"], ["class", "biometrics-bottom-sheet__item-info", 4, "ngIf"], [1, "biometrics-bottom-sheet__close", 3, "click"], ["width", "24", "height", "24", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M18 6L6 18M6 6L18 18", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], [1, "biometrics-bottom-sheet__content"], ["class", "biometrics-bottom-sheet__error-state", 4, "ngIf"], [4, "ngIf"], [1, "biometrics-bottom-sheet__item-info"], [1, "biometrics-bottom-sheet__item-type"], [1, "biometrics-bottom-sheet__item-preview"], [1, "biometrics-bottom-sheet__error-state"], [1, "biometrics-bottom-sheet__error-title"], [1, "biometrics-bottom-sheet__error-subtitle"], [1, "biometrics-bottom-sheet__error-close", 3, "click"], ["class", "biometrics-bottom-sheet__error", 4, "ngIf"], [3, "biometricsCancel", "biometricsSuccess", "isDecryptMode", "itemData"], ["class", "biometrics-bottom-sheet__loading", 4, "ngIf"], [1, "biometrics-bottom-sheet__error"], [1, "biometrics-bottom-sheet__loading"]],
    template: function BiometricsBottomSheetComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](0, BiometricsBottomSheetComponent_div_0_Template, 13, 5, "div", 1);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _data_biometrics_data_biometrics_component__WEBPACK_IMPORTED_MODULE_4__.DataBiometricsComponent, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_3__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_3__.TranslocoDirective],
    styles: [".biometrics-bottom-sheet__container[_ngcontent-%COMP%] {\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  border-radius: 24px 24px 0 0;\n  width: 100%;\n  max-width: 100%;\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n}\n.biometrics-bottom-sheet__header[_ngcontent-%COMP%] {\n  padding: 20px 24px 16px;\n  border-bottom: 1px solid #f0f0f0;\n  background: #f8f9fa;\n  flex-shrink: 0;\n}\n.biometrics-bottom-sheet__title-section[_ngcontent-%COMP%] {\n  flex: 1;\n  padding-right: 40px;\n}\n.biometrics-bottom-sheet__title[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 600;\n  color: #1a1a1a;\n  margin: 0 0 8px 0;\n}\n.biometrics-bottom-sheet__item-info[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin-top: 4px;\n}\n.biometrics-bottom-sheet__item-type[_ngcontent-%COMP%] {\n  font-size: 12px;\n  font-weight: 600;\n  color: #666;\n  background: #f5f5f5;\n  padding: 2px 8px;\n  border-radius: 4px;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.biometrics-bottom-sheet__item-preview[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #333;\n  font-family: \"Courier New\", Courier, monospace;\n  font-weight: 500;\n}\n.biometrics-bottom-sheet__subtitle[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #666;\n  margin: 0;\n  line-height: 1.4;\n}\n.biometrics-bottom-sheet__close[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 20px;\n  right: 24px;\n  background: none;\n  border: none;\n  padding: 8px;\n  border-radius: 8px;\n  color: #666;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.2s ease;\n}\n.biometrics-bottom-sheet__close[_ngcontent-%COMP%]:hover {\n  background: #f5f5f5;\n  color: #333;\n}\n.biometrics-bottom-sheet__close[_ngcontent-%COMP%]:active {\n  transform: scale(0.95);\n}\n.biometrics-bottom-sheet__close[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n}\n.biometrics-bottom-sheet__content[_ngcontent-%COMP%] {\n  padding: 24px;\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  overflow-y: auto;\n}\n.biometrics-bottom-sheet__error-state[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  text-align: center;\n  padding: 40px 24px;\n  min-height: 200px;\n}\n.biometrics-bottom-sheet__error-title[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 600;\n  color: #d32f2f;\n  margin: 0 0 12px 0;\n  line-height: 1.4;\n}\n.biometrics-bottom-sheet__error-subtitle[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: #666;\n  margin: 0 0 24px 0;\n  line-height: 1.5;\n}\n.biometrics-bottom-sheet__error-close[_ngcontent-%COMP%] {\n  background: #1976d2;\n  color: white;\n  border: none;\n  padding: 12px 24px;\n  border-radius: 8px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.biometrics-bottom-sheet__error-close[_ngcontent-%COMP%]:hover {\n  background: #1565c0;\n}\n.biometrics-bottom-sheet__error-close[_ngcontent-%COMP%]:active {\n  transform: scale(0.98);\n}\n.biometrics-bottom-sheet__error[_ngcontent-%COMP%] {\n  background: #ffebee;\n  border: 1px solid #ffcdd2;\n  border-radius: 8px;\n  padding: 12px 16px;\n  margin-bottom: 16px;\n}\n.biometrics-bottom-sheet__error[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #c62828;\n  font-size: 14px;\n}\n.biometrics-bottom-sheet__loading[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 24px;\n}\n.biometrics-bottom-sheet__loading[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: #666;\n  font-size: 14px;\n}\n\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_slideUp {\n  from {\n    transform: translateY(100%);\n  }\n  to {\n    transform: translateY(0);\n  }\n}\n@media (max-width: 768px) {\n  .biometrics-bottom-sheet__container[_ngcontent-%COMP%] {\n    max-height: 95vh;\n  }\n  .biometrics-bottom-sheet__header[_ngcontent-%COMP%] {\n    padding: 16px 20px 12px;\n    background: white;\n  }\n  .biometrics-bottom-sheet__title-section[_ngcontent-%COMP%] {\n    padding-right: 36px;\n  }\n  .biometrics-bottom-sheet__title[_ngcontent-%COMP%] {\n    font-size: 18px;\n  }\n  .biometrics-bottom-sheet__item-info[_ngcontent-%COMP%] {\n    margin-top: 2px;\n  }\n  .biometrics-bottom-sheet__item-type[_ngcontent-%COMP%] {\n    font-size: 11px;\n    padding: 1px 6px;\n  }\n  .biometrics-bottom-sheet__item-preview[_ngcontent-%COMP%] {\n    font-size: 13px;\n  }\n  .biometrics-bottom-sheet__subtitle[_ngcontent-%COMP%] {\n    font-size: 13px;\n  }\n  .biometrics-bottom-sheet__close[_ngcontent-%COMP%] {\n    top: 16px;\n    right: 20px;\n    padding: 6px;\n  }\n  .biometrics-bottom-sheet__close[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n    width: 18px;\n    height: 18px;\n  }\n}\n@media (prefers-color-scheme: dark) {\n  .biometrics-bottom-sheet__container[_ngcontent-%COMP%] {\n    background: #1a1a1a;\n  }\n  .biometrics-bottom-sheet__handle[_ngcontent-%COMP%] {\n    background: #404040;\n  }\n  .biometrics-bottom-sheet__header[_ngcontent-%COMP%] {\n    border-bottom-color: #333;\n    background: #1a1a1a;\n  }\n  .biometrics-bottom-sheet__title[_ngcontent-%COMP%] {\n    color: #ffffff;\n  }\n  .biometrics-bottom-sheet__subtitle[_ngcontent-%COMP%] {\n    color: #cccccc;\n  }\n  .biometrics-bottom-sheet__item-type[_ngcontent-%COMP%] {\n    background: #333;\n    color: #cccccc;\n  }\n  .biometrics-bottom-sheet__item-preview[_ngcontent-%COMP%] {\n    color: #ffffff;\n  }\n  .biometrics-bottom-sheet__close[_ngcontent-%COMP%] {\n    color: #cccccc;\n  }\n  .biometrics-bottom-sheet__close[_ngcontent-%COMP%]:hover {\n    background: #333;\n    color: #ffffff;\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvemVsZi1rZXlzL3NoYXJlZC9iaW9tZXRyaWNzLWJvdHRvbS1zaGVldC9iaW9tZXRyaWNzLWJvdHRvbS1zaGVldC5jb21wb25lbnQuc2NzcyIsIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX3ZhcmlhYmxlcy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdJO0VBQ0ksMERDeUJtQjtFRHhCbkIsNEJBQUE7RUFDQSxXQUFBO0VBQ0EsZUFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0FBRlI7QUFLSTtFQUNJLHVCQUFBO0VBQ0EsZ0NBQUE7RUFDQSxtQkFBQTtFQUNBLGNBQUE7QUFIUjtBQU1JO0VBQ0ksT0FBQTtFQUNBLG1CQUFBO0FBSlI7QUFPSTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxpQkFBQTtBQUxSO0FBUUk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxRQUFBO0VBQ0EsZUFBQTtBQU5SO0FBU0k7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxXQUFBO0VBQ0EsbUJBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7RUFDQSxxQkFBQTtBQVBSO0FBVUk7RUFDSSxlQUFBO0VBQ0EsV0FBQTtFQUNBLDhDQUFBO0VBQ0EsZ0JBQUE7QUFSUjtBQVdJO0VBQ0ksZUFBQTtFQUNBLFdBQUE7RUFDQSxTQUFBO0VBQ0EsZ0JBQUE7QUFUUjtBQVlJO0VBQ0ksa0JBQUE7RUFDQSxTQUFBO0VBQ0EsV0FBQTtFQUNBLGdCQUFBO0VBQ0EsWUFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtFQUNBLFdBQUE7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSx5QkFBQTtBQVZSO0FBWVE7RUFDSSxtQkFBQTtFQUNBLFdBQUE7QUFWWjtBQWFRO0VBQ0ksc0JBQUE7QUFYWjtBQWNRO0VBQ0ksV0FBQTtFQUNBLFlBQUE7QUFaWjtBQWdCSTtFQUNJLGFBQUE7RUFDQSxPQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsZ0JBQUE7QUFkUjtBQWlCSTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxrQkFBQTtFQUNBLGtCQUFBO0VBQ0EsaUJBQUE7QUFmUjtBQWtCSTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0FBaEJSO0FBbUJJO0VBQ0ksZUFBQTtFQUNBLFdBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0FBakJSO0FBb0JJO0VBQ0ksbUJBQUE7RUFDQSxZQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0Esa0JBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxlQUFBO0VBQ0EseUJBQUE7QUFsQlI7QUFvQlE7RUFDSSxtQkFBQTtBQWxCWjtBQXFCUTtFQUNJLHNCQUFBO0FBbkJaO0FBdUJJO0VBQ0ksbUJBQUE7RUFDQSx5QkFBQTtFQUNBLGtCQUFBO0VBQ0Esa0JBQUE7RUFDQSxtQkFBQTtBQXJCUjtBQXVCUTtFQUNJLFNBQUE7RUFDQSxjQUFBO0VBQ0EsZUFBQTtBQXJCWjtBQXlCSTtFQUNJLGtCQUFBO0VBQ0EsYUFBQTtBQXZCUjtBQXlCUTtFQUNJLFNBQUE7RUFDQSxXQUFBO0VBQ0EsZUFBQTtBQXZCWjs7QUE2QkE7RUFDSTtJQUNJLFVBQUE7RUExQk47RUE0QkU7SUFDSSxVQUFBO0VBMUJOO0FBQ0Y7QUE2QkE7RUFDSTtJQUNJLDJCQUFBO0VBM0JOO0VBNkJFO0lBQ0ksd0JBQUE7RUEzQk47QUFDRjtBQStCQTtFQUVRO0lBQ0ksZ0JBQUE7RUE5QlY7RUFpQ007SUFDSSx1QkFBQTtJQUNBLGlCQUFBO0VBL0JWO0VBa0NNO0lBQ0ksbUJBQUE7RUFoQ1Y7RUFtQ007SUFDSSxlQUFBO0VBakNWO0VBb0NNO0lBQ0ksZUFBQTtFQWxDVjtFQXFDTTtJQUNJLGVBQUE7SUFDQSxnQkFBQTtFQW5DVjtFQXNDTTtJQUNJLGVBQUE7RUFwQ1Y7RUF1Q007SUFDSSxlQUFBO0VBckNWO0VBd0NNO0lBQ0ksU0FBQTtJQUNBLFdBQUE7SUFDQSxZQUFBO0VBdENWO0VBd0NVO0lBQ0ksV0FBQTtJQUNBLFlBQUE7RUF0Q2Q7QUFDRjtBQTRDQTtFQUVRO0lBQ0ksbUJBQUE7RUEzQ1Y7RUE4Q007SUFDSSxtQkFBQTtFQTVDVjtFQStDTTtJQUNJLHlCQUFBO0lBQ0EsbUJBQUE7RUE3Q1Y7RUFnRE07SUFDSSxjQUFBO0VBOUNWO0VBaURNO0lBQ0ksY0FBQTtFQS9DVjtFQWtETTtJQUNJLGdCQUFBO0lBQ0EsY0FBQTtFQWhEVjtFQW1ETTtJQUNJLGNBQUE7RUFqRFY7RUFvRE07SUFDSSxjQUFBO0VBbERWO0VBb0RVO0lBQ0ksZ0JBQUE7SUFDQSxjQUFBO0VBbERkO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwiLi4vLi4vLi4vLi4vc3R5bGVzL3ZhcmlhYmxlc1wiO1xuXG4uYmlvbWV0cmljcy1ib3R0b20tc2hlZXQge1xuICAgICZfX2NvbnRhaW5lciB7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5OyAvLyBzZWFTYWx0IGNvbG9yXG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDI0cHggMjRweCAwIDA7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBtYXgtd2lkdGg6IDEwMCU7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47IC8vIFByZXZlbnQgY29udGFpbmVyIGZyb20gc2Nyb2xsaW5nXG4gICAgfVxuXG4gICAgJl9faGVhZGVyIHtcbiAgICAgICAgcGFkZGluZzogMjBweCAyNHB4IDE2cHg7XG4gICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZjBmMGYwO1xuICAgICAgICBiYWNrZ3JvdW5kOiAjZjhmOWZhOyAvLyBzZWFTYWx0IGNvbG9yXG4gICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgIH1cblxuICAgICZfX3RpdGxlLXNlY3Rpb24ge1xuICAgICAgICBmbGV4OiAxO1xuICAgICAgICBwYWRkaW5nLXJpZ2h0OiA0MHB4OyAvLyBTcGFjZSBmb3IgY2xvc2UgYnV0dG9uXG4gICAgfVxuXG4gICAgJl9fdGl0bGUge1xuICAgICAgICBmb250LXNpemU6IDIwcHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGNvbG9yOiAjMWExYTFhO1xuICAgICAgICBtYXJnaW46IDAgMCA4cHggMDtcbiAgICB9XG5cbiAgICAmX19pdGVtLWluZm8ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgbWFyZ2luLXRvcDogNHB4O1xuICAgIH1cblxuICAgICZfX2l0ZW0tdHlwZSB7XG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgY29sb3I6ICM2NjY7XG4gICAgICAgIGJhY2tncm91bmQ6ICNmNWY1ZjU7XG4gICAgICAgIHBhZGRpbmc6IDJweCA4cHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuNXB4O1xuICAgIH1cblxuICAgICZfX2l0ZW0tcHJldmlldyB7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgY29sb3I6ICMzMzM7XG4gICAgICAgIGZvbnQtZmFtaWx5OiBcIkNvdXJpZXIgTmV3XCIsIENvdXJpZXIsIG1vbm9zcGFjZTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICB9XG5cbiAgICAmX19zdWJ0aXRsZSB7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgY29sb3I6ICM2NjY7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDEuNDtcbiAgICB9XG5cbiAgICAmX19jbG9zZSB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgdG9wOiAyMHB4O1xuICAgICAgICByaWdodDogMjRweDtcbiAgICAgICAgYmFja2dyb3VuZDogbm9uZTtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBwYWRkaW5nOiA4cHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgY29sb3I6ICM2NjY7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2U7XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiAjZjVmNWY1O1xuICAgICAgICAgICAgY29sb3I6ICMzMzM7XG4gICAgICAgIH1cblxuICAgICAgICAmOmFjdGl2ZSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTUpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIHdpZHRoOiAyMHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiAyMHB4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fY29udGVudCB7XG4gICAgICAgIHBhZGRpbmc6IDI0cHg7XG4gICAgICAgIGZsZXg6IDE7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgfVxuXG4gICAgJl9fZXJyb3Itc3RhdGUge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBwYWRkaW5nOiA0MHB4IDI0cHg7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDIwMHB4O1xuICAgIH1cblxuICAgICZfX2Vycm9yLXRpdGxlIHtcbiAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBjb2xvcjogI2QzMmYyZjtcbiAgICAgICAgbWFyZ2luOiAwIDAgMTJweCAwO1xuICAgICAgICBsaW5lLWhlaWdodDogMS40O1xuICAgIH1cblxuICAgICZfX2Vycm9yLXN1YnRpdGxlIHtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBjb2xvcjogIzY2NjtcbiAgICAgICAgbWFyZ2luOiAwIDAgMjRweCAwO1xuICAgICAgICBsaW5lLWhlaWdodDogMS41O1xuICAgIH1cblxuICAgICZfX2Vycm9yLWNsb3NlIHtcbiAgICAgICAgYmFja2dyb3VuZDogIzE5NzZkMjtcbiAgICAgICAgY29sb3I6IHdoaXRlO1xuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgIHBhZGRpbmc6IDEycHggMjRweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZTtcblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICMxNTY1YzA7XG4gICAgICAgIH1cblxuICAgICAgICAmOmFjdGl2ZSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDAuOTgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fZXJyb3Ige1xuICAgICAgICBiYWNrZ3JvdW5kOiAjZmZlYmVlO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZmZjZGQyO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgIHBhZGRpbmc6IDEycHggMTZweDtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMTZweDtcblxuICAgICAgICBwIHtcbiAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICAgIGNvbG9yOiAjYzYyODI4O1xuICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fbG9hZGluZyB7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgcGFkZGluZzogMjRweDtcblxuICAgICAgICBwIHtcbiAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICAgIGNvbG9yOiAjNjY2O1xuICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICB9XG4gICAgfVxufVxuXG4vLyBBbmltYXRpb25zXG5Aa2V5ZnJhbWVzIGZhZGVJbiB7XG4gICAgZnJvbSB7XG4gICAgICAgIG9wYWNpdHk6IDA7XG4gICAgfVxuICAgIHRvIHtcbiAgICAgICAgb3BhY2l0eTogMTtcbiAgICB9XG59XG5cbkBrZXlmcmFtZXMgc2xpZGVVcCB7XG4gICAgZnJvbSB7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgxMDAlKTtcbiAgICB9XG4gICAgdG8ge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gICAgfVxufVxuXG4vLyBSZXNwb25zaXZlIGRlc2lnblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2OHB4KSB7XG4gICAgLmJpb21ldHJpY3MtYm90dG9tLXNoZWV0IHtcbiAgICAgICAgJl9fY29udGFpbmVyIHtcbiAgICAgICAgICAgIG1heC1oZWlnaHQ6IDk1dmg7XG4gICAgICAgIH1cblxuICAgICAgICAmX19oZWFkZXIge1xuICAgICAgICAgICAgcGFkZGluZzogMTZweCAyMHB4IDEycHg7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgICZfX3RpdGxlLXNlY3Rpb24ge1xuICAgICAgICAgICAgcGFkZGluZy1yaWdodDogMzZweDtcbiAgICAgICAgfVxuXG4gICAgICAgICZfX3RpdGxlIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICAgICAgfVxuXG4gICAgICAgICZfX2l0ZW0taW5mbyB7XG4gICAgICAgICAgICBtYXJnaW4tdG9wOiAycHg7XG4gICAgICAgIH1cblxuICAgICAgICAmX19pdGVtLXR5cGUge1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xuICAgICAgICAgICAgcGFkZGluZzogMXB4IDZweDtcbiAgICAgICAgfVxuXG4gICAgICAgICZfX2l0ZW0tcHJldmlldyB7XG4gICAgICAgICAgICBmb250LXNpemU6IDEzcHg7XG4gICAgICAgIH1cblxuICAgICAgICAmX19zdWJ0aXRsZSB7XG4gICAgICAgICAgICBmb250LXNpemU6IDEzcHg7XG4gICAgICAgIH1cblxuICAgICAgICAmX19jbG9zZSB7XG4gICAgICAgICAgICB0b3A6IDE2cHg7XG4gICAgICAgICAgICByaWdodDogMjBweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDZweDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMThweDtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDE4cHg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIERhcmsgbW9kZSBzdXBwb3J0XG5AbWVkaWEgKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKSB7XG4gICAgLmJpb21ldHJpY3MtYm90dG9tLXNoZWV0IHtcbiAgICAgICAgJl9fY29udGFpbmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICMxYTFhMWE7XG4gICAgICAgIH1cblxuICAgICAgICAmX19oYW5kbGUge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogIzQwNDA0MDtcbiAgICAgICAgfVxuXG4gICAgICAgICZfX2hlYWRlciB7XG4gICAgICAgICAgICBib3JkZXItYm90dG9tLWNvbG9yOiAjMzMzO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogIzFhMWExYTtcbiAgICAgICAgfVxuXG4gICAgICAgICZfX3RpdGxlIHtcbiAgICAgICAgICAgIGNvbG9yOiAjZmZmZmZmO1xuICAgICAgICB9XG5cbiAgICAgICAgJl9fc3VidGl0bGUge1xuICAgICAgICAgICAgY29sb3I6ICNjY2NjY2M7XG4gICAgICAgIH1cblxuICAgICAgICAmX19pdGVtLXR5cGUge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogIzMzMztcbiAgICAgICAgICAgIGNvbG9yOiAjY2NjY2NjO1xuICAgICAgICB9XG5cbiAgICAgICAgJl9faXRlbS1wcmV2aWV3IHtcbiAgICAgICAgICAgIGNvbG9yOiAjZmZmZmZmO1xuICAgICAgICB9XG5cbiAgICAgICAgJl9fY2xvc2Uge1xuICAgICAgICAgICAgY29sb3I6ICNjY2NjY2M7XG5cbiAgICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6ICMzMzM7XG4gICAgICAgICAgICAgICAgY29sb3I6ICNmZmZmZmY7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIkcHJpbWFyeUNvbG9yOiB2YXIoLS16bnMtdGhlbWUtcHJpbWFyeSwgIzE4MTgxOCk7XG4kcHJpbWFyeUxpZ2h0OiAjZGFkZGZhO1xuJHNlY29uZGFyeUNvbG9yOiB2YXIoLS16bnMtdGhlbWUtc2Vjb25kYXJ5LCAjZmY1NzIxKTtcbiRzZWNvbmRhcnlDb2xvckxpZ2h0OiAjZjZlNWUwO1xuXG4kY29ycmVjdDogdmFyKC0tem5zLXRoZW1lLXN1Y2Nlc3MsICMxZWE0NDYpO1xuJGNvcnJlY3REYXJrOiAjMGY1MjIzO1xuJGNvcnJlY3RMaWdodDogdmFyKC0tem5zLXRoZW1lLXN1Y2Nlc3MtdGV4dCwgI2U3ZjhlZCk7XG5cbiRlcnJvcjogdmFyKC0tem5zLXRoZW1lLWVycm9yLCAjZGMzNjJlKTtcbiRlcnJvckRhcms6ICM2MDE0MTA7XG4kZXJyb3JMaWdodDogdmFyKC0tem5zLXRoZW1lLWVycm9yLXRleHQsICNmY2VlZWUpO1xuXG4kd2FybmluZzogdmFyKC0tem5zLXRoZW1lLXdhcm5pbmcsICNkZTY4MDApO1xuJHdhcm5pbmdEYXJrOiAjNGEyMTBhO1xuJHdhcm5pbmdMaWdodDogdmFyKC0tem5zLXRoZW1lLXdhcm5pbmctdGV4dCwgI2ZmZWVlOSk7XG5cbiRpbmZvOiAjMzk5OGQzO1xuJGluZm9EYXJrOiAjMDA0YTc3O1xuJGluZm9MaWdodDogI2VjZjNmZTtcblxuJGJsYWNrOiAjMTgxODE4O1xuJHdoaXRlOiAjZmZmZmZmO1xuXG4kdGhlbWVCb2R5RmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtYm9keS1mYW1pbHksIFwiUG9wcGluc1wiLCBBcmlhbCwgc2Fucy1zZXJpZik7XG4kdGhlbWVUaXRsZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLXRpdGxlLWZhbWlseSwgXCJNZW5kYVwiLCBcIkFyaWFsIEJsYWNrXCIsIHNhbnMtc2VyaWYpO1xuJHRoZW1lTW9ub3NwYWNlRmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtbW9ub3NwYWNlLWZhbWlseSwgXCJDb3VyaWVyIE5ld1wiLCBDb3VyaWVyLCBtb25vc3BhY2UpO1xuXG4kdGhlbWVCYWNrZ3JvdW5kOiB2YXIoLS16bnMtdGhlbWUtYmFja2dyb3VuZCwgI2ZmZmZmZik7XG4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtYmFja2dyb3VuZC1zZWNvbmRhcnksICNmOWY5ZmMpO1xuXG4kdGhlbWVUZXh0OiB2YXIoLS16bnMtdGhlbWUtdGV4dCwgIzE4MTgxOCk7XG4kdGhlbWVUZXh0TXV0ZWQ6IHZhcigtLXpucy10aGVtZS10ZXh0LW11dGVkLCAjOTY5MzllKTtcbiR0aGVtZVRleHRTZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS10ZXh0LXNlY29uZGFyeSwgIzczNzc3Zik7XG5cbiR0aGVtZUhlYWRlcjogdmFyKC0tem5zLXRoZW1lLWhlYWRlciwgIzE4MTgxOCk7XG4kdGhlbWVIZWFkZXJUZXh0OiB2YXIoLS16bnMtdGhlbWUtaGVhZGVyLXRleHQsICNmZmZmZmYpO1xuXG4kdGhlbWVCdXR0b246IHZhcigtLXpucy10aGVtZS1idXR0b24sICMxODE4MTgpO1xuJHRoZW1lQnV0dG9uVGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi10ZXh0LCAjZmZmZmZmKTtcbiR0aGVtZUJ1dHRvbkhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLWhvdmVyLCAjZmY1NzIxKTtcblxuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeSwgI2U5ZWNlZik7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeS10ZXh0LCAjNDk1MDU3KTtcbiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeS1ob3ZlciwgI2U5ZWNlZik7XG5cbiR0aGVtZUJvcmRlcjogdmFyKC0tem5zLXRoZW1lLWJvcmRlciwgI2UzZTNlMyk7XG4kdGhlbWVCb3JkZXJIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJvcmRlci1ob3ZlciwgI2MzYzZjZik7XG5cbiR0aGVtZUNhcmQ6IHZhcigtLXpucy10aGVtZS1jYXJkLCAjZmZmZmZmKTtcbiR0aGVtZUNhcmRCb3JkZXI6IHZhcigtLXpucy10aGVtZS1jYXJkLWJvcmRlciwgI2VlZWRmMSk7XG5cbiR0aGVtZVNoYWRvdzogdmFyKC0tem5zLXRoZW1lLXNoYWRvdywgcmdiYSgwLCAwLCAwLCAwLjEpKTtcblxuJHNtb290aEJlemllcjogY3ViaWMtYmV6aWVyKDAuMjUsIDAuNCwgMC43LCAxKTtcblxuJG1heEV4dHJhU21hbGw6IDU5NXB4O1xuJG1pblNtYWxsOiA2MDBweDtcbiRtZWRpdW06IDc2OHB4O1xuJGxhcmdlOiA4ODlweDtcbiRjb21wdXRlcnM6IDEyMDBweDtcbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ },

/***/ 7875
/*!*******************************************************************************!*\
  !*** ./src/app/zelf-keys/shared/data-biometrics/data-biometrics.component.ts ***!
  \*******************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DataBiometricsComponent: () => (/* binding */ DataBiometricsComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/flex-layout */ 39981);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/progress-bar */ 26354);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/progress-spinner */ 41134);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var _vladmandic_face_api__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @vladmandic/face-api */ 12841);
/* harmony import */ var ngx_webcam__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ngx-webcam */ 93491);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 33900);
/* harmony import */ var app_zelf_loader_zelf_loader_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! app/zelf-loader/zelf-loader.component */ 40152);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var app_http_wrapper_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! app/http-wrapper.service */ 84099);
/* harmony import */ var _wallet_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../../wallet.service */ 69556);
/* harmony import */ var app_services_zelf_keys_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! app/services/zelf-keys.service */ 52368);
/* harmony import */ var _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/flex-layout/flex */ 91447);




















const _c0 = ["maskResult"];
const _c1 = ["toSend"];
const _c2 = ["webcam"];
const _c3 = ["dataBiometricsContainer"];
const _c4 = a0 => ({
  type: a0
});
function DataBiometricsComponent_div_0_div_3_p_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "p", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", t_r1("zelf_keys.biometrics.instructions.encrypt", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](1, _c4, ctx_r1.getDataTypeTitle().toLowerCase())), " ");
  }
}
function DataBiometricsComponent_div_0_div_3_p_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "p", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", t_r1("zelf_keys.biometrics.instructions.decrypt", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](1, _c4, ctx_r1.getDataTypeTitle().toLowerCase())), " ");
  }
}
function DataBiometricsComponent_div_0_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, DataBiometricsComponent_div_0_div_3_p_1_Template, 2, 3, "p", 13)(2, DataBiometricsComponent_div_0_div_3_p_2_Template, 2, 3, "p", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx_r1.isDecryptMode);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.isDecryptMode);
  }
}
function DataBiometricsComponent_div_0_div_4_webcam_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "webcam", 24, 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("imageCapture", function DataBiometricsComponent_div_0_div_4_webcam_2_Template_webcam_imageCapture_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r1.processImage($event));
    })("initError", function DataBiometricsComponent_div_0_div_4_webcam_2_Template_webcam_initError_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r3);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r1.cameraError($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("allowCameraSwitch", false)("captureImageData", true)("height", ctx_r1.camera.dimensions.video.height)("imageQuality", 1)("trigger", ctx_r1.takePicture$)("videoOptions", ctx_r1.camera.configuration)("width", ctx_r1.camera.dimensions.video.width);
  }
}
function DataBiometricsComponent_div_0_div_4_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "zelf-loader", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("diameter", 120);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", ctx_r1.response.isLoading ? t_r1("zelf_keys.biometrics.processing.processing") : t_r1("zelf_keys.biometrics.processing.analyzing"), " ");
  }
}
function DataBiometricsComponent_div_0_div_4_div_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 28)(1, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r1.errorFace.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r1.errorFace.subtitle);
  }
}
function DataBiometricsComponent_div_0_div_4_div_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 31)(1, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r1("zelf_keys.biometrics.status.position_face_title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r1("zelf_keys.biometrics.status.position_face_subtitle"));
  }
}
function DataBiometricsComponent_div_0_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 15)(1, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, DataBiometricsComponent_div_0_div_4_webcam_2_Template, 2, 7, "webcam", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "canvas", 18, 1)(5, "canvas", 19, 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, DataBiometricsComponent_div_0_div_4_div_7_Template, 4, 2, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "div", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](9, DataBiometricsComponent_div_0_div_4_div_9_Template, 5, 2, "div", 22)(10, DataBiometricsComponent_div_0_div_4_div_10_Template, 5, 2, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx_r1.response.base64Image);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.response.isLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.errorFace && !ctx_r1.response.isLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx_r1.errorFace && !ctx_r1.response.isLoading);
  }
}
function DataBiometricsComponent_div_0_div_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 34)(1, "div", 35)(2, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3, "warning");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "h3", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](6, "p", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "div", 39)(9, "button", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function DataBiometricsComponent_div_0_div_5_Template_button_click_9_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r1.clearApiError());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "button", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function DataBiometricsComponent_div_0_div_5_Template_button_click_11_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r4);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r1.onBack());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r1("zelf_keys.biometrics.api_error.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r1.apiError);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", t_r1("zelf_keys.biometrics.api_error.try_again"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", t_r1("zelf_keys.biometrics.api_error.go_back"), " ");
  }
}
function DataBiometricsComponent_div_0_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "img", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "h2", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "p", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r1("zelf_keys.biometrics.camera_error.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r1("zelf_keys.biometrics.camera_error.description"));
  }
}
function DataBiometricsComponent_div_0_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 46)(1, "span", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, "camera_alt");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "h2", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "p", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "button", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function DataBiometricsComponent_div_0_div_7_Template_button_click_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r5);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r1.onBack());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r1("zelf_keys.biometrics.permission.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](t_r1("zelf_keys.biometrics.permission.description"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", t_r1("zelf_keys.biometrics.permission.go_back"), " ");
  }
}
function DataBiometricsComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 5, 0)(2, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, DataBiometricsComponent_div_0_div_3_Template, 3, 2, "div", 7)(4, DataBiometricsComponent_div_0_div_4_Template, 11, 4, "div", 8)(5, DataBiometricsComponent_div_0_div_5_Template, 13, 4, "div", 9)(6, DataBiometricsComponent_div_0_div_6_Template, 6, 2, "div", 10)(7, DataBiometricsComponent_div_0_div_7_Template, 9, 3, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx_r1.camera.isLoading && ctx_r1.camera.hasPermissions && !ctx_r1.camera.isLowQuality && !ctx_r1.hasApiError && !ctx_r1.response.isLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx_r1.camera.isLoading && ctx_r1.camera.hasPermissions && !ctx_r1.camera.isLowQuality && !ctx_r1.hasApiError);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r1.hasApiError && !ctx_r1.response.isLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx_r1.camera.isLoading && ctx_r1.camera.isLowQuality && !ctx_r1.hasApiError);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", !ctx_r1.camera.isLoading && !ctx_r1.camera.hasPermissions && !ctx_r1.hasApiError);
  }
}
class DataBiometricsComponent {
  _changeDetectorRef;
  _httpWrapperService;
  _translocoService;
  _walletService;
  _zelfKeysService;
  maskResultCanvasRef;
  ToSendCanvasRef;
  webcamRef;
  dataBiometricsContainerRef;
  isDecryptMode = false;
  itemData = {};
  biometricsSuccess = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
  biometricsCancel = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
  unsubscriber$ = new rxjs__WEBPACK_IMPORTED_MODULE_10__.Subject();
  _takePicture = new rxjs__WEBPACK_IMPORTED_MODULE_10__.Subject();
  _intervals = {};
  // Camera and face detection properties
  camera = {
    isLoading: true,
    hasPermissions: true,
    isLowQuality: false,
    dimensions: {
      video: {
        width: 0,
        height: 0,
        max: {
          width: 800,
          height: 600
        }
      },
      result: {
        width: 0,
        height: 0,
        offsetX: 0,
        offsetY: 0
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
    minHeight: 150,
    // Reduced from 200
    minPixels: 150,
    // Reduced from 200
    successPosition: 0,
    threshold: 0.15 // Reduced from 0.25 (lower = less strict)
  };
  response = {
    base64Image: "",
    isLoading: false
  };
  errorFace = null;
  lastFace;
  masterPassword = "";
  // Error handling
  apiError = "";
  hasApiError = false;
  // Category-specific properties
  dataType = "";
  dataTitle = "";
  constructor(_changeDetectorRef, _httpWrapperService, _translocoService, _walletService, _zelfKeysService) {
    this._changeDetectorRef = _changeDetectorRef;
    this._httpWrapperService = _httpWrapperService;
    this._translocoService = _translocoService;
    this._walletService = _walletService;
    this._zelfKeysService = _zelfKeysService;
  }
  ngOnInit() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      // Determine data type from itemData if available, otherwise default to password
      if (_this.itemData?.publicData?.type) {
        _this.dataType = _this.itemData.publicData.type;
      } else if (_this.itemData?.type) {
        _this.dataType = _this.itemData.type;
      } else {
        _this.dataType = "passwords";
      }
      // Set data title based on type
      switch (_this.dataType) {
        case "notes":
          _this.dataTitle = _this._translocoService.translate("zelf_keys.data_types.note");
          break;
        case "payment-cards":
          _this.dataTitle = _this._translocoService.translate("zelf_keys.data_types.payment_card");
          break;
        case "passwords":
        default:
          _this.dataTitle = _this._translocoService.translate("zelf_keys.data_types.password");
          break;
      }
      // Set master password if available in itemData
      if (_this.itemData?.masterPassword) {
        _this.masterPassword = _this.itemData.masterPassword;
      }
      _this._initializeBiometrics();
    })();
  }
  ngOnDestroy() {
    if (this._intervals.detectFace) clearInterval(this._intervals.detectFace);
    if (this._intervals.checkNgxVideo) clearInterval(this._intervals.checkNgxVideo);
    this._stopCamera();
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
  get takePicture$() {
    return this._takePicture.asObservable();
  }
  /**
   * Handle biometrics cancellation in both decrypt and create modes
   */
  onBiometricsCancel() {
    this._stopCamera();
    this.biometricsCancel.emit();
  }
  /**
   * Stop camera stream and cleanup
   */
  _stopCamera() {
    try {
      if (!this.webcamRef) return;
      const videoElement = this.webcamRef.nativeVideoElement;
      if (!videoElement || !videoElement.srcObject) return;
      const stream = videoElement.srcObject;
      if (!stream) return;
      stream.getTracks().forEach(track => track.stop());
      videoElement.srcObject = null;
    } catch (error) {
      console.warn("Error stopping camera:", error);
    }
  }
  /**
   * Clear API error and retry
   */
  clearApiError() {
    this.apiError = "";
    this.hasApiError = false;
    this.response.isLoading = false;
    this.response.base64Image = "";
    this._changeDetectorRef.markForCheck();
    // Restart face detection
    this._startFaceDetectionInterval();
  }
  _initializeBiometrics() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        // Always wait for the wallet service to load the models
        _this2._walletService.faceapi$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_11__.takeUntil)(_this2.unsubscriber$)).subscribe(/*#__PURE__*/function () {
          var _ref = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (isLoaded) {
            _this2.camera.isLoading = !isLoaded;
            if (!isLoaded) return;
            yield _this2._setMaxVideoDimensions();
            _this2._setupResizeListener();
            _this2._startNgxVideoInterval();
          });
          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }());
      } catch (error) {
        console.error("❌ Error initializing biometrics:", error);
      }
    })();
  }
  _setupResizeListener() {
    var _this3 = this;
    // Use the exact same debounced approach as working version
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(/*#__PURE__*/(0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
        yield _this3._setMaxVideoDimensions();
        _this3._startNgxVideoInterval();
      }), 300);
    });
  }
  _startNgxVideoInterval() {
    if (this._intervals.checkNgxVideo) {
      clearInterval(this._intervals.checkNgxVideo);
      this._intervals.checkNgxVideo = null;
    }
    this._intervals.checkNgxVideo = setInterval(this._checkVideoStreamReady, 100);
  }
  _checkVideoStreamReady = () => {
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
  };
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
    if (maskResultCanvas) {
      maskResultCanvas.style.marginLeft = `0px`;
      maskResultCanvas.style.marginTop = `0px`;
    }
    this._changeDetectorRef.markForCheck();
  }
  _calculateDisplayDimensions() {
    // Get the bottom sheet container
    const bottomSheetElement = document.querySelector(".zelf-bottom-sheet-biometrics");
    if (!bottomSheetElement) return {
      isLandscape: false,
      width: 0,
      height: 0
    };
    // Get exact container dimensions
    const containerHeight = bottomSheetElement.clientHeight;
    const containerWidth = bottomSheetElement.clientWidth;
    // Always use landscape calculation with conservative height
    const availableWidth = containerWidth * 0.9; // 90% of width
    const availableHeight = containerHeight * 0.7; // 70% of height
    const targetAspectRatio = 16 / 9;
    // Always calculate as landscape - start with height and calculate width
    let finalHeight = availableHeight;
    let finalWidth = finalHeight * targetAspectRatio;
    // If width exceeds available space, scale down based on width
    if (finalWidth > availableWidth) {
      finalWidth = availableWidth;
      finalHeight = finalWidth / targetAspectRatio;
    }
    // Round to prevent subpixel rendering issues
    finalWidth = Math.floor(finalWidth);
    finalHeight = Math.floor(finalHeight);
    return {
      isLandscape: true,
      // Always treat as landscape
      width: finalWidth,
      height: finalHeight
    };
  }
  _setMaxVideoDimensions() {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const displayDimensions = _this4._calculateDisplayDimensions();
      _this4.camera.isLoading = true;
      _this4._changeDetectorRef.markForCheck();
      return yield new Promise(resolve => {
        setTimeout(() => {
          // Set the video dimensions directly
          _this4.camera.dimensions.video.width = displayDimensions.width;
          _this4.camera.dimensions.video.height = displayDimensions.height;
          _this4.camera.dimensions.video.max = {
            width: displayDimensions.width,
            height: displayDimensions.height
          };
          _this4.camera.configuration = {
            height: {
              ideal: 1080
            },
            // Always use landscape height
            width: {
              ideal: 1920
            },
            // Always use landscape width
            facingMode: "user"
          };
          _this4.camera.dimensions.result = {
            height: 0,
            width: 0,
            offsetX: 0,
            offsetY: 0
          };
          _this4.camera.isLoading = false;
          _this4.webcamRef?.videoResize();
          _this4._changeDetectorRef.markForCheck();
          resolve();
        });
      });
    })();
  }
  _getCenterAndRadius(height, width) {
    const aspectRatio = 0.75; // Match working version
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
    data.radius.x = data.radius.y * aspectRatio;
    if (data.radius.x * 2 >= width) {
      data.radius.x = width * 0.48;
      data.radius.y = data.radius.x / aspectRatio;
    }
    return data;
  }
  _setResultDimensions(type, height, width) {
    const dimensions = this.camera.dimensions[type];
    if (!dimensions) return;
    dimensions.height = height;
    dimensions.offsetY = 0;
    dimensions.width = Math.min(2.8 * (this.face.real?.radius?.x || 0), width);
    dimensions.offsetX = (this.face.real?.center?.x || 0) - dimensions.width / 2;
  }
  _drawOvalCenterAndMask() {
    const videoDim = this.camera.dimensions.video;
    const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;
    if (!maskResultCanvas || !videoDim.width || !videoDim.height) return;
    maskResultCanvas.height = videoDim.height;
    maskResultCanvas.width = videoDim.width;
    const ctx = maskResultCanvas.getContext("2d");
    if (!ctx) return;
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
      subtitle: this._translocoService.translate("zelf_keys.biometrics.status.position_face_subtitle"),
      title: this._translocoService.translate("zelf_keys.biometrics.status.position_face_title")
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
        title: this._translocoService.translate("liveness.get_closer"),
        subtitle: this._translocoService.translate("liveness.get_closer_subtitle")
      };
    }
  }
  _startFaceDetectionInterval() {
    if (this._intervals.detectFace) {
      clearInterval(this._intervals.detectFace);
      this._intervals.detectFace = null;
    }
    this._intervals.detectFace = setInterval(() => {
      this._detectFace();
    }, 200); // Reduced from 100ms to 200ms for better performance
  }
  _detectFace() {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const videoNgx = _this5.webcamRef?.nativeVideoElement;
      if (!videoNgx || _this5.response.base64Image) return;
      // Early return if video is not ready
      if (videoNgx.readyState !== 4) {
        return;
      }
      try {
        // Use higher confidence threshold for better performance
        const detection = yield _vladmandic_face_api__WEBPACK_IMPORTED_MODULE_8__.detectAllFaces(videoNgx, new _vladmandic_face_api__WEBPACK_IMPORTED_MODULE_8__.SsdMobilenetv1Options({
          minConfidence: 0.4
        })).withFaceLandmarks();
        const context = _this5.maskResultCanvasRef?.nativeElement.getContext("2d", {
          willReadFrequently: true
        });
        if (!context) return;
        if (detection.length > 0) {
          _this5.lastFace = detection[0];
          _this5.errorFace = null;
          _this5._changeDetectorRef.markForCheck();
          // Set real dimensions for face positioning calculations (only if changed)
          if (!_this5.camera.dimensions.real.width || _this5.camera.dimensions.real.width !== videoNgx.videoWidth) {
            _this5.camera.dimensions.real = {
              height: videoNgx.videoHeight,
              width: videoNgx.videoWidth,
              offsetX: 0,
              offsetY: 0
            };
            _this5.face.real = _this5._getCenterAndRadius(videoNgx.videoHeight, videoNgx.videoWidth);
            _this5._drawOvalCenterAndMask();
          }
          // Check face positioning
          _this5._isFaceCentered(_this5.lastFace.landmarks.getNose()[3]);
          _this5._isFaceClose(_this5.lastFace.landmarks);
          // Draw status oval (green if no errors, red if errors)
          _this5._drawStatusOval(context, !_this5.errorFace);
          if (!_this5.errorFace) {
            ++_this5.face.successPosition;
          } else {
            _this5.face.successPosition = 0;
          }
          if (_this5.face.successPosition > 0) {
            // Capture after 1 successful frame (very responsive)
            _this5.face.successPosition = 0;
            _this5._takePicture.next(); // Trigger image capture
            clearInterval(_this5._intervals.detectFace); // Stop detection after capture
            _this5._changeDetectorRef.markForCheck();
          }
        } else {
          _this5.face.successPosition = 0;
          _this5.errorFace = {
            title: _this5._translocoService.translate("zelf_keys.biometrics.errors.no_face_detected"),
            subtitle: _this5._translocoService.translate("zelf_keys.biometrics.errors.look_at_camera")
          };
          _this5._changeDetectorRef.markForCheck();
          _this5._drawOvalCenterAndMask();
          _this5._drawStatusOval(context, false);
        }
        _this5._changeDetectorRef.markForCheck();
      } catch (error) {
        console.error("Face detection error:", error);
        _this5._changeDetectorRef.markForCheck();
        const context = _this5.maskResultCanvasRef?.nativeElement.getContext("2d");
        if (context) _this5._drawStatusOval(context, false);
      }
    })();
  }
  _setImageOnCanvas(canvas, img, dimensions, resultDimensions) {
    const context = canvas.getContext("2d");
    if (!context) return;
    canvas.width = resultDimensions.width;
    canvas.height = resultDimensions.height;
    context.drawImage(img, dimensions.offsetX, dimensions.offsetY, dimensions.width, dimensions.height, 0, 0, resultDimensions.width, resultDimensions.height);
  }
  _takePictureLiveness(img) {
    const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;
    const toSendCanvas = this.ToSendCanvasRef?.nativeElement;
    if (!maskResultCanvas || !toSendCanvas) return;
    if (!this.camera.dimensions.real || !this.camera.dimensions.result) {
      console.error("Camera dimensions not properly initialized");
      return;
    }
    this._setImageOnCanvas(maskResultCanvas, img, this.camera.dimensions.real, this.camera.dimensions.result);
    this._setImageOnCanvas(toSendCanvas, img, this.camera.dimensions.real, this.camera.dimensions.real);
    this.response.base64Image = toSendCanvas.toDataURL("image/jpeg");
    this.response.isLoading = true;
    this._emitBiometricCapture();
  }
  _emitBiometricCapture() {
    var _this6 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const base64Data = _this6.response.base64Image.split(",")[1];
        const encryptedFaceBase64 = yield _this6._httpWrapperService.encryptMessage(base64Data);
        // For both encrypt and decrypt modes, emit encrypted faceBase64 and password
        // The parent component (biometrics-bottom-sheet) will handle retrieval for decrypt mode
        _this6._stopCamera();
        _this6.biometricsSuccess.emit({
          faceBase64: encryptedFaceBase64,
          password: _this6.masterPassword
        });
      } catch (error) {
        console.error("Error in biometric capture:", error);
        _this6.response.isLoading = false;
        _this6.response.base64Image = "";
        _this6._changeDetectorRef.markForCheck();
      }
    })();
  }
  cameraError(error) {
    console.error("Camera error:", error);
    if (!error.mediaStreamError || error.mediaStreamError.name !== "NotAllowedError") return;
    this.camera.hasPermissions = false;
  }
  processImage(webcamImage) {
    var _this7 = this;
    if (this.response.base64Image) return;
    const img = new Image();
    img.src = webcamImage.imageAsDataUrl;
    img.onload = /*#__PURE__*/(0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (img.height < _this7.face.minHeight) {
        _this7.camera.isLowQuality = true;
        return;
      }
      _this7._takePictureLiveness(img);
    });
  }
  onBack() {
    this.onBiometricsCancel();
  }
  // Helper methods for UI
  getDataTypeTitle() {
    return this.dataTitle;
  }
  static ɵfac = function DataBiometricsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DataBiometricsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_13__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](app_http_wrapper_service__WEBPACK_IMPORTED_MODULE_15__.HttpWrapperService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_jsverse_transloco__WEBPACK_IMPORTED_MODULE_7__.TranslocoService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_wallet_service__WEBPACK_IMPORTED_MODULE_16__.WalletService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](app_services_zelf_keys_service__WEBPACK_IMPORTED_MODULE_17__.ZelfKeysService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: DataBiometricsComponent,
    selectors: [["data-biometrics"]],
    viewQuery: function DataBiometricsComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c0, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c1, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c2, 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵviewQuery"](_c3, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.maskResultCanvasRef = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.ToSendCanvasRef = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.webcamRef = _t.first);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵloadQuery"]()) && (ctx.dataBiometricsContainerRef = _t.first);
      }
    },
    inputs: {
      isDecryptMode: "isDecryptMode",
      itemData: "itemData"
    },
    outputs: {
      biometricsSuccess: "biometricsSuccess",
      biometricsCancel: "biometricsCancel"
    },
    decls: 1,
    vars: 0,
    consts: [["dataBiometricsContainer", ""], ["maskResult", ""], ["toSend", ""], ["webcam", ""], ["class", "data-biometrics-container", 4, "transloco"], [1, "data-biometrics-container"], ["fxLayout", "column", "fxLayoutAlign", "center center", 1, "data-biometrics-container__content"], ["class", "data-biometrics-container__instructions", 4, "ngIf"], ["class", "data-biometrics-container__camera", "fxLayout", "column", "fxLayoutAlign", "center center", 4, "ngIf"], ["class", "data-biometrics-container__api-error", "fxLayout", "column", "fxLayoutAlign", "center center", 4, "ngIf"], ["class", "data-biometrics-container__error-camera", "fxLayout", "column", "fxLayoutAlign", "center center", 4, "ngIf"], ["class", "data-biometrics-container__permission", "fxLayout", "column", "fxLayoutAlign", "center center", 4, "ngIf"], [1, "data-biometrics-container__instructions"], ["class", "data-biometrics-container__instructions-text", 4, "ngIf"], [1, "data-biometrics-container__instructions-text"], ["fxLayout", "column", "fxLayoutAlign", "center center", 1, "data-biometrics-container__camera"], [1, "data-biometrics-container__camera-view", "data-biometrics-container__camera-view--full-width"], ["mirrorImage", "always", 3, "allowCameraSwitch", "captureImageData", "height", "imageQuality", "trigger", "videoOptions", "width", "imageCapture", "initError", 4, "ngIf"], [1, "data-biometrics-container__face-mask", "data-biometrics-container__face-mask--full-width"], ["hidden", "true"], ["class", "data-biometrics-container__loading-overlay", "fxLayout", "column", "fxLayoutAlign", "center center", 4, "ngIf"], ["fxLayout", "column", "fxLayoutAlign", "center center", 1, "data-biometrics-container__status"], ["class", "data-biometrics-container__error", 4, "ngIf"], ["class", "data-biometrics-container__instructions-status", 4, "ngIf"], ["mirrorImage", "always", 3, "imageCapture", "initError", "allowCameraSwitch", "captureImageData", "height", "imageQuality", "trigger", "videoOptions", "width"], ["fxLayout", "column", "fxLayoutAlign", "center center", 1, "data-biometrics-container__loading-overlay"], [3, "diameter"], [1, "data-biometrics-container__processing-message"], [1, "data-biometrics-container__error"], [1, "data-biometrics-container__error-title"], [1, "data-biometrics-container__error-subtitle"], [1, "data-biometrics-container__instructions-status"], [1, "data-biometrics-container__instructions-title"], [1, "data-biometrics-container__instructions-subtitle"], ["fxLayout", "column", "fxLayoutAlign", "center center", 1, "data-biometrics-container__api-error"], [1, "data-biometrics-container__api-error-card"], [1, "material-symbols-outlined", "data-biometrics-container__api-error-icon"], [1, "data-biometrics-container__api-error-title"], [1, "data-biometrics-container__api-error-message"], [1, "data-biometrics-container__api-error-actions"], [1, "data-biometrics-container__btn", "data-biometrics-container__btn--retry", 3, "click"], [1, "data-biometrics-container__btn", "data-biometrics-container__btn--back", 3, "click"], ["fxLayout", "column", "fxLayoutAlign", "center center", 1, "data-biometrics-container__error-camera"], ["src", "https://cdn.verifik.co/demo/nocameraenabled.svg", "alt", "Camera Error", 1, "data-biometrics-container__camera-error-image"], [1, "data-biometrics-container__error-camera-title"], [1, "data-biometrics-container__error-camera-description"], ["fxLayout", "column", "fxLayoutAlign", "center center", 1, "data-biometrics-container__permission"], [1, "material-symbols-outlined", "data-biometrics-container__permission-icon"], [1, "data-biometrics-container__permission-title"], [1, "data-biometrics-container__permission-description"]],
    template: function DataBiometricsComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, DataBiometricsComponent_div_0_Template, 8, 5, "div", 4);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _angular_flex_layout__WEBPACK_IMPORTED_MODULE_3__.FlexLayoutModule, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_18__.DefaultLayoutDirective, _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_18__.DefaultLayoutAlignDirective, _angular_material_button__WEBPACK_IMPORTED_MODULE_4__.MatButtonModule, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_5__.MatProgressBarModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_6__.MatProgressSpinnerModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_7__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_7__.TranslocoDirective, ngx_webcam__WEBPACK_IMPORTED_MODULE_9__.WebcamModule, ngx_webcam__WEBPACK_IMPORTED_MODULE_9__.WebcamComponent, app_zelf_loader_zelf_loader_component__WEBPACK_IMPORTED_MODULE_12__.ZelfLoaderComponent],
    styles: [".data-biometrics-container[_ngcontent-%COMP%] {\n  min-height: auto;\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  border-radius: 12px 12px 0 0;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n}\n.data-biometrics-container__content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: auto;\n  flex: 1;\n  overflow-y: auto;\n}\n.data-biometrics-container__instructions[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 0 16px;\n}\n.data-biometrics-container__instructions-text[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text-muted, #96939e);\n  font-size: 14px;\n  line-height: 1.4;\n}\n.data-biometrics-container__camera[_ngcontent-%COMP%] {\n  text-align: center;\n  width: 100%;\n  padding: 0 16px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.data-biometrics-container__camera-view[_ngcontent-%COMP%] {\n  position: relative;\n  margin: 0 auto 16px;\n  border-radius: 12px;\n  overflow: hidden;\n}\n.data-biometrics-container__camera-view--full-width[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: auto;\n  height: auto;\n}\n.data-biometrics-container__camera-view[_ngcontent-%COMP%]   webcam[_ngcontent-%COMP%] {\n  position: relative;\n  border-radius: 12px;\n  display: block;\n  width: auto;\n  height: auto;\n}\n.data-biometrics-container__camera-status[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n}\n.data-biometrics-container__face-mask[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  border-radius: 12px;\n  z-index: 2;\n}\n.data-biometrics-container__face-mask--full-width[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}\n.data-biometrics-container__face-mask--full-width[_ngcontent-%COMP%]   canvas[_ngcontent-%COMP%] {\n  width: 100% !important;\n  height: 100% !important;\n  object-fit: cover;\n}\n.data-biometrics-container__loading-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  width: 100%;\n  height: 100%;\n  background: var(--zns-theme-background, #ffffff);\n  opacity: 0.9;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  border-radius: 12px;\n  z-index: 10;\n  pointer-events: none;\n}\n.data-biometrics-container__error[_ngcontent-%COMP%] {\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  border-radius: 8px;\n  padding: 16px;\n  margin: 0 16px 16px 16px;\n}\n.data-biometrics-container__error-title[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--zns-theme-error, #dc362e);\n  margin-bottom: 4px;\n}\n.data-biometrics-container__error-subtitle[_ngcontent-%COMP%] {\n  color: #601410;\n  font-size: 14px;\n}\n.data-biometrics-container__instructions-status[_ngcontent-%COMP%] {\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  border-radius: 8px;\n  padding: 16px;\n  margin: 0 16px 16px 16px;\n}\n.data-biometrics-container__instructions-status-title[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: #3998d3;\n  margin-bottom: 4px;\n}\n.data-biometrics-container__instructions-status-subtitle[_ngcontent-%COMP%] {\n  color: #004a77;\n  font-size: 14px;\n}\n.data-biometrics-container__api-error[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 40px 16px;\n}\n.data-biometrics-container__api-error-card[_ngcontent-%COMP%] {\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  border: 2px solid var(--zns-theme-border, #e3e3e3);\n  border-radius: 16px;\n  padding: 32px;\n  max-width: 400px;\n  margin: 0 auto;\n}\n.data-biometrics-container__api-error-icon[_ngcontent-%COMP%] {\n  font-size: 48px;\n  width: 48px;\n  height: 48px;\n  margin-bottom: 16px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.data-biometrics-container__api-error-title[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 600;\n  color: var(--zns-theme-error, #dc362e);\n  margin: 0 0 12px 0;\n}\n.data-biometrics-container__api-error-message[_ngcontent-%COMP%] {\n  font-size: 16px;\n  color: #601410;\n  margin: 0 0 24px 0;\n  line-height: 1.5;\n}\n.data-biometrics-container__api-error-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  justify-content: center;\n}\n.data-biometrics-container__processing-message[_ngcontent-%COMP%] {\n  font-size: 16px;\n  color: var(--zns-theme-text-muted, #96939e);\n  text-align: center;\n  display: block;\n  margin-top: 160px;\n}\n.data-biometrics-container__error-camera[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 60px 16px;\n  max-width: 400px;\n  margin: 0 auto;\n}\n.data-biometrics-container__error-camera-image[_ngcontent-%COMP%] {\n  width: 120px;\n  height: 120px;\n  margin-bottom: 24px;\n}\n.data-biometrics-container__error-camera-title[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n  margin: 0 0 12px 0;\n}\n.data-biometrics-container__error-camera-description[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text-muted, #96939e);\n  font-size: 14px;\n  margin: 0 0 24px 0;\n}\n.data-biometrics-container__permission[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 60px 16px;\n  max-width: 400px;\n  margin: 0 auto;\n}\n.data-biometrics-container__permission-icon[_ngcontent-%COMP%] {\n  font-size: 48px;\n  width: 48px;\n  height: 48px;\n  margin-bottom: 24px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.data-biometrics-container__permission-title[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n  margin: 0 0 12px 0;\n}\n.data-biometrics-container__permission-description[_ngcontent-%COMP%] {\n  color: var(--zns-theme-text-muted, #96939e);\n  font-size: 14px;\n  margin: 0 0 24px 0;\n}\n.data-biometrics-container__btn[_ngcontent-%COMP%] {\n  padding: 12px 24px;\n  border: none;\n  border-radius: 8px;\n  font-size: 14px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n}\n.data-biometrics-container__btn--retry[_ngcontent-%COMP%] {\n  background: var(--zns-theme-button, #181818);\n  color: var(--zns-theme-button-text, #ffffff);\n}\n.data-biometrics-container__btn--retry[_ngcontent-%COMP%]:hover {\n  background: var(--zns-theme-button-hover, #ff5721);\n  transform: translateY(-1px);\n}\n.data-biometrics-container__btn--back[_ngcontent-%COMP%] {\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  color: var(--zns-theme-text, #181818);\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n}\n.data-biometrics-container__btn--back[_ngcontent-%COMP%]:hover {\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n}\n\n  .data-biometrics-container webcam {\n  display: block !important;\n  padding: 0 !important;\n  margin: 0 !important;\n  border: none !important;\n}\n  .data-biometrics-container webcam video {\n  padding: 0 !important;\n  margin: 0 !important;\n  border: none !important;\n  object-fit: contain !important;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvemVsZi1rZXlzL3NoYXJlZC9kYXRhLWJpb21ldHJpY3MvZGF0YS1iaW9tZXRyaWNzLmNvbXBvbmVudC5zY3NzIiwid2VicGFjazovLy4vc3JjL3N0eWxlcy9fdmFyaWFibGVzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxnQkFBQTtFQUNBLDBEQ3lCdUI7RUR4QnZCLHVFQ21CYztFRGxCZCw0QkFBQTtFQUNBLFlBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7QUFESjtBQUdJO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLGdCQUFBO0VBQ0EsT0FBQTtFQUNBLGdCQUFBO0FBRFI7QUFJSTtFQUNJLGtCQUFBO0VBQ0EsZUFBQTtBQUZSO0FBSVE7RUFDSSwyQ0NNSztFRExMLGVBQUE7RUFDQSxnQkFBQTtBQUZaO0FBTUk7RUFDSSxrQkFBQTtFQUNBLFdBQUE7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7QUFKUjtBQU1RO0VBQ0ksa0JBQUE7RUFDQSxtQkFBQTtFQUNBLG1CQUFBO0VBQ0EsZ0JBQUE7QUFKWjtBQU1ZO0VBQ0ksa0JBQUE7RUFDQSxnQkFBQTtFQUNBLGFBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7QUFKaEI7QUFPWTtFQUNJLGtCQUFBO0VBQ0EsbUJBQUE7RUFDQSxjQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7QUFMaEI7QUFTUTtFQUNJLG1CQUFBO0FBUFo7QUFXSTtFQUNJLGtCQUFBO0VBQ0EsTUFBQTtFQUNBLE9BQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLG9CQUFBO0VBQ0EsbUJBQUE7RUFDQSxVQUFBO0FBVFI7QUFXUTtFQUNJLGtCQUFBO0VBQ0EsTUFBQTtFQUNBLE9BQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtBQVRaO0FBV1k7RUFDSSxzQkFBQTtFQUNBLHVCQUFBO0VBQ0EsaUJBQUE7QUFUaEI7QUFjSTtFQUNJLGtCQUFBO0VBQ0EsTUFBQTtFQUNBLE9BQUE7RUFDQSxRQUFBO0VBQ0EsU0FBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0EsZ0RDM0VVO0VENEVWLFlBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFDQSxXQUFBO0VBQ0Esb0JBQUE7QUFaUjtBQWVJO0VBQ0ksMERDdEZtQjtFRHVGbkIsa0RBQUE7RUFDQSxrQkFBQTtFQUNBLGFBQUE7RUFDQSx3QkFBQTtBQWJSO0FBZVE7RUFDSSxnQkFBQTtFQUNBLHNDQ2xISjtFRG1ISSxrQkFBQTtBQWJaO0FBZ0JRO0VBQ0ksY0N0SEE7RUR1SEEsZUFBQTtBQWRaO0FBa0JJO0VBQ0ksMERDekdtQjtFRDBHbkIsa0RBQUE7RUFDQSxrQkFBQTtFQUNBLGFBQUE7RUFDQSx3QkFBQTtBQWhCUjtBQWtCUTtFQUNJLGdCQUFBO0VBQ0EsY0M3SEw7RUQ4SEssa0JBQUE7QUFoQlo7QUFtQlE7RUFDSSxjQ2pJRDtFRGtJQyxlQUFBO0FBakJaO0FBcUJJO0VBQ0ksa0JBQUE7RUFDQSxrQkFBQTtBQW5CUjtBQXFCUTtFQUNJLDBEQ2hJZTtFRGlJZixrREFBQTtFQUNBLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtBQW5CWjtBQXNCUTtFQUNJLGVBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLG1CQUFBO0VBQ0Esb0JBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0FBcEJaO0FBdUJRO0VBQ0ksZUFBQTtFQUNBLGdCQUFBO0VBQ0Esc0NDektKO0VEMEtJLGtCQUFBO0FBckJaO0FBd0JRO0VBQ0ksZUFBQTtFQUNBLGNDOUtBO0VEK0tBLGtCQUFBO0VBQ0EsZ0JBQUE7QUF0Qlo7QUF5QlE7RUFDSSxhQUFBO0VBQ0EsU0FBQTtFQUNBLHVCQUFBO0FBdkJaO0FBMkJJO0VBQ0ksZUFBQTtFQUNBLDJDQ3RLUztFRHVLVCxrQkFBQTtFQUNBLGNBQUE7RUFDQSxpQkFBQTtBQXpCUjtBQTRCSTtFQUNJLGtCQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7QUExQlI7QUE0QlE7RUFDSSxZQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0FBMUJaO0FBNkJRO0VBQ0ksZUFBQTtFQUNBLGdCQUFBO0VBQ0EscUNDNUxBO0VENkxBLGtCQUFBO0FBM0JaO0FBOEJRO0VBQ0ksMkNDaE1LO0VEaU1MLGVBQUE7RUFDQSxrQkFBQTtBQTVCWjtBQWdDSTtFQUNJLGtCQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7QUE5QlI7QUFnQ1E7RUFDSSxlQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxtQkFBQTtFQUNBLG9CQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtBQTlCWjtBQWlDUTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHFDQzFOQTtFRDJOQSxrQkFBQTtBQS9CWjtBQWtDUTtFQUNJLDJDQzlOSztFRCtOTCxlQUFBO0VBQ0Esa0JBQUE7QUFoQ1o7QUFvQ0k7RUFDSSxrQkFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSx5QkFBQTtBQWxDUjtBQW9DUTtFQUNJLDRDQ3hPRTtFRHlPRiw0Q0N4T007QURzTWxCO0FBb0NZO0VBQ0ksa0RDMU9HO0VEMk9ILDJCQUFBO0FBbENoQjtBQXNDUTtFQUNJLDBEQzNQZTtFRDRQZixxQ0MxUEE7RUQyUEEsa0RBQUE7QUFwQ1o7QUFzQ1k7RUFDSSwwRENoUVc7QUQ0TjNCOztBQTZDUTtFQUNJLHlCQUFBO0VBR0EscUJBQUE7RUFDQSxvQkFBQTtFQUNBLHVCQUFBO0FBNUNaO0FBK0NZO0VBQ0kscUJBQUE7RUFDQSxvQkFBQTtFQUNBLHVCQUFBO0VBQ0EsOEJBQUE7QUE3Q2hCIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcIi4uLy4uLy4uLy4uL3N0eWxlcy92YXJpYWJsZXNcIjtcblxuLmRhdGEtYmlvbWV0cmljcy1jb250YWluZXIge1xuICAgIG1pbi1oZWlnaHQ6IGF1dG87XG4gICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk7XG4gICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgIGJvcmRlci1yYWRpdXM6IDEycHggMTJweCAwIDA7XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblxuICAgICZfX2NvbnRlbnQge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgbWluLWhlaWdodDogYXV0bztcbiAgICAgICAgZmxleDogMTtcbiAgICAgICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICB9XG5cbiAgICAmX19pbnN0cnVjdGlvbnMge1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIHBhZGRpbmc6IDAgMTZweDtcblxuICAgICAgICAmLXRleHQge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMS40O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fY2FtZXJhIHtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgcGFkZGluZzogMCAxNnB4O1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAmLXZpZXcge1xuICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICAgICAgbWFyZ2luOiAwIGF1dG8gMTZweDtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuXG4gICAgICAgICAgICAmLS1mdWxsLXdpZHRoIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICAgICAgd2lkdGg6IGF1dG87IC8vIExldCB3aWR0aCBiZSBkZXRlcm1pbmVkIGJ5IHdlYmNhbSBjb21wb25lbnRcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGF1dG87IC8vIExldCBoZWlnaHQgYmUgZGV0ZXJtaW5lZCBieSB3ZWJjYW0gY29tcG9uZW50XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdlYmNhbSB7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgICAgICAgICAgd2lkdGg6IGF1dG87XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBhdXRvO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJi1zdGF0dXMge1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTZweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2ZhY2UtbWFzayB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgdG9wOiAwO1xuICAgICAgICBsZWZ0OiAwO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgei1pbmRleDogMjtcblxuICAgICAgICAmLS1mdWxsLXdpZHRoIHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgIHRvcDogMDtcbiAgICAgICAgICAgIGxlZnQ6IDA7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgICAgICAgIC8vIEVuc3VyZSBjYW52YXMgbWF0Y2hlcyB2aWRlbyBkaW1lbnNpb25zIGV4YWN0bHlcbiAgICAgICAgICAgIGNhbnZhcyB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCUgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDEwMCUgIWltcG9ydGFudDtcbiAgICAgICAgICAgICAgICBvYmplY3QtZml0OiBjb3ZlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2xvYWRpbmctb3ZlcmxheSB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgdG9wOiAwO1xuICAgICAgICBsZWZ0OiAwO1xuICAgICAgICByaWdodDogMDtcbiAgICAgICAgYm90dG9tOiAwO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZDtcbiAgICAgICAgb3BhY2l0eTogMC45O1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgei1pbmRleDogMTA7XG4gICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lOyAvLyBBbGxvdyBjbGlja3MgdG8gcGFzcyB0aHJvdWdoXG4gICAgfVxuXG4gICAgJl9fZXJyb3Ige1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICBwYWRkaW5nOiAxNnB4O1xuICAgICAgICBtYXJnaW46IDAgMTZweCAxNnB4IDE2cHg7XG5cbiAgICAgICAgJi10aXRsZSB7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kZXJyb3I7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiA0cHg7XG4gICAgICAgIH1cblxuICAgICAgICAmLXN1YnRpdGxlIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJGVycm9yRGFyaztcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2luc3RydWN0aW9ucy1zdGF0dXMge1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICBwYWRkaW5nOiAxNnB4O1xuICAgICAgICBtYXJnaW46IDAgMTZweCAxNnB4IDE2cHg7XG5cbiAgICAgICAgJi10aXRsZSB7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kaW5mbztcbiAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDRweDtcbiAgICAgICAgfVxuXG4gICAgICAgICYtc3VidGl0bGUge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kaW5mb0Rhcms7XG4gICAgICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19hcGktZXJyb3Ige1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIHBhZGRpbmc6IDQwcHggMTZweDtcblxuICAgICAgICAmLWNhcmQge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk7XG4gICAgICAgICAgICBib3JkZXI6IDJweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyO1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDMycHg7XG4gICAgICAgICAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICAgICAgICAgICAgbWFyZ2luOiAwIGF1dG87XG4gICAgICAgIH1cblxuICAgICAgICAmLWljb24ge1xuICAgICAgICAgICAgZm9udC1zaXplOiA0OHB4O1xuICAgICAgICAgICAgd2lkdGg6IDQ4cHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDQ4cHg7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAxNnB4O1xuICAgICAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIH1cblxuICAgICAgICAmLXRpdGxlIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMjBweDtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvcjtcbiAgICAgICAgICAgIG1hcmdpbjogMCAwIDEycHggMDtcbiAgICAgICAgfVxuXG4gICAgICAgICYtbWVzc2FnZSB7XG4gICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvckRhcms7XG4gICAgICAgICAgICBtYXJnaW46IDAgMCAyNHB4IDA7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMS41O1xuICAgICAgICB9XG5cbiAgICAgICAgJi1hY3Rpb25zIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBnYXA6IDEycHg7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3Byb2Nlc3NpbmctbWVzc2FnZSB7XG4gICAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgIG1hcmdpbi10b3A6IDE2MHB4O1xuICAgIH1cblxuICAgICZfX2Vycm9yLWNhbWVyYSB7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgcGFkZGluZzogNjBweCAxNnB4O1xuICAgICAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICAgICAgICBtYXJnaW46IDAgYXV0bztcblxuICAgICAgICAmLWltYWdlIHtcbiAgICAgICAgICAgIHdpZHRoOiAxMjBweDtcbiAgICAgICAgICAgIGhlaWdodDogMTIwcHg7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyNHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgJi10aXRsZSB7XG4gICAgICAgICAgICBmb250LXNpemU6IDIwcHg7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgbWFyZ2luOiAwIDAgMTJweCAwO1xuICAgICAgICB9XG5cbiAgICAgICAgJi1kZXNjcmlwdGlvbiB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgIG1hcmdpbjogMCAwIDI0cHggMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX3Blcm1pc3Npb24ge1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIHBhZGRpbmc6IDYwcHggMTZweDtcbiAgICAgICAgbWF4LXdpZHRoOiA0MDBweDtcbiAgICAgICAgbWFyZ2luOiAwIGF1dG87XG5cbiAgICAgICAgJi1pY29uIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogNDhweDtcbiAgICAgICAgICAgIHdpZHRoOiA0OHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiA0OHB4O1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjRweDtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgJi10aXRsZSB7XG4gICAgICAgICAgICBmb250LXNpemU6IDIwcHg7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgbWFyZ2luOiAwIDAgMTJweCAwO1xuICAgICAgICB9XG5cbiAgICAgICAgJi1kZXNjcmlwdGlvbiB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgIG1hcmdpbjogMCAwIDI0cHggMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2J0biB7XG4gICAgICAgIHBhZGRpbmc6IDEycHggMjRweDtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xuXG4gICAgICAgICYtLXJldHJ5IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b247XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQ7XG5cbiAgICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlcjtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTFweCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmLS1iYWNrIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcblxuICAgICAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIE92ZXJyaWRlIHdlYmNhbSBjb21wb25lbnQgc3R5bGVzIGZvciBib3R0b20gc2hlZXRcbjo6bmctZGVlcCB7XG4gICAgLmRhdGEtYmlvbWV0cmljcy1jb250YWluZXIge1xuICAgICAgICB3ZWJjYW0ge1xuICAgICAgICAgICAgZGlzcGxheTogYmxvY2sgIWltcG9ydGFudDtcblxuICAgICAgICAgICAgLy8gUmVtb3ZlIGFueSBkZWZhdWx0IHBhZGRpbmcvbWFyZ2luIHRoYXQgbWlnaHQgY2F1c2UgdGhlIDZweCBkaWZmZXJlbmNlXG4gICAgICAgICAgICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBtYXJnaW46IDAgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGJvcmRlcjogbm9uZSAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICAvLyBMZXQgdGhlIHZpZGVvIGVsZW1lbnQgdXNlIHRoZSBkaW1lbnNpb25zIGZyb20gdGhlIHdlYmNhbSBjb21wb25lbnRcbiAgICAgICAgICAgIHZpZGVvIHtcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAwICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgbWFyZ2luOiAwICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgYm9yZGVyOiBub25lICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICAgICAgb2JqZWN0LWZpdDogY29udGFpbiAhaW1wb3J0YW50OyAvLyBVc2UgY29udGFpbiB0byBtYWludGFpbiBhc3BlY3QgcmF0aW9cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIiRwcmltYXJ5Q29sb3I6IHZhcigtLXpucy10aGVtZS1wcmltYXJ5LCAjMTgxODE4KTtcbiRwcmltYXJ5TGlnaHQ6ICNkYWRkZmE7XG4kc2Vjb25kYXJ5Q29sb3I6IHZhcigtLXpucy10aGVtZS1zZWNvbmRhcnksICNmZjU3MjEpO1xuJHNlY29uZGFyeUNvbG9yTGlnaHQ6ICNmNmU1ZTA7XG5cbiRjb3JyZWN0OiB2YXIoLS16bnMtdGhlbWUtc3VjY2VzcywgIzFlYTQ0Nik7XG4kY29ycmVjdERhcms6ICMwZjUyMjM7XG4kY29ycmVjdExpZ2h0OiB2YXIoLS16bnMtdGhlbWUtc3VjY2Vzcy10ZXh0LCAjZTdmOGVkKTtcblxuJGVycm9yOiB2YXIoLS16bnMtdGhlbWUtZXJyb3IsICNkYzM2MmUpO1xuJGVycm9yRGFyazogIzYwMTQxMDtcbiRlcnJvckxpZ2h0OiB2YXIoLS16bnMtdGhlbWUtZXJyb3ItdGV4dCwgI2ZjZWVlZSk7XG5cbiR3YXJuaW5nOiB2YXIoLS16bnMtdGhlbWUtd2FybmluZywgI2RlNjgwMCk7XG4kd2FybmluZ0Rhcms6ICM0YTIxMGE7XG4kd2FybmluZ0xpZ2h0OiB2YXIoLS16bnMtdGhlbWUtd2FybmluZy10ZXh0LCAjZmZlZWU5KTtcblxuJGluZm86ICMzOTk4ZDM7XG4kaW5mb0Rhcms6ICMwMDRhNzc7XG4kaW5mb0xpZ2h0OiAjZWNmM2ZlO1xuXG4kYmxhY2s6ICMxODE4MTg7XG4kd2hpdGU6ICNmZmZmZmY7XG5cbiR0aGVtZUJvZHlGYW1pbHk6IHZhcigtLXpucy10aGVtZS1ib2R5LWZhbWlseSwgXCJQb3BwaW5zXCIsIEFyaWFsLCBzYW5zLXNlcmlmKTtcbiR0aGVtZVRpdGxlRmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtdGl0bGUtZmFtaWx5LCBcIk1lbmRhXCIsIFwiQXJpYWwgQmxhY2tcIiwgc2Fucy1zZXJpZik7XG4kdGhlbWVNb25vc3BhY2VGYW1pbHk6IHZhcigtLXpucy10aGVtZS1tb25vc3BhY2UtZmFtaWx5LCBcIkNvdXJpZXIgTmV3XCIsIENvdXJpZXIsIG1vbm9zcGFjZSk7XG5cbiR0aGVtZUJhY2tncm91bmQ6IHZhcigtLXpucy10aGVtZS1iYWNrZ3JvdW5kLCAjZmZmZmZmKTtcbiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS1iYWNrZ3JvdW5kLXNlY29uZGFyeSwgI2Y5ZjlmYyk7XG5cbiR0aGVtZVRleHQ6IHZhcigtLXpucy10aGVtZS10ZXh0LCAjMTgxODE4KTtcbiR0aGVtZVRleHRNdXRlZDogdmFyKC0tem5zLXRoZW1lLXRleHQtbXV0ZWQsICM5NjkzOWUpO1xuJHRoZW1lVGV4dFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLXRleHQtc2Vjb25kYXJ5LCAjNzM3NzdmKTtcblxuJHRoZW1lSGVhZGVyOiB2YXIoLS16bnMtdGhlbWUtaGVhZGVyLCAjMTgxODE4KTtcbiR0aGVtZUhlYWRlclRleHQ6IHZhcigtLXpucy10aGVtZS1oZWFkZXItdGV4dCwgI2ZmZmZmZik7XG5cbiR0aGVtZUJ1dHRvbjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbiwgIzE4MTgxOCk7XG4kdGhlbWVCdXR0b25UZXh0OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXRleHQsICNmZmZmZmYpO1xuJHRoZW1lQnV0dG9uSG92ZXI6IHZhcigtLXpucy10aGVtZS1idXR0b24taG92ZXIsICNmZjU3MjEpO1xuXG4kdGhlbWVCdXR0b25TZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LCAjZTllY2VmKTtcbiR0aGVtZUJ1dHRvblNlY29uZGFyeVRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LXRleHQsICM0OTUwNTcpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5SG92ZXI6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LWhvdmVyLCAjZTllY2VmKTtcblxuJHRoZW1lQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtYm9yZGVyLCAjZTNlM2UzKTtcbiR0aGVtZUJvcmRlckhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYm9yZGVyLWhvdmVyLCAjYzNjNmNmKTtcblxuJHRoZW1lQ2FyZDogdmFyKC0tem5zLXRoZW1lLWNhcmQsICNmZmZmZmYpO1xuJHRoZW1lQ2FyZEJvcmRlcjogdmFyKC0tem5zLXRoZW1lLWNhcmQtYm9yZGVyLCAjZWVlZGYxKTtcblxuJHRoZW1lU2hhZG93OiB2YXIoLS16bnMtdGhlbWUtc2hhZG93LCByZ2JhKDAsIDAsIDAsIDAuMSkpO1xuXG4kc21vb3RoQmV6aWVyOiBjdWJpYy1iZXppZXIoMC4yNSwgMC40LCAwLjcsIDEpO1xuXG4kbWF4RXh0cmFTbWFsbDogNTk1cHg7XG4kbWluU21hbGw6IDYwMHB4O1xuJG1lZGl1bTogNzY4cHg7XG4kbGFyZ2U6IDg4OXB4O1xuJGNvbXB1dGVyczogMTIwMHB4O1xuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }

}]);
//# sourceMappingURL=default-src_app_zelf-keys_shared_biometrics-bottom-sheet_biometrics-bottom-sheet_component_ts.js.map