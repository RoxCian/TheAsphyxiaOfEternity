import { Component, input, ChangeDetectionStrategy } from "@angular/core"

@Component({
    selector: "rb6-just-collect",
    templateUrl: "./rb6-just-collect-rate.component.html",
    styleUrls: ["./rb6-just-collect-rate.component.sass"],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Rb6JustCollectRateComponent {
    readonly red = input.required<number>()
    readonly blue = input.required<number>()
}
