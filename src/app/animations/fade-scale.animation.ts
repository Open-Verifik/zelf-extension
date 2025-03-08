import { trigger, animate, transition, style } from "@angular/animations";

export const fadeScale = trigger("fadeScale", [
    transition(":enter", [
        style({ opacity: 0, transform: "scale(0.5)" }),
        animate("0.1s cubic-bezier(0.25, 0.4, 0.7, 1)", style({ opacity: 1, transform: "scale(1)" })),
    ]),
    transition(":leave", [
        style({ opacity: 1, transform: "scale(1)" }),
        animate("0.1s cubic-bezier(0.25, 0.4, 0.7, 1)", style({ opacity: 0, transform: "scale(0.5)" })),
    ]),
]);
