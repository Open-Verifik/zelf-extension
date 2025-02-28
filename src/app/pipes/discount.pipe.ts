import { Pipe, type PipeTransform } from "@angular/core";

export type DiscountType = "" | "percentage" | "fixed";

@Pipe({
	name: "discount",
	standalone: true,
})
export class DiscountPipe implements PipeTransform {
	transform(value: number, ...args: [number, "" | "percentage" | "fixed"]): number | string {
		const discountType = args[1];

		if (!discountType) return value;

		const discountValue = (args[0] || 0) as number;

		let discountedResult = value;

		if (discountType === "percentage") {
			discountedResult = value - (value * discountValue) / 100;
		} else if (discountType === "fixed") {
			discountedResult = value - discountValue;
		}

		return Math.max(discountedResult, 0);
	}
}
