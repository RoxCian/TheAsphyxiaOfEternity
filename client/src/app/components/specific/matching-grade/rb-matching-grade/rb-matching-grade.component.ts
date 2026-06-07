import { Component, input, ChangeDetectionStrategy } from "@angular/core"
import { RbVersion } from "rbweb"

@Component({
    selector: "rb-matching-grade",
    templateUrl: "./rb-matching-grade.component.html",
    styleUrl: "./rb-matching-grade.component.sass",
    host: {
        "[class]": "'rb' + version() + ' is-' + design()"
    },
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class RbMatchingGradeComponent {
    readonly version = input.required<RbVersion>()
    readonly matchingGrade = input.required<number>()
    readonly design = input<"normal" | "white">("normal")
}
