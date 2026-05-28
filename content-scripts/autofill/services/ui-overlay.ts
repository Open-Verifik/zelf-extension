import { PasswordEntry } from "@shared/types/autofill.types";
import { FormField, ZelfKeyIcon, DecryptedPasswordData } from "@shared/types/autofill.types";
import { Logger } from "@extension-scripts/logger/logger.class";
import { PasswordManager } from "./password-manager";

export class UIOverlay {
    private clickOutsideHandler: ((event: MouseEvent) => void) | null = null;
    private resizeHandler: (() => void) | null = null;

    private currentField: FormField | null = null;
    private currentFieldType: "username" | "email" | "password" | null = null;
    private currentMenu: HTMLElement | null = null;
    private icons: Map<HTMLInputElement, ZelfKeyIcon> = new Map();
    private isFetchingPasswords: boolean = false;
    private passwordManager: PasswordManager;
    private resizeTimeout: number | null = null;

    constructor() {
        this.passwordManager = new PasswordManager();
        this.setupStyles();

        // Listen for decryption results from popout
        this._setupDecryptionResultListener();

        // Setup resize listener
        this._setupResizeListener();
    }

    private setupStyles(): void {
        const style = document.createElement("style");

        style.textContent = this.generateStyles();

        document.head.appendChild(style);
    }

    private generateStyles(): string {
        return `
            ${this.getIconStyles()}
            ${this.getMenuStyles()}
            ${this.getMenuItemStyles()}
            ${this.getSpinnerStyles()}
        `;
    }

    private getIconStyles(): string {
        return `
            .zelfkey-icon {
                position: absolute;
                width: 25px;
                height: 25px;
                cursor: pointer;
                opacity: 0.6;
                z-index: 10000;
                pointer-events: auto;
                transition: opacity 0.2s ease-in-out;
            }
            .zelfkey-icon:hover {
                opacity: 1;
            }
        `;
    }

    private getMenuStyles(): string {
        return `
            .zelfkey-menu {
                position: absolute;
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 10001;
                min-width: 200px;
                max-width: 300px;
                max-height: 300px;
                overflow-y: auto;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
        `;
    }

    private getMenuItemStyles(): string {
        return `
            .zelfkey-menu-item {
                padding: 12px 16px;
                cursor: pointer;
                border-bottom: 1px solid #f0f0f0;
                display: flex;
                align-items: center;
                gap: 12px;
                transition: background-color 0.2s ease;
            }
            .zelfkey-menu-item:hover {
                background-color: #f8f9fa;
            }
            .zelfkey-menu-item:last-child {
                border-bottom: none;
            }
            .zelfkey-menu-item--create {
                color: #007bff;
                font-weight: 500;
            }
            .zelfkey-menu-item--create:hover {
                background-color: #e3f2fd;
            }
            .zelfkey-menu-item--loading {
                color: #666;
                font-style: italic;
            }
            .zelfkey-menu-item--no-credentials {
                color: #999;
                font-style: italic;
                text-align: center;
                padding: 16px;
            }
            .zelfkey-menu-item__icon {
                width: 20px;
                height: 20px;
                background: #171717;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: bold;
            }
            .zelfkey-menu-item__content {
                flex: 1;
                min-width: 0;
            }
            .zelfkey-menu-item__title {
                font-weight: 500;
                color: #333;
                margin-bottom: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .zelfkey-menu-item__subtitle {
                font-size: 12px;
                color: #666;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        `;
    }

