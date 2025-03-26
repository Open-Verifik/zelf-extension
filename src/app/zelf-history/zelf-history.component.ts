import { CurrencyPipe, DatePipe, DecimalPipe, KeyValuePipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { TranslocoModule } from "@ngneat/transloco";
import { AddressMaskPipe } from "app/pipes/address-mask.pipe";

type HistoryType = "send" | "receive" | "trade" | "approve";

type HistoryItem = {
    address: string;
    network: string;
    type: HistoryType;
    fiatAmount?: number | string;
    to: {
        address: string;
        amount: number | string;
        symbol: string;
        token: string;
        image: string;
    };
    from: {
        address: string;
        amount: number | string;
        symbol: string;
        token: string;
        image: string;
    };
};

type History = {
    [date: string]: HistoryItem[];
};

@Component({
    imports: [NgIf, NgClass, NgFor, NgTemplateOutlet, KeyValuePipe, DatePipe, TranslocoModule, DecimalPipe, CurrencyPipe, AddressMaskPipe],
    selector: "zelf-history",
    standalone: true,
    styleUrls: ["./zelf-history.component.scss"],
    templateUrl: "./zelf-history.component.html",
})
export class ZelfHistoryComponent implements OnInit {
    history!: History;
    loading: boolean = false;

    constructor() {}

    async ngOnInit(): Promise<void> {
        this._loadHistory();
    }

    private async _loadHistory(): Promise<void> {
        this.loading = true;

        setTimeout(() => {
            this.history = mockHistory;
            this.loading = false;
        }, 1000);
    }
}

const mockHistory: History = {
    "2021-09-09": [
        {
            address: "0xabcdef1234",
            network: "Ethereum",
            type: "receive",
            to: {
                address: "0xabcdef1234",
                amount: 0.8,
                symbol: "ETH",
                token: "Ethereum",
                image: "https://ankh.tv/wp-content/uploads/2022/03/eth.png",
            },
            from: {
                address: "0x567890abcd",
                amount: 0.8,
                symbol: "ETH",
                token: "Ethereum",
                image: "https://ankh.tv/wp-content/uploads/2022/03/eth.png",
            },
        },
        {
            address: "0x1234567890",
            network: "Ethereum",
            type: "send",
            to: {
                address: "0x0987654321",
                amount: 0.1,
                symbol: "ETH",
                token: "Ethereum",
                image: "https://ankh.tv/wp-content/uploads/2022/03/eth.png",
            },
            from: {
                address: "0x1234567890",
                amount: 0.1,
                symbol: "ETH",
                token: "Ethereum",
                image: "https://ankh.tv/wp-content/uploads/2022/03/eth.png",
            },
        },
        {
            address: "0x1234567890",
            network: "Ethereum",
            type: "send",
            to: {
                address: "0x0987654321",
                amount: 0.1,
                symbol: "ETH",
                token: "Ethereum",
                image: "https://ankh.tv/wp-content/uploads/2022/03/eth.png",
            },
            from: {
                address: "0x1234567890",
                amount: 0.1,
                symbol: "ETH",
                token: "Ethereum",
                image: "https://ankh.tv/wp-content/uploads/2022/03/eth.png",
            },
        },
        {
            address: "0x1234567890",
            network: "Ethereum",
            type: "send",
            to: {
                address: "0x0987654321",
                amount: 0.1,
                symbol: "ETH",
                token: "Ethereum",
                image: "https://ankh.tv/wp-content/uploads/2022/03/eth.png",
            },
            from: {
                address: "0x1234567890",
                amount: 0.1,
                symbol: "ETH",
                token: "Ethereum",
                image: "https://ankh.tv/wp-content/uploads/2022/03/eth.png",
            },
        },
    ],
    "2021-09-04": [
        {
            address: "0x1234567890",
            network: "Ethereum",
            type: "send",
            to: {
                address: "0x0987654321",
                amount: 0.1,
                symbol: "ETH",
                token: "Ethereum",
                image: "https://ankh.tv/wp-content/uploads/2022/03/eth.png",
            },
            from: {
                address: "0x1234567890",
                amount: 0.1,
                symbol: "ETH",
                token: "Ethereum",
                image: "https://ankh.tv/wp-content/uploads/2022/03/eth.png",
            },
        },
        {
            address: "0xabcdef1234",
            network: "Ethereum",
            type: "approve",
            to: {
                address: "0xcontract1234",
                amount: 1000,
                symbol: "USDT",
                token: "Tether",
                image: "https://creazilla-store.fra1.digitaloceanspaces.com/icons/3516745/tether-logo-icon-md.png",
            },
            from: {
                address: "0xabcdef1234",
                amount: 1000,
                symbol: "USDT",
                token: "Tether",
                image: "https://creazilla-store.fra1.digitaloceanspaces.com/icons/3516745/tether-logo-icon-md.png",
            },
        },
        {
            address: "0xabcdef1234",
            network: "Ethereum",
            type: "trade",
            to: {
                address: "0xabcdef1234",
                amount: 2.5,
                symbol: "USDT",
                token: "Tether",
                image: "https://creazilla-store.fra1.digitaloceanspaces.com/icons/3516745/tether-logo-icon-md.png",
            },
            from: {
                address: "0xabcdef1234",
                amount: 0.05,
                symbol: "ETH",
                token: "Ethereum",
                image: "https://ankh.tv/wp-content/uploads/2022/03/eth.png",
            },
        },
        {
            address: "0xabcdef1234",
            network: "Ethereum",
            type: "trade",
            to: {
                address: "0xabcdef1234",
                amount: 1.0,
                symbol: "DAI",
                token: "Dai Stablecoin",
                image: "https://th.bing.com/th/id/R.26d4501f9d3f49e0a1fa9e86cd462de3?rik=nwMUJqoXjEfwow&pid=ImgRaw&r=0",
            },
            from: {
                address: "0xabcdef1234",
                amount: 0.025,
                symbol: "ETH",
                token: "Ethereum",
                image: "https://ankh.tv/wp-content/uploads/2022/03/eth.png",
            },
        },
        {
            address: "0xabcdef1234",
            network: "Ethereum",
            type: "trade",
            to: {
                address: "0xabcdef1234",
                amount: 0.5,
                symbol: "USDC",
                token: "USD Coin",
                image: "https://th.bing.com/th/id/OIP.9ud4FPqgSa_wa_zgqPTLcQAAAA?rs=1&pid=ImgDetMain",
            },
            from: {
                address: "0xabcdef1234",
                amount: 0.012,
                symbol: "ETH",
                token: "Ethereum",
                image: "https://ankh.tv/wp-content/uploads/2022/03/eth.png",
            },
        },
        {
            address: "0xabcdef1234",
            network: "Ethereum",
            type: "receive",
            to: {
                address: "0xabcdef1234",
                amount: 0.5,
                symbol: "ETH",
                token: "Ethereum",
                image: "https://ankh.tv/wp-content/uploads/2022/03/eth.png",
            },
            from: {
                address: "0x9876543210",
                amount: 0.5,
                symbol: "ETH",
                token: "Ethereum",
                image: "https://ankh.tv/wp-content/uploads/2022/03/eth.png",
            },
        },
    ],
};
