import { FormField, DetectedForm } from "@shared/types/autofill.types";
import { Logger } from "@extension-scripts/logger/logger.class";

type IdentityFieldType = "username" | "email" | "phone" | "password";

export class FormDetector {
    private observedFields: Set<HTMLInputElement> = new Set();
    private observer: MutationObserver;

    constructor() {
        this.observer = new MutationObserver(this.handleMutations.bind(this));
    }

    public startDetection(): void {
        this.scanForForms();
        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["type", "name", "id", "placeholder", "class", "style"],
        });

        // Also monitor for any input elements being added
        this.observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["type", "name", "id", "placeholder", "class", "style"],
        });
    }

    public stopDetection(): void {
        this.observer.disconnect();
        this.observedFields.clear();
    }

    private handleMutations(mutations: MutationRecord[]): void {
        let shouldRescan = false;

        mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;
                        if (
                            element.tagName === "INPUT" ||
                            element.querySelector("input") ||
                            element.tagName === "FORM" ||
                            element.querySelector("form")
                        ) {
                            shouldRescan = true;
                        }
                    }
                });
            } else if (mutation.type === "attributes") {
                const target = mutation.target as HTMLInputElement;
                if (target.tagName === "INPUT" && ["type", "name", "id", "placeholder", "class", "style"].includes(mutation.attributeName || "")) {
                    shouldRescan = true;
                }
            }
        });

        if (shouldRescan) {
            setTimeout(() => this.scanForForms(), 50); // Faster response
        }
    }

    public scanForForms(): void {
        const detectedForms = this.getCurrentForms();

        const fieldCount = detectedForms.reduce((sum, form) => sum + form.fields.length, 0);

        Logger.log(`Form detection: Found ${detectedForms.length} forms with ${fieldCount} total fields`);

        this.emitFormsDetected(detectedForms);
    }

    private findPasswordFields(trackObserved = true): FormField[] {
        const selectors = ['input[type="password"]', 'input[name*="password" i]', 'input[id*="password" i]', 'input[placeholder*="password" i]'];

        return this.findFieldsBySelectors(selectors, "password", trackObserved);
    }

    private findUsernameFields(trackObserved = true): FormField[] {
        const selectors = [
            'input[name*="username" i]',
            'input[id*="username" i]',
            'input[placeholder*="username" i]',
            'input[name*="user" i]',
            'input[id*="user" i]',
            'input[name*="login" i]',
            'input[id*="login" i]',
            'input[name*="account" i]',
            'input[id*="account" i]',
            'input[autocomplete="username"]',
        ];

        return this.findFieldsBySelectors(selectors, "username", trackObserved);
    }

    private findEmailFields(trackObserved = true): FormField[] {
        const selectors = [
            'input[type="email"]',
            'input[name*="email" i]',
            'input[id*="email" i]',
            'input[placeholder*="email" i]',
            'input[name*="mail" i]',
            'input[id*="mail" i]',
            'input[autocomplete="email"]',
        ];

        return this.findFieldsBySelectors(selectors, "email", trackObserved);
    }

    private findPhoneFields(trackObserved = true): FormField[] {
        const selectors = [
            'input[type="tel"]',
            'input[name*="phone" i]',
            'input[id*="phone" i]',
            'input[placeholder*="phone" i]',
            'input[name*="mobile" i]',
            'input[id*="mobile" i]',
            'input[placeholder*="mobile" i]',
            'input[name*="tel" i]',
            'input[id*="tel" i]',
            'input[placeholder*="tel" i]',
            'input[autocomplete="tel"]',
            'input[autocomplete="tel-national"]',
        ];

        return this.findFieldsBySelectors(selectors, "phone", trackObserved);
    }

    private findFieldsBySelectors(selectors: string[], type: IdentityFieldType, trackObserved = true): FormField[] {
        const fields: FormField[] = [];
        const seen = new Set<HTMLInputElement>();

        selectors.forEach((selector) => {
            const elements = document.querySelectorAll(selector) as NodeListOf<HTMLInputElement>;
            elements.forEach((element) => {
                if (seen.has(element)) return;
                if (!this.isElementVisibleAndFocusable(element)) return;
                if (trackObserved && this.observedFields.has(element)) return;

                seen.add(element);
                if (trackObserved) this.observedFields.add(element);
                fields.push(this.createFormField(element, type));
            });
        });

        return fields;
    }

    private isElementVisibleAndFocusable(element: HTMLInputElement): boolean {
        if (!element || !document.contains(element) || element.disabled) {
            return false;
        }

        const style = window.getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
            return false;
        }

        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.top >= -1000 && rect.left >= -1000;
    }

    private getWebsiteFromUrl(url: string): string {
        try {
            return new URL(url).hostname;
        } catch {
            return window.location.hostname;
        }
    }

    private emitFormsDetected(forms: DetectedForm[]): void {
        const event = new CustomEvent("zelfkey:formsDetected", {
            detail: { forms },
        });
        window.dispatchEvent(event);
    }

    public getCurrentForms(): DetectedForm[] {
        // Fresh scan for fill paths; do not skip via observedFields.
        const passwordFields = this.findPasswordFields(false);
        const usernameFields = this.findUsernameFields(false);
        const emailFields = this.findEmailFields(false);
        const phoneFields = this.findPhoneFields(false);
        const allFields = [...passwordFields, ...usernameFields, ...emailFields, ...phoneFields];

        // Keep icon tracking in sync for newly seen fields.
        allFields.forEach((field) => this.observedFields.add(field.element));

        return this.groupFieldsByForm(allFields);
    }

    private createFormField(element: HTMLInputElement, type: IdentityFieldType): FormField {
        return {
            element,
            type,
            name: element.name || undefined,
            id: element.id || undefined,
            placeholder: element.placeholder || undefined,
        };
    }

    private groupFieldsByForm(fields: FormField[]): DetectedForm[] {
        const formGroups = new Map<HTMLFormElement, FormField[]>();
        const orphanFields: FormField[] = [];

        fields.forEach((field) => {
            const form = field.element.closest("form");
            if (form) {
                if (!formGroups.has(form)) {
                    formGroups.set(form, []);
                }
                formGroups.get(form)!.push(field);
            } else {
                orphanFields.push(field);
            }
        });

        const detected: DetectedForm[] = Array.from(formGroups.entries()).map(([form, formFields]) => ({
            form,
            fields: formFields,
            website: this.getWebsiteFromUrl(window.location.href),
        }));

        if (orphanFields.length > 0) {
            detected.push({
                form: null,
                fields: orphanFields,
                website: this.getWebsiteFromUrl(window.location.href),
            });
        }

        return detected;
    }
}
