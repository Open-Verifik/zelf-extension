import { provideHttpClient } from "@angular/common/http";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatDialogModule } from "@angular/material/dialog";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Router, RouterModule } from "@angular/router";
import { TranslocoService } from "@jsverse/transloco";
import { firstValueFrom } from "rxjs";

import { TagModel } from "app/tags.service";
import { ZelfNameService } from "app/zelf-name-service.service";
import { TranslocoTestingModule } from "../testing/transloco-testing.module";
import { CtaSheetComponent } from "./cta-sheet.component";
import { TagsService } from "app/tags.service";

describe("CtaSheetComponent", () => {
    let component: CtaSheetComponent;
    let fixture: ComponentFixture<CtaSheetComponent>;
    let mockBottomSheetRef: jasmine.SpyObj<MatBottomSheetRef<CtaSheetComponent>>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockTagService: jasmine.SpyObj<TagsService>;
    let translocoService: TranslocoService;

    const mockData = {
        wallet: new TagModel({
            publicData: {
                tagName: "test.zelf",
                type: "mainnet",
                expiresAt: new Date(Date.now() + 86400000).toISOString(),
                isFullyExpired: false,
                isInGracePeriod: false,
            },
        }),
    };

    beforeEach(async () => {
        mockBottomSheetRef = jasmine.createSpyObj("MatBottomSheetRef", ["dismiss"]);
        mockRouter = jasmine.createSpyObj("Router", ["navigate"]);
        mockTagService = jasmine.createSpyObj("ZelfNameService", ["searchZelfNameV2"]);

        await TestBed.configureTestingModule({
            imports: [CtaSheetComponent, TranslocoTestingModule, MatBottomSheetModule, MatDialogModule, RouterModule, NoopAnimationsModule],
            providers: [
                { provide: MatBottomSheetRef, useValue: mockBottomSheetRef },
                { provide: MAT_BOTTOM_SHEET_DATA, useValue: mockData },
                { provide: Router, useValue: mockRouter },
                { provide: ZelfNameService, useValue: mockTagService },
                provideHttpClient(),
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(CtaSheetComponent);
        component = fixture.componentInstance;
        translocoService = TestBed.inject(TranslocoService);

        await firstValueFrom(translocoService.load("en"));

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
