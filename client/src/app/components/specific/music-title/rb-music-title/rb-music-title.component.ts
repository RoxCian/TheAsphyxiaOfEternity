import { Component, ViewEncapsulation, input } from "@angular/core"
import { RbChartType, RbMusicInfo, RbMusicVariation, RbVersion } from "rbweb"
import { linkedToggle, toggleTransform } from "../../../../signals/transforms"

@Component({
    selector: "rb-music-title",
    templateUrl: "./rb-music-title.component.html",
    styleUrls: ["./rb-music-title.component.sass"],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class RbMusicTitleComponent<TVersion extends RbVersion> {
    readonly music = input.required<RbMusicInfo>()
    readonly variation = input<RbMusicVariation<TVersion, RbChartType<TVersion>> | undefined>()
    readonly isMarqueedisabledInput = input(false, { alias: "isMarqueedisabled", transform: toggleTransform })
    readonly isMarqueedisabled = linkedToggle(this.isMarqueedisabledInput)
    readonly contentAlign = input<"start" | "center" | "end">("start")
}
