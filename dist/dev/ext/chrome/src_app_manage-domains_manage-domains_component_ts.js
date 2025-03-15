"use strict";
(self["webpackChunkverifik_wallet_extension"] = self["webpackChunkverifik_wallet_extension"] || []).push([["src_app_manage-domains_manage-domains_component_ts"],{

/***/ 7560:
/*!**********************************************************************!*\
  !*** ./src/app/confirmation-dialog/confirmation-dialog.component.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConfirmationDialogComponent: () => (/* binding */ ConfirmationDialogComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/dialog */ 12587);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37580);





function ConfirmationDialogComponent_p_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "p", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r0.message);
  }
}
class ConfirmationDialogComponent {
  constructor(data, dialogRef) {
    this.dialogRef = dialogRef;
    this.cancel = data.cancel;
    this.confirm = data.confirm;
    this.message = data.message || "";
    this.title = data.title;
  }
  onConfirm() {
    this.dialogRef.close(true);
  }
  onCancel() {
    this.dialogRef.close(false);
  }
  static {
    this.ɵfac = function ConfirmationDialogComponent_Factory(t) {
      return new (t || ConfirmationDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MAT_DIALOG_DATA), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__.MatDialogRef));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: ConfirmationDialogComponent,
      selectors: [["confirmation-dialog"]],
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
      decls: 9,
      vars: 4,
      consts: [[1, "dialog"], [1, "dialog__title"], ["class", "dialog__message", 4, "ngIf"], [1, "dialog__actions"], [1, "zelf-button", "zelf-button--outlined", 3, "click"], [1, "zelf-button", "zelf-button--black", 3, "click"], [1, "dialog__message"]],
      template: function ConfirmationDialogComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "h2", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, ConfirmationDialogComponent_p_3_Template, 2, 1, "p", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 3)(5, "button", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ConfirmationDialogComponent_Template_button_click_5_listener() {
            return ctx.onCancel();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "button", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ConfirmationDialogComponent_Template_button_click_7_listener() {
            return ctx.onConfirm();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.title);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.message);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.cancel);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.confirm);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_material_button__WEBPACK_IMPORTED_MODULE_3__.MatButtonModule],
      styles: ["[_nghost-%COMP%] {\n  display: block;\n  padding: 32px;\n}\n\n.dialog__title[_ngcontent-%COMP%] {\n  font-size: 24px;\n  font-weight: 500;\n  margin-bottom: 16px;\n  font-family: Menda;\n  margin: 0;\n}\n.dialog__message[_ngcontent-%COMP%] {\n  font-size: 16px;\n  font-family: Poppins;\n  margin-top: 16px;\n  margin-bottom: 8px;\n}\n.dialog__actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  margin-top: 32px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpcm1hdGlvbi1kaWFsb2cuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDQyxjQUFBO0VBQ0EsYUFBQTtBQUNEOztBQUdDO0VBQ0MsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLFNBQUE7QUFBRjtBQUdDO0VBQ0MsZUFBQTtFQUNBLG9CQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQkFBQTtBQURGO0FBSUM7RUFDQyxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxnQkFBQTtBQUZGIiwiZmlsZSI6ImNvbmZpcm1hdGlvbi1kaWFsb2cuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7XG5cdGRpc3BsYXk6IGJsb2NrO1xuXHRwYWRkaW5nOiAzMnB4O1xufVxuXG4uZGlhbG9nIHtcblx0Jl9fdGl0bGUge1xuXHRcdGZvbnQtc2l6ZTogMjRweDtcblx0XHRmb250LXdlaWdodDogNTAwO1xuXHRcdG1hcmdpbi1ib3R0b206IDE2cHg7XG5cdFx0Zm9udC1mYW1pbHk6IE1lbmRhO1xuXHRcdG1hcmdpbjogMDtcblx0fVxuXG5cdCZfX21lc3NhZ2Uge1xuXHRcdGZvbnQtc2l6ZTogMTZweDtcblx0XHRmb250LWZhbWlseTogUG9wcGlucztcblx0XHRtYXJnaW4tdG9wOiAxNnB4O1xuXHRcdG1hcmdpbi1ib3R0b206IDhweDtcblx0fVxuXG5cdCZfX2FjdGlvbnMge1xuXHRcdGRpc3BsYXk6IGZsZXg7XG5cdFx0anVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuXHRcdG1hcmdpbi10b3A6IDMycHg7XG5cdH1cbn1cbiJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY29uZmlybWF0aW9uLWRpYWxvZy9jb25maXJtYXRpb24tZGlhbG9nLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0MsY0FBQTtFQUNBLGFBQUE7QUFDRDs7QUFHQztFQUNDLGVBQUE7RUFDQSxnQkFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxTQUFBO0FBQUY7QUFHQztFQUNDLGVBQUE7RUFDQSxvQkFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7QUFERjtBQUlDO0VBQ0MsYUFBQTtFQUNBLDhCQUFBO0VBQ0EsZ0JBQUE7QUFGRjtBQUNBLDRpQ0FBNGlDIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3Qge1xuXHRkaXNwbGF5OiBibG9jaztcblx0cGFkZGluZzogMzJweDtcbn1cblxuLmRpYWxvZyB7XG5cdCZfX3RpdGxlIHtcblx0XHRmb250LXNpemU6IDI0cHg7XG5cdFx0Zm9udC13ZWlnaHQ6IDUwMDtcblx0XHRtYXJnaW4tYm90dG9tOiAxNnB4O1xuXHRcdGZvbnQtZmFtaWx5OiBNZW5kYTtcblx0XHRtYXJnaW46IDA7XG5cdH1cblxuXHQmX19tZXNzYWdlIHtcblx0XHRmb250LXNpemU6IDE2cHg7XG5cdFx0Zm9udC1mYW1pbHk6IFBvcHBpbnM7XG5cdFx0bWFyZ2luLXRvcDogMTZweDtcblx0XHRtYXJnaW4tYm90dG9tOiA4cHg7XG5cdH1cblxuXHQmX19hY3Rpb25zIHtcblx0XHRkaXNwbGF5OiBmbGV4O1xuXHRcdGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2Vlbjtcblx0XHRtYXJnaW4tdG9wOiAzMnB4O1xuXHR9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}


/***/ }),

/***/ 23512:
/*!************************************************************!*\
  !*** ./src/app/manage-domains/manage-domains.component.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ManageDomainsComponent: () => (/* binding */ ManageDomainsComponent)
/* harmony export */ });
/* harmony import */ var _Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 81890);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/icon */ 93840);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/menu */ 31034);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _ngneat_transloco__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @ngneat/transloco */ 40261);
/* harmony import */ var app_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! app/confirmation-dialog/confirmation-dialog.component */ 7560);
/* harmony import */ var app_pipes_first_letter_pipe__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! app/pipes/first-letter.pipe */ 75465);
/* harmony import */ var app_pipes_timer_pipe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! app/pipes/timer.pipe */ 56527);
/* harmony import */ var app_pipes_zelf_name_pipe__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! app/pipes/zelf-name.pipe */ 20655);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 33900);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var app_chrome_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! app/chrome.service */ 85043);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/dialog */ 12587);
/* harmony import */ var app_wallet_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! app/wallet.service */ 69556);




















