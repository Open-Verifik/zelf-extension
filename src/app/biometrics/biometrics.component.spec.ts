import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BiometricsLoginComponent } from "./biometrics.component";

describe("BiometricsLoginComponent", () => {
	let component: BiometricsLoginComponent;
	let fixture: ComponentFixture<BiometricsLoginComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [BiometricsLoginComponent],
		});
		fixture = TestBed.createComponent(BiometricsLoginComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
