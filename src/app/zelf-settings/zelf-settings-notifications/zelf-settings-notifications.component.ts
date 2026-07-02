import { NgFor } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { TranslocoModule } from "@jsverse/transloco";
import { DEFAULT_NOTIFICATION_SETTINGS, NotificationSettings, Settings } from "app/models/settings.model";
import { SettingsService } from "app/services/settings.service";

interface NotificationRow {
    key: keyof NotificationSettings;
    label: string;
    description: string;
    icon: string;
}

@Component({
    imports: [NgFor, MatSlideToggleModule, TranslocoModule],
    selector: "zelf-settings-notifications",
    styleUrls: ["./zelf-settings-notifications.component.scss"],
    templateUrl: "./zelf-settings-notifications.component.html",
})
export class ZelfSettingsNotificationsComponent implements OnInit {
    settings!: Settings;
    notifications: NotificationSettings = { ...DEFAULT_NOTIFICATION_SETTINGS };

    // Mirrors the mobile apps' Notifications screen: News/Updates, Push notifications, Send and receive.
    readonly rows: NotificationRow[] = [
        { key: "news", label: "settings.notifications.news", description: "settings.notifications.news_description", icon: "campaign" },
        { key: "push", label: "settings.notifications.push", description: "settings.notifications.push_description", icon: "notifications" },
        {
            key: "sendReceive",
            label: "settings.notifications.send_receive",
            description: "settings.notifications.send_receive_description",
            icon: "swap_horiz",
        },
    ];

    constructor(private _settingsService: SettingsService) {}

    ngOnInit(): void {
        this.settings = this._settingsService.settings;
        this.notifications = { ...DEFAULT_NOTIFICATION_SETTINGS, ...(this.settings.notifications ?? {}) };
    }

    onToggle(key: keyof NotificationSettings): void {
        this.notifications = { ...this.notifications, [key]: !this.notifications[key] };
        this.settings.notifications = this.notifications;
        this._settingsService.settings = this.settings;
    }
}
