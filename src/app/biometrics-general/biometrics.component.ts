import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import * as faceapi from "@vladmandic/face-api";
import { debounce, DebouncedFunc } from "lodash";
import { WebcamComponent, WebcamImage, WebcamInitError, WebcamModule } from "ngx-webcam";
import { Observable, Subject, takeUntil } from "rxjs";

import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Renderer2, ViewChild } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { HttpWrapperService } from "app/http-wrapper.service";
import { MediaStreamService } from "app/services/media-stream.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { WalletService } from "../wallet.service";
import { CameraData, directionImage, ErrorFace, FaceData, FacingMode, Intervals, OvalData, ResponseData } from "./sdk.models";

@Component({
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatDialogModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        TranslocoModule,
        WebcamModule,
        ZelfLoaderComponent,
    ],
    selector: "biometrics-general",
    styleUrls: ["./biometrics.component.scss"],
    templateUrl: "./biometrics.component.html",
})
export class BiometricsGeneralComponent implements OnInit, OnDestroy {
    @ViewChild("maskResult", { static: false }) public maskResultCanvasRef: ElementRef | undefined;
    @ViewChild("toSend", { static: false }) public ToSendCanvasRef: ElementRef | undefined;
    @ViewChild("webcam", { static: false }) public webcamRef?: WebcamComponent;

    @Output() canNavigate: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() error: EventEmitter<any> = new EventEmitter<any>();
    @Output() imageCaptured: EventEmitter<string> = new EventEmitter<string>();

    private _resizeUnlisten: () => void = () => {};

    private _debounceWindowResize: DebouncedFunc<() => void>;
    private _intervals: Intervals = {};
    private _takePicture: Subject<void> = new Subject<void>();
    private unsubscriber$: Subject<void> = new Subject<void>();

    //ACTIVE DEBUG GRAPHIC MODE
    debugIndex!: number;
    debugText: string = "debug";
    isActiveDebug!: Boolean;

