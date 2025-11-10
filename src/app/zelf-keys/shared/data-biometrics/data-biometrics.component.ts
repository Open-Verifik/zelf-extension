import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import * as faceapi from "@vladmandic/face-api";
import { WebcamComponent, WebcamImage, WebcamInitError, WebcamModule } from "ngx-webcam";
import { Observable, Subject, takeUntil } from "rxjs";

import { HttpWrapperService } from "app/http-wrapper.service";
import { ZelfKeysService } from "app/services/zelf-keys.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { WalletService } from "../../../wallet.service";

export interface BiometricData {
    faceBase64: string;
    password?: string;
    retrievedData?: any;
}

@Component({
    selector: "data-biometrics",
    standalone: true,
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        TranslocoModule,
        WebcamModule,
        ZelfLoaderComponent,
    ],
    templateUrl: "./data-biometrics.component.html",
    styleUrls: ["./data-biometrics.component.scss"],
})
export class DataBiometricsComponent implements OnInit, OnDestroy {
    @ViewChild("maskResult", { static: false }) public maskResultCanvasRef: ElementRef | undefined;
    @ViewChild("toSend", { static: false }) public ToSendCanvasRef: ElementRef | undefined;
    @ViewChild("webcam", { static: false }) public webcamRef?: WebcamComponent;
    @ViewChild("dataBiometricsContainer", { static: false }) public dataBiometricsContainerRef?: ElementRef;

    @Input() isDecryptMode: boolean = false;
    @Input() itemData: any = {};

    @Output() biometricsSuccess: EventEmitter<BiometricData> = new EventEmitter<BiometricData>();
    @Output() biometricsCancel: EventEmitter<void> = new EventEmitter<void>();

    private unsubscriber$: Subject<void> = new Subject<void>();
    private _takePicture: Subject<void> = new Subject<void>();
    private _intervals: any = {};

    // Camera and face detection properties
    camera = {
        isLoading: true,
        hasPermissions: true,
        isLowQuality: false,
        dimensions: {
            video: { width: 0, height: 0, max: { width: 800, height: 600 } },
            result: { width: 0, height: 0, offsetX: 0, offsetY: 0 },
            real: { width: 0, height: 0, offsetX: 0, offsetY: 0 },
        } as { [key: string]: { width: number; height: number; offsetX?: number; offsetY?: number; max?: { width: number; height: number } } },
        configuration: {
            facingMode: "user",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
        },
    };

    face = {
        video: { center: { x: 0, y: 0 }, radius: { x: 0, y: 0 }, margin: { x: 0, y: 0 } },
        real: { center: { x: 0, y: 0 }, radius: { x: 0, y: 0 }, margin: { x: 0, y: 0 } },
        minHeight: 150, // Reduced from 200
        minPixels: 150, // Reduced from 200
        successPosition: 0,
        threshold: 0.15, // Reduced from 0.25 (lower = less strict)
    };

    response = {
        base64Image: "",
        isLoading: false,
    };
    errorFace: any = null;
    lastFace: any;
    masterPassword: string = "";

    // Error handling
    apiError: string = "";
    hasApiError: boolean = false;

