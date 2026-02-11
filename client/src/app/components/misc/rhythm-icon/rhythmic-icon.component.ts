import { Component, input } from "@angular/core"

@Component({
    selector: "rhythmic-icon",
    templateUrl: "./rhythmic-icon.component.html",
    styleUrls: ["./rhythmic-icon.component.sass"],
    standalone: false
})
export class RhythmicIconComponent {
    readonly bpm = input(120, { transform: (v: number | string) => typeof v === "number" ? v : parseInt(v) })
}
