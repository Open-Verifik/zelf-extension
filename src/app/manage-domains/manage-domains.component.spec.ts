import { ChangeDetectorRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatBottomSheet, MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { BehaviorSubject, Subject } from "rxjs";
import { ChromeService } from "../chrome.service";
import { ConfirmationDialogComponent } from "../confirmation-dialog/confirmation-dialog.component";
import { CtaSheetComponent } from "../cta-sheet/cta-sheet.component";
import { WalletModel, WalletPublicDataModel } from "../wallet";
import { WalletService } from "../wallet.service";
import { ManageDomainsComponent } from "./manage-domains.component";
import { provideHttpClient } from "@angular/common/http";

describe("ManageDomainsComponent", () => {
    let component: ManageDomainsComponent;
    let fixture: ComponentFixture<ManageDomainsComponent>;
    let mockBottomSheet: jasmine.SpyObj<MatBottomSheet>;
    let mockDialog: jasmine.SpyObj<MatDialog>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockTranslocoService: jasmine.SpyObj<TranslocoService>;
    let mockWalletService: jasmine.SpyObj<WalletService>;
    let mockChromeService: jasmine.SpyObj<ChromeService>;
    let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

    const mockPublicData = new WalletPublicDataModel({
        _id: "test-id",
        btcAddress: "btc-address",
        ethAddress: "eth-address",
        expiresAt: "2025-04-29T00:00:00.000Z",
        zelfName: "test.zelf",
        origin: "online",
        registeredAt: "2024-04-29T00:00:00.000Z",
        solanaAddress: "sol-address",
        type: "mainnet",
    });

    const mockWallet: Partial<WalletModel> = {
        name: "Test Wallet",
        publicData: mockPublicData,
        image: "test-image.png",
    };

    beforeEach(async () => {
        mockBottomSheet = jasmine.createSpyObj("MatBottomSheet", ["open"]);
        mockDialog = jasmine.createSpyObj("MatDialog", ["open"]);
        mockRouter = jasmine.createSpyObj("Router", ["navigate"]);
        mockTranslocoService = jasmine.createSpyObj("TranslocoService", ["translate"]);
        mockWalletService = jasmine.createSpyObj("WalletService", ["getAllWalletsFromStorage", "checkIfLastWallet", "logoutOfWallet"]);
        mockChangeDetectorRef = jasmine.createSpyObj("ChangeDetectorRef", ["detectChanges"]);

        mockChromeService = jasmine.createSpyObj("ChromeService", ["removeItem"], {
            getItem: () => Promise.resolve(null),
            setItem: () => Promise.resolve(null),
            onLastVerifiedChanged$: new BehaviorSubject(0).asObservable(),
            onWalletChanged$: new BehaviorSubject({}).asObservable(),
            onWalletsChanged$: new BehaviorSubject([]).asObservable(),
        });

        // Setup default mock returns
        mockWalletService.getAllWalletsFromStorage.and.returnValue(Promise.resolve({ wallet: mockWallet, wallets: [] }));
        mockWalletService.checkIfLastWallet.and.returnValue(Promise.resolve(false));
        mockTranslocoService.translate.and.returnValue("translated text");

        await TestBed.configureTestingModule({
            imports: [ManageDomainsComponent, MatBottomSheetModule, MatDialogModule, TranslocoModule, RouterModule, NoopAnimationsModule],
            providers: [
                provideHttpClient(),
                { provide: MatBottomSheet, useValue: mockBottomSheet },
                { provide: MatDialog, useValue: mockDialog },
                { provide: Router, useValue: mockRouter },
                { provide: TranslocoService, useValue: mockTranslocoService },
                { provide: WalletService, useValue: mockWalletService },
                { provide: ChromeService, useValue: mockChromeService },
                { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ManageDomainsComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should load wallets on init", async () => {
        mockWalletService.getAllWalletsFromStorage.and.returnValue(Promise.resolve({ wallet: mockWallet, wallets: [] }));
        component.ngOnInit();

        await fixture.whenStable();

        expect(mockWalletService.getAllWalletsFromStorage).toHaveBeenCalled();
        expect(component.wallets).toEqual([mockWallet]);
        expect(component.loading).toBeFalse();
    });

    it("should handle wallet download", () => {
        const mockAnchor = {
            href: "",
            download: "",
            click: jasmine.createSpy("click"),
        };
        const mockCreateElement = spyOn(document, "createElement").and.returnValue(mockAnchor as unknown as HTMLAnchorElement);

        component.downloadZelfProof({ ...mockWallet, image: "test-image.png" });

        expect(mockCreateElement).toHaveBeenCalledWith("a");
        expect(mockAnchor.href).toBe("test-image.png");
        expect(mockAnchor.download).toBe(`zelfproof_${mockPublicData.zelfName}.png`);
        expect(mockAnchor.click).toHaveBeenCalled();
    });

    it("should not download if wallet has no name", () => {
        const mockCreateElement = spyOn(document, "createElement");

        component.downloadZelfProof({});

        expect(mockCreateElement).not.toHaveBeenCalled();
    });

    it("should navigate to payments route", () => {
        const routerSpy = mockRouter.navigate;

        component.goToPurchase(mockWallet);

        expect(routerSpy).toHaveBeenCalledWith(["/external-link"], {
            queryParams: { externalUrl: `https://payment.zelf.world/purchase?zelfName=${mockPublicData.zelfName}` },
        });
    });

    it("should handle logout for last wallet", async () => {
        mockWalletService.checkIfLastWallet.and.returnValue(Promise.resolve(true));

        const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: new Subject(), close: null });

        mockDialog.open.and.returnValue(dialogRefSpyObj);

        await component.logoutOfWallet(mockWallet);

        expect(mockDialog.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            data: jasmine.any(Object),
        });
    });

    it("should handle logout for non-last wallet", async () => {
        mockWalletService.checkIfLastWallet.and.returnValue(Promise.resolve(false));

        const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: new Subject(), close: null });

        mockDialog.open.and.returnValue(dialogRefSpyObj);

        await component.logoutOfWallet(mockWallet);

        expect(mockDialog.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
            panelClass: "zelf-dialog",
            backdropClass: "zelf-backdrop",
            data: jasmine.any(Object),
        });
    });

    it("should not open logout dialog if wallet has no name", async () => {
        await component.logoutOfWallet({});

        expect(mockDialog.open).not.toHaveBeenCalled();
    });

    it("should show details when wallet has expiring status", () => {
        const expiredPublicData = new WalletPublicDataModel({
            ...mockPublicData,
            isFullyExpired: true,
        });

        const expiredWallet: Partial<WalletModel> = {
            publicData: expiredPublicData,
        };

        expect(component.showDetails(expiredWallet)).toBeTrue();
    });

    it("should navigate to domain with CTA sheet for expiring wallet", () => {
        const expiringPublicData = new WalletPublicDataModel({
            ...mockPublicData,
            isExpiringSoon: true,
        });

        const expiringWallet: Partial<WalletModel> = {
            publicData: expiringPublicData,
        };

        const bottomSheetRefSpyObj = jasmine.createSpyObj({ afterDismissed: new Subject(), dismiss: null });

        mockBottomSheet.open.and.returnValue(bottomSheetRefSpyObj);
        component.goToDomain(expiringWallet);

        expect(mockBottomSheet.open).toHaveBeenCalledWith(CtaSheetComponent as any, {
            backdropClass: "zelf-backdrop",
            panelClass: "zelf-bottom-sheet",
            height: "100vh",
            maxHeight: "100vh",
            data: { wallet: expiringWallet },
        });
    });

    it("should navigate directly to domain for normal wallet", () => {
        const normalWallet: Partial<WalletModel> = {
            publicData: mockPublicData,
        };

        spyOn(component, "showDetails").and.returnValue(false);

        component.goToDomain(normalWallet);

        expect(mockRouter.navigate).toHaveBeenCalledWith(["/domain"], {
            queryParams: { zelfName: mockPublicData.zelfName },
        });
    });

    it("should clean up on destroy", () => {
        const unsubscriberSpy = spyOn(component["unsubscriber$"], "next");
        const unsubscriberCompleteSpy = spyOn(component["unsubscriber$"], "complete");
        const cancelSpy = spyOn(component["_loadWalletsDebounced"], "cancel");

        component.ngOnDestroy();

        expect(unsubscriberSpy).toHaveBeenCalled();
        expect(unsubscriberCompleteSpy).toHaveBeenCalled();
        expect(cancelSpy).toHaveBeenCalled();
    });
});
