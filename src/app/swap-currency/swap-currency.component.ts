import { Component, Input } from "@angular/core";
import { NetworkService } from "app/services/network.service";
import { SwapSource } from "app/swap/swap.component";
import { TokenData } from "app/wallet";

@Component({
    imports: [],
    selector: "swap-currency",
    standalone: true,
    styleUrls: ["./swap-currency.component.scss"],
    templateUrl: "./swap-currency.component.html",
})
export class SwapCurrencyComponent {
    @Input() source: SwapSource = "";
    @Input() selectedAsset: Partial<TokenData> = {};

    constructor(private _networkService: NetworkService) {}
}
