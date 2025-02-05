import * as faceapi from "@vladmandic/face-api";
import { Observable, Subject, takeUntil } from "rxjs";

import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    TemplateRef,
    ViewChild,
} from "@angular/core";

import {
    Resolution,
    SmartCameraResolutionDetectionComponent,
} from "../smart-camera-resolution-detection/smart-camera-resolution-detection.component";

import { FlexLayoutModule } from "@angular/flex-layout";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { WalletService } from "app/wallet.service";
import { MediaStreamService } from "app/media-stream.service";
import { ZelfNameService } from "app/zelf-name-service.service";
import { CaptchaService } from "app/captcha.service";

export type FaceScan = {
    base64Image: string;
    rawImage?: string;
};

export interface FaceDetectionWithLandmarks extends faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection }> {}

type Angle = {
    roll: number;
    pitch: number;
    yaw: number;
};

type AngleThreshold = {
    min: Angle;
    max: Angle;
    indicatorAdjust: number;
    instructions?: string;
};

type CameraStatus = {
    permissions?: boolean;
    loading?: boolean;
    quality?: boolean;
};

type DetectionBounds = {
    min: {
        x: number;
        y: number;
        score: number;
        resolution: number;
    };
    max: {
        x: number;
        y: number;
        score: number;
        resolution: number;
    };
};

type FaceStatus = {
    detection?: faceapi.FaceDetection;
    angle?: Angle;
    error: boolean;
    success: boolean;
    successPosition: number;
    message?: string;
};

type FaceCapture = {
    detection: faceapi.FaceDetection;
    angle: Angle;
    base64: string;
};

type ScreenStatus = {
    height?: number;
    width?: number;
    landscape?: boolean;
};

type VideoStatus = {
    height: number;
    offsetX: number;
    offsetY: number;
    width: number;
};

@Component({
    selector: "smart-liveness",
    standalone: true,
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatProgressSpinnerModule,
        SmartCameraResolutionDetectionComponent,
        TranslocoModule,
    ],
    templateUrl: "./smart-liveness.component.html",
    styleUrls: ["./smart-liveness.component.scss"],
})
export class SmartLivenessComponent implements OnInit, OnDestroy {
    @ViewChild("videoElement") public videoElement: ElementRef<HTMLVideoElement> = {} as ElementRef<HTMLVideoElement>;
    @ViewChild("videoCanvas") public videoCanvas: ElementRef<HTMLCanvasElement> = {} as ElementRef<HTMLCanvasElement>;
    @ViewChild("viewportContainer") public viewportContainer: ElementRef<HTMLElement> = {} as ElementRef<HTMLVideoElement>;
    @ViewChild("instructions", { static: true }) instructions: TemplateRef<HTMLElement> = {} as TemplateRef<HTMLVideoElement>;

    @Output("onFaceScan") onFaceScan: EventEmitter<FaceScan> = new EventEmitter<FaceScan>();

    @Input() retry: Observable<void> = new Observable<void>();
    @Input() successfulUpload: Observable<void> = new Observable<void>();

    private _detectionInterval?: ReturnType<typeof setInterval>;
    private _unsubscriber$: Subject<void> = new Subject<void>();

    private DEBUG = false;
    private MINIMUM_DEPTH = 300 * 300;

    angleThresholds: Array<AngleThreshold> = [];
    camera: CameraStatus = { loading: true, permissions: true, quality: true };
    currentLivenessIndex = 0;
    device: "IOS" | "ANDROID" | "DESKTOP";
    face: FaceStatus = { error: false, success: false, successPosition: 0, message: "" };
    faceApiLoaded: boolean = false;
    faceCaptures: Array<FaceCapture> = [];
    indicatorTransform: string = "rotate(-20deg) skewY(-50deg)";
    instructionsClosed: boolean = false;
    resolution: Resolution = { height: 0, width: 0 };
    scaledVideo: VideoStatus = { height: 0, width: 0, offsetX: 0, offsetY: 0 };
    scaledViewport: VideoStatus = { height: 0, width: 0, offsetX: 0, offsetY: 0 };
    screen: ScreenStatus = { landscape: false };
    stream: MediaStream | null = null;
    uploading: boolean = false;
    video: VideoStatus = { height: 0, width: 0, offsetX: 0, offsetY: 0 };
    videoOptions: any = {};
    viewport: VideoStatus = { height: 0, width: 0, offsetX: 0, offsetY: 0 };

