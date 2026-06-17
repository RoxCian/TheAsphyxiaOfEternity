import { Component, input } from "@angular/core"
import { RbChartType, RbMusicResponse, RbVersion } from "rbweb"
import { BungPopupComponent } from "../../../bung/popup/popup.component"

@Component({
    selector: "rb-music-unlock-popup",
    standalone: false,
    templateUrl: "./rb-music-unlock-popup.component.html",
    styleUrl: "./rb-music-unlock-popup.component.sass",
    host: {
        "[class.use-default-popup-animation]": "true"
    }
})
export class RbMusicUnlockPopupComponent<TVersion extends RbVersion> extends BungPopupComponent {
    readonly version = input.required<TVersion>()
    readonly music = input.required<RbMusicResponse<TVersion>>()
    readonly chartType = input<RbChartType<TVersion> | RbChartType<TVersion>[] | undefined>()
}
