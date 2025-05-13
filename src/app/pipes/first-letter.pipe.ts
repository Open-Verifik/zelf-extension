import { Pipe, type PipeTransform } from "@angular/core";

@Pipe({
    name: "firstLetter",
})
export class FirstLetterPipe implements PipeTransform {
    transform(value?: string): unknown {
        return typeof value === "string" && value?.trim() ? value.charAt(0).toUpperCase() : "";
    }
}