    angleThreshold: AngleThreshold = {
        min: {
            pitch: 0,
            yaw: 0,
            roll: 0,
        },
        max: {
            pitch: 0,
            yaw: 0,
            roll: 0,
        },
        indicatorAdjust: 0,
    };

    bounds: DetectionBounds = {
        min: {
            x: 0,
            y: 0,
            score: 0,
            resolution: 0,
        },
        max: {
            x: 0,
            y: 0,
            score: 0,
            resolution: 0,
        },
    };

    constructor(
        private _captchaService: CaptchaService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _dialog: MatDialog,
        private _mediaStreamService: MediaStreamService,
        private _renderer: Renderer2,
        private _walletService: WalletService,
        private _zelfNameService: ZelfNameService,
        private translocoService: TranslocoService
    ) {
        this._detectionInterval = undefined;

        this.device = this._walletService.detectOS();
        this.instructionsClosed = this._walletService.instructionsClosed;

        this._setDefaultBounds();
        this._setDefaultAngleThreshold();
        this._setScreenStatus();

        this._renderer.listen("window", "resize", () => {
            if (this.uploading) return;

            this.restartCamera();
        });
    }

    private _setDefaultAngleThreshold = () => {
        this.angleThreshold = {
            min: {
                pitch: 0,
                yaw: 0,
                roll: 0,
            },
            max: {
                pitch: 0,
                yaw: 0,
                roll: 0,
            },
            indicatorAdjust: 0,
        } as AngleThreshold;
    };

    private _setDefaultBounds = () => {
        this.bounds = {
            min: {
                x: 0,
                y: 0,
                score: 0,
                resolution: 0,
            },
            max: {
                x: 0,
                y: 0,
                score: 0,
                resolution: 0,
            },
        } as DetectionBounds;
    };

    ngOnInit(): void {
        this._openInstructions();
        this._mediaStreamService.stopAllStreams();

        this.successfulUpload.pipe(takeUntil(this._unsubscriber$)).subscribe(() => {
            this.uploading = false;
            this._stopCamera();
        });

        this.retry.pipe(takeUntil(this._unsubscriber$)).subscribe(() => {
            this.faceCaptures = [];
            this.currentLivenessIndex = 0;

            this.restartCamera();
        });

        this._walletService.faceapi$.pipe(takeUntil(this._unsubscriber$)).subscribe(() => {
            this.faceApiLoaded = true;
        });
    }

    ngOnDestroy(): void {
        this._stopCamera();

        this._unsubscriber$.next();
        this._unsubscriber$.complete();
    }

    private _calculateVideoCoverDimensions(video: VideoStatus, container: VideoStatus) {
        const { width: width1, height: height1 } = video;
        const { width: width2, height: height2 } = container;

        const scale = {
            x: width2 / width1,
            y: height2 / height1,
        };

        const inverseScale = {
            x: width1 / width2,
            y: height1 / height2,
        };

        const scaleFactor = Math.max(scale.x, scale.y);

        const newWidth = width1 * scaleFactor;
        const newHeight = height1 * scaleFactor;

        const offsetX = (width2 - newWidth) / 2;
        const offsetY = (height2 - newHeight) / 2;

        const prescaleOffsetX = inverseScale.x * offsetX;
        const prescaleOffsetY = inverseScale.y * offsetY;

        return {
            offsetX,
            offsetY,
            prescaleOffsetX,
            prescaleOffsetY,
            height: newHeight,
            width: newWidth,
        };
    }

