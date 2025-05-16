import { NgClass, NgIf } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { TranslocoModule } from "@jsverse/transloco";
import { BehaviorSubject, debounceTime, map, merge, Observable, scan, Subject, takeUntil, finalize, switchMap } from "rxjs";

import commonPasswords from "./common-password-list";

@Component({
    imports: [TranslocoModule, NgIf, NgClass],
    selector: "password-strength",
    styleUrl: "./password-strength.component.scss",
    templateUrl: "./password-strength.component.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PasswordStrengthComponent),
            multi: true,
        },
    ],
})
export class PasswordStrengthComponent implements OnDestroy, OnChanges, ControlValueAccessor {
    private unsubscriber$ = new Subject<void>();
    private password$ = new BehaviorSubject<string | undefined>("");
    private overallScore$ = new BehaviorSubject<number>(0);
    private onTouched: () => void = () => {};
    private onChange: (value: number) => void = () => {};

    @Input() password?: string = "";
    @Input() minLength: number = 8;

    @Output() passwordStrength = new EventEmitter<number>();

    isExpanded = false;

    constructor(private _changeDetectorRef: ChangeDetectorRef) {
        this.setupStrengthCalculations();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes["password"]) return;

        if (!changes["password"].currentValue) {
            this.overallScore$.next(0);
            this.onChange(0);
            this.passwordStrength.emit(0);

            return;
        }

        this.password$.next(this.password);
    }

    get maxStrength(): number {
        return 128 / this.minLength + 5;
    }

    get passwordStrengthPercentage(): number {
        return Math.min(100, Math.ceil((this.overallScore$.value / this.maxStrength) * 100));
    }

    get commonPasswords(): string[] {
        return commonPasswords;
    }

    get strength(): number {
        return this.overallScore$.value;
    }

    ngOnDestroy(): void {
        this.unsubscriber$.next();
        this.unsubscriber$.complete();
    }

    private setupStrengthCalculations(): void {
        const debouncedPassword$ = this.password$.pipe(takeUntil(this.unsubscriber$), debounceTime(300));

        debouncedPassword$
            .pipe(
                takeUntil(this.unsubscriber$),
                switchMap(() => {
                    return merge(
                        this.getBaseStrength$(debouncedPassword$),
                        this.getLengthStrength$(debouncedPassword$),
                        this.getRepeatsStrength$(debouncedPassword$),
                        this.checkCommonPassword$(debouncedPassword$)
                    ).pipe(
                        scan((total, current) => total + current, 0),
                        map((score) => Math.max(0, score)),
                        finalize(() => {
                            this.onTouched();
                        })
                    );
                })
            )
            .subscribe({
                next: (score) => {
                    this.overallScore$.next(score);
                    this.onChange(score);
                    this.passwordStrength.emit(score);

                    this._changeDetectorRef.detectChanges();
                },
            });
    }

    private getBaseStrength$(password$: Observable<string | undefined> = this.password$) {
        return password$.pipe(
            takeUntil(this.unsubscriber$),
            map((password) => {
                if (!password) return 0;

                const hasUpperCase = /[A-Z]/.test(password);
                const hasLowerCase = /[a-z]/.test(password);
                const hasNumbers = /\d/.test(password);
                const hasSpecialChars = /[\p{L}\p{N}\p{P}\p{S}]/u.test(password);

                let strength = 0;

                if (hasUpperCase) strength += 2;
                if (hasLowerCase) strength += 2;
                if (hasNumbers) strength += 2;
                if (hasSpecialChars) strength += 2;

                return strength;
            })
        );
    }

    private getLengthStrength$(password$: Observable<string | undefined> = this.password$) {
        return password$.pipe(
            takeUntil(this.unsubscriber$),
            map((password) => {
                if (!password) return 0;

                const length = password.length;
                const minLength = this.minLength;

                if (length < minLength) return 0;

                return Math.floor(length / minLength);
            })
        );
    }

    private getRepeatsStrength$(password$: Observable<string | undefined> = this.password$) {
        return password$.pipe(
            takeUntil(this.unsubscriber$),
            map((password) => {
                if (!password) return 0;

                const repeats = password.match(/(.+)\1+/g);

                if (!repeats) return 0;

                const totalRepeats = repeats.reduce((sum, group) => sum + group.length - 1, 0);

                return Math.ceil(-(totalRepeats / 3));
            })
        );
    }

    private checkCommonPassword$(password$: Observable<string | undefined> = this.password$) {
        return password$.pipe(
            takeUntil(this.unsubscriber$),
            map((password) => {
                const commonPassword = this.commonPasswords.find((commonPassword) =>
                    new RegExp(commonPassword as string, "i").test(password as string)
                );

                return commonPassword ? -1 : 0;
            })
        );
    }

    registerOnChange(fn: (value: number) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    writeValue(value: number): void {
        if (value !== undefined && value !== null) {
            this.overallScore$.next(value);
            this._changeDetectorRef.detectChanges();
        }
    }

    toggleExpand(): void {
        this.isExpanded = !this.isExpanded;
    }
}
