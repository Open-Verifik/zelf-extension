import { Pipe, type PipeTransform } from "@angular/core";

@Pipe({
    name: "addressMask",
    standalone: true,
})
export class AddressMaskPipe implements PipeTransform {
    transform(value?: string): unknown {
        if (typeof value !== "string" || !value || !value.trim()) return "";

        const firstPart = value.slice(0, 4);
        const lastPart = value.slice(-4);

        return `${firstPart}...${lastPart}`;
    }
}
