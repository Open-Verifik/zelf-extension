import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from "@angular/core";
import { WebcamInitError } from "ngx-webcam";
import { Subject, takeUntil } from "rxjs";
import { MediaStreamService, MediaTrackSupportedConstraintsExtended, MediaTrackConstraintSetExtended } from "app/media-stream.service";

export type Resolution = {
    height: number;
    width: number;
    aspectRatio?: number;
    deviceId?: string;
};

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "smart-camera-resolution-detection",
    standalone: true,
    template: "",
})
export class SmartCameraResolutionDetectionComponent implements OnInit, OnDestroy {
    @Output("detected") detected: EventEmitter<Resolution> = new EventEmitter<Resolution>();
    @Output("failedToDetect") failedToDetect: EventEmitter<WebcamInitError> = new EventEmitter<WebcamInitError>();

    @Input("forceVertical") forceVertical: boolean = false;

    private WIDE: Array<Resolution> = [];
    private NARROW: Array<Resolution> = [];
    private SQUARE: Array<Resolution> = [];

    private MAX_HEIGHT: number = 0;
    private MAX_WIDTH: number = 0;
    private IS_LANDSCAPE: boolean = false;
    private KEYS = ["WIDE", "NARROW", "SQUARE"];

    private cameraCycle$: Subject<any> = new Subject<any>();
    private unsubscriber$: Subject<void> = new Subject<void>();

    deviceId: string = "";
    stream: MediaStream | null = null;

    constructor(private _renderer: Renderer2, private _mediaStreamService: MediaStreamService) {
        this._renderer.listen("window", "resize", () => this._init());

        this.cameraCycle$.pipe(takeUntil(this.unsubscriber$)).subscribe({
            next: (data) => {
                if (data.resolution) {
                    this._mediaStreamService.stopAllStreams();

                    this.detected.next(data.resolution);
                } else {
                    this._cycleResolutions(data.resolutionIndex, data.index);
                }
            },
            error: (_error) => {
                this.failedToDetect.next(<WebcamInitError>{
                    mediaStreamError: new DOMException("Cannot read UserMedia from MediaDevices.", "NotAllowedError"),
                    message: "Cannot read UserMedia from MediaDevices.",
                });
            },
        });
    }

    private get maxResolutionIndexLength(): number {
        return Math.max(Object.keys(this.WIDE).length, Object.keys(this.NARROW).length, Object.keys(this.SQUARE).length);
    }

    ngOnInit(): void {
        this._init();
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();

        this._mediaStreamService.stopStream(this.stream);
    }

    private _attachMaxWindowResolutionForAspectRatio() {
        const windowMax = { height: this.MAX_HEIGHT, width: this.MAX_WIDTH };

        const wide = this._calculateMaxDimensions({ height: 9, width: 16 }, windowMax);
        const narrow = this._calculateMaxDimensions({ height: 3, width: 4 }, windowMax);
        const square = this._calculateMaxDimensions({ height: 1, width: 1 }, windowMax);

        this._spliceDimension("WIDE", wide);
        this._spliceDimension("NARROW", narrow);
        this._spliceDimension("SQUARE", square);
    }

    private _calculateMaxDimensions(container: { height: number; width: number }, containerToFit: { height: number; width: number }) {
        const scaleFactorWidth = containerToFit.width / container.width;
        const scaleFactorHeight = containerToFit.height / container.height;

        const scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight);

        const scaledWidth = Math.floor(container.width * scaleFactor);
        const scaledHeight = Math.floor(container.height * scaleFactor);

