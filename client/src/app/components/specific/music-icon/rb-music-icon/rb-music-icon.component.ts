import { Component, input } from "@angular/core"
import { RbChartType, RbMusicResponse, RbVersion } from "server/models/shared/web"
import { toggleTransform } from "../../../../signals/transforms"
import { BungIntersectionService } from "../../../../services/bung/intersection.service"

@Component({
    selector: "rb-music-icon",
    templateUrl: "./rb-music-icon.component.html",
    styleUrl: "./rb-music-icon.component.sass",
    standalone: false,
})
export class RbMusicIconComponent {
    readonly music = input.required<RbMusicResponse<RbVersion>>()
    readonly chartType = input<RbChartType<RbVersion> | undefined>(undefined)
    readonly isVirtualized = input(false, { transform: toggleTransform })

    constructor(intersectionService: BungIntersectionService) {
        intersectionService.createGroup("rb-music-icon-img")
    }
}
