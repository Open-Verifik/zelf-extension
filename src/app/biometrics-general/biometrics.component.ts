import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Observable, Subject, timeout } from "rxjs";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { MatButtonModule } from "@angular/material/button";

import * as faceapi from "@vladmandic/face-api";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { FlexLayoutModule } from "@angular/flex-layout";
import { WalletService } from "../wallet.service";

// import { AuthBiometricErrorsDisplayComponent } from "../auth-biometric-errors-display/auth-biometric-errors-display.component";
import { Router } from "@angular/router";
import { Attemps, CameraData, ErrorFace, FaceData, FacingMode, Intervals, OvalData, ResponseData, directionImage } from "./sdk.models";

import { WebcamImage, WebcamInitError, WebcamModule } from "ngx-webcam";
import { HttpWrapperService } from "app/http-wrapper.service";
import { environment } from "environments/environment";
import { ChromeService } from "app/chrome.service";

let _this = {
	biometricsLoginCalled: false,
};

@Component({
	selector: "biometrics-general",
	standalone: true,
	templateUrl: "./biometrics.component.html",
	styleUrls: ["./biometrics.component.scss"],
	imports: [
		FlexLayoutModule,
		CommonModule,
		MatDialogModule,
		TranslocoModule,
		MatButtonModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		WebcamModule,
	],
})
export class BiometricsGeneralComponent implements OnInit, AfterViewInit, OnDestroy {
	@Input() type?: string;
	@Input() data: any;
	@Input() callback: any;

	//ACTIVE DEBUG GRAPHIC MODE
	isActiveDebug!: Boolean;
	debugIndex!: number;
	debugText: string = "debug";

	@ViewChild("maskResult", { static: false }) public maskResultCanvasRef: ElementRef | undefined;
	@ViewChild("toSend", { static: false }) public ToSendCanvasRef: ElementRef | undefined;
	deviceData: any;
	attempts!: Attemps;
	camera!: CameraData;
	response!: ResponseData;
	face!: FaceData;
	interval!: Intervals;
	aspectRatio = 0.75;
	marginX!: number;
	marginY!: number;
	lastFace: any;
	errorFace!: ErrorFace | null;
	direction!: directionImage;
	showError: Boolean;
	errorContent: any;
	session: any;

	private _unsubscribeAll: Subject<any> = new Subject<any>();
	private takePicture: Subject<void> = new Subject<void>();

	constructor(
		private _dom: ElementRef,
		private _changeDetectorRef: ChangeDetectorRef,
		private _walletService: WalletService,
		private _translocoService: TranslocoService,
		private renderer: Renderer2,
		private _navigation: Router,
		private _httpWrapperService: HttpWrapperService,
		private _chromeService: ChromeService
	) {
		this.deviceData = this._walletService.getDeviceData();

		this.session = this._walletService.getSessionData();

		this.startDefaultValues();

		this.setDefaultAttempts();

		this.setDefaultDirections();

		this.setDefaultFace();

		this.setDefaultInterval();

		this.renderer.listen("window", "resize", () => {
			this.interval.checkNgxVideo = setInterval(() => {
				this.setMaxVideoDimensions();
				this.setVideoNgxCameraData();
			}, this.deviceData.time);
		});

		this.showError = false;

		this.errorContent = {
			message: "",
		};

		this._changeDetectorRef.markForCheck();
	}

	ngOnInit(): void {
		this.startDefaultValues();

		this.camera.hasPermissions = true;

		this.loading({ start: true });

		this._walletService.faceapi$.subscribe(async (isLoaded) => {
			this.camera.isLoading = !isLoaded;

			this.setMaxVideoDimensions();

			if (isLoaded) {
				this.interval.checkNgxVideo = setInterval(() => {
					this.setVideoNgxCameraData();

					this._generateSession(this.type);
				}, 100);
			}
		});
	}

	ngAfterViewInit() {
		// this.setWillReadFrequently(this.maskResultCanvasRef?.nativeElement);
		// this.setWillReadFrequently(this.ToSendCanvasRef?.nativeElement);
	}

	private setWillReadFrequently(canvas: HTMLCanvasElement) {
		if (!canvas) return;

		const context = canvas.getContext("2d", { willReadFrequently: true });
	}

