import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root",
})
export class PasswordDataService {
	private currentPassword: any = null;

	setCurrentPassword(password: any): void {
		this.currentPassword = password;
	}

	getCurrentPassword(): any {
		return this.currentPassword;
	}

	clearCurrentPassword(): void {
		this.currentPassword = null;
	}
}