    aspectRatio = 0.75;
    camera!: CameraData;
    deviceData: any;
    direction!: directionImage;
    errorFace!: ErrorFace | null;
    face!: FaceData;
    lastFace: any;
    marginX!: number;
    marginY!: number;
    response!: ResponseData;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _httpWrapperService: HttpWrapperService,
        private _mediaStreamService: MediaStreamService,
        private _renderer: Renderer2,
        private _translocoService: TranslocoService,
        private _walletService: WalletService
    ) {
        this.deviceData = this._walletService.getDeviceData();

        this._debounceWindowResize = debounce(async () => {
            this.canNavigate.emit(false);

            await this._setMaxVideoDimensions();

            this._startNgxVideoInterval();
        }, 300);
    }

    async ngOnInit(): Promise<void> {
        await this._startDefaultValues();

        this._resizeUnlisten = this._renderer.listen("window", "resize", this._debounceWindowResize);

        this._walletService.faceapi$.pipe(takeUntil(this.unsubscriber$)).subscribe(async (isLoaded) => {
            this.canNavigate.emit(false);

            this.camera.isLoading = !isLoaded;

            if (!isLoaded) return;

            await this._setMaxVideoDimensions();

            this._startNgxVideoInterval();
        });
    }

    async ngOnDestroy(): Promise<void> {
        await this._mediaStreamService.stopAllStreams();

        this.canNavigate.emit(true);

        this._resizeUnlisten();
        this._killIntervals();

        this._debounceWindowResize.cancel();

        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    public get takePicture$(): Observable<void> {
        return this._takePicture.asObservable();
    }

    private _calculateDisplayDimensions() {
        const isLandscape = window.innerHeight < window.innerWidth;

        const maxAvailableHeight = Math.ceil(window.innerHeight * 0.7);
        const maxAvailableWidth = Math.ceil(window.innerWidth * 0.9);

        const targetAspectRatio = 16 / 9;

        if (isLandscape) {
            const maxHeight = Math.min(maxAvailableHeight, 1920);
            const calculatedWidth = Math.round(maxHeight * targetAspectRatio);
            const maxWidth = Math.min(maxAvailableWidth, 1920);

            return {
                isLandscape,
                height: maxHeight,
                width: Math.min(calculatedWidth, maxWidth),
            };
        } else {
            const maxHeight = Math.min(maxAvailableHeight, 1920);
            const calculatedWidth = Math.round(maxHeight * targetAspectRatio);
            const maxWidth = Math.min(maxAvailableWidth, 1080);

            return {
                isLandscape,
                height: maxHeight,
                width: Math.min(calculatedWidth, maxWidth),
            };
        }
    }

    private _checkVideoStreamReady = () => {
        const videoNgx = this.webcamRef?.nativeVideoElement;

        if (!videoNgx) return;

        clearInterval(this._intervals.checkNgxVideo);

        this._intervals.checkNgxVideo = null;

        videoNgx.addEventListener(
            "loadeddata",
            () => {
                this._startFaceDetectionInterval();
                this.canNavigate.emit(true);

                this._setVideoDimensions(videoNgx);
                this._drawOvalCenterAndMask();
            },
            { once: true }
        );

        this._setVideoDimensions(videoNgx);
        this._drawOvalCenterAndMask();
    };

    private _detectFace = () => {
        if (this.response.base64Image) {
            this._intervals.detectFace = clearInterval(this._intervals.detectFace);

            return;
        }

        this._takePicture.next();
    };

    private _drawOvalCenterAndMask(): void {
        const videoDim = this.camera.dimensions.video;
        const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;

        maskResultCanvas.height = videoDim.height;
        maskResultCanvas.width = videoDim.width;

        const ctx: CanvasRenderingContext2D = maskResultCanvas.getContext("2d");

        ctx.clearRect(0, 0, videoDim.width || 0, videoDim.height || 0);

        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.fillRect(0, 0, videoDim.width || 0, videoDim.height || 0);
        ctx.globalCompositeOperation = "destination-out";

        const { center, radius } = this.face.video || { center: { x: 0, y: 0 }, radius: { x: 0, y: 0 } };

        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.beginPath();
        ctx.ellipse(center?.x, center?.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.globalCompositeOperation = "source-over";
    }

    private _drawStatusOval(ctx: any, isOk?: any): void {
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

    private async _emitBiometricCapture(): Promise<any> {
        if (this.response.isLoading) return;

        this._loading({ result: true });

        const base64Image = this.response.base64Image?.replace(/^data:.*;base64,/, "") as string;
        const encryptedImage = await this._httpWrapperService.encryptMessage(base64Image);

        this.imageCaptured.emit(encryptedImage);
    }

    private _getCenterAndRadius = (height: number, width: number) => {
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

    private _inRange(value: number, min: number, max: number) {
        return value >= min && value <= max;
    }

    private _isFaceCentered(nose: any): void {
        const faceCenterX = nose.x;
        const faceCenterY = nose.y;

        const { center, margin } = this.face.real || { center: { x: 0, y: 0 }, margin: { x: 0, y: 0 } };

        const inRangeX = this._inRange(faceCenterX, center.x - margin.x, center.x + margin.x);
        const inRangeY = this._inRange(faceCenterY, center.y, center.y + margin.y * 2.5);

        const isFaceCentered = inRangeX && inRangeY;

        if (isFaceCentered) return;

        let direction = "";

        if (!inRangeX) direction += `${faceCenterX < center.x - margin.x ? "←" : "→"}`;
        if (!inRangeY) direction += `${faceCenterY < center.y ? "↓" : "↑"}`;

        this.errorFace = {
            canvas: direction,
            subtitle: this._translocoService.translate("liveness.center_your_face_subtitle"),
            title: this._translocoService.translate("liveness.center_your_face"),
        };
    }

    private _isFaceClose(landmarks: faceapi.FaceLandmarks68): void {
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

    private _killIntervals(): void {
        clearInterval(this._intervals.checkNgxVideo);
        clearInterval(this._intervals.detectFace);

        this._intervals = {};
    }

    private _loading(paramsLoading: any) {
        const { isLoading = true, start, result } = paramsLoading;
        const key: "camera" | "response" = (start && "camera") || (result && "response");

        if (!key || !this[key]) return;

        this[key].isLoading = isLoading;
    }

    private _startFaceDetectionInterval = (): void => {
        if (this._intervals.detectFace) {
            clearInterval(this._intervals.detectFace);

            this._intervals.detectFace = null;
        }

        this._intervals.detectFace = setInterval(this._detectFace, this.deviceData.time);
    };

    private _startNgxVideoInterval = (): void => {
        if (this._intervals.checkNgxVideo) {
            clearInterval(this._intervals.checkNgxVideo);

            this._intervals.checkNgxVideo = null;
        }

        this._intervals.checkNgxVideo = setInterval(this._checkVideoStreamReady, this.deviceData.time);
    };

    private _setDefaultCamera = () => {
        const displayDimensions = this._calculateDisplayDimensions();

        this.camera = {
            hasPermissions: true,
            isLoading: true,
            isLowQuality: false,
            configuration: {
                height: { ideal: displayDimensions.isLandscape ? 1080 : 1920 },
                width: { ideal: displayDimensions.isLandscape ? 1920 : 1080 },
                facingMode: FacingMode.USER,
                frameRate: { ideal: 30, max: 30 },
            },
            dimensions: {
                video: {
                    max: displayDimensions,
                },
            },
        };

        this._changeDetectorRef.markForCheck();
    };

    private _setDefaultDirections = () => {
        this.direction = {
            down: new Image(),
            left: new Image(),
            right: new Image(),
            up: new Image(),
        };

        this.direction.down.crossOrigin = "anonymous";
        this.direction.left.crossOrigin = "anonymous";
        this.direction.right.crossOrigin = "anonymous";
        this.direction.up.crossOrigin = "anonymous";

        this.direction.down.src = "https://cdn.verifik.co/web-sdk/images/down.png";
        this.direction.left.src = "https://cdn.verifik.co/web-sdk/images/left.png";
        this.direction.right.src = "https://cdn.verifik.co/web-sdk/images/right.png";
        this.direction.up.src = "https://cdn.verifik.co/web-sdk/images/up.png";
    };

    private _setDefaultFace = () => {
        this.face = {
            minHeight: 240,
            minPixels: 240,
            successPosition: 0,
            threshold: 0.25,
        };
    };

    private _setDefaultResponse = () => {
        this.response = {
            isLoading: false,
            isFailed: false,
        };
    };

    private _setImageOnCanvas = (canvas: any, inputImg: any, originalDim: any, resizeDim: any) => {
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

    private async _setMaxVideoDimensions(): Promise<void> {
        const displayDimensions = this._calculateDisplayDimensions();

        this.camera.isLoading = true;
        this._changeDetectorRef.markForCheck();

        return await new Promise((resolve) => {
            setTimeout(() => {
                this.camera.dimensions.video = {
                    max: displayDimensions,
                };

                this.camera.configuration = {
                    height: { ideal: displayDimensions.isLandscape ? 1080 : 1920 },
                    width: { ideal: displayDimensions.isLandscape ? 1920 : 1080 },
                    facingMode: FacingMode.USER,
                    frameRate: { ideal: 30, max: 30 },
                };

                this.camera.dimensions.result = undefined;
                this.camera.isLoading = false;

                this.webcamRef?.videoResize();

                this._changeDetectorRef.markForCheck();

                resolve();
            });
        });
    }

    private async _startDefaultValues() {
        this._setDefaultResponse();
        this._setDefaultCamera();
        this._setDefaultDirections();
        this._setDefaultFace();

        await this._setMaxVideoDimensions();
    }

    private _setResultDimensions(key: "real" | "result", height: number, width: number) {
        const { center, radius } = (this.face[key] = this._getCenterAndRadius(height, width));
        const dimensions = this.camera.dimensions[key];

        if (!dimensions) return;

        dimensions.height = height;
        dimensions.offsetY = 0;
        dimensions.width = Math.min(2.8 * radius.x, width);
        dimensions.offsetX = center.x - dimensions.width / 2;
    }

    private _setVideoDimensions(videoElement: HTMLVideoElement) {
        const actualWidth = videoElement.clientWidth;
        const actualHeight = videoElement.clientHeight;

        this.camera.dimensions.video.height = actualHeight;
        this.camera.dimensions.video.width = actualWidth;
        this.camera.dimensions.result = { height: 0, width: 0, offsetX: 0, offsetY: 0 };

        this._setResultDimensions("result", actualHeight, actualWidth);

        this.face.video = this._getCenterAndRadius(actualHeight, actualWidth);

        const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;

        maskResultCanvas.style.marginLeft = `0px`;
        maskResultCanvas.style.marginTop = `0px`;

        this._changeDetectorRef.markForCheck();
    }

    private _takePictureLiveness(img: any) {
        const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;
        const toSendCanvas = this.ToSendCanvasRef?.nativeElement;

        this._setImageOnCanvas(maskResultCanvas, img, this.camera.dimensions.real, this.camera.dimensions.result);
        this._setImageOnCanvas(toSendCanvas, img, this.camera.dimensions.real, this.camera.dimensions.real);

        this.response.base64Image = toSendCanvas.toDataURL("image/jpeg");

        this._emitBiometricCapture();
    }

    cameraError(error: WebcamInitError): void {
        this.canNavigate.emit(true);
        this.error.emit(error);

        if (!error.mediaStreamError || error.mediaStreamError.name !== "NotAllowedError") return;

        this._loading({ isLoading: false, start: true });
        this.camera.hasPermissions = false;
    }

    processImage(webcamImage: WebcamImage): void {
        if (!this._intervals.detectFace || this.response.base64Image) return;

        const img = new Image();

        img.src = webcamImage.imageAsDataUrl;

        img.onload = async () => {
            if (img.height < this.face.minHeight) {
                this.camera.isLowQuality = true;

                this.canNavigate.emit(true);

                this.error.emit({ error: "low_quality" });

                return;
            }

            try {
                this.camera.dimensions.real = { height: 0, width: 0, offsetX: 0, offsetY: 0 };

                this._setResultDimensions("real", img.height, img.width);

                this.face.real = this._getCenterAndRadius(img.height, img.width);

                const detection = await faceapi.detectAllFaces(img, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.2 })).withFaceLandmarks();
                const context = this.maskResultCanvasRef?.nativeElement.getContext("2d", { willReadFrequently: true });

                if (detection.length > 0) {
                    this.lastFace = detection[0];
                    this.errorFace = null;

                    this._drawOvalCenterAndMask();
                    this._isFaceCentered(this.lastFace.landmarks.getNose()[3]);
                    this._isFaceClose(this.lastFace.landmarks);
                    this._drawStatusOval(context, !this.errorFace);

                    !this.errorFace ? ++this.face.successPosition : (this.face.successPosition = 0);

                    if (!this.errorFace && this.face.successPosition > 2) {
                        this.face.successPosition = 0;
                        this._takePictureLiveness(img);

                        return;
                    }
                }

                this._changeDetectorRef.markForCheck();
            } catch (error: any) {
                alert(error.message);
            }
        };
    }
}
