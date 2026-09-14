import { FormBuilder } from "@angular/forms";
import { of } from "rxjs";
import { SecurityBiometricsComponent } from "./security-biometrics.component";

describe("Passwordless biometric requests (#522)", () => {
    let component: SecurityBiometricsComponent;
    let vault: any;
    let http: any;
    let decrypt: jasmine.Spy;
    beforeEach(() => {
        vault = { password: "NO_PASSWORD_PLACEHOLDER", securityType: "withoutPassword" };
        http = { encryptMessage: jasmine.createSpy().and.resolveTo("encrypted-password") };
        const tags = { getReferral: async () => "", getDomain: async () => "zelf", getTagName: async () => "alice.zelf" };
        component = new SecurityBiometricsComponent(
            { snapshot: { queryParams: {} }, queryParams: of({}) } as any, {} as any, {} as any,
            { translateErrorMessage: () => "Please retry" } as any, new FormBuilder(), http, {} as any, tags as any,
            { translate: (key: string) => key } as any, vault, {} as any,
        );
        component.flow = "unlock";
        decrypt = spyOn<any>(component, "_decryptTag").and.resolveTo();
    });
    afterEach(() => component.ngOnDestroy());
    it("omits the placeholder from the passwordless request", async () => {
        await component.onBiometricsScanned("encrypted-face");
        expect(http.encryptMessage).not.toHaveBeenCalled();
        const payload = decrypt.calls.mostRecent().args[0];
        expect(Object.prototype.hasOwnProperty.call(payload, "password")).toBeFalse();
        expect(payload.faceBase64).toBe("encrypted-face");
    });
    for (const type of ["securePassword", "pin"]) {
        it(`preserves encrypted credentials for ${type}`, async () => {
            vault.securityType = type;
            vault.password = "fixture-secret";
            await component.onBiometricsScanned("encrypted-face");
            expect(http.encryptMessage).toHaveBeenCalledWith("fixture-secret");
            expect(decrypt.calls.mostRecent().args[0].password).toBe("encrypted-password");
        });
    }
    it("ends loading and allows retry if payload encryption fails", async () => {
        vault.securityType = "securePassword";
        http.encryptMessage.and.rejectWith(new Error("cannot_encrypt_message"));
        await component.onBiometricsScanned("encrypted-face");
        expect(component.apiLoading).toBeFalse();
        expect(component.errorTitle).toBe("errors.generic_title");
        expect(decrypt).not.toHaveBeenCalled();
    });
});
