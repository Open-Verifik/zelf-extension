import { Pipe, type PipeTransform } from "@angular/core";

@Pipe({
    name: "truncateNumber",
})
export class TruncateNumberPipe implements PipeTransform {
    transform(value: number): unknown {
        if (value >= 1e9) {
            return `${(value / 1e9).toFixed(2)}B`;
        } else if (value >= 1e6) {
            return `${(value / 1e6).toFixed(2)}M`;
        } else if (value >= 1e3) {
            return `${(value / 1e3).toFixed(2)}K`;
        } else if (value >= 1) {
            return `${value.toFixed(2)}M`;
        } else {
            return `${value.toFixed(2)}`;
        }
    }
}