	_generateSession(type?: string): void {
		let { hash } = this._walletService.generateUniqueId();

		this._walletService
			.createLivenessSession({
				identifier: hash,
				type,
			})
			.then((response) => {
				this._chromeService.setItem("accessToken", response.data.token);
			});
	}

	public get takePicture$(): Observable<void> {
		return this.takePicture.asObservable();
	}

	setDefaultFace = () => {
		this.face = {
			successPosition: 0,
			minPixels: 240,
			minHeight: 600,
			threshold: 0.25,
		};
	};

	setDefaultDirections = () => {
		this.direction = {
			left: new Image(),
			right: new Image(),
			up: new Image(),
			down: new Image(),
		};
		this.direction.right.crossOrigin = "anonymous";
		this.direction.up.crossOrigin = "anonymous";
		this.direction.down.crossOrigin = "anonymous";
		this.direction.left.crossOrigin = "anonymous";

		this.direction.left.src = "https://cdn.verifik.co/web-sdk/images/left.png";
		this.direction.right.src = "https://cdn.verifik.co/web-sdk/images/right.png";
		this.direction.up.src = "https://cdn.verifik.co/web-sdk/images/up.png";
		this.direction.down.src = "https://cdn.verifik.co/web-sdk/images/down.png";
	};

	setDefaultAttempts = () => {
		this.attempts = {
			current: 0,
			limit: 3,
		};
	};

	setDefaultCamera = () => {
		let key = this.deviceData.isMobile ? "width" : "height";

		this.camera = {
			hasPermissions: false,
			isLoading: false,
			isLowQuality: false,
			configuration: {
				frameRate: { ideal: 30, max: 30 },
				[key]: { ideal: 1080 },
				facingMode: FacingMode.USER,
			},
			dimensions: {
				video: {
					max: {
						height: Math.ceil(window.innerHeight * 0.7),
						width: Math.ceil(window.innerWidth * 0.9),
					},
				},
			},
		};
	};

	setDefaultResponse = () => {
		this.response = {
			isLoading: false,
			isFailed: false,
		};
	};

	setDefaultInterval = () => {
		this.interval = {};
	};

	startDefaultValues() {
		this.setDefaultResponse();
		this.setDefaultCamera();
		this.setMaxVideoDimensions();
	}

	setVideoNgxCameraData = () => {
		const videoNgx = this._dom.nativeElement.querySelector("video");

		if (!videoNgx) return;

		videoNgx.addEventListener("loadeddata", () => {
			this.setVideoDimensions(videoNgx);
			this.drawOvalCenterAndMask();

			if (!this.interval.detectFace) {
				this.interval.detectFace = setInterval(() => {
					if (this.response.base64Image) {
						this.interval.detectFace = clearInterval(this.interval.detectFace);
						return;
					}

					this.takePicture.next();
				}, this.deviceData.time);
			}
		});

		this.interval.checkNgxVideo = clearInterval(this.interval.checkNgxVideo);

		this.setVideoDimensions(videoNgx);
		this.drawOvalCenterAndMask();

		this.loading({ isLoading: false, start: true });
	};

	setVideoDimensions(videoNgx: any) {
		this.camera.dimensions.video.height = videoNgx.clientHeight;
		this.camera.dimensions.video.width = videoNgx.clientWidth;

		this.camera.dimensions.result = { height: 0, width: 0, offsetX: 0, offsetY: 0 };
		this.setResultDimensions("result", videoNgx.clientHeight, videoNgx.clientWidth);

		this.face.video = this.getCenterAndRadius(videoNgx.clientHeight, videoNgx.clientWidth);

		const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;
		maskResultCanvas.style.marginLeft = `0px`;
		maskResultCanvas.style.marginTop = `0px`;
	}

	setMaxVideoDimensions(): void {
		this.camera.dimensions.video = {
			max: {
				height: Math.ceil(window.innerHeight * 0.7),
				width: Math.ceil(window.innerWidth * 0.9),
			},
		};
		this.camera.dimensions.result = undefined;
	}

