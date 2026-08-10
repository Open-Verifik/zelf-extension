"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_apps-hub_apps-hub_component_ts"],{

/***/ 34094
/*!************************************************!*\
  !*** ./src/app/apps-hub/apps-hub.component.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppsHubComponent: () => (/* binding */ AppsHubComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 34487);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 51567);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 33900);
/* harmony import */ var _language_language_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../language/language.component */ 63374);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _zelf_footer_footer_navigation_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../zelf-footer/footer-navigation.service */ 75469);











const _c0 = () => ({
  exact: false
});
function AppsHubComponent_div_0_button_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "button", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function AppsHubComponent_div_0_button_12_Template_button_click_0_listener() {
      const dest_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r3).$implicit;
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r1.navigateTo(dest_r4));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](1, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](2, "img", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](3, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](5, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](6, "svg", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](7, "path", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const dest_r4 = ctx.$implicit;
    const t_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵclassProp"]("apps-hub__row--active", ctx_r1.rowIsActive(dest_r4));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("src", dest_r4.iconUrl, _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](t_r5(ctx_r1.navService.hubLabelKey(dest_r4)));
  }
}
function AppsHubComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "button", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function AppsHubComponent_div_0_Template_button_click_3_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r1.goBack());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](4, "svg", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](5, "path", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](6, "div", 7)(7, "p", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](9, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](10, "div", 10)(11, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](12, AppsHubComponent_div_0_button_12_Template, 8, 4, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](13, "div", 13)(14, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](15, "language");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](16, "a", 15)(17, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](18, "img", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](19, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](21, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](22, "svg", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](23, "path", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()()()();
  }
  if (rf & 2) {
    const t_r5 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](t_r5("common.apps"));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngForOf", ctx_r1.hubDestinations);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("routerLinkActiveOptions", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction0"](4, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](t_r5("common.settings"));
  }
}
class AppsHubComponent {
  _router;
  navService;
  _destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__.Subject();
  currentUrl = "";
  hubDestinations;
  constructor(_router, navService) {
    this._router = _router;
    this.navService = navService;
    this.hubDestinations = this.navService.getHubDestinations();
  }
  ngOnInit() {
    this._updateUrl(this._router.url);
    this._router.events.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_6__.filter)(e => e instanceof _angular_router__WEBPACK_IMPORTED_MODULE_2__.NavigationEnd), (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.takeUntil)(this._destroy$)).subscribe(e => {
      const newUrl = e.urlAfterRedirects || e.url;
      this._updateUrl(newUrl);
    });
  }
  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
  _updateUrl(url) {
    this.currentUrl = url.split("?")[0];
  }
  goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      void this._router.navigate(["/home"]);
    }
  }
  rowIsActive(dest) {
    return this.navService.isActive(this.currentUrl, dest.id);
  }
  navigateTo(dest) {
    void this._router.navigate([dest.route]);
  }
  static ɵfac = function AppsHubComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AppsHubComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_zelf_footer_footer_navigation_service__WEBPACK_IMPORTED_MODULE_11__.FooterNavigationService));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineComponent"]({
    type: AppsHubComponent,
    selectors: [["apps-hub"]],
    decls: 1,
    vars: 0,
    consts: [["class", "zelf-card apps-hub", 4, "transloco"], [1, "zelf-card", "apps-hub"], [1, "apps-hub__header"], [1, "apps-hub__header-col1"], ["type", "button", "mat-flat-button", "", 1, "zelf-icon-button", "zelf-icon-button--secondary", "zelf-icon-button--40", 3, "click"], ["width", "22", "height", "14", "viewBox", "0 0 22 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"], [1, "apps-hub__header-col2"], [1, "apps-hub__title"], [1, "apps-hub__header-col3"], [1, "apps-hub__body"], [1, "apps-hub__list"], ["type", "button", "class", "apps-hub__row", 3, "apps-hub__row--active", "click", 4, "ngFor", "ngForOf"], [1, "apps-hub__footer-strip"], [1, "apps-hub__language-tile"], ["routerLink", "/settings", "routerLinkActive", "apps-hub__row--active", 1, "apps-hub__row", "apps-hub__row--link", 3, "routerLinkActiveOptions"], [1, "apps-hub__icon-tile"], ["src", "assets/icons/settings_icon.svg", "alt", "", 1, "apps-hub__icon-img"], [1, "apps-hub__label"], ["aria-hidden", "true", 1, "apps-hub__chevron"], ["width", "8", "height", "12", "viewBox", "0 0 8 12", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M1.70504 0L0.295044 1.41L4.87504 6L0.295044 10.59L1.70504 12L7.70504 6L1.70504 0Z"], ["type", "button", 1, "apps-hub__row", 3, "click"], ["alt", "", 1, "apps-hub__icon-img", 3, "src"]],
    template: function AppsHubComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](0, AppsHubComponent_div_0_Template, 24, 5, "div", 0);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.NgForOf, _angular_material_button__WEBPACK_IMPORTED_MODULE_1__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_1__.MatButton, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLink, _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterLinkActive, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__.TranslocoDirective, _language_language_component__WEBPACK_IMPORTED_MODULE_8__.LanguageComponent],
    styles: ["[_nghost-%COMP%] {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  justify-content: center;\n}\n\n*[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n\n.apps-hub[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  min-height: 100%;\n  box-sizing: border-box;\n}\n.apps-hub__header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: calc(8px * var(--zns-space-scale, 1)) calc(4px * var(--zns-space-scale, 1)) calc(16px * var(--zns-space-scale, 1));\n  border-bottom: 1px solid var(--zns-theme-border, #e3e3e3);\n}\n.apps-hub__header-col1[_ngcontent-%COMP%], .apps-hub__header-col3[_ngcontent-%COMP%] {\n  flex: 0 0 calc(40px * var(--zns-action-scale, 1));\n}\n.apps-hub__header-col2[_ngcontent-%COMP%] {\n  flex: 1;\n  text-align: center;\n}\n.apps-hub__title[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: calc(16px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  color: var(--zns-theme-text, #181818);\n}\n.apps-hub__body[_ngcontent-%COMP%] {\n  width: 100%;\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  gap: calc(12px * var(--zns-space-scale, 1));\n  padding: calc(16px * var(--zns-space-scale, 1)) calc(4px * var(--zns-space-scale, 1)) calc(24px * var(--zns-space-scale, 1));\n}\n.apps-hub__actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: calc(8px * var(--zns-space-scale, 1));\n}\n.apps-hub__action-btn[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: min(140px, 100%);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: calc(6px * var(--zns-space-scale, 1));\n  padding: calc(10px * var(--zns-space-scale, 1)) calc(12px * var(--zns-space-scale, 1));\n  border: none;\n  border-radius: 12px;\n  background: var(--zns-theme-secondary, #ff5721);\n  color: var(--zns-theme-card, #ffffff);\n  font-size: calc(13px * var(--zns-font-scale, 1));\n  font-weight: 500;\n  cursor: pointer;\n  transition: background-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.apps-hub__action-btn[_ngcontent-%COMP%]:hover {\n  background: var(--zns-theme-button-hover, #ff5721);\n}\n.apps-hub__action-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  line-height: 1;\n}\n.apps-hub__list[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: calc(10px * var(--zns-space-scale, 1));\n}\n.apps-hub__row[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: calc(12px * var(--zns-space-scale, 1));\n  width: 100%;\n  padding: calc(12px * var(--zns-space-scale, 1)) calc(14px * var(--zns-space-scale, 1));\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  border-radius: 14px;\n  background: var(--zns-theme-card, #ffffff);\n  cursor: pointer;\n  text-align: left;\n  text-decoration: none;\n  color: var(--zns-theme-text, #181818);\n  transition: border-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), box-shadow 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.apps-hub__row[_ngcontent-%COMP%]:hover   .apps-hub__label[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n.apps-hub__row--active[_ngcontent-%COMP%] {\n  border-color: var(--zns-theme-border-hover, #c3c6cf);\n  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);\n}\n.apps-hub__row--active[_ngcontent-%COMP%]   .apps-hub__label[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n.apps-hub__row--link[_ngcontent-%COMP%] {\n  margin-top: calc(4px * var(--zns-space-scale, 1));\n}\n.apps-hub__icon-tile[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  width: calc(44px * var(--zns-space-scale, 1));\n  height: calc(44px * var(--zns-space-scale, 1));\n  border-radius: 12px;\n  background: #fff0eb;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.apps-hub__icon-img[_ngcontent-%COMP%] {\n  width: calc(22px * var(--zns-space-scale, 1));\n  height: calc(22px * var(--zns-space-scale, 1));\n  object-fit: contain;\n  filter: brightness(0) saturate(100%) invert(47%) sepia(93%) saturate(1830%) hue-rotate(339deg) brightness(98%) contrast(94%);\n}\n.apps-hub__label[_ngcontent-%COMP%] {\n  flex: 1;\n  font-size: calc(15px * var(--zns-font-scale, 1));\n  font-weight: 500;\n  transition: font-weight 0.15s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.apps-hub__chevron[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  color: var(--zns-theme-text-muted, #96939e);\n}\n.apps-hub__chevron[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: currentColor;\n}\n.apps-hub__footer-strip[_ngcontent-%COMP%] {\n  margin-top: auto;\n  padding-top: calc(8px * var(--zns-space-scale, 1));\n  display: flex;\n  flex-direction: row;\n  align-items: stretch;\n  gap: calc(10px * var(--zns-space-scale, 1));\n}\n.apps-hub__footer-strip[_ngcontent-%COMP%]   .apps-hub__row--link[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  margin-top: 0;\n}\n.apps-hub__language-tile[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  display: flex;\n  align-items: center;\n  border: 1px solid var(--zns-theme-border, #e3e3e3);\n  border-radius: 14px;\n  padding: calc(4px * var(--zns-space-scale, 1)) calc(8px * var(--zns-space-scale, 1));\n  background: var(--zns-theme-card, #ffffff);\n}\n.apps-hub__language-tile[_ngcontent-%COMP%]     .language__button {\n  width: 100%;\n  justify-content: flex-start;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYXBwcy1odWIvYXBwcy1odWIuY29tcG9uZW50LnNjc3MiLCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL192YXJpYWJsZXMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNJLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsWUFBQTtFQUNBLHVCQUFBO0FBREo7O0FBSUE7RUFDSSxzQkFBQTtBQURKOztBQU9BO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxzQkFBQTtBQUpKO0FBTUk7RUFDSSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSw4QkFBQTtFQUNBLDJIQUFBO0VBQ0EseURBQUE7QUFKUjtBQU9JO0VBRUksaURBQUE7QUFOUjtBQVNJO0VBQ0ksT0FBQTtFQUNBLGtCQUFBO0FBUFI7QUFVSTtFQUNJLFNBQUE7RUFDQSxnREFBQTtFQUNBLGdCQUFBO0VBQ0EscUNDZEk7QURNWjtBQVdJO0VBQ0ksV0FBQTtFQUNBLE9BQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSwyQ0FBQTtFQUNBLDRIQUFBO0FBVFI7QUFZSTtFQUNJLGFBQUE7RUFDQSxlQUFBO0VBQ0EsMENBQUE7QUFWUjtBQWFJO0VBQ0ksT0FBQTtFQUNBLDJCQUFBO0VBQ0Esb0JBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsMENBQUE7RUFDQSxzRkFBQTtFQUNBLFlBQUE7RUFDQSxtQkFBQTtFQUNBLCtDQ3ZFUztFRHdFVCxxQ0N6Qkk7RUQwQkosZ0RBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSxpRUFBQTtBQVhSO0FBYVE7RUFDSSxrREN6Q087QUQ4Qm5CO0FBZUk7RUFDSSxlQUFBO0VBQ0EsY0FBQTtBQWJSO0FBZ0JJO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsMkNBQUE7QUFkUjtBQWlCSTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLDJDQUFBO0VBQ0EsV0FBQTtFQUNBLHNGQUFBO0VBQ0Esa0RBQUE7RUFDQSxtQkFBQTtFQUNBLDBDQ3ZESTtFRHdESixlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxxQkFBQTtFQUNBLHFDQzdFSTtFRDhFSiw4R0FDSTtBQWhCWjtBQW1CUTtFQUNJLGdCQUFBO0FBakJaO0FBb0JRO0VBQ0ksb0RDdkVPO0VEd0VQLHVDQUFBO0FBbEJaO0FBb0JZO0VBQ0ksZ0JBQUE7QUFsQmhCO0FBc0JRO0VBQ0ksaURBQUE7QUFwQlo7QUF3Qkk7RUFDSSxjQUFBO0VBQ0EsNkNBQUE7RUFDQSw4Q0FBQTtFQUNBLG1CQUFBO0VBQ0EsbUJBMUhjO0VBMkhkLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0FBdEJSO0FBeUJJO0VBQ0ksNkNBQUE7RUFDQSw4Q0FBQTtFQUNBLG1CQUFBO0VBQ0EsNEhBbklxQjtBQTRHN0I7QUEwQkk7RUFDSSxPQUFBO0VBQ0EsZ0RBQUE7RUFDQSxnQkFBQTtFQUNBLDZEQUFBO0FBeEJSO0FBMkJJO0VBQ0ksY0FBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLDJDQ2hJUztBRHVHakI7QUEyQlE7RUFDSSxrQkFBQTtBQXpCWjtBQTZCSTtFQUNJLGdCQUFBO0VBQ0Esa0RBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxvQkFBQTtFQUNBLDJDQUFBO0FBM0JSO0FBNkJRO0VBQ0ksT0FBQTtFQUNBLFlBQUE7RUFDQSxhQUFBO0FBM0JaO0FBK0JJO0VBQ0ksY0FBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLGtEQUFBO0VBQ0EsbUJBQUE7RUFDQSxvRkFBQTtFQUNBLDBDQzVJSTtBRCtHWjtBQStCUTtFQUNJLFdBQUE7RUFDQSwyQkFBQTtBQTdCWiIsInNvdXJjZXNDb250ZW50IjpbIkB1c2UgXCIuLi8uLi9zdHlsZXMvdmFyaWFibGVzXCI7XG5cbjpob3N0IHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBmbGV4LWdyb3c6IDE7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbioge1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbiRhcHBzLWh1Yi1wZWFjaC10aWxlOiAjZmZmMGViO1xuJGFwcHMtaHViLWNvcmFsLWljb24tZmlsdGVyOiBicmlnaHRuZXNzKDApIHNhdHVyYXRlKDEwMCUpIGludmVydCg0NyUpIHNlcGlhKDkzJSkgc2F0dXJhdGUoMTgzMCUpIGh1ZS1yb3RhdGUoMzM5ZGVnKSBicmlnaHRuZXNzKDk4JSkgY29udHJhc3QoOTQlKTtcblxuLmFwcHMtaHViIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgbWluLWhlaWdodDogMTAwJTtcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuXG4gICAgJl9faGVhZGVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpIGNhbGMoNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSkgY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyO1xuICAgIH1cblxuICAgICZfX2hlYWRlci1jb2wxLFxuICAgICZfX2hlYWRlci1jb2wzIHtcbiAgICAgICAgZmxleDogMCAwIGNhbGMoNDBweCAqIHZhcigtLXpucy1hY3Rpb24tc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19oZWFkZXItY29sMiB7XG4gICAgICAgIGZsZXg6IDE7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX190aXRsZSB7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgZm9udC1zaXplOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgfVxuXG4gICAgJl9fYm9keSB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBmbGV4OiAxO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBnYXA6IGNhbGMoMTJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBjYWxjKDRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpIGNhbGMoMjRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX2FjdGlvbnMge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LXdyYXA6IHdyYXA7XG4gICAgICAgIGdhcDogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG5cbiAgICAmX19hY3Rpb24tYnRuIHtcbiAgICAgICAgZmxleDogMTtcbiAgICAgICAgbWluLXdpZHRoOiBtaW4oMTQwcHgsIDEwMCUpO1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGdhcDogY2FsYyg2cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgcGFkZGluZzogY2FsYygxMHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSkgY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiRzZWNvbmRhcnlDb2xvcjtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVDYXJkO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTNweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJ1dHRvbkhvdmVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fYWN0aW9uLWljb24ge1xuICAgICAgICBmb250LXNpemU6IDE2cHg7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgIH1cblxuICAgICZfX2xpc3Qge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBnYXA6IGNhbGMoMTBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIH1cblxuICAgICZfX3JvdyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogY2FsYygxMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBwYWRkaW5nOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBjYWxjKDE0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTRweDtcbiAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xuICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBib3JkZXItY29sb3IgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcixcbiAgICAgICAgICAgIGJveC1zaGFkb3cgMC4ycyB2YXJpYWJsZXMuJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmhvdmVyIC5hcHBzLWh1Yl9fbGFiZWwge1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgICAgfVxuXG4gICAgICAgICYtLWFjdGl2ZSB7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVCb3JkZXJIb3ZlcjtcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMXB4IDAgcmdiYSgwLCAwLCAwLCAwLjA0KTtcblxuICAgICAgICAgICAgLmFwcHMtaHViX19sYWJlbCB7XG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICYtLWxpbmsge1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogY2FsYyg0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2ljb24tdGlsZSB7XG4gICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgICAgICB3aWR0aDogY2FsYyg0NHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGhlaWdodDogY2FsYyg0NHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICAgIGJhY2tncm91bmQ6ICRhcHBzLWh1Yi1wZWFjaC10aWxlO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX19pY29uLWltZyB7XG4gICAgICAgIHdpZHRoOiBjYWxjKDIycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgaGVpZ2h0OiBjYWxjKDIycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgb2JqZWN0LWZpdDogY29udGFpbjtcbiAgICAgICAgZmlsdGVyOiAkYXBwcy1odWItY29yYWwtaWNvbi1maWx0ZXI7XG4gICAgfVxuXG4gICAgJl9fbGFiZWwge1xuICAgICAgICBmbGV4OiAxO1xuICAgICAgICBmb250LXNpemU6IGNhbGMoMTVweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgICAgIHRyYW5zaXRpb246IGZvbnQtd2VpZ2h0IDAuMTVzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuICAgIH1cblxuICAgICZfX2NoZXZyb24ge1xuICAgICAgICBmbGV4LXNocmluazogMDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IGN1cnJlbnRDb2xvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2Zvb3Rlci1zdHJpcCB7XG4gICAgICAgIG1hcmdpbi10b3A6IGF1dG87XG4gICAgICAgIHBhZGRpbmctdG9wOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICBhbGlnbi1pdGVtczogc3RyZXRjaDtcbiAgICAgICAgZ2FwOiBjYWxjKDEwcHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcblxuICAgICAgICAuYXBwcy1odWJfX3Jvdy0tbGluayB7XG4gICAgICAgICAgICBmbGV4OiAxO1xuICAgICAgICAgICAgbWluLXdpZHRoOiAwO1xuICAgICAgICAgICAgbWFyZ2luLXRvcDogMDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2xhbmd1YWdlLXRpbGUge1xuICAgICAgICBmbGV4OiAwIDAgYXV0bztcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgYm9yZGVyOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTRweDtcbiAgICAgICAgcGFkZGluZzogY2FsYyg0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKSBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBiYWNrZ3JvdW5kOiB2YXJpYWJsZXMuJHRoZW1lQ2FyZDtcblxuICAgICAgICA6Om5nLWRlZXAgLmxhbmd1YWdlX19idXR0b24ge1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIkcHJpbWFyeUNvbG9yOiB2YXIoLS16bnMtdGhlbWUtcHJpbWFyeSwgIzE4MTgxOCk7XG4kcHJpbWFyeUxpZ2h0OiAjZGFkZGZhO1xuJHNlY29uZGFyeUNvbG9yOiB2YXIoLS16bnMtdGhlbWUtc2Vjb25kYXJ5LCAjZmY1NzIxKTtcbiRzZWNvbmRhcnlDb2xvckxpZ2h0OiAjZjZlNWUwO1xuXG4kY29ycmVjdDogdmFyKC0tem5zLXRoZW1lLXN1Y2Nlc3MsICMxZWE0NDYpO1xuJGNvcnJlY3REYXJrOiAjMGY1MjIzO1xuJGNvcnJlY3RMaWdodDogdmFyKC0tem5zLXRoZW1lLXN1Y2Nlc3MtdGV4dCwgI2U3ZjhlZCk7XG5cbiRlcnJvcjogdmFyKC0tem5zLXRoZW1lLWVycm9yLCAjZGMzNjJlKTtcbiRlcnJvckRhcms6ICM2MDE0MTA7XG4kZXJyb3JMaWdodDogdmFyKC0tem5zLXRoZW1lLWVycm9yLXRleHQsICNmY2VlZWUpO1xuXG4kd2FybmluZzogdmFyKC0tem5zLXRoZW1lLXdhcm5pbmcsICNkZTY4MDApO1xuJHdhcm5pbmdEYXJrOiAjNGEyMTBhO1xuJHdhcm5pbmdMaWdodDogdmFyKC0tem5zLXRoZW1lLXdhcm5pbmctdGV4dCwgI2ZmZWVlOSk7XG5cbiRpbmZvOiAjMzk5OGQzO1xuJGluZm9EYXJrOiAjMDA0YTc3O1xuJGluZm9MaWdodDogI2VjZjNmZTtcblxuJGJsYWNrOiAjMTgxODE4O1xuJHdoaXRlOiAjZmZmZmZmO1xuXG4kdGhlbWVCb2R5RmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtYm9keS1mYW1pbHksIFwiUG9wcGluc1wiLCBBcmlhbCwgc2Fucy1zZXJpZik7XG4kdGhlbWVUaXRsZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLXRpdGxlLWZhbWlseSwgXCJNZW5kYVwiLCBcIkFyaWFsIEJsYWNrXCIsIHNhbnMtc2VyaWYpO1xuJHRoZW1lTW9ub3NwYWNlRmFtaWx5OiB2YXIoLS16bnMtdGhlbWUtbW9ub3NwYWNlLWZhbWlseSwgXCJDb3VyaWVyIE5ld1wiLCBDb3VyaWVyLCBtb25vc3BhY2UpO1xuXG4kdGhlbWVCYWNrZ3JvdW5kOiB2YXIoLS16bnMtdGhlbWUtYmFja2dyb3VuZCwgI2ZmZmZmZik7XG4kdGhlbWVCYWNrZ3JvdW5kU2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtYmFja2dyb3VuZC1zZWNvbmRhcnksICNmOWY5ZmMpO1xuXG4kdGhlbWVUZXh0OiB2YXIoLS16bnMtdGhlbWUtdGV4dCwgIzE4MTgxOCk7XG4kdGhlbWVUZXh0TXV0ZWQ6IHZhcigtLXpucy10aGVtZS10ZXh0LW11dGVkLCAjOTY5MzllKTtcbiR0aGVtZVRleHRTZWNvbmRhcnk6IHZhcigtLXpucy10aGVtZS10ZXh0LXNlY29uZGFyeSwgIzczNzc3Zik7XG5cbiR0aGVtZUhlYWRlcjogdmFyKC0tem5zLXRoZW1lLWhlYWRlciwgIzE4MTgxOCk7XG4kdGhlbWVIZWFkZXJUZXh0OiB2YXIoLS16bnMtdGhlbWUtaGVhZGVyLXRleHQsICNmZmZmZmYpO1xuXG4kdGhlbWVCdXR0b246IHZhcigtLXpucy10aGVtZS1idXR0b24sICMxODE4MTgpO1xuJHRoZW1lQnV0dG9uVGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi10ZXh0LCAjZmZmZmZmKTtcbiR0aGVtZUJ1dHRvbkhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLWhvdmVyLCAjZmY1NzIxKTtcblxuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeSwgI2U5ZWNlZik7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlUZXh0OiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeS10ZXh0LCAjNDk1MDU3KTtcbiR0aGVtZUJ1dHRvblNlY29uZGFyeUhvdmVyOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLXNlY29uZGFyeS1ob3ZlciwgI2U5ZWNlZik7XG5cbiR0aGVtZUJvcmRlcjogdmFyKC0tem5zLXRoZW1lLWJvcmRlciwgI2UzZTNlMyk7XG4kdGhlbWVCb3JkZXJIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJvcmRlci1ob3ZlciwgI2MzYzZjZik7XG5cbiR0aGVtZUNhcmQ6IHZhcigtLXpucy10aGVtZS1jYXJkLCAjZmZmZmZmKTtcbiR0aGVtZUNhcmRCb3JkZXI6IHZhcigtLXpucy10aGVtZS1jYXJkLWJvcmRlciwgI2VlZWRmMSk7XG5cbiR0aGVtZVNoYWRvdzogdmFyKC0tem5zLXRoZW1lLXNoYWRvdywgcmdiYSgwLCAwLCAwLCAwLjEpKTtcblxuJHNtb290aEJlemllcjogY3ViaWMtYmV6aWVyKDAuMjUsIDAuNCwgMC43LCAxKTtcblxuJG1heEV4dHJhU21hbGw6IDU5NXB4O1xuJG1pblNtYWxsOiA2MDBweDtcbiRtZWRpdW06IDc2OHB4O1xuJGxhcmdlOiA4ODlweDtcbiRjb21wdXRlcnM6IDEyMDBweDtcbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
  });
}