        return { width: scaledWidth, height: scaledHeight };
    }

    private async _cycleResolutions(resolutionIndex: number, index: number): Promise<void> {
        let keyPassed: string;
        let resolutionPassed: Resolution;

        const key = this.KEYS[index] as "WIDE" | "NARROW" | "SQUARE";
        const resolution = this[key][resolutionIndex];

        if (!resolution) {
            this._next(resolutionIndex, index);
            return;
        }

        this._findBestResolution(key, resolution)
            .then((result) => {
                if (!result) {
                    this._next(resolutionIndex, index);
                    return;
                }

                keyPassed = key;
                resolutionPassed = this.IS_LANDSCAPE
                    ? {
                          ...resolution,
                          aspectRatio: resolution.width / resolution.height,
                      }
                    : {
                          aspectRatio: resolution.height / resolution.width,
                          height: resolution.width,
                          width: resolution.height,
                          deviceId: this.deviceId,
                      };

                if (keyPassed) {
                    this.cameraCycle$.next({ resolution: resolutionPassed });
                } else {
                    this._next(resolutionIndex, index);
                }
            })
            .catch(() => {
                this._next(resolutionIndex, index);
            });
    }

    private async _findBestResolution(key: string, resolution: Resolution): Promise<boolean> {
        const { facingMode, zoom } = navigator.mediaDevices.getSupportedConstraints() as MediaTrackSupportedConstraintsExtended;

        const mediaOptions = {
            audio: false,
            video: {} as MediaTrackConstraintSetExtended,
        };

        if (facingMode) {
            mediaOptions.video.facingMode = "user";
        }

        if (zoom) {
            mediaOptions.video.zoom = { ideal: 0 };
        }

        if (this.IS_LANDSCAPE) {
            mediaOptions.video.height = { exact: resolution.height };
            mediaOptions.video.width = { exact: resolution.width };
        } else {
            mediaOptions.video.height = { exact: resolution.width };
            mediaOptions.video.width = { exact: resolution.height };
        }

        try {
            if (this.stream) {
                const videoTrack = this.stream.getVideoTracks()[0];

                await videoTrack.applyConstraints(mediaOptions.video);

                return true;
            } else {
                this.stream = await this._mediaStreamService.startStream(mediaOptions);

                const videoTrack = this.stream.getVideoTracks()[0];

                this.deviceId = videoTrack.getCapabilities().deviceId || "";

                return true;
            }
        } catch (error) {
            return false;
        }
    }

    private _init() {
        // Check for Android device and adjust resolution
        if (/Android/i.test(navigator.userAgent)) {
            this.MAX_HEIGHT = window.screen.height;
            this.MAX_WIDTH = window.screen.width;
        } else {
            this.MAX_HEIGHT = window.innerHeight;
            this.MAX_WIDTH = window.innerWidth;
        }

        if (this.forceVertical) {
            this.WIDE = [
                { height: 2560, width: 1440 },
                { height: 1920, width: 1080 },
                { height: 1280, width: 720 },
                { height: 640, width: 360 },
            ];

            this.NARROW = [
                { height: 2048, width: 1536 },
                { height: 1600, width: 1200 },
                { height: 1024, width: 768 },
                { height: 800, width: 600 },
            ];
        } else {
            this.WIDE = [
                { height: 1440, width: 2560 },
                { height: 1080, width: 1920 },
                { height: 720, width: 1280 },
                { height: 360, width: 640 },
            ];

            this.NARROW = [
                { height: 1536, width: 2048 },
                { height: 1200, width: 1600 },
                { height: 768, width: 1024 },
                { height: 600, width: 800 },
            ];
        }

        this.SQUARE = [
            { height: 2160, width: 2160 },
            { height: 1080, width: 1080 },
            { height: 720, width: 720 },
            { height: 480, width: 480 },
        ];

        this.IS_LANDSCAPE = window.matchMedia("(orientation: landscape)").matches || window.innerHeight < window.innerWidth;
        this.deviceId = "";

        this._attachMaxWindowResolutionForAspectRatio();
        this._cycleResolutions(0, 0);
    }

    private _next(resolutionIndex: number, index: number): void {
        if (index >= this.KEYS.length - 1 && resolutionIndex >= this.maxResolutionIndexLength - 1) {
            this.cameraCycle$.error(new DOMException("NoSuitableResolutions", "NotFoundError"));
            return;
        }

        this.cameraCycle$.next({
            resolutionIndex: index < this.KEYS.length - 1 ? resolutionIndex : ++resolutionIndex,
            index: index < this.KEYS.length - 1 ? ++index : 0,
        });
    }

    private _spliceDimension(key: "WIDE" | "NARROW" | "SQUARE", newDimension: { height: number; width: number }): void {
        for (let index = 0; index < this[key].length; index++) {
            const element = this[key][index];

            if (element.height > newDimension.height) continue;

            this[key].splice(index, 0, element);

            return;
        }

        this[key].push(newDimension);
    }
}
