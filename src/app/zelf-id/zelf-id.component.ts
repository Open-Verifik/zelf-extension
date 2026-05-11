import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: "zelf-id",
    standalone: true,
    imports: [RouterLink],
    template: `
        <div class="zelf-card zelf-id">
            <div class="zelf-id__header">
                <button [routerLink]="['/home']" class="zelf-icon-button zelf-icon-button--secondary zelf-icon-button--40">
                    <svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"
                        />
                    </svg>
                </button>
                <p class="zelf-id__title">zID</p>
                <div class="zelf-id__spacer"></div>
            </div>

            <div class="zelf-id__body"></div>
        </div>
    `,
    styles: [`
        @use "../../styles/variables";

        :host {
            align-items: center;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            justify-content: center;
        }

        .zelf-id {
            &__header {
                width: 100%;
                display: flex;
                align-items: center;
                padding: 0 0 calc(12px * var(--zns-space-scale, 1));
                border-bottom: 1px solid variables.$themeBorder;
            }

            &__title {
                flex: 1;
                text-align: center;
                font-weight: 600;
                font-size: calc(16px * var(--zns-font-scale, 1));
                margin: 0;
                color: variables.$themeText;
            }

            &__spacer {
                width: calc(40px * var(--zns-space-scale, 1));
                flex-shrink: 0;
            }

            &__body {
                flex: 1;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
        }
    `],
})
export class ZelfIdComponent {}
