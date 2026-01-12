import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@jsverse/transloco";
import * as faceapi from "@vladmandic/face-api";
import { WebcamComponent, WebcamImage, WebcamInitError, WebcamModule } from "ngx-webcam";
import { Observable, Subject, takeUntil } from "rxjs";

import { HttpWrapperService } from "app/http-wrapper.service";
import { ZelfKeysService } from "app/services/zelf-keys.service";
import { AuthService } from "app/services/auth.service";
import { ZelfLoaderComponent } from "app/zelf-loader/zelf-loader.component";
import { environment } from "environments/environment";
import { WalletService } from "../../../wallet.service";

@Component({
    imports: [
        CommonModule,
        FlexLayoutModule,
        FormsModule,
        MatButtonModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        RouterModule,
        TranslocoModule,
        WebcamModule,
        ZelfLoaderComponent,
    ],
    selector: "zelf-keys-password-biometrics",
    styleUrls: ["./zelf-keys-password-biometrics.component.scss"],
    templateUrl: "./zelf-keys-password-biometrics.component.html",
})
export class ZelfKeysPasswordBiometricsComponent implements OnInit, OnDestroy {
    @ViewChild("maskResult", { static: false }) public maskResultCanvasRef: ElementRef | undefined;
    @ViewChild("toSend", { static: false }) public ToSendCanvasRef: ElementRef | undefined;
    @ViewChild("webcam", { static: false }) public webcamRef?: WebcamComponent;

