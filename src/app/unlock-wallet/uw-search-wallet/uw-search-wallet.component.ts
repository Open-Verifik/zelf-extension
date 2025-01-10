import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslocoService } from "@ngneat/transloco";
import { WalletService } from "app/wallet.service";
import { Observable, debounceTime, distinctUntilChanged, map } from "rxjs";
import jsQR from "jsqr";
import { Buffer } from "buffer";

import { IpfsService } from "app/ipfs.service";
import { HttpClient } from "@angular/common/http";
import { Wallet, WalletModel } from "app/wallet";
import { Router } from "@angular/router";
import { ZelfNameService } from "app/zelf-name-service.service";
import { ChromeService } from "app/chrome.service";

@Component({
	selector: "uw-search-wallet",
	templateUrl: "./uw-search-wallet.component.html",
	styleUrls: ["../unlock-wallet.component.scss", "../../main.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class UwSearchWalletComponent implements OnInit, OnDestroy {
	searchForm!: UntypedFormGroup;
	searchQuery$!: Observable<string>;
	potentialWallet!: Wallet | null;
	session: any;
	fileBase64: string | ArrayBuffer | null = null;
	zelfProof: string | null = null;
	displayableError: any;
	unlockQRCode: string;
	loading: boolean;

	constructor(
		private _walletService: WalletService,
		private _formBuilder: UntypedFormBuilder,
		private snackBar: MatSnackBar,
		private _translocoService: TranslocoService,
		private _changeDetectorRef: ChangeDetectorRef,
		private _zelfNameService: ZelfNameService,
		private _ipfsService: IpfsService,
		private http: HttpClient,
		private _router: Router,
		private _chromeService: ChromeService
	) {
		this.unlockQRCode = "";
		this.loading = false;

		this.session = this._walletService.getSessionData();

		this.displayableError = null;

		localStorage.removeItem("unlockWallet");
	}

	async ngOnInit(): Promise<any> {
		const defaultAddress = "";

		this.searchForm = this._formBuilder.group({
			address: [defaultAddress, []],
		});

		this.searchQuery$ = this.searchForm.get("address")!.valueChanges.pipe(
			debounceTime(300), // wait for 300ms pause in events
			distinctUntilChanged(), // ignore if next search query is same as previous
			map((value) => value.trim()) // map the value to the trimmed string
		);

		this.searchQuery$.subscribe((query) => {
			this.loading = true;
			this.triggerSearch(query);
		});

		const checkingTempWallet = await this._checkForTempWallet();

		if (!checkingTempWallet) {
			this._checkForZelfFile();
		}
	}

	async _checkForTempWallet(): Promise<any> {
		this.loading = true;

		const zelfName = await this._chromeService.getItem("currentZelfName");

		const passedActiveQRCode = localStorage.getItem("tempWalletQrCode");

		if (!zelfName || !passedActiveQRCode) {
			this.loading = false;
			return false;
		}

		this.fileBase64 = passedActiveQRCode;

		setTimeout(() => {
			localStorage.removeItem("unlockWallet");

			localStorage.removeItem("tempWalletAddress");

			localStorage.removeItem("tempWalletQrCode");
		}, 1000);

		this._queryZNS("zelfName", zelfName);

		return true;
	}

	_checkForZelfFile(): void {
		const zelfFile = this._zelfNameService.getZelfFile();

		const zelfName = this._zelfNameService.getZelfName();

		if (!zelfFile && zelfName) this._router.navigate(["/onboarding"]);

		this._formatZelfFile(zelfFile);
	}

	async triggerSearch(query?: string): Promise<void> {
		if (!query) query = this.searchForm.value.address;

		if (!query) {
			this.loading = false;
			return;
		}

		try {
			const ethResponse = await this._queryZNS("ethAddress", query);

			if (!ethResponse) {
				const solanaResponse = await this._queryZNS("solanaAddress", query);

				if (!solanaResponse) {
					// Handle case where neither address type has results
					this._showAccountNotFound("solanaAddress");
				}

				this.loading = false;
				return;
			}

			this.loading = false;
		} catch (error) {
			this._showAccountNotFound("ethAddress");
		}
	}

	async _queryZNS(key: string, value: string): Promise<any> {
		try {
			const response = await this._ipfsService.queryByKeyValue(key, value);

			if (!response.data || !response.data.length) {
				return null; // Return null if no data found
			}

			const ipfsFile = response.data[0];

			this._formatZelfFile(ipfsFile);

			this.loading = false;

			return response; // Return the response if successful
		} catch (error) {
			console.error({ error });

			this.loading = false;

			return null; // Return null on error
		}
	}

	_formatZelfFile(zelfFile: any): void {
		if (!zelfFile) return;

		const record = {
			...zelfFile,
			image: zelfFile.url,
			name: zelfFile.zelfName,
		};

		this.potentialWallet = new WalletModel(record);

		this.session.hasPassword = this.potentialWallet.hasPassword;

		this._zelfNameService.setZelfFile(record);

		this._zelfNameService.setZelfName(record.name, 0);

		if (record.zelfProof) {
			this._zelfNameService.setZelfProof(record.zelfProof);
		}

		if (!this.potentialWallet.ethAddress) {
			this._router.navigate(["/onboarding"]);
		}
	}

	_setSessionVariables(): void {}

	_showAccountNotFound(key: string): void {
		this.snackBar.open(key + " account not found", "OK");

		this.startAgain();
	}

	goToNextStep(): void {
		this._walletService.goToNextStep(this.session.step + 1);

		this.session.identifier = this.potentialWallet?.ethAddress;

		this.session.usePassword = this.potentialWallet?.hasPassword;

		if (!this.potentialWallet?.hasPassword) {
			this._walletService.goToNextStep(this.session.step + 1);

			this.session.showBiometricsInstructions = true;
		}
	}

	startAgain(): void {
		this.potentialWallet = null;

		this.session.identifier = null;

		this.zelfProof = null;

		this.loading = false;

		this.searchForm.patchValue({ address: "" });
	}

	// Method to handle file selection
	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];

			this.loading = true;

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

		img.onload = () => {
			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d");
			if (context) {
				canvas.width = img.width;
				canvas.height = img.height;
				context.drawImage(img, 0, 0, img.width, img.height);
				const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
				const code = jsQR(imageData.data, imageData.width, imageData.height);

				this.extractBinaryData(code);
			}
		};
	}

	// Method to convert binary data to hex string
	toHexString(byteArray: any): string {
		return Array.from(byteArray, (byte: any) => {
			return ("0" + (byte & 0xff).toString(16)).slice(-2);
		}).join("");
	}

	extractBinaryData(code: any): void {
		if (code && code.binaryData) {
			const hexString = this.toHexString(code.binaryData);

			const buffer = Buffer.from(hexString.replace(/\s/g, ""), "hex");

			const base64String = buffer.toString("base64");

			this.zelfProof = base64String;

			this.previewQRCode();

			return;
		}

		this.loading = false;

		this.displayableError = {
			type: "qr_code",
			message: "invalid_qr_code",
		};
	}

	previewQRCode(zelfName?: string): void {
		if (!this.zelfProof) return;

		this._walletService.previewWallet(this.zelfProof).then((response) => {
			this.potentialWallet = new WalletModel({
				...response.data,
				zelfProof: this.zelfProof,
				image: this.fileBase64,
			});

			if (!this.potentialWallet.ethAddress) {
				this.session.step = 0;

				this.zelfProof = null;

				this._changeDetectorRef.markForCheck();

				return;
			}

			this.session.hasPassword = this.potentialWallet.hasPassword;

			this._zelfNameService.setZelfProof(this.potentialWallet.zelfProof);

			this._zelfNameService.setZelfName(this.potentialWallet.publicData.zelfName, 0);

			this.loading = false;
		});
	}

	// Function to convert URL to Base64
	public urlToBase64(url: string): Promise<string> {
		return this.http
			.get(url, { responseType: "blob" })
			.toPromise()
			.then((blob) => {
				return new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () => {
						const base64data = reader.result as string;
						resolve(base64data.split(",")[1]); // This will remove the 'data:...' part
					};
					reader.onerror = reject;

					if (blob) reader.readAsDataURL(blob);
				});
			});
	}

	ngOnDestroy(): void {
		this.potentialWallet = null;
	}
}
