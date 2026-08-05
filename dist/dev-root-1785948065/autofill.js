/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./content-scripts/autofill/services/autofill-engine.ts"
/*!**************************************************************!*\
  !*** ./content-scripts/autofill/services/autofill-engine.ts ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AutofillEngine: () => (/* binding */ AutofillEngine)
/* harmony export */ });
class AutofillEngine {
    fillForm(form, username, password) {
        const usernameField = this.findUsernameField(form.fields);
        const passwordField = this.findPasswordField(form.fields);
        if (usernameField && username) {
            this.fillField(usernameField, username);
        }
        if (passwordField && password) {
            this.fillField(passwordField, password);
        }
    }
    fillField(field, value) {
        this.setFieldValue(field.element, value);
    }
    clearForm(form) {
        form.fields.forEach((field) => {
            this.clearField(field);
        });
    }
    clearField(field) {
        this.setFieldValue(field.element, "");
    }
    setFieldValue(field, value) {
        const originalValue = field.value;
        field.focus();
        const nativeValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
        if (nativeValueSetter) {
            nativeValueSetter.call(field, value);
        }
        else {
            field.value = value;
        }
        field.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
        field.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
        field.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: "Backspace" }));
        field.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true, cancelable: true, key: "Backspace" }));
        field.dispatchEvent(new CustomEvent("zelfkey:autofill", {
            detail: { field, value, originalValue },
            bubbles: true,
        }));
        field.dispatchEvent(new Event("blur", { bubbles: true }));
    }
    findUsernameField(fields) {
        const emailField = fields.find((field) => field.type === "email");
        if (emailField)
            return emailField;
        const usernameField = fields.find((field) => field.type === "username");
        if (usernameField)
            return usernameField;
        const phoneField = fields.find((field) => field.type === "phone");
        if (phoneField)
            return phoneField;
        return fields.find((field) => field.type !== "password") || null;
    }
    findPasswordField(fields) {
        return fields.find((field) => field.type === "password") || null;
    }
    detectFormType(form) {
        const passwordFields = form.fields.filter((field) => field.type === "password");
        const usernameFields = form.fields.filter((field) => field.type === "username" || field.type === "email" || field.type === "phone");
        // Check for common registration indicators
        const registrationIndicators = [
            "confirm",
            "repeat",
            "verify",
            "confirm-password",
            "confirm_password",
            "signup",
            "sign-up",
            "register",
            "registration",
        ];
        const hasRegistrationIndicator = form.fields.some((field) => field.name && registrationIndicators.some((indicator) => field?.name?.toLowerCase().includes(indicator)));
        if (hasRegistrationIndicator || passwordFields.length > 1) {
            return "register";
        }
        if (passwordFields.length === 1 && usernameFields.length >= 1) {
            return "login";
        }
        return "unknown";
    }
    validateForm(form) {
        const errors = [];
        if (form.fields.length === 0) {
            errors.push("No form fields detected");
            return { isValid: false, errors };
        }
        const passwordFields = form.fields.filter((field) => field.type === "password");
        const usernameFields = form.fields.filter((field) => field.type === "username" || field.type === "email" || field.type === "phone");
        // For multi-step forms, allow forms with just username fields (password may appear later)
        if (usernameFields.length === 0 && passwordFields.length === 0) {
            errors.push("No username/email or password field found");
        }
        // If we have fields but no username/email, that's still valid for password-only forms
        if (usernameFields.length === 0 && passwordFields.length > 0) {
            // This is a password-only form, which is valid
        }
        // If we have username/email but no password, that's valid for multi-step forms
        if (usernameFields.length > 0 && passwordFields.length === 0) {
            // This is a username-only form (like QNAP step 1), which is valid
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    getFormData(form) {
        const data = {};
        form.fields.forEach((field) => {
            const value = field.element.value;
            if (value) {
                const key = field.name || field.id || field.type;
                if (key) {
                    data[key] = value;
                }
            }
        });
        return data;
    }
    isFormFilled(form) {
        return form.fields.every((field) => field.element.value.trim() !== "");
    }
    getEmptyFields(form) {
        return form.fields.filter((field) => field.element.value.trim() === "");
    }
}


/***/ },

/***/ "./content-scripts/autofill/services/communication.ts"
/*!************************************************************!*\
  !*** ./content-scripts/autofill/services/communication.ts ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CommunicationService: () => (/* binding */ CommunicationService)
/* harmony export */ });
/* harmony import */ var _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @extension-scripts/logger/logger.class */ "./extension-scripts/logger/logger.class.ts");
/* harmony import */ var _autofill_engine__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./autofill-engine */ "./content-scripts/autofill/services/autofill-engine.ts");
/* harmony import */ var _form_detector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./form-detector */ "./content-scripts/autofill/services/form-detector.ts");



class CommunicationService {
    static getInstance() {
        if (!CommunicationService.instance)
            CommunicationService.instance = new CommunicationService();
        return CommunicationService.instance;
    }
    constructor() {
        this.serviceWorkerReadyCallbacks = [];
        this.formDetector = new _form_detector__WEBPACK_IMPORTED_MODULE_2__.FormDetector();
    }
    async getPasswords(website) {
        try {
            const response = await this.sendMessage({
                type: "GET_PASSWORDS",
                payload: { website },
            });
            if (response.success && response.data) {
                return response.data;
            }
            return [];
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Error fetching passwords:", error);
            return [];
        }
    }
    async decryptPassword(requestId) {
        try {
            const response = await this.sendMessage({
                type: "DECRYPT_PASSWORD",
                payload: { requestId },
            });
            if (response.success && response.data) {
                return response.data;
            }
            return null;
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Error decrypting password:", error);
            return null;
        }
    }
    async createPassword(urlInfo) {
        try {
            await this.sendMessage({
                type: "CREATE_PASSWORD",
                payload: { urlInfo },
            });
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Error opening create password:", error);
        }
    }
    async authenticate() {
        try {
            const response = await this.sendMessage({
                type: "AUTHENTICATE",
                payload: {},
            });
            return response.success;
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Error authenticating:", error);
            return false;
        }
    }
    sendMessage(message) {
        return new Promise((resolve, reject) => {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.log("Sending message to background script:", message);
            if (typeof chrome !== "undefined" && chrome.runtime) {
                const timeout = setTimeout(() => {
                    _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Message timeout after 10 seconds");
                    reject(new Error("Message timeout - background script did not respond"));
                }, 10000);
                chrome.runtime.sendMessage(message, (response) => {
                    clearTimeout(timeout);
                    _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.log("Received response from background script:", response);
                    if (chrome.runtime.lastError) {
                        _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Chrome runtime error:", chrome.runtime.lastError);
                        reject(new Error(chrome.runtime.lastError.message));
                    }
                    else {
                        resolve(response);
                    }
                });
            }
            else {
                reject(new Error("Chrome extension runtime not available"));
            }
        });
    }
    setupMessageListener() {
        if (typeof chrome !== "undefined" && chrome.runtime) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                const willHandle = this._handleMessage(message, sendResponse);
                return willHandle;
            });
        }
    }
    _handleMessage(message, sendResponse) {
        if (message.type === "SERVICE_WORKER_READY") {
            this.serviceWorkerReadyCallbacks.forEach((callback) => callback());
            sendResponse({ success: true });
            return true;
        }
        if (message.type === "FILL_PASSWORD_FORM") {
            const fillData = message.payload?.fillData;
            const tabId = message.payload?.tabId;
            if (!tabId) {
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("No tab ID provided in FILL_PASSWORD_FORM message");
                sendResponse({ success: false, error: "No tab ID provided" });
                return true;
            }
            this._waitForFormReady(fillData);
            sendResponse({ success: true });
            return true;
        }
        return false;
    }
    _waitForFormReady(fillData) {
        if (document.readyState !== "complete") {
            window.addEventListener("load", () => this._checkForFormsAndNotify(fillData));
            return;
        }
        this._checkForFormsAndNotify(fillData);
    }
    _checkForFormsAndNotify(fillData) {
        const currentForms = this.formDetector.getCurrentForms();
        if (currentForms.length) {
            this._fillFormFields(fillData, currentForms);
            return;
        }
        // Set up mutation observer for dynamic form loading
        const observer = new MutationObserver(() => {
            const observerForms = this.formDetector.getCurrentForms();
            if (!observerForms.length)
                return;
            observer.disconnect();
            this._fillFormFields(fillData, observerForms);
        });
        observer.observe(document.body, {
            attributeFilter: ["type"], // Watch for input type changes
            attributes: true,
            childList: true,
            subtree: true,
        });
        // Timeout after 10 seconds
        setTimeout(() => {
            observer.disconnect();
            const timeoutForms = this.formDetector.getCurrentForms();
            if (timeoutForms.length > 0)
                this._fillFormFields(fillData, timeoutForms);
        }, 10000);
    }
    onServiceWorkerReady(callback) {
        this.serviceWorkerReadyCallbacks.push(callback);
    }
    _fillFormFields(data, currentForms) {
        _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.log("Attempting to fill form fields with:", { username: data.username, password: "***" });
        if (currentForms.length === 0) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn("No forms detected");
            return;
        }
        if (!data?.username && !data?.password) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn("No fill data provided");
            return;
        }
        const engine = new _autofill_engine__WEBPACK_IMPORTED_MODULE_1__.AutofillEngine();
        let filledIdentity = false;
        let filledPassword = false;
        for (const form of currentForms) {
            const hasIdentity = form.fields.some((field) => field.type === "username" || field.type === "email" || field.type === "phone");
            const hasPassword = form.fields.some((field) => field.type === "password");
            if (!hasIdentity && !hasPassword)
                continue;
            engine.fillForm(form, data.username || "", data.password || "");
            filledIdentity = filledIdentity || hasIdentity;
            filledPassword = filledPassword || hasPassword;
            if (filledIdentity && filledPassword)
                break;
        }
        if (!filledIdentity)
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn("No username/email/phone field found");
        if (!filledPassword)
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn("No password field found");
    }
}


/***/ },

/***/ "./content-scripts/autofill/services/form-detector.ts"
/*!************************************************************!*\
  !*** ./content-scripts/autofill/services/form-detector.ts ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormDetector: () => (/* binding */ FormDetector)
/* harmony export */ });
/* harmony import */ var _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @extension-scripts/logger/logger.class */ "./extension-scripts/logger/logger.class.ts");

class FormDetector {
    constructor() {
        this.observedFields = new Set();
        this.observer = new MutationObserver(this.handleMutations.bind(this));
    }
    startDetection() {
        this.scanForForms();
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["type", "name", "id", "placeholder", "class", "style"],
        });
        // Also monitor for any input elements being added
        this.observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["type", "name", "id", "placeholder", "class", "style"],
        });
    }
    stopDetection() {
        this.observer.disconnect();
        this.observedFields.clear();
    }
    handleMutations(mutations) {
        let shouldRescan = false;
        mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node;
                        if (element.tagName === "INPUT" ||
                            element.querySelector("input") ||
                            element.tagName === "FORM" ||
                            element.querySelector("form")) {
                            shouldRescan = true;
                        }
                    }
                });
            }
            else if (mutation.type === "attributes") {
                const target = mutation.target;
                if (target.tagName === "INPUT" && ["type", "name", "id", "placeholder", "class", "style"].includes(mutation.attributeName || "")) {
                    shouldRescan = true;
                }
            }
        });
        if (shouldRescan) {
            setTimeout(() => this.scanForForms(), 50); // Faster response
        }
    }
    scanForForms() {
        const detectedForms = this.getCurrentForms();
        const fieldCount = detectedForms.reduce((sum, form) => sum + form.fields.length, 0);
        _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.log(`Form detection: Found ${detectedForms.length} forms with ${fieldCount} total fields`);
        this.emitFormsDetected(detectedForms);
    }
    findPasswordFields(trackObserved = true) {
        const selectors = ['input[type="password"]', 'input[name*="password" i]', 'input[id*="password" i]', 'input[placeholder*="password" i]'];
        return this.findFieldsBySelectors(selectors, "password", trackObserved);
    }
    findUsernameFields(trackObserved = true) {
        const selectors = [
            'input[name*="username" i]',
            'input[id*="username" i]',
            'input[placeholder*="username" i]',
            'input[name*="user" i]',
            'input[id*="user" i]',
            'input[name*="login" i]',
            'input[id*="login" i]',
            'input[name*="account" i]',
            'input[id*="account" i]',
            'input[autocomplete="username"]',
        ];
        return this.findFieldsBySelectors(selectors, "username", trackObserved);
    }
    findEmailFields(trackObserved = true) {
        const selectors = [
            'input[type="email"]',
            'input[name*="email" i]',
            'input[id*="email" i]',
            'input[placeholder*="email" i]',
            'input[name*="mail" i]',
            'input[id*="mail" i]',
            'input[autocomplete="email"]',
        ];
        return this.findFieldsBySelectors(selectors, "email", trackObserved);
    }
    findPhoneFields(trackObserved = true) {
        const selectors = [
            'input[type="tel"]',
            'input[name*="phone" i]',
            'input[id*="phone" i]',
            'input[placeholder*="phone" i]',
            'input[name*="mobile" i]',
            'input[id*="mobile" i]',
            'input[placeholder*="mobile" i]',
            'input[name*="tel" i]',
            'input[id*="tel" i]',
            'input[placeholder*="tel" i]',
            'input[autocomplete="tel"]',
            'input[autocomplete="tel-national"]',
        ];
        return this.findFieldsBySelectors(selectors, "phone", trackObserved);
    }
    findFieldsBySelectors(selectors, type, trackObserved = true) {
        const fields = [];
        const seen = new Set();
        selectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                if (seen.has(element))
                    return;
                if (!this.isElementVisibleAndFocusable(element))
                    return;
                if (trackObserved && this.observedFields.has(element))
                    return;
                seen.add(element);
                if (trackObserved)
                    this.observedFields.add(element);
                fields.push(this.createFormField(element, type));
            });
        });
        return fields;
    }
    isElementVisibleAndFocusable(element) {
        if (!element || !document.contains(element) || element.disabled) {
            return false;
        }
        const style = window.getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
            return false;
        }
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.top >= -1000 && rect.left >= -1000;
    }
    getWebsiteFromUrl(url) {
        try {
            return new URL(url).hostname;
        }
        catch {
            return window.location.hostname;
        }
    }
    emitFormsDetected(forms) {
        const event = new CustomEvent("zelfkey:formsDetected", {
            detail: { forms },
        });
        window.dispatchEvent(event);
    }
    getCurrentForms() {
        // Fresh scan for fill paths; do not skip via observedFields.
        const passwordFields = this.findPasswordFields(false);
        const usernameFields = this.findUsernameFields(false);
        const emailFields = this.findEmailFields(false);
        const phoneFields = this.findPhoneFields(false);
        const allFields = [...passwordFields, ...usernameFields, ...emailFields, ...phoneFields];
        // Keep icon tracking in sync for newly seen fields.
        allFields.forEach((field) => this.observedFields.add(field.element));
        return this.groupFieldsByForm(allFields);
    }
    createFormField(element, type) {
        return {
            element,
            type,
            name: element.name || undefined,
            id: element.id || undefined,
            placeholder: element.placeholder || undefined,
        };
    }
    groupFieldsByForm(fields) {
        const formGroups = new Map();
        const orphanFields = [];
        fields.forEach((field) => {
            const form = field.element.closest("form");
            if (form) {
                if (!formGroups.has(form)) {
                    formGroups.set(form, []);
                }
                formGroups.get(form).push(field);
            }
            else {
                orphanFields.push(field);
            }
        });
        const detected = Array.from(formGroups.entries()).map(([form, formFields]) => ({
            form,
            fields: formFields,
            website: this.getWebsiteFromUrl(window.location.href),
        }));
        if (orphanFields.length > 0) {
            detected.push({
                form: null,
                fields: orphanFields,
                website: this.getWebsiteFromUrl(window.location.href),
            });
        }
        return detected;
    }
}


/***/ },

/***/ "./content-scripts/autofill/services/password-manager.ts"
/*!***************************************************************!*\
  !*** ./content-scripts/autofill/services/password-manager.ts ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PasswordManager: () => (/* binding */ PasswordManager)
/* harmony export */ });
/* harmony import */ var _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @extension-scripts/logger/logger.class */ "./extension-scripts/logger/logger.class.ts");
/* harmony import */ var _communication__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./communication */ "./content-scripts/autofill/services/communication.ts");


class PasswordManager {
    constructor() {
        this.cachedPasswords = new Map();
        this.communicationService = _communication__WEBPACK_IMPORTED_MODULE_1__.CommunicationService.getInstance();
    }
    async getPasswordsForWebsite(website) {
        try {
            const passwords = await this.communicationService.getPasswords(website);
            this.cachedPasswords.set(website, passwords);
            return passwords;
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Error fetching passwords for website:", website, error);
            return [];
        }
    }
    async decryptPassword(requestId) {
        try {
            const result = await this.communicationService.decryptPassword(requestId);
            if (!result || !result.metadata)
                return null;
            return {
                username: result.metadata.username,
                password: result.metadata.password,
            };
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Error decrypting password:", error);
            return null;
        }
    }
    async createNewPassword(urlInfo) {
        try {
            await this.communicationService.createPassword(urlInfo);
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Error creating new password:", error);
        }
    }
    async authenticate() {
        try {
            return await this.communicationService.authenticate();
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Error authenticating:", error);
            return false;
        }
    }
    clearCache() {
        this.cachedPasswords.clear();
    }
    clearCacheForWebsite(website) {
        this.cachedPasswords.delete(website);
    }
    getCachedPasswords(website) {
        return this.cachedPasswords.get(website) || null;
    }
}


/***/ },

/***/ "./content-scripts/autofill/services/ui-overlay.ts"
/*!*********************************************************!*\
  !*** ./content-scripts/autofill/services/ui-overlay.ts ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UIOverlay: () => (/* binding */ UIOverlay)
/* harmony export */ });
/* harmony import */ var _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @extension-scripts/logger/logger.class */ "./extension-scripts/logger/logger.class.ts");
/* harmony import */ var _password_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./password-manager */ "./content-scripts/autofill/services/password-manager.ts");


class UIOverlay {
    constructor() {
        this.clickOutsideHandler = null;
        this.resizeHandler = null;
        this.currentField = null;
        this.currentFieldType = null;
        this.currentMenu = null;
        this.icons = new Map();
        this.isFetchingPasswords = false;
        this.resizeTimeout = null;
        this._repositionTimeout = null;
        this.passwordManager = new _password_manager__WEBPACK_IMPORTED_MODULE_1__.PasswordManager();
        this.setupStyles();
        // Listen for decryption results from popout
        this._setupDecryptionResultListener();
        // Setup resize listener
        this._setupResizeListener();
    }
    setupStyles() {
        const style = document.createElement("style");
        style.textContent = this.generateStyles();
        document.head.appendChild(style);
    }
    generateStyles() {
        return `
            ${this.getIconStyles()}
            ${this.getMenuStyles()}
            ${this.getMenuItemStyles()}
            ${this.getSpinnerStyles()}
        `;
    }
    getIconStyles() {
        return `
            .zelfkey-icon {
                position: absolute;
                width: 25px;
                height: 25px;
                cursor: pointer;
                opacity: 0.6;
                z-index: 10000;
                pointer-events: auto;
                transition: opacity 0.2s ease-in-out;
            }
            .zelfkey-icon:hover {
                opacity: 1;
            }
        `;
    }
    getMenuStyles() {
        return `
            .zelfkey-menu {
                position: absolute;
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10001;
                min-width: 200px;
                max-width: 300px;
                max-height: 300px;
                overflow-y: auto;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
        `;
    }
    getMenuItemStyles() {
        return `
            .zelfkey-menu-item {
                padding: 12px 16px;
                cursor: pointer;
                border-bottom: 1px solid #f0f0f0;
                display: flex;
                align-items: center;
                gap: 12px;
                transition: background-color 0.2s ease;
            }
            .zelfkey-menu-item:hover {
                background-color: #f8f9fa;
            }
            .zelfkey-menu-item:last-child {
                border-bottom: none;
            }
            .zelfkey-menu-item--create {
                color: #007bff;
                font-weight: 500;
            }
            .zelfkey-menu-item--create:hover {
                background-color: #e3f2fd;
            }
            .zelfkey-menu-item--loading {
                color: #666;
                font-style: italic;
            }
            .zelfkey-menu-item--no-credentials {
                color: #999;
                font-style: italic;
                text-align: center;
                padding: 16px;
            }
            .zelfkey-menu-item__icon {
                width: 20px;
                height: 20px;
                background: #171717;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: bold;
            }
            .zelfkey-menu-item__content {
                flex: 1;
                min-width: 0;
            }
            .zelfkey-menu-item__title {
                font-weight: 500;
                color: #333;
                margin-bottom: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .zelfkey-menu-item__subtitle {
                font-size: 12px;
                color: #666;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        `;
    }
    getSpinnerStyles() {
        return `
            .zelfkey-menu-item--loading .loading-spinner {
                width: 16px;
                height: 16px;
                border: 2px solid #e0e0e0;
                border-top: 2px solid #007bff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 8px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
    }
    showIconForField(field) {
        if (this.icons.has(field.element)) {
            const icon = this.icons.get(field.element);
            if (icon)
                this._positionIcon(icon);
            return;
        }
        // Don't show icons on buttons or other non-input elements
        if (field.element.tagName !== "INPUT")
            return;
        // Don't show icons on very small inputs (likely decorative or hidden)
        const rect = field.element.getBoundingClientRect();
        if (rect.width < 30 || rect.height < 15)
            return;
        if (!this._isFieldVisibleAndFocusable(field.element))
            return;
        const icon = this.createZelfKeyIcon(field);
        if (!icon)
            return;
        this.icons.set(field.element, icon);
        this._positionIcon(icon);
    }
    hideIconForField(field) {
        const icon = this.icons.get(field.element);
        if (icon) {
            icon.element.remove();
            this.icons.delete(field.element);
        }
    }
    hideAllIcons() {
        this.icons.forEach((icon) => icon.element.remove());
        this.icons.clear();
    }
    getIconCount() {
        return this.icons.size;
    }
    repositionAllIcons() {
        // Debounce repositioning to avoid excessive calls
        if (this._repositionTimeout) {
            clearTimeout(this._repositionTimeout);
        }
        this._repositionTimeout = window.setTimeout(() => {
            this.icons.forEach((icon) => {
                this._positionIcon(icon);
            });
            this._repositionTimeout = null;
        }, 50); // 50ms debounce
    }
    hasIconsInContainer(container) {
        for (const icon of this.icons.values()) {
            const iconRect = icon.element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            // Check if icon is visible within the container
            if (iconRect.top >= containerRect.top &&
                iconRect.bottom <= containerRect.bottom &&
                iconRect.left >= containerRect.left &&
                iconRect.right <= containerRect.right) {
                return true;
            }
        }
        return false;
    }
    validateIcons() {
        const iconsToRemove = [];
        this.icons.forEach((icon, fieldElement) => {
            if (!document.contains(fieldElement) || !document.contains(icon.element)) {
                iconsToRemove.push(fieldElement);
                return;
            }
            if (!this._isFieldVisibleAndFocusable(fieldElement)) {
                this.hideIconForField({ element: fieldElement, type: icon.field.type });
                iconsToRemove.push(fieldElement);
                return;
            }
            this._positionIcon(icon);
        });
        // Remove invalid icons
        iconsToRemove.forEach((fieldElement) => {
            this.icons.delete(fieldElement);
        });
    }
    createZelfKeyIcon(field) {
        if (!document.body || !document.contains(field.element)) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn("Field element no longer in DOM or document.body not available");
            return null;
        }
        // Create isolated icon with selective CSS reset
        const iconElement = document.createElement("div");
        iconElement.style.cssText = `
            position: fixed;
            width: 25px;
            height: 25px;
            cursor: pointer;
            opacity: 0.6;
            z-index: 10000;
            pointer-events: auto;
            isolation: isolate;
            transition: opacity 0.2s ease-in-out;
            display: block;
            margin: 0;
            padding: 0;
            border: none;
            background: none;
            box-shadow: none;
            transform: none;
        `;
        iconElement.innerHTML = this.getZelfKeySVG();
        const position = this.calculateIconPosition(field.element);
        iconElement.style.top = `${position.top}px`;
        iconElement.style.left = `${position.left}px`;
        iconElement.addEventListener("click", (e) => {
            e.stopPropagation();
            this._handleIconClick(field);
        });
        // Add hover effects
        iconElement.addEventListener("mouseenter", () => {
            iconElement.style.opacity = "1";
        });
        iconElement.addEventListener("mouseleave", () => {
            if (!this.isFetchingPasswords) {
                iconElement.style.opacity = "0.6";
            }
        });
        document.body.appendChild(iconElement);
        return {
            element: iconElement,
            field,
            position,
        };
    }
    updateIconLoadingState(icon, isLoading) {
        if (isLoading) {
            icon.element.style.opacity = "0.5";
            icon.element.style.cursor = "not-allowed";
            icon.element.title = "Loading passwords...";
            // Keep the same SVG, just disable interaction
        }
        else {
            icon.element.style.opacity = "0.6";
            icon.element.style.cursor = "pointer";
            icon.element.title = "ZelfKey Autofill";
        }
    }
    updateAllIconsLoadingState(isLoading) {
        this.icons.forEach((icon) => {
            this.updateIconLoadingState(icon, isLoading);
        });
    }
    getZelfKeySVG() {
        return `
            <svg width="25" height="25" viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; width: 25px; height: 25px;">
                <rect width="40" height="39" rx="4" fill="#171717"/>
                <path d="M20.022 5.97266C21.4836 8.01557 23.3686 10.3437 25.7409 12.7465H15.0908C17.3993 10.2408 18.9747 7.83793 20.0265 5.97266H20.022Z" fill="white"/>
                <path d="M7.00455 19.3558C8.88049 18.4255 11.3438 16.9529 13.8117 14.7136C14.0302 14.5173 14.2442 14.3163 14.4491 14.1152H23.97C23.97 14.1152 17.0718 24.1241 13.2972 24.1522C10.1827 24.1802 8.88049 20.5432 7 19.3511L7.00455 19.3558Z" fill="white"/>
                <path d="M20.6291 32.6794C19.4817 31.0759 18.0019 29.248 16.126 27.3594H24.8819C23.0287 29.2807 21.6445 31.132 20.6291 32.6794Z" fill="white"/>
                <path d="M26.269 25.7042C26.1688 25.7977 26.0641 25.8912 25.9639 25.9847H15.7373C15.7373 25.9847 22.7493 15.8449 26.5741 15.8262C29.7659 15.8122 31.0863 19.5287 33.0078 20.7488C31.0545 21.8755 28.6777 23.479 26.2644 25.7042H26.269Z" fill="white"/>
            </svg>
        `;
    }
    _positionIcon(icon) {
        const position = this.calculateIconPosition(icon.field.element);
        // Check if position actually changed to avoid unnecessary updates
        if (icon.position && Math.abs(icon.position.top - position.top) < 1 && Math.abs(icon.position.left - position.left) < 1) {
            return; // Position hasn't changed significantly
        }
        icon.element.style.top = `${position.top}px`;
        icon.element.style.left = `${position.left}px`;
        icon.position = position;
        _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.log("Icon positioning:", icon.field.element, position);
        this._testAndAdjustPosition(icon, icon.field.element);
    }
    async _handleIconClick(field) {
        if (this.isFetchingPasswords)
            return;
        if (!this._isFieldVisibleAndFocusable(field.element)) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn("Field is no longer visible or focusable, aborting menu open");
            return;
        }
        const icon = this.icons.get(field.element);
        if (icon)
            this._positionIcon(icon);
        if (!this._isFieldVisibleAndFocusable(field.element)) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn("Field became invalid after repositioning, aborting menu open");
            return;
        }
        this.currentField = field;
        this.currentFieldType = field.type;
        this._hideMenu();
        this.updateAllIconsLoadingState(true);
        const website = this._extractHostname(window.location.href);
        this.showMenuWithLoading(field);
        this.isFetchingPasswords = true;
        try {
            this.passwordManager.clearCacheForWebsite(website);
            const passwords = await this._fetchPasswordsWithTimeout(website);
            this.updateMenuWithPasswords(passwords);
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Password fetching:", error);
            this.updateMenuWithPasswords([]);
        }
        finally {
            this.isFetchingPasswords = false;
            this.updateAllIconsLoadingState(false);
        }
    }
    showMenuWithLoading(field) {
        this._hideMenu();
        // Final validation before positioning menu - field may have changed
        if (!this._isFieldVisibleAndFocusable(field.element)) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn("Field is no longer valid when positioning menu, aborting");
            return;
        }
        const menu = document.createElement("div");
        menu.className = "zelfkey-menu";
        // Add loading indicator
        const loadingItem = this.createLoadingMenuItem();
        menu.appendChild(loadingItem);
        // Add create new password option (always available)
        const createItem = this.createCreateMenuItem();
        createItem.addEventListener("click", () => this._handleCreatePassword());
        menu.appendChild(createItem);
        // Position the menu - get fresh bounding rect to ensure accurate positioning
        const rect = field.element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        menu.style.top = `${rect.bottom + scrollTop + 5}px`;
        menu.style.left = `${rect.left + scrollLeft}px`;
        menu.style.zIndex = "10001";
        document.body.appendChild(menu);
        this.currentMenu = menu;
        // Add click outside handler
        this.clickOutsideHandler = this._handleClickOutside.bind(this);
        setTimeout(() => {
            document.addEventListener("click", this.clickOutsideHandler, true);
        }, 0);
    }
    updateMenuWithPasswords(passwords) {
        if (!this.currentMenu)
            return;
        // Clear existing content
        this.currentMenu.innerHTML = "";
        // Add existing passwords or "no credentials" message
        if (passwords.length > 0) {
            passwords.forEach((password) => {
                const item = this.createMenuItem(password);
                item.addEventListener("click", () => this._handlePasswordSelect(password));
                this.currentMenu.appendChild(item);
            });
        }
        else {
            // Add "no credentials found" message
            const noCredentialsItem = this.createNoCredentialsMenuItem();
            this.currentMenu.appendChild(noCredentialsItem);
        }
        // Add create new password option
        const createItem = this.createCreateMenuItem();
        createItem.addEventListener("click", () => this._handleCreatePassword());
        this.currentMenu.appendChild(createItem);
    }
    createMenuItem(password) {
        const item = document.createElement("div");
        item.className = "zelfkey-menu-item";
        const hostName = this.extractHostName(password);
        const hostInitial = hostName.charAt(0).toUpperCase();
        const icon = document.createElement("div");
        icon.className = "zelfkey-menu-item__icon";
        icon.textContent = hostInitial;
        const content = document.createElement("div");
        content.className = "zelfkey-menu-item__content";
        const title = document.createElement("div");
        title.className = "zelfkey-menu-item__title";
        title.textContent = hostName;
        const subtitle = document.createElement("div");
        subtitle.className = "zelfkey-menu-item__subtitle";
        subtitle.textContent = this.extractUsername(password);
        content.appendChild(title);
        content.appendChild(subtitle);
        item.appendChild(icon);
        item.appendChild(content);
        return item;
    }
    extractHostName(password) {
        // Check if this is the new format with publicData
        if (password.publicData?.website) {
            try {
                const url = new URL(password.publicData.website);
                return url.hostname;
            }
            catch {
                return password.publicData.website;
            }
        }
        // Fallback to original format
        const source = password.website || password.publicData.website || password.url;
        if (!source)
            return "Unknown";
        try {
            // If it's a full URL, extract the hostname
            if (source.includes("://")) {
                const url = new URL(source);
                return url.hostname;
            }
            // If it already looks like a hostname (contains dots but no protocol)
            if (source.includes(".") && !source.includes(" "))
                return source;
            // Otherwise, use the source as fallback
            return source;
        }
        catch {
            // If URL parsing fails, use the source as is
            return source;
        }
    }
    extractUsername(password) {
        // Check if this is the new format with publicData
        if (password.publicData?.username)
            return password.publicData.username;
        // Fallback to original format
        return password.publicData.username || "No username";
    }
    createLoadingMenuItem() {
        const item = document.createElement("div");
        item.className = "zelfkey-menu-item zelfkey-menu-item--loading";
        const spinner = document.createElement("div");
        spinner.className = "loading-spinner";
        const content = document.createElement("div");
        content.className = "zelfkey-menu-item__content";
        const title = document.createElement("div");
        title.className = "zelfkey-menu-item__title";
        title.textContent = "Loading passwords...";
        content.appendChild(title);
        item.appendChild(spinner);
        item.appendChild(content);
        return item;
    }
    createNoCredentialsMenuItem() {
        const item = document.createElement("div");
        item.className = "zelfkey-menu-item zelfkey-menu-item--no-credentials";
        const content = document.createElement("div");
        content.className = "zelfkey-menu-item__content";
        const title = document.createElement("div");
        title.className = "zelfkey-menu-item__title";
        title.textContent = "No credentials found";
        content.appendChild(title);
        item.appendChild(content);
        return item;
    }
    createCreateMenuItem() {
        const item = document.createElement("div");
        item.className = "zelfkey-menu-item zelfkey-menu-item--create";
        const icon = document.createElement("div");
        icon.className = "zelfkey-menu-item__icon";
        icon.textContent = "+";
        const content = document.createElement("div");
        content.className = "zelfkey-menu-item__content";
        const title = document.createElement("div");
        title.className = "zelfkey-menu-item__title";
        title.textContent = "Create new password";
        content.appendChild(title);
        item.appendChild(icon);
        item.appendChild(content);
        return item;
    }
    async _handlePasswordSelect(password) {
        this._hideMenu();
        if (!this.currentField)
            return;
        // Always open biometrics popout for password decryption
        // The JWT session is just for the API, but we still need biometric verification
        await this._openBiometricsPopout(password);
    }
    async _handleCreatePassword() {
        this._hideMenu();
        const urlInfo = {
            hash: window.location.hash,
            hostname: window.location.hostname,
            href: window.location.href,
            origin: window.location.origin,
            pathname: window.location.pathname,
            port: window.location.port,
            protocol: window.location.protocol,
            search: window.location.search,
            title: document.title,
        };
        await this.passwordManager.createNewPassword(urlInfo);
    }
    async _openBiometricsPopout(password) {
        try {
            if (typeof chrome !== "undefined" && chrome.runtime) {
                const response = await chrome.runtime.sendMessage({
                    type: "OPEN_PASSWORD_DECRYPTOR",
                    payload: {
                        fieldId: this.currentField?.element.id,
                        fieldType: this.currentFieldType,
                        requestId: password.id,
                        type: "password",
                        zelfProof: password.zelfProof || "",
                        publicData: {
                            title: password.website || password.publicData.website,
                            website: password.publicData.website,
                        },
                    },
                });
                if (response?.success) {
                    await this._waitForPopoutAndSendData(password);
                }
                else {
                    _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn("Failed to open popup:", response);
                }
            }
            else {
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn("Chrome runtime not available");
            }
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Password decryption data storage:", error);
        }
    }
    async _waitForPopoutAndSendData(password) {
        try {
            // Wait for popout to be ready (with timeout)
            const maxRetries = 20; // 10 seconds total
            let retries = 0;
            while (retries < maxRetries) {
                try {
                    // Try to send data to the popout
                    const response = await chrome.runtime.sendMessage({
                        type: "SEND_DECRYPTION_DATA_TO_POPOUT",
                        payload: {
                            requestId: password.id,
                            type: "password",
                            zelfProof: password.zelfProof || "",
                            publicData: {
                                title: password.website || password.publicData.website,
                                website: password.publicData.website,
                            },
                            fieldId: this.currentField?.element.id,
                            fieldType: this.currentFieldType,
                        },
                    });
                    if (response?.success)
                        return;
                }
                catch (error) {
                    // Popout not ready yet, continue waiting
                }
                // Wait 500ms before retrying
                await new Promise((resolve) => setTimeout(resolve, 500));
                retries++;
            }
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn("Timeout waiting for popout to be ready");
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Popout communication:", error);
        }
    }
    _setupDecryptionResultListener() {
        // Listen for messages from background script about decryption results
        if (typeof chrome !== "undefined" && chrome.runtime) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                if (message.type === "DECRYPTION_RESULT") {
                    this._handleDecryptionResult(message.payload);
                    sendResponse({ success: true });
                }
                return true; // Keep message channel open
            });
        }
    }
    _setupResizeListener() {
        this.resizeHandler = () => {
            // Debounce resize events to avoid excessive calls
            if (this.resizeTimeout)
                clearTimeout(this.resizeTimeout);
            this.resizeTimeout = window.setTimeout(() => {
                // If menu is open, try to reposition it or close it if field is no longer valid
                if (this.currentMenu && this.currentField) {
                    if (this._isFieldVisibleAndFocusable(this.currentField.element)) {
                        this._repositionMenu();
                    }
                    else {
                        // Field is no longer visible/valid, close the menu
                        this._hideMenu();
                    }
                }
                // Validate icons (removes invalid ones and repositions valid ones)
                this.validateIcons();
                // Also reposition all remaining icons to ensure they're in the correct position
                this.repositionAllIcons();
                this.resizeTimeout = null;
            }, 150); // 150ms debounce
        };
        window.addEventListener("resize", this.resizeHandler);
    }
    destroy() {
        // Clean up resize listener
        if (this.resizeHandler) {
            window.removeEventListener("resize", this.resizeHandler);
            this.resizeHandler = null;
        }
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = null;
        }
        // Clean up reposition timeout
        if (this._repositionTimeout) {
            clearTimeout(this._repositionTimeout);
            this._repositionTimeout = null;
        }
        // Remove all icons
        this.hideAllIcons();
        // Hide menu if open (this will also clean up click handler)
        this._hideMenu();
    }
    _handleDecryptionResult(result) {
        if (result.success && result.data && this.currentField) {
            // Fill the field with the decrypted data
            this._fillField(this.currentField, result.data);
        }
        else if (!result.success) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Password decryption:", result.error);
            // Could show an error message to the user
        }
        else {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.debug("Missing required data for form filling:", {
                success: result.success,
                hasData: !!result.data,
                hasField: !!this.currentField,
            });
        }
    }
    _fillField(field, data) {
        // Fill the specific field that was clicked based on its type (if visible)
        if (this._isFieldVisibleAndFocusable(field.element)) {
            if (field.type === "username" || field.type === "email" || field.type === "phone") {
                if (data.username) {
                    this._setFieldValue(field.element, data.username);
                }
            }
            else if (field.type === "password") {
                if (data.password) {
                    this._setFieldValue(field.element, data.password);
                }
            }
        }
        // Also try to fill other fields in the same form if they exist and are visible
        const form = field.element.closest("form");
        if (!form)
            return;
        // Find and fill username field if current field is password
        if (field.type === "password" && data.username) {
            const usernameField = this._findUsernameFieldInForm(form);
            if (usernameField && usernameField !== field.element && this._isFieldVisibleAndFocusable(usernameField)) {
                this._setFieldValue(usernameField, data.username);
            }
        }
        // Find and fill password field if current field is identity
        else if ((field.type === "username" || field.type === "email" || field.type === "phone") && data.password) {
            const passwordField = form.querySelector('input[type="password"]');
            if (passwordField && passwordField !== field.element && this._isFieldVisibleAndFocusable(passwordField)) {
                this._setFieldValue(passwordField, data.password);
            }
        }
    }
    _isFieldVisibleAndFocusable(element) {
        // Check if element exists
        if (!element)
            return false;
        // Check if element is in the DOM
        if (!document.contains(element))
            return false;
        // Check if element is visible (not hidden by CSS)
        const style = window.getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
            return false;
        }
        // Check if element is not disabled
        if (element.disabled)
            return false;
        // Check if element has positive dimensions (not collapsed)
        const rect = element.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0)
            return false;
        // Check if element is not off-screen
        if (rect.top < -1000 || rect.left < -1000)
            return false;
        return true;
    }
    _findUsernameFieldInForm(form) {
        const selectors = [
            'input[type="email"]',
            'input[type="tel"]',
            'input[type="text"]',
            'input[name*="username" i]',
            'input[name*="email" i]',
            'input[name*="phone" i]',
            'input[id*="username" i]',
            'input[id*="email" i]',
            'input[id*="phone" i]',
        ];
        for (const selector of selectors) {
            const field = form.querySelector(selector);
            if (field && field.type !== "password")
                return field;
        }
        return null;
    }
    _setFieldValue(field, value) {
        field.focus();
        const nativeValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
        if (nativeValueSetter) {
            nativeValueSetter.call(field, value);
        }
        else {
            field.value = value;
        }
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
        field.dispatchEvent(new Event("blur", { bubbles: true }));
    }
    _handleClickOutside(event) {
        if (!this.currentMenu)
            return;
        const target = event.target;
        if (this.currentMenu.contains(target))
            return;
        let clickedOnIcon = false;
        for (const icon of this.icons.values()) {
            if (!icon.element.contains(target))
                continue;
            clickedOnIcon = true;
            break;
        }
        if (!clickedOnIcon)
            this._hideMenu();
    }
    _repositionMenu() {
        if (!this.currentMenu || !this.currentField)
            return;
        const rect = this.currentField.element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        // Check if menu would be off-screen and adjust if needed
        const menuRect = this.currentMenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        let top = rect.bottom + scrollTop + 5;
        let left = rect.left + scrollLeft;
        // Adjust horizontal position if menu would overflow right edge
        if (left + menuRect.width > viewportWidth + scrollLeft) {
            left = viewportWidth + scrollLeft - menuRect.width - 10;
        }
        // Adjust horizontal position if menu would overflow left edge
        if (left < scrollLeft) {
            left = scrollLeft + 10;
        }
        // Adjust vertical position if menu would overflow bottom edge
        if (top + menuRect.height > viewportHeight + scrollTop) {
            // Try positioning above the field instead
            top = rect.top + scrollTop - menuRect.height - 5;
            // If still off-screen at top, position at bottom of viewport
            if (top < scrollTop) {
                top = viewportHeight + scrollTop - menuRect.height - 10;
            }
        }
        this.currentMenu.style.top = `${top}px`;
        this.currentMenu.style.left = `${left}px`;
    }
    _hideMenu() {
        if (this.currentMenu) {
            this.currentMenu.remove();
            this.currentMenu = null;
        }
        if (!this.clickOutsideHandler)
            return;
        document.removeEventListener("click", this.clickOutsideHandler, true);
        this.clickOutsideHandler = null;
    }
    updateIconPositions() {
        this.icons.forEach((icon) => {
            this._positionIcon(icon);
        });
    }
    _extractHostname(url) {
        try {
            const urlObj = new URL(url);
            let hostname = urlObj.hostname;
            if (hostname.startsWith("www."))
                hostname = hostname.substring(4);
            return hostname;
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn("Could not parse URL:", url, error);
            return "localhost";
        }
    }
    async _fetchPasswordsWithTimeout(website) {
        return Promise.race([
            this.passwordManager.getPasswordsForWebsite(website),
            new Promise((resolve) => {
                setTimeout(() => {
                    resolve([]);
                }, 3000);
            }),
        ]);
    }
    calculateIconPosition(element) {
        const rect = element.getBoundingClientRect();
        // Icon size is now 25px (25% larger than 20px)
        const iconSize = 25;
        const padding = 6; // Small padding from the input edge
        // Get computed styles to understand the actual rendered input
        const computedStyle = window.getComputedStyle(element);
        // Calculate the actual content area (excluding borders but including padding)
        const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0;
        const borderRight = parseFloat(computedStyle.borderRightWidth) || 0;
        const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
        // Calculate the actual content area dimensions
        const contentWidth = rect.width - borderLeft - borderRight;
        // For position: fixed, we use viewport coordinates (no scroll offset needed)
        const top = rect.top + (rect.height - iconSize) / 2;
        // Position icon inside the content area on the right side
        // Account for right padding to avoid overlapping with text
        const minContentWidth = iconSize + padding * 2;
        let left;
        if (contentWidth >= minContentWidth) {
            // Content area is wide enough - position inside, accounting for right padding
            const rightPadding = Math.max(padding, paddingRight);
            // Position from the right edge of the input, accounting for right padding
            left = rect.right - iconSize - rightPadding;
            // Safety check: ensure icon is within the input bounds
            const iconRightEdge = left + iconSize;
            if (left < rect.left)
                left = rect.left + 2; // Small margin from left edge
            if (iconRightEdge > rect.right)
                left = rect.right - iconSize - 2; // Small margin from right edge
        }
        else {
            // Content area is too narrow - position just outside the input
            left = rect.right - iconSize - 2;
        }
        return { top, left };
    }
    _testAndAdjustPosition(icon, element) {
        setTimeout(() => {
            const iconRect = icon.element.getBoundingClientRect();
            const inputRect = element.getBoundingClientRect();
            const verticalDistance = Math.abs(iconRect.top - inputRect.top);
            const horizontalDistance = Math.abs(iconRect.left - inputRect.right);
            const verticalTolerance = inputRect.height * 0.5;
            const horizontalTolerance = 30;
            if (verticalDistance > verticalTolerance || horizontalDistance > horizontalTolerance) {
                this._positionIcon(icon);
            }
        }, 100);
    }
}


/***/ },

/***/ "./extension-scripts/environments/environment.ts"
/*!*******************************************************!*\
  !*** ./extension-scripts/environments/environment.ts ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   environment: () => (/* binding */ environment)
/* harmony export */ });
// Development environment
const environment = {
    production: false,
    enableLogging: true,
    includeStackInLogs: false,
    apiBaseUrl: "http://localhost:3050",
};


/***/ },

/***/ "./extension-scripts/logger/logger.class.ts"
/*!**************************************************!*\
  !*** ./extension-scripts/logger/logger.class.ts ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Logger: () => (/* binding */ Logger)
/* harmony export */ });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../environments/environment */ "./extension-scripts/environments/environment.ts");

class Logger {
    static getStack() {
        try {
            const stack = new Error().stack;
            if (!stack)
                return null;
            const stackLines = stack.split("\n");
            const relevantStack = stackLines.slice(4).filter((line) => {
                const trimmed = line.trim();
                return !trimmed.includes("logger.class.ts") && !trimmed.includes("Logger.");
            });
            return relevantStack.length > 0 ? relevantStack.join("\n") : null;
        }
        catch {
            return null;
        }
    }
    static getCallerInfo() {
        try {
            const stack = new Error().stack;
            if (!stack)
                return null;
            const stackLines = stack.split("\n");
            // Stack trace format:
            // 0: Error
            // 1: getCallerInfo
            // 2: logWithCaller
            // 3: log/error/warn/etc (the Logger method)
            // 4: The actual caller (what we want)
            for (let i = 4; i < stackLines.length; i++) {
                const line = stackLines[i].trim();
                // Skip Logger class methods
                if (line.includes("logger.class.ts") || line.includes("Logger."))
                    continue;
                // Match: at functionName (file:line:column) or at file:line:column
                const match = line.match(/at\s+(?:.+?\s+)?\((.+?):(\d+):(\d+)\)/) || line.match(/at\s+(.+?):(\d+):(\d+)/);
                if (!match)
                    continue;
                const filePath = match[1];
                const lineNumber = parseInt(match[2], 10);
                const columnNumber = parseInt(match[3], 10);
                const fileName = filePath.split("/").pop() || filePath.split("\\").pop() || filePath;
                return { file: fileName, line: lineNumber, column: columnNumber };
            }
        }
        catch { }
        return null;
    }
    static logWithCaller(consoleMethod, ...args) {
        if (!this.isEnabled)
            return;
        const callerInfo = this.getCallerInfo();
        const stack = this.includeStack ? this.getStack() : null;
        if (callerInfo) {
            // Include caller info in the log message
            // Chrome DevTools will still show logger.class.ts, but the message will show the actual caller
            const logArgs = [
                `%c${this.PREFIX}%c [${callerInfo.file}:${callerInfo.line}]`,
                "font-weight: bold; color: #4CAF50",
                "font-weight: normal; color: #666; font-size: 0.9em",
                ...args,
            ];
            if (stack)
                logArgs.push(`\n${stack}`);
            consoleMethod(...logArgs);
        }
        else {
            const logArgs = [this.PREFIX, ...args];
            if (stack)
                logArgs.push(`\n${stack}`);
            consoleMethod(...logArgs);
        }
    }
    static log(...args) {
        this.logWithCaller(console.log, ...args);
    }
    static error(...args) {
        this.logWithCaller(console.error, ...args);
    }
    static warn(...args) {
        this.logWithCaller(console.warn, ...args);
    }
    static info(...args) {
        this.logWithCaller(console.info, ...args);
    }
    static debug(...args) {
        this.logWithCaller(console.debug, ...args);
    }
    static trace(...args) {
        if (!this.isEnabled)
            return;
        const callerInfo = this.getCallerInfo();
        const stack = this.includeStack ? this.getStack() : null;
        if (callerInfo) {
            const logArgs = [
                `%c${this.PREFIX}%c [${callerInfo.file}:${callerInfo.line}]`,
                "font-weight: bold; color: #4CAF50",
                "font-weight: normal; color: #666; font-size: 0.9em",
                ...args,
            ];
            // Add stack trace if enabled (console.trace already shows stack, but we can add formatted version)
            if (stack) {
                logArgs.push("\n%cStack trace:", "font-weight: bold; color: #999; font-size: 0.85em");
                logArgs.push(`%c${stack}`, "color: #999; font-size: 0.85em; font-family: monospace");
            }
            console.trace(...logArgs);
        }
        else {
            const logArgs = [this.PREFIX, ...args];
            if (stack) {
                logArgs.push("\n%cStack trace:", "font-weight: bold; color: #999; font-size: 0.85em");
                logArgs.push(`%c${stack}`, "color: #999; font-size: 0.85em; font-family: monospace");
            }
            console.trace(...logArgs);
        }
    }
}
Logger.PREFIX = "[ZELF]:";
Logger.isEnabled = _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.enableLogging ?? false;
Logger.includeStack = _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.includeStackInLogs ?? false;


/***/ },

/***/ "./node_modules/webextension-polyfill/dist/browser-polyfill.js"
/*!*********************************************************************!*\
  !*** ./node_modules/webextension-polyfill/dist/browser-polyfill.js ***!
  \*********************************************************************/
(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [module], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else // removed by dead control flow
{ var mod; }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (module) {
  /* webextension-polyfill - v0.12.0 - Tue May 14 2024 18:01:29 */
  /* -*- Mode: indent-tabs-mode: nil; js-indent-level: 2 -*- */
  /* vim: set sts=2 sw=2 et tw=80: */
  /* This Source Code Form is subject to the terms of the Mozilla Public
   * License, v. 2.0. If a copy of the MPL was not distributed with this
   * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
  "use strict";

  if (!(globalThis.chrome && globalThis.chrome.runtime && globalThis.chrome.runtime.id)) {
    throw new Error("This script should only be loaded in a browser extension.");
  }
  if (!(globalThis.browser && globalThis.browser.runtime && globalThis.browser.runtime.id)) {
    const CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE = "The message port closed before a response was received.";

    // Wrapping the bulk of this polyfill in a one-time-use function is a minor
    // optimization for Firefox. Since Spidermonkey does not fully parse the
    // contents of a function until the first time it's called, and since it will
    // never actually need to be called, this allows the polyfill to be included
    // in Firefox nearly for free.
    const wrapAPIs = extensionAPIs => {
      // NOTE: apiMetadata is associated to the content of the api-metadata.json file
      // at build time by replacing the following "include" with the content of the
      // JSON file.
      const apiMetadata = {
        "alarms": {
          "clear": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "clearAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "get": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "bookmarks": {
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getChildren": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getRecent": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getSubTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTree": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeTree": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "browserAction": {
          "disable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "enable": {
            "minArgs": 0,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "getBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getBadgeText": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "openPopup": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setBadgeBackgroundColor": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setBadgeText": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "browsingData": {
          "remove": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "removeCache": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCookies": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeDownloads": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFormData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeHistory": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeLocalStorage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePasswords": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removePluginData": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "settings": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "commands": {
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "contextMenus": {
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "cookies": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAllCookieStores": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "set": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "devtools": {
          "inspectedWindow": {
            "eval": {
              "minArgs": 1,
              "maxArgs": 2,
              "singleCallbackArg": false
            }
          },
          "panels": {
            "create": {
              "minArgs": 3,
              "maxArgs": 3,
              "singleCallbackArg": true
            },
            "elements": {
              "createSidebarPane": {
                "minArgs": 1,
                "maxArgs": 1
              }
            }
          }
        },
        "downloads": {
          "cancel": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "download": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "erase": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFileIcon": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "open": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "pause": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeFile": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "resume": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "extension": {
          "isAllowedFileSchemeAccess": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "isAllowedIncognitoAccess": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "history": {
          "addUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "deleteRange": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "deleteUrl": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getVisits": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "search": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "i18n": {
          "detectLanguage": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAcceptLanguages": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "identity": {
          "launchWebAuthFlow": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "idle": {
          "queryState": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "management": {
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getSelf": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "setEnabled": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "uninstallSelf": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "notifications": {
          "clear": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPermissionLevel": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        },
        "pageAction": {
          "getPopup": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getTitle": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "hide": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setIcon": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "setPopup": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "setTitle": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          },
          "show": {
            "minArgs": 1,
            "maxArgs": 1,
            "fallbackToNoCallback": true
          }
        },
        "permissions": {
          "contains": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "request": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "runtime": {
          "getBackgroundPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getPlatformInfo": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "openOptionsPage": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "requestUpdateCheck": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "sendMessage": {
            "minArgs": 1,
            "maxArgs": 3
          },
          "sendNativeMessage": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "setUninstallURL": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "sessions": {
          "getDevices": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getRecentlyClosed": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "restore": {
            "minArgs": 0,
            "maxArgs": 1
          }
        },
        "storage": {
          "local": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          },
          "managed": {
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            }
          },
          "sync": {
            "clear": {
              "minArgs": 0,
              "maxArgs": 0
            },
            "get": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "getBytesInUse": {
              "minArgs": 0,
              "maxArgs": 1
            },
            "remove": {
              "minArgs": 1,
              "maxArgs": 1
            },
            "set": {
              "minArgs": 1,
              "maxArgs": 1
            }
          }
        },
        "tabs": {
          "captureVisibleTab": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "create": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "detectLanguage": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "discard": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "duplicate": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "executeScript": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 0
          },
          "getZoom": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getZoomSettings": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goBack": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "goForward": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "highlight": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "insertCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "move": {
            "minArgs": 2,
            "maxArgs": 2
          },
          "query": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "reload": {
            "minArgs": 0,
            "maxArgs": 2
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "removeCSS": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "sendMessage": {
            "minArgs": 2,
            "maxArgs": 3
          },
          "setZoom": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "setZoomSettings": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "update": {
            "minArgs": 1,
            "maxArgs": 2
          }
        },
        "topSites": {
          "get": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "webNavigation": {
          "getAllFrames": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "getFrame": {
            "minArgs": 1,
            "maxArgs": 1
          }
        },
        "webRequest": {
          "handlerBehaviorChanged": {
            "minArgs": 0,
            "maxArgs": 0
          }
        },
        "windows": {
          "create": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "get": {
            "minArgs": 1,
            "maxArgs": 2
          },
          "getAll": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getCurrent": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "getLastFocused": {
            "minArgs": 0,
            "maxArgs": 1
          },
          "remove": {
            "minArgs": 1,
            "maxArgs": 1
          },
          "update": {
            "minArgs": 2,
            "maxArgs": 2
          }
        }
      };
      if (Object.keys(apiMetadata).length === 0) {
        throw new Error("api-metadata.json has not been included in browser-polyfill");
      }

      /**
       * A WeakMap subclass which creates and stores a value for any key which does
       * not exist when accessed, but behaves exactly as an ordinary WeakMap
       * otherwise.
       *
       * @param {function} createItem
       *        A function which will be called in order to create the value for any
       *        key which does not exist, the first time it is accessed. The
       *        function receives, as its only argument, the key being created.
       */
      class DefaultWeakMap extends WeakMap {
        constructor(createItem, items = undefined) {
          super(items);
          this.createItem = createItem;
        }
        get(key) {
          if (!this.has(key)) {
            this.set(key, this.createItem(key));
          }
          return super.get(key);
        }
      }

      /**
       * Returns true if the given object is an object with a `then` method, and can
       * therefore be assumed to behave as a Promise.
       *
       * @param {*} value The value to test.
       * @returns {boolean} True if the value is thenable.
       */
      const isThenable = value => {
        return value && typeof value === "object" && typeof value.then === "function";
      };

      /**
       * Creates and returns a function which, when called, will resolve or reject
       * the given promise based on how it is called:
       *
       * - If, when called, `chrome.runtime.lastError` contains a non-null object,
       *   the promise is rejected with that value.
       * - If the function is called with exactly one argument, the promise is
       *   resolved to that value.
       * - Otherwise, the promise is resolved to an array containing all of the
       *   function's arguments.
       *
       * @param {object} promise
       *        An object containing the resolution and rejection functions of a
       *        promise.
       * @param {function} promise.resolve
       *        The promise's resolution function.
       * @param {function} promise.reject
       *        The promise's rejection function.
       * @param {object} metadata
       *        Metadata about the wrapped method which has created the callback.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function}
       *        The generated callback function.
       */
      const makeCallback = (promise, metadata) => {
        return (...callbackArgs) => {
          if (extensionAPIs.runtime.lastError) {
            promise.reject(new Error(extensionAPIs.runtime.lastError.message));
          } else if (metadata.singleCallbackArg || callbackArgs.length <= 1 && metadata.singleCallbackArg !== false) {
            promise.resolve(callbackArgs[0]);
          } else {
            promise.resolve(callbackArgs);
          }
        };
      };
      const pluralizeArguments = numArgs => numArgs == 1 ? "argument" : "arguments";

      /**
       * Creates a wrapper function for a method with the given name and metadata.
       *
       * @param {string} name
       *        The name of the method which is being wrapped.
       * @param {object} metadata
       *        Metadata about the method being wrapped.
       * @param {integer} metadata.minArgs
       *        The minimum number of arguments which must be passed to the
       *        function. If called with fewer than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {integer} metadata.maxArgs
       *        The maximum number of arguments which may be passed to the
       *        function. If called with more than this number of arguments, the
       *        wrapper will raise an exception.
       * @param {boolean} metadata.singleCallbackArg
       *        Whether or not the promise is resolved with only the first
       *        argument of the callback, alternatively an array of all the
       *        callback arguments is resolved. By default, if the callback
       *        function is invoked with only a single argument, that will be
       *        resolved to the promise, while all arguments will be resolved as
       *        an array if multiple are given.
       *
       * @returns {function(object, ...*)}
       *       The generated wrapper function.
       */
      const wrapAsyncFunction = (name, metadata) => {
        return function asyncFunctionWrapper(target, ...args) {
          if (args.length < metadata.minArgs) {
            throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
          }
          if (args.length > metadata.maxArgs) {
            throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
          }
          return new Promise((resolve, reject) => {
            if (metadata.fallbackToNoCallback) {
              // This API method has currently no callback on Chrome, but it return a promise on Firefox,
              // and so the polyfill will try to call it with a callback first, and it will fallback
              // to not passing the callback if the first call fails.
              try {
                target[name](...args, makeCallback({
                  resolve,
                  reject
                }, metadata));
              } catch (cbError) {
                console.warn(`${name} API method doesn't seem to support the callback parameter, ` + "falling back to call it without a callback: ", cbError);
                target[name](...args);

                // Update the API method metadata, so that the next API calls will not try to
                // use the unsupported callback anymore.
                metadata.fallbackToNoCallback = false;
                metadata.noCallback = true;
                resolve();
              }
            } else if (metadata.noCallback) {
              target[name](...args);
              resolve();
            } else {
              target[name](...args, makeCallback({
                resolve,
                reject
              }, metadata));
            }
          });
        };
      };

      /**
       * Wraps an existing method of the target object, so that calls to it are
       * intercepted by the given wrapper function. The wrapper function receives,
       * as its first argument, the original `target` object, followed by each of
       * the arguments passed to the original method.
       *
       * @param {object} target
       *        The original target object that the wrapped method belongs to.
       * @param {function} method
       *        The method being wrapped. This is used as the target of the Proxy
       *        object which is created to wrap the method.
       * @param {function} wrapper
       *        The wrapper function which is called in place of a direct invocation
       *        of the wrapped method.
       *
       * @returns {Proxy<function>}
       *        A Proxy object for the given method, which invokes the given wrapper
       *        method in its place.
       */
      const wrapMethod = (target, method, wrapper) => {
        return new Proxy(method, {
          apply(targetMethod, thisObj, args) {
            return wrapper.call(thisObj, target, ...args);
          }
        });
      };
      let hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty);

      /**
       * Wraps an object in a Proxy which intercepts and wraps certain methods
       * based on the given `wrappers` and `metadata` objects.
       *
       * @param {object} target
       *        The target object to wrap.
       *
       * @param {object} [wrappers = {}]
       *        An object tree containing wrapper functions for special cases. Any
       *        function present in this object tree is called in place of the
       *        method in the same location in the `target` object tree. These
       *        wrapper methods are invoked as described in {@see wrapMethod}.
       *
       * @param {object} [metadata = {}]
       *        An object tree containing metadata used to automatically generate
       *        Promise-based wrapper functions for asynchronous. Any function in
       *        the `target` object tree which has a corresponding metadata object
       *        in the same location in the `metadata` tree is replaced with an
       *        automatically-generated wrapper function, as described in
       *        {@see wrapAsyncFunction}
       *
       * @returns {Proxy<object>}
       */
      const wrapObject = (target, wrappers = {}, metadata = {}) => {
        let cache = Object.create(null);
        let handlers = {
          has(proxyTarget, prop) {
            return prop in target || prop in cache;
          },
          get(proxyTarget, prop, receiver) {
            if (prop in cache) {
              return cache[prop];
            }
            if (!(prop in target)) {
              return undefined;
            }
            let value = target[prop];
            if (typeof value === "function") {
              // This is a method on the underlying object. Check if we need to do
              // any wrapping.

              if (typeof wrappers[prop] === "function") {
                // We have a special-case wrapper for this method.
                value = wrapMethod(target, target[prop], wrappers[prop]);
              } else if (hasOwnProperty(metadata, prop)) {
                // This is an async method that we have metadata for. Create a
                // Promise wrapper for it.
                let wrapper = wrapAsyncFunction(prop, metadata[prop]);
                value = wrapMethod(target, target[prop], wrapper);
              } else {
                // This is a method that we don't know or care about. Return the
                // original method, bound to the underlying object.
                value = value.bind(target);
              }
            } else if (typeof value === "object" && value !== null && (hasOwnProperty(wrappers, prop) || hasOwnProperty(metadata, prop))) {
              // This is an object that we need to do some wrapping for the children
              // of. Create a sub-object wrapper for it with the appropriate child
              // metadata.
              value = wrapObject(value, wrappers[prop], metadata[prop]);
            } else if (hasOwnProperty(metadata, "*")) {
              // Wrap all properties in * namespace.
              value = wrapObject(value, wrappers[prop], metadata["*"]);
            } else {
              // We don't need to do any wrapping for this property,
              // so just forward all access to the underlying object.
              Object.defineProperty(cache, prop, {
                configurable: true,
                enumerable: true,
                get() {
                  return target[prop];
                },
                set(value) {
                  target[prop] = value;
                }
              });
              return value;
            }
            cache[prop] = value;
            return value;
          },
          set(proxyTarget, prop, value, receiver) {
            if (prop in cache) {
              cache[prop] = value;
            } else {
              target[prop] = value;
            }
            return true;
          },
          defineProperty(proxyTarget, prop, desc) {
            return Reflect.defineProperty(cache, prop, desc);
          },
          deleteProperty(proxyTarget, prop) {
            return Reflect.deleteProperty(cache, prop);
          }
        };

        // Per contract of the Proxy API, the "get" proxy handler must return the
        // original value of the target if that value is declared read-only and
        // non-configurable. For this reason, we create an object with the
        // prototype set to `target` instead of using `target` directly.
        // Otherwise we cannot return a custom object for APIs that
        // are declared read-only and non-configurable, such as `chrome.devtools`.
        //
        // The proxy handlers themselves will still use the original `target`
        // instead of the `proxyTarget`, so that the methods and properties are
        // dereferenced via the original targets.
        let proxyTarget = Object.create(target);
        return new Proxy(proxyTarget, handlers);
      };

      /**
       * Creates a set of wrapper functions for an event object, which handles
       * wrapping of listener functions that those messages are passed.
       *
       * A single wrapper is created for each listener function, and stored in a
       * map. Subsequent calls to `addListener`, `hasListener`, or `removeListener`
       * retrieve the original wrapper, so that  attempts to remove a
       * previously-added listener work as expected.
       *
       * @param {DefaultWeakMap<function, function>} wrapperMap
       *        A DefaultWeakMap object which will create the appropriate wrapper
       *        for a given listener function when one does not exist, and retrieve
       *        an existing one when it does.
       *
       * @returns {object}
       */
      const wrapEvent = wrapperMap => ({
        addListener(target, listener, ...args) {
          target.addListener(wrapperMap.get(listener), ...args);
        },
        hasListener(target, listener) {
          return target.hasListener(wrapperMap.get(listener));
        },
        removeListener(target, listener) {
          target.removeListener(wrapperMap.get(listener));
        }
      });
      const onRequestFinishedWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps an onRequestFinished listener function so that it will return a
         * `getContent()` property which returns a `Promise` rather than using a
         * callback API.
         *
         * @param {object} req
         *        The HAR entry object representing the network request.
         */
        return function onRequestFinished(req) {
          const wrappedReq = wrapObject(req, {} /* wrappers */, {
            getContent: {
              minArgs: 0,
              maxArgs: 0
            }
          });
          listener(wrappedReq);
        };
      });
      const onMessageWrappers = new DefaultWeakMap(listener => {
        if (typeof listener !== "function") {
          return listener;
        }

        /**
         * Wraps a message listener function so that it may send responses based on
         * its return value, rather than by returning a sentinel value and calling a
         * callback. If the listener function returns a Promise, the response is
         * sent when the promise either resolves or rejects.
         *
         * @param {*} message
         *        The message sent by the other end of the channel.
         * @param {object} sender
         *        Details about the sender of the message.
         * @param {function(*)} sendResponse
         *        A callback which, when called with an arbitrary argument, sends
         *        that value as a response.
         * @returns {boolean}
         *        True if the wrapped listener returned a Promise, which will later
         *        yield a response. False otherwise.
         */
        return function onMessage(message, sender, sendResponse) {
          let didCallSendResponse = false;
          let wrappedSendResponse;
          let sendResponsePromise = new Promise(resolve => {
            wrappedSendResponse = function (response) {
              didCallSendResponse = true;
              resolve(response);
            };
          });
          let result;
          try {
            result = listener(message, sender, wrappedSendResponse);
          } catch (err) {
            result = Promise.reject(err);
          }
          const isResultThenable = result !== true && isThenable(result);

          // If the listener didn't returned true or a Promise, or called
          // wrappedSendResponse synchronously, we can exit earlier
          // because there will be no response sent from this listener.
          if (result !== true && !isResultThenable && !didCallSendResponse) {
            return false;
          }

          // A small helper to send the message if the promise resolves
          // and an error if the promise rejects (a wrapped sendMessage has
          // to translate the message into a resolved promise or a rejected
          // promise).
          const sendPromisedResult = promise => {
            promise.then(msg => {
              // send the message value.
              sendResponse(msg);
            }, error => {
              // Send a JSON representation of the error if the rejected value
              // is an instance of error, or the object itself otherwise.
              let message;
              if (error && (error instanceof Error || typeof error.message === "string")) {
                message = error.message;
              } else {
                message = "An unexpected error occurred";
              }
              sendResponse({
                __mozWebExtensionPolyfillReject__: true,
                message
              });
            }).catch(err => {
              // Print an error on the console if unable to send the response.
              console.error("Failed to send onMessage rejected reply", err);
            });
          };

          // If the listener returned a Promise, send the resolved value as a
          // result, otherwise wait the promise related to the wrappedSendResponse
          // callback to resolve and send it as a response.
          if (isResultThenable) {
            sendPromisedResult(result);
          } else {
            sendPromisedResult(sendResponsePromise);
          }

          // Let Chrome know that the listener is replying.
          return true;
        };
      });
      const wrappedSendMessageCallback = ({
        reject,
        resolve
      }, reply) => {
        if (extensionAPIs.runtime.lastError) {
          // Detect when none of the listeners replied to the sendMessage call and resolve
          // the promise to undefined as in Firefox.
          // See https://github.com/mozilla/webextension-polyfill/issues/130
          if (extensionAPIs.runtime.lastError.message === CHROME_SEND_MESSAGE_CALLBACK_NO_RESPONSE_MESSAGE) {
            resolve();
          } else {
            reject(new Error(extensionAPIs.runtime.lastError.message));
          }
        } else if (reply && reply.__mozWebExtensionPolyfillReject__) {
          // Convert back the JSON representation of the error into
          // an Error instance.
          reject(new Error(reply.message));
        } else {
          resolve(reply);
        }
      };
      const wrappedSendMessage = (name, metadata, apiNamespaceObj, ...args) => {
        if (args.length < metadata.minArgs) {
          throw new Error(`Expected at least ${metadata.minArgs} ${pluralizeArguments(metadata.minArgs)} for ${name}(), got ${args.length}`);
        }
        if (args.length > metadata.maxArgs) {
          throw new Error(`Expected at most ${metadata.maxArgs} ${pluralizeArguments(metadata.maxArgs)} for ${name}(), got ${args.length}`);
        }
        return new Promise((resolve, reject) => {
          const wrappedCb = wrappedSendMessageCallback.bind(null, {
            resolve,
            reject
          });
          args.push(wrappedCb);
          apiNamespaceObj.sendMessage(...args);
        });
      };
      const staticWrappers = {
        devtools: {
          network: {
            onRequestFinished: wrapEvent(onRequestFinishedWrappers)
          }
        },
        runtime: {
          onMessage: wrapEvent(onMessageWrappers),
          onMessageExternal: wrapEvent(onMessageWrappers),
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 1,
            maxArgs: 3
          })
        },
        tabs: {
          sendMessage: wrappedSendMessage.bind(null, "sendMessage", {
            minArgs: 2,
            maxArgs: 3
          })
        }
      };
      const settingMetadata = {
        clear: {
          minArgs: 1,
          maxArgs: 1
        },
        get: {
          minArgs: 1,
          maxArgs: 1
        },
        set: {
          minArgs: 1,
          maxArgs: 1
        }
      };
      apiMetadata.privacy = {
        network: {
          "*": settingMetadata
        },
        services: {
          "*": settingMetadata
        },
        websites: {
          "*": settingMetadata
        }
      };
      return wrapObject(extensionAPIs, staticWrappers, apiMetadata);
    };

    // The build process adds a UMD wrapper around this file, which makes the
    // `module` variable available.
    module.exports = wrapAPIs(chrome);
  } else {
    module.exports = globalThis.browser;
  }
});
//# sourceMappingURL=browser-polyfill.js.map


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			const getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter/value functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			if(Array.isArray(definition)) {
/******/ 				var i = 0;
/******/ 				while(i < definition.length) {
/******/ 					var key = definition[i++];
/******/ 					var binding = definition[i++];
/******/ 					if(!__webpack_require__.o(exports, key)) {
/******/ 						if(binding === 0) {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 						} else {
/******/ 							Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 						}
/******/ 					} else if(binding === 0) { i++; }
/******/ 				}
/******/ 			} else {
/******/ 				for(var key in definition) {
/******/ 					if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!**********************************************!*\
  !*** ./content-scripts/autofill/autofill.ts ***!
  \**********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @extension-scripts/logger/logger.class */ "./extension-scripts/logger/logger.class.ts");
/* harmony import */ var _services_autofill_engine__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services/autofill-engine */ "./content-scripts/autofill/services/autofill-engine.ts");
/* harmony import */ var _services_communication__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./services/communication */ "./content-scripts/autofill/services/communication.ts");
/* harmony import */ var _services_form_detector__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./services/form-detector */ "./content-scripts/autofill/services/form-detector.ts");
/* harmony import */ var _services_password_manager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./services/password-manager */ "./content-scripts/autofill/services/password-manager.ts");
/* harmony import */ var _services_ui_overlay__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./services/ui-overlay */ "./content-scripts/autofill/services/ui-overlay.ts");







class AutofillContentScript {
    constructor() {
        this.isInitialized = false;
        this.lastFormCount = 0;
        this.lastUrl = window.location.href;
        this.networkIdleDelay = 500; // ms to wait after last network activity
        this.networkIdleTimeout = null;
        this.pendingRequests = new Set();
        this.rescanInterval = null;
        this.serviceWorkerCheckInterval = null;
        this.serviceWorkerReady = false;
        this.urlCheckInterval = null;
        this.resizeTimeout = null;
        this.scrollTimeout = null;
        this.containerScrollObserver = null;
        this.scrollableElements = new Set();
        this.autofillEngine = new _services_autofill_engine__WEBPACK_IMPORTED_MODULE_2__.AutofillEngine();
        this.communicationService = _services_communication__WEBPACK_IMPORTED_MODULE_3__.CommunicationService.getInstance();
        this.formDetector = new _services_form_detector__WEBPACK_IMPORTED_MODULE_4__.FormDetector();
        this.passwordManager = new _services_password_manager__WEBPACK_IMPORTED_MODULE_5__.PasswordManager();
        this.uiOverlay = new _services_ui_overlay__WEBPACK_IMPORTED_MODULE_6__.UIOverlay();
    }
    async initialize() {
        if (this.isInitialized)
            return;
        try {
            this.setupEventListeners();
            this.setupCommunication();
            this.setupMonitoring();
            this.setupNetworkIdleDetection();
            this.isInitialized = true;
            this.performImmediateFormDetection();
            // Also perform a quick rescan after a short delay to catch any missed forms
            setTimeout(() => {
                this.performQuickRescan();
            }, 50);
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__.Logger.error("Autofill initialization", error);
        }
    }
    performImmediateFormDetection() {
        this.formDetector.startDetection();
        const currentForms = this.formDetector.getCurrentForms();
        if (currentForms.length > 0) {
            currentForms.forEach((form) => {
                this.processForm(form);
            });
        }
        this.setupDOMLoadListeners();
        this.startPeriodicRescan();
        // Additional delayed scans for dynamic content
        this.scheduleDelayedScans();
    }
    setupDOMLoadListeners() {
        window.addEventListener("load", () => {
            this.performQuickRescan();
            setTimeout(() => {
                this.performQuickRescan();
            }, 100);
        });
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => {
                this.performQuickRescan();
            });
        }
        document.addEventListener("readystatechange", () => {
            if (document.readyState === "complete") {
                this.performQuickRescan();
            }
        });
        document.addEventListener("load", (event) => {
            if (event.target instanceof HTMLImageElement) {
                this.performQuickRescan();
            }
        }, true);
        document.addEventListener("load", (event) => {
            if (event.target instanceof HTMLScriptElement) {
                this.performQuickRescan();
            }
        }, true);
    }
    performQuickRescan() {
        try {
            const currentForms = this.formDetector.getCurrentForms();
            currentForms.forEach((form) => {
                this.processForm(form);
            });
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__.Logger.error("Quick rescan", error);
        }
    }
    startFormDetection() {
        if (this.serviceWorkerReady) {
            // Start form detection when service worker is ready
            this.formDetector.startDetection();
            this.startPeriodicRescan();
        }
    }
    startPeriodicRescan() {
        // Clear any existing interval
        if (this.rescanInterval)
            clearInterval(this.rescanInterval);
        // Rescan every 5 seconds to catch dynamically added forms (reduced frequency)
        this.rescanInterval = setInterval(() => {
            this.performRescan();
        }, 5000);
        // Reposition icons every 10 seconds to handle layout changes (reduced frequency)
        setInterval(() => {
            this.uiOverlay.repositionAllIcons();
        }, 10000);
    }
    performRescan() {
        try {
            const currentForms = this.formDetector.getCurrentForms();
            const currentFormCount = currentForms.length;
            const currentIconCount = this.uiOverlay.getIconCount();
            if (currentFormCount !== this.lastFormCount) {
                this.lastFormCount = currentFormCount;
                currentForms.forEach((form) => {
                    this.processForm(form);
                });
            }
            this.validateExistingIcons();
            this.handleIconRecovery(currentForms, currentFormCount, currentIconCount);
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__.Logger.error("Periodic rescan", error);
        }
    }
    validateExistingIcons() {
        this.uiOverlay.validateIcons();
    }
    handleFormsDetected(event) {
        const forms = event.detail.forms;
        forms.forEach((form) => {
            this.processForm(form);
        });
    }
    processForm(form) {
        try {
            const validation = this.autofillEngine.validateForm(form);
            if (!validation.isValid) {
                return;
            }
            form.fields.forEach((field) => {
                if (this.shouldShowIconForField(field)) {
                    try {
                        this.uiOverlay.showIconForField(field);
                    }
                    catch (error) {
                        _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__.Logger.error(`Icon display for ${field.type} field`, error);
                    }
                }
            });
            // Reposition all icons after processing to handle layout changes
            setTimeout(() => {
                this.uiOverlay.repositionAllIcons();
            }, 100);
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__.Logger.error(`Form processing for ${form.fields.length} fields`, error);
        }
    }
    shouldShowIconForField(field) {
        return ["password", "username", "email", "phone"].includes(field.type);
    }
    handleIconRecovery(currentForms, currentFormCount, currentIconCount) {
        if (currentFormCount > 0 && currentIconCount === 0) {
            currentForms.forEach((form) => {
                this.processForm(form);
            });
            return;
        }
        const expectedIcons = currentForms.reduce((count, form) => {
            return count + form.fields.filter((field) => this.shouldShowIconForField(field)).length;
        }, 0);
        if (expectedIcons > currentIconCount && currentFormCount > 0) {
            currentForms.forEach((form) => {
                this.processForm(form);
            });
        }
    }
    handleWindowResize() {
        // Debounce the resize handler
        if (this.resizeTimeout)
            clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.uiOverlay.updateIconPositions();
        }, 100);
    }
    handleWindowScroll() {
        // Debounce the scroll handler
        if (this.scrollTimeout)
            clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            this.uiOverlay.updateIconPositions();
        }, 50);
    }
    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden, hide all icons
            this.uiOverlay.hideAllIcons();
            // Stop form detection
            this.formDetector.stopDetection();
        }
        else {
            // Page is visible again
            // Reset form count to force reprocessing
            this.lastFormCount = 0;
            // Start form detection again
            this.formDetector.startDetection();
            // Force a fresh form detection immediately
            this.formDetector.scanForForms();
            // Process any newly detected forms immediately
            setTimeout(() => {
                this.performQuickRescan();
                this.uiOverlay.repositionAllIcons();
            }, 10); // Very short delay to ensure forms are processed
            // Schedule additional scans to catch any dynamic content
            this.scheduleDelayedScans();
        }
    }
    handlePageShow() {
        // Reset form count to force reprocessing
        this.lastFormCount = 0;
        // Start form detection again
        this.formDetector.startDetection();
        // Force a fresh form detection immediately
        this.formDetector.scanForForms();
        // Process any newly detected forms immediately
        setTimeout(() => {
            this.performQuickRescan();
            this.uiOverlay.repositionAllIcons();
        }, 10); // Very short delay to ensure forms are processed
        // Schedule additional scans to catch any dynamic content
        this.scheduleDelayedScans();
    }
    setupScrollThrottling() {
        let scrollTimeout = null;
        // Listen to scroll on window (for body scroll)
        window.addEventListener("scroll", () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            // Throttle scroll events to update icon positions every 200ms
            scrollTimeout = window.setTimeout(() => {
                this.uiOverlay.repositionAllIcons();
            }, 200);
        }, { passive: true });
        // Also listen to scroll on document for better coverage
        document.addEventListener("scroll", () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = window.setTimeout(() => {
                this.uiOverlay.repositionAllIcons();
            }, 200);
        }, { passive: true });
        // Listen for scroll on any scrollable container
        this.setupContainerScrollListeners();
    }
    setupContainerScrollListeners() {
        // Find all scrollable containers and add scroll listeners
        const scrollableSelectors = [
            '[style*="overflow"]',
            '[style*="overflow-y"]',
            '[style*="overflow-x"]',
            ".scrollable",
            ".scroll-container",
            "[data-scroll]",
        ];
        const addScrollListener = (element) => {
            element.addEventListener("scroll", () => {
                // Only reposition if icons are visible in this container
                if (this.uiOverlay.hasIconsInContainer(element)) {
                    this.uiOverlay.repositionAllIcons();
                }
            }, { passive: true });
        };
        // Add listeners to existing scrollable elements
        scrollableSelectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach(addScrollListener);
        });
        // Watch for new scrollable elements
        this.containerScrollObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType !== Node.ELEMENT_NODE)
                        return;
                    const element = node;
                    scrollableSelectors.forEach((selector) => {
                        if (!element.matches(selector))
                            return;
                        addScrollListener(element);
                        this.scrollableElements.add(element);
                    });
                    scrollableSelectors.forEach((selector) => {
                        element.querySelectorAll(selector).forEach((child) => {
                            addScrollListener(child);
                            this.scrollableElements.add(child);
                        });
                    });
                });
            });
        });
        this.containerScrollObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
    interceptHistoryAPI() {
        // Intercept pushState and replaceState methods
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        history.pushState = (...args) => {
            originalPushState.apply(history, args);
            this.handleLocationChange();
        };
        history.replaceState = (...args) => {
            originalReplaceState.apply(history, args);
            this.handleLocationChange();
        };
    }
    startUrlMonitoring() {
        this.urlCheckInterval = setInterval(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== this.lastUrl) {
                this.lastUrl = currentUrl;
                this.handleLocationChange();
            }
        }, 1000);
    }
    startServiceWorkerMonitoring() {
        this.serviceWorkerCheckInterval = setInterval(() => {
            if (this.serviceWorkerReady) {
                this.clearServiceWorkerInterval();
                return;
            }
            const hasForms = document.querySelectorAll('input[type="password"], input[type="email"], input[type="text"]').length > 0;
            if (hasForms) {
                this.serviceWorkerReady = true;
                this.startFormDetection();
                this.clearServiceWorkerInterval();
            }
        }, 500);
        setTimeout(() => {
            if (!this.serviceWorkerReady) {
                this.serviceWorkerReady = true;
                this.startFormDetection();
                this.clearServiceWorkerInterval();
            }
        }, 5000);
    }
    handleLocationChange() {
        this.uiOverlay.hideAllIcons();
        this.lastFormCount = 0;
        setTimeout(() => {
            this.performQuickRescan();
        }, 500);
        setTimeout(() => {
            this.performQuickRescan();
        }, 1500);
    }
    clearServiceWorkerInterval() {
        if (this.serviceWorkerCheckInterval) {
            clearInterval(this.serviceWorkerCheckInterval);
            this.serviceWorkerCheckInterval = null;
        }
    }
    scheduleDelayedScans() {
        // Schedule multiple delayed scans for dynamic content
        const delays = [100, 500, 1000, 2000, 3000, 5000];
        delays.forEach((delay, index) => {
            setTimeout(() => {
                this.performQuickRescan();
            }, delay);
        });
    }
    setupNetworkIdleDetection() {
        // Monitor fetch requests
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            const requestId = this.generateRequestId();
            this.pendingRequests.add(requestId);
            this.resetNetworkIdleTimeout();
            return originalFetch.apply(window, args).finally(() => {
                this.pendingRequests.delete(requestId);
                this.resetNetworkIdleTimeout();
            });
        };
        // Monitor XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;
        const self = this;
        XMLHttpRequest.prototype.open = function (method, url, async = true, username, password) {
            this._requestId = self.generateRequestId();
            return originalXHROpen.call(this, method, url, async, username, password);
        };
        XMLHttpRequest.prototype.send = function (body) {
            if (this._requestId) {
                self.pendingRequests.add(this._requestId);
                self.resetNetworkIdleTimeout();
                this.addEventListener("loadend", () => {
                    self.pendingRequests.delete(this._requestId);
                    self.resetNetworkIdleTimeout();
                });
            }
            return originalXHRSend.call(this, body);
        };
        // Monitor image loads (common for dynamic content)
        document.addEventListener("load", (event) => {
            if (event.target instanceof HTMLImageElement) {
                const requestId = this.generateRequestId();
                this.pendingRequests.add(requestId);
                this.resetNetworkIdleTimeout();
                event.target.addEventListener("load", () => {
                    this.pendingRequests.delete(requestId);
                    this.resetNetworkIdleTimeout();
                });
                event.target.addEventListener("error", () => {
                    this.pendingRequests.delete(requestId);
                    this.resetNetworkIdleTimeout();
                });
            }
        }, true);
    }
    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    resetNetworkIdleTimeout() {
        if (this.networkIdleTimeout) {
            clearTimeout(this.networkIdleTimeout);
        }
        if (this.pendingRequests.size === 0) {
            this.networkIdleTimeout = setTimeout(() => {
                this.performQuickRescan();
            }, this.networkIdleDelay);
        }
    }
    setupEventListeners() {
        window.addEventListener("zelfkey:formsDetected", this.handleFormsDetected.bind(this));
        window.addEventListener("resize", this.handleWindowResize.bind(this));
        window.addEventListener("scroll", this.handleWindowScroll.bind(this));
        document.addEventListener("visibilitychange", this.handleVisibilityChange.bind(this));
        window.addEventListener("popstate", this.handleLocationChange.bind(this));
        window.addEventListener("pageshow", this.handlePageShow.bind(this));
        // Add throttled scroll handling for icon repositioning
        this.setupScrollThrottling();
        // Listen for extension open requests from the page
        window.addEventListener("message", (event) => {
            if (event.data && event.data.type === "OPEN_ZELF_EXTENSION") {
                this.communicationService.sendMessage({ type: "OPEN_EXTENSION" });
            }
        });
    }
    setupCommunication() {
        this.communicationService.setupMessageListener();
        this.communicationService.onServiceWorkerReady(() => {
            this.serviceWorkerReady = true;
            this.startFormDetection();
        });
    }
    setupMonitoring() {
        this.interceptHistoryAPI();
        this.startUrlMonitoring();
        this.startServiceWorkerMonitoring();
    }
    destroy() {
        this.formDetector.stopDetection();
        this.uiOverlay.hideAllIcons();
        this.passwordManager.clearCache();
        // Clear rescan interval
        if (this.rescanInterval) {
            clearInterval(this.rescanInterval);
            this.rescanInterval = null;
        }
        // Clear URL monitoring interval
        if (this.urlCheckInterval) {
            clearInterval(this.urlCheckInterval);
            this.urlCheckInterval = null;
        }
        // Clear service worker monitoring interval
        if (this.serviceWorkerCheckInterval) {
            clearInterval(this.serviceWorkerCheckInterval);
            this.serviceWorkerCheckInterval = null;
        }
        // Clear network idle timeout
        if (this.networkIdleTimeout) {
            clearTimeout(this.networkIdleTimeout);
            this.networkIdleTimeout = null;
        }
        // Clear pending requests
        this.pendingRequests.clear();
        // Clear timeouts
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = null;
        }
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = null;
        }
        // Clear container scroll observer
        if (this.containerScrollObserver) {
            this.containerScrollObserver.disconnect();
            this.containerScrollObserver = null;
        }
        // Remove scroll listeners from tracked elements
        this.scrollableElements.forEach((element) => {
            element.removeEventListener("scroll", () => { });
        });
        this.scrollableElements.clear();
        window.removeEventListener("zelfkey:formsDetected", this.handleFormsDetected.bind(this));
        window.removeEventListener("resize", this.handleWindowResize.bind(this));
        window.removeEventListener("scroll", this.handleWindowScroll.bind(this));
        document.removeEventListener("visibilitychange", this.handleVisibilityChange.bind(this));
        window.removeEventListener("popstate", this.handleLocationChange.bind(this));
        window.removeEventListener("pageshow", this.handlePageShow.bind(this));
        window.removeEventListener("load", this.performQuickRescan.bind(this));
        document.removeEventListener("DOMContentLoaded", this.performQuickRescan.bind(this));
        document.removeEventListener("readystatechange", this.performQuickRescan.bind(this));
        document.removeEventListener("load", this.performQuickRescan.bind(this));
        this.isInitialized = false;
    }
}
// Initialize the autofill when the script loads
const autofill = new AutofillContentScript();
// Handle different page load states
function initializeAutofill() {
    autofill.initialize();
}
// Wait for DOM to be ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAutofill);
}
else if (document.readyState === "interactive") {
    // DOM is ready but resources might still be loading
    initializeAutofill();
}
else {
    // DOM is fully loaded
    initializeAutofill();
}
window.addEventListener("load", () => {
    // Multiple scans for dynamic content
    setTimeout(() => {
        if (autofill) {
            autofill.performQuickRescan();
        }
    }, 500);
    setTimeout(() => {
        if (autofill) {
            autofill.performQuickRescan();
        }
    }, 2000);
    setTimeout(() => {
        if (autofill) {
            autofill.performQuickRescan();
        }
    }, 5000);
});
// Handle page unload
window.addEventListener("beforeunload", () => {
    autofill.destroy();
});
// Export for potential external use
window.ZelfKeyAutofill = autofill;

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxX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QWMsRUFBRSxHQUFHLEVBQUU7SUFDekMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0FBRUgsb0NBQW9DO0FBQ25DLE1BQWMsQ0FBQyxlQUFlLEdBQUcsUUFBUSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vemVsZi1leHRlbnNpb24vLi9jb250ZW50LXNjcmlwdHMvYXV0b2ZpbGwvc2VydmljZXMvYXV0b2ZpbGwtZW5naW5lLnRzIiwid2VicGFjazovL3plbGYtZXh0ZW5zaW9uLy4vY29udGVudC1zY3JpcHRzL2F1dG9maWxsL3NlcnZpY2VzL2NvbW11bmljYXRpb24udHMiLCJ3ZWJwYWNrOi8vemVsZi1leHRlbnNpb24vLi9jb250ZW50LXNjcmlwdHMvYXV0b2ZpbGwvc2VydmljZXMvZm9ybS1kZXRlY3Rvci50cyIsIndlYnBhY2s6Ly96ZWxmLWV4dGVuc2lvbi8uL2NvbnRlbnQtc2NyaXB0cy9hdXRvZmlsbC9zZXJ2aWNlcy9wYXNzd29yZC1tYW5hZ2VyLnRzIiwid2VicGFjazovL3plbGYtZXh0ZW5zaW9uLy4vY29udGVudC1zY3JpcHRzL2F1dG9maWxsL3NlcnZpY2VzL3VpLW92ZXJsYXkudHMiLCJ3ZWJwYWNrOi8vemVsZi1leHRlbnNpb24vLi9leHRlbnNpb24tc2NyaXB0cy9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnQuZGV2LnRzIiwid2VicGFjazovL3plbGYtZXh0ZW5zaW9uLy4vZXh0ZW5zaW9uLXNjcmlwdHMvbG9nZ2VyL2xvZ2dlci5jbGFzcy50cyIsIndlYnBhY2s6Ly96ZWxmLWV4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy93ZWJleHRlbnNpb24tcG9seWZpbGwvZGlzdC9icm93c2VyLXBvbHlmaWxsLmpzIiwid2VicGFjazovL3plbGYtZXh0ZW5zaW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3plbGYtZXh0ZW5zaW9uL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3plbGYtZXh0ZW5zaW9uL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly96ZWxmLWV4dGVuc2lvbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3plbGYtZXh0ZW5zaW9uL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vemVsZi1leHRlbnNpb24vLi9jb250ZW50LXNjcmlwdHMvYXV0b2ZpbGwvYXV0b2ZpbGwudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRm9ybUZpZWxkLCBEZXRlY3RlZEZvcm0gfSBmcm9tIFwiQHNoYXJlZC90eXBlcy9hdXRvZmlsbC50eXBlc1wiO1xuXG5leHBvcnQgY2xhc3MgQXV0b2ZpbGxFbmdpbmUge1xuICAgIHB1YmxpYyBmaWxsRm9ybShmb3JtOiBEZXRlY3RlZEZvcm0sIHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgdXNlcm5hbWVGaWVsZCA9IHRoaXMuZmluZFVzZXJuYW1lRmllbGQoZm9ybS5maWVsZHMpO1xuICAgICAgICBjb25zdCBwYXNzd29yZEZpZWxkID0gdGhpcy5maW5kUGFzc3dvcmRGaWVsZChmb3JtLmZpZWxkcyk7XG5cbiAgICAgICAgaWYgKHVzZXJuYW1lRmllbGQgJiYgdXNlcm5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsbEZpZWxkKHVzZXJuYW1lRmllbGQsIHVzZXJuYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXNzd29yZEZpZWxkICYmIHBhc3N3b3JkKSB7XG4gICAgICAgICAgICB0aGlzLmZpbGxGaWVsZChwYXNzd29yZEZpZWxkLCBwYXNzd29yZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgZmlsbEZpZWxkKGZpZWxkOiBGb3JtRmllbGQsIHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zZXRGaWVsZFZhbHVlKGZpZWxkLmVsZW1lbnQsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgY2xlYXJGb3JtKGZvcm06IERldGVjdGVkRm9ybSk6IHZvaWQge1xuICAgICAgICBmb3JtLmZpZWxkcy5mb3JFYWNoKChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jbGVhckZpZWxkKGZpZWxkKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyRmllbGQoZmllbGQ6IEZvcm1GaWVsZCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNldEZpZWxkVmFsdWUoZmllbGQuZWxlbWVudCwgXCJcIik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRGaWVsZFZhbHVlKGZpZWxkOiBIVE1MSW5wdXRFbGVtZW50LCB2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsVmFsdWUgPSBmaWVsZC52YWx1ZTtcblxuICAgICAgICBmaWVsZC5mb2N1cygpO1xuXG4gICAgICAgIGNvbnN0IG5hdGl2ZVZhbHVlU2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihIVE1MSW5wdXRFbGVtZW50LnByb3RvdHlwZSwgXCJ2YWx1ZVwiKT8uc2V0O1xuICAgICAgICBpZiAobmF0aXZlVmFsdWVTZXR0ZXIpIHtcbiAgICAgICAgICAgIG5hdGl2ZVZhbHVlU2V0dGVyLmNhbGwoZmllbGQsIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZpZWxkLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBmaWVsZC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIsIHsgYnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogdHJ1ZSB9KSk7XG4gICAgICAgIGZpZWxkLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiY2hhbmdlXCIsIHsgYnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogdHJ1ZSB9KSk7XG4gICAgICAgIGZpZWxkLmRpc3BhdGNoRXZlbnQobmV3IEtleWJvYXJkRXZlbnQoXCJrZXlkb3duXCIsIHsgYnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogdHJ1ZSwga2V5OiBcIkJhY2tzcGFjZVwiIH0pKTtcbiAgICAgICAgZmllbGQuZGlzcGF0Y2hFdmVudChuZXcgS2V5Ym9hcmRFdmVudChcImtleXVwXCIsIHsgYnViYmxlczogdHJ1ZSwgY2FuY2VsYWJsZTogdHJ1ZSwga2V5OiBcIkJhY2tzcGFjZVwiIH0pKTtcbiAgICAgICAgZmllbGQuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgICAgIG5ldyBDdXN0b21FdmVudChcInplbGZrZXk6YXV0b2ZpbGxcIiwge1xuICAgICAgICAgICAgICAgIGRldGFpbDogeyBmaWVsZCwgdmFsdWUsIG9yaWdpbmFsVmFsdWUgfSxcbiAgICAgICAgICAgICAgICBidWJibGVzOiB0cnVlLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgICAgZmllbGQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJibHVyXCIsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5kVXNlcm5hbWVGaWVsZChmaWVsZHM6IEZvcm1GaWVsZFtdKTogRm9ybUZpZWxkIHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IGVtYWlsRmllbGQgPSBmaWVsZHMuZmluZCgoZmllbGQpID0+IGZpZWxkLnR5cGUgPT09IFwiZW1haWxcIik7XG4gICAgICAgIGlmIChlbWFpbEZpZWxkKSByZXR1cm4gZW1haWxGaWVsZDtcblxuICAgICAgICBjb25zdCB1c2VybmFtZUZpZWxkID0gZmllbGRzLmZpbmQoKGZpZWxkKSA9PiBmaWVsZC50eXBlID09PSBcInVzZXJuYW1lXCIpO1xuICAgICAgICBpZiAodXNlcm5hbWVGaWVsZCkgcmV0dXJuIHVzZXJuYW1lRmllbGQ7XG5cbiAgICAgICAgY29uc3QgcGhvbmVGaWVsZCA9IGZpZWxkcy5maW5kKChmaWVsZCkgPT4gZmllbGQudHlwZSA9PT0gXCJwaG9uZVwiKTtcbiAgICAgICAgaWYgKHBob25lRmllbGQpIHJldHVybiBwaG9uZUZpZWxkO1xuXG4gICAgICAgIHJldHVybiBmaWVsZHMuZmluZCgoZmllbGQpID0+IGZpZWxkLnR5cGUgIT09IFwicGFzc3dvcmRcIikgfHwgbnVsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbmRQYXNzd29yZEZpZWxkKGZpZWxkczogRm9ybUZpZWxkW10pOiBGb3JtRmllbGQgfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIGZpZWxkcy5maW5kKChmaWVsZCkgPT4gZmllbGQudHlwZSA9PT0gXCJwYXNzd29yZFwiKSB8fCBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZXRlY3RGb3JtVHlwZShmb3JtOiBEZXRlY3RlZEZvcm0pOiBcImxvZ2luXCIgfCBcInJlZ2lzdGVyXCIgfCBcInVua25vd25cIiB7XG4gICAgICAgIGNvbnN0IHBhc3N3b3JkRmllbGRzID0gZm9ybS5maWVsZHMuZmlsdGVyKChmaWVsZCkgPT4gZmllbGQudHlwZSA9PT0gXCJwYXNzd29yZFwiKTtcbiAgICAgICAgY29uc3QgdXNlcm5hbWVGaWVsZHMgPSBmb3JtLmZpZWxkcy5maWx0ZXIoKGZpZWxkKSA9PiBmaWVsZC50eXBlID09PSBcInVzZXJuYW1lXCIgfHwgZmllbGQudHlwZSA9PT0gXCJlbWFpbFwiIHx8IGZpZWxkLnR5cGUgPT09IFwicGhvbmVcIik7XG5cbiAgICAgICAgLy8gQ2hlY2sgZm9yIGNvbW1vbiByZWdpc3RyYXRpb24gaW5kaWNhdG9yc1xuICAgICAgICBjb25zdCByZWdpc3RyYXRpb25JbmRpY2F0b3JzID0gW1xuICAgICAgICAgICAgXCJjb25maXJtXCIsXG4gICAgICAgICAgICBcInJlcGVhdFwiLFxuICAgICAgICAgICAgXCJ2ZXJpZnlcIixcbiAgICAgICAgICAgIFwiY29uZmlybS1wYXNzd29yZFwiLFxuICAgICAgICAgICAgXCJjb25maXJtX3Bhc3N3b3JkXCIsXG4gICAgICAgICAgICBcInNpZ251cFwiLFxuICAgICAgICAgICAgXCJzaWduLXVwXCIsXG4gICAgICAgICAgICBcInJlZ2lzdGVyXCIsXG4gICAgICAgICAgICBcInJlZ2lzdHJhdGlvblwiLFxuICAgICAgICBdO1xuXG4gICAgICAgIGNvbnN0IGhhc1JlZ2lzdHJhdGlvbkluZGljYXRvciA9IGZvcm0uZmllbGRzLnNvbWUoXG4gICAgICAgICAgICAoZmllbGQpID0+IGZpZWxkLm5hbWUgJiYgcmVnaXN0cmF0aW9uSW5kaWNhdG9ycy5zb21lKChpbmRpY2F0b3IpID0+IGZpZWxkPy5uYW1lPy50b0xvd2VyQ2FzZSgpLmluY2x1ZGVzKGluZGljYXRvcikpXG4gICAgICAgICk7XG5cbiAgICAgICAgaWYgKGhhc1JlZ2lzdHJhdGlvbkluZGljYXRvciB8fCBwYXNzd29yZEZpZWxkcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJyZWdpc3RlclwiO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhc3N3b3JkRmllbGRzLmxlbmd0aCA9PT0gMSAmJiB1c2VybmFtZUZpZWxkcy5sZW5ndGggPj0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIFwibG9naW5cIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBcInVua25vd25cIjtcbiAgICB9XG5cbiAgICBwdWJsaWMgdmFsaWRhdGVGb3JtKGZvcm06IERldGVjdGVkRm9ybSk6IHsgaXNWYWxpZDogYm9vbGVhbjsgZXJyb3JzOiBzdHJpbmdbXSB9IHtcbiAgICAgICAgY29uc3QgZXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgIGlmIChmb3JtLmZpZWxkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKFwiTm8gZm9ybSBmaWVsZHMgZGV0ZWN0ZWRcIik7XG4gICAgICAgICAgICByZXR1cm4geyBpc1ZhbGlkOiBmYWxzZSwgZXJyb3JzIH07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXNzd29yZEZpZWxkcyA9IGZvcm0uZmllbGRzLmZpbHRlcigoZmllbGQpID0+IGZpZWxkLnR5cGUgPT09IFwicGFzc3dvcmRcIik7XG4gICAgICAgIGNvbnN0IHVzZXJuYW1lRmllbGRzID0gZm9ybS5maWVsZHMuZmlsdGVyKChmaWVsZCkgPT4gZmllbGQudHlwZSA9PT0gXCJ1c2VybmFtZVwiIHx8IGZpZWxkLnR5cGUgPT09IFwiZW1haWxcIiB8fCBmaWVsZC50eXBlID09PSBcInBob25lXCIpO1xuXG4gICAgICAgIC8vIEZvciBtdWx0aS1zdGVwIGZvcm1zLCBhbGxvdyBmb3JtcyB3aXRoIGp1c3QgdXNlcm5hbWUgZmllbGRzIChwYXNzd29yZCBtYXkgYXBwZWFyIGxhdGVyKVxuICAgICAgICBpZiAodXNlcm5hbWVGaWVsZHMubGVuZ3RoID09PSAwICYmIHBhc3N3b3JkRmllbGRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgZXJyb3JzLnB1c2goXCJObyB1c2VybmFtZS9lbWFpbCBvciBwYXNzd29yZCBmaWVsZCBmb3VuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHdlIGhhdmUgZmllbGRzIGJ1dCBubyB1c2VybmFtZS9lbWFpbCwgdGhhdCdzIHN0aWxsIHZhbGlkIGZvciBwYXNzd29yZC1vbmx5IGZvcm1zXG4gICAgICAgIGlmICh1c2VybmFtZUZpZWxkcy5sZW5ndGggPT09IDAgJiYgcGFzc3dvcmRGaWVsZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBhIHBhc3N3b3JkLW9ubHkgZm9ybSwgd2hpY2ggaXMgdmFsaWRcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHdlIGhhdmUgdXNlcm5hbWUvZW1haWwgYnV0IG5vIHBhc3N3b3JkLCB0aGF0J3MgdmFsaWQgZm9yIG11bHRpLXN0ZXAgZm9ybXNcbiAgICAgICAgaWYgKHVzZXJuYW1lRmllbGRzLmxlbmd0aCA+IDAgJiYgcGFzc3dvcmRGaWVsZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGlzIGEgdXNlcm5hbWUtb25seSBmb3JtIChsaWtlIFFOQVAgc3RlcCAxKSwgd2hpY2ggaXMgdmFsaWRcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpc1ZhbGlkOiBlcnJvcnMubGVuZ3RoID09PSAwLFxuICAgICAgICAgICAgZXJyb3JzLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRGb3JtRGF0YShmb3JtOiBEZXRlY3RlZEZvcm0pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgICAgICAgY29uc3QgZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXG4gICAgICAgIGZvcm0uZmllbGRzLmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGZpZWxkLmVsZW1lbnQudmFsdWU7XG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBmaWVsZC5uYW1lIHx8IGZpZWxkLmlkIHx8IGZpZWxkLnR5cGU7XG4gICAgICAgICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIHB1YmxpYyBpc0Zvcm1GaWxsZWQoZm9ybTogRGV0ZWN0ZWRGb3JtKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBmb3JtLmZpZWxkcy5ldmVyeSgoZmllbGQpID0+IGZpZWxkLmVsZW1lbnQudmFsdWUudHJpbSgpICE9PSBcIlwiKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0RW1wdHlGaWVsZHMoZm9ybTogRGV0ZWN0ZWRGb3JtKTogRm9ybUZpZWxkW10ge1xuICAgICAgICByZXR1cm4gZm9ybS5maWVsZHMuZmlsdGVyKChmaWVsZCkgPT4gZmllbGQuZWxlbWVudC52YWx1ZS50cmltKCkgPT09IFwiXCIpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEF1dG9maWxsTWVzc2FnZSwgQXV0b2ZpbGxSZXNwb25zZSwgRGVjcnlwdGVkUGFzc3dvcmREYXRhLCBEZXRlY3RlZEZvcm0sIFBhc3N3b3JkRW50cnkgfSBmcm9tIFwiQHNoYXJlZC90eXBlcy9hdXRvZmlsbC50eXBlc1wiO1xuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIkBleHRlbnNpb24tc2NyaXB0cy9sb2dnZXIvbG9nZ2VyLmNsYXNzXCI7XG5pbXBvcnQgeyBBdXRvZmlsbEVuZ2luZSB9IGZyb20gXCIuL2F1dG9maWxsLWVuZ2luZVwiO1xuaW1wb3J0IHsgRm9ybURldGVjdG9yIH0gZnJvbSBcIi4vZm9ybS1kZXRlY3RvclwiO1xuXG4vLyBDaHJvbWUgZXh0ZW5zaW9uIEFQSSBkZWNsYXJhdGlvblxuZGVjbGFyZSBjb25zdCBjaHJvbWU6IGFueTtcblxuZXhwb3J0IGNsYXNzIENvbW11bmljYXRpb25TZXJ2aWNlIHtcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogQ29tbXVuaWNhdGlvblNlcnZpY2U7XG4gICAgcHJpdmF0ZSBzZXJ2aWNlV29ya2VyUmVhZHlDYWxsYmFja3M6ICgoKSA9PiB2b2lkKVtdID0gW107XG4gICAgcHJpdmF0ZSBmb3JtRGV0ZWN0b3I6IEZvcm1EZXRlY3RvcjtcblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogQ29tbXVuaWNhdGlvblNlcnZpY2Uge1xuICAgICAgICBpZiAoIUNvbW11bmljYXRpb25TZXJ2aWNlLmluc3RhbmNlKSBDb21tdW5pY2F0aW9uU2VydmljZS5pbnN0YW5jZSA9IG5ldyBDb21tdW5pY2F0aW9uU2VydmljZSgpO1xuXG4gICAgICAgIHJldHVybiBDb21tdW5pY2F0aW9uU2VydmljZS5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmZvcm1EZXRlY3RvciA9IG5ldyBGb3JtRGV0ZWN0b3IoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZ2V0UGFzc3dvcmRzKHdlYnNpdGU6IHN0cmluZyk6IFByb21pc2U8UGFzc3dvcmRFbnRyeVtdPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZTogQXV0b2ZpbGxSZXNwb25zZSA9IGF3YWl0IHRoaXMuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiR0VUX1BBU1NXT1JEU1wiLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHsgd2Vic2l0ZSB9LFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzICYmIHJlc3BvbnNlLmRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YSBhcyBQYXNzd29yZEVudHJ5W107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIExvZ2dlci5lcnJvcihcIkVycm9yIGZldGNoaW5nIHBhc3N3b3JkczpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGRlY3J5cHRQYXNzd29yZChyZXF1ZXN0SWQ6IHN0cmluZyk6IFByb21pc2U8RGVjcnlwdGVkUGFzc3dvcmREYXRhIHwgbnVsbD4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2U6IEF1dG9maWxsUmVzcG9uc2UgPSBhd2FpdCB0aGlzLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkRFQ1JZUFRfUEFTU1dPUkRcIixcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiB7IHJlcXVlc3RJZCB9LFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzICYmIHJlc3BvbnNlLmRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YSBhcyBEZWNyeXB0ZWRQYXNzd29yZERhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIExvZ2dlci5lcnJvcihcIkVycm9yIGRlY3J5cHRpbmcgcGFzc3dvcmQ6XCIsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGNyZWF0ZVBhc3N3b3JkKHVybEluZm8/OiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiQ1JFQVRFX1BBU1NXT1JEXCIsXG4gICAgICAgICAgICAgICAgcGF5bG9hZDogeyB1cmxJbmZvIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIExvZ2dlci5lcnJvcihcIkVycm9yIG9wZW5pbmcgY3JlYXRlIHBhc3N3b3JkOlwiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgYXV0aGVudGljYXRlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2U6IEF1dG9maWxsUmVzcG9uc2UgPSBhd2FpdCB0aGlzLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkFVVEhFTlRJQ0FURVwiLFxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IHt9LFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5zdWNjZXNzO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiRXJyb3IgYXV0aGVudGljYXRpbmc6XCIsIGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzZW5kTWVzc2FnZShtZXNzYWdlOiBBdXRvZmlsbE1lc3NhZ2UpOiBQcm9taXNlPEF1dG9maWxsUmVzcG9uc2U+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIExvZ2dlci5sb2coXCJTZW5kaW5nIG1lc3NhZ2UgdG8gYmFja2dyb3VuZCBzY3JpcHQ6XCIsIG1lc3NhZ2UpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNocm9tZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjaHJvbWUucnVudGltZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiTWVzc2FnZSB0aW1lb3V0IGFmdGVyIDEwIHNlY29uZHNcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcIk1lc3NhZ2UgdGltZW91dCAtIGJhY2tncm91bmQgc2NyaXB0IGRpZCBub3QgcmVzcG9uZFwiKSk7XG4gICAgICAgICAgICAgICAgfSwgMTAwMDApO1xuXG4gICAgICAgICAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2UobWVzc2FnZSwgKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgIExvZ2dlci5sb2coXCJSZWNlaXZlZCByZXNwb25zZSBmcm9tIGJhY2tncm91bmQgc2NyaXB0OlwiLCByZXNwb25zZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiQ2hyb21lIHJ1bnRpbWUgZXJyb3I6XCIsIGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJDaHJvbWUgZXh0ZW5zaW9uIHJ1bnRpbWUgbm90IGF2YWlsYWJsZVwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXR1cE1lc3NhZ2VMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjaHJvbWUgIT09IFwidW5kZWZpbmVkXCIgJiYgY2hyb21lLnJ1bnRpbWUpIHtcbiAgICAgICAgICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZTogYW55LCBzZW5kZXI6IGFueSwgc2VuZFJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB3aWxsSGFuZGxlID0gdGhpcy5faGFuZGxlTWVzc2FnZShtZXNzYWdlLCBzZW5kUmVzcG9uc2UpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHdpbGxIYW5kbGU7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX2hhbmRsZU1lc3NhZ2UobWVzc2FnZTogYW55LCBzZW5kUmVzcG9uc2U6IChyZXNwb25zZTogYW55KSA9PiB2b2lkKTogYm9vbGVhbiB7XG4gICAgICAgIGlmIChtZXNzYWdlLnR5cGUgPT09IFwiU0VSVklDRV9XT1JLRVJfUkVBRFlcIikge1xuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlV29ya2VyUmVhZHlDYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKCkpO1xuXG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXNzYWdlLnR5cGUgPT09IFwiRklMTF9QQVNTV09SRF9GT1JNXCIpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGxEYXRhID0gbWVzc2FnZS5wYXlsb2FkPy5maWxsRGF0YTtcbiAgICAgICAgICAgIGNvbnN0IHRhYklkID0gbWVzc2FnZS5wYXlsb2FkPy50YWJJZDtcblxuICAgICAgICAgICAgaWYgKCF0YWJJZCkge1xuICAgICAgICAgICAgICAgIExvZ2dlci5lcnJvcihcIk5vIHRhYiBJRCBwcm92aWRlZCBpbiBGSUxMX1BBU1NXT1JEX0ZPUk0gbWVzc2FnZVwiKTtcblxuICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJObyB0YWIgSUQgcHJvdmlkZWRcIiB9KTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl93YWl0Rm9yRm9ybVJlYWR5KGZpbGxEYXRhKTtcblxuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfd2FpdEZvckZvcm1SZWFkeShmaWxsRGF0YT86IGFueSk6IHZvaWQge1xuICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJjb21wbGV0ZVwiKSB7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4gdGhpcy5fY2hlY2tGb3JGb3Jtc0FuZE5vdGlmeShmaWxsRGF0YSkpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jaGVja0ZvckZvcm1zQW5kTm90aWZ5KGZpbGxEYXRhKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9jaGVja0ZvckZvcm1zQW5kTm90aWZ5KGZpbGxEYXRhPzogYW55KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRGb3JtcyA9IHRoaXMuZm9ybURldGVjdG9yLmdldEN1cnJlbnRGb3JtcygpO1xuXG4gICAgICAgIGlmIChjdXJyZW50Rm9ybXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLl9maWxsRm9ybUZpZWxkcyhmaWxsRGF0YSwgY3VycmVudEZvcm1zKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2V0IHVwIG11dGF0aW9uIG9ic2VydmVyIGZvciBkeW5hbWljIGZvcm0gbG9hZGluZ1xuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9ic2VydmVyRm9ybXMgPSB0aGlzLmZvcm1EZXRlY3Rvci5nZXRDdXJyZW50Rm9ybXMoKTtcblxuICAgICAgICAgICAgaWYgKCFvYnNlcnZlckZvcm1zLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuX2ZpbGxGb3JtRmllbGRzKGZpbGxEYXRhLCBvYnNlcnZlckZvcm1zKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVGaWx0ZXI6IFtcInR5cGVcIl0sIC8vIFdhdGNoIGZvciBpbnB1dCB0eXBlIGNoYW5nZXNcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUaW1lb3V0IGFmdGVyIDEwIHNlY29uZHNcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBvYnNlcnZlci5kaXNjb25uZWN0KCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHRpbWVvdXRGb3JtcyA9IHRoaXMuZm9ybURldGVjdG9yLmdldEN1cnJlbnRGb3JtcygpO1xuXG4gICAgICAgICAgICBpZiAodGltZW91dEZvcm1zLmxlbmd0aCA+IDApIHRoaXMuX2ZpbGxGb3JtRmllbGRzKGZpbGxEYXRhLCB0aW1lb3V0Rm9ybXMpO1xuICAgICAgICB9LCAxMDAwMCk7XG4gICAgfVxuXG4gICAgcHVibGljIG9uU2VydmljZVdvcmtlclJlYWR5KGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc2VydmljZVdvcmtlclJlYWR5Q2FsbGJhY2tzLnB1c2goY2FsbGJhY2spO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2ZpbGxGb3JtRmllbGRzKGRhdGE6IHsgdXNlcm5hbWU6IHN0cmluZzsgcGFzc3dvcmQ6IHN0cmluZyB9LCBjdXJyZW50Rm9ybXM6IERldGVjdGVkRm9ybVtdKTogdm9pZCB7XG4gICAgICAgIExvZ2dlci5sb2coXCJBdHRlbXB0aW5nIHRvIGZpbGwgZm9ybSBmaWVsZHMgd2l0aDpcIiwgeyB1c2VybmFtZTogZGF0YS51c2VybmFtZSwgcGFzc3dvcmQ6IFwiKioqXCIgfSk7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRGb3Jtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIExvZ2dlci53YXJuKFwiTm8gZm9ybXMgZGV0ZWN0ZWRcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWRhdGE/LnVzZXJuYW1lICYmICFkYXRhPy5wYXNzd29yZCkge1xuICAgICAgICAgICAgTG9nZ2VyLndhcm4oXCJObyBmaWxsIGRhdGEgcHJvdmlkZWRcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBlbmdpbmUgPSBuZXcgQXV0b2ZpbGxFbmdpbmUoKTtcbiAgICAgICAgbGV0IGZpbGxlZElkZW50aXR5ID0gZmFsc2U7XG4gICAgICAgIGxldCBmaWxsZWRQYXNzd29yZCA9IGZhbHNlO1xuXG4gICAgICAgIGZvciAoY29uc3QgZm9ybSBvZiBjdXJyZW50Rm9ybXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGhhc0lkZW50aXR5ID0gZm9ybS5maWVsZHMuc29tZSgoZmllbGQpID0+IGZpZWxkLnR5cGUgPT09IFwidXNlcm5hbWVcIiB8fCBmaWVsZC50eXBlID09PSBcImVtYWlsXCIgfHwgZmllbGQudHlwZSA9PT0gXCJwaG9uZVwiKTtcbiAgICAgICAgICAgIGNvbnN0IGhhc1Bhc3N3b3JkID0gZm9ybS5maWVsZHMuc29tZSgoZmllbGQpID0+IGZpZWxkLnR5cGUgPT09IFwicGFzc3dvcmRcIik7XG5cbiAgICAgICAgICAgIGlmICghaGFzSWRlbnRpdHkgJiYgIWhhc1Bhc3N3b3JkKSBjb250aW51ZTtcblxuICAgICAgICAgICAgZW5naW5lLmZpbGxGb3JtKGZvcm0sIGRhdGEudXNlcm5hbWUgfHwgXCJcIiwgZGF0YS5wYXNzd29yZCB8fCBcIlwiKTtcbiAgICAgICAgICAgIGZpbGxlZElkZW50aXR5ID0gZmlsbGVkSWRlbnRpdHkgfHwgaGFzSWRlbnRpdHk7XG4gICAgICAgICAgICBmaWxsZWRQYXNzd29yZCA9IGZpbGxlZFBhc3N3b3JkIHx8IGhhc1Bhc3N3b3JkO1xuXG4gICAgICAgICAgICBpZiAoZmlsbGVkSWRlbnRpdHkgJiYgZmlsbGVkUGFzc3dvcmQpIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFmaWxsZWRJZGVudGl0eSkgTG9nZ2VyLndhcm4oXCJObyB1c2VybmFtZS9lbWFpbC9waG9uZSBmaWVsZCBmb3VuZFwiKTtcbiAgICAgICAgaWYgKCFmaWxsZWRQYXNzd29yZCkgTG9nZ2VyLndhcm4oXCJObyBwYXNzd29yZCBmaWVsZCBmb3VuZFwiKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBGb3JtRmllbGQsIERldGVjdGVkRm9ybSB9IGZyb20gXCJAc2hhcmVkL3R5cGVzL2F1dG9maWxsLnR5cGVzXCI7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiQGV4dGVuc2lvbi1zY3JpcHRzL2xvZ2dlci9sb2dnZXIuY2xhc3NcIjtcblxudHlwZSBJZGVudGl0eUZpZWxkVHlwZSA9IFwidXNlcm5hbWVcIiB8IFwiZW1haWxcIiB8IFwicGhvbmVcIiB8IFwicGFzc3dvcmRcIjtcblxuZXhwb3J0IGNsYXNzIEZvcm1EZXRlY3RvciB7XG4gICAgcHJpdmF0ZSBvYnNlcnZlZEZpZWxkczogU2V0PEhUTUxJbnB1dEVsZW1lbnQ+ID0gbmV3IFNldCgpO1xuICAgIHByaXZhdGUgb2JzZXJ2ZXI6IE11dGF0aW9uT2JzZXJ2ZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuaGFuZGxlTXV0YXRpb25zLmJpbmQodGhpcykpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGFydERldGVjdGlvbigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5zY2FuRm9yRm9ybXMoKTtcbiAgICAgICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtcbiAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgICAgYXR0cmlidXRlRmlsdGVyOiBbXCJ0eXBlXCIsIFwibmFtZVwiLCBcImlkXCIsIFwicGxhY2Vob2xkZXJcIiwgXCJjbGFzc1wiLCBcInN0eWxlXCJdLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBbHNvIG1vbml0b3IgZm9yIGFueSBpbnB1dCBlbGVtZW50cyBiZWluZyBhZGRlZFxuICAgICAgICB0aGlzLm9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LCB7XG4gICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogW1widHlwZVwiLCBcIm5hbWVcIiwgXCJpZFwiLCBcInBsYWNlaG9sZGVyXCIsIFwiY2xhc3NcIiwgXCJzdHlsZVwiXSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0b3BEZXRlY3Rpb24oKTogdm9pZCB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICB0aGlzLm9ic2VydmVkRmllbGRzLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVNdXRhdGlvbnMobXV0YXRpb25zOiBNdXRhdGlvblJlY29yZFtdKTogdm9pZCB7XG4gICAgICAgIGxldCBzaG91bGRSZXNjYW4gPSBmYWxzZTtcblxuICAgICAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcbiAgICAgICAgICAgIGlmIChtdXRhdGlvbi50eXBlID09PSBcImNoaWxkTGlzdFwiKSB7XG4gICAgICAgICAgICAgICAgbXV0YXRpb24uYWRkZWROb2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IG5vZGUgYXMgRWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnRhZ05hbWUgPT09IFwiSU5QVVRcIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucXVlcnlTZWxlY3RvcihcImlucHV0XCIpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC50YWdOYW1lID09PSBcIkZPUk1cIiB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQucXVlcnlTZWxlY3RvcihcImZvcm1cIilcbiAgICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3VsZFJlc2NhbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobXV0YXRpb24udHlwZSA9PT0gXCJhdHRyaWJ1dGVzXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBtdXRhdGlvbi50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0LnRhZ05hbWUgPT09IFwiSU5QVVRcIiAmJiBbXCJ0eXBlXCIsIFwibmFtZVwiLCBcImlkXCIsIFwicGxhY2Vob2xkZXJcIiwgXCJjbGFzc1wiLCBcInN0eWxlXCJdLmluY2x1ZGVzKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgfHwgXCJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgc2hvdWxkUmVzY2FuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChzaG91bGRSZXNjYW4pIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zY2FuRm9yRm9ybXMoKSwgNTApOyAvLyBGYXN0ZXIgcmVzcG9uc2VcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzY2FuRm9yRm9ybXMoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRldGVjdGVkRm9ybXMgPSB0aGlzLmdldEN1cnJlbnRGb3JtcygpO1xuXG4gICAgICAgIGNvbnN0IGZpZWxkQ291bnQgPSBkZXRlY3RlZEZvcm1zLnJlZHVjZSgoc3VtLCBmb3JtKSA9PiBzdW0gKyBmb3JtLmZpZWxkcy5sZW5ndGgsIDApO1xuXG4gICAgICAgIExvZ2dlci5sb2coYEZvcm0gZGV0ZWN0aW9uOiBGb3VuZCAke2RldGVjdGVkRm9ybXMubGVuZ3RofSBmb3JtcyB3aXRoICR7ZmllbGRDb3VudH0gdG90YWwgZmllbGRzYCk7XG5cbiAgICAgICAgdGhpcy5lbWl0Rm9ybXNEZXRlY3RlZChkZXRlY3RlZEZvcm1zKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbmRQYXNzd29yZEZpZWxkcyh0cmFja09ic2VydmVkID0gdHJ1ZSk6IEZvcm1GaWVsZFtdIHtcbiAgICAgICAgY29uc3Qgc2VsZWN0b3JzID0gWydpbnB1dFt0eXBlPVwicGFzc3dvcmRcIl0nLCAnaW5wdXRbbmFtZSo9XCJwYXNzd29yZFwiIGldJywgJ2lucHV0W2lkKj1cInBhc3N3b3JkXCIgaV0nLCAnaW5wdXRbcGxhY2Vob2xkZXIqPVwicGFzc3dvcmRcIiBpXSddO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmZpbmRGaWVsZHNCeVNlbGVjdG9ycyhzZWxlY3RvcnMsIFwicGFzc3dvcmRcIiwgdHJhY2tPYnNlcnZlZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5kVXNlcm5hbWVGaWVsZHModHJhY2tPYnNlcnZlZCA9IHRydWUpOiBGb3JtRmllbGRbXSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgICdpbnB1dFtuYW1lKj1cInVzZXJuYW1lXCIgaV0nLFxuICAgICAgICAgICAgJ2lucHV0W2lkKj1cInVzZXJuYW1lXCIgaV0nLFxuICAgICAgICAgICAgJ2lucHV0W3BsYWNlaG9sZGVyKj1cInVzZXJuYW1lXCIgaV0nLFxuICAgICAgICAgICAgJ2lucHV0W25hbWUqPVwidXNlclwiIGldJyxcbiAgICAgICAgICAgICdpbnB1dFtpZCo9XCJ1c2VyXCIgaV0nLFxuICAgICAgICAgICAgJ2lucHV0W25hbWUqPVwibG9naW5cIiBpXScsXG4gICAgICAgICAgICAnaW5wdXRbaWQqPVwibG9naW5cIiBpXScsXG4gICAgICAgICAgICAnaW5wdXRbbmFtZSo9XCJhY2NvdW50XCIgaV0nLFxuICAgICAgICAgICAgJ2lucHV0W2lkKj1cImFjY291bnRcIiBpXScsXG4gICAgICAgICAgICAnaW5wdXRbYXV0b2NvbXBsZXRlPVwidXNlcm5hbWVcIl0nLFxuICAgICAgICBdO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmZpbmRGaWVsZHNCeVNlbGVjdG9ycyhzZWxlY3RvcnMsIFwidXNlcm5hbWVcIiwgdHJhY2tPYnNlcnZlZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5kRW1haWxGaWVsZHModHJhY2tPYnNlcnZlZCA9IHRydWUpOiBGb3JtRmllbGRbXSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgICdpbnB1dFt0eXBlPVwiZW1haWxcIl0nLFxuICAgICAgICAgICAgJ2lucHV0W25hbWUqPVwiZW1haWxcIiBpXScsXG4gICAgICAgICAgICAnaW5wdXRbaWQqPVwiZW1haWxcIiBpXScsXG4gICAgICAgICAgICAnaW5wdXRbcGxhY2Vob2xkZXIqPVwiZW1haWxcIiBpXScsXG4gICAgICAgICAgICAnaW5wdXRbbmFtZSo9XCJtYWlsXCIgaV0nLFxuICAgICAgICAgICAgJ2lucHV0W2lkKj1cIm1haWxcIiBpXScsXG4gICAgICAgICAgICAnaW5wdXRbYXV0b2NvbXBsZXRlPVwiZW1haWxcIl0nLFxuICAgICAgICBdO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmZpbmRGaWVsZHNCeVNlbGVjdG9ycyhzZWxlY3RvcnMsIFwiZW1haWxcIiwgdHJhY2tPYnNlcnZlZCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBmaW5kUGhvbmVGaWVsZHModHJhY2tPYnNlcnZlZCA9IHRydWUpOiBGb3JtRmllbGRbXSB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgICdpbnB1dFt0eXBlPVwidGVsXCJdJyxcbiAgICAgICAgICAgICdpbnB1dFtuYW1lKj1cInBob25lXCIgaV0nLFxuICAgICAgICAgICAgJ2lucHV0W2lkKj1cInBob25lXCIgaV0nLFxuICAgICAgICAgICAgJ2lucHV0W3BsYWNlaG9sZGVyKj1cInBob25lXCIgaV0nLFxuICAgICAgICAgICAgJ2lucHV0W25hbWUqPVwibW9iaWxlXCIgaV0nLFxuICAgICAgICAgICAgJ2lucHV0W2lkKj1cIm1vYmlsZVwiIGldJyxcbiAgICAgICAgICAgICdpbnB1dFtwbGFjZWhvbGRlcio9XCJtb2JpbGVcIiBpXScsXG4gICAgICAgICAgICAnaW5wdXRbbmFtZSo9XCJ0ZWxcIiBpXScsXG4gICAgICAgICAgICAnaW5wdXRbaWQqPVwidGVsXCIgaV0nLFxuICAgICAgICAgICAgJ2lucHV0W3BsYWNlaG9sZGVyKj1cInRlbFwiIGldJyxcbiAgICAgICAgICAgICdpbnB1dFthdXRvY29tcGxldGU9XCJ0ZWxcIl0nLFxuICAgICAgICAgICAgJ2lucHV0W2F1dG9jb21wbGV0ZT1cInRlbC1uYXRpb25hbFwiXScsXG4gICAgICAgIF07XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZEZpZWxkc0J5U2VsZWN0b3JzKHNlbGVjdG9ycywgXCJwaG9uZVwiLCB0cmFja09ic2VydmVkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbmRGaWVsZHNCeVNlbGVjdG9ycyhzZWxlY3RvcnM6IHN0cmluZ1tdLCB0eXBlOiBJZGVudGl0eUZpZWxkVHlwZSwgdHJhY2tPYnNlcnZlZCA9IHRydWUpOiBGb3JtRmllbGRbXSB7XG4gICAgICAgIGNvbnN0IGZpZWxkczogRm9ybUZpZWxkW10gPSBbXTtcbiAgICAgICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQ8SFRNTElucHV0RWxlbWVudD4oKTtcblxuICAgICAgICBzZWxlY3RvcnMuZm9yRWFjaCgoc2VsZWN0b3IpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikgYXMgTm9kZUxpc3RPZjxIVE1MSW5wdXRFbGVtZW50PjtcbiAgICAgICAgICAgIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc2Vlbi5oYXMoZWxlbWVudCkpIHJldHVybjtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNFbGVtZW50VmlzaWJsZUFuZEZvY3VzYWJsZShlbGVtZW50KSkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGlmICh0cmFja09ic2VydmVkICYmIHRoaXMub2JzZXJ2ZWRGaWVsZHMuaGFzKGVsZW1lbnQpKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICBzZWVuLmFkZChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICBpZiAodHJhY2tPYnNlcnZlZCkgdGhpcy5vYnNlcnZlZEZpZWxkcy5hZGQoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgZmllbGRzLnB1c2godGhpcy5jcmVhdGVGb3JtRmllbGQoZWxlbWVudCwgdHlwZSkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmaWVsZHM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpc0VsZW1lbnRWaXNpYmxlQW5kRm9jdXNhYmxlKGVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKCFlbGVtZW50IHx8ICFkb2N1bWVudC5jb250YWlucyhlbGVtZW50KSB8fCBlbGVtZW50LmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuICAgICAgICBpZiAoc3R5bGUuZGlzcGxheSA9PT0gXCJub25lXCIgfHwgc3R5bGUudmlzaWJpbGl0eSA9PT0gXCJoaWRkZW5cIiB8fCBzdHlsZS5vcGFjaXR5ID09PSBcIjBcIikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiByZWN0LndpZHRoID4gMCAmJiByZWN0LmhlaWdodCA+IDAgJiYgcmVjdC50b3AgPj0gLTEwMDAgJiYgcmVjdC5sZWZ0ID49IC0xMDAwO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0V2Vic2l0ZUZyb21VcmwodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBVUkwodXJsKS5ob3N0bmFtZTtcbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlbWl0Rm9ybXNEZXRlY3RlZChmb3JtczogRGV0ZWN0ZWRGb3JtW10pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJ6ZWxma2V5OmZvcm1zRGV0ZWN0ZWRcIiwge1xuICAgICAgICAgICAgZGV0YWlsOiB7IGZvcm1zIH0sXG4gICAgICAgIH0pO1xuICAgICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEN1cnJlbnRGb3JtcygpOiBEZXRlY3RlZEZvcm1bXSB7XG4gICAgICAgIC8vIEZyZXNoIHNjYW4gZm9yIGZpbGwgcGF0aHM7IGRvIG5vdCBza2lwIHZpYSBvYnNlcnZlZEZpZWxkcy5cbiAgICAgICAgY29uc3QgcGFzc3dvcmRGaWVsZHMgPSB0aGlzLmZpbmRQYXNzd29yZEZpZWxkcyhmYWxzZSk7XG4gICAgICAgIGNvbnN0IHVzZXJuYW1lRmllbGRzID0gdGhpcy5maW5kVXNlcm5hbWVGaWVsZHMoZmFsc2UpO1xuICAgICAgICBjb25zdCBlbWFpbEZpZWxkcyA9IHRoaXMuZmluZEVtYWlsRmllbGRzKGZhbHNlKTtcbiAgICAgICAgY29uc3QgcGhvbmVGaWVsZHMgPSB0aGlzLmZpbmRQaG9uZUZpZWxkcyhmYWxzZSk7XG4gICAgICAgIGNvbnN0IGFsbEZpZWxkcyA9IFsuLi5wYXNzd29yZEZpZWxkcywgLi4udXNlcm5hbWVGaWVsZHMsIC4uLmVtYWlsRmllbGRzLCAuLi5waG9uZUZpZWxkc107XG5cbiAgICAgICAgLy8gS2VlcCBpY29uIHRyYWNraW5nIGluIHN5bmMgZm9yIG5ld2x5IHNlZW4gZmllbGRzLlxuICAgICAgICBhbGxGaWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHRoaXMub2JzZXJ2ZWRGaWVsZHMuYWRkKGZpZWxkLmVsZW1lbnQpKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5ncm91cEZpZWxkc0J5Rm9ybShhbGxGaWVsZHMpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlRm9ybUZpZWxkKGVsZW1lbnQ6IEhUTUxJbnB1dEVsZW1lbnQsIHR5cGU6IElkZW50aXR5RmllbGRUeXBlKTogRm9ybUZpZWxkIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgbmFtZTogZWxlbWVudC5uYW1lIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGlkOiBlbGVtZW50LmlkIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyOiBlbGVtZW50LnBsYWNlaG9sZGVyIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdyb3VwRmllbGRzQnlGb3JtKGZpZWxkczogRm9ybUZpZWxkW10pOiBEZXRlY3RlZEZvcm1bXSB7XG4gICAgICAgIGNvbnN0IGZvcm1Hcm91cHMgPSBuZXcgTWFwPEhUTUxGb3JtRWxlbWVudCwgRm9ybUZpZWxkW10+KCk7XG4gICAgICAgIGNvbnN0IG9ycGhhbkZpZWxkczogRm9ybUZpZWxkW10gPSBbXTtcblxuICAgICAgICBmaWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGZvcm0gPSBmaWVsZC5lbGVtZW50LmNsb3Nlc3QoXCJmb3JtXCIpO1xuICAgICAgICAgICAgaWYgKGZvcm0pIHtcbiAgICAgICAgICAgICAgICBpZiAoIWZvcm1Hcm91cHMuaGFzKGZvcm0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1Hcm91cHMuc2V0KGZvcm0sIFtdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9ybUdyb3Vwcy5nZXQoZm9ybSkhLnB1c2goZmllbGQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvcnBoYW5GaWVsZHMucHVzaChmaWVsZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IGRldGVjdGVkOiBEZXRlY3RlZEZvcm1bXSA9IEFycmF5LmZyb20oZm9ybUdyb3Vwcy5lbnRyaWVzKCkpLm1hcCgoW2Zvcm0sIGZvcm1GaWVsZHNdKSA9PiAoe1xuICAgICAgICAgICAgZm9ybSxcbiAgICAgICAgICAgIGZpZWxkczogZm9ybUZpZWxkcyxcbiAgICAgICAgICAgIHdlYnNpdGU6IHRoaXMuZ2V0V2Vic2l0ZUZyb21Vcmwod2luZG93LmxvY2F0aW9uLmhyZWYpLFxuICAgICAgICB9KSk7XG5cbiAgICAgICAgaWYgKG9ycGhhbkZpZWxkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBkZXRlY3RlZC5wdXNoKHtcbiAgICAgICAgICAgICAgICBmb3JtOiBudWxsLFxuICAgICAgICAgICAgICAgIGZpZWxkczogb3JwaGFuRmllbGRzLFxuICAgICAgICAgICAgICAgIHdlYnNpdGU6IHRoaXMuZ2V0V2Vic2l0ZUZyb21Vcmwod2luZG93LmxvY2F0aW9uLmhyZWYpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGV0ZWN0ZWQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgUGFzc3dvcmRFbnRyeSB9IGZyb20gXCJAc2hhcmVkL3R5cGVzL2F1dG9maWxsLnR5cGVzXCI7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiQGV4dGVuc2lvbi1zY3JpcHRzL2xvZ2dlci9sb2dnZXIuY2xhc3NcIjtcbmltcG9ydCB7IENvbW11bmljYXRpb25TZXJ2aWNlIH0gZnJvbSBcIi4vY29tbXVuaWNhdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgUGFzc3dvcmRNYW5hZ2VyIHtcbiAgICBwcml2YXRlIGNvbW11bmljYXRpb25TZXJ2aWNlOiBDb21tdW5pY2F0aW9uU2VydmljZTtcbiAgICBwcml2YXRlIGNhY2hlZFBhc3N3b3JkczogTWFwPHN0cmluZywgUGFzc3dvcmRFbnRyeVtdPiA9IG5ldyBNYXAoKTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmNvbW11bmljYXRpb25TZXJ2aWNlID0gQ29tbXVuaWNhdGlvblNlcnZpY2UuZ2V0SW5zdGFuY2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZ2V0UGFzc3dvcmRzRm9yV2Vic2l0ZSh3ZWJzaXRlOiBzdHJpbmcpOiBQcm9taXNlPFBhc3N3b3JkRW50cnlbXT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGFzc3dvcmRzID0gYXdhaXQgdGhpcy5jb21tdW5pY2F0aW9uU2VydmljZS5nZXRQYXNzd29yZHMod2Vic2l0ZSk7XG5cbiAgICAgICAgICAgIHRoaXMuY2FjaGVkUGFzc3dvcmRzLnNldCh3ZWJzaXRlLCBwYXNzd29yZHMpO1xuXG4gICAgICAgICAgICByZXR1cm4gcGFzc3dvcmRzO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgcGFzc3dvcmRzIGZvciB3ZWJzaXRlOlwiLCB3ZWJzaXRlLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZGVjcnlwdFBhc3N3b3JkKHJlcXVlc3RJZDogc3RyaW5nKTogUHJvbWlzZTx7IHVzZXJuYW1lOiBzdHJpbmc7IHBhc3N3b3JkOiBzdHJpbmcgfSB8IG51bGw+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMuY29tbXVuaWNhdGlvblNlcnZpY2UuZGVjcnlwdFBhc3N3b3JkKHJlcXVlc3RJZCk7XG5cbiAgICAgICAgICAgIGlmICghcmVzdWx0IHx8ICFyZXN1bHQubWV0YWRhdGEpIHJldHVybiBudWxsO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHVzZXJuYW1lOiByZXN1bHQubWV0YWRhdGEudXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgcGFzc3dvcmQ6IHJlc3VsdC5tZXRhZGF0YS5wYXNzd29yZCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJFcnJvciBkZWNyeXB0aW5nIHBhc3N3b3JkOlwiLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBhc3luYyBjcmVhdGVOZXdQYXNzd29yZCh1cmxJbmZvPzogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNvbW11bmljYXRpb25TZXJ2aWNlLmNyZWF0ZVBhc3N3b3JkKHVybEluZm8pO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiRXJyb3IgY3JlYXRpbmcgbmV3IHBhc3N3b3JkOlwiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgYXV0aGVudGljYXRlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuY29tbXVuaWNhdGlvblNlcnZpY2UuYXV0aGVudGljYXRlKCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJFcnJvciBhdXRoZW50aWNhdGluZzpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyQ2FjaGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY2FjaGVkUGFzc3dvcmRzLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyQ2FjaGVGb3JXZWJzaXRlKHdlYnNpdGU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmNhY2hlZFBhc3N3b3Jkcy5kZWxldGUod2Vic2l0ZSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldENhY2hlZFBhc3N3b3Jkcyh3ZWJzaXRlOiBzdHJpbmcpOiBQYXNzd29yZEVudHJ5W10gfCBudWxsIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVkUGFzc3dvcmRzLmdldCh3ZWJzaXRlKSB8fCBudWxsO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFBhc3N3b3JkRW50cnkgfSBmcm9tIFwiQHNoYXJlZC90eXBlcy9hdXRvZmlsbC50eXBlc1wiO1xuaW1wb3J0IHsgRm9ybUZpZWxkLCBaZWxmS2V5SWNvbiwgRGVjcnlwdGVkUGFzc3dvcmREYXRhIH0gZnJvbSBcIkBzaGFyZWQvdHlwZXMvYXV0b2ZpbGwudHlwZXNcIjtcbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCJAZXh0ZW5zaW9uLXNjcmlwdHMvbG9nZ2VyL2xvZ2dlci5jbGFzc1wiO1xuaW1wb3J0IHsgUGFzc3dvcmRNYW5hZ2VyIH0gZnJvbSBcIi4vcGFzc3dvcmQtbWFuYWdlclwiO1xuXG5leHBvcnQgY2xhc3MgVUlPdmVybGF5IHtcbiAgICBwcml2YXRlIGNsaWNrT3V0c2lkZUhhbmRsZXI6ICgoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG4gICAgcHJpdmF0ZSByZXNpemVIYW5kbGVyOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcblxuICAgIHByaXZhdGUgY3VycmVudEZpZWxkOiBGb3JtRmllbGQgfCBudWxsID0gbnVsbDtcbiAgICBwcml2YXRlIGN1cnJlbnRGaWVsZFR5cGU6IFwidXNlcm5hbWVcIiB8IFwiZW1haWxcIiB8IFwicGhvbmVcIiB8IFwicGFzc3dvcmRcIiB8IG51bGwgPSBudWxsO1xuICAgIHByaXZhdGUgY3VycmVudE1lbnU6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgcHJpdmF0ZSBpY29uczogTWFwPEhUTUxJbnB1dEVsZW1lbnQsIFplbGZLZXlJY29uPiA9IG5ldyBNYXAoKTtcbiAgICBwcml2YXRlIGlzRmV0Y2hpbmdQYXNzd29yZHM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIHBhc3N3b3JkTWFuYWdlcjogUGFzc3dvcmRNYW5hZ2VyO1xuICAgIHByaXZhdGUgcmVzaXplVGltZW91dDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5wYXNzd29yZE1hbmFnZXIgPSBuZXcgUGFzc3dvcmRNYW5hZ2VyKCk7XG4gICAgICAgIHRoaXMuc2V0dXBTdHlsZXMoKTtcblxuICAgICAgICAvLyBMaXN0ZW4gZm9yIGRlY3J5cHRpb24gcmVzdWx0cyBmcm9tIHBvcG91dFxuICAgICAgICB0aGlzLl9zZXR1cERlY3J5cHRpb25SZXN1bHRMaXN0ZW5lcigpO1xuXG4gICAgICAgIC8vIFNldHVwIHJlc2l6ZSBsaXN0ZW5lclxuICAgICAgICB0aGlzLl9zZXR1cFJlc2l6ZUxpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cFN0eWxlcygpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cbiAgICAgICAgc3R5bGUudGV4dENvbnRlbnQgPSB0aGlzLmdlbmVyYXRlU3R5bGVzKCk7XG5cbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZVN0eWxlcygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgJHt0aGlzLmdldEljb25TdHlsZXMoKX1cbiAgICAgICAgICAgICR7dGhpcy5nZXRNZW51U3R5bGVzKCl9XG4gICAgICAgICAgICAke3RoaXMuZ2V0TWVudUl0ZW1TdHlsZXMoKX1cbiAgICAgICAgICAgICR7dGhpcy5nZXRTcGlubmVyU3R5bGVzKCl9XG4gICAgICAgIGA7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJY29uU3R5bGVzKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICAuemVsZmtleS1pY29uIHtcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDI1cHg7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAyNXB4O1xuICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjY7XG4gICAgICAgICAgICAgICAgei1pbmRleDogMTAwMDA7XG4gICAgICAgICAgICAgICAgcG9pbnRlci1ldmVudHM6IGF1dG87XG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjJzIGVhc2UtaW4tb3V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLnplbGZrZXktaWNvbjpob3ZlciB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldE1lbnVTdHlsZXMoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIC56ZWxma2V5LW1lbnUge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICAgICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAjZTBlMGUwO1xuICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgICAgICAgICBib3gtc2hhZG93OiAwIDRweCAxMnB4IHJnYmEoMCwgMCwgMCwgMC4xNSk7XG4gICAgICAgICAgICAgICAgei1pbmRleDogMTAwMDE7XG4gICAgICAgICAgICAgICAgbWluLXdpZHRoOiAyMDBweDtcbiAgICAgICAgICAgICAgICBtYXgtd2lkdGg6IDMwMHB4O1xuICAgICAgICAgICAgICAgIG1heC1oZWlnaHQ6IDMwMHB4O1xuICAgICAgICAgICAgICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgICAgICAgICAgICAgZm9udC1mYW1pbHk6IC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgJ1NlZ29lIFVJJywgUm9ib3RvLCBzYW5zLXNlcmlmO1xuICAgICAgICAgICAgfVxuICAgICAgICBgO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0TWVudUl0ZW1TdHlsZXMoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGBcbiAgICAgICAgICAgIC56ZWxma2V5LW1lbnUtaXRlbSB7XG4gICAgICAgICAgICAgICAgcGFkZGluZzogMTJweCAxNnB4O1xuICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2YwZjBmMDtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICAgICAgZ2FwOiAxMnB4O1xuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLnplbGZrZXktbWVudS1pdGVtOmhvdmVyIHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjhmOWZhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLnplbGZrZXktbWVudS1pdGVtOmxhc3QtY2hpbGQge1xuICAgICAgICAgICAgICAgIGJvcmRlci1ib3R0b206IG5vbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuemVsZmtleS1tZW51LWl0ZW0tLWNyZWF0ZSB7XG4gICAgICAgICAgICAgICAgY29sb3I6ICMwMDdiZmY7XG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC56ZWxma2V5LW1lbnUtaXRlbS0tY3JlYXRlOmhvdmVyIHtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTNmMmZkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLnplbGZrZXktbWVudS1pdGVtLS1sb2FkaW5nIHtcbiAgICAgICAgICAgICAgICBjb2xvcjogIzY2NjtcbiAgICAgICAgICAgICAgICBmb250LXN0eWxlOiBpdGFsaWM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuemVsZmtleS1tZW51LWl0ZW0tLW5vLWNyZWRlbnRpYWxzIHtcbiAgICAgICAgICAgICAgICBjb2xvcjogIzk5OTtcbiAgICAgICAgICAgICAgICBmb250LXN0eWxlOiBpdGFsaWM7XG4gICAgICAgICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDE2cHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuemVsZmtleS1tZW51LWl0ZW1fX2ljb24ge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAyMHB4O1xuICAgICAgICAgICAgICAgIGhlaWdodDogMjBweDtcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAjMTcxNzE3O1xuICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgICAgICAgICAgY29sb3I6IHdoaXRlO1xuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogYm9sZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC56ZWxma2V5LW1lbnUtaXRlbV9fY29udGVudCB7XG4gICAgICAgICAgICAgICAgZmxleDogMTtcbiAgICAgICAgICAgICAgICBtaW4td2lkdGg6IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuemVsZmtleS1tZW51LWl0ZW1fX3RpdGxlIHtcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICAgICAgICAgIGNvbG9yOiAjMzMzO1xuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IDJweDtcbiAgICAgICAgICAgICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgICAgICAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgICAgICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAuemVsZmtleS1tZW51LWl0ZW1fX3N1YnRpdGxlIHtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgICAgICAgICAgY29sb3I6ICM2NjY7XG4gICAgICAgICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgICAgICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgICAgICAgICAgfVxuICAgICAgICBgO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0U3Bpbm5lclN0eWxlcygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYFxuICAgICAgICAgICAgLnplbGZrZXktbWVudS1pdGVtLS1sb2FkaW5nIC5sb2FkaW5nLXNwaW5uZXIge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAxNnB4O1xuICAgICAgICAgICAgICAgIGhlaWdodDogMTZweDtcbiAgICAgICAgICAgICAgICBib3JkZXI6IDJweCBzb2xpZCAjZTBlMGUwO1xuICAgICAgICAgICAgICAgIGJvcmRlci10b3A6IDJweCBzb2xpZCAjMDA3YmZmO1xuICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IHNwaW4gMXMgbGluZWFyIGluZmluaXRlO1xuICAgICAgICAgICAgICAgIG1hcmdpbi1yaWdodDogOHB4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgQGtleWZyYW1lcyBzcGluIHtcbiAgICAgICAgICAgICAgICAwJSB7IHRyYW5zZm9ybTogcm90YXRlKDBkZWcpOyB9XG4gICAgICAgICAgICAgICAgMTAwJSB7IHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7IH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgYDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2hvd0ljb25Gb3JGaWVsZChmaWVsZDogRm9ybUZpZWxkKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmljb25zLmhhcyhmaWVsZC5lbGVtZW50KSkge1xuICAgICAgICAgICAgY29uc3QgaWNvbiA9IHRoaXMuaWNvbnMuZ2V0KGZpZWxkLmVsZW1lbnQpO1xuXG4gICAgICAgICAgICBpZiAoaWNvbikgdGhpcy5fcG9zaXRpb25JY29uKGljb24pO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEb24ndCBzaG93IGljb25zIG9uIGJ1dHRvbnMgb3Igb3RoZXIgbm9uLWlucHV0IGVsZW1lbnRzXG4gICAgICAgIGlmIChmaWVsZC5lbGVtZW50LnRhZ05hbWUgIT09IFwiSU5QVVRcIikgcmV0dXJuO1xuXG4gICAgICAgIC8vIERvbid0IHNob3cgaWNvbnMgb24gdmVyeSBzbWFsbCBpbnB1dHMgKGxpa2VseSBkZWNvcmF0aXZlIG9yIGhpZGRlbilcbiAgICAgICAgY29uc3QgcmVjdCA9IGZpZWxkLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgICAgaWYgKHJlY3Qud2lkdGggPCAzMCB8fCByZWN0LmhlaWdodCA8IDE1KSByZXR1cm47XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pc0ZpZWxkVmlzaWJsZUFuZEZvY3VzYWJsZShmaWVsZC5lbGVtZW50KSkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGljb24gPSB0aGlzLmNyZWF0ZVplbGZLZXlJY29uKGZpZWxkKTtcblxuICAgICAgICBpZiAoIWljb24pIHJldHVybjtcblxuICAgICAgICB0aGlzLmljb25zLnNldChmaWVsZC5lbGVtZW50LCBpY29uKTtcblxuICAgICAgICB0aGlzLl9wb3NpdGlvbkljb24oaWNvbik7XG4gICAgfVxuXG4gICAgcHVibGljIGhpZGVJY29uRm9yRmllbGQoZmllbGQ6IEZvcm1GaWVsZCk6IHZvaWQge1xuICAgICAgICBjb25zdCBpY29uID0gdGhpcy5pY29ucy5nZXQoZmllbGQuZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKGljb24pIHtcbiAgICAgICAgICAgIGljb24uZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgICAgICAgIHRoaXMuaWNvbnMuZGVsZXRlKGZpZWxkLmVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGhpZGVBbGxJY29ucygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pY29ucy5mb3JFYWNoKChpY29uKSA9PiBpY29uLmVsZW1lbnQucmVtb3ZlKCkpO1xuICAgICAgICB0aGlzLmljb25zLmNsZWFyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldEljb25Db3VudCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5pY29ucy5zaXplO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3JlcG9zaXRpb25UaW1lb3V0OiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICAgIHB1YmxpYyByZXBvc2l0aW9uQWxsSWNvbnMoKTogdm9pZCB7XG4gICAgICAgIC8vIERlYm91bmNlIHJlcG9zaXRpb25pbmcgdG8gYXZvaWQgZXhjZXNzaXZlIGNhbGxzXG4gICAgICAgIGlmICh0aGlzLl9yZXBvc2l0aW9uVGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3JlcG9zaXRpb25UaW1lb3V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3JlcG9zaXRpb25UaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pY29ucy5mb3JFYWNoKChpY29uKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25JY29uKGljb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl9yZXBvc2l0aW9uVGltZW91dCA9IG51bGw7XG4gICAgICAgIH0sIDUwKTsgLy8gNTBtcyBkZWJvdW5jZVxuICAgIH1cblxuICAgIHB1YmxpYyBoYXNJY29uc0luQ29udGFpbmVyKGNvbnRhaW5lcjogRWxlbWVudCk6IGJvb2xlYW4ge1xuICAgICAgICBmb3IgKGNvbnN0IGljb24gb2YgdGhpcy5pY29ucy52YWx1ZXMoKSkge1xuICAgICAgICAgICAgY29uc3QgaWNvblJlY3QgPSBpY29uLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBjb25zdCBjb250YWluZXJSZWN0ID0gY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBpY29uIGlzIHZpc2libGUgd2l0aGluIHRoZSBjb250YWluZXJcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBpY29uUmVjdC50b3AgPj0gY29udGFpbmVyUmVjdC50b3AgJiZcbiAgICAgICAgICAgICAgICBpY29uUmVjdC5ib3R0b20gPD0gY29udGFpbmVyUmVjdC5ib3R0b20gJiZcbiAgICAgICAgICAgICAgICBpY29uUmVjdC5sZWZ0ID49IGNvbnRhaW5lclJlY3QubGVmdCAmJlxuICAgICAgICAgICAgICAgIGljb25SZWN0LnJpZ2h0IDw9IGNvbnRhaW5lclJlY3QucmlnaHRcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgdmFsaWRhdGVJY29ucygpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgaWNvbnNUb1JlbW92ZTogSFRNTElucHV0RWxlbWVudFtdID0gW107XG5cbiAgICAgICAgdGhpcy5pY29ucy5mb3JFYWNoKChpY29uLCBmaWVsZEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGlmICghZG9jdW1lbnQuY29udGFpbnMoZmllbGRFbGVtZW50KSB8fCAhZG9jdW1lbnQuY29udGFpbnMoaWNvbi5lbGVtZW50KSkge1xuICAgICAgICAgICAgICAgIGljb25zVG9SZW1vdmUucHVzaChmaWVsZEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0aGlzLl9pc0ZpZWxkVmlzaWJsZUFuZEZvY3VzYWJsZShmaWVsZEVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlSWNvbkZvckZpZWxkKHsgZWxlbWVudDogZmllbGRFbGVtZW50LCB0eXBlOiBpY29uLmZpZWxkLnR5cGUgfSBhcyBGb3JtRmllbGQpO1xuICAgICAgICAgICAgICAgIGljb25zVG9SZW1vdmUucHVzaChmaWVsZEVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25JY29uKGljb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZW1vdmUgaW52YWxpZCBpY29uc1xuICAgICAgICBpY29uc1RvUmVtb3ZlLmZvckVhY2goKGZpZWxkRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pY29ucy5kZWxldGUoZmllbGRFbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVaZWxmS2V5SWNvbihmaWVsZDogRm9ybUZpZWxkKTogWmVsZktleUljb24gfCBudWxsIHtcbiAgICAgICAgaWYgKCFkb2N1bWVudC5ib2R5IHx8ICFkb2N1bWVudC5jb250YWlucyhmaWVsZC5lbGVtZW50KSkge1xuICAgICAgICAgICAgTG9nZ2VyLndhcm4oXCJGaWVsZCBlbGVtZW50IG5vIGxvbmdlciBpbiBET00gb3IgZG9jdW1lbnQuYm9keSBub3QgYXZhaWxhYmxlXCIpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDcmVhdGUgaXNvbGF0ZWQgaWNvbiB3aXRoIHNlbGVjdGl2ZSBDU1MgcmVzZXRcbiAgICAgICAgY29uc3QgaWNvbkVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBpY29uRWxlbWVudC5zdHlsZS5jc3NUZXh0ID0gYFxuICAgICAgICAgICAgcG9zaXRpb246IGZpeGVkO1xuICAgICAgICAgICAgd2lkdGg6IDI1cHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDI1cHg7XG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgICBvcGFjaXR5OiAwLjY7XG4gICAgICAgICAgICB6LWluZGV4OiAxMDAwMDtcbiAgICAgICAgICAgIHBvaW50ZXItZXZlbnRzOiBhdXRvO1xuICAgICAgICAgICAgaXNvbGF0aW9uOiBpc29sYXRlO1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjJzIGVhc2UtaW4tb3V0O1xuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgICAgICBwYWRkaW5nOiAwO1xuICAgICAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogbm9uZTtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IG5vbmU7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IG5vbmU7XG4gICAgICAgIGA7XG4gICAgICAgIGljb25FbGVtZW50LmlubmVySFRNTCA9IHRoaXMuZ2V0WmVsZktleVNWRygpO1xuXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5jYWxjdWxhdGVJY29uUG9zaXRpb24oZmllbGQuZWxlbWVudCk7XG4gICAgICAgIGljb25FbGVtZW50LnN0eWxlLnRvcCA9IGAke3Bvc2l0aW9uLnRvcH1weGA7XG4gICAgICAgIGljb25FbGVtZW50LnN0eWxlLmxlZnQgPSBgJHtwb3NpdGlvbi5sZWZ0fXB4YDtcblxuICAgICAgICBpY29uRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVJY29uQ2xpY2soZmllbGQpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBBZGQgaG92ZXIgZWZmZWN0c1xuICAgICAgICBpY29uRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2VlbnRlclwiLCAoKSA9PiB7XG4gICAgICAgICAgICBpY29uRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gXCIxXCI7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGljb25FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWxlYXZlXCIsICgpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0ZldGNoaW5nUGFzc3dvcmRzKSB7XG4gICAgICAgICAgICAgICAgaWNvbkVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IFwiMC42XCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaWNvbkVsZW1lbnQpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBlbGVtZW50OiBpY29uRWxlbWVudCxcbiAgICAgICAgICAgIGZpZWxkLFxuICAgICAgICAgICAgcG9zaXRpb24sXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVJY29uTG9hZGluZ1N0YXRlKGljb246IFplbGZLZXlJY29uLCBpc0xvYWRpbmc6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgaWYgKGlzTG9hZGluZykge1xuICAgICAgICAgICAgaWNvbi5lbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBcIjAuNVwiO1xuICAgICAgICAgICAgaWNvbi5lbGVtZW50LnN0eWxlLmN1cnNvciA9IFwibm90LWFsbG93ZWRcIjtcbiAgICAgICAgICAgIGljb24uZWxlbWVudC50aXRsZSA9IFwiTG9hZGluZyBwYXNzd29yZHMuLi5cIjtcbiAgICAgICAgICAgIC8vIEtlZXAgdGhlIHNhbWUgU1ZHLCBqdXN0IGRpc2FibGUgaW50ZXJhY3Rpb25cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGljb24uZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gXCIwLjZcIjtcbiAgICAgICAgICAgIGljb24uZWxlbWVudC5zdHlsZS5jdXJzb3IgPSBcInBvaW50ZXJcIjtcbiAgICAgICAgICAgIGljb24uZWxlbWVudC50aXRsZSA9IFwiWmVsZktleSBBdXRvZmlsbFwiO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVBbGxJY29uc0xvYWRpbmdTdGF0ZShpc0xvYWRpbmc6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pY29ucy5mb3JFYWNoKChpY29uKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUljb25Mb2FkaW5nU3RhdGUoaWNvbiwgaXNMb2FkaW5nKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRaZWxmS2V5U1ZHKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMjVcIiBoZWlnaHQ9XCIyNVwiIHZpZXdCb3g9XCIwIDAgNDAgMzlcIiBmaWxsPVwibm9uZVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBzdHlsZT1cImRpc3BsYXk6IGJsb2NrOyB3aWR0aDogMjVweDsgaGVpZ2h0OiAyNXB4O1wiPlxuICAgICAgICAgICAgICAgIDxyZWN0IHdpZHRoPVwiNDBcIiBoZWlnaHQ9XCIzOVwiIHJ4PVwiNFwiIGZpbGw9XCIjMTcxNzE3XCIvPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjAuMDIyIDUuOTcyNjZDMjEuNDgzNiA4LjAxNTU3IDIzLjM2ODYgMTAuMzQzNyAyNS43NDA5IDEyLjc0NjVIMTUuMDkwOEMxNy4zOTkzIDEwLjI0MDggMTguOTc0NyA3LjgzNzkzIDIwLjAyNjUgNS45NzI2NkgyMC4wMjJaXCIgZmlsbD1cIndoaXRlXCIvPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNNy4wMDQ1NSAxOS4zNTU4QzguODgwNDkgMTguNDI1NSAxMS4zNDM4IDE2Ljk1MjkgMTMuODExNyAxNC43MTM2QzE0LjAzMDIgMTQuNTE3MyAxNC4yNDQyIDE0LjMxNjMgMTQuNDQ5MSAxNC4xMTUySDIzLjk3QzIzLjk3IDE0LjExNTIgMTcuMDcxOCAyNC4xMjQxIDEzLjI5NzIgMjQuMTUyMkMxMC4xODI3IDI0LjE4MDIgOC44ODA0OSAyMC41NDMyIDcgMTkuMzUxMUw3LjAwNDU1IDE5LjM1NThaXCIgZmlsbD1cIndoaXRlXCIvPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjAuNjI5MSAzMi42Nzk0QzE5LjQ4MTcgMzEuMDc1OSAxOC4wMDE5IDI5LjI0OCAxNi4xMjYgMjcuMzU5NEgyNC44ODE5QzIzLjAyODcgMjkuMjgwNyAyMS42NDQ1IDMxLjEzMiAyMC42MjkxIDMyLjY3OTRaXCIgZmlsbD1cIndoaXRlXCIvPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMjYuMjY5IDI1LjcwNDJDMjYuMTY4OCAyNS43OTc3IDI2LjA2NDEgMjUuODkxMiAyNS45NjM5IDI1Ljk4NDdIMTUuNzM3M0MxNS43MzczIDI1Ljk4NDcgMjIuNzQ5MyAxNS44NDQ5IDI2LjU3NDEgMTUuODI2MkMyOS43NjU5IDE1LjgxMjIgMzEuMDg2MyAxOS41Mjg3IDMzLjAwNzggMjAuNzQ4OEMzMS4wNTQ1IDIxLjg3NTUgMjguNjc3NyAyMy40NzkgMjYuMjY0NCAyNS43MDQySDI2LjI2OVpcIiBmaWxsPVwid2hpdGVcIi8+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgYDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9wb3NpdGlvbkljb24oaWNvbjogWmVsZktleUljb24pOiB2b2lkIHtcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNhbGN1bGF0ZUljb25Qb3NpdGlvbihpY29uLmZpZWxkLmVsZW1lbnQpO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHBvc2l0aW9uIGFjdHVhbGx5IGNoYW5nZWQgdG8gYXZvaWQgdW5uZWNlc3NhcnkgdXBkYXRlc1xuICAgICAgICBpZiAoaWNvbi5wb3NpdGlvbiAmJiBNYXRoLmFicyhpY29uLnBvc2l0aW9uLnRvcCAtIHBvc2l0aW9uLnRvcCkgPCAxICYmIE1hdGguYWJzKGljb24ucG9zaXRpb24ubGVmdCAtIHBvc2l0aW9uLmxlZnQpIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuOyAvLyBQb3NpdGlvbiBoYXNuJ3QgY2hhbmdlZCBzaWduaWZpY2FudGx5XG4gICAgICAgIH1cblxuICAgICAgICBpY29uLmVsZW1lbnQuc3R5bGUudG9wID0gYCR7cG9zaXRpb24udG9wfXB4YDtcbiAgICAgICAgaWNvbi5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHtwb3NpdGlvbi5sZWZ0fXB4YDtcbiAgICAgICAgaWNvbi5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuXG4gICAgICAgIExvZ2dlci5sb2coXCJJY29uIHBvc2l0aW9uaW5nOlwiLCBpY29uLmZpZWxkLmVsZW1lbnQsIHBvc2l0aW9uKTtcblxuICAgICAgICB0aGlzLl90ZXN0QW5kQWRqdXN0UG9zaXRpb24oaWNvbiwgaWNvbi5maWVsZC5lbGVtZW50KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIF9oYW5kbGVJY29uQ2xpY2soZmllbGQ6IEZvcm1GaWVsZCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAodGhpcy5pc0ZldGNoaW5nUGFzc3dvcmRzKSByZXR1cm47XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pc0ZpZWxkVmlzaWJsZUFuZEZvY3VzYWJsZShmaWVsZC5lbGVtZW50KSkge1xuICAgICAgICAgICAgTG9nZ2VyLndhcm4oXCJGaWVsZCBpcyBubyBsb25nZXIgdmlzaWJsZSBvciBmb2N1c2FibGUsIGFib3J0aW5nIG1lbnUgb3BlblwiKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaWNvbiA9IHRoaXMuaWNvbnMuZ2V0KGZpZWxkLmVsZW1lbnQpO1xuXG4gICAgICAgIGlmIChpY29uKSB0aGlzLl9wb3NpdGlvbkljb24oaWNvbik7XG5cbiAgICAgICAgaWYgKCF0aGlzLl9pc0ZpZWxkVmlzaWJsZUFuZEZvY3VzYWJsZShmaWVsZC5lbGVtZW50KSkge1xuICAgICAgICAgICAgTG9nZ2VyLndhcm4oXCJGaWVsZCBiZWNhbWUgaW52YWxpZCBhZnRlciByZXBvc2l0aW9uaW5nLCBhYm9ydGluZyBtZW51IG9wZW5cIik7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3VycmVudEZpZWxkID0gZmllbGQ7XG4gICAgICAgIHRoaXMuY3VycmVudEZpZWxkVHlwZSA9IGZpZWxkLnR5cGU7XG5cbiAgICAgICAgdGhpcy5faGlkZU1lbnUoKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZUFsbEljb25zTG9hZGluZ1N0YXRlKHRydWUpO1xuXG4gICAgICAgIGNvbnN0IHdlYnNpdGUgPSB0aGlzLl9leHRyYWN0SG9zdG5hbWUod2luZG93LmxvY2F0aW9uLmhyZWYpO1xuXG4gICAgICAgIHRoaXMuc2hvd01lbnVXaXRoTG9hZGluZyhmaWVsZCk7XG5cbiAgICAgICAgdGhpcy5pc0ZldGNoaW5nUGFzc3dvcmRzID0gdHJ1ZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5wYXNzd29yZE1hbmFnZXIuY2xlYXJDYWNoZUZvcldlYnNpdGUod2Vic2l0ZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHBhc3N3b3JkcyA9IGF3YWl0IHRoaXMuX2ZldGNoUGFzc3dvcmRzV2l0aFRpbWVvdXQod2Vic2l0ZSk7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlTWVudVdpdGhQYXNzd29yZHMocGFzc3dvcmRzKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIExvZ2dlci5lcnJvcihcIlBhc3N3b3JkIGZldGNoaW5nOlwiLCBlcnJvcik7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlTWVudVdpdGhQYXNzd29yZHMoW10pO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgdGhpcy5pc0ZldGNoaW5nUGFzc3dvcmRzID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHRoaXMudXBkYXRlQWxsSWNvbnNMb2FkaW5nU3RhdGUoZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzaG93TWVudVdpdGhMb2FkaW5nKGZpZWxkOiBGb3JtRmllbGQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5faGlkZU1lbnUoKTtcblxuICAgICAgICAvLyBGaW5hbCB2YWxpZGF0aW9uIGJlZm9yZSBwb3NpdGlvbmluZyBtZW51IC0gZmllbGQgbWF5IGhhdmUgY2hhbmdlZFxuICAgICAgICBpZiAoIXRoaXMuX2lzRmllbGRWaXNpYmxlQW5kRm9jdXNhYmxlKGZpZWxkLmVsZW1lbnQpKSB7XG4gICAgICAgICAgICBMb2dnZXIud2FybihcIkZpZWxkIGlzIG5vIGxvbmdlciB2YWxpZCB3aGVuIHBvc2l0aW9uaW5nIG1lbnUsIGFib3J0aW5nXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWVudSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIG1lbnUuY2xhc3NOYW1lID0gXCJ6ZWxma2V5LW1lbnVcIjtcblxuICAgICAgICAvLyBBZGQgbG9hZGluZyBpbmRpY2F0b3JcbiAgICAgICAgY29uc3QgbG9hZGluZ0l0ZW0gPSB0aGlzLmNyZWF0ZUxvYWRpbmdNZW51SXRlbSgpO1xuICAgICAgICBtZW51LmFwcGVuZENoaWxkKGxvYWRpbmdJdGVtKTtcblxuICAgICAgICAvLyBBZGQgY3JlYXRlIG5ldyBwYXNzd29yZCBvcHRpb24gKGFsd2F5cyBhdmFpbGFibGUpXG4gICAgICAgIGNvbnN0IGNyZWF0ZUl0ZW0gPSB0aGlzLmNyZWF0ZUNyZWF0ZU1lbnVJdGVtKCk7XG4gICAgICAgIGNyZWF0ZUl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuX2hhbmRsZUNyZWF0ZVBhc3N3b3JkKCkpO1xuICAgICAgICBtZW51LmFwcGVuZENoaWxkKGNyZWF0ZUl0ZW0pO1xuXG4gICAgICAgIC8vIFBvc2l0aW9uIHRoZSBtZW51IC0gZ2V0IGZyZXNoIGJvdW5kaW5nIHJlY3QgdG8gZW5zdXJlIGFjY3VyYXRlIHBvc2l0aW9uaW5nXG4gICAgICAgIGNvbnN0IHJlY3QgPSBmaWVsZC5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBzY3JvbGxUb3AgPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcbiAgICAgICAgY29uc3Qgc2Nyb2xsTGVmdCA9IHdpbmRvdy5wYWdlWE9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcblxuICAgICAgICBtZW51LnN0eWxlLnRvcCA9IGAke3JlY3QuYm90dG9tICsgc2Nyb2xsVG9wICsgNX1weGA7XG4gICAgICAgIG1lbnUuc3R5bGUubGVmdCA9IGAke3JlY3QubGVmdCArIHNjcm9sbExlZnR9cHhgO1xuICAgICAgICBtZW51LnN0eWxlLnpJbmRleCA9IFwiMTAwMDFcIjtcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKG1lbnUpO1xuICAgICAgICB0aGlzLmN1cnJlbnRNZW51ID0gbWVudTtcblxuICAgICAgICAvLyBBZGQgY2xpY2sgb3V0c2lkZSBoYW5kbGVyXG4gICAgICAgIHRoaXMuY2xpY2tPdXRzaWRlSGFuZGxlciA9IHRoaXMuX2hhbmRsZUNsaWNrT3V0c2lkZS5iaW5kKHRoaXMpO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmNsaWNrT3V0c2lkZUhhbmRsZXIhLCB0cnVlKTtcbiAgICAgICAgfSwgMCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVNZW51V2l0aFBhc3N3b3JkcyhwYXNzd29yZHM6IFBhc3N3b3JkRW50cnlbXSk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuY3VycmVudE1lbnUpIHJldHVybjtcblxuICAgICAgICAvLyBDbGVhciBleGlzdGluZyBjb250ZW50XG4gICAgICAgIHRoaXMuY3VycmVudE1lbnUuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgICAgICAvLyBBZGQgZXhpc3RpbmcgcGFzc3dvcmRzIG9yIFwibm8gY3JlZGVudGlhbHNcIiBtZXNzYWdlXG4gICAgICAgIGlmIChwYXNzd29yZHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcGFzc3dvcmRzLmZvckVhY2goKHBhc3N3b3JkKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuY3JlYXRlTWVudUl0ZW0ocGFzc3dvcmQpO1xuXG4gICAgICAgICAgICAgICAgaXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5faGFuZGxlUGFzc3dvcmRTZWxlY3QocGFzc3dvcmQpKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE1lbnUhLmFwcGVuZENoaWxkKGl0ZW0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBBZGQgXCJubyBjcmVkZW50aWFscyBmb3VuZFwiIG1lc3NhZ2VcbiAgICAgICAgICAgIGNvbnN0IG5vQ3JlZGVudGlhbHNJdGVtID0gdGhpcy5jcmVhdGVOb0NyZWRlbnRpYWxzTWVudUl0ZW0oKTtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50TWVudSEuYXBwZW5kQ2hpbGQobm9DcmVkZW50aWFsc0l0ZW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIGNyZWF0ZSBuZXcgcGFzc3dvcmQgb3B0aW9uXG4gICAgICAgIGNvbnN0IGNyZWF0ZUl0ZW0gPSB0aGlzLmNyZWF0ZUNyZWF0ZU1lbnVJdGVtKCk7XG5cbiAgICAgICAgY3JlYXRlSXRlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gdGhpcy5faGFuZGxlQ3JlYXRlUGFzc3dvcmQoKSk7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50TWVudSEuYXBwZW5kQ2hpbGQoY3JlYXRlSXRlbSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVNZW51SXRlbShwYXNzd29yZDogUGFzc3dvcmRFbnRyeSk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgaXRlbS5jbGFzc05hbWUgPSBcInplbGZrZXktbWVudS1pdGVtXCI7XG5cbiAgICAgICAgY29uc3QgaG9zdE5hbWUgPSB0aGlzLmV4dHJhY3RIb3N0TmFtZShwYXNzd29yZCk7XG4gICAgICAgIGNvbnN0IGhvc3RJbml0aWFsID0gaG9zdE5hbWUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgY29uc3QgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgaWNvbi5jbGFzc05hbWUgPSBcInplbGZrZXktbWVudS1pdGVtX19pY29uXCI7XG4gICAgICAgIGljb24udGV4dENvbnRlbnQgPSBob3N0SW5pdGlhbDtcblxuICAgICAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgICAgICBjb250ZW50LmNsYXNzTmFtZSA9IFwiemVsZmtleS1tZW51LWl0ZW1fX2NvbnRlbnRcIjtcblxuICAgICAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgdGl0bGUuY2xhc3NOYW1lID0gXCJ6ZWxma2V5LW1lbnUtaXRlbV9fdGl0bGVcIjtcbiAgICAgICAgdGl0bGUudGV4dENvbnRlbnQgPSBob3N0TmFtZTtcblxuICAgICAgICBjb25zdCBzdWJ0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgc3VidGl0bGUuY2xhc3NOYW1lID0gXCJ6ZWxma2V5LW1lbnUtaXRlbV9fc3VidGl0bGVcIjtcbiAgICAgICAgc3VidGl0bGUudGV4dENvbnRlbnQgPSB0aGlzLmV4dHJhY3RVc2VybmFtZShwYXNzd29yZCk7XG5cbiAgICAgICAgY29udGVudC5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQoc3VidGl0bGUpO1xuICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGljb24pO1xuICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuXG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cblxuICAgIHByaXZhdGUgZXh0cmFjdEhvc3ROYW1lKHBhc3N3b3JkOiBQYXNzd29yZEVudHJ5KTogc3RyaW5nIHtcbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhpcyBpcyB0aGUgbmV3IGZvcm1hdCB3aXRoIHB1YmxpY0RhdGFcbiAgICAgICAgaWYgKChwYXNzd29yZCBhcyBhbnkpLnB1YmxpY0RhdGE/LndlYnNpdGUpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTCgocGFzc3dvcmQgYXMgYW55KS5wdWJsaWNEYXRhLndlYnNpdGUpO1xuICAgICAgICAgICAgICAgIHJldHVybiB1cmwuaG9zdG5hbWU7XG4gICAgICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHBhc3N3b3JkIGFzIGFueSkucHVibGljRGF0YS53ZWJzaXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmFsbGJhY2sgdG8gb3JpZ2luYWwgZm9ybWF0XG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IHBhc3N3b3JkLndlYnNpdGUgfHwgcGFzc3dvcmQucHVibGljRGF0YS53ZWJzaXRlIHx8IHBhc3N3b3JkLnVybDtcblxuICAgICAgICBpZiAoIXNvdXJjZSkgcmV0dXJuIFwiVW5rbm93blwiO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBJZiBpdCdzIGEgZnVsbCBVUkwsIGV4dHJhY3QgdGhlIGhvc3RuYW1lXG4gICAgICAgICAgICBpZiAoc291cmNlLmluY2x1ZGVzKFwiOi8vXCIpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gbmV3IFVSTChzb3VyY2UpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHVybC5ob3N0bmFtZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgaXQgYWxyZWFkeSBsb29rcyBsaWtlIGEgaG9zdG5hbWUgKGNvbnRhaW5zIGRvdHMgYnV0IG5vIHByb3RvY29sKVxuICAgICAgICAgICAgaWYgKHNvdXJjZS5pbmNsdWRlcyhcIi5cIikgJiYgIXNvdXJjZS5pbmNsdWRlcyhcIiBcIikpIHJldHVybiBzb3VyY2U7XG5cbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgdXNlIHRoZSBzb3VyY2UgYXMgZmFsbGJhY2tcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgLy8gSWYgVVJMIHBhcnNpbmcgZmFpbHMsIHVzZSB0aGUgc291cmNlIGFzIGlzXG4gICAgICAgICAgICByZXR1cm4gc291cmNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBleHRyYWN0VXNlcm5hbWUocGFzc3dvcmQ6IFBhc3N3b3JkRW50cnkpOiBzdHJpbmcge1xuICAgICAgICAvLyBDaGVjayBpZiB0aGlzIGlzIHRoZSBuZXcgZm9ybWF0IHdpdGggcHVibGljRGF0YVxuICAgICAgICBpZiAoKHBhc3N3b3JkIGFzIGFueSkucHVibGljRGF0YT8udXNlcm5hbWUpIHJldHVybiAocGFzc3dvcmQgYXMgYW55KS5wdWJsaWNEYXRhLnVzZXJuYW1lO1xuXG4gICAgICAgIC8vIEZhbGxiYWNrIHRvIG9yaWdpbmFsIGZvcm1hdFxuICAgICAgICByZXR1cm4gcGFzc3dvcmQucHVibGljRGF0YS51c2VybmFtZSB8fCBcIk5vIHVzZXJuYW1lXCI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVMb2FkaW5nTWVudUl0ZW0oKTogSFRNTEVsZW1lbnQge1xuICAgICAgICBjb25zdCBpdGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgICAgICBpdGVtLmNsYXNzTmFtZSA9IFwiemVsZmtleS1tZW51LWl0ZW0gemVsZmtleS1tZW51LWl0ZW0tLWxvYWRpbmdcIjtcblxuICAgICAgICBjb25zdCBzcGlubmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgICAgICBzcGlubmVyLmNsYXNzTmFtZSA9IFwibG9hZGluZy1zcGlubmVyXCI7XG5cbiAgICAgICAgY29uc3QgY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgY29udGVudC5jbGFzc05hbWUgPSBcInplbGZrZXktbWVudS1pdGVtX19jb250ZW50XCI7XG5cbiAgICAgICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgIHRpdGxlLmNsYXNzTmFtZSA9IFwiemVsZmtleS1tZW51LWl0ZW1fX3RpdGxlXCI7XG4gICAgICAgIHRpdGxlLnRleHRDb250ZW50ID0gXCJMb2FkaW5nIHBhc3N3b3Jkcy4uLlwiO1xuXG4gICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgICAgICBpdGVtLmFwcGVuZENoaWxkKHNwaW5uZXIpO1xuICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuXG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3JlYXRlTm9DcmVkZW50aWFsc01lbnVJdGVtKCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgaXRlbS5jbGFzc05hbWUgPSBcInplbGZrZXktbWVudS1pdGVtIHplbGZrZXktbWVudS1pdGVtLS1uby1jcmVkZW50aWFsc1wiO1xuXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgIGNvbnRlbnQuY2xhc3NOYW1lID0gXCJ6ZWxma2V5LW1lbnUtaXRlbV9fY29udGVudFwiO1xuXG4gICAgICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgICAgICB0aXRsZS5jbGFzc05hbWUgPSBcInplbGZrZXktbWVudS1pdGVtX190aXRsZVwiO1xuICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9IFwiTm8gY3JlZGVudGlhbHMgZm91bmRcIjtcblxuICAgICAgICBjb250ZW50LmFwcGVuZENoaWxkKHRpdGxlKTtcbiAgICAgICAgaXRlbS5hcHBlbmRDaGlsZChjb250ZW50KTtcblxuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZUNyZWF0ZU1lbnVJdGVtKCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgaXRlbS5jbGFzc05hbWUgPSBcInplbGZrZXktbWVudS1pdGVtIHplbGZrZXktbWVudS1pdGVtLS1jcmVhdGVcIjtcblxuICAgICAgICBjb25zdCBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgICAgICBpY29uLmNsYXNzTmFtZSA9IFwiemVsZmtleS1tZW51LWl0ZW1fX2ljb25cIjtcbiAgICAgICAgaWNvbi50ZXh0Q29udGVudCA9IFwiK1wiO1xuXG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgIGNvbnRlbnQuY2xhc3NOYW1lID0gXCJ6ZWxma2V5LW1lbnUtaXRlbV9fY29udGVudFwiO1xuXG4gICAgICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgICAgICB0aXRsZS5jbGFzc05hbWUgPSBcInplbGZrZXktbWVudS1pdGVtX190aXRsZVwiO1xuICAgICAgICB0aXRsZS50ZXh0Q29udGVudCA9IFwiQ3JlYXRlIG5ldyBwYXNzd29yZFwiO1xuXG4gICAgICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQodGl0bGUpO1xuICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGljb24pO1xuICAgICAgICBpdGVtLmFwcGVuZENoaWxkKGNvbnRlbnQpO1xuXG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgX2hhbmRsZVBhc3N3b3JkU2VsZWN0KHBhc3N3b3JkOiBQYXNzd29yZEVudHJ5KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRoaXMuX2hpZGVNZW51KCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRGaWVsZCkgcmV0dXJuO1xuXG4gICAgICAgIC8vIEFsd2F5cyBvcGVuIGJpb21ldHJpY3MgcG9wb3V0IGZvciBwYXNzd29yZCBkZWNyeXB0aW9uXG4gICAgICAgIC8vIFRoZSBKV1Qgc2Vzc2lvbiBpcyBqdXN0IGZvciB0aGUgQVBJLCBidXQgd2Ugc3RpbGwgbmVlZCBiaW9tZXRyaWMgdmVyaWZpY2F0aW9uXG4gICAgICAgIGF3YWl0IHRoaXMuX29wZW5CaW9tZXRyaWNzUG9wb3V0KHBhc3N3b3JkKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIF9oYW5kbGVDcmVhdGVQYXNzd29yZCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdGhpcy5faGlkZU1lbnUoKTtcblxuICAgICAgICBjb25zdCB1cmxJbmZvID0ge1xuICAgICAgICAgICAgaGFzaDogd2luZG93LmxvY2F0aW9uLmhhc2gsXG4gICAgICAgICAgICBob3N0bmFtZTogd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lLFxuICAgICAgICAgICAgaHJlZjogd2luZG93LmxvY2F0aW9uLmhyZWYsXG4gICAgICAgICAgICBvcmlnaW46IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4sXG4gICAgICAgICAgICBwYXRobmFtZTogd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLFxuICAgICAgICAgICAgcG9ydDogd2luZG93LmxvY2F0aW9uLnBvcnQsXG4gICAgICAgICAgICBwcm90b2NvbDogd2luZG93LmxvY2F0aW9uLnByb3RvY29sLFxuICAgICAgICAgICAgc2VhcmNoOiB3aW5kb3cubG9jYXRpb24uc2VhcmNoLFxuICAgICAgICAgICAgdGl0bGU6IGRvY3VtZW50LnRpdGxlLFxuICAgICAgICB9O1xuXG4gICAgICAgIGF3YWl0IHRoaXMucGFzc3dvcmRNYW5hZ2VyLmNyZWF0ZU5ld1Bhc3N3b3JkKHVybEluZm8pO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgX29wZW5CaW9tZXRyaWNzUG9wb3V0KHBhc3N3b3JkOiBQYXNzd29yZEVudHJ5KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNocm9tZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjaHJvbWUucnVudGltZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIk9QRU5fUEFTU1dPUkRfREVDUllQVE9SXCIsXG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkSWQ6IHRoaXMuY3VycmVudEZpZWxkPy5lbGVtZW50LmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRUeXBlOiB0aGlzLmN1cnJlbnRGaWVsZFR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0SWQ6IHBhc3N3b3JkLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJwYXNzd29yZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgemVsZlByb29mOiBwYXNzd29yZC56ZWxmUHJvb2YgfHwgXCJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1YmxpY0RhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogcGFzc3dvcmQud2Vic2l0ZSB8fCBwYXNzd29yZC5wdWJsaWNEYXRhLndlYnNpdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2Vic2l0ZTogcGFzc3dvcmQucHVibGljRGF0YS53ZWJzaXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZT8uc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl93YWl0Rm9yUG9wb3V0QW5kU2VuZERhdGEocGFzc3dvcmQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIExvZ2dlci53YXJuKFwiRmFpbGVkIHRvIG9wZW4gcG9wdXA6XCIsIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIExvZ2dlci53YXJuKFwiQ2hyb21lIHJ1bnRpbWUgbm90IGF2YWlsYWJsZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIExvZ2dlci5lcnJvcihcIlBhc3N3b3JkIGRlY3J5cHRpb24gZGF0YSBzdG9yYWdlOlwiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIF93YWl0Rm9yUG9wb3V0QW5kU2VuZERhdGEocGFzc3dvcmQ6IFBhc3N3b3JkRW50cnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdhaXQgZm9yIHBvcG91dCB0byBiZSByZWFkeSAod2l0aCB0aW1lb3V0KVxuICAgICAgICAgICAgY29uc3QgbWF4UmV0cmllcyA9IDIwOyAvLyAxMCBzZWNvbmRzIHRvdGFsXG5cbiAgICAgICAgICAgIGxldCByZXRyaWVzID0gMDtcblxuICAgICAgICAgICAgd2hpbGUgKHJldHJpZXMgPCBtYXhSZXRyaWVzKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVHJ5IHRvIHNlbmQgZGF0YSB0byB0aGUgcG9wb3V0XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJTRU5EX0RFQ1JZUFRJT05fREFUQV9UT19QT1BPVVRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0SWQ6IHBhc3N3b3JkLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB6ZWxmUHJvb2Y6IHBhc3N3b3JkLnplbGZQcm9vZiB8fCBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1YmxpY0RhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IHBhc3N3b3JkLndlYnNpdGUgfHwgcGFzc3dvcmQucHVibGljRGF0YS53ZWJzaXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3ZWJzaXRlOiBwYXNzd29yZC5wdWJsaWNEYXRhLndlYnNpdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZElkOiB0aGlzLmN1cnJlbnRGaWVsZD8uZWxlbWVudC5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZFR5cGU6IHRoaXMuY3VycmVudEZpZWxkVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZT8uc3VjY2VzcykgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFBvcG91dCBub3QgcmVhZHkgeWV0LCBjb250aW51ZSB3YWl0aW5nXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gV2FpdCA1MDBtcyBiZWZvcmUgcmV0cnlpbmdcbiAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCA1MDApKTtcblxuICAgICAgICAgICAgICAgIHJldHJpZXMrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgTG9nZ2VyLndhcm4oXCJUaW1lb3V0IHdhaXRpbmcgZm9yIHBvcG91dCB0byBiZSByZWFkeVwiKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIExvZ2dlci5lcnJvcihcIlBvcG91dCBjb21tdW5pY2F0aW9uOlwiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9zZXR1cERlY3J5cHRpb25SZXN1bHRMaXN0ZW5lcigpOiB2b2lkIHtcbiAgICAgICAgLy8gTGlzdGVuIGZvciBtZXNzYWdlcyBmcm9tIGJhY2tncm91bmQgc2NyaXB0IGFib3V0IGRlY3J5cHRpb24gcmVzdWx0c1xuICAgICAgICBpZiAodHlwZW9mIGNocm9tZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjaHJvbWUucnVudGltZSkge1xuICAgICAgICAgICAgY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtZXNzYWdlLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlLnR5cGUgPT09IFwiREVDUllQVElPTl9SRVNVTFRcIikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVEZWNyeXB0aW9uUmVzdWx0KG1lc3NhZ2UucGF5bG9hZCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlOyAvLyBLZWVwIG1lc3NhZ2UgY2hhbm5lbCBvcGVuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX3NldHVwUmVzaXplTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucmVzaXplSGFuZGxlciA9ICgpID0+IHtcbiAgICAgICAgICAgIC8vIERlYm91bmNlIHJlc2l6ZSBldmVudHMgdG8gYXZvaWQgZXhjZXNzaXZlIGNhbGxzXG4gICAgICAgICAgICBpZiAodGhpcy5yZXNpemVUaW1lb3V0KSBjbGVhclRpbWVvdXQodGhpcy5yZXNpemVUaW1lb3V0KTtcblxuICAgICAgICAgICAgdGhpcy5yZXNpemVUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIElmIG1lbnUgaXMgb3BlbiwgdHJ5IHRvIHJlcG9zaXRpb24gaXQgb3IgY2xvc2UgaXQgaWYgZmllbGQgaXMgbm8gbG9uZ2VyIHZhbGlkXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudE1lbnUgJiYgdGhpcy5jdXJyZW50RmllbGQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzRmllbGRWaXNpYmxlQW5kRm9jdXNhYmxlKHRoaXMuY3VycmVudEZpZWxkLmVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZXBvc2l0aW9uTWVudSgpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmllbGQgaXMgbm8gbG9uZ2VyIHZpc2libGUvdmFsaWQsIGNsb3NlIHRoZSBtZW51XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9oaWRlTWVudSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gVmFsaWRhdGUgaWNvbnMgKHJlbW92ZXMgaW52YWxpZCBvbmVzIGFuZCByZXBvc2l0aW9ucyB2YWxpZCBvbmVzKVxuICAgICAgICAgICAgICAgIHRoaXMudmFsaWRhdGVJY29ucygpO1xuXG4gICAgICAgICAgICAgICAgLy8gQWxzbyByZXBvc2l0aW9uIGFsbCByZW1haW5pbmcgaWNvbnMgdG8gZW5zdXJlIHRoZXkncmUgaW4gdGhlIGNvcnJlY3QgcG9zaXRpb25cbiAgICAgICAgICAgICAgICB0aGlzLnJlcG9zaXRpb25BbGxJY29ucygpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNpemVUaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIH0sIDE1MCk7IC8vIDE1MG1zIGRlYm91bmNlXG4gICAgICAgIH07XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5yZXNpemVIYW5kbGVyKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZGVzdHJveSgpOiB2b2lkIHtcbiAgICAgICAgLy8gQ2xlYW4gdXAgcmVzaXplIGxpc3RlbmVyXG4gICAgICAgIGlmICh0aGlzLnJlc2l6ZUhhbmRsZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMucmVzaXplSGFuZGxlcik7XG4gICAgICAgICAgICB0aGlzLnJlc2l6ZUhhbmRsZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMucmVzaXplVGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVzaXplVGltZW91dCk7XG4gICAgICAgICAgICB0aGlzLnJlc2l6ZVRpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2xlYW4gdXAgcmVwb3NpdGlvbiB0aW1lb3V0XG4gICAgICAgIGlmICh0aGlzLl9yZXBvc2l0aW9uVGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3JlcG9zaXRpb25UaW1lb3V0KTtcbiAgICAgICAgICAgIHRoaXMuX3JlcG9zaXRpb25UaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlbW92ZSBhbGwgaWNvbnNcbiAgICAgICAgdGhpcy5oaWRlQWxsSWNvbnMoKTtcblxuICAgICAgICAvLyBIaWRlIG1lbnUgaWYgb3BlbiAodGhpcyB3aWxsIGFsc28gY2xlYW4gdXAgY2xpY2sgaGFuZGxlcilcbiAgICAgICAgdGhpcy5faGlkZU1lbnUoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9oYW5kbGVEZWNyeXB0aW9uUmVzdWx0KHJlc3VsdDogYW55KTogdm9pZCB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2VzcyAmJiByZXN1bHQuZGF0YSAmJiB0aGlzLmN1cnJlbnRGaWVsZCkge1xuICAgICAgICAgICAgLy8gRmlsbCB0aGUgZmllbGQgd2l0aCB0aGUgZGVjcnlwdGVkIGRhdGFcbiAgICAgICAgICAgIHRoaXMuX2ZpbGxGaWVsZCh0aGlzLmN1cnJlbnRGaWVsZCwgcmVzdWx0LmRhdGEpO1xuICAgICAgICB9IGVsc2UgaWYgKCFyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiUGFzc3dvcmQgZGVjcnlwdGlvbjpcIiwgcmVzdWx0LmVycm9yKTtcbiAgICAgICAgICAgIC8vIENvdWxkIHNob3cgYW4gZXJyb3IgbWVzc2FnZSB0byB0aGUgdXNlclxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgTG9nZ2VyLmRlYnVnKFwiTWlzc2luZyByZXF1aXJlZCBkYXRhIGZvciBmb3JtIGZpbGxpbmc6XCIsIHtcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiByZXN1bHQuc3VjY2VzcyxcbiAgICAgICAgICAgICAgICBoYXNEYXRhOiAhIXJlc3VsdC5kYXRhLFxuICAgICAgICAgICAgICAgIGhhc0ZpZWxkOiAhIXRoaXMuY3VycmVudEZpZWxkLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9maWxsRmllbGQoZmllbGQ6IEZvcm1GaWVsZCwgZGF0YTogRGVjcnlwdGVkUGFzc3dvcmREYXRhKTogdm9pZCB7XG4gICAgICAgIC8vIEZpbGwgdGhlIHNwZWNpZmljIGZpZWxkIHRoYXQgd2FzIGNsaWNrZWQgYmFzZWQgb24gaXRzIHR5cGUgKGlmIHZpc2libGUpXG4gICAgICAgIGlmICh0aGlzLl9pc0ZpZWxkVmlzaWJsZUFuZEZvY3VzYWJsZShmaWVsZC5lbGVtZW50KSkge1xuICAgICAgICAgICAgaWYgKGZpZWxkLnR5cGUgPT09IFwidXNlcm5hbWVcIiB8fCBmaWVsZC50eXBlID09PSBcImVtYWlsXCIgfHwgZmllbGQudHlwZSA9PT0gXCJwaG9uZVwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEudXNlcm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0RmllbGRWYWx1ZShmaWVsZC5lbGVtZW50LCBkYXRhLnVzZXJuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZpZWxkLnR5cGUgPT09IFwicGFzc3dvcmRcIikge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnBhc3N3b3JkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldEZpZWxkVmFsdWUoZmllbGQuZWxlbWVudCwgZGF0YS5wYXNzd29yZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWxzbyB0cnkgdG8gZmlsbCBvdGhlciBmaWVsZHMgaW4gdGhlIHNhbWUgZm9ybSBpZiB0aGV5IGV4aXN0IGFuZCBhcmUgdmlzaWJsZVxuICAgICAgICBjb25zdCBmb3JtID0gZmllbGQuZWxlbWVudC5jbG9zZXN0KFwiZm9ybVwiKTtcblxuICAgICAgICBpZiAoIWZvcm0pIHJldHVybjtcblxuICAgICAgICAvLyBGaW5kIGFuZCBmaWxsIHVzZXJuYW1lIGZpZWxkIGlmIGN1cnJlbnQgZmllbGQgaXMgcGFzc3dvcmRcbiAgICAgICAgaWYgKGZpZWxkLnR5cGUgPT09IFwicGFzc3dvcmRcIiAmJiBkYXRhLnVzZXJuYW1lKSB7XG4gICAgICAgICAgICBjb25zdCB1c2VybmFtZUZpZWxkID0gdGhpcy5fZmluZFVzZXJuYW1lRmllbGRJbkZvcm0oZm9ybSk7XG5cbiAgICAgICAgICAgIGlmICh1c2VybmFtZUZpZWxkICYmIHVzZXJuYW1lRmllbGQgIT09IGZpZWxkLmVsZW1lbnQgJiYgdGhpcy5faXNGaWVsZFZpc2libGVBbmRGb2N1c2FibGUodXNlcm5hbWVGaWVsZCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXRGaWVsZFZhbHVlKHVzZXJuYW1lRmllbGQsIGRhdGEudXNlcm5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmluZCBhbmQgZmlsbCBwYXNzd29yZCBmaWVsZCBpZiBjdXJyZW50IGZpZWxkIGlzIGlkZW50aXR5XG4gICAgICAgIGVsc2UgaWYgKChmaWVsZC50eXBlID09PSBcInVzZXJuYW1lXCIgfHwgZmllbGQudHlwZSA9PT0gXCJlbWFpbFwiIHx8IGZpZWxkLnR5cGUgPT09IFwicGhvbmVcIikgJiYgZGF0YS5wYXNzd29yZCkge1xuICAgICAgICAgICAgY29uc3QgcGFzc3dvcmRGaWVsZCA9IGZvcm0ucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInBhc3N3b3JkXCJdJykgYXMgSFRNTElucHV0RWxlbWVudDtcblxuICAgICAgICAgICAgaWYgKHBhc3N3b3JkRmllbGQgJiYgcGFzc3dvcmRGaWVsZCAhPT0gZmllbGQuZWxlbWVudCAmJiB0aGlzLl9pc0ZpZWxkVmlzaWJsZUFuZEZvY3VzYWJsZShwYXNzd29yZEZpZWxkKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3NldEZpZWxkVmFsdWUocGFzc3dvcmRGaWVsZCwgZGF0YS5wYXNzd29yZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9pc0ZpZWxkVmlzaWJsZUFuZEZvY3VzYWJsZShlbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50KTogYm9vbGVhbiB7XG4gICAgICAgIC8vIENoZWNrIGlmIGVsZW1lbnQgZXhpc3RzXG4gICAgICAgIGlmICghZWxlbWVudCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIGVsZW1lbnQgaXMgaW4gdGhlIERPTVxuICAgICAgICBpZiAoIWRvY3VtZW50LmNvbnRhaW5zKGVsZW1lbnQpKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgZWxlbWVudCBpcyB2aXNpYmxlIChub3QgaGlkZGVuIGJ5IENTUylcbiAgICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KTtcblxuICAgICAgICBpZiAoc3R5bGUuZGlzcGxheSA9PT0gXCJub25lXCIgfHwgc3R5bGUudmlzaWJpbGl0eSA9PT0gXCJoaWRkZW5cIiB8fCBzdHlsZS5vcGFjaXR5ID09PSBcIjBcIikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgZWxlbWVudCBpcyBub3QgZGlzYWJsZWRcbiAgICAgICAgaWYgKGVsZW1lbnQuZGlzYWJsZWQpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAvLyBDaGVjayBpZiBlbGVtZW50IGhhcyBwb3NpdGl2ZSBkaW1lbnNpb25zIChub3QgY29sbGFwc2VkKVxuICAgICAgICBjb25zdCByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICBpZiAocmVjdC53aWR0aCA9PT0gMCB8fCByZWN0LmhlaWdodCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIGVsZW1lbnQgaXMgbm90IG9mZi1zY3JlZW5cbiAgICAgICAgaWYgKHJlY3QudG9wIDwgLTEwMDAgfHwgcmVjdC5sZWZ0IDwgLTEwMDApIHJldHVybiBmYWxzZTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9maW5kVXNlcm5hbWVGaWVsZEluRm9ybShmb3JtOiBIVE1MRm9ybUVsZW1lbnQpOiBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCB7XG4gICAgICAgIGNvbnN0IHNlbGVjdG9ycyA9IFtcbiAgICAgICAgICAgICdpbnB1dFt0eXBlPVwiZW1haWxcIl0nLFxuICAgICAgICAgICAgJ2lucHV0W3R5cGU9XCJ0ZWxcIl0nLFxuICAgICAgICAgICAgJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdJyxcbiAgICAgICAgICAgICdpbnB1dFtuYW1lKj1cInVzZXJuYW1lXCIgaV0nLFxuICAgICAgICAgICAgJ2lucHV0W25hbWUqPVwiZW1haWxcIiBpXScsXG4gICAgICAgICAgICAnaW5wdXRbbmFtZSo9XCJwaG9uZVwiIGldJyxcbiAgICAgICAgICAgICdpbnB1dFtpZCo9XCJ1c2VybmFtZVwiIGldJyxcbiAgICAgICAgICAgICdpbnB1dFtpZCo9XCJlbWFpbFwiIGldJyxcbiAgICAgICAgICAgICdpbnB1dFtpZCo9XCJwaG9uZVwiIGldJyxcbiAgICAgICAgXTtcblxuICAgICAgICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgICAgICAgICAgY29uc3QgZmllbGQgPSBmb3JtLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgICAgICAgICAgIGlmIChmaWVsZCAmJiBmaWVsZC50eXBlICE9PSBcInBhc3N3b3JkXCIpIHJldHVybiBmaWVsZDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3NldEZpZWxkVmFsdWUoZmllbGQ6IEhUTUxJbnB1dEVsZW1lbnQsIHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgZmllbGQuZm9jdXMoKTtcblxuICAgICAgICBjb25zdCBuYXRpdmVWYWx1ZVNldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoSFRNTElucHV0RWxlbWVudC5wcm90b3R5cGUsIFwidmFsdWVcIik/LnNldDtcbiAgICAgICAgaWYgKG5hdGl2ZVZhbHVlU2V0dGVyKSB7XG4gICAgICAgICAgICBuYXRpdmVWYWx1ZVNldHRlci5jYWxsKGZpZWxkLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmaWVsZC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgZmllbGQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJpbnB1dFwiLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgICAgICBmaWVsZC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImNoYW5nZVwiLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgICAgICBmaWVsZC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImJsdXJcIiwgeyBidWJibGVzOiB0cnVlIH0pKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9oYW5kbGVDbGlja091dHNpZGUoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRNZW51KSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXZlbnQudGFyZ2V0IGFzIE5vZGU7XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudE1lbnUuY29udGFpbnModGFyZ2V0KSkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBjbGlja2VkT25JY29uID0gZmFsc2U7XG5cbiAgICAgICAgZm9yIChjb25zdCBpY29uIG9mIHRoaXMuaWNvbnMudmFsdWVzKCkpIHtcbiAgICAgICAgICAgIGlmICghaWNvbi5lbGVtZW50LmNvbnRhaW5zKHRhcmdldCkpIGNvbnRpbnVlO1xuXG4gICAgICAgICAgICBjbGlja2VkT25JY29uID0gdHJ1ZTtcblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNsaWNrZWRPbkljb24pIHRoaXMuX2hpZGVNZW51KCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfcmVwb3NpdGlvbk1lbnUoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5jdXJyZW50TWVudSB8fCAhdGhpcy5jdXJyZW50RmllbGQpIHJldHVybjtcblxuICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5jdXJyZW50RmllbGQuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3Qgc2Nyb2xsVG9wID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICAgIGNvbnN0IHNjcm9sbExlZnQgPSB3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgbWVudSB3b3VsZCBiZSBvZmYtc2NyZWVuIGFuZCBhZGp1c3QgaWYgbmVlZGVkXG4gICAgICAgIGNvbnN0IG1lbnVSZWN0ID0gdGhpcy5jdXJyZW50TWVudS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3Qgdmlld3BvcnRXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICBjb25zdCB2aWV3cG9ydEhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgICAgICBsZXQgdG9wID0gcmVjdC5ib3R0b20gKyBzY3JvbGxUb3AgKyA1O1xuICAgICAgICBsZXQgbGVmdCA9IHJlY3QubGVmdCArIHNjcm9sbExlZnQ7XG5cbiAgICAgICAgLy8gQWRqdXN0IGhvcml6b250YWwgcG9zaXRpb24gaWYgbWVudSB3b3VsZCBvdmVyZmxvdyByaWdodCBlZGdlXG4gICAgICAgIGlmIChsZWZ0ICsgbWVudVJlY3Qud2lkdGggPiB2aWV3cG9ydFdpZHRoICsgc2Nyb2xsTGVmdCkge1xuICAgICAgICAgICAgbGVmdCA9IHZpZXdwb3J0V2lkdGggKyBzY3JvbGxMZWZ0IC0gbWVudVJlY3Qud2lkdGggLSAxMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkanVzdCBob3Jpem9udGFsIHBvc2l0aW9uIGlmIG1lbnUgd291bGQgb3ZlcmZsb3cgbGVmdCBlZGdlXG4gICAgICAgIGlmIChsZWZ0IDwgc2Nyb2xsTGVmdCkge1xuICAgICAgICAgICAgbGVmdCA9IHNjcm9sbExlZnQgKyAxMDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkanVzdCB2ZXJ0aWNhbCBwb3NpdGlvbiBpZiBtZW51IHdvdWxkIG92ZXJmbG93IGJvdHRvbSBlZGdlXG4gICAgICAgIGlmICh0b3AgKyBtZW51UmVjdC5oZWlnaHQgPiB2aWV3cG9ydEhlaWdodCArIHNjcm9sbFRvcCkge1xuICAgICAgICAgICAgLy8gVHJ5IHBvc2l0aW9uaW5nIGFib3ZlIHRoZSBmaWVsZCBpbnN0ZWFkXG4gICAgICAgICAgICB0b3AgPSByZWN0LnRvcCArIHNjcm9sbFRvcCAtIG1lbnVSZWN0LmhlaWdodCAtIDU7XG5cbiAgICAgICAgICAgIC8vIElmIHN0aWxsIG9mZi1zY3JlZW4gYXQgdG9wLCBwb3NpdGlvbiBhdCBib3R0b20gb2Ygdmlld3BvcnRcbiAgICAgICAgICAgIGlmICh0b3AgPCBzY3JvbGxUb3ApIHtcbiAgICAgICAgICAgICAgICB0b3AgPSB2aWV3cG9ydEhlaWdodCArIHNjcm9sbFRvcCAtIG1lbnVSZWN0LmhlaWdodCAtIDEwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdXJyZW50TWVudS5zdHlsZS50b3AgPSBgJHt0b3B9cHhgO1xuICAgICAgICB0aGlzLmN1cnJlbnRNZW51LnN0eWxlLmxlZnQgPSBgJHtsZWZ0fXB4YDtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9oaWRlTWVudSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudE1lbnUpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1lbnUucmVtb3ZlKCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNZW51ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5jbGlja091dHNpZGVIYW5kbGVyKSByZXR1cm47XG5cbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuY2xpY2tPdXRzaWRlSGFuZGxlciwgdHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5jbGlja091dHNpZGVIYW5kbGVyID0gbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlSWNvblBvc2l0aW9ucygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5pY29ucy5mb3JFYWNoKChpY29uKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9wb3NpdGlvbkljb24oaWNvbik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2V4dHJhY3RIb3N0bmFtZSh1cmw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB1cmxPYmogPSBuZXcgVVJMKHVybCk7XG5cbiAgICAgICAgICAgIGxldCBob3N0bmFtZSA9IHVybE9iai5ob3N0bmFtZTtcblxuICAgICAgICAgICAgaWYgKGhvc3RuYW1lLnN0YXJ0c1dpdGgoXCJ3d3cuXCIpKSBob3N0bmFtZSA9IGhvc3RuYW1lLnN1YnN0cmluZyg0KTtcblxuICAgICAgICAgICAgcmV0dXJuIGhvc3RuYW1lO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTG9nZ2VyLndhcm4oXCJDb3VsZCBub3QgcGFyc2UgVVJMOlwiLCB1cmwsIGVycm9yKTtcblxuICAgICAgICAgICAgcmV0dXJuIFwibG9jYWxob3N0XCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIF9mZXRjaFBhc3N3b3Jkc1dpdGhUaW1lb3V0KHdlYnNpdGU6IHN0cmluZyk6IFByb21pc2U8UGFzc3dvcmRFbnRyeVtdPiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJhY2UoW1xuICAgICAgICAgICAgdGhpcy5wYXNzd29yZE1hbmFnZXIuZ2V0UGFzc3dvcmRzRm9yV2Vic2l0ZSh3ZWJzaXRlKSxcblxuICAgICAgICAgICAgbmV3IFByb21pc2U8UGFzc3dvcmRFbnRyeVtdPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKFtdKTtcbiAgICAgICAgICAgICAgICB9LCAzMDAwKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICBdKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNhbGN1bGF0ZUljb25Qb3NpdGlvbihlbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50KTogeyB0b3A6IG51bWJlcjsgbGVmdDogbnVtYmVyIH0ge1xuICAgICAgICBjb25zdCByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAvLyBJY29uIHNpemUgaXMgbm93IDI1cHggKDI1JSBsYXJnZXIgdGhhbiAyMHB4KVxuICAgICAgICBjb25zdCBpY29uU2l6ZSA9IDI1O1xuICAgICAgICBjb25zdCBwYWRkaW5nID0gNjsgLy8gU21hbGwgcGFkZGluZyBmcm9tIHRoZSBpbnB1dCBlZGdlXG5cbiAgICAgICAgLy8gR2V0IGNvbXB1dGVkIHN0eWxlcyB0byB1bmRlcnN0YW5kIHRoZSBhY3R1YWwgcmVuZGVyZWQgaW5wdXRcbiAgICAgICAgY29uc3QgY29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgYWN0dWFsIGNvbnRlbnQgYXJlYSAoZXhjbHVkaW5nIGJvcmRlcnMgYnV0IGluY2x1ZGluZyBwYWRkaW5nKVxuICAgICAgICBjb25zdCBib3JkZXJMZWZ0ID0gcGFyc2VGbG9hdChjb21wdXRlZFN0eWxlLmJvcmRlckxlZnRXaWR0aCkgfHwgMDtcbiAgICAgICAgY29uc3QgYm9yZGVyUmlnaHQgPSBwYXJzZUZsb2F0KGNvbXB1dGVkU3R5bGUuYm9yZGVyUmlnaHRXaWR0aCkgfHwgMDtcblxuICAgICAgICBjb25zdCBwYWRkaW5nUmlnaHQgPSBwYXJzZUZsb2F0KGNvbXB1dGVkU3R5bGUucGFkZGluZ1JpZ2h0KSB8fCAwO1xuXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgYWN0dWFsIGNvbnRlbnQgYXJlYSBkaW1lbnNpb25zXG4gICAgICAgIGNvbnN0IGNvbnRlbnRXaWR0aCA9IHJlY3Qud2lkdGggLSBib3JkZXJMZWZ0IC0gYm9yZGVyUmlnaHQ7XG5cbiAgICAgICAgLy8gRm9yIHBvc2l0aW9uOiBmaXhlZCwgd2UgdXNlIHZpZXdwb3J0IGNvb3JkaW5hdGVzIChubyBzY3JvbGwgb2Zmc2V0IG5lZWRlZClcbiAgICAgICAgY29uc3QgdG9wID0gcmVjdC50b3AgKyAocmVjdC5oZWlnaHQgLSBpY29uU2l6ZSkgLyAyO1xuXG4gICAgICAgIC8vIFBvc2l0aW9uIGljb24gaW5zaWRlIHRoZSBjb250ZW50IGFyZWEgb24gdGhlIHJpZ2h0IHNpZGVcbiAgICAgICAgLy8gQWNjb3VudCBmb3IgcmlnaHQgcGFkZGluZyB0byBhdm9pZCBvdmVybGFwcGluZyB3aXRoIHRleHRcbiAgICAgICAgY29uc3QgbWluQ29udGVudFdpZHRoID0gaWNvblNpemUgKyBwYWRkaW5nICogMjtcblxuICAgICAgICBsZXQgbGVmdDtcblxuICAgICAgICBpZiAoY29udGVudFdpZHRoID49IG1pbkNvbnRlbnRXaWR0aCkge1xuICAgICAgICAgICAgLy8gQ29udGVudCBhcmVhIGlzIHdpZGUgZW5vdWdoIC0gcG9zaXRpb24gaW5zaWRlLCBhY2NvdW50aW5nIGZvciByaWdodCBwYWRkaW5nXG4gICAgICAgICAgICBjb25zdCByaWdodFBhZGRpbmcgPSBNYXRoLm1heChwYWRkaW5nLCBwYWRkaW5nUmlnaHQpO1xuXG4gICAgICAgICAgICAvLyBQb3NpdGlvbiBmcm9tIHRoZSByaWdodCBlZGdlIG9mIHRoZSBpbnB1dCwgYWNjb3VudGluZyBmb3IgcmlnaHQgcGFkZGluZ1xuICAgICAgICAgICAgbGVmdCA9IHJlY3QucmlnaHQgLSBpY29uU2l6ZSAtIHJpZ2h0UGFkZGluZztcblxuICAgICAgICAgICAgLy8gU2FmZXR5IGNoZWNrOiBlbnN1cmUgaWNvbiBpcyB3aXRoaW4gdGhlIGlucHV0IGJvdW5kc1xuICAgICAgICAgICAgY29uc3QgaWNvblJpZ2h0RWRnZSA9IGxlZnQgKyBpY29uU2l6ZTtcblxuICAgICAgICAgICAgaWYgKGxlZnQgPCByZWN0LmxlZnQpIGxlZnQgPSByZWN0LmxlZnQgKyAyOyAvLyBTbWFsbCBtYXJnaW4gZnJvbSBsZWZ0IGVkZ2VcblxuICAgICAgICAgICAgaWYgKGljb25SaWdodEVkZ2UgPiByZWN0LnJpZ2h0KSBsZWZ0ID0gcmVjdC5yaWdodCAtIGljb25TaXplIC0gMjsgLy8gU21hbGwgbWFyZ2luIGZyb20gcmlnaHQgZWRnZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gQ29udGVudCBhcmVhIGlzIHRvbyBuYXJyb3cgLSBwb3NpdGlvbiBqdXN0IG91dHNpZGUgdGhlIGlucHV0XG4gICAgICAgICAgICBsZWZ0ID0gcmVjdC5yaWdodCAtIGljb25TaXplIC0gMjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IHRvcCwgbGVmdCB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgX3Rlc3RBbmRBZGp1c3RQb3NpdGlvbihpY29uOiBaZWxmS2V5SWNvbiwgZWxlbWVudDogSFRNTElucHV0RWxlbWVudCk6IHZvaWQge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGljb25SZWN0ID0gaWNvbi5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgY29uc3QgaW5wdXRSZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgICAgICAgICAgY29uc3QgdmVydGljYWxEaXN0YW5jZSA9IE1hdGguYWJzKGljb25SZWN0LnRvcCAtIGlucHV0UmVjdC50b3ApO1xuICAgICAgICAgICAgY29uc3QgaG9yaXpvbnRhbERpc3RhbmNlID0gTWF0aC5hYnMoaWNvblJlY3QubGVmdCAtIGlucHV0UmVjdC5yaWdodCk7XG5cbiAgICAgICAgICAgIGNvbnN0IHZlcnRpY2FsVG9sZXJhbmNlID0gaW5wdXRSZWN0LmhlaWdodCAqIDAuNTtcbiAgICAgICAgICAgIGNvbnN0IGhvcml6b250YWxUb2xlcmFuY2UgPSAzMDtcblxuICAgICAgICAgICAgaWYgKHZlcnRpY2FsRGlzdGFuY2UgPiB2ZXJ0aWNhbFRvbGVyYW5jZSB8fCBob3Jpem9udGFsRGlzdGFuY2UgPiBob3Jpem9udGFsVG9sZXJhbmNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fcG9zaXRpb25JY29uKGljb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAxMDApO1xuICAgIH1cbn1cbiIsIi8vIERldmVsb3BtZW50IGVudmlyb25tZW50XG5leHBvcnQgY29uc3QgZW52aXJvbm1lbnQgPSB7XG4gICAgcHJvZHVjdGlvbjogZmFsc2UsXG4gICAgZW5hYmxlTG9nZ2luZzogdHJ1ZSxcbiAgICBpbmNsdWRlU3RhY2tJbkxvZ3M6IGZhbHNlLFxuICAgIGFwaUJhc2VVcmw6IFwiaHR0cDovL2xvY2FsaG9zdDozMDUwXCIsXG59O1xuIiwiaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tIFwiLi4vZW52aXJvbm1lbnRzL2Vudmlyb25tZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBMb2dnZXIge1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFBSRUZJWCA9IFwiW1pFTEZdOlwiO1xuICAgIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IGlzRW5hYmxlZCA9IGVudmlyb25tZW50LmVuYWJsZUxvZ2dpbmcgPz8gZmFsc2U7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgaW5jbHVkZVN0YWNrID0gZW52aXJvbm1lbnQuaW5jbHVkZVN0YWNrSW5Mb2dzID8/IGZhbHNlO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0U3RhY2soKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBFcnJvcigpLnN0YWNrO1xuXG4gICAgICAgICAgICBpZiAoIXN0YWNrKSByZXR1cm4gbnVsbDtcblxuICAgICAgICAgICAgY29uc3Qgc3RhY2tMaW5lcyA9IHN0YWNrLnNwbGl0KFwiXFxuXCIpO1xuXG4gICAgICAgICAgICBjb25zdCByZWxldmFudFN0YWNrID0gc3RhY2tMaW5lcy5zbGljZSg0KS5maWx0ZXIoKGxpbmUpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0cmltbWVkID0gbGluZS50cmltKCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gIXRyaW1tZWQuaW5jbHVkZXMoXCJsb2dnZXIuY2xhc3MudHNcIikgJiYgIXRyaW1tZWQuaW5jbHVkZXMoXCJMb2dnZXIuXCIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiByZWxldmFudFN0YWNrLmxlbmd0aCA+IDAgPyByZWxldmFudFN0YWNrLmpvaW4oXCJcXG5cIikgOiBudWxsO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGF0aWMgZ2V0Q2FsbGVySW5mbygpOiB7IGZpbGU6IHN0cmluZzsgbGluZTogbnVtYmVyOyBjb2x1bW46IG51bWJlciB9IHwgbnVsbCB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBFcnJvcigpLnN0YWNrO1xuICAgICAgICAgICAgaWYgKCFzdGFjaykgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgICAgIGNvbnN0IHN0YWNrTGluZXMgPSBzdGFjay5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgICAgIC8vIFN0YWNrIHRyYWNlIGZvcm1hdDpcbiAgICAgICAgICAgIC8vIDA6IEVycm9yXG4gICAgICAgICAgICAvLyAxOiBnZXRDYWxsZXJJbmZvXG4gICAgICAgICAgICAvLyAyOiBsb2dXaXRoQ2FsbGVyXG4gICAgICAgICAgICAvLyAzOiBsb2cvZXJyb3Ivd2Fybi9ldGMgKHRoZSBMb2dnZXIgbWV0aG9kKVxuICAgICAgICAgICAgLy8gNDogVGhlIGFjdHVhbCBjYWxsZXIgKHdoYXQgd2Ugd2FudClcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSA0OyBpIDwgc3RhY2tMaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBzdGFja0xpbmVzW2ldLnRyaW0oKTtcblxuICAgICAgICAgICAgICAgIC8vIFNraXAgTG9nZ2VyIGNsYXNzIG1ldGhvZHNcbiAgICAgICAgICAgICAgICBpZiAobGluZS5pbmNsdWRlcyhcImxvZ2dlci5jbGFzcy50c1wiKSB8fCBsaW5lLmluY2x1ZGVzKFwiTG9nZ2VyLlwiKSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICAvLyBNYXRjaDogYXQgZnVuY3Rpb25OYW1lIChmaWxlOmxpbmU6Y29sdW1uKSBvciBhdCBmaWxlOmxpbmU6Y29sdW1uXG4gICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBsaW5lLm1hdGNoKC9hdFxccysoPzouKz9cXHMrKT9cXCgoLis/KTooXFxkKyk6KFxcZCspXFwpLykgfHwgbGluZS5tYXRjaCgvYXRcXHMrKC4rPyk6KFxcZCspOihcXGQrKS8pO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFtYXRjaCkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlUGF0aCA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxpbmVOdW1iZXIgPSBwYXJzZUludChtYXRjaFsyXSwgMTApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbHVtbk51bWJlciA9IHBhcnNlSW50KG1hdGNoWzNdLCAxMCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZU5hbWUgPSBmaWxlUGF0aC5zcGxpdChcIi9cIikucG9wKCkgfHwgZmlsZVBhdGguc3BsaXQoXCJcXFxcXCIpLnBvcCgpIHx8IGZpbGVQYXRoO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgZmlsZTogZmlsZU5hbWUsIGxpbmU6IGxpbmVOdW1iZXIsIGNvbHVtbjogY29sdW1uTnVtYmVyIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2gge31cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBsb2dXaXRoQ2FsbGVyKGNvbnNvbGVNZXRob2Q6IHR5cGVvZiBjb25zb2xlLmxvZywgLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRW5hYmxlZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGNhbGxlckluZm8gPSB0aGlzLmdldENhbGxlckluZm8oKTtcbiAgICAgICAgY29uc3Qgc3RhY2sgPSB0aGlzLmluY2x1ZGVTdGFjayA/IHRoaXMuZ2V0U3RhY2soKSA6IG51bGw7XG5cbiAgICAgICAgaWYgKGNhbGxlckluZm8pIHtcbiAgICAgICAgICAgIC8vIEluY2x1ZGUgY2FsbGVyIGluZm8gaW4gdGhlIGxvZyBtZXNzYWdlXG4gICAgICAgICAgICAvLyBDaHJvbWUgRGV2VG9vbHMgd2lsbCBzdGlsbCBzaG93IGxvZ2dlci5jbGFzcy50cywgYnV0IHRoZSBtZXNzYWdlIHdpbGwgc2hvdyB0aGUgYWN0dWFsIGNhbGxlclxuICAgICAgICAgICAgY29uc3QgbG9nQXJnczogYW55W10gPSBbXG4gICAgICAgICAgICAgICAgYCVjJHt0aGlzLlBSRUZJWH0lYyBbJHtjYWxsZXJJbmZvLmZpbGV9OiR7Y2FsbGVySW5mby5saW5lfV1gLFxuICAgICAgICAgICAgICAgIFwiZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjNENBRjUwXCIsXG4gICAgICAgICAgICAgICAgXCJmb250LXdlaWdodDogbm9ybWFsOyBjb2xvcjogIzY2NjsgZm9udC1zaXplOiAwLjllbVwiLFxuICAgICAgICAgICAgICAgIC4uLmFyZ3MsXG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICBpZiAoc3RhY2spIGxvZ0FyZ3MucHVzaChgXFxuJHtzdGFja31gKTtcblxuICAgICAgICAgICAgY29uc29sZU1ldGhvZCguLi5sb2dBcmdzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGxvZ0FyZ3M6IGFueVtdID0gW3RoaXMuUFJFRklYLCAuLi5hcmdzXTtcblxuICAgICAgICAgICAgaWYgKHN0YWNrKSBsb2dBcmdzLnB1c2goYFxcbiR7c3RhY2t9YCk7XG5cbiAgICAgICAgICAgIGNvbnNvbGVNZXRob2QoLi4ubG9nQXJncyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGxvZyguLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLmxvZ1dpdGhDYWxsZXIoY29uc29sZS5sb2csIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZXJyb3IoLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5sb2dXaXRoQ2FsbGVyKGNvbnNvbGUuZXJyb3IsIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgd2FybiguLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLmxvZ1dpdGhDYWxsZXIoY29uc29sZS53YXJuLCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGluZm8oLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5sb2dXaXRoQ2FsbGVyKGNvbnNvbGUuaW5mbywgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBkZWJ1ZyguLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLmxvZ1dpdGhDYWxsZXIoY29uc29sZS5kZWJ1ZywgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyB0cmFjZSguLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuaXNFbmFibGVkKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgY2FsbGVySW5mbyA9IHRoaXMuZ2V0Q2FsbGVySW5mbygpO1xuICAgICAgICBjb25zdCBzdGFjayA9IHRoaXMuaW5jbHVkZVN0YWNrID8gdGhpcy5nZXRTdGFjaygpIDogbnVsbDtcblxuICAgICAgICBpZiAoY2FsbGVySW5mbykge1xuICAgICAgICAgICAgY29uc3QgbG9nQXJnczogYW55W10gPSBbXG4gICAgICAgICAgICAgICAgYCVjJHt0aGlzLlBSRUZJWH0lYyBbJHtjYWxsZXJJbmZvLmZpbGV9OiR7Y2FsbGVySW5mby5saW5lfV1gLFxuICAgICAgICAgICAgICAgIFwiZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjNENBRjUwXCIsXG4gICAgICAgICAgICAgICAgXCJmb250LXdlaWdodDogbm9ybWFsOyBjb2xvcjogIzY2NjsgZm9udC1zaXplOiAwLjllbVwiLFxuICAgICAgICAgICAgICAgIC4uLmFyZ3MsXG4gICAgICAgICAgICBdO1xuXG4gICAgICAgICAgICAvLyBBZGQgc3RhY2sgdHJhY2UgaWYgZW5hYmxlZCAoY29uc29sZS50cmFjZSBhbHJlYWR5IHNob3dzIHN0YWNrLCBidXQgd2UgY2FuIGFkZCBmb3JtYXR0ZWQgdmVyc2lvbilcbiAgICAgICAgICAgIGlmIChzdGFjaykge1xuICAgICAgICAgICAgICAgIGxvZ0FyZ3MucHVzaChcIlxcbiVjU3RhY2sgdHJhY2U6XCIsIFwiZm9udC13ZWlnaHQ6IGJvbGQ7IGNvbG9yOiAjOTk5OyBmb250LXNpemU6IDAuODVlbVwiKTtcbiAgICAgICAgICAgICAgICBsb2dBcmdzLnB1c2goYCVjJHtzdGFja31gLCBcImNvbG9yOiAjOTk5OyBmb250LXNpemU6IDAuODVlbTsgZm9udC1mYW1pbHk6IG1vbm9zcGFjZVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc29sZS50cmFjZSguLi5sb2dBcmdzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGxvZ0FyZ3M6IGFueVtdID0gW3RoaXMuUFJFRklYLCAuLi5hcmdzXTtcblxuICAgICAgICAgICAgaWYgKHN0YWNrKSB7XG4gICAgICAgICAgICAgICAgbG9nQXJncy5wdXNoKFwiXFxuJWNTdGFjayB0cmFjZTpcIiwgXCJmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICM5OTk7IGZvbnQtc2l6ZTogMC44NWVtXCIpO1xuICAgICAgICAgICAgICAgIGxvZ0FyZ3MucHVzaChgJWMke3N0YWNrfWAsIFwiY29sb3I6ICM5OTk7IGZvbnQtc2l6ZTogMC44NWVtOyBmb250LWZhbWlseTogbW9ub3NwYWNlXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLnRyYWNlKC4uLmxvZ0FyZ3MpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgZGVmaW5lKFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCIsIFtcIm1vZHVsZVwiXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBmYWN0b3J5KG1vZHVsZSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIG1vZCA9IHtcbiAgICAgIGV4cG9ydHM6IHt9XG4gICAgfTtcbiAgICBmYWN0b3J5KG1vZCk7XG4gICAgZ2xvYmFsLmJyb3dzZXIgPSBtb2QuZXhwb3J0cztcbiAgfVxufSkodHlwZW9mIGdsb2JhbFRoaXMgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxUaGlzIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdGhpcywgZnVuY3Rpb24gKG1vZHVsZSkge1xuICAvKiB3ZWJleHRlbnNpb24tcG9seWZpbGwgLSB2MC4xMi4wIC0gVHVlIE1heSAxNCAyMDI0IDE4OjAxOjI5ICovXG4gIC8qIC0qLSBNb2RlOiBpbmRlbnQtdGFicy1tb2RlOiBuaWw7IGpzLWluZGVudC1sZXZlbDogMiAtKi0gKi9cbiAgLyogdmltOiBzZXQgc3RzPTIgc3c9MiBldCB0dz04MDogKi9cbiAgLyogVGhpcyBTb3VyY2UgQ29kZSBGb3JtIGlzIHN1YmplY3QgdG8gdGhlIHRlcm1zIG9mIHRoZSBNb3ppbGxhIFB1YmxpY1xuICAgKiBMaWNlbnNlLCB2LiAyLjAuIElmIGEgY29weSBvZiB0aGUgTVBMIHdhcyBub3QgZGlzdHJpYnV0ZWQgd2l0aCB0aGlzXG4gICAqIGZpbGUsIFlvdSBjYW4gb2J0YWluIG9uZSBhdCBodHRwOi8vbW96aWxsYS5vcmcvTVBMLzIuMC8uICovXG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGlmICghKGdsb2JhbFRoaXMuY2hyb21lICYmIGdsb2JhbFRoaXMuY2hyb21lLnJ1bnRpbWUgJiYgZ2xvYmFsVGhpcy5jaHJvbWUucnVudGltZS5pZCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIHNjcmlwdCBzaG91bGQgb25seSBiZSBsb2FkZWQgaW4gYSBicm93c2VyIGV4dGVuc2lvbi5cIik7XG4gIH1cbiAgaWYgKCEoZ2xvYmFsVGhpcy5icm93c2VyICYmIGdsb2JhbFRoaXMuYnJvd3Nlci5ydW50aW1lICYmIGdsb2JhbFRoaXMuYnJvd3Nlci5ydW50aW1lLmlkKSkge1xuICAgIGNvbnN0IENIUk9NRV9TRU5EX01FU1NBR0VfQ0FMTEJBQ0tfTk9fUkVTUE9OU0VfTUVTU0FHRSA9IFwiVGhlIG1lc3NhZ2UgcG9ydCBjbG9zZWQgYmVmb3JlIGEgcmVzcG9uc2Ugd2FzIHJlY2VpdmVkLlwiO1xuXG4gICAgLy8gV3JhcHBpbmcgdGhlIGJ1bGsgb2YgdGhpcyBwb2x5ZmlsbCBpbiBhIG9uZS10aW1lLXVzZSBmdW5jdGlvbiBpcyBhIG1pbm9yXG4gICAgLy8gb3B0aW1pemF0aW9uIGZvciBGaXJlZm94LiBTaW5jZSBTcGlkZXJtb25rZXkgZG9lcyBub3QgZnVsbHkgcGFyc2UgdGhlXG4gICAgLy8gY29udGVudHMgb2YgYSBmdW5jdGlvbiB1bnRpbCB0aGUgZmlyc3QgdGltZSBpdCdzIGNhbGxlZCwgYW5kIHNpbmNlIGl0IHdpbGxcbiAgICAvLyBuZXZlciBhY3R1YWxseSBuZWVkIHRvIGJlIGNhbGxlZCwgdGhpcyBhbGxvd3MgdGhlIHBvbHlmaWxsIHRvIGJlIGluY2x1ZGVkXG4gICAgLy8gaW4gRmlyZWZveCBuZWFybHkgZm9yIGZyZWUuXG4gICAgY29uc3Qgd3JhcEFQSXMgPSBleHRlbnNpb25BUElzID0+IHtcbiAgICAgIC8vIE5PVEU6IGFwaU1ldGFkYXRhIGlzIGFzc29jaWF0ZWQgdG8gdGhlIGNvbnRlbnQgb2YgdGhlIGFwaS1tZXRhZGF0YS5qc29uIGZpbGVcbiAgICAgIC8vIGF0IGJ1aWxkIHRpbWUgYnkgcmVwbGFjaW5nIHRoZSBmb2xsb3dpbmcgXCJpbmNsdWRlXCIgd2l0aCB0aGUgY29udGVudCBvZiB0aGVcbiAgICAgIC8vIEpTT04gZmlsZS5cbiAgICAgIGNvbnN0IGFwaU1ldGFkYXRhID0ge1xuICAgICAgICBcImFsYXJtc1wiOiB7XG4gICAgICAgICAgXCJjbGVhclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNsZWFyQWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiYm9va21hcmtzXCI6IHtcbiAgICAgICAgICBcImNyZWF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldENoaWxkcmVuXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UmVjZW50XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0U3ViVHJlZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFRyZWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlVHJlZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlYXJjaFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImJyb3dzZXJBY3Rpb25cIjoge1xuICAgICAgICAgIFwiZGlzYWJsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImVuYWJsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEJhZGdlQmFja2dyb3VuZENvbG9yXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QmFkZ2VUZXh0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRUaXRsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm9wZW5Qb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEJhZGdlQmFja2dyb3VuZENvbG9yXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0QmFkZ2VUZXh0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0SWNvblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0VGl0bGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJicm93c2luZ0RhdGFcIjoge1xuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQ2FjaGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVDb29raWVzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlRG93bmxvYWRzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlRm9ybURhdGFcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVIaXN0b3J5XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlTG9jYWxTdG9yYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlUGFzc3dvcmRzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlUGx1Z2luRGF0YVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldHRpbmdzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29tbWFuZHNcIjoge1xuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29udGV4dE1lbnVzXCI6IHtcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImNvb2tpZXNcIjoge1xuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsQ29va2llU3RvcmVzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZGV2dG9vbHNcIjoge1xuICAgICAgICAgIFwiaW5zcGVjdGVkV2luZG93XCI6IHtcbiAgICAgICAgICAgIFwiZXZhbFwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMixcbiAgICAgICAgICAgICAgXCJzaW5nbGVDYWxsYmFja0FyZ1wiOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJwYW5lbHNcIjoge1xuICAgICAgICAgICAgXCJjcmVhdGVcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMyxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDMsXG4gICAgICAgICAgICAgIFwic2luZ2xlQ2FsbGJhY2tBcmdcIjogdHJ1ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZWxlbWVudHNcIjoge1xuICAgICAgICAgICAgICBcImNyZWF0ZVNpZGViYXJQYW5lXCI6IHtcbiAgICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImRvd25sb2Fkc1wiOiB7XG4gICAgICAgICAgXCJjYW5jZWxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkb3dubG9hZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImVyYXNlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0RmlsZUljb25cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJvcGVuXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicGF1c2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVGaWxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVzdW1lXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2hvd1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImV4dGVuc2lvblwiOiB7XG4gICAgICAgICAgXCJpc0FsbG93ZWRGaWxlU2NoZW1lQWNjZXNzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiaXNBbGxvd2VkSW5jb2duaXRvQWNjZXNzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaGlzdG9yeVwiOiB7XG4gICAgICAgICAgXCJhZGRVcmxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZWxldGVBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkZWxldGVSYW5nZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRlbGV0ZVVybFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFZpc2l0c1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlYXJjaFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImkxOG5cIjoge1xuICAgICAgICAgIFwiZGV0ZWN0TGFuZ3VhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBY2NlcHRMYW5ndWFnZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJpZGVudGl0eVwiOiB7XG4gICAgICAgICAgXCJsYXVuY2hXZWJBdXRoRmxvd1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImlkbGVcIjoge1xuICAgICAgICAgIFwicXVlcnlTdGF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIm1hbmFnZW1lbnRcIjoge1xuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0U2VsZlwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEVuYWJsZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1bmluc3RhbGxTZWxmXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwibm90aWZpY2F0aW9uc1wiOiB7XG4gICAgICAgICAgXCJjbGVhclwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNyZWF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFBlcm1pc3Npb25MZXZlbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInBhZ2VBY3Rpb25cIjoge1xuICAgICAgICAgIFwiZ2V0UG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRUaXRsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImhpZGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRJY29uXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0UG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRUaXRsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNob3dcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJwZXJtaXNzaW9uc1wiOiB7XG4gICAgICAgICAgXCJjb250YWluc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlcXVlc3RcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJydW50aW1lXCI6IHtcbiAgICAgICAgICBcImdldEJhY2tncm91bmRQYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UGxhdGZvcm1JbmZvXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwib3Blbk9wdGlvbnNQYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVxdWVzdFVwZGF0ZUNoZWNrXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VuZE1lc3NhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogM1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZW5kTmF0aXZlTWVzc2FnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFVuaW5zdGFsbFVSTFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInNlc3Npb25zXCI6IHtcbiAgICAgICAgICBcImdldERldmljZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRSZWNlbnRseUNsb3NlZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlc3RvcmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJzdG9yYWdlXCI6IHtcbiAgICAgICAgICBcImxvY2FsXCI6IHtcbiAgICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZ2V0Qnl0ZXNJblVzZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJzZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwibWFuYWdlZFwiOiB7XG4gICAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZ2V0Qnl0ZXNJblVzZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzeW5jXCI6IHtcbiAgICAgICAgICAgIFwiY2xlYXJcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZ2V0Qnl0ZXNJblVzZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJzZXRcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwidGFic1wiOiB7XG4gICAgICAgICAgXCJjYXB0dXJlVmlzaWJsZVRhYlwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImNyZWF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRldGVjdExhbmd1YWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGlzY2FyZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImR1cGxpY2F0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImV4ZWN1dGVTY3JpcHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRDdXJyZW50XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Wm9vbVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFpvb21TZXR0aW5nc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdvQmFja1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdvRm9yd2FyZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImhpZ2hsaWdodFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImluc2VydENTU1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJxdWVyeVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbG9hZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUNTU1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlbmRNZXNzYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDNcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0Wm9vbVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFpvb21TZXR0aW5nc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInRvcFNpdGVzXCI6IHtcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIndlYk5hdmlnYXRpb25cIjoge1xuICAgICAgICAgIFwiZ2V0QWxsRnJhbWVzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0RnJhbWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ3ZWJSZXF1ZXN0XCI6IHtcbiAgICAgICAgICBcImhhbmRsZXJCZWhhdmlvckNoYW5nZWRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ3aW5kb3dzXCI6IHtcbiAgICAgICAgICBcImNyZWF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEN1cnJlbnRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRMYXN0Rm9jdXNlZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgaWYgKE9iamVjdC5rZXlzKGFwaU1ldGFkYXRhKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYXBpLW1ldGFkYXRhLmpzb24gaGFzIG5vdCBiZWVuIGluY2x1ZGVkIGluIGJyb3dzZXItcG9seWZpbGxcIik7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogQSBXZWFrTWFwIHN1YmNsYXNzIHdoaWNoIGNyZWF0ZXMgYW5kIHN0b3JlcyBhIHZhbHVlIGZvciBhbnkga2V5IHdoaWNoIGRvZXNcbiAgICAgICAqIG5vdCBleGlzdCB3aGVuIGFjY2Vzc2VkLCBidXQgYmVoYXZlcyBleGFjdGx5IGFzIGFuIG9yZGluYXJ5IFdlYWtNYXBcbiAgICAgICAqIG90aGVyd2lzZS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjcmVhdGVJdGVtXG4gICAgICAgKiAgICAgICAgQSBmdW5jdGlvbiB3aGljaCB3aWxsIGJlIGNhbGxlZCBpbiBvcmRlciB0byBjcmVhdGUgdGhlIHZhbHVlIGZvciBhbnlcbiAgICAgICAqICAgICAgICBrZXkgd2hpY2ggZG9lcyBub3QgZXhpc3QsIHRoZSBmaXJzdCB0aW1lIGl0IGlzIGFjY2Vzc2VkLiBUaGVcbiAgICAgICAqICAgICAgICBmdW5jdGlvbiByZWNlaXZlcywgYXMgaXRzIG9ubHkgYXJndW1lbnQsIHRoZSBrZXkgYmVpbmcgY3JlYXRlZC5cbiAgICAgICAqL1xuICAgICAgY2xhc3MgRGVmYXVsdFdlYWtNYXAgZXh0ZW5kcyBXZWFrTWFwIHtcbiAgICAgICAgY29uc3RydWN0b3IoY3JlYXRlSXRlbSwgaXRlbXMgPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBzdXBlcihpdGVtcyk7XG4gICAgICAgICAgdGhpcy5jcmVhdGVJdGVtID0gY3JlYXRlSXRlbTtcbiAgICAgICAgfVxuICAgICAgICBnZXQoa2V5KSB7XG4gICAgICAgICAgaWYgKCF0aGlzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICB0aGlzLnNldChrZXksIHRoaXMuY3JlYXRlSXRlbShrZXkpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHN1cGVyLmdldChrZXkpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBnaXZlbiBvYmplY3QgaXMgYW4gb2JqZWN0IHdpdGggYSBgdGhlbmAgbWV0aG9kLCBhbmQgY2FuXG4gICAgICAgKiB0aGVyZWZvcmUgYmUgYXNzdW1lZCB0byBiZWhhdmUgYXMgYSBQcm9taXNlLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHRlc3QuXG4gICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdGhlbmFibGUuXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IGlzVGhlbmFibGUgPSB2YWx1ZSA9PiB7XG4gICAgICAgIHJldHVybiB2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHZhbHVlLnRoZW4gPT09IFwiZnVuY3Rpb25cIjtcbiAgICAgIH07XG5cbiAgICAgIC8qKlxuICAgICAgICogQ3JlYXRlcyBhbmQgcmV0dXJucyBhIGZ1bmN0aW9uIHdoaWNoLCB3aGVuIGNhbGxlZCwgd2lsbCByZXNvbHZlIG9yIHJlamVjdFxuICAgICAgICogdGhlIGdpdmVuIHByb21pc2UgYmFzZWQgb24gaG93IGl0IGlzIGNhbGxlZDpcbiAgICAgICAqXG4gICAgICAgKiAtIElmLCB3aGVuIGNhbGxlZCwgYGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcmAgY29udGFpbnMgYSBub24tbnVsbCBvYmplY3QsXG4gICAgICAgKiAgIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIHdpdGggdGhhdCB2YWx1ZS5cbiAgICAgICAqIC0gSWYgdGhlIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGV4YWN0bHkgb25lIGFyZ3VtZW50LCB0aGUgcHJvbWlzZSBpc1xuICAgICAgICogICByZXNvbHZlZCB0byB0aGF0IHZhbHVlLlxuICAgICAgICogLSBPdGhlcndpc2UsIHRoZSBwcm9taXNlIGlzIHJlc29sdmVkIHRvIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZVxuICAgICAgICogICBmdW5jdGlvbidzIGFyZ3VtZW50cy5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gcHJvbWlzZVxuICAgICAgICogICAgICAgIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSByZXNvbHV0aW9uIGFuZCByZWplY3Rpb24gZnVuY3Rpb25zIG9mIGFcbiAgICAgICAqICAgICAgICBwcm9taXNlLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gcHJvbWlzZS5yZXNvbHZlXG4gICAgICAgKiAgICAgICAgVGhlIHByb21pc2UncyByZXNvbHV0aW9uIGZ1bmN0aW9uLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gcHJvbWlzZS5yZWplY3RcbiAgICAgICAqICAgICAgICBUaGUgcHJvbWlzZSdzIHJlamVjdGlvbiBmdW5jdGlvbi5cbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBtZXRhZGF0YVxuICAgICAgICogICAgICAgIE1ldGFkYXRhIGFib3V0IHRoZSB3cmFwcGVkIG1ldGhvZCB3aGljaCBoYXMgY3JlYXRlZCB0aGUgY2FsbGJhY2suXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1ldGFkYXRhLnNpbmdsZUNhbGxiYWNrQXJnXG4gICAgICAgKiAgICAgICAgV2hldGhlciBvciBub3QgdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCBvbmx5IHRoZSBmaXJzdFxuICAgICAgICogICAgICAgIGFyZ3VtZW50IG9mIHRoZSBjYWxsYmFjaywgYWx0ZXJuYXRpdmVseSBhbiBhcnJheSBvZiBhbGwgdGhlXG4gICAgICAgKiAgICAgICAgY2FsbGJhY2sgYXJndW1lbnRzIGlzIHJlc29sdmVkLiBCeSBkZWZhdWx0LCBpZiB0aGUgY2FsbGJhY2tcbiAgICAgICAqICAgICAgICBmdW5jdGlvbiBpcyBpbnZva2VkIHdpdGggb25seSBhIHNpbmdsZSBhcmd1bWVudCwgdGhhdCB3aWxsIGJlXG4gICAgICAgKiAgICAgICAgcmVzb2x2ZWQgdG8gdGhlIHByb21pc2UsIHdoaWxlIGFsbCBhcmd1bWVudHMgd2lsbCBiZSByZXNvbHZlZCBhc1xuICAgICAgICogICAgICAgIGFuIGFycmF5IGlmIG11bHRpcGxlIGFyZSBnaXZlbi5cbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gICAgICAgKiAgICAgICAgVGhlIGdlbmVyYXRlZCBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICAgICAqL1xuICAgICAgY29uc3QgbWFrZUNhbGxiYWNrID0gKHByb21pc2UsIG1ldGFkYXRhKSA9PiB7XG4gICAgICAgIHJldHVybiAoLi4uY2FsbGJhY2tBcmdzKSA9PiB7XG4gICAgICAgICAgaWYgKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAgIHByb21pc2UucmVqZWN0KG5ldyBFcnJvcihleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG1ldGFkYXRhLnNpbmdsZUNhbGxiYWNrQXJnIHx8IGNhbGxiYWNrQXJncy5sZW5ndGggPD0gMSAmJiBtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHByb21pc2UucmVzb2x2ZShjYWxsYmFja0FyZ3NbMF0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9taXNlLnJlc29sdmUoY2FsbGJhY2tBcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9O1xuICAgICAgY29uc3QgcGx1cmFsaXplQXJndW1lbnRzID0gbnVtQXJncyA9PiBudW1BcmdzID09IDEgPyBcImFyZ3VtZW50XCIgOiBcImFyZ3VtZW50c1wiO1xuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgYSB3cmFwcGVyIGZ1bmN0aW9uIGZvciBhIG1ldGhvZCB3aXRoIHRoZSBnaXZlbiBuYW1lIGFuZCBtZXRhZGF0YS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgICAgICogICAgICAgIFRoZSBuYW1lIG9mIHRoZSBtZXRob2Qgd2hpY2ggaXMgYmVpbmcgd3JhcHBlZC5cbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBtZXRhZGF0YVxuICAgICAgICogICAgICAgIE1ldGFkYXRhIGFib3V0IHRoZSBtZXRob2QgYmVpbmcgd3JhcHBlZC5cbiAgICAgICAqIEBwYXJhbSB7aW50ZWdlcn0gbWV0YWRhdGEubWluQXJnc1xuICAgICAgICogICAgICAgIFRoZSBtaW5pbXVtIG51bWJlciBvZiBhcmd1bWVudHMgd2hpY2ggbXVzdCBiZSBwYXNzZWQgdG8gdGhlXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24uIElmIGNhbGxlZCB3aXRoIGZld2VyIHRoYW4gdGhpcyBudW1iZXIgb2YgYXJndW1lbnRzLCB0aGVcbiAgICAgICAqICAgICAgICB3cmFwcGVyIHdpbGwgcmFpc2UgYW4gZXhjZXB0aW9uLlxuICAgICAgICogQHBhcmFtIHtpbnRlZ2VyfSBtZXRhZGF0YS5tYXhBcmdzXG4gICAgICAgKiAgICAgICAgVGhlIG1heGltdW0gbnVtYmVyIG9mIGFyZ3VtZW50cyB3aGljaCBtYXkgYmUgcGFzc2VkIHRvIHRoZVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uLiBJZiBjYWxsZWQgd2l0aCBtb3JlIHRoYW4gdGhpcyBudW1iZXIgb2YgYXJndW1lbnRzLCB0aGVcbiAgICAgICAqICAgICAgICB3cmFwcGVyIHdpbGwgcmFpc2UgYW4gZXhjZXB0aW9uLlxuICAgICAgICogQHBhcmFtIHtib29sZWFufSBtZXRhZGF0YS5zaW5nbGVDYWxsYmFja0FyZ1xuICAgICAgICogICAgICAgIFdoZXRoZXIgb3Igbm90IHRoZSBwcm9taXNlIGlzIHJlc29sdmVkIHdpdGggb25seSB0aGUgZmlyc3RcbiAgICAgICAqICAgICAgICBhcmd1bWVudCBvZiB0aGUgY2FsbGJhY2ssIGFsdGVybmF0aXZlbHkgYW4gYXJyYXkgb2YgYWxsIHRoZVxuICAgICAgICogICAgICAgIGNhbGxiYWNrIGFyZ3VtZW50cyBpcyByZXNvbHZlZC4gQnkgZGVmYXVsdCwgaWYgdGhlIGNhbGxiYWNrXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gaXMgaW52b2tlZCB3aXRoIG9ubHkgYSBzaW5nbGUgYXJndW1lbnQsIHRoYXQgd2lsbCBiZVxuICAgICAgICogICAgICAgIHJlc29sdmVkIHRvIHRoZSBwcm9taXNlLCB3aGlsZSBhbGwgYXJndW1lbnRzIHdpbGwgYmUgcmVzb2x2ZWQgYXNcbiAgICAgICAqICAgICAgICBhbiBhcnJheSBpZiBtdWx0aXBsZSBhcmUgZ2l2ZW4uXG4gICAgICAgKlxuICAgICAgICogQHJldHVybnMge2Z1bmN0aW9uKG9iamVjdCwgLi4uKil9XG4gICAgICAgKiAgICAgICBUaGUgZ2VuZXJhdGVkIHdyYXBwZXIgZnVuY3Rpb24uXG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHdyYXBBc3luY0Z1bmN0aW9uID0gKG5hbWUsIG1ldGFkYXRhKSA9PiB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBhc3luY0Z1bmN0aW9uV3JhcHBlcih0YXJnZXQsIC4uLmFyZ3MpIHtcbiAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPCBtZXRhZGF0YS5taW5BcmdzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IGxlYXN0ICR7bWV0YWRhdGEubWluQXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWluQXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYXJncy5sZW5ndGggPiBtZXRhZGF0YS5tYXhBcmdzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGF0IG1vc3QgJHttZXRhZGF0YS5tYXhBcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5tYXhBcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAobWV0YWRhdGEuZmFsbGJhY2tUb05vQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgLy8gVGhpcyBBUEkgbWV0aG9kIGhhcyBjdXJyZW50bHkgbm8gY2FsbGJhY2sgb24gQ2hyb21lLCBidXQgaXQgcmV0dXJuIGEgcHJvbWlzZSBvbiBGaXJlZm94LFxuICAgICAgICAgICAgICAvLyBhbmQgc28gdGhlIHBvbHlmaWxsIHdpbGwgdHJ5IHRvIGNhbGwgaXQgd2l0aCBhIGNhbGxiYWNrIGZpcnN0LCBhbmQgaXQgd2lsbCBmYWxsYmFja1xuICAgICAgICAgICAgICAvLyB0byBub3QgcGFzc2luZyB0aGUgY2FsbGJhY2sgaWYgdGhlIGZpcnN0IGNhbGwgZmFpbHMuXG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MsIG1ha2VDYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlLFxuICAgICAgICAgICAgICAgICAgcmVqZWN0XG4gICAgICAgICAgICAgICAgfSwgbWV0YWRhdGEpKTtcbiAgICAgICAgICAgICAgfSBjYXRjaCAoY2JFcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgJHtuYW1lfSBBUEkgbWV0aG9kIGRvZXNuJ3Qgc2VlbSB0byBzdXBwb3J0IHRoZSBjYWxsYmFjayBwYXJhbWV0ZXIsIGAgKyBcImZhbGxpbmcgYmFjayB0byBjYWxsIGl0IHdpdGhvdXQgYSBjYWxsYmFjazogXCIsIGNiRXJyb3IpO1xuICAgICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzKTtcblxuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgQVBJIG1ldGhvZCBtZXRhZGF0YSwgc28gdGhhdCB0aGUgbmV4dCBBUEkgY2FsbHMgd2lsbCBub3QgdHJ5IHRvXG4gICAgICAgICAgICAgICAgLy8gdXNlIHRoZSB1bnN1cHBvcnRlZCBjYWxsYmFjayBhbnltb3JlLlxuICAgICAgICAgICAgICAgIG1ldGFkYXRhLmZhbGxiYWNrVG9Ob0NhbGxiYWNrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbWV0YWRhdGEubm9DYWxsYmFjayA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1ldGFkYXRhLm5vQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MpO1xuICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncywgbWFrZUNhbGxiYWNrKHtcbiAgICAgICAgICAgICAgICByZXNvbHZlLFxuICAgICAgICAgICAgICAgIHJlamVjdFxuICAgICAgICAgICAgICB9LCBtZXRhZGF0YSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfTtcblxuICAgICAgLyoqXG4gICAgICAgKiBXcmFwcyBhbiBleGlzdGluZyBtZXRob2Qgb2YgdGhlIHRhcmdldCBvYmplY3QsIHNvIHRoYXQgY2FsbHMgdG8gaXQgYXJlXG4gICAgICAgKiBpbnRlcmNlcHRlZCBieSB0aGUgZ2l2ZW4gd3JhcHBlciBmdW5jdGlvbi4gVGhlIHdyYXBwZXIgZnVuY3Rpb24gcmVjZWl2ZXMsXG4gICAgICAgKiBhcyBpdHMgZmlyc3QgYXJndW1lbnQsIHRoZSBvcmlnaW5hbCBgdGFyZ2V0YCBvYmplY3QsIGZvbGxvd2VkIGJ5IGVhY2ggb2ZcbiAgICAgICAqIHRoZSBhcmd1bWVudHMgcGFzc2VkIHRvIHRoZSBvcmlnaW5hbCBtZXRob2QuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IHRhcmdldFxuICAgICAgICogICAgICAgIFRoZSBvcmlnaW5hbCB0YXJnZXQgb2JqZWN0IHRoYXQgdGhlIHdyYXBwZWQgbWV0aG9kIGJlbG9uZ3MgdG8uXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBtZXRob2RcbiAgICAgICAqICAgICAgICBUaGUgbWV0aG9kIGJlaW5nIHdyYXBwZWQuIFRoaXMgaXMgdXNlZCBhcyB0aGUgdGFyZ2V0IG9mIHRoZSBQcm94eVxuICAgICAgICogICAgICAgIG9iamVjdCB3aGljaCBpcyBjcmVhdGVkIHRvIHdyYXAgdGhlIG1ldGhvZC5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IHdyYXBwZXJcbiAgICAgICAqICAgICAgICBUaGUgd3JhcHBlciBmdW5jdGlvbiB3aGljaCBpcyBjYWxsZWQgaW4gcGxhY2Ugb2YgYSBkaXJlY3QgaW52b2NhdGlvblxuICAgICAgICogICAgICAgIG9mIHRoZSB3cmFwcGVkIG1ldGhvZC5cbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJucyB7UHJveHk8ZnVuY3Rpb24+fVxuICAgICAgICogICAgICAgIEEgUHJveHkgb2JqZWN0IGZvciB0aGUgZ2l2ZW4gbWV0aG9kLCB3aGljaCBpbnZva2VzIHRoZSBnaXZlbiB3cmFwcGVyXG4gICAgICAgKiAgICAgICAgbWV0aG9kIGluIGl0cyBwbGFjZS5cbiAgICAgICAqL1xuICAgICAgY29uc3Qgd3JhcE1ldGhvZCA9ICh0YXJnZXQsIG1ldGhvZCwgd3JhcHBlcikgPT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KG1ldGhvZCwge1xuICAgICAgICAgIGFwcGx5KHRhcmdldE1ldGhvZCwgdGhpc09iaiwgYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIHdyYXBwZXIuY2FsbCh0aGlzT2JqLCB0YXJnZXQsIC4uLmFyZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgbGV0IGhhc093blByb3BlcnR5ID0gRnVuY3Rpb24uY2FsbC5iaW5kKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpO1xuXG4gICAgICAvKipcbiAgICAgICAqIFdyYXBzIGFuIG9iamVjdCBpbiBhIFByb3h5IHdoaWNoIGludGVyY2VwdHMgYW5kIHdyYXBzIGNlcnRhaW4gbWV0aG9kc1xuICAgICAgICogYmFzZWQgb24gdGhlIGdpdmVuIGB3cmFwcGVyc2AgYW5kIGBtZXRhZGF0YWAgb2JqZWN0cy5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0XG4gICAgICAgKiAgICAgICAgVGhlIHRhcmdldCBvYmplY3QgdG8gd3JhcC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gW3dyYXBwZXJzID0ge31dXG4gICAgICAgKiAgICAgICAgQW4gb2JqZWN0IHRyZWUgY29udGFpbmluZyB3cmFwcGVyIGZ1bmN0aW9ucyBmb3Igc3BlY2lhbCBjYXNlcy4gQW55XG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24gcHJlc2VudCBpbiB0aGlzIG9iamVjdCB0cmVlIGlzIGNhbGxlZCBpbiBwbGFjZSBvZiB0aGVcbiAgICAgICAqICAgICAgICBtZXRob2QgaW4gdGhlIHNhbWUgbG9jYXRpb24gaW4gdGhlIGB0YXJnZXRgIG9iamVjdCB0cmVlLiBUaGVzZVxuICAgICAgICogICAgICAgIHdyYXBwZXIgbWV0aG9kcyBhcmUgaW52b2tlZCBhcyBkZXNjcmliZWQgaW4ge0BzZWUgd3JhcE1ldGhvZH0uXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IFttZXRhZGF0YSA9IHt9XVxuICAgICAgICogICAgICAgIEFuIG9iamVjdCB0cmVlIGNvbnRhaW5pbmcgbWV0YWRhdGEgdXNlZCB0byBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlXG4gICAgICAgKiAgICAgICAgUHJvbWlzZS1iYXNlZCB3cmFwcGVyIGZ1bmN0aW9ucyBmb3IgYXN5bmNocm9ub3VzLiBBbnkgZnVuY3Rpb24gaW5cbiAgICAgICAqICAgICAgICB0aGUgYHRhcmdldGAgb2JqZWN0IHRyZWUgd2hpY2ggaGFzIGEgY29ycmVzcG9uZGluZyBtZXRhZGF0YSBvYmplY3RcbiAgICAgICAqICAgICAgICBpbiB0aGUgc2FtZSBsb2NhdGlvbiBpbiB0aGUgYG1ldGFkYXRhYCB0cmVlIGlzIHJlcGxhY2VkIHdpdGggYW5cbiAgICAgICAqICAgICAgICBhdXRvbWF0aWNhbGx5LWdlbmVyYXRlZCB3cmFwcGVyIGZ1bmN0aW9uLCBhcyBkZXNjcmliZWQgaW5cbiAgICAgICAqICAgICAgICB7QHNlZSB3cmFwQXN5bmNGdW5jdGlvbn1cbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJucyB7UHJveHk8b2JqZWN0Pn1cbiAgICAgICAqL1xuICAgICAgY29uc3Qgd3JhcE9iamVjdCA9ICh0YXJnZXQsIHdyYXBwZXJzID0ge30sIG1ldGFkYXRhID0ge30pID0+IHtcbiAgICAgICAgbGV0IGNhY2hlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgbGV0IGhhbmRsZXJzID0ge1xuICAgICAgICAgIGhhcyhwcm94eVRhcmdldCwgcHJvcCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb3AgaW4gdGFyZ2V0IHx8IHByb3AgaW4gY2FjaGU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXQocHJveHlUYXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgICBpZiAocHJvcCBpbiBjYWNoZSkge1xuICAgICAgICAgICAgICByZXR1cm4gY2FjaGVbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIShwcm9wIGluIHRhcmdldCkpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCB2YWx1ZSA9IHRhcmdldFtwcm9wXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAvLyBUaGlzIGlzIGEgbWV0aG9kIG9uIHRoZSB1bmRlcmx5aW5nIG9iamVjdC4gQ2hlY2sgaWYgd2UgbmVlZCB0byBkb1xuICAgICAgICAgICAgICAvLyBhbnkgd3JhcHBpbmcuXG5cbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiB3cmFwcGVyc1twcm9wXSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSBhIHNwZWNpYWwtY2FzZSB3cmFwcGVyIGZvciB0aGlzIG1ldGhvZC5cbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHdyYXBNZXRob2QodGFyZ2V0LCB0YXJnZXRbcHJvcF0sIHdyYXBwZXJzW3Byb3BdKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIGFuIGFzeW5jIG1ldGhvZCB0aGF0IHdlIGhhdmUgbWV0YWRhdGEgZm9yLiBDcmVhdGUgYVxuICAgICAgICAgICAgICAgIC8vIFByb21pc2Ugd3JhcHBlciBmb3IgaXQuXG4gICAgICAgICAgICAgICAgbGV0IHdyYXBwZXIgPSB3cmFwQXN5bmNGdW5jdGlvbihwcm9wLCBtZXRhZGF0YVtwcm9wXSk7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwTWV0aG9kKHRhcmdldCwgdGFyZ2V0W3Byb3BdLCB3cmFwcGVyKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIGEgbWV0aG9kIHRoYXQgd2UgZG9uJ3Qga25vdyBvciBjYXJlIGFib3V0LiBSZXR1cm4gdGhlXG4gICAgICAgICAgICAgICAgLy8gb3JpZ2luYWwgbWV0aG9kLCBib3VuZCB0byB0aGUgdW5kZXJseWluZyBvYmplY3QuXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5iaW5kKHRhcmdldCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsICYmIChoYXNPd25Qcm9wZXJ0eSh3cmFwcGVycywgcHJvcCkgfHwgaGFzT3duUHJvcGVydHkobWV0YWRhdGEsIHByb3ApKSkge1xuICAgICAgICAgICAgICAvLyBUaGlzIGlzIGFuIG9iamVjdCB0aGF0IHdlIG5lZWQgdG8gZG8gc29tZSB3cmFwcGluZyBmb3IgdGhlIGNoaWxkcmVuXG4gICAgICAgICAgICAgIC8vIG9mLiBDcmVhdGUgYSBzdWItb2JqZWN0IHdyYXBwZXIgZm9yIGl0IHdpdGggdGhlIGFwcHJvcHJpYXRlIGNoaWxkXG4gICAgICAgICAgICAgIC8vIG1ldGFkYXRhLlxuICAgICAgICAgICAgICB2YWx1ZSA9IHdyYXBPYmplY3QodmFsdWUsIHdyYXBwZXJzW3Byb3BdLCBtZXRhZGF0YVtwcm9wXSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGhhc093blByb3BlcnR5KG1ldGFkYXRhLCBcIipcIikpIHtcbiAgICAgICAgICAgICAgLy8gV3JhcCBhbGwgcHJvcGVydGllcyBpbiAqIG5hbWVzcGFjZS5cbiAgICAgICAgICAgICAgdmFsdWUgPSB3cmFwT2JqZWN0KHZhbHVlLCB3cmFwcGVyc1twcm9wXSwgbWV0YWRhdGFbXCIqXCJdKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIFdlIGRvbid0IG5lZWQgdG8gZG8gYW55IHdyYXBwaW5nIGZvciB0aGlzIHByb3BlcnR5LFxuICAgICAgICAgICAgICAvLyBzbyBqdXN0IGZvcndhcmQgYWxsIGFjY2VzcyB0byB0aGUgdW5kZXJseWluZyBvYmplY3QuXG4gICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjYWNoZSwgcHJvcCwge1xuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXRbcHJvcF07XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzZXQodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhY2hlW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXQocHJveHlUYXJnZXQsIHByb3AsIHZhbHVlLCByZWNlaXZlcikge1xuICAgICAgICAgICAgaWYgKHByb3AgaW4gY2FjaGUpIHtcbiAgICAgICAgICAgICAgY2FjaGVbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZWZpbmVQcm9wZXJ0eShwcm94eVRhcmdldCwgcHJvcCwgZGVzYykge1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkoY2FjaGUsIHByb3AsIGRlc2MpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZGVsZXRlUHJvcGVydHkocHJveHlUYXJnZXQsIHByb3ApIHtcbiAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KGNhY2hlLCBwcm9wKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUGVyIGNvbnRyYWN0IG9mIHRoZSBQcm94eSBBUEksIHRoZSBcImdldFwiIHByb3h5IGhhbmRsZXIgbXVzdCByZXR1cm4gdGhlXG4gICAgICAgIC8vIG9yaWdpbmFsIHZhbHVlIG9mIHRoZSB0YXJnZXQgaWYgdGhhdCB2YWx1ZSBpcyBkZWNsYXJlZCByZWFkLW9ubHkgYW5kXG4gICAgICAgIC8vIG5vbi1jb25maWd1cmFibGUuIEZvciB0aGlzIHJlYXNvbiwgd2UgY3JlYXRlIGFuIG9iamVjdCB3aXRoIHRoZVxuICAgICAgICAvLyBwcm90b3R5cGUgc2V0IHRvIGB0YXJnZXRgIGluc3RlYWQgb2YgdXNpbmcgYHRhcmdldGAgZGlyZWN0bHkuXG4gICAgICAgIC8vIE90aGVyd2lzZSB3ZSBjYW5ub3QgcmV0dXJuIGEgY3VzdG9tIG9iamVjdCBmb3IgQVBJcyB0aGF0XG4gICAgICAgIC8vIGFyZSBkZWNsYXJlZCByZWFkLW9ubHkgYW5kIG5vbi1jb25maWd1cmFibGUsIHN1Y2ggYXMgYGNocm9tZS5kZXZ0b29sc2AuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFRoZSBwcm94eSBoYW5kbGVycyB0aGVtc2VsdmVzIHdpbGwgc3RpbGwgdXNlIHRoZSBvcmlnaW5hbCBgdGFyZ2V0YFxuICAgICAgICAvLyBpbnN0ZWFkIG9mIHRoZSBgcHJveHlUYXJnZXRgLCBzbyB0aGF0IHRoZSBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzIGFyZVxuICAgICAgICAvLyBkZXJlZmVyZW5jZWQgdmlhIHRoZSBvcmlnaW5hbCB0YXJnZXRzLlxuICAgICAgICBsZXQgcHJveHlUYXJnZXQgPSBPYmplY3QuY3JlYXRlKHRhcmdldCk7XG4gICAgICAgIHJldHVybiBuZXcgUHJveHkocHJveHlUYXJnZXQsIGhhbmRsZXJzKTtcbiAgICAgIH07XG5cbiAgICAgIC8qKlxuICAgICAgICogQ3JlYXRlcyBhIHNldCBvZiB3cmFwcGVyIGZ1bmN0aW9ucyBmb3IgYW4gZXZlbnQgb2JqZWN0LCB3aGljaCBoYW5kbGVzXG4gICAgICAgKiB3cmFwcGluZyBvZiBsaXN0ZW5lciBmdW5jdGlvbnMgdGhhdCB0aG9zZSBtZXNzYWdlcyBhcmUgcGFzc2VkLlxuICAgICAgICpcbiAgICAgICAqIEEgc2luZ2xlIHdyYXBwZXIgaXMgY3JlYXRlZCBmb3IgZWFjaCBsaXN0ZW5lciBmdW5jdGlvbiwgYW5kIHN0b3JlZCBpbiBhXG4gICAgICAgKiBtYXAuIFN1YnNlcXVlbnQgY2FsbHMgdG8gYGFkZExpc3RlbmVyYCwgYGhhc0xpc3RlbmVyYCwgb3IgYHJlbW92ZUxpc3RlbmVyYFxuICAgICAgICogcmV0cmlldmUgdGhlIG9yaWdpbmFsIHdyYXBwZXIsIHNvIHRoYXQgIGF0dGVtcHRzIHRvIHJlbW92ZSBhXG4gICAgICAgKiBwcmV2aW91c2x5LWFkZGVkIGxpc3RlbmVyIHdvcmsgYXMgZXhwZWN0ZWQuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtEZWZhdWx0V2Vha01hcDxmdW5jdGlvbiwgZnVuY3Rpb24+fSB3cmFwcGVyTWFwXG4gICAgICAgKiAgICAgICAgQSBEZWZhdWx0V2Vha01hcCBvYmplY3Qgd2hpY2ggd2lsbCBjcmVhdGUgdGhlIGFwcHJvcHJpYXRlIHdyYXBwZXJcbiAgICAgICAqICAgICAgICBmb3IgYSBnaXZlbiBsaXN0ZW5lciBmdW5jdGlvbiB3aGVuIG9uZSBkb2VzIG5vdCBleGlzdCwgYW5kIHJldHJpZXZlXG4gICAgICAgKiAgICAgICAgYW4gZXhpc3Rpbmcgb25lIHdoZW4gaXQgZG9lcy5cbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgICAgICovXG4gICAgICBjb25zdCB3cmFwRXZlbnQgPSB3cmFwcGVyTWFwID0+ICh7XG4gICAgICAgIGFkZExpc3RlbmVyKHRhcmdldCwgbGlzdGVuZXIsIC4uLmFyZ3MpIHtcbiAgICAgICAgICB0YXJnZXQuYWRkTGlzdGVuZXIod3JhcHBlck1hcC5nZXQobGlzdGVuZXIpLCAuLi5hcmdzKTtcbiAgICAgICAgfSxcbiAgICAgICAgaGFzTGlzdGVuZXIodGFyZ2V0LCBsaXN0ZW5lcikge1xuICAgICAgICAgIHJldHVybiB0YXJnZXQuaGFzTGlzdGVuZXIod3JhcHBlck1hcC5nZXQobGlzdGVuZXIpKTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVtb3ZlTGlzdGVuZXIodGFyZ2V0LCBsaXN0ZW5lcikge1xuICAgICAgICAgIHRhcmdldC5yZW1vdmVMaXN0ZW5lcih3cmFwcGVyTWFwLmdldChsaXN0ZW5lcikpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG9uUmVxdWVzdEZpbmlzaGVkV3JhcHBlcnMgPSBuZXcgRGVmYXVsdFdlYWtNYXAobGlzdGVuZXIgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogV3JhcHMgYW4gb25SZXF1ZXN0RmluaXNoZWQgbGlzdGVuZXIgZnVuY3Rpb24gc28gdGhhdCBpdCB3aWxsIHJldHVybiBhXG4gICAgICAgICAqIGBnZXRDb250ZW50KClgIHByb3BlcnR5IHdoaWNoIHJldHVybnMgYSBgUHJvbWlzZWAgcmF0aGVyIHRoYW4gdXNpbmcgYVxuICAgICAgICAgKiBjYWxsYmFjayBBUEkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZXFcbiAgICAgICAgICogICAgICAgIFRoZSBIQVIgZW50cnkgb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgbmV0d29yayByZXF1ZXN0LlxuICAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG9uUmVxdWVzdEZpbmlzaGVkKHJlcSkge1xuICAgICAgICAgIGNvbnN0IHdyYXBwZWRSZXEgPSB3cmFwT2JqZWN0KHJlcSwge30gLyogd3JhcHBlcnMgKi8sIHtcbiAgICAgICAgICAgIGdldENvbnRlbnQ6IHtcbiAgICAgICAgICAgICAgbWluQXJnczogMCxcbiAgICAgICAgICAgICAgbWF4QXJnczogMFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxpc3RlbmVyKHdyYXBwZWRSZXEpO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgICBjb25zdCBvbk1lc3NhZ2VXcmFwcGVycyA9IG5ldyBEZWZhdWx0V2Vha01hcChsaXN0ZW5lciA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXcmFwcyBhIG1lc3NhZ2UgbGlzdGVuZXIgZnVuY3Rpb24gc28gdGhhdCBpdCBtYXkgc2VuZCByZXNwb25zZXMgYmFzZWQgb25cbiAgICAgICAgICogaXRzIHJldHVybiB2YWx1ZSwgcmF0aGVyIHRoYW4gYnkgcmV0dXJuaW5nIGEgc2VudGluZWwgdmFsdWUgYW5kIGNhbGxpbmcgYVxuICAgICAgICAgKiBjYWxsYmFjay4gSWYgdGhlIGxpc3RlbmVyIGZ1bmN0aW9uIHJldHVybnMgYSBQcm9taXNlLCB0aGUgcmVzcG9uc2UgaXNcbiAgICAgICAgICogc2VudCB3aGVuIHRoZSBwcm9taXNlIGVpdGhlciByZXNvbHZlcyBvciByZWplY3RzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0geyp9IG1lc3NhZ2VcbiAgICAgICAgICogICAgICAgIFRoZSBtZXNzYWdlIHNlbnQgYnkgdGhlIG90aGVyIGVuZCBvZiB0aGUgY2hhbm5lbC5cbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHNlbmRlclxuICAgICAgICAgKiAgICAgICAgRGV0YWlscyBhYm91dCB0aGUgc2VuZGVyIG9mIHRoZSBtZXNzYWdlLlxuICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCopfSBzZW5kUmVzcG9uc2VcbiAgICAgICAgICogICAgICAgIEEgY2FsbGJhY2sgd2hpY2gsIHdoZW4gY2FsbGVkIHdpdGggYW4gYXJiaXRyYXJ5IGFyZ3VtZW50LCBzZW5kc1xuICAgICAgICAgKiAgICAgICAgdGhhdCB2YWx1ZSBhcyBhIHJlc3BvbnNlLlxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgICAgICogICAgICAgIFRydWUgaWYgdGhlIHdyYXBwZWQgbGlzdGVuZXIgcmV0dXJuZWQgYSBQcm9taXNlLCB3aGljaCB3aWxsIGxhdGVyXG4gICAgICAgICAqICAgICAgICB5aWVsZCBhIHJlc3BvbnNlLiBGYWxzZSBvdGhlcndpc2UuXG4gICAgICAgICAqL1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gb25NZXNzYWdlKG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gICAgICAgICAgbGV0IGRpZENhbGxTZW5kUmVzcG9uc2UgPSBmYWxzZTtcbiAgICAgICAgICBsZXQgd3JhcHBlZFNlbmRSZXNwb25zZTtcbiAgICAgICAgICBsZXQgc2VuZFJlc3BvbnNlUHJvbWlzZSA9IG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgICAgICAgd3JhcHBlZFNlbmRSZXNwb25zZSA9IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICBkaWRDYWxsU2VuZFJlc3BvbnNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxldCByZXN1bHQ7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGxpc3RlbmVyKG1lc3NhZ2UsIHNlbmRlciwgd3JhcHBlZFNlbmRSZXNwb25zZSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXN1bHQgPSBQcm9taXNlLnJlamVjdChlcnIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBpc1Jlc3VsdFRoZW5hYmxlID0gcmVzdWx0ICE9PSB0cnVlICYmIGlzVGhlbmFibGUocmVzdWx0KTtcblxuICAgICAgICAgIC8vIElmIHRoZSBsaXN0ZW5lciBkaWRuJ3QgcmV0dXJuZWQgdHJ1ZSBvciBhIFByb21pc2UsIG9yIGNhbGxlZFxuICAgICAgICAgIC8vIHdyYXBwZWRTZW5kUmVzcG9uc2Ugc3luY2hyb25vdXNseSwgd2UgY2FuIGV4aXQgZWFybGllclxuICAgICAgICAgIC8vIGJlY2F1c2UgdGhlcmUgd2lsbCBiZSBubyByZXNwb25zZSBzZW50IGZyb20gdGhpcyBsaXN0ZW5lci5cbiAgICAgICAgICBpZiAocmVzdWx0ICE9PSB0cnVlICYmICFpc1Jlc3VsdFRoZW5hYmxlICYmICFkaWRDYWxsU2VuZFJlc3BvbnNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQSBzbWFsbCBoZWxwZXIgdG8gc2VuZCB0aGUgbWVzc2FnZSBpZiB0aGUgcHJvbWlzZSByZXNvbHZlc1xuICAgICAgICAgIC8vIGFuZCBhbiBlcnJvciBpZiB0aGUgcHJvbWlzZSByZWplY3RzIChhIHdyYXBwZWQgc2VuZE1lc3NhZ2UgaGFzXG4gICAgICAgICAgLy8gdG8gdHJhbnNsYXRlIHRoZSBtZXNzYWdlIGludG8gYSByZXNvbHZlZCBwcm9taXNlIG9yIGEgcmVqZWN0ZWRcbiAgICAgICAgICAvLyBwcm9taXNlKS5cbiAgICAgICAgICBjb25zdCBzZW5kUHJvbWlzZWRSZXN1bHQgPSBwcm9taXNlID0+IHtcbiAgICAgICAgICAgIHByb21pc2UudGhlbihtc2cgPT4ge1xuICAgICAgICAgICAgICAvLyBzZW5kIHRoZSBtZXNzYWdlIHZhbHVlLlxuICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UobXNnKTtcbiAgICAgICAgICAgIH0sIGVycm9yID0+IHtcbiAgICAgICAgICAgICAgLy8gU2VuZCBhIEpTT04gcmVwcmVzZW50YXRpb24gb2YgdGhlIGVycm9yIGlmIHRoZSByZWplY3RlZCB2YWx1ZVxuICAgICAgICAgICAgICAvLyBpcyBhbiBpbnN0YW5jZSBvZiBlcnJvciwgb3IgdGhlIG9iamVjdCBpdHNlbGYgb3RoZXJ3aXNlLlxuICAgICAgICAgICAgICBsZXQgbWVzc2FnZTtcbiAgICAgICAgICAgICAgaWYgKGVycm9yICYmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yIHx8IHR5cGVvZiBlcnJvci5tZXNzYWdlID09PSBcInN0cmluZ1wiKSkge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBlcnJvci5tZXNzYWdlO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBcIkFuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJyZWRcIjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgICAgIF9fbW96V2ViRXh0ZW5zaW9uUG9seWZpbGxSZWplY3RfXzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgLy8gUHJpbnQgYW4gZXJyb3Igb24gdGhlIGNvbnNvbGUgaWYgdW5hYmxlIHRvIHNlbmQgdGhlIHJlc3BvbnNlLlxuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmFpbGVkIHRvIHNlbmQgb25NZXNzYWdlIHJlamVjdGVkIHJlcGx5XCIsIGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgLy8gSWYgdGhlIGxpc3RlbmVyIHJldHVybmVkIGEgUHJvbWlzZSwgc2VuZCB0aGUgcmVzb2x2ZWQgdmFsdWUgYXMgYVxuICAgICAgICAgIC8vIHJlc3VsdCwgb3RoZXJ3aXNlIHdhaXQgdGhlIHByb21pc2UgcmVsYXRlZCB0byB0aGUgd3JhcHBlZFNlbmRSZXNwb25zZVxuICAgICAgICAgIC8vIGNhbGxiYWNrIHRvIHJlc29sdmUgYW5kIHNlbmQgaXQgYXMgYSByZXNwb25zZS5cbiAgICAgICAgICBpZiAoaXNSZXN1bHRUaGVuYWJsZSkge1xuICAgICAgICAgICAgc2VuZFByb21pc2VkUmVzdWx0KHJlc3VsdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbmRQcm9taXNlZFJlc3VsdChzZW5kUmVzcG9uc2VQcm9taXNlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBMZXQgQ2hyb21lIGtub3cgdGhhdCB0aGUgbGlzdGVuZXIgaXMgcmVwbHlpbmcuXG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHdyYXBwZWRTZW5kTWVzc2FnZUNhbGxiYWNrID0gKHtcbiAgICAgICAgcmVqZWN0LFxuICAgICAgICByZXNvbHZlXG4gICAgICB9LCByZXBseSkgPT4ge1xuICAgICAgICBpZiAoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgIC8vIERldGVjdCB3aGVuIG5vbmUgb2YgdGhlIGxpc3RlbmVycyByZXBsaWVkIHRvIHRoZSBzZW5kTWVzc2FnZSBjYWxsIGFuZCByZXNvbHZlXG4gICAgICAgICAgLy8gdGhlIHByb21pc2UgdG8gdW5kZWZpbmVkIGFzIGluIEZpcmVmb3guXG4gICAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3dlYmV4dGVuc2lvbi1wb2x5ZmlsbC9pc3N1ZXMvMTMwXG4gICAgICAgICAgaWYgKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSA9PT0gQ0hST01FX1NFTkRfTUVTU0FHRV9DQUxMQkFDS19OT19SRVNQT05TRV9NRVNTQUdFKSB7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHJlcGx5ICYmIHJlcGx5Ll9fbW96V2ViRXh0ZW5zaW9uUG9seWZpbGxSZWplY3RfXykge1xuICAgICAgICAgIC8vIENvbnZlcnQgYmFjayB0aGUgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgZXJyb3IgaW50b1xuICAgICAgICAgIC8vIGFuIEVycm9yIGluc3RhbmNlLlxuICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IocmVwbHkubWVzc2FnZSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUocmVwbHkpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgY29uc3Qgd3JhcHBlZFNlbmRNZXNzYWdlID0gKG5hbWUsIG1ldGFkYXRhLCBhcGlOYW1lc3BhY2VPYmosIC4uLmFyZ3MpID0+IHtcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoIDwgbWV0YWRhdGEubWluQXJncykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYXQgbGVhc3QgJHttZXRhZGF0YS5taW5BcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5taW5BcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gbWV0YWRhdGEubWF4QXJncykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYXQgbW9zdCAke21ldGFkYXRhLm1heEFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1heEFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHdyYXBwZWRDYiA9IHdyYXBwZWRTZW5kTWVzc2FnZUNhbGxiYWNrLmJpbmQobnVsbCwge1xuICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgIHJlamVjdFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGFyZ3MucHVzaCh3cmFwcGVkQ2IpO1xuICAgICAgICAgIGFwaU5hbWVzcGFjZU9iai5zZW5kTWVzc2FnZSguLi5hcmdzKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgICAgY29uc3Qgc3RhdGljV3JhcHBlcnMgPSB7XG4gICAgICAgIGRldnRvb2xzOiB7XG4gICAgICAgICAgbmV0d29yazoge1xuICAgICAgICAgICAgb25SZXF1ZXN0RmluaXNoZWQ6IHdyYXBFdmVudChvblJlcXVlc3RGaW5pc2hlZFdyYXBwZXJzKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcnVudGltZToge1xuICAgICAgICAgIG9uTWVzc2FnZTogd3JhcEV2ZW50KG9uTWVzc2FnZVdyYXBwZXJzKSxcbiAgICAgICAgICBvbk1lc3NhZ2VFeHRlcm5hbDogd3JhcEV2ZW50KG9uTWVzc2FnZVdyYXBwZXJzKSxcbiAgICAgICAgICBzZW5kTWVzc2FnZTogd3JhcHBlZFNlbmRNZXNzYWdlLmJpbmQobnVsbCwgXCJzZW5kTWVzc2FnZVwiLCB7XG4gICAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgICAgbWF4QXJnczogM1xuICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIHRhYnM6IHtcbiAgICAgICAgICBzZW5kTWVzc2FnZTogd3JhcHBlZFNlbmRNZXNzYWdlLmJpbmQobnVsbCwgXCJzZW5kTWVzc2FnZVwiLCB7XG4gICAgICAgICAgICBtaW5BcmdzOiAyLFxuICAgICAgICAgICAgbWF4QXJnczogM1xuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCBzZXR0aW5nTWV0YWRhdGEgPSB7XG4gICAgICAgIGNsZWFyOiB7XG4gICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICBtYXhBcmdzOiAxXG4gICAgICAgIH0sXG4gICAgICAgIGdldDoge1xuICAgICAgICAgIG1pbkFyZ3M6IDEsXG4gICAgICAgICAgbWF4QXJnczogMVxuICAgICAgICB9LFxuICAgICAgICBzZXQ6IHtcbiAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgIG1heEFyZ3M6IDFcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGFwaU1ldGFkYXRhLnByaXZhY3kgPSB7XG4gICAgICAgIG5ldHdvcms6IHtcbiAgICAgICAgICBcIipcIjogc2V0dGluZ01ldGFkYXRhXG4gICAgICAgIH0sXG4gICAgICAgIHNlcnZpY2VzOiB7XG4gICAgICAgICAgXCIqXCI6IHNldHRpbmdNZXRhZGF0YVxuICAgICAgICB9LFxuICAgICAgICB3ZWJzaXRlczoge1xuICAgICAgICAgIFwiKlwiOiBzZXR0aW5nTWV0YWRhdGFcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJldHVybiB3cmFwT2JqZWN0KGV4dGVuc2lvbkFQSXMsIHN0YXRpY1dyYXBwZXJzLCBhcGlNZXRhZGF0YSk7XG4gICAgfTtcblxuICAgIC8vIFRoZSBidWlsZCBwcm9jZXNzIGFkZHMgYSBVTUQgd3JhcHBlciBhcm91bmQgdGhpcyBmaWxlLCB3aGljaCBtYWtlcyB0aGVcbiAgICAvLyBgbW9kdWxlYCB2YXJpYWJsZSBhdmFpbGFibGUuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSB3cmFwQVBJcyhjaHJvbWUpO1xuICB9IGVsc2Uge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZ2xvYmFsVGhpcy5icm93c2VyO1xuICB9XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJyb3dzZXItcG9seWZpbGwuanMubWFwXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG5jb25zdCBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGNvbnN0IGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHRjb25zdCBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdGlmICghKG1vZHVsZUlkIGluIF9fd2VicGFja19tb2R1bGVzX18pKSB7XG5cdFx0ZGVsZXRlIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdFx0Y29uc3QgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyBtb2R1bGVJZCArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdGNvbnN0IGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyL3ZhbHVlIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRpZihBcnJheS5pc0FycmF5KGRlZmluaXRpb24pKSB7XG5cdFx0dmFyIGkgPSAwO1xuXHRcdHdoaWxlKGkgPCBkZWZpbml0aW9uLmxlbmd0aCkge1xuXHRcdFx0dmFyIGtleSA9IGRlZmluaXRpb25baSsrXTtcblx0XHRcdHZhciBiaW5kaW5nID0gZGVmaW5pdGlvbltpKytdO1xuXHRcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRcdGlmKGJpbmRpbmcgPT09IDApIHtcblx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiBkZWZpbml0aW9uW2krK10gfSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGJpbmRpbmcgfSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZihiaW5kaW5nID09PSAwKSB7IGkrKzsgfVxuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiO1xuXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiQGV4dGVuc2lvbi1zY3JpcHRzL2xvZ2dlci9sb2dnZXIuY2xhc3NcIjtcbmltcG9ydCB7IERldGVjdGVkRm9ybSwgRm9ybUZpZWxkIH0gZnJvbSBcIkBzaGFyZWQvdHlwZXMvYXV0b2ZpbGwudHlwZXNcIjtcbmltcG9ydCB7IEF1dG9maWxsRW5naW5lIH0gZnJvbSBcIi4vc2VydmljZXMvYXV0b2ZpbGwtZW5naW5lXCI7XG5pbXBvcnQgeyBDb21tdW5pY2F0aW9uU2VydmljZSB9IGZyb20gXCIuL3NlcnZpY2VzL2NvbW11bmljYXRpb25cIjtcbmltcG9ydCB7IEZvcm1EZXRlY3RvciB9IGZyb20gXCIuL3NlcnZpY2VzL2Zvcm0tZGV0ZWN0b3JcIjtcbmltcG9ydCB7IFBhc3N3b3JkTWFuYWdlciB9IGZyb20gXCIuL3NlcnZpY2VzL3Bhc3N3b3JkLW1hbmFnZXJcIjtcbmltcG9ydCB7IFVJT3ZlcmxheSB9IGZyb20gXCIuL3NlcnZpY2VzL3VpLW92ZXJsYXlcIjtcblxuY2xhc3MgQXV0b2ZpbGxDb250ZW50U2NyaXB0IHtcbiAgICBwcml2YXRlIGF1dG9maWxsRW5naW5lOiBBdXRvZmlsbEVuZ2luZTtcbiAgICBwcml2YXRlIGNvbW11bmljYXRpb25TZXJ2aWNlOiBDb21tdW5pY2F0aW9uU2VydmljZTtcbiAgICBwcml2YXRlIGZvcm1EZXRlY3RvcjogRm9ybURldGVjdG9yO1xuICAgIHByaXZhdGUgaXNJbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgbGFzdEZvcm1Db3VudDogbnVtYmVyID0gMDtcbiAgICBwcml2YXRlIGxhc3RVcmw6IHN0cmluZyA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIHByaXZhdGUgbmV0d29ya0lkbGVEZWxheTogbnVtYmVyID0gNTAwOyAvLyBtcyB0byB3YWl0IGFmdGVyIGxhc3QgbmV0d29yayBhY3Rpdml0eVxuICAgIHByaXZhdGUgbmV0d29ya0lkbGVUaW1lb3V0OiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xuICAgIHByaXZhdGUgcGFzc3dvcmRNYW5hZ2VyOiBQYXNzd29yZE1hbmFnZXI7XG4gICAgcHJpdmF0ZSBwZW5kaW5nUmVxdWVzdHM6IFNldDxzdHJpbmc+ID0gbmV3IFNldCgpO1xuICAgIHByaXZhdGUgcmVzY2FuSW50ZXJ2YWw6IFJldHVyblR5cGU8dHlwZW9mIHNldEludGVydmFsPiB8IG51bGwgPSBudWxsO1xuICAgIHByaXZhdGUgc2VydmljZVdvcmtlckNoZWNrSW50ZXJ2YWw6IFJldHVyblR5cGU8dHlwZW9mIHNldEludGVydmFsPiB8IG51bGwgPSBudWxsO1xuICAgIHByaXZhdGUgc2VydmljZVdvcmtlclJlYWR5OiBib29sZWFuID0gZmFsc2U7XG4gICAgcHJpdmF0ZSB1aU92ZXJsYXk6IFVJT3ZlcmxheTtcbiAgICBwcml2YXRlIHVybENoZWNrSW50ZXJ2YWw6IFJldHVyblR5cGU8dHlwZW9mIHNldEludGVydmFsPiB8IG51bGwgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuYXV0b2ZpbGxFbmdpbmUgPSBuZXcgQXV0b2ZpbGxFbmdpbmUoKTtcbiAgICAgICAgdGhpcy5jb21tdW5pY2F0aW9uU2VydmljZSA9IENvbW11bmljYXRpb25TZXJ2aWNlLmdldEluc3RhbmNlKCk7XG4gICAgICAgIHRoaXMuZm9ybURldGVjdG9yID0gbmV3IEZvcm1EZXRlY3RvcigpO1xuICAgICAgICB0aGlzLnBhc3N3b3JkTWFuYWdlciA9IG5ldyBQYXNzd29yZE1hbmFnZXIoKTtcbiAgICAgICAgdGhpcy51aU92ZXJsYXkgPSBuZXcgVUlPdmVybGF5KCk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpemUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQpIHJldHVybjtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5zZXR1cEV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAgICAgICB0aGlzLnNldHVwQ29tbXVuaWNhdGlvbigpO1xuICAgICAgICAgICAgdGhpcy5zZXR1cE1vbml0b3JpbmcoKTtcbiAgICAgICAgICAgIHRoaXMuc2V0dXBOZXR3b3JrSWRsZURldGVjdGlvbigpO1xuXG4gICAgICAgICAgICB0aGlzLmlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICB0aGlzLnBlcmZvcm1JbW1lZGlhdGVGb3JtRGV0ZWN0aW9uKCk7XG5cbiAgICAgICAgICAgIC8vIEFsc28gcGVyZm9ybSBhIHF1aWNrIHJlc2NhbiBhZnRlciBhIHNob3J0IGRlbGF5IHRvIGNhdGNoIGFueSBtaXNzZWQgZm9ybXNcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucGVyZm9ybVF1aWNrUmVzY2FuKCk7XG4gICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJBdXRvZmlsbCBpbml0aWFsaXphdGlvblwiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHBlcmZvcm1JbW1lZGlhdGVGb3JtRGV0ZWN0aW9uKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmZvcm1EZXRlY3Rvci5zdGFydERldGVjdGlvbigpO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRGb3JtcyA9IHRoaXMuZm9ybURldGVjdG9yLmdldEN1cnJlbnRGb3JtcygpO1xuXG4gICAgICAgIGlmIChjdXJyZW50Rm9ybXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY3VycmVudEZvcm1zLmZvckVhY2goKGZvcm0pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NGb3JtKGZvcm0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldHVwRE9NTG9hZExpc3RlbmVycygpO1xuICAgICAgICB0aGlzLnN0YXJ0UGVyaW9kaWNSZXNjYW4oKTtcblxuICAgICAgICAvLyBBZGRpdGlvbmFsIGRlbGF5ZWQgc2NhbnMgZm9yIGR5bmFtaWMgY29udGVudFxuICAgICAgICB0aGlzLnNjaGVkdWxlRGVsYXllZFNjYW5zKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cERPTUxvYWRMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBlcmZvcm1RdWlja1Jlc2NhbigpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wZXJmb3JtUXVpY2tSZXNjYW4oKTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImxvYWRpbmdcIikge1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucGVyZm9ybVF1aWNrUmVzY2FuKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJyZWFkeXN0YXRlY2hhbmdlXCIsICgpID0+IHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImNvbXBsZXRlXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBlcmZvcm1RdWlja1Jlc2NhbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJsb2FkXCIsXG4gICAgICAgICAgICAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBlcmZvcm1RdWlja1Jlc2NhbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgICk7XG5cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgIFwibG9hZFwiLFxuICAgICAgICAgICAgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEhUTUxTY3JpcHRFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGVyZm9ybVF1aWNrUmVzY2FuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRydWVcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcGVyZm9ybVF1aWNrUmVzY2FuKCk6IHZvaWQge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEZvcm1zID0gdGhpcy5mb3JtRGV0ZWN0b3IuZ2V0Q3VycmVudEZvcm1zKCk7XG5cbiAgICAgICAgICAgIGN1cnJlbnRGb3Jtcy5mb3JFYWNoKChmb3JtKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzRm9ybShmb3JtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiUXVpY2sgcmVzY2FuXCIsIGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3RhcnRGb3JtRGV0ZWN0aW9uKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5zZXJ2aWNlV29ya2VyUmVhZHkpIHtcbiAgICAgICAgICAgIC8vIFN0YXJ0IGZvcm0gZGV0ZWN0aW9uIHdoZW4gc2VydmljZSB3b3JrZXIgaXMgcmVhZHlcbiAgICAgICAgICAgIHRoaXMuZm9ybURldGVjdG9yLnN0YXJ0RGV0ZWN0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0UGVyaW9kaWNSZXNjYW4oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc3RhcnRQZXJpb2RpY1Jlc2NhbigpOiB2b2lkIHtcbiAgICAgICAgLy8gQ2xlYXIgYW55IGV4aXN0aW5nIGludGVydmFsXG4gICAgICAgIGlmICh0aGlzLnJlc2NhbkludGVydmFsKSBjbGVhckludGVydmFsKHRoaXMucmVzY2FuSW50ZXJ2YWwpO1xuXG4gICAgICAgIC8vIFJlc2NhbiBldmVyeSA1IHNlY29uZHMgdG8gY2F0Y2ggZHluYW1pY2FsbHkgYWRkZWQgZm9ybXMgKHJlZHVjZWQgZnJlcXVlbmN5KVxuICAgICAgICB0aGlzLnJlc2NhbkludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wZXJmb3JtUmVzY2FuKCk7XG4gICAgICAgIH0sIDUwMDApO1xuXG4gICAgICAgIC8vIFJlcG9zaXRpb24gaWNvbnMgZXZlcnkgMTAgc2Vjb25kcyB0byBoYW5kbGUgbGF5b3V0IGNoYW5nZXMgKHJlZHVjZWQgZnJlcXVlbmN5KVxuICAgICAgICBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVpT3ZlcmxheS5yZXBvc2l0aW9uQWxsSWNvbnMoKTtcbiAgICAgICAgfSwgMTAwMDApO1xuICAgIH1cblxuICAgIHByaXZhdGUgcGVyZm9ybVJlc2NhbigpOiB2b2lkIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRGb3JtcyA9IHRoaXMuZm9ybURldGVjdG9yLmdldEN1cnJlbnRGb3JtcygpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEZvcm1Db3VudCA9IGN1cnJlbnRGb3Jtcy5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50SWNvbkNvdW50ID0gdGhpcy51aU92ZXJsYXkuZ2V0SWNvbkNvdW50KCk7XG5cbiAgICAgICAgICAgIGlmIChjdXJyZW50Rm9ybUNvdW50ICE9PSB0aGlzLmxhc3RGb3JtQ291bnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RGb3JtQ291bnQgPSBjdXJyZW50Rm9ybUNvdW50O1xuXG4gICAgICAgICAgICAgICAgY3VycmVudEZvcm1zLmZvckVhY2goKGZvcm0pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzRm9ybShmb3JtKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUV4aXN0aW5nSWNvbnMoKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlSWNvblJlY292ZXJ5KGN1cnJlbnRGb3JtcywgY3VycmVudEZvcm1Db3VudCwgY3VycmVudEljb25Db3VudCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJQZXJpb2RpYyByZXNjYW5cIiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZUV4aXN0aW5nSWNvbnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudWlPdmVybGF5LnZhbGlkYXRlSWNvbnMoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZUZvcm1zRGV0ZWN0ZWQoZXZlbnQ6IEN1c3RvbUV2ZW50KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGZvcm1zOiBEZXRlY3RlZEZvcm1bXSA9IGV2ZW50LmRldGFpbC5mb3JtcztcblxuICAgICAgICBmb3Jtcy5mb3JFYWNoKChmb3JtKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NGb3JtKGZvcm0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHByb2Nlc3NGb3JtKGZvcm06IERldGVjdGVkRm9ybSk6IHZvaWQge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgdmFsaWRhdGlvbiA9IHRoaXMuYXV0b2ZpbGxFbmdpbmUudmFsaWRhdGVGb3JtKGZvcm0pO1xuXG4gICAgICAgICAgICBpZiAoIXZhbGlkYXRpb24uaXNWYWxpZCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9ybS5maWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zaG91bGRTaG93SWNvbkZvckZpZWxkKGZpZWxkKSkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51aU92ZXJsYXkuc2hvd0ljb25Gb3JGaWVsZChmaWVsZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBMb2dnZXIuZXJyb3IoYEljb24gZGlzcGxheSBmb3IgJHtmaWVsZC50eXBlfSBmaWVsZGAsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBSZXBvc2l0aW9uIGFsbCBpY29ucyBhZnRlciBwcm9jZXNzaW5nIHRvIGhhbmRsZSBsYXlvdXQgY2hhbmdlc1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy51aU92ZXJsYXkucmVwb3NpdGlvbkFsbEljb25zKCk7XG4gICAgICAgICAgICB9LCAxMDApO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKGBGb3JtIHByb2Nlc3NpbmcgZm9yICR7Zm9ybS5maWVsZHMubGVuZ3RofSBmaWVsZHNgLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNob3VsZFNob3dJY29uRm9yRmllbGQoZmllbGQ6IEZvcm1GaWVsZCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gW1wicGFzc3dvcmRcIiwgXCJ1c2VybmFtZVwiLCBcImVtYWlsXCIsIFwicGhvbmVcIl0uaW5jbHVkZXMoZmllbGQudHlwZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVJY29uUmVjb3ZlcnkoY3VycmVudEZvcm1zOiBEZXRlY3RlZEZvcm1bXSwgY3VycmVudEZvcm1Db3VudDogbnVtYmVyLCBjdXJyZW50SWNvbkNvdW50OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKGN1cnJlbnRGb3JtQ291bnQgPiAwICYmIGN1cnJlbnRJY29uQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgIGN1cnJlbnRGb3Jtcy5mb3JFYWNoKChmb3JtKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzRm9ybShmb3JtKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXhwZWN0ZWRJY29ucyA9IGN1cnJlbnRGb3Jtcy5yZWR1Y2UoKGNvdW50LCBmb3JtKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY291bnQgKyBmb3JtLmZpZWxkcy5maWx0ZXIoKGZpZWxkKSA9PiB0aGlzLnNob3VsZFNob3dJY29uRm9yRmllbGQoZmllbGQpKS5sZW5ndGg7XG4gICAgICAgIH0sIDApO1xuXG4gICAgICAgIGlmIChleHBlY3RlZEljb25zID4gY3VycmVudEljb25Db3VudCAmJiBjdXJyZW50Rm9ybUNvdW50ID4gMCkge1xuICAgICAgICAgICAgY3VycmVudEZvcm1zLmZvckVhY2goKGZvcm0pID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NGb3JtKGZvcm0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZVdpbmRvd1Jlc2l6ZSgpOiB2b2lkIHtcbiAgICAgICAgLy8gRGVib3VuY2UgdGhlIHJlc2l6ZSBoYW5kbGVyXG4gICAgICAgIGlmICh0aGlzLnJlc2l6ZVRpbWVvdXQpIGNsZWFyVGltZW91dCh0aGlzLnJlc2l6ZVRpbWVvdXQpO1xuICAgICAgICB0aGlzLnJlc2l6ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudWlPdmVybGF5LnVwZGF0ZUljb25Qb3NpdGlvbnMoKTtcbiAgICAgICAgfSwgMTAwKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZVdpbmRvd1Njcm9sbCgpOiB2b2lkIHtcbiAgICAgICAgLy8gRGVib3VuY2UgdGhlIHNjcm9sbCBoYW5kbGVyXG4gICAgICAgIGlmICh0aGlzLnNjcm9sbFRpbWVvdXQpIGNsZWFyVGltZW91dCh0aGlzLnNjcm9sbFRpbWVvdXQpO1xuICAgICAgICB0aGlzLnNjcm9sbFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudWlPdmVybGF5LnVwZGF0ZUljb25Qb3NpdGlvbnMoKTtcbiAgICAgICAgfSwgNTApO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlVmlzaWJpbGl0eUNoYW5nZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmhpZGRlbikge1xuICAgICAgICAgICAgLy8gUGFnZSBpcyBoaWRkZW4sIGhpZGUgYWxsIGljb25zXG4gICAgICAgICAgICB0aGlzLnVpT3ZlcmxheS5oaWRlQWxsSWNvbnMoKTtcbiAgICAgICAgICAgIC8vIFN0b3AgZm9ybSBkZXRlY3Rpb25cbiAgICAgICAgICAgIHRoaXMuZm9ybURldGVjdG9yLnN0b3BEZXRlY3Rpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFBhZ2UgaXMgdmlzaWJsZSBhZ2FpblxuICAgICAgICAgICAgLy8gUmVzZXQgZm9ybSBjb3VudCB0byBmb3JjZSByZXByb2Nlc3NpbmdcbiAgICAgICAgICAgIHRoaXMubGFzdEZvcm1Db3VudCA9IDA7XG4gICAgICAgICAgICAvLyBTdGFydCBmb3JtIGRldGVjdGlvbiBhZ2FpblxuICAgICAgICAgICAgdGhpcy5mb3JtRGV0ZWN0b3Iuc3RhcnREZXRlY3Rpb24oKTtcbiAgICAgICAgICAgIC8vIEZvcmNlIGEgZnJlc2ggZm9ybSBkZXRlY3Rpb24gaW1tZWRpYXRlbHlcbiAgICAgICAgICAgIHRoaXMuZm9ybURldGVjdG9yLnNjYW5Gb3JGb3JtcygpO1xuICAgICAgICAgICAgLy8gUHJvY2VzcyBhbnkgbmV3bHkgZGV0ZWN0ZWQgZm9ybXMgaW1tZWRpYXRlbHlcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucGVyZm9ybVF1aWNrUmVzY2FuKCk7XG4gICAgICAgICAgICAgICAgdGhpcy51aU92ZXJsYXkucmVwb3NpdGlvbkFsbEljb25zKCk7XG4gICAgICAgICAgICB9LCAxMCk7IC8vIFZlcnkgc2hvcnQgZGVsYXkgdG8gZW5zdXJlIGZvcm1zIGFyZSBwcm9jZXNzZWRcbiAgICAgICAgICAgIC8vIFNjaGVkdWxlIGFkZGl0aW9uYWwgc2NhbnMgdG8gY2F0Y2ggYW55IGR5bmFtaWMgY29udGVudFxuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZURlbGF5ZWRTY2FucygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVQYWdlU2hvdygpOiB2b2lkIHtcbiAgICAgICAgLy8gUmVzZXQgZm9ybSBjb3VudCB0byBmb3JjZSByZXByb2Nlc3NpbmdcbiAgICAgICAgdGhpcy5sYXN0Rm9ybUNvdW50ID0gMDtcbiAgICAgICAgLy8gU3RhcnQgZm9ybSBkZXRlY3Rpb24gYWdhaW5cbiAgICAgICAgdGhpcy5mb3JtRGV0ZWN0b3Iuc3RhcnREZXRlY3Rpb24oKTtcbiAgICAgICAgLy8gRm9yY2UgYSBmcmVzaCBmb3JtIGRldGVjdGlvbiBpbW1lZGlhdGVseVxuICAgICAgICB0aGlzLmZvcm1EZXRlY3Rvci5zY2FuRm9yRm9ybXMoKTtcbiAgICAgICAgLy8gUHJvY2VzcyBhbnkgbmV3bHkgZGV0ZWN0ZWQgZm9ybXMgaW1tZWRpYXRlbHlcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBlcmZvcm1RdWlja1Jlc2NhbigpO1xuICAgICAgICAgICAgdGhpcy51aU92ZXJsYXkucmVwb3NpdGlvbkFsbEljb25zKCk7XG4gICAgICAgIH0sIDEwKTsgLy8gVmVyeSBzaG9ydCBkZWxheSB0byBlbnN1cmUgZm9ybXMgYXJlIHByb2Nlc3NlZFxuICAgICAgICAvLyBTY2hlZHVsZSBhZGRpdGlvbmFsIHNjYW5zIHRvIGNhdGNoIGFueSBkeW5hbWljIGNvbnRlbnRcbiAgICAgICAgdGhpcy5zY2hlZHVsZURlbGF5ZWRTY2FucygpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBTY3JvbGxUaHJvdHRsaW5nKCk6IHZvaWQge1xuICAgICAgICBsZXQgc2Nyb2xsVGltZW91dDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgICAgICAgLy8gTGlzdGVuIHRvIHNjcm9sbCBvbiB3aW5kb3cgKGZvciBib2R5IHNjcm9sbClcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICBcInNjcm9sbFwiLFxuICAgICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzY3JvbGxUaW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChzY3JvbGxUaW1lb3V0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBUaHJvdHRsZSBzY3JvbGwgZXZlbnRzIHRvIHVwZGF0ZSBpY29uIHBvc2l0aW9ucyBldmVyeSAyMDBtc1xuICAgICAgICAgICAgICAgIHNjcm9sbFRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudWlPdmVybGF5LnJlcG9zaXRpb25BbGxJY29ucygpO1xuICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgeyBwYXNzaXZlOiB0cnVlIH1cbiAgICAgICAgKTtcblxuICAgICAgICAvLyBBbHNvIGxpc3RlbiB0byBzY3JvbGwgb24gZG9jdW1lbnQgZm9yIGJldHRlciBjb3ZlcmFnZVxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJzY3JvbGxcIixcbiAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsVGltZW91dCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoc2Nyb2xsVGltZW91dCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2Nyb2xsVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51aU92ZXJsYXkucmVwb3NpdGlvbkFsbEljb25zKCk7XG4gICAgICAgICAgICAgICAgfSwgMjAwKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7IHBhc3NpdmU6IHRydWUgfVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIExpc3RlbiBmb3Igc2Nyb2xsIG9uIGFueSBzY3JvbGxhYmxlIGNvbnRhaW5lclxuICAgICAgICB0aGlzLnNldHVwQ29udGFpbmVyU2Nyb2xsTGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cENvbnRhaW5lclNjcm9sbExpc3RlbmVycygpOiB2b2lkIHtcbiAgICAgICAgLy8gRmluZCBhbGwgc2Nyb2xsYWJsZSBjb250YWluZXJzIGFuZCBhZGQgc2Nyb2xsIGxpc3RlbmVyc1xuICAgICAgICBjb25zdCBzY3JvbGxhYmxlU2VsZWN0b3JzID0gW1xuICAgICAgICAgICAgJ1tzdHlsZSo9XCJvdmVyZmxvd1wiXScsXG4gICAgICAgICAgICAnW3N0eWxlKj1cIm92ZXJmbG93LXlcIl0nLFxuICAgICAgICAgICAgJ1tzdHlsZSo9XCJvdmVyZmxvdy14XCJdJyxcbiAgICAgICAgICAgIFwiLnNjcm9sbGFibGVcIixcbiAgICAgICAgICAgIFwiLnNjcm9sbC1jb250YWluZXJcIixcbiAgICAgICAgICAgIFwiW2RhdGEtc2Nyb2xsXVwiLFxuICAgICAgICBdO1xuXG4gICAgICAgIGNvbnN0IGFkZFNjcm9sbExpc3RlbmVyID0gKGVsZW1lbnQ6IEVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICBcInNjcm9sbFwiLFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gT25seSByZXBvc2l0aW9uIGlmIGljb25zIGFyZSB2aXNpYmxlIGluIHRoaXMgY29udGFpbmVyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnVpT3ZlcmxheS5oYXNJY29uc0luQ29udGFpbmVyKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVpT3ZlcmxheS5yZXBvc2l0aW9uQWxsSWNvbnMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgeyBwYXNzaXZlOiB0cnVlIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gQWRkIGxpc3RlbmVycyB0byBleGlzdGluZyBzY3JvbGxhYmxlIGVsZW1lbnRzXG4gICAgICAgIHNjcm9sbGFibGVTZWxlY3RvcnMuZm9yRWFjaCgoc2VsZWN0b3IpID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpLmZvckVhY2goYWRkU2Nyb2xsTGlzdGVuZXIpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBXYXRjaCBmb3IgbmV3IHNjcm9sbGFibGUgZWxlbWVudHNcbiAgICAgICAgdGhpcy5jb250YWluZXJTY3JvbGxPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcbiAgICAgICAgICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIG11dGF0aW9uLmFkZGVkTm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gTm9kZS5FTEVNRU5UX05PREUpIHJldHVybjtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gbm9kZSBhcyBFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbGFibGVTZWxlY3RvcnMuZm9yRWFjaCgoc2VsZWN0b3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZWxlbWVudC5tYXRjaGVzKHNlbGVjdG9yKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBhZGRTY3JvbGxMaXN0ZW5lcihlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsYWJsZUVsZW1lbnRzLmFkZChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsYWJsZVNlbGVjdG9ycy5mb3JFYWNoKChzZWxlY3RvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKS5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFNjcm9sbExpc3RlbmVyKGNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbGFibGVFbGVtZW50cy5hZGQoY2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuY29udGFpbmVyU2Nyb2xsT2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XG4gICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGludGVyY2VwdEhpc3RvcnlBUEkoKTogdm9pZCB7XG4gICAgICAgIC8vIEludGVyY2VwdCBwdXNoU3RhdGUgYW5kIHJlcGxhY2VTdGF0ZSBtZXRob2RzXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsUHVzaFN0YXRlID0gaGlzdG9yeS5wdXNoU3RhdGU7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsUmVwbGFjZVN0YXRlID0gaGlzdG9yeS5yZXBsYWNlU3RhdGU7XG5cbiAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUgPSAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgb3JpZ2luYWxQdXNoU3RhdGUuYXBwbHkoaGlzdG9yeSwgYXJncyk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUxvY2F0aW9uQ2hhbmdlKCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaGlzdG9yeS5yZXBsYWNlU3RhdGUgPSAoLi4uYXJncykgPT4ge1xuICAgICAgICAgICAgb3JpZ2luYWxSZXBsYWNlU3RhdGUuYXBwbHkoaGlzdG9yeSwgYXJncyk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUxvY2F0aW9uQ2hhbmdlKCk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGFydFVybE1vbml0b3JpbmcoKTogdm9pZCB7XG4gICAgICAgIHRoaXMudXJsQ2hlY2tJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgICAgIGlmIChjdXJyZW50VXJsICE9PSB0aGlzLmxhc3RVcmwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RVcmwgPSBjdXJyZW50VXJsO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlTG9jYXRpb25DaGFuZ2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMTAwMCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzdGFydFNlcnZpY2VXb3JrZXJNb25pdG9yaW5nKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnNlcnZpY2VXb3JrZXJDaGVja0ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VydmljZVdvcmtlclJlYWR5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhclNlcnZpY2VXb3JrZXJJbnRlcnZhbCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgaGFzRm9ybXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPVwicGFzc3dvcmRcIl0sIGlucHV0W3R5cGU9XCJlbWFpbFwiXSwgaW5wdXRbdHlwZT1cInRleHRcIl0nKS5sZW5ndGggPiAwO1xuICAgICAgICAgICAgaWYgKGhhc0Zvcm1zKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXJ2aWNlV29ya2VyUmVhZHkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRGb3JtRGV0ZWN0aW9uKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhclNlcnZpY2VXb3JrZXJJbnRlcnZhbCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCA1MDApO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnNlcnZpY2VXb3JrZXJSZWFkeSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VydmljZVdvcmtlclJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0Rm9ybURldGVjdGlvbigpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJTZXJ2aWNlV29ya2VySW50ZXJ2YWwoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgNTAwMCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVMb2NhdGlvbkNoYW5nZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy51aU92ZXJsYXkuaGlkZUFsbEljb25zKCk7XG4gICAgICAgIHRoaXMubGFzdEZvcm1Db3VudCA9IDA7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBlcmZvcm1RdWlja1Jlc2NhbigpO1xuICAgICAgICB9LCA1MDApO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wZXJmb3JtUXVpY2tSZXNjYW4oKTtcbiAgICAgICAgfSwgMTUwMCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNpemVUaW1lb3V0OiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PiB8IG51bGwgPSBudWxsO1xuICAgIHByaXZhdGUgc2Nyb2xsVGltZW91dDogUmV0dXJuVHlwZTx0eXBlb2Ygc2V0VGltZW91dD4gfCBudWxsID0gbnVsbDtcbiAgICBwcml2YXRlIGNvbnRhaW5lclNjcm9sbE9ic2VydmVyOiBNdXRhdGlvbk9ic2VydmVyIHwgbnVsbCA9IG51bGw7XG4gICAgcHJpdmF0ZSBzY3JvbGxhYmxlRWxlbWVudHM6IFNldDxFbGVtZW50PiA9IG5ldyBTZXQoKTtcblxuICAgIHByaXZhdGUgY2xlYXJTZXJ2aWNlV29ya2VySW50ZXJ2YWwoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnNlcnZpY2VXb3JrZXJDaGVja0ludGVydmFsKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuc2VydmljZVdvcmtlckNoZWNrSW50ZXJ2YWwpO1xuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlV29ya2VyQ2hlY2tJbnRlcnZhbCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNjaGVkdWxlRGVsYXllZFNjYW5zKCk6IHZvaWQge1xuICAgICAgICAvLyBTY2hlZHVsZSBtdWx0aXBsZSBkZWxheWVkIHNjYW5zIGZvciBkeW5hbWljIGNvbnRlbnRcbiAgICAgICAgY29uc3QgZGVsYXlzID0gWzEwMCwgNTAwLCAxMDAwLCAyMDAwLCAzMDAwLCA1MDAwXTtcblxuICAgICAgICBkZWxheXMuZm9yRWFjaCgoZGVsYXksIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnBlcmZvcm1RdWlja1Jlc2NhbigpO1xuICAgICAgICAgICAgfSwgZGVsYXkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldHVwTmV0d29ya0lkbGVEZXRlY3Rpb24oKTogdm9pZCB7XG4gICAgICAgIC8vIE1vbml0b3IgZmV0Y2ggcmVxdWVzdHNcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxGZXRjaCA9IHdpbmRvdy5mZXRjaDtcbiAgICAgICAgd2luZG93LmZldGNoID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RJZCA9IHRoaXMuZ2VuZXJhdGVSZXF1ZXN0SWQoKTtcbiAgICAgICAgICAgIHRoaXMucGVuZGluZ1JlcXVlc3RzLmFkZChyZXF1ZXN0SWQpO1xuICAgICAgICAgICAgdGhpcy5yZXNldE5ldHdvcmtJZGxlVGltZW91dCgpO1xuXG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGZXRjaC5hcHBseSh3aW5kb3csIGFyZ3MpLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ1JlcXVlc3RzLmRlbGV0ZShyZXF1ZXN0SWQpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzZXROZXR3b3JrSWRsZVRpbWVvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIE1vbml0b3IgWE1MSHR0cFJlcXVlc3RcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxYSFJPcGVuID0gWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLm9wZW47XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsWEhSU2VuZCA9IFhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5zZW5kO1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUub3BlbiA9IGZ1bmN0aW9uIChcbiAgICAgICAgICAgIG1ldGhvZDogc3RyaW5nLFxuICAgICAgICAgICAgdXJsOiBzdHJpbmcgfCBVUkwsXG4gICAgICAgICAgICBhc3luYzogYm9vbGVhbiA9IHRydWUsXG4gICAgICAgICAgICB1c2VybmFtZT86IHN0cmluZyB8IG51bGwsXG4gICAgICAgICAgICBwYXNzd29yZD86IHN0cmluZyB8IG51bGxcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAodGhpcyBhcyBhbnkpLl9yZXF1ZXN0SWQgPSBzZWxmLmdlbmVyYXRlUmVxdWVzdElkKCk7XG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxYSFJPcGVuLmNhbGwodGhpcywgbWV0aG9kLCB1cmwsIGFzeW5jLCB1c2VybmFtZSwgcGFzc3dvcmQpO1xuICAgICAgICB9O1xuXG4gICAgICAgIFhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5zZW5kID0gZnVuY3Rpb24gKGJvZHk/OiBYTUxIdHRwUmVxdWVzdEJvZHlJbml0IHwgbnVsbCkge1xuICAgICAgICAgICAgaWYgKCh0aGlzIGFzIGFueSkuX3JlcXVlc3RJZCkge1xuICAgICAgICAgICAgICAgIHNlbGYucGVuZGluZ1JlcXVlc3RzLmFkZCgodGhpcyBhcyBhbnkpLl9yZXF1ZXN0SWQpO1xuICAgICAgICAgICAgICAgIHNlbGYucmVzZXROZXR3b3JrSWRsZVRpbWVvdXQoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRlbmRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnBlbmRpbmdSZXF1ZXN0cy5kZWxldGUoKHRoaXMgYXMgYW55KS5fcmVxdWVzdElkKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZXNldE5ldHdvcmtJZGxlVGltZW91dCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsWEhSU2VuZC5jYWxsKHRoaXMsIGJvZHkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIE1vbml0b3IgaW1hZ2UgbG9hZHMgKGNvbW1vbiBmb3IgZHluYW1pYyBjb250ZW50KVxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgXCJsb2FkXCIsXG4gICAgICAgICAgICAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0IGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0SWQgPSB0aGlzLmdlbmVyYXRlUmVxdWVzdElkKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ1JlcXVlc3RzLmFkZChyZXF1ZXN0SWQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlc2V0TmV0d29ya0lkbGVUaW1lb3V0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ1JlcXVlc3RzLmRlbGV0ZShyZXF1ZXN0SWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNldE5ldHdvcmtJZGxlVGltZW91dCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ1JlcXVlc3RzLmRlbGV0ZShyZXF1ZXN0SWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXNldE5ldHdvcmtJZGxlVGltZW91dCgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdHJ1ZVxuICAgICAgICApO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2VuZXJhdGVSZXF1ZXN0SWQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGByZXFfJHtEYXRlLm5vdygpfV8ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cigyLCA5KX1gO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVzZXROZXR3b3JrSWRsZVRpbWVvdXQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm5ldHdvcmtJZGxlVGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMubmV0d29ya0lkbGVUaW1lb3V0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnBlbmRpbmdSZXF1ZXN0cy5zaXplID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLm5ldHdvcmtJZGxlVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucGVyZm9ybVF1aWNrUmVzY2FuKCk7XG4gICAgICAgICAgICB9LCB0aGlzLm5ldHdvcmtJZGxlRGVsYXkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cEV2ZW50TGlzdGVuZXJzKCk6IHZvaWQge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInplbGZrZXk6Zm9ybXNEZXRlY3RlZFwiLCB0aGlzLmhhbmRsZUZvcm1zRGV0ZWN0ZWQuYmluZCh0aGlzKSBhcyBFdmVudExpc3RlbmVyKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy5oYW5kbGVXaW5kb3dSZXNpemUuYmluZCh0aGlzKSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMuaGFuZGxlV2luZG93U2Nyb2xsLmJpbmQodGhpcykpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLCB0aGlzLmhhbmRsZVZpc2liaWxpdHlDaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIiwgdGhpcy5oYW5kbGVMb2NhdGlvbkNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlc2hvd1wiLCB0aGlzLmhhbmRsZVBhZ2VTaG93LmJpbmQodGhpcykpO1xuXG4gICAgICAgIC8vIEFkZCB0aHJvdHRsZWQgc2Nyb2xsIGhhbmRsaW5nIGZvciBpY29uIHJlcG9zaXRpb25pbmdcbiAgICAgICAgdGhpcy5zZXR1cFNjcm9sbFRocm90dGxpbmcoKTtcblxuICAgICAgICAvLyBMaXN0ZW4gZm9yIGV4dGVuc2lvbiBvcGVuIHJlcXVlc3RzIGZyb20gdGhlIHBhZ2VcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmRhdGEgJiYgZXZlbnQuZGF0YS50eXBlID09PSBcIk9QRU5fWkVMRl9FWFRFTlNJT05cIikge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tbXVuaWNhdGlvblNlcnZpY2Uuc2VuZE1lc3NhZ2UoeyB0eXBlOiBcIk9QRU5fRVhURU5TSU9OXCIgYXMgYW55IH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldHVwQ29tbXVuaWNhdGlvbigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jb21tdW5pY2F0aW9uU2VydmljZS5zZXR1cE1lc3NhZ2VMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLmNvbW11bmljYXRpb25TZXJ2aWNlLm9uU2VydmljZVdvcmtlclJlYWR5KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VydmljZVdvcmtlclJlYWR5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRGb3JtRGV0ZWN0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBNb25pdG9yaW5nKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmludGVyY2VwdEhpc3RvcnlBUEkoKTtcbiAgICAgICAgdGhpcy5zdGFydFVybE1vbml0b3JpbmcoKTtcbiAgICAgICAgdGhpcy5zdGFydFNlcnZpY2VXb3JrZXJNb25pdG9yaW5nKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZm9ybURldGVjdG9yLnN0b3BEZXRlY3Rpb24oKTtcbiAgICAgICAgdGhpcy51aU92ZXJsYXkuaGlkZUFsbEljb25zKCk7XG4gICAgICAgIHRoaXMucGFzc3dvcmRNYW5hZ2VyLmNsZWFyQ2FjaGUoKTtcblxuICAgICAgICAvLyBDbGVhciByZXNjYW4gaW50ZXJ2YWxcbiAgICAgICAgaWYgKHRoaXMucmVzY2FuSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5yZXNjYW5JbnRlcnZhbCk7XG4gICAgICAgICAgICB0aGlzLnJlc2NhbkludGVydmFsID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENsZWFyIFVSTCBtb25pdG9yaW5nIGludGVydmFsXG4gICAgICAgIGlmICh0aGlzLnVybENoZWNrSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy51cmxDaGVja0ludGVydmFsKTtcbiAgICAgICAgICAgIHRoaXMudXJsQ2hlY2tJbnRlcnZhbCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDbGVhciBzZXJ2aWNlIHdvcmtlciBtb25pdG9yaW5nIGludGVydmFsXG4gICAgICAgIGlmICh0aGlzLnNlcnZpY2VXb3JrZXJDaGVja0ludGVydmFsKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuc2VydmljZVdvcmtlckNoZWNrSW50ZXJ2YWwpO1xuICAgICAgICAgICAgdGhpcy5zZXJ2aWNlV29ya2VyQ2hlY2tJbnRlcnZhbCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDbGVhciBuZXR3b3JrIGlkbGUgdGltZW91dFxuICAgICAgICBpZiAodGhpcy5uZXR3b3JrSWRsZVRpbWVvdXQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLm5ldHdvcmtJZGxlVGltZW91dCk7XG4gICAgICAgICAgICB0aGlzLm5ldHdvcmtJZGxlVGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDbGVhciBwZW5kaW5nIHJlcXVlc3RzXG4gICAgICAgIHRoaXMucGVuZGluZ1JlcXVlc3RzLmNsZWFyKCk7XG5cbiAgICAgICAgLy8gQ2xlYXIgdGltZW91dHNcbiAgICAgICAgaWYgKHRoaXMucmVzaXplVGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVzaXplVGltZW91dCk7XG4gICAgICAgICAgICB0aGlzLnJlc2l6ZVRpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnNjcm9sbFRpbWVvdXQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnNjcm9sbFRpbWVvdXQpO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxUaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENsZWFyIGNvbnRhaW5lciBzY3JvbGwgb2JzZXJ2ZXJcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyU2Nyb2xsT2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyU2Nyb2xsT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJTY3JvbGxPYnNlcnZlciA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZW1vdmUgc2Nyb2xsIGxpc3RlbmVycyBmcm9tIHRyYWNrZWQgZWxlbWVudHNcbiAgICAgICAgdGhpcy5zY3JvbGxhYmxlRWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgZWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsICgpID0+IHt9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2Nyb2xsYWJsZUVsZW1lbnRzLmNsZWFyKCk7XG5cbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ6ZWxma2V5OmZvcm1zRGV0ZWN0ZWRcIiwgdGhpcy5oYW5kbGVGb3Jtc0RldGVjdGVkLmJpbmQodGhpcykgYXMgRXZlbnRMaXN0ZW5lcik7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMuaGFuZGxlV2luZG93UmVzaXplLmJpbmQodGhpcykpO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLCB0aGlzLmhhbmRsZVdpbmRvd1Njcm9sbC5iaW5kKHRoaXMpKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInZpc2liaWxpdHljaGFuZ2VcIiwgdGhpcy5oYW5kbGVWaXNpYmlsaXR5Q2hhbmdlLmJpbmQodGhpcykpO1xuICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvcHN0YXRlXCIsIHRoaXMuaGFuZGxlTG9jYXRpb25DaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicGFnZXNob3dcIiwgdGhpcy5oYW5kbGVQYWdlU2hvdy5iaW5kKHRoaXMpKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIHRoaXMucGVyZm9ybVF1aWNrUmVzY2FuLmJpbmQodGhpcykpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCB0aGlzLnBlcmZvcm1RdWlja1Jlc2Nhbi5iaW5kKHRoaXMpKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlYWR5c3RhdGVjaGFuZ2VcIiwgdGhpcy5wZXJmb3JtUXVpY2tSZXNjYW4uYmluZCh0aGlzKSk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIHRoaXMucGVyZm9ybVF1aWNrUmVzY2FuLmJpbmQodGhpcykpO1xuXG4gICAgICAgIHRoaXMuaXNJbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIH1cbn1cblxuLy8gSW5pdGlhbGl6ZSB0aGUgYXV0b2ZpbGwgd2hlbiB0aGUgc2NyaXB0IGxvYWRzXG5jb25zdCBhdXRvZmlsbCA9IG5ldyBBdXRvZmlsbENvbnRlbnRTY3JpcHQoKTtcblxuLy8gSGFuZGxlIGRpZmZlcmVudCBwYWdlIGxvYWQgc3RhdGVzXG5mdW5jdGlvbiBpbml0aWFsaXplQXV0b2ZpbGwoKSB7XG4gICAgYXV0b2ZpbGwuaW5pdGlhbGl6ZSgpO1xufVxuXG4vLyBXYWl0IGZvciBET00gdG8gYmUgcmVhZHlcbmlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSBcImxvYWRpbmdcIikge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXRpYWxpemVBdXRvZmlsbCk7XG59IGVsc2UgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwiaW50ZXJhY3RpdmVcIikge1xuICAgIC8vIERPTSBpcyByZWFkeSBidXQgcmVzb3VyY2VzIG1pZ2h0IHN0aWxsIGJlIGxvYWRpbmdcbiAgICBpbml0aWFsaXplQXV0b2ZpbGwoKTtcbn0gZWxzZSB7XG4gICAgLy8gRE9NIGlzIGZ1bGx5IGxvYWRlZFxuICAgIGluaXRpYWxpemVBdXRvZmlsbCgpO1xufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xuICAgIC8vIE11bHRpcGxlIHNjYW5zIGZvciBkeW5hbWljIGNvbnRlbnRcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKGF1dG9maWxsKSB7XG4gICAgICAgICAgICBhdXRvZmlsbC5wZXJmb3JtUXVpY2tSZXNjYW4oKTtcbiAgICAgICAgfVxuICAgIH0sIDUwMCk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgaWYgKGF1dG9maWxsKSB7XG4gICAgICAgICAgICBhdXRvZmlsbC5wZXJmb3JtUXVpY2tSZXNjYW4oKTtcbiAgICAgICAgfVxuICAgIH0sIDIwMDApO1xuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmIChhdXRvZmlsbCkge1xuICAgICAgICAgICAgYXV0b2ZpbGwucGVyZm9ybVF1aWNrUmVzY2FuKCk7XG4gICAgICAgIH1cbiAgICB9LCA1MDAwKTtcbn0pO1xuXG4vLyBIYW5kbGUgcGFnZSB1bmxvYWRcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiYmVmb3JldW5sb2FkXCIsICgpID0+IHtcbiAgICBhdXRvZmlsbC5kZXN0cm95KCk7XG59KTtcblxuLy8gRXhwb3J0IGZvciBwb3RlbnRpYWwgZXh0ZXJuYWwgdXNlXG4od2luZG93IGFzIGFueSkuWmVsZktleUF1dG9maWxsID0gYXV0b2ZpbGw7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=