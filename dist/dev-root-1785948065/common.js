"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["common"],{

/***/ 40693
/*!********************************************************!*\
  !*** ./src/app/core/utils/same-wallet-address.util.ts ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   areSendAddressesSame: () => (/* binding */ areSendAddressesSame)
/* harmony export */ });
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ethers */ 997);
/* harmony import */ var _polkadot_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @polkadot/util */ 92038);
/* harmony import */ var _polkadot_util_crypto__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @polkadot/util-crypto */ 52390);



/**
 * Normalize an address for case-insensitive equality where appropriate
 * (EVM checksum casing). Returns a comparable string for any chain.
 *
 * Out of scope: Bitcoin script-equivalent encodings (legacy vs SegWit).
 */
function normalizeAddressForChain(address, isEVM) {
  const trimmed = (address || "").trim();
  if (!trimmed) return "";
  if (isEVM) {
    try {
      // Lowercase first: ethers v6 rejects wrong EIP-55 casing; we only need a canonical form for equality.
      return ethers__WEBPACK_IMPORTED_MODULE_0__.getAddress(trimmed.toLowerCase());
    } catch {
      return trimmed.toLowerCase();
    }
  }
  return trimmed;
}
/**
 * True when the sender and receiver resolve to the same on-chain address for
 * the network described by `transactionData`. Empty inputs are treated as
 * "not the same" so callers don't have to short-circuit.
 */
function areSendAddressesSame(senderAddress, receiverAddress, transactionData) {
  if (!senderAddress || !receiverAddress) return false;
  const isEVM = !!(transactionData.isEthToken || transactionData.isPolToken || transactionData.isBscToken || transactionData.isAvaxToken || transactionData.isBDAGToken);
  const sender = normalizeAddressForChain(senderAddress, isEVM);
  const receiver = normalizeAddressForChain(receiverAddress, isEVM);
  if (!sender || !receiver) return false;
  if (transactionData.isDotToken || transactionData.isKsmToken) {
    try {
      return (0,_polkadot_util__WEBPACK_IMPORTED_MODULE_1__.u8aEq)((0,_polkadot_util_crypto__WEBPACK_IMPORTED_MODULE_2__.decodeAddress)(sender), (0,_polkadot_util_crypto__WEBPACK_IMPORTED_MODULE_2__.decodeAddress)(receiver));
    } catch {
      return false;
    }
  }
  return sender === receiver;
}

/***/ },

/***/ 61112
/*!**********************************************************!*\
  !*** ./src/app/services/blockdag-manual-nfts.service.ts ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BlockdagManualNftsService: () => (/* binding */ BlockdagManualNftsService)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var app_chrome_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/chrome.service */ 85043);



const STORAGE_KEY = "blockdagManualNftImports";
class BlockdagManualNftsService {
  _chrome;
  constructor(_chrome) {
    this._chrome = _chrome;
  }
  list() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const raw = yield _this._chrome.getItem(STORAGE_KEY);
      if (raw == null || raw === "") return [];
      if (Array.isArray(raw)) {
        return raw.map(x => ({
          contract: String(x.contract).toLowerCase(),
          tokenId: String(x.tokenId)
        }));
      }
      try {
        const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
        return Array.isArray(parsed) ? parsed.map(x => ({
          contract: String(x.contract).toLowerCase(),
          tokenId: String(x.tokenId)
        })) : [];
      } catch {
        return [];
      }
    })();
  }
  add(contract, tokenId) {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const c = contract.trim().toLowerCase();
      const t = tokenId.trim();
      const list = yield _this2.list();
      if (list.some(x => x.contract === c && x.tokenId === t)) return;
      list.push({
        contract: c,
        tokenId: t
      });
      yield _this2._chrome.setItem(STORAGE_KEY, list);
    })();
  }
  remove(contract, tokenId) {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const c = contract.trim().toLowerCase();
      const t = tokenId.trim();
      const list = (yield _this3.list()).filter(x => !(x.contract === c && x.tokenId === t));
      yield _this3._chrome.setItem(STORAGE_KEY, list);
    })();
  }
  has(contract, tokenId) {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const c = contract.trim().toLowerCase();
      const t = tokenId.trim();
      return (yield _this4.list()).some(x => x.contract === c && x.tokenId === t);
    })();
  }
  static ɵfac = function BlockdagManualNftsService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || BlockdagManualNftsService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](app_chrome_service__WEBPACK_IMPORTED_MODULE_2__.ChromeService));
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: BlockdagManualNftsService,
    factory: BlockdagManualNftsService.ɵfac,
    providedIn: "root"
  });
}

