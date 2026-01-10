import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Router, type CanActivateFn } from "@angular/router";
import { NoteDataService } from "../services/note-data.service";

export const ZelfKeysNoteGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const _noteDataService = inject(NoteDataService);

    if (!_noteDataService.getCurrentNote()) {
        router.navigate(["/zelf-keys/notes"], { replaceUrl: true });

        return false;
    }

    return true;
};
