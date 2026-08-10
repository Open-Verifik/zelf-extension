"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_zelf-keys_zelf-keys-passwords_zelf-keys-password-form_zelf-keys-password-form_component_ts"],{

/***/ 8327
/*!********************************************************!*\
  !*** ./src/app/services/password-generator.service.ts ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PasswordGeneratorService: () => (/* binding */ PasswordGeneratorService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 34205);

class PasswordGeneratorService {
  UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
  NUMBERS = "0123456789";
  SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  MEMORABLE_WORDS = ["apple", "banana", "cherry", "dolphin", "elephant", "forest", "guitar", "harbor", "island", "jungle", "knight", "lighthouse", "mountain", "nebula", "ocean", "penguin", "quasar", "rainbow", "sunset", "tiger", "umbrella", "volcano", "whale", "xylophone", "yacht", "zebra"];
  /**
   * Generate a password using the specified algorithm
   */
  generatePassword(options = {}) {
    const algorithm = options.algorithm || "strong";
    const length = options.length || this.getDefaultLength(algorithm);
    switch (algorithm) {
      case "strong":
        return this.generateStrongPassword(length, options);
      case "memorable":
        return this.generateMemorablePassword(length);
      case "numeric":
        return this.generateNumericPassword(length);
      case "alphanumeric":
        return this.generateAlphanumericPassword(length);
      case "symbolic":
        return this.generateSymbolicPassword(length, options);
      default:
        return this.generateStrongPassword(length, options);
    }
  }
  /**
   * Generate a strong password with mixed characters
   */
  generateStrongPassword(length, options) {
    const includeUppercase = options.includeUppercase !== false;
    const includeLowercase = options.includeLowercase !== false;
    const includeNumbers = options.includeNumbers !== false;
    const includeSymbols = options.includeSymbols !== false;
    let charset = "";
    if (includeUppercase) charset += this.UPPERCASE;
    if (includeLowercase) charset += this.LOWERCASE;
    if (includeNumbers) charset += this.NUMBERS;
    if (includeSymbols) charset += this.SYMBOLS;
    // Ensure at least one character from each selected type
    let password = "";
    if (includeUppercase) password += this.getRandomChar(this.UPPERCASE);
    if (includeLowercase) password += this.getRandomChar(this.LOWERCASE);
    if (includeNumbers) password += this.getRandomChar(this.NUMBERS);
    if (includeSymbols) password += this.getRandomChar(this.SYMBOLS);
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += this.getRandomChar(charset);
    }
    // Shuffle the password
    return this.shuffleString(password);
  }
  /**
   * Generate a memorable password using words and numbers
   */
  generateMemorablePassword(length) {
    const wordCount = Math.floor(length / 8); // Approximately one word per 8 chars
    const words = [];
    for (let i = 0; i < wordCount; i++) {
      const word = this.getRandomElement(this.MEMORABLE_WORDS);
      // Capitalize first letter of each word
      words.push(word.charAt(0).toUpperCase() + word.slice(1));
    }
    // Add numbers between words
    const numbers = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
    const password = words.join("") + numbers.toString();
    // If still too short, pad with random characters
    if (password.length < length) {
      const padding = this.generateAlphanumericPassword(length - password.length);
      return this.shuffleString(password + padding);
    }
    return password.substring(0, length);
  }
  /**
   * Generate a numeric-only password
   */
  generateNumericPassword(length) {
    let password = "";
    for (let i = 0; i < length; i++) {
      password += this.getRandomChar(this.NUMBERS);
    }
    return password;
  }
  /**
   * Generate an alphanumeric password (letters and numbers)
   */
  generateAlphanumericPassword(length) {
    const charset = this.UPPERCASE + this.LOWERCASE + this.NUMBERS;
    let password = "";
    // Ensure at least one uppercase, lowercase, and number
    password += this.getRandomChar(this.UPPERCASE);
    password += this.getRandomChar(this.LOWERCASE);
    password += this.getRandomChar(this.NUMBERS);
    // Fill the rest
    for (let i = password.length; i < length; i++) {
      password += this.getRandomChar(charset);
    }
    return this.shuffleString(password);
  }
  /**
   * Generate a password with symbols
   */
  generateSymbolicPassword(length, options) {
    const includeUppercase = options.includeUppercase !== false;
    const includeLowercase = options.includeLowercase !== false;
    const includeNumbers = options.includeNumbers !== false;
    let charset = this.SYMBOLS;
    if (includeUppercase) charset += this.UPPERCASE;
    if (includeLowercase) charset += this.LOWERCASE;
    if (includeNumbers) charset += this.NUMBERS;
    let password = this.getRandomChar(this.SYMBOLS); // Ensure at least one symbol
    if (includeUppercase) password += this.getRandomChar(this.UPPERCASE);
    if (includeLowercase) password += this.getRandomChar(this.LOWERCASE);
    if (includeNumbers) password += this.getRandomChar(this.NUMBERS);
    // Fill the rest
    for (let i = password.length; i < length; i++) {
      password += this.getRandomChar(charset);
    }
    return this.shuffleString(password);
  }
  /**
   * Get default length for algorithm
   */
  getDefaultLength(algorithm) {
    switch (algorithm) {
      case "strong":
        return 16;
      case "memorable":
        return 20;
      case "numeric":
        return 12;
      case "alphanumeric":
        return 16;
      case "symbolic":
        return 16;
      default:
        return 16;
    }
  }
  /**
   * Get a random character from a string
   */
  getRandomChar(charset) {
    return charset.charAt(Math.floor(Math.random() * charset.length));
  }
  /**
   * Get a random element from an array
   */
  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  /**
   * Shuffle a string randomly
   */
  shuffleString(str) {
    const array = str.split("");
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
  }
  /**
   * Get algorithm display name
   */
  getAlgorithmName(algorithm) {
    const names = {
      strong: "Strong",
      memorable: "Memorable",
      numeric: "Numeric",
      alphanumeric: "Alphanumeric",
      symbolic: "Symbolic"
    };
    return names[algorithm] || "Strong";
  }
  /**
   * Get algorithm description
   */
  getAlgorithmDescription(algorithm) {
    const descriptions = {
      strong: "Mix of letters, numbers, and symbols",
      memorable: "Easy to remember words with numbers",
      numeric: "Numbers only",
      alphanumeric: "Letters and numbers only",
      symbolic: "Includes special symbols"
    };
    return descriptions[algorithm] || "Mix of letters, numbers, and symbols";
  }
  /**
   * Get all available algorithms
   */
  getAvailableAlgorithms() {
    return ["strong", "memorable", "numeric", "alphanumeric", "symbolic"];
  }
  static ɵfac = function PasswordGeneratorService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || PasswordGeneratorService)();
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
    token: PasswordGeneratorService,
    factory: PasswordGeneratorService.ɵfac,
    providedIn: "root"
  });
}

/***/ },

/***/ 97699
/*!************************************************************************************************************!*\
  !*** ./src/app/zelf-keys/zelf-keys-passwords/zelf-keys-password-form/zelf-keys-password-form.component.ts ***!
  \************************************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PasswordFormComponent: () => (/* binding */ PasswordFormComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core/rxjs-interop */ 49074);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/dialog */ 57760);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 34487);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var _shared_biometrics_bottom_sheet_biometrics_bottom_sheet_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../shared/biometrics-bottom-sheet/biometrics-bottom-sheet.component */ 70415);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var _services_autofill_data_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../services/autofill-data.service */ 45291);
/* harmony import */ var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/bottom-sheet */ 15244);
/* harmony import */ var _services_data_passing_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../../services/data-passing.service */ 59284);
/* harmony import */ var app_http_wrapper_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! app/http-wrapper.service */ 84099);
/* harmony import */ var _services_password_generator_service__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../../services/password-generator.service */ 8327);
/* harmony import */ var app_solana_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! app/solana.service */ 98010);
/* harmony import */ var app_wallet_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! app/wallet.service */ 69556);






















