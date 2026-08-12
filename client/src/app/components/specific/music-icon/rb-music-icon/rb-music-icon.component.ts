import { Component, input } from "@angular/core"
import { RbChartType, RbMusicResponse, RbVersion } from "rbweb"
import { toggleTransform } from "../../../../signals/transforms"
import { BungIntersectionService } from "../../../../services/bung/intersection.service"

@Component({
    selector: "rb-music-icon",
    templateUrl: "./rb-music-icon.component.html",
    styleUrl: "./rb-music-icon.component.sass",
    standalone: false,
    host: {
        "[class.is-impact]": "isImpact()"
    }
})
export class RbMusicIconComponent {
    readonly music = input<RbMusicResponse<RbVersion>>()
    readonly chartType = input<RbChartType<RbVersion> | RbChartType<RbVersion>[] | undefined>(undefined)
    readonly isImpact = input(false, { transform: toggleTransform })
    readonly isSelected = input(false, { transform: toggleTransform })
    readonly isVirtualized = input(false, { transform: toggleTransform })
    readonly isPlaceholder = input(false, { transform: toggleTransform })

    constructor(intersectionService: BungIntersectionService) {
        intersectionService.createGroup("rb-music-icon-img")
    }
}
