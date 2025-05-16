import { Directive, Output, EventEmitter, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector: "[dragAndDrop]",
})
export class DragAndDropDirective {
    @HostBinding("class.drag-and-drop--active") fileOver: boolean = false;

    @Output() fileDropped = new EventEmitter<any>();

    @HostListener("dragover", ["$event"]) onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.fileOver = true;
    }

    @HostListener("dragleave", ["$event"]) public onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.fileOver = false;
    }

    @HostListener("drop", ["$event"]) public onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.fileOver = false;

        let files = event.dataTransfer?.files;

        if (!files || files.length === 0) return;

        this.fileDropped.emit(files);
    }
}
