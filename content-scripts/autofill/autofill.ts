import "webextension-polyfill";

import { Logger } from "@extension-scripts/logger/logger.class";
import { DetectedForm, FormField } from "@shared/types/autofill.types";
import { AutofillEngine } from "./services/autofill-engine";
import { CommunicationService } from "./services/communication";
import { FormDetector } from "./services/form-detector";
import { PasswordManager } from "./services/password-manager";
import { UIOverlay } from "./services/ui-overlay";

class AutofillContentScript {
    private autofillEngine: AutofillEngine;
    private communicationService: CommunicationService;
    private formDetector: FormDetector;
    private isInitialized: boolean = false;
    private lastFormCount: number = 0;
    private lastUrl: string = window.location.href;
    private networkIdleDelay: number = 500; // ms to wait after last network activity
    private networkIdleTimeout: ReturnType<typeof setTimeout> | null = null;
    private passwordManager: PasswordManager;
    private pendingRequests: Set<string> = new Set();
    private rescanInterval: ReturnType<typeof setInterval> | null = null;
    private serviceWorkerCheckInterval: ReturnType<typeof setInterval> | null = null;
    private serviceWorkerReady: boolean = false;
    private uiOverlay: UIOverlay;
    private urlCheckInterval: ReturnType<typeof setInterval> | null = null;

    constructor() {
        this.autofillEngine = new AutofillEngine();
        this.communicationService = CommunicationService.getInstance();
        this.formDetector = new FormDetector();
        this.passwordManager = new PasswordManager();
        this.uiOverlay = new UIOverlay();
    }

    public async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            this.setupEventListeners();
            this.setupCommunication();
            this.setupMonitoring();
            this.setupNetworkIdleDetection();

            this.isInitialized = true;

            this.performImmediateFormDetection();

