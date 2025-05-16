import { Pipe, type PipeTransform, ChangeDetectorRef, NgZone } from "@angular/core";
import { TranslocoService } from "@jsverse/transloco";

@Pipe({
    name: "timer",
    pure: false,
})
export class TimerPipe implements PipeTransform {
    private timer: number | null = null;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _ngZone: NgZone,
        private _translocoService: TranslocoService
    ) {}

    transform(value?: string, ...args: unknown[]): string {
        if (!value) return "";

        this.removeTimer();
        this.createTimer();

        const now = new Date().getTime();
        const target = new Date(value).getTime();
        const difference = target - now;

        if (difference <= 0) return "";

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));

        if (days > 0) return `${days} ${this._translocoService.translate("common.days")}`;

        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

        return `${hours} H ${minutes} M`;
    }

    private createTimer() {
        this._ngZone.runOutsideAngular(() => {
            this.timer = window.setInterval(() => {
                this._ngZone.run(() => this._changeDetectorRef.markForCheck());
            }, 1000);
        });
    }

    private removeTimer() {
        if (!this.timer) return;

        window.clearInterval(this.timer);

        this.timer = null;
    }

    ngOnDestroy() {
        this.removeTimer();
    }
}
