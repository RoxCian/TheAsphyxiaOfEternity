import { Component, input, ChangeDetectionStrategy } from "@angular/core"
import { linkedToggle, toggleTransform } from "../../../../signals/transforms"

@Component({
    selector: "rb-colette",
    templateUrl: "./rb3-badge.component.html",
    styleUrls: ["./rb3-badge.component.sass"],
    host: {
        "[class.rb-badge]": "true",
        "[class.is-active]": "isActive()"
    },
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class Rb3BadgeComponent {
    readonly isActiveInput = input(false, { alias: "isActive", transform: toggleTransform })
    readonly isActive = linkedToggle(this.isActiveInput)
}