	drawOvalCenterAndMask(): void {
		const videoDim = this.camera.dimensions.video;
		const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;
		maskResultCanvas.height = videoDim.height;
		maskResultCanvas.width = videoDim.width;

		const ctx: CanvasRenderingContext2D = maskResultCanvas.getContext("2d");

		//CLEAR CANVAS
		ctx.clearRect(0, 0, videoDim.width || 0, videoDim.height || 0);

		//OPACITY OUTSIDE THE ELLIPSE
		ctx.fillStyle = "rgba(255, 255, 255, 0.75)"; // Color de la máscara
		ctx.fillRect(0, 0, videoDim.width || 0, videoDim.height || 0);
		ctx.globalCompositeOperation = "destination-out";

		//DRAW ELIPSE CON RELLENO VACIO
		const { center, radius } = this.face.video || { center: { x: 0, y: 0 }, radius: { x: 0, y: 0 } };

		ctx.fillStyle = "rgba(255, 255, 255, 1)";
		ctx.beginPath();
		ctx.ellipse(center?.x, center?.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
		ctx.globalCompositeOperation = "source-over";
	}

	setResultDimensions(key: "real" | "result", height: number, width: number) {
		const { center, radius } = (this.face[key] = this.getCenterAndRadius(height, width));
		const dimensions = this.camera.dimensions[key];

		if (dimensions) {
			dimensions.height = height;
			dimensions.offsetY = 0;

			dimensions.width = Math.min(2.8 * radius.x, width);
			dimensions.offsetX = center.x - dimensions.width / 2;
		}
	}

	getCenterAndRadius = (height: number, width: number) => {
		const data: OvalData = {
			center: {
				x: width / 2,
				y: height / 2,
			},
			radius: {
				x: 0,
				y: 0,
			},
			margin: {
				y: height * 0.05,
				x: 0,
			},
		};

		data.margin.x = data.margin.y * 0.8;

		data.radius.y = height * 0.42;
		data.radius.x = data.radius.y * this.aspectRatio;

		if (data.radius.x * 2 >= width) {
			data.radius.x = width * 0.48;
			data.radius.y = data.radius.x / this.aspectRatio;
		}

		return data;
	};

	loading(paramsLoading: any) {
		const { isLoading = true, start, result } = paramsLoading;
		const key: "camera" | "response" = (start && "camera") || (result && "response");

		if (key && this[key]) {
			this[key].isLoading = isLoading;
		}
	}

	cameraError(error: WebcamInitError): void {
		if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
			this.loading({ isLoading: false, start: true });
			this.camera.hasPermissions = false;
		}
	}

