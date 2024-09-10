import { Component, Input, OnInit } from "@angular/core";

@Component({
	selector: "nft-card",
	template: `
		<div class="card-container" fxLayout="row" fxLayoutAlign="start center">
			<div class="status-icon-container">
				<img [src]="data.image" />
			</div>
			<div class="text-container" fxLayout="column" fxLayoutAlign="start start">
				<div class="status-text">{{ data.name }}</div>

				<div class="status-text">{{ data.symbol }}</div>
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
				padding: 8px;
				border-radius: 16px;
				border: 2px #1c44f9 solid;
				justify-content: flex-start;
				align-items: flex-start;
				gap: 8px;
				display: flex;
			}

			.status-icon-container img {
				width: 26px;
			}

			.status-icon {
				width: 16px;
				height: 16px;
			}

			.status-icon-inner {
				width: 9.73px;
				height: 9.73px;

				background: #1c44f9;
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
		`,
	],
})
export class NftCardComponent implements OnInit {
	@Input() data: any;

	constructor() {
		// console.log({ data: this.data });
	}

	ngOnInit(): void {}
}
