import { Component, input } from "@angular/core"

@Component({
    selector: "rb6-just-collect",
    templateUrl: "./rb6-just-collect-rate.component.html",
    styleUrls: ["./rb6-just-collect-rate.component.sass"],
    standalone: false
})
export class Rb6JustCollectRateComponent {
    readonly red = input.required<number>()
    readonly blue = input.required<number>()
}
