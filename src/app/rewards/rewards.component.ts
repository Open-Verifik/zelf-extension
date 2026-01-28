import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";

interface Task {
    id: string;
    title: string;
    reward: string;
    completed: boolean;
    action?: () => void;
}

@Component({
    imports: [CommonModule, MatButtonModule, RouterModule, TranslocoModule],
    selector: "rewards",
    styleUrls: ["./rewards.component.scss", "../main.scss"],
    templateUrl: "./rewards.component.html",
})
export class RewardsComponent {
    znsBalance: number = 0;
    invitedFriends: number = 0;
    maxInvites: number = 10;

    tasks: Task[] = [
        {
            id: "invite-friend",
            title: "Invite your first friend",
            reward: "Win 100 $ZNS",
            completed: false,
        },
        {
            id: "first-transaction",
            title: "Send your first ZNS transaction",
            reward: "Win up-to 100 $ZNS",
            completed: false,
        },
        {
            id: "join-discord",
            title: "Join our Discord",
            reward: "Win 25 $ZNS",
            completed: false,
        },
        {
            id: "join-telegram",
            title: "Join our telegram community",
            reward: "Win 25 $ZNS",
            completed: false,
        },
        {
            id: "join-x",
            title: "Join us on X",
            reward: "Win 5 $ZNS",
            completed: false,
        },
    ];

    constructor() {}

    onInviteFriends(): void {
        // TODO: Implement invite friends functionality
        console.log("Invite friends clicked");
    }

    onDailyRewards(): void {
        // TODO: Navigate to daily rewards/roulette
        console.log("Daily rewards clicked");
    }

    onRedeemZNS(): void {
        // TODO: Implement redeem functionality
        console.log("Redeem ZNS clicked");
    }

    onTaskClick(task: Task): void {
        if (task.completed) return;

        switch (task.id) {
            case "invite-friend":
                this.onInviteFriends();
                break;
            case "first-transaction":
                // Navigate to send
                break;
            case "join-discord":
                window.open("https://discord.gg/zelf", "_blank");
                break;
            case "join-telegram":
                window.open("https://t.me/zelfworld", "_blank");
                break;
            case "join-x":
                window.open("https://x.com/AZelfName", "_blank");
                break;
        }
    }
}
