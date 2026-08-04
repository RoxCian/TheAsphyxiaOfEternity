import { Component, computed, inject, input } from "@angular/core"
import { RbVersion, RbColor } from "rbweb"
import { getPlayerEntry, playerEntryEquals } from "./rb-player-name-helper"
import { toggleTransform } from "../../../../signals/transforms"
import { RbProfileService } from "../../../../services/specified/rb-profile.service"
import { RbLanguageService } from "../../../../services/specified/rb-language.service"
import { BungBreakpointService } from "../../../../services/bung/breakpoint.service"

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
    readonly musicId = input<number | undefined>()
    readonly playerEntry = computed(() => getPlayerEntry(this.version(), this.name(), this.cpuId(), this.musicId()), { equal: playerEntryEquals })
    readonly nameDisplay = computed(() => this.isRival() ? this.isShowCompleteName() ? (this.specialTitle() ?? this.nameComputed()) : this.nameComputed() : this.nameComputed() || this.profileService.rbProfiles()[this.version()]?.name || "You")
    private readonly nameComputed = computed(() =>
        this.breakpointService.breakpointsToggled.mobile() ? this.playerEntry().abbr ?? this.playerEntry().name :
            this.langService.currentLanguage() === "en" ? this.playerEntry().name : this.playerEntry().nameOrig ?? this.playerEntry().name)
    readonly specialClass = computed(() => this.playerEntry().tagClass)
    readonly specialTitle = computed(() => this.langService.currentLanguage() === "en" ? this.playerEntry().title : this.playerEntry().titleOrig ?? this.playerEntry().title)
    private readonly profileService = inject(RbProfileService)
    private readonly langService = inject(RbLanguageService)
    private readonly breakpointService = inject(BungBreakpointService)
}
