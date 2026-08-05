import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import * as faceapi from "@vladmandic/face-api";
import { WebcamComponent, WebcamImage, WebcamInitError, WebcamModule } from "ngx-webcam";
import { Observable, Subject, takeUntil } from "rxjs";

import { ChromeService } from "app/chrome.service";
import { HttpWrapperService } from "app/http-wrapper.service";
import { AuthService } from "app/services/auth.service";
import { ErrorService } from "app/services/error.service";
import { ZelfKeysService } from "app/services/zelf-keys.service";
import { TagModel } from "app/tags.service";
import { ThemeService } from "app/theme.service";
import { VaultService } from "app/vault.service";
import { PopoutCommunicationService } from "../services/popout-communication.service";
import { WalletService } from "../wallet.service";

export interface BiometricData {
    faceBase64: string;
    password?: string;
    retrievedData?: any;
}

@Component({
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        RouterModule,
        TranslocoModule,
        WebcamModule,
    ],
    selector: "popout-decryptor",
    styleUrls: ["./popout-decryptor.component.scss"],
    templateUrl: "./popout-decryptor.component.html",
})
export class PopoutDecryptorComponent implements OnInit, OnDestroy {
    @ViewChild("maskResult", { static: false }) public maskResultCanvasRef: ElementRef | undefined;
    @ViewChild("toSend", { static: false }) public ToSendCanvasRef: ElementRef | undefined;
    @ViewChild("webcam", { static: false }) public webcamRef?: WebcamComponent;

    @Input() mode: "popup" | "embedded" = "popup";

    @Output() close = new EventEmitter<void>();
    @Output() decryptedData = new EventEmitter<any>();

    private _destroy$ = new Subject<void>();
    private _intervals: any = {};
    private _takePicture$ = new Subject<void>();

    aspectRatio = 0.75;

    camera = {
        isLoading: true,
        hasPermissions: true,
        isLowQuality: false,
        dimensions: {
            video: { width: 0, height: 0, max: { width: 400, height: 300 } },
            real: { width: 0, height: 0, offsetX: 0, offsetY: 0 },
        } as { [key: string]: { width: number; height: number; offsetX?: number; offsetY?: number; max?: { width: number; height: number } } },
        configuration: {
            facingMode: "user",
            width: { ideal: 1920 },
            height: { ideal: 1080 },
        },
    };

    error: string | null = null;
    errorFace: any = null;

    face = {
        video: { center: { x: 0, y: 0 }, radius: { x: 0, y: 0 }, margin: { x: 0, y: 0 } },
        real: { center: { x: 0, y: 0 }, radius: { x: 0, y: 0 }, margin: { x: 0, y: 0 } },
        minHeight: 80,
        minPixels: 80,
        successPosition: 0,
        threshold: 0.1,
    };

    lastFace: any;
    record: any = {};

    response = {
        base64Image: "",
        isLoading: false,
    };

    wallet!: Partial<TagModel>;

    constructor(
        private _authService: AuthService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _chromeService: ChromeService,
        private _errorService: ErrorService,
        private _httpWrapperService: HttpWrapperService,
        private _popoutCommunicationService: PopoutCommunicationService,
        private _router: Router,
        private _themeService: ThemeService,
        private _translocoService: TranslocoService,
        private _vaultService: VaultService,
        private _walletService: WalletService,
        private _zelfKeysService: ZelfKeysService
    ) {
        this._getRecordForDecryptingFromService();
        this._initializeDecryptionData();
        this._initializeBiometrics();
    }

    async ngOnInit(): Promise<void> {
        this._getRecordForDecryptingFromService();

        await this._setWallet();

        this._setupCloseMessageListener();
    }

    ngOnDestroy(): void {
        if (this._intervals.detectFace) clearInterval(this._intervals.detectFace);
        if (this._intervals.checkNgxVideo) clearInterval(this._intervals.checkNgxVideo);

        this._popoutCommunicationService.clearDecryptionData();

        this._stopCamera();

        this._destroy$.next();
        this._destroy$.complete();
    }

    get dataTypeIcon(): string {
        switch (this.recordType) {
            case "note":
            case "notes":
                return "note";
            case "credit_card":
            case "payment-card":
                return "credit_card";
            case "zotp":
                return "key";
            case "wallet":
                return "wallet";
            default:
                return "lock";
        }
    }

    get recordType(): string {
        return this.record?.type || "password";
    }

    get takePicture$(): Observable<void> {
        return this._takePicture$.asObservable();
    }

