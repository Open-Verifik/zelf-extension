import { Injectable } from "@angular/core";

export interface MediaTrackSupportedConstraintsExtended extends MediaTrackSupportedConstraints {
    zoom?: boolean;
}

export interface MediaTrackConstraintSetExtended extends MediaTrackConstraintSet {
    zoom?: ConstrainULong;
}

@Injectable({
    providedIn: "root",
})
export class MediaStreamService {
    activeStreams: MediaStream[] = [];

    async startStream(constraints: MediaStreamConstraints): Promise<MediaStream> {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        this.activeStreams.push(stream);

        return stream;
    }

    addStream(stream: MediaStream | null): void {
        if (!stream) return;

        this.activeStreams.push(stream);
    }

    stopStream(stream: MediaStream | null): void {
        if (!stream) return;

        stream.getTracks().forEach((track) => track.stop());

        this.activeStreams = this.activeStreams.filter((activeStream) => activeStream !== stream);
    }

    stopAllStreams(): void {
        this.activeStreams.forEach((stream) => {
            stream?.getTracks().forEach((track) => track.stop());
        });

        this.activeStreams = [];
    }
}
