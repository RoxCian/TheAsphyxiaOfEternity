import { Component, ViewEncapsulation, computed, input } from "@angular/core"
import { RbChartType, RbClearTypeLiteral, RbVersion } from "rbweb"
import { linkedToggle, toggleTransform } from "../../../../signals/transforms"
import { BungInsertionContent } from "../../../../utils/bung"

const HTransitionParams = { width: "0", height: "*", translate: "translateX(-120%)" }
const VTransitionParams = { width: "*", height: "0", translate: "translateY(-120%)" }

@Component({
    selector: "rb-chart-lamp",
    templateUrl: "./rb-chart-lamp.component.html",
    styleUrl: "./rb-chart-lamp.component.sass",
    encapsulation: ViewEncapsulation.None,
    host: {
        "[class]": "clearType()",
        "[class.is-vertical]": "isVertical()",
        "[class.no-clear-type]": "!clearType()"
    },
    standalone: false
})
export class RbChartLampComponent<TVersion extends RbVersion> {
    readonly chartType = input.required<RbChartType<TVersion>>()
    readonly clearType = input.required<RbClearTypeLiteral<TVersion>>()
    readonly version = input.required<TVersion>()
    readonly isVerticalInput = input(false, { alias: "isVertical", transform: toggleTransform })
    readonly isShortenedInput = input(false, { alias: "isShortened", transform: toggleTransform })
    readonly isVisibleInput = input(false, { alias: "isVisible", transform: toggleTransform })
    readonly customizedText = input<string | undefined>()
    readonly isVertical = linkedToggle(this.isVerticalInput)
    readonly isShortened = linkedToggle(this.isShortenedInput)
    readonly isVisible = linkedToggle(this.isVisibleInput)
    readonly transitionParams = computed(() => ({ value: `${this.isVisible()}`, params: this.isVertical() ? VTransitionParams : HTransitionParams }))
    readonly clearTypeName = computed(() => {
        if (this.customizedText() != undefined) return this.customizedText()
        if (this.isShortened()) return this.clearType()?.toUpperCase() ?? "-"
        switch (this.clearType()) {
            case "exc": return "EXCELLENT"
            case "1miss": return "1 MISS CLEAR"
            case "2miss": return "2 MISS CLEAR"
            case "fc": return "FULL COMBO"
            case "shc": return "S-HARD CLEAR"
            case "hc": return "HARD CLEAR"
            case "c": return "CLEAR"
            case "f": return "FAILED"
            default: return "NOT PLAYED"
        }
    })

}