    private async _setWallet(): Promise<any> {
        const wallet = await this._walletService.getFirstWalletFromStorage();

        if (!wallet?.name) {
            this._router.navigate(["/welcome"]);

            return;
        }

        this.wallet = wallet;

        this._changeDetectorRef.detectChanges();
    }

    private _checkVideoStreamReady(): void {
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
    }

    private _closeDecryptor(): void {
        try {
            this._stopCamera();
            this.close.emit();

            if (this.mode === "embedded") return;

            window.close();
        } catch (error) {
            console.warn("Error closing popup:", error);
        }
    }

    private async _detectFace(): Promise<void> {
        const videoNgx = this.webcamRef?.nativeVideoElement;

        if (!videoNgx || this.response.base64Image) return;

        try {
            const detection = await faceapi.detectAllFaces(videoNgx, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.2 })).withFaceLandmarks();
            const context = this.maskResultCanvasRef?.nativeElement.getContext("2d", { willReadFrequently: true });

            if (!context) return;

            this._drawOvalCenterAndMask();

            if (detection.length > 0) {
                this.lastFace = detection[0];
                this.errorFace = null;

                this.camera.dimensions.real = {
                    height: videoNgx.videoHeight,
                    width: videoNgx.videoWidth,
                    offsetX: 0,
                    offsetY: 0,
                };

                this.face.real = this._getCenterAndRadius(videoNgx.videoHeight, videoNgx.videoWidth);

                this._isFaceCentered(this.lastFace.landmarks.getNose()[3]);
                this._isFaceClose(this.lastFace.landmarks);

                this._drawStatusOval(context, !this.errorFace);

                if (!this.errorFace) {
                    ++this.face.successPosition;
                } else {
                    this.face.successPosition = 0;
                }

                if (this.face.successPosition > 0) {
                    this.face.successPosition = 0;
                    this._takePicture$.next();

                    clearInterval(this._intervals.detectFace);
                }
            } else {
                this.face.successPosition = 0;

                this.errorFace = {
                    icon: "face",
                    title: "No face detected",
                    subtitle: "Please look at the camera",
                };

                this._drawStatusOval(context, false);
            }

