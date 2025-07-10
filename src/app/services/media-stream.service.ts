import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class MediaStreamService {
    private _activeStreams: MediaStream[] = [];

    async startStream(constraints: MediaStreamConstraints): Promise<MediaStream> {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        this._activeStreams.push(stream);

        return stream;
    }

    addStream(stream: MediaStream): void {
        this._activeStreams.push(stream);
    }

    stopStream(stream: MediaStream): void {
        stream.getTracks().forEach((track) => track.stop());

        this._activeStreams = this._activeStreams.filter((activeStream) => activeStream !== stream);
    }

    async stopAllStreams(): Promise<void> {
        this._activeStreams.forEach((stream) => {
            stream?.getTracks().forEach((track) => track.stop());
        });

        this._activeStreams = [];

        document.querySelectorAll("video").forEach((video) => {
            if (!(video.srcObject instanceof MediaStream)) return;

            const stream = video.srcObject as MediaStream;

            if (!stream) return;

            stream.getTracks().forEach((track) => track.stop());

            video.srcObject = null;
        });

        document.querySelectorAll("canvas").forEach((canvas) => {
            const context = canvas.getContext("2d");

            if (!context) return;

            const stream = canvas.captureStream?.();

            if (!stream) return;

            stream.getTracks().forEach((track) => track.stop());
        });

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        stream?.getTracks().forEach((track) => track.stop());
    }
}