const _c0 = ["znsCostModal"];
const _c1 = a0 => ({
  walletName: a0
});
function PasswordFormComponent_div_0_ng_container_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainer"](0);
  }
}
function PasswordFormComponent_div_0_div_50_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function PasswordFormComponent_div_0_div_50_button_1_Template_button_click_0_listener() {
      const algorithm_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r3).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
      ctx_r1.switchAlgorithm(algorithm_r4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.showPasswordGenerator = false);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "div", 59)(2, "span", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "span", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const algorithm_r4 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassProp"]("active", ctx_r1.currentAlgorithm === algorithm_r4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.getAlgorithmName(algorithm_r4));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.getAlgorithmDescription(algorithm_r4));
  }
}
function PasswordFormComponent_div_0_div_50_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](1, PasswordFormComponent_div_0_div_50_button_1_Template, 6, 4, "button", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngForOf", ctx_r1.getAvailableAlgorithms());
  }
}
function PasswordFormComponent_div_0_div_58_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 62)(1, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "input", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    const t_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("placeholder", t_r5("billing.passwords.form.folder.placeholder"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassProp"]("zelf-input__character-count--warning", (((tmp_7_0 = ctx_r1.passwordForm.get("folder")) == null ? null : tmp_7_0.value == null ? null : tmp_7_0.value.length) || 0) > 15)("zelf-input__character-count--error", (((tmp_8_0 = ctx_r1.passwordForm.get("folder")) == null ? null : tmp_8_0.value == null ? null : tmp_8_0.value.length) || 0) === 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ((tmp_9_0 = ctx_r1.passwordForm.get("folder")) == null ? null : tmp_9_0.value == null ? null : tmp_9_0.value.length) || 0, "/20 ");
  }
}
function PasswordFormComponent_div_0_div_59_ng_container_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainer"](0);
  }
}
function PasswordFormComponent_div_0_div_59_small_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "small", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r5("billing.passwords.form.master_password.hint", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction1"](1, _c1, ctx_r1.wallet.name)));
  }
}
function PasswordFormComponent_div_0_div_59_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 64)(1, "h3", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](4, "input", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](5, "label", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](7, "button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function PasswordFormComponent_div_0_div_59_Template_button_click_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r6);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.toggleMasterPasswordVisibility());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](8, PasswordFormComponent_div_0_div_59_ng_container_8_Template, 1, 0, "ng-container", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](9, PasswordFormComponent_div_0_div_59_small_9_Template, 2, 3, "small", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    const openEye_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵreference"](4);
    const closedEye_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵreference"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r5("billing.passwords.form.master_password.section_title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("type", ctx_r1.showMasterPassword ? "text" : "password");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵattribute"]("autocorrect", "off");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r5("billing.passwords.form.master_password.label"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngTemplateOutlet", ctx_r1.showMasterPassword ? closedEye_r8 : openEye_r7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.wallet);
  }
}
function PasswordFormComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 4)(1, "div", 5)(2, "button", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function PasswordFormComponent_div_0_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.onCancel());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "svg", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](4, "path", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](5, "h2");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](7, "div", 9)(8, "div", 10)(9, "div", 11)(10, "div", 12)(11, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](12, "input", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](13, "label", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](15, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](17, "div", 12)(18, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](19, "input", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](20, "label", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](21);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](22, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](24, "div", 12)(25, "div", 19)(26, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](27, "input", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](28, "label", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](29);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](30, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](31);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](32, "button", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function PasswordFormComponent_div_0_Template_button_click_32_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.togglePasswordVisibility());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](33, PasswordFormComponent_div_0_ng_container_33_Template, 1, 0, "ng-container", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](34, "div", 25)(35, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function PasswordFormComponent_div_0_Template_button_click_35_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.generatePassword());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](36, "svg", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](37, "path", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](38, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](39, "Generate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](40, "button", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function PasswordFormComponent_div_0_Template_button_click_40_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.regeneratePassword());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](41, "svg", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](42, "path", 30)(43, "path", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](44, "div", 32)(45, "button", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function PasswordFormComponent_div_0_Template_button_click_45_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.togglePasswordGenerator());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](46, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](47);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](48, "svg", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](49, "path", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](50, PasswordFormComponent_div_0_div_50_Template, 2, 1, "div", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](51, "div", 37)(52, "div", 38)(53, "label", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](54);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](55, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function PasswordFormComponent_div_0_Template_div_click_55_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.toggleFolder());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](56, "div", 41)(57, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](58, PasswordFormComponent_div_0_div_58_Template, 5, 6, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](59, PasswordFormComponent_div_0_div_59_Template, 10, 6, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](60, "div", 45)(61, "div", 46)(62, "span", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](63);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](64, "button", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function PasswordFormComponent_div_0_Template_button_click_64_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.openZnsCostModal());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](65);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](66, "div", 49)(67, "span", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](68);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](69, "span", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](70);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](71, "span", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](72);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](73, "div", 53)(74, "button", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function PasswordFormComponent_div_0_Template_button_click_74_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.onCancel());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](75);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](76, "button", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function PasswordFormComponent_div_0_Template_button_click_76_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.onSave());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](77, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](78);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    let tmp_8_0;
    let tmp_9_0;
    let tmp_10_0;
    let tmp_12_0;
    let tmp_13_0;
    let tmp_14_0;
    let tmp_17_0;
    let tmp_18_0;
    let tmp_19_0;
    let tmp_25_0;
    let tmp_26_0;
    let tmp_28_0;
    const t_r5 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    const openEye_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵreference"](4);
    const closedEye_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵreference"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r5("billing.passwords.form.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("formGroup", ctx_r1.passwordForm);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r5("billing.passwords.form.website.label"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassProp"]("zelf-input__character-count--warning", (((tmp_8_0 = ctx_r1.passwordForm.get("url")) == null ? null : tmp_8_0.value == null ? null : tmp_8_0.value.length) || 0) > 56)("zelf-input__character-count--error", (((tmp_9_0 = ctx_r1.passwordForm.get("url")) == null ? null : tmp_9_0.value == null ? null : tmp_9_0.value.length) || 0) === 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ((tmp_10_0 = ctx_r1.passwordForm.get("url")) == null ? null : tmp_10_0.value == null ? null : tmp_10_0.value.length) || 0, "/64 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r5("billing.passwords.form.email.label"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassProp"]("zelf-input__character-count--warning", (((tmp_12_0 = ctx_r1.passwordForm.get("email")) == null ? null : tmp_12_0.value == null ? null : tmp_12_0.value.length) || 0) > 45)("zelf-input__character-count--error", (((tmp_13_0 = ctx_r1.passwordForm.get("email")) == null ? null : tmp_13_0.value == null ? null : tmp_13_0.value.length) || 0) === 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ((tmp_14_0 = ctx_r1.passwordForm.get("email")) == null ? null : tmp_14_0.value == null ? null : tmp_14_0.value.length) || 0, "/50 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("type", ctx_r1.showPassword ? "text" : "password");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r5("billing.passwords.form.password.label"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassProp"]("zelf-input__character-count--warning", (((tmp_17_0 = ctx_r1.passwordForm.get("password")) == null ? null : tmp_17_0.value == null ? null : tmp_17_0.value.length) || 0) > 56)("zelf-input__character-count--error", (((tmp_18_0 = ctx_r1.passwordForm.get("password")) == null ? null : tmp_18_0.value == null ? null : tmp_18_0.value.length) || 0) === 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ((tmp_19_0 = ctx_r1.passwordForm.get("password")) == null ? null : tmp_19_0.value == null ? null : tmp_19_0.value.length) || 0, "/64 ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngTemplateOutlet", ctx_r1.showPassword ? closedEye_r8 : openEye_r7);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassProp"]("active", ctx_r1.showPasswordGenerator);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](ctx_r1.getAlgorithmName(ctx_r1.currentAlgorithm));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.showPasswordGenerator);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r5("billing.passwords.form.folder.label"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassProp"]("zelf-toggle--active", (tmp_25_0 = ctx_r1.passwordForm.get("insideFolder")) == null ? null : tmp_25_0.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵattribute"]("aria-checked", (tmp_26_0 = ctx_r1.passwordForm.get("insideFolder")) == null ? null : tmp_26_0.value)("aria-label", t_r5("billing.passwords.form.folder.aria_label"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", (tmp_28_0 = ctx_r1.passwordForm.get("insideFolder")) == null ? null : tmp_28_0.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r1.hasMasterPassword);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassProp"]("password-form__cost-card--insufficient", !ctx_r1.hasSufficientZns && !ctx_r1.znsBalanceLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r5("billing.passwords.form.zns_cost.strip.eyebrow"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", t_r5("billing.passwords.form.zns_cost.strip.details"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"]("", ctx_r1.costZns, " ZNS");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"]("~$", ctx_r1.costUsd, " USD");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r5("billing.passwords.form.zns_cost.strip.rate"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r5("billing.passwords.form.buttons.cancel"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("disabled", !ctx_r1.formValid || ctx_r1.znsBalanceLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r5("billing.passwords.form.buttons.save"));
  }
}
function PasswordFormComponent_ng_template_1_div_0_div_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 86)(1, "span", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "span", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](5, "number");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r10("billing.passwords.form.zns_cost.modal.balance_label"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassProp"]("zns-cost-modal__balance-amount--low", !ctx_r1.hasSufficientZns);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind2"](5, 4, ctx_r1.znsBalance, "1.2-2"), " ZNS ");
  }
}
function PasswordFormComponent_ng_template_1_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 71)(1, "h3", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "p", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](5, "div", 74)(6, "dl", 75)(7, "div", 76)(8, "dt", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](10, "dd", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](12, "div", 79)(13, "dt", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](15, "dd", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](17, PasswordFormComponent_ng_template_1_div_0_div_17_Template, 6, 7, "div", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](18, "div", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](19, "div", 82)(20, "p", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](21);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](22, "button", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function PasswordFormComponent_ng_template_1_div_0_Template_button_click_22_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r9);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.goToPresale());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](24, "button", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function PasswordFormComponent_ng_template_1_div_0_Template_button_click_24_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r9);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.goToRewards());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](25);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r10 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r10("billing.passwords.form.zns_cost.modal.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r10("billing.passwords.form.zns_cost.modal.body"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r10("billing.passwords.form.zns_cost.modal.rate_label"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r10("billing.passwords.form.zns_cost.modal.price_row"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r10("billing.passwords.form.zns_cost.modal.per_save_label"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r10("billing.passwords.form.zns_cost.modal.save_cost_row"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !ctx_r1.znsBalanceLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](t_r10("billing.passwords.form.zns_cost.modal.get_zns_title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", t_r10("billing.passwords.form.zns_cost.modal.buy_presale"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", t_r10("billing.passwords.form.zns_cost.modal.earn_rewards"), " ");
  }
}
function PasswordFormComponent_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](0, PasswordFormComponent_ng_template_1_div_0_Template, 26, 10, "div", 70);
  }
}
function PasswordFormComponent_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "svg", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "path", 90);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function PasswordFormComponent_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "svg", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](1, "path", 91);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
class PasswordFormComponent {
  _activatedRoute;
  _autofillDataService;
  _bottomSheet;
  _changeDetectorRef;
  _dataPassingService;
  _destroyRef;
  _dialog;
  _formBuilder;
  _httpWrapperService;
  _passwordGeneratorService;
  _router;
  _solanaService;
  _walletService;
  znsCostModalTemplate;
  currentAlgorithm = "strong";
  formValid = false;
  hasMasterPassword = false;
  isNewPassword = true;
  passwordForm;
  shareables;
  showMasterPassword = false;
  showPassword = false;
  showPasswordGenerator = false;
  transformedPasswordData = null;
  view;
  wallet;
  znsBalance = 0;
  znsBalanceLoading = false;
  costZns = _environments_environment__WEBPACK_IMPORTED_MODULE_8__.environment.zelfKeysPasswordSaveZns;
  costUsd = (_environments_environment__WEBPACK_IMPORTED_MODULE_8__.environment.zelfKeysPasswordSaveZns * _environments_environment__WEBPACK_IMPORTED_MODULE_8__.environment.znsUsdPrice).toFixed(2);
  constructor(_activatedRoute, _autofillDataService, _bottomSheet, _changeDetectorRef, _dataPassingService, _destroyRef, _dialog, _formBuilder, _httpWrapperService, _passwordGeneratorService, _router, _solanaService, _walletService) {
    this._activatedRoute = _activatedRoute;
    this._autofillDataService = _autofillDataService;
    this._bottomSheet = _bottomSheet;
    this._changeDetectorRef = _changeDetectorRef;
    this._dataPassingService = _dataPassingService;
    this._destroyRef = _destroyRef;
    this._dialog = _dialog;
    this._formBuilder = _formBuilder;
    this._httpWrapperService = _httpWrapperService;
    this._passwordGeneratorService = _passwordGeneratorService;
    this._router = _router;
    this._solanaService = _solanaService;
    this._walletService = _walletService;
    this.view = this._activatedRoute.snapshot.queryParamMap.get("view") || "home";
    this.shareables = {
      selectedTab: "assets",
      view: this.view,
      wallet: {}
    };
    this._initializeForm();
    this._setupAutofillSubscription();
  }
  ngOnInit() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const id = _this._activatedRoute.snapshot.paramMap.get("id");
      _this.isNewPassword = id === "new";
      yield _this._setWallet();
      _this._loadZnsBalance();
      _this.checkFormValidity();
    })();
  }
  _initializeForm() {
    const useSampleDefaults = !_environments_environment__WEBPACK_IMPORTED_MODULE_8__.environment.production;
    this.passwordForm = this._formBuilder.group({
      email: [useSampleDefaults ? "a@a.com" : "", [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required]],
      folder: [""],
      masterPassword: [""],
      insideFolder: [false],
      password: [useSampleDefaults ? "password_field" : "", [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required]],
      url: [useSampleDefaults ? "https://www.google.com" : "", [_angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required]]
    });
    this.passwordForm.valueChanges.subscribe(() => {
      this.checkFormValidity();
    });
  }
  _setWallet() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const wallet = yield _this2._walletService.getFirstWalletFromStorage();
      if (!wallet?.name) {
        _this2._router.navigate(["/welcome"]);
        return;
      }
      _this2.shareables.wallet = wallet;
      _this2.wallet = wallet;
      _this2.hasMasterPassword = wallet.hasPassword || false;
      _this2._changeDetectorRef.detectChanges();
      _this2.checkFormValidity();
    })();
  }
  _setupAutofillSubscription() {
    this._autofillDataService.urlInfo$.pipe((0,_angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_2__.takeUntilDestroyed)(this._destroyRef)).subscribe(urlInfo => {
      if (!urlInfo) return;
      this._populateFormFromAutofill(urlInfo);
      this._autofillDataService.clearUrlInfo();
    });
  }
  _populateFormFromAutofill(urlInfo) {
    this.passwordForm.patchValue({
      url: urlInfo.href
    });
    if (this.wallet) this._changeDetectorRef.detectChanges();
    this.checkFormValidity();
  }
  _onBiometricsSuccess() {
    this._router.navigate(["/zelf-keys/passwords/result"]);
  }
  _loadZnsBalance() {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this3.znsBalanceLoading = true;
      try {
        const wallet = yield _this3._walletService.getCurrentWallet();
        const solanaAddress = wallet?.publicData?.solanaAddress;
        if (!solanaAddress) return;
        _this3.znsBalance = yield _this3._solanaService.getZnsBalanceViaRpc(solanaAddress);
      } catch {
        _this3.znsBalance = 0;
      } finally {
        _this3.znsBalanceLoading = false;
        _this3._changeDetectorRef.detectChanges();
      }
    })();
  }
  get hasSufficientZns() {
    return !this.znsBalanceLoading && this.znsBalance >= this.costZns;
  }
  openZnsCostModal() {
    this._dialog.open(this.znsCostModalTemplate, {
      maxWidth: "360px",
      panelClass: "zns-cost-dialog"
    });
  }
  goToPresale() {
    window.open("https://zelf.world/presale", "_blank");
  }
  goToRewards() {
    this._dialog.closeAll();
    this._router.navigate(["/rewards"]);
  }
  _openBiometricsBottomSheet() {
    const data = {
      itemData: this.transformedPasswordData,
      itemType: "password",
      mode: "encrypt"
    };
    const bottomSheetRef = this._bottomSheet.open(_shared_biometrics_bottom_sheet_biometrics_bottom_sheet_component__WEBPACK_IMPORTED_MODULE_7__.BiometricsBottomSheetComponent, {
      data,
      backdropClass: "zelf-backdrop",
      panelClass: "zelf-bottom-sheet-biometrics"
    });
    bottomSheetRef.afterDismissed().subscribe(result => {
      if (!result) return;
      this._onBiometricsSuccess();
    });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  toggleMasterPasswordVisibility() {
    this.showMasterPassword = !this.showMasterPassword;
  }
  toggleFolder() {
    const currentValue = this.passwordForm.get("insideFolder")?.value;
    this.passwordForm.patchValue({
      insideFolder: !currentValue
    });
  }
  generatePassword() {
    const password = this._passwordGeneratorService.generatePassword({
      algorithm: this.currentAlgorithm
    });
    this.passwordForm.patchValue({
      password
    });
    this.checkFormValidity();
  }
  regeneratePassword() {
    this.generatePassword();
  }
  switchAlgorithm(algorithm) {
    this.currentAlgorithm = algorithm;
    this.generatePassword();
  }
  getAvailableAlgorithms() {
    return this._passwordGeneratorService.getAvailableAlgorithms();
  }
  getAlgorithmName(algorithm) {
    return this._passwordGeneratorService.getAlgorithmName(algorithm);
  }
  getAlgorithmDescription(algorithm) {
    return this._passwordGeneratorService.getAlgorithmDescription(algorithm);
  }
  togglePasswordGenerator() {
    this.showPasswordGenerator = !this.showPasswordGenerator;
  }
  checkFormValidity() {
    const formValue = this.passwordForm.value;
    const hasUrl = !!formValue.url;
    const hasEmail = !!formValue.email;
    const hasPassword = !!formValue.password;
    const hasMasterPassword = !!formValue.masterPassword;
    // Master password is only required if the wallet has a password
    const masterPasswordValid = this.hasMasterPassword ? hasMasterPassword : true;
    this.formValid = !!(hasUrl && hasEmail && hasPassword && masterPasswordValid);
  }
  onCancel() {
    this._router.navigate(["/zelf-keys/vault"]);
  }
  onSave() {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this4.formValid) return;
      if (!_this4.hasSufficientZns) {
        _this4.openZnsCostModal();
        return;
      }
      const formValue = _this4.passwordForm.value;
      _this4.transformedPasswordData = {
        email: formValue.email,
        folder: formValue.folder,
        insideFolder: formValue.insideFolder,
        masterPassword: yield _this4._httpWrapperService.encryptMessage(formValue.masterPassword),
        password: yield _this4._httpWrapperService.encryptMessage(formValue.password),
        type: "passwords",
        url: formValue.url
      };
      yield _this4._dataPassingService.storeData("passwords", _this4.transformedPasswordData);
      _this4._openBiometricsBottomSheet();
    })();
  }
  static ɵfac = function PasswordFormComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || PasswordFormComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_12__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_services_autofill_data_service__WEBPACK_IMPORTED_MODULE_13__.AutofillDataService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_14__.MatBottomSheet), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_9__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_services_data_passing_service__WEBPACK_IMPORTED_MODULE_15__.DataPassingService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_10__.DestroyRef), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__.MatDialog), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](app_http_wrapper_service__WEBPACK_IMPORTED_MODULE_16__.HttpWrapperService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_services_password_generator_service__WEBPACK_IMPORTED_MODULE_17__.PasswordGeneratorService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_12__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](app_solana_service__WEBPACK_IMPORTED_MODULE_18__.SolanaService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](app_wallet_service__WEBPACK_IMPORTED_MODULE_19__.WalletService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineComponent"]({
    type: PasswordFormComponent,
    selectors: [["zelf-keys-password-form"]],
    viewQuery: function PasswordFormComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵviewQuery"](_c0, 5);
      }
      if (rf & 2) {
        let _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵloadQuery"]()) && (ctx.znsCostModalTemplate = _t.first);
      }
    },
    decls: 7,
    vars: 0,
    consts: [["znsCostModal", ""], ["openEye", ""], ["closedEye", ""], ["class", "password-form", 4, "transloco"], [1, "password-form"], [1, "form-header"], ["mat-flat-button", "", 1, "zelf-icon-button", "zelf-icon-button--secondary", "zelf-icon-button--40", 3, "click"], ["width", "22", "height", "14", "viewBox", "0 0 22 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"], [1, "form-content"], [1, "password-form__form", 3, "formGroup"], [1, "password-form__credentials"], [1, "form-section"], [1, "zelf-input", "zelf-input--wide"], ["formControlName", "url", "id", "url", "maxlength", "75", "required", "", "type", "text", 1, "zelf-input__control", "zelf-input__control--floating-label"], ["for", "url", 1, "zelf-input__floating-label"], [1, "zelf-input__character-count"], ["formControlName", "email", "id", "email", "required", "", "type", "email", "maxlength", "50", 1, "zelf-input__control", "zelf-input__control--floating-label"], ["for", "email", 1, "zelf-input__floating-label"], [1, "password-field-wrapper"], ["formControlName", "password", "id", "password", "maxlength", "64", "required", "", 1, "zelf-input__control", "zelf-input__control--floating-label", 3, "type"], ["for", "password", 1, "zelf-input__floating-label"], [1, "zelf-input__character-count", "zelf-input__character-count--button-offset"], ["type", "button", "tabindex", "-1", 1, "zelf-icon-button", "zelf-icon-button--transparent", 3, "click"], [4, "ngTemplateOutlet"], [1, "password-generator-controls"], ["type", "button", "title", "Generate Password", 1, "password-generator-btn", 3, "click"], ["width", "18", "height", "18", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z", "fill", "currentColor"], ["type", "button", "title", "Regenerate with same algorithm", 1, "password-regenerate-btn", 3, "click"], ["d", "M1 4v6h6M23 20v-6h-6", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], [1, "password-algorithm-selector"], ["type", "button", 1, "algorithm-toggle-btn", 3, "click"], ["width", "12", "height", "12", "viewBox", "0 0 12 8", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M1 1L6 6L11 1", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["class", "algorithm-menu", 4, "ngIf"], [1, "form-section", "form-section--folder"], [1, "folder-toggle"], [1, "form-label"], ["role", "switch", "tabindex", "0", 1, "zelf-toggle", 3, "click"], [1, "zelf-toggle__track"], [1, "zelf-toggle__thumb"], ["class", "folder-input", 4, "ngIf"], ["class", "password-form__wallet-panel", 4, "ngIf"], [1, "password-form__cost-card"], [1, "password-form__cost-card-header"], [1, "password-form__cost-card-eyebrow"], ["type", "button", 1, "password-form__cost-card-details", 3, "click"], [1, "password-form__cost-card-amount"], [1, "password-form__cost-card-zns"], [1, "password-form__cost-card-usd"], [1, "password-form__cost-card-rate"], [1, "form-actions"], [1, "zelf-button", "zelf-button--outlined", 3, "click"], [1, "zelf-button", "zelf-button--primary", 3, "click", "disabled"], [1, "algorithm-menu"], ["type", "button", "class", "algorithm-option", 3, "active", "click", 4, "ngFor", "ngForOf"], ["type", "button", 1, "algorithm-option", 3, "click"], [1, "algorithm-option-content"], [1, "algorithm-name"], [1, "algorithm-description"], [1, "folder-input"], ["formControlName", "folder", "id", "folder", "maxlength", "20", "type", "text", 1, "zelf-input__control", 3, "placeholder"], [1, "password-form__wallet-panel"], [1, "password-form__wallet-panel-title"], ["formControlName", "masterPassword", "id", "masterPassword", "name", "zelfWalletMasterPassword", "autocomplete", "new-password", "autocapitalize", "off", "spellcheck", "false", "required", "", 1, "zelf-input__control", "zelf-input__control--floating-label", 3, "type", "placeholder"], ["for", "masterPassword", 1, "zelf-input__floating-label"], ["class", "password-form__wallet-hint", 4, "ngIf"], [1, "password-form__wallet-hint"], ["class", "zns-cost-modal", 4, "transloco"], [1, "zns-cost-modal"], [1, "zns-cost-modal__title"], [1, "zns-cost-modal__subtitle"], [1, "zns-cost-modal__pricing"], [1, "zns-cost-modal__pricing-list"], [1, "zns-cost-modal__pricing-row"], [1, "zns-cost-modal__pricing-term"], [1, "zns-cost-modal__pricing-value"], [1, "zns-cost-modal__pricing-row", "zns-cost-modal__pricing-row--highlight"], ["class", "zns-cost-modal__balance", 4, "ngIf"], [1, "zns-cost-modal__divider"], [1, "zns-cost-modal__get-zns"], [1, "zns-cost-modal__get-zns-title"], [1, "zelf-button", "zelf-button--primary", "zelf-button--wide", 3, "click"], [1, "zelf-button", "zelf-button--secondary", "zelf-button--wide", 3, "click"], [1, "zns-cost-modal__balance"], [1, "zns-cost-modal__balance-label"], [1, "zns-cost-modal__balance-amount"], ["xmlns", "http://www.w3.org/2000/svg", "height", "24px", "viewBox", "0 -960 960 960", "width", "24px"], ["d", "M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"], ["d", "m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"]],
    template: function PasswordFormComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](0, PasswordFormComponent_div_0_Template, 79, 43, "div", 3)(1, PasswordFormComponent_ng_template_1_Template, 1, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplateRefExtractor"])(3, PasswordFormComponent_ng_template_3_Template, 2, 0, "ng-template", null, 1, _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplateRefExtractor"])(5, PasswordFormComponent_ng_template_5_Template, 2, 0, "ng-template", null, 2, _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplateRefExtractor"]);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgTemplateOutlet, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_6__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_6__.TranslocoDirective, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterModule, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControlName, _angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__.MatDialogModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.DecimalPipe],
    styles: [".password-form[_ngcontent-%COMP%] {\n  max-width: 100%;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  box-sizing: border-box;\n  padding: 8px 4px 24px;\n}\n.password-form__credentials[_ngcontent-%COMP%]   .form-section[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0;\n}\n.password-form__wallet-panel[_ngcontent-%COMP%] {\n  margin-top: 20px;\n  padding: 18px 16px;\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: 16px;\n  background: var(--zns-theme-card, #ffffff);\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);\n}\n.password-form__wallet-panel-title[_ngcontent-%COMP%] {\n  font-size: 16px;\n  font-weight: 700;\n  color: var(--zns-theme-text, #181818);\n  margin: 0 0 14px;\n  line-height: 1.35;\n}\n.password-form__wallet-hint[_ngcontent-%COMP%] {\n  display: block;\n  margin: 10px 0 0;\n  padding: 0 2px;\n  font-size: 12px;\n  color: var(--zns-theme-text-muted, #96939e);\n  line-height: 1.5;\n}\n.password-form[_ngcontent-%COMP%]   .form-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 20px;\n}\n.password-form[_ngcontent-%COMP%]   .form-header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 700;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n  letter-spacing: -0.4px;\n  line-height: 1.2;\n}\n.password-form[_ngcontent-%COMP%]   .form-header[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  transition: transform 0.2s ease;\n}\n.password-form[_ngcontent-%COMP%]   .form-header[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:hover {\n  transform: translateX(-2px);\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  gap: 0;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .form-section[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n  width: 100%;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .form-section--folder[_ngcontent-%COMP%] {\n  margin-top: 4px;\n  margin-bottom: 0;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .form-section[_ngcontent-%COMP%]   .form-label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 14px;\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n  margin-bottom: 12px;\n  width: 100%;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .form-section[_ngcontent-%COMP%]   .form-hint[_ngcontent-%COMP%] {\n  display: block;\n  padding: 0 18px;\n  font-size: 12px;\n  color: var(--zns-theme-text-muted, #96939e);\n  margin: 8px 0 0 0;\n  line-height: 1.5;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .form-section[_ngcontent-%COMP%]   .folder-toggle[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  width: 100%;\n  padding: 4px 0 8px;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .form-section[_ngcontent-%COMP%]   .folder-toggle[_ngcontent-%COMP%]   .form-label[_ngcontent-%COMP%] {\n  flex: 1;\n  margin-right: 16px;\n  margin-bottom: 0;\n  font-size: 15px;\n  font-weight: 600;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .form-section[_ngcontent-%COMP%]   .folder-input[_ngcontent-%COMP%] {\n  margin-top: 8px;\n  animation: _ngcontent-%COMP%_slideDown 0.2s ease-out;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .form-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  align-items: stretch;\n  width: 100%;\n  margin-top: 20px;\n  padding-top: 4px;\n  gap: 12px;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .form-actions[_ngcontent-%COMP%]   .zelf-button[_ngcontent-%COMP%] {\n  flex: 1 1 0;\n  min-width: 0;\n  width: auto;\n  min-height: 48px;\n  padding: 14px 12px;\n  font-weight: 600;\n  font-size: 15px;\n  border-radius: 14px;\n  transition: all 0.2s ease;\n  white-space: nowrap;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .form-actions[_ngcontent-%COMP%]   .zelf-button--primary[_ngcontent-%COMP%] {\n  box-shadow: none;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .form-actions[_ngcontent-%COMP%]   .zelf-button--primary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: none;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .form-actions[_ngcontent-%COMP%]   .zelf-button--outlined[_ngcontent-%COMP%] {\n  background-color: var(--zns-theme-card, #ffffff) !important;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .zelf-input[_ngcontent-%COMP%] {\n  border-radius: 12px;\n  transition: all 0.2s ease;\n  border-color: var(--zns-theme-card-border, #eeedf1);\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .zelf-input[_ngcontent-%COMP%]   .zelf-input__control[_ngcontent-%COMP%] {\n  background: transparent;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .zelf-input[_ngcontent-%COMP%]   .zelf-input__prefix-text[_ngcontent-%COMP%] {\n  border-radius: 8px;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .zelf-input[_ngcontent-%COMP%]:focus-within {\n  border-color: var(--zns-theme-button, #181818);\n  box-shadow: 0 0 0 3px rgba(24, 24, 24, 0.08);\n  background: var(--zns-theme-card, #ffffff);\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .zelf-input[_ngcontent-%COMP%]   input[type=password][_ngcontent-%COMP%], \n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .zelf-input[_ngcontent-%COMP%]   input[type=text][formcontrolname=password][_ngcontent-%COMP%], \n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .zelf-input[_ngcontent-%COMP%]   input[type=text][formcontrolname=masterPassword][_ngcontent-%COMP%], \n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .zelf-input[_ngcontent-%COMP%]   input[formcontrolname=password][_ngcontent-%COMP%], \n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .zelf-input[_ngcontent-%COMP%]   input[formcontrolname=masterPassword][_ngcontent-%COMP%] {\n  padding-right: 56px !important;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .zelf-input[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 20;\n  flex-shrink: 0;\n  pointer-events: auto;\n  cursor: pointer;\n  transition: opacity 0.2s ease;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .zelf-input[_ngcontent-%COMP%]   .zelf-icon-button[_ngcontent-%COMP%]:hover {\n  opacity: 0.8;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .password-form__wallet-panel[_ngcontent-%COMP%]   .zelf-input[_ngcontent-%COMP%] {\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .password-field-wrapper[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .password-generator-controls[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  flex-wrap: nowrap;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .password-generator-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 10px 18px;\n  background: var(--zns-theme-secondary, #ff5721);\n  color: #ffffff;\n  border: none;\n  border-radius: 999px;\n  font-size: 13px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  white-space: nowrap;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .password-generator-btn[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .password-generator-btn[_ngcontent-%COMP%]:hover {\n  filter: brightness(1.05);\n  box-shadow: 0 2px 8px rgba(255, 87, 33, 0.25);\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .password-generator-btn[_ngcontent-%COMP%]:active {\n  transform: scale(0.98);\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .password-regenerate-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 40px;\n  height: 40px;\n  padding: 0;\n  background: var(--zns-theme-card, #ffffff);\n  color: var(--zns-theme-text, #181818);\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: 50%;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  flex-shrink: 0;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .password-regenerate-btn[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 16px;\n  height: 16px;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .password-regenerate-btn[_ngcontent-%COMP%]:hover {\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  border-color: var(--zns-theme-secondary, #ff5721);\n  color: var(--zns-theme-secondary, #ff5721);\n  transform: rotate(180deg);\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .password-algorithm-selector[_ngcontent-%COMP%] {\n  position: relative;\n  flex: 1;\n  min-width: 0;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .algorithm-toggle-btn[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  padding: 10px 14px;\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  color: var(--zns-theme-text, #181818);\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: 999px;\n  font-size: 13px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  gap: 8px;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .algorithm-toggle-btn[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  transition: transform 0.2s ease;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .algorithm-toggle-btn[_ngcontent-%COMP%]:hover {\n  border-color: var(--zns-theme-secondary, #ff5721);\n  background: var(--zns-theme-card, #ffffff);\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .algorithm-toggle-btn.active[_ngcontent-%COMP%] {\n  border-color: var(--zns-theme-secondary, #ff5721);\n  background: var(--zns-theme-secondary, #ff5721);\n  color: #ffffff;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .algorithm-toggle-btn.active[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transform: rotate(180deg);\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .algorithm-menu[_ngcontent-%COMP%] {\n  position: absolute;\n  top: calc(100% + 8px);\n  left: 0;\n  right: 0;\n  z-index: 100;\n  background: var(--zns-theme-card, #ffffff);\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: 12px;\n  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);\n  overflow: hidden;\n  animation: _ngcontent-%COMP%_slideDown 0.2s ease-out;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .algorithm-option[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  padding: 12px 16px;\n  background: none;\n  border: none;\n  text-align: left;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  border-bottom: 1px solid var(--zns-theme-card-border, #eeedf1);\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .algorithm-option[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .algorithm-option[_ngcontent-%COMP%]:hover {\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .algorithm-option.active[_ngcontent-%COMP%] {\n  background: var(--zns-theme-secondary, #ff5721);\n  color: #ffffff;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .algorithm-option.active[_ngcontent-%COMP%]   .algorithm-name[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .algorithm-option-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .algorithm-name[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 500;\n  color: inherit;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .algorithm-description[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--zns-theme-text-muted, #96939e);\n  opacity: 0.8;\n}\n.password-form[_ngcontent-%COMP%]   .form-content[_ngcontent-%COMP%]   .algorithm-option.active[_ngcontent-%COMP%]   .algorithm-description[_ngcontent-%COMP%] {\n  color: #ffffff;\n  opacity: 0.9;\n}\n.password-form__cost-card[_ngcontent-%COMP%] {\n  margin-top: 20px;\n  padding: 16px 18px;\n  border: 1.5px solid rgba(255, 87, 33, 0.35);\n  border-radius: 16px;\n  background: var(--zns-theme-card, #ffffff);\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  transition: border-color 0.2s, background 0.2s;\n}\n.password-form__cost-card--insufficient[_ngcontent-%COMP%] {\n  border-color: rgba(255, 87, 33, 0.55);\n  background: rgba(255, 87, 33, 0.06);\n}\n.password-form__cost-card-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n}\n.password-form__cost-card-eyebrow[_ngcontent-%COMP%] {\n  font-size: 11px;\n  font-weight: 600;\n  letter-spacing: 0.06em;\n  text-transform: uppercase;\n  color: var(--zns-theme-text-muted, #96939e);\n}\n.password-form__cost-card-details[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  background: none;\n  border: none;\n  cursor: pointer;\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--zns-theme-secondary, #ff5721);\n  padding: 0;\n  text-decoration: none;\n  white-space: nowrap;\n  transition: opacity 0.15s;\n}\n.password-form__cost-card-details[_ngcontent-%COMP%]:hover {\n  opacity: 0.75;\n}\n.password-form__cost-card-amount[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: baseline;\n  gap: 8px;\n  margin-top: 2px;\n}\n.password-form__cost-card-zns[_ngcontent-%COMP%] {\n  font-size: 28px;\n  font-weight: 700;\n  color: var(--zns-theme-text, #181818);\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  line-height: 1.1;\n  letter-spacing: -0.5px;\n}\n.password-form__cost-card-usd[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--zns-theme-text-secondary, #73777f);\n  line-height: 1.2;\n}\n.password-form__cost-card-rate[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--zns-theme-text-muted, #96939e);\n  margin-top: 2px;\n}\n\n@keyframes _ngcontent-%COMP%_slideDown {\n  from {\n    opacity: 0;\n    transform: translateY(-8px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.biometrics-modal[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: var(--zns-theme-background, #ffffff);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  z-index: 1000;\n}\n.biometrics-modal[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%] {\n  background: var(--zns-theme-background, #ffffff);\n  border-radius: 16px;\n  padding: 32px;\n  max-width: 400px;\n  width: 90%;\n  box-shadow: 0 20px 40px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n}\n.biometrics-modal[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 24px;\n}\n.biometrics-modal[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%]   .modal-close[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 16px;\n  right: 16px;\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: 8px;\n  border-radius: 8px;\n  transition: background-color 0.2s;\n}\n.biometrics-modal[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%]   .modal-close[_ngcontent-%COMP%]:hover {\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n}\n.biometrics-modal[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 700;\n  color: var(--zns-theme-text, #181818);\n  margin: 0 0 8px 0;\n}\n.biometrics-modal[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%]   .modal-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: var(--zns-theme-text-muted, #96939e);\n  margin: 0;\n}\n.biometrics-modal[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%]   .modal-body[_ngcontent-%COMP%] {\n  text-align: center;\n}\n\n@media (max-width: 768px) {\n  .password-form[_ngcontent-%COMP%] {\n    padding: 12px 8px 20px;\n  }\n  .biometrics-modal[_ngcontent-%COMP%]   .modal-content[_ngcontent-%COMP%] {\n    margin: 20px;\n    padding: 24px;\n  }\n}\n.form-actions__save-wrapper[_ngcontent-%COMP%] {\n  display: none;\n}\n\n.zns-cost-modal[_ngcontent-%COMP%] {\n  padding: 24px 24px 20px;\n  width: 320px;\n  display: flex;\n  flex-direction: column;\n  gap: 0;\n}\n.zns-cost-modal__title[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 700;\n  color: var(--zns-theme-text, #181818);\n  margin: 0 0 6px;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n}\n.zns-cost-modal__subtitle[_ngcontent-%COMP%] {\n  font-size: 13px;\n  color: var(--zns-theme-text-muted, #96939e);\n  margin: 0 0 16px;\n  line-height: 1.5;\n}\n.zns-cost-modal__pricing[_ngcontent-%COMP%] {\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: 12px;\n  overflow: hidden;\n  margin-bottom: 14px;\n}\n.zns-cost-modal__pricing-list[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  display: flex;\n  flex-direction: column;\n}\n.zns-cost-modal__pricing-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 10px 14px;\n}\n.zns-cost-modal__pricing-row[_ngcontent-%COMP%]    + .zns-cost-modal__pricing-row[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--zns-theme-card-border, #eeedf1);\n}\n.zns-cost-modal__pricing-row--highlight[_ngcontent-%COMP%] {\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n}\n.zns-cost-modal__pricing-row--highlight[_ngcontent-%COMP%]   .zns-cost-modal__pricing-term[_ngcontent-%COMP%], \n.zns-cost-modal__pricing-row--highlight[_ngcontent-%COMP%]   .zns-cost-modal__pricing-value[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n}\n.zns-cost-modal__pricing-term[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--zns-theme-text-muted, #96939e);\n  font-weight: 500;\n}\n.zns-cost-modal__pricing-value[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--zns-theme-text-secondary, #73777f);\n  font-weight: 500;\n  text-align: right;\n}\n.zns-cost-modal__balance[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 10px 14px;\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: 12px;\n  margin-bottom: 16px;\n}\n.zns-cost-modal__balance-label[_ngcontent-%COMP%] {\n  font-size: 12px;\n  color: var(--zns-theme-text-muted, #96939e);\n  font-weight: 500;\n}\n.zns-cost-modal__balance-amount[_ngcontent-%COMP%] {\n  font-size: 14px;\n  font-weight: 700;\n  color: var(--zns-theme-text, #181818);\n}\n.zns-cost-modal__balance-amount--low[_ngcontent-%COMP%] {\n  color: var(--zns-theme-error, #dc362e);\n}\n.zns-cost-modal__divider[_ngcontent-%COMP%] {\n  height: 1px;\n  background: var(--zns-theme-card-border, #eeedf1);\n  margin-bottom: 16px;\n}\n.zns-cost-modal__get-zns[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.zns-cost-modal__get-zns-title[_ngcontent-%COMP%] {\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n  margin: 0 0 4px;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvemVsZi1rZXlzL3plbGYta2V5cy1wYXNzd29yZHMvemVsZi1rZXlzLXBhc3N3b3JkLWZvcm0vemVsZi1rZXlzLXBhc3N3b3JkLWZvcm0uY29tcG9uZW50LnNjc3MiLCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL192YXJpYWJsZXMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFPQTtFQUNJLGVBQUE7RUFDQSx1RUNlYztFRGRkLHNCQUFBO0VBQ0EscUJBQUE7QUFOSjtBQVNRO0VBQ0ksZ0JBQUE7QUFQWjtBQVdJO0VBQ0ksZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLHVEQUFBO0VBQ0EsbUJBQUE7RUFDQSwwQ0N5Qkk7RUR4QkoseUNBQUE7QUFUUjtBQVlJO0VBQ0ksZUFBQTtFQUNBLGdCQUFBO0VBQ0EscUNBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0FBVlI7QUFhSTtFQUNJLGNBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7RUFDQSxlQUFBO0VBQ0EsMkNDVFM7RURVVCxnQkFBQTtBQVhSO0FBY0k7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0VBQ0EsbUJBQUE7QUFaUjtBQWNRO0VBQ0ksZUFBQTtFQUNBLGdCQUFBO0VBQ0EscUNDdkJBO0VEd0JBLFNBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0FBWlo7QUFlUTtFQUNJLGNBQUE7RUFDQSwrQkFBQTtBQWJaO0FBZVk7RUFDSSwyQkFBQTtBQWJoQjtBQWtCSTtFQUNJLHNCQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsTUFBQTtBQWhCUjtBQWtCUTtFQUNJLG1CQUFBO0VBQ0EsV0FBQTtBQWhCWjtBQWtCWTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtBQWhCaEI7QUFtQlk7RUFDSSxjQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EscUNDMURKO0VEMkRJLG1CQUFBO0VBQ0EsV0FBQTtBQWpCaEI7QUFvQlk7RUFDSSxjQUFBO0VBQ0EsZUFBQTtFQUNBLGVBQUE7RUFDQSwyQ0NsRUM7RURtRUQsaUJBQUE7RUFDQSxnQkFBQTtBQWxCaEI7QUFxQlk7RUFDSSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtFQUNBLFdBQUE7RUFDQSxrQkFBQTtBQW5CaEI7QUFxQmdCO0VBQ0ksT0FBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7QUFuQnBCO0FBdUJZO0VBQ0ksZUFBQTtFQUNBLGtDQUFBO0FBckJoQjtBQXlCUTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLGlCQUFBO0VBQ0Esb0JBQUE7RUFDQSxXQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQkFBQTtFQUNBLFNBQUE7QUF2Qlo7QUF5Qlk7RUFDSSxXQUFBO0VBQ0EsWUFBQTtFQUNBLFdBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxlQUFBO0VBQ0EsbUJBQUE7RUFDQSx5QkFBQTtFQUNBLG1CQUFBO0FBdkJoQjtBQXlCZ0I7RUFDSSxnQkFBQTtBQXZCcEI7QUF5Qm9CO0VBQ0ksZUFBQTtBQXZCeEI7QUEyQmdCO0VBQ0ksMkRBQUE7QUF6QnBCO0FBOEJRO0VBQ0ksbUJBaEtpQjtFQWlLakIseUJBQUE7RUFDQSxtRENsSE07RURtSE4sMERDeEllO0FENEczQjtBQThCWTtFQUNJLHVCQUFBO0FBNUJoQjtBQStCWTtFQUNJLGtCQUFBO0FBN0JoQjtBQWdDWTtFQUNJLDhDQzFJRjtFRDJJRSw0Q0FBQTtFQUNBLDBDQ2pJSjtBRG1HWjtBQWlDWTs7Ozs7RUFLSSw4QkFBQTtBQS9CaEI7QUFrQ1k7RUFDSSxrQkFBQTtFQUNBLFdBQUE7RUFDQSxjQUFBO0VBQ0Esb0JBQUE7RUFDQSxlQUFBO0VBQ0EsNkJBQUE7QUFoQ2hCO0FBa0NnQjtFQUNJLFlBQUE7QUFoQ3BCO0FBcUNRO0VBQ0ksMERDL0tlO0FENEkzQjtBQXNDUTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7QUFwQ1o7QUF1Q1E7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxRQUFBO0VBQ0EsaUJBQUE7QUFyQ1o7QUF3Q1E7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxRQUFBO0VBQ0Esa0JBQUE7RUFDQSwrQ0MvTks7RURnT0wsY0FBQTtFQUNBLFlBQUE7RUFDQSxvQkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSx5QkFBQTtFQUNBLG1CQUFBO0FBdENaO0FBd0NZO0VBQ0ksY0FBQTtBQXRDaEI7QUF5Q1k7RUFDSSx3QkFBQTtFQUNBLDZDQUFBO0FBdkNoQjtBQTBDWTtFQUNJLHNCQUFBO0FBeENoQjtBQTRDUTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxVQUFBO0VBQ0EsMENDL01BO0VEZ05BLHFDQ2xPQTtFRG1PQSx1REFBQTtFQUNBLGtCQUFBO0VBQ0EsZUFBQTtFQUNBLHlCQUFBO0VBQ0EsY0FBQTtBQTFDWjtBQTRDWTtFQUNJLFdBQUE7RUFDQSxZQUFBO0FBMUNoQjtBQTZDWTtFQUNJLDBEQ2pQVztFRGtQWCxpREM3UUM7RUQ4UUQsMENDOVFDO0VEK1FELHlCQUFBO0FBM0NoQjtBQStDUTtFQUNJLGtCQUFBO0VBQ0EsT0FBQTtFQUNBLFlBQUE7QUE3Q1o7QUFnRFE7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSw4QkFBQTtFQUNBLFdBQUE7RUFDQSxrQkFBQTtFQUNBLDBEQ3BRZTtFRHFRZixxQ0NuUUE7RURvUUEsdURBQUE7RUFDQSxvQkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSx5QkFBQTtFQUNBLFFBQUE7QUE5Q1o7QUFnRFk7RUFDSSxjQUFBO0VBQ0EsK0JBQUE7QUE5Q2hCO0FBaURZO0VBQ0ksaURDL1NDO0VEZ1RELDBDQ2pRSjtBRGtOWjtBQWtEWTtFQUNJLGlEQ3BUQztFRHFURCwrQ0NyVEM7RURzVEQsY0FBQTtBQWhEaEI7QUFrRGdCO0VBQ0kseUJBQUE7QUFoRHBCO0FBcURRO0VBQ0ksa0JBQUE7RUFDQSxxQkFBQTtFQUNBLE9BQUE7RUFDQSxRQUFBO0VBQ0EsWUFBQTtFQUNBLDBDQ3JSQTtFRHNSQSx1REFBQTtFQUNBLG1CQUFBO0VBQ0EsMENBQUE7RUFDQSxnQkFBQTtFQUNBLGtDQUFBO0FBbkRaO0FBc0RRO0VBQ0ksY0FBQTtFQUNBLFdBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0VBQ0EsZUFBQTtFQUNBLHlCQUFBO0VBQ0EsOERBQUE7QUFwRFo7QUFzRFk7RUFDSSxtQkFBQTtBQXBEaEI7QUF1RFk7RUFDSSwwRENqVVc7QUQ0UTNCO0FBd0RZO0VBQ0ksK0NDaFdDO0VEaVdELGNBQUE7QUF0RGhCO0FBd0RnQjtFQUNJLGdCQUFBO0FBdERwQjtBQTJEUTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFFBQUE7QUF6RFo7QUE0RFE7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0FBMURaO0FBNkRRO0VBQ0ksZUFBQTtFQUNBLDJDQ3pWSztFRDBWTCxZQUFBO0FBM0RaO0FBOERRO0VBQ0ksY0FBQTtFQUNBLFlBQUE7QUE1RFo7QUFpRUk7RUFDSSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0EsMkNBQUE7RUFDQSxtQkFBQTtFQUNBLDBDQ3hWSTtFRHlWSixhQUFBO0VBQ0Esc0JBQUE7RUFDQSxRQUFBO0VBQ0EsOENBQ0k7QUFoRVo7QUFtRVE7RUFDSSxxQ0E5WXlCO0VBK1l6QixtQ0E5WWdCO0FBNlU1QjtBQXFFSTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLDhCQUFBO0VBQ0EsU0FBQTtBQW5FUjtBQXNFSTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHNCQUFBO0VBQ0EseUJBQUE7RUFDQSwyQ0NuWVM7QUQrVGpCO0FBdUVJO0VBQ0ksY0FBQTtFQUNBLGdCQUFBO0VBQ0EsWUFBQTtFQUNBLGVBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSwwQ0MzYVM7RUQ0YVQsVUFBQTtFQUNBLHFCQUFBO0VBQ0EsbUJBQUE7RUFDQSx5QkFBQTtBQXJFUjtBQXVFUTtFQUNJLGFBQUE7QUFyRVo7QUF5RUk7RUFDSSxhQUFBO0VBQ0EscUJBQUE7RUFDQSxRQUFBO0VBQ0EsZUFBQTtBQXZFUjtBQTBFSTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHFDQ25hSTtFRG9hSix1RUMzYVU7RUQ0YVYsZ0JBQUE7RUFDQSxzQkFBQTtBQXhFUjtBQTJFSTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLCtDQzFhYTtFRDJhYixnQkFBQTtBQXpFUjtBQTRFSTtFQUNJLGVBQUE7RUFDQSwyQ0NqYlM7RURrYlQsZUFBQTtBQTFFUjs7QUE4RUE7RUFDSTtJQUNJLFVBQUE7SUFDQSwyQkFBQTtFQTNFTjtFQTZFRTtJQUNJLFVBQUE7SUFDQSx3QkFBQTtFQTNFTjtBQUNGO0FBK0VBO0VBQ0ksZUFBQTtFQUNBLE1BQUE7RUFDQSxPQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxnREM1Y2M7RUQ2Y2QsYUFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFDQSxhQUFBO0FBN0VKO0FBK0VJO0VBQ0ksZ0RDbmRVO0VEb2RWLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLGdCQUFBO0VBQ0EsVUFBQTtFQUNBLG1FQUFBO0FBN0VSO0FBK0VRO0VBQ0ksa0JBQUE7RUFDQSxtQkFBQTtBQTdFWjtBQStFWTtFQUNJLGtCQUFBO0VBQ0EsU0FBQTtFQUNBLFdBQUE7RUFDQSxnQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsaUNBQUE7QUE3RWhCO0FBK0VnQjtFQUNJLDBEQ3plTztBRDRaM0I7QUFpRlk7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQ0M5ZUo7RUQrZUksaUJBQUE7QUEvRWhCO0FBa0ZZO0VBQ0ksZUFBQTtFQUNBLDJDQ25mQztFRG9mRCxTQUFBO0FBaEZoQjtBQW9GUTtFQUNJLGtCQUFBO0FBbEZaOztBQXVGQTtFQUNJO0lBQ0ksc0JBQUE7RUFwRk47RUF3Rk07SUFDSSxZQUFBO0lBQ0EsYUFBQTtFQXRGVjtBQUNGO0FBMkZJO0VBQ0ksYUFBQTtBQXpGUjs7QUE4RkE7RUFDSSx1QkFBQTtFQUNBLFlBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxNQUFBO0FBM0ZKO0FBNkZJO0VBQ0ksZUFBQTtFQUNBLGdCQUFBO0VBQ0EscUNDN2hCSTtFRDhoQkosZUFBQTtFQUNBLHVFQ3RpQlU7QUQyY2xCO0FBOEZJO0VBQ0ksZUFBQTtFQUNBLDJDQ25pQlM7RURvaUJULGdCQUFBO0VBQ0EsZ0JBQUE7QUE1RlI7QUErRkk7RUFDSSx1REFBQTtFQUNBLG1CQUFBO0VBQ0EsZ0JBQUE7RUFDQSxtQkFBQTtBQTdGUjtBQWdHSTtFQUNJLFNBQUE7RUFDQSxVQUFBO0VBQ0EsZ0JBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7QUE5RlI7QUFpR0k7RUFDSSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0FBL0ZSO0FBaUdRO0VBQ0ksMkRBQUE7QUEvRlo7QUFrR1E7RUFDSSwwRENya0JlO0FEcWUzQjtBQWtHWTs7RUFFSSxnQkFBQTtFQUNBLHFDQ3hrQko7QUR3ZVo7QUFxR0k7RUFDSSxlQUFBO0VBQ0EsMkNDOWtCUztFRCtrQlQsZ0JBQUE7QUFuR1I7QUFzR0k7RUFDSSxlQUFBO0VBQ0EsK0NDbmxCYTtFRG9sQmIsZ0JBQUE7RUFDQSxpQkFBQTtBQXBHUjtBQXVHSTtFQUNJLGFBQUE7RUFDQSw4QkFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSx1REFBQTtFQUNBLG1CQUFBO0VBQ0EsbUJBQUE7QUFyR1I7QUF3R0k7RUFDSSxlQUFBO0VBQ0EsMkNDcm1CUztFRHNtQlQsZ0JBQUE7QUF0R1I7QUF5R0k7RUFDSSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQ0M3bUJJO0FEc2dCWjtBQXlHUTtFQUNJLHNDQ3RvQko7QUQraEJSO0FBMkdJO0VBQ0ksV0FBQTtFQUNBLGlEQ25tQlU7RURvbUJWLG1CQUFBO0FBekdSO0FBNEdJO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsUUFBQTtBQTFHUjtBQTZHSTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLHFDQ25vQkk7RURvb0JKLGVBQUE7QUEzR1IiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwiLi4vLi4vLi4vLi4vc3R5bGVzL3ZhcmlhYmxlc1wiO1xuXG4kcGFzc3dvcmQtZm9ybS1pbnB1dC1yYWRpdXM6IDEycHg7XG4kcGFzc3dvcmQtZm9ybS1hY2NlbnQtYm9yZGVyOiByZ2JhKDI1NSwgODcsIDMzLCAwLjM1KTtcbiRwYXNzd29yZC1mb3JtLWFjY2VudC1ib3JkZXItc3Ryb25nOiByZ2JhKDI1NSwgODcsIDMzLCAwLjU1KTtcbiRwYXNzd29yZC1mb3JtLWFjY2VudC1maWxsOiByZ2JhKDI1NSwgODcsIDMzLCAwLjA2KTtcblxuLnBhc3N3b3JkLWZvcm0ge1xuICAgIG1heC13aWR0aDogMTAwJTtcbiAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICBwYWRkaW5nOiA4cHggNHB4IDI0cHg7XG5cbiAgICAmX19jcmVkZW50aWFscyB7XG4gICAgICAgIC5mb3JtLXNlY3Rpb246bGFzdC1jaGlsZCB7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fd2FsbGV0LXBhbmVsIHtcbiAgICAgICAgbWFyZ2luLXRvcDogMjBweDtcbiAgICAgICAgcGFkZGluZzogMThweCAxNnB4O1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgIGJveC1zaGFkb3c6IDAgMXB4IDJweCByZ2JhKDAsIDAsIDAsIDAuMDQpO1xuICAgIH1cblxuICAgICZfX3dhbGxldC1wYW5lbC10aXRsZSB7XG4gICAgICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBtYXJnaW46IDAgMCAxNHB4O1xuICAgICAgICBsaW5lLWhlaWdodDogMS4zNTtcbiAgICB9XG5cbiAgICAmX193YWxsZXQtaGludCB7XG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICBtYXJnaW46IDEwcHggMCAwO1xuICAgICAgICBwYWRkaW5nOiAwIDJweDtcbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDEuNTtcbiAgICB9XG5cbiAgICAuZm9ybS1oZWFkZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IDEycHg7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDIwcHg7XG5cbiAgICAgICAgaDIge1xuICAgICAgICAgICAgZm9udC1zaXplOiAyNHB4O1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAtMC40cHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMS4yO1xuICAgICAgICB9XG5cbiAgICAgICAgLnplbGYtaWNvbi1idXR0b24ge1xuICAgICAgICAgICAgZmxleC1zaHJpbms6IDA7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4ycyBlYXNlO1xuXG4gICAgICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTJweCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAuZm9ybS1jb250ZW50IHtcbiAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiAwO1xuXG4gICAgICAgIC5mb3JtLXNlY3Rpb24ge1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTZweDtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgICAgICAgICAmLS1mb2xkZXIge1xuICAgICAgICAgICAgICAgIG1hcmdpbi10b3A6IDRweDtcbiAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAuZm9ybS1sYWJlbCB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDEycHg7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC5mb3JtLWhpbnQge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDAgMThweDtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICAgICAgbWFyZ2luOiA4cHggMCAwIDA7XG4gICAgICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDEuNTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLmZvbGRlci10b2dnbGUge1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICAgICAgcGFkZGluZzogNHB4IDAgOHB4O1xuXG4gICAgICAgICAgICAgICAgLmZvcm0tbGFiZWwge1xuICAgICAgICAgICAgICAgICAgICBmbGV4OiAxO1xuICAgICAgICAgICAgICAgICAgICBtYXJnaW4tcmlnaHQ6IDE2cHg7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDA7XG4gICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcbiAgICAgICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC5mb2xkZXItaW5wdXQge1xuICAgICAgICAgICAgICAgIG1hcmdpbi10b3A6IDhweDtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IHNsaWRlRG93biAwLjJzIGVhc2Utb3V0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLmZvcm0tYWN0aW9ucyB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgICAgICAgIGZsZXgtd3JhcDogbm93cmFwO1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDIwcHg7XG4gICAgICAgICAgICBwYWRkaW5nLXRvcDogNHB4O1xuICAgICAgICAgICAgZ2FwOiAxMnB4O1xuXG4gICAgICAgICAgICAuemVsZi1idXR0b24ge1xuICAgICAgICAgICAgICAgIGZsZXg6IDEgMSAwO1xuICAgICAgICAgICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgICAgICAgICB3aWR0aDogYXV0bztcbiAgICAgICAgICAgICAgICBtaW4taGVpZ2h0OiA0OHB4O1xuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDE0cHggMTJweDtcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcbiAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxNHB4O1xuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2U7XG4gICAgICAgICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcblxuICAgICAgICAgICAgICAgICYtLXByaW1hcnkge1xuICAgICAgICAgICAgICAgICAgICBib3gtc2hhZG93OiBub25lO1xuXG4gICAgICAgICAgICAgICAgICAgICY6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBub25lO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJi0tb3V0bGluZWQge1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC56ZWxmLWlucHV0IHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6ICRwYXNzd29yZC1mb3JtLWlucHV0LXJhZGl1cztcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2U7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk7XG5cbiAgICAgICAgICAgIC56ZWxmLWlucHV0X19jb250cm9sIHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLnplbGYtaW5wdXRfX3ByZWZpeC10ZXh0IHtcbiAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICY6Zm9jdXMtd2l0aGluIHtcbiAgICAgICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b247XG4gICAgICAgICAgICAgICAgYm94LXNoYWRvdzogMCAwIDAgM3B4IHJnYmEoMjQsIDI0LCAyNCwgMC4wOCk7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlucHV0W3R5cGU9XCJwYXNzd29yZFwiXSxcbiAgICAgICAgICAgIGlucHV0W3R5cGU9XCJ0ZXh0XCJdW2Zvcm1jb250cm9sbmFtZT1cInBhc3N3b3JkXCJdLFxuICAgICAgICAgICAgaW5wdXRbdHlwZT1cInRleHRcIl1bZm9ybWNvbnRyb2xuYW1lPVwibWFzdGVyUGFzc3dvcmRcIl0sXG4gICAgICAgICAgICBpbnB1dFtmb3JtY29udHJvbG5hbWU9XCJwYXNzd29yZFwiXSxcbiAgICAgICAgICAgIGlucHV0W2Zvcm1jb250cm9sbmFtZT1cIm1hc3RlclBhc3N3b3JkXCJdIHtcbiAgICAgICAgICAgICAgICBwYWRkaW5nLXJpZ2h0OiA1NnB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC56ZWxmLWljb24tYnV0dG9uIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICAgICAgICAgICAgei1pbmRleDogMjA7XG4gICAgICAgICAgICAgICAgZmxleC1zaHJpbms6IDA7XG4gICAgICAgICAgICAgICAgcG9pbnRlci1ldmVudHM6IGF1dG87XG4gICAgICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC4ycyBlYXNlO1xuXG4gICAgICAgICAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuODtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAucGFzc3dvcmQtZm9ybV9fd2FsbGV0LXBhbmVsIC56ZWxmLWlucHV0IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5O1xuICAgICAgICB9XG5cbiAgICAgICAgLnBhc3N3b3JkLWZpZWxkLXdyYXBwZXIge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgICAgICBnYXA6IDEwcHg7XG4gICAgICAgIH1cblxuICAgICAgICAucGFzc3dvcmQtZ2VuZXJhdG9yLWNvbnRyb2xzIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgZ2FwOiA4cHg7XG4gICAgICAgICAgICBmbGV4LXdyYXA6IG5vd3JhcDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5wYXNzd29yZC1nZW5lcmF0b3ItYnRuIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgZ2FwOiA2cHg7XG4gICAgICAgICAgICBwYWRkaW5nOiAxMHB4IDE4cHg7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHNlY29uZGFyeUNvbG9yO1xuICAgICAgICAgICAgY29sb3I6ICNmZmZmZmY7XG4gICAgICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA5OTlweDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTNweDtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xuICAgICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmbGV4LXNocmluazogMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICAgICAgZmlsdGVyOiBicmlnaHRuZXNzKDEuMDUpO1xuICAgICAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMnB4IDhweCByZ2JhKDI1NSwgODcsIDMzLCAwLjI1KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJjphY3RpdmUge1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogc2NhbGUoMC45OCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAucGFzc3dvcmQtcmVnZW5lcmF0ZS1idG4ge1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgICAgIHdpZHRoOiA0MHB4O1xuICAgICAgICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgICAgICAgcGFkZGluZzogMDtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xuICAgICAgICAgICAgZmxleC1zaHJpbms6IDA7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDE2cHg7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAxNnB4O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbiAgICAgICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3I7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3I7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiByb3RhdGUoMTgwZGVnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC5wYXNzd29yZC1hbGdvcml0aG0tc2VsZWN0b3Ige1xuICAgICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICAgICAgZmxleDogMTtcbiAgICAgICAgICAgIG1pbi13aWR0aDogMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5hbGdvcml0aG0tdG9nZ2xlLWJ0biB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgcGFkZGluZzogMTBweCAxNHB4O1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OXB4O1xuICAgICAgICAgICAgZm9udC1zaXplOiAxM3B4O1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjJzIGVhc2U7XG4gICAgICAgICAgICBnYXA6IDhweDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmbGV4LXNocmluazogMDtcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4ycyBlYXNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3I7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICYuYWN0aXZlIHtcbiAgICAgICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3I7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvcjtcbiAgICAgICAgICAgICAgICBjb2xvcjogI2ZmZmZmZjtcblxuICAgICAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDE4MGRlZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLmFsZ29yaXRobS1tZW51IHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgIHRvcDogY2FsYygxMDAlICsgOHB4KTtcbiAgICAgICAgICAgIGxlZnQ6IDA7XG4gICAgICAgICAgICByaWdodDogMDtcbiAgICAgICAgICAgIHotaW5kZXg6IDEwMDtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICAgICAgICAgICAgYm94LXNoYWRvdzogMCA0cHggMTZweCByZ2JhKDAsIDAsIDAsIDAuMTUpO1xuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogc2xpZGVEb3duIDAuMnMgZWFzZS1vdXQ7XG4gICAgICAgIH1cblxuICAgICAgICAuYWxnb3JpdGhtLW9wdGlvbiB7XG4gICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgcGFkZGluZzogMTJweCAxNnB4O1xuICAgICAgICAgICAgYmFja2dyb3VuZDogbm9uZTtcbiAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGxlZnQ7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xuICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuXG4gICAgICAgICAgICAmOmxhc3QtY2hpbGQge1xuICAgICAgICAgICAgICAgIGJvcmRlci1ib3R0b206IG5vbmU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmLmFjdGl2ZSB7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvcjtcbiAgICAgICAgICAgICAgICBjb2xvcjogI2ZmZmZmZjtcblxuICAgICAgICAgICAgICAgIC5hbGdvcml0aG0tbmFtZSB7XG4gICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLmFsZ29yaXRobS1vcHRpb24tY29udGVudCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgICAgIGdhcDogNHB4O1xuICAgICAgICB9XG5cbiAgICAgICAgLmFsZ29yaXRobS1uYW1lIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgICAgICBjb2xvcjogaW5oZXJpdDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5hbGdvcml0aG0tZGVzY3JpcHRpb24ge1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICBvcGFjaXR5OiAwLjg7XG4gICAgICAgIH1cblxuICAgICAgICAuYWxnb3JpdGhtLW9wdGlvbi5hY3RpdmUgLmFsZ29yaXRobS1kZXNjcmlwdGlvbiB7XG4gICAgICAgICAgICBjb2xvcjogI2ZmZmZmZjtcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuOTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIENvc3QgdG8gU2F2ZSBjYXJkXG4gICAgJl9fY29zdC1jYXJkIHtcbiAgICAgICAgbWFyZ2luLXRvcDogMjBweDtcbiAgICAgICAgcGFkZGluZzogMTZweCAxOHB4O1xuICAgICAgICBib3JkZXI6IDEuNXB4IHNvbGlkICRwYXNzd29yZC1mb3JtLWFjY2VudC1ib3JkZXI7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBnYXA6IDZweDtcbiAgICAgICAgdHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGJvcmRlci1jb2xvciAwLjJzLFxuICAgICAgICAgICAgYmFja2dyb3VuZCAwLjJzO1xuXG4gICAgICAgICYtLWluc3VmZmljaWVudCB7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6ICRwYXNzd29yZC1mb3JtLWFjY2VudC1ib3JkZXItc3Ryb25nO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogJHBhc3N3b3JkLWZvcm0tYWNjZW50LWZpbGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19jb3N0LWNhcmQtaGVhZGVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICBnYXA6IDEycHg7XG4gICAgfVxuXG4gICAgJl9fY29zdC1jYXJkLWV5ZWJyb3cge1xuICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjA2ZW07XG4gICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgIH1cblxuICAgICZfX2Nvc3QtY2FyZC1kZXRhaWxzIHtcbiAgICAgICAgZmxleC1zaHJpbms6IDA7XG4gICAgICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICBmb250LXNpemU6IDEzcHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHNlY29uZGFyeUNvbG9yO1xuICAgICAgICBwYWRkaW5nOiAwO1xuICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gICAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC4xNXM7XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBvcGFjaXR5OiAwLjc1O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fY29zdC1jYXJkLWFtb3VudCB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBiYXNlbGluZTtcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgICAgIG1hcmdpbi10b3A6IDJweDtcbiAgICB9XG5cbiAgICAmX19jb3N0LWNhcmQtem5zIHtcbiAgICAgICAgZm9udC1zaXplOiAyOHB4O1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDEuMTtcbiAgICAgICAgbGV0dGVyLXNwYWNpbmc6IC0wLjVweDtcbiAgICB9XG5cbiAgICAmX19jb3N0LWNhcmQtdXNkIHtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjI7XG4gICAgfVxuXG4gICAgJl9fY29zdC1jYXJkLXJhdGUge1xuICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgICAgICBtYXJnaW4tdG9wOiAycHg7XG4gICAgfVxufVxuXG5Aa2V5ZnJhbWVzIHNsaWRlRG93biB7XG4gICAgZnJvbSB7XG4gICAgICAgIG9wYWNpdHk6IDA7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtOHB4KTtcbiAgICB9XG4gICAgdG8ge1xuICAgICAgICBvcGFjaXR5OiAxO1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gICAgfVxufVxuXG4vLyBCaW9tZXRyaWNzIE1vZGFsIFN0eWxlc1xuLmJpb21ldHJpY3MtbW9kYWwge1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICB0b3A6IDA7XG4gICAgbGVmdDogMDtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmQ7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIHotaW5kZXg6IDEwMDA7XG5cbiAgICAubW9kYWwtY29udGVudCB7XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgICAgICBwYWRkaW5nOiAzMnB4O1xuICAgICAgICBtYXgtd2lkdGg6IDQwMHB4O1xuICAgICAgICB3aWR0aDogOTAlO1xuICAgICAgICBib3gtc2hhZG93OiAwIDIwcHggNDBweCB2YXJpYWJsZXMuJHRoZW1lU2hhZG93O1xuXG4gICAgICAgIC5tb2RhbC1oZWFkZXIge1xuICAgICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMjRweDtcblxuICAgICAgICAgICAgLm1vZGFsLWNsb3NlIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICAgICAgdG9wOiAxNnB4O1xuICAgICAgICAgICAgICAgIHJpZ2h0OiAxNnB4O1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gICAgICAgICAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiA4cHg7XG4gICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycztcblxuICAgICAgICAgICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGgzIHtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDIwcHg7XG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICAgICAgbWFyZ2luOiAwIDAgOHB4IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHAge1xuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAubW9kYWwtYm9keSB7XG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAgIC5wYXNzd29yZC1mb3JtIHtcbiAgICAgICAgcGFkZGluZzogMTJweCA4cHggMjBweDtcbiAgICB9XG5cbiAgICAuYmlvbWV0cmljcy1tb2RhbCB7XG4gICAgICAgIC5tb2RhbC1jb250ZW50IHtcbiAgICAgICAgICAgIG1hcmdpbjogMjBweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDI0cHg7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi5mb3JtLWFjdGlvbnMge1xuICAgICZfX3NhdmUtd3JhcHBlciB7XG4gICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgfVxufVxuXG4vLyBaTlMgY29zdCBtb2RhbFxuLnpucy1jb3N0LW1vZGFsIHtcbiAgICBwYWRkaW5nOiAyNHB4IDI0cHggMjBweDtcbiAgICB3aWR0aDogMzIwcHg7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGdhcDogMDtcblxuICAgICZfX3RpdGxlIHtcbiAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIG1hcmdpbjogMCAwIDZweDtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgIH1cblxuICAgICZfX3N1YnRpdGxlIHtcbiAgICAgICAgZm9udC1zaXplOiAxM3B4O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgbWFyZ2luOiAwIDAgMTZweDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDEuNTtcbiAgICB9XG5cbiAgICAmX19wcmljaW5nIHtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDE0cHg7XG4gICAgfVxuXG4gICAgJl9fcHJpY2luZy1saXN0IHtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBwYWRkaW5nOiAwO1xuICAgICAgICBsaXN0LXN0eWxlOiBub25lO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIH1cblxuICAgICZfX3ByaWNpbmctcm93IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBwYWRkaW5nOiAxMHB4IDE0cHg7XG5cbiAgICAgICAgJiArICYge1xuICAgICAgICAgICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgJi0taGlnaGxpZ2h0IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5O1xuXG4gICAgICAgICAgICAuem5zLWNvc3QtbW9kYWxfX3ByaWNpbmctdGVybSxcbiAgICAgICAgICAgIC56bnMtY29zdC1tb2RhbF9fcHJpY2luZy12YWx1ZSB7XG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19wcmljaW5nLXRlcm0ge1xuICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgIH1cblxuICAgICZfX3ByaWNpbmctdmFsdWUge1xuICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgfVxuXG4gICAgJl9fYmFsYW5jZSB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgcGFkZGluZzogMTBweCAxNHB4O1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMTZweDtcbiAgICB9XG5cbiAgICAmX19iYWxhbmNlLWxhYmVsIHtcbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRNdXRlZDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICB9XG5cbiAgICAmX19iYWxhbmNlLWFtb3VudCB7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuXG4gICAgICAgICYtLWxvdyB7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2RpdmlkZXIge1xuICAgICAgICBoZWlnaHQ6IDFweDtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDE2cHg7XG4gICAgfVxuXG4gICAgJl9fZ2V0LXpucyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogOHB4O1xuICAgIH1cblxuICAgICZfX2dldC16bnMtdGl0bGUge1xuICAgICAgICBmb250LXNpemU6IDEzcHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgbWFyZ2luOiAwIDAgNHB4O1xuICAgIH1cbn1cbiIsIiRwcmltYXJ5Q29sb3I6IHZhcigtLXpucy10aGVtZS1wcmltYXJ5LCAjMTgxODE4KTtcbiRwcmltYXJ5TGlnaHQ6ICNkYWRkZmE7XG4kc2Vjb25kYXJ5Q29sb3I6IHZhcigtLXpucy10aGVtZS1zZWNvbmRhcnksICNmZjU3MjEpO1xuJHNlY29uZGFyeUNvbG9yTGlnaHQ6ICNmNmU1ZTA7XG5cbiRjb3JyZWN0OiB2YXIoLS16bnMtdGhlbWUtc3VjY2VzcywgIzFlYTQ0Nik7XG4kY29ycmVjdERhcms6ICMwZjUyMjM7XG4kY29ycmVjdExpZ2h0OiB2YXIoLS16bnMtdGhlbWUtc3VjY2Vzcy10ZXh0LCAjZTdmOGVkKTtcblxuJGVycm9yOiB2YXIoLS16bnMtdGhlbWUtZXJyb3IsICNkYzM2MmUpO1xuJGVycm9yRGFyazogIzYwMTQxMDtcbiRlcnJvckxpZ2h0OiB2YXIoLS16bnMtdGhlbWUtZXJyb3ItdGV4dCwgI2ZjZWVlZSk7XG5cbiR3YXJuaW5nOiB2YXIoLS16bnMtdGhlbWUtd2FybmluZywgI2RlNjgwMCk7XG4kd2FybmluZ0Rhcms6ICM0YTIxMGE7XG4kd2FybmluZ0xpZ2h0OiB2YXIoLS16bnMtdGhlbWUtd2FybmluZy10ZXh0LCAjZmZlZWU5KTtcblxuJGluZm86ICMzOTk4ZDM7XG4kaW5mb0Rhcms6ICMwMDRhNzc7XG4kaW5mb0xpZ2h0OiAjZWNmM2ZlO1xuXG4kYmxhY2s6ICMxODE4MTg7XG4kd2hpdGU6ICNmZmZmZmY7XG5cbiR0aGVtZUJvZHlGYW1pbHk6IHZhcigtLXpucy10aGVtZS1ib2R5LWZhbWlseSwgXCJQb3BwaW5zXCIsIEFyaWFsLCBzYW5zLXNlcmlmKTtcbiR0aGVtZVRpdGxlRmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtdGl0bGUtZmFtaWx5LCBcIk1lbmRhXCIsIFwiQXJpYWwgQmxhY2tcIiwgc2Fucy1zZXJpZik7XG4kdGhlbWVNb25vc3BhY2VGYW1pbHk6IHZhcigtLXpucy10aGVtZS1tb25vc3BhY2UtZmFtaWx5LCBcIkNvdXJpZXIgTmV3XCIsIENvdXJpZXIsIG1vbm9zcGFjZSk7XG5cbiR0aGVtZUJhY2tncm91bmQ6IHZhcigtLXpucy10aGVtZS1iYWNrZ3JvdW5kLCAjZmZmZmZmKTtcbiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS1iYWNrZ3JvdW5kLXNlY29uZGFyeSwgI2Y5ZjlmYyk7XG5cbiR0aGVtZVRleHQ6IHZhcigtLXpucy10aGVtZS10ZXh0LCAjMTgxODE4KTtcbiR0aGVtZVRleHRNdXRlZDogdmFyKC0tem5zLXRoZW1lLXRleHQtbXV0ZWQsICM5NjkzOWUpO1xuJHRoZW1lVGV4dFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLXRleHQtc2Vjb25kYXJ5LCAjNzM3NzdmKTtcblxuJHRoZW1lSGVhZGVyOiB2YXIoLS16bnMtdGhlbWUtaGVhZGVyLCAjMTgxODE4KTtcbiR0aGVtZUhlYWRlclRleHQ6IHZhcigtLXpucy10aGVtZS1oZWFkZXItdGV4dCwgI2ZmZmZmZik7XG5cbiR0aGVtZUJ1dHRvbjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbiwgIzE4MTgxOCk7XG4kdGhlbWVCdXR0b25UZXh0OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXRleHQsICNmZmZmZmYpO1xuJHRoZW1lQnV0dG9uSG92ZXI6IHZhcigtLXpucy10aGVtZS1idXR0b24taG92ZXIsICNmZjU3MjEpO1xuXG4kdGhlbWVCdXR0b25TZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LCAjZTllY2VmKTtcbiR0aGVtZUJ1dHRvblNlY29uZGFyeVRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LXRleHQsICM0OTUwNTcpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5SG92ZXI6IHZhcigtLXpucy10aGVtZS1idXR0b24tc2Vjb25kYXJ5LWhvdmVyLCAjZTllY2VmKTtcblxuJHRoZW1lQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtYm9yZGVyLCAjZTNlM2UzKTtcbiR0aGVtZUJvcmRlckhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYm9yZGVyLWhvdmVyLCAjYzNjNmNmKTtcblxuJHRoZW1lQ2FyZDogdmFyKC0tem5zLXRoZW1lLWNhcmQsICNmZmZmZmYpO1xuJHRoZW1lQ2FyZEJvcmRlcjogdmFyKC0tem5zLXRoZW1lLWNhcmQtYm9yZGVyLCAjZWVlZGYxKTtcblxuJHRoZW1lU2hhZG93OiB2YXIoLS16bnMtdGhlbWUtc2hhZG93LCByZ2JhKDAsIDAsIDAsIDAuMSkpO1xuXG4kc21vb3RoQmV6aWVyOiBjdWJpYy1iZXppZXIoMC4yNSwgMC40LCAwLjcsIDEpO1xuXG4kbWF4RXh0cmFTbWFsbDogNTk1cHg7XG4kbWluU21hbGw6IDYwMHB4O1xuJG1lZGl1bTogNzY4cHg7XG4kbGFyZ2U6IDg4OXB4O1xuJGNvbXB1dGVyczogMTIwMHB4O1xuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }

}]);
//# sourceMappingURL=src_app_zelf-keys_zelf-keys-passwords_zelf-keys-password-form_zelf-keys-password-form_component_ts.js.map