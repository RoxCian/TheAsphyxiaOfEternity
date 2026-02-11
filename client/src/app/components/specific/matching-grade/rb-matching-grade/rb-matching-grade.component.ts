import { Component, input } from "@angular/core"
import { RbVersion } from "server/models/shared/web"

@Component({
    selector: "rb-matching-grade",
    templateUrl: "./rb-matching-grade.component.html",
    styleUrl: "./rb-matching-grade.component.sass",
    host: {
        "[class]": "'rb' + version() + ' is-' + design()"
    },
    standalone: false
})
export class RbMatchingGradeComponent {
    readonly version = input.required<RbVersion>()
    readonly matchingGrade = input.required<number>()
    readonly design = input<"normal" | "white">("normal")
}