/***/ },

/***/ 1156
/*!**************************************************!*\
  !*** ./src/app/services/blockdag-nft.service.ts ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BLOCKDAG_NFT_APP_ORIGIN: () => (/* binding */ BLOCKDAG_NFT_APP_ORIGIN),
/* harmony export */   BlockdagNftService: () => (/* binding */ BlockdagNftService),
/* harmony export */   formatNftItem: () => (/* binding */ formatNftItem),
/* harmony export */   parseNftImageUrl: () => (/* binding */ parseNftImageUrl)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 63855);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var app_services_auth_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/services/auth.service */ 44796);







/** Public BlockDAG NFT marketplace (Next.js) — asset detail routes. */
const BLOCKDAG_NFT_APP_ORIGIN = "https://blockdag.zelf.world";
function parseNftImageUrl(url) {
  if (!url) return "";
  const u = url.trim();
  if (u.startsWith("ipfs://")) return `https://ipfs.io/ipfs/${u.replace("ipfs://", "")}`;
  return u;
}
function formatNftItem(n, idx) {
  return {
    contractAddress: n.collection || n.collectionAddress || "unknown",
    collectionAddress: n.collection || n.collectionAddress || "unknown",
    tokenId: n.tokenId != null ? String(n.tokenId) : "",
    ipfsId: n.ipfsId,
    cid: n.cid,
    collectionName: n.collectionName || n.name || "BlockDAG NFT",
    name: n.name || `NFT #${idx + 1}`,
    description: n.description ?? "",
    image: parseNftImageUrl(n.image ?? ""),
    category: n.nftCategory || n.category || "Art",
    owner: n.owner ?? "",
    traits: [],
    attributes: n.attributes ?? [],
    metadataURI: n.metadataURI ?? "",
    isListed: false,
    price: undefined,
    createdAt: new Date().toISOString()
  };
}
class BlockdagNftService {
  _http;
  _authService;
  constructor(_http, _authService) {
    this._http = _http;
    this._authService = _authService;
  }
  _headers() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      let headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpHeaders({
        "Content-Type": "application/json"
      });
      try {
        const token = yield _this._authService.checkAccessToken();
        if (token) {
          headers = headers.set("Authorization", `Bearer ${token}`);
        }
      } catch {
        /* optional */
      }
      return headers;
    })();
  }
  /**
   * GET /api/blockdag/nft/item/:itemId — same as landing NFT detail (CID / ipfs file id).
   */
  getItemDetailByFileId(itemId) {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const url = `${environments_environment__WEBPACK_IMPORTED_MODULE_3__.environment.apiUrl}/api/blockdag/nft/item/${encodeURIComponent(itemId)}`;
      const headers = yield _this2._headers();
      const res = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.firstValueFrom)(_this2._http.get(url, {
        headers
      }));
      return res?.data ?? res;
    })();
  }
  /**
   * GET /api/blockdag/nft/items/:collection/:tokenId — landing BlockDagNftService.getNFT
   */
  getNftByContractAndToken(collectionAddress, tokenId) {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const url = `${environments_environment__WEBPACK_IMPORTED_MODULE_3__.environment.apiUrl}/api/blockdag/nft/items/${encodeURIComponent(collectionAddress)}/${encodeURIComponent(tokenId)}`;
      const headers = yield _this3._headers();
      const res = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.firstValueFrom)(_this3._http.get(url, {
        headers
      }));
      const raw = res?.data ?? res;
      const row = Array.isArray(raw) ? raw[0] : raw;
      if (!row || typeof row !== "object") {
        throw new Error("NFT not found");
      }
      return formatNftItem(row, 0);
    })();
  }
  /**
   * GET /api/blockdag/nft/items?owner=0x...
   * Optional Bearer token (same as landing BlockDagNftService).
   */
  getItemsByOwner(ownerAddress) {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const url = `${environments_environment__WEBPACK_IMPORTED_MODULE_3__.environment.apiUrl}/api/blockdag/nft/items`;
      const headers = yield _this4._headers();
      const res = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.firstValueFrom)(_this4._http.get(url, {
        params: {
          owner: ownerAddress
        },
        headers
      }));
      const raw = Array.isArray(res) ? res : res?.data ?? [];
      return raw.map((item, i) => formatNftItem(item, i));
    })();
  }
  static ɵfac = function BlockdagNftService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || BlockdagNftService)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](app_services_auth_service__WEBPACK_IMPORTED_MODULE_5__.AuthService));
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({
    token: BlockdagNftService,
    factory: BlockdagNftService.ɵfac,
    providedIn: "root"
  });
}