	proccessImage(webcamImage: WebcamImage): void {
		if (!this.interval.detectFace || this.response.base64Image) return;

		const img = new Image();

		img.src = webcamImage.imageAsDataUrl;

		img.onload = async () => {
			if (img.height < this.face.minHeight) {
				this.camera.isLowQuality = true;

				return;
			}

			try {
				this.camera.dimensions.real = { height: 0, width: 0, offsetX: 0, offsetY: 0 };
				this.setResultDimensions("real", img.height, img.width);
				this.face.real = this.getCenterAndRadius(img.height, img.width);

				const detection = await faceapi.detectAllFaces(img, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.2 })).withFaceLandmarks();

				const context = this.maskResultCanvasRef?.nativeElement.getContext("2d");

				if (detection.length > 0) {
					this.lastFace = detection[0];
					this.errorFace = null;

					this.drawOvalCenterAndMask();
					this.isFaceCentered(this.lastFace.landmarks.getNose()[3]);
					this.isFaceClose(this.lastFace.landmarks);
					this.drawStatusOval(context, !this.errorFace);

					!this.errorFace ? ++this.face.successPosition : (this.face.successPosition = 0);

					if (!this.errorFace && this.face.successPosition > 2) {
						this.face.successPosition = 0;
						this.takePictureLiveness(img);
						return;
					}
				}

				this._changeDetectorRef.markForCheck();
			} catch (error: any) {
				alert(error.message);
			}
		};
	}

	_onLoadImage(): void {}

	takePictureLiveness(img: any) {
		const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;
		this.setImageOnCanvas(maskResultCanvas, img, this.camera.dimensions.real, this.camera.dimensions.result);

		const toSendCanvas = this.ToSendCanvasRef?.nativeElement;
		this.setImageOnCanvas(toSendCanvas, img, this.camera.dimensions.real, this.camera.dimensions.real);

		this.response.base64Image = toSendCanvas.toDataURL("image/jpeg");

		this.biometricsLogin();
	}

	setImageOnCanvas = (canvas: any, inputImg: any, originalDim: any, resizeDim: any) => {
		canvas.width = resizeDim.width;
		canvas.height = resizeDim.height;
		canvas.style.marginLeft = `${resizeDim.offsetX || 0}px`;
		canvas.style.marginTop = `${resizeDim.offsetY || 0}px`;

		const ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, originalDim.width, originalDim.height);

		ctx.drawImage(
			inputImg,
			originalDim.offsetX,
			originalDim.offsetY,
			originalDim.width,
			originalDim.height,
			0,
			0,
			resizeDim.width,
			resizeDim.height
		);
	};

	drawStatusOval(ctx: any, isOk?: any): void {
		const { center, radius } = this.face.video || { center: { x: 0, y: 0 }, radius: { x: 0, y: 0 } };

		ctx.beginPath();
		ctx.ellipse(center.x, center.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
		ctx.lineWidth = 5;
		ctx.strokeStyle = isOk ? "green" : "red";
		ctx.stroke();
		ctx.closePath();

		if (!isOk) {
			if (this.errorFace?.canvas?.includes("↑")) {
				const startX = center.x - 20;
				const startY = center.y - radius.y + 10;
				ctx.drawImage(this.direction.up, startX, startY, 40, 40);
			}

			if (this.errorFace?.canvas?.includes("↓")) {
				const startX = center.x - 20;
				const startY = center.y + radius.y - 50;
				ctx.drawImage(this.direction.down, startX, startY, 40, 40);
			}

			if (this.errorFace?.canvas?.includes("→")) {
				const startX = center.x + radius.x - 50;
				const startY = center.y - 20;
				ctx.drawImage(this.direction.right, startX, startY, 40, 40);
			}

			if (this.errorFace?.canvas?.includes("←")) {
				const startX = center.x - radius.x + 10;
				const startY = center.y - 20;
				ctx.drawImage(this.direction.left, startX, startY, 40, 40);
			}
		}

		this._changeDetectorRef.markForCheck();
	}

	inRange(value: number, min: number, max: number) {
		return value >= min && value <= max;
	}

	isFaceCentered(nose: any): void {
		const faceCenterX = nose.x;
		const faceCenterY = nose.y;

		const { center, margin } = this.face.real || { center: { x: 0, y: 0 }, margin: { x: 0, y: 0 } };

		const inRangeX = this.inRange(faceCenterX, center.x - margin.x, center.x + margin.x);
		const inRangeY = this.inRange(faceCenterY, center.y, center.y + margin.y * 2.5);

		const isFaceCentered = inRangeX && inRangeY;

		if (!isFaceCentered) {
			let direction = "";

			if (!inRangeX) direction += `${faceCenterX < center.x - margin.x ? "→" : "←"}`;

			if (!inRangeY) direction += `${faceCenterY < center.y ? "↓" : "↑"}`;

			this.errorFace = {
				title: this._translocoService.translate("liveness.center_yor_face"),
				subtitle: this._translocoService.translate("liveness.center_your_face_subtitle"),
				canvas: direction,
			};
		}
	}

	isFaceClose(landmarks: faceapi.FaceLandmarks68): void {
		const realDim = this.camera.dimensions.real || { center: { x: 0, y: 0 }, margin: { x: 0, y: 0 }, height: 0, width: 0, offsetX: 0 };
		const totalFaceArea = landmarks.imageHeight * landmarks.imageWidth;
		const totalImageArea = Math.floor(realDim.height * (realDim.width - realDim.offsetX));
		const faceProportion = totalFaceArea / totalImageArea;

		if (faceProportion < this.face.threshold || landmarks.imageHeight < this.face.minPixels || landmarks.imageWidth < this.face.minPixels) {
			this.errorFace = {
				title: this._translocoService.translate("liveness.get_closer"),
				subtitle: this._translocoService.translate("liveness.get_closer_subtitle"),
			};
		}
	}

	async biometricsLogin(): Promise<any> {
		// Check if the function has already been called
		if (_this["biometricsLoginCalled"]) return;

		// // Set the flag to true to indicate that the function has been called
		_this["biometricsLoginCalled"] = true;

		if (this.response.isLoading) return;

		this.loading({ result: true });

		const payload: any = {
			faceBase64: this.response?.base64Image?.replace(/^data:.*;base64,/, ""),
			os: this.deviceData.OS,
		};

		if (this.session.password) payload.password = this.session.password;

		payload.faceBase64 = await this._httpWrapperService.encryptMessage(payload.faceBase64);

		switch (this.type) {
			case "createWallet":
				this._createWallet(payload, this.data);
				break;
			case "decryptWallet":
				this._decryptWallet(payload, this.data);
				break;
			case "importWallet":
				this._importWallet(payload, this.data);
				break;
			default:
				break;
		}
	}

	_createWallet(payload: any, data: any): void {
		this._walletService
			.createWallet({
				...payload,
				wordsCount: data.wordsCount || payload.wordsCount || 12,
				seeWallet: 1,
			})
			.then((response) => {
				this.session.showBiometrics = false;

				this._chromeService.setItem("wallet", response.data);
				// localStorage.setItem("wallet", JSON.stringify(response.data));

				this._walletService.goToNextStep(this.session.step + 1);

				_this["biometricsLoginCalled"] = false;
			})
			.catch((err) => {
				this.errorContent = err.error;
				this.retryLivenessModal(err.error?.message);
				this.loading({ isLoading: false, result: true });
			});
	}

	_decryptWallet(payload: any, data: any): void {
		this._walletService
			.decryptWAllet({
				...payload,
				wallet: data.zelfProof,
				identifier: data.identifier,
			})
			.then((response) => {
				this._chromeService.setItem("unlockWallet", response.data);

				setTimeout(() => {
					this.session.showBiometrics = false;

					_this["biometricsLoginCalled"] = false;
				}, 500);
			})
			.catch((err) => {
				this.errorContent = err.error;
				this.retryLivenessModal(err.error?.message);
				this.loading({ isLoading: false, result: true });
			});
	}

	_importWallet(payload: any, data: any): void {
		this._walletService
			.importWallet({
				...payload,
				phrase: data.phrase,
			})
			.then((response) => {
				this.session.walletCreated = response.data;

				this._chromeService.setItem("importWallet", response.data);
				// localStorage.setItem("importWallet", JSON.stringify(response.data));

				this._walletService.goToNextStep(this.session.step + 1);

				_this["biometricsLoginCalled"] = false;
			})
			.catch((err) => {
				this.errorContent = err.error;

				this.retryLivenessModal(err.error?.message);

				this.loading({ isLoading: false, result: true });
			});
	}

	retryLivenessModal(error: any) {
		const data = {
			title: this._translocoService.translate("liveness.liveness_failed"),
			message: this._translocoService.translate("liveness.liveness_error_message", { error }),
			icon: {
				show: true,
				name: "heroicons_outline:exclamation-triangle",
				color: "warn",
			},
			actions: {
				confirm: {
					show: true,
					label: this._translocoService.translate("confirm"),
					color: "primary",
				},
				cancel: {
					show: true,
					label: this._translocoService.translate("cancel"),
				},
			},
			dismissible: false,
		};

		// this._matDialog
		// 	.open(FuseConfirmationDialogComponent, {
		// 		autoFocus: false,
		// 		disableClose: true,
		// 		panelClass: "fuse-confirmation-dialog-panel",
		// 		data,
		// 	})
		// 	.afterClosed()
		// 	.subscribe((result: string) => {
		// 		if (result === "confirmed") {
		// 			this.setDefaultInterval();

		// 			this.setDefaultFace();

		// 			return this.ngOnInit();
		// 		}

		// 		this._walletService.restart();
		// 	});
	}

	continueRedirection(): void {
		// if (this.showError && this.errorContent.message === "person_not_found") {
		// 	window.location.reload();
		// 	return;
		// }
		// const token = localStorage.getItem("accessToken");
		// const redirectUrl = Boolean(environment.verifikProject === this.project._id) ? `${environment.appUrl}/sign-in` : this.projectFlow.redirectUrl;
		// window.location.href = `${redirectUrl}?type=login&token=${token}`;
	}

	ngOnDestroy(): void {
		this._unsubscribeAll.next(null);
	}
}
