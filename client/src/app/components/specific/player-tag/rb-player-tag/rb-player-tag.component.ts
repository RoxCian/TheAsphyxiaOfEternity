import { Component, computed, inject, input } from "@angular/core"
import { RbVersion, RbColor } from "rbweb"
import { getPlayerEntry, playerEntryEquals } from "./rb-player-name-helper"
import { BungThemeService } from "../../../../services/bung/theme.service"
import { toggleTransform } from "../../../../signals/transforms"
import { RbProfileService } from "../../../../services/specified/rb-profile.service"

@Component({
    selector: "rb-player",
    templateUrl: "./rb-player-tag.component.html",
    styleUrls: ["./rb-player-tag.component.sass"],
    host: {
        "[class.tags]": "true",
        "[class.has-addons]": "true",
        "[attr.lang]": "'jp'"
    },
    standalone: false
})
export class RbPlayerTagComponent {
    readonly version = input.required<RbVersion>()
    readonly name = input<string | undefined>(undefined)
    readonly cpuId = input<number | undefined>(undefined)
    readonly color = input.required<RbColor>()
    readonly isRival = input(false, { transform: toggleTransform })
    readonly isShowCompleteName = input(false, { transform: toggleTransform })
    readonly isHideMatchingGrade = input(false, { transform: toggleTransform })
    readonly matchingGrade = input(0)
    readonly tagTheme = computed(() => this.themeService.theme() === "light" ? "dark" : "light")
    readonly musicId = input<number | undefined>()
    readonly playerEntry = computed(() => getPlayerEntry(this.version(), this.name(), this.cpuId(), this.musicId()), { equal: playerEntryEquals })
    readonly nameDisplay = computed(() => this.isRival() ? this.isShowCompleteName() ? (this.specialTitle() ?? this.playerEntry().name) : this.playerEntry().name : this.profileService.rbProfiles()[this.version()]?.name ?? "You")
    readonly specialClass = computed(() => this.playerEntry().tagClass)
    readonly specialTitle = computed(() => this.playerEntry().title)
    private readonly profileService = inject(RbProfileService)

    private readonly themeService = inject(BungThemeService)
}
