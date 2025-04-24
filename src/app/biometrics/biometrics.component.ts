import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subject } from "rxjs";
import { MatDialogModule } from "@angular/material/dialog";
import { TranslocoModule, TranslocoService } from "@jsverse/transloco";
import { MatButtonModule } from "@angular/material/button";

import * as faceapi from "@vladmandic/face-api";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { FlexLayoutModule } from "@angular/flex-layout";
import { WalletService } from "../wallet.service";

import { ChromeService } from "app/chrome.service";

@Component({
    selector: "biometrics",
    templateUrl: "./biometrics.component.html",
    styleUrls: ["./biometrics.component.scss"],
    imports: [FlexLayoutModule, CommonModule, MatDialogModule, TranslocoModule, MatButtonModule, MatProgressBarModule, MatProgressSpinnerModule],
})
export class BiometricsComponent implements OnInit, OnDestroy {
    private unsubscriber$: Subject<any> = new Subject<any>();

    @Input() type?: string;
    @Input() data: any;
    @Input() callback: any;

    isActiveDebug?: Boolean;
    debugIndex: number;
    debugText: string = "debug";

    @ViewChild("video", { static: false }) public video?: ElementRef;
    @ViewChild("canvas", { static: false }) public canvasRef?: ElementRef;
    @ViewChild("result", { static: false }) public canvasResultRef?: ElementRef;
    @ViewChild("toSend", { static: false }) public canvasToSendRef?: ElementRef;
    @ViewChild("credentialCanvas", { static: false }) credentialRef?: ElementRef;

    canvasEl: any;
    canvas: any;
    canvasResult: any;
    displaySize: any;
    videoInput?: HTMLVideoElement;
    base64Image: any;

    HEIGHT?: number;
    WIDTH?: number;
    videoCenterX: any;
    videoCenterY: any;
    marginX: any;
    marginY: any;

    OVAL: any = {};

    detectFaceInterval: any;
    saveImageBase64Intent: any;

    osInfo: string;
    stream: any;
    loadingResults: boolean = false;
    loadingModel: boolean = false;
    lastFace: any;
    demoData: any;

    result: any;
    errorResult?: {};
    errorFace?: {
        title: string;
        subtitle: string;
        canvas?: string;
    } | null;

    faceIdCard: any;
    left?: HTMLImageElement;
    right?: HTMLImageElement;
    up?: HTMLImageElement;
    down?: HTMLImageElement;
    videoDimensions: any;
    resizeDimensions?: { rectHeight: number; rectWidth: number; y: number; x: number };
    originalDimensions?: { rectHeight: any; rectWidth: number; y: number; x: number };
    minPixelFace: number = 234;
    videoOptions: any = {
        frameRate: { ideal: 30, max: 30 },
    };
    maxHeight?: number;
    maxWidth?: number;
    lowCamera: boolean;
    successPosition: any;

