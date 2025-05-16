import { Pipe, type PipeTransform } from "@angular/core";

export type DiscountType = "" | "percentage" | "amount";

@Pipe({
    name: "discount",
    pure: false,
})
export class DiscountPipe implements PipeTransform {
    transform(value: number, ...args: [number, DiscountType]): number | string {
        const discountType = args[1];

        if (!discountType) return value;

        const discountValue = (args[0] || 0) as number;

        let discountedResult = value;

        if (discountType === "percentage") {
            discountedResult = value - (value * discountValue) / 100;
        } else if (discountType === "amount") {
            discountedResult = value - discountValue;
        }

        return Math.max(discountedResult, 0);
    }
}
