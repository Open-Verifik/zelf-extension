"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["src_app_zelf-id_zelf-id_component_ts"],{

/***/ 40723
/*!**********************************************!*\
  !*** ./src/app/zelf-id/zelf-id.component.ts ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZelfIdComponent: () => (/* binding */ ZelfIdComponent)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ 34487);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 12481);


const _c0 = () => ["/home"];
class ZelfIdComponent {
  static ɵfac = function ZelfIdComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ZelfIdComponent)();
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
    type: ZelfIdComponent,
    selectors: [["zelf-id"]],
    decls: 9,
    vars: 2,
    consts: [[1, "zelf-card", "zelf-id"], [1, "zelf-id__header"], [1, "zelf-icon-button", "zelf-icon-button--secondary", "zelf-icon-button--40", 3, "routerLink"], ["width", "22", "height", "14", "viewBox", "0 0 22 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"], [1, "zelf-id__title"], [1, "zelf-id__spacer"], [1, "zelf-id__body"]],
    template: function ZelfIdComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "button", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceSVG"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "svg", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](4, "path", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnamespaceHTML"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "p", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6, "zID");
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](7, "div", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](8, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](1, _c0));
      }
    },
    dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_0__.RouterLink],
    styles: ["@use \"../../styles/variables\";\n\n        [_nghost-%COMP%] {\n            align-items: center;\n            display: flex;\n            flex-direction: column;\n            flex-grow: 1;\n            justify-content: center;\n        }\n\n        .zelf-id[_ngcontent-%COMP%] {\n            &__header {\n                width: 100%;\n                display: flex;\n                align-items: center;\n                padding: 0 0 calc(12px * var(--zns-space-scale, 1));\n                border-bottom: 1px solid variables.$themeBorder;\n            }\n\n            &__title {\n                flex: 1;\n                text-align: center;\n                font-weight: 600;\n                font-size: calc(16px * var(--zns-font-scale, 1));\n                margin: 0;\n                color: variables.$themeText;\n            }\n\n            &__spacer {\n                width: calc(40px * var(--zns-space-scale, 1));\n                flex-shrink: 0;\n            }\n\n            &__body {\n                flex: 1;\n                width: 100%;\n                display: flex;\n                flex-direction: column;\n                align-items: center;\n                justify-content: center;\n            }\n        }\n    \n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvemVsZi1pZC96ZWxmLWlkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQ1EsNkJBQTZCOztRQUU3QjtZQUNJLG1CQUFtQjtZQUNuQixhQUFhO1lBQ2Isc0JBQXNCO1lBQ3RCLFlBQVk7WUFDWix1QkFBdUI7UUFDM0I7O1FBRUE7WUFDSTtnQkFDSSxXQUFXO2dCQUNYLGFBQWE7Z0JBQ2IsbUJBQW1CO2dCQUNuQixtREFBbUQ7Z0JBQ25ELCtDQUErQztZQUNuRDs7WUFFQTtnQkFDSSxPQUFPO2dCQUNQLGtCQUFrQjtnQkFDbEIsZ0JBQWdCO2dCQUNoQixnREFBZ0Q7Z0JBQ2hELFNBQVM7Z0JBQ1QsMkJBQTJCO1lBQy9COztZQUVBO2dCQUNJLDZDQUE2QztnQkFDN0MsY0FBYztZQUNsQjs7WUFFQTtnQkFDSSxPQUFPO2dCQUNQLFdBQVc7Z0JBQ1gsYUFBYTtnQkFDYixzQkFBc0I7Z0JBQ3RCLG1CQUFtQjtnQkFDbkIsdUJBQXVCO1lBQzNCO1FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyJcbiAgICAgICAgQHVzZSBcIi4uLy4uL3N0eWxlcy92YXJpYWJsZXNcIjtcblxuICAgICAgICA6aG9zdCB7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgICAgICBmbGV4LWdyb3c6IDE7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgfVxuXG4gICAgICAgIC56ZWxmLWlkIHtcbiAgICAgICAgICAgICZfX2hlYWRlciB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDAgMCBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgICAgICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJl9fdGl0bGUge1xuICAgICAgICAgICAgICAgIGZsZXg6IDE7XG4gICAgICAgICAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiBjYWxjKDE2cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgICAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICZfX3NwYWNlciB7XG4gICAgICAgICAgICAgICAgd2lkdGg6IGNhbGMoNDBweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICAgICAgICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmX19ib2R5IHtcbiAgICAgICAgICAgICAgICBmbGV4OiAxO1xuICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
  });
}

/***/ }

}]);
//# sourceMappingURL=src_app_zelf-id_zelf-id_component_ts.js.map