import { firstValueFrom } from "rxjs";

import { provideHttpClient } from "@angular/common/http";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetModule, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatDialogModule } from "@angular/material/dialog";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Router, RouterModule } from "@angular/router";
import { TranslocoService } from "@jsverse/transloco";

import { ZelfNameService } from "app/zelf-name-service.service";
import { TranslocoTestingModule } from "../testing/transloco-testing.module";
import { CtaSheetComponent } from "./cta-sheet.component";

describe("CtaSheetComponent", () => {
    let component: CtaSheetComponent;
    let fixture: ComponentFixture<CtaSheetComponent>;
    let mockBottomSheetRef: jasmine.SpyObj<MatBottomSheetRef<CtaSheetComponent>>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockZelfNameService: jasmine.SpyObj<ZelfNameService>;
    let translocoService: TranslocoService;

    const mockData = {
        wallet: {
            publicData: {
                zelfName: "test.zelf",
                type: "mainnet",
                expiresAt: new Date(Date.now() + 86400000).toISOString(),
                isFullyExpired: false,
                isInGracePeriod: false,
            },
        },
    };

    beforeEach(async () => {
        mockBottomSheetRef = jasmine.createSpyObj("MatBottomSheetRef", ["dismiss"]);
        mockRouter = jasmine.createSpyObj("Router", ["navigate"]);
        mockZelfNameService = jasmine.createSpyObj("ZelfNameService", ["searchZelfNameV2"]);

        await TestBed.configureTestingModule({
            imports: [CtaSheetComponent, TranslocoTestingModule, MatBottomSheetModule, MatDialogModule, RouterModule, NoopAnimationsModule],
            providers: [
                { provide: MatBottomSheetRef, useValue: mockBottomSheetRef },
                { provide: MAT_BOTTOM_SHEET_DATA, useValue: mockData },
                { provide: Router, useValue: mockRouter },
                { provide: ZelfNameService, useValue: mockZelfNameService },
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

    it("should initialize benefits array", () => {
        expect(component.benefits.length).toBeGreaterThan(0);
    });

    it("should set isAvailable to false when wallet is not fully expired", () => {
        expect(component.isAvailable).toBeFalse();
    });

    it("should check zelfName availability when wallet is fully expired", async () => {
        const expiredData = {
            wallet: {
                publicData: {
                    zelfName: "test.zelf",
                    isFullyExpired: true,
                },
            },
        };

        mockZelfNameService.searchZelfNameV2.and.returnValue(Promise.resolve({ data: { available: true } }));

        TestBed.resetTestingModule();

        await TestBed.configureTestingModule({
            imports: [CtaSheetComponent, TranslocoTestingModule, MatBottomSheetModule, MatDialogModule, RouterModule, NoopAnimationsModule],
            providers: [
                { provide: MatBottomSheetRef, useValue: mockBottomSheetRef },
                { provide: MAT_BOTTOM_SHEET_DATA, useValue: expiredData },
                { provide: Router, useValue: mockRouter },
                { provide: ZelfNameService, useValue: mockZelfNameService },
                provideHttpClient(),
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        const expiredFixture = TestBed.createComponent(CtaSheetComponent);
        const expiredComponent = expiredFixture.componentInstance;
        const expiredTranslocoService = TestBed.inject(TranslocoService);

        // Set up translations before initializing
        await firstValueFrom(expiredTranslocoService.load("en"));
        await expiredComponent.ngOnInit();

        expiredFixture.detectChanges();

        expect(mockZelfNameService.searchZelfNameV2).toHaveBeenCalledWith("zelfName", "test.zelf");
        expect(expiredComponent.isAvailable).toBeTrue();
    });

    it("should calculate hours and days left correctly", () => {
        if (!component.data.wallet.publicData) throw new Error("Wallet public data is undefined");

        // Set expiration to 25 hours from now to account for timing delays
        const futureDate = new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString();

        component.data.wallet.publicData.expiresAt = futureDate;

        // Allow for small timing variations
        expect(component.hoursLeft).toBeGreaterThanOrEqual(24);
        expect(component.daysLeft).toBe(1);
    });

    it("should handle cancel action", () => {
        component.cancel();

        expect(mockBottomSheetRef.dismiss).toHaveBeenCalled();
    });

    it("should handle confirm action", () => {
        component.confirm();

        expect(mockBottomSheetRef.dismiss).toHaveBeenCalled();
    });

    it("should navigate to payments on goToPayments", async () => {
        await component.goToPayments();

        expect(mockRouter.navigate).toHaveBeenCalledWith(["/external-link"], {
            queryParams: {
                externalUrl: "https://payment.zelf.world?zelfName=test.zelf",
            },
        });

        expect(mockBottomSheetRef.dismiss).toHaveBeenCalled();
    });

    it("should correctly determine expiration status", () => {
        const futureDate = new Date(Date.now() + 86400000 * 25).toISOString(); // 25 days (between 16-30)
        const nearFutureDate = new Date(Date.now() + 86400000 * 10).toISOString(); // 10 days (between 7-15)
        const veryNearFutureDate = new Date(Date.now() + 86400000 * 3).toISOString(); // 3 days (between 0-7)
        const pastDate = new Date(Date.now() - 86400000).toISOString(); // 1 day ago

        expect(component.has30To16DaysLeft(futureDate)).toBeTrue();
        expect(component.has15To7DaysLeft(nearFutureDate)).toBeTrue();
        expect(component.has7DaysLeft(veryNearFutureDate)).toBeTrue();
        expect(component.isExpired(pastDate)).toBeTrue();
    });

    it("should toggle expand state", () => {
        expect(component.isExpanded).toBeFalse();

        component.toggleExpand();

        expect(component.isExpanded).toBeTrue();

        component.toggleExpand();

        expect(component.isExpanded).toBeFalse();
    });
});
