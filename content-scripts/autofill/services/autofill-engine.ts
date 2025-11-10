import { FormField, DetectedForm } from "@shared/types/autofill.types";

export class AutofillEngine {
    public fillForm(form: DetectedForm, username: string, password: string): void {
        const usernameField = this.findUsernameField(form.fields);
        const passwordField = this.findPasswordField(form.fields);

        if (usernameField && username) {
            this.fillField(usernameField, username);
        }

        if (passwordField && password) {
            this.fillField(passwordField, password);
        }
    }

    public fillField(field: FormField, value: string): void {
        this.setFieldValue(field.element, value);
    }

    public clearForm(form: DetectedForm): void {
        form.fields.forEach((field) => {
            this.clearField(field);
        });
    }

    public clearField(field: FormField): void {
        this.setFieldValue(field.element, "");
    }

    private setFieldValue(field: HTMLInputElement, value: string): void {
        // Store the original value for comparison
        const originalValue = field.value;

        // Focus the field first
        field.focus();

        // Set the value
        field.value = value;

        // Dispatch input events to ensure proper form handling
        // This is important for React, Vue, and other frameworks that rely on input events
        const inputEvent = new Event("input", {
            bubbles: true,
            cancelable: true,
        });

        const changeEvent = new Event("change", {
            bubbles: true,
            cancelable: true,
        });

        // Dispatch the events
        field.dispatchEvent(inputEvent);
        field.dispatchEvent(changeEvent);

        // Some frameworks might need additional events
        const keydownEvent = new KeyboardEvent("keydown", {
            bubbles: true,
            cancelable: true,
            key: "Backspace",
        });

        const keyupEvent = new KeyboardEvent("keyup", {
            bubbles: true,
            cancelable: true,
            key: "Backspace",
        });

        field.dispatchEvent(keydownEvent);
        field.dispatchEvent(keyupEvent);

        // Trigger any custom events that might be needed
        const customEvent = new CustomEvent("zelfkey:autofill", {
            detail: {
                field: field,
                value: value,
                originalValue: originalValue,
            },
            bubbles: true,
        });

        field.dispatchEvent(customEvent);

        // Blur the field to trigger any validation
        field.dispatchEvent(new Event("blur", { bubbles: true }));
    }

    private findUsernameField(fields: FormField[]): FormField | null {
        // Look for email fields first
        const emailField = fields.find((field) => field.type === "email");
        if (emailField) return emailField;

        // Then look for username fields
        const usernameField = fields.find((field) => field.type === "username");
        if (usernameField) return usernameField;

        // Fallback to any text field that's not a password
        return fields.find((field) => field.type !== "password") || null;
    }

    private findPasswordField(fields: FormField[]): FormField | null {
        return fields.find((field) => field.type === "password") || null;
    }

    public detectFormType(form: DetectedForm): "login" | "register" | "unknown" {
        const passwordFields = form.fields.filter((field) => field.type === "password");
        const usernameFields = form.fields.filter((field) => field.type === "username" || field.type === "email");

        // Check for common registration indicators
        const registrationIndicators = [
            "confirm",
            "repeat",
            "verify",
            "confirm-password",
            "confirm_password",
            "signup",
            "sign-up",
            "register",
            "registration",
        ];

        const hasRegistrationIndicator = form.fields.some(
            (field) => field.name && registrationIndicators.some((indicator) => field?.name?.toLowerCase().includes(indicator))
        );

        if (hasRegistrationIndicator || passwordFields.length > 1) {
            return "register";
        }

        if (passwordFields.length === 1 && usernameFields.length >= 1) {
            return "login";
        }

        return "unknown";
    }

    public validateForm(form: DetectedForm): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (form.fields.length === 0) {
            errors.push("No form fields detected");
            return { isValid: false, errors };
        }

        const passwordFields = form.fields.filter((field) => field.type === "password");
        const usernameFields = form.fields.filter((field) => field.type === "username" || field.type === "email");

        // For multi-step forms, allow forms with just username fields (password may appear later)
        if (usernameFields.length === 0 && passwordFields.length === 0) {
            errors.push("No username/email or password field found");
        }

        // If we have fields but no username/email, that's still valid for password-only forms
        if (usernameFields.length === 0 && passwordFields.length > 0) {
            // This is a password-only form, which is valid
        }

        // If we have username/email but no password, that's valid for multi-step forms
        if (usernameFields.length > 0 && passwordFields.length === 0) {
            // This is a username-only form (like QNAP step 1), which is valid
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    public getFormData(form: DetectedForm): Record<string, string> {
        const data: Record<string, string> = {};

        form.fields.forEach((field) => {
            const value = field.element.value;
            if (value) {
                const key = field.name || field.id || field.type;
                if (key) {
                    data[key] = value;
                }
            }
        });

        return data;
    }

    public isFormFilled(form: DetectedForm): boolean {
        return form.fields.every((field) => field.element.value.trim() !== "");
    }

    public getEmptyFields(form: DetectedForm): FormField[] {
        return form.fields.filter((field) => field.element.value.trim() === "");
    }
}