    appLoginToken?: string;
    showError: Boolean;
    errorContent: any;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _translocoService: TranslocoService,
        private renderer: Renderer2,
        private _walletService: WalletService,
        private _chromeService: ChromeService
    ) {
        this.loadingModel = true;
        this.lowCamera = false;
        this.debugIndex = 0;
        this.successPosition = 0;
        this.showError = false;

        this.errorContent = {
            message: "",
        };

        this.osInfo = this.detectOS();
        this.demoData = this._walletService.getDeviceData();

        let key = this.demoData.isMobile ? "width" : "height";

        this.videoOptions[key] = { ideal: 1080 };

        this.listenModeDebug();
    }

    async ngOnInit(): Promise<void> {
        this.errorFace = null;
        this.loadingResults = false;
        this.base64Image = null;

        await this.loadImages();

        this.setMaxDimensions();

        this.renderer.listen("window", "resize", () => {
            this.setMaxDimensions();

            if (this.videoInput) {
                this.setCanvasDimension();
                this.setConfigCanvas();
            }
        });

        this._walletService.faceapi$.subscribe((isLoaded) => {
            this.loadingModel = !isLoaded;

            if (isLoaded) {
                this.startAsyncVideo();
            }
        });
    }

    async listenModeDebug(): Promise<void> {
        this.isActiveDebug = await this._chromeService.getItem("isActiveDebug");

        document.addEventListener("keydown", async (event): Promise<any> => {
            if (this.debugText.charAt(this.debugIndex) === event.key.toLowerCase()) {
                if (this.debugIndex === 3) {
                    this.isActiveDebug = !this.isActiveDebug;

                    await this._chromeService.setItem("isActiveDebug", this.isActiveDebug);

                    this._changeDetectorRef.markForCheck();
                }

                return this.debugIndex++;
            }

            this.debugIndex = 0;
        });
    }

    stopRecord(): void {
        if (this.detectFaceInterval) {
            clearInterval(this.detectFaceInterval);
        }

        if (this.stream) {
            this.stream.getTracks().forEach((track: any) => track.stop());
        }
    }

    async loadImages(): Promise<void> {
        this.left = new Image();
        this.left.crossOrigin = "anonymous";
        this.left.src = "https://cdn.verifik.co/web-sdk/images/left.png";
        this.right = new Image();
        this.right.crossOrigin = "anonymous";
        this.right.src = "https://cdn.verifik.co/web-sdk/images/right.png";
        this.up = new Image();
        this.up.crossOrigin = "anonymous";
        this.up.src = "https://cdn.verifik.co/web-sdk/images/up.png";
        this.down = new Image();
        this.down.crossOrigin = "anonymous";
        this.down.src = "https://cdn.verifik.co/web-sdk/images/down.png";
    }

    async startAsyncVideo() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: this.videoOptions,
                audio: false,
            });

            this.videoInput = this.video?.nativeElement as HTMLVideoElement;

            this.videoInput.srcObject = this.stream;

            this.videoInput.style.transform = "scaleX(-1)";

            if (this.canvasRef) {
                this.canvasRef.nativeElement.style.transform = "scaleX(-1)";
            }

            const videoTrack = this.stream.getVideoTracks()[0];
            const settings = videoTrack.getSettings();
            const { width, height } = settings;
            // alert(`${width} x ${height}`);
            this.videoDimensions = { height, width };

            if (height < 600) {
                this.lowCamera = true;
                this.loadingModel = false;

                return;
            }

            this.videoInput.addEventListener("loadeddata", () => {
                if (!this.video && !this.canvas) {
                    this.stopRecord();
                    return;
                }
                // setTimeout(() => {
                this.setCanvasDimension();

                this.detectFaces();
                // }, 100);
            });
        } catch (error: any) {
            if (error) {
                alert(`${error.message}`);
            }

            console.error("SHOW ERROR", error);
        }
    }

    setMaxDimensions = () => {
        this.maxHeight = Math.floor(window.innerHeight * 0.7);
        this.maxWidth = Math.floor(window.innerWidth * 0.9);
    };

    setCanvasDimension = () => {
        if (!this.videoInput || !this.maxWidth || !this.maxHeight) {
            return;
        }

        this.HEIGHT = Math.min(this.videoInput.clientHeight, this.maxHeight);
        this.WIDTH = Math.min(this.videoInput.clientWidth, this.maxWidth);

        this.videoCenterX = this.WIDTH / 2;
        this.videoCenterY = this.HEIGHT / 2;

        this.marginY = this.HEIGHT * 0.04;
        this.marginX = this.marginY * 0.8;

        this.OVAL.radiusY = this.HEIGHT * 0.42;
        this.OVAL.radiusX = this.OVAL.radiusY * 0.75;

        if (this.OVAL.radiusX * 2 >= this.WIDTH) {
            this.OVAL.radiusX = this.WIDTH * 0.48;
            this.OVAL.radiusY = this.OVAL.radiusX / 0.75;
        }

        this.displaySize = {
            width: this.WIDTH,
            height: this.HEIGHT,
        };

        this.resizeDimensions = {
            rectHeight: this.HEIGHT,
            rectWidth: Math.min(2.8 * this.OVAL.radiusX, this.WIDTH),
            y: 0,
            x: this.videoCenterX - Math.min(2.8 * this.OVAL.radiusX, this.WIDTH) / 2,
        };

        this.originalDimensions = {
            rectHeight: this.videoDimensions.height,
            rectWidth: (this.resizeDimensions.rectWidth / this.WIDTH) * this.videoDimensions.width,
            y: 0,
            x: (this.resizeDimensions.x / this.WIDTH) * this.videoDimensions.width,
        };
    };

    async detectFaces() {
        await this.setConfigCanvas();

        this.detectFaceInterval = setInterval(
            async () => {
                if (!this.videoInput) return;

                try {
                    const detection = await faceapi
                        .detectAllFaces(this.videoInput, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.2 }))
                        .withFaceLandmarks();
                    // .withFaceExpressions()
                    // .withAgeAndGender();

                    const context = this.canvas.getContext("2d");

                    if (detection.length > 0) {
                        this.lastFace = detection[0];
                        this.errorFace = null;

                        this.drawFaceAndCenter(detection, context);
                        this.isFaceCentered(this.lastFace.landmarks.getNose()[3]);
                        this.isFaceClose(this.lastFace.landmarks);

                        this.drawStatusOval(context);

                        !this.errorFace ? ++this.successPosition : (this.successPosition = 0);

                        if (!this.errorFace) {
                            this.successPosition = 0;

                            this.captureBase64Image();
                        }
                    }

                    this._changeDetectorRef.markForCheck();
                } catch (error: any) {
                    alert(error.message);
                }
            },
            this.demoData.isMobile ? 500 : 300
        );
    }

    async setConfigCanvas(): Promise<void> {
        if (!this.videoInput) return;

        if (!this.canvas && this.canvasRef) {
            this.canvas = await faceapi.createCanvasFromMedia(this.videoInput);

            this.canvasEl = this.canvasRef.nativeElement;
            this.canvasEl.appendChild(this.canvas);
            this.canvas.setAttribute("id", "canvas");
        }

        faceapi.matchDimensions(this.canvas, this.displaySize);

        const ctx = this.canvas.getContext("2d");

        this.drawOvalCenterAndMask(ctx);
    }

    drawFaceAndCenter(detection: any, ctx: any): void {
        const resizedDetections = faceapi.resizeResults(detection, this.displaySize);

        this.drawOvalCenterAndMask(ctx);

        if (this.isActiveDebug) {
            ctx.strokeStyle = "red";
            ctx.lineWidth = 4;
            ctx.strokeRect(this.videoCenterX - this.marginX, this.videoCenterY, this.marginX * 2, this.marginY * 2);
            // faceapi.draw.drawDetections(this.canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(this.canvas, resizedDetections);
            faceapi.draw.drawFaceExpressions(this.canvas, resizedDetections);

            const box = detection[0].detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, {
                label: `${detection[0].gender.toUpperCase()} | ${Math.round(detection[0].age)} years old`,
            });

            drawBox.draw(this.canvas);
        }
    }

    drawOvalCenterAndMask(ctx: any): void {
        //CLEAR CANVAS
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //OPACITY OUTSIDE THE ELLIPSE
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)"; // Color de la máscara
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.globalCompositeOperation = "destination-out";

        //DRAW ELIPSE CON RELLENO VACIO
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.beginPath();
        ctx.ellipse(this.videoCenterX, this.videoCenterY, this.OVAL.radiusX, this.OVAL.radiusY, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.globalCompositeOperation = "source-over";
    }

    drawText(ctx: any, text: string, x: number, y: number): void {
        ctx.font = "30px Arial";
        ctx.textAlign = "center";

        const medidasTexto = ctx.measureText(text);

        const padding = 10;
        ctx.fillStyle = "black";

        ctx.fillRect(x - medidasTexto.width / 2, y - 30 - padding, medidasTexto.width + 2, 40 + 2 * padding);

        ctx.fillStyle = "white";
        ctx.fillText(text, x, y);
    }

    drawStatusOval(ctx: any): void {
        const isOk = Boolean(this.errorFace && this.errorFace.title);

        ctx.beginPath();
        ctx.ellipse(this.videoCenterX, this.videoCenterY, this.OVAL.radiusX, this.OVAL.radiusY, 0, 0, 2 * Math.PI);
        ctx.lineWidth = 5;
        ctx.strokeStyle = isOk ? "green" : "red";
        ctx.stroke();
        ctx.closePath();

        if (!isOk && this.errorFace) {
            if (this.errorFace.canvas?.includes("↑")) {
                const startX = this.videoCenterX - 20;
                const startY = this.videoCenterY - this.OVAL.radiusY + 10;
                ctx.drawImage(this.up, startX, startY, 40, 40);
            }

            if (this.errorFace.canvas?.includes("↓")) {
                const startX = this.videoCenterX - 20;
                const startY = this.videoCenterY + this.OVAL.radiusY - 50;
                ctx.drawImage(this.down, startX, startY, 40, 40);
            }

            if (this.errorFace.canvas?.includes("→")) {
                const startX = this.videoCenterX + this.OVAL.radiusX - 50;
                const startY = this.videoCenterY - 20;
                ctx.drawImage(this.right, startX, startY, 40, 40);
            }

            if (this.errorFace.canvas?.includes("←")) {
                const startX = this.videoCenterX - this.OVAL.radiusX + 10;
                const startY = this.videoCenterY - 20;
                ctx.drawImage(this.left, startX, startY, 40, 40);
            }
        }
        this._changeDetectorRef.markForCheck();
    }

    isFaceCentered(nose: any): void {
        if (!this.WIDTH || !this.HEIGHT) return;

        const faceCenterX = (nose.x / this.videoDimensions.width) * this.WIDTH;
        const faceCenterY = (nose.y / this.videoDimensions.height) * this.HEIGHT;

        const isFaceCentered =
            faceCenterX > this.videoCenterX - this.marginX &&
            faceCenterX < this.videoCenterX + this.marginX &&
            faceCenterY > this.videoCenterY &&
            faceCenterY < this.videoCenterY + this.marginY * 2.5;

        if (!isFaceCentered) {
            let direction = "";

            if (faceCenterX < this.videoCenterX - this.marginX || faceCenterX > this.videoCenterX + this.marginX)
                direction += ` ${faceCenterX < this.videoCenterX - this.marginX ? "→" : "←"} `;

            if (faceCenterY < this.videoCenterY || faceCenterY > this.videoCenterY + this.marginY * 2)
                direction += ` ${faceCenterY < this.videoCenterY ? "↑" : "↓"}  `;

            this.errorFace = {
                title: this._translocoService.translate("liveness.center_your_face"),
                subtitle: this._translocoService.translate("liveness.center_your_face_subtitle"),
                canvas: direction,
            };
        }
    }

    isFaceClose(landmarks: faceapi.FaceLandmarks68): void {
        if (!this.originalDimensions) return;

        const totalFaceArea = landmarks.imageHeight * landmarks.imageWidth;
        const totalImageArea = Math.floor(this.originalDimensions.rectHeight * this.originalDimensions.rectWidth);
        const faceProportion = totalFaceArea / totalImageArea;

        const threshold = 0.25;

        if (faceProportion < threshold || landmarks.imageHeight < this.minPixelFace || landmarks.imageWidth < this.minPixelFace) {
            this.errorFace = {
                title: this._translocoService.translate("liveness.get_closer"),
                subtitle: this._translocoService.translate("liveness.get_closer_subtitle"),
            };
        }
    }

    captureBase64Image(): void {
        if (this.saveImageBase64Intent) {
            return;
        }

        this.saveImageBase64Intent = setTimeout(() => {
            if (this.errorFace) {
                this.saveImageBase64Intent = clearTimeout(this.saveImageBase64Intent);
            }

            this.takePicture();
        }, 1500);
    }

    async takePicture() {
        if (!this.canvasResultRef || !this.canvasToSendRef) return;

        const canvasToSend = this.canvasToSendRef.nativeElement;
        const canvasResult = this.canvasResultRef.nativeElement;

        this.setPictureInCavas(canvasResult, this.resizeDimensions, this.originalDimensions);
        this.setPictureInCavas(canvasToSend, this.originalDimensions);

        this.base64Image = canvasToSend.toDataURL("image/jpeg").replace(/^data:.*;base64,/, "");

        this.stopRecord();

        this.validateBiometrics();
    }

    setPictureInCavas(canvas: any, dimensions: any, dimensionsOriginals?: any) {
        if (!this.video) return;

        const context = canvas.getContext("2d");

        canvas.width = dimensions.rectWidth;
        canvas.height = dimensions.rectHeight;
        canvas.style.marginLeft = `${dimensions.x}px`;
        canvas.style.marginTop = `${dimensions.y}px`;

        if (!dimensionsOriginals) {
            dimensionsOriginals = { x: dimensions.x, y: dimensions.y, rectWidth: dimensions.rectWidth, rectHeight: dimensions.rectHeight };
        }

        context.drawImage(
            this.video.nativeElement,
            dimensionsOriginals.x,
            dimensionsOriginals.y,
            dimensionsOriginals.rectWidth,
            dimensionsOriginals.rectHeight,
            0,
            0,
            dimensions.rectWidth,
            dimensions.rectHeight
        );
    }

    detectOS() {
        const userAgent = window.navigator.userAgent.toLowerCase();

        if (/android/.test(userAgent)) {
            return "ANDROID";
        } else if (/iphone|ipad|ipod/.test(userAgent)) {
            return "IOS";
        }

        return "DESKTOP";
    }

    validateBiometrics(): void {
        if (this.loadingResults) return;

        this.loadingResults = true;

        const payload: any = {
            image: this.base64Image,
            os: this.osInfo,
        };

        switch (this.type) {
            case "createWallet":
                this._createWallet(payload, this.data);
                break;
            case "decryptWallet":
                this._decryptWallet(payload, this.data);
                break;
            default:
                break;
        }
    }

    _createWallet(payload: any, data: any): void {
        this._walletService
            .createWallet({
                faceBase64: payload.image,
                password: data.password || undefined,
                wordsCount: data.wordsCount,
            })
            .then((response) => {})
            .catch((err) => {
                this.errorContent = err.error;

                this.showError = true;
            });
    }

    _decryptWallet(payload: any, data: any): void {
        this._walletService
            .decryptWallet({
                faceBase64: payload.image,
                zelfProof: data.zelfProof,
                password: data.password || undefined,
            })
            .then((response) => {
                this.callback(response.data);
            })
            .catch((err) => {
                this.errorContent = err.error;

                this.showError = true;
            });
    }

    completeResults() {
        this.errorFace = null;
        this.loadingResults = false;
        this.base64Image = null;

        if (!this.errorResult) {
            this.stopRecord();
        }

        if (this.saveImageBase64Intent) {
            this.saveImageBase64Intent = clearTimeout(this.saveImageBase64Intent);
        }

        this._changeDetectorRef.markForCheck();
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next(null);

        this.loadingResults = false;

        this.video = undefined;

        if (this.detectFaceInterval) {
            this.stopRecord();
        }
    }

    continueRedirection(event: any): void {}
}