    @Input() isDecryptMode: boolean = false;
    @Output() canNavigate: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() error: EventEmitter<any> = new EventEmitter<any>();
    @Output() imageCaptured: EventEmitter<string> = new EventEmitter<string>();
    @Output() biometricsSuccess: EventEmitter<any> = new EventEmitter<any>();
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
        },
        configuration: {
            facingMode: "user",
            width: { ideal: 800 },
            height: { ideal: 600 },
        },
    };

    face = {
        video: { center: { x: 0, y: 0 }, radius: { x: 0, y: 0 }, margin: { x: 0, y: 0 } },
        real: { center: { x: 0, y: 0 }, radius: { x: 0, y: 0 }, margin: { x: 0, y: 0 } },
        minHeight: 200,
        minPixels: 200,
        successPosition: 0,
        threshold: 0.25,
    };

    response = {
        base64Image: "",
        isLoading: false,
    };
    errorFace: any = null;
    lastFace: any;
    passwordData: any = {};
    aspectRatio = 0.75;
    masterPassword: string = "";

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _httpWrapperService: HttpWrapperService,
        private _router: Router,
        private _walletService: WalletService,
        private _zelfKeysService: ZelfKeysService
    ) {}

    async ngOnInit(): Promise<void> {
        this._activatedRoute.queryParams.subscribe((params) => {
            if (params["passwordData"]) {
                try {
                    this.passwordData = JSON.parse(decodeURIComponent(params["passwordData"]));
                } catch (e) {
                    console.error("Error parsing password data:", e);
                }
            }
        });

        this._initializeBiometrics();
    }

    /**
     * Handle successful biometrics verification in decrypt mode
     */
    onBiometricsSuccess(faceBase64: string, password?: string): void {
        if (this.isDecryptMode) {
            this.biometricsSuccess.emit({
                faceBase64, // Send just the raw base64 string like store mode
                password: this.masterPassword || password,
            });
        }
    }

    /**
     * Handle biometrics cancellation in decrypt mode
     */
    onBiometricsCancel(): void {
        if (this.isDecryptMode) {
            this.biometricsCancel.emit();
        }
    }

    ngOnDestroy(): void {
        if (this._intervals.detectFace) {
            clearInterval(this._intervals.detectFace);
        }
        if (this._intervals.checkNgxVideo) {
            clearInterval(this._intervals.checkNgxVideo);
        }
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    get takePicture$(): Observable<void> {
        return this._takePicture.asObservable();
    }

    private async _initializeBiometrics(): Promise<void> {
        try {
            // Always wait for the wallet service to load the models
            this._walletService.faceapi$.pipe(takeUntil(this.unsubscriber$)).subscribe(async (isLoaded) => {
                if (!isLoaded) return;

                this.camera.isLoading = false;
                await this._setMaxVideoDimensions();
                this._startNgxVideoInterval();
            });
        } catch (error) {
            console.error("❌ Error initializing biometrics:", error);
            this.error.emit(error);
        }
    }

    private async _checkModelsLoaded(): Promise<boolean> {
        // This method is no longer needed since we use the wallet service observable
        return true;
    }

    private _waitForModels(): void {
        // This method is no longer needed since we use the wallet service observable
    }

    private _waitForFaceApi(): void {
        // This method is no longer needed since we use the wallet service observable
    }

    private async _setMaxVideoDimensions(): Promise<void> {
        const maxWidth = 800;
        const maxHeight = 600;

        // Set initial video dimensions
        this.camera.dimensions.video.width = maxWidth;
        this.camera.dimensions.video.height = maxHeight;

        // Set result dimensions
        this.camera.dimensions.result.width = maxWidth;
        this.camera.dimensions.result.height = maxHeight;

        // Initialize face dimensions
        this.face.video = this._getCenterAndRadius(maxHeight, maxWidth);

        this._changeDetectorRef.markForCheck();
    }

    private _getCenterAndRadius(
        height: number,
        width: number
    ): { center: { x: number; y: number }; radius: { x: number; y: number }; margin: { x: number; y: number } } {
        const center = {
            x: width / 2,
            y: height / 2,
        };

        const margin = {
            y: height * 0.05,
            x: 0,
        };

        margin.x = margin.y * 0.8;

        const radius = {
            y: height * 0.42,
            x: 0,
        };

        radius.x = radius.y * this.aspectRatio;

        if (radius.x * 2 >= width) {
            radius.x = width * 0.48;
            radius.y = radius.x / this.aspectRatio;
        }

        return { center, radius, margin };
    }

    private _setResultDimensions(type: string, height: number, width: number): void {
        const dimensions = this.camera.dimensions[type as keyof typeof this.camera.dimensions] as any;
        if (!dimensions) return;

        dimensions.height = height;
        dimensions.offsetY = 0;
        dimensions.width = Math.min(2.8 * (this.face.real?.radius?.x || 0), width);
        dimensions.offsetX = (this.face.real?.center?.x || 0) - dimensions.width / 2;
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

    private _drawOvalCenterAndMask(): void {
        const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;
        if (!maskResultCanvas) {
            return;
        }

        const ctx = maskResultCanvas.getContext("2d");
        if (!ctx) {
            return;
        }

        const videoDim = this.camera.dimensions.video;
        if (!videoDim.width || !videoDim.height) {
            return;
        }
        maskResultCanvas.width = videoDim.width;
        maskResultCanvas.height = videoDim.height;

        const { center, radius } = this.face.video || { center: { x: 0, y: 0 }, radius: { x: 0, y: 0 } };

        ctx.clearRect(0, 0, maskResultCanvas.width, maskResultCanvas.height);

        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.fillRect(0, 0, maskResultCanvas.width, maskResultCanvas.height);

        ctx.globalCompositeOperation = "destination-out";

        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.beginPath();
        ctx.ellipse(center.x, center.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
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
            subtitle: "Center your face in the oval",
            title: "Center your face",
        };
    }

    private _isFaceClose(landmarks: any): void {
        const realDim = this.camera.dimensions.real || { height: 0, width: 0 };
        const totalFaceArea = landmarks.imageHeight * landmarks.imageWidth;
        const totalImageArea = realDim.height * realDim.width;
        const faceProportion = totalFaceArea / totalImageArea;

        if (faceProportion < this.face.threshold || landmarks.imageHeight < this.face.minPixels || landmarks.imageWidth < this.face.minPixels) {
            this.errorFace = {
                title: "Get closer",
                subtitle: "Move your face closer to the camera",
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
        }, 100);
    }

    private async _detectFace(): Promise<void> {
        const videoNgx = this.webcamRef?.nativeVideoElement;
        if (!videoNgx || this.response.base64Image) {
            return;
        }

        try {
            const detection = await faceapi.detectAllFaces(videoNgx, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.2 })).withFaceLandmarks();

            const context = this.maskResultCanvasRef?.nativeElement.getContext("2d", { willReadFrequently: true });
            if (!context) return;

            // Always redraw the base oval mask first
            this._drawOvalCenterAndMask();

            if (detection.length > 0) {
                this.lastFace = detection[0];
                this.errorFace = null;

                // Set real dimensions for face positioning calculations
                this.camera.dimensions.real = {
                    height: videoNgx.videoHeight,
                    width: videoNgx.videoWidth,
                    offsetX: 0,
                    offsetY: 0,
                };
                this.face.real = this._getCenterAndRadius(videoNgx.videoHeight, videoNgx.videoWidth);

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

                if (this.face.successPosition > 2) {
                    // Capture after 3 successful frames
                    this.face.successPosition = 0;
                    this._takePicture.next(); // Trigger image capture
                    clearInterval(this._intervals.detectFace); // Stop detection after capture
                }
            } else {
                this.face.successPosition = 0;
                this.errorFace = {
                    title: "No face detected",
                    subtitle: "Please look at the camera",
                };
                // Draw red oval if no face detected
                this._drawStatusOval(context, false);
            }

            this._changeDetectorRef.markForCheck();
        } catch (error: any) {
            console.error("Face detection error:", error);
            this.error.emit(error);
            const context = this.maskResultCanvasRef?.nativeElement.getContext("2d");
            if (context) this._drawStatusOval(context, false);
        }
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

            if (this.isDecryptMode) {
                // In decrypt mode, emit the biometric data to the parent component
                this.onBiometricsSuccess(base64Data);
            } else {
                // In create mode, store the new password
                const payload = {
                    website: this.passwordData.url,
                    username: this.passwordData.email,
                    password: this.passwordData.password,
                    notes: this.passwordData.notes,
                    name: this.passwordData.title,
                    faceBase64: base64Data,
                };

                const token = await this._authService.checkAccessToken();
                const response = await this._httpWrapperService.sendRequest("post", `${environment.apiUrl}/api/zelf-keys/store/password`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                this.imageCaptured.emit(this.response.base64Image);

                this._router.navigate(["/zelf-keys/passwords/result"], {
                    queryParams: {
                        result: JSON.stringify(response),
                        passwordData: encodeURIComponent(JSON.stringify(this.passwordData)),
                    },
                });
            }
        } catch (error) {
            console.error("Error in biometric capture:", error);
            this.error.emit(error);
        }
    }

    cameraError(error: WebcamInitError): void {
        console.error("Camera error:", error);
        this.canNavigate.emit(true);
        this.error.emit(error);

        if (!error.mediaStreamError || error.mediaStreamError.name !== "NotAllowedError") return;

        this.camera.hasPermissions = false;
    }

    processImage(webcamImage: WebcamImage): void {
        if (this.response.base64Image) {
            return;
        }

        const img = new Image();
        img.src = webcamImage.imageAsDataUrl;

        img.onload = async () => {
            if (img.height < this.face.minHeight) {
                this.camera.isLowQuality = true;
                this.canNavigate.emit(true);
                this.error.emit({ error: "low_quality" });
                return;
            }

            // This is for capturing the final image after successful liveness detection
            this._takePictureLiveness(img);
        };
    }

    onBack(): void {
        if (this.isDecryptMode) {
            // In decrypt mode, emit cancel event
            this.onBiometricsCancel();
        } else {
            // In create mode, navigate back to password form
            this._router.navigate(["/zelf-keys/passwords/new"], {
                queryParams: { passwordData: encodeURIComponent(JSON.stringify(this.passwordData)) },
            });
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

    private _startNgxVideoInterval = (): void => {
        if (this._intervals.checkNgxVideo) {
            clearInterval(this._intervals.checkNgxVideo);

            this._intervals.checkNgxVideo = null;
        }

        this._intervals.checkNgxVideo = setInterval(this._checkVideoStreamReady, 100);
    };
}