    private _checkQuality(videoHeight: number, videoWidth: number): boolean {
        const minimumResolution = videoHeight >= 240 && videoWidth >= 240;
        const minimumDepth = videoHeight * videoWidth >= this.MINIMUM_DEPTH;

        return minimumResolution && minimumDepth;
    }

    private _captureAndCropImage(): Promise<string> {
        const faceCapture = this.faceCaptures[0];
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const { width, height, offsetX, offsetY } = this.scaledViewport;

        canvas.width = Math.max(Math.floor(width * 0.5), 240);
        canvas.height = Math.max(Math.floor(height * 0.5), 240);

        let image = new Image();

        image.src = faceCapture.base64;

        return new Promise<string>((resolve) => {
            image.onload = () => {
                ctx?.drawImage(image, offsetX, offsetY, width, height, 0, 0, canvas.width, canvas.height);

                resolve(canvas.toDataURL());

                image.src = "";
                image.onload = null;
            };
        });
    }

    private async _findFace(canvas: HTMLCanvasElement): Promise<FaceDetectionWithLandmarks | null> {
        let detections: FaceDetectionWithLandmarks[];

        if (this.device === "DESKTOP") {
            detections = await faceapi.detectAllFaces(canvas, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.2 })).withFaceLandmarks(true);
        } else {
            detections = await faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.2 })).withFaceLandmarks(true);
        }

        if (!detections.length) throw Error("no_face");

        this.face.error = false;

        this._changeDetectorRef.markForCheck();

        if (this.DEBUG) {
            const resizedResults = faceapi.resizeResults(detections, canvas);

            faceapi.draw.drawDetections(canvas, resizedResults);
        }

        return this._walletService.findBiggestFace(detections);
    }

    private _setAngleThresholds(): void {
        // Always face center for the first threshold
        const angleThresholds = [
            {
                min: {
                    pitch: -7,
                    roll: -10,
                    yaw: -30,
                },
                max: {
                    pitch: 7,
                    roll: 10,
                    yaw: 30,
                },
                indicatorAdjust: 0,
                instructions: this.translocoService.translate("smart_liveness.instructions.look_straight"),
            },
        ] as Array<AngleThreshold>;

        const north = {
            min: {
                pitch: 10,
                roll: -10,
                yaw: -30,
            },
            max: {
                pitch: 30,
                roll: 10,
                yaw: 30,
            },
            instructions: this.translocoService.translate("smart_liveness.instructions.look_up"),
            indicatorAdjust: 1,
        } as AngleThreshold;

        const northEast = {
            min: {
                pitch: 5,
                roll: -10,
                yaw: 75,
            },
            max: {
                pitch: 25,
                roll: 10,
                yaw: 150,
            },
            instructions: this.translocoService.translate("smart_liveness.instructions.look_up_and_right"),
            indicatorAdjust: 45,
        } as AngleThreshold;

        const east = {
            min: {
                pitch: -20,
                roll: -10,
                yaw: 100,
            },
            max: {
                pitch: 20,
                roll: 10,
                yaw: 200,
            },
            instructions: this.translocoService.translate("smart_liveness.instructions.look_right"),
            indicatorAdjust: 90,
        } as AngleThreshold;

        const southEast = {
            min: {
                pitch: -25,
                roll: -10,
                yaw: 75,
            },
            max: {
                pitch: 0,
                roll: 10,
                yaw: 150,
            },
            instructions: this.translocoService.translate("smart_liveness.instructions.look_down_and_right"),
            indicatorAdjust: 135,
        } as AngleThreshold;

        const south = {
            min: {
                pitch: -30,
                roll: -10,
                yaw: -30,
            },
            max: {
                pitch: 0,
                roll: 10,
                yaw: 30,
            },
            instructions: this.translocoService.translate("smart_liveness.instructions.look_down"),
            indicatorAdjust: 180,
        } as AngleThreshold;

        const southWest = {
            min: {
                pitch: -25,
                roll: -10,
                yaw: -150,
            },
            max: {
                pitch: 0,
                roll: 10,
                yaw: -75,
            },
            instructions: this.translocoService.translate("smart_liveness.instructions.look_down_and_left"),
            indicatorAdjust: 225,
        } as AngleThreshold;

        const west = {
            min: {
                pitch: -20,
                roll: -10,
                yaw: -200,
            },
            max: {
                pitch: 20,
                roll: 10,
                yaw: -100,
            },
            instructions: this.translocoService.translate("smart_liveness.instructions.look_left"),
            indicatorAdjust: 270,
        } as AngleThreshold;

        const northWest = {
            min: {
                pitch: 5,
                roll: -10,
                yaw: -150,
            },
            max: {
                pitch: 25,
                roll: 10,
                yaw: -75,
            },
            instructions: this.translocoService.translate("smart_liveness.instructions.look_up_and_left"),
            indicatorAdjust: 315,
        } as AngleThreshold;

        const directions = {
            north,
            northEast,
            east,
            southEast,
            south,
            southWest,
            west,
            northWest,
        };

        const directionToSet: Set<keyof typeof directions> = new Set();
        const keys = Object.keys(directions) as Array<keyof typeof directions>;

        while (directionToSet.size < 2) {
            const random = Math.floor(Math.random() * 8);

            directionToSet.add(keys[random]);
        }

        [...directionToSet].forEach((key) => {
            angleThresholds.push(directions[key]);
        });

        this.angleThresholds = angleThresholds;
        this.angleThreshold = this.angleThresholds[0];
    }

    private _onIntervalDetect = () => {
        if (!this.faceApiLoaded || this.currentLivenessIndex === this.angleThresholds.length || !this.videoCanvas) return;

        this._findFace(this.videoCanvas.nativeElement)
            .then(this._validateFace)
            .catch(() => {
                this.face.error = true;
                this.face.message = "not-found";

                this._changeDetectorRef.markForCheck();
            });
    };

    private _openInstructions() {
        if (this.instructionsClosed) return;

        const dialogRef = this._dialog.open(this.instructions, { disableClose: true, panelClass: "rounded-2xl" });

        dialogRef.afterClosed().subscribe(() => {
            this.instructionsClosed = true;
            this._walletService.instructionsClosed = true;

            try {
                const zelfName = this._zelfNameService.getZelfName();

                let captchaKey = zelfName.split(".zelf")[0].replace(".", "_");

                this._captchaService.executeRecaptcha(captchaKey).then((token) => {
                    this._captchaService.retainCaptchaToken(token);
                });
            } catch (error) {
                console.error(error);
            }
        });
    }

    private _onLoadedMetadata = () => {
        const videoElement = this.videoElement?.nativeElement;
        const videoCanvas = this.videoCanvas?.nativeElement;

        if (!videoElement || !videoCanvas) return;

        const ctx = videoCanvas?.getContext("2d", { willReadFrequently: true });

        videoElement?.play();

        this._setDimensions();
        this._setDetectionBounds();

        videoCanvas.height = this.video.height;
        videoCanvas.width = this.video.width;
        videoCanvas.style.width = `${this.scaledVideo.width}px`;
        videoCanvas.style.height = `${this.scaledVideo.height}px`;
        videoCanvas.style.transform = `translate(${this.scaledVideo.offsetX}px, ${this.scaledVideo.offsetY}px) scaleX(-1)`;

        this.camera.loading = false;

        this._changeDetectorRef.markForCheck();

        const detectionDelay = 25;

        let frameCount = 0;

        this._detectionInterval = setInterval(() => {
            if (!this.instructionsClosed) return;

            ++frameCount;

            if (this.device === "DESKTOP") {
                ctx?.clearRect(0, 0, this.video.width, this.video.height);
                ctx?.drawImage(videoElement, 0, 0, this.video.width, this.video.height);
            } else {
                ctx?.clearRect(0, 0, this.video.width, this.video.height);
                ctx?.drawImage(videoElement, 0, 0, this.video.width, this.video.height);
            }

            ctx?.save();

            if (frameCount < detectionDelay) return;

            frameCount = 0;

            this._onIntervalDetect();
        }, Math.floor(1000 / 30));
    };

    private _setDetectionBounds() {
        const { height: viewportHeight, width: viewportWidth, offsetX, offsetY } = this.scaledViewport;

        const __minCalc = (offset: number, dimension: number) => {
            return Math.floor(offset ? offset + offset * 0.12 : dimension * 0.1);
        };

        const __maxCalc = (offset: number, dimension: number) => {
            return Math.floor(offset ? dimension + offset * 0.88 : dimension * 0.9);
        };

        this.bounds = {
            min: {
                x: __minCalc(offsetX, viewportWidth),
                y: __minCalc(offsetY, viewportHeight),
                score: 0.4,
                resolution: Math.max(viewportHeight * viewportWidth * 0.1, this.MINIMUM_DEPTH),
            },
            max: {
                x: __maxCalc(offsetX, viewportWidth),
                y: __maxCalc(offsetY, viewportHeight),
                score: 1,
                resolution: Math.max(viewportHeight * viewportWidth * 0.8, this.MINIMUM_DEPTH),
            },
        };
    }

    private _setDimensions() {
        const viewportContainer = this.viewportContainer.nativeElement;
        const { videoHeight, videoWidth } = this.videoElement.nativeElement;

        // The raw video size from the camera. (i.e. 1920x1080)
        this.video = {
            height: videoHeight,
            width: videoWidth,
            offsetX: 0,
            offsetY: 0,
        };

        // The viewport size - the container the video shows within. (i.e 400x400)
        this.viewport = {
            height: viewportContainer.clientHeight,
            width: viewportContainer.clientWidth,
            offsetX: 0,
            offsetY: 0,
        };

        const rescaledVideo = this._calculateVideoCoverDimensions(this.video, this.viewport);
        const rescaledViewport = Math.min(videoWidth, videoHeight);

        // Stores the scaled video dimensions that fit within the viewport. (i.e 900x400)
        this.scaledVideo = {
            height: rescaledVideo.height,
            width: rescaledVideo.width,
            offsetX: rescaledVideo.offsetX,
            offsetY: rescaledVideo.offsetY,
        };

        // Stores the scaled viewport dimensions that fit within the video. (i.e 400x400)
        this.scaledViewport = {
            height: rescaledViewport,
            width: rescaledViewport,
            offsetX: (videoWidth - rescaledViewport) / 2,
            offsetY: (videoHeight - rescaledViewport) / 2,
        };

        // If the video and the viewport were the same size without scaling, the offset would be:
        this.video.offsetX = rescaledVideo.prescaleOffsetX;
        this.video.offsetY = rescaledVideo.prescaleOffsetY;

        // Stores the offset of the video within the viewport. (i.e 250x0)
        this.viewport.offsetX = rescaledVideo.offsetX;
        this.viewport.offsetY = rescaledVideo.offsetY;

        this._changeDetectorRef.markForCheck();
    }

    private _setScreenStatus() {
        const height = window.innerHeight;
        const width = window.innerWidth;

        this.screen = {
            height,
            landscape: height < width,
            width,
        };
    }

    private _startCamera() {
        if (this.stream) return;

        navigator.mediaDevices
            .getUserMedia({
                audio: false,
                video: this.videoOptions,
            })
            .then((stream) => {
                this.stream = stream;
                this._mediaStreamService.addStream(stream);

                setTimeout(() => {
                    const videoElement: HTMLVideoElement = this.videoElement.nativeElement;

                    videoElement.srcObject = stream;

                    videoElement.removeEventListener("loadedmetadata", this._onLoadedMetadata, true);
                    videoElement.addEventListener("loadedmetadata", this._onLoadedMetadata, true);
                });
            })
            .catch();
    }

    private _stopCamera() {
        clearInterval(this._detectionInterval);

        this._detectionInterval = undefined;
        this.uploading = false;

        this.camera.loading = true;
        this.face.error = false;
        this.face.message = "";

        this._changeDetectorRef.markForCheck();

        if (this.stream) {
            this._mediaStreamService.stopAllStreams();

            this.stream = null;
        }
    }

    private _validateFace = (face: FaceDetectionWithLandmarks | null) => {
        if (!face) return;

        const { angle, detection } = face;

        if (!angle || !detection || angle.pitch === undefined || angle.roll === undefined || angle.yaw === undefined) return;

        let error = false;
        let success = false;
        let message = "";
        let successPosition = Number(this.face.successPosition);

        if (this.bounds.min.score > detection.score) {
            error = true;
            message = "low-score";
        } else if (this.bounds.min.resolution > detection.box.area) {
            error = true;
            message = "move-closer";
        } else if (this.bounds.max.resolution < detection.box.area) {
            error = true;
            message = "move-away";
        } else if (
            this.bounds.min.x > detection.box.left ||
            this.bounds.min.y > detection.box.top ||
            this.bounds.max.x < detection.box.right ||
            this.bounds.max.y < detection.box.bottom
        ) {
            error = true;
            message = "not-in-frame";
        } else if (this.angleThreshold.min.pitch > angle.pitch) {
            error = true;
            message = "pitch-up";
        } else if (this.angleThreshold.max.pitch < angle.pitch) {
            error = true;
            message = "pitch-down";
        } else if (this.angleThreshold.min.roll > angle.roll) {
            error = true;
            message = "roll-right";
        } else if (this.angleThreshold.max.roll < angle.roll) {
            error = true;
            message = "roll-left";
        } else if (this.angleThreshold.min.yaw > angle.yaw) {
            error = true;
            message = "yaw-right";
        } else if (this.angleThreshold.max.yaw < angle.yaw) {
            error = true;
            message = "yaw-left";
        } else {
            error = false;
            success = true;
        }

        if (error) {
            successPosition = 0;
        } else {
            successPosition += 1;
        }

        this.face = {
            ...this.face,
            error,
            message,
            success,
            successPosition,
        };

        if (this.face.successPosition < 2) return;

        this.faceCaptures = [
            ...this.faceCaptures,
            {
                angle: { roll: angle.roll, yaw: angle.yaw, pitch: angle.pitch },
                base64: this.videoCanvas.nativeElement.toDataURL(),
                detection,
            },
        ];

        this.face = {
            ...this.face,
            error: false,
            message: "",
            success: false,
            successPosition: 0,
        };

        this.currentLivenessIndex += 1;

        if (this.currentLivenessIndex !== this.angleThresholds.length) {
            this.angleThreshold = { ...this.angleThresholds[this.currentLivenessIndex] };
            this.indicatorTransform = `rotate(${this.angleThreshold.indicatorAdjust - 20}deg) skewY(-50deg)`;

            this._changeDetectorRef.markForCheck();
        } else {
            this.uploading = true;
            this._stopCamera();

            this._captureAndCropImage().then((base64Image) => {
                const croppedImage = base64Image.replace(/^data:.*;base64,/, "");

                this.onFaceScan.emit({
                    base64Image: croppedImage,
                    rawImage: base64Image,
                });
            });
        }
    };

    handleResolutionDetection(resolution: Resolution) {
        if (this.uploading) return;

        this.resolution = resolution;

        this._stopCamera();

        const { height: videoHeight, width: videoWidth } = resolution;

        this.camera.quality = this._checkQuality(videoHeight, videoWidth);

        this._changeDetectorRef.markForCheck();

        if (!this.camera.quality) return;

        this._setAngleThresholds();

        this.videoOptions = {
            aspectRatio: { exact: this.resolution.aspectRatio },
            deviceId: { exact: this.resolution.deviceId },
            facingMode: "user",
            height: { exact: videoHeight },
            width: { exact: videoWidth },
        };

        this._startCamera();
    }

    onCameraError(): void {
        this.camera.permissions = false;

        this._changeDetectorRef.markForCheck();
    }

    restartCamera() {
        this._stopCamera();
        this._setAngleThresholds();
        this._startCamera();
    }
}
