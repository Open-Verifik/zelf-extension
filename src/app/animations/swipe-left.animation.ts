import { trigger, animate, transition, style } from "@angular/animations";

export const swipeLeft = trigger("swipeLeft", [
    transition(":enter", [
        style({ opacity: 0, transform: "translate3d(100%, 0, 0)" }),
        animate("0.45s cubic-bezier(0.25, 0.4, 0.7, 1)", style({ opacity: 1, transform: "translate3d(0, 0, 0)" })),
    ]),
    transition(":leave", [
        style({ opacity: 1, transform: "translate3d(0, 0, 0)" }),
        animate("0.45s cubic-bezier(0.25, 0.4, 0.7, 1)", style({ opacity: 0, transform: "translate3d(-100%, 0, 0)" })),
    ]),
]);
