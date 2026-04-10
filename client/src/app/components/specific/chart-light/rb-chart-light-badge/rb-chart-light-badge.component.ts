import { Component, computed, input, ViewEncapsulation } from "@angular/core"
import { RbChartType, RbClearTypeLiteral, RbVersion } from "rbweb"
import { toggleTransform, linkedToggle } from "../../../../signals/transforms"

@Component({
    selector: "rb-chart-light-badge",
    standalone: false,
    templateUrl: "./rb-chart-light-badge.component.html",
    styleUrl: "./rb-chart-light-badge.component.sass",
    encapsulation: ViewEncapsulation.None,
    host: {
        "[class]": "clearType()",
        "[class.no-clear-type]": "!clearType()"
    }
})
export class RbChartLightBadgeComponent<TVersion extends RbVersion> {
    readonly chartType = input.required<RbChartType<TVersion>>()
    readonly clearType = input.required<RbClearTypeLiteral<TVersion>>()
    readonly version = input.required<TVersion>()
    readonly isVisibleInput = input(false, { alias: "isVisible", transform: toggleTransform })
    readonly isVisible = linkedToggle(this.isVisibleInput)
}
