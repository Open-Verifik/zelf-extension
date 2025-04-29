import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { RouterModule, Routes } from "@angular/router";

import { SheetTestComponent } from "./sheet-test.component";

const routes: Routes = [{ path: "sheet", component: SheetTestComponent }];

@NgModule({
    imports: [CommonModule, MatBottomSheetModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class E2ETestHelpersModule {}