function ManageDomainsComponent_div_0_div_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](0, "div", 21);
  }
}
function ManageDomainsComponent_div_0_ng_container_15_div_2_div_15_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainer"](0);
  }
}
function ManageDomainsComponent_div_0_ng_container_15_div_2_div_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](1, ManageDomainsComponent_div_0_ng_container_15_div_2_div_15_ng_container_1_Template, 1, 0, "ng-container", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](3);
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngTemplateOutlet", _r7);
  }
}
function ManageDomainsComponent_div_0_ng_container_15_div_2_div_16_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainer"](0);
  }
}
function ManageDomainsComponent_div_0_ng_container_15_div_2_div_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](1, ManageDomainsComponent_div_0_ng_container_15_div_2_div_16_ng_container_1_Template, 1, 0, "ng-container", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](3);
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](26);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngTemplateOutlet", _r9);
  }
}
function ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_div_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainer"](0);
  }
}
function ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](1, ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_div_2_ng_container_1_Template, 1, 0, "ng-container", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](4);
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngTemplateOutlet", _r7);
  }
}
function ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_div_3_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainer"](0);
  }
}
function ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](1, ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_div_3_ng_container_1_Template, 1, 0, "ng-container", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](4);
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](26);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngTemplateOutlet", _r9);
  }
}
function ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_p_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "p", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](4).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](t_r1("manage_domains.domain_warning"));
  }
}
const _c0 = function (a0) {
  return {
    zelfName: a0
  };
};
function ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_p_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "p", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const wallet_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2).$implicit;
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", t_r1("manage_domains.domain_error", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction1"](1, _c0, wallet_r12.publicData == null ? null : wallet_r12.publicData.zelfName)), " ");
  }
}
function ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_p_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "p", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "svg", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "path", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](5, "timer");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const wallet_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](5, 1, wallet_r12.publicData == null ? null : wallet_r12.publicData.expiresAt));
  }
}
function ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_button_8_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainer"](0);
  }
}
const _c1 = function () {
  return ["/domain-purchase"];
};
function ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_button_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "button", 65)(1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](3, ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_button_8_ng_container_3_Template, 1, 0, "ng-container", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const wallet_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2).$implicit;
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2).$implicit;
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](22);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction0"](4, _c1))("queryParams", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction1"](5, _c0, wallet_r12.publicData == null ? null : wallet_r12.publicData.zelfName));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](t_r1("common.buy_now"));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngTemplateOutlet", _r5);
  }
}
function ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_button_9_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainer"](0);
  }
}
function ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_button_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "button", 66)(1, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](3, ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_button_9_ng_container_3_Template, 1, 0, "ng-container", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](4).$implicit;
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](22);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](t_r1("common.renew_domain"));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngTemplateOutlet", _r5);
  }
}
function ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 50)(1, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](2, ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_div_2_Template, 2, 1, "div", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](3, ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_div_3_Template, 2, 1, "div", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](4, ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_p_4_Template, 2, 1, "p", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](5, ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_p_5_Template, 2, 3, "p", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](6, ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_p_6_Template, 6, 3, "p", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](8, ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_button_8_Template, 4, 7, "button", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](9, ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_button_9_Template, 4, 2, "button", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const wallet_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", wallet_r12.publicData == null ? null : wallet_r12.publicData.isExpiringSoon);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", wallet_r12.publicData == null ? null : wallet_r12.publicData.isExpired);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", wallet_r12.publicData == null ? null : wallet_r12.publicData.isExpiringSoon);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", wallet_r12.publicData == null ? null : wallet_r12.publicData.isExpired);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", wallet_r12.publicData == null ? null : wallet_r12.publicData.isExpiringSoon);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", wallet_r12.publicData == null ? null : wallet_r12.publicData.isExpiringSoon);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", wallet_r12.publicData == null ? null : wallet_r12.publicData.isExpired);
  }
}
const _c2 = function () {
  return ["/domain"];
};
const _c3 = function (a0, a1) {
  return {
    "domain__avatar--primary": a0,
    "domain__avatar--secondary": a1
  };
};
function ManageDomainsComponent_div_0_ng_container_15_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r39 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 24)(1, "div", 25)(2, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "svg", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](4, "path", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "div", 29)(6, "div", 30)(7, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](9, "firstLetter");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](10, "div", 32)(11, "h4", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](13, "zelfName");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](14, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](15, ManageDomainsComponent_div_0_ng_container_15_div_2_div_15_Template, 2, 1, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](16, ManageDomainsComponent_div_0_ng_container_15_div_2_div_16_Template, 2, 1, "div", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](17, "button", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](18, "svg", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](19, "path", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](20, "mat-menu", 40, 41)(22, "button", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function ManageDomainsComponent_div_0_ng_container_15_div_2_Template_button_click_22_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r39);
      const wallet_r12 = restoredCtx.$implicit;
      const ctx_r38 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r38.logoutOfWallet(wallet_r12));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](23, "span", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](25, "mat-icon", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](26, "svg", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](27, "path", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](28, ManageDomainsComponent_div_0_ng_container_15_div_2_div_28_Template, 10, 7, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const wallet_r12 = ctx.$implicit;
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](21);
    const t_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2).$implicit;
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction0"](14, _c2))("queryParams", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction1"](15, _c0, wallet_r12.publicData == null ? null : wallet_r12.publicData.zelfName));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction2"](17, _c3, (wallet_r12.publicData == null ? null : wallet_r12.publicData.type) === "mainnet", (wallet_r12.publicData == null ? null : wallet_r12.publicData.type) === "hold"));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](9, 10, wallet_r12.publicData == null ? null : wallet_r12.publicData.zelfName));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](13, 12, wallet_r12.publicData == null ? null : wallet_r12.publicData.zelfName));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", wallet_r12.publicData == null ? null : wallet_r12.publicData.isExpiringSoon);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", wallet_r12.publicData == null ? null : wallet_r12.publicData.isExpired);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("matMenuTriggerFor", _r15);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](t_r1("common.logout"));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx_r11.showDetails(wallet_r12));
  }
}
function ManageDomainsComponent_div_0_ng_container_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](2, ManageDomainsComponent_div_0_ng_container_15_div_2_Template, 29, 20, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx_r3.wallets);
  }
}
function ManageDomainsComponent_div_0_ng_container_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementContainer"](0);
  }
}
function ManageDomainsComponent_div_0_ng_template_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "svg", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "path", 67)(2, "path", 68)(3, "path", 69)(4, "path", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function ManageDomainsComponent_div_0_ng_template_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "svg", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "path", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function ManageDomainsComponent_div_0_ng_template_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "svg", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "path", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
const _c4 = function () {
  return ["/home"];
};
const _c5 = function () {
  return ["/onboarding"];
};
function ManageDomainsComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 1)(1, "div", 2)(2, "div", 3)(3, "button", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "svg", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](5, "path", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](6, "div", 7)(7, "p", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "div", 9)(10, "button", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](11, "svg", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](12, "path", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](13, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](14, ManageDomainsComponent_div_0_div_14_Template, 1, 0, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](15, ManageDomainsComponent_div_0_ng_container_15_Template, 3, 1, "ng-container", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](16, "div", 15)(17, "button", 16)(18, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](19);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](20, ManageDomainsComponent_div_0_ng_container_20_Template, 1, 0, "ng-container", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](21, ManageDomainsComponent_div_0_ng_template_21_Template, 5, 0, "ng-template", null, 18, _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](23, ManageDomainsComponent_div_0_ng_template_23_Template, 2, 0, "ng-template", null, 19, _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](25, ManageDomainsComponent_div_0_ng_template_25_Template, 2, 0, "ng-template", null, 20, _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const t_r1 = ctx.$implicit;
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](22);
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction0"](8, _c4));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](t_r1("common.manage_domains"));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction0"](9, _c5));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx_r0.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", !ctx_r0.loading);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction0"](10, _c5));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](t_r1("manage_domains.purchase_new_domain"));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngTemplateOutlet", _r5);
  }
}
class ManageDomainsComponent {
  constructor(_changeDetectorRef, _chromeService, _dialog, _router, _translocoService, _walletService) {
    this._changeDetectorRef = _changeDetectorRef;
    this._chromeService = _chromeService;
    this._dialog = _dialog;
    this._router = _router;
    this._translocoService = _translocoService;
    this._walletService = _walletService;
    this.unsubscriber$ = new rxjs__WEBPACK_IMPORTED_MODULE_8__.Subject();
    this.wallets = [];
    this.loading = false;
    this._loadWallets = () => {
      if (this.loading) return;
      this.loading = true;
      this._setWallets();
    };
    this._chromeService.onWalletChanged$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_9__.takeUntil)(this.unsubscriber$)).subscribe(this._loadWallets);
    this._chromeService.onWalletsChanged$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_9__.takeUntil)(this.unsubscriber$)).subscribe(this._loadWallets);
  }
  ngOnInit() {
    this._loadWallets();
  }
  ngOnDestroy() {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
  _openConfirmationDialog() {
    var _this = this;
    const dialogRef = this._dialog.open(app_confirmation_dialog_confirmation_dialog_component__WEBPACK_IMPORTED_MODULE_1__.ConfirmationDialogComponent, {
      panelClass: "zelf-dialog",
      backdropClass: "zelf-backdrop",
      data: {
        message: this._translocoService.translate("last_wallet_logout"),
        confirm: this._translocoService.translate("confirm"),
        cancel: this._translocoService.translate("cancel"),
        title: this._translocoService.translate("logout_of_wallet_confirm")
      }
    });
    dialogRef.afterClosed().subscribe( /*#__PURE__*/function () {
      var _ref = (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (confirmed) {
        if (!confirmed) return;
        _this._chromeService.removeItem("wallet");
        _this._chromeService.removeItem("wallets");
        _this._router.navigate(["/onboarding"]);
      });
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  }
  _setWallets() {
    var _this2 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const {
        wallet,
        wallets
      } = yield _this2._walletService.getAllWalletsFromStorage();
      _this2.wallets = [wallet || {}, ...wallets];
      _this2.loading = false;
      _this2._changeDetectorRef.detectChanges();
    })();
  }
  goToPayments() {
    window.open("https://payment.zelf.world", "_blank");
  }
  logoutOfWallet(wallet) {
    var _this3 = this;
    return (0,_Users_miguel_verifik_verifik_wallet_extension_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!wallet.name) return;
      const isLastWallet = yield _this3._walletService.logoutOfWallet(wallet);
      if (!isLastWallet) return;
      _this3._openConfirmationDialog();
    })();
  }
  showDetails(wallet) {
    return Boolean(wallet.publicData?.isExpired || wallet.publicData?.isExpiringSoon);
  }
  static {
    this.ɵfac = function ManageDomainsComponent_Factory(t) {
      return new (t || ManageDomainsComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_7__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](app_chrome_service__WEBPACK_IMPORTED_MODULE_5__.ChromeService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_10__.MatDialog), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_11__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_ngneat_transloco__WEBPACK_IMPORTED_MODULE_12__.TranslocoService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](app_wallet_service__WEBPACK_IMPORTED_MODULE_6__.WalletService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({
      type: ManageDomainsComponent,
      selectors: [["manage-domains"]],
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵStandaloneFeature"]],
      decls: 1,
      vars: 0,
      consts: [["class", "manage-domains", 4, "transloco"], [1, "manage-domains"], [1, "manage-domains__header"], [1, "manage-domains__col1"], ["mat-icon-button", "", "mat-flat-button", "", 1, "manage-domains__top-button", 3, "routerLink"], ["width", "22", "height", "14", "viewBox", "0 0 22 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"], [1, "manage-domains__col2"], [1, "manage-domains__title"], [1, "manage-domains__col3"], ["width", "18", "height", "18", "viewBox", "0 0 18 18", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M16 10.1673H10.1667V16.0007C10.1667 16.6423 9.64168 17.1673 9.00001 17.1673C8.35834 17.1673 7.83334 16.6423 7.83334 16.0007V10.1673H2.00001C1.35834 10.1673 0.833344 9.64232 0.833344 9.00065C0.833344 8.35898 1.35834 7.83398 2.00001 7.83398H7.83334V2.00065C7.83334 1.35898 8.35834 0.833984 9.00001 0.833984C9.64168 0.833984 10.1667 1.35898 10.1667 2.00065V7.83398H16C16.6417 7.83398 17.1667 8.35898 17.1667 9.00065C17.1667 9.64232 16.6417 10.1673 16 10.1673Z"], [1, "manage-domains__content"], ["class", "ripple ripple--96", 4, "ngIf"], [4, "ngIf"], [1, "manage-domains__footer"], ["mat-flat-button", "", 1, "zelf-button", "zelf-button--outlined", "zelf-button--wide", 3, "routerLink"], [4, "ngTemplateOutlet"], ["zelfLogo", ""], ["warningIcon", ""], ["errorIcon", ""], [1, "ripple", "ripple--96"], [1, "domains"], ["class", "domain", 4, "ngFor", "ngForOf"], [1, "domain"], [1, "domain__display"], [1, "domain__dots"], ["width", "10", "height", "16", "viewBox", "0 0 10 16", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M4 14C4 15.1 3.1 16 2 16C0.9 16 0 15.1 0 14C0 12.9 0.9 12 2 12C3.1 12 4 12.9 4 14ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM8 4C9.1 4 10 3.1 10 2C10 0.9 9.1 0 8 0C6.9 0 6 0.9 6 2C6 3.1 6.9 4 8 4ZM8 6C6.9 6 6 6.9 6 8C6 9.1 6.9 10 8 10C9.1 10 10 9.1 10 8C10 6.9 9.1 6 8 6ZM8 12C6.9 12 6 12.9 6 14C6 15.1 6.9 16 8 16C9.1 16 10 15.1 10 14C10 12.9 9.1 12 8 12Z", "fill", "#96939E"], [1, "domain__clickable", 3, "routerLink", "queryParams"], [1, "domain__avatar", 3, "ngClass"], [1, "domain__character"], [1, "domain__info"], [1, "domain__name"], [1, "domain__status-indicators"], ["class", "domain__status-indicator domain__status-indicator--warning", 4, "ngIf"], ["class", "domain__status-indicator domain__status-indicator--error", 4, "ngIf"], ["mat-icon-button", "", "mat-flat-button", "", 1, "domain__action", 3, "matMenuTriggerFor"], ["width", "16", "height", "4", "viewBox", "0 0 16 4", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0ZM14 0C12.9 0 12 0.9 12 2C12 3.1 12.9 4 14 4C15.1 4 16 3.1 16 2C16 0.9 15.1 0 14 0ZM8 0C6.9 0 6 0.9 6 2C6 3.1 6.9 4 8 4C9.1 4 10 3.1 10 2C10 0.9 9.1 0 8 0Z"], [1, "zelf-menu"], ["menu", ""], ["mat-menu-item", "", 1, "zelf-menu__button", "zelf-menu__button--icon-end", 3, "click"], [1, "zelf-menu__button-text"], [1, "zelf-menu__button-icon"], ["width", "22", "height", "12", "viewBox", "0 0 22 12", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M11.09 1.41L14.67 5H0.5V7H14.67L11.08 10.59L12.5 12L18.5 6L12.5 0L11.09 1.41ZM19.5 0V12H21.5V0H19.5Z"], ["class", "domain-detail", 4, "ngIf"], [1, "domain__status-indicator", "domain__status-indicator--warning"], [1, "domain__status-indicator", "domain__status-indicator--error"], [1, "domain-detail"], [1, "domain-detail__row"], ["class", "domain-detail__icon domain-detail__icon--warning", 4, "ngIf"], ["class", "domain-detail__icon domain-detail__icon--error", 4, "ngIf"], ["class", "domain-detail__text", 4, "ngIf"], ["class", "domain-detail__countdown", 4, "ngIf"], [1, "domain-detail__col"], ["mat-flat-button", "", "class", "zelf-button zelf-button--black zelf-button--wide", 3, "routerLink", "queryParams", 4, "ngIf"], ["mat-flat-button", "", "class", "zelf-button zelf-button--black zelf-button--wide", 4, "ngIf"], [1, "domain-detail__icon", "domain-detail__icon--warning"], [1, "domain-detail__icon", "domain-detail__icon--error"], [1, "domain-detail__text"], [1, "domain-detail__countdown"], ["width", "8", "height", "14", "viewBox", "0 0 8 14", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M8 13.6673L7.99333 9.66732L5.33333 7.00065L7.99333 4.32732L8 0.333984H0V4.33398L2.66667 7.00065L0 9.66065V13.6673H8ZM1.33333 4.00065V1.66732H6.66667V4.00065L4 6.66732L1.33333 4.00065Z"], ["mat-flat-button", "", 1, "zelf-button", "zelf-button--black", "zelf-button--wide", 3, "routerLink", "queryParams"], ["mat-flat-button", "", 1, "zelf-button", "zelf-button--black", "zelf-button--wide"], ["d", "M9.00809 0C10.0223 1.37638 11.3245 2.94543 12.9662 4.56695H5.5957C7.19048 2.87796 8.28196 1.25719 9.00961 0H9.00885H9.00809Z"], ["d", "M0 9.0219C1.29765 8.39218 3.00233 7.40412 4.71307 5.8928C4.86391 5.75936 5.01171 5.62442 5.15345 5.49023H11.7448C11.7448 5.49023 6.97107 12.2365 4.3591 12.2567C2.20418 12.2739 1.30144 9.82479 0 9.02115L0 9.0219Z"], ["d", "M9.42861 17.9992C8.6335 16.9197 7.60948 15.6873 6.31259 14.4121H12.3733C11.0893 15.706 10.1305 16.955 9.42937 17.9992H9.42861Z"], ["d", "M13.3339 13.2992C13.2627 13.3621 13.1929 13.4259 13.124 13.4888H6.04755C6.04755 13.4888 10.9001 6.65491 13.5469 6.64066C15.7557 6.62942 16.6705 9.13704 18 9.95792C16.6478 10.7173 15.0015 11.7976 13.3332 13.2992H13.3339Z"], ["width", "20", "height", "20", "viewBox", "0 0 20 20", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 15C9.45 15 9 14.55 9 14V10C9 9.45 9.45 9 10 9C10.55 9 11 9.45 11 10V14C11 14.55 10.55 15 10 15ZM11 7H9V5H11V7Z"], ["width", "20", "height", "18", "viewBox", "0 0 20 18", "fill", "none", "xmlns", "http://www.w3.org/2000/svg"], ["d", "M2.47 17.5036H17.53C19.07 17.5036 20.03 15.8336 19.26 14.5036L11.73 1.49359C10.96 0.163594 9.04 0.163594 8.27 1.49359L0.739999 14.5036C-0.0300008 15.8336 0.929999 17.5036 2.47 17.5036ZM10 10.5036C9.45 10.5036 9 10.0536 9 9.50359V7.50359C9 6.95359 9.45 6.50359 10 6.50359C10.55 6.50359 11 6.95359 11 7.50359V9.50359C11 10.0536 10.55 10.5036 10 10.5036ZM11 14.5036H9V12.5036H11V14.5036Z"]],
      template: function ManageDomainsComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](0, ManageDomainsComponent_div_0_Template, 27, 11, "div", 0);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_13__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgTemplateOutlet, app_pipes_first_letter_pipe__WEBPACK_IMPORTED_MODULE_2__.FirstLetterPipe, _angular_material_icon__WEBPACK_IMPORTED_MODULE_14__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_14__.MatIcon, _angular_material_menu__WEBPACK_IMPORTED_MODULE_15__.MatMenuModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_15__.MatMenu, _angular_material_menu__WEBPACK_IMPORTED_MODULE_15__.MatMenuItem, _angular_material_menu__WEBPACK_IMPORTED_MODULE_15__.MatMenuTrigger, _angular_router__WEBPACK_IMPORTED_MODULE_11__.RouterLink, _angular_router__WEBPACK_IMPORTED_MODULE_11__.RouterModule, app_pipes_timer_pipe__WEBPACK_IMPORTED_MODULE_3__.TimerPipe, _ngneat_transloco__WEBPACK_IMPORTED_MODULE_12__.TranslocoModule, _ngneat_transloco__WEBPACK_IMPORTED_MODULE_12__.TranslocoDirective, app_pipes_zelf_name_pipe__WEBPACK_IMPORTED_MODULE_4__.ZelfNamePipe],
      styles: [".zelf-button-external-link[_ngcontent-%COMP%] {\n  display: block;\n}\n.zelf-button-external-link--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.zelf-button[_ngcontent-%COMP%] {\n  align-items: center;\n  border-radius: 16px;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  font-family: Poppins;\n  font-size: 14px;\n  font-weight: 500;\n  gap: 8px;\n  height: 56px;\n  justify-content: center;\n  outline: none;\n  padding: 16px;\n  text-align: center;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.zelf-button__text--margin-right[_ngcontent-%COMP%] {\n  margin-right: 1rem;\n}\n.zelf-button--thin[_ngcontent-%COMP%] {\n  border-radius: 8px;\n  padding: 12px 16px;\n}\n.zelf-button--wide[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%] {\n  background-color: transparent;\n  color: #73777f;\n  font-size: 14px;\n  border-radius: 9999px;\n  transition: color 0.2s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--hyperlink--small[_ngcontent-%COMP%] {\n  font-size: 11px;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #73777f;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover {\n  color: #181818;\n  background-color: #e3e3e3;\n}\n.zelf-button--hyperlink[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: #181818;\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: #96939e !important;\n}\n.zelf-button--hyperlink[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #96939e;\n}\n.zelf-button--black[_ngcontent-%COMP%] {\n  background-color: #181818 !important;\n  color: #ffffff !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--black[_ngcontent-%COMP%]:focus, .zelf-button--black[_ngcontent-%COMP%]:hover {\n  background-color: #73777f !important;\n}\n.zelf-button--black[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: #73777f !important;\n  color: #ffffff !important;\n}\n.zelf-button--black[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #ffffff;\n}\n.zelf-button--white[_ngcontent-%COMP%] {\n  background-color: #ffffff !important;\n  color: #181818 !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--white[_ngcontent-%COMP%]:focus, .zelf-button--white[_ngcontent-%COMP%]:hover {\n  background-color: #eeedf1 !important;\n}\n.zelf-button--white[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: #eeedf1 !important;\n  color: #181818 !important;\n}\n.zelf-button--white[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #181818;\n}\n.zelf-button--outlined[_ngcontent-%COMP%] {\n  border: 1px solid #181818 !important;\n  background-color: #ffffff !important;\n  color: #181818 !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-button--outlined[_ngcontent-%COMP%]:focus, .zelf-button--outlined[_ngcontent-%COMP%]:hover {\n  background-color: #e3e3e3 !important;\n}\n.zelf-button--outlined[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  color: #73777f !important;\n}\n.zelf-button--outlined[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #181818;\n}\n.zelf-button--error[_ngcontent-%COMP%] {\n  background-color: #fceeee !important;\n  color: #dc362e !important;\n}\n.zelf-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #dc362e !important;\n}\n.zelf-button--success[_ngcontent-%COMP%] {\n  background-color: #e7f8ed !important;\n  color: #1ea446 !important;\n}\n.zelf-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #1ea446 !important;\n}\n\n.zelf-icon-button[_ngcontent-%COMP%] {\n  align-items: center;\n  background-color: #eeedf1 !important;\n  border-radius: 56px;\n  border: none;\n  cursor: pointer;\n  display: inline-flex;\n  height: 56px;\n  justify-content: center;\n  min-height: 56px;\n  min-width: 56px;\n  outline: none;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  -webkit-user-select: none;\n          user-select: none;\n  width: 56px;\n}\n.zelf-icon-button.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: #181818;\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover {\n  background-color: #b589f0 !important;\n  color: white;\n}\n.zelf-icon-button[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: white;\n}\n.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 16px;\n}\n.zelf-icon-button--40[_ngcontent-%COMP%] {\n  height: 40px;\n  min-height: 40px;\n  min-width: 40px;\n  width: 40px;\n  border-radius: 40px;\n}\n.zelf-icon-button--40.zelf-icon-button--border-soft[_ngcontent-%COMP%] {\n  border-radius: 14px;\n}\n.zelf-icon-button--black[_ngcontent-%COMP%] {\n  background-color: #181818 !important;\n  color: #ffffff !important;\n  transition: color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1), background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.zelf-icon-button--black[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #ffffff;\n}\n.zelf-icon-button--black[_ngcontent-%COMP%]:focus, .zelf-icon-button--black[_ngcontent-%COMP%]:hover {\n  background-color: #73777f !important;\n}\n.zelf-icon-button--black[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: #e3e3e3 !important;\n}\n.zelf-icon-button--black[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #c3c6cf;\n}\n.zelf-icon-button--anti-flash-white[_ngcontent-%COMP%] {\n  background-color: #eeedf1 !important;\n  color: #181818 !important;\n}\n.zelf-icon-button--anti-flash-white[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #181818;\n}\n.zelf-icon-button--anti-flash-white[_ngcontent-%COMP%]:focus, .zelf-icon-button--anti-flash-white[_ngcontent-%COMP%]:hover {\n  background-color: #b589f0 !important;\n  color: white;\n}\n.zelf-icon-button--anti-flash-white[_ngcontent-%COMP%]:focus   svg[_ngcontent-%COMP%], .zelf-icon-button--anti-flash-white[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: #ffffff;\n}\n.zelf-icon-button--anti-flash-white[disabled][_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  background-color: #e3e3e3 !important;\n}\n.zelf-icon-button--anti-flash-white[disabled][_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #c3c6cf;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%] {\n  background-color: #fceeee !important;\n  color: #dc362e !important;\n}\n.zelf-icon-button--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #dc362e !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%] {\n  background-color: #e7f8ed !important;\n  color: #1ea446 !important;\n}\n.zelf-icon-button--success[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #1ea446 !important;\n}\n\n[_nghost-%COMP%] {\n  background-color: #f9f9fc;\n  display: block;\n  min-height: 100vh;\n  width: 100%;\n}\n[_nghost-%COMP%]   *[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n\n.manage-domains[_ngcontent-%COMP%] {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  padding: 16px;\n  gap: 24px;\n  height: 100%;\n  justify-content: center;\n  width: 100%;\n}\n.manage-domains__header[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(10, 1fr);\n  column-gap: 12px;\n  align-content: center;\n  justify-content: flex-start;\n  height: 76px;\n  gap: 24px;\n  width: 100%;\n}\n.manage-domains__col1[_ngcontent-%COMP%], .manage-domains__col3[_ngcontent-%COMP%] {\n  grid-column: span 2;\n  display: flex;\n  align-items: center;\n}\n.manage-domains__col1[_ngcontent-%COMP%] {\n  justify-content: flex-start;\n}\n.manage-domains__col3[_ngcontent-%COMP%] {\n  justify-content: flex-end;\n}\n.manage-domains__col2[_ngcontent-%COMP%] {\n  grid-column: span 6;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.manage-domains__top-button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n  gap: 8px;\n  border: none;\n  outline: none;\n  cursor: pointer;\n  -webkit-user-select: none;\n          user-select: none;\n  border-radius: 52px;\n  height: 52px;\n  width: 52px;\n  min-height: 52px;\n  min-width: 52px;\n  background-color: #eeedf1 !important;\n  transition: background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.manage-domains__top-button[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: #181818;\n}\n.manage-domains__top-button[_ngcontent-%COMP%]:hover {\n  background-color: #b589f0 !important;\n  color: white;\n}\n.manage-domains__top-button[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: white;\n}\n.manage-domains__name[_ngcontent-%COMP%] {\n  font-size: 20px;\n  font-weight: 400;\n  font-family: Menda;\n  color: #181818;\n  margin: 0;\n}\n.manage-domains__tasks[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  gap: 16px;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n}\n.manage-domains__title[_ngcontent-%COMP%] {\n  font-size: 18px;\n  font-weight: 600;\n  font-family: Poppins;\n  color: #181818;\n  margin: 0;\n  text-align: center;\n}\n.manage-domains__content[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 600px;\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n  justify-content: center;\n  align-items: center;\n}\n.manage-domains__footer[_ngcontent-%COMP%] {\n  display: flex;\n  flex-grow: 1;\n  flex-direction: column;\n  gap: 8px;\n  justify-content: flex-end;\n  align-items: center;\n  width: 100%;\n}\n\n.domains[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  width: 100%;\n  justify-content: center;\n  align-items: center;\n}\n\n.domain[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 8px;\n  padding: 16px;\n  border-radius: 16px;\n  background-color: #eeedf1;\n  width: 100%;\n  transition: background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.domain[_ngcontent-%COMP%]:hover {\n  background-color: #e2e2e2;\n}\n.domain__dots[_ngcontent-%COMP%] {\n  height: 24px;\n  width: 24px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n}\n.domain__dots[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #96939e;\n}\n.domain__display[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  gap: 8px;\n  justify-content: flex-start;\n  align-items: center;\n  width: 100%;\n}\n.domain__clickable[_ngcontent-%COMP%] {\n  cursor: pointer;\n  display: flex;\n  flex-direction: row;\n  gap: 8px;\n  justify-content: flex-start;\n  align-items: center;\n  width: 100%;\n}\n.domain__avatar[_ngcontent-%COMP%] {\n  cursor: inherit;\n  height: 40px;\n  width: 40px;\n  min-width: 40px;\n  min-height: 40px;\n  border-radius: 40px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.domain__avatar--primary[_ngcontent-%COMP%] {\n  background-color: #0e26ff;\n}\n.domain__avatar--secondary[_ngcontent-%COMP%] {\n  background-color: #ff5721;\n}\n.domain__character[_ngcontent-%COMP%] {\n  font-family: Menda;\n  font-size: 14px;\n  color: white;\n}\n.domain__info[_ngcontent-%COMP%] {\n  display: inline-flex;\n  flex-direction: row;\n  gap: 8px;\n  justify-content: space-between;\n  align-items: center;\n  width: 100%;\n}\n.domain__name[_ngcontent-%COMP%] {\n  cursor: inherit;\n  display: flex;\n  justify-content: flex-start;\n  align-items: center;\n}\n.domain__status-indicators[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-end;\n  align-items: center;\n  gap: 4px;\n}\n.domain__status-indicator[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 40px;\n  width: 40px;\n  min-height: 40px;\n  min-width: 40px;\n  -webkit-user-select: none;\n          user-select: none;\n  border-radius: 14px;\n  background-color: #f9f9fc;\n}\n.domain__status-indicator[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #181818;\n}\n.domain__status-indicator--warning[_ngcontent-%COMP%] {\n  background-color: #fceeee;\n}\n.domain__status-indicator--warning[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #ff5721;\n}\n.domain__status-indicator--error[_ngcontent-%COMP%] {\n  background-color: #fceeee;\n}\n.domain__status-indicator--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #dc362e;\n}\n.domain__action[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 40px;\n  width: 40px;\n  min-height: 40px;\n  min-width: 40px;\n  border: none;\n  outline: none;\n  cursor: pointer;\n  -webkit-user-select: none;\n          user-select: none;\n  border-radius: 14px;\n  background-color: #f9f9fc;\n  transition: background-color 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n}\n.domain__action[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  transition: fill 0.3s cubic-bezier(0.25, 0.4, 0.7, 1);\n  fill: #181818;\n}\n.domain__action[_ngcontent-%COMP%]:hover {\n  background-color: #b589f0 !important;\n  color: white;\n}\n.domain__action[_ngcontent-%COMP%]:hover   svg[_ngcontent-%COMP%] {\n  fill: white;\n}\n.domain-detail[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  width: 100%;\n  padding: 0 32px;\n}\n.domain-detail__row[_ngcontent-%COMP%] {\n  display: flex;\n  flex: 1 1 auto;\n  flex-direction: row;\n  gap: 8px;\n  justify-content: flex-start;\n  align-items: flex-start;\n}\n.domain-detail__col[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n}\n.domain-detail__icon[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #181818;\n}\n.domain-detail__icon--warning[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #ff5721;\n}\n.domain-detail__icon--error[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #dc362e;\n}\n.domain-detail__text[_ngcontent-%COMP%] {\n  font-family: Poppins;\n  font-size: 11px;\n  color: #181818;\n  font-weight: 600;\n  margin: 0;\n  display: flex;\n  flex: 1 1 auto;\n}\n.domain-detail__countdown[_ngcontent-%COMP%] {\n  display: inline-flex;\n  gap: 4px;\n  align-items: center;\n  justify-content: flex-end;\n  font-family: Poppins;\n  font-size: 11px;\n  color: #181818;\n  font-weight: 600;\n  margin: 0;\n}\n.domain-detail__countdown[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  fill: #181818;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3N0eWxlcy9fYnV0dG9ucy5zY3NzIiwibWFuYWdlLWRvbWFpbnMuY29tcG9uZW50LnNjc3MiLCIuLi8uLi9zdHlsZXMvX3ZhcmlhYmxlcy5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksY0FBQTtBQ0NKO0FEQ0k7RUFDSSxXQUFBO0FDQ1I7O0FER0E7RUFDSSxtQkFBQTtFQUNBLG1CQUFBO0VBQ0EsWUFBQTtFQUNBLGVBQUE7RUFDQSxhQUFBO0VBQ0Esb0JBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxRQUFBO0VBQ0EsWUFBQTtFQUNBLHVCQUFBO0VBQ0EsYUFBQTtFQUNBLGFBQUE7RUFDQSxrQkFBQTtFQUNBLHlCQUFBO1VBQUEsaUJBQUE7QUNBSjtBREdRO0VBQ0ksa0JBQUE7QUNEWjtBREtJO0VBQ0ksa0JBQUE7RUFDQSxrQkFBQTtBQ0hSO0FETUk7RUFDSSxXQUFBO0FDSlI7QURPSTtFQUNJLDZCQUFBO0VBQ0EsY0V2Q0Q7RUZ3Q0MsZUFBQTtFQUNBLHFCQUFBO0VBQ0EsNkdBQUE7QUNMUjtBRE9RO0VBQ0ksZUFBQTtBQ0xaO0FEUVE7RUFDSSxhRWpETDtBRDJDUDtBRFNRO0VBQ0ksY0V0REo7RUZ1REkseUJFbkREO0FENENYO0FEU1k7RUFDSSxhRTFEUjtBRG1EUjtBRFdRO0VBQ0ksbUJBQUE7RUFDQSx5QkFBQTtBQ1RaO0FEV1k7RUFDSSxhRWpFSjtBRHdEWjtBRGNJO0VBQ0ksb0NBQUE7RUFDQSx5QkFBQTtFQUNBLDZHQUFBO0FDWlI7QURjUTtFQUVJLG9DQUFBO0FDYlo7QURnQlE7RUFDSSxtQkFBQTtFQUNBLG9DQUFBO0VBQ0EseUJBQUE7QUNkWjtBRGlCUTtFQUNJLGFFbEZKO0FEbUVSO0FEbUJJO0VBQ0ksb0NBQUE7RUFDQSx5QkFBQTtFQUNBLDZHQUFBO0FDakJSO0FEbUJRO0VBRUksb0NBQUE7QUNsQlo7QURxQlE7RUFDSSxtQkFBQTtFQUNBLG9DQUFBO0VBQ0EseUJBQUE7QUNuQlo7QURzQlE7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ZUFBQTtBQXFMUjtBQW5MUTtFQUNJLGFBQUE7RUFDQSxjQUFBO0VBQ0EsbUJBQUE7RUFDQSxRQUFBO0VBQ0EsMkJBQUE7RUFDQSx1QkFBQTtBQXFMWjtBQWxMUTtFQUNJLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFFBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0VBQ0EsV0FBQTtBQW9MWjtBQWhMWTtFQUNJLGFDNVVSO0FEOGZSO0FBOUtnQjtFQUNJLGFDbFZIO0FEa2dCakI7QUEzS2dCO0VBQ0ksYUM3VVo7QUQwZlI7QUF4S1E7RUFDSSxvQkFBQTtFQUNBLGVBQUE7RUFDQSxjQy9WSjtFRGdXSSxnQkFBQTtFQUNBLFNBQUE7RUFDQSxhQUFBO0VBQ0EsY0FBQTtBQTBLWjtBQXZLUTtFQUNJLG9CQUFBO0VBQ0EsUUFBQTtFQUNBLG1CQUFBO0VBQ0EseUJBQUE7RUFDQSxvQkFBQTtFQUNBLGVBQUE7RUFDQSxjQzdXSjtFRDhXSSxnQkFBQTtFQUNBLFNBQUE7QUF5S1o7QUF2S1k7RUFDSSxhQ2xYUjtBRDJoQlIiLCJmaWxlIjoibWFuYWdlLWRvbWFpbnMuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuemVsZi1idXR0b24tZXh0ZXJuYWwtbGluayB7XG4gICAgZGlzcGxheTogYmxvY2s7XG5cbiAgICAmLS13aWRlIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxufVxuXG4uemVsZi1idXR0b24ge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZm9udC1mYW1pbHk6IFBvcHBpbnM7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgZ2FwOiA4cHg7XG4gICAgaGVpZ2h0OiA1NnB4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgcGFkZGluZzogMTZweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG5cbiAgICAmX190ZXh0IHtcbiAgICAgICAgJi0tbWFyZ2luLXJpZ2h0IHtcbiAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMXJlbTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXRoaW4ge1xuICAgICAgICBib3JkZXItcmFkaXVzOiA4cHg7XG4gICAgICAgIHBhZGRpbmc6IDEycHggMTZweDtcbiAgICB9XG5cbiAgICAmLS13aWRlIHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgJi0taHlwZXJsaW5rIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICAgIGNvbG9yOiAkZ3JheTtcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA5OTk5cHg7XG4gICAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuMnMgJHNtb290aEJlemllciwgYmFja2dyb3VuZC1jb2xvciAwLjNzICRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJi0tc21hbGwge1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6ICRncmF5O1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBjb2xvcjogJGJsYWNrO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHBsYXRpbnVtO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6ICRibGFjaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBjb2xvcjogJHRhdXBlR3JheSAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6ICR0YXVwZUdyYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1ibGFjayB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRibGFjayAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogJHdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuM3MgJHNtb290aEJlemllciwgYmFja2dyb3VuZC1jb2xvciAwLjNzICRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkZ3JheSAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRncmF5ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogJHdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogJHdoaXRlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0td2hpdGUge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkd2hpdGUgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6ICRibGFjayAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjNzICRzbW9vdGhCZXppZXIsIGJhY2tncm91bmQtY29sb3IgMC4zcyAkc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGFudGlGbGFzaFdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGFudGlGbGFzaFdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogJGJsYWNrICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogJGJsYWNrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tb3V0bGluZWQge1xuICAgICAgICBib3JkZXI6IDFweCBzb2xpZCAkYmxhY2sgIWltcG9ydGFudDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiAkYmxhY2sgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjogY29sb3IgMC4zcyAkc21vb3RoQmV6aWVyLCBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRwbGF0aW51bSAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGNvbG9yOiAkZ3JheSAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6ICRibGFjaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWVycm9yIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6ICRlcnJvciAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiAkZXJyb3IgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXN1Y2Nlc3Mge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkY29ycmVjdExpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiAkY29ycmVjdCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiAkY29ycmVjdCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxufVxuXG4uemVsZi1pY29uLWJ1dHRvbiB7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYW50aUZsYXNoV2hpdGUgIWltcG9ydGFudDtcbiAgICBib3JkZXItcmFkaXVzOiA1NnB4O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgaGVpZ2h0OiA1NnB4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIG1pbi1oZWlnaHQ6IDU2cHg7XG4gICAgbWluLXdpZHRoOiA1NnB4O1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgdHJhbnNpdGlvbjogY29sb3IgMC4zcyAkc21vb3RoQmV6aWVyLCBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgJHNtb290aEJlemllcjtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICB3aWR0aDogNTZweDtcblxuICAgICYuemVsZi1pY29uLWJ1dHRvbi0tYm9yZGVyLXNvZnQge1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIH1cblxuICAgIHN2ZyB7XG4gICAgICAgIHRyYW5zaXRpb246IGZpbGwgMC4zcyAkc21vb3RoQmV6aWVyO1xuICAgICAgICBmaWxsOiAkYmxhY2s7XG4gICAgfVxuXG4gICAgJjpob3ZlciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNiNTg5ZjAgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6IHdoaXRlO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiB3aGl0ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWJvcmRlci1zb2Z0IHtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICB9XG5cbiAgICAmLS00MCB7XG4gICAgICAgIGhlaWdodDogNDBweDtcbiAgICAgICAgbWluLWhlaWdodDogNDBweDtcbiAgICAgICAgbWluLXdpZHRoOiA0MHB4O1xuICAgICAgICB3aWR0aDogNDBweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogNDBweDtcblxuICAgICAgICAmLnplbGYtaWNvbi1idXR0b24tLWJvcmRlci1zb2Z0IHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1ibGFjayB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRibGFjayAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogJHdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuM3MgJHNtb290aEJlemllciwgYmFja2dyb3VuZC1jb2xvciAwLjNzICRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6ICR3aGl0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGdyYXkgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkcGxhdGludW0gIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiAkZnJlbmNoR3JheTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWFudGktZmxhc2gtd2hpdGUge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYW50aUZsYXNoV2hpdGUgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6ICRibGFjayAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiAkYmxhY2s7XG4gICAgICAgIH1cblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNiNTg5ZjAgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiAkd2hpdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHBsYXRpbnVtICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogJGZyZW5jaEdyYXk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1lcnJvciB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRlcnJvckxpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiAkZXJyb3IgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogJGVycm9yICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1zdWNjZXNzIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGNvcnJlY3RMaWdodCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogJGNvcnJlY3QgIWltcG9ydGFudDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogJGNvcnJlY3QgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIkBpbXBvcnQgXCIuLi8uLi9zdHlsZXMvdmFyaWFibGVzLnNjc3NcIjtcbkBpbXBvcnQgXCIuLi8uLi9zdHlsZXMvYnV0dG9ucy5zY3NzXCI7XG5cbjpob3N0IHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkc2VhU2FsdDtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBtaW4taGVpZ2h0OiAxMDB2aDtcbiAgICB3aWR0aDogMTAwJTtcblxuICAgICoge1xuICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIH1cbn1cblxuLm1hbmFnZS1kb21haW5zIHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBwYWRkaW5nOiAxNnB4O1xuICAgIGdhcDogMjRweDtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgd2lkdGg6IDEwMCU7XG5cbiAgICAmX19oZWFkZXIge1xuICAgICAgICBkaXNwbGF5OiBncmlkO1xuICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgxMCwgMWZyKTsgLy8gQWRqdXN0ZWQgdG8gMyBjb2x1bW5zXG4gICAgICAgIGNvbHVtbi1nYXA6IDEycHg7XG4gICAgICAgIGFsaWduLWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgICAgICBoZWlnaHQ6IDc2cHg7XG4gICAgICAgIGdhcDogMjRweDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgJl9fY29sMSxcbiAgICAmX19jb2wzIHtcbiAgICAgICAgZ3JpZC1jb2x1bW46IHNwYW4gMjtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX19jb2wxIHtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgIH1cblxuICAgICZfX2NvbDMge1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICAgIH1cblxuICAgICZfX2NvbDIge1xuICAgICAgICBncmlkLWNvbHVtbjogc3BhbiA2O1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX190b3AtYnV0dG9uIHtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA1MnB4O1xuICAgICAgICBoZWlnaHQ6IDUycHg7XG4gICAgICAgIHdpZHRoOiA1MnB4O1xuICAgICAgICBtaW4taGVpZ2h0OiA1MnB4O1xuICAgICAgICBtaW4td2lkdGg6IDUycHg7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRhbnRpRmxhc2hXaGl0ZSAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgJHNtb290aEJlemllcjtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogZmlsbCAwLjNzICRzbW9vdGhCZXppZXI7XG4gICAgICAgICAgICBmaWxsOiAkYmxhY2s7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNiNTg5ZjAgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB3aGl0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX25hbWUge1xuICAgICAgICBmb250LXNpemU6IDIwcHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA0MDA7XG4gICAgICAgIGZvbnQtZmFtaWx5OiBNZW5kYTtcbiAgICAgICAgY29sb3I6ICRibGFjaztcbiAgICAgICAgbWFyZ2luOiAwO1xuICAgIH1cblxuICAgICZfX3Rhc2tzIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgICAgZ2FwOiAxNnB4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgJl9fdGl0bGUge1xuICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgIGZvbnQtZmFtaWx5OiBQb3BwaW5zO1xuICAgICAgICBjb2xvcjogJGJsYWNrO1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX19jb250ZW50IHtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIG1heC13aWR0aDogNjAwcHg7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogMjRweDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgfVxuXG4gICAgJl9fZm9vdGVyIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1ncm93OiAxO1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxufVxuXG4uZG9tYWlucyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGdhcDogNHB4O1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5kb21haW4ge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogOHB4O1xuICAgIHBhZGRpbmc6IDE2cHg7XG4gICAgYm9yZGVyLXJhZGl1czogMTZweDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYW50aUZsYXNoV2hpdGU7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjNzICRzbW9vdGhCZXppZXI7XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2UyZTJlMjtcbiAgICB9XG5cbiAgICAmX19kb3RzIHtcbiAgICAgICAgaGVpZ2h0OiAyNHB4O1xuICAgICAgICB3aWR0aDogMjRweDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogJHRhdXBlR3JheTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICZfX2Rpc3BsYXkge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICBnYXA6IDhweDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX19jbGlja2FibGUge1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICAgIGdhcDogOHB4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgICZfX2F2YXRhciB7XG4gICAgICAgIGN1cnNvcjogaW5oZXJpdDtcbiAgICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgICB3aWR0aDogNDBweDtcbiAgICAgICAgbWluLXdpZHRoOiA0MHB4O1xuICAgICAgICBtaW4taGVpZ2h0OiA0MHB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA0MHB4O1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcblxuICAgICAgICAmLS1wcmltYXJ5IHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRwcmltYXJ5Q29sb3I7XG4gICAgICAgIH1cblxuICAgICAgICAmLS1zZWNvbmRhcnkge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHNlY29uZGFyeUNvbG9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fY2hhcmFjdGVyIHtcbiAgICAgICAgZm9udC1mYW1pbHk6IE1lbmRhO1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGNvbG9yOiB3aGl0ZTtcbiAgICB9XG5cbiAgICAmX19pbmZvIHtcbiAgICAgICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICAgIGdhcDogOHB4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgICZfX25hbWUge1xuICAgICAgICBjdXJzb3I6IGluaGVyaXQ7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX19zdGF0dXMtaW5kaWNhdG9ycyB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogNHB4O1xuICAgIH1cblxuICAgICZfX3N0YXR1cy1pbmRpY2F0b3Ige1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgICB3aWR0aDogNDBweDtcbiAgICAgICAgbWluLWhlaWdodDogNDBweDtcbiAgICAgICAgbWluLXdpZHRoOiA0MHB4O1xuICAgICAgICB1c2VyLXNlbGVjdDogbm9uZTtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTRweDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHNlYVNhbHQ7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6ICRibGFjaztcbiAgICAgICAgfVxuXG4gICAgICAgICYtLXdhcm5pbmcge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGVycm9yTGlnaHQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogJHNlY29uZGFyeUNvbG9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJi0tZXJyb3Ige1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGVycm9yTGlnaHQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogJGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fYWN0aW9uIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGhlaWdodDogNDBweDtcbiAgICAgICAgd2lkdGg6IDQwcHg7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDQwcHg7XG4gICAgICAgIG1pbi13aWR0aDogNDBweDtcbiAgICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNHB4O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkc2VhU2FsdDtcbiAgICAgICAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjNzICRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGZpbGwgMC4zcyAkc21vb3RoQmV6aWVyO1xuICAgICAgICAgICAgZmlsbDogJGJsYWNrO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjYjU4OWYwICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBjb2xvcjogd2hpdGU7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogd2hpdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLWRldGFpbCB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogOHB4O1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgcGFkZGluZzogMCAzMnB4O1xuXG4gICAgICAgICZfX3JvdyB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgZmxleDogMSAxIGF1dG87XG4gICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICAgICAgZ2FwOiA4cHg7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgICAgICAgfVxuXG4gICAgICAgICZfX2NvbCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgICAgIGdhcDogNHB4O1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgIH1cblxuICAgICAgICAmX19pY29uIHtcbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogJGJsYWNrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmLS13YXJuaW5nIHtcbiAgICAgICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgICAgICBmaWxsOiAkc2Vjb25kYXJ5Q29sb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAmLS1lcnJvciB7XG4gICAgICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsbDogJGVycm9yO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZfX3RleHQge1xuICAgICAgICAgICAgZm9udC1mYW1pbHk6IFBvcHBpbnM7XG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgICAgICBjb2xvcjogJGJsYWNrO1xuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBmbGV4OiAxIDEgYXV0bztcbiAgICAgICAgfVxuXG4gICAgICAgICZfX2NvdW50ZG93biB7XG4gICAgICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgICAgIGdhcDogNHB4O1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgICAgICAgICBmb250LWZhbWlseTogUG9wcGlucztcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgICAgIGNvbG9yOiAkYmxhY2s7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgbWFyZ2luOiAwO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6ICRibGFjaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIiRwcmltYXJ5Q29sb3I6ICMwZTI2ZmY7XG4kc2Vjb25kYXJ5Q29sb3I6ICNmZjU3MjE7XG4kYmxhY2s6ICMxODE4MTg7XG4kZ3JheTogIzczNzc3ZjtcbiR0YXVwZUdyYXk6ICM5NjkzOWU7XG4kZnJlbmNoR3JheTogI2MzYzZjZjtcbiRwbGF0aW51bTogI2UzZTNlMztcbiRhbnRpRmxhc2hXaGl0ZTogI2VlZWRmMTtcbiRzZWFTYWx0OiAjZjlmOWZjO1xuJHdoaXRlOiAjZmZmZmZmO1xuJHByaW1hcnlMaWdodDogI2ZmZWVlOTtcbiRlcnJvckRhcms6ICM2MDE0MTA7XG4kZXJyb3I6ICNkYzM2MmU7XG4kZXJyb3JMaWdodDogI2ZjZWVlZTtcbiRjb3JyZWN0RGFyazogIzBmNTIyMztcbiRjb3JyZWN0OiAjMWVhNDQ2O1xuJGNvcnJlY3RMaWdodDogI2U3ZjhlZDtcbiRpbmZvRGFyazogIzAwNGE3NztcbiRpbmZvOiAjMzk5OGQzO1xuJGluZm9MaWdodDogI2VjZjNmZTtcblxuJHNtb290aEJlemllcjogY3ViaWMtYmV6aWVyKDAuMjUsIDAuNCwgMC43LCAxKTtcblxuJG1heEV4dHJhU21hbGw6IDU5NXB4O1xuJG1pblNtYWxsOiA2MDBweDtcbiRtZWRpdW06IDc2OHB4O1xuJGxhcmdlOiA4ODlweDtcbiRjb21wdXRlcnM6IDEyMDBweDtcbiJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvX2J1dHRvbnMuc2NzcyIsIndlYnBhY2s6Ly8uL3NyYy9hcHAvbWFuYWdlLWRvbWFpbnMvbWFuYWdlLWRvbWFpbnMuY29tcG9uZW50LnNjc3MiLCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL192YXJpYWJsZXMuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGNBQUE7QUNDSjtBRENJO0VBQ0ksV0FBQTtBQ0NSOztBREdBO0VBQ0ksbUJBQUE7RUFDQSxtQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLG9CQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsUUFBQTtFQUNBLFlBQUE7RUFDQSx1QkFBQTtFQUNBLGFBQUE7RUFDQSxhQUFBO0VBQ0Esa0JBQUE7RUFDQSx5QkFBQTtVQUFBLGlCQUFBO0FDQUo7QURHUTtFQUNJLGtCQUFBO0FDRFo7QURLSTtFQUNJLGtCQUFBO0VBQ0Esa0JBQUE7QUNIUjtBRE1JO0VBQ0ksV0FBQTtBQ0pSO0FET0k7RUFDSSw2QkFBQTtFQUNBLGNFdkNEO0VGd0NDLGVBQUE7RUFDQSxxQkFBQTtFQUNBLDZHQUFBO0FDTFI7QURPUTtFQUNJLGVBQUE7QUNMWjtBRFFRO0VBQ0ksYUVqREw7QUQyQ1A7QURTUTtFQUNJLGNFdERKO0VGdURJLHlCRW5ERDtBRDRDWDtBRFNZO0VBQ0ksYUUxRFI7QURtRFI7QURXUTtFQUNJLG1CQUFBO0VBQ0EseUJBQUE7QUNUWjtBRFdZO0VBQ0ksYUVqRUo7QUR3RFo7QURjSTtFQUNJLG9DQUFBO0VBQ0EseUJBQUE7RUFDQSw2R0FBQTtBQ1pSO0FEY1E7RUFFSSxvQ0FBQTtBQ2JaO0FEZ0JRO0VBQ0ksbUJBQUE7RUFDQSxvQ0FBQTtFQUNBLHlCQUFBO0FDZFo7QURpQlE7RUFDSSxhRWxGSjtBRG1FUjtBRG1CSTtFQUNJLG9DQUFBO0VBQ0EseUJBQUE7RUFDQSw2R0FBQTtBQ2pCUjtBRG1CUTtFQUVJLG9DQUFBO0FD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aEI7QUFuTEk7RUFDSSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxRQUFBO0VBQ0EsV0FBQTtFQUNBLGVBQUE7QUFxTFI7QUFuTFE7RUFDSSxhQUFBO0VBQ0EsY0FBQTtFQUNBLG1CQUFBO0VBQ0EsUUFBQTtFQUNBLDJCQUFBO0VBQ0EsdUJBQUE7QUFxTFo7QUFsTFE7RUFDSSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxRQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQkFBQTtFQUNBLFdBQUE7QUFvTFo7QUFoTFk7RUFDSSxhQzVVUjtBRDhmUjtBQTlLZ0I7RUFDSSxhQ2xWSDtBRGtnQmpCO0FBM0tnQjtFQUNJLGFDN1VaO0FEMGZSO0FBeEtRO0VBQ0ksb0JBQUE7RUFDQSxlQUFBO0VBQ0EsY0MvVko7RURnV0ksZ0JBQUE7RUFDQSxTQUFBO0VBQ0EsYUFBQTtFQUNBLGNBQUE7QUEwS1o7QUF2S1E7RUFDSSxvQkFBQTtFQUNBLFFBQUE7RUFDQSxtQkFBQTtFQUNBLHlCQUFBO0VBQ0Esb0JBQUE7RUFDQSxlQUFBO0VBQ0EsY0M3V0o7RUQ4V0ksZ0JBQUE7RUFDQSxTQUFBO0FBeUtaO0FBdktZO0VBQ0ksYUNsWFI7QUQyaEJSO0FBTUEsNHp5QkFBNHp5QiIsInNvdXJjZXNDb250ZW50IjpbIi56ZWxmLWJ1dHRvbi1leHRlcm5hbC1saW5rIHtcbiAgICBkaXNwbGF5OiBibG9jaztcblxuICAgICYtLXdpZGUge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG59XG5cbi56ZWxmLWJ1dHRvbiB7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmb250LWZhbWlseTogUG9wcGlucztcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBnYXA6IDhweDtcbiAgICBoZWlnaHQ6IDU2cHg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBwYWRkaW5nOiAxNnB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB1c2VyLXNlbGVjdDogbm9uZTtcblxuICAgICZfX3RleHQge1xuICAgICAgICAmLS1tYXJnaW4tcmlnaHQge1xuICAgICAgICAgICAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tdGhpbiB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDhweDtcbiAgICAgICAgcGFkZGluZzogMTJweCAxNnB4O1xuICAgIH1cblxuICAgICYtLXdpZGUge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmLS1oeXBlcmxpbmsge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgY29sb3I6ICRncmF5O1xuICAgICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDk5OTlweDtcbiAgICAgICAgdHJhbnNpdGlvbjogY29sb3IgMC4ycyAkc21vb3RoQmV6aWVyLCBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgJHNtb290aEJlemllcjtcblxuICAgICAgICAmLS1zbWFsbCB7XG4gICAgICAgICAgICBmb250LXNpemU6IDExcHg7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogJGdyYXk7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGNvbG9yOiAkYmxhY2s7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkcGxhdGludW07XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogJGJsYWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGNvbG9yOiAkdGF1cGVHcmF5ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogJHRhdXBlR3JheTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWJsYWNrIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGJsYWNrICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiAkd2hpdGUgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjogY29sb3IgMC4zcyAkc21vb3RoQmV6aWVyLCBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgJHNtb290aEJlemllcjtcblxuICAgICAgICAmOmZvY3VzLFxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRncmF5ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGdyYXkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiAkd2hpdGUgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiAkd2hpdGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS13aGl0ZSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICR3aGl0ZSAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogJGJsYWNrICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246IGNvbG9yIDAuM3MgJHNtb290aEJlemllciwgYmFja2dyb3VuZC1jb2xvciAwLjNzICRzbW9vdGhCZXppZXI7XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYW50aUZsYXNoV2hpdGUgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkYW50aUZsYXNoV2hpdGUgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiAkYmxhY2sgIWltcG9ydGFudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiAkYmxhY2s7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmLS1vdXRsaW5lZCB7XG4gICAgICAgIGJvcmRlcjogMXB4IHNvbGlkICRibGFjayAhaW1wb3J0YW50O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkd2hpdGUgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6ICRibGFjayAhaW1wb3J0YW50O1xuICAgICAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjNzICRzbW9vdGhCZXppZXIsIGJhY2tncm91bmQtY29sb3IgMC4zcyAkc21vb3RoQmV6aWVyO1xuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHBsYXRpbnVtICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICAmW2Rpc2FibGVkXSB7XG4gICAgICAgICAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICAgICAgICAgICAgY29sb3I6ICRncmF5ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogJGJsYWNrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tZXJyb3Ige1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkZXJyb3JMaWdodCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogJGVycm9yICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6ICRlcnJvciAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tc3VjY2VzcyB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRjb3JyZWN0TGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6ICRjb3JyZWN0ICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6ICRjb3JyZWN0ICFpbXBvcnRhbnQ7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi56ZWxmLWljb24tYnV0dG9uIHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICRhbnRpRmxhc2hXaGl0ZSAhaW1wb3J0YW50O1xuICAgIGJvcmRlci1yYWRpdXM6IDU2cHg7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICBoZWlnaHQ6IDU2cHg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgbWluLWhlaWdodDogNTZweDtcbiAgICBtaW4td2lkdGg6IDU2cHg7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICB0cmFuc2l0aW9uOiBjb2xvciAwLjNzICRzbW9vdGhCZXppZXIsIGJhY2tncm91bmQtY29sb3IgMC4zcyAkc21vb3RoQmV6aWVyO1xuICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgIHdpZHRoOiA1NnB4O1xuXG4gICAgJi56ZWxmLWljb24tYnV0dG9uLS1ib3JkZXItc29mdCB7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gICAgfVxuXG4gICAgc3ZnIHtcbiAgICAgICAgdHJhbnNpdGlvbjogZmlsbCAwLjNzICRzbW9vdGhCZXppZXI7XG4gICAgICAgIGZpbGw6ICRibGFjaztcbiAgICB9XG5cbiAgICAmOmhvdmVyIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2I1ODlmMCAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogd2hpdGU7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6IHdoaXRlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tYm9yZGVyLXNvZnQge1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIH1cblxuICAgICYtLTQwIHtcbiAgICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgICBtaW4taGVpZ2h0OiA0MHB4O1xuICAgICAgICBtaW4td2lkdGg6IDQwcHg7XG4gICAgICAgIHdpZHRoOiA0MHB4O1xuICAgICAgICBib3JkZXItcmFkaXVzOiA0MHB4O1xuXG4gICAgICAgICYuemVsZi1pY29uLWJ1dHRvbi0tYm9yZGVyLXNvZnQge1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTRweDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWJsYWNrIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGJsYWNrICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiAkd2hpdGUgIWltcG9ydGFudDtcbiAgICAgICAgdHJhbnNpdGlvbjogY29sb3IgMC4zcyAkc21vb3RoQmV6aWVyLCBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgJHNtb290aEJlemllcjtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogJHdoaXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgJjpmb2N1cyxcbiAgICAgICAgJjpob3ZlciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkZ3JheSAhaW1wb3J0YW50O1xuICAgICAgICB9XG5cbiAgICAgICAgJltkaXNhYmxlZF0ge1xuICAgICAgICAgICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRwbGF0aW51bSAhaW1wb3J0YW50O1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6ICRmcmVuY2hHcmF5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJi0tYW50aS1mbGFzaC13aGl0ZSB7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRhbnRpRmxhc2hXaGl0ZSAhaW1wb3J0YW50O1xuICAgICAgICBjb2xvcjogJGJsYWNrICFpbXBvcnRhbnQ7XG5cbiAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgIGZpbGw6ICRibGFjaztcbiAgICAgICAgfVxuXG4gICAgICAgICY6Zm9jdXMsXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2I1ODlmMCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHdoaXRlO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6ICR3aGl0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbZGlzYWJsZWRdIHtcbiAgICAgICAgICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkcGxhdGludW0gIWltcG9ydGFudDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiAkZnJlbmNoR3JheTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLWVycm9yIHtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGVycm9yTGlnaHQgIWltcG9ydGFudDtcbiAgICAgICAgY29sb3I6ICRlcnJvciAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiAkZXJyb3IgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtLXN1Y2Nlc3Mge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkY29ycmVjdExpZ2h0ICFpbXBvcnRhbnQ7XG4gICAgICAgIGNvbG9yOiAkY29ycmVjdCAhaW1wb3J0YW50O1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiAkY29ycmVjdCAhaW1wb3J0YW50O1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiQGltcG9ydCBcIi4uLy4uL3N0eWxlcy92YXJpYWJsZXMuc2Nzc1wiO1xuQGltcG9ydCBcIi4uLy4uL3N0eWxlcy9idXR0b25zLnNjc3NcIjtcblxuOmhvc3Qge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICRzZWFTYWx0O1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIG1pbi1oZWlnaHQ6IDEwMHZoO1xuICAgIHdpZHRoOiAxMDAlO1xuXG4gICAgKiB7XG4gICAgICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gICAgfVxufVxuXG4ubWFuYWdlLWRvbWFpbnMge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIHBhZGRpbmc6IDE2cHg7XG4gICAgZ2FwOiAyNHB4O1xuICAgIGhlaWdodDogMTAwJTtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICB3aWR0aDogMTAwJTtcblxuICAgICZfX2hlYWRlciB7XG4gICAgICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDEwLCAxZnIpOyAvLyBBZGp1c3RlZCB0byAzIGNvbHVtbnNcbiAgICAgICAgY29sdW1uLWdhcDogMTJweDtcbiAgICAgICAgYWxpZ24tY29udGVudDogY2VudGVyO1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgICAgIGhlaWdodDogNzZweDtcbiAgICAgICAgZ2FwOiAyNHB4O1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX19jb2wxLFxuICAgICZfX2NvbDMge1xuICAgICAgICBncmlkLWNvbHVtbjogc3BhbiAyO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIH1cblxuICAgICZfX2NvbDEge1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgfVxuXG4gICAgJl9fY29sMyB7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gICAgfVxuXG4gICAgJl9fY29sMiB7XG4gICAgICAgIGdyaWQtY29sdW1uOiBzcGFuIDY7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIH1cblxuICAgICZfX3RvcC1idXR0b24ge1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIGdhcDogOHB4O1xuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDUycHg7XG4gICAgICAgIGhlaWdodDogNTJweDtcbiAgICAgICAgd2lkdGg6IDUycHg7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDUycHg7XG4gICAgICAgIG1pbi13aWR0aDogNTJweDtcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJGFudGlGbGFzaFdoaXRlICFpbXBvcnRhbnQ7XG4gICAgICAgIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4zcyAkc21vb3RoQmV6aWVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBmaWxsIDAuM3MgJHNtb290aEJlemllcjtcbiAgICAgICAgICAgIGZpbGw6ICRibGFjaztcbiAgICAgICAgfVxuXG4gICAgICAgICY6aG92ZXIge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogI2I1ODlmMCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgY29sb3I6IHdoaXRlO1xuXG4gICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgIGZpbGw6IHdoaXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fbmFtZSB7XG4gICAgICAgIGZvbnQtc2l6ZTogMjBweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgICAgICAgZm9udC1mYW1pbHk6IE1lbmRhO1xuICAgICAgICBjb2xvcjogJGJsYWNrO1xuICAgICAgICBtYXJnaW46IDA7XG4gICAgfVxuXG4gICAgJl9fdGFza3Mge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICAgICAgICBnYXA6IDE2cHg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG5cbiAgICAmX190aXRsZSB7XG4gICAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICAgICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICAgICAgZm9udC1mYW1pbHk6IFBvcHBpbnM7XG4gICAgICAgIGNvbG9yOiAkYmxhY2s7XG4gICAgICAgIG1hcmdpbjogMDtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuICAgICZfX2NvbnRlbnQge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgbWF4LXdpZHRoOiA2MDBweDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiAyNHB4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB9XG5cbiAgICAmX19mb290ZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LWdyb3c6IDE7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICAgIGdhcDogOHB4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICB9XG59XG5cbi5kb21haW5zIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgZ2FwOiA0cHg7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuLmRvbWFpbiB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiA4cHg7XG4gICAgcGFkZGluZzogMTZweDtcbiAgICBib3JkZXItcmFkaXVzOiAxNnB4O1xuICAgIGJhY2tncm91bmQtY29sb3I6ICRhbnRpRmxhc2hXaGl0ZTtcbiAgICB3aWR0aDogMTAwJTtcbiAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgJHNtb290aEJlemllcjtcblxuICAgICY6aG92ZXIge1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTJlMmUyO1xuICAgIH1cblxuICAgICZfX2RvdHMge1xuICAgICAgICBoZWlnaHQ6IDI0cHg7XG4gICAgICAgIHdpZHRoOiAyNHB4O1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuXG4gICAgICAgIHN2ZyB7XG4gICAgICAgICAgICBmaWxsOiAkdGF1cGVHcmF5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJl9fZGlzcGxheSB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICAgIGdhcDogOHB4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgIH1cblxuICAgICZfX2NsaWNrYWJsZSB7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgJl9fYXZhdGFyIHtcbiAgICAgICAgY3Vyc29yOiBpbmhlcml0O1xuICAgICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICAgIHdpZHRoOiA0MHB4O1xuICAgICAgICBtaW4td2lkdGg6IDQwcHg7XG4gICAgICAgIG1pbi1oZWlnaHQ6IDQwcHg7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDQwcHg7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuXG4gICAgICAgICYtLXByaW1hcnkge1xuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHByaW1hcnlDb2xvcjtcbiAgICAgICAgfVxuXG4gICAgICAgICYtLXNlY29uZGFyeSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkc2Vjb25kYXJ5Q29sb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19jaGFyYWN0ZXIge1xuICAgICAgICBmb250LWZhbWlseTogTWVuZGE7XG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgY29sb3I6IHdoaXRlO1xuICAgIH1cblxuICAgICZfX2luZm8ge1xuICAgICAgICBkaXNwbGF5OiBpbmxpbmUtZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgfVxuXG4gICAgJl9fbmFtZSB7XG4gICAgICAgIGN1cnNvcjogaW5oZXJpdDtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIH1cblxuICAgICZfX3N0YXR1cy1pbmRpY2F0b3JzIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgZ2FwOiA0cHg7XG4gICAgfVxuXG4gICAgJl9fc3RhdHVzLWluZGljYXRvciB7XG4gICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICBoZWlnaHQ6IDQwcHg7XG4gICAgICAgIHdpZHRoOiA0MHB4O1xuICAgICAgICBtaW4taGVpZ2h0OiA0MHB4O1xuICAgICAgICBtaW4td2lkdGg6IDQwcHg7XG4gICAgICAgIHVzZXItc2VsZWN0OiBub25lO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxNHB4O1xuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkc2VhU2FsdDtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgZmlsbDogJGJsYWNrO1xuICAgICAgICB9XG5cbiAgICAgICAgJi0td2FybmluZyB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkZXJyb3JMaWdodDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiAkc2Vjb25kYXJ5Q29sb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmLS1lcnJvciB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkZXJyb3JMaWdodDtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiAkZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAmX19hY3Rpb24ge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgaGVpZ2h0OiA0MHB4O1xuICAgICAgICB3aWR0aDogNDBweDtcbiAgICAgICAgbWluLWhlaWdodDogNDBweDtcbiAgICAgICAgbWluLXdpZHRoOiA0MHB4O1xuICAgICAgICBib3JkZXI6IG5vbmU7XG4gICAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDE0cHg7XG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6ICRzZWFTYWx0O1xuICAgICAgICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuM3MgJHNtb290aEJlemllcjtcblxuICAgICAgICBzdmcge1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogZmlsbCAwLjNzICRzbW9vdGhCZXppZXI7XG4gICAgICAgICAgICBmaWxsOiAkYmxhY2s7XG4gICAgICAgIH1cblxuICAgICAgICAmOmhvdmVyIHtcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNiNTg5ZjAgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGNvbG9yOiB3aGl0ZTtcblxuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiB3aGl0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgICYtZGV0YWlsIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgICAgZ2FwOiA4cHg7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBwYWRkaW5nOiAwIDMycHg7XG5cbiAgICAgICAgJl9fcm93IHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBmbGV4OiAxIDEgYXV0bztcbiAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgICAgICAgICBnYXA6IDhweDtcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICAgICAgICB9XG5cbiAgICAgICAgJl9fY29sIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICAgICAgZ2FwOiA0cHg7XG4gICAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgfVxuXG4gICAgICAgICZfX2ljb24ge1xuICAgICAgICAgICAgc3ZnIHtcbiAgICAgICAgICAgICAgICBmaWxsOiAkYmxhY2s7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICYtLXdhcm5pbmcge1xuICAgICAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGw6ICRzZWNvbmRhcnlDb2xvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICYtLWVycm9yIHtcbiAgICAgICAgICAgICAgICBzdmcge1xuICAgICAgICAgICAgICAgICAgICBmaWxsOiAkZXJyb3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJl9fdGV4dCB7XG4gICAgICAgICAgICBmb250LWZhbWlseTogUG9wcGlucztcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTFweDtcbiAgICAgICAgICAgIGNvbG9yOiAkYmxhY2s7XG4gICAgICAgICAgICBmb250LXdlaWdodDogNjAwO1xuICAgICAgICAgICAgbWFyZ2luOiAwO1xuICAgICAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgICAgIGZsZXg6IDEgMSBhdXRvO1xuICAgICAgICB9XG5cbiAgICAgICAgJl9fY291bnRkb3duIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4O1xuICAgICAgICAgICAgZ2FwOiA0cHg7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiBQb3BwaW5zO1xuICAgICAgICAgICAgZm9udC1zaXplOiAxMXB4O1xuICAgICAgICAgICAgY29sb3I6ICRibGFjaztcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgICAgICAgICBtYXJnaW46IDA7XG5cbiAgICAgICAgICAgIHN2ZyB7XG4gICAgICAgICAgICAgICAgZmlsbDogJGJsYWNrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiJHByaW1hcnlDb2xvcjogIzBlMjZmZjtcbiRzZWNvbmRhcnlDb2xvcjogI2ZmNTcyMTtcbiRibGFjazogIzE4MTgxODtcbiRncmF5OiAjNzM3NzdmO1xuJHRhdXBlR3JheTogIzk2OTM5ZTtcbiRmcmVuY2hHcmF5OiAjYzNjNmNmO1xuJHBsYXRpbnVtOiAjZTNlM2UzO1xuJGFudGlGbGFzaFdoaXRlOiAjZWVlZGYxO1xuJHNlYVNhbHQ6ICNmOWY5ZmM7XG4kd2hpdGU6ICNmZmZmZmY7XG4kcHJpbWFyeUxpZ2h0OiAjZmZlZWU5O1xuJGVycm9yRGFyazogIzYwMTQxMDtcbiRlcnJvcjogI2RjMzYyZTtcbiRlcnJvckxpZ2h0OiAjZmNlZWVlO1xuJGNvcnJlY3REYXJrOiAjMGY1MjIzO1xuJGNvcnJlY3Q6ICMxZWE0NDY7XG4kY29ycmVjdExpZ2h0OiAjZTdmOGVkO1xuJGluZm9EYXJrOiAjMDA0YTc3O1xuJGluZm86ICMzOTk4ZDM7XG4kaW5mb0xpZ2h0OiAjZWNmM2ZlO1xuXG4kc21vb3RoQmV6aWVyOiBjdWJpYy1iZXppZXIoMC4yNSwgMC40LCAwLjcsIDEpO1xuXG4kbWF4RXh0cmFTbWFsbDogNTk1cHg7XG4kbWluU21hbGw6IDYwMHB4O1xuJG1lZGl1bTogNzY4cHg7XG4kbGFyZ2U6IDg4OXB4O1xuJGNvbXB1dGVyczogMTIwMHB4O1xuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}


/***/ }),

/***/ 56527:
/*!*************************************!*\
  !*** ./src/app/pipes/timer.pipe.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TimerPipe: () => (/* binding */ TimerPipe)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37580);

