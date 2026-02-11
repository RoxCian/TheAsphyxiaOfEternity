import { Component, ViewEncapsulation, input } from "@angular/core"
import { BungInsertionContent } from "../../../utils/bung"
import { toggleTransform } from "../../../signals/transforms"

@Component({
    selector: "bung-divider",
    templateUrl: "./divider.component.html",
    styleUrls: ["./divider.component.sass"],
    encapsulation: ViewEncapsulation.None,
    host: {
        "[class.end-to-start]": "promptLayout() === 'end'",
        "[class.is-vertical]": "isVertical()"
    },
    standalone: false
})
export class BungDividerComponent {
    readonly isVertical = input(false, { transform: toggleTransform })
    readonly prompt = input<BungInsertionContent>()
    readonly promptContext = input<any>()
    readonly promptLayout = input<PromptLayout>("center")
}
type PromptLayout = "start" | "center" | "end"