import { Component, Input, OnInit } from "@angular/core";

@Component({
	selector: "token-card",
	template: `
		<div class="card-container" fxLayout="row" fxLayoutAlign="start center" (click)="onClick()">
			<div class="status-icon-container">
				<img [src]="data.image" />
			</div>
			<div class="text-container" fxLayout="column" fxLayoutAlign="start start">
				<div fxLayout="row" fxLayoutAlign="start center">
					<div class="status-text font-18">{{ data.symbol }}</div>
					<div class="pl-2 token-card-label">{{ data.network }}</div>
				</div>

				<div class="status-text text-grey">$ {{ data.price }} USD</div>

				<!-- <div class="status-text">{{}}</div> -->
			</div>

			<div class="amount-container" fxLayout="column" fxLayoutAlign="end end">
				<div class="status-text">{{ _getAmount(data.amount) }}</div>
				<div class="status-text text-grey">$ {{ data.fiatBalance }} USD</div>
			</div>
		</div>
	`,
	styles: [
		`
			.card-container {
				width: 100%;
				height: 88px;
				gap: 16px;
				display: inline-flex;
				padding: 12px;
			}

			.card-container:hover {
				background: #80808021;
				cursor: pointer;
			}

			.status-icon-container {
				justify-content: flex-start;
				align-items: flex-start;
				gap: 8px;
				display: flex;

				:is(img) {
					width: 36px;
				}
			}

			.status-icon {
				width: 16px;
				height: 16px;
			}

			.status-icon-inner {
				width: 9.73px;
				height: 9.73px;

				background: black;
			}

			.text-container {
				gap: 6px;
				width: 60%;
			}

			.amount-container {
				width: 30%;
				gap: 10px;
			}

			.status-text {
				color: #1b1b1f;
				font-size: 14px;
				font-family: Poppins, sans-serif;
				font-weight: 600;
				line-height: 24px;
				letter-spacing: 0.15px;
				word-wrap: break-word;
			}

			.date-text {
				text-align: right;
				gap: 6px;
			}

			.date-green {
				color: #38a62b;
				font-size: 10px;
				font-family: Poppins, sans-serif;
				font-weight: 500;
				line-height: 14px;
				letter-spacing: 0.1px;
				word-wrap: break-word;
			}
			.date-gray {
				color: #46464f;
				font-size: 14px;
				font-family: Poppins, sans-serif;
				font-weight: 500;
				line-height: 20px;
				letter-spacing: 0.1px;
				word-wrap: break-word;
			}

			.token-card-label {
				background: #f0f0f0;
				padding: 4px;
				margin: 4px;
				border-radius: 4px;
			}
		`,
	],
})
export class TokenCardComponent implements OnInit {
	@Input() data: any;
	@Input() view: string;
	@Input() shareables: any;

	constructor() {
		this.view = "default";
	}

	ngOnInit(): void {}

	_getAmount(amount: any): Number {
		if (!amount && amount >= 0) return 0;

		return Math.floor(amount * Math.pow(10, 8)) / Math.pow(10, 8);
	}

	onClick(): void {
		console.log({ shareables: this.shareables, data: this.data });

		if (this.view === "tokens") {
			this.shareables.view = "pickReceiver";
		}
	}
}
