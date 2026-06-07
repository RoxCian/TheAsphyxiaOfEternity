import { Component, ViewEncapsulation, computed, input } from "@angular/core"
import { RbByword, RbBywordRarity } from "rbweb"
import { toggleTransform } from "../../../../signals/transforms"

@Component({
    selector: "rb-byword-tag",
    templateUrl: "./rb-byword-tag.component.html",
    styleUrls: ["./rb-byword-tag.component.sass"],
    encapsulation: ViewEncapsulation.None,
    host: {
        "[class.tags]": "true",
        "[class.has-addons]": "true"
    },
    standalone: false
})
export class RbBywordTagComponent {
    readonly leftByword = input<RbByword>()
    readonly rightByword = input<RbByword>()
    readonly leftBywordText = computed(() => {
        const byword = this.leftByword()
        if (typeof byword === "string") return byword
        return byword?.byword
    })
    readonly rightBywordText = computed(() => {
        const byword = this.rightByword()
        if (typeof byword === "string") return byword
        return byword?.byword
    })
    readonly leftRarity = computed(() => this.leftByword()?.rarity ?? RbBywordRarity.none)
    readonly rightRarity = computed(() => this.rightByword()?.rarity ?? RbBywordRarity.none)
    readonly noLeftPart = input(false, { transform: toggleTransform })
    readonly noRightPart = input(false, { transform: toggleTransform })
}