class TimerPipe {
  constructor(changeDetectorRef, ngZone) {
    this.changeDetectorRef = changeDetectorRef;
    this.ngZone = ngZone;
    this.timer = null;
  }
  transform(value, ...args) {
    if (!value) return "";
    this.removeTimer();
    this.createTimer();
    const now = new Date().getTime();
    const target = new Date(value).getTime();
    const difference = target - now;
    if (difference <= 0) return "";
    const minutes = Math.floor(difference / (1000 * 60) % 60);
    const hours = Math.floor(difference / (1000 * 60 * 60) % 24);
    return `${hours} H ${minutes} M`;
  }
  createTimer() {
    this.ngZone.runOutsideAngular(() => {
      this.timer = window.setInterval(() => {
        this.ngZone.run(() => this.changeDetectorRef.markForCheck());
      }, 1000);
    });
  }
  removeTimer() {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
  }
  ngOnDestroy() {
    this.removeTimer();
  }
  static {
    this.ɵfac = function TimerPipe_Factory(t) {
      return new (t || TimerPipe)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ChangeDetectorRef, 16), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.NgZone, 16));
    };
  }
  static {
    this.ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({
      name: "timer",
      type: TimerPipe,
      pure: false,
      standalone: true
    });
  }
}


/***/ })

}]);
//# sourceMappingURL=src_app_manage-domains_manage-domains_component_ts.js.map