"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_dapp-sign_dapp-sign_component_ts"],{

/***/ 51640
/*!**************************************************!*\
  !*** ./src/app/dapp-sign/dapp-sign.component.ts ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DappSignComponent: () => (/* binding */ DappSignComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/progress-spinner */ 41134);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 34487);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var app_zelf_loader_zelf_loader_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! app/zelf-loader/zelf-loader.component */ 40152);
/* harmony import */ var _shared_types_dapp_types__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @shared/types/dapp.types */ 35079);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ethers */ 27471);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var app_chrome_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! app/chrome.service */ 85043);
/* harmony import */ var app_services_dapp_gas_estimation_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! app/services/dapp-gas-estimation.service */ 98795);
/* harmony import */ var app_services_signing_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! app/services/signing.service */ 92121);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/snack-bar */ 3347);
/* harmony import */ var app_tags_service__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! app/tags.service */ 73768);
/* harmony import */ var app_services_tx_decoder_service__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! app/services/tx-decoder.service */ 23023);
/* harmony import */ var app_vault_service__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! app/vault.service */ 19519);
/* harmony import */ var app_wallet_service__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! app/wallet.service */ 69556);

























const _c0 = a0 => ({
  remaining: a0
});
function DappSignComponent_div_0_ng_container_1_img_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "img", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("error", function DappSignComponent_div_0_ng_container_1_img_3_Template_img_error_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r2);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r2.onFaviconError());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("src", ctx_r2.favicon, _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵsanitizeUrl"])("alt", ctx_r2.hostname);
  }
}
function DappSignComponent_div_0_ng_container_1_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](ctx_r2.hostnameInitial);
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_div_1__svg_svg_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "svg", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](1, "path", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_div_1__svg_svg_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "svg", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](1, "path", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_div_1__svg_svg_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "svg", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](1, "path", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_div_1__svg_svg_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "svg", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](1, "path", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_div_1_p_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "p", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1, " Step 1: Permit the contract to spend your tokens to execute a swap or transfer. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 28)(1, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](2, DappSignComponent_div_0_ng_container_1_div_9_div_1__svg_svg_2_Template, 2, 0, "svg", 30)(3, DappSignComponent_div_0_ng_container_1_div_9_div_1__svg_svg_3_Template, 2, 0, "svg", 30)(4, DappSignComponent_div_0_ng_container_1_div_9_div_1__svg_svg_4_Template, 2, 0, "svg", 30)(5, DappSignComponent_div_0_ng_container_1_div_9_div_1__svg_svg_5_Template, 2, 0, "svg", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](6, "div", 31)(7, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](9, DappSignComponent_div_0_ng_container_1_div_9_div_1_p_9_Template, 2, 0, "p", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngClass", "dapp-sign__decoded-icon--" + ctx_r2.decoded.type);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.decoded.type === "native_transfer" || ctx_r2.decoded.type === "erc20_transfer");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.decoded.type === "erc20_approve" || ctx_r2.decoded.type === "erc721_approve_all");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.decoded.type === "swap");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.decoded.type === "contract_interaction" || ctx_r2.decoded.type === "unknown" || ctx_r2.decoded.type === "erc721_transfer");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](ctx_r2.decoded.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.decoded.type === "erc20_approve" || ctx_r2.decoded.type === "erc721_approve_all");
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 22)(1, "span", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "span", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r4("dapp.to_address"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](ctx_r2.shortAddress(ctx_r2.txTo));
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_div_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 22)(1, "span", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r4("dapp.value"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate2"]("", ctx_r2.txValueFormatted, " ", ctx_r2.txChainSymbol);
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_span_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r4("dapp.estimating"));
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_span_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate2"](" ", ctx_r2.estimatedGasFeeFormatted, " ", ctx_r2.txChainSymbol, " ");
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_span_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", t_r4("dapp.unable_to_estimate"), " ");
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_ng_container_16_div_1_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"]("", ctx_r2.decoded == null ? null : ctx_r2.decoded.amountIn, " WEI ");
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_ng_container_16_div_1_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](ctx_r2.decoded == null ? null : ctx_r2.decoded.srcTokenSymbol);
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_ng_container_16_div_1_ng_container_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](ctx_r2.shortAddress((ctx_r2.decoded == null ? null : ctx_r2.decoded.srcToken) || ""));
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_ng_container_16_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 22)(1, "span", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2, "From Token");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](4, DappSignComponent_div_0_ng_container_1_div_9_ng_container_16_div_1_span_4_Template, 2, 1, "span", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](5, "span", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](6, DappSignComponent_div_0_ng_container_1_div_9_ng_container_16_div_1_ng_container_6_Template, 2, 1, "ng-container", 2)(7, DappSignComponent_div_0_ng_container_1_div_9_ng_container_16_div_1_ng_container_7_Template, 2, 1, "ng-container", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", (ctx_r2.decoded == null ? null : ctx_r2.decoded.amountIn) && (ctx_r2.decoded == null ? null : ctx_r2.decoded.amountIn) !== "0");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("title", (ctx_r2.decoded == null ? null : ctx_r2.decoded.srcTokenSymbol) ? ctx_r2.shortAddress((ctx_r2.decoded == null ? null : ctx_r2.decoded.srcToken) || "") : "");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.decoded == null ? null : ctx_r2.decoded.srcTokenSymbol);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !(ctx_r2.decoded == null ? null : ctx_r2.decoded.srcTokenSymbol));
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_ng_container_16_div_2_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"]("Min: ", ctx_r2.decoded == null ? null : ctx_r2.decoded.amountOutMin, " WEI ");
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_ng_container_16_div_2_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](ctx_r2.decoded == null ? null : ctx_r2.decoded.dstTokenSymbol);
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_ng_container_16_div_2_ng_container_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](ctx_r2.shortAddress((ctx_r2.decoded == null ? null : ctx_r2.decoded.dstToken) || ""));
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_ng_container_16_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 22)(1, "span", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2, "To Token");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](4, DappSignComponent_div_0_ng_container_1_div_9_ng_container_16_div_2_span_4_Template, 2, 1, "span", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](5, "span", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](6, DappSignComponent_div_0_ng_container_1_div_9_ng_container_16_div_2_ng_container_6_Template, 2, 1, "ng-container", 2)(7, DappSignComponent_div_0_ng_container_1_div_9_ng_container_16_div_2_ng_container_7_Template, 2, 1, "ng-container", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", (ctx_r2.decoded == null ? null : ctx_r2.decoded.amountOutMin) && (ctx_r2.decoded == null ? null : ctx_r2.decoded.amountOutMin) !== "0");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("title", (ctx_r2.decoded == null ? null : ctx_r2.decoded.dstTokenSymbol) ? ctx_r2.shortAddress((ctx_r2.decoded == null ? null : ctx_r2.decoded.dstToken) || "") : "");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.decoded == null ? null : ctx_r2.decoded.dstTokenSymbol);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !(ctx_r2.decoded == null ? null : ctx_r2.decoded.dstTokenSymbol));
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_ng_container_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](1, DappSignComponent_div_0_ng_container_1_div_9_ng_container_16_div_1_Template, 8, 4, "div", 25)(2, DappSignComponent_div_0_ng_container_1_div_9_ng_container_16_div_2_Template, 8, 4, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.decoded == null ? null : ctx_r2.decoded.srcToken);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.decoded == null ? null : ctx_r2.decoded.dstToken);
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_div_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 22)(1, "span", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "span", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r4("dapp.data"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", ctx_r2.txData, " ");
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_div_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 43)(1, "span", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2, "warning");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r4("dapp.unknown_interaction_warning"));
  }
}
function DappSignComponent_div_0_ng_container_1_div_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](1, DappSignComponent_div_0_ng_container_1_div_9_div_1_Template, 10, 7, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](2, "div", 21)(3, "div", 22)(4, "span", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](6, "span", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](8, DappSignComponent_div_0_ng_container_1_div_9_div_8_Template, 5, 2, "div", 25)(9, DappSignComponent_div_0_ng_container_1_div_9_div_9_Template, 5, 3, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](10, "div", 22)(11, "span", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](13, DappSignComponent_div_0_ng_container_1_div_9_span_13_Template, 2, 1, "span", 26)(14, DappSignComponent_div_0_ng_container_1_div_9_span_14_Template, 2, 2, "span", 26)(15, DappSignComponent_div_0_ng_container_1_div_9_span_15_Template, 2, 1, "span", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](16, DappSignComponent_div_0_ng_container_1_div_9_ng_container_16_Template, 3, 2, "ng-container", 2)(17, DappSignComponent_div_0_ng_container_1_div_9_div_17_Template, 5, 2, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](18, DappSignComponent_div_0_ng_container_1_div_9_div_18_Template, 5, 1, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.decoded);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r4("dapp.network"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](ctx_r2.txNetworkName);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.txTo);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.txValueFormatted && ctx_r2.txValueFormatted !== "0" && ctx_r2.txValueFormatted !== "0.0");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r4("dapp.estimated_gas_fee"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.gasEstimateLoading);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !ctx_r2.gasEstimateLoading && !ctx_r2.gasEstimateError);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !ctx_r2.gasEstimateLoading && ctx_r2.gasEstimateError);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", (ctx_r2.decoded == null ? null : ctx_r2.decoded.type) === "swap");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.txData && ctx_r2.txData !== "0x" && (!ctx_r2.decoded || ctx_r2.decoded.type === "unknown"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", (ctx_r2.decoded == null ? null : ctx_r2.decoded.type) === "unknown");
  }
}
function DappSignComponent_div_0_ng_container_1_div_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 19)(1, "p", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "div", 46)(4, "pre", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r4("dapp.message_to_sign"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](ctx_r2.messageToSign);
  }
}
function DappSignComponent_div_0_ng_container_1_ng_container_12_form_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "form", 50)(1, "div", 51)(2, "input", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("input", function DappSignComponent_div_0_ng_container_1_ng_container_12_form_1_Template_input_input_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r5);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r2.clearCredentialError());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "button", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function DappSignComponent_div_0_ng_container_1_ng_container_12_form_1_Template_button_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r5);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r2.toggleShowPassword());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](4, "span", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("formGroup", ctx_r2.form);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("type", ctx_r2.showPassword ? "text" : "password")("placeholder", t_r4("common.password"));
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](ctx_r2.showPassword ? "visibility" : "visibility_off");
  }
}
function DappSignComponent_div_0_ng_container_1_ng_container_12_div_2_input_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "input", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("input", function DappSignComponent_div_0_ng_container_1_ng_container_12_div_2_input_2_Template_input_input_0_listener($event) {
      const i_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r6).index;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](5);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r2.onPinInput($event, i_r7));
    })("keydown", function DappSignComponent_div_0_ng_container_1_ng_container_12_div_2_input_2_Template_input_keydown_0_listener($event) {
      const i_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r6).index;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](5);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r2.onPinKeyDown($event, i_r7));
    })("focus", function DappSignComponent_div_0_ng_container_1_ng_container_12_div_2_input_2_Template_input_focus_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r6);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](5);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r2.onInputFocus($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const digit_r8 = ctx.$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("type", ctx_r2.showPassword ? "text" : "password")("value", digit_r8);
  }
}
function DappSignComponent_div_0_ng_container_1_ng_container_12_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 54)(1, "div", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](2, DappSignComponent_div_0_ng_container_1_ng_container_12_div_2_input_2_Template, 1, 2, "input", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngForOf", ctx_r2.pinDigits)("ngForTrackBy", ctx_r2.trackByIndex);
  }
}
function DappSignComponent_div_0_ng_container_1_ng_container_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](1, DappSignComponent_div_0_ng_container_1_ng_container_12_form_1_Template, 6, 4, "form", 48)(2, DappSignComponent_div_0_ng_container_1_ng_container_12_div_2_Template, 3, 2, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !ctx_r2.isPinUnlock);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.isPinUnlock);
  }
}
function DappSignComponent_div_0_ng_container_1_div_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 58)(1, "span", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2, "error");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2).$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](ctx_r2.isPinUnlock ? t_r4("errors.invalid_pin", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](1, _c0, ctx_r2.remainingAttempts)) : t_r4("errors.invalid_password", _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵpureFunction1"](3, _c0, ctx_r2.remainingAttempts)));
  }
}
function DappSignComponent_div_0_ng_container_1_div_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 59)(1, "span", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](2, "fingerprint");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r4("dapp.biometric_required"));
  }
}
function DappSignComponent_div_0_ng_container_1_ng_container_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r4("common.verify"));
  }
}
function DappSignComponent_div_0_ng_container_1_ng_container_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](t_r4("common.confirm"));
  }
}
function DappSignComponent_div_0_ng_container_1_mat_spinner_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](0, "mat-spinner", 60);
  }
}
function DappSignComponent_div_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](1, "div", 3)(2, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](3, DappSignComponent_div_0_ng_container_1_img_3_Template, 1, 2, "img", 5)(4, DappSignComponent_div_0_ng_container_1_span_4_Template, 2, 1, "span", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](5, "p", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](7, "p", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](9, DappSignComponent_div_0_ng_container_1_div_9_Template, 19, 12, "div", 9)(10, DappSignComponent_div_0_ng_container_1_div_10_Template, 6, 2, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](11, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](12, DappSignComponent_div_0_ng_container_1_ng_container_12_Template, 3, 2, "ng-container", 2)(13, DappSignComponent_div_0_ng_container_1_div_13_Template, 5, 5, "div", 11)(14, DappSignComponent_div_0_ng_container_1_div_14_Template, 5, 1, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](15, "div", 13)(16, "button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function DappSignComponent_div_0_ng_container_1_Template_button_click_16_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r1);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r2.reject());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](18, "button", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵlistener"]("click", function DappSignComponent_div_0_ng_container_1_Template_button_click_18_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r1);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r2.requiresBiometrics ? ctx_r2.goToBiometrics() : ctx_r2.confirmSigning());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](19, DappSignComponent_div_0_ng_container_1_ng_container_19_Template, 2, 1, "ng-container", 2)(20, DappSignComponent_div_0_ng_container_1_ng_container_20_Template, 2, 1, "ng-container", 2)(21, DappSignComponent_div_0_ng_container_1_mat_spinner_21_Template, 1, 0, "mat-spinner", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const t_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]().$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.favicon && !ctx_r2.faviconError);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !ctx_r2.favicon || ctx_r2.faviconError);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", ctx_r2.isMessageSign ? t_r4("dapp.sign_message") : t_r4("dapp.confirm_transaction"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate"](ctx_r2.hostname);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !ctx_r2.isMessageSign);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.isMessageSign);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !ctx_r2.passwordSet);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.passwordError);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.requiresBiometrics);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("disabled", ctx_r2.signing);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtextInterpolate1"](" ", t_r4("common.cancel"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("disabled", ctx_r2.signing || !ctx_r2.hasCredentials);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.requiresBiometrics);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !ctx_r2.requiresBiometrics && !ctx_r2.signing);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.signing);
  }
}
function DappSignComponent_div_0_zelf_loader_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelement"](0, "zelf-loader");
  }
}
function DappSignComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementStart"](0, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](1, DappSignComponent_div_0_ng_container_1_Template, 22, 15, "ng-container", 2)(2, DappSignComponent_div_0_zelf_loader_2_Template, 1, 0, "zelf-loader", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", !ctx_r2.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵproperty"]("ngIf", ctx_r2.loading);
  }
}
class DappSignComponent {
  _activatedRoute;
  _changeDetectorRef;
  _chromeService;
  _dappGasEstimation;
  _formBuilder;
  _router;
  _signingService;
  _snackBar;
  _tagsService;
  _translocoService;
  _txDecoder;
  _vaultService;
  _walletService;
  loading = true;
  signing = false;
  requestId = "";
  origin = "";
  hostname = "";
  favicon = "";
  faviconError = false;
  method = "";
  requiresBiometrics = false;
  passwordSet = false;
  showPassword = false;
  passwordError = false;
  remainingAttempts = 0;
  isPinUnlock = false;
  pinDigits = ["", "", "", "", "", ""];
  form;
  wallet;
  decoded = null;
  txTo = "";
  txValue = "";
  txValueFormatted = "";
  txData = "";
  txChainId = 1;
  txNetwork = "ethereum";
  txNetworkName = "Ethereum";
  txChainSymbol = "ETH";
  gasEstimateLoading = false;
  gasEstimateError = false;
  estimatedGasFeeFormatted = "";
  messageToSign = "";
  isMessageSign = false;
  _password = "";
  _pendingParams = null;
  constructor(_activatedRoute, _changeDetectorRef, _chromeService, _dappGasEstimation, _formBuilder, _router, _signingService, _snackBar, _tagsService, _translocoService, _txDecoder, _vaultService, _walletService) {
    this._activatedRoute = _activatedRoute;
    this._changeDetectorRef = _changeDetectorRef;
    this._chromeService = _chromeService;
    this._dappGasEstimation = _dappGasEstimation;
    this._formBuilder = _formBuilder;
    this._router = _router;
    this._signingService = _signingService;
    this._snackBar = _snackBar;
    this._tagsService = _tagsService;
    this._translocoService = _translocoService;
    this._txDecoder = _txDecoder;
    this._vaultService = _vaultService;
    this._walletService = _walletService;
    this.remainingAttempts = this._vaultService.remainingAttempts;
    this._password = this._vaultService.password;
    this._vaultService.mnemonic = "";
    this._vaultService.password = "";
    if (this._password?.trim()) {
      this.passwordSet = true;
    }
  }
  ngOnInit() {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const urlParams = new URLSearchParams(window.location.search);
      _this.requestId = urlParams.get("requestId") || _this._activatedRoute.snapshot.queryParams?.requestId || sessionStorage.getItem("pending_sign_request_id") || "";
      if (!_this.requestId) {
        _this._router.navigate(["/home"]);
        return;
      }
      sessionStorage.removeItem("pending_sign_request_id");
      _this.form = _this._formBuilder.group({
        password: ["", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required]]
      });
      try {
        _this.wallet = yield _this._walletService.getCurrentWallet();
        const pendingData = yield _this._loadPendingData();
        if (pendingData) {
          _this.origin = pendingData.origin || "";
          _this.hostname = pendingData.hostname || _this._extractHostname(_this.origin);
          _this.favicon = pendingData.favicon || "";
          _this.method = pendingData.method || "";
          _this._pendingParams = pendingData.params;
          if (!_this.favicon && _this.hostname) {
            _this.favicon = `https://www.google.com/s2/favicons?domain=${_this.hostname}&sz=64`;
          }
          const resolvedChainId = pendingData.chainId || 1;
          _this.txChainId = resolvedChainId;
          const chainConfig = (0,_shared_types_dapp_types__WEBPACK_IMPORTED_MODULE_8__.getChainConfig)(resolvedChainId);
          if (chainConfig) {
            _this.txNetwork = chainConfig.network;
            _this.txNetworkName = chainConfig.name;
            _this.txChainSymbol = chainConfig.symbol;
          }
          if (_this._isMessageMethod(_this.method)) {
            _this.isMessageSign = true;
            _this._parseMessage();
          } else {
            _this._parseTransaction();
            void _this._estimateGasFee();
          }
        }
        yield _this._checkPasswordlessWallet();
        yield _this._checkBiometrics();
      } catch (error) {
        console.error("Error loading signing data:", error);
      }
      _this.loading = false;
    })();
  }
  get hasCredentials() {
    if (this.isPinUnlock) {
      return this.passwordSet || this.pinDigits.join("").length === 6;
    }
    return this.passwordSet || !!this.form.get("password")?.value;
  }
  get hostnameInitial() {
    return this.hostname ? this.hostname.charAt(0).toUpperCase() : "?";
  }
  onFaviconError() {
    this.faviconError = true;
  }
  shortAddress(address) {
    if (!address || address.length < 12) return address;
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  }
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  goToBiometrics() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this2.hasCredentials || !_this2.wallet) return;
      if (!_this2._vaultService.password || _this2._vaultService.password.trim() === "") {
        _this2._vaultService.password = _this2.isPinUnlock ? _this2.pinDigits.join("") : _this2.form.get("password")?.value || _this2._password;
      }
      const tagName = _this2.wallet?.publicData?.tagName || _this2.wallet?.fullTagName || "";
      yield _this2._tagsService.setTagName(tagName);
      yield _this2._tagsService.setFlow("unlock");
      sessionStorage.setItem("pending_sign_request_id", _this2.requestId);
      _this2._router.navigate(["security/biometrics"], {
        queryParams: {
          return: "/dapp/sign"
        }
      });
    })();
  }
  confirmSigning() {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (_this3.signing) return;
      if (_this3.requiresBiometrics) {
        yield _this3.goToBiometrics();
        return;
      }
      if (!_this3.isPinUnlock && !_this3._password && !_this3.form.get("password")?.value) {
        _this3._openErrorSnackBar("Enter your password");
        return;
      }
      if (_this3.isPinUnlock && !_this3._password && _this3.pinDigits.join("").length !== 6) {
        _this3._openErrorSnackBar("Enter your PIN");
        return;
      }
      _this3.signing = true;
      try {
        const passphrase = _this3._password || (_this3.isPinUnlock ? _this3.pinDigits.join("") : _this3.form.get("password")?.value);
        // Use oneTimeDecryptMessage (no biometrics timer check) since:
        // 1. We already verified biometrics within this popup flow, and
        // 2. The signing popup is a separate Chrome window whose VaultService
        //    instance may have a stale _lastVerified causing false "expired" errors.
        let mnemonic = yield _this3._signingService.decryptMnemonicOnce(_this3.wallet, passphrase);
        if (!mnemonic) {
          _this3._openErrorSnackBar("Failed to decrypt wallet");
          _this3.signing = false;
          return;
        }
        let result;
        if (_this3.isMessageSign) {
          const signResult = yield _this3._signingService.signMessage(mnemonic, {
            method: _this3.method,
            message: Array.isArray(_this3._pendingParams) ? _this3._pendingParams[0] : _this3._pendingParams
          });
          result = signResult.signature;
        } else {
          const params = Array.isArray(_this3._pendingParams) ? _this3._pendingParams[0] : _this3._pendingParams;
          if (_this3.method === "eth_signTransaction") {
            result = yield _this3._signingService.signRawTransaction(mnemonic, {
              to: params.to,
              value: params.value,
              data: params.data,
              gasLimit: params.gas || params.gasLimit,
              gasPrice: params.gasPrice,
              maxFeePerGas: params.maxFeePerGas,
              maxPriorityFeePerGas: params.maxPriorityFeePerGas,
              nonce: params.nonce ? parseInt(params.nonce, 16) : undefined,
              chainId: _this3.txChainId,
              network: _this3.txNetwork
            });
          } else {
            const txResult = yield _this3._signingService.sendEvmTransactionNative(mnemonic, {
              to: params.to,
              value: params.value,
              data: params.data,
              gasLimit: params.gas || params.gasLimit,
              gasPrice: params.gasPrice,
              maxFeePerGas: params.maxFeePerGas,
              maxPriorityFeePerGas: params.maxPriorityFeePerGas,
              nonce: params.nonce ? parseInt(params.nonce, 16) : undefined,
              chainId: _this3.txChainId,
              network: _this3.txNetwork
            });
            result = txResult.hash;
          }
        }
        yield chrome.runtime.sendMessage({
          type: "DAPP_SIGNING_RESULT",
          payload: {
            requestId: _this3.requestId,
            result
          },
          requestId: _this3.requestId
        });
        window.close();
      } catch (error) {
        console.error("Signing error:", error);
        if (/incorrect/i.test(error?.message)) {
          yield _this3._handleInvalidCredentials();
        } else {
          _this3._openErrorSnackBar(error?.message || "Signing failed");
        }
        _this3.signing = false;
      }
    })();
  }
  reject() {
    var _this4 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        yield chrome.runtime.sendMessage({
          type: "DAPP_SIGNING_RESULT",
          payload: {
            requestId: _this4.requestId,
            error: {
              code: 4001,
              message: "User rejected the request"
            }
          },
          requestId: _this4.requestId
        });
      } catch (error) {
        console.error("Error sending rejection:", error);
      }
      window.close();
    })();
  }
  _handleInvalidCredentials() {
    var _this5 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this5.wallet = yield _this5._walletService.getCurrentWallet();
      _this5.remainingAttempts = _this5._vaultService.remainingAttempts;
      _this5.passwordSet = false;
      _this5._password = "";
      _this5._vaultService.password = "";
      if (_this5.isPinUnlock) {
        _this5.pinDigits = ["", "", "", "", "", ""];
      } else {
        _this5.form.get("password")?.setValue("");
      }
      yield _this5._checkBiometrics();
      const missingVaultSecrets = !_this5.wallet?.pgp?.encryptedMessage || !_this5.wallet?.pgp?.privateKey;
      _this5.passwordError = !_this5.requiresBiometrics && !missingVaultSecrets;
      _this5._changeDetectorRef.detectChanges();
    })();
  }
  _isMessageMethod(method) {
    return method === "personal_sign" || method === "eth_sign" || method.startsWith("eth_signTypedData");
  }
  _parseTransaction() {
    if (!this._pendingParams) return;
    const params = Array.isArray(this._pendingParams) ? this._pendingParams[0] : this._pendingParams;
    this.txTo = params.to || "";
    this.txValue = params.value || "0";
    this.txData = params.data || "0x";
    if (params.chainId) {
      const parsed = typeof params.chainId === "string" ? parseInt(params.chainId, 16) : params.chainId;
      if (parsed) {
        this.txChainId = parsed;
        const chainConfig = (0,_shared_types_dapp_types__WEBPACK_IMPORTED_MODULE_8__.getChainConfig)(parsed);
        if (chainConfig) {
          this.txNetwork = chainConfig.network;
          this.txNetworkName = chainConfig.name;
          this.txChainSymbol = chainConfig.symbol;
        }
      }
    }
    try {
      if (this.txValue && this.txValue !== "0" && this.txValue !== "0x0") {
        this.txValueFormatted = ethers__WEBPACK_IMPORTED_MODULE_9__.formatEther(this.txValue);
        const dot = this.txValueFormatted.indexOf(".");
        if (dot !== -1 && this.txValueFormatted.length - dot - 1 > 8) {
          this.txValueFormatted = this.txValueFormatted.slice(0, dot + 9);
        }
      }
    } catch {
      this.txValueFormatted = this.txValue;
    }
    this.decoded = this._txDecoder.decode(this.txTo, this.txData, this.txValue);
  }
  _estimateGasFee() {
    var _this6 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this6._pendingParams) {
        return;
      }
      const params = Array.isArray(_this6._pendingParams) ? _this6._pendingParams[0] : _this6._pendingParams;
      const senderAddress = _this6.wallet?.publicData?.ethAddress;
      if (!senderAddress) {
        _this6.gasEstimateError = true;
        return;
      }
      _this6.gasEstimateLoading = true;
      _this6.gasEstimateError = false;
      _this6.estimatedGasFeeFormatted = "";
      _this6._changeDetectorRef.detectChanges();
      try {
        const estimate = yield _this6._dappGasEstimation.estimateTransactionFee({
          to: params.to,
          value: params.value,
          data: params.data,
          gasLimit: params.gas || params.gasLimit,
          gasPrice: params.gasPrice,
          maxFeePerGas: params.maxFeePerGas,
          maxPriorityFeePerGas: params.maxPriorityFeePerGas,
          nonce: params.nonce ? parseInt(params.nonce, 16) : undefined,
          chainId: _this6.txChainId,
          network: _this6.txNetwork
        }, senderAddress);
        _this6.estimatedGasFeeFormatted = estimate.formattedFee;
      } catch (error) {
        console.error("Failed to estimate dapp transaction fee:", error);
        _this6.gasEstimateError = true;
      } finally {
        _this6.gasEstimateLoading = false;
        _this6._changeDetectorRef.detectChanges();
      }
    })();
  }
  _parseMessage() {
    if (!this._pendingParams) return;
    const params = Array.isArray(this._pendingParams) ? this._pendingParams : [this._pendingParams];
    if (this.method === "personal_sign") {
      this.messageToSign = params[0] || "";
      if (this.messageToSign.startsWith("0x")) {
        try {
          const bytes = [];
          for (let i = 2; i < this.messageToSign.length; i += 2) {
            bytes.push(parseInt(this.messageToSign.substring(i, i + 2), 16));
          }
          this.messageToSign = new TextDecoder().decode(new Uint8Array(bytes));
        } catch {
          // Keep hex if can't decode
        }
      }
    } else if (this.method.startsWith("eth_signTypedData")) {
      const typedData = typeof params[1] === "string" ? params[1] : JSON.stringify(params[1], null, 2);
      this.messageToSign = typedData;
    }
  }
  _checkPasswordlessWallet() {
    var _this7 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this7.wallet?.publicData) return;
      const publicData = _this7.wallet.publicData;
      if (String(publicData.hasPassword) === "false") {
        _this7._password = "NO_PASSWORD_PLACEHOLDER";
        _this7._vaultService.password = "NO_PASSWORD_PLACEHOLDER";
        _this7._vaultService.securityType = "withoutPassword";
        _this7.passwordSet = true;
      } else if (publicData.st === "pin") {
        _this7.isPinUnlock = true;
        _this7._vaultService.securityType = "pin";
      } else {
        _this7._vaultService.securityType = "securePassword";
      }
    })();
  }
  _checkBiometrics() {
    var _this8 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const biometricsRequired = yield _this8._vaultService.biometricsRequired();
      if (!_this8.wallet?.pgp?.encryptedMessage || !_this8.wallet?.pgp?.privateKey || biometricsRequired) {
        _this8.requiresBiometrics = true;
        return;
      }
      _this8.requiresBiometrics = false;
    })();
  }
  _loadPendingData() {
    var _this9 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const response = yield chrome.runtime.sendMessage({
          type: "DAPP_GET_PENDING",
          requestId: _this9.requestId
        });
        if (response?.success && response.data) {
          return response.data;
        }
      } catch {
        // Background might not support this message yet
      }
      const stored = yield _this9._chromeService.getItem("pending_dapp_request_" + _this9.requestId);
      if (stored && typeof stored === "object" && stored.origin) {
        return stored;
      }
      return null;
    })();
  }
  _extractHostname(origin) {
    if (!origin) return "";
    try {
      return new URL(origin).hostname;
    } catch {
      return origin;
    }
  }
  _parseRpcError(raw) {
    if (!raw) return "Transaction failed. Please try again.";
    const msg = raw.toLowerCase();
    if (msg.includes("insufficient funds")) {
      return `Not enough ${this.txChainSymbol} to cover gas fees. Add funds to your wallet and try again.`;
    }
    if (msg.includes("execution reverted") || msg.includes("reverted")) {
      if (msg.includes("slippage") || msg.includes("price impact")) {
        return "Swap failed: price moved too much. Try increasing slippage tolerance.";
      }
      return "Transaction reverted on-chain. The swap may have expired — please try again.";
    }
    if (msg.includes("nonce too low") || msg.includes("replacement transaction underpriced")) {
      return "Transaction conflict. Please wait a moment and try again.";
    }
    if (msg.includes("gas required exceeds allowance") || msg.includes("gas limit")) {
      return "Gas limit too low. Try increasing slippage or gas settings.";
    }
    if (msg.includes("user rejected") || msg.includes("rejected by user")) {
      return "Transaction cancelled.";
    }
    if (msg.includes("incorrect_passphrase") || msg.includes("incorrect passphrase")) {
      return "Incorrect password. Please try again.";
    }
    if (msg.includes("network") || msg.includes("connection")) {
      return "Network error. Check your connection and try again.";
    }
    return "Transaction failed. Please try again.";
  }
  _openErrorSnackBar(rawMessage) {
    const friendlyMessage = this._parseRpcError(rawMessage);
    this._snackBar.open(friendlyMessage, this._translocoService.translate("common.close"), {
      duration: 7000,
      panelClass: "zelf-snackbar",
      verticalPosition: "top"
    });
  }
  onInputFocus(event) {
    event.target.select();
  }
  onPinInput(event, index) {
    const input = event.target;
    const value = input.value;
    this.passwordError = false;
    if (value.length > 1) {
      const digits = value.slice(0, 6).split("");
      this.pinDigits = [...digits, ...Array(6 - digits.length).fill("")].slice(0, 6);
      const lastIndex = Math.min(digits.length - 1, 5);
      setTimeout(() => {
        const inputs = this._getPinInputs();
        if (inputs[lastIndex]) inputs[lastIndex].focus();
      }, 0);
      return;
    }
    this.pinDigits[index] = value;
    if (value && index < 5) {
      setTimeout(() => {
        const inputs = this._getPinInputs();
        if (inputs[index + 1]) inputs[index + 1].focus();
      }, 0);
    }
  }
  onPinKeyDown(event, index) {
    const input = event.target;
    if (event.key === "Backspace" && !input.value && index > 0) {
      setTimeout(() => {
        const inputs = this._getPinInputs();
        if (inputs[index - 1]) {
          inputs[index - 1].focus();
          this.pinDigits[index - 1] = "";
        }
      }, 0);
    } else if (event.key === "Enter") {
      if (this.hasCredentials && !this.signing) {
        this.requiresBiometrics ? this.goToBiometrics() : this.confirmSigning();
      }
    }
  }
  _getPinInputs() {
    return Array.from(document.querySelectorAll(".dapp-sign__pin-input"));
  }
  trackByIndex(index) {
    return index;
  }
  clearCredentialError() {
    this.passwordError = false;
  }
  static ɵfac = function DappSignComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DappSignComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_13__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_10__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](app_chrome_service__WEBPACK_IMPORTED_MODULE_14__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](app_services_dapp_gas_estimation_service__WEBPACK_IMPORTED_MODULE_15__.DappGasEstimationService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_13__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](app_services_signing_service__WEBPACK_IMPORTED_MODULE_16__.SigningService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_17__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](app_tags_service__WEBPACK_IMPORTED_MODULE_18__.TagsService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](_jsverse_transloco__WEBPACK_IMPORTED_MODULE_6__.TranslocoService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](app_services_tx_decoder_service__WEBPACK_IMPORTED_MODULE_19__.TxDecoderService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](app_vault_service__WEBPACK_IMPORTED_MODULE_20__.VaultService), _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdirectiveInject"](app_wallet_service__WEBPACK_IMPORTED_MODULE_21__.WalletService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdefineComponent"]({
    type: DappSignComponent,
    selectors: [["dapp-sign"]],
    decls: 1,
    vars: 0,
    consts: [["class", "dapp-sign", 4, "transloco"], [1, "dapp-sign"], [4, "ngIf"], [1, "dapp-sign__header"], [1, "dapp-sign__site-icon"], ["width", "40", "height", "40", 3, "src", "alt", "error", 4, "ngIf"], ["class", "dapp-sign__site-initial", 4, "ngIf"], [1, "dapp-sign__title"], [1, "dapp-sign__hostname"], ["class", "dapp-sign__body", 4, "ngIf"], [1, "dapp-sign__auth"], ["class", "dapp-sign__error", 4, "ngIf"], ["class", "dapp-sign__biometric-notice", 4, "ngIf"], [1, "dapp-sign__actions"], ["mat-flat-button", "", 1, "dapp-sign__btn", "dapp-sign__btn--cancel", 3, "click", "disabled"], ["mat-flat-button", "", 1, "dapp-sign__btn", "dapp-sign__btn--confirm", 3, "click", "disabled"], ["mode", "indeterminate", "diameter", "18", 4, "ngIf"], ["width", "40", "height", "40", 3, "error", "src", "alt"], [1, "dapp-sign__site-initial"], [1, "dapp-sign__body"], ["class", "dapp-sign__decoded", 4, "ngIf"], [1, "dapp-sign__details"], [1, "dapp-sign__detail-row"], [1, "dapp-sign__detail-label"], [1, "dapp-sign__detail-value"], ["class", "dapp-sign__detail-row", 4, "ngIf"], ["class", "dapp-sign__detail-value", 4, "ngIf"], ["class", "dapp-sign__warning", 4, "ngIf"], [1, "dapp-sign__decoded"], [1, "dapp-sign__decoded-icon", 3, "ngClass"], ["width", "22", "height", "22", "viewBox", "0 0 24 24", "fill", "currentColor", 4, "ngIf"], [1, "dapp-sign__decoded-text"], [1, "dapp-sign__decoded-description"], ["class", "dapp-sign__decoded-subtext", "style", "font-size: 13px; opacity: 0.8; margin-top: 4px; line-height: 1.4;", 4, "ngIf"], ["width", "22", "height", "22", "viewBox", "0 0 24 24", "fill", "currentColor"], ["d", "M2 21L23 12L2 3V10L17 12L2 14V21Z"], ["d", "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"], ["d", "M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"], ["d", "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"], [1, "dapp-sign__decoded-subtext", 2, "font-size", "13px", "opacity", "0.8", "margin-top", "4px", "line-height", "1.4"], [1, "dapp-sign__detail-value", "dapp-sign__detail-value--mono"], [1, "dapp-sign__detail-value--mono", 3, "title"], [1, "dapp-sign__detail-value", "dapp-sign__detail-value--mono", "dapp-sign__detail-value--truncate"], [1, "dapp-sign__warning"], [1, "material-symbols-outlined"], [1, "dapp-sign__section-label"], [1, "dapp-sign__message-box"], [1, "dapp-sign__message-text"], [3, "formGroup", 4, "ngIf"], ["class", "dapp-sign__pin-container", 4, "ngIf"], [3, "formGroup"], [1, "dapp-sign__password-field"], ["formControlName", "password", "id", "dapp-sign-password", 1, "dapp-sign__password-input", 3, "input", "type", "placeholder"], ["type", "button", 1, "dapp-sign__password-toggle", 3, "click"], [1, "dapp-sign__pin-container"], [1, "dapp-sign__pin-inputs"], ["class", "dapp-sign__pin-input", "maxlength", "1", "autocomplete", "off", 3, "type", "value", "input", "keydown", "focus", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["maxlength", "1", "autocomplete", "off", 1, "dapp-sign__pin-input", 3, "input", "keydown", "focus", "type", "value"], [1, "dapp-sign__error"], [1, "dapp-sign__biometric-notice"], ["mode", "indeterminate", "diameter", "18"]],
    template: function DappSignComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵtemplate"](0, DappSignComponent_div_0_Template, 3, 2, "div", 0);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButton, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_4__.MatProgressSpinnerModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_4__.MatProgressSpinner, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControlName, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_6__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_6__.TranslocoDirective, app_zelf_loader_zelf_loader_component__WEBPACK_IMPORTED_MODULE_7__.ZelfLoaderComponent],
    styles: ["[_nghost-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-grow: 1;\n  padding: 24px;\n}\n\n.dapp-sign[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  max-width: 420px;\n  min-height: 520px;\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  border-radius: 24px;\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  box-shadow: 0 8px 40px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1)), 0 0 0 1px var(--zns-theme-card-border, #eeedf1);\n  overflow: hidden;\n  animation: _ngcontent-%COMP%_slideUp 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.dapp-sign__header[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 6px;\n  padding: 28px 24px 16px;\n}\n.dapp-sign__site-icon[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 14px;\n  background: var(--zns-theme-card, #ffffff);\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  margin-bottom: 4px;\n  box-shadow: 0 2px 8px var(--zns-theme-shadow, rgba(0, 0, 0, 0.1));\n}\n.dapp-sign__site-icon[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  object-fit: contain;\n}\n.dapp-sign__site-initial[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-title-family, \"Menda\", \"Arial Black\", sans-serif);\n  font-size: 20px;\n  font-weight: 700;\n  color: var(--zns-theme-secondary, #ff5721);\n}\n.dapp-sign__title[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 17px;\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n  text-align: center;\n}\n.dapp-sign__hostname[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 13px;\n  color: var(--zns-theme-text-secondary, #73777f);\n  margin: 0;\n  text-align: center;\n  word-break: break-all;\n}\n.dapp-sign__body[_ngcontent-%COMP%] {\n  flex: 1 1 auto;\n  display: flex;\n  flex-direction: column;\n  padding: 0 24px 16px;\n  gap: 14px;\n  overflow-y: auto;\n}\n.dapp-sign__decoded[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 14px;\n  padding: 14px 16px;\n  border-radius: 14px;\n  background: var(--zns-theme-card, #ffffff);\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n}\n.dapp-sign__decoded-icon[_ngcontent-%COMP%] {\n  width: 44px;\n  height: 44px;\n  border-radius: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.dapp-sign__decoded-icon--native_transfer[_ngcontent-%COMP%], .dapp-sign__decoded-icon--erc20_transfer[_ngcontent-%COMP%] {\n  background: rgba(57, 152, 211, 0.1);\n  color: #3998d3;\n}\n.dapp-sign__decoded-icon--erc20_approve[_ngcontent-%COMP%], .dapp-sign__decoded-icon--erc721_approve_all[_ngcontent-%COMP%] {\n  background: rgba(222, 104, 0, 0.1);\n  color: var(--zns-theme-warning, #de6800);\n}\n.dapp-sign__decoded-icon--contract_interaction[_ngcontent-%COMP%], .dapp-sign__decoded-icon--unknown[_ngcontent-%COMP%] {\n  background: rgba(255, 87, 33, 0.08);\n  color: var(--zns-theme-secondary, #ff5721);\n}\n.dapp-sign__decoded-icon--erc721_transfer[_ngcontent-%COMP%] {\n  background: rgba(168, 85, 247, 0.1);\n  color: #a855f7;\n}\n.dapp-sign__decoded-description[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  font-weight: 500;\n  color: var(--zns-theme-text, #181818);\n  margin: 0;\n  line-height: 1.4;\n}\n.dapp-sign__details[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  background: var(--zns-theme-card, #ffffff);\n  border-radius: 14px;\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  overflow: hidden;\n}\n.dapp-sign__detail-row[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 12px 16px;\n  min-height: 44px;\n}\n.dapp-sign__detail-row[_ngcontent-%COMP%]    + .dapp-sign__detail-row[_ngcontent-%COMP%] {\n  border-top: 1px solid var(--zns-theme-card-border, #eeedf1);\n}\n.dapp-sign__detail-label[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 13px;\n  color: var(--zns-theme-text-secondary, #73777f);\n  flex-shrink: 0;\n}\n.dapp-sign__detail-value[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n  text-align: right;\n  max-width: 60%;\n}\n.dapp-sign__detail-value--mono[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-monospace-family, \"Courier New\", Courier, monospace);\n  font-size: 12px;\n  font-weight: 500;\n}\n.dapp-sign__detail-value--truncate[_ngcontent-%COMP%] {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dapp-sign__warning[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 10px;\n  padding: 12px 14px;\n  border-radius: 12px;\n  background: rgba(222, 104, 0, 0.06);\n  border: 1px solid rgba(222, 104, 0, 0.15);\n}\n.dapp-sign__warning[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  font-size: 18px;\n  color: var(--zns-theme-warning, #de6800);\n  flex-shrink: 0;\n  margin-top: 1px;\n}\n.dapp-sign__warning[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 13px;\n  color: var(--zns-theme-warning, #de6800);\n  line-height: 1.5;\n  margin: 0;\n}\n.dapp-sign__section-label[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--zns-theme-text-secondary, #73777f);\n  margin: 0;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.dapp-sign__message-box[_ngcontent-%COMP%] {\n  background: var(--zns-theme-card, #ffffff);\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: 14px;\n  padding: 14px 16px;\n  max-height: 200px;\n  overflow-y: auto;\n}\n.dapp-sign__message-text[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-monospace-family, \"Courier New\", Courier, monospace);\n  font-size: 12px;\n  color: var(--zns-theme-text, #181818);\n  white-space: pre-wrap;\n  word-break: break-all;\n  margin: 0;\n  line-height: 1.6;\n}\n.dapp-sign__auth[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  padding: 0 24px 8px;\n}\n.dapp-sign__password-field[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  background: var(--zns-theme-card, #ffffff);\n  border: 1.5px solid var(--zns-theme-card-border, #eeedf1);\n  border-radius: 14px;\n  height: 48px;\n  overflow: hidden;\n  transition: border-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.dapp-sign__password-field[_ngcontent-%COMP%]:focus-within {\n  border-color: var(--zns-theme-secondary, #ff5721);\n}\n.dapp-sign__password-input[_ngcontent-%COMP%] {\n  flex: 1;\n  border: none;\n  background: none;\n  padding: 0 16px;\n  height: 100%;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 14px;\n  color: var(--zns-theme-text, #181818);\n  outline: none;\n}\n.dapp-sign__password-input[_ngcontent-%COMP%]::placeholder {\n  color: var(--zns-theme-text-muted, #96939e);\n}\n.dapp-sign__password-toggle[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 44px;\n  height: 100%;\n  background: none;\n  border: none;\n  cursor: pointer;\n  color: var(--zns-theme-text-secondary, #73777f);\n  flex-shrink: 0;\n}\n.dapp-sign__password-toggle[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  font-size: 20px;\n}\n.dapp-sign__password-toggle[_ngcontent-%COMP%]:hover {\n  color: var(--zns-theme-text, #181818);\n}\n.dapp-sign__pin-container[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  width: 100%;\n  justify-content: center;\n}\n.dapp-sign__pin-inputs[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n}\n.dapp-sign__pin-input[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 48px;\n  padding: 8px 4px;\n  background: var(--zns-theme-card, #ffffff);\n  border-radius: 12px;\n  border: 1.5px solid var(--zns-theme-card-border, #eeedf1);\n  text-align: center;\n  color: var(--zns-theme-text, #181818);\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 18px;\n  font-weight: 600;\n  outline: none;\n  transition: border-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.dapp-sign__pin-input[_ngcontent-%COMP%]:focus {\n  border-color: var(--zns-theme-secondary, #ff5721);\n}\n.dapp-sign__pin-input[_ngcontent-%COMP%]::placeholder {\n  color: transparent;\n}\n.dapp-sign__error[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 10px 14px;\n  border-radius: 12px;\n  background: rgba(220, 54, 46, 0.06);\n  border: 1px solid rgba(220, 54, 46, 0.15);\n}\n.dapp-sign__error[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  font-size: 18px;\n  color: var(--zns-theme-error, #dc362e);\n  flex-shrink: 0;\n}\n.dapp-sign__error[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 13px;\n  color: var(--zns-theme-error, #dc362e);\n  margin: 0;\n}\n.dapp-sign__biometric-notice[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 12px 14px;\n  border-radius: 12px;\n  background: rgba(57, 152, 211, 0.06);\n  border: 1px solid rgba(57, 152, 211, 0.15);\n}\n.dapp-sign__biometric-notice[_ngcontent-%COMP%]   .material-symbols-outlined[_ngcontent-%COMP%] {\n  font-size: 22px;\n  color: #3998d3;\n  flex-shrink: 0;\n}\n.dapp-sign__biometric-notice[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 13px;\n  color: var(--zns-theme-text-secondary, #73777f);\n  margin: 0;\n  line-height: 1.4;\n}\n.dapp-sign__actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  padding: 16px 24px 24px;\n  border-top: 1px solid var(--zns-theme-card-border, #eeedf1);\n}\n.dapp-sign__btn[_ngcontent-%COMP%] {\n  flex: 1;\n  height: 48px;\n  border-radius: 14px;\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  font-size: 15px;\n  font-weight: 600;\n  cursor: pointer;\n  transition: all 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n  border: none;\n  letter-spacing: 0.2px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 8px;\n}\n.dapp-sign__btn--cancel[_ngcontent-%COMP%] {\n  background: var(--zns-theme-card, #ffffff);\n  color: var(--zns-theme-text, #181818);\n  border: 1px solid var(--zns-theme-card-border, #eeedf1);\n}\n.dapp-sign__btn--cancel[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: var(--zns-theme-card-border, #eeedf1);\n}\n.dapp-sign__btn--confirm[_ngcontent-%COMP%] {\n  background: var(--zns-theme-button, #181818);\n  color: var(--zns-theme-button-text, #ffffff);\n}\n.dapp-sign__btn--confirm[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: var(--zns-theme-button-hover, #ff5721);\n}\n.dapp-sign__btn--confirm[_ngcontent-%COMP%]:disabled {\n  opacity: 0.4;\n  cursor: not-allowed;\n}\n\n@keyframes _ngcontent-%COMP%_slideUp {\n  from {\n    opacity: 0;\n    transform: translateY(12px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZGFwcC1zaWduL2RhcHAtc2lnbi5jb21wb25lbnQuc2NzcyIsIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX3ZhcmlhYmxlcy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxZQUFBO0VBQ0EsYUFBQTtBQURKOztBQUlBO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsV0FBQTtFQUNBLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSwwRENhdUI7RURadkIsbUJBQUE7RUFDQSx1REFBQTtFQUNBLG1IQUFBO0VBQ0EsZ0JBQUE7RUFDQSx1REFBQTtBQURKO0FBS0k7RUFDSSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxtQkFBQTtFQUNBLFFBQUE7RUFDQSx1QkFBQTtBQUhSO0FBTUk7RUFDSSxXQUFBO0VBQ0EsWUFBQTtFQUNBLG1CQUFBO0VBQ0EsMENDWUk7RURYSix1REFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtFQUNBLGlFQUFBO0FBSlI7QUFNUTtFQUNJLFdBQUE7RUFDQSxZQUFBO0VBQ0EsbUJBQUE7QUFKWjtBQVFJO0VBQ0ksOEVDN0JXO0VEOEJYLGVBQUE7RUFDQSxnQkFBQTtFQUNBLDBDQ3ZEUztBRGlEakI7QUFTSTtFQUNJLHVFQ3JDVTtFRHNDVixlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQ0NqQ0k7RURrQ0osU0FBQTtFQUNBLGtCQUFBO0FBUFI7QUFVSTtFQUNJLHVFQzlDVTtFRCtDVixlQUFBO0VBQ0EsK0NDdkNhO0VEd0NiLFNBQUE7RUFDQSxrQkFBQTtFQUNBLHFCQUFBO0FBUlI7QUFhSTtFQUNJLGNBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxvQkFBQTtFQUNBLFNBQUE7RUFDQSxnQkFBQTtBQVhSO0FBZ0JJO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtFQUNBLGtCQUFBO0VBQ0EsbUJBQUE7RUFDQSwwQ0NoREk7RURpREosdURBQUE7QUFkUjtBQWlCSTtFQUNJLFdBQUE7RUFDQSxZQUFBO0VBQ0EsbUJBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLGNBQUE7QUFmUjtBQWlCUTtFQUVJLG1DQUFBO0VBQ0EsY0NoR0w7QURnRlA7QUFtQlE7RUFFSSxrQ0FBQTtFQUNBLHdDQzFHRjtBRHdGVjtBQXFCUTtFQUVJLG1DQUFBO0VBQ0EsMENDM0hLO0FEdUdqQjtBQXVCUTtFQUNJLG1DQUFBO0VBQ0EsY0FBQTtBQXJCWjtBQXlCSTtFQUNJLHVFQy9HVTtFRGdIVixlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQ0MzR0k7RUQ0R0osU0FBQTtFQUNBLGdCQUFBO0FBdkJSO0FBNEJJO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsMENDbkdJO0VEb0dKLG1CQUFBO0VBQ0EsdURBQUE7RUFDQSxnQkFBQTtBQTFCUjtBQTZCSTtFQUNJLGFBQUE7RUFDQSw4QkFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtBQTNCUjtBQTZCUTtFQUNJLDJEQUFBO0FBM0JaO0FBK0JJO0VBQ0ksdUVDL0lVO0VEZ0pWLGVBQUE7RUFDQSwrQ0N4SWE7RUR5SWIsY0FBQTtBQTdCUjtBQWdDSTtFQUNJLHVFQ3RKVTtFRHVKVixlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQ0NsSkk7RURtSkosaUJBQUE7RUFDQSxjQUFBO0FBOUJSO0FBZ0NRO0VBQ0ksaUZDNUpXO0VENkpYLGVBQUE7RUFDQSxnQkFBQTtBQTlCWjtBQWlDUTtFQUNJLGdCQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQkFBQTtBQS9CWjtBQXFDSTtFQUNJLGFBQUE7RUFDQSx1QkFBQTtFQUNBLFNBQUE7RUFDQSxrQkFBQTtFQUNBLG1CQUFBO0VBQ0EsbUNBQUE7RUFDQSx5Q0FBQTtBQW5DUjtBQXFDUTtFQUNJLGVBQUE7RUFDQSx3Q0NsTUY7RURtTUUsY0FBQTtFQUNBLGVBQUE7QUFuQ1o7QUFzQ1E7RUFDSSx1RUM3TE07RUQ4TE4sZUFBQTtFQUNBLHdDQzFNRjtFRDJNRSxnQkFBQTtFQUNBLFNBQUE7QUFwQ1o7QUEwQ0k7RUFDSSx1RUN4TVU7RUR5TVYsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsK0NDbE1hO0VEbU1iLFNBQUE7RUFDQSx5QkFBQTtFQUNBLHFCQUFBO0FBeENSO0FBMkNJO0VBQ0ksMENDekxJO0VEMExKLHVEQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLGlCQUFBO0VBQ0EsZ0JBQUE7QUF6Q1I7QUE0Q0k7RUFDSSxpRkN6TmU7RUQwTmYsZUFBQTtFQUNBLHFDQ3ROSTtFRHVOSixxQkFBQTtFQUNBLHFCQUFBO0VBQ0EsU0FBQTtFQUNBLGdCQUFBO0FBMUNSO0FBK0NJO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsU0FBQTtFQUNBLG1CQUFBO0FBN0NSO0FBZ0RJO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsMENDdk5JO0VEd05KLHlEQUFBO0VBQ0EsbUJBQUE7RUFDQSxZQUFBO0VBQ0EsZ0JBQUE7RUFDQSw2REFBQTtBQTlDUjtBQWdEUTtFQUNJLGlEQzlRSztBRGdPakI7QUFrREk7RUFDSSxPQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0VBQ0EsZUFBQTtFQUNBLFlBQUE7RUFDQSx1RUNsUVU7RURtUVYsZUFBQTtFQUNBLHFDQzdQSTtFRDhQSixhQUFBO0FBaERSO0FBa0RRO0VBQ0ksMkNDaFFLO0FEZ05qQjtBQW9ESTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxnQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsK0NDNVFhO0VENlFiLGNBQUE7QUFsRFI7QUFvRFE7RUFDSSxlQUFBO0FBbERaO0FBcURRO0VBQ0kscUNDdFJBO0FEbU9aO0FBdURJO0VBQ0ksYUFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtFQUNBLFdBQUE7RUFDQSx1QkFBQTtBQXJEUjtBQXdESTtFQUNJLGFBQUE7RUFDQSxRQUFBO0FBdERSO0FBeURJO0VBQ0ksV0FBQTtFQUNBLFlBQUE7RUFDQSxnQkFBQTtFQUNBLDBDQ3pSSTtFRDBSSixtQkFBQTtFQUNBLHlEQUFBO0VBQ0Esa0JBQUE7RUFDQSxxQ0MvU0k7RURnVEosdUVDdlRVO0VEd1RWLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGFBQUE7RUFDQSw2REFBQTtBQXZEUjtBQXlEUTtFQUNJLGlEQ3BWSztBRDZSakI7QUEwRFE7RUFDSSxrQkFBQTtBQXhEWjtBQThESTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFFBQUE7RUFDQSxrQkFBQTtFQUNBLG1CQUFBO0VBQ0EsbUNBQUE7RUFDQSx5Q0FBQTtBQTVEUjtBQThEUTtFQUNJLGVBQUE7RUFDQSxzQ0NsV0o7RURtV0ksY0FBQTtBQTVEWjtBQStEUTtFQUNJLHVFQ3hWTTtFRHlWTixlQUFBO0VBQ0Esc0NDeldKO0VEMFdJLFNBQUE7QUE3RFo7QUFpRUk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0VBQ0Esa0JBQUE7RUFDQSxtQkFBQTtFQUNBLG9DQUFBO0VBQ0EsMENBQUE7QUEvRFI7QUFpRVE7RUFDSSxlQUFBO0VBQ0EsY0NqWEw7RURrWEssY0FBQTtBQS9EWjtBQWtFUTtFQUNJLHVFQy9XTTtFRGdYTixlQUFBO0VBQ0EsK0NDeFdTO0VEeVdULFNBQUE7RUFDQSxnQkFBQTtBQWhFWjtBQXNFSTtFQUNJLGFBQUE7RUFDQSxTQUFBO0VBQ0EsdUJBQUE7RUFDQSwyREFBQTtBQXBFUjtBQXVFSTtFQUNJLE9BQUE7RUFDQSxZQUFBO0VBQ0EsbUJBQUE7RUFDQSx1RUNwWVU7RURxWVYsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsZUFBQTtFQUNBLG9EQUFBO0VBQ0EsWUFBQTtFQUNBLHFCQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxRQUFBO0FBckVSO0FBdUVRO0VBQ0ksMENDeFhBO0VEeVhBLHFDQzNZQTtFRDRZQSx1REFBQTtBQXJFWjtBQXVFWTtFQUNJLGlEQzVYRTtBRHVUbEI7QUF5RVE7RUFDSSw0Q0M3WUU7RUQ4WUYsNENDN1lNO0FEc1VsQjtBQXlFWTtFQUNJLGtEQy9ZRztBRHdVbkI7QUEwRVk7RUFDSSxZQUFBO0VBQ0EsbUJBQUE7QUF4RWhCOztBQThFQTtFQUNJO0lBQ0ksVUFBQTtJQUNBLDJCQUFBO0VBM0VOO0VBNkVFO0lBQ0ksVUFBQTtJQUNBLHdCQUFBO0VBM0VOO0FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJAdXNlIFwiLi4vLi4vc3R5bGVzL3ZhcmlhYmxlc1wiO1xuXG46aG9zdCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGZsZXgtZ3JvdzogMTtcbiAgICBwYWRkaW5nOiAyNHB4O1xufVxuXG4uZGFwcC1zaWduIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgbWF4LXdpZHRoOiA0MjBweDtcbiAgICBtaW4taGVpZ2h0OiA1MjBweDtcbiAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTtcbiAgICBib3JkZXItcmFkaXVzOiAyNHB4O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgIGJveC1zaGFkb3c6IDAgOHB4IDQwcHggdmFyaWFibGVzLiR0aGVtZVNoYWRvdywgMCAwIDAgMXB4IHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgYW5pbWF0aW9uOiBzbGlkZVVwIDAuM3MgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAvLyAtLS0tLS0tLS0tIEhlYWRlciAtLS0tLS0tLS0tXG5cbiAgICAmX19oZWFkZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IDZweDtcbiAgICAgICAgcGFkZGluZzogMjhweCAyNHB4IDE2cHg7XG4gICAgfVxuXG4gICAgJl9fc2l0ZS1pY29uIHtcbiAgICAgICAgd2lkdGg6IDQ4cHg7XG4gICAgICAgIGhlaWdodDogNDhweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTRweDtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogNHB4O1xuICAgICAgICBib3gtc2hhZG93OiAwIDJweCA4cHggdmFyaWFibGVzLiR0aGVtZVNoYWRvdztcblxuICAgICAgICBpbWcge1xuICAgICAgICAgICAgd2lkdGg6IDMycHg7XG4gICAgICAgICAgICBoZWlnaHQ6IDMycHg7XG4gICAgICAgICAgICBvYmplY3QtZml0OiBjb250YWluO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fc2l0ZS1pbml0aWFsIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVUaXRsZUZhbWlseTtcbiAgICAgICAgZm9udC1zaXplOiAyMHB4O1xuICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvcjtcbiAgICB9XG5cbiAgICAmX190aXRsZSB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC1zaXplOiAxN3B4O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuICAgICZfX2hvc3RuYW1lIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXNpemU6IDEzcHg7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgIHdvcmQtYnJlYWs6IGJyZWFrLWFsbDtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tIEJvZHkgLS0tLS0tLS0tLVxuXG4gICAgJl9fYm9keSB7XG4gICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBwYWRkaW5nOiAwIDI0cHggMTZweDtcbiAgICAgICAgZ2FwOiAxNHB4O1xuICAgICAgICBvdmVyZmxvdy15OiBhdXRvO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0gRGVjb2RlZCBBY3Rpb24gLS0tLS0tLS0tLVxuXG4gICAgJl9fZGVjb2RlZCB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogMTRweDtcbiAgICAgICAgcGFkZGluZzogMTRweCAxNnB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNHB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgfVxuXG4gICAgJl9fZGVjb2RlZC1pY29uIHtcbiAgICAgICAgd2lkdGg6IDQ0cHg7XG4gICAgICAgIGhlaWdodDogNDRweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuXG4gICAgICAgICYtLW5hdGl2ZV90cmFuc2ZlcixcbiAgICAgICAgJi0tZXJjMjBfdHJhbnNmZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSg1NywgMTUyLCAyMTEsIDAuMSk7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRpbmZvO1xuICAgICAgICB9XG5cbiAgICAgICAgJi0tZXJjMjBfYXBwcm92ZSxcbiAgICAgICAgJi0tZXJjNzIxX2FwcHJvdmVfYWxsIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjIyLCAxMDQsIDAsIDAuMSk7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR3YXJuaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgJi0tY29udHJhY3RfaW50ZXJhY3Rpb24sXG4gICAgICAgICYtLXVua25vd24ge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDg3LCAzMywgMC4wOCk7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgICYtLWVyYzcyMV90cmFuc2ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDE2OCwgODUsIDI0NywgMC4xKTtcbiAgICAgICAgICAgIGNvbG9yOiAjYTg1NWY3O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fZGVjb2RlZC1kZXNjcmlwdGlvbiB7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDEuNDtcbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tIERldGFpbHMgLS0tLS0tLS0tLVxuXG4gICAgJl9fZGV0YWlscyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNHB4O1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICB9XG5cbiAgICAmX19kZXRhaWwtcm93IHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBwYWRkaW5nOiAxMnB4IDE2cHg7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDQ0cHg7XG5cbiAgICAgICAgJiArICYge1xuICAgICAgICAgICAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVDYXJkQm9yZGVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fZGV0YWlsLWxhYmVsIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXNpemU6IDEzcHg7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgZmxleC1zaHJpbms6IDA7XG4gICAgfVxuXG4gICAgJl9fZGV0YWlsLXZhbHVlIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXNpemU6IDEzcHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgdGV4dC1hbGlnbjogcmlnaHQ7XG4gICAgICAgIG1heC13aWR0aDogNjAlO1xuXG4gICAgICAgICYtLW1vbm8ge1xuICAgICAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVNb25vc3BhY2VGYW1pbHk7XG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNTAwO1xuICAgICAgICB9XG5cbiAgICAgICAgJi0tdHJ1bmNhdGUge1xuICAgICAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuICAgICAgICAgICAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0gV2FybmluZyAtLS0tLS0tLS0tXG5cbiAgICAmX193YXJuaW5nIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gICAgICAgIGdhcDogMTBweDtcbiAgICAgICAgcGFkZGluZzogMTJweCAxNHB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiByZ2JhKDIyMiwgMTA0LCAwLCAwLjA2KTtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyMjIsIDEwNCwgMCwgMC4xNSk7XG5cbiAgICAgICAgLm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQge1xuICAgICAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kd2FybmluZztcbiAgICAgICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogMXB4O1xuICAgICAgICB9XG5cbiAgICAgICAgcCB7XG4gICAgICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgICAgICBmb250LXNpemU6IDEzcHg7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR3YXJuaW5nO1xuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDEuNTtcbiAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0gTWVzc2FnZSAtLS0tLS0tLS0tXG5cbiAgICAmX19zZWN0aW9uLWxhYmVsIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVCb2R5RmFtaWx5O1xuICAgICAgICBmb250LXNpemU6IDEycHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dFNlY29uZGFyeTtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC41cHg7XG4gICAgfVxuXG4gICAgJl9fbWVzc2FnZS1ib3gge1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XG4gICAgICAgIHBhZGRpbmc6IDE0cHggMTZweDtcbiAgICAgICAgbWF4LWhlaWdodDogMjAwcHg7XG4gICAgICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgfVxuXG4gICAgJl9fbWVzc2FnZS10ZXh0IHtcbiAgICAgICAgZm9udC1mYW1pbHk6IHZhcmlhYmxlcy4kdGhlbWVNb25vc3BhY2VGYW1pbHk7XG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICB3aGl0ZS1zcGFjZTogcHJlLXdyYXA7XG4gICAgICAgIHdvcmQtYnJlYWs6IGJyZWFrLWFsbDtcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICBsaW5lLWhlaWdodDogMS42O1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0gQXV0aCAtLS0tLS0tLS0tXG5cbiAgICAmX19hdXRoIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiAxMHB4O1xuICAgICAgICBwYWRkaW5nOiAwIDI0cHggOHB4O1xuICAgIH1cblxuICAgICZfX3Bhc3N3b3JkLWZpZWxkIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgIGJvcmRlcjogMS41cHggc29saWQgdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XG4gICAgICAgIGhlaWdodDogNDhweDtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgdHJhbnNpdGlvbjogYm9yZGVyLWNvbG9yIDAuMnMgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjpmb2N1cy13aXRoaW4ge1xuICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiB2YXJpYWJsZXMuJHNlY29uZGFyeUNvbG9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fcGFzc3dvcmQtaW5wdXQge1xuICAgICAgICBmbGV4OiAxO1xuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gICAgICAgIHBhZGRpbmc6IDAgMTZweDtcbiAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBvdXRsaW5lOiBub25lO1xuXG4gICAgICAgICY6OnBsYWNlaG9sZGVyIHtcbiAgICAgICAgICAgIGNvbG9yOiB2YXJpYWJsZXMuJHRoZW1lVGV4dE11dGVkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fcGFzc3dvcmQtdG9nZ2xlIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIHdpZHRoOiA0NHB4O1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuXG4gICAgICAgIC5tYXRlcmlhbC1zeW1ib2xzLW91dGxpbmVkIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMjBweDtcbiAgICAgICAgfVxuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fcGluLWNvbnRhaW5lciB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogMTJweDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIH1cblxuICAgICZfX3Bpbi1pbnB1dHMge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBnYXA6IDhweDtcbiAgICB9XG5cbiAgICAmX19waW4taW5wdXQge1xuICAgICAgICB3aWR0aDogNDBweDtcbiAgICAgICAgaGVpZ2h0OiA0OHB4O1xuICAgICAgICBwYWRkaW5nOiA4cHggNHB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgYm9yZGVyOiAxLjVweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIGZvbnQtZmFtaWx5OiB2YXJpYWJsZXMuJHRoZW1lQm9keUZhbWlseTtcbiAgICAgICAgZm9udC1zaXplOiAxOHB4O1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICB0cmFuc2l0aW9uOiBib3JkZXItY29sb3IgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmZvY3VzIHtcbiAgICAgICAgICAgIGJvcmRlci1jb2xvcjogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgICY6OnBsYWNlaG9sZGVyIHtcbiAgICAgICAgICAgIGNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbiAgICAmX19lcnJvciB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogOHB4O1xuICAgICAgICBwYWRkaW5nOiAxMHB4IDE0cHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjIwLCA1NCwgNDYsIDAuMDYpO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDIyMCwgNTQsIDQ2LCAwLjE1KTtcblxuICAgICAgICAubWF0ZXJpYWwtc3ltYm9scy1vdXRsaW5lZCB7XG4gICAgICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvcjtcbiAgICAgICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcCB7XG4gICAgICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgICAgICBmb250LXNpemU6IDEzcHg7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiRlcnJvcjtcbiAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2Jpb21ldHJpYy1ub3RpY2Uge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IDEwcHg7XG4gICAgICAgIHBhZGRpbmc6IDEycHggMTRweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgYmFja2dyb3VuZDogcmdiYSg1NywgMTUyLCAyMTEsIDAuMDYpO1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDU3LCAxNTIsIDIxMSwgMC4xNSk7XG5cbiAgICAgICAgLm1hdGVyaWFsLXN5bWJvbHMtb3V0bGluZWQge1xuICAgICAgICAgICAgZm9udC1zaXplOiAyMnB4O1xuICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kaW5mbztcbiAgICAgICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgICAgICB9XG5cbiAgICAgICAgcCB7XG4gICAgICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgICAgICBmb250LXNpemU6IDEzcHg7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHRTZWNvbmRhcnk7XG4gICAgICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMS40O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLSBBY3Rpb25zIC0tLS0tLS0tLS1cblxuICAgICZfX2FjdGlvbnMge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBnYXA6IDEycHg7XG4gICAgICAgIHBhZGRpbmc6IDE2cHggMjRweCAyNHB4O1xuICAgICAgICBib3JkZXItdG9wOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgfVxuXG4gICAgJl9fYnRuIHtcbiAgICAgICAgZmxleDogMTtcbiAgICAgICAgaGVpZ2h0OiA0OHB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNHB4O1xuICAgICAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgICAgIGZvbnQtc2l6ZTogMTVweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBsZXR0ZXItc3BhY2luZzogMC4ycHg7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcblxuICAgICAgICAmLS1jYW5jZWwge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQ2FyZEJvcmRlcjtcblxuICAgICAgICAgICAgJjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmRCb3JkZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmLS1jb25maXJtIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b247XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZUJ1dHRvblRleHQ7XG5cbiAgICAgICAgICAgICY6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IHZhcmlhYmxlcy4kdGhlbWVCdXR0b25Ib3ZlcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJjpkaXNhYmxlZCB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMC40O1xuICAgICAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBrZXlmcmFtZXMgc2xpZGVVcCB7XG4gICAgZnJvbSB7XG4gICAgICAgIG9wYWNpdHk6IDA7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgxMnB4KTtcbiAgICB9XG4gICAgdG8ge1xuICAgICAgICBvcGFjaXR5OiAxO1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gICAgfVxufVxuIiwiJHByaW1hcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXByaW1hcnksICMxODE4MTgpO1xuJHByaW1hcnlMaWdodDogI2RhZGRmYTtcbiRzZWNvbmRhcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXNlY29uZGFyeSwgI2ZmNTcyMSk7XG4kc2Vjb25kYXJ5Q29sb3JMaWdodDogI2Y2ZTVlMDtcblxuJGNvcnJlY3Q6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLCAjMWVhNDQ2KTtcbiRjb3JyZWN0RGFyazogIzBmNTIyMztcbiRjb3JyZWN0TGlnaHQ6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLXRleHQsICNlN2Y4ZWQpO1xuXG4kZXJyb3I6IHZhcigtLXpucy10aGVtZS1lcnJvciwgI2RjMzYyZSk7XG4kZXJyb3JEYXJrOiAjNjAxNDEwO1xuJGVycm9yTGlnaHQ6IHZhcigtLXpucy10aGVtZS1lcnJvci10ZXh0LCAjZmNlZWVlKTtcblxuJHdhcm5pbmc6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLCAjZGU2ODAwKTtcbiR3YXJuaW5nRGFyazogIzRhMjEwYTtcbiR3YXJuaW5nTGlnaHQ6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLXRleHQsICNmZmVlZTkpO1xuXG4kaW5mbzogIzM5OThkMztcbiRpbmZvRGFyazogIzAwNGE3NztcbiRpbmZvTGlnaHQ6ICNlY2YzZmU7XG5cbiRibGFjazogIzE4MTgxODtcbiR3aGl0ZTogI2ZmZmZmZjtcblxuJHRoZW1lQm9keUZhbWlseTogdmFyKC0tem5zLXRoZW1lLWJvZHktZmFtaWx5LCBcIlBvcHBpbnNcIiwgQXJpYWwsIHNhbnMtc2VyaWYpO1xuJHRoZW1lVGl0bGVGYW1pbHk6IHZhcigtLXpucy10aGVtZS10aXRsZS1mYW1pbHksIFwiTWVuZGFcIiwgXCJBcmlhbCBCbGFja1wiLCBzYW5zLXNlcmlmKTtcbiR0aGVtZU1vbm9zcGFjZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLW1vbm9zcGFjZS1mYW1pbHksIFwiQ291cmllciBOZXdcIiwgQ291cmllciwgbW9ub3NwYWNlKTtcblxuJHRoZW1lQmFja2dyb3VuZDogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQsICNmZmZmZmYpO1xuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQtc2Vjb25kYXJ5LCAjZjlmOWZjKTtcblxuJHRoZW1lVGV4dDogdmFyKC0tem5zLXRoZW1lLXRleHQsICMxODE4MTgpO1xuJHRoZW1lVGV4dE11dGVkOiB2YXIoLS16bnMtdGhlbWUtdGV4dC1tdXRlZCwgIzk2OTM5ZSk7XG4kdGhlbWVUZXh0U2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtdGV4dC1zZWNvbmRhcnksICM3Mzc3N2YpO1xuXG4kdGhlbWVIZWFkZXI6IHZhcigtLXpucy10aGVtZS1oZWFkZXIsICMxODE4MTgpO1xuJHRoZW1lSGVhZGVyVGV4dDogdmFyKC0tem5zLXRoZW1lLWhlYWRlci10ZXh0LCAjZmZmZmZmKTtcblxuJHRoZW1lQnV0dG9uOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLCAjMTgxODE4KTtcbiR0aGVtZUJ1dHRvblRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tdGV4dCwgI2ZmZmZmZik7XG4kdGhlbWVCdXR0b25Ib3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1ob3ZlciwgI2ZmNTcyMSk7XG5cbiR0aGVtZUJ1dHRvblNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnksICNlOWVjZWYpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktdGV4dCwgIzQ5NTA1Nyk7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktaG92ZXIsICNlOWVjZWYpO1xuXG4kdGhlbWVCb3JkZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXIsICNlM2UzZTMpO1xuJHRoZW1lQm9yZGVySG92ZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXItaG92ZXIsICNjM2M2Y2YpO1xuXG4kdGhlbWVDYXJkOiB2YXIoLS16bnMtdGhlbWUtY2FyZCwgI2ZmZmZmZik7XG4kdGhlbWVDYXJkQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtY2FyZC1ib3JkZXIsICNlZWVkZjEpO1xuXG4kdGhlbWVTaGFkb3c6IHZhcigtLXpucy10aGVtZS1zaGFkb3csIHJnYmEoMCwgMCwgMCwgMC4xKSk7XG5cbiRzbW9vdGhCZXppZXI6IGN1YmljLWJlemllcigwLjI1LCAwLjQsIDAuNywgMSk7XG5cbiRtYXhFeHRyYVNtYWxsOiA1OTVweDtcbiRtaW5TbWFsbDogNjAwcHg7XG4kbWVkaXVtOiA3NjhweDtcbiRsYXJnZTogODg5cHg7XG4kY29tcHV0ZXJzOiAxMjAwcHg7XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ },

/***/ 23023
/*!************************************************!*\
  !*** ./src/app/services/tx-decoder.service.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TxDecoderService: () => (/* binding */ TxDecoderService)
/* harmony export */ });
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ethers */ 25984);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ethers */ 997);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ethers */ 19265);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ethers */ 27471);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 34205);