/***/ },

/***/ 75469
/*!**********************************************************!*\
  !*** ./src/app/zelf-footer/footer-navigation.service.ts ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FooterNavigationService: () => (/* binding */ FooterNavigationService)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 85422);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 51567);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 70271);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 63037);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 34205);





class FooterNavigationService {
  _router;
  destinations = [{
    id: "home",
    labelKey: "common.home",
    iconUrl: "assets/icons/home_icon.svg",
    route: "/home"
  }, {
    id: "wallet",
    labelKey: "common.zelf_wallet",
    iconUrl: "assets/icons/wallet_icon.svg",
    route: "/wallet"
  }, {
    id: "zelf-keys",
    labelKey: "common.zelf_keys",
    iconUrl: "assets/icons/key_icon.svg",
    route: "/zelf-keys"
  }, {
    id: "zelf-authenticator",
    labelKey: "common.zelf_authenticator",
    iconUrl: "assets/icons/shield_icon.svg",
    route: "/zelf-authenticator"
  }, {
    id: "manage-domains",
    labelKey: "common.manage_domains",
    iconUrl: "assets/icons/zelf_id_icon.svg",
    route: "/manage-domains"
  }, {
    id: "zelf-chat",
    labelKey: "common.zelf_chat",
    iconUrl: "assets/icons/chat_icon.svg",
    route: "/zelf-chat"
  }, {
    id: "zelf-signals",
    labelKey: "common.zelf_signals",
    iconUrl: "assets/icons/signals_icon.svg",
    route: "/zelf-signals"
  }, {
    id: "zelf-ai",
    labelKey: "common.zelf_ai",
    iconUrl: "assets/icons/ai_icon.svg",
    route: "/zelf-ai"
  }, {
    id: "settings",
    labelKey: "common.settings",
    iconUrl: "assets/icons/settings_icon.svg",
    // I might need to make sure this icon exists or use a material icon or fallback
    route: "/settings"
  }];
  activeDestination$;
  constructor(_router) {
    this._router = _router;
    this.activeDestination$ = this._router.events.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.filter)(event => event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_1__.NavigationEnd), (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.startWith)(null), (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.map)(() => this.getActiveDestination(this._router.url)));
  }
  isActive(url, destinationId) {
    const cleanUrl = url.split("?")[0];
    switch (destinationId) {
      case "home":
        return cleanUrl === "/home";
      case "wallet":
        return cleanUrl === "/wallet";
      case "manage-domains":
        return cleanUrl === "/manage-domains" || cleanUrl.startsWith("/domain");
      case "zelf-keys":
        return cleanUrl.startsWith("/zelf-keys");
      case "zelf-authenticator":
        return cleanUrl.startsWith("/zelf-authenticator");
      default:
        const dest = this.destinations.find(d => d.id === destinationId);
        return dest ? cleanUrl.startsWith(dest.route) : false;
    }
  }
  getActiveDestination(url) {
    // Find matching destination or fallback to home
    const active = this.destinations.find(d => this.isActive(url, d.id));
    return active || this.destinations[0];
  }
  navigate(destinationId) {
    var _this = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const dest = _this.destinations.find(d => d.id === destinationId);
      if (dest) {
        return _this._router.navigate([dest.route]);
      }
      return false;
    })();
  }
  /** Order for full-page apps hub (screenshot 1). */
  _hubDestinationIds = ["home", "wallet", "zelf-keys", "zelf-authenticator", "zelf-chat", "zelf-signals", "manage-domains", "zelf-ai"];
  getHubDestinations() {
    return this._hubDestinationIds.map(id => this.destinations.find(d => d.id === id)).filter(d => !!d);
  }
  /** Short z-prefixed labels for the full-screen Apps Hub list (reference UI). */
  hubLabelKey(dest) {
    switch (dest.id) {
      case "wallet":
        return "apps_hub.label_wallet";
      case "zelf-keys":
        return "apps_hub.label_keys";
      case "zelf-authenticator":
        return "apps_hub.label_auth";
      case "zelf-chat":
        return "common.zelf_chats";
      case "zelf-signals":
        return "common.zelf_signals";
      case "manage-domains":
        return "apps_hub.label_id";
      case "zelf-ai":
        return "apps_hub.label_ai";
      default:
        return dest.labelKey;
    }
  }
  static ɵfac = function FooterNavigationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || FooterNavigationService)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__.Router));
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({
    token: FooterNavigationService,
    factory: FooterNavigationService.ɵfac,
    providedIn: "root"
  });
}

/***/ }

}]);
//# sourceMappingURL=src_app_apps-hub_apps-hub_component_ts.js.map