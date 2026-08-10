"use strict";
(self["webpackChunkzelf_extension"] = self["webpackChunkzelf_extension"] || []).push([["default-src_app_domain-selection-modal_domain-selection-modal_component_ts"],{

/***/ 74232
/*!****************************************************************************!*\
  !*** ./src/app/domain-selection-modal/domain-selection-modal.component.ts ***!
  \****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DomainSelectionModalComponent: () => (/* binding */ DomainSelectionModalComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 93683);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/bottom-sheet */ 15244);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jsverse/transloco */ 88065);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 34205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 12481);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/button */ 69885);











function DomainSelectionModalComponent_div_0_label_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "label", 9)(1, "div", 10)(2, "div", 11)(3, "img", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("error", function DomainSelectionModalComponent_div_0_label_7_Template_img_error_3_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"]($event.target.src = "assets/icons/zelf_logo.svg");
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "span", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](6, "input", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "svg", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](8, "polyline", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    let tmp_8_0;
    const domain_r4 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("for", "domain-" + domain_r4.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("src", ctx_r1.getDomainIcon(domain_r4), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsanitizeUrl"])("alt", domain_r4.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](".", domain_r4.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("checked", ((tmp_8_0 = ctx_r1.domainForm.get("selectedDomain")) == null ? null : tmp_8_0.value) === domain_r4.name)("id", "domain-" + domain_r4.name)("value", domain_r4.name);
  }
}
function DomainSelectionModalComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 1)(1, "button", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function DomainSelectionModalComponent_div_0_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r1.onCancel());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "svg", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](3, "path", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "h2", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "form", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](7, DomainSelectionModalComponent_div_0_label_7_Template, 9, 7, "label", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "button", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function DomainSelectionModalComponent_div_0_Template_button_click_8_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r1.onConfirm());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const t_r5 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r5("domain_selection.title"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("formGroup", ctx_r1.domainForm);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx_r1.data.domains);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](t_r5("confirm"));
  }
}
class DomainSelectionModalComponent {
  _bottomSheetRef;
  data;
  _formBuilder;
  domainForm;
  constructor(_bottomSheetRef, data, _formBuilder) {
    this._bottomSheetRef = _bottomSheetRef;
    this.data = data;
    this._formBuilder = _formBuilder;
  }
  ngOnInit() {
    this._initForm();
  }
  _initForm() {
    this.domainForm = this._formBuilder.group({
      selectedDomain: [this.data.selectedDomain]
    });
  }
  get selectedDomain() {
    return this.domainForm.get("selectedDomain")?.value || this.data.selectedDomain;
  }
  onConfirm() {
    const selectedDomain = this.domainForm.get("selectedDomain")?.value;
    this._bottomSheetRef.dismiss(selectedDomain);
  }
  onCancel() {
    this._bottomSheetRef.dismiss();
  }
  getDomainIcon(domain) {
    const logoUrl = domain.metadata?.logo || domain.logo;
    if (logoUrl && (logoUrl.startsWith("http://") || logoUrl.startsWith("https://"))) {
      return logoUrl;
    }
    const iconMap = {
      zelf: "assets/icons/zelf_logo.svg",
      avax: "assets/icons/avax_logo.svg",
      bdag: "assets/icons/bdag_logo.png",
      eth: "assets/icons/eth-icon.svg",
      sol: "assets/icons/sol-icon.svg",
      sui: "assets/icons/sui_logo.svg",
      wal: "assets/icons/walrus_logo.png"
    };
    return iconMap[domain.name] || "assets/icons/zelf_logo.svg";
  }
  static ɵfac = function DomainSelectionModalComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || DomainSelectionModalComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_2__.MatBottomSheetRef), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_material_bottom_sheet__WEBPACK_IMPORTED_MODULE_2__.MAT_BOTTOM_SHEET_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormBuilder));
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
    type: DomainSelectionModalComponent,
    selectors: [["domain-selection-modal"]],
    decls: 1,
    vars: 0,
    consts: [["class", "domain-modal", 4, "transloco"], [1, "domain-modal"], ["mat-icon-button", "", 1, "domain-modal__exit", 3, "click"], ["width", "14", "height", "14", "viewBox", "0 0 14 14", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M13.3 0.710703C12.91 0.320703 12.28 0.320703 11.89 0.710703L6.99997 5.5907L2.10997 0.700703C1.71997 0.310703 1.08997 0.310703 0.699971 0.700703C0.309971 1.0907 0.309971 1.7207 0.699971 2.1107L5.58997 7.0007L0.699971 11.8907C0.309971 12.2807 0.309971 12.9107 0.699971 13.3007C1.08997 13.6907 1.71997 13.6907 2.10997 13.3007L6.99997 8.4107L11.89 13.3007C12.28 13.6907 12.91 13.6907 13.3 13.3007C13.69 12.9107 13.69 12.2807 13.3 11.8907L8.40997 7.0007L13.3 2.1107C13.68 1.7307 13.68 1.0907 13.3 0.710703Z"], [1, "modal-title"], [1, "zelf-radio-group", "domain-modal__radio-group", 3, "formGroup"], ["class", "zelf-radio domain-option domain-option--grid", 3, "for", 4, "ngFor", "ngForOf"], [1, "zelf-button", "zelf-button--primary", "zelf-button--wide", 3, "click"], [1, "zelf-radio", "domain-option", "domain-option--grid", 3, "for"], [1, "domain-card"], [1, "domain-icon", "domain-icon--square"], [1, "icon-image", 3, "error", "src", "alt"], [1, "domain-name"], ["formControlName", "selectedDomain", "name", "selectedDomain", "type", "radio", 3, "checked", "id", "value"], ["viewBox", "0 0 21 21"], ["points", "5 10.75 8.5 14.25 16 6"]],
    template: function DomainSelectionModalComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](0, DomainSelectionModalComponent_div_0_Template, 10, 4, "div", 0);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_0__.NgForOf, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_7__.MatIconButton, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.RadioControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormControlName, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__.TranslocoModule, _jsverse_transloco__WEBPACK_IMPORTED_MODULE_4__.TranslocoDirective],
    styles: [".domain-modal[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: min(400px, var(--zns-card-width, 400px));\n  padding: calc(24px * var(--zns-space-scale, 1));\n  box-sizing: border-box;\n  background: var(--zns-theme-background-secondary, #f9f9fc);\n  border-top-left-radius: 32px;\n  border-top-right-radius: 32px;\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  gap: calc(24px * var(--zns-space-scale, 1));\n  font-family: var(--zns-theme-body-family, \"Poppins\", Arial, sans-serif);\n  position: relative;\n  margin: 0 auto;\n}\n.domain-modal__exit[_ngcontent-%COMP%] {\n  align-items: center;\n  background-color: transparent;\n  border-radius: 9999px;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  height: calc(48px * var(--zns-space-scale, 1));\n  justify-content: center;\n  margin: calc(8px * var(--zns-space-scale, 1));\n  min-height: calc(48px * var(--zns-space-scale, 1));\n  min-width: calc(48px * var(--zns-space-scale, 1));\n  outline: none;\n  padding: calc(8px * var(--zns-space-scale, 1));\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: calc(48px * var(--zns-space-scale, 1));\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.domain-modal__exit[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.2s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: var(--zns-theme-text, #181818);\n  height: calc(16px * var(--zns-space-scale, 1));\n  width: calc(16px * var(--zns-space-scale, 1));\n}\n.domain-modal__exit[_ngcontent-%COMP%]:hover {\n  background-color: var(--zns-theme-secondary, #ff5721);\n  color: var(--zns-theme-text, #181818);\n}\n.domain-modal__exit[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: var(--zns-theme-text, #181818);\n}\n.domain-modal__radio-group[_ngcontent-%COMP%] {\n  width: 100%;\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));\n  gap: calc(12px * var(--zns-space-scale, 1));\n}\n\n.modal-title[_ngcontent-%COMP%] {\n  text-align: center;\n  justify-content: center;\n  display: flex;\n  flex-direction: column;\n  color: var(--zns-theme-text, #181818);\n  font-size: calc(14px * var(--zns-font-scale, 1));\n  font-weight: 500;\n  line-height: calc(20px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  margin: calc(42px * var(--zns-space-scale, 1)) auto 0;\n}\n\n.domain-option--grid[_ngcontent-%COMP%] {\n  flex-direction: column;\n  justify-content: center;\n  min-height: auto;\n  padding: calc(12px * var(--zns-space-scale, 1));\n}\n.domain-option--grid[_ngcontent-%COMP%]   input[type=radio][_ngcontent-%COMP%], \n.domain-option--grid[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  margin: -1px;\n  padding: 0;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n}\n.domain-option--grid[_ngcontent-%COMP%]:has(input:checked) {\n  background-color: var(--zns-theme-border, #e3e3e3);\n  outline: 2px solid var(--zns-theme-text, #181818);\n  outline-offset: 2px;\n}\n\n.domain-card[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: calc(8px * var(--zns-space-scale, 1));\n  flex: 1;\n}\n\n.domain-icon[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n}\n.domain-icon--square[_ngcontent-%COMP%] {\n  width: calc(48px * var(--zns-space-scale, 1));\n  height: calc(48px * var(--zns-space-scale, 1));\n  border-radius: 8px;\n  background: transparent;\n}\n\n.icon-image[_ngcontent-%COMP%] {\n  width: calc(32px * var(--zns-space-scale, 1));\n  height: calc(32px * var(--zns-space-scale, 1));\n  object-fit: contain;\n}\n\n.domain-name[_ngcontent-%COMP%] {\n  text-align: center;\n  color: var(--zns-theme-text, #181818);\n  font-size: calc(12px * var(--zns-font-scale, 1));\n  font-weight: 600;\n  line-height: calc(16px * var(--zns-font-scale, 1));\n  letter-spacing: 0.1px;\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n[_nghost-%COMP%]     .mat-mdc-dialog-container {\n  padding: 0 !important;\n  border-radius: 32px 32px 0 0 !important;\n  overflow: hidden !important;\n}\n\n[_nghost-%COMP%]     .mat-mdc-dialog-surface {\n  border-radius: 32px 32px 0 0 !important;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvZG9tYWluLXNlbGVjdGlvbi1tb2RhbC9kb21haW4tc2VsZWN0aW9uLW1vZGFsLmNvbXBvbmVudC5zY3NzIiwid2VicGFjazovLy4vc3JjL3N0eWxlcy9fdmFyaWFibGVzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDSSxXQUFBO0VBQ0EsbURBQUE7RUFDQSwrQ0FBQTtFQUNBLHNCQUFBO0VBQ0EsMERDc0J1QjtFRHJCdkIsNEJBQUE7RUFDQSw2QkFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLDJCQUFBO0VBQ0EsbUJBQUE7RUFDQSwyQ0FBQTtFQUNBLHVFQ1NjO0VEUmQsa0JBQUE7RUFDQSxjQUFBO0FBREo7QUFHSTtFQUNJLG1CQUFBO0VBQ0EsNkJBQUE7RUFDQSxxQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLDhDQUFBO0VBQ0EsdUJBQUE7RUFDQSw2Q0FBQTtFQUNBLGtEQUFBO0VBQ0EsaURBQUE7RUFDQSxhQUFBO0VBQ0EsOENBQUE7RUFDQSxrQkFBQTtFQUNBLFFBQUE7RUFDQSxNQUFBO0VBQ0EsNkNBQUE7RUFDQSw2R0FDSTtBQUZaO0FBS1E7RUFDSSxxREFBQTtFQUNBLG9DQ1pBO0VEYUEsOENBQUE7RUFDQSw2Q0FBQTtBQUhaO0FBTVE7RUFDSSxxREMvQ0s7RURnREwscUNDbkJBO0FEZVo7QUFNWTtFQUNJLG9DQ3RCSjtBRGtCWjtBQVNJO0VBQ0ksV0FBQTtFQUNBLGFBQUE7RUFDQSwyREFBQTtFQUNBLDJDQUFBO0FBUFI7O0FBV0E7RUFDSSxrQkFBQTtFQUNBLHVCQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EscUNDeENRO0VEeUNSLGdEQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrREFBQTtFQUNBLHFCQUFBO0VBQ0EscURBQUE7QUFSSjs7QUFXQTtFQUNJLHNCQUFBO0VBQ0EsdUJBQUE7RUFDQSxnQkFBQTtFQUNBLCtDQUFBO0FBUko7QUFVSTs7RUFFSSxrQkFBQTtFQUNBLFVBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLFVBQUE7RUFDQSxnQkFBQTtFQUNBLHNCQUFBO0VBQ0EsU0FBQTtBQVJSO0FBV0k7RUFDSSxrRENwRE07RURxRE4saURBQUE7RUFDQSxtQkFBQTtBQVRSOztBQWFBO0VBQ0ksYUFBQTtFQUNBLHNCQUFBO0VBQ0EsbUJBQUE7RUFDQSwwQ0FBQTtFQUNBLE9BQUE7QUFWSjs7QUFhQTtFQUNJLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsZ0JBQUE7QUFWSjtBQVlJO0VBQ0ksNkNBQUE7RUFDQSw4Q0FBQTtFQUNBLGtCQUFBO0VBQ0EsdUJBQUE7QUFWUjs7QUFjQTtFQUNJLDZDQUFBO0VBQ0EsOENBQUE7RUFDQSxtQkFBQTtBQVhKOztBQWNBO0VBQ0ksa0JBQUE7RUFDQSxxQ0N2R1E7RUR3R1IsZ0RBQUE7RUFDQSxnQkFBQTtFQUNBLGtEQUFBO0VBQ0EscUJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSx1QkFBQTtBQVhKOztBQWVBO0VBQ0kscUJBQUE7RUFDQSx1Q0FBQTtFQUNBLDJCQUFBO0FBWko7O0FBZUE7RUFDSSx1Q0FBQTtBQVpKIiwic291cmNlc0NvbnRlbnQiOlsiQHVzZSBcIi4uLy4uL3N0eWxlcy92YXJpYWJsZXNcIjtcblxuLmRvbWFpbi1tb2RhbCB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgbWF4LXdpZHRoOiBtaW4oNDAwcHgsIHZhcigtLXpucy1jYXJkLXdpZHRoLCA0MDBweCkpO1xuICAgIHBhZGRpbmc6IGNhbGMoMjRweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgYmFja2dyb3VuZDogdmFyaWFibGVzLiR0aGVtZUJhY2tncm91bmRTZWNvbmRhcnk7XG4gICAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogMzJweDtcbiAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMzJweDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiBjYWxjKDI0cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICBmb250LWZhbWlseTogdmFyaWFibGVzLiR0aGVtZUJvZHlGYW1pbHk7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIG1hcmdpbjogMCBhdXRvO1xuXG4gICAgJl9fZXhpdCB7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBoZWlnaHQ6IGNhbGMoNDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgbWFyZ2luOiBjYWxjKDhweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuICAgICAgICBtaW4taGVpZ2h0OiBjYWxjKDQ4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgbWluLXdpZHRoOiBjYWxjKDQ4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgb3V0bGluZTogbm9uZTtcbiAgICAgICAgcGFkZGluZzogY2FsYyg4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgICByaWdodDogMDtcbiAgICAgICAgdG9wOiAwO1xuICAgICAgICB3aWR0aDogY2FsYyg0OHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIHRyYW5zaXRpb246XG4gICAgICAgICAgICBjb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyLFxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvciAwLjJzIHZhcmlhYmxlcy4kc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBmaWxsIDAuMnMgdmFyaWFibGVzLiRzbW9vdGhCZXppZXI7XG4gICAgICAgICAgICBmaWxsOiB2YXJpYWJsZXMuJHRoZW1lVGV4dDtcbiAgICAgICAgICAgIGhlaWdodDogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgICAgICB3aWR0aDogY2FsYygxNnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcmlhYmxlcy4kc2Vjb25kYXJ5Q29sb3I7XG4gICAgICAgICAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19yYWRpby1ncm91cCB7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBkaXNwbGF5OiBncmlkO1xuICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdChhdXRvLWZpbGwsIG1pbm1heCg4MHB4LCAxZnIpKTtcbiAgICAgICAgZ2FwOiBjYWxjKDEycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICB9XG59XG5cbi5tb2RhbC10aXRsZSB7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgZm9udC1zaXplOiBjYWxjKDE0cHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgbGluZS1oZWlnaHQ6IGNhbGMoMjBweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuMXB4O1xuICAgIG1hcmdpbjogY2FsYyg0MnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSkgYXV0byAwO1xufVxuXG4uZG9tYWluLW9wdGlvbi0tZ3JpZCB7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBtaW4taGVpZ2h0OiBhdXRvO1xuICAgIHBhZGRpbmc6IGNhbGMoMTJweCAqIHZhcigtLXpucy1zcGFjZS1zY2FsZSwgMSkpO1xuXG4gICAgaW5wdXRbdHlwZT1cInJhZGlvXCJdLFxuICAgIHN2ZyB7XG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgd2lkdGg6IDFweDtcbiAgICAgICAgaGVpZ2h0OiAxcHg7XG4gICAgICAgIG1hcmdpbjogLTFweDtcbiAgICAgICAgcGFkZGluZzogMDtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgY2xpcDogcmVjdCgwLCAwLCAwLCAwKTtcbiAgICAgICAgYm9yZGVyOiAwO1xuICAgIH1cblxuICAgICY6aGFzKGlucHV0OmNoZWNrZWQpIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyaWFibGVzLiR0aGVtZUJvcmRlcjtcbiAgICAgICAgb3V0bGluZTogMnB4IHNvbGlkIHZhcmlhYmxlcy4kdGhlbWVUZXh0O1xuICAgICAgICBvdXRsaW5lLW9mZnNldDogMnB4O1xuICAgIH1cbn1cblxuLmRvbWFpbi1jYXJkIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IGNhbGMoOHB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgZmxleDogMTtcbn1cblxuLmRvbWFpbi1pY29uIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcblxuICAgICYtLXNxdWFyZSB7XG4gICAgICAgIHdpZHRoOiBjYWxjKDQ4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgaGVpZ2h0OiBjYWxjKDQ4cHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICB9XG59XG5cbi5pY29uLWltYWdlIHtcbiAgICB3aWR0aDogY2FsYygzMnB4ICogdmFyKC0tem5zLXNwYWNlLXNjYWxlLCAxKSk7XG4gICAgaGVpZ2h0OiBjYWxjKDMycHggKiB2YXIoLS16bnMtc3BhY2Utc2NhbGUsIDEpKTtcbiAgICBvYmplY3QtZml0OiBjb250YWluO1xufVxuXG4uZG9tYWluLW5hbWUge1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBjb2xvcjogdmFyaWFibGVzLiR0aGVtZVRleHQ7XG4gICAgZm9udC1zaXplOiBjYWxjKDEycHggKiB2YXIoLS16bnMtZm9udC1zY2FsZSwgMSkpO1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgbGluZS1oZWlnaHQ6IGNhbGMoMTZweCAqIHZhcigtLXpucy1mb250LXNjYWxlLCAxKSk7XG4gICAgbGV0dGVyLXNwYWNpbmc6IDAuMXB4O1xuICAgIG1heC13aWR0aDogMTAwJTtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xufVxuXG4vLyBPdmVycmlkZSBNYXRlcmlhbCBEaWFsb2cgc3R5bGVzXG46aG9zdCA6Om5nLWRlZXAgLm1hdC1tZGMtZGlhbG9nLWNvbnRhaW5lciB7XG4gICAgcGFkZGluZzogMCAhaW1wb3J0YW50O1xuICAgIGJvcmRlci1yYWRpdXM6IDMycHggMzJweCAwIDAgIWltcG9ydGFudDtcbiAgICBvdmVyZmxvdzogaGlkZGVuICFpbXBvcnRhbnQ7XG59XG5cbjpob3N0IDo6bmctZGVlcCAubWF0LW1kYy1kaWFsb2ctc3VyZmFjZSB7XG4gICAgYm9yZGVyLXJhZGl1czogMzJweCAzMnB4IDAgMCAhaW1wb3J0YW50O1xufVxuIiwiJHByaW1hcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXByaW1hcnksICMxODE4MTgpO1xuJHByaW1hcnlMaWdodDogI2RhZGRmYTtcbiRzZWNvbmRhcnlDb2xvcjogdmFyKC0tem5zLXRoZW1lLXNlY29uZGFyeSwgI2ZmNTcyMSk7XG4kc2Vjb25kYXJ5Q29sb3JMaWdodDogI2Y2ZTVlMDtcblxuJGNvcnJlY3Q6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLCAjMWVhNDQ2KTtcbiRjb3JyZWN0RGFyazogIzBmNTIyMztcbiRjb3JyZWN0TGlnaHQ6IHZhcigtLXpucy10aGVtZS1zdWNjZXNzLXRleHQsICNlN2Y4ZWQpO1xuXG4kZXJyb3I6IHZhcigtLXpucy10aGVtZS1lcnJvciwgI2RjMzYyZSk7XG4kZXJyb3JEYXJrOiAjNjAxNDEwO1xuJGVycm9yTGlnaHQ6IHZhcigtLXpucy10aGVtZS1lcnJvci10ZXh0LCAjZmNlZWVlKTtcblxuJHdhcm5pbmc6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLCAjZGU2ODAwKTtcbiR3YXJuaW5nRGFyazogIzRhMjEwYTtcbiR3YXJuaW5nTGlnaHQ6IHZhcigtLXpucy10aGVtZS13YXJuaW5nLXRleHQsICNmZmVlZTkpO1xuXG4kaW5mbzogIzM5OThkMztcbiRpbmZvRGFyazogIzAwNGE3NztcbiRpbmZvTGlnaHQ6ICNlY2YzZmU7XG5cbiRibGFjazogIzE4MTgxODtcbiR3aGl0ZTogI2ZmZmZmZjtcblxuJHRoZW1lQm9keUZhbWlseTogdmFyKC0tem5zLXRoZW1lLWJvZHktZmFtaWx5LCBcIlBvcHBpbnNcIiwgQXJpYWwsIHNhbnMtc2VyaWYpO1xuJHRoZW1lVGl0bGVGYW1pbHk6IHZhcigtLXpucy10aGVtZS10aXRsZS1mYW1pbHksIFwiTWVuZGFcIiwgXCJBcmlhbCBCbGFja1wiLCBzYW5zLXNlcmlmKTtcbiR0aGVtZU1vbm9zcGFjZUZhbWlseTogdmFyKC0tem5zLXRoZW1lLW1vbm9zcGFjZS1mYW1pbHksIFwiQ291cmllciBOZXdcIiwgQ291cmllciwgbW9ub3NwYWNlKTtcblxuJHRoZW1lQmFja2dyb3VuZDogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQsICNmZmZmZmYpO1xuJHRoZW1lQmFja2dyb3VuZFNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJhY2tncm91bmQtc2Vjb25kYXJ5LCAjZjlmOWZjKTtcblxuJHRoZW1lVGV4dDogdmFyKC0tem5zLXRoZW1lLXRleHQsICMxODE4MTgpO1xuJHRoZW1lVGV4dE11dGVkOiB2YXIoLS16bnMtdGhlbWUtdGV4dC1tdXRlZCwgIzk2OTM5ZSk7XG4kdGhlbWVUZXh0U2Vjb25kYXJ5OiB2YXIoLS16bnMtdGhlbWUtdGV4dC1zZWNvbmRhcnksICM3Mzc3N2YpO1xuXG4kdGhlbWVIZWFkZXI6IHZhcigtLXpucy10aGVtZS1oZWFkZXIsICMxODE4MTgpO1xuJHRoZW1lSGVhZGVyVGV4dDogdmFyKC0tem5zLXRoZW1lLWhlYWRlci10ZXh0LCAjZmZmZmZmKTtcblxuJHRoZW1lQnV0dG9uOiB2YXIoLS16bnMtdGhlbWUtYnV0dG9uLCAjMTgxODE4KTtcbiR0aGVtZUJ1dHRvblRleHQ6IHZhcigtLXpucy10aGVtZS1idXR0b24tdGV4dCwgI2ZmZmZmZik7XG4kdGhlbWVCdXR0b25Ib3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1ob3ZlciwgI2ZmNTcyMSk7XG5cbiR0aGVtZUJ1dHRvblNlY29uZGFyeTogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnksICNlOWVjZWYpO1xuJHRoZW1lQnV0dG9uU2Vjb25kYXJ5VGV4dDogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktdGV4dCwgIzQ5NTA1Nyk7XG4kdGhlbWVCdXR0b25TZWNvbmRhcnlIb3ZlcjogdmFyKC0tem5zLXRoZW1lLWJ1dHRvbi1zZWNvbmRhcnktaG92ZXIsICNlOWVjZWYpO1xuXG4kdGhlbWVCb3JkZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXIsICNlM2UzZTMpO1xuJHRoZW1lQm9yZGVySG92ZXI6IHZhcigtLXpucy10aGVtZS1ib3JkZXItaG92ZXIsICNjM2M2Y2YpO1xuXG4kdGhlbWVDYXJkOiB2YXIoLS16bnMtdGhlbWUtY2FyZCwgI2ZmZmZmZik7XG4kdGhlbWVDYXJkQm9yZGVyOiB2YXIoLS16bnMtdGhlbWUtY2FyZC1ib3JkZXIsICNlZWVkZjEpO1xuXG4kdGhlbWVTaGFkb3c6IHZhcigtLXpucy10aGVtZS1zaGFkb3csIHJnYmEoMCwgMCwgMCwgMC4xKSk7XG5cbiRzbW9vdGhCZXppZXI6IGN1YmljLWJlemllcigwLjI1LCAwLjQsIDAuNywgMSk7XG5cbiRtYXhFeHRyYVNtYWxsOiA1OTVweDtcbiRtaW5TbWFsbDogNjAwcHg7XG4kbWVkaXVtOiA3NjhweDtcbiRsYXJnZTogODg5cHg7XG4kY29tcHV0ZXJzOiAxMjAwcHg7XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
  });
}

/***/ }

}]);
//# sourceMappingURL=default-src_app_domain-selection-modal_domain-selection-modal_component_ts.js.map