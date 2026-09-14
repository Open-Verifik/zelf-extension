import { FormBuilder } from "@angular/forms";
import { WelcomeFindComponent } from "./welcome-find.component";
import { TagModel } from "app/tags.service";

describe("Zelf ID QR and address import (#522)", () => {
    let component: WelcomeFindComponent;
    let tags: any;
    let router: any;
    const preview = { preview: { publicData: { tagName: "alice.zelf", ethAddress: "0x123", hasPassword: "false" } }, tagName: "alice.zelf", domain: "zelf" };
    beforeEach(() => {
        tags = jasmine.createSpyObj("Tags", ["searchTag", "setTagNameObject", "setZelfProof", "setDomain", "setTagName", "setFlow"]);
        router = jasmine.createSpyObj("Router", ["navigate"]);
        component = new WelcomeFindComponent({} as any, new FormBuilder(), router, { translate: (key: string) => key } as any,
            { ETHRegex: /^0x/, SOLRegex: /^sol/, BTCRegex: /^btc/ } as any, tags);
        component.zelfProof = "uploaded-proof";
    });
    afterEach(() => component.ngOnDestroy());
    it("uses the key/value search contract for public addresses", async () => {
        tags.searchTag.and.resolveTo({ data: { available: true } });
        await component._queryZNS("ethAddress", "0x123", "zelf");
        expect(tags.searchTag).toHaveBeenCalledWith({ key: "ethAddress", value: "0x123", domain: "zelf", os: "DESKTOP" });
    });
    it("does not dereference a failed QR name lookup or replace its proof", async () => {
        tags.searchTag.and.resolveTo({ data: null });
        await expectAsync((component as any)._processPreviewData(preview)).toBeRejectedWithError("Tag lookup failed");
        expect(router.navigate).not.toHaveBeenCalled();
        expect(tags.setZelfProof).not.toHaveBeenCalled();
    });
    it("preserves uploaded proof and metadata when the name is available for recovery", async () => {
        tags.searchTag.and.resolveTo({ data: { available: true } });
        await (component as any)._processPreviewData(preview);
        expect(tags.setTagNameObject).toHaveBeenCalledWith(jasmine.any(TagModel));
        expect(tags.setTagNameObject.calls.mostRecent().args[0].publicData.tagName).toBe("alice.zelf");
        expect(tags.setZelfProof).toHaveBeenCalledWith("uploaded-proof");
        expect(tags.setFlow).toHaveBeenCalledWith("recover");
        expect(router.navigate).toHaveBeenCalledWith(["/welcome/recover"]);
    });
    it("recognizes the QR owner using the current TagModel address shape", async () => {
        tags.searchTag.and.resolveTo({ data: { tagObject: { zelfProof: "registered-proof", publicData: preview.preview.publicData } } });
        await (component as any)._processPreviewData(preview);
        expect(router.navigate).toHaveBeenCalledWith(["/welcome/registered"]);
        expect(tags.setZelfProof).toHaveBeenCalledOnceWith("uploaded-proof");
    });
    it("keeps the uploaded QR when the registered name now belongs to another account", async () => {
        tags.searchTag.and.resolveTo({ data: { tagObject: { zelfProof: "other-owner-proof", publicData: { ...preview.preview.publicData, ethAddress: "0x456" } } } });
        await (component as any)._processPreviewData(preview);
        expect(tags.setZelfProof.calls.allArgs().every((args: any[]) => args[0] === "uploaded-proof")).toBeTrue();
        expect(tags.setTagNameObject.calls.mostRecent().args[0].displayEthAddress).toBe("0x123");
        expect(router.navigate).toHaveBeenCalledWith(["/welcome/recover"]);
    });
    it("stores an address search result before opening the account", async () => {
        const account = new TagModel({ zelfProof: "found-proof", publicData: { tagName: "alice.zelf", domain: "zelf" } });
        await (component as any)._redirectAfterTextSearch(account);
        expect(tags.setTagNameObject).toHaveBeenCalledWith(account);
        expect(tags.setZelfProof).toHaveBeenCalledWith("found-proof");
        expect(router.navigate).toHaveBeenCalledWith(["/welcome/registered"]);
    });
});
