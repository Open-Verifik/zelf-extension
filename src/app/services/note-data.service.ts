import { Injectable } from "@angular/core";
import { NoteItem } from "../models/zelf-key-item.model";

@Injectable({
    providedIn: "root",
})
export class NoteDataService {
    private currentNote: NoteItem | null = null;

    setCurrentNote(note: NoteItem): void {
        this.currentNote = note;
    }

    getCurrentNote(): NoteItem | null {
        return this.currentNote;
    }

    clearCurrentNote(): void {
        this.currentNote = null;
    }
}
