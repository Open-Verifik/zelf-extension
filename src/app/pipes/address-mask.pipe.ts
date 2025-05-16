import { Pipe, type PipeTransform } from "@angular/core";

@Pipe({
    name: "addressMask",
})
export class AddressMaskPipe implements PipeTransform {
    transform(value?: string): unknown {
        if (typeof value !== "string" || !value || !value.trim()) return "";

        const firstPart = value.slice(0, 8);
        const lastPart = value.slice(-8);

        return `${firstPart}...${lastPart}`;
    }
}
