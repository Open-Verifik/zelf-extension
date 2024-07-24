import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslocoService } from "@ngneat/transloco";
import { WalletService } from "app/wallet.service";
import { environment } from "environments/environment";
import { Observable, debounceTime, distinctUntilChanged, map } from "rxjs";
import jsQR from "jsqr";
import { Buffer } from "buffer";

@Component({
	selector: "uw-search-wallet",
	templateUrl: "./uw-search-wallet.component.html",
	styleUrls: ["../unlock-wallet.component.scss", "../../main.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class UwSearchWalletComponent implements OnInit {
	searchForm!: UntypedFormGroup;
	searchQuery$!: Observable<string>;
	potentialWallet: any;
	session: any;
	fileBase64: string | ArrayBuffer | null = null;
	qrCodeData: string | null = null;
	displayableError: any;
	unlockQRCode: string;

	constructor(
		private _walletService: WalletService,
		private _formBuilder: UntypedFormBuilder,
		private snackBar: MatSnackBar,
		private _translocoService: TranslocoService,
		private _changeDetectorRef: ChangeDetectorRef
	) {
		this.unlockQRCode = "";

		this.session = this._walletService.getSessionData();

		this.displayableError = null;
	}

	ngOnInit(): void {
		const defaultAddress = environment.production ? "" : "0x13901AE0F17E2875E86C86721f9943598601b0C4";
		this.searchForm = this._formBuilder.group({
			address: [defaultAddress, []],
		});

		this.searchQuery$ = this.searchForm.get("address")!.valueChanges.pipe(
			debounceTime(300), // wait for 300ms pause in events
			distinctUntilChanged(), // ignore if next search query is same as previous
			map((value) => value.trim()) // map the value to the trimmed string
		);

		this.searchQuery$.subscribe((query) => {
			this._triggerSearch(query);
		});

		const passedActiveWallet = localStorage.getItem("tempWalletAddress");
		const passedActiveQRCode = localStorage.getItem("tempWalletQrCode");

		if (passedActiveWallet && passedActiveQRCode) {
			this.qrCodeData = passedActiveWallet;

			this.fileBase64 = passedActiveQRCode;

			setTimeout(() => {
				localStorage.removeItem("unlockWallet");
				localStorage.removeItem("tempWalletAddress");
				localStorage.removeItem("tempWalletQrCode");
			}, 1000);

			this.previewQRCode();
		}
	}

	_triggerSearch(query: string): void {
		if (!query) return;

		this._walletService.findWallet(query).subscribe(
			(response) => {
				this.potentialWallet = response.data;
			},
			(error) => {
				this.snackBar.open("account not found", "OK");
				this.startAgain();
			}
		);
	}

	goToNextStep(): void {
		this._walletService.goToNextStep(this.session.step + 1);

		this.session.identifier = this.potentialWallet.ethAddress;

		if (!this.potentialWallet.hasPassword) {
			this._walletService.goToNextStep(this.session.step + 1);

			this.session.showBiometricsInstructions = true;
		}
	}

	startAgain(): void {
		this.potentialWallet = null;

		this.session.identifier = null;

		this.searchForm.patchValue({ address: "" });
	}

	// Method to handle file selection
	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];

			this.handleFile(file);
		}
	}

	// Method to handle drag over event
	onDragOver(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		// Add any visual indication for drag over
	}

	// Method to handle file drop event
	onDrop(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
		if (event.dataTransfer && event.dataTransfer.files.length > 0) {
			const file = event.dataTransfer.files[0];
			this.handleFile(file);
		}
	}

	// Method to handle drag leave event
	onDragLeave(event: DragEvent): void {
		event.preventDefault();
		event.stopPropagation();
	}

	// Method to handle the file
	handleFile(file: File): void {
		const reader = new FileReader();

		reader.onload = () => {
			this.fileBase64 = reader.result;

			if (typeof this.fileBase64 === "string") {
				this.decodeQRCode(this.fileBase64);
			}
		};

		reader.readAsDataURL(file);
	}

	// Method to decode QR code from base64 image
	decodeQRCode(base64: string): void {
		const img = new Image();

		img.src = base64;

		console.log({ img });

		img.onload = () => {
			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d");
			if (context) {
				canvas.width = img.width;
				canvas.height = img.height;
				context.drawImage(img, 0, 0, img.width, img.height);
				const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
				const code = jsQR(imageData.data, imageData.width, imageData.height);

				console.log({ code, imageData });

				this.extractBinaryData(code);
			}
		};
	}

	extractBinaryData(code: any): void {
		if (code && code.binaryData) {
			const hexString = this.toHexString(code.binaryData);
			const buffer = Buffer.from(hexString.replace(/\s/g, ""), "hex");
			const base64String = buffer.toString("base64");
			this.qrCodeData = base64String;

			this.previewQRCode();

			return;
		}

		this.displayableError = {
			type: "qr_code",
			message: "invalid_qr_code",
		};
	}

	previewQRCode(): void {
		if (!this.qrCodeData) return;

		this._walletService.previewWallet(this.qrCodeData).subscribe((response) => {
			this.potentialWallet = response.data?.wallet;

			if (!this.potentialWallet) {
				this.session.step = 0;

				this.qrCodeData = null;

				this._changeDetectorRef.markForCheck();

				return;
			}

			this.potentialWallet.hasPassword = Boolean(response.data?.type === "WithPassword");
		});
	}

	// Method to convert binary data to hex string
	toHexString(byteArray: any): string {
		return Array.from(byteArray, (byte: any) => {
			return ("0" + (byte & 0xff).toString(16)).slice(-2);
		}).join("");
	}
}
