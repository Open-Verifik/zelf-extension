import { Component, Input, OnInit } from "@angular/core";
import { RouterLink, ActivatedRoute } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

@Component({
    selector: "feature-coming-soon",
    standalone: true,
    imports: [TranslocoModule, RouterLink],
    template: `
        <div class="zelf-card feature-coming-soon" *transloco="let t">
            <div class="feature-coming-soon__header">
                <button [routerLink]="['/home']" class="zelf-icon-button zelf-icon-button--secondary zelf-icon-button--40">
                    <svg width="22" height="14" viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M20.0898 5.8277H4.72478L8.08478 2.4677C8.53978 2.0127 8.53978 1.2777 8.08478 0.822695C7.62978 0.367695 6.89478 0.367695 6.43978 0.822695L1.08478 6.1777C0.62978 6.6327 0.62978 7.3677 1.08478 7.8227L6.43978 13.1777C6.89478 13.6327 7.62978 13.6327 8.08478 13.1777C8.53978 12.7227 8.53978 11.9877 8.08478 11.5327L4.72478 8.16103H20.0898C20.7314 8.16103 21.2564 7.63603 21.2564 6.99436C21.2564 6.3527 20.7314 5.8277 20.0898 5.8277Z"
                        />
                    </svg>
                </button>
                <p class="feature-coming-soon__title">{{ t(titleKey) }}</p>
                <div class="feature-coming-soon__spacer"></div>
            </div>

            <div class="feature-coming-soon__content">
                <div class="feature-coming-soon__icon-wrapper">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                    </svg>
                </div>
                <h2 class="feature-coming-soon__heading">{{ t("common.coming_soon") }}</h2>
                <p class="feature-coming-soon__description">{{ t(bodyKey) }}</p>
            </div>
        </div>
    `,
    styles: [`
        @use "../../../styles/variables";

        .feature-coming-soon {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            background: variables.$themeCard;
            color: variables.$themeText;

            &__header {
                display: flex;
                align-items: center;
                padding: calc(16px * var(--zns-space-scale, 1));
                border-bottom: 1px solid variables.$themeBorder;
            }

            &__title {
                flex: 1;
                text-align: center;
                font-weight: 600;
                font-size: calc(16px * var(--zns-font-scale, 1));
                margin: 0;
            }

            &__spacer {
                width: 40px; /* matches button width to center title */
            }

            &__content {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: calc(32px * var(--zns-space-scale, 1));
                text-align: center;
            }

            &__icon-wrapper {
                margin-bottom: calc(24px * var(--zns-space-scale, 1));
                color: variables.$themeTextMuted;
            }

            &__heading {
                font-size: calc(24px * var(--zns-font-scale, 1));
                font-weight: 700;
                margin-bottom: calc(8px * var(--zns-space-scale, 1));
            }

            &__description {
                font-size: calc(16px * var(--zns-font-scale, 1));
                color: variables.$themeTextMuted;
                max-width: 300px;
                line-height: 1.5;
            }
        }
    `]
})
export class FeatureComingSoonComponent implements OnInit {
    titleKey: string = "common.coming_soon";
    bodyKey: string = "common.coming_soon_desc";

    constructor(private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            if (data['titleKey']) this.titleKey = data['titleKey'];
            if (data['bodyKey']) this.bodyKey = data['bodyKey'];
        });
    }
}
