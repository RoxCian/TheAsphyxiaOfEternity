import { Component, input, ChangeDetectionStrategy } from "@angular/core"

@Component({
    selector: "lets-play",
    templateUrl: "./lets-play.component.html",
    styleUrls: ["./lets-play.component.sass"],
    host: {
        "[class.has-text-gray]": "true",
        "[class.has-text-centered]": "true"
    },
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class LetsPlayComponent {
    readonly text = input<string | string[]>("Nothing's here yet. Let's play!")
}