    private getSpinnerStyles(): string {
        return `
            .zelfkey-menu-item--loading .loading-spinner {
                width: 16px;
                height: 16px;
                border: 2px solid #e0e0e0;
                border-top: 2px solid #007bff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 8px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
    }

    public showIconForField(field: FormField): void {
        if (this.icons.has(field.element)) {
            const icon = this.icons.get(field.element);

            if (icon) this._positionIcon(icon);

            return;
        }

        // Don't show icons on buttons or other non-input elements
        if (field.element.tagName !== "INPUT") return;

        // Don't show icons on very small inputs (likely decorative or hidden)
        const rect = field.element.getBoundingClientRect();

        if (rect.width < 30 || rect.height < 15) return;

        if (!this._isFieldVisibleAndFocusable(field.element)) return;

        const icon = this.createZelfKeyIcon(field);

        if (!icon) return;

        this.icons.set(field.element, icon);

        this._positionIcon(icon);
    }

    public hideIconForField(field: FormField): void {
        const icon = this.icons.get(field.element);

        if (icon) {
            icon.element.remove();
            this.icons.delete(field.element);
        }
    }

    public hideAllIcons(): void {
        this.icons.forEach((icon) => icon.element.remove());
        this.icons.clear();
    }

    public getIconCount(): number {
        return this.icons.size;
    }

    private _repositionTimeout: number | null = null;

    public repositionAllIcons(): void {
        // Debounce repositioning to avoid excessive calls
        if (this._repositionTimeout) {
            clearTimeout(this._repositionTimeout);
        }

        this._repositionTimeout = window.setTimeout(() => {
            this.icons.forEach((icon) => {
                this._positionIcon(icon);
            });
            this._repositionTimeout = null;
        }, 50); // 50ms debounce
    }

    public hasIconsInContainer(container: Element): boolean {
        for (const icon of this.icons.values()) {
            const iconRect = icon.element.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            // Check if icon is visible within the container
            if (
                iconRect.top >= containerRect.top &&
                iconRect.bottom <= containerRect.bottom &&
                iconRect.left >= containerRect.left &&
                iconRect.right <= containerRect.right
            ) {
                return true;
            }
        }
        return false;
    }

    public validateIcons(): void {
        const iconsToRemove: HTMLInputElement[] = [];

        this.icons.forEach((icon, fieldElement) => {
            if (!document.contains(fieldElement) || !document.contains(icon.element)) {
                iconsToRemove.push(fieldElement);
                return;
            }

            if (!this._isFieldVisibleAndFocusable(fieldElement)) {
                this.hideIconForField({ element: fieldElement, type: icon.field.type } as FormField);
                iconsToRemove.push(fieldElement);
                return;
            }

            this._positionIcon(icon);
        });

        // Remove invalid icons
        iconsToRemove.forEach((fieldElement) => {
            this.icons.delete(fieldElement);
        });
    }

    private createZelfKeyIcon(field: FormField): ZelfKeyIcon | null {
        if (!document.body || !document.contains(field.element)) {
            Logger.warn("Field element no longer in DOM or document.body not available");
            return null;
        }

        // Create isolated icon with selective CSS reset
        const iconElement = document.createElement("div");
        iconElement.style.cssText = `
            position: fixed;
            width: 25px;
            height: 25px;
            cursor: pointer;
            opacity: 0.6;
            z-index: 10000;
            pointer-events: auto;
            isolation: isolate;
            transition: opacity 0.2s ease-in-out;
            display: block;
            margin: 0;
            padding: 0;
            border: none;
            background: none;
            box-shadow: none;
            transform: none;
        `;
        iconElement.innerHTML = this.getZelfKeySVG();

        const position = this.calculateIconPosition(field.element);
        iconElement.style.top = `${position.top}px`;
        iconElement.style.left = `${position.left}px`;

        iconElement.addEventListener("click", (e) => {
            e.stopPropagation();
            this._handleIconClick(field);
        });

        // Add hover effects
        iconElement.addEventListener("mouseenter", () => {
            iconElement.style.opacity = "1";
        });

        iconElement.addEventListener("mouseleave", () => {
            if (!this.isFetchingPasswords) {
                iconElement.style.opacity = "0.6";
            }
        });

        document.body.appendChild(iconElement);

        return {
            element: iconElement,
            field,
            position,
        };
    }

    private updateIconLoadingState(icon: ZelfKeyIcon, isLoading: boolean): void {
        if (isLoading) {
            icon.element.style.opacity = "0.5";
            icon.element.style.cursor = "not-allowed";
            icon.element.title = "Loading passwords...";
            // Keep the same SVG, just disable interaction
        } else {
            icon.element.style.opacity = "0.6";
            icon.element.style.cursor = "pointer";
            icon.element.title = "ZelfKey Autofill";
        }
    }

    private updateAllIconsLoadingState(isLoading: boolean): void {
        this.icons.forEach((icon) => {
            this.updateIconLoadingState(icon, isLoading);
        });
    }

    private getZelfKeySVG(): string {
        return `
            <svg width="25" height="25" viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; width: 25px; height: 25px;">
                <rect width="40" height="39" rx="4" fill="#171717"/>
                <path d="M20.022 5.97266C21.4836 8.01557 23.3686 10.3437 25.7409 12.7465H15.0908C17.3993 10.2408 18.9747 7.83793 20.0265 5.97266H20.022Z" fill="white"/>
                <path d="M7.00455 19.3558C8.88049 18.4255 11.3438 16.9529 13.8117 14.7136C14.0302 14.5173 14.2442 14.3163 14.4491 14.1152H23.97C23.97 14.1152 17.0718 24.1241 13.2972 24.1522C10.1827 24.1802 8.88049 20.5432 7 19.3511L7.00455 19.3558Z" fill="white"/>
                <path d="M20.6291 32.6794C19.4817 31.0759 18.0019 29.248 16.126 27.3594H24.8819C23.0287 29.2807 21.6445 31.132 20.6291 32.6794Z" fill="white"/>
                <path d="M26.269 25.7042C26.1688 25.7977 26.0641 25.8912 25.9639 25.9847H15.7373C15.7373 25.9847 22.7493 15.8449 26.5741 15.8262C29.7659 15.8122 31.0863 19.5287 33.0078 20.7488C31.0545 21.8755 28.6777 23.479 26.2644 25.7042H26.269Z" fill="white"/>
            </svg>
        `;
    }

    private _positionIcon(icon: ZelfKeyIcon): void {
        const position = this.calculateIconPosition(icon.field.element);

        // Check if position actually changed to avoid unnecessary updates
        if (icon.position && Math.abs(icon.position.top - position.top) < 1 && Math.abs(icon.position.left - position.left) < 1) {
            return; // Position hasn't changed significantly
        }

        icon.element.style.top = `${position.top}px`;
        icon.element.style.left = `${position.left}px`;
        icon.position = position;

        Logger.log("Icon positioning:", icon.field.element, position);

        this._testAndAdjustPosition(icon, icon.field.element);
    }

    private async _handleIconClick(field: FormField): Promise<void> {
        if (this.isFetchingPasswords) return;

        if (!this._isFieldVisibleAndFocusable(field.element)) {
            Logger.warn("Field is no longer visible or focusable, aborting menu open");

            return;
        }

        const icon = this.icons.get(field.element);

        if (icon) this._positionIcon(icon);

        if (!this._isFieldVisibleAndFocusable(field.element)) {
            Logger.warn("Field became invalid after repositioning, aborting menu open");

            return;
        }

        this.currentField = field;
        this.currentFieldType = field.type;

        this._hideMenu();

        this.updateAllIconsLoadingState(true);

        const website = this._extractHostname(window.location.href);

        this.showMenuWithLoading(field);

        this.isFetchingPasswords = true;

        try {
            this.passwordManager.clearCacheForWebsite(website);

            const passwords = await this._fetchPasswordsWithTimeout(website);

            this.updateMenuWithPasswords(passwords);
        } catch (error) {
            Logger.error("Password fetching:", error);

            this.updateMenuWithPasswords([]);
        } finally {
            this.isFetchingPasswords = false;

            this.updateAllIconsLoadingState(false);
        }
    }

    private showMenuWithLoading(field: FormField): void {
        this._hideMenu();

        // Final validation before positioning menu - field may have changed
        if (!this._isFieldVisibleAndFocusable(field.element)) {
            Logger.warn("Field is no longer valid when positioning menu, aborting");
            return;
        }

        const menu = document.createElement("div");
        menu.className = "zelfkey-menu";

        // Add loading indicator
        const loadingItem = this.createLoadingMenuItem();
        menu.appendChild(loadingItem);

        // Add create new password option (always available)
        const createItem = this.createCreateMenuItem();
        createItem.addEventListener("click", () => this._handleCreatePassword());
        menu.appendChild(createItem);

        // Position the menu - get fresh bounding rect to ensure accurate positioning
        const rect = field.element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        menu.style.top = `${rect.bottom + scrollTop + 5}px`;
        menu.style.left = `${rect.left + scrollLeft}px`;
        menu.style.zIndex = "10001";

        document.body.appendChild(menu);
        this.currentMenu = menu;

        // Add click outside handler
        this.clickOutsideHandler = this._handleClickOutside.bind(this);
        setTimeout(() => {
            document.addEventListener("click", this.clickOutsideHandler!, true);
        }, 0);
    }

    private updateMenuWithPasswords(passwords: PasswordEntry[]): void {
        if (!this.currentMenu) return;

        // Clear existing content
        this.currentMenu.innerHTML = "";

        // Add existing passwords or "no credentials" message
        if (passwords.length > 0) {
            passwords.forEach((password) => {
                const item = this.createMenuItem(password);

                item.addEventListener("click", () => this._handlePasswordSelect(password));

                this.currentMenu!.appendChild(item);
            });
        } else {
            // Add "no credentials found" message
            const noCredentialsItem = this.createNoCredentialsMenuItem();

            this.currentMenu!.appendChild(noCredentialsItem);
        }

        // Add create new password option
        const createItem = this.createCreateMenuItem();

        createItem.addEventListener("click", () => this._handleCreatePassword());

        this.currentMenu!.appendChild(createItem);
    }

    private createMenuItem(password: PasswordEntry): HTMLElement {
        const item = document.createElement("div");

        item.className = "zelfkey-menu-item";

        const hostName = this.extractHostName(password);
        const hostInitial = hostName.charAt(0).toUpperCase();

        const icon = document.createElement("div");

        icon.className = "zelfkey-menu-item__icon";
        icon.textContent = hostInitial;

        const content = document.createElement("div");

        content.className = "zelfkey-menu-item__content";

        const title = document.createElement("div");

        title.className = "zelfkey-menu-item__title";
        title.textContent = hostName;

        const subtitle = document.createElement("div");

        subtitle.className = "zelfkey-menu-item__subtitle";
        subtitle.textContent = this.extractUsername(password);

        content.appendChild(title);
        content.appendChild(subtitle);
        item.appendChild(icon);
        item.appendChild(content);

        return item;
    }

    private extractHostName(password: PasswordEntry): string {
        // Check if this is the new format with publicData
        if ((password as any).publicData?.website) {
            try {
                const url = new URL((password as any).publicData.website);
                return url.hostname;
            } catch {
                return (password as any).publicData.website;
            }
        }

        // Fallback to original format
        const source = password.website || password.publicData.website || password.url;

        if (!source) return "Unknown";

        try {
            // If it's a full URL, extract the hostname
            if (source.includes("://")) {
                const url = new URL(source);

                return url.hostname;
            }

            // If it already looks like a hostname (contains dots but no protocol)
            if (source.includes(".") && !source.includes(" ")) return source;

            // Otherwise, use the source as fallback
            return source;
        } catch {
            // If URL parsing fails, use the source as is
            return source;
        }
    }

    private extractUsername(password: PasswordEntry): string {
        // Check if this is the new format with publicData
        if ((password as any).publicData?.username) return (password as any).publicData.username;

        // Fallback to original format
        return password.publicData.username || "No username";
    }

    private createLoadingMenuItem(): HTMLElement {
        const item = document.createElement("div");

        item.className = "zelfkey-menu-item zelfkey-menu-item--loading";

        const spinner = document.createElement("div");

        spinner.className = "loading-spinner";

        const content = document.createElement("div");

        content.className = "zelfkey-menu-item__content";

        const title = document.createElement("div");

        title.className = "zelfkey-menu-item__title";
        title.textContent = "Loading passwords...";

        content.appendChild(title);
        item.appendChild(spinner);
        item.appendChild(content);

        return item;
    }

    private createNoCredentialsMenuItem(): HTMLElement {
        const item = document.createElement("div");

        item.className = "zelfkey-menu-item zelfkey-menu-item--no-credentials";

        const content = document.createElement("div");

        content.className = "zelfkey-menu-item__content";

        const title = document.createElement("div");

        title.className = "zelfkey-menu-item__title";
        title.textContent = "No credentials found";

        content.appendChild(title);
        item.appendChild(content);

        return item;
    }

    private createCreateMenuItem(): HTMLElement {
        const item = document.createElement("div");

        item.className = "zelfkey-menu-item zelfkey-menu-item--create";

        const icon = document.createElement("div");

        icon.className = "zelfkey-menu-item__icon";
        icon.textContent = "+";

        const content = document.createElement("div");

        content.className = "zelfkey-menu-item__content";

        const title = document.createElement("div");

        title.className = "zelfkey-menu-item__title";
        title.textContent = "Create new password";

        content.appendChild(title);
        item.appendChild(icon);
        item.appendChild(content);

        return item;
    }

    private async _handlePasswordSelect(password: PasswordEntry): Promise<void> {
        this._hideMenu();

        if (!this.currentField) return;

        // Always open biometrics popout for password decryption
        // The JWT session is just for the API, but we still need biometric verification
        await this._openBiometricsPopout(password);
    }

    private async _handleCreatePassword(): Promise<void> {
        this._hideMenu();

        const urlInfo = {
            hash: window.location.hash,
            hostname: window.location.hostname,
            href: window.location.href,
            origin: window.location.origin,
            pathname: window.location.pathname,
            port: window.location.port,
            protocol: window.location.protocol,
            search: window.location.search,
            title: document.title,
        };

        await this.passwordManager.createNewPassword(urlInfo);
    }

    private async _openBiometricsPopout(password: PasswordEntry): Promise<void> {
        try {
            if (typeof chrome !== "undefined" && chrome.runtime) {
                const response = await chrome.runtime.sendMessage({
                    type: "OPEN_PASSWORD_DECRYPTOR",
                    payload: {
                        fieldId: this.currentField?.element.id,
                        fieldType: this.currentFieldType,
                        requestId: password.id,
                        type: "password",
                        zelfProof: password.zelfProof || "",
                        publicData: {
                            title: password.website || password.publicData.website,
                            website: password.publicData.website,
                        },
                    },
                });

                if (response?.success) {
                    await this._waitForPopoutAndSendData(password);
                } else {
                    Logger.warn("Failed to open popup:", response);
                }
            } else {
                Logger.warn("Chrome runtime not available");
            }
        } catch (error) {
            Logger.error("Password decryption data storage:", error);
        }
    }

    private async _waitForPopoutAndSendData(password: PasswordEntry): Promise<void> {
        try {
            // Wait for popout to be ready (with timeout)
            const maxRetries = 20; // 10 seconds total

            let retries = 0;

            while (retries < maxRetries) {
                try {
                    // Try to send data to the popout
                    const response = await chrome.runtime.sendMessage({
                        type: "SEND_DECRYPTION_DATA_TO_POPOUT",
                        payload: {
                            requestId: password.id,
                            type: "password",
                            zelfProof: password.zelfProof || "",
                            publicData: {
                                title: password.website || password.publicData.website,
                                website: password.publicData.website,
                            },
                            fieldId: this.currentField?.element.id,
                            fieldType: this.currentFieldType,
                        },
                    });

                    if (response?.success) return;
                } catch (error) {
                    // Popout not ready yet, continue waiting
                }

                // Wait 500ms before retrying
                await new Promise((resolve) => setTimeout(resolve, 500));

                retries++;
            }

            Logger.warn("Timeout waiting for popout to be ready");
        } catch (error) {
            Logger.error("Popout communication:", error);
        }
    }

    private _setupDecryptionResultListener(): void {
        // Listen for messages from background script about decryption results
        if (typeof chrome !== "undefined" && chrome.runtime) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                if (message.type === "DECRYPTION_RESULT") {
                    this._handleDecryptionResult(message.payload);
                    sendResponse({ success: true });
                }
                return true; // Keep message channel open
            });
        }
    }

    private _setupResizeListener(): void {
        this.resizeHandler = () => {
            // Debounce resize events to avoid excessive calls
            if (this.resizeTimeout) clearTimeout(this.resizeTimeout);

            this.resizeTimeout = window.setTimeout(() => {
                // If menu is open, try to reposition it or close it if field is no longer valid
                if (this.currentMenu && this.currentField) {
                    if (this._isFieldVisibleAndFocusable(this.currentField.element)) {
                        this._repositionMenu();
                    } else {
                        // Field is no longer visible/valid, close the menu
                        this._hideMenu();
                    }
                }

                // Validate icons (removes invalid ones and repositions valid ones)
                this.validateIcons();

                // Also reposition all remaining icons to ensure they're in the correct position
                this.repositionAllIcons();

                this.resizeTimeout = null;
            }, 150); // 150ms debounce
        };

        window.addEventListener("resize", this.resizeHandler);
    }

    public destroy(): void {
        // Clean up resize listener
        if (this.resizeHandler) {
            window.removeEventListener("resize", this.resizeHandler);
            this.resizeHandler = null;
        }

        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = null;
        }

        // Clean up reposition timeout
        if (this._repositionTimeout) {
            clearTimeout(this._repositionTimeout);
            this._repositionTimeout = null;
        }

        // Remove all icons
        this.hideAllIcons();

        // Hide menu if open (this will also clean up click handler)
        this._hideMenu();
    }

    private _handleDecryptionResult(result: any): void {
        if (result.success && result.data && this.currentField) {
            // Fill the field with the decrypted data
            this._fillField(this.currentField, result.data);
        } else if (!result.success) {
            Logger.error("Password decryption:", result.error);
            // Could show an error message to the user
        } else {
            Logger.debug("Missing required data for form filling:", {
                success: result.success,
                hasData: !!result.data,
                hasField: !!this.currentField,
            });
        }
    }

    private _fillField(field: FormField, data: DecryptedPasswordData): void {
        // Fill the specific field that was clicked based on its type (if visible)
        if (this._isFieldVisibleAndFocusable(field.element)) {
            if (field.type === "username" || field.type === "email") {
                if (data.username) {
                    this._setFieldValue(field.element, data.username);
                }
            } else if (field.type === "password") {
                if (data.password) {
                    this._setFieldValue(field.element, data.password);
                }
            }
        }

        // Also try to fill other fields in the same form if they exist and are visible
        const form = field.element.closest("form");

        if (!form) return;

        // Find and fill username field if current field is password
        if (field.type === "password" && data.username) {
            const usernameField = this._findUsernameFieldInForm(form);

            if (usernameField && usernameField !== field.element && this._isFieldVisibleAndFocusable(usernameField)) {
                this._setFieldValue(usernameField, data.username);
            }
        }

        // Find and fill password field if current field is username/email
        else if ((field.type === "username" || field.type === "email") && data.password) {
            const passwordField = form.querySelector('input[type="password"]') as HTMLInputElement;

            if (passwordField && passwordField !== field.element && this._isFieldVisibleAndFocusable(passwordField)) {
                this._setFieldValue(passwordField, data.password);
            }
        }
    }

    private _isFieldVisibleAndFocusable(element: HTMLInputElement): boolean {
        // Check if element exists
        if (!element) return false;

        // Check if element is in the DOM
        if (!document.contains(element)) return false;

        // Check if element is visible (not hidden by CSS)
        const style = window.getComputedStyle(element);

        if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
            return false;
        }

        // Check if element is not disabled
        if (element.disabled) return false;

        // Check if element has positive dimensions (not collapsed)
        const rect = element.getBoundingClientRect();

        if (rect.width === 0 || rect.height === 0) return false;

        // Check if element is not off-screen
        if (rect.top < -1000 || rect.left < -1000) return false;

        return true;
    }

    private _findUsernameFieldInForm(form: HTMLFormElement): HTMLInputElement | null {
        const selectors = [
            'input[type="email"]',
            'input[type="text"]',
            'input[name*="username" i]',
            'input[name*="email" i]',
            'input[id*="username" i]',
            'input[id*="email" i]',
        ];

        for (const selector of selectors) {
            const field = form.querySelector(selector) as HTMLInputElement;

            if (field && field.type !== "password") return field;
        }

        return null;
    }

    private _setFieldValue(field: HTMLInputElement, value: string): void {
        // Create and dispatch input events to ensure proper form handling
        field.focus();
        field.value = value;

        // Dispatch events
        field.dispatchEvent(new Event("input", { bubbles: true }));
        field.dispatchEvent(new Event("change", { bubbles: true }));
        field.dispatchEvent(new Event("blur", { bubbles: true }));
    }

    private _handleClickOutside(event: MouseEvent): void {
        if (!this.currentMenu) return;

        const target = event.target as Node;

        if (this.currentMenu.contains(target)) return;

        let clickedOnIcon = false;

        for (const icon of this.icons.values()) {
            if (!icon.element.contains(target)) continue;

            clickedOnIcon = true;

            break;
        }

        if (!clickedOnIcon) this._hideMenu();
    }

    private _repositionMenu(): void {
        if (!this.currentMenu || !this.currentField) return;

        const rect = this.currentField.element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        // Check if menu would be off-screen and adjust if needed
        const menuRect = this.currentMenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top = rect.bottom + scrollTop + 5;
        let left = rect.left + scrollLeft;

        // Adjust horizontal position if menu would overflow right edge
        if (left + menuRect.width > viewportWidth + scrollLeft) {
            left = viewportWidth + scrollLeft - menuRect.width - 10;
        }

        // Adjust horizontal position if menu would overflow left edge
        if (left < scrollLeft) {
            left = scrollLeft + 10;
        }

        // Adjust vertical position if menu would overflow bottom edge
        if (top + menuRect.height > viewportHeight + scrollTop) {
            // Try positioning above the field instead
            top = rect.top + scrollTop - menuRect.height - 5;

            // If still off-screen at top, position at bottom of viewport
            if (top < scrollTop) {
                top = viewportHeight + scrollTop - menuRect.height - 10;
            }
        }

        this.currentMenu.style.top = `${top}px`;
        this.currentMenu.style.left = `${left}px`;
    }

    private _hideMenu(): void {
        if (this.currentMenu) {
            this.currentMenu.remove();
            this.currentMenu = null;
        }

        if (!this.clickOutsideHandler) return;

        document.removeEventListener("click", this.clickOutsideHandler, true);

        this.clickOutsideHandler = null;
    }

    public updateIconPositions(): void {
        this.icons.forEach((icon) => {
            this._positionIcon(icon);
        });
    }

    private _extractHostname(url: string): string {
        try {
            const urlObj = new URL(url);

            let hostname = urlObj.hostname;

            if (hostname.startsWith("www.")) hostname = hostname.substring(4);

            return hostname;
        } catch (error) {
            Logger.warn("Could not parse URL:", url, error);

            return "localhost";
        }
    }

    private async _fetchPasswordsWithTimeout(website: string): Promise<PasswordEntry[]> {
        return Promise.race([
            this.passwordManager.getPasswordsForWebsite(website),

            new Promise<PasswordEntry[]>((resolve) => {
                setTimeout(() => {
                    resolve([]);
                }, 3000);
            }),
        ]);
    }

    private calculateIconPosition(element: HTMLInputElement): { top: number; left: number } {
        const rect = element.getBoundingClientRect();

        // Icon size is now 25px (25% larger than 20px)
        const iconSize = 25;
        const padding = 6; // Small padding from the input edge

        // Get computed styles to understand the actual rendered input
        const computedStyle = window.getComputedStyle(element);

        // Calculate the actual content area (excluding borders but including padding)
        const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0;
        const borderRight = parseFloat(computedStyle.borderRightWidth) || 0;

        const paddingRight = parseFloat(computedStyle.paddingRight) || 0;

        // Calculate the actual content area dimensions
        const contentWidth = rect.width - borderLeft - borderRight;

        // For position: fixed, we use viewport coordinates (no scroll offset needed)
        const top = rect.top + (rect.height - iconSize) / 2;

        // Position icon inside the content area on the right side
        // Account for right padding to avoid overlapping with text
        const minContentWidth = iconSize + padding * 2;

        let left;

        if (contentWidth >= minContentWidth) {
            // Content area is wide enough - position inside, accounting for right padding
            const rightPadding = Math.max(padding, paddingRight);

            // Position from the right edge of the input, accounting for right padding
            left = rect.right - iconSize - rightPadding;

            // Safety check: ensure icon is within the input bounds
            const iconRightEdge = left + iconSize;

            if (left < rect.left) left = rect.left + 2; // Small margin from left edge

            if (iconRightEdge > rect.right) left = rect.right - iconSize - 2; // Small margin from right edge
        } else {
            // Content area is too narrow - position just outside the input
            left = rect.right - iconSize - 2;
        }

        return { top, left };
    }

    private _testAndAdjustPosition(icon: ZelfKeyIcon, element: HTMLInputElement): void {
        setTimeout(() => {
            const iconRect = icon.element.getBoundingClientRect();
            const inputRect = element.getBoundingClientRect();

            const verticalDistance = Math.abs(iconRect.top - inputRect.top);
            const horizontalDistance = Math.abs(iconRect.left - inputRect.right);

            const verticalTolerance = inputRect.height * 0.5;
            const horizontalTolerance = 30;

            if (verticalDistance > verticalTolerance || horizontalDistance > horizontalTolerance) {
                this._positionIcon(icon);
            }
        }, 100);
    }
}
