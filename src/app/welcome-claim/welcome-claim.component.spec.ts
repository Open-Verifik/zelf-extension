import { FormBuilder } from "@angular/forms";
import { of } from "rxjs";
import { WelcomeClaimComponent } from "./welcome-claim.component";
import { TagModel } from "app/tags.service";

describe("Zelf ID name search (#522)", () => {
    let component: WelcomeClaimComponent;
    let tags: any;
    let router: any;
    beforeEach(() => {
        tags = jasmine.createSpyObj("Tags", ["searchTag", "createTagModelFromSearchResponse", "setFlow", "setTagName", "setZelfProof", "setDomain", "setTagNameObject", "setTagResponse"]);
        router = jasmine.createSpyObj("Router", ["navigate"]);
        component = new WelcomeClaimComponent(
            { queryParams: of({ mode: "enter" }) } as any, {} as any,
            { getItem: async () => undefined, isExtension: true } as any, {} as any,
            { getDomains: async () => ({}), loadDomainsFromStorage: async () => [], getDomainLicense: () => null } as any,
            new FormBuilder(), {} as any, router, tags, {} as any, {} as any,
        );
    });
    afterEach(() => component.ngOnDestroy());
    it("keeps the default domain usable on first launch", async () => {
        await component.ngOnInit();
        expect(component.form.get("domain")?.value).toBe("zelf");
        component.form.patchValue({ tagName: "alice" });
        tags.searchTag.and.resolveTo({ data: { available: false } });
        tags.createTagModelFromSearchResponse.and.returnValue(new TagModel({ zelfProof: "fixture-proof", publicData: { tagName: "alice.zelf", domain: "zelf" } }));
        await component.searchZelfName({ preventDefault() {} });
        expect(tags.searchTag).toHaveBeenCalledWith(jasmine.objectContaining({ tagName: "alice", domain: "zelf", os: "DESKTOP" }));
        expect(router.navigate).toHaveBeenCalledWith(["/welcome", "registered"]);
    });
    it("does not navigate with stale wallet data when the response cannot be imported", async () => {
        await component.ngOnInit();
        component.form.patchValue({ tagName: "alice" });
        tags.searchTag.and.resolveTo({ data: { available: false } });
        tags.createTagModelFromSearchResponse.and.returnValue(null);
        await component.searchZelfName({ preventDefault() {} });
        expect(router.navigate).not.toHaveBeenCalled();
        expect(component.searchFailed).toBeTrue();
        expect(component.loading).toBeFalse();
    });
    it("shows a recoverable error for failed requests", async () => {
        await component.ngOnInit();
        component.form.patchValue({ tagName: "alice" });
        tags.searchTag.and.rejectWith(new Error("offline"));
        await component.searchZelfName({ preventDefault() {} });
        expect(component.searchFailed).toBeTrue();
        expect(component.loading).toBeFalse();
        expect(router.navigate).not.toHaveBeenCalled();
    });
});
