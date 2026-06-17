import { Component, input } from "@angular/core"
import { RbVersion } from "rbweb"

@Component({
    selector: "rb-player-icon",
    imports: [],
    templateUrl: "./rb-player-icon.component.html",
    styleUrl: "./rb-player-icon.component.sass",
})
export class RbPlayerIconComponent {
    readonly version = input.required<RbVersion>()
    readonly iconId = input<number | undefined>()
    readonly characterId = input<number | undefined>()
}