            // Also perform a quick rescan after a short delay to catch any missed forms
            setTimeout(() => {
                this.performQuickRescan();
            }, 50);
        } catch (error) {
            Logger.error("Autofill initialization", error);
        }
    }

    private performImmediateFormDetection(): void {
        this.formDetector.startDetection();

        const currentForms = this.formDetector.getCurrentForms();

        if (currentForms.length > 0) {
            currentForms.forEach((form) => {
                this.processForm(form);
            });
        }

        this.setupDOMLoadListeners();
        this.startPeriodicRescan();

        // Additional delayed scans for dynamic content
        this.scheduleDelayedScans();
    }

    private setupDOMLoadListeners(): void {
        window.addEventListener("load", () => {
            this.performQuickRescan();
            setTimeout(() => {
                this.performQuickRescan();
            }, 100);
        });

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => {
                this.performQuickRescan();
            });
        }

        document.addEventListener("readystatechange", () => {
            if (document.readyState === "complete") {
                this.performQuickRescan();
            }
        });

        document.addEventListener(
            "load",
            (event) => {
                if (event.target instanceof HTMLImageElement) {
                    this.performQuickRescan();
                }
            },
            true
        );

        document.addEventListener(
            "load",
            (event) => {
                if (event.target instanceof HTMLScriptElement) {
                    this.performQuickRescan();
                }
            },
            true
        );
    }

    public performQuickRescan(): void {
        try {
            const currentForms = this.formDetector.getCurrentForms();

            currentForms.forEach((form) => {
                this.processForm(form);
            });
        } catch (error) {
            Logger.error("Quick rescan", error);
        }
    }

    private startFormDetection(): void {
        if (this.serviceWorkerReady) {
            // Start form detection when service worker is ready
            this.formDetector.startDetection();
            this.startPeriodicRescan();
        }
    }

    private startPeriodicRescan(): void {
        // Clear any existing interval
        if (this.rescanInterval) clearInterval(this.rescanInterval);

        // Rescan every 5 seconds to catch dynamically added forms (reduced frequency)
        this.rescanInterval = setInterval(() => {
            this.performRescan();
        }, 5000);

        // Reposition icons every 10 seconds to handle layout changes (reduced frequency)
        setInterval(() => {
            this.uiOverlay.repositionAllIcons();
        }, 10000);
    }

    private performRescan(): void {
        try {
            const currentForms = this.formDetector.getCurrentForms();
            const currentFormCount = currentForms.length;
            const currentIconCount = this.uiOverlay.getIconCount();

            if (currentFormCount !== this.lastFormCount) {
                this.lastFormCount = currentFormCount;

                currentForms.forEach((form) => {
                    this.processForm(form);
                });
            }

            this.validateExistingIcons();
            this.handleIconRecovery(currentForms, currentFormCount, currentIconCount);
        } catch (error) {
            Logger.error("Periodic rescan", error);
        }
    }

    private validateExistingIcons(): void {
        this.uiOverlay.validateIcons();
    }

    private handleFormsDetected(event: CustomEvent): void {
        const forms: DetectedForm[] = event.detail.forms;

        forms.forEach((form) => {
            this.processForm(form);
        });
    }

    private processForm(form: DetectedForm): void {
        try {
            const validation = this.autofillEngine.validateForm(form);

            if (!validation.isValid) {
                return;
            }

            form.fields.forEach((field) => {
                if (this.shouldShowIconForField(field)) {
                    try {
                        this.uiOverlay.showIconForField(field);
                    } catch (error) {
                        Logger.error(`Icon display for ${field.type} field`, error);
                    }
                }
            });

            // Reposition all icons after processing to handle layout changes
            setTimeout(() => {
                this.uiOverlay.repositionAllIcons();
            }, 100);
        } catch (error) {
            Logger.error(`Form processing for ${form.fields.length} fields`, error);
        }
    }

    private shouldShowIconForField(field: FormField): boolean {
        return ["password", "username", "email"].includes(field.type);
    }

    private handleIconRecovery(currentForms: DetectedForm[], currentFormCount: number, currentIconCount: number): void {
        if (currentFormCount > 0 && currentIconCount === 0) {
            currentForms.forEach((form) => {
                this.processForm(form);
            });
            return;
        }

        const expectedIcons = currentForms.reduce((count, form) => {
            return count + form.fields.filter((field) => this.shouldShowIconForField(field)).length;
        }, 0);

        if (expectedIcons > currentIconCount && currentFormCount > 0) {
            currentForms.forEach((form) => {
                this.processForm(form);
            });
        }
    }

    private handleWindowResize(): void {
        // Debounce the resize handler
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.uiOverlay.updateIconPositions();
        }, 100);
    }

    private handleWindowScroll(): void {
        // Debounce the scroll handler
        if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
            this.uiOverlay.updateIconPositions();
        }, 50);
    }

    private handleVisibilityChange(): void {
        if (document.hidden) {
            // Page is hidden, hide all icons
            this.uiOverlay.hideAllIcons();
            // Stop form detection
            this.formDetector.stopDetection();
        } else {
            // Page is visible again
            // Reset form count to force reprocessing
            this.lastFormCount = 0;
            // Start form detection again
            this.formDetector.startDetection();
            // Force a fresh form detection immediately
            this.formDetector.scanForForms();
            // Process any newly detected forms immediately
            setTimeout(() => {
                this.performQuickRescan();
                this.uiOverlay.repositionAllIcons();
            }, 10); // Very short delay to ensure forms are processed
            // Schedule additional scans to catch any dynamic content
            this.scheduleDelayedScans();
        }
    }

    private handlePageShow(): void {
        // Reset form count to force reprocessing
        this.lastFormCount = 0;
        // Start form detection again
        this.formDetector.startDetection();
        // Force a fresh form detection immediately
        this.formDetector.scanForForms();
        // Process any newly detected forms immediately
        setTimeout(() => {
            this.performQuickRescan();
            this.uiOverlay.repositionAllIcons();
        }, 10); // Very short delay to ensure forms are processed
        // Schedule additional scans to catch any dynamic content
        this.scheduleDelayedScans();
    }

    private setupScrollThrottling(): void {
        let scrollTimeout: number | null = null;

        // Listen to scroll on window (for body scroll)
        window.addEventListener(
            "scroll",
            () => {
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }

                // Throttle scroll events to update icon positions every 200ms
                scrollTimeout = window.setTimeout(() => {
                    this.uiOverlay.repositionAllIcons();
                }, 200);
            },
            { passive: true }
        );

        // Also listen to scroll on document for better coverage
        document.addEventListener(
            "scroll",
            () => {
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }

                scrollTimeout = window.setTimeout(() => {
                    this.uiOverlay.repositionAllIcons();
                }, 200);
            },
            { passive: true }
        );

        // Listen for scroll on any scrollable container
        this.setupContainerScrollListeners();
    }

    private setupContainerScrollListeners(): void {
        // Find all scrollable containers and add scroll listeners
        const scrollableSelectors = [
            '[style*="overflow"]',
            '[style*="overflow-y"]',
            '[style*="overflow-x"]',
            ".scrollable",
            ".scroll-container",
            "[data-scroll]",
        ];

        const addScrollListener = (element: Element) => {
            element.addEventListener(
                "scroll",
                () => {
                    // Only reposition if icons are visible in this container
                    if (this.uiOverlay.hasIconsInContainer(element)) {
                        this.uiOverlay.repositionAllIcons();
                    }
                },
                { passive: true }
            );
        };

        // Add listeners to existing scrollable elements
        scrollableSelectors.forEach((selector) => {
            document.querySelectorAll(selector).forEach(addScrollListener);
        });

        // Watch for new scrollable elements
        this.containerScrollObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType !== Node.ELEMENT_NODE) return;

                    const element = node as Element;

                    scrollableSelectors.forEach((selector) => {
                        if (!element.matches(selector)) return;

                        addScrollListener(element);
                        this.scrollableElements.add(element);
                    });

                    scrollableSelectors.forEach((selector) => {
                        element.querySelectorAll(selector).forEach((child) => {
                            addScrollListener(child);
                            this.scrollableElements.add(child);
                        });
                    });
                });
            });
        });

        this.containerScrollObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    private interceptHistoryAPI(): void {
        // Intercept pushState and replaceState methods
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = (...args) => {
            originalPushState.apply(history, args);
            this.handleLocationChange();
        };

        history.replaceState = (...args) => {
            originalReplaceState.apply(history, args);
            this.handleLocationChange();
        };
    }

    private startUrlMonitoring(): void {
        this.urlCheckInterval = setInterval(() => {
            const currentUrl = window.location.href;
            if (currentUrl !== this.lastUrl) {
                this.lastUrl = currentUrl;
                this.handleLocationChange();
            }
        }, 1000);
    }

    private startServiceWorkerMonitoring(): void {
        this.serviceWorkerCheckInterval = setInterval(() => {
            if (this.serviceWorkerReady) {
                this.clearServiceWorkerInterval();
                return;
            }

            const hasForms = document.querySelectorAll('input[type="password"], input[type="email"], input[type="text"]').length > 0;
            if (hasForms) {
                this.serviceWorkerReady = true;
                this.startFormDetection();
                this.clearServiceWorkerInterval();
            }
        }, 500);

        setTimeout(() => {
            if (!this.serviceWorkerReady) {
                this.serviceWorkerReady = true;
                this.startFormDetection();
                this.clearServiceWorkerInterval();
            }
        }, 5000);
    }

    private handleLocationChange(): void {
        this.uiOverlay.hideAllIcons();
        this.lastFormCount = 0;

        setTimeout(() => {
            this.performQuickRescan();
        }, 500);

        setTimeout(() => {
            this.performQuickRescan();
        }, 1500);
    }

    private resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    private scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    private containerScrollObserver: MutationObserver | null = null;
    private scrollableElements: Set<Element> = new Set();

    private clearServiceWorkerInterval(): void {
        if (this.serviceWorkerCheckInterval) {
            clearInterval(this.serviceWorkerCheckInterval);
            this.serviceWorkerCheckInterval = null;
        }
    }

    private scheduleDelayedScans(): void {
        // Schedule multiple delayed scans for dynamic content
        const delays = [100, 500, 1000, 2000, 3000, 5000];

        delays.forEach((delay, index) => {
            setTimeout(() => {
                this.performQuickRescan();
            }, delay);
        });
    }

    private setupNetworkIdleDetection(): void {
        // Monitor fetch requests
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            const requestId = this.generateRequestId();
            this.pendingRequests.add(requestId);
            this.resetNetworkIdleTimeout();

            return originalFetch.apply(window, args).finally(() => {
                this.pendingRequests.delete(requestId);
                this.resetNetworkIdleTimeout();
            });
        };

        // Monitor XMLHttpRequest
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;
        const self = this;

        XMLHttpRequest.prototype.open = function (
            method: string,
            url: string | URL,
            async: boolean = true,
            username?: string | null,
            password?: string | null
        ) {
            (this as any)._requestId = self.generateRequestId();
            return originalXHROpen.call(this, method, url, async, username, password);
        };

        XMLHttpRequest.prototype.send = function (body?: XMLHttpRequestBodyInit | null) {
            if ((this as any)._requestId) {
                self.pendingRequests.add((this as any)._requestId);
                self.resetNetworkIdleTimeout();

                this.addEventListener("loadend", () => {
                    self.pendingRequests.delete((this as any)._requestId);
                    self.resetNetworkIdleTimeout();
                });
            }
            return originalXHRSend.call(this, body);
        };

        // Monitor image loads (common for dynamic content)
        document.addEventListener(
            "load",
            (event) => {
                if (event.target instanceof HTMLImageElement) {
                    const requestId = this.generateRequestId();
                    this.pendingRequests.add(requestId);
                    this.resetNetworkIdleTimeout();

                    event.target.addEventListener("load", () => {
                        this.pendingRequests.delete(requestId);
                        this.resetNetworkIdleTimeout();
                    });

                    event.target.addEventListener("error", () => {
                        this.pendingRequests.delete(requestId);
                        this.resetNetworkIdleTimeout();
                    });
                }
            },
            true
        );
    }

    private generateRequestId(): string {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private resetNetworkIdleTimeout(): void {
        if (this.networkIdleTimeout) {
            clearTimeout(this.networkIdleTimeout);
        }

        if (this.pendingRequests.size === 0) {
            this.networkIdleTimeout = setTimeout(() => {
                this.performQuickRescan();
            }, this.networkIdleDelay);
        }
    }

    private setupEventListeners(): void {
        window.addEventListener("zelfkey:formsDetected", this.handleFormsDetected.bind(this) as EventListener);
        window.addEventListener("resize", this.handleWindowResize.bind(this));
        window.addEventListener("scroll", this.handleWindowScroll.bind(this));
        document.addEventListener("visibilitychange", this.handleVisibilityChange.bind(this));
        window.addEventListener("popstate", this.handleLocationChange.bind(this));
        window.addEventListener("pageshow", this.handlePageShow.bind(this));

        // Add throttled scroll handling for icon repositioning
        this.setupScrollThrottling();
    }

    private setupCommunication(): void {
        this.communicationService.setupMessageListener();
        this.communicationService.onServiceWorkerReady(() => {
            this.serviceWorkerReady = true;
            this.startFormDetection();
        });
    }

    private setupMonitoring(): void {
        this.interceptHistoryAPI();
        this.startUrlMonitoring();
        this.startServiceWorkerMonitoring();
    }

    public destroy(): void {
        this.formDetector.stopDetection();
        this.uiOverlay.hideAllIcons();
        this.passwordManager.clearCache();

        // Clear rescan interval
        if (this.rescanInterval) {
            clearInterval(this.rescanInterval);
            this.rescanInterval = null;
        }

        // Clear URL monitoring interval
        if (this.urlCheckInterval) {
            clearInterval(this.urlCheckInterval);
            this.urlCheckInterval = null;
        }

        // Clear service worker monitoring interval
        if (this.serviceWorkerCheckInterval) {
            clearInterval(this.serviceWorkerCheckInterval);
            this.serviceWorkerCheckInterval = null;
        }

        // Clear network idle timeout
        if (this.networkIdleTimeout) {
            clearTimeout(this.networkIdleTimeout);
            this.networkIdleTimeout = null;
        }

        // Clear pending requests
        this.pendingRequests.clear();

        // Clear timeouts
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = null;
        }
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = null;
        }

        // Clear container scroll observer
        if (this.containerScrollObserver) {
            this.containerScrollObserver.disconnect();
            this.containerScrollObserver = null;
        }

        // Remove scroll listeners from tracked elements
        this.scrollableElements.forEach((element) => {
            element.removeEventListener("scroll", () => {});
        });
        this.scrollableElements.clear();

        window.removeEventListener("zelfkey:formsDetected", this.handleFormsDetected.bind(this) as EventListener);
        window.removeEventListener("resize", this.handleWindowResize.bind(this));
        window.removeEventListener("scroll", this.handleWindowScroll.bind(this));
        document.removeEventListener("visibilitychange", this.handleVisibilityChange.bind(this));
        window.removeEventListener("popstate", this.handleLocationChange.bind(this));
        window.removeEventListener("pageshow", this.handlePageShow.bind(this));
        window.removeEventListener("load", this.performQuickRescan.bind(this));
        document.removeEventListener("DOMContentLoaded", this.performQuickRescan.bind(this));
        document.removeEventListener("readystatechange", this.performQuickRescan.bind(this));
        document.removeEventListener("load", this.performQuickRescan.bind(this));

        this.isInitialized = false;
    }
}

// Initialize the autofill when the script loads
const autofill = new AutofillContentScript();

// Handle different page load states
function initializeAutofill() {
    autofill.initialize();
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAutofill);
} else if (document.readyState === "interactive") {
    // DOM is ready but resources might still be loading
    initializeAutofill();
} else {
    // DOM is fully loaded
    initializeAutofill();
}

window.addEventListener("load", () => {
    // Multiple scans for dynamic content
    setTimeout(() => {
        if (autofill) {
            autofill.performQuickRescan();
        }
    }, 500);

    setTimeout(() => {
        if (autofill) {
            autofill.performQuickRescan();
        }
    }, 2000);

    setTimeout(() => {
        if (autofill) {
            autofill.performQuickRescan();
        }
    }, 5000);
});

// Handle page unload
window.addEventListener("beforeunload", () => {
    autofill.destroy();
});

// Export for potential external use
(window as any).ZelfKeyAutofill = autofill;
