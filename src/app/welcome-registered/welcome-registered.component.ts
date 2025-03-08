import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";
import { Wallet } from "app/wallet";
import { ZelfNameService } from "app/zelf-name-service.service";

@Component({
    selector: "welcome-registered",
    standalone: true,
    imports: [CommonModule, RouterModule, TranslocoModule, MatButtonModule],
    templateUrl: "./welcome-registered.component.html",
    styleUrls: ["./welcome-registered.component.scss"],
})
export class WelcomeRegisteredComponent implements OnInit {
    loading: boolean = false;
    zelfNameObject?: Wallet;

    constructor(private _zelfNameService: ZelfNameService) {}

    async ngOnInit(): Promise<void> {
        this.zelfNameObject = await this._zelfNameService.getZelfNameObject();
        console.log(` WelcomeRegisteredComponent ~ ngOnInit ~ this.zelfNameObject:`, this.zelfNameObject);
    }
}
