/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./background-scripts/services/background-credential-manager.ts"
/*!**********************************************************************!*\
  !*** ./background-scripts/services/background-credential-manager.ts ***!
  \**********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BackgroundCredentialManager: () => (/* binding */ BackgroundCredentialManager)
/* harmony export */ });
/* harmony import */ var _shared_types_tag_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shared/types/tag.types */ "./shared/types/tag.types.ts");
/* harmony import */ var _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../extension-scripts/logger/logger.class */ "./extension-scripts/logger/logger.class.ts");
/* harmony import */ var _extension_scripts_environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../extension-scripts/environments/environment */ "./extension-scripts/environments/environment.ts");



class BackgroundCredentialManager {
    static getInstance(browserApi) {
        if (!BackgroundCredentialManager.instance) {
            BackgroundCredentialManager.instance = new BackgroundCredentialManager(browserApi);
        }
        return BackgroundCredentialManager.instance;
    }
    constructor(browserApi) {
        this.browserApi = browserApi;
        this.API_BASE_URL = _extension_scripts_environments_environment__WEBPACK_IMPORTED_MODULE_2__.environment.apiBaseUrl;
        this.ZELF_KEYS_ROUTE = `/api/zelf-keys`;
        this._accessToken = null;
        this._accessTokenExpiry = null;
        this.loadAccessTokenFromStorage().catch((error) => {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__.Logger.error("Error loading JWT from storage in constructor:", error);
        });
    }
    /**
     * Load JWT from storage (replicating Angular service behavior)
     * Note: Uses accessTokenExpiresAt (Unix timestamp) to match AuthService
     */
    async loadAccessTokenFromStorage() {
        try {
            if (this.browserApi?.has("storage")) {
                const result = await this.browserApi.storage.local.get(["accessToken", "accessTokenExpiresAt", "accessTokenExpiry"]);
                // Support both naming conventions for backward compatibility
                this._accessToken = result.accessToken || null;
                const expiresAt = result.accessTokenExpiresAt || result.accessTokenExpiry || null;
                // Convert Unix timestamp to milliseconds if needed, or use as-is if already in milliseconds
                if (expiresAt) {
                    // If expiresAt is a Unix timestamp (seconds), convert to milliseconds
                    // Unix timestamps are typically 10 digits, milliseconds are 13 digits
                    this._accessTokenExpiry = expiresAt < 1e12 ? expiresAt * 1000 : expiresAt;
                }
                else {
                    this._accessTokenExpiry = null;
                }
                if (this.isTokenExpired()) {
                    this.clearExpiredToken();
                    await this.setAccessTokenToStorage();
                }
            }
            else {
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__.Logger.error("Storage API not available through BrowserApiUtil");
            }
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__.Logger.error("Error loading JWT from storage:", error);
        }
    }
    /**
     * Save JWT to storage (replicating Angular service behavior)
     * Note: Uses accessTokenExpiresAt (Unix timestamp) to match AuthService
     */
    async setAccessTokenToStorage() {
        try {
            if (this.browserApi?.has("storage")) {
                // Convert milliseconds to Unix timestamp (seconds) to match AuthService format
                const expiresAt = this._accessTokenExpiry ? Math.floor(this._accessTokenExpiry / 1000) : null;
                await this.browserApi.storage.local.set({
                    accessToken: this._accessToken,
                    accessTokenExpiresAt: expiresAt,
                });
            }
            else {
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__.Logger.error("Storage API not available through BrowserApiUtil");
            }
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__.Logger.error("Error saving JWT to storage:", error);
        }
    }
    async getAccessToken() {
        // Always refresh from storage first so the background picks up any token the
        // main app or popout may have just written (e.g. after reauthenticateSession).
        // Without this, the background's in-memory token can race ahead of storage and
        // cause JWT/identifier mismatches with the popout's PGP session key.
        await this.loadAccessTokenFromStorage();
        if (this.hasValidToken())
            return this._accessToken;
        const sessionResult = await this.initSession();
        return sessionResult?.data?.token || null;
    }
    clearAccessToken() {
        this._accessToken = null;
        this._accessTokenExpiry = null;
        this.setAccessTokenToStorage();
    }
    async isAuthenticated() {
        const accessToken = await this.getAccessToken();
        return !!accessToken;
    }
    isTokenExpired() {
        return !!(this._accessToken && this._accessTokenExpiry && Date.now() >= this._accessTokenExpiry);
    }
    hasValidToken() {
        return !!(this._accessToken && this._accessTokenExpiry && Date.now() < this._accessTokenExpiry);
    }
    clearExpiredToken() {
        this._accessToken = null;
        this._accessTokenExpiry = null;
    }
    filterPasswordsByWebsite(data, website) {
        if (!Array.isArray(data)) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__.Logger.warn("filterPasswordsByWebsite: data is not an array", data);
            return [];
        }
        return data
            .filter((password) => password.publicData?.type === "password" && this.matchesWebsite(password, website))
            .map((password) => this.mapPasswordItemToEntry(password));
    }
    matchesWebsite(password, website) {
        if (!website)
            return true;
        const targetDomain = website.replace(/^https?:\/\//, "").replace(/^www\./, "");
        const passwordWebsite = password.publicData?.website;
        if (!passwordWebsite)
            return false;
        try {
            const passwordDomain = new URL(passwordWebsite).hostname;
            return passwordDomain === targetDomain || passwordWebsite.includes(targetDomain) || passwordWebsite === targetDomain;
        }
        catch {
            return passwordWebsite.includes(targetDomain) || passwordWebsite === targetDomain;
        }
    }
    mapPasswordItemToEntry(item) {
        return {
            id: item.id,
            cid: item.cid,
            url: item.url,
            website: item.publicData?.website,
            username: item.publicData?.username,
            publicData: item.publicData,
            zelfProofQRCode: item.zelfProofQRCode,
            zelfProof: item.zelfProof,
            createdAt: item.createdAt,
        };
    }
    async initSession() {
        if (this.hasValidToken())
            return { data: { token: this._accessToken } };
        const { wallet } = await this.getAllWalletsFromStorage();
        if (!wallet?.publicData?.ethAddress) {
            throw new Error("No wallet found in storage - user needs to authenticate first");
        }
        const tagName = wallet.tagName || wallet.name || null;
        const domain = wallet.domain || "zelf";
        // Prefer the canonical session identifier persisted by the in-app AuthService
        // (a device-fingerprint hash). This keeps the JWT identifier aligned with the
        // PGP session key the popout uses to encrypt requests. Only fall back to the
        // wallet's full tag name if the main app has never booted yet — and warn so we
        // can catch ordering issues.
        let identifier = null;
        try {
            if (this.browserApi?.has("storage")) {
                const stored = await this.browserApi.storage.local.get(["sessionIdentifier"]);
                identifier = stored?.sessionIdentifier || null;
            }
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__.Logger.warn("Could not read sessionIdentifier from storage:", error);
        }
        if (!identifier) {
            identifier = wallet.fullTagName || wallet.publicData?.ethAddress || null;
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__.Logger.warn("BackgroundCredentialManager.initSession: sessionIdentifier missing in storage, falling back to wallet tag identifier", { fallbackIdentifier: identifier });
        }
        const url = `${this.API_BASE_URL}/api/sessions`;
        const payload = {
            address: wallet.publicData.ethAddress,
            identifier: identifier || wallet.publicData.ethAddress, // Fallback to ethAddress if no identifier
        };
        if (tagName)
            payload.tagName = tagName;
        if (domain)
            payload.domain = domain;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error(`Session initialization failed: ${response.status} ${response.statusText}`);
        }
        const responseData = await response.json();
        if (responseData?.data?.token) {
            // Handle both Unix timestamp (seconds) and milliseconds formats
            const expiresAt = responseData.data.expiresAt;
            if (expiresAt) {
                // If expiresAt is a Unix timestamp (seconds), convert to milliseconds
                this._accessTokenExpiry = expiresAt < 1e12 ? expiresAt * 1000 : expiresAt;
            }
            else {
                // Default to 24 hours if not provided
                this._accessTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
            }
            this._accessToken = responseData.data.token;
            await this.setAccessTokenToStorage();
        }
        return responseData;
    }
    /**
     * Get all wallets from storage (replicating getAllWalletsFromStorage from Angular service)
     * Matches the pattern from WalletService.getAllWalletsFromStorage()
     * Uses TagModel for consistent data structure
     */
    async getAllWalletsFromStorage() {
        try {
            if (!this.browserApi?.has("storage"))
                return { wallet: null, wallets: [] };
            const result = await this.browserApi.storage.local.get(["wallet", "wallets"]);
            // Convert raw data to TagModel instances
            const wallet = result.wallet ? new _shared_types_tag_types__WEBPACK_IMPORTED_MODULE_0__.TagModel(result.wallet) : null;
            const wallets = (result.wallets || []).map((w) => new _shared_types_tag_types__WEBPACK_IMPORTED_MODULE_0__.TagModel(w));
            // Check if wallet has valid publicData with ethAddress (matching WalletService pattern)
            if (!wallet?.publicData?.ethAddress && !wallet?.publicData?.tagName) {
                if (!wallets.length)
                    return { wallet, wallets: [] };
                // Set first wallet as current if no current wallet
                const firstWallet = wallets[0];
                await this.browserApi.storage.local.set({ wallet: firstWallet });
                return { wallet: firstWallet, wallets };
            }
            return { wallet, wallets };
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__.Logger.error("Error getting wallets from storage:", error);
            return { wallet: null, wallets: [] };
        }
    }
    async listStoredPasswords() {
        const accessToken = await this.getAccessToken();
        if (!accessToken)
            throw new Error("Unable to authenticate with ZelfKey API");
        return this.makeApiCall("GET", `${this.ZELF_KEYS_ROUTE}/list?category=password`);
    }
    async getPasswords(website) {
        try {
            const response = await this.listStoredPasswords();
            const data = response?.data?.data || [];
            return this.filterPasswordsByWebsite(data, website);
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__.Logger.error("Error getting passwords:", error);
            return [];
        }
    }
    /**
     * Make API call with authentication (replicating HttpWrapperService behavior)
     */
    async makeApiCall(method, endpoint, data) {
        const accessToken = await this.getAccessToken();
        if (!accessToken)
            throw new Error("No valid JWT token available");
        const url = `${this.API_BASE_URL}${endpoint}`;
        const options = {
            method,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        };
        if (data && (method === "POST" || method === "PUT")) {
            options.body = JSON.stringify(data);
        }
        const response = await fetch(url, options);
        if (!response.ok)
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        return await response.json();
    }
    /**
     * Store a new password
     */
    async storePassword(passwordData) {
        try {
            await this.initSession();
            const accessToken = await this.getAccessToken();
            if (!accessToken) {
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__.Logger.error("Failed to initialize session");
                return false;
            }
            const response = await this.makeApiCall("POST", `${this.ZELF_KEYS_ROUTE}/store/password`, passwordData);
            return !!response?.data;
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__.Logger.error("Error storing password:", error);
            return false;
        }
    }
}


/***/ },

/***/ "./background-scripts/services/browser-api-util.ts"
/*!*********************************************************!*\
  !*** ./background-scripts/services/browser-api-util.ts ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BrowserApiUtil: () => (/* binding */ BrowserApiUtil)
/* harmony export */ });
class BrowserApiUtil {
    constructor() {
        this._chrome = null;
        this._browser = null;
        this._isChrome = false;
        this._isBrowser = false;
        this.initializeApis();
    }
    initializeApis() {
        this.initializeChromeApi();
        this.initializeBrowserApi();
    }
    get(moduleName) {
        return this.getChromeModule(moduleName) || this.getBrowserModule(moduleName) || null;
    }
    // Check if a module exists
    has(moduleName) {
        return this.get(moduleName) !== null;
    }
    get runtime() {
        const runtime = this.get("runtime");
        if (!runtime)
            return null;
        return {
            ...runtime,
            sendMessage: (message, callback) => {
                return this.handleSendMessage(runtime, message, callback);
            },
        };
    }
    // Get storage API
    get storage() {
        return this.get("storage");
    }
    // Get tabs API
    get tabs() {
        return this.get("tabs");
    }
    // Get windows API
    get windows() {
        return this.get("windows");
    }
    // Get menus API
    get menus() {
        return this.get("menus");
    }
    // Get sidePanel (Chrome) or sidebarAction (Firefox) - these are different APIs
    get sidePanel() {
        if (this._isChrome) {
            return this._chrome?.sidePanel;
        }
        return null;
    }
    get sidebarAction() {
        if (this._isBrowser) {
            return this._browser?.sidebarAction;
        }
        return null;
    }
    // Get extension API (Firefox only)
    get extension() {
        if (this._isBrowser) {
            return this._browser?.extension;
        }
        return null;
    }
    // Get action API (Chrome) or browserAction (Firefox)
    get action() {
        if (this._isChrome) {
            return this._chrome?.action;
        }
        if (this._isBrowser) {
            return this._browser?.browserAction;
        }
        return null;
    }
    // Convenience getters
    get isExtension() {
        return this._isChrome || this._isBrowser;
    }
    get isChrome() {
        return this._isChrome;
    }
    get isBrowser() {
        return this._isBrowser;
    }
    // Smart sendMessage that handles both Chrome and Firefox
    sendMessage(message, callback) {
        const runtime = this.runtime;
        if (!runtime) {
            throw new Error("Runtime API not available");
        }
        if (this._isChrome) {
            // Chrome uses callback
            runtime.sendMessage(message, callback);
        }
        else if (this._isBrowser) {
            // Firefox returns Promise
            return runtime.sendMessage(message);
        }
    }
    // Smart addMessageListener
    addMessageListener(listener) {
        const runtime = this.get("runtime");
        if (runtime) {
            runtime.onMessage.addListener(listener);
        }
    }
    // Smart storage operations
    async getStorageItem(key) {
        const storage = this.storage;
        if (!storage?.local)
            return null;
        const result = await storage.local.get(key);
        return result[key];
    }
    async setStorageItem(key, value) {
        const storage = this.storage;
        if (!storage?.local)
            return;
        await storage.local.set({ [key]: value });
    }
    async getAllStorageItems() {
        const storage = this.storage;
        if (!storage?.local)
            return {};
        return await storage.local.get(null);
    }
    async removeStorageItems(keys) {
        const storage = this.storage;
        if (!storage?.local)
            return;
        await storage.local.remove(keys);
    }
    initializeChromeApi() {
        if (typeof chrome !== "undefined") {
            this._chrome = chrome;
            this._isChrome = true;
        }
    }
    initializeBrowserApi() {
        if (typeof browser !== "undefined") {
            this._browser = browser;
            this._isBrowser = true;
        }
    }
    getChromeModule(moduleName) {
        return this._isChrome && this._chrome?.[moduleName] ? this._chrome[moduleName] : null;
    }
    getBrowserModule(moduleName) {
        return this._isBrowser && this._browser?.[moduleName] ? this._browser[moduleName] : null;
    }
    handleSendMessage(runtime, message, callback) {
        if (this._isChrome) {
            runtime.sendMessage(message, callback);
        }
        else if (this._isBrowser) {
            return runtime.sendMessage(message);
        }
    }
}


/***/ },

/***/ "./background-scripts/services/dapp-handler.ts"
/*!*****************************************************!*\
  !*** ./background-scripts/services/dapp-handler.ts ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DappHandler: () => (/* binding */ DappHandler)
/* harmony export */ });
/* harmony import */ var _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @extension-scripts/logger/logger.class */ "./extension-scripts/logger/logger.class.ts");
/* harmony import */ var _extension_scripts_environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @extension-scripts/environments/environment */ "./extension-scripts/environments/environment.ts");
/* harmony import */ var _shared_types_dapp_types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @shared/types/dapp.types */ "./shared/types/dapp.types.ts");
/* harmony import */ var _shared_services_dapp_mapping_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @shared/services/dapp-mapping.service */ "./shared/services/dapp-mapping.service.ts");
/* harmony import */ var _shared_utils_evm_chain_key_util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @shared/utils/evm-chain-key.util */ "./shared/utils/evm-chain-key.util.ts");





// ─── Constants ────────────────────────────────────────────────────────────────
/** How long a pending dApp request lives before it auto-expires (5 minutes). */
const DAPP_REQUEST_TIMEOUT_MS = 5 * 60 * 1000;
/** chrome.storage.local key that holds all granted dApp permissions. */
const PERMISSIONS_STORAGE_KEY = "dapp_permissions";
/** Prefix used for per-request storage keys, allowing restore after service-worker restart. */
const PENDING_REQUEST_STORAGE_PREFIX = "pending_dapp_request_";
/** Total time budget for retrying a tab message (exponential backoff up to 60s). */
const TAB_MESSAGE_TIMEOUT_MS = 60 * 1000;
/** Starting delay for the exponential backoff when a tab message fails. */
const TAB_MESSAGE_INITIAL_DELAY_MS = 100;
/** Maximum delay between individual retry attempts (caps the exponential growth). */
const TAB_MESSAGE_MAX_DELAY_MS = 5000;
/** dApp RPC methods that are too expensive, stateful, or subscription-based for the lightweight proxy. */
const BLOCKED_DAPP_RPC_METHODS = new Set([
    "eth_subscribe",
    "eth_unsubscribe",
    "eth_newfilter",
    "eth_newblockfilter",
    "eth_newpendingtransactionfilter",
    "eth_getfilterchanges",
    "eth_getfilterlogs",
    "eth_getlogs",
]);
/** Prefixes for RPC namespaces that should never be exposed to arbitrary dApps. */
const BLOCKED_DAPP_RPC_PREFIXES = ["admin_", "debug_", "engine_", "miner_", "ots_", "personal_", "trace_", "txpool_"];
/** Read JWT from the same chrome.storage.local keys used by AuthService (extension UI). */
function readAccessTokenFromStorage() {
    return new Promise((resolve) => {
        try {
            chrome.storage.local.get(["accessToken", "accessTokenExpiresAt"], (items) => {
                if (chrome.runtime.lastError) {
                    resolve(null);
                    return;
                }
                const token = items?.accessToken;
                const exp = items?.accessTokenExpiresAt;
                if (!token || exp == null) {
                    resolve(null);
                    return;
                }
                if (exp <= Date.now() / 1000 + 5) {
                    resolve(null);
                    return;
                }
                resolve(token);
            });
        }
        catch {
            resolve(null);
        }
    });
}
// ─── Module-level RPC proxy helper ───────────────────────────────────────────
/**
 * Forwards a read-only JSON-RPC call directly to the configured chain RPC endpoint.
 * This avoids opening any UI — it is used for methods like eth_blockNumber, eth_getBalance, etc.
 *
 * @param payload  - The RPC payload (method, params, chainId in hex).
 * @param sendResponse - Chrome extension sendResponse callback.
 */
async function handleRpcProxy(payload, origin, sendResponse) {
    const { method, params = [], chainId: chainIdHex } = payload || {};
    const normalizedMethod = typeof method === "string" ? method.trim() : "";
    const chainId = chainIdHex ? (0,_shared_types_dapp_types__WEBPACK_IMPORTED_MODULE_2__.hexToChainId)(chainIdHex) : 1;
    const chainConfig = (0,_shared_types_dapp_types__WEBPACK_IMPORTED_MODULE_2__.getChainConfig)(chainId);
    const rpcUrl = chainConfig?.rpcUrl;
    if (!normalizedMethod) {
        sendResponse({
            success: false,
            error: { code: -32600, message: "Zelf Wallet: Missing RPC method." },
        });
        return;
    }
    const loweredMethod = normalizedMethod.toLowerCase();
    const isBlockedMethod = BLOCKED_DAPP_RPC_METHODS.has(loweredMethod) || BLOCKED_DAPP_RPC_PREFIXES.some((prefix) => loweredMethod.startsWith(prefix));
    if (isBlockedMethod) {
        _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn(`[DAPP_RPC_PROXY] Blocked ${normalizedMethod} for ${origin || "unknown-origin"} on chain ${chainId}`);
        sendResponse({
            success: false,
            error: { code: -32601, message: `Zelf Wallet: RPC method ${normalizedMethod} is not available through the dApp proxy.` },
        });
        return;
    }
    if (!rpcUrl) {
        sendResponse({
            success: false,
            error: { code: -32603, message: `Zelf Wallet: No RPC URL for chain ${chainId}. Read-only methods require a configured RPC.` },
        });
        return;
    }
    const jsonBody = JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: normalizedMethod,
        params: Array.isArray(params) ? params : [],
    });
    try {
        const chainKey = (0,_shared_utils_evm_chain_key_util__WEBPACK_IMPORTED_MODULE_4__.getChainKeyFromChainId)(chainId);
        const token = await readAccessTokenFromStorage();
        if (chainKey && token) {
            const base = _extension_scripts_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiBaseUrl.replace(/\/$/, "");
            const proxyUrl = `${base}/api/protected/rpc/${chainKey}`;
            try {
                const res = await fetch(proxyUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: jsonBody,
                });
                const json = await res.json();
                if (res.ok && json && json.result !== undefined && !json.error) {
                    sendResponse({ success: true, data: json.result });
                    return;
                }
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn(`[DAPP_RPC_PROXY] Protected proxy returned ${res.status}, falling back to direct RPC`);
            }
            catch (proxyErr) {
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn("[DAPP_RPC_PROXY] Protected proxy failed, falling back to direct RPC:", proxyErr?.message || proxyErr);
            }
        }
        const res = await fetch(rpcUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: jsonBody,
        });
        const json = await res.json();
        if (json.error) {
            sendResponse({
                success: false,
                error: { code: json.error.code ?? -32603, message: json.error.message || "RPC error" },
            });
            return;
        }
        sendResponse({ success: true, data: json.result });
    }
    catch (err) {
        _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("DAPP_RPC_PROXY error:", err);
        sendResponse({
            success: false,
            error: { code: -32603, message: err?.message || "RPC proxy failed" },
        });
    }
}
// ─── DappHandler class ────────────────────────────────────────────────────────
class DappHandler {
    /**
     * Returns the singleton DappHandler instance, creating it on first call.
     * Using a singleton ensures the in-memory pending-request state is shared
     * across all background message handlers.
     */
    static getInstance(browserApi) {
        if (!DappHandler.instance) {
            DappHandler.instance = new DappHandler(browserApi);
        }
        return DappHandler.instance;
    }
    // ── Constructor ────────────────────────────────────────────────────────────
    constructor(browserApi) {
        this.browserApi = browserApi;
        // ── In-memory state ────────────────────────────────────────────────────────
        /** All requests awaiting user approval (in-memory; also persisted to storage). */
        this.pendingRequests = new Map();
        /** setTimeout handles indexed by requestId — used to cancel timers on resolution. */
        this.timeoutHandles = new Map();
        /**
         * Per-origin coalescing queue for connection requests.
         * The first entry is the "leader" that opens the UI; subsequent ones piggyback
         * and receive the same approval/rejection result.
         */
        this.pendingConnectsByOrigin = new Map();
        /** Promise guard so _restorePendingRequests only runs once per service-worker lifecycle. */
        this.restorePendingRequestsPromise = null;
        /** Map of chrome window IDs to request IDs to detect closed popups. */
        this.approvalWindows = new Map();
        // Kick off storage restoration immediately so in-flight requests survive
        // service-worker restarts without needing a separate call.
        void this.restorePendingRequests();
        // Listen for popup window closure so we can immediately reject the request
        if (typeof chrome !== "undefined" && chrome.windows && chrome.windows.onRemoved) {
            chrome.windows.onRemoved.addListener((windowId) => {
                void this._handleWindowClosed(windowId);
            });
        }
    }
    /**
     * Handles cases where the user closes the popup window without taking any action.
     * Fires a rejection back to the dApp and clears the pending coalesced requests.
     */
    async _handleWindowClosed(windowId) {
        const requestId = this.approvalWindows.get(windowId);
        if (!requestId)
            return;
        this.approvalWindows.delete(windowId);
        const pending = await this._getPendingRequest(requestId);
        if (!pending)
            return;
        _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.info(`[DappHandler] User closed approval popup manually for request ${requestId}`);
        this._removePendingRequest(requestId);
        const errorPayload = { error: { code: 4001, message: "User rejected the request" } };
        void this._notifyTab(pending.tabId, "DAPP_PROVIDER_RESPONSE", { requestId, ...errorPayload });
        if (pending.type === "DAPP_CONNECT" || pending.type === "DAPP_REQUEST_ACCOUNTS") {
            void this._resolveCoalescedConnects(pending.origin, errorPayload);
        }
    }
    // ─── Public API ───────────────────────────────────────────────────────────
    /**
     * Idempotent: restores any pending requests from chrome.storage.local into
     * memory after a service-worker restart. Safe to call multiple times.
     */
    async restorePendingRequests() {
        if (!this.restorePendingRequestsPromise) {
            this.restorePendingRequestsPromise = this._restorePendingRequests();
        }
        return this.restorePendingRequestsPromise;
    }
    /**
     * Main entry point for all messages arriving from content scripts / the extension UI.
     * Dispatches to the appropriate private handler based on the message type.
     *
     * For messages that require async work longer than Chrome's ~5 s message-channel
     * timeout, `sendResponse` is called immediately with `{ pending: true }` and the
     * result is later pushed back via `_notifyTab`.
     *
     * @param message      - Typed dApp message from the content script.
     * @param sender       - Chrome message sender (contains tab info).
     * @param sendResponse - Must be called to keep the message channel alive.
     */
    async handleDappMessage(message, sender, sendResponse) {
        const { type, payload, requestId, origin } = message;
        const senderOrigin = origin || (sender.tab?.url ? new URL(sender.tab.url).origin : "");
        try {
            switch (type) {
                // ── Connection ────────────────────────────────────────────────
                case "DAPP_REQUEST_ACCOUNTS":
                case "DAPP_CONNECT":
                    // Respond immediately — storage I/O + chrome.windows.create can exceed the 5 s limit.
                    sendResponse({ success: true, pending: true });
                    void this._handleConnectionRequest(requestId, senderOrigin, payload, sender.tab?.id).catch((error) => {
                        _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Failed to handle connection request after immediate response:", error);
                    });
                    break;
                case "DAPP_GET_ACCOUNTS":
                    await this._handleGetAccounts(senderOrigin, sendResponse);
                    break;
                // ── Signing ───────────────────────────────────────────────────
                case "DAPP_SEND_TRANSACTION":
                case "DAPP_SIGN_TRANSACTION":
                    sendResponse({ success: true, pending: true });
                    void this._handleSignTransaction(requestId, senderOrigin, payload, sender.tab?.id).catch((error) => {
                        _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Failed to handle sign transaction after immediate response:", error);
                    });
                    break;
                case "DAPP_SIGN_MESSAGE":
                    sendResponse({ success: true, pending: true });
                    void this._handleSignMessage(requestId, senderOrigin, payload, sender.tab?.id).catch((error) => {
                        _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Failed to handle sign message after immediate response:", error);
                    });
                    break;
                // ── Chain management ──────────────────────────────────────────
                case "DAPP_SWITCH_CHAIN":
                    await this._handleSwitchChain(requestId, senderOrigin, payload, sendResponse);
                    break;
                case "DAPP_ADD_CHAIN":
                    this._handleAddChain(payload, sendResponse);
                    break;
                case "DAPP_CHAIN_ID":
                    await this._handleGetChainId(senderOrigin, sendResponse);
                    break;
                // ── Disconnect ────────────────────────────────────────────────
                case "DAPP_DISCONNECT":
                    await this._handleDisconnect(senderOrigin, sendResponse);
                    break;
                case "DAPP_FORCE_DISCONNECT_SITE":
                    await this._handleForceDisconnectSite(payload?.origin, sendResponse);
                    break;
                case "DAPP_FORCE_DISCONNECT_ALL":
                    await this._handleForceDisconnectAll(sendResponse);
                    break;
                // ── Pending request lifecycle ─────────────────────────────────
                case "DAPP_GET_PENDING":
                    await this._handleGetPending(requestId, sendResponse);
                    break;
                case "DAPP_APPROVAL_RESULT":
                    sendResponse({ success: true });
                    void this._handleApprovalResult(payload).catch((error) => {
                        _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Failed to process dApp approval result:", error);
                    });
                    break;
                case "DAPP_SIGNING_RESULT":
                    sendResponse({ success: true });
                    void this._handleSigningResult(payload).catch((error) => {
                        _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Failed to process dApp signing result:", error);
                    });
                    break;
                case "DAPP_CANCEL_PENDING_FOR_ORIGIN":
                    await this._handleCancelPendingForOrigin(senderOrigin, sendResponse);
                    break;
                case "DAPP_CLEANUP_REQUESTS":
                    await this._handleCleanupRequests(sendResponse);
                    break;
                // ── RPC proxy ─────────────────────────────────────────────────
                case "DAPP_RPC_PROXY":
                    await handleRpcProxy(payload, senderOrigin, sendResponse);
                    break;
                default:
                    sendResponse({ success: false, error: `Unknown dApp message type: ${type}` });
            }
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error(`DappHandler error for ${type}:`, error);
            sendResponse({ success: false, error: error.message });
        }
    }
    /**
     * Returns a single pending request by ID (in-memory lookup only).
     * Used externally by the background script to retrieve request data for the approval UI.
     */
    getPendingRequest(requestId) {
        return this.pendingRequests.get(requestId);
    }
    /**
     * Returns all currently pending requests (in-memory).
     * Used externally to render a list of outstanding approvals.
     */
    getAllPendingRequests() {
        return Array.from(this.pendingRequests.values());
    }
    // ─── Broadcast helpers (public — called from outside the class) ───────────
    /**
     * Broadcasts an `accountsChanged` event to every non-extension tab.
     * Called when the active wallet account changes globally.
     *
     * @param accounts - New account list (empty array = disconnected).
     */
    async broadcastAccountsChanged(accounts) {
        await this._broadcastToAllTabs("DAPP_ACCOUNTS_CHANGED", { accounts });
    }
    /**
     * Broadcasts an `accountsChanged` event only to tabs whose origin matches
     * `targetOrigin`. Used when a single site is force-disconnected.
     *
     * @param targetOrigin - The origin to target (e.g. "https://app.uniswap.org").
     * @param accounts     - New account list (empty array = disconnected).
     */
    async broadcastAccountsChangedByOrigin(targetOrigin, accounts) {
        try {
            const tabs = this.browserApi.tabs;
            if (!tabs?.query || !tabs?.sendMessage)
                return;
            const allTabs = await tabs.query({});
            for (const tab of allTabs) {
                if (!tab.id || !tab.url || tab.url.startsWith("chrome-extension://"))
                    continue;
                try {
                    const tabOrigin = new URL(tab.url).origin;
                    if (tabOrigin === targetOrigin) {
                        await tabs.sendMessage(tab.id, {
                            type: "DAPP_ACCOUNTS_CHANGED",
                            payload: { accounts },
                        });
                    }
                }
                catch {
                    // Ignore URL parsing errors or tabs without a content script
                }
            }
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error(`Error broadcasting accounts change for origin ${targetOrigin}:`, error);
        }
    }
    // ─── Connection handlers ──────────────────────────────────────────────────
    /**
     * Handles eth_requestAccounts / wallet_connect.
     *
     * Flow:
     * 1. If the origin already has a valid permission, return the cached accounts immediately.
     * 2. If another connect for this origin is already in-flight (and still alive), coalesce
     *    the request so only one approval popup is shown.
     * 3. Otherwise, open a fresh approval UI popup.
     *
     * @param requestId - Unique request ID from the dApp.
     * @param origin    - Requesting dApp origin.
     * @param payload   - Original request payload (may contain chainId, method).
     * @param tabId     - Tab ID of the dApp (used to push the response back).
     */
    async _handleConnectionRequest(requestId, origin, payload, tabId) {
        // Short-circuit: origin already connected — return cached accounts without opening UI.
        const existingPermission = await this._getPermission(origin);
        const isRequestPermissions = payload?.method === "wallet_requestPermissions";
        if (existingPermission && existingPermission.accounts.length > 0 && !isRequestPermissions) {
            this._resolveRequest(requestId, existingPermission.accounts);
            await this._notifyTab(tabId, "DAPP_PROVIDER_RESPONSE", {
                requestId,
                result: existingPermission.accounts,
            });
            return;
        }
        // Coalesce: join an existing in-flight connect queue for this origin.
        if (this._tryCoalesceConnect(origin, requestId, tabId))
            return;
        // No existing connect in-flight — register as the leader and open the UI.
        this.pendingConnectsByOrigin.set(origin, [{ requestId, tabId }]);
        const chainId = await this._resolveChainIdForConnect(origin, payload);
        const pendingRequest = {
            id: requestId,
            type: "DAPP_CONNECT",
            origin,
            tabId,
            method: "eth_requestAccounts",
            params: payload,
            chainId,
            timestamp: Date.now(),
            timeoutMs: DAPP_REQUEST_TIMEOUT_MS,
        };
        this._addPendingRequest(pendingRequest);
        await this._persistPendingToStorage(requestId, pendingRequest);
        await this._openApprovalUI("connect", requestId, tabId);
    }
    /**
     * Handles eth_accounts — returns the stored accounts for an origin without
     * triggering any user interaction. Updates `lastUsed` timestamp on the permission.
     *
     * @param origin       - dApp origin.
     * @param sendResponse - Chrome extension sendResponse callback.
     */
    async _handleGetAccounts(origin, sendResponse) {
        const permission = await this._getPermission(origin);
        if (permission) {
            permission.lastUsed = Date.now();
            await this._savePermission(permission);
            sendResponse({ success: true, data: permission.accounts });
        }
        else {
            sendResponse({ success: true, data: [] });
        }
    }
    /**
     * Handles eth_sendTransaction / eth_signTransaction.
     * Requires the origin to have an existing permission (wallet must be connected first).
     * Opens the signing approval UI popup.
     *
     * @param requestId - Unique request ID.
     * @param origin    - dApp origin.
     * @param payload   - Transaction params.
     * @param tabId     - Originating tab (for push-back response).
     */
    async _handleSignTransaction(requestId, origin, payload, tabId) {
        if (!await this._requirePermission(origin, requestId, tabId))
            return;
        const txParams = payload?.params || payload;
        const txChainId = payload?.chainId || (Array.isArray(txParams) && txParams[0]?.chainId ? parseInt(txParams[0].chainId, 16) : undefined);
        const resolvedChainId = txChainId || (await this._getActiveChainId(origin));
        const pendingRequest = {
            id: requestId,
            type: "DAPP_SIGN_TRANSACTION",
            origin,
            tabId,
            method: payload?.method || "eth_sendTransaction",
            params: txParams,
            chainId: resolvedChainId,
            timestamp: Date.now(),
            timeoutMs: DAPP_REQUEST_TIMEOUT_MS,
        };
        await this._registerAndShowSigningRequest(pendingRequest);
    }
    /**
     * Handles personal_sign / eth_signTypedData_v4 etc.
     * Requires the origin to have an existing permission.
     * Opens the signing approval UI popup.
     *
     * @param requestId - Unique request ID.
     * @param origin    - dApp origin.
     * @param payload   - Signing params (method + params array).
     * @param tabId     - Originating tab.
     */
    async _handleSignMessage(requestId, origin, payload, tabId) {
        if (!await this._requirePermission(origin, requestId, tabId))
            return;
        const resolvedChainId = await this._getActiveChainId(origin);
        const pendingRequest = {
            id: requestId,
            type: "DAPP_SIGN_MESSAGE",
            origin,
            tabId,
            method: payload?.method || "personal_sign",
            params: payload?.params || payload,
            chainId: resolvedChainId,
            timestamp: Date.now(),
            timeoutMs: DAPP_REQUEST_TIMEOUT_MS,
        };
        await this._registerAndShowSigningRequest(pendingRequest);
    }
    // ─── Chain handlers ───────────────────────────────────────────────────────
    /**
     * Handles wallet_switchEthereumChain.
     * Validates the requested chain is supported, updates the stored permission's
     * chainId, and broadcasts a chainChanged event to all tabs.
     *
     * @param requestId    - Unused here but kept for signature consistency.
     * @param origin       - dApp origin.
     * @param payload      - Contains the target chainId (hex string).
     * @param sendResponse - Synchronous response callback.
     */
    async _handleSwitchChain(requestId, origin, payload, sendResponse) {
        const chainId = typeof payload?.chainId === "string" ? parseInt(payload.chainId, 16) : payload?.chainId;
        if (!(0,_shared_types_dapp_types__WEBPACK_IMPORTED_MODULE_2__.isSupportedChain)(chainId)) {
            sendResponse({
                success: false,
                error: { code: 4902, message: `Unrecognized chain ID ${(0,_shared_types_dapp_types__WEBPACK_IMPORTED_MODULE_2__.chainIdToHex)(chainId)}. Try adding the chain first.` },
            });
            return;
        }
        const permission = await this._getPermission(origin);
        if (permission) {
            permission.chainId = chainId;
            permission.lastUsed = Date.now();
            await this._savePermission(permission);
        }
        await this._broadcastChainChanged(chainId);
        sendResponse({ success: true, data: null });
    }
    /**
     * Handles wallet_addEthereumChain.
     * Zelf currently only supports chains that are pre-configured, so this either
     * succeeds silently (chain already known) or returns EIP-1193 error 4902.
     *
     * @param payload      - Contains the chainId to add.
     * @param sendResponse - Synchronous response callback.
     */
    _handleAddChain(payload, sendResponse) {
        const chainId = typeof payload?.chainId === "string" ? parseInt(payload.chainId, 16) : payload?.chainId;
        if ((0,_shared_types_dapp_types__WEBPACK_IMPORTED_MODULE_2__.isSupportedChain)(chainId)) {
            sendResponse({ success: true, data: null });
        }
        else {
            sendResponse({
                success: false,
                error: { code: 4902, message: "Zelf Wallet does not support adding custom chains at this time." },
            });
        }
    }
    /**
     * Handles eth_chainId — returns the hex chain ID currently active for the origin.
     *
     * @param origin       - dApp origin.
     * @param sendResponse - Synchronous response callback.
     */
    async _handleGetChainId(origin, sendResponse) {
        const chainId = await this._getActiveChainId(origin);
        sendResponse({ success: true, data: (0,_shared_types_dapp_types__WEBPACK_IMPORTED_MODULE_2__.chainIdToHex)(chainId) });
    }
    // ─── Disconnect handlers ──────────────────────────────────────────────────
    /**
     * Handles wallet_revokePermissions (user-initiated disconnect from the dApp).
     * Removes the stored permission and clears any stale coalescing state for the origin.
     *
     * @param origin       - dApp origin to disconnect.
     * @param sendResponse - Synchronous response callback.
     */
    async _handleDisconnect(origin, sendResponse) {
        await this._removePermission(origin);
        // Clear any stale coalesced connect entry so a subsequent reconnect
        // doesn't silently piggyback on a dead session.
        this.pendingConnectsByOrigin.delete(origin);
        sendResponse({ success: true });
    }
    /**
     * Admin-initiated force-disconnect of a single origin.
     * Removes its permission and pushes an `accountsChanged([])` event to all its tabs.
     *
     * @param origin       - dApp origin to force-disconnect.
     * @param sendResponse - Synchronous response callback.
     */
    async _handleForceDisconnectSite(origin, sendResponse) {
        if (!origin) {
            sendResponse({ success: false, error: "Origin is required" });
            return;
        }
        try {
            await this._removePermission(origin);
            sendResponse({ success: true });
            void this.broadcastAccountsChangedByOrigin(origin, []);
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Failed to force disconnect site:", error);
            sendResponse({ success: false, error: error.message });
        }
    }
    /**
     * Admin-initiated force-disconnect of ALL origins.
     * Wipes the entire permissions object and broadcasts `accountsChanged([])` globally.
     *
     * @param sendResponse - Synchronous response callback.
     */
    async _handleForceDisconnectAll(sendResponse) {
        try {
            await this.browserApi.setStorageItem(PERMISSIONS_STORAGE_KEY, {});
            sendResponse({ success: true });
            void this.broadcastAccountsChanged([]);
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Failed to force disconnect all sites:", error);
            sendResponse({ success: false, error: error.message });
        }
    }
    // ─── Pending request lifecycle ────────────────────────────────────────────
    /**
     * Retrieves and returns the data for a pending request.
     * Called by the approval UI to populate its display (hostname, favicon, params, etc.).
     *
     * @param requestId    - The pending request to fetch.
     * @param sendResponse - Synchronous response callback.
     */
    async _handleGetPending(requestId, sendResponse) {
        const pending = await this._getPendingRequest(requestId);
        if (!pending) {
            sendResponse({ success: false, error: "No pending request found" });
            return;
        }
        const hostname = this._getHostname(pending.origin);
        const chainId = pending.chainId || (await this._getActiveChainId(pending.origin));
        sendResponse({
            success: true,
            data: {
                origin: pending.origin,
                hostname,
                favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
                chainId,
                method: pending.method,
                params: pending.params,
                verifyStatus: "UNKNOWN",
            },
        });
    }
    /**
     * Processes the result of a connection approval/rejection from the extension UI.
     *
     * On approval: saves the granted permission, notifies the originating dApp tab,
     * and fans out the same result to any coalesced requests for the same origin.
     * On rejection: sends a 4001 error to all waiting requests.
     *
     * @param payload - Contains requestId, approved flag, accounts array, and chainId.
     */
    async _handleApprovalResult(payload) {
        const { requestId, approved, accounts, chainId } = payload;
        const pending = await this._getPendingRequest(requestId);
        if (!pending) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn(`No pending dApp approval request found for ${requestId}`);
            return;
        }
        if (approved && accounts) {
            await this._savePermission({
                origin: pending.origin,
                accounts,
                chainId: chainId || 1404,
                connectedAt: Date.now(),
                lastUsed: Date.now(),
            });
        }
        const responsePayload = approved && accounts
            ? { result: accounts }
            : { error: { code: 4001, message: "User rejected the request" } };
        this._removePendingRequest(requestId);
        void this._notifyTab(pending.tabId, "DAPP_PROVIDER_RESPONSE", { requestId, ...responsePayload });
        // Fan out the same outcome to any coalesced requests for this origin.
        void this._resolveCoalescedConnects(pending.origin, responsePayload);
    }
    /**
     * Processes the result of a signing operation from the extension UI.
     *
     * Pushes either the signed result or a rejection error back to the dApp tab.
     *
     * @param payload - Contains requestId, result (signature), and optional error.
     */
    async _handleSigningResult(payload) {
        const { requestId, result, error } = payload;
        const pending = await this._getPendingRequest(requestId);
        if (!pending) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn(`No pending dApp signing request found for ${requestId}`);
            return;
        }
        const responsePayload = result
            ? { requestId, result }
            : { requestId, error: error || { code: 4001, message: "User rejected the request" } };
        this._removePendingRequest(requestId);
        void this._notifyTab(pending.tabId, "DAPP_PROVIDER_RESPONSE", responsePayload);
    }
    /**
     * Cancels all pending requests originating from a given origin.
     * Used when the dApp explicitly requests cleanup (e.g. before re-connecting).
     * Also triggers a storage cleanup pass.
     *
     * @param origin       - Origin whose pending requests should be cancelled.
     * @param sendResponse - Synchronous response callback.
     */
    async _handleCancelPendingForOrigin(origin, sendResponse) {
        try {
            const toCancel = Array.from(this.pendingRequests.values()).filter((r) => r.origin === origin);
            for (const pending of toCancel) {
                await this._notifyTab(pending.tabId, "DAPP_PROVIDER_RESPONSE", {
                    requestId: pending.id,
                    error: { code: 4001, message: "Connection cancelled - previous request cleared" },
                });
                this._removePendingRequest(pending.id);
            }
            if (toCancel.length > 0) {
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.info(`[Dapp Cancel] Cancelled ${toCancel.length} pending request(s) for origin ${origin}`);
            }
            await this._handleCleanupRequests(sendResponse);
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("[Dapp Cancel] Failed to cancel pending requests:", error);
            sendResponse({ success: false, error: error.message });
        }
    }
    /**
     * Scans chrome.storage.local for pending-request entries that are orphaned
     * (no longer in memory) or expired, and removes them.
     *
     * @param sendResponse - Synchronous response callback with `{ removedCount }`.
     */
    async _handleCleanupRequests(sendResponse) {
        try {
            const allItems = await this.browserApi.getAllStorageItems();
            const keysToRemove = [];
            for (const key of Object.keys(allItems)) {
                if (!key.startsWith(PENDING_REQUEST_STORAGE_PREFIX))
                    continue;
                const requestId = key.replace(PENDING_REQUEST_STORAGE_PREFIX, "");
                const stored = this._normalizeStoredPendingRequest(allItems[key], requestId);
                if (!stored || this._isStoredPendingExpired(stored)) {
                    keysToRemove.push(key);
                }
            }
            if (keysToRemove.length > 0) {
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.info(`[Dapp Cleanup] Found ${keysToRemove.length} orphaned dapp requests. Removing:`, keysToRemove);
                await this.browserApi.removeStorageItems(keysToRemove);
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.info(`[Dapp Cleanup] Removed ${keysToRemove.length} orphaned requests.`);
            }
            else {
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.info("[Dapp Cleanup] No orphaned dapp requests found.");
            }
            sendResponse({ success: true, removedCount: keysToRemove.length });
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("[Dapp Cleanup] Failed to cleanup dapp requests:", error);
            sendResponse({ success: false, error: error.message });
        }
    }
    // ─── In-memory pending request management ─────────────────────────────────
    /**
     * Registers a pending request in memory and schedules its auto-expiry timeout.
     * If the request is already expired (e.g. restored from old storage), expires it immediately.
     *
     * @param request - The full PendingDappRequest to register.
     */
    _addPendingRequest(request) {
        // Cancel any previous timeout for this ID (handles re-registration after restore).
        const existingTimeout = this.timeoutHandles.get(request.id);
        if (existingTimeout)
            clearTimeout(existingTimeout);
        this.pendingRequests.set(request.id, request);
        const remainingMs = request.timestamp + request.timeoutMs - Date.now();
        if (remainingMs <= 0) {
            void this._expirePendingRequest(request.id);
            return;
        }
        const timeout = setTimeout(() => void this._expirePendingRequest(request.id), remainingMs);
        this.timeoutHandles.set(request.id, timeout);
    }
    /**
     * Removes a pending request from memory, clears its timeout, and deletes it from storage.
     *
     * @param requestId - ID of the request to remove.
     */
    _removePendingRequest(requestId) {
        this.pendingRequests.delete(requestId);
        const timeout = this.timeoutHandles.get(requestId);
        if (timeout) {
            clearTimeout(timeout);
            this.timeoutHandles.delete(requestId);
        }
        // Also clean up approval window mappings
        for (const [winId, reqId] of Array.from(this.approvalWindows.entries())) {
            if (reqId === requestId) {
                this.approvalWindows.delete(winId);
            }
        }
        this.browserApi.removeStorageItems(this._getPendingStorageKey(requestId)).catch(() => { });
    }
    /**
     * Resolves a pending request synchronously (using a stored resolve callback).
     * Used when an already-connected origin requests accounts and no UI is needed.
     *
     * @param requestId - ID of the request to resolve.
     * @param result    - Value to resolve with.
     */
    _resolveRequest(requestId, result) {
        const pending = this.pendingRequests.get(requestId);
        if (pending?.resolve)
            pending.resolve(result);
        this._removePendingRequest(requestId);
    }
    /**
     * Fires the timeout error for an expired request: notifies the dApp tab,
     * resolves any coalesced connects with the same error, then removes the request.
     *
     * @param requestId - ID of the expired request.
     */
    async _expirePendingRequest(requestId) {
        const pending = this.pendingRequests.get(requestId) || (await this._getStoredPendingRequest(requestId));
        const errorPayload = { error: { code: -32000, message: "Request timed out" } };
        this._removePendingRequest(requestId);
        if (pending) {
            void this._notifyTab(pending.tabId, "DAPP_PROVIDER_RESPONSE", { requestId, ...errorPayload });
            void this._resolveCoalescedConnects(pending.origin, errorPayload);
        }
    }
    /**
     * Looks up a pending request, falling back to storage if not found in memory.
     * Re-registers the request in memory if it was found only in storage.
     *
     * @param requestId - ID of the request to find.
     * @returns The request, or null if not found / expired.
     */
    async _getPendingRequest(requestId) {
        const inMemory = this.pendingRequests.get(requestId);
        if (inMemory)
            return inMemory;
        const stored = await this._getStoredPendingRequest(requestId);
        if (!stored)
            return null;
        this._addPendingRequest(stored);
        return this.pendingRequests.get(requestId) || stored;
    }
    // ─── Storage helpers ──────────────────────────────────────────────────────
    /**
     * Persists a pending request to chrome.storage.local so it survives
     * service-worker restarts.
     *
     * @param requestId - Key to store under.
     * @param request   - The request to persist.
     */
    async _persistPendingToStorage(requestId, request) {
        await this.browserApi.setStorageItem(this._getPendingStorageKey(requestId), this._buildStoredPendingRequest(request));
    }
    /**
     * Reads and validates a single pending request directly from storage.
     * Returns null if the entry is missing, malformed, or expired.
     *
     * @param requestId - ID of the request to load.
     */
    async _getStoredPendingRequest(requestId) {
        const stored = await this.browserApi.getStorageItem(this._getPendingStorageKey(requestId));
        const normalized = this._normalizeStoredPendingRequest(stored, requestId);
        if (!normalized)
            return null;
        if (this._isStoredPendingExpired(normalized)) {
            this._removePendingRequest(requestId);
            return null;
        }
        return normalized;
    }
    /**
     * On service-worker startup: scans all storage keys for pending request entries,
     * re-registers valid ones in memory, and deletes expired/malformed ones.
     */
    async _restorePendingRequests() {
        try {
            const allItems = await this.browserApi.getAllStorageItems();
            const keysToRemove = [];
            for (const [key, value] of Object.entries(allItems)) {
                if (!key.startsWith(PENDING_REQUEST_STORAGE_PREFIX))
                    continue;
                const requestId = key.replace(PENDING_REQUEST_STORAGE_PREFIX, "");
                const stored = this._normalizeStoredPendingRequest(value, requestId);
                if (!stored || this._isStoredPendingExpired(stored)) {
                    keysToRemove.push(key);
                    continue;
                }
                if (!this.pendingRequests.has(stored.id)) {
                    this._addPendingRequest(stored);
                }
            }
            if (keysToRemove.length > 0) {
                await this.browserApi.removeStorageItems(keysToRemove);
            }
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Failed to restore pending dApp requests:", error);
        }
    }
    /**
     * Reads the permissions map from storage and returns the permission for a given origin.
     *
     * @param origin - The dApp origin to look up.
     * @returns The stored DappPermission, or null if not found.
     */
    async _getPermission(origin) {
        try {
            const permissions = await this.browserApi.getStorageItem(PERMISSIONS_STORAGE_KEY);
            if (!permissions)
                return null;
            return permissions[origin] || null;
        }
        catch {
            return null;
        }
    }
    /**
     * Saves (creates or updates) a dApp permission to storage.
     *
     * @param permission - The permission object to save.
     */
    async _savePermission(permission) {
        try {
            const permissions = (await this.browserApi.getStorageItem(PERMISSIONS_STORAGE_KEY)) || {};
            permissions[permission.origin] = permission;
            await this.browserApi.setStorageItem(PERMISSIONS_STORAGE_KEY, permissions);
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Error saving dApp permission:", error);
        }
    }
    /**
     * Removes the stored permission for a given origin.
     *
     * @param origin - The dApp origin to remove.
     */
    async _removePermission(origin) {
        try {
            const permissions = (await this.browserApi.getStorageItem(PERMISSIONS_STORAGE_KEY)) || {};
            delete permissions[origin];
            await this.browserApi.setStorageItem(PERMISSIONS_STORAGE_KEY, permissions);
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Error removing dApp permission:", error);
        }
    }
    // ─── Permission guard ─────────────────────────────────────────────────────
    /**
     * Checks that the origin has an active permission with at least one account.
     * If not, sends a 4100 Unauthorized error directly to the dApp tab and returns false.
     * Callers should return early when this returns false.
     *
     * @param origin    - dApp origin to check.
     * @param requestId - Used to build the error response.
     * @param tabId     - Tab to notify on failure.
     * @returns true if the origin is authorized, false otherwise.
     */
    async _requirePermission(origin, requestId, tabId) {
        const permission = await this._getPermission(origin);
        if (!permission || permission.accounts.length === 0) {
            await this._notifyTab(tabId, "DAPP_PROVIDER_RESPONSE", {
                requestId,
                error: { code: 4100, message: "Unauthorized - connect wallet first" },
            });
            return false;
        }
        return true;
    }
    // ─── Coalescing helpers ───────────────────────────────────────────────────
    /**
     * Tries to add the request to an existing in-flight connect queue for this origin.
     * Returns true if the request was coalesced (caller should stop processing).
     * Returns false if no valid in-flight connect exists (caller should open a fresh UI).
     *
     * Stale entries (where the leader request is no longer in pendingRequests) are
     * cleaned up automatically, preventing silent swallowing of reconnect attempts.
     *
     * @param origin    - dApp origin.
     * @param requestId - New request ID to potentially queue.
     * @param tabId     - Tab ID of the new request.
     */
    _tryCoalesceConnect(origin, requestId, tabId) {
        const existing = this.pendingConnectsByOrigin.get(origin);
        if (!existing || existing.length === 0)
            return false;
        const leaderRequestId = existing[0].requestId;
        if (this.pendingRequests.has(leaderRequestId)) {
            // Genuine in-flight connect — join the queue.
            existing.push({ requestId, tabId });
            return true;
        }
        // Stale entry (e.g. after disconnect or service-worker restart) — clean up and fall through.
        _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn(`[DappHandler] Stale coalesced connect for ${origin}, clearing and opening fresh UI`);
        this.pendingConnectsByOrigin.delete(origin);
        return false;
    }
    /**
     * Fans out the leader's approval/rejection result to all coalesced requests for the origin.
     * Clears the origin's entry from the map after notifying all waiters.
     *
     * @param origin          - The origin whose coalesced queue should be resolved.
     * @param responsePayload - The result or error to send to each queued request.
     */
    async _resolveCoalescedConnects(origin, responsePayload) {
        const coalesced = this.pendingConnectsByOrigin.get(origin);
        this.pendingConnectsByOrigin.delete(origin);
        if (!coalesced || coalesced.length === 0)
            return;
        for (const entry of coalesced) {
            void this._notifyTab(entry.tabId, "DAPP_PROVIDER_RESPONSE", {
                requestId: entry.requestId,
                ...responsePayload,
            });
        }
    }
    // ─── Chain ID resolution ──────────────────────────────────────────────────
    /**
     * Determines the active chainId for a given origin.
     * Priority: origin-specific permission → global active_chain_id → first supported chain.
     *
     * @param origin - dApp origin.
     * @returns The numeric chain ID to use.
     */
    async _getActiveChainId(origin) {
        const permission = await this._getPermission(origin);
        if (permission?.chainId)
            return permission.chainId;
        const globalChainId = await this.browserApi.getStorageItem("active_chain_id");
        if (globalChainId && typeof globalChainId === "number")
            return globalChainId;
        return _shared_types_dapp_types__WEBPACK_IMPORTED_MODULE_2__.SUPPORTED_CHAINS[0].chainId;
    }
    /**
     * Resolves the chainId to use for a new connection request.
     * Honours the payload's explicit chainId, then the origin's preferred chain,
     * then falls back to the globally active chain.
     *
     * @param origin  - dApp origin.
     * @param payload - Connection request payload (may contain chainId).
     * @returns Numeric chain ID.
     */
    async _resolveChainIdForConnect(origin, payload) {
        const activeChainId = await this._getActiveChainId(origin);
        if (payload?.chainId) {
            return typeof payload.chainId === "string"
                ? parseInt(payload.chainId, 16)
                : payload.chainId;
        }
        const preferredChainId = (0,_shared_services_dapp_mapping_service__WEBPACK_IMPORTED_MODULE_3__.getPreferredChainIdForOrigin)(origin);
        return preferredChainId ?? activeChainId;
    }
    // ─── Signing request helper ───────────────────────────────────────────────
    /**
     * Shared logic for transaction and message signing requests:
     * registers the request in memory + storage, then opens the signing approval UI.
     *
     * @param pendingRequest - The fully constructed pending request to register.
     */
    async _registerAndShowSigningRequest(pendingRequest) {
        this._addPendingRequest(pendingRequest);
        await this._persistPendingToStorage(pendingRequest.id, pendingRequest);
        await this._openApprovalUI("sign", pendingRequest.id, pendingRequest.tabId);
    }
    // ─── UI popup ─────────────────────────────────────────────────────────────
    /**
     * Opens the extension approval popup window for a given page (e.g. "connect", "sign").
     * Positions the popup at the top-right of the currently focused browser window.
     * On failure, sends an error back to the dApp tab and removes the pending request.
     *
     * @param page      - Route segment to open (e.g. "connect" → /dapp/connect?requestId=…).
     * @param requestId - The pending request ID embedded in the URL.
     * @param tabId     - Tab to notify if the popup can't be opened.
     */
    async _openApprovalUI(page, requestId, tabId) {
        const notifyError = (msg) => {
            void this._notifyTab(tabId, "DAPP_PROVIDER_RESPONSE", {
                requestId,
                error: { code: -32603, message: msg },
            });
            this._removePendingRequest(requestId);
        };
        try {
            const runtime = this.browserApi.runtime;
            if (!runtime) {
                notifyError("Extension runtime not available");
                return;
            }
            const extensionUrl = runtime.getURL(`index.html#/dapp/${page}?requestId=${requestId}`);
            const { left, top } = await this._getPopupPosition();
            const createdWindow = await chrome.windows.create({
                url: extensionUrl,
                type: "popup",
                width: 440,
                height: 680,
                left,
                top,
                focused: true,
            });
            // Ensure the popup is in the foreground (handles rare cases where it opens behind).
            if (createdWindow?.id) {
                this.approvalWindows.set(createdWindow.id, requestId);
                await chrome.windows.update(createdWindow.id, { focused: true });
            }
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Error opening approval UI:", error);
            notifyError("Failed to open wallet approval window. Please try again.");
        }
    }
    /**
     * Calculates the pixel position for the approval popup.
     * Attempts to place it at the top-right of the last focused browser window.
     * Falls back to a sensible default if the window geometry is unavailable.
     *
     * @returns An object with `left` and `top` pixel offsets (both >= 0).
     */
    async _getPopupPosition() {
        const defaults = { left: 400, top: 80 };
        try {
            const currentWindow = await chrome.windows.getLastFocused();
            if (currentWindow?.width && currentWindow.left !== undefined) {
                return {
                    left: Math.max(0, currentWindow.left + currentWindow.width - 450),
                    top: Math.max(0, currentWindow.top || defaults.top),
                };
            }
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn("Failed to get last focused window, using default popup position:", error);
        }
        return defaults;
    }
    // ─── Tab messaging ────────────────────────────────────────────────────────
    /**
     * Sends a message to a specific tab's content script.
     * No-ops silently if tabId is undefined.
     *
     * @param tabId   - Target tab ID.
     * @param type    - Message type (e.g. "DAPP_PROVIDER_RESPONSE").
     * @param payload - Message payload.
     * @returns true if the message was delivered, false otherwise.
     */
    async _notifyTab(tabId, type, payload) {
        if (!tabId)
            return false;
        return this._waitForTabAndSendMessage(tabId, { type, payload });
    }
    /**
     * Broadcasts a message to all non-extension tabs.
     * Skips tabs without a content script silently.
     *
     * @param type    - Message type to broadcast.
     * @param payload - Message payload.
     */
    async _broadcastToAllTabs(type, payload) {
        try {
            const tabs = this.browserApi.tabs;
            if (!tabs?.query || !tabs?.sendMessage)
                return;
            const allTabs = await tabs.query({});
            for (const tab of allTabs) {
                if (!tab.id || !tab.url || tab.url.startsWith("chrome-extension://"))
                    continue;
                try {
                    await tabs.sendMessage(tab.id, { type, payload });
                }
                catch {
                    // Tab may not have the content script — ignore
                }
            }
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error(`Error broadcasting ${type}:`, error);
        }
    }
    /**
     * Broadcasts a chainChanged event to all open tabs.
     *
     * @param chainId - Numeric chain ID that is now active.
     */
    async _broadcastChainChanged(chainId) {
        await this._broadcastToAllTabs("DAPP_CHAIN_CHANGED", { chainId: (0,_shared_types_dapp_types__WEBPACK_IMPORTED_MODULE_2__.chainIdToHex)(chainId) });
    }
    /**
     * Attempts to send a message to a tab's content script, retrying with
     * exponential backoff for up to `timeoutMs` milliseconds.
     *
     * This is necessary because after a biometric auth or a long-running background
     * operation, the content script may need a moment to become ready.
     *
     * Retry schedule: 100ms → 200ms → 400ms → ... → capped at 5000ms.
     *
     * @param tabId     - Target tab ID.
     * @param message   - The message object to send.
     * @param timeoutMs - Total time budget for all retries (default: 60 s).
     * @returns true if the message was eventually delivered, false if timed out.
     */
    async _waitForTabAndSendMessage(tabId, message, timeoutMs = TAB_MESSAGE_TIMEOUT_MS) {
        const tabs = this.browserApi.tabs;
        if (!tabs?.sendMessage)
            return false;
        const deadline = Date.now() + timeoutMs;
        let delay = TAB_MESSAGE_INITIAL_DELAY_MS;
        let attempt = 0;
        while (Date.now() < deadline) {
            attempt++;
            try {
                await tabs.sendMessage(tabId, message);
                if (attempt > 1) {
                    _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.info(`[DappHandler] Tab ${tabId} notified after ${attempt} attempt(s)`);
                }
                return true;
            }
            catch {
                const remaining = deadline - Date.now();
                if (remaining <= 0)
                    break;
                const waitMs = Math.min(delay, remaining, TAB_MESSAGE_MAX_DELAY_MS);
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn(`[DappHandler] Tab ${tabId} not ready (attempt ${attempt}), retrying in ${waitMs}ms (${Math.round(remaining / 1000)}s left)`);
                await new Promise((resolve) => setTimeout(resolve, waitMs));
                delay = Math.min(delay * 2, TAB_MESSAGE_MAX_DELAY_MS);
            }
        }
        _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("[DappHandler] Timed out trying to notify tab", { tabId, messageType: message?.type, attempts: attempt });
        return false;
    }
    // ─── Data model helpers ───────────────────────────────────────────────────
    /**
     * Returns the storage key for a given pending request ID.
     *
     * @param requestId - Request ID to build the key for.
     */
    _getPendingStorageKey(requestId) {
        return `${PENDING_REQUEST_STORAGE_PREFIX}${requestId}`;
    }
    /**
     * Safely extracts the hostname from an origin URL string.
     * Returns the raw string if URL parsing fails.
     *
     * @param origin - Origin URL (e.g. "https://app.uniswap.org").
     */
    _getHostname(origin) {
        try {
            return new URL(origin).hostname;
        }
        catch {
            return origin;
        }
    }
    /**
     * Converts a live PendingDappRequest into the StoredPendingDappRequest shape
     * that is written to chrome.storage.local (adds expiry timestamp, favicon, hostname).
     *
     * @param request - The request to serialize.
     */
    _buildStoredPendingRequest(request) {
        const hostname = this._getHostname(request.origin);
        return {
            ...request,
            chainId: request.chainId || 1404,
            expiresAt: request.timestamp + request.timeoutMs,
            favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
            hostname,
            verifyStatus: "UNKNOWN",
        };
    }
    /**
     * Validates and normalizes a raw storage value into a StoredPendingDappRequest.
     * Applies safe defaults for missing/invalid fields so old storage formats are handled gracefully.
     * Returns null if the stored value is fundamentally invalid (missing origin).
     *
     * @param stored    - Raw value from chrome.storage.local.
     * @param requestId - Fallback ID if stored.id is missing.
     */
    _normalizeStoredPendingRequest(stored, requestId) {
        if (!stored || typeof stored !== "object" || !stored.origin)
            return null;
        const hostname = typeof stored.hostname === "string" && stored.hostname
            ? stored.hostname
            : this._getHostname(stored.origin);
        const timeoutMs = typeof stored.timeoutMs === "number" && stored.timeoutMs > 0
            ? stored.timeoutMs
            : DAPP_REQUEST_TIMEOUT_MS;
        const timestamp = typeof stored.timestamp === "number" && stored.timestamp > 0
            ? stored.timestamp
            : Date.now();
        const expiresAt = typeof stored.expiresAt === "number" && stored.expiresAt > 0
            ? stored.expiresAt
            : timestamp + timeoutMs;
        return {
            id: typeof stored.id === "string" && stored.id ? stored.id : requestId,
            type: stored.type || "DAPP_CONNECT",
            origin: stored.origin,
            tabId: typeof stored.tabId === "number" ? stored.tabId : undefined,
            method: stored.method || "eth_requestAccounts",
            params: stored.params,
            chainId: typeof stored.chainId === "number" ? stored.chainId : 1404,
            timestamp,
            timeoutMs,
            expiresAt,
            favicon: stored.favicon || `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
            hostname,
            verifyStatus: "UNKNOWN",
        };
    }
    /**
     * Returns true if a stored pending request has passed its expiry timestamp.
     *
     * @param request - The stored request to check.
     */
    _isStoredPendingExpired(request) {
        return request.expiresAt <= Date.now();
    }
}


/***/ },

/***/ "./background-scripts/services/extension-lifecycle.ts"
/*!************************************************************!*\
  !*** ./background-scripts/services/extension-lifecycle.ts ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExtensionLifecycle: () => (/* binding */ ExtensionLifecycle)
/* harmony export */ });
/* harmony import */ var _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../extension-scripts/logger/logger.class */ "./extension-scripts/logger/logger.class.ts");

class ExtensionLifecycle {
    constructor(browserApi) {
        this.browserApi = browserApi;
        this.DEFAULT_INDEX = "index.html";
    }
    initialize() {
        this._validateServiceWorkerContext();
        this._setupServiceWorkerEvents();
        this._setupSidePanel();
        this._setupEventListeners();
        this._scheduleServiceWorkerNotification();
    }
    _setupSidePanel() {
        this._setupChromeSidePanel();
        this._setupFirefoxSidePanel();
    }
    _setupEventListeners() {
        this._setupInstallListeners();
        this._setupRuntimeListeners();
        this._setupGlobalMessageListener();
    }
    async _notifyServiceWorkerReady() {
        try {
            // Get all tabs and notify them that service worker is ready
            if (!this.browserApi.has("tabs"))
                return;
            const tabsApi = this.browserApi.tabs;
            if (!tabsApi?.query)
                return;
            const tabs = await tabsApi.query({});
            let successCount = 0;
            for (const tab of tabs) {
                if (!tab.id)
                    continue;
                try {
                    if (!tabsApi?.sendMessage)
                        continue;
                    await tabsApi.sendMessage(tab.id, {
                        type: "SERVICE_WORKER_READY",
                    });
                    successCount++;
                }
                catch (error) {
                    // Tab might not have content script loaded yet, ignore
                }
            }
            // If no tabs were successfully notified, retry after a short delay
            if (successCount !== 0 || !tabs.length)
                return;
            setTimeout(() => {
                this._notifyServiceWorkerReady();
            }, 1000);
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Error notifying content scripts:", error);
        }
    }
    _validateServiceWorkerContext() {
        if (typeof self === "undefined") {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Service worker is NOT running in correct context");
        }
        else {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.log("Service worker is running in correct context");
        }
    }
    _setupServiceWorkerEvents() {
        if (typeof self === "undefined")
            return;
        self.addEventListener("install", (event) => {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.log("Service worker installing...");
            event.waitUntil(self.skipWaiting());
        });
        self.addEventListener("activate", (event) => {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.log("Service worker activating...");
            event.waitUntil(self.clients
                .claim()
                .then(() => {
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.log("Service worker activated successfully");
                this._notifyServiceWorkerReady();
                return Promise.resolve();
            })
                .catch((error) => {
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Service worker activation failed:", error);
                this._notifyServiceWorkerReady();
                return Promise.resolve();
            }));
        });
    }
    _setupChromeSidePanel() {
        if (!this.browserApi.sidePanel)
            return;
        this.browserApi.sidePanel.setOptions({
            path: this.DEFAULT_INDEX,
            enabled: true,
        });
    }
    _setupFirefoxSidePanel() {
        if (!this.browserApi.isBrowser)
            return;
        this.browserApi.sidebarAction?.setPanel({ panel: this.DEFAULT_INDEX });
        this.browserApi.menus?.onClicked.addListener(() => {
            if (this.browserApi.sidebarAction)
                this.browserApi.sidebarAction.open();
        });
    }
    _setupInstallListeners() {
        if (this.browserApi.isBrowser) {
            this.browserApi.runtime?.onInstalled.addListener(() => {
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.log("Extension installed (Firefox)");
            });
        }
        else if (this.browserApi.isChrome && this.browserApi.has("runtime")) {
            this.browserApi.runtime?.onInstalled.addListener(() => {
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.log("Extension installed (Chrome)");
            });
        }
    }
    _setupRuntimeListeners() {
        if (!this.browserApi.has("runtime"))
            return;
        this.browserApi.runtime?.onStartup.addListener(() => {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.log("Background: Extension startup");
        });
        this.browserApi.runtime?.onSuspend.addListener(() => {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.log("Background: Extension suspending");
        });
    }
    _setupGlobalMessageListener() {
        if (typeof self === "undefined")
            return;
        self.addEventListener("message", (event) => {
            // Handle global messages if needed
        });
    }
    _scheduleServiceWorkerNotification() {
        // For cases where the service worker is already active, notify immediately
        // This handles the case where the service worker doesn't go through install/activate
        setTimeout(() => {
            this._notifyServiceWorkerReady();
        }, 100);
    }
}


/***/ },

/***/ "./background-scripts/services/message-handler.ts"
/*!********************************************************!*\
  !*** ./background-scripts/services/message-handler.ts ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MessageHandler: () => (/* binding */ MessageHandler)
/* harmony export */ });
/* harmony import */ var _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @extension-scripts/logger/logger.class */ "./extension-scripts/logger/logger.class.ts");
/* harmony import */ var _background_credential_manager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./background-credential-manager */ "./background-scripts/services/background-credential-manager.ts");


class MessageHandler {
    static getInstance(browserApi) {
        if (!MessageHandler.instance) {
            MessageHandler.instance = new MessageHandler(browserApi);
        }
        return MessageHandler.instance;
    }
    constructor(browserApi) {
        this.browserApi = browserApi;
        this.credentialManager = _background_credential_manager__WEBPACK_IMPORTED_MODULE_1__.BackgroundCredentialManager.getInstance(this.browserApi);
    }
    async _navigatePopupToRoute(route) {
        try {
            // For popup mode, we don't need to find a tab - the popup will handle navigation
            // The popup will check for pending decryption data and navigate accordingly
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Error navigating popup to route:", error);
        }
    }
    async _sendDecryptionDataToPopup() {
        try {
            if (!this.pendingDecryptionData)
                return;
            const runtime = this.browserApi.runtime;
            if (!runtime)
                return;
            try {
                await runtime.sendMessage({
                    type: "PASSWORD_DECRYPTOR_DATA",
                    payload: this.pendingDecryptionData,
                });
                this.pendingDecryptionData = undefined;
            }
            catch (error) {
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("MessageHandler: Error sending decryption data to popup:", error);
            }
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("MessageHandler: Error in sendDecryptionDataToPopup:", error);
        }
    }
    /**
     * Notify all content scripts that the service worker is ready
     * This is called when the extension UI is opened to ensure content scripts
     * know the service worker is available even if it didn't go through activation
     */
    async _notifyContentScriptsServiceWorkerReady() {
        try {
            if (!this.browserApi.has("tabs"))
                return;
            const tabsApi = this.browserApi.tabs;
            if (!tabsApi?.query)
                return;
            const tabs = await tabsApi.query({});
            let successCount = 0;
            for (const tab of tabs) {
                if (!tab.id || !tab.url || tab.url.startsWith("chrome-extension://"))
                    continue;
                try {
                    if (!tabsApi?.sendMessage)
                        continue;
                    await tabsApi.sendMessage(tab.id, {
                        type: "SERVICE_WORKER_READY",
                    });
                    successCount++;
                }
                catch (error) {
                    continue;
                }
            }
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("MessageHandler: Error notifying content scripts:", error);
        }
    }
    /**
     * Handle close popup request
     */
    async _handleClosePopup(payload, sender) {
        try {
            if (typeof chrome !== "undefined" && chrome.runtime) {
                chrome.runtime.sendMessage({
                    type: "CLOSE_POPUP",
                    payload: {},
                });
            }
            else {
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.warn("MessageHandler: Chrome runtime not available for sending close message");
            }
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("MessageHandler: Error closing popup:", error);
        }
    }
    async handleAutofillMessage(message, sender, sendResponse) {
        const timeout = setTimeout(() => {
            sendResponse({ success: false, error: "Request timeout" });
        }, 8000);
        try {
            switch (message.type) {
                case "GET_PASSWORDS":
                    const passwords = await this.credentialManager.getPasswords(message.payload?.website || "");
                    sendResponse({ success: true, data: passwords });
                    break;
                case "CREATE_PASSWORD":
                    await this._handleCreatePassword(message.payload || {}, sendResponse);
                    break;
                case "AUTHENTICATE":
                    await this._handleAuthenticate(sendResponse);
                    break;
                case "OPEN_BIOMETRICS_MODAL":
                    await this._handleOpenBiometricsModal();
                    sendResponse({ success: true });
                    break;
                case "OPEN_PASSWORD_DECRYPTOR":
                    await this._handleOpenPasswordDecryptor(message.payload || {}, sender);
                    sendResponse({ success: true });
                    break;
                case "SEND_DECRYPTION_DATA_TO_POPOUT":
                    await this._handleSendDecryptionDataToPopout(message.payload || {});
                    sendResponse({ success: true });
                    break;
                case "DECRYPTION_RESULT_FROM_POPOUT":
                    await this._handleDecryptionResultFromPopout(message.payload || {});
                    sendResponse({ success: true });
                    break;
                case "CLOSE_POPUP":
                    await this._handleClosePopup(message.payload || {}, sender);
                    sendResponse({ success: true });
                    break;
                case "POPUP_READY":
                    if (this.pendingPopupRoute) {
                        this._navigatePopupToRoute(this.pendingPopupRoute);
                        this.pendingPopupRoute = undefined;
                    }
                    if (this.pendingDecryptionData) {
                        this._sendDecryptionDataToPopup();
                    }
                    sendResponse({ success: true });
                    break;
                case "FILL_PASSWORD_FORM":
                    await this._handleFillPasswordForm(message.payload || {}, sender, sendResponse);
                    break;
                default:
                    sendResponse({ success: false, error: "Unknown message type [BACKGROUND SCRIPT]" });
            }
            clearTimeout(timeout);
        }
        catch (error) {
            clearTimeout(timeout);
            sendResponse({ success: false, error: error.message });
        }
    }
    async _handleCreatePassword(payload, sendResponse) {
        try {
            const urlInfo = payload?.urlInfo || null;
            const tab = (await this._openExtensionUI("zelf-keys/passwords/new"));
            if (tab) {
                await this._waitForTabAndSendMessage(tab.id, {
                    type: "CREATE_PASSWORD",
                    payload: { urlInfo },
                });
                this._notifyContentScriptsServiceWorkerReady();
            }
            sendResponse({ success: true });
        }
        catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }
    async _handleAuthenticate(sendResponse) {
        try {
            const isAuthenticated = await this.credentialManager.isAuthenticated();
            sendResponse({ success: isAuthenticated });
        }
        catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }
    async _handleOpenBiometricsModal() {
        try {
            await this._openExtensionUI("biometrics");
            this._notifyContentScriptsServiceWorkerReady();
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Error opening biometrics modal:", error);
        }
    }
    async _handleOpenPasswordDecryptor(payload, sender) {
        try {
            const tabId = await this._openExtensionUI("popout-decryptor");
            if (tabId) {
                this.pendingDecryptionRequests = this.pendingDecryptionRequests || new Map();
                if (payload.requestId && sender.tab?.id) {
                    this.pendingDecryptionRequests.set(payload.requestId, sender.tab.id);
                }
                this._notifyContentScriptsServiceWorkerReady();
            }
            else {
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("MessageHandler: Failed to open password decryptor popout");
            }
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("MessageHandler: Error opening password decryptor:", error);
        }
    }
    async _handleSendDecryptionDataToPopout(payload) {
        try {
            if (!payload.requestId || !payload.publicData)
                throw new Error("Invalid payload for decryption data");
            this.pendingDecryptionData = payload;
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("MessageHandler: Error sending decryption data to popout:", error);
        }
    }
    async _handleDecryptionResultFromPopout(payload) {
        try {
            const originalTabId = payload.requestId ? this.pendingDecryptionRequests?.get(payload.requestId) : undefined;
            if (originalTabId) {
                await this._sendDecryptionResultToTab(originalTabId, payload.result);
                this._cleanupDecryptionRequest(payload.requestId);
            }
            else {
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("MessageHandler: No original tab ID found for request:", payload.requestId);
            }
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Error handling decryption result from popout:", error);
        }
    }
    async _openExtensionUI(page) {
        try {
            const runtime = this.browserApi.runtime;
            if (!runtime) {
                _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Runtime API not available");
                return null;
            }
            if (page === "popout-decryptor") {
                this.pendingPopupRoute = page;
                return await this._openPopup();
            }
            return await this._openAsTab(runtime, page);
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Error opening extension UI:", error);
            return null;
        }
    }
    async _waitForTabAndSendMessage(tabId, message, maxRetries = 20, retryDelay = 500) {
        const tabs = this.browserApi.tabs;
        if (!tabs) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Tabs API not available");
            return;
        }
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await tabs.sendMessage(tabId, { type: "PING" });
                await tabs.sendMessage(tabId, message);
                return;
            }
            catch (error) {
                if (attempt === maxRetries) {
                    _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Max retries reached, failed to send message to tab", tabId);
                    return;
                }
                await new Promise((resolve) => setTimeout(resolve, retryDelay));
            }
        }
    }
    async _sendDecryptionResultToTab(tabId, result) {
        const tabs = this.browserApi.tabs;
        if (!tabs) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Tabs API not available");
            return;
        }
        await tabs.sendMessage(tabId, {
            type: "DECRYPTION_RESULT",
            payload: result,
        });
    }
    _cleanupDecryptionRequest(requestId) {
        if (!requestId)
            return;
        this.pendingDecryptionRequests?.delete(requestId);
    }
    async _openPopup() {
        const action = this.browserApi.action;
        if (!action) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Action API not available");
            return null;
        }
        try {
            await action.openPopup();
            return -1;
        }
        catch (popupError) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Failed to open popup:", popupError);
            return null;
        }
    }
    async _openAsTab(runtime, page) {
        const extensionUrl = runtime.getURL(`index.html#/${page}`);
        const tabs = this.browserApi.tabs;
        if (!tabs) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("Tabs API not available");
            return null;
        }
        const newTab = await tabs.create({
            url: extensionUrl,
            active: true,
        });
        return newTab;
    }
    async _handleFillPasswordForm(payload, sender, sendResponse) {
        try {
            if (!sender.tab?.id)
                throw new Error("No tab ID provided for form wait request");
            const tabs = this.browserApi.tabs;
            if (!tabs)
                throw new Error("Tabs API not available");
            await tabs.sendMessage(sender.tab.id, {
                type: "FILL_PASSWORD_FORM",
                payload,
            });
            sendResponse({ success: true });
        }
        catch (error) {
            _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_0__.Logger.error("MessageHandler: Error handling wait for form ready:", error);
            sendResponse({ success: false, error: error.message });
        }
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

/***/ "./shared/services/dapp-mapping.service.ts"
/*!*************************************************!*\
  !*** ./shared/services/dapp-mapping.service.ts ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DAPP_PREFERRED_NETWORKS: () => (/* binding */ DAPP_PREFERRED_NETWORKS),
/* harmony export */   getPreferredChainIdForOrigin: () => (/* binding */ getPreferredChainIdForOrigin),
/* harmony export */   getPreferredNetworkName: () => (/* binding */ getPreferredNetworkName)
/* harmony export */ });
/* harmony import */ var _types_dapp_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types/dapp.types */ "./shared/types/dapp.types.ts");

/**
 * Maps dApp origins (or parts of origins) to their preferred/native networks.
 * These are smart defaults used when a dApp doesn't explicitly request a chain,
 * or when we want to provide the best user experience for known sites.
 */
const DAPP_PREFERRED_NETWORKS = {
    // --- BlockDAG / Zelf Ecosystem (1404) ---
    "zelf.world": 1404,
    "zelf.world/nft": 1404,
    "dashboard.zelf.world": 1404,
    "bdagscan.com": 1404,
    "blockdag.network": 1404,
    // --- Avalanche (43114) ---
    "core.app": 43114,
    "avalanche.org": 43114,
    "traderjoexyz.com": 43114,
    "yieldyak.com": 43114,
    "pangolin.exchange": 43114,
    "platypus.finance": 43114,
    "benqi.fi": 43114,
    "gmx.io": 43114,
    "stargate.finance": 43114,
    "avascan.info": 43114,
    "snowtrace.io": 43114,
    "colony.lab": 43114,
    "joepegs.com": 43114,
    "axial.exchange": 43114,
    "steaks.finance": 43114,
    "vectorfinance.io": 43114,
    "moo.yieldyak.com": 43114,
    "app.wonderland.money": 43114,
    // --- Ethereum Mainnet (1) ---
    "uniswap.org": 1,
    "opensea.io": 1,
    "app.lido.fi": 1,
    "curve.fi": 1,
    "aave.com": 1,
    "compound.finance": 1,
    "sushiswap.com": 1,
    "balancer.fi": 1,
    "makerdao.com": 1,
    "app.1inch.io": 1,
    "yearn.fi": 1,
    "etherscan.io": 1,
    "ens.domains": 1,
    "snapshot.org": 1,
    "app.zerion.io": 1,
    "zapper.fi": 1,
    "blur.io": 1,
    "looksrare.org": 1,
    "fractal.is": 1,
    "coingecko.com": 1,
    "dexscreener.com": 1,
    "dextools.io": 1,
    "convexfinance.com": 1,
    "frax.finance": 1,
    "rocketpool.net": 1,
    "stakewise.io": 1,
    "eigenlayer.xyz": 1,
    "instadapp.io": 1,
    "morpho.org": 1,
    "pendle.finance": 1,
    // --- Arbitrum One (42161) ---
    "app.gmx.io": 42161,
    "arbitrum.io": 42161,
    "hop.exchange": 42161,
    "radiant.capital": 42161,
    "camelot.exchange": 42161,
    "arbiscan.io": 42161,
    "dypex.exchange": 42161,
    "arbitrum.network": 42161,
    "chronos.exchange": 42161,
    "vincit.fi": 42161,
    // --- Optimism (10) ---
    "optimism.io": 10,
    "velodrome.finance": 10,
    "lyra.finance": 10,
    "kwenta.eth.limo": 10,
    "synthetix.io": 10,
    "optimistic.etherscan.io": 10,
    "sonne.finance": 10,
    "beethovenx.io": 10,
    // --- Base (8453) ---
    "base.org": 8453,
    "aerodrome.finance": 8453,
    "friend.tech": 8453,
    "basescan.org": 8453,
    "moonwell.fi": 8453,
    "across.to": 8453,
    "extrabe.fi": 8453,
    "basename.app": 8453,
    // --- BNB Chain (56) ---
    "pancakeswap.finance": 56,
    "bnbchain.org": 56,
    "venus.io": 56,
    "bscscan.com": 56,
    "alpaca.finance": 56,
    "biswap.org": 56,
    "babyswap.finance": 56,
    "ellipsis.finance": 56,
    "ape-swap.finance": 56,
    "bakeryswap.org": 56,
    "bi-swap.com": 56,
    // --- Polygon (137) ---
    "quickswap.exchange": 137,
    "polygon.technology": 137,
    "polygonscan.com": 137,
    "sand.game": 137,
    "decentraland.org": 137,
    "mstable.org": 137,
    "clipper.exchange": 137,
    "peaseasy.com": 137,
    "gravity.finance": 137,
    "messina.exchange": 137,
};
/**
 * Returns the preferred chain ID for a given origin based on our mapped records.
 */
function getPreferredChainIdForOrigin(origin) {
    if (!origin)
        return undefined;
    const cleanOrigin = origin
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "");
    // 1. Exact match check
    if (DAPP_PREFERRED_NETWORKS[cleanOrigin]) {
        return DAPP_PREFERRED_NETWORKS[cleanOrigin];
    }
    // 2. Contains match (for subdomains and paths)
    for (const [key, chainId] of Object.entries(DAPP_PREFERRED_NETWORKS)) {
        if (cleanOrigin.includes(key)) {
            return chainId;
        }
    }
    return undefined;
}
/**
 * Returns the chain name for a preferred chain ID mapping if found.
 */
function getPreferredNetworkName(origin) {
    const chainId = getPreferredChainIdForOrigin(origin);
    if (!chainId)
        return undefined;
    return _types_dapp_types__WEBPACK_IMPORTED_MODULE_0__.SUPPORTED_CHAINS.find((c) => c.chainId === chainId)?.name;
}


/***/ },

/***/ "./shared/types/dapp.types.ts"
/*!************************************!*\
  !*** ./shared/types/dapp.types.ts ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SUPPORTED_CHAINS: () => (/* binding */ SUPPORTED_CHAINS),
/* harmony export */   chainIdToHex: () => (/* binding */ chainIdToHex),
/* harmony export */   getChainConfig: () => (/* binding */ getChainConfig),
/* harmony export */   hexToChainId: () => (/* binding */ hexToChainId),
/* harmony export */   isSupportedChain: () => (/* binding */ isSupportedChain)
/* harmony export */ });
const SUPPORTED_CHAINS = [
    { chainId: 1, name: "Ethereum", symbol: "ETH", network: "ethereum", rpcUrl: "https://eth.llamarpc.com", blockExplorer: "https://etherscan.io" },
    { chainId: 42161, name: "Arbitrum One", symbol: "ETH", network: "arbitrum", rpcUrl: "https://arb1.arbitrum.io/rpc", blockExplorer: "https://arbiscan.io" },
    { chainId: 10, name: "Optimism", symbol: "ETH", network: "optimism", rpcUrl: "https://mainnet.optimism.io", blockExplorer: "https://optimistic.etherscan.io" },
    { chainId: 8453, name: "Base", symbol: "ETH", network: "base", rpcUrl: "https://mainnet.base.org", blockExplorer: "https://basescan.org" },
    { chainId: 43114, name: "Avalanche", symbol: "AVAX", network: "avalanche", rpcUrl: "https://api.avax.network/ext/bc/C/rpc", blockExplorer: "https://avascan.info" },
    { chainId: 137, name: "Polygon", symbol: "POL", network: "polygon", rpcUrl: "https://polygon-rpc.com", blockExplorer: "https://polygonscan.com" },
    { chainId: 56, name: "BNB Chain", symbol: "BNB", network: "binance", rpcUrl: "https://bsc-dataseed.binance.org", blockExplorer: "https://bscscan.com" },
    { chainId: 1404, name: "BlockDAG", symbol: "BDAG", network: "blockdag", rpcUrl: "https://rpc.bdagscan.com", blockExplorer: "https://bdagscan.com" },
];
function getChainConfig(chainId) {
    return SUPPORTED_CHAINS.find((c) => c.chainId === chainId);
}
function isSupportedChain(chainId) {
    return SUPPORTED_CHAINS.some((c) => c.chainId === chainId);
}
function chainIdToHex(chainId) {
    return `0x${chainId.toString(16)}`;
}
function hexToChainId(hex) {
    return parseInt(hex, 16);
}


/***/ },

/***/ "./shared/types/tag.types.ts"
/*!***********************************!*\
  !*** ./shared/types/tag.types.ts ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LEGACY_XLM_PUBLIC_DATA_KEY: () => (/* binding */ LEGACY_XLM_PUBLIC_DATA_KEY),
/* harmony export */   TagModel: () => (/* binding */ TagModel),
/* harmony export */   TagPublicDataModel: () => (/* binding */ TagPublicDataModel),
/* harmony export */   publicDataNeedsXlmPersistHeal: () => (/* binding */ publicDataNeedsXlmPersistHeal),
/* harmony export */   readPublicDataDotAddress: () => (/* binding */ readPublicDataDotAddress),
/* harmony export */   readPublicDataKsmAddress: () => (/* binding */ readPublicDataKsmAddress),
/* harmony export */   readPublicDataXlmAddress: () => (/* binding */ readPublicDataXlmAddress),
/* harmony export */   tryHealPublicDataXlmToCanonical: () => (/* binding */ tryHealPublicDataXlmToCanonical)
/* harmony export */ });
/** Legacy `publicData` key from older builds / API payloads; migrated into `xlmAddress`. */
const LEGACY_XLM_PUBLIC_DATA_KEY = "stellarAddress";
/** Prefer `xlmAddress`; fall back to {@link LEGACY_XLM_PUBLIC_DATA_KEY} so API/storage self-heals in memory. */
function readPublicDataXlmAddress(pd) {
    if (!pd)
        return "";
    const primary = pd.xlmAddress;
    const legacy = pd[LEGACY_XLM_PUBLIC_DATA_KEY];
    const s = (typeof primary === "string" ? primary : "") || (typeof legacy === "string" ? legacy : "");
    return s.trim();
}
/** Stored blob has XLM only under the legacy key; should persist canonical `xlmAddress`. */
function publicDataNeedsXlmPersistHeal(pd, coerced) {
    if (!pd || !coerced)
        return false;
    const xlm = typeof pd.xlmAddress === "string" ? pd.xlmAddress.trim() : "";
    const legacy = pd[LEGACY_XLM_PUBLIC_DATA_KEY];
    const leg = typeof legacy === "string" ? legacy.trim() : "";
    return !xlm && !!leg && leg === coerced;
}
/** Returns healed `publicData` or `null` if nothing to do. */
function tryHealPublicDataXlmToCanonical(pd) {
    if (!pd)
        return null;
    const coerced = readPublicDataXlmAddress(pd);
    if (!publicDataNeedsXlmPersistHeal(pd, coerced))
        return null;
    const next = { ...pd, xlmAddress: coerced };
    delete next[LEGACY_XLM_PUBLIC_DATA_KEY];
    return next;
}
const ADDRESS_CHUNK_KEYS = ["addresses", "addresses2", "addresses3"];
function mergeAddressChunkValue(out, key) {
    const raw = out[key];
    if (raw == null)
        return;
    if (typeof raw === "string") {
        try {
            const chunk = JSON.parse(raw);
            if (chunk && typeof chunk === "object" && !Array.isArray(chunk)) {
                Object.assign(out, chunk);
            }
        }
        catch {
            /* keep raw string on out for debugging */
        }
        return;
    }
    if (typeof raw === "object" && !Array.isArray(raw)) {
        Object.assign(out, raw);
    }
}
/** Merges Pinata `addresses[N]` (JSON string or pre-parsed object) onto a shallow copy. */
function withMergedAddressChunkFields(pd) {
    const out = { ...pd };
    for (const k of ADDRESS_CHUNK_KEYS) {
        mergeAddressChunkValue(out, k);
    }
    return out;
}
/** API / IPFS `publicData` uses `dotAddress`; `polkadotAddress` and short chunk key `dot` are fallbacks. */
function readPublicDataDotAddress(pd) {
    if (!pd)
        return "";
    const m = withMergedAddressChunkFields(pd);
    const primary = m.dotAddress;
    const alt = m.polkadotAddress;
    const short = m.dot;
    const s = (typeof primary === "string" ? primary : "") || (typeof alt === "string" ? alt : "") || (typeof short === "string" ? short : "");
    return s.trim();
}
/** API / IPFS `publicData` uses `ksmAddress`; `kusamaAddress` and short chunk key `ksm` are fallbacks. */
function readPublicDataKsmAddress(pd) {
    if (!pd)
        return "";
    const m = withMergedAddressChunkFields(pd);
    const primary = m.ksmAddress;
    const alt = m.kusamaAddress;
    const short = m.ksm;
    const s = (typeof primary === "string" ? primary : "") || (typeof alt === "string" ? alt : "") || (typeof short === "string" ? short : "");
    return s.trim();
}
class TagPublicDataModel {
    constructor(data) {
        this.avalancheAddress = data.avalancheAddress || data.ethAddress || "";
        this.binanceAddress = data.binanceAddress || data.ethAddress || "";
        this.blockDAGAddress = data.blockDAGAddress || data.ethAddress || "";
        this.btcAddress = data.btcAddress || "";
        this.domain = data.domain || "";
        this.ethAddress = data.ethAddress || "";
        this.solanaAddress = data.solanaAddress || "";
        this.xlmAddress = readPublicDataXlmAddress(data);
        this.suiAddress = data.suiAddress || "";
        this.tonAddress = data.tonAddress || "";
        this.dotAddress = readPublicDataDotAddress(data);
        this.ksmAddress = readPublicDataKsmAddress(data);
        this.tagName = data.tagName || "";
        this.hasPassword = data.hasPassword || "false";
        this.type = data.type || "";
        this.origin = data.origin || "";
        this.registeredAt = data.registeredAt || "";
        this.expiresAt = data.expiresAt || "";
        this.st = data.st || "";
        this.gracePeriod = this._calculateGracePeriod();
    }
    get isExpired() {
        if (!this.expiresAt)
            return false;
        return new Date(this.expiresAt) < new Date();
    }
    get isExpiringSoon() {
        if (!this.expiresAt)
            return false;
        const oneMonthInMs = 24 * 60 * 60 * 1000 * 30;
        const timeLeft = this._timeRemaining();
        return timeLeft > 0 && timeLeft <= oneMonthInMs;
    }
    get isFullyExpired() {
        return this.isExpired && !this.isInGracePeriod;
    }
    get isInGracePeriod() {
        if (this.type !== "mainnet" || !this.gracePeriod)
            return false;
        const now = new Date();
        return now < this.gracePeriod && now > new Date(this.expiresAt || "");
    }
    _calculateGracePeriod() {
        if (this.type !== "mainnet")
            return null;
        const gracePeriod = new Date(this.expiresAt || "");
        gracePeriod.setDate(gracePeriod.getDate() + 30);
        return gracePeriod;
    }
    _timeRemaining() {
        if (!this.expiresAt)
            return 0;
        const expiresAtTime = new Date(this.expiresAt || "").getTime();
        return expiresAtTime - Date.now();
    }
    timeLeftInGracePeriodSeconds() {
        if (this.type !== "mainnet" || !this.gracePeriod)
            return 0;
        const now = new Date().getTime();
        const gracePeriodEnd = this.gracePeriod.getTime();
        return Math.max(0, Math.floor((gracePeriodEnd - now) / 1000));
    }
}
class TagModel {
    constructor(data = {}) {
        this.available = false;
        this.pgp = { encryptedMessage: "", privateKey: "" };
        if (data instanceof TagModel) {
            this._id = data._id;
            this.available = data.available;
            this.hasPassword = data.hasPassword;
            this.image = data.image;
            this.metadata = data.metadata;
            this.name = data.name;
            this.pgp = data.pgp;
            this.publicData = data.publicData;
            this.zelfProof = data.zelfProof;
            this.zelfProofQRCode = data.zelfProofQRCode;
            return;
        }
        this._id = data.id || data._id || "";
        this.available = data.available || false;
        this.hasPassword = Boolean(data.publicData?.hasPassword === "true" || data.hasPassword);
        this.image = data.url || data.zelfProofQRCode || "";
        this.metadata = data.metadata || {};
        this.zelfProof = data.zelfProof || "";
        this.zelfProofQRCode = data.zelfProofQRCode || "";
        this.pgp = data.pgp || { encryptedMessage: "", privateKey: "" };
        // Get the tag name from various possible sources
        const rawTagName = data.tagName || data.name || data.publicData?.tagName || data.publicData?.zelfName || "";
        this.name = rawTagName ? rawTagName.replace(".hold", "") : "";
        // Extract domain from tag name if not explicitly provided
        const extractDomain = (tagName) => {
            if (!tagName)
                return "";
            // Remove .hold suffix first if present
            const cleanTagName = tagName.replace(".hold", "");
            // Split by dots and get the last part as domain
            const parts = cleanTagName.split(".");
            if (parts.length >= 2)
                return parts[parts.length - 1]; // Get the last part (domain)
            return "zelf"; // Default domain
        };
        const explicitDomain = data.domain || data.publicData?.domain;
        const extractedDomain = explicitDomain || extractDomain(rawTagName);
        // Spread raw `publicData` so Pinata/short keys (`dot`, `ksm`, chunk JSON) are visible to
        // readPublicData* in TagPublicDataModel (same pattern as the full search API payload).
        const publicDataSrc = data.publicData && typeof data.publicData === "object" ? { ...data.publicData } : {};
        this.publicData = new TagPublicDataModel({
            ...publicDataSrc,
            avalancheAddress: data.publicData?.avalancheAddress || data.publicData?.ethAddress || "",
            binanceAddress: data.publicData?.binanceAddress || data.publicData?.ethAddress || "",
            blockDAGAddress: data.publicData?.blockDAGAddress || "",
            btcAddress: data.publicData?.btcAddress || "",
            domain: extractedDomain,
            ethAddress: data.publicData?.ethAddress || "",
            expiresAt: data.publicData?.expiresAt || "",
            hasPassword: data.publicData?.hasPassword || "false",
            origin: data.publicData?.origin || "",
            registeredAt: data.publicData?.registeredAt || "",
            solanaAddress: data.publicData?.solanaAddress || "",
            suiAddress: data.publicData?.suiAddress || "",
            tonAddress: data.publicData?.tonAddress || "",
            tagName: rawTagName,
            type: data.publicData?.type || "",
            st: data.publicData?.st || "",
        });
    }
    get displayBtcAddress() {
        return this._parseAddress(this.publicData?.btcAddress);
    }
    get displayEthAddress() {
        return this._parseAddress(this.publicData?.ethAddress);
    }
    get displaySolanaAddress() {
        return this._parseAddress(this.publicData?.solanaAddress);
    }
    get displaySuiAddress() {
        return this._parseAddress(this.publicData?.suiAddress);
    }
    get displayTonAddress() {
        return this._parseAddress(this.publicData?.tonAddress);
    }
    get displayAvalancheAddress() {
        return this._parseAddress(this.publicData?.avalancheAddress);
    }
    get displayBinanceAddress() {
        return this._parseAddress(this.publicData?.binanceAddress);
    }
    get displayBlockDAGAddress() {
        return this._parseAddress(this.publicData?.blockDAGAddress || this.publicData?.ethAddress);
    }
    get displayXlmAddress() {
        return this._parseAddress(this.publicData?.xlmAddress);
    }
    _parseAddress(value) {
        if (!value || value.length <= 16)
            return value;
        const firstPart = value.slice(0, 8);
        const lastPart = value.slice(-8);
        return `${firstPart}...${lastPart}`;
    }
    updatePublicData(data) {
        this.publicData = new TagPublicDataModel({ ...this.publicData, ...data });
    }
    get isExpired() {
        return this.publicData.isExpired;
    }
    get isExpiringSoon() {
        return this.publicData.isExpiringSoon;
    }
    get isFullyExpired() {
        return this.publicData.isFullyExpired;
    }
    get isInGracePeriod() {
        return this.publicData.isInGracePeriod;
    }
    get isHold() {
        return this.publicData?.type === "hold";
    }
    get isMainnet() {
        return this.publicData?.type === "mainnet";
    }
    get domain() {
        const domain = this.publicData?.domain;
        if (domain)
            return domain;
        const parts = this.publicData?.tagName.split(".");
        if (parts.length >= 2)
            return parts[parts.length - 1];
        return "zelf";
    }
    get tagName() {
        let tagName = this.publicData?.tagName || this.name;
        if (tagName.includes(this.publicData.domain))
            tagName = tagName.split(".")[0];
        return tagName;
    }
    get fullTagName() {
        const fullTagName = this.publicData.tagName || this.name;
        if (fullTagName.includes(this.publicData.domain))
            return fullTagName.replace(".hold", "");
        return `${fullTagName}.${this.publicData.domain}`;
    }
}


/***/ },

/***/ "./shared/utils/evm-chain-key.util.ts"
/*!********************************************!*\
  !*** ./shared/utils/evm-chain-key.util.ts ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CHAIN_KEY_BY_CHAIN_ID: () => (/* binding */ CHAIN_KEY_BY_CHAIN_ID),
/* harmony export */   STRICT_PROTECTED_RPC_CHAIN_KEYS: () => (/* binding */ STRICT_PROTECTED_RPC_CHAIN_KEYS),
/* harmony export */   allowDirectFallbackForChainId: () => (/* binding */ allowDirectFallbackForChainId),
/* harmony export */   allowDirectFallbackForChainKey: () => (/* binding */ allowDirectFallbackForChainKey),
/* harmony export */   getChainKeyFromChainId: () => (/* binding */ getChainKeyFromChainId)
/* harmony export */ });
/**
 * Maps EVM chainId values to backend RPC proxy path keys (`/api/protected/rpc/:chainKey` and `/api/rpc/:chainKey`).
 */
const CHAIN_KEY_BY_CHAIN_ID = {
    1: "ethereum",
    10: "optimism",
    56: "bsc",
    137: "polygon",
    8453: "base",
    42161: "arbitrum",
    43114: "avalanche",
    1404: "blockdag",
};
function getChainKeyFromChainId(chainId) {
    if (!Number.isFinite(chainId))
        return null;
    return CHAIN_KEY_BY_CHAIN_ID[chainId] ?? null;
}
/**
 * Chains where asset sends must use JWT + `/api/protected/rpc/:chainKey` (no silent direct RPC fallback).
 * Aligns with server `EXTENSION_*_RPC_URL` tracking.
 */
const STRICT_PROTECTED_RPC_CHAIN_KEYS = new Set(["ethereum", "bsc", "polygon", "avalanche"]);
/** When `false`, RpcProviderService must not fall back to direct env RPC (session required). */
function allowDirectFallbackForChainKey(chainKey) {
    return !STRICT_PROTECTED_RPC_CHAIN_KEYS.has(chainKey);
}
/** Unknown chainIds stay permissive so other flows keep optional fallback. */
function allowDirectFallbackForChainId(chainId) {
    const key = getChainKeyFromChainId(chainId);
    if (!key)
        return true;
    return allowDirectFallbackForChainKey(key);
}


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
/*!******************************************!*\
  !*** ./background-scripts/background.ts ***!
  \******************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webextension-polyfill */ "./node_modules/webextension-polyfill/dist/browser-polyfill.js");
/* harmony import */ var webextension_polyfill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webextension_polyfill__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @extension-scripts/logger/logger.class */ "./extension-scripts/logger/logger.class.ts");
/* harmony import */ var _services_browser_api_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services/browser-api-util */ "./background-scripts/services/browser-api-util.ts");
/* harmony import */ var _services_message_handler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./services/message-handler */ "./background-scripts/services/message-handler.ts");
/* harmony import */ var _services_dapp_handler__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./services/dapp-handler */ "./background-scripts/services/dapp-handler.ts");
/* harmony import */ var _services_extension_lifecycle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./services/extension-lifecycle */ "./background-scripts/services/extension-lifecycle.ts");






const browserApi = new _services_browser_api_util__WEBPACK_IMPORTED_MODULE_2__.BrowserApiUtil();
const extensionLifecycle = new _services_extension_lifecycle__WEBPACK_IMPORTED_MODULE_5__.ExtensionLifecycle(browserApi);
extensionLifecycle.initialize();
const messageHandler = _services_message_handler__WEBPACK_IMPORTED_MODULE_3__.MessageHandler.getInstance(browserApi);
const dappHandler = _services_dapp_handler__WEBPACK_IMPORTED_MODULE_4__.DappHandler.getInstance(browserApi);
void dappHandler.restorePendingRequests();
if (!browserApi.has("runtime")) {
    _extension_scripts_logger_logger_class__WEBPACK_IMPORTED_MODULE_1__.Logger.error("Runtime API not available - extension cannot function");
    throw new Error("Runtime API not available");
}
browserApi.addMessageListener((message, sender, sendResponse) => {
    if (message.type && message.type.startsWith("DAPP_")) {
        dappHandler.handleDappMessage(message, sender, sendResponse);
        return true;
    }
    if (message.type && message.type.startsWith("WC_")) {
        return false;
    }
    messageHandler.handleAutofillMessage(message, sender, sendResponse);
    return true;
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNU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QUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO0lBQzdCLDBFQUFNLENBQUMsS0FBSyxDQUFDLHVEQUF1RCxDQUFDLENBQUM7SUFFdEUsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ2pELENBQUM7QUFFRCxVQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxFQUFFO0lBQzVELElBQUksT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1FBQ25ELFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzdELE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUNqRCxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsY0FBYyxDQUFDLHFCQUFxQixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDcEUsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly96ZWxmLWV4dGVuc2lvbi8uL2JhY2tncm91bmQtc2NyaXB0cy9zZXJ2aWNlcy9iYWNrZ3JvdW5kLWNyZWRlbnRpYWwtbWFuYWdlci50cyIsIndlYnBhY2s6Ly96ZWxmLWV4dGVuc2lvbi8uL2JhY2tncm91bmQtc2NyaXB0cy9zZXJ2aWNlcy9icm93c2VyLWFwaS11dGlsLnRzIiwid2VicGFjazovL3plbGYtZXh0ZW5zaW9uLy4vYmFja2dyb3VuZC1zY3JpcHRzL3NlcnZpY2VzL2RhcHAtaGFuZGxlci50cyIsIndlYnBhY2s6Ly96ZWxmLWV4dGVuc2lvbi8uL2JhY2tncm91bmQtc2NyaXB0cy9zZXJ2aWNlcy9leHRlbnNpb24tbGlmZWN5Y2xlLnRzIiwid2VicGFjazovL3plbGYtZXh0ZW5zaW9uLy4vYmFja2dyb3VuZC1zY3JpcHRzL3NlcnZpY2VzL21lc3NhZ2UtaGFuZGxlci50cyIsIndlYnBhY2s6Ly96ZWxmLWV4dGVuc2lvbi8uL2V4dGVuc2lvbi1zY3JpcHRzL2Vudmlyb25tZW50cy9lbnZpcm9ubWVudC5kZXYudHMiLCJ3ZWJwYWNrOi8vemVsZi1leHRlbnNpb24vLi9leHRlbnNpb24tc2NyaXB0cy9sb2dnZXIvbG9nZ2VyLmNsYXNzLnRzIiwid2VicGFjazovL3plbGYtZXh0ZW5zaW9uLy4vc2hhcmVkL3NlcnZpY2VzL2RhcHAtbWFwcGluZy5zZXJ2aWNlLnRzIiwid2VicGFjazovL3plbGYtZXh0ZW5zaW9uLy4vc2hhcmVkL3R5cGVzL2RhcHAudHlwZXMudHMiLCJ3ZWJwYWNrOi8vemVsZi1leHRlbnNpb24vLi9zaGFyZWQvdHlwZXMvdGFnLnR5cGVzLnRzIiwid2VicGFjazovL3plbGYtZXh0ZW5zaW9uLy4vc2hhcmVkL3V0aWxzL2V2bS1jaGFpbi1rZXkudXRpbC50cyIsIndlYnBhY2s6Ly96ZWxmLWV4dGVuc2lvbi8uL25vZGVfbW9kdWxlcy93ZWJleHRlbnNpb24tcG9seWZpbGwvZGlzdC9icm93c2VyLXBvbHlmaWxsLmpzIiwid2VicGFjazovL3plbGYtZXh0ZW5zaW9uL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3plbGYtZXh0ZW5zaW9uL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3plbGYtZXh0ZW5zaW9uL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly96ZWxmLWV4dGVuc2lvbi93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3plbGYtZXh0ZW5zaW9uL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vemVsZi1leHRlbnNpb24vLi9iYWNrZ3JvdW5kLXNjcmlwdHMvYmFja2dyb3VuZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCcm93c2VyQXBpVXRpbCB9IGZyb20gXCIuL2Jyb3dzZXItYXBpLXV0aWxcIjtcbmltcG9ydCB7IFRhZ01vZGVsIH0gZnJvbSBcIkBzaGFyZWQvdHlwZXMvdGFnLnR5cGVzXCI7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi4vLi4vZXh0ZW5zaW9uLXNjcmlwdHMvbG9nZ2VyL2xvZ2dlci5jbGFzc1wiO1xuaW1wb3J0IHsgZW52aXJvbm1lbnQgfSBmcm9tIFwiLi4vLi4vZXh0ZW5zaW9uLXNjcmlwdHMvZW52aXJvbm1lbnRzL2Vudmlyb25tZW50XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFzc3dvcmRQdWJsaWNEYXRhIHtcbiAgICBjYXRlZ29yeTogc3RyaW5nO1xuICAgIGZvbGRlcj86IHN0cmluZztcbiAgICBrZXlPd25lcjogc3RyaW5nO1xuICAgIHRpbWVzdGFtcDogc3RyaW5nO1xuICAgIHR5cGU6IHN0cmluZztcbiAgICB1c2VybmFtZT86IHN0cmluZztcbiAgICB3ZWJzaXRlPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBhc3N3b3JkSXRlbSB7XG4gICAgaWQ6IHN0cmluZztcbiAgICBjaWQ6IHN0cmluZztcbiAgICB1cmw6IHN0cmluZztcbiAgICBwdWJsaWNEYXRhOiBQYXNzd29yZFB1YmxpY0RhdGE7XG4gICAgemVsZlByb29mUVJDb2RlPzogc3RyaW5nO1xuICAgIHplbGZQcm9vZj86IHN0cmluZztcbiAgICBjcmVhdGVkQXQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBaZWxmS2V5c0xpc3RSZXNwb25zZSB7XG4gICAgZGF0YToge1xuICAgICAgICBzdWNjZXNzOiBib29sZWFuO1xuICAgICAgICBtZXNzYWdlOiBzdHJpbmc7XG4gICAgICAgIGNhdGVnb3J5OiBzdHJpbmc7XG4gICAgICAgIGRhdGE6IFBhc3N3b3JkSXRlbVtdO1xuICAgICAgICB0aW1lc3RhbXA6IHN0cmluZztcbiAgICAgICAgZnVsbFRhZ05hbWU6IHN0cmluZztcbiAgICAgICAgc2VhcmNoQ2F0ZWdvcnk6IHN0cmluZztcbiAgICAgICAgdG90YWxDb3VudDogbnVtYmVyO1xuICAgIH07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFzc3dvcmRFbnRyeSB7XG4gICAgaWQ6IHN0cmluZztcbiAgICB3ZWJzaXRlPzogc3RyaW5nO1xuICAgIGRvbWFpbj86IHN0cmluZztcbiAgICB1cmw/OiBzdHJpbmc7XG4gICAgbmFtZT86IHN0cmluZztcbiAgICB1c2VybmFtZT86IHN0cmluZztcbiAgICBwdWJsaWNEYXRhPzogUGFzc3dvcmRQdWJsaWNEYXRhO1xuICAgIGNpZD86IHN0cmluZztcbiAgICB6ZWxmUHJvb2ZRUkNvZGU/OiBzdHJpbmc7XG4gICAgemVsZlByb29mPzogc3RyaW5nO1xuICAgIGNyZWF0ZWRBdD86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEZWNyeXB0ZWRQYXNzd29yZERhdGEge1xuICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIHVzZXJuYW1lOiBzdHJpbmc7XG4gICAgICAgIHBhc3N3b3JkOiBzdHJpbmc7XG4gICAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIEJhY2tncm91bmRDcmVkZW50aWFsTWFuYWdlciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBBUElfQkFTRV9VUkwgPSBlbnZpcm9ubWVudC5hcGlCYXNlVXJsO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgWkVMRl9LRVlTX1JPVVRFID0gYC9hcGkvemVsZi1rZXlzYDtcblxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBCYWNrZ3JvdW5kQ3JlZGVudGlhbE1hbmFnZXI7XG5cbiAgICBwcml2YXRlIF9hY2Nlc3NUb2tlbjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gICAgcHJpdmF0ZSBfYWNjZXNzVG9rZW5FeHBpcnk6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZShicm93c2VyQXBpPzogQnJvd3NlckFwaVV0aWwpOiBCYWNrZ3JvdW5kQ3JlZGVudGlhbE1hbmFnZXIge1xuICAgICAgICBpZiAoIUJhY2tncm91bmRDcmVkZW50aWFsTWFuYWdlci5pbnN0YW5jZSkge1xuICAgICAgICAgICAgQmFja2dyb3VuZENyZWRlbnRpYWxNYW5hZ2VyLmluc3RhbmNlID0gbmV3IEJhY2tncm91bmRDcmVkZW50aWFsTWFuYWdlcihicm93c2VyQXBpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBCYWNrZ3JvdW5kQ3JlZGVudGlhbE1hbmFnZXIuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBicm93c2VyQXBpPzogQnJvd3NlckFwaVV0aWwpIHtcbiAgICAgICAgdGhpcy5sb2FkQWNjZXNzVG9rZW5Gcm9tU3RvcmFnZSgpLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiRXJyb3IgbG9hZGluZyBKV1QgZnJvbSBzdG9yYWdlIGluIGNvbnN0cnVjdG9yOlwiLCBlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvYWQgSldUIGZyb20gc3RvcmFnZSAocmVwbGljYXRpbmcgQW5ndWxhciBzZXJ2aWNlIGJlaGF2aW9yKVxuICAgICAqIE5vdGU6IFVzZXMgYWNjZXNzVG9rZW5FeHBpcmVzQXQgKFVuaXggdGltZXN0YW1wKSB0byBtYXRjaCBBdXRoU2VydmljZVxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgbG9hZEFjY2Vzc1Rva2VuRnJvbVN0b3JhZ2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodGhpcy5icm93c2VyQXBpPy5oYXMoXCJzdG9yYWdlXCIpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgKHRoaXMuYnJvd3NlckFwaS5zdG9yYWdlIGFzIGFueSkubG9jYWwuZ2V0KFtcImFjY2Vzc1Rva2VuXCIsIFwiYWNjZXNzVG9rZW5FeHBpcmVzQXRcIiwgXCJhY2Nlc3NUb2tlbkV4cGlyeVwiXSk7XG5cbiAgICAgICAgICAgICAgICAvLyBTdXBwb3J0IGJvdGggbmFtaW5nIGNvbnZlbnRpb25zIGZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG4gICAgICAgICAgICAgICAgdGhpcy5fYWNjZXNzVG9rZW4gPSByZXN1bHQuYWNjZXNzVG9rZW4gfHwgbnVsbDtcbiAgICAgICAgICAgICAgICBjb25zdCBleHBpcmVzQXQgPSByZXN1bHQuYWNjZXNzVG9rZW5FeHBpcmVzQXQgfHwgcmVzdWx0LmFjY2Vzc1Rva2VuRXhwaXJ5IHx8IG51bGw7XG5cbiAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IFVuaXggdGltZXN0YW1wIHRvIG1pbGxpc2Vjb25kcyBpZiBuZWVkZWQsIG9yIHVzZSBhcy1pcyBpZiBhbHJlYWR5IGluIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgICAgIGlmIChleHBpcmVzQXQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgZXhwaXJlc0F0IGlzIGEgVW5peCB0aW1lc3RhbXAgKHNlY29uZHMpLCBjb252ZXJ0IHRvIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgICAgICAgICAvLyBVbml4IHRpbWVzdGFtcHMgYXJlIHR5cGljYWxseSAxMCBkaWdpdHMsIG1pbGxpc2Vjb25kcyBhcmUgMTMgZGlnaXRzXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FjY2Vzc1Rva2VuRXhwaXJ5ID0gZXhwaXJlc0F0IDwgMWUxMiA/IGV4cGlyZXNBdCAqIDEwMDAgOiBleHBpcmVzQXQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWNjZXNzVG9rZW5FeHBpcnkgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzVG9rZW5FeHBpcmVkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhckV4cGlyZWRUb2tlbigpO1xuXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuc2V0QWNjZXNzVG9rZW5Ub1N0b3JhZ2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIExvZ2dlci5lcnJvcihcIlN0b3JhZ2UgQVBJIG5vdCBhdmFpbGFibGUgdGhyb3VnaCBCcm93c2VyQXBpVXRpbFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIExvZ2dlci5lcnJvcihcIkVycm9yIGxvYWRpbmcgSldUIGZyb20gc3RvcmFnZTpcIiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2F2ZSBKV1QgdG8gc3RvcmFnZSAocmVwbGljYXRpbmcgQW5ndWxhciBzZXJ2aWNlIGJlaGF2aW9yKVxuICAgICAqIE5vdGU6IFVzZXMgYWNjZXNzVG9rZW5FeHBpcmVzQXQgKFVuaXggdGltZXN0YW1wKSB0byBtYXRjaCBBdXRoU2VydmljZVxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgc2V0QWNjZXNzVG9rZW5Ub1N0b3JhZ2UoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodGhpcy5icm93c2VyQXBpPy5oYXMoXCJzdG9yYWdlXCIpKSB7XG4gICAgICAgICAgICAgICAgLy8gQ29udmVydCBtaWxsaXNlY29uZHMgdG8gVW5peCB0aW1lc3RhbXAgKHNlY29uZHMpIHRvIG1hdGNoIEF1dGhTZXJ2aWNlIGZvcm1hdFxuICAgICAgICAgICAgICAgIGNvbnN0IGV4cGlyZXNBdCA9IHRoaXMuX2FjY2Vzc1Rva2VuRXhwaXJ5ID8gTWF0aC5mbG9vcih0aGlzLl9hY2Nlc3NUb2tlbkV4cGlyeSAvIDEwMDApIDogbnVsbDtcblxuICAgICAgICAgICAgICAgIGF3YWl0ICh0aGlzLmJyb3dzZXJBcGkuc3RvcmFnZSBhcyBhbnkpLmxvY2FsLnNldCh7XG4gICAgICAgICAgICAgICAgICAgIGFjY2Vzc1Rva2VuOiB0aGlzLl9hY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgYWNjZXNzVG9rZW5FeHBpcmVzQXQ6IGV4cGlyZXNBdCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiU3RvcmFnZSBBUEkgbm90IGF2YWlsYWJsZSB0aHJvdWdoIEJyb3dzZXJBcGlVdGlsXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiRXJyb3Igc2F2aW5nIEpXVCB0byBzdG9yYWdlOlwiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZ2V0QWNjZXNzVG9rZW4oKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgICAgIC8vIEFsd2F5cyByZWZyZXNoIGZyb20gc3RvcmFnZSBmaXJzdCBzbyB0aGUgYmFja2dyb3VuZCBwaWNrcyB1cCBhbnkgdG9rZW4gdGhlXG4gICAgICAgIC8vIG1haW4gYXBwIG9yIHBvcG91dCBtYXkgaGF2ZSBqdXN0IHdyaXR0ZW4gKGUuZy4gYWZ0ZXIgcmVhdXRoZW50aWNhdGVTZXNzaW9uKS5cbiAgICAgICAgLy8gV2l0aG91dCB0aGlzLCB0aGUgYmFja2dyb3VuZCdzIGluLW1lbW9yeSB0b2tlbiBjYW4gcmFjZSBhaGVhZCBvZiBzdG9yYWdlIGFuZFxuICAgICAgICAvLyBjYXVzZSBKV1QvaWRlbnRpZmllciBtaXNtYXRjaGVzIHdpdGggdGhlIHBvcG91dCdzIFBHUCBzZXNzaW9uIGtleS5cbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkQWNjZXNzVG9rZW5Gcm9tU3RvcmFnZSgpO1xuXG4gICAgICAgIGlmICh0aGlzLmhhc1ZhbGlkVG9rZW4oKSkgcmV0dXJuIHRoaXMuX2FjY2Vzc1Rva2VuO1xuXG4gICAgICAgIGNvbnN0IHNlc3Npb25SZXN1bHQgPSBhd2FpdCB0aGlzLmluaXRTZXNzaW9uKCk7XG5cbiAgICAgICAgcmV0dXJuIHNlc3Npb25SZXN1bHQ/LmRhdGE/LnRva2VuIHx8IG51bGw7XG4gICAgfVxuXG4gICAgcHVibGljIGNsZWFyQWNjZXNzVG9rZW4oKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2FjY2Vzc1Rva2VuID0gbnVsbDtcbiAgICAgICAgdGhpcy5fYWNjZXNzVG9rZW5FeHBpcnkgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuc2V0QWNjZXNzVG9rZW5Ub1N0b3JhZ2UoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaXNBdXRoZW50aWNhdGVkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IGF3YWl0IHRoaXMuZ2V0QWNjZXNzVG9rZW4oKTtcblxuICAgICAgICByZXR1cm4gISFhY2Nlc3NUb2tlbjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzVG9rZW5FeHBpcmVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISEodGhpcy5fYWNjZXNzVG9rZW4gJiYgdGhpcy5fYWNjZXNzVG9rZW5FeHBpcnkgJiYgRGF0ZS5ub3coKSA+PSB0aGlzLl9hY2Nlc3NUb2tlbkV4cGlyeSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYXNWYWxpZFRva2VuKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gISEodGhpcy5fYWNjZXNzVG9rZW4gJiYgdGhpcy5fYWNjZXNzVG9rZW5FeHBpcnkgJiYgRGF0ZS5ub3coKSA8IHRoaXMuX2FjY2Vzc1Rva2VuRXhwaXJ5KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNsZWFyRXhwaXJlZFRva2VuKCk6IHZvaWQge1xuICAgICAgICB0aGlzLl9hY2Nlc3NUb2tlbiA9IG51bGw7XG4gICAgICAgIHRoaXMuX2FjY2Vzc1Rva2VuRXhwaXJ5ID0gbnVsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGZpbHRlclBhc3N3b3Jkc0J5V2Vic2l0ZShkYXRhOiBQYXNzd29yZEl0ZW1bXSwgd2Vic2l0ZTogc3RyaW5nKTogUGFzc3dvcmRFbnRyeVtdIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgICAgICBMb2dnZXIud2FybihcImZpbHRlclBhc3N3b3Jkc0J5V2Vic2l0ZTogZGF0YSBpcyBub3QgYW4gYXJyYXlcIiwgZGF0YSk7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YVxuICAgICAgICAgICAgLmZpbHRlcigocGFzc3dvcmQpID0+IHBhc3N3b3JkLnB1YmxpY0RhdGE/LnR5cGUgPT09IFwicGFzc3dvcmRcIiAmJiB0aGlzLm1hdGNoZXNXZWJzaXRlKHBhc3N3b3JkLCB3ZWJzaXRlKSlcbiAgICAgICAgICAgIC5tYXAoKHBhc3N3b3JkKSA9PiB0aGlzLm1hcFBhc3N3b3JkSXRlbVRvRW50cnkocGFzc3dvcmQpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIG1hdGNoZXNXZWJzaXRlKHBhc3N3b3JkOiBQYXNzd29yZEl0ZW0sIHdlYnNpdGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXdlYnNpdGUpIHJldHVybiB0cnVlO1xuXG4gICAgICAgIGNvbnN0IHRhcmdldERvbWFpbiA9IHdlYnNpdGUucmVwbGFjZSgvXmh0dHBzPzpcXC9cXC8vLCBcIlwiKS5yZXBsYWNlKC9ed3d3XFwuLywgXCJcIik7XG4gICAgICAgIGNvbnN0IHBhc3N3b3JkV2Vic2l0ZSA9IHBhc3N3b3JkLnB1YmxpY0RhdGE/LndlYnNpdGU7XG5cbiAgICAgICAgaWYgKCFwYXNzd29yZFdlYnNpdGUpIHJldHVybiBmYWxzZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGFzc3dvcmREb21haW4gPSBuZXcgVVJMKHBhc3N3b3JkV2Vic2l0ZSkuaG9zdG5hbWU7XG5cbiAgICAgICAgICAgIHJldHVybiBwYXNzd29yZERvbWFpbiA9PT0gdGFyZ2V0RG9tYWluIHx8IHBhc3N3b3JkV2Vic2l0ZS5pbmNsdWRlcyh0YXJnZXREb21haW4pIHx8IHBhc3N3b3JkV2Vic2l0ZSA9PT0gdGFyZ2V0RG9tYWluO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybiBwYXNzd29yZFdlYnNpdGUuaW5jbHVkZXModGFyZ2V0RG9tYWluKSB8fCBwYXNzd29yZFdlYnNpdGUgPT09IHRhcmdldERvbWFpbjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgbWFwUGFzc3dvcmRJdGVtVG9FbnRyeShpdGVtOiBQYXNzd29yZEl0ZW0pOiBQYXNzd29yZEVudHJ5IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiBpdGVtLmlkLFxuICAgICAgICAgICAgY2lkOiBpdGVtLmNpZCxcbiAgICAgICAgICAgIHVybDogaXRlbS51cmwsXG4gICAgICAgICAgICB3ZWJzaXRlOiBpdGVtLnB1YmxpY0RhdGE/LndlYnNpdGUsXG4gICAgICAgICAgICB1c2VybmFtZTogaXRlbS5wdWJsaWNEYXRhPy51c2VybmFtZSxcbiAgICAgICAgICAgIHB1YmxpY0RhdGE6IGl0ZW0ucHVibGljRGF0YSxcbiAgICAgICAgICAgIHplbGZQcm9vZlFSQ29kZTogaXRlbS56ZWxmUHJvb2ZRUkNvZGUsXG4gICAgICAgICAgICB6ZWxmUHJvb2Y6IGl0ZW0uemVsZlByb29mLFxuICAgICAgICAgICAgY3JlYXRlZEF0OiBpdGVtLmNyZWF0ZWRBdCxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgaW5pdFNlc3Npb24oKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgaWYgKHRoaXMuaGFzVmFsaWRUb2tlbigpKSByZXR1cm4geyBkYXRhOiB7IHRva2VuOiB0aGlzLl9hY2Nlc3NUb2tlbiB9IH07XG5cbiAgICAgICAgY29uc3QgeyB3YWxsZXQgfSA9IGF3YWl0IHRoaXMuZ2V0QWxsV2FsbGV0c0Zyb21TdG9yYWdlKCk7XG5cbiAgICAgICAgaWYgKCF3YWxsZXQ/LnB1YmxpY0RhdGE/LmV0aEFkZHJlc3MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHdhbGxldCBmb3VuZCBpbiBzdG9yYWdlIC0gdXNlciBuZWVkcyB0byBhdXRoZW50aWNhdGUgZmlyc3RcIik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0YWdOYW1lID0gd2FsbGV0LnRhZ05hbWUgfHwgd2FsbGV0Lm5hbWUgfHwgbnVsbDtcbiAgICAgICAgY29uc3QgZG9tYWluID0gd2FsbGV0LmRvbWFpbiB8fCBcInplbGZcIjtcblxuICAgICAgICAvLyBQcmVmZXIgdGhlIGNhbm9uaWNhbCBzZXNzaW9uIGlkZW50aWZpZXIgcGVyc2lzdGVkIGJ5IHRoZSBpbi1hcHAgQXV0aFNlcnZpY2VcbiAgICAgICAgLy8gKGEgZGV2aWNlLWZpbmdlcnByaW50IGhhc2gpLiBUaGlzIGtlZXBzIHRoZSBKV1QgaWRlbnRpZmllciBhbGlnbmVkIHdpdGggdGhlXG4gICAgICAgIC8vIFBHUCBzZXNzaW9uIGtleSB0aGUgcG9wb3V0IHVzZXMgdG8gZW5jcnlwdCByZXF1ZXN0cy4gT25seSBmYWxsIGJhY2sgdG8gdGhlXG4gICAgICAgIC8vIHdhbGxldCdzIGZ1bGwgdGFnIG5hbWUgaWYgdGhlIG1haW4gYXBwIGhhcyBuZXZlciBib290ZWQgeWV0IOKAlCBhbmQgd2FybiBzbyB3ZVxuICAgICAgICAvLyBjYW4gY2F0Y2ggb3JkZXJpbmcgaXNzdWVzLlxuICAgICAgICBsZXQgaWRlbnRpZmllcjogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmJyb3dzZXJBcGk/LmhhcyhcInN0b3JhZ2VcIikpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdG9yZWQgPSBhd2FpdCAodGhpcy5icm93c2VyQXBpLnN0b3JhZ2UgYXMgYW55KS5sb2NhbC5nZXQoW1wic2Vzc2lvbklkZW50aWZpZXJcIl0pO1xuICAgICAgICAgICAgICAgIGlkZW50aWZpZXIgPSBzdG9yZWQ/LnNlc3Npb25JZGVudGlmaWVyIHx8IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBMb2dnZXIud2FybihcIkNvdWxkIG5vdCByZWFkIHNlc3Npb25JZGVudGlmaWVyIGZyb20gc3RvcmFnZTpcIiwgZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpZGVudGlmaWVyKSB7XG4gICAgICAgICAgICBpZGVudGlmaWVyID0gd2FsbGV0LmZ1bGxUYWdOYW1lIHx8IHdhbGxldC5wdWJsaWNEYXRhPy5ldGhBZGRyZXNzIHx8IG51bGw7XG5cbiAgICAgICAgICAgIExvZ2dlci53YXJuKFxuICAgICAgICAgICAgICAgIFwiQmFja2dyb3VuZENyZWRlbnRpYWxNYW5hZ2VyLmluaXRTZXNzaW9uOiBzZXNzaW9uSWRlbnRpZmllciBtaXNzaW5nIGluIHN0b3JhZ2UsIGZhbGxpbmcgYmFjayB0byB3YWxsZXQgdGFnIGlkZW50aWZpZXJcIixcbiAgICAgICAgICAgICAgICB7IGZhbGxiYWNrSWRlbnRpZmllcjogaWRlbnRpZmllciB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXJsID0gYCR7dGhpcy5BUElfQkFTRV9VUkx9L2FwaS9zZXNzaW9uc2A7XG4gICAgICAgIGNvbnN0IHBheWxvYWQ6IGFueSA9IHtcbiAgICAgICAgICAgIGFkZHJlc3M6IHdhbGxldC5wdWJsaWNEYXRhLmV0aEFkZHJlc3MsXG4gICAgICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyIHx8IHdhbGxldC5wdWJsaWNEYXRhLmV0aEFkZHJlc3MsIC8vIEZhbGxiYWNrIHRvIGV0aEFkZHJlc3MgaWYgbm8gaWRlbnRpZmllclxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0YWdOYW1lKSBwYXlsb2FkLnRhZ05hbWUgPSB0YWdOYW1lO1xuICAgICAgICBpZiAoZG9tYWluKSBwYXlsb2FkLmRvbWFpbiA9IGRvbWFpbjtcblxuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXlsb2FkKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBTZXNzaW9uIGluaXRpYWxpemF0aW9uIGZhaWxlZDogJHtyZXNwb25zZS5zdGF0dXN9ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgICAgICBpZiAocmVzcG9uc2VEYXRhPy5kYXRhPy50b2tlbikge1xuICAgICAgICAgICAgLy8gSGFuZGxlIGJvdGggVW5peCB0aW1lc3RhbXAgKHNlY29uZHMpIGFuZCBtaWxsaXNlY29uZHMgZm9ybWF0c1xuICAgICAgICAgICAgY29uc3QgZXhwaXJlc0F0ID0gcmVzcG9uc2VEYXRhLmRhdGEuZXhwaXJlc0F0O1xuXG4gICAgICAgICAgICBpZiAoZXhwaXJlc0F0KSB7XG4gICAgICAgICAgICAgICAgLy8gSWYgZXhwaXJlc0F0IGlzIGEgVW5peCB0aW1lc3RhbXAgKHNlY29uZHMpLCBjb252ZXJ0IHRvIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgICAgIHRoaXMuX2FjY2Vzc1Rva2VuRXhwaXJ5ID0gZXhwaXJlc0F0IDwgMWUxMiA/IGV4cGlyZXNBdCAqIDEwMDAgOiBleHBpcmVzQXQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIERlZmF1bHQgdG8gMjQgaG91cnMgaWYgbm90IHByb3ZpZGVkXG4gICAgICAgICAgICAgICAgdGhpcy5fYWNjZXNzVG9rZW5FeHBpcnkgPSBEYXRlLm5vdygpICsgMjQgKiA2MCAqIDYwICogMTAwMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fYWNjZXNzVG9rZW4gPSByZXNwb25zZURhdGEuZGF0YS50b2tlbjtcblxuICAgICAgICAgICAgYXdhaXQgdGhpcy5zZXRBY2Nlc3NUb2tlblRvU3RvcmFnZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlRGF0YTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYWxsIHdhbGxldHMgZnJvbSBzdG9yYWdlIChyZXBsaWNhdGluZyBnZXRBbGxXYWxsZXRzRnJvbVN0b3JhZ2UgZnJvbSBBbmd1bGFyIHNlcnZpY2UpXG4gICAgICogTWF0Y2hlcyB0aGUgcGF0dGVybiBmcm9tIFdhbGxldFNlcnZpY2UuZ2V0QWxsV2FsbGV0c0Zyb21TdG9yYWdlKClcbiAgICAgKiBVc2VzIFRhZ01vZGVsIGZvciBjb25zaXN0ZW50IGRhdGEgc3RydWN0dXJlXG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBnZXRBbGxXYWxsZXRzRnJvbVN0b3JhZ2UoKTogUHJvbWlzZTx7IHdhbGxldDogVGFnTW9kZWwgfCBudWxsOyB3YWxsZXRzOiBUYWdNb2RlbFtdIH0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5icm93c2VyQXBpPy5oYXMoXCJzdG9yYWdlXCIpKSByZXR1cm4geyB3YWxsZXQ6IG51bGwsIHdhbGxldHM6IFtdIH07XG5cbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0ICh0aGlzLmJyb3dzZXJBcGkuc3RvcmFnZSBhcyBhbnkpLmxvY2FsLmdldChbXCJ3YWxsZXRcIiwgXCJ3YWxsZXRzXCJdKTtcblxuICAgICAgICAgICAgLy8gQ29udmVydCByYXcgZGF0YSB0byBUYWdNb2RlbCBpbnN0YW5jZXNcbiAgICAgICAgICAgIGNvbnN0IHdhbGxldCA9IHJlc3VsdC53YWxsZXQgPyBuZXcgVGFnTW9kZWwocmVzdWx0LndhbGxldCkgOiBudWxsO1xuICAgICAgICAgICAgY29uc3Qgd2FsbGV0cyA9IChyZXN1bHQud2FsbGV0cyB8fCBbXSkubWFwKCh3OiBhbnkpID0+IG5ldyBUYWdNb2RlbCh3KSk7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHdhbGxldCBoYXMgdmFsaWQgcHVibGljRGF0YSB3aXRoIGV0aEFkZHJlc3MgKG1hdGNoaW5nIFdhbGxldFNlcnZpY2UgcGF0dGVybilcbiAgICAgICAgICAgIGlmICghd2FsbGV0Py5wdWJsaWNEYXRhPy5ldGhBZGRyZXNzICYmICF3YWxsZXQ/LnB1YmxpY0RhdGE/LnRhZ05hbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXdhbGxldHMubGVuZ3RoKSByZXR1cm4geyB3YWxsZXQsIHdhbGxldHM6IFtdIH07XG5cbiAgICAgICAgICAgICAgICAvLyBTZXQgZmlyc3Qgd2FsbGV0IGFzIGN1cnJlbnQgaWYgbm8gY3VycmVudCB3YWxsZXRcbiAgICAgICAgICAgICAgICBjb25zdCBmaXJzdFdhbGxldCA9IHdhbGxldHNbMF07XG5cbiAgICAgICAgICAgICAgICBhd2FpdCAodGhpcy5icm93c2VyQXBpLnN0b3JhZ2UgYXMgYW55KS5sb2NhbC5zZXQoeyB3YWxsZXQ6IGZpcnN0V2FsbGV0IH0pO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgd2FsbGV0OiBmaXJzdFdhbGxldCwgd2FsbGV0cyB9O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4geyB3YWxsZXQsIHdhbGxldHMgfTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIExvZ2dlci5lcnJvcihcIkVycm9yIGdldHRpbmcgd2FsbGV0cyBmcm9tIHN0b3JhZ2U6XCIsIGVycm9yKTtcblxuICAgICAgICAgICAgcmV0dXJuIHsgd2FsbGV0OiBudWxsLCB3YWxsZXRzOiBbXSB9O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGxpc3RTdG9yZWRQYXNzd29yZHMoKTogUHJvbWlzZTxaZWxmS2V5c0xpc3RSZXNwb25zZT4ge1xuICAgICAgICBjb25zdCBhY2Nlc3NUb2tlbiA9IGF3YWl0IHRoaXMuZ2V0QWNjZXNzVG9rZW4oKTtcblxuICAgICAgICBpZiAoIWFjY2Vzc1Rva2VuKSB0aHJvdyBuZXcgRXJyb3IoXCJVbmFibGUgdG8gYXV0aGVudGljYXRlIHdpdGggWmVsZktleSBBUElcIik7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubWFrZUFwaUNhbGwoXCJHRVRcIiwgYCR7dGhpcy5aRUxGX0tFWVNfUk9VVEV9L2xpc3Q/Y2F0ZWdvcnk9cGFzc3dvcmRgKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgZ2V0UGFzc3dvcmRzKHdlYnNpdGU6IHN0cmluZyk6IFByb21pc2U8UGFzc3dvcmRFbnRyeVtdPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMubGlzdFN0b3JlZFBhc3N3b3JkcygpO1xuICAgICAgICAgICAgY29uc3QgZGF0YSA9IHJlc3BvbnNlPy5kYXRhPy5kYXRhIHx8IFtdO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maWx0ZXJQYXNzd29yZHNCeVdlYnNpdGUoZGF0YSwgd2Vic2l0ZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJFcnJvciBnZXR0aW5nIHBhc3N3b3JkczpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWFrZSBBUEkgY2FsbCB3aXRoIGF1dGhlbnRpY2F0aW9uIChyZXBsaWNhdGluZyBIdHRwV3JhcHBlclNlcnZpY2UgYmVoYXZpb3IpXG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBtYWtlQXBpQ2FsbChtZXRob2Q6IHN0cmluZywgZW5kcG9pbnQ6IHN0cmluZywgZGF0YT86IGFueSk6IFByb21pc2U8YW55PiB7XG4gICAgICAgIGNvbnN0IGFjY2Vzc1Rva2VuID0gYXdhaXQgdGhpcy5nZXRBY2Nlc3NUb2tlbigpO1xuXG4gICAgICAgIGlmICghYWNjZXNzVG9rZW4pIHRocm93IG5ldyBFcnJvcihcIk5vIHZhbGlkIEpXVCB0b2tlbiBhdmFpbGFibGVcIik7XG5cbiAgICAgICAgY29uc3QgdXJsID0gYCR7dGhpcy5BUElfQkFTRV9VUkx9JHtlbmRwb2ludH1gO1xuXG4gICAgICAgIGNvbnN0IG9wdGlvbnM6IFJlcXVlc3RJbml0ID0ge1xuICAgICAgICAgICAgbWV0aG9kLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHthY2Nlc3NUb2tlbn1gLFxuICAgICAgICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoZGF0YSAmJiAobWV0aG9kID09PSBcIlBPU1RcIiB8fCBtZXRob2QgPT09IFwiUFVUXCIpKSB7XG4gICAgICAgICAgICBvcHRpb25zLmJvZHkgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCBvcHRpb25zKTtcblxuICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB0aHJvdyBuZXcgRXJyb3IoYEFQSSBjYWxsIGZhaWxlZDogJHtyZXNwb25zZS5zdGF0dXN9ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcblxuICAgICAgICByZXR1cm4gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0b3JlIGEgbmV3IHBhc3N3b3JkXG4gICAgICovXG4gICAgcHVibGljIGFzeW5jIHN0b3JlUGFzc3dvcmQocGFzc3dvcmREYXRhOiBhbnkpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuaW5pdFNlc3Npb24oKTtcblxuICAgICAgICAgICAgY29uc3QgYWNjZXNzVG9rZW4gPSBhd2FpdCB0aGlzLmdldEFjY2Vzc1Rva2VuKCk7XG5cbiAgICAgICAgICAgIGlmICghYWNjZXNzVG9rZW4pIHtcbiAgICAgICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJGYWlsZWQgdG8gaW5pdGlhbGl6ZSBzZXNzaW9uXCIpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMubWFrZUFwaUNhbGwoXCJQT1NUXCIsIGAke3RoaXMuWkVMRl9LRVlTX1JPVVRFfS9zdG9yZS9wYXNzd29yZGAsIHBhc3N3b3JkRGF0YSk7XG5cbiAgICAgICAgICAgIHJldHVybiAhIXJlc3BvbnNlPy5kYXRhO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiRXJyb3Igc3RvcmluZyBwYXNzd29yZDpcIiwgZXJyb3IpO1xuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBCcm93c2VyIH0gZnJvbSBcIndlYmV4dGVuc2lvbi1wb2x5ZmlsbFwiO1xuXG5leHBvcnQgY2xhc3MgQnJvd3NlckFwaVV0aWwge1xuICAgIHByaXZhdGUgX2Nocm9tZTogdHlwZW9mIGNocm9tZSB8IG51bGwgPSBudWxsO1xuICAgIHByaXZhdGUgX2Jyb3dzZXI6IEJyb3dzZXIgfCBudWxsID0gbnVsbDtcbiAgICBwcml2YXRlIF9pc0Nocm9tZSA9IGZhbHNlO1xuICAgIHByaXZhdGUgX2lzQnJvd3NlciA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUFwaXMoKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplQXBpcygpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ2hyb21lQXBpKCk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZUJyb3dzZXJBcGkoKTtcbiAgICB9XG5cbiAgICBnZXQobW9kdWxlTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldENocm9tZU1vZHVsZShtb2R1bGVOYW1lKSB8fCB0aGlzLmdldEJyb3dzZXJNb2R1bGUobW9kdWxlTmFtZSkgfHwgbnVsbDtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiBhIG1vZHVsZSBleGlzdHNcbiAgICBoYXMobW9kdWxlTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldChtb2R1bGVOYW1lKSAhPT0gbnVsbDtcbiAgICB9XG5cbiAgICBnZXQgcnVudGltZSgpIHtcbiAgICAgICAgY29uc3QgcnVudGltZSA9IHRoaXMuZ2V0KFwicnVudGltZVwiKTtcbiAgICAgICAgaWYgKCFydW50aW1lKSByZXR1cm4gbnVsbDtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgLi4ucnVudGltZSxcbiAgICAgICAgICAgIHNlbmRNZXNzYWdlOiAobWVzc2FnZTogYW55LCBjYWxsYmFjaz86IChyZXNwb25zZTogYW55KSA9PiB2b2lkKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlU2VuZE1lc3NhZ2UocnVudGltZSwgbWVzc2FnZSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBHZXQgc3RvcmFnZSBBUElcbiAgICBnZXQgc3RvcmFnZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KFwic3RvcmFnZVwiKTtcbiAgICB9XG5cbiAgICAvLyBHZXQgdGFicyBBUElcbiAgICBnZXQgdGFicygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KFwidGFic1wiKTtcbiAgICB9XG5cbiAgICAvLyBHZXQgd2luZG93cyBBUElcbiAgICBnZXQgd2luZG93cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KFwid2luZG93c1wiKTtcbiAgICB9XG5cbiAgICAvLyBHZXQgbWVudXMgQVBJXG4gICAgZ2V0IG1lbnVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoXCJtZW51c1wiKTtcbiAgICB9XG5cbiAgICAvLyBHZXQgc2lkZVBhbmVsIChDaHJvbWUpIG9yIHNpZGViYXJBY3Rpb24gKEZpcmVmb3gpIC0gdGhlc2UgYXJlIGRpZmZlcmVudCBBUElzXG4gICAgZ2V0IHNpZGVQYW5lbCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzQ2hyb21lKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hyb21lPy5zaWRlUGFuZWw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgZ2V0IHNpZGViYXJBY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc0Jyb3dzZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9icm93c2VyPy5zaWRlYmFyQWN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIEdldCBleHRlbnNpb24gQVBJIChGaXJlZm94IG9ubHkpXG4gICAgZ2V0IGV4dGVuc2lvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzQnJvd3Nlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Jyb3dzZXI/LmV4dGVuc2lvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICAvLyBHZXQgYWN0aW9uIEFQSSAoQ2hyb21lKSBvciBicm93c2VyQWN0aW9uIChGaXJlZm94KVxuICAgIGdldCBhY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLl9pc0Nocm9tZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Nocm9tZT8uYWN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9pc0Jyb3dzZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9icm93c2VyPy5icm93c2VyQWN0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIC8vIENvbnZlbmllbmNlIGdldHRlcnNcbiAgICBnZXQgaXNFeHRlbnNpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc0Nocm9tZSB8fCB0aGlzLl9pc0Jyb3dzZXI7XG4gICAgfVxuXG4gICAgZ2V0IGlzQ2hyb21lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNDaHJvbWU7XG4gICAgfVxuXG4gICAgZ2V0IGlzQnJvd3NlcigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzQnJvd3NlcjtcbiAgICB9XG5cbiAgICAvLyBTbWFydCBzZW5kTWVzc2FnZSB0aGF0IGhhbmRsZXMgYm90aCBDaHJvbWUgYW5kIEZpcmVmb3hcbiAgICBzZW5kTWVzc2FnZShtZXNzYWdlOiBhbnksIGNhbGxiYWNrPzogKHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcbiAgICAgICAgY29uc3QgcnVudGltZSA9IHRoaXMucnVudGltZTtcbiAgICAgICAgaWYgKCFydW50aW1lKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJSdW50aW1lIEFQSSBub3QgYXZhaWxhYmxlXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2lzQ2hyb21lKSB7XG4gICAgICAgICAgICAvLyBDaHJvbWUgdXNlcyBjYWxsYmFja1xuICAgICAgICAgICAgKHJ1bnRpbWUgYXMgYW55KS5zZW5kTWVzc2FnZShtZXNzYWdlLCBjYWxsYmFjayk7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5faXNCcm93c2VyKSB7XG4gICAgICAgICAgICAvLyBGaXJlZm94IHJldHVybnMgUHJvbWlzZVxuICAgICAgICAgICAgcmV0dXJuIChydW50aW1lIGFzIGFueSkuc2VuZE1lc3NhZ2UobWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTbWFydCBhZGRNZXNzYWdlTGlzdGVuZXJcbiAgICBhZGRNZXNzYWdlTGlzdGVuZXIobGlzdGVuZXI6IChtZXNzYWdlOiBhbnksIHNlbmRlcjogYW55LCBzZW5kUmVzcG9uc2U6IChyZXNwb25zZT86IGFueSkgPT4gdm9pZCkgPT4gdm9pZCkge1xuICAgICAgICBjb25zdCBydW50aW1lID0gdGhpcy5nZXQoXCJydW50aW1lXCIpO1xuICAgICAgICBpZiAocnVudGltZSkge1xuICAgICAgICAgICAgKHJ1bnRpbWUgYXMgYW55KS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gU21hcnQgc3RvcmFnZSBvcGVyYXRpb25zXG4gICAgYXN5bmMgZ2V0U3RvcmFnZUl0ZW0oa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3Qgc3RvcmFnZSA9IHRoaXMuc3RvcmFnZSBhcyBhbnk7XG4gICAgICAgIGlmICghc3RvcmFnZT8ubG9jYWwpIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHN0b3JhZ2UubG9jYWwuZ2V0KGtleSk7XG4gICAgICAgIHJldHVybiByZXN1bHRba2V5XTtcbiAgICB9XG5cbiAgICBhc3luYyBzZXRTdG9yYWdlSXRlbShrZXk6IHN0cmluZywgdmFsdWU6IGFueSkge1xuICAgICAgICBjb25zdCBzdG9yYWdlID0gdGhpcy5zdG9yYWdlIGFzIGFueTtcbiAgICAgICAgaWYgKCFzdG9yYWdlPy5sb2NhbCkgcmV0dXJuO1xuXG4gICAgICAgIGF3YWl0IHN0b3JhZ2UubG9jYWwuc2V0KHsgW2tleV06IHZhbHVlIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGdldEFsbFN0b3JhZ2VJdGVtcygpOiBQcm9taXNlPFJlY29yZDxzdHJpbmcsIGFueT4+IHtcbiAgICAgICAgY29uc3Qgc3RvcmFnZSA9IHRoaXMuc3RvcmFnZSBhcyBhbnk7XG4gICAgICAgIGlmICghc3RvcmFnZT8ubG9jYWwpIHJldHVybiB7fTtcbiAgICAgICAgcmV0dXJuIGF3YWl0IHN0b3JhZ2UubG9jYWwuZ2V0KG51bGwpO1xuICAgIH1cblxuICAgIGFzeW5jIHJlbW92ZVN0b3JhZ2VJdGVtcyhrZXlzOiBzdHJpbmcgfCBzdHJpbmdbXSkge1xuICAgICAgICBjb25zdCBzdG9yYWdlID0gdGhpcy5zdG9yYWdlIGFzIGFueTtcbiAgICAgICAgaWYgKCFzdG9yYWdlPy5sb2NhbCkgcmV0dXJuO1xuICAgICAgICBhd2FpdCBzdG9yYWdlLmxvY2FsLnJlbW92ZShrZXlzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRpYWxpemVDaHJvbWVBcGkoKTogdm9pZCB7XG4gICAgICAgIGlmICh0eXBlb2YgY2hyb21lICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICB0aGlzLl9jaHJvbWUgPSBjaHJvbWU7XG4gICAgICAgICAgICB0aGlzLl9pc0Nocm9tZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRpYWxpemVCcm93c2VyQXBpKCk6IHZvaWQge1xuICAgICAgICBpZiAodHlwZW9mIGJyb3dzZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHRoaXMuX2Jyb3dzZXIgPSBicm93c2VyO1xuICAgICAgICAgICAgdGhpcy5faXNCcm93c2VyID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q2hyb21lTW9kdWxlKG1vZHVsZU5hbWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNDaHJvbWUgJiYgdGhpcy5fY2hyb21lPy5bbW9kdWxlTmFtZSBhcyBrZXlvZiB0eXBlb2YgY2hyb21lXSA/IHRoaXMuX2Nocm9tZVttb2R1bGVOYW1lIGFzIGtleW9mIHR5cGVvZiBjaHJvbWVdIDogbnVsbDtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldEJyb3dzZXJNb2R1bGUobW9kdWxlTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc0Jyb3dzZXIgJiYgdGhpcy5fYnJvd3Nlcj8uW21vZHVsZU5hbWUgYXMga2V5b2YgQnJvd3Nlcl0gPyB0aGlzLl9icm93c2VyW21vZHVsZU5hbWUgYXMga2V5b2YgQnJvd3Nlcl0gOiBudWxsO1xuICAgIH1cblxuICAgIHByaXZhdGUgaGFuZGxlU2VuZE1lc3NhZ2UocnVudGltZTogYW55LCBtZXNzYWdlOiBhbnksIGNhbGxiYWNrPzogKHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcbiAgICAgICAgaWYgKHRoaXMuX2lzQ2hyb21lKSB7XG4gICAgICAgICAgICBydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UsIGNhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9pc0Jyb3dzZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIkBleHRlbnNpb24tc2NyaXB0cy9sb2dnZXIvbG9nZ2VyLmNsYXNzXCI7XG5pbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gXCJAZXh0ZW5zaW9uLXNjcmlwdHMvZW52aXJvbm1lbnRzL2Vudmlyb25tZW50XCI7XG5pbXBvcnQgeyBCcm93c2VyQXBpVXRpbCB9IGZyb20gXCIuL2Jyb3dzZXItYXBpLXV0aWxcIjtcbmltcG9ydCB7XG4gICAgRGFwcE1lc3NhZ2UsXG4gICAgRGFwcE1lc3NhZ2VUeXBlLFxuICAgIERhcHBQZXJtaXNzaW9uLFxuICAgIFBlbmRpbmdEYXBwUmVxdWVzdCxcbiAgICBTVVBQT1JURURfQ0hBSU5TLFxuICAgIGlzU3VwcG9ydGVkQ2hhaW4sXG4gICAgY2hhaW5JZFRvSGV4LFxuICAgIGdldENoYWluQ29uZmlnLFxuICAgIGhleFRvQ2hhaW5JZCxcbn0gZnJvbSBcIkBzaGFyZWQvdHlwZXMvZGFwcC50eXBlc1wiO1xuaW1wb3J0IHsgZ2V0UHJlZmVycmVkQ2hhaW5JZEZvck9yaWdpbiB9IGZyb20gXCJAc2hhcmVkL3NlcnZpY2VzL2RhcHAtbWFwcGluZy5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBnZXRDaGFpbktleUZyb21DaGFpbklkIH0gZnJvbSBcIkBzaGFyZWQvdXRpbHMvZXZtLWNoYWluLWtleS51dGlsXCI7XG5cbi8vIOKUgOKUgOKUgCBDb25zdGFudHMg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbi8qKiBIb3cgbG9uZyBhIHBlbmRpbmcgZEFwcCByZXF1ZXN0IGxpdmVzIGJlZm9yZSBpdCBhdXRvLWV4cGlyZXMgKDUgbWludXRlcykuICovXG5jb25zdCBEQVBQX1JFUVVFU1RfVElNRU9VVF9NUyA9IDUgKiA2MCAqIDEwMDA7XG5cbi8qKiBjaHJvbWUuc3RvcmFnZS5sb2NhbCBrZXkgdGhhdCBob2xkcyBhbGwgZ3JhbnRlZCBkQXBwIHBlcm1pc3Npb25zLiAqL1xuY29uc3QgUEVSTUlTU0lPTlNfU1RPUkFHRV9LRVkgPSBcImRhcHBfcGVybWlzc2lvbnNcIjtcblxuLyoqIFByZWZpeCB1c2VkIGZvciBwZXItcmVxdWVzdCBzdG9yYWdlIGtleXMsIGFsbG93aW5nIHJlc3RvcmUgYWZ0ZXIgc2VydmljZS13b3JrZXIgcmVzdGFydC4gKi9cbmNvbnN0IFBFTkRJTkdfUkVRVUVTVF9TVE9SQUdFX1BSRUZJWCA9IFwicGVuZGluZ19kYXBwX3JlcXVlc3RfXCI7XG5cbi8qKiBUb3RhbCB0aW1lIGJ1ZGdldCBmb3IgcmV0cnlpbmcgYSB0YWIgbWVzc2FnZSAoZXhwb25lbnRpYWwgYmFja29mZiB1cCB0byA2MHMpLiAqL1xuY29uc3QgVEFCX01FU1NBR0VfVElNRU9VVF9NUyA9IDYwICogMTAwMDtcblxuLyoqIFN0YXJ0aW5nIGRlbGF5IGZvciB0aGUgZXhwb25lbnRpYWwgYmFja29mZiB3aGVuIGEgdGFiIG1lc3NhZ2UgZmFpbHMuICovXG5jb25zdCBUQUJfTUVTU0FHRV9JTklUSUFMX0RFTEFZX01TID0gMTAwO1xuXG4vKiogTWF4aW11bSBkZWxheSBiZXR3ZWVuIGluZGl2aWR1YWwgcmV0cnkgYXR0ZW1wdHMgKGNhcHMgdGhlIGV4cG9uZW50aWFsIGdyb3d0aCkuICovXG5jb25zdCBUQUJfTUVTU0FHRV9NQVhfREVMQVlfTVMgPSA1MDAwO1xuXG4vKiogZEFwcCBSUEMgbWV0aG9kcyB0aGF0IGFyZSB0b28gZXhwZW5zaXZlLCBzdGF0ZWZ1bCwgb3Igc3Vic2NyaXB0aW9uLWJhc2VkIGZvciB0aGUgbGlnaHR3ZWlnaHQgcHJveHkuICovXG5jb25zdCBCTE9DS0VEX0RBUFBfUlBDX01FVEhPRFMgPSBuZXcgU2V0KFtcbiAgICBcImV0aF9zdWJzY3JpYmVcIixcbiAgICBcImV0aF91bnN1YnNjcmliZVwiLFxuICAgIFwiZXRoX25ld2ZpbHRlclwiLFxuICAgIFwiZXRoX25ld2Jsb2NrZmlsdGVyXCIsXG4gICAgXCJldGhfbmV3cGVuZGluZ3RyYW5zYWN0aW9uZmlsdGVyXCIsXG4gICAgXCJldGhfZ2V0ZmlsdGVyY2hhbmdlc1wiLFxuICAgIFwiZXRoX2dldGZpbHRlcmxvZ3NcIixcbiAgICBcImV0aF9nZXRsb2dzXCIsXG5dKTtcblxuLyoqIFByZWZpeGVzIGZvciBSUEMgbmFtZXNwYWNlcyB0aGF0IHNob3VsZCBuZXZlciBiZSBleHBvc2VkIHRvIGFyYml0cmFyeSBkQXBwcy4gKi9cbmNvbnN0IEJMT0NLRURfREFQUF9SUENfUFJFRklYRVMgPSBbXCJhZG1pbl9cIiwgXCJkZWJ1Z19cIiwgXCJlbmdpbmVfXCIsIFwibWluZXJfXCIsIFwib3RzX1wiLCBcInBlcnNvbmFsX1wiLCBcInRyYWNlX1wiLCBcInR4cG9vbF9cIl07XG5cbi8qKiBSZWFkIEpXVCBmcm9tIHRoZSBzYW1lIGNocm9tZS5zdG9yYWdlLmxvY2FsIGtleXMgdXNlZCBieSBBdXRoU2VydmljZSAoZXh0ZW5zaW9uIFVJKS4gKi9cbmZ1bmN0aW9uIHJlYWRBY2Nlc3NUb2tlbkZyb21TdG9yYWdlKCk6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFtcImFjY2Vzc1Rva2VuXCIsIFwiYWNjZXNzVG9rZW5FeHBpcmVzQXRcIl0sIChpdGVtcykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChjaHJvbWUucnVudGltZS5sYXN0RXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCB0b2tlbiA9IGl0ZW1zPy5hY2Nlc3NUb2tlbiBhcyBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgY29uc3QgZXhwID0gaXRlbXM/LmFjY2Vzc1Rva2VuRXhwaXJlc0F0IGFzIG51bWJlciB8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBpZiAoIXRva2VuIHx8IGV4cCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGV4cCA8PSBEYXRlLm5vdygpIC8gMTAwMCArIDUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXNvbHZlKHRva2VuKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuLy8g4pSA4pSA4pSAIFR5cGVzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4vKiogQSBwZW5kaW5nIHJlcXVlc3QgYXMgcGVyc2lzdGVkIHRvIGNocm9tZS5zdG9yYWdlLmxvY2FsIChhZGRzIGV4cGlyeSAvIGRpc3BsYXkgZmllbGRzKS4gKi9cbmludGVyZmFjZSBTdG9yZWRQZW5kaW5nRGFwcFJlcXVlc3QgZXh0ZW5kcyBQZW5kaW5nRGFwcFJlcXVlc3Qge1xuICAgIGV4cGlyZXNBdDogbnVtYmVyO1xuICAgIGZhdmljb246IHN0cmluZztcbiAgICBob3N0bmFtZTogc3RyaW5nO1xuICAgIHZlcmlmeVN0YXR1czogXCJVTktOT1dOXCI7XG59XG5cbi8qKlxuICogQW4gZW50cnkgaW4gdGhlIHBlci1vcmlnaW4gY29hbGVzY2luZyBxdWV1ZS5cbiAqIFdoZW4gbXVsdGlwbGUgY29ubmVjdGlvbiByZXF1ZXN0cyBhcnJpdmUgZm9yIHRoZSBzYW1lIG9yaWdpbiBzaW11bHRhbmVvdXNseSxcbiAqIHRoZXkgYXJlIHF1ZXVlZCBoZXJlIHNvIHRoZXkgYWxsIHJlY2VpdmUgdGhlIHNhbWUgYXBwcm92YWwvcmVqZWN0aW9uIG91dGNvbWUuXG4gKi9cbmludGVyZmFjZSBDb2FsZXNjZWRDb25uZWN0IHtcbiAgICByZXF1ZXN0SWQ6IHN0cmluZztcbiAgICB0YWJJZD86IG51bWJlcjtcbn1cblxuLy8g4pSA4pSA4pSAIE1vZHVsZS1sZXZlbCBSUEMgcHJveHkgaGVscGVyIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4vKipcbiAqIEZvcndhcmRzIGEgcmVhZC1vbmx5IEpTT04tUlBDIGNhbGwgZGlyZWN0bHkgdG8gdGhlIGNvbmZpZ3VyZWQgY2hhaW4gUlBDIGVuZHBvaW50LlxuICogVGhpcyBhdm9pZHMgb3BlbmluZyBhbnkgVUkg4oCUIGl0IGlzIHVzZWQgZm9yIG1ldGhvZHMgbGlrZSBldGhfYmxvY2tOdW1iZXIsIGV0aF9nZXRCYWxhbmNlLCBldGMuXG4gKlxuICogQHBhcmFtIHBheWxvYWQgIC0gVGhlIFJQQyBwYXlsb2FkIChtZXRob2QsIHBhcmFtcywgY2hhaW5JZCBpbiBoZXgpLlxuICogQHBhcmFtIHNlbmRSZXNwb25zZSAtIENocm9tZSBleHRlbnNpb24gc2VuZFJlc3BvbnNlIGNhbGxiYWNrLlxuICovXG5hc3luYyBmdW5jdGlvbiBoYW5kbGVScGNQcm94eShcbiAgICBwYXlsb2FkOiB7IG1ldGhvZD86IHN0cmluZzsgcGFyYW1zPzogYW55W107IGNoYWluSWQ/OiBzdHJpbmcgfSxcbiAgICBvcmlnaW46IHN0cmluZyxcbiAgICBzZW5kUmVzcG9uc2U6IChyZXNwb25zZTogYW55KSA9PiB2b2lkXG4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IG1ldGhvZCwgcGFyYW1zID0gW10sIGNoYWluSWQ6IGNoYWluSWRIZXggfSA9IHBheWxvYWQgfHwge307XG4gICAgY29uc3Qgbm9ybWFsaXplZE1ldGhvZCA9IHR5cGVvZiBtZXRob2QgPT09IFwic3RyaW5nXCIgPyBtZXRob2QudHJpbSgpIDogXCJcIjtcbiAgICBjb25zdCBjaGFpbklkID0gY2hhaW5JZEhleCA/IGhleFRvQ2hhaW5JZChjaGFpbklkSGV4KSA6IDE7XG4gICAgY29uc3QgY2hhaW5Db25maWcgPSBnZXRDaGFpbkNvbmZpZyhjaGFpbklkKTtcbiAgICBjb25zdCBycGNVcmwgPSBjaGFpbkNvbmZpZz8ucnBjVXJsO1xuXG4gICAgaWYgKCFub3JtYWxpemVkTWV0aG9kKSB7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yOiB7IGNvZGU6IC0zMjYwMCwgbWVzc2FnZTogXCJaZWxmIFdhbGxldDogTWlzc2luZyBSUEMgbWV0aG9kLlwiIH0sXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbG93ZXJlZE1ldGhvZCA9IG5vcm1hbGl6ZWRNZXRob2QudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBpc0Jsb2NrZWRNZXRob2QgPVxuICAgICAgICBCTE9DS0VEX0RBUFBfUlBDX01FVEhPRFMuaGFzKGxvd2VyZWRNZXRob2QpIHx8IEJMT0NLRURfREFQUF9SUENfUFJFRklYRVMuc29tZSgocHJlZml4KSA9PiBsb3dlcmVkTWV0aG9kLnN0YXJ0c1dpdGgocHJlZml4KSk7XG5cbiAgICBpZiAoaXNCbG9ja2VkTWV0aG9kKSB7XG4gICAgICAgIExvZ2dlci53YXJuKGBbREFQUF9SUENfUFJPWFldIEJsb2NrZWQgJHtub3JtYWxpemVkTWV0aG9kfSBmb3IgJHtvcmlnaW4gfHwgXCJ1bmtub3duLW9yaWdpblwifSBvbiBjaGFpbiAke2NoYWluSWR9YCk7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yOiB7IGNvZGU6IC0zMjYwMSwgbWVzc2FnZTogYFplbGYgV2FsbGV0OiBSUEMgbWV0aG9kICR7bm9ybWFsaXplZE1ldGhvZH0gaXMgbm90IGF2YWlsYWJsZSB0aHJvdWdoIHRoZSBkQXBwIHByb3h5LmAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXJwY1VybCkge1xuICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICBlcnJvcjogeyBjb2RlOiAtMzI2MDMsIG1lc3NhZ2U6IGBaZWxmIFdhbGxldDogTm8gUlBDIFVSTCBmb3IgY2hhaW4gJHtjaGFpbklkfS4gUmVhZC1vbmx5IG1ldGhvZHMgcmVxdWlyZSBhIGNvbmZpZ3VyZWQgUlBDLmAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBqc29uQm9keSA9IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAganNvbnJwYzogXCIyLjBcIixcbiAgICAgICAgaWQ6IDEsXG4gICAgICAgIG1ldGhvZDogbm9ybWFsaXplZE1ldGhvZCxcbiAgICAgICAgcGFyYW1zOiBBcnJheS5pc0FycmF5KHBhcmFtcykgPyBwYXJhbXMgOiBbXSxcbiAgICB9KTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNoYWluS2V5ID0gZ2V0Q2hhaW5LZXlGcm9tQ2hhaW5JZChjaGFpbklkKTtcbiAgICAgICAgY29uc3QgdG9rZW4gPSBhd2FpdCByZWFkQWNjZXNzVG9rZW5Gcm9tU3RvcmFnZSgpO1xuICAgICAgICBpZiAoY2hhaW5LZXkgJiYgdG9rZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IGJhc2UgPSBlbnZpcm9ubWVudC5hcGlCYXNlVXJsLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcbiAgICAgICAgICAgIGNvbnN0IHByb3h5VXJsID0gYCR7YmFzZX0vYXBpL3Byb3RlY3RlZC9ycGMvJHtjaGFpbktleX1gO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChwcm94eVVybCwge1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIEF1dGhvcml6YXRpb246IGBCZWFyZXIgJHt0b2tlbn1gLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBib2R5OiBqc29uQm9keSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBqc29uID0gYXdhaXQgcmVzLmpzb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzLm9rICYmIGpzb24gJiYganNvbi5yZXN1bHQgIT09IHVuZGVmaW5lZCAmJiAhanNvbi5lcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBqc29uLnJlc3VsdCB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBMb2dnZXIud2FybihgW0RBUFBfUlBDX1BST1hZXSBQcm90ZWN0ZWQgcHJveHkgcmV0dXJuZWQgJHtyZXMuc3RhdHVzfSwgZmFsbGluZyBiYWNrIHRvIGRpcmVjdCBSUENgKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKHByb3h5RXJyOiBhbnkpIHtcbiAgICAgICAgICAgICAgICBMb2dnZXIud2FybihcIltEQVBQX1JQQ19QUk9YWV0gUHJvdGVjdGVkIHByb3h5IGZhaWxlZCwgZmFsbGluZyBiYWNrIHRvIGRpcmVjdCBSUEM6XCIsIHByb3h5RXJyPy5tZXNzYWdlIHx8IHByb3h5RXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKHJwY1VybCwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgICAgICAgIGJvZHk6IGpzb25Cb2R5LFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QganNvbiA9IGF3YWl0IHJlcy5qc29uKCk7XG5cbiAgICAgICAgaWYgKGpzb24uZXJyb3IpIHtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6IHsgY29kZToganNvbi5lcnJvci5jb2RlID8/IC0zMjYwMywgbWVzc2FnZToganNvbi5lcnJvci5tZXNzYWdlIHx8IFwiUlBDIGVycm9yXCIgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogdHJ1ZSwgZGF0YToganNvbi5yZXN1bHQgfSk7XG4gICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgTG9nZ2VyLmVycm9yKFwiREFQUF9SUENfUFJPWFkgZXJyb3I6XCIsIGVycik7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgICBzdWNjZXNzOiBmYWxzZSxcbiAgICAgICAgICAgIGVycm9yOiB7IGNvZGU6IC0zMjYwMywgbWVzc2FnZTogZXJyPy5tZXNzYWdlIHx8IFwiUlBDIHByb3h5IGZhaWxlZFwiIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuLy8g4pSA4pSA4pSAIERhcHBIYW5kbGVyIGNsYXNzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5leHBvcnQgY2xhc3MgRGFwcEhhbmRsZXIge1xuICAgIC8vIOKUgOKUgCBTaW5nbGV0b24g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogRGFwcEhhbmRsZXI7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBzaW5nbGV0b24gRGFwcEhhbmRsZXIgaW5zdGFuY2UsIGNyZWF0aW5nIGl0IG9uIGZpcnN0IGNhbGwuXG4gICAgICogVXNpbmcgYSBzaW5nbGV0b24gZW5zdXJlcyB0aGUgaW4tbWVtb3J5IHBlbmRpbmctcmVxdWVzdCBzdGF0ZSBpcyBzaGFyZWRcbiAgICAgKiBhY3Jvc3MgYWxsIGJhY2tncm91bmQgbWVzc2FnZSBoYW5kbGVycy5cbiAgICAgKi9cbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKGJyb3dzZXJBcGk6IEJyb3dzZXJBcGlVdGlsKTogRGFwcEhhbmRsZXIge1xuICAgICAgICBpZiAoIURhcHBIYW5kbGVyLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBEYXBwSGFuZGxlci5pbnN0YW5jZSA9IG5ldyBEYXBwSGFuZGxlcihicm93c2VyQXBpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRGFwcEhhbmRsZXIuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgLy8g4pSA4pSAIEluLW1lbW9yeSBzdGF0ZSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICAgIC8qKiBBbGwgcmVxdWVzdHMgYXdhaXRpbmcgdXNlciBhcHByb3ZhbCAoaW4tbWVtb3J5OyBhbHNvIHBlcnNpc3RlZCB0byBzdG9yYWdlKS4gKi9cbiAgICBwcml2YXRlIHBlbmRpbmdSZXF1ZXN0czogTWFwPHN0cmluZywgUGVuZGluZ0RhcHBSZXF1ZXN0PiA9IG5ldyBNYXAoKTtcblxuICAgIC8qKiBzZXRUaW1lb3V0IGhhbmRsZXMgaW5kZXhlZCBieSByZXF1ZXN0SWQg4oCUIHVzZWQgdG8gY2FuY2VsIHRpbWVycyBvbiByZXNvbHV0aW9uLiAqL1xuICAgIHByaXZhdGUgdGltZW91dEhhbmRsZXM6IE1hcDxzdHJpbmcsIFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+PiA9IG5ldyBNYXAoKTtcblxuICAgIC8qKlxuICAgICAqIFBlci1vcmlnaW4gY29hbGVzY2luZyBxdWV1ZSBmb3IgY29ubmVjdGlvbiByZXF1ZXN0cy5cbiAgICAgKiBUaGUgZmlyc3QgZW50cnkgaXMgdGhlIFwibGVhZGVyXCIgdGhhdCBvcGVucyB0aGUgVUk7IHN1YnNlcXVlbnQgb25lcyBwaWdneWJhY2tcbiAgICAgKiBhbmQgcmVjZWl2ZSB0aGUgc2FtZSBhcHByb3ZhbC9yZWplY3Rpb24gcmVzdWx0LlxuICAgICAqL1xuICAgIHByaXZhdGUgcGVuZGluZ0Nvbm5lY3RzQnlPcmlnaW46IE1hcDxzdHJpbmcsIENvYWxlc2NlZENvbm5lY3RbXT4gPSBuZXcgTWFwKCk7XG5cbiAgICAvKiogUHJvbWlzZSBndWFyZCBzbyBfcmVzdG9yZVBlbmRpbmdSZXF1ZXN0cyBvbmx5IHJ1bnMgb25jZSBwZXIgc2VydmljZS13b3JrZXIgbGlmZWN5Y2xlLiAqL1xuICAgIHByaXZhdGUgcmVzdG9yZVBlbmRpbmdSZXF1ZXN0c1Byb21pc2U6IFByb21pc2U8dm9pZD4gfCBudWxsID0gbnVsbDtcblxuICAgIC8qKiBNYXAgb2YgY2hyb21lIHdpbmRvdyBJRHMgdG8gcmVxdWVzdCBJRHMgdG8gZGV0ZWN0IGNsb3NlZCBwb3B1cHMuICovXG4gICAgcHJpdmF0ZSBhcHByb3ZhbFdpbmRvd3M6IE1hcDxudW1iZXIsIHN0cmluZz4gPSBuZXcgTWFwKCk7XG5cbiAgICAvLyDilIDilIAgQ29uc3RydWN0b3Ig4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKHByaXZhdGUgYnJvd3NlckFwaTogQnJvd3NlckFwaVV0aWwpIHtcbiAgICAgICAgLy8gS2ljayBvZmYgc3RvcmFnZSByZXN0b3JhdGlvbiBpbW1lZGlhdGVseSBzbyBpbi1mbGlnaHQgcmVxdWVzdHMgc3Vydml2ZVxuICAgICAgICAvLyBzZXJ2aWNlLXdvcmtlciByZXN0YXJ0cyB3aXRob3V0IG5lZWRpbmcgYSBzZXBhcmF0ZSBjYWxsLlxuICAgICAgICB2b2lkIHRoaXMucmVzdG9yZVBlbmRpbmdSZXF1ZXN0cygpO1xuXG4gICAgICAgIC8vIExpc3RlbiBmb3IgcG9wdXAgd2luZG93IGNsb3N1cmUgc28gd2UgY2FuIGltbWVkaWF0ZWx5IHJlamVjdCB0aGUgcmVxdWVzdFxuICAgICAgICBpZiAodHlwZW9mIGNocm9tZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBjaHJvbWUud2luZG93cyAmJiBjaHJvbWUud2luZG93cy5vblJlbW92ZWQpIHtcbiAgICAgICAgICAgIGNocm9tZS53aW5kb3dzLm9uUmVtb3ZlZC5hZGRMaXN0ZW5lcigod2luZG93SWQpID0+IHtcbiAgICAgICAgICAgICAgICB2b2lkIHRoaXMuX2hhbmRsZVdpbmRvd0Nsb3NlZCh3aW5kb3dJZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgY2FzZXMgd2hlcmUgdGhlIHVzZXIgY2xvc2VzIHRoZSBwb3B1cCB3aW5kb3cgd2l0aG91dCB0YWtpbmcgYW55IGFjdGlvbi5cbiAgICAgKiBGaXJlcyBhIHJlamVjdGlvbiBiYWNrIHRvIHRoZSBkQXBwIGFuZCBjbGVhcnMgdGhlIHBlbmRpbmcgY29hbGVzY2VkIHJlcXVlc3RzLlxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgX2hhbmRsZVdpbmRvd0Nsb3NlZCh3aW5kb3dJZDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IHJlcXVlc3RJZCA9IHRoaXMuYXBwcm92YWxXaW5kb3dzLmdldCh3aW5kb3dJZCk7XG4gICAgICAgIGlmICghcmVxdWVzdElkKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5hcHByb3ZhbFdpbmRvd3MuZGVsZXRlKHdpbmRvd0lkKTtcblxuICAgICAgICBjb25zdCBwZW5kaW5nID0gYXdhaXQgdGhpcy5fZ2V0UGVuZGluZ1JlcXVlc3QocmVxdWVzdElkKTtcbiAgICAgICAgaWYgKCFwZW5kaW5nKSByZXR1cm47XG5cbiAgICAgICAgTG9nZ2VyLmluZm8oYFtEYXBwSGFuZGxlcl0gVXNlciBjbG9zZWQgYXBwcm92YWwgcG9wdXAgbWFudWFsbHkgZm9yIHJlcXVlc3QgJHtyZXF1ZXN0SWR9YCk7XG5cbiAgICAgICAgdGhpcy5fcmVtb3ZlUGVuZGluZ1JlcXVlc3QocmVxdWVzdElkKTtcblxuICAgICAgICBjb25zdCBlcnJvclBheWxvYWQgPSB7IGVycm9yOiB7IGNvZGU6IDQwMDEsIG1lc3NhZ2U6IFwiVXNlciByZWplY3RlZCB0aGUgcmVxdWVzdFwiIH0gfTtcbiAgICAgICAgdm9pZCB0aGlzLl9ub3RpZnlUYWIocGVuZGluZy50YWJJZCwgXCJEQVBQX1BST1ZJREVSX1JFU1BPTlNFXCIsIHsgcmVxdWVzdElkLCAuLi5lcnJvclBheWxvYWQgfSk7XG5cbiAgICAgICAgaWYgKHBlbmRpbmcudHlwZSA9PT0gXCJEQVBQX0NPTk5FQ1RcIiB8fCBwZW5kaW5nLnR5cGUgPT09IFwiREFQUF9SRVFVRVNUX0FDQ09VTlRTXCIpIHtcbiAgICAgICAgICAgIHZvaWQgdGhpcy5fcmVzb2x2ZUNvYWxlc2NlZENvbm5lY3RzKHBlbmRpbmcub3JpZ2luLCBlcnJvclBheWxvYWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8g4pSA4pSA4pSAIFB1YmxpYyBBUEkg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbiAgICAvKipcbiAgICAgKiBJZGVtcG90ZW50OiByZXN0b3JlcyBhbnkgcGVuZGluZyByZXF1ZXN0cyBmcm9tIGNocm9tZS5zdG9yYWdlLmxvY2FsIGludG9cbiAgICAgKiBtZW1vcnkgYWZ0ZXIgYSBzZXJ2aWNlLXdvcmtlciByZXN0YXJ0LiBTYWZlIHRvIGNhbGwgbXVsdGlwbGUgdGltZXMuXG4gICAgICovXG4gICAgYXN5bmMgcmVzdG9yZVBlbmRpbmdSZXF1ZXN0cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKCF0aGlzLnJlc3RvcmVQZW5kaW5nUmVxdWVzdHNQcm9taXNlKSB7XG4gICAgICAgICAgICB0aGlzLnJlc3RvcmVQZW5kaW5nUmVxdWVzdHNQcm9taXNlID0gdGhpcy5fcmVzdG9yZVBlbmRpbmdSZXF1ZXN0cygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnJlc3RvcmVQZW5kaW5nUmVxdWVzdHNQcm9taXNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE1haW4gZW50cnkgcG9pbnQgZm9yIGFsbCBtZXNzYWdlcyBhcnJpdmluZyBmcm9tIGNvbnRlbnQgc2NyaXB0cyAvIHRoZSBleHRlbnNpb24gVUkuXG4gICAgICogRGlzcGF0Y2hlcyB0byB0aGUgYXBwcm9wcmlhdGUgcHJpdmF0ZSBoYW5kbGVyIGJhc2VkIG9uIHRoZSBtZXNzYWdlIHR5cGUuXG4gICAgICpcbiAgICAgKiBGb3IgbWVzc2FnZXMgdGhhdCByZXF1aXJlIGFzeW5jIHdvcmsgbG9uZ2VyIHRoYW4gQ2hyb21lJ3MgfjUgcyBtZXNzYWdlLWNoYW5uZWxcbiAgICAgKiB0aW1lb3V0LCBgc2VuZFJlc3BvbnNlYCBpcyBjYWxsZWQgaW1tZWRpYXRlbHkgd2l0aCBgeyBwZW5kaW5nOiB0cnVlIH1gIGFuZCB0aGVcbiAgICAgKiByZXN1bHQgaXMgbGF0ZXIgcHVzaGVkIGJhY2sgdmlhIGBfbm90aWZ5VGFiYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBtZXNzYWdlICAgICAgLSBUeXBlZCBkQXBwIG1lc3NhZ2UgZnJvbSB0aGUgY29udGVudCBzY3JpcHQuXG4gICAgICogQHBhcmFtIHNlbmRlciAgICAgICAtIENocm9tZSBtZXNzYWdlIHNlbmRlciAoY29udGFpbnMgdGFiIGluZm8pLlxuICAgICAqIEBwYXJhbSBzZW5kUmVzcG9uc2UgLSBNdXN0IGJlIGNhbGxlZCB0byBrZWVwIHRoZSBtZXNzYWdlIGNoYW5uZWwgYWxpdmUuXG4gICAgICovXG4gICAgYXN5bmMgaGFuZGxlRGFwcE1lc3NhZ2UoXG4gICAgICAgIG1lc3NhZ2U6IERhcHBNZXNzYWdlLFxuICAgICAgICBzZW5kZXI6IHsgdGFiPzogeyBpZD86IG51bWJlcjsgdXJsPzogc3RyaW5nIH0gfSxcbiAgICAgICAgc2VuZFJlc3BvbnNlOiAocmVzcG9uc2U6IGFueSkgPT4gdm9pZFxuICAgICk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCB7IHR5cGUsIHBheWxvYWQsIHJlcXVlc3RJZCwgb3JpZ2luIH0gPSBtZXNzYWdlO1xuICAgICAgICBjb25zdCBzZW5kZXJPcmlnaW4gPSBvcmlnaW4gfHwgKHNlbmRlci50YWI/LnVybCA/IG5ldyBVUkwoc2VuZGVyLnRhYi51cmwpLm9yaWdpbiA6IFwiXCIpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAvLyDilIDilIAgQ29ubmVjdGlvbiDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgICAgICAgICAgICAgICBjYXNlIFwiREFQUF9SRVFVRVNUX0FDQ09VTlRTXCI6XG4gICAgICAgICAgICAgICAgY2FzZSBcIkRBUFBfQ09OTkVDVFwiOlxuICAgICAgICAgICAgICAgICAgICAvLyBSZXNwb25kIGltbWVkaWF0ZWx5IOKAlCBzdG9yYWdlIEkvTyArIGNocm9tZS53aW5kb3dzLmNyZWF0ZSBjYW4gZXhjZWVkIHRoZSA1IHMgbGltaXQuXG4gICAgICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUsIHBlbmRpbmc6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgICAgIHZvaWQgdGhpcy5faGFuZGxlQ29ubmVjdGlvblJlcXVlc3QocmVxdWVzdElkLCBzZW5kZXJPcmlnaW4sIHBheWxvYWQsIHNlbmRlci50YWI/LmlkKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIExvZ2dlci5lcnJvcihcIkZhaWxlZCB0byBoYW5kbGUgY29ubmVjdGlvbiByZXF1ZXN0IGFmdGVyIGltbWVkaWF0ZSByZXNwb25zZTpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFwiREFQUF9HRVRfQUNDT1VOVFNcIjpcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5faGFuZGxlR2V0QWNjb3VudHMoc2VuZGVyT3JpZ2luLCBzZW5kUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIC8vIOKUgOKUgCBTaWduaW5nIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAgICAgICAgICAgICAgIGNhc2UgXCJEQVBQX1NFTkRfVFJBTlNBQ1RJT05cIjpcbiAgICAgICAgICAgICAgICBjYXNlIFwiREFQUF9TSUdOX1RSQU5TQUNUSU9OXCI6XG4gICAgICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUsIHBlbmRpbmc6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgICAgIHZvaWQgdGhpcy5faGFuZGxlU2lnblRyYW5zYWN0aW9uKHJlcXVlc3RJZCwgc2VuZGVyT3JpZ2luLCBwYXlsb2FkLCBzZW5kZXIudGFiPy5pZCkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJGYWlsZWQgdG8gaGFuZGxlIHNpZ24gdHJhbnNhY3Rpb24gYWZ0ZXIgaW1tZWRpYXRlIHJlc3BvbnNlOlwiLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJEQVBQX1NJR05fTUVTU0FHRVwiOlxuICAgICAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlLCBwZW5kaW5nOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgICAgICB2b2lkIHRoaXMuX2hhbmRsZVNpZ25NZXNzYWdlKHJlcXVlc3RJZCwgc2VuZGVyT3JpZ2luLCBwYXlsb2FkLCBzZW5kZXIudGFiPy5pZCkuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJGYWlsZWQgdG8gaGFuZGxlIHNpZ24gbWVzc2FnZSBhZnRlciBpbW1lZGlhdGUgcmVzcG9uc2U6XCIsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgLy8g4pSA4pSAIENoYWluIG1hbmFnZW1lbnQg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4gICAgICAgICAgICAgICAgY2FzZSBcIkRBUFBfU1dJVENIX0NIQUlOXCI6XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2hhbmRsZVN3aXRjaENoYWluKHJlcXVlc3RJZCwgc2VuZGVyT3JpZ2luLCBwYXlsb2FkLCBzZW5kUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJEQVBQX0FERF9DSEFJTlwiOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVBZGRDaGFpbihwYXlsb2FkLCBzZW5kUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJEQVBQX0NIQUlOX0lEXCI6XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2hhbmRsZUdldENoYWluSWQoc2VuZGVyT3JpZ2luLCBzZW5kUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIC8vIOKUgOKUgCBEaXNjb25uZWN0IOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAgICAgICAgICAgICAgIGNhc2UgXCJEQVBQX0RJU0NPTk5FQ1RcIjpcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5faGFuZGxlRGlzY29ubmVjdChzZW5kZXJPcmlnaW4sIHNlbmRSZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBcIkRBUFBfRk9SQ0VfRElTQ09OTkVDVF9TSVRFXCI6XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2hhbmRsZUZvcmNlRGlzY29ubmVjdFNpdGUocGF5bG9hZD8ub3JpZ2luLCBzZW5kUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJEQVBQX0ZPUkNFX0RJU0NPTk5FQ1RfQUxMXCI6XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2hhbmRsZUZvcmNlRGlzY29ubmVjdEFsbChzZW5kUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIC8vIOKUgOKUgCBQZW5kaW5nIHJlcXVlc3QgbGlmZWN5Y2xlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuICAgICAgICAgICAgICAgIGNhc2UgXCJEQVBQX0dFVF9QRU5ESU5HXCI6XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2hhbmRsZUdldFBlbmRpbmcocmVxdWVzdElkLCBzZW5kUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJEQVBQX0FQUFJPVkFMX1JFU1VMVFwiOlxuICAgICAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgICAgICB2b2lkIHRoaXMuX2hhbmRsZUFwcHJvdmFsUmVzdWx0KHBheWxvYWQpLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiRmFpbGVkIHRvIHByb2Nlc3MgZEFwcCBhcHByb3ZhbCByZXN1bHQ6XCIsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBcIkRBUFBfU0lHTklOR19SRVNVTFRcIjpcbiAgICAgICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgdm9pZCB0aGlzLl9oYW5kbGVTaWduaW5nUmVzdWx0KHBheWxvYWQpLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiRmFpbGVkIHRvIHByb2Nlc3MgZEFwcCBzaWduaW5nIHJlc3VsdDpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFwiREFQUF9DQU5DRUxfUEVORElOR19GT1JfT1JJR0lOXCI6XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2hhbmRsZUNhbmNlbFBlbmRpbmdGb3JPcmlnaW4oc2VuZGVyT3JpZ2luLCBzZW5kUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJEQVBQX0NMRUFOVVBfUkVRVUVTVFNcIjpcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5faGFuZGxlQ2xlYW51cFJlcXVlc3RzKHNlbmRSZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgLy8g4pSA4pSAIFJQQyBwcm94eSDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbiAgICAgICAgICAgICAgICBjYXNlIFwiREFQUF9SUENfUFJPWFlcIjpcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgaGFuZGxlUnBjUHJveHkocGF5bG9hZCwgc2VuZGVyT3JpZ2luLCBzZW5kUmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogYFVua25vd24gZEFwcCBtZXNzYWdlIHR5cGU6ICR7dHlwZX1gIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKGBEYXBwSGFuZGxlciBlcnJvciBmb3IgJHt0eXBlfTpgLCBlcnJvcik7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBzaW5nbGUgcGVuZGluZyByZXF1ZXN0IGJ5IElEIChpbi1tZW1vcnkgbG9va3VwIG9ubHkpLlxuICAgICAqIFVzZWQgZXh0ZXJuYWxseSBieSB0aGUgYmFja2dyb3VuZCBzY3JpcHQgdG8gcmV0cmlldmUgcmVxdWVzdCBkYXRhIGZvciB0aGUgYXBwcm92YWwgVUkuXG4gICAgICovXG4gICAgZ2V0UGVuZGluZ1JlcXVlc3QocmVxdWVzdElkOiBzdHJpbmcpOiBQZW5kaW5nRGFwcFJlcXVlc3QgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5wZW5kaW5nUmVxdWVzdHMuZ2V0KHJlcXVlc3RJZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbGwgY3VycmVudGx5IHBlbmRpbmcgcmVxdWVzdHMgKGluLW1lbW9yeSkuXG4gICAgICogVXNlZCBleHRlcm5hbGx5IHRvIHJlbmRlciBhIGxpc3Qgb2Ygb3V0c3RhbmRpbmcgYXBwcm92YWxzLlxuICAgICAqL1xuICAgIGdldEFsbFBlbmRpbmdSZXF1ZXN0cygpOiBQZW5kaW5nRGFwcFJlcXVlc3RbXSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMucGVuZGluZ1JlcXVlc3RzLnZhbHVlcygpKTtcbiAgICB9XG5cbiAgICAvLyDilIDilIDilIAgQnJvYWRjYXN0IGhlbHBlcnMgKHB1YmxpYyDigJQgY2FsbGVkIGZyb20gb3V0c2lkZSB0aGUgY2xhc3MpIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gICAgLyoqXG4gICAgICogQnJvYWRjYXN0cyBhbiBgYWNjb3VudHNDaGFuZ2VkYCBldmVudCB0byBldmVyeSBub24tZXh0ZW5zaW9uIHRhYi5cbiAgICAgKiBDYWxsZWQgd2hlbiB0aGUgYWN0aXZlIHdhbGxldCBhY2NvdW50IGNoYW5nZXMgZ2xvYmFsbHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYWNjb3VudHMgLSBOZXcgYWNjb3VudCBsaXN0IChlbXB0eSBhcnJheSA9IGRpc2Nvbm5lY3RlZCkuXG4gICAgICovXG4gICAgYXN5bmMgYnJvYWRjYXN0QWNjb3VudHNDaGFuZ2VkKGFjY291bnRzOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLl9icm9hZGNhc3RUb0FsbFRhYnMoXCJEQVBQX0FDQ09VTlRTX0NIQU5HRURcIiwgeyBhY2NvdW50cyB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCcm9hZGNhc3RzIGFuIGBhY2NvdW50c0NoYW5nZWRgIGV2ZW50IG9ubHkgdG8gdGFicyB3aG9zZSBvcmlnaW4gbWF0Y2hlc1xuICAgICAqIGB0YXJnZXRPcmlnaW5gLiBVc2VkIHdoZW4gYSBzaW5nbGUgc2l0ZSBpcyBmb3JjZS1kaXNjb25uZWN0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdGFyZ2V0T3JpZ2luIC0gVGhlIG9yaWdpbiB0byB0YXJnZXQgKGUuZy4gXCJodHRwczovL2FwcC51bmlzd2FwLm9yZ1wiKS5cbiAgICAgKiBAcGFyYW0gYWNjb3VudHMgICAgIC0gTmV3IGFjY291bnQgbGlzdCAoZW1wdHkgYXJyYXkgPSBkaXNjb25uZWN0ZWQpLlxuICAgICAqL1xuICAgIGFzeW5jIGJyb2FkY2FzdEFjY291bnRzQ2hhbmdlZEJ5T3JpZ2luKHRhcmdldE9yaWdpbjogc3RyaW5nLCBhY2NvdW50czogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHRhYnMgPSB0aGlzLmJyb3dzZXJBcGkudGFicyBhcyBhbnk7XG4gICAgICAgICAgICBpZiAoIXRhYnM/LnF1ZXJ5IHx8ICF0YWJzPy5zZW5kTWVzc2FnZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBhbGxUYWJzID0gYXdhaXQgdGFicy5xdWVyeSh7fSk7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgdGFiIG9mIGFsbFRhYnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRhYi5pZCB8fCAhdGFiLnVybCB8fCB0YWIudXJsLnN0YXJ0c1dpdGgoXCJjaHJvbWUtZXh0ZW5zaW9uOi8vXCIpKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhYk9yaWdpbiA9IG5ldyBVUkwodGFiLnVybCkub3JpZ2luO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGFiT3JpZ2luID09PSB0YXJnZXRPcmlnaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJEQVBQX0FDQ09VTlRTX0NIQU5HRURcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXlsb2FkOiB7IGFjY291bnRzIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZ25vcmUgVVJMIHBhcnNpbmcgZXJyb3JzIG9yIHRhYnMgd2l0aG91dCBhIGNvbnRlbnQgc2NyaXB0XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKGBFcnJvciBicm9hZGNhc3RpbmcgYWNjb3VudHMgY2hhbmdlIGZvciBvcmlnaW4gJHt0YXJnZXRPcmlnaW59OmAsIGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOKUgOKUgOKUgCBDb25uZWN0aW9uIGhhbmRsZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyBldGhfcmVxdWVzdEFjY291bnRzIC8gd2FsbGV0X2Nvbm5lY3QuXG4gICAgICpcbiAgICAgKiBGbG93OlxuICAgICAqIDEuIElmIHRoZSBvcmlnaW4gYWxyZWFkeSBoYXMgYSB2YWxpZCBwZXJtaXNzaW9uLCByZXR1cm4gdGhlIGNhY2hlZCBhY2NvdW50cyBpbW1lZGlhdGVseS5cbiAgICAgKiAyLiBJZiBhbm90aGVyIGNvbm5lY3QgZm9yIHRoaXMgb3JpZ2luIGlzIGFscmVhZHkgaW4tZmxpZ2h0IChhbmQgc3RpbGwgYWxpdmUpLCBjb2FsZXNjZVxuICAgICAqICAgIHRoZSByZXF1ZXN0IHNvIG9ubHkgb25lIGFwcHJvdmFsIHBvcHVwIGlzIHNob3duLlxuICAgICAqIDMuIE90aGVyd2lzZSwgb3BlbiBhIGZyZXNoIGFwcHJvdmFsIFVJIHBvcHVwLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJlcXVlc3RJZCAtIFVuaXF1ZSByZXF1ZXN0IElEIGZyb20gdGhlIGRBcHAuXG4gICAgICogQHBhcmFtIG9yaWdpbiAgICAtIFJlcXVlc3RpbmcgZEFwcCBvcmlnaW4uXG4gICAgICogQHBhcmFtIHBheWxvYWQgICAtIE9yaWdpbmFsIHJlcXVlc3QgcGF5bG9hZCAobWF5IGNvbnRhaW4gY2hhaW5JZCwgbWV0aG9kKS5cbiAgICAgKiBAcGFyYW0gdGFiSWQgICAgIC0gVGFiIElEIG9mIHRoZSBkQXBwICh1c2VkIHRvIHB1c2ggdGhlIHJlc3BvbnNlIGJhY2spLlxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgX2hhbmRsZUNvbm5lY3Rpb25SZXF1ZXN0KHJlcXVlc3RJZDogc3RyaW5nLCBvcmlnaW46IHN0cmluZywgcGF5bG9hZDogYW55LCB0YWJJZD86IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICAvLyBTaG9ydC1jaXJjdWl0OiBvcmlnaW4gYWxyZWFkeSBjb25uZWN0ZWQg4oCUIHJldHVybiBjYWNoZWQgYWNjb3VudHMgd2l0aG91dCBvcGVuaW5nIFVJLlxuICAgICAgICBjb25zdCBleGlzdGluZ1Blcm1pc3Npb24gPSBhd2FpdCB0aGlzLl9nZXRQZXJtaXNzaW9uKG9yaWdpbik7XG4gICAgICAgIGNvbnN0IGlzUmVxdWVzdFBlcm1pc3Npb25zID0gcGF5bG9hZD8ubWV0aG9kID09PSBcIndhbGxldF9yZXF1ZXN0UGVybWlzc2lvbnNcIjtcblxuICAgICAgICBpZiAoZXhpc3RpbmdQZXJtaXNzaW9uICYmIGV4aXN0aW5nUGVybWlzc2lvbi5hY2NvdW50cy5sZW5ndGggPiAwICYmICFpc1JlcXVlc3RQZXJtaXNzaW9ucykge1xuICAgICAgICAgICAgdGhpcy5fcmVzb2x2ZVJlcXVlc3QocmVxdWVzdElkLCBleGlzdGluZ1Blcm1pc3Npb24uYWNjb3VudHMpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5fbm90aWZ5VGFiKHRhYklkLCBcIkRBUFBfUFJPVklERVJfUkVTUE9OU0VcIiwge1xuICAgICAgICAgICAgICAgIHJlcXVlc3RJZCxcbiAgICAgICAgICAgICAgICByZXN1bHQ6IGV4aXN0aW5nUGVybWlzc2lvbi5hY2NvdW50cyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29hbGVzY2U6IGpvaW4gYW4gZXhpc3RpbmcgaW4tZmxpZ2h0IGNvbm5lY3QgcXVldWUgZm9yIHRoaXMgb3JpZ2luLlxuICAgICAgICBpZiAodGhpcy5fdHJ5Q29hbGVzY2VDb25uZWN0KG9yaWdpbiwgcmVxdWVzdElkLCB0YWJJZCkpIHJldHVybjtcblxuICAgICAgICAvLyBObyBleGlzdGluZyBjb25uZWN0IGluLWZsaWdodCDigJQgcmVnaXN0ZXIgYXMgdGhlIGxlYWRlciBhbmQgb3BlbiB0aGUgVUkuXG4gICAgICAgIHRoaXMucGVuZGluZ0Nvbm5lY3RzQnlPcmlnaW4uc2V0KG9yaWdpbiwgW3sgcmVxdWVzdElkLCB0YWJJZCB9XSk7XG5cbiAgICAgICAgY29uc3QgY2hhaW5JZCA9IGF3YWl0IHRoaXMuX3Jlc29sdmVDaGFpbklkRm9yQ29ubmVjdChvcmlnaW4sIHBheWxvYWQpO1xuXG4gICAgICAgIGNvbnN0IHBlbmRpbmdSZXF1ZXN0OiBQZW5kaW5nRGFwcFJlcXVlc3QgPSB7XG4gICAgICAgICAgICBpZDogcmVxdWVzdElkLFxuICAgICAgICAgICAgdHlwZTogXCJEQVBQX0NPTk5FQ1RcIixcbiAgICAgICAgICAgIG9yaWdpbixcbiAgICAgICAgICAgIHRhYklkLFxuICAgICAgICAgICAgbWV0aG9kOiBcImV0aF9yZXF1ZXN0QWNjb3VudHNcIixcbiAgICAgICAgICAgIHBhcmFtczogcGF5bG9hZCxcbiAgICAgICAgICAgIGNoYWluSWQsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgICAgICB0aW1lb3V0TXM6IERBUFBfUkVRVUVTVF9USU1FT1VUX01TLFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuX2FkZFBlbmRpbmdSZXF1ZXN0KHBlbmRpbmdSZXF1ZXN0KTtcbiAgICAgICAgYXdhaXQgdGhpcy5fcGVyc2lzdFBlbmRpbmdUb1N0b3JhZ2UocmVxdWVzdElkLCBwZW5kaW5nUmVxdWVzdCk7XG4gICAgICAgIGF3YWl0IHRoaXMuX29wZW5BcHByb3ZhbFVJKFwiY29ubmVjdFwiLCByZXF1ZXN0SWQsIHRhYklkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIGV0aF9hY2NvdW50cyDigJQgcmV0dXJucyB0aGUgc3RvcmVkIGFjY291bnRzIGZvciBhbiBvcmlnaW4gd2l0aG91dFxuICAgICAqIHRyaWdnZXJpbmcgYW55IHVzZXIgaW50ZXJhY3Rpb24uIFVwZGF0ZXMgYGxhc3RVc2VkYCB0aW1lc3RhbXAgb24gdGhlIHBlcm1pc3Npb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3JpZ2luICAgICAgIC0gZEFwcCBvcmlnaW4uXG4gICAgICogQHBhcmFtIHNlbmRSZXNwb25zZSAtIENocm9tZSBleHRlbnNpb24gc2VuZFJlc3BvbnNlIGNhbGxiYWNrLlxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgX2hhbmRsZUdldEFjY291bnRzKG9yaWdpbjogc3RyaW5nLCBzZW5kUmVzcG9uc2U6IChyZXNwb25zZTogYW55KSA9PiB2b2lkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IHBlcm1pc3Npb24gPSBhd2FpdCB0aGlzLl9nZXRQZXJtaXNzaW9uKG9yaWdpbik7XG5cbiAgICAgICAgaWYgKHBlcm1pc3Npb24pIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb24ubGFzdFVzZWQgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5fc2F2ZVBlcm1pc3Npb24ocGVybWlzc2lvbik7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBwZXJtaXNzaW9uLmFjY291bnRzIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogW10gfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIGV0aF9zZW5kVHJhbnNhY3Rpb24gLyBldGhfc2lnblRyYW5zYWN0aW9uLlxuICAgICAqIFJlcXVpcmVzIHRoZSBvcmlnaW4gdG8gaGF2ZSBhbiBleGlzdGluZyBwZXJtaXNzaW9uICh3YWxsZXQgbXVzdCBiZSBjb25uZWN0ZWQgZmlyc3QpLlxuICAgICAqIE9wZW5zIHRoZSBzaWduaW5nIGFwcHJvdmFsIFVJIHBvcHVwLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJlcXVlc3RJZCAtIFVuaXF1ZSByZXF1ZXN0IElELlxuICAgICAqIEBwYXJhbSBvcmlnaW4gICAgLSBkQXBwIG9yaWdpbi5cbiAgICAgKiBAcGFyYW0gcGF5bG9hZCAgIC0gVHJhbnNhY3Rpb24gcGFyYW1zLlxuICAgICAqIEBwYXJhbSB0YWJJZCAgICAgLSBPcmlnaW5hdGluZyB0YWIgKGZvciBwdXNoLWJhY2sgcmVzcG9uc2UpLlxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgX2hhbmRsZVNpZ25UcmFuc2FjdGlvbihyZXF1ZXN0SWQ6IHN0cmluZywgb3JpZ2luOiBzdHJpbmcsIHBheWxvYWQ6IGFueSwgdGFiSWQ/OiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKCFhd2FpdCB0aGlzLl9yZXF1aXJlUGVybWlzc2lvbihvcmlnaW4sIHJlcXVlc3RJZCwgdGFiSWQpKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgdHhQYXJhbXMgPSBwYXlsb2FkPy5wYXJhbXMgfHwgcGF5bG9hZDtcbiAgICAgICAgY29uc3QgdHhDaGFpbklkID0gcGF5bG9hZD8uY2hhaW5JZCB8fCAoQXJyYXkuaXNBcnJheSh0eFBhcmFtcykgJiYgdHhQYXJhbXNbMF0/LmNoYWluSWQgPyBwYXJzZUludCh0eFBhcmFtc1swXS5jaGFpbklkLCAxNikgOiB1bmRlZmluZWQpO1xuICAgICAgICBjb25zdCByZXNvbHZlZENoYWluSWQgPSB0eENoYWluSWQgfHwgKGF3YWl0IHRoaXMuX2dldEFjdGl2ZUNoYWluSWQob3JpZ2luKSk7XG5cbiAgICAgICAgY29uc3QgcGVuZGluZ1JlcXVlc3Q6IFBlbmRpbmdEYXBwUmVxdWVzdCA9IHtcbiAgICAgICAgICAgIGlkOiByZXF1ZXN0SWQsXG4gICAgICAgICAgICB0eXBlOiBcIkRBUFBfU0lHTl9UUkFOU0FDVElPTlwiLFxuICAgICAgICAgICAgb3JpZ2luLFxuICAgICAgICAgICAgdGFiSWQsXG4gICAgICAgICAgICBtZXRob2Q6IHBheWxvYWQ/Lm1ldGhvZCB8fCBcImV0aF9zZW5kVHJhbnNhY3Rpb25cIixcbiAgICAgICAgICAgIHBhcmFtczogdHhQYXJhbXMsXG4gICAgICAgICAgICBjaGFpbklkOiByZXNvbHZlZENoYWluSWQsXG4gICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXG4gICAgICAgICAgICB0aW1lb3V0TXM6IERBUFBfUkVRVUVTVF9USU1FT1VUX01TLFxuICAgICAgICB9O1xuXG4gICAgICAgIGF3YWl0IHRoaXMuX3JlZ2lzdGVyQW5kU2hvd1NpZ25pbmdSZXF1ZXN0KHBlbmRpbmdSZXF1ZXN0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGVzIHBlcnNvbmFsX3NpZ24gLyBldGhfc2lnblR5cGVkRGF0YV92NCBldGMuXG4gICAgICogUmVxdWlyZXMgdGhlIG9yaWdpbiB0byBoYXZlIGFuIGV4aXN0aW5nIHBlcm1pc3Npb24uXG4gICAgICogT3BlbnMgdGhlIHNpZ25pbmcgYXBwcm92YWwgVUkgcG9wdXAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVxdWVzdElkIC0gVW5pcXVlIHJlcXVlc3QgSUQuXG4gICAgICogQHBhcmFtIG9yaWdpbiAgICAtIGRBcHAgb3JpZ2luLlxuICAgICAqIEBwYXJhbSBwYXlsb2FkICAgLSBTaWduaW5nIHBhcmFtcyAobWV0aG9kICsgcGFyYW1zIGFycmF5KS5cbiAgICAgKiBAcGFyYW0gdGFiSWQgICAgIC0gT3JpZ2luYXRpbmcgdGFiLlxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgX2hhbmRsZVNpZ25NZXNzYWdlKHJlcXVlc3RJZDogc3RyaW5nLCBvcmlnaW46IHN0cmluZywgcGF5bG9hZDogYW55LCB0YWJJZD86IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBpZiAoIWF3YWl0IHRoaXMuX3JlcXVpcmVQZXJtaXNzaW9uKG9yaWdpbiwgcmVxdWVzdElkLCB0YWJJZCkpIHJldHVybjtcblxuICAgICAgICBjb25zdCByZXNvbHZlZENoYWluSWQgPSBhd2FpdCB0aGlzLl9nZXRBY3RpdmVDaGFpbklkKG9yaWdpbik7XG5cbiAgICAgICAgY29uc3QgcGVuZGluZ1JlcXVlc3Q6IFBlbmRpbmdEYXBwUmVxdWVzdCA9IHtcbiAgICAgICAgICAgIGlkOiByZXF1ZXN0SWQsXG4gICAgICAgICAgICB0eXBlOiBcIkRBUFBfU0lHTl9NRVNTQUdFXCIsXG4gICAgICAgICAgICBvcmlnaW4sXG4gICAgICAgICAgICB0YWJJZCxcbiAgICAgICAgICAgIG1ldGhvZDogcGF5bG9hZD8ubWV0aG9kIHx8IFwicGVyc29uYWxfc2lnblwiLFxuICAgICAgICAgICAgcGFyYW1zOiBwYXlsb2FkPy5wYXJhbXMgfHwgcGF5bG9hZCxcbiAgICAgICAgICAgIGNoYWluSWQ6IHJlc29sdmVkQ2hhaW5JZCxcbiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIHRpbWVvdXRNczogREFQUF9SRVFVRVNUX1RJTUVPVVRfTVMsXG4gICAgICAgIH07XG5cbiAgICAgICAgYXdhaXQgdGhpcy5fcmVnaXN0ZXJBbmRTaG93U2lnbmluZ1JlcXVlc3QocGVuZGluZ1JlcXVlc3QpO1xuICAgIH1cblxuICAgIC8vIOKUgOKUgOKUgCBDaGFpbiBoYW5kbGVycyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgd2FsbGV0X3N3aXRjaEV0aGVyZXVtQ2hhaW4uXG4gICAgICogVmFsaWRhdGVzIHRoZSByZXF1ZXN0ZWQgY2hhaW4gaXMgc3VwcG9ydGVkLCB1cGRhdGVzIHRoZSBzdG9yZWQgcGVybWlzc2lvbidzXG4gICAgICogY2hhaW5JZCwgYW5kIGJyb2FkY2FzdHMgYSBjaGFpbkNoYW5nZWQgZXZlbnQgdG8gYWxsIHRhYnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVxdWVzdElkICAgIC0gVW51c2VkIGhlcmUgYnV0IGtlcHQgZm9yIHNpZ25hdHVyZSBjb25zaXN0ZW5jeS5cbiAgICAgKiBAcGFyYW0gb3JpZ2luICAgICAgIC0gZEFwcCBvcmlnaW4uXG4gICAgICogQHBhcmFtIHBheWxvYWQgICAgICAtIENvbnRhaW5zIHRoZSB0YXJnZXQgY2hhaW5JZCAoaGV4IHN0cmluZykuXG4gICAgICogQHBhcmFtIHNlbmRSZXNwb25zZSAtIFN5bmNocm9ub3VzIHJlc3BvbnNlIGNhbGxiYWNrLlxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgX2hhbmRsZVN3aXRjaENoYWluKHJlcXVlc3RJZDogc3RyaW5nLCBvcmlnaW46IHN0cmluZywgcGF5bG9hZDogYW55LCBzZW5kUmVzcG9uc2U6IChyZXNwb25zZTogYW55KSA9PiB2b2lkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGNoYWluSWQgPSB0eXBlb2YgcGF5bG9hZD8uY2hhaW5JZCA9PT0gXCJzdHJpbmdcIiA/IHBhcnNlSW50KHBheWxvYWQuY2hhaW5JZCwgMTYpIDogcGF5bG9hZD8uY2hhaW5JZDtcblxuICAgICAgICBpZiAoIWlzU3VwcG9ydGVkQ2hhaW4oY2hhaW5JZCkpIHtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgICAgZXJyb3I6IHsgY29kZTogNDkwMiwgbWVzc2FnZTogYFVucmVjb2duaXplZCBjaGFpbiBJRCAke2NoYWluSWRUb0hleChjaGFpbklkKX0uIFRyeSBhZGRpbmcgdGhlIGNoYWluIGZpcnN0LmAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGVybWlzc2lvbiA9IGF3YWl0IHRoaXMuX2dldFBlcm1pc3Npb24ob3JpZ2luKTtcbiAgICAgICAgaWYgKHBlcm1pc3Npb24pIHtcbiAgICAgICAgICAgIHBlcm1pc3Npb24uY2hhaW5JZCA9IGNoYWluSWQ7XG4gICAgICAgICAgICBwZXJtaXNzaW9uLmxhc3RVc2VkID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX3NhdmVQZXJtaXNzaW9uKHBlcm1pc3Npb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgdGhpcy5fYnJvYWRjYXN0Q2hhaW5DaGFuZ2VkKGNoYWluSWQpO1xuICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlLCBkYXRhOiBudWxsIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZXMgd2FsbGV0X2FkZEV0aGVyZXVtQ2hhaW4uXG4gICAgICogWmVsZiBjdXJyZW50bHkgb25seSBzdXBwb3J0cyBjaGFpbnMgdGhhdCBhcmUgcHJlLWNvbmZpZ3VyZWQsIHNvIHRoaXMgZWl0aGVyXG4gICAgICogc3VjY2VlZHMgc2lsZW50bHkgKGNoYWluIGFscmVhZHkga25vd24pIG9yIHJldHVybnMgRUlQLTExOTMgZXJyb3IgNDkwMi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXlsb2FkICAgICAgLSBDb250YWlucyB0aGUgY2hhaW5JZCB0byBhZGQuXG4gICAgICogQHBhcmFtIHNlbmRSZXNwb25zZSAtIFN5bmNocm9ub3VzIHJlc3BvbnNlIGNhbGxiYWNrLlxuICAgICAqL1xuICAgIHByaXZhdGUgX2hhbmRsZUFkZENoYWluKHBheWxvYWQ6IGFueSwgc2VuZFJlc3BvbnNlOiAocmVzcG9uc2U6IGFueSkgPT4gdm9pZCk6IHZvaWQge1xuICAgICAgICBjb25zdCBjaGFpbklkID0gdHlwZW9mIHBheWxvYWQ/LmNoYWluSWQgPT09IFwic3RyaW5nXCIgPyBwYXJzZUludChwYXlsb2FkLmNoYWluSWQsIDE2KSA6IHBheWxvYWQ/LmNoYWluSWQ7XG5cbiAgICAgICAgaWYgKGlzU3VwcG9ydGVkQ2hhaW4oY2hhaW5JZCkpIHtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IG51bGwgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGVycm9yOiB7IGNvZGU6IDQ5MDIsIG1lc3NhZ2U6IFwiWmVsZiBXYWxsZXQgZG9lcyBub3Qgc3VwcG9ydCBhZGRpbmcgY3VzdG9tIGNoYWlucyBhdCB0aGlzIHRpbWUuXCIgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyBldGhfY2hhaW5JZCDigJQgcmV0dXJucyB0aGUgaGV4IGNoYWluIElEIGN1cnJlbnRseSBhY3RpdmUgZm9yIHRoZSBvcmlnaW4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3JpZ2luICAgICAgIC0gZEFwcCBvcmlnaW4uXG4gICAgICogQHBhcmFtIHNlbmRSZXNwb25zZSAtIFN5bmNocm9ub3VzIHJlc3BvbnNlIGNhbGxiYWNrLlxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgX2hhbmRsZUdldENoYWluSWQob3JpZ2luOiBzdHJpbmcsIHNlbmRSZXNwb25zZTogKHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgY2hhaW5JZCA9IGF3YWl0IHRoaXMuX2dldEFjdGl2ZUNoYWluSWQob3JpZ2luKTtcbiAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogY2hhaW5JZFRvSGV4KGNoYWluSWQpIH0pO1xuICAgIH1cblxuICAgIC8vIOKUgOKUgOKUgCBEaXNjb25uZWN0IGhhbmRsZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlcyB3YWxsZXRfcmV2b2tlUGVybWlzc2lvbnMgKHVzZXItaW5pdGlhdGVkIGRpc2Nvbm5lY3QgZnJvbSB0aGUgZEFwcCkuXG4gICAgICogUmVtb3ZlcyB0aGUgc3RvcmVkIHBlcm1pc3Npb24gYW5kIGNsZWFycyBhbnkgc3RhbGUgY29hbGVzY2luZyBzdGF0ZSBmb3IgdGhlIG9yaWdpbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcmlnaW4gICAgICAgLSBkQXBwIG9yaWdpbiB0byBkaXNjb25uZWN0LlxuICAgICAqIEBwYXJhbSBzZW5kUmVzcG9uc2UgLSBTeW5jaHJvbm91cyByZXNwb25zZSBjYWxsYmFjay5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIF9oYW5kbGVEaXNjb25uZWN0KG9yaWdpbjogc3RyaW5nLCBzZW5kUmVzcG9uc2U6IChyZXNwb25zZTogYW55KSA9PiB2b2lkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGF3YWl0IHRoaXMuX3JlbW92ZVBlcm1pc3Npb24ob3JpZ2luKTtcbiAgICAgICAgLy8gQ2xlYXIgYW55IHN0YWxlIGNvYWxlc2NlZCBjb25uZWN0IGVudHJ5IHNvIGEgc3Vic2VxdWVudCByZWNvbm5lY3RcbiAgICAgICAgLy8gZG9lc24ndCBzaWxlbnRseSBwaWdneWJhY2sgb24gYSBkZWFkIHNlc3Npb24uXG4gICAgICAgIHRoaXMucGVuZGluZ0Nvbm5lY3RzQnlPcmlnaW4uZGVsZXRlKG9yaWdpbik7XG4gICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRtaW4taW5pdGlhdGVkIGZvcmNlLWRpc2Nvbm5lY3Qgb2YgYSBzaW5nbGUgb3JpZ2luLlxuICAgICAqIFJlbW92ZXMgaXRzIHBlcm1pc3Npb24gYW5kIHB1c2hlcyBhbiBgYWNjb3VudHNDaGFuZ2VkKFtdKWAgZXZlbnQgdG8gYWxsIGl0cyB0YWJzLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9yaWdpbiAgICAgICAtIGRBcHAgb3JpZ2luIHRvIGZvcmNlLWRpc2Nvbm5lY3QuXG4gICAgICogQHBhcmFtIHNlbmRSZXNwb25zZSAtIFN5bmNocm9ub3VzIHJlc3BvbnNlIGNhbGxiYWNrLlxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgX2hhbmRsZUZvcmNlRGlzY29ubmVjdFNpdGUob3JpZ2luOiBzdHJpbmcsIHNlbmRSZXNwb25zZTogKHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKCFvcmlnaW4pIHtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJPcmlnaW4gaXMgcmVxdWlyZWRcIiB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9yZW1vdmVQZXJtaXNzaW9uKG9yaWdpbik7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlIH0pO1xuICAgICAgICAgICAgdm9pZCB0aGlzLmJyb2FkY2FzdEFjY291bnRzQ2hhbmdlZEJ5T3JpZ2luKG9yaWdpbiwgW10pO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiRmFpbGVkIHRvIGZvcmNlIGRpc2Nvbm5lY3Qgc2l0ZTpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZG1pbi1pbml0aWF0ZWQgZm9yY2UtZGlzY29ubmVjdCBvZiBBTEwgb3JpZ2lucy5cbiAgICAgKiBXaXBlcyB0aGUgZW50aXJlIHBlcm1pc3Npb25zIG9iamVjdCBhbmQgYnJvYWRjYXN0cyBgYWNjb3VudHNDaGFuZ2VkKFtdKWAgZ2xvYmFsbHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc2VuZFJlc3BvbnNlIC0gU3luY2hyb25vdXMgcmVzcG9uc2UgY2FsbGJhY2suXG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBfaGFuZGxlRm9yY2VEaXNjb25uZWN0QWxsKHNlbmRSZXNwb25zZTogKHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYnJvd3NlckFwaS5zZXRTdG9yYWdlSXRlbShQRVJNSVNTSU9OU19TVE9SQUdFX0tFWSwge30pO1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogdHJ1ZSB9KTtcbiAgICAgICAgICAgIHZvaWQgdGhpcy5icm9hZGNhc3RBY2NvdW50c0NoYW5nZWQoW10pO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiRmFpbGVkIHRvIGZvcmNlIGRpc2Nvbm5lY3QgYWxsIHNpdGVzOlwiLCBlcnJvcik7XG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IChlcnJvciBhcyBFcnJvcikubWVzc2FnZSB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOKUgOKUgOKUgCBQZW5kaW5nIHJlcXVlc3QgbGlmZWN5Y2xlIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gICAgLyoqXG4gICAgICogUmV0cmlldmVzIGFuZCByZXR1cm5zIHRoZSBkYXRhIGZvciBhIHBlbmRpbmcgcmVxdWVzdC5cbiAgICAgKiBDYWxsZWQgYnkgdGhlIGFwcHJvdmFsIFVJIHRvIHBvcHVsYXRlIGl0cyBkaXNwbGF5IChob3N0bmFtZSwgZmF2aWNvbiwgcGFyYW1zLCBldGMuKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByZXF1ZXN0SWQgICAgLSBUaGUgcGVuZGluZyByZXF1ZXN0IHRvIGZldGNoLlxuICAgICAqIEBwYXJhbSBzZW5kUmVzcG9uc2UgLSBTeW5jaHJvbm91cyByZXNwb25zZSBjYWxsYmFjay5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIF9oYW5kbGVHZXRQZW5kaW5nKHJlcXVlc3RJZDogc3RyaW5nLCBzZW5kUmVzcG9uc2U6IChyZXNwb25zZTogYW55KSA9PiB2b2lkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IHBlbmRpbmcgPSBhd2FpdCB0aGlzLl9nZXRQZW5kaW5nUmVxdWVzdChyZXF1ZXN0SWQpO1xuXG4gICAgICAgIGlmICghcGVuZGluZykge1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIk5vIHBlbmRpbmcgcmVxdWVzdCBmb3VuZFwiIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaG9zdG5hbWUgPSB0aGlzLl9nZXRIb3N0bmFtZShwZW5kaW5nLm9yaWdpbik7XG4gICAgICAgIGNvbnN0IGNoYWluSWQgPSBwZW5kaW5nLmNoYWluSWQgfHwgKGF3YWl0IHRoaXMuX2dldEFjdGl2ZUNoYWluSWQocGVuZGluZy5vcmlnaW4pKTtcblxuICAgICAgICBzZW5kUmVzcG9uc2Uoe1xuICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBvcmlnaW46IHBlbmRpbmcub3JpZ2luLFxuICAgICAgICAgICAgICAgIGhvc3RuYW1lLFxuICAgICAgICAgICAgICAgIGZhdmljb246IGBodHRwczovL3d3dy5nb29nbGUuY29tL3MyL2Zhdmljb25zP2RvbWFpbj0ke2hvc3RuYW1lfSZzej02NGAsXG4gICAgICAgICAgICAgICAgY2hhaW5JZCxcbiAgICAgICAgICAgICAgICBtZXRob2Q6IHBlbmRpbmcubWV0aG9kLFxuICAgICAgICAgICAgICAgIHBhcmFtczogcGVuZGluZy5wYXJhbXMsXG4gICAgICAgICAgICAgICAgdmVyaWZ5U3RhdHVzOiBcIlVOS05PV05cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb2Nlc3NlcyB0aGUgcmVzdWx0IG9mIGEgY29ubmVjdGlvbiBhcHByb3ZhbC9yZWplY3Rpb24gZnJvbSB0aGUgZXh0ZW5zaW9uIFVJLlxuICAgICAqXG4gICAgICogT24gYXBwcm92YWw6IHNhdmVzIHRoZSBncmFudGVkIHBlcm1pc3Npb24sIG5vdGlmaWVzIHRoZSBvcmlnaW5hdGluZyBkQXBwIHRhYixcbiAgICAgKiBhbmQgZmFucyBvdXQgdGhlIHNhbWUgcmVzdWx0IHRvIGFueSBjb2FsZXNjZWQgcmVxdWVzdHMgZm9yIHRoZSBzYW1lIG9yaWdpbi5cbiAgICAgKiBPbiByZWplY3Rpb246IHNlbmRzIGEgNDAwMSBlcnJvciB0byBhbGwgd2FpdGluZyByZXF1ZXN0cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwYXlsb2FkIC0gQ29udGFpbnMgcmVxdWVzdElkLCBhcHByb3ZlZCBmbGFnLCBhY2NvdW50cyBhcnJheSwgYW5kIGNoYWluSWQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBfaGFuZGxlQXBwcm92YWxSZXN1bHQocGF5bG9hZDogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IHsgcmVxdWVzdElkLCBhcHByb3ZlZCwgYWNjb3VudHMsIGNoYWluSWQgfSA9IHBheWxvYWQ7XG4gICAgICAgIGNvbnN0IHBlbmRpbmcgPSBhd2FpdCB0aGlzLl9nZXRQZW5kaW5nUmVxdWVzdChyZXF1ZXN0SWQpO1xuXG4gICAgICAgIGlmICghcGVuZGluZykge1xuICAgICAgICAgICAgTG9nZ2VyLndhcm4oYE5vIHBlbmRpbmcgZEFwcCBhcHByb3ZhbCByZXF1ZXN0IGZvdW5kIGZvciAke3JlcXVlc3RJZH1gKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhcHByb3ZlZCAmJiBhY2NvdW50cykge1xuICAgICAgICAgICAgYXdhaXQgdGhpcy5fc2F2ZVBlcm1pc3Npb24oe1xuICAgICAgICAgICAgICAgIG9yaWdpbjogcGVuZGluZy5vcmlnaW4sXG4gICAgICAgICAgICAgICAgYWNjb3VudHMsXG4gICAgICAgICAgICAgICAgY2hhaW5JZDogY2hhaW5JZCB8fCAxNDA0LFxuICAgICAgICAgICAgICAgIGNvbm5lY3RlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICAgIGxhc3RVc2VkOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXNwb25zZVBheWxvYWQgPSBhcHByb3ZlZCAmJiBhY2NvdW50c1xuICAgICAgICAgICAgPyB7IHJlc3VsdDogYWNjb3VudHMgfVxuICAgICAgICAgICAgOiB7IGVycm9yOiB7IGNvZGU6IDQwMDEsIG1lc3NhZ2U6IFwiVXNlciByZWplY3RlZCB0aGUgcmVxdWVzdFwiIH0gfTtcblxuICAgICAgICB0aGlzLl9yZW1vdmVQZW5kaW5nUmVxdWVzdChyZXF1ZXN0SWQpO1xuXG4gICAgICAgIHZvaWQgdGhpcy5fbm90aWZ5VGFiKHBlbmRpbmcudGFiSWQsIFwiREFQUF9QUk9WSURFUl9SRVNQT05TRVwiLCB7IHJlcXVlc3RJZCwgLi4ucmVzcG9uc2VQYXlsb2FkIH0pO1xuXG4gICAgICAgIC8vIEZhbiBvdXQgdGhlIHNhbWUgb3V0Y29tZSB0byBhbnkgY29hbGVzY2VkIHJlcXVlc3RzIGZvciB0aGlzIG9yaWdpbi5cbiAgICAgICAgdm9pZCB0aGlzLl9yZXNvbHZlQ29hbGVzY2VkQ29ubmVjdHMocGVuZGluZy5vcmlnaW4sIHJlc3BvbnNlUGF5bG9hZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUHJvY2Vzc2VzIHRoZSByZXN1bHQgb2YgYSBzaWduaW5nIG9wZXJhdGlvbiBmcm9tIHRoZSBleHRlbnNpb24gVUkuXG4gICAgICpcbiAgICAgKiBQdXNoZXMgZWl0aGVyIHRoZSBzaWduZWQgcmVzdWx0IG9yIGEgcmVqZWN0aW9uIGVycm9yIGJhY2sgdG8gdGhlIGRBcHAgdGFiLlxuICAgICAqXG4gICAgICogQHBhcmFtIHBheWxvYWQgLSBDb250YWlucyByZXF1ZXN0SWQsIHJlc3VsdCAoc2lnbmF0dXJlKSwgYW5kIG9wdGlvbmFsIGVycm9yLlxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgX2hhbmRsZVNpZ25pbmdSZXN1bHQocGF5bG9hZDogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IHsgcmVxdWVzdElkLCByZXN1bHQsIGVycm9yIH0gPSBwYXlsb2FkO1xuICAgICAgICBjb25zdCBwZW5kaW5nID0gYXdhaXQgdGhpcy5fZ2V0UGVuZGluZ1JlcXVlc3QocmVxdWVzdElkKTtcblxuICAgICAgICBpZiAoIXBlbmRpbmcpIHtcbiAgICAgICAgICAgIExvZ2dlci53YXJuKGBObyBwZW5kaW5nIGRBcHAgc2lnbmluZyByZXF1ZXN0IGZvdW5kIGZvciAke3JlcXVlc3RJZH1gKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlUGF5bG9hZCA9IHJlc3VsdFxuICAgICAgICAgICAgPyB7IHJlcXVlc3RJZCwgcmVzdWx0IH1cbiAgICAgICAgICAgIDogeyByZXF1ZXN0SWQsIGVycm9yOiBlcnJvciB8fCB7IGNvZGU6IDQwMDEsIG1lc3NhZ2U6IFwiVXNlciByZWplY3RlZCB0aGUgcmVxdWVzdFwiIH0gfTtcblxuICAgICAgICB0aGlzLl9yZW1vdmVQZW5kaW5nUmVxdWVzdChyZXF1ZXN0SWQpO1xuICAgICAgICB2b2lkIHRoaXMuX25vdGlmeVRhYihwZW5kaW5nLnRhYklkLCBcIkRBUFBfUFJPVklERVJfUkVTUE9OU0VcIiwgcmVzcG9uc2VQYXlsb2FkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDYW5jZWxzIGFsbCBwZW5kaW5nIHJlcXVlc3RzIG9yaWdpbmF0aW5nIGZyb20gYSBnaXZlbiBvcmlnaW4uXG4gICAgICogVXNlZCB3aGVuIHRoZSBkQXBwIGV4cGxpY2l0bHkgcmVxdWVzdHMgY2xlYW51cCAoZS5nLiBiZWZvcmUgcmUtY29ubmVjdGluZykuXG4gICAgICogQWxzbyB0cmlnZ2VycyBhIHN0b3JhZ2UgY2xlYW51cCBwYXNzLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9yaWdpbiAgICAgICAtIE9yaWdpbiB3aG9zZSBwZW5kaW5nIHJlcXVlc3RzIHNob3VsZCBiZSBjYW5jZWxsZWQuXG4gICAgICogQHBhcmFtIHNlbmRSZXNwb25zZSAtIFN5bmNocm9ub3VzIHJlc3BvbnNlIGNhbGxiYWNrLlxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgX2hhbmRsZUNhbmNlbFBlbmRpbmdGb3JPcmlnaW4ob3JpZ2luOiBzdHJpbmcsIHNlbmRSZXNwb25zZTogKHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHRvQ2FuY2VsID0gQXJyYXkuZnJvbSh0aGlzLnBlbmRpbmdSZXF1ZXN0cy52YWx1ZXMoKSkuZmlsdGVyKChyKSA9PiByLm9yaWdpbiA9PT0gb3JpZ2luKTtcblxuICAgICAgICAgICAgZm9yIChjb25zdCBwZW5kaW5nIG9mIHRvQ2FuY2VsKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fbm90aWZ5VGFiKHBlbmRpbmcudGFiSWQsIFwiREFQUF9QUk9WSURFUl9SRVNQT05TRVwiLCB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RJZDogcGVuZGluZy5pZCxcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IHsgY29kZTogNDAwMSwgbWVzc2FnZTogXCJDb25uZWN0aW9uIGNhbmNlbGxlZCAtIHByZXZpb3VzIHJlcXVlc3QgY2xlYXJlZFwiIH0sXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlUGVuZGluZ1JlcXVlc3QocGVuZGluZy5pZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0b0NhbmNlbC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgTG9nZ2VyLmluZm8oYFtEYXBwIENhbmNlbF0gQ2FuY2VsbGVkICR7dG9DYW5jZWwubGVuZ3RofSBwZW5kaW5nIHJlcXVlc3QocykgZm9yIG9yaWdpbiAke29yaWdpbn1gKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgdGhpcy5faGFuZGxlQ2xlYW51cFJlcXVlc3RzKHNlbmRSZXNwb25zZSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJbRGFwcCBDYW5jZWxdIEZhaWxlZCB0byBjYW5jZWwgcGVuZGluZyByZXF1ZXN0czpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTY2FucyBjaHJvbWUuc3RvcmFnZS5sb2NhbCBmb3IgcGVuZGluZy1yZXF1ZXN0IGVudHJpZXMgdGhhdCBhcmUgb3JwaGFuZWRcbiAgICAgKiAobm8gbG9uZ2VyIGluIG1lbW9yeSkgb3IgZXhwaXJlZCwgYW5kIHJlbW92ZXMgdGhlbS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzZW5kUmVzcG9uc2UgLSBTeW5jaHJvbm91cyByZXNwb25zZSBjYWxsYmFjayB3aXRoIGB7IHJlbW92ZWRDb3VudCB9YC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIF9oYW5kbGVDbGVhbnVwUmVxdWVzdHMoc2VuZFJlc3BvbnNlOiAocmVzcG9uc2U6IGFueSkgPT4gdm9pZCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgYWxsSXRlbXMgPSBhd2FpdCB0aGlzLmJyb3dzZXJBcGkuZ2V0QWxsU3RvcmFnZUl0ZW1zKCk7XG4gICAgICAgICAgICBjb25zdCBrZXlzVG9SZW1vdmU6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKGFsbEl0ZW1zKSkge1xuICAgICAgICAgICAgICAgIGlmICgha2V5LnN0YXJ0c1dpdGgoUEVORElOR19SRVFVRVNUX1NUT1JBR0VfUFJFRklYKSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0SWQgPSBrZXkucmVwbGFjZShQRU5ESU5HX1JFUVVFU1RfU1RPUkFHRV9QUkVGSVgsIFwiXCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0b3JlZCA9IHRoaXMuX25vcm1hbGl6ZVN0b3JlZFBlbmRpbmdSZXF1ZXN0KGFsbEl0ZW1zW2tleV0sIHJlcXVlc3RJZCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXN0b3JlZCB8fCB0aGlzLl9pc1N0b3JlZFBlbmRpbmdFeHBpcmVkKHN0b3JlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAga2V5c1RvUmVtb3ZlLnB1c2goa2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChrZXlzVG9SZW1vdmUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIExvZ2dlci5pbmZvKGBbRGFwcCBDbGVhbnVwXSBGb3VuZCAke2tleXNUb1JlbW92ZS5sZW5ndGh9IG9ycGhhbmVkIGRhcHAgcmVxdWVzdHMuIFJlbW92aW5nOmAsIGtleXNUb1JlbW92ZSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5icm93c2VyQXBpLnJlbW92ZVN0b3JhZ2VJdGVtcyhrZXlzVG9SZW1vdmUpO1xuICAgICAgICAgICAgICAgIExvZ2dlci5pbmZvKGBbRGFwcCBDbGVhbnVwXSBSZW1vdmVkICR7a2V5c1RvUmVtb3ZlLmxlbmd0aH0gb3JwaGFuZWQgcmVxdWVzdHMuYCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIExvZ2dlci5pbmZvKFwiW0RhcHAgQ2xlYW51cF0gTm8gb3JwaGFuZWQgZGFwcCByZXF1ZXN0cyBmb3VuZC5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUsIHJlbW92ZWRDb3VudDoga2V5c1RvUmVtb3ZlLmxlbmd0aCB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIExvZ2dlci5lcnJvcihcIltEYXBwIENsZWFudXBdIEZhaWxlZCB0byBjbGVhbnVwIGRhcHAgcmVxdWVzdHM6XCIsIGVycm9yKTtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8g4pSA4pSA4pSAIEluLW1lbW9yeSBwZW5kaW5nIHJlcXVlc3QgbWFuYWdlbWVudCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICAgIC8qKlxuICAgICAqIFJlZ2lzdGVycyBhIHBlbmRpbmcgcmVxdWVzdCBpbiBtZW1vcnkgYW5kIHNjaGVkdWxlcyBpdHMgYXV0by1leHBpcnkgdGltZW91dC5cbiAgICAgKiBJZiB0aGUgcmVxdWVzdCBpcyBhbHJlYWR5IGV4cGlyZWQgKGUuZy4gcmVzdG9yZWQgZnJvbSBvbGQgc3RvcmFnZSksIGV4cGlyZXMgaXQgaW1tZWRpYXRlbHkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVxdWVzdCAtIFRoZSBmdWxsIFBlbmRpbmdEYXBwUmVxdWVzdCB0byByZWdpc3Rlci5cbiAgICAgKi9cbiAgICBwcml2YXRlIF9hZGRQZW5kaW5nUmVxdWVzdChyZXF1ZXN0OiBQZW5kaW5nRGFwcFJlcXVlc3QpOiB2b2lkIHtcbiAgICAgICAgLy8gQ2FuY2VsIGFueSBwcmV2aW91cyB0aW1lb3V0IGZvciB0aGlzIElEIChoYW5kbGVzIHJlLXJlZ2lzdHJhdGlvbiBhZnRlciByZXN0b3JlKS5cbiAgICAgICAgY29uc3QgZXhpc3RpbmdUaW1lb3V0ID0gdGhpcy50aW1lb3V0SGFuZGxlcy5nZXQocmVxdWVzdC5pZCk7XG4gICAgICAgIGlmIChleGlzdGluZ1RpbWVvdXQpIGNsZWFyVGltZW91dChleGlzdGluZ1RpbWVvdXQpO1xuXG4gICAgICAgIHRoaXMucGVuZGluZ1JlcXVlc3RzLnNldChyZXF1ZXN0LmlkLCByZXF1ZXN0KTtcblxuICAgICAgICBjb25zdCByZW1haW5pbmdNcyA9IHJlcXVlc3QudGltZXN0YW1wICsgcmVxdWVzdC50aW1lb3V0TXMgLSBEYXRlLm5vdygpO1xuICAgICAgICBpZiAocmVtYWluaW5nTXMgPD0gMCkge1xuICAgICAgICAgICAgdm9pZCB0aGlzLl9leHBpcmVQZW5kaW5nUmVxdWVzdChyZXF1ZXN0LmlkKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHZvaWQgdGhpcy5fZXhwaXJlUGVuZGluZ1JlcXVlc3QocmVxdWVzdC5pZCksIHJlbWFpbmluZ01zKTtcbiAgICAgICAgdGhpcy50aW1lb3V0SGFuZGxlcy5zZXQocmVxdWVzdC5pZCwgdGltZW91dCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIHBlbmRpbmcgcmVxdWVzdCBmcm9tIG1lbW9yeSwgY2xlYXJzIGl0cyB0aW1lb3V0LCBhbmQgZGVsZXRlcyBpdCBmcm9tIHN0b3JhZ2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVxdWVzdElkIC0gSUQgb2YgdGhlIHJlcXVlc3QgdG8gcmVtb3ZlLlxuICAgICAqL1xuICAgIHByaXZhdGUgX3JlbW92ZVBlbmRpbmdSZXF1ZXN0KHJlcXVlc3RJZDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGVuZGluZ1JlcXVlc3RzLmRlbGV0ZShyZXF1ZXN0SWQpO1xuXG4gICAgICAgIGNvbnN0IHRpbWVvdXQgPSB0aGlzLnRpbWVvdXRIYW5kbGVzLmdldChyZXF1ZXN0SWQpO1xuICAgICAgICBpZiAodGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgdGhpcy50aW1lb3V0SGFuZGxlcy5kZWxldGUocmVxdWVzdElkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFsc28gY2xlYW4gdXAgYXBwcm92YWwgd2luZG93IG1hcHBpbmdzXG4gICAgICAgIGZvciAoY29uc3QgW3dpbklkLCByZXFJZF0gb2YgQXJyYXkuZnJvbSh0aGlzLmFwcHJvdmFsV2luZG93cy5lbnRyaWVzKCkpKSB7XG4gICAgICAgICAgICBpZiAocmVxSWQgPT09IHJlcXVlc3RJZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwcm92YWxXaW5kb3dzLmRlbGV0ZSh3aW5JZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJyb3dzZXJBcGkucmVtb3ZlU3RvcmFnZUl0ZW1zKHRoaXMuX2dldFBlbmRpbmdTdG9yYWdlS2V5KHJlcXVlc3RJZCkpLmNhdGNoKCgpID0+IHt9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXNvbHZlcyBhIHBlbmRpbmcgcmVxdWVzdCBzeW5jaHJvbm91c2x5ICh1c2luZyBhIHN0b3JlZCByZXNvbHZlIGNhbGxiYWNrKS5cbiAgICAgKiBVc2VkIHdoZW4gYW4gYWxyZWFkeS1jb25uZWN0ZWQgb3JpZ2luIHJlcXVlc3RzIGFjY291bnRzIGFuZCBubyBVSSBpcyBuZWVkZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVxdWVzdElkIC0gSUQgb2YgdGhlIHJlcXVlc3QgdG8gcmVzb2x2ZS5cbiAgICAgKiBAcGFyYW0gcmVzdWx0ICAgIC0gVmFsdWUgdG8gcmVzb2x2ZSB3aXRoLlxuICAgICAqL1xuICAgIHByaXZhdGUgX3Jlc29sdmVSZXF1ZXN0KHJlcXVlc3RJZDogc3RyaW5nLCByZXN1bHQ6IGFueSk6IHZvaWQge1xuICAgICAgICBjb25zdCBwZW5kaW5nID0gdGhpcy5wZW5kaW5nUmVxdWVzdHMuZ2V0KHJlcXVlc3RJZCk7XG4gICAgICAgIGlmIChwZW5kaW5nPy5yZXNvbHZlKSBwZW5kaW5nLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlUGVuZGluZ1JlcXVlc3QocmVxdWVzdElkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaXJlcyB0aGUgdGltZW91dCBlcnJvciBmb3IgYW4gZXhwaXJlZCByZXF1ZXN0OiBub3RpZmllcyB0aGUgZEFwcCB0YWIsXG4gICAgICogcmVzb2x2ZXMgYW55IGNvYWxlc2NlZCBjb25uZWN0cyB3aXRoIHRoZSBzYW1lIGVycm9yLCB0aGVuIHJlbW92ZXMgdGhlIHJlcXVlc3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVxdWVzdElkIC0gSUQgb2YgdGhlIGV4cGlyZWQgcmVxdWVzdC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIF9leHBpcmVQZW5kaW5nUmVxdWVzdChyZXF1ZXN0SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBwZW5kaW5nID0gdGhpcy5wZW5kaW5nUmVxdWVzdHMuZ2V0KHJlcXVlc3RJZCkgfHwgKGF3YWl0IHRoaXMuX2dldFN0b3JlZFBlbmRpbmdSZXF1ZXN0KHJlcXVlc3RJZCkpO1xuICAgICAgICBjb25zdCBlcnJvclBheWxvYWQgPSB7IGVycm9yOiB7IGNvZGU6IC0zMjAwMCwgbWVzc2FnZTogXCJSZXF1ZXN0IHRpbWVkIG91dFwiIH0gfTtcblxuICAgICAgICB0aGlzLl9yZW1vdmVQZW5kaW5nUmVxdWVzdChyZXF1ZXN0SWQpO1xuXG4gICAgICAgIGlmIChwZW5kaW5nKSB7XG4gICAgICAgICAgICB2b2lkIHRoaXMuX25vdGlmeVRhYihwZW5kaW5nLnRhYklkLCBcIkRBUFBfUFJPVklERVJfUkVTUE9OU0VcIiwgeyByZXF1ZXN0SWQsIC4uLmVycm9yUGF5bG9hZCB9KTtcbiAgICAgICAgICAgIHZvaWQgdGhpcy5fcmVzb2x2ZUNvYWxlc2NlZENvbm5lY3RzKHBlbmRpbmcub3JpZ2luLCBlcnJvclBheWxvYWQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTG9va3MgdXAgYSBwZW5kaW5nIHJlcXVlc3QsIGZhbGxpbmcgYmFjayB0byBzdG9yYWdlIGlmIG5vdCBmb3VuZCBpbiBtZW1vcnkuXG4gICAgICogUmUtcmVnaXN0ZXJzIHRoZSByZXF1ZXN0IGluIG1lbW9yeSBpZiBpdCB3YXMgZm91bmQgb25seSBpbiBzdG9yYWdlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJlcXVlc3RJZCAtIElEIG9mIHRoZSByZXF1ZXN0IHRvIGZpbmQuXG4gICAgICogQHJldHVybnMgVGhlIHJlcXVlc3QsIG9yIG51bGwgaWYgbm90IGZvdW5kIC8gZXhwaXJlZC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIF9nZXRQZW5kaW5nUmVxdWVzdChyZXF1ZXN0SWQ6IHN0cmluZyk6IFByb21pc2U8UGVuZGluZ0RhcHBSZXF1ZXN0IHwgbnVsbD4ge1xuICAgICAgICBjb25zdCBpbk1lbW9yeSA9IHRoaXMucGVuZGluZ1JlcXVlc3RzLmdldChyZXF1ZXN0SWQpO1xuICAgICAgICBpZiAoaW5NZW1vcnkpIHJldHVybiBpbk1lbW9yeTtcblxuICAgICAgICBjb25zdCBzdG9yZWQgPSBhd2FpdCB0aGlzLl9nZXRTdG9yZWRQZW5kaW5nUmVxdWVzdChyZXF1ZXN0SWQpO1xuICAgICAgICBpZiAoIXN0b3JlZCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgdGhpcy5fYWRkUGVuZGluZ1JlcXVlc3Qoc3RvcmVkKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucGVuZGluZ1JlcXVlc3RzLmdldChyZXF1ZXN0SWQpIHx8IHN0b3JlZDtcbiAgICB9XG5cbiAgICAvLyDilIDilIDilIAgU3RvcmFnZSBoZWxwZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gICAgLyoqXG4gICAgICogUGVyc2lzdHMgYSBwZW5kaW5nIHJlcXVlc3QgdG8gY2hyb21lLnN0b3JhZ2UubG9jYWwgc28gaXQgc3Vydml2ZXNcbiAgICAgKiBzZXJ2aWNlLXdvcmtlciByZXN0YXJ0cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByZXF1ZXN0SWQgLSBLZXkgdG8gc3RvcmUgdW5kZXIuXG4gICAgICogQHBhcmFtIHJlcXVlc3QgICAtIFRoZSByZXF1ZXN0IHRvIHBlcnNpc3QuXG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBfcGVyc2lzdFBlbmRpbmdUb1N0b3JhZ2UocmVxdWVzdElkOiBzdHJpbmcsIHJlcXVlc3Q6IFBlbmRpbmdEYXBwUmVxdWVzdCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLmJyb3dzZXJBcGkuc2V0U3RvcmFnZUl0ZW0odGhpcy5fZ2V0UGVuZGluZ1N0b3JhZ2VLZXkocmVxdWVzdElkKSwgdGhpcy5fYnVpbGRTdG9yZWRQZW5kaW5nUmVxdWVzdChyZXF1ZXN0KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVhZHMgYW5kIHZhbGlkYXRlcyBhIHNpbmdsZSBwZW5kaW5nIHJlcXVlc3QgZGlyZWN0bHkgZnJvbSBzdG9yYWdlLlxuICAgICAqIFJldHVybnMgbnVsbCBpZiB0aGUgZW50cnkgaXMgbWlzc2luZywgbWFsZm9ybWVkLCBvciBleHBpcmVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHJlcXVlc3RJZCAtIElEIG9mIHRoZSByZXF1ZXN0IHRvIGxvYWQuXG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBfZ2V0U3RvcmVkUGVuZGluZ1JlcXVlc3QocmVxdWVzdElkOiBzdHJpbmcpOiBQcm9taXNlPFN0b3JlZFBlbmRpbmdEYXBwUmVxdWVzdCB8IG51bGw+IHtcbiAgICAgICAgY29uc3Qgc3RvcmVkID0gYXdhaXQgdGhpcy5icm93c2VyQXBpLmdldFN0b3JhZ2VJdGVtKHRoaXMuX2dldFBlbmRpbmdTdG9yYWdlS2V5KHJlcXVlc3RJZCkpO1xuICAgICAgICBjb25zdCBub3JtYWxpemVkID0gdGhpcy5fbm9ybWFsaXplU3RvcmVkUGVuZGluZ1JlcXVlc3Qoc3RvcmVkLCByZXF1ZXN0SWQpO1xuXG4gICAgICAgIGlmICghbm9ybWFsaXplZCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgaWYgKHRoaXMuX2lzU3RvcmVkUGVuZGluZ0V4cGlyZWQobm9ybWFsaXplZCkpIHtcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZVBlbmRpbmdSZXF1ZXN0KHJlcXVlc3RJZCk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub3JtYWxpemVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE9uIHNlcnZpY2Utd29ya2VyIHN0YXJ0dXA6IHNjYW5zIGFsbCBzdG9yYWdlIGtleXMgZm9yIHBlbmRpbmcgcmVxdWVzdCBlbnRyaWVzLFxuICAgICAqIHJlLXJlZ2lzdGVycyB2YWxpZCBvbmVzIGluIG1lbW9yeSwgYW5kIGRlbGV0ZXMgZXhwaXJlZC9tYWxmb3JtZWQgb25lcy5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIF9yZXN0b3JlUGVuZGluZ1JlcXVlc3RzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgYWxsSXRlbXMgPSBhd2FpdCB0aGlzLmJyb3dzZXJBcGkuZ2V0QWxsU3RvcmFnZUl0ZW1zKCk7XG4gICAgICAgICAgICBjb25zdCBrZXlzVG9SZW1vdmU6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGFsbEl0ZW1zKSkge1xuICAgICAgICAgICAgICAgIGlmICgha2V5LnN0YXJ0c1dpdGgoUEVORElOR19SRVFVRVNUX1NUT1JBR0VfUFJFRklYKSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0SWQgPSBrZXkucmVwbGFjZShQRU5ESU5HX1JFUVVFU1RfU1RPUkFHRV9QUkVGSVgsIFwiXCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0b3JlZCA9IHRoaXMuX25vcm1hbGl6ZVN0b3JlZFBlbmRpbmdSZXF1ZXN0KHZhbHVlLCByZXF1ZXN0SWQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFzdG9yZWQgfHwgdGhpcy5faXNTdG9yZWRQZW5kaW5nRXhwaXJlZChzdG9yZWQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGtleXNUb1JlbW92ZS5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5wZW5kaW5nUmVxdWVzdHMuaGFzKHN0b3JlZC5pZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWRkUGVuZGluZ1JlcXVlc3Qoc3RvcmVkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChrZXlzVG9SZW1vdmUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuYnJvd3NlckFwaS5yZW1vdmVTdG9yYWdlSXRlbXMoa2V5c1RvUmVtb3ZlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIExvZ2dlci5lcnJvcihcIkZhaWxlZCB0byByZXN0b3JlIHBlbmRpbmcgZEFwcCByZXF1ZXN0czpcIiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVhZHMgdGhlIHBlcm1pc3Npb25zIG1hcCBmcm9tIHN0b3JhZ2UgYW5kIHJldHVybnMgdGhlIHBlcm1pc3Npb24gZm9yIGEgZ2l2ZW4gb3JpZ2luLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9yaWdpbiAtIFRoZSBkQXBwIG9yaWdpbiB0byBsb29rIHVwLlxuICAgICAqIEByZXR1cm5zIFRoZSBzdG9yZWQgRGFwcFBlcm1pc3Npb24sIG9yIG51bGwgaWYgbm90IGZvdW5kLlxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgX2dldFBlcm1pc3Npb24ob3JpZ2luOiBzdHJpbmcpOiBQcm9taXNlPERhcHBQZXJtaXNzaW9uIHwgbnVsbD4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGVybWlzc2lvbnMgPSBhd2FpdCB0aGlzLmJyb3dzZXJBcGkuZ2V0U3RvcmFnZUl0ZW0oUEVSTUlTU0lPTlNfU1RPUkFHRV9LRVkpO1xuICAgICAgICAgICAgaWYgKCFwZXJtaXNzaW9ucykgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICByZXR1cm4gcGVybWlzc2lvbnNbb3JpZ2luXSB8fCBudWxsO1xuICAgICAgICB9IGNhdGNoIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2F2ZXMgKGNyZWF0ZXMgb3IgdXBkYXRlcykgYSBkQXBwIHBlcm1pc3Npb24gdG8gc3RvcmFnZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwZXJtaXNzaW9uIC0gVGhlIHBlcm1pc3Npb24gb2JqZWN0IHRvIHNhdmUuXG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBfc2F2ZVBlcm1pc3Npb24ocGVybWlzc2lvbjogRGFwcFBlcm1pc3Npb24pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHBlcm1pc3Npb25zID0gKGF3YWl0IHRoaXMuYnJvd3NlckFwaS5nZXRTdG9yYWdlSXRlbShQRVJNSVNTSU9OU19TVE9SQUdFX0tFWSkpIHx8IHt9O1xuICAgICAgICAgICAgcGVybWlzc2lvbnNbcGVybWlzc2lvbi5vcmlnaW5dID0gcGVybWlzc2lvbjtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYnJvd3NlckFwaS5zZXRTdG9yYWdlSXRlbShQRVJNSVNTSU9OU19TVE9SQUdFX0tFWSwgcGVybWlzc2lvbnMpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiRXJyb3Igc2F2aW5nIGRBcHAgcGVybWlzc2lvbjpcIiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgc3RvcmVkIHBlcm1pc3Npb24gZm9yIGEgZ2l2ZW4gb3JpZ2luLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9yaWdpbiAtIFRoZSBkQXBwIG9yaWdpbiB0byByZW1vdmUuXG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBfcmVtb3ZlUGVybWlzc2lvbihvcmlnaW46IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGVybWlzc2lvbnMgPSAoYXdhaXQgdGhpcy5icm93c2VyQXBpLmdldFN0b3JhZ2VJdGVtKFBFUk1JU1NJT05TX1NUT1JBR0VfS0VZKSkgfHwge307XG4gICAgICAgICAgICBkZWxldGUgcGVybWlzc2lvbnNbb3JpZ2luXTtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuYnJvd3NlckFwaS5zZXRTdG9yYWdlSXRlbShQRVJNSVNTSU9OU19TVE9SQUdFX0tFWSwgcGVybWlzc2lvbnMpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiRXJyb3IgcmVtb3ZpbmcgZEFwcCBwZXJtaXNzaW9uOlwiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDilIDilIDilIAgUGVybWlzc2lvbiBndWFyZCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB0aGF0IHRoZSBvcmlnaW4gaGFzIGFuIGFjdGl2ZSBwZXJtaXNzaW9uIHdpdGggYXQgbGVhc3Qgb25lIGFjY291bnQuXG4gICAgICogSWYgbm90LCBzZW5kcyBhIDQxMDAgVW5hdXRob3JpemVkIGVycm9yIGRpcmVjdGx5IHRvIHRoZSBkQXBwIHRhYiBhbmQgcmV0dXJucyBmYWxzZS5cbiAgICAgKiBDYWxsZXJzIHNob3VsZCByZXR1cm4gZWFybHkgd2hlbiB0aGlzIHJldHVybnMgZmFsc2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3JpZ2luICAgIC0gZEFwcCBvcmlnaW4gdG8gY2hlY2suXG4gICAgICogQHBhcmFtIHJlcXVlc3RJZCAtIFVzZWQgdG8gYnVpbGQgdGhlIGVycm9yIHJlc3BvbnNlLlxuICAgICAqIEBwYXJhbSB0YWJJZCAgICAgLSBUYWIgdG8gbm90aWZ5IG9uIGZhaWx1cmUuXG4gICAgICogQHJldHVybnMgdHJ1ZSBpZiB0aGUgb3JpZ2luIGlzIGF1dGhvcml6ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIF9yZXF1aXJlUGVybWlzc2lvbihvcmlnaW46IHN0cmluZywgcmVxdWVzdElkOiBzdHJpbmcsIHRhYklkPzogbnVtYmVyKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgICAgIGNvbnN0IHBlcm1pc3Npb24gPSBhd2FpdCB0aGlzLl9nZXRQZXJtaXNzaW9uKG9yaWdpbik7XG5cbiAgICAgICAgaWYgKCFwZXJtaXNzaW9uIHx8IHBlcm1pc3Npb24uYWNjb3VudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9ub3RpZnlUYWIodGFiSWQsIFwiREFQUF9QUk9WSURFUl9SRVNQT05TRVwiLCB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdElkLFxuICAgICAgICAgICAgICAgIGVycm9yOiB7IGNvZGU6IDQxMDAsIG1lc3NhZ2U6IFwiVW5hdXRob3JpemVkIC0gY29ubmVjdCB3YWxsZXQgZmlyc3RcIiB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyDilIDilIDilIAgQ29hbGVzY2luZyBoZWxwZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gICAgLyoqXG4gICAgICogVHJpZXMgdG8gYWRkIHRoZSByZXF1ZXN0IHRvIGFuIGV4aXN0aW5nIGluLWZsaWdodCBjb25uZWN0IHF1ZXVlIGZvciB0aGlzIG9yaWdpbi5cbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHJlcXVlc3Qgd2FzIGNvYWxlc2NlZCAoY2FsbGVyIHNob3VsZCBzdG9wIHByb2Nlc3NpbmcpLlxuICAgICAqIFJldHVybnMgZmFsc2UgaWYgbm8gdmFsaWQgaW4tZmxpZ2h0IGNvbm5lY3QgZXhpc3RzIChjYWxsZXIgc2hvdWxkIG9wZW4gYSBmcmVzaCBVSSkuXG4gICAgICpcbiAgICAgKiBTdGFsZSBlbnRyaWVzICh3aGVyZSB0aGUgbGVhZGVyIHJlcXVlc3QgaXMgbm8gbG9uZ2VyIGluIHBlbmRpbmdSZXF1ZXN0cykgYXJlXG4gICAgICogY2xlYW5lZCB1cCBhdXRvbWF0aWNhbGx5LCBwcmV2ZW50aW5nIHNpbGVudCBzd2FsbG93aW5nIG9mIHJlY29ubmVjdCBhdHRlbXB0cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcmlnaW4gICAgLSBkQXBwIG9yaWdpbi5cbiAgICAgKiBAcGFyYW0gcmVxdWVzdElkIC0gTmV3IHJlcXVlc3QgSUQgdG8gcG90ZW50aWFsbHkgcXVldWUuXG4gICAgICogQHBhcmFtIHRhYklkICAgICAtIFRhYiBJRCBvZiB0aGUgbmV3IHJlcXVlc3QuXG4gICAgICovXG4gICAgcHJpdmF0ZSBfdHJ5Q29hbGVzY2VDb25uZWN0KG9yaWdpbjogc3RyaW5nLCByZXF1ZXN0SWQ6IHN0cmluZywgdGFiSWQ/OiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSB0aGlzLnBlbmRpbmdDb25uZWN0c0J5T3JpZ2luLmdldChvcmlnaW4pO1xuICAgICAgICBpZiAoIWV4aXN0aW5nIHx8IGV4aXN0aW5nLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGxlYWRlclJlcXVlc3RJZCA9IGV4aXN0aW5nWzBdLnJlcXVlc3RJZDtcblxuICAgICAgICBpZiAodGhpcy5wZW5kaW5nUmVxdWVzdHMuaGFzKGxlYWRlclJlcXVlc3RJZCkpIHtcbiAgICAgICAgICAgIC8vIEdlbnVpbmUgaW4tZmxpZ2h0IGNvbm5lY3Qg4oCUIGpvaW4gdGhlIHF1ZXVlLlxuICAgICAgICAgICAgZXhpc3RpbmcucHVzaCh7IHJlcXVlc3RJZCwgdGFiSWQgfSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFN0YWxlIGVudHJ5IChlLmcuIGFmdGVyIGRpc2Nvbm5lY3Qgb3Igc2VydmljZS13b3JrZXIgcmVzdGFydCkg4oCUIGNsZWFuIHVwIGFuZCBmYWxsIHRocm91Z2guXG4gICAgICAgIExvZ2dlci53YXJuKGBbRGFwcEhhbmRsZXJdIFN0YWxlIGNvYWxlc2NlZCBjb25uZWN0IGZvciAke29yaWdpbn0sIGNsZWFyaW5nIGFuZCBvcGVuaW5nIGZyZXNoIFVJYCk7XG4gICAgICAgIHRoaXMucGVuZGluZ0Nvbm5lY3RzQnlPcmlnaW4uZGVsZXRlKG9yaWdpbik7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGYW5zIG91dCB0aGUgbGVhZGVyJ3MgYXBwcm92YWwvcmVqZWN0aW9uIHJlc3VsdCB0byBhbGwgY29hbGVzY2VkIHJlcXVlc3RzIGZvciB0aGUgb3JpZ2luLlxuICAgICAqIENsZWFycyB0aGUgb3JpZ2luJ3MgZW50cnkgZnJvbSB0aGUgbWFwIGFmdGVyIG5vdGlmeWluZyBhbGwgd2FpdGVycy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcmlnaW4gICAgICAgICAgLSBUaGUgb3JpZ2luIHdob3NlIGNvYWxlc2NlZCBxdWV1ZSBzaG91bGQgYmUgcmVzb2x2ZWQuXG4gICAgICogQHBhcmFtIHJlc3BvbnNlUGF5bG9hZCAtIFRoZSByZXN1bHQgb3IgZXJyb3IgdG8gc2VuZCB0byBlYWNoIHF1ZXVlZCByZXF1ZXN0LlxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgX3Jlc29sdmVDb2FsZXNjZWRDb25uZWN0cyhvcmlnaW46IHN0cmluZywgcmVzcG9uc2VQYXlsb2FkOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IGNvYWxlc2NlZCA9IHRoaXMucGVuZGluZ0Nvbm5lY3RzQnlPcmlnaW4uZ2V0KG9yaWdpbik7XG4gICAgICAgIHRoaXMucGVuZGluZ0Nvbm5lY3RzQnlPcmlnaW4uZGVsZXRlKG9yaWdpbik7XG5cbiAgICAgICAgaWYgKCFjb2FsZXNjZWQgfHwgY29hbGVzY2VkLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgICAgIGZvciAoY29uc3QgZW50cnkgb2YgY29hbGVzY2VkKSB7XG4gICAgICAgICAgICB2b2lkIHRoaXMuX25vdGlmeVRhYihlbnRyeS50YWJJZCwgXCJEQVBQX1BST1ZJREVSX1JFU1BPTlNFXCIsIHtcbiAgICAgICAgICAgICAgICByZXF1ZXN0SWQ6IGVudHJ5LnJlcXVlc3RJZCxcbiAgICAgICAgICAgICAgICAuLi5yZXNwb25zZVBheWxvYWQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIOKUgOKUgOKUgCBDaGFpbiBJRCByZXNvbHV0aW9uIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyB0aGUgYWN0aXZlIGNoYWluSWQgZm9yIGEgZ2l2ZW4gb3JpZ2luLlxuICAgICAqIFByaW9yaXR5OiBvcmlnaW4tc3BlY2lmaWMgcGVybWlzc2lvbiDihpIgZ2xvYmFsIGFjdGl2ZV9jaGFpbl9pZCDihpIgZmlyc3Qgc3VwcG9ydGVkIGNoYWluLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9yaWdpbiAtIGRBcHAgb3JpZ2luLlxuICAgICAqIEByZXR1cm5zIFRoZSBudW1lcmljIGNoYWluIElEIHRvIHVzZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIF9nZXRBY3RpdmVDaGFpbklkKG9yaWdpbjogc3RyaW5nKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgY29uc3QgcGVybWlzc2lvbiA9IGF3YWl0IHRoaXMuX2dldFBlcm1pc3Npb24ob3JpZ2luKTtcbiAgICAgICAgaWYgKHBlcm1pc3Npb24/LmNoYWluSWQpIHJldHVybiBwZXJtaXNzaW9uLmNoYWluSWQ7XG5cbiAgICAgICAgY29uc3QgZ2xvYmFsQ2hhaW5JZCA9IGF3YWl0IHRoaXMuYnJvd3NlckFwaS5nZXRTdG9yYWdlSXRlbShcImFjdGl2ZV9jaGFpbl9pZFwiKTtcbiAgICAgICAgaWYgKGdsb2JhbENoYWluSWQgJiYgdHlwZW9mIGdsb2JhbENoYWluSWQgPT09IFwibnVtYmVyXCIpIHJldHVybiBnbG9iYWxDaGFpbklkO1xuXG4gICAgICAgIHJldHVybiBTVVBQT1JURURfQ0hBSU5TWzBdLmNoYWluSWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVzb2x2ZXMgdGhlIGNoYWluSWQgdG8gdXNlIGZvciBhIG5ldyBjb25uZWN0aW9uIHJlcXVlc3QuXG4gICAgICogSG9ub3VycyB0aGUgcGF5bG9hZCdzIGV4cGxpY2l0IGNoYWluSWQsIHRoZW4gdGhlIG9yaWdpbidzIHByZWZlcnJlZCBjaGFpbixcbiAgICAgKiB0aGVuIGZhbGxzIGJhY2sgdG8gdGhlIGdsb2JhbGx5IGFjdGl2ZSBjaGFpbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcmlnaW4gIC0gZEFwcCBvcmlnaW4uXG4gICAgICogQHBhcmFtIHBheWxvYWQgLSBDb25uZWN0aW9uIHJlcXVlc3QgcGF5bG9hZCAobWF5IGNvbnRhaW4gY2hhaW5JZCkuXG4gICAgICogQHJldHVybnMgTnVtZXJpYyBjaGFpbiBJRC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIF9yZXNvbHZlQ2hhaW5JZEZvckNvbm5lY3Qob3JpZ2luOiBzdHJpbmcsIHBheWxvYWQ6IGFueSk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IGFjdGl2ZUNoYWluSWQgPSBhd2FpdCB0aGlzLl9nZXRBY3RpdmVDaGFpbklkKG9yaWdpbik7XG5cbiAgICAgICAgaWYgKHBheWxvYWQ/LmNoYWluSWQpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgcGF5bG9hZC5jaGFpbklkID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgPyBwYXJzZUludChwYXlsb2FkLmNoYWluSWQsIDE2KVxuICAgICAgICAgICAgICAgIDogcGF5bG9hZC5jaGFpbklkO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcHJlZmVycmVkQ2hhaW5JZCA9IGdldFByZWZlcnJlZENoYWluSWRGb3JPcmlnaW4ob3JpZ2luKTtcbiAgICAgICAgcmV0dXJuIHByZWZlcnJlZENoYWluSWQgPz8gYWN0aXZlQ2hhaW5JZDtcbiAgICB9XG5cbiAgICAvLyDilIDilIDilIAgU2lnbmluZyByZXF1ZXN0IGhlbHBlciDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICAgIC8qKlxuICAgICAqIFNoYXJlZCBsb2dpYyBmb3IgdHJhbnNhY3Rpb24gYW5kIG1lc3NhZ2Ugc2lnbmluZyByZXF1ZXN0czpcbiAgICAgKiByZWdpc3RlcnMgdGhlIHJlcXVlc3QgaW4gbWVtb3J5ICsgc3RvcmFnZSwgdGhlbiBvcGVucyB0aGUgc2lnbmluZyBhcHByb3ZhbCBVSS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwZW5kaW5nUmVxdWVzdCAtIFRoZSBmdWxseSBjb25zdHJ1Y3RlZCBwZW5kaW5nIHJlcXVlc3QgdG8gcmVnaXN0ZXIuXG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBfcmVnaXN0ZXJBbmRTaG93U2lnbmluZ1JlcXVlc3QocGVuZGluZ1JlcXVlc3Q6IFBlbmRpbmdEYXBwUmVxdWVzdCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0aGlzLl9hZGRQZW5kaW5nUmVxdWVzdChwZW5kaW5nUmVxdWVzdCk7XG4gICAgICAgIGF3YWl0IHRoaXMuX3BlcnNpc3RQZW5kaW5nVG9TdG9yYWdlKHBlbmRpbmdSZXF1ZXN0LmlkLCBwZW5kaW5nUmVxdWVzdCk7XG4gICAgICAgIGF3YWl0IHRoaXMuX29wZW5BcHByb3ZhbFVJKFwic2lnblwiLCBwZW5kaW5nUmVxdWVzdC5pZCwgcGVuZGluZ1JlcXVlc3QudGFiSWQpO1xuICAgIH1cblxuICAgIC8vIOKUgOKUgOKUgCBVSSBwb3B1cCDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuICAgIC8qKlxuICAgICAqIE9wZW5zIHRoZSBleHRlbnNpb24gYXBwcm92YWwgcG9wdXAgd2luZG93IGZvciBhIGdpdmVuIHBhZ2UgKGUuZy4gXCJjb25uZWN0XCIsIFwic2lnblwiKS5cbiAgICAgKiBQb3NpdGlvbnMgdGhlIHBvcHVwIGF0IHRoZSB0b3AtcmlnaHQgb2YgdGhlIGN1cnJlbnRseSBmb2N1c2VkIGJyb3dzZXIgd2luZG93LlxuICAgICAqIE9uIGZhaWx1cmUsIHNlbmRzIGFuIGVycm9yIGJhY2sgdG8gdGhlIGRBcHAgdGFiIGFuZCByZW1vdmVzIHRoZSBwZW5kaW5nIHJlcXVlc3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcGFnZSAgICAgIC0gUm91dGUgc2VnbWVudCB0byBvcGVuIChlLmcuIFwiY29ubmVjdFwiIOKGkiAvZGFwcC9jb25uZWN0P3JlcXVlc3RJZD3igKYpLlxuICAgICAqIEBwYXJhbSByZXF1ZXN0SWQgLSBUaGUgcGVuZGluZyByZXF1ZXN0IElEIGVtYmVkZGVkIGluIHRoZSBVUkwuXG4gICAgICogQHBhcmFtIHRhYklkICAgICAtIFRhYiB0byBub3RpZnkgaWYgdGhlIHBvcHVwIGNhbid0IGJlIG9wZW5lZC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIF9vcGVuQXBwcm92YWxVSShwYWdlOiBzdHJpbmcsIHJlcXVlc3RJZDogc3RyaW5nLCB0YWJJZD86IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBjb25zdCBub3RpZnlFcnJvciA9IChtc2c6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdm9pZCB0aGlzLl9ub3RpZnlUYWIodGFiSWQsIFwiREFQUF9QUk9WSURFUl9SRVNQT05TRVwiLCB7XG4gICAgICAgICAgICAgICAgcmVxdWVzdElkLFxuICAgICAgICAgICAgICAgIGVycm9yOiB7IGNvZGU6IC0zMjYwMywgbWVzc2FnZTogbXNnIH0sXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZVBlbmRpbmdSZXF1ZXN0KHJlcXVlc3RJZCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHJ1bnRpbWUgPSB0aGlzLmJyb3dzZXJBcGkucnVudGltZTtcbiAgICAgICAgICAgIGlmICghcnVudGltZSkge1xuICAgICAgICAgICAgICAgIG5vdGlmeUVycm9yKFwiRXh0ZW5zaW9uIHJ1bnRpbWUgbm90IGF2YWlsYWJsZVwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGV4dGVuc2lvblVybCA9IChydW50aW1lIGFzIGFueSkuZ2V0VVJMKGBpbmRleC5odG1sIy9kYXBwLyR7cGFnZX0/cmVxdWVzdElkPSR7cmVxdWVzdElkfWApO1xuICAgICAgICAgICAgY29uc3QgeyBsZWZ0LCB0b3AgfSA9IGF3YWl0IHRoaXMuX2dldFBvcHVwUG9zaXRpb24oKTtcblxuICAgICAgICAgICAgY29uc3QgY3JlYXRlZFdpbmRvdyA9IGF3YWl0IGNocm9tZS53aW5kb3dzLmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgdXJsOiBleHRlbnNpb25VcmwsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3B1cFwiLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA0NDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiA2ODAsXG4gICAgICAgICAgICAgICAgbGVmdCxcbiAgICAgICAgICAgICAgICB0b3AsXG4gICAgICAgICAgICAgICAgZm9jdXNlZDogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBFbnN1cmUgdGhlIHBvcHVwIGlzIGluIHRoZSBmb3JlZ3JvdW5kIChoYW5kbGVzIHJhcmUgY2FzZXMgd2hlcmUgaXQgb3BlbnMgYmVoaW5kKS5cbiAgICAgICAgICAgIGlmIChjcmVhdGVkV2luZG93Py5pZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXBwcm92YWxXaW5kb3dzLnNldChjcmVhdGVkV2luZG93LmlkLCByZXF1ZXN0SWQpO1xuICAgICAgICAgICAgICAgIGF3YWl0IGNocm9tZS53aW5kb3dzLnVwZGF0ZShjcmVhdGVkV2luZG93LmlkLCB7IGZvY3VzZWQ6IHRydWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJFcnJvciBvcGVuaW5nIGFwcHJvdmFsIFVJOlwiLCBlcnJvcik7XG4gICAgICAgICAgICBub3RpZnlFcnJvcihcIkZhaWxlZCB0byBvcGVuIHdhbGxldCBhcHByb3ZhbCB3aW5kb3cuIFBsZWFzZSB0cnkgYWdhaW4uXCIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgcGl4ZWwgcG9zaXRpb24gZm9yIHRoZSBhcHByb3ZhbCBwb3B1cC5cbiAgICAgKiBBdHRlbXB0cyB0byBwbGFjZSBpdCBhdCB0aGUgdG9wLXJpZ2h0IG9mIHRoZSBsYXN0IGZvY3VzZWQgYnJvd3NlciB3aW5kb3cuXG4gICAgICogRmFsbHMgYmFjayB0byBhIHNlbnNpYmxlIGRlZmF1bHQgaWYgdGhlIHdpbmRvdyBnZW9tZXRyeSBpcyB1bmF2YWlsYWJsZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIEFuIG9iamVjdCB3aXRoIGBsZWZ0YCBhbmQgYHRvcGAgcGl4ZWwgb2Zmc2V0cyAoYm90aCA+PSAwKS5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIF9nZXRQb3B1cFBvc2l0aW9uKCk6IFByb21pc2U8eyBsZWZ0OiBudW1iZXI7IHRvcDogbnVtYmVyIH0+IHtcbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSB7IGxlZnQ6IDQwMCwgdG9wOiA4MCB9O1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50V2luZG93ID0gYXdhaXQgY2hyb21lLndpbmRvd3MuZ2V0TGFzdEZvY3VzZWQoKTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50V2luZG93Py53aWR0aCAmJiBjdXJyZW50V2luZG93LmxlZnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IE1hdGgubWF4KDAsIGN1cnJlbnRXaW5kb3cubGVmdCArIGN1cnJlbnRXaW5kb3cud2lkdGggLSA0NTApLFxuICAgICAgICAgICAgICAgICAgICB0b3A6IE1hdGgubWF4KDAsIGN1cnJlbnRXaW5kb3cudG9wIHx8IGRlZmF1bHRzLnRvcCksXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIExvZ2dlci53YXJuKFwiRmFpbGVkIHRvIGdldCBsYXN0IGZvY3VzZWQgd2luZG93LCB1c2luZyBkZWZhdWx0IHBvcHVwIHBvc2l0aW9uOlwiLCBlcnJvcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGVmYXVsdHM7XG4gICAgfVxuXG4gICAgLy8g4pSA4pSA4pSAIFRhYiBtZXNzYWdpbmcg4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbiAgICAvKipcbiAgICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gYSBzcGVjaWZpYyB0YWIncyBjb250ZW50IHNjcmlwdC5cbiAgICAgKiBOby1vcHMgc2lsZW50bHkgaWYgdGFiSWQgaXMgdW5kZWZpbmVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHRhYklkICAgLSBUYXJnZXQgdGFiIElELlxuICAgICAqIEBwYXJhbSB0eXBlICAgIC0gTWVzc2FnZSB0eXBlIChlLmcuIFwiREFQUF9QUk9WSURFUl9SRVNQT05TRVwiKS5cbiAgICAgKiBAcGFyYW0gcGF5bG9hZCAtIE1lc3NhZ2UgcGF5bG9hZC5cbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBtZXNzYWdlIHdhcyBkZWxpdmVyZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIF9ub3RpZnlUYWIodGFiSWQ6IG51bWJlciB8IHVuZGVmaW5lZCwgdHlwZTogc3RyaW5nLCBwYXlsb2FkOiBhbnkpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgaWYgKCF0YWJJZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICByZXR1cm4gdGhpcy5fd2FpdEZvclRhYkFuZFNlbmRNZXNzYWdlKHRhYklkLCB7IHR5cGUsIHBheWxvYWQgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQnJvYWRjYXN0cyBhIG1lc3NhZ2UgdG8gYWxsIG5vbi1leHRlbnNpb24gdGFicy5cbiAgICAgKiBTa2lwcyB0YWJzIHdpdGhvdXQgYSBjb250ZW50IHNjcmlwdCBzaWxlbnRseS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB0eXBlICAgIC0gTWVzc2FnZSB0eXBlIHRvIGJyb2FkY2FzdC5cbiAgICAgKiBAcGFyYW0gcGF5bG9hZCAtIE1lc3NhZ2UgcGF5bG9hZC5cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIF9icm9hZGNhc3RUb0FsbFRhYnModHlwZTogc3RyaW5nLCBwYXlsb2FkOiBhbnkpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHRhYnMgPSB0aGlzLmJyb3dzZXJBcGkudGFicyBhcyBhbnk7XG4gICAgICAgICAgICBpZiAoIXRhYnM/LnF1ZXJ5IHx8ICF0YWJzPy5zZW5kTWVzc2FnZSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCBhbGxUYWJzID0gYXdhaXQgdGFicy5xdWVyeSh7fSk7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgdGFiIG9mIGFsbFRhYnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRhYi5pZCB8fCAhdGFiLnVybCB8fCB0YWIudXJsLnN0YXJ0c1dpdGgoXCJjaHJvbWUtZXh0ZW5zaW9uOi8vXCIpKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRhYnMuc2VuZE1lc3NhZ2UodGFiLmlkLCB7IHR5cGUsIHBheWxvYWQgfSk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRhYiBtYXkgbm90IGhhdmUgdGhlIGNvbnRlbnQgc2NyaXB0IOKAlCBpZ25vcmVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBMb2dnZXIuZXJyb3IoYEVycm9yIGJyb2FkY2FzdGluZyAke3R5cGV9OmAsIGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJyb2FkY2FzdHMgYSBjaGFpbkNoYW5nZWQgZXZlbnQgdG8gYWxsIG9wZW4gdGFicy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjaGFpbklkIC0gTnVtZXJpYyBjaGFpbiBJRCB0aGF0IGlzIG5vdyBhY3RpdmUuXG4gICAgICovXG4gICAgcHJpdmF0ZSBhc3luYyBfYnJvYWRjYXN0Q2hhaW5DaGFuZ2VkKGNoYWluSWQ6IG51bWJlcik6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICBhd2FpdCB0aGlzLl9icm9hZGNhc3RUb0FsbFRhYnMoXCJEQVBQX0NIQUlOX0NIQU5HRURcIiwgeyBjaGFpbklkOiBjaGFpbklkVG9IZXgoY2hhaW5JZCkgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQXR0ZW1wdHMgdG8gc2VuZCBhIG1lc3NhZ2UgdG8gYSB0YWIncyBjb250ZW50IHNjcmlwdCwgcmV0cnlpbmcgd2l0aFxuICAgICAqIGV4cG9uZW50aWFsIGJhY2tvZmYgZm9yIHVwIHRvIGB0aW1lb3V0TXNgIG1pbGxpc2Vjb25kcy5cbiAgICAgKlxuICAgICAqIFRoaXMgaXMgbmVjZXNzYXJ5IGJlY2F1c2UgYWZ0ZXIgYSBiaW9tZXRyaWMgYXV0aCBvciBhIGxvbmctcnVubmluZyBiYWNrZ3JvdW5kXG4gICAgICogb3BlcmF0aW9uLCB0aGUgY29udGVudCBzY3JpcHQgbWF5IG5lZWQgYSBtb21lbnQgdG8gYmVjb21lIHJlYWR5LlxuICAgICAqXG4gICAgICogUmV0cnkgc2NoZWR1bGU6IDEwMG1zIOKGkiAyMDBtcyDihpIgNDAwbXMg4oaSIC4uLiDihpIgY2FwcGVkIGF0IDUwMDBtcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB0YWJJZCAgICAgLSBUYXJnZXQgdGFiIElELlxuICAgICAqIEBwYXJhbSBtZXNzYWdlICAgLSBUaGUgbWVzc2FnZSBvYmplY3QgdG8gc2VuZC5cbiAgICAgKiBAcGFyYW0gdGltZW91dE1zIC0gVG90YWwgdGltZSBidWRnZXQgZm9yIGFsbCByZXRyaWVzIChkZWZhdWx0OiA2MCBzKS5cbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBtZXNzYWdlIHdhcyBldmVudHVhbGx5IGRlbGl2ZXJlZCwgZmFsc2UgaWYgdGltZWQgb3V0LlxuICAgICAqL1xuICAgIHByaXZhdGUgYXN5bmMgX3dhaXRGb3JUYWJBbmRTZW5kTWVzc2FnZShcbiAgICAgICAgdGFiSWQ6IG51bWJlcixcbiAgICAgICAgbWVzc2FnZTogYW55LFxuICAgICAgICB0aW1lb3V0TXM6IG51bWJlciA9IFRBQl9NRVNTQUdFX1RJTUVPVVRfTVNcbiAgICApOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICAgICAgY29uc3QgdGFicyA9IHRoaXMuYnJvd3NlckFwaS50YWJzIGFzIGFueTtcbiAgICAgICAgaWYgKCF0YWJzPy5zZW5kTWVzc2FnZSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIGNvbnN0IGRlYWRsaW5lID0gRGF0ZS5ub3coKSArIHRpbWVvdXRNcztcbiAgICAgICAgbGV0IGRlbGF5ID0gVEFCX01FU1NBR0VfSU5JVElBTF9ERUxBWV9NUztcbiAgICAgICAgbGV0IGF0dGVtcHQgPSAwO1xuXG4gICAgICAgIHdoaWxlIChEYXRlLm5vdygpIDwgZGVhZGxpbmUpIHtcbiAgICAgICAgICAgIGF0dGVtcHQrKztcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0YWJzLnNlbmRNZXNzYWdlKHRhYklkLCBtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICBpZiAoYXR0ZW1wdCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLmluZm8oYFtEYXBwSGFuZGxlcl0gVGFiICR7dGFiSWR9IG5vdGlmaWVkIGFmdGVyICR7YXR0ZW1wdH0gYXR0ZW1wdChzKWApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlbWFpbmluZyA9IGRlYWRsaW5lIC0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgICAgICBpZiAocmVtYWluaW5nIDw9IDApIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgd2FpdE1zID0gTWF0aC5taW4oZGVsYXksIHJlbWFpbmluZywgVEFCX01FU1NBR0VfTUFYX0RFTEFZX01TKTtcbiAgICAgICAgICAgICAgICBMb2dnZXIud2FybihcbiAgICAgICAgICAgICAgICAgICAgYFtEYXBwSGFuZGxlcl0gVGFiICR7dGFiSWR9IG5vdCByZWFkeSAoYXR0ZW1wdCAke2F0dGVtcHR9KSwgcmV0cnlpbmcgaW4gJHt3YWl0TXN9bXMgKCR7TWF0aC5yb3VuZChyZW1haW5pbmcgLyAxMDAwKX1zIGxlZnQpYFxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgd2FpdE1zKSk7XG4gICAgICAgICAgICAgICAgZGVsYXkgPSBNYXRoLm1pbihkZWxheSAqIDIsIFRBQl9NRVNTQUdFX01BWF9ERUxBWV9NUyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBMb2dnZXIuZXJyb3IoXCJbRGFwcEhhbmRsZXJdIFRpbWVkIG91dCB0cnlpbmcgdG8gbm90aWZ5IHRhYlwiLCB7IHRhYklkLCBtZXNzYWdlVHlwZTogbWVzc2FnZT8udHlwZSwgYXR0ZW1wdHM6IGF0dGVtcHQgfSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyDilIDilIDilIAgRGF0YSBtb2RlbCBoZWxwZXJzIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgc3RvcmFnZSBrZXkgZm9yIGEgZ2l2ZW4gcGVuZGluZyByZXF1ZXN0IElELlxuICAgICAqXG4gICAgICogQHBhcmFtIHJlcXVlc3RJZCAtIFJlcXVlc3QgSUQgdG8gYnVpbGQgdGhlIGtleSBmb3IuXG4gICAgICovXG4gICAgcHJpdmF0ZSBfZ2V0UGVuZGluZ1N0b3JhZ2VLZXkocmVxdWVzdElkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYCR7UEVORElOR19SRVFVRVNUX1NUT1JBR0VfUFJFRklYfSR7cmVxdWVzdElkfWA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2FmZWx5IGV4dHJhY3RzIHRoZSBob3N0bmFtZSBmcm9tIGFuIG9yaWdpbiBVUkwgc3RyaW5nLlxuICAgICAqIFJldHVybnMgdGhlIHJhdyBzdHJpbmcgaWYgVVJMIHBhcnNpbmcgZmFpbHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3JpZ2luIC0gT3JpZ2luIFVSTCAoZS5nLiBcImh0dHBzOi8vYXBwLnVuaXN3YXAub3JnXCIpLlxuICAgICAqL1xuICAgIHByaXZhdGUgX2dldEhvc3RuYW1lKG9yaWdpbjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVVJMKG9yaWdpbikuaG9zdG5hbWU7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGEgbGl2ZSBQZW5kaW5nRGFwcFJlcXVlc3QgaW50byB0aGUgU3RvcmVkUGVuZGluZ0RhcHBSZXF1ZXN0IHNoYXBlXG4gICAgICogdGhhdCBpcyB3cml0dGVuIHRvIGNocm9tZS5zdG9yYWdlLmxvY2FsIChhZGRzIGV4cGlyeSB0aW1lc3RhbXAsIGZhdmljb24sIGhvc3RuYW1lKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByZXF1ZXN0IC0gVGhlIHJlcXVlc3QgdG8gc2VyaWFsaXplLlxuICAgICAqL1xuICAgIHByaXZhdGUgX2J1aWxkU3RvcmVkUGVuZGluZ1JlcXVlc3QocmVxdWVzdDogUGVuZGluZ0RhcHBSZXF1ZXN0KTogU3RvcmVkUGVuZGluZ0RhcHBSZXF1ZXN0IHtcbiAgICAgICAgY29uc3QgaG9zdG5hbWUgPSB0aGlzLl9nZXRIb3N0bmFtZShyZXF1ZXN0Lm9yaWdpbik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5yZXF1ZXN0LFxuICAgICAgICAgICAgY2hhaW5JZDogcmVxdWVzdC5jaGFpbklkIHx8IDE0MDQsXG4gICAgICAgICAgICBleHBpcmVzQXQ6IHJlcXVlc3QudGltZXN0YW1wICsgcmVxdWVzdC50aW1lb3V0TXMsXG4gICAgICAgICAgICBmYXZpY29uOiBgaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zMi9mYXZpY29ucz9kb21haW49JHtob3N0bmFtZX0mc3o9NjRgLFxuICAgICAgICAgICAgaG9zdG5hbWUsXG4gICAgICAgICAgICB2ZXJpZnlTdGF0dXM6IFwiVU5LTk9XTlwiLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFZhbGlkYXRlcyBhbmQgbm9ybWFsaXplcyBhIHJhdyBzdG9yYWdlIHZhbHVlIGludG8gYSBTdG9yZWRQZW5kaW5nRGFwcFJlcXVlc3QuXG4gICAgICogQXBwbGllcyBzYWZlIGRlZmF1bHRzIGZvciBtaXNzaW5nL2ludmFsaWQgZmllbGRzIHNvIG9sZCBzdG9yYWdlIGZvcm1hdHMgYXJlIGhhbmRsZWQgZ3JhY2VmdWxseS5cbiAgICAgKiBSZXR1cm5zIG51bGwgaWYgdGhlIHN0b3JlZCB2YWx1ZSBpcyBmdW5kYW1lbnRhbGx5IGludmFsaWQgKG1pc3Npbmcgb3JpZ2luKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdG9yZWQgICAgLSBSYXcgdmFsdWUgZnJvbSBjaHJvbWUuc3RvcmFnZS5sb2NhbC5cbiAgICAgKiBAcGFyYW0gcmVxdWVzdElkIC0gRmFsbGJhY2sgSUQgaWYgc3RvcmVkLmlkIGlzIG1pc3NpbmcuXG4gICAgICovXG4gICAgcHJpdmF0ZSBfbm9ybWFsaXplU3RvcmVkUGVuZGluZ1JlcXVlc3Qoc3RvcmVkOiBhbnksIHJlcXVlc3RJZDogc3RyaW5nKTogU3RvcmVkUGVuZGluZ0RhcHBSZXF1ZXN0IHwgbnVsbCB7XG4gICAgICAgIGlmICghc3RvcmVkIHx8IHR5cGVvZiBzdG9yZWQgIT09IFwib2JqZWN0XCIgfHwgIXN0b3JlZC5vcmlnaW4pIHJldHVybiBudWxsO1xuXG4gICAgICAgIGNvbnN0IGhvc3RuYW1lID0gdHlwZW9mIHN0b3JlZC5ob3N0bmFtZSA9PT0gXCJzdHJpbmdcIiAmJiBzdG9yZWQuaG9zdG5hbWVcbiAgICAgICAgICAgID8gc3RvcmVkLmhvc3RuYW1lXG4gICAgICAgICAgICA6IHRoaXMuX2dldEhvc3RuYW1lKHN0b3JlZC5vcmlnaW4pO1xuXG4gICAgICAgIGNvbnN0IHRpbWVvdXRNcyA9IHR5cGVvZiBzdG9yZWQudGltZW91dE1zID09PSBcIm51bWJlclwiICYmIHN0b3JlZC50aW1lb3V0TXMgPiAwXG4gICAgICAgICAgICA/IHN0b3JlZC50aW1lb3V0TXNcbiAgICAgICAgICAgIDogREFQUF9SRVFVRVNUX1RJTUVPVVRfTVM7XG5cbiAgICAgICAgY29uc3QgdGltZXN0YW1wID0gdHlwZW9mIHN0b3JlZC50aW1lc3RhbXAgPT09IFwibnVtYmVyXCIgJiYgc3RvcmVkLnRpbWVzdGFtcCA+IDBcbiAgICAgICAgICAgID8gc3RvcmVkLnRpbWVzdGFtcFxuICAgICAgICAgICAgOiBEYXRlLm5vdygpO1xuXG4gICAgICAgIGNvbnN0IGV4cGlyZXNBdCA9IHR5cGVvZiBzdG9yZWQuZXhwaXJlc0F0ID09PSBcIm51bWJlclwiICYmIHN0b3JlZC5leHBpcmVzQXQgPiAwXG4gICAgICAgICAgICA/IHN0b3JlZC5leHBpcmVzQXRcbiAgICAgICAgICAgIDogdGltZXN0YW1wICsgdGltZW91dE1zO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZDogdHlwZW9mIHN0b3JlZC5pZCA9PT0gXCJzdHJpbmdcIiAmJiBzdG9yZWQuaWQgPyBzdG9yZWQuaWQgOiByZXF1ZXN0SWQsXG4gICAgICAgICAgICB0eXBlOiBzdG9yZWQudHlwZSB8fCBcIkRBUFBfQ09OTkVDVFwiLFxuICAgICAgICAgICAgb3JpZ2luOiBzdG9yZWQub3JpZ2luLFxuICAgICAgICAgICAgdGFiSWQ6IHR5cGVvZiBzdG9yZWQudGFiSWQgPT09IFwibnVtYmVyXCIgPyBzdG9yZWQudGFiSWQgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBtZXRob2Q6IHN0b3JlZC5tZXRob2QgfHwgXCJldGhfcmVxdWVzdEFjY291bnRzXCIsXG4gICAgICAgICAgICBwYXJhbXM6IHN0b3JlZC5wYXJhbXMsXG4gICAgICAgICAgICBjaGFpbklkOiB0eXBlb2Ygc3RvcmVkLmNoYWluSWQgPT09IFwibnVtYmVyXCIgPyBzdG9yZWQuY2hhaW5JZCA6IDE0MDQsXG4gICAgICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgICAgICB0aW1lb3V0TXMsXG4gICAgICAgICAgICBleHBpcmVzQXQsXG4gICAgICAgICAgICBmYXZpY29uOiBzdG9yZWQuZmF2aWNvbiB8fCBgaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zMi9mYXZpY29ucz9kb21haW49JHtob3N0bmFtZX0mc3o9NjRgLFxuICAgICAgICAgICAgaG9zdG5hbWUsXG4gICAgICAgICAgICB2ZXJpZnlTdGF0dXM6IFwiVU5LTk9XTlwiLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiBhIHN0b3JlZCBwZW5kaW5nIHJlcXVlc3QgaGFzIHBhc3NlZCBpdHMgZXhwaXJ5IHRpbWVzdGFtcC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSByZXF1ZXN0IC0gVGhlIHN0b3JlZCByZXF1ZXN0IHRvIGNoZWNrLlxuICAgICAqL1xuICAgIHByaXZhdGUgX2lzU3RvcmVkUGVuZGluZ0V4cGlyZWQocmVxdWVzdDogU3RvcmVkUGVuZGluZ0RhcHBSZXF1ZXN0KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiByZXF1ZXN0LmV4cGlyZXNBdCA8PSBEYXRlLm5vdygpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuLi8uLi9leHRlbnNpb24tc2NyaXB0cy9sb2dnZXIvbG9nZ2VyLmNsYXNzXCI7XG5pbXBvcnQgeyBCcm93c2VyQXBpVXRpbCB9IGZyb20gXCIuL2Jyb3dzZXItYXBpLXV0aWxcIjtcblxuZXhwb3J0IGNsYXNzIEV4dGVuc2lvbkxpZmVjeWNsZSB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBERUZBVUxUX0lOREVYID0gXCJpbmRleC5odG1sXCI7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGJyb3dzZXJBcGk6IEJyb3dzZXJBcGlVdGlsKSB7fVxuXG4gICAgaW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgdGhpcy5fdmFsaWRhdGVTZXJ2aWNlV29ya2VyQ29udGV4dCgpO1xuICAgICAgICB0aGlzLl9zZXR1cFNlcnZpY2VXb3JrZXJFdmVudHMoKTtcbiAgICAgICAgdGhpcy5fc2V0dXBTaWRlUGFuZWwoKTtcbiAgICAgICAgdGhpcy5fc2V0dXBFdmVudExpc3RlbmVycygpO1xuICAgICAgICB0aGlzLl9zY2hlZHVsZVNlcnZpY2VXb3JrZXJOb3RpZmljYXRpb24oKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9zZXR1cFNpZGVQYW5lbCgpIHtcbiAgICAgICAgdGhpcy5fc2V0dXBDaHJvbWVTaWRlUGFuZWwoKTtcbiAgICAgICAgdGhpcy5fc2V0dXBGaXJlZm94U2lkZVBhbmVsKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc2V0dXBFdmVudExpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5fc2V0dXBJbnN0YWxsTGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMuX3NldHVwUnVudGltZUxpc3RlbmVycygpO1xuICAgICAgICB0aGlzLl9zZXR1cEdsb2JhbE1lc3NhZ2VMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgX25vdGlmeVNlcnZpY2VXb3JrZXJSZWFkeSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIEdldCBhbGwgdGFicyBhbmQgbm90aWZ5IHRoZW0gdGhhdCBzZXJ2aWNlIHdvcmtlciBpcyByZWFkeVxuICAgICAgICAgICAgaWYgKCF0aGlzLmJyb3dzZXJBcGkuaGFzKFwidGFic1wiKSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCB0YWJzQXBpID0gdGhpcy5icm93c2VyQXBpLnRhYnMgYXMgYW55O1xuXG4gICAgICAgICAgICBpZiAoIXRhYnNBcGk/LnF1ZXJ5KSByZXR1cm47XG5cbiAgICAgICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCB0YWJzQXBpLnF1ZXJ5KHt9KTtcblxuICAgICAgICAgICAgbGV0IHN1Y2Nlc3NDb3VudCA9IDA7XG5cbiAgICAgICAgICAgIGZvciAoY29uc3QgdGFiIG9mIHRhYnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRhYi5pZCkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRhYnNBcGk/LnNlbmRNZXNzYWdlKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0YWJzQXBpLnNlbmRNZXNzYWdlKHRhYi5pZCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJTRVJWSUNFX1dPUktFUl9SRUFEWVwiLFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzQ291bnQrKztcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAvLyBUYWIgbWlnaHQgbm90IGhhdmUgY29udGVudCBzY3JpcHQgbG9hZGVkIHlldCwgaWdub3JlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBubyB0YWJzIHdlcmUgc3VjY2Vzc2Z1bGx5IG5vdGlmaWVkLCByZXRyeSBhZnRlciBhIHNob3J0IGRlbGF5XG4gICAgICAgICAgICBpZiAoc3VjY2Vzc0NvdW50ICE9PSAwIHx8ICF0YWJzLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ub3RpZnlTZXJ2aWNlV29ya2VyUmVhZHkoKTtcbiAgICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiRXJyb3Igbm90aWZ5aW5nIGNvbnRlbnQgc2NyaXB0czpcIiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfdmFsaWRhdGVTZXJ2aWNlV29ya2VyQ29udGV4dCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZWxmID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJTZXJ2aWNlIHdvcmtlciBpcyBOT1QgcnVubmluZyBpbiBjb3JyZWN0IGNvbnRleHRcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBMb2dnZXIubG9nKFwiU2VydmljZSB3b3JrZXIgaXMgcnVubmluZyBpbiBjb3JyZWN0IGNvbnRleHRcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIF9zZXR1cFNlcnZpY2VXb3JrZXJFdmVudHMoKTogdm9pZCB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2VsZiA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuO1xuXG4gICAgICAgIHNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcImluc3RhbGxcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBMb2dnZXIubG9nKFwiU2VydmljZSB3b3JrZXIgaW5zdGFsbGluZy4uLlwiKTtcblxuICAgICAgICAgICAgKGV2ZW50IGFzIGFueSkud2FpdFVudGlsKChzZWxmIGFzIGFueSkuc2tpcFdhaXRpbmcoKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcImFjdGl2YXRlXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgTG9nZ2VyLmxvZyhcIlNlcnZpY2Ugd29ya2VyIGFjdGl2YXRpbmcuLi5cIik7XG5cbiAgICAgICAgICAgIChldmVudCBhcyBhbnkpLndhaXRVbnRpbChcbiAgICAgICAgICAgICAgICAoc2VsZiBhcyBhbnkpLmNsaWVudHNcbiAgICAgICAgICAgICAgICAgICAgLmNsYWltKClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgTG9nZ2VyLmxvZyhcIlNlcnZpY2Ugd29ya2VyIGFjdGl2YXRlZCBzdWNjZXNzZnVsbHlcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ub3RpZnlTZXJ2aWNlV29ya2VyUmVhZHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJTZXJ2aWNlIHdvcmtlciBhY3RpdmF0aW9uIGZhaWxlZDpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbm90aWZ5U2VydmljZVdvcmtlclJlYWR5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9zZXR1cENocm9tZVNpZGVQYW5lbCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmJyb3dzZXJBcGkuc2lkZVBhbmVsKSByZXR1cm47XG5cbiAgICAgICAgKHRoaXMuYnJvd3NlckFwaS5zaWRlUGFuZWwgYXMgYW55KS5zZXRPcHRpb25zKHtcbiAgICAgICAgICAgIHBhdGg6IHRoaXMuREVGQVVMVF9JTkRFWCxcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3NldHVwRmlyZWZveFNpZGVQYW5lbCgpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmJyb3dzZXJBcGkuaXNCcm93c2VyKSByZXR1cm47XG5cbiAgICAgICAgKHRoaXMuYnJvd3NlckFwaS5zaWRlYmFyQWN0aW9uIGFzIGFueSk/LnNldFBhbmVsKHsgcGFuZWw6IHRoaXMuREVGQVVMVF9JTkRFWCB9KTtcblxuICAgICAgICAodGhpcy5icm93c2VyQXBpLm1lbnVzIGFzIGFueSk/Lm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5icm93c2VyQXBpLnNpZGViYXJBY3Rpb24pICh0aGlzLmJyb3dzZXJBcGkuc2lkZWJhckFjdGlvbiBhcyBhbnkpLm9wZW4oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc2V0dXBJbnN0YWxsTGlzdGVuZXJzKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5icm93c2VyQXBpLmlzQnJvd3Nlcikge1xuICAgICAgICAgICAgKHRoaXMuYnJvd3NlckFwaS5ydW50aW1lIGFzIGFueSk/Lm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgICAgICBMb2dnZXIubG9nKFwiRXh0ZW5zaW9uIGluc3RhbGxlZCAoRmlyZWZveClcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJyb3dzZXJBcGkuaXNDaHJvbWUgJiYgdGhpcy5icm93c2VyQXBpLmhhcyhcInJ1bnRpbWVcIikpIHtcbiAgICAgICAgICAgICh0aGlzLmJyb3dzZXJBcGkucnVudGltZSBhcyBhbnkpPy5vbkluc3RhbGxlZC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgTG9nZ2VyLmxvZyhcIkV4dGVuc2lvbiBpbnN0YWxsZWQgKENocm9tZSlcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgX3NldHVwUnVudGltZUxpc3RlbmVycygpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmJyb3dzZXJBcGkuaGFzKFwicnVudGltZVwiKSkgcmV0dXJuO1xuXG4gICAgICAgICh0aGlzLmJyb3dzZXJBcGkucnVudGltZSBhcyBhbnkpPy5vblN0YXJ0dXAuYWRkTGlzdGVuZXIoKCkgPT4ge1xuICAgICAgICAgICAgTG9nZ2VyLmxvZyhcIkJhY2tncm91bmQ6IEV4dGVuc2lvbiBzdGFydHVwXCIpO1xuICAgICAgICB9KTtcblxuICAgICAgICAodGhpcy5icm93c2VyQXBpLnJ1bnRpbWUgYXMgYW55KT8ub25TdXNwZW5kLmFkZExpc3RlbmVyKCgpID0+IHtcbiAgICAgICAgICAgIExvZ2dlci5sb2coXCJCYWNrZ3JvdW5kOiBFeHRlbnNpb24gc3VzcGVuZGluZ1wiKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfc2V0dXBHbG9iYWxNZXNzYWdlTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2VsZiA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuO1xuXG4gICAgICAgIHNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAvLyBIYW5kbGUgZ2xvYmFsIG1lc3NhZ2VzIGlmIG5lZWRlZFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9zY2hlZHVsZVNlcnZpY2VXb3JrZXJOb3RpZmljYXRpb24oKTogdm9pZCB7XG4gICAgICAgIC8vIEZvciBjYXNlcyB3aGVyZSB0aGUgc2VydmljZSB3b3JrZXIgaXMgYWxyZWFkeSBhY3RpdmUsIG5vdGlmeSBpbW1lZGlhdGVseVxuICAgICAgICAvLyBUaGlzIGhhbmRsZXMgdGhlIGNhc2Ugd2hlcmUgdGhlIHNlcnZpY2Ugd29ya2VyIGRvZXNuJ3QgZ28gdGhyb3VnaCBpbnN0YWxsL2FjdGl2YXRlXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fbm90aWZ5U2VydmljZVdvcmtlclJlYWR5KCk7XG4gICAgICAgIH0sIDEwMCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgQnJvd3NlciwgVGFicyB9IGZyb20gXCJ3ZWJleHRlbnNpb24tcG9seWZpbGxcIjtcblxuaW1wb3J0IHsgQXV0b2ZpbGxNZXNzYWdlLCBEZWNyeXB0aW9uUmVxdWVzdCwgTWVzc2FnZVBheWxvYWQsIE1lc3NhZ2VTZW5kZXIsIFNlbmRSZXNwb25zZSB9IGZyb20gXCJAc2hhcmVkL3R5cGVzL2F1dG9maWxsLnR5cGVzXCI7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiQGV4dGVuc2lvbi1zY3JpcHRzL2xvZ2dlci9sb2dnZXIuY2xhc3NcIjtcbmltcG9ydCB7IEJhY2tncm91bmRDcmVkZW50aWFsTWFuYWdlciB9IGZyb20gXCIuL2JhY2tncm91bmQtY3JlZGVudGlhbC1tYW5hZ2VyXCI7XG5pbXBvcnQgeyBCcm93c2VyQXBpVXRpbCB9IGZyb20gXCIuL2Jyb3dzZXItYXBpLXV0aWxcIjtcblxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VIYW5kbGVyIHtcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogTWVzc2FnZUhhbmRsZXI7XG5cbiAgICBwcml2YXRlIGNyZWRlbnRpYWxNYW5hZ2VyOiBCYWNrZ3JvdW5kQ3JlZGVudGlhbE1hbmFnZXI7XG4gICAgcHJpdmF0ZSBwZW5kaW5nRGVjcnlwdGlvblJlcXVlc3RzPzogTWFwPHN0cmluZywgbnVtYmVyPjtcbiAgICBwcml2YXRlIHBlbmRpbmdQb3B1cFJvdXRlPzogc3RyaW5nO1xuICAgIHByaXZhdGUgcGVuZGluZ0RlY3J5cHRpb25EYXRhPzogRGVjcnlwdGlvblJlcXVlc3Q7XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKGJyb3dzZXJBcGk6IEJyb3dzZXJBcGlVdGlsKTogTWVzc2FnZUhhbmRsZXIge1xuICAgICAgICBpZiAoIU1lc3NhZ2VIYW5kbGVyLmluc3RhbmNlKSB7XG4gICAgICAgICAgICBNZXNzYWdlSGFuZGxlci5pbnN0YW5jZSA9IG5ldyBNZXNzYWdlSGFuZGxlcihicm93c2VyQXBpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBNZXNzYWdlSGFuZGxlci5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKHByaXZhdGUgYnJvd3NlckFwaTogQnJvd3NlckFwaVV0aWwpIHtcbiAgICAgICAgdGhpcy5jcmVkZW50aWFsTWFuYWdlciA9IEJhY2tncm91bmRDcmVkZW50aWFsTWFuYWdlci5nZXRJbnN0YW5jZSh0aGlzLmJyb3dzZXJBcGkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgX25hdmlnYXRlUG9wdXBUb1JvdXRlKHJvdXRlOiBzdHJpbmcpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIEZvciBwb3B1cCBtb2RlLCB3ZSBkb24ndCBuZWVkIHRvIGZpbmQgYSB0YWIgLSB0aGUgcG9wdXAgd2lsbCBoYW5kbGUgbmF2aWdhdGlvblxuICAgICAgICAgICAgLy8gVGhlIHBvcHVwIHdpbGwgY2hlY2sgZm9yIHBlbmRpbmcgZGVjcnlwdGlvbiBkYXRhIGFuZCBuYXZpZ2F0ZSBhY2NvcmRpbmdseVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiRXJyb3IgbmF2aWdhdGluZyBwb3B1cCB0byByb3V0ZTpcIiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBfc2VuZERlY3J5cHRpb25EYXRhVG9Qb3B1cCgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5wZW5kaW5nRGVjcnlwdGlvbkRhdGEpIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgcnVudGltZSA9IHRoaXMuYnJvd3NlckFwaS5ydW50aW1lO1xuXG4gICAgICAgICAgICBpZiAoIXJ1bnRpbWUpIHJldHVybjtcblxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCAocnVudGltZSBhcyBhbnkpLnNlbmRNZXNzYWdlKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJQQVNTV09SRF9ERUNSWVBUT1JfREFUQVwiLFxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkOiB0aGlzLnBlbmRpbmdEZWNyeXB0aW9uRGF0YSxcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ0RlY3J5cHRpb25EYXRhID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJNZXNzYWdlSGFuZGxlcjogRXJyb3Igc2VuZGluZyBkZWNyeXB0aW9uIGRhdGEgdG8gcG9wdXA6XCIsIGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIExvZ2dlci5lcnJvcihcIk1lc3NhZ2VIYW5kbGVyOiBFcnJvciBpbiBzZW5kRGVjcnlwdGlvbkRhdGFUb1BvcHVwOlwiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBOb3RpZnkgYWxsIGNvbnRlbnQgc2NyaXB0cyB0aGF0IHRoZSBzZXJ2aWNlIHdvcmtlciBpcyByZWFkeVxuICAgICAqIFRoaXMgaXMgY2FsbGVkIHdoZW4gdGhlIGV4dGVuc2lvbiBVSSBpcyBvcGVuZWQgdG8gZW5zdXJlIGNvbnRlbnQgc2NyaXB0c1xuICAgICAqIGtub3cgdGhlIHNlcnZpY2Ugd29ya2VyIGlzIGF2YWlsYWJsZSBldmVuIGlmIGl0IGRpZG4ndCBnbyB0aHJvdWdoIGFjdGl2YXRpb25cbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIF9ub3RpZnlDb250ZW50U2NyaXB0c1NlcnZpY2VXb3JrZXJSZWFkeSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5icm93c2VyQXBpLmhhcyhcInRhYnNcIikpIHJldHVybjtcblxuICAgICAgICAgICAgY29uc3QgdGFic0FwaSA9IHRoaXMuYnJvd3NlckFwaS50YWJzIGFzIGFueTtcblxuICAgICAgICAgICAgaWYgKCF0YWJzQXBpPy5xdWVyeSkgcmV0dXJuO1xuXG4gICAgICAgICAgICBjb25zdCB0YWJzID0gYXdhaXQgdGFic0FwaS5xdWVyeSh7fSk7XG5cbiAgICAgICAgICAgIGxldCBzdWNjZXNzQ291bnQgPSAwO1xuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IHRhYiBvZiB0YWJzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0YWIuaWQgfHwgIXRhYi51cmwgfHwgdGFiLnVybC5zdGFydHNXaXRoKFwiY2hyb21lLWV4dGVuc2lvbjovL1wiKSkgY29udGludWU7XG5cbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRhYnNBcGk/LnNlbmRNZXNzYWdlKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0YWJzQXBpLnNlbmRNZXNzYWdlKHRhYi5pZCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJTRVJWSUNFX1dPUktFUl9SRUFEWVwiLFxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzQ291bnQrKztcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJNZXNzYWdlSGFuZGxlcjogRXJyb3Igbm90aWZ5aW5nIGNvbnRlbnQgc2NyaXB0czpcIiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGNsb3NlIHBvcHVwIHJlcXVlc3RcbiAgICAgKi9cbiAgICBwcml2YXRlIGFzeW5jIF9oYW5kbGVDbG9zZVBvcHVwKHBheWxvYWQ6IE1lc3NhZ2VQYXlsb2FkLCBzZW5kZXI6IE1lc3NhZ2VTZW5kZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2hyb21lICE9PSBcInVuZGVmaW5lZFwiICYmIGNocm9tZS5ydW50aW1lKSB7XG4gICAgICAgICAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkNMT1NFX1BPUFVQXCIsXG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWQ6IHt9LFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBMb2dnZXIud2FybihcIk1lc3NhZ2VIYW5kbGVyOiBDaHJvbWUgcnVudGltZSBub3QgYXZhaWxhYmxlIGZvciBzZW5kaW5nIGNsb3NlIG1lc3NhZ2VcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJNZXNzYWdlSGFuZGxlcjogRXJyb3IgY2xvc2luZyBwb3B1cDpcIiwgZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYXN5bmMgaGFuZGxlQXV0b2ZpbGxNZXNzYWdlKFxuICAgICAgICBtZXNzYWdlOiB7IHR5cGU6IEF1dG9maWxsTWVzc2FnZVtcInR5cGVcIl07IHBheWxvYWQ/OiBNZXNzYWdlUGF5bG9hZCB9LFxuICAgICAgICBzZW5kZXI6IE1lc3NhZ2VTZW5kZXIsXG4gICAgICAgIHNlbmRSZXNwb25zZTogU2VuZFJlc3BvbnNlXG4gICAgKSB7XG4gICAgICAgIGNvbnN0IHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJSZXF1ZXN0IHRpbWVvdXRcIiB9KTtcbiAgICAgICAgfSwgODAwMCk7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHN3aXRjaCAobWVzc2FnZS50eXBlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkdFVF9QQVNTV09SRFNcIjpcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFzc3dvcmRzID0gYXdhaXQgdGhpcy5jcmVkZW50aWFsTWFuYWdlci5nZXRQYXNzd29yZHMobWVzc2FnZS5wYXlsb2FkPy53ZWJzaXRlIHx8IFwiXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUsIGRhdGE6IHBhc3N3b3JkcyB9KTtcblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiQ1JFQVRFX1BBU1NXT1JEXCI6XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2hhbmRsZUNyZWF0ZVBhc3N3b3JkKG1lc3NhZ2UucGF5bG9hZCB8fCB7fSwgc2VuZFJlc3BvbnNlKTtcblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiQVVUSEVOVElDQVRFXCI6XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2hhbmRsZUF1dGhlbnRpY2F0ZShzZW5kUmVzcG9uc2UpO1xuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJPUEVOX0JJT01FVFJJQ1NfTU9EQUxcIjpcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5faGFuZGxlT3BlbkJpb21ldHJpY3NNb2RhbCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIk9QRU5fUEFTU1dPUkRfREVDUllQVE9SXCI6XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2hhbmRsZU9wZW5QYXNzd29yZERlY3J5cHRvcihtZXNzYWdlLnBheWxvYWQgfHwge30sIHNlbmRlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiU0VORF9ERUNSWVBUSU9OX0RBVEFfVE9fUE9QT1VUXCI6XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX2hhbmRsZVNlbmREZWNyeXB0aW9uRGF0YVRvUG9wb3V0KG1lc3NhZ2UucGF5bG9hZCB8fCB7fSk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIFwiREVDUllQVElPTl9SRVNVTFRfRlJPTV9QT1BPVVRcIjpcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5faGFuZGxlRGVjcnlwdGlvblJlc3VsdEZyb21Qb3BvdXQobWVzc2FnZS5wYXlsb2FkIHx8IHt9KTtcblxuICAgICAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJDTE9TRV9QT1BVUFwiOlxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9oYW5kbGVDbG9zZVBvcHVwKG1lc3NhZ2UucGF5bG9hZCB8fCB7fSwgc2VuZGVyKTtcblxuICAgICAgICAgICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgXCJQT1BVUF9SRUFEWVwiOlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wZW5kaW5nUG9wdXBSb3V0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbmF2aWdhdGVQb3B1cFRvUm91dGUodGhpcy5wZW5kaW5nUG9wdXBSb3V0ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ1BvcHVwUm91dGUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wZW5kaW5nRGVjcnlwdGlvbkRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbmREZWNyeXB0aW9uRGF0YVRvUG9wdXAoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IHRydWUgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcIkZJTExfUEFTU1dPUkRfRk9STVwiOlxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLl9oYW5kbGVGaWxsUGFzc3dvcmRGb3JtKG1lc3NhZ2UucGF5bG9hZCB8fCB7fSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpO1xuXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJVbmtub3duIG1lc3NhZ2UgdHlwZSBbQkFDS0dST1VORCBTQ1JJUFRdXCIgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblxuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIF9oYW5kbGVDcmVhdGVQYXNzd29yZChwYXlsb2FkOiBNZXNzYWdlUGF5bG9hZCwgc2VuZFJlc3BvbnNlOiBTZW5kUmVzcG9uc2UpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHVybEluZm8gPSBwYXlsb2FkPy51cmxJbmZvIHx8IG51bGw7XG4gICAgICAgICAgICBjb25zdCB0YWIgPSAoYXdhaXQgdGhpcy5fb3BlbkV4dGVuc2lvblVJKFwiemVsZi1rZXlzL3Bhc3N3b3Jkcy9uZXdcIikpIGFzIFRhYnMuVGFiO1xuXG4gICAgICAgICAgICBpZiAodGFiKSB7XG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fd2FpdEZvclRhYkFuZFNlbmRNZXNzYWdlKHRhYi5pZCBhcyBudW1iZXIsIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJDUkVBVEVfUEFTU1dPUkRcIixcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZDogeyB1cmxJbmZvIH0sXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9ub3RpZnlDb250ZW50U2NyaXB0c1NlcnZpY2VXb3JrZXJSZWFkeSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZW5kUmVzcG9uc2UoeyBzdWNjZXNzOiB0cnVlIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAoZXJyb3IgYXMgRXJyb3IpLm1lc3NhZ2UgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIF9oYW5kbGVBdXRoZW50aWNhdGUoc2VuZFJlc3BvbnNlOiBTZW5kUmVzcG9uc2UpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGlzQXV0aGVudGljYXRlZCA9IGF3YWl0IHRoaXMuY3JlZGVudGlhbE1hbmFnZXIuaXNBdXRoZW50aWNhdGVkKCk7XG5cbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IGlzQXV0aGVudGljYXRlZCB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhc3luYyBfaGFuZGxlT3BlbkJpb21ldHJpY3NNb2RhbCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMuX29wZW5FeHRlbnNpb25VSShcImJpb21ldHJpY3NcIik7XG5cbiAgICAgICAgICAgIHRoaXMuX25vdGlmeUNvbnRlbnRTY3JpcHRzU2VydmljZVdvcmtlclJlYWR5KCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJFcnJvciBvcGVuaW5nIGJpb21ldHJpY3MgbW9kYWw6XCIsIGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgX2hhbmRsZU9wZW5QYXNzd29yZERlY3J5cHRvcihwYXlsb2FkOiBNZXNzYWdlUGF5bG9hZCwgc2VuZGVyOiBNZXNzYWdlU2VuZGVyKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB0YWJJZCA9IGF3YWl0IHRoaXMuX29wZW5FeHRlbnNpb25VSShcInBvcG91dC1kZWNyeXB0b3JcIik7XG5cbiAgICAgICAgICAgIGlmICh0YWJJZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGVuZGluZ0RlY3J5cHRpb25SZXF1ZXN0cyA9IHRoaXMucGVuZGluZ0RlY3J5cHRpb25SZXF1ZXN0cyB8fCBuZXcgTWFwKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAocGF5bG9hZC5yZXF1ZXN0SWQgJiYgc2VuZGVyLnRhYj8uaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wZW5kaW5nRGVjcnlwdGlvblJlcXVlc3RzLnNldChwYXlsb2FkLnJlcXVlc3RJZCwgc2VuZGVyLnRhYi5pZCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5fbm90aWZ5Q29udGVudFNjcmlwdHNTZXJ2aWNlV29ya2VyUmVhZHkoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiTWVzc2FnZUhhbmRsZXI6IEZhaWxlZCB0byBvcGVuIHBhc3N3b3JkIGRlY3J5cHRvciBwb3BvdXRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJNZXNzYWdlSGFuZGxlcjogRXJyb3Igb3BlbmluZyBwYXNzd29yZCBkZWNyeXB0b3I6XCIsIGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgX2hhbmRsZVNlbmREZWNyeXB0aW9uRGF0YVRvUG9wb3V0KHBheWxvYWQ6IE1lc3NhZ2VQYXlsb2FkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoIXBheWxvYWQucmVxdWVzdElkIHx8ICFwYXlsb2FkLnB1YmxpY0RhdGEpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgcGF5bG9hZCBmb3IgZGVjcnlwdGlvbiBkYXRhXCIpO1xuXG4gICAgICAgICAgICB0aGlzLnBlbmRpbmdEZWNyeXB0aW9uRGF0YSA9IHBheWxvYWQgYXMgRGVjcnlwdGlvblJlcXVlc3Q7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJNZXNzYWdlSGFuZGxlcjogRXJyb3Igc2VuZGluZyBkZWNyeXB0aW9uIGRhdGEgdG8gcG9wb3V0OlwiLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIF9oYW5kbGVEZWNyeXB0aW9uUmVzdWx0RnJvbVBvcG91dChwYXlsb2FkOiBNZXNzYWdlUGF5bG9hZCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxUYWJJZCA9IHBheWxvYWQucmVxdWVzdElkID8gdGhpcy5wZW5kaW5nRGVjcnlwdGlvblJlcXVlc3RzPy5nZXQocGF5bG9hZC5yZXF1ZXN0SWQpIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICBpZiAob3JpZ2luYWxUYWJJZCkge1xuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuX3NlbmREZWNyeXB0aW9uUmVzdWx0VG9UYWIob3JpZ2luYWxUYWJJZCwgcGF5bG9hZC5yZXN1bHQpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fY2xlYW51cERlY3J5cHRpb25SZXF1ZXN0KHBheWxvYWQucmVxdWVzdElkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiTWVzc2FnZUhhbmRsZXI6IE5vIG9yaWdpbmFsIHRhYiBJRCBmb3VuZCBmb3IgcmVxdWVzdDpcIiwgcGF5bG9hZC5yZXF1ZXN0SWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiRXJyb3IgaGFuZGxpbmcgZGVjcnlwdGlvbiByZXN1bHQgZnJvbSBwb3BvdXQ6XCIsIGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgX29wZW5FeHRlbnNpb25VSShwYWdlOiBzdHJpbmcpOiBQcm9taXNlPFRhYnMuVGFiIHwgbnVtYmVyIHwgbnVsbD4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcnVudGltZSA9IHRoaXMuYnJvd3NlckFwaS5ydW50aW1lO1xuXG4gICAgICAgICAgICBpZiAoIXJ1bnRpbWUpIHtcbiAgICAgICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJSdW50aW1lIEFQSSBub3QgYXZhaWxhYmxlXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGFnZSA9PT0gXCJwb3BvdXQtZGVjcnlwdG9yXCIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBlbmRpbmdQb3B1cFJvdXRlID0gcGFnZTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBhd2FpdCB0aGlzLl9vcGVuUG9wdXAoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX29wZW5Bc1RhYihydW50aW1lLCBwYWdlKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIExvZ2dlci5lcnJvcihcIkVycm9yIG9wZW5pbmcgZXh0ZW5zaW9uIFVJOlwiLCBlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgX3dhaXRGb3JUYWJBbmRTZW5kTWVzc2FnZSh0YWJJZDogbnVtYmVyLCBtZXNzYWdlOiBhbnksIG1heFJldHJpZXM6IG51bWJlciA9IDIwLCByZXRyeURlbGF5OiBudW1iZXIgPSA1MDApIHtcbiAgICAgICAgY29uc3QgdGFicyA9IHRoaXMuYnJvd3NlckFwaS50YWJzIGFzIEJyb3dzZXJbXCJ0YWJzXCJdO1xuXG4gICAgICAgIGlmICghdGFicykge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiVGFicyBBUEkgbm90IGF2YWlsYWJsZVwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGF0dGVtcHQgPSAxOyBhdHRlbXB0IDw9IG1heFJldHJpZXM7IGF0dGVtcHQrKykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0YWJzLnNlbmRNZXNzYWdlKHRhYklkLCB7IHR5cGU6IFwiUElOR1wiIH0pO1xuICAgICAgICAgICAgICAgIGF3YWl0IHRhYnMuc2VuZE1lc3NhZ2UodGFiSWQsIG1lc3NhZ2UpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBpZiAoYXR0ZW1wdCA9PT0gbWF4UmV0cmllcykge1xuICAgICAgICAgICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJNYXggcmV0cmllcyByZWFjaGVkLCBmYWlsZWQgdG8gc2VuZCBtZXNzYWdlIHRvIHRhYlwiLCB0YWJJZCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCByZXRyeURlbGF5KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIF9zZW5kRGVjcnlwdGlvblJlc3VsdFRvVGFiKHRhYklkOiBudW1iZXIsIHJlc3VsdDogYW55KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIGNvbnN0IHRhYnMgPSB0aGlzLmJyb3dzZXJBcGkudGFicztcblxuICAgICAgICBpZiAoIXRhYnMpIHtcbiAgICAgICAgICAgIExvZ2dlci5lcnJvcihcIlRhYnMgQVBJIG5vdCBhdmFpbGFibGVcIik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCAodGFicyBhcyBhbnkpLnNlbmRNZXNzYWdlKHRhYklkLCB7XG4gICAgICAgICAgICB0eXBlOiBcIkRFQ1JZUFRJT05fUkVTVUxUXCIsXG4gICAgICAgICAgICBwYXlsb2FkOiByZXN1bHQsXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgX2NsZWFudXBEZWNyeXB0aW9uUmVxdWVzdChyZXF1ZXN0SWQ/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFyZXF1ZXN0SWQpIHJldHVybjtcblxuICAgICAgICB0aGlzLnBlbmRpbmdEZWNyeXB0aW9uUmVxdWVzdHM/LmRlbGV0ZShyZXF1ZXN0SWQpO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgX29wZW5Qb3B1cCgpOiBQcm9taXNlPG51bWJlciB8IG51bGw+IHtcbiAgICAgICAgY29uc3QgYWN0aW9uID0gdGhpcy5icm93c2VyQXBpLmFjdGlvbjtcblxuICAgICAgICBpZiAoIWFjdGlvbikge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiQWN0aW9uIEFQSSBub3QgYXZhaWxhYmxlXCIpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYXdhaXQgKGFjdGlvbiBhcyBhbnkpLm9wZW5Qb3B1cCgpO1xuXG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0gY2F0Y2ggKHBvcHVwRXJyb3I6IGFueSkge1xuICAgICAgICAgICAgTG9nZ2VyLmVycm9yKFwiRmFpbGVkIHRvIG9wZW4gcG9wdXA6XCIsIHBvcHVwRXJyb3IpO1xuXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgX29wZW5Bc1RhYihydW50aW1lOiBhbnksIHBhZ2U6IHN0cmluZyk6IFByb21pc2U8YW55IHwgbnVsbD4ge1xuICAgICAgICBjb25zdCBleHRlbnNpb25VcmwgPSBydW50aW1lLmdldFVSTChgaW5kZXguaHRtbCMvJHtwYWdlfWApO1xuICAgICAgICBjb25zdCB0YWJzID0gdGhpcy5icm93c2VyQXBpLnRhYnM7XG5cbiAgICAgICAgaWYgKCF0YWJzKSB7XG4gICAgICAgICAgICBMb2dnZXIuZXJyb3IoXCJUYWJzIEFQSSBub3QgYXZhaWxhYmxlXCIpO1xuXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld1RhYiA9IGF3YWl0ICh0YWJzIGFzIGFueSkuY3JlYXRlKHtcbiAgICAgICAgICAgIHVybDogZXh0ZW5zaW9uVXJsLFxuICAgICAgICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gbmV3VGFiO1xuICAgIH1cblxuICAgIHByaXZhdGUgYXN5bmMgX2hhbmRsZUZpbGxQYXNzd29yZEZvcm0ocGF5bG9hZDogTWVzc2FnZVBheWxvYWQsIHNlbmRlcjogTWVzc2FnZVNlbmRlciwgc2VuZFJlc3BvbnNlOiBTZW5kUmVzcG9uc2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICghc2VuZGVyLnRhYj8uaWQpIHRocm93IG5ldyBFcnJvcihcIk5vIHRhYiBJRCBwcm92aWRlZCBmb3IgZm9ybSB3YWl0IHJlcXVlc3RcIik7XG5cbiAgICAgICAgICAgIGNvbnN0IHRhYnMgPSB0aGlzLmJyb3dzZXJBcGkudGFicztcblxuICAgICAgICAgICAgaWYgKCF0YWJzKSB0aHJvdyBuZXcgRXJyb3IoXCJUYWJzIEFQSSBub3QgYXZhaWxhYmxlXCIpO1xuXG4gICAgICAgICAgICBhd2FpdCAodGFicyBhcyBhbnkpLnNlbmRNZXNzYWdlKHNlbmRlci50YWIuaWQsIHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkZJTExfUEFTU1dPUkRfRk9STVwiLFxuICAgICAgICAgICAgICAgIHBheWxvYWQsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2VuZFJlc3BvbnNlKHsgc3VjY2VzczogdHJ1ZSB9KTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIExvZ2dlci5lcnJvcihcIk1lc3NhZ2VIYW5kbGVyOiBFcnJvciBoYW5kbGluZyB3YWl0IGZvciBmb3JtIHJlYWR5OlwiLCBlcnJvcik7XG5cbiAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogKGVycm9yIGFzIEVycm9yKS5tZXNzYWdlIH0pO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiLy8gRGV2ZWxvcG1lbnQgZW52aXJvbm1lbnRcbmV4cG9ydCBjb25zdCBlbnZpcm9ubWVudCA9IHtcbiAgICBwcm9kdWN0aW9uOiBmYWxzZSxcbiAgICBlbmFibGVMb2dnaW5nOiB0cnVlLFxuICAgIGluY2x1ZGVTdGFja0luTG9nczogZmFsc2UsXG4gICAgYXBpQmFzZVVybDogXCJodHRwOi8vbG9jYWxob3N0OjMwNTBcIixcbn07XG4iLCJpbXBvcnQgeyBlbnZpcm9ubWVudCB9IGZyb20gXCIuLi9lbnZpcm9ubWVudHMvZW52aXJvbm1lbnRcIjtcblxuZXhwb3J0IGNsYXNzIExvZ2dlciB7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgUFJFRklYID0gXCJbWkVMRl06XCI7XG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgaXNFbmFibGVkID0gZW52aXJvbm1lbnQuZW5hYmxlTG9nZ2luZyA/PyBmYWxzZTtcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBpbmNsdWRlU3RhY2sgPSBlbnZpcm9ubWVudC5pbmNsdWRlU3RhY2tJbkxvZ3MgPz8gZmFsc2U7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBnZXRTdGFjaygpOiBzdHJpbmcgfCBudWxsIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IEVycm9yKCkuc3RhY2s7XG5cbiAgICAgICAgICAgIGlmICghc3RhY2spIHJldHVybiBudWxsO1xuXG4gICAgICAgICAgICBjb25zdCBzdGFja0xpbmVzID0gc3RhY2suc3BsaXQoXCJcXG5cIik7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlbGV2YW50U3RhY2sgPSBzdGFja0xpbmVzLnNsaWNlKDQpLmZpbHRlcigobGluZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyaW1tZWQgPSBsaW5lLnRyaW0oKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiAhdHJpbW1lZC5pbmNsdWRlcyhcImxvZ2dlci5jbGFzcy50c1wiKSAmJiAhdHJpbW1lZC5pbmNsdWRlcyhcIkxvZ2dlci5cIik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHJlbGV2YW50U3RhY2subGVuZ3RoID4gMCA/IHJlbGV2YW50U3RhY2suam9pbihcIlxcblwiKSA6IG51bGw7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHN0YXRpYyBnZXRDYWxsZXJJbmZvKCk6IHsgZmlsZTogc3RyaW5nOyBsaW5lOiBudW1iZXI7IGNvbHVtbjogbnVtYmVyIH0gfCBudWxsIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IEVycm9yKCkuc3RhY2s7XG4gICAgICAgICAgICBpZiAoIXN0YWNrKSByZXR1cm4gbnVsbDtcblxuICAgICAgICAgICAgY29uc3Qgc3RhY2tMaW5lcyA9IHN0YWNrLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICAgICAgLy8gU3RhY2sgdHJhY2UgZm9ybWF0OlxuICAgICAgICAgICAgLy8gMDogRXJyb3JcbiAgICAgICAgICAgIC8vIDE6IGdldENhbGxlckluZm9cbiAgICAgICAgICAgIC8vIDI6IGxvZ1dpdGhDYWxsZXJcbiAgICAgICAgICAgIC8vIDM6IGxvZy9lcnJvci93YXJuL2V0YyAodGhlIExvZ2dlciBtZXRob2QpXG4gICAgICAgICAgICAvLyA0OiBUaGUgYWN0dWFsIGNhbGxlciAod2hhdCB3ZSB3YW50KVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDQ7IGkgPCBzdGFja0xpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbGluZSA9IHN0YWNrTGluZXNbaV0udHJpbSgpO1xuXG4gICAgICAgICAgICAgICAgLy8gU2tpcCBMb2dnZXIgY2xhc3MgbWV0aG9kc1xuICAgICAgICAgICAgICAgIGlmIChsaW5lLmluY2x1ZGVzKFwibG9nZ2VyLmNsYXNzLnRzXCIpIHx8IGxpbmUuaW5jbHVkZXMoXCJMb2dnZXIuXCIpKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIC8vIE1hdGNoOiBhdCBmdW5jdGlvbk5hbWUgKGZpbGU6bGluZTpjb2x1bW4pIG9yIGF0IGZpbGU6bGluZTpjb2x1bW5cbiAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IGxpbmUubWF0Y2goL2F0XFxzKyg/Oi4rP1xccyspP1xcKCguKz8pOihcXGQrKTooXFxkKylcXCkvKSB8fCBsaW5lLm1hdGNoKC9hdFxccysoLis/KTooXFxkKyk6KFxcZCspLyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIW1hdGNoKSBjb250aW51ZTtcblxuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVQYXRoID0gbWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgY29uc3QgbGluZU51bWJlciA9IHBhcnNlSW50KG1hdGNoWzJdLCAxMCk7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sdW1uTnVtYmVyID0gcGFyc2VJbnQobWF0Y2hbM10sIDEwKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlTmFtZSA9IGZpbGVQYXRoLnNwbGl0KFwiL1wiKS5wb3AoKSB8fCBmaWxlUGF0aC5zcGxpdChcIlxcXFxcIikucG9wKCkgfHwgZmlsZVBhdGg7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4geyBmaWxlOiBmaWxlTmFtZSwgbGluZTogbGluZU51bWJlciwgY29sdW1uOiBjb2x1bW5OdW1iZXIgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCB7fVxuXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RhdGljIGxvZ1dpdGhDYWxsZXIoY29uc29sZU1ldGhvZDogdHlwZW9mIGNvbnNvbGUubG9nLCAuLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuaXNFbmFibGVkKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgY2FsbGVySW5mbyA9IHRoaXMuZ2V0Q2FsbGVySW5mbygpO1xuICAgICAgICBjb25zdCBzdGFjayA9IHRoaXMuaW5jbHVkZVN0YWNrID8gdGhpcy5nZXRTdGFjaygpIDogbnVsbDtcblxuICAgICAgICBpZiAoY2FsbGVySW5mbykge1xuICAgICAgICAgICAgLy8gSW5jbHVkZSBjYWxsZXIgaW5mbyBpbiB0aGUgbG9nIG1lc3NhZ2VcbiAgICAgICAgICAgIC8vIENocm9tZSBEZXZUb29scyB3aWxsIHN0aWxsIHNob3cgbG9nZ2VyLmNsYXNzLnRzLCBidXQgdGhlIG1lc3NhZ2Ugd2lsbCBzaG93IHRoZSBhY3R1YWwgY2FsbGVyXG4gICAgICAgICAgICBjb25zdCBsb2dBcmdzOiBhbnlbXSA9IFtcbiAgICAgICAgICAgICAgICBgJWMke3RoaXMuUFJFRklYfSVjIFske2NhbGxlckluZm8uZmlsZX06JHtjYWxsZXJJbmZvLmxpbmV9XWAsXG4gICAgICAgICAgICAgICAgXCJmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICM0Q0FGNTBcIixcbiAgICAgICAgICAgICAgICBcImZvbnQtd2VpZ2h0OiBub3JtYWw7IGNvbG9yOiAjNjY2OyBmb250LXNpemU6IDAuOWVtXCIsXG4gICAgICAgICAgICAgICAgLi4uYXJncyxcbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIGlmIChzdGFjaykgbG9nQXJncy5wdXNoKGBcXG4ke3N0YWNrfWApO1xuXG4gICAgICAgICAgICBjb25zb2xlTWV0aG9kKC4uLmxvZ0FyZ3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbG9nQXJnczogYW55W10gPSBbdGhpcy5QUkVGSVgsIC4uLmFyZ3NdO1xuXG4gICAgICAgICAgICBpZiAoc3RhY2spIGxvZ0FyZ3MucHVzaChgXFxuJHtzdGFja31gKTtcblxuICAgICAgICAgICAgY29uc29sZU1ldGhvZCguLi5sb2dBcmdzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgbG9nKC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XG4gICAgICAgIHRoaXMubG9nV2l0aENhbGxlcihjb25zb2xlLmxvZywgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBlcnJvciguLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLmxvZ1dpdGhDYWxsZXIoY29uc29sZS5lcnJvciwgLi4uYXJncyk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyB3YXJuKC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XG4gICAgICAgIHRoaXMubG9nV2l0aENhbGxlcihjb25zb2xlLndhcm4sIC4uLmFyZ3MpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgaW5mbyguLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICB0aGlzLmxvZ1dpdGhDYWxsZXIoY29uc29sZS5pbmZvLCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGRlYnVnKC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XG4gICAgICAgIHRoaXMubG9nV2l0aENhbGxlcihjb25zb2xlLmRlYnVnLCAuLi5hcmdzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHRyYWNlKC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5pc0VuYWJsZWQpIHJldHVybjtcblxuICAgICAgICBjb25zdCBjYWxsZXJJbmZvID0gdGhpcy5nZXRDYWxsZXJJbmZvKCk7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gdGhpcy5pbmNsdWRlU3RhY2sgPyB0aGlzLmdldFN0YWNrKCkgOiBudWxsO1xuXG4gICAgICAgIGlmIChjYWxsZXJJbmZvKSB7XG4gICAgICAgICAgICBjb25zdCBsb2dBcmdzOiBhbnlbXSA9IFtcbiAgICAgICAgICAgICAgICBgJWMke3RoaXMuUFJFRklYfSVjIFske2NhbGxlckluZm8uZmlsZX06JHtjYWxsZXJJbmZvLmxpbmV9XWAsXG4gICAgICAgICAgICAgICAgXCJmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICM0Q0FGNTBcIixcbiAgICAgICAgICAgICAgICBcImZvbnQtd2VpZ2h0OiBub3JtYWw7IGNvbG9yOiAjNjY2OyBmb250LXNpemU6IDAuOWVtXCIsXG4gICAgICAgICAgICAgICAgLi4uYXJncyxcbiAgICAgICAgICAgIF07XG5cbiAgICAgICAgICAgIC8vIEFkZCBzdGFjayB0cmFjZSBpZiBlbmFibGVkIChjb25zb2xlLnRyYWNlIGFscmVhZHkgc2hvd3Mgc3RhY2ssIGJ1dCB3ZSBjYW4gYWRkIGZvcm1hdHRlZCB2ZXJzaW9uKVxuICAgICAgICAgICAgaWYgKHN0YWNrKSB7XG4gICAgICAgICAgICAgICAgbG9nQXJncy5wdXNoKFwiXFxuJWNTdGFjayB0cmFjZTpcIiwgXCJmb250LXdlaWdodDogYm9sZDsgY29sb3I6ICM5OTk7IGZvbnQtc2l6ZTogMC44NWVtXCIpO1xuICAgICAgICAgICAgICAgIGxvZ0FyZ3MucHVzaChgJWMke3N0YWNrfWAsIFwiY29sb3I6ICM5OTk7IGZvbnQtc2l6ZTogMC44NWVtOyBmb250LWZhbWlseTogbW9ub3NwYWNlXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLnRyYWNlKC4uLmxvZ0FyZ3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbG9nQXJnczogYW55W10gPSBbdGhpcy5QUkVGSVgsIC4uLmFyZ3NdO1xuXG4gICAgICAgICAgICBpZiAoc3RhY2spIHtcbiAgICAgICAgICAgICAgICBsb2dBcmdzLnB1c2goXCJcXG4lY1N0YWNrIHRyYWNlOlwiLCBcImZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogIzk5OTsgZm9udC1zaXplOiAwLjg1ZW1cIik7XG4gICAgICAgICAgICAgICAgbG9nQXJncy5wdXNoKGAlYyR7c3RhY2t9YCwgXCJjb2xvcjogIzk5OTsgZm9udC1zaXplOiAwLjg1ZW07IGZvbnQtZmFtaWx5OiBtb25vc3BhY2VcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUudHJhY2UoLi4ubG9nQXJncyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBTVVBQT1JURURfQ0hBSU5TIH0gZnJvbSBcIi4uL3R5cGVzL2RhcHAudHlwZXNcIjtcblxuLyoqXG4gKiBNYXBzIGRBcHAgb3JpZ2lucyAob3IgcGFydHMgb2Ygb3JpZ2lucykgdG8gdGhlaXIgcHJlZmVycmVkL25hdGl2ZSBuZXR3b3Jrcy5cbiAqIFRoZXNlIGFyZSBzbWFydCBkZWZhdWx0cyB1c2VkIHdoZW4gYSBkQXBwIGRvZXNuJ3QgZXhwbGljaXRseSByZXF1ZXN0IGEgY2hhaW4sXG4gKiBvciB3aGVuIHdlIHdhbnQgdG8gcHJvdmlkZSB0aGUgYmVzdCB1c2VyIGV4cGVyaWVuY2UgZm9yIGtub3duIHNpdGVzLlxuICovXG5leHBvcnQgY29uc3QgREFQUF9QUkVGRVJSRURfTkVUV09SS1M6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7XG4gICAgLy8gLS0tIEJsb2NrREFHIC8gWmVsZiBFY29zeXN0ZW0gKDE0MDQpIC0tLVxuICAgIFwiemVsZi53b3JsZFwiOiAxNDA0LFxuICAgIFwiemVsZi53b3JsZC9uZnRcIjogMTQwNCxcbiAgICBcImRhc2hib2FyZC56ZWxmLndvcmxkXCI6IDE0MDQsXG4gICAgXCJiZGFnc2Nhbi5jb21cIjogMTQwNCxcbiAgICBcImJsb2NrZGFnLm5ldHdvcmtcIjogMTQwNCxcblxuICAgIC8vIC0tLSBBdmFsYW5jaGUgKDQzMTE0KSAtLS1cbiAgICBcImNvcmUuYXBwXCI6IDQzMTE0LFxuICAgIFwiYXZhbGFuY2hlLm9yZ1wiOiA0MzExNCxcbiAgICBcInRyYWRlcmpvZXh5ei5jb21cIjogNDMxMTQsXG4gICAgXCJ5aWVsZHlhay5jb21cIjogNDMxMTQsXG4gICAgXCJwYW5nb2xpbi5leGNoYW5nZVwiOiA0MzExNCxcbiAgICBcInBsYXR5cHVzLmZpbmFuY2VcIjogNDMxMTQsXG4gICAgXCJiZW5xaS5maVwiOiA0MzExNCxcbiAgICBcImdteC5pb1wiOiA0MzExNCxcbiAgICBcInN0YXJnYXRlLmZpbmFuY2VcIjogNDMxMTQsXG4gICAgXCJhdmFzY2FuLmluZm9cIjogNDMxMTQsXG4gICAgXCJzbm93dHJhY2UuaW9cIjogNDMxMTQsXG4gICAgXCJjb2xvbnkubGFiXCI6IDQzMTE0LFxuICAgIFwiam9lcGVncy5jb21cIjogNDMxMTQsXG4gICAgXCJheGlhbC5leGNoYW5nZVwiOiA0MzExNCxcbiAgICBcInN0ZWFrcy5maW5hbmNlXCI6IDQzMTE0LFxuICAgIFwidmVjdG9yZmluYW5jZS5pb1wiOiA0MzExNCxcbiAgICBcIm1vby55aWVsZHlhay5jb21cIjogNDMxMTQsXG4gICAgXCJhcHAud29uZGVybGFuZC5tb25leVwiOiA0MzExNCxcblxuICAgIC8vIC0tLSBFdGhlcmV1bSBNYWlubmV0ICgxKSAtLS1cbiAgICBcInVuaXN3YXAub3JnXCI6IDEsXG4gICAgXCJvcGVuc2VhLmlvXCI6IDEsXG4gICAgXCJhcHAubGlkby5maVwiOiAxLFxuICAgIFwiY3VydmUuZmlcIjogMSxcbiAgICBcImFhdmUuY29tXCI6IDEsXG4gICAgXCJjb21wb3VuZC5maW5hbmNlXCI6IDEsXG4gICAgXCJzdXNoaXN3YXAuY29tXCI6IDEsXG4gICAgXCJiYWxhbmNlci5maVwiOiAxLFxuICAgIFwibWFrZXJkYW8uY29tXCI6IDEsXG4gICAgXCJhcHAuMWluY2guaW9cIjogMSxcbiAgICBcInllYXJuLmZpXCI6IDEsXG4gICAgXCJldGhlcnNjYW4uaW9cIjogMSxcbiAgICBcImVucy5kb21haW5zXCI6IDEsXG4gICAgXCJzbmFwc2hvdC5vcmdcIjogMSxcbiAgICBcImFwcC56ZXJpb24uaW9cIjogMSxcbiAgICBcInphcHBlci5maVwiOiAxLFxuICAgIFwiYmx1ci5pb1wiOiAxLFxuICAgIFwibG9va3NyYXJlLm9yZ1wiOiAxLFxuICAgIFwiZnJhY3RhbC5pc1wiOiAxLFxuICAgIFwiY29pbmdlY2tvLmNvbVwiOiAxLFxuICAgIFwiZGV4c2NyZWVuZXIuY29tXCI6IDEsXG4gICAgXCJkZXh0b29scy5pb1wiOiAxLFxuICAgIFwiY29udmV4ZmluYW5jZS5jb21cIjogMSxcbiAgICBcImZyYXguZmluYW5jZVwiOiAxLFxuICAgIFwicm9ja2V0cG9vbC5uZXRcIjogMSxcbiAgICBcInN0YWtld2lzZS5pb1wiOiAxLFxuICAgIFwiZWlnZW5sYXllci54eXpcIjogMSxcbiAgICBcImluc3RhZGFwcC5pb1wiOiAxLFxuICAgIFwibW9ycGhvLm9yZ1wiOiAxLFxuICAgIFwicGVuZGxlLmZpbmFuY2VcIjogMSxcblxuICAgIC8vIC0tLSBBcmJpdHJ1bSBPbmUgKDQyMTYxKSAtLS1cbiAgICBcImFwcC5nbXguaW9cIjogNDIxNjEsXG4gICAgXCJhcmJpdHJ1bS5pb1wiOiA0MjE2MSxcbiAgICBcImhvcC5leGNoYW5nZVwiOiA0MjE2MSxcbiAgICBcInJhZGlhbnQuY2FwaXRhbFwiOiA0MjE2MSxcbiAgICBcImNhbWVsb3QuZXhjaGFuZ2VcIjogNDIxNjEsXG4gICAgXCJhcmJpc2Nhbi5pb1wiOiA0MjE2MSxcbiAgICBcImR5cGV4LmV4Y2hhbmdlXCI6IDQyMTYxLFxuICAgIFwiYXJiaXRydW0ubmV0d29ya1wiOiA0MjE2MSxcbiAgICBcImNocm9ub3MuZXhjaGFuZ2VcIjogNDIxNjEsXG4gICAgXCJ2aW5jaXQuZmlcIjogNDIxNjEsXG5cbiAgICAvLyAtLS0gT3B0aW1pc20gKDEwKSAtLS1cbiAgICBcIm9wdGltaXNtLmlvXCI6IDEwLFxuICAgIFwidmVsb2Ryb21lLmZpbmFuY2VcIjogMTAsXG4gICAgXCJseXJhLmZpbmFuY2VcIjogMTAsXG4gICAgXCJrd2VudGEuZXRoLmxpbW9cIjogMTAsXG4gICAgXCJzeW50aGV0aXguaW9cIjogMTAsXG4gICAgXCJvcHRpbWlzdGljLmV0aGVyc2Nhbi5pb1wiOiAxMCxcbiAgICBcInNvbm5lLmZpbmFuY2VcIjogMTAsXG4gICAgXCJiZWV0aG92ZW54LmlvXCI6IDEwLFxuXG4gICAgLy8gLS0tIEJhc2UgKDg0NTMpIC0tLVxuICAgIFwiYmFzZS5vcmdcIjogODQ1MyxcbiAgICBcImFlcm9kcm9tZS5maW5hbmNlXCI6IDg0NTMsXG4gICAgXCJmcmllbmQudGVjaFwiOiA4NDUzLFxuICAgIFwiYmFzZXNjYW4ub3JnXCI6IDg0NTMsXG4gICAgXCJtb29ud2VsbC5maVwiOiA4NDUzLFxuICAgIFwiYWNyb3NzLnRvXCI6IDg0NTMsXG4gICAgXCJleHRyYWJlLmZpXCI6IDg0NTMsXG4gICAgXCJiYXNlbmFtZS5hcHBcIjogODQ1MyxcblxuICAgIC8vIC0tLSBCTkIgQ2hhaW4gKDU2KSAtLS1cbiAgICBcInBhbmNha2Vzd2FwLmZpbmFuY2VcIjogNTYsXG4gICAgXCJibmJjaGFpbi5vcmdcIjogNTYsXG4gICAgXCJ2ZW51cy5pb1wiOiA1NixcbiAgICBcImJzY3NjYW4uY29tXCI6IDU2LFxuICAgIFwiYWxwYWNhLmZpbmFuY2VcIjogNTYsXG4gICAgXCJiaXN3YXAub3JnXCI6IDU2LFxuICAgIFwiYmFieXN3YXAuZmluYW5jZVwiOiA1NixcbiAgICBcImVsbGlwc2lzLmZpbmFuY2VcIjogNTYsXG4gICAgXCJhcGUtc3dhcC5maW5hbmNlXCI6IDU2LFxuICAgIFwiYmFrZXJ5c3dhcC5vcmdcIjogNTYsXG4gICAgXCJiaS1zd2FwLmNvbVwiOiA1NixcblxuICAgIC8vIC0tLSBQb2x5Z29uICgxMzcpIC0tLVxuICAgIFwicXVpY2tzd2FwLmV4Y2hhbmdlXCI6IDEzNyxcbiAgICBcInBvbHlnb24udGVjaG5vbG9neVwiOiAxMzcsXG4gICAgXCJwb2x5Z29uc2Nhbi5jb21cIjogMTM3LFxuICAgIFwic2FuZC5nYW1lXCI6IDEzNyxcbiAgICBcImRlY2VudHJhbGFuZC5vcmdcIjogMTM3LFxuICAgIFwibXN0YWJsZS5vcmdcIjogMTM3LFxuICAgIFwiY2xpcHBlci5leGNoYW5nZVwiOiAxMzcsXG4gICAgXCJwZWFzZWFzeS5jb21cIjogMTM3LFxuICAgIFwiZ3Jhdml0eS5maW5hbmNlXCI6IDEzNyxcbiAgICBcIm1lc3NpbmEuZXhjaGFuZ2VcIjogMTM3LFxufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBwcmVmZXJyZWQgY2hhaW4gSUQgZm9yIGEgZ2l2ZW4gb3JpZ2luIGJhc2VkIG9uIG91ciBtYXBwZWQgcmVjb3Jkcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFByZWZlcnJlZENoYWluSWRGb3JPcmlnaW4ob3JpZ2luOiBzdHJpbmcpOiBudW1iZXIgfCB1bmRlZmluZWQge1xuICAgIGlmICghb3JpZ2luKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgY29uc3QgY2xlYW5PcmlnaW4gPSBvcmlnaW5cbiAgICAgICAgLnRvTG93ZXJDYXNlKClcbiAgICAgICAgLnJlcGxhY2UoL15odHRwcz86XFwvXFwvLywgXCJcIilcbiAgICAgICAgLnJlcGxhY2UoL1xcLyQvLCBcIlwiKTtcblxuICAgIC8vIDEuIEV4YWN0IG1hdGNoIGNoZWNrXG4gICAgaWYgKERBUFBfUFJFRkVSUkVEX05FVFdPUktTW2NsZWFuT3JpZ2luXSkge1xuICAgICAgICByZXR1cm4gREFQUF9QUkVGRVJSRURfTkVUV09SS1NbY2xlYW5PcmlnaW5dO1xuICAgIH1cblxuICAgIC8vIDIuIENvbnRhaW5zIG1hdGNoIChmb3Igc3ViZG9tYWlucyBhbmQgcGF0aHMpXG4gICAgZm9yIChjb25zdCBba2V5LCBjaGFpbklkXSBvZiBPYmplY3QuZW50cmllcyhEQVBQX1BSRUZFUlJFRF9ORVRXT1JLUykpIHtcbiAgICAgICAgaWYgKGNsZWFuT3JpZ2luLmluY2x1ZGVzKGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBjaGFpbklkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBjaGFpbiBuYW1lIGZvciBhIHByZWZlcnJlZCBjaGFpbiBJRCBtYXBwaW5nIGlmIGZvdW5kLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJlZmVycmVkTmV0d29ya05hbWUob3JpZ2luOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGNoYWluSWQgPSBnZXRQcmVmZXJyZWRDaGFpbklkRm9yT3JpZ2luKG9yaWdpbik7XG4gICAgaWYgKCFjaGFpbklkKSByZXR1cm4gdW5kZWZpbmVkO1xuXG4gICAgcmV0dXJuIFNVUFBPUlRFRF9DSEFJTlMuZmluZCgoYykgPT4gYy5jaGFpbklkID09PSBjaGFpbklkKT8ubmFtZTtcbn1cbiIsImV4cG9ydCB0eXBlIERhcHBNZXNzYWdlVHlwZSA9XG4gICAgfCBcIkRBUFBfQ09OTkVDVFwiXG4gICAgfCBcIkRBUFBfRElTQ09OTkVDVFwiXG4gICAgfCBcIkRBUFBfR0VUX0FDQ09VTlRTXCJcbiAgICB8IFwiREFQUF9TSUdOX1RSQU5TQUNUSU9OXCJcbiAgICB8IFwiREFQUF9TSUdOX01FU1NBR0VcIlxuICAgIHwgXCJEQVBQX1NFTkRfVFJBTlNBQ1RJT05cIlxuICAgIHwgXCJEQVBQX1NXSVRDSF9DSEFJTlwiXG4gICAgfCBcIkRBUFBfQUREX0NIQUlOXCJcbiAgICB8IFwiREFQUF9DSEFJTl9JRFwiXG4gICAgfCBcIkRBUFBfUkVRVUVTVF9BQ0NPVU5UU1wiXG4gICAgfCBcIkRBUFBfQVBQUk9WQUxfUkVTVUxUXCJcbiAgICB8IFwiREFQUF9TSUdOSU5HX1JFU1VMVFwiXG4gICAgfCBcIkRBUFBfQUNDT1VOVFNfQ0hBTkdFRFwiXG4gICAgfCBcIkRBUFBfQ0hBSU5fQ0hBTkdFRFwiXG4gICAgfCBcIkRBUFBfUFJPVklERVJfUkVRVUVTVFwiXG4gICAgfCBcIkRBUFBfUFJPVklERVJfUkVTUE9OU0VcIlxuICAgIHwgXCJEQVBQX0dFVF9QRU5ESU5HXCJcbiAgICB8IFwiV0NfU0VTU0lPTl9QUk9QT1NBTFwiXG4gICAgfCBcIldDX1NFU1NJT05fUkVRVUVTVFwiXG4gICAgfCBcIldDX1NFU1NJT05fREVMRVRFXCJcbiAgICB8IFwiV0NfUEFJUlwiXG4gICAgfCBcIldDX0FQUFJPVkVfU0VTU0lPTlwiXG4gICAgfCBcIldDX1JFSkVDVF9TRVNTSU9OXCJcbiAgICB8IFwiV0NfQVBQUk9WRV9SRVFVRVNUXCJcbiAgICB8IFwiV0NfUkVKRUNUX1JFUVVFU1RcIlxuICAgIHwgXCJXQ19ESVNDT05ORUNUXCJcbiAgICB8IFwiV0NfR0VUX1NFU1NJT05TXCJcbiAgICB8IFwiV0NfSU5JVFwiXG4gICAgfCBcIldDX1JFQURZXCJcbiAgICB8IFwiV0NfRVZFTlRcIlxuICAgIHwgXCJEQVBQX0NMRUFOVVBfUkVRVUVTVFNcIlxuICAgIHwgXCJEQVBQX0NBTkNFTF9QRU5ESU5HX0ZPUl9PUklHSU5cIlxuICAgIHwgXCJEQVBQX0ZPUkNFX0RJU0NPTk5FQ1RfU0lURVwiXG4gICAgfCBcIkRBUFBfRk9SQ0VfRElTQ09OTkVDVF9BTExcIlxuICAgIHwgXCJEQVBQX1JQQ19QUk9YWVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIERhcHBNZXNzYWdlIHtcbiAgICB0eXBlOiBEYXBwTWVzc2FnZVR5cGU7XG4gICAgcGF5bG9hZD86IGFueTtcbiAgICByZXF1ZXN0SWQ6IHN0cmluZztcbiAgICBvcmlnaW4/OiBzdHJpbmc7XG4gICAgdGFiSWQ/OiBudW1iZXI7XG4gICAgdGltZXN0YW1wPzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERhcHBQZXJtaXNzaW9uIHtcbiAgICBvcmlnaW46IHN0cmluZztcbiAgICBhY2NvdW50czogc3RyaW5nW107XG4gICAgY2hhaW5JZDogbnVtYmVyO1xuICAgIGNvbm5lY3RlZEF0OiBudW1iZXI7XG4gICAgbGFzdFVzZWQ6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQZW5kaW5nRGFwcFJlcXVlc3Qge1xuICAgIGlkOiBzdHJpbmc7XG4gICAgdHlwZTogRGFwcE1lc3NhZ2VUeXBlO1xuICAgIG9yaWdpbjogc3RyaW5nO1xuICAgIHRhYklkPzogbnVtYmVyO1xuICAgIG1ldGhvZDogc3RyaW5nO1xuICAgIHBhcmFtcz86IGFueTtcbiAgICBjaGFpbklkPzogbnVtYmVyO1xuICAgIHRpbWVzdGFtcDogbnVtYmVyO1xuICAgIHRpbWVvdXRNczogbnVtYmVyO1xuICAgIHJlc29sdmU/OiAodmFsdWU6IGFueSkgPT4gdm9pZDtcbiAgICByZWplY3Q/OiAocmVhc29uOiBhbnkpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRGFwcENvbm5lY3Rpb25JbmZvIHtcbiAgICBvcmlnaW46IHN0cmluZztcbiAgICBuYW1lPzogc3RyaW5nO1xuICAgIGljb24/OiBzdHJpbmc7XG4gICAgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG4gICAgdXJsPzogc3RyaW5nO1xuICAgIHZlcmlmeVN0YXR1cz86IFZlcmlmeVN0YXR1cztcbn1cblxuZXhwb3J0IHR5cGUgVmVyaWZ5U3RhdHVzID0gXCJWQUxJRFwiIHwgXCJJTlZBTElEXCIgfCBcIlVOS05PV05cIiB8IFwiVEhSRUFUXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmVyaWZ5Q29udGV4dCB7XG4gICAgdmVyaWZpZWQ6IHtcbiAgICAgICAgb3JpZ2luOiBzdHJpbmc7XG4gICAgICAgIHZhbGlkYXRpb246IFZlcmlmeVN0YXR1cztcbiAgICAgICAgdmVyaWZ5VXJsOiBzdHJpbmc7XG4gICAgICAgIGlzU2NhbT86IGJvb2xlYW47XG4gICAgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEYXBwQXBwcm92YWxSZXF1ZXN0IHtcbiAgICBpZDogc3RyaW5nO1xuICAgIHR5cGU6IFwiY29ubmVjdGlvblwiIHwgXCJzaWduX3RyYW5zYWN0aW9uXCIgfCBcInNpZ25fbWVzc2FnZVwiIHwgXCJzd2l0Y2hfY2hhaW5cIjtcbiAgICBvcmlnaW46IHN0cmluZztcbiAgICBkYXBwSW5mbzogRGFwcENvbm5lY3Rpb25JbmZvO1xuICAgIGNoYWluSWQ/OiBudW1iZXI7XG4gICAgcmVxdWVzdGVkQ2hhaW5zPzogbnVtYmVyW107XG4gICAgcmVxdWVzdGVkTWV0aG9kcz86IHN0cmluZ1tdO1xuICAgIHRyYW5zYWN0aW9uUGFyYW1zPzogRGFwcFRyYW5zYWN0aW9uRGV0YWlsO1xuICAgIG1lc3NhZ2VQYXJhbXM/OiBEYXBwTWVzc2FnZURldGFpbDtcbiAgICB2ZXJpZnlDb250ZXh0PzogVmVyaWZ5Q29udGV4dDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEYXBwVHJhbnNhY3Rpb25EZXRhaWwge1xuICAgIGZyb206IHN0cmluZztcbiAgICB0bzogc3RyaW5nO1xuICAgIHZhbHVlOiBzdHJpbmc7XG4gICAgZGF0YT86IHN0cmluZztcbiAgICBnYXNMaW1pdD86IHN0cmluZztcbiAgICBnYXNQcmljZT86IHN0cmluZztcbiAgICBub25jZT86IG51bWJlcjtcbiAgICBjaGFpbklkOiBudW1iZXI7XG4gICAgbmV0d29yazogc3RyaW5nO1xuICAgIGRlY29kZWRBY3Rpb24/OiBEZWNvZGVkVHJhbnNhY3Rpb247XG4gICAgZXN0aW1hdGVkR2FzRmlhdD86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBEYXBwTWVzc2FnZURldGFpbCB7XG4gICAgbWV0aG9kOiBzdHJpbmc7XG4gICAgbWVzc2FnZTogc3RyaW5nO1xuICAgIGRlY29kZWRNZXNzYWdlPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERlY29kZWRUcmFuc2FjdGlvbiB7XG4gICAgdHlwZTpcbiAgICAgICAgfCBcIm5hdGl2ZV90cmFuc2ZlclwiXG4gICAgICAgIHwgXCJlcmMyMF90cmFuc2ZlclwiXG4gICAgICAgIHwgXCJlcmMyMF9hcHByb3ZlXCJcbiAgICAgICAgfCBcImVyYzcyMV90cmFuc2ZlclwiXG4gICAgICAgIHwgXCJlcmM3MjFfYXBwcm92ZV9hbGxcIlxuICAgICAgICB8IFwiY29udHJhY3RfaW50ZXJhY3Rpb25cIlxuICAgICAgICB8IFwic3dhcFwiXG4gICAgICAgIHwgXCJ1bmtub3duXCI7XG4gICAgZGVzY3JpcHRpb246IHN0cmluZztcbiAgICB0bz86IHN0cmluZztcbiAgICBhbW91bnQ/OiBzdHJpbmc7XG4gICAgdG9rZW5TeW1ib2w/OiBzdHJpbmc7XG4gICAgdG9rZW5BZGRyZXNzPzogc3RyaW5nO1xuICAgIHNwZW5kZXI/OiBzdHJpbmc7XG4gICAgdG9rZW5JZD86IHN0cmluZztcbiAgICBmdW5jdGlvbk5hbWU/OiBzdHJpbmc7XG4gICAgc3JjVG9rZW4/OiBzdHJpbmc7XG4gICAgZHN0VG9rZW4/OiBzdHJpbmc7XG4gICAgc3JjVG9rZW5TeW1ib2w/OiBzdHJpbmc7XG4gICAgZHN0VG9rZW5TeW1ib2w/OiBzdHJpbmc7XG4gICAgYW1vdW50SW4/OiBzdHJpbmc7XG4gICAgYW1vdW50T3V0TWluPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENoYWluQ29uZmlnIHtcbiAgICBjaGFpbklkOiBudW1iZXI7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHN5bWJvbDogc3RyaW5nO1xuICAgIHJwY1VybD86IHN0cmluZztcbiAgICBibG9ja0V4cGxvcmVyPzogc3RyaW5nO1xuICAgIG5ldHdvcms6IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IFNVUFBPUlRFRF9DSEFJTlM6IENoYWluQ29uZmlnW10gPSBbXG4gICAgeyBjaGFpbklkOiAxLCBuYW1lOiBcIkV0aGVyZXVtXCIsIHN5bWJvbDogXCJFVEhcIiwgbmV0d29yazogXCJldGhlcmV1bVwiLCBycGNVcmw6IFwiaHR0cHM6Ly9ldGgubGxhbWFycGMuY29tXCIsIGJsb2NrRXhwbG9yZXI6IFwiaHR0cHM6Ly9ldGhlcnNjYW4uaW9cIiB9LFxuICAgIHsgY2hhaW5JZDogNDIxNjEsIG5hbWU6IFwiQXJiaXRydW0gT25lXCIsIHN5bWJvbDogXCJFVEhcIiwgbmV0d29yazogXCJhcmJpdHJ1bVwiLCBycGNVcmw6IFwiaHR0cHM6Ly9hcmIxLmFyYml0cnVtLmlvL3JwY1wiLCBibG9ja0V4cGxvcmVyOiBcImh0dHBzOi8vYXJiaXNjYW4uaW9cIiB9LFxuICAgIHsgY2hhaW5JZDogMTAsIG5hbWU6IFwiT3B0aW1pc21cIiwgc3ltYm9sOiBcIkVUSFwiLCBuZXR3b3JrOiBcIm9wdGltaXNtXCIsIHJwY1VybDogXCJodHRwczovL21haW5uZXQub3B0aW1pc20uaW9cIiwgYmxvY2tFeHBsb3JlcjogXCJodHRwczovL29wdGltaXN0aWMuZXRoZXJzY2FuLmlvXCIgfSxcbiAgICB7IGNoYWluSWQ6IDg0NTMsIG5hbWU6IFwiQmFzZVwiLCBzeW1ib2w6IFwiRVRIXCIsIG5ldHdvcms6IFwiYmFzZVwiLCBycGNVcmw6IFwiaHR0cHM6Ly9tYWlubmV0LmJhc2Uub3JnXCIsIGJsb2NrRXhwbG9yZXI6IFwiaHR0cHM6Ly9iYXNlc2Nhbi5vcmdcIiB9LFxuICAgIHsgY2hhaW5JZDogNDMxMTQsIG5hbWU6IFwiQXZhbGFuY2hlXCIsIHN5bWJvbDogXCJBVkFYXCIsIG5ldHdvcms6IFwiYXZhbGFuY2hlXCIsIHJwY1VybDogXCJodHRwczovL2FwaS5hdmF4Lm5ldHdvcmsvZXh0L2JjL0MvcnBjXCIsIGJsb2NrRXhwbG9yZXI6IFwiaHR0cHM6Ly9hdmFzY2FuLmluZm9cIiB9LFxuICAgIHsgY2hhaW5JZDogMTM3LCBuYW1lOiBcIlBvbHlnb25cIiwgc3ltYm9sOiBcIlBPTFwiLCBuZXR3b3JrOiBcInBvbHlnb25cIiwgcnBjVXJsOiBcImh0dHBzOi8vcG9seWdvbi1ycGMuY29tXCIsIGJsb2NrRXhwbG9yZXI6IFwiaHR0cHM6Ly9wb2x5Z29uc2Nhbi5jb21cIiB9LFxuICAgIHsgY2hhaW5JZDogNTYsIG5hbWU6IFwiQk5CIENoYWluXCIsIHN5bWJvbDogXCJCTkJcIiwgbmV0d29yazogXCJiaW5hbmNlXCIsIHJwY1VybDogXCJodHRwczovL2JzYy1kYXRhc2VlZC5iaW5hbmNlLm9yZ1wiLCBibG9ja0V4cGxvcmVyOiBcImh0dHBzOi8vYnNjc2Nhbi5jb21cIiB9LFxuICAgIHsgY2hhaW5JZDogMTQwNCwgbmFtZTogXCJCbG9ja0RBR1wiLCBzeW1ib2w6IFwiQkRBR1wiLCBuZXR3b3JrOiBcImJsb2NrZGFnXCIsIHJwY1VybDogXCJodHRwczovL3JwYy5iZGFnc2Nhbi5jb21cIiwgYmxvY2tFeHBsb3JlcjogXCJodHRwczovL2JkYWdzY2FuLmNvbVwiIH0sXG5dO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hhaW5Db25maWcoY2hhaW5JZDogbnVtYmVyKTogQ2hhaW5Db25maWcgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiBTVVBQT1JURURfQ0hBSU5TLmZpbmQoKGMpID0+IGMuY2hhaW5JZCA9PT0gY2hhaW5JZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N1cHBvcnRlZENoYWluKGNoYWluSWQ6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiBTVVBQT1JURURfQ0hBSU5TLnNvbWUoKGMpID0+IGMuY2hhaW5JZCA9PT0gY2hhaW5JZCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGFpbklkVG9IZXgoY2hhaW5JZDogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYDB4JHtjaGFpbklkLnRvU3RyaW5nKDE2KX1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGV4VG9DaGFpbklkKGhleDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICByZXR1cm4gcGFyc2VJbnQoaGV4LCAxNik7XG59XG4iLCIvKiogTGVnYWN5IGBwdWJsaWNEYXRhYCBrZXkgZnJvbSBvbGRlciBidWlsZHMgLyBBUEkgcGF5bG9hZHM7IG1pZ3JhdGVkIGludG8gYHhsbUFkZHJlc3NgLiAqL1xuZXhwb3J0IGNvbnN0IExFR0FDWV9YTE1fUFVCTElDX0RBVEFfS0VZID0gXCJzdGVsbGFyQWRkcmVzc1wiIGFzIGNvbnN0O1xuXG4vKiogUHJlZmVyIGB4bG1BZGRyZXNzYDsgZmFsbCBiYWNrIHRvIHtAbGluayBMRUdBQ1lfWExNX1BVQkxJQ19EQVRBX0tFWX0gc28gQVBJL3N0b3JhZ2Ugc2VsZi1oZWFscyBpbiBtZW1vcnkuICovXG5leHBvcnQgZnVuY3Rpb24gcmVhZFB1YmxpY0RhdGFYbG1BZGRyZXNzKHBkOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwgfCB1bmRlZmluZWQpOiBzdHJpbmcge1xuICAgIGlmICghcGQpIHJldHVybiBcIlwiO1xuICAgIGNvbnN0IHByaW1hcnkgPSBwZC54bG1BZGRyZXNzO1xuICAgIGNvbnN0IGxlZ2FjeSA9IHBkW0xFR0FDWV9YTE1fUFVCTElDX0RBVEFfS0VZXTtcbiAgICBjb25zdCBzID0gKHR5cGVvZiBwcmltYXJ5ID09PSBcInN0cmluZ1wiID8gcHJpbWFyeSA6IFwiXCIpIHx8ICh0eXBlb2YgbGVnYWN5ID09PSBcInN0cmluZ1wiID8gbGVnYWN5IDogXCJcIik7XG5cbiAgICByZXR1cm4gcy50cmltKCk7XG59XG5cbi8qKiBTdG9yZWQgYmxvYiBoYXMgWExNIG9ubHkgdW5kZXIgdGhlIGxlZ2FjeSBrZXk7IHNob3VsZCBwZXJzaXN0IGNhbm9uaWNhbCBgeGxtQWRkcmVzc2AuICovXG5leHBvcnQgZnVuY3Rpb24gcHVibGljRGF0YU5lZWRzWGxtUGVyc2lzdEhlYWwocGQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCB8IHVuZGVmaW5lZCwgY29lcmNlZDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKCFwZCB8fCAhY29lcmNlZCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHhsbSA9IHR5cGVvZiBwZC54bG1BZGRyZXNzID09PSBcInN0cmluZ1wiID8gcGQueGxtQWRkcmVzcy50cmltKCkgOiBcIlwiO1xuICAgIGNvbnN0IGxlZ2FjeSA9IHBkW0xFR0FDWV9YTE1fUFVCTElDX0RBVEFfS0VZXTtcbiAgICBjb25zdCBsZWcgPSB0eXBlb2YgbGVnYWN5ID09PSBcInN0cmluZ1wiID8gbGVnYWN5LnRyaW0oKSA6IFwiXCI7XG5cbiAgICByZXR1cm4gIXhsbSAmJiAhIWxlZyAmJiBsZWcgPT09IGNvZXJjZWQ7XG59XG5cbi8qKiBSZXR1cm5zIGhlYWxlZCBgcHVibGljRGF0YWAgb3IgYG51bGxgIGlmIG5vdGhpbmcgdG8gZG8uICovXG5leHBvcnQgZnVuY3Rpb24gdHJ5SGVhbFB1YmxpY0RhdGFYbG1Ub0Nhbm9uaWNhbChwZDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHwgdW5kZWZpbmVkKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgICBpZiAoIXBkKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBjb2VyY2VkID0gcmVhZFB1YmxpY0RhdGFYbG1BZGRyZXNzKHBkKTtcbiAgICBpZiAoIXB1YmxpY0RhdGFOZWVkc1hsbVBlcnNpc3RIZWFsKHBkLCBjb2VyY2VkKSkgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgbmV4dDogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7IC4uLnBkLCB4bG1BZGRyZXNzOiBjb2VyY2VkIH07XG5cbiAgICBkZWxldGUgbmV4dFtMRUdBQ1lfWExNX1BVQkxJQ19EQVRBX0tFWV07XG5cbiAgICByZXR1cm4gbmV4dDtcbn1cblxuY29uc3QgQUREUkVTU19DSFVOS19LRVlTID0gW1wiYWRkcmVzc2VzXCIsIFwiYWRkcmVzc2VzMlwiLCBcImFkZHJlc3NlczNcIl0gYXMgY29uc3Q7XG5cbmZ1bmN0aW9uIG1lcmdlQWRkcmVzc0NodW5rVmFsdWUob3V0OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwga2V5OiAodHlwZW9mIEFERFJFU1NfQ0hVTktfS0VZUylbbnVtYmVyXSk6IHZvaWQge1xuICAgIGNvbnN0IHJhdyA9IG91dFtrZXldO1xuICAgIGlmIChyYXcgPT0gbnVsbCkgcmV0dXJuO1xuICAgIGlmICh0eXBlb2YgcmF3ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBjaHVuazogdW5rbm93biA9IEpTT04ucGFyc2UocmF3KTtcbiAgICAgICAgICAgIGlmIChjaHVuayAmJiB0eXBlb2YgY2h1bmsgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkoY2h1bmspKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihvdXQsIGNodW5rIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCB7XG4gICAgICAgICAgICAvKiBrZWVwIHJhdyBzdHJpbmcgb24gb3V0IGZvciBkZWJ1Z2dpbmcgKi9cbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcmF3ID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHJhdykpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihvdXQsIHJhdyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik7XG4gICAgfVxufVxuXG4vKiogTWVyZ2VzIFBpbmF0YSBgYWRkcmVzc2VzW05dYCAoSlNPTiBzdHJpbmcgb3IgcHJlLXBhcnNlZCBvYmplY3QpIG9udG8gYSBzaGFsbG93IGNvcHkuICovXG5mdW5jdGlvbiB3aXRoTWVyZ2VkQWRkcmVzc0NodW5rRmllbGRzKHBkOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgICBjb25zdCBvdXQgPSB7IC4uLnBkIH07XG5cbiAgICBmb3IgKGNvbnN0IGsgb2YgQUREUkVTU19DSFVOS19LRVlTKSB7XG4gICAgICAgIG1lcmdlQWRkcmVzc0NodW5rVmFsdWUob3V0LCBrKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xufVxuXG4vKiogQVBJIC8gSVBGUyBgcHVibGljRGF0YWAgdXNlcyBgZG90QWRkcmVzc2A7IGBwb2xrYWRvdEFkZHJlc3NgIGFuZCBzaG9ydCBjaHVuayBrZXkgYGRvdGAgYXJlIGZhbGxiYWNrcy4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWFkUHVibGljRGF0YURvdEFkZHJlc3MocGQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gICAgaWYgKCFwZCkgcmV0dXJuIFwiXCI7XG4gICAgY29uc3QgbSA9IHdpdGhNZXJnZWRBZGRyZXNzQ2h1bmtGaWVsZHMocGQpO1xuICAgIGNvbnN0IHByaW1hcnkgPSBtLmRvdEFkZHJlc3M7XG4gICAgY29uc3QgYWx0ID0gKG0gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPikucG9sa2Fkb3RBZGRyZXNzO1xuICAgIGNvbnN0IHNob3J0ID0gKG0gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPikuZG90O1xuICAgIGNvbnN0IHMgPSAodHlwZW9mIHByaW1hcnkgPT09IFwic3RyaW5nXCIgPyBwcmltYXJ5IDogXCJcIikgfHwgKHR5cGVvZiBhbHQgPT09IFwic3RyaW5nXCIgPyBhbHQgOiBcIlwiKSB8fCAodHlwZW9mIHNob3J0ID09PSBcInN0cmluZ1wiID8gc2hvcnQgOiBcIlwiKTtcbiAgICByZXR1cm4gcy50cmltKCk7XG59XG5cbi8qKiBBUEkgLyBJUEZTIGBwdWJsaWNEYXRhYCB1c2VzIGBrc21BZGRyZXNzYDsgYGt1c2FtYUFkZHJlc3NgIGFuZCBzaG9ydCBjaHVuayBrZXkgYGtzbWAgYXJlIGZhbGxiYWNrcy4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWFkUHVibGljRGF0YUtzbUFkZHJlc3MocGQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCB8IHVuZGVmaW5lZCk6IHN0cmluZyB7XG4gICAgaWYgKCFwZCkgcmV0dXJuIFwiXCI7XG4gICAgY29uc3QgbSA9IHdpdGhNZXJnZWRBZGRyZXNzQ2h1bmtGaWVsZHMocGQpO1xuICAgIGNvbnN0IHByaW1hcnkgPSBtLmtzbUFkZHJlc3M7XG4gICAgY29uc3QgYWx0ID0gKG0gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPikua3VzYW1hQWRkcmVzcztcbiAgICBjb25zdCBzaG9ydCA9IChtIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4pLmtzbTtcbiAgICBjb25zdCBzID0gKHR5cGVvZiBwcmltYXJ5ID09PSBcInN0cmluZ1wiID8gcHJpbWFyeSA6IFwiXCIpIHx8ICh0eXBlb2YgYWx0ID09PSBcInN0cmluZ1wiID8gYWx0IDogXCJcIikgfHwgKHR5cGVvZiBzaG9ydCA9PT0gXCJzdHJpbmdcIiA/IHNob3J0IDogXCJcIik7XG4gICAgcmV0dXJuIHMudHJpbSgpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFRhZ1B1YmxpY0RhdGEge1xuICAgIGJ0Y0FkZHJlc3M6IHN0cmluZztcbiAgICBkb21haW46IHN0cmluZztcbiAgICBldGhBZGRyZXNzOiBzdHJpbmc7XG4gICAgc29sYW5hQWRkcmVzczogc3RyaW5nO1xuICAgIHhsbUFkZHJlc3M6IHN0cmluZztcbiAgICBzdWlBZGRyZXNzOiBzdHJpbmc7XG4gICAgdG9uQWRkcmVzczogc3RyaW5nO1xuICAgIGRvdEFkZHJlc3M6IHN0cmluZztcbiAgICBrc21BZGRyZXNzOiBzdHJpbmc7XG4gICAgdGFnTmFtZTogc3RyaW5nO1xuICAgIGhhc1Bhc3N3b3JkOiBzdHJpbmc7XG4gICAgdHlwZTogXCJtYWlubmV0XCIgfCBcImhvbGRcIiB8IFwiXCI7XG4gICAgb3JpZ2luOiBcIm9mZmxpbmVcIiB8IFwib25saW5lXCIgfCBcIlwiO1xuICAgIHJlZ2lzdGVyZWRBdDogc3RyaW5nO1xuICAgIGV4cGlyZXNBdDogc3RyaW5nO1xuICAgIGdyYWNlUGVyaW9kPzogc3RyaW5nO1xuICAgIGJsb2NrREFHQWRkcmVzczogc3RyaW5nO1xuICAgIGF2YWxhbmNoZUFkZHJlc3M6IHN0cmluZztcbiAgICBiaW5hbmNlQWRkcmVzczogc3RyaW5nO1xuICAgIHN0Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFBHUCB7XG4gICAgZW5jcnlwdGVkTWVzc2FnZTogc3RyaW5nO1xuICAgIHByaXZhdGVLZXk6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIFRhZ1B1YmxpY0RhdGFNb2RlbCB7XG4gICAgYXZhbGFuY2hlQWRkcmVzczogc3RyaW5nO1xuICAgIGJpbmFuY2VBZGRyZXNzOiBzdHJpbmc7XG4gICAgYmxvY2tEQUdBZGRyZXNzOiBzdHJpbmc7XG4gICAgYnRjQWRkcmVzczogc3RyaW5nO1xuICAgIGRvbWFpbjogc3RyaW5nO1xuICAgIGV0aEFkZHJlc3M6IHN0cmluZztcbiAgICBzb2xhbmFBZGRyZXNzOiBzdHJpbmc7XG4gICAgeGxtQWRkcmVzczogc3RyaW5nO1xuICAgIHN1aUFkZHJlc3M6IHN0cmluZztcbiAgICB0b25BZGRyZXNzOiBzdHJpbmc7XG4gICAgZG90QWRkcmVzczogc3RyaW5nO1xuICAgIGtzbUFkZHJlc3M6IHN0cmluZztcbiAgICB0YWdOYW1lOiBzdHJpbmc7XG4gICAgaGFzUGFzc3dvcmQ6IHN0cmluZztcbiAgICB0eXBlOiBcIm1haW5uZXRcIiB8IFwiaG9sZFwiIHwgXCJcIjtcbiAgICBvcmlnaW46IFwib2ZmbGluZVwiIHwgXCJvbmxpbmVcIiB8IFwiXCI7XG4gICAgcmVnaXN0ZXJlZEF0OiBzdHJpbmc7XG4gICAgZXhwaXJlc0F0Pzogc3RyaW5nO1xuICAgIGdyYWNlUGVyaW9kPzogRGF0ZSB8IG51bGw7XG4gICAgc3Q/OiBzdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcihkYXRhOiBhbnkpIHtcbiAgICAgICAgdGhpcy5hdmFsYW5jaGVBZGRyZXNzID0gZGF0YS5hdmFsYW5jaGVBZGRyZXNzIHx8IGRhdGEuZXRoQWRkcmVzcyB8fCBcIlwiO1xuICAgICAgICB0aGlzLmJpbmFuY2VBZGRyZXNzID0gZGF0YS5iaW5hbmNlQWRkcmVzcyB8fCBkYXRhLmV0aEFkZHJlc3MgfHwgXCJcIjtcbiAgICAgICAgdGhpcy5ibG9ja0RBR0FkZHJlc3MgPSBkYXRhLmJsb2NrREFHQWRkcmVzcyB8fCBkYXRhLmV0aEFkZHJlc3MgfHwgXCJcIjtcbiAgICAgICAgdGhpcy5idGNBZGRyZXNzID0gZGF0YS5idGNBZGRyZXNzIHx8IFwiXCI7XG4gICAgICAgIHRoaXMuZG9tYWluID0gZGF0YS5kb21haW4gfHwgXCJcIjtcbiAgICAgICAgdGhpcy5ldGhBZGRyZXNzID0gZGF0YS5ldGhBZGRyZXNzIHx8IFwiXCI7XG4gICAgICAgIHRoaXMuc29sYW5hQWRkcmVzcyA9IGRhdGEuc29sYW5hQWRkcmVzcyB8fCBcIlwiO1xuICAgICAgICB0aGlzLnhsbUFkZHJlc3MgPSByZWFkUHVibGljRGF0YVhsbUFkZHJlc3MoZGF0YSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik7XG4gICAgICAgIHRoaXMuc3VpQWRkcmVzcyA9IGRhdGEuc3VpQWRkcmVzcyB8fCBcIlwiO1xuICAgICAgICB0aGlzLnRvbkFkZHJlc3MgPSBkYXRhLnRvbkFkZHJlc3MgfHwgXCJcIjtcbiAgICAgICAgdGhpcy5kb3RBZGRyZXNzID0gcmVhZFB1YmxpY0RhdGFEb3RBZGRyZXNzKGRhdGEgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pO1xuICAgICAgICB0aGlzLmtzbUFkZHJlc3MgPSByZWFkUHVibGljRGF0YUtzbUFkZHJlc3MoZGF0YSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik7XG4gICAgICAgIHRoaXMudGFnTmFtZSA9IGRhdGEudGFnTmFtZSB8fCBcIlwiO1xuICAgICAgICB0aGlzLmhhc1Bhc3N3b3JkID0gZGF0YS5oYXNQYXNzd29yZCB8fCBcImZhbHNlXCI7XG4gICAgICAgIHRoaXMudHlwZSA9IGRhdGEudHlwZSB8fCBcIlwiO1xuICAgICAgICB0aGlzLm9yaWdpbiA9IGRhdGEub3JpZ2luIHx8IFwiXCI7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJlZEF0ID0gZGF0YS5yZWdpc3RlcmVkQXQgfHwgXCJcIjtcbiAgICAgICAgdGhpcy5leHBpcmVzQXQgPSBkYXRhLmV4cGlyZXNBdCB8fCBcIlwiO1xuICAgICAgICB0aGlzLnN0ID0gZGF0YS5zdCB8fCBcIlwiO1xuXG4gICAgICAgIHRoaXMuZ3JhY2VQZXJpb2QgPSB0aGlzLl9jYWxjdWxhdGVHcmFjZVBlcmlvZCgpO1xuICAgIH1cblxuICAgIGdldCBpc0V4cGlyZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIGlmICghdGhpcy5leHBpcmVzQXQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHRoaXMuZXhwaXJlc0F0KSA8IG5ldyBEYXRlKCk7XG4gICAgfVxuXG4gICAgZ2V0IGlzRXhwaXJpbmdTb29uKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoIXRoaXMuZXhwaXJlc0F0KSByZXR1cm4gZmFsc2U7XG4gICAgICAgIGNvbnN0IG9uZU1vbnRoSW5NcyA9IDI0ICogNjAgKiA2MCAqIDEwMDAgKiAzMDtcbiAgICAgICAgY29uc3QgdGltZUxlZnQgPSB0aGlzLl90aW1lUmVtYWluaW5nKCk7XG4gICAgICAgIHJldHVybiB0aW1lTGVmdCA+IDAgJiYgdGltZUxlZnQgPD0gb25lTW9udGhJbk1zO1xuICAgIH1cblxuICAgIGdldCBpc0Z1bGx5RXhwaXJlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNFeHBpcmVkICYmICF0aGlzLmlzSW5HcmFjZVBlcmlvZDtcbiAgICB9XG5cbiAgICBnZXQgaXNJbkdyYWNlUGVyaW9kKCk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAodGhpcy50eXBlICE9PSBcIm1haW5uZXRcIiB8fCAhdGhpcy5ncmFjZVBlcmlvZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICByZXR1cm4gbm93IDwgdGhpcy5ncmFjZVBlcmlvZCAmJiBub3cgPiBuZXcgRGF0ZSh0aGlzLmV4cGlyZXNBdCB8fCBcIlwiKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIF9jYWxjdWxhdGVHcmFjZVBlcmlvZCgpOiBEYXRlIHwgbnVsbCB7XG4gICAgICAgIGlmICh0aGlzLnR5cGUgIT09IFwibWFpbm5ldFwiKSByZXR1cm4gbnVsbDtcblxuICAgICAgICBjb25zdCBncmFjZVBlcmlvZCA9IG5ldyBEYXRlKHRoaXMuZXhwaXJlc0F0IHx8IFwiXCIpO1xuICAgICAgICBncmFjZVBlcmlvZC5zZXREYXRlKGdyYWNlUGVyaW9kLmdldERhdGUoKSArIDMwKTtcblxuICAgICAgICByZXR1cm4gZ3JhY2VQZXJpb2Q7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfdGltZVJlbWFpbmluZygpOiBudW1iZXIge1xuICAgICAgICBpZiAoIXRoaXMuZXhwaXJlc0F0KSByZXR1cm4gMDtcbiAgICAgICAgY29uc3QgZXhwaXJlc0F0VGltZSA9IG5ldyBEYXRlKHRoaXMuZXhwaXJlc0F0IHx8IFwiXCIpLmdldFRpbWUoKTtcbiAgICAgICAgcmV0dXJuIGV4cGlyZXNBdFRpbWUgLSBEYXRlLm5vdygpO1xuICAgIH1cblxuICAgIHRpbWVMZWZ0SW5HcmFjZVBlcmlvZFNlY29uZHMoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMudHlwZSAhPT0gXCJtYWlubmV0XCIgfHwgIXRoaXMuZ3JhY2VQZXJpb2QpIHJldHVybiAwO1xuXG4gICAgICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBjb25zdCBncmFjZVBlcmlvZEVuZCA9IHRoaXMuZ3JhY2VQZXJpb2QuZ2V0VGltZSgpO1xuXG4gICAgICAgIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLmZsb29yKChncmFjZVBlcmlvZEVuZCAtIG5vdykgLyAxMDAwKSk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGFnTW9kZWwge1xuICAgIF9pZDogc3RyaW5nO1xuICAgIGF2YWlsYWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGhhc1Bhc3N3b3JkOiBib29sZWFuO1xuICAgIGltYWdlOiBzdHJpbmc7XG4gICAgbWV0YWRhdGE6IGFueTtcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgcGdwPzogUEdQID0geyBlbmNyeXB0ZWRNZXNzYWdlOiBcIlwiLCBwcml2YXRlS2V5OiBcIlwiIH07XG4gICAgcHVibGljRGF0YTogVGFnUHVibGljRGF0YU1vZGVsO1xuICAgIHplbGZQcm9vZjogc3RyaW5nO1xuICAgIHplbGZQcm9vZlFSQ29kZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IoZGF0YTogYW55ID0ge30pIHtcbiAgICAgICAgaWYgKGRhdGEgaW5zdGFuY2VvZiBUYWdNb2RlbCkge1xuICAgICAgICAgICAgdGhpcy5faWQgPSBkYXRhLl9pZDtcbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlID0gZGF0YS5hdmFpbGFibGU7XG4gICAgICAgICAgICB0aGlzLmhhc1Bhc3N3b3JkID0gZGF0YS5oYXNQYXNzd29yZDtcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBkYXRhLmltYWdlO1xuICAgICAgICAgICAgdGhpcy5tZXRhZGF0YSA9IGRhdGEubWV0YWRhdGE7XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBkYXRhLm5hbWU7XG4gICAgICAgICAgICB0aGlzLnBncCA9IGRhdGEucGdwO1xuICAgICAgICAgICAgdGhpcy5wdWJsaWNEYXRhID0gZGF0YS5wdWJsaWNEYXRhO1xuICAgICAgICAgICAgdGhpcy56ZWxmUHJvb2YgPSBkYXRhLnplbGZQcm9vZjtcbiAgICAgICAgICAgIHRoaXMuemVsZlByb29mUVJDb2RlID0gZGF0YS56ZWxmUHJvb2ZRUkNvZGU7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX2lkID0gZGF0YS5pZCB8fCBkYXRhLl9pZCB8fCBcIlwiO1xuXG4gICAgICAgIHRoaXMuYXZhaWxhYmxlID0gZGF0YS5hdmFpbGFibGUgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMuaGFzUGFzc3dvcmQgPSBCb29sZWFuKGRhdGEucHVibGljRGF0YT8uaGFzUGFzc3dvcmQgPT09IFwidHJ1ZVwiIHx8IGRhdGEuaGFzUGFzc3dvcmQpO1xuICAgICAgICB0aGlzLmltYWdlID0gZGF0YS51cmwgfHwgZGF0YS56ZWxmUHJvb2ZRUkNvZGUgfHwgXCJcIjtcbiAgICAgICAgdGhpcy5tZXRhZGF0YSA9IGRhdGEubWV0YWRhdGEgfHwge307XG4gICAgICAgIHRoaXMuemVsZlByb29mID0gZGF0YS56ZWxmUHJvb2YgfHwgXCJcIjtcbiAgICAgICAgdGhpcy56ZWxmUHJvb2ZRUkNvZGUgPSBkYXRhLnplbGZQcm9vZlFSQ29kZSB8fCBcIlwiO1xuICAgICAgICB0aGlzLnBncCA9IChkYXRhLnBncCBhcyBQR1ApIHx8IHsgZW5jcnlwdGVkTWVzc2FnZTogXCJcIiwgcHJpdmF0ZUtleTogXCJcIiB9O1xuXG4gICAgICAgIC8vIEdldCB0aGUgdGFnIG5hbWUgZnJvbSB2YXJpb3VzIHBvc3NpYmxlIHNvdXJjZXNcbiAgICAgICAgY29uc3QgcmF3VGFnTmFtZSA9IGRhdGEudGFnTmFtZSB8fCBkYXRhLm5hbWUgfHwgZGF0YS5wdWJsaWNEYXRhPy50YWdOYW1lIHx8IGRhdGEucHVibGljRGF0YT8uemVsZk5hbWUgfHwgXCJcIjtcbiAgICAgICAgdGhpcy5uYW1lID0gcmF3VGFnTmFtZSA/IHJhd1RhZ05hbWUucmVwbGFjZShcIi5ob2xkXCIsIFwiXCIpIDogXCJcIjtcblxuICAgICAgICAvLyBFeHRyYWN0IGRvbWFpbiBmcm9tIHRhZyBuYW1lIGlmIG5vdCBleHBsaWNpdGx5IHByb3ZpZGVkXG4gICAgICAgIGNvbnN0IGV4dHJhY3REb21haW4gPSAodGFnTmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICAgICAgICAgIGlmICghdGFnTmFtZSkgcmV0dXJuIFwiXCI7XG5cbiAgICAgICAgICAgIC8vIFJlbW92ZSAuaG9sZCBzdWZmaXggZmlyc3QgaWYgcHJlc2VudFxuICAgICAgICAgICAgY29uc3QgY2xlYW5UYWdOYW1lID0gdGFnTmFtZS5yZXBsYWNlKFwiLmhvbGRcIiwgXCJcIik7XG5cbiAgICAgICAgICAgIC8vIFNwbGl0IGJ5IGRvdHMgYW5kIGdldCB0aGUgbGFzdCBwYXJ0IGFzIGRvbWFpblxuICAgICAgICAgICAgY29uc3QgcGFydHMgPSBjbGVhblRhZ05hbWUuc3BsaXQoXCIuXCIpO1xuXG4gICAgICAgICAgICBpZiAocGFydHMubGVuZ3RoID49IDIpIHJldHVybiBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXTsgLy8gR2V0IHRoZSBsYXN0IHBhcnQgKGRvbWFpbilcblxuICAgICAgICAgICAgcmV0dXJuIFwiemVsZlwiOyAvLyBEZWZhdWx0IGRvbWFpblxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGV4cGxpY2l0RG9tYWluID0gZGF0YS5kb21haW4gfHwgZGF0YS5wdWJsaWNEYXRhPy5kb21haW47XG4gICAgICAgIGNvbnN0IGV4dHJhY3RlZERvbWFpbiA9IGV4cGxpY2l0RG9tYWluIHx8IGV4dHJhY3REb21haW4ocmF3VGFnTmFtZSk7XG5cbiAgICAgICAgLy8gU3ByZWFkIHJhdyBgcHVibGljRGF0YWAgc28gUGluYXRhL3Nob3J0IGtleXMgKGBkb3RgLCBga3NtYCwgY2h1bmsgSlNPTikgYXJlIHZpc2libGUgdG9cbiAgICAgICAgLy8gcmVhZFB1YmxpY0RhdGEqIGluIFRhZ1B1YmxpY0RhdGFNb2RlbCAoc2FtZSBwYXR0ZXJuIGFzIHRoZSBmdWxsIHNlYXJjaCBBUEkgcGF5bG9hZCkuXG4gICAgICAgIGNvbnN0IHB1YmxpY0RhdGFTcmM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID1cbiAgICAgICAgICAgIGRhdGEucHVibGljRGF0YSAmJiB0eXBlb2YgZGF0YS5wdWJsaWNEYXRhID09PSBcIm9iamVjdFwiID8geyAuLi4oZGF0YS5wdWJsaWNEYXRhIGFzIG9iamVjdCkgfSA6IHt9O1xuXG4gICAgICAgIHRoaXMucHVibGljRGF0YSA9IG5ldyBUYWdQdWJsaWNEYXRhTW9kZWwoe1xuICAgICAgICAgICAgLi4ucHVibGljRGF0YVNyYyxcbiAgICAgICAgICAgIGF2YWxhbmNoZUFkZHJlc3M6IGRhdGEucHVibGljRGF0YT8uYXZhbGFuY2hlQWRkcmVzcyB8fCBkYXRhLnB1YmxpY0RhdGE/LmV0aEFkZHJlc3MgfHwgXCJcIixcbiAgICAgICAgICAgIGJpbmFuY2VBZGRyZXNzOiBkYXRhLnB1YmxpY0RhdGE/LmJpbmFuY2VBZGRyZXNzIHx8IGRhdGEucHVibGljRGF0YT8uZXRoQWRkcmVzcyB8fCBcIlwiLFxuICAgICAgICAgICAgYmxvY2tEQUdBZGRyZXNzOiBkYXRhLnB1YmxpY0RhdGE/LmJsb2NrREFHQWRkcmVzcyB8fCBcIlwiLFxuICAgICAgICAgICAgYnRjQWRkcmVzczogZGF0YS5wdWJsaWNEYXRhPy5idGNBZGRyZXNzIHx8IFwiXCIsXG4gICAgICAgICAgICBkb21haW46IGV4dHJhY3RlZERvbWFpbixcbiAgICAgICAgICAgIGV0aEFkZHJlc3M6IGRhdGEucHVibGljRGF0YT8uZXRoQWRkcmVzcyB8fCBcIlwiLFxuICAgICAgICAgICAgZXhwaXJlc0F0OiBkYXRhLnB1YmxpY0RhdGE/LmV4cGlyZXNBdCB8fCBcIlwiLFxuICAgICAgICAgICAgaGFzUGFzc3dvcmQ6IGRhdGEucHVibGljRGF0YT8uaGFzUGFzc3dvcmQgfHwgXCJmYWxzZVwiLFxuICAgICAgICAgICAgb3JpZ2luOiBkYXRhLnB1YmxpY0RhdGE/Lm9yaWdpbiB8fCBcIlwiLFxuICAgICAgICAgICAgcmVnaXN0ZXJlZEF0OiBkYXRhLnB1YmxpY0RhdGE/LnJlZ2lzdGVyZWRBdCB8fCBcIlwiLFxuICAgICAgICAgICAgc29sYW5hQWRkcmVzczogZGF0YS5wdWJsaWNEYXRhPy5zb2xhbmFBZGRyZXNzIHx8IFwiXCIsXG4gICAgICAgICAgICBzdWlBZGRyZXNzOiBkYXRhLnB1YmxpY0RhdGE/LnN1aUFkZHJlc3MgfHwgXCJcIixcbiAgICAgICAgICAgIHRvbkFkZHJlc3M6IGRhdGEucHVibGljRGF0YT8udG9uQWRkcmVzcyB8fCBcIlwiLFxuICAgICAgICAgICAgdGFnTmFtZTogcmF3VGFnTmFtZSxcbiAgICAgICAgICAgIHR5cGU6IGRhdGEucHVibGljRGF0YT8udHlwZSB8fCBcIlwiLFxuICAgICAgICAgICAgc3Q6IGRhdGEucHVibGljRGF0YT8uc3QgfHwgXCJcIixcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZ2V0IGRpc3BsYXlCdGNBZGRyZXNzKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJzZUFkZHJlc3ModGhpcy5wdWJsaWNEYXRhPy5idGNBZGRyZXNzKTtcbiAgICB9XG5cbiAgICBnZXQgZGlzcGxheUV0aEFkZHJlc3MoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnNlQWRkcmVzcyh0aGlzLnB1YmxpY0RhdGE/LmV0aEFkZHJlc3MpO1xuICAgIH1cblxuICAgIGdldCBkaXNwbGF5U29sYW5hQWRkcmVzcygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFyc2VBZGRyZXNzKHRoaXMucHVibGljRGF0YT8uc29sYW5hQWRkcmVzcyk7XG4gICAgfVxuXG4gICAgZ2V0IGRpc3BsYXlTdWlBZGRyZXNzKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJzZUFkZHJlc3ModGhpcy5wdWJsaWNEYXRhPy5zdWlBZGRyZXNzKTtcbiAgICB9XG5cbiAgICBnZXQgZGlzcGxheVRvbkFkZHJlc3MoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnNlQWRkcmVzcyh0aGlzLnB1YmxpY0RhdGE/LnRvbkFkZHJlc3MpO1xuICAgIH1cblxuICAgIGdldCBkaXNwbGF5QXZhbGFuY2hlQWRkcmVzcygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFyc2VBZGRyZXNzKHRoaXMucHVibGljRGF0YT8uYXZhbGFuY2hlQWRkcmVzcyk7XG4gICAgfVxuXG4gICAgZ2V0IGRpc3BsYXlCaW5hbmNlQWRkcmVzcygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fcGFyc2VBZGRyZXNzKHRoaXMucHVibGljRGF0YT8uYmluYW5jZUFkZHJlc3MpO1xuICAgIH1cblxuICAgIGdldCBkaXNwbGF5QmxvY2tEQUdBZGRyZXNzKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJzZUFkZHJlc3ModGhpcy5wdWJsaWNEYXRhPy5ibG9ja0RBR0FkZHJlc3MgfHwgdGhpcy5wdWJsaWNEYXRhPy5ldGhBZGRyZXNzKTtcbiAgICB9XG5cbiAgICBnZXQgZGlzcGxheVhsbUFkZHJlc3MoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnNlQWRkcmVzcyh0aGlzLnB1YmxpY0RhdGE/LnhsbUFkZHJlc3MpO1xuICAgIH1cblxuICAgIHByaXZhdGUgX3BhcnNlQWRkcmVzcyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgaWYgKCF2YWx1ZSB8fCB2YWx1ZS5sZW5ndGggPD0gMTYpIHJldHVybiB2YWx1ZTtcblxuICAgICAgICBjb25zdCBmaXJzdFBhcnQgPSB2YWx1ZS5zbGljZSgwLCA4KTtcbiAgICAgICAgY29uc3QgbGFzdFBhcnQgPSB2YWx1ZS5zbGljZSgtOCk7XG5cbiAgICAgICAgcmV0dXJuIGAke2ZpcnN0UGFydH0uLi4ke2xhc3RQYXJ0fWA7XG4gICAgfVxuXG4gICAgdXBkYXRlUHVibGljRGF0YShkYXRhOiBQYXJ0aWFsPFRhZ1B1YmxpY0RhdGE+KTogdm9pZCB7XG4gICAgICAgIHRoaXMucHVibGljRGF0YSA9IG5ldyBUYWdQdWJsaWNEYXRhTW9kZWwoeyAuLi50aGlzLnB1YmxpY0RhdGEsIC4uLmRhdGEgfSk7XG4gICAgfVxuXG4gICAgZ2V0IGlzRXhwaXJlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljRGF0YS5pc0V4cGlyZWQ7XG4gICAgfVxuXG4gICAgZ2V0IGlzRXhwaXJpbmdTb29uKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNEYXRhLmlzRXhwaXJpbmdTb29uO1xuICAgIH1cblxuICAgIGdldCBpc0Z1bGx5RXhwaXJlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHVibGljRGF0YS5pc0Z1bGx5RXhwaXJlZDtcbiAgICB9XG5cbiAgICBnZXQgaXNJbkdyYWNlUGVyaW9kKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNEYXRhLmlzSW5HcmFjZVBlcmlvZDtcbiAgICB9XG5cbiAgICBnZXQgaXNIb2xkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNEYXRhPy50eXBlID09PSBcImhvbGRcIjtcbiAgICB9XG5cbiAgICBnZXQgaXNNYWlubmV0KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wdWJsaWNEYXRhPy50eXBlID09PSBcIm1haW5uZXRcIjtcbiAgICB9XG5cbiAgICBnZXQgZG9tYWluKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGRvbWFpbiA9IHRoaXMucHVibGljRGF0YT8uZG9tYWluO1xuXG4gICAgICAgIGlmIChkb21haW4pIHJldHVybiBkb21haW47XG5cbiAgICAgICAgY29uc3QgcGFydHMgPSB0aGlzLnB1YmxpY0RhdGE/LnRhZ05hbWUuc3BsaXQoXCIuXCIpO1xuXG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPj0gMikgcmV0dXJuIHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIHJldHVybiBcInplbGZcIjtcbiAgICB9XG5cbiAgICBnZXQgdGFnTmFtZSgpOiBzdHJpbmcge1xuICAgICAgICBsZXQgdGFnTmFtZSA9IHRoaXMucHVibGljRGF0YT8udGFnTmFtZSB8fCB0aGlzLm5hbWU7XG5cbiAgICAgICAgaWYgKHRhZ05hbWUuaW5jbHVkZXModGhpcy5wdWJsaWNEYXRhLmRvbWFpbikpIHRhZ05hbWUgPSB0YWdOYW1lLnNwbGl0KFwiLlwiKVswXTtcblxuICAgICAgICByZXR1cm4gdGFnTmFtZTtcbiAgICB9XG5cbiAgICBnZXQgZnVsbFRhZ05hbWUoKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgZnVsbFRhZ05hbWUgPSB0aGlzLnB1YmxpY0RhdGEudGFnTmFtZSB8fCB0aGlzLm5hbWU7XG5cbiAgICAgICAgaWYgKGZ1bGxUYWdOYW1lLmluY2x1ZGVzKHRoaXMucHVibGljRGF0YS5kb21haW4pKSByZXR1cm4gZnVsbFRhZ05hbWUucmVwbGFjZShcIi5ob2xkXCIsIFwiXCIpO1xuXG4gICAgICAgIHJldHVybiBgJHtmdWxsVGFnTmFtZX0uJHt0aGlzLnB1YmxpY0RhdGEuZG9tYWlufWA7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBNYXBzIEVWTSBjaGFpbklkIHZhbHVlcyB0byBiYWNrZW5kIFJQQyBwcm94eSBwYXRoIGtleXMgKGAvYXBpL3Byb3RlY3RlZC9ycGMvOmNoYWluS2V5YCBhbmQgYC9hcGkvcnBjLzpjaGFpbktleWApLlxuICovXG5leHBvcnQgY29uc3QgQ0hBSU5fS0VZX0JZX0NIQUlOX0lEOiBSZWFkb25seTxSZWNvcmQ8bnVtYmVyLCBzdHJpbmc+PiA9IHtcbiAgICAxOiBcImV0aGVyZXVtXCIsXG4gICAgMTA6IFwib3B0aW1pc21cIixcbiAgICA1NjogXCJic2NcIixcbiAgICAxMzc6IFwicG9seWdvblwiLFxuICAgIDg0NTM6IFwiYmFzZVwiLFxuICAgIDQyMTYxOiBcImFyYml0cnVtXCIsXG4gICAgNDMxMTQ6IFwiYXZhbGFuY2hlXCIsXG4gICAgMTQwNDogXCJibG9ja2RhZ1wiLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENoYWluS2V5RnJvbUNoYWluSWQoY2hhaW5JZDogbnVtYmVyKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoY2hhaW5JZCkpIHJldHVybiBudWxsO1xuICAgIHJldHVybiBDSEFJTl9LRVlfQllfQ0hBSU5fSURbY2hhaW5JZF0gPz8gbnVsbDtcbn1cblxuLyoqXG4gKiBDaGFpbnMgd2hlcmUgYXNzZXQgc2VuZHMgbXVzdCB1c2UgSldUICsgYC9hcGkvcHJvdGVjdGVkL3JwYy86Y2hhaW5LZXlgIChubyBzaWxlbnQgZGlyZWN0IFJQQyBmYWxsYmFjaykuXG4gKiBBbGlnbnMgd2l0aCBzZXJ2ZXIgYEVYVEVOU0lPTl8qX1JQQ19VUkxgIHRyYWNraW5nLlxuICovXG5leHBvcnQgY29uc3QgU1RSSUNUX1BST1RFQ1RFRF9SUENfQ0hBSU5fS0VZUyA9IG5ldyBTZXQ8c3RyaW5nPihbXCJldGhlcmV1bVwiLCBcImJzY1wiLCBcInBvbHlnb25cIiwgXCJhdmFsYW5jaGVcIl0pO1xuXG4vKiogV2hlbiBgZmFsc2VgLCBScGNQcm92aWRlclNlcnZpY2UgbXVzdCBub3QgZmFsbCBiYWNrIHRvIGRpcmVjdCBlbnYgUlBDIChzZXNzaW9uIHJlcXVpcmVkKS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbGxvd0RpcmVjdEZhbGxiYWNrRm9yQ2hhaW5LZXkoY2hhaW5LZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhU1RSSUNUX1BST1RFQ1RFRF9SUENfQ0hBSU5fS0VZUy5oYXMoY2hhaW5LZXkpO1xufVxuXG4vKiogVW5rbm93biBjaGFpbklkcyBzdGF5IHBlcm1pc3NpdmUgc28gb3RoZXIgZmxvd3Mga2VlcCBvcHRpb25hbCBmYWxsYmFjay4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbGxvd0RpcmVjdEZhbGxiYWNrRm9yQ2hhaW5JZChjaGFpbklkOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBjb25zdCBrZXkgPSBnZXRDaGFpbktleUZyb21DaGFpbklkKGNoYWluSWQpO1xuICAgIGlmICgha2V5KSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gYWxsb3dEaXJlY3RGYWxsYmFja0ZvckNoYWluS2V5KGtleSk7XG59XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoXCJ3ZWJleHRlbnNpb24tcG9seWZpbGxcIiwgW1wibW9kdWxlXCJdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGZhY3RvcnkobW9kdWxlKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbW9kID0ge1xuICAgICAgZXhwb3J0czoge31cbiAgICB9O1xuICAgIGZhY3RvcnkobW9kKTtcbiAgICBnbG9iYWwuYnJvd3NlciA9IG1vZC5leHBvcnRzO1xuICB9XG59KSh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFRoaXMgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbiAobW9kdWxlKSB7XG4gIC8qIHdlYmV4dGVuc2lvbi1wb2x5ZmlsbCAtIHYwLjEyLjAgLSBUdWUgTWF5IDE0IDIwMjQgMTg6MDE6MjkgKi9cbiAgLyogLSotIE1vZGU6IGluZGVudC10YWJzLW1vZGU6IG5pbDsganMtaW5kZW50LWxldmVsOiAyIC0qLSAqL1xuICAvKiB2aW06IHNldCBzdHM9MiBzdz0yIGV0IHR3PTgwOiAqL1xuICAvKiBUaGlzIFNvdXJjZSBDb2RlIEZvcm0gaXMgc3ViamVjdCB0byB0aGUgdGVybXMgb2YgdGhlIE1vemlsbGEgUHVibGljXG4gICAqIExpY2Vuc2UsIHYuIDIuMC4gSWYgYSBjb3B5IG9mIHRoZSBNUEwgd2FzIG5vdCBkaXN0cmlidXRlZCB3aXRoIHRoaXNcbiAgICogZmlsZSwgWW91IGNhbiBvYnRhaW4gb25lIGF0IGh0dHA6Ly9tb3ppbGxhLm9yZy9NUEwvMi4wLy4gKi9cbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgaWYgKCEoZ2xvYmFsVGhpcy5jaHJvbWUgJiYgZ2xvYmFsVGhpcy5jaHJvbWUucnVudGltZSAmJiBnbG9iYWxUaGlzLmNocm9tZS5ydW50aW1lLmlkKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlRoaXMgc2NyaXB0IHNob3VsZCBvbmx5IGJlIGxvYWRlZCBpbiBhIGJyb3dzZXIgZXh0ZW5zaW9uLlwiKTtcbiAgfVxuICBpZiAoIShnbG9iYWxUaGlzLmJyb3dzZXIgJiYgZ2xvYmFsVGhpcy5icm93c2VyLnJ1bnRpbWUgJiYgZ2xvYmFsVGhpcy5icm93c2VyLnJ1bnRpbWUuaWQpKSB7XG4gICAgY29uc3QgQ0hST01FX1NFTkRfTUVTU0FHRV9DQUxMQkFDS19OT19SRVNQT05TRV9NRVNTQUdFID0gXCJUaGUgbWVzc2FnZSBwb3J0IGNsb3NlZCBiZWZvcmUgYSByZXNwb25zZSB3YXMgcmVjZWl2ZWQuXCI7XG5cbiAgICAvLyBXcmFwcGluZyB0aGUgYnVsayBvZiB0aGlzIHBvbHlmaWxsIGluIGEgb25lLXRpbWUtdXNlIGZ1bmN0aW9uIGlzIGEgbWlub3JcbiAgICAvLyBvcHRpbWl6YXRpb24gZm9yIEZpcmVmb3guIFNpbmNlIFNwaWRlcm1vbmtleSBkb2VzIG5vdCBmdWxseSBwYXJzZSB0aGVcbiAgICAvLyBjb250ZW50cyBvZiBhIGZ1bmN0aW9uIHVudGlsIHRoZSBmaXJzdCB0aW1lIGl0J3MgY2FsbGVkLCBhbmQgc2luY2UgaXQgd2lsbFxuICAgIC8vIG5ldmVyIGFjdHVhbGx5IG5lZWQgdG8gYmUgY2FsbGVkLCB0aGlzIGFsbG93cyB0aGUgcG9seWZpbGwgdG8gYmUgaW5jbHVkZWRcbiAgICAvLyBpbiBGaXJlZm94IG5lYXJseSBmb3IgZnJlZS5cbiAgICBjb25zdCB3cmFwQVBJcyA9IGV4dGVuc2lvbkFQSXMgPT4ge1xuICAgICAgLy8gTk9URTogYXBpTWV0YWRhdGEgaXMgYXNzb2NpYXRlZCB0byB0aGUgY29udGVudCBvZiB0aGUgYXBpLW1ldGFkYXRhLmpzb24gZmlsZVxuICAgICAgLy8gYXQgYnVpbGQgdGltZSBieSByZXBsYWNpbmcgdGhlIGZvbGxvd2luZyBcImluY2x1ZGVcIiB3aXRoIHRoZSBjb250ZW50IG9mIHRoZVxuICAgICAgLy8gSlNPTiBmaWxlLlxuICAgICAgY29uc3QgYXBpTWV0YWRhdGEgPSB7XG4gICAgICAgIFwiYWxhcm1zXCI6IHtcbiAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY2xlYXJBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJib29rbWFya3NcIjoge1xuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Q2hpbGRyZW5cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRSZWNlbnRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRTdWJUcmVlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VHJlZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVUcmVlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiYnJvd3NlckFjdGlvblwiOiB7XG4gICAgICAgICAgXCJkaXNhYmxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZW5hYmxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3JcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRCYWRnZVRleHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwib3BlblBvcHVwXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3JcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRCYWRnZVRleHRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRJY29uXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0UG9wdXBcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRUaXRsZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImJyb3dzaW5nRGF0YVwiOiB7XG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVDYWNoZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUNvb2tpZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVEb3dubG9hZHNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVGb3JtRGF0YVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUhpc3RvcnlcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVMb2NhbFN0b3JhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVQYXNzd29yZHNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVQbHVnaW5EYXRhXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0dGluZ3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb21tYW5kc1wiOiB7XG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJjb250ZXh0TWVudXNcIjoge1xuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiY29va2llc1wiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxDb29raWVTdG9yZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkZXZ0b29sc1wiOiB7XG4gICAgICAgICAgXCJpbnNwZWN0ZWRXaW5kb3dcIjoge1xuICAgICAgICAgICAgXCJldmFsXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyLFxuICAgICAgICAgICAgICBcInNpbmdsZUNhbGxiYWNrQXJnXCI6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInBhbmVsc1wiOiB7XG4gICAgICAgICAgICBcImNyZWF0ZVwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAzLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMyxcbiAgICAgICAgICAgICAgXCJzaW5nbGVDYWxsYmFja0FyZ1wiOiB0cnVlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJlbGVtZW50c1wiOiB7XG4gICAgICAgICAgICAgIFwiY3JlYXRlU2lkZWJhclBhbmVcIjoge1xuICAgICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZG93bmxvYWRzXCI6IHtcbiAgICAgICAgICBcImNhbmNlbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRvd25sb2FkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZXJhc2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRGaWxlSWNvblwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm9wZW5cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwiZmFsbGJhY2tUb05vQ2FsbGJhY2tcIjogdHJ1ZVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJwYXVzZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInJlbW92ZUZpbGVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXN1bWVcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZWFyY2hcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzaG93XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiZXh0ZW5zaW9uXCI6IHtcbiAgICAgICAgICBcImlzQWxsb3dlZEZpbGVTY2hlbWVBY2Nlc3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJpc0FsbG93ZWRJbmNvZ25pdG9BY2Nlc3NcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJoaXN0b3J5XCI6IHtcbiAgICAgICAgICBcImFkZFVybFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRlbGV0ZUFsbFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImRlbGV0ZVJhbmdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGVsZXRlVXJsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0VmlzaXRzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VhcmNoXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaTE4blwiOiB7XG4gICAgICAgICAgXCJkZXRlY3RMYW5ndWFnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEFjY2VwdExhbmd1YWdlc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImlkZW50aXR5XCI6IHtcbiAgICAgICAgICBcImxhdW5jaFdlYkF1dGhGbG93XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiaWRsZVwiOiB7XG4gICAgICAgICAgXCJxdWVyeVN0YXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwibWFuYWdlbWVudFwiOiB7XG4gICAgICAgICAgXCJnZXRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRBbGxcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRTZWxmXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0RW5hYmxlZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVuaW5zdGFsbFNlbGZcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJub3RpZmljYXRpb25zXCI6IHtcbiAgICAgICAgICBcImNsZWFyXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0UGVybWlzc2lvbkxldmVsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwicGFnZUFjdGlvblwiOiB7XG4gICAgICAgICAgXCJnZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiaGlkZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldEljb25cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRQb3B1cFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNldFRpdGxlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDEsXG4gICAgICAgICAgICBcImZhbGxiYWNrVG9Ob0NhbGxiYWNrXCI6IHRydWVcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2hvd1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJmYWxsYmFja1RvTm9DYWxsYmFja1wiOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInBlcm1pc3Npb25zXCI6IHtcbiAgICAgICAgICBcImNvbnRhaW5zXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVxdWVzdFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInJ1bnRpbWVcIjoge1xuICAgICAgICAgIFwiZ2V0QmFja2dyb3VuZFBhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRQbGF0Zm9ybUluZm9cIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJvcGVuT3B0aW9uc1BhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJyZXF1ZXN0VXBkYXRlQ2hlY2tcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZW5kTWVzc2FnZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAzXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNlbmROYXRpdmVNZXNzYWdlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0VW5pbnN0YWxsVVJMXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwic2Vzc2lvbnNcIjoge1xuICAgICAgICAgIFwiZ2V0RGV2aWNlc1wiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFJlY2VudGx5Q2xvc2VkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVzdG9yZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcInN0b3JhZ2VcIjoge1xuICAgICAgICAgIFwibG9jYWxcIjoge1xuICAgICAgICAgICAgXCJjbGVhclwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRCeXRlc0luVXNlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJtYW5hZ2VkXCI6IHtcbiAgICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRCeXRlc0luVXNlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInN5bmNcIjoge1xuICAgICAgICAgICAgXCJjbGVhclwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJnZXRCeXRlc0luVXNlXCI6IHtcbiAgICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJyZW1vdmVcIjoge1xuICAgICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInNldFwiOiB7XG4gICAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJ0YWJzXCI6IHtcbiAgICAgICAgICBcImNhcHR1cmVWaXNpYmxlVGFiXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZGV0ZWN0TGFuZ3VhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJkaXNjYXJkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZHVwbGljYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZXhlY3V0ZVNjcmlwdFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldEN1cnJlbnRcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDAsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRab29tXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Wm9vbVNldHRpbmdzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ29CYWNrXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ29Gb3J3YXJkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiaGlnaGxpZ2h0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiaW5zZXJ0Q1NTXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwibW92ZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMixcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAyXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInF1ZXJ5XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVsb2FkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlQ1NTXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2VuZE1lc3NhZ2VcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDIsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogM1xuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJzZXRab29tXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2V0Wm9vbVNldHRpbmdzXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwidG9wU2l0ZXNcIjoge1xuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDBcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwid2ViTmF2aWdhdGlvblwiOiB7XG4gICAgICAgICAgXCJnZXRBbGxGcmFtZXNcIjoge1xuICAgICAgICAgICAgXCJtaW5BcmdzXCI6IDEsXG4gICAgICAgICAgICBcIm1heEFyZ3NcIjogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJnZXRGcmFtZVwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMSxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIndlYlJlcXVlc3RcIjoge1xuICAgICAgICAgIFwiaGFuZGxlckJlaGF2aW9yQ2hhbmdlZFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAwXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIndpbmRvd3NcIjoge1xuICAgICAgICAgIFwiY3JlYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0XCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0QWxsXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwiZ2V0Q3VycmVudFwiOiB7XG4gICAgICAgICAgICBcIm1pbkFyZ3NcIjogMCxcbiAgICAgICAgICAgIFwibWF4QXJnc1wiOiAxXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImdldExhc3RGb2N1c2VkXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAwLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwicmVtb3ZlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAxLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDFcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwibWluQXJnc1wiOiAyLFxuICAgICAgICAgICAgXCJtYXhBcmdzXCI6IDJcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpZiAoT2JqZWN0LmtleXMoYXBpTWV0YWRhdGEpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJhcGktbWV0YWRhdGEuanNvbiBoYXMgbm90IGJlZW4gaW5jbHVkZWQgaW4gYnJvd3Nlci1wb2x5ZmlsbFwiKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBBIFdlYWtNYXAgc3ViY2xhc3Mgd2hpY2ggY3JlYXRlcyBhbmQgc3RvcmVzIGEgdmFsdWUgZm9yIGFueSBrZXkgd2hpY2ggZG9lc1xuICAgICAgICogbm90IGV4aXN0IHdoZW4gYWNjZXNzZWQsIGJ1dCBiZWhhdmVzIGV4YWN0bHkgYXMgYW4gb3JkaW5hcnkgV2Vha01hcFxuICAgICAgICogb3RoZXJ3aXNlLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNyZWF0ZUl0ZW1cbiAgICAgICAqICAgICAgICBBIGZ1bmN0aW9uIHdoaWNoIHdpbGwgYmUgY2FsbGVkIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGUgdmFsdWUgZm9yIGFueVxuICAgICAgICogICAgICAgIGtleSB3aGljaCBkb2VzIG5vdCBleGlzdCwgdGhlIGZpcnN0IHRpbWUgaXQgaXMgYWNjZXNzZWQuIFRoZVxuICAgICAgICogICAgICAgIGZ1bmN0aW9uIHJlY2VpdmVzLCBhcyBpdHMgb25seSBhcmd1bWVudCwgdGhlIGtleSBiZWluZyBjcmVhdGVkLlxuICAgICAgICovXG4gICAgICBjbGFzcyBEZWZhdWx0V2Vha01hcCBleHRlbmRzIFdlYWtNYXAge1xuICAgICAgICBjb25zdHJ1Y3RvcihjcmVhdGVJdGVtLCBpdGVtcyA9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHN1cGVyKGl0ZW1zKTtcbiAgICAgICAgICB0aGlzLmNyZWF0ZUl0ZW0gPSBjcmVhdGVJdGVtO1xuICAgICAgICB9XG4gICAgICAgIGdldChrZXkpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KGtleSwgdGhpcy5jcmVhdGVJdGVtKGtleSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc3VwZXIuZ2V0KGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIG9iamVjdCBpcyBhbiBvYmplY3Qgd2l0aCBhIGB0aGVuYCBtZXRob2QsIGFuZCBjYW5cbiAgICAgICAqIHRoZXJlZm9yZSBiZSBhc3N1bWVkIHRvIGJlaGF2ZSBhcyBhIFByb21pc2UuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gdGVzdC5cbiAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSB2YWx1ZSBpcyB0aGVuYWJsZS5cbiAgICAgICAqL1xuICAgICAgY29uc3QgaXNUaGVuYWJsZSA9IHZhbHVlID0+IHtcbiAgICAgICAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUudGhlbiA9PT0gXCJmdW5jdGlvblwiO1xuICAgICAgfTtcblxuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGFuZCByZXR1cm5zIGEgZnVuY3Rpb24gd2hpY2gsIHdoZW4gY2FsbGVkLCB3aWxsIHJlc29sdmUgb3IgcmVqZWN0XG4gICAgICAgKiB0aGUgZ2l2ZW4gcHJvbWlzZSBiYXNlZCBvbiBob3cgaXQgaXMgY2FsbGVkOlxuICAgICAgICpcbiAgICAgICAqIC0gSWYsIHdoZW4gY2FsbGVkLCBgY2hyb21lLnJ1bnRpbWUubGFzdEVycm9yYCBjb250YWlucyBhIG5vbi1udWxsIG9iamVjdCxcbiAgICAgICAqICAgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQgd2l0aCB0aGF0IHZhbHVlLlxuICAgICAgICogLSBJZiB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggZXhhY3RseSBvbmUgYXJndW1lbnQsIHRoZSBwcm9taXNlIGlzXG4gICAgICAgKiAgIHJlc29sdmVkIHRvIHRoYXQgdmFsdWUuXG4gICAgICAgKiAtIE90aGVyd2lzZSwgdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQgdG8gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlXG4gICAgICAgKiAgIGZ1bmN0aW9uJ3MgYXJndW1lbnRzLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9taXNlXG4gICAgICAgKiAgICAgICAgQW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHJlc29sdXRpb24gYW5kIHJlamVjdGlvbiBmdW5jdGlvbnMgb2YgYVxuICAgICAgICogICAgICAgIHByb21pc2UuXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBwcm9taXNlLnJlc29sdmVcbiAgICAgICAqICAgICAgICBUaGUgcHJvbWlzZSdzIHJlc29sdXRpb24gZnVuY3Rpb24uXG4gICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBwcm9taXNlLnJlamVjdFxuICAgICAgICogICAgICAgIFRoZSBwcm9taXNlJ3MgcmVqZWN0aW9uIGZ1bmN0aW9uLlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IG1ldGFkYXRhXG4gICAgICAgKiAgICAgICAgTWV0YWRhdGEgYWJvdXQgdGhlIHdyYXBwZWQgbWV0aG9kIHdoaWNoIGhhcyBjcmVhdGVkIHRoZSBjYWxsYmFjay5cbiAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmdcbiAgICAgICAqICAgICAgICBXaGV0aGVyIG9yIG5vdCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIG9ubHkgdGhlIGZpcnN0XG4gICAgICAgKiAgICAgICAgYXJndW1lbnQgb2YgdGhlIGNhbGxiYWNrLCBhbHRlcm5hdGl2ZWx5IGFuIGFycmF5IG9mIGFsbCB0aGVcbiAgICAgICAqICAgICAgICBjYWxsYmFjayBhcmd1bWVudHMgaXMgcmVzb2x2ZWQuIEJ5IGRlZmF1bHQsIGlmIHRoZSBjYWxsYmFja1xuICAgICAgICogICAgICAgIGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBvbmx5IGEgc2luZ2xlIGFyZ3VtZW50LCB0aGF0IHdpbGwgYmVcbiAgICAgICAqICAgICAgICByZXNvbHZlZCB0byB0aGUgcHJvbWlzZSwgd2hpbGUgYWxsIGFyZ3VtZW50cyB3aWxsIGJlIHJlc29sdmVkIGFzXG4gICAgICAgKiAgICAgICAgYW4gYXJyYXkgaWYgbXVsdGlwbGUgYXJlIGdpdmVuLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtmdW5jdGlvbn1cbiAgICAgICAqICAgICAgICBUaGUgZ2VuZXJhdGVkIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgICAgICovXG4gICAgICBjb25zdCBtYWtlQ2FsbGJhY2sgPSAocHJvbWlzZSwgbWV0YWRhdGEpID0+IHtcbiAgICAgICAgcmV0dXJuICguLi5jYWxsYmFja0FyZ3MpID0+IHtcbiAgICAgICAgICBpZiAoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvcikge1xuICAgICAgICAgICAgcHJvbWlzZS5yZWplY3QobmV3IEVycm9yKGV4dGVuc2lvbkFQSXMucnVudGltZS5sYXN0RXJyb3IubWVzc2FnZSkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAobWV0YWRhdGEuc2luZ2xlQ2FsbGJhY2tBcmcgfHwgY2FsbGJhY2tBcmdzLmxlbmd0aCA8PSAxICYmIG1ldGFkYXRhLnNpbmdsZUNhbGxiYWNrQXJnICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgcHJvbWlzZS5yZXNvbHZlKGNhbGxiYWNrQXJnc1swXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb21pc2UucmVzb2x2ZShjYWxsYmFja0FyZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgICBjb25zdCBwbHVyYWxpemVBcmd1bWVudHMgPSBudW1BcmdzID0+IG51bUFyZ3MgPT0gMSA/IFwiYXJndW1lbnRcIiA6IFwiYXJndW1lbnRzXCI7XG5cbiAgICAgIC8qKlxuICAgICAgICogQ3JlYXRlcyBhIHdyYXBwZXIgZnVuY3Rpb24gZm9yIGEgbWV0aG9kIHdpdGggdGhlIGdpdmVuIG5hbWUgYW5kIG1ldGFkYXRhLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAgICAgKiAgICAgICAgVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCB3aGljaCBpcyBiZWluZyB3cmFwcGVkLlxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IG1ldGFkYXRhXG4gICAgICAgKiAgICAgICAgTWV0YWRhdGEgYWJvdXQgdGhlIG1ldGhvZCBiZWluZyB3cmFwcGVkLlxuICAgICAgICogQHBhcmFtIHtpbnRlZ2VyfSBtZXRhZGF0YS5taW5BcmdzXG4gICAgICAgKiAgICAgICAgVGhlIG1pbmltdW0gbnVtYmVyIG9mIGFyZ3VtZW50cyB3aGljaCBtdXN0IGJlIHBhc3NlZCB0byB0aGVcbiAgICAgICAqICAgICAgICBmdW5jdGlvbi4gSWYgY2FsbGVkIHdpdGggZmV3ZXIgdGhhbiB0aGlzIG51bWJlciBvZiBhcmd1bWVudHMsIHRoZVxuICAgICAgICogICAgICAgIHdyYXBwZXIgd2lsbCByYWlzZSBhbiBleGNlcHRpb24uXG4gICAgICAgKiBAcGFyYW0ge2ludGVnZXJ9IG1ldGFkYXRhLm1heEFyZ3NcbiAgICAgICAqICAgICAgICBUaGUgbWF4aW11bSBudW1iZXIgb2YgYXJndW1lbnRzIHdoaWNoIG1heSBiZSBwYXNzZWQgdG8gdGhlXG4gICAgICAgKiAgICAgICAgZnVuY3Rpb24uIElmIGNhbGxlZCB3aXRoIG1vcmUgdGhhbiB0aGlzIG51bWJlciBvZiBhcmd1bWVudHMsIHRoZVxuICAgICAgICogICAgICAgIHdyYXBwZXIgd2lsbCByYWlzZSBhbiBleGNlcHRpb24uXG4gICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1ldGFkYXRhLnNpbmdsZUNhbGxiYWNrQXJnXG4gICAgICAgKiAgICAgICAgV2hldGhlciBvciBub3QgdGhlIHByb21pc2UgaXMgcmVzb2x2ZWQgd2l0aCBvbmx5IHRoZSBmaXJzdFxuICAgICAgICogICAgICAgIGFyZ3VtZW50IG9mIHRoZSBjYWxsYmFjaywgYWx0ZXJuYXRpdmVseSBhbiBhcnJheSBvZiBhbGwgdGhlXG4gICAgICAgKiAgICAgICAgY2FsbGJhY2sgYXJndW1lbnRzIGlzIHJlc29sdmVkLiBCeSBkZWZhdWx0LCBpZiB0aGUgY2FsbGJhY2tcbiAgICAgICAqICAgICAgICBmdW5jdGlvbiBpcyBpbnZva2VkIHdpdGggb25seSBhIHNpbmdsZSBhcmd1bWVudCwgdGhhdCB3aWxsIGJlXG4gICAgICAgKiAgICAgICAgcmVzb2x2ZWQgdG8gdGhlIHByb21pc2UsIHdoaWxlIGFsbCBhcmd1bWVudHMgd2lsbCBiZSByZXNvbHZlZCBhc1xuICAgICAgICogICAgICAgIGFuIGFycmF5IGlmIG11bHRpcGxlIGFyZSBnaXZlbi5cbiAgICAgICAqXG4gICAgICAgKiBAcmV0dXJucyB7ZnVuY3Rpb24ob2JqZWN0LCAuLi4qKX1cbiAgICAgICAqICAgICAgIFRoZSBnZW5lcmF0ZWQgd3JhcHBlciBmdW5jdGlvbi5cbiAgICAgICAqL1xuICAgICAgY29uc3Qgd3JhcEFzeW5jRnVuY3Rpb24gPSAobmFtZSwgbWV0YWRhdGEpID0+IHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGFzeW5jRnVuY3Rpb25XcmFwcGVyKHRhcmdldCwgLi4uYXJncykge1xuICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA8IG1ldGFkYXRhLm1pbkFyZ3MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYXQgbGVhc3QgJHttZXRhZGF0YS5taW5BcmdzfSAke3BsdXJhbGl6ZUFyZ3VtZW50cyhtZXRhZGF0YS5taW5BcmdzKX0gZm9yICR7bmFtZX0oKSwgZ290ICR7YXJncy5sZW5ndGh9YCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IG1ldGFkYXRhLm1heEFyZ3MpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgYXQgbW9zdCAke21ldGFkYXRhLm1heEFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1heEFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmIChtZXRhZGF0YS5mYWxsYmFja1RvTm9DYWxsYmFjaykge1xuICAgICAgICAgICAgICAvLyBUaGlzIEFQSSBtZXRob2QgaGFzIGN1cnJlbnRseSBubyBjYWxsYmFjayBvbiBDaHJvbWUsIGJ1dCBpdCByZXR1cm4gYSBwcm9taXNlIG9uIEZpcmVmb3gsXG4gICAgICAgICAgICAgIC8vIGFuZCBzbyB0aGUgcG9seWZpbGwgd2lsbCB0cnkgdG8gY2FsbCBpdCB3aXRoIGEgY2FsbGJhY2sgZmlyc3QsIGFuZCBpdCB3aWxsIGZhbGxiYWNrXG4gICAgICAgICAgICAgIC8vIHRvIG5vdCBwYXNzaW5nIHRoZSBjYWxsYmFjayBpZiB0aGUgZmlyc3QgY2FsbCBmYWlscy5cbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncywgbWFrZUNhbGxiYWNrKHtcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICAgICB9LCBtZXRhZGF0YSkpO1xuICAgICAgICAgICAgICB9IGNhdGNoIChjYkVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGAke25hbWV9IEFQSSBtZXRob2QgZG9lc24ndCBzZWVtIHRvIHN1cHBvcnQgdGhlIGNhbGxiYWNrIHBhcmFtZXRlciwgYCArIFwiZmFsbGluZyBiYWNrIHRvIGNhbGwgaXQgd2l0aG91dCBhIGNhbGxiYWNrOiBcIiwgY2JFcnJvcik7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdKC4uLmFyZ3MpO1xuXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBBUEkgbWV0aG9kIG1ldGFkYXRhLCBzbyB0aGF0IHRoZSBuZXh0IEFQSSBjYWxscyB3aWxsIG5vdCB0cnkgdG9cbiAgICAgICAgICAgICAgICAvLyB1c2UgdGhlIHVuc3VwcG9ydGVkIGNhbGxiYWNrIGFueW1vcmUuXG4gICAgICAgICAgICAgICAgbWV0YWRhdGEuZmFsbGJhY2tUb05vQ2FsbGJhY2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBtZXRhZGF0YS5ub0NhbGxiYWNrID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAobWV0YWRhdGEubm9DYWxsYmFjaykge1xuICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0oLi4uYXJncyk7XG4gICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRhcmdldFtuYW1lXSguLi5hcmdzLCBtYWtlQ2FsbGJhY2soe1xuICAgICAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICAgICAgcmVqZWN0XG4gICAgICAgICAgICAgIH0sIG1ldGFkYXRhKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICB9O1xuXG4gICAgICAvKipcbiAgICAgICAqIFdyYXBzIGFuIGV4aXN0aW5nIG1ldGhvZCBvZiB0aGUgdGFyZ2V0IG9iamVjdCwgc28gdGhhdCBjYWxscyB0byBpdCBhcmVcbiAgICAgICAqIGludGVyY2VwdGVkIGJ5IHRoZSBnaXZlbiB3cmFwcGVyIGZ1bmN0aW9uLiBUaGUgd3JhcHBlciBmdW5jdGlvbiByZWNlaXZlcyxcbiAgICAgICAqIGFzIGl0cyBmaXJzdCBhcmd1bWVudCwgdGhlIG9yaWdpbmFsIGB0YXJnZXRgIG9iamVjdCwgZm9sbG93ZWQgYnkgZWFjaCBvZlxuICAgICAgICogdGhlIGFyZ3VtZW50cyBwYXNzZWQgdG8gdGhlIG9yaWdpbmFsIG1ldGhvZC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gdGFyZ2V0XG4gICAgICAgKiAgICAgICAgVGhlIG9yaWdpbmFsIHRhcmdldCBvYmplY3QgdGhhdCB0aGUgd3JhcHBlZCBtZXRob2QgYmVsb25ncyB0by5cbiAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IG1ldGhvZFxuICAgICAgICogICAgICAgIFRoZSBtZXRob2QgYmVpbmcgd3JhcHBlZC4gVGhpcyBpcyB1c2VkIGFzIHRoZSB0YXJnZXQgb2YgdGhlIFByb3h5XG4gICAgICAgKiAgICAgICAgb2JqZWN0IHdoaWNoIGlzIGNyZWF0ZWQgdG8gd3JhcCB0aGUgbWV0aG9kLlxuICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gd3JhcHBlclxuICAgICAgICogICAgICAgIFRoZSB3cmFwcGVyIGZ1bmN0aW9uIHdoaWNoIGlzIGNhbGxlZCBpbiBwbGFjZSBvZiBhIGRpcmVjdCBpbnZvY2F0aW9uXG4gICAgICAgKiAgICAgICAgb2YgdGhlIHdyYXBwZWQgbWV0aG9kLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtQcm94eTxmdW5jdGlvbj59XG4gICAgICAgKiAgICAgICAgQSBQcm94eSBvYmplY3QgZm9yIHRoZSBnaXZlbiBtZXRob2QsIHdoaWNoIGludm9rZXMgdGhlIGdpdmVuIHdyYXBwZXJcbiAgICAgICAqICAgICAgICBtZXRob2QgaW4gaXRzIHBsYWNlLlxuICAgICAgICovXG4gICAgICBjb25zdCB3cmFwTWV0aG9kID0gKHRhcmdldCwgbWV0aG9kLCB3cmFwcGVyKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJveHkobWV0aG9kLCB7XG4gICAgICAgICAgYXBwbHkodGFyZ2V0TWV0aG9kLCB0aGlzT2JqLCBhcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gd3JhcHBlci5jYWxsKHRoaXNPYmosIHRhcmdldCwgLi4uYXJncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBsZXQgaGFzT3duUHJvcGVydHkgPSBGdW5jdGlvbi5jYWxsLmJpbmQoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSk7XG5cbiAgICAgIC8qKlxuICAgICAgICogV3JhcHMgYW4gb2JqZWN0IGluIGEgUHJveHkgd2hpY2ggaW50ZXJjZXB0cyBhbmQgd3JhcHMgY2VydGFpbiBtZXRob2RzXG4gICAgICAgKiBiYXNlZCBvbiB0aGUgZ2l2ZW4gYHdyYXBwZXJzYCBhbmQgYG1ldGFkYXRhYCBvYmplY3RzLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXJnZXRcbiAgICAgICAqICAgICAgICBUaGUgdGFyZ2V0IG9iamVjdCB0byB3cmFwLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBbd3JhcHBlcnMgPSB7fV1cbiAgICAgICAqICAgICAgICBBbiBvYmplY3QgdHJlZSBjb250YWluaW5nIHdyYXBwZXIgZnVuY3Rpb25zIGZvciBzcGVjaWFsIGNhc2VzLiBBbnlcbiAgICAgICAqICAgICAgICBmdW5jdGlvbiBwcmVzZW50IGluIHRoaXMgb2JqZWN0IHRyZWUgaXMgY2FsbGVkIGluIHBsYWNlIG9mIHRoZVxuICAgICAgICogICAgICAgIG1ldGhvZCBpbiB0aGUgc2FtZSBsb2NhdGlvbiBpbiB0aGUgYHRhcmdldGAgb2JqZWN0IHRyZWUuIFRoZXNlXG4gICAgICAgKiAgICAgICAgd3JhcHBlciBtZXRob2RzIGFyZSBpbnZva2VkIGFzIGRlc2NyaWJlZCBpbiB7QHNlZSB3cmFwTWV0aG9kfS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gW21ldGFkYXRhID0ge31dXG4gICAgICAgKiAgICAgICAgQW4gb2JqZWN0IHRyZWUgY29udGFpbmluZyBtZXRhZGF0YSB1c2VkIHRvIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVcbiAgICAgICAqICAgICAgICBQcm9taXNlLWJhc2VkIHdyYXBwZXIgZnVuY3Rpb25zIGZvciBhc3luY2hyb25vdXMuIEFueSBmdW5jdGlvbiBpblxuICAgICAgICogICAgICAgIHRoZSBgdGFyZ2V0YCBvYmplY3QgdHJlZSB3aGljaCBoYXMgYSBjb3JyZXNwb25kaW5nIG1ldGFkYXRhIG9iamVjdFxuICAgICAgICogICAgICAgIGluIHRoZSBzYW1lIGxvY2F0aW9uIGluIHRoZSBgbWV0YWRhdGFgIHRyZWUgaXMgcmVwbGFjZWQgd2l0aCBhblxuICAgICAgICogICAgICAgIGF1dG9tYXRpY2FsbHktZ2VuZXJhdGVkIHdyYXBwZXIgZnVuY3Rpb24sIGFzIGRlc2NyaWJlZCBpblxuICAgICAgICogICAgICAgIHtAc2VlIHdyYXBBc3luY0Z1bmN0aW9ufVxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtQcm94eTxvYmplY3Q+fVxuICAgICAgICovXG4gICAgICBjb25zdCB3cmFwT2JqZWN0ID0gKHRhcmdldCwgd3JhcHBlcnMgPSB7fSwgbWV0YWRhdGEgPSB7fSkgPT4ge1xuICAgICAgICBsZXQgY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBsZXQgaGFuZGxlcnMgPSB7XG4gICAgICAgICAgaGFzKHByb3h5VGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvcCBpbiB0YXJnZXQgfHwgcHJvcCBpbiBjYWNoZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldChwcm94eVRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wIGluIGNhY2hlKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYWNoZVtwcm9wXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghKHByb3AgaW4gdGFyZ2V0KSkge1xuICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IHZhbHVlID0gdGFyZ2V0W3Byb3BdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBtZXRob2Qgb24gdGhlIHVuZGVybHlpbmcgb2JqZWN0LiBDaGVjayBpZiB3ZSBuZWVkIHRvIGRvXG4gICAgICAgICAgICAgIC8vIGFueSB3cmFwcGluZy5cblxuICAgICAgICAgICAgICBpZiAodHlwZW9mIHdyYXBwZXJzW3Byb3BdID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIGEgc3BlY2lhbC1jYXNlIHdyYXBwZXIgZm9yIHRoaXMgbWV0aG9kLlxuICAgICAgICAgICAgICAgIHZhbHVlID0gd3JhcE1ldGhvZCh0YXJnZXQsIHRhcmdldFtwcm9wXSwgd3JhcHBlcnNbcHJvcF0pO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhhc093blByb3BlcnR5KG1ldGFkYXRhLCBwcm9wKSkge1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYW4gYXN5bmMgbWV0aG9kIHRoYXQgd2UgaGF2ZSBtZXRhZGF0YSBmb3IuIENyZWF0ZSBhXG4gICAgICAgICAgICAgICAgLy8gUHJvbWlzZSB3cmFwcGVyIGZvciBpdC5cbiAgICAgICAgICAgICAgICBsZXQgd3JhcHBlciA9IHdyYXBBc3luY0Z1bmN0aW9uKHByb3AsIG1ldGFkYXRhW3Byb3BdKTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHdyYXBNZXRob2QodGFyZ2V0LCB0YXJnZXRbcHJvcF0sIHdyYXBwZXIpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgaXMgYSBtZXRob2QgdGhhdCB3ZSBkb24ndCBrbm93IG9yIGNhcmUgYWJvdXQuIFJldHVybiB0aGVcbiAgICAgICAgICAgICAgICAvLyBvcmlnaW5hbCBtZXRob2QsIGJvdW5kIHRvIHRoZSB1bmRlcmx5aW5nIG9iamVjdC5cbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLmJpbmQodGFyZ2V0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiYgdmFsdWUgIT09IG51bGwgJiYgKGhhc093blByb3BlcnR5KHdyYXBwZXJzLCBwcm9wKSB8fCBoYXNPd25Qcm9wZXJ0eShtZXRhZGF0YSwgcHJvcCkpKSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgaXMgYW4gb2JqZWN0IHRoYXQgd2UgbmVlZCB0byBkbyBzb21lIHdyYXBwaW5nIGZvciB0aGUgY2hpbGRyZW5cbiAgICAgICAgICAgICAgLy8gb2YuIENyZWF0ZSBhIHN1Yi1vYmplY3Qgd3JhcHBlciBmb3IgaXQgd2l0aCB0aGUgYXBwcm9wcmlhdGUgY2hpbGRcbiAgICAgICAgICAgICAgLy8gbWV0YWRhdGEuXG4gICAgICAgICAgICAgIHZhbHVlID0gd3JhcE9iamVjdCh2YWx1ZSwgd3JhcHBlcnNbcHJvcF0sIG1ldGFkYXRhW3Byb3BdKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzT3duUHJvcGVydHkobWV0YWRhdGEsIFwiKlwiKSkge1xuICAgICAgICAgICAgICAvLyBXcmFwIGFsbCBwcm9wZXJ0aWVzIGluICogbmFtZXNwYWNlLlxuICAgICAgICAgICAgICB2YWx1ZSA9IHdyYXBPYmplY3QodmFsdWUsIHdyYXBwZXJzW3Byb3BdLCBtZXRhZGF0YVtcIipcIl0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gV2UgZG9uJ3QgbmVlZCB0byBkbyBhbnkgd3JhcHBpbmcgZm9yIHRoaXMgcHJvcGVydHksXG4gICAgICAgICAgICAgIC8vIHNvIGp1c3QgZm9yd2FyZCBhbGwgYWNjZXNzIHRvIHRoZSB1bmRlcmx5aW5nIG9iamVjdC5cbiAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNhY2hlLCBwcm9wLCB7XG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wXTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FjaGVbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldChwcm94eVRhcmdldCwgcHJvcCwgdmFsdWUsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgICBpZiAocHJvcCBpbiBjYWNoZSkge1xuICAgICAgICAgICAgICBjYWNoZVtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIGRlZmluZVByb3BlcnR5KHByb3h5VGFyZ2V0LCBwcm9wLCBkZXNjKSB7XG4gICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eShjYWNoZSwgcHJvcCwgZGVzYyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBkZWxldGVQcm9wZXJ0eShwcm94eVRhcmdldCwgcHJvcCkge1xuICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkoY2FjaGUsIHByb3ApO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBQZXIgY29udHJhY3Qgb2YgdGhlIFByb3h5IEFQSSwgdGhlIFwiZ2V0XCIgcHJveHkgaGFuZGxlciBtdXN0IHJldHVybiB0aGVcbiAgICAgICAgLy8gb3JpZ2luYWwgdmFsdWUgb2YgdGhlIHRhcmdldCBpZiB0aGF0IHZhbHVlIGlzIGRlY2xhcmVkIHJlYWQtb25seSBhbmRcbiAgICAgICAgLy8gbm9uLWNvbmZpZ3VyYWJsZS4gRm9yIHRoaXMgcmVhc29uLCB3ZSBjcmVhdGUgYW4gb2JqZWN0IHdpdGggdGhlXG4gICAgICAgIC8vIHByb3RvdHlwZSBzZXQgdG8gYHRhcmdldGAgaW5zdGVhZCBvZiB1c2luZyBgdGFyZ2V0YCBkaXJlY3RseS5cbiAgICAgICAgLy8gT3RoZXJ3aXNlIHdlIGNhbm5vdCByZXR1cm4gYSBjdXN0b20gb2JqZWN0IGZvciBBUElzIHRoYXRcbiAgICAgICAgLy8gYXJlIGRlY2xhcmVkIHJlYWQtb25seSBhbmQgbm9uLWNvbmZpZ3VyYWJsZSwgc3VjaCBhcyBgY2hyb21lLmRldnRvb2xzYC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gVGhlIHByb3h5IGhhbmRsZXJzIHRoZW1zZWx2ZXMgd2lsbCBzdGlsbCB1c2UgdGhlIG9yaWdpbmFsIGB0YXJnZXRgXG4gICAgICAgIC8vIGluc3RlYWQgb2YgdGhlIGBwcm94eVRhcmdldGAsIHNvIHRoYXQgdGhlIG1ldGhvZHMgYW5kIHByb3BlcnRpZXMgYXJlXG4gICAgICAgIC8vIGRlcmVmZXJlbmNlZCB2aWEgdGhlIG9yaWdpbmFsIHRhcmdldHMuXG4gICAgICAgIGxldCBwcm94eVRhcmdldCA9IE9iamVjdC5jcmVhdGUodGFyZ2V0KTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eShwcm94eVRhcmdldCwgaGFuZGxlcnMpO1xuICAgICAgfTtcblxuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIGEgc2V0IG9mIHdyYXBwZXIgZnVuY3Rpb25zIGZvciBhbiBldmVudCBvYmplY3QsIHdoaWNoIGhhbmRsZXNcbiAgICAgICAqIHdyYXBwaW5nIG9mIGxpc3RlbmVyIGZ1bmN0aW9ucyB0aGF0IHRob3NlIG1lc3NhZ2VzIGFyZSBwYXNzZWQuXG4gICAgICAgKlxuICAgICAgICogQSBzaW5nbGUgd3JhcHBlciBpcyBjcmVhdGVkIGZvciBlYWNoIGxpc3RlbmVyIGZ1bmN0aW9uLCBhbmQgc3RvcmVkIGluIGFcbiAgICAgICAqIG1hcC4gU3Vic2VxdWVudCBjYWxscyB0byBgYWRkTGlzdGVuZXJgLCBgaGFzTGlzdGVuZXJgLCBvciBgcmVtb3ZlTGlzdGVuZXJgXG4gICAgICAgKiByZXRyaWV2ZSB0aGUgb3JpZ2luYWwgd3JhcHBlciwgc28gdGhhdCAgYXR0ZW1wdHMgdG8gcmVtb3ZlIGFcbiAgICAgICAqIHByZXZpb3VzbHktYWRkZWQgbGlzdGVuZXIgd29yayBhcyBleHBlY3RlZC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge0RlZmF1bHRXZWFrTWFwPGZ1bmN0aW9uLCBmdW5jdGlvbj59IHdyYXBwZXJNYXBcbiAgICAgICAqICAgICAgICBBIERlZmF1bHRXZWFrTWFwIG9iamVjdCB3aGljaCB3aWxsIGNyZWF0ZSB0aGUgYXBwcm9wcmlhdGUgd3JhcHBlclxuICAgICAgICogICAgICAgIGZvciBhIGdpdmVuIGxpc3RlbmVyIGZ1bmN0aW9uIHdoZW4gb25lIGRvZXMgbm90IGV4aXN0LCBhbmQgcmV0cmlldmVcbiAgICAgICAqICAgICAgICBhbiBleGlzdGluZyBvbmUgd2hlbiBpdCBkb2VzLlxuICAgICAgICpcbiAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9XG4gICAgICAgKi9cbiAgICAgIGNvbnN0IHdyYXBFdmVudCA9IHdyYXBwZXJNYXAgPT4gKHtcbiAgICAgICAgYWRkTGlzdGVuZXIodGFyZ2V0LCBsaXN0ZW5lciwgLi4uYXJncykge1xuICAgICAgICAgIHRhcmdldC5hZGRMaXN0ZW5lcih3cmFwcGVyTWFwLmdldChsaXN0ZW5lciksIC4uLmFyZ3MpO1xuICAgICAgICB9LFxuICAgICAgICBoYXNMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyKSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldC5oYXNMaXN0ZW5lcih3cmFwcGVyTWFwLmdldChsaXN0ZW5lcikpO1xuICAgICAgICB9LFxuICAgICAgICByZW1vdmVMaXN0ZW5lcih0YXJnZXQsIGxpc3RlbmVyKSB7XG4gICAgICAgICAgdGFyZ2V0LnJlbW92ZUxpc3RlbmVyKHdyYXBwZXJNYXAuZ2V0KGxpc3RlbmVyKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3Qgb25SZXF1ZXN0RmluaXNoZWRXcmFwcGVycyA9IG5ldyBEZWZhdWx0V2Vha01hcChsaXN0ZW5lciA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBXcmFwcyBhbiBvblJlcXVlc3RGaW5pc2hlZCBsaXN0ZW5lciBmdW5jdGlvbiBzbyB0aGF0IGl0IHdpbGwgcmV0dXJuIGFcbiAgICAgICAgICogYGdldENvbnRlbnQoKWAgcHJvcGVydHkgd2hpY2ggcmV0dXJucyBhIGBQcm9taXNlYCByYXRoZXIgdGhhbiB1c2luZyBhXG4gICAgICAgICAqIGNhbGxiYWNrIEFQSS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHJlcVxuICAgICAgICAgKiAgICAgICAgVGhlIEhBUiBlbnRyeSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBuZXR3b3JrIHJlcXVlc3QuXG4gICAgICAgICAqL1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gb25SZXF1ZXN0RmluaXNoZWQocmVxKSB7XG4gICAgICAgICAgY29uc3Qgd3JhcHBlZFJlcSA9IHdyYXBPYmplY3QocmVxLCB7fSAvKiB3cmFwcGVycyAqLywge1xuICAgICAgICAgICAgZ2V0Q29udGVudDoge1xuICAgICAgICAgICAgICBtaW5BcmdzOiAwLFxuICAgICAgICAgICAgICBtYXhBcmdzOiAwXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGlzdGVuZXIod3JhcHBlZFJlcSk7XG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IG9uTWVzc2FnZVdyYXBwZXJzID0gbmV3IERlZmF1bHRXZWFrTWFwKGxpc3RlbmVyID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdyYXBzIGEgbWVzc2FnZSBsaXN0ZW5lciBmdW5jdGlvbiBzbyB0aGF0IGl0IG1heSBzZW5kIHJlc3BvbnNlcyBiYXNlZCBvblxuICAgICAgICAgKiBpdHMgcmV0dXJuIHZhbHVlLCByYXRoZXIgdGhhbiBieSByZXR1cm5pbmcgYSBzZW50aW5lbCB2YWx1ZSBhbmQgY2FsbGluZyBhXG4gICAgICAgICAqIGNhbGxiYWNrLiBJZiB0aGUgbGlzdGVuZXIgZnVuY3Rpb24gcmV0dXJucyBhIFByb21pc2UsIHRoZSByZXNwb25zZSBpc1xuICAgICAgICAgKiBzZW50IHdoZW4gdGhlIHByb21pc2UgZWl0aGVyIHJlc29sdmVzIG9yIHJlamVjdHMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7Kn0gbWVzc2FnZVxuICAgICAgICAgKiAgICAgICAgVGhlIG1lc3NhZ2Ugc2VudCBieSB0aGUgb3RoZXIgZW5kIG9mIHRoZSBjaGFubmVsLlxuICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gc2VuZGVyXG4gICAgICAgICAqICAgICAgICBEZXRhaWxzIGFib3V0IHRoZSBzZW5kZXIgb2YgdGhlIG1lc3NhZ2UuXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oKil9IHNlbmRSZXNwb25zZVxuICAgICAgICAgKiAgICAgICAgQSBjYWxsYmFjayB3aGljaCwgd2hlbiBjYWxsZWQgd2l0aCBhbiBhcmJpdHJhcnkgYXJndW1lbnQsIHNlbmRzXG4gICAgICAgICAqICAgICAgICB0aGF0IHZhbHVlIGFzIGEgcmVzcG9uc2UuXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAgICAgKiAgICAgICAgVHJ1ZSBpZiB0aGUgd3JhcHBlZCBsaXN0ZW5lciByZXR1cm5lZCBhIFByb21pc2UsIHdoaWNoIHdpbGwgbGF0ZXJcbiAgICAgICAgICogICAgICAgIHlpZWxkIGEgcmVzcG9uc2UuIEZhbHNlIG90aGVyd2lzZS5cbiAgICAgICAgICovXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBvbk1lc3NhZ2UobWVzc2FnZSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpIHtcbiAgICAgICAgICBsZXQgZGlkQ2FsbFNlbmRSZXNwb25zZSA9IGZhbHNlO1xuICAgICAgICAgIGxldCB3cmFwcGVkU2VuZFJlc3BvbnNlO1xuICAgICAgICAgIGxldCBzZW5kUmVzcG9uc2VQcm9taXNlID0gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICAgICAgICB3cmFwcGVkU2VuZFJlc3BvbnNlID0gZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgIGRpZENhbGxTZW5kUmVzcG9uc2UgPSB0cnVlO1xuICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzdWx0ID0gbGlzdGVuZXIobWVzc2FnZSwgc2VuZGVyLCB3cmFwcGVkU2VuZFJlc3BvbnNlKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IFByb21pc2UucmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGlzUmVzdWx0VGhlbmFibGUgPSByZXN1bHQgIT09IHRydWUgJiYgaXNUaGVuYWJsZShyZXN1bHQpO1xuXG4gICAgICAgICAgLy8gSWYgdGhlIGxpc3RlbmVyIGRpZG4ndCByZXR1cm5lZCB0cnVlIG9yIGEgUHJvbWlzZSwgb3IgY2FsbGVkXG4gICAgICAgICAgLy8gd3JhcHBlZFNlbmRSZXNwb25zZSBzeW5jaHJvbm91c2x5LCB3ZSBjYW4gZXhpdCBlYXJsaWVyXG4gICAgICAgICAgLy8gYmVjYXVzZSB0aGVyZSB3aWxsIGJlIG5vIHJlc3BvbnNlIHNlbnQgZnJvbSB0aGlzIGxpc3RlbmVyLlxuICAgICAgICAgIGlmIChyZXN1bHQgIT09IHRydWUgJiYgIWlzUmVzdWx0VGhlbmFibGUgJiYgIWRpZENhbGxTZW5kUmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBIHNtYWxsIGhlbHBlciB0byBzZW5kIHRoZSBtZXNzYWdlIGlmIHRoZSBwcm9taXNlIHJlc29sdmVzXG4gICAgICAgICAgLy8gYW5kIGFuIGVycm9yIGlmIHRoZSBwcm9taXNlIHJlamVjdHMgKGEgd3JhcHBlZCBzZW5kTWVzc2FnZSBoYXNcbiAgICAgICAgICAvLyB0byB0cmFuc2xhdGUgdGhlIG1lc3NhZ2UgaW50byBhIHJlc29sdmVkIHByb21pc2Ugb3IgYSByZWplY3RlZFxuICAgICAgICAgIC8vIHByb21pc2UpLlxuICAgICAgICAgIGNvbnN0IHNlbmRQcm9taXNlZFJlc3VsdCA9IHByb21pc2UgPT4ge1xuICAgICAgICAgICAgcHJvbWlzZS50aGVuKG1zZyA9PiB7XG4gICAgICAgICAgICAgIC8vIHNlbmQgdGhlIG1lc3NhZ2UgdmFsdWUuXG4gICAgICAgICAgICAgIHNlbmRSZXNwb25zZShtc2cpO1xuICAgICAgICAgICAgfSwgZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAvLyBTZW5kIGEgSlNPTiByZXByZXNlbnRhdGlvbiBvZiB0aGUgZXJyb3IgaWYgdGhlIHJlamVjdGVkIHZhbHVlXG4gICAgICAgICAgICAgIC8vIGlzIGFuIGluc3RhbmNlIG9mIGVycm9yLCBvciB0aGUgb2JqZWN0IGl0c2VsZiBvdGhlcndpc2UuXG4gICAgICAgICAgICAgIGxldCBtZXNzYWdlO1xuICAgICAgICAgICAgICBpZiAoZXJyb3IgJiYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgfHwgdHlwZW9mIGVycm9yLm1lc3NhZ2UgPT09IFwic3RyaW5nXCIpKSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IGVycm9yLm1lc3NhZ2U7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZSA9IFwiQW4gdW5leHBlY3RlZCBlcnJvciBvY2N1cnJlZFwiO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHNlbmRSZXNwb25zZSh7XG4gICAgICAgICAgICAgICAgX19tb3pXZWJFeHRlbnNpb25Qb2x5ZmlsbFJlamVjdF9fOiB0cnVlLFxuICAgICAgICAgICAgICAgIG1lc3NhZ2VcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAvLyBQcmludCBhbiBlcnJvciBvbiB0aGUgY29uc29sZSBpZiB1bmFibGUgdG8gc2VuZCB0aGUgcmVzcG9uc2UuXG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJGYWlsZWQgdG8gc2VuZCBvbk1lc3NhZ2UgcmVqZWN0ZWQgcmVwbHlcIiwgZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgcmV0dXJuZWQgYSBQcm9taXNlLCBzZW5kIHRoZSByZXNvbHZlZCB2YWx1ZSBhcyBhXG4gICAgICAgICAgLy8gcmVzdWx0LCBvdGhlcndpc2Ugd2FpdCB0aGUgcHJvbWlzZSByZWxhdGVkIHRvIHRoZSB3cmFwcGVkU2VuZFJlc3BvbnNlXG4gICAgICAgICAgLy8gY2FsbGJhY2sgdG8gcmVzb2x2ZSBhbmQgc2VuZCBpdCBhcyBhIHJlc3BvbnNlLlxuICAgICAgICAgIGlmIChpc1Jlc3VsdFRoZW5hYmxlKSB7XG4gICAgICAgICAgICBzZW5kUHJvbWlzZWRSZXN1bHQocmVzdWx0KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VuZFByb21pc2VkUmVzdWx0KHNlbmRSZXNwb25zZVByb21pc2UpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIExldCBDaHJvbWUga25vdyB0aGF0IHRoZSBsaXN0ZW5lciBpcyByZXBseWluZy5cbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgd3JhcHBlZFNlbmRNZXNzYWdlQ2FsbGJhY2sgPSAoe1xuICAgICAgICByZWplY3QsXG4gICAgICAgIHJlc29sdmVcbiAgICAgIH0sIHJlcGx5KSA9PiB7XG4gICAgICAgIGlmIChleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yKSB7XG4gICAgICAgICAgLy8gRGV0ZWN0IHdoZW4gbm9uZSBvZiB0aGUgbGlzdGVuZXJzIHJlcGxpZWQgdG8gdGhlIHNlbmRNZXNzYWdlIGNhbGwgYW5kIHJlc29sdmVcbiAgICAgICAgICAvLyB0aGUgcHJvbWlzZSB0byB1bmRlZmluZWQgYXMgaW4gRmlyZWZveC5cbiAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21vemlsbGEvd2ViZXh0ZW5zaW9uLXBvbHlmaWxsL2lzc3Vlcy8xMzBcbiAgICAgICAgICBpZiAoZXh0ZW5zaW9uQVBJcy5ydW50aW1lLmxhc3RFcnJvci5tZXNzYWdlID09PSBDSFJPTUVfU0VORF9NRVNTQUdFX0NBTExCQUNLX05PX1JFU1BPTlNFX01FU1NBR0UpIHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihleHRlbnNpb25BUElzLnJ1bnRpbWUubGFzdEVycm9yLm1lc3NhZ2UpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocmVwbHkgJiYgcmVwbHkuX19tb3pXZWJFeHRlbnNpb25Qb2x5ZmlsbFJlamVjdF9fKSB7XG4gICAgICAgICAgLy8gQ29udmVydCBiYWNrIHRoZSBKU09OIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBlcnJvciBpbnRvXG4gICAgICAgICAgLy8gYW4gRXJyb3IgaW5zdGFuY2UuXG4gICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihyZXBseS5tZXNzYWdlKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzb2x2ZShyZXBseSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBjb25zdCB3cmFwcGVkU2VuZE1lc3NhZ2UgPSAobmFtZSwgbWV0YWRhdGEsIGFwaU5hbWVzcGFjZU9iaiwgLi4uYXJncykgPT4ge1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPCBtZXRhZGF0YS5taW5BcmdzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBsZWFzdCAke21ldGFkYXRhLm1pbkFyZ3N9ICR7cGx1cmFsaXplQXJndW1lbnRzKG1ldGFkYXRhLm1pbkFyZ3MpfSBmb3IgJHtuYW1lfSgpLCBnb3QgJHthcmdzLmxlbmd0aH1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYXJncy5sZW5ndGggPiBtZXRhZGF0YS5tYXhBcmdzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBhdCBtb3N0ICR7bWV0YWRhdGEubWF4QXJnc30gJHtwbHVyYWxpemVBcmd1bWVudHMobWV0YWRhdGEubWF4QXJncyl9IGZvciAke25hbWV9KCksIGdvdCAke2FyZ3MubGVuZ3RofWApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgY29uc3Qgd3JhcHBlZENiID0gd3JhcHBlZFNlbmRNZXNzYWdlQ2FsbGJhY2suYmluZChudWxsLCB7XG4gICAgICAgICAgICByZXNvbHZlLFxuICAgICAgICAgICAgcmVqZWN0XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYXJncy5wdXNoKHdyYXBwZWRDYik7XG4gICAgICAgICAgYXBpTmFtZXNwYWNlT2JqLnNlbmRNZXNzYWdlKC4uLmFyZ3MpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgICBjb25zdCBzdGF0aWNXcmFwcGVycyA9IHtcbiAgICAgICAgZGV2dG9vbHM6IHtcbiAgICAgICAgICBuZXR3b3JrOiB7XG4gICAgICAgICAgICBvblJlcXVlc3RGaW5pc2hlZDogd3JhcEV2ZW50KG9uUmVxdWVzdEZpbmlzaGVkV3JhcHBlcnMpXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBydW50aW1lOiB7XG4gICAgICAgICAgb25NZXNzYWdlOiB3cmFwRXZlbnQob25NZXNzYWdlV3JhcHBlcnMpLFxuICAgICAgICAgIG9uTWVzc2FnZUV4dGVybmFsOiB3cmFwRXZlbnQob25NZXNzYWdlV3JhcHBlcnMpLFxuICAgICAgICAgIHNlbmRNZXNzYWdlOiB3cmFwcGVkU2VuZE1lc3NhZ2UuYmluZChudWxsLCBcInNlbmRNZXNzYWdlXCIsIHtcbiAgICAgICAgICAgIG1pbkFyZ3M6IDEsXG4gICAgICAgICAgICBtYXhBcmdzOiAzXG4gICAgICAgICAgfSlcbiAgICAgICAgfSxcbiAgICAgICAgdGFiczoge1xuICAgICAgICAgIHNlbmRNZXNzYWdlOiB3cmFwcGVkU2VuZE1lc3NhZ2UuYmluZChudWxsLCBcInNlbmRNZXNzYWdlXCIsIHtcbiAgICAgICAgICAgIG1pbkFyZ3M6IDIsXG4gICAgICAgICAgICBtYXhBcmdzOiAzXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IHNldHRpbmdNZXRhZGF0YSA9IHtcbiAgICAgICAgY2xlYXI6IHtcbiAgICAgICAgICBtaW5BcmdzOiAxLFxuICAgICAgICAgIG1heEFyZ3M6IDFcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0OiB7XG4gICAgICAgICAgbWluQXJnczogMSxcbiAgICAgICAgICBtYXhBcmdzOiAxXG4gICAgICAgIH0sXG4gICAgICAgIHNldDoge1xuICAgICAgICAgIG1pbkFyZ3M6IDEsXG4gICAgICAgICAgbWF4QXJnczogMVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgYXBpTWV0YWRhdGEucHJpdmFjeSA9IHtcbiAgICAgICAgbmV0d29yazoge1xuICAgICAgICAgIFwiKlwiOiBzZXR0aW5nTWV0YWRhdGFcbiAgICAgICAgfSxcbiAgICAgICAgc2VydmljZXM6IHtcbiAgICAgICAgICBcIipcIjogc2V0dGluZ01ldGFkYXRhXG4gICAgICAgIH0sXG4gICAgICAgIHdlYnNpdGVzOiB7XG4gICAgICAgICAgXCIqXCI6IHNldHRpbmdNZXRhZGF0YVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgcmV0dXJuIHdyYXBPYmplY3QoZXh0ZW5zaW9uQVBJcywgc3RhdGljV3JhcHBlcnMsIGFwaU1ldGFkYXRhKTtcbiAgICB9O1xuXG4gICAgLy8gVGhlIGJ1aWxkIHByb2Nlc3MgYWRkcyBhIFVNRCB3cmFwcGVyIGFyb3VuZCB0aGlzIGZpbGUsIHdoaWNoIG1ha2VzIHRoZVxuICAgIC8vIGBtb2R1bGVgIHZhcmlhYmxlIGF2YWlsYWJsZS5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHdyYXBBUElzKGNocm9tZSk7XG4gIH0gZWxzZSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBnbG9iYWxUaGlzLmJyb3dzZXI7XG4gIH1cbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnJvd3Nlci1wb2x5ZmlsbC5qcy5tYXBcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbmNvbnN0IF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0Y29uc3QgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdGNvbnN0IG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0aWYgKCEobW9kdWxlSWQgaW4gX193ZWJwYWNrX21vZHVsZXNfXykpIHtcblx0XHRkZWxldGUgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0XHRjb25zdCBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIG1vZHVsZUlkICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0Y29uc3QgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIvdmFsdWUgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGlmKEFycmF5LmlzQXJyYXkoZGVmaW5pdGlvbikpIHtcblx0XHR2YXIgaSA9IDA7XG5cdFx0d2hpbGUoaSA8IGRlZmluaXRpb24ubGVuZ3RoKSB7XG5cdFx0XHR2YXIga2V5ID0gZGVmaW5pdGlvbltpKytdO1xuXHRcdFx0dmFyIGJpbmRpbmcgPSBkZWZpbml0aW9uW2krK107XG5cdFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdFx0aWYoYmluZGluZyA9PT0gMCkge1xuXHRcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IGRlZmluaXRpb25baSsrXSB9KTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogYmluZGluZyB9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmKGJpbmRpbmcgPT09IDApIHsgaSsrOyB9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYoU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwid2ViZXh0ZW5zaW9uLXBvbHlmaWxsXCI7XG5cbmltcG9ydCB7IExvZ2dlciB9IGZyb20gXCJAZXh0ZW5zaW9uLXNjcmlwdHMvbG9nZ2VyL2xvZ2dlci5jbGFzc1wiO1xuaW1wb3J0IHsgQnJvd3NlckFwaVV0aWwgfSBmcm9tIFwiLi9zZXJ2aWNlcy9icm93c2VyLWFwaS11dGlsXCI7XG5pbXBvcnQgeyBNZXNzYWdlSGFuZGxlciB9IGZyb20gXCIuL3NlcnZpY2VzL21lc3NhZ2UtaGFuZGxlclwiO1xuaW1wb3J0IHsgRGFwcEhhbmRsZXIgfSBmcm9tIFwiLi9zZXJ2aWNlcy9kYXBwLWhhbmRsZXJcIjtcbmltcG9ydCB7IEV4dGVuc2lvbkxpZmVjeWNsZSB9IGZyb20gXCIuL3NlcnZpY2VzL2V4dGVuc2lvbi1saWZlY3ljbGVcIjtcblxuY29uc3QgYnJvd3NlckFwaSA9IG5ldyBCcm93c2VyQXBpVXRpbCgpO1xuXG5jb25zdCBleHRlbnNpb25MaWZlY3ljbGUgPSBuZXcgRXh0ZW5zaW9uTGlmZWN5Y2xlKGJyb3dzZXJBcGkpO1xuXG5leHRlbnNpb25MaWZlY3ljbGUuaW5pdGlhbGl6ZSgpO1xuXG5jb25zdCBtZXNzYWdlSGFuZGxlciA9IE1lc3NhZ2VIYW5kbGVyLmdldEluc3RhbmNlKGJyb3dzZXJBcGkpO1xuY29uc3QgZGFwcEhhbmRsZXIgPSBEYXBwSGFuZGxlci5nZXRJbnN0YW5jZShicm93c2VyQXBpKTtcbnZvaWQgZGFwcEhhbmRsZXIucmVzdG9yZVBlbmRpbmdSZXF1ZXN0cygpO1xuXG5pZiAoIWJyb3dzZXJBcGkuaGFzKFwicnVudGltZVwiKSkge1xuICAgIExvZ2dlci5lcnJvcihcIlJ1bnRpbWUgQVBJIG5vdCBhdmFpbGFibGUgLSBleHRlbnNpb24gY2Fubm90IGZ1bmN0aW9uXCIpO1xuXG4gICAgdGhyb3cgbmV3IEVycm9yKFwiUnVudGltZSBBUEkgbm90IGF2YWlsYWJsZVwiKTtcbn1cblxuYnJvd3NlckFwaS5hZGRNZXNzYWdlTGlzdGVuZXIoKG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gICAgaWYgKG1lc3NhZ2UudHlwZSAmJiBtZXNzYWdlLnR5cGUuc3RhcnRzV2l0aChcIkRBUFBfXCIpKSB7XG4gICAgICAgIGRhcHBIYW5kbGVyLmhhbmRsZURhcHBNZXNzYWdlKG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2UudHlwZSAmJiBtZXNzYWdlLnR5cGUuc3RhcnRzV2l0aChcIldDX1wiKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbWVzc2FnZUhhbmRsZXIuaGFuZGxlQXV0b2ZpbGxNZXNzYWdlKG1lc3NhZ2UsIHNlbmRlciwgc2VuZFJlc3BvbnNlKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9