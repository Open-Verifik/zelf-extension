import { Pipe, type PipeTransform, ChangeDetectorRef, NgZone } from "@angular/core";

@Pipe({
	name: "timer",
	standalone: true,
	pure: false,
})
export class TimerPipe implements PipeTransform {
	private timer: number | null = null;

	constructor(private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone) {}

	transform(value: string, ...args: unknown[]): string {
		this.removeTimer();
		this.createTimer();

		const now = new Date().getTime();
		const target = new Date(value).getTime();
		const difference = target - now;

		if (difference <= 0) return "";

		const minutes = Math.floor((difference / (1000 * 60)) % 60);
		const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

		return `${hours} H ${minutes} M`;
	}

	private createTimer() {
		this.ngZone.runOutsideAngular(() => {
			this.timer = window.setInterval(() => {
				this.ngZone.run(() => this.changeDetectorRef.markForCheck());
			}, 1000);
		});
	}

	private removeTimer() {
		if (this.timer) {
			window.clearInterval(this.timer);
			this.timer = null;
		}
	}

	ngOnDestroy() {
		this.removeTimer();
	}
}
