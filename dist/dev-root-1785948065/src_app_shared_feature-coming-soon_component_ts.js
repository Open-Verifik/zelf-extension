"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_shared_feature-coming-soon_component_ts"],{

/***/ 55249
/*!*********************************************************!*\
  !*** ./src/app/shared/feature-coming-soon.component.ts ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FeatureComingSoonComponent: () => (/* binding */ FeatureComingSoonComponent)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ 34487);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 85422);





const _c0 = () => ["/home"];
function FeatureComingSoonComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 1)(1, "div", 2)(2, "button", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "svg", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "path", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "p", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](7, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "div", 8)(9, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "svg", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](11, "path", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "h2", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "p", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const t_r1 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction0"](4, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](t_r1(ctx_r1.titleKey));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](t_r1("common.coming_soon"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](t_r1(ctx_r1.bodyKey));
  }
}
class FeatureComingSoonComponent {
  route;
  titleKey = "common.coming_soon";
  bodyKey = "common.coming_soon_desc";
  constructor(route) {
    this.route = route;
  }
  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data['titleKey']) this.titleKey = data['titleKey'];
      if (data['bodyKey']) this.bodyKey = data['bodyKey'];
    });
  }
  static ɵfac = function FeatureComingSoonComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || FeatureComingSoonComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__.ActivatedRoute));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
    type: FeatureComingSoonComponent,
    selectors: [["feature-coming-soon"]],
    decls: 1,
    vars: 0,
    consts: [["class", "zelf-card feature-coming-soon", 4, "transloco"], [1, "zelf-card", "feature-coming-soon"], [1, "feature-coming-soon__header"], [1, "zelf-icon-button", "zelf-icon-button--secondary", "zelf-icon-button--40", 3, "routerLink"], ["width", "22", "height", "14", "viewBox", "0 0 22 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"], [1, "feature-coming-soon__title"], [1, "feature-coming-soon__spacer"], [1, "feature-coming-soon__content"], [1, "feature-coming-soon__icon-wrapper"], ["width", "48", "height", "48", "viewBox", "0 0 24 24", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z", "fill", "currentColor"], [1, "feature-coming-soon__heading"], [1, "feature-coming-soon__description"]],
    template: function FeatureComingSoonComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](0, FeatureComingSoonComponent_div_0_Template, 16, 5, "div", 0);
      }
    },
    dependencies: [_jsverse_transloco__WEBPACK_IMPORTED_MODULE_1__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_1__.TranslocoDirective, _angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterLink],
    styles: ["@use \"../../../styles/variables\";\n\n        .feature-coming-soon[_ngcontent-%COMP%] {\n            display: flex;\n            flex-direction: column;\n            min-height: 100vh;\n            background: variables.$themeCard;\n            color: variables.$themeText;\n\n            &__header {\n                display: flex;\n                align-items: center;\n                padding: calc(16px * var(--zns-space-scale, 1));\n                border-bottom: 1px solid variables.$themeBorder;\n            }\n\n            &__title {\n                flex: 1;\n                text-align: center;\n                font-weight: 600;\n                font-size: calc(16px * var(--zns-font-scale, 1));\n                margin: 0;\n            }\n\n            &__spacer {\n                width: 40px; \n\n            }\n\n            &__content {\n                flex: 1;\n                display: flex;\n                flex-direction: column;\n                align-items: center;\n                justify-content: center;\n                padding: calc(32px * var(--zns-space-scale, 1));\n                text-align: center;\n            }\n\n            &__icon-wrapper {\n                margin-bottom: calc(24px * var(--zns-space-scale, 1));\n                color: variables.$themeTextMuted;\n            }\n\n            &__heading {\n                font-size: calc(24px * var(--zns-font-scale, 1));\n                font-weight: 700;\n                margin-bottom: calc(8px * var(--zns-space-scale, 1));\n            }\n\n            &__description {\n                font-size: calc(16px * var(--zns-font-scale, 1));\n                color: variables.$themeTextMuted;\n                max-width: 300px;\n                line-height: 1.5;\n            }\n        }\n    \n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2ZlYXR1cmUtY29taW5nLXNvb24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFDUSxnQ0FBZ0M7O1FBRWhDO1lBQ0ksYUFBYTtZQUNiLHNCQUFzQjtZQUN0QixpQkFBaUI7WUFDakIsZ0NBQWdDO1lBQ2hDLDJCQUEyQjs7WUFFM0I7Z0JBQ0ksYUFBYTtnQkFDYixtQkFBbUI7Z0JBQ25CLCtDQUErQztnQkFDL0MsK0NBQStDO1lBQ25EOztZQUVBO2dCQUNJLE9BQU87Z0JBQ1Asa0JBQWtCO2dCQUNsQixnQkFBZ0I7Z0JBQ2hCLGdEQUFnRDtnQkFDaEQsU0FBUztZQUNiOztZQUVBO2dCQUNJLFdBQVcsRUFBRSx5Q0FBeUM7WUFDMUQ7O1lBRUE7Z0JBQ0ksT0FBTztnQkFDUCxhQUFhO2dCQUNiLHNCQUFzQjtnQkFDdEIsbUJBQW1CO2dCQUNuQix1QkFBdUI7Z0JBQ3ZCLCtDQUErQztnQkFDL0Msa0JBQWtCO1lBQ3RCOztZQUVBO2dCQUNJLHFEQUFxRDtnQkFDckQsZ0NBQWdDO1lBQ3BDOztZQUVBO2dCQUNJLGdEQUFnRDtnQkFDaEQsZ0JBQWdCO2dCQUNoQixvREFBb0Q7WUFDeEQ7O1lBRUE7Z0JBQ0ksZ0RBQWdEO2dCQUNoRCxnQ0FBZ0M7Z0JBQ2hDLGdCQUFnQjtnQkFDaEIsZ0JBQWdCO1lBQ3BCO1FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJcbiAgICAgICAgQHVzZSBcIi4uLy4uLy4uL3N0eWxlcy92YXJpYWJsZXNcIjtcblxuICAgICAgICAuZmVhdHVyZS1jb21pbmctc29vbiB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUNhcmQ7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG5cbiAgICAgICAgICAgICZfX2hlYWRlciB7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgICAgIHBhZGRpbmc6IGNhbGMoMTZweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICAgICAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXJpYWJsZXMuJHRoZW1lQm9yZGVyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmX190aXRsZSB7XG4gICAgICAgICAgICAgICAgZmxleDogMTtcbiAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IGNhbGMoMTZweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgICAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmX19zcGFjZXIge1xuICAgICAgICAgICAgICAgIHdpZHRoOiA0MHB4OyAvKiBtYXRjaGVzIGJ1dHRvbiB3aWR0aCB0byBjZW50ZXIgdGl0bGUgKi9cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJl9fY29udGVudCB7XG4gICAgICAgICAgICAgICAgZmxleDogMTtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiBjYWxjKDMycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICZfX2ljb24td3JhcHBlciB7XG4gICAgICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogY2FsYygyNHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICZfX2hlYWRpbmcge1xuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogY2FsYygyNHB4ICogdmFyKC0tem5zLWZvbnQtc2NhbGUsIDEpKTtcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogNzAwO1xuICAgICAgICAgICAgICAgIG1hcmdpbi1ib3R0b206IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICZfX2Rlc2NyaXB0aW9uIHtcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IGNhbGMoMTZweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgICAgICAgICAgICAgY29sb3I6IHZhcmlhYmxlcy4kdGhlbWVUZXh0TXV0ZWQ7XG4gICAgICAgICAgICAgICAgbWF4LXdpZHRoOiAzMDBweDtcbiAgICAgICAgICAgICAgICBsaW5lLWhlaWdodDogMS41O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }

}]);
//# sourceMappingURL=src_app_shared_feature-coming-soon_component_ts.js.map