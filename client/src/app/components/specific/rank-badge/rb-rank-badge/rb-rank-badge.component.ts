import { Component, computed, input } from "@angular/core"
import { RbVersion } from "rbweb"
import { numeric, linkedToggle, toggleTransform } from "../../../../signals/transforms"
import { getRbRank } from "../../../../utils/rb-functions"

@Component({
    selector: "rb-rank",
    templateUrl: "./rb-rank-badge.component.html",
    styleUrls: ["./rb-rank-badge.component.sass"],
    host: {
        "[class.has-deco]": "hasDecoration()",
    },
    standalone: false
})
export class RbRankBadgeComponent {
    readonly version = input.required<RbVersion>()
    readonly achievementRate = input.required<number, numeric>({ transform: (v: numeric) => parseFloat(v as string) })
    readonly hasAnimation = input(false, { transform: toggleTransform })
    readonly hasDecoration = input(false, { transform: toggleTransform })
    readonly isVisibleInput = input(false, { alias: "isVisible", transform: toggleTransform })
    readonly isVisible = linkedToggle(this.isVisibleInput)
    readonly rank = computed(() => getRbRank(this.achievementRate(), this.version()))
}
