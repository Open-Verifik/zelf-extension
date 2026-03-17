import { provideHttpClient } from "@angular/common/http";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatDialogModule } from "@angular/material/dialog";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Router, RouterModule } from "@angular/router";
import { TranslocoService } from "@jsverse/transloco";
import { firstValueFrom } from "rxjs";

import { TagModel, TagSearchResponse, TagsService } from "app/tags.service";
import { WalletService } from "app/wallet.service";
import { ZelfNameService } from "app/zelf-name-service.service";
import { TranslocoTestingModule } from "../testing/transloco-testing.module";
import { CtaSheetComponent } from "./cta-sheet.component";

describe("CtaSheetComponent", () => {
    let component: CtaSheetComponent;
    let fixture: ComponentFixture<CtaSheetComponent>;
    let mockBottomSheetRef: jasmine.SpyObj<MatBottomSheetRef<CtaSheetComponent>>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockZelfNameService: jasmine.SpyObj<ZelfNameService>;
    let mockTagsService: jasmine.SpyObj<TagsService>;
    let mockWalletService: jasmine.SpyObj<WalletService>;
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
        mockZelfNameService = jasmine.createSpyObj("ZelfNameService", ["setZelfName", "setZelfProof", "setZelfNameObject"]);
        mockTagsService = jasmine.createSpyObj("TagsService", [
            "searchTag",
            "setTagName",
            "setDomain",
            "setTagResponse",
            "setTagNameObject",
            "setZelfProof",
        ]);
        mockWalletService = jasmine.createSpyObj("WalletService", ["setWalletsToColdStorage", "deleteZelfProof"]);

        mockZelfNameService.setZelfName.and.returnValue(Promise.resolve());
        mockZelfNameService.setZelfProof.and.returnValue(Promise.resolve());
        mockZelfNameService.setZelfNameObject.and.returnValue(Promise.resolve());
        mockTagsService.searchTag.and.returnValue(
            Promise.resolve({ data: { ipfs: [], arweave: [], available: false, tagName: "test.zelf" } as TagSearchResponse })
        );
        mockTagsService.setTagName.and.returnValue(Promise.resolve());
        mockTagsService.setDomain.and.returnValue(Promise.resolve());
        mockTagsService.setTagResponse.and.returnValue(Promise.resolve());
        mockTagsService.setTagNameObject.and.returnValue(Promise.resolve());
        mockTagsService.setZelfProof.and.returnValue(Promise.resolve());
        mockWalletService.setWalletsToColdStorage.and.returnValue(Promise.resolve());
        mockWalletService.deleteZelfProof.and.returnValue(Promise.resolve());

        await TestBed.configureTestingModule({
            imports: [CtaSheetComponent, TranslocoTestingModule, MatBottomSheetModule, MatDialogModule, RouterModule, NoopAnimationsModule],
            providers: [
                { provide: MatBottomSheetRef, useValue: mockBottomSheetRef },
                { provide: MAT_BOTTOM_SHEET_DATA, useValue: mockData },
                { provide: Router, useValue: mockRouter },
                { provide: ZelfNameService, useValue: mockZelfNameService },
                { provide: TagsService, useValue: mockTagsService },
                { provide: WalletService, useValue: mockWalletService },
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