            this._changeDetectorRef.markForCheck();
        } catch (error: any) {
            console.error("Face detection error:", error);

            const context = this.maskResultCanvasRef?.nativeElement.getContext("2d");

            if (context) this._drawStatusOval(context, false);
        }
    }

    private _drawOvalCenterAndMask(): void {
        const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;

        if (!maskResultCanvas) return;

        const ctx = maskResultCanvas.getContext("2d");

        if (!ctx) return;

        const videoDim = this.camera.dimensions.video;

        if (!videoDim.width || !videoDim.height) return;

        maskResultCanvas.width = videoDim.width;
        maskResultCanvas.height = videoDim.height;

        const { center, radius } = this.face.video || { center: { x: 0, y: 0 }, radius: { x: 0, y: 0 } };

        ctx.clearRect(0, 0, maskResultCanvas.width, maskResultCanvas.height);

        ctx.fillStyle = this._themeService.getCurrentThemeMaskColor();
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
        ctx.lineWidth = 3;
        ctx.strokeStyle = isOk ? "green" : "red";
        ctx.stroke();
        ctx.closePath();
    }

    private async _emitBiometricCapture(): Promise<void> {
        try {
            const base64Data = this.response.base64Image.split(",")[1];
            const result = await this._retrieveEncryptedRecord(base64Data);

            this._handleDecryptionSuccess(result);
        } catch (error) {
            console.error("Error in biometric capture:", error);

            this._handleError(error);
        }
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
            y: height * 0.35,
            x: 0,
        };

        radius.x = radius.y * this.aspectRatio;

        if (radius.x * 2 >= width) {
            radius.x = width * 0.48;
            radius.y = radius.x / this.aspectRatio;
        }

        return { center, radius, margin };
    }

    private _getRecordForDecryptingFromService(): void {
        const popoutData = this._popoutCommunicationService.getDecryptionData();

        this.record = this._normalizeDecryptionRecord(popoutData);
    }

    private _normalizeDecryptionRecord(data: any): Record<string, any> {
        if (!data) return {};

        const type = data.type || data.publicData?.type || "password";
        const zelfProof = data.zelfProof || data.publicData?.zelfProof || "";

        return {
            ...data,
            type,
            zelfProof,
            publicData: data.publicData || {},
        };
    }

    private _handleDecryptionSuccess(result: any): void {
        this._popoutCommunicationService.setDecryptionResult(result);

        if (this.mode === "embedded") {
            this.decryptedData.emit(result);
        } else {
            this._sendDecryptionResultToBackground(result);
        }

        this._closeDecryptor();
    }

    private _handleError(error: any): void {
        const rawMessage = typeof error?.message === "string" ? error.message : "";

        if (rawMessage === "User cancelled decryption") {
            this._closeDecryptor();
            return;
        }

        const errorKey = this._errorService.resolveErrorKey(error);
        const translatedMessage = this._errorService.translateErrorMessage(errorKey);

        if (errorKey.includes("failed_to_decrypt") || errorKey.includes("encryption_key_didnt_match")) {
            this._logIdentifierDiagnostics(errorKey);
        }

        this.camera.isLoading = false;
        this.response.isLoading = false;
        this.response.base64Image = "";

        if (this._errorService.isLivenessError(errorKey)) {
            this.error = null;
            this.errorFace = {
                icon: "face",
                title: translatedMessage,
                subtitle: this._translocoService.translate("liveness.center_your_face_subtitle"),
            };

            this._resetBiometricSession();
            this._changeDetectorRef.detectChanges();

            return;
        }

        this.error = translatedMessage;
        this.errorFace = null;

        this._resetBiometricSession();
        this._changeDetectorRef.detectChanges();
    }

    private async _initializeBiometrics(): Promise<void> {
        try {
            this._walletService.faceapi$.pipe(takeUntil(this._destroy$)).subscribe(async (isLoaded) => {
                if (!isLoaded) return;

                this.camera.isLoading = false;

                await this._setMaxVideoDimensions();

                this._startNgxVideoInterval();
            });
        } catch (error) {
            console.error("Error initializing biometrics:", error);

            this._handleError(error);
        }
    }

    private _initializeDecryptionData(): void {
        this._popoutCommunicationService.decryptionData$.pipe(takeUntil(this._destroy$)).subscribe((data) => {
            if (!data) return;

            this.record = this._normalizeDecryptionRecord(data);
        });
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
            icon: "center_focus_strong",
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
                icon: "zoom_in",
                title: "Get closer",
                subtitle: "Move your face closer to the camera",
            };
        }
    }

    private async _retrieveEncryptedRecord(faceBase64: string): Promise<any> {
        try {
            if (!this.record.zelfProof) throw new Error("missing_zelf_proof");

            const base64Data = faceBase64.includes(",") ? faceBase64.split(",")[1] : faceBase64;
            const { publicKey: clientPublicKey, privateKey: clientPrivateKey } = await this._vaultService.generateEphemeralKeyPair();

            const payload = {
                faceBase64: await this._httpWrapperService.encryptMessage(base64Data),
                type: this.record.type,
                zelfProof: this.record.zelfProof,
                clientPublicKey,
            };

            const response = await this._zelfKeysService.retrieve(payload);

            await this._vaultService.setLastVerified();

            const encryptedMessage = response?.data?.pgp?.encryptedMessage;
            const { publicData } = response.data;

            let decryptedData: any = response?.data?.metadata || {};

            if (encryptedMessage) {
                const jsonData = await this._vaultService.decryptWithPrivateKey(encryptedMessage, clientPrivateKey);

                decryptedData = JSON.parse(jsonData);
                delete response?.data?.pgp;
            }

            if (!decryptedData) throw new Error("missing_decrypted_data");

            const resultData: any = {
                ...response?.data,
                ...decryptedData,
            };

            if (this.record.type === "password") {
                resultData.password = decryptedData.password || "";
                resultData.username = publicData.username || "";
                resultData.website = publicData?.website || "";
            } else if (this.record.type === "credit_card" || this.record.type === "payment-card") {
                resultData.number = decryptedData.cardNumber || "";
                resultData.cvv = decryptedData.cvv || "";
                resultData.expiryMonth = decryptedData.expiryMonth || "";
                resultData.expiryYear = decryptedData.expiryYear || "";
            } else if (this.record.type === "notes" || this.record.type === "note") {
                resultData.title = publicData.title || "";
                resultData.content = decryptedData.content || "";
            }

            return {
                success: true,
                data: resultData,
            };
        } catch (error) {
            this._handleError(error);

            throw error;
        }
    }

    private _sendDecryptionResultToBackground(result: any): void {
        try {
            if (typeof chrome !== "undefined" && chrome.runtime) {
                chrome.runtime.sendMessage({
                    type: "DECRYPTION_RESULT_FROM_POPOUT",
                    payload: {
                        requestId: this.record.requestId,
                        result: result,
                    },
                });
            }
        } catch (error) {
            console.error("Error sending decryption result to background:", error);
        }
    }

    private _drawCrop(
        canvas: HTMLCanvasElement,
        img: HTMLImageElement,
        src: { x: number; y: number; width: number; height: number },
        dst: { x?: number; y?: number; width: number; height: number }
    ): void {
        const context = canvas.getContext("2d");

        if (!context) return;

        canvas.width = dst.width;
        canvas.height = dst.height;

        context.drawImage(img, src.x, src.y, src.width, src.height, 0, 0, dst.width, dst.height);
    }

    /**
     * Compute the face-oval crop in both source (native video) and display coordinates.
     *
     * The live `<video>` element uses `object-fit: cover`, so the underlying source
     * frame is rendered with a uniform scale and the overflowing edges are clipped.
     * We replicate that mapping when cropping the captured frame so the preview canvas
     * and the to-send canvas share the same aspect ratio as what the user saw on screen
     * — otherwise the captured face gets stretched (egg-face).
     *
     * - `display` is the rectangle in popup coords (375x600). Used as the buffer for
     *   the preview canvas, rendered 1:1 by CSS.
     * - `original` is the corresponding rectangle in native source coords (e.g. 1920x1080),
     *   computed via the same single-scale + centered offset that `object-fit: cover` uses.
     *   `original` always has the same aspect as `display` so drawing `original -> display`
     *   is a pure uniform scale, no distortion.
     *
     * Returns `null` if face detection has not produced real dimensions yet.
     */
    private _computeOvalCrops(): {
        original: { x: number; y: number; width: number; height: number };
        display: { x: number; y: number; width: number; height: number };
    } | null {
        const videoDim = this.camera.dimensions.video;
        const realDim = this.camera.dimensions.real;

        if (!videoDim?.width || !videoDim?.height) return null;
        if (!realDim?.width || !realDim?.height) return null;

        const ovalRadiusX = this.face.video?.radius?.x || 0;
        const centerX = this.face.video?.center?.x ?? videoDim.width / 2;

        if (!ovalRadiusX) return null;

        const displayWidth = Math.min(2.8 * ovalRadiusX, videoDim.width);
        const display = {
            x: Math.max(0, centerX - displayWidth / 2),
            y: 0,
            width: displayWidth,
            height: videoDim.height,
        };

        // object-fit: cover math — uniform scale so the source fully covers the display
        // box, then the box is read out of the centered visible portion of the source.
        const coverScale = Math.max(videoDim.width / realDim.width, videoDim.height / realDim.height);
        const visibleSrcWidth = videoDim.width / coverScale;
        const visibleSrcHeight = videoDim.height / coverScale;
        const offsetSrcX = (realDim.width - visibleSrcWidth) / 2;
        const offsetSrcY = (realDim.height - visibleSrcHeight) / 2;

        const original = {
            x: offsetSrcX + display.x / coverScale,
            y: offsetSrcY + display.y / coverScale,
            width: display.width / coverScale,
            height: display.height / coverScale,
        };

        return { original, display };
    }

    /**
     * Optionally downscale a rect so that the longest edge does not exceed `maxEdge`.
     * Used to cap the to-send canvas size and reduce the base64 upload payload.
     */
    private _capRect(
        rect: { x: number; y: number; width: number; height: number },
        maxEdge: number
    ): { x: number; y: number; width: number; height: number } {
        const longest = Math.max(rect.width, rect.height);

        if (longest <= maxEdge) return rect;

        const scale = maxEdge / longest;

        return {
            x: rect.x,
            y: rect.y,
            width: Math.round(rect.width * scale),
            height: Math.round(rect.height * scale),
        };
    }

    private async _setMaxVideoDimensions(): Promise<void> {
        const popupWidth = 375;
        const popupHeight = 600;

        const viewportWidth = popupWidth;
        const viewportHeight = popupHeight;

        this.camera.dimensions.video.width = viewportWidth;
        this.camera.dimensions.video.height = viewportHeight;

        this.face.video = this._getCenterAndRadius(viewportHeight, viewportWidth);

        this._changeDetectorRef.markForCheck();
    }

    private _setupCloseMessageListener(): void {
        if (typeof chrome !== "undefined" && chrome.runtime) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                if (message.type === "CLOSE_POPUP") {
                    this._closeDecryptor();

                    sendResponse({ success: true });
                }

                return true;
            });
        }
    }

    private _setVideoDimensions(videoElement: HTMLVideoElement) {
        const containerWidth = 375;
        const containerHeight = 600;

        videoElement.style.width = `${containerWidth}px`;
        videoElement.style.height = `${containerHeight}px`;
        videoElement.style.objectFit = "cover";
        videoElement.style.objectPosition = "center";

        this.camera.dimensions.video.height = containerHeight;
        this.camera.dimensions.video.width = containerWidth;

        this.face.video = this._getCenterAndRadius(containerHeight, containerWidth);

        const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;

        if (maskResultCanvas) {
            maskResultCanvas.style.marginLeft = `0px`;
            maskResultCanvas.style.marginTop = `0px`;
        }

        this._changeDetectorRef.markForCheck();
    }

    private async _logIdentifierDiagnostics(reason: string): Promise<void> {
        try {
            const accessToken = (await this._chromeService.getItem("accessToken")) || "";
            const storedSessionIdentifier = (await this._chromeService.getItem("sessionIdentifier")) || null;
            const jwtIdentifier = accessToken ? this._authService.getJwtIdentifier(accessToken) : null;

            console.warn("[Zelf Keys] popout decrypt failed — identifier diagnostics", {
                reason,
                jwtIdentifier,
                storedSessionIdentifier,
                identifierMismatch: !!(jwtIdentifier && storedSessionIdentifier && jwtIdentifier !== storedSessionIdentifier),
            });
        } catch (diagError) {
            console.warn("[Zelf Keys] failed to collect identifier diagnostics:", diagError);
        }
    }

    private _resetBiometricSession(): void {
        this.response.base64Image = "";
        this.response.isLoading = false;
        this.errorFace = null;
        this.face.successPosition = 0;
        this.lastFace = null;

        const videoNgx = this.webcamRef?.nativeVideoElement;

        if (videoNgx) {
            this._setVideoDimensions(videoNgx);
        }

        this._drawOvalCenterAndMask();
        this._startFaceDetectionInterval();
        this._changeDetectorRef.markForCheck();
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

    private _startNgxVideoInterval(): void {
        if (this._intervals.checkNgxVideo) {
            clearInterval(this._intervals.checkNgxVideo);
            this._intervals.checkNgxVideo = null;
        }

        this._intervals.checkNgxVideo = setInterval(() => this._checkVideoStreamReady(), 100);
    }

    private _stopCamera(): void {
        try {
            if (!this.webcamRef) return;

            const videoElement = this.webcamRef.nativeVideoElement;

            if (!videoElement || !videoElement.srcObject) return;

            const stream = videoElement.srcObject as MediaStream;

            if (!stream) return;

            stream.getTracks().forEach((track) => {
                track.stop();
            });

            videoElement.srcObject = null;
        } catch (error) {
            console.warn("Error stopping camera:", error);
        }
    }

    private _takePictureLiveness(img: HTMLImageElement): void {
        const maskResultCanvas = this.maskResultCanvasRef?.nativeElement;
        const toSendCanvas = this.ToSendCanvasRef?.nativeElement;

        if (!maskResultCanvas || !toSendCanvas) return;

        const crops = this._computeOvalCrops();

        if (!crops) {
            console.error("Camera dimensions not properly initialized");

            return;
        }

        const { original, display } = crops;

        // Preview canvas: buffer matches the display crop so CSS renders 1:1 (no squash).
        this._drawCrop(maskResultCanvas, img, original, display);

        // To-send canvas: buffer matches the native crop so the API gets a clean face
        // crop at full quality, capped to 1080px long edge to keep the payload light.
        const sendDst = this._capRect(original, 1080);
        this._drawCrop(toSendCanvas, img, original, sendDst);

        this.response.base64Image = toSendCanvas.toDataURL("image/jpeg", 0.92);
        this.response.isLoading = true;

        this._changeDetectorRef.detectChanges();

        this._emitBiometricCapture();
    }

    cameraError(error: WebcamInitError): void {
        this._handleError(error);
    }

    onBiometricsCancel(): void {
        this._handleError({ message: "User cancelled decryption" });
    }

    onCancel(): void {
        this.onBiometricsCancel();
    }

    onRetry(): void {
        this.error = null;
        this._resetBiometricSession();
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
}