const ERC20_SIGNATURES = {
  "0xa9059cbb": {
    name: "transfer",
    inputs: ["address", "uint256"]
  },
  "0x095ea7b3": {
    name: "approve",
    inputs: ["address", "uint256"]
  },
  "0x23b872dd": {
    name: "transferFrom",
    inputs: ["address", "address", "uint256"]
  }
};
const ERC721_SIGNATURES = {
  "0x42842e0e": {
    name: "safeTransferFrom",
    inputs: ["address", "address", "uint256"]
  },
  "0x23b872dd": {
    name: "transferFrom",
    inputs: ["address", "address", "uint256"]
  },
  "0xa22cb465": {
    name: "setApprovalForAll",
    inputs: ["address", "bool"]
  },
  "0x095ea7b3": {
    name: "approve",
    inputs: ["address", "uint256"]
  }
};
// Known DEX swap selectors -- when we can't decode full args we still show
// a meaningful protocol name and action rather than raw hex
const DEX_SWAP_SELECTORS = {
  // Uniswap V2 / forks (Pangolin, Trader Joe V1, Sushi)
  "0x38ed1739": {
    protocol: "Uniswap V2",
    action: "Swap exact tokens for tokens"
  },
  "0x7ff36ab5": {
    protocol: "Uniswap V2",
    action: "Swap ETH for exact tokens"
  },
  "0x18cbafe5": {
    protocol: "Uniswap V2",
    action: "Swap exact tokens for ETH"
  },
  "0x8803dbee": {
    protocol: "Uniswap V2",
    action: "Swap tokens for exact tokens"
  },
  "0x4a25d94a": {
    protocol: "Uniswap V2",
    action: "Swap tokens for exact ETH"
  },
  "0x02751cec": {
    protocol: "Uniswap V2",
    action: "Swap ETH for tokens"
  },
  "0xfb3bdb41": {
    protocol: "Uniswap V2",
    action: "Swap ETH for exact tokens"
  },
  // Uniswap V3
  "0x414bf389": {
    protocol: "Uniswap V3",
    action: "Swap (exact input single hop)"
  },
  "0xc04b8d59": {
    protocol: "Uniswap V3",
    action: "Swap (exact input multi-hop)"
  },
  "0xdb3e2198": {
    protocol: "Uniswap V3",
    action: "Swap (exact output single hop)"
  },
  "0xf28c0498": {
    protocol: "Uniswap V3",
    action: "Swap (exact output multi-hop)"
  },
  "0xac9650d8": {
    protocol: "Uniswap V3",
    action: "Token swap (multicall)"
  },
  "0x5ae401dc": {
    protocol: "Uniswap V3",
    action: "Token swap (multicall)"
  },
  "0x1f0464d1": {
    protocol: "Uniswap V3",
    action: "Token swap (multicall)"
  },
  // KyberSwap
  "0xef2ba631": {
    protocol: "KyberSwap",
    action: "Token swap",
    srcOffset: 1,
    dstOffset: 2
  },
  "0xe21fd0e9": {
    protocol: "KyberSwap",
    action: "Token swap",
    srcOffset: 1,
    dstOffset: 2
  },
  "0x7f2e2eed": {
    protocol: "KyberSwap",
    action: "Token swap",
    srcOffset: 1,
    dstOffset: 2
  },
  "0xaf7a5143": {
    protocol: "KyberSwap",
    action: "Token swap (aggregated)"
  },
  // 1inch
  "0x12aa3caf": {
    protocol: "1inch",
    action: "Token swap",
    srcOffset: 1,
    dstOffset: 2
  },
  "0xe449022e": {
    protocol: "1inch",
    action: "Token swap via Uniswap V3",
    srcOffset: 1,
    dstOffset: 2
  },
  "0x0502b1c5": {
    protocol: "1inch",
    action: "Token swap via Uniswap",
    srcOffset: 1,
    dstOffset: 2
  },
  "0x2e95b6c8": {
    protocol: "1inch",
    action: "Token swap",
    srcOffset: 1,
    dstOffset: 2
  },
  // Trader Joe V2 (Avalanche)
  "0x9a5f6c15": {
    protocol: "Trader Joe",
    action: "Token swap"
  },
  "0x65b9ef95": {
    protocol: "Trader Joe",
    action: "Swap exact tokens for tokens"
  },
  // ParaSwap
  "0x54e3f31b": {
    protocol: "ParaSwap",
    action: "Token swap"
  },
  "0xa94e78ef": {
    protocol: "ParaSwap",
    action: "Token swap"
  },
  // Curve
  "0x3df02124": {
    protocol: "Curve",
    action: "Token swap"
  },
  "0xa6417ed6": {
    protocol: "Curve",
    action: "Token swap"
  },
  // Generic wrappers
  "0xd0e30db0": {
    protocol: "WETH",
    action: "Wrap ETH"
  },
  "0x2e1a7d4d": {
    protocol: "WETH",
    action: "Unwrap to ETH"
  }
};
// Known top tokens mapping to symbols (primarily Avalanche C-Chain & mainnet)
const KNOWN_TOKENS = {
  // Avalanche
  "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e": "USDC",
  "0xa7d7079b0fe9d780e1444d31013ca0121172da0c": "USDC.e",
  "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7": "USDT",
  "0xc7198437980c041c805a1edcba50c1ce5db95118": "USDT.e",
  "0xd586e7f844cea2f87f50152665bcbc2c279d8d70": "DAI.e",
  "0x50b7545627a5162f802cb59afbc5e0d4c88ce8cd": "BTC.b",
  "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7": "WAVAX",
  "0x152b9d0fdc40c096757f570a51e494bd4b943e50": "BTC.b",
  "0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab": "WETH.e",
  "0x120ad3e5a7c7963d8df5a11da06a246835de6987": "SAVAX",
  "0xd00ae08403b9bbb9124bb305c09058e32c39a48c": "JOE",
  // Base/Mainnet/Arbitrum common
  "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": "USDC (Base)",
  "0xaf88d065e77c8cc2239327c5edb3a432268e5831": "USDC (Arb)",
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": "WBTC (Mainnet)",
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "USDC (Mainnet)",
  "0xdac17f958d2ee523a2206206994597c13d831ec7": "USDT (Mainnet)",
  // Identity/Native representations
  "0x0000000000000000000000000000000000000000": "AVAX",
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": "AVAX"
};
const KNOWN_FUNCTION_FRAGMENTS = ["function transfer(address to, uint256 amount)", "function approve(address spender, uint256 amount)", "function transferFrom(address from, address to, uint256 amount)", "function safeTransferFrom(address from, address to, uint256 tokenId)", "function safeTransferFrom(address from, address to, uint256 tokenId, bytes data)", "function setApprovalForAll(address operator, bool approved)", "function mint(address to, string uri)", "function batchMint(address to, string[] uris)", "function listItem(address nftAddress, uint256 tokenId, uint256 price)", "function buyItem(address nftAddress, uint256 tokenId)", "function makeOffer(address nftAddress, uint256 tokenId)", "function acceptOffer(address nftAddress, uint256 tokenId, address offerer)", "function cancelListing(address nftAddress, uint256 tokenId)", "function createCollection(string name, string symbol, uint256 maxSupply)",
// Uniswap V2 style
"function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)", "function swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)", "function swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)", "function swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline)",
// Uniswap V3 style (struct as tuple)
"function exactInputSingle(tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96) params) returns (uint256 amountOut)", "function exactInput(tuple(bytes path, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum) params) returns (uint256 amountOut)",
// Aggregators (Kyber, 1inch)
"function swap(tuple(address srcToken, address dstToken, address[] srcReceivers, uint256[] srcAmounts, address[] feeReceivers, uint256[] feeAmounts, address feeToken, uint256 amount, uint256 minReturnAmount, uint256 flags, bytes permit) desc, bytes callData)", "function swap(address caller, tuple(address srcToken, address dstToken, address srcReceiver, address dstReceiver, uint256 amount, uint256 minReturnAmount, uint256 flags) desc, bytes permit, bytes data)", "function multicall(bytes[] data)"];
class TxDecoderService {
  _iface;
  constructor() {
    this._iface = new ethers__WEBPACK_IMPORTED_MODULE_0__.Interface(KNOWN_FUNCTION_FRAGMENTS);
  }
  decode(to, data, value) {
    if (!data || data === "0x" || data.length < 10) {
      return this._decodeNativeTransfer(to, value);
    }
    const selector = data.slice(0, 10).toLowerCase();
    try {
      const parsed = this._iface.parseTransaction({
        data,
        value: value || "0"
      });
      if (parsed) {
        return this._formatParsedTransaction(parsed, to, value);
      }
    } catch {
      // Fall through to signature-based matching
    }
    return this._decodeBySelector(selector, data, to, value);
  }
  _decodeNativeTransfer(to, value) {
    const amount = value ? this._formatEther(value) : "0";
    return {
      type: "native_transfer",
      description: `Send ${amount} to ${this._shortAddr(to)}`,
      to,
      amount
    };
  }
  _formatParsedTransaction(parsed, to, value) {
    const name = parsed.name;
    switch (name) {
      case "transfer":
        return {
          type: "erc20_transfer",
          description: `Transfer tokens to ${this._shortAddr(String(parsed.args[0]))}`,
          to: String(parsed.args[0]),
          amount: String(parsed.args[1]),
          tokenAddress: to,
          functionName: name
        };
      case "approve":
        {
          const spender = String(parsed.args[0]);
          const amount = parsed.args[1];
          const isUnlimited = BigInt(String(amount)) >= BigInt("0xffffffffffffffffffffffffffffffff");
          const symbol = KNOWN_TOKENS[to.toLowerCase()] || this._shortAddr(to);
          const desc = isUnlimited ? `Approve unlimited spending of ${symbol}` : `Approve token spending of ${symbol}`;
          return {
            type: "erc20_approve",
            description: desc,
            spender,
            amount: String(amount),
            tokenAddress: to,
            tokenSymbol: KNOWN_TOKENS[to.toLowerCase()],
            functionName: name
          };
        }
      case "transferFrom":
      case "safeTransferFrom":
        return {
          type: "erc721_transfer",
          description: `Transfer NFT #${String(parsed.args[2])} to ${this._shortAddr(String(parsed.args[1]))}`,
          to: String(parsed.args[1]),
          tokenId: String(parsed.args[2]),
          tokenAddress: to,
          functionName: name
        };
      case "setApprovalForAll":
        {
          const operator = String(parsed.args[0]);
          const approved = Boolean(parsed.args[1]);
          return {
            type: "erc721_approve_all",
            description: approved ? `Approve ${this._shortAddr(operator)} to manage all your NFTs` : `Revoke NFT management for ${this._shortAddr(operator)}`,
            spender: operator,
            functionName: name
          };
        }
      case "mint":
        return {
          type: "contract_interaction",
          description: `Mint NFT to ${this._shortAddr(String(parsed.args[0]))}`,
          to: String(parsed.args[0]),
          functionName: name
        };
      case "listItem":
        return {
          type: "contract_interaction",
          description: `List NFT #${String(parsed.args[1])} for sale`,
          tokenId: String(parsed.args[1]),
          tokenAddress: String(parsed.args[0]),
          functionName: name
        };
      case "buyItem":
        return {
          type: "contract_interaction",
          description: `Buy NFT #${String(parsed.args[1])}`,
          tokenId: String(parsed.args[1]),
          tokenAddress: String(parsed.args[0]),
          amount: value ? this._formatEther(value) : undefined,
          functionName: name
        };
      case "makeOffer":
        return {
          type: "contract_interaction",
          description: `Make offer on NFT #${String(parsed.args[1])}`,
          tokenId: String(parsed.args[1]),
          tokenAddress: String(parsed.args[0]),
          amount: value ? this._formatEther(value) : undefined,
          functionName: name
        };
      case "acceptOffer":
        return {
          type: "contract_interaction",
          description: `Accept offer on NFT #${String(parsed.args[1])}`,
          tokenId: String(parsed.args[1]),
          tokenAddress: String(parsed.args[0]),
          functionName: name
        };
      case "cancelListing":
        return {
          type: "contract_interaction",
          description: `Cancel listing for NFT #${String(parsed.args[1])}`,
          tokenId: String(parsed.args[1]),
          tokenAddress: String(parsed.args[0]),
          functionName: name
        };
      case "createCollection":
        return {
          type: "contract_interaction",
          description: `Create collection "${String(parsed.args[0])}" (${String(parsed.args[1])})`,
          functionName: name
        };
      case "exactInputSingle":
      case "exactInput":
      case "exactOutputSingle":
      case "exactOutput":
        {
          const params = parsed.args.params || parsed.args[0];
          return {
            type: "swap",
            description: `Token swap via Uniswap V3`,
            to,
            functionName: name,
            srcToken: params?.tokenIn,
            dstToken: params?.tokenOut,
            amountIn: params?.amountIn ? String(params.amountIn) : undefined,
            amountOutMin: params?.amountOutMinimum ? String(params.amountOutMinimum) : undefined
          };
        }
      case "swapExactTokensForTokens":
      case "swapExactETHForTokens":
      case "swapExactTokensForETH":
      case "swapTokensForExactTokens":
      case "swapTokensForExactETH":
        {
          const path = parsed.args.path || parsed.args[2] || parsed.args[1];
          let srcToken, dstToken;
          if (Array.isArray(path) && path.length > 0) {
            srcToken = path[0];
            dstToken = path[path.length - 1];
          }
          const amountIn = parsed.args.amountIn || parsed.args.amountInMax || value;
          const amountOutMin = parsed.args.amountOutMin || parsed.args.amountOut;
          return {
            type: "swap",
            description: `Token swap`,
            to,
            functionName: name,
            srcToken,
            dstToken,
            amountIn: amountIn ? String(amountIn) : undefined,
            amountOutMin: amountOutMin ? String(amountOutMin) : undefined
          };
        }
      case "swap":
        {
          let srcToken, dstToken, amountIn, amountOutMin;
          // Try desc struct or direct args
          const desc = parsed.args.desc || parsed.args[0];
          if (desc?.srcToken) {
            srcToken = desc.srcToken;
            dstToken = desc.dstToken;
            amountIn = desc.amount;
            amountOutMin = desc.minReturnAmount;
          } else if (parsed.args[1]?.srcToken) {
            // 1inch has address caller as arg 0
            srcToken = parsed.args[1].srcToken;
            dstToken = parsed.args[1].dstToken;
            amountIn = parsed.args[1].amount;
            amountOutMin = parsed.args[1].minReturnAmount;
          }
          return {
            type: "swap",
            description: `Token swap`,
            to,
            functionName: name,
            srcToken,
            dstToken,
            srcTokenSymbol: srcToken && KNOWN_TOKENS[String(srcToken).toLowerCase()],
            dstTokenSymbol: dstToken && KNOWN_TOKENS[String(dstToken).toLowerCase()],
            amountIn: amountIn ? String(amountIn) : value && value !== "0" ? value : undefined,
            amountOutMin: amountOutMin ? String(amountOutMin) : undefined
          };
        }
      case "multicall":
        return {
          type: "swap",
          description: `Token swap (bundled transaction)`,
          to,
          functionName: name
        };
      default:
        return {
          type: "contract_interaction",
          description: `Call ${name}() on ${this._shortAddr(to)}`,
          to,
          functionName: name
        };
    }
  }
  _decodeBySelector(selector, data, to, value) {
    // Check known DEX swap selectors first
    const dexEntry = DEX_SWAP_SELECTORS[selector];
    if (dexEntry) {
      let srcToken, dstToken;
      // Fast reliable extraction for Kyber/1inch inline structures
      if (dexEntry.srcOffset !== undefined && dexEntry.dstOffset !== undefined) {
        const words = this._getHexWords(data);
        if (words.length > Math.max(dexEntry.srcOffset, dexEntry.dstOffset)) {
          srcToken = ethers__WEBPACK_IMPORTED_MODULE_1__.getAddress("0x" + words[dexEntry.srcOffset].slice(24));
          dstToken = ethers__WEBPACK_IMPORTED_MODULE_1__.getAddress("0x" + words[dexEntry.dstOffset].slice(24));
        }
      } else {
        const tokens = this._extractPossibleTokens(data, to);
        srcToken = tokens.srcToken;
        dstToken = tokens.dstToken;
      }
      return {
        type: "swap",
        description: `${dexEntry.action} via ${dexEntry.protocol}`,
        to,
        functionName: selector,
        srcToken: srcToken,
        dstToken: dstToken,
        srcTokenSymbol: srcToken && KNOWN_TOKENS[srcToken.toLowerCase()],
        dstTokenSymbol: dstToken && KNOWN_TOKENS[dstToken.toLowerCase()]
      };
    }
    if (ERC20_SIGNATURES[selector]) {
      const sig = ERC20_SIGNATURES[selector];
      try {
        const decoded = ethers__WEBPACK_IMPORTED_MODULE_2__.AbiCoder.defaultAbiCoder().decode(sig.inputs, "0x" + data.slice(10));
        if (sig.name === "transfer") {
          return {
            type: "erc20_transfer",
            description: `Transfer tokens to ${this._shortAddr(String(decoded[0]))}`,
            to: String(decoded[0]),
            amount: String(decoded[1]),
            tokenAddress: to,
            functionName: sig.name
          };
        }
        if (sig.name === "approve") {
          const symbol = KNOWN_TOKENS[to.toLowerCase()] || this._shortAddr(to);
          return {
            type: "erc20_approve",
            description: `Approve token spending of ${symbol}`,
            spender: String(decoded[0]),
            amount: String(decoded[1]),
            tokenAddress: to,
            tokenSymbol: KNOWN_TOKENS[to.toLowerCase()],
            functionName: sig.name
          };
        }
      } catch {
        // Fall through
      }
    }
    if (ERC721_SIGNATURES[selector]) {
      const sig = ERC721_SIGNATURES[selector];
      return {
        type: "erc721_transfer",
        description: `NFT interaction: ${sig.name}`,
        to,
        functionName: sig.name
      };
    }
    return {
      type: "unknown",
      description: `Contract interaction with ${this._shortAddr(to)}`,
      to,
      functionName: selector
    };
  }
  _formatEther(value) {
    try {
      if (value.startsWith("0x")) {
        return ethers__WEBPACK_IMPORTED_MODULE_3__.formatEther(BigInt(value));
      }
      if (/^\d+$/.test(value) && value.length > 10) {
        return ethers__WEBPACK_IMPORTED_MODULE_3__.formatEther(BigInt(value));
      }
      return value;
    } catch {
      return value;
    }
  }
  _shortAddr(address) {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  _extractPossibleTokens(data, to) {
    const tokens = [];
    const words = this._getHexWords(data);
    for (const word of words) {
      if (word.length === 64 && word.startsWith("000000000000000000000000")) {
        const addr = "0x" + word.slice(24);
        if (addr !== "0x0000000000000000000000000000000000000000" && addr.toLowerCase() !== to.toLowerCase()) {
          if (!tokens.some(t => t.toLowerCase() === addr.toLowerCase())) {
            tokens.push(ethers__WEBPACK_IMPORTED_MODULE_1__.getAddress(addr));
          }
        }
      }
    }
    return {
      srcToken: tokens[0],
      dstToken: tokens[1]
    };
  }
  _getHexWords(data) {
    const words = [];
    const cleanData = data.startsWith("0x") ? data.slice(10) : data.slice(8);
    for (let i = 0; i < cleanData.length; i += 64) {
      words.push(cleanData.substring(i, i + 64));
    }
    return words;
  }
  static ɵfac = function TxDecoderService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || TxDecoderService)();
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({
    token: TxDecoderService,
    factory: TxDecoderService.ɵfac,
    providedIn: "root"
  });
}

/***/ }

}]);
//# sourceMappingURL=src_app_dapp-sign_dapp-sign_component_ts.js.map