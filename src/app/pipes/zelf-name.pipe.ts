import { Pipe, type PipeTransform } from "@angular/core";

@Pipe({
	name: "zelfName",
	standalone: true,
})
export class ZelfNamePipe implements PipeTransform {
	transform(value: string): unknown {
		return typeof value === "string" && value?.trim() ? value.toUpperCase() : "****.zelf";
	}
}