    // Category-specific properties
    dataType: string = "";
    dataTitle: string = "";

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _httpWrapperService: HttpWrapperService,
        private _translocoService: TranslocoService,
        private _walletService: WalletService,
        private _zelfKeysService: ZelfKeysService
    ) {}

    async ngOnInit(): Promise<void> {
        // Determine data type from itemData if available, otherwise default to password
        if (this.itemData?.publicData?.type) {
            this.dataType = this.itemData.publicData.type;
        } else if (this.itemData?.type) {
            this.dataType = this.itemData.type;
        } else {
            this.dataType = "passwords";
        }

        // Set data title based on type
        switch (this.dataType) {
            case "notes":
                this.dataTitle = this._translocoService.translate("zelf_keys.data_types.note");
                break;
            case "payment-cards":
                this.dataTitle = this._translocoService.translate("zelf_keys.data_types.payment_card");
                break;
            case "passwords":
            default:
                this.dataTitle = this._translocoService.translate("zelf_keys.data_types.password");
                break;
        }

        // Set master password if available in itemData
        if (this.itemData?.masterPassword) {
            this.masterPassword = this.itemData.masterPassword;
        }

        this._initializeBiometrics();
    }

    ngOnDestroy(): void {
        if (this._intervals.detectFace) clearInterval(this._intervals.detectFace);
        if (this._intervals.checkNgxVideo) clearInterval(this._intervals.checkNgxVideo);

        this._stopCamera();

        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    get takePicture$(): Observable<void> {
        return this._takePicture.asObservable();
    }

    /**
     * Handle biometrics cancellation in both decrypt and create modes
     */
    onBiometricsCancel(): void {
        this._stopCamera();

        this.biometricsCancel.emit();
    }

    /**
     * Stop camera stream and cleanup
     */
    private _stopCamera(): void {
        try {
            if (!this.webcamRef) return;

            const videoElement = this.webcamRef.nativeVideoElement;

            if (!videoElement || !videoElement.srcObject) return;

            const stream = videoElement.srcObject as MediaStream;

            if (!stream) return;

            stream.getTracks().forEach((track) => track.stop());

            videoElement.srcObject = null;
        } catch (error) {
            console.warn("Error stopping camera:", error);
        }
    }

    /**
     * Clear API error and retry
     */
    clearApiError(): void {
        this.apiError = "";
        this.hasApiError = false;
        this.response.isLoading = false;
        this.response.base64Image = "";
        this._changeDetectorRef.markForCheck();

        // Restart face detection
        this._startFaceDetectionInterval();
    }

    private async _initializeBiometrics(): Promise<void> {
        try {
            // Always wait for the wallet service to load the models
            this._walletService.faceapi$.pipe(takeUntil(this.unsubscriber$)).subscribe(async (isLoaded) => {
                this.camera.isLoading = !isLoaded;

                if (!isLoaded) return;

                await this._setMaxVideoDimensions();
                this._setupResizeListener();
                this._startNgxVideoInterval();
            });
        } catch (error) {
            console.error("❌ Error initializing biometrics:", error);
        }
    }

    private _setupResizeListener(): void {
        // Use the exact same debounced approach as working version
        let resizeTimeout: any;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(async () => {
                await this._setMaxVideoDimensions();
                this._startNgxVideoInterval();
            }, 300);
        });
    }

    private _startNgxVideoInterval(): void {
        if (this._intervals.checkNgxVideo) {
            clearInterval(this._intervals.checkNgxVideo);

            this._intervals.checkNgxVideo = null;
        }

        this._intervals.checkNgxVideo = setInterval(this._checkVideoStreamReady, 100);
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
                this._setVideoDimensions(videoNgx);
                this._drawOvalCenterAndMask();
            },
            { once: true }
        );

        this._setVideoDimensions(videoNgx);
        this._drawOvalCenterAndMask();
    };

    private _setVideoDimensions(videoElement: HTMLVideoElement) {
        const actualWidth = videoElement.clientWidth;
        const actualHeight = videoElement.clientHeight;

        this.camera.dimensions.video.height = actualHeight;
        this.camera.dimensions.video.width = actualWidth;
        this.camera.dimensions.result = { height: 0, width: 0, offsetX: 0, offsetY: 0 };

        this._setResultDimensions("result", actualHeight, actualWidth);

        this.face.video = this._getCenterAndRadius(actualHeight, actualWidth);

        const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;

        if (maskResultCanvas) {
            maskResultCanvas.style.marginLeft = `0px`;
            maskResultCanvas.style.marginTop = `0px`;
        }

        this._changeDetectorRef.markForCheck();
    }

    private _calculateDisplayDimensions() {
        // Get the bottom sheet container
        const bottomSheetElement = document.querySelector(".zelf-bottom-sheet-biometrics");
        if (!bottomSheetElement) return { isLandscape: false, width: 0, height: 0 };

        // Get exact container dimensions
        const containerHeight = bottomSheetElement.clientHeight;
        const containerWidth = bottomSheetElement.clientWidth;

        // Always use landscape calculation with conservative height
        const availableWidth = containerWidth * 0.9; // 90% of width
        const availableHeight = containerHeight * 0.7; // 70% of height

        const targetAspectRatio = 16 / 9;

        // Always calculate as landscape - start with height and calculate width
        let finalHeight = availableHeight;
        let finalWidth = finalHeight * targetAspectRatio;

        // If width exceeds available space, scale down based on width
        if (finalWidth > availableWidth) {
            finalWidth = availableWidth;
            finalHeight = finalWidth / targetAspectRatio;
        }

        // Round to prevent subpixel rendering issues
        finalWidth = Math.floor(finalWidth);
        finalHeight = Math.floor(finalHeight);

        return {
            isLandscape: true, // Always treat as landscape
            width: finalWidth,
            height: finalHeight,
        };
    }

    private async _setMaxVideoDimensions(): Promise<void> {
        const displayDimensions = this._calculateDisplayDimensions();

        this.camera.isLoading = true;
        this._changeDetectorRef.markForCheck();

        return await new Promise((resolve) => {
            setTimeout(() => {
                // Set the video dimensions directly
                this.camera.dimensions.video.width = displayDimensions.width;
                this.camera.dimensions.video.height = displayDimensions.height;
                this.camera.dimensions.video.max = {
                    width: displayDimensions.width,
                    height: displayDimensions.height,
                };

                this.camera.configuration = {
                    height: { ideal: 1080 }, // Always use landscape height
                    width: { ideal: 1920 }, // Always use landscape width
                    facingMode: "user",
                };

                this.camera.dimensions.result = { height: 0, width: 0, offsetX: 0, offsetY: 0 };
                this.camera.isLoading = false;

                this.webcamRef?.videoResize();

                this._changeDetectorRef.markForCheck();

                resolve();
            });
        });
    }

    private _getCenterAndRadius(
        height: number,
        width: number
    ): { center: { x: number; y: number }; radius: { x: number; y: number }; margin: { x: number; y: number } } {
        const aspectRatio = 0.75; // Match working version

        const data = {
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
        data.radius.x = data.radius.y * aspectRatio;

        if (data.radius.x * 2 >= width) {
            data.radius.x = width * 0.48;
            data.radius.y = data.radius.x / aspectRatio;
        }

        return data;
    }

    private _setResultDimensions(type: string, height: number, width: number): void {
        const dimensions = this.camera.dimensions[type as keyof typeof this.camera.dimensions] as any;

        if (!dimensions) return;

        dimensions.height = height;
        dimensions.offsetY = 0;
        dimensions.width = Math.min(2.8 * (this.face.real?.radius?.x || 0), width);
        dimensions.offsetX = (this.face.real?.center?.x || 0) - dimensions.width / 2;
    }

    private _drawOvalCenterAndMask(): void {
        const videoDim = this.camera.dimensions.video;
        const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;

        if (!maskResultCanvas || !videoDim.width || !videoDim.height) return;

        maskResultCanvas.height = videoDim.height;
        maskResultCanvas.width = videoDim.width;

        const ctx: CanvasRenderingContext2D = maskResultCanvas.getContext("2d");

        if (!ctx) return;

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

    private _drawStatusOval(ctx: any, isOk: boolean): void {
        const { center, radius } = this.face.video || { center: { x: 0, y: 0 }, radius: { x: 0, y: 0 } };

        ctx.beginPath();
        ctx.ellipse(center.x, center.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
        ctx.lineWidth = 5;
        ctx.strokeStyle = isOk ? "green" : "red";
        ctx.stroke();
        ctx.closePath();
    }

    private _inRange(value: number, min: number, max: number): boolean {
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
            subtitle: this._translocoService.translate("zelf_keys.biometrics.status.position_face_subtitle"),
            title: this._translocoService.translate("zelf_keys.biometrics.status.position_face_title"),
        };
    }

    private _isFaceClose(landmarks: any): void {
        const realDim = this.camera.dimensions.real || { height: 0, width: 0 };
        const totalFaceArea = landmarks.imageHeight * landmarks.imageWidth;
        const totalImageArea = realDim.height * realDim.width;
        const faceProportion = totalFaceArea / totalImageArea;

        if (faceProportion < this.face.threshold || landmarks.imageHeight < this.face.minPixels || landmarks.imageWidth < this.face.minPixels) {
            this.errorFace = {
                title: this._translocoService.translate("liveness.get_closer"),
                subtitle: this._translocoService.translate("liveness.get_closer_subtitle"),
            };
        }
    }

    private _startFaceDetectionInterval(): void {
        if (this._intervals.detectFace) {
            clearInterval(this._intervals.detectFace);
            this._intervals.detectFace = null;
        }

        this._intervals.detectFace = setInterval(() => {
            this._detectFace();
        }, 200); // Reduced from 100ms to 200ms for better performance
    }

    private async _detectFace(): Promise<void> {
        const videoNgx = this.webcamRef?.nativeVideoElement;

        if (!videoNgx || this.response.base64Image) return;

        // Early return if video is not ready
        if (videoNgx.readyState !== 4) {
            return;
        }

        try {
            // Use higher confidence threshold for better performance
            const detection = await faceapi.detectAllFaces(videoNgx, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.4 })).withFaceLandmarks();

            const context = this.maskResultCanvasRef?.nativeElement.getContext("2d", { willReadFrequently: true });

            if (!context) return;

            if (detection.length > 0) {
                this.lastFace = detection[0];
                this.errorFace = null;
                this._changeDetectorRef.markForCheck();

                // Set real dimensions for face positioning calculations (only if changed)
                if (!this.camera.dimensions.real.width || this.camera.dimensions.real.width !== videoNgx.videoWidth) {
                    this.camera.dimensions.real = {
                        height: videoNgx.videoHeight,
                        width: videoNgx.videoWidth,
                        offsetX: 0,
                        offsetY: 0,
                    };

                    this.face.real = this._getCenterAndRadius(videoNgx.videoHeight, videoNgx.videoWidth);

                    this._drawOvalCenterAndMask();
                }

                // Check face positioning
                this._isFaceCentered(this.lastFace.landmarks.getNose()[3]);
                this._isFaceClose(this.lastFace.landmarks);

                // Draw status oval (green if no errors, red if errors)
                this._drawStatusOval(context, !this.errorFace);

                if (!this.errorFace) {
                    ++this.face.successPosition;
                } else {
                    this.face.successPosition = 0;
                }

                if (this.face.successPosition > 0) {
                    // Capture after 1 successful frame (very responsive)
                    this.face.successPosition = 0;

                    this._takePicture.next(); // Trigger image capture

                    clearInterval(this._intervals.detectFace); // Stop detection after capture

                    this._changeDetectorRef.markForCheck();
                }
            } else {
                this.face.successPosition = 0;
                this.errorFace = {
                    title: this._translocoService.translate("zelf_keys.biometrics.errors.no_face_detected"),
                    subtitle: this._translocoService.translate("zelf_keys.biometrics.errors.look_at_camera"),
                };
                this._changeDetectorRef.markForCheck();

                this._drawOvalCenterAndMask();
                this._drawStatusOval(context, false);
            }

            this._changeDetectorRef.markForCheck();
        } catch (error: any) {
            console.error("Face detection error:", error);
            this._changeDetectorRef.markForCheck();

            const context = this.maskResultCanvasRef?.nativeElement.getContext("2d");

            if (context) this._drawStatusOval(context, false);
        }
    }

    private _setImageOnCanvas(canvas: HTMLCanvasElement, img: HTMLImageElement, dimensions: any, resultDimensions: any): void {
        const context = canvas.getContext("2d");

        if (!context) return;

        canvas.width = resultDimensions.width;
        canvas.height = resultDimensions.height;

        context.drawImage(
            img,
            dimensions.offsetX,
            dimensions.offsetY,
            dimensions.width,
            dimensions.height,
            0,
            0,
            resultDimensions.width,
            resultDimensions.height
        );
    }

    private _takePictureLiveness(img: HTMLImageElement): void {
        const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;
        const toSendCanvas = this.ToSendCanvasRef?.nativeElement;

        if (!maskResultCanvas || !toSendCanvas) return;

        if (!this.camera.dimensions.real || !this.camera.dimensions.result) {
            console.error("Camera dimensions not properly initialized");
            return;
        }

        this._setImageOnCanvas(maskResultCanvas, img, this.camera.dimensions.real, this.camera.dimensions.result);
        this._setImageOnCanvas(toSendCanvas, img, this.camera.dimensions.real, this.camera.dimensions.real);

        this.response.base64Image = toSendCanvas.toDataURL("image/jpeg");
        this.response.isLoading = true;

        this._emitBiometricCapture();
    }

    private async _emitBiometricCapture(): Promise<void> {
        try {
            const base64Data = this.response.base64Image.split(",")[1];
            const encryptedFaceBase64 = await this._httpWrapperService.encryptMessage(base64Data);

            // For both encrypt and decrypt modes, emit encrypted faceBase64 and password
            // The parent component (biometrics-bottom-sheet) will handle retrieval for decrypt mode
            this._stopCamera();
            this.biometricsSuccess.emit({
                faceBase64: encryptedFaceBase64,
                password: this.masterPassword,
            });
        } catch (error) {
            console.error("Error in biometric capture:", error);
            this.response.isLoading = false;
            this.response.base64Image = "";

            this._changeDetectorRef.markForCheck();
        }
    }

    cameraError(error: WebcamInitError): void {
        console.error("Camera error:", error);

        if (!error.mediaStreamError || error.mediaStreamError.name !== "NotAllowedError") return;

        this.camera.hasPermissions = false;
    }

    processImage(webcamImage: WebcamImage): void {
        if (this.response.base64Image) return;

        const img = new Image();

        img.src = webcamImage.imageAsDataUrl;

        img.onload = async () => {
            if (img.height < this.face.minHeight) {
                this.camera.isLowQuality = true;
                return;
            }

            this._takePictureLiveness(img);
        };
    }

    onBack(): void {
        this.onBiometricsCancel();
    }

    // Helper methods for UI
    getDataTypeTitle(): string {
        return this.dataTitle;
    }
}