/***/ },

/***/ 11410
/*!*********************************************!*\
  !*** ./src/app/services/rewards.service.ts ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RewardsService: () => (/* binding */ RewardsService)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _http_wrapper_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../http-wrapper.service */ 84099);




class RewardsService {
  _httpWrapper;
  baseUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl;
  constructor(_httpWrapper) {
    this._httpWrapper = _httpWrapper;
  }
  /**
   * Get the roulette wheel configuration based on the user's tag type
   * Returns the wheel segments and whether the user can spin today
   */
  getRouletteWheel(tagName, domain) {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const query = {
        tagName,
        domain
      };
      const response = yield _this._httpWrapper.sendRequest("get", `${_this.baseUrl}/api/rewards/roulette-wheel`, query);
      return response;
    })();
  }
  /**
   * Claim daily reward by spinning the wheel
   * The backend determines the winning value and returns the winning index
   */
  claimDailyReward(tagName, domain) {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const body = {
        tagName,
        domain
      };
      const response = yield _this2._httpWrapper.sendRequest("post", `${_this2.baseUrl}/api/rewards/daily`, body);
      return response;
    })();
  }
  /**
   * Get reward history for a tag
   */
  getRewardHistory(_x, _x2) {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (tagName, domain, limit = 10) {
      const query = {
        domain,
        limit
      };
      const response = yield _this3._httpWrapper.sendRequest("get", `${_this3.baseUrl}/api/rewards/history/${encodeURIComponent(tagName)}`, query);
      return response;
    }).apply(this, arguments);
  }
  /**
   * Get reward statistics for a tag
   */
  getRewardStats(tagName, domain) {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const query = {
        domain
      };
      const response = yield _this4._httpWrapper.sendRequest("get", `${_this4.baseUrl}/api/rewards/stats/${encodeURIComponent(tagName)}`, query);
      return response;
    })();
  }
  /**
   * Convert backend segments array to WheelSegment objects for the UI
   */
  convertToWheelSegments(segments, type) {
    return segments.map((value, index) => ({
      value,
      label: value.toString(),
      color: index === 0 ? "#FF8622" : "#FF5721"
    }));
  }
  /**
   * Claim first transaction reward
   * User gets a random 1-100 ZNS reward for their first ZNS transaction
   */
  claimFirstTransaction(params) {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const body = {
        tagName: params.tagName,
        domain: params.domain
      };
      const response = yield _this5._httpWrapper.sendRequest("post", `${_this5.baseUrl}/api/rewards/first-transaction`, body);
      return response;
    })();
  }
  static ɵfac = function RewardsService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RewardsService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_http_wrapper_service__WEBPACK_IMPORTED_MODULE_3__.HttpWrapperService));
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
    token: RewardsService,
    factory: RewardsService.ɵfac,
    providedIn: "root"
  });
}

/***/ },

/***/ 51001
/*!*******************************************************!*\
  !*** ./src/app/services/scroll-to-section.service.ts ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScrollToSectionService: () => (/* binding */ ScrollToSectionService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 75797);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 34205);


class ScrollToSectionService {
  _scrollEvent$ = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject(null);
  /**
   * Trigger a scroll to a specific section
   */
  scrollToSection(sectionId, component) {
    this._scrollEvent$.next({
      sectionId,
      component
    });
  }
  /**
   * Get the scroll event observable
   */
  get scrollEvent$() {
    return this._scrollEvent$.asObservable();
  }
  /**
   * Clear the current scroll event
   */
  clearScrollEvent() {
    this._scrollEvent$.next(null);
  }
  static ɵfac = function ScrollToSectionService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ScrollToSectionService)();
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: ScrollToSectionService,
    factory: ScrollToSectionService.ɵfac,
    providedIn: "root"
  });
}

/***/ }

}]);
//# sourceMappingURL=common.js.map